// Cap nhat kho hoc lieu tinh khiet Bai 1 SGK Ket noi tri thuc
const danh_sach_hoc_lieu = [
  {ten: 'Bài 1: Mệnh đề toán học', mon: 'Toán', khoi: 'Lớp 10', loai: 'Kế hoạch bài dạy', file: 'mon/toan/KHBD_Toan10_Bai1.docx', nguon: 'SGK Kết nối tri thức', cap_nhat: '11/10/2026'},
  {ten: 'Bài 1: Khái niệm về cân bằng hóa học', mon: 'Hóa học', khoi: 'Lớp 11', loai: 'Kế hoạch bài dạy', file: 'mon/hoa_hoc/KHBD_Hoa11_Bai1.docx', nguon: 'SGK Kết nối tri thức', cap_nhat: '11/10/2026'},
  {ten: 'Bài 1: Vị trí địa lí và phạm vi lãnh thổ', mon: 'Địa lí', khoi: 'Lớp 12', loai: 'Kế hoạch bài dạy', file: 'mon/dia_li/KHBD_DIALY12_Bai1_VitriDiaLiVaPhamViLanhTho_T1-2.docx', nguon: 'SGK Kết nối tri thức', cap_nhat: '11/10/2026'},
  {ten: 'Bài 1: Hiện thực lịch sử và nhận thức lịch sử', mon: 'Lịch sử', khoi: 'Lớp 10', loai: 'Kế hoạch bài dạy', file: 'mon/lich_su/KHBD_Su10_Bai1.docx', nguon: 'SGK Kết nối tri thức', cap_nhat: '11/10/2026'},
  {ten: 'Bài 1: Cấu trúc của chất. Sự chuyển thể', mon: 'Vật lí', khoi: 'Lớp 12', loai: 'Kế hoạch bài dạy', file: 'mon/vat_li/KHBD_Ly12_Bai1.docx', nguon: 'SGK Kết nối tri thức', cap_nhat: '11/10/2026'},
  {ten: 'Unit 1: Life Stories - Getting Started', mon: 'Tiếng Anh', khoi: 'Lớp 12', loai: 'Kế hoạch bài dạy', file: 'mon/tieng_anh/KHBD_Anh12_Unit1.docx', nguon: 'SGK Kết nối tri thức', cap_nhat: '11/10/2026'},
  {ten: 'Bài 1: Khái quát về công nghệ', mon: 'Công nghệ', khoi: 'Lớp 10', loai: 'Kế hoạch bài dạy', file: 'mon/cong_nghe/KHBD_CongNghe10_Bai1.docx', nguon: 'SGK Kết nối tri thức', cap_nhat: '11/10/2026'},
  {ten: 'Bài 1: Khái quát về thế giới sinh vật', mon: 'Sinh học', khoi: 'Lớp 10', loai: 'Kế hoạch bài dạy', file: 'mon/sinh_hoc/KHBD_Sinh10_Bai1.docx', nguon: 'SGK Kết nối tri thức', cap_nhat: '11/10/2026'}
];

try { window.danh_sach_hoc_lieu = danh_sach_hoc_lieu; } catch(e) {}
try { window.danhSachHocLieu = danh_sach_hoc_lieu; } catch(e) {}
try { window.hoc_lieu = danh_sach_hoc_lieu; } catch(e) {}
try { window.KHO_HOC_LIEU = danh_sach_hoc_lieu; } catch(e) {}
try { window.data = danh_sach_hoc_lieu; } catch(e) {}
try { window.MON = danh_sach_hoc_lieu; } catch(e) {}
if (typeof module !== 'undefined') module.exports = danh_sach_hoc_lieu;