import { classify } from './lib/classify.js';
import * as store from './lib/storage.js';

const IDLE_SECONDS = 60;
const GRACE_MINUTES = 15;

// ---------------------------------------------------------------------------
// Session bookkeeping
//
// We record session start/end timestamps rather than incrementing an in-memory
// counter on a timer. Two reasons: the MV3 worker dies at ~30s idle and would
// take a counter with it, and chrome.alarms has a 1-minute floor which is far
// too coarse to time a scroll session accurately.
// ---------------------------------------------------------------------------

async function closeSession(endAt = Date.now()) {
  const session = await store.getSession();
  if (!session) return;
  const seconds = Math.max(0, Math.round((endAt - session.startedAt) / 1000));
  if (seconds > 0) await store.addSeconds(session.category, seconds);
  await store.setSession(null);
}

async function openSession(categoryId) {
  await store.setSession({ category: categoryId, startedAt: Date.now() });
}

async function activeFocusedTab() {
  let win;
  try {
    win = await chrome.windows.getLastFocused();
  } catch {
    return null;
  }
  // getLastFocused still returns a window when Chrome itself is in the
  // background — focused tells us whether the user is actually looking at it.
  if (!win || !win.focused) return null;
  const [tab] = await chrome.tabs.query({ active: true, windowId: win.id });
  return tab || null;
}

// Single source of truth: work out what the user is looking at *right now*,
// and make the open session match it. Every event handler just calls this.
async function reconcile() {
  const settings = await store.getSettings();
  if (!settings.enabled) {
    await closeSession();
    await refreshBadge();
    return;
  }

  let target = null;
  const idleState = await chrome.idle.queryState(IDLE_SECONDS);
  if (idleState === 'active') {
    const tab = await activeFocusedTab();
    if (tab && tab.url) target = classify(tab.url, settings.whitelist);
  }

  const current = await store.getSession();
  const currentId = current ? current.category : null;
  const nextId = target ? target.id : null;
  if (currentId === nextId) {
    await refreshBadge();
    return;
  }

  await closeSession();
  if (nextId) await openSession(nextId);
  await refreshBadge();
}

// ---------------------------------------------------------------------------
// Badge
// ---------------------------------------------------------------------------

async function refreshBadge() {
  const minutes = Math.floor((await store.todayTotalLive()) / 60);
  const text = minutes < 1 ? '' : minutes < 100 ? String(minutes) : `${Math.floor(minutes / 60)}h`;
  await chrome.action.setBadgeText({ text });
  if (text) {
    const color = minutes >= 60 ? '#b3372c' : minutes >= 30 ? '#c98a1e' : '#4f7d5a';
    await chrome.action.setBadgeBackgroundColor({ color });
  }
}

// ---------------------------------------------------------------------------
// Friction — the actual product. The dashboard is the supporting feature.
// ---------------------------------------------------------------------------

async function getGrace() {
  const { grace } = await chrome.storage.session.get('grace');
  return grace || {};
}

async function setGrace(host) {
  const grace = await getGrace();
  grace[host] = Date.now() + GRACE_MINUTES * 60_000;
  await chrome.storage.session.set({ grace });
}

function send(tabId, message) {
  chrome.tabs.sendMessage(tabId, message).catch(() => {});
}

async function maybeFriction(tab, target, settings) {
  if (!settings.enabled || !(settings.frictionSeconds > 0)) return;
  const grace = await getGrace();
  if (grace[target.host] && grace[target.host] > Date.now()) return;

  send(tab.id, {
    type: 'BRAINROT_FRICTION',
    payload: {
      goal: settings.goal,
      seconds: settings.frictionSeconds,
      label: target.label,
      host: target.host,
      todaySeconds: await store.todayTotalLive(),
    },
  });
}

async function maybeThresholdNudge() {
  const settings = await store.getSettings();
  const every = Number(settings.nudgeAfterMinutes) || 0;
  if (!settings.enabled || every <= 0) return;

  const today = store.todayKey();
  const minutes = Math.floor((await store.todayTotalLive()) / 60);
  const level = Math.floor(minutes / every);

  const { nudge } = await chrome.storage.session.get('nudge');
  const seen = nudge && nudge.day === today ? nudge.level : 0;
  if (level < 1 || level <= seen) {
    if (!nudge || nudge.day !== today) {
      await chrome.storage.session.set({ nudge: { day: today, level: 0 } });
    }
    return;
  }
  await chrome.storage.session.set({ nudge: { day: today, level } });

  const tab = await activeFocusedTab();
  if (!tab || !tab.url) return;
  if (!classify(tab.url, settings.whitelist)) return;
  send(tab.id, { type: 'BRAINROT_TOAST', payload: { minutes, goal: settings.goal } });
}

// ---------------------------------------------------------------------------
// Periodic flush: rolls the open session into storage without ending it, so a
// worker death or browser crash loses at most a minute, and the badge stays live.
// ---------------------------------------------------------------------------

async function flush() {
  const session = await store.getSession();
  if (session) {
    const now = Date.now();
    const seconds = Math.max(0, Math.round((now - session.startedAt) / 1000));
    if (seconds > 0) {
      await store.addSeconds(session.category, seconds);
      await store.setSession({ ...session, startedAt: now });
    }
  }
  await refreshBadge();
  await maybeThresholdNudge();
}

// ---------------------------------------------------------------------------
// Wiring
// ---------------------------------------------------------------------------

// Top-level: runs on every worker wake, not just install/startup, because the
// worker is torn down and rebuilt constantly and this setting must survive that.
// The alarm deliberately does NOT live here — alarms.create() replaces an
// existing alarm of the same name, so re-creating it on every wake would keep
// resetting its schedule and it might never fire.
chrome.idle.setDetectionInterval(IDLE_SECONDS);

async function init() {
  await chrome.alarms.create('flush', { periodInMinutes: 1 });
  await store.setSession(null);
  await reconcile();
}

chrome.runtime.onInstalled.addListener(init);
chrome.runtime.onStartup.addListener(init);

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'flush') flush();
});

chrome.tabs.onActivated.addListener(async ({ tabId }) => {
  await reconcile();
  const tab = await chrome.tabs.get(tabId).catch(() => null);
  if (!tab || !tab.url) return;
  const settings = await store.getSettings();
  const target = classify(tab.url, settings.whitelist);
  if (target) await maybeFriction(tab, target, settings);
});

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (!tab.active) return;
  if (!changeInfo.url && changeInfo.status !== 'complete') return;
  await reconcile();
  // Only a real URL change earns friction — otherwise every SPA re-render nags.
  if (!changeInfo.url || !tab.url) return;
  const settings = await store.getSettings();
  const target = classify(tab.url, settings.whitelist);
  if (target) await maybeFriction(tab, target, settings);
});

chrome.windows.onFocusChanged.addListener(() => {
  reconcile();
});

chrome.idle.onStateChanged.addListener(async (state) => {
  if (state === 'active') {
    await reconcile();
    return;
  }
  // Chrome reports idle *after* IDLE_SECONDS of no input, so those seconds
  // already happened with nobody watching. Don't bill them.
  await closeSession(Date.now() - IDLE_SECONDS * 1000);
  await refreshBadge();
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  (async () => {
    if (message?.type === 'BRAINROT_READY' && sender.tab?.url) {
      // Covers the race where the push arrives before the content script listens.
      const settings = await store.getSettings();
      const target = classify(sender.tab.url, settings.whitelist);
      if (target) await maybeFriction(sender.tab, target, settings);
    } else if (message?.type === 'BRAINROT_PASSED' && message.host) {
      await setGrace(message.host);
    } else if (message?.type === 'BRAINROT_LEAVE' && sender.tab?.id) {
      await closeSession();
      chrome.tabs.remove(sender.tab.id).catch(() => {});
    } else if (message?.type === 'BRAINROT_SETTINGS_CHANGED') {
      await reconcile();
    }
    sendResponse({ ok: true });
  })();
  return true;
});
