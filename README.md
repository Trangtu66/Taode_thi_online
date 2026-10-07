# Hệ thống luyện thi trực tuyến – Trường THPT Vĩnh Thạnh (Gia Lai)

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

### Toán 12 – Bài 4. Khảo sát sự biến thiên và vẽ đồ thị hàm số *(Tiết 14–18)*

```mermaid
graph TD
    Goc["🎯 BÀI 4 · TOÁN 12\nKhảo sát sự biến thiên\nvà vẽ đồ thị hàm số"]

    Goc --> B1(("① Sơ đồ\nkhảo sát"))
    Goc --> B2(("② Hàm\nbậc ba"))
    Goc --> B3(("③ Phân thức\nax+b / cx+d"))
    Goc --> B4(("④ Phân thức\nax²+bx+c / px+q"))

    B1 --> B1a["📌 Bước 1: Tập xác định"]
    B1 --> B1b["📌 Bước 2: Khảo sát biến thiên\ny', cực trị, giới hạn, BBT"]
    B1 --> B1c["📌 Bước 3: Vẽ đồ thị\n(giao trục, tiệm cận, điểm đặc biệt)"]

    B2 --> B2a["y = ax³+bx²+cx+d\n(a ≠ 0)"]
    B2 --> B2b["Δ' > 0 → có cực trị\nΔ' ≤ 0 → không cực trị"]
    B2 --> B2c["Tâm đối xứng:\nx_I = –b / 3a"]
    B2 --> B2d["Không có tiệm cận"]

    B3 --> B3a["y = (ax+b) / (cx+d)\n(ad–bc ≠ 0)"]
    B3 --> B3b["TC đứng: x = –d/c"]
    B3 --> B3c["TC ngang: y = a/c"]
    B3 --> B3d["Tâm ĐX = giao hai tiệm cận\nKhông có cực trị"]

    B4 --> B4a["y = (ax²+bx+c) / (px+q)\n(a ≠ 0)"]
    B4 --> B4b["TC đứng: x = –q/p"]
    B4 --> B4c["TC xiên: y = (a/p)x + k\n(chia đa thức tử/mẫu)"]
    B4 --> B4d["Có thể có cực trị\n(xét dấu y')"]

    style Goc fill:#0056b3,stroke:#003580,stroke-width:3px,color:#fff,font-weight:bold
    style B1 fill:#6f42c1,stroke:#4a2d8c,stroke-width:2px,color:#fff
    style B2 fill:#1a6b3c,stroke:#114a2a,stroke-width:2px,color:#fff
    style B3 fill:#c0392b,stroke:#922b21,stroke-width:2px,color:#fff
    style B4 fill:#c47a00,stroke:#8a5500,stroke-width:2px,color:#fff
    style B1a fill:#ede7f6,stroke:#6f42c1,color:#1a0050
    style B1b fill:#ede7f6,stroke:#6f42c1,color:#1a0050
    style B1c fill:#ede7f6,stroke:#6f42c1,color:#1a0050
    style B2a fill:#e8f5e9,stroke:#1a6b3c,color:#0a2e18
    style B2b fill:#e8f5e9,stroke:#1a6b3c,color:#0a2e18
    style B2c fill:#e8f5e9,stroke:#1a6b3c,color:#0a2e18
    style B2d fill:#e8f5e9,stroke:#1a6b3c,color:#0a2e18
    style B3a fill:#fdecea,stroke:#c0392b,color:#5a0000
    style B3b fill:#fdecea,stroke:#c0392b,color:#5a0000
    style B3c fill:#fdecea,stroke:#c0392b,color:#5a0000
    style B3d fill:#fdecea,stroke:#c0392b,color:#5a0000
    style B4a fill:#fff8e1,stroke:#c47a00,color:#4a2d00
    style B4b fill:#fff8e1,stroke:#c47a00,color:#4a2d00
    style B4c fill:#fff8e1,stroke:#c47a00,color:#4a2d00
    style B4d fill:#fff8e1,stroke:#c47a00,color:#4a2d00
```

> **Bài củng cố trực tuyến:** <https://trangtu66.github.io/Taode_thi_online/cc_bai4_t12.html>

---

### Vật lí 12 – Bài 1. Cấu trúc của chất. Sự chuyển thể *(Tuần 1, Tiết 1–2)*

```mermaid
graph TD
    Goc["⚡ BÀI 1 · VẬT LÍ 12\nCấu trúc của chất\nSự chuyển thể"]

    Goc --> B1(("① Mô hình ĐH\nphân tử"))
    Goc --> B2(("② Cấu trúc\n3 thể"))
    Goc --> B3(("③ Sự\nchuyển thể"))
    Goc --> B4(("④ Giải thích\nbằng MH ĐH"))

    B1 --> B1a["Chất cấu tạo từ phân tử"]
    B1 --> B1b["PT chuyển động\nkhông ngừng"]
    B1 --> B1c["Giữa PT: lực hút và đẩy"]
    B1 --> B1d["Chuyển động Brown (1827)"]

    B2 --> B2a["Khí: PT cách xa, hỗn loạn"]
    B2 --> B2b["Rắn: PT sắp xếp trật tự"]
    B2 --> B2c["Lỏng: trung gian rắn – khí"]

    B3 --> B3a["Sơ đồ: Rắn ↔ Lỏng ↔ Khí"]
    B3 --> B3b["Nóng chảy / Đông đặc"]
    B3 --> B3c["Hoá hơi / Ngưng tụ"]
    B3 --> B3d["Thăng hoa / Ngưng kết"]

    B4 --> B4a["Bay hơi: PT thoát mặt thoáng"]
    B4 --> B4b["Sôi: t° không đổi ở 100°C"]
    B4 --> B4c["PT nhận NL → phá liên kết"]

    style Goc fill:#0369A1,stroke:#024f7a,stroke-width:3px,color:#fff,font-weight:bold
    style B1 fill:#7C3AED,stroke:#5b1fa8,stroke-width:2px,color:#fff
    style B2 fill:#065F46,stroke:#044032,stroke-width:2px,color:#fff
    style B3 fill:#B91C1C,stroke:#8a1414,stroke-width:2px,color:#fff
    style B4 fill:#B45309,stroke:#863e06,stroke-width:2px,color:#fff
    style B1a fill:#EDE9FE,stroke:#7C3AED,color:#2e1065
    style B1b fill:#EDE9FE,stroke:#7C3AED,color:#2e1065
    style B1c fill:#EDE9FE,stroke:#7C3AED,color:#2e1065
    style B1d fill:#EDE9FE,stroke:#7C3AED,color:#2e1065
    style B2a fill:#D1FAE5,stroke:#065F46,color:#022c22
    style B2b fill:#D1FAE5,stroke:#065F46,color:#022c22
    style B2c fill:#D1FAE5,stroke:#065F46,color:#022c22
    style B3a fill:#FEE2E2,stroke:#B91C1C,color:#450a0a
    style B3b fill:#FEE2E2,stroke:#B91C1C,color:#450a0a
    style B3c fill:#FEE2E2,stroke:#B91C1C,color:#450a0a
    style B3d fill:#FEE2E2,stroke:#B91C1C,color:#450a0a
    style B4a fill:#FEF3C7,stroke:#B45309,color:#451a03
    style B4b fill:#FEF3C7,stroke:#B45309,color:#451a03
    style B4c fill:#FEF3C7,stroke:#B45309,color:#451a03
```

> **Bài củng cố trực tuyến:** <https://trangtu66.github.io/Taode_thi_online/ly_cc_bai1_k12.html>

---

### Vật lí 12 – Bài 2. Nội năng. Định luật I NĐLH *(Tuần 2, Tiết 3–4)*

```mermaid
graph TD
    Goc["⚡ BÀI 2 · VẬT LÍ 12\nNội năng\nĐịnh luật I NĐLH"]

    Goc --> B1(("① Nội\nnăng U"))
    Goc --> B2(("② Hai cách\nthay đổi U"))
    Goc --> B3(("③ ΔU = A + Q\nĐL I"))
    Goc --> B4(("④ Ứng\ndụng"))

    B1 --> B1a["U = ΣĐN + ΣTN phân tử"]
    B1 --> B1b["U phụ thuộc T và V"]
    B1 --> B1c["ΔU > 0: nhận NL"]

    B2 --> B2a["Thực hiện công A"]
    B2 --> B2b["Truyền nhiệt Q"]
    B2 --> B2c["Ví dụ: bơm khí, đun nóng"]

    B3 --> B3a["A > 0: hệ nhận công"]
    B3 --> B3b["A < 0: hệ sinh công"]
    B3 --> B3c["Q > 0: hệ nhận nhiệt"]
    B3 --> B3d["Q < 0: hệ tỏa nhiệt"]

    B4 --> B4a["Động cơ nhiệt"]
    B4 --> B4b["Bơm tay → nóng đầu"]
    B4 --> B4c["Máy lạnh: Q < 0"]

    style Goc fill:#0369A1,stroke:#024f7a,stroke-width:3px,color:#fff,font-weight:bold
    style B1 fill:#7C3AED,stroke:#5b1fa8,stroke-width:2px,color:#fff
    style B2 fill:#065F46,stroke:#044032,stroke-width:2px,color:#fff
    style B3 fill:#B91C1C,stroke:#8a1414,stroke-width:2px,color:#fff
    style B4 fill:#B45309,stroke:#863e06,stroke-width:2px,color:#fff
    style B1a fill:#EDE9FE,stroke:#7C3AED,color:#2e1065
    style B1b fill:#EDE9FE,stroke:#7C3AED,color:#2e1065
    style B1c fill:#EDE9FE,stroke:#7C3AED,color:#2e1065
    style B2a fill:#D1FAE5,stroke:#065F46,color:#022c22
    style B2b fill:#D1FAE5,stroke:#065F46,color:#022c22
    style B2c fill:#D1FAE5,stroke:#065F46,color:#022c22
    style B3a fill:#FEE2E2,stroke:#B91C1C,color:#450a0a
    style B3b fill:#FEE2E2,stroke:#B91C1C,color:#450a0a
    style B3c fill:#FEE2E2,stroke:#B91C1C,color:#450a0a
    style B3d fill:#FEE2E2,stroke:#B91C1C,color:#450a0a
    style B4a fill:#FEF3C7,stroke:#B45309,color:#451a03
    style B4b fill:#FEF3C7,stroke:#B45309,color:#451a03
    style B4c fill:#FEF3C7,stroke:#B45309,color:#451a03
```

> **Bài củng cố trực tuyến:** <https://trangtu66.github.io/Taode_thi_online/ly_cc_bai2_k12.html>

---

### Vật lí 12 – Bài 3. Nhiệt độ. Thang đo nhiệt độ *(Tuần 3, Tiết 5–6)*

```mermaid
graph TD
    Goc["⚡ BÀI 3 · VẬT LÍ 12\nNhiệt độ\nThang đo nhiệt độ"]

    Goc --> B1(("① Nhiệt độ\nlà gì"))
    Goc --> B2(("② Thang\nCelsius °C"))
    Goc --> B3(("③ Thang\nKelvin K"))
    Goc --> B4(("④ Đo nhiệt độ\nThực tiễn"))

    B1 --> B1a["Đặc trưng mức nóng lạnh"]
    B1 --> B1b["Tỉ lệ với ĐN trung bình PT"]
    B1 --> B1c["Cân bằng nhiệt: T₁ = T₂"]

    B2 --> B2a["0°C: đá tan (p = 1 atm)"]
    B2 --> B2b["100°C: nước sôi"]
    B2 --> B2c["Chia 100 khoảng đều"]

    B3 --> B3a["T(K) = t(°C) + 273"]
    B3 --> B3b["0 K = −273°C (KTĐ)"]
    B3 --> B3c["Không có nhiệt độ âm"]
    B3 --> B3d["Đơn vị SI"]

    B4 --> B4a["Nhiệt kế hồng ngoại"]
    B4 --> B4b["Cảm biến IC"]
    B4 --> B4c["37°C = 310 K"]

    style Goc fill:#0369A1,stroke:#024f7a,stroke-width:3px,color:#fff,font-weight:bold
    style B1 fill:#7C3AED,stroke:#5b1fa8,stroke-width:2px,color:#fff
    style B2 fill:#065F46,stroke:#044032,stroke-width:2px,color:#fff
    style B3 fill:#B91C1C,stroke:#8a1414,stroke-width:2px,color:#fff
    style B4 fill:#B45309,stroke:#863e06,stroke-width:2px,color:#fff
    style B1a fill:#EDE9FE,stroke:#7C3AED,color:#2e1065
    style B1b fill:#EDE9FE,stroke:#7C3AED,color:#2e1065
    style B1c fill:#EDE9FE,stroke:#7C3AED,color:#2e1065
    style B2a fill:#D1FAE5,stroke:#065F46,color:#022c22
    style B2b fill:#D1FAE5,stroke:#065F46,color:#022c22
    style B2c fill:#D1FAE5,stroke:#065F46,color:#022c22
    style B3a fill:#FEE2E2,stroke:#B91C1C,color:#450a0a
    style B3b fill:#FEE2E2,stroke:#B91C1C,color:#450a0a
    style B3c fill:#FEE2E2,stroke:#B91C1C,color:#450a0a
    style B3d fill:#FEE2E2,stroke:#B91C1C,color:#450a0a
    style B4a fill:#FEF3C7,stroke:#B45309,color:#451a03
    style B4b fill:#FEF3C7,stroke:#B45309,color:#451a03
    style B4c fill:#FEF3C7,stroke:#B45309,color:#451a03
```

> **Bài củng cố trực tuyến:** <https://trangtu66.github.io/Taode_thi_online/ly_cc_bai3_k12.html>

---

### Vật lí 12 – Bài 4. Nhiệt dung riêng. Phương trình nhiệt lượng *(Tuần 4, Tiết 7–8)*

```mermaid
graph TD
    Goc["⚡ BÀI 4 · VẬT LÍ 12\nNhiệt dung riêng\nPhương trình nhiệt lượng"]

    Goc --> B1(("① NDR c"))
    Goc --> B2(("② Q = mcΔT"))
    Goc --> B3(("③ Cân bằng\nnhiệt"))
    Goc --> B4(("④ Ứng dụng\nthực tiễn"))

    B1 --> B1a["c = Q/(mΔT)"]
    B1 --> B1b["Đơn vị: J/(kg·K)"]
    B1 --> B1c["c_nước = 4 200 J/(kg·K)"]
    B1 --> B1d["c lớn → khó nóng khó nguội"]

    B2 --> B2a["Q = mcΔT"]
    B2 --> B2b["Q > 0: thu nhiệt"]
    B2 --> B2c["Q < 0: tỏa nhiệt"]

    B3 --> B3a["Q_thu = |Q_toa|"]
    B3 --> B3b["m₁c₁ΔT₁ = m₂c₂ΔT₂"]
    B3 --> B3c["Tìm nhiệt độ cân bằng"]

    B4 --> B4a["Ven biển ôn hoà hơn nội địa"]
    B4 --> B4b["Tưới cây buổi sáng (Vĩnh Thạnh)"]
    B4 --> B4c["Bình giữ nhiệt cà phê"]

    style Goc fill:#0369A1,stroke:#024f7a,stroke-width:3px,color:#fff,font-weight:bold
    style B1 fill:#7C3AED,stroke:#5b1fa8,stroke-width:2px,color:#fff
    style B2 fill:#065F46,stroke:#044032,stroke-width:2px,color:#fff
    style B3 fill:#B91C1C,stroke:#8a1414,stroke-width:2px,color:#fff
    style B4 fill:#B45309,stroke:#863e06,stroke-width:2px,color:#fff
    style B1a fill:#EDE9FE,stroke:#7C3AED,color:#2e1065
    style B1b fill:#EDE9FE,stroke:#7C3AED,color:#2e1065
    style B1c fill:#EDE9FE,stroke:#7C3AED,color:#2e1065
    style B1d fill:#EDE9FE,stroke:#7C3AED,color:#2e1065
    style B2a fill:#D1FAE5,stroke:#065F46,color:#022c22
    style B2b fill:#D1FAE5,stroke:#065F46,color:#022c22
    style B2c fill:#D1FAE5,stroke:#065F46,color:#022c22
    style B3a fill:#FEE2E2,stroke:#B91C1C,color:#450a0a
    style B3b fill:#FEE2E2,stroke:#B91C1C,color:#450a0a
    style B3c fill:#FEE2E2,stroke:#B91C1C,color:#450a0a
    style B4a fill:#FEF3C7,stroke:#B45309,color:#451a03
    style B4b fill:#FEF3C7,stroke:#B45309,color:#451a03
    style B4c fill:#FEF3C7,stroke:#B45309,color:#451a03
```

> **Bài củng cố trực tuyến:** <https://trangtu66.github.io/Taode_thi_online/ly_cc_bai4_k12.html>

---

### Vật lí 12 – Bài 5. Nhiệt nóng chảy riêng *(Tuần 5, Tiết 9–10)*

```mermaid
graph TD
    Goc["⚡ BÀI 5 · VẬT LÍ 12\nNhiệt nóng chảy riêng λ"]

    Goc --> B1(("① Định\nnghĩa λ"))
    Goc --> B2(("② Q = λm"))
    Goc --> B3(("③ Bảng λ\nmột số chất"))
    Goc --> B4(("④ Ứng\ndụng"))

    B1 --> B1a["Nhiệt lượng nóng chảy 1 kg rắn"]
    B1 --> B1b["Tại nhiệt độ nóng chảy"]
    B1 --> B1c["Đơn vị: J/kg"]

    B2 --> B2a["Q = λm"]
    B2 --> B2b["Q > 0: nóng chảy"]
    B2 --> B2c["Q < 0: đông đặc"]
    B2 --> B2d["T không đổi"]

    B3 --> B3a["Nước đá: 3,34×10⁵ J/kg"]
    B3 --> B3b["Sắt: 2,72×10⁵ J/kg"]
    B3 --> B3c["Nhôm: 3,97×10⁵ J/kg"]

    B4 --> B4a["Đúc kim loại"]
    B4 --> B4b["Sản xuất đá lạnh"]
    B4 --> B4c["Băng tan ở hai cực"]

    style Goc fill:#0369A1,stroke:#024f7a,stroke-width:3px,color:#fff,font-weight:bold
    style B1 fill:#7C3AED,stroke:#5b1fa8,stroke-width:2px,color:#fff
    style B2 fill:#065F46,stroke:#044032,stroke-width:2px,color:#fff
    style B3 fill:#B91C1C,stroke:#8a1414,stroke-width:2px,color:#fff
    style B4 fill:#B45309,stroke:#863e06,stroke-width:2px,color:#fff
    style B1a fill:#EDE9FE,stroke:#7C3AED,color:#2e1065
    style B1b fill:#EDE9FE,stroke:#7C3AED,color:#2e1065
    style B1c fill:#EDE9FE,stroke:#7C3AED,color:#2e1065
    style B2a fill:#D1FAE5,stroke:#065F46,color:#022c22
    style B2b fill:#D1FAE5,stroke:#065F46,color:#022c22
    style B2c fill:#D1FAE5,stroke:#065F46,color:#022c22
    style B2d fill:#D1FAE5,stroke:#065F46,color:#022c22
    style B3a fill:#FEE2E2,stroke:#B91C1C,color:#450a0a
    style B3b fill:#FEE2E2,stroke:#B91C1C,color:#450a0a
    style B3c fill:#FEE2E2,stroke:#B91C1C,color:#450a0a
    style B4a fill:#FEF3C7,stroke:#B45309,color:#451a03
    style B4b fill:#FEF3C7,stroke:#B45309,color:#451a03
    style B4c fill:#FEF3C7,stroke:#B45309,color:#451a03
```

> **Bài củng cố trực tuyến:** <https://trangtu66.github.io/Taode_thi_online/ly_cc_bai5_k12.html>

---

### Vật lí 12 – Bài 6. Nhiệt hoá hơi riêng *(Tuần 6, Tiết 11–12)*

```mermaid
graph TD
    Goc["⚡ BÀI 6 · VẬT LÍ 12\nNhiệt hoá hơi riêng L"]

    Goc --> B1(("① Định\nnghĩa L"))
    Goc --> B2(("② Q = Lm"))
    Goc --> B3(("③ Bảng L\nmột số chất"))
    Goc --> B4(("④ Ứng\ndụng"))

    B1 --> B1a["Nhiệt lượng hoá hơi 1 kg lỏng"]
    B1 --> B1b["Tại nhiệt độ sôi"]
    B1 --> B1c["Đơn vị: J/kg"]
    B1 --> B1d["L lớn → khó bay hơi"]

    B2 --> B2a["Q = Lm"]
    B2 --> B2b["Q > 0: hoá hơi"]
    B2 --> B2c["Q < 0: ngưng tụ"]

    B3 --> B3a["Nước: 2,26×10⁶ J/kg"]
    B3 --> B3b["Cồn: 8,55×10⁵ J/kg"]
    B3 --> B3c["L_nước >> λ_nước_đá (×7)"]

    B4 --> B4a["Mồ hôi làm mát cơ thể"]
    B4 --> B4b["Lò hơi, turbine điện"]
    B4 --> B4c["Nước điều hoà khí hậu"]

    style Goc fill:#0369A1,stroke:#024f7a,stroke-width:3px,color:#fff,font-weight:bold
    style B1 fill:#7C3AED,stroke:#5b1fa8,stroke-width:2px,color:#fff
    style B2 fill:#065F46,stroke:#044032,stroke-width:2px,color:#fff
    style B3 fill:#B91C1C,stroke:#8a1414,stroke-width:2px,color:#fff
    style B4 fill:#B45309,stroke:#863e06,stroke-width:2px,color:#fff
    style B1a fill:#EDE9FE,stroke:#7C3AED,color:#2e1065
    style B1b fill:#EDE9FE,stroke:#7C3AED,color:#2e1065
    style B1c fill:#EDE9FE,stroke:#7C3AED,color:#2e1065
    style B1d fill:#EDE9FE,stroke:#7C3AED,color:#2e1065
    style B2a fill:#D1FAE5,stroke:#065F46,color:#022c22
    style B2b fill:#D1FAE5,stroke:#065F46,color:#022c22
    style B2c fill:#D1FAE5,stroke:#065F46,color:#022c22
    style B3a fill:#FEE2E2,stroke:#B91C1C,color:#450a0a
    style B3b fill:#FEE2E2,stroke:#B91C1C,color:#450a0a
    style B3c fill:#FEE2E2,stroke:#B91C1C,color:#450a0a
    style B4a fill:#FEF3C7,stroke:#B45309,color:#451a03
    style B4b fill:#FEF3C7,stroke:#B45309,color:#451a03
    style B4c fill:#FEF3C7,stroke:#B45309,color:#451a03
```

> **Bài củng cố trực tuyến:** <https://trangtu66.github.io/Taode_thi_online/ly_cc_bai6_k12.html>
