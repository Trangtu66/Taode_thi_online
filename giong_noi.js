// GIỌNG NÓI TIẾNG VIỆT cho trò chơi (GV yêu cầu 25/11/2026: "bổ sung giọng nói tiếng Việt sau khi học sinh chọn đáp án").
// Các câu nói thu sẵn (giọng vi-VN-HoaiMyNeural) ở am_thanh/giong/<mã>.mp3 – tạo bằng am_thanh/giong/tao_giong.py.
// GiongNoi.noi('dung1')            – nói một câu (ngắt câu đang nói)
// GiongNoi.noi(['da_B', 'lop_bom_go']) – nói nối tiếp nhiều câu
// GiongNoi.bat(true|false)          – bật/tắt (trang tự lưu lựa chọn); GiongNoi.dangBat()
// Khi đang nói, nhạc nền (GameAudio, TugAudio, RaceMusic) nhỏ lại để nghe rõ lời.
(function () {
  'use strict';
  var THU_MUC = 'am_thanh/giong/', BAN = '?v=20261125a';
  var lay = function (k) { try { return localStorage.getItem(k); } catch (e) { return null; } };
  var ghi = function (k, v) { try { localStorage.setItem(k, v); } catch (e) {} };
  var BAT = lay('giong_noi') !== 'tat', hang = [], dang = null, kho = {}, hen = null;

  function tep(ma) { if (!kho[ma]) { var a = new Audio(THU_MUC + ma + '.mp3' + BAN); a.preload = 'auto'; kho[ma] = a; } return kho[ma]; }
  function nhoNhac(nho) {   // hạ nhạc nền khi đang nói
    try {
      document.querySelectorAll('audio[data-nhac-nen]').forEach(function (a) { a.volume = nho ? .25 : 1; });
      if (window.GameAudio && GameAudio.amLuong) GameAudio.amLuong(nho ? .35 : 1);
    } catch (e) {}
  }
  function phatTiep() {
    clearTimeout(hen);
    if (!hang.length) { dang = null; nhoNhac(false); return; }
    var ma = hang.shift(), a = tep(ma);
    dang = a; nhoNhac(true);
    try { a.currentTime = 0; } catch (e) {}
    a.onended = phatTiep; a.onerror = phatTiep;
    var p = a.play(); if (p && p.catch) p.catch(function () { phatTiep(); });
    hen = setTimeout(phatTiep, 6000);   // phòng khi tệp lỗi, không báo kết thúc
  }
  function dung() { hang = []; clearTimeout(hen); if (dang) { try { dang.pause(); } catch (e) {} } dang = null; nhoNhac(false); }

  window.GiongNoi = {
    noi: function (ma) {
      if (!BAT || !ma) return;
      var ds = Array.isArray(ma) ? ma.filter(Boolean) : [ma]; if (!ds.length) return;
      dung(); hang = ds.slice(); phatTiep();
    },
    them: function (ma) { if (!BAT || !ma) return; hang.push(ma); if (!dang) phatTiep(); },   // nói sau câu đang nói
    dung: dung,
    bat: function (on) { BAT = !!on; ghi('giong_noi', BAT ? 'bat' : 'tat'); if (!BAT) dung(); },
    dangBat: function () { return BAT; },
    napTruoc: function (ds) { (ds || []).forEach(tep); }   // tải sẵn để nói ngay, không trễ
  };
})();
