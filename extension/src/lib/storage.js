// Storage schema.
//
// Shape is deliberately aggregation-ready: { "2026-07-17": { tiktok: 1840 } }.
// Bucketed daily totals by category. No URLs, no timestamps, no per-event rows.
// That means a future opt-in "contribute anonymised totals" feature can send a
// day record as-is without a scrubbing step — and it means a leak of this data
// reveals nothing but minutes-per-category.

const DEFAULTS = {
  enabled: true,
  goal: '',
  frictionSeconds: 5,
  nudgeAfterMinutes: 30,
  whitelist: [],
};

const KEEP_DAYS = 90;

export function todayKey(d = new Date()) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function dayKeyOffset(offsetDays) {
  const d = new Date();
  d.setDate(d.getDate() - offsetDays);
  return todayKey(d);
}

export async function getSettings() {
  const { settings } = await chrome.storage.local.get('settings');
  return { ...DEFAULTS, ...(settings || {}) };
}

export async function setSettings(patch) {
  const next = { ...(await getSettings()), ...patch };
  await chrome.storage.local.set({ settings: next });
  return next;
}

export async function getDays() {
  const { days } = await chrome.storage.local.get('days');
  return days || {};
}

export async function addSeconds(category, seconds) {
  if (!category || !(seconds > 0)) return;
  const days = await getDays();
  const key = todayKey();
  if (!days[key]) days[key] = {};
  days[key][category] = (days[key][category] || 0) + seconds;

  const keys = Object.keys(days).sort();
  while (keys.length > KEEP_DAYS) delete days[keys.shift()];

  await chrome.storage.local.set({ days });
}

// Open session lives in storage.session, not a module variable — MV3 kills the
// service worker after ~30s idle and a module variable dies with it. Session
// storage survives worker restarts and clears on browser close.
export async function getSession() {
  const { session } = await chrome.storage.session.get('session');
  return session || null;
}

export async function setSession(session) {
  if (session) await chrome.storage.session.set({ session });
  else await chrome.storage.session.remove('session');
}

export function dayTotal(day) {
  return Object.values(day || {}).reduce((a, b) => a + b, 0);
}

function elapsed(session) {
  return Math.max(0, Math.round((Date.now() - session.startedAt) / 1000));
}

// Stored totals plus whatever the currently-open session has accrued but not flushed.
export async function todayBreakdownLive() {
  const days = await getDays();
  const day = { ...(days[todayKey()] || {}) };
  const session = await getSession();
  if (session) day[session.category] = (day[session.category] || 0) + elapsed(session);
  return day;
}

export async function todayTotalLive() {
  return dayTotal(await todayBreakdownLive());
}

export async function lastNDays(n) {
  const days = await getDays();
  const live = await todayBreakdownLive();
  const out = [];
  for (let i = n - 1; i >= 0; i--) {
    const key = dayKeyOffset(i);
    const breakdown = i === 0 ? live : days[key] || {};
    out.push({ key, breakdown, total: dayTotal(breakdown) });
  }
  return out;
}

export async function clearAll() {
  await chrome.storage.local.remove('days');
  await chrome.storage.session.remove(['session', 'nudge', 'grace']);
}

export async function exportPayload() {
  const [days, settings] = await Promise.all([getDays(), getSettings()]);
  return {
    exportedAt: new Date().toISOString(),
    schema: 'brainrot-meter/day-totals-v1',
    note: 'Seconds per category per local calendar day. No URLs or event timestamps are ever recorded.',
    goal: settings.goal || null,
    days,
  };
}
