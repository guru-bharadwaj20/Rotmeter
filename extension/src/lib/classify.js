// URL -> category. Deliberately pattern-based, not domain-based.
//
// The whole credibility of this extension rests on this file. If it tells someone
// their lecture playlist or r/cscareerquestions research was "brainrot", they
// uninstall and they are right to. Default to NOT counting when unsure.

export const CATEGORIES = {
  youtube_shorts: 'YouTube Shorts',
  instagram_reels: 'Instagram Reels',
  instagram_feed: 'Instagram',
  twitter_feed: 'X / Twitter',
  reddit_feed: 'Reddit front page',
  facebook_feed: 'Facebook',
};

// host matches domain exactly, or is a subdomain of it
function is(host, domain) {
  return host === domain || host.endsWith('.' + domain);
}

const RULES = [
  // YouTube: Shorts only. Regular /watch is lectures, music, repair guides — not ours to judge.
  {
    id: 'youtube_shorts',
    test: (h, p) => is(h, 'youtube.com') && p.startsWith('/shorts/'),
  },
  {
    id: 'instagram_reels',
    test: (h, p) => is(h, 'instagram.com') && (p.startsWith('/reels') || p.startsWith('/reel/')),
  },
  {
    id: 'instagram_feed',
    test: (h, p) => is(h, 'instagram.com') && (p === '/' || p.startsWith('/explore')),
  },
  {
    id: 'twitter_feed',
    test: (h, p) =>
      (is(h, 'x.com') || is(h, 'twitter.com')) &&
      (p === '/' ||
        p.startsWith('/home') ||
        p.startsWith('/explore') ||
        p.startsWith('/search') ||
        /^\/[^/]+\/status\//.test(p)),
  },
  // Reddit: the algorithmic surfaces only. A specific subreddit is a choice you made.
  {
    id: 'reddit_feed',
    test: (h, p) => is(h, 'reddit.com') && (p === '/' || p.startsWith('/r/popular') || p.startsWith('/r/all')),
  },
  {
    id: 'facebook_feed',
    test: (h, p) => is(h, 'facebook.com') && (p === '/' || p.startsWith('/reel') || p.startsWith('/watch')),
  },
];

/**
 * @returns {{id: string, label: string, host: string} | null}
 */
export function classify(url, whitelist = []) {
  let u;
  try {
    u = new URL(url);
  } catch {
    return null;
  }
  if (u.protocol !== 'http:' && u.protocol !== 'https:') return null;

  for (const entry of whitelist) {
    const needle = String(entry || '').trim();
    if (needle && url.includes(needle)) return null;
  }

  const host = u.hostname.replace(/^www\./, '');
  for (const rule of RULES) {
    if (rule.test(host, u.pathname)) {
      return { id: rule.id, label: CATEGORIES[rule.id], host };
    }
  }
  return null;
}
