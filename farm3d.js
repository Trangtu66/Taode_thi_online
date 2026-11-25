// NÔNG TRẠI – CÁNH ĐỒNG 3D (cần game3d_chung.js). Dùng cho tu_choi.html (HS tự chơi) và tro_choi_lop.html (GV trình chiếu, 1–4 đội).
// Farm3D.mount(el, snapshot) – snapshot() trả đúng trạng thái sân 2D của game_moi.js:
//   {n, k, doi:[{ten, mau, cay:[0..3 | undefined]}], sau (luống đang trồng có sâu), xong, fx:{loai:'dung'|'sai', at, cau, doi:[chỉ số đội đúng]}, t}
//   Mức cây: 3 ra trái · 2 cây lớn · 1 cây non · 0 héo (trả lời đúng quá muộn / trang cả lớp: đội sai).
// Hình học sinh: áo cổ trắng, không khăn quàng (G3D.kid).
(function () {
  'use strict';
  var T, S = null, O = 1.4;   // O: khoảng cách giữa hai luống
  var LOAI = ['ngo', 'carot', 'cachua', 'duahau', 'bingo', 'bapcai'];

  function M(k, c, o) { return G3D.mat('farm_' + k, c, o); }
  function mesh(geo, m, x, y, z) { var o = new T.Mesh(geo, m); o.position.set(x || 0, y || 0, z || 0); o.castShadow = true; o.receiveShadow = true; return o; }

  // ---------------------------------------------------------------- cảnh nền
  function build() {
    var sc = S.scene;
    var co = new T.Mesh(new T.PlaneGeometry(160, 160), new T.MeshStandardMaterial({ color: 0x65a30d, roughness: 1 })); co.rotation.x = -Math.PI / 2; co.receiveShadow = true; sc.add(co);
    [[-30, -45, 22, 0x4d7c0f], [10, -55, 30, 0x65a30d], [45, -42, 20, 0x4d7c0f], [-55, -20, 18, 0x84cc16]].forEach(function (d) {   // đồi xa
      var doi = new T.Mesh(new T.SphereGeometry(d[2], 32, 16), new T.MeshStandardMaterial({ color: d[3], roughness: 1 })); doi.scale.y = .35; doi.position.set(d[0], -2, d[1]); sc.add(doi);
    });
    S.mt = new T.Mesh(new T.SphereGeometry(3, 24, 16), new T.MeshBasicMaterial({ color: 0xfde047 })); S.mt.position.set(-30, 32, -70); sc.add(S.mt);
    S.may = []; for (var i = 0; i < 6; i++) {
      var g = new T.Group(); [[0, 0, 2.2], [2.2, .4, 1.7], [-2.1, .2, 1.6], [1, 1.2, 1.5]].forEach(function (p) { var cm = new T.Mesh(new T.SphereGeometry(p[2], 14, 10), M('may', 0xffffff, { roughness: 1 })); cm.position.set(p[0], p[1], 0); g.add(cm); });
      g.position.set(-60 + i * 25, 22 + (i % 3) * 4, -60 - (i % 2) * 10); sc.add(g); S.may.push(g);
    }
    // nhà kho đỏ + hàng rào (đặt sau khi biết kích thước ruộng – xem datCanh)
    var kho = S.kho = new T.Group(); sc.add(kho);
    var tuong = M('kho', 0xb91c1c, { roughness: .8 }), trang = M('vien', 0xf8fafc);
    kho.add(mesh(new T.BoxGeometry(5, 3.6, 4), tuong, 0, 1.8, 0));
    var mai = new T.Shape(); mai.moveTo(-2.8, 0); mai.lineTo(0, 2.2); mai.lineTo(2.8, 0); mai.lineTo(-2.8, 0);
    var maiG = new T.ExtrudeGeometry(mai, { depth: 4.4, bevelEnabled: false }); maiG.translate(0, 3.6, -2.2); kho.add(mesh(maiG, M('mai', 0x7f1d1d)));
    kho.add(mesh(new T.BoxGeometry(2, 2.4, .1), trang, 0, 1.2, 2.03));
    [-1, 1].forEach(function (s) { var x = mesh(new T.BoxGeometry(2.6, .14, .06), trang, 0, 1.2, 2.1); x.rotation.z = s * .9; kho.add(x); });
    kho.add(mesh(new T.BoxGeometry(1, .8, .1), M('cuaSo', 0xfef3c7), 0, 3, 2.03));
    var sil = mesh(new T.CylinderGeometry(1, 1, 5, 20), M('silo', 0x94a3b8, { metalness: .4 }), 3.6, 2.5, -.5); kho.add(sil);
    kho.add(mesh(new T.SphereGeometry(1, 20, 10, 0, Math.PI * 2, 0, Math.PI / 2), M('silo2', 0x64748b, { metalness: .4 }), 3.6, 5, -.5));
    S.khoNhan = G3D.sprite(G3D.banner('🧺 0 nông sản', '#15803d'), 4.4, .69); S.khoNhan.position.set(0, 6.6, 0); kho.add(S.khoNhan);
    S.raoG = new T.Group(); sc.add(S.raoG);
    S.info = G3D.sprite(G3D.banner('🌾 NÔNG TRẠI', '#15803d'), 6, .94); sc.add(S.info); S.infoKey = '';
    S.ruong = new T.Group(); sc.add(S.ruong);
    S.giot = []; for (var j = 0; j < 14; j++) { var d = new T.Mesh(new T.SphereGeometry(.06, 8, 6), new T.MeshBasicMaterial({ color: 0x38bdf8 })); d.scale.y = 1.6; d.visible = false; sc.add(d); S.giot.push(d); }
  }
  function hangRao(x0, x1, z0, z1) {   // hàng rào gỗ quanh ruộng
    while (S.raoG.children.length) S.raoG.remove(S.raoG.children[0]);
    var go = M('rao', 0xfef3c7, { roughness: .9 });
    function canh(ax, az, bx, bz) {
      var L = Math.hypot(bx - ax, bz - az), n = Math.max(1, Math.round(L / 1.6)), goc = Math.atan2(bz - az, bx - ax);
      for (var i = 0; i <= n; i++) S.raoG.add(mesh(new T.BoxGeometry(.14, .9, .14), go, ax + (bx - ax) * i / n, .45, az + (bz - az) * i / n));
      [.35, .7].forEach(function (y) { var t = mesh(new T.BoxGeometry(L, .1, .06), go, (ax + bx) / 2, y, (az + bz) / 2); t.rotation.y = -goc; S.raoG.add(t); });
    }
    canh(x0, z0, x1, z0); canh(x0, z1, x1, z1); canh(x0, z0, x0, z1); canh(x1, z0, x1, z1);
  }

  // ---------------------------------------------------------------- cây trồng
  function la(m, x, y, z, s, rz, ry) { var o = mesh(new T.SphereGeometry(.13 * s, 10, 8), m, x, y, z); o.scale.set(1.8, .35, 1); o.rotation.set(0, ry || 0, rz || 0); return o; }
  function cay(muc, loai) {
    var g = new T.Group(), xanh = M('la', 0x22c55e, { roughness: .6 }), than = M('than', 0x15803d);
    if (muc === 0) {   // cây héo
      var h = mesh(new T.CylinderGeometry(.025, .035, .45, 6), M('heo', 0x78716c), .05, .2, 0); h.rotation.z = .6; g.add(h);
      g.add(la(M('laHeo', 0xa16207), .22, .32, 0, .9, -.9)); g.add(la(M('laHeo', 0xa16207), -.08, .12, .05, .7, .5));
      return g;
    }
    if (muc === 1) { g.add(mesh(new T.CylinderGeometry(.02, .025, .22, 6), than, 0, .11, 0)); g.add(la(xanh, .09, .24, 0, .8, .4)); g.add(la(xanh, -.09, .24, 0, .8, -.4)); return g; }
    if (loai === 'duahau' || loai === 'bingo') {   // cây bò sát đất
      for (var i = 0; i < 5; i++) g.add(la(xanh, Math.cos(i * 1.3) * .3, .06, Math.sin(i * 1.3) * .3, 1.4, 0, i));
      if (muc === 3) {
        if (loai === 'duahau') { var dh = mesh(new T.SphereGeometry(.3, 20, 14), new T.MeshStandardMaterial({ color: 0x166534, roughness: .5, map: G3D.tex(128, 64, function (c, w, hh) { c.fillStyle = '#15803d'; c.fillRect(0, 0, w, hh); c.fillStyle = '#052e16'; for (var s = 0; s < w; s += 16) c.fillRect(s, 0, 6, hh); }) }), .05, .24, .05); dh.scale.set(1.25, .85, .9); g.add(dh); }
        else { for (var b = 0; b < 8; b++) { var mu = mesh(new T.SphereGeometry(.17, 12, 10), M('bingo', 0xea580c, { roughness: .5 }), Math.cos(b / 8 * Math.PI * 2) * .13, .24, Math.sin(b / 8 * Math.PI * 2) * .13); mu.scale.set(.75, 1, .75); g.add(mu); } g.add(mesh(new T.CylinderGeometry(.03, .04, .14, 6), M('cuong', 0x65a30d), 0, .45, 0)); }
      }
      return g;
    }
    var cao = muc === 2 ? .55 : .75;
    g.add(mesh(new T.CylinderGeometry(.03, .045, cao, 8), than, 0, cao / 2, 0));
    for (var l = 0; l < 4; l++) g.add(la(xanh, Math.cos(l * 1.6) * .16, cao * (.35 + l * .14), Math.sin(l * 1.6) * .16, 1.1, l % 2 ? .5 : -.5, l * 1.6));
    if (muc === 3) {
      if (loai === 'ngo') [-1, 1].forEach(function (s) { var b = mesh(new T.CapsuleGeometry(.07, .22, 4, 10), M('ngo', 0xfacc15, { roughness: .5 }), s * .1, cao * .65, .05); b.rotation.z = s * .35; g.add(b); var v = mesh(new T.ConeGeometry(.08, .28, 8), xanh, s * .12, cao * .55, .05); v.rotation.z = s * .35 + Math.PI; g.add(v); });
      else if (loai === 'carot') { [-.12, .12].forEach(function (x) { var c = mesh(new T.ConeGeometry(.09, .4, 12), M('carot', 0xf97316, { roughness: .5 }), x, .12, 0); c.rotation.x = Math.PI; g.add(c); }); }
      else if (loai === 'cachua') { [[.14, .5], [-.12, .62], [.05, .75], [-.16, .4]].forEach(function (p) { g.add(mesh(new T.SphereGeometry(.1, 14, 10), M('cachua', 0xdc2626, { roughness: .35 }), p[0], p[1] * cao / .75, .08)); }); }
      else { for (var c2 = 0; c2 < 4; c2++) { var bc = mesh(new T.SphereGeometry(.24 - c2 * .04, 14, 10), M('bapcai' + c2, [0x86efac, 0x4ade80, 0x22c55e, 0x16a34a][c2], { roughness: .6 }), 0, .2 + c2 * .03, 0); bc.scale.y = .8; g.add(bc); } }
    }
    return g;
  }
  function sau() {   // con sâu xanh: chuỗi cầu
    var g = new T.Group();
    for (var i = 0; i < 6; i++) g.add(mesh(new T.SphereGeometry(.075 - i * .006, 10, 8), M('sau' + (i % 2), i % 2 ? 0x65a30d : 0x84cc16), -i * .1, .08, 0));
    var dau = mesh(new T.SphereGeometry(.09, 12, 10), M('dauSau', 0x4d7c0f), .1, .1, 0); g.add(dau);
    [-1, 1].forEach(function (s) { g.add(mesh(new T.SphereGeometry(.022, 8, 6), M('matSau', 0x111111), .17, .14, s * .04)); g.add(mesh(new T.CylinderGeometry(.008, .008, .1, 4), M('rauSau', 0x111111), .12, .22, s * .04)); });
    g.userData.dot = g.children.slice(0, 6); return g;
  }
  function binhTuoi() { var g = new T.Group(), m = M('binh', 0x0ea5e9, { metalness: .4, roughness: .3 }); g.add(mesh(new T.CylinderGeometry(.12, .14, .24, 14), m)); var voi = mesh(new T.CylinderGeometry(.025, .03, .3, 8), m, .17, .06, 0); voi.rotation.z = -1; g.add(voi); var q = mesh(new T.TorusGeometry(.09, .02, 6, 12, Math.PI), m, 0, .14, 0); g.add(q); return g; }

  // ---------------------------------------------------------------- dựng ruộng theo số câu, số đội
  function datRuong(n, doi) {
    var key = n + '|' + doi.map(function (d) { return d.ten + d.mau; }).join(';'); if (key === S.ruongKey) return; S.ruongKey = key;
    while (S.ruong.children.length) S.ruong.remove(S.ruong.children[0]);
    (S.hs || []).forEach(function (h) { S.scene.remove(h.obj); });
    var nd = doi.length, toiDa = nd === 1 ? 10 : nd === 2 ? 8 : 10, cot = n <= toiDa ? n : Math.ceil(n / Math.ceil(n / toiDa)), hang = Math.ceil(n / cot);
    var khoiZ = hang * O + 1.2, rong = cot * O, sau0 = -(nd * khoiZ) / 2;
    S.cot = cot; S.hang = hang; S.luong = [];
    var dat = M('dat', 0x92400e, { roughness: 1 }), ranh = M('ranh', 0x78350f, { roughness: 1 });
    doi.forEach(function (d, j) {
      var z0 = sau0 + j * khoiZ + .6, row = [];
      var nen = mesh(new T.BoxGeometry(rong + .5, .05, hang * O + .3), M('nenDoi' + j, new T.Color(d.mau).lerp(new T.Color(0x65a30d), .75).getHex()), 0, .025, z0 + hang * O / 2 - O / 2); nen.receiveShadow = true; S.ruong.add(nen);
      for (var i = 0; i < n; i++) {
        var x = -rong / 2 + (i % cot) * O + O / 2, z = z0 + Math.floor(i / cot) * O;
        var lg = new T.Group(); lg.position.set(x, 0, z); S.ruong.add(lg);
        var o = mesh(new T.BoxGeometry(1.05, .18, 1.05), dat, 0, .09, 0); lg.add(o);
        [-.3, 0, .3].forEach(function (dz) { var r = mesh(new T.CylinderGeometry(.06, .06, .9, 6), ranh, 0, .2, dz); r.rotation.z = Math.PI / 2; lg.add(r); });
        var vien = new T.Mesh(new T.TorusGeometry(.66, .045, 6, 4), new T.MeshBasicMaterial({ color: 0xfacc15 })); vien.rotation.set(Math.PI / 2, 0, Math.PI / 4); vien.position.y = .2; vien.visible = false; lg.add(vien);
        row.push({ g: lg, vien: vien, cay: null, muc: undefined, x: x, z: z });
      }
      var bien = G3D.sprite(G3D.label(d.ten, d.mau, '🧺 0 nông sản'), 2.6, .82); bien.position.set(-rong / 2 - 1.6, 1.2, z0 + (hang - 1) * O / 2); S.ruong.add(bien);
      S.luong.push({ o: row, bien: bien, bienKey: '' });
    });
    hangRao(-rong / 2 - 3, rong / 2 + .9, sau0 - .2, sau0 + nd * khoiZ + .2);
    S.kho.position.set(rong / 2 + 6.5, 0, sau0 - 7); S.kho.rotation.y = -.45;
    S.xa = Math.max(rong * .78, nd * khoiZ * 1.3) + 4;
    S.info.position.set(0, 3.2, sau0 - 2.5);
    S.hs = doi.map(function (d, j) {   // mỗi đội một bác nông dân (HS tự chơi: em) xách bình tưới
      var kid = G3D.kid(new T.Color(d.mau).getHex(), j % 2 === 1, 'stand'); kid.scale.setScalar(.75);
      var b = binhTuoi(); b.position.set(.33, .7, .2); kid.userData.body.add(b); S.scene.add(kid);
      return { obj: kid, j: j, x: -rong / 2 - .8, z: S.luong[j].o[0].z };
    });
  }

  // ---------------------------------------------------------------- khung hình
  function frame() {
    if (!S) return; S.raf = requestAnimationFrame(frame);
    if (!S.el.offsetParent) return;
    var now = performance.now(), t = now / 1000, dt = Math.min(.05, (now - (S.last || now)) / 1000); S.last = now;
    var s = S.snapshot(); if (!s || !s.doi) return;
    var tNow = s.t || Date.now(), fx = s.fx || {}, aD = fx.loai === 'dung' ? tNow - fx.at : 1e9, aS = fx.loai === 'sai' ? tNow - fx.at : 1e9;
    datRuong(s.n, s.doi);
    var tong = 0;
    s.doi.forEach(function (d, j) {
      var L = S.luong[j], san = 0;
      L.o.forEach(function (lu, i) {
        var muc = (d.cay || [])[i]; if (muc !== undefined && muc !== null) san += muc;
        if (muc !== lu.muc) {   // dựng lại cây khi mức thay đổi
          if (lu.cay) lu.g.remove(lu.cay); lu.cay = null; lu.muc = muc;
          if (muc !== undefined && muc !== null) { lu.cay = cay(muc, LOAI[i % LOAI.length]); lu.cay.position.y = .18; lu.g.add(lu.cay); }
        }
        var moc = fx.cau === i && aD < 900 && (!fx.doi || fx.doi.indexOf(j) >= 0);
        if (lu.cay) { var sc = moc ? Math.min(1, aD / 600) : 1; sc = sc < 1 ? sc * (1 + Math.sin(sc * Math.PI) * .35) : 1; lu.cay.scale.setScalar(Math.max(.05, sc) * 1.45); /* cây to hơn luống cho dễ nhìn trên máy chiếu */ lu.cay.rotation.z = Math.sin(t * 1.5 + i) * .04; }
        lu.vien.visible = i === s.k && !s.xong; if (lu.vien.visible) lu.vien.material.color.setHSL(.14, 1, .5 + .15 * Math.sin(t * 6));
      });
      tong += san;
      var bk = d.ten + san; if (bk !== L.bienKey) { L.bienKey = bk; G3D.setSprite(L.bien, G3D.label(d.ten, d.mau, '🧺 ' + san + ' nông sản')); }
    });
    // sâu trên luống đang trồng (HS tự chơi trả lời sai)
    var lu0 = !s.xong && S.luong[0] && S.luong[0].o[Math.min(s.k, s.n - 1)];
    if (s.sau && lu0) {
      if (!S.con) { S.con = sau(); S.con.scale.setScalar(1.9); S.scene.add(S.con); }
      S.con.visible = true; var nh = aS < 500 ? Math.abs(Math.sin(aS / 60)) * .2 : 0;
      S.con.position.set(lu0.x + Math.sin(t * .8) * .3, .18 + nh, lu0.z + Math.cos(t * .8) * .2); S.con.rotation.y = -t * .8;
      S.con.userData.dot.forEach(function (c, i) { c.position.y = .08 + Math.abs(Math.sin(t * 6 - i * .7)) * .04; });
    } else if (S.con) S.con.visible = false;
    // nông dân đi tới luống đang trồng; đúng thì nghiêng bình tưới
    S.hs.forEach(function (h) {
      var L = S.luong[h.j], lu = L.o[Math.min(s.k, s.n - 1)], tx = s.xong ? L.o[0].x - 1.6 : lu.x - .85, tz = s.xong ? L.o[0].z : lu.z + .2;
      var dx = tx - h.x, dz = tz - h.z, dl = Math.hypot(dx, dz), v = Math.min(dl, dt * 3.2);
      if (dl > .02) { h.x += dx / dl * v; h.z += dz / dl * v; h.obj.rotation.y = Math.atan2(dx, dz); } else h.obj.rotation.y += (Math.PI / 2 - h.obj.rotation.y) * Math.min(1, dt * 6);
      h.obj.position.set(h.x, .02, h.z);
      var b = h.obj.userData.body, tuoi = aD < 900 && (!fx.doi || fx.doi.indexOf(h.j) >= 0), vui = s.xong ? Math.abs(Math.sin(t * 6 + h.j)) * .4 : 0;
      b.position.y = (dl > .05 ? Math.abs(Math.sin(t * 10)) * .06 : 0) + vui; b.rotation.z = tuoi ? -Math.sin(Math.min(1, aD / 300) * Math.PI / 2) * .25 : 0;
    });
    // giọt nước khi tưới
    S.giot.forEach(function (d, i) {
      var j = fx.doi ? fx.doi[i % Math.max(1, fx.doi.length)] : 0, L = S.luong[j], lu = L && L.o[fx.cau];
      if (aD < 900 && lu) { var p = ((aD / 900) * 2 + i / S.giot.length) % 1; d.visible = true; d.position.set(lu.x + Math.sin(i * 2.4) * .3, 1.3 - p * 1.1, lu.z + Math.cos(i * 1.7) * .3); }
      else d.visible = false;
    });
    var kk = String(tong); if (kk !== S.khoKey) { S.khoKey = kk; G3D.setSprite(S.khoNhan, G3D.banner('🧺 ' + tong + ' nông sản', '#15803d')); }
    var chu = s.xong ? ['🌾 VỤ MÙA KẾT THÚC – ' + tong + ' NÔNG SẢN!', '#15803d'] : s.sau ? ['🐛 SÂU BÒ VÀO LUỐNG – TRẢ LỜI LẠI!', '#b45309'] : aD < 1100 ? ['💧 CÂY ĐANG LỚN!', '#0284c7'] : ['🌱 LUỐNG ' + Math.min(s.k + 1, s.n) + '/' + s.n, '#15803d'];
    if (chu.join() !== S.infoKey) { S.infoKey = chu.join(); G3D.setSprite(S.info, G3D.banner(chu[0], chu[1])); }
    S.may.forEach(function (m, i) { m.position.x += dt * (.6 + i % 3 * .25); if (m.position.x > 70) m.position.x = -70; });
    var cam = S.camera, xa = S.xa || 12;
    cam.position.set(-.6 + Math.sin(t * .12) * xa * .06, xa * .56, xa * .82); cam.lookAt(-.6, 0, -xa * .1);   /* giữa ruộng (kể cả bảng tên đội bên trái) */
    S.renderer.render(S.scene, cam);
  }

  window.Farm3D = {
    supported: function () { return window.G3D && G3D.supported(); },
    mount: function (el, snapshot) {
      return G3D.load().then(function () {
        T = G3D.T();
        if (S && S.el === el) { S.snapshot = snapshot; S.ruongKey = S.infoKey = S.khoKey = ''; return S; }
        if (S) { cancelAnimationFrame(S.raf); try { S.ro.disconnect(); S.renderer.dispose(); } catch (e) {} }
        var o = G3D.scene(el, 0x7dd3fc, [60, 140]);
        S = Object.assign(o, { snapshot: snapshot });
        o.scene.add(new T.HemisphereLight(0xe0f2fe, 0x4d7c0f, .75));
        var nang = new T.DirectionalLight(0xfff7ed, 1.05); nang.position.set(-10, 22, 12); nang.castShadow = true; nang.shadow.mapSize.set(2048, 2048);
        var c = nang.shadow.camera; c.left = -22; c.right = 22; c.top = 22; c.bottom = -22; o.scene.add(nang);
        build(); frame(); return S;
      });
    }
  };
})();
