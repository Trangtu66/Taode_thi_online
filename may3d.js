// BẬC THANG LÊN MÂY – CẦU THANG MÂY 3D (cần game3d_chung.js). Dùng cho tu_choi.html (HS tự chơi) và tro_choi_lop.html (GV trình chiếu, 1–4 đội).
// May3D.mount(el, snapshot) – snapshot() trả đúng trạng thái sân 2D của game_moi.js:
//   {n, k, doi:[{ten, mau, bac (số bậc đã leo), sao:[true|false theo bậc]}], fx:{loai:'len'|'truot', at, doi:[chỉ số đội]}, xong, t}
// Hình học sinh: áo cổ trắng, không khăn quàng (G3D.kid có khớp tay chân).
(function () {
  'use strict';
  var T, S = null, CAO = .62, SAU = .95;   // mỗi bậc cao .62, lùi vào trong .95

  function M(k, c, o) { return G3D.mat('may_' + k, c, o); }
  function viTri(j, nd, i) {   // tâm bậc thứ i (i = 0 là mặt đất) của đội j
    var x0 = (j - (nd - 1) / 2) * 3.4;
    return new T.Vector3(x0 + Math.sin(i * .55) * .9, i * CAO, -i * SAU);
  }
  function ngoiSao() {
    var sh = new T.Shape(); for (var i = 0; i < 10; i++) { var r = i % 2 ? .1 : .24, g = i / 10 * Math.PI * 2 + Math.PI / 2; if (i) sh.lineTo(Math.cos(g) * r, Math.sin(g) * r); else sh.moveTo(Math.cos(g) * r, Math.sin(g) * r); }
    var geo = new T.ExtrudeGeometry(sh, { depth: .07, bevelEnabled: true, bevelSize: .02, bevelThickness: .02, bevelSegments: 2 }); geo.center();
    var o = new T.Mesh(geo, M('sao', 0xfacc15, { metalness: .6, roughness: .25, emissive: 0xa16207, emissiveIntensity: .5 })); o.castShadow = true; return o;
  }
  function damMay(r, m) {   // đám mây: các quả cầu dẹt
    var g = new T.Group();
    [[0, 0, 0, 1], [-.55, -.05, .1, .75], [.55, -.04, -.05, .78], [.15, .12, -.25, .7], [-.2, .08, .3, .6]].forEach(function (p) {
      var c = new T.Mesh(new T.SphereGeometry(r * p[3], 18, 12), m); c.position.set(p[0] * r, p[1] * r, p[2] * r); c.scale.y = .55; c.castShadow = true; c.receiveShadow = true; g.add(c);
    });
    return g;
  }

  function build() {
    var sc = S.scene;
    var troi = new T.Mesh(new T.SphereGeometry(160, 32, 16), new T.MeshBasicMaterial({ side: T.BackSide, map: G3D.tex(16, 512, function (g, w, h) {
      var gr = g.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, '#1e1b4b'); gr.addColorStop(.35, '#3b82f6'); gr.addColorStop(.6, '#7dd3fc'); gr.addColorStop(1, '#e0f2fe'); g.fillStyle = gr; g.fillRect(0, 0, w, h);
    }) })); sc.add(troi); S.troi = troi;
    S.mayTrang = M('trang', 0xffffff, { roughness: .95 }); S.mayVang = M('vang', 0xfef3c7, { roughness: .9, emissive: 0xfde68a, emissiveIntensity: .25 });
    S.mayGiong = M('giong', 0x334155, { roughness: 1 });
    S.trangTri = []; for (var i = 0; i < 16; i++) { var d = damMay(1.4 + (i % 4) * .5, S.mayTrang); d.position.set(-28 + (i * 37) % 56, -4 + (i * 13) % 26, -10 - (i * 7) % 30); sc.add(d); S.trangTri.push(d); }
    S.mt = new T.Mesh(new T.SphereGeometry(2.2, 28, 18), new T.MeshBasicMaterial({ color: 0xfde047 })); sc.add(S.mt);
    S.hao = new T.Mesh(new T.SphereGeometry(3.4, 28, 18), new T.MeshBasicMaterial({ color: 0xfde68a, transparent: true, opacity: .25 })); sc.add(S.hao);
    S.cauVong = new T.Group(); sc.add(S.cauVong);
    [0xef4444, 0xf97316, 0xfacc15, 0x22c55e, 0x3b82f6, 0x8b5cf6].forEach(function (c, i) { var v = new T.Mesh(new T.TorusGeometry(5.2 - i * .22, .11, 8, 60, Math.PI), new T.MeshBasicMaterial({ color: c, transparent: true, opacity: .85 })); S.cauVong.add(v); });
    S.cauThang = new T.Group(); sc.add(S.cauThang);
    S.info = G3D.sprite(G3D.banner('☁️ BẬC THANG LÊN MÂY', '#2563eb'), 5.6, .87); S.info.material.depthTest = false; S.info.renderOrder = 10; sc.add(S.info); S.infoKey = '';
    // mây giông + tia sét (dùng chung, đặt trên đầu người vừa trả lời sai)
    S.giong = damMay(.9, S.mayGiong); S.giong.visible = false; sc.add(S.giong);
    var pts = [[0, 0], [.15, -.35], [-.05, -.4], [.12, -.8]].map(function (p) { return new T.Vector3(p[0], p[1], 0); });
    S.set = new T.Mesh(new T.TubeGeometry(new T.CatmullRomCurve3(pts, false, 'catmullrom', 0), 12, .04, 6), new T.MeshBasicMaterial({ color: 0xfde047 })); S.set.position.y = -.4; S.giong.add(S.set);
    S.setDen = new T.PointLight(0xfde68a, 0, 8); S.giong.add(S.setDen);
    S.phao = []; for (var p = 0; p < 40; p++) { var b = new T.Mesh(new T.BoxGeometry(.12, .12, .02), new T.MeshBasicMaterial({ color: [0xf87171, 0xfbbf24, 0x60a5fa, 0xf472b6, 0x4ade80][p % 5], side: T.DoubleSide })); b.visible = false; sc.add(b); S.phao.push(b); }
  }

  function dungCauThang(n, doi) {
    var key = n + '|' + doi.map(function (d) { return d.ten + d.mau; }).join(';'); if (key === S.key) return; S.key = key;
    while (S.cauThang.children.length) S.cauThang.remove(S.cauThang.children[0]);
    (S.hs || []).forEach(function (h) { S.scene.remove(h.obj); });
    var nd = doi.length;
    S.bac = doi.map(function (d, j) {
      var ds = [];
      for (var i = 1; i <= n; i++) {
        var p = viTri(j, nd, i), m = damMay(i === n ? .95 : .62, S.mayTrang); m.position.copy(p); m.position.y -= .08; S.cauThang.add(m);
        var sao = ngoiSao(); sao.position.set(p.x, p.y + .55, p.z); sao.visible = false; S.cauThang.add(sao);
        ds.push({ may: m, sao: sao, da: false });
      }
      var dinh = viTri(j, nd, n);   // cờ trên đỉnh mây
      var cot = new T.Mesh(new T.CylinderGeometry(.03, .03, 1.3, 8), M('cot', 0xe5e7eb, { metalness: .6 })); cot.position.set(dinh.x + .55, dinh.y + .6, dinh.z); S.cauThang.add(cot);
      var co = new T.Mesh(new T.PlaneGeometry(.6, .38), new T.MeshStandardMaterial({ color: new T.Color(d.mau), side: T.DoubleSide })); co.position.set(dinh.x + .86, dinh.y + 1.08, dinh.z); S.cauThang.add(co); ds.co = co;
      var de = damMay(.9, S.mayTrang); de.position.copy(viTri(j, nd, 0)); de.position.y = -.25; S.cauThang.add(de);
      return ds;
    });
    var dinh = viTri(0, 1, n);
    S.cauVong.position.set(0, dinh.y + 1.2, dinh.z - 3.5);
    S.mt.position.set(4.5, dinh.y + 5, dinh.z - 9); S.hao.position.copy(S.mt.position);
    S.hs = doi.map(function (d, j) {
      var kid = G3D.kid(new T.Color(d.mau).getHex(), j % 2 === 1, 'stand', true); kid.scale.setScalar(.62); S.scene.add(kid);
      var lab = G3D.sprite(G3D.label(d.ten, d.mau), 2.4, .56); lab.position.set(0, 3.1, 0); kid.add(lab);
      return { obj: kid, lab: lab, j: j, cur: 0, labKey: '' };
    });
  }

  function frame() {
    if (!S) return; S.raf = requestAnimationFrame(frame);
    if (!S.el.offsetParent) return;
    var now = performance.now(), t = now / 1000, dt = Math.min(.05, (now - (S.last || now)) / 1000); S.last = now;
    var s = S.snapshot(); if (!s || !s.doi) return;
    var tNow = s.t || Date.now(), fx = s.fx || {}, aT = fx.loai === 'truot' ? tNow - fx.at : 1e9;
    dungCauThang(s.n, s.doi);
    var nd = s.doi.length, cao = 0, tam = new T.Vector3(), dem = 0;
    s.doi.forEach(function (d, j) {
      var b = Math.min(s.n, d.bac || 0), ds = S.bac[j], h = S.hs[j];
      ds.forEach(function (st, i) {
        var da = i < b; if (da !== st.da) { st.da = da; st.may.children.forEach(function (c) { c.material = da ? S.mayVang : S.mayTrang; }); }
        st.sao.visible = da && !!(d.sao || [])[i]; if (st.sao.visible) { st.sao.rotation.y = t * 2 + i; st.sao.position.y = viTri(j, nd, i + 1).y + .55 + Math.sin(t * 2 + i) * .06; }
        var rung = !da && i === b && aT < 800 && (!fx.doi || fx.doi.indexOf(j) >= 0); st.may.position.x = viTri(j, nd, i + 1).x + (rung ? Math.sin(aT / 35) * .08 : 0);
      });
      if (ds.co) ds.co.rotation.y = Math.sin(t * 2 + j) * .3;
      // nhân vật: nhảy dần lên bậc b (mỗi bậc một cú bật)
      var tr = h.cur < b ? 1 : h.cur > b ? -1 : 0; if (tr) { h.cur += tr * dt * 1.7; if ((tr > 0 && h.cur > b) || (tr < 0 && h.cur < b)) h.cur = b; }
      var i0 = Math.floor(h.cur), fr = h.cur - i0, p0 = viTri(j, nd, i0), p1 = viTri(j, nd, Math.min(s.n, i0 + 1)), p = p0.clone().lerp(p1, fr);
      var bat = fr > 0 ? Math.sin(fr * Math.PI) * .55 : 0;
      h.obj.position.set(p.x, p.y + .12 + bat, p.z);
      var huong = p1.clone().sub(p0); h.obj.rotation.y = fr > 0 ? Math.atan2(huong.x, huong.z) : Math.PI * .1 + Math.sin(t * .8 + j) * .1;
      if (fr > 0) h.obj.rotation.y = Math.atan2(huong.x, huong.z);
      var u = h.obj.userData, leo = fr > 0, vui = s.xong && b >= s.n;
      if (u.tayT) {
        u.tayT.rotation.x = leo ? -2.4 : vui ? -2.8 + Math.sin(t * 8) * .3 : Math.sin(t * 2 + j) * .08; u.tayP.rotation.x = leo ? -2.4 : vui ? -2.8 - Math.sin(t * 8) * .3 : -Math.sin(t * 2 + j) * .08;
        u.tayT.rotation.z = vui ? -.4 : 0; u.tayP.rotation.z = vui ? .4 : 0;
        u.chanT.rotation.x = leo ? -.6 : 0; u.chanP.rotation.x = leo ? .3 : 0;
      }
      var lacT = aT < 900 && (!fx.doi || fx.doi.indexOf(j) >= 0) ? Math.sin(aT / 45) * .25 * (1 - aT / 900) : 0;
      u.body.rotation.z = lacT; u.body.position.y = vui ? Math.abs(Math.sin(t * 6 + j)) * .5 : 0;
      var lk = d.ten + b; if (lk !== h.labKey) { h.labKey = lk; G3D.setSprite(h.lab, G3D.label(d.ten, d.mau, '☁️ ' + b + '/' + s.n + ' bậc')); h.lab.scale.set(2.4, .76, 1); }
      if (p.y > cao) cao = p.y; tam.add(p); dem++;
    });
    tam.multiplyScalar(1 / Math.max(1, dem));
    // mây giông trên đầu người vừa sai
    var jS = fx.doi ? fx.doi[0] : 0, hS = S.hs[jS || 0];
    if (aT < 1100 && hS) { S.giong.visible = true; S.giong.position.set(hS.obj.position.x, hS.obj.position.y + 2.6, hS.obj.position.z); var nhay = Math.floor(aT / 90) % 3 === 0; S.set.visible = nhay; S.setDen.intensity = nhay ? 4 : 0; }
    else { S.giong.visible = false; S.setDen.intensity = 0; }
    // pháo giấy khi lên tới đỉnh
    var ngoi = s.xong; S.phao.forEach(function (b, i) { if (!ngoi) { b.visible = false; return; } b.visible = true; var q = ((t * .35) + i / S.phao.length) % 1; b.position.set(tam.x + Math.sin(i * 2.7) * 4, cao + 4 - q * 6, tam.z + Math.cos(i * 1.9) * 2); b.rotation.set(t * 3 + i, t * 2, 0); });
    S.trangTri.forEach(function (m, i) { m.position.x += dt * (.25 + (i % 3) * .1); if (m.position.x > 32) m.position.x = -32; });
    S.cauVong.children.forEach(function (v, i) { v.material.opacity = .65 + .2 * Math.sin(t * 2 + i); });
    // máy quay bám theo (giữa các đội, độ cao người leo cao nhất)
    var cam = S.camera, xa = 7.5 + nd * 1.3, muc = new T.Vector3(tam.x, Math.max(cao * .7 + tam.y * .3, 0) + 1.2, tam.z);
    S.nhin = S.nhin ? S.nhin.lerp(muc, Math.min(1, dt * 2.5)) : muc.clone();
    cam.position.set(S.nhin.x + Math.sin(t * .2) * 1.2, S.nhin.y + 2.6, S.nhin.z + xa); cam.lookAt(S.nhin.x, S.nhin.y + .4, S.nhin.z - 1.5);
    S.troi.position.copy(cam.position);
    S.nang.position.set(S.nhin.x + 6, S.nhin.y + 14, S.nhin.z + 8); S.nang.target.position.copy(S.nhin);   // bóng đổ theo chỗ đang leo
    var chu = s.xong ? ['🏆 ĐÃ LÊN TỚI ĐỈNH MÂY!', '#ca8a04'] : aT < 1100 ? ['⛈️ MÂY GIÔNG – TRẢ LỜI LẠI!', '#475569'] : ['☁️ BẬC ' + Math.min(s.k + 1, s.n) + '/' + s.n, '#2563eb'];
    if (chu.join() !== S.infoKey) { S.infoKey = chu.join(); G3D.setSprite(S.info, G3D.banner(chu[0], chu[1])); }
    var fw = new T.Vector3(); cam.getWorldDirection(fw); var up = new T.Vector3(0, 1, 0).applyQuaternion(cam.quaternion);
    S.info.position.copy(cam.position).add(fw.multiplyScalar(9)).add(up.multiplyScalar(Math.tan(cam.fov * Math.PI / 360) * 9 - .7));
    S.renderer.render(S.scene, cam);
  }

  window.May3D = {
    supported: function () { return window.G3D && G3D.supported(); },
    mount: function (el, snapshot) {
      return G3D.load().then(function () {
        T = G3D.T();
        if (S && S.el === el) { S.snapshot = snapshot; S.key = S.infoKey = ''; S.nhin = null; return S; }
        if (S) { cancelAnimationFrame(S.raf); try { S.ro.disconnect(); S.renderer.dispose(); } catch (e) {} }
        var o = G3D.scene(el, 0x7dd3fc);
        S = Object.assign(o, { snapshot: snapshot });
        o.camera.far = 400; o.camera.updateProjectionMatrix();
        o.scene.add(new T.HemisphereLight(0xffffff, 0x93c5fd, .85));
        var nang = new T.DirectionalLight(0xfff7ed, .9); nang.position.set(6, 14, 8); nang.castShadow = true; nang.shadow.mapSize.set(1024, 1024);
        var c = nang.shadow.camera; c.left = -14; c.right = 14; c.top = 14; c.bottom = -14; o.scene.add(nang); o.scene.add(nang.target); S.nang = nang;
        build(); frame(); return S;
      });
    }
  };
})();
