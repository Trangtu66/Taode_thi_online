// ĐỒNG ĐỘI THOÁT HIỂM – TOÀ NHÀ NHIỀU PHÒNG 3D (cần game3d_chung.js, game_moi.js). Dùng cho tu_choi.html và tro_choi_lop.html.
// Thoat3D.mount(el, snapshot) – snapshot() trả đúng trạng thái sân 2D của game_moi.js:
//   {n, k, doi:[{ten, mau}], con (giây còn), tong, quaGio, xong, fx:{loai:'khoa'|'mo'|'bao', at, phong}, t}
// Mỗi phòng 3 ổ khoá (mỗi ổ một câu); mở hết thì cửa mở, cả đội đi qua sang phòng sau; qua phòng cuối là ra ngoài trời.
// Hình học sinh: áo cổ trắng, không khăn quàng.
(function () {
  'use strict';
  var T, S = null;
  var MAU_TUONG = [0x475569, 0x57534e, 0x3f3f46, 0x334155, 0x44403c, 0x52525b];
  var CUA_X = 1.2, CUA_W = 2.4, CUA_H = 3.6, TUONG_Z = -5;

  function hop(w, h, d, m, x, y, z) { var o = new T.Mesh(new T.BoxGeometry(w, h, d), m); o.position.set(x || 0, y || 0, z || 0); o.castShadow = o.receiveShadow = true; return o; }
  function mmss(s) { s = Math.max(0, Math.ceil(s)); return Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0'); }
  function chiaPhong(n) { return window.GameMoi ? GameMoi.chiaPhong(n) : [{ tu: 0, den: n }]; }

  // ---------------------------------------------------------------- căn phòng
  function build() {
    var sc = S.scene, P = S.phong = new T.Group(); sc.add(P);
    S.tuongM = new T.MeshStandardMaterial({ color: MAU_TUONG[0], roughness: .9, map: G3D.tex(256, 256, function (g, w, h) {
      g.fillStyle = '#9ca3af'; g.fillRect(0, 0, w, h); g.strokeStyle = '#6b7280'; g.lineWidth = 4;
      for (var y = 0; y < h; y += 32) for (var x = (y / 32) % 2 ? -32 : 0; x < w; x += 64) g.strokeRect(x, y, 64, 32);
    }) });
    S.tuongM.map.wrapS = S.tuongM.map.wrapT = T.RepeatWrapping; S.tuongM.map.repeat.set(3, 2);
    var san = new T.Mesh(new T.PlaneGeometry(16, 12), new T.MeshStandardMaterial({ roughness: .8, map: G3D.tex(256, 256, function (g, w, h) {
      for (var y = 0; y < 4; y++) for (var x = 0; x < 4; x++) { g.fillStyle = (x + y) % 2 ? '#1f2937' : '#273548'; g.fillRect(x * 64, y * 64, 64, 64); }
    }) }));
    san.material.map.wrapS = san.material.map.wrapT = T.RepeatWrapping; san.material.map.repeat.set(4, 3);
    san.rotation.x = -Math.PI / 2; san.position.z = 1; san.receiveShadow = true; P.add(san);
    // tường sau có ô cửa (3 khối quanh lỗ cửa), hai tường bên, trần
    var trai = CUA_X - CUA_W / 2 + 8, phai = 8 - (CUA_X + CUA_W / 2);
    P.add(hop(trai, 6, .4, S.tuongM, -8 + trai / 2, 3, TUONG_Z));
    P.add(hop(phai, 6, .4, S.tuongM, 8 - phai / 2, 3, TUONG_Z));
    P.add(hop(CUA_W, 6 - CUA_H, .4, S.tuongM, CUA_X, CUA_H + (6 - CUA_H) / 2, TUONG_Z));
    [-1, 1].forEach(function (s) { var t = hop(.4, 6, 12, S.tuongM, s * 8, 3, 1); P.add(t); });
    var tran = hop(16, .3, 12, new T.MeshStandardMaterial({ color: 0x1e293b }), 0, 6.1, 1); P.add(tran);
    // ánh sáng hành lang sau cửa
    var sang = new T.Mesh(new T.PlaneGeometry(CUA_W + .2, CUA_H + .2), new T.MeshBasicMaterial({ color: 0xfef9c3 })); sang.position.set(CUA_X, CUA_H / 2, TUONG_Z - .9); P.add(sang);
    S.denCua = new T.PointLight(0xfde68a, 0, 12); S.denCua.position.set(CUA_X, 2, TUONG_Z + .6); P.add(S.denCua);
    // khung cửa + cánh cửa (bản lề bên trái)
    var gk = new T.MeshStandardMaterial({ color: 0x451a03, roughness: .7 });
    P.add(hop(.25, CUA_H + .25, .55, gk, CUA_X - CUA_W / 2 - .12, (CUA_H + .25) / 2, TUONG_Z + .05));
    P.add(hop(.25, CUA_H + .25, .55, gk, CUA_X + CUA_W / 2 + .12, (CUA_H + .25) / 2, TUONG_Z + .05));
    P.add(hop(CUA_W + .5, .25, .55, gk, CUA_X, CUA_H + .12, TUONG_Z + .05));
    S.banLe = new T.Group(); S.banLe.position.set(CUA_X - CUA_W / 2, 0, TUONG_Z + .1); P.add(S.banLe);
    var canh = hop(CUA_W, CUA_H, .16, new T.MeshStandardMaterial({ color: 0xa16207, roughness: .6 }), CUA_W / 2, CUA_H / 2, 0); S.banLe.add(canh);
    [[.6, 2.7], [.6, .9]].forEach(function (p) { var o = hop(CUA_W - .5, 1.3, .05, new T.MeshStandardMaterial({ color: 0x92400e }), CUA_W / 2, p[1], .1); S.banLe.add(o); });
    var nam = new T.Mesh(new T.SphereGeometry(.1, 12, 10), G3D.mat('namCua', 0xfacc15, { metalness: .9, roughness: .2 })); nam.position.set(CUA_W - .3, 1.7, .15); S.banLe.add(nam);
    // 3 ổ khoá treo trên cánh cửa
    S.khoa = [0, 1, 2].map(function (i) {
      var g = new T.Group(); g.position.set(CUA_W / 2, CUA_H - .8 - i * 1.05, .22); S.banLe.add(g);
      var than = new T.Mesh(new T.BoxGeometry(.56, .46, .2), new T.MeshStandardMaterial({ color: 0xf59e0b, metalness: .7, roughness: .3, emissive: 0x000000 })); g.add(than);
      var lo = new T.Mesh(new T.CylinderGeometry(.05, .05, .22, 10), new T.MeshBasicMaterial({ color: 0x451a03 })); lo.rotation.x = Math.PI / 2; lo.position.y = -.04; g.add(lo);
      var quai = new T.Mesh(new T.TorusGeometry(.17, .045, 8, 20, Math.PI), G3D.mat('quaiKhoa', 0xcbd5e1, { metalness: .9, roughness: .2 })); quai.position.y = .23; g.add(quai);
      return { g: g, than: than, quai: quai };
    });
    // bảng mật mã bên trái cửa
    S.bangC = document.createElement('canvas'); S.bangC.width = 512; S.bangC.height = 320; S.bangT = new T.CanvasTexture(S.bangC); if (T.sRGBEncoding) S.bangT.encoding = T.sRGBEncoding;
    var bang = new T.Mesh(new T.PlaneGeometry(2.4, 1.5), new T.MeshBasicMaterial({ map: S.bangT })); bang.position.set(-2.6, 2.6, TUONG_Z + .23); P.add(bang);
    P.add(hop(2.6, 1.7, .1, G3D.mat('khungBangMa', 0x0f172a, { metalness: .5 }), -2.6, 2.6, TUONG_Z + .2));
    // đèn trần + còi báo động
    var bd = new T.Mesh(new T.CylinderGeometry(.6, .8, .2, 20), new T.MeshBasicMaterial({ color: 0xfef3c7 })); bd.position.set(0, 5.9, 0); P.add(bd);
    S.denTran = new T.PointLight(0xfff1d6, 1.3, 22); S.denTran.position.set(0, 5.4, 0); S.denTran.castShadow = true; P.add(S.denTran);
    S.coi = new T.Mesh(new T.SphereGeometry(.35, 16, 10, 0, Math.PI * 2, 0, Math.PI / 2), new T.MeshStandardMaterial({ color: 0x7f1d1d, emissive: 0xef4444, emissiveIntensity: 0 })); S.coi.position.set(-6, 5.6, TUONG_Z + .4); S.coi.rotation.x = Math.PI; P.add(S.coi);
    S.denDo = new T.PointLight(0xff1a1a, 0, 24); S.denDo.position.set(0, 4.5, 0); P.add(S.denDo);
    // biển chỉ lối thoát trên cửa
    var exitT = G3D.tex(256, 96, function (g, w, h) { g.fillStyle = '#16a34a'; g.fillRect(0, 0, w, h); g.fillStyle = '#fff'; g.font = '900 56px Arial'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('🚪 ➜', w / 2, h / 2 + 2); });
    var exit = new T.Mesh(new T.PlaneGeometry(1.1, .42), new T.MeshBasicMaterial({ map: exitT })); exit.position.set(CUA_X, CUA_H + .55, TUONG_Z + .22); P.add(exit);
    // ---------------------------------------------- ngoài trời (khi đã thoát)
    var N = S.ngoai = new T.Group(); N.visible = false; sc.add(N);
    var co = new T.Mesh(new T.PlaneGeometry(60, 40), new T.MeshStandardMaterial({ color: 0x4ade80, roughness: 1 })); co.rotation.x = -Math.PI / 2; co.receiveShadow = true; N.add(co);
    var nha = hop(7, 6, 3, new T.MeshStandardMaterial({ color: 0x64748b }), -4, 3, -8); N.add(nha);
    N.add(hop(1.8, 3, .2, new T.MeshBasicMaterial({ color: 0x0f172a }), -4, 1.5, -6.4));
    var bien = G3D.sprite(G3D.banner('🚪 LỐI THOÁT', '#16a34a'), 3.4, .55); bien.position.set(-4, 3.6, -6.2); N.add(bien);
    [[5, -6], [8, -9], [-10, -7], [10, -4]].forEach(function (p) { N.add(hop(.35, 1.6, .35, G3D.mat('thanCay', 0x78350f), p[0], .8, p[1])); var tan = new T.Mesh(new T.ConeGeometry(1.3, 2.8, 10), G3D.mat('laCay', 0x15803d)); tan.position.set(p[0], 2.9, p[1]); tan.castShadow = true; N.add(tan); });
    var mt = new T.Mesh(new T.SphereGeometry(1.6, 20, 14), new T.MeshBasicMaterial({ color: 0xfde047 })); mt.position.set(9, 12, -25); N.add(mt);
    // ---------------------------------------------- bản đồ phòng + đồng hồ (sprite trên cùng)
    S.mapC = document.createElement('canvas'); S.mapC.width = 1024; S.mapC.height = 200; S.mapT = new T.CanvasTexture(S.mapC); if (T.sRGBEncoding) S.mapT.encoding = T.sRGBEncoding;
    S.map = new T.Sprite(new T.SpriteMaterial({ map: S.mapT, transparent: true, depthTest: false })); S.map.scale.set(8.6, 1.68, 1); S.map.renderOrder = 10; sc.add(S.map);
    S.info = G3D.sprite(G3D.banner('', '#16a34a'), 5.4, .84); S.info.visible = false; S.info.renderOrder = 11; S.info.material.depthTest = false; sc.add(S.info); S.infoKey = '';
  }

  function veBang(so, mo) {
    var key = so + '/' + mo; if (key === S.bangKey) return; S.bangKey = key;
    var g = S.bangC.getContext('2d'); g.fillStyle = '#020617'; g.fillRect(0, 0, 512, 320); g.strokeStyle = '#38bdf8'; g.lineWidth = 8; g.strokeRect(4, 4, 504, 312);
    g.fillStyle = '#7dd3fc'; g.font = '900 54px Arial'; g.textAlign = 'center'; g.fillText('🔐 MẬT MÃ', 256, 80);
    g.font = '900 110px Consolas, monospace'; g.fillStyle = mo >= so ? '#4ade80' : '#facc15'; g.fillText(mo + ' / ' + so, 256, 210);
    g.font = '700 36px Arial'; g.fillStyle = '#94a3b8'; g.fillText(mo >= so ? 'Cửa đã mở khoá!' : 'Trả lời đúng để mở khoá', 256, 284);
    S.bangT.needsUpdate = true;
  }
  function veMap(s, P, ip) {
    var con = s.con, key = s.k + '|' + ip + '|' + Math.ceil(con) + '|' + (s.quaGio ? 1 : 0) + '|' + (s.xong ? 1 : 0);
    if (key === S.mapKey) return; S.mapKey = key;
    var g = S.mapC.getContext('2d'), w = 1024, m = P.length + 1, bw = Math.min(150, (w - 40) / m - 10), x0 = (w - m * (bw + 10) + 10) / 2;
    g.clearRect(0, 0, w, 200);
    P.concat([{ thoat: true }]).forEach(function (p, i) {
      var x = x0 + i * (bw + 10), xong = s.xong || (!p.thoat && s.k >= p.den), cur = !s.xong && i === ip;
      g.fillStyle = p.thoat ? (s.xong ? '#16a34a' : '#166534') : xong ? '#15803d' : cur ? '#1d4ed8' : 'rgba(30,41,59,.92)'; G3D.rr(g, x, 8, bw, 70, 14); g.fill();
      g.lineWidth = cur ? 6 : 2; g.strokeStyle = cur ? '#facc15' : '#64748b'; g.stroke();
      g.fillStyle = '#fff'; g.font = '800 ' + Math.min(34, bw / 4) + 'px Arial'; g.textAlign = 'center'; g.textBaseline = 'middle';
      g.fillText(p.thoat ? '🚪 RA' : 'P' + (i + 1) + ' ' + (xong ? '🔓' : cur ? Math.max(0, s.k - p.tu) + '/' + (p.den - p.tu) : '🔒'), x + bw / 2, 44);
    });
    var tl = Math.max(0, Math.min(1, con / Math.max(1, s.tong)));
    g.fillStyle = 'rgba(15,23,42,.9)'; G3D.rr(g, 20, 100, w - 40, 72, 30); g.fill();
    g.fillStyle = s.quaGio ? '#dc2626' : tl > .5 ? '#22c55e' : tl > .2 ? '#f59e0b' : '#ef4444'; G3D.rr(g, 26, 106, (w - 52) * (s.quaGio ? 1 : Math.max(.02, tl)), 60, 26); g.fill();
    g.fillStyle = '#fff'; g.font = '900 38px Arial'; g.fillText(s.xong ? (s.quaGio ? '🚪 ĐÃ RA NGOÀI (QUÁ GIỜ)' : '🎉 THOÁT HIỂM KỊP GIỜ!') : s.quaGio ? '⏰ QUÁ GIỜ – CÒI BÁO ĐỘNG ĐANG HÚ!' : '⏳ THỜI GIAN THOÁT HIỂM CÒN ' + mmss(con), w / 2, 137);
    S.mapT.needsUpdate = true;
  }
  function dongBoDoi(doi) {
    var ds = doi.length === 1 ? [{ ten: 'Em', mau: doi[0].mau }, { ten: 'Bạn Lan', mau: '#DB2777', girl: true }, { ten: 'Bạn Minh', mau: '#059669' }] : doi.slice(0, 4);
    var key = ds.map(function (d) { return d.ten + d.mau; }).join('|'); if (key === S.doiKey) return; S.doiKey = key;
    (S.hs || []).forEach(function (k) { S.scene.remove(k.obj); });
    S.hs = ds.map(function (d, j) {
      var o = G3D.kid(new T.Color(d.mau).getHex(), d.girl || j % 2 === 1, 'stand'); o.scale.setScalar(1.25); S.scene.add(o);
      var lab = G3D.sprite(G3D.label(d.ten, d.mau), 1.6, .38); lab.position.set(0, 2.4, 0); o.add(lab);
      return { obj: o, j: j, x0: -3.2 + j * 1.35, z0: 2 + (j % 2) * .5 };
    });
  }

  // ---------------------------------------------------------------- khung hình
  function frame() {
    if (!S) return; S.raf = requestAnimationFrame(frame);
    if (!S.el.offsetParent) return;
    var now = performance.now(), t = now / 1000, s = S.snapshot(); if (!s) return;
    var tNow = s.t || Date.now(), fx = s.fx || {}, tuoi = function (l) { return fx.loai === l ? tNow - fx.at : 1e9; };
    var aMo = tuoi('mo'), aKhoa = tuoi('khoa'), aBao = tuoi('bao'), P = chiaPhong(s.n);
    dongBoDoi(s.doi);
    // phòng đang hiện: chỉ sang phòng sau khi hoạt cảnh mở cửa của phòng trước đã xong
    var ipMoi = Math.min(P.length - 1, Math.floor(Math.min(s.k, s.n - 1) / 3));
    // (trang cả lớp: lệnh mở cửa tới sau khi chốt 0,3–1 giây → chờ thấy cảnh mở cửa, tối đa 2,5 giây)
    if (fx.loai === 'mo') (S.thayMo = S.thayMo || {})[fx.phong] = true;
    if (S.ip === undefined || ipMoi < S.ip){ S.ip = ipMoi; S.thayMo = {}; S.choTu = 0; }
    else if (ipMoi > S.ip){
      if (!S.choTu) S.choTu = now;
      var daXongMo = S.thayMo && S.thayMo[S.ip] && !(fx.loai === 'mo' && fx.phong === S.ip && aMo < 1750);
      if (daXongMo || now - S.choTu > 2500){ S.ip = ipMoi; S.vaoLuc = now; S.choTu = 0; }
    }
    var ip = S.ip, ph = P[ip], dangMo = fx.loai === 'mo' && fx.phong === ip && aMo < 1750 ? Math.max(0, aMo) : -1;
    S.tuongM.color.setHex(MAU_TUONG[ip % MAU_TUONG.length]);
    var ngoai = !!s.xong;
    S.phong.visible = !ngoai; S.ngoai.visible = ngoai; S.scene.background.setHex(ngoai ? 0x7dd3fc : 0x0b1220);
    if (S.scene.fog) S.scene.fog.color.setHex(ngoai ? 0x7dd3fc : 0x0b1220);
    veMap(s, P, ip);
    if (!ngoai) {
      // ổ khoá
      var so = ph.den - ph.tu, mo = Math.min(so, Math.max(0, s.k - ph.tu));
      veBang(so, mo);
      S.khoa.forEach(function (kh, q) {
        kh.g.visible = q < so; if (!kh.g.visible) return;
        kh.g.position.y = CUA_H / 2 + (so - 1) * .55 - q * 1.1;
        var daMo = ph.tu + q < s.k, vua = daMo && ph.tu + q === s.k - 1 && aKhoa < 700;
        kh.than.material.color.setHex(daMo ? 0x22c55e : 0xf59e0b); kh.than.material.emissive.setHex(vua ? 0x166534 : 0x000000);
        kh.quai.position.y = daMo ? .38 : .23; kh.quai.rotation.y = daMo ? .9 : 0;
        kh.g.position.z = .22 + (vua ? Math.sin(aKhoa / 700 * Math.PI) * .25 : 0);
        kh.g.rotation.z = vua ? Math.sin(aKhoa / 50) * .15 * (1 - aKhoa / 700) : 0;
      });
      // cửa mở + cả đội đi qua
      var goc = dangMo >= 0 ? Math.min(1, dangMo / 900) : 0; S.banLe.rotation.y = (1 - Math.pow(1 - goc, 3)) * 1.6;
      S.denCua.intensity = goc * 3;
      var di = dangMo >= 0 ? Math.max(0, Math.min(1, (dangMo - 350) / 1300)) : 0, vao = S.vaoLuc ? Math.min(1, (now - S.vaoLuc) / 900) : 1;
      S.hs.forEach(function (k) {
        var o = k.obj, b = o.userData.body;
        var x = k.x0 + (CUA_X - k.x0) * di, z = k.z0 + (TUONG_Z - 1 - k.z0) * di + (1 - vao) * 3;
        o.position.set(x, 0, z); o.rotation.y = di > 0 || vao < 1 ? Math.PI : Math.PI * .82;   // đang đi: quay lưng về máy quay, hướng vào cửa; đứng: nghiêng 3/4
        o.visible = di < .97;
        b.position.y = (di > 0 && di < 1) || vao < 1 ? Math.abs(Math.sin(t * 10 + k.j)) * .08 : Math.sin(t * 2 + k.j) * .02;
        b.rotation.z = aBao < 900 ? Math.sin(aBao / 60) * .08 : 0;
      });
      // còi báo động: sai mật mã, sắp hết giờ, quá giờ
      var tl = s.con / Math.max(1, s.tong), hu = s.quaGio || tl < .2 || aBao < 900;
      S.coi.material.emissiveIntensity = hu ? .6 + .6 * Math.sin(t * 12) : 0; S.coi.rotation.y = t * 6;
      S.denDo.intensity = (aBao < 900 ? 4 * (1 - aBao / 900) : 0) + (s.quaGio || tl < .2 ? 1.6 * (.5 + .5 * Math.sin(t * 9)) : 0);
      S.denTran.intensity = s.quaGio ? .7 + .3 * Math.sin(t * 9) : 1.3;
    } else {
      S.hs.forEach(function (k) { var o = k.obj; o.visible = true; o.position.set(-1.5 + k.j * 1.6, 0, 1); o.rotation.y = 0; o.userData.body.position.y = s.quaGio ? 0 : Math.abs(Math.sin(t * 6 + k.j)) * .55; });
    }
    // dòng thông báo lớn
    var chu = ngoai ? [s.quaGio ? '🚪 ĐÃ THOÁT RA NGOÀI!' : '🎉 THOÁT HIỂM THÀNH CÔNG!', s.quaGio ? '#c2410c' : '#16a34a']
      : dangMo >= 0 ? [ip === P.length - 1 ? '🚪 CỬA CUỐI ĐÃ MỞ – RA NGOÀI!' : '🔓 CỬA MỞ – SANG PHÒNG ' + (ip + 2) + '!', '#16a34a']
      : aBao < 1300 ? ['🚨 SAI MẬT MÃ – BÁO ĐỘNG!', '#dc2626'] : null;
    S.info.visible = !!chu;
    if (chu && chu.join() !== S.infoKey) { S.infoKey = chu.join(); G3D.setSprite(S.info, G3D.banner(chu[0], chu[1])); }
    // máy quay
    var cam = S.camera, tien = dangMo >= 0 ? Math.min(1, dangMo / 1700) * 2.2 : 0;
    if (ngoai) { cam.position.set(Math.sin(t * .2) * 1.5, 3.4, 9); cam.lookAt(0, 1.8, -2); }
    else { cam.position.set(-.6 + Math.sin(t * .17) * .6, 3.9, 9.2 - tien); cam.lookAt(.3, 2.1, -2.5); }
    // bản đồ, thông báo luôn nằm trên cùng khung hình (gắn theo máy quay)
    var fw = new T.Vector3(); cam.getWorldDirection(fw);
    var up = new T.Vector3(0, 1, 0), dau = cam.position.clone().add(fw.clone().multiplyScalar(9));
    var cao = Math.tan(cam.fov * Math.PI / 360) * 9;
    S.map.position.copy(dau).add(up.clone().multiplyScalar(cao - .95)); S.map.scale.set(Math.min(8.6, cao * cam.aspect * 1.9), Math.min(8.6, cao * cam.aspect * 1.9) * .195, 1);
    S.info.position.copy(dau).add(up.clone().multiplyScalar(cao * .1));
    S.renderer.render(S.scene, cam);
  }

  window.Thoat3D = {
    supported: function () { return window.G3D && G3D.supported(); },
    mount: function (el, snapshot) {
      return G3D.load().then(function () {
        T = G3D.T();
        if (S && S.el === el) { S.snapshot = snapshot; S.doiKey = S.mapKey = S.bangKey = S.infoKey = ''; S.ip = undefined; return S; }
        if (S) { cancelAnimationFrame(S.raf); try { S.ro.disconnect(); S.renderer.dispose(); } catch (e) {} }
        var o = G3D.scene(el, 0x0b1220, [30, 70]);
        S = Object.assign(o, { snapshot: snapshot });
        o.scene.add(new T.HemisphereLight(0xe2e8f0, 0x1e293b, .55));
        var nang = new T.DirectionalLight(0xffffff, .55); nang.position.set(6, 12, 8); nang.castShadow = true; nang.shadow.mapSize.set(1024, 1024);
        var c = nang.shadow.camera; c.left = -12; c.right = 12; c.top = 10; c.bottom = -10; o.scene.add(nang);
        build(); frame(); return S;
      });
    }
  };
})();
