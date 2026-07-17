// Content script. Classic script (MV3 content_scripts can't be ES modules), so
// no imports here — everything it needs arrives in the message payload.
//
// This is the intervention moment. `one sec` (PNAS, 2023) found roughly a third
// fewer app opens from a few seconds of enforced pause, and the mechanism was
// interrupting the automatic reach — not informing the user of anything. So this
// overlay's job is to cost four seconds and one deliberate click. Nothing else.

(() => {
  const HOST_ID = '__brainrot_meter__';

  let overlay = null;
  let countdown = null;

  const CSS = `
    :host { all: initial; }
    .backdrop {
      position: fixed; inset: 0;
      display: flex; align-items: center; justify-content: center;
      background: rgba(10, 11, 13, 0.92);
      backdrop-filter: blur(14px);
      pointer-events: auto;
      font-family: ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
      animation: fade 240ms ease-out;
    }
    @keyframes fade { from { opacity: 0 } to { opacity: 1 } }
    .card {
      width: min(420px, 88vw);
      text-align: center;
      color: #ece7df;
      padding: 8px;
    }
    .ring {
      width: 132px; height: 132px; margin: 0 auto 28px;
      border-radius: 50%;
      border: 1.5px solid rgba(236, 231, 223, 0.28);
      display: flex; align-items: center; justify-content: center;
      animation: breathe 4s ease-in-out infinite;
    }
    @keyframes breathe {
      0%, 100% { transform: scale(1);    border-color: rgba(236,231,223,0.22) }
      50%      { transform: scale(1.12); border-color: rgba(236,231,223,0.5) }
    }
    .count {
      font-family: ui-monospace, SFMono-Regular, "SF Mono", Menlo, monospace;
      font-size: 44px; font-weight: 300; letter-spacing: -1px;
      color: #ece7df; font-variant-numeric: tabular-nums;
    }
    .site { font-size: 12px; text-transform: uppercase; letter-spacing: 1.6px; color: #8b8681; margin: 0 0 10px }
    .goal { font-size: 17px; line-height: 1.5; margin: 0 0 6px; color: #ece7df }
    .today { font-size: 13px; color: #8b8681; margin: 0 0 28px }
    .row { display: flex; gap: 10px; justify-content: center }
    button {
      font: inherit; font-size: 14px; padding: 10px 18px;
      border-radius: 8px; cursor: pointer; transition: opacity 140ms, background 140ms;
    }
    .leave { background: #ece7df; color: #17181a; border: none; font-weight: 500 }
    .leave:hover { opacity: 0.85 }
    .go { background: transparent; color: #8b8681; border: 1px solid rgba(236,231,223,0.2) }
    .go:hover:not(:disabled) { background: rgba(236,231,223,0.07); color: #ece7df }
    .go:disabled { opacity: 0.35; cursor: default }

    .toast {
      position: fixed; right: 18px; bottom: 18px;
      width: 300px; padding: 14px 16px;
      background: rgba(23, 24, 26, 0.97);
      border: 1px solid rgba(236,231,223,0.14);
      border-left: 3px solid #c98a1e;
      border-radius: 10px;
      color: #ece7df; pointer-events: auto;
      font-family: ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
      font-size: 13.5px; line-height: 1.5;
      box-shadow: 0 12px 32px rgba(0,0,0,0.45);
      animation: slide 260ms ease-out;
    }
    @keyframes slide { from { opacity: 0; transform: translateY(10px) } to { opacity: 1; transform: none } }
    .toast b { font-weight: 600 }
    .toast .x {
      position: absolute; top: 8px; right: 10px;
      background: none; border: none; color: #8b8681; font-size: 15px; padding: 2px 5px;
    }
  `;

  function root() {
    const existing = document.getElementById(HOST_ID);
    if (existing) return existing.shadowRoot;

    const host = document.createElement('div');
    host.id = HOST_ID;
    // pointer-events:none so the empty host never swallows clicks; children opt back in.
    host.style.cssText =
      'all:initial;position:fixed;top:0;left:0;width:100%;height:100%;z-index:2147483647;pointer-events:none;';
    const shadow = host.attachShadow({ mode: 'open' });
    const style = document.createElement('style');
    style.textContent = CSS;
    shadow.appendChild(style);
    // documentElement, not body — this runs at document_start and body may not exist yet.
    document.documentElement.appendChild(host);
    return shadow;
  }

  function dismiss() {
    if (countdown) {
      clearInterval(countdown);
      countdown = null;
    }
    if (overlay) {
      overlay.remove();
      overlay = null;
    }
    document.documentElement.style.overflow = '';
  }

  function showFriction(payload) {
    if (overlay) return;

    const shadow = root();
    const backdrop = document.createElement('div');
    backdrop.className = 'backdrop';
    backdrop.innerHTML = `
      <div class="card">
        <div class="ring"><span class="count"></span></div>
        <p class="site"></p>
        <p class="goal"></p>
        <p class="today"></p>
        <div class="row">
          <button class="leave">Close this tab</button>
          <button class="go" disabled>Continue</button>
        </div>
      </div>
    `;

    const q = (sel) => backdrop.querySelector(sel);
    // textContent, never innerHTML — the goal string is user input.
    q('.site').textContent = payload.label;
    q('.goal').textContent = payload.goal
      ? `You said you wanted to ${payload.goal}.`
      : 'Take a breath. Is this the thing you meant to do?';

    const minutes = Math.floor((payload.todaySeconds || 0) / 60);
    q('.today').textContent = minutes >= 1 ? `${minutes} min in feeds today.` : 'First scroll of the day.';

    shadow.appendChild(backdrop);
    overlay = backdrop;
    document.documentElement.style.overflow = 'hidden';

    let left = Math.max(1, Number(payload.seconds) || 5);
    const count = q('.count');
    const go = q('.go');
    count.textContent = String(left);

    countdown = setInterval(() => {
      left -= 1;
      if (left > 0) {
        count.textContent = String(left);
        return;
      }
      clearInterval(countdown);
      countdown = null;
      count.textContent = '0';
      go.disabled = false;
      go.textContent = 'Continue anyway';
    }, 1000);

    go.addEventListener('click', () => {
      chrome.runtime.sendMessage({ type: 'BRAINROT_PASSED', host: payload.host }).catch(() => {});
      dismiss();
    });
    q('.leave').addEventListener('click', () => {
      chrome.runtime.sendMessage({ type: 'BRAINROT_LEAVE' }).catch(() => {});
      dismiss();
    });
  }

  function showToast(payload) {
    const shadow = root();
    const existing = shadow.querySelector('.toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<button class="x">&times;</button><span class="body"></span>`;

    const body = toast.querySelector('.body');
    const strong = document.createElement('b');
    strong.textContent = `${payload.minutes} minutes today.`;
    body.appendChild(strong);
    body.appendChild(
      document.createTextNode(
        payload.goal ? ` That's ${payload.minutes} minutes that didn't go to ${payload.goal}.` : ' Still here?'
      )
    );

    toast.querySelector('.x').addEventListener('click', () => toast.remove());
    shadow.appendChild(toast);
    setTimeout(() => toast.remove(), 9000);
  }

  chrome.runtime.onMessage.addListener((message) => {
    if (message?.type === 'BRAINROT_FRICTION') showFriction(message.payload);
    else if (message?.type === 'BRAINROT_TOAST') showToast(message.payload);
  });

  chrome.runtime.sendMessage({ type: 'BRAINROT_READY' }).catch(() => {});
})();
