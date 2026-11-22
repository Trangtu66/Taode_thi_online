// ĐUA XE KIẾN THỨC – MÀN CHIẾU 3D (Three.js). Chỉ thay phần hiển thị trên máy GV; luật chơi, điện thoại HS giữ nguyên.
// Dùng: Race3D.mount(el, snapshot)  – snapshot() trả {state, total, lanes:[{id, name, car, color, pos, done, penalty, asking, rank}]}
//       Race3D.camera()             – đổi góc quay: Bám đuôi dẫn đầu → Truyền hình (bên hông) → Toàn cảnh
//       Race3D.stop() / Race3D.supported()
(function () {
  'use strict';
  var THREE_URL = 'https://cdn.jsdelivr.net/npm/three@0.149.0/build/three.min.js';
  var T, R = null;            // THREE, trạng thái màn 3D
  var SEG = 16;               // khoảng cách giữa hai chướng ngại vật
  var CAMS = ['follow', 'tv', 'overview'], CAM_NAME = { follow: '🎥 Bám đuôi dẫn đầu', tv: '📺 Góc truyền hình', overview: '🛰️ Toàn cảnh' };

  function supported() {
    try { var c = document.createElement('canvas'); return !!(window.WebGLRenderingContext && (c.getContext('webgl') || c.getContext('experimental-webgl'))); } catch (e) { return false; }
  }
  function loadThree() {
    if (window.THREE) return Promise.resolve(window.THREE);
    return new Promise(function (ok, fail) {
      var s = document.createElement('script'); s.src = THREE_URL; s.onload = function () { ok(window.THREE); }; s.onerror = function () { fail(new Error('Không tải được thư viện 3D (kiểm tra mạng).')); };
      document.head.appendChild(s);
    });
  }

  // ---------------------------------------------------------------- tiện ích vẽ chữ
  function canvasTex(w, h, draw) {
    var c = document.createElement('canvas'); c.width = w; c.height = h; draw(c.getContext('2d'), w, h);
    var t = new T.CanvasTexture(c); t.anisotropy = 4; if (T.sRGBEncoding) t.encoding = T.sRGBEncoding; return t;
  }
  function roundRect(g, x, y, w, h, r) { g.beginPath(); g.moveTo(x + r, y); g.arcTo(x + w, y, x + w, y + h, r); g.arcTo(x + w, y + h, x, y + h, r); g.arcTo(x, y + h, x, y, r); g.arcTo(x, y, x + w, y, r); g.closePath(); }
  function labelTex(text, color, rank) {
    return canvasTex(512, 128, function (g, w, h) {
      g.fillStyle = 'rgba(15,23,42,.82)'; roundRect(g, 6, 14, w - 12, h - 28, 40); g.fill();
      g.fillStyle = color; g.beginPath(); g.arc(64, h / 2, 34, 0, Math.PI * 2); g.fill();
      g.fillStyle = '#fff'; g.font = '900 40px Arial'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(String(rank || ''), 64, h / 2 + 2);
      g.textAlign = 'left'; g.font = '800 44px Arial'; var t = String(text); while (g.measureText(t).width > w - 140 && t.length > 2) t = t.slice(0, -2);
      if (t !== String(text)) t += '…'; g.fillText(t, 112, h / 2 + 2);
    });
  }
  var emojiCache = {};
  function emojiTex(e) {
    if (!emojiCache[e]) emojiCache[e] = canvasTex(128, 128, function (g) { g.font = '96px "Segoe UI Emoji","Apple Color Emoji","Noto Color Emoji",sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(e, 64, 72); });
    emojiCache[e].userData.keep = true; return emojiCache[e];
  }
  function signTex(n) {
    return canvasTex(256, 128, function (g, w, h) {
      g.fillStyle = '#f59e0b'; roundRect(g, 4, 4, w - 8, h - 8, 18); g.fill(); g.strokeStyle = '#7c2d12'; g.lineWidth = 8; g.stroke();
      g.fillStyle = '#111827'; g.font = '900 64px Arial'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('❓ ' + n, w / 2, h / 2 + 4);
    });
  }

  // ---------------------------------------------------------------- mô hình xe low-poly
  var SHAPE = {
    f1: { w: 1.5, h: .38, l: 3.4, cab: [.55, .32, .8, .2], wheel: .42, wing: true },
    sport: { w: 1.6, h: .5, l: 3.2, cab: [1.25, .42, 1.4, -.1], wheel: .36 },
    jeep: { w: 1.7, h: .8, l: 3, cab: [1.5, .6, 1.5, -.3], wheel: .48, spare: true },
    bus: { w: 1.7, h: .9, l: 3.6, cab: [1.6, .3, 3.2, 0], wheel: .4, bus: true },
    pickup: { w: 1.7, h: .65, l: 3.4, cab: [1.5, .6, 1.3, .6], wheel: .44 },
    moto: { w: .5, h: .5, l: 2, cab: [.45, .55, .5, -.2], wheel: .4, moto: true }
  };
  // gộp các khối cùng vật liệu thành một lưới (ít lệnh vẽ: 40 xe vẫn mượt trên máy yếu)
  function merge(geos) {
    var pos = [], nor = [];
    geos.forEach(function (g) { var ng = g.index ? g.toNonIndexed() : g; Array.prototype.push.apply(pos, ng.attributes.position.array); Array.prototype.push.apply(nor, ng.attributes.normal.array); g.dispose(); if (ng !== g) ng.dispose(); });
    var out = new T.BufferGeometry(); out.setAttribute('position', new T.Float32BufferAttribute(pos, 3)); out.setAttribute('normal', new T.Float32BufferAttribute(nor, 3)); return out;
  }
  var MAT = {};
  function mats(color) {
    if (!MAT.glass) {
      MAT.glass = new T.MeshStandardMaterial({ color: 0x1e293b, roughness: .1, metalness: .6 }); MAT.dark = new T.MeshStandardMaterial({ color: 0x111827, roughness: .8 });
      MAT.light = new T.MeshStandardMaterial({ color: 0xfef9c3, emissive: 0xfef08a, emissiveIntensity: .8 }); MAT.rider = new T.MeshStandardMaterial({ color: 0xfde047 });
    }
    if (!MAT[color]) MAT[color] = new T.MeshStandardMaterial({ color: color, roughness: .35, metalness: .3 });
    return MAT;
  }
  // Xe 3D vẽ theo đúng hình xe HS chọn trên điện thoại (raceCarSvg): F1 có người lái mũ vàng, xe thể thao, xe địa hình có bánh dự phòng,
  // xe buýt mini dãy cửa kính, xe bán tải cabin trước – thùng sau, mô tô có người lái; cùng màu, cùng sọc trắng thân xe.
  function makeCar(key, color) {
    var s = SHAPE[key] || SHAPE.sport, g = new T.Group(), body = new T.Group(); g.add(body); mats(color);
    if (!MAT.white) { MAT.white = new T.MeshStandardMaterial({ color: 0xffffff, roughness: .5 }); MAT.helmet = new T.MeshStandardMaterial({ color: 0xfde047, roughness: .3, metalness: .2 }); }
    var parts = { paint: [], glass: [], dark: [], light: [], white: [], helmet: [] };
    var box = function (w, h, l, m, x, y, z) { parts[m].push(new T.BoxGeometry(w, h, l).translate(x, y, z)); };
    var ball = function (r, m, x, y, z) { parts[m].push(new T.SphereGeometry(r, 12, 10).translate(x, y, z)); };
    var lift = s.wheel * .8, top = lift + s.h, W = s.w, L = s.l;
    if (key === 'f1') {
      box(W * .55, s.h, L, 'paint', 0, lift + s.h / 2, 0);                                 // thân hẹp
      box(W, s.h * .7, L * .35, 'paint', 0, lift + s.h * .35, -.2);                        // hông
      box(W * 1.35, .08, .45, 'paint', 0, lift + .12, L / 2 + .05);                        // cánh trước
      box(W * 1.2, .08, .5, 'paint', 0, top + .45, -L / 2 + .2); box(.1, .45, .1, 'dark', 0, top + .2, -L / 2 + .2);   // cánh sau
      ball(.3, 'helmet', 0, top + .22, .15); box(.32, .1, .12, 'dark', 0, top + .26, .4);  // người lái mũ vàng, kính
      box(W * .57, .06, L * .8, 'white', 0, top + .005, 0);                                // sọc trắng
    } else if (key === 'sport') {
      box(W, s.h, L, 'paint', 0, lift + s.h / 2, 0);
      box(W * .8, .36, L * .42, 'glass', 0, top + .18, -.15); box(W * .82, .06, L * .3, 'paint', 0, top + .38, -.15);   // mui xe
      box(W + .02, .08, L * .9, 'white', 0, lift + s.h * .6, 0);
    } else if (key === 'jeep') {
      box(W, s.h, L, 'paint', 0, lift + s.h / 2, 0);
      box(W * .92, .55, L * .5, 'paint', 0, top + .27, -.25); box(W * .94, .32, L * .44, 'glass', 0, top + .3, -.25);   // cabin + kính
      parts.dark.push(new T.CylinderGeometry(.42, .42, .26, 14).rotateX(Math.PI / 2).translate(0, lift + s.h / 2 + .1, -L / 2 - .13));   // bánh dự phòng
      box(W + .02, .1, L * .95, 'white', 0, lift + s.h * .55, 0);
    } else if (key === 'bus') {
      box(W, s.h + .5, L, 'paint', 0, lift + (s.h + .5) / 2, 0);
      box(W + .03, .42, L * .82, 'glass', 0, top + .05, -.1); box(W * .9, .42, .04, 'glass', 0, top + .05, L / 2 + .01);   // dãy cửa kính, kính trước
      box(W + .03, .1, L * .98, 'white', 0, lift + s.h * .45, 0);
    } else if (key === 'pickup') {
      box(W, s.h, L, 'paint', 0, lift + s.h / 2, 0);
      box(W * .95, .6, L * .36, 'paint', 0, top + .3, L * .22); box(W * .97, .34, L * .3, 'glass', 0, top + .32, L * .24);  // cabin trước
      box(.1, .3, L * .5, 'paint', -W / 2 + .05, top + .15, -L * .24); box(.1, .3, L * .5, 'paint', W / 2 - .05, top + .15, -L * .24); box(W, .3, .1, 'paint', 0, top + .15, -L / 2 + .05);   // thùng sau
      box(W + .02, .08, L * .95, 'white', 0, lift + s.h * .55, 0);
    } else {   // mô tô
      box(W, s.h, L * .55, 'paint', 0, lift + s.h / 2 + .1, .1);
      box(.36, .55, .32, 'dark', 0, top + .35, -.15); ball(.26, 'paint', 0, top + .82, -.05); box(.24, .08, .1, 'dark', 0, top + .84, .18);   // người lái, mũ cùng màu xe
      box(.06, .5, .06, 'dark', 0, top + .1, .55);
    }
    box(.28, .14, .06, 'light', key === 'moto' ? 0 : -W / 2 + .3, lift + s.h * .55, L / 2 + .01); if (key !== 'moto') box(.28, .14, .06, 'light', W / 2 - .3, lift + s.h * .55, L / 2 + .01);
    Object.keys(parts).forEach(function (k) {
      if (!parts[k].length) return;
      var m = new T.Mesh(merge(parts[k]), k === 'paint' ? MAT[color] : MAT[k]); m.castShadow = true; body.add(m);
    });
    var wheels = [], tire = function (x) { return new T.CylinderGeometry(s.wheel, s.wheel, key === 'moto' ? .18 : .32, 14).rotateZ(Math.PI / 2).translate(x, 0, 0); };
    var rim = function (x) { return new T.BoxGeometry(key === 'moto' ? .2 : .34, s.wheel * 1.2, .12).translate(x, 0, 0); };
    (key === 'moto' ? [L / 2 - .35, -L / 2 + .35] : [L / 2 - .6, -L / 2 + .6]).forEach(function (z) {
      var xs = key === 'moto' ? [0] : [-W / 2, W / 2];
      var ax = new T.Mesh(merge(xs.map(tire).concat(xs.map(rim))), MAT.dark); ax.castShadow = true; ax.position.set(0, s.wheel, z); g.add(ax); wheels.push(ax);
    });
    g.userData = { body: body, wheels: wheels, radius: s.wheel };
    return g;
  }

  // ---------------------------------------------------------------- dựng cảnh theo số làn, số chướng ngại
  function sprite(tex, w, h) { var m = new T.Sprite(new T.SpriteMaterial({ map: tex, transparent: true, depthWrite: false })); m.scale.set(w, h, 1); return m; }

  function buildWorld(n, total) {
    var sc = R.scene; if (R.world) { sc.remove(R.world); disposeTree(R.world); }
    var W = R.world = new T.Group(); sc.add(W);
    var lw = n > 24 ? 2.4 : n > 12 ? 2.9 : 3.4, roadW = Math.max(n, 1) * lw + 3, L = SEG * (total + 1);
    R.lw = lw; R.roadW = roadW; R.L = L; R.n = n; R.total = total;
    R.renderer.shadowMap.enabled = n <= 16; R.sun.castShadow = n <= 16;
    var ground = new T.Mesh(new T.PlaneGeometry(roadW + 400, L + 500), new T.MeshStandardMaterial({ color: 0x3f9e4d, roughness: 1 }));
    ground.rotation.x = -Math.PI / 2; ground.position.set(0, -.02, L / 2); ground.receiveShadow = true; W.add(ground);
    var road = new T.Mesh(new T.PlaneGeometry(roadW, L + 60), new T.MeshStandardMaterial({ color: 0x374151, roughness: .9 }));
    road.rotation.x = -Math.PI / 2; road.position.set(0, 0, L / 2 + 10); road.receiveShadow = true; W.add(road);
    // lề đường sọc đỏ trắng
    var curbN = Math.ceil((L + 60) / 2), curb = new T.InstancedMesh(new T.BoxGeometry(.6, .12, 2), new T.MeshStandardMaterial(), curbN * 2), m4 = new T.Matrix4(), col = new T.Color();
    for (var i = 0; i < curbN; i++) for (var sd = 0; sd < 2; sd++) {
      m4.makeTranslation((sd ? 1 : -1) * (roadW / 2 + .3), .06, -20 + i * 2 + 1); curb.setMatrixAt(i * 2 + sd, m4);
      curb.setColorAt(i * 2 + sd, col.set(i % 2 ? 0xffffff : 0xdc2626));
    }
    W.add(curb);
    // vạch chia làn đứt khúc
    if (n > 1) {
      var dashN = Math.ceil((L + 40) / 4), dash = new T.InstancedMesh(new T.BoxGeometry(.12, .02, 1.6), new T.MeshBasicMaterial({ color: 0xf8fafc }), dashN * (n - 1)), k = 0;
      for (var ln = 1; ln < n; ln++) for (var d = 0; d < dashN; d++) { m4.makeTranslation(-roadW / 2 + 1.5 + ln * lw, .02, -10 + d * 4); dash.setMatrixAt(k++, m4); }
      W.add(dash);
    }
    // vạch xuất phát, cổng về đích
    var checker = canvasTex(256, 32, function (g, w, h) { for (var x = 0; x < 16; x++) for (var y = 0; y < 2; y++) { g.fillStyle = (x + y) % 2 ? '#111' : '#fff'; g.fillRect(x * 16, y * 16, 16, 16); } });
    checker.wrapS = T.RepeatWrapping; checker.repeat.set(Math.max(1, roadW / 8), 1);
    [0, L].forEach(function (z) { var p = new T.Mesh(new T.PlaneGeometry(roadW, 1.6), new T.MeshBasicMaterial({ map: checker })); p.rotation.x = -Math.PI / 2; p.position.set(0, .03, z); W.add(p); });
    var postM = new T.MeshStandardMaterial({ color: 0xe5e7eb, metalness: .4, roughness: .4 });
    [-1, 1].forEach(function (sd) { var post = new T.Mesh(new T.CylinderGeometry(.35, .35, 8, 12), postM); post.position.set(sd * (roadW / 2 + 1), 4, L); post.castShadow = true; W.add(post); });
    var finM = new T.MeshBasicMaterial({ map: canvasTex(1024, 128, function (g, w, h) { g.fillStyle = '#dc2626'; g.fillRect(0, 0, w, h); g.fillStyle = '#fff'; g.font = '900 84px Arial'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('🏁 VỀ ĐÍCH 🏁', w / 2, h / 2 + 4); }) });
    var banner = new T.Mesh(new T.BoxGeometry(roadW + 2.6, 2, .3), [postM, postM, postM, postM, finM, finM]);
    banner.position.set(0, 8, L); W.add(banner);
    var startB = banner.clone(); startB.material = banner.material.slice(); startB.material[4] = startB.material[5] = new T.MeshBasicMaterial({ map: canvasTex(1024, 128, function (g, w, h) { g.fillStyle = '#16a34a'; g.fillRect(0, 0, w, h); g.fillStyle = '#fff'; g.font = '900 84px Arial'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('🚦 XUẤT PHÁT', w / 2, h / 2 + 4); }) });
    startB.position.set(0, 8, 0); W.add(startB);
    [-1, 1].forEach(function (sd) { var post = new T.Mesh(new T.CylinderGeometry(.35, .35, 8, 12), postM); post.position.set(sd * (roadW / 2 + 1), 4, 0); W.add(post); });
    // chướng ngại vật: mỗi làn một cọc nón (đổi màu xám khi xe làn đó đã vượt), mỗi chặng một biển số câu
    R.cones = null;
    if (total && n) {
      var cone = new T.InstancedMesh(new T.ConeGeometry(.42, 1.1, 14), new T.MeshStandardMaterial({ roughness: .5 }), n * total);
      cone.castShadow = true;
      for (var q = 0; q < total; q++) {
        for (var l2 = 0; l2 < n; l2++) { m4.makeTranslation(laneX(l2), .55, coneZ(q)); cone.setMatrixAt(q * n + l2, m4); cone.setColorAt(q * n + l2, col.set(0xf97316)); }
        var sg = sprite(signTex(q + 1), 3.2, 1.6); sg.position.set(-roadW / 2 - 2.6, 2.6, coneZ(q)); W.add(sg);
        var sg2 = sprite(signTex(q + 1), 3.2, 1.6); sg2.position.set(roadW / 2 + 2.6, 2.6, coneZ(q)); W.add(sg2);
      }
      W.add(cone); R.cones = cone; R.coneState = new Array(n * total).fill(false);
    }
    // cây, đồi hai bên đường
    var treeN = Math.ceil((L + 120) / 7) * 2, trunk = new T.InstancedMesh(new T.CylinderGeometry(.18, .25, 1.4, 6), new T.MeshStandardMaterial({ color: 0x92400e }), treeN),
        leaf = new T.InstancedMesh(new T.ConeGeometry(1.3, 3, 8), new T.MeshStandardMaterial({ color: 0x15803d, roughness: .9 }), treeN), rnd = mulberry(7);
    for (var t = 0; t < treeN; t++) {
      var side = t % 2 ? 1 : -1, x = side * (roadW / 2 + 6 + rnd() * 30), z = -40 + Math.floor(t / 2) * 7 + rnd() * 4, s = .8 + rnd() * .9;
      m4.makeScale(s, s, s).setPosition(x, .7 * s, z); trunk.setMatrixAt(t, m4); m4.makeScale(s, s, s).setPosition(x, 2.8 * s, z); leaf.setMatrixAt(t, m4);
      leaf.setColorAt(t, col.set(rnd() > .5 ? 0x15803d : 0x16a34a));
    }
    trunk.castShadow = leaf.castShadow = true; W.add(trunk); W.add(leaf);
    var hillM = new T.MeshStandardMaterial({ color: 0x4d7c0f, roughness: 1, flatShading: true });
    for (var hh = 0; hh < 14; hh++) { var hill = new T.Mesh(new T.ConeGeometry(18 + rnd() * 20, 14 + rnd() * 18, 7), hillM); hill.position.set((hh % 2 ? 1 : -1) * (roadW / 2 + 70 + rnd() * 50), 6, -60 + hh * (L + 160) / 14); W.add(hill); }
    // ánh nắng theo chiều dài đường
    R.sun.position.set(30, 60, L * .3); R.sun.target.position.set(0, 0, L * .5);
    var cam = R.sun.shadow.camera, half = Math.max(roadW, L) * .6; cam.left = -half; cam.right = half; cam.top = half; cam.bottom = -half; cam.far = 400; cam.updateProjectionMatrix();
  }
  function laneX(i) { return -R.roadW / 2 + 1.5 + (i + .5) * R.lw; }
  function coneZ(q) { return SEG * (q + 1); }
  function targetZ(l, state) {
    if (!R.total || state === 'idle' || state === 'countdown' || !l) return -3;
    if (l.done) return R.L + 7;
    return coneZ(l.pos) - 4.5;
  }
  function mulberry(a) { return function () { a |= 0; a = a + 0x6D2B79F5 | 0; var t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
  function disposeTree(o) { var shared = {}; Object.keys(MAT).forEach(function (k) { shared[MAT[k].uuid] = 1; }); o.traverse(function (x) { if (x.geometry) x.geometry.dispose(); var m = x.material; (Array.isArray(m) ? m : m ? [m] : []).forEach(function (mm) { if (shared[mm.uuid]) return; if (mm.map && !mm.map.userData.keep) mm.map.dispose(); mm.dispose(); }); }); }


  // ---------------------------------------------------------------- ÂM THANH ĐỘNG CƠ (Web Audio, tổng hợp – không cần file mp3)
  // Tiếng máy nổ chung của cả đường đua: ga tăng khi có xe đang chạy; tiếng rồ ga khi một xe vượt chướng ngại;
  // tiếng phanh trượt bánh khi trả lời sai; còi khi về đích. Tắt/bật: Race3D.engine(true|false); tôn trọng nút tắt âm của trang.
  var AU = { on: (function () { try { return localStorage.getItem('race_engine') !== 'off'; } catch (e) { return true; } })() };
  function auInit() {
    if (AU.ctx) { if (AU.ctx.state === 'suspended') AU.ctx.resume(); return AU.ctx; }
    var C = window.AudioContext || window.webkitAudioContext; if (!C) return null;
    var ctx = AU.ctx = new C(), out = AU.out = ctx.createGain(); out.gain.value = 0; out.connect(ctx.destination);
    var lp = AU.lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 500; lp.Q.value = 4; lp.connect(out);
    var shaper = ctx.createWaveShaper(), curve = new Float32Array(256);
    for (var i = 0; i < 256; i++) { var x = i / 128 - 1; curve[i] = Math.tanh(x * 2.5); } shaper.curve = curve;
    var am = AU.am = ctx.createGain(); am.gain.value = 1; shaper.connect(am); am.connect(lp);
    AU.o1 = ctx.createOscillator(); AU.o1.type = 'sawtooth'; AU.o2 = ctx.createOscillator(); AU.o2.type = 'square'; AU.o3 = ctx.createOscillator(); AU.o3.type = 'sawtooth';
    var g1 = ctx.createGain(), g2 = ctx.createGain(), g3 = ctx.createGain(); g1.gain.value = .5; g2.gain.value = .3; g3.gain.value = .25;
    AU.o1.connect(g1); AU.o2.connect(g2); AU.o3.connect(g3); g1.connect(shaper); g2.connect(shaper); g3.connect(shaper);
    // tiếng nổ lụp bụp của máy: LFO điều biên
    AU.lfo = ctx.createOscillator(); AU.lfo.type = 'square'; AU.lfo.frequency.value = 12; var lfoG = ctx.createGain(); lfoG.gain.value = .35; AU.lfo.connect(lfoG); lfoG.connect(am.gain);
    [AU.o1, AU.o2, AU.o3, AU.lfo].forEach(function (o) { o.start(); });
    AU.rpm = 0; AU.lastRev = 0;
    var noise = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate), d = noise.getChannelData(0); for (var k = 0; k < d.length; k++) d[k] = Math.random() * 2 - 1; AU.noise = noise;
    return ctx;
  }
  function auMuted(s) { return !AU.on || (s && s.muted); }
  function auEngine(s, speed, moving, dt, visible) {
    if (!AU.ctx) return;
    var t = AU.ctx.currentTime, run = (s.state === 'running' || s.state === 'countdown') && visible && !auMuted(s);
    var want = !run ? 0 : Math.min(1, .12 + speed / 11 * .7 + Math.min(moving, 8) * .03);
    AU.rpm += (want - AU.rpm) * Math.min(1, dt * (want > AU.rpm ? 3 : 1.3));
    var f = 38 + AU.rpm * 120;
    AU.o1.frequency.setTargetAtTime(f, t, .05); AU.o2.frequency.setTargetAtTime(f / 2, t, .05); AU.o3.frequency.setTargetAtTime(f * 1.01 + 1.5, t, .05);
    AU.lp.frequency.setTargetAtTime(320 + AU.rpm * 1500, t, .08); AU.lfo.frequency.setTargetAtTime(9 + AU.rpm * 30, t, .08);
    AU.out.gain.setTargetAtTime(run ? .05 + AU.rpm * .09 : 0, t, run ? .15 : .25);
  }
  function auRev() {   // rồ ga khi một xe vượt chướng ngại
    if (!AU.ctx || AU.ctx.state !== 'running') return; var ctx = AU.ctx, t = ctx.currentTime;
    if (t - AU.lastRev < .18) return; AU.lastRev = t;
    var o = ctx.createOscillator(), g = ctx.createGain(), lp = ctx.createBiquadFilter(); o.type = 'sawtooth'; lp.type = 'lowpass'; lp.frequency.value = 1400;
    o.frequency.setValueAtTime(70, t); o.frequency.exponentialRampToValueAtTime(230, t + .35); o.frequency.exponentialRampToValueAtTime(150, t + .7);
    g.gain.setValueAtTime(.0001, t); g.gain.exponentialRampToValueAtTime(.09, t + .05); g.gain.exponentialRampToValueAtTime(.0001, t + .75);
    o.connect(lp); lp.connect(g); g.connect(ctx.destination); o.start(t); o.stop(t + .8);
  }
  function auSkid() {  // phanh rít + va chạm khi trả lời sai
    if (!AU.ctx || AU.ctx.state !== 'running') return; var ctx = AU.ctx, t = ctx.currentTime;
    var n = ctx.createBufferSource(), bp = ctx.createBiquadFilter(), g = ctx.createGain(); n.buffer = AU.noise;
    bp.type = 'bandpass'; bp.Q.value = 9; bp.frequency.setValueAtTime(2600, t); bp.frequency.exponentialRampToValueAtTime(1100, t + .7);
    g.gain.setValueAtTime(.0001, t); g.gain.exponentialRampToValueAtTime(.12, t + .04); g.gain.exponentialRampToValueAtTime(.0001, t + .8);
    n.connect(bp); bp.connect(g); g.connect(ctx.destination); n.start(t); n.stop(t + .85);
    var o = ctx.createOscillator(), og = ctx.createGain(); o.type = 'sine'; o.frequency.setValueAtTime(120, t + .55); o.frequency.exponentialRampToValueAtTime(40, t + .8);
    og.gain.setValueAtTime(.0001, t + .55); og.gain.exponentialRampToValueAtTime(.18, t + .57); og.gain.exponentialRampToValueAtTime(.0001, t + .85);
    o.connect(og); og.connect(ctx.destination); o.start(t + .55); o.stop(t + .9);
  }
  function auHorn() {  // còi xe khi về đích
    if (!AU.ctx || AU.ctx.state !== 'running') return; var ctx = AU.ctx, t = ctx.currentTime;
    [0, .38].forEach(function (d) {
      [440, 554].forEach(function (f) {
        var o = ctx.createOscillator(), g = ctx.createGain(), lp = ctx.createBiquadFilter(); o.type = 'square'; o.frequency.value = f; lp.type = 'lowpass'; lp.frequency.value = 1800;
        g.gain.setValueAtTime(.0001, t + d); g.gain.exponentialRampToValueAtTime(.05, t + d + .02); g.gain.setValueAtTime(.05, t + d + .26); g.gain.exponentialRampToValueAtTime(.0001, t + d + .32);
        o.connect(lp); lp.connect(g); g.connect(ctx.destination); o.start(t + d); o.stop(t + d + .34);
      });
    });
  }
  function auEvents(c, l, s) {
    var muted = auMuted(s) || s.state !== 'running';
    if (c.pp !== undefined && !muted) {
      if (l.done && !c.pd) auHorn();
      else if ((l.pos || 0) > c.pp) auRev();
      if (l.penalty && !c.pn) auSkid();
    }
    c.pp = l.pos || 0; c.pd = !!l.done; c.pn = !!l.penalty;
  }
  function engine(on) {
    if (on === undefined) return AU.on;
    AU.on = !!on; try { localStorage.setItem('race_engine', AU.on ? 'on' : 'off'); } catch (e) {}
    if (AU.on) auInit(); return AU.on;
  }
  function unlock() { if (AU.on) auInit(); }


  // ---------------------------------------------------------------- NHẠC NỀN ĐUA XE (tổng hợp bằng Web Audio, lặp liên tục, không cần file mp3)
  // Nhịp 140 BPM: trống (kick, clap, hi-hat), bass chạy móc, giai điệu arpeggio; chặng cuối (có xe sắp về đích) nhạc nhanh, dồn dập hơn.
  // Dùng cả ở dạng 2D và 3D: RaceMusic.start() / stop() / on(true|false) / intensity(0|1)
  var MU = { on: (function () { try { return localStorage.getItem('race_music') !== 'off'; } catch (e) { return true; } })(), playing: false, step: 0, hot: 0 };
  var CHORDS = [[57, 60, 64], [53, 57, 60], [48, 52, 55], [55, 59, 62]];   // Am – F – C – G (số MIDI)
  function hz(m) { return 440 * Math.pow(2, (m - 69) / 12); }
  function muNode() {
    var ctx = auInit(); if (!ctx) return null;
    if (!MU.out) { MU.out = ctx.createGain(); MU.out.gain.value = 0; MU.out.connect(ctx.destination); }
    return ctx;
  }
  function muKick(t) { var c = AU.ctx, o = c.createOscillator(), g = c.createGain(); o.frequency.setValueAtTime(150, t); o.frequency.exponentialRampToValueAtTime(42, t + .22); g.gain.setValueAtTime(.9, t); g.gain.exponentialRampToValueAtTime(.001, t + .26); o.connect(g); g.connect(MU.out); o.start(t); o.stop(t + .28); }
  function muNoise(t, len, freq, vol, type) {
    var c = AU.ctx, n = c.createBufferSource(), f = c.createBiquadFilter(), g = c.createGain(); n.buffer = AU.noise; f.type = type || 'highpass'; f.frequency.value = freq;
    g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(.001, t + len); n.connect(f); f.connect(g); g.connect(MU.out); n.start(t, Math.random() * .5); n.stop(t + len + .02);
  }
  function muTone(t, f, len, type, vol, cut) {
    var c = AU.ctx, o = c.createOscillator(), g = c.createGain(), lp = c.createBiquadFilter(); o.type = type; o.frequency.value = f; lp.type = 'lowpass'; lp.frequency.value = cut || 2400;
    g.gain.setValueAtTime(.0001, t); g.gain.exponentialRampToValueAtTime(vol, t + .01); g.gain.exponentialRampToValueAtTime(.0001, t + len); o.connect(lp); lp.connect(g); g.connect(MU.out); o.start(t); o.stop(t + len + .02);
  }
  function muStep(t, i) {
    var bar = Math.floor(i / 16) % 4, k = i % 16, ch = CHORDS[bar], hot = MU.hot;
    if (k % 4 === 0) muKick(t);
    if (hot && k % 4 === 2) muKick(t);
    if (k === 4 || k === 12) muNoise(t, .16, 1500, .5, 'bandpass');
    if (k % 2 === 1 || hot) muNoise(t, .04, 7500, k % 4 === 2 ? .22 : .12);
    if (k % 2 === 0) muTone(t, hz(ch[0] - 24 + (k % 4 === 2 ? 12 : 0)), .2, 'sawtooth', .28, 700);       // bass móc
    var lead = hot || bar % 2 === 1 || (Math.floor(i / 64) % 2 === 1);
    if (lead) muTone(t, hz(ch[[0, 1, 2, 1][k % 4]] + 12 + (k >= 8 ? 12 : 0)), .12, 'square', .07, 3000);  // arpeggio
    if (k === 0) muTone(t, hz(ch[2] + 12), .9, 'triangle', .05, 1800);                                      // nốt đệm dài
  }
  function muTick() {
    if (!MU.playing || !AU.ctx) return;
    var c = AU.ctx, spb = 60 / (MU.hot ? 154 : 140) / 4;
    while (MU.next < c.currentTime + .15) { muStep(MU.next, MU.step); MU.step++; MU.next += spb; }
  }
  function musicStart() {
    if (!MU.on || MU.playing) return;
    var c = muNode(); if (!c) return;
    MU.playing = true; MU.step = 0; MU.next = c.currentTime + .08;
    MU.out.gain.cancelScheduledValues(c.currentTime); MU.out.gain.setTargetAtTime(.32, c.currentTime, .3);
    MU.timer = setInterval(muTick, 25); muTick();
  }
  function musicStop() {
    if (!MU.playing) return; MU.playing = false; clearInterval(MU.timer);
    if (MU.out && AU.ctx) MU.out.gain.setTargetAtTime(0, AU.ctx.currentTime, .15);
  }
  window.RaceMusic = {
    start: musicStart, stop: musicStop, playing: function () { return MU.playing; },
    intensity: function (v) { MU.hot = v ? 1 : 0; },
    on: function (v) { if (v === undefined) return MU.on; MU.on = !!v; try { localStorage.setItem('race_music', MU.on ? 'on' : 'off'); } catch (e) {} if (!MU.on) musicStop(); return MU.on; }
  };

  // ---------------------------------------------------------------- xe từng học sinh
  function syncCars(lanes) {
    var seen = {};
    lanes.forEach(function (l, i) {
      seen[l.id] = 1;
      var c = R.cars[l.id];
      if (!c || c.key !== l.car) {
        if (c) { R.scene.remove(c.obj); disposeTree(c.obj); }
        var obj = makeCar(l.car, l.color); obj.position.set(laneX(i), 0, -3);
        var lab = sprite(labelTex(l.name, l.color, i + 1), 6.4, 1.6); obj.add(lab); lab.position.set(0, 3.4, 0);
        var ico = sprite(emojiTex('❓'), 1.3, 1.3); ico.visible = false; obj.add(ico); ico.position.set(0, 5.2, 0);
        R.scene.add(obj);
        c = R.cars[l.id] = { obj: obj, key: l.car, z: c ? c.z : -3, lab: lab, ico: ico, labKey: '', smoke: [] };
      }
      c.lane = i;
      var lk = l.name + '|' + l.rank;
      if (c.labKey !== lk) { c.labKey = lk; c.lab.material.map.dispose(); c.lab.material.map = labelTex(l.name, l.color, l.rank || i + 1); c.lab.material.needsUpdate = true; }
      c.data = l;
    });
    Object.keys(R.cars).forEach(function (id) { if (!seen[id]) { R.scene.remove(R.cars[id].obj); disposeTree(R.cars[id].obj); delete R.cars[id]; } });
  }

  function frame() {
    if (!R) return;
    R.raf = requestAnimationFrame(frame);
    if (!R.el.offsetParent) { auEngine({ state: 'idle' }, 0, 0, .05, false); return; }   // tab đang ẩn: không vẽ, tắt máy
    var now = performance.now(), dt = Math.min(.05, (now - (R.last || now)) / 1000); R.last = now;
    var s = R.snapshot() || { state: 'idle', total: 0, lanes: [] };
    var total = s.total || R.preview || 10, n = s.lanes.length;
    if (n !== R.n || total !== R.total) { buildWorld(n, total); Object.keys(R.cars).forEach(function (id) { R.cars[id].obj.position.x = 0; }); }
    syncCars(s.lanes);
    var lead = -3, sumZ = 0, cnt = 0, t = now / 1000, speed = 0, moving = 0;
    Object.keys(R.cars).forEach(function (id) {
      var c = R.cars[id], l = c.data, o = c.obj, tz = targetZ(l, s.state), dz;
      // đang chạy sau câu đúng: đi đều từ chướng ngại cũ tới chướng ngại mới đúng bằng thời gian chạy (đúng liên tiếp chạy lâu hơn)
      var since = Date.now() - (l.passAt || 0), driving = s.state === 'running' && l.driveMs > 0 && l.pos > 0 && since < l.driveMs;
      if (driving) {
        var f = since / l.driveMs, e = f < .5 ? 2 * f * f : 1 - Math.pow(-2 * f + 2, 2) / 2, from = coneZ(l.pos - 1) - 4.5;
        dz = from + (tz - from) * e - c.z; if (dz < 0) dz = 0; c.z += dz;
      } else { dz = (tz - c.z) * Math.min(1, dt * 1.7); if (Math.abs(tz - c.z) < .01) dz = tz - c.z; c.z += dz; }
      c.turbo = driving && l.streak >= 2;
      o.position.z = c.z; o.position.x += (laneX(c.lane) - o.position.x) * Math.min(1, dt * 4);
      var spin = dz / c.obj.userData.radius; c.obj.userData.wheels.forEach(function (w) { w.rotation.x += spin; });
      var body = o.userData.body;
      if (l.penalty) { body.rotation.y = Math.sin(t * 22) * .28; body.position.y = Math.abs(Math.sin(t * 15)) * .12; puff(c, o, dt); }
      else if (l.done) { body.rotation.y *= .9; body.position.y = Math.abs(Math.sin(t * 4 + c.lane)) * .25; }
      else { body.rotation.y *= .85; body.position.y = Math.abs(dz) > .02 ? Math.sin(t * 30) * .03 : 0; }
      var e = s.state === 'idle' ? '' : c.turbo ? '🔥' : l.done ? '🏁' : l.penalty ? '💥' : l.asking ? '❓' : '';
      if (c.turbo) puffFire(c, o, dt);
      c.ico.visible = !!e; if (e && c.ico.material.map !== emojiTex(e)) { c.ico.material.map = emojiTex(e); c.ico.material.needsUpdate = true; }
      c.ico.position.y = 5.2 + Math.sin(t * 4) * .15;
      // nón đã vượt chuyển xám
      if (R.cones) for (var q = 0; q < R.total; q++) {
        var idx = q * R.n + c.lane, passed = q < (l.pos || 0) && s.state !== 'idle';
        if (R.coneState[idx] !== passed) { R.coneState[idx] = passed; R.cones.setColorAt(idx, new T.Color(passed ? 0x9ca3af : 0xf97316)); R.cones.instanceColor.needsUpdate = true; }
      }
      c.smoke = c.smoke.filter(function (p) { p.life -= dt; p.mesh.position.y += dt * 1.2; p.mesh.scale.multiplyScalar(1 + dt * .9); p.mesh.material.opacity = Math.max(0, p.life); if (p.life <= 0) { R.scene.remove(p.mesh); p.mesh.material.dispose(); } return p.life > 0; });
      var v = Math.abs(dz) / Math.max(dt, .001); speed = Math.max(speed, v); if (v > 1) moving++; auEvents(c, l, s);
      lead = Math.max(lead, c.z); sumZ += c.z; cnt++;
    });
    auEngine(s, speed, moving, dt, true);
    moveCamera(lead, cnt ? sumZ / cnt : -3, dt);
    var r0 = performance.now(); R.renderer.render(R.scene, R.camera); R.ms = R.ms * .9 + (performance.now() - r0) * .1;
  }
  function puff(c, o, dt) {
    c.puffT = (c.puffT || 0) - dt; if (c.puffT > 0) return; c.puffT = .12;
    var m = sprite(emojiTex('💨'), .9, .9); m.material.opacity = .9; m.position.set(o.position.x + (Math.random() - .5), .6, o.position.z - 1.8); R.scene.add(m); c.smoke.push({ mesh: m, life: .9 });
  }
  function puffFire(c, o, dt) {   // lửa phụt sau xe khi tăng tốc
    c.fireT = (c.fireT || 0) - dt; if (c.fireT > 0) return; c.fireT = .07;
    var m = sprite(emojiTex('🔥'), .8, .8); m.material.opacity = .95; m.position.set(o.position.x + (Math.random() - .5) * .4, .5, o.position.z - 2); R.scene.add(m); c.smoke.push({ mesh: m, life: .5 });
  }
  function moveCamera(lead, avg, dt) {
    var W = R.roadW, cam = R.camera, p = new T.Vector3(), look = new T.Vector3(), mode = CAMS[R.cam];
    var focus = Math.max(-3, Math.min(R.L + 8, lead * .5 + avg * .5));
    if (mode === 'follow') { p.set(0, Math.max(10.5, W * .42), focus - Math.max(13, W * .55)); look.set(0, 0, focus + 10); }
    else if (mode === 'tv') { p.set(W / 2 + Math.max(10, W * .35), Math.max(6, W * .18), focus - 8); look.set(0, 0, focus + 6); }
    else { p.set(W * .5 + 6, Math.max(R.L * .34, W * .8) + 8, -10); look.set(0, 0, R.L * .42); }
    var k = Math.min(1, dt * 2.2); cam.position.lerp(p, k); R.look.lerp(look, k); cam.lookAt(R.look);
  }

  function resize() {
    if (!R) return; var w = R.el.clientWidth || 800, h = R.el.clientHeight || 450;
    R.renderer.setSize(w, h, false); R.camera.aspect = w / h; R.camera.updateProjectionMatrix();
  }

  function mount(el, snapshot, opts) {
    if (!supported()) return Promise.reject(new Error('Máy này chưa hỗ trợ đồ hoạ 3D (WebGL).'));
    return loadThree().then(function (THREE) {
      T = THREE; if (T.ColorManagement) T.ColorManagement.legacyMode = false;
      if (R && R.el === el) { R.snapshot = snapshot; if (!R.raf) frame(); return R; }
      stop();
      var renderer = new T.WebGLRenderer({ antialias: true }); renderer.setPixelRatio(Math.min(1.5, window.devicePixelRatio || 1));
      renderer.shadowMap.enabled = true; renderer.shadowMap.type = T.PCFSoftShadowMap; if (T.sRGBEncoding) renderer.outputEncoding = T.sRGBEncoding;
      renderer.domElement.style.cssText = 'width:100%;height:100%;display:block';
      el.innerHTML = ''; el.appendChild(renderer.domElement);
      var scene = new T.Scene(); scene.background = new T.Color(0x9bd7ff); scene.fog = new T.Fog(0x9bd7ff, 120, 420);
      var camera = new T.PerspectiveCamera(50, 16 / 9, .5, 1200);
      scene.add(new T.HemisphereLight(0xffffff, 0x4d7c0f, .75));
      var sun = new T.DirectionalLight(0xffffff, .95); sun.castShadow = true; sun.shadow.mapSize.set(2048, 2048); scene.add(sun); scene.add(sun.target);
      R = { el: el, renderer: renderer, scene: scene, camera: camera, sun: sun, cars: {}, snapshot: snapshot, look: new T.Vector3(0, 0, 10), cam: 0, ms: 0, n: -1, total: -1, preview: (opts && opts.preview) || 10 };
      camera.position.set(0, 12, -18);
      R.ro = new ResizeObserver(resize); R.ro.observe(el); resize();
      frame();
      return R;
    });
  }
  function stop() {
    if (!R) return; cancelAnimationFrame(R.raf); if (R.ro) R.ro.disconnect(); if (AU.out) AU.out.gain.value = 0;
    disposeTree(R.scene); R.renderer.dispose(); if (R.renderer.domElement.parentNode) R.renderer.domElement.remove(); R = null;
  }
  function camera() { if (!R) return CAM_NAME.follow; R.cam = (R.cam + 1) % CAMS.length; return CAM_NAME[CAMS[R.cam]]; }
  function preview(n) { if (R) R.preview = n || 10; }

  document.addEventListener('pointerdown', function () { if (R && AU.on) auInit(); }, { passive: true });
  window.Race3D = { audio: function () { return AU.ctx ? { state: AU.ctx.state, rpm: Math.round(AU.rpm * 100) / 100, gain: Math.round(AU.out.gain.value * 1000) / 1000 } : null; }, engine: engine, unlock: unlock, mount: mount, stop: stop, camera: camera, supported: supported, preview: preview, renderMs: function () { return R ? Math.round(R.ms * 10) / 10 : 0; }, calls: function () { return R ? R.renderer.info.render.calls : 0; }, camName: function () { return R ? CAM_NAME[CAMS[R.cam]] : CAM_NAME.follow; } };
})();
