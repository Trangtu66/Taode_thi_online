# Hệ thống luyện thi trực tuyến – Trường THPT

Trang web: <https://trangtu66.github.io/Taode_thi_online/> · Cổng toàn trường: <https://trangtu66.github.io/Taode_thi_online/luyen_thi.html>

Kho gồm hai phần: **trang web** (thư mục gốc) và **kho học liệu theo môn** (`mon/`).

## 1. Kho học liệu theo môn – `mon/<môn>/`

Môn nào cũng có đúng các ngăn như môn Toán:

```
mon/
├── toan/                 Môn Toán (Tổ Toán)
│   ├── khbd/             Kế hoạch bài dạy (Word)      lop10/ lop11/ lop12/
│   ├── slide/            Bài giảng PowerPoint           lop10/ lop11/ lop12/
│   ├── trac_nghiem/      Đề trực tuyến: nguồn JSON + đề Word có đáp án, lời giải   lop10/ lop11/ lop12/
│   └── ma_tran/          Ma trận, bản đặc tả đề luyện tập / kiểm tra
├── ngu_van/              Môn Ngữ văn (bản demo)
├── hoa_hoc/  sinh_hoc/  lich_su/  dia_li/  gdkt_pl/  tieng_anh/   (bản demo: bài củng cố lớp 10)
│   └── mỗi môn: khbd/  slide/  trac_nghiem/  ma_tran/
└── vat_li/               Môn Vật lí (đang xây dựng)
```

Mã môn dùng trong tên thư mục: `toan`, `ngu_van`, `vat_li`, `hoa_hoc`, `sinh_hoc`, `lich_su`, `dia_li`, `gdkt_pl`, `tin_hoc`, `cong_nghe`, `tieng_anh`.

Quy ước tên file: `KHBD_<MÔN><Khối>_<TênBài>_T<Tiết>.docx`, `Slide_<MÔN><Khối>_<TênBài>_T<Tiết>.pptx`
(ví dụ `KHBD_TOAN11_Bai7_T15-16.docx`, `Slide_TOAN11_Bai7_T15-16.pptx`).

## 2. Trang web – thư mục gốc (KHÔNG di chuyển)

Mã QR in trên slide, KHBD và các link đã gửi học sinh trỏ thẳng vào những file này, nên chúng phải nằm yên ở gốc:

| File | Vai trò |
|---|---|
| `index.html` | Trang chủ môn Toán (chuyển link `#e=` sang `lam_bai.html` – giữ nguyên đoạn này) |
| `luyen_thi.html` | Cổng luyện thi toàn trường: chọn môn |
| `luyen_tap.html` | Luyện tập Toán theo bài, chương, định kỳ, tốt nghiệp |
| `lam_bai.html` | Trang làm bài và chấm điểm (dùng chung mọi môn) |
| `quan_ly.html`, `ket_qua.html`, `xep_hang.html` | Quản lí bài, kết quả, xếp hạng (ô “Dữ liệu” xem học kỳ đã lưu trữ) |
| `tao_de.html` | Địa chỉ Trình soạn đề cho giáo viên (mở `lam_bai.html#tao`) |
| `admin.html` | Quản trị dữ liệu: xoá bộ nhớ đệm (mọi người); sao lưu .json, lưu trữ cuối học kỳ `KetQua → LichSu_…` (mã quản trị) |
| `hien_ma.js`, `bieu_tuong.js` | Nút hiện/ẩn mã GV; biểu tượng SVG dùng chung |
| `cau_hinh.js` | Danh sách bài + địa chỉ nhận kết quả |
| `de_luyen_tap.js`, `van_demo.js`, `mon_demo.js` | Danh mục đề hiển thị trên cổng |
| `cc_*.html` | Bài củng cố cuối tiết (Toán) – đích của mã QR |
| `lt_*`, `oc_*`, `dk_*`, `tn_*.html` | Đề luyện tập 3 dạng, ôn chương, định kỳ, tốt nghiệp (Toán) |
| `van_*.html` | Bài trực tuyến môn Ngữ văn |
| `hoa_*`, `sinh_*`, `su_*`, `dia_*`, `gdkt_*`, `anh_*.html` | Bài trực tuyến Hóa, Sinh, Sử, Địa, GDKT&PL, Tiếng Anh |
| `*.png`, `hinh_de/` | Ảnh minh hoạ trong đề (các trang làm bài đang dùng) |

Trang làm bài của môn mới đặt tên theo mẫu `<mã môn>_<loại>_<bài>_k<khối>.html`, ví dụ `ly_cc_bai1_k10.html`.

## 3. Không đưa lên kho

`NHAN_KET_QUA/` (mã giáo viên, mã Apps Script) và đề kiểm tra chính thức trước giờ thi.

---

## 4. Sơ đồ tư duy bài học

> Chuẩn màu: 🔵 tiêu đề gốc `#1E40AF` · nhánh tím `#7C3AED` · xanh lá `#065F46` · đỏ `#B91C1C` · cam `#B45309` · lá sáng `#EDE9FE / #D1FAE5 / #FEE2E2 / #FEF3C7`

---

## 🗺️ Sơ đồ tư duy tổng quan – Toán 10 Học kì I

```mermaid
%%{init: {"theme": "base", "htmlLabels": true, "flowchart": {"htmlLabels": true, "padding": 10, "curve": "basis"}, "themeVariables": {"fontSize": "15px"}}}%%
graph TD
    T10["🎯 TOÁN 10 –<br/>HỌC KÌ I<br/>Kết nối tri thức"]:::root
    T10 --> CH1["📘 Chương 1<br/>Mệnh đề – Tập<br/>hợp<br/>Bài 1–2 + BTCC1"]:::nhom1
    T10 --> CH2["📗 Chương 2<br/>Bất phương trình<br/>Bài 3–4 + BTCC2"]:::nhom2
    T10 --> CH3["📙 Chương 3<br/>Hệ thức lượng tam<br/>giác<br/>Bài 5–6 + BTCC3"]:::nhom3

    CH1 --> B1["Bài 1. Mệnh đề<br/>Mệnh đề, phủ định,<br/>kéo theo<br/>Tương đương, định lí"]:::bai
    CH1 --> B2["Bài 2. Tập hợp<br/>Tập con, giao, hợp,<br/>hiệu<br/>Tập số R và<br/>khoảng"]:::bai
    CH1 --> BT1["BT cuối Chương 1<br/>Luyện tập tổng hợp"]:::bt

    CH2 --> B3["Bài 3. BPT bậc<br/>nhất hai ẩn<br/>Miền nghiệm, đường thẳng<br/>biên<br/>Hệ BPT – miền<br/>nghiệm chung"]:::bai
    CH2 --> B4["STEM Bài 4. Hệ<br/>BPT<br/>Bài toán khẩu phần<br/>ăn<br/>Tìm max/min trên miền<br/>đa giác"]:::stem
    CH2 --> BT2["BT cuối Chương 2<br/>BPT + hệ BPT<br/>tổng hợp"]:::bt

    CH3 --> B5["Bài 5. Giá trị<br/>lượng giác<br/>góc 0°–180°<br/>sin, cos, tan, cot"]:::bai
    CH3 --> B6["Bài 6. Định lí<br/>sin & cos<br/>Diện tích, R ngoại<br/>tiếp<br/>r nội tiếp"]:::bai
    CH3 --> BT3["BT cuối Chương 3<br/>Hệ thức lượng tam<br/>giác<br/>Bài toán đo đạc<br/>thực tế"]:::bt

    classDef root fill:#002060,color:#FFFFFF,stroke:#000B1E,stroke-width:2px,font-weight:bold
    classDef n1 fill:#E2EFDA,color:#000000,stroke:#375623,stroke-width:3px,font-weight:bold
    classDef n2 fill:#FFF2CC,color:#000000,stroke:#BF8F00,stroke-width:3px,font-weight:bold
    classDef n3 fill:#E2EFDA,color:#000000,stroke:#375623,stroke-width:3px,font-weight:bold
    classDef n4 fill:#FFF2CC,color:#000000,stroke:#BF8F00,stroke-width:3px,font-weight:bold
    classDef n5 fill:#E2EFDA,color:#000000,stroke:#375623,stroke-width:3px,font-weight:bold
    classDef l1 fill:#EDF5E8,color:#000000,stroke:#548235
    classDef l2 fill:#FFF8E1,color:#000000,stroke:#BF8F00
    classDef l3 fill:#E3EEF9,color:#000000,stroke:#2F5597
    classDef l4 fill:#F3E8F7,color:#000000,stroke:#7030A0
    classDef l5 fill:#FDE9E1,color:#000000,stroke:#C55A11
```

---

## 🗺️ Sơ đồ tư duy tổng quan – Toán 11 Học kì I

```mermaid
%%{init: {"theme": "base", "htmlLabels": true, "flowchart": {"htmlLabels": true, "padding": 10, "curve": "basis"}, "themeVariables": {"fontSize": "15px"}}}%%
graph TD
    T11["🎯 TOÁN 11 –<br/>HỌC KÌ I<br/>Kết nối tri thức"]:::root
    T11 --> LG["📘 Chương 1<br/>Lượng giác<br/>Bài 1–4 + BTCC1"]:::nhom1
    T11 --> DS["📗 Chương 2<br/>Dãy số<br/>Bài 5–7"]:::nhom2

    LG --> L1["Bài 1. Góc lượng<br/>giác<br/>Đường tròn đơn vị<br/>Giá trị lượng giác<br/>(mọi góc)"]:::bai
    LG --> L2["Bài 2. Công thức<br/>lượng giác<br/>Cộng, nhân đôi, hạ<br/>bậc<br/>Tích → tổng, tổng<br/>→ tích"]:::bai
    LG --> L3["Bài 3. Hàm số<br/>lượng giác<br/>y=sinx, y=cosx, y=tanx,<br/>y=cotx<br/>Tập xác định, chu<br/>kì, đồ thị"]:::bai
    LG --> L4["Bài 4. Phương trình<br/>lượng giác<br/>sinx=a, cosx=a<br/>tanx=a, cotx=a"]:::bai
    LG --> LBT["BT cuối Chương 1<br/>Lượng giác tổng hợp"]:::bt

    DS --> D5["Bài 5. Dãy số<br/>Định nghĩa, cách cho<br/>dãy<br/>Dãy tăng, giảm, bị<br/>chặn"]:::bai
    DS --> D6["Bài 6. Cấp số<br/>cộng<br/>Công thức số hạng,<br/>tổng<br/>Trung bình cộng"]:::bai
    DS --> D7["Bài 7. Cấp số<br/>nhân<br/>Công thức số hạng,<br/>tổng<br/>Trung bình nhân"]:::bai

    classDef root fill:#002060,color:#FFFFFF,stroke:#000B1E,stroke-width:2px,font-weight:bold
    classDef n1 fill:#E2EFDA,color:#000000,stroke:#375623,stroke-width:3px,font-weight:bold
    classDef n2 fill:#FFF2CC,color:#000000,stroke:#BF8F00,stroke-width:3px,font-weight:bold
    classDef n3 fill:#E2EFDA,color:#000000,stroke:#375623,stroke-width:3px,font-weight:bold
    classDef n4 fill:#FFF2CC,color:#000000,stroke:#BF8F00,stroke-width:3px,font-weight:bold
    classDef n5 fill:#E2EFDA,color:#000000,stroke:#375623,stroke-width:3px,font-weight:bold
    classDef l1 fill:#EDF5E8,color:#000000,stroke:#548235
    classDef l2 fill:#FFF8E1,color:#000000,stroke:#BF8F00
    classDef l3 fill:#E3EEF9,color:#000000,stroke:#2F5597
    classDef l4 fill:#F3E8F7,color:#000000,stroke:#7030A0
    classDef l5 fill:#FDE9E1,color:#000000,stroke:#C55A11
```

---

## 🗺️ Sơ đồ tư duy tổng quan – Toán 12 Học kì I

```mermaid
%%{init: {"theme": "base", "htmlLabels": true, "flowchart": {"htmlLabels": true, "padding": 10, "curve": "basis"}, "themeVariables": {"fontSize": "15px"}}}%%
graph TD
    T12["🎯 TOÁN 12 –<br/>HỌC KÌ I<br/>Kết nối tri thức"]:::root
    T12 --> CH1["📘 Chương 1<br/>Ứng dụng đạo hàm<br/>Bài 1–4"]:::nhom1
    T12 --> CD1["📗 Chuyên đề 1<br/>Biến số ngẫu nhiên"]:::nhom2

    CH1 --> T1["Bài 1. Tính đơn<br/>điệu & Cực trị<br/>y' > 0 đồng<br/>biến / y' <<br/>0 nghịch biến<br/>Cực đại: y' đổi<br/>dấu + → −"]:::bai
    CH1 --> T2["Bài 2. GTLN –<br/>GTNN<br/>Trên [a,b]: so sánh<br/>cực trị + f(a),<br/>f(b)<br/>Bài toán tối ưu<br/>thực tiễn"]:::bai
    CH1 --> T3["Bài 3. Đường tiệm<br/>cận<br/>TC ngang: lim x→±∞<br/>TC đứng: lim x→x₀<br/>= ±∞<br/>TC xiên: y =<br/>kx + b"]:::bai
    CH1 --> T4["Bài 4. Khảo sát<br/>hàm số<br/>5 bước: TXĐ →<br/>biến thiên → cực<br/>trị<br/>→ giới hạn/tiệm cận<br/>→ vẽ đồ thị"]:::bai

    CD1 --> C1["Bài 1. Biến số<br/>ngẫu nhiên rời rạc<br/>Bảng phân phối xác<br/>suất<br/>Kỳ vọng E(X), phương<br/>sai D(X)"]:::bai

    classDef root fill:#002060,color:#FFFFFF,stroke:#000B1E,stroke-width:2px,font-weight:bold
    classDef n1 fill:#E2EFDA,color:#000000,stroke:#375623,stroke-width:3px,font-weight:bold
    classDef n2 fill:#FFF2CC,color:#000000,stroke:#BF8F00,stroke-width:3px,font-weight:bold
    classDef n3 fill:#E2EFDA,color:#000000,stroke:#375623,stroke-width:3px,font-weight:bold
    classDef n4 fill:#FFF2CC,color:#000000,stroke:#BF8F00,stroke-width:3px,font-weight:bold
    classDef n5 fill:#E2EFDA,color:#000000,stroke:#375623,stroke-width:3px,font-weight:bold
    classDef l1 fill:#EDF5E8,color:#000000,stroke:#548235
    classDef l2 fill:#FFF8E1,color:#000000,stroke:#BF8F00
    classDef l3 fill:#E3EEF9,color:#000000,stroke:#2F5597
    classDef l4 fill:#F3E8F7,color:#000000,stroke:#7030A0
    classDef l5 fill:#FDE9E1,color:#000000,stroke:#C55A11
```

---

## 🗺️ Sơ đồ tư duy tổng quan – Vật lí 12 Học kì I

```mermaid
%%{init: {"theme": "base", "htmlLabels": true, "flowchart": {"htmlLabels": true, "padding": 10, "curve": "basis"}, "themeVariables": {"fontSize": "15px"}}}%%
graph TD
    VL12["⚡ VẬT LÍ 12<br/>– HỌC KÌ I<br/>Kết nối tri thức"]:::root
    VL12 --> NLD["🔥 Nhiệt lực học<br/>Bài 1–6 (T1–12)"]:::nhom

    NLD --> V1["Bài 1. Cấu trúc<br/>chất & Chuyển thể<br/>Mô hình ĐH phân<br/>tử<br/>Rắn → Lỏng →<br/>Khí"]:::bai
    NLD --> V2["Bài 2. Nội năng<br/>– ĐL I NĐ<br/>U = ΣĐN +<br/>ΣTN phân tử<br/>ΔU = A +<br/>Q"]:::bai
    NLD --> V3["Bài 3. Nhiệt độ<br/>– Thang đo<br/>T(K) = t(°C) +<br/>273<br/>0 K = −273°C"]:::bai
    NLD --> V4["Bài 4. Nhiệt dung<br/>riêng<br/>Q = mcΔt<br/>PT cân bằng nhiệt"]:::bai
    NLD --> V5["Bài 5. Nhiệt nóng<br/>chảy riêng<br/>Q = λm<br/>Nóng chảy & Đông<br/>đặc"]:::bai
    NLD --> V6["Bài 6. Nhiệt hoá<br/>hơi riêng<br/>Q = Lm<br/>Bay hơi & Ngưng<br/>tụ"]:::bai

    classDef root fill:#002060,color:#FFFFFF,stroke:#000B1E,stroke-width:2px,font-weight:bold
    classDef n1 fill:#E2EFDA,color:#000000,stroke:#375623,stroke-width:3px,font-weight:bold
    classDef n2 fill:#FFF2CC,color:#000000,stroke:#BF8F00,stroke-width:3px,font-weight:bold
    classDef n3 fill:#E2EFDA,color:#000000,stroke:#375623,stroke-width:3px,font-weight:bold
    classDef n4 fill:#FFF2CC,color:#000000,stroke:#BF8F00,stroke-width:3px,font-weight:bold
    classDef n5 fill:#E2EFDA,color:#000000,stroke:#375623,stroke-width:3px,font-weight:bold
    classDef l1 fill:#EDF5E8,color:#000000,stroke:#548235
    classDef l2 fill:#FFF8E1,color:#000000,stroke:#BF8F00
    classDef l3 fill:#E3EEF9,color:#000000,stroke:#2F5597
    classDef l4 fill:#F3E8F7,color:#000000,stroke:#7030A0
    classDef l5 fill:#FDE9E1,color:#000000,stroke:#C55A11
```

---

## 📌 Sơ đồ tư duy từng bài – Toán 10

### Toán 10 – Bài 1. Mệnh đề *(Tiết 1–4)*

```mermaid
%%{init: {"theme": "base", "htmlLabels": true, "flowchart": {"htmlLabels": true, "padding": 10, "curve": "basis"}, "themeVariables": {"fontSize": "15px"}}}%%
graph TD
    G["🎯<BR/>BÀI<BR/>1<BR/>·<BR/>TOÁN<BR/>10<BR/>MỆNH<BR/>ĐỀ"]:::root
    G --> A["① Mệnh đề<br/>và phủ định"]:::n1
    G --> B["② Kéo theo<br/>và tương đương"]:::n2
    G --> C["③ Mệnh đề<br/>có chứa biến"]:::n3
    G --> D["④ Ứng dụng<br/>trong toán học"]:::n4

    A --> A1["Mệnh đề: câu có<br/>T/S xác định"]:::l1
    A --> A2["Phủ định ¬P"]:::l1
    A --> A3["Mệnh đề chứa biến<br/>P(x)"]:::l1

    B --> B1["P ⇒ Q: P<br/>đúng thì Q đúng"]:::l2
    B --> B2["P ⇔ Q: cùng<br/>đúng hoặc cùng sai"]:::l2
    B --> B3["Đảo, phản đảo, đảo<br/>phủ"]:::l2

    C --> C1["∀x: mọi x thỏa<br/>mãn"]:::l3
    C --> C2["∃x: tồn tại x<br/>thỏa mãn"]:::l3
    C --> C3["Phủ định ∀ ↔<br/>∃ và ngược lại"]:::l3

    D --> D1["Điều kiện cần (⇒)"]:::l4
    D --> D2["Điều kiện đủ (⇐)"]:::l4
    D --> D3["ĐK cần và đủ<br/>(⇔)"]:::l4

    classDef root fill:#002060,color:#FFFFFF,stroke:#000B1E,stroke-width:2px,font-weight:bold
    classDef n1 fill:#E2EFDA,color:#000000,stroke:#375623,stroke-width:3px,font-weight:bold
    classDef n2 fill:#FFF2CC,color:#000000,stroke:#BF8F00,stroke-width:3px,font-weight:bold
    classDef n3 fill:#E2EFDA,color:#000000,stroke:#375623,stroke-width:3px,font-weight:bold
    classDef n4 fill:#FFF2CC,color:#000000,stroke:#BF8F00,stroke-width:3px,font-weight:bold
    classDef n5 fill:#E2EFDA,color:#000000,stroke:#375623,stroke-width:3px,font-weight:bold
    classDef l1 fill:#EDF5E8,color:#000000,stroke:#548235
    classDef l2 fill:#FFF8E1,color:#000000,stroke:#BF8F00
    classDef l3 fill:#E3EEF9,color:#000000,stroke:#2F5597
    classDef l4 fill:#F3E8F7,color:#000000,stroke:#7030A0
    classDef l5 fill:#FDE9E1,color:#000000,stroke:#C55A11
```

> **Bài củng cố:** <https://trangtu66.github.io/Taode_thi_online/cc_bai1_t10.html>

---

### Toán 10 – Bài 2. Tập hợp *(Tiết 5–9)*

```mermaid
%%{init: {"theme": "base", "htmlLabels": true, "flowchart": {"htmlLabels": true, "padding": 10, "curve": "basis"}, "themeVariables": {"fontSize": "15px"}}}%%
graph TD
    G["🎯<BR/>BÀI<BR/>2<BR/>·<BR/>TOÁN<BR/>10<BR/>TẬP<BR/>HỢP"]:::root
    G --> A["① Khái niệm<br/>tập hợp"]:::n1
    G --> B["② Tập con &<br/>tập hợp bằng nhau"]:::n2
    G --> C["③ Phép toán<br/>tập hợp"]:::n3
    G --> D["④ Tập số R<br/>và khoảng"]:::n4

    A --> A1["Phần tử thuộc ∈<br/>/ không thuộc ∉"]:::l1
    A --> A2["Tập rỗng ∅"]:::l1
    A --> A3["Biểu đồ Venn"]:::l1

    B --> B1["A ⊂ B: mọi<br/>x∈A thì x∈B"]:::l2
    B --> B2["A = B ⟺<br/>A⊂B và B⊂A"]:::l2
    B --> B3["Số tập con của<br/>A: 2ⁿ (|A|=n)"]:::l2

    C --> C1["A ∩ B: phần<br/>tử thuộc cả hai"]:::l3
    C --> C2["A ∪ B: thuộc<br/>ít nhất một"]:::l3
    C --> C3["A \ B: thuộc<br/>A không thuộc B"]:::l3
    C --> C4["Cᵤ(A): bù của A<br/>trong U"]:::l3

    D --> D1["(a;b), [a;b], (a;b], [a;b)"]:::l4
    D --> D2["(a;+∞), (−∞;b)"]:::l4
    D --> D3["Giao, hợp khoảng"]:::l4

    classDef root fill:#002060,color:#FFFFFF,stroke:#000B1E,stroke-width:2px,font-weight:bold
    classDef n1 fill:#E2EFDA,color:#000000,stroke:#375623,stroke-width:3px,font-weight:bold
    classDef n2 fill:#FFF2CC,color:#000000,stroke:#BF8F00,stroke-width:3px,font-weight:bold
    classDef n3 fill:#E2EFDA,color:#000000,stroke:#375623,stroke-width:3px,font-weight:bold
    classDef n4 fill:#FFF2CC,color:#000000,stroke:#BF8F00,stroke-width:3px,font-weight:bold
    classDef n5 fill:#E2EFDA,color:#000000,stroke:#375623,stroke-width:3px,font-weight:bold
    classDef l1 fill:#EDF5E8,color:#000000,stroke:#548235
    classDef l2 fill:#FFF8E1,color:#000000,stroke:#BF8F00
    classDef l3 fill:#E3EEF9,color:#000000,stroke:#2F5597
    classDef l4 fill:#F3E8F7,color:#000000,stroke:#7030A0
    classDef l5 fill:#FDE9E1,color:#000000,stroke:#C55A11
```

> **Bài củng cố:** <https://trangtu66.github.io/Taode_thi_online/cc_bai2_t10.html>

---

### Toán 10 – Bài 3. BPT bậc nhất hai ẩn *(Tiết 10–13)*

```mermaid
%%{init: {"theme": "base", "htmlLabels": true, "flowchart": {"htmlLabels": true, "padding": 10, "curve": "basis"}, "themeVariables": {"fontSize": "15px"}}}%%
graph TD
    G["🎯<BR/>BÀI<BR/>3<BR/>·<BR/>TOÁN<BR/>10<BR/>BPT<BR/>BẬC<BR/>NHẤT<BR/>HAI<BR/>ẨN"]:::root
    G --> A["① BPT bậc nhất<br/>hai ẩn"]:::n1
    G --> B["② Miền nghiệm<br/>của BPT"]:::n2
    G --> C["③ Hệ BPT<br/>bậc nhất hai ẩn"]:::n3
    G --> D["④ Ứng dụng<br/>thực tiễn"]:::n4

    A --> A1["ax + by ≤<br/>c (a,b không đồng<br/>thời =0)"]:::l1
    A --> A2["Nghiệm (x₀;y₀): thay thỏa<br/>mãn"]:::l1

    B --> B1["Đường thẳng d: ax+by<br/>= c"]:::l2
    B --> B2["Chọn điểm thử (thường<br/>O)"]:::l2
    B --> B3["Miền nghiệm: nửa mặt<br/>phẳng<br/>bờ là đường thẳng<br/>d"]:::l2

    C --> C1["Miền nghiệm chung =<br/>giao các miền"]:::l3
    C --> C2["Miền đa giác (có<br/>thể vô hạn)"]:::l3
    C --> C3["Đỉnh = giao các<br/>đường biên"]:::l3

    D --> D1["Bài toán lập kế<br/>hoạch SX"]:::l4
    D --> D2["Tìm max/min tuyến tính<br/>tại đỉnh của miền<br/>đa giác"]:::l4

    classDef root fill:#002060,color:#FFFFFF,stroke:#000B1E,stroke-width:2px,font-weight:bold
    classDef n1 fill:#E2EFDA,color:#000000,stroke:#375623,stroke-width:3px,font-weight:bold
    classDef n2 fill:#FFF2CC,color:#000000,stroke:#BF8F00,stroke-width:3px,font-weight:bold
    classDef n3 fill:#E2EFDA,color:#000000,stroke:#375623,stroke-width:3px,font-weight:bold
    classDef n4 fill:#FFF2CC,color:#000000,stroke:#BF8F00,stroke-width:3px,font-weight:bold
    classDef n5 fill:#E2EFDA,color:#000000,stroke:#375623,stroke-width:3px,font-weight:bold
    classDef l1 fill:#EDF5E8,color:#000000,stroke:#548235
    classDef l2 fill:#FFF8E1,color:#000000,stroke:#BF8F00
    classDef l3 fill:#E3EEF9,color:#000000,stroke:#2F5597
    classDef l4 fill:#F3E8F7,color:#000000,stroke:#7030A0
    classDef l5 fill:#FDE9E1,color:#000000,stroke:#C55A11
```

> **Bài củng cố:** <https://trangtu66.github.io/Taode_thi_online/cc_bai3_t10.html>

---

### Toán 10 – STEM Bài 4. Hệ BPT & Khẩu phần ăn *(Tiết 14)*

```mermaid
%%{init: {"theme": "base", "htmlLabels": true, "flowchart": {"htmlLabels": true, "padding": 10, "curve": "basis"}, "themeVariables": {"fontSize": "15px"}}}%%
graph TD
    G["🎯<BR/>STEM<BR/>BÀI<BR/>4<BR/>·<BR/>TOÁN<BR/>10<BR/>HỆ<BR/>BPT<BR/>–<BR/>KHẨU<BR/>PHẦN<BR/>ĂN"]:::root
    G --> A["① Mô hình hóa<br/>bài toán thực tế"]:::n1
    G --> B["② Lập hệ BPT<br/>từ ràng buộc"]:::n2
    G --> C["③ Vẽ miền nghiệm<br/>& tìm tối ưu"]:::n3
    G --> D["④ Đánh giá<br/>& mở rộng"]:::n4

    A --> A1["Thực phẩm: protein, lipid,<br/>glucid"]:::l1
    A --> A2["Biến: x (loại 1),<br/>y (loại 2)"]:::l1

    B --> B1["BPT dinh dưỡng: ax+by<br/>≥ nhu cầu"]:::l2
    B --> B2["BPT ngân sách: p₁x+p₂y<br/>≤ budget"]:::l2
    B --> B3["BPT không âm: x≥0,<br/>y≥0"]:::l2

    C --> C1["Vẽ miền nghiệm chung"]:::l3
    C --> C2["Tìm đỉnh đa giác"]:::l3
    C --> C3["Hàm mục tiêu f(x,y)=ax+by<br/>→ min/max"]:::l3

    D --> D1["Kiểm tra điều kiện<br/>thực tế"]:::l4
    D --> D2["Báo cáo STEM: nhóm<br/>4–6 HS"]:::l4

    classDef root fill:#002060,color:#FFFFFF,stroke:#000B1E,stroke-width:2px,font-weight:bold
    classDef n1 fill:#E2EFDA,color:#000000,stroke:#375623,stroke-width:3px,font-weight:bold
    classDef n2 fill:#FFF2CC,color:#000000,stroke:#BF8F00,stroke-width:3px,font-weight:bold
    classDef n3 fill:#E2EFDA,color:#000000,stroke:#375623,stroke-width:3px,font-weight:bold
    classDef n4 fill:#FFF2CC,color:#000000,stroke:#BF8F00,stroke-width:3px,font-weight:bold
    classDef n5 fill:#E2EFDA,color:#000000,stroke:#375623,stroke-width:3px,font-weight:bold
    classDef l1 fill:#EDF5E8,color:#000000,stroke:#548235
    classDef l2 fill:#FFF8E1,color:#000000,stroke:#BF8F00
    classDef l3 fill:#E3EEF9,color:#000000,stroke:#2F5597
    classDef l4 fill:#F3E8F7,color:#000000,stroke:#7030A0
    classDef l5 fill:#FDE9E1,color:#000000,stroke:#C55A11
```

---

### Toán 10 – Bài 5. Giá trị lượng giác của góc từ 0° đến 180° *(Tiết 16–17)*

```mermaid
%%{init: {"theme": "base", "htmlLabels": true, "flowchart": {"htmlLabels": true, "padding": 10, "curve": "basis"}, "themeVariables": {"fontSize": "15px"}}}%%
graph TD
    G["🎯<BR/>BÀI<BR/>5<BR/>·<BR/>TOÁN<BR/>10<BR/>GIÁ<BR/>TRỊ<BR/>LƯỢNG<BR/>GIÁC<BR/>GÓC<BR/>0°–180°"]:::root
    G --> A["① Định nghĩa<br/>qua đường tròn ĐV"]:::n1
    G --> B["② Bảng giá trị<br/>đặc biệt"]:::n2
    G --> C["③ Tính chất<br/>& hệ thức"]:::n3
    G --> D["④ Ứng dụng<br/>trong tam giác"]:::n4

    A --> A1["sin α = tung<br/>độ M trên đtròn<br/>ĐV"]:::l1
    A --> A2["cos α = hoành<br/>độ M"]:::l1
    A --> A3["tan α = sin/cos<br/>(cos≠0)"]:::l1
    A --> A4["cot α = cos/sin<br/>(sin≠0)"]:::l1

    B --> B1["30°: sin=½, cos=√3/2"]:::l2
    B --> B2["45°: sin=cos=√2/2"]:::l2
    B --> B3["60°: sin=√3/2, cos=½"]:::l2
    B --> B4["120°, 135°, 150°: bù<br/>góc nhọn"]:::l2

    C --> C1["sin²α + cos²α =<br/>1"]:::l3
    C --> C2["sin(180°−α) = sinα"]:::l3
    C --> C3["cos(180°−α) = −cosα"]:::l3

    D --> D1["Quy tắc sin trong<br/>tam giác"]:::l4
    D --> D2["Góc A tù ⟺<br/>cosA < 0"]:::l4

    classDef root fill:#002060,color:#FFFFFF,stroke:#000B1E,stroke-width:2px,font-weight:bold
    classDef n1 fill:#E2EFDA,color:#000000,stroke:#375623,stroke-width:3px,font-weight:bold
    classDef n2 fill:#FFF2CC,color:#000000,stroke:#BF8F00,stroke-width:3px,font-weight:bold
    classDef n3 fill:#E2EFDA,color:#000000,stroke:#375623,stroke-width:3px,font-weight:bold
    classDef n4 fill:#FFF2CC,color:#000000,stroke:#BF8F00,stroke-width:3px,font-weight:bold
    classDef n5 fill:#E2EFDA,color:#000000,stroke:#375623,stroke-width:3px,font-weight:bold
    classDef l1 fill:#EDF5E8,color:#000000,stroke:#548235
    classDef l2 fill:#FFF8E1,color:#000000,stroke:#BF8F00
    classDef l3 fill:#E3EEF9,color:#000000,stroke:#2F5597
    classDef l4 fill:#F3E8F7,color:#000000,stroke:#7030A0
    classDef l5 fill:#FDE9E1,color:#000000,stroke:#C55A11
```

> **Bài củng cố:** <https://trangtu66.github.io/Taode_thi_online/cc_bai5_t10.html>

---

### Toán 10 – Bài 6. Định lí sin, cos & Diện tích tam giác *(Tiết 18–21)*

```mermaid
%%{init: {"theme": "base", "htmlLabels": true, "flowchart": {"htmlLabels": true, "padding": 10, "curve": "basis"}, "themeVariables": {"fontSize": "15px"}}}%%
graph TD
    G["🎯<BR/>BÀI<BR/>6<BR/>·<BR/>TOÁN<BR/>10<BR/>ĐỊNH<BR/>LÍ<BR/>SIN,<BR/>COSIN<BR/>&<BR/>DIỆN<BR/>TÍCH"]:::root
    G --> A["① Định lí sin"]:::n1
    G --> B["② Định lí cosin"]:::n2
    G --> C["③ Diện tích<br/>R ngoại & r<br/>nội tiếp"]:::n3
    G --> D["④ Bài toán<br/>đo đạc thực tiễn"]:::n4

    A --> A1["a/sinA = b/sinB =<br/>c/sinC = 2R"]:::l1
    A --> A2["Tìm cạnh khi biết<br/>2 góc + 1<br/>cạnh"]:::l1
    A --> A3["Tìm góc khi biết<br/>3 cạnh"]:::l1

    B --> B1["a² = b²+c²−2bc·cosA"]:::l2
    B --> B2["cosA = (b²+c²−a²)/(2bc)"]:::l2
    B --> B3["Tìm cạnh khi biết<br/>2 cạnh + góc<br/>xen"]:::l2

    C --> C1["S = ½bc·sinA =<br/>½ac·sinB = ½ab·sinC"]:::l3
    C --> C2["R = a/(2sinA) –<br/>bán kính ngoại tiếp"]:::l3
    C --> C3["r = S/p; p=(a+b+c)/2<br/>– bán kính nội<br/>tiếp"]:::l3

    D --> D1["Đo khoảng cách không<br/>trực tiếp"]:::l4
    D --> D2["Xác định chiều cao,<br/>khoảng cách đảo"]:::l4

    classDef root fill:#002060,color:#FFFFFF,stroke:#000B1E,stroke-width:2px,font-weight:bold
    classDef n1 fill:#E2EFDA,color:#000000,stroke:#375623,stroke-width:3px,font-weight:bold
    classDef n2 fill:#FFF2CC,color:#000000,stroke:#BF8F00,stroke-width:3px,font-weight:bold
    classDef n3 fill:#E2EFDA,color:#000000,stroke:#375623,stroke-width:3px,font-weight:bold
    classDef n4 fill:#FFF2CC,color:#000000,stroke:#BF8F00,stroke-width:3px,font-weight:bold
    classDef n5 fill:#E2EFDA,color:#000000,stroke:#375623,stroke-width:3px,font-weight:bold
    classDef l1 fill:#EDF5E8,color:#000000,stroke:#548235
    classDef l2 fill:#FFF8E1,color:#000000,stroke:#BF8F00
    classDef l3 fill:#E3EEF9,color:#000000,stroke:#2F5597
    classDef l4 fill:#F3E8F7,color:#000000,stroke:#7030A0
    classDef l5 fill:#FDE9E1,color:#000000,stroke:#C55A11
```

> **Bài củng cố:** <https://trangtu66.github.io/Taode_thi_online/cc_bai6_t10.html>

---

### Toán 10 – Bài tập cuối Chương III. Hệ thức lượng trong tam giác *(Tiết 22)*

```mermaid
%%{init: {"theme": "base", "htmlLabels": true, "flowchart": {"htmlLabels": true, "padding": 10, "curve": "basis"}, "themeVariables": {"fontSize": "15px"}}}%%
graph TD
    G["🎯<BR/>CHƯƠNG<BR/>III<BR/>·<BR/>TOÁN<BR/>10<BR/>HỆ<BR/>THỨC<BR/>LƯỢNG<BR/>TRONG<BR/>TAM<BR/>GIÁC"]:::root
    G --> A["① Góc từ 0°<br/>đến 180°<br/>Giá trị LG đặc<br/>biệt"]:::n1
    G --> B["② Định lí Sin<br/>& Cosin"]:::n2
    G --> C["③ Diện tích &<br/>R, r"]:::n3
    G --> D["④ Bài tập ứng<br/>dụng<br/>thực tiễn"]:::n4

    A --> A1["sin²α + cos²α =<br/>1"]:::l1
    A --> A2["sin(180°–α) = sinα"]:::l1
    A --> A3["cos(180°–α) = –cosα"]:::l1
    A --> A4["Bảng 30°, 45°, 60°,<br/>120°, 135°, 150°"]:::l1

    B --> B1["a/sinA = b/sinB =<br/>c/sinC = 2R"]:::l2
    B --> B2["a² = b²+c²–2bc·cosA"]:::l2
    B --> B3["cosA = (b²+c²–a²)/(2bc)"]:::l2

    C --> C1["S = ½bc·sinA"]:::l3
    C --> C2["R = a/(2sinA) –<br/>ngoại tiếp"]:::l3
    C --> C3["r = S/p; p<br/>= (a+b+c)/2 – nội<br/>tiếp"]:::l3

    D --> D1["Tính S, R, r<br/>khi biết 2 cạnh,<br/>1 góc"]:::l4
    D --> D2["Đo đạc thực tế<br/>(Bài 3.18, 3.19 SGK)"]:::l4

    classDef root fill:#002060,color:#FFFFFF,stroke:#000B1E,stroke-width:2px,font-weight:bold
    classDef n1 fill:#E2EFDA,color:#000000,stroke:#375623,stroke-width:3px,font-weight:bold
    classDef n2 fill:#FFF2CC,color:#000000,stroke:#BF8F00,stroke-width:3px,font-weight:bold
    classDef n3 fill:#E2EFDA,color:#000000,stroke:#375623,stroke-width:3px,font-weight:bold
    classDef n4 fill:#FFF2CC,color:#000000,stroke:#BF8F00,stroke-width:3px,font-weight:bold
    classDef n5 fill:#E2EFDA,color:#000000,stroke:#375623,stroke-width:3px,font-weight:bold
    classDef l1 fill:#EDF5E8,color:#000000,stroke:#548235
    classDef l2 fill:#FFF8E1,color:#000000,stroke:#BF8F00
    classDef l3 fill:#E3EEF9,color:#000000,stroke:#2F5597
    classDef l4 fill:#F3E8F7,color:#000000,stroke:#7030A0
    classDef l5 fill:#FDE9E1,color:#000000,stroke:#C55A11
```

> **Bài củng cố:** <https://trangtu66.github.io/Taode_thi_online/cc_chuong3_t10.html>

---

### Toán 10 – Bài 7. Các khái niệm mở đầu *(Tiết 26–27)*

```mermaid
%%{init: {"theme": "base", "htmlLabels": true, "flowchart": {"htmlLabels": true, "padding": 10, "curve": "basis"}, "themeVariables": {"fontSize": "15px"}}}%%
graph TD
    G["🎯<BR/>BÀI<BR/>7<BR/>CÁC<BR/>KHÁI<BR/>NIỆM<BR/>MỞ<BR/>ĐẦU"]:::root
    G --> A["① Vectơ"]:::n1
    G --> B["② Cùng phương"]:::n2
    G --> C["③ Cùng hướng –<br/>bằng nhau"]:::n3
    G --> D["④ Vectơ-không"]:::n4

    A --> A1["★ Đoạn thẳng có<br/>hướng"]:::l1
    A --> A2["Kí hiệu AB→, a→"]:::l1
    A --> A3["★ Độ dài |AB→|<br/>= AB"]:::l1
    A --> A4["Biểu diễn lực, vận<br/>tốc"]:::l1

    B --> B1["Giá của vectơ"]:::l2
    B --> B2["★ Giá song song<br/>hoặc trùng nhau"]:::l2
    B --> B3["A, B, C thẳng<br/>hàng ⇔ AB→, AC→<br/>cùng phương"]:::l2

    C --> C1["Cùng phương thì cùng<br/>hoặc ngược hướng"]:::l3
    C --> C2["★ a→ = b→:<br/>cùng độ dài, cùng<br/>hướng"]:::l3
    C --> C3["Mỗi O, a→: duy<br/>nhất A với OA→<br/>= a→"]:::l3

    D --> D1["AA→, BB→ = 0→"]:::l4
    D --> D2["★ Độ dài 0"]:::l4
    D --> D3["Cùng hướng với mọi<br/>vectơ"]:::l4

    classDef root fill:#002060,color:#FFFFFF,stroke:#000B1E,stroke-width:2px,font-weight:bold
    classDef n1 fill:#E2EFDA,color:#000000,stroke:#375623,stroke-width:3px,font-weight:bold
    classDef n2 fill:#FFF2CC,color:#000000,stroke:#BF8F00,stroke-width:3px,font-weight:bold
    classDef n3 fill:#E2EFDA,color:#000000,stroke:#375623,stroke-width:3px,font-weight:bold
    classDef n4 fill:#FFF2CC,color:#000000,stroke:#BF8F00,stroke-width:3px,font-weight:bold
    classDef n5 fill:#E2EFDA,color:#000000,stroke:#375623,stroke-width:3px,font-weight:bold
    classDef l1 fill:#EDF5E8,color:#000000,stroke:#548235
    classDef l2 fill:#FFF8E1,color:#000000,stroke:#BF8F00
    classDef l3 fill:#E3EEF9,color:#000000,stroke:#2F5597
    classDef l4 fill:#F3E8F7,color:#000000,stroke:#7030A0
    classDef l5 fill:#FDE9E1,color:#000000,stroke:#C55A11
```

> **Bài củng cố:** <https://trangtu66.github.io/Taode_thi_online/cc_bai7_t10.html>

---

### Toán 10 – Bài 8. Tổng và hiệu của hai vectơ *(Tiết 28–29)*

```mermaid
%%{init: {"theme": "base", "htmlLabels": true, "flowchart": {"htmlLabels": true, "padding": 10, "curve": "basis"}, "themeVariables": {"fontSize": "15px"}}}%%
graph TD
    G["🎯<BR/>BÀI<BR/>8<BR/>TỔNG<BR/>VÀ<BR/>HIỆU<BR/>CỦA<BR/>HAI<BR/>VECTƠ"]:::root
    G --> A["① Tổng hai vectơ"]:::n1
    G --> B["② Hiệu hai vectơ"]:::n2
    G --> C["③ Trung điểm –<br/>trọng tâm"]:::n3
    G --> D["④ Ứng dụng"]:::n4

    A --> A1["★ Quy tắc ba<br/>điểm: AB→ + BC→<br/>= AC→"]:::l1
    A --> A2["★ Quy tắc hình<br/>bình hành: AB→ +<br/>AD→ = AC→"]:::l1
    A --> A3["Giao hoán, kết hợp"]:::l1
    A --> A4["a→ + 0→ =<br/>a→"]:::l1

    B --> B1["Vectơ đối −a→"]:::l2
    B --> B2["a→ − b→ =<br/>a→ + (−b→)"]:::l2
    B --> B3["★ Quy tắc hiệu:<br/>MN→ = ON→ −<br/>OM→"]:::l2

    C --> C1["★ I trung điểm<br/>AB: IA→ + IB→<br/>= 0→"]:::l3
    C --> C2["★ G trọng tâm:<br/>GA→ + GB→ +<br/>GC→ = 0→"]:::l3

    D --> D1["Tổng hợp lực"]:::l4
    D --> D2["Tổng hợp vận tốc"]:::l4
    D --> D3["Tàu qua sông nhanh<br/>nhất"]:::l4
    D --> D4["Kéo pháo lên dốc"]:::l4

    classDef root fill:#002060,color:#FFFFFF,stroke:#000B1E,stroke-width:2px,font-weight:bold
    classDef n1 fill:#E2EFDA,color:#000000,stroke:#375623,stroke-width:3px,font-weight:bold
    classDef n2 fill:#FFF2CC,color:#000000,stroke:#BF8F00,stroke-width:3px,font-weight:bold
    classDef n3 fill:#E2EFDA,color:#000000,stroke:#375623,stroke-width:3px,font-weight:bold
    classDef n4 fill:#FFF2CC,color:#000000,stroke:#BF8F00,stroke-width:3px,font-weight:bold
    classDef n5 fill:#E2EFDA,color:#000000,stroke:#375623,stroke-width:3px,font-weight:bold
    classDef l1 fill:#EDF5E8,color:#000000,stroke:#548235
    classDef l2 fill:#FFF8E1,color:#000000,stroke:#BF8F00
    classDef l3 fill:#E3EEF9,color:#000000,stroke:#2F5597
    classDef l4 fill:#F3E8F7,color:#000000,stroke:#7030A0
    classDef l5 fill:#FDE9E1,color:#000000,stroke:#C55A11
```

> **Bài củng cố:** <https://trangtu66.github.io/Taode_thi_online/cc_bai8_t10.html>

---

### Toán 10 – Bài 9. Tích của một vectơ với một số *(Tiết 30–31)*

```mermaid
%%{init: {"theme": "base", "htmlLabels": true, "flowchart": {"htmlLabels": true, "padding": 10, "curve": "basis"}, "themeVariables": {"fontSize": "15px"}}}%%
graph TD
    G["🎯<BR/>BÀI<BR/>9<BR/>TÍCH<BR/>CỦA<BR/>MỘT<BR/>VECTƠ<BR/>VỚI<BR/>MỘT<BR/>SỐ"]:::root
    G --> A["① Định nghĩa k·a→"]:::n1
    G --> B["② Tính chất"]:::n2
    G --> C["③ Cùng phương –<br/>phân tích"]:::n3
    G --> D["④ Trung điểm –<br/>trọng tâm – khối<br/>tâm"]:::n4

    A --> A1["★ k > 0:<br/>cùng hướng a→"]:::l1
    A --> A2["★ k < 0:<br/>ngược hướng a→"]:::l1
    A --> A3["★ |k·a→| = |k|·|a→|"]:::l1
    A --> A4["k·a→ = 0→ khi<br/>k = 0 hoặc<br/>a→ = 0→"]:::l1

    B --> B1["k(t·a→) = (kt)·a→"]:::l2
    B --> B2["(k + t)·a→ =<br/>k·a→ + t·a→"]:::l2
    B --> B3["k(a→ ± b→) =<br/>k·a→ ± k·b→"]:::l2
    B --> B4["1·a→ = a→; (−1)·a→<br/>= −a→"]:::l2

    C --> C1["★ a→, b→ cùng<br/>phương ⇔ a→ =<br/>k·b→"]:::l3
    C --> C2["A, B, C thẳng<br/>hàng ⇔ AC→ =<br/>t·AB→"]:::l3
    C --> C3["★ u→ = x·a→<br/>+ y·b→ (duy nhất)"]:::l3

    D --> D1["★ OA→ + OB→<br/>= 2·OI→"]:::l4
    D --> D2["★ OA→ + OB→<br/>+ OC→ = 3·OG→"]:::l4
    D --> D3["Khối tâm: Σ mᵢ·MAᵢ→<br/>= 0→"]:::l4

    classDef root fill:#002060,color:#FFFFFF,stroke:#000B1E,stroke-width:2px,font-weight:bold
    classDef n1 fill:#E2EFDA,color:#000000,stroke:#375623,stroke-width:3px,font-weight:bold
    classDef n2 fill:#FFF2CC,color:#000000,stroke:#BF8F00,stroke-width:3px,font-weight:bold
    classDef n3 fill:#E2EFDA,color:#000000,stroke:#375623,stroke-width:3px,font-weight:bold
    classDef n4 fill:#FFF2CC,color:#000000,stroke:#BF8F00,stroke-width:3px,font-weight:bold
    classDef n5 fill:#E2EFDA,color:#000000,stroke:#375623,stroke-width:3px,font-weight:bold
    classDef l1 fill:#EDF5E8,color:#000000,stroke:#548235
    classDef l2 fill:#FFF8E1,color:#000000,stroke:#BF8F00
    classDef l3 fill:#E3EEF9,color:#000000,stroke:#2F5597
    classDef l4 fill:#F3E8F7,color:#000000,stroke:#7030A0
    classDef l5 fill:#FDE9E1,color:#000000,stroke:#C55A11
```

> **Bài củng cố:** <https://trangtu66.github.io/Taode_thi_online/cc_bai9_t10.html>

---

### Toán 10 – Bài 10. Vectơ trong mặt phẳng toạ độ *(Tiết 32–34)*

```mermaid
%%{init: {"theme": "base", "htmlLabels": true, "flowchart": {"htmlLabels": true, "padding": 10, "curve": "basis"}, "themeVariables": {"fontSize": "15px"}}}%%
graph TD
    G["🎯<BR/>BÀI<BR/>10<BR/>VECTƠ<BR/>TRONG<BR/>MẶT<BR/>PHẲNG<BR/>TOẠ<BR/>ĐỘ"]:::root
    G --> A["① Toạ độ của<br/>vectơ"]:::n1
    G --> B["② Phép toán theo<br/>toạ độ"]:::n2
    G --> C["③ Điểm – độ<br/>dài"]:::n3
    G --> D["④ Trung điểm –<br/>trọng tâm – ứng<br/>dụng"]:::n4

    A --> A1["Hệ trục Oxy, vectơ<br/>đơn vị i→, j→"]:::l1
    A --> A2["★ u→ = x·i→<br/>+ y·j→ ⇔ u→<br/>= (x; y)"]:::l1
    A --> A3["Hai vectơ bằng nhau<br/>⇔ cùng toạ độ"]:::l1

    B --> B1["★ u→ ± v→<br/>= (x ± x';<br/>y ± y')"]:::l2
    B --> B2["★ k·u→ = (kx;<br/>ky)"]:::l2
    B --> B3["Cùng phương: x' =<br/>kx, y' = ky"]:::l2

    C --> C1["★ OM→ = (x;<br/>y), |OM→| = √(x²<br/>+ y²)"]:::l3
    C --> C2["★ MN→ = (x'<br/>− x; y' −<br/>y)"]:::l3
    C --> C3["MN = √((x' −<br/>x)² + (y' −<br/>y)²)"]:::l3

    D --> D1["★ Trung điểm ((x_A<br/>+ x_B)/2; (y_A +<br/>y_B)/2)"]:::l4
    D --> D2["★ Trọng tâm: trung<br/>bình cộng 3 đỉnh"]:::l4
    D --> D3["Dự báo vị trí<br/>tâm bão"]:::l4
    D --> D4["Chuyển động tàu thuỷ,<br/>quân mã"]:::l4

    classDef root fill:#002060,color:#FFFFFF,stroke:#000B1E,stroke-width:2px,font-weight:bold
    classDef n1 fill:#E2EFDA,color:#000000,stroke:#375623,stroke-width:3px,font-weight:bold
    classDef n2 fill:#FFF2CC,color:#000000,stroke:#BF8F00,stroke-width:3px,font-weight:bold
    classDef n3 fill:#E2EFDA,color:#000000,stroke:#375623,stroke-width:3px,font-weight:bold
    classDef n4 fill:#FFF2CC,color:#000000,stroke:#BF8F00,stroke-width:3px,font-weight:bold
    classDef n5 fill:#E2EFDA,color:#000000,stroke:#375623,stroke-width:3px,font-weight:bold
    classDef l1 fill:#EDF5E8,color:#000000,stroke:#548235
    classDef l2 fill:#FFF8E1,color:#000000,stroke:#BF8F00
    classDef l3 fill:#E3EEF9,color:#000000,stroke:#2F5597
    classDef l4 fill:#F3E8F7,color:#000000,stroke:#7030A0
    classDef l5 fill:#FDE9E1,color:#000000,stroke:#C55A11
```

> **Bài củng cố:** <https://trangtu66.github.io/Taode_thi_online/cc_bai10_t10.html>

---

### Toán 10 – Bài 11. Tích vô hướng của hai vectơ *(Tiết 35–37)*

```mermaid
%%{init: {"theme": "base", "htmlLabels": true, "flowchart": {"htmlLabels": true, "padding": 10, "curve": "basis"}, "themeVariables": {"fontSize": "15px"}}}%%
graph TD
    G["🎯<BR/>BÀI<BR/>11<BR/>TÍCH<BR/>VÔ<BR/>HƯỚNG<BR/>CỦA<BR/>HAI<BR/>VECTƠ"]:::root
    G --> A["① Góc giữa hai<br/>vectơ"]:::n1
    G --> B["② Tích vô hướng"]:::n2
    G --> C["③ Biểu thức toạ<br/>độ"]:::n3
    G --> D["④ Tính chất –<br/>ứng dụng"]:::n4

    A --> A1["Vẽ chung gốc: (u→,<br/>v→) = góc BAC"]:::l1
    A --> A2["Từ 0° đến 180°"]:::l1
    A --> A3["★ 0°: cùng hướng;<br/>180°: ngược hướng"]:::l1
    A --> A4["u→ ⊥ v→ ⇔<br/>góc 90°"]:::l1

    B --> B1["★ u→·v→ = |u→|·|v→|·cos(u→,<br/>v→)"]:::l2
    B --> B2["★ u→ ⊥ v→<br/>⇔ u→·v→ = 0"]:::l2
    B --> B3["u→² = |u→|²"]:::l2
    B --> B4["Công A = F→·MN→"]:::l2

    C --> C1["★ u→·v→ = xx'<br/>+ yy'"]:::l3
    C --> C2["★ cos(u→, v→) =<br/>(xx' + yy') /<br/>(|u→|·|v→|)"]:::l3
    C --> C3["Vuông góc: xx' +<br/>yy' = 0"]:::l3

    D --> D1["Giao hoán, phân phối"]:::l4
    D --> D2["(u→ ± v→)² =<br/>u→² ± 2u→·v→ +<br/>v→²"]:::l4
    D --> D3["Trực tâm, giải tam<br/>giác"]:::l4
    D --> D4["Công của lực thành<br/>phần"]:::l4

    classDef root fill:#002060,color:#FFFFFF,stroke:#000B1E,stroke-width:2px,font-weight:bold
    classDef n1 fill:#E2EFDA,color:#000000,stroke:#375623,stroke-width:3px,font-weight:bold
    classDef n2 fill:#FFF2CC,color:#000000,stroke:#BF8F00,stroke-width:3px,font-weight:bold
    classDef n3 fill:#E2EFDA,color:#000000,stroke:#375623,stroke-width:3px,font-weight:bold
    classDef n4 fill:#FFF2CC,color:#000000,stroke:#BF8F00,stroke-width:3px,font-weight:bold
    classDef n5 fill:#E2EFDA,color:#000000,stroke:#375623,stroke-width:3px,font-weight:bold
    classDef l1 fill:#EDF5E8,color:#000000,stroke:#548235
    classDef l2 fill:#FFF8E1,color:#000000,stroke:#BF8F00
    classDef l3 fill:#E3EEF9,color:#000000,stroke:#2F5597
    classDef l4 fill:#F3E8F7,color:#000000,stroke:#7030A0
    classDef l5 fill:#FDE9E1,color:#000000,stroke:#C55A11
```

> **Bài củng cố:** <https://trangtu66.github.io/Taode_thi_online/cc_bai11_t10.html>

---

### Toán 10 – Bài tập cuối Chương IV. Vectơ *(Tiết 38)*

```mermaid
%%{init: {"theme": "base", "htmlLabels": true, "flowchart": {"htmlLabels": true, "padding": 10, "curve": "basis"}, "themeVariables": {"fontSize": "15px"}}}%%
graph TD
    G["🎯<BR/>CHƯƠNG IV<BR/>VECTƠ"]:::root
    G --> A["① Khái niệm"]:::n1
    G --> B["② Phép toán"]:::n2
    G --> C["③ Toạ độ"]:::n3
    G --> D["④ Tích vô hướng"]:::n4

    A --> A1["Vectơ, độ dài, giá"]:::l1
    A --> A2["★ Cùng phương, cùng<br/>hướng, bằng nhau"]:::l1
    A --> A3["Vectơ-không"]:::l1

    B --> B1["★ Quy tắc ba<br/>điểm, hình bình hành,<br/>hiệu"]:::l2
    B --> B2["★ k·a→: hướng theo<br/>dấu k, độ dài<br/>|k|·|a→|"]:::l2
    B --> B3["Trung điểm, trọng tâm"]:::l2
    B --> B4["Phân tích theo hai<br/>vectơ"]:::l2

    C --> C1["★ u→ = (x;<br/>y), MN→ = (x'<br/>− x; y' −<br/>y)"]:::l3
    C --> C2["Độ dài, khoảng cách"]:::l3
    C --> C3["Cùng phương: x' =<br/>kx, y' = ky"]:::l3
    C --> C4["Trung điểm, trọng tâm"]:::l3

    D --> D1["★ u→·v→ = |u→|·|v→|·cos(u→,<br/>v→)"]:::l4
    D --> D2["★ u→·v→ = xx'<br/>+ yy'"]:::l4
    D --> D3["u→ ⊥ v→ ⇔<br/>u→·v→ = 0"]:::l4
    D --> D4["Công của lực, giải<br/>tam giác"]:::l4

    classDef root fill:#002060,color:#FFFFFF,stroke:#000B1E,stroke-width:2px,font-weight:bold
    classDef n1 fill:#E2EFDA,color:#000000,stroke:#375623,stroke-width:3px,font-weight:bold
    classDef n2 fill:#FFF2CC,color:#000000,stroke:#BF8F00,stroke-width:3px,font-weight:bold
    classDef n3 fill:#E2EFDA,color:#000000,stroke:#375623,stroke-width:3px,font-weight:bold
    classDef n4 fill:#FFF2CC,color:#000000,stroke:#BF8F00,stroke-width:3px,font-weight:bold
    classDef n5 fill:#E2EFDA,color:#000000,stroke:#375623,stroke-width:3px,font-weight:bold
    classDef l1 fill:#EDF5E8,color:#000000,stroke:#548235
    classDef l2 fill:#FFF8E1,color:#000000,stroke:#BF8F00
    classDef l3 fill:#E3EEF9,color:#000000,stroke:#2F5597
    classDef l4 fill:#F3E8F7,color:#000000,stroke:#7030A0
    classDef l5 fill:#FDE9E1,color:#000000,stroke:#C55A11
```

> **Bài củng cố:** <https://trangtu66.github.io/Taode_thi_online/cc_chuong4_t10.html>

---

### Toán 10 – Bài 12. Số gần đúng và sai số *(Tiết 39–40)*

```mermaid
%%{init: {"theme": "base", "htmlLabels": true, "flowchart": {"htmlLabels": true, "padding": 10, "curve": "basis"}, "themeVariables": {"fontSize": "15px"}}}%%
graph TD
    G["🎯<BR/>BÀI<BR/>12<BR/>SỐ<BR/>GẦN<BR/>ĐÚNG<BR/>VÀ<BR/>SAI<BR/>SỐ"]:::root
    G --> A["① Số gần đúng"]:::n1
    G --> B["② Sai số tuyệt<br/>đối"]:::n2
    G --> C["③ Sai số tương<br/>đối"]:::n3
    G --> D["④ Quy tròn"]:::n4

    A --> A1["Số đúng a̅, số<br/>gần đúng a"]:::l1
    A --> A2["Kết quả đo đạc,<br/>tính toán"]:::l1
    A --> A3["Máy tính cầm tay:<br/>π, √a"]:::l1

    B --> B1["★ Δa = |a<br/>− a̅|"]:::l2
    B --> B2["★ a̅ = a<br/>± d ⇔ a<br/>− d ≤ a̅<br/>≤ a + d"]:::l2
    B --> B3["d: độ chính xác"]:::l2
    B --> B4["Đo: d = nửa<br/>đơn vị thước"]:::l2

    C --> C1["★ δa = Δa<br/>/ |a| ≤ d<br/>/ |a|"]:::l3
    C --> C2["Viết dạng phần trăm"]:::l3
    C --> C3["So sánh chất lượng<br/>phép đo"]:::l3

    D --> D1["Chữ số sau <<br/>5: giữ; ≥ 5:<br/>tăng 1"]:::l4
    D --> D2["★ Sai số ≤<br/>nửa đơn vị hàng<br/>làm tròn"]:::l4
    D --> D3["★ Biết d: tròn<br/>đến hàng thấp nhất<br/>mà d < 1<br/>đơn vị"]:::l4

    classDef root fill:#002060,color:#FFFFFF,stroke:#000B1E,stroke-width:2px,font-weight:bold
    classDef n1 fill:#E2EFDA,color:#000000,stroke:#375623,stroke-width:3px,font-weight:bold
    classDef n2 fill:#FFF2CC,color:#000000,stroke:#BF8F00,stroke-width:3px,font-weight:bold
    classDef n3 fill:#E2EFDA,color:#000000,stroke:#375623,stroke-width:3px,font-weight:bold
    classDef n4 fill:#FFF2CC,color:#000000,stroke:#BF8F00,stroke-width:3px,font-weight:bold
    classDef n5 fill:#E2EFDA,color:#000000,stroke:#375623,stroke-width:3px,font-weight:bold
    classDef l1 fill:#EDF5E8,color:#000000,stroke:#548235
    classDef l2 fill:#FFF8E1,color:#000000,stroke:#BF8F00
    classDef l3 fill:#E3EEF9,color:#000000,stroke:#2F5597
    classDef l4 fill:#F3E8F7,color:#000000,stroke:#7030A0
    classDef l5 fill:#FDE9E1,color:#000000,stroke:#C55A11
```

> **Bài củng cố:** <https://trangtu66.github.io/Taode_thi_online/cc_bai12_t10.html>

---

### Toán 10 – Bài 13. Các số đặc trưng đo xu thế trung tâm *(Tiết 41–42)*

```mermaid
%%{init: {"theme": "base", "htmlLabels": true, "flowchart": {"htmlLabels": true, "padding": 10, "curve": "basis"}, "themeVariables": {"fontSize": "15px"}}}%%
graph TD
    G["🎯<BR/>BÀI<BR/>13<BR/>CÁC<BR/>SỐ<BR/>ĐẶC<BR/>TRƯNG<BR/>ĐO<BR/>XU<BR/>THẾ<BR/>TRUNG<BR/>TÂM"]:::root
    G --> A["① Số trung bình"]:::n1
    G --> B["② Trung vị Me"]:::n2
    G --> C["③ Tứ phân vị"]:::n3
    G --> D["④ Mốt"]:::n4

    A --> A1["★ x̄ = (x₁<br/>+ … + xₙ)<br/>/ n"]:::l1
    A --> A2["Bảng tần số: x̄<br/>= (m₁x₁ + …<br/>+ mₖxₖ) / n"]:::l1
    A --> A3["Bị ảnh hưởng bởi<br/>giá trị bất thường"]:::l1

    B --> B1["Sắp xếp không giảm"]:::l2
    B --> B2["★ n lẻ: giá<br/>trị chính giữa; n<br/>chẵn: TB hai giá<br/>trị giữa"]:::l2
    B --> B3["Dùng khi có giá<br/>trị bất thường"]:::l2

    C --> C1["★ Q₂ = Me"]:::l3
    C --> C2["★ Q₁, Q₃: trung<br/>vị nửa trái, nửa<br/>phải"]:::l3
    C --> C3["Chia mẫu thành 4<br/>phần, mỗi phần 25%"]:::l3

    D --> D1["★ Giá trị có<br/>tần số lớn nhất"]:::l4
    D --> D2["Có thể nhiều mốt<br/>hoặc không có"]:::l4
    D --> D3["Dùng cả cho dữ<br/>liệu định tính"]:::l4

    classDef root fill:#002060,color:#FFFFFF,stroke:#000B1E,stroke-width:2px,font-weight:bold
    classDef n1 fill:#E2EFDA,color:#000000,stroke:#375623,stroke-width:3px,font-weight:bold
    classDef n2 fill:#FFF2CC,color:#000000,stroke:#BF8F00,stroke-width:3px,font-weight:bold
    classDef n3 fill:#E2EFDA,color:#000000,stroke:#375623,stroke-width:3px,font-weight:bold
    classDef n4 fill:#FFF2CC,color:#000000,stroke:#BF8F00,stroke-width:3px,font-weight:bold
    classDef n5 fill:#E2EFDA,color:#000000,stroke:#375623,stroke-width:3px,font-weight:bold
    classDef l1 fill:#EDF5E8,color:#000000,stroke:#548235
    classDef l2 fill:#FFF8E1,color:#000000,stroke:#BF8F00
    classDef l3 fill:#E3EEF9,color:#000000,stroke:#2F5597
    classDef l4 fill:#F3E8F7,color:#000000,stroke:#7030A0
    classDef l5 fill:#FDE9E1,color:#000000,stroke:#C55A11
```

> **Bài củng cố:** <https://trangtu66.github.io/Taode_thi_online/cc_bai13_t10.html>

---

### Toán 10 – Bài 14. Các số đặc trưng đo độ phân tán *(Tiết 43–45)*

```mermaid
%%{init: {"theme": "base", "htmlLabels": true, "flowchart": {"htmlLabels": true, "padding": 10, "curve": "basis"}, "themeVariables": {"fontSize": "15px"}}}%%
graph TD
    G["🎯<BR/>BÀI<BR/>14<BR/>CÁC<BR/>SỐ<BR/>ĐẶC<BR/>TRƯNG<BR/>ĐO<BR/>ĐỘ<BR/>PHÂN<BR/>TÁN"]:::root
    G --> A["① Khoảng biến thiên<br/>R"]:::n1
    G --> B["② Khoảng tứ phân<br/>vị"]:::n2
    G --> C["③ Phương sai –<br/>độ lệch chuẩn"]:::n3
    G --> D["④ Giá trị bất<br/>thường"]:::n4

    A --> A1["★ R = giá<br/>trị lớn nhất −<br/>giá trị nhỏ nhất"]:::l1
    A --> A2["Đơn giản, dễ tính"]:::l1
    A --> A3["Dễ bị ảnh hưởng<br/>bởi giá trị bất<br/>thường"]:::l1

    B --> B1["★ ΔQ = Q₃<br/>− Q₁"]:::l2
    B --> B2["Độ trải của 50%<br/>số liệu chính giữa"]:::l2
    B --> B3["Ít bị ảnh hưởng<br/>bởi giá trị bất<br/>thường"]:::l2

    C --> C1["★ s² = Σ(xᵢ<br/>− x̄)² / n"]:::l3
    C --> C2["★ s = √s²"]:::l3
    C --> C3["Dùng mọi giá trị<br/>của mẫu"]:::l3
    C --> C4["Càng lớn càng phân<br/>tán"]:::l3

    D --> D1["★ x > Q₃<br/>+ 1,5·ΔQ"]:::l4
    D --> D2["★ x < Q₁<br/>− 1,5·ΔQ"]:::l4
    D --> D3["Biểu đồ hộp"]:::l4
    D --> D4["Do nhầm lẫn, sai<br/>sót"]:::l4

    classDef root fill:#002060,color:#FFFFFF,stroke:#000B1E,stroke-width:2px,font-weight:bold
    classDef n1 fill:#E2EFDA,color:#000000,stroke:#375623,stroke-width:3px,font-weight:bold
    classDef n2 fill:#FFF2CC,color:#000000,stroke:#BF8F00,stroke-width:3px,font-weight:bold
    classDef n3 fill:#E2EFDA,color:#000000,stroke:#375623,stroke-width:3px,font-weight:bold
    classDef n4 fill:#FFF2CC,color:#000000,stroke:#BF8F00,stroke-width:3px,font-weight:bold
    classDef n5 fill:#E2EFDA,color:#000000,stroke:#375623,stroke-width:3px,font-weight:bold
    classDef l1 fill:#EDF5E8,color:#000000,stroke:#548235
    classDef l2 fill:#FFF8E1,color:#000000,stroke:#BF8F00
    classDef l3 fill:#E3EEF9,color:#000000,stroke:#2F5597
    classDef l4 fill:#F3E8F7,color:#000000,stroke:#7030A0
    classDef l5 fill:#FDE9E1,color:#000000,stroke:#C55A11
```

> **Bài củng cố:** <https://trangtu66.github.io/Taode_thi_online/cc_bai14_t10.html>

---

### Toán 10 – Bài tập cuối Chương V. Các số đặc trưng của mẫu số liệu không ghép nhóm *(Tiết 46)*

```mermaid
%%{init: {"theme": "base", "htmlLabels": true, "flowchart": {"htmlLabels": true, "padding": 10, "curve": "basis"}, "themeVariables": {"fontSize": "15px"}}}%%
graph TD
    G["🎯<BR/>CHƯƠNG<BR/>V<BR/>CÁC<BR/>SỐ<BR/>ĐẶC<BR/>TRƯNG<BR/>CỦA<BR/>MẪU<BR/>SỐ<BR/>LIỆU"]:::root
    G --> A["① Số gần đúng<br/>– sai số"]:::n1
    G --> B["② Xu thế trung<br/>tâm"]:::n2
    G --> C["③ Độ phân tán"]:::n3
    G --> D["④ Giá trị bất<br/>thường"]:::n4

    A --> A1["★ a̅ = a<br/>± d"]:::l1
    A --> A2["★ δa ≤ d<br/>/ |a|"]:::l1
    A --> A3["Quy tròn theo độ<br/>chính xác"]:::l1

    B --> B1["★ Số trung bình<br/>x̄"]:::l2
    B --> B2["★ Trung vị, tứ<br/>phân vị"]:::l2
    B --> B3["Mốt"]:::l2
    B --> B4["Có giá trị bất<br/>thường: dùng trung vị"]:::l2

    C --> C1["★ R, ΔQ =<br/>Q₃ − Q₁"]:::l3
    C --> C2["★ s² = Σ(xᵢ<br/>− x̄)² / n,<br/>s = √s²"]:::l3
    C --> C3["Càng lớn càng phân<br/>tán"]:::l3

    D --> D1["★ Ngoài [Q₁ −<br/>1,5ΔQ; Q₃ + 1,5ΔQ]"]:::l4
    D --> D2["Biểu đồ hộp"]:::l4
    D --> D3["Kiểm tra lại nguồn<br/>số liệu"]:::l4

    classDef root fill:#002060,color:#FFFFFF,stroke:#000B1E,stroke-width:2px,font-weight:bold
    classDef n1 fill:#E2EFDA,color:#000000,stroke:#375623,stroke-width:3px,font-weight:bold
    classDef n2 fill:#FFF2CC,color:#000000,stroke:#BF8F00,stroke-width:3px,font-weight:bold
    classDef n3 fill:#E2EFDA,color:#000000,stroke:#375623,stroke-width:3px,font-weight:bold
    classDef n4 fill:#FFF2CC,color:#000000,stroke:#BF8F00,stroke-width:3px,font-weight:bold
    classDef n5 fill:#E2EFDA,color:#000000,stroke:#375623,stroke-width:3px,font-weight:bold
    classDef l1 fill:#EDF5E8,color:#000000,stroke:#548235
    classDef l2 fill:#FFF8E1,color:#000000,stroke:#BF8F00
    classDef l3 fill:#E3EEF9,color:#000000,stroke:#2F5597
    classDef l4 fill:#F3E8F7,color:#000000,stroke:#7030A0
    classDef l5 fill:#FDE9E1,color:#000000,stroke:#C55A11
```

> **Bài củng cố:** <https://trangtu66.github.io/Taode_thi_online/cc_chuong5_t10.html>

---

### Toán 10 – Ôn tập kiểm tra cuối kì I *(Tiết 47–48)*

```mermaid
%%{init: {"theme": "base", "htmlLabels": true, "flowchart": {"htmlLabels": true, "padding": 10, "curve": "basis"}, "themeVariables": {"fontSize": "15px"}}}%%
graph TD
    G["🎯<BR/>ÔN TẬP<BR/>CUỐI KÌ I"]:::root
    G --> A["① Chương I –<br/>II"]:::n1
    G --> B["② Chương III –<br/>Tam giác"]:::n2
    G --> C["③ Chương IV –<br/>Vectơ"]:::n3
    G --> D["④ Chương V –<br/>Thống kê"]:::n4

    A --> A1["Mệnh đề, phủ định"]:::l1
    A --> A2["★ Phép toán tập<br/>hợp"]:::l1
    A --> A3["Miền nghiệm BPT, hệ<br/>BPT"]:::l1
    A --> A4["★ Max – min<br/>F = ax +<br/>by"]:::l1

    B --> B1["★ GTLG góc 0°<br/>– 180°"]:::l2
    B --> B2["★ Định lí côsin,<br/>sin"]:::l2
    B --> B3["Diện tích, R, đường<br/>cao"]:::l2
    B --> B4["Đo đạc thực tế"]:::l2

    C --> C1["Quy tắc ba điểm,<br/>HBH, hiệu"]:::l3
    C --> C2["★ Toạ độ vectơ,<br/>trung điểm, trọng tâm"]:::l3
    C --> C3["★ Tích vô hướng,<br/>vuông góc"]:::l3
    C --> C4["Góc giữa hai vectơ"]:::l3

    D --> D1["Số gần đúng, quy<br/>tròn"]:::l4
    D --> D2["★ Trung bình, trung<br/>vị, tứ phân vị,<br/>mốt"]:::l4
    D --> D3["★ R, ΔQ, s²,<br/>s"]:::l4
    D --> D4["Giá trị bất thường"]:::l4

    classDef root fill:#002060,color:#FFFFFF,stroke:#000B1E,stroke-width:2px,font-weight:bold
    classDef n1 fill:#E2EFDA,color:#000000,stroke:#375623,stroke-width:3px,font-weight:bold
    classDef n2 fill:#FFF2CC,color:#000000,stroke:#BF8F00,stroke-width:3px,font-weight:bold
    classDef n3 fill:#E2EFDA,color:#000000,stroke:#375623,stroke-width:3px,font-weight:bold
    classDef n4 fill:#FFF2CC,color:#000000,stroke:#BF8F00,stroke-width:3px,font-weight:bold
    classDef n5 fill:#E2EFDA,color:#000000,stroke:#375623,stroke-width:3px,font-weight:bold
    classDef l1 fill:#EDF5E8,color:#000000,stroke:#548235
    classDef l2 fill:#FFF8E1,color:#000000,stroke:#BF8F00
    classDef l3 fill:#E3EEF9,color:#000000,stroke:#2F5597
    classDef l4 fill:#F3E8F7,color:#000000,stroke:#7030A0
    classDef l5 fill:#FDE9E1,color:#000000,stroke:#C55A11
```

> **Bài củng cố:** <https://trangtu66.github.io/Taode_thi_online/cc_ontapck1_t10.html>

---

### Toán 10 – HĐTN. Tìm hiểu một số kiến thức về tài chính *(Tiết 51–52)*

```mermaid
%%{init: {"theme": "base", "htmlLabels": true, "flowchart": {"htmlLabels": true, "padding": 10, "curve": "basis"}, "themeVariables": {"fontSize": "15px"}}}%%
graph TD
    G["🎯<BR/>HĐTN<BR/>KIẾN<BR/>THỨC<BR/>TÀI<BR/>CHÍNH"]:::root
    G --> A["① Tiết kiệm"]:::n1
    G --> B["② Đầu tư cổ<br/>phiếu"]:::n2
    G --> C["③ Thuế thu nhập<br/>cá nhân"]:::n3
    G --> D["④ Quản lí tài<br/>chính cá nhân"]:::n4

    A --> A1["★ Lãi kép: T<br/>= A(1 + r%)ⁿ"]:::l1
    A --> A2["Kì hạn tháng: r/12<br/>mỗi tháng"]:::l1
    A --> A3["Lưu giữ giá trị,<br/>an toàn"]:::l1

    B --> B1["Đọc biểu đồ giá<br/>cổ phiếu"]:::l2
    B --> B2["★ Tiền thu =<br/>số cổ phiếu ×<br/>giá"]:::l2
    B --> B3["Có thể lãi hoặc<br/>lỗ – rủi ro"]:::l2

    C --> C1["★ TN tính thuế<br/>= TN chịu thuế<br/>− giảm trừ"]:::l3
    C --> C2["★ Biểu thuế luỹ<br/>tiến 7 bậc"]:::l3
    C --> C3["Hàm bậc nhất theo<br/>từng khoảng"]:::l3

    D --> D1["So sánh tiết kiệm<br/>– đầu tư"]:::l4
    D --> D2["Kế hoạch chi tiêu<br/>gia đình"]:::l4
    D --> D3["Bán nông sản, gửi<br/>tiết kiệm"]:::l4

    classDef root fill:#002060,color:#FFFFFF,stroke:#000B1E,stroke-width:2px,font-weight:bold
    classDef n1 fill:#E2EFDA,color:#000000,stroke:#375623,stroke-width:3px,font-weight:bold
    classDef n2 fill:#FFF2CC,color:#000000,stroke:#BF8F00,stroke-width:3px,font-weight:bold
    classDef n3 fill:#E2EFDA,color:#000000,stroke:#375623,stroke-width:3px,font-weight:bold
    classDef n4 fill:#FFF2CC,color:#000000,stroke:#BF8F00,stroke-width:3px,font-weight:bold
    classDef n5 fill:#E2EFDA,color:#000000,stroke:#375623,stroke-width:3px,font-weight:bold
    classDef l1 fill:#EDF5E8,color:#000000,stroke:#548235
    classDef l2 fill:#FFF8E1,color:#000000,stroke:#BF8F00
    classDef l3 fill:#E3EEF9,color:#000000,stroke:#2F5597
    classDef l4 fill:#F3E8F7,color:#000000,stroke:#7030A0
    classDef l5 fill:#FDE9E1,color:#000000,stroke:#C55A11
```

> **Bài củng cố:** <https://trangtu66.github.io/Taode_thi_online/cc_taichinh_t10.html>

---

### Toán 10 – HĐTN. Mạng xã hội: lợi và hại *(Tiết 53–54)*

```mermaid
%%{init: {"theme": "base", "htmlLabels": true, "flowchart": {"htmlLabels": true, "padding": 10, "curve": "basis"}, "themeVariables": {"fontSize": "15px"}}}%%
graph TD
    G["🎯<BR/>HĐTN<BR/>MẠNG<BR/>XÃ<BR/>HỘI:<BR/>LỢI<BR/>VÀ<BR/>HẠI"]:::root
    G --> A["① Thu thập dữ<br/>liệu"]:::n1
    G --> B["② Xử lí số<br/>liệu"]:::n2
    G --> C["③ Công nghệ thông<br/>tin"]:::n3
    G --> D["④ Kết luận, hành<br/>động"]:::n4

    A --> A1["Phiếu khảo sát 4<br/>câu hỏi"]:::l1
    A --> A2["★ Ít nhất 30<br/>phiếu"]:::l1
    A --> A3["Google Forms – trung<br/>thực"]:::l1

    B --> B1["★ Bảng tần số<br/>lợi ích/bất lợi"]:::l2
    B --> B2["Số trung bình, trung<br/>vị, Q1, Q3, mốt"]:::l2
    B --> B3["★ R, ΔQ, độ<br/>lệch chuẩn"]:::l2

    C --> C1["Máy tính cầm tay:<br/>MODE 3 1"]:::l3
    C --> C2["★ AVERAGE, MEDIAN, QUARTILE"]:::l3
    C --> C3["STDEVP, VARP; Data Analysis"]:::l3

    D --> D1["So sánh nam –<br/>nữ"]:::l4
    D --> D2["Giá trị bất thường"]:::l4
    D --> D3["Dùng mạng xã hội<br/>an toàn"]:::l4

    classDef root fill:#002060,color:#FFFFFF,stroke:#000B1E,stroke-width:2px,font-weight:bold
    classDef n1 fill:#E2EFDA,color:#000000,stroke:#375623,stroke-width:3px,font-weight:bold
    classDef n2 fill:#FFF2CC,color:#000000,stroke:#BF8F00,stroke-width:3px,font-weight:bold
    classDef n3 fill:#E2EFDA,color:#000000,stroke:#375623,stroke-width:3px,font-weight:bold
    classDef n4 fill:#FFF2CC,color:#000000,stroke:#BF8F00,stroke-width:3px,font-weight:bold
    classDef n5 fill:#E2EFDA,color:#000000,stroke:#375623,stroke-width:3px,font-weight:bold
    classDef l1 fill:#EDF5E8,color:#000000,stroke:#548235
    classDef l2 fill:#FFF8E1,color:#000000,stroke:#BF8F00
    classDef l3 fill:#E3EEF9,color:#000000,stroke:#2F5597
    classDef l4 fill:#F3E8F7,color:#000000,stroke:#7030A0
    classDef l5 fill:#FDE9E1,color:#000000,stroke:#C55A11
```

> **Bài củng cố:** <https://trangtu66.github.io/Taode_thi_online/cc_mxh_t10.html>

---

### Toán 10 – Ôn tập kiểm tra giữa kì I *(Tiết 23)*

```mermaid
%%{init: {"theme": "base", "htmlLabels": true, "flowchart": {"htmlLabels": true, "padding": 10, "curve": "basis"}, "themeVariables": {"fontSize": "15px"}}}%%
graph TD
    G["🎯<BR/>ÔN TẬP<BR/>GIỮA KÌ I"]:::root
    G --> A["① Mệnh đề"]:::n1
    G --> B["② Tập hợp"]:::n2
    G --> C["③ BPT, hệ BPT<br/>bậc nhất hai ẩn"]:::n3
    G --> D["④ Hệ thức lượng"]:::n4

    A --> A1["Mệnh đề, mệnh đề<br/>chứa biến"]:::l1
    A --> A2["★ Phủ định; ∀,<br/>∃"]:::l1
    A --> A3["Kéo theo, đảo, tương<br/>đương"]:::l1

    B --> B1["Liệt kê, chỉ ra<br/>tính chất"]:::l2
    B --> B2["★ Giao, hợp, hiệu,<br/>phần bù"]:::l2
    B --> B3["★ Khoảng, đoạn trên<br/>trục số"]:::l2

    C --> C1["Biểu diễn miền nghiệm"]:::l3
    C --> C2["★ Max – min<br/>F = ax +<br/>by tại đỉnh"]:::l3
    C --> C3["Bài toán kinh tế,<br/>nông nghiệp"]:::l3

    D --> D1["★ GTLG góc 0°<br/>– 180°"]:::l4
    D --> D2["★ Định lí côsin,<br/>sin"]:::l4
    D --> D3["Diện tích, R; đo<br/>đạc thực tế"]:::l4

    classDef root fill:#002060,color:#FFFFFF,stroke:#000B1E,stroke-width:2px,font-weight:bold
    classDef n1 fill:#E2EFDA,color:#000000,stroke:#375623,stroke-width:3px,font-weight:bold
    classDef n2 fill:#FFF2CC,color:#000000,stroke:#BF8F00,stroke-width:3px,font-weight:bold
    classDef n3 fill:#E2EFDA,color:#000000,stroke:#375623,stroke-width:3px,font-weight:bold
    classDef n4 fill:#FFF2CC,color:#000000,stroke:#BF8F00,stroke-width:3px,font-weight:bold
    classDef n5 fill:#E2EFDA,color:#000000,stroke:#375623,stroke-width:3px,font-weight:bold
    classDef l1 fill:#EDF5E8,color:#000000,stroke:#548235
    classDef l2 fill:#FFF8E1,color:#000000,stroke:#BF8F00
    classDef l3 fill:#E3EEF9,color:#000000,stroke:#2F5597
    classDef l4 fill:#F3E8F7,color:#000000,stroke:#7030A0
    classDef l5 fill:#FDE9E1,color:#000000,stroke:#C55A11
```

> **Bài củng cố:** <https://trangtu66.github.io/Taode_thi_online/cc_ontapgk1_t10.html>

---

### Toán 10 – Chuyên đề 1, Bài 2. Ứng dụng của hệ phương trình bậc nhất ba ẩn *(Tiết 6–9 (chuyên đề))*

```mermaid
%%{init: {"theme": "base", "htmlLabels": true, "flowchart": {"htmlLabels": true, "padding": 10, "curve": "basis"}, "themeVariables": {"fontSize": "15px"}}}%%
graph TD
    G["🎯<BR/>CĐ1<BR/>–<BR/>BÀI<BR/>2<BR/>ỨNG<BR/>DỤNG<BR/>CỦA<BR/>HỆ<BR/>PHƯƠNG<BR/>TRÌNH<BR/>BẬC<BR/>NHẤT<BR/>BA<BR/>ẨN"]:::root
    G --> A["① Ba bước giải"]:::n1
    G --> B["② Hoá học"]:::n2
    G --> C["③ Vật lí"]:::n3
    G --> D["④ Cung – cầu"]:::n4

    A --> A1["B1: chọn ẩn, đặt<br/>điều kiện, lập hệ"]:::l1
    A --> A2["B2: giải hệ (Gauss,<br/>máy tính)"]:::l1
    A --> A3["★ B3: kiểm tra<br/>điều kiện, kết luận"]:::l1
    A --> A4["Gà giống, rừng ngập<br/>mặn"]:::l1

    B --> B1["Bảo toàn số nguyên<br/>tử mỗi nguyên tố"]:::l2
    B --> B2["Vô số nghiệm: chọn<br/>nguyên dương nhỏ nhất"]:::l2
    B --> B3["★ 6CO₂ + 6H₂O<br/>→ C₆H₁₂O₆ + 6O₂"]:::l2
    B --> B4["Đốt octane, methane"]:::l2

    C --> C1["Tại nút: I₁ =<br/>I₂ + I₃"]:::l3
    C --> C2["Định luật Ohm: U<br/>= I·R"]:::l3
    C --> C3["Nhánh song song: cùng<br/>hiệu điện thế"]:::l3
    C --> C4["★ Lập hệ ẩn<br/>I₁, I₂, I₃"]:::l3

    D --> D1["Hàm cung QS, hàm<br/>cầu QD"]:::l4
    D --> D2["★ QSᵢ = QDᵢ<br/>(i = 1, 2,<br/>3)"]:::l4
    D --> D3["Giá hợp lí nhất<br/>cho người mua, người<br/>bán"]:::l4
    D --> D4["Mô hình Leontief"]:::l4

    classDef root fill:#002060,color:#FFFFFF,stroke:#000B1E,stroke-width:2px,font-weight:bold
    classDef n1 fill:#E2EFDA,color:#000000,stroke:#375623,stroke-width:3px,font-weight:bold
    classDef n2 fill:#FFF2CC,color:#000000,stroke:#BF8F00,stroke-width:3px,font-weight:bold
    classDef n3 fill:#E2EFDA,color:#000000,stroke:#375623,stroke-width:3px,font-weight:bold
    classDef n4 fill:#FFF2CC,color:#000000,stroke:#BF8F00,stroke-width:3px,font-weight:bold
    classDef n5 fill:#E2EFDA,color:#000000,stroke:#375623,stroke-width:3px,font-weight:bold
    classDef l1 fill:#EDF5E8,color:#000000,stroke:#548235
    classDef l2 fill:#FFF8E1,color:#000000,stroke:#BF8F00
    classDef l3 fill:#E3EEF9,color:#000000,stroke:#2F5597
    classDef l4 fill:#F3E8F7,color:#000000,stroke:#7030A0
    classDef l5 fill:#FDE9E1,color:#000000,stroke:#C55A11
```

> **Bài củng cố:** <https://trangtu66.github.io/Taode_thi_online/cc_cd1bai2_t10.html>

---

### Toán 10 – Bài tập cuối chuyên đề 1. Hệ phương trình bậc nhất ba ẩn *(Tiết 10–11 (chuyên đề))*

```mermaid
%%{init: {"theme": "base", "htmlLabels": true, "flowchart": {"htmlLabels": true, "padding": 10, "curve": "basis"}, "themeVariables": {"fontSize": "15px"}}}%%
graph TD
    G["🎯<BR/>BÀI<BR/>TẬP<BR/>CUỐI<BR/>CHUYÊN<BR/>ĐỀ<BR/>1<BR/>HỆ<BR/>PT<BR/>BẬC<BR/>NHẤT<BR/>BA<BR/>ẨN"]:::root
    G --> A["① Giải hệ ba<br/>ẩn"]:::n1
    G --> B["② Bài toán toán<br/>học"]:::n2
    G --> C["③ Liên môn"]:::n3
    G --> D["④ Thực tiễn"]:::n4

    A --> A1["Dạng tam giác: thế<br/>ngược"]:::l1
    A --> A2["★ Gauss: khử dần<br/>ẩn"]:::l1
    A --> A3["Duy nhất / vô<br/>nghiệm / vô số<br/>nghiệm"]:::l1
    A --> A4["Máy tính cầm tay<br/>kiểm tra"]:::l1

    B --> B1["Đồng nhất hệ số<br/>(1.16)"]:::l2
    B --> B2["★ Parabol qua 3<br/>điểm (1.17)"]:::l2
    B --> B3["Đường tròn qua 3<br/>điểm (1.18)"]:::l2
    B --> B4["Lập hệ từ điều<br/>kiện"]:::l2

    C --> C1["Cân bằng phản ứng<br/>(1.22)"]:::l3
    C --> C2["Pha dung dịch acid<br/>(1.23)"]:::l3
    C --> C3["Mạch điện: nút, Ohm<br/>(1.24)"]:::l3
    C --> C4["Cân bằng cung –<br/>cầu"]:::l3

    D --> D1["★ Lập hệ –<br/>giải – kiểm tra"]:::l4
    D --> D2["Xe chở gạo cứu<br/>trợ (1.19)"]:::l4
    D --> D3["Trộn cà phê, chia<br/>đất (1.20, 1.21)"]:::l4
    D --> D4["Bài toán dân gian<br/>(1.25, 1.26)"]:::l4

    classDef root fill:#002060,color:#FFFFFF,stroke:#000B1E,stroke-width:2px,font-weight:bold
    classDef n1 fill:#E2EFDA,color:#000000,stroke:#375623,stroke-width:3px,font-weight:bold
    classDef n2 fill:#FFF2CC,color:#000000,stroke:#BF8F00,stroke-width:3px,font-weight:bold
    classDef n3 fill:#E2EFDA,color:#000000,stroke:#375623,stroke-width:3px,font-weight:bold
    classDef n4 fill:#FFF2CC,color:#000000,stroke:#BF8F00,stroke-width:3px,font-weight:bold
    classDef n5 fill:#E2EFDA,color:#000000,stroke:#375623,stroke-width:3px,font-weight:bold
    classDef l1 fill:#EDF5E8,color:#000000,stroke:#548235
    classDef l2 fill:#FFF8E1,color:#000000,stroke:#BF8F00
    classDef l3 fill:#E3EEF9,color:#000000,stroke:#2F5597
    classDef l4 fill:#F3E8F7,color:#000000,stroke:#7030A0
    classDef l5 fill:#FDE9E1,color:#000000,stroke:#C55A11
```

> **Bài củng cố:** <https://trangtu66.github.io/Taode_thi_online/cc_btcccd1_t10.html>

---

## 📌 Sơ đồ tư duy từng bài – Toán 11

### Toán 11 – Bài 1. Góc lượng giác – Giá trị lượng giác *(Tiết 1–4)*

```mermaid
%%{init: {"theme": "base", "htmlLabels": true, "flowchart": {"htmlLabels": true, "padding": 10, "curve": "basis"}, "themeVariables": {"fontSize": "15px"}}}%%
graph TD
    G["🎯<BR/>BÀI<BR/>1<BR/>·<BR/>TOÁN<BR/>11<BR/>GÓC<BR/>LƯỢNG<BR/>GIÁC<BR/>&<BR/>GIÁ<BR/>TRỊ<BR/>LG"]:::root
    G --> A["① Góc lượng giác<br/>& đường tròn ĐV"]:::n1
    G --> B["② Giá trị lượng<br/>giác<br/>của góc α bất<br/>kỳ"]:::n2
    G --> C["③ Hệ thức cơ<br/>bản"]:::n3
    G --> D["④ Giá trị LG<br/>của các góc đặc<br/>biệt"]:::n4

    A --> A1["Chiều dương: ngược chiều<br/>kim đồng hồ"]:::l1
    A --> A2["Góc LG: α +<br/>k·360°, k ∈ ℤ"]:::l1
    A --> A3["Đường tròn đơn vị<br/>bán kính 1"]:::l1

    B --> B1["sinα = tung độ<br/>M(cosα; sinα)"]:::l2
    B --> B2["cosα = hoành độ<br/>M"]:::l2
    B --> B3["tanα = sinα/cosα (cosα<br/>≠ 0)"]:::l2
    B --> B4["Dấu theo góc phần<br/>tư"]:::l2

    C --> C1["sin²α + cos²α =<br/>1"]:::l3
    C --> C2["1 + tan²α =<br/>1/cos²α"]:::l3
    C --> C3["1 + cot²α =<br/>1/sin²α"]:::l3

    D --> D1["0°, 30°, 45°, 60°,<br/>90°, 180°, 270°, 360°"]:::l4
    D --> D2["Góc bù, phụ, đối,<br/>hơn 90°"]:::l4

    classDef root fill:#002060,color:#FFFFFF,stroke:#000B1E,stroke-width:2px,font-weight:bold
    classDef n1 fill:#E2EFDA,color:#000000,stroke:#375623,stroke-width:3px,font-weight:bold
    classDef n2 fill:#FFF2CC,color:#000000,stroke:#BF8F00,stroke-width:3px,font-weight:bold
    classDef n3 fill:#E2EFDA,color:#000000,stroke:#375623,stroke-width:3px,font-weight:bold
    classDef n4 fill:#FFF2CC,color:#000000,stroke:#BF8F00,stroke-width:3px,font-weight:bold
    classDef n5 fill:#E2EFDA,color:#000000,stroke:#375623,stroke-width:3px,font-weight:bold
    classDef l1 fill:#EDF5E8,color:#000000,stroke:#548235
    classDef l2 fill:#FFF8E1,color:#000000,stroke:#BF8F00
    classDef l3 fill:#E3EEF9,color:#000000,stroke:#2F5597
    classDef l4 fill:#F3E8F7,color:#000000,stroke:#7030A0
    classDef l5 fill:#FDE9E1,color:#000000,stroke:#C55A11
```

> **Bài củng cố:** <https://trangtu66.github.io/Taode_thi_online/cc_bai1_t11.html>

---

### Toán 11 – Bài 2. Công thức lượng giác *(Tiết 5–7)*

```mermaid
%%{init: {"theme": "base", "htmlLabels": true, "flowchart": {"htmlLabels": true, "padding": 10, "curve": "basis"}, "themeVariables": {"fontSize": "15px"}}}%%
graph TD
    G["🎯<BR/>BÀI<BR/>2<BR/>·<BR/>TOÁN<BR/>11<BR/>CÔNG<BR/>THỨC<BR/>LƯỢNG<BR/>GIÁC"]:::root
    G --> A["① Công thức<br/>cộng"]:::n1
    G --> B["② Công thức<br/>nhân đôi"]:::n2
    G --> C["③ Công thức<br/>hạ bậc"]:::n3
    G --> D["④ Tích → Tổng<br/>Tổng → Tích"]:::n4

    A --> A1["sin(a±b) = sinacosb ±<br/>cosasinb"]:::l1
    A --> A2["cos(a±b) = cosacosb ∓<br/>sinasinb"]:::l1
    A --> A3["tan(a±b) =<br/>(tana±tanb)/(1∓tanatanb)"]:::l1

    B --> B1["sin2a = 2sinacosa"]:::l2
    B --> B2["cos2a = cos²a−sin²a =<br/>2cos²a−1 = 1−2sin²a"]:::l2
    B --> B3["tan2a = 2tana/(1−tan²a)"]:::l2

    C --> C1["cos²a = (1+cos2a)/2"]:::l3
    C --> C2["sin²a = (1−cos2a)/2"]:::l3

    D --> D1["2sinacosb =<br/>sin(a+b)+sin(a−b)"]:::l4
    D --> D2["sina+sinb =<br/>2sin((a+b)/2)cos((a−b)/2)"]:::l4
    D --> D3["cosa+cosb =<br/>2cos((a+b)/2)cos((a−b)/2)"]:::l4

    classDef root fill:#002060,color:#FFFFFF,stroke:#000B1E,stroke-width:2px,font-weight:bold
    classDef n1 fill:#E2EFDA,color:#000000,stroke:#375623,stroke-width:3px,font-weight:bold
    classDef n2 fill:#FFF2CC,color:#000000,stroke:#BF8F00,stroke-width:3px,font-weight:bold
    classDef n3 fill:#E2EFDA,color:#000000,stroke:#375623,stroke-width:3px,font-weight:bold
    classDef n4 fill:#FFF2CC,color:#000000,stroke:#BF8F00,stroke-width:3px,font-weight:bold
    classDef n5 fill:#E2EFDA,color:#000000,stroke:#375623,stroke-width:3px,font-weight:bold
    classDef l1 fill:#EDF5E8,color:#000000,stroke:#548235
    classDef l2 fill:#FFF8E1,color:#000000,stroke:#BF8F00
    classDef l3 fill:#E3EEF9,color:#000000,stroke:#2F5597
    classDef l4 fill:#F3E8F7,color:#000000,stroke:#7030A0
    classDef l5 fill:#FDE9E1,color:#000000,stroke:#C55A11
```

> **Bài củng cố:** <https://trangtu66.github.io/Taode_thi_online/cc_bai2_t11.html>

---

### Toán 11 – Bài 3. Hàm số lượng giác *(Tiết 8–9)*

```mermaid
%%{init: {"theme": "base", "htmlLabels": true, "flowchart": {"htmlLabels": true, "padding": 10, "curve": "basis"}, "themeVariables": {"fontSize": "15px"}}}%%
graph TD
    G["🎯<BR/>BÀI<BR/>3<BR/>·<BR/>TOÁN<BR/>11<BR/>HÀM<BR/>SỐ<BR/>LƯỢNG<BR/>GIÁC"]:::root
    G --> A["① y = sinx"]:::n1
    G --> B["② y = cosx"]:::n2
    G --> C["③ y = tanx<br/>y = cotx"]:::n3
    G --> D["④ Tính chất<br/>& đồ thị"]:::n4

    A --> A1["TXĐ: ℝ; Giá trị:<br/>[−1;1]"]:::l1
    A --> A2["Chu kì: 2π (lẻ)"]:::l1
    A --> A3["Đồ thị: sóng sin"]:::l1

    B --> B1["TXĐ: ℝ; Giá trị:<br/>[−1;1]"]:::l2
    B --> B2["Chu kì: 2π (chẵn)"]:::l2
    B --> B3["Đồ thị: sóng cosin"]:::l2

    C --> C1["tanx: TXĐ ℝ \<br/>{π/2+kπ}; Chu kì π"]:::l3
    C --> C2["cotx: TXĐ ℝ \<br/>{kπ}; Chu kì π"]:::l3

    D --> D1["Tính chẵn/lẻ → đối<br/>xứng trục/tâm"]:::l4
    D --> D2["Biên độ, chu kì<br/>của y=Asin(Bx+C)+D"]:::l4

    classDef root fill:#002060,color:#FFFFFF,stroke:#000B1E,stroke-width:2px,font-weight:bold
    classDef n1 fill:#E2EFDA,color:#000000,stroke:#375623,stroke-width:3px,font-weight:bold
    classDef n2 fill:#FFF2CC,color:#000000,stroke:#BF8F00,stroke-width:3px,font-weight:bold
    classDef n3 fill:#E2EFDA,color:#000000,stroke:#375623,stroke-width:3px,font-weight:bold
    classDef n4 fill:#FFF2CC,color:#000000,stroke:#BF8F00,stroke-width:3px,font-weight:bold
    classDef n5 fill:#E2EFDA,color:#000000,stroke:#375623,stroke-width:3px,font-weight:bold
    classDef l1 fill:#EDF5E8,color:#000000,stroke:#548235
    classDef l2 fill:#FFF8E1,color:#000000,stroke:#BF8F00
    classDef l3 fill:#E3EEF9,color:#000000,stroke:#2F5597
    classDef l4 fill:#F3E8F7,color:#000000,stroke:#7030A0
    classDef l5 fill:#FDE9E1,color:#000000,stroke:#C55A11
```

> **Bài củng cố:** <https://trangtu66.github.io/Taode_thi_online/cc_bai3_t11.html>

---

### Toán 11 – Bài 4. Phương trình lượng giác cơ bản *(Tiết 10)*

```mermaid
%%{init: {"theme": "base", "htmlLabels": true, "flowchart": {"htmlLabels": true, "padding": 10, "curve": "basis"}, "themeVariables": {"fontSize": "15px"}}}%%
graph TD
    G["🎯<BR/>BÀI<BR/>4<BR/>·<BR/>TOÁN<BR/>11<BR/>PTLG<BR/>CƠ<BR/>BẢN"]:::root
    G --> A["① sinx = a"]:::n1
    G --> B["② cosx = a"]:::n2
    G --> C["③ tanx = a<br/>cotx = a"]:::n3
    G --> D["④ PT đưa về<br/>dạng cơ bản"]:::n4

    A --> A1["|a| ≤ 1: x<br/>= arcsin(a)+2kπ<br/>hoặc x = π−arcsin(a)+2kπ"]:::l1
    A --> A2["|a| > 1: vô<br/>nghiệm"]:::l1

    B --> B1["|a| ≤ 1: x<br/>= ±arccos(a)+2kπ"]:::l2
    B --> B2["arccos(a) và −arccos(a)"]:::l2

    C --> C1["tanx=a: x = arctan(a)+kπ"]:::l3
    C --> C2["cotx=a: x = arccot(a)+kπ"]:::l3

    D --> D1["Đặt t = u(x)<br/>→ PTLG cơ bản"]:::l4
    D --> D2["Điều kiện xác định"]:::l4

    classDef root fill:#002060,color:#FFFFFF,stroke:#000B1E,stroke-width:2px,font-weight:bold
    classDef n1 fill:#E2EFDA,color:#000000,stroke:#375623,stroke-width:3px,font-weight:bold
    classDef n2 fill:#FFF2CC,color:#000000,stroke:#BF8F00,stroke-width:3px,font-weight:bold
    classDef n3 fill:#E2EFDA,color:#000000,stroke:#375623,stroke-width:3px,font-weight:bold
    classDef n4 fill:#FFF2CC,color:#000000,stroke:#BF8F00,stroke-width:3px,font-weight:bold
    classDef n5 fill:#E2EFDA,color:#000000,stroke:#375623,stroke-width:3px,font-weight:bold
    classDef l1 fill:#EDF5E8,color:#000000,stroke:#548235
    classDef l2 fill:#FFF8E1,color:#000000,stroke:#BF8F00
    classDef l3 fill:#E3EEF9,color:#000000,stroke:#2F5597
    classDef l4 fill:#F3E8F7,color:#000000,stroke:#7030A0
    classDef l5 fill:#FDE9E1,color:#000000,stroke:#C55A11
```

> **Bài củng cố:** <https://trangtu66.github.io/Taode_thi_online/cc_bai4_t11.html>

---

### Toán 11 – Bài 5. Dãy số *(Tiết 11–12)*

```mermaid
%%{init: {"theme": "base", "htmlLabels": true, "flowchart": {"htmlLabels": true, "padding": 10, "curve": "basis"}, "themeVariables": {"fontSize": "15px"}}}%%
graph TD
    G["🎯<BR/>BÀI<BR/>5<BR/>·<BR/>TOÁN<BR/>11<BR/>DÃY<BR/>SỐ"]:::root
    G --> A["① Khái niệm<br/>dãy số"]:::n1
    G --> B["② Dãy tăng<br/>Dãy giảm"]:::n2
    G --> C["③ Dãy bị chặn<br/>& dãy hội tụ"]:::n3
    G --> D["④ Công thức<br/>truy hồi"]:::n4

    A --> A1["Dãy số: hàm u:<br/>ℕ* → ℝ"]:::l1
    A --> A2["Số hạng uₙ; dãy<br/>(uₙ)"]:::l1
    A --> A3["Cho bởi: công thức,<br/>tính chất, quy luật"]:::l1

    B --> B1["Tăng: uₙ₊₁ > uₙ<br/>với mọi n"]:::l2
    B --> B2["Giảm: uₙ₊₁ < uₙ<br/>với mọi n"]:::l2
    B --> B3["Kiểm tra: xét uₙ₊₁<br/>− uₙ"]:::l2

    C --> C1["Bị chặn trên: uₙ<br/>≤ M ∀n"]:::l3
    C --> C2["Bị chặn dưới: uₙ<br/>≥ m ∀n"]:::l3

    D --> D1["uₙ₊₁ = f(uₙ) kèm<br/>u₁"]:::l4
    D --> D2["Tính u₁, u₂, u₃<br/>từ công thức"]:::l4

    classDef root fill:#002060,color:#FFFFFF,stroke:#000B1E,stroke-width:2px,font-weight:bold
    classDef n1 fill:#E2EFDA,color:#000000,stroke:#375623,stroke-width:3px,font-weight:bold
    classDef n2 fill:#FFF2CC,color:#000000,stroke:#BF8F00,stroke-width:3px,font-weight:bold
    classDef n3 fill:#E2EFDA,color:#000000,stroke:#375623,stroke-width:3px,font-weight:bold
    classDef n4 fill:#FFF2CC,color:#000000,stroke:#BF8F00,stroke-width:3px,font-weight:bold
    classDef n5 fill:#E2EFDA,color:#000000,stroke:#375623,stroke-width:3px,font-weight:bold
    classDef l1 fill:#EDF5E8,color:#000000,stroke:#548235
    classDef l2 fill:#FFF8E1,color:#000000,stroke:#BF8F00
    classDef l3 fill:#E3EEF9,color:#000000,stroke:#2F5597
    classDef l4 fill:#F3E8F7,color:#000000,stroke:#7030A0
    classDef l5 fill:#FDE9E1,color:#000000,stroke:#C55A11
```

> **Bài củng cố:** <https://trangtu66.github.io/Taode_thi_online/cc_bai5_t11.html>

---

### Toán 11 – Bài 6. Cấp số cộng *(Tiết 13–14)*

```mermaid
%%{init: {"theme": "base", "htmlLabels": true, "flowchart": {"htmlLabels": true, "padding": 10, "curve": "basis"}, "themeVariables": {"fontSize": "15px"}}}%%
graph TD
    G["🎯<BR/>BÀI<BR/>6<BR/>·<BR/>TOÁN<BR/>11<BR/>CẤP<BR/>SỐ<BR/>CỘNG"]:::root
    G --> A["① Định nghĩa<br/>CSC"]:::n1
    G --> B["② Số hạng<br/>thứ n"]:::n2
    G --> C["③ Tổng n<br/>số hạng đầu"]:::n3
    G --> D["④ Ứng dụng<br/>thực tiễn"]:::n4

    A --> A1["uₙ₊₁ − uₙ =<br/>d (hằng số)"]:::l1
    A --> A2["Công sai d: dương/âm/zero"]:::l1
    A --> A3["u₁, u₂, u₃... →<br/>d = u₂−u₁"]:::l1

    B --> B1["uₙ = u₁ +<br/>(n−1)d"]:::l2
    B --> B2["uₙ = uₘ +<br/>(n−m)d"]:::l2
    B --> B3["Trung bình cộng: uₙ<br/>= (uₙ₋₁+uₙ₊₁)/2"]:::l2

    C --> C1["Sₙ = n(u₁+uₙ)/2"]:::l3
    C --> C2["Sₙ = nu₁ +<br/>n(n−1)d/2"]:::l3

    D --> D1["Tổng dãy số tự<br/>nhiên 1+2+...+n"]:::l4
    D --> D2["Bài toán ghế khán<br/>đài, ống cống..."]:::l4

    classDef root fill:#002060,color:#FFFFFF,stroke:#000B1E,stroke-width:2px,font-weight:bold
    classDef n1 fill:#E2EFDA,color:#000000,stroke:#375623,stroke-width:3px,font-weight:bold
    classDef n2 fill:#FFF2CC,color:#000000,stroke:#BF8F00,stroke-width:3px,font-weight:bold
    classDef n3 fill:#E2EFDA,color:#000000,stroke:#375623,stroke-width:3px,font-weight:bold
    classDef n4 fill:#FFF2CC,color:#000000,stroke:#BF8F00,stroke-width:3px,font-weight:bold
    classDef n5 fill:#E2EFDA,color:#000000,stroke:#375623,stroke-width:3px,font-weight:bold
    classDef l1 fill:#EDF5E8,color:#000000,stroke:#548235
    classDef l2 fill:#FFF8E1,color:#000000,stroke:#BF8F00
    classDef l3 fill:#E3EEF9,color:#000000,stroke:#2F5597
    classDef l4 fill:#F3E8F7,color:#000000,stroke:#7030A0
    classDef l5 fill:#FDE9E1,color:#000000,stroke:#C55A11
```

> **Bài củng cố:** <https://trangtu66.github.io/Taode_thi_online/cc_bai6_t11.html>

---

### Toán 11 – Bài 7. Cấp số nhân *(Tiết 15–16)*

```mermaid
%%{init: {"theme": "base", "htmlLabels": true, "flowchart": {"htmlLabels": true, "padding": 10, "curve": "basis"}, "themeVariables": {"fontSize": "15px"}}}%%
graph TD
    G["🎯<BR/>BÀI<BR/>7<BR/>·<BR/>TOÁN<BR/>11<BR/>CẤP<BR/>SỐ<BR/>NHÂN"]:::root
    G --> A["① Định nghĩa<br/>CSN"]:::n1
    G --> B["② Số hạng<br/>thứ n"]:::n2
    G --> C["③ Tổng n<br/>số hạng đầu"]:::n3
    G --> D["④ Ứng dụng<br/>thực tiễn"]:::n4

    A --> A1["uₙ₊₁/uₙ = q (hằng<br/>số, q≠0)"]:::l1
    A --> A2["Công bội q"]:::l1
    A --> A3["u₁, u₂, u₃... →<br/>q = u₂/u₁"]:::l1

    B --> B1["uₙ = u₁ ·<br/>q^(n−1)"]:::l2
    B --> B2["Trung bình nhân: uₙ²<br/>= uₙ₋₁·uₙ₊₁"]:::l2

    C --> C1["q≠1: Sₙ = u₁(1−qⁿ)/(1−q)"]:::l3
    C --> C2["q=1: Sₙ = n·u₁"]:::l3
    C --> C3["|q|<1: S∞ = u₁/(1−q)"]:::l3

    D --> D1["Lãi kép: Aₙ =<br/>A₀(1+r)ⁿ"]:::l4
    D --> D2["Tăng trưởng dân số,<br/>vi khuẩn"]:::l4
    D --> D3["Bài toán trả góp,<br/>tích lũy"]:::l4

    classDef root fill:#002060,color:#FFFFFF,stroke:#000B1E,stroke-width:2px,font-weight:bold
    classDef n1 fill:#E2EFDA,color:#000000,stroke:#375623,stroke-width:3px,font-weight:bold
    classDef n2 fill:#FFF2CC,color:#000000,stroke:#BF8F00,stroke-width:3px,font-weight:bold
    classDef n3 fill:#E2EFDA,color:#000000,stroke:#375623,stroke-width:3px,font-weight:bold
    classDef n4 fill:#FFF2CC,color:#000000,stroke:#BF8F00,stroke-width:3px,font-weight:bold
    classDef n5 fill:#E2EFDA,color:#000000,stroke:#375623,stroke-width:3px,font-weight:bold
    classDef l1 fill:#EDF5E8,color:#000000,stroke:#548235
    classDef l2 fill:#FFF8E1,color:#000000,stroke:#BF8F00
    classDef l3 fill:#E3EEF9,color:#000000,stroke:#2F5597
    classDef l4 fill:#F3E8F7,color:#000000,stroke:#7030A0
    classDef l5 fill:#FDE9E1,color:#000000,stroke:#C55A11
```

> **Bài củng cố:** <https://trangtu66.github.io/Taode_thi_online/cc_bai7_t11.html>

---

### Toán 11 – Bài tập cuối Chương II. Dãy số. Cấp số cộng và cấp số nhân *(Tiết 17)*

```mermaid
%%{init: {"theme": "base", "htmlLabels": true, "flowchart": {"htmlLabels": true, "padding": 10, "curve": "basis"}, "themeVariables": {"fontSize": "15px"}}}%%
graph TD
    G["🎯<BR/>CHƯƠNG<BR/>II<BR/>DÃY<BR/>SỐ.<BR/>CẤP<BR/>SỐ<BR/>CỘNG<BR/>VÀ<BR/>CẤP<BR/>SỐ<BR/>NHÂN"]:::root
    G --> A["① Dãy số"]:::n1
    G --> B["② Cấp số cộng"]:::n2
    G --> C["③ Cấp số nhân"]:::n3
    G --> D["④ Thực tiễn"]:::n4

    A --> A1["Cách cho: công thức,<br/>truy hồi"]:::l1
    A --> A2["Tăng, giảm: xét u(n+1)<br/>– u(n)"]:::l1
    A --> A3["Bị chặn trên, dưới"]:::l1
    A --> A4["★ Dãy bị chặn<br/>chưa chắc tăng/giảm"]:::l1

    B --> B1["u(n+1) = u(n) +<br/>d"]:::l2
    B --> B2["★ un = u1<br/>+ (n – 1)d"]:::l2
    B --> B3["★ Sn = n(u1<br/>+ un) : 2"]:::l2
    B --> B4["uk = (u(k–1) +<br/>u(k+1)) : 2"]:::l2

    C --> C1["u(n+1) = u(n)·q"]:::l3
    C --> C2["★ un = u1·q^(n–1)"]:::l3
    C --> C3["★ Sn = u1(1<br/>– q^n) : (1<br/>– q)"]:::l3
    C --> C4["uk² = u(k–1)·u(k+1)"]:::l3

    D --> D1["Tiếng chuông đồng hồ"]:::l4
    D --> D2["Phân chia tế bào"]:::l4
    D --> D3["Bậc cầu thang"]:::l4
    D --> D4["Sản lượng cà phê"]:::l4

    classDef root fill:#002060,color:#FFFFFF,stroke:#000B1E,stroke-width:2px,font-weight:bold
    classDef n1 fill:#E2EFDA,color:#000000,stroke:#375623,stroke-width:3px,font-weight:bold
    classDef n2 fill:#FFF2CC,color:#000000,stroke:#BF8F00,stroke-width:3px,font-weight:bold
    classDef n3 fill:#E2EFDA,color:#000000,stroke:#375623,stroke-width:3px,font-weight:bold
    classDef n4 fill:#FFF2CC,color:#000000,stroke:#BF8F00,stroke-width:3px,font-weight:bold
    classDef n5 fill:#E2EFDA,color:#000000,stroke:#375623,stroke-width:3px,font-weight:bold
    classDef l1 fill:#EDF5E8,color:#000000,stroke:#548235
    classDef l2 fill:#FFF8E1,color:#000000,stroke:#BF8F00
    classDef l3 fill:#E3EEF9,color:#000000,stroke:#2F5597
    classDef l4 fill:#F3E8F7,color:#000000,stroke:#7030A0
    classDef l5 fill:#FDE9E1,color:#000000,stroke:#C55A11
```

> **Bài củng cố:** <https://trangtu66.github.io/Taode_thi_online/cc_chuong2_t11.html>

---

### Toán 11 – Bài tập cuối Chương III. Các số đặc trưng đo xu thế trung tâm *(Tiết 21)*

```mermaid
%%{init: {"theme": "base", "htmlLabels": true, "flowchart": {"htmlLabels": true, "padding": 10, "curve": "basis"}, "themeVariables": {"fontSize": "15px"}}}%%
graph TD
    G["🎯<BR/>CHƯƠNG<BR/>III<BR/>CÁC<BR/>SỐ<BR/>ĐẶC<BR/>TRƯNG<BR/>ĐO<BR/>XU<BR/>THẾ<BR/>TRUNG<BR/>TÂM"]:::root
    G --> A["① Mẫu số liệu<br/>ghép nhóm"]:::n1
    G --> B["② Số trung bình"]:::n2
    G --> C["③ Trung vị, tứ<br/>phân vị"]:::n3
    G --> D["④ Mốt"]:::n4

    A --> A1["Nhóm [a; b), tần<br/>số"]:::l1
    A --> A2["Giá trị đại diện<br/>(a + b) :<br/>2"]:::l1
    A --> A3["Ghép nhóm: không quá<br/>nhiều, quá ít nhóm"]:::l1
    A --> A4["Hiệu chỉnh nhóm rời<br/>rạc k1 – k2"]:::l1

    B --> B1["★ x̄ = Σmi<br/>xi : n"]:::l2
    B --> B2["Xấp xỉ trung bình<br/>mẫu gốc"]:::l2
    B --> B3["Đại diện cho mức<br/>trung bình"]:::l2
    B --> B4["Bị ảnh hưởng giá<br/>trị bất thường"]:::l2

    C --> C1["Nhóm chứa Qr: tần<br/>số tích luỹ"]:::l3
    C --> C2["★ Qr = ap<br/>+ (rn/4 – cộng<br/>dồn trước) : mp<br/>· h"]:::l3
    C --> C3["Q2 là trung vị"]:::l3
    C --> C4["Ngưỡng 25%, 50%, 75%"]:::l3

    D --> D1["Nhóm có tần số<br/>lớn nhất"]:::l4
    D --> D2["★ Mo = aj<br/>+ (mj – mj–1)<br/>: [(mj – mj–1)<br/>+ (mj – mj+1)]<br/>· h"]:::l4
    D --> D3["Nhóm cùng độ dài"]:::l4
    D --> D4["Giá trị xuất hiện<br/>nhiều nhất"]:::l4

    classDef root fill:#002060,color:#FFFFFF,stroke:#000B1E,stroke-width:2px,font-weight:bold
    classDef n1 fill:#E2EFDA,color:#000000,stroke:#375623,stroke-width:3px,font-weight:bold
    classDef n2 fill:#FFF2CC,color:#000000,stroke:#BF8F00,stroke-width:3px,font-weight:bold
    classDef n3 fill:#E2EFDA,color:#000000,stroke:#375623,stroke-width:3px,font-weight:bold
    classDef n4 fill:#FFF2CC,color:#000000,stroke:#BF8F00,stroke-width:3px,font-weight:bold
    classDef n5 fill:#E2EFDA,color:#000000,stroke:#375623,stroke-width:3px,font-weight:bold
    classDef l1 fill:#EDF5E8,color:#000000,stroke:#548235
    classDef l2 fill:#FFF8E1,color:#000000,stroke:#BF8F00
    classDef l3 fill:#E3EEF9,color:#000000,stroke:#2F5597
    classDef l4 fill:#F3E8F7,color:#000000,stroke:#7030A0
    classDef l5 fill:#FDE9E1,color:#000000,stroke:#C55A11
```

> **Bài củng cố:** <https://trangtu66.github.io/Taode_thi_online/cc_chuong3_t11.html>

---

### Toán 11 – Ôn tập giữa kì I *(Tiết 22–23)*

```mermaid
%%{init: {"theme": "base", "htmlLabels": true, "flowchart": {"htmlLabels": true, "padding": 10, "curve": "basis"}, "themeVariables": {"fontSize": "15px"}}}%%
graph TD
    G["🎯<BR/>ÔN TẬP<BR/>GIỮA KÌ I"]:::root
    G --> A["① Chương I –<br/>Lượng giác"]:::n1
    G --> B["② Chương II –<br/>Dãy số"]:::n2
    G --> C["③ Chương III –<br/>Thống kê"]:::n3
    G --> D["④ Đề giữa kì<br/>90 phút"]:::n4

    A --> A1["Góc lượng giác, radian"]:::l1
    A --> A2["★ Giá trị LG,<br/>công thức LG"]:::l1
    A --> A3["Hàm số LG: TXĐ,<br/>chu kì"]:::l1
    A --> A4["★ PTLG cơ bản"]:::l1

    B --> B1["Dãy số tăng, giảm,<br/>bị chặn"]:::l2
    B --> B2["★ CSC: un, Sn"]:::l2
    B --> B3["★ CSN: un, Sn"]:::l2
    B --> B4["Bài toán thực tiễn"]:::l2

    C --> C1["Mẫu ghép nhóm, giá<br/>trị đại diện"]:::l3
    C --> C2["★ Số trung bình"]:::l3
    C --> C3["Trung vị, tứ phân<br/>vị"]:::l3
    C --> C4["★ Mốt"]:::l3

    D --> D1["Phần I: 12 câu<br/>(3 điểm)"]:::l4
    D --> D2["Phần II: 4 câu<br/>đúng – sai (4<br/>điểm)"]:::l4
    D --> D3["Phần III: 6 câu<br/>trả lời ngắn (3<br/>điểm)"]:::l4
    D --> D4["Phạm vi Bài 1<br/>– Bài 9"]:::l4

    classDef root fill:#002060,color:#FFFFFF,stroke:#000B1E,stroke-width:2px,font-weight:bold
    classDef n1 fill:#E2EFDA,color:#000000,stroke:#375623,stroke-width:3px,font-weight:bold
    classDef n2 fill:#FFF2CC,color:#000000,stroke:#BF8F00,stroke-width:3px,font-weight:bold
    classDef n3 fill:#E2EFDA,color:#000000,stroke:#375623,stroke-width:3px,font-weight:bold
    classDef n4 fill:#FFF2CC,color:#000000,stroke:#BF8F00,stroke-width:3px,font-weight:bold
    classDef n5 fill:#E2EFDA,color:#000000,stroke:#375623,stroke-width:3px,font-weight:bold
    classDef l1 fill:#EDF5E8,color:#000000,stroke:#548235
    classDef l2 fill:#FFF8E1,color:#000000,stroke:#BF8F00
    classDef l3 fill:#E3EEF9,color:#000000,stroke:#2F5597
    classDef l4 fill:#F3E8F7,color:#000000,stroke:#7030A0
    classDef l5 fill:#FDE9E1,color:#000000,stroke:#C55A11
```

> **Bài củng cố:** <https://trangtu66.github.io/Taode_thi_online/cc_ontapgk1_t11.html>

---

### Toán 11 – Bài 10. Đường thẳng và mặt phẳng trong không gian *(Tiết 26–28)*

```mermaid
%%{init: {"theme": "base", "htmlLabels": true, "flowchart": {"htmlLabels": true, "padding": 10, "curve": "basis"}, "themeVariables": {"fontSize": "15px"}}}%%
graph TD
    G["🎯<br/>BÀI 10<br/>Đường thẳng và mặt phẳng<br/>trong không gian"]:::root
    G --> A["① Khái niệm mở đầu"]:::n1
    G --> B["② Tính chất thừa nhận"]:::n2
    G --> C["③ Xác định mặt phẳng"]:::n3
    G --> D["④ Hình chóp, tứ diện"]:::n4

    A --> A1["Mặt phẳng: không bề dày, không giới hạn"]:::l1
    A --> A2["A ∈ (P), B ∉ (P)"]:::l1
    A --> A3["Hình biểu diễn: nét khuất đứt đoạn"]:::l1
    A --> A4["Điểm đồng phẳng"]:::l1

    B --> B1["Một đường thẳng qua 2 điểm"]:::l2
    B --> B2["★ Một mặt phẳng qua 3 điểm không thẳng hàng"]:::l2
    B --> B3["2 điểm thuộc (P) ⇒ đường thẳng ⊂ (P)"]:::l2
    B --> B4["★ Giao tuyến: qua điểm chung"]:::l2

    C --> C1["3 điểm không thẳng hàng"]:::l3
    C --> C2["Điểm và đường thẳng không qua nó"]:::l3
    C --> C3["Hai đường thẳng cắt nhau"]:::l3
    C --> C4["★ Tìm giao tuyến: 2 điểm chung"]:::l3

    D --> D1["Đỉnh, mặt đáy, mặt bên"]:::l4
    D --> D2["Cạnh bên, cạnh đáy"]:::l4
    D --> D3["Tứ diện: 4 mặt, 6 cạnh"]:::l4
    D --> D4["★ Giao điểm d và (P): qua đường trong (P)"]:::l4

    classDef root fill:#002060,color:#FFFFFF,stroke:#000B1E,stroke-width:2px,font-weight:bold
    classDef n1 fill:#E2EFDA,color:#000000,stroke:#375623,stroke-width:3px,font-weight:bold
    classDef n2 fill:#FFF2CC,color:#000000,stroke:#BF8F00,stroke-width:3px,font-weight:bold
    classDef n3 fill:#E2EFDA,color:#000000,stroke:#375623,stroke-width:3px,font-weight:bold
    classDef n4 fill:#FFF2CC,color:#000000,stroke:#BF8F00,stroke-width:3px,font-weight:bold
    classDef n5 fill:#E2EFDA,color:#000000,stroke:#375623,stroke-width:3px,font-weight:bold
    classDef l1 fill:#EDF5E8,color:#000000,stroke:#548235
    classDef l2 fill:#FFF8E1,color:#000000,stroke:#BF8F00
    classDef l3 fill:#E3EEF9,color:#000000,stroke:#2F5597
    classDef l4 fill:#F3E8F7,color:#000000,stroke:#7030A0
    classDef l5 fill:#FDE9E1,color:#000000,stroke:#C55A11
```

> **Bài củng cố:** <https://trangtu66.github.io/Taode_thi_online/cc_bai10_t11.html>

---

### Toán 11 – Bài 11. Hai đường thẳng song song *(Tiết 29–31)*

```mermaid
%%{init: {"theme": "base", "htmlLabels": true, "flowchart": {"htmlLabels": true, "padding": 10, "curve": "basis"}, "themeVariables": {"fontSize": "15px"}}}%%
graph TD
    G["🎯<br/>BÀI 11<br/>Hai đường thẳng<br/>song song"]:::root
    G --> A["① Vị trí tương đối"]:::n1
    G --> B["② Tính chất"]:::n2
    G --> C["③ Ba đường giao tuyến"]:::n3
    G --> D["④ Thực tiễn"]:::n4

    A --> A1["Đồng phẳng: cắt nhau, song song, trùng"]:::l1
    A --> A2["★ Chéo nhau: không đồng phẳng"]:::l1
    A --> A3["Không có điểm chung: song song hoặc chéo"]:::l1
    A --> A4["Có đúng 1 mặt phẳng chứa 2 đường song song"]:::l1

    B --> B1["★ Qua 1 điểm có đúng 1 đường song song"]:::l2
    B --> B2["★ Cùng song song đường thứ ba ⇒ song song"]:::l2
    B --> B3["Đường trung bình, hình bình hành"]:::l2
    B --> B4["Trên mỗi mặt phẳng dùng hình học phẳng"]:::l2

    C --> C1["★ Đồng quy hoặc đôi một song song"]:::l3
    C --> C2["Hệ quả: giao tuyến song song 2 đường song song"]:::l3
    C --> C3["Tìm giao tuyến qua S song song AB"]:::l3
    C --> C4["Chứng minh song song"]:::l3

    D --> D1["Cầu vượt, đường trên cao"]:::l4
    D --> D2["Khung cửi, tia laser"]:::l4
    D --> D3["Cánh cửa sổ"]:::l4
    D --> D4["Mặt hyperbol"]:::l4

    classDef root fill:#002060,color:#FFFFFF,stroke:#000B1E,stroke-width:2px,font-weight:bold
    classDef n1 fill:#E2EFDA,color:#000000,stroke:#375623,stroke-width:3px,font-weight:bold
    classDef n2 fill:#FFF2CC,color:#000000,stroke:#BF8F00,stroke-width:3px,font-weight:bold
    classDef n3 fill:#E2EFDA,color:#000000,stroke:#375623,stroke-width:3px,font-weight:bold
    classDef n4 fill:#FFF2CC,color:#000000,stroke:#BF8F00,stroke-width:3px,font-weight:bold
    classDef n5 fill:#E2EFDA,color:#000000,stroke:#375623,stroke-width:3px,font-weight:bold
    classDef l1 fill:#EDF5E8,color:#000000,stroke:#548235
    classDef l2 fill:#FFF8E1,color:#000000,stroke:#BF8F00
    classDef l3 fill:#E3EEF9,color:#000000,stroke:#2F5597
    classDef l4 fill:#F3E8F7,color:#000000,stroke:#7030A0
    classDef l5 fill:#FDE9E1,color:#000000,stroke:#C55A11
```

> **Bài củng cố:** <https://trangtu66.github.io/Taode_thi_online/cc_bai11_t11.html>

---

### Toán 11 – Bài 12. Đường thẳng và mặt phẳng song song *(Tiết 32–33)*

```mermaid
%%{init: {"theme": "base", "htmlLabels": true, "flowchart": {"htmlLabels": true, "padding": 10, "curve": "basis"}, "themeVariables": {"fontSize": "15px"}}}%%
graph TD
    G["🎯<br/>BÀI 12<br/>Đường thẳng và mặt phẳng<br/>song song"]:::root
    G --> A["① Vị trí tương đối"]:::n1
    G --> B["② Điều kiện"]:::n2
    G --> C["③ Tính chất"]:::n3
    G --> D["④ Thực tiễn"]:::n4

    A --> A1["★ d // (α): không có điểm chung"]:::l1
    A --> A2["d ∩ (α) = {M}"]:::l1
    A --> A3["d ⊂ (α): nhiều hơn 1 điểm chung"]:::l1
    A --> A4["Hình ảnh: cầu, khung thành"]:::l1

    B --> B1["★ a ⊄ (P), a // b ⊂ (P) ⇒ a // (P)"]:::l2
    B --> B2["Đường trung bình"]:::l2
    B --> B3["a, b chéo: có duy nhất (P) ⊃ a, (P) // b"]:::l2
    B --> B4["Bỏ điều kiện a ⊄ (P) thì sai"]:::l2

    C --> C1["★ a // (P), (Q) ⊃ a cắt (P) theo b ⇒ b // a"]:::l3
    C --> C2["Tìm giao tuyến song song"]:::l3
    C --> C3["Thiết diện hình bình hành"]:::l3
    C --> C4["Giao tuyến các mặt tứ diện"]:::l3

    D --> D1["Dây nhợ khi xây tường"]:::l4
    D --> D2["Mép cửa ra vào"]:::l4
    D --> D3["Xà ngang khung thành"]:::l4
    D --> D4["Mái che, giàn tiêu"]:::l4

    classDef root fill:#002060,color:#FFFFFF,stroke:#000B1E,stroke-width:2px,font-weight:bold
    classDef n1 fill:#E2EFDA,color:#000000,stroke:#375623,stroke-width:3px,font-weight:bold
    classDef n2 fill:#FFF2CC,color:#000000,stroke:#BF8F00,stroke-width:3px,font-weight:bold
    classDef n3 fill:#E2EFDA,color:#000000,stroke:#375623,stroke-width:3px,font-weight:bold
    classDef n4 fill:#FFF2CC,color:#000000,stroke:#BF8F00,stroke-width:3px,font-weight:bold
    classDef n5 fill:#E2EFDA,color:#000000,stroke:#375623,stroke-width:3px,font-weight:bold
    classDef l1 fill:#EDF5E8,color:#000000,stroke:#548235
    classDef l2 fill:#FFF8E1,color:#000000,stroke:#BF8F00
    classDef l3 fill:#E3EEF9,color:#000000,stroke:#2F5597
    classDef l4 fill:#F3E8F7,color:#000000,stroke:#7030A0
    classDef l5 fill:#FDE9E1,color:#000000,stroke:#C55A11
```

> **Bài củng cố:** <https://trangtu66.github.io/Taode_thi_online/cc_bai12_t11.html>

---

### Toán 11 – Bài 13. Hai mặt phẳng song song *(Tiết 34, 37)*

```mermaid
%%{init: {"theme": "base", "htmlLabels": true, "flowchart": {"htmlLabels": true, "padding": 10, "curve": "basis"}, "themeVariables": {"fontSize": "15px"}}}%%
graph TD
    G["🎯<br/>BÀI 13<br/>Hai mặt phẳng<br/>song song"]:::root
    G --> A["① Định nghĩa"]:::n1
    G --> B["② Điều kiện, tính chất"]:::n2
    G --> C["③ Định lí Thalès"]:::n3
    G --> D["④ Lăng trụ, hình hộp"]:::n4

    A --> A1["★ (α) // (β): không có điểm chung"]:::l1
    A --> A2["d ⊂ (α) // (β) ⇒ d // (β)"]:::l1
    A --> A3["Mặt bậc thang, ruộng bậc thang"]:::l1
    A --> A4["Tháp Pisa: sàn không song song mặt đất"]:::l1

    B --> B1["★ (α) chứa 2 đường cắt nhau // (β)"]:::l2
    B --> B2["Qua 1 điểm có duy nhất 1 mặt phẳng song song"]:::l2
    B --> B3["★ (R) cắt (P) // (Q) ⇒ hai giao tuyến song song"]:::l2
    B --> B4["Cùng song song mặt thứ ba ⇒ song song"]:::l2

    C --> C1["★ Ba mặt phẳng song song chắn đoạn tỉ lệ"]:::l3
    C --> C2["AB : A'B' = BC : B'C' = AC : A'C'"]:::l3
    C --> C3["Chia đoạn theo tỉ lệ"]:::l3
    C --> C4["Đo mực nước"]:::l3

    D --> D1["Mặt bên là hình bình hành"]:::l4
    D --> D2["Cạnh bên song song, bằng nhau"]:::l4
    D --> D3["★ Hình hộp: 4 đường chéo đồng quy"]:::l4
    D --> D4["Mặt đối diện song song"]:::l4

    classDef root fill:#002060,color:#FFFFFF,stroke:#000B1E,stroke-width:2px,font-weight:bold
    classDef n1 fill:#E2EFDA,color:#000000,stroke:#375623,stroke-width:3px,font-weight:bold
    classDef n2 fill:#FFF2CC,color:#000000,stroke:#BF8F00,stroke-width:3px,font-weight:bold
    classDef n3 fill:#E2EFDA,color:#000000,stroke:#375623,stroke-width:3px,font-weight:bold
    classDef n4 fill:#FFF2CC,color:#000000,stroke:#BF8F00,stroke-width:3px,font-weight:bold
    classDef n5 fill:#E2EFDA,color:#000000,stroke:#375623,stroke-width:3px,font-weight:bold
    classDef l1 fill:#EDF5E8,color:#000000,stroke:#548235
    classDef l2 fill:#FFF8E1,color:#000000,stroke:#BF8F00
    classDef l3 fill:#E3EEF9,color:#000000,stroke:#2F5597
    classDef l4 fill:#F3E8F7,color:#000000,stroke:#7030A0
    classDef l5 fill:#FDE9E1,color:#000000,stroke:#C55A11
```

> **Bài củng cố:** <https://trangtu66.github.io/Taode_thi_online/cc_bai13_t11.html>

---

### Toán 11 – STEM: Thiết kế mô hình mái che sân trường *(Tiết 35–36)*

```mermaid
%%{init: {"theme": "base", "htmlLabels": true, "flowchart": {"htmlLabels": true, "padding": 10, "curve": "basis"}, "themeVariables": {"fontSize": "15px"}}}%%
graph TD
    G["🎯<BR/>STEM<BR/>MÔ<BR/>HÌNH<BR/>MÁI<BR/>CHE<BR/>SÂN<BR/>TRƯỜNG"]:::root
    G --> A["① Xác định vấn<br/>đề"]:::n1
    G --> B["② Kiến thức nền"]:::n2
    G --> C["③ Thiết kế –<br/>Chế tạo"]:::n3
    G --> D["④ Chia sẻ –<br/>Điều chỉnh"]:::n4

    A --> A1["Che nắng mưa cho<br/>sân"]:::l1
    A --> A2["Tiêu chí: vững, đúng<br/>tỉ lệ, đúng quan<br/>hệ song song"]:::l1
    A --> A3["Vật liệu: que tre,<br/>bìa"]:::l1
    A --> A4["Phiếu học tập số<br/>1"]:::l1

    B --> B1["★ Cột song song,<br/>xà song song"]:::l2
    B --> B2["★ Nóc mái //<br/>mép mái // mặt<br/>sân"]:::l2
    B --> B3["Đầu hồi song song<br/>(Bài 13)"]:::l2
    B --> B4["Tính kèo: Pythagore; tỉ<br/>lệ 1 : 50"]:::l2

    C --> C1["Bản vẽ hình biểu<br/>diễn, kích thước"]:::l3
    C --> C2["Kèo mô hình ≈<br/>6,7 cm"]:::l3
    C --> C3["Lắp khung, lợp mái<br/>bìa"]:::l3
    C --> C4["Kiểm tra bằng thước,<br/>êke"]:::l3

    D --> D1["Trưng bày, thuyết trình"]:::l4
    D --> D2["Đánh giá đồng đẳng"]:::l4
    D --> D3["Tính diện tích tôn,<br/>dự toán"]:::l4
    D --> D4["Trắc nghiệm củng cố<br/>online"]:::l4

    classDef root fill:#002060,color:#FFFFFF,stroke:#000B1E,stroke-width:2px,font-weight:bold
    classDef n1 fill:#E2EFDA,color:#000000,stroke:#375623,stroke-width:3px,font-weight:bold
    classDef n2 fill:#FFF2CC,color:#000000,stroke:#BF8F00,stroke-width:3px,font-weight:bold
    classDef n3 fill:#E2EFDA,color:#000000,stroke:#375623,stroke-width:3px,font-weight:bold
    classDef n4 fill:#FFF2CC,color:#000000,stroke:#BF8F00,stroke-width:3px,font-weight:bold
    classDef n5 fill:#E2EFDA,color:#000000,stroke:#375623,stroke-width:3px,font-weight:bold
    classDef l1 fill:#EDF5E8,color:#000000,stroke:#548235
    classDef l2 fill:#FFF8E1,color:#000000,stroke:#BF8F00
    classDef l3 fill:#E3EEF9,color:#000000,stroke:#2F5597
    classDef l4 fill:#F3E8F7,color:#000000,stroke:#7030A0
    classDef l5 fill:#FDE9E1,color:#000000,stroke:#C55A11
```

> **Bài củng cố:** <https://trangtu66.github.io/Taode_thi_online/cc_stem_maiche_t11.html>

---

### Toán 11 – Bài 14. Phép chiếu song song *(Tiết 38–39)*

```mermaid
%%{init: {"theme": "base", "htmlLabels": true, "flowchart": {"htmlLabels": true, "padding": 10, "curve": "basis"}, "themeVariables": {"fontSize": "15px"}}}%%
graph TD
    G["🎯<br/>BÀI 14<br/>Phép chiếu<br/>song song"]:::root
    G --> A["① Định nghĩa"]:::n1
    G --> B["② Tính chất"]:::n2
    G --> C["③ Hình biểu diễn"]:::n3
    G --> D["④ Thực tiễn"]:::n4

    A --> A1["Mặt phẳng chiếu (α), phương chiếu Δ"]:::l1
    A --> A2["★ M' = (α) ∩ đường qua M song song Δ"]:::l1
    A --> A3["Hình chiếu của hình H"]:::l1
    A --> A4["Đường cùng phương Δ: chiếu thành điểm"]:::l1

    B --> B1["★ Giữ thẳng hàng và thứ tự"]:::l2
    B --> B2["★ Song song → song song (hoặc trùng)"]:::l2
    B --> B3["★ Giữ tỉ số đoạn cùng giá / giá song song"]:::l2
    B --> B4["Trung điểm → trung điểm"]:::l2

    C --> C1["Tam giác → tam giác"]:::l3
    C --> C2["Hình vuông, chữ nhật, thoi → hình bình hành"]:::l3
    C --> C3["Hình thang → hình thang (giữ tỉ số đáy)"]:::l3
    C --> C4["★ Hình tròn → elip"]:::l3

    D --> D1["Bóng nắng, bóng thang"]:::l4
    D --> D2["Công nghệ goal-line"]:::l4
    D --> D3["Chữ nổi 3D"]:::l4
    D --> D4["Phép chiếu xuyên tâm, luật xa gần"]:::l4

    classDef root fill:#002060,color:#FFFFFF,stroke:#000B1E,stroke-width:2px,font-weight:bold
    classDef n1 fill:#E2EFDA,color:#000000,stroke:#375623,stroke-width:3px,font-weight:bold
    classDef n2 fill:#FFF2CC,color:#000000,stroke:#BF8F00,stroke-width:3px,font-weight:bold
    classDef n3 fill:#E2EFDA,color:#000000,stroke:#375623,stroke-width:3px,font-weight:bold
    classDef n4 fill:#FFF2CC,color:#000000,stroke:#BF8F00,stroke-width:3px,font-weight:bold
    classDef n5 fill:#E2EFDA,color:#000000,stroke:#375623,stroke-width:3px,font-weight:bold
    classDef l1 fill:#EDF5E8,color:#000000,stroke:#548235
    classDef l2 fill:#FFF8E1,color:#000000,stroke:#BF8F00
    classDef l3 fill:#E3EEF9,color:#000000,stroke:#2F5597
    classDef l4 fill:#F3E8F7,color:#000000,stroke:#7030A0
    classDef l5 fill:#FDE9E1,color:#000000,stroke:#C55A11
```

> **Bài củng cố:** <https://trangtu66.github.io/Taode_thi_online/cc_bai14_t11.html>

---

### Toán 11 – Bài tập cuối Chương IV. Quan hệ song song trong không gian *(Tiết 40)*

```mermaid
%%{init: {"theme": "base", "htmlLabels": true, "flowchart": {"htmlLabels": true, "padding": 10, "curve": "basis"}, "themeVariables": {"fontSize": "15px"}}}%%
graph TD
    G["🎯<BR/>CHƯƠNG<BR/>IV<BR/>QUAN<BR/>HỆ<BR/>SONG<BR/>SONG<BR/>TRONG<BR/>KHÔNG<BR/>GIAN"]:::root
    G --> A["① Đường thẳng –<br/>mặt phẳng"]:::n1
    G --> B["② Hai đường thẳng<br/>song song"]:::n2
    G --> C["③ Đường thẳng //<br/>mặt phẳng; 2 mặt<br/>phẳng //"]:::n3
    G --> D["④ Phép chiếu song<br/>song"]:::n4

    A --> A1["Tính chất thừa nhận"]:::l1
    A --> A2["★ Giao tuyến: 2<br/>điểm chung"]:::l1
    A --> A3["★ Giao điểm: qua<br/>mặt phẳng phụ"]:::l1
    A --> A4["Hình chóp, tứ diện"]:::l1

    B --> B1["Cắt, song song, chéo"]:::l2
    B --> B2["Bắc cầu"]:::l2
    B --> B3["★ Ba đường giao<br/>tuyến"]:::l2
    B --> B4["Giao tuyến song song"]:::l2

    C --> C1["★ a // b<br/>⊂ (P), a ⊄<br/>(P)"]:::l3
    C --> C2["★ 2 đường cắt<br/>nhau // (β)"]:::l3
    C --> C3["Thalès trong không gian"]:::l3
    C --> C4["Lăng trụ, hình hộp"]:::l3

    D --> D1["Giữ thẳng hàng, song<br/>song"]:::l4
    D --> D2["Giữ tỉ số"]:::l4
    D --> D3["Hình biểu diễn"]:::l4
    D --> D4["Bóng nắng"]:::l4

    classDef root fill:#002060,color:#FFFFFF,stroke:#000B1E,stroke-width:2px,font-weight:bold
    classDef n1 fill:#E2EFDA,color:#000000,stroke:#375623,stroke-width:3px,font-weight:bold
    classDef n2 fill:#FFF2CC,color:#000000,stroke:#BF8F00,stroke-width:3px,font-weight:bold
    classDef n3 fill:#E2EFDA,color:#000000,stroke:#375623,stroke-width:3px,font-weight:bold
    classDef n4 fill:#FFF2CC,color:#000000,stroke:#BF8F00,stroke-width:3px,font-weight:bold
    classDef n5 fill:#E2EFDA,color:#000000,stroke:#375623,stroke-width:3px,font-weight:bold
    classDef l1 fill:#EDF5E8,color:#000000,stroke:#548235
    classDef l2 fill:#FFF8E1,color:#000000,stroke:#BF8F00
    classDef l3 fill:#E3EEF9,color:#000000,stroke:#2F5597
    classDef l4 fill:#F3E8F7,color:#000000,stroke:#7030A0
    classDef l5 fill:#FDE9E1,color:#000000,stroke:#C55A11
```

> **Bài củng cố:** <https://trangtu66.github.io/Taode_thi_online/cc_chuong4_t11.html>

---

### Toán 11 – Bài 15. Giới hạn của dãy số *(Tiết 41–42)*

```mermaid
%%{init: {"theme": "base", "htmlLabels": true, "flowchart": {"htmlLabels": true, "padding": 10, "curve": "basis"}, "themeVariables": {"fontSize": "15px"}}}%%
graph TD
    G["🎯<br/>BÀI 15<br/>Giới hạn<br/>của dãy số"]:::root
    G --> A["① Giới hạn hữu hạn"]:::n1
    G --> B["② Quy tắc tính"]:::n2
    G --> C["③ Cấp số nhân lùi vô hạn"]:::n3
    G --> D["④ Giới hạn vô cực"]:::n4

    A --> A1["★ lim un = 0: |un| nhỏ tuỳ ý"]:::l1
    A --> A2["lim 1/n^k = 0; lim q^n = 0 (|q| < 1)"]:::l1
    A --> A3["lim un = a ⇔ lim (un − a) = 0"]:::l1
    A --> A4["lim c = c"]:::l1

    B --> B1["Tổng, hiệu, tích, thương"]:::l2
    B --> B2["lim √un = √a"]:::l2
    B --> B3["★ Chia tử, mẫu cho n bậc cao nhất"]:::l2
    B --> B4["Nhân liên hợp"]:::l2

    C --> C1["|q| < 1"]:::l3
    C --> C2["★ S = u1 : (1 − q)"]:::l3
    C --> C3["Số thập phân tuần hoàn"]:::l3
    C --> C4["Nghịch lí Zeno"]:::l3

    D --> D1["lim n^k = +∞; lim q^n = +∞ (q > 1)"]:::l4
    D --> D2["a : (±∞) → 0"]:::l4
    D --> D3["a > 0 chia 0⁺ → +∞"]:::l4
    D --> D4["+∞ · a (a > 0) → +∞"]:::l4

    classDef root fill:#002060,color:#FFFFFF,stroke:#000B1E,stroke-width:2px,font-weight:bold
    classDef n1 fill:#E2EFDA,color:#000000,stroke:#375623,stroke-width:3px,font-weight:bold
    classDef n2 fill:#FFF2CC,color:#000000,stroke:#BF8F00,stroke-width:3px,font-weight:bold
    classDef n3 fill:#E2EFDA,color:#000000,stroke:#375623,stroke-width:3px,font-weight:bold
    classDef n4 fill:#FFF2CC,color:#000000,stroke:#BF8F00,stroke-width:3px,font-weight:bold
    classDef n5 fill:#E2EFDA,color:#000000,stroke:#375623,stroke-width:3px,font-weight:bold
    classDef l1 fill:#EDF5E8,color:#000000,stroke:#548235
    classDef l2 fill:#FFF8E1,color:#000000,stroke:#BF8F00
    classDef l3 fill:#E3EEF9,color:#000000,stroke:#2F5597
    classDef l4 fill:#F3E8F7,color:#000000,stroke:#7030A0
    classDef l5 fill:#FDE9E1,color:#000000,stroke:#C55A11
```

> **Bài củng cố:** <https://trangtu66.github.io/Taode_thi_online/cc_bai15_t11.html>

---

### Toán 11 – Bài 16. Giới hạn của hàm số *(Tiết 43–44)*

```mermaid
%%{init: {"theme": "base", "htmlLabels": true, "flowchart": {"htmlLabels": true, "padding": 10, "curve": "basis"}, "themeVariables": {"fontSize": "15px"}}}%%
graph TD
    G["🎯<br/>BÀI 16<br/>Giới hạn<br/>của hàm số"]:::root
    G --> A["① Tại một điểm"]:::n1
    G --> B["② Tại vô cực"]:::n2
    G --> C["③ Giới hạn vô cực"]:::n3
    G --> D["④ Thực tiễn"]:::n4

    A --> A1["★ xn → x0 ⇒ f(xn) → L"]:::l1
    A --> A2["Quy tắc tổng, hiệu, tích, thương"]:::l1
    A --> A3["Dạng 0/0: rút gọn, liên hợp"]:::l1
    A --> A4["Một bên: x → x0⁺, x → x0⁻"]:::l1

    B --> B1["x → ±∞"]:::l2
    B --> B2["lim c = c; lim 1/x^k = 0"]:::l2
    B --> B3["★ Chia bậc cao nhất của x"]:::l2
    B --> B4["a√b khi a < 0"]:::l2

    C --> C1["★ L/0 xét dấu mẫu"]:::l3
    C --> C2["Tích với ±∞: xét dấu L"]:::l3
    C --> C3["x^k → ±∞ theo k chẵn/lẻ"]:::l3
    C --> C4["lim = L ⇔ hai giới hạn một bên bằng L"]:::l3

    D --> D1["Khối lượng tương đối Einstein"]:::l4
    D --> D2["Hàm Heaviside"]:::l4
    D --> D3["Đường cao tam giác vuông"]:::l4
    D --> D4["Chi phí trung bình"]:::l4

    classDef root fill:#002060,color:#FFFFFF,stroke:#000B1E,stroke-width:2px,font-weight:bold
    classDef n1 fill:#E2EFDA,color:#000000,stroke:#375623,stroke-width:3px,font-weight:bold
    classDef n2 fill:#FFF2CC,color:#000000,stroke:#BF8F00,stroke-width:3px,font-weight:bold
    classDef n3 fill:#E2EFDA,color:#000000,stroke:#375623,stroke-width:3px,font-weight:bold
    classDef n4 fill:#FFF2CC,color:#000000,stroke:#BF8F00,stroke-width:3px,font-weight:bold
    classDef n5 fill:#E2EFDA,color:#000000,stroke:#375623,stroke-width:3px,font-weight:bold
    classDef l1 fill:#EDF5E8,color:#000000,stroke:#548235
    classDef l2 fill:#FFF8E1,color:#000000,stroke:#BF8F00
    classDef l3 fill:#E3EEF9,color:#000000,stroke:#2F5597
    classDef l4 fill:#F3E8F7,color:#000000,stroke:#7030A0
    classDef l5 fill:#FDE9E1,color:#000000,stroke:#C55A11
```

> **Bài củng cố:** <https://trangtu66.github.io/Taode_thi_online/cc_bai16_t11.html>

---

### Toán 11 – Bài 17. Hàm số liên tục *(Tiết 45–46)*

```mermaid
%%{init: {"theme": "base", "htmlLabels": true, "flowchart": {"htmlLabels": true, "padding": 10, "curve": "basis"}, "themeVariables": {"fontSize": "15px"}}}%%
graph TD
    G["🎯<br/>BÀI 17<br/>Hàm số<br/>liên tục"]:::root
    G --> A["① Liên tục tại một điểm"]:::n1
    G --> B["② Trên khoảng, đoạn"]:::n2
    G --> C["③ Tính chất"]:::n3
    G --> D["④ Thực tiễn"]:::n4

    A --> A1["★ lim f(x) = f(x0)"]:::l1
    A --> A2["⇔ hai giới hạn một bên = f(x0)"]:::l1
    A --> A3["Không liên tục: gián đoạn"]:::l1
    A --> A4["Hàm dấu gián đoạn tại 0"]:::l1

    B --> B1["Liên tục tại mọi điểm của khoảng"]:::l2
    B --> B2["Đoạn: thêm liên tục phải tại a, trái tại b"]:::l2
    B --> B3["Đồ thị là đường liền"]:::l2
    B --> B4["★ Đa thức, sin, cos liên tục trên R"]:::l2

    C --> C1["Tổng, hiệu, tích liên tục"]:::l3
    C --> C2["Thương liên tục nếu g(x0) ≠ 0"]:::l3
    C --> C3["★ f liên tục [a; b], f(a)f(b) < 0 ⇒ có c: f(c) = 0"]:::l3
    C --> C4["Chứng minh phương trình có nghiệm"]:::l3

    D --> D1["Vận tốc xe 60 km/h"]:::l4
    D --> D2["Cước taxi"]:::l4
    D --> D3["Giá thu mua theo bậc"]:::l4
    D --> D4["Tìm m để liên tục"]:::l4

    classDef root fill:#002060,color:#FFFFFF,stroke:#000B1E,stroke-width:2px,font-weight:bold
    classDef n1 fill:#E2EFDA,color:#000000,stroke:#375623,stroke-width:3px,font-weight:bold
    classDef n2 fill:#FFF2CC,color:#000000,stroke:#BF8F00,stroke-width:3px,font-weight:bold
    classDef n3 fill:#E2EFDA,color:#000000,stroke:#375623,stroke-width:3px,font-weight:bold
    classDef n4 fill:#FFF2CC,color:#000000,stroke:#BF8F00,stroke-width:3px,font-weight:bold
    classDef n5 fill:#E2EFDA,color:#000000,stroke:#375623,stroke-width:3px,font-weight:bold
    classDef l1 fill:#EDF5E8,color:#000000,stroke:#548235
    classDef l2 fill:#FFF8E1,color:#000000,stroke:#BF8F00
    classDef l3 fill:#E3EEF9,color:#000000,stroke:#2F5597
    classDef l4 fill:#F3E8F7,color:#000000,stroke:#7030A0
    classDef l5 fill:#FDE9E1,color:#000000,stroke:#C55A11
```

> **Bài củng cố:** <https://trangtu66.github.io/Taode_thi_online/cc_bai17_t11.html>

---

### Toán 11 – Bài tập cuối Chương V. Giới hạn. Hàm số liên tục *(Tiết 47)*

```mermaid
%%{init: {"theme": "base", "htmlLabels": true, "flowchart": {"htmlLabels": true, "padding": 10, "curve": "basis"}, "themeVariables": {"fontSize": "15px"}}}%%
graph TD
    G["🎯<BR/>CHƯƠNG<BR/>V<BR/>GIỚI<BR/>HẠN.<BR/>HÀM<BR/>SỐ<BR/>LIÊN<BR/>TỤC"]:::root
    G --> A["① Giới hạn của<br/>dãy số"]:::n1
    G --> B["② Giới hạn của<br/>hàm số"]:::n2
    G --> C["③ Hàm số liên<br/>tục"]:::n3
    G --> D["④ Ứng dụng"]:::n4

    A --> A1["★ lim 1/nᵏ =<br/>0; lim qⁿ =<br/>0 (|q| < 1)"]:::l1
    A --> A2["Phép toán giới hạn"]:::l1
    A --> A3["★ Cấp số nhân<br/>lùi vô hạn: S<br/>= u₁/(1 − q)"]:::l1
    A --> A4["Giới hạn vô cực"]:::l1

    B --> B1["Giới hạn hữu hạn<br/>tại x₀"]:::l2
    B --> B2["★ Giới hạn một<br/>bên"]:::l2
    B --> B3["Giới hạn tại vô<br/>cực"]:::l2
    B --> B4["Khử dạng 0/0, ∞/∞"]:::l2

    C --> C1["★ lim f(x) =<br/>f(x₀)"]:::l3
    C --> C2["Liên tục trên khoảng,<br/>đoạn"]:::l3
    C --> C3["Hàm sơ cấp liên<br/>tục trên TXĐ"]:::l3
    C --> C4["Hàm cho nhiều công<br/>thức"]:::l3

    D --> D1["Số thập phân tuần<br/>hoàn"]:::l4
    D --> D2["Lực hấp dẫn F(r)"]:::l4
    D --> D3["★ f(a)f(b) < 0<br/>⇒ có nghiệm"]:::l4
    D --> D4["Nồng độ, chi phí<br/>trung bình"]:::l4

    classDef root fill:#002060,color:#FFFFFF,stroke:#000B1E,stroke-width:2px,font-weight:bold
    classDef n1 fill:#E2EFDA,color:#000000,stroke:#375623,stroke-width:3px,font-weight:bold
    classDef n2 fill:#FFF2CC,color:#000000,stroke:#BF8F00,stroke-width:3px,font-weight:bold
    classDef n3 fill:#E2EFDA,color:#000000,stroke:#375623,stroke-width:3px,font-weight:bold
    classDef n4 fill:#FFF2CC,color:#000000,stroke:#BF8F00,stroke-width:3px,font-weight:bold
    classDef n5 fill:#E2EFDA,color:#000000,stroke:#375623,stroke-width:3px,font-weight:bold
    classDef l1 fill:#EDF5E8,color:#000000,stroke:#548235
    classDef l2 fill:#FFF8E1,color:#000000,stroke:#BF8F00
    classDef l3 fill:#E3EEF9,color:#000000,stroke:#2F5597
    classDef l4 fill:#F3E8F7,color:#000000,stroke:#7030A0
    classDef l5 fill:#FDE9E1,color:#000000,stroke:#C55A11
```

> **Bài củng cố:** <https://trangtu66.github.io/Taode_thi_online/cc_chuong5_t11.html>

---

### Toán 11 – Chuyên đề 1, Bài 5. Phép dời hình *(Tiết 9 (chuyên đề))*

```mermaid
%%{init: {"theme": "base", "htmlLabels": true, "flowchart": {"htmlLabels": true, "padding": 10, "curve": "basis"}, "themeVariables": {"fontSize": "15px"}}}%%
graph TD
    G["🎯<BR/>CĐ1<BR/>–<BR/>BÀI<BR/>5<BR/>PHÉP<BR/>DỜI<BR/>HÌNH"]:::root
    G --> A["① Khái niệm"]:::n1
    G --> B["② Tính chất"]:::n2
    G --> C["③ Hợp thành"]:::n3
    G --> D["④ Thiết kế đồ<br/>hoạ"]:::n4

    A --> A1["★ Bảo toàn khoảng<br/>cách giữa hai điểm"]:::l1
    A --> A2["Tịnh tiến, đối xứng<br/>trục, quay, đối xứng<br/>tâm"]:::l1
    A --> A3["Kiểm tra: M′N′ =<br/>MN"]:::l1
    A --> A4["Có phép dời hình<br/>không thuộc 4 loại<br/>trên"]:::l1

    B --> B1["Đoạn thẳng → đoạn<br/>thẳng bằng nó"]:::l2
    B --> B2["Tam giác → tam<br/>giác bằng nó"]:::l2
    B --> B3["Đường tròn → đường<br/>tròn cùng bán kính"]:::l2
    B --> B4["★ Thẳng hàng →<br/>thẳng hàng, giữ thứ<br/>tự"]:::l2

    C --> C1["★ h trước, g<br/>sau: vẫn là phép<br/>dời hình"]:::l3
    C --> C2["Đối xứng trục rồi<br/>tịnh tiến"]:::l3
    C --> C3["Hai hình bằng nhau:<br/>có phép dời hình"]:::l3
    C --> C4["Ví dụ: tứ giác<br/>AMND, CNMB"]:::l3

    D --> D1["Cầu Vàng, Đà Nẵng"]:::l4
    D --> D2["Tranh Kị binh của<br/>Escher"]:::l4
    D --> D3["Lát gạch: 17 loại<br/>“túi”"]:::l4
    D --> D4["Hoa văn thổ cẩm<br/>Gia Lai"]:::l4

    classDef root fill:#002060,color:#FFFFFF,stroke:#000B1E,stroke-width:2px,font-weight:bold
    classDef n1 fill:#E2EFDA,color:#000000,stroke:#375623,stroke-width:3px,font-weight:bold
    classDef n2 fill:#FFF2CC,color:#000000,stroke:#BF8F00,stroke-width:3px,font-weight:bold
    classDef n3 fill:#E2EFDA,color:#000000,stroke:#375623,stroke-width:3px,font-weight:bold
    classDef n4 fill:#FFF2CC,color:#000000,stroke:#BF8F00,stroke-width:3px,font-weight:bold
    classDef n5 fill:#E2EFDA,color:#000000,stroke:#375623,stroke-width:3px,font-weight:bold
    classDef l1 fill:#EDF5E8,color:#000000,stroke:#548235
    classDef l2 fill:#FFF8E1,color:#000000,stroke:#BF8F00
    classDef l3 fill:#E3EEF9,color:#000000,stroke:#2F5597
    classDef l4 fill:#F3E8F7,color:#000000,stroke:#7030A0
    classDef l5 fill:#FDE9E1,color:#000000,stroke:#C55A11
```

> **Bài củng cố:** <https://trangtu66.github.io/Taode_thi_online/cc_cd1bai5_t11.html>

---

### Toán 11 – Chuyên đề 1, Bài 6. Phép vị tự *(Tiết 10–11 (chuyên đề))*

```mermaid
%%{init: {"theme": "base", "htmlLabels": true, "flowchart": {"htmlLabels": true, "padding": 10, "curve": "basis"}, "themeVariables": {"fontSize": "15px"}}}%%
graph TD
    G["🎯<BR/>CĐ1<BR/>–<BR/>BÀI<BR/>6<BR/>PHÉP<BR/>VỊ<BR/>TỰ"]:::root
    G --> A["① Định nghĩa"]:::n1
    G --> B["② Tính chất"]:::n2
    G --> C["③ Ảnh của hình"]:::n3
    G --> D["④ Ứng dụng"]:::n4

    A --> A1["★ OM′ = k·OM<br/>(vectơ), k ≠ 0"]:::l1
    A --> A2["O: tâm vị tự,<br/>k: tỉ số"]:::l1
    A --> A3["V(O, 1): đồng nhất"]:::l1
    A --> A4["V(O, –1): đối xứng<br/>tâm O"]:::l1

    B --> B1["★ M′N′ = k·MN<br/>(vectơ)"]:::l2
    B --> B2["Độ dài: M′N′ =<br/>|k|·MN"]:::l2
    B --> B3["Thẳng hàng → thẳng<br/>hàng, giữ thứ tự"]:::l2
    B --> B4["Đường thẳng → song<br/>song hoặc trùng"]:::l2

    C --> C1["Đoạn thẳng a →<br/>|k|a"]:::l3
    C --> C2["★ Đường tròn R<br/>→ |k|R, tâm là<br/>ảnh của tâm"]:::l3
    C --> C3["Tam giác → đồng<br/>dạng tỉ số |k|"]:::l3
    C --> C4["Diện tích nhân k²"]:::l3

    D --> D1["Tranh Đông Hồ phóng<br/>to"]:::l4
    D --> D2["Quỹ tích trọng tâm<br/>(Ví dụ 3)"]:::l4
    D --> D3["Phóng to, thu nhỏ<br/>ảnh"]:::l4
    D --> D4["Ruộng bậc thang (Vận<br/>dụng 2)"]:::l4

    classDef root fill:#002060,color:#FFFFFF,stroke:#000B1E,stroke-width:2px,font-weight:bold
    classDef n1 fill:#E2EFDA,color:#000000,stroke:#375623,stroke-width:3px,font-weight:bold
    classDef n2 fill:#FFF2CC,color:#000000,stroke:#BF8F00,stroke-width:3px,font-weight:bold
    classDef n3 fill:#E2EFDA,color:#000000,stroke:#375623,stroke-width:3px,font-weight:bold
    classDef n4 fill:#FFF2CC,color:#000000,stroke:#BF8F00,stroke-width:3px,font-weight:bold
    classDef n5 fill:#E2EFDA,color:#000000,stroke:#375623,stroke-width:3px,font-weight:bold
    classDef l1 fill:#EDF5E8,color:#000000,stroke:#548235
    classDef l2 fill:#FFF8E1,color:#000000,stroke:#BF8F00
    classDef l3 fill:#E3EEF9,color:#000000,stroke:#2F5597
    classDef l4 fill:#F3E8F7,color:#000000,stroke:#7030A0
    classDef l5 fill:#FDE9E1,color:#000000,stroke:#C55A11
```

> **Bài củng cố:** <https://trangtu66.github.io/Taode_thi_online/cc_cd1bai6_t11.html>

---

### Toán 11 – Chuyên đề 1, Bài 7. Phép đồng dạng *(Tiết 12 (chuyên đề))*

```mermaid
%%{init: {"theme": "base", "htmlLabels": true, "flowchart": {"htmlLabels": true, "padding": 10, "curve": "basis"}, "themeVariables": {"fontSize": "15px"}}}%%
graph TD
    G["🎯<BR/>CĐ1<BR/>–<BR/>BÀI<BR/>7<BR/>PHÉP<BR/>ĐỒNG<BR/>DẠNG"]:::root
    G --> A["① Định nghĩa"]:::n1
    G --> B["② Hợp thành"]:::n2
    G --> C["③ Hai hình đồng<br/>dạng"]:::n3
    G --> D["④ Thực tiễn"]:::n4

    A --> A1["★ M′N′ = k·MN,<br/>k > 0"]:::l1
    A --> A2["k: tỉ số đồng<br/>dạng"]:::l1
    A --> A3["Phép dời hình: k<br/>= 1"]:::l1
    A --> A4["Phép vị tự tỉ<br/>số t: k =<br/>|t|"]:::l1

    B --> B1["★ Dời hình rồi<br/>vị tự V(O, k):<br/>tỉ số |k|"]:::l2
    B --> B2["Tỉ số k₁ rồi<br/>k₂: tỉ số k₁·k₂"]:::l2
    B --> B3["Ví dụ: đối xứng<br/>trục d rồi V(O;<br/>–2)"]:::l2
    B --> B4["Quỹ tích: P thuộc<br/>đường thẳng cố định"]:::l2

    C --> C1["Có phép đồng dạng<br/>biến H thành H′"]:::l3
    C --> C2["★ Đồng dạng là<br/>quan hệ hai chiều"]:::l3
    C --> C3["Tam giác: các cạnh<br/>tỉ lệ"]:::l3
    C --> C4["Góc được bảo toàn"]:::l3

    D --> D1["Ảnh Dinh Thống Nhất"]:::l4
    D --> D2["Thác Bản Giốc"]:::l4
    D --> D3["Bản đồ, bản vẽ<br/>tỉ lệ"]:::l4
    D --> D4["Bông tuyết Koch, fractal"]:::l4

    classDef root fill:#002060,color:#FFFFFF,stroke:#000B1E,stroke-width:2px,font-weight:bold
    classDef n1 fill:#E2EFDA,color:#000000,stroke:#375623,stroke-width:3px,font-weight:bold
    classDef n2 fill:#FFF2CC,color:#000000,stroke:#BF8F00,stroke-width:3px,font-weight:bold
    classDef n3 fill:#E2EFDA,color:#000000,stroke:#375623,stroke-width:3px,font-weight:bold
    classDef n4 fill:#FFF2CC,color:#000000,stroke:#BF8F00,stroke-width:3px,font-weight:bold
    classDef n5 fill:#E2EFDA,color:#000000,stroke:#375623,stroke-width:3px,font-weight:bold
    classDef l1 fill:#EDF5E8,color:#000000,stroke:#548235
    classDef l2 fill:#FFF8E1,color:#000000,stroke:#BF8F00
    classDef l3 fill:#E3EEF9,color:#000000,stroke:#2F5597
    classDef l4 fill:#F3E8F7,color:#000000,stroke:#7030A0
    classDef l5 fill:#FDE9E1,color:#000000,stroke:#C55A11
```

> **Bài củng cố:** <https://trangtu66.github.io/Taode_thi_online/cc_cd1bai7_t11.html>

---

### Toán 11 – Bài tập cuối chuyên đề 1. Phép biến hình phẳng *(Tiết 13 (chuyên đề))*

```mermaid
%%{init: {"theme": "base", "htmlLabels": true, "flowchart": {"htmlLabels": true, "padding": 10, "curve": "basis"}, "themeVariables": {"fontSize": "15px"}}}%%
graph TD
    G["🎯<BR/>BÀI<BR/>TẬP<BR/>CUỐI<BR/>CHUYÊN<BR/>ĐỀ<BR/>1<BR/>PHÉP<BR/>BIẾN<BR/>HÌNH<BR/>PHẲNG"]:::root
    G --> A["① Phép dời hình"]:::n1
    G --> B["② Phép vị tự"]:::n2
    G --> C["③ Phép đồng dạng"]:::n3
    G --> D["④ Vận dụng"]:::n4

    A --> A1["Tịnh tiến: M′ =<br/>M + u"]:::l1
    A --> A2["Đối xứng trục, đối<br/>xứng tâm"]:::l1
    A --> A3["Phép quay tâm O<br/>góc α"]:::l1
    A --> A4["★ Bảo toàn khoảng<br/>cách"]:::l1

    B --> B1["★ OM′ = k·OM"]:::l2
    B --> B2["Đường tròn: tâm ảnh,<br/>bán kính |k|R"]:::l2
    B --> B3["Đường thẳng → song<br/>song hoặc trùng"]:::l2
    B --> B4["Quỹ tích: ảnh của<br/>đường cố định"]:::l2

    C --> C1["★ M′N′ = k·MN,<br/>k > 0"]:::l3
    C --> C2["Dời hình rồi vị<br/>tự"]:::l3
    C --> C3["Hai hình đồng dạng"]:::l3
    C --> C4["Tỉ lệ bản đồ,<br/>ảnh chụp"]:::l3

    D --> D1["★ MA + MB<br/>nhỏ nhất: dùng đối<br/>xứng trục"]:::l4
    D --> D2["AE + BF nhỏ<br/>nhất: tịnh tiến, đối<br/>xứng"]:::l4
    D --> D3["Quỹ tích điểm (1.32,<br/>1.33)"]:::l4
    D --> D4["Nhận biết hình đồng<br/>dạng"]:::l4

    classDef root fill:#002060,color:#FFFFFF,stroke:#000B1E,stroke-width:2px,font-weight:bold
    classDef n1 fill:#E2EFDA,color:#000000,stroke:#375623,stroke-width:3px,font-weight:bold
    classDef n2 fill:#FFF2CC,color:#000000,stroke:#BF8F00,stroke-width:3px,font-weight:bold
    classDef n3 fill:#E2EFDA,color:#000000,stroke:#375623,stroke-width:3px,font-weight:bold
    classDef n4 fill:#FFF2CC,color:#000000,stroke:#BF8F00,stroke-width:3px,font-weight:bold
    classDef n5 fill:#E2EFDA,color:#000000,stroke:#375623,stroke-width:3px,font-weight:bold
    classDef l1 fill:#EDF5E8,color:#000000,stroke:#548235
    classDef l2 fill:#FFF8E1,color:#000000,stroke:#BF8F00
    classDef l3 fill:#E3EEF9,color:#000000,stroke:#2F5597
    classDef l4 fill:#F3E8F7,color:#000000,stroke:#7030A0
    classDef l5 fill:#FDE9E1,color:#000000,stroke:#C55A11
```

> **Bài củng cố:** <https://trangtu66.github.io/Taode_thi_online/cc_btcccd1_t11.html>

---

### Toán 11 – Chuyên đề 2, Bài 8. Một vài khái niệm cơ bản *(Tiết 15–17 (chuyên đề))*

```mermaid
%%{init: {"theme": "base", "htmlLabels": true, "flowchart": {"htmlLabels": true, "padding": 10, "curve": "basis"}, "themeVariables": {"fontSize": "15px"}}}%%
graph TD
    G["🎯<BR/>CĐ2<BR/>–<BR/>BÀI<BR/>8<BR/>MỘT<BR/>VÀI<BR/>KHÁI<BR/>NIỆM<BR/>CƠ<BR/>BẢN<BR/>CỦA<BR/>ĐỒ<BR/>THỊ"]:::root
    G --> A["① Đồ thị"]:::n1
    G --> B["② Bậc của đỉnh"]:::n2
    G --> C["③ Đường đi, chu<br/>trình"]:::n3
    G --> D["④ Liên thông"]:::n4

    A --> A1["G = (V, E):<br/>đỉnh, cạnh"]:::l1
    A --> A2["Khuyên, hai đỉnh kề<br/>nhau"]:::l1
    A --> A3["★ Đơn đồ thị,<br/>đa đồ thị"]:::l1
    A --> A4["Đầy đủ Kₙ: n(n<br/>– 1) : 2<br/>cạnh"]:::l1

    B --> B1["Đỉnh bậc n: đầu<br/>mút của n cạnh"]:::l2
    B --> B2["Bậc 0: cô lập;<br/>bậc 1: treo"]:::l2
    B --> B3["★ Tổng các bậc<br/>= 2 × số<br/>cạnh"]:::l2
    B --> B4["Số đỉnh bậc lẻ<br/>là số chẵn"]:::l2

    C --> C1["Dãy cạnh nối tiếp"]:::l3
    C --> C2["Chu trình: đường đi<br/>khép kín"]:::l3
    C --> C3["Độ dài: số cạnh"]:::l3
    C --> C4["Sơ cấp, đơn giản"]:::l3

    D --> D1["★ Mọi cặp đỉnh<br/>có đường đi nối"]:::l4
    D --> D2["Cầu, thành phần liên<br/>thông"]:::l4
    D --> D3["2n đỉnh, bậc ≥<br/>n: liên thông"]:::l4
    D --> D4["Bắt tay, giải đấu,<br/>mạng đường"]:::l4

    classDef root fill:#002060,color:#FFFFFF,stroke:#000B1E,stroke-width:2px,font-weight:bold
    classDef n1 fill:#E2EFDA,color:#000000,stroke:#375623,stroke-width:3px,font-weight:bold
    classDef n2 fill:#FFF2CC,color:#000000,stroke:#BF8F00,stroke-width:3px,font-weight:bold
    classDef n3 fill:#E2EFDA,color:#000000,stroke:#375623,stroke-width:3px,font-weight:bold
    classDef n4 fill:#FFF2CC,color:#000000,stroke:#BF8F00,stroke-width:3px,font-weight:bold
    classDef n5 fill:#E2EFDA,color:#000000,stroke:#375623,stroke-width:3px,font-weight:bold
    classDef l1 fill:#EDF5E8,color:#000000,stroke:#548235
    classDef l2 fill:#FFF8E1,color:#000000,stroke:#BF8F00
    classDef l3 fill:#E3EEF9,color:#000000,stroke:#2F5597
    classDef l4 fill:#F3E8F7,color:#000000,stroke:#7030A0
    classDef l5 fill:#FDE9E1,color:#000000,stroke:#C55A11
```

> **Bài củng cố:** <https://trangtu66.github.io/Taode_thi_online/cc_cd2bai8_t11.html>

---

### Toán 11 – Chuyên đề 2, Bài 9. Đường đi Euler và đường đi Hamilton *(Tiết 18–20 (chuyên đề))*

```mermaid
%%{init: {"theme": "base", "htmlLabels": true, "flowchart": {"htmlLabels": true, "padding": 10, "curve": "basis"}, "themeVariables": {"fontSize": "15px"}}}%%
graph TD
    G["🎯<BR/>CĐ2<BR/>–<BR/>BÀI<BR/>9<BR/>ĐƯỜNG<BR/>ĐI<BR/>EULER<BR/>VÀ<BR/>ĐƯỜNG<BR/>ĐI<BR/>HAMILTON"]:::root
    G --> A["① Đường đi Euler"]:::n1
    G --> B["② Đường đi Hamilton"]:::n2
    G --> C["③ Điều kiện đủ"]:::n3
    G --> D["④ Ứng dụng"]:::n4

    A --> A1["Qua mọi cạnh, mỗi<br/>cạnh một lần"]:::l1
    A --> A2["★ Chu trình Euler:<br/>liên thông, mọi bậc<br/>chẵn"]:::l1
    A --> A3["★ Đường đi Euler<br/>A → B: chỉ<br/>A, B bậc lẻ"]:::l1
    A --> A4["Vẽ hình bằng một<br/>nét liền"]:::l1

    B --> B1["Qua mọi đỉnh, mỗi<br/>đỉnh một lần"]:::l2
    B --> B2["Chu trình Hamilton: sơ<br/>cấp, chứa mọi đỉnh"]:::l2
    B --> B3["Đỉnh bậc 2: phải<br/>đi qua cả hai<br/>cạnh"]:::l2
    B --> B4["Không có tiêu chuẩn<br/>cần và đủ"]:::l2

    C --> C1["★ Ore: không kề<br/>nhau, tổng bậc ≥<br/>n"]:::l3
    C --> C2["Dirac: mọi bậc ≥<br/>n : 2"]:::l3
    C --> C3["Bậc ≥ (n –<br/>1) : 2: có<br/>đường đi Hamilton"]:::l3
    C --> C4["Kₙ (n ≥ 3)<br/>có chu trình Hamilton"]:::l3

    D --> D1["Bảy cây cầu Königsberg"]:::l4
    D --> D2["Đi qua mọi tuyến<br/>đường: thu gom rác"]:::l4
    D --> D3["Tham quan mọi điểm<br/>du lịch"]:::l4
    D --> D4["Euler – cha đẻ<br/>lí thuyết đồ thị"]:::l4

    classDef root fill:#002060,color:#FFFFFF,stroke:#000B1E,stroke-width:2px,font-weight:bold
    classDef n1 fill:#E2EFDA,color:#000000,stroke:#375623,stroke-width:3px,font-weight:bold
    classDef n2 fill:#FFF2CC,color:#000000,stroke:#BF8F00,stroke-width:3px,font-weight:bold
    classDef n3 fill:#E2EFDA,color:#000000,stroke:#375623,stroke-width:3px,font-weight:bold
    classDef n4 fill:#FFF2CC,color:#000000,stroke:#BF8F00,stroke-width:3px,font-weight:bold
    classDef n5 fill:#E2EFDA,color:#000000,stroke:#375623,stroke-width:3px,font-weight:bold
    classDef l1 fill:#EDF5E8,color:#000000,stroke:#548235
    classDef l2 fill:#FFF8E1,color:#000000,stroke:#BF8F00
    classDef l3 fill:#E3EEF9,color:#000000,stroke:#2F5597
    classDef l4 fill:#F3E8F7,color:#000000,stroke:#7030A0
    classDef l5 fill:#FDE9E1,color:#000000,stroke:#C55A11
```

> **Bài củng cố:** <https://trangtu66.github.io/Taode_thi_online/cc_cd2bai9_t11.html>

---

## 📌 Sơ đồ tư duy từng bài – Toán 12

### Toán 12 – Bài 1. Tính đơn điệu và Cực trị *(Tiết 1–6)*

```mermaid
%%{init: {"theme": "base", "htmlLabels": true, "flowchart": {"htmlLabels": true, "padding": 10, "curve": "basis"}, "themeVariables": {"fontSize": "15px"}}}%%
graph TD
    G["🎯<BR/>BÀI<BR/>1<BR/>·<BR/>TOÁN<BR/>12<BR/>TÍNH<BR/>ĐƠN<BR/>ĐIỆU<BR/>&<BR/>CỰC<BR/>TRỊ"]:::root
    G --> A["① Tính đơn điệu<br/>hàm số"]:::n1
    G --> B["② Cực trị<br/>hàm số"]:::n2
    G --> C["③ Quy tắc<br/>tìm cực trị"]:::n3
    G --> D["④ Ứng dụng<br/>thực tiễn"]:::n4

    A --> A1["Đồng biến trên (a;b):<br/>y'>0"]:::l1
    A --> A2["Nghịch biến trên (a;b):<br/>y'<0"]:::l1
    A --> A3["Lập bảng biến thiên"]:::l1
    A --> A4["Tìm khoảng đơn điệu:<br/>giải y'=0"]:::l1

    B --> B1["Cực đại: y' đổi<br/>dấu + → −"]:::l2
    B --> B2["Cực tiểu: y' đổi<br/>dấu − → +"]:::l2
    B --> B3["y' không đổi dấu:<br/>không cực trị"]:::l2

    C --> C1["Quy tắc 1 (dấu<br/>y'): BBT"]:::l3
    C --> C2["Quy tắc 2 (y''):<br/>y'(x₀)=0, y''(x₀)>0 → Cực<br/>tiểu"]:::l3

    D --> D1["Bài toán tối ưu:<br/>hộp, bể chứa"]:::l4
    D --> D2["Tìm m để hàm<br/>số có/không có cực<br/>trị"]:::l4

    classDef root fill:#002060,color:#FFFFFF,stroke:#000B1E,stroke-width:2px,font-weight:bold
    classDef n1 fill:#E2EFDA,color:#000000,stroke:#375623,stroke-width:3px,font-weight:bold
    classDef n2 fill:#FFF2CC,color:#000000,stroke:#BF8F00,stroke-width:3px,font-weight:bold
    classDef n3 fill:#E2EFDA,color:#000000,stroke:#375623,stroke-width:3px,font-weight:bold
    classDef n4 fill:#FFF2CC,color:#000000,stroke:#BF8F00,stroke-width:3px,font-weight:bold
    classDef n5 fill:#E2EFDA,color:#000000,stroke:#375623,stroke-width:3px,font-weight:bold
    classDef l1 fill:#EDF5E8,color:#000000,stroke:#548235
    classDef l2 fill:#FFF8E1,color:#000000,stroke:#BF8F00
    classDef l3 fill:#E3EEF9,color:#000000,stroke:#2F5597
    classDef l4 fill:#F3E8F7,color:#000000,stroke:#7030A0
    classDef l5 fill:#FDE9E1,color:#000000,stroke:#C55A11
```

> **Bài củng cố:** <https://trangtu66.github.io/Taode_thi_online/cc_bai1_t12.html>

---

### Toán 12 – Bài 2. GTLN – GTNN của hàm số *(Tiết 7–10)*

```mermaid
%%{init: {"theme": "base", "htmlLabels": true, "flowchart": {"htmlLabels": true, "padding": 10, "curve": "basis"}, "themeVariables": {"fontSize": "15px"}}}%%
graph TD
    G["🎯<BR/>BÀI<BR/>2<BR/>·<BR/>TOÁN<BR/>12<BR/>GTLN<BR/>–<BR/>GTNN<BR/>HÀM<BR/>SỐ"]:::root
    G --> A["① GTLN, GTNN<br/>trên [a;b]"]:::n1
    G --> B["② GTLN, GTNN<br/>trên ℝ"]:::n2
    G --> C["③ Bài toán<br/>tối ưu hóa"]:::n3
    G --> D["④ Ứng dụng<br/>thực tiễn"]:::n4

    A --> A1["Tìm x₀: y'(x₀)=0 trong<br/>(a;b)"]:::l1
    A --> A2["So sánh f(a), f(b)<br/>và f(x₀)"]:::l1
    A --> A3["Max = giá trị<br/>lớn nhất trong bảng"]:::l1

    B --> B1["Nếu có duy nhất<br/>cực đại → GTLN"]:::l2
    B --> B2["Nếu có duy nhất<br/>cực tiểu → GTNN"]:::l2
    B --> B3["Hàm bậc 3: không<br/>có GTLN/GTNN trên ℝ"]:::l2

    C --> C1["Đặt biến: x là<br/>ẩn điều chỉnh được"]:::l3
    C --> C2["Lập hàm mục tiêu<br/>f(x)"]:::l3
    C --> C3["Tìm GTLN/GTNN của f<br/>trên [a;b]"]:::l3

    D --> D1["Thiết kế hộp, bể<br/>chứa tối ưu"]:::l4
    D --> D2["Cấp nước, tưới cà<br/>phê địa phương"]:::l4

    classDef root fill:#002060,color:#FFFFFF,stroke:#000B1E,stroke-width:2px,font-weight:bold
    classDef n1 fill:#E2EFDA,color:#000000,stroke:#375623,stroke-width:3px,font-weight:bold
    classDef n2 fill:#FFF2CC,color:#000000,stroke:#BF8F00,stroke-width:3px,font-weight:bold
    classDef n3 fill:#E2EFDA,color:#000000,stroke:#375623,stroke-width:3px,font-weight:bold
    classDef n4 fill:#FFF2CC,color:#000000,stroke:#BF8F00,stroke-width:3px,font-weight:bold
    classDef n5 fill:#E2EFDA,color:#000000,stroke:#375623,stroke-width:3px,font-weight:bold
    classDef l1 fill:#EDF5E8,color:#000000,stroke:#548235
    classDef l2 fill:#FFF8E1,color:#000000,stroke:#BF8F00
    classDef l3 fill:#E3EEF9,color:#000000,stroke:#2F5597
    classDef l4 fill:#F3E8F7,color:#000000,stroke:#7030A0
    classDef l5 fill:#FDE9E1,color:#000000,stroke:#C55A11
```

> **Bài củng cố:** <https://trangtu66.github.io/Taode_thi_online/cc_bai2_t12.html>

---

### Toán 12 – Bài 3. Đường tiệm cận *(Tiết 11–13)*

```mermaid
%%{init: {"theme": "base", "htmlLabels": true, "flowchart": {"htmlLabels": true, "padding": 10, "curve": "basis"}, "themeVariables": {"fontSize": "15px"}}}%%
graph TD
    G["🎯<BR/>BÀI<BR/>3<BR/>·<BR/>TOÁN<BR/>12<BR/>ĐƯỜNG<BR/>TIỆM<BR/>CẬN"]:::root
    G --> A["① Tiệm cận<br/>ngang"]:::n1
    G --> B["② Tiệm cận<br/>đứng"]:::n2
    G --> C["③ Tiệm cận<br/>xiên"]:::n3
    G --> D["④ Số tiệm cận<br/>& bài tập"]:::n4

    A --> A1["lim f(x) = b<br/>(x→±∞) → y=b"]:::l1
    A --> A2["Phân thức bậc bằng<br/>nhau: y = a/c"]:::l1
    A --> A3["Ví dụ: y=(2x+1)/(x−3) →<br/>y=2"]:::l1

    B --> B1["lim f(x) = ±∞<br/>(x→x₀) → x=x₀"]:::l2
    B --> B2["Điểm làm mẫu =<br/>0, tử ≠ 0"]:::l2
    B --> B3["Ví dụ: y=1/(x−2) →<br/>x=2"]:::l2

    C --> C1["f(x)/(x) → k ≠<br/>0 khi x→±∞"]:::l3
    C --> C2["b = lim[f(x)−kx]"]:::l3
    C --> C3["Chia đa thức tìm<br/>dạng xiên"]:::l3

    D --> D1["Đếm tiệm cận, vẽ<br/>đồ thị đủ TC"]:::l4
    D --> D2["Tìm m để đồ<br/>thị có TC đứng/ngang"]:::l4

    classDef root fill:#002060,color:#FFFFFF,stroke:#000B1E,stroke-width:2px,font-weight:bold
    classDef n1 fill:#E2EFDA,color:#000000,stroke:#375623,stroke-width:3px,font-weight:bold
    classDef n2 fill:#FFF2CC,color:#000000,stroke:#BF8F00,stroke-width:3px,font-weight:bold
    classDef n3 fill:#E2EFDA,color:#000000,stroke:#375623,stroke-width:3px,font-weight:bold
    classDef n4 fill:#FFF2CC,color:#000000,stroke:#BF8F00,stroke-width:3px,font-weight:bold
    classDef n5 fill:#E2EFDA,color:#000000,stroke:#375623,stroke-width:3px,font-weight:bold
    classDef l1 fill:#EDF5E8,color:#000000,stroke:#548235
    classDef l2 fill:#FFF8E1,color:#000000,stroke:#BF8F00
    classDef l3 fill:#E3EEF9,color:#000000,stroke:#2F5597
    classDef l4 fill:#F3E8F7,color:#000000,stroke:#7030A0
    classDef l5 fill:#FDE9E1,color:#000000,stroke:#C55A11
```

> **Bài củng cố:** <https://trangtu66.github.io/Taode_thi_online/cc_bai3_t12.html>

---

### Toán 12 – Bài 4. Khảo sát hàm số *(Tiết 14–18)*

```mermaid
%%{init: {"theme": "base", "htmlLabels": true, "flowchart": {"htmlLabels": true, "padding": 10, "curve": "basis"}, "themeVariables": {"fontSize": "15px"}}}%%
graph TD
    G["🎯<BR/>BÀI<BR/>4<BR/>·<BR/>TOÁN<BR/>12<BR/>KHẢO<BR/>SÁT<BR/>HÀM<BR/>SỐ"]:::root
    G --> A["① Sơ đồ 5<br/>bước<br/>khảo sát"]:::n1
    G --> B["② Hàm bậc ba<br/>y = ax³+bx²+cx+d"]:::n2
    G --> C["③ Phân thức<br/>y = (ax+b)/(cx+d)"]:::n3
    G --> D["④ Phân thức<br/>y = (ax²+bx+c)/(px+q)"]:::n4

    A --> A1["① TXĐ"]:::l1
    A --> A2["② y': khoảng đơn<br/>điệu, cực trị"]:::l1
    A --> A3["③ Giới hạn &<br/>tiệm cận"]:::l1
    A --> A4["④ BBT · ⑤<br/>Vẽ đồ thị"]:::l1

    B --> B1["Δ' > 0 →<br/>2 cực trị"]:::l2
    B --> B2["Δ' ≤ 0 →<br/>không cực trị"]:::l2
    B --> B3["Tâm đối xứng I(x_I;<br/>y_I)"]:::l2

    C --> C1["TC đứng: x =<br/>−d/c"]:::l3
    C --> C2["TC ngang: y =<br/>a/c"]:::l3
    C --> C3["Không có cực trị"]:::l3

    D --> D1["TC đứng: x =<br/>−q/p"]:::l4
    D --> D2["TC xiên: chia đa<br/>thức"]:::l4
    D --> D3["Có thể có cực<br/>trị"]:::l4

    classDef root fill:#002060,color:#FFFFFF,stroke:#000B1E,stroke-width:2px,font-weight:bold
    classDef n1 fill:#E2EFDA,color:#000000,stroke:#375623,stroke-width:3px,font-weight:bold
    classDef n2 fill:#FFF2CC,color:#000000,stroke:#BF8F00,stroke-width:3px,font-weight:bold
    classDef n3 fill:#E2EFDA,color:#000000,stroke:#375623,stroke-width:3px,font-weight:bold
    classDef n4 fill:#FFF2CC,color:#000000,stroke:#BF8F00,stroke-width:3px,font-weight:bold
    classDef n5 fill:#E2EFDA,color:#000000,stroke:#375623,stroke-width:3px,font-weight:bold
    classDef l1 fill:#EDF5E8,color:#000000,stroke:#548235
    classDef l2 fill:#FFF8E1,color:#000000,stroke:#BF8F00
    classDef l3 fill:#E3EEF9,color:#000000,stroke:#2F5597
    classDef l4 fill:#F3E8F7,color:#000000,stroke:#7030A0
    classDef l5 fill:#FDE9E1,color:#000000,stroke:#C55A11
```

> **Bài củng cố:** <https://trangtu66.github.io/Taode_thi_online/cc_bai4_t12.html>

---

### Toán 12 – Bài 6. Vectơ trong không gian *(Tiết 28–33)*

```mermaid
%%{init: {"theme": "base", "htmlLabels": true, "flowchart": {"htmlLabels": true, "padding": 10, "curve": "basis"}, "themeVariables": {"fontSize": "15px"}}}%%
graph TD
    G["🎯<BR/>BÀI<BR/>6<BR/>VECTƠ<BR/>TRONG<BR/>KHÔNG<BR/>GIAN"]:::root
    G --> A["① Khái niệm"]:::n1
    G --> B["② Tổng, hiệu"]:::n2
    G --> C["③ Tích với một<br/>số"]:::n3
    G --> D["④ Tích vô hướng"]:::n4

    A --> A1["Đoạn thẳng có hướng"]:::l1
    A --> A2["Cùng phương: giá song<br/>song hoặc trùng"]:::l1
    A --> A3["★ Bằng nhau: cùng<br/>độ dài, cùng hướng"]:::l1
    A --> A4["Vectơ-không"]:::l1

    B --> B1["Quy tắc ba điểm"]:::l2
    B --> B2["Quy tắc hình bình<br/>hành"]:::l2
    B --> B3["★ Quy tắc hình<br/>hộp"]:::l2
    B --> B4["OB – OA =<br/>AB"]:::l2

    C --> C1["k > 0 cùng<br/>hướng, k < 0<br/>ngược hướng"]:::l3
    C --> C2["Độ dài |k|·|a|"]:::l3
    C --> C3["★ a, b cùng<br/>phương ⇔ a =<br/>kb"]:::l3
    C --> C4["Trọng tâm tam giác,<br/>tứ diện"]:::l3

    D --> D1["Góc (a, b) từ<br/>0° đến 180°"]:::l4
    D --> D2["★ a·b = |a|·|b|·cos(a,<br/>b)"]:::l4
    D --> D3["a ⊥ b ⇔<br/>a·b = 0"]:::l4
    D --> D4["Công A = F·MN"]:::l4

    classDef root fill:#002060,color:#FFFFFF,stroke:#000B1E,stroke-width:2px,font-weight:bold
    classDef n1 fill:#E2EFDA,color:#000000,stroke:#375623,stroke-width:3px,font-weight:bold
    classDef n2 fill:#FFF2CC,color:#000000,stroke:#BF8F00,stroke-width:3px,font-weight:bold
    classDef n3 fill:#E2EFDA,color:#000000,stroke:#375623,stroke-width:3px,font-weight:bold
    classDef n4 fill:#FFF2CC,color:#000000,stroke:#BF8F00,stroke-width:3px,font-weight:bold
    classDef n5 fill:#E2EFDA,color:#000000,stroke:#375623,stroke-width:3px,font-weight:bold
    classDef l1 fill:#EDF5E8,color:#000000,stroke:#548235
    classDef l2 fill:#FFF8E1,color:#000000,stroke:#BF8F00
    classDef l3 fill:#E3EEF9,color:#000000,stroke:#2F5597
    classDef l4 fill:#F3E8F7,color:#000000,stroke:#7030A0
    classDef l5 fill:#FDE9E1,color:#000000,stroke:#C55A11
```

> **Bài củng cố:** <https://trangtu66.github.io/Taode_thi_online/cc_bai6_t12.html>

---

### Toán 12 – Bài 7. Hệ trục toạ độ trong không gian *(Tiết 34–36)*

```mermaid
%%{init: {"theme": "base", "htmlLabels": true, "flowchart": {"htmlLabels": true, "padding": 10, "curve": "basis"}, "themeVariables": {"fontSize": "15px"}}}%%
graph TD
    G["🎯<BR/>BÀI<BR/>7<BR/>HỆ<BR/>TRỤC<BR/>TOẠ<BR/>ĐỘ<BR/>TRONG<BR/>KHÔNG<BR/>GIAN"]:::root
    G --> A["① Hệ toạ độ<br/>Oxyz"]:::n1
    G --> B["② Toạ độ điểm"]:::n2
    G --> C["③ Toạ độ vectơ"]:::n3
    G --> D["④ Thực tiễn"]:::n4

    A --> A1["Ox, Oy, Oz đôi<br/>một vuông góc"]:::l1
    A --> A2["Vectơ đơn vị i,<br/>j, k"]:::l1
    A --> A3["Mặt phẳng (Oxy), (Oyz),<br/>(Ozx)"]:::l1
    A --> A4["★ Gốc toạ độ<br/>O"]:::l1

    B --> B1["★ OM = xi<br/>+ yj + zk<br/>⇔ M(x; y; z)"]:::l2
    B --> B2["Hoành độ, tung độ,<br/>cao độ"]:::l2
    B --> B3["Chiếu lên Ox: (x;<br/>0; 0)"]:::l2
    B --> B4["Chiếu lên (Oxy): (x;<br/>y; 0)"]:::l2

    C --> C1["★ a = xi<br/>+ yj + zk<br/>⇔ a = (x;<br/>y; z)"]:::l3
    C --> C2["i(1;0;0), j(0;1;0), k(0;0;1)"]:::l3
    C --> C3["Bằng nhau ⇔ toạ<br/>độ bằng nhau"]:::l3
    C --> C4["★ MN = (xN<br/>– xM; yN –<br/>yM; zN – zM)"]:::l3

    D --> D1["Vị trí bóng đèn<br/>trong phòng"]:::l4
    D --> D2["Độ dịch chuyển máy<br/>bay"]:::l4
    D --> D3["Toạ độ cầu"]:::l4
    D --> D4["Đỉnh hình hộp, lăng<br/>trụ"]:::l4

    classDef root fill:#002060,color:#FFFFFF,stroke:#000B1E,stroke-width:2px,font-weight:bold
    classDef n1 fill:#E2EFDA,color:#000000,stroke:#375623,stroke-width:3px,font-weight:bold
    classDef n2 fill:#FFF2CC,color:#000000,stroke:#BF8F00,stroke-width:3px,font-weight:bold
    classDef n3 fill:#E2EFDA,color:#000000,stroke:#375623,stroke-width:3px,font-weight:bold
    classDef n4 fill:#FFF2CC,color:#000000,stroke:#BF8F00,stroke-width:3px,font-weight:bold
    classDef n5 fill:#E2EFDA,color:#000000,stroke:#375623,stroke-width:3px,font-weight:bold
    classDef l1 fill:#EDF5E8,color:#000000,stroke:#548235
    classDef l2 fill:#FFF8E1,color:#000000,stroke:#BF8F00
    classDef l3 fill:#E3EEF9,color:#000000,stroke:#2F5597
    classDef l4 fill:#F3E8F7,color:#000000,stroke:#7030A0
    classDef l5 fill:#FDE9E1,color:#000000,stroke:#C55A11
```

> **Bài củng cố:** <https://trangtu66.github.io/Taode_thi_online/cc_bai7_t12.html>

---

### Toán 12 – Bài 8. Biểu thức toạ độ của các phép toán vectơ *(Tiết 37–39)*

```mermaid
%%{init: {"theme": "base", "htmlLabels": true, "flowchart": {"htmlLabels": true, "padding": 10, "curve": "basis"}, "themeVariables": {"fontSize": "15px"}}}%%
graph TD
    G["🎯<BR/>BÀI<BR/>8<BR/>BIỂU<BR/>THỨC<BR/>TOẠ<BR/>ĐỘ<BR/>CÁC<BR/>PHÉP<BR/>TOÁN<BR/>VECTƠ"]:::root
    G --> A["① Cộng, trừ, nhân<br/>số"]:::n1
    G --> B["② Trung điểm, trọng<br/>tâm"]:::n2
    G --> C["③ Tích vô hướng"]:::n3
    G --> D["④ Thực tiễn"]:::n4

    A --> A1["★ a ± b<br/>= (x ± x';<br/>y ± y'; z<br/>± z')"]:::l1
    A --> A2["ka = (kx; ky;<br/>kz)"]:::l1
    A --> A3["Cùng phương: a =<br/>kb"]:::l1
    A --> A4["Vectơ đối: (–x; –y;<br/>–z)"]:::l1

    B --> B1["★ Trung điểm: trung<br/>bình cộng toạ độ<br/>2 điểm"]:::l2
    B --> B2["★ Trọng tâm: trung<br/>bình cộng toạ độ<br/>3 đỉnh"]:::l2
    B --> B3["Tìm đỉnh còn lại"]:::l2
    B --> B4["Kiểm tra thẳng hàng"]:::l2

    C --> C1["★ a·b = xx'<br/>+ yy' + zz'"]:::l3
    C --> C2["a ⊥ b ⇔<br/>xx' + yy' +<br/>zz' = 0"]:::l3
    C --> C3["|a| = √(x² +<br/>y² + z²)"]:::l3
    C --> C4["cos(a, b) = a·b<br/>: (|a|·|b|)"]:::l3

    D --> D1["Độ dài AB, chu<br/>vi, góc"]:::l4
    D --> D2["Vị trí máy bay<br/>theo radar"]:::l4
    D --> D3["Khoảng cách khinh khí<br/>cầu"]:::l4
    D --> D4["Kích thước nhà gỗ"]:::l4

    classDef root fill:#002060,color:#FFFFFF,stroke:#000B1E,stroke-width:2px,font-weight:bold
    classDef n1 fill:#E2EFDA,color:#000000,stroke:#375623,stroke-width:3px,font-weight:bold
    classDef n2 fill:#FFF2CC,color:#000000,stroke:#BF8F00,stroke-width:3px,font-weight:bold
    classDef n3 fill:#E2EFDA,color:#000000,stroke:#375623,stroke-width:3px,font-weight:bold
    classDef n4 fill:#FFF2CC,color:#000000,stroke:#BF8F00,stroke-width:3px,font-weight:bold
    classDef n5 fill:#E2EFDA,color:#000000,stroke:#375623,stroke-width:3px,font-weight:bold
    classDef l1 fill:#EDF5E8,color:#000000,stroke:#548235
    classDef l2 fill:#FFF8E1,color:#000000,stroke:#BF8F00
    classDef l3 fill:#E3EEF9,color:#000000,stroke:#2F5597
    classDef l4 fill:#F3E8F7,color:#000000,stroke:#7030A0
    classDef l5 fill:#FDE9E1,color:#000000,stroke:#C55A11
```

> **Bài củng cố:** <https://trangtu66.github.io/Taode_thi_online/cc_bai8_t12.html>

---

### Toán 12 – Bài tập cuối Chương II. Vectơ và hệ trục toạ độ trong không gian *(Tiết 40–41)*

```mermaid
%%{init: {"theme": "base", "htmlLabels": true, "flowchart": {"htmlLabels": true, "padding": 10, "curve": "basis"}, "themeVariables": {"fontSize": "15px"}}}%%
graph TD
    G["🎯<BR/>CHƯƠNG<BR/>II<BR/>VECTƠ<BR/>VÀ<BR/>HỆ<BR/>TRỤC<BR/>TOẠ<BR/>ĐỘ<BR/>TRONG<BR/>KHÔNG<BR/>GIAN"]:::root
    G --> A["① Vectơ trong không<br/>gian"]:::n1
    G --> B["② Hệ trục toạ<br/>độ"]:::n2
    G --> C["③ Biểu thức toạ<br/>độ"]:::n3
    G --> D["④ Thực tiễn"]:::n4

    A --> A1["Bằng nhau, đối nhau"]:::l1
    A --> A2["★ Quy tắc ba<br/>điểm, hình hộp"]:::l1
    A --> A3["Trọng tâm tam giác,<br/>tứ diện"]:::l1
    A --> A4["★ a·b = |a|·|b|·cos(a,<br/>b)"]:::l1

    B --> B1["Oxyz, i, j, k"]:::l2
    B --> B2["★ M(x; y; z)<br/>⇔ OM = xi<br/>+ yj + zk"]:::l2
    B --> B3["Hình chiếu trên trục,<br/>mặt phẳng"]:::l2
    B --> B4["MN = (xN –<br/>xM; …)"]:::l2

    C --> C1["Cộng, trừ, nhân số<br/>theo từng toạ độ"]:::l3
    C --> C2["★ Trung điểm, trọng<br/>tâm"]:::l3
    C --> C3["★ a·b = xx'<br/>+ yy' + zz'"]:::l3
    C --> C4["Độ dài, góc, vuông<br/>góc"]:::l3

    D --> D1["Lực, vận tốc, công"]:::l4
    D --> D2["Vị trí đèn, camera,<br/>drone"]:::l4
    D --> D3["Máy bay, radar"]:::l4
    D --> D4["Nhà kho, phòng học"]:::l4

    classDef root fill:#002060,color:#FFFFFF,stroke:#000B1E,stroke-width:2px,font-weight:bold
    classDef n1 fill:#E2EFDA,color:#000000,stroke:#375623,stroke-width:3px,font-weight:bold
    classDef n2 fill:#FFF2CC,color:#000000,stroke:#BF8F00,stroke-width:3px,font-weight:bold
    classDef n3 fill:#E2EFDA,color:#000000,stroke:#375623,stroke-width:3px,font-weight:bold
    classDef n4 fill:#FFF2CC,color:#000000,stroke:#BF8F00,stroke-width:3px,font-weight:bold
    classDef n5 fill:#E2EFDA,color:#000000,stroke:#375623,stroke-width:3px,font-weight:bold
    classDef l1 fill:#EDF5E8,color:#000000,stroke:#548235
    classDef l2 fill:#FFF8E1,color:#000000,stroke:#BF8F00
    classDef l3 fill:#E3EEF9,color:#000000,stroke:#2F5597
    classDef l4 fill:#F3E8F7,color:#000000,stroke:#7030A0
    classDef l5 fill:#FDE9E1,color:#000000,stroke:#C55A11
```

> **Bài củng cố:** <https://trangtu66.github.io/Taode_thi_online/cc_chuong2_t12.html>

---

### Toán 12 – Bài 9. Khoảng biến thiên và khoảng tứ phân vị *(Tiết 42)*

```mermaid
%%{init: {"theme": "base", "htmlLabels": true, "flowchart": {"htmlLabels": true, "padding": 10, "curve": "basis"}, "themeVariables": {"fontSize": "15px"}}}%%
graph TD
    G["🎯<BR/>BÀI<BR/>9<BR/>KHOẢNG<BR/>BIẾN<BR/>THIÊN<BR/>VÀ<BR/>KHOẢNG<BR/>TỨ<BR/>PHÂN<BR/>VỊ"]:::root
    G --> A["① Khoảng biến thiên"]:::n1
    G --> B["② Tứ phân vị"]:::n2
    G --> C["③ Khoảng tứ phân<br/>vị"]:::n3
    G --> D["④ Ứng dụng"]:::n4

    A --> A1["★ R = a(k+1)<br/>– a1"]:::l1
    A --> A2["Nhóm đầu, nhóm cuối<br/>có tần số ><br/>0"]:::l1
    A --> A3["Xấp xỉ R của<br/>mẫu gốc (lớn hơn)"]:::l1
    A --> A4["Bị ảnh hưởng bởi<br/>giá trị bất thường"]:::l1

    B --> B1["Xác định nhóm chứa<br/>Qr"]:::l2
    B --> B2["★ Qr = ap<br/>+ (rn/4 – cộng<br/>dồn trước) : mp<br/>· h"]:::l2
    B --> B3["Q1, Q2, Q3"]:::l2
    B --> B4["n = m1 +<br/>… + mk"]:::l2

    C --> C1["★ ΔQ = Q3<br/>– Q1"]:::l3
    C --> C2["Đo phân tán nửa<br/>giữa"]:::l3
    C --> C3["Không bị ảnh hưởng<br/>giá trị bất thường"]:::l3
    C --> C4["Càng lớn càng phân<br/>tán"]:::l3

    D --> D1["So sánh nhiệt độ<br/>hai tháng"]:::l4
    D --> D2["Thời gian chờ khám<br/>bệnh"]:::l4
    D --> D3["Thu nhập, chiều cao"]:::l4
    D --> D4["Năng suất cà phê"]:::l4

    classDef root fill:#002060,color:#FFFFFF,stroke:#000B1E,stroke-width:2px,font-weight:bold
    classDef n1 fill:#E2EFDA,color:#000000,stroke:#375623,stroke-width:3px,font-weight:bold
    classDef n2 fill:#FFF2CC,color:#000000,stroke:#BF8F00,stroke-width:3px,font-weight:bold
    classDef n3 fill:#E2EFDA,color:#000000,stroke:#375623,stroke-width:3px,font-weight:bold
    classDef n4 fill:#FFF2CC,color:#000000,stroke:#BF8F00,stroke-width:3px,font-weight:bold
    classDef n5 fill:#E2EFDA,color:#000000,stroke:#375623,stroke-width:3px,font-weight:bold
    classDef l1 fill:#EDF5E8,color:#000000,stroke:#548235
    classDef l2 fill:#FFF8E1,color:#000000,stroke:#BF8F00
    classDef l3 fill:#E3EEF9,color:#000000,stroke:#2F5597
    classDef l4 fill:#F3E8F7,color:#000000,stroke:#7030A0
    classDef l5 fill:#FDE9E1,color:#000000,stroke:#C55A11
```

> **Bài củng cố:** <https://trangtu66.github.io/Taode_thi_online/cc_bai9_t12.html>

---

### Toán 12 – Bài 10. Phương sai và độ lệch chuẩn *(Tiết 43–44)*

```mermaid
%%{init: {"theme": "base", "htmlLabels": true, "flowchart": {"htmlLabels": true, "padding": 10, "curve": "basis"}, "themeVariables": {"fontSize": "15px"}}}%%
graph TD
    G["🎯<BR/>BÀI<BR/>10<BR/>PHƯƠNG<BR/>SAI<BR/>VÀ<BR/>ĐỘ<BR/>LỆCH<BR/>CHUẨN"]:::root
    G --> A["① Phương sai"]:::n1
    G --> B["② Độ lệch chuẩn"]:::n2
    G --> C["③ Độ rủi ro"]:::n3
    G --> D["④ Thực tiễn"]:::n4

    A --> A1["Giá trị đại diện<br/>xi = (ai +<br/>ai+1) : 2"]:::l1
    A --> A2["★ s² = [m1(x1<br/>– x̄)² + …<br/>+ mk(xk – x̄)²]<br/>: n"]:::l1
    A --> A3["s² = (m1x1² +<br/>… + mkxk²) :<br/>n – x̄²"]:::l1
    A --> A4["Ŝ²: chia cho n<br/>– 1"]:::l1

    B --> B1["★ s = √s²"]:::l2
    B --> B2["Cùng đơn vị với<br/>số liệu"]:::l2
    B --> B3["Càng lớn càng phân<br/>tán"]:::l2
    B --> B4["Xấp xỉ cho mẫu<br/>gốc"]:::l2

    C --> C1["Độ lệch chuẩn của<br/>lợi nhuận"]:::l3
    C --> C2["★ s càng lớn<br/>càng rủi ro"]:::l3
    C --> C3["Trung bình khác nhiều:<br/>không dùng s"]:::l3
    C --> C4["Hệ số biến thiên<br/>CV = s :<br/>x̄"]:::l3

    D --> D1["Máy đo độ ẩm"]:::l4
    D --> D2["Cân nặng khi ăn<br/>kiêng"]:::l4
    D --> D3["Đầu tư lĩnh vực<br/>A, B"]:::l4
    D --> D4["Cà phê hay hồ<br/>tiêu"]:::l4

    classDef root fill:#002060,color:#FFFFFF,stroke:#000B1E,stroke-width:2px,font-weight:bold
    classDef n1 fill:#E2EFDA,color:#000000,stroke:#375623,stroke-width:3px,font-weight:bold
    classDef n2 fill:#FFF2CC,color:#000000,stroke:#BF8F00,stroke-width:3px,font-weight:bold
    classDef n3 fill:#E2EFDA,color:#000000,stroke:#375623,stroke-width:3px,font-weight:bold
    classDef n4 fill:#FFF2CC,color:#000000,stroke:#BF8F00,stroke-width:3px,font-weight:bold
    classDef n5 fill:#E2EFDA,color:#000000,stroke:#375623,stroke-width:3px,font-weight:bold
    classDef l1 fill:#EDF5E8,color:#000000,stroke:#548235
    classDef l2 fill:#FFF8E1,color:#000000,stroke:#BF8F00
    classDef l3 fill:#E3EEF9,color:#000000,stroke:#2F5597
    classDef l4 fill:#F3E8F7,color:#000000,stroke:#7030A0
    classDef l5 fill:#FDE9E1,color:#000000,stroke:#C55A11
```

> **Bài củng cố:** <https://trangtu66.github.io/Taode_thi_online/cc_bai10_t12.html>

---

### Toán 12 – Bài tập cuối Chương III. Các số đặc trưng đo mức độ phân tán *(Tiết 45)*

```mermaid
%%{init: {"theme": "base", "htmlLabels": true, "flowchart": {"htmlLabels": true, "padding": 10, "curve": "basis"}, "themeVariables": {"fontSize": "15px"}}}%%
graph TD
    G["🎯<BR/>CHƯƠNG<BR/>III<BR/>CÁC<BR/>SỐ<BR/>ĐẶC<BR/>TRƯNG<BR/>ĐO<BR/>MỨC<BR/>ĐỘ<BR/>PHÂN<BR/>TÁN"]:::root
    G --> A["① Khoảng biến thiên"]:::n1
    G --> B["② Khoảng tứ phân<br/>vị"]:::n2
    G --> C["③ Phương sai, độ<br/>lệch chuẩn"]:::n3
    G --> D["④ Ứng dụng"]:::n4

    A --> A1["★ R = a(k+1)<br/>– a1"]:::l1
    A --> A2["Dễ tính"]:::l1
    A --> A3["Bị ảnh hưởng giá<br/>trị bất thường"]:::l1
    A --> A4["Xấp xỉ R mẫu<br/>gốc"]:::l1

    B --> B1["Nhóm chứa Qr, công<br/>thức Qr"]:::l2
    B --> B2["★ ΔQ = Q3<br/>– Q1"]:::l2
    B --> B3["Không bị ảnh hưởng<br/>giá trị bất thường"]:::l2
    B --> B4["Phát hiện giá trị<br/>bất thường"]:::l2

    C --> C1["Giá trị đại diện,<br/>x̄"]:::l3
    C --> C2["★ s² = Σmi<br/>xi² : n –<br/>x̄²"]:::l3
    C --> C3["★ s = √s²,<br/>cùng đơn vị"]:::l3
    C --> C4["Đo phân tán quanh<br/>x̄"]:::l3

    D --> D1["So sánh độ ổn<br/>định"]:::l4
    D --> D2["Đo độ rủi ro<br/>đầu tư"]:::l4
    D --> D3["Trung bình khác nhiều:<br/>dùng CV"]:::l4
    D --> D4["Số liệu sản xuất<br/>ở địa phương"]:::l4

    classDef root fill:#002060,color:#FFFFFF,stroke:#000B1E,stroke-width:2px,font-weight:bold
    classDef n1 fill:#E2EFDA,color:#000000,stroke:#375623,stroke-width:3px,font-weight:bold
    classDef n2 fill:#FFF2CC,color:#000000,stroke:#BF8F00,stroke-width:3px,font-weight:bold
    classDef n3 fill:#E2EFDA,color:#000000,stroke:#375623,stroke-width:3px,font-weight:bold
    classDef n4 fill:#FFF2CC,color:#000000,stroke:#BF8F00,stroke-width:3px,font-weight:bold
    classDef n5 fill:#E2EFDA,color:#000000,stroke:#375623,stroke-width:3px,font-weight:bold
    classDef l1 fill:#EDF5E8,color:#000000,stroke:#548235
    classDef l2 fill:#FFF8E1,color:#000000,stroke:#BF8F00
    classDef l3 fill:#E3EEF9,color:#000000,stroke:#2F5597
    classDef l4 fill:#F3E8F7,color:#000000,stroke:#7030A0
    classDef l5 fill:#FDE9E1,color:#000000,stroke:#C55A11
```

> **Bài củng cố:** <https://trangtu66.github.io/Taode_thi_online/cc_chuong3_t12.html>

---

### Toán 12 – Ôn tập kiểm tra cuối kì I *(Tiết 46–47)*

```mermaid
%%{init: {"theme": "base", "htmlLabels": true, "flowchart": {"htmlLabels": true, "padding": 10, "curve": "basis"}, "themeVariables": {"fontSize": "15px"}}}%%
graph TD
    G["🎯<BR/>ÔN TẬP<BR/>CUỐI KÌ I"]:::root
    G --> A["① Chương I –<br/>Hàm số"]:::n1
    G --> B["② Chương II –<br/>Vectơ"]:::n2
    G --> C["③ Chương III –<br/>Thống kê"]:::n3
    G --> D["④ Đề cuối kì<br/>90 phút"]:::n4

    A --> A1["★ Đơn điệu, cực<br/>trị: dấu f'"]:::l1
    A --> A2["GTLN – GTNN trên<br/>đoạn"]:::l1
    A --> A3["Tiệm cận đứng, ngang,<br/>xiên"]:::l1
    A --> A4["Khảo sát, bài toán<br/>tối ưu"]:::l1

    B --> B1["Quy tắc ba điểm,<br/>hình hộp"]:::l2
    B --> B2["★ Toạ độ điểm,<br/>vectơ trong Oxyz"]:::l2
    B --> B3["★ a·b = xx'<br/>+ yy' + zz'"]:::l2
    B --> B4["Trung điểm, trọng tâm,<br/>độ dài, góc"]:::l2

    C --> C1["Khoảng biến thiên R"]:::l3
    C --> C2["★ ΔQ = Q3<br/>– Q1"]:::l3
    C --> C3["★ s² = Σmi<br/>xi² : n –<br/>x̄², s = √s²"]:::l3
    C --> C4["So sánh phân tán,<br/>rủi ro"]:::l3

    D --> D1["Phần I: 12 câu<br/>(3 điểm)"]:::l4
    D --> D2["Phần II: 4 câu<br/>đúng – sai (4<br/>điểm)"]:::l4
    D --> D3["Phần III: 6 câu<br/>trả lời ngắn (3<br/>điểm)"]:::l4
    D --> D4["Phạm vi Bài 1<br/>– Bài 10"]:::l4

    classDef root fill:#002060,color:#FFFFFF,stroke:#000B1E,stroke-width:2px,font-weight:bold
    classDef n1 fill:#E2EFDA,color:#000000,stroke:#375623,stroke-width:3px,font-weight:bold
    classDef n2 fill:#FFF2CC,color:#000000,stroke:#BF8F00,stroke-width:3px,font-weight:bold
    classDef n3 fill:#E2EFDA,color:#000000,stroke:#375623,stroke-width:3px,font-weight:bold
    classDef n4 fill:#FFF2CC,color:#000000,stroke:#BF8F00,stroke-width:3px,font-weight:bold
    classDef n5 fill:#E2EFDA,color:#000000,stroke:#375623,stroke-width:3px,font-weight:bold
    classDef l1 fill:#EDF5E8,color:#000000,stroke:#548235
    classDef l2 fill:#FFF8E1,color:#000000,stroke:#BF8F00
    classDef l3 fill:#E3EEF9,color:#000000,stroke:#2F5597
    classDef l4 fill:#F3E8F7,color:#000000,stroke:#7030A0
    classDef l5 fill:#FDE9E1,color:#000000,stroke:#C55A11
```

> **Bài củng cố:** <https://trangtu66.github.io/Taode_thi_online/cc_ontapck1_t12.html>

---

### Toán 12 – Thực hành: Khảo sát và vẽ đồ thị hàm số với GeoGebra *(Tiết 50–51)*

```mermaid
%%{init: {"theme": "base", "htmlLabels": true, "flowchart": {"htmlLabels": true, "padding": 10, "curve": "basis"}, "themeVariables": {"fontSize": "15px"}}}%%
graph TD
    G["🎯<BR/>THỰC<BR/>HÀNH<BR/>KHẢO<BR/>SÁT<BR/>HÀM<BR/>SỐ<BR/>VỚI<BR/>GEOGEBRA"]:::root
    G --> A["① Đạo hàm"]:::n1
    G --> B["② Cực trị –<br/>GTLN, GTNN"]:::n2
    G --> C["③ Tiệm cận"]:::n3
    G --> D["④ Vẽ đồ thị"]:::n4

    A --> A1["★ Derivative(f) – DaoHam"]:::l1
    A --> A2["Derivative(f, n): cấp n"]:::l1
    A --> A3["f(a): đạo hàm tại<br/>điểm"]:::l1
    A --> A4["Kiểm tra lời giải<br/>tay"]:::l1

    B --> B1["★ Extremum(f) – CucTri"]:::l2
    B --> B2["Extremum(f, a, b)"]:::l2
    B --> B3["Max(f, a, b), Min(f,<br/>a, b)"]:::l2
    B --> B4["(?, ?): không có<br/>cực trị"]:::l2

    C --> C1["★ Asymptote(f) – TiemCan"]:::l3
    C --> C2["{ }: không có<br/>tiệm cận"]:::l3
    C --> C3["TCĐ, TCN, TCX"]:::l3
    C --> C4["Đối chiếu chia đa<br/>thức"]:::l3

    D --> D1["View → Graphics 2"]:::l4
    D --> D2["Nhập hàm vào ô<br/>lệnh"]:::l4
    D --> D3["Vẽ tiệm cận trước"]:::l4
    D --> D4["Phóng to, thu nhỏ<br/>quan sát"]:::l4

    classDef root fill:#002060,color:#FFFFFF,stroke:#000B1E,stroke-width:2px,font-weight:bold
    classDef n1 fill:#E2EFDA,color:#000000,stroke:#375623,stroke-width:3px,font-weight:bold
    classDef n2 fill:#FFF2CC,color:#000000,stroke:#BF8F00,stroke-width:3px,font-weight:bold
    classDef n3 fill:#E2EFDA,color:#000000,stroke:#375623,stroke-width:3px,font-weight:bold
    classDef n4 fill:#FFF2CC,color:#000000,stroke:#BF8F00,stroke-width:3px,font-weight:bold
    classDef n5 fill:#E2EFDA,color:#000000,stroke:#375623,stroke-width:3px,font-weight:bold
    classDef l1 fill:#EDF5E8,color:#000000,stroke:#548235
    classDef l2 fill:#FFF8E1,color:#000000,stroke:#BF8F00
    classDef l3 fill:#E3EEF9,color:#000000,stroke:#2F5597
    classDef l4 fill:#F3E8F7,color:#000000,stroke:#7030A0
    classDef l5 fill:#FDE9E1,color:#000000,stroke:#C55A11
```

> **Bài củng cố:** <https://trangtu66.github.io/Taode_thi_online/cc_geogebra_hamso_t12.html>

---

### Toán 12 – Thực hành: Vẽ vectơ tổng của ba vectơ trong không gian bằng GeoGebra *(Tiết 52)*

```mermaid
%%{init: {"theme": "base", "htmlLabels": true, "flowchart": {"htmlLabels": true, "padding": 10, "curve": "basis"}, "themeVariables": {"fontSize": "15px"}}}%%
graph TD
    G["🎯<BR/>THỰC<BR/>HÀNH<BR/>VECTƠ<BR/>TỔNG<BR/>CỦA<BR/>BA<BR/>VECTƠ<BR/>VỚI<BR/>GEOGEBRA<BR/>3D"]:::root
    G --> A["① Chuẩn bị"]:::n1
    G --> B["② Dựng AE"]:::n2
    G --> C["③ Dựng AF"]:::n3
    G --> D["④ Mở rộng"]:::n4

    A --> A1["Phối cảnh – Vẽ<br/>đồ hoạ 3D"]:::l1
    A --> A2["Ẩn/hiện hệ trục"]:::l1
    A --> A3["Điểm mới A, B,<br/>C, D"]:::l1
    A --> A4["Di chuyển điểm 4<br/>chiều, 2 chiều"]:::l1

    B --> B1["Vectơ qua 2 điểm:<br/>AB, AC"]:::l2
    B --> B2["Đường song song"]:::l2
    B --> B3["Giao điểm E"]:::l2
    B --> B4["★ AE = AB<br/>+ AC"]:::l2

    C --> C1["Song song với AD,<br/>AE"]:::l3
    C --> C2["Giao điểm F"]:::l3
    C --> C3["★ AF = AE<br/>+ AD"]:::l3
    C --> C4["★ u = AB<br/>+ AC + AD"]:::l3

    D --> D1["Quy tắc hình hộp"]:::l4
    D --> D2["Nhập toạ độ, kiểm<br/>chứng"]:::l4
    D --> D3["Hợp lực ba sợi<br/>dây"]:::l4
    D --> D4["Lưu file .ggb"]:::l4

    classDef root fill:#002060,color:#FFFFFF,stroke:#000B1E,stroke-width:2px,font-weight:bold
    classDef n1 fill:#E2EFDA,color:#000000,stroke:#375623,stroke-width:3px,font-weight:bold
    classDef n2 fill:#FFF2CC,color:#000000,stroke:#BF8F00,stroke-width:3px,font-weight:bold
    classDef n3 fill:#E2EFDA,color:#000000,stroke:#375623,stroke-width:3px,font-weight:bold
    classDef n4 fill:#FFF2CC,color:#000000,stroke:#BF8F00,stroke-width:3px,font-weight:bold
    classDef n5 fill:#E2EFDA,color:#000000,stroke:#375623,stroke-width:3px,font-weight:bold
    classDef l1 fill:#EDF5E8,color:#000000,stroke:#548235
    classDef l2 fill:#FFF8E1,color:#000000,stroke:#BF8F00
    classDef l3 fill:#E3EEF9,color:#000000,stroke:#2F5597
    classDef l4 fill:#F3E8F7,color:#000000,stroke:#7030A0
    classDef l5 fill:#FDE9E1,color:#000000,stroke:#C55A11
```

> **Bài củng cố:** <https://trangtu66.github.io/Taode_thi_online/cc_geogebra_vecto_t12.html>

---

### Toán 12 – Thực hành trải nghiệm: Độ dài gang tay *(Tiết 53–54)*

```mermaid
%%{init: {"theme": "base", "htmlLabels": true, "flowchart": {"htmlLabels": true, "padding": 10, "curve": "basis"}, "themeVariables": {"fontSize": "15px"}}}%%
graph TD
    G["🎯<BR/>TRẢI<BR/>NGHIỆM<BR/>ĐỘ<BR/>DÀI<BR/>GANG<BR/>TAY"]:::root
    G --> A["① Thu thập dữ<br/>liệu"]:::n1
    G --> B["② Tóm tắt dữ<br/>liệu"]:::n2
    G --> C["③ Phân tích"]:::n3
    G --> D["④ Công nghệ"]:::n4

    A --> A1["Thước có vạch cm"]:::l1
    A --> A2["Ngón cái ở vạch<br/>0"]:::l1
    A --> A3["Dãn ngón út tối<br/>đa"]:::l1
    A --> A4["Phiếu Google Forms"]:::l1

    B --> B1["Bảng tần số ghép<br/>nhóm"]:::l2
    B --> B2["Nhóm [16;17), …, [23;24)"]:::l2
    B --> B3["Biểu đồ tần số"]:::l2
    B --> B4["Tách nam, nữ"]:::l2

    C --> C1["★ x̄ = Σmi<br/>xi : n"]:::l3
    C --> C2["★ s², s; CV<br/>= s : x̄"]:::l3
    C --> C3["So sánh nam –<br/>nữ"]:::l3
    C --> C4["Q1, Q3, ΔQ"]:::l3

    D --> D1["Excel: AVERAGE, SUM"]:::l4
    D --> D2["SQRT tính s"]:::l4
    D --> D3["Bảng T.2: x̄ ≈<br/>18,71; s ≈ 1,05<br/>(nữ)"]:::l4
    D --> D4["Bàn phím piano DS5.5,<br/>DS6.0"]:::l4

    classDef root fill:#002060,color:#FFFFFF,stroke:#000B1E,stroke-width:2px,font-weight:bold
    classDef n1 fill:#E2EFDA,color:#000000,stroke:#375623,stroke-width:3px,font-weight:bold
    classDef n2 fill:#FFF2CC,color:#000000,stroke:#BF8F00,stroke-width:3px,font-weight:bold
    classDef n3 fill:#E2EFDA,color:#000000,stroke:#375623,stroke-width:3px,font-weight:bold
    classDef n4 fill:#FFF2CC,color:#000000,stroke:#BF8F00,stroke-width:3px,font-weight:bold
    classDef n5 fill:#E2EFDA,color:#000000,stroke:#375623,stroke-width:3px,font-weight:bold
    classDef l1 fill:#EDF5E8,color:#000000,stroke:#548235
    classDef l2 fill:#FFF8E1,color:#000000,stroke:#BF8F00
    classDef l3 fill:#E3EEF9,color:#000000,stroke:#2F5597
    classDef l4 fill:#F3E8F7,color:#000000,stroke:#7030A0
    classDef l5 fill:#FDE9E1,color:#000000,stroke:#C55A11
```

> **Bài củng cố:** <https://trangtu66.github.io/Taode_thi_online/cc_gangtay_t12.html>

---

### Toán 12 – Chuyên đề 1, Bài 2. Biến ngẫu nhiên có phân bố nhị thức và áp dụng *(Tiết 6–10 (chuyên đề))*

```mermaid
%%{init: {"theme": "base", "htmlLabels": true, "flowchart": {"htmlLabels": true, "padding": 10, "curve": "basis"}, "themeVariables": {"fontSize": "15px"}}}%%
graph TD
    G["🎯<BR/>CĐ1<BR/>–<BR/>BÀI<BR/>2<BR/>PHÂN<BR/>BỐ<BR/>NHỊ<BR/>THỨC<BR/>VÀ<BR/>ÁP<BR/>DỤNG"]:::root
    G --> A["① Phép thử lặp"]:::n1
    G --> B["② Công thức Bernoulli"]:::n2
    G --> C["③ Phân bố nhị<br/>thức"]:::n3
    G --> D["④ Kì vọng, phương<br/>sai"]:::n4

    A --> A1["Lặp lại T n<br/>lần độc lập"]:::l1
    A --> A2["Mỗi lần P(E) =<br/>p, 0 < p<br/>< 1"]:::l1
    A --> A3["Gieo xúc xắc, tung<br/>đồng xu"]:::l1
    A --> A4["Kiểm tra sản phẩm,<br/>hạt giống"]:::l1

    B --> B1["★ P(Eₖ) = Cₙᵏpᵏ(1–p)ⁿ⁻ᵏ"]:::l2
    B --> B2["Eₖ: E xuất hiện<br/>đúng k lần"]:::l2
    B --> B3["“Ít nhất”: dùng biến<br/>cố đối"]:::l2
    B --> B4["Mở đầu: chọn phương<br/>án 2"]:::l2

    C --> C1["★ X ~ B(n,<br/>p)"]:::l3
    C --> C2["X: số lần E<br/>xuất hiện trong n<br/>lần"]:::l3
    C --> C3["P(X ≤ k), P(X<br/>≥ k): cộng các<br/>số hạng"]:::l3
    C --> C4["Ber(p): trường hợp n<br/>= 1"]:::l3

    D --> D1["★ E(X) = np"]:::l4
    D --> D2["V(X) = np(1 –<br/>p)"]:::l4
    D --> D3["σ(X) = √(np(1 –<br/>p))"]:::l4
    D --> D4["Thi trắc nghiệm: trung<br/>bình 2,5 điểm"]:::l4

    classDef root fill:#002060,color:#FFFFFF,stroke:#000B1E,stroke-width:2px,font-weight:bold
    classDef n1 fill:#E2EFDA,color:#000000,stroke:#375623,stroke-width:3px,font-weight:bold
    classDef n2 fill:#FFF2CC,color:#000000,stroke:#BF8F00,stroke-width:3px,font-weight:bold
    classDef n3 fill:#E2EFDA,color:#000000,stroke:#375623,stroke-width:3px,font-weight:bold
    classDef n4 fill:#FFF2CC,color:#000000,stroke:#BF8F00,stroke-width:3px,font-weight:bold
    classDef n5 fill:#E2EFDA,color:#000000,stroke:#375623,stroke-width:3px,font-weight:bold
    classDef l1 fill:#EDF5E8,color:#000000,stroke:#548235
    classDef l2 fill:#FFF8E1,color:#000000,stroke:#BF8F00
    classDef l3 fill:#E3EEF9,color:#000000,stroke:#2F5597
    classDef l4 fill:#F3E8F7,color:#000000,stroke:#7030A0
    classDef l5 fill:#FDE9E1,color:#000000,stroke:#C55A11
```

> **Bài củng cố:** <https://trangtu66.github.io/Taode_thi_online/cc_cd1bai2_t12.html>

---

### Toán 12 – Bài tập cuối chuyên đề 1. Biến ngẫu nhiên rời rạc. Các số đặc trưng của biến ngẫu nhiên rời rạc *(Tiết 11 (chuyên đề))*

```mermaid
%%{init: {"theme": "base", "htmlLabels": true, "flowchart": {"htmlLabels": true, "padding": 10, "curve": "basis"}, "themeVariables": {"fontSize": "15px"}}}%%
graph TD
    G["🎯<BR/>BÀI<BR/>TẬP<BR/>CUỐI<BR/>CHUYÊN<BR/>ĐỀ<BR/>1<BR/>BIẾN<BR/>NGẪU<BR/>NHIÊN<BR/>RỜI<BR/>RẠC"]:::root
    G --> A["① Bảng phân bố"]:::n1
    G --> B["② Số đặc trưng"]:::n2
    G --> C["③ Phân bố nhị<br/>thức"]:::n3
    G --> D["④ Ra quyết định"]:::n4

    A --> A1["★ Tổng các xác<br/>suất bằng 1"]:::l1
    A --> A2["Liệt kê giá trị<br/>của X"]:::l1
    A --> A3["Đếm kết quả thuận<br/>lợi"]:::l1
    A --> A4["Bài 1.13, 1.14"]:::l1

    B --> B1["★ E(X) = Σ<br/>xᵢpᵢ"]:::l2
    B --> B2["V(X) = Σ xᵢ²pᵢ<br/>– [E(X)]²"]:::l2
    B --> B3["σ(X) = √V(X)"]:::l2
    B --> B4["Bài 1.15, 1.18: so<br/>sánh kì vọng"]:::l2

    C --> C1["★ X ~ B(n,<br/>p): độc lập, cùng<br/>p"]:::l3
    C --> C2["P(X = k) =<br/>Cₙᵏpᵏ(1 – p)ⁿ⁻ᵏ"]:::l3
    C --> C3["E(X) = np, V(X)<br/>= np(1 – p)"]:::l3
    C --> C4["Bài 1.16, 1.17"]:::l3

    D --> D1["Chọn phương án có<br/>E lớn hơn"]:::l4
    D --> D2["Chọn câu hỏi nào<br/>trước (1.15)"]:::l4
    D --> D3["Mấy xe cho thuê<br/>(1.18)"]:::l4
    D --> D4["Hệ 5 hay 3<br/>thành phần (1.17)"]:::l4

    classDef root fill:#002060,color:#FFFFFF,stroke:#000B1E,stroke-width:2px,font-weight:bold
    classDef n1 fill:#E2EFDA,color:#000000,stroke:#375623,stroke-width:3px,font-weight:bold
    classDef n2 fill:#FFF2CC,color:#000000,stroke:#BF8F00,stroke-width:3px,font-weight:bold
    classDef n3 fill:#E2EFDA,color:#000000,stroke:#375623,stroke-width:3px,font-weight:bold
    classDef n4 fill:#FFF2CC,color:#000000,stroke:#BF8F00,stroke-width:3px,font-weight:bold
    classDef n5 fill:#E2EFDA,color:#000000,stroke:#375623,stroke-width:3px,font-weight:bold
    classDef l1 fill:#EDF5E8,color:#000000,stroke:#548235
    classDef l2 fill:#FFF8E1,color:#000000,stroke:#BF8F00
    classDef l3 fill:#E3EEF9,color:#000000,stroke:#2F5597
    classDef l4 fill:#F3E8F7,color:#000000,stroke:#7030A0
    classDef l5 fill:#FDE9E1,color:#000000,stroke:#C55A11
```

> **Bài củng cố:** <https://trangtu66.github.io/Taode_thi_online/cc_btcccd1_t12.html>

---

### Toán 12 – Chuyên đề 2, Bài 3. Vận dụng hệ bất phương trình bậc nhất hai ẩn để giải quyết một số bài toán quy hoạch tuyến tính *(Tiết 13–17 (chuyên đề))*

```mermaid
%%{init: {"theme": "base", "htmlLabels": true, "flowchart": {"htmlLabels": true, "padding": 10, "curve": "basis"}, "themeVariables": {"fontSize": "15px"}}}%%
graph TD
    G["🎯<BR/>CĐ2<BR/>–<BR/>BÀI<BR/>3<BR/>QUY<BR/>HOẠCH<BR/>TUYẾN<BR/>TÍNH"]:::root
    G --> A["① Bài toán QHTT"]:::n1
    G --> B["② Miền đa giác"]:::n2
    G --> C["③ Miền không là<br/>đa giác"]:::n3
    G --> D["④ 5 bước giải"]:::n4

    A --> A1["★ F(x; y) =<br/>Ax + By →<br/>max (min)"]:::l1
    A --> A2["Ràng buộc: hệ BPT<br/>bậc nhất"]:::l1
    A --> A3["Phương án chấp nhận<br/>được"]:::l1
    A --> A4["Phương án tối ưu,<br/>giá trị tối ưu"]:::l1

    B --> B1["★ Tối ưu tại<br/>một điểm cực biên"]:::l2
    B --> B2["Tính F tại các<br/>đỉnh"]:::l2
    B --> B3["Có thể vô số<br/>phương án (VD4)"]:::l2
    B --> B4["Bài toán vitamin, sản<br/>xuất"]:::l2

    C --> C1["A, B > 0;<br/>x, y ≥ 0"]:::l3
    C --> C2["★ Có min, không<br/>có max"]:::l3
    C --> C3["Đường mức dₘ: Ax<br/>+ By = m"]:::l3
    C --> C4["Khẩu phần ăn, thuê<br/>xe"]:::l3

    D --> D1["1. Đặt biến"]:::l4
    D --> D2["2. Hàm mục tiêu"]:::l4
    D --> D3["3. Hệ ràng buộc"]:::l4
    D --> D4["4. Miền nghiệm, điểm<br/>cực biên → 5.<br/>Kết luận"]:::l4

    classDef root fill:#002060,color:#FFFFFF,stroke:#000B1E,stroke-width:2px,font-weight:bold
    classDef n1 fill:#E2EFDA,color:#000000,stroke:#375623,stroke-width:3px,font-weight:bold
    classDef n2 fill:#FFF2CC,color:#000000,stroke:#BF8F00,stroke-width:3px,font-weight:bold
    classDef n3 fill:#E2EFDA,color:#000000,stroke:#375623,stroke-width:3px,font-weight:bold
    classDef n4 fill:#FFF2CC,color:#000000,stroke:#BF8F00,stroke-width:3px,font-weight:bold
    classDef n5 fill:#E2EFDA,color:#000000,stroke:#375623,stroke-width:3px,font-weight:bold
    classDef l1 fill:#EDF5E8,color:#000000,stroke:#548235
    classDef l2 fill:#FFF8E1,color:#000000,stroke:#BF8F00
    classDef l3 fill:#E3EEF9,color:#000000,stroke:#2F5597
    classDef l4 fill:#F3E8F7,color:#000000,stroke:#7030A0
    classDef l5 fill:#FDE9E1,color:#000000,stroke:#C55A11
```

> **Bài củng cố:** <https://trangtu66.github.io/Taode_thi_online/cc_cd2bai3_t12.html>

---

### Toán 12 – Chuyên đề 2, Bài 4. Vận dụng đạo hàm để giải quyết một số bài toán tối ưu *(Tiết 18–22 (chuyên đề))*

```mermaid
%%{init: {"theme": "base", "htmlLabels": true, "flowchart": {"htmlLabels": true, "padding": 10, "curve": "basis"}, "themeVariables": {"fontSize": "15px"}}}%%
graph TD
    G["🎯<BR/>CĐ2<BR/>–<BR/>BÀI<BR/>4<BR/>ĐẠO<BR/>HÀM<BR/>VÀ<BR/>BÀI<BR/>TOÁN<BR/>TỐI<BR/>ƯU"]:::root
    G --> A["① 5 bước giải"]:::n1
    G --> B["② Tối ưu thực<br/>tiễn"]:::n2
    G --> C["③ Hàm kinh tế"]:::n3
    G --> D["④ Đại lượng biên"]:::n4

    A --> A1["1. Hiểu vấn đề"]:::l1
    A --> A2["2. Giới thiệu kí<br/>hiệu"]:::l1
    A --> A3["3. Lập hàm số<br/>L = f(x), miền<br/>xác định"]:::l1
    A --> A4["★ 4. Phát biểu<br/>→ 5. Tìm GTLN,<br/>GTNN"]:::l1

    B --> B1["Thời gian ngắn nhất<br/>(đánh cá)"]:::l2
    B --> B2["Ném xiên: tầm xa<br/>lớn nhất α =<br/>45°"]:::l2
    B --> B3["Phản xạ: góc tới<br/>= góc phản xạ"]:::l2
    B --> B4["Khúc xạ: định luật<br/>Snell"]:::l2

    C --> C1["Chi phí C(x), cầu<br/>p(x)"]:::l3
    C --> C2["★ Doanh thu R(x)<br/>= x·p(x)"]:::l3
    C --> C3["★ Lợi nhuận P(x)<br/>= R(x) – C(x)"]:::l3
    C --> C4["Chi phí trung bình<br/>c(x) = C(x)/x"]:::l3

    D --> D1["Chi phí biên C′(x)"]:::l4
    D --> D2["Doanh thu biên R′(x)"]:::l4
    D --> D3["Lợi nhuận lớn nhất:<br/>R′(x) = C′(x)"]:::l4
    D --> D4["x nguyên: so sánh<br/>hai số lân cận"]:::l4

    classDef root fill:#002060,color:#FFFFFF,stroke:#000B1E,stroke-width:2px,font-weight:bold
    classDef n1 fill:#E2EFDA,color:#000000,stroke:#375623,stroke-width:3px,font-weight:bold
    classDef n2 fill:#FFF2CC,color:#000000,stroke:#BF8F00,stroke-width:3px,font-weight:bold
    classDef n3 fill:#E2EFDA,color:#000000,stroke:#375623,stroke-width:3px,font-weight:bold
    classDef n4 fill:#FFF2CC,color:#000000,stroke:#BF8F00,stroke-width:3px,font-weight:bold
    classDef n5 fill:#E2EFDA,color:#000000,stroke:#375623,stroke-width:3px,font-weight:bold
    classDef l1 fill:#EDF5E8,color:#000000,stroke:#548235
    classDef l2 fill:#FFF8E1,color:#000000,stroke:#BF8F00
    classDef l3 fill:#E3EEF9,color:#000000,stroke:#2F5597
    classDef l4 fill:#F3E8F7,color:#000000,stroke:#7030A0
    classDef l5 fill:#FDE9E1,color:#000000,stroke:#C55A11
```

> **Bài củng cố:** <https://trangtu66.github.io/Taode_thi_online/cc_cd2bai4_t12.html>

---

### Toán 12 – Bài tập cuối chuyên đề 2. Ứng dụng toán học để giải quyết một số bài toán tối ưu *(Tiết 23 (chuyên đề))*

```mermaid
%%{init: {"theme": "base", "htmlLabels": true, "flowchart": {"htmlLabels": true, "padding": 10, "curve": "basis"}, "themeVariables": {"fontSize": "15px"}}}%%
graph TD
    G["🎯<BR/>BÀI<BR/>TẬP<BR/>CUỐI<BR/>CHUYÊN<BR/>ĐỀ<BR/>2<BR/>BÀI<BR/>TOÁN<BR/>TỐI<BR/>ƯU"]:::root
    G --> A["① Quy hoạch tuyến<br/>tính"]:::n1
    G --> B["② Đạo hàm –<br/>thực tiễn"]:::n2
    G --> C["③ Đạo hàm –<br/>kinh tế"]:::n3
    G --> D["④ Lưu ý khi<br/>kết luận"]:::n4

    A --> A1["Đặt biến, hàm mục<br/>tiêu"]:::l1
    A --> A2["★ Hệ ràng buộc:<br/>“ít nhất” ≥, “không<br/>quá” ≤"]:::l1
    A --> A3["Điểm cực biên của<br/>miền"]:::l1
    A --> A4["Bài 2.11, 2.12, 2.13"]:::l1

    B --> B1["Lập hàm một biến,<br/>miền xác định"]:::l2
    B --> B2["★ So sánh giá<br/>trị tại đầu mút"]:::l2
    B --> B3["Góc nhìn, chiếu sáng,<br/>lực kéo"]:::l2
    B --> B4["Bài 2.14, 2.15, 2.16"]:::l2

    C --> C1["R(x) = x·p(x)"]:::l3
    C --> C2["★ P(x) = R(x)<br/>– C(x)"]:::l3
    C --> C3["R′(x) = C′(x) khi<br/>lợi nhuận lớn nhất"]:::l3
    C --> C4["Bài 2.17"]:::l3

    D --> D1["Biến nguyên: so sánh<br/>lân cận"]:::l4
    D --> D2["Miền không bị chặn:<br/>có min, không max"]:::l4
    D --> D3["Vô số phương án<br/>tối ưu"]:::l4
    D --> D4["Diễn giải theo thực<br/>tế"]:::l4

    classDef root fill:#002060,color:#FFFFFF,stroke:#000B1E,stroke-width:2px,font-weight:bold
    classDef n1 fill:#E2EFDA,color:#000000,stroke:#375623,stroke-width:3px,font-weight:bold
    classDef n2 fill:#FFF2CC,color:#000000,stroke:#BF8F00,stroke-width:3px,font-weight:bold
    classDef n3 fill:#E2EFDA,color:#000000,stroke:#375623,stroke-width:3px,font-weight:bold
    classDef n4 fill:#FFF2CC,color:#000000,stroke:#BF8F00,stroke-width:3px,font-weight:bold
    classDef n5 fill:#E2EFDA,color:#000000,stroke:#375623,stroke-width:3px,font-weight:bold
    classDef l1 fill:#EDF5E8,color:#000000,stroke:#548235
    classDef l2 fill:#FFF8E1,color:#000000,stroke:#BF8F00
    classDef l3 fill:#E3EEF9,color:#000000,stroke:#2F5597
    classDef l4 fill:#F3E8F7,color:#000000,stroke:#7030A0
    classDef l5 fill:#FDE9E1,color:#000000,stroke:#C55A11
```

> **Bài củng cố:** <https://trangtu66.github.io/Taode_thi_online/cc_btcccd2_t12.html>

---

### Toán 12 – Chuyên đề 3, Bài 5. Tiền tệ. Lãi suất *(Tiết 25–27 (chuyên đề))*

```mermaid
%%{init: {"theme": "base", "htmlLabels": true, "flowchart": {"htmlLabels": true, "padding": 10, "curve": "basis"}, "themeVariables": {"fontSize": "15px"}}}%%
graph TD
    G["🎯<BR/>CĐ3<BR/>–<BR/>BÀI<BR/>5<BR/>TIỀN<BR/>TỆ.<BR/>LÃI<BR/>SUẤT"]:::root
    G --> A["① Tiền tệ"]:::n1
    G --> B["② Lãi đơn"]:::n2
    G --> C["③ Lãi kép"]:::n3
    G --> D["④ Lạm phát"]:::n4

    A --> A1["Phương tiện thanh toán<br/>chính quy"]:::l1
    A --> A2["3 chức năng: đo<br/>giá trị, trao đổi,<br/>tích luỹ"]:::l1
    A --> A3["Tính chất: đồng nhất,<br/>tin tưởng"]:::l1
    A --> A4["Nguyên tắc tổng tiền<br/>bằng 0"]:::l1

    B --> B1["★ I = Prt;<br/>A = P(1 +<br/>rt)"]:::l2
    B --> B2["Lãi mỗi kì bằng<br/>nhau"]:::l2
    B --> B3["Khoản ngắn hạn (<<br/>1 năm)"]:::l2
    B --> B4["Theo ngày: I =<br/>Prt/365"]:::l2

    C --> C1["★ A = P(1<br/>+ r/n)^(nt)"]:::l3
    C --> C2["Lãi nhập vốn sau<br/>mỗi kì"]:::l3
    C --> C3["n lớn → A<br/>lớn hơn"]:::l3
    C --> C4["Mở đầu: chọn phương<br/>án 2"]:::l3

    D --> D1["Sức mua: A =<br/>P(1 – g)ⁿ"]:::l4
    D --> D2["★ r thực =<br/>(r – g)/(1 +<br/>g)"]:::l4
    D --> D3["g nhỏ: r thực<br/>≈ r – g"]:::l4
    D --> D4["Lãi suất thực âm<br/>khi r < g"]:::l4

    classDef root fill:#002060,color:#FFFFFF,stroke:#000B1E,stroke-width:2px,font-weight:bold
    classDef n1 fill:#E2EFDA,color:#000000,stroke:#375623,stroke-width:3px,font-weight:bold
    classDef n2 fill:#FFF2CC,color:#000000,stroke:#BF8F00,stroke-width:3px,font-weight:bold
    classDef n3 fill:#E2EFDA,color:#000000,stroke:#375623,stroke-width:3px,font-weight:bold
    classDef n4 fill:#FFF2CC,color:#000000,stroke:#BF8F00,stroke-width:3px,font-weight:bold
    classDef n5 fill:#E2EFDA,color:#000000,stroke:#375623,stroke-width:3px,font-weight:bold
    classDef l1 fill:#EDF5E8,color:#000000,stroke:#548235
    classDef l2 fill:#FFF8E1,color:#000000,stroke:#BF8F00
    classDef l3 fill:#E3EEF9,color:#000000,stroke:#2F5597
    classDef l4 fill:#F3E8F7,color:#000000,stroke:#7030A0
    classDef l5 fill:#FDE9E1,color:#000000,stroke:#C55A11
```

> **Bài củng cố:** <https://trangtu66.github.io/Taode_thi_online/cc_cd3bai5_t12.html>

---

### Toán 12 – Chuyên đề 3, Bài 6. Tín dụng. Vay nợ *(Tiết 28–30 (chuyên đề))*

```mermaid
%%{init: {"theme": "base", "htmlLabels": true, "flowchart": {"htmlLabels": true, "padding": 10, "curve": "basis"}, "themeVariables": {"fontSize": "15px"}}}%%
graph TD
    G["🎯<BR/>CĐ3<BR/>–<BR/>BÀI<BR/>6<BR/>TÍN<BR/>DỤNG.<BR/>VAY<BR/>NỢ"]:::root
    G --> A["① Thẻ tín dụng"]:::n1
    G --> B["② Tính lãi thẻ"]:::n2
    G --> C["③ Vay lãi đơn,<br/>lãi kép"]:::n3
    G --> D["④ Vay trả góp"]:::n4

    A --> A1["Thanh toán chậm, rút<br/>tiền, trả góp"]:::l1
    A --> A2["Phí: phát hành, thường<br/>niên, chậm trả"]:::l1
    A --> A3["★ Miễn lãi 45<br/>– 50 ngày nếu<br/>trả đủ"]:::l1
    A --> A4["Rút tiền mặt: phí<br/>3 – 5%"]:::l1

    B --> B1["★ Lãi = dư<br/>nợ · r/365 ·<br/>số ngày"]:::l2
    B --> B2["Chia dư nợ theo<br/>từng khoảng"]:::l2
    B --> B3["Trả tối thiểu vẫn<br/>bị tính lãi"]:::l2
    B --> B4["Chi tiêu trong khả<br/>năng trả nợ"]:::l2

    C --> C1["Ngắn hạn: A =<br/>P(1 + rt)"]:::l3
    C --> C2["Trung, dài hạn: A<br/>= P(1 + r/n)^(nt)"]:::l3
    C --> C3["So sánh để chọn<br/>khoản vay"]:::l3
    C --> C4["Bài 3.10, 3.11"]:::l3

    D --> D1["★ P = V·i/[1<br/>– (1 + i)^(–n)]"]:::l4
    D --> D2["Tổng trả = P·n"]:::l4
    D --> D3["Tiền lãi = P·n<br/>– V"]:::l4
    D --> D4["Mở đầu: anh Hùng<br/>mua ô tô"]:::l4

    classDef root fill:#002060,color:#FFFFFF,stroke:#000B1E,stroke-width:2px,font-weight:bold
    classDef n1 fill:#E2EFDA,color:#000000,stroke:#375623,stroke-width:3px,font-weight:bold
    classDef n2 fill:#FFF2CC,color:#000000,stroke:#BF8F00,stroke-width:3px,font-weight:bold
    classDef n3 fill:#E2EFDA,color:#000000,stroke:#375623,stroke-width:3px,font-weight:bold
    classDef n4 fill:#FFF2CC,color:#000000,stroke:#BF8F00,stroke-width:3px,font-weight:bold
    classDef n5 fill:#E2EFDA,color:#000000,stroke:#375623,stroke-width:3px,font-weight:bold
    classDef l1 fill:#EDF5E8,color:#000000,stroke:#548235
    classDef l2 fill:#FFF8E1,color:#000000,stroke:#BF8F00
    classDef l3 fill:#E3EEF9,color:#000000,stroke:#2F5597
    classDef l4 fill:#F3E8F7,color:#000000,stroke:#7030A0
    classDef l5 fill:#FDE9E1,color:#000000,stroke:#C55A11
```

> **Bài củng cố:** <https://trangtu66.github.io/Taode_thi_online/cc_cd3bai6_t12.html>

---

### Toán 12 – Chuyên đề 3, Bài 7. Đầu tư tài chính. Lập kế hoạch tài chính cá nhân *(Tiết 31–33 (chuyên đề))*

```mermaid
%%{init: {"theme": "base", "htmlLabels": true, "flowchart": {"htmlLabels": true, "padding": 10, "curve": "basis"}, "themeVariables": {"fontSize": "15px"}}}%%
graph TD
    G["🎯<BR/>CĐ3<BR/>–<BR/>BÀI<BR/>7<BR/>ĐẦU<BR/>TƯ<BR/>TÀI<BR/>CHÍNH.<BR/>KẾ<BR/>HOẠCH<BR/>TÀI<BR/>CHÍNH"]:::root
    G --> A["① Đầu tư"]:::n1
    G --> B["② Giá trị hiện<br/>tại"]:::n2
    G --> C["③ Kế hoạch tài<br/>chính"]:::n3
    G --> D["④ Niên kim"]:::n4

    A --> A1["Tiết kiệm, vàng, bất<br/>động sản, chứng khoán"]:::l1
    A --> A2["Lợi nhuận đi cùng<br/>rủi ro"]:::l1
    A --> A3["★ r = n(ᴺ√(A/P)<br/>– 1)"]:::l1
    A --> A4["★ N = log₁₊ᵣ/ₙ<br/>(A/P)"]:::l1

    B --> B1["★ P = A(1<br/>+ r/n)^(–nt)"]:::l2
    B --> B2["Luôn nhỏ hơn A"]:::l2
    B --> B3["Trái phiếu, khoản tiền<br/>tương lai"]:::l2
    B --> B4["Mở đầu: xổ số<br/>trả dần"]:::l2

    C --> C1["B1: Mục tiêu, thời<br/>hạn"]:::l3
    C --> C2["B2: Theo dõi thu<br/>– chi"]:::l3
    C --> C3["B3: Quy tắc 80/10/10"]:::l3
    C --> C4["B4: Tuân thủ, điều<br/>chỉnh"]:::l3

    D --> D1["★ A = P[(1<br/>+ i)ⁿ – 1]/i"]:::l4
    D --> D2["★ V = P[1<br/>– (1 + i)^(–n)]/i"]:::l4
    D --> D3["Truy hồi Aₙ =<br/>(1 + i)Aₙ₋₁ +<br/>P"]:::l4
    D --> D4["Máy tính cầm tay,<br/>Excel"]:::l4

    classDef root fill:#002060,color:#FFFFFF,stroke:#000B1E,stroke-width:2px,font-weight:bold
    classDef n1 fill:#E2EFDA,color:#000000,stroke:#375623,stroke-width:3px,font-weight:bold
    classDef n2 fill:#FFF2CC,color:#000000,stroke:#BF8F00,stroke-width:3px,font-weight:bold
    classDef n3 fill:#E2EFDA,color:#000000,stroke:#375623,stroke-width:3px,font-weight:bold
    classDef n4 fill:#FFF2CC,color:#000000,stroke:#BF8F00,stroke-width:3px,font-weight:bold
    classDef n5 fill:#E2EFDA,color:#000000,stroke:#375623,stroke-width:3px,font-weight:bold
    classDef l1 fill:#EDF5E8,color:#000000,stroke:#548235
    classDef l2 fill:#FFF8E1,color:#000000,stroke:#BF8F00
    classDef l3 fill:#E3EEF9,color:#000000,stroke:#2F5597
    classDef l4 fill:#F3E8F7,color:#000000,stroke:#7030A0
    classDef l5 fill:#FDE9E1,color:#000000,stroke:#C55A11
```

> **Bài củng cố:** <https://trangtu66.github.io/Taode_thi_online/cc_cd3bai7_t12.html>

---

### Toán 12 – Bài tập cuối chuyên đề 3. Ứng dụng toán học trong một số vấn đề liên quan đến tài chính *(Tiết 34 (chuyên đề))*

```mermaid
%%{init: {"theme": "base", "htmlLabels": true, "flowchart": {"htmlLabels": true, "padding": 10, "curve": "basis"}, "themeVariables": {"fontSize": "15px"}}}%%
graph TD
    G["🎯<BR/>BÀI<BR/>TẬP<BR/>CUỐI<BR/>CHUYÊN<BR/>ĐỀ<BR/>3<BR/>TOÁN<BR/>HỌC<BR/>VÀ<BR/>TÀI<BR/>CHÍNH"]:::root
    G --> A["① Lãi đơn –<br/>lãi kép"]:::n1
    G --> B["② Lạm phát"]:::n2
    G --> C["③ Đầu tư, niên<br/>kim"]:::n3
    G --> D["④ Vay trả góp"]:::n4

    A --> A1["I = Prt; A<br/>= P(1 + rt)"]:::l1
    A --> A2["★ A = P(1<br/>+ r/n)^(nt)"]:::l1
    A --> A3["So sánh: quy về<br/>cùng 1 năm"]:::l1
    A --> A4["Bài 3.19, 3.20"]:::l1

    B --> B1["Sức mua A =<br/>P(1 – g)ⁿ"]:::l2
    B --> B2["★ r thực =<br/>(r – g)/(1 +<br/>g)"]:::l2
    B --> B3["Học phí, CPI tăng<br/>(1 + g)ⁿ"]:::l2
    B --> B4["Bài 3.22"]:::l2

    C --> C1["★ N = log₁₊ᵣ/ₙ<br/>(A/P), làm tròn lên"]:::l3
    C --> C2["Giá trị hiện tại<br/>P = A(1 +<br/>r/n)^(–nt)"]:::l3
    C --> C3["A = P[(1 +<br/>i)ⁿ – 1]/i"]:::l3
    C --> C4["Bài 3.21, 3.23"]:::l3

    D --> D1["★ P = V·i/[1<br/>– (1 + i)^(–n)]"]:::l4
    D --> D2["Tổng trả, tổng lãi"]:::l4
    D --> D3["Vay hay tự tích<br/>luỹ?"]:::l4
    D --> D4["Bài 3.24"]:::l4

    classDef root fill:#002060,color:#FFFFFF,stroke:#000B1E,stroke-width:2px,font-weight:bold
    classDef n1 fill:#E2EFDA,color:#000000,stroke:#375623,stroke-width:3px,font-weight:bold
    classDef n2 fill:#FFF2CC,color:#000000,stroke:#BF8F00,stroke-width:3px,font-weight:bold
    classDef n3 fill:#E2EFDA,color:#000000,stroke:#375623,stroke-width:3px,font-weight:bold
    classDef n4 fill:#FFF2CC,color:#000000,stroke:#BF8F00,stroke-width:3px,font-weight:bold
    classDef n5 fill:#E2EFDA,color:#000000,stroke:#375623,stroke-width:3px,font-weight:bold
    classDef l1 fill:#EDF5E8,color:#000000,stroke:#548235
    classDef l2 fill:#FFF8E1,color:#000000,stroke:#BF8F00
    classDef l3 fill:#E3EEF9,color:#000000,stroke:#2F5597
    classDef l4 fill:#F3E8F7,color:#000000,stroke:#7030A0
    classDef l5 fill:#FDE9E1,color:#000000,stroke:#C55A11
```

> **Bài củng cố:** <https://trangtu66.github.io/Taode_thi_online/cc_btcccd3_t12.html>

---

## 📌 Sơ đồ tư duy từng bài – Vật lí 12

### Vật lí 12 – Bài 1. Cấu trúc của chất. Sự chuyển thể *(Tiết 1–2)*

```mermaid
%%{init: {"theme": "base", "htmlLabels": true, "flowchart": {"htmlLabels": true, "padding": 10, "curve": "basis"}, "themeVariables": {"fontSize": "15px"}}}%%
graph TD
    G["⚡<BR/>BÀI<BR/>1<BR/>·<BR/>VẬT<BR/>LÍ<BR/>12<BR/>CẤU<BR/>TRÚC<BR/>CHẤT<BR/>&<BR/>CHUYỂN<BR/>THỂ"]:::root
    G --> A["① Mô hình ĐH<br/>phân tử"]:::n1
    G --> B["② Cấu trúc<br/>3 thể"]:::n2
    G --> C["③ Sự chuyển thể<br/>& sơ đồ"]:::n3
    G --> D["④ Giải thích<br/>bằng MH ĐH"]:::n4

    A --> A1["Chất cấu tạo từ<br/>phân tử"]:::l1
    A --> A2["PT chuyển động không<br/>ngừng"]:::l1
    A --> A3["Giữa PT: lực hút<br/>và đẩy"]:::l1
    A --> A4["Chuyển động Brown (1827)"]:::l1

    B --> B1["Khí: PT cách xa,<br/>hỗn loạn"]:::l2
    B --> B2["Rắn: PT sắp xếp<br/>trật tự"]:::l2
    B --> B3["Lỏng: trung gian rắn–khí"]:::l2

    C --> C1["Rắn ↔ Lỏng ↔<br/>Khí"]:::l3
    C --> C2["Nóng chảy / Đông<br/>đặc"]:::l3
    C --> C3["Hoá hơi / Ngưng<br/>tụ"]:::l3
    C --> C4["Thăng hoa / Ngưng<br/>kết"]:::l3

    D --> D1["Bay hơi: PT thoát<br/>mặt thoáng"]:::l4
    D --> D2["Sôi: nhiệt độ không<br/>đổi"]:::l4
    D --> D3["PT nhận NL →<br/>phá liên kết"]:::l4

    classDef root fill:#002060,color:#FFFFFF,stroke:#000B1E,stroke-width:2px,font-weight:bold
    classDef n1 fill:#E2EFDA,color:#000000,stroke:#375623,stroke-width:3px,font-weight:bold
    classDef n2 fill:#FFF2CC,color:#000000,stroke:#BF8F00,stroke-width:3px,font-weight:bold
    classDef n3 fill:#E2EFDA,color:#000000,stroke:#375623,stroke-width:3px,font-weight:bold
    classDef n4 fill:#FFF2CC,color:#000000,stroke:#BF8F00,stroke-width:3px,font-weight:bold
    classDef n5 fill:#E2EFDA,color:#000000,stroke:#375623,stroke-width:3px,font-weight:bold
    classDef l1 fill:#EDF5E8,color:#000000,stroke:#548235
    classDef l2 fill:#FFF8E1,color:#000000,stroke:#BF8F00
    classDef l3 fill:#E3EEF9,color:#000000,stroke:#2F5597
    classDef l4 fill:#F3E8F7,color:#000000,stroke:#7030A0
    classDef l5 fill:#FDE9E1,color:#000000,stroke:#C55A11
```

> **Bài củng cố:** <https://trangtu66.github.io/Taode_thi_online/ly_cc_bai1_k12.html>

---

### Vật lí 12 – Bài 2. Nội năng. Định luật I NĐLH *(Tiết 3–4)*

```mermaid
%%{init: {"theme": "base", "htmlLabels": true, "flowchart": {"htmlLabels": true, "padding": 10, "curve": "basis"}, "themeVariables": {"fontSize": "15px"}}}%%
graph TD
    G["⚡<BR/>BÀI<BR/>2<BR/>·<BR/>VẬT<BR/>LÍ<BR/>12<BR/>NỘI<BR/>NĂNG<BR/>–<BR/>ĐL<BR/>I<BR/>NHIỆT<BR/>ĐỘNG<BR/>LỰC<BR/>HỌC"]:::root
    G --> A["① Nội năng U"]:::n1
    G --> B["② Hai cách<br/>thay đổi U"]:::n2
    G --> C["③ ΔU = A<br/>+ Q<br/>ĐL I NĐLH"]:::n3
    G --> D["④ Ứng dụng<br/>thực tiễn"]:::n4

    A --> A1["U = ΣĐN +<br/>ΣTN phân tử"]:::l1
    A --> A2["U phụ thuộc T<br/>và V"]:::l1
    A --> A3["ΔU > 0: nhận<br/>NL; ΔU < 0:<br/>toả"]:::l1

    B --> B1["Thực hiện công A"]:::l2
    B --> B2["Truyền nhiệt Q"]:::l2
    B --> B3["Ví dụ: bơm khí,<br/>đun nóng"]:::l2

    C --> C1["A > 0: hệ<br/>nhận công; A <<br/>0: sinh công"]:::l3
    C --> C2["Q > 0: nhận<br/>nhiệt; Q < 0:<br/>toả nhiệt"]:::l3

    D --> D1["Động cơ nhiệt, bơm<br/>tay → nóng"]:::l4
    D --> D2["Máy lạnh: Q thoát<br/>ra ngoài"]:::l4

    classDef root fill:#002060,color:#FFFFFF,stroke:#000B1E,stroke-width:2px,font-weight:bold
    classDef n1 fill:#E2EFDA,color:#000000,stroke:#375623,stroke-width:3px,font-weight:bold
    classDef n2 fill:#FFF2CC,color:#000000,stroke:#BF8F00,stroke-width:3px,font-weight:bold
    classDef n3 fill:#E2EFDA,color:#000000,stroke:#375623,stroke-width:3px,font-weight:bold
    classDef n4 fill:#FFF2CC,color:#000000,stroke:#BF8F00,stroke-width:3px,font-weight:bold
    classDef n5 fill:#E2EFDA,color:#000000,stroke:#375623,stroke-width:3px,font-weight:bold
    classDef l1 fill:#EDF5E8,color:#000000,stroke:#548235
    classDef l2 fill:#FFF8E1,color:#000000,stroke:#BF8F00
    classDef l3 fill:#E3EEF9,color:#000000,stroke:#2F5597
    classDef l4 fill:#F3E8F7,color:#000000,stroke:#7030A0
    classDef l5 fill:#FDE9E1,color:#000000,stroke:#C55A11
```

> **Bài củng cố:** <https://trangtu66.github.io/Taode_thi_online/ly_cc_bai2_k12.html>

---

### Vật lí 12 – Bài 3. Nhiệt độ. Thang đo nhiệt độ *(Tiết 5–6)*

```mermaid
%%{init: {"theme": "base", "htmlLabels": true, "flowchart": {"htmlLabels": true, "padding": 10, "curve": "basis"}, "themeVariables": {"fontSize": "15px"}}}%%
graph TD
    G["⚡<BR/>BÀI<BR/>3<BR/>·<BR/>VẬT<BR/>LÍ<BR/>12<BR/>NHIỆT<BR/>ĐỘ<BR/>–<BR/>THANG<BR/>ĐO"]:::root
    G --> A["① Nhiệt độ<br/>là gì"]:::n1
    G --> B["② Thang<br/>Celsius °C"]:::n2
    G --> C["③ Thang<br/>Kelvin K"]:::n3
    G --> D["④ Đo nhiệt độ<br/>thực tiễn"]:::n4

    A --> A1["Đặc trưng mức nóng<br/>lạnh"]:::l1
    A --> A2["Tỉ lệ với ĐN<br/>trung bình PT"]:::l1
    A --> A3["Cân bằng nhiệt: T₁<br/>= T₂"]:::l1

    B --> B1["0°C: đá tan (p<br/>= 1 atm)"]:::l2
    B --> B2["100°C: nước sôi"]:::l2
    B --> B3["Chia 100 khoảng đều"]:::l2

    C --> C1["T(K) = t(°C) +<br/>273"]:::l3
    C --> C2["0 K = −273°C<br/>(KTĐ)"]:::l3
    C --> C3["Không có nhiệt độ<br/>âm tuyệt đối"]:::l3

    D --> D1["Nhiệt kế hồng ngoại,<br/>cảm biến IC"]:::l4
    D --> D2["37°C = 310 K;<br/>−40°C = 233 K"]:::l4

    classDef root fill:#002060,color:#FFFFFF,stroke:#000B1E,stroke-width:2px,font-weight:bold
    classDef n1 fill:#E2EFDA,color:#000000,stroke:#375623,stroke-width:3px,font-weight:bold
    classDef n2 fill:#FFF2CC,color:#000000,stroke:#BF8F00,stroke-width:3px,font-weight:bold
    classDef n3 fill:#E2EFDA,color:#000000,stroke:#375623,stroke-width:3px,font-weight:bold
    classDef n4 fill:#FFF2CC,color:#000000,stroke:#BF8F00,stroke-width:3px,font-weight:bold
    classDef n5 fill:#E2EFDA,color:#000000,stroke:#375623,stroke-width:3px,font-weight:bold
    classDef l1 fill:#EDF5E8,color:#000000,stroke:#548235
    classDef l2 fill:#FFF8E1,color:#000000,stroke:#BF8F00
    classDef l3 fill:#E3EEF9,color:#000000,stroke:#2F5597
    classDef l4 fill:#F3E8F7,color:#000000,stroke:#7030A0
    classDef l5 fill:#FDE9E1,color:#000000,stroke:#C55A11
```

> **Bài củng cố:** <https://trangtu66.github.io/Taode_thi_online/ly_cc_bai3_k12.html>

---

### Vật lí 12 – Bài 4. Nhiệt dung riêng. Phương trình nhiệt lượng *(Tiết 7–8)*

```mermaid
%%{init: {"theme": "base", "htmlLabels": true, "flowchart": {"htmlLabels": true, "padding": 10, "curve": "basis"}, "themeVariables": {"fontSize": "15px"}}}%%
graph TD
    G["⚡<BR/>BÀI<BR/>4<BR/>·<BR/>VẬT<BR/>LÍ<BR/>12<BR/>NHIỆT<BR/>DUNG<BR/>RIÊNG<BR/>–<BR/>PT<BR/>NHIỆT<BR/>LƯỢNG"]:::root
    G --> A["① Nhiệt dung riêng<br/>c<br/>(J/kg·K)"]:::n1
    G --> B["② Phương trình<br/>nhiệt lượng"]:::n2
    G --> C["③ Phương trình<br/>cân bằng nhiệt"]:::n3
    G --> D["④ Ứng dụng<br/>thực tiễn"]:::n4

    A --> A1["c = Q/(mΔT)"]:::l1
    A --> A2["Nước: c = 4<br/>200 J/kg·K (lớn nhất)"]:::l1
    A --> A3["Đồng: 380; Nhôm: 880;<br/>Sắt: 460"]:::l1

    B --> B1["Q = mcΔT =<br/>mc(t₂ − t₁)"]:::l2
    B --> B2["Δt > 0: thu<br/>nhiệt; Δt < 0:<br/>toả nhiệt"]:::l2

    C --> C1["Qthu + Qtoả =<br/>0"]:::l3
    C --> C2["ΣmᵢcᵢΔtᵢ = 0"]:::l3

    D --> D1["Bình thuỷ – giữ<br/>nước nóng"]:::l4
    D --> D2["Điều hoà không khí,<br/>nước làm mát ĐC"]:::l4

    classDef root fill:#002060,color:#FFFFFF,stroke:#000B1E,stroke-width:2px,font-weight:bold
    classDef n1 fill:#E2EFDA,color:#000000,stroke:#375623,stroke-width:3px,font-weight:bold
    classDef n2 fill:#FFF2CC,color:#000000,stroke:#BF8F00,stroke-width:3px,font-weight:bold
    classDef n3 fill:#E2EFDA,color:#000000,stroke:#375623,stroke-width:3px,font-weight:bold
    classDef n4 fill:#FFF2CC,color:#000000,stroke:#BF8F00,stroke-width:3px,font-weight:bold
    classDef n5 fill:#E2EFDA,color:#000000,stroke:#375623,stroke-width:3px,font-weight:bold
    classDef l1 fill:#EDF5E8,color:#000000,stroke:#548235
    classDef l2 fill:#FFF8E1,color:#000000,stroke:#BF8F00
    classDef l3 fill:#E3EEF9,color:#000000,stroke:#2F5597
    classDef l4 fill:#F3E8F7,color:#000000,stroke:#7030A0
    classDef l5 fill:#FDE9E1,color:#000000,stroke:#C55A11
```

> **Bài củng cố:** <https://trangtu66.github.io/Taode_thi_online/ly_cc_bai4_k12.html>

---

### Vật lí 12 – Bài 5. Nhiệt nóng chảy riêng *(Tiết 9–10)*

```mermaid
%%{init: {"theme": "base", "htmlLabels": true, "flowchart": {"htmlLabels": true, "padding": 10, "curve": "basis"}, "themeVariables": {"fontSize": "15px"}}}%%
graph TD
    G["⚡<BR/>BÀI<BR/>5<BR/>·<BR/>VẬT<BR/>LÍ<BR/>12<BR/>NHIỆT<BR/>NÓNG<BR/>CHẢY<BR/>RIÊNG"]:::root
    G --> A["① Quá trình<br/>nóng chảy"]:::n1
    G --> B["② Nhiệt nóng chảy<br/>riêng λ (J/kg)"]:::n2
    G --> C["③ Quá trình<br/>đông đặc"]:::n3
    G --> D["④ Ứng dụng<br/>thực tiễn"]:::n4

    A --> A1["Chất rắn → lỏng<br/>khi nhận nhiệt"]:::l1
    A --> A2["Xảy ra ở nhiệt<br/>độ xác định (tnc)"]:::l1
    A --> A3["Trong quá trình nc:<br/>t không đổi"]:::l1

    B --> B1["Q = λm"]:::l2
    B --> B2["λ nước đá =<br/>3,4×10⁵ J/kg"]:::l2
    B --> B3["λ nhôm = 3,9×10⁵<br/>J/kg"]:::l2

    C --> C1["Lỏng → rắn khi<br/>toả nhiệt Q =<br/>λm"]:::l3
    C --> C2["Quá trình ngược nóng<br/>chảy"]:::l3
    C --> C3["tđặc = tnc"]:::l3

    D --> D1["Đúc kim loại, hàn<br/>điện"]:::l4
    D --> D2["Nước đá làm lạnh<br/>thực phẩm"]:::l4
    D --> D3["Luyện kim, tái chế<br/>vật liệu"]:::l4

    classDef root fill:#002060,color:#FFFFFF,stroke:#000B1E,stroke-width:2px,font-weight:bold
    classDef n1 fill:#E2EFDA,color:#000000,stroke:#375623,stroke-width:3px,font-weight:bold
    classDef n2 fill:#FFF2CC,color:#000000,stroke:#BF8F00,stroke-width:3px,font-weight:bold
    classDef n3 fill:#E2EFDA,color:#000000,stroke:#375623,stroke-width:3px,font-weight:bold
    classDef n4 fill:#FFF2CC,color:#000000,stroke:#BF8F00,stroke-width:3px,font-weight:bold
    classDef n5 fill:#E2EFDA,color:#000000,stroke:#375623,stroke-width:3px,font-weight:bold
    classDef l1 fill:#EDF5E8,color:#000000,stroke:#548235
    classDef l2 fill:#FFF8E1,color:#000000,stroke:#BF8F00
    classDef l3 fill:#E3EEF9,color:#000000,stroke:#2F5597
    classDef l4 fill:#F3E8F7,color:#000000,stroke:#7030A0
    classDef l5 fill:#FDE9E1,color:#000000,stroke:#C55A11
```

> **Bài củng cố:** <https://trangtu66.github.io/Taode_thi_online/ly_cc_bai5_k12.html>

---

### Vật lí 12 – Bài 6. Nhiệt hoá hơi riêng *(Tiết 11–12)*

```mermaid
%%{init: {"theme": "base", "htmlLabels": true, "flowchart": {"htmlLabels": true, "padding": 10, "curve": "basis"}, "themeVariables": {"fontSize": "15px"}}}%%
graph TD
    G["⚡<BR/>BÀI<BR/>6<BR/>·<BR/>VẬT<BR/>LÍ<BR/>12<BR/>NHIỆT<BR/>HOÁ<BR/>HƠI<BR/>RIÊNG"]:::root
    G --> A["① Bay hơi<br/>& Sôi"]:::n1
    G --> B["② Nhiệt hoá hơi<br/>riêng L (J/kg)"]:::n2
    G --> C["③ Ngưng tụ<br/>& Ứng dụng"]:::n3
    G --> D["④ Thực tiễn<br/>địa phương"]:::n4

    A --> A1["Bay hơi: mọi nhiệt<br/>độ, ở mặt thoáng"]:::l1
    A --> A2["Sôi: ở tsôi xác<br/>định, khắp lòng chất"]:::l1
    A --> A3["tsôi phụ thuộc áp<br/>suất"]:::l1

    B --> B1["Q = Lm"]:::l2
    B --> B2["L nước = 2,3×10⁶<br/>J/kg"]:::l2
    B --> B3["L cồn = 9×10⁵<br/>J/kg"]:::l2

    C --> C1["Ngưng tụ: hơi →<br/>lỏng, toả Q =<br/>Lm"]:::l3
    C --> C2["Điều hoà nhiệt độ<br/>cơ thể"]:::l3
    C --> C3["Tua bin hơi nước<br/>điện lực"]:::l3

    D --> D1["Mồ hôi làm mát<br/>cơ thể người"]:::l4
    D --> D2["Lò hơi, turbine điện<br/>địa phương"]:::l4
    D --> D3["Nước điều hoà khí<br/>hậu Tây Nguyên"]:::l4

    classDef root fill:#002060,color:#FFFFFF,stroke:#000B1E,stroke-width:2px,font-weight:bold
    classDef n1 fill:#E2EFDA,color:#000000,stroke:#375623,stroke-width:3px,font-weight:bold
    classDef n2 fill:#FFF2CC,color:#000000,stroke:#BF8F00,stroke-width:3px,font-weight:bold
    classDef n3 fill:#E2EFDA,color:#000000,stroke:#375623,stroke-width:3px,font-weight:bold
    classDef n4 fill:#FFF2CC,color:#000000,stroke:#BF8F00,stroke-width:3px,font-weight:bold
    classDef n5 fill:#E2EFDA,color:#000000,stroke:#375623,stroke-width:3px,font-weight:bold
    classDef l1 fill:#EDF5E8,color:#000000,stroke:#548235
    classDef l2 fill:#FFF8E1,color:#000000,stroke:#BF8F00
    classDef l3 fill:#E3EEF9,color:#000000,stroke:#2F5597
    classDef l4 fill:#F3E8F7,color:#000000,stroke:#7030A0
    classDef l5 fill:#FDE9E1,color:#000000,stroke:#C55A11
```

> **Bài củng cố:** <https://trangtu66.github.io/Taode_thi_online/ly_cc_bai6_k12.html>


## 🗺️ Sơ đồ tư duy – Lịch sử 12 Học kì I

```mermaid
%%{init: {"theme": "base", "htmlLabels": true, "flowchart": {"htmlLabels": true, "padding": 10, "curve": "basis"}, "themeVariables": {"fontSize": "15px"}}}%%
graph TD
    A["🌍 LỊCH SỬ 12<br/>– HỌC KÌ I"]:::root
    A --> B["🌐 Chủ đề 1<br/>Thế giới sau CTTG<br/>II"]:::chu1
    A --> C["🤝 Chủ đề 2<br/>ASEAN"]:::chu2
    A --> D["🇻🇳 Chủ đề 3<br/>Cách mạng & Kháng<br/>chiến"]:::chu3
    A --> E["🔄 Chủ đề 4<br/>Đổi mới & Hội<br/>nhập"]:::chu4

    B --> B1["Bài 1. Liên hợp<br/>quốc<br/>1945 – 193 thành<br/>viên"]:::bai
    B --> B2["Bài 2. Trật tự<br/>Chiến tranh lạnh<br/>Hai cực Mỹ–Liên Xô"]:::bai
    B --> B3["Bài 3. Sau Chiến<br/>tranh lạnh<br/>Toàn cầu hóa đa<br/>cực"]:::bai
    B --> B4["TH1. Thế giới 2<br/>giai đoạn"]:::th

    C --> C1["Bài 4. Ra đời<br/>ASEAN 1967<br/>5→10 thành viên"]:::bai
    C --> C2["Bài 5. Cộng đồng<br/>ASEAN 2015<br/>3 trụ cột"]:::bai
    C --> C3["TH2. Niên biểu ASEAN"]:::th

    D --> D1["Bài 6. CMTT 1945<br/>2/9/1945 Độc lập"]:::bai
    D --> D2["Bài 7. KC chống<br/>Pháp<br/>ĐBP 7/5/1954"]:::bai
    D --> D3["Bài 8. KC chống<br/>Mỹ<br/>30/4/1975 Thống nhất"]:::bai
    D --> D4["Bài 9. Bảo vệ<br/>TQ sau 1975<br/>Biên giới TN &<br/>Bắc"]:::bai
    D --> D5["TH3. So sánh 3<br/>sự kiện"]:::th

    E --> E1["Bài 10. Đổi mới<br/>từ 1986<br/>Đại hội VI"]:::bai
    E --> E2["Bài 11. Thành tựu<br/>Đổi mới<br/>GDP, hội nhập"]:::bai
    E --> E3["TH4. Hành trình hội<br/>nhập"]:::th

    classDef root fill:#002060,color:#FFFFFF,stroke:#000B1E,stroke-width:2px,font-weight:bold
    classDef n1 fill:#E2EFDA,color:#000000,stroke:#375623,stroke-width:3px,font-weight:bold
    classDef n2 fill:#FFF2CC,color:#000000,stroke:#BF8F00,stroke-width:3px,font-weight:bold
    classDef n3 fill:#E2EFDA,color:#000000,stroke:#375623,stroke-width:3px,font-weight:bold
    classDef n4 fill:#FFF2CC,color:#000000,stroke:#BF8F00,stroke-width:3px,font-weight:bold
    classDef n5 fill:#E2EFDA,color:#000000,stroke:#375623,stroke-width:3px,font-weight:bold
    classDef l1 fill:#EDF5E8,color:#000000,stroke:#548235
    classDef l2 fill:#FFF8E1,color:#000000,stroke:#BF8F00
    classDef l3 fill:#E3EEF9,color:#000000,stroke:#2F5597
    classDef l4 fill:#F3E8F7,color:#000000,stroke:#7030A0
    classDef l5 fill:#FDE9E1,color:#000000,stroke:#C55A11
```

## 🗺️ Sơ đồ tư duy – Địa lí 12 Học kì I

```mermaid
%%{init: {"theme": "base", "htmlLabels": true, "flowchart": {"htmlLabels": true, "padding": 10, "curve": "basis"}, "themeVariables": {"fontSize": "15px"}}}%%
graph TD
    Z["🌏 ĐỊA LÍ 12<br/>– HỌC KÌ I"]:::root
    Z --> ZA["🌡️ TN – Môi<br/>trường<br/>Bài 1–6"]:::nhom
    Z --> ZB["👥 Dân cư –<br/>Lao động<br/>Bài 7–10"]:::nhom
    Z --> ZC["🌾 Kinh tế tổng<br/>quan<br/>Bài 11"]:::nhom
    Z --> ZD["🌱 Nông–Lâm–Thủy sản<br/>Bài 12–15"]:::nhom
    Z --> ZE["🏭 Công nghiệp<br/>Bài 16–19"]:::nhom

    ZA --> ZA1["Bài 1. Vị trí<br/>địa lí<br/>Lãnh thổ 331 212<br/>km²"]:::bai
    ZA --> ZA2["Bài 2. Nhiệt đới<br/>ẩm<br/>Gió mùa 4 mùa"]:::bai
    ZA --> ZA3["Bài 3. Phân hoá<br/>thiên nhiên<br/>3 miền địa lí"]:::bai
    ZA --> ZA4["TH. Báo cáo phân<br/>hoá"]:::th
    ZA --> ZA5["Bài 5. Sử dụng<br/>TN & BVMT"]:::bai
    ZA --> ZA6["TH. Tuyên truyền BVMT"]:::th

    ZB --> ZB1["Bài 7. Dân số<br/>~100 triệu<br/>Cơ cấu vàng"]:::bai
    ZB --> ZB2["Bài 8. Lao động<br/>& việc làm<br/>52 triệu LĐ"]:::bai
    ZB --> ZB3["Bài 9. Đô thị<br/>hoá 40%"]:::bai
    ZB --> ZB4["TH. Phân tích dân<br/>cư"]:::th

    ZC --> ZC1["GDP: NN12%–CN36%–DV42%"]:::bai
    ZC --> ZC2["4 vùng KTTĐ"]:::bai

    ZD --> ZD1["Bài 12. Nông nghiệp<br/>CNC<br/>Gạo top 3 TG"]:::bai
    ZD --> ZD2["Bài 13. Lâm–Thủy sản<br/>Che phủ 42%, 9.3<br/>triệu tấn"]:::bai
    ZD --> ZD3["Bài 14. Tổ chức<br/>lãnh thổ NN<br/>7 vùng"]:::bai
    ZD --> ZD4["TH. Vẽ biểu đồ<br/>NN"]:::th

    ZE --> ZE1["Bài 16. Cơ cấu<br/>CN<br/>Điện tử top 1<br/>XK"]:::bai
    ZE --> ZE2["Bài 17. Các ngành<br/>CN<br/>Dầu khí, điện, dệt<br/>may"]:::bai
    ZE --> ZE3["Bài 18. Tổ chức<br/>lãnh thổ CN<br/>400 KCN, KKT Nhơn<br/>Hội"]:::bai
    ZE --> ZE4["TH. Vẽ biểu đồ<br/>CN"]:::th

    classDef root fill:#002060,color:#FFFFFF,stroke:#000B1E,stroke-width:2px,font-weight:bold
    classDef n1 fill:#E2EFDA,color:#000000,stroke:#375623,stroke-width:3px,font-weight:bold
    classDef n2 fill:#FFF2CC,color:#000000,stroke:#BF8F00,stroke-width:3px,font-weight:bold
    classDef n3 fill:#E2EFDA,color:#000000,stroke:#375623,stroke-width:3px,font-weight:bold
    classDef n4 fill:#FFF2CC,color:#000000,stroke:#BF8F00,stroke-width:3px,font-weight:bold
    classDef n5 fill:#E2EFDA,color:#000000,stroke:#375623,stroke-width:3px,font-weight:bold
    classDef l1 fill:#EDF5E8,color:#000000,stroke:#548235
    classDef l2 fill:#FFF8E1,color:#000000,stroke:#BF8F00
    classDef l3 fill:#E3EEF9,color:#000000,stroke:#2F5597
    classDef l4 fill:#F3E8F7,color:#000000,stroke:#7030A0
    classDef l5 fill:#FDE9E1,color:#000000,stroke:#C55A11
```

