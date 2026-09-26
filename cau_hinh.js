// ====== CẤU HÌNH NHẬN KẾT QUẢ BÀI LÀM ======
// Địa chỉ Ứng dụng web Apps Script (Google Sheet nhận kết quả của GV Trương Tử Trang).
// Để trống "" thì trang vẫn chấm điểm bình thường nhưng không gửi kết quả về.
window.KQ_API = "https://script.google.com/macros/s/AKfycbz-yf2unZA961vY5ACGaedBrZh7BkROcrI489Vz209eOfyIQufdPtwGRtQZkpuvDVFklw/exec";

// (Tùy chọn) Link mở Google Sheet kết quả — dán link trình duyệt của bảng tính vào đây để có nút "Mở Google Sheet".
window.KQ_SHEET = "";

// Danh sách bài hiện thành nút trên trang quản lý (quan_ly.html), chia theo khối 10, 11, 12.
// "khoi": 10, 11 hoặc 12; "ma" phải trùng đúng tên bài (meta.title) trong đề; "link" là file bài làm trên GitHub.
// Mỗi khi có bài củng cố mới, thêm một dòng vào cuối danh sách.
window.DANH_SACH_BAI = [
  { khoi: 10, nhom: "Toán 10", ten: "Bài 1. Mệnh đề",                         ma: "Củng cố – Bài 1. Mệnh đề (Toán 10)", link: "cc_bai1_t10.html" },
  { khoi: 10, nhom: "Toán 10", ten: "Bài 2. Tập hợp và các phép toán",        ma: "Củng cố – Bài 2. Tập hợp và các phép toán trên tập hợp (Toán 10)", link: "cc_bai2_t10.html" },
  { khoi: 10, nhom: "Toán 10", ten: "Bài tập cuối chương I",                  ma: "Củng cố – Bài tập cuối chương I (Toán 10)", link: "cc_chuong1_t10.html" },
  { khoi: 10, nhom: "Toán 10", ten: "Bài 3. Bất phương trình bậc nhất hai ẩn", ma: "Củng cố – Bài 3. Bất phương trình bậc nhất hai ẩn (Toán 10)", link: "cc_bai3_t10.html" },
  { khoi: 11, nhom: "Toán 11", ten: "Bài 1. Giá trị lượng giác của góc lượng giác", ma: "Củng cố – Bài 1. Giá trị lượng giác của góc lượng giác (Toán 11)", link: "cc_bai1_t11.html" },
  { khoi: 11, nhom: "Toán 11", ten: "Bài 2. Công thức lượng giác", ma: "Củng cố – Bài 2. Công thức lượng giác (Toán 11)", link: "cc_bai2_t11.html" },
  { khoi: 11, nhom: "Toán 11", ten: "Bài 3. Hàm số lượng giác", ma: "Củng cố – Bài 3. Hàm số lượng giác (Toán 11)", link: "cc_bai3_t11.html" },
  { khoi: 12, nhom: "Toán 12", ten: "Bài 1. Tính đơn điệu và cực trị của hàm số", ma: "Củng cố – Bài 1. Tính đơn điệu và cực trị của hàm số (Toán 12)", link: "cc_bai1_t12.html" },
  { khoi: 12, nhom: "Toán 12", ten: "Bài 2. Giá trị lớn nhất và giá trị nhỏ nhất của hàm số", ma: "Củng cố – Bài 2. Giá trị lớn nhất và giá trị nhỏ nhất của hàm số (Toán 12)", link: "cc_bai2_t12.html" },
  { khoi: 12, nhom: "Toán 12", ten: "Bài 3. Đường tiệm cận của đồ thị hàm số", ma: "Củng cố – Bài 3. Đường tiệm cận của đồ thị hàm số (Toán 12)", link: "cc_bai3_t12.html" },
  { khoi: 12, nhom: "Toán 12", ten: "Bài 4. Khảo sát sự biến thiên và vẽ đồ thị của hàm số", ma: "Củng cố – Bài 4. Khảo sát sự biến thiên và vẽ đồ thị của hàm số (Toán 12)", link: "cc_bai4_t12.html" },
  { khoi: 12, nhom: "Toán 12", ten: "Chuyên đề 1, Bài 1. Biến ngẫu nhiên rời rạc", ma: "Củng cố – Chuyên đề 1, Bài 1. Biến ngẫu nhiên rời rạc và các số đặc trưng (Toán 12)", link: "cc_cd1bai1_t12.html" }
  // Mỗi khi có bài củng cố mới, thêm một dòng { khoi: ..., nhom: ..., ten: ..., ma: ..., link: ... } (nhớ dấu phẩy ở dòng trước).
];
