// ====== CẤU HÌNH NHẬN KẾT QUẢ BÀI LÀM ======
// Địa chỉ Ứng dụng web Apps Script (Google Sheet nhận kết quả của GV Trương Tử Trang).
// Để trống "" thì trang vẫn chấm điểm bình thường nhưng không gửi kết quả về.
window.KQ_API = "https://script.google.com/macros/s/AKfycbz-yf2unZA961vY5ACGaedBrZh7BkROcrI489Vz209eOfyIQufdPtwGRtQZkpuvDVFklw/exec";

// CHẾ ĐỘ TRẢI NGHIỆM: true = trang Quản lý (quan_ly.html) và Kết quả (ket_qua.html) mở cho mọi người, không cần mã giáo viên;
// chỉ hiện dữ liệu công khai (họ tên, lớp, điểm, thời gian – giống Bảng xếp hạng). Đáp án từng câu, thống kê câu hỏi
// vẫn cần mã giáo viên. Khi muốn CHỐT LẠI (bắt buộc mã giáo viên), đổi true thành false.
window.CONG_KHAI_KET_QUA = true;

// MỞ ĐÁP ÁN KHI CHỮA BÀI: cách chính là trang Quản lý → "🔓 Mở / khoá đáp án" (cần mã GV, có hiệu lực ngay).
// Danh sách dưới đây chỉ là cách dự phòng: tên đề ghi ở đây luôn được mở ("*" = mở tất cả). Để trống = theo trang Quản lý.
window.MO_DAP_AN = [
];

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
  { khoi: 10, nhom: "Toán 10", ten: "Chuyên đề 1, Bài 1. Hệ phương trình bậc nhất ba ẩn", ma: "Củng cố – Chuyên đề 1, Bài 1. Hệ phương trình bậc nhất ba ẩn (Toán 10)", link: "cc_cd1bai1_t10.html" },
  { khoi: 10, nhom: "Toán 10", ten: "Bài 4. Hệ bất phương trình bậc nhất hai ẩn", ma: "Củng cố – Bài 4. Hệ bất phương trình bậc nhất hai ẩn (Toán 10)", link: "cc_bai4_t10.html" },
  { khoi: 10, nhom: "Toán 10", ten: "Bài tập cuối chương II", ma: "Củng cố – Bài tập cuối chương II (Toán 10)", link: "cc_chuong2_t10.html" },
  { khoi: 10, nhom: "Toán 10", ten: "Bài 5. Giá trị lượng giác của một góc từ 0° đến 180°", ma: "Củng cố – Bài 5. Giá trị lượng giác của một góc từ 0° đến 180° (Toán 10)", link: "cc_bai5_t10.html" },
  { khoi: 10, nhom: "Toán 10", ten: "Bài 6. Hệ thức lượng trong tam giác", ma: "Củng cố – Bài 6. Hệ thức lượng trong tam giác (Toán 10)", link: "cc_bai6_t10.html" },
  { khoi: 10, nhom: "Ngữ văn 10 · Củng cố đọc hiểu", ten: "Bài 1. Truyện về các vị thần sáng tạo thế giới (Thần Trụ Trời, Thần Sét, Thần Gió)", ma: "Củng cố – Ngữ văn 10 · Bài 1: Thần Trụ Trời, Thần Sét, Thần Gió", link: "van_cc_bai1_k10.html" },
  { khoi: 10, nhom: "Ngữ văn 10 · Ôn luyện tiếng Việt", ten: "Thực hành tiếng Việt: Sử dụng từ Hán Việt – nhận diện và sửa lỗi dùng từ", ma: "Ôn luyện tiếng Việt – Ngữ văn 10: Sử dụng từ Hán Việt", link: "van_tv_hanviet_k10.html" },
  { khoi: 10, nhom: "Hóa học 10 · Củng cố", ten: "Bài 1. Thành phần của nguyên tử", ma: "Củng cố – Hóa học 10 · Bài 1: Thành phần của nguyên tử", link: "hoa_cc_bai1_k10.html" },
  { khoi: 10, nhom: "Sinh học 10 · Củng cố", ten: "Bài 1. Giới thiệu khái quát môn Sinh học", ma: "Củng cố – Sinh học 10 · Bài 1: Giới thiệu khái quát môn Sinh học", link: "sinh_cc_bai1_k10.html" },
  { khoi: 10, nhom: "Lịch sử 10 · Củng cố", ten: "Bài 1. Hiện thực lịch sử và lịch sử được con người nhận thức", ma: "Củng cố – Lịch sử 10 · Bài 1: Hiện thực lịch sử và lịch sử được con người nhận thức", link: "su_cc_bai1_k10.html" },
  { khoi: 10, nhom: "Địa lí 10 · Củng cố", ten: "Bài 1. Môn Địa lí với định hướng nghề nghiệp", ma: "Củng cố – Địa lí 10 · Bài 1: Môn Địa lí với định hướng nghề nghiệp", link: "dia_cc_bai1_k10.html" },
  { khoi: 10, nhom: "Giáo dục kinh tế và pháp luật 10 · Củng cố", ten: "Bài 1. Các hoạt động kinh tế cơ bản trong đời sống xã hội", ma: "Củng cố – GDKT&PL 10 · Bài 1: Các hoạt động kinh tế cơ bản trong đời sống xã hội", link: "gdkt_cc_bai1_k10.html" },
  { khoi: 10, nhom: "Tiếng Anh 10 · Củng cố", ten: "Unit 1. Family life", ma: "Củng cố – Tiếng Anh 10 · Unit 1: Family life", link: "anh_cc_unit1_k10.html" },
  { khoi: 10, nhom: "Ngữ văn 10 · Củng cố đọc hiểu", ten: "Bài 2. Chùm thơ hai-cư Nhật Bản; Thu hứng (Đỗ Phủ)", ma: "Củng cố – Ngữ văn 10 · Bài 2: Chùm thơ hai-cư; Thu hứng (Đỗ Phủ)", link: "van_cc_bai2_k10.html" },
  { khoi: 10, nhom: "Ngữ văn 10 · Củng cố đọc hiểu", ten: "Bài 2. Mùa xuân chín (Hàn Mặc Tử); Bản hoà âm ngôn từ trong Tiếng thu", ma: "Củng cố – Ngữ văn 10 · Bài 2: Mùa xuân chín (Hàn Mặc Tử)", link: "van_cc_muaxuanchin_k10.html" },
  { khoi: 10, nhom: "Ngữ văn 10 · Củng cố đọc hiểu", ten: "Bài 3. Hiền tài là nguyên khí của quốc gia; Yêu và đồng cảm", ma: "Củng cố – Ngữ văn 10 · Bài 3: Hiền tài là nguyên khí của quốc gia; Yêu và đồng cảm", link: "van_cc_bai3_k10.html" },
  { khoi: 10, nhom: "Ngữ văn 10 · Củng cố đọc hiểu", ten: "Bài 3. Chữ bầu lên nhà thơ (Lê Đạt)", ma: "Củng cố – Ngữ văn 10 · Bài 3: Chữ bầu lên nhà thơ (Lê Đạt)", link: "van_cc_chubaulen_k10.html" },
  { khoi: 10, nhom: "Sinh học 10 · Củng cố", ten: "Bài 2. Phương pháp nghiên cứu và học tập môn Sinh học", ma: "Củng cố – Sinh học 10 · Bài 2: Phương pháp nghiên cứu và học tập môn Sinh học", link: "sinh_cc_bai2_k10.html" },
  { khoi: 10, nhom: "Sinh học 10 · Củng cố", ten: "Bài 3. Các cấp độ tổ chức của thế giới sống", ma: "Củng cố – Sinh học 10 · Bài 3: Các cấp độ tổ chức của thế giới sống", link: "sinh_cc_bai3_k10.html" },
  { khoi: 10, nhom: "Sinh học 10 · Củng cố", ten: "Bài 4. Các nguyên tố hoá học và nước", ma: "Củng cố – Sinh học 10 · Bài 4: Các nguyên tố hoá học và nước", link: "sinh_cc_bai4_k10.html" },
  { khoi: 11, nhom: "Toán 11", ten: "Bài 1. Giá trị lượng giác của góc lượng giác", ma: "Củng cố – Bài 1. Giá trị lượng giác của góc lượng giác (Toán 11)", link: "cc_bai1_t11.html" },
  { khoi: 11, nhom: "Toán 11", ten: "Bài 2. Công thức lượng giác", ma: "Củng cố – Bài 2. Công thức lượng giác (Toán 11)", link: "cc_bai2_t11.html" },
  { khoi: 11, nhom: "Toán 11", ten: "Bài 3. Hàm số lượng giác", ma: "Củng cố – Bài 3. Hàm số lượng giác (Toán 11)", link: "cc_bai3_t11.html" },
  { khoi: 11, nhom: "Toán 11", ten: "Bài 4. Phương trình lượng giác cơ bản", ma: "Củng cố – Bài 4. Phương trình lượng giác cơ bản (Toán 11)", link: "cc_bai4_t11.html" },
  { khoi: 11, nhom: "Toán 11", ten: "Bài tập cuối chương I", ma: "Củng cố – Bài tập cuối chương I (Toán 11)", link: "cc_chuong1_t11.html" },
  { khoi: 11, nhom: "Toán 11", ten: "Bài 5. Dãy số", ma: "Củng cố – Bài 5. Dãy số (Toán 11)", link: "cc_bai5_t11.html" },
  { khoi: 11, nhom: "Toán 11", ten: "Bài 6. Cấp số cộng", ma: "Củng cố – Bài 6. Cấp số cộng (Toán 11)", link: "cc_bai6_t11.html" },
  { khoi: 11, nhom: "Toán 11", ten: "Bài 7. Cấp số nhân", ma: "Củng cố – Bài 7. Cấp số nhân (Toán 11)", link: "cc_bai7_t11.html" },
  { khoi: 11, nhom: "Toán 11", ten: "Chuyên đề 1, Bài 1. Phép biến hình", ma: "Củng cố – Chuyên đề 1, Bài 1. Phép biến hình (Toán 11)", link: "cc_cd1bai1_t11.html" },
  { khoi: 11, nhom: "Toán 11", ten: "Chuyên đề 1, Bài 2. Phép tịnh tiến", ma: "Củng cố – Chuyên đề 1, Bài 2. Phép tịnh tiến (Toán 11)", link: "cc_cd1bai2_t11.html" },
  { khoi: 11, nhom: "Toán 11", ten: "Chuyên đề 1, Bài 3. Phép đối xứng trục", ma: "Củng cố – Chuyên đề 1, Bài 3. Phép đối xứng trục (Toán 11)", link: "cc_cd1bai3_t11.html" },
  { khoi: 11, nhom: "Toán 11", ten: "Chuyên đề 1, Bài 4. Phép quay và phép đối xứng tâm", ma: "Củng cố – Chuyên đề 1, Bài 4. Phép quay và phép đối xứng tâm (Toán 11)", link: "cc_cd1bai4_t11.html" },
  { khoi: 11, nhom: "Toán 11 · Luyện tập 3 dạng", ten: "Bài 5. Dãy số", ma: "Luyện tập – Bài 5. Dãy số (Toán 11)", link: "lt_bai5_t11.html" },
  { khoi: 11, nhom: "Toán 11 · Luyện tập 3 dạng", ten: "Bài 6. Cấp số cộng", ma: "Luyện tập – Bài 6. Cấp số cộng (Toán 11)", link: "lt_bai6_t11.html" },
  { khoi: 11, nhom: "Toán 11 · Luyện tập 3 dạng", ten: "Bài 7. Cấp số nhân", ma: "Luyện tập – Bài 7. Cấp số nhân (Toán 11)", link: "lt_bai7_t11.html" },
  { khoi: 11, nhom: "Toán 11 · Ôn tập chương", ten: "Chương I. Hàm số lượng giác và phương trình lượng giác", ma: "Ôn tập Chương I – Hàm số lượng giác và phương trình lượng giác (Toán 11)", link: "oc_chuong1_t11.html" },
  { khoi: 11, nhom: "Toán 11 · Ôn tập chương", ten: "Chương II. Dãy số. Cấp số cộng và cấp số nhân", ma: "Ôn tập Chương II – Dãy số. Cấp số cộng và cấp số nhân (Toán 11)", link: "oc_chuong2_t11.html" },
  { khoi: 11, nhom: "Toán 11 · Kiểm tra định kỳ", ten: "Giữa kỳ I (Bài 1 – Bài 9)", ma: "Đề ôn tập kiểm tra giữa kỳ I (Toán 11)", link: "dk_gk1_t11.html" },
  { khoi: 11, nhom: "Ngữ văn 11 · Củng cố đọc hiểu", ten: "Bài 1. Vợ nhặt (Kim Lân) – điểm nhìn trong truyện kể", ma: "Củng cố – Ngữ văn 11 · Bài 1: Vợ nhặt (Kim Lân)", link: "van_cc_bai1_k11.html" },
  { khoi: 11, nhom: "Ngữ văn 11 · Ôn luyện tiếng Việt", ten: "Thực hành tiếng Việt: Đặc điểm cơ bản của ngôn ngữ nói và ngôn ngữ viết", ma: "Ôn luyện tiếng Việt – Ngữ văn 11: Ngôn ngữ nói và ngôn ngữ viết", link: "van_tv_noiviet_k11.html" },
  { khoi: 11, nhom: "Ngữ văn 11 · Củng cố đọc hiểu", ten: "Bài 1. Chí Phèo (Nam Cao) – điểm nhìn, lời nửa trực tiếp", ma: "Củng cố – Ngữ văn 11 · Bài 1: Chí Phèo (Nam Cao)", link: "van_cc_chipheo_k11.html" },
  { khoi: 11, nhom: "Ngữ văn 11 · Củng cố đọc hiểu", ten: "Bài 2. Nhớ đồng (Tố Hữu) – cấu tứ và hình ảnh", ma: "Củng cố – Ngữ văn 11 · Bài 2: Nhớ đồng (Tố Hữu)", link: "van_cc_bai2_k11.html" },
  { khoi: 11, nhom: "Ngữ văn 11 · Củng cố đọc hiểu", ten: "Bài 2. Tràng giang (Huy Cận); Con đường mùa đông (Pu-skin)", ma: "Củng cố – Ngữ văn 11 · Bài 2: Tràng giang; Con đường mùa đông", link: "van_cc_trangian_k11.html" },
  { khoi: 11, nhom: "Ngữ văn 11 · Củng cố đọc hiểu", ten: "Bài 3. Cầu hiền chiếu (Ngô Thì Nhậm); Tôi có một ước mơ (M. L. Kinh)", ma: "Củng cố – Ngữ văn 11 · Bài 3: Cầu hiền chiếu; Tôi có một ước mơ", link: "van_cc_bai3_k11.html" },
  { khoi: 11, nhom: "Ngữ văn 11 · Củng cố đọc hiểu", ten: "Bài 3. Một thời đại trong thi ca (Hoài Thanh)", ma: "Củng cố – Ngữ văn 11 · Bài 3: Một thời đại trong thi ca (Hoài Thanh)", link: "van_cc_thoidaithica_k11.html" },
  { khoi: 11, nhom: "Sinh học 11 · Củng cố", ten: "Bài 1. Khái quát về trao đổi chất và chuyển hoá năng lượng", ma: "Củng cố – Sinh học 11 · Bài 1: Khái quát về trao đổi chất và chuyển hoá năng lượng", link: "sinh_cc_bai1_k11.html" },
  { khoi: 12, nhom: "Toán 12", ten: "Bài 1. Tính đơn điệu và cực trị của hàm số", ma: "Củng cố – Bài 1. Tính đơn điệu và cực trị của hàm số (Toán 12)", link: "cc_bai1_t12.html" },
  { khoi: 12, nhom: "Toán 12", ten: "Bài 2. Giá trị lớn nhất và giá trị nhỏ nhất của hàm số", ma: "Củng cố – Bài 2. Giá trị lớn nhất và giá trị nhỏ nhất của hàm số (Toán 12)", link: "cc_bai2_t12.html" },
  { khoi: 12, nhom: "Toán 12", ten: "Bài 3. Đường tiệm cận của đồ thị hàm số", ma: "Củng cố – Bài 3. Đường tiệm cận của đồ thị hàm số (Toán 12)", link: "cc_bai3_t12.html" },
  { khoi: 12, nhom: "Toán 12", ten: "Bài 4. Khảo sát sự biến thiên và vẽ đồ thị của hàm số", ma: "Củng cố – Bài 4. Khảo sát sự biến thiên và vẽ đồ thị của hàm số (Toán 12)", link: "cc_bai4_t12.html" },
  { khoi: 12, nhom: "Toán 12 · Ôn thi tốt nghiệp", ten: "Đề thi chính thức TN THPT 2026 – mã 0101", ma: "Đề thi tốt nghiệp THPT 2026 – Môn Toán – Mã đề 0101 (làm thử)", link: "tn_2026_0101.html" },
  { khoi: 12, nhom: "Ngữ văn 12 · Củng cố đọc hiểu", ten: "Bài 1. Xuân Tóc Đỏ cứu quốc (Vũ Trọng Phụng) – nói mỉa, nghịch ngữ", ma: "Củng cố – Ngữ văn 12 · Bài 1: Xuân Tóc Đỏ cứu quốc (Vũ Trọng Phụng)", link: "van_cc_bai1_k12.html" },
  { khoi: 12, nhom: "Tiếng Anh 12 · Ôn thi tốt nghiệp", ten: "Đề thi tốt nghiệp THPT năm 2026 – Tiếng Anh – mã đề 1116 (có giải thích)", ma: "Đề thi TN THPT 2026 – Tiếng Anh – Mã đề 1116", link: "anh_tn2026_1116_k12.html" },
  { khoi: 12, nhom: "Tiếng Anh 12 · Ôn thi tốt nghiệp", ten: "Đề ôn thi tốt nghiệp THPT – Tiếng Anh – Đề số 1", ma: "Đề ôn thi TN THPT – Tiếng Anh – Đề số 1", link: "anh_ontn_so1_k12.html" },
  { khoi: 12, nhom: "Ngữ văn 12 · Củng cố đọc hiểu", ten: "Bài 1. Mùa lá rụng trong vườn (Ma Văn Kháng) – nhân vật, tâm lí, văn hoá gia đình", ma: "Củng cố – Ngữ văn 12 · Bài 1: Mùa lá rụng trong vườn (Ma Văn Kháng)", link: "van_cc_mualarung_k12.html" },
  { khoi: 12, nhom: "Ngữ văn 12 · Củng cố đọc hiểu", ten: "Bài 2. Cảm hoài (Đặng Dung); Tây Tiến (Quang Dũng)", ma: "Củng cố – Ngữ văn 12 · Bài 2: Cảm hoài; Tây Tiến", link: "van_cc_bai2_k12.html" },
  { khoi: 12, nhom: "Ngữ văn 12 · Củng cố đọc hiểu", ten: "Bài 2. Đàn ghi ta của Lor-ca (Thanh Thảo) – tượng trưng, siêu thực", ma: "Củng cố – Ngữ văn 12 · Bài 2: Đàn ghi ta của Lor-ca (Thanh Thảo)", link: "van_cc_danghita_k12.html" },
  { khoi: 12, nhom: "Ngữ văn 12 · Củng cố đọc hiểu", ten: "Bài 3. Nhìn về vốn văn hoá dân tộc; Năng lực sáng tạo", ma: "Củng cố – Ngữ văn 12 · Bài 3: Nhìn về vốn văn hoá dân tộc; Năng lực sáng tạo", link: "van_cc_bai3_k12.html" },
  { khoi: 12, nhom: "Ngữ văn 12 · Củng cố đọc hiểu", ten: "Bài 3. Mấy ý nghĩ về thơ (Nguyễn Đình Thi)", ma: "Củng cố – Ngữ văn 12 · Bài 3: Mấy ý nghĩ về thơ (Nguyễn Đình Thi)", link: "van_cc_mayynghivetho_k12.html" },
  { khoi: 12, nhom: "Sinh học 12 · Củng cố", ten: "Bài 1. DNA và cơ chế tái bản DNA", ma: "Củng cố – Sinh học 12 · Bài 1: DNA và cơ chế tái bản DNA", link: "sinh_cc_bai1_k12.html" },
  { khoi: 12, nhom: "Toán 12", ten: "Chuyên đề 1, Bài 1. Biến ngẫu nhiên rời rạc", ma: "Củng cố – Chuyên đề 1, Bài 1. Biến ngẫu nhiên rời rạc và các số đặc trưng (Toán 12)", link: "cc_cd1bai1_t12.html" }
  // Mỗi khi có bài củng cố mới, thêm một dòng { khoi: ..., nhom: ..., ten: ..., ma: ..., link: ... } (nhớ dấu phẩy ở dòng trước).
];
