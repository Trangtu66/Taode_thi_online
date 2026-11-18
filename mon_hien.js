// Môn hiển thị trên các trang web (18/11/2026): chỉ Toán, Ngữ văn; các môn khác tạm ẩn.
// Bật lại một môn: thêm tên môn vào MON_HIEN. Hiện lại tất cả: MON_HIEN = null.
// Nạp NGAY SAU cau_hinh.js / de_cuong.js. Trang làm bài (lam_bai.html, *_cc_*.html) không lọc nên mã QR, link cũ vẫn làm bài được.
window.MON_HIEN = ["Toán", "Ngữ văn"];
(function () {
  var TAT_CA = ["Toán", "Ngữ văn", "Tiếng Anh", "Vật lí", "Hóa học", "Sinh học", "Lịch sử", "Địa lí",
                "Giáo dục kinh tế và pháp luật", "GDKT&PL", "Công nghệ", "Tin học"];
  var MA_AN = { "Tiếng Anh": "anh", "Vật lí": "ly", "Hóa học": "hoa", "Sinh học": "sinh", "Lịch sử": "su", "Địa lí": "dia",
                "Giáo dục kinh tế và pháp luật": "gdkt", "GDKT&PL": "gdkt", "Công nghệ": "cn", "Tin học": "tin" };
  var MON_CODE = { "toan": "Toán", "ngu_van": "Ngữ văn", "van": "Ngữ văn", "tieng_anh": "Tiếng Anh", "vat_li": "Vật lí", "hoa_hoc": "Hóa học",
                   "sinh_hoc": "Sinh học", "lich_su": "Lịch sử", "dia_li": "Địa lí", "gdkt_pl": "GDKT&PL", "cong_nghe": "Công nghệ", "tin_hoc": "Tin học" };
  function an() { return window.MON_HIEN ? TAT_CA.filter(function (m) { return window.MON_HIEN.indexOf(m) < 0 && !(m === "GDKT&PL" && window.MON_HIEN.indexOf("Giáo dục kinh tế và pháp luật") >= 0); }) : []; }
  // true nếu bài / đề cương / mã bài thuộc môn đang hiện
  window.monHien = function (x) {
    var ds = an(); if (!ds.length || x == null) return true;
    if (typeof x === "string") {                                    // mã bài trên Google Sheet, vd "Củng cố – Hóa học 10 · Bài 1: …"
      return !ds.some(function (m) { return x.indexOf(m + " 1") >= 0; });
    }
    if (x.mon && MON_CODE[x.mon]) return ds.indexOf(MON_CODE[x.mon]) < 0;
    var nhom = String(x.nhom || x.tenMon || "");
    if (nhom) return !ds.some(function (m) { return nhom.indexOf(m) === 0; });
    var link = String(x.link || "");
    if (link) return !ds.some(function (m) { return MA_AN[m] && link.indexOf(MA_AN[m] + "_") === 0; });
    return window.monHien(String(x.ma || x.quizId || x.title || ""));
  };
  if (Array.isArray(window.DANH_SACH_BAI)) window.DANH_SACH_BAI = window.DANH_SACH_BAI.filter(window.monHien);
  if (Array.isArray(window.DE_CUONG)) window.DE_CUONG = window.DE_CUONG.filter(window.monHien);
  if (window.MON_HIEN && window.MON_DEMO) {
    Object.keys(window.MON_DEMO).forEach(function (k) { if (!window.monHien({ mon: k })) delete window.MON_DEMO[k]; });
  }
})();
