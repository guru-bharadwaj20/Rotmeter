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
  snapchat_spotlight: 'Snapchat Spotlight',
  threads_feed: 'Threads',
  bluesky_feed: 'Bluesky',
  tumblr_feed: 'Tumblr',
  pinterest_feed: 'Pinterest',
  quora_feed: 'Quora',
  ninegag: '9GAG',
  sharechat: 'ShareChat',
  likee: 'Likee',
};

// host matches domain exactly, or is a subdomain of it
function is(host, domain) {
  return host === domain || host.endsWith('.' + domain);
}

// Paths that are never the feed, on any site: auth, legal, settings, support.
// Used by the whole-site rules below, where the app *is* the feed and an
// exclusion list is more honest than trying to enumerate every feed path.
const NOT_FEED = [
  '/signin',
  '/signup',
  '/login',
  '/logout',
  '/settings',
  '/account',
  '/help',
  '/support',
  '/about',
  '/contact',
  '/privacy',
  '/terms',
  '/legal',
  '/careers',
  '/download',
];

function isFeedPath(p) {
  return !NOT_FEED.some((prefix) => p === prefix || p.startsWith(prefix + '/') || p.startsWith(prefix + '-'));
}

// For a short-video app whose entire surface is one vertical feed. Same
// treatment TikTok got: count everything, carve out the pages that aren't it.
function wholeSite(...domains) {
  return (h, p) => domains.some((d) => is(h, d)) && isFeedPath(p);
}

const RULES = [
  // YouTube: Shorts only. Regular /watch is lectures, music, repair guides — not ours to judge.
  // The home grid is deliberately excluded too: it's where people land on the way
  // to something they chose, and billing that lands on the wrong side of unfair.
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
  // web.snapchat.com — Spotlight is the vertical feed. Chat is not.
  {
    id: 'snapchat_spotlight',
    test: (h, p) => is(h, 'snapchat.com') && p.startsWith('/spotlight'),
  },
  // Home only. A post someone sent you (/@user/post/…) is not a feed.
  {
    id: 'threads_feed',
    test: (h, p) => (is(h, 'threads.com') || is(h, 'threads.net')) && (p === '/' || p.startsWith('/?')),
  },
  // Discover is algorithmic; /profile/… is someone you went looking for.
  {
    id: 'bluesky_feed',
    test: (h, p) => is(h, 'bsky.app') && (p === '/' || p.startsWith('/feeds')),
  },
  {
    id: 'tumblr_feed',
    test: (h, p) => is(h, 'tumblr.com') && (p === '/' || p.startsWith('/dashboard') || p.startsWith('/explore')),
  },
  // Pin detail pages (/pin/…) are a rabbit hole you entered deliberately.
  {
    id: 'pinterest_feed',
    test: (h, p) => is(h, 'pinterest.com') && (p === '/' || p.startsWith('/ideas')),
  },
  // Home feed only. A question you searched for is research.
  {
    id: 'quora_feed',
    test: (h, p) => is(h, 'quora.com') && p === '/',
  },
  {
    id: 'ninegag',
    test: (h, p) =>
      is(h, '9gag.com') && (p === '/' || p.startsWith('/hot') || p.startsWith('/trending') || p.startsWith('/fresh')),
  },

  // --- Short-video apps built for the Indian market -----------------------
  // These are mobile-first, and most have no real desktop web feed — Moj, Josh
  // and Chingari were checked and are app-download pages, so they're not listed
  // here. Only the two with something to actually scroll on a PC.
  {
    id: 'sharechat',
    test: (h, p) =>
      is(h, 'sharechat.com') &&
      (p === '/' || p.startsWith('/explore') || p.startsWith('/video') || p.startsWith('/trends')),
  },
  { id: 'likee', test: wholeSite('likee.com', 'likee.video') },
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
