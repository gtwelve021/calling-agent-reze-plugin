(() => {
  'use strict';
  if (document.getElementById('g12-calling-widget')) return;
  const script = document.currentScript;
  const appUrl = new URL(script?.dataset.appUrl || 'https://calling-agent-reze.vercel.app/');
  const avatarUrl = new URL('reze-avatar.png', script?.src || window.location.href);
  const mascotUrl = new URL('blue-companion.png', script?.src || window.location.href);
  if (appUrl.protocol !== 'https:' && appUrl.hostname !== 'localhost') return;

  const mount = () => {
    if (document.getElementById('g12-calling-widget')) return;
    const host = document.createElement('div');
    host.id = 'g12-calling-widget';
    const root = host.attachShadow({ mode: 'open' });
    root.innerHTML = `
      <style>
        :host{all:initial;position:fixed;right:22px;bottom:22px;z-index:2147483000;font-family:Arial,sans-serif;color:#171717;color-scheme:light}
        *,*::before,*::after{box-sizing:border-box} [hidden]{display:none!important}
        button,a{-webkit-tap-highlight-color:transparent}button{font:inherit;cursor:pointer}button:focus-visible,a:focus-visible{outline:3px solid #d1a24b;outline-offset:4px}
        @keyframes g12-mascot-breathe{0%,100%{transform:translateY(0) rotate(-1deg) scale(1)}50%{transform:translateY(-4px) rotate(1deg) scale(1.015,.985)}}
        .launcher-wrap{display:block;width:104px;height:96px}.launcher{position:relative;display:block;width:104px;height:96px;padding:0;border:0;background:transparent;transition:transform .2s ease;overflow:visible}.launcher:hover{transform:translateY(-3px) scale(1.04)}
        .launcher-mascot{display:block;width:100%;height:100%;object-fit:contain;filter:drop-shadow(0 7px 10px #17242d24);animation:g12-mascot-breathe 4s ease-in-out infinite;transform-origin:50% 85%}
        .panel{position:absolute;right:0;bottom:98px;width:350px;max-width:calc(100vw - 28px);height:500px;max-height:calc(100dvh - 132px);display:flex;flex-direction:column;background:#fff;border:1px solid #ead8b3;border-radius:20px;overflow:hidden;box-shadow:0 18px 55px #3d2a1533;transform-origin:bottom right;animation:g12-open .18s ease-out}
        @keyframes g12-open{from{opacity:0;transform:translateY(8px) scale(.97)}to{opacity:1;transform:none}}
        header{display:flex;align-items:center;justify-content:space-between;padding:12px 12px 11px 14px;border-bottom:1px solid #eee;gap:10px}
        .identity{display:flex;align-items:center;gap:10px;min-width:0}.avatar{position:relative;display:block;width:34px;height:34px;border-radius:11px;flex:none}.avatar img{display:block;width:100%;height:100%;border-radius:inherit;object-fit:cover}.avatar::after{content:"";position:absolute;right:-2px;bottom:-2px;width:10px;height:10px;border:2px solid #fff;border-radius:50%;background:#10b981}
        h2{margin:0;font-size:14px;line-height:1.25;color:#171717}header p{margin:2px 0 0;color:#777;font-size:10px;line-height:1.3}
        .close{display:grid;place-items:center;width:30px;height:30px;padding:0;border:0;border-radius:50%;background:#f4f4f5;color:#3f3f46;font-size:21px;line-height:1;flex:none}
        .content{position:relative;flex:1;min-height:0;display:flex;flex-direction:column}iframe{display:block;width:100%;height:100%;flex:1;border:0;background:#fff}
        .status{position:absolute;inset:0;display:grid;place-items:center;margin:0;padding:20px;background:#fff;text-align:center;font-size:12px;color:#666;pointer-events:none}
        footer{padding:9px 12px;border-top:1px solid #eee;text-align:center;background:#fafafa;font-size:10px;line-height:1.4}footer a{color:#52525b;text-decoration:underline}footer p{margin:2px 0 0;color:#888}
        @media(max-width:480px){:host{right:8px;bottom:max(8px,env(safe-area-inset-bottom))}.panel{width:min(350px,calc(100vw - 28px));height:min(500px,calc(100dvh - 120px));bottom:96px}.launcher-wrap,.launcher{width:92px;height:86px}.launcher:hover{transform:translateY(-2px) scale(1.03)}}
        @media(prefers-reduced-motion:reduce){.panel,.launcher-mascot{animation:none}.launcher{transition:none}}
      </style>
      <section class="panel" id="g12-call-panel" role="dialog" aria-labelledby="g12-call-title" hidden>
        <header><div class="identity"><span class="avatar"><img src="${avatarUrl.href}" alt="Reze"></span><div><h2 id="g12-call-title">Reze · G12</h2><p>Voice consultation</p></div></div><button class="close" type="button" aria-label="Close and end call" title="Close and end call"><span aria-hidden="true">&times;</span></button></header>
        <div class="content"><p class="status" role="status">Loading your call...</p></div>
        <footer><a target="_blank" rel="noopener noreferrer">Open call in a new tab</a><p>Closing this panel ends your call.</p></footer>
      </section>
      <div class="launcher-wrap"><button class="launcher" type="button" aria-label="Start voice consultation" title="Start voice consultation" aria-expanded="false" aria-controls="g12-call-panel" aria-haspopup="dialog">
        <img class="launcher-mascot" src="${mascotUrl.href}" alt="">
      </button></div>`;
    const panel = root.querySelector('.panel');
    const launcher = root.querySelector('.launcher');
    const closeButton = root.querySelector('.close');
    const content = root.querySelector('.content');
    const status = root.querySelector('.status');
    root.querySelector('footer a').href = appUrl.href;
    let frame;
    let timeout;
    const close = () => {
      clearTimeout(timeout);
      frame?.remove(); // Unload the document to release its microphone and socket.
      frame = undefined;
      panel.hidden = true;
      launcher.setAttribute('aria-expanded', 'false');
      launcher.focus();
    };
    const open = () => {
      panel.hidden = false;
      launcher.setAttribute('aria-expanded', 'true');
      status.hidden = false;
      status.textContent = 'Loading your call...';
      frame = document.createElement('iframe');
      frame.title = 'G12 Calling Agent';
      frame.allow = `microphone ${appUrl.origin}; autoplay ${appUrl.origin}`;
      frame.referrerPolicy = 'strict-origin-when-cross-origin';
      const frameUrl = new URL(appUrl.href);
      frameUrl.searchParams.set('autostart', '1');
      frame.src = frameUrl.href;
      frame.addEventListener('load', () => { clearTimeout(timeout); status.hidden = true; }, { once: true });
      timeout = setTimeout(() => { status.textContent = 'Taking longer than expected? Open the call in a new tab below.'; }, 15000);
      content.append(frame);
      closeButton.focus();
    };
    launcher.addEventListener('click', () => panel.hidden ? open() : close());
    closeButton.addEventListener('click', close);
    root.addEventListener('keydown', event => { if (event.key === 'Escape' && !panel.hidden) close(); });
    document.body.append(host);
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount, { once: true });
  else mount();
})();
