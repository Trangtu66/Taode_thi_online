// ĐẤU TRƯỜNG NHẬP VAI – ĐẤU TRƯỜNG 3D (cần game3d_chung.js). Dùng cho tu_choi.html (HS tự chơi) và tro_choi_lop.html (GV trình chiếu, 1–4 đội).
// Rpg3D.mount(el, snapshot) – snapshot() trả đúng trạng thái sân 2D của game_moi.js:
//   {n, k, ai:[{ten, ic, trum, tu, den, so, mau:{con, max}, ha, tron}], iAi, hp, hpMax, doi:[{ten, mau, sat}], xong, thang,
//    fx:{loai:'danh'|'chimang'|'trung'|'ha'|'guc'|'tron', at, sat, doi:[chỉ số đội vừa chém]}, t}
// Hình học sinh (hiệp sĩ): áo cổ trắng, không khăn quàng.
(function () {
  'use strict';
  var T, S = null;
  var CHO = [[-3.6, .4], [-4.6, -1.1], [-2.7, -1.6], [-5.3, 1.3]];   // chỗ đứng các hiệp sĩ (x, z)
  var QX = 3.6;                                                       // chỗ đứng của quái vật

  function M(k, c, o) { return G3D.mat('rpg_' + k, c, o); }
  function hop(w, h, d, m, x, y, z) { var o = new T.Mesh(new T.BoxGeometry(w, h, d), m); o.position.set(x || 0, y || 0, z || 0); o.castShadow = true; return o; }
  function cau(r, m, x, y, z, sx, sy, sz) { var o = new T.Mesh(new T.SphereGeometry(r, 20, 14), m); o.position.set(x || 0, y || 0, z || 0); if (sx) o.scale.set(sx, sy, sz); o.castShadow = true; return o; }
  function mat2(g, z) { var tr = new T.MeshBasicMaterial({ color: 0xffffff }), den = new T.MeshBasicMaterial({ color: 0x111111 }); [-1, 1].forEach(function (s) { var e = cau(.09, tr, s * .14, 0, z); var p = cau(.045, den, s * .14, 0, z + .06); g.add(e); g.add(p); }); }

  // ---------------------------------------------------------------- dựng đấu trường
  function build() {
    var sc = S.scene;
    var san = new T.Mesh(new T.CircleGeometry(16, 64), new T.MeshStandardMaterial({ map: G3D.tex(512, 512, function (g, w, h) {
      g.fillStyle = '#57534e'; g.fillRect(0, 0, w, h);
      for (var y = 0; y < h; y += 64) for (var x = (y / 64) % 2 ? -32 : 0; x < w; x += 64) { g.fillStyle = 'hsl(30,6%,' + (30 + Math.random() * 10) + '%)'; g.fillRect(x + 2, y + 2, 60, 60); }
    }), roughness: .95 }));
    san.material.map.wrapS = san.material.map.wrapT = T.RepeatWrapping; san.material.map.repeat.set(6, 6);
    san.rotation.x = -Math.PI / 2; san.receiveShadow = true; sc.add(san);
    var vong = new T.Mesh(new T.RingGeometry(7.6, 8, 64), new T.MeshBasicMaterial({ color: 0xfacc15, transparent: true, opacity: .45 })); vong.rotation.x = -Math.PI / 2; vong.position.y = .02; sc.add(vong);
    // tường đấu trường (nửa vòng phía sau) có vòm cửa
    var tuong = new T.Mesh(new T.CylinderGeometry(15, 15, 7, 48, 1, true, Math.PI * .55, Math.PI * .9), new T.MeshStandardMaterial({ side: T.DoubleSide, roughness: .9, map: G3D.tex(1024, 256, function (g, w, h) {
      g.fillStyle = '#44403c'; g.fillRect(0, 0, w, h); g.strokeStyle = '#292524'; g.lineWidth = 4;
      for (var y = 0; y < h; y += 32) for (var x = (y / 32) % 2 ? -32 : 0; x < w; x += 64) g.strokeRect(x, y, 64, 32);
      for (var a = 40; a < w; a += 128) { g.fillStyle = '#0c0a09'; g.beginPath(); g.moveTo(a, h); g.lineTo(a, 120); g.arc(a + 34, 120, 34, Math.PI, 0); g.lineTo(a + 68, h); g.fill(); }
    }) }));
    tuong.material.map.wrapS = T.RepeatWrapping; tuong.material.map.repeat.set(3, 1); tuong.position.y = 3.5; sc.add(tuong);
    // cờ hiệu
    [-1, 1].forEach(function (s, i) {
      var cot = hop(.12, 6, .12, M('cotCo', 0x78350f), s * 9, 3, -9); sc.add(cot);
      var co = new T.Mesh(new T.PlaneGeometry(1.6, 2.4), new T.MeshStandardMaterial({ color: i ? 0x2563eb : 0xdc2626, side: T.DoubleSide })); co.position.set(s * 9 + .85, 4.9, -9); sc.add(co); (S.co = S.co || []).push(co);
    });
    // đuốc
    S.duoc = [];
    [[-7.5, -5], [7.5, -5], [-9.5, 1], [9.5, 1]].forEach(function (p) {
      var cot = hop(.2, 2.6, .2, M('cotDuoc', 0x3f2a14), p[0], 1.3, p[1]); sc.add(cot);
      var bat = new T.Mesh(new T.CylinderGeometry(.3, .18, .3, 12), M('batDuoc', 0x52525b, { metalness: .6 })); bat.position.set(p[0], 2.7, p[1]); sc.add(bat);
      var lua = new T.Mesh(new T.ConeGeometry(.28, .8, 12), new T.MeshBasicMaterial({ color: 0xf97316, transparent: true, opacity: .9 })); lua.position.set(p[0], 3.2, p[1]); sc.add(lua);
      var loi = new T.Mesh(new T.ConeGeometry(.15, .45, 10), new T.MeshBasicMaterial({ color: 0xfde047 })); loi.position.set(p[0], 3.08, p[1]); sc.add(loi);
      var den = new T.PointLight(0xff8a3d, 1.3, 11); den.position.set(p[0], 3.4, p[1]); sc.add(den);
      S.duoc.push({ lua: lua, den: den });
    });
    // sao
    var sao = new T.BufferGeometry(), v = []; for (var i = 0; i < 400; i++) { var g = Math.random() * Math.PI, r = 60; v.push(Math.cos(g) * r * (Math.random() * 2 - 1), 12 + Math.random() * 30, -30 - Math.random() * 20); }
    sao.setAttribute('position', new T.Float32BufferAttribute(v, 3)); sc.add(new T.Points(sao, new T.PointsMaterial({ color: 0xe9d5ff, size: .25 })));
    // chữ, máu quái, máu hiệp sĩ
    S.info = G3D.sprite(G3D.banner('ĐẤU TRƯỜNG', '#7c3aed'), 6.4, 1); S.info.position.set(0, 6.3, -2); sc.add(S.info); S.infoKey = '';
    S.mauQ = G3D.sprite(G3D.label('', '#ef4444'), 3.4, 1.06); sc.add(S.mauQ); S.mauQKey = '';
    S.tim = G3D.sprite(timTex(5, 5), 3, .6); S.tim.position.set(-4, 3.9, 0); sc.add(S.tim); S.timKey = '';
    // nhát chém, tia lửa trúng đòn
    S.chem = new T.Mesh(new T.TorusGeometry(1.3, .07, 6, 40, Math.PI * .9), new T.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0, depthWrite: false })); sc.add(S.chem);
    S.chop = new T.PointLight(0xfde047, 0, 14); S.chop.position.set(QX - 1, 2.5, 1.5); sc.add(S.chop);
    S.do = new T.PointLight(0xff0000, 0, 12); S.do.position.set(-4, 2.5, 2); sc.add(S.do);
    S.hat = []; for (var h = 0; h < 24; h++) { var q = new T.Mesh(new T.BoxGeometry(.12, .12, .12), new T.MeshBasicMaterial({ color: h % 3 ? 0xfacc15 : 0x4ade80, transparent: true })); q.visible = false; sc.add(q); S.hat.push(q); }
    S.so = [];   // số sát thương bay lên
  }
  function timTex(hp, max) { return G3D.tex(512, 96, function (g, w, h) { g.font = '64px Arial'; g.textAlign = 'center'; g.textBaseline = 'middle'; var s = ''; for (var i = 0; i < max; i++) s += i < hp ? '❤️' : '🤍'; g.fillText(s, w / 2, h / 2 + 4); }); }
  function chuTex(chu, mau) { return G3D.tex(512, 160, function (g, w, h) { g.font = '900 96px Arial'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.lineWidth = 14; g.strokeStyle = 'rgba(0,0,0,.75)'; g.strokeText(chu, w / 2, h / 2); g.fillStyle = mau; g.fillText(chu, w / 2, h / 2); }); }
  function mauQTex(ai) {
    return G3D.tex(512, 160, function (g, w, h) {
      var tl = Math.max(0, Math.min(1, ai.mau.con / Math.max(1, ai.mau.max)));
      g.fillStyle = 'rgba(15,23,42,.85)'; G3D.rr(g, 4, 4, w - 8, h - 8, 30); g.fill();
      g.fillStyle = ai.trum ? '#fca5a5' : '#e9d5ff'; g.font = '800 44px Arial'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText((ai.trum ? '👑 ' : '') + ai.ten, w / 2, 46);
      g.fillStyle = '#1e1b4b'; G3D.rr(g, 30, 88, w - 60, 44, 20); g.fill();
      g.fillStyle = tl > .5 ? '#ef4444' : tl > .2 ? '#f97316' : '#facc15'; if (tl > 0) { G3D.rr(g, 34, 92, (w - 68) * tl, 36, 16); g.fill(); }
      g.fillStyle = '#fff'; g.font = '800 30px Arial'; g.fillText(Math.ceil(ai.mau.con) + ' / ' + ai.mau.max + ' máu', w / 2, 111);
    });
  }

  // ---------------------------------------------------------------- quái vật (low-poly, mỗi loại một kiểu)
  function quai(ic) {
    var g = new T.Group(), b = new T.Group(); g.add(b); g.userData = { body: b, loai: ic, canh: [], huong: /👾|🦇|👹/.test(ic) ? 'z' : 'x' };   // huong: mặt quái theo trục +z (slime, dơi, quỷ) hay −x (sói, nhện, rồng)
    if (ic === '👾') {   // slime
      var m = new T.MeshStandardMaterial({ color: 0x22c55e, transparent: true, opacity: .85, roughness: .2 });
      b.add(cau(1, m, 0, .8, 0, 1.2, .85, 1.1)); var e = new T.Group(); e.position.set(0, 1.05, .9); mat2(e, 0); b.add(e);
      g.userData.cao = 2.2;
    } else if (ic === '🦇') {   // dơi
      var md = M('doi', 0x4c1d95), mc = new T.MeshStandardMaterial({ color: 0x6d28d9, side: T.DoubleSide });
      b.add(cau(.55, md, 0, 2.2, 0, 1, 1.1, .9)); var e2 = new T.Group(); e2.position.set(0, 2.35, .5); mat2(e2, 0); b.add(e2);
      [-1, 1].forEach(function (s) { var tai = new T.Mesh(new T.ConeGeometry(.15, .4, 6), md); tai.position.set(s * .25, 2.85, 0); b.add(tai);
        var c = new T.Group(); c.position.set(s * .45, 2.25, 0); var sh = new T.Shape(); sh.moveTo(0, 0); sh.lineTo(s * 1.6, .6); sh.lineTo(s * 1.4, -.2); sh.lineTo(s * 1, .1); sh.lineTo(s * .7, -.4); sh.lineTo(0, -.3); var w = new T.Mesh(new T.ShapeGeometry(sh), mc); c.add(w); b.add(c); g.userData.canh.push({ o: c, s: s }); });
      g.userData.bay = true; g.userData.cao = 3.4;
    } else if (ic === '🐺') {   // sói
      var ms = M('soi', 0x6b7280), mt = M('soiToi', 0x374151);
      b.add(hop(1.8, .8, .8, ms, 0, 1.2, 0)); var dau = hop(.7, .65, .7, ms, -1.1, 1.65, 0); b.add(dau); b.add(hop(.45, .3, .45, mt, -1.55, 1.5, 0));
      [-1, 1].forEach(function (s) { var tai = new T.Mesh(new T.ConeGeometry(.13, .35, 4), mt); tai.position.set(-1.05, 2.1, s * .2); b.add(tai); var e = cau(.06, new T.MeshBasicMaterial({ color: 0xfacc15 }), -1.47, 1.78, s * .18); b.add(e); });
      [[-.7, .3], [-.7, -.3], [.7, .3], [.7, -.3]].forEach(function (p) { b.add(hop(.22, .8, .22, mt, p[0], .4, p[1])); });
      var duoi = hop(.8, .2, .2, ms, 1.25, 1.5, 0); duoi.rotation.z = .5; b.add(duoi);
      g.userData.cao = 2.5; g.userData.quay = true;
    } else if (ic === '👹') {   // quỷ đỏ
      var mq = M('quy', 0xb91c1c), mk = M('sung', 0xfef3c7);
      b.add(hop(.6, .9, .4, M('quyQuan', 0x1f2937), 0, .45, 0)); b.add(hop(1.1, 1.1, .7, mq, 0, 1.45, 0)); b.add(cau(.45, mq, 0, 2.35, 0));
      var e3 = new T.Group(); e3.position.set(0, 2.42, .38); mat2(e3, 0); b.add(e3);
      [-1, 1].forEach(function (s) { var sung = new T.Mesh(new T.ConeGeometry(.1, .45, 8), mk); sung.position.set(s * .3, 2.8, 0); sung.rotation.z = -s * .4; b.add(sung); b.add(hop(.25, .9, .25, mq, s * .7, 1.4, 0)); });
      var chuy = new T.Group(); chuy.position.set(.75, 1, .2); chuy.add(hop(.12, 1.3, .12, M('canChuy', 0x78350f), 0, .3, 0)); chuy.add(cau(.25, M('dauChuy', 0x52525b, { metalness: .7 }), 0, 1, 0)); b.add(chuy); g.userData.vk = chuy;
      g.userData.cao = 3.2;
    } else if (ic === '🕷️') {   // nhện
      var mn = M('nhen', 0x111827);
      b.add(cau(.75, mn, .3, 1, 0, 1.2, .9, 1)); b.add(cau(.4, mn, -.6, .95, 0));
      for (var i = 0; i < 3; i++) b.add(cau(.06, new T.MeshBasicMaterial({ color: 0xef4444 }), -.92, 1.05 + (i - 1) * .04, (i - 1) * .14));
      var chan = []; [-1, 1].forEach(function (s) { for (var j = 0; j < 4; j++) { var c = hop(.08, .08, 1.3, mn, -.3 + j * .3, .7, s * .7); c.rotation.x = s * .6; b.add(c); chan.push(c); } });
      g.userData.chan = chan; g.userData.cao = 2;
    } else {   // 🐉 Rồng lửa – trùm
      var mr = M('rong', 0x15803d), mb = M('rongBung', 0xfacc15), mm = M('rongSung', 0xfef3c7);
      b.add(cau(1.2, mr, .4, 1.9, 0, 1.4, 1, 1)); b.add(cau(.8, mb, -.2, 1.7, .2, 1, .9, .8));
      var co = hop(.6, 1.6, .6, mr, -.9, 3, 0); co.rotation.z = .5; b.add(co);
      var dau = new T.Group(); dau.position.set(-1.5, 3.8, 0); b.add(dau); g.userData.dau = dau;
      dau.add(hop(1, .6, .7, mr, -.2, 0, 0)); var ham = hop(.8, .2, .55, mr, -.35, -.38, 0); dau.add(ham); g.userData.ham = ham;
      var e4 = new T.Group(); e4.position.set(-.35, .18, 0); [-1, 1].forEach(function (s) { e4.add(cau(.09, new T.MeshBasicMaterial({ color: 0xfde047 }), 0, 0, s * .36)); }); dau.add(e4);
      [-1, 1].forEach(function (s) { var sung = new T.Mesh(new T.ConeGeometry(.1, .6, 8), mm); sung.position.set(.15, .45, s * .22); sung.rotation.z = .6; dau.add(sung); });
      var vm = new T.Group(); vm.position.set(0, .45, 0); for (var v = 0; v < 5; v++) { var nh = new T.Mesh(new T.ConeGeometry(.08, .28, 4), M('vuongMien', 0xfacc15, { metalness: .9, roughness: .2, emissive: 0x854d0e })); nh.position.set(-.2 + Math.cos(v / 5 * Math.PI * 2) * .22, .1, Math.sin(v / 5 * Math.PI * 2) * .22); vm.add(nh); } dau.add(vm);
      var mw = new T.MeshStandardMaterial({ color: 0x991b1b, side: T.DoubleSide });
      [-1, 1].forEach(function (s) { var c = new T.Group(); c.position.set(.5, 2.6, s * .5); var sh = new T.Shape(); sh.moveTo(0, 0); sh.lineTo(-.6, 2.4); sh.lineTo(.6, 1.6); sh.lineTo(1.4, 2.2); sh.lineTo(1.8, .6); sh.lineTo(.8, .2); var w = new T.Mesh(new T.ShapeGeometry(sh), mw); w.rotation.y = s > 0 ? 0 : Math.PI; c.add(w); c.rotation.x = s * .5; b.add(c); g.userData.canh.push({ o: c, s: s, rong: true }); });
      var duoi = hop(2, .4, .4, mr, 2, 1.3, 0); duoi.rotation.z = -.35; b.add(duoi); var mui = new T.Mesh(new T.ConeGeometry(.3, .6, 4), mm); mui.position.set(3, 1, 0); mui.rotation.z = -Math.PI / 2; b.add(mui);
      [[-.4, .6], [-.4, -.6], [1, .6], [1, -.6]].forEach(function (p) { b.add(hop(.4, 1.1, .4, mr, p[0], .55, p[1])); });
      g.userData.cao = 5.2; g.userData.trum = true;
      // lửa phun
      var lua = []; for (var f = 0; f < 14; f++) { var l = new T.Mesh(new T.SphereGeometry(.25, 10, 8), new T.MeshBasicMaterial({ color: f % 2 ? 0xf97316 : 0xfde047, transparent: true, opacity: 0, depthWrite: false })); S.scene.add(l); lua.push(l); }
      g.userData.lua = lua;
    }
    g.traverse(function (o) { if (o.isMesh) { o.castShadow = true; o.material = o.material.clone(); } });   // vật liệu riêng: quái mờ dần khi bị hạ không làm ảnh hưởng quái cùng loại về sau
    return g;
  }
  function boQuai() { if (!S.q) return; S.scene.remove(S.q); (S.q.userData.lua || []).forEach(function (l) { S.scene.remove(l); }); S.q = null; }

  // ---------------------------------------------------------------- hiệp sĩ (học sinh cầm kiếm, khiên)
  function hiepSi(mau, girl) {
    var o = G3D.kid(new T.Color(mau).getHex(), girl, 'stand'), b = o.userData.body;
    var kiem = new T.Group(); kiem.position.set(.36, .8, .05); b.add(kiem);
    kiem.add(hop(.07, 1.1, .03, M('luoiKiem', 0xe5e7eb, { metalness: .9, roughness: .15 }), 0, .62, .1));
    kiem.add(hop(.32, .06, .08, M('chuoiKiem', 0xa16207, { metalness: .6 }), 0, .07, .1)); kiem.add(hop(.07, .2, .07, M('canKiem', 0x78350f), 0, -.06, .1));
    kiem.rotation.x = .5;
    var khien = new T.Mesh(new T.CylinderGeometry(.34, .34, .07, 20), new T.MeshStandardMaterial({ color: new T.Color(mau), metalness: .3, roughness: .4 })); khien.rotation.x = Math.PI / 2; khien.position.set(-.42, 1.1, .16); b.add(khien);
    var vien = new T.Mesh(new T.TorusGeometry(.34, .035, 6, 24), M('vienKhien', 0xfde68a, { metalness: .8 })); vien.position.copy(khien.position); vien.position.z += .04; b.add(vien);
    o.userData.kiem = kiem; o.scale.setScalar(1.3); return o;
  }
  function dongBoDoi(doi) {
    var key = doi.map(function (d) { return d.ten + d.mau; }).join('|');
    if (key !== S.doiKey) {
      S.doiKey = key; (S.hs || []).forEach(function (k) { S.scene.remove(k.obj); });
      S.hs = doi.slice(0, 4).map(function (d, j) {
        var o = hiepSi(d.mau, j % 2 === 1), p = doi.length === 1 ? [-3.4, .6] : CHO[j];
        if (doi.length === 1) o.scale.setScalar(1.55);
        o.position.set(p[0], 0, p[1]); o.rotation.y = .5; S.scene.add(o);   // nhìn chéo: vừa hướng về quái vừa hướng ra máy quay
        var lab = G3D.sprite(G3D.label(d.ten, d.mau), 1.6, .5); lab.position.set(0, 2.45, 0); o.add(lab);
        return { obj: o, lab: lab, j: j, x0: p[0], z0: p[1], satKey: '' };
      });
    }
    S.hs.forEach(function (k) { var d = doi[k.j], sk = doi.length > 1 ? String(d.sat || 0) : ''; if (sk !== k.satKey) { k.satKey = sk; G3D.setSprite(k.lab, G3D.label(d.ten, d.mau, doi.length > 1 ? '⚔️ ' + (d.sat || 0) + ' sát thương' : '')); k.lab.scale.set(1.6, doi.length > 1 ? .7 : .5, 1); } });
  }
  function soBay(chu, mau, pos) { var sp = G3D.sprite(chuTex(chu, mau), 2.6, .8); sp.position.copy(pos); S.scene.add(sp); S.so.push({ sp: sp, t0: performance.now() }); }

  // ---------------------------------------------------------------- khung hình
  function frame() {
    if (!S) return; S.raf = requestAnimationFrame(frame);
    if (!S.el.offsetParent) return;
    var now = performance.now(), t = now / 1000, dt = Math.min(.05, (now - (S.last || now)) / 1000); S.last = now;
    var s = S.snapshot(); if (!s || !s.ai || !s.ai.length) return;
    var tNow = s.t || Date.now(), fx = s.fx || {}, tuoi = function (l) { return fx.loai === l ? tNow - fx.at : 1e9; };
    var aDanh = Math.min(tuoi('danh'), tuoi('chimang')), aChi = tuoi('chimang'), aTrung = tuoi('trung'), aHa = tuoi('ha'), aGuc = tuoi('guc'), aTron = tuoi('tron');
    var iA = Math.min(s.iAi, s.ai.length - 1), ai = s.ai[iA];
    dongBoDoi(s.doi);
    // đổi quái khi sang ải mới (quái mới bước vào từ bên phải)
    if (S.qI !== iA) { boQuai(); S.qI = iA; S.q = quai(ai.ic); S.q.position.set(QX + 7, 0, -.4); S.q.scale.setScalar(ai.trum ? 1.15 : 1.25); S.scene.add(S.q); S.qVao = now; }
    // hiệu ứng mới → số sát thương bay lên, hạt sáng
    if (fx.at && fx.at !== S.fxAt) {
      S.fxAt = fx.at;
      var dau = new T.Vector3(QX - .6, (S.q.userData.cao || 3) * S.q.scale.x * .75 + .6, .8);
      if (fx.loai === 'danh' || fx.loai === 'chimang' || fx.loai === 'ha') { if (fx.sat) soBay('-' + fx.sat, fx.loai === 'chimang' ? '#fde047' : '#fca5a5', dau); if (fx.loai === 'chimang') soBay('⚡ CHÍ MẠNG!', '#fde047', new T.Vector3(0, 4.4, 1.5)); }
      if (fx.loai === 'trung') soBay('-1 ❤️', '#fecaca', new T.Vector3(-3.8, 3.4, 1));
      if (fx.loai === 'ha') S.hat.forEach(function (h, i) { h.visible = true; h.userData = { v: new T.Vector3((Math.random() - .5) * 6, 4 + Math.random() * 4, (Math.random() - .5) * 6), t0: now }; h.position.set(QX, 2, -.4); });
    }
    // ----- quái vật
    var q = S.q, qb = q.userData.body, vao = Math.min(1, (now - S.qVao) / 1400), roi = 0, mo = 1;
    var conQuai = !s.xong || (s.thang && aHa < 1200);
    var huong = q.userData.huong === 'z' ? -.7 : .4;   // quay mặt về phía hiệp sĩ và máy quay
    if (ai.ha) { var p = Math.min(1, aHa / 1000); mo = 1 - p; q.rotation.y = huong + p * 6; q.scale.setScalar((ai.trum ? 1.15 : 1.25) * (1 - p * .8)); }
    else if (ai.tron) { roi = Math.min(1, aTron / 1200); q.rotation.y = q.userData.huong === 'z' ? Math.PI / 2 : Math.PI; }
    else q.rotation.y = huong;
    var lao = aTrung < 600 ? Math.sin(Math.PI * aTrung / 600) * 3.2 : 0, rung = aDanh < 400 ? Math.sin(aDanh / 20) * .15 : 0;
    q.position.x = QX + (1 - vao) * 7 + roi * 12 - lao + rung;
    q.visible = conQuai && !(ai.ha && aHa > 1000) && !(ai.tron && aTron > 1200) && !(s.xong && !s.thang);
    q.traverse(function (o) { if (o.isMesh && o.material && o.material.transparent !== undefined) { if (mo < 1) { o.material.transparent = true; o.material.opacity = Math.max(0, mo); } } });
    var ud = q.userData;
    if (ud.loai === '👾') { var nhay = Math.abs(Math.sin(t * 3)); qb.position.y = nhay * .5; qb.scale.set(1 + (1 - nhay) * .15, 1 - (1 - nhay) * .2, 1 + (1 - nhay) * .15); }
    else if (ud.bay) qb.position.y = Math.sin(t * 2.2) * .25;
    else qb.position.y = Math.abs(Math.sin(t * 2)) * .05;
    ud.canh.forEach(function (c) { c.o.rotation.y = c.rong ? 0 : Math.sin(t * (c.rong ? 3 : 14)) * .7 * c.s; if (c.rong) c.o.rotation.x = c.s * (.5 + Math.sin(t * 2.5) * .35); });
    if (ud.vk) ud.vk.rotation.z = aTrung < 600 ? -Math.sin(Math.PI * aTrung / 600) * 1.6 : Math.sin(t * 1.5) * .1;
    if (ud.chan) ud.chan.forEach(function (c, i) { c.rotation.y = Math.sin(t * 8 + i) * .15; });
    if (ud.dau) { ud.dau.rotation.z = Math.sin(t * 1.3) * .08 + (aTrung < 700 ? .3 : 0); ud.ham.rotation.z = aTrung < 700 ? -.5 : Math.sin(t * 2) * .05 - .02; }
    if (ud.lua) {   // Rồng phun lửa khi đánh trả
      var o0 = new T.Vector3(); if (ud.dau) ud.dau.getWorldPosition(o0);
      ud.lua.forEach(function (l, i) { if (aTrung < 900 && q.visible) { var p2 = ((aTrung / 900) + i / ud.lua.length) % 1; l.position.set(o0.x - .6 - p2 * 6, o0.y - .4 - p2 * 2.2, o0.z + Math.sin(i * 2.3) * p2 * .8); l.scale.setScalar(.6 + p2 * 2.2); l.material.opacity = (1 - p2) * .9; } else l.material.opacity = 0; });
    }
    // ----- hiệp sĩ
    S.hs.forEach(function (k) {
      var o = k.obj, b = o.userData.body, chem = aDanh < 650 && (!fx.doi || fx.doi.indexOf(k.j) >= 0) && fx.sat;
      var tien = chem ? Math.sin(Math.PI * Math.min(1, aDanh / 650)) * (QX - 1.9 - k.x0) : 0;
      o.position.x = k.x0 + tien; o.position.z = k.z0 + (chem ? (-.4 - k.z0) * Math.sin(Math.PI * Math.min(1, aDanh / 650)) : 0);
      o.userData.kiem.rotation.x = chem ? .5 - Math.sin(Math.PI * Math.min(1, aDanh / 650)) * 2.4 : .5 + Math.sin(t * 2 + k.j) * .08;
      var nga = aGuc < 1800 ? Math.sin(Math.min(1, aGuc / 400) * Math.PI / 2) * (1 - Math.max(0, (aGuc - 1100) / 700)) : 0, lui = aTrung < 600 ? Math.sin(Math.PI * aTrung / 600) * .35 : 0;
      b.rotation.z = nga * 1.4 + lui; b.position.y = (s.xong && s.thang ? Math.abs(Math.sin(t * 6 + k.j)) * .5 : Math.sin(t * 2 + k.j) * .03);
    });
    // ----- máu
    var mk = iA + ':' + ai.mau.con + ':' + ai.mau.max;
    if (mk !== S.mauQKey) { S.mauQKey = mk; G3D.setSprite(S.mauQ, mauQTex(ai)); }
    S.mauQ.visible = q.visible && !ai.ha && !ai.tron; S.mauQ.position.set(q.position.x, (ud.cao || 3) * q.scale.y + .8, -.4);
    var tk = s.hp + '/' + s.hpMax; if (tk !== S.timKey) { S.timKey = tk; G3D.setSprite(S.tim, timTex(s.hp, s.hpMax)); }
    S.tim.position.set(-4, 4.4, s.doi.length === 1 ? .6 : 0);
    // ----- hiệu ứng
    S.chem.material.opacity = aDanh < 380 ? 1 - aDanh / 380 : 0; S.chem.position.set(QX - .6, 2.2, .6); S.chem.rotation.set(0, 0, -.8 + aDanh / 380 * 1.4);
    S.chop.intensity = aDanh < 300 ? (aChi < 300 ? 9 : 5) * (1 - aDanh / 300) : 0;
    S.do.intensity = aTrung < 600 ? 6 * (1 - aTrung / 600) : 0;
    S.hat.forEach(function (h) { if (!h.visible) return; var d = (now - h.userData.t0) / 1000; if (d > 1.6) { h.visible = false; return; } h.position.x += h.userData.v.x * dt; h.position.y += h.userData.v.y * dt; h.position.z += h.userData.v.z * dt; h.userData.v.y -= 9 * dt; h.rotation.x += dt * 8; h.material.opacity = 1 - d / 1.6; });
    S.so = S.so.filter(function (x) { var d = (now - x.t0) / 1000; if (d > 1.3) { S.scene.remove(x.sp); x.sp.material.map.dispose(); return false; } x.sp.position.y += dt * 1.2; x.sp.material.opacity = 1 - Math.max(0, d - .7) / .6; return true; });
    S.duoc.forEach(function (d, i) { var f = 1 + Math.sin(t * 17 + i * 3) * .12 + Math.sin(t * 7 + i) * .08; d.lua.scale.set(f, f * 1.1, f); d.den.intensity = 1.1 + f * .4; });
    (S.co || []).forEach(function (c, i) { c.rotation.y = Math.sin(t * 2 + i) * .25; });
    // ----- dòng thông báo
    var chu = s.xong ? (s.thang ? ['🏆 CHIẾN THẮNG! ĐÃ HẠ TRÙM', '#ca8a04'] : ['💨 TRÙM ĐÃ BỎ CHẠY', '#7c2d12'])
      : aGuc < 1800 ? ['😵 GỤC NGÃ – HỒI SINH!', '#991b1b'] : ai.ha && aHa < 1600 ? [ai.trum ? '🐉 HẠ GỤC TRÙM!' : '💥 HẠ GỤC ' + ai.ten.toUpperCase() + '!', '#16a34a']
      : ai.tron && aTron < 1600 ? ['💨 ' + ai.ten.toUpperCase() + ' BỎ CHẠY!', '#c2410c'] : ['ẢI ' + (iA + 1) + '/' + s.ai.length + (ai.trum ? ' · 👑 TRÙM' : '') + ' · ' + ai.ten.toUpperCase(), ai.trum ? '#b91c1c' : '#7c3aed'];
    if (chu.join() !== S.infoKey) { S.infoKey = chu.join(); G3D.setSprite(S.info, G3D.banner(chu[0], chu[1])); }
    // ----- máy quay (lùi xa khi gặp trùm, rung khi chí mạng / bị đánh)
    var cam = S.camera, xa = ai.trum ? 1.6 : 0, r = (aChi < 350 ? .25 : 0) + (aTrung < 400 ? .18 : 0);
    cam.position.set(Math.sin(t * .2) * 1.2 + (Math.random() - .5) * r, 4.6 + xa * .5 + (Math.random() - .5) * r, 11.5 + xa);
    cam.lookAt(0, 2.4 + xa * .3, 0);
    S.renderer.render(S.scene, cam);
  }

  window.Rpg3D = {
    supported: function () { return window.G3D && G3D.supported(); },
    mount: function (el, snapshot) {
      return G3D.load().then(function () {
        T = G3D.T();
        if (S && S.el === el) { S.snapshot = snapshot; S.doiKey = ''; S.qI = -1; S.mauQKey = S.timKey = S.infoKey = ''; return S; }
        if (S) { cancelAnimationFrame(S.raf); try { S.ro.disconnect(); S.renderer.dispose(); } catch (e) {} }
        var o = G3D.scene(el, 0x1e1b4b, [30, 70]);
        S = Object.assign(o, { snapshot: snapshot, qI: -1 });
        o.scene.add(new T.HemisphereLight(0xc4b5fd, 0x1c1917, .6));
        var trang = new T.DirectionalLight(0xdbeafe, .8); trang.position.set(-6, 14, 9); trang.castShadow = true; trang.shadow.mapSize.set(1024, 1024);
        var c = trang.shadow.camera; c.left = -12; c.right = 12; c.top = 10; c.bottom = -10; o.scene.add(trang);
        build(); frame(); return S;
      });
    }
  };
})();
