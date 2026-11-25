// GIỌNG NÓI TIẾNG VIỆT cho trò chơi (GV yêu cầu 25/11/2026: "bổ sung giọng nói tiếng Việt sau khi học sinh chọn đáp án").
// Các câu nói thu sẵn (giọng vi-VN-HoaiMyNeural) ở am_thanh/giong/<mã>.mp3 – tạo bằng am_thanh/giong/tao_giong.py.
// GiongNoi.noi('dung1')                – nói một câu (ngắt câu đang nói)
// GiongNoi.noi(['da_B', 'lop_bom_go'])  – nói nối tiếp nhiều câu
// GiongNoi.them('bell_rung')            – nói sau câu đang nói
// GiongNoi.bat(true|false), GiongNoi.dangBat(), GiongNoi.napTruoc([mã…])
// Dùng MỘT loa (thẻ audio) cho mọi câu: điện thoại (nhất là iPhone) chỉ cho phát âm thanh sau khi người dùng chạm màn hình;
// loa được "mở khoá" ở lần chạm đầu tiên, sau đó phát được cả những câu đến từ máy GV (kết quả Rung chuông vàng, Kéo co…).
// Khi đang nói, nhạc nền (GameAudio) nhỏ lại để nghe rõ lời.
(function () {
  'use strict';
  var THU_MUC = 'am_thanh/giong/', BAN = '?v=20261125a';
  var lay = function (k) { try { return localStorage.getItem(k); } catch (e) { return null; } };
  var ghi = function (k, v) { try { localStorage.setItem(k, v); } catch (e) {} };
  var BAT = lay('giong_noi') !== 'tat', hang = [], dangNoi = false, hen = null, kho = {};
  var loa = new Audio(); loa.preload = 'auto';
  var url = function (ma) { return THU_MUC + ma + '.mp3' + BAN; };

  function nhoNhac(nho) { try { if (window.GameAudio && GameAudio.amLuong) GameAudio.amLuong(nho ? .35 : 1); } catch (e) {} }
  function phatTiep() {
    clearTimeout(hen);
    if (!hang.length) { dangNoi = false; nhoNhac(false); return; }
    var ma = hang.shift(); dangNoi = true; nhoNhac(true);
    loa.muted = false; loa.src = url(ma);
    var p = loa.play(); if (p && p.catch) p.catch(function () { phatTiep(); });
    hen = setTimeout(phatTiep, 7000);   // phòng khi tệp lỗi, không báo kết thúc
  }
  loa.onended = phatTiep; loa.onerror = function () { if (dangNoi) phatTiep(); };
  function dung() { hang = []; clearTimeout(hen); try { loa.pause(); } catch (e) {} dangNoi = false; nhoNhac(false); }

  // mở khoá loa ở lần chạm/bấm đầu tiên (phát câu ngắn ở chế độ tắt tiếng rồi dừng)
  var daMo = false;
  function moKhoa() {
    if (daMo || dangNoi) return; daMo = true;
    try { loa.muted = true; loa.src = url('dung'); var p = loa.play(); if (p && p.then) p.then(function () { if (!dangNoi) { loa.pause(); } loa.muted = false; }).catch(function () { daMo = false; loa.muted = false; }); } catch (e) { daMo = false; }
  }
  ['pointerdown', 'touchend', 'keydown'].forEach(function (ev) { document.addEventListener(ev, moKhoa, { passive: true, capture: true }); });

  window.GiongNoi = {
    noi: function (ma) {
      if (!BAT || !ma) return;
      var ds = (Array.isArray(ma) ? ma : [ma]).filter(Boolean); if (!ds.length) return;
      dung(); hang = ds.slice(); phatTiep();
    },
    them: function (ma) { if (!BAT || !ma) return; hang.push(ma); if (!dangNoi) phatTiep(); },
    dung: dung,
    bat: function (on) { BAT = !!on; ghi('giong_noi', BAT ? 'bat' : 'tat'); if (!BAT) dung(); },
    dangBat: function () { return BAT; },
    napTruoc: function (ds) { (ds || []).forEach(function (ma) { if (!kho[ma]) { var a = new Audio(); a.preload = 'auto'; a.src = url(ma); kho[ma] = a; } }); }   // tải sẵn vào bộ nhớ đệm trình duyệt
  };
})();
