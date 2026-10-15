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
    launchUrl.searchParams.set('embed', '1');
    launchUrl.searchParams.set('parentOrigin', window.location.origin);

    const host = document.createElement('div');
    host.id = 'g12-calling-widget';
    const root = host.attachShadow({ mode: 'open' });

    root.innerHTML = `
      <style>
        :host{all:initial;position:fixed;left:50%;bottom:38px;transform:translateX(-50%);z-index:2147483000;color-scheme:light}
        *,*::before,*::after{box-sizing:border-box}
        button{-webkit-tap-highlight-color:transparent;font:inherit;cursor:pointer}
        .launcher{position:relative;display:block;width:96px;height:86px;padding:0;border:0;background:transparent;overflow:visible}
        .launcher:focus-visible{outline:3px solid #d1a24b;outline-offset:4px;border-radius:50%}
        .mascot-body{position:absolute;inset:0;transform-origin:50% 85%;animation:g12-breathe 4s ease-in-out infinite}
        .launcher-mascot{position:absolute;display:block;width:120%;height:120%;left:-10%;top:-10%;object-fit:contain}
        .ring-marks,.expression,.talking-face{position:absolute;inset:0;width:100%;height:100%;overflow:visible;pointer-events:none}
        .ring-marks,.talking-face{opacity:0}
        .expression{width:120%;height:120%;left:-10%;top:-10%}
        .blink{opacity:0;animation:g12-blink 6.4s infinite}
        .timer{position:absolute;top:calc(100% + 1px);left:50%;transform:translateX(-50%);opacity:0;color:#496272;font:600 10px Arial,sans-serif;letter-spacing:.06em;font-variant-numeric:tabular-nums;white-space:nowrap}
        .mascot-mouth{fill:#153747;transform-origin:52px 63px}
        .voice-lines{fill:none;stroke:#5e8da2;stroke-width:2;stroke-linecap:round}
        .end-call-hint{position:absolute;bottom:calc(100% + 8px);left:50%;display:flex;align-items:center;gap:7px;white-space:nowrap;padding:9px 12px;border-radius:24px;background:#b93d47;color:#fff;font:600 11px Arial,sans-serif;opacity:0;transform:translate(-50%,6px) scale(.94);transition:opacity .18s,transform .18s;pointer-events:none}
        .end-call-hint svg{width:17px;height:17px;flex:none}
        .launcher.received:hover .end-call-hint,.launcher.received:focus-visible .end-call-hint{opacity:1;transform:translate(-50%,0) scale(1);pointer-events:auto}
        @media(hover:none){.launcher.received .end-call-hint{opacity:1;transform:translate(-50%,0) scale(1);pointer-events:auto}}
        .launcher.ringing .mascot-body{animation:g12-ringing .32s ease-in-out infinite}.launcher.ringing .ring-marks{opacity:1;animation:g12-ring-pulse .45s ease-in-out infinite}.launcher.ringing .blink{opacity:1;animation:none}
        .launcher.received .mascot-body{animation:g12-talking 2.4s ease-in-out infinite}.launcher.received .talking-face{opacity:1}.launcher.received .timer{opacity:1}.launcher.received.speaking .mascot-mouth{animation:g12-mouth .7s ease-in-out infinite}.launcher.received .voice-lines{opacity:0}.launcher.received.speaking .voice-lines{animation:g12-voice 1.4s ease-in-out infinite}
        .launcher.ending .mascot-body{animation:g12-end .75s ease-in-out both}.launcher.ending .timer{opacity:0}
        @keyframes g12-breathe{0%,100%{transform:scale(1,1)}50%{transform:scale(1.018,.985)}}
        @keyframes g12-blink{0%,39%,42%,69%,72%,100%{opacity:0}40%,41%,70%,71%{opacity:1}}
        @keyframes g12-ringing{0%,100%{transform:rotate(-8deg) scale(1.03,.98)}50%{transform:rotate(8deg) scale(.98,1.03)}}
        @keyframes g12-ring-pulse{0%,100%{opacity:.3;transform:scale(.94)}50%{opacity:1;transform:scale(1.08)}}
        @keyframes g12-talking{0%,100%{transform:rotate(-1deg) scale(1)}35%{transform:rotate(1.5deg) scale(1.015,.985)}70%{transform:rotate(0) scale(.99,1.01)}}
        @keyframes g12-mouth{0%,100%{transform:scale(1,.55)}35%{transform:scale(.75,1.35)}65%{transform:scale(1.15,.8)}}
        @keyframes g12-voice{0%,100%{opacity:.2;transform:translateX(-1px)}50%{opacity:1;transform:translateX(2px)}}
        @keyframes g12-end{0%{transform:scale(1)}45%{transform:rotate(-7deg) scale(.92)}100%{transform:translateY(5px) scale(.96)}}
        .call-engine{position:absolute;width:1px;height:1px;opacity:0;pointer-events:none;border:0;clip-path:inset(50%)}
        @media(max-width:720px){:host{bottom:max(38px,env(safe-area-inset-bottom))}.launcher{width:86px;height:78px}}
        @media(prefers-reduced-motion:reduce){.mascot-body,.blink,.ring-marks,.mascot-mouth,.voice-lines{animation:none!important}.launcher,.end-call-hint{transition:none}}
      </style>
      <button class="launcher" type="button" aria-label="Start voice consultation" title="Start voice consultation">
        <span class="mascot-body" aria-hidden="true"><img class="launcher-mascot" src="${mascotUrl.href}" alt="">
        <svg class="ring-marks" viewBox="0 0 100 100" aria-hidden="true"><g fill="none" stroke="#7197aa" stroke-width="2.6" stroke-linecap="round"><path d="M15 28Q5 39 15 50 M8 22Q-7 39 8 56 M85 28Q95 39 85 50 M92 22Q107 39 92 56"/></g></svg>
        <svg class="expression" viewBox="0 0 1387 1134" aria-hidden="true"><g class="blink"><ellipse cx="642" cy="568" rx="43" ry="58" fill="#22a9e9"/><ellipse cx="802" cy="568" rx="43" ry="58" fill="#22a9e9"/><path d="M620 574Q642 584 664 574M780 574Q802 584 824 574" fill="none" stroke="#172326" stroke-width="8" stroke-linecap="round"/></g></svg></span>
        <svg class="talking-face" viewBox="0 0 100 100" aria-hidden="true"><ellipse class="mascot-mouth" cx="52" cy="63" rx="5" ry="3.5"/><g class="voice-lines"><path d="M73 49q7 5 0 10"/><path d="M79 45q12 9 0 18"/></g></svg>
        <span class="end-call-hint" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M3 15v-4c4-5 14-5 18 0v4l-5-1v-3c-2-1-6-1-8 0v3Z" fill="currentColor"/></svg>End call</span>
        <span class="timer" aria-label="Call duration">00:00</span>
      </button>`;

    const launcher = root.querySelector('.launcher');
    const timer = root.querySelector('.timer');
    let state = 'idle';
    let frame;
    let ringTimeout;
    let callInterval;
    let connectionTimeout;
    let endingTimeout;
    let startedAt;
    let ringingAt;
    let connected = false;
    let activity = 'listening';
    let sentStart = false;

    const setState = next => {
      state = next;
      launcher.className = `launcher${next === 'idle' ? '' : ` ${next}`}`;
      if (next === 'received') launcher.classList.toggle('speaking', activity === 'speaking');
      launcher.setAttribute('aria-label', next === 'received' ? 'End voice consultation' : 'Start voice consultation');
      launcher.title = next === 'received' ? 'End voice consultation' : 'Start voice consultation';
    };

    const reset = () => {
      clearTimeout(ringTimeout);
      clearInterval(callInterval);
      clearTimeout(connectionTimeout);
      timer.textContent = '00:00';
      frame?.remove();
      frame = undefined;
      connected = false;
      sentStart = false;
      setState('idle');
    };

    const endCall = () => {
      if (state === 'idle' || state === 'ending') return;
      clearTimeout(ringTimeout);
      clearInterval(callInterval);
      clearTimeout(connectionTimeout);
      setState('ending');
      frame?.contentWindow?.postMessage({ source: 'g12-widget', command: 'end' }, appUrl.origin);
      frame?.remove(); // Unloading the engine releases its microphone and WebRTC session.
      frame = undefined;
      endingTimeout = setTimeout(reset, 750);
    };

    const showReceived = () => {
      if (!connected || state !== 'ringing') return;
      setState('received');
      const updateTimer = () => {
        const seconds = Math.floor((Date.now() - startedAt) / 1000);
        timer.textContent = `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;
      };
      updateTimer();
      callInterval = setInterval(updateTimer, 1000);
    };

    window.addEventListener('message', event => {
      if (event.origin !== appUrl.origin || !frame || event.source !== frame.contentWindow || event.data?.source !== 'g12-reze') return;
      if (event.data.event === 'ready' && !sentStart) {
        sentStart = true;
        frame.contentWindow.postMessage({ source: 'g12-widget', command: 'start' }, appUrl.origin);
      }
      if (event.data.event === 'connected' && !connected && state === 'ringing') {
        connected = true;
        startedAt = Date.now();
        clearTimeout(connectionTimeout);
        ringTimeout = setTimeout(showReceived, Math.max(0, 2000 - (Date.now() - ringingAt)));
      }
      if (event.data.event === 'activity') {
        activity = event.data.activity;
        launcher.classList.toggle('speaking', state === 'received' && activity === 'speaking');
      }
      if (event.data.event === 'ended') endCall();
      if (event.data.event === 'error') {
        launcher.title = typeof event.data.message === 'string' ? event.data.message : 'Unable to connect. Tap to retry.';
        endCall();
      }
    });

    const startCall = () => {
      if (state !== 'idle') return;
      setState('ringing');
      ringingAt = Date.now();
      connected = false;
      sentStart = false;
      activity = 'listening';
      frame = document.createElement('iframe');
      frame.className = 'call-engine';
      frame.title = 'Reze voice connection';
      frame.allow = `microphone ${appUrl.origin}; autoplay ${appUrl.origin}`;
      frame.setAttribute('aria-hidden', 'true');
      frame.tabIndex = -1;
      frame.src = launchUrl.href;
      root.append(frame);
      connectionTimeout = setTimeout(() => {
        endCall();
        launcher.title = 'Could not connect. Check microphone permission and tap to retry.';
      }, 45000);
    };

    launcher.addEventListener('click', () => state === 'received' || state === 'ringing' ? endCall() : startCall());
    root.addEventListener('keydown', event => { if (event.key === 'Escape') endCall(); });
    window.addEventListener('pagehide', () => { clearTimeout(endingTimeout); reset(); }, { once: true });
    document.body.append(host);
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount, { once: true });
  else mount();
})();
