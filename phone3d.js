// ĐIỆN THOẠI HỌC SINH – KHUNG 3D NHỎ + ÂM THANH (cần game3d_chung.js; chế độ đua xe cần thêm race3d.js).
// PhoneStage.mount(el, getState) – getState() trả:
//   {mode:'race', car, color, raceState: countdown|driving|asking|question|checking|penalty|finished, turbo}
//   {mode:'arena', color, mood: idle|think|sent|out, title}  (Rung chuông vàng, Kéo co, Nhịp độ)
// PhoneStage.react('happy'|'sad'|'out'|'rescue'|'win') – nhân vật vui/buồn vài giây.
// PhoneSound: tap, send, bell, correct, wrong, out, win, rev, skid, horn + tiếng máy xe khi đang chạy (tự bật/tắt). Bật/tắt: PhoneSound.on(v)
(function () {
  'use strict';
  var T, S = null;

  // ---------------------------------------------------------------- ÂM THANH ĐIỆN THOẠI (nhỏ, ngắn – cả lớp cùng bật vẫn không ồn)
  var PS = { enabled: (function () { try { return localStorage.getItem('phone_sound') !== 'off'; } catch (e) { return true; } })() };
  function sfx(name) { if (PS.enabled && window.GameAudio) { GameAudio.unlock(); var a = [].slice.call(arguments, 1); GameAudio.sfx[name].apply(null, a); } }
  function eng() {
    if (PS.ctx) { if (PS.ctx.state === 'suspended') PS.ctx.resume(); return PS.ctx; }
    var C = window.AudioContext || window.webkitAudioContext; if (!C) return null;
    var c = PS.ctx = new C(); PS.g = c.createGain(); PS.g.gain.value = 0; PS.g.connect(c.destination);
    PS.lp = c.createBiquadFilter(); PS.lp.type = 'lowpass'; PS.lp.frequency.value = 500; PS.lp.connect(PS.g);
    PS.o1 = c.createOscillator(); PS.o1.type = 'sawtooth'; PS.o2 = c.createOscillator(); PS.o2.type = 'square';
    var g2 = c.createGain(); g2.gain.value = .4; PS.o1.connect(PS.lp); PS.o2.connect(g2); g2.connect(PS.lp); PS.o1.start(); PS.o2.start();
    return c;
  }
  function engine(on, turbo) {
    if (!on && !PS.ctx) return; if (!eng()) return;
    var t = PS.ctx.currentTime, f = turbo ? 120 : 85;
    PS.o1.frequency.setTargetAtTime(on ? f : 40, t, .15); PS.o2.frequency.setTargetAtTime(on ? f / 2 : 20, t, .15);
    PS.lp.frequency.setTargetAtTime(on ? (turbo ? 1500 : 900) : 300, t, .2);
    PS.g.gain.setTargetAtTime(on && PS.enabled ? (turbo ? .07 : .05) : 0, t, .2);
  }
  function blip(f1, f2, len, type, vol) { if (!PS.enabled || !eng()) return; var c = PS.ctx, t = c.currentTime, o = c.createOscillator(), g = c.createGain(); o.type = type; o.frequency.setValueAtTime(f1, t); o.frequency.exponentialRampToValueAtTime(f2, t + len); g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(.0001, t + len); o.connect(g); g.connect(c.destination); o.start(t); o.stop(t + len + .02); }
  window.PhoneSound = {
    on: function (v) { if (v === undefined) return PS.enabled; PS.enabled = !!v; try { localStorage.setItem('phone_sound', PS.enabled ? 'on' : 'off'); } catch (e) {} if (!PS.enabled) engine(false); return PS.enabled; },
    unlock: function () { eng(); if (window.GameAudio) GameAudio.unlock(); },
    tap: function () { sfx('pop'); }, send: function () { sfx('whoosh'); }, bell: function () { sfx('bell', 1); },
    correct: function () { sfx('correct'); setTimeout(function () { sfx('cheer', 1.2, .18); }, 150); },
    wrong: function () { blip(220, 110, .35, 'sawtooth', .12); },
    out: function () { sfx('sad'); }, win: function () { sfx('win'); },
    rev: function () { blip(80, 240, .5, 'sawtooth', .1); }, skid: function () { sfx('whoosh'); blip(1800, 700, .5, 'triangle', .06); },
    horn: function () { blip(440, 440, .25, 'square', .06); setTimeout(function () { blip(554, 554, .3, 'square', .06); }, 300); },
    engine: engine
  };
  document.addEventListener('pointerdown', function () { if (PS.enabled) window.PhoneSound.unlock(); }, { passive: true });

  // ---------------------------------------------------------------- CẢNH 3D
  function buildRace() {
    var g = new T.Group(); S.scene.add(g); S.race = g;
    var ground = new T.Mesh(new T.PlaneGeometry(80, 200), new T.MeshStandardMaterial({ color: 0x3f9e4d, roughness: 1 })); ground.rotation.x = -Math.PI / 2; ground.position.z = -60; g.add(ground);
    S.roadTex = G3D.tex(64, 256, function (c, w, h) { c.fillStyle = '#374151'; c.fillRect(0, 0, w, h); c.fillStyle = '#f8fafc'; c.fillRect(w / 2 - 3, 0, 6, h / 2); c.fillStyle = '#dc2626'; c.fillRect(0, 0, 5, h); c.fillRect(w - 5, 0, 5, h); });
    S.roadTex.wrapS = S.roadTex.wrapT = T.RepeatWrapping; S.roadTex.repeat.set(1, 20);
    var road = new T.Mesh(new T.PlaneGeometry(6, 200), new T.MeshStandardMaterial({ map: S.roadTex, roughness: .9 })); road.rotation.x = -Math.PI / 2; road.position.set(0, .01, -60); g.add(road);
    S.trees = [];
    for (var i = 0; i < 24; i++) {
      var tr = new T.Group(), trunk = new T.Mesh(new T.CylinderGeometry(.15, .2, 1, 6), G3D.mat('trunk', 0x92400e)), leaf = new T.Mesh(new T.ConeGeometry(.9, 2.2, 7), G3D.mat('leaf', 0x15803d, { flatShading: true }));
      trunk.position.y = .5; leaf.position.y = 2; tr.add(trunk); tr.add(leaf); tr.position.set((i % 2 ? 1 : -1) * (4.5 + (i * 7 % 5)), 0, -i * 5); g.add(tr); S.trees.push(tr);
    }
    S.cone = new T.Mesh(new T.ConeGeometry(.45, 1.1, 14), new T.MeshStandardMaterial({ color: 0xf97316 })); S.cone.position.set(0, .55, -6); g.add(S.cone);
    S.qmark = G3D.sprite(G3D.banner('❓', '#f59e0b'), 1.2, .7); S.qmark.position.set(0, 2.2, -6); g.add(S.qmark);
    S.flag = new T.Mesh(new T.PlaneGeometry(6, .9), new T.MeshBasicMaterial({ map: G3D.tex(256, 32, function (c) { for (var x = 0; x < 16; x++) for (var y = 0; y < 2; y++) { c.fillStyle = (x + y) % 2 ? '#111' : '#fff'; c.fillRect(x * 16, y * 16, 16, 16); } }) }));
    S.flag.rotation.x = -Math.PI / 2; S.flag.position.set(0, .02, -5); g.add(S.flag);
    S.fx = [];
  }
  function buildArena() {
    var g = new T.Group(); S.scene.add(g); S.arena = g;
    var floor = new T.Mesh(new T.CylinderGeometry(3.2, 3.4, .3, 40), new T.MeshStandardMaterial({ color: 0x4338ca, roughness: .4, metalness: .2 })); floor.position.y = -.15; g.add(floor);
    var ring = new T.Mesh(new T.TorusGeometry(3.3, .07, 6, 60), new T.MeshStandardMaterial({ color: 0xfacc15, emissive: 0xb45309, emissiveIntensity: .6 })); ring.rotation.x = Math.PI / 2; g.add(ring);
    S.bubble = G3D.sprite(G3D.banner('❓', '#f59e0b'), 1, .6); S.bubble.position.set(.85, 2.1, 0); g.add(S.bubble);
    S.title = G3D.sprite(G3D.banner(' ', '#4f46e5'), 3.4, .55); S.title.position.set(0, 2.62, -.8); g.add(S.title);
  }
  function setKid(color) {
    if (S.kidColor === color) return; S.kidColor = color;
    if (S.kid) S.arena.remove(S.kid);
    S.kid = G3D.kid(color, false, 'stand'); S.arena.add(S.kid);
  }
  function setCar(key, color) {
    if (S.carKey === key + color || !window.Race3D || !Race3D.buildCar) return; S.carKey = key + color;
    if (S.car) S.race.remove(S.car);
    S.car = Race3D.buildCar(key, color); S.car.position.set(0, 0, 0); S.race.add(S.car);
  }
  function puff(e, x, y, z, life) { var m = G3D.sprite(G3D.banner(e, 'rgba(0,0,0,0)'), .7, .45); m.material.opacity = .95; m.position.set(x, y, z); S.race.add(m); S.fx.push({ m: m, life: life || .6 }); }

  function frame() {
    if (!S) return; S.raf = requestAnimationFrame(frame);
    var now = performance.now(), dt = Math.min(.05, (now - (S.last || now)) / 1000), t = now / 1000; S.last = now;
    var st = S.getState() || {}, vis = !!S.el.offsetParent;
    var race = st.mode === 'race';
    if (!vis) { engine(false); return; }
    S.race.visible = race; S.arena.visible = !race;
    var cam = S.camera;
    if (race) {
      setCar(st.car || 'f1', st.color || 0xef4444);
      var rs = st.raceState, driving = rs === 'driving', speed = driving ? (st.turbo ? 26 : 16) : 0;
      S.v = (S.v || 0) + (speed - (S.v || 0)) * Math.min(1, dt * (driving ? 2 : 5));
      S.roadTex.offset.y += S.v * dt / 10;
      S.trees.forEach(function (tr) { tr.position.z += S.v * dt; if (tr.position.z > 6) tr.position.z -= 120; });
      var atCone = rs === 'asking' || rs === 'question' || rs === 'checking' || rs === 'penalty';
      S.cone.visible = S.qmark.visible = atCone; S.qmark.position.y = 2.2 + Math.sin(t * 4) * .1;
      S.flag.visible = rs === 'finished';
      if (S.car) {
        var b = S.car.userData.body; S.car.userData.wheels.forEach(function (w) { w.rotation.x -= S.v * dt / .4; });
        b.rotation.y = rs === 'penalty' ? Math.sin(t * 22) * .3 : b.rotation.y * .85;
        b.position.y = rs === 'finished' ? Math.abs(Math.sin(t * 5)) * .25 : (driving ? Math.sin(t * 30) * .02 : 0);
        if (driving && st.turbo) { S.fireT = (S.fireT || 0) - dt; if (S.fireT <= 0) { S.fireT = .06; puff('🔥', (Math.random() - .5) * .4, .4, 1.9, .4); } }
        if (rs === 'penalty') { S.smT = (S.smT || 0) - dt; if (S.smT <= 0) { S.smT = .12; puff('💨', (Math.random() - .5), .6, 1.6, .8); } }
      }
      S.fx = S.fx.filter(function (p) { p.life -= dt; p.m.position.z += dt * (S.v + 2); p.m.position.y += dt * .8; p.m.material.opacity = Math.max(0, p.life * 1.5); if (p.life <= 0) { S.race.remove(p.m); p.m.material.dispose(); } return p.life > 0; });
      // âm thanh xe: máy nổ khi chạy, rồ ga lúc bắt đầu chạy, phanh khi bị phạt, còi khi về đích
      if (rs !== S.prevRs) {
        if (rs === 'driving' && S.prevRs && S.prevRs !== 'countdown') PhoneSound.rev();
        if (rs === 'driving' && S.prevRs === 'countdown') PhoneSound.rev();
        if (rs === 'penalty') PhoneSound.skid();
        if (rs === 'finished' && S.prevRs) PhoneSound.horn();
        S.prevRs = rs;
      }
      engine(driving, st.turbo);
      cam.position.set(Math.sin(t * .6) * .3, 3.1, 5.6); cam.lookAt(0, .5, -4.5);
    } else {
      engine(false);
      setKid(st.color || 0x6366f1);
      var k = S.kid, kb = k.userData.body, mood = (S.react && now < S.reactUntil) ? S.react : (st.mood || 'idle');
      var out = mood === 'out' || mood === 'sad';
      kb.position.y = (mood === 'happy' || mood === 'win' || mood === 'rescue') ? Math.abs(Math.sin(t * 8)) * .45 : 0;
      kb.rotation.x = out ? .35 : 0; kb.rotation.z = mood === 'idle' ? Math.sin(t * 2) * .04 : 0;
      k.rotation.y = (mood === 'win' || mood === 'happy') ? t * 3 : Math.sin(t * .8) * .3;
      Object.keys(k.userData.parts).forEach(function (pn) { var m = k.userData.parts[pn]; if (!m.userData.orig) m.userData.orig = m.material; m.material = st.mood === 'out' && !(S.react && now < S.reactUntil) ? G3D.mat('grey', 0x64748b) : m.userData.orig; });
      var bub = { think: '❓', sent: '📨', happy: '🎉', win: '🏆', sad: '😢', out: '🛟', rescue: '💪' }[mood] || '';
      S.bubble.visible = !!bub; if (bub && S.bubTxt !== bub) { S.bubTxt = bub; G3D.setSprite(S.bubble, G3D.banner(bub, 'rgba(0,0,0,0)')); }
      S.bubble.position.y = 2.1 + Math.sin(t * 3) * .1;
      var title = st.title || ' '; if (title !== S.titleTxt) { S.titleTxt = title; G3D.setSprite(S.title, G3D.banner(title, st.titleColor || '#4f46e5')); }
      cam.position.set(0, 2, 4.3); cam.lookAt(0, 1.25, 0);
    }
    S.renderer.render(S.scene, cam);
  }

  window.PhoneStage = {
    supported: function () { return window.G3D && G3D.supported(); },
    mount: function (el, getState) {
      var need = window.Race3D && Race3D.lib ? Race3D.lib() : G3D.load();
      return need.then(function () { return G3D.load(); }).then(function () {
        T = G3D.T();
        if (S && S.el === el) { S.getState = getState; return S; }
        var o = G3D.scene(el, 0x7dd3fc, [25, 70]);
        o.renderer.shadowMap.enabled = false; o.renderer.setPixelRatio(Math.min(1.25, window.devicePixelRatio || 1));
        S = Object.assign(o, { getState: getState });
        o.scene.add(new T.HemisphereLight(0xffffff, 0x334155, .9));
        var sun = new T.DirectionalLight(0xffffff, .8); sun.position.set(4, 8, 6); o.scene.add(sun);
        buildRace(); buildArena(); frame(); return S;
      });
    },
    react: function (kind, ms) { if (!S) return; S.react = kind; S.reactUntil = performance.now() + (ms || 2600); }
  };
})();
