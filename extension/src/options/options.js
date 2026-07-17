import * as store from '../lib/storage.js';

const $ = (id) => document.getElementById(id);

let flashTimer = null;
function flash(text) {
  const el = $('saved');
  el.textContent = text;
  el.classList.add('show');
  clearTimeout(flashTimer);
  flashTimer = setTimeout(() => el.classList.remove('show'), 1600);
}

async function load() {
  const settings = await store.getSettings();
  $('enabled').checked = settings.enabled;
  $('goal').value = settings.goal;
  $('frictionSeconds').value = settings.frictionSeconds;
  $('nudgeAfterMinutes').value = settings.nudgeAfterMinutes;
  $('whitelist').value = (settings.whitelist || []).join('\n');
}

function clamp(value, min, max, fallback) {
  const n = Number(value);
  return Number.isFinite(n) ? Math.min(max, Math.max(min, Math.round(n))) : fallback;
}

async function save() {
  await store.setSettings({
    enabled: $('enabled').checked,
    goal: $('goal').value.trim(),
    frictionSeconds: clamp($('frictionSeconds').value, 0, 30, 5),
    nudgeAfterMinutes: clamp($('nudgeAfterMinutes').value, 0, 600, 30),
    whitelist: $('whitelist').value
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean),
  });
  chrome.runtime.sendMessage({ type: 'BRAINROT_SETTINGS_CHANGED' }).catch(() => {});
  flash('Saved');
}

for (const id of ['enabled', 'goal', 'frictionSeconds', 'nudgeAfterMinutes', 'whitelist']) {
  $(id).addEventListener('change', save);
}

$('export').addEventListener('click', async () => {
  const payload = await store.exportPayload();
  const url = URL.createObjectURL(new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' }));
  const a = document.createElement('a');
  a.href = url;
  a.download = `brainrot-meter-${store.todayKey()}.json`;
  a.click();
  URL.revokeObjectURL(url);
});

$('clear').addEventListener('click', async () => {
  if (!confirm('Erase all tracked history? This cannot be undone.')) return;
  await store.clearAll();
  await chrome.action.setBadgeText({ text: '' });
  flash('Erased');
});

load();
