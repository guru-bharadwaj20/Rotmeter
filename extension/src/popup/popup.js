import * as store from '../lib/storage.js';
import { CATEGORIES } from '../lib/classify.js';
import { fmtDuration, fmtDayLabel, goalLine } from '../lib/format.js';

const $ = (id) => document.getElementById(id);

function renderBreakdown(breakdown) {
  const entries = Object.entries(breakdown)
    .filter(([, seconds]) => seconds > 0)
    .sort((a, b) => b[1] - a[1]);

  const host = $('breakdown');
  host.replaceChildren();

  if (!entries.length) {
    const p = document.createElement('p');
    p.className = 'empty';
    p.textContent = 'Nothing yet today. This is what winning looks like.';
    host.appendChild(p);
    return;
  }

  const max = entries[0][1];
  for (const [id, seconds] of entries) {
    const row = document.createElement('div');
    row.className = 'bar-row';

    const label = document.createElement('span');
    label.className = 'bar-label';
    label.textContent = CATEGORIES[id] || id;

    const value = document.createElement('span');
    value.className = 'bar-value';
    value.textContent = fmtDuration(seconds);

    const track = document.createElement('div');
    track.className = 'bar-track';
    const fill = document.createElement('div');
    fill.className = 'bar-fill';
    fill.style.width = `${Math.max(2, (seconds / max) * 100)}%`;
    track.appendChild(fill);

    row.append(label, value, track);
    host.appendChild(row);
  }
}

function renderWeek(days) {
  const host = $('week');
  host.replaceChildren();

  const max = Math.max(...days.map((d) => d.total), 1);
  days.forEach((day, i) => {
    const col = document.createElement('div');
    col.className = i === days.length - 1 ? 'day today' : 'day';

    const bar = document.createElement('div');
    bar.className = 'day-bar';
    bar.style.height = `${(day.total / max) * 100}%`;
    bar.title = `${day.key}: ${fmtDuration(day.total)}`;

    const label = document.createElement('span');
    label.className = 'day-label';
    label.textContent = fmtDayLabel(day.key);

    col.append(bar, label);
    host.appendChild(col);
  });

  const total = days.reduce((sum, d) => sum + d.total, 0);
  $('weekTotal').textContent = total > 0 ? `${fmtDuration(total)} across 7 days` : '';
}

async function render() {
  const [breakdown, week, settings] = await Promise.all([
    store.todayBreakdownLive(),
    store.lastNDays(7),
    store.getSettings(),
  ]);

  const total = store.dayTotal(breakdown);
  $('total').textContent = fmtDuration(total);
  $('goal').textContent = goalLine(total, settings.goal) || 'Nothing lost yet today.';

  renderBreakdown(breakdown);
  renderWeek(week);
}

$('settings').addEventListener('click', () => chrome.runtime.openOptionsPage());

$('export').addEventListener('click', async () => {
  const payload = await store.exportPayload();
  const url = URL.createObjectURL(new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' }));
  const a = document.createElement('a');
  a.href = url;
  a.download = `brainrot-meter-${store.todayKey()}.json`;
  a.click();
  URL.revokeObjectURL(url);
});

render();
// The popup stays open while a tracked tab keeps accruing — keep the number honest.
setInterval(render, 5000);
