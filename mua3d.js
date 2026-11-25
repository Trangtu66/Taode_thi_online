// VŨ ĐIỆU TRI THỨC – SÂN KHẤU 3D (cần game3d_chung.js, game_moi.js). Dùng cho tu_choi.html (HS tự chơi) và tro_choi_lop.html (GV trình chiếu, 1–4 đội).
// Mua3D.mount(el, snapshot) – snapshot() trả đúng trạng thái sân 2D của game_moi.js:
//   {n, k, doi:[{ten, mau, dong (số động tác), combo, comboMax}], fx:{loai:'nhay'|'vap', at, doi:[chỉ số đội], combo (thứ tự động tác), chuoi}, xong, t}
// 8 động tác (GameMoi.DIEU): vẫy tay, xoay tròn, bật nhảy, bước ngang, chỉ tay disco, sóng tay, lắc hông, tạo dáng.
// Hình học sinh (vũ công): áo cổ trắng, không khăn quàng (G3D.kid có khớp tay chân).
(function () {
  'use strict';
  var T, S = null, DAI = 1500;   // thời lượng một động tác (ms)
  var MAU = [0xf472b6, 0x38bdf8, 0xfacc15, 0xa78bfa, 0x34d399, 0xfb923c];

  function M(k, c, o) { return G3D.mat('mua_' + k, c, o); }

  function build() {
    var sc = S.scene;
    var nen = new T.Mesh(new T.PlaneGeometry(80, 60), new T.MeshStandardMaterial({ color: 0x0f0a1f, roughness: 1 })); nen.rotation.x = -Math.PI / 2; nen.receiveShadow = true; sc.add(nen);
    var bucSK = new T.Mesh(new T.CylinderGeometry(7.5, 7.8, .7, 64), new T.MeshStandardMaterial({ color: 0x1e1b4b, roughness: .3, metalness: .4 })); bucSK.position.y = .35; bucSK.receiveShadow = true; sc.add(bucSK);
    var vien = new T.Mesh(new T.TorusGeometry(7.55, .06, 8, 96), new T.MeshBasicMaterial({ color: 0xf0abfc })); vien.rotation.x = Math.PI / 2; vien.position.y = .71; sc.add(vien); S.vien = vien;
    // sàn nhảy ô đèn
    S.o = [];
    for (var x = 0; x < 9; x++) for (var z = 0; z < 5; z++) {
      var m = new T.MeshStandardMaterial({ color: 0x111827, emissive: MAU[(x + z) % MAU.length], emissiveIntensity: 0, roughness: .2, metalness: .3 });
      var o = new T.Mesh(new T.BoxGeometry(1.15, .06, 1.15), m); o.position.set(-4.8 + x * 1.2, .73, -2.6 + z * 1.2); o.receiveShadow = true; sc.add(o); S.o.push({ o: o, x: x, z: z });
    }
    // màn hình LED
    S.ledC = document.createElement('canvas'); S.ledC.width = 512; S.ledC.height = 224; S.ledT = new T.CanvasTexture(S.ledC); if (T.sRGBEncoding) S.ledT.encoding = T.sRGBEncoding;
    var led = new T.Mesh(new T.PlaneGeometry(13, 5.7), new T.MeshBasicMaterial({ map: S.ledT })); led.position.set(0, 4.1, -5.6); sc.add(led);
    var khung = new T.Mesh(new T.BoxGeometry(13.6, 6.2, .3), M('khungLed', 0x0f172a, { metalness: .6 })); khung.position.set(0, 4.1, -5.8); sc.add(khung);
    // giàn đèn, đèn rọi
    var gian = M('gian', 0x475569, { metalness: .7, roughness: .3 });
    [-7, 7].forEach(function (x) { var c = new T.Mesh(new T.BoxGeometry(.3, 8, .3), gian); c.position.set(x, 4, -4); sc.add(c); });
    var ngang = new T.Mesh(new T.BoxGeometry(14.4, .3, .3), gian); ngang.position.set(0, 8, -4); sc.add(ngang);
    S.den = [-5.5, -2, 2, 5.5].map(function (x, i) {
      var d = new T.SpotLight(MAU[i], 2.2, 22, .32, .5); d.position.set(x, 7.8, -3.8); sc.add(d); sc.add(d.target);
      var non = new T.Mesh(new T.ConeGeometry(1.4, 8, 24, 1, true), new T.MeshBasicMaterial({ color: MAU[i], transparent: true, opacity: .09, depthWrite: false, side: T.DoubleSide })); sc.add(non);
      return { d: d, non: non, x: x, i: i };
    });
    // quả cầu disco
    S.disco = new T.Mesh(new T.IcosahedronGeometry(.75, 2), new T.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 1, roughness: .15, flatShading: true }));
    S.disco.position.set(0, 7, -.5); sc.add(S.disco);
    var day = new T.Mesh(new T.CylinderGeometry(.02, .02, 1, 6), gian); day.position.set(0, 7.9, -.5); sc.add(day);
    S.lap = new T.PointLight(0xffffff, .8, 14); S.lap.position.set(0, 6.4, -.5); sc.add(S.lap);
    // khán giả cầm gậy phát sáng
    S.kg = [];
    for (var i = 0; i < 46; i++) {
      var r = Math.floor(i / 23), c = i % 23, g = new T.Group(); g.position.set(-11 + c + (r % 2) * .5, 0, 9.2 + r * 1.2); sc.add(g);
      var than = new T.Mesh(new T.CapsuleGeometry(.28, .7, 4, 10), M('kg', 0x1e293b)); than.position.y = .75; g.add(than);
      var dau = new T.Mesh(new T.SphereGeometry(.24, 12, 10), M('kgDau', 0x0f172a)); dau.position.y = 1.5; g.add(dau);
      var gay = new T.Mesh(new T.CylinderGeometry(.04, .04, .55, 6), new T.MeshBasicMaterial({ color: MAU[i % MAU.length] })); gay.position.set(.3, 1.6, 0); g.add(gay);
      S.kg.push({ g: g, gay: gay, i: i });
    }
    S.phao = []; for (var p = 0; p < 60; p++) { var b = new T.Mesh(new T.BoxGeometry(.13, .13, .02), new T.MeshBasicMaterial({ color: MAU[p % MAU.length], side: T.DoubleSide })); b.visible = false; sc.add(b); S.phao.push(b); }
    S.info = G3D.sprite(G3D.banner('💃 VŨ ĐIỆU TRI THỨC', '#7c3aed'), 5.8, .9); S.info.material.depthTest = false; S.info.renderOrder = 10; sc.add(S.info); S.infoKey = '';
  }
  function veLed(t, chu, nong) {
    var g = S.ledC.getContext('2d'), w = 512, h = 224;
    var gr = g.createLinearGradient(0, 0, w, h); gr.addColorStop(0, '#3b0764'); gr.addColorStop(1, '#0c4a6e'); g.fillStyle = gr; g.fillRect(0, 0, w, h);
    for (var i = 0; i < 24; i++) { var cao = (Math.abs(Math.sin(t * (3 + i % 5) + i)) * .7 + .15) * h * (nong ? 1 : .55); g.fillStyle = 'hsl(' + ((i * 15 + t * 60) % 360) + ',90%,60%)'; g.fillRect(8 + i * 21, h - cao, 15, cao); }
    g.fillStyle = 'rgba(0,0,0,.35)'; g.fillRect(0, 70, w, 84);
    g.fillStyle = '#fff'; g.font = '900 46px Arial'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(chu, w / 2, 113);
    S.ledT.needsUpdate = true;
  }
  function dungDoi(doi) {
    var key = doi.map(function (d) { return d.ten + d.mau; }).join(';'); if (key === S.doiKey) return; S.doiKey = key;
    (S.vc || []).forEach(function (v) { S.scene.remove(v.obj); });
    var nd = doi.length;
    S.vc = doi.map(function (d, j) {
      var kid = G3D.kid(new T.Color(d.mau).getHex(), j % 2 === 1, 'stand', true); kid.scale.setScalar(nd > 2 ? 1.05 : 1.25);
      var x = (j - (nd - 1) / 2) * (nd > 2 ? 2.6 : 3.4); kid.position.set(x, .76, .4); S.scene.add(kid);
      var lab = G3D.sprite(G3D.label(d.ten, d.mau), 2.3, .52); lab.position.set(0, 2.55, 0); kid.add(lab);
      return { obj: kid, lab: lab, j: j, x: x, labKey: '' };
    });
  }
  // tư thế một động tác (p: 0..1)
  function dongTac(v, so, p, t) {
    var u = v.obj.userData, b = u.body, o = v.obj, s = Math.sin(p * Math.PI * 4), s2 = Math.sin(p * Math.PI * 2), mo = Math.sin(p * Math.PI);
    o.position.x = v.x; o.position.y = .76; o.rotation.y = 0; b.rotation.set(0, 0, 0); b.position.y = 0;
    u.tayT.rotation.set(0, 0, 0); u.tayP.rotation.set(0, 0, 0); u.chanT.rotation.set(0, 0, 0); u.chanP.rotation.set(0, 0, 0);
    switch (so % 8) {
      case 0: u.tayT.rotation.z = -2.6 * mo - .2 * s; u.tayP.rotation.z = 2.6 * mo + .2 * s; b.rotation.z = s * .08; break;                       // vẫy tay
      case 1: o.rotation.y = p * Math.PI * 2; u.tayT.rotation.z = -1.4 * mo; u.tayP.rotation.z = 1.4 * mo; break;                               // xoay tròn
      case 2: o.position.y = .76 + Math.abs(s2) * .9 * mo; u.tayT.rotation.x = u.tayP.rotation.x = -2.8 * mo; u.chanT.rotation.x = u.chanP.rotation.x = -.5 * Math.abs(s2); break;   // bật nhảy
      case 3: o.position.x = v.x + s2 * .8; u.tayT.rotation.x = -1.6 * Math.max(0, s); u.tayP.rotation.x = -1.6 * Math.max(0, -s); u.chanT.rotation.z = -.3 * Math.max(0, s2); u.chanP.rotation.z = .3 * Math.max(0, -s2); break;   // bước ngang
      case 4: u.tayP.rotation.z = 2.5 * mo; u.tayP.rotation.x = -.4 * mo; u.tayT.rotation.z = -.5 * mo; b.rotation.z = s * .12; break;              // chỉ tay disco
      case 5: u.tayT.rotation.z = -(1.5 + Math.sin(p * 20) * .3) * mo; u.tayP.rotation.z = (1.5 + Math.sin(p * 20 + 1.5) * .3) * mo; b.rotation.y = s * .2; break;   // sóng tay
      case 6: b.rotation.z = s * .18; u.tayT.rotation.x = u.tayP.rotation.x = -1 * mo; o.position.x = v.x + s * .15; break;                         // lắc hông
      default: u.tayT.rotation.z = -2.4 * mo; u.tayP.rotation.z = 2.4 * mo; b.rotation.z = -.15 * mo; u.chanP.rotation.z = .3 * mo;              // tạo dáng
    }
  }
  function nhunNhay(v, t) {   // nhún theo nhạc khi đứng chờ
    var u = v.obj.userData, b = u.body, s = Math.sin(t * 5.2 + v.j);
    v.obj.position.set(v.x, .76, .4); v.obj.rotation.y = 0; b.rotation.set(0, 0, s * .04); b.position.y = Math.abs(s) * .05;
    u.tayT.rotation.set(-.3 - Math.max(0, s) * .4, 0, -.15); u.tayP.rotation.set(-.3 - Math.max(0, -s) * .4, 0, .15); u.chanT.rotation.set(0, 0, 0); u.chanP.rotation.set(0, 0, 0);
  }

  function frame() {
    if (!S) return; S.raf = requestAnimationFrame(frame);
    if (!S.el.offsetParent) return;
    var now = performance.now(), t = now / 1000; var s = S.snapshot(); if (!s || !s.doi || !window.GameMoi) return;
    var tNow = s.t || Date.now(), fx = s.fx || {}, aN = fx.loai === 'nhay' ? tNow - fx.at : 1e9, aV = fx.loai === 'vap' ? tNow - fx.at : 1e9;
    dungDoi(s.doi);
    var chuoi = fx.chuoi || 0, nong = aN < DAI || s.xong, hoaMat = nong && (chuoi >= 3 || s.xong);
    S.vc.forEach(function (v) {
      var d = s.doi[v.j], minh = !fx.doi || fx.doi.indexOf(v.j) >= 0, u = v.obj.userData;
      if (s.xong) { nhunNhay(v, t); var cui = (Math.sin(t * 1.5 + v.j) + 1) / 2; u.body.rotation.x = cui * .6; u.tayT.rotation.z = -.2; u.tayP.rotation.z = .2; }
      else if (minh && aN < DAI) dongTac(v, fx.combo || 0, aN / DAI, t);
      else if (minh && aV < 1000) { nhunNhay(v, t); u.body.rotation.z = Math.sin(aV / 45) * .35 * (1 - aV / 1000); u.body.rotation.x = .2; u.tayT.rotation.z = -1.6 + Math.sin(aV / 40); u.tayP.rotation.z = 1.6 - Math.sin(aV / 40); }
      else nhunNhay(v, t);
      var lk = d.ten + (d.dong || 0) + '|' + (d.combo || 0); if (lk !== v.labKey) { v.labKey = lk; G3D.setSprite(v.lab, G3D.label(d.ten, d.mau, '💃 ' + (d.dong || 0) + ' động tác' + ((d.combo || 0) >= 2 ? ' · 🔥×' + d.combo : ''))); v.lab.scale.set(2.3, .72, 1); }
    });
    // sàn đèn, đèn rọi, disco, khán giả
    var nhip = Math.floor(t * (nong ? 4 : 2));
    S.o.forEach(function (q) { var on = (q.x + q.z + nhip) % 3 === 0; q.o.material.emissiveIntensity = aV < 600 ? (q.x + q.z) % 2 ? 0 : .9 : on ? (nong ? 1.1 : .55) : .05; if (aV < 600) q.o.material.emissive.setHex(0xef4444); else q.o.material.emissive.setHex(MAU[(q.x + q.z + Math.floor(t / 2)) % MAU.length]); });
    S.den.forEach(function (d) { var g = t * (nong ? 1.6 : .7) + d.i * 1.6; d.d.target.position.set(Math.sin(g) * 5, .8, Math.cos(g * .7) * 2.5); d.d.intensity = (hoaMat ? 3.4 : 2) * (aV < 600 ? .3 : 1); d.d.color.setHex(aV < 600 ? 0xef4444 : MAU[(d.i + Math.floor(t)) % MAU.length]);
      var dir = d.d.target.position.clone().sub(d.d.position), L = dir.length(); d.non.position.copy(d.d.position).add(dir.clone().multiplyScalar(.5)); d.non.scale.set(1, L / 8, 1); d.non.quaternion.setFromUnitVectors(new T.Vector3(0, -1, 0), dir.normalize()); d.non.material.color.copy(d.d.color); d.non.material.opacity = hoaMat ? .16 : .09; });
    S.disco.rotation.y = t * .8; S.lap.intensity = .6 + .5 * Math.abs(Math.sin(t * 6));
    S.vien.material.color.setHSL((t * .1) % 1, .9, .7);
    S.kg.forEach(function (k) { k.gay.rotation.z = Math.sin(t * (nong ? 6 : 2.5) + k.i * .4) * .7; k.g.position.y = nong ? Math.abs(Math.sin(t * 6 + k.i)) * .15 : 0; });
    S.phao.forEach(function (b, i) { if (!hoaMat) { b.visible = false; return; } b.visible = true; var q = ((t * .4) + i / S.phao.length) % 1; b.position.set(Math.sin(i * 2.3) * 7, 8 - q * 8, Math.cos(i * 1.7) * 3); b.rotation.set(t * 3 + i, t * 2, 0); });
    if (now - (S.ledLuc || 0) > 120) { S.ledLuc = now; veLed(t, s.xong ? 'HOAN HÔ!' : aN < DAI ? GameMoi.DIEU[(fx.combo || 0) % GameMoi.DIEU.length].toUpperCase() : aV < 1000 ? 'ÔI, VẤP RỒI!' : 'VŨ ĐIỆU TRI THỨC', nong); }
    var chu = s.xong ? ['🎉 MÀN TRÌNH DIỄN KẾT THÚC!', '#ca8a04'] : aN < DAI ? ['💃 ' + GameMoi.DIEU[(fx.combo || 0) % GameMoi.DIEU.length].toUpperCase() + (chuoi >= 2 ? ' – CHUỖI ×' + chuoi : ''), '#7c3aed'] : aV < 1000 ? ['😵 VẤP RỒI – MẤT CHUỖI!', '#b91c1c'] : ['💃 CÂU ' + Math.min(s.k + 1, s.n) + '/' + s.n, '#7c3aed'];
    if (chu.join() !== S.infoKey) { S.infoKey = chu.join(); G3D.setSprite(S.info, G3D.banner(chu[0], chu[1])); }
    var cam = S.camera, nd = s.doi.length;
    cam.position.set(Math.sin(t * .25) * 2.2, 3.6 + Math.sin(t * .4) * .3, 10.5 + nd * .6); cam.lookAt(0, 2, 0);
    var fw = new T.Vector3(); cam.getWorldDirection(fw); var up = new T.Vector3(0, 1, 0).applyQuaternion(cam.quaternion);
    S.info.position.copy(cam.position).add(fw.multiplyScalar(9)).add(up.multiplyScalar(Math.tan(cam.fov * Math.PI / 360) * 9 - .7));
    S.renderer.render(S.scene, cam);
  }

  window.Mua3D = {
    supported: function () { return window.G3D && G3D.supported(); },
    mount: function (el, snapshot) {
      return G3D.load().then(function () {
        T = G3D.T();
        if (S && S.el === el) { S.snapshot = snapshot; S.doiKey = S.infoKey = ''; return S; }
        if (S) { cancelAnimationFrame(S.raf); try { S.ro.disconnect(); S.renderer.dispose(); } catch (e) {} }
        var o = G3D.scene(el, 0x0b0618, [26, 60]);
        S = Object.assign(o, { snapshot: snapshot });
        o.scene.add(new T.HemisphereLight(0xc4b5fd, 0x0b0618, .45));
        var truoc = new T.DirectionalLight(0xffffff, .55); truoc.position.set(0, 9, 12); truoc.castShadow = true; truoc.shadow.mapSize.set(1024, 1024); o.scene.add(truoc);
        build(); frame(); return S;
      });
    }
  };
})();
