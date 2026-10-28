/**
 * MoneyNote - Part 1: Giao diện & Tương tác cơ bản
 * Hỗ trợ chuyển đổi giao diện Sáng / Tối, hiển thị mẫu và kiểm tra các Modal
 */

// Chuyển đổi Dark Mode & Phím tắt F11
function initTheme() {
  const savedTheme = localStorage.getItem('moneynote_theme') || 'light';
  document.documentElement.setAttribute('data-theme', savedTheme);

  const toggleBtn = document.getElementById('theme-toggle');
  const mobileSettingsBtn = document.getElementById('bottom-nav-settings');

  function toggleTheme(e) {
    if (e) e.preventDefault();
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('moneynote_theme', newTheme);
  }

  if (toggleBtn) toggleBtn.addEventListener('click', toggleTheme);
  if (mobileSettingsBtn) mobileSettingsBtn.addEventListener('click', toggleTheme);

  // Phím tắt F11 hoặc Ctrl+Shift+D
  window.addEventListener('keydown', (e) => {
    if (e.key === 'F11') {
      e.preventDefault();
      toggleTheme();
    }
  });
}

// Mẫu hiển thị tĩnh để kiểm tra trực quan trong Part 1
function renderPreviewData() {
  // Cập nhật số liệu mẫu lên giao diện
  const incomeEl = document.getElementById('total-income');
  const expenseEl = document.getElementById('total-expense');
  const balanceEl = document.getElementById('total-balance');
  const incomeCountEl = document.getElementById('income-count');
  const expenseCountEl = document.getElementById('expense-count');
  
  if (incomeEl) incomeEl.textContent = '8.500.000 ₫';
  if (expenseEl) expenseEl.textContent = '5.230.000 ₫';
  if (balanceEl) balanceEl.textContent = '3.270.000 ₫';
  if (incomeCountEl) incomeCountEl.textContent = '2 khoản thu';
  if (expenseCountEl) expenseCountEl.textContent = '14 khoản chi';

  // Tiến độ ngân sách mẫu
  const budgetSpent = document.getElementById('budget-spent-amount');
  const budgetLimit = document.getElementById('budget-limit-amount');
  const progressBar = document.getElementById('budget-progress-bar');
  const alertText = document.getElementById('budget-alert-text');

  if (budgetSpent) budgetSpent.textContent = '5.230.000 ₫';
  if (budgetLimit) budgetLimit.textContent = '6.000.000 ₫';
  if (progressBar) progressBar.style.width = '87%';
  if (alertText) alertText.textContent = 'Bạn đã dùng 87% ngân sách. Còn lại 770.000 ₫ cho những ngày cuối tháng.';

  // Bảng giao dịch mẫu
  const tbody = document.getElementById('transactions-table-body');
  if (tbody) {
    const sampleRows = [
      { date: '28/10/2026', cat: 'Ăn uống', note: 'Cà phê với nhóm', amount: '− 45.000 ₫', isIncome: false, bg: '#FFF1E6', fg: '#9A3412', ini: 'Ă' },
      { date: '27/10/2026', cat: 'Đi lại', note: 'Đổ xăng', amount: '− 80.000 ₫', isIncome: false, bg: '#E0F2FE', fg: '#075985', ini: 'Đ' },
      { date: '25/10/2026', cat: 'Học tập', note: 'Mua giáo trình JavaScript', amount: '− 150.000 ₫', isIncome: false, bg: '#EDE9FE', fg: '#5B21B6', ini: 'H' },
      { date: '24/10/2026', cat: 'Lương', note: 'Lương part-time tháng 10', amount: '+ 3.500.000 ₫', isIncome: true, bg: '#E7F6EF', fg: '#065F46', ini: 'L' },
      { date: '22/10/2026', cat: 'Hóa đơn', note: 'Tiền điện nước', amount: '− 420.000 ₫', isIncome: false, bg: '#FEF3C7', fg: '#92400E', ini: 'H' },
      { date: '20/10/2026', cat: 'Mua sắm', note: 'Áo khoác', amount: '− 350.000 ₫', isIncome: false, bg: '#FCE7F3', fg: '#9D174D', ini: 'M' },
      { date: '18/10/2026', cat: 'Giải trí', note: 'Vé xem phim', amount: '− 110.000 ₫', isIncome: false, bg: '#E0E7FF', fg: '#3730A3', ini: 'G' },
      { date: '15/10/2026', cat: 'Học bổng', note: 'Học bổng kỳ 1', amount: '+ 5.000.000 ₫', isIncome: true, bg: '#E7F6EF', fg: '#065F46', ini: 'H' }
    ];

    tbody.innerHTML = sampleRows.map((t, idx) => `
      <tr>
        <td class="td-date">${t.date}</td>
        <td>
          <span class="cat-badge-wrap">
            <span class="cat-avatar" style="background-color: ${t.bg}; color: ${t.fg};">${t.ini}</span>
            <span class="cat-name">${t.cat}</span>
          </span>
        </td>
        <td class="td-note" title="${t.note}">${t.note}</td>
        <td class="td-amount ${t.isIncome ? 'text-income' : 'text-expense'}">${t.amount}</td>
        <td class="td-actions">
          <button type="button" class="btn-action-icon" aria-label="Sửa giao dịch" onclick="openEditModalSample(${idx})">
            <svg aria-hidden="true" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 20h9"></path>
              <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"></path>
            </svg>
          </button>
          <button type="button" class="btn-action-icon btn-action-delete" aria-label="Xóa giao dịch" onclick="openDeleteModalSample(${idx})">
            <svg aria-hidden="true" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"></path>
              <path d="M10 11v6"></path>
              <path d="M14 11v6"></path>
              <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"></path>
            </svg>
          </button>
        </td>
      </tr>
    `).join('');

    const countLabel = document.getElementById('tx-total-count');
    if (countLabel) countLabel.textContent = 'Xem tất cả 8 giao dịch';
  }

  // Thống kê danh mục mẫu
  const catList = document.getElementById('category-stats-list');
  const catTotal = document.getElementById('cat-stats-total');
  if (catTotal) catTotal.textContent = 'Tổng chi 5.230.000 ₫';

  if (catList) {
    const sampleCats = [
      { name: 'Ăn uống', amount: '1.990.000 ₫', pct: '38%', width: '100%', color: '#1D4ED8' },
      { name: 'Hóa đơn', amount: '1.150.000 ₫', pct: '22%', width: '58%', color: '#3B82F6' },
      { name: 'Đi lại', amount: '730.000 ₫', pct: '14%', width: '37%', color: '#60A5FA' },
      { name: 'Mua sắm', amount: '630.000 ₫', pct: '12%', width: '32%', color: '#D97706' },
      { name: 'Học tập', amount: '470.000 ₫', pct: '9%', width: '24%', color: '#F59E0B' },
      { name: 'Giải trí', amount: '260.000 ₫', pct: '5%', width: '13%', color: '#94A3B8' }
    ];

    catList.innerHTML = sampleCats.map(c => `
      <div class="category-item">
        <div class="category-item-header">
          <span class="category-item-name">${c.name}</span>
          <span class="category-item-stats">${c.amount} · <strong>${c.pct}</strong></span>
        </div>
        <div class="category-track">
          <div class="category-fill" style="width: ${c.width}; background-color: ${c.color};"></div>
        </div>
      </div>
    `).join('');
  }

  // Render danh mục vào form radio grid
  renderFormCategories('expense');
}

// Render chip danh mục trong Form Modal
function renderFormCategories(type = 'expense') {
  const grid = document.getElementById('tx-category-grid');
  if (!grid) return;

  const expenseCategories = [
    { name: 'Ăn uống', chip: '#FFF1E6', fg: '#9A3412', ini: 'Ă' },
    { name: 'Đi lại', chip: '#E0F2FE', fg: '#075985', ini: 'Đ' },
    { name: 'Mua sắm', chip: '#FCE7F3', fg: '#9D174D', ini: 'M' },
    { name: 'Học tập', chip: '#EDE9FE', fg: '#5B21B6', ini: 'H' },
    { name: 'Giải trí', chip: '#E0E7FF', fg: '#3730A3', ini: 'G' },
    { name: 'Hóa đơn', chip: '#FEF3C7', fg: '#92400E', ini: 'H' },
    { name: 'Khác', chip: '#F1F5F9', fg: '#334155', ini: 'K' }
  ];

  const incomeCategories = [
    { name: 'Lương', chip: '#E7F6EF', fg: '#065F46', ini: 'L' },
    { name: 'Học bổng', chip: '#E7F6EF', fg: '#065F46', ini: 'H' },
    { name: 'Được cho', chip: '#FEF3C7', fg: '#92400E', ini: 'Đ' },
    { name: 'Khác', chip: '#F1F5F9', fg: '#334155', ini: 'K' }
  ];

  const list = type === 'income' ? incomeCategories : expenseCategories;
  grid.innerHTML = list.map((c, i) => `
    <button type="button" class="cat-radio-card ${i === 0 ? 'selected' : ''}" data-cat="${c.name}">
      <span class="cat-chip" style="background-color: ${c.chip}; color: ${c.fg};">${c.ini}</span>
      <span>${c.name}</span>
    </button>
  `).join('');

  // Bắt sự kiện chọn danh mục
  grid.querySelectorAll('.cat-radio-card').forEach(btn => {
    btn.addEventListener('click', () => {
      grid.querySelectorAll('.cat-radio-card').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
    });
  });
}

// Quản lý Modal (Mở / Đóng)
function initModals() {
  const modalTx = document.getElementById('modal-tx');
  const modalDelete = document.getElementById('modal-delete');
  const modalBudget = document.getElementById('modal-budget');

  const btnOpenAdd = document.getElementById('btn-open-add-modal');
  const btnFabAdd = document.getElementById('btn-fab-add');
  const btnCloseTx = document.getElementById('btn-close-tx-modal');
  const btnCancelTx = document.getElementById('btn-cancel-tx');

  const btnOpenBudget = document.getElementById('btn-open-budget-modal');
  const btnCloseBudget = document.getElementById('btn-close-budget-modal');
  const btnCancelBudget = document.getElementById('btn-cancel-budget');

  const btnCancelDelete = document.getElementById('btn-cancel-delete');

  function openModal(modal) {
    if (modal) modal.removeAttribute('hidden');
  }

  function closeModal(modal) {
    if (modal) modal.setAttribute('hidden', '');
  }

  // Mở modal thêm
  if (btnOpenAdd) btnOpenAdd.addEventListener('click', () => {
    document.getElementById('modal-tx-title').textContent = 'Thêm giao dịch';
    document.getElementById('tx-date').value = new Date().toISOString().split('T')[0];
    openModal(modalTx);
  });

  if (btnFabAdd) btnFabAdd.addEventListener('click', () => {
    document.getElementById('modal-tx-title').textContent = 'Thêm giao dịch';
    document.getElementById('tx-date').value = new Date().toISOString().split('T')[0];
    openModal(modalTx);
  });

  // Đóng modal thêm
  if (btnCloseTx) btnCloseTx.addEventListener('click', () => closeModal(modalTx));
  if (btnCancelTx) btnCancelTx.addEventListener('click', () => closeModal(modalTx));

  // Modal Ngân sách
  if (btnOpenBudget) btnOpenBudget.addEventListener('click', () => openModal(modalBudget));
  if (btnCloseBudget) btnCloseBudget.addEventListener('click', () => closeModal(modalBudget));
  if (btnCancelBudget) btnCancelBudget.addEventListener('click', () => closeModal(modalBudget));

  // Modal Xóa
  if (btnCancelDelete) btnCancelDelete.addEventListener('click', () => closeModal(modalDelete));

  // Đóng khi click ngoài backdrop
  [modalTx, modalDelete, modalBudget].forEach(m => {
    if (m) {
      m.addEventListener('click', (e) => {
        if (e.target === m) closeModal(m);
      });
    }
  });

  // Toggle Loại Thu / Chi trong modal
  const btnIncome = document.getElementById('btn-type-income');
  const btnExpense = document.getElementById('btn-type-expense');

  if (btnIncome && btnExpense) {
    btnIncome.addEventListener('click', () => {
      btnIncome.classList.add('active');
      btnExpense.classList.remove('active');
      renderFormCategories('income');
    });

    btnExpense.addEventListener('click', () => {
      btnExpense.classList.add('active');
      btnIncome.classList.remove('active');
      renderFormCategories('expense');
    });
  }

  // Đếm ký tự ghi chú
  const noteInput = document.getElementById('tx-note');
  const noteCount = document.getElementById('tx-note-count');
  if (noteInput && noteCount) {
    noteInput.addEventListener('input', () => {
      noteCount.textContent = `${noteInput.value.length}/100 ký tự`;
    });
  }
}

// Các hàm kiểm tra thử Modal Sửa & Xóa
window.openEditModalSample = function(idx) {
  const modalTx = document.getElementById('modal-tx');
  const title = document.getElementById('modal-tx-title');
  if (title) title.textContent = 'Sửa giao dịch';
  const amount = document.getElementById('tx-amount');
  if (amount) amount.value = '45.000';
  const note = document.getElementById('tx-note');
  if (note) note.value = 'Cà phê với nhóm';
  if (modalTx) modalTx.removeAttribute('hidden');
};

window.openDeleteModalSample = function(idx) {
  const modalDelete = document.getElementById('modal-delete');
  if (modalDelete) modalDelete.removeAttribute('hidden');
};

// Khởi chạy khi tài liệu sẵn sàng
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  renderPreviewData();
  initModals();
});

