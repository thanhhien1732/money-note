# NHẬT KÝ PHÁT TRIỂN DỰ ÁN MONEYNOTE VỚI AI (AI CODING LOG)

* **Tên dự án:** MoneyNote – Sổ tay quản lý thu chi cá nhân thông minh
* **Công nghệ sử dụng:** HTML5, CSS3, JavaScript (ES6+ thuần), LocalStorage
* **Mục tiêu:** Xây dựng ứng dụng web chạy hoàn toàn trên trình duyệt, không dùng thư viện ngoài, hỗ trợ Dark Mode, Responsive điện thoại, quản lý ngân sách, thống kê biểu đồ và xuất báo cáo Excel đẹp mắt.

---

## MỤC LỤC CÁC GIAI ĐOẠN & PROMPT CHÍNH

1. [Prompt 1: Khởi tạo dự án & Phân tích yêu cầu từ bản mẫu mau.html](#prompt-1-khởi-tạo-dự-án--phân-tích-yêu-cầu-từ-bản-mẫu-mauhtml)
2. [Prompt 2: Lập kế hoạch triển khai 3 Part](#prompt-2-lập-kế-hoạch-triển-khai-3-part)
3. [Prompt 3 & 4: Khôi phục phiên làm việc & Triển khai Part 2 (CRUD + LocalStorage)](#prompt-3--4-khôi-phục-phiên-làm-việc--triển-khai-part-2-crud--localstorage)
4. [Prompt 5: Bộ Testcase kiểm thử chức năng CRUD](#prompt-5-bộ-testcase-kiểm-thử-chức-năng-crud)
5. [Prompt 6: Triển khai Part 3 (Tính năng nâng cao: Bộ lọc, Ngân sách, Thống kê, Xuất file)](#prompt-6-triển-khai-part-3-tính-năng-nâng-cao-bộ-lọc-ngân-sách-thống-kê-xuất-file)
6. [Prompt 7: Nâng cấp định dạng file xuất Excel (Kẻ bảng, màu sắc, báo cáo)](#prompt-7-nâng-cấp-định-dạng-file-xuất-excel-kẻ-bảng-màu-sắc-báo-cáo)
7. [Prompt 8: Tích hợp xuất file đẹp vào duy nhất 1 nút "Xuất CSV"](#prompt-8-tích-hợp-xuất-file-đẹp-vào-duy-nhất-1-nút-xuất-csv)
8. [Prompt 9: Giới hạn 8 giao dịch gần đây & Nút "Xem tất cả / Thu gọn"](#prompt-9-giới-hạn-8-giao-dịch-gần-đây--nút-xem-tất-cả--thu-gọn)
9. [Prompt 10: Tinh chỉnh hiệu ứng hover nút "Xem tất cả giao dịch"](#prompt-10-tinh-chỉnh-hiệu-ứng-hover-nút-xem-tất-cả-giao-dịch)
10. [Prompt 11: Tinh chỉnh Form "Thêm giao dịch" (Ẩn lỗi, bỏ chọn mặc định, nhập danh mục Khác)](#prompt-11-tinh-chỉnh-form-thêm-giao-dịch-ẩn-lỗi-bỏ-chọn-mặc-định-nhập-danh-mục-khác)
11. [Prompt 12: Rà soát toàn bộ source code (Đặt tên, chia hàm, DRY, Console Error-free)](#prompt-12-rà-soát-toàn-bộ-source-code-đặt-tên-chia-hàm-dry-console-error-free)

---

## CHI TIẾT NHẬT KÝ TỪNG PROMPT

### Prompt 1: Khởi tạo dự án & Phân tích yêu cầu từ bản mẫu mau.html

* **Prompt:**
  > *"Tôi đang muốn xây dựng MoneyNote, một ứng dụng web ghi chép thu chi cá nhân chạy hoàn toàn trên trình duyệt. Ở folder Rikkei\MoneyNote hiện có file mau.html, tôi muốn bạn clone lại trang web từ file mau.html này vào file index.html, css/style.css và js/app.js. Phạm vi và công nghệ: HTML5, CSS3, JavaScript (ES6+) thuần. Lưu trữ trên trình duyệt với các yêu cầu giao diện (Font Be Vietnam Pro, màu chính #1D4ED8, thẻ 16px, nút 10-12px, Dark Mode F11, Responsive Mobile) và 12 chức năng cốt lõi (Tổng quan, Thêm, Sửa, Xóa, Lưu dữ liệu, 10 giao dịch mẫu, Lọc & tìm kiếm, Ngân sách tháng, Thống kê danh mục, Xuất file Excel)..."*

* **Lỗi / Thách thức phát hiện được:**
  - File `mau.html` là một bản đóng gói (bundled template) chứa nhiều artifact nhúng dạng chuỗi Base64 và custom elements (`<sc-raw-td>`, `<sc-for>`,...).
  - Không thể copy nguyên văn code từ `mau.html` vì sẽ phụ thuộc vào framework ảo của file mẫu, gây lỗi cú pháp trên trình duyệt chuẩn.
* **Cách sửa / Giải pháp:**
  - Viết script phân tích và bóc tách kiến trúc HTML/CSS/JS thuần từ `mau.html`.
  - Thiết kế kiến trúc 3 file độc lập: `index.html` (Semantic HTML5), `css/style.css` (CSS Custom Properties - Biến màu sắc Light/Dark, Flexbox/CSS Grid), `js/app.js` (Module hóa các khối xử lý).

---

### Prompt 2: Lập kế hoạch triển khai 3 Part

* **Prompt:**
  > *"Thực hiện theo lộ trình 3 Part như trên (mỗi part hoàn thiện một phần để bạn dễ dàng kiểm tra trực quan trên trình duyệt trước khi sang part tiếp theo)."*

* **Lỗi / Thách thức phát hiện được:**
  - Việc làm toàn bộ 12 tính năng cùng lúc trong một lượt dễ gây quá tải ngữ cảnh và khó kiểm soát lỗi giao diện ban đầu.
* **Cách sửa / Giải pháp:**
  - Chia nhỏ lộ trình làm 3 Part rõ ràng:
    - **Part 1:** Khung giao diện HTML tĩnh + Hệ thống CSS Design System (Light/Dark mode, Responsive, Grid/Flexbox).
    - **Part 2:** Quản lý dữ liệu LocalStorage + Nghiệp vụ CRUD cốt lõi (Thêm, Sửa, Xóa có xác nhận).
    - **Part 3:** Các tính năng nâng cao (Bộ lọc đa chiều, Ngân sách & Cảnh báo, Biểu đồ thống kê tỷ lệ %, Xuất file).

---

### Prompt 3 & 4: Khôi phục phiên làm việc & Triển khai Part 2 (CRUD + LocalStorage)

* **Prompt:**
  > *"IDE vừa mới bị tắt đột ngột, hãy tiếp tục công việc còn dang dở đi"*  
  > *"Tiếp tục triển khai Part 2: Xử lý dữ liệu cốt lõi & chức năng CRUD (Thêm, Sửa, Xóa thật với LocalStorage)"*

* **Lỗi / Thách thức phát hiện được:**
  - Phiên làm việc bị gián đoạn cần khôi phục lại ngữ cảnh chính xác.
  - Cần đảm bảo dữ liệu khi mở lần đầu luôn có sẵn 10 giao dịch mẫu đúng của tháng/năm hiện tại để người dùng thấy giao diện sinh động ngay, đồng thời không ghi đè dữ liệu cũ nếu người dùng đã có sẵn dữ liệu trong LocalStorage.
* **Cách sửa / Giải pháp:**
  - Triển khai hàm `loadDataFromStorage()`: kiểm tra key `moneynote_transactions` trong `localStorage`. Nếu chưa có thì khởi tạo mảng 10 giao dịch mẫu động theo tháng được chọn qua `getSampleTransactions()`, nếu đã có thì parse JSON an toàn bằng `try/catch`.
  - Triển khai đầy đủ các hàm CRUD: `openAddModal()`, `openEditModal(id)`, `openDeleteModal(id)`, `handleSaveTransaction()`, `handleConfirmDelete()`.

---

### Prompt 5: Bộ Testcase kiểm thử chức năng CRUD

* **Prompt:**
  > *"Các testcase cần kiểm tra"*

* **Lỗi / Thách thức phát hiện được:**
  - Cần hệ thống hóa các trường hợp kiểm thử (test cases) từ luồng chuẩn (Happy Path) đến luồng ngoại lệ (Edge Cases) như nhập số tiền bằng 0, số âm, để trống ngày, xóa giao dịch rồi kiểm tra lại số dư và LocalStorage.
* **Cách sửa / Giải pháp:**
  - Xây dựng file kịch bản kiểm thử tự động `test_crud.js` kiểm tra 10 testcases:
    1. Kiểm tra 10 giao dịch mẫu nạp tự động.
    2. Tính toán tổng thu, tổng chi, số dư chính xác.
    3. Validate số tiền `<= 0` bị chặn.
    4. Thêm giao dịch thu/chi thành công.
    5. Kiểm tra dữ liệu được lưu tức thì vào `localStorage`.
    6. Sửa thông tin giao dịch cập nhật đúng `id`.
    7. Mở modal xóa hiển thị đúng thông tin tóm tắt.
    8. Xác nhận xóa loại bỏ đúng bản ghi và cập nhật lại số dư.
    9. Format tiền tệ VNĐ và ngày tháng chuẩn tiếng Việt.
    10. Đóng modal an toàn bằng phím `Escape` và click backdrop.

---

### Prompt 6: Triển khai Part 3 (Tính năng nâng cao: Bộ lọc, Ngân sách, Thống kê, Xuất file)

* **Prompt:**
  > *"Tiếp tục hoàn thiện Part 3: Các tính năng nâng cao (Bộ lọc chi tiết, Quản lý hạn mức ngân sách & cảnh báo, Thống kê tỷ lệ phần trăm danh mục, và Xuất file Excel/CSV)"*

* **Lỗi / Thách thức phát hiện được:**
  - Tìm kiếm ghi chú tiếng Việt: Người dùng gõ "ca phe" không tìm thấy "Cà phê" nếu chỉ so sánh chuỗi thông thường.
  - Ngân sách tháng: Cần thanh tiến độ đổi màu theo 3 mức độ (Xanh $< 80\%$, Vàng $\ge 80\%$, Đỏ $> 100\%$) kèm câu cảnh báo tương ứng và tính số ngày còn lại trong tháng.
* **Cách sửa / Giải pháp:**
  - Viết hàm `removeVietnameseDiacritics(str)` sử dụng chuẩn Unicode NFD (`.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd')`) để tìm kiếm ghi chú thông minh không phân biệt dấu và không phân biệt hoa thường.
  - Xây dựng hàm `renderBudgetWidget()`: tính tỷ lệ % chi tiêu so với hạn mức, cập nhật width và màu sắc thanh tiến độ, hiển thị cảnh báo trực quan.
  - Xây dựng hàm `renderCategoryStats()`: nhóm chi phí theo từng danh mục, tính phần trăm trên tổng chi và sắp xếp giảm dần, hỗ trợ bấm vào danh mục để lọc nhanh.

---

### Prompt 7: Nâng cấp định dạng file xuất Excel (Kẻ bảng, màu sắc, báo cáo)

* **Prompt:**
  > *"Xuất file Excel / CSV hiện tại đang là dữ liệu thô chưa có kẻ bảng và chưa đẹp, hãy làm cho nó đẹp hơn đi"* *(Kèm hình ảnh minh họa file CSV mở trên Excel bị dồn dữ liệu vào Cột A và không có kẻ khung)*

* **Lỗi phát hiện được:**
  - File định dạng `.csv` thuần bản chất là văn bản thô (Plain Text) phân tách bằng dấu phẩy. Khi mở trên Microsoft Excel (đặc biệt là các bản Windows có thiết lập vùng khác nhau), Excel không tự tách cột mà gom toàn bộ vào Cột A.
  - Định dạng `.csv` không có khả năng lưu trữ đường kẻ bảng (borders), màu sắc chữ (xanh/đỏ), màu nền header, hay khối tóm tắt tài chính.
* **Cách sửa:**
  - Chuyển đổi phương thức xuất file sang định dạng **HTML Spreadsheet** chuẩn (`application/vnd.ms-excel;charset=utf-8;` lưu với đuôi `.xls`).
  - Thiết kế cấu trúc bảng báo cáo tài chính chuyên nghiệp:
    - Tiêu đề báo cáo trang trọng: *"BÁO CÁO THU CHI CÁ NHÂN – MONEYNOTE"*.
    - Bảng tóm tắt chỉ số tài chính tháng: Tổng thu nhập (xanh lá), Tổng chi tiêu (đỏ), Số dư hiện tại, Hạn mức ngân sách.
    - Bảng chi tiết có kẻ viền toàn bộ các ô (`border: 1px solid #94A3B8`), hàng header nền xanh dương `#1D4ED8` chữ trắng, các dòng chẵn lẻ có màu nền xen kẽ (Zebra stripes).
    - Định dạng số tiền có dấu phân cách hàng nghìn và ký hiệu `₫`, khoản thu có dấu `+` màu xanh, khoản chi có dấu `−` màu đỏ.

---

### Prompt 8: Tích hợp xuất file đẹp vào duy nhất 1 nút "Xuất CSV"

* **Prompt:**
  > *"Tích hợp vào nút xuất csv luôn, không cần tách làm 2 nút"* *(Kèm hình ảnh giao diện có 2 nút [Xuất Excel (.xls)] và [Xuất CSV])*

* **Lỗi phát hiện được:**
  - Việc tạo 2 nút tách rời gây rối mắt trên thanh công cụ và làm sai lệch giao diện so với mẫu thiết kế gốc ban đầu.
* **Cách sửa:**
  - Xóa bỏ nút phụ `btn-export-excel` khỏi `index.html` và `css/style.css`.
  - Giữ lại duy nhất 1 nút nguyên bản với nhãn `Xuất CSV` (`#btn-export-csv`).
  - Gán sự kiện click của nút này gọi trực tiếp hàm tạo file bảng tính Excel kẻ bảng hoàn chỉnh (`MoneyNote_GiaoDich_YYYY-MM.xls`), giúp người dùng chỉ cần 1 click là có file báo cáo đẹp mở ngay bằng Excel.

---

### Prompt 9: Giới hạn 8 giao dịch gần đây & Nút "Xem tất cả / Thu gọn"

* **Prompt:**
  > *"Ở giao diện "Giao dịch gần đây" tôi muốn chỉ hiện tầm 8 giao dịch ra màn hình và ẩn bớt đi khi nào người dùng bấm vào "Xem tất cả ... giao dịch" như ở hình 1 gốc, hình 2 là giao diện hiện tại"*

* **Lỗi phát hiện được:**
  - Bảng giao dịch hiển thị tất cả các bản ghi có trong tháng (ví dụ 11 hay 16 giao dịch) khiến trang bị kéo dài, mất cân đối với khối biểu đồ bên cạnh và không giống mẫu thiết kế gốc.
* **Cách sửa:**
  - Định nghĩa hằng số `DEFAULT_VISIBLE_LIMIT = 8` và thêm cờ `showAllTransactions: false` vào `state`.
  - Trong hàm `renderTransactionsTable()`:
    - Nếu danh sách $> 8$ giao dịch và chưa bấm mở rộng: chỉ cắt lấy 8 phần tử đầu tiên (`list.slice(0, 8)`).
    - Dưới chân bảng hiển thị nút: `<button class="btn-see-all">Xem tất cả ${total} giao dịch</button>`.
    - Khi người dùng bấm nút: đổi `showAllTransactions = true`, render đủ toàn bộ danh sách và đổi nút thành `"Thu gọn danh sách"`.
    - Khi bấm thu gọn: cuộn trang mượt mà (`scrollIntoView({ behavior: 'smooth' })`) về đầu bảng.
    - Tự động reset về trạng thái thu gọn khi người dùng chuyển tháng hoặc thay đổi bộ lọc.

---

### Prompt 10: Tinh chỉnh hiệu ứng hover nút "Xem tất cả giao dịch"

* **Prompt:**
  > *"Sửa hover nút này chi đổi màu khi hover thôi, không có gạch chân"* *(Kèm hình ảnh chữ "Xem tất cả 12 giao dịch" bị gạch chân màu xanh khi rê chuột)*

* **Lỗi phát hiện được:**
  - Class `.btn-see-all:hover` trong CSS trước đó có khai báo `text-decoration: underline;`.
* **Cách sửa:**
  - Sửa lại CSS trong `css/style.css`:
    ```css
    .btn-see-all:hover {
      text-decoration: none;
      color: #1E40AF;
    }
    [data-theme="dark"] .btn-see-all:hover {
      text-decoration: none;
      color: #93C5FD;
    }
    ```
  - Loại bỏ hoàn toàn gạch chân, chỉ đổi sắc độ màu chữ khi hover kèm hiệu ứng chuyển màu êm ái `transition: all 0.2s ease`.

---

### Prompt 11: Tinh chỉnh Form "Thêm giao dịch" (Ẩn lỗi, bỏ chọn mặc định, nhập danh mục Khác)

* **Prompt:**
  > *"Ở giao diện form 'Thêm giao dịch' cần chỉnh sửa lại như sau:*  
  > *1. Ẩn 2 thông báo ! 'Số tiền phải lớn hơn 0' và 'Vui lòng chọn một danh mục' đi khi nào người dùng bấm 'Lưu giao dịch' mà vi phạm thì mới cho hiện thông báo.*  
  > *2. Không cho mặc định chọn sẵn 'Danh mục'*  
  > *3. Ở option 'Khác' cho xổ ra thêm 1 dải ô cho người dùng tự nhập thêm tên Danh mục không có option sẵn"*

* **Lỗi phát hiện được:**
  1. **Lỗi thông báo đỏ hiện sẵn:** Trong `css/style.css`, class `.field-error` được gán thuộc tính `display: flex;`. Do tính chất ưu tiên của CSS, thuộc tính `display: flex;` này đã ghi đè lên thuộc tính `[hidden] { display: none; }` mặc định của trình duyệt, làm cho thông báo lỗi luôn hiển thị ngay từ lúc vừa mở modal.
  2. **Lỗi chọn sẵn danh mục:** Trong hàm `renderFormCategoryGrid()`, có đoạn code fallback tự động gán `state.selectedCategoryName = categories[0].name`, khiến danh mục đầu tiên (Ăn uống / Lương) luôn tự động bị chọn trước.
  3. **Chưa có ô nhập danh mục tùy biến:** Chưa có giao diện và logic đón nhận khi người dùng chọn danh mục "Khác".
* **Cách sửa:**
  1. Thêm quy tắc CSS ưu tiên tuyệt đối:
     ```css
     .field-error[hidden], [hidden] {
       display: none !important;
     }
     ```
     Gọi `clearFormValidationErrors()` khi mở form và khi đổi tab Thu/Chi. Chỉ khi người dùng bấm "Lưu giao dịch" (`handleSaveTransaction`) mới kích hoạt kiểm tra và gỡ `hidden`. Khi người dùng gõ số tiền $> 0$ hoặc bấm chọn 1 danh mục, thông báo lỗi tương ứng sẽ tự động ẩn ngay lập tức.
  2. Bỏ đoạn code tự chọn phần tử đầu tiên, khởi tạo `state.selectedCategoryName = ''` trong `openAddModal()` và `setFormType()`. Toàn bộ các thẻ danh mục đều ở trạng thái chưa chọn khi mở form mới.
  3. Thêm phần tử `#tx-custom-category-wrap` vào `index.html`:
     - Khi người dùng bấm vào danh mục "Khác": dải ô nhập tự động trượt xuống với hiệu ứng mượt mà và tự động focus con trỏ vào ô nhập.
     - Khi người dùng đổi sang danh mục khác: dải ô nhập tự động ẩn đi.
     - Khi lưu: nếu người dùng nhập tên danh mục tùy chỉnh (ví dụ: *Tiền thưởng dự án*, *Bán đồ cũ*), giao dịch sẽ lưu chính xác tên danh mục này, tự sinh chữ cái đại diện (Avatar initial) và tự động xuất hiện trên bộ lọc cũng như biểu đồ thống kê.
     - Khi sửa giao dịch: tự động nhận diện danh mục tùy biến, chọn ô "Khác" và điền sẵn tên danh mục vào ô nhập để người dùng chỉnh sửa.

---

### Prompt 12: Rà soát toàn bộ source code (Đặt tên, chia hàm, DRY, Console Error-free)

* **Prompt:**
  > *"Rà soát toàn bộ source code xem đã có đặt tên rõ ràng, chia hàm hợp lý, không lặp code, không lỗi console không?"*

* **Lỗi / Điểm cải thiện phát hiện được:**
  - Nút sửa giao dịch trên từng dòng (`.btn-action-edit`) chưa có màu hover đặc trưng như nút xóa (`.btn-action-delete:hover` có màu đỏ).
  - Cần kiểm tra đối soát tất cả các ID giữa JavaScript và HTML xem có ID nào bị lệch hoặc thiếu không.
  - Cần kiểm tra xem có trường hợp nào gây lỗi runtime (`Cannot read properties of null` hoặc `NaN` khi chia cho 0) trên console không.
* **Cách sửa & Kết quả rà soát:**
  - Đã bổ sung hiệu ứng hover cho `.btn-action-edit:hover` với màu nền xanh nhạt `var(--primary-light)` và màu xanh thương hiệu `var(--primary)`.
  - Chạy script đối soát tự động: **57/57 ID** được gọi trong JavaScript đều khớp chuẩn xác 100% với HTML.
  - 100% các câu lệnh truy vấn DOM đều có guard clause bảo vệ Null-safety.
  - Thao tác LocalStorage được bọc `try/catch` an toàn.
  - Chạy kịch bản kiểm thử giả lập 10 luồng thao tác người dùng: **0 Errors, 0 Warnings** trên Console.

---

*Nhật ký được lập và cập nhật tự động vào ngày 28/10/2026 bởi trợ lý AI Antigravity.*

