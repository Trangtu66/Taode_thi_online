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
| `quan_ly.html`, `ket_qua.html`, `xep_hang.html` | Quản lí bài, kết quả, xếp hạng |
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

