// KÉO CO KIẾN THỨC – MÀN CHIẾU 3D (Three.js) + ÂM THANH (Web Audio tổng hợp, không cần file mp3).
// Chỉ thay phần hiển thị và âm thanh trên máy GV; luật chơi, chấm điểm, điện thoại HS giữ nguyên.
// Tug3D.mount(el, snapshot)  – snapshot() trả {pos (-5..5, âm: Đỏ thắng thế), redScore, blueScore, red:[tên], blue:[tên]}
// TugAudio.pull(team) / win(team) – nhạc mừng chiến thắng / victoryStop() / musicStart() / musicStop() / musicOn(v) / unlock()
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

  // ---------------------------------------------------------------- nhân vật học sinh (áo cổ trắng, không khăn quàng)
  var MAT = {};
  function mat(k, c) { if (!MAT[k]) MAT[k] = new T.MeshStandardMaterial({ color: c, roughness: .6 }); return MAT[k]; }
  // 22/11/2026: nhân vật tỉ lệ người thật (~6,5 đầu), tay chân bo tròn có khớp khuỷu – gối;
  // mỗi khung hình tính IK 2 đoạn: tay luôn nắm đúng dây, chân bám đất, thân ngả theo nhịp kéo.
  var GEO = {}, YAX, ZAX;
  function geo(k, make) { return GEO[k] || (GEO[k] = make()); }
  function caps(r, len, along) { return geo('c' + r + '_' + len + (along || ''), function () { var g = new T.CapsuleGeometry(r, len, 6, 14); if (along === 'z') g.rotateX(Math.PI / 2); if (along === 'x') g.rotateZ(Math.PI / 2); return g; }); }
  function mesh(g, m, sh) { var o = new T.Mesh(g, m); o.castShadow = sh !== false; return o; }
  function place(o, a, b) { var d = b.clone().sub(a); o.position.copy(a).addScaledVector(d, .5); o.quaternion.setFromUnitVectors(YAX, d.normalize()); }
  function ik(s, t, a, b, pole) {      // trả [khớp giữa, điểm cuối] cho chuỗi 2 đoạn dài a, b từ s về phía t
    var d = t.clone().sub(s), L = d.length(); d.normalize();
    L = Math.min(a + b - 1e-3, Math.max(Math.abs(a - b) + 1e-3, L));
    var x = (a * a - b * b + L * L) / (2 * L), h = Math.sqrt(Math.max(0, a * a - x * x));
    var pb = pole.clone().addScaledVector(d, -pole.dot(d)).normalize();
    return [s.clone().addScaledVector(d, x).addScaledVector(pb, h), s.clone().addScaledVector(d, L)];
  }
  function makeKid(team, girl, kz, idx) {
    if (!YAX) { YAX = new T.Vector3(0, 1, 0); ZAX = new T.Vector3(0, 0, 1); }
    var V = function (x, y, z) { return new T.Vector3(x, y, z); };
    var g = new T.Group(), rig = new T.Group(); rig.scale.x = team === 'red' ? 1 : -1; g.add(rig);   // dựng mặt hướng +x, đội Xanh lật gương
    var hairC = [0x1f1308, 0x2b1a0e, 0x120c08][idx % 3];
    var M = { shirt: mat(team, team === 'red' ? RED : BLUE), pants: mat('pants', 0x1e293b), skin: mat('skin' + idx % 2, idx % 2 ? 0xe8b48f : 0xf3c9a6),
      hair: mat('hair' + hairC, hairC), white: mat('white', 0xf8fafc), shoe: mat('shoe', 0x111827), sole: mat('sole', 0xe5e7eb), eye: mat('eye', 0x111111), lip: mat('lip', 0xb4584a) };
    var add = function (o) { rig.add(o); return o; };
    // thân
    var hips = add(mesh(caps(.13, .14, 'z'), M.pants)), torso = add(mesh(caps(.155, .3), M.shirt)); torso.scale.set(.74, 1, 1.22);
    var collar = add(mesh(geo('collar', function () { return new T.TorusGeometry(.075, .028, 8, 20); }), M.white));
    var neck = add(mesh(caps(.048, .06), M.skin));
    // đầu: mặt nhìn về +x
    var head = add(new T.Group()), H = function (g2, m, x, y, z, sx, sy, sz) { var o = mesh(g2, m); o.position.set(x, y, z); if (sx) o.scale.set(sx, sy, sz); head.add(o); return o; };
    H(geo('skull', function () { return new T.SphereGeometry(.122, 28, 20); }), M.skin, 0, 0, 0, 1, 1.13, .95);
    H(geo('hairTop', function () { return new T.SphereGeometry(.132, 28, 14, 0, Math.PI * 2, 0, Math.PI * .44); }), M.hair, -.008, .014, 0, 1, 1.13, .98);
    H(geo('hairBk' + (girl ? 'g' : 'b'), function () { return new T.SphereGeometry(.134, 28, 16, -Math.PI / 2, Math.PI, 0, Math.PI * (girl ? .84 : .6)); }), M.hair, -.006, .01, 0, 1, 1.13, .99);
    H(caps(.03, .13, 'z'), M.hair, .088, .094, 0, 1, .8, 1);                                       // tóc mái
    [-1, 1].forEach(function (s) {
      H(geo('eye', function () { return new T.SphereGeometry(.016, 10, 8); }), M.eye, .109, .014, s * .044);
      H(caps(.007, .03, 'z'), M.hair, .116, .046, s * .045);                                       // lông mày
      H(geo('ear', function () { return new T.SphereGeometry(.03, 10, 8); }), M.skin, -.004, -.004, s * .117, .6, 1, .5);
    });
    H(geo('nose', function () { return new T.SphereGeometry(.02, 10, 8); }), M.skin, .124, -.02, 0, 1.1, 1, .9);
    H(caps(.008, .034, 'z'), M.lip, .108, -.062, 0);
    if (girl) { var pt = H(caps(.045, .17), M.hair, -.15, -.04, 0); pt.rotation.z = -.45; H(geo('tie', function () { return new T.SphereGeometry(.035, 10, 8); }), M.shirt, -.125, .03, 0); }
    // tay, chân
    var arm = [-1, 1].map(function (s) { return { s: s, up: add(mesh(caps(.05, .28), M.skin)), sl: add(mesh(caps(.062, .1), M.shirt)), lo: add(mesh(caps(.043, .27), M.skin)),
      hand: add(mesh(geo('hand', function () { return new T.SphereGeometry(.055, 14, 10); }), M.skin)) }; });
    var leg = [-1, 1].map(function (s) { return { s: s, th: add(mesh(caps(.082, .42), M.pants)), sh: add(mesh(caps(.064, .41), M.pants)),
      shoe: add(mesh(caps(.058, .15, 'x'), M.shoe)), sole: add(mesh(geo('sole', function () { return new T.BoxGeometry(.28, .025, .11); }), M.sole)) }; });
    leg.forEach(function (l) { l.shoe.scale.set(1, .78, .95); });
    var fz = idx % 2 ? 1 : -1;     // chân trước luân phiên trái/phải cho tự nhiên
    function pose(lean, lift, cheer, t) {
      var up = V(-Math.sin(lean), Math.cos(lean), 0);
      var P = V(-.05 - .5 * Math.sin(lean), .86 - .12 * Math.abs(Math.sin(lean)) + lift, 0);
      place(hips, P.clone().setZ(-.09), P.clone().setZ(.09));
      var C = P.clone().addScaledVector(up, .5);
      place(torso, P.clone().addScaledVector(up, .1), C.clone().addScaledVector(up, -.04));
      var N = C.clone().addScaledVector(up, .05);
      collar.position.copy(N); collar.quaternion.setFromUnitVectors(ZAX, up);
      place(neck, N, N.clone().addScaledVector(up, .09));
      head.position.copy(N).addScaledVector(up, .21); head.rotation.z = lean * .45 + (cheer ? -.15 : 0);
      arm.forEach(function (a) {
        var S0 = C.clone().addScaledVector(up, -.03).setZ(C.z + a.s * .2), tg;
        if (cheer) tg = S0.clone().add(V(.06 + Math.sin(t * 8 + a.s) * .05, .58, a.s * .12));           // giơ tay reo hò
        else tg = V(a.s * kz > 0 ? .08 : -.12, 1.12 + lift * 0, -kz);                                       // hai tay nắm dây
        var r = ik(S0, tg, .3, .29, V(-.25, -1, a.s * .8));
        place(a.up, S0, r[0]); place(a.sl, S0, S0.clone().lerp(r[0], .42)); place(a.lo, r[0], r[1]); a.hand.position.copy(r[1]);
      });
      leg.forEach(function (l) {
        var hp = P.clone().setZ(l.s * .1), front = l.s === fz;
        var ank = V(front ? .24 : -.32, .1 + lift, l.s * .12);
        var r = ik(hp, ank, .45, .44, V(1, .25, 0));
        place(l.th, hp, r[0]); place(l.sh, r[0], r[1]);
        l.shoe.position.copy(r[1]).add(V(.06, -.035, 0)); l.sole.position.copy(r[1]).add(V(.06, -.085, 0));
      });
    }
    pose(.32, 0, false, 0);
    g.userData = { pose: pose };
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
    // dây thừng bện (vân xoắn), võng nhẹ giữa sân, hai đầu thừa buông xuống đất – dựng lại theo số người mỗi đội (buildRope)
    var braid = tex(64, 64, function (g, w, h) { g.fillStyle = '#c9a26a'; g.fillRect(0, 0, w, h); g.lineWidth = 9;
      for (var i = -2; i < 4; i++) { g.strokeStyle = i % 2 ? '#a8783f' : '#e2c08c'; g.beginPath(); g.moveTo(i * 22, h); g.lineTo(i * 22 + h, 0); g.stroke(); } });
    braid.wrapS = braid.wrapT = T.RepeatWrapping;
    S.ropeM = new T.MeshStandardMaterial({ map: braid, roughness: .95 });
    S.ropeMesh = new T.Mesh(new T.BufferGeometry(), S.ropeM); S.ropeMesh.castShadow = true; rope.add(S.ropeMesh);
    var knot = new T.Mesh(new T.SphereGeometry(.085, 14, 10), S.ropeM); knot.scale.set(1.5, 1, 1.2); knot.position.y = 1.12; rope.add(knot); S.knot = knot;
    var ribbon = new T.Group(); S.ribbon = ribbon; knot.add(ribbon);
    [[0xdc2626, -.12], [0xfacc15, .12]].forEach(function (a) { var r = new T.Mesh(new T.PlaneGeometry(.09, .42), new T.MeshStandardMaterial({ color: a[0], side: T.DoubleSide, roughness: .7 }));
      r.geometry.translate(0, -.21, 0); r.rotation.z = a[1]; ribbon.add(r); });
    // bảng điểm hai đội
    S.boardR = sprite(boardTex('red', 0), 6, 2); S.boardR.position.set(-8.5, 4.6, -3); sc.add(S.boardR);
    S.boardB = sprite(boardTex('blue', 0), 6, 2); S.boardB.position.set(8.5, 4.6, -3); sc.add(S.boardB);
  }

  function buildRope(sag) {
    var Y = 1.12, P = [];
    [-1, 1].forEach(function (s) {
      var n = s < 0 ? S.nRed : S.nBlue, ex = s * (2.4 + (n - 1) * 1.45 + .35), pts = [
        [ex + s * 2.7, .045, .55], [ex + s * 1.9, .045, .28], [ex + s * 1.2, .2, .05], [ex + s * .6, .85, 0], [ex, Y, 0], [ex - s * 1.5, Y, 0], [s * 2.2, Y - sag * .25, 0]];
      if (s > 0) pts.reverse();
      pts.forEach(function (p) { P.push(new T.Vector3(p[0], p[1], p[2])); });
      if (s < 0) P.push(new T.Vector3(0, Y - sag, 0));
    });
    var curve = new T.CatmullRomCurve3(P, false, 'centripetal'), len = curve.getLength();
    S.ropeMesh.geometry.dispose(); S.ropeMesh.geometry = new T.TubeGeometry(curve, 260, .042, 10, false);
    S.ropeM.map.repeat.set(len * 7, 1); S.knot.position.y = Y - sag; S.sag = sag;
  }
  function syncKids(red, blue) {
    var key = red.join('|') + '#' + blue.join('|');
    if (key === S.kidKey) return; S.kidKey = key;
    (S.kids || []).forEach(function (k) { S.rope.remove(k.obj); });
    S.kids = [];
    [['red', red], ['blue', blue]].forEach(function (a) {
      var team = a[0], names = a[1], n = Math.max(4, Math.min(6, names.length || 4)), dir = team === 'red' ? -1 : 1;
      S[team === 'red' ? 'nRed' : 'nBlue'] = n;
      for (var i = 0; i < n; i++) {
        var z = i % 2 ? -.2 : .2, o = makeKid(team, i % 2 === 1, z, i + (team === 'red' ? 0 : 1)), x = dir * (2.4 + i * 1.45);
        o.position.set(x, 0, z); S.rope.add(o);
        var nm = names[i];
        if (i === n - 1 && names.length > n) nm = '+' + (names.length - n + 1) + ' bạn';
        if (nm) { var lab = sprite(nameTex(nm, team === 'red' ? '#e11d48' : '#0284c7'), 2.6, .65); lab.position.set(0, 2.5, 0); o.add(lab); }
        S.kids.push({ obj: o, team: team, i: i });
      }
    });
    buildRope(.06);
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
    S.ribbon.rotation.y = Math.sin(t * 3) * .4; S.ribbon.rotation.x = Math.sin(t * 2.3) * .15;
    var sag = .06 + (S.jerk ? Math.sin(t * 38) * S.jerk * .07 : Math.sin(t * 5) * .01);   // dây căng, rung khi bị giật
    if (Math.abs(sag - (S.sag || 0)) > .004) buildRope(sag);
    (S.kids || []).forEach(function (k) {
      var ph = t * 5 + k.i * .5, lift = 0, cheer = false;
      var lean = .32 + Math.sin(ph) * .06;                              // "hò dô ta": nhịp kéo đều
      if (S.jerk && k.team === S.jerkTeam) lean += S.jerk * .3;          // đội vừa ghi điểm giật mạnh
      if (S.jerk && k.team !== S.jerkTeam) lean -= S.jerk * .25;         // đội kia bị kéo chúi về trước
      if (win) { if (k.team === win) { lean = .02; cheer = true; lift = Math.abs(Math.sin(t * 7 + k.i)) * .3; } else lean = -.3; }
      k.obj.userData.pose(lean, lift, cheer, t);
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
  // ---- 22/11/2026: NHẠC MỪNG CHIẾN THẮNG – hò reo vui nhộn (~29 s, 132 BPM, Đô trưởng; giai điệu tự soạn) ----
  // Kèn chính + đệm "bùm – chát", trống, vỗ tay, đám đông hò "Hô – hô!", huýt sáo, pháo nổ. Nhạc nền trống hội tạm dừng.
  var VMEL = [[72,76,79,84,0,79,84,0],[81,79,77,76,74,76,77,79],[76,79,84,88,0,84,88,0],[86,84,83,81,79,0,79,0],
              [77,81,84,81,77,81,84,86],[84,83,81,79,76,79,84,0],[81,81,83,83,84,84,86,86],[88,0,84,0,91,0,0,0]];
  var VCHORD = [[48,52,55],[43,47,50],[48,52,55],[43,47,53],[41,45,48],[48,52,55],[41,45,48],[48,52,55]];
  function hz(m) { return 440 * Math.pow(2, (m - 69) / 12); }
  function vLead(t, m, len, vol, out) {
    var c = A.ctx, g = c.createGain(), lp = c.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 3600;
    g.gain.setValueAtTime(.0001, t); g.gain.exponentialRampToValueAtTime(vol, t + .015); g.gain.setTargetAtTime(vol * .6, t + .05, .08); g.gain.exponentialRampToValueAtTime(.0001, t + len);
    [['square', 0], ['triangle', 7], ['sawtooth', -6]].forEach(function (v, i) { var o = c.createOscillator(), og = c.createGain(); o.type = v[0]; o.frequency.value = hz(m); o.detune.value = v[1];
      og.gain.value = [.5, .9, .25][i]; o.connect(og); og.connect(lp); o.start(t); o.stop(t + len + .05); });
    lp.connect(g); g.connect(out);
  }
  function shout(t, out) {                // một tiếng "Hô!" của đám đông: dây thanh (sawtooth) qua 2 formant nguyên âm "ô"
    var c = A.ctx;
    for (var v = 0; v < 5; v++) {
      var t1 = t + Math.random() * .04, f0 = 170 + Math.random() * 140, o = c.createOscillator(), g = c.createGain(); o.type = 'sawtooth';
      o.frequency.setValueAtTime(f0 * 1.15, t1); o.frequency.exponentialRampToValueAtTime(f0, t1 + .3);
      g.gain.setValueAtTime(.0001, t1); g.gain.exponentialRampToValueAtTime(.09, t1 + .04); g.gain.exponentialRampToValueAtTime(.0001, t1 + .38);
      [[520, 6, 1], [900, 7, .55]].forEach(function (fm) { var bp = c.createBiquadFilter(), bg = c.createGain(); bp.type = 'bandpass'; bp.frequency.value = fm[0] * (f0 > 240 ? 1.15 : 1); bp.Q.value = fm[1]; bg.gain.value = fm[2]; o.connect(bp); bp.connect(bg); bg.connect(g); });
      g.connect(out); o.start(t1); o.stop(t1 + .42);
    }
    noise(t, .07, 'highpass', 2500, .7, .12, out);   // âm "h"
  }
  function whistle(t, out) { var c = A.ctx, o = c.createOscillator(), g = c.createGain(), l = c.createOscillator(), lg = c.createGain(); o.type = 'sine';
    o.frequency.setValueAtTime(1900, t); o.frequency.exponentialRampToValueAtTime(2700, t + .25); o.frequency.exponentialRampToValueAtTime(2300, t + .5);
    l.frequency.value = 9; lg.gain.value = 60; l.connect(lg); lg.connect(o.frequency);
    g.gain.setValueAtTime(.0001, t); g.gain.exponentialRampToValueAtTime(.08, t + .05); g.gain.exponentialRampToValueAtTime(.0001, t + .55); o.connect(g); g.connect(out); o.start(t); l.start(t); o.stop(t + .6); l.stop(t + .6); }
  function pop(t, out) { noise(t, .35, 'highpass', 900, .5, .5, out, 300); tone(t, 70, .25, 'sine', .4, out, 40); }
  function victory() {
    if (!ctx() || A.ctx.state !== 'running') return;
    victoryStop(); musicStop();
    var c = A.ctx, out = c.createGain(); out.gain.value = .85; out.connect(c.destination); A.vic = out;
    var t0 = c.currentTime + .05, beat = 60 / 132, e = beat / 2, bar = beat * 4, PASS = 2;
    cheer(t0, 3.5, .5); for (var i = 0; i < 12; i++) tone(t0 + i * .06, 120, .1, 'sine', .3, out, 60);      // trống dồn mở màn
    var s0 = t0 + .8;
    for (var p = 0; p < PASS; p++) for (var b = 0; b < 8; b++) {
      var tb = s0 + (p * 8 + b) * bar, ch = VCHORD[b], last = p === PASS - 1 && b === 7;
      VMEL[b].forEach(function (m, k) {                                                                     // kèn chính (vòng 2 thêm bè quãng 3 dưới)
        if (!m) return; var nx = VMEL[b][k + 1], len = (nx === 0 ? 2 : 1) * e * .95;
        if (last && k === 4) len = bar * .9;
        vLead(tb + k * e, m, len, .16, out); if (p === 1) vLead(tb + k * e, m - (k % 2 ? 3 : 4), len, .07, out);
      });
      for (var q = 0; q < 4; q++) {
        var tq = tb + q * beat;
        tone(tq, hz(ch[0] - (q % 2 ? -12 : 0)), beat * .45, 'triangle', .3, out, null, 900);                // bass "bùm – bùm"
        ch.forEach(function (m) { tone(tq + e, hz(m + 12), e * .8, 'square', .035, out, null, 2200); });    // đệm "chát" phách lẻ
        if (q % 2 === 0) tone(tq, 110, .28, 'sine', .7, out, 45);                                            // trống cái
        else { noise(tq, .16, 'bandpass', 1800, .9, .45, out); noise(tq + .012, .12, 'bandpass', 1300, 1.2, .3, out); }   // vỗ tay / trống con
        noise(tq, .04, 'highpass', 7000, .7, .07, out); noise(tq + e, .04, 'highpass', 7000, .7, .05, out);   // chũm chọe
      }
      if (b % 2 === 1) { shout(tb + bar - beat * 1.5, out); shout(tb + bar - beat * .5, out); }             // "Hô – hô!"
      if (b === 2 || b === 6) whistle(tb + beat, out);
      if (b % 4 === 0) cheer(tb, bar * 1.6, .22);
      if (b === 3 || b === 7) { pop(tb + beat * 2.5, out); pop(tb + beat * 3.2, out); }
      if (b === 7) for (var f = 0; f < 6; f++) tone(tb + beat * 2 + f * e / 2, 140 - f * 10, .1, 'sine', .4, out, 60);   // trống vào vòng / kết
    }
    var tEnd = s0 + PASS * 8 * bar;
    cheer(tEnd - bar, 5, .5); shout(tEnd - .2, out); shout(tEnd + .4, out); pop(tEnd, out); pop(tEnd + .35, out);
    out.gain.setValueAtTime(.85, tEnd + 1.5); out.gain.linearRampToValueAtTime(0, tEnd + 4.5);
    A.vicEnd = c.currentTime + (tEnd + 4.6 - t0);
  }
  function victoryStop() { if (A.vic) { try { A.vic.gain.cancelScheduledValues(A.ctx.currentTime); A.vic.gain.setTargetAtTime(0, A.ctx.currentTime, .15); var v = A.vic; setTimeout(function () { v.disconnect(); }, 900); } catch (e) {} A.vic = null; A.vicEnd = 0; } }
  function victoryPlaying() { return !!(A.vic && A.ctx && A.ctx.currentTime < A.vicEnd); }
  function win() { victory(); }
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
    if (!A.music || A.playing || !ctx() || victoryPlaying()) return;   // đang phát nhạc mừng thì chưa bật lại trống hội
    A.playing = true; A.step = 0; A.next = A.ctx.currentTime + .08;
    A.mu.gain.cancelScheduledValues(A.ctx.currentTime); A.mu.gain.setTargetAtTime(.3, A.ctx.currentTime, .4);
    A.timer = setInterval(tick, 25); tick();
  }
  function musicStop() { if (!A.playing) return; A.playing = false; clearInterval(A.timer); if (A.mu) A.mu.gain.setTargetAtTime(0, A.ctx.currentTime, .2); }
  document.addEventListener('pointerdown', function () { if (A.ctx && A.ctx.state === 'suspended') A.ctx.resume(); }, { passive: true });
  window.TugAudio = {
    unlock: function () { ctx(); }, pull: pull, win: win, victoryStop: victoryStop, victoryPlaying: victoryPlaying, musicStart: musicStart, musicStop: musicStop, playing: function () { return A.playing; },
    musicOn: function (v) { if (v === undefined) return A.music; A.music = !!v; try { localStorage.setItem('tug_music', A.music ? 'on' : 'off'); } catch (e) {} if (!A.music) musicStop(); return A.music; }
  };
})();
