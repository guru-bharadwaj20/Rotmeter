# Brainrot Meter

A Chrome extension that measures the time you actually lose to infinite feeds, and puts a few seconds of friction between you and the scroll.

The Brainrot site is an essay about algorithmic capture. This is the same argument, aimed at the moment it matters — 11:40pm, forty minutes into Reels — instead of at a reader who already agrees.

## Install (unpacked)

1. Open `chrome://extensions`
2. Turn on **Developer mode** (top right)
3. **Load unpacked** → select this `extension/` folder

No build step. No bundler, no npm install, nothing to compile — it's plain ES modules that Chrome runs directly. That's deliberate: a build step here would buy nothing and add a dependency that rots.

## Design decisions worth knowing

**Friction is the product; the dashboard is a supporting feature.** Screen-time dashboards have famously bad retention — people install, get scolded by a number, feel guilty, and uninstall. The evidence points at friction instead: the `one sec` study (PNAS, 2023) found roughly a third fewer app opens from a brief enforced pause. The mechanism is interrupting the automatic reach, not informing someone of a fact they already knew. So the pause screen is the point, and the numbers are there to make the pause credible.

**Cost framing is personal and forward-looking.** "41 hours = 12 books" is the weak version: abstract, backward-looking, and it mostly produces guilt. Guilt drives uninstalls, not change. Instead the user names their own goal once, and the pause screen says *"You said you wanted to learn guitar."* Same mechanic, far more teeth.

**Classification is per-URL, not per-domain.** This is the whole credibility of the tool. YouTube is lectures *and* Shorts. Reddit is r/cscareerquestions *and* r/all. If it tells you your thesis research was brainrot, you uninstall, and you're right to. So it counts YouTube Shorts but not `/watch`; Reddit's front page, r/popular and r/all but never a subreddit you deliberately opened. Anything ambiguous defaults to *not counted*.

**Local-only, and structurally so.** There is no network code in this extension. No account, no server, no analytics. The privacy story isn't a policy you have to trust — it's the absence of any code that could send anything anywhere.

## Architecture

| File | Role |
| --- | --- |
| [`src/background.js`](src/background.js) | Event-driven tracking core, badge, friction dispatch |
| [`src/lib/classify.js`](src/lib/classify.js) | URL → category. The credibility-critical file |
| [`src/lib/storage.js`](src/lib/storage.js) | Schema, session bookkeeping, retention |
| [`src/content/overlay.js`](src/content/overlay.js) | The pause screen and check-in toast |
| [`src/popup/`](src/popup/) | Today's total, breakdown, 7-day trend |
| [`src/options/`](src/options/) | Goal, pause length, whitelist, export, erase |

Three things in the tracking core are less obvious than they look:

**Timestamps, not counters.** The MV3 service worker is killed after ~30s idle and would take an in-memory counter with it, and `chrome.alarms` has a 1-minute floor — far too coarse to time a scroll session. So sessions are recorded as start/end timestamps in `chrome.storage.session`, which survives worker restarts. Every event handler calls one `reconcile()` that makes the open session match what the user is actually looking at.

**Idle detection is mandatory.** Without `chrome.idle`, you bill the twenty minutes someone left a tab open and went to dinner. Inflated numbers destroy trust on first contact. When Chrome reports idle, those seconds already elapsed with nobody watching, so the session is closed *retroactively* at `now - 60s` rather than now.

**No content script is needed for tracking.** The `tabs` permission exposes `tab.url` directly to the worker, including the `/shorts/` path. The content script exists only to draw the overlay.

## Data

```jsonc
{ "2026-07-17": { "youtube_shorts": 1840, "instagram_reels": 620 } }  // seconds, per local day
```

Bucketed daily totals by category. No URLs, no event timestamps, no per-visit rows. 90-day retention, then oldest days are dropped.

The shape is deliberate. Self-reported screen time is badly inaccurate — people misestimate their own usage by large margins in both directions — which is exactly why survey data on this subject is mush. An extension measures ground truth. Because a day record is *already* free of identifying detail, a future opt-in "contribute anonymised totals" feature could send one as-is, with no scrubbing step to get wrong. That's the honest path to a real dataset on attention: ship something people want, keep their data local, and earn the aggregate later from people who trust you because you spent a year not taking it.

Nothing of the sort exists in this codebase today, and it should not ship until local-only has real users.

## Status

MVP. Working: tracking, idle handling, badge, pause screen, check-in toast, popup, options, export, erase.

Not done yet:
- **Icons.** None bundled, so Chrome shows the default puzzle piece. Needs 16/32/48/128px PNGs.
- **Tests aren't committed.** The classifier and storage math were verified against 30 + 20 assertions during the build (including domain-confusion cases like `youtube.com.evil.test`); those should move into a real test file.
- **Firefox.** MV3 differs enough that the worker lifecycle needs a second look.
- Per-site limits, a weekly summary, streaks for days under target.

## Verification

The classifier and storage accounting were tested directly under Node with a `chrome.storage` shim. Everything else — the overlay, popup rendering, badge, and the full event flow — is verified by syntax and review only. **It has not been loaded into Chrome and driven end-to-end**, because that needs a browser session I can't drive here. First run may well turn up something; the overlay's behaviour on SPA navigation is where I'd look first.
