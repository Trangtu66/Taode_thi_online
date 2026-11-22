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
    bus: { w: 1.7, h: 1.3, l: 3.6, cab: [1.6, .3, 3.2, 0], wheel: .4, bus: true },
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
  function makeCar(key, color) {
    var s = SHAPE[key] || SHAPE.sport, g = new T.Group(), body = new T.Group(); g.add(body); mats(color);
    var parts = { paint: [], glass: [], dark: [], light: [], rider: [] };
    var box = function (w, h, l, m, x, y, z) { parts[m].push(new T.BoxGeometry(w, h, l).translate(x, y, z)); };
    var lift = s.wheel * .8, c = s.cab;
    box(s.w, s.h, s.l, 'paint', 0, lift + s.h / 2, 0);
    box(c[0], c[1], c[2], 'glass', 0, lift + s.h + c[1] / 2, c[3]);
    if (s.bus) box(s.w * .98, .5, s.l * .98, 'paint', 0, lift + s.h + c[1] + .25, 0);
    if (s.wing) { box(s.w * 1.3, .08, .5, 'paint', 0, lift + s.h + .45, -s.l / 2 + .2); box(.1, .45, .1, 'dark', 0, lift + s.h + .2, -s.l / 2 + .2); box(s.w * 1.2, .08, .4, 'paint', 0, lift + .15, s.l / 2 + .1); }
    if (s.spare) parts.dark.push(new T.CylinderGeometry(.4, .4, .25, 14).rotateX(Math.PI / 2).translate(0, lift + s.h / 2 + .1, -s.l / 2 - .12));
    if (s.moto) parts.rider.push(new T.SphereGeometry(.28, 10, 8).translate(0, lift + s.h + .75, -.1));
    box(.28, .14, .06, 'light', s.moto ? 0 : -s.w / 2 + .3, lift + s.h * .55, s.l / 2 + .01); if (!s.moto) box(.28, .14, .06, 'light', s.w / 2 - .3, lift + s.h * .55, s.l / 2 + .01);
    Object.keys(parts).forEach(function (k) {
      if (!parts[k].length) return;
      var m = new T.Mesh(merge(parts[k]), k === 'paint' ? MAT[color] : MAT[k]); m.castShadow = true; body.add(m);
    });
    // bánh xe: một trục trước, một trục sau (mỗi trục 1 lưới, quay quanh trục x)
    var wheels = [], tire = function (x) { return new T.CylinderGeometry(s.wheel, s.wheel, s.moto ? .18 : .32, 14).rotateZ(Math.PI / 2).translate(x, 0, 0); };
    var rim = function (x) { return new T.BoxGeometry(s.moto ? .2 : .34, s.wheel * 1.2, .12).translate(x, 0, 0); };
    (s.moto ? [s.l / 2 - .35, -s.l / 2 + .35] : [s.l / 2 - .6, -s.l / 2 + .6]).forEach(function (z) {
      var xs = s.moto ? [0] : [-s.w / 2, s.w / 2];
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
    if (!R.el.offsetParent) return;                     // tab đang ẩn: không vẽ
    var now = performance.now(), dt = Math.min(.05, (now - (R.last || now)) / 1000); R.last = now;
    var s = R.snapshot() || { state: 'idle', total: 0, lanes: [] };
    var total = s.total || R.preview || 10, n = s.lanes.length;
    if (n !== R.n || total !== R.total) { buildWorld(n, total); Object.keys(R.cars).forEach(function (id) { R.cars[id].obj.position.x = 0; }); }
    syncCars(s.lanes);
    var lead = -3, sumZ = 0, cnt = 0, t = now / 1000;
    Object.keys(R.cars).forEach(function (id) {
      var c = R.cars[id], l = c.data, o = c.obj, tz = targetZ(l, s.state);
      var dz = (tz - c.z) * Math.min(1, dt * 1.7); if (Math.abs(tz - c.z) < .01) dz = tz - c.z; c.z += dz;
      o.position.z = c.z; o.position.x += (laneX(c.lane) - o.position.x) * Math.min(1, dt * 4);
      var spin = dz / c.obj.userData.radius; c.obj.userData.wheels.forEach(function (w) { w.rotation.x += spin; });
      var body = o.userData.body;
      if (l.penalty) { body.rotation.y = Math.sin(t * 22) * .28; body.position.y = Math.abs(Math.sin(t * 15)) * .12; puff(c, o, dt); }
      else if (l.done) { body.rotation.y *= .9; body.position.y = Math.abs(Math.sin(t * 4 + c.lane)) * .25; }
      else { body.rotation.y *= .85; body.position.y = Math.abs(dz) > .02 ? Math.sin(t * 30) * .03 : 0; }
      var e = s.state === 'idle' ? '' : l.done ? '🏁' : l.penalty ? '💥' : l.asking ? '❓' : '';
      c.ico.visible = !!e; if (e && c.ico.material.map !== emojiTex(e)) { c.ico.material.map = emojiTex(e); c.ico.material.needsUpdate = true; }
      c.ico.position.y = 5.2 + Math.sin(t * 4) * .15;
      // nón đã vượt chuyển xám
      if (R.cones) for (var q = 0; q < R.total; q++) {
        var idx = q * R.n + c.lane, passed = q < (l.pos || 0) && s.state !== 'idle';
        if (R.coneState[idx] !== passed) { R.coneState[idx] = passed; R.cones.setColorAt(idx, new T.Color(passed ? 0x9ca3af : 0xf97316)); R.cones.instanceColor.needsUpdate = true; }
      }
      c.smoke = c.smoke.filter(function (p) { p.life -= dt; p.mesh.position.y += dt * 1.2; p.mesh.scale.multiplyScalar(1 + dt * .9); p.mesh.material.opacity = Math.max(0, p.life); if (p.life <= 0) { R.scene.remove(p.mesh); p.mesh.material.dispose(); } return p.life > 0; });
      lead = Math.max(lead, c.z); sumZ += c.z; cnt++;
    });
    moveCamera(lead, cnt ? sumZ / cnt : -3, dt);
    var r0 = performance.now(); R.renderer.render(R.scene, R.camera); R.ms = R.ms * .9 + (performance.now() - r0) * .1;
  }
  function puff(c, o, dt) {
    c.puffT = (c.puffT || 0) - dt; if (c.puffT > 0) return; c.puffT = .12;
    var m = sprite(emojiTex('💨'), .9, .9); m.material.opacity = .9; m.position.set(o.position.x + (Math.random() - .5), .6, o.position.z - 1.8); R.scene.add(m); c.smoke.push({ mesh: m, life: .9 });
  }
  function moveCamera(lead, avg, dt) {
    var W = R.roadW, cam = R.camera, p = new T.Vector3(), look = new T.Vector3(), mode = CAMS[R.cam];
    var focus = Math.max(-3, Math.min(R.L + 8, lead * .5 + avg * .5));
    if (mode === 'follow') { p.set(0, Math.max(7, W * .42), focus - Math.max(13, W * .55)); look.set(0, 0, focus + 10); }
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
    if (!R) return; cancelAnimationFrame(R.raf); if (R.ro) R.ro.disconnect();
    disposeTree(R.scene); R.renderer.dispose(); if (R.renderer.domElement.parentNode) R.renderer.domElement.remove(); R = null;
  }
  function camera() { if (!R) return CAM_NAME.follow; R.cam = (R.cam + 1) % CAMS.length; return CAM_NAME[CAMS[R.cam]]; }
  function preview(n) { if (R) R.preview = n || 10; }

  window.Race3D = { mount: mount, stop: stop, camera: camera, supported: supported, preview: preview, renderMs: function () { return R ? Math.round(R.ms * 10) / 10 : 0; }, calls: function () { return R ? R.renderer.info.render.calls : 0; }, camName: function () { return R ? CAM_NAME[CAMS[R.cam]] : CAM_NAME.follow; } };
})();
