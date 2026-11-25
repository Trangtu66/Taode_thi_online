// BỘ DÙNG CHUNG cho các màn chiếu 3D trò chơi (Rung chuông vàng, Thi đấu theo nhịp độ):
// G3D: nạp Three.js, chữ trên ảnh, nhân vật học sinh low-poly (áo cổ trắng, không khăn quàng), khởi tạo cảnh.
// GameAudio: tiếng hiệu ứng (chuông, trống dồn, hò reo, vút, kèn buồn…) + nhạc nền tổng hợp (Web Audio, không cần file mp3).
(function () {
  'use strict';
  var THREE_URL = 'https://cdn.jsdelivr.net/npm/three@0.149.0/build/three.min.js';
  var T = null, MAT = {};
  // Kiểm tra WebGL MỘT lần rồi nhớ kết quả: mỗi lần tạo canvas thử là thêm một ngữ cảnh WebGL; gọi lặp lại (vài lần/giây)
  // làm trình duyệt vượt giới hạn và huỷ ngữ cảnh cũ nhất – chính là sân 3D đang chạy → sân tắt rồi hiện (sửa 23/11/2026).
  var WEBGL = null;
  function coWebGL() {
    if (WEBGL === null) { try { var c = document.createElement('canvas'), g = c.getContext('webgl') || c.getContext('experimental-webgl'); WEBGL = !!(window.WebGLRenderingContext && g); var x = g && g.getExtension('WEBGL_lose_context'); if (x) x.loseContext(); } catch (e) { WEBGL = false; } }
    return WEBGL;
  }
  var G = window.G3D = {
    supported: function () { return coWebGL(); },
    load: function () {
      if (window.THREE) { T = window.THREE; if (T.ColorManagement) T.ColorManagement.legacyMode = false; return Promise.resolve(T); }
      return new Promise(function (ok, fail) {
        var s = document.createElement('script'); s.src = THREE_URL;
        s.onload = function () { T = window.THREE; if (T.ColorManagement) T.ColorManagement.legacyMode = false; ok(T); };
        s.onerror = function () { fail(new Error('Không tải được thư viện 3D (kiểm tra mạng).')); }; document.head.appendChild(s);
      });
    },
    tex: function (w, h, draw) { var c = document.createElement('canvas'); c.width = w; c.height = h; draw(c.getContext('2d'), w, h); var t = new T.CanvasTexture(c); if (T.sRGBEncoding) t.encoding = T.sRGBEncoding; t.anisotropy = 4; return t; },
    rr: function (g, x, y, w, h, r) { g.beginPath(); g.moveTo(x + r, y); g.arcTo(x + w, y, x + w, y + h, r); g.arcTo(x + w, y + h, x, y + h, r); g.arcTo(x, y + h, x, y, r); g.arcTo(x, y, x + w, y, r); g.closePath(); },
    sprite: function (t, w, h) { var m = new T.Sprite(new T.SpriteMaterial({ map: t, transparent: true, depthWrite: false })); m.scale.set(w, h, 1); return m; },
    setSprite: function (sp, t) { if (sp.material.map) sp.material.map.dispose(); sp.material.map = t; sp.material.needsUpdate = true; },
    label: function (text, col, sub) {
      return G.tex(512, sub ? 160 : 112, function (g, w, h) {
        g.fillStyle = 'rgba(15,23,42,.84)'; G.rr(g, 4, 6, w - 8, h - 12, 36); g.fill(); g.fillStyle = col || '#6366f1'; g.fillRect(20, 26, 14, h - 52);
        g.fillStyle = '#fff'; g.font = '800 46px Arial'; g.textBaseline = 'middle'; var t = String(text); while (g.measureText(t).width > w - 70 && t.length > 2) t = t.slice(0, -2); if (t !== String(text)) t += '…';
        g.fillText(t, 50, sub ? 56 : h / 2 + 2); if (sub) { g.font = '700 38px Arial'; g.fillStyle = '#fde68a'; g.fillText(sub, 50, 116); }
      });
    },
    banner: function (text, bg, fg) {
      return G.tex(1024, 160, function (g, w, h) { g.fillStyle = bg || '#4f46e5'; G.rr(g, 6, 6, w - 12, h - 12, 40); g.fill(); g.strokeStyle = '#fff'; g.lineWidth = 8; g.stroke();
        g.fillStyle = fg || '#fff'; var fs = 76; do { g.font = '900 ' + fs + 'px Arial'; fs -= 4; } while (g.measureText(text).width > w - 60 && fs > 30); g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(text, w / 2, h / 2 + 4); });
    },
    mat: function (k, c, opt) { if (!MAT[k]) MAT[k] = new T.MeshStandardMaterial(Object.assign({ color: c, roughness: .6 }, opt || {})); return MAT[k]; },
    merge: function (geos) {
      var pos = [], nor = [];
      geos.forEach(function (g) { var ng = g.index ? g.toNonIndexed() : g; Array.prototype.push.apply(pos, ng.attributes.position.array); Array.prototype.push.apply(nor, ng.attributes.normal.array); g.dispose(); if (ng !== g) ng.dispose(); });
      var o = new T.BufferGeometry(); o.setAttribute('position', new T.Float32BufferAttribute(pos, 3)); o.setAttribute('normal', new T.Float32BufferAttribute(nor, 3)); return o;
    },
    // Học sinh: pose 'stand' | 'sit' (ngồi trên sàn, cầm bảng trắng); shirt: màu áo; girl: tóc buộc đuôi ngựa, mặc váy.
    // Dựng lại 25/11/2026 (GV: hình cũ khối vuông quá thô): thân, tay chân bo tròn; mặt có mắt, lông mày, mũi, miệng cười, má hồng, tai;
    // áo màu đội tay ngắn, cổ áo trắng hai vạt, KHÔNG khăn quàng. Giữ nguyên kích thước, vị trí bàn tay (±.33, .78) và userData {body, parts}
    // để mọi sân đang dùng (Rung chuông vàng, Nhịp độ, điện thoại, Gỡ bom, Đấu trường, Thoát hiểm) không phải sửa.
    kid: function (shirt, girl, pose) {
      var g = new T.Group(), body = new T.Group(); g.add(body);
      var P = { shirt: [], pants: [], skin: [], hair: [], white: [], shoe: [], board: [], eye: [], mouth: [], cheek: [] };
      var V = function (x, y, z) { return new T.Vector3(x, y, z); }, UP = V(0, 1, 0);
      var sit = pose === 'sit', b0 = sit ? -.62 : 0;   // ngồi: phần trên hạ thấp .62
      // ống bo tròn nối hai điểm a → b (bán kính r), quả cầu, nửa cầu (tóc)
      var cap = function (k, a, b, r, sx, sz) {
        var d = b.clone().sub(a), L = d.length(), geo = new T.CapsuleGeometry(r, Math.max(.001, L), 6, 16);
        if (sx || sz) geo.scale(sx || 1, 1, sz || 1);
        geo.applyMatrix4(new T.Matrix4().compose(a.clone().add(b).multiplyScalar(.5), new T.Quaternion().setFromUnitVectors(UP, d.normalize()), V(1, 1, 1)));
        P[k].push(geo);
      };
      var cau = function (k, x, y, z, r, sx, sy, sz, w, ph0, phL, th0, thL) {
        var geo = new T.SphereGeometry(r, w || 20, Math.round((w || 20) * .7), ph0 || 0, phL || Math.PI * 2, th0 || 0, thL || Math.PI);
        geo.scale(sx || 1, sy || 1, sz || 1); geo.translate(x, y, z); P[k].push(geo); return geo;
      };
      // ---------- chân, giày
      if (sit) {   // ngồi xếp bằng trên sàn
        [-1, 1].forEach(function (s) {
          cap('pants', V(s * .13, .16, -.02), V(s * .28, .13, .36), .1);
          cap('pants', V(s * .28, .12, .36), V(-s * .06, .1, .52), .085);
          cau('shoe', -s * .12, .09, .55, .075, 1.1, .8, 1.5);
        });
        cap('pants', V(-.16, .2, 0), V(.16, .2, 0), .15, 1, 1.1);
      } else {
        [-1, 1].forEach(function (s) {
          cap('pants', V(s * .115, .93, 0), V(s * .12, .5, .01), .095);
          cap('pants', V(s * .12, .5, .01), V(s * .12, .14, 0), .082);
          cau('shoe', s * .12, .085, .05, .085, 1, .72, 1.75, 18, 0, Math.PI * 2, 0, Math.PI * .62);
          P.white.push(new T.CylinderGeometry(.088, .09, .035, 18).scale(1, 1, 1.75).translate(s * .12, .02, .05));   // đế giày trắng
        });
        cap('pants', V(-.13, .95, 0), V(.13, .95, 0), .14, 1, 1.05);   // hông
        if (girl) P.pants.push(new T.CylinderGeometry(.21, .3, .36, 24).translate(0, .82, 0));   // váy
      }
      // ---------- thân áo, cổ áo trắng, cổ
      cap('shirt', V(0, 1.02 + b0, 0), V(0, 1.4 + b0, 0), .2, 1.05, .72);
      P.white.push(new T.TorusGeometry(.085, .03, 8, 22).rotateX(Math.PI / 2).translate(0, 1.56 + b0, 0));
      [-1, 1].forEach(function (s) {   // hai vạt cổ áo
        var v = new T.ConeGeometry(.075, .15, 3); v.rotateX(Math.PI / 2 + .25); v.rotateZ(s * .5); v.translate(s * .065, 1.52 + b0, .11); P.white.push(v);
      });
      cap('skin', V(0, 1.5 + b0, 0), V(0, 1.64 + b0, 0), .058);
      cau('shirt', 0, 1.47 + b0, .14, .025, 1, 1, .5, 8);   // khuy áo
      cau('shirt', 0, 1.3 + b0, .145, .025, 1, 1, .5, 8);
      // ---------- tay: ống tay áo ngắn màu áo, cẳng tay và bàn tay
      if (sit) {   // hai tay đưa ra trước cầm bảng
        [-1, 1].forEach(function (s) {
          cap('shirt', V(s * .25, 1.44 + b0, 0), V(s * .3, 1.24 + b0, .12), .075);
          cap('skin', V(s * .3, 1.24 + b0, .12), V(s * .3, 1.12 + b0, .42), .055);
          cau('skin', s * .3, 1.12 + b0, .46, .06);
        });
        P.board.push(new T.BoxGeometry(.7, .5, .04).translate(0, 1.15 + b0, .5));
      } else {
        [-1, 1].forEach(function (s) {
          cap('shirt', V(s * .25, 1.45, 0), V(s * .3, 1.22, 0), .078);
          cap('skin', V(s * .3, 1.18, 0), V(s * .315, 1.02, .01), .056);
          cap('skin', V(s * .315, 1.02, .01), V(s * .33, .84, .02), .05);
          cau('skin', s * .33, .78, .02, .062, .9, 1.15, .85);
        });
      }
      // ---------- đầu: mặt nhìn về +z
      var hy = 1.84 + b0, R = .24;
      cau('skin', 0, hy, 0, R, 1, 1.07, .97, 28);
      [-1, 1].forEach(function (s) {
        cau('skin', s * .235, hy - .01, -.01, .055, .45, 1, .75, 12);   // tai
        cau('eye', s * .085, hy + .01, .215, .034, 1, 1.25, .6, 14);     // mắt
        cau('white', s * .075, hy + .028, .233, .011, 1, 1, .6, 8);      // đốm sáng trong mắt
        cap('hair', V(s * .045, hy + .085, .222), V(s * .125, hy + .078, .205), .012);   // lông mày
        cau('cheek', s * .14, hy - .055, .19, .04, 1, .7, .45, 12);      // má hồng
      });
      cau('skin', 0, hy - .03, .238, .03, 1, .9, .9, 12);               // mũi
      P.mouth.push(new T.TorusGeometry(.045, .011, 6, 16, Math.PI).rotateZ(Math.PI).translate(0, hy - .075, .222));   // miệng cười
      // tóc: chỏm ôm đầu + mái + phía sau; nữ buộc đuôi ngựa
      cau('hair', 0, hy + .015, -.005, R + .018, 1, 1.07, .99, 28, 0, Math.PI * 2, 0, Math.PI * .37);   // chỏm tóc (mái ngắn, lộ trán và mắt)
      cau('hair', 0, hy + .01, -.012, R + .02, 1, 1.07, 1, 28, Math.PI, Math.PI, 0, Math.PI * (girl ? .78 : .62));   // nửa sau (phi π → 2π là phía −z)
      if (girl) {
        cau('hair', 0, hy + .06, -.25, .07, 1, 1, 1, 12);
        cap('hair', V(0, hy + .02, -.29), V(0, hy - .3, -.3), .07, 1, .8);
        cau('shirt', 0, hy + .06, -.23, .045, 1.2, 1, 1, 10);   // dây buộc tóc màu áo
      }
      var M = { shirt: G.mat('shirt' + shirt, shirt, { roughness: .75 }), pants: G.mat('pants', 0x1e293b, { roughness: .8 }), skin: G.mat('skin', 0xf2c6a0, { roughness: .55 }),
        hair: G.mat('hair', 0x1f1308, { roughness: .45 }), white: G.mat('white', 0xffffff, { roughness: .6 }), shoe: G.mat('shoe', 0x111827, { roughness: .4 }),
        board: G.mat('board', 0xffffff, { roughness: .4 }), eye: G.mat('eyeKid', 0x111827, { roughness: .2 }), mouth: G.mat('mouthKid', 0x9f1239), cheek: G.mat('cheekKid', 0xf9a8a8, { roughness: .9 }) };
      g.userData = { body: body, parts: {} };
      Object.keys(P).forEach(function (k) { if (P[k].length) { var m = new T.Mesh(G.merge(P[k]), M[k]); m.castShadow = k !== 'eye' && k !== 'mouth' && k !== 'cheek'; body.add(m); g.userData.parts[k] = m; } });
      return g;
    },
    // Khởi tạo renderer + cảnh + camera trong một khung; tự co giãn theo khung (kể cả toàn màn hình)
    scene: function (el, bg, fog) {
      var r = new T.WebGLRenderer({ antialias: true }); r.setPixelRatio(Math.min(1.5, window.devicePixelRatio || 1));
      r.shadowMap.enabled = true; r.shadowMap.type = T.PCFSoftShadowMap; if (T.sRGBEncoding) r.outputEncoding = T.sRGBEncoding;
      r.domElement.style.cssText = 'width:100%;height:100%;display:block'; el.innerHTML = ''; el.appendChild(r.domElement);
      var sc = new T.Scene(); sc.background = new T.Color(bg); if (fog) sc.fog = new T.Fog(bg, fog[0], fog[1]);
      var cam = new T.PerspectiveCamera(45, 16 / 9, .3, 500);
      var o = { renderer: r, scene: sc, camera: cam, el: el };
      var rs = function () { var w = el.clientWidth || 800, h = el.clientHeight || 400; r.setSize(w, h, false); cam.aspect = w / h; cam.updateProjectionMatrix(); };
      o.ro = new ResizeObserver(rs); o.ro.observe(el); rs();
      return o;
    },
    T: function () { return T; }
  };

  // ---------------------------------------------------------------- ÂM THANH CHUNG
  var A = { playing: null, step: 0 };
  function ctx() {
    if (A.ctx) { if (A.ctx.state === 'suspended') A.ctx.resume(); return A.ctx; }
    var C = window.AudioContext || window.webkitAudioContext; if (!C) return null;
    A.ctx = new C(); A.fx = A.ctx.createGain(); A.fx.gain.value = .9; A.fx.connect(A.ctx.destination);
    A.mu = A.ctx.createGain(); A.mu.gain.value = 0; A.mu.connect(A.ctx.destination);
    var b = A.ctx.createBuffer(1, A.ctx.sampleRate * 2, A.ctx.sampleRate), d = b.getChannelData(0); for (var i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1; A.noise = b;
    return A.ctx;
  }
  function ok() { return ctx() && A.ctx.state === 'running'; }
  function noise(t, len, type, f, q, vol, out, to) {
    var c = A.ctx, n = c.createBufferSource(), fl = c.createBiquadFilter(), g = c.createGain(); n.buffer = A.noise; fl.type = type; fl.frequency.setValueAtTime(f, t); fl.Q.value = q;
    if (to) fl.frequency.exponentialRampToValueAtTime(to, t + len);
    g.gain.setValueAtTime(.0001, t); g.gain.exponentialRampToValueAtTime(vol, t + Math.min(.2, len * .3)); g.gain.exponentialRampToValueAtTime(.0001, t + len);
    n.connect(fl); fl.connect(g); g.connect(out || A.fx); n.start(t, Math.random()); n.stop(t + len + .05);
  }
  function tone(t, f, len, type, vol, out, f2, cut, att) {
    var c = A.ctx, o = c.createOscillator(), g = c.createGain(), lp = c.createBiquadFilter(); o.type = type; o.frequency.setValueAtTime(f, t); if (f2) o.frequency.exponentialRampToValueAtTime(f2, t + len);
    lp.type = 'lowpass'; lp.frequency.value = cut || 3500; g.gain.setValueAtTime(.0001, t); g.gain.exponentialRampToValueAtTime(vol, t + (att || .012)); g.gain.exponentialRampToValueAtTime(.0001, t + len);
    o.connect(lp); lp.connect(g); g.connect(out || A.fx); o.start(t); o.stop(t + len + .03);
  }
  function bell(t, f, vol) {   // chuông đồng: các bội âm không điều hoà, ngân dài
    [[1, 1], [2.76, .5], [5.4, .3], [8.9, .16], [.5, .4]].forEach(function (h) { tone(t, f * h[0], 3.2 / Math.sqrt(h[0] + .2), 'sine', (vol || .25) * h[1], null, null, 9000, .004); });
  }
  var SFX = {
    bell: function (n) { if (!ok()) return; var t = A.ctx.currentTime; for (var i = 0; i < (n || 1); i++) bell(t + i * .45, 523, .22); },
    gong: function () { if (!ok()) return; var t = A.ctx.currentTime; bell(t, 196, .35); noise(t, 1.4, 'bandpass', 300, 1, .12); },
    drumroll: function (len) { if (!ok()) return; var t = A.ctx.currentTime, n = Math.round((len || 1.2) / .05); for (var i = 0; i < n; i++) noise(t + i * .05, .08, 'bandpass', 900, 1.5, .08 + .12 * i / n); tone(t + n * .05, 70, .5, 'sine', .6, null, 40); noise(t + n * .05, .8, 'highpass', 5000, .5, .2); },
    cheer: function (len, vol) { if (!ok()) return; var t = A.ctx.currentTime; noise(t, len || 2, 'bandpass', 1100, .6, vol || .35); noise(t + .05, (len || 2) * .9, 'bandpass', 2400, .8, (vol || .35) * .6); },
    clap: function (len) { if (!ok()) return; var t = A.ctx.currentTime; for (var i = 0; i < (len || 2) * 14; i++) noise(t + i * .07 + Math.random() * .04, .05, 'bandpass', 1800 + Math.random() * 900, 2, .18); },
    whoosh: function () { if (!ok()) return; noise(A.ctx.currentTime, .5, 'bandpass', 400, 2, .3, null, 2500); },
    sad: function () { if (!ok()) return; var t = A.ctx.currentTime; [[392, .0], [370, .35], [349, .7], [330, 1.05]].forEach(function (n, i) { tone(t + n[1], n[0], i === 3 ? .9 : .32, 'sawtooth', .12, null, i === 3 ? 300 : null, 1400, .03); }); },
    correct: function () { if (!ok()) return; var t = A.ctx.currentTime; tone(t, 784, .14, 'triangle', .2); tone(t + .1, 1175, .3, 'triangle', .2); },
    pop: function () { if (!ok()) return; var t = A.ctx.currentTime; tone(t, 520, .12, 'sine', .25, null, 900); },
    win: function () { if (!ok()) return; SFX.drumroll(1); setTimeout(function () { SFX.cheer(3, .4); SFX.clap(3); var t = A.ctx.currentTime; [523, 659, 784, 1047].forEach(function (f, i) { tone(t + i * .14, f, .5, 'triangle', .2); }); }, 1100); }
  };
  // Nhạc nền: 'show' (sân khấu truyền hình, 120 BPM), 'quiz' (vui nhộn, 132 BPM), 'tension' (hồi hộp khi đang làm bài, 100 BPM)
  var SONG = {
    show: { bpm: 120, ch: [[60, 64, 67], [57, 60, 64], [65, 69, 72], [67, 71, 74]] },
    quiz: { bpm: 132, ch: [[62, 66, 69], [59, 62, 66], [67, 71, 74], [69, 73, 76]] },
    tension: { bpm: 100, ch: [[57, 60, 64], [57, 60, 64], [58, 62, 65], [56, 59, 64]] }
  };
  function hz(m) { return 440 * Math.pow(2, (m - 69) / 12); }
  function step(t, i) {
    var S = SONG[A.playing], bar = Math.floor(i / 16) % 4, k = i % 16, ch = S.ch[bar], o = A.mu;
    if (A.playing === 'tension') {
      if (k % 4 === 0) tone(t, 55, .3, 'sine', .45, o, 40);
      if (k % 2 === 0) tone(t, hz(ch[0] - 12), .18, 'sawtooth', .1, o, null, 500);
      if (k === 8) noise(t, .2, 'highpass', 6000, .5, .06, o);
      if (k % 4 === 2) tone(t, hz(ch[(k / 2) % 3] + 12), .25, 'sine', .05, o);
      return;
    }
    if (k % 4 === 0) tone(t, 140, .22, 'sine', .6, o, 45);                                  // kick
    if (k === 4 || k === 12) noise(t, .15, 'bandpass', 1600, .8, .3, o);                    // clap
    if (k % 2 === 1) noise(t, .04, 'highpass', 7500, .7, .07, o);                           // hi-hat
    if (k % 2 === 0) tone(t, hz(ch[0] - 24 + (k % 8 === 6 ? 7 : 0)), .2, 'square', .1, o, null, 600);   // bass
    if (A.playing === 'quiz' ? k % 2 === 0 : k % 4 === 0) tone(t, hz(ch[[0, 1, 2, 1][(k / 2) % 4 | 0]] + 12), .16, 'triangle', .1, o);   // arpeggio
    if (k === 0) ch.forEach(function (m) { tone(t, hz(m), 1.8, 'sine', .035, o, null, 2000, .2); });                                   // hợp âm đệm
  }
  function tick() { if (!A.playing) return; var spb = 60 / SONG[A.playing].bpm / 4; while (A.next < A.ctx.currentTime + .15) { step(A.next, A.step); A.step++; A.next += spb; } }
  window.GameAudio = {
    unlock: function () { ctx(); }, sfx: SFX,
    music: function (style) {   // style: 'show' | 'quiz' | 'tension' | null (tắt)
      if (style === A.playing) return;
      if (!style) { A.playing = null; clearInterval(A.timer); if (A.mu) A.mu.gain.setTargetAtTime(0, A.ctx.currentTime, .2); return; }
      if (!ctx()) return;
      var was = A.playing; A.playing = style; if (!was) { A.step = 0; A.next = A.ctx.currentTime + .08; }
      A.mu.gain.cancelScheduledValues(A.ctx.currentTime); A.mu.gain.setTargetAtTime((style === 'tension' ? .35 : .28) * (A.heSo || 1), A.ctx.currentTime, .3);
      clearInterval(A.timer); A.timer = setInterval(tick, 25); tick();
    },
    playing: function () { return A.playing; },
    // hệ số âm lượng nhạc nền (giong_noi.js hạ còn .35 khi đang đọc lời, xong trả về 1)
    amLuong: function (k) { A.heSo = k; if (A.mu && A.playing) A.mu.gain.setTargetAtTime((A.playing === 'tension' ? .35 : .28) * k, A.ctx.currentTime, .15); }
  };
  document.addEventListener('pointerdown', function () { if (A.ctx && A.ctx.state === 'suspended') A.ctx.resume(); }, { passive: true });
})();
