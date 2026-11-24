// GỠ BOM – HẦM GỠ BOM 3D (cần game3d_chung.js). Dùng cho tu_choi.html (HS tự chơi) và tro_choi_lop.html (GV trình chiếu, 1–4 đội).
// Bom3D.mount(el, snapshot) – snapshot() trả đúng trạng thái sân 2D của game_moi.js:
//   {n, k, doi:[{ten, mau, kq:['go'|'no'…]}], con (giây còn của ngòi), tong, daNo, daGo, xong, fx:{loai:'go'|'no'|'sai', at}, t}
//   lop: true – trang trình chiếu cả lớp (không ghi "vẫn phải trả lời đúng")
// Hình học sinh: áo cổ trắng, không khăn quàng.
(function () {
  'use strict';
  var T, S = null;
  var VI_TRI = [[-3.3, .25, 1], [3.3, .25, 1], [-4.9, -1.2, .75], [4.9, -1.2, -.75]];   // x, z, hướng quay (đứng hai bên bàn, nhìn vào quả bom)

  function hex(c) { return new T.Color(c || '#2563EB'); }
  function build() {
    var sc = S.scene;
    // sàn bê tông + vạch cảnh báo
    var san = new T.Mesh(new T.PlaneGeometry(40, 30), new T.MeshStandardMaterial({ map: G3D.tex(512, 512, function (g, w, h) {
      g.fillStyle = '#334155'; g.fillRect(0, 0, w, h);
      for (var i = 0; i < 900; i++) { g.fillStyle = 'rgba(15,23,42,' + Math.random() * .25 + ')'; g.fillRect(Math.random() * w, Math.random() * h, 3, 3); }
      g.strokeStyle = 'rgba(148,163,184,.35)'; g.lineWidth = 3; for (var x = 0; x <= w; x += 128) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, h); g.stroke(); g.beginPath(); g.moveTo(0, x); g.lineTo(w, x); g.stroke(); }
    }), roughness: .9 }));
    san.material.map.wrapS = san.material.map.wrapT = T.RepeatWrapping; san.material.map.repeat.set(5, 4);
    san.rotation.x = -Math.PI / 2; san.receiveShadow = true; sc.add(san);
    var soc = G3D.tex(512, 64, function (g, w, h) { g.fillStyle = '#facc15'; g.fillRect(0, 0, w, h); g.fillStyle = '#111827'; for (var x = -h; x < w; x += 64) { g.beginPath(); g.moveTo(x, h); g.lineTo(x + 32, h); g.lineTo(x + 32 + h, 0); g.lineTo(x + h, 0); g.fill(); } });
    soc.wrapS = T.RepeatWrapping; soc.repeat.set(6, 1);
    var vach = new T.Mesh(new T.PlaneGeometry(30, .7), new T.MeshStandardMaterial({ map: soc })); vach.rotation.x = -Math.PI / 2; vach.position.set(0, .01, 4.2); sc.add(vach);
    // tường hầm phía sau + chân tường sọc vàng đen
    var tuong = new T.Mesh(new T.PlaneGeometry(40, 14), new T.MeshStandardMaterial({ map: G3D.tex(1024, 360, function (g, w, h) {
      g.fillStyle = '#1e293b'; g.fillRect(0, 0, w, h); g.strokeStyle = '#0f172a'; g.lineWidth = 6;
      for (var y = 0; y < h; y += 60) for (var x = (y / 60) % 2 ? -60 : 0; x < w; x += 120) g.strokeRect(x, y, 120, 60);
    }), roughness: .95 })); tuong.position.set(0, 7, -7); sc.add(tuong);
    var chan = new T.Mesh(new T.PlaneGeometry(40, 1), new T.MeshStandardMaterial({ map: soc.clone() })); chan.material.map.needsUpdate = true; chan.material.map.repeat.set(8, 1); chan.position.set(0, .5, -6.95); sc.add(chan);
    // bảng tiến độ gỡ bom trên tường
    S.bangC = document.createElement('canvas'); S.bangC.width = 1024; S.bangC.height = 420;
    S.bangT = new T.CanvasTexture(S.bangC); if (T.sRGBEncoding) S.bangT.encoding = T.sRGBEncoding;
    var bang = new T.Mesh(new T.PlaneGeometry(11, 4.5), new T.MeshBasicMaterial({ map: S.bangT })); bang.position.set(0, 7.1, -6.9); sc.add(bang);
    var khung = new T.Mesh(new T.BoxGeometry(11.4, 4.9, .15), G3D.mat('khungBang', 0x475569, { metalness: .6, roughness: .4 })); khung.position.set(0, 7.1, -7); sc.add(khung);
    // đèn báo động xoay
    S.coi = new T.Group(); S.coi.position.set(-7.5, 8.2, -6.6); sc.add(S.coi);
    var deCoi = new T.Mesh(new T.CylinderGeometry(.45, .55, .3, 20), G3D.mat('deCoi', 0x111827)); S.coi.add(deCoi);
    S.bongCoi = new T.Mesh(new T.SphereGeometry(.45, 20, 12, 0, Math.PI * 2, 0, Math.PI / 2), new T.MeshStandardMaterial({ color: 0x7f1d1d, emissive: 0xef4444, emissiveIntensity: 0, transparent: true, opacity: .9 })); S.bongCoi.position.y = .15; S.coi.add(S.bongCoi);
    S.denCoi = new T.SpotLight(0xff2222, 0, 30, .5, .6); S.denCoi.position.copy(S.coi.position); sc.add(S.denCoi); sc.add(S.denCoi.target);
    var coi2 = S.coi.clone(); coi2.position.x = 7.5; sc.add(coi2); S.coi2 = coi2;
    // bàn gỡ bom
    var go = G3D.mat('ban', 0x78350f, { roughness: .7 }), sat = G3D.mat('chanBan', 0x1f2937, { metalness: .5 });
    var mat = new T.Mesh(new T.BoxGeometry(4.6, .22, 2.8), go); mat.position.y = 1.05; mat.castShadow = mat.receiveShadow = true; sc.add(mat);
    [[-2.1, -1.2], [2.1, -1.2], [-2.1, 1.2], [2.1, 1.2]].forEach(function (p) { var c = new T.Mesh(new T.BoxGeometry(.18, 1, .18), sat); c.position.set(p[0], .5, p[1]); c.castShadow = true; sc.add(c); });
    var dung = new T.Mesh(new T.TorusGeometry(.75, .12, 10, 32), G3D.mat('deBom', 0x374151, { metalness: .7, roughness: .3 })); dung.rotation.x = Math.PI / 2; dung.position.y = 1.2; sc.add(dung);
    // kìm cắt dây trên bàn
    var kim = new T.Group(); kim.position.set(1.5, 1.2, .9); kim.rotation.y = .6; sc.add(kim);
    [-1, 1].forEach(function (s) { var l = new T.Mesh(new T.BoxGeometry(.9, .06, .1), G3D.mat('kimDo', 0xdc2626)); l.position.set(-.3, 0, s * .06); l.rotation.y = s * .12; kim.add(l); var m = new T.Mesh(new T.BoxGeometry(.35, .06, .07), G3D.mat('kimSat', 0x9ca3af, { metalness: .8, roughness: .3 })); m.position.set(.32, 0, s * .025); kim.add(m); });
    // QUẢ BOM
    S.bom = new T.Group(); S.bom.position.set(0, 2.15, 0); sc.add(S.bom);
    S.vo = new T.MeshStandardMaterial({ color: 0x111827, metalness: .55, roughness: .3 });
    var than = new T.Mesh(new T.SphereGeometry(.95, 40, 28), S.vo); than.castShadow = true; S.bom.add(than);
    var nap = new T.Mesh(new T.CylinderGeometry(.3, .34, .42, 20), G3D.mat('napBom', 0x64748b, { metalness: .8, roughness: .3 })); nap.position.set(.42, .86, 0); nap.rotation.z = -.45; S.bom.add(nap);
    var dai = new T.Mesh(new T.TorusGeometry(.96, .05, 8, 48), G3D.mat('daiBom', 0x475569, { metalness: .8 })); dai.rotation.y = Math.PI / 2; S.bom.add(dai);
    // ngòi nổ (đường cong cố định, phần còn lại dựng lại khi ngòi ngắn đi)
    S.cong = new T.CatmullRomCurve3([new T.Vector3(.55, 1.1, 0), new T.Vector3(.95, 1.55, .1), new T.Vector3(.75, 2.0, .15), new T.Vector3(.35, 2.15, .05), new T.Vector3(.05, 1.95, 0)]);
    S.ngoiM = new T.MeshStandardMaterial({ color: 0xa16207, roughness: .9 }); S.ngoi = null; S.ngoiU = -1;
    S.tia = new T.Group(); S.bom.add(S.tia);
    S.tiaLoi = new T.Mesh(new T.SphereGeometry(.09, 12, 8), new T.MeshBasicMaterial({ color: 0xfff7ed })); S.tia.add(S.tiaLoi);
    S.tiaHao = new T.Mesh(new T.SphereGeometry(.22, 14, 10), new T.MeshBasicMaterial({ color: 0xfacc15, transparent: true, opacity: .5, depthWrite: false })); S.tia.add(S.tiaHao);
    S.tiaDen = new T.PointLight(0xff9f1c, 1.4, 6); S.tia.add(S.tiaDen);
    S.vun = []; for (var i = 0; i < 10; i++) { var v = new T.Mesh(new T.BoxGeometry(.035, .035, .035), new T.MeshBasicMaterial({ color: i % 2 ? 0xfb923c : 0xfde047 })); S.tia.add(v); S.vun.push(v); }
    // màn hình đếm giờ trên bom
    S.ledC = document.createElement('canvas'); S.ledC.width = 256; S.ledC.height = 112;
    S.ledT = new T.CanvasTexture(S.ledC); if (T.sRGBEncoding) S.ledT.encoding = T.sRGBEncoding;
    var hop = new T.Mesh(new T.BoxGeometry(.98, .5, .14), G3D.mat('hopLed', 0x0b1220, { metalness: .4 })); hop.position.set(0, .12, .9); S.bom.add(hop);
    var led = new T.Mesh(new T.PlaneGeometry(.86, .38), new T.MeshBasicMaterial({ map: S.ledT })); led.position.set(0, .12, .975); S.bom.add(led); S.ledChu = '';
    // 3 dây điện: dây nguyên và hai nửa dây (hiện khi đã cắt)
    S.day = []; [0xef4444, 0x3b82f6, 0xfacc15].forEach(function (c, i) {
      var m = new T.MeshStandardMaterial({ color: c, roughness: .4 }), y = -.32 - i * .12;
      var cv = new T.QuadraticBezierCurve3(new T.Vector3(-.6, -.12, .78), new T.Vector3(0, y - .2, 1.25), new T.Vector3(.6, -.12, .78));
      var nguyen = new T.Mesh(new T.TubeGeometry(cv, 24, .035, 8), m); S.bom.add(nguyen);
      var p = cv.getPoints(24), trai = new T.Mesh(new T.TubeGeometry(new T.CatmullRomCurve3(p.slice(0, 11)), 12, .035, 8), m), phai = new T.Mesh(new T.TubeGeometry(new T.CatmullRomCurve3(p.slice(14)), 12, .035, 8), m);
      S.bom.add(trai); S.bom.add(phai); S.day.push({ nguyen: nguyen, trai: trai, phai: phai });
    });
    // vụ nổ: cầu lửa + khói + hố cháy
    S.lua = new T.Mesh(new T.SphereGeometry(1, 32, 20), new T.MeshBasicMaterial({ color: 0xf97316, transparent: true, opacity: 0, depthWrite: false })); S.lua.position.copy(S.bom.position); sc.add(S.lua);
    S.luaTrong = new T.Mesh(new T.SphereGeometry(1, 24, 16), new T.MeshBasicMaterial({ color: 0xfef08a, transparent: true, opacity: 0, depthWrite: false })); S.luaTrong.position.copy(S.bom.position); sc.add(S.luaTrong);
    S.chop = new T.PointLight(0xffa94d, 0, 30); S.chop.position.set(0, 3, 1); sc.add(S.chop);
    S.khoi = []; for (var j = 0; j < 9; j++) { var k = new T.Mesh(new T.SphereGeometry(.5, 12, 10), new T.MeshStandardMaterial({ color: 0x64748b, transparent: true, opacity: 0, depthWrite: false, roughness: 1 })); sc.add(k); S.khoi.push(k); }
    S.ho = new T.Mesh(new T.CircleGeometry(1.3, 32), new T.MeshBasicMaterial({ color: 0x020617, transparent: true, opacity: .85 })); S.ho.rotation.x = -Math.PI / 2; S.ho.position.y = 1.17; S.ho.visible = false; sc.add(S.ho);
    // dòng thông báo
    S.info = G3D.sprite(G3D.banner('SẴN SÀNG GỠ BOM', '#2563eb'), 6.6, 1.03); S.info.position.set(0, 4.15, 1.2); sc.add(S.info); S.infoKey = '';
    S.dk = {};
  }

  function veNgoi(u) {   // u: phần ngòi còn lại (0..1)
    var q = Math.round(u * 40) / 40; if (q === S.ngoiU) return; S.ngoiU = q;
    if (S.ngoi) { S.bom.remove(S.ngoi); S.ngoi.geometry.dispose(); S.ngoi = null; }
    if (q <= .02) return;
    var pts = []; for (var i = 0; i <= 20; i++) pts.push(S.cong.getPoint(q * i / 20));
    S.ngoi = new T.Mesh(new T.TubeGeometry(new T.CatmullRomCurve3(pts), 24, .045, 8), S.ngoiM); S.ngoi.castShadow = true; S.bom.add(S.ngoi);
  }
  function mmss(s) { s = Math.max(0, Math.ceil(s)); return Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0'); }
  function veLed(chu, mau) {
    var key = chu + mau; if (key === S.ledChu) return; S.ledChu = key;
    var g = S.ledC.getContext('2d'); g.fillStyle = '#020617'; g.fillRect(0, 0, 256, 112);
    g.fillStyle = mau; g.font = (chu.length > 5 ? '900 50px' : '900 74px') + ' Consolas, monospace'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.shadowColor = mau; g.shadowBlur = 16; g.fillText(chu, 128, 60);
    S.ledT.needsUpdate = true;
  }
  function veBang(s) {   // bảng tiến độ trên tường: mỗi đội một hàng, mỗi quả bom một ô
    var key = s.k + '|' + (s.xong ? 1 : 0) + '|' + s.doi.map(function (d) { return d.ten + ':' + (d.kq || []).join(','); }).join(';');
    if (key === S.bangKey) return; S.bangKey = key;
    var g = S.bangC.getContext('2d'), w = 1024, h = 420, n = s.n, nd = s.doi.length;
    var gr = g.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, '#0f172a'); gr.addColorStop(1, '#1e293b'); g.fillStyle = gr; g.fillRect(0, 0, w, h);
    g.fillStyle = '#fde68a'; g.font = '900 40px Arial'; g.textBaseline = 'middle'; g.fillText('💣 TIẾN ĐỘ GỠ BOM', 28, 40);
    var cot = n > 15 ? Math.ceil(n / 2) : n, dong = Math.ceil(n / cot), hang = (h - 80) / nd, d = Math.min(46, (w - 330) / cot - 6, (hang - 14) / dong - 6);
    s.doi.forEach(function (doi, j) {
      var y = 80 + j * hang, go = 0, no = 0; (doi.kq || []).forEach(function (x) { if (x === 'go') go++; else if (x === 'no') no++; });
      g.fillStyle = doi.mau; g.beginPath(); g.arc(40, y + hang / 2, 14, 0, 7); g.fill();
      g.fillStyle = '#f8fafc'; g.font = '800 30px Arial'; var t = doi.ten; while (g.measureText(t).width > 210 && t.length > 2) t = t.slice(0, -1); g.fillText(t, 64, y + hang / 2 - 14);
      g.font = '800 26px Arial'; g.fillStyle = '#4ade80'; g.fillText('✔ ' + go, 64, y + hang / 2 + 20); g.fillStyle = '#fb923c'; g.fillText('💥 ' + no, 150, y + hang / 2 + 20);
      for (var i = 0; i < n; i++) {
        var x = 300 + (i % cot) * (d + 6) + d / 2, yy = y + (hang - dong * (d + 6)) / 2 + Math.floor(i / cot) * (d + 6) + d / 2, kq = (doi.kq || [])[i];
        g.beginPath(); g.arc(x, yy, d / 2, 0, 7);
        if (kq === 'go'){ g.fillStyle = '#16a34a'; g.fill(); g.fillStyle = '#fff'; g.font = '900 ' + Math.round(d * .7) + 'px Arial'; g.textAlign = 'center'; g.fillText('✓', x, yy + 2); g.textAlign = 'left'; }
        else if (kq === 'no'){ g.fillStyle = '#ea580c'; g.fill(); g.font = Math.round(d * .7) + 'px Arial'; g.textAlign = 'center'; g.fillText('💥', x, yy + 2); g.textAlign = 'left'; }
        else { g.fillStyle = '#0b1220'; g.fill(); g.lineWidth = i === s.k && !s.xong ? 5 : 2; g.strokeStyle = i === s.k && !s.xong ? '#facc15' : '#475569'; g.stroke(); }
      }
    });
    S.bangT.needsUpdate = true;
  }
  function dongBoDoi(doi) {   // nhân vật học sinh mỗi đội đứng quanh bàn
    var key = doi.map(function (d) { return d.ten + d.mau; }).join('|');
    if (key === S.doiKey) return; S.doiKey = key;
    (S.hs || []).forEach(function (k) { S.scene.remove(k.obj); });
    S.hs = doi.slice(0, 4).map(function (d, j) {
      var o = G3D.kid(hex(d.mau).getHex(), j % 2 === 1, 'stand'), p = doi.length === 1 ? [-2.9, .9, 1] : VI_TRI[j];
      o.position.set(p[0], 0, p[1]); o.rotation.y = p[2] * (p[0] < 0 ? 1 : -1) * .9; o.scale.setScalar(1.25); S.scene.add(o);
      var lab = G3D.sprite(G3D.label(doi.length === 1 ? (d.ten || 'Em') : d.ten, d.mau), 1.9, .42); lab.position.set(0, 2.45, 0); o.add(lab);
      return { obj: o, j: j };
    });
  }

  function frame() {
    if (!S) return; S.raf = requestAnimationFrame(frame);
    if (!S.el.offsetParent) return;
    var now = performance.now(), t = now / 1000, s = S.snapshot(); if (!s) return;
    var tNow = s.t || Date.now(), fx = s.fx || {}, tuoi = function (l) { return fx.loai === l ? tNow - fx.at : 1e9; };
    var aGo = tuoi('go'), aNo = tuoi('no'), aSai = tuoi('sai');
    var go = aGo < 1100 || s.daGo || (s.xong && !s.daNo), tl = s.xong ? 0 : Math.max(0, Math.min(1, s.con / Math.max(1, s.tong))), nguy = !go && !s.daNo && !s.xong && tl < .25;
    dongBoDoi(s.doi); veBang(s);
    // quả bom: ẩn khi đã nổ (sau chớp lửa), xanh lên khi gỡ xong
    var hienBom = !s.xong && !(s.daNo && aNo > 250);
    S.bom.visible = hienBom; S.ho.visible = !!s.daNo && !s.xong;
    S.vo.color.setHex(go ? 0x15803d : 0x111827); S.vo.emissive = S.vo.emissive || new T.Color(); S.vo.emissive.setHex(nguy ? 0x7f1d1d : 0x000000); S.vo.emissiveIntensity = nguy ? .5 + .5 * Math.sin(t * 14) : 0;
    var lac = (nguy ? Math.sin(t * 40) * .025 : 0) + (aSai < 450 ? Math.sin(aSai / 30) * .06 : 0);
    S.bom.position.x = lac; S.bom.rotation.y = Math.sin(t * .6) * .25;
    veNgoi(go ? 1 : tl);
    S.tia.visible = !go && hienBom && tl > .02;
    if (S.tia.visible) {
      var e = S.cong.getPoint(tl); S.tia.position.copy(e); var nh = 1 + .35 * Math.sin(t * 30);
      S.tiaHao.scale.setScalar(nh); S.tiaDen.intensity = 1.2 + Math.random() * .8;
      S.vun.forEach(function (v, i) { var p = ((t * 2.2) + i / S.vun.length) % 1, g = i * 2.4 + t; v.position.set(Math.cos(g) * p * .5, p * .45 - p * p * .6, Math.sin(g) * p * .5); v.scale.setScalar(1 - p); });
    }
    veLed(go ? 'GỠ XONG' : s.daNo ? '--:--' : mmss(s.con), go ? '#4ade80' : tl < .25 ? '#f87171' : '#fb923c');
    S.day.forEach(function (d, i) {
      d.nguyen.visible = !go; d.trai.visible = d.phai.visible = go;
      var b = go ? Math.min(1, aGo / 400) : 0; d.trai.rotation.z = b * .25; d.phai.rotation.z = -b * .25;
    });
    // vụ nổ
    var no = s.daNo ? aNo : 1e9;
    if (no < 1400) { var p = no / 1400, r = .6 + Math.pow(Math.min(1, no / 500), .6) * 4.2; S.lua.scale.setScalar(r); S.lua.material.opacity = Math.max(0, .95 - p); S.luaTrong.scale.setScalar(r * .62); S.luaTrong.material.opacity = Math.max(0, 1 - p * 1.4); S.chop.intensity = 8 * (1 - p); }
    else { S.lua.material.opacity = 0; S.luaTrong.material.opacity = 0; S.chop.intensity = 0; }
    S.khoi.forEach(function (k, i) {
      if (!s.daNo || s.xong) { k.material.opacity = 0; return; }
      var p = ((t * .35) + i / S.khoi.length) % 1; k.position.set(Math.sin(i * 2.1) * (.4 + p) , 1.6 + p * 4.2, Math.cos(i * 1.7) * .5); k.scale.setScalar(.6 + p * 1.6); k.material.opacity = .5 * (1 - p) * Math.min(1, no / 400);
    });
    // còi báo động khi ngòi sắp cháy hết hoặc vừa nổ
    var hu = nguy || no < 2500;
    [S.coi, S.coi2].forEach(function (c) { c.rotation.y = t * 6; c.children[1].material.emissiveIntensity = hu ? .6 + .6 * Math.sin(t * 12) : 0; });
    S.denCoi.intensity = hu ? 3 : 0; S.denCoi.target.position.set(Math.sin(t * 6) * 8, 0, Math.cos(t * 6) * 4);
    // học sinh: nhảy mừng khi gỡ được, ngã ngửa khi bom nổ
    (S.hs || []).forEach(function (k) {
      var b = k.obj.userData.body, dg = s.doi[k.j] && (s.doi[k.j].kq || [])[s.k] === 'go';
      var vui = aGo < 1600 && (s.doi.length === 1 || dg) ? Math.abs(Math.sin(aGo / 120)) * .55 : 0;
      var nga = no < 1600 ? Math.sin(Math.min(1, no / 300) * Math.PI / 2) * (1 - Math.max(0, (no - 900) / 700)) : 0;
      b.position.y = vui + Math.sin(t * 2 + k.j) * .02; b.rotation.x = -nga * .7; b.rotation.z = nguy ? Math.sin(t * 20 + k.j) * .03 : 0;
    });
    // dòng thông báo
    var chu = s.xong ? ['🏁 HẾT BOM!', '#16a34a'] : s.daNo ? [s.lop ? '💥 BOM ĐÃ NỔ!' : '💥 BOM ĐÃ NỔ – VẪN PHẢI TRẢ LỜI ĐÚNG', '#b91c1c'] : go ? ['✔ ĐÃ GỠ BOM!', '#16a34a'] : nguy ? ['⚠ NGÒI SẮP CHÁY HẾT!', '#dc2626'] : ['💣 QUẢ BOM ' + Math.min(s.k + 1, s.n) + '/' + s.n, '#2563eb'];
    if (chu.join() !== S.infoKey) { S.infoKey = chu.join(); G3D.setSprite(S.info, G3D.banner(chu[0], chu[1])); }
    S.info.position.y = 4.15 + (go ? Math.abs(Math.sin(aGo / 150)) * .15 : 0);
    // máy quay: lượn nhẹ, tiến gần khi ngòi ngắn, rung khi nổ
    var cam = S.camera, gan = nguy ? .9 : 0, rung = no < 700 ? (1 - no / 700) * .35 : 0;
    cam.position.set(Math.sin(t * .18) * .9 + (Math.random() - .5) * rung, 5.4 - gan * .4 + (Math.random() - .5) * rung, 11.2 - gan * 1.6);
    cam.lookAt(0, 3.5 - gan * .3, 0);
    S.renderer.render(S.scene, cam);
  }

  window.Bom3D = {
    supported: function () { return window.G3D && G3D.supported(); },
    mount: function (el, snapshot) {
      return G3D.load().then(function () {
        T = G3D.T();
        if (S && S.el === el) { S.snapshot = snapshot; S.bangKey = S.doiKey = ''; return S; }
        if (S) { cancelAnimationFrame(S.raf); try { S.ro.disconnect(); S.renderer.dispose(); } catch (e) {} }
        var o = G3D.scene(el, 0x0b1220, [26, 60]);
        S = Object.assign(o, { snapshot: snapshot });
        o.scene.add(new T.HemisphereLight(0xcbd5e1, 0x0f172a, .55));
        var den = new T.SpotLight(0xffffff, 1.6, 40, .6, .5); den.position.set(0, 12, 5); den.target.position.set(0, 1.5, 0); den.castShadow = true; den.shadow.mapSize.set(1024, 1024); o.scene.add(den); o.scene.add(den.target);
        var phu = new T.DirectionalLight(0x93c5fd, .35); phu.position.set(-8, 6, 8); o.scene.add(phu);
        build(); frame(); return S;
      });
    }
  };
})();
