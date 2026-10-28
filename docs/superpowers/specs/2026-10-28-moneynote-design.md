# MoneyNote – Đặc tả Kiến trúc và Thiết kế Hệ thống

**Tên dự án**: MoneyNote – Ứng dụng ghi chép thu chi cá nhân trên trình duyệt  
**Mục tiêu**: Xây dựng ứng dụng web clone chuẩn giao diện từ `mau.html` (Desktop, Mobile, Modals) với HTML5, CSS3, ES6+ thuần, lưu trữ `localStorage`.  
**Lộ trình**: 3 Part (Part 1: HTML & CSS, Part 2: Dữ liệu & CRUD cơ bản, Part 3: Bộ lọc, Ngân sách, Thống kê, Dark mode, Xuất Excel).

---

## 1. Cấu trúc Dự án & Phân tách File
```
e:\Rikkei\MoneyNote\
├── index.html          # Khung trang giao diện HTML5 ngữ nghĩa đầy đủ
├── css/
│   └── style.css       # Toàn bộ CSS hệ thống, layout, responsive, dark mode
├── js/
│   └── app.js          # Logic quản lý trạng thái, CRUD, LocalStorage, tính toán
└── mau.html            # File giao diện mẫu tham chiếu ban đầu
```

---

## 2. Hệ thống Thiết kế (Design Tokens)

### 2.1 Bảng màu (Color Palette)
- **Màu chủ đạo (Primary)**: `#1D4ED8` (hover `#1E3A8A`)
- **Nền trang (Page Background)**: `#F4F6FA` (Chế độ tối: `#0F172A`)
- **Nền thẻ (Card Background)**: `#FFFFFF`, viền `#E5E7EB` (Chế độ tối: `#1E293B`, viền `#334155`)
- **Chữ chính (Text Primary)**: `#111827` (Chế độ tối: `#F8FAFC`)
- **Chữ phụ (Text Secondary)**: `#4B5563` (Chế độ tối: `#94A3B8`)
- **Khoản thu (Income)**: `#0E7A55` (nền chip `#E7F6EF`)
- **Khoản chi (Expense)**: `#B42318` (nền chip `#FDECEA`)
- **Cảnh báo ngân sách (Budget Warning)**: `#D97706` trên nền `#FEF3C7` (chữ `#92400E`)
- **Thẻ số dư (Balance Card)**: `#14213D`, chữ `#FFFFFF`, chữ phụ `#C7D2FE`

### 2.2 Typography & Spacing
- **Font chữ**: `Be Vietnam Pro` (tải từ Google Fonts)
- **Cỡ chữ theo quy chuẩn**: `13px`, `14px`, `17px`, `26px`, `28px`
- **Bo góc (Border Radius)**: Thẻ `16px`, Hộp thoại Modal `20px`, Nút `10–12px`, Chip `8px`

---

## 3. Cấu trúc HTML & Layout

### 3.1 Giao diện chính (Desktop & Tablet)
- **Sidebar (Thanh bên trái)**:
  - Logo + tên ứng dụng "MoneyNote".
  - Menu điều hướng: Tổng quan (active), Giao dịch, Thống kê, Cài đặt.
  - Nút chuyển chế độ tối (Dark mode switch toggle).
  - Chú thích "Dữ liệu lưu trên trình duyệt này".
- **Main Content (Nội dung chính)**:
  - **Top Bar**: Bộ chọn tháng (Tháng trước, Tháng hiện tại YYYY-MM, Tháng sau), Lời chào, Ô tìm kiếm ghi chú, Nút "Thêm giao dịch".
  - **Stat Cards (3 Thẻ thống kê)**:
    - Tổng thu: hiển thị tổng tiền xanh lá, số lượng khoản thu.
    - Tổng chi: hiển thị tổng tiền đỏ, số lượng khoản chi.
    - Số dư: thẻ nền `#14213D`, số dư hiện tại tháng.
  - **Budget Section (Hạn mức ngân sách)**:
    - Tiêu đề, thông số "Đã chi X / Y ₫", Nút "Đặt hạn mức".
    - Thanh tiến độ bo tròn, chuyển màu theo mức độ chi tiêu (xanh/cam/đỏ).
    - Hộp cảnh báo khi $\ge 80\%$ hoặc vượt $100\%$ ngân sách.
  - **Lower Grid**:
    - **Cột trái - Giao dịch gần đây**:
      - Tiêu đề, Nút "Xuất CSV".
      - Bộ lọc: Nhóm nút [Tất cả | Thu | Chi], Dropdown danh mục.
      - Bảng giao dịch: Ngày, Danh mục (badge chữ cái + tên), Ghi chú, Số tiền (+/-), Nút Sửa, Nút Xóa.
    - **Cột phải - Chi theo danh mục**:
      - Thống kê tỷ lệ phần trăm tiền chi tiêu theo từng danh mục.
      - Thanh phân bổ màu tương ứng.

### 3.2 Giao diện Mobile (Responsive)
- Tự động ẩn Sidebar, chuyển sang:
  - Top header gọn nhẹ có chuyển tháng.
  - Thẻ số dư tích hợp tổng thu/chi dạng thẻ con 2 cột.
  - Nút nổi FAB (Floating Action Button) góc dưới phải để thêm giao dịch nhanh.
  - Bottom navigation bar cố định ở cạnh đáy (Tổng quan, Giao dịch, Thống kê, Cài đặt).

### 3.3 Các Hộp thoại Modal
1. **Modal Thêm / Sửa Giao dịch (`#modal-tx`)**:
   - Header: Tiêu đề "Thêm giao dịch" / "Sửa giao dịch", nút đóng (X).
   - Loại giao dịch: Toggle chọn "Khoản thu" / "Khoản chi".
   - Ô nhập số tiền: Có hậu tố `₫`, thông báo lỗi inline khi nhập sai ($\le 0$).
   - Lưới danh mục: 4 cột chip icon + tên, tự động cập nhật theo loại Thu hoặc Chi.
   - Ngày giao dịch: Date picker (`input[type="date"]`).
   - Hình thức: Tiền mặt, Chuyển khoản, Ví điện tử.
   - Ghi chú: Textarea có đếm số ký tự (tối đa 100).
   - Nút hành động: "Hủy" và "Lưu giao dịch".
2. **Modal Xác nhận Xóa (`#modal-delete`)**:
   - Icon thùng rác cảnh báo nền đỏ nhạt.
   - Tiêu đề "Xóa giao dịch này?", nội dung cảnh báo.
   - Hộp tóm tắt thông tin giao dịch cần xóa (Ghi chú, Danh mục, Ngày, Số tiền).
   - 2 Nút: "Không, giữ lại" (trắng) và "Xóa" (đỏ `#B42318`).
3. **Modal Đặt Hạn mức Ngân sách (`#modal-budget`)**:
   - Nhập số tiền hạn mức chi tiêu cho tháng được chọn.
   - Nút "Hủy" và "Lưu hạn mức".

---

## 4. Mô hình Dữ liệu (LocalStorage Schema)

- `moneynote_transactions`: Mảng chứa các object:
  ```json
  [
    {
      "id": "tx_1729000000000",
      "type": "expense",
      "amount": 45000,
      "category": "Ăn uống",
      "date": "2026-10-28",
      "paymentMethod": "Tiền mặt",
      "note": "Cà phê với nhóm",
      "createdAt": 1729000000000
    }
  ]
  ```
- `moneynote_budgets`: Đối tượng lưu ngân sách theo từng tháng dạng `{"2026-10": 6000000}`.
- `moneynote_theme`: Lưu `'light'` hoặc `'dark'`.

---

## 5. Danh mục mặc định & Dữ liệu mẫu
- **Khoản chi**: Ăn uống (`#FFF1E6`, `#9A3412`, 'Ă'), Đi lại (`#E0F2FE`, `#075985`, 'Đ'), Mua sắm (`#FCE7F3`, `#9D174D`, 'M'), Học tập (`#EDE9FE`, `#5B21B6`, 'H'), Giải trí (`#E0E7FF`, `#3730A3`, 'G'), Hóa đơn (`#FEF3C7`, `#92400E`, 'H'), Khác (`#F1F5F9`, `#334155`, 'K').
- **Khoản thu**: Lương (`#E7F6EF`, `#065F46`, 'L'), Học bổng (`#E7F6EF`, `#065F46`, 'H'), Được cho (`#FEF3C7`, `#92400E`, 'Đ'), Khác (`#F1F5F9`, `#334155`, 'K').
- **Dữ liệu mẫu**: 10 giao dịch phong phú trong tháng hiện tại để người dùng mở ra thấy ngay giao diện sinh động.

---

## 6. Kế hoạch triển khai theo 3 Part
- **Part 1**: Tạo file `index.html` và `css/style.css`, dựng trọn vẹn HTML5 ngữ nghĩa và hệ thống CSS chuẩn Light/Dark mode, responsive desktop/tablet/mobile, layout các modal sẵn sàng để mở/đóng.
- **Part 2**: Xây dựng `js/app.js` cho khởi tạo dữ liệu mẫu, CRUD giao dịch (Thêm, Sửa, Xóa có xác nhận, Validate), render bảng và thẻ thống kê.
- **Part 3**: Hoàn thiện lọc & tìm kiếm, hạn mức ngân sách, biểu đồ phần trăm danh mục, toggle Dark mode, và xuất file CSV Excel chuẩn UTF-8.
