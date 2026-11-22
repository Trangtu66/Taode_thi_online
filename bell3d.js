// RUNG CHUÔNG VÀNG – SÀN THI ĐẤU 3D (cần game3d_chung.js). Chỉ thay phần hiển thị trên máy GV, luật chơi giữ nguyên.
// Bell3D.mount(el, snapshot) – snapshot() trả {players:[{id, name, alive}], revealed, qNum, total}
// Bell3D.ring() – chuông vàng lắc + ngân (gọi khi còn 1 HS trên sàn / kết thúc)
(function () {
  'use strict';
  var T, S = null, COLS = [0x6366f1, 0x0ea5e9, 0x10b981, 0xf59e0b, 0xec4899, 0x8b5cf6, 0x14b8a6, 0xef4444];

  function build() {
    var sc = S.scene;
    var floor = new T.Mesh(new T.CircleGeometry(30, 64), new T.MeshStandardMaterial({ color: 0x1e1b4b, roughness: .5, metalness: .2 })); floor.rotation.x = -Math.PI / 2; floor.receiveShadow = true; sc.add(floor);
    var stage = new T.Mesh(new T.CylinderGeometry(11, 11.4, .3, 64), new T.MeshStandardMaterial({ color: 0x3730a3, roughness: .35, metalness: .3 })); stage.position.y = .15; stage.receiveShadow = true; sc.add(stage);
    var ring = new T.Mesh(new T.TorusGeometry(11.2, .12, 8, 96), new T.MeshStandardMaterial({ color: 0xfacc15, emissive: 0xb45309, emissiveIntensity: .6 })); ring.rotation.x = Math.PI / 2; ring.position.y = .32; sc.add(ring);
    var grid = new T.GridHelper(20, 10, 0x818cf8, 0x4f46e5); grid.position.y = .31; grid.material.opacity = .35; grid.material.transparent = true; sc.add(grid);
    // màn hình phông nền + chữ
    var wall = new T.Mesh(new T.PlaneGeometry(40, 12), new T.MeshBasicMaterial({ map: G3D.tex(1600, 480, function (g, w, h) {
      var gr = g.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, '#312e81'); gr.addColorStop(1, '#0f172a'); g.fillStyle = gr; g.fillRect(0, 0, w, h);
      for (var i = 0; i < 70; i++) { g.fillStyle = 'rgba(253,224,71,' + (Math.random() * .6 + .2) + ')'; g.beginPath(); g.arc(Math.random() * w, Math.random() * h, Math.random() * 3 + 1, 0, 7); g.fill(); }
      g.fillStyle = '#fde047'; g.font = '900 120px Arial'; g.textAlign = 'center'; g.fillText('RUNG CHUÔNG VÀNG', w / 2, 170); g.fillStyle = '#fff'; g.font = '700 54px Arial'; g.fillText('THPT VT', w / 2, 250);
    }) })); wall.position.set(0, 2.6, -15); sc.add(wall);
    // chuông vàng
    var pts = []; for (var i = 0; i <= 12; i++) { var a = i / 12; pts.push(new T.Vector2(.25 + Math.pow(a, 1.8) * 1.6 + (a > .9 ? (a - .9) * 3 : 0), 2.2 - a * 2.2)); }
    var gold = new T.MeshStandardMaterial({ color: 0xfacc15, metalness: .9, roughness: .25, emissive: 0x854d0e, emissiveIntensity: .35 });
    var bellG = new T.Group(); bellG.position.set(0, 4.7, -2.5); bellG.scale.setScalar(.5); sc.add(bellG);
    var bm = new T.Mesh(new T.LatheGeometry(pts, 32), gold); bm.position.y = -2.4; bm.castShadow = true; bellG.add(bm);
    var top = new T.Mesh(new T.SphereGeometry(.35, 16, 10), gold); top.position.y = -.2; bellG.add(top);
    var clap = new T.Mesh(new T.SphereGeometry(.28, 12, 10), gold); clap.position.y = -2.5; bellG.add(clap);
    var rope = new T.Mesh(new T.CylinderGeometry(.05, .05, 4, 6), new T.MeshStandardMaterial({ color: 0xb91c1c })); rope.position.y = 1.8; bellG.add(rope);
    S.bell = bellG;
    // đèn sân khấu
    var spotM = new T.MeshBasicMaterial({ color: 0xfef3c7, transparent: true, opacity: .045, depthWrite: false, side: T.DoubleSide });
    S.spots = [-8, -3, 3, 8].map(function (x, i) { var c = new T.Mesh(new T.ConeGeometry(3, 16, 24, 1, true), spotM); c.position.set(x, 8, 0); sc.add(c); return c; });
    // bảng thông tin
    S.info = G3D.sprite(G3D.banner('CÒN 0/0 HỌC SINH TRÊN SÀN', '#16a34a'), 6, .95); S.info.position.set(-8.2, 4.4, -3); sc.add(S.info);
    // khu vực học sinh đã rời sàn (hai bên)
    var bench = new T.MeshStandardMaterial({ color: 0x334155, roughness: .8 });
    [-1, 1].forEach(function (sd) { var b = new T.Mesh(new T.BoxGeometry(4.5, .5, 14), bench); b.position.set(sd * 13.4, .25, 0); b.receiveShadow = true; sc.add(b); });
  }

  // vị trí ngồi: lưới trên sàn tròn (HS còn trên sàn); HS bị loại về băng ghế hai bên
  function seatPos(i, n) {
    var cols = Math.min(8, Math.max(3, Math.ceil(Math.sqrt(n * 1.6)))), rows = Math.ceil(n / cols), gap = Math.min(2.2, 17 / cols);
    var r = Math.floor(i / cols), c = i % cols, inRow = Math.min(cols, n - r * cols);
    return new T.Vector3((c - (inRow - 1) / 2) * gap, .3, (r - (rows - 1) / 2) * Math.min(2.3, 14 / Math.max(rows, 1)) + 1);
  }
  function benchPos(j) { var sd = j % 2 ? 1 : -1, k = Math.floor(j / 2); return new T.Vector3(sd * (12.6 + (k % 2) * 1.5), .5, -5 + Math.floor(k / 2) * 1.3); }

  function sync(players) {
    var seen = {};
    players.forEach(function (p, i) {
      seen[p.id] = 1; var k = S.kids[p.id];
      if (!k) {
        var o = G3D.kid(COLS[i % COLS.length], i % 2 === 1, 'sit');
        var lab = G3D.sprite(G3D.label(p.name, '#facc15'), 1.9, .42); lab.position.set(0, 1.75, 0); o.add(lab);
        o.position.copy(benchPos(0)); o.position.y = 12; S.scene.add(o);
        k = S.kids[p.id] = { obj: o, lab: lab, alive: null, name: '' };
      }
      if (k.name !== p.name) { k.name = p.name; G3D.setSprite(k.lab, G3D.label(p.name, '#facc15')); }
      if (k.alive !== p.alive) {
        if (k.alive === true && !p.alive) { k.fallT = 1; S.out++; }
        k.alive = p.alive;
        var parts = k.obj.userData.parts;
        if (parts.board) parts.board.material = p.alive ? G3D.mat('board', 0xffffff) : G3D.mat('boardOut', 0xef4444);
      }
    });
    Object.keys(S.kids).forEach(function (id) { if (!seen[id]) { S.scene.remove(S.kids[id].obj); delete S.kids[id]; } });
    var alive = players.filter(function (p) { return p.alive; }), out = players.filter(function (p) { return !p.alive; });
    alive.forEach(function (p, i) { S.kids[p.id].target = seatPos(i, alive.length); });
    out.forEach(function (p, j) { S.kids[p.id].target = benchPos(j); });
    return alive.length;
  }

  function frame() {
    if (!S) return; S.raf = requestAnimationFrame(frame);
    if (!S.el.offsetParent) return;
    var now = performance.now(), dt = Math.min(.05, (now - (S.last || now)) / 1000), t = now / 1000; S.last = now;
    var s = S.snapshot() || { players: [] };
    var n = sync(s.players), tot = s.players.length;
    var key = n + '/' + tot;
    if (key !== S.infoKey) { S.infoKey = key; G3D.setSprite(S.info, G3D.banner(tot ? 'CÒN ' + n + '/' + tot + ' HỌC SINH TRÊN SÀN' : 'QUÉT MÃ QR ĐỂ VÀO SÀN', n === 1 && tot > 1 ? '#ca8a04' : '#16a34a')); }
    Object.keys(S.kids).forEach(function (id, idx) {
      var k = S.kids[id], o = k.obj, b = o.userData.body;
      if (k.target) { o.position.x += (k.target.x - o.position.x) * Math.min(1, dt * 2.5); o.position.z += (k.target.z - o.position.z) * Math.min(1, dt * 2.5); o.position.y += (k.target.y - o.position.y) * Math.min(1, dt * 4); }
      if (k.alive) { b.position.y = s.revealed ? Math.abs(Math.sin(t * 6 + idx)) * .12 : 0; b.rotation.z = 0; o.rotation.y = 0; }
      else { k.fallT = Math.max(0, (k.fallT || 0) - dt); b.rotation.z = Math.sin(k.fallT * 12) * .3 * k.fallT; o.rotation.y = (o.position.x > 0 ? -1 : 1) * Math.PI / 2; b.position.y = 0; }
      k.lab.visible = !!k.alive || tot <= 16;
    });
    // chuông lắc nhẹ; khi rung chuông: lắc mạnh
    S.ringT = Math.max(0, (S.ringT || 0) - dt);
    S.bell.rotation.z = Math.sin(t * 1.3) * .04 + Math.sin(t * 9) * .35 * Math.min(1, S.ringT);
    S.spots.forEach(function (c, i) { c.rotation.z = Math.sin(t * .7 + i) * .25; });
    var cam = S.camera; cam.position.set(Math.sin(t * .15) * 1.5, 5.2, 10.5); cam.lookAt(0, 1.8, -1.5);
    S.renderer.render(S.scene, cam);
  }

  window.Bell3D = {
    supported: function () { return window.G3D && G3D.supported(); },
    mount: function (el, snapshot) {
      return G3D.load().then(function () {
        T = G3D.T();
        if (S && S.el === el) { S.snapshot = snapshot; return S; }
        var o = G3D.scene(el, 0x0f172a, [40, 90]);
        S = Object.assign(o, { snapshot: snapshot, kids: {}, out: 0 });
        o.scene.add(new T.HemisphereLight(0xc7d2fe, 0x1e1b4b, .7));
        var sun = new T.DirectionalLight(0xffffff, .9); sun.position.set(6, 18, 12); sun.castShadow = true; sun.shadow.mapSize.set(1024, 1024);
        var sc = sun.shadow.camera; sc.left = -16; sc.right = 16; sc.top = 14; sc.bottom = -14; o.scene.add(sun);
        var pl = new T.PointLight(0xfacc15, 1.2, 20); pl.position.set(0, 9, -4); o.scene.add(pl);
        build(); frame(); return S;
      });
    },
    ring: function () { if (S) S.ringT = 3; }
  };
})();
