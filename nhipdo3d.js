// THI ĐẤU THEO NHỊP ĐỘ – SÂN KHẤU 3D (cần game3d_chung.js). Chỉ thay phần hiển thị trên máy GV, luật chơi giữ nguyên.
// ND3D.mount(el, snapshot) – snapshot() trả {phase: lobby|q|reveal|end, players:[{id, n, s, done, streak}] (đã xếp hạng), answered, total}
//   lobby: HS vào sàn đứng thành hàng, vẫy tay · q: HS đã trả lời hiện ✓ · reveal/end: cột Top 10 dâng theo điểm, hạng 1 đội vương miện.
(function () {
  'use strict';
  var T, S = null, COLS = [0x6366f1, 0x0ea5e9, 0x10b981, 0xf59e0b, 0xec4899, 0x8b5cf6, 0x14b8a6, 0xef4444];
  var RANKC = [0xfacc15, 0xcbd5e1, 0xd97706];
  var TOP = 10;

  function build() {
    var sc = S.scene;
    var floor = new T.Mesh(new T.PlaneGeometry(120, 80), new T.MeshStandardMaterial({ color: 0x1e293b, roughness: .7 })); floor.rotation.x = -Math.PI / 2; floor.receiveShadow = true; sc.add(floor);
    var stage = new T.Mesh(new T.BoxGeometry(30, .4, 12), new T.MeshStandardMaterial({ color: 0x4338ca, roughness: .4, metalness: .2 })); stage.position.set(0, .2, -1); stage.receiveShadow = true; sc.add(stage);
    var edge = new T.Mesh(new T.BoxGeometry(30.2, .1, .2), new T.MeshStandardMaterial({ color: 0x22d3ee, emissive: 0x0891b2, emissiveIntensity: .8 })); edge.position.set(0, .42, 5); sc.add(edge);
    var wall = new T.Mesh(new T.PlaneGeometry(44, 12), new T.MeshBasicMaterial({ map: G3D.tex(1600, 440, function (g, w, h) {
      var gr = g.createLinearGradient(0, 0, w, h); gr.addColorStop(0, '#1e1b4b'); gr.addColorStop(1, '#0c4a6e'); g.fillStyle = gr; g.fillRect(0, 0, w, h);
      for (var i = 0; i < 26; i++) { g.strokeStyle = 'rgba(34,211,238,' + (.05 + Math.random() * .12) + ')'; g.lineWidth = 3; g.beginPath(); g.moveTo(Math.random() * w, 0); g.lineTo(Math.random() * w, h); g.stroke(); }
      g.fillStyle = '#fff'; g.font = '900 110px Arial'; g.textAlign = 'center'; g.fillText('⏱️ THI ĐẤU THEO NHỊP ĐỘ', w / 2, 150); g.fillStyle = '#67e8f9'; g.font = '700 50px Arial'; g.fillText('THPT VT', w / 2, 225);
    }) })); wall.position.set(0, 3.4, -9); sc.add(wall);
    S.info = G3D.sprite(G3D.banner('QUÉT MÃ QR ĐỂ VÀO SÀN', '#0891b2'), 6.5, 1); S.info.position.set(0, 3.9, -5.5); sc.add(S.info);
    // 10 cột xếp hạng (ẩn đến khi mở đáp án)
    S.cols = [];
    for (var i = 0; i < TOP; i++) {
      var m = new T.Mesh(new T.BoxGeometry(1.5, 1, 1.5), new T.MeshStandardMaterial({ color: i < 3 ? RANKC[i] : 0x6366f1, metalness: i < 3 ? .6 : .2, roughness: .35, emissive: i === 0 ? 0x854d0e : 0, emissiveIntensity: .3 }));
      m.castShadow = true; m.receiveShadow = true; m.position.set(0, .4, 0); m.scale.y = .01; m.visible = false; sc.add(m);
      var num = G3D.sprite(G3D.banner(String(i + 1), i < 3 ? '#a16207' : '#3730a3'), 1.4, .7); num.visible = false; sc.add(num);
      S.cols.push({ mesh: m, h: .01, num: num });
    }
    var crownG = new T.ConeGeometry(.35, .45, 5); S.crown = new T.Mesh(crownG, new T.MeshStandardMaterial({ color: 0xfacc15, metalness: .9, roughness: .2, emissive: 0x854d0e, emissiveIntensity: .5 })); S.crown.visible = false; sc.add(S.crown);
    var spotM = new T.MeshBasicMaterial({ color: 0xe0f2fe, transparent: true, opacity: .045, depthWrite: false, side: T.DoubleSide });
    S.spots = [-9, -3, 3, 9].map(function (x, i) { var c = new T.Mesh(new T.ConeGeometry(3, 14, 24, 1, true), spotM); c.position.set(x, 7, -1); sc.add(c); return c; });
  }
  function colX(r) { var order = [0, -1, 1, -2, 2, -3, 3, -4, 4, 5]; return order[r] * 2.2; }   // hạng 1 ở giữa, các hạng sau toả hai bên
  function lobbyPos(i, n) {
    var cols = Math.min(10, Math.max(4, Math.ceil(Math.sqrt(n * 2.2)))), rows = Math.ceil(n / cols), r = Math.floor(i / cols), c = i % cols, inRow = Math.min(cols, n - r * cols);
    var gap = Math.min(1.7, 24 / cols);
    return new T.Vector3((c - (inRow - 1) / 2) * gap, .4, -3.5 + r * Math.min(1.6, 8 / Math.max(rows, 1)));
  }

  function sync(s) {
    var seen = {};
    s.players.forEach(function (p, i) {
      seen[p.id] = 1; var k = S.kids[p.id];
      if (!k) {
        var o = G3D.kid(COLS[Object.keys(S.kids).length % COLS.length], Object.keys(S.kids).length % 2 === 1, 'stand');
        var lab = G3D.sprite(G3D.label(p.n, '#22d3ee'), 2, .45); lab.position.set(0, 2.35, 0); o.add(lab);
        var ok = G3D.sprite(G3D.banner('✓', '#16a34a'), .7, .5); ok.position.set(0, 2.95, 0); ok.visible = false; o.add(ok);
        o.position.set((Math.random() - .5) * 20, 6, 8); S.scene.add(o);
        k = S.kids[p.id] = { obj: o, lab: lab, ok: ok, lk: '' };
      }
      k.p = p; k.rank = i;
    });
    Object.keys(S.kids).forEach(function (id) { if (!seen[id]) { S.scene.remove(S.kids[id].obj); delete S.kids[id]; } });
  }

  function frame() {
    if (!S) return; S.raf = requestAnimationFrame(frame);
    if (!S.el.offsetParent) return;
    var now = performance.now(), dt = Math.min(.05, (now - (S.last || now)) / 1000), t = now / 1000; S.last = now;
    var s = S.snapshot() || { phase: 'lobby', players: [] };
    sync(s);
    var podium = s.phase === 'reveal' || s.phase === 'end', n = s.players.length, max = 1;
    s.players.forEach(function (p) { max = Math.max(max, p.s || 0); });
    var info = s.phase === 'lobby' ? (n ? n + ' HỌC SINH ĐÃ VÀO SÀN' : 'QUÉT MÃ QR ĐỂ VÀO SÀN') : s.phase === 'q' ? 'ĐÃ TRẢ LỜI ' + s.answered + '/' + n : s.phase === 'end' ? '🏆 VINH DANH' : '🏆 BẢNG XẾP HẠNG TOP ' + Math.min(TOP, n);
    if (info !== S.infoKey) { S.infoKey = info; G3D.setSprite(S.info, G3D.banner(info, s.phase === 'q' ? '#7c3aed' : '#0891b2')); }
    // cột xếp hạng
    S.cols.forEach(function (c, r) {
      var p = s.players[r], want = podium && p ? .3 + 4.2 * Math.max(0, p.s || 0) / max : .01;
      c.h += (want - c.h) * Math.min(1, dt * 2); c.mesh.visible = c.h > .02; c.mesh.scale.y = c.h; c.mesh.position.set(colX(r), .4 + c.h / 2, -2);
      c.num.visible = c.mesh.visible; c.num.position.set(colX(r), .75, -1.15);
    });
    Object.keys(S.kids).forEach(function (id, idx) {
      var k = S.kids[id], o = k.obj, b = o.userData.body, p = k.p, tgt;
      if (podium) {
        if (k.rank < TOP) { var c = S.cols[k.rank]; tgt = new T.Vector3(colX(k.rank), .4 + c.h, -2); }
        else tgt = new T.Vector3(-14 - (k.rank % 3) * 1.2, .4, -4 + Math.floor((k.rank - TOP) / 3) * 1.1);   // ngoài Top 10: đứng cánh gà
      } else tgt = lobbyPos(k.rank, n);
      o.position.x += (tgt.x - o.position.x) * Math.min(1, dt * 3); o.position.z += (tgt.z - o.position.z) * Math.min(1, dt * 3);
      o.position.y += (tgt.y - o.position.y) * Math.min(1, dt * 5);
      var happy = podium && k.rank < 3, wave = s.phase === 'lobby';
      b.position.y = happy ? Math.abs(Math.sin(t * 6 + idx)) * .25 : 0;
      b.rotation.z = wave ? Math.sin(t * 3 + idx) * .08 : 0;
      k.ok.visible = s.phase === 'q' && !!p.done;
      var lk = podium ? p.n + '|' + p.s : p.n;
      if (lk !== k.lk) { k.lk = lk; G3D.setSprite(k.lab, podium ? G3D.label(p.n, k.rank < 3 ? '#facc15' : '#22d3ee', p.s + ' điểm' + (p.streak >= 2 ? ' · 🔥' + p.streak : '')) : G3D.label(p.n, '#22d3ee')); k.lab.scale.set(2.2, podium ? .7 : .48, 1); }
      k.lab.visible = !podium || k.rank < TOP || n <= 20;
    });
    var lead = s.players[0] && S.kids[s.players[0].id];
    S.crown.visible = podium && !!lead && (s.players[0].s || 0) > 0;
    if (S.crown.visible) { S.crown.position.copy(lead.obj.position); S.crown.position.y += 2.15 + lead.obj.userData.body.position.y; S.crown.rotation.y = t * 2; }
    S.spots.forEach(function (c, i) { c.rotation.z = Math.sin(t * .6 + i) * .3; });
    var cam = S.camera; cam.position.set(Math.sin(t * .13) * 1.2, podium ? 5.6 : 4.3, podium ? 11 : 8.8); cam.lookAt(0, podium ? 2.8 : 1.5, -3);
    S.renderer.render(S.scene, cam);
  }

  window.ND3D = {
    supported: function () { return window.G3D && G3D.supported(); },
    mount: function (el, snapshot) {
      return G3D.load().then(function () {
        T = G3D.T();
        if (S && S.el === el) { S.snapshot = snapshot; return S; }
        var o = G3D.scene(el, 0x0b1120, [40, 90]);
        S = Object.assign(o, { snapshot: snapshot, kids: {} });
        o.scene.add(new T.HemisphereLight(0xe0f2fe, 0x1e1b4b, .75));
        var sun = new T.DirectionalLight(0xffffff, .9); sun.position.set(6, 16, 12); sun.castShadow = true; sun.shadow.mapSize.set(1024, 1024);
        var sc = sun.shadow.camera; sc.left = -18; sc.right = 18; sc.top = 12; sc.bottom = -12; o.scene.add(sun);
        build(); frame(); return S;
      });
    }
  };
})();
