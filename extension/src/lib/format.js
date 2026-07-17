export function fmtDuration(seconds) {
  const s = Math.max(0, Math.round(seconds));
  if (s < 60) return `${s}s`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60);
  const rem = m % 60;
  return rem ? `${h}h ${rem}m` : `${h}h`;
}

export function fmtDayLabel(key) {
  const [y, m, d] = key.split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString(undefined, { weekday: 'short' });
}

// Cost framing, forward-looking and personal.
//
// "41 hours = 12 books" is the weak version: abstract, backward-looking, and it
// produces guilt, which mostly drives uninstalls. The user's own stated goal is
// the version with teeth.
export function goalLine(seconds, goal) {
  if (seconds < 60) return null;
  const d = fmtDuration(seconds);
  if (!goal) return `${d} gone today. Set a goal in Settings and this line gets sharper.`;
  return `${d} today that didn't go to ${goal}.`;
}
