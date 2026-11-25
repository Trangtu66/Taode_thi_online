// ĐUA XE KIẾN THỨC – MÀN CHIẾU 3D (Three.js). Chỉ thay phần hiển thị trên máy GV; luật chơi, điện thoại HS giữ nguyên.
// Dùng: Race3D.mount(el, snapshot)  – snapshot() trả {state, total, lanes:[{id, name, car, color, pos, done, penalty, asking, rank}]}
//       Race3D.camera()             – đổi góc quay: Bám đuôi dẫn đầu → Truyền hình (bên hông) → Toàn cảnh
//       Race3D.stop() / Race3D.supported()
//       Tự chơi (tu_choi.html): snapshot.focusId = id xe camera luôn bám (xe của em), không bám xe dẫn đầu.
(function () {
  'use strict';
  var THREE_URL = 'https://cdn.jsdelivr.net/npm/three@0.149.0/build/three.min.js';
  var T, R = null;            // THREE, trạng thái màn 3D
  var SEG = 16;               // khoảng cách giữa hai chướng ngại vật
  var CAMS = ['follow', 'tv', 'overview'], CAM_NAME = { follow: '🎥 Bám đuôi dẫn đầu', tv: '📺 Góc truyền hình', overview: '🛰️ Toàn cảnh' };

  // Kiểm tra WebGL MỘT lần rồi nhớ kết quả: mỗi lần tạo canvas thử là thêm một ngữ cảnh WebGL; gọi lặp lại (vài lần/giây)
  // làm trình duyệt vượt giới hạn và huỷ ngữ cảnh cũ nhất – chính là sân 3D đang chạy → sân tắt rồi hiện (sửa 23/11/2026).
  var WEBGL = null;
  function supported() {
    if (WEBGL === null) { try { var c = document.createElement('canvas'), g = c.getContext('webgl') || c.getContext('experimental-webgl'); WEBGL = !!(window.WebGLRenderingContext && g); var x = g && g.getExtension('WEBGL_lose_context'); if (x) x.loseContext(); } catch (e) { WEBGL = false; } }
    return WEBGL;
  }
  function loadThree() {
    if (window.THREE) return Promise.resolve(window.THREE);
    return new Promise(function (ok, fail) {
      var s = document.createElement('script'); s.src = THREE_URL; s.onload = function () { ok(window.THREE); }; s.onerror = function () { fail(new Error('Không tải được thư viện 3D (kiểm tra mạng).')); };
      document.head.appendChild(s);
    });
  }

  // ---------------------------------------------------------------- tiện ích vẽ chữ
  function canvasTex(w, h, draw) {
    var c = document.createElement('canvas'); c.width = w; c.height = h; draw(c.getContext('2d'), w, h);
    var t = new T.CanvasTexture(c); t.anisotropy = 4; if (T.sRGBEncoding) t.encoding = T.sRGBEncoding; return t;
  }
  function roundRect(g, x, y, w, h, r) { g.beginPath(); g.moveTo(x + r, y); g.arcTo(x + w, y, x + w, y + h, r); g.arcTo(x + w, y + h, x, y + h, r); g.arcTo(x, y + h, x, y, r); g.arcTo(x, y, x + w, y, r); g.closePath(); }
  function labelTex(text, color, rank) {
    return canvasTex(512, 128, function (g, w, h) {
      g.fillStyle = 'rgba(15,23,42,.82)'; roundRect(g, 6, 14, w - 12, h - 28, 40); g.fill();
      g.fillStyle = color; g.beginPath(); g.arc(64, h / 2, 34, 0, Math.PI * 2); g.fill();
      g.fillStyle = '#fff'; g.font = '900 40px Arial'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(String(rank || ''), 64, h / 2 + 2);
      g.textAlign = 'left'; g.font = '800 44px Arial'; var t = String(text); while (g.measureText(t).width > w - 140 && t.length > 2) t = t.slice(0, -2);
      if (t !== String(text)) t += '…'; g.fillText(t, 112, h / 2 + 2);
    });
  }
  var emojiCache = {};
  function emojiTex(e) {
    if (!emojiCache[e]) emojiCache[e] = canvasTex(128, 128, function (g) { g.font = '96px "Segoe UI Emoji","Apple Color Emoji","Noto Color Emoji",sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(e, 64, 72); });
    emojiCache[e].userData.keep = true; return emojiCache[e];
  }
  function signTex(n) {
    return canvasTex(256, 128, function (g, w, h) {
      g.fillStyle = '#f59e0b'; roundRect(g, 4, 4, w - 8, h - 8, 18); g.fill(); g.strokeStyle = '#7c2d12'; g.lineWidth = 8; g.stroke();
      g.fillStyle = '#111827'; g.font = '900 64px Arial'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('❓ ' + n, w / 2, h / 2 + 4);
    });
  }

  // ---------------------------------------------------------------- mô hình xe low-poly
  var SHAPE = {
    f1: { w: 1.5, h: .38, l: 3.4, cab: [.55, .32, .8, .2], wheel: .42, wing: true },
    sport: { w: 1.6, h: .5, l: 3.2, cab: [1.25, .42, 1.4, -.1], wheel: .36 },
    jeep: { w: 1.7, h: .8, l: 3, cab: [1.5, .6, 1.5, -.3], wheel: .48, spare: true },
    bus: { w: 1.7, h: .9, l: 3.6, cab: [1.6, .3, 3.2, 0], wheel: .4, bus: true },
    pickup: { w: 1.7, h: .65, l: 3.4, cab: [1.5, .6, 1.3, .6], wheel: .44 },
    moto: { w: .5, h: .5, l: 2, cab: [.45, .55, .5, -.2], wheel: .4, moto: true },
    kart: { w: 1.3, h: .22, l: 2.3, wheel: .3 },
    truck: { w: 1.8, h: .6, l: 4.2, wheel: .46 },
    classic: { w: 1.6, h: .55, l: 3, wheel: .38 },
    jet: { w: 1.3, h: .36, l: 3.6, wheel: .34 }
  };
  // gộp các khối cùng vật liệu thành một lưới (ít lệnh vẽ: 40 xe vẫn mượt trên máy yếu)
  function merge(geos) {
    var pos = [], nor = [];
    geos.forEach(function (g) { var ng = g.index ? g.toNonIndexed() : g; Array.prototype.push.apply(pos, ng.attributes.position.array); Array.prototype.push.apply(nor, ng.attributes.normal.array); g.dispose(); if (ng !== g) ng.dispose(); });
    var out = new T.BufferGeometry(); out.setAttribute('position', new T.Float32BufferAttribute(pos, 3)); out.setAttribute('normal', new T.Float32BufferAttribute(nor, 3)); return out;
  }
  var MAT = {};
  function mats(color) {
    if (!MAT.glass) {
      var S = function (c, o) { return new T.MeshStandardMaterial(Object.assign({ color: c }, o || {})); };
      MAT.glass = S(0x1e3a5f, { roughness: .08, metalness: .55 }); MAT.dark = S(0x1f2937, { roughness: .7 });
      MAT.tire = S(0x18181b, { roughness: .92 }); MAT.rim = S(0xd4d4d8, { roughness: .28, metalness: .65 });
      MAT.light = S(0xfffbeb, { emissive: 0xfef3c7, emissiveIntensity: .9, roughness: .2 }); MAT.tail = S(0xdc2626, { emissive: 0xb91c1c, emissiveIntensity: .6, roughness: .3 });
      MAT.white = S(0xffffff, { roughness: .45 }); MAT.helmet = S(0xfde047, { roughness: .25, metalness: .15 });
      MAT.fire = S(0xfb923c, { emissive: 0xf97316, emissiveIntensity: 1.2, roughness: .5 }); MAT.suit = S(0x334155, { roughness: .8 });
    }
    if (!MAT[color]) MAT[color] = new T.MeshStandardMaterial({ color: color, roughness: .3, metalness: .25 });
    return MAT;
  }
  // làm mượt pháp tuyến khối đùn (giữ cạnh gãy > deg độ): thân xe bo tròn bóng mịn, không lộ mặt phẳng nhỏ
  function muot(geo, deg) {
    var p = geo.attributes.position.array, n = geo.attributes.normal.array, cnt = p.length / 3, cs = Math.cos(deg * Math.PI / 180), f = new Float32Array(p.length), nhom = {}, i, k;
    for (i = 0; i < cnt; i += 3) {
      var a = i * 3, ux = p[a + 3] - p[a], uy = p[a + 4] - p[a + 1], uz = p[a + 5] - p[a + 2], vx = p[a + 6] - p[a], vy = p[a + 7] - p[a + 1], vz = p[a + 8] - p[a + 2];
      var x = uy * vz - uz * vy, y = uz * vx - ux * vz, z = ux * vy - uy * vx, l = Math.sqrt(x * x + y * y + z * z) || 1;
      for (k = 0; k < 3; k++) { f[a + k * 3] = x / l; f[a + k * 3 + 1] = y / l; f[a + k * 3 + 2] = z / l; }
    }
    for (i = 0; i < cnt; i++) { var key = Math.round(p[i * 3] * 1e3) + ',' + Math.round(p[i * 3 + 1] * 1e3) + ',' + Math.round(p[i * 3 + 2] * 1e3); (nhom[key] || (nhom[key] = [])).push(i); }
    Object.keys(nhom).forEach(function (key) {
      var ds = nhom[key];
      ds.forEach(function (a) {
        var x = 0, y = 0, z = 0;
        ds.forEach(function (b) { if (f[a * 3] * f[b * 3] + f[a * 3 + 1] * f[b * 3 + 1] + f[a * 3 + 2] * f[b * 3 + 2] > cs) { x += f[b * 3]; y += f[b * 3 + 1]; z += f[b * 3 + 2]; } });
        var l = Math.sqrt(x * x + y * y + z * z) || 1; n[a * 3] = x / l; n[a * 3 + 1] = y / l; n[a * 3 + 2] = z / l;
      });
    });
  }
  // Xe 3D vẽ theo đúng hình xe HS chọn trên điện thoại (raceCarSvg): F1 có người lái mũ vàng, xe thể thao, xe địa hình có bánh dự phòng,
  // xe buýt mini dãy cửa kính, xe bán tải cabin trước – thùng sau, mô tô có người lái, go-kart mui trần có người lái mũ trắng,
  // xe tải thùng kín, xe cổ điển mui tròn cản mạ crôm, xe phản lực mũi nhọn có vây đuôi và lửa phụt; cùng màu, cùng sọc trắng thân xe.
  // Dựng lại 25/11/2026 (GV: "cải tiến lại các xe mẫu 3D cho đẹp"): thân xe đùn theo hình mặt bên, bo tròn cạnh, khoét vòm bánh xe;
  // cabin kính lái nghiêng, cột kính; đèn pha, đèn hậu phát sáng, lưới tản nhiệt, cản; lốp bo tròn có mâm bạc và nan (thấy bánh quay);
  // người lái có thân, tay, chân. Giữ kích thước, vị trí bánh xe và userData {body, wheels, radius} như cũ (màn chiếu, điện thoại dùng chung).
  function makeCar(key, color) {
    // Điện thoại HS (phone3d.js) gọi Race3D.buildCar khi chưa mount màn chiếu: lấy THREE đã nạp sẵn (sửa 26/11/2026 – trước đây báo lỗi, điện thoại không dựng đúng xe em chọn)
    if (!T && window.THREE) { T = window.THREE; if (T.ColorManagement) T.ColorManagement.legacyMode = false; }
    if (!SHAPE[key]) key = 'sport';
    var s = SHAPE[key], g = new T.Group(), body = new T.Group(); g.add(body); mats(color);
    var P = {}, them = function (m, geo) { (P[m] || (P[m] = [])).push(geo); return geo; };
    var V = function (x, y, z) { return new T.Vector3(x, y, z); }, UP = V(0, 1, 0);
    var W = s.w, L = s.l, R0 = s.wheel, zF = key === 'moto' ? L / 2 - .35 : L / 2 - .6, zR = -zF, PI = Math.PI;
    // hình mặt bên (u dọc xe, mũi xe phía +u; v độ cao): [u, v] | ['q', cu, cv, u, v] cong | ['a', u, v, r, góc đầu, góc cuối, cùng chiều kim đồng hồ]
    var hinh = function (pts) {
      var sh = new T.Shape();
      pts.forEach(function (p, i) { if (!i) sh.moveTo(p[0], p[1]); else if (p[0] === 'q') sh.quadraticCurveTo(p[1], p[2], p[3], p[4]); else if (p[0] === 'a') sh.absarc(p[1], p[2], p[3], p[4], p[5], p[6]); else sh.lineTo(p[0], p[1]); });
      return sh;
    };
    // đùn hình mặt bên theo bề ngang w (căn giữa), bo cạnh b
    var dun = function (m, pts, w, b, x) {
      b = b === undefined ? .06 : b; var d = Math.max(.01, w - 2 * b);
      var geo = new T.ExtrudeGeometry(hinh(pts), { depth: d, bevelEnabled: b > 0, bevelThickness: b, bevelSize: b, bevelOffset: -b, bevelSegments: 3, curveSegments: 12 });
      geo.rotateY(-PI / 2); geo.translate(d / 2 + (x || 0), 0, 0); muot(geo, 50); return them(m, geo);
    };
    // viền trên (từ mũi dưới → đuôi dưới) + đáy ở độ cao yDay có khoét vòm quanh các bánh (tâm u trong ds, tăng dần)
    var vom = function (top, yDay, ds) {
      var pts = top.slice(), ra = R0 + .05, a = Math.asin(Math.max(-1, Math.min(1, (yDay - R0) / ra)));
      (ds || [zR, zF]).forEach(function (z) { pts.push(['a', z, R0, ra, PI - a, a, true]); });
      return pts;
    };
    // cabin: đai kính (belt) từ u = bf (trước) tới br (sau), nóc từ rf tới rr (cong phồng), kính lái/kính hậu/kính hông nhô nhẹ ra ngoài
    var cabin = function (belt, bf, rf, rr, br, wC, phong, coCot) {
      dun('paint', [[bf, belt - .1], [bf, belt], [rf[0], rf[1]], ['q', (rf[0] + rr[0]) / 2, Math.max(rf[1], rr[1]) + (phong || 0), rr[0], rr[1]], [br, belt], [br, belt - .1]], wC, .05);
      var gt = Math.min(rf[1], rr[1]) - .06, k1 = (gt - belt) / (rf[1] - belt), k2 = (gt - belt) / (rr[1] - belt), o = .035;
      var u1 = bf + (rf[0] - bf) * k1, u2 = br + (rr[0] - br) * k2;
      dun('glass', [[bf + o, belt + .04], [u1 + o, gt], [u2 - o, gt], [br - o, belt + .04]], wC + .04, .02);
      if (coCot !== false) hop('paint', wC + .06, gt - belt - .02, .08, 0, (gt + belt) / 2 + .02, (u1 + u2) / 2 + (bf - u1) * .3);   // cột kính giữa
    };
    var hop = function (m, w, h, l, x, y, z) { return them(m, new T.BoxGeometry(w, h, l).translate(x, y, z)); };
    var cau = function (m, r, x, y, z, sx, sy, sz) { var geo = new T.SphereGeometry(r, 18, 12); geo.scale(sx || 1, sy || 1, sz || 1); geo.translate(x, y, z); return them(m, geo); };
    var ong = function (m, a, b, r) {
      var d = b.clone().sub(a), geo = new T.CapsuleGeometry(r, Math.max(.001, d.length()), 4, 12);
      geo.applyMatrix4(new T.Matrix4().compose(a.clone().add(b).multiplyScalar(.5), new T.Quaternion().setFromUnitVectors(UP, d.normalize()), V(1, 1, 1))); return them(m, geo);
    };
    var doi = function (f) { f(-1); f(1); };   // dựng đối xứng hai bên
    // bánh xe: lốp tiện bo tròn + nan tối (mesh lốp), mâm bạc + ốc giữa (mesh mâm), viền trắng (xe cổ điển); trục quay theo x
    var banh = function (x, r, rong, dich, vienTrang) {
      var h = rong / 2, ri = r * .62, c = Math.min(.07, h * .55), out = { tire: [], rim: [], white: [] }, dy = dich || [0, 0, 0];
      var lop = new T.LatheGeometry([new T.Vector2(ri, -h), new T.Vector2(r - c, -h), new T.Vector2(r - c * .3, -h + c * .3), new T.Vector2(r, -h + c), new T.Vector2(r, h - c), new T.Vector2(r - c * .3, h - c * .3), new T.Vector2(r - c, h), new T.Vector2(ri, h)], 24);
      out.tire.push(lop.rotateZ(PI / 2));
      out.rim.push(new T.CylinderGeometry(ri + .005, ri + .005, rong - .05, 20).rotateZ(PI / 2), new T.CylinderGeometry(ri * .26, ri * .26, rong + .01, 12).rotateZ(PI / 2));
      for (var k = 0; k < 3; k++) [-1, 1].forEach(function (sd) { out.tire.push(new T.BoxGeometry(.03, ri * 1.85, ri * .2).rotateX(k * PI / 3).translate(sd * (h - .035), 0, 0)); });
      if (vienTrang) [-1, 1].forEach(function (sd) { out.white.push(new T.RingGeometry(ri + .02, ri + (r - ri) * .55, 24).rotateY(sd * PI / 2).translate(sd * (h + .003), 0, 0)); });
      Object.keys(out).forEach(function (k) { out[k].forEach(function (gg) { gg.translate(x + dy[0], dy[1], dy[2]); }); });
      return out;
    };
    var denPha = function (r, dx, y, z, sx, sy) { doi(function (sd) { cau('light', r, sd * dx, y, z, sx || 1.4, sy || .7, .5); }); };
    var denHau = function (w, h, dx, y, z) { doi(function (sd) { hop('tail', w, h, .05, sd * dx, y, z); }); };
    var soc = function (y, l, z) { hop('white', W + .012, .06, l, 0, y, z || 0); };   // sọc trắng hai bên thân
    var guong = function (y, z, dx) { doi(function (sd) { ong('dark', V(sd * (dx - .05), y - .05, z), V(sd * (dx + .08), y, z - .04), .025); cau('paint', .07, sd * (dx + .12), y, z - .05, .7, .9, 1.2); }); };

    if (key === 'sport') {
      dun('paint', vom([[1.6, .24], [1.63, .5], ['q', 1.65, .8, 1.35, .84], [.45, .9], [-1.2, .92], ['q', -1.62, .94, -1.6, .6], [-1.58, .24]], .24), W, .08);
      cabin(.88, .45, [-.15, 1.25], [-.75, 1.22], -1.35, W * .8, .04);
      dun('paint', [[-1.36, 1.08], [-1.68, 1.11], ['q', -1.7, 1.05, -1.64, 1.03], [-1.4, 1.02]], W * .9, .02);   // cánh gió sau
      doi(function (sd) { hop('dark', .06, .14, .12, sd * .45, .98, -1.5); });
      denPha(.12, .5, .66, 1.56); hop('dark', .7, .12, .06, 0, .42, 1.61); denHau(.42, .09, .5, .78, -1.6);
      hop('dark', W + .01, .06, 1.05, 0, .27, 0); soc(.8, 2.4); guong(1.0, .36, W * .4);
    } else if (key === 'f1') {
      dun('paint', [[1.75, .2], [1.75, .3], ['q', 1.0, .42, .45, .6], [.1, .66], [-.5, .66], [-.62, .98], ['q', -.75, 1.06, -1.0, 1.0], [-1.45, .66], [-1.7, .6], [-1.7, .22], [0, .16]], .52, .1);
      dun('paint', [[.45, .22], [.45, .48], ['q', .1, .62, -.3, .6], [-1.05, .45], [-1.05, .22]], 1.05, .08);   // hai hông khí động
      dun('white', [[1.7, .33], ['q', 1.0, .45, .45, .63], [.42, .59], ['q', 1.0, .4, 1.7, .29]], .18, 0);   // sọc trắng trên mũi
      hop('dark', .36, .04, .6, 0, .665, -.15);                                                                // khoang lái
      dun('paint', [[1.95, .1], [1.95, .17], [1.56, .2], [1.53, .12]], W * 1.25, .02);                       // cánh trước
      doi(function (sd) { hop('dark', .04, .17, .44, sd * .94, .17, 1.74); hop('dark', .04, .38, .48, sd * .64, .96, -1.68); });
      dun('paint', [[-1.45, 1.06], [-1.86, 1.13], [-1.86, 1.03], [-1.5, .99]], 1.25, .02);                   // cánh sau
      hop('dark', .08, .35, .1, 0, .82, -1.6); hop('tail', .14, .1, .04, 0, .45, -1.72);
      cau('helmet', .2, 0, .82, -.2); cau('dark', .13, 0, .84, -.07, 1.25, .55, .7);                         // người lái mũ vàng, kính
    } else if (key === 'jeep') {
      dun('paint', vom([[1.5, .36], [1.53, .7], ['q', 1.55, 1.12, 1.4, 1.14], [.5, 1.18], [-1.45, 1.18], ['q', -1.52, 1.18, -1.52, 1.0], [-1.5, .36]], .36), W, .1);
      cabin(1.15, .42, [.22, 1.78], [-1.38, 1.8], -1.45, W * .92, .02);
      hop('dark', .92, .34, .06, 0, .86, 1.53); for (var j = -2; j <= 2; j++) hop('rim', .05, .28, .07, j * .16, .86, 1.54);   // lưới tản nhiệt
      denPha(.12, .62, .9, 1.52, 1, 1); doi(function (sd) { them('rim', new T.TorusGeometry(.12, .025, 8, 18).translate(sd * .62, .9, 1.55)); });
      hop('dark', W + .1, .16, .2, 0, .5, 1.58); hop('dark', W + .1, .16, .2, 0, .5, -1.58);                  // cản trước, sau
      var dp = banh(0, .42, .24); ['tire', 'rim'].forEach(function (k) { dp[k].forEach(function (gg) { them(k, gg.rotateY(PI / 2).translate(0, 1.1, -1.7)); }); });   // bánh dự phòng sau xe
      doi(function (sd) { hop('dark', .06, .06, 1.5, sd * .66, 1.87, -.55); }); hop('dark', 1.38, .05, .06, 0, 1.89, -.05); hop('dark', 1.38, .05, .06, 0, 1.89, -1.05);   // giá nóc
      denHau(.12, .22, .7, .85, -1.53); soc(1.08, 2.9); guong(1.4, .38, W * .46);
    } else if (key === 'bus') {
      dun('paint', vom([[1.82, .28], [1.86, .95], [1.62, 1.72], ['q', 1.58, 1.88, 1.4, 1.88], [-1.65, 1.88], ['q', -1.82, 1.88, -1.82, 1.7], [-1.82, .28]], .28), W, .1);
      dun('glass', [[1.7, 1.02], [1.868, 1.02], [1.669, 1.66], [1.5, 1.66]], W * .86, .02);                // kính lái
      hop('glass', W + .02, .5, 2.95, 0, 1.38, -.07);                                                          // dãy cửa kính
      [-1.05, -.42, .21, .84].forEach(function (u) { hop('paint', W + .04, .5, .09, 0, 1.38, u); });
      hop('dark', .8, .14, .05, 0, .58, 1.86); denPha(.12, .62, .62, 1.85, 1.3, .8);
      hop('dark', W + .06, .14, .14, 0, .35, 1.84); hop('dark', W + .06, .14, .14, 0, .35, -1.84);
      denHau(.12, .3, .7, .7, -1.84); hop('white', .7, .1, .7, 0, 1.93, -.4); soc(1.0, 3.3); guong(1.3, 1.7, W * .5);
    } else if (key === 'pickup') {
      dun('paint', vom([[1.7, .32], [1.74, .72], ['q', 1.76, 1.02, 1.5, 1.04], [.5, 1.08], [-1.7, 1.08], [-1.7, .32]], .32), W, .08);
      hop('dark', W - .24, .03, 1.42, 0, 1.085, -.95);                                                          // sàn thùng
      doi(function (sd) { hop('paint', .1, .22, 1.46, sd * (W / 2 - .05), 1.19, -.95); }); hop('paint', W, .22, .1, 0, 1.19, -1.65);   // thành thùng
      cabin(1.05, .48, [.22, 1.66], [-.18, 1.66], -.24, W * .94, .02, false);
      hop('dark', 1.0, .26, .06, 0, .82, 1.75); [.74, .82, .9].forEach(function (y) { hop('rim', .9, .03, .07, 0, y, 1.755); });
      denPha(.12, .66, .9, 1.69); hop('rim', W + .08, .14, .16, 0, .42, 1.76); hop('rim', W + .08, .12, .14, 0, .42, -1.74);
      denHau(.1, .28, .78, .85, -1.72); soc(.99, 3.2); guong(1.32, .4, W * .47);
    } else if (key === 'kart') {
      dun('paint', [[1.15, .1], [1.18, .24], ['q', 1.0, .42, .55, .36], [.3, .3], [-1.0, .3], [-1.15, .22], [-1.15, .1]], .9, .06);   // sàn thấp, mũi chắn gió
      doi(function (sd) { cau('paint', .14, sd * .52, .22, 0, 1, .7, 2.2); });                                 // hai hông
      dun('dark', [[-.05, .3], [-.2, .75], [-.4, .78], [-.45, .3]], .5, .05);                                 // ghế
      hop('dark', .3, .3, .3, .22, .45, -.85); ong('rim', V(.3, .5, -.95), V(.42, .45, -1.25), .04);          // động cơ, ống xả
      ong('dark', V(-.7, .25, -1.2), V(.7, .25, -1.2), .05); ong('dark', V(-.45, .18, 1.22), V(.45, .18, 1.22), .04);   // cản sau, trước
      them('white', new T.CylinderGeometry(.12, .12, .02, 18).rotateX(-.35).translate(0, .4, .78));            // biển số trắng
      ong('white', V(0, .5, -.25), V(0, .92, -.15), .17);                                                      // người lái áo trắng
      doi(function (sd) { ong('white', V(sd * .18, .9, -.12), V(sd * .18, .7, .3), .055); ong('white', V(sd * .12, .42, -.12), V(sd * .13, .36, .62), .07); });
      cau('white', .19, 0, 1.16, -.12); cau('dark', .13, 0, 1.17, .0, 1.1, .55, .6);                          // mũ trắng, kính
      them('dark', new T.TorusGeometry(.14, .025, 8, 20).rotateX(-.9).translate(0, .72, .38)); ong('dark', V(0, .72, .38), V(0, .35, .72), .025);   // vô lăng
    } else if (key === 'truck') {
      hop('dark', W * .8, .2, L * .95, 0, .5, 0);                                                              // khung gầm
      dun('paint', vom([[2.1, .4], [2.12, 1.0], ['q', 2.12, 1.95, 1.85, 1.98], [.8, 2.0], [.8, .4]], .4, [zF]), W, .1);   // cabin
      hop('glass', W * .84, .48, .04, 0, 1.48, 2.13); hop('glass', W + .02, .42, .55, 0, 1.5, 1.62);
      hop('dark', 1.1, .35, .05, 0, .78, 2.13); [.68, .78, .88].forEach(function (y) { hop('rim', 1.0, .03, .06, 0, y, 2.14); });
      doi(function (sd) { hop('light', .3, .14, .05, sd * .62, .62, 2.14); }); hop('rim', W + .06, .16, .18, 0, .45, 2.15);
      dun('paint', vom([[.7, .8], [.7, 2.3], [-2.1, 2.3], [-2.1, .8]], .8, [zR]), W, .06);                     // thùng hàng kín
      hop('dark', .03, 1.3, .03, 0, 1.55, -2.11); denHau(.12, .26, .75, .95, -2.12);
      hop('white', W + .012, .12, 2.6, 0, 1.6, -.7); ong('rim', V(.72, 1.0, .74), V(.72, 2.15, .74), .05); guong(1.65, 1.85, W * .5);
    } else if (key === 'classic') {
      dun('paint', vom([[1.5, .28], [1.55, .55], ['q', 1.58, .88, 1.3, .9], [.4, .95], [-1.05, .95], ['q', -1.55, .95, -1.52, .55], [-1.5, .28]], .28), W, .12);
      cabin(.92, .35, [.08, 1.38], [-.75, 1.38], -1.0, W * .82, .14);
      doi(function (sd) { ong('rim', V(sd * .05, .42, 1.55), V(sd * .82, .42, 1.53), .07); ong('rim', V(sd * .05, .42, -1.55), V(sd * .82, .42, -1.53), .07); });   // cản mạ crôm
      denPha(.13, .55, .72, 1.5, 1, 1); doi(function (sd) { them('rim', new T.TorusGeometry(.13, .025, 8, 18).translate(sd * .55, .72, 1.53)); });
      hop('rim', .5, .22, .05, 0, .62, 1.55); for (var q = -2; q <= 2; q++) hop('dark', .04, .2, .06, q * .09, .62, 1.556);
      doi(function (sd) { cau('tail', .08, sd * .6, .75, -1.52, 1, 1, .5); }); soc(.85, 2.4); guong(1.0, .45, W * .42);
    } else if (key === 'jet') {
      var than = new T.LatheGeometry([V(0, -1.75, 0), V(.36, -1.75, 0), V(.4, -1.3, 0), V(.4, .3, 0), V(.36, .9, 0), V(.26, 1.35, 0), V(.12, 1.7, 0), V(0, 1.85, 0)].map(function (v) { return new T.Vector2(v.x, v.y); }), 20);
      than.rotateX(PI / 2); than.scale(1.15, .9, 1); than.translate(0, .62, 0); them('paint', than);          // thân thuôn tròn, mũi nhọn
      cau('white', .1, 0, .62, 1.8, 1, .9, 1.4); cau('glass', .22, 0, .92, .45, 1, .8, 2.2);                  // đầu mũi, buồng lái
      var canh = new T.ExtrudeGeometry(hinh([[-1.05, -.95], [-1.05, -.7], [0, .3], [1.05, -.7], [1.05, -.95]]), { depth: .06, bevelEnabled: false });
      canh.rotateX(PI / 2); canh.translate(0, .56, 0); muot(canh, 50); them('paint', canh);                    // cánh tam giác
      dun('paint', [[-1.1, .9], [-1.75, 1.55], [-1.85, 1.55], [-1.75, .9]], .08, .02);                       // vây đuôi
      doi(function (sd) { cau('dark', .14, sd * .4, .62, .2, .6, .8, 1.6); });                                // cửa hút gió
      them('dark', new T.CylinderGeometry(.3, .26, .25, 18).rotateX(PI / 2).translate(0, .62, -1.85));
      them('fire', new T.ConeGeometry(.24, .7, 14).rotateX(-PI / 2).translate(0, .62, -2.3));                  // lửa phụt
      hop('white', .93, .06, 2.0, 0, .62, -.3);
    } else {   // mô tô
      dun('paint', [[.95, .62], [1.02, .9], ['q', .98, 1.1, .78, 1.12], [.45, 1.08], ['q', .25, 1.2, -.05, 1.05], [-.35, 1.0], [-.7, 1.02], ['q', -.95, 1.08, -1.0, .92], [-.75, .78], [-.2, .55], [.4, .5]], .42, .1);
      dun('glass', [[.8, 1.1], [.9, 1.1], [.72, 1.38], [.64, 1.36]], .34, .02);                             // kính chắn gió
      dun('dark', [[.05, 1.04], [-.7, 1.02], ['q', -.76, 1.12, -.6, 1.14], [0, 1.13]], .36, .04);           // yên
      hop('dark', .36, .3, .5, 0, .5, -.05); ong('rim', V(.2, .3, .25), V(.2, .45, -.9), .05);                // máy, ống xả
      doi(function (sd) { ong('rim', V(sd * .1, .4, .65), V(sd * .1, 1.05, .72), .035); });                  // phuộc trước
      ong('dark', V(-.32, 1.12, .62), V(.32, 1.12, .62), .03); cau('light', .09, 0, .95, 1.0, 1, 1, .5); hop('tail', .14, .06, .05, 0, .95, -1.0);
      ong('suit', V(0, 1.2, -.35), V(0, 1.6, -.05), .17);                                                     // người lái
      doi(function (sd) {
        ong('suit', V(sd * .18, 1.55, -.05), V(sd * .3, 1.15, .55), .06);
        ong('suit', V(sd * .12, 1.18, -.35), V(sd * .2, 1.05, .05), .085); ong('suit', V(sd * .2, 1.05, .05), V(sd * .2, .6, -.05), .07);
        cau('dark', .07, sd * .2, .55, 0, 1, .8, 1.6);
      });
      cau('paint', .2, 0, 1.8, .05); cau('dark', .14, 0, 1.8, .15, 1.1, .6, .6);                              // mũ cùng màu xe, kính
    }
    Object.keys(P).forEach(function (k) {
      var m = new T.Mesh(merge(P[k]), k === 'paint' ? MAT[color] : MAT[k]); m.castShadow = true; body.add(m);
    });
    var wheels = [], xs = key === 'moto' ? [0] : [-W / 2, W / 2], rong = key === 'moto' ? .16 : key === 'f1' ? .38 : .32;
    [zF, zR].forEach(function (z) {
      var ax = new T.Group(), gop = { tire: [], rim: [], white: [] };
      xs.forEach(function (x) { var b = banh(x, R0, rong, null, key === 'classic'); Object.keys(gop).forEach(function (k) { gop[k] = gop[k].concat(b[k]); }); });
      Object.keys(gop).forEach(function (k) { if (gop[k].length) { var m = new T.Mesh(merge(gop[k]), MAT[k]); m.castShadow = true; ax.add(m); } });
      ax.position.set(0, R0, z); g.add(ax); wheels.push(ax);
    });
    g.userData = { body: body, wheels: wheels, radius: R0 };
    return g;
  }

  // ---------------------------------------------------------------- dựng cảnh theo số làn, số chướng ngại
  function sprite(tex, w, h) { var m = new T.Sprite(new T.SpriteMaterial({ map: tex, transparent: true, depthWrite: false })); m.scale.set(w, h, 1); return m; }

  function buildWorld(n, total) {
    var sc = R.scene; if (R.world) { sc.remove(R.world); disposeTree(R.world); }
    var W = R.world = new T.Group(); sc.add(W);
    var lw = n > 24 ? 2.4 : n > 12 ? 2.9 : 3.4, roadW = Math.max(n, 1) * lw + 3, L = SEG * (total + 1);
    R.lw = lw; R.roadW = roadW; R.L = L; R.n = n; R.total = total;
    R.renderer.shadowMap.enabled = n <= 16; R.sun.castShadow = n <= 16;
    var ground = new T.Mesh(new T.PlaneGeometry(roadW + 400, L + 500), new T.MeshStandardMaterial({ color: 0x3f9e4d, roughness: 1 }));
    ground.rotation.x = -Math.PI / 2; ground.position.set(0, -.02, L / 2); ground.receiveShadow = true; W.add(ground);
    var road = new T.Mesh(new T.PlaneGeometry(roadW, L + 60), new T.MeshStandardMaterial({ color: 0x374151, roughness: .9 }));
    road.rotation.x = -Math.PI / 2; road.position.set(0, 0, L / 2 + 10); road.receiveShadow = true; W.add(road);
    // lề đường sọc đỏ trắng
    var curbN = Math.ceil((L + 60) / 2), curb = new T.InstancedMesh(new T.BoxGeometry(.6, .12, 2), new T.MeshStandardMaterial(), curbN * 2), m4 = new T.Matrix4(), col = new T.Color();
    for (var i = 0; i < curbN; i++) for (var sd = 0; sd < 2; sd++) {
      m4.makeTranslation((sd ? 1 : -1) * (roadW / 2 + .3), .06, -20 + i * 2 + 1); curb.setMatrixAt(i * 2 + sd, m4);
      curb.setColorAt(i * 2 + sd, col.set(i % 2 ? 0xffffff : 0xdc2626));
    }
    W.add(curb);
    // vạch chia làn đứt khúc
    if (n > 1) {
      var dashN = Math.ceil((L + 40) / 4), dash = new T.InstancedMesh(new T.BoxGeometry(.12, .02, 1.6), new T.MeshBasicMaterial({ color: 0xf8fafc }), dashN * (n - 1)), k = 0;
      for (var ln = 1; ln < n; ln++) for (var d = 0; d < dashN; d++) { m4.makeTranslation(-roadW / 2 + 1.5 + ln * lw, .02, -10 + d * 4); dash.setMatrixAt(k++, m4); }
      W.add(dash);
    }
    // vạch xuất phát, cổng về đích
    var checker = canvasTex(256, 32, function (g, w, h) { for (var x = 0; x < 16; x++) for (var y = 0; y < 2; y++) { g.fillStyle = (x + y) % 2 ? '#111' : '#fff'; g.fillRect(x * 16, y * 16, 16, 16); } });
    checker.wrapS = T.RepeatWrapping; checker.repeat.set(Math.max(1, roadW / 8), 1);
    [0, L].forEach(function (z) { var p = new T.Mesh(new T.PlaneGeometry(roadW, 1.6), new T.MeshBasicMaterial({ map: checker })); p.rotation.x = -Math.PI / 2; p.position.set(0, .03, z); W.add(p); });
    var postM = new T.MeshStandardMaterial({ color: 0xe5e7eb, metalness: .4, roughness: .4 });
    [-1, 1].forEach(function (sd) { var post = new T.Mesh(new T.CylinderGeometry(.35, .35, 8, 12), postM); post.position.set(sd * (roadW / 2 + 1), 4, L); post.castShadow = true; W.add(post); });
    var finM = new T.MeshBasicMaterial({ map: canvasTex(1024, 128, function (g, w, h) { g.fillStyle = '#dc2626'; g.fillRect(0, 0, w, h); g.fillStyle = '#fff'; g.font = '900 84px Arial'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('🏁 VỀ ĐÍCH 🏁', w / 2, h / 2 + 4); }) });
    var banner = new T.Mesh(new T.BoxGeometry(roadW + 2.6, 2, .3), [postM, postM, postM, postM, finM, finM]);
    banner.position.set(0, 8, L); W.add(banner);
    var startB = banner.clone(); startB.material = banner.material.slice(); startB.material[4] = startB.material[5] = new T.MeshBasicMaterial({ map: canvasTex(1024, 128, function (g, w, h) { g.fillStyle = '#16a34a'; g.fillRect(0, 0, w, h); g.fillStyle = '#fff'; g.font = '900 84px Arial'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('🚦 XUẤT PHÁT', w / 2, h / 2 + 4); }) });
    startB.position.set(0, 8, 0); W.add(startB);
    R.banners = [startB, banner];   // tạm ẩn khi nằm giữa camera và xe (xem frame)
    [-1, 1].forEach(function (sd) { var post = new T.Mesh(new T.CylinderGeometry(.35, .35, 8, 12), postM); post.position.set(sd * (roadW / 2 + 1), 4, 0); W.add(post); });
    // chướng ngại vật: mỗi làn một cọc nón (đổi màu xám khi xe làn đó đã vượt), mỗi chặng một biển số câu
    R.cones = null;
    if (total && n) {
      var cone = new T.InstancedMesh(new T.ConeGeometry(.42, 1.1, 14), new T.MeshStandardMaterial({ roughness: .5 }), n * total);
      cone.castShadow = true;
      for (var q = 0; q < total; q++) {
        for (var l2 = 0; l2 < n; l2++) { m4.makeTranslation(laneX(l2), .55, coneZ(q)); cone.setMatrixAt(q * n + l2, m4); cone.setColorAt(q * n + l2, col.set(0xf97316)); }
        var sg = sprite(signTex(q + 1), 3.2, 1.6); sg.position.set(-roadW / 2 - 2.6, 2.6, coneZ(q)); W.add(sg);
        var sg2 = sprite(signTex(q + 1), 3.2, 1.6); sg2.position.set(roadW / 2 + 2.6, 2.6, coneZ(q)); W.add(sg2);
      }
      W.add(cone); R.cones = cone; R.coneState = new Array(n * total).fill(false);
    }
    // cây, đồi hai bên đường
    var treeN = Math.ceil((L + 120) / 7) * 2, trunk = new T.InstancedMesh(new T.CylinderGeometry(.18, .25, 1.4, 6), new T.MeshStandardMaterial({ color: 0x92400e }), treeN),
        leaf = new T.InstancedMesh(new T.ConeGeometry(1.3, 3, 8), new T.MeshStandardMaterial({ color: 0x15803d, roughness: .9 }), treeN), rnd = mulberry(7);
    for (var t = 0; t < treeN; t++) {
      var side = t % 2 ? 1 : -1, x = side * (roadW / 2 + 6 + rnd() * 30), z = -40 + Math.floor(t / 2) * 7 + rnd() * 4, s = .8 + rnd() * .9;
      m4.makeScale(s, s, s).setPosition(x, .7 * s, z); trunk.setMatrixAt(t, m4); m4.makeScale(s, s, s).setPosition(x, 2.8 * s, z); leaf.setMatrixAt(t, m4);
      leaf.setColorAt(t, col.set(rnd() > .5 ? 0x15803d : 0x16a34a));
    }
    trunk.castShadow = leaf.castShadow = true; W.add(trunk); W.add(leaf);
    var hillM = new T.MeshStandardMaterial({ color: 0x4d7c0f, roughness: 1, flatShading: true });
    for (var hh = 0; hh < 14; hh++) { var hill = new T.Mesh(new T.ConeGeometry(18 + rnd() * 20, 14 + rnd() * 18, 7), hillM); hill.position.set((hh % 2 ? 1 : -1) * (roadW / 2 + 70 + rnd() * 50), 6, -60 + hh * (L + 160) / 14); W.add(hill); }
    // ánh nắng theo chiều dài đường
    R.sun.position.set(30, 60, L * .3); R.sun.target.position.set(0, 0, L * .5);
    var cam = R.sun.shadow.camera, half = Math.max(roadW, L) * .6; cam.left = -half; cam.right = half; cam.top = half; cam.bottom = -half; cam.far = 400; cam.updateProjectionMatrix();
  }
  function laneX(i) { return -R.roadW / 2 + 1.5 + (i + .5) * R.lw; }
  function coneZ(q) { return SEG * (q + 1); }
  function targetZ(l, state) {
    if (!R.total || state === 'idle' || state === 'countdown' || !l) return -3;
    if (l.done) return R.L + 7;
    return coneZ(l.pos) - 4.5;
  }
  function mulberry(a) { return function () { a |= 0; a = a + 0x6D2B79F5 | 0; var t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
  function disposeTree(o) { var shared = {}; Object.keys(MAT).forEach(function (k) { shared[MAT[k].uuid] = 1; }); o.traverse(function (x) { if (x.geometry) x.geometry.dispose(); var m = x.material; (Array.isArray(m) ? m : m ? [m] : []).forEach(function (mm) { if (shared[mm.uuid]) return; if (mm.map && !mm.map.userData.keep) mm.map.dispose(); mm.dispose(); }); }); }


  // ---------------------------------------------------------------- ÂM THANH ĐỘNG CƠ (Web Audio, tổng hợp – không cần file mp3)
  // Tiếng máy nổ chung của cả đường đua: ga tăng khi có xe đang chạy; tiếng rồ ga khi một xe vượt chướng ngại;
  // tiếng phanh trượt bánh khi trả lời sai; còi khi về đích. Tắt/bật: Race3D.engine(true|false); tôn trọng nút tắt âm của trang.
  var AU = { on: (function () { try { return localStorage.getItem('race_engine') !== 'off'; } catch (e) { return true; } })() };
  function auInit() {
    if (AU.ctx) { if (AU.ctx.state === 'suspended') AU.ctx.resume(); return AU.ctx; }
    var C = window.AudioContext || window.webkitAudioContext; if (!C) return null;
    var ctx = AU.ctx = new C(), out = AU.out = ctx.createGain(); out.gain.value = 0; out.connect(ctx.destination);
    var lp = AU.lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 500; lp.Q.value = 4; lp.connect(out);
    var shaper = ctx.createWaveShaper(), curve = new Float32Array(256);
    for (var i = 0; i < 256; i++) { var x = i / 128 - 1; curve[i] = Math.tanh(x * 2.5); } shaper.curve = curve;
    var am = AU.am = ctx.createGain(); am.gain.value = 1; shaper.connect(am); am.connect(lp);
    AU.o1 = ctx.createOscillator(); AU.o1.type = 'sawtooth'; AU.o2 = ctx.createOscillator(); AU.o2.type = 'square'; AU.o3 = ctx.createOscillator(); AU.o3.type = 'sawtooth';
    var g1 = ctx.createGain(), g2 = ctx.createGain(), g3 = ctx.createGain(); g1.gain.value = .5; g2.gain.value = .3; g3.gain.value = .25;
    AU.o1.connect(g1); AU.o2.connect(g2); AU.o3.connect(g3); g1.connect(shaper); g2.connect(shaper); g3.connect(shaper);
    // tiếng nổ lụp bụp của máy: LFO điều biên
    AU.lfo = ctx.createOscillator(); AU.lfo.type = 'square'; AU.lfo.frequency.value = 12; var lfoG = ctx.createGain(); lfoG.gain.value = .35; AU.lfo.connect(lfoG); lfoG.connect(am.gain);
    [AU.o1, AU.o2, AU.o3, AU.lfo].forEach(function (o) { o.start(); });
    AU.rpm = 0; AU.lastRev = 0;
    var noise = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate), d = noise.getChannelData(0); for (var k = 0; k < d.length; k++) d[k] = Math.random() * 2 - 1; AU.noise = noise;
    return ctx;
  }
  function auMuted(s) { return !AU.on || (s && s.muted); }
  function auEngine(s, speed, moving, dt, visible) {
    if (!AU.ctx) return;
    if (!isFinite(speed)) speed = 0; if (!isFinite(AU.rpm)) AU.rpm = 0;   // một giá trị lỗi không được làm đứng hình cả sân (lỗi ném ra trước lệnh vẽ)
    var t = AU.ctx.currentTime, run = (s.state === 'running' || s.state === 'countdown') && visible && !auMuted(s);
    var want = !run ? 0 : Math.min(1, .12 + speed / 11 * .7 + Math.min(moving, 8) * .03);
    AU.rpm += (want - AU.rpm) * Math.min(1, dt * (want > AU.rpm ? 3 : 1.3));
    var f = 38 + AU.rpm * 120;
    AU.o1.frequency.setTargetAtTime(f, t, .05); AU.o2.frequency.setTargetAtTime(f / 2, t, .05); AU.o3.frequency.setTargetAtTime(f * 1.01 + 1.5, t, .05);
    AU.lp.frequency.setTargetAtTime(320 + AU.rpm * 1500, t, .08); AU.lfo.frequency.setTargetAtTime(9 + AU.rpm * 30, t, .08);
    AU.out.gain.setTargetAtTime(run ? .05 + AU.rpm * .09 : 0, t, run ? .15 : .25);
  }
  function auRev() {   // rồ ga khi một xe vượt chướng ngại
    if (!AU.ctx || AU.ctx.state !== 'running') return; var ctx = AU.ctx, t = ctx.currentTime;
    if (t - AU.lastRev < .18) return; AU.lastRev = t;
    var o = ctx.createOscillator(), g = ctx.createGain(), lp = ctx.createBiquadFilter(); o.type = 'sawtooth'; lp.type = 'lowpass'; lp.frequency.value = 1400;
    o.frequency.setValueAtTime(70, t); o.frequency.exponentialRampToValueAtTime(230, t + .35); o.frequency.exponentialRampToValueAtTime(150, t + .7);
    g.gain.setValueAtTime(.0001, t); g.gain.exponentialRampToValueAtTime(.09, t + .05); g.gain.exponentialRampToValueAtTime(.0001, t + .75);
    o.connect(lp); lp.connect(g); g.connect(ctx.destination); o.start(t); o.stop(t + .8);
  }
  function auSkid() {  // phanh rít + va chạm khi trả lời sai
    if (!AU.ctx || AU.ctx.state !== 'running') return; var ctx = AU.ctx, t = ctx.currentTime;
    var n = ctx.createBufferSource(), bp = ctx.createBiquadFilter(), g = ctx.createGain(); n.buffer = AU.noise;
    bp.type = 'bandpass'; bp.Q.value = 9; bp.frequency.setValueAtTime(2600, t); bp.frequency.exponentialRampToValueAtTime(1100, t + .7);
    g.gain.setValueAtTime(.0001, t); g.gain.exponentialRampToValueAtTime(.12, t + .04); g.gain.exponentialRampToValueAtTime(.0001, t + .8);
    n.connect(bp); bp.connect(g); g.connect(ctx.destination); n.start(t); n.stop(t + .85);
    var o = ctx.createOscillator(), og = ctx.createGain(); o.type = 'sine'; o.frequency.setValueAtTime(120, t + .55); o.frequency.exponentialRampToValueAtTime(40, t + .8);
    og.gain.setValueAtTime(.0001, t + .55); og.gain.exponentialRampToValueAtTime(.18, t + .57); og.gain.exponentialRampToValueAtTime(.0001, t + .85);
    o.connect(og); og.connect(ctx.destination); o.start(t + .55); o.stop(t + .9);
  }
  function auHorn() {  // còi xe khi về đích
    if (!AU.ctx || AU.ctx.state !== 'running') return; var ctx = AU.ctx, t = ctx.currentTime;
    [0, .38].forEach(function (d) {
      [440, 554].forEach(function (f) {
        var o = ctx.createOscillator(), g = ctx.createGain(), lp = ctx.createBiquadFilter(); o.type = 'square'; o.frequency.value = f; lp.type = 'lowpass'; lp.frequency.value = 1800;
        g.gain.setValueAtTime(.0001, t + d); g.gain.exponentialRampToValueAtTime(.05, t + d + .02); g.gain.setValueAtTime(.05, t + d + .26); g.gain.exponentialRampToValueAtTime(.0001, t + d + .32);
        o.connect(lp); lp.connect(g); g.connect(ctx.destination); o.start(t + d); o.stop(t + d + .34);
      });
    });
  }
  function auEvents(c, l, s) {
    var muted = auMuted(s) || s.state !== 'running';
    if (c.pp !== undefined && !muted) {
      if (l.done && !c.pd) auHorn();
      else if ((l.pos || 0) > c.pp) auRev();
      if (l.penalty && !c.pn) auSkid();
    }
    c.pp = l.pos || 0; c.pd = !!l.done; c.pn = !!l.penalty;
  }
  function engine(on) {
    if (on === undefined) return AU.on;
    AU.on = !!on; try { localStorage.setItem('race_engine', AU.on ? 'on' : 'off'); } catch (e) {}
    if (AU.on) auInit(); return AU.on;
  }
  function unlock() { if (AU.on) auInit(); }


  // ---------------------------------------------------------------- NHẠC NỀN ĐUA XE (tổng hợp bằng Web Audio, lặp liên tục, không cần file mp3)
  // Nhịp 140 BPM: trống (kick, clap, hi-hat), bass chạy móc, giai điệu arpeggio; chặng cuối (có xe sắp về đích) nhạc nhanh, dồn dập hơn.
  // Dùng cả ở dạng 2D và 3D: RaceMusic.start() / stop() / on(true|false) / intensity(0|1)
  var MU = { on: (function () { try { return localStorage.getItem('race_music') !== 'off'; } catch (e) { return true; } })(), playing: false, step: 0, hot: 0 };
  var CHORDS = [[57, 60, 64], [53, 57, 60], [48, 52, 55], [55, 59, 62]];   // Am – F – C – G (số MIDI)
  function hz(m) { return 440 * Math.pow(2, (m - 69) / 12); }
  function muNode() {
    var ctx = auInit(); if (!ctx) return null;
    if (!MU.out) { MU.out = ctx.createGain(); MU.out.gain.value = 0; MU.out.connect(ctx.destination); }
    return ctx;
  }
  function muKick(t) { var c = AU.ctx, o = c.createOscillator(), g = c.createGain(); o.frequency.setValueAtTime(150, t); o.frequency.exponentialRampToValueAtTime(42, t + .22); g.gain.setValueAtTime(.9, t); g.gain.exponentialRampToValueAtTime(.001, t + .26); o.connect(g); g.connect(MU.out); o.start(t); o.stop(t + .28); }
  function muNoise(t, len, freq, vol, type) {
    var c = AU.ctx, n = c.createBufferSource(), f = c.createBiquadFilter(), g = c.createGain(); n.buffer = AU.noise; f.type = type || 'highpass'; f.frequency.value = freq;
    g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(.001, t + len); n.connect(f); f.connect(g); g.connect(MU.out); n.start(t, Math.random() * .5); n.stop(t + len + .02);
  }
  function muTone(t, f, len, type, vol, cut) {
    var c = AU.ctx, o = c.createOscillator(), g = c.createGain(), lp = c.createBiquadFilter(); o.type = type; o.frequency.value = f; lp.type = 'lowpass'; lp.frequency.value = cut || 2400;
    g.gain.setValueAtTime(.0001, t); g.gain.exponentialRampToValueAtTime(vol, t + .01); g.gain.exponentialRampToValueAtTime(.0001, t + len); o.connect(lp); lp.connect(g); g.connect(MU.out); o.start(t); o.stop(t + len + .02);
  }
  function muStep(t, i) {
    var bar = Math.floor(i / 16) % 4, k = i % 16, ch = CHORDS[bar], hot = MU.hot;
    if (k % 4 === 0) muKick(t);
    if (hot && k % 4 === 2) muKick(t);
    if (k === 4 || k === 12) muNoise(t, .16, 1500, .5, 'bandpass');
    if (k % 2 === 1 || hot) muNoise(t, .04, 7500, k % 4 === 2 ? .22 : .12);
    if (k % 2 === 0) muTone(t, hz(ch[0] - 24 + (k % 4 === 2 ? 12 : 0)), .2, 'sawtooth', .28, 700);       // bass móc
    var lead = hot || bar % 2 === 1 || (Math.floor(i / 64) % 2 === 1);
    if (lead) muTone(t, hz(ch[[0, 1, 2, 1][k % 4]] + 12 + (k >= 8 ? 12 : 0)), .12, 'square', .07, 3000);  // arpeggio
    if (k === 0) muTone(t, hz(ch[2] + 12), .9, 'triangle', .05, 1800);                                      // nốt đệm dài
  }
  function muTick() {
    if (!MU.playing || !AU.ctx) return;
    var c = AU.ctx, spb = 60 / (MU.hot ? 154 : 140) / 4;
    while (MU.next < c.currentTime + .15) { muStep(MU.next, MU.step); MU.step++; MU.next += spb; }
  }
  function musicStart() {
    if (!MU.on || MU.playing) return;
    var c = muNode(); if (!c) return;
    MU.playing = true; MU.step = 0; MU.next = c.currentTime + .08;
    MU.out.gain.cancelScheduledValues(c.currentTime); MU.out.gain.setTargetAtTime(.32, c.currentTime, .3);
    MU.timer = setInterval(muTick, 25); muTick();
  }
  function musicStop() {
    if (!MU.playing) return; MU.playing = false; clearInterval(MU.timer);
    if (MU.out && AU.ctx) MU.out.gain.setTargetAtTime(0, AU.ctx.currentTime, .15);
  }
  window.RaceMusic = {
    start: musicStart, stop: musicStop, playing: function () { return MU.playing; },
    intensity: function (v) { MU.hot = v ? 1 : 0; },
    on: function (v) { if (v === undefined) return MU.on; MU.on = !!v; try { localStorage.setItem('race_music', MU.on ? 'on' : 'off'); } catch (e) {} if (!MU.on) musicStop(); return MU.on; }
  };

  // ---------------------------------------------------------------- xe từng học sinh
  function syncCars(lanes, focusId) {
    var seen = {};
    lanes.forEach(function (l, i) {
      seen[l.id] = 1;
      var c = R.cars[l.id];
      if (!c || c.key !== l.car) {
        if (c) { R.scene.remove(c.obj); disposeTree(c.obj); }
        var obj = makeCar(l.car, l.color); obj.position.set(laneX(i), 0, -3);
        var lab = sprite(labelTex(l.name, l.color, i + 1), 6.4, 1.6); obj.add(lab); lab.position.set(0, 3.4, 0);
        var ico = sprite(emojiTex('❓'), 1.3, 1.3); ico.visible = false; obj.add(ico); ico.position.set(0, 5.2, 0);
        R.scene.add(obj);
        c = R.cars[l.id] = { obj: obj, key: l.car, z: c ? c.z : -3, lab: lab, ico: ico, labKey: '', smoke: [] };
      }
      c.lane = i;
      // tự chơi (2 làn sát nhau): nhãn xe Máy nâng cao, nhỏ hơn để không đè nhãn ⭐ của em
      var phu = !!focusId && l.id !== focusId; if (c.labPhu !== phu) { c.labPhu = phu; c.lab.position.y = phu ? 6.8 : 3.4; c.lab.scale.set(phu ? 5.4 : 6.4, phu ? 1.35 : 1.6, 1); }
      var lk = l.name + '|' + l.rank;
      if (c.labKey !== lk) { c.labKey = lk; c.lab.material.map.dispose(); c.lab.material.map = labelTex(l.name, l.color, l.rank || i + 1); c.lab.material.needsUpdate = true; }
      c.data = l;
    });
    Object.keys(R.cars).forEach(function (id) { if (!seen[id]) { R.scene.remove(R.cars[id].obj); disposeTree(R.cars[id].obj); delete R.cars[id]; } });
  }

  function frame() {
    if (!R) return;
    R.raf = requestAnimationFrame(frame);
    if (!R.el.offsetParent) { auEngine({ state: 'idle' }, 0, 0, .05, false); return; }   // tab đang ẩn: không vẽ, tắt máy
    var now = performance.now(), dt = Math.min(.05, (now - (R.last || now)) / 1000); R.last = now;
    var s = R.snapshot() || { state: 'idle', total: 0, lanes: [] };
    var total = s.total || R.preview || 10, n = s.lanes.length;
    if (n !== R.n || total !== R.total) { buildWorld(n, total); Object.keys(R.cars).forEach(function (id) { R.cars[id].obj.position.x = 0; }); }
    syncCars(s.lanes, s.focusId);
    var lead = -3, sumZ = 0, cnt = 0, t = now / 1000, speed = 0, moving = 0;
    Object.keys(R.cars).forEach(function (id) {
      var c = R.cars[id], l = c.data, o = c.obj, tz = targetZ(l, s.state), dz;
      // đang chạy sau câu đúng: đi đều từ chướng ngại cũ tới chướng ngại mới đúng bằng thời gian chạy (đúng liên tiếp chạy lâu hơn)
      var since = Date.now() - (l.passAt || 0), driving = s.state === 'running' && l.driveMs > 0 && l.pos > 0 && since < l.driveMs;
      if (driving) {
        var f = since / l.driveMs, e = f < .5 ? 2 * f * f : 1 - Math.pow(-2 * f + 2, 2) / 2, from = coneZ(l.pos - 1) - 4.5;
        dz = from + (tz - from) * e - c.z; if (dz < 0) dz = 0; c.z += dz;
      } else { dz = (tz - c.z) * Math.min(1, dt * 1.7); if (Math.abs(tz - c.z) < .01) dz = tz - c.z; c.z += dz; }
      c.turbo = driving && l.streak >= 2;
      o.position.z = c.z; o.position.x += (laneX(c.lane) - o.position.x) * Math.min(1, dt * 4);
      var spin = dz / c.obj.userData.radius; c.obj.userData.wheels.forEach(function (w) { w.rotation.x += spin; });
      var body = o.userData.body;
      if (l.penalty) { body.rotation.y = Math.sin(t * 22) * .28; body.position.y = Math.abs(Math.sin(t * 15)) * .12; puff(c, o, dt); }
      else if (l.done) { body.rotation.y *= .9; body.position.y = Math.abs(Math.sin(t * 4 + c.lane)) * .25; }
      else { body.rotation.y *= .85; body.position.y = Math.abs(dz) > .02 ? Math.sin(t * 30) * .03 : 0; }
      var e = s.state === 'idle' ? '' : c.turbo ? '🔥' : l.done ? '🏁' : l.penalty ? '💥' : l.asking ? '❓' : '';
      if (c.turbo) puffFire(c, o, dt);
      c.ico.visible = !!e; if (e && c.ico.material.map !== emojiTex(e)) { c.ico.material.map = emojiTex(e); c.ico.material.needsUpdate = true; }
      c.ico.position.y = 5.2 + Math.sin(t * 4) * .15;
      // nón đã vượt chuyển xám
      if (R.cones) for (var q = 0; q < R.total; q++) {
        var idx = q * R.n + c.lane, passed = q < (l.pos || 0) && s.state !== 'idle';
        if (R.coneState[idx] !== passed) { R.coneState[idx] = passed; R.cones.setColorAt(idx, new T.Color(passed ? 0x9ca3af : 0xf97316)); R.cones.instanceColor.needsUpdate = true; }
      }
      c.smoke = c.smoke.filter(function (p) { p.life -= dt; p.mesh.position.y += dt * 1.2; p.mesh.scale.multiplyScalar(1 + dt * .9); p.mesh.material.opacity = Math.max(0, p.life); if (p.life <= 0) { R.scene.remove(p.mesh); p.mesh.material.dispose(); } return p.life > 0; });
      var v = Math.abs(dz) / Math.max(dt, .001); speed = Math.max(speed, v); if (v > 1) moving++; auEvents(c, l, s);
      lead = Math.max(lead, c.z); sumZ += c.z; cnt++;
    });
    if (s.focusId && R.cars[s.focusId]) { lead = R.cars[s.focusId].z; sumZ = lead * Math.max(cnt, 1); cnt = Math.max(cnt, 1); }   // camera bám xe được chỉ định
    auEngine(s, speed, moving, dt, true);
    moveCamera(lead, cnt ? sumZ / cnt : -3, dt);
    // băng rôn nằm giữa camera và xe (xe của em khi tự chơi, xe xa nhất trên màn chiếu GV) thì tạm ẩn – ít làn, camera thấp, băng rôn che kín thân xe
    var xa = s.focusId && R.cars[s.focusId] ? R.cars[s.focusId].z : lead;
    if (R.banners) R.banners.forEach(function (b) { var cz = R.camera.position.z; b.visible = !(cnt && cz < b.position.z && b.position.z < xa + 2.5); });
    var r0 = performance.now(); R.renderer.render(R.scene, R.camera); R.ms = R.ms * .9 + (performance.now() - r0) * .1;
  }
  function puff(c, o, dt) {
    c.puffT = (c.puffT || 0) - dt; if (c.puffT > 0) return; c.puffT = .12;
    var m = sprite(emojiTex('💨'), .9, .9); m.material.opacity = .9; m.position.set(o.position.x + (Math.random() - .5), .6, o.position.z - 1.8); R.scene.add(m); c.smoke.push({ mesh: m, life: .9 });
  }
  function puffFire(c, o, dt) {   // lửa phụt sau xe khi tăng tốc
    c.fireT = (c.fireT || 0) - dt; if (c.fireT > 0) return; c.fireT = .07;
    var m = sprite(emojiTex('🔥'), .8, .8); m.material.opacity = .95; m.position.set(o.position.x + (Math.random() - .5) * .4, .5, o.position.z - 2); R.scene.add(m); c.smoke.push({ mesh: m, life: .5 });
  }
  function moveCamera(lead, avg, dt) {
    var W = R.roadW, cam = R.camera, p = new T.Vector3(), look = new T.Vector3(), mode = CAMS[R.cam];
    var focus = Math.max(-3, Math.min(R.L + 8, lead * .5 + avg * .5));
    if (mode === 'follow') { p.set(0, Math.max(10.5, W * .42), focus - Math.max(13, W * .55)); look.set(0, 0, focus + 10); }
    else if (mode === 'tv') { p.set(W / 2 + Math.max(10, W * .35), Math.max(6, W * .18), focus - 8); look.set(0, 0, focus + 6); }
    else { p.set(W * .5 + 6, Math.max(R.L * .34, W * .8) + 8, -10); look.set(0, 0, R.L * .42); }
    var k = Math.min(1, dt * 2.2); cam.position.lerp(p, k); R.look.lerp(look, k); cam.lookAt(R.look);
  }

  function resize() {
    if (!R) return; var w = R.el.clientWidth || 800, h = R.el.clientHeight || 450;
    R.renderer.setSize(w, h, false); R.camera.aspect = w / h; R.camera.updateProjectionMatrix();
  }

  function mount(el, snapshot, opts) {
    if (!supported()) return Promise.reject(new Error('Máy này chưa hỗ trợ đồ hoạ 3D (WebGL).'));
    return loadThree().then(function (THREE) {
      T = THREE; if (T.ColorManagement) T.ColorManagement.legacyMode = false;
      if (R && R.el === el) { R.snapshot = snapshot; if (!R.raf) frame(); return R; }
      stop();
      var renderer = new T.WebGLRenderer({ antialias: true }); renderer.setPixelRatio(Math.min(1.5, window.devicePixelRatio || 1));
      renderer.shadowMap.enabled = true; renderer.shadowMap.type = T.PCFSoftShadowMap; if (T.sRGBEncoding) renderer.outputEncoding = T.sRGBEncoding;
      renderer.domElement.style.cssText = 'width:100%;height:100%;display:block';
      el.innerHTML = ''; el.appendChild(renderer.domElement);
      var scene = new T.Scene(); scene.background = new T.Color(0x9bd7ff); scene.fog = new T.Fog(0x9bd7ff, 120, 420);
      var camera = new T.PerspectiveCamera(50, 16 / 9, .5, 1200);
      scene.add(new T.HemisphereLight(0xffffff, 0x4d7c0f, .75));
      var sun = new T.DirectionalLight(0xffffff, .95); sun.castShadow = true; sun.shadow.mapSize.set(2048, 2048); scene.add(sun); scene.add(sun.target);
      R = { el: el, renderer: renderer, scene: scene, camera: camera, sun: sun, cars: {}, snapshot: snapshot, look: new T.Vector3(0, 0, 10), cam: 0, ms: 0, n: -1, total: -1, preview: (opts && opts.preview) || 10 };
      camera.position.set(0, 12, -18);
      R.ro = new ResizeObserver(resize); R.ro.observe(el); resize();
      frame();
      return R;
    });
  }
  function stop() {
    if (!R) return; cancelAnimationFrame(R.raf); if (R.ro) R.ro.disconnect(); if (AU.out) AU.out.gain.value = 0;
    disposeTree(R.scene); R.renderer.dispose(); if (R.renderer.domElement.parentNode) R.renderer.domElement.remove(); R = null;
  }
  function camera() { if (!R) return CAM_NAME.follow; R.cam = (R.cam + 1) % CAMS.length; return CAM_NAME[CAMS[R.cam]]; }
  function preview(n) { if (R) R.preview = n || 10; }

  document.addEventListener('pointerdown', function () { if (R && AU.on) auInit(); }, { passive: true });
  // dùng cho điện thoại HS (phone3d.js): nạp thư viện, dựng xe 3D đúng loại xe đã chọn
  function lib() { return loadThree().then(function (TH) { T = TH; if (T.ColorManagement) T.ColorManagement.legacyMode = false; return T; }); }
  window.Race3D = { lib: lib, buildCar: function (k, c) { return makeCar(k, c); }, audio: function () { return AU.ctx ? { state: AU.ctx.state, rpm: Math.round(AU.rpm * 100) / 100, gain: Math.round(AU.out.gain.value * 1000) / 1000 } : null; }, engine: engine, unlock: unlock, mount: mount, stop: stop, camera: camera, supported: supported, preview: preview, renderMs: function () { return R ? Math.round(R.ms * 10) / 10 : 0; }, calls: function () { return R ? R.renderer.info.render.calls : 0; }, camName: function () { return R ? CAM_NAME[CAMS[R.cam]] : CAM_NAME.follow; } };
})();
