(() => {
  'use strict';

  if (document.getElementById('g12-calling-widget')) return;

  const script = document.currentScript;
  const appUrl = new URL(script?.dataset.appUrl || 'https://calling-agent-reze.vercel.app/');
  const mascotUrl = new URL('blue-companion.png', script?.src || window.location.href);

  if (appUrl.protocol !== 'https:' && appUrl.hostname !== 'localhost') return;

  const mount = () => {
    if (document.getElementById('g12-calling-widget')) return;

    const launchUrl = new URL(appUrl.href);
    launchUrl.searchParams.set('autostart', '1');

    const host = document.createElement('div');
    host.id = 'g12-calling-widget';
    const root = host.attachShadow({ mode: 'open' });

    root.innerHTML = `
      <style>
        :host{all:initial;position:fixed;right:22px;bottom:22px;z-index:2147483000;color-scheme:light}
        *,*::before,*::after{box-sizing:border-box}
        button{-webkit-tap-highlight-color:transparent;font:inherit;cursor:pointer}
        .launcher{position:relative;display:block;width:104px;height:96px;padding:0;border:0;background:transparent;transition:transform .2s ease;overflow:visible}
        .launcher:hover{transform:translateY(-3px) scale(1.04)}
        .launcher:focus-visible{outline:3px solid #d1a24b;outline-offset:4px;border-radius:50%}
        .mascot-body{position:absolute;inset:0;transform-origin:50% 85%;animation:g12-breathe 4s ease-in-out infinite}
        .launcher-mascot{display:block;width:100%;height:100%;object-fit:contain;filter:drop-shadow(0 7px 10px #17242d24)}
        .ring-marks,.expression,.talking-face,.call-hand{position:absolute;inset:0;width:100%;height:100%;overflow:visible;pointer-events:none}
        .ring-marks,.talking-face,.call-hand{opacity:0}
        .blink{opacity:0;animation:g12-blink 6.4s infinite}
        .timer{position:absolute;top:calc(100% + 1px);left:50%;transform:translateX(-50%);opacity:0;color:#496272;font:600 10px Arial,sans-serif;letter-spacing:.06em;font-variant-numeric:tabular-nums;white-space:nowrap}
        .mascot-mouth{fill:#153747;transform-origin:52px 63px}
        .voice-lines{fill:none;stroke:#5e8da2;stroke-width:2;stroke-linecap:round}
        .mascot-arm{fill:#26a8e5;stroke:#168ac3;stroke-width:1.5}.mascot-hand{fill:#38b4ec;stroke:#168ac3;stroke-width:1.5;stroke-linejoin:round}.mascot-phone{fill:#d95050;stroke:#a62f35;stroke-width:1.7;stroke-linejoin:round}
        .launcher.ringing .mascot-body{animation:g12-ringing .32s ease-in-out infinite}.launcher.ringing .ring-marks{opacity:1;animation:g12-ring-pulse .45s ease-in-out infinite}.launcher.ringing .blink{opacity:1;animation:none}
        .launcher.received .mascot-body{animation:g12-talking 2.4s ease-in-out infinite}.launcher.received .talking-face,.launcher.received .call-hand{opacity:1}.launcher.received .timer{opacity:1}.launcher.received .mascot-mouth{animation:g12-mouth .7s ease-in-out infinite}.launcher.received .voice-lines{animation:g12-voice 1.4s ease-in-out infinite}.launcher.received .call-hand{inset:auto -7px 21px auto;width:53px;height:53px;animation:g12-phone 2.2s ease-in-out infinite}
        .launcher.ending .mascot-body{animation:g12-end .75s ease-in-out both}.launcher.ending .call-hand{opacity:1;inset:auto -7px 21px auto;width:53px;height:53px;animation:g12-hangup .75s ease-in-out both}.launcher.ending .timer{opacity:0}
        @keyframes g12-breathe{0%,100%{transform:translateY(0) rotate(-1deg) scale(1)}50%{transform:translateY(-4px) rotate(1deg) scale(1.015,.985)}}
        @keyframes g12-blink{0%,39%,42%,69%,72%,100%{opacity:0}40%,41%,70%,71%{opacity:1}}
        @keyframes g12-ringing{0%,100%{transform:rotate(-8deg) scale(1.03,.98)}50%{transform:rotate(8deg) scale(.98,1.03)}}
        @keyframes g12-ring-pulse{0%,100%{opacity:.3;transform:scale(.94)}50%{opacity:1;transform:scale(1.08)}}
        @keyframes g12-talking{0%,100%{transform:rotate(-1deg) scale(1)}35%{transform:rotate(1.5deg) scale(1.015,.985)}70%{transform:rotate(0) scale(.99,1.01)}}
        @keyframes g12-mouth{0%,100%{transform:scale(1,.55)}35%{transform:scale(.75,1.35)}65%{transform:scale(1.15,.8)}}
        @keyframes g12-voice{0%,100%{opacity:.2;transform:translateX(-1px)}50%{opacity:1;transform:translateX(2px)}}
        @keyframes g12-phone{0%,100%{transform:translateY(0) rotate(-36deg)}50%{transform:translateY(-2px) rotate(-40deg)}}
        @keyframes g12-end{0%{transform:scale(1)}45%{transform:rotate(-7deg) scale(.92)}100%{transform:translateY(5px) scale(.96)}}
        @keyframes g12-hangup{0%{transform:rotate(-36deg)}100%{transform:translate(17px,14px) rotate(24deg);opacity:0}}
        @media(max-width:480px){:host{right:8px;bottom:max(8px,env(safe-area-inset-bottom))}.launcher{width:92px;height:86px}.launcher:hover{transform:translateY(-2px) scale(1.03)}.launcher.received .call-hand,.launcher.ending .call-hand{right:-6px;bottom:19px;width:48px;height:48px}}
        @media(prefers-reduced-motion:reduce){.mascot-body,.blink,.ring-marks,.mascot-mouth,.voice-lines,.call-hand{animation:none!important}.launcher{transition:none}}
      </style>
      <button class="launcher" type="button" aria-label="Start voice consultation" title="Start voice consultation">
        <span class="mascot-body" aria-hidden="true"><img class="launcher-mascot" src="${mascotUrl.href}" alt=""></span>
        <svg class="ring-marks" viewBox="0 0 100 100" aria-hidden="true"><g fill="none" stroke="#7197aa" stroke-width="2.6" stroke-linecap="round"><path d="M15 28Q5 39 15 50 M8 22Q-7 39 8 56 M85 28Q95 39 85 50 M92 22Q107 39 92 56"/></g></svg>
        <svg class="expression" viewBox="0 0 1387 1134" aria-hidden="true"><g class="blink"><ellipse cx="642" cy="568" rx="43" ry="58" fill="#22a9e9"/><ellipse cx="802" cy="568" rx="43" ry="58" fill="#22a9e9"/><path d="M620 574Q642 584 664 574M780 574Q802 584 824 574" fill="none" stroke="#172326" stroke-width="8" stroke-linecap="round"/></g></svg>
        <svg class="talking-face" viewBox="0 0 100 100" aria-hidden="true"><ellipse class="mascot-mouth" cx="52" cy="63" rx="5" ry="3.5"/><g class="voice-lines"><path d="M73 49q7 5 0 10"/><path d="M79 45q12 9 0 18"/></g></svg>
        <svg class="call-hand" viewBox="0 0 72 72" aria-hidden="true"><path class="mascot-arm" d="M13 59c5-13 13-19 25-17l10 9-6 14H21Z"/><path class="mascot-hand" d="M34 44c2-8 6-13 10-12 3 1 2 5 1 8 4-5 8-7 10-4 2 3-2 8-5 11l-7 7Z"/><path class="mascot-phone" d="M29 28c8-7 21-8 30-1l-5 9-8-4c-3-1-6 0-8 2l-4 6-9-5Z"/></svg>
        <span class="timer" aria-label="Call duration">00:00</span>
      </button>`;

    const launcher = root.querySelector('.launcher');
    const timer = root.querySelector('.timer');
    let state = 'idle';
    let callWindow;
    let ringTimeout;
    let callInterval;
    let windowPoll;

    const setState = next => {
      state = next;
      launcher.className = `launcher${next === 'idle' ? '' : ` ${next}`}`;
      launcher.setAttribute('aria-label', next === 'received' ? 'End voice consultation' : 'Start voice consultation');
      launcher.title = next === 'received' ? 'End voice consultation' : 'Start voice consultation';
    };

    const reset = () => {
      clearTimeout(ringTimeout);
      clearInterval(callInterval);
      clearInterval(windowPoll);
      timer.textContent = '00:00';
      callWindow = undefined;
      setState('idle');
    };

    const endCall = () => {
      if (state === 'idle' || state === 'ending') return;
      clearTimeout(ringTimeout);
      clearInterval(callInterval);
      clearInterval(windowPoll);
      setState('ending');
      try { callWindow?.close(); } catch (_) {}
      setTimeout(reset, 750);
    };

    const startCall = () => {
      if (state !== 'idle') return;
      setState('ringing');
      callWindow = window.open(launchUrl.href, 'g12-reze-voice-call');

      ringTimeout = setTimeout(() => {
        setState('received');
        const started = Date.now();
        callInterval = setInterval(() => {
          const seconds = Math.floor((Date.now() - started) / 1000);
          timer.textContent = `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;
        }, 1000);
        if (callWindow) windowPoll = setInterval(() => { if (callWindow.closed) endCall(); }, 1000);
      }, 2000);
    };

    launcher.addEventListener('click', () => state === 'received' || state === 'ringing' ? endCall() : startCall());
    root.addEventListener('keydown', event => { if (event.key === 'Escape') endCall(); });
    window.addEventListener('pagehide', () => { try { callWindow?.close(); } catch (_) {} }, { once: true });
    document.body.append(host);
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount, { once: true });
  else mount();
})();
