// KÉO CO KIẾN THỨC – MÀN CHIẾU 3D (Three.js) + ÂM THANH (Web Audio tổng hợp, không cần file mp3).
// Chỉ thay phần hiển thị và âm thanh trên máy GV; luật chơi, chấm điểm, điện thoại HS giữ nguyên.
// Tug3D.mount(el, snapshot)  – snapshot() trả {pos (-5..5, âm: Đỏ thắng thế), redScore, blueScore, red:[tên], blue:[tên]}
// TugAudio.pull(team) / win(team) / musicStart() / musicStop() / musicOn(v) / unlock()
(function () {
  'use strict';
  var THREE_URL = 'https://cdn.jsdelivr.net/npm/three@0.149.0/build/three.min.js';
  var T, S = null, STEP = 1.6;   // 1 nấc = 1,6 đơn vị; 5 nấc chạm vạch biên (±8)
  var RED = 0xe11d48, BLUE = 0x0284c7;

  function supported() { try { var c = document.createElement('canvas'); return !!(window.WebGLRenderingContext && (c.getContext('webgl') || c.getContext('experimental-webgl'))); } catch (e) { return false; } }
  function loadThree() {
    if (window.THREE) return Promise.resolve(window.THREE);
    return new Promise(function (ok, fail) { var s = document.createElement('script'); s.src = THREE_URL; s.onload = function () { ok(window.THREE); }; s.onerror = function () { fail(new Error('Không tải được thư viện 3D (kiểm tra mạng).')); }; document.head.appendChild(s); });
  }
  function tex(w, h, draw) { var c = document.createElement('canvas'); c.width = w; c.height = h; draw(c.getContext('2d'), w, h); var t = new T.CanvasTexture(c); if (T.sRGBEncoding) t.encoding = T.sRGBEncoding; t.anisotropy = 4; return t; }
  function rr(g, x, y, w, h, r) { g.beginPath(); g.moveTo(x + r, y); g.arcTo(x + w, y, x + w, y + h, r); g.arcTo(x + w, y + h, x, y + h, r); g.arcTo(x, y + h, x, y, r); g.arcTo(x, y, x + w, y, r); g.closePath(); }
  function sprite(t, w, h) { var m = new T.Sprite(new T.SpriteMaterial({ map: t, transparent: true, depthWrite: false })); m.scale.set(w, h, 1); return m; }
  function nameTex(name, col) {
    return tex(384, 96, function (g, w, h) { g.fillStyle = 'rgba(15,23,42,.8)'; rr(g, 4, 10, w - 8, h - 20, 30); g.fill(); g.fillStyle = col; g.fillRect(18, 30, 12, 36);
      g.fillStyle = '#fff'; g.font = '800 40px Arial'; g.textBaseline = 'middle'; var t = String(name); while (g.measureText(t).width > w - 60 && t.length > 2) t = t.slice(0, -2); if (t !== String(name)) t += '…'; g.fillText(t, 42, h / 2 + 2); });
  }
  function boardTex(team, score, extra) {
    var red = team === 'red';
    return tex(768, 256, function (g, w, h) {
      g.fillStyle = red ? '#e11d48' : '#0284c7'; rr(g, 6, 6, w - 12, h - 12, 36); g.fill(); g.strokeStyle = '#fff'; g.lineWidth = 10; g.stroke();
      g.fillStyle = '#fff'; g.textAlign = 'center'; g.font = '900 72px Arial'; g.fillText(red ? '🔴 ĐỘI ĐỎ' : 'ĐỘI XANH 🔵', w / 2, 100);
      g.font = '900 84px Arial'; g.fillText(score + ' điểm', w / 2, 196); if (extra) { g.font = '700 30px Arial'; g.fillText(extra, w / 2, 236); }
    });
  }

  // ---------------------------------------------------------------- nhân vật học sinh low-poly (áo cổ trắng, không khăn quàng)
  var MAT = {};
  function mat(k, c) { if (!MAT[k]) MAT[k] = new T.MeshStandardMaterial({ color: c, roughness: .6 }); return MAT[k]; }
  function merge(geos) {
    var pos = [], nor = [];
    geos.forEach(function (g) { var ng = g.index ? g.toNonIndexed() : g; Array.prototype.push.apply(pos, ng.attributes.position.array); Array.prototype.push.apply(nor, ng.attributes.normal.array); g.dispose(); if (ng !== g) ng.dispose(); });
    var o = new T.BufferGeometry(); o.setAttribute('position', new T.Float32BufferAttribute(pos, 3)); o.setAttribute('normal', new T.Float32BufferAttribute(nor, 3)); return o;
  }
  function makeKid(team, girl) {
    var dir = team === 'red' ? 1 : -1;    // hướng mặt về giữa sân (+x với Đỏ)
    var g = new T.Group(), body = new T.Group(); g.add(body);
    var P = { shirt: [], pants: [], skin: [], hair: [], white: [], shoe: [] };
    var B = function (k, w, h, d, x, y, z, rz) { var geo = new T.BoxGeometry(w, h, d); if (rz) geo.rotateZ(rz); P[k].push(geo.translate(x, y, z)); };
    // chân: tư thế kéo – chân trước duỗi, chân sau chùng
    B('pants', .22, .8, .22, .28 * dir, .42, .13, -.35 * dir); B('pants', .22, .78, .22, -.12 * dir, .42, -.13, .1 * dir);
    B('shoe', .32, .12, .24, .42 * dir, .06, .13); B('shoe', .32, .12, .24, -.06 * dir, .06, -.13);
    B('shirt', .5, .7, .42, 0, 1.15, 0); B('white', .36, .1, .44, .04 * dir, 1.5, 0);          // thân áo, cổ áo trắng
    if (girl) B('pants', .56, .28, .46, 0, .82, 0);                                             // váy/quần
    // tay vươn về phía dây (ra trước)
    B('shirt', .55, .16, .16, .3 * dir, 1.22, .2, -.25 * dir); B('shirt', .55, .16, .16, .3 * dir, 1.22, -.2, -.25 * dir);
    B('skin', .14, .14, .14, .58 * dir, 1.13, .2); B('skin', .14, .14, .14, .58 * dir, 1.13, -.2);
    P.skin.push(new T.SphereGeometry(.24, 14, 12).translate(.02 * dir, 1.78, 0));
    P.hair.push(new T.SphereGeometry(.255, 14, 10, 0, Math.PI * 2, 0, Math.PI / 2).translate(-.01 * dir, 1.8, 0));
    if (girl) { P.hair.push(new T.BoxGeometry(.12, .36, .4).translate(-.2 * dir, 1.62, 0)); }
    var M = { shirt: mat(team, team === 'red' ? RED : BLUE), pants: mat('pants', 0x1e293b), skin: mat('skin', 0xf2c6a0), hair: mat('hair', 0x1f1308), white: mat('white', 0xffffff), shoe: mat('shoe', 0x111827) };
    Object.keys(P).forEach(function (k) { if (P[k].length) { var m = new T.Mesh(merge(P[k]), M[k]); m.castShadow = true; body.add(m); } });
    g.userData = { body: body, dir: dir };
    return g;
  }

  // ---------------------------------------------------------------- sân đấu
  function buildField() {
    var sc = S.scene, W = new T.Group(); sc.add(W);
    var ground = new T.Mesh(new T.PlaneGeometry(260, 160), new T.MeshStandardMaterial({ color: 0x3f9e4d, roughness: 1 })); ground.rotation.x = -Math.PI / 2; ground.receiveShadow = true; W.add(ground);
    var arena = new T.Mesh(new T.PlaneGeometry(34, 7), new T.MeshStandardMaterial({ color: 0xd6b98c, roughness: 1 })); arena.rotation.x = -Math.PI / 2; arena.position.y = .01; arena.receiveShadow = true; W.add(arena);
    var line = function (x, c, w) { var m = new T.Mesh(new T.PlaneGeometry(w || .18, 7), new T.MeshBasicMaterial({ color: c })); m.rotation.x = -Math.PI / 2; m.position.set(x, .02, 0); W.add(m); };
    line(0, 0xffffff, .26); line(-5 * STEP, RED, .3); line(5 * STEP, BLUE, .3);
    // cột mốc vạch biên
    [[-5 * STEP, RED], [5 * STEP, BLUE]].forEach(function (a) { [-3.7, 3.7].forEach(function (z) { var p = new T.Mesh(new T.CylinderGeometry(.08, .08, 1.6, 8), new T.MeshStandardMaterial({ color: a[1] })); p.position.set(a[0], .8, z); W.add(p); var f = new T.Mesh(new T.PlaneGeometry(.7, .45), new T.MeshStandardMaterial({ color: a[1], side: T.DoubleSide })); f.position.set(a[0] + .35, 1.4, z); W.add(f); }); });
    // trường học phía sau
    var school = new T.Mesh(new T.BoxGeometry(46, 9, 6), new T.MeshStandardMaterial({ color: 0xfde68a, roughness: .9 })); school.position.set(0, 4.5, -30); W.add(school);
    var roof = new T.Mesh(new T.BoxGeometry(48, .8, 7), new T.MeshStandardMaterial({ color: 0xb91c1c })); roof.position.set(0, 9.3, -30); W.add(roof);
    var winM = new T.MeshStandardMaterial({ color: 0x60a5fa, roughness: .2, metalness: .3 });
    for (var r = 0; r < 2; r++) for (var c = 0; c < 10; c++) { var w = new T.Mesh(new T.PlaneGeometry(2.2, 1.6), winM); w.position.set(-20 + c * 4.4, 2.6 + r * 3.6, -26.98); W.add(w); }
    var sign = new T.Mesh(new T.PlaneGeometry(12, 1.8), new T.MeshBasicMaterial({ map: tex(1024, 154, function (g, w, h) { g.fillStyle = '#1e3a8a'; g.fillRect(0, 0, w, h); g.fillStyle = '#fff'; g.font = '900 96px Arial'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('TRƯỜNG THPT VT', w / 2, h / 2 + 4); }) }));
    sign.position.set(0, 8.2, -26.95); W.add(sign);
    // cờ dây trang trí
    var flagN = 40, fl = new T.InstancedMesh(new T.ConeGeometry(.28, .6, 3), new T.MeshStandardMaterial({ side: T.DoubleSide }), flagN), m4 = new T.Matrix4(), col = new T.Color(), cols = [0xef4444, 0xfacc15, 0x22c55e, 0x3b82f6, 0xa855f7];
    for (var i = 0; i < flagN; i++) { var x = -19 + i * (38 / (flagN - 1)), y = 6.2 - Math.sin(i / (flagN - 1) * Math.PI) * 1.2; m4.makeRotationX(Math.PI).setPosition(x, y, -6); fl.setMatrixAt(i, m4); fl.setColorAt(i, col.set(cols[i % 5])); }
    W.add(fl);
    [-19, 19].forEach(function (x) { var p = new T.Mesh(new T.CylinderGeometry(.12, .12, 6.6, 8), new T.MeshStandardMaterial({ color: 0x9ca3af })); p.position.set(x, 3.3, -6); W.add(p); });
    // cây
    var tN = 30, tr = new T.InstancedMesh(new T.CylinderGeometry(.2, .3, 1.6, 6), new T.MeshStandardMaterial({ color: 0x92400e }), tN), lf = new T.InstancedMesh(new T.SphereGeometry(1.5, 8, 6), new T.MeshStandardMaterial({ color: 0x15803d, roughness: .9, flatShading: true }), tN);
    for (var k = 0; k < tN; k++) { var side = k % 2 ? 1 : -1, x2 = side * (21 + (k * 7) % 18), z2 = -24 + ((k * 13) % 30), sc2 = .8 + ((k * 5) % 7) / 10; m4.makeScale(sc2, sc2, sc2).setPosition(x2, .8 * sc2, z2); tr.setMatrixAt(k, m4); m4.makeScale(sc2, sc2 * 1.2, sc2).setPosition(x2, 2.6 * sc2, z2); lf.setMatrixAt(k, m4); }
    tr.castShadow = lf.castShadow = true; W.add(tr); W.add(lf);
    // dây kéo + cờ giữa dây
    var rope = new T.Group(); S.rope = rope; sc.add(rope);
    var ropeM = new T.MeshStandardMaterial({ color: 0xd4a373, roughness: .9 });
    var rp = new T.Mesh(new T.CylinderGeometry(.07, .07, 30, 10), ropeM); rp.rotation.z = Math.PI / 2; rp.position.y = 1.12; rp.castShadow = true; rope.add(rp);
    var knot = new T.Mesh(new T.SphereGeometry(.16, 10, 8), new T.MeshStandardMaterial({ color: 0xfacc15 })); knot.position.y = 1.12; rope.add(knot);
    var ribbon = new T.Mesh(new T.PlaneGeometry(.5, .8), new T.MeshStandardMaterial({ color: 0xfacc15, side: T.DoubleSide })); ribbon.position.set(0, .7, 0); rope.add(ribbon); S.ribbon = ribbon;
    // bảng điểm hai đội
    S.boardR = sprite(boardTex('red', 0), 6, 2); S.boardR.position.set(-8.5, 4.6, -3); sc.add(S.boardR);
    S.boardB = sprite(boardTex('blue', 0), 6, 2); S.boardB.position.set(8.5, 4.6, -3); sc.add(S.boardB);
  }

  function syncKids(red, blue) {
    var key = red.join('|') + '#' + blue.join('|');
    if (key === S.kidKey) return; S.kidKey = key;
    (S.kids || []).forEach(function (k) { S.rope.remove(k.obj); });
    S.kids = [];
    [['red', red], ['blue', blue]].forEach(function (a) {
      var team = a[0], names = a[1], n = Math.max(4, Math.min(6, names.length || 4)), dir = team === 'red' ? -1 : 1;
      for (var i = 0; i < n; i++) {
        var o = makeKid(team, i % 2 === 1), x = dir * (2.4 + i * 1.45), z = i % 2 ? -.32 : .32;
        o.position.set(x, 0, z); S.rope.add(o);
        var nm = names[i];
        if (i === n - 1 && names.length > n) nm = '+' + (names.length - n + 1) + ' bạn';
        if (nm) { var lab = sprite(nameTex(nm, team === 'red' ? '#e11d48' : '#0284c7'), 2.6, .65); lab.position.set(0, 2.5, 0); o.add(lab); }
        S.kids.push({ obj: o, team: team, i: i });
      }
    });
  }

  // ---------------------------------------------------------------- vòng vẽ
  function frame() {
    if (!S) return; S.raf = requestAnimationFrame(frame);
    if (!S.el.offsetParent) return;
    var now = performance.now(), dt = Math.min(.05, (now - (S.last || now)) / 1000), t = now / 1000; S.last = now;
    var s = S.snapshot() || { pos: 0, red: [], blue: [], redScore: 0, blueScore: 0 };
    syncKids(s.red, s.blue);
    if (s.pos !== S.pos) { if (S.pos !== undefined) { S.jerk = 1; S.jerkTeam = s.pos < S.pos ? 'red' : 'blue'; } S.pos = s.pos; }
    var target = s.pos * STEP; S.x += (target - S.x) * Math.min(1, dt * 2.2); S.rope.position.x = S.x;
    S.jerk = Math.max(0, (S.jerk || 0) - dt * 1.4);
    var win = s.pos <= -5 ? 'red' : s.pos >= 5 ? 'blue' : '';
    S.ribbon.rotation.y = Math.sin(t * 3) * .4;
    (S.kids || []).forEach(function (k) {
      var b = k.obj.userData.body, dir = k.obj.userData.dir, ph = t * 5 + k.i * .5;
      var lean = .32 + Math.sin(ph) * .06;                              // "hò dô ta": nhịp kéo đều
      if (S.jerk && k.team === S.jerkTeam) lean += S.jerk * .3;          // đội vừa ghi điểm giật mạnh
      if (S.jerk && k.team !== S.jerkTeam) lean -= S.jerk * .25;         // đội kia bị kéo chúi về trước
      if (win) { if (k.team === win) { lean = 0; b.position.y = Math.abs(Math.sin(t * 7 + k.i)) * .45; } else { lean = -.35; b.position.y = 0; } }
      else b.position.y = 0;
      b.rotation.z = lean * dir;
    });
    var key = s.redScore + '|' + s.blueScore + '|' + s.red.length + '|' + s.blue.length;
    if (key !== S.boardKey) {
      S.boardKey = key;
      [['red', S.boardR, s.redScore, s.red.length], ['blue', S.boardB, s.blueScore, s.blue.length]].forEach(function (a) {
        a[1].material.map.dispose(); a[1].material.map = boardTex(a[0], a[2], a[3] ? a[3] + ' học sinh' : ''); a[1].material.needsUpdate = true;
      });
    }
    var cam = S.camera, cx = S.x * .7 + Math.sin(t * .25) * .8;
    cam.position.x += (cx - cam.position.x) * Math.min(1, dt * 1.5); cam.position.y = 4.6; cam.position.z = 11.5;
    cam.lookAt(cam.position.x * .8, 1.5, 0);
    S.renderer.render(S.scene, cam);
  }
  function resize() { if (!S) return; var w = S.el.clientWidth || 800, h = S.el.clientHeight || 400; S.renderer.setSize(w, h, false); S.camera.aspect = w / h; S.camera.updateProjectionMatrix(); }
  function mount(el, snapshot) {
    if (!supported()) return Promise.reject(new Error('Máy này chưa hỗ trợ đồ hoạ 3D (WebGL).'));
    return loadThree().then(function (THREE) {
      T = THREE; if (T.ColorManagement) T.ColorManagement.legacyMode = false;
      if (S && S.el === el) { S.snapshot = snapshot; return S; }
      var renderer = new T.WebGLRenderer({ antialias: true }); renderer.setPixelRatio(Math.min(1.5, window.devicePixelRatio || 1));
      renderer.shadowMap.enabled = true; renderer.shadowMap.type = T.PCFSoftShadowMap; if (T.sRGBEncoding) renderer.outputEncoding = T.sRGBEncoding;
      renderer.domElement.style.cssText = 'width:100%;height:100%;display:block'; el.innerHTML = ''; el.appendChild(renderer.domElement);
      var scene = new T.Scene(); scene.background = new T.Color(0x9bd7ff); scene.fog = new T.Fog(0x9bd7ff, 60, 160);
      var camera = new T.PerspectiveCamera(42, 16 / 9, .5, 400); camera.position.set(0, 6.5, 16);
      scene.add(new T.HemisphereLight(0xffffff, 0x4d7c0f, .8));
      var sun = new T.DirectionalLight(0xffffff, .9); sun.position.set(12, 22, 14); sun.castShadow = true; sun.shadow.mapSize.set(2048, 2048);
      var sc = sun.shadow.camera; sc.left = -20; sc.right = 20; sc.top = 14; sc.bottom = -14; sc.far = 80; scene.add(sun);
      S = { el: el, renderer: renderer, scene: scene, camera: camera, snapshot: snapshot, x: 0 };
      buildField();
      S.ro = new ResizeObserver(resize); S.ro.observe(el); resize(); frame();
      return S;
    });
  }
  window.Tug3D = { mount: mount, supported: supported };

  // ---------------------------------------------------------------- ÂM THANH
  var A = { music: (function () { try { return localStorage.getItem('tug_music') !== 'off'; } catch (e) { return true; } })(), playing: false, step: 0 };
  function ctx() {
    if (A.ctx) { if (A.ctx.state === 'suspended') A.ctx.resume(); return A.ctx; }
    var C = window.AudioContext || window.webkitAudioContext; if (!C) return null;
    A.ctx = new C(); A.fx = A.ctx.createGain(); A.fx.gain.value = .9; A.fx.connect(A.ctx.destination);
    A.mu = A.ctx.createGain(); A.mu.gain.value = 0; A.mu.connect(A.ctx.destination);
    var b = A.ctx.createBuffer(1, A.ctx.sampleRate * 2, A.ctx.sampleRate), d = b.getChannelData(0); for (var i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1; A.noise = b;
    return A.ctx;
  }
  function noise(t, len, type, f, q, vol, out, sweepTo) {
    var c = A.ctx, n = c.createBufferSource(), fl = c.createBiquadFilter(), g = c.createGain(); n.buffer = A.noise; fl.type = type; fl.frequency.setValueAtTime(f, t); fl.Q.value = q;
    if (sweepTo) fl.frequency.exponentialRampToValueAtTime(sweepTo, t + len);
    g.gain.setValueAtTime(.0001, t); g.gain.exponentialRampToValueAtTime(vol, t + Math.min(.25, len * .3)); g.gain.exponentialRampToValueAtTime(.0001, t + len);
    n.connect(fl); fl.connect(g); g.connect(out || A.fx); n.start(t, Math.random()); n.stop(t + len + .05);
  }
  function tone(t, f, len, type, vol, out, f2, cut) {
    var c = A.ctx, o = c.createOscillator(), g = c.createGain(), lp = c.createBiquadFilter(); o.type = type; o.frequency.setValueAtTime(f, t); if (f2) o.frequency.exponentialRampToValueAtTime(f2, t + len);
    lp.type = 'lowpass'; lp.frequency.value = cut || 3000; g.gain.setValueAtTime(.0001, t); g.gain.exponentialRampToValueAtTime(vol, t + .012); g.gain.exponentialRampToValueAtTime(.0001, t + len);
    o.connect(lp); lp.connect(g); g.connect(out || A.fx); o.start(t); o.stop(t + len + .03);
  }
  function grunt(t) { tone(t, 150, .2, 'sawtooth', .22, null, 115, 700); tone(t + .26, 175, .26, 'sawtooth', .24, null, 130, 800); }   // "Hò – dô!"
  function cheer(t, len, vol) { noise(t, len, 'bandpass', 1100, .6, vol); noise(t + .05, len * .9, 'bandpass', 2300, .8, vol * .6); }
  function pull(team) {
    if (!ctx() || A.ctx.state !== 'running') return; var t = A.ctx.currentTime;
    grunt(t); noise(t, .55, 'bandpass', 380, 6, .35, null, 950);   // dây căng kẽo kẹt
    tone(t + .5, 90, .3, 'sine', .5, null, 45);                      // dậm chân "thịch"
    cheer(t + .15, 1.4, .3);
  }
  function win() {
    if (!ctx() || A.ctx.state !== 'running') return; var t = A.ctx.currentTime;
    cheer(t, 3.2, .45); for (var i = 0; i < 16; i++) tone(t + i * .07, 120, .12, 'sine', .35, null, 60);   // trống dồn
  }
  // nhạc nền "trống hội" 116 BPM: trống cái tùng – cắc, sáo ngũ cung
  var MEL = [72, 74, 76, 79, 81, 79, 76, 74, 72, 76, 79, 81, 84, 81, 79, 76];
  function muStep(t, i) {
    var k = i % 16, phrase = Math.floor(i / 16) % 4;
    if (k === 0 || k === 3 || k === 8 || k === 11) tone(t, 95, .35, 'sine', .55, A.mu, 52);          // trống cái
    if (k === 4 || k === 12 || k === 14) tone(t, 1100, .05, 'square', .12, A.mu, 700, 4000);        // cắc
    if (k % 2 === 1) noise(t, .05, 'highpass', 6500, .7, .06, A.mu);
    if (k % 2 === 0) {
      var m = MEL[(k / 2 + phrase * 3) % 16] + (phrase === 3 ? 0 : -12);
      var c = A.ctx, o = c.createOscillator(), g = c.createGain(), lfo = c.createOscillator(), lg = c.createGain();
      o.type = 'triangle'; o.frequency.value = 440 * Math.pow(2, (m - 69) / 12); lfo.frequency.value = 5.5; lg.gain.value = 6; lfo.connect(lg); lg.connect(o.frequency);
      g.gain.setValueAtTime(.0001, t); g.gain.exponentialRampToValueAtTime(.11, t + .03); g.gain.exponentialRampToValueAtTime(.0001, t + .5);
      o.connect(g); g.connect(A.mu); o.start(t); lfo.start(t); o.stop(t + .55); lfo.stop(t + .55);
    }
    if (k === 0) tone(t, 130.8 * (phrase % 2 ? .75 : 1), 1.9, 'triangle', .07, A.mu, null, 600);  // bè trầm
  }
  function tick() { if (!A.playing) return; var spb = 60 / 116 / 4; while (A.next < A.ctx.currentTime + .15) { muStep(A.next, A.step); A.step++; A.next += spb; } }
  function musicStart() {
    if (!A.music || A.playing || !ctx()) return;
    A.playing = true; A.step = 0; A.next = A.ctx.currentTime + .08;
    A.mu.gain.cancelScheduledValues(A.ctx.currentTime); A.mu.gain.setTargetAtTime(.3, A.ctx.currentTime, .4);
    A.timer = setInterval(tick, 25); tick();
  }
  function musicStop() { if (!A.playing) return; A.playing = false; clearInterval(A.timer); if (A.mu) A.mu.gain.setTargetAtTime(0, A.ctx.currentTime, .2); }
  document.addEventListener('pointerdown', function () { if (A.ctx && A.ctx.state === 'suspended') A.ctx.resume(); }, { passive: true });
  window.TugAudio = {
    unlock: function () { ctx(); }, pull: pull, win: win, musicStart: musicStart, musicStop: musicStop, playing: function () { return A.playing; },
    musicOn: function (v) { if (v === undefined) return A.music; A.music = !!v; try { localStorage.setItem('tug_music', A.music ? 'on' : 'off'); } catch (e) {} if (!A.music) musicStop(); return A.music; }
  };
})();
