/**
 * MoneyNote – Ứng dụng ghi chép thu chi cá nhân
 * Part 3: Hoàn thiện toàn diện các tính năng nâng cao
 * - CRUD & LocalStorage
 * - Bộ lọc đa chiều & Tìm kiếm ghi chú không dấu
 * - Quản lý Hạn mức Ngân sách & Hệ thống Cảnh báo tự động
 * - Thống kê Phân bổ Chi tiêu & Biểu đồ tỷ lệ %
 * - Xuất file Excel / CSV chuẩn UTF-8 BOM tiếng Việt
 * - Chế độ tối (Dark mode) & Thông báo Toast tương tác
 */

// ==========================================================================
// 1. Cấu hình Danh mục & Bảng màu
// ==========================================================================
const CATEGORY_CONFIG = {
  expense: [
    { name: 'Ăn uống', bg: '#FFF1E6', fg: '#9A3412', ini: 'Ă' },
    { name: 'Đi lại', bg: '#E0F2FE', fg: '#075985', ini: 'Đ' },
    { name: 'Mua sắm', bg: '#FCE7F3', fg: '#9D174D', ini: 'M' },
    { name: 'Học tập', bg: '#EDE9FE', fg: '#5B21B6', ini: 'H' },
    { name: 'Giải trí', bg: '#E0E7FF', fg: '#3730A3', ini: 'G' },
    { name: 'Hóa đơn', bg: '#FEF3C7', fg: '#92400E', ini: 'H' },
    { name: 'Khác', bg: '#F1F5F9', fg: '#334155', ini: 'K' }
  ],
  income: [
    { name: 'Lương', bg: '#E7F6EF', fg: '#065F46', ini: 'L' },
    { name: 'Học bổng', bg: '#E7F6EF', fg: '#065F46', ini: 'H' },
    { name: 'Được cho', bg: '#FEF3C7', fg: '#92400E', ini: 'Đ' },
    { name: 'Khác', bg: '#F1F5F9', fg: '#334155', ini: 'K' }
  ]
};

const ALL_CATEGORIES = [...CATEGORY_CONFIG.expense, ...CATEGORY_CONFIG.income];

function getCategoryMeta(name) {
  return ALL_CATEGORIES.find(c => c.name === name) || { bg: '#F1F5F9', fg: '#334155', ini: 'K' };
}

// ==========================================================================
// 2. Trạng thái ứng dụng (Application State)
// ==========================================================================
const STORAGE_KEYS = {
  TRANSACTIONS: 'moneynote_transactions',
  BUDGETS: 'moneynote_budgets',
  THEME: 'moneynote_theme'
};

const state = {
  transactions: [],
  selectedYear: 2026,
  selectedMonth: 10,
  budgets: {},
  filterType: 'all', // 'all' | 'income' | 'expense'
  filterCategory: 'all',
  searchQuery: '',
  formType: 'expense',
  selectedCategoryName: '',
  editingId: null,
  deletingId: null
};

// ==========================================================================
// 3. Khởi tạo & Dữ liệu mẫu (Sample Data)
// ==========================================================================
function getSampleTransactions(year, month) {
  const m = String(month).padStart(2, '0');
  return [
    {
      id: 'tx_sample_1',
      type: 'expense',
      amount: 45000,
      category: 'Ăn uống',
      date: `${year}-${m}-28`,
      paymentMethod: 'Tiền mặt',
      note: 'Cà phê với nhóm',
      createdAt: new Date(`${year}-${m}-28T09:30:00`).getTime()
    },
    {
      id: 'tx_sample_2',
      type: 'expense',
      amount: 80000,
      category: 'Đi lại',
      date: `${year}-${m}-27`,
      paymentMethod: 'Tiền mặt',
      note: 'Đổ xăng xe máy',
      createdAt: new Date(`${year}-${m}-27T17:15:00`).getTime()
    },
    {
      id: 'tx_sample_3',
      type: 'expense',
      amount: 150000,
      category: 'Học tập',
      date: `${year}-${m}-25`,
      paymentMethod: 'Chuyển khoản',
      note: 'Mua giáo trình JavaScript',
      createdAt: new Date(`${year}-${m}-25T14:00:00`).getTime()
    },
    {
      id: 'tx_sample_4',
      type: 'income',
      amount: 3500000,
      category: 'Lương',
      date: `${year}-${m}-24`,
      paymentMethod: 'Chuyển khoản',
      note: 'Lương part-time tháng 10',
      createdAt: new Date(`${year}-${m}-24T10:00:00`).getTime()
    },
    {
      id: 'tx_sample_5',
      type: 'expense',
      amount: 420000,
      category: 'Hóa đơn',
      date: `${year}-${m}-22`,
      paymentMethod: 'Ví điện tử',
      note: 'Tiền điện nước phòng trọ',
      createdAt: new Date(`${year}-${m}-22T19:45:00`).getTime()
    },
    {
      id: 'tx_sample_6',
      type: 'expense',
      amount: 350000,
      category: 'Mua sắm',
      date: `${year}-${m}-20`,
      paymentMethod: 'Ví điện tử',
      note: 'Mua áo khoác',
      createdAt: new Date(`${year}-${m}-20T16:20:00`).getTime()
    },
    {
      id: 'tx_sample_7',
      type: 'expense',
      amount: 110000,
      category: 'Giải trí',
      date: `${year}-${m}-18`,
      paymentMethod: 'Ví điện tử',
      note: 'Vé xem phim cuối tuần',
      createdAt: new Date(`${year}-${m}-18T20:00:00`).getTime()
    },
    {
      id: 'tx_sample_8',
      type: 'income',
      amount: 5000000,
      category: 'Học bổng',
      date: `${year}-${m}-15`,
      paymentMethod: 'Chuyển khoản',
      note: 'Học bổng sinh viên giỏi kỳ 1',
      createdAt: new Date(`${year}-${m}-15T08:30:00`).getTime()
    },
    {
      id: 'tx_sample_9',
      type: 'expense',
      amount: 480000,
      category: 'Ăn uống',
      date: `${year}-${m}-10`,
      paymentMethod: 'Chuyển khoản',
      note: 'Đi siêu thị mua đồ ăn',
      createdAt: new Date(`${year}-${m}-10T11:15:00`).getTime()
    },
    {
      id: 'tx_sample_10',
      type: 'income',
      amount: 2000000,
      category: 'Được cho',
      date: `${year}-${m}-05`,
      paymentMethod: 'Chuyển khoản',
      note: 'Bố mẹ gửi phụ cấp sinh hoạt',
      createdAt: new Date(`${year}-${m}-05T15:00:00`).getTime()
    }
  ];
}

function loadDataFromStorage() {
  const rawTx = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
  const rawBudgets = localStorage.getItem(STORAGE_KEYS.BUDGETS);

  if (rawBudgets) {
    try {
      state.budgets = JSON.parse(rawBudgets);
    } catch (e) {
      state.budgets = {};
    }
  } else {
    state.budgets = { [`${state.selectedYear}-${String(state.selectedMonth).padStart(2, '0')}`]: 6000000 };
    saveBudgetsToStorage();
  }

  if (rawTx) {
    try {
      state.transactions = JSON.parse(rawTx);
    } catch (e) {
      state.transactions = [];
    }
  } else {
    state.transactions = getSampleTransactions(state.selectedYear, state.selectedMonth);
    saveTransactionsToStorage();
  }
}

function saveTransactionsToStorage() {
  localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(state.transactions));
}

function saveBudgetsToStorage() {
  localStorage.setItem(STORAGE_KEYS.BUDGETS, JSON.stringify(state.budgets));
}

// ==========================================================================
// 4. Các hàm Tiện ích (Formatters & Helpers)
// ==========================================================================
function formatVND(amount) {
  const num = Number(amount) || 0;
  return num.toLocaleString('vi-VN') + ' ₫';
}

function parseCurrencyInput(value) {
  if (!value) return 0;
  const clean = String(value).replace(/[^0-9]/g, '');
  return clean ? parseInt(clean, 10) : 0;
}

function formatDateDisplay(dateStr) {
  if (!dateStr) return '';
  const parts = dateStr.split('-');
  if (parts.length === 3) {
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  }
  return dateStr;
}

function getCurrentMonthKey() {
  return `${state.selectedYear}-${String(state.selectedMonth).padStart(2, '0')}`;
}

// Chuyển chuỗi tiếng Việt có dấu thành không dấu để tìm kiếm tiện lợi
function removeVietnameseDiacritics(str) {
  if (!str) return '';
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase();
}

// Hệ thống Toast Notification
function showToast(message, type = 'success') {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;

  let iconSvg = '';
  if (type === 'success') {
    iconSvg = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
  } else if (type === 'warning') {
    iconSvg = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>`;
  } else {
    iconSvg = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>`;
  }

  toast.innerHTML = `${iconSvg}<span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 3000);
}

// ==========================================================================
// 5. Tính toán & Lọc Dữ liệu (Selectors)
// ==========================================================================
function getTransactionsForCurrentMonth() {
  const monthKey = getCurrentMonthKey();
  return state.transactions.filter(t => t.date && t.date.startsWith(monthKey));
}

function getFilteredTransactions() {
  let list = getTransactionsForCurrentMonth();

  // Lọc theo loại (all / income / expense)
  if (state.filterType !== 'all') {
    list = list.filter(t => t.type === state.filterType);
  }

  // Lọc theo danh mục
  if (state.filterCategory !== 'all') {
    list = list.filter(t => t.category === state.filterCategory);
  }

  // Lọc theo từ khóa ghi chú (hỗ trợ cả có dấu và không dấu)
  if (state.searchQuery.trim()) {
    const rawQ = state.searchQuery.trim().toLowerCase();
    const cleanQ = removeVietnameseDiacritics(rawQ);

    list = list.filter(t => {
      const rawNote = (t.note || '').toLowerCase();
      const cleanNote = removeVietnameseDiacritics(rawNote);
      return rawNote.includes(rawQ) || cleanNote.includes(cleanQ);
    });
  }

  // Sắp xếp: Mới nhất lên đầu
  return list.sort((a, b) => {
    if (b.date !== a.date) {
      return b.date.localeCompare(a.date);
    }
    return (b.createdAt || 0) - (a.createdAt || 0);
  });
}

function calculateMonthTotals() {
  const monthTx = getTransactionsForCurrentMonth();
  let totalIncome = 0;
  let totalExpense = 0;
  let incomeCount = 0;
  let expenseCount = 0;

  monthTx.forEach(t => {
    const amt = Number(t.amount) || 0;
    if (t.type === 'income') {
      totalIncome += amt;
      incomeCount++;
    } else {
      totalExpense += amt;
      expenseCount++;
    }
  });

  const balance = totalIncome - totalExpense;
  return { totalIncome, totalExpense, balance, incomeCount, expenseCount };
}

// ==========================================================================
// 6. Giao diện & Render (UI Rendering)
// ==========================================================================
function renderAll() {
  renderMonthHeader();
  renderOverviewStats();
  renderBudgetWidget();
  renderCategoryFilterDropdown();
  renderTransactionsTable();
  renderCategoryStats();
}

function renderMonthHeader() {
  const monthDisplay = document.getElementById('current-month-display');
  if (monthDisplay) {
    monthDisplay.textContent = `Tháng ${state.selectedMonth}/${state.selectedYear}`;
  }

  const budgetMonthDisplay = document.getElementById('budget-modal-month');
  if (budgetMonthDisplay) {
    budgetMonthDisplay.textContent = `Tháng ${state.selectedMonth}/${state.selectedYear}`;
  }
}

function renderOverviewStats() {
  const { totalIncome, totalExpense, balance, incomeCount, expenseCount } = calculateMonthTotals();

  const elIncome = document.getElementById('total-income');
  const elExpense = document.getElementById('total-expense');
  const elBalance = document.getElementById('total-balance');
  const elIncomeCount = document.getElementById('income-count');
  const elExpenseCount = document.getElementById('expense-count');

  if (elIncome) elIncome.textContent = formatVND(totalIncome);
  if (elExpense) elExpense.textContent = formatVND(totalExpense);
  if (elBalance) elBalance.textContent = formatVND(balance);

  if (elIncomeCount) elIncomeCount.textContent = `${incomeCount} khoản thu`;
  if (elExpenseCount) elExpenseCount.textContent = `${expenseCount} khoản chi`;
}

// Render Widget Ngân sách tháng & Cảnh báo (F8)
function renderBudgetWidget() {
  const { totalExpense } = calculateMonthTotals();
  const monthKey = getCurrentMonthKey();
  const limit = state.budgets[monthKey] || 0;

  const elSpent = document.getElementById('budget-spent-amount');
  const elLimit = document.getElementById('budget-limit-amount');
  const elBar = document.getElementById('budget-progress-bar');
  const alertBox = document.getElementById('budget-alert-box');
  const alertText = document.getElementById('budget-alert-text');

  if (elSpent) elSpent.textContent = formatVND(totalExpense);
  if (elLimit) elLimit.textContent = formatVND(limit);

  if (limit <= 0) {
    if (elBar) elBar.style.width = '0%';
    if (alertText) alertText.textContent = 'Chưa đặt hạn mức ngân sách tháng này. Bấm "Đặt hạn mức" để quản lý chi tiêu!';
    if (alertBox) {
      alertBox.style.display = 'flex';
      alertBox.style.backgroundColor = 'var(--bg-control)';
      alertBox.style.color = 'var(--text-secondary)';
      alertBox.style.borderColor = 'var(--border-color)';
    }
    return;
  }

  const pct = Math.round((totalExpense / limit) * 100);
  const remaining = limit - totalExpense;

  // Tính số ngày còn lại trong tháng
  const today = new Date();
  const daysInMonth = new Date(state.selectedYear, state.selectedMonth, 0).getDate();
  const isCurrentCalendarMonth = today.getFullYear() === state.selectedYear && (today.getMonth() + 1) === state.selectedMonth;
  const daysLeft = isCurrentCalendarMonth ? Math.max(0, daysInMonth - today.getDate()) : daysInMonth;
  const daysText = daysLeft > 0 ? ` cho ${daysLeft} ngày còn lại` : '';

  if (elBar) {
    elBar.style.width = `${Math.min(pct, 100)}%`;
    if (totalExpense > limit) {
      elBar.style.backgroundColor = 'var(--expense)';
    } else if (pct >= 80) {
      elBar.style.backgroundColor = 'var(--budget-warn)';
    } else {
      elBar.style.backgroundColor = 'var(--primary)';
    }
  }

  if (alertBox && alertText) {
    alertBox.style.display = 'flex';
    if (totalExpense > limit) {
      const over = totalExpense - limit;
      alertBox.style.backgroundColor = 'var(--expense-bg)';
      alertBox.style.color = 'var(--expense)';
      alertBox.style.borderColor = 'rgba(239, 68, 68, 0.3)';
      alertText.textContent = `Báo động: Bạn đã chi vượt hạn mức ${formatVND(over)} (${pct}% ngân sách).`;
    } else if (pct >= 80) {
      alertBox.style.backgroundColor = 'var(--budget-warn-bg)';
      alertBox.style.color = 'var(--budget-warn-text)';
      alertBox.style.borderColor = 'rgba(217, 119, 6, 0.3)';
      alertText.textContent = `Cảnh báo: Bạn đã dùng ${pct}% ngân sách. Còn lại ${formatVND(remaining)}${daysText}.`;
    } else {
      alertBox.style.backgroundColor = 'var(--income-bg)';
      alertBox.style.color = 'var(--income)';
      alertBox.style.borderColor = 'rgba(16, 185, 129, 0.3)';
      alertText.textContent = `Chi tiêu an toàn: Đã dùng ${pct}% ngân sách. Còn lại ${formatVND(remaining)}${daysText}.`;
    }
  }
}

// Render dropdown danh mục lọc (F7)
function renderCategoryFilterDropdown() {
  const select = document.getElementById('filter-category');
  if (!select) return;

  const monthTx = getTransactionsForCurrentMonth();
  const usedCats = [...new Set(monthTx.map(t => t.category))].filter(Boolean);

  let html = `<option value="all">Tất cả danh mục</option>`;
  usedCats.forEach(cat => {
    const isSelected = state.filterCategory === cat ? 'selected' : '';
    html += `<option value="${cat}" ${isSelected}>${cat}</option>`;
  });

  select.innerHTML = html;
}

// Render bảng danh sách giao dịch (F3)
function renderTransactionsTable() {
  const tbody = document.getElementById('transactions-table-body');
  const countLabel = document.getElementById('tx-total-count');
  if (!tbody) return;

  const list = getFilteredTransactions();

  if (countLabel) {
    const filterInfo = state.filterCategory !== 'all' ? ` [${state.filterCategory}]` : '';
    countLabel.textContent = `Hiển thị ${list.length} giao dịch${filterInfo}`;
  }

  if (list.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="5">
          <div class="empty-state">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <rect x="2" y="4" width="20" height="16" rx="2"></rect>
              <line x1="2" y1="10" x2="22" y2="10"></line>
            </svg>
            <p>Không tìm thấy giao dịch nào trong tháng ${state.selectedMonth}/${state.selectedYear}.</p>
          </div>
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = list.map(t => {
    const meta = getCategoryMeta(t.category);
    const isIncome = t.type === 'income';
    const sign = isIncome ? '+' : '−';
    const amountColorClass = isIncome ? 'text-income' : 'text-expense';
    const amountFormatted = `${sign} ${formatVND(t.amount)}`;

    return `
      <tr data-id="${t.id}" title="Bấm để sửa giao dịch này">
        <td class="td-date">${formatDateDisplay(t.date)}</td>
        <td>
          <span class="cat-badge-wrap">
            <span class="cat-avatar" style="background-color: ${meta.bg}; color: ${meta.fg};">${meta.ini}</span>
            <span class="cat-name">${t.category}</span>
          </span>
        </td>
        <td class="td-note" title="${t.note || ''}">${t.note || '—'}</td>
        <td class="td-amount ${amountColorClass}">${amountFormatted}</td>
        <td class="td-actions">
          <button type="button" class="btn-action-icon btn-action-edit" data-id="${t.id}" aria-label="Sửa giao dịch">
            <svg aria-hidden="true" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 20h9"></path>
              <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"></path>
            </svg>
          </button>
          <button type="button" class="btn-action-icon btn-action-delete" data-id="${t.id}" aria-label="Xóa giao dịch">
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
    `;
  }).join('');

  // Bắt sự kiện Sửa / Xóa
  tbody.querySelectorAll('.btn-action-edit').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      openEditModal(btn.dataset.id);
    });
  });

  tbody.querySelectorAll('.btn-action-delete').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      openDeleteModal(btn.dataset.id);
    });
  });

  tbody.querySelectorAll('tr').forEach(row => {
    row.addEventListener('click', () => {
      const id = row.dataset.id;
      if (id) openEditModal(id);
    });
    row.style.cursor = 'pointer';
  });
}

// Render Biểu đồ thống kê chi tiêu theo danh mục (F9)
function renderCategoryStats() {
  const catList = document.getElementById('category-stats-list');
  const catTotal = document.getElementById('cat-stats-total');
  if (!catList) return;

  const monthTx = getTransactionsForCurrentMonth();
  const expenseTx = monthTx.filter(t => t.type === 'expense');
  const totalExpense = expenseTx.reduce((sum, t) => sum + (Number(t.amount) || 0), 0);

  if (catTotal) {
    catTotal.textContent = `Tổng chi ${formatVND(totalExpense)}`;
  }

  if (expenseTx.length === 0 || totalExpense === 0) {
    catList.innerHTML = `<div class="empty-state" style="padding: 24px 0;"><p>Chưa có khoản chi nào trong tháng.</p></div>`;
    return;
  }

  // Gom nhóm tổng chi theo danh mục
  const catMap = {};
  expenseTx.forEach(t => {
    catMap[t.category] = (catMap[t.category] || 0) + (Number(t.amount) || 0);
  });

  // Chuyển sang mảng và tính %
  const sorted = Object.entries(catMap)
    .map(([name, amount]) => ({
      name,
      amount,
      pctNum: Math.round((amount / totalExpense) * 100)
    }))
    .sort((a, b) => b.amount - a.amount);

  const colors = ['#1D4ED8', '#3B82F6', '#60A5FA', '#D97706', '#F59E0B', '#94A3B8', '#64748B'];

  catList.innerHTML = sorted.map((c, idx) => {
    const color = colors[idx % colors.length];
    const isSelected = state.filterCategory === c.name ? 'active-filter' : '';
    return `
      <div class="category-item ${isSelected}" data-cat="${c.name}" title="Bấm để lọc theo danh mục ${c.name}">
        <div class="category-item-header">
          <span class="category-item-name">${c.name}</span>
          <span class="category-item-stats">${formatVND(c.amount)} · <strong>${c.pctNum}%</strong></span>
        </div>
        <div class="category-track">
          <div class="category-fill" style="width: ${c.pctNum}%; background-color: ${color};"></div>
        </div>
      </div>
    `;
  }).join('');

  // Tương tác: Bấm vào 1 danh mục để lọc nhanh bảng giao dịch
  catList.querySelectorAll('.category-item').forEach(item => {
    item.addEventListener('click', () => {
      const cat = item.dataset.cat;
      if (state.filterCategory === cat) {
        state.filterCategory = 'all'; // Toggle bỏ lọc
        showToast(`Đã hủy lọc danh mục`, 'info');
      } else {
        state.filterCategory = cat;
        showToast(`Đang lọc theo: ${cat}`, 'info');
      }
      renderCategoryFilterDropdown();
      renderTransactionsTable();
      renderCategoryStats();

      // Cuộn nhẹ tới bảng
      const txSection = document.querySelector('.transactions-section');
      if (txSection) txSection.scrollIntoView({ behavior: 'smooth' });
    });
  });
}

function renderFormCategoryGrid() {
  const grid = document.getElementById('tx-category-grid');
  if (!grid) return;

  const categories = CATEGORY_CONFIG[state.formType] || CATEGORY_CONFIG.expense;

  const isCurrentValid = categories.some(c => c.name === state.selectedCategoryName);
  if (!isCurrentValid && categories.length > 0) {
    state.selectedCategoryName = categories[0].name;
  }

  grid.innerHTML = categories.map(c => {
    const isSelected = c.name === state.selectedCategoryName ? 'selected' : '';
    return `
      <button type="button" class="cat-radio-card ${isSelected}" data-cat="${c.name}">
        <span class="cat-chip" style="background-color: ${c.bg}; color: ${c.fg};">${c.ini}</span>
        <span>${c.name}</span>
      </button>
    `;
  }).join('');

  grid.querySelectorAll('.cat-radio-card').forEach(btn => {
    btn.addEventListener('click', () => {
      grid.querySelectorAll('.cat-radio-card').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      state.selectedCategoryName = btn.dataset.cat;
      const err = document.getElementById('tx-category-error');
      if (err) err.hidden = true;
    });
  });
}

// ==========================================================================
// 7. Xử lý Form Thêm / Sửa Giao Dịch (F2, F4)
// ==========================================================================
function openAddModal() {
  state.editingId = null;
  const modal = document.getElementById('modal-tx');
  const title = document.getElementById('modal-tx-title');
  const form = document.getElementById('tx-form');
  const editIdInput = document.getElementById('tx-edit-id');

  if (title) title.textContent = 'Thêm giao dịch';
  if (editIdInput) editIdInput.value = '';
  if (form) form.reset();

  setFormType('expense');

  const today = new Date();
  const isCurrentMonthView = today.getFullYear() === state.selectedYear && (today.getMonth() + 1) === state.selectedMonth;
  const defaultDateStr = isCurrentMonthView
    ? today.toISOString().split('T')[0]
    : `${state.selectedYear}-${String(state.selectedMonth).padStart(2, '0')}-01`;

  const dateInput = document.getElementById('tx-date');
  if (dateInput) dateInput.value = defaultDateStr;

  clearFormValidationErrors();
  updateNoteCharCount();

  if (modal) modal.removeAttribute('hidden');
  setTimeout(() => {
    const amountInput = document.getElementById('tx-amount');
    if (amountInput) amountInput.focus();
  }, 100);
}

function openEditModal(id) {
  const tx = state.transactions.find(t => t.id === id);
  if (!tx) return;

  state.editingId = id;
  const modal = document.getElementById('modal-tx');
  const title = document.getElementById('modal-tx-title');
  const editIdInput = document.getElementById('tx-edit-id');
  const amountInput = document.getElementById('tx-amount');
  const dateInput = document.getElementById('tx-date');
  const paymentSelect = document.getElementById('tx-payment');
  const noteTextarea = document.getElementById('tx-note');

  if (title) title.textContent = 'Sửa giao dịch';
  if (editIdInput) editIdInput.value = tx.id;
  if (amountInput) amountInput.value = (Number(tx.amount) || 0).toLocaleString('vi-VN');
  if (dateInput) dateInput.value = tx.date;
  if (paymentSelect) paymentSelect.value = tx.paymentMethod || 'Tiền mặt';
  if (noteTextarea) noteTextarea.value = tx.note || '';

  state.selectedCategoryName = tx.category;
  setFormType(tx.type);

  clearFormValidationErrors();
  updateNoteCharCount();

  if (modal) modal.removeAttribute('hidden');
}

function setFormType(type) {
  state.formType = type;
  const btnIncome = document.getElementById('btn-type-income');
  const btnExpense = document.getElementById('btn-type-expense');

  if (type === 'income') {
    if (btnIncome) btnIncome.classList.add('active');
    if (btnExpense) btnExpense.classList.remove('active');
  } else {
    if (btnExpense) btnExpense.classList.add('active');
    if (btnIncome) btnIncome.classList.remove('active');
  }

  renderFormCategoryGrid();
}

function clearFormValidationErrors() {
  const amountWrap = document.getElementById('tx-amount-wrap');
  const amountErr = document.getElementById('tx-amount-error');
  const catErr = document.getElementById('tx-category-error');

  if (amountWrap) amountWrap.classList.remove('has-error');
  if (amountErr) amountErr.hidden = true;
  if (catErr) catErr.hidden = true;
}

function updateNoteCharCount() {
  const noteInput = document.getElementById('tx-note');
  const countEl = document.getElementById('tx-note-count');
  if (noteInput && countEl) {
    countEl.textContent = `${noteInput.value.length}/100 ký tự`;
  }
}

function handleSaveTransaction(e) {
  e.preventDefault();

  const amountInput = document.getElementById('tx-amount');
  const amountWrap = document.getElementById('tx-amount-wrap');
  const amountErr = document.getElementById('tx-amount-error');
  const catErr = document.getElementById('tx-category-error');
  const dateInput = document.getElementById('tx-date');
  const paymentSelect = document.getElementById('tx-payment');
  const noteInput = document.getElementById('tx-note');

  let hasError = false;

  const rawAmount = parseCurrencyInput(amountInput ? amountInput.value : '');
  if (!rawAmount || rawAmount <= 0) {
    if (amountWrap) amountWrap.classList.add('has-error');
    if (amountErr) amountErr.hidden = false;
    hasError = true;
  } else {
    if (amountWrap) amountWrap.classList.remove('has-error');
    if (amountErr) amountErr.hidden = true;
  }

  if (!state.selectedCategoryName) {
    if (catErr) catErr.hidden = false;
    hasError = true;
  } else {
    if (catErr) catErr.hidden = true;
  }

  const dateVal = dateInput ? dateInput.value.trim() : '';
  if (!dateVal) {
    hasError = true;
  }

  if (hasError) return;

  const payload = {
    type: state.formType,
    amount: rawAmount,
    category: state.selectedCategoryName,
    date: dateVal,
    paymentMethod: paymentSelect ? paymentSelect.value : 'Tiền mặt',
    note: noteInput ? noteInput.value.trim() : ''
  };

  const isEditing = Boolean(state.editingId);

  if (isEditing) {
    const index = state.transactions.findIndex(t => t.id === state.editingId);
    if (index !== -1) {
      state.transactions[index] = {
        ...state.transactions[index],
        ...payload
      };
    }
  } else {
    const newTx = {
      id: 'tx_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
      ...payload,
      createdAt: Date.now()
    };
    state.transactions.unshift(newTx);
  }

  saveTransactionsToStorage();
  closeModal('modal-tx');
  renderAll();

  showToast(isEditing ? 'Cập nhật giao dịch thành công!' : 'Đã thêm giao dịch mới!');
}

// ==========================================================================
// 8. Xử lý Xóa Giao Dịch (F5)
// ==========================================================================
function openDeleteModal(id) {
  const tx = state.transactions.find(t => t.id === id);
  if (!tx) return;

  state.deletingId = id;
  const modal = document.getElementById('modal-delete');
  const noteEl = document.getElementById('delete-summary-note');
  const subEl = document.getElementById('delete-summary-sub');
  const amountEl = document.getElementById('delete-summary-amount');

  if (noteEl) noteEl.textContent = tx.note || tx.category;
  if (subEl) subEl.textContent = `${tx.category} · ${formatDateDisplay(tx.date)}`;
  if (amountEl) {
    const sign = tx.type === 'income' ? '+' : '−';
    amountEl.textContent = `${sign} ${formatVND(tx.amount)}`;
    amountEl.style.color = tx.type === 'income' ? 'var(--income)' : 'var(--expense)';
  }

  if (modal) modal.removeAttribute('hidden');
}

function handleConfirmDelete() {
  if (!state.deletingId) return;

  state.transactions = state.transactions.filter(t => t.id !== state.deletingId);
  state.deletingId = null;

  saveTransactionsToStorage();
  closeModal('modal-delete');
  renderAll();

  showToast('Đã xóa giao dịch thành công!', 'warning');
}

// ==========================================================================
// 9. Xử lý Hạn Mức Ngân Sách Tháng (F8)
// ==========================================================================
function openBudgetModal() {
  const modal = document.getElementById('modal-budget');
  const input = document.getElementById('budget-input');
  const monthKey = getCurrentMonthKey();
  const currentLimit = state.budgets[monthKey] || 0;

  if (input) {
    input.value = currentLimit ? currentLimit.toLocaleString('vi-VN') : '';
  }

  const err = document.getElementById('budget-error');
  if (err) err.hidden = true;

  if (modal) modal.removeAttribute('hidden');
  setTimeout(() => {
    if (input) input.focus();
  }, 100);
}

function handleSaveBudget(e) {
  e.preventDefault();
  const input = document.getElementById('budget-input');
  const err = document.getElementById('budget-error');

  const rawVal = parseCurrencyInput(input ? input.value : '');
  if (rawVal < 0) {
    if (err) err.hidden = false;
    return;
  }

  const monthKey = getCurrentMonthKey();
  state.budgets[monthKey] = rawVal;

  saveBudgetsToStorage();
  closeModal('modal-budget');
  renderBudgetWidget();

  showToast(`Đã lưu hạn mức ngân sách: ${formatVND(rawVal)}`);
}

// ==========================================================================
// 10. Xuất File Báo Cáo Kẻ Bảng Đẹp Cho Excel (F12)
// ==========================================================================

// Xuất danh sách giao dịch ra file Excel có kẻ bảng, màu sắc, tiêu đề và bảng tóm tắt
function exportTransactionsToCSV() {
  const list = getFilteredTransactions();

  if (list.length === 0) {
    showToast('Không có giao dịch nào trong tháng này để xuất file.', 'warning');
    return;
  }

  const { totalIncome, totalExpense, balance } = calculateMonthTotals();
  const monthKey = getCurrentMonthKey();
  const budgetLimit = state.budgets[monthKey] || 0;
  const now = new Date();
  const exportTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')} ngày ${now.getDate().toString().padStart(2, '0')}/${(now.getMonth() + 1).toString().padStart(2, '0')}/${now.getFullYear()}`;

  const rowsHtml = list.map((t, idx) => {
    const isIncome = t.type === 'income';
    const typeLabel = isIncome ? 'Thu' : 'Chi';
    const typeColor = isIncome ? '#0E7A55' : '#B42318';
    const sign = isIncome ? '+' : '−';
    const amountVal = Number(t.amount) || 0;
    const noteEscaped = (t.note || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    const catEscaped = (t.category || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    const payEscaped = (t.paymentMethod || 'Tiền mặt').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    const bgRow = idx % 2 === 1 ? 'background-color: #F8FAFC;' : 'background-color: #FFFFFF;';

    return `
      <tr style="${bgRow}">
        <td style="text-align: center; mso-number-format: '\\@'; padding: 7px 10px; border: 1px solid #94A3B8;">${idx + 1}</td>
        <td style="text-align: center; mso-number-format: '\\@'; padding: 7px 10px; border: 1px solid #94A3B8;">${formatDateDisplay(t.date)}</td>
        <td style="text-align: center; font-weight: bold; color: ${typeColor}; mso-number-format: '\\@'; padding: 7px 10px; border: 1px solid #94A3B8;">${typeLabel}</td>
        <td style="text-align: left; font-weight: 500; mso-number-format: '\\@'; padding: 7px 10px; border: 1px solid #94A3B8;">${catEscaped}</td>
        <td style="text-align: right; font-weight: bold; color: ${typeColor}; mso-number-format: '#,##0\\ \\₫'; padding: 7px 10px; border: 1px solid #94A3B8;">${sign}${amountVal.toLocaleString('vi-VN')} ₫</td>
        <td style="text-align: center; mso-number-format: '\\@'; padding: 7px 10px; border: 1px solid #94A3B8;">${payEscaped}</td>
        <td style="text-align: left; mso-number-format: '\\@'; padding: 7px 10px; border: 1px solid #94A3B8;">${noteEscaped}</td>
      </tr>
    `;
  }).join('');

  const htmlContent = `
    <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
    <head>
      <meta charset="utf-8">
      <!--[if gte mso 9]>
      <xml>
        <x:ExcelWorkbook>
          <x:ExcelWorksheets>
            <x:ExcelWorksheet>
              <x:Name>Báo cáo thu chi</x:Name>
              <x:WorksheetOptions>
                <x:DisplayGridlines/>
                <x:Print><x:ValidPrinterInfo/></x:Print>
              </x:WorksheetOptions>
            </x:ExcelWorksheet>
          </x:ExcelWorksheets>
        </x:ExcelWorkbook>
      </xml>
      <![endif]-->
      <style>
        body { font-family: 'Segoe UI', Arial, sans-serif; }
        table { border-collapse: collapse; width: 100%; }
        .report-header { font-size: 18pt; font-weight: bold; color: #1D4ED8; text-align: center; height: 44px; vertical-align: middle; }
        .report-sub { font-size: 11pt; color: #4B5563; text-align: center; font-style: italic; }
        .box-title { font-size: 11pt; font-weight: bold; background-color: #EEF2FF; color: #1E3A8A; border: 1px solid #93C5FD; padding: 8px; text-align: center; }
        .summary-label { font-weight: bold; background-color: #F8FAFC; border: 1px solid #CBD5E1; padding: 6px 12px; }
        .summary-value { font-weight: bold; border: 1px solid #CBD5E1; padding: 6px 12px; text-align: right; }
        th {
          background-color: #1D4ED8;
          color: #FFFFFF;
          font-weight: bold;
          font-size: 11pt;
          border: 1px solid #000000;
          text-align: center;
          vertical-align: middle;
          height: 34px;
        }
        td {
          border: 1px solid #94A3B8;
          font-size: 10.5pt;
          vertical-align: middle;
          padding: 6px 10px;
        }
        .total-row td {
          background-color: #EEF2FF;
          font-weight: bold;
          font-size: 11pt;
          border-top: 2px solid #1D4ED8;
          border-bottom: 2px solid #1D4ED8;
          height: 32px;
        }
      </style>
    </head>
    <body>
      <table>
        <tr>
          <td colspan="7" class="report-header">BÁO CÁO THU CHI CÁ NHÂN – MONEYNOTE</td>
        </tr>
        <tr>
          <td colspan="7" class="report-sub">Tháng ${state.selectedMonth}/${state.selectedYear} | Xuất lúc: ${exportTime}</td>
        </tr>
        <tr><td colspan="7" style="border: none; height: 12px;"></td></tr>
        
        <!-- Bảng tóm tắt chỉ số -->
        <tr>
          <td colspan="7" class="box-title">TỔNG QUAN TÀI CHÍNH THÁNG ${state.selectedMonth}/${state.selectedYear}</td>
        </tr>
        <tr>
          <td colspan="2" class="summary-label">Tổng thu nhập:</td>
          <td colspan="2" class="summary-value" style="color: #0E7A55;">+ ${formatVND(totalIncome)}</td>
          <td class="summary-label">Số dư hiện tại:</td>
          <td colspan="2" class="summary-value" style="color: #1D4ED8; font-size: 12pt;">${formatVND(balance)}</td>
        </tr>
        <tr>
          <td colspan="2" class="summary-label">Tổng chi tiêu:</td>
          <td colspan="2" class="summary-value" style="color: #B42318;">− ${formatVND(totalExpense)}</td>
          <td class="summary-label">Hạn mức ngân sách:</td>
          <td colspan="2" class="summary-value">${budgetLimit > 0 ? formatVND(budgetLimit) : 'Chưa đặt'}</td>
        </tr>
        <tr><td colspan="7" style="border: none; height: 16px;"></td></tr>

        <!-- Bảng danh sách chi tiết có kẻ khung viền đẹp -->
        <thead>
          <tr>
            <th style="width: 50px;">STT</th>
            <th style="width: 110px;">Ngày</th>
            <th style="width: 75px;">Loại</th>
            <th style="width: 140px;">Danh mục</th>
            <th style="width: 150px;">Số tiền</th>
            <th style="width: 130px;">Hình thức</th>
            <th style="width: 280px;">Ghi chú</th>
          </tr>
        </thead>
        <tbody>
          ${rowsHtml}
          <tr class="total-row">
            <td colspan="4" style="text-align: center;">TỔNG CỘNG THÁNG ${state.selectedMonth}/${state.selectedYear} (SỐ DƯ)</td>
            <td style="text-align: right; color: ${balance >= 0 ? '#0E7A55' : '#B42318'};">${formatVND(balance)}</td>
            <td colspan="2" style="text-align: center; font-style: italic; color: #4B5563;">${list.length} giao dịch</td>
          </tr>
        </tbody>
      </table>
    </body>
    </html>
  `;

  const blob = new Blob(['\uFEFF' + htmlContent], { type: 'application/vnd.ms-excel;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  const fileName = `MoneyNote_GiaoDich_${state.selectedYear}-${String(state.selectedMonth).padStart(2, '0')}.xls`;
  a.href = url;
  a.setAttribute('download', fileName);
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  showToast(`Đã xuất ${list.length} giao dịch ra file Excel có kẻ bảng đẹp!`);
}

// ==========================================================================
// 11. Chuyển đổi Tháng & Điều Hướng
// ==========================================================================
function changeMonth(delta) {
  state.selectedMonth += delta;
  if (state.selectedMonth > 12) {
    state.selectedMonth = 1;
    state.selectedYear += 1;
  } else if (state.selectedMonth < 1) {
    state.selectedMonth = 12;
    state.selectedYear -= 1;
  }

  // Reset category filter khi chuyển tháng
  state.filterCategory = 'all';
  renderAll();
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.setAttribute('hidden', '');
}

// ==========================================================================
// 12. Theme & Dark Mode (F11)
// ==========================================================================
function initTheme() {
  const savedTheme = localStorage.getItem(STORAGE_KEYS.THEME) || 'light';
  document.documentElement.setAttribute('data-theme', savedTheme);

  const toggleBtn = document.getElementById('theme-toggle');
  const mobileSettingsBtn = document.getElementById('bottom-nav-settings');

  function toggleTheme(e) {
    if (e) e.preventDefault();
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem(STORAGE_KEYS.THEME, newTheme);
    showToast(`Đã chuyển sang ${newTheme === 'dark' ? 'Chế độ tối' : 'Chế độ sáng'}`);
  }

  if (toggleBtn) toggleBtn.addEventListener('click', toggleTheme);
  if (mobileSettingsBtn) mobileSettingsBtn.addEventListener('click', toggleTheme);

  // Phím tắt F11
  window.addEventListener('keydown', (e) => {
    if (e.key === 'F11') {
      e.preventDefault();
      toggleTheme();
    }
  });
}

// ==========================================================================
// 13. Gán sự kiện toàn cục (Event Listeners)
// ==========================================================================
function setupEventListeners() {
  // 1. Chuyển tháng
  const btnPrev = document.getElementById('btn-prev-month');
  const btnNext = document.getElementById('btn-next-month');
  if (btnPrev) btnPrev.addEventListener('click', () => changeMonth(-1));
  if (btnNext) btnNext.addEventListener('click', () => changeMonth(1));

  // 2. Mở modal thêm
  const btnOpenAdd = document.getElementById('btn-open-add-modal');
  const btnFabAdd = document.getElementById('btn-fab-add');
  if (btnOpenAdd) btnOpenAdd.addEventListener('click', openAddModal);
  if (btnFabAdd) btnFabAdd.addEventListener('click', openAddModal);

  // 3. Đóng modal thêm/sửa
  const btnCloseTx = document.getElementById('btn-close-tx-modal');
  const btnCancelTx = document.getElementById('btn-cancel-tx');
  if (btnCloseTx) btnCloseTx.addEventListener('click', () => closeModal('modal-tx'));
  if (btnCancelTx) btnCancelTx.addEventListener('click', () => closeModal('modal-tx'));

  // 4. Toggle Thu/Chi trong form
  const btnIncome = document.getElementById('btn-type-income');
  const btnExpense = document.getElementById('btn-type-expense');
  if (btnIncome) btnIncome.addEventListener('click', () => setFormType('income'));
  if (btnExpense) btnExpense.addEventListener('click', () => setFormType('expense'));

  // 5. Submit Form Thêm/Sửa
  const formTx = document.getElementById('tx-form');
  if (formTx) formTx.addEventListener('submit', handleSaveTransaction);

  // 6. Format số tiền khi gõ
  const amountInput = document.getElementById('tx-amount');
  if (amountInput) {
    amountInput.addEventListener('input', () => {
      const num = parseCurrencyInput(amountInput.value);
      amountInput.value = num ? num.toLocaleString('vi-VN') : '';
      const amountWrap = document.getElementById('tx-amount-wrap');
      const amountErr = document.getElementById('tx-amount-error');
      if (num > 0) {
        if (amountWrap) amountWrap.classList.remove('has-error');
        if (amountErr) amountErr.hidden = true;
      }
    });
  }

  // 7. Đếm ký tự ghi chú
  const noteInput = document.getElementById('tx-note');
  if (noteInput) noteInput.addEventListener('input', updateNoteCharCount);

  // 8. Modal Xóa
  const btnCancelDel = document.getElementById('btn-cancel-delete');
  const btnConfirmDel = document.getElementById('btn-confirm-delete');
  if (btnCancelDel) btnCancelDel.addEventListener('click', () => closeModal('modal-delete'));
  if (btnConfirmDel) btnConfirmDel.addEventListener('click', handleConfirmDelete);

  // 9. Modal Ngân sách
  const btnOpenBudget = document.getElementById('btn-open-budget-modal');
  const btnCloseBudget = document.getElementById('btn-close-budget-modal');
  const btnCancelBudget = document.getElementById('btn-cancel-budget');
  const formBudget = document.getElementById('budget-form');
  const budgetInput = document.getElementById('budget-input');

  if (btnOpenBudget) btnOpenBudget.addEventListener('click', openBudgetModal);
  if (btnCloseBudget) btnCloseBudget.addEventListener('click', () => closeModal('modal-budget'));
  if (btnCancelBudget) btnCancelBudget.addEventListener('click', () => closeModal('modal-budget'));
  if (formBudget) formBudget.addEventListener('submit', handleSaveBudget);
  if (budgetInput) {
    budgetInput.addEventListener('input', () => {
      const num = parseCurrencyInput(budgetInput.value);
      budgetInput.value = num ? num.toLocaleString('vi-VN') : '';
    });
  }

  // 10. Đóng modal bằng phím Esc hoặc click ngoài backdrop
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeModal('modal-tx');
      closeModal('modal-delete');
      closeModal('modal-budget');
    }
  });

  ['modal-tx', 'modal-delete', 'modal-budget'].forEach(id => {
    const modal = document.getElementById(id);
    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal(id);
      });
    }
  });

  // 11. Bộ lọc loại giao dịch (Tất cả / Thu / Chi)
  const filterTypeButtons = document.querySelectorAll('.type-filter-btn');
  filterTypeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterTypeButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.filterType = btn.dataset.type || 'all';
      renderTransactionsTable();
    });
  });

  // 12. Bộ lọc danh mục
  const filterCatSelect = document.getElementById('filter-category');
  if (filterCatSelect) {
    filterCatSelect.addEventListener('change', (e) => {
      state.filterCategory = e.target.value;
      renderTransactionsTable();
      renderCategoryStats();
    });
  }

  // 13. Tìm kiếm theo ghi chú realtime (không phân biệt dấu)
  const searchInput = document.getElementById('search-input');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      state.searchQuery = e.target.value;
      renderTransactionsTable();
    });
  }

  // 14. Xuất file có kẻ bảng và định dạng đẹp cho Excel (F12)
  const btnExportCsv = document.getElementById('btn-export-csv');
  if (btnExportCsv) {
    btnExportCsv.addEventListener('click', exportTransactionsToCSV);
  }

  // 15. Điều hướng mượt (Sidebar & Bottom Nav)
  const navLinks = document.querySelectorAll('.nav-item, .bottom-nav-item');
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href && href.startsWith('#')) {
        e.preventDefault();
        navLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');

        if (href === '#transactions') {
          const target = document.querySelector('.transactions-section');
          if (target) target.scrollIntoView({ behavior: 'smooth' });
        } else if (href === '#statistics') {
          const target = document.querySelector('.category-stats-section');
          if (target) target.scrollIntoView({ behavior: 'smooth' });
        } else if (href === '#overview') {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }
    });
  });
}

// ==========================================================================
// 14. Khởi chạy ứng dụng
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  loadDataFromStorage();
  setupEventListeners();
  renderAll();
});
