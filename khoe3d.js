// HỘI KHOẺ TRI THỨC – SÂN VẬN ĐỘNG 3D (cần game3d_chung.js, game_moi.js). Dùng cho tu_choi.html (HS tự chơi) và tro_choi_lop.html (GV trình chiếu, 1–4 đội).
// Khoe3D.mount(el, snapshot) – snapshot() trả đúng trạng thái sân 2D của game_moi.js:
//   {n, k, doi:[{ten, mau, hc:[3|2|1|0|undefined theo câu]}], fx:{loai:'dat'|'hong', at, cau, hc, doi:[chỉ số đội đúng]}, xong, t}
// 4 môn luân phiên theo câu (GameMoi.MON): chạy 100 m · nhảy xa · ném bóng rổ · nhảy cao. Mỗi đội một làn thi.
// Hình học sinh (vận động viên): áo cổ trắng, không khăn quàng (G3D.kid có khớp tay chân).
(function () {
  'use strict';
  var T, S = null, DAI = 2300;   // thời lượng một lượt thi (ms)
  var HCE = { 3: '🥇', 2: '🥈', 1: '🥉', 0: '🎖️' };

  function M(k, c, o) { return G3D.mat('khoe_' + k, c, o); }
  function hop(w, h, d, m, x, y, z) { var o = new T.Mesh(new T.BoxGeometry(w, h, d), m); o.position.set(x || 0, y || 0, z || 0); o.castShadow = o.receiveShadow = true; return o; }
  function tru(r, h, m, x, y, z) { var o = new T.Mesh(new T.CylinderGeometry(r, r, h, 10), m); o.position.set(x || 0, y || 0, z || 0); o.castShadow = true; return o; }
  function eo(x) { return 1 - Math.pow(1 - Math.max(0, Math.min(1, x)), 2); }
  function emoTex(ch) { return G3D.tex(128, 128, function (g, w, h) { g.font = '96px Arial'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(ch, w / 2, h / 2 + 6); }); }

  function build() {
    var sc = S.scene;
    var co = new T.Mesh(new T.PlaneGeometry(120, 90), new T.MeshStandardMaterial({ color: 0x15803d, roughness: 1 })); co.rotation.x = -Math.PI / 2; co.receiveShadow = true; sc.add(co);
    var vach = new T.Mesh(new T.PlaneGeometry(40, 18), new T.MeshStandardMaterial({ roughness: 1, map: G3D.tex(512, 256, function (g, w, h) { for (var i = 0; i < 16; i++) { g.fillStyle = i % 2 ? '#16a34a' : '#22c55e'; g.fillRect(i * w / 16, 0, w / 16, h); } }) }));
    vach.rotation.x = -Math.PI / 2; vach.position.y = .01; vach.receiveShadow = true; sc.add(vach);
    // đường chạy bầu dục
    var duong = new T.Mesh(new T.RingGeometry(10.5, 13.5, 96), new T.MeshStandardMaterial({ color: 0xc2410c, roughness: .9 })); duong.rotation.x = -Math.PI / 2; duong.scale.set(1.75, 1, 1); duong.position.y = .015; duong.receiveShadow = true; sc.add(duong);
    for (var l = 0; l < 5; l++) { var lv = new T.Mesh(new T.RingGeometry(10.5 + l * .75, 10.55 + l * .75, 96), new T.MeshBasicMaterial({ color: 0xfef3c7 })); lv.rotation.x = -Math.PI / 2; lv.scale.set(1.75, 1, 1); lv.position.y = .02; sc.add(lv); }
    // khán đài + cổ động viên
    var ghe = M('ghe', 0x64748b, { roughness: .8 });
    for (var b = 0; b < 5; b++) sc.add(hop(46, .7, 1.4, ghe, 0, .35 + b * .7, -16 - b * 1.4));
    S.khan = [];
    var mauAo = [0xef4444, 0x3b82f6, 0xfacc15, 0x22c55e, 0xf472b6, 0xffffff, 0xa855f7, 0xf97316];
    for (var i = 0; i < 160; i++) { var r = i % 5, c = Math.floor(i / 5); var nguoi = new T.Mesh(new T.CapsuleGeometry(.18, .3, 3, 8), M('cdv' + (i % 8), mauAo[i % 8])); nguoi.position.set(-21.5 + c * 1.38 + (r % 2) * .5, .95 + r * .7, -16 - r * 1.4); sc.add(nguoi); var dau = new T.Mesh(new T.SphereGeometry(.15, 10, 8), M('da', 0xf2c6a0)); dau.position.set(0, .38, 0); nguoi.add(dau); S.khan.push(nguoi); }
    // cờ hội thao
    S.co = [];
    for (var f = 0; f < 9; f++) { var x = -20 + f * 5; sc.add(tru(.06, 5, M('cotCo', 0xe5e7eb, { metalness: .6 }), x, 6.3, -23)); var cc = new T.Mesh(new T.PlaneGeometry(1.4, .9), new T.MeshStandardMaterial({ color: mauAo[f % 8], side: T.DoubleSide })); cc.position.set(x + .72, 8.3, -23); sc.add(cc); S.co.push(cc); }
    S.info = G3D.sprite(G3D.banner('🏅 HỘI KHOẺ TRI THỨC', '#15803d'), 5.8, .9); S.info.material.depthTest = false; S.info.renderOrder = 10; sc.add(S.info); S.infoKey = '';
    S.lan = new T.Group(); sc.add(S.lan);
    // bục nhận huy chương (hiện khi kết thúc)
    S.buc = new T.Group(); S.buc.visible = false; sc.add(S.buc);
    [[0, 1.2, 0xfacc15, '1'], [-1.6, .8, 0xcbd5e1, '2'], [1.6, .55, 0xd97706, '3']].forEach(function (p) {
      var k = hop(1.5, p[1], 1.3, M('buc' + p[3], p[2], { metalness: .3, roughness: .5 }), p[0], p[1] / 2, 0); S.buc.add(k);
      var so = G3D.sprite(G3D.tex(128, 128, function (g, w, h) { g.fillStyle = '#0f172a'; g.font = '900 96px Arial'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(p[3], w / 2, h / 2 + 4); }), .7, .7); so.position.set(p[0], p[1] / 2, .7); S.buc.add(so);
    });
    S.buc.position.set(0, 0, 1);
  }

  // mỗi đội một làn: dụng cụ của cả 4 môn (chỉ hiện dụng cụ của môn đang thi)
  function dungLan(doi) {
    var key = doi.map(function (d) { return d.ten + d.mau; }).join(';'); if (key === S.lanKey) return; S.lanKey = key;
    while (S.lan.children.length) S.lan.remove(S.lan.children[0]);
    (S.vdv || []).forEach(function (v) { S.scene.remove(v.obj); if (v.bong) S.scene.remove(v.bong); });
    var nd = doi.length;
    S.vdv = doi.map(function (d, j) {
      var z = (j - (nd - 1) / 2) * 1.9, g = { chay: new T.Group(), nhayxa: new T.Group(), bongro: new T.Group(), nhaycao: new T.Group() };
      Object.keys(g).forEach(function (k) { S.lan.add(g[k]); g[k].position.z = z; });
      // làn chạy: vạch xuất phát, vạch đích có dây
      g.chay.add(hop(13, .02, 1.5, M('lanDo', 0xc2410c, { roughness: .9 }), 0, .02, 0));
      g.chay.add(hop(.08, .03, 1.5, M('vachTrang', 0xffffff), -6, .04, 0)); g.chay.add(hop(.12, .03, 1.5, M('vachTrang', 0xffffff), 6, .04, 0));
      [-.75, .75].forEach(function (dz) { g.chay.add(tru(.04, 1.2, M('cotDich', 0xe5e7eb), 6, .6, dz)); });
      var day = hop(.03, .03, 1.5, M('dayDich', 0xf43f5e), 6, 1.1, 0); g.chay.add(day); g.day = day;
      // nhảy xa: đường chạy đà, ván giậm, hố cát
      g.nhayxa.add(hop(6.5, .02, 1.1, M('lanDo', 0xc2410c), -3.2, .02, 0)); g.nhayxa.add(hop(.25, .04, 1.1, M('van', 0xffffff), 0, .03, 0));
      g.nhayxa.add(hop(4.5, .08, 1.6, M('cat', 0xfde68a, { roughness: 1 }), 2.6, .04, 0));
      // bóng rổ: cột, bảng, vành
      g.bongro.add(tru(.08, 3.1, M('cotRo', 0x475569, { metalness: .5 }), 4.6, 1.55, 0));
      g.bongro.add(hop(.06, .9, 1.2, M('bangRo', 0xffffff), 4.45, 3.15, 0));
      var vanh = new T.Mesh(new T.TorusGeometry(.25, .025, 8, 24), M('vanh', 0xf97316, { metalness: .5 })); vanh.rotation.x = Math.PI / 2; vanh.position.set(4.15, 2.85, 0); g.bongro.add(vanh);
      var luoi = new T.Mesh(new T.CylinderGeometry(.25, .17, .35, 12, 1, true), new T.MeshStandardMaterial({ color: 0xffffff, wireframe: true })); luoi.position.set(4.15, 2.66, 0); g.bongro.add(luoi);
      // nhảy cao: 2 cột, xà, đệm
      [-.7, .7].forEach(function (dz) { g.nhaycao.add(tru(.04, 1.8, M('cotXa', 0xe5e7eb), 2.6, .9, dz)); });
      var xa = tru(.03, 1.45, M('xa', 0xfacc15), 2.6, 1.45, 0); xa.rotation.x = Math.PI / 2; g.nhaycao.add(xa); g.xa = xa;
      g.nhaycao.add(hop(2.2, .45, 1.8, M('dem', 0x2563eb, { roughness: .8 }), 3.9, .23, 0));
      // vận động viên + quả bóng
      var vdv = G3D.kid(new T.Color(d.mau).getHex(), j % 2 === 1, 'stand', true); vdv.scale.setScalar(.8); S.scene.add(vdv);
      var lab = G3D.sprite(G3D.label(d.ten, d.mau), 2.2, .5); lab.position.set(0, 2.9, 0); vdv.add(lab);
      var bong = new T.Mesh(new T.SphereGeometry(.12, 16, 12), M('bong', 0xea580c, { roughness: .6 })); bong.castShadow = true; S.scene.add(bong);
      var hc = G3D.sprite(emoTex('🥇'), .8, .8); hc.visible = false; S.scene.add(hc);
      return { obj: vdv, lab: lab, bong: bong, hc: hc, hcKey: '', g: g, z: z, j: j, labKey: '' };
    });
  }
  function dangChay(u, ph, manh) { manh = manh || 1; u.chanT.rotation.x = Math.sin(ph) * .9 * manh; u.chanP.rotation.x = -Math.sin(ph) * .9 * manh; u.tayT.rotation.x = -Math.sin(ph) * 1 * manh; u.tayP.rotation.x = Math.sin(ph) * 1 * manh; u.tayT.rotation.z = u.tayP.rotation.z = 0; }
  function dungYen(u, t, j) { u.chanT.rotation.x = u.chanP.rotation.x = 0; u.tayT.rotation.x = Math.sin(t * 2 + j) * .08; u.tayP.rotation.x = -Math.sin(t * 2 + j) * .08; u.tayT.rotation.z = u.tayP.rotation.z = 0; u.body.rotation.x = 0; u.body.position.y = 0; }

  // hoạt cảnh một lượt thi: p (0..1), ok – thành công/hỏng
  function luotThi(v, mon, p, ok, t) {
    var o = v.obj, u = o.userData, b = u.body, x = -6, y = 0, z = v.z, bong = null;
    b.rotation.x = 0; b.position.y = 0; o.rotation.y = Math.PI / 2;
    if (mon === 'chay') {
      var dich = ok ? 6.4 : 0, q = ok ? eo(p / .85) : Math.min(1, p / .45);
      x = -6 + (dich + 6) * q; dangChay(u, x * 3.2);
      if (!ok && p > .45) { b.rotation.x = Math.min(1.35, (p - .45) / .15 * 1.35); dungYen(u, t, 0); b.rotation.x = Math.min(1.35, (p - .45) / .15 * 1.35); }
      v.g.day.rotation.z = ok && p > .7 ? -.6 : 0;
    } else if (mon === 'nhayxa') {
      if (p < .45) { x = -5 + 5 * (p / .45); dangChay(u, x * 3.4); }
      else if (ok) { var q2 = Math.min(1, (p - .45) / .3); x = q2 * 3.4; y = Math.sin(q2 * Math.PI) * 1.1; u.chanT.rotation.x = u.chanP.rotation.x = -1.1 * Math.sin(q2 * Math.PI); u.tayT.rotation.x = u.tayP.rotation.x = -2.4; if (q2 >= 1) { b.rotation.x = .5; u.tayT.rotation.x = u.tayP.rotation.x = -2.9; } }
      else { var q3 = Math.min(1, (p - .45) / .2); x = q3 * .9; b.rotation.x = q3 * 1.3; dungYen(u, t, 0); b.rotation.x = q3 * 1.3; }
    } else if (mon === 'bongro') {
      x = 1.4; dungYen(u, t, 0);
      var tay = new T.Vector3(x + .2, 1.55, z), vanh = new T.Vector3(4.15, 2.9, z);
      if (p < .3) { u.tayP.rotation.x = u.tayT.rotation.x = -1.2 - p / .3 * 1.6; bong = tay.clone().add(new T.Vector3(0, p * .9, 0)); }
      else {
        u.tayP.rotation.x = u.tayT.rotation.x = -2.9;
        var q4 = Math.min(1, (p - .3) / .4), dau = tay.clone().add(new T.Vector3(0, .27, 0)), cuoi = ok ? vanh : vanh.clone().add(new T.Vector3(-.28, .05, 0));
        bong = dau.clone().lerp(cuoi, q4); bong.y += Math.sin(q4 * Math.PI) * 1.6;
        if (q4 >= 1) { var q5 = Math.min(1, (p - .7) / .3); bong = ok ? cuoi.clone().add(new T.Vector3(0, -q5 * 2.6, 0)) : cuoi.clone().add(new T.Vector3(-q5 * 2.5, Math.sin(q5 * Math.PI) * .8 - q5 * 2.6, q5 * .6)); bong.y = Math.max(.12, bong.y); }
      }
    } else {   // nhảy cao
      if (p < .4) { x = -3 + 5.1 * (p / .4); dangChay(u, x * 3.4); }
      else { var q6 = Math.min(1, (p - .4) / .3); x = 2.1 + q6 * 1.7; y = Math.sin(q6 * Math.PI) * (ok ? 1.55 : .9); b.rotation.x = -q6 * 1.2; u.chanT.rotation.x = u.chanP.rotation.x = .6; u.tayT.rotation.x = u.tayP.rotation.x = -2.6; if (q6 >= 1) y = .45; }
      var roi = !ok && p > .55 ? Math.min(1, (p - .55) / .2) : 0; v.g.xa.position.y = 1.45 - roi * 1.2; v.g.xa.rotation.z = roi * .6;
    }
    if (mon !== 'nhaycao') { v.g.xa.position.y = 1.45; v.g.xa.rotation.z = 0; }
    if (mon !== 'chay') v.g.day.rotation.z = 0;
    o.position.set(x, y, z);
    v.bong.visible = mon === 'bongro'; if (v.bong.visible) v.bong.position.copy(bong || new T.Vector3(x + .3, 1.2, z));
  }

  function frame() {
    if (!S) return; S.raf = requestAnimationFrame(frame);
    if (!S.el.offsetParent) return;
    var now = performance.now(), t = now / 1000, dt = Math.min(.05, (now - (S.last || now)) / 1000); S.last = now;
    var s = S.snapshot(); if (!s || !s.doi || !window.GameMoi) return;
    var tNow = s.t || Date.now(), fx = s.fx || {}, a = (fx.loai === 'dat' || fx.loai === 'hong') ? tNow - fx.at : 1e9, dien = a < DAI;
    dungLan(s.doi);
    var cau = dien && fx.cau !== undefined ? fx.cau : Math.min(s.k, s.n - 1), mon = GameMoi.MON[cau % 4];
    S.vdv.forEach(function (v) { Object.keys(v.g).forEach(function (k) { if (k !== 'day' && k !== 'xa') v.g[k].visible = !s.xong && k === mon.ma; }); });
    S.buc.visible = !!s.xong;
    var xep = s.doi.map(function (d, j) { return { j: j, diem: (d.hc || []).reduce(function (x, y) { return x + (y || 0); }, 0) }; }).sort(function (p, q) { return q.diem - p.diem; });
    S.vdv.forEach(function (v) {
      var d = s.doi[v.j], diem = (d.hc || []).reduce(function (x, y) { return x + (y || 0); }, 0), u = v.obj.userData;
      var lk = d.ten + diem; if (lk !== v.labKey) { v.labKey = lk; G3D.setSprite(v.lab, G3D.label(d.ten, d.mau, '🏅 ' + diem + ' điểm')); v.lab.scale.set(2.2, .7, 1); }
      if (s.xong) {   // bục nhận huy chương
        var hang = xep.findIndex(function (x) { return x.j === v.j; }), cho = [[0, 1.2], [-1.6, .8], [1.6, .55]][hang] || [3.2 + hang, 0];
        v.obj.position.set(cho[0], cho[1], 1); v.obj.rotation.y = 0; dungYen(u, t, v.j); u.tayT.rotation.x = u.tayP.rotation.x = hang < 3 ? -2.8 : 0;
        u.body.position.y = hang === 0 ? Math.abs(Math.sin(t * 5)) * .3 : 0; v.bong.visible = false;
        v.hc.visible = hang < 3; if (v.hc.visible) { var e = ['🥇', '🥈', '🥉'][hang]; if (v.hcKey !== e) { v.hcKey = e; G3D.setSprite(v.hc, emoTex(e)); } v.hc.position.set(cho[0], cho[1] + 1.1, 1.5); }
        return;
      }
      var minh = fx.loai === 'dat' && (!fx.doi || fx.doi.indexOf(v.j) >= 0);
      if (dien) luotThi(v, mon.ma, a / DAI, minh, t);
      else { luotThi(v, mon.ma, 0, true, t); dungYen(u, t, v.j); if (mon.ma === 'bongro') { u.tayP.rotation.x = u.tayT.rotation.x = -1.2; } }
      // huy chương bay lên khi thi thành công
      var hien = minh && a > DAI * .62 && a < DAI + 600;
      v.hc.visible = hien;
      if (hien) { var e2 = HCE[fx.hc !== undefined ? fx.hc : 3] || '🥇'; if (v.hcKey !== e2) { v.hcKey = e2; G3D.setSprite(v.hc, emoTex(e2)); } v.hc.position.set(v.obj.position.x, v.obj.position.y + 2.6 + (a - DAI * .62) / 1500, v.z); }
    });
    // cổ động viên reo hò khi có đội thành công
    var reo = fx.loai === 'dat' && a < DAI + 800 && a > DAI * .5;
    S.khan.forEach(function (k, i) { k.position.y = .95 + (i % 5) * .7 + (reo || s.xong ? Math.abs(Math.sin(t * 9 + i)) * .25 : Math.abs(Math.sin(t * 1.5 + i)) * .03); });
    S.co.forEach(function (c, i) { c.rotation.y = Math.sin(t * 2 + i) * .3; });
    var chu = s.xong ? ['🏆 LỄ TRAO HUY CHƯƠNG', '#ca8a04'] : dien ? (fx.loai === 'dat' ? [mon.ic + ' ' + mon.ten.toUpperCase() + ' – THÀNH CÔNG!', '#16a34a'] : ['💥 ' + mon.ten.toUpperCase() + ' – HỎNG RỒI!', '#b91c1c']) : [mon.ic + ' ' + mon.ten.toUpperCase() + ' · LƯỢT ' + Math.min(s.k + 1, s.n) + '/' + s.n, '#15803d'];
    if (chu.join() !== S.infoKey) { S.infoKey = chu.join(); G3D.setSprite(S.info, G3D.banner(chu[0], chu[1])); }
    var cam = S.camera, nd = s.doi.length, xa = 9 + nd * 1.4, cx = s.xong ? 0 : mon.ma === 'chay' ? 0 : mon.ma === 'bongro' ? 2.6 : 1;
    var cheo = !s.xong && (mon.ma === 'bongro' || mon.ma === 'nhaycao') ? 1 : 0;   /* môn đứng tại chỗ: nhìn chéo để thấy đủ các làn */
    cam.position.set(cx - cheo * 6.5 + Math.sin(t * .2) * .8, s.xong ? 3.2 : 4.4 + cheo * .6, xa - cheo * 2.5); cam.lookAt(cx, s.xong ? 1.6 : 1.3, 0);
    var fw = new T.Vector3(); cam.getWorldDirection(fw); var up = new T.Vector3(0, 1, 0).applyQuaternion(cam.quaternion);
    S.info.position.copy(cam.position).add(fw.multiplyScalar(9)).add(up.multiplyScalar(Math.tan(cam.fov * Math.PI / 360) * 9 - .7));
    S.renderer.render(S.scene, cam);
  }

  window.Khoe3D = {
    supported: function () { return window.G3D && G3D.supported(); },
    mount: function (el, snapshot) {
      return G3D.load().then(function () {
        T = G3D.T();
        if (S && S.el === el) { S.snapshot = snapshot; S.lanKey = S.infoKey = ''; return S; }
        if (S) { cancelAnimationFrame(S.raf); try { S.ro.disconnect(); S.renderer.dispose(); } catch (e) {} }
        var o = G3D.scene(el, 0x7dd3fc, [45, 110]);
        S = Object.assign(o, { snapshot: snapshot });
        o.scene.add(new T.HemisphereLight(0xe0f2fe, 0x166534, .8));
        var nang = new T.DirectionalLight(0xfff7ed, 1); nang.position.set(-8, 18, 10); nang.castShadow = true; nang.shadow.mapSize.set(2048, 2048);
        var c = nang.shadow.camera; c.left = -16; c.right = 16; c.top = 14; c.bottom = -14; o.scene.add(nang);
        build(); frame(); return S;
      });
    }
  };
})();
