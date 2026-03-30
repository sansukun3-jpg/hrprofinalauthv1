// ===== DATABASE LAYER (localStorage) =====

const DB = {
  keys: {
    employees: 'hrpro_employees',
    departments: 'hrpro_departments',
    attendance: 'hrpro_attendance',
    salary: 'hrpro_salary',
    leave: 'hrpro_leave',
    ot: 'hrpro_ot',
    allowance: 'hrpro_allowance',
    loan:      'hrpro_loan',
    settings: 'hrpro_settings',
  },

  _get(key) {
    try { return JSON.parse(localStorage.getItem(key)) || []; } catch { return []; }
  },
  _set(key, data) {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (e) {
      if (e.name === 'QuotaExceededError' || e.code === 22 || e.code === 1014) {
        // Storage full — retry employees without photos
        if (key === this.keys.employees) {
          try {
            const slim = data.map(emp => ({...emp, photo: ''}));
            localStorage.setItem(key, JSON.stringify(slim));
          } catch (e2) {}
        }
        throw e; // propagate so saveEmployee can show error
      }
      throw e;
    }
  },
  _genId(prefix) {
    return prefix + Date.now() + Math.random().toString(36).substr(2, 4).toUpperCase();
  },

  // ===== EMPLOYEES =====
  getEmployees() { return this._get(this.keys.employees); },
  getEmployee(id) { return this.getEmployees().find(e => e.id === id); },
  addEmployee(emp) {
    const list = this.getEmployees();
    emp.id = emp.id || this._genId('EMP');
    emp.createdAt = new Date().toISOString();
    list.push(emp);
    this._set(this.keys.employees, list);
    return emp;
  },
  updateEmployee(id, data) {
    const list = this.getEmployees();
    const idx = list.findIndex(e => e.id === id);
    if (idx !== -1) {
      list[idx] = { ...list[idx], ...data, updatedAt: new Date().toISOString() };
      this._set(this.keys.employees, list);
      return list[idx];
    }
    return null;
  },
  deleteEmployee(id) {
    const list = this.getEmployees().filter(e => e.id !== id);
    this._set(this.keys.employees, list);
  },
  searchEmployees(query) {
    const q = query.toLowerCase();
    return this.getEmployees().filter(e =>
      e.name?.toLowerCase().includes(q) ||
      e.id?.toLowerCase().includes(q) ||
      e.position?.toLowerCase().includes(q) ||
      e.department?.toLowerCase().includes(q)
    );
  },

  // ===== DEPARTMENTS =====
  getDepartments() { return this._get(this.keys.departments); },
  getDepartment(id) { return this.getDepartments().find(d => d.id === id); },
  addDepartment(dept) {
    const list = this.getDepartments();
    dept.id = dept.id || this._genId('DEPT');
    dept.createdAt = new Date().toISOString();
    list.push(dept);
    this._set(this.keys.departments, list);
    return dept;
  },
  updateDepartment(id, data) {
    const list = this.getDepartments();
    const idx = list.findIndex(d => d.id === id);
    if (idx !== -1) {
      list[idx] = { ...list[idx], ...data };
      this._set(this.keys.departments, list);
    }
  },
  deleteDepartment(id) {
    this._set(this.keys.departments, this.getDepartments().filter(d => d.id !== id));
  },

  // ===== ATTENDANCE =====
  getAttendance() { return this._get(this.keys.attendance); },
  addAttendance(rec) {
    const list = this.getAttendance();
    rec.id = this._genId('ATT');
    rec.createdAt = new Date().toISOString();
    list.push(rec);
    this._set(this.keys.attendance, list);
    return rec;
  },
  deleteAttendance(id) {
    this._set(this.keys.attendance, this.getAttendance().filter(a => a.id !== id));
  },

  // ===== SALARY =====
  getSalary() { return this._get(this.keys.salary); },
  addSalary(rec) {
    const list = this.getSalary();
    rec.id = this._genId('SAL');
    rec.createdAt = new Date().toISOString();
    list.push(rec);
    this._set(this.keys.salary, list);
    return rec;
  },
  updateSalary(id, data) {
    const list = this.getSalary();
    const idx = list.findIndex(s => s.id === id);
    if (idx !== -1) { list[idx] = { ...list[idx], ...data }; this._set(this.keys.salary, list); }
  },
  deleteSalary(id) {
    this._set(this.keys.salary, this.getSalary().filter(s => s.id !== id));
  },

  // ===== LEAVE =====
  getLeave() { return this._get(this.keys.leave); },
  addLeave(rec) {
    const list = this.getLeave();
    rec.id = this._genId('LVE');
    rec.createdAt = new Date().toISOString();
    list.push(rec);
    this._set(this.keys.leave, list);
    return rec;
  },
  updateLeave(id, data) {
    const list = this.getLeave();
    const idx = list.findIndex(l => l.id === id);
    if (idx !== -1) { list[idx] = { ...list[idx], ...data }; this._set(this.keys.leave, list); }
  },
  deleteLeave(id) {
    this._set(this.keys.leave, this.getLeave().filter(l => l.id !== id));
  },

  // ===== OT =====
  getOT() { return this._get(this.keys.ot); },
  addOT(rec) {
    const list = this.getOT();
    rec.id = this._genId('OT');
    rec.createdAt = new Date().toISOString();
    list.push(rec);
    this._set(this.keys.ot, list);
    return rec;
  },
  updateOT(id, data) {
    const list = this.getOT();
    const idx = list.findIndex(o => o.id === id);
    if (idx !== -1) { list[idx] = { ...list[idx], ...data }; this._set(this.keys.ot, list); }
  },
  deleteOT(id) {
    this._set(this.keys.ot, this.getOT().filter(o => o.id !== id));
  },

  // ===== ALLOWANCE =====
  getAllowance()  { return this._get(this.keys.allowance); },
  addAllowance(rec) {
    const list = this.getAllowance();
    rec.id = this._genId('ALW'); rec.createdAt = new Date().toISOString();
    list.push(rec); this._set(this.keys.allowance, list); return rec;
  },
  updateAllowance(id, data) {
    const list = this.getAllowance(), idx = list.findIndex(a => a.id === id);
    if (idx !== -1) { list[idx] = { ...list[idx], ...data }; this._set(this.keys.allowance, list); }
  },
  deleteAllowance(id) { this._set(this.keys.allowance, this.getAllowance().filter(a => a.id !== id)); },

  // ===== SETTINGS =====
  getSettings() {
    try { return JSON.parse(localStorage.getItem(this.keys.settings)) || {}; } catch { return {}; }
  },
  saveSettings(data) {
    const cur = this.getSettings();
    const merged = { ...cur, ...data };
    localStorage.setItem(this.keys.settings, JSON.stringify(merged));
    return merged;
  },

  // ===== LOAN =====
  getLoan() { return this._get(this.keys.loan); },
  getLoanById(id) { return this.getLoan().find(l => l.id === id); },
  addLoan(rec) {
    const list = this.getLoan();
    rec.id = this._genId('LN'); rec.createdAt = new Date().toISOString();
    rec.paidMonths = rec.paidMonths || [];
    list.push(rec); this._set(this.keys.loan, list); return rec;
  },
  updateLoan(id, data) {
    const list = this.getLoan(), idx = list.findIndex(l => l.id === id);
    if (idx !== -1) { list[idx] = { ...list[idx], ...data }; this._set(this.keys.loan, list); }
  },
  deleteLoan(id) { this._set(this.keys.loan, this.getLoan().filter(l => l.id !== id)); },
  markLoanMonthPaid(loanId, ym) {
    const list = this.getLoan(), idx = list.findIndex(l => l.id === loanId);
    if (idx < 0) return;
    if (!list[idx].paidMonths) list[idx].paidMonths = [];
    if (!list[idx].paidMonths.includes(ym)) list[idx].paidMonths.push(ym);
    const paid = list[idx].paidMonths.length, total = parseInt(list[idx].months || 0);
    if (paid >= total) list[idx].status = 'completed';
    this._set(this.keys.loan, list);
  },
  unmarkLoanMonthPaid(loanId, ym) {
    const list = this.getLoan(), idx = list.findIndex(l => l.id === loanId);
    if (idx < 0) return;
    list[idx].paidMonths = (list[idx].paidMonths || []).filter(m => m !== ym);
    if (list[idx].status === 'completed') list[idx].status = 'active';
    this._set(this.keys.loan, list);
  },


  // ===== SEED DATA =====
  seed() {
    if (this.getDepartments().length > 0) return;
    const depts = [
      { id: 'DEPT001', name: 'ធនធានមនុស្ស', head: 'លោក ចន្ទ្រា សុភា', color: '#4F46E5', icon: '👥', desc: 'គ្រប់គ្រងបុគ្គលិក' },
      { id: 'DEPT002', name: 'បច្ចេកទេស', head: 'លោក វិចិត្រ ដារ៉ា', color: '#059669', icon: '💻', desc: 'ក្រុមបច្ចេកទេស IT' },
      { id: 'DEPT003', name: 'ហិរញ្ញវត្ថុ', head: 'លោកស្រី ស្រីនិច ចន្ទ្រា', color: '#D97706', icon: '💰', desc: 'គ្រប់គ្រងហិរញ្ញវត្ថុ' },
      { id: 'DEPT004', name: 'ទីផ្សារ', head: 'លោក វង្ស នរា', color: '#DC2626', icon: '📢', desc: 'ផ្នែកទីផ្សារ' },
      { id: 'DEPT005', name: 'ប្រតិបត្តិការ', head: 'លោកស្រី ម៉ៅ ស្រីនាត', color: '#7C3AED', icon: '⚙️', desc: 'ការប្រតិបត្តិការ' },
    ];
    depts.forEach(d => { d.createdAt = new Date().toISOString(); });
    this._set(this.keys.departments, depts);

    const employees = [
      { id:'EMP001', name:'លោក ចន្ទ្រា សុភា', gender:'male', dob:'1985-03-15', phone:'012345678', email:'sophea@hr.com', department:'ធនធានមនុស្ស', position:'ប្រធានផ្នែកHR', salary:1500000, startDate:'2019-01-10', status:'active', address:'ភ្នំពេញ', photo:'', notes:'' },
      { id:'EMP002', name:'លោកស្រី ស្រីនិច ចន្ទ្រា', gender:'female', dob:'1990-07-22', phone:'098765432', email:'chanda@hr.com', department:'ហិរញ្ញវត្ថុ', position:'គណនេយ្យករ', salary:1200000, startDate:'2020-05-01', status:'active', address:'ភ្នំពេញ', photo:'', notes:'' },
      { id:'EMP003', name:'លោក វិចិត្រ ដារ៉ា', gender:'male', dob:'1992-11-08', phone:'011234567', email:'dara@hr.com', department:'បច្ចេកទេស', position:'អ្នកអភិវឌ្ឍន៍', salary:1800000, startDate:'2021-03-15', status:'active', address:'សៀមរាប', photo:'', notes:'' },
      { id:'EMP004', name:'លោក វង្ស នរា', gender:'male', dob:'1988-06-30', phone:'077654321', email:'nara@hr.com', department:'ទីផ្សារ', position:'អ្នកទីផ្សារ', salary:1100000, startDate:'2018-08-20', status:'active', address:'ភ្នំពេញ', photo:'', notes:'' },
      { id:'EMP005', name:'លោកស្រី ម៉ៅ ស្រីនាត', gender:'female', dob:'1995-02-14', phone:'096789012', email:'sreynat@hr.com', department:'ប្រតិបត្តិការ', position:'ប្រធានប្រតិបត្តិការ', salary:1400000, startDate:'2022-01-05', status:'active', address:'កំពង់ចាម', photo:'', notes:'' },
      { id:'EMP006', name:'លោក ហេង វណ្ណារ', gender:'male', dob:'1993-09-17', phone:'069123456', email:'vannara@hr.com', department:'បច្ចេកទេស', position:'អ្នករចនា UI/UX', salary:1600000, startDate:'2021-07-12', status:'leave', address:'ភ្នំពេញ', photo:'', notes:'ឈប់សម្រាកមាតុភាព' },
    ];
    employees.forEach(e => { e.createdAt = new Date().toISOString(); });
    this._set(this.keys.employees, employees);
  },

  exportAll() {
    return {
      employees:   this.getEmployees(),
      departments: this.getDepartments(),
      attendance:  this.getAttendance(),
      salary:      this.getSalary(),
      leave:       this.getLeave(),
      ot:          this.getOT(),
      allowance:   this.getAllowance(),
      loan:        this.getLoan(),
      exportedAt:  new Date().toISOString()
    };
  },
  importAll(data) {
    if (data.employees)   this._set(this.keys.employees,   data.employees);
    if (data.departments) this._set(this.keys.departments, data.departments);
    if (data.attendance)  this._set(this.keys.attendance,  data.attendance);
    if (data.salary)      this._set(this.keys.salary,      data.salary);
    if (data.leave)       this._set(this.keys.leave,       data.leave);
    if (data.ot)          this._set(this.keys.ot,          data.ot);
    if (data.allowance)   this._set(this.keys.allowance,   data.allowance);
    if (data.loan)        this._set(this.keys.loan,        data.loan);
  },
  clearAll() {
    Object.values(this.keys).forEach(k => localStorage.removeItem(k));
  },
};
// ===== APP.JS - Main Application Logic =====

let currentPage = 'dashboard';
let editingEmployeeId = null;
let editingDeptId = null;
let currentPhotoData = '';
let currentBankImgData = '';

const PAGE_TITLES = {
  dashboard:'ផ្ទាំងគ្រប់គ្រង', employees:'បញ្ជីបុគ្គលិក', departments:'នាយកដ្ឋាន',
  attendance:'ការគ្រប់គ្រងវត្តមាន', salary:'គ្រប់គ្រងប្រាក់ខែ', leave:'ច្បាប់ឈប់សម្រាក',
  ot:'គ្រប់គ្រងម៉ោងថែម (OT)', allowance:'ប្រាក់ឧបត្ថម្ភ', loan:'ប្រាក់ខ្ចីបុគ្គលិក',
  reports:'របាយការណ៍', idcards:'កាតសម្គាល់ខ្លួនបុគ្គលិក',
  'rpt-salary':'របាយការណ៍ប្រាក់ខែ', 'payroll':'Payroll — របាយការណ៍ប្រាក់ខែបុគ្គលិក', 'rpt-leave':'របាយការណ៍ច្បាប់ឈប់សម្រាក',
  'rpt-ot':'របាយការណ៍ម៉ោងថែម OT', settings:'ការកំណត់ប្រព័ន្ធ', expenses:'ការចំណាយទូទៅ',
};

// ===== INIT handled by initLogin() / bootApp() above =====

function toggleTheme() {
  const html = document.documentElement;
  const current = html.getAttribute('data-theme') || 'light';
  const next = current === 'dark' ? 'light' : 'dark';
  html.setAttribute('data-theme', next);
  localStorage.setItem('hrpro_theme', next);
}

function updateClock() {
  const now = new Date();
  document.getElementById('topbar-date').textContent =
    now.toLocaleDateString('km-KH', { weekday:'short', year:'numeric', month:'short', day:'numeric' }) +
    ' ' + now.toLocaleTimeString('km-KH');
}

// ===== NAVIGATION =====
function navigate(page) {
  currentPage = page;
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  document.getElementById('page-' + page).classList.add('active');
  document.querySelector(`[data-page="${page}"]`).classList.add('active');
  document.getElementById('topbar-title').textContent = PAGE_TITLES[page] || page;
  renderPage(page);
  // Close sidebar on mobile
  if (window.innerWidth < 768) document.getElementById('sidebar').classList.remove('open');
}

function renderPage(page) {
  if (page === 'dashboard') renderDashboard();
  else if (page === 'employees') { populateDeptFilter(); renderEmployees(); }
  else if (page === 'departments') renderDepartments();
  else if (page === 'attendance') { populateAttEmpFilter(); renderAttendance(); }
  else if (page === 'salary') { populateSalaryFilters(); renderSalary(); }
  else if (page === 'leave') renderLeave();
  else if (page === 'ot') { populateOTFilters(); renderOT(); }
  else if (page === 'allowance') { populateAlwFilters(); renderAllowance(); }
  else if (page === 'loan') { populateLoanFilters(); renderLoan(); }
  else if (page === 'reports') renderReports();
  else if (page === 'idcards') { populateIdcDeptFilter(); renderIdCards(); }
  else if (page === 'rpt-salary') renderSalaryReport();
  else if (page === 'payroll') renderPayroll();
  else if (page === 'rpt-leave') renderLeaveReport();
  else if (page === 'rpt-ot') renderOTReport();
  else if (page === 'settings') { setTimeout(renderUserList, 30); loadBrandingForm(); renderLicenseSettingsCard(); loadSecurityCodeSettings(); }
  else if (page === 'expenses') { populateExpFilters(); renderExpenses(); }
  else if (page === 'rpt-expenses') { initExpReport(); }
}

function toggleSidebar() {
  document.getElementById('sidebar').classList.toggle('open');
}

// ===== DASHBOARD =====
function renderDashboard() {
  const emps  = DB.getEmployees();
  const depts = DB.getDepartments();
  const leave = DB.getLeave();
  const att   = DB.getAttendance();
  const sal   = DB.getSalary();
  const today = new Date().toISOString().split('T')[0];
  const now   = new Date();

  // Badge
  const pendingLeave = leave.filter(l => l.status === 'pending').length;
  document.getElementById('notif-badge').textContent = pendingLeave;

  // ── Welcome banner ─────────────────────────────────────────────
  const hour = now.getHours();
  const greet = hour < 12 ? 'អរុណសួស្តី ☀️' : hour < 18 ? 'ទិវាសួស្តី 🌤️' : 'សាយណ្ហសួស្តី 🌙';
  document.getElementById('dash-greeting').textContent = greet;
  document.getElementById('dash-today-str').textContent =
    now.toLocaleDateString('km-KH', { weekday:'long', year:'numeric', month:'long', day:'numeric' });

  // ── KPI cards ──────────────────────────────────────────────────
  const todayAtt     = att.filter(a => a.date === today);
  const activeEmps   = emps.filter(e => e.status === 'active').length;
  const attPresent   = todayAtt.filter(a => a.status === 'present').length;
  const attAbsent    = todayAtt.filter(a => a.status === 'absent').length;
  const salPaid      = sal.filter(s => s.status === 'paid');
  const totalPayroll = salPaid.reduce((s,r) => s + parseFloat(r.base||0)+parseFloat(r.bonus||0)-parseFloat(r.deduction||0), 0);
  const onLeaveToday = emps.filter(e => e.status === 'leave').length;
  const attRate      = emps.length ? Math.round(attPresent / Math.max(emps.length,1) * 100) : 0;

  const kpis = [
    {
      icon: 'fas fa-users', label: 'បុគ្គលិកសរុប', val: emps.length,
      sub: `<span class="up">▲ ${activeEmps} កំពុងធ្វើការ</span>`,
      bar: Math.round(activeEmps/Math.max(emps.length,1)*100),
      color: '#3B5BDB', page: 'employees',
      badge: `${emps.filter(e=>e.status==='inactive').length} ឈប់`, badgeBg: '#FEF2F2', badgeC: '#DC2626'
    },
    {
      icon: 'fas fa-building', label: 'នាយកដ្ឋាន', val: depts.length,
      sub: `${emps.length} នាក់ ក្នុង ${depts.length} នាយកដ្ឋាន`,
      bar: 100, color: '#059669', page: 'departments',
      badge: '', badgeBg: '', badgeC: ''
    },
    {
      icon: 'fas fa-calendar-check', label: 'វត្តមានថ្ងៃនេះ', val: attPresent,
      sub: `<span class="${attAbsent>0?'down':'up'}">${attAbsent>0?'▼':'▲'} ${attAbsent} អវត្តមាន</span>`,
      bar: attRate, color: '#0284C7', page: 'attendance',
      badge: attRate+'%', badgeBg: attRate>=80?'#DCFCE7':'#FEF2F2', badgeC: attRate>=80?'#15803D':'#DC2626'
    },
    {
      icon: 'fas fa-calendar-minus', label: 'ច្បាប់ឈប់', val: pendingLeave,
      sub: `${leave.filter(l=>l.status==='approved').length} បានអនុម័ត`,
      bar: leave.length ? Math.round(pendingLeave/leave.length*100) : 0,
      color: '#D97706', page: 'leave',
      badge: pendingLeave>0?'រង់ចាំ':'', badgeBg: '#FFF7ED', badgeC: '#C2410C'
    },
    {
      icon: 'fas fa-money-bill-wave', label: 'ប្រាក់ខែបានបើក', val: salPaid.length,
      sub: `${sal.filter(s=>s.status==='pending').length} ករណីរង់ចាំ`,
      bar: sal.length ? Math.round(salPaid.length/sal.length*100) : 0,
      color: '#7C3AED', page: 'rpt-salary',
      badge: '', badgeBg: '', badgeC: ''
    },
    {
      icon: 'fas fa-user-clock', label: 'នៅឈប់សម្រាក', val: onLeaveToday,
      sub: `${emps.filter(e=>e.status==='active').length} នៅការ`,
      bar: emps.length ? Math.round(onLeaveToday/emps.length*100) : 0,
      color: '#DC2626', page: 'employees',
      badge: '', badgeBg: '', badgeC: ''
    },
  ];

  document.getElementById('dash-kpi-grid').innerHTML = kpis.map(k => `
    <div class="dash-kpi" onclick="navigate('${k.page}')" style="border-top:3px solid ${k.color};">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:2px;">
        <div class="dash-kpi-icon" style="background:linear-gradient(135deg,${k.color},${k.color}bb);">
          <i class="${k.icon}"></i>
        </div>
        ${k.badge ? `<span class="dash-kpi-badge" style="background:${k.badgeBg};color:${k.badgeC};">${k.badge}</span>` : ''}
      </div>
      <div class="dash-kpi-val" style="color:${k.color};">${k.val}</div>
      <div class="dash-kpi-label">${k.label}</div>
      <div class="dash-kpi-bar-wrap"><div class="dash-kpi-bar" style="width:${k.bar}%;background:${k.color};"></div></div>
      <div class="dash-kpi-footer">${k.sub}</div>
    </div>
  `).join('');

  // ── Attendance donut ─────────────────────────────────────────────
  const attCounts = {
    present: todayAtt.filter(a=>a.status==='present').length,
    absent:  todayAtt.filter(a=>a.status==='absent').length,
    late:    todayAtt.filter(a=>a.status==='late').length,
    half:    todayAtt.filter(a=>a.status==='half').length,
  };
  const attTotal = Object.values(attCounts).reduce((a,b)=>a+b,0) || 1;
  const attColors = { present:'#10B981', absent:'#EF4444', late:'#F59E0B', half:'#3B82F6' };
  const attLabelsKH = { present:'មានវត្តមាន', absent:'អវត្តមាន', late:'យឺត', half:'កន្លះថ្ងៃ' };

  // Create/reuse canvas
  let canvas = document.getElementById('dash-att-donut');
  if (!canvas) {
    canvas = document.createElement('canvas');
    canvas.id = 'dash-att-donut';
    canvas.width = 120; canvas.height = 120;
    canvas.style.flexShrink = '0';
  }
  const legendDiv = document.createElement('div');
  legendDiv.style.cssText = 'flex:1;display:flex;flex-direction:column;gap:6px;min-width:0;';
  legendDiv.innerHTML = Object.entries(attCounts).map(([k,v]) => `
    <div style="display:flex;align-items:center;gap:6px;">
      <div style="width:8px;height:8px;border-radius:2px;background:${attColors[k]};flex-shrink:0;"></div>
      <span style="font-size:11px;color:var(--text-muted);flex:1;">${attLabelsKH[k]}</span>
      <span style="font-size:12px;font-weight:700;color:var(--text);">${v}</span>
    </div>`).join('');

  const attContent = document.getElementById('dash-att-content');
  attContent.innerHTML = '';
  attContent.appendChild(canvas);
  attContent.appendChild(legendDiv);

  // Draw donut
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0,0,120,120);
  let startA = -Math.PI/2;
  Object.entries(attCounts).forEach(([k,v]) => {
    if (!v) return;
    const slice = v/attTotal*Math.PI*2;
    ctx.beginPath(); ctx.moveTo(60,60);
    ctx.arc(60,60,52,startA,startA+slice);
    ctx.closePath(); ctx.fillStyle=attColors[k]; ctx.fill();
    startA += slice;
  });
  ctx.beginPath(); ctx.arc(60,60,33,0,Math.PI*2);
  ctx.fillStyle='#fff'; ctx.fill();
  ctx.textAlign='center'; ctx.fillStyle='#1A1F36';
  ctx.font='bold 16px Arial'; ctx.fillText(attPresent,60,58);
  ctx.font='9px Arial'; ctx.fillStyle='#5A6480'; ctx.fillText('វត្តមាន',60,70);

  // Empty state if no attendance today
  if (!todayAtt.length) {
    attContent.innerHTML = `<div class="empty-state" style="padding:20px;width:100%;">
      <i class="fas fa-calendar-times" style="font-size:28px;color:var(--border);display:block;margin-bottom:8px;"></i>
      <p>មិនទាន់មានការកត់វត្តមានថ្ងៃនេះ</p>
    </div>`;
  }

  // ── Dept breakdown ────────────────────────────────────────────────
  const deptMax = Math.max(...depts.map(d => emps.filter(e=>e.department===d.name).length), 1);
  document.getElementById('dash-dept-content').innerHTML = depts.map(d => {
    const cnt = emps.filter(e => e.department===d.name).length;
    const pct = Math.round(cnt/deptMax*100);
    return `
      <div>
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:3px;">
          <span style="font-size:12px;font-weight:600;color:var(--text);">${d.icon} ${d.name}</span>
          <span style="font-size:11px;font-weight:700;color:${d.color};">${cnt} នាក់</span>
        </div>
        <div style="height:7px;background:var(--border);border-radius:4px;overflow:hidden;">
          <div style="width:${pct}%;height:100%;background:${d.color};border-radius:4px;transition:width .6s ease;"></div>
        </div>
      </div>`;
  }).join('') || '<div class="empty-state">មិនមាននាយកដ្ឋាន</div>';

  // ── Salary overview ──────────────────────────────────────────────
  const monthsSal = [...new Set(sal.map(s=>s.month))].sort().reverse().slice(0,3);
  document.getElementById('dash-sal-content').innerHTML = monthsSal.length ? `
    <div class="dash-sal-row">
      ${monthsSal.map(m => {
        const mr = sal.filter(s=>s.month===m);
        const net = mr.reduce((s,r)=>s+parseFloat(r.base||0)+parseFloat(r.bonus||0)-parseFloat(r.deduction||0),0);
        const paid = mr.filter(r=>r.status==='paid').length;
        return `<div class="dash-sal-item">
          <div>
            <div style="font-size:13px;font-weight:700;color:var(--text);">${m}</div>
            <div style="font-size:11px;color:var(--text-muted);">${paid}/${mr.length} ករណី</div>
          </div>
          <div style="text-align:right;">
            <div style="font-size:13px;font-weight:700;color:#059669;">${formatMoney(Math.round(net))}</div>
            <div style="font-size:10px;padding:1px 7px;border-radius:8px;background:${paid===mr.length?'#DCFCE7':'#FFF7ED'};color:${paid===mr.length?'#15803D':'#C2410C'};font-weight:600;">
              ${paid===mr.length?'✓ រួច':'⏳ មួយចំណែក'}
            </div>
          </div>
        </div>`;
      }).join('')}
    </div>
    <button onclick="navigate('rpt-salary')" style="width:100%;margin-top:12px;padding:9px;border-radius:8px;border:1.5px solid var(--border);background:var(--bg);font-family:var(--font);font-size:12px;font-weight:600;color:var(--primary);cursor:pointer;">
      <i class="fas fa-arrow-right"></i> មើលរបាយការណ៍ប្រាក់ខែ
    </button>` :
    `<div class="empty-state" style="padding:24px;"><i class="fas fa-money-bill-wave" style="font-size:28px;color:var(--border);display:block;margin-bottom:8px;"></i><p>មិនទាន់មានទិន្នន័យប្រាក់ខែ</p></div>`;

  // ── Recent employees ─────────────────────────────────────────────
  const recent = [...emps].sort((a,b) => new Date(b.createdAt)-new Date(a.createdAt)).slice(0,6);
  document.getElementById('recent-employees').innerHTML = recent.length ? recent.map(e => {
    const dept = depts.find(d => d.name === e.department) || {};
    return `
    <div class="recent-row" onclick="viewEmployee('${e.id}')">
      <div class="rec-avatar" style="background:linear-gradient(135deg,${dept.color||'var(--primary)'},${dept.color||'#7C3AED'}bb);">
        ${e.photo ? `<img src="${e.photo}" alt="${e.name}"/>` : getInitials(e.name)}
      </div>
      <div class="rec-info">
        <div class="rec-name">${e.name}</div>
        <div class="rec-sub">${e.position} · <span style="color:${dept.color||'var(--primary)'};">${e.department}</span></div>
      </div>
      <span class="status-badge ${e.status}">${statusLabel(e.status)}</span>
    </div>`;
  }).join('') : '<div class="empty-state" style="padding:20px;">មិនមានបុគ្គលិក</div>';

  // ── Leave pending ────────────────────────────────────────────────
  const pendingLeaveList = leave.filter(l => l.status === 'pending').slice(0,5);
  document.getElementById('dash-leave-pending').innerHTML = pendingLeaveList.length ?
    pendingLeaveList.map(l => {
      const emp = emps.find(e => e.id === l.empId);
      const days = l.startDate&&l.endDate ? Math.ceil((new Date(l.endDate)-new Date(l.startDate))/864e5)+1 : 0;
      return `
      <div class="dash-leave-row" onclick="navigate('leave')">
        <div class="rec-avatar" style="width:34px;height:34px;font-size:12px;background:linear-gradient(135deg,#D97706,#F59E0B);">
          ${emp?.photo ? `<img src="${emp.photo}"/>` : getInitials(emp?.name||'?')}
        </div>
        <div class="rec-info">
          <div class="rec-name" style="font-size:12px;">${emp?.name||l.empId}</div>
          <div class="rec-sub">${leaveTypeLabel(l.type)} · ${days||'?'} ថ្ងៃ</div>
        </div>
        <span style="font-size:10px;background:#FFF7ED;color:#C2410C;padding:2px 8px;border-radius:8px;font-weight:700;flex-shrink:0;">រង់ចាំ</span>
      </div>`;
    }).join('') + `
    <button onclick="navigate('leave')" style="width:100%;margin-top:10px;padding:9px;border-radius:8px;border:1.5px solid var(--border);background:var(--bg);font-family:var(--font);font-size:12px;font-weight:600;color:#D97706;cursor:pointer;">
      <i class="fas fa-arrow-right"></i> អនុម័ត / បដិសេធ
    </button>` :
    `<div class="empty-state" style="padding:24px;text-align:center;">
      <i class="fas fa-check-circle" style="font-size:28px;color:#10B981;display:block;margin-bottom:8px;"></i>
      <p style="color:#10B981;font-weight:600;">គ្មានច្បាប់ឈប់រង់ចាំ</p>
    </div>`;
}

// ===== EMPLOYEES =====
function renderEmployees() {
  const allEmps = DB.getEmployees();
  const depts   = DB.getDepartments();
  const att     = DB.getAttendance();
  let   emps    = getFilteredEmployees();
  const isGrid  = document.getElementById('btn-view-grid')?.classList.contains('active') !== false;
  const viewMode= document.getElementById('btn-view-table')?.classList.contains('active') ? 'table' : 'grid';

  // ── KPI Row ────────────────────────────────────────────────────
  const kpiRow = document.getElementById('emp-kpi-row');
  if (kpiRow) {
    const active   = allEmps.filter(e=>e.status==='active').length;
    const inactive = allEmps.filter(e=>e.status==='inactive').length;
    const onLeave  = allEmps.filter(e=>e.status==='leave').length;
    const male     = allEmps.filter(e=>e.gender==='male').length;
    const female   = allEmps.filter(e=>e.gender==='female').length;
    const deptCount= depts.length;
    const kpis = [
      { num:allEmps.length, lbl:'សរុប',        icon:'fas fa-users',        color:'#3B5BDB', g:'linear-gradient(135deg,#3B5BDB,#4F46E5)' },
      { num:active,         lbl:'ធ្វើការ',      icon:'fas fa-check-circle', color:'#059669', g:'linear-gradient(135deg,#059669,#10B981)' },
      { num:onLeave,        lbl:'ឈប់សម្រាក',  icon:'fas fa-calendar',     color:'#D97706', g:'linear-gradient(135deg,#D97706,#F59E0B)' },
      { num:inactive,       lbl:'បានឈប់',      icon:'fas fa-user-times',   color:'#DC2626', g:'linear-gradient(135deg,#DC2626,#EF4444)' },
      { num:male,           lbl:'ប្រុស',        icon:'fas fa-mars',         color:'#2563EB', g:'linear-gradient(135deg,#2563EB,#3B82F6)' },
      { num:female,         lbl:'ស្រី',          icon:'fas fa-venus',        color:'#DB2777', g:'linear-gradient(135deg,#DB2777,#EC4899)' },
      { num:deptCount,      lbl:'នាយកដ្ឋាន',  icon:'fas fa-sitemap',      color:'#7C3AED', g:'linear-gradient(135deg,#7C3AED,#8B5CF6)' },
    ];
    kpiRow.innerHTML = kpis.map(k=>`
      <div class="emp-kpi-card" style="--kpi-color:${k.color};" onclick="filterEmployees()">
        <div class="emp-kpi-icon" style="background:${k.g};"><i class="${k.icon}"></i></div>
        <div>
          <div class="emp-kpi-num" style="color:${k.color};">${k.num}</div>
          <div class="emp-kpi-lbl">${k.lbl}</div>
        </div>
      </div>`).join('');
  }

  // ── Count bar ──────────────────────────────────────────────────
  const cntEl = document.getElementById('emp-count');
  if (cntEl) cntEl.innerHTML = emps.length < allEmps.length
    ? `<strong style="color:var(--primary);">${emps.length}</strong> / ${allEmps.length} នាក់ (ត្រង)`
    : `<strong>${allEmps.length}</strong> នាក់ · <span style="color:#059669;">${allEmps.filter(e=>e.status==='active').length} ធ្វើការ</span> · <span style="color:#D97706;">${allEmps.filter(e=>e.status==='leave').length} ឈប់</span>`;

  // ── Search clear button ────────────────────────────────────────
  const sq = document.getElementById('emp-search')?.value || '';
  const clr = document.getElementById('emp-search-clear');
  if (clr) clr.style.display = sq ? 'block' : 'none';

  const container = document.getElementById('employees-container');
  if (!container) return;

  if (!emps.length) {
    container.innerHTML = `
      <div style="background:var(--surface);border-radius:var(--radius-lg);border:1.5px solid var(--border);padding:64px 24px;text-align:center;box-shadow:var(--shadow);">
        <div style="width:80px;height:80px;border-radius:50%;background:var(--primary-light);display:flex;align-items:center;justify-content:center;margin:0 auto 18px;font-size:32px;color:var(--primary);"><i class="fas fa-search"></i></div>
        <p style="font-size:16px;font-weight:700;color:var(--text-muted);margin-bottom:6px;">រកមិនឃើញបុគ្គលិក</p>
        <p style="font-size:13px;color:var(--text-light);margin-bottom:18px;">សូមពិនិត្យ filter ឬ ស្វែងរកឡើងវិញ</p>
        <button class="btn-secondary" onclick="resetEmpFilters()"><i class="fas fa-rotate-left"></i> Reset Filter</button>
        <button class="btn-primary" onclick="openModal('add')" style="margin-left:8px;"><i class="fas fa-user-plus"></i> បន្ថែមបុគ្គលិក</button>
      </div>`;
    return;
  }

  if (viewMode === 'table') {
    renderEmpTable(emps, depts, att, allEmps);
  } else {
    renderEmpGrid(emps, depts, att);
  }
}

function renderEmpGrid(emps, depts, att) {
  const container = document.getElementById('employees-container');
  container.innerHTML = `<div class="emp-grid-v2">${emps.map(e => empCardV2(e, depts, att)).join('')}</div>`;
}

function empCardV2(e, depts, att) {
  const dept    = depts.find(d => d.name === e.department) || {};
  const color   = dept.color || '#3B5BDB';
  const eAtt    = att.filter(a => a.empId === e.id);
  const rate    = eAtt.length ? Math.round(eAtt.filter(a => a.status === 'present').length / eAtt.length * 100) : null;
  const tenure  = e.startDate ? Math.floor((new Date() - new Date(e.startDate)) / (365.25 * 86400000)) : null;
  const salary  = e.salary ? formatMoney(e.salary) : '—';
  const genderIcon = e.gender === 'male' ? '♂' : e.gender === 'female' ? '♀' : '';
  const genderColor= e.gender === 'male' ? '#2563EB' : '#DB2777';

  const rateColor = rate === null ? '' : rate >= 80 ? '#059669' : rate >= 60 ? '#D97706' : '#DC2626';
  const rateGrad  = rate === null ? '' : rate >= 80
    ? 'linear-gradient(90deg,#10B981,#059669)'
    : rate >= 60 ? 'linear-gradient(90deg,#F59E0B,#D97706)'
    : 'linear-gradient(90deg,#EF4444,#DC2626)';

  return `
<div class="emp-card-v2" onclick="viewEmployee('${e.id}')">

  <!-- Coloured banner -->
  <div class="emp-card-banner" style="background:linear-gradient(135deg,${color}ee 0%,${color}88 100%);">
    <div class="emp-card-banner-bg" style="background:${color};"></div>

    <!-- Avatar -->
    <div class="emp-card-avatar-wrap">
      <div class="emp-card-avatar-v2" style="background:linear-gradient(135deg,${color},${color}99);">
        ${e.photo ? `<img src="${e.photo}" alt="${e.name}"/>` : `<span>${getInitials(e.name)}</span>`}
      </div>
    </div>

    <!-- Status badge -->
    <div class="emp-card-status-wrap">
      <span class="status-badge ${e.status}" style="font-size:9.5px;padding:3px 9px;">${statusLabel(e.status)}</span>
    </div>
  </div>

  <!-- Body -->
  <div class="emp-card-body-v2">
    <div class="emp-card-name-v2">${e.name}</div>
    <div class="emp-card-pos-v2" style="color:${color};">${e.position || '—'}</div>

    <div class="emp-card-meta-v2">
      <!-- Dept pill -->
      <div class="emp-meta-row">
        <i class="fas fa-sitemap" style="color:${color};"></i>
        <span style="background:${color}18;color:${color};padding:2px 9px;border-radius:20px;font-weight:700;font-size:11px;">${e.department || '—'}</span>
      </div>
      <!-- ID -->
      <div class="emp-meta-row">
        <i class="fas fa-id-badge"></i>
        <span style="font-family:monospace;font-size:11px;background:var(--bg);padding:1px 7px;border-radius:5px;letter-spacing:.5px;">${e.id}</span>
        ${genderIcon ? `<span style="margin-left:2px;color:${genderColor};font-weight:800;font-size:12px;">${genderIcon}</span>` : ''}
      </div>
      <!-- Phone -->
      ${e.phone ? `<div class="emp-meta-row"><i class="fas fa-phone-alt"></i><span>${e.phone}</span></div>` : ''}
      <!-- Salary -->
      <div class="emp-meta-row">
        <i class="fas fa-dollar-sign" style="color:#059669;"></i>
        <span style="font-weight:800;color:var(--text);font-size:13px;">${salary}</span>
        ${tenure !== null ? `<span style="margin-left:auto;font-size:10px;background:var(--bg);padding:1px 7px;border-radius:10px;color:var(--text-muted);">${tenure > 0 ? tenure + 'ឆ្នាំ' : '<1ឆ្នាំ'}</span>` : ''}
      </div>
      <!-- Bank -->
      ${e.bank ? '<div class="emp-meta-row" style="cursor:pointer;" onclick="event.stopPropagation();' + (e.bankImage ? 'showBankImgModal(\'' + e.id + '\')' : '') + '">' +
        '<i class="fas fa-university" style="color:#7C3AED;"></i>' +
        '<span style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:140px;">' + e.bank + '</span>' +
        (e.bankImage ? '<span title="មានរូបភាព" style="margin-left:auto;background:#f5f3ff;color:#7C3AED;border-radius:20px;padding:1px 7px;font-size:10px;font-weight:700;flex-shrink:0;"><i class="fas fa-image"></i> រូប</span>' : '') +
        '</div>' : ''}
    </div>

    <!-- Attendance bar -->
    ${rate !== null ? `
    <div class="emp-att-bar-wrap" style="margin-top:10px;padding-top:10px;border-top:1px solid var(--border);">
      <div class="emp-att-bar-label">
        <span style="display:flex;align-items:center;gap:4px;"><i class="fas fa-calendar-check" style="font-size:10px;color:${rateColor};"></i> វត្តមាន</span>
        <span style="font-weight:800;color:${rateColor};">${rate}%</span>
      </div>
      <div class="emp-att-bar-track">
        <div class="emp-att-bar-fill" style="width:${rate}%;background:${rateGrad};"></div>
      </div>
    </div>` : ''}
  </div>

  <!-- Footer -->
  <div class="emp-card-footer-v2" onclick="event.stopPropagation()">
    <button class="emp-card-action" onclick="viewEmployee('${e.id}')">
      <i class="fas fa-eye"></i> មើល
    </button>
    <button class="emp-card-action edit" onclick="openModal('edit','${e.id}')">
      <i class="fas fa-pen"></i> កែ
    </button>
    <button class="emp-card-action del" onclick="confirmDelete('employee','${e.id}')" title="លុប">
      <i class="fas fa-trash"></i>
    </button>
  </div>
</div>`;
}


function renderEmpTable(emps, depts, att, allEmps) {
  const container = document.getElementById('employees-container');

  const rows = emps.map((e, idx) => {
    const dept   = depts.find(d => d.name === e.department) || {};
    const color  = dept.color || '#3B5BDB';
    const eAtt   = att.filter(a => a.empId === e.id);
    const rate   = eAtt.length ? Math.round(eAtt.filter(a => a.status === 'present').length / eAtt.length * 100) : null;
    const rateColor = rate === null ? 'var(--text-muted)' : rate >= 80 ? '#059669' : rate >= 60 ? '#D97706' : '#DC2626';
    const cls    = e.status === 'inactive' ? 'inactive' : e.status === 'leave' ? 'on-leave' : '';
    const gender = e.gender === 'male' ? '<span style="color:#2563EB;font-weight:800;">♂</span>' : e.gender === 'female' ? '<span style="color:#DB2777;font-weight:800;">♀</span>' : '—';

    return `
<div class="emp-row-v2 ${cls}" onclick="viewEmployee('${e.id}')">
  <!-- # -->
  <div>
    <span class="emp-row-num">${String(idx + 1).padStart(2, '0')}</span>
  </div>

  <!-- Name + ID -->
  <div style="gap:10px;">
    <div style="width:40px;height:40px;border-radius:50%;background:linear-gradient(135deg,${color},${color}88);display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:800;color:#fff;overflow:hidden;flex-shrink:0;box-shadow:0 2px 8px ${color}44;">
      ${e.photo ? `<img src="${e.photo}" style="width:100%;height:100%;object-fit:cover;border-radius:50%;"/>` : (getInitials(e.name) || '?')}
    </div>
    <div style="flex-direction:column;align-items:flex-start;gap:2px;min-width:0;">
      <span style="font-weight:700;font-size:13px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${e.name}</span>
      <span style="font-size:10px;font-family:monospace;background:var(--bg);padding:1px 6px;border-radius:4px;color:var(--text-muted);letter-spacing:.4px;">${e.id}</span>
    </div>
  </div>

  <!-- Department -->
  <div>
    <span style="font-size:11.5px;font-weight:700;color:${color};background:${color}18;padding:4px 10px;border-radius:20px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:100%;">${e.department || '—'}</span>
  </div>

  <!-- Position -->
  <div>
    <span style="font-size:12px;color:var(--text-muted);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${e.position || '—'}</span>
  </div>

  <!-- Gender -->
  <div style="justify-content:center;">${gender}</div>

  <!-- Salary + Attendance -->
  <div style="flex-direction:column;align-items:flex-start;gap:4px;">
    <span style="font-weight:800;font-size:13px;color:var(--text);">${formatMoney(e.salary)}</span>
    ${rate !== null ? `
    <div style="display:flex;align-items:center;gap:5px;width:100%;">
      <div style="flex:1;height:4px;background:var(--border);border-radius:2px;overflow:hidden;">
        <div style="width:${rate}%;height:100%;background:${rateColor};border-radius:2px;"></div>
      </div>
      <span style="font-size:10px;font-weight:700;color:${rateColor};min-width:28px;">${rate}%</span>
    </div>` : '<span style="font-size:10px;color:var(--text-light);">—</span>'}
  </div>

  <!-- Status -->
  <div style="justify-content:center;">
    <span class="status-badge ${e.status}">${statusLabel(e.status)}</span>
  </div>

  <!-- Actions -->
  <div style="gap:5px;justify-content:flex-end;" onclick="event.stopPropagation()">
    <button class="btn-icon" style="width:30px;height:30px;font-size:11px;border-radius:8px;" onclick="viewEmployee('${e.id}')" title="មើល"><i class="fas fa-eye"></i></button>
    <button class="btn-icon edit" style="width:30px;height:30px;font-size:11px;border-radius:8px;" onclick="openModal('edit','${e.id}')" title="កែ"><i class="fas fa-pen"></i></button>
    <button class="btn-icon del" style="width:30px;height:30px;font-size:11px;border-radius:8px;" onclick="confirmDelete('employee','${e.id}')" title="លុប"><i class="fas fa-trash"></i></button>
  </div>
</div>`;
  }).join('');

  container.innerHTML = `
<div class="emp-table-v2">
  <div class="emp-table-topbar">
    <span style="font-size:13px;display:flex;align-items:center;gap:8px;">
      <span style="width:8px;height:8px;border-radius:50%;background:var(--primary);display:inline-block;"></span>
      <strong style="color:var(--primary);">${emps.length}</strong>
      <span style="color:var(--text-muted);">/ ${allEmps.length} នាក់</span>
      ${emps.filter(e => e.status === 'active').length ? `<span style="background:#DCFCE7;color:#059669;padding:2px 9px;border-radius:20px;font-size:11px;font-weight:700;">✓ ${emps.filter(e=>e.status==='active').length} ធ្វើការ</span>` : ''}
      ${emps.filter(e => e.status === 'leave').length ? `<span style="background:#FFF7ED;color:#D97706;padding:2px 9px;border-radius:20px;font-size:11px;font-weight:700;">⏸ ${emps.filter(e=>e.status==='leave').length} ឈប់</span>` : ''}
      ${emps.filter(e => e.status === 'inactive').length ? `<span style="background:#FEF2F2;color:#DC2626;padding:2px 9px;border-radius:20px;font-size:11px;font-weight:700;">✗ ${emps.filter(e=>e.status==='inactive').length} បានឈប់</span>` : ''}
    </span>
  </div>
  <div class="emp-th-v2">
    <span>#</span>
    <span>ឈ្មោះ / ID</span>
    <span>នាយកដ្ឋាន</span>
    <span>តួនាទី</span>
    <span style="justify-content:center;">ភេទ</span>
    <span>ប្រាក់ខែ / វត្តមាន</span>
    <span style="justify-content:center;">ស្ថានភាព</span>
    <span style="justify-content:flex-end;">សកម្មភាព</span>
  </div>
  ${rows}
</div>`;
}


function setEmpView(v) {
  document.getElementById('btn-view-grid')?.classList.toggle('active', v==='grid');
  document.getElementById('btn-view-table')?.classList.toggle('active', v==='table');
  renderEmployees();
}

function clearEmpSearch() {
  const s = document.getElementById('emp-search');
  if (s) { s.value = ''; s.focus(); }
  filterEmployees();
}

function resetEmpFilters() {
  const s  = document.getElementById('emp-search');       if(s)  s.value='';
  const d  = document.getElementById('emp-dept-filter');  if(d)  d.value='';
  const st = document.getElementById('emp-status-filter');if(st) st.value='';
  filterEmployees();
}

function filterEmployees() { renderEmployees(); }

function populateDeptFilter() {
  const depts = DB.getDepartments();
  const sel   = document.getElementById('emp-dept-filter');
  const cur   = sel?.value||'';
  if (sel) sel.innerHTML = '<option value="">នាយកដ្ឋានទាំងអស់</option>' +
    depts.map(d=>`<option value="${d.name}" ${cur===d.name?'selected':''}>${d.icon||''} ${d.name}</option>`).join('');
}

function empCard(e) {
  const depts = DB.getDepartments();
  const att   = DB.getAttendance();
  return empCardV2(e, depts, att);
}

function getFilteredEmployees() {
  let emps   = DB.getEmployees();
  const search = document.getElementById('emp-search')?.value.toLowerCase()||'';
  const dept   = document.getElementById('emp-dept-filter')?.value||'';
  const status = document.getElementById('emp-status-filter')?.value||'';
  if (search) emps = emps.filter(e=>
    e.name?.toLowerCase().includes(search)||
    e.id?.toLowerCase().includes(search)||
    e.position?.toLowerCase().includes(search)||
    e.department?.toLowerCase().includes(search)||
    e.phone?.includes(search)||
    e.email?.toLowerCase().includes(search)
  );
  if (dept)   emps = emps.filter(e=>e.department===dept);
  if (status) emps = emps.filter(e=>e.status===status);
  return emps;
}


// ===== EMPLOYEE MODAL =====
function handleBankImgUpload(event) {
  const file = event.target.files[0];
  if (!file) return;
  if (file.size > 5 * 1024 * 1024) { showToast('រូបភាពធំពេក! សូមជ្រើសរូប < 5MB', 'error'); return; }
  const reader = new FileReader();
  reader.onload = function(e) {
    currentBankImgData = e.target.result;
    const preview = document.getElementById('bank-img-preview');
    const placeholder = document.getElementById('bank-img-placeholder');
    const removeBtn = document.getElementById('bank-img-remove-btn');
    if (preview) { preview.src = currentBankImgData; preview.style.display = 'block'; }
    if (placeholder) placeholder.style.display = 'none';
    if (removeBtn) removeBtn.style.display = 'inline-flex';
  };
  reader.readAsDataURL(file);
}
function removeBankImg() {
  currentBankImgData = '';
  const preview = document.getElementById('bank-img-preview');
  const placeholder = document.getElementById('bank-img-placeholder');
  const removeBtn = document.getElementById('bank-img-remove-btn');
  const inp = document.getElementById('bank-img-input');
  if (preview) { preview.src = ''; preview.style.display = 'none'; }
  if (placeholder) placeholder.style.display = 'flex';
  if (removeBtn) removeBtn.style.display = 'none';
  if (inp) inp.value = '';
}
function updateBankImgPreview(imgData) {
  currentBankImgData = imgData || '';
  const preview = document.getElementById('bank-img-preview');
  const placeholder = document.getElementById('bank-img-placeholder');
  const removeBtn = document.getElementById('bank-img-remove-btn');
  if (!preview) return;
  if (imgData) {
    preview.src = imgData; preview.style.display = 'block';
    if (placeholder) placeholder.style.display = 'none';
    if (removeBtn) removeBtn.style.display = 'inline-flex';
  } else {
    preview.src = ''; preview.style.display = 'none';
    if (placeholder) placeholder.style.display = 'flex';
    if (removeBtn) removeBtn.style.display = 'none';
  }
}

function showBankImgModal(empId) {
  const e = DB.getEmployee(empId);
  if (!e || !e.bankImage) return;
  let overlay = document.getElementById('bank-img-modal-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'bank-img-modal-overlay';
    overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.75);z-index:9999;display:flex;align-items:center;justify-content:center;';
    overlay.onclick = function(ev){ if(ev.target===overlay) overlay.style.display='none'; };
    overlay.innerHTML = `
      <div style="background:var(--surface);border-radius:18px;padding:22px;max-width:600px;width:92%;box-shadow:0 8px 40px rgba(0,0,0,.4);position:relative;">
        <div style="display:flex;align-items:center;gap:10px;margin-bottom:14px;">
          <div style="width:36px;height:36px;border-radius:9px;background:linear-gradient(135deg,#7C3AED,#8B5CF6);display:flex;align-items:center;justify-content:center;color:#fff;font-size:15px;"><i class="fas fa-university"></i></div>
          <div>
            <div id="bim-name" style="font-size:14px;font-weight:800;color:var(--text);"></div>
            <div id="bim-bank" style="font-size:12px;color:var(--text-muted);"></div>
          </div>
          <button onclick="document.getElementById('bank-img-modal-overlay').style.display='none'" style="margin-left:auto;background:var(--bg);border:1.5px solid var(--border);border-radius:8px;width:32px;height:32px;cursor:pointer;font-size:14px;color:var(--text-muted);display:flex;align-items:center;justify-content:center;"><i class="fas fa-times"></i></button>
        </div>
        <!-- 3x4 portrait container: ratio 3:4 -->
        <div style="width:75%;margin:0 auto;aspect-ratio:3/4;border-radius:12px;overflow:hidden;background:var(--surface2);display:flex;align-items:center;justify-content:center;">
          <img id="bim-img" src="" alt="bank" style="width:100%;height:100%;object-fit:contain;"/>
        </div>
        <p style="font-size:11px;color:var(--text-light);text-align:center;margin-top:10px;"><i class="fas fa-shield-alt"></i> រូបភាពគណនីធនាគារ · ទំហំ 3×4 · ការពាររក្សាទុកក្នុងប្រព័ន្ធ</p>
      </div>`;
    document.body.appendChild(overlay);
  }
  document.getElementById('bim-name').textContent = e.name;
  document.getElementById('bim-bank').textContent = '🏦 ' + (e.bank || '');
  document.getElementById('bim-img').src = e.bankImage;
  overlay.style.display = 'flex';
}

function openModal(mode, id = null) {
  editingEmployeeId = id;
  currentPhotoData = '';
  currentBankImgData = '';
  const depts = DB.getDepartments();
  document.getElementById('f-dept').innerHTML = '<option value="">-- ជ្រើសរើស --</option>' +
    depts.map(d => `<option value="${d.name}">${d.name}</option>`).join('');

  if (mode === 'edit' && id) {
    const e = DB.getEmployee(id);
    if (!e) return;
    document.getElementById('modal-title').textContent = 'កែប្រែបុគ្គលិក';
    document.getElementById('f-id').value = e.id;
    document.getElementById('f-name').value = e.name;
    document.getElementById('f-name-en').value = e.nameEn || '';
    document.getElementById('f-gender').value = e.gender;
    document.getElementById('f-dob').value = e.dob || '';
    document.getElementById('f-nation').value = e.nationality || '';
    document.getElementById('f-nid').value = e.nid || '';
    document.getElementById('f-phone').value = e.phone;
    document.getElementById('f-email').value = e.email;
    document.getElementById('f-dept').value = e.department;
    document.getElementById('f-position').value = e.position;
    document.getElementById('f-salary').value = e.salary;
    document.getElementById('f-startdate').value = e.startDate || '';
    document.getElementById('f-bank').value = e.bank || '';
    document.getElementById('f-emptype').value = e.empType || 'Full-time';
    document.getElementById('f-status').value = e.status;
    document.getElementById('f-address').value = e.address || '';
    currentPhotoData = e.photo || '';
    updatePhotoPreview(e.photo);
    updateBankImgPreview(e.bankImage || '');
  } else {
    document.getElementById('modal-title').textContent = 'បន្ថែមបុគ្គលិក';
    const nextNum = DB.getEmployees().length + 1;
    document.getElementById('f-id').value = 'EMP-' + String(nextNum).padStart(3, '0');
    ['f-name','f-name-en','f-phone','f-email','f-position','f-address','f-nid','f-nation','f-bank'].forEach(id => { const el=document.getElementById(id); if(el) el.value=''; });
    document.getElementById('f-gender').value = '';
    document.getElementById('f-dept').value = '';
    document.getElementById('f-salary').value = '';
    document.getElementById('f-dob').value = '';
    document.getElementById('f-startdate').value = new Date().toISOString().split('T')[0];
    document.getElementById('f-status').value = 'active';
    document.getElementById('f-emptype').value = 'Full-time';
    updatePhotoPreview('');
    updateBankImgPreview('');
  }
  // Reset file input so same file can be re-selected
  const inp = document.getElementById('photo-input');
  if (inp) inp.value = '';
  const bankInp = document.getElementById('bank-img-input');
  if (bankInp) bankInp.value = '';
  document.getElementById('emp-modal').classList.add('active');
}

function saveEmployee() {
  const name = document.getElementById('f-name').value.trim();
  const dept = document.getElementById('f-dept').value;
  const position = document.getElementById('f-position').value.trim();
  if (!name || !dept || !position) { showToast('សូមបំពេញព័ត៌មានចាំបាច់!', 'error'); return; }

  const empId = document.getElementById('f-id').value.trim().toUpperCase();
  if (!empId) { showToast('សូមបញ្ចូលលេខបុគ្គលិក!', 'error'); return; }
  if (!/^EMP-\d+$/.test(empId)) { showToast('លេខបុគ្គលិកត្រូវតែជា EMP-001 ជាដើម!', 'error'); return; }
  if (!editingEmployeeId) {
    const existing = DB.getEmployees().find(e => e.id === empId);
    if (existing) { showToast('លេខបុគ្គលិក ' + empId + ' មានរួចហើយ!', 'error'); return; }
  }
  document.getElementById('f-id').value = empId;

  const data = {
    id: empId,
    name, department: dept, position,
    nameEn: document.getElementById('f-name-en').value.trim(),
    gender: document.getElementById('f-gender').value,
    dob: document.getElementById('f-dob').value,
    nationality: document.getElementById('f-nation').value.trim(),
    nid: document.getElementById('f-nid').value.trim(),
    phone: document.getElementById('f-phone').value,
    email: document.getElementById('f-email').value,
    salary: parseFloat(document.getElementById('f-salary').value) || 0,
    startDate: document.getElementById('f-startdate').value,
    bank: document.getElementById('f-bank').value.trim(),
    bankImage: currentBankImgData,
    empType: document.getElementById('f-emptype').value,
    status: document.getElementById('f-status').value,
    address: document.getElementById('f-address').value,
    photo: currentPhotoData,
  };

  try {
    if (editingEmployeeId) {
      DB.updateEmployee(editingEmployeeId, data);
      showToast('✅ បានកែប្រែបុគ្គលិករួចរាល់!', 'success');
    } else {
      DB.addEmployee(data);
      showToast('✅ បានបន្ថែមបុគ្គលិករួចរាល់!', 'success');
    }
    closeModal('emp-modal');
    renderEmployees();
  } catch (e) {
    if (e.name === 'QuotaExceededError' || e.code === 22 || e.code === 1014) {
      // Retry without photo
      showToast('⚠️ Storage ពេញ! Save ដោយគ្មានរូប...', 'error');
      data.photo = '';
      data.bankImage = '';
      currentPhotoData = '';
      currentBankImgData = '';
      try {
        if (editingEmployeeId) { DB.updateEmployee(editingEmployeeId, data); }
        else                   { DB.addEmployee(data); }
        showToast('✅ Save បាន (គ្មានរូប — Storage ពេញ)', 'info');
        closeModal('emp-modal');
        renderEmployees();
      } catch (e2) {
        showToast('❌ Storage ពេញដាច់ខាត! សូមលុបទិន្នន័យចាស់ + reload', 'error');
      }
    } else {
      showToast('❌ Error: ' + (e.message || e), 'error');
    }
  }
}

// ===== VIEW EMPLOYEE =====
function viewEmployee(id) {
  const e = DB.getEmployee(id);
  if (!e) return;
  const att = DB.getAttendance().filter(a => a.empId === id);
  const leave = DB.getLeave().filter(l => l.empId === id);
  const salaries = DB.getSalary().filter(s => s.empId === id);

  document.getElementById('view-modal-body').innerHTML = `
    <div class="view-emp-header">
      <div class="view-avatar">${e.photo ? `<img src="${e.photo}" alt="${e.name}"/>` : `<span>${getInitials(e.name)}</span>`}</div>
      <div>
        <h2>${e.name}</h2>
        <p>${e.position} · <strong>${e.department}</strong></p>
        <span class="status-badge ${e.status}">${statusLabel(e.status)}</span>
        <span class="emp-id-badge" style="margin-left:8px;">${e.id}</span>
      </div>
    </div>
    <div class="view-tabs">
      <button class="view-tab active" onclick="switchViewTab(this,'tab-info')">ព័ត៌មានទូទៅ</button>
      <button class="view-tab" onclick="switchViewTab(this,'tab-att')">វត្តមាន (${att.length})</button>
      <button class="view-tab" onclick="switchViewTab(this,'tab-leave')">ច្បាប់ (${leave.length})</button>
      <button class="view-tab" onclick="switchViewTab(this,'tab-sal')">ប្រាក់ខែ (${salaries.length})</button>
    </div>
    <div id="tab-info" class="view-tab-content active">
      <div class="info-grid">
        <div class="info-item"><label>ភេទ</label><span>${e.gender === 'male' ? 'ប្រុស' : 'ស្រី'}</span></div>
        <div class="info-item"><label>ថ្ងៃខែឆ្នាំកំណើត</label><span>${e.dob || '—'}</span></div>
        <div class="info-item"><label>ទូរស័ព្ទ</label><span>${e.phone || '—'}</span></div>
        <div class="info-item"><label>អ៊ីមែល</label><span>${e.email || '—'}</span></div>
        <div class="info-item"><label>ចូលបំពេញការងារ</label><span>${e.startDate || '—'}</span></div>
        <div class="info-item"><label>ប្រាក់ខែ</label><span>${formatMoney(e.salary)}</span></div>
        <div class="info-item full"><label>អាសយដ្ឋាន</label><span>${e.address || '—'}</span></div>
        <div class="info-item full"><label>គណនីធនាគារ</label><span>${e.bank || '—'}</span></div>
        ${e.bankImage ? `
        <div class="info-item full" style="flex-direction:column;align-items:flex-start;gap:8px;">
          <label style="display:flex;align-items:center;gap:6px;"><i class="fas fa-university" style="color:#7C3AED;"></i> រូបភាពគណនីធនាគារ</label>
          <div style="position:relative;display:inline-block;">
            <img src="${e.bankImage}" alt="bank" style="max-width:280px;max-height:200px;border-radius:10px;border:1.5px solid var(--border);object-fit:contain;background:var(--surface2);cursor:zoom-in;" onclick="showBankImgModal('${e.id}')"/>
            <div style="position:absolute;top:6px;right:6px;background:rgba(124,58,237,.85);color:#fff;font-size:10px;font-weight:700;padding:2px 7px;border-radius:20px;"><i class="fas fa-search-plus"></i> ពង្រីក</div>
          </div>
        </div>` : ''}
        <div class="info-item full"><label>កំណត់ចំណាំ</label><span>${e.notes || '—'}</span></div>
      </div>
    </div>
    <div id="tab-att" class="view-tab-content">
      ${att.length ? `<table class="data-table"><thead><tr><th>ថ្ងៃ</th><th>ចូល</th><th>ចេញ</th><th>ស្ថានភាព</th></tr></thead><tbody>${att.slice(-10).reverse().map(a=>`<tr><td>${a.date}</td><td>${a.timeIn||'—'}</td><td>${a.timeOut||'—'}</td><td><span class="att-badge ${a.status}">${attLabel(a.status)}</span></td></tr>`).join('')}</tbody></table>` : '<div class="empty-state">មិនមានការកត់វត្តមាន</div>'}
    </div>
    <div id="tab-leave" class="view-tab-content">
      ${leave.length ? `<table class="data-table"><thead><tr><th>ប្រភេទ</th><th>ចាប់ផ្ដើម</th><th>បញ្ចប់</th><th>ស្ថានភាព</th></tr></thead><tbody>${leave.map(l=>`<tr><td>${leaveTypeLabel(l.type)}</td><td>${l.startDate}</td><td>${l.endDate}</td><td><span class="leave-badge ${l.status}">${leaveStatusLabel(l.status)}</span></td></tr>`).join('')}</tbody></table>` : '<div class="empty-state">មិនមានច្បាប់ឈប់</div>'}
    </div>
    <div id="tab-sal" class="view-tab-content">
      ${salaries.length ? `<table class="data-table"><thead><tr><th>ខែ</th><th>ប្រាក់ខែ</th><th>លើថ្លៃ</th><th>ពិន័យ</th><th>សរុប</th><th>ស្ថានភាព</th></tr></thead><tbody>${salaries.map(s=>{const total=parseFloat(s.base||0)+parseFloat(s.bonus||0)-parseFloat(s.deduction||0); return `<tr><td>${s.month}</td><td>${formatMoney(s.base)}</td><td>${formatMoney(s.bonus)}</td><td>${formatMoney(s.deduction)}</td><td><strong>${formatMoney(total)}</strong></td><td><span class="sal-badge ${s.status}">${s.status==='paid'?'បានបើក':'រង់ចាំ'}</span></td></tr>`}).join('')}</tbody></table>` : '<div class="empty-state">មិនមានកំណត់ត្រាប្រាក់ខែ</div>'}
    </div>
  `;
  document.getElementById('view-edit-btn').onclick = () => { closeModal('view-modal'); openModal('edit', id); };
  document.getElementById('view-modal').classList.add('active');
}

function switchViewTab(btn, tabId) {
  document.querySelectorAll('.view-tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.view-tab-content').forEach(t => t.classList.remove('active'));
  btn.classList.add('active');
  document.getElementById(tabId).classList.add('active');
}

// ===== PHOTO =====
function handlePhotoUpload(event) {
  const file = event.target.files[0];
  if (!file) return;
  if (file.size > 10 * 1024 * 1024) {
    showToast('រូបថតធំពេក! (max 10MB)', 'error');
    event.target.value = '';
    return;
  }
  if (!file.type.startsWith('image/')) {
    showToast('សូមជ្រើសតែឯកសាររូបភាព!', 'error');
    event.target.value = '';
    return;
  }
  const reader = new FileReader();
  reader.onerror = () => showToast('មានបញ្ហាក្នុងការអានឯកសារ!', 'error');
  reader.onload = ev => {
    const raw = new Image();
    raw.onerror = () => showToast('មិនអាចបើករូបភាពបាន!', 'error');
    raw.onload = () => {
      // Resize to max 300×300 and compress as JPEG
      const MAX = 300;
      let w = raw.width, h = raw.height;
      if (w > h) { if (w > MAX) { h = Math.round(h * MAX / w); w = MAX; } }
      else        { if (h > MAX) { w = Math.round(w * MAX / h); h = MAX; } }
      const canvas = document.createElement('canvas');
      canvas.width = w; canvas.height = h;
      canvas.getContext('2d').drawImage(raw, 0, 0, w, h);
      const compressed = canvas.toDataURL('image/jpeg', 0.82);
      currentPhotoData = compressed;
      updatePhotoPreview(compressed);
      const kb = Math.round(compressed.length * 0.75 / 1024);
      showToast(`✅ រូបរួចរាល់ · ${w}×${h}px · ~${kb}KB`, 'success');
    };
    raw.src = ev.target.result;
  };
  reader.readAsDataURL(file);
}

function updatePhotoPreview(src) {
  const img      = document.getElementById('photo-preview-img');
  const icon     = document.getElementById('photo-preview-icon');
  const txt      = document.getElementById('photo-preview-txt');
  const removeBtn= document.getElementById('photo-remove-btn');
  const label    = document.getElementById('photo-preview-label');
  const changeEl = document.getElementById('photo-change-label');

  if (src) {
    if (img)  { img.src = src; img.style.display = 'block'; }
    if (icon) icon.style.display = 'none';
    if (txt)  txt.style.display  = 'none';
    if (removeBtn) removeBtn.style.display = '';
    if (label) {
      label.style.border = '2px solid #3B5BDB';
      label.style.boxShadow = '0 0 0 3px rgba(59,91,219,.12)';
      label.onmouseenter = () => { if(changeEl) changeEl.style.display=''; };
      label.onmouseleave = () => { if(changeEl) changeEl.style.display='none'; };
    }
  } else {
    if (img)  { img.src = ''; img.style.display = 'none'; }
    if (icon) icon.style.display = '';
    if (txt)  txt.style.display  = '';
    if (removeBtn) removeBtn.style.display = 'none';
    if (label) {
      label.style.border = '2px dashed var(--border)';
      label.style.boxShadow = 'none';
      label.onmouseenter = null;
      label.onmouseleave = null;
    }
    if (changeEl) changeEl.style.display = 'none';
  }
}

function removePhotoPreview() {
  currentPhotoData = '';
  updatePhotoPreview('');
  const inp = document.getElementById('photo-input');
  if (inp) inp.value = '';
}

// ===== DEPARTMENTS =====
function renderDepartments() {
  const depts = DB.getDepartments();
  const emps = DB.getEmployees();
  document.getElementById('departments-container').innerHTML = depts.length ?
    depts.map(d => {
      const count = emps.filter(e => e.department === d.name).length;
      return `
        <div class="dept-card" style="border-top:4px solid ${d.color}">
          <div class="dept-card-top">
            <span class="dept-big-icon">${d.icon}</span>
            <div class="dept-card-actions">
              <button class="btn-icon edit" onclick="openDeptModal('${d.id}')"><i class="fas fa-edit"></i></button>
              <button class="btn-icon del" onclick="confirmDelete('department','${d.id}')"><i class="fas fa-trash"></i></button>
            </div>
          </div>
          <h3 class="dept-card-name">${d.name}</h3>
          <p class="dept-card-head"><i class="fas fa-user-tie"></i> ${d.head || '—'}</p>
          <p class="dept-card-desc">${d.desc || ''}</p>
          <div class="dept-card-footer" style="background:${d.color}22;color:${d.color}">
            <i class="fas fa-users"></i> ${count} នាក់
          </div>
        </div>
      `;
    }).join('') :
    '<div class="empty-state large"><i class="fas fa-sitemap"></i><p>មិនមាននាយកដ្ឋាន</p></div>';
}

function openDeptModal(id = null) {
  editingDeptId = id;
  if (id) {
    const d = DB.getDepartment(id);
    document.getElementById('dept-modal-title').textContent = 'កែប្រែនាយកដ្ឋាន';
    document.getElementById('d-name').value = d.name;
    document.getElementById('d-head').value = d.head || '';
    document.getElementById('d-color').value = d.color || '#4F46E5';
    document.getElementById('d-icon').value = d.icon || '';
    document.getElementById('d-desc').value = d.desc || '';
  } else {
    document.getElementById('dept-modal-title').textContent = 'បន្ថែមនាយកដ្ឋាន';
    ['d-name','d-head','d-icon','d-desc'].forEach(i => document.getElementById(i).value = '');
    document.getElementById('d-color').value = '#4F46E5';
  }
  document.getElementById('dept-modal').classList.add('active');
}

function saveDepartment() {
  const name = document.getElementById('d-name').value.trim();
  if (!name) { showToast('សូមបំពេញឈ្មោះនាយកដ្ឋាន!', 'error'); return; }
  const data = {
    name, head: document.getElementById('d-head').value,
    color: document.getElementById('d-color').value,
    icon: document.getElementById('d-icon').value || '🏢',
    desc: document.getElementById('d-desc').value,
  };
  if (editingDeptId) { DB.updateDepartment(editingDeptId, data); showToast('បានកែប្រែ!', 'success'); }
  else { DB.addDepartment(data); showToast('បានបន្ថែម!', 'success'); }
  closeModal('dept-modal');
  renderDepartments();
}

// ===== ATTENDANCE =====
function populateAttEmpFilter() {
  const emps = DB.getEmployees();
  ['att-emp-filter','a-emp'].forEach(id => {
    const sel = document.getElementById(id);
    if (sel) sel.innerHTML = '<option value="">-- ជ្រើសរើស --</option>' +
      emps.map(e => `<option value="${e.id}">${e.name}</option>`).join('');
  });
}

function clearAttFilters() {
  const d = document.getElementById('att-date-filter');
  const e = document.getElementById('att-emp-filter');
  const s = document.getElementById('att-status-filter');
  if (d) d.value = '';
  if (e) e.value = '';
  if (s) s.value = '';
  renderAttendance();
}

function renderAttendance() {
  const dateFilter   = document.getElementById('att-date-filter')?.value   || '';
  const empFilter    = document.getElementById('att-emp-filter')?.value     || '';
  const statusFilter = document.getElementById('att-status-filter')?.value || '';

  let records = DB.getAttendance();
  if (dateFilter)   records = records.filter(a => a.date === dateFilter);
  if (empFilter)    records = records.filter(a => a.empId === empFilter);
  if (statusFilter) records = records.filter(a => a.status === statusFilter);
  records = records.sort((a,b) => new Date(b.date)-new Date(a.date) || a.empId.localeCompare(b.empId));

  const allAtt = DB.getAttendance();
  const emps   = DB.getEmployees();
  const depts  = DB.getDepartments();

  // ── KPI Strip ─────────────────────────────────────────────────────
  const today = new Date().toISOString().split('T')[0];
  const todayAtt = allAtt.filter(a => a.date === today);
  const kpis = [
    { icon:'fas fa-check-circle',  label:'វត្តមានថ្ងៃនេះ',  val:todayAtt.filter(a=>a.status==='present').length, color:'linear-gradient(135deg,#059669,#10B981)', page:'attendance', filt:'present' },
    { icon:'fas fa-times-circle',  label:'អវត្តមានថ្ងៃនេះ', val:todayAtt.filter(a=>a.status==='absent').length,  color:'linear-gradient(135deg,#DC2626,#EF4444)', page:'attendance', filt:'absent'  },
    { icon:'fas fa-clock',         label:'យឺតថ្ងៃនេះ',      val:todayAtt.filter(a=>a.status==='late').length,   color:'linear-gradient(135deg,#D97706,#F59E0B)', page:'attendance', filt:'late'    },
    { icon:'fas fa-adjust',        label:'កន្លះថ្ងៃ',        val:todayAtt.filter(a=>a.status==='half').length,   color:'linear-gradient(135deg,#0284C7,#3B82F6)', page:'attendance', filt:'half'    },
    { icon:'fas fa-database',      label:'កំណត់ត្រាសរុប',    val:allAtt.length,                                  color:'linear-gradient(135deg,#4F46E5,#7C3AED)', page:'attendance', filt:''        },
  ];
  const strip = document.getElementById('att-kpi-strip');
  if (strip) {
    strip.innerHTML = kpis.map(k => `
      <div class="att-kpi" onclick="(function(){
        var s=document.getElementById('att-status-filter');
        var d=document.getElementById('att-date-filter');
        if(s){s.value='${k.filt}';}
        if('${k.filt}'&&d){d.value='${today}';}
        renderAttendance();
      })()">
        <div class="att-kpi-icon" style="background:${k.color};"><i class="${k.icon}"></i></div>
        <div class="att-kpi-body">
          <div class="att-kpi-num">${k.val}</div>
          <div class="att-kpi-lbl">${k.label}</div>
        </div>
      </div>`).join('');
  }

  const container = document.getElementById('attendance-container');
  if (!container) return;

  if (!records.length) {
    container.innerHTML = `
      <div style="background:var(--surface);border-radius:var(--radius-lg);border:1.5px solid var(--border);box-shadow:var(--shadow);padding:60px 24px;text-align:center;">
        <div style="width:72px;height:72px;border-radius:50%;background:linear-gradient(135deg,#EEF2FF,#E0E7FF);display:flex;align-items:center;justify-content:center;margin:0 auto 16px;font-size:28px;color:var(--primary);">
          <i class="fas fa-calendar-check"></i>
        </div>
        <p style="font-size:16px;font-weight:600;color:var(--text-muted);margin-bottom:12px;">មិនមានការកត់វត្តមាន</p>
        <button class="btn-primary" onclick="openAttModal()"><i class="fas fa-plus"></i> កត់វត្តមានឥឡូវ</button>
      </div>`;
    return;
  }

  // ── Per-employee mini breakdown (only if no single-emp filter) ────
  let summaryHTML = '';
  if (!empFilter) {
    const empSummary = emps.map(e => {
      const er = records.filter(a => a.empId === e.id);
      if (!er.length) return null;
      const dept = depts.find(d => d.name === e.department) || {};
      const c = {
        present: er.filter(a=>a.status==='present').length,
        absent:  er.filter(a=>a.status==='absent').length,
        late:    er.filter(a=>a.status==='late').length,
        half:    er.filter(a=>a.status==='half').length,
      };
      const total = er.length;
      const rate  = Math.round(c.present/total*100);
      return { e, dept, c, total, rate };
    }).filter(Boolean).sort((a,b) => b.total - a.total);

    if (empSummary.length > 0) {
      summaryHTML = `
      <div class="att-summary-row">
        <div class="att-card">
          <div class="att-card-title"><i class="fas fa-chart-bar"></i> ស្ថិតិបុគ្គលិក</div>
          ${empSummary.map(row => `
            <div class="att-emp-bar">
              <div style="display:flex;align-items:center;gap:8px;min-width:170px;">
                <div style="width:30px;height:30px;border-radius:50%;background:linear-gradient(135deg,${row.dept.color||'var(--primary)'},${row.dept.color||'#7C3AED'}88);display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;color:#fff;flex-shrink:0;">${getInitials(row.e.name)}</div>
                <div>
                  <div style="font-size:12px;font-weight:600;color:var(--text);line-height:1.2;">${row.e.name}</div>
                  <div style="font-size:10px;color:var(--text-muted);">${row.e.department}</div>
                </div>
              </div>
              <div style="flex:1;margin:0 10px;">
                <div class="att-emp-segment-row">
                  <div style="width:${Math.round(row.c.present/row.total*100)}%;background:#10B981;"></div>
                  <div style="width:${Math.round(row.c.absent/row.total*100)}%;background:#EF4444;"></div>
                  <div style="width:${Math.round(row.c.late/row.total*100)}%;background:#F59E0B;"></div>
                  <div style="width:${Math.round(row.c.half/row.total*100)}%;background:#3B82F6;"></div>
                </div>
                <div style="display:flex;gap:6px;margin-top:3px;">
                  ${row.c.present?`<span style="font-size:10px;color:#10B981;">✓${row.c.present}</span>`:''}
                  ${row.c.absent ?`<span style="font-size:10px;color:#EF4444;">✗${row.c.absent}</span>` :''}
                  ${row.c.late   ?`<span style="font-size:10px;color:#F59E0B;">⏰${row.c.late}</span>`  :''}
                  ${row.c.half   ?`<span style="font-size:10px;color:#3B82F6;">½${row.c.half}</span>`   :''}
                </div>
              </div>
              <div style="text-align:right;min-width:48px;">
                <div style="font-size:14px;font-weight:800;color:${row.rate>=80?'#059669':row.rate>=60?'#D97706':'#DC2626'};">${row.rate}%</div>
                <div style="font-size:10px;color:var(--text-muted);">${row.total} ថ្ងៃ</div>
              </div>
            </div>`).join('')}
        </div>

        <div class="att-card">
          <div class="att-card-title"><i class="fas fa-chart-pie"></i> ចំណែក</div>
          ${(function() {
            const tot = records.length || 1;
            const present = records.filter(a=>a.status==='present').length;
            const absent  = records.filter(a=>a.status==='absent').length;
            const late    = records.filter(a=>a.status==='late').length;
            const half    = records.filter(a=>a.status==='half').length;
            return [
              {label:'មានវត្តមាន', val:present, color:'#10B981', bg:'#DCFCE7'},
              {label:'អវត្តមាន',  val:absent,  color:'#EF4444', bg:'#FEF2F2'},
              {label:'យឺត',      val:late,    color:'#F59E0B', bg:'#FFF7ED'},
              {label:'កន្លះថ្ងៃ', val:half,   color:'#3B82F6', bg:'#EFF6FF'},
            ].map(s => `
              <div style="background:${s.bg};border-radius:10px;padding:10px 14px;margin-bottom:8px;display:flex;justify-content:space-between;align-items:center;">
                <div style="display:flex;align-items:center;gap:8px;">
                  <div style="width:8px;height:8px;border-radius:50%;background:${s.color};"></div>
                  <span style="font-size:12px;font-weight:600;color:${s.color};">${s.label}</span>
                </div>
                <div style="text-align:right;">
                  <span style="font-size:18px;font-weight:800;color:${s.color};">${s.val}</span>
                  <span style="font-size:11px;color:var(--text-muted);margin-left:4px;">${Math.round(s.val/tot*100)}%</span>
                </div>
              </div>`).join('');
          })()}
          <div style="margin-top:4px;padding:10px 14px;background:linear-gradient(135deg,var(--primary-light),var(--bg));border-radius:10px;display:flex;justify-content:space-between;">
            <span style="font-size:12px;font-weight:600;color:var(--primary);">សរុប</span>
            <span style="font-size:18px;font-weight:800;color:var(--primary);">${records.length}</span>
          </div>
        </div>
      </div>`;
    }
  }

  // ── Main table ────────────────────────────────────────────────────
  const tableRows = records.map(a => {
    const emp  = emps.find(e => e.id === a.empId);
    const dept = depts.find(d => d.name === emp?.department) || {};
    const rowCls = a.status==='absent'?'absent-row':a.status==='late'?'late-row':'';
    const daysAgo = a.date === today ? '<span style="font-size:10px;background:#DCFCE7;color:#15803D;padding:1px 6px;border-radius:6px;font-weight:700;">ថ្ងៃនេះ</span>' : '';
    return `
      <div class="att-row ${rowCls}">
        <div>
          <div style="width:32px;height:32px;border-radius:50%;background:linear-gradient(135deg,${dept.color||'var(--primary)'},${dept.color||'#7C3AED'}88);display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;color:#fff;">
            ${emp?.photo?`<img src="${emp.photo}" style="width:100%;height:100%;object-fit:cover;border-radius:50%;"/>`:(emp?getInitials(emp.name):'?')}
          </div>
        </div>
        <div style="display:flex;flex-direction:column;align-items:flex-start;gap:1px;">
          <span style="font-weight:600;font-size:13px;">${emp?.name||a.empId}</span>
          <span style="font-size:11px;color:${dept.color||'var(--text-muted)'};">${emp?.department||'—'}</span>
        </div>
        <div style="display:flex;flex-direction:column;align-items:flex-start;gap:1px;">
          <span style="font-size:12px;font-weight:600;">${a.date}</span>
          ${daysAgo}
        </div>
        <div>${a.timeIn  ? `<span class="att-time"><i class="fas fa-sign-in-alt" style="color:#10B981;font-size:10px;"></i> ${a.timeIn}</span>`  : '<span style="color:var(--text-light);font-size:12px;">—</span>'}</div>
        <div>${a.timeOut ? `<span class="att-time"><i class="fas fa-sign-out-alt" style="color:#EF4444;font-size:10px;"></i> ${a.timeOut}</span>` : '<span style="color:var(--text-light);font-size:12px;">—</span>'}</div>
        <div><span class="att-pill ${a.status}">${attLabel(a.status)}</span></div>
        <div style="color:var(--text-muted);font-size:12px;">${a.note||'—'}</div>
        <div style="font-size:11px;color:var(--text-muted);">
          ${a.timeIn && a.timeOut ? (() => {
            try {
              const [h1,m1]=a.timeIn.split(':').map(Number);
              const [h2,m2]=a.timeOut.split(':').map(Number);
              const mins=(h2*60+m2)-(h1*60+m1);
              if(mins>0){const h=Math.floor(mins/60);const m=mins%60;return `<span style="background:var(--bg);padding:2px 7px;border-radius:6px;font-weight:600;">${h}ម ${m}ន</span>`;}
              return '—';
            } catch{return '—';}
          })() : '—'}
        </div>
        <div>
          <button class="btn-icon del" style="width:28px;height:28px;font-size:11px;" onclick="confirmDelete('attendance','${a.id}')"><i class="fas fa-trash"></i></button>
        </div>
      </div>`;
  }).join('');

  container.innerHTML = summaryHTML + `
    <div class="att-table-wrap">
      <div class="att-table-head-bar">
        <span class="att-table-count">បង្ហាញ <strong>${records.length}</strong> / ${allAtt.length} កំណត់ត្រា</span>
        <div style="display:flex;gap:8px;align-items:center;">
          ${records.filter(a=>a.status==='absent').length>0 ? `<span style="background:#FEF2F2;color:#DC2626;padding:3px 10px;border-radius:8px;font-size:11px;font-weight:700;"><i class="fas fa-exclamation-triangle"></i> ${records.filter(a=>a.status==='absent').length} អវត្តមាន</span>` : ''}
          ${records.filter(a=>a.status==='late').length>0   ? `<span style="background:#FFF7ED;color:#C2410C;padding:3px 10px;border-radius:8px;font-size:11px;font-weight:700;"><i class="fas fa-clock"></i> ${records.filter(a=>a.status==='late').length} យឺត</span>` : ''}
        </div>
      </div>
      <div class="att-th">
        <span></span>
        <span>ឈ្មោះ / នាយកដ្ឋាន</span>
        <span>ថ្ងៃ</span>
        <span>ចូល</span>
        <span>ចេញ</span>
        <span>ស្ថានភាព</span>
        <span>កំណត់ចំណាំ</span>
        <span>រយៈពេល</span>
        <span></span>
      </div>
      ${tableRows}
    </div>`;
}

function openAttModal() {
  document.getElementById('a-date').value = new Date().toISOString().split('T')[0];
  document.getElementById('att-modal').classList.add('active');
}

function saveAttendance() {
  const empId = document.getElementById('a-emp').value;
  const date  = document.getElementById('a-date').value;
  if (!empId || !date) { showToast('សូមជ្រើសបុគ្គលិក និងថ្ងៃ!', 'error'); return; }
  DB.addAttendance({
    empId, date,
    timeIn:  document.getElementById('a-in').value,
    timeOut: document.getElementById('a-out').value,
    status:  document.getElementById('a-status').value,
    note:    document.getElementById('a-note').value,
  });
  showToast('បានកត់វត្តមានរួចរាល់! ✅', 'success');
  closeModal('att-modal');
  renderAttendance();
}

// ===== SALARY =====
function populateSalaryFilters() {
  const emps = DB.getEmployees();
  const selEmp = document.getElementById('salary-emp-filter');
  if (selEmp) {
    selEmp.innerHTML = '<option value="">បុគ្គលិកទាំងអស់</option>' +
      emps.map(e => `<option value="${e.id}">${e.name}</option>`).join('');
  }
  const months = [];
  const yr = new Date().getFullYear();
  for (let y = yr; y >= 2022; y--)
    for (let m = 12; m >= 1; m--)
      months.push(`${y}-${String(m).padStart(2,'0')}`);
  const selM = document.getElementById('salary-month-filter');
  if (selM) selM.innerHTML = '<option value="">ខែទាំងអស់</option>' +
    months.map(m => `<option value="${m}">${m}</option>`).join('');
}

function clearSalaryFilters() {
  ['salary-emp-filter','salary-month-filter','salary-status-filter'].forEach(id => {
    const el = document.getElementById(id); if(el) el.value = '';
  });
  renderSalary();
}

function renderSalary() {
  const empF    = document.getElementById('salary-emp-filter')?.value    || '';
  const monthF  = document.getElementById('salary-month-filter')?.value  || '';
  const statusF = document.getElementById('salary-status-filter')?.value || '';

  let records = DB.getSalary();
  if (empF)    records = records.filter(s => s.empId  === empF);
  if (monthF)  records = records.filter(s => s.month  === monthF);
  if (statusF) records = records.filter(s => s.status === statusF);
  records = records.sort((a,b) => b.month.localeCompare(a.month));

  const allSal = DB.getSalary();
  const emps   = DB.getEmployees();
  const depts  = DB.getDepartments();
  const net    = r => parseFloat(r.base||0)+parseFloat(r.bonus||0)-parseFloat(r.deduction||0);

  // ── KPI Strip ─────────────────────────────────────────────────────
  const paid    = allSal.filter(s=>s.status==='paid');
  const pending = allSal.filter(s=>s.status==='pending');
  const totalPaid  = paid.reduce((s,r)=>s+net(r),0);
  const totalPend  = pending.reduce((s,r)=>s+net(r),0);
  const totalBonus = allSal.reduce((s,r)=>s+parseFloat(r.bonus||0),0);
  const avgNet     = allSal.length ? allSal.reduce((s,r)=>s+net(r),0)/allSal.length : 0;

  const kpis = [
    { icon:'fas fa-file-alt',      label:'កំណត់ត្រាសរុប', num:allSal.length+' ករណី',              sub:`${paid.length} បានបើក · ${pending.length} រង់ចាំ`, color:'#3B5BDB', g:'linear-gradient(135deg,#3B5BDB,#4F46E5)' },
    { icon:'fas fa-check-circle',  label:'ប្រាក់ខែបានបើក', num:formatMoney(Math.round(totalPaid)),   sub:`${paid.length} ករណី`,   color:'#059669', g:'linear-gradient(135deg,#059669,#10B981)' },
    { icon:'fas fa-hourglass-half',label:'រង់ចាំបើក',      num:formatMoney(Math.round(totalPend)),   sub:`${pending.length} ករណី`,color:'#D97706', g:'linear-gradient(135deg,#D97706,#F59E0B)' },
    { icon:'fas fa-gift',          label:'ប្រាក់លើថ្លៃ',   num:formatMoney(Math.round(totalBonus)),  sub:'bonus សរុប',            color:'#7C3AED', g:'linear-gradient(135deg,#7C3AED,#8B5CF6)' },
    { icon:'fas fa-calculator',    label:'ជាមធ្យម/ករណី',  num:formatMoney(Math.round(avgNet)),       sub:'net average',           color:'#0284C7', g:'linear-gradient(135deg,#0284C7,#3B82F6)' },
  ];
  const strip = document.getElementById('sal-kpi-strip');
  if (strip) strip.innerHTML = kpis.map(k=>`
    <div class="sal-kpi">
      <div class="sal-kpi-accent" style="background:${k.g};"></div>
      <div class="sal-kpi-icon" style="background:${k.g};"><i class="${k.icon}"></i></div>
      <div class="sal-kpi-val">${k.label}</div>
      <div class="sal-kpi-num" style="color:${k.color};">${k.num}</div>
      <div class="sal-kpi-sub">${k.sub}</div>
    </div>`).join('');

  const container = document.getElementById('salary-container');
  if (!container) return;

  if (!records.length) {
    container.innerHTML = `
      <div style="background:var(--surface);border-radius:var(--radius-lg);border:1.5px solid var(--border);box-shadow:var(--shadow);padding:60px 24px;text-align:center;">
        <div style="width:72px;height:72px;border-radius:50%;background:linear-gradient(135deg,#f0fdf4,#dcfce7);display:flex;align-items:center;justify-content:center;margin:0 auto 16px;font-size:28px;color:#059669;">
          <i class="fas fa-money-bill-wave"></i>
        </div>
        <p style="font-size:16px;font-weight:600;color:var(--text-muted);margin-bottom:12px;">មិនមានកំណត់ត្រាប្រាក់ខែ</p>
        <button class="btn-primary" onclick="openSalaryModal()"><i class="fas fa-plus"></i> បន្ថែមកំណត់ត្រា</button>
      </div>`;
    return;
  }


  // ── Compute table data ───────────────────────────────────────────
  const totBase   = records.reduce((s,r)=>s+parseFloat(r.base||0),0);
  const totBonus  = records.reduce((s,r)=>s+parseFloat(r.bonus||0),0);
  const totDeduct = records.reduce((s,r)=>s+parseFloat(r.deduction||0),0);
  const totNet    = records.reduce((s,r)=>s+net(r),0);

  const paidInFilter    = records.filter(r=>r.status==='paid').length;
  const pendingInFilter = records.filter(r=>r.status==='pending').length;

  const tableRows = records.map(r => {
    const emp    = emps.find(e=>e.id===r.empId);
    const dept   = depts.find(d=>d.name===emp?.department)||{};
    const netV   = net(r);
    const netCls = netV >= 1500000 ? 'high' : netV >= 800000 ? 'med' : 'low';
    const rowCls = r.status==='paid' ? 'paid-row' : 'pending-row';
    const color  = dept.color || 'var(--primary)';
    return `
  <div class="sal-row ${rowCls}">
    <div style="justify-content:center;">
      <div style="width:36px;height:36px;border-radius:50%;background:linear-gradient(135deg,${color},${color}88);display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:800;color:#fff;overflow:hidden;flex-shrink:0;">
        ${emp?.photo?`<img src="${emp.photo}" style="width:100%;height:100%;object-fit:cover;border-radius:50%;"/>`:(emp?getInitials(emp.name):'?')}
      </div>
    </div>
    <div style="flex-direction:column;align-items:flex-start;gap:2px;">
      <span style="font-weight:700;font-size:13px;color:var(--text);">${emp?.name||r.empId}</span>
      <span style="font-size:11px;color:${color};">${emp?.department||'—'}</span>
    </div>
    <div>
      <span style="background:#1A237E;color:#fff;padding:3px 10px;border-radius:8px;font-size:12px;font-weight:700;font-family:monospace;">${r.month}</span>
    </div>
    <div style="flex-direction:column;align-items:flex-start;gap:1px;">
      <span style="font-weight:600;font-size:13px;color:var(--text);">${parseFloat(r.base||0)>0?formatMoney(parseFloat(r.base||0)):'—'}</span>
      <span style="font-size:10px;color:var(--text-muted);">ប្រាក់ខែ</span>
    </div>
    <div><span style="font-size:13px;color:#059669;font-weight:600;">${parseFloat(r.bonus||0)>0?'+'+formatMoney(parseFloat(r.bonus||0)):'—'}</span></div>
    <div><span style="font-size:13px;color:#DC2626;font-weight:600;">${parseFloat(r.deduction||0)>0?'-'+formatMoney(parseFloat(r.deduction||0)):'—'}</span></div>
    <div><span class="sal-net ${netCls}">${formatMoney(Math.round(netV))}</span></div>
    <div><span class="sal-pill ${r.status}">● ${r.status==='paid'?'✓ បើករួច':'⏳ រង់ចាំ'}</span></div>
    <div style="gap:4px;flex-wrap:wrap;">
      ${r.status==='pending'?`<button class="sal-pay-btn" onclick="markSalaryPaid('${r.id}')"><i class="fas fa-check"></i> បើក</button>`:''}
      <button class="btn-icon edit" style="width:28px;height:28px;font-size:12px;" title="កែប្រែ" onclick="openEditSalaryModal('${r.id}')"><i class="fas fa-edit"></i></button>
      <button class="btn-icon" style="width:28px;height:28px;font-size:12px;" title="បោះពុម្ព" onclick="printPaySlip('${r.id}')"><i class="fas fa-print"></i></button>
      <button class="btn-icon del" style="width:28px;height:28px;font-size:12px;" onclick="confirmDelete('salary','${r.id}')"><i class="fas fa-trash"></i></button>
    </div>
  </div>`;
  }).join('');

  container.innerHTML = `
    <div class="sal-table-wrap">
      <div class="sal-table-head-bar">
        <span class="sal-table-count">បង្ហាញ <strong>${records.length}</strong> / ${allSal.length} ករណី</span>
        <div style="display:flex;gap:8px;align-items:center;">
          ${paidInFilter>0   ?`<span style="background:#DCFCE7;color:#059669;padding:3px 10px;border-radius:8px;font-size:11px;font-weight:700;">✓ ${paidInFilter} បានបើក</span>`:''}
          ${pendingInFilter>0?`<span style="background:#FFF7ED;color:#C2410C;padding:3px 10px;border-radius:8px;font-size:11px;font-weight:700;">⏳ ${pendingInFilter} រង់ចាំ</span>`:''}
          ${pendingInFilter>0?`<button class="sal-pay-btn" onclick="markAllPending()" style="font-size:11px;padding:4px 12px;"><i class="fas fa-check-double"></i> បើកទាំងអស់</button>`:''}
        </div>
      </div>
      <div class="sal-th">
        <span></span>
        <span>ឈ្មោះ / នាយកដ្ឋាន</span>
        <span>ខែ</span>
        <span>ប្រាក់ខែ</span>
        <span>ប្រាក់លើថ្លៃ</span>
        <span>កាត់ប្រាក់</span>
        <span>សរុបសុទ្ធ</span>
        <span>ស្ថានភាព</span>
        <span>សកម្មភាព</span>
      </div>
      ${tableRows}
      <div class="sal-total-row">
        <div></div>
        <div style="font-weight:800;color:var(--primary);">សរុប (${records.length} ករណី)</div>
        <div></div>
        <div style="font-weight:700;">${formatMoney(Math.round(totBase))}</div>
        <div style="color:#059669;font-weight:700;">${totBonus>0?'+'+formatMoney(Math.round(totBonus)):'—'}</div>
        <div style="color:#DC2626;font-weight:700;">${totDeduct>0?'-'+formatMoney(Math.round(totDeduct)):'—'}</div>
        <div><span class="sal-net high" style="font-size:15px;">${formatMoney(Math.round(totNet))}</span></div>
        <div></div>
        <div></div>
      </div>
    </div>`;
}

function markAllPending() {
  const empF   = document.getElementById('salary-emp-filter')?.value   || '';
  const monthF = document.getElementById('salary-month-filter')?.value || '';
  let records = DB.getSalary().filter(s=>s.status==='pending');
  if (empF)   records = records.filter(s=>s.empId===empF);
  if (monthF) records = records.filter(s=>s.month===monthF);
  if (!records.length) { showToast('មិនមានកំណត់ត្រារង់ចាំ!', 'error'); return; }
  const label = monthF ? `ខែ ${monthF}` : 'ដែលបង្ហាញ';
  showConfirm(`បើកប្រាក់ខែ ${records.length} ករណី ${label}?`, () => {
    let loanCount = 0, loanAmt = 0;
    records.forEach(s => {
      DB.updateSalary(s.id, {status:'paid'});
      // Process active loans for this employee + month
      const loans = salGetActiveLoans(s.empId, s.month);
      loans.forEach(l => {
        DB.markLoanMonthPaid(l.id, s.month);
        loanAmt += parseFloat(l.monthlyDeduct||0);
      });
      loanCount += loans.length;
    });
    if (loanCount > 0) {
      showToast(`✅ បើក ${records.length} ករណី + កាត់ប.ខ្ចី ${loanCount} ករណី ($${loanAmt.toFixed(2)})!`, 'success');
    } else {
      showToast(`✅ បានបើកប្រាក់ខែ ${records.length} ករណី!`, 'success');
    }
    renderSalary();
  });
}

/* ── Generate All Salary ── */
function openGenerateAllModal() {
  const now = new Date().toISOString().slice(0,7);
  document.getElementById('gen-month').value   = now;
  document.getElementById('gen-status').value  = 'pending';
  document.getElementById('gen-bonus').value   = '';
  document.getElementById('gen-deduct').value  = '';
  document.getElementById('gen-skip-existing').checked = true;
  updateGenPreview();

  // Live preview on change
  ['gen-month','gen-status','gen-skip-existing'].forEach(id => {
    const el = document.getElementById(id);
    if (el) { el.onchange = updateGenPreview; el.oninput = updateGenPreview; }
  });

  document.getElementById('gen-all-modal').classList.add('active');
}

function updateGenPreview() {
  const month    = document.getElementById('gen-month')?.value || '';
  const skipExist= document.getElementById('gen-skip-existing')?.checked;
  const preview  = document.getElementById('gen-preview');
  if (!preview) return;

  if (!month) {
    preview.innerHTML = '<i class="fas fa-info-circle"></i> ជ្រើសខែ ដើម្បីមើល preview';
    return;
  }

  const emps   = DB.getEmployees().filter(e => e.status !== 'inactive');
  const salNow = DB.getSalary().filter(s => s.month === month);
  const existing = new Set(salNow.map(s => s.empId));

  let toGenerate = emps;
  let skipped    = [];
  if (skipExist) {
    skipped    = emps.filter(e => existing.has(e.id));
    toGenerate = emps.filter(e => !existing.has(e.id));
  }

  if (!toGenerate.length) {
    preview.innerHTML = `<span style="color:#DC2626;font-weight:600;"><i class="fas fa-exclamation-triangle"></i> បុគ្គលិកទាំងអស់មានកំណត់ត្រា ${month} រួចហើយ!</span>`;
    return;
  }

  const totalBase = toGenerate.reduce((s,e) => s + parseFloat(e.salary||0), 0);
  preview.innerHTML = `
    <div style="display:flex;flex-direction:column;gap:6px;">
      <div style="display:flex;justify-content:space-between;align-items:center;">
        <span style="font-weight:700;color:var(--text);font-size:13px;"><i class="fas fa-users" style="color:var(--primary);"></i> Generate ${toGenerate.length} នាក់</span>
        <span style="font-weight:700;color:#059669;">Base: $${totalBase.toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2})}</span>
      </div>
      ${skipped.length ? `<div style="color:var(--text-muted);font-size:11.5px;"><i class="fas fa-forward"></i> រំលង ${skipped.length} នាក់ (មានស្រាប់): ${skipped.slice(0,3).map(e=>e.name).join(', ')}${skipped.length>3?'...':''}</div>` : ''}
      <div style="display:flex;flex-wrap:wrap;gap:4px;max-height:80px;overflow-y:auto;">
        ${toGenerate.slice(0,8).map(e=>`<span style="background:var(--primary-light);color:var(--primary);padding:2px 8px;border-radius:6px;font-size:11px;font-weight:600;">${e.name}</span>`).join('')}
        ${toGenerate.length > 8 ? `<span style="font-size:11px;color:var(--text-muted);">+${toGenerate.length-8} ទៀត</span>` : ''}
      </div>
    </div>`;
}

function generateAllSalary() {
  const month     = document.getElementById('gen-month')?.value || '';
  const status    = document.getElementById('gen-status')?.value || 'pending';
  const bonusVal  = parseFloat(document.getElementById('gen-bonus')?.value) || 0;
  const deductVal = parseFloat(document.getElementById('gen-deduct')?.value) || 0;
  const skipExist = document.getElementById('gen-skip-existing')?.checked;

  if (!month) { showToast('សូមជ្រើសខែ!', 'error'); return; }

  const emps   = DB.getEmployees().filter(e => e.status !== 'inactive');
  const salNow = DB.getSalary().filter(s => s.month === month);
  const existing = new Set(salNow.map(s => s.empId));

  let toGenerate = emps;
  if (skipExist) toGenerate = emps.filter(e => !existing.has(e.id));

  if (!toGenerate.length) {
    showToast('មិនមានបុគ្គលិកត្រូវ Generate!', 'error');
    return;
  }

  showConfirm(`Generate ប្រាក់ខែ ${toGenerate.length} នាក់ ខែ ${month}?`, () => {
    let loanCount = 0, loanAmt = 0;
    toGenerate.forEach(e => {
      const loans      = salGetActiveLoans(e.id, month);
      const loanDeduct = loans.reduce((s,l) => s + parseFloat(l.monthlyDeduct||0), 0);
      const totalDeduct= deductVal + loanDeduct;

      DB.addSalary({
        empId:     e.id,
        month,
        base:      parseFloat(e.salary||0),
        bonus:     bonusVal,
        deduction: totalDeduct,
        status,
      });

      if (status === 'paid') {
        loans.forEach(l => {
          DB.markLoanMonthPaid(l.id, month);
          loanAmt += parseFloat(l.monthlyDeduct||0);
        });
        loanCount += loans.length;
      }
    });

    let msg = `✅ Generate ${toGenerate.length} ករណី ខែ ${month}!`;
    if (loanCount > 0) msg += ` + កាត់ប.ខ្ចី ${loanCount} ករណី ($${loanAmt.toFixed(2)})`;
    showToast(msg, 'success');
    closeModal('gen-all-modal');
    renderSalary();
  });
}

/* helpers */
function salGetActiveLoans(empId, month) {
  if (!empId || !month) return [];
  return DB.getLoan().filter(l =>
    l.empId === empId &&
    l.status === 'active' &&
    l.startMonth <= month &&
    !(l.paidMonths||[]).includes(month)
  );
}

function salCalcNet() {
  const base   = parseFloat(document.getElementById('s-base')?.value||0);
  const bonus  = parseFloat(document.getElementById('s-bonus')?.value||0);
  const deduct = parseFloat(document.getElementById('s-deduct')?.value||0);
  const net    = base + bonus - deduct;
  const el = document.getElementById('sal-net-display');
  if (el) {
    el.textContent = '$' + Math.max(0,net).toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2});
    el.style.color = net < 0 ? '#dc2626' : '#15803d';
  }
}

function salUpdateLoanBox(empId, month) {
  const loans  = salGetActiveLoans(empId, month);
  const box    = document.getElementById('sal-loan-box');
  const detail = document.getElementById('sal-loan-detail');
  const amtEl  = document.getElementById('sal-loan-amt');
  const hint   = document.getElementById('sal-deduct-hint');
  if (!box) return;

  if (loans.length === 0) {
    box.style.display = 'none';
    if (hint) hint.style.display = 'none';
    return;
  }

  const total = loans.reduce((s,l) => s + parseFloat(l.monthlyDeduct||0), 0);
  const LOAN_TYPES = {
    personal:'ផ្ទាល់ខ្លួន', emergency:'បន្ទាន់', medical:'ព្យាបាល',
    education:'អប់រំ', vehicle:'យានជំនិះ', other:'ផ្សេងៗ'
  };
  const details = loans.map(l =>
    `${LOAN_TYPES[l.type]||l.type}: $${parseFloat(l.monthlyDeduct||0).toFixed(2)}`
  ).join(' · ');

  box.style.display = '';
  if (detail) detail.textContent = `${loans.length} ករណី · ${details}`;
  if (amtEl)  amtEl.textContent  = '$' + total.toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2});
  if (hint)   hint.style.display = '';
}

function salApplyLoanDeduct() {
  const empId  = document.getElementById('s-emp').value;
  const month  = document.getElementById('s-month').value;
  const loans  = salGetActiveLoans(empId, month);
  const total  = loans.reduce((s,l) => s + parseFloat(l.monthlyDeduct||0), 0);
  const deductEl = document.getElementById('s-deduct');
  if (deductEl) { deductEl.value = total.toFixed(2); deductEl.dataset.userEdited = '1'; }
  salCalcNet();
  showToast(`💳 បានដាក់ប្រាក់ខ្ចី $${total.toFixed(2)} ក្នុងការកាត់ប្រាក់!`, 'success');
}

function openSalaryModal() {
  const emps = DB.getEmployees();
  const now  = new Date().toISOString().slice(0,7);

  // Reset editing state + title
  const editingEl = document.getElementById('s-editing');
  if (editingEl) editingEl.value = '';
  const titleEl = document.getElementById('sal-modal-title');
  const subEl   = document.getElementById('sal-modal-sub');
  if (titleEl) titleEl.textContent = 'កំណត់ត្រាប្រាក់ខែ';
  if (subEl)   subEl.textContent   = 'Salary Record · ការគ្រប់គ្រងប្រាក់ខែ';

  // Enable emp + month fields (might be locked from edit mode)
  const empEl   = document.getElementById('s-emp');
  const monEl   = document.getElementById('s-month');
  if (empEl) empEl.disabled   = false;
  if (monEl) monEl.disabled   = false;

  // Populate + reset fields
  document.getElementById('s-emp').innerHTML =
    '<option value="">-- ជ្រើសរើស --</option>' +
    emps.map(e => `<option value="${e.id}">${e.name}</option>`).join('');
  document.getElementById('s-month').value  = now;
  document.getElementById('s-base').value   = '';
  document.getElementById('s-bonus').value  = '';
  document.getElementById('s-deduct').value = '';
  document.getElementById('s-status').value = 'pending';
  document.getElementById('s-deduct').dataset.userEdited = '';

  // Hide loan box initially
  const box = document.getElementById('sal-loan-box');
  if (box) box.style.display = 'none';
  const hint = document.getElementById('sal-deduct-hint');
  if (hint) hint.style.display = 'none';
  salCalcNet();

  // Remove old listeners by cloning
  const empSel   = document.getElementById('s-emp');
  const monthInp = document.getElementById('s-month');
  const newEmpSel   = empSel.cloneNode(true);
  const newMonthInp = monthInp.cloneNode(true);
  empSel.parentNode.replaceChild(newEmpSel, empSel);
  monthInp.parentNode.replaceChild(newMonthInp, monthInp);

  // Re-set after clone
  newEmpSel.innerHTML = '<option value="">-- ជ្រើសរើស --</option>' +
    emps.map(e => `<option value="${e.id}">${e.name}</option>`).join('');
  newMonthInp.value   = now;

  function refreshLoanAndNet() {
    const eid = document.getElementById('s-emp')?.value;
    const mon = document.getElementById('s-month')?.value;
    salUpdateLoanBox(eid, mon);
    // Auto-apply loan deduction if user hasn't manually edited
    if (!document.getElementById('s-deduct')?.dataset.userEdited) {
      const loans = salGetActiveLoans(eid, mon);
      const total = loans.reduce((s,l) => s + parseFloat(l.monthlyDeduct||0), 0);
      if (total > 0) document.getElementById('s-deduct').value = total.toFixed(2);
      else document.getElementById('s-deduct').value = '';
    }
    salCalcNet();
  }

  newEmpSel.addEventListener('change', () => {
    const emp = DB.getEmployee(newEmpSel.value);
    if (emp?.salary) document.getElementById('s-base').value = emp.salary;
    document.getElementById('s-deduct').dataset.userEdited = '';
    refreshLoanAndNet();
  });
  newMonthInp.addEventListener('change', () => {
    document.getElementById('s-deduct').dataset.userEdited = '';
    refreshLoanAndNet();
  });

  document.getElementById('salary-modal').classList.add('active');
  salCalcNet();
}

function openEditSalaryModal(id) {
  const rec  = DB.getSalary().find(s => s.id === id);
  if (!rec) { showToast('រកមិនឃើញកំណត់ត្រា!', 'error'); return; }

  const emp  = DB.getEmployee(rec.empId);
  const emps = DB.getEmployees();

  // Set editing ID
  document.getElementById('s-editing').value = id;

  // Update modal title
  const titleEl = document.getElementById('sal-modal-title');
  const subEl   = document.getElementById('sal-modal-sub');
  if (titleEl) titleEl.textContent = '✏️ កែប្រែប្រាក់ខែ';
  if (subEl)   subEl.textContent   = `${emp?.name||rec.empId} · ${rec.month}`;

  // Populate employee dropdown (disabled in edit)
  const empSel = document.getElementById('s-emp');
  empSel.innerHTML = emps.map(e => `<option value="${e.id}">${e.name}</option>`).join('');
  empSel.value    = rec.empId;
  empSel.disabled = true; // cannot change emp in edit

  // Month (disabled in edit)
  const monInp = document.getElementById('s-month');
  monInp.value    = rec.month;
  monInp.disabled = true; // cannot change month in edit

  // Fill values
  document.getElementById('s-base').value   = rec.base   || '';
  document.getElementById('s-bonus').value  = rec.bonus  || '';
  document.getElementById('s-deduct').value = rec.deduction || '';
  document.getElementById('s-status').value = rec.status || 'pending';
  document.getElementById('s-deduct').dataset.userEdited = '1';

  // Show loan box info
  salUpdateLoanBox(rec.empId, rec.month);
  salCalcNet();

  // Hide old listeners issue — re-attach net calc
  document.getElementById('s-base').oninput   = salCalcNet;
  document.getElementById('s-bonus').oninput  = salCalcNet;
  document.getElementById('s-deduct').oninput = salCalcNet;

  document.getElementById('salary-modal').classList.add('active');
}

function saveSalary() {
  const editing   = document.getElementById('s-editing')?.value || '';
  const empId     = document.getElementById('s-emp').value;
  const month     = document.getElementById('s-month').value;
  if (!empId || !month) { showToast('សូមជ្រើសបុគ្គលិក និងខែ!', 'error'); return; }

  const salStatus = document.getElementById('s-status').value;
  const base      = parseFloat(document.getElementById('s-base').value)  || 0;
  const bonus     = parseFloat(document.getElementById('s-bonus').value) || 0;
  const deduction = parseFloat(document.getElementById('s-deduct').value) || 0;

  if (editing) {
    // ── EDIT MODE ──
    const prevRec = DB.getSalary().find(s => s.id === editing);
    const wasNotPaid = prevRec && prevRec.status !== 'paid';

    DB.updateSalary(editing, { base, bonus, deduction, status: salStatus });

    // If just changed to paid → process loans
    if (salStatus === 'paid' && wasNotPaid) {
      const loans = salGetActiveLoans(empId, month);
      loans.forEach(l => DB.markLoanMonthPaid(l.id, month));
      if (loans.length > 0) {
        showToast(`✅ បានកែ + កាត់ប.ខ្ចី ${loans.length} ករណី!`, 'success');
      } else {
        showToast('✅ បានកែប្រែរួចរាល់!', 'success');
      }
    } else {
      showToast('✅ បានកែប្រែរួចរាល់!', 'success');
    }
    closeModal('salary-modal');
    renderSalary();
    return;
  }

  // ── CREATE MODE ──
  // ហាមស្ទួន: empId + month ត្រូវ unique
  const existingSal = DB.getSalary().filter(s => s.empId === empId && s.month === month);
  if (existingSal.length > 0) {
    const emp2 = DB.getEmployee(empId);
    const empName = emp2 ? emp2.name : empId;
    showToast(`⚠️ ${empName} មានកំណត់ត្រាប្រាក់ខែ ${month} រួចហើយ! សូមចុចប៊ូតុង ✏️ កែប្រែ Record ដែលមានស្រាប់។`, 'error');
    const empSel = document.getElementById('s-emp');
    const monthInp = document.getElementById('s-month');
    if (empSel)   { empSel.style.borderColor   = '#EF4444'; setTimeout(()=>empSel.style.borderColor   = '', 3000); }
    if (monthInp) { monthInp.style.borderColor = '#EF4444'; setTimeout(()=>monthInp.style.borderColor = '', 3000); }
    return;
  }

  const emp = DB.getEmployee(empId);
  DB.addSalary({
    empId, month,
    base:  base || emp?.salary || 0,
    bonus, deduction, status: salStatus,
  });

  if (salStatus === 'paid') {
    const loans = salGetActiveLoans(empId, month);
    loans.forEach(l => DB.markLoanMonthPaid(l.id, month));
    if (loans.length > 0) {
      showToast(`✅ បានរក្សាទុក + កាត់ប.ខ្ចី ${loans.length} ករណី ($${loans.reduce((s,l)=>s+parseFloat(l.monthlyDeduct||0),0).toFixed(2)})!`, 'success');
    } else {
      showToast('✅ បានរក្សាទុករួចរាល់!', 'success');
    }
  } else {
    showToast('✅ បានរក្សាទុករួចរាល់!', 'success');
  }

  closeModal('salary-modal');
  renderSalary();
}

function markSalaryPaid(id) {
  DB.updateSalary(id, { status: 'paid' });
  showToast('✅ បានបើកប្រាក់ខែ!', 'success');
  renderSalary();
}

// ===== LEAVE =====
function renderLeave() {
  const records = DB.getLeave().sort((a,b) => new Date(b.createdAt)-new Date(a.createdAt));
  const emps = DB.getEmployees();
  document.getElementById('leave-container').innerHTML = records.length ?
    `<div class="table-wrapper"><table class="data-table"><thead><tr><th>បុគ្គលិក</th><th>ប្រភេទ</th><th>ចាប់ផ្ដើម</th><th>បញ្ចប់</th><th>ថ្ងៃ</th><th>មូលហេតុ</th><th>ស្ថានភាព</th><th>សកម្មភាព</th></tr></thead><tbody>${records.map(l=>{
      const emp = emps.find(e=>e.id===l.empId);
      const days = l.startDate && l.endDate ? Math.ceil((new Date(l.endDate)-new Date(l.startDate))/(1000*60*60*24))+1 : '—';
      return `<tr>
        <td>${emp?.name||l.empId}</td>
        <td>${leaveTypeLabel(l.type)}</td><td>${l.startDate}</td><td>${l.endDate}</td><td>${days}</td>
        <td>${l.reason||'—'}</td>
        <td><span class="leave-badge ${l.status}">${leaveStatusLabel(l.status)}</span></td>
        <td>
          ${l.status==='pending'?`<button class="btn-icon edit" title="អនុម័ត" onclick="updateLeaveStatus('${l.id}','approved')"><i class="fas fa-check"></i></button><button class="btn-icon del" title="បដិសេធ" onclick="updateLeaveStatus('${l.id}','rejected')"><i class="fas fa-times"></i></button>`:''}
          <button class="btn-icon del" onclick="confirmDelete('leave','${l.id}')"><i class="fas fa-trash"></i></button>
        </td>
      </tr>`;
    }).join('')}</tbody></table></div>` :
    '<div class="empty-state large"><i class="fas fa-calendar-minus"></i><p>មិនមានច្បាប់ឈប់</p></div>';
}

function openLeaveModal() {
  const emps = DB.getEmployees();
  document.getElementById('l-emp').innerHTML = '<option value="">-- ជ្រើសរើស --</option>' +
    emps.map(e => `<option value="${e.id}">${e.name}</option>`).join('');
  document.getElementById('l-start').value = '';
  document.getElementById('l-end').value = '';
  document.getElementById('l-reason').value = '';
  document.getElementById('leave-modal').classList.add('active');
}

function saveLeave() {
  const empId = document.getElementById('l-emp').value;
  if (!empId) { showToast('សូមជ្រើសបុគ្គលិក!', 'error'); return; }
  DB.addLeave({
    empId,
    type: document.getElementById('l-type').value,
    startDate: document.getElementById('l-start').value,
    endDate: document.getElementById('l-end').value,
    reason: document.getElementById('l-reason').value,
    status: document.getElementById('l-status').value,
  });
  showToast('បានស្នើច្បាប់ឈប់រួចរាល់!', 'success');
  closeModal('leave-modal');
  renderLeave();
}

function updateLeaveStatus(id, status) {
  DB.updateLeave(id, { status });
  showToast(status === 'approved' ? 'បានអនុម័ត!' : 'បានបដិសេធ!', 'success');
  renderLeave();
}

// ===== REPORTS =====
function renderReports() {
  const emps  = DB.getEmployees();
  const att   = DB.getAttendance();
  const sal   = DB.getSalary();
  const leave = DB.getLeave();
  const depts = DB.getDepartments();
  const today = new Date();

  // Populate month filter
  const monthSel = document.getElementById('rpt-month-filter');
  if (monthSel && monthSel.options.length <= 1) {
    const months = [...new Set([
      ...sal.map(s => s.month),
      ...att.map(a => a.date.slice(0,7))
    ])].sort().reverse();
    months.forEach(m => {
      const o = document.createElement('option');
      o.value = m; o.textContent = m;
      monthSel.appendChild(o);
    });
  }

  // Populate dept filter
  const deptSel = document.getElementById('rpt-dept-filter');
  if (deptSel && deptSel.options.length <= 1) {
    depts.forEach(d => {
      const o = document.createElement('option');
      o.value = d.name; o.textContent = d.icon + ' ' + d.name;
      deptSel.appendChild(o);
    });
  }

  const mFilter    = (document.getElementById('rpt-month-filter')  || {}).value || '';
  const deptFilter = (document.getElementById('rpt-dept-filter')    || {}).value || '';

  const filtAtt = mFilter ? att.filter(a => a.date.startsWith(mFilter)) : att;
  const filtSal = mFilter ? sal.filter(s => s.month === mFilter) : sal;
  const filtLeave = leave;
  const filtEmps = deptFilter ? emps.filter(e => e.department === deptFilter) : emps;

  // ── KPI Row ──────────────────────────────────────────────────────
  const totalSal = filtSal.filter(s=>s.status==='paid')
    .reduce((sum,s)=>sum+parseFloat(s.base||0)+parseFloat(s.bonus||0)-parseFloat(s.deduction||0),0);
  const attRate = filtAtt.length
    ? Math.round(filtAtt.filter(a=>a.status==='present').length / filtAtt.length * 100) : 0;

  const kpis = [
    { icon:'fas fa-users',          label:'បុគ្គលិកសរុប',      val:emps.length,                          color:'#3B5BDB', sub:`${emps.filter(e=>e.status==='active').length} កំពុងធ្វើការ` },
    { icon:'fas fa-building',       label:'នាយកដ្ឋាន',         val:depts.length,                         color:'#059669', sub:'នាយកដ្ឋានសរុប' },
    { icon:'fas fa-calendar-check', label:'% វត្តមាន',         val:attRate+'%',                          color:'#0284C7', sub:`${filtAtt.filter(a=>a.status==='absent').length} ករណីអវត្តមាន` },
    { icon:'fas fa-money-bill-wave',label:'ប្រាក់ខែបានបើក',    val:filtSal.filter(s=>s.status==='paid').length, color:'#D97706', sub:formatMoney(totalSal) },
    { icon:'fas fa-calendar-minus', label:'ច្បាប់ឈប់',          val:filtLeave.length,                    color:'#7C3AED', sub:`${filtLeave.filter(l=>l.status==='pending').length} រង់ចាំ` },
  ];
  document.getElementById('rpt-kpi-row').innerHTML = kpis.map(k => `
    <div class="rpt-kpi-card" style="border-top:3px solid ${k.color};">
      <div class="rpt-kpi-icon" style="background:${k.color}18;color:${k.color};"><i class="${k.icon}"></i></div>
      <div class="rpt-kpi-val" style="color:${k.color};">${k.val}</div>
      <div class="rpt-kpi-label">${k.label}</div>
      <div class="rpt-kpi-sub">${k.sub}</div>
    </div>
  `).join('');

  // ── Attendance Donut (Canvas) ────────────────────────────────────
  const attCounts = {
    present: filtAtt.filter(a=>a.status==='present').length,
    absent:  filtAtt.filter(a=>a.status==='absent').length,
    late:    filtAtt.filter(a=>a.status==='late').length,
    half:    filtAtt.filter(a=>a.status==='half').length,
  };
  const attTotal = Object.values(attCounts).reduce((a,b)=>a+b,0) || 1;
  const attColors = { present:'#10B981', absent:'#EF4444', late:'#F59E0B', half:'#3B82F6' };
  const attLabelsKH = { present:'មានវត្តមាន', absent:'អវត្តមាន', late:'យឺត', half:'កន្លះថ្ងៃ' };

  const canvas = document.getElementById('rpt-att-donut');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    const cx = 80, cy = 80, r = 65, iR = 42;
    ctx.clearRect(0,0,160,160);
    let startA = -Math.PI/2;
    Object.entries(attCounts).forEach(([k,v]) => {
      if (!v) return;
      const slice = (v/attTotal)*Math.PI*2;
      ctx.beginPath(); ctx.moveTo(cx,cy);
      ctx.arc(cx,cy,r,startA,startA+slice);
      ctx.closePath(); ctx.fillStyle = attColors[k]; ctx.fill();
      startA += slice;
    });
    // inner white hole
    ctx.beginPath(); ctx.arc(cx,cy,iR,0,Math.PI*2);
    ctx.fillStyle='#fff'; ctx.fill();
    // center text
    ctx.fillStyle='#1A1F36'; ctx.textAlign='center';
    ctx.font='bold 22px Arial'; ctx.fillText(attRate+'%',cx,cy+4);
    ctx.font='10px Arial'; ctx.fillStyle='#5A6480'; ctx.fillText('វត្តមាន',cx,cy+18);
  }
  document.getElementById('rpt-att-legend').innerHTML = Object.entries(attCounts).map(([k,v]) => `
    <div style="display:flex;align-items:center;gap:8px;">
      <div style="width:10px;height:10px;border-radius:2px;background:${attColors[k]};flex-shrink:0;"></div>
      <span style="font-size:12px;color:var(--text-muted);flex:1;">${attLabelsKH[k]}</span>
      <span style="font-size:13px;font-weight:700;color:var(--text);">${v}</span>
      <span style="font-size:11px;color:var(--text-light);">${Math.round(v/attTotal*100)}%</span>
    </div>
  `).join('');

  // ── Leave Bars ───────────────────────────────────────────────────
  const leaveTypes = [
    {k:'approved', label:'អនុម័ត',    color:'#10B981'},
    {k:'pending',  label:'រង់ចាំ',    color:'#F59E0B'},
    {k:'rejected', label:'បដិសេធ',  color:'#EF4444'},
  ];
  const leaveMax = filtLeave.length || 1;
  document.getElementById('rpt-leave-bars').innerHTML = [
    `<div style="display:flex;justify-content:space-between;margin-bottom:4px;"><span style="font-size:12px;color:var(--text-muted);">ប្រភេទ</span><span style="font-size:12px;color:var(--text-muted);">ចំនួន</span></div>`,
    ...leaveTypes.map(lt => {
      const cnt = filtLeave.filter(l=>l.status===lt.k).length;
      const pct = Math.round(cnt/leaveMax*100);
      return `
        <div>
          <div style="display:flex;justify-content:space-between;margin-bottom:4px;">
            <span style="font-size:12px;font-weight:600;color:var(--text);">${lt.label}</span>
            <span style="font-size:12px;font-weight:700;color:${lt.color};">${cnt} <small style="color:var(--text-light);">(${pct}%)</small></span>
          </div>
          <div style="height:10px;background:var(--border);border-radius:5px;overflow:hidden;">
            <div style="width:${pct}%;height:100%;background:${lt.color};border-radius:5px;transition:width .6s ease;"></div>
          </div>
        </div>`;
    }),
    `<div style="margin-top:12px;padding:10px 14px;background:var(--bg);border-radius:8px;display:flex;justify-content:space-between;align-items:center;">
      <span style="font-size:13px;font-weight:600;color:var(--text-muted);">ស្នើសរុប</span>
      <span style="font-size:18px;font-weight:700;color:var(--primary);">${filtLeave.length}</span>
    </div>`
  ].join('');

  // ── Dept Bars ────────────────────────────────────────────────────
  const deptMax = Math.max(...depts.map(d => emps.filter(e=>e.department===d.name).length), 1);
  document.getElementById('rpt-dept-bars').innerHTML = depts.map(d => {
    const cnt = emps.filter(e=>e.department===d.name).length;
    const pct = Math.round(cnt/deptMax*100);
    return `
      <div>
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px;">
          <span style="font-size:12px;font-weight:600;color:var(--text);">${d.icon} ${d.name}</span>
          <span style="font-size:12px;font-weight:700;color:${d.color};">${cnt} នាក់</span>
        </div>
        <div style="height:10px;background:var(--border);border-radius:5px;overflow:hidden;">
          <div style="width:${pct}%;height:100%;background:${d.color};border-radius:5px;transition:width .6s ease;"></div>
        </div>
      </div>`;
  }).join('');

  // ── Salary Stats ─────────────────────────────────────────────────
  const salPaid    = filtSal.filter(s=>s.status==='paid');
  const salPending = filtSal.filter(s=>s.status==='pending');
  const totalPaid  = salPaid.reduce((sum,s)=>sum+parseFloat(s.base||0)+parseFloat(s.bonus||0)-parseFloat(s.deduction||0),0);
  const totalPend  = salPending.reduce((sum,s)=>sum+parseFloat(s.base||0)+parseFloat(s.bonus||0)-parseFloat(s.deduction||0),0);
  const avgSal     = emps.length ? Math.round(emps.reduce((s,e)=>s+(parseFloat(e.salary||0)),0)/emps.length) : 0;
  document.getElementById('rpt-salary-stats').innerHTML = `
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:12px;">
      <div style="background:linear-gradient(135deg,#059669,#10B981);border-radius:10px;padding:12px;color:#fff;text-align:center;">
        <div style="font-size:10px;opacity:.8;margin-bottom:4px;">បានបើករួច</div>
        <div style="font-size:13px;font-weight:700;">${salPaid.length} ករណី</div>
      </div>
      <div style="background:linear-gradient(135deg,#D97706,#F59E0B);border-radius:10px;padding:12px;color:#fff;text-align:center;">
        <div style="font-size:10px;opacity:.8;margin-bottom:4px;">រង់ចាំ</div>
        <div style="font-size:13px;font-weight:700;">${salPending.length} ករណី</div>
      </div>
    </div>
    <div style="background:var(--bg);border-radius:10px;padding:12px;margin-bottom:8px;">
      <div style="font-size:11px;color:var(--text-muted);margin-bottom:4px;">ប្រាក់ខែបានបើករួច</div>
      <div style="font-size:16px;font-weight:700;color:#059669;">${formatMoney(totalPaid)}</div>
    </div>
    <div style="background:var(--bg);border-radius:10px;padding:12px;margin-bottom:8px;">
      <div style="font-size:11px;color:var(--text-muted);margin-bottom:4px;">ប្រាក់ខែដែលរង់ចាំ</div>
      <div style="font-size:16px;font-weight:700;color:#D97706;">${formatMoney(totalPend)}</div>
    </div>
    <div style="background:linear-gradient(135deg,var(--primary),#7C3AED);border-radius:10px;padding:12px;color:#fff;">
      <div style="font-size:10px;opacity:.8;margin-bottom:2px;">ប្រាក់ខែជាមធ្យមក្នុង App</div>
      <div style="font-size:18px;font-weight:700;">${formatMoney(avgSal)}</div>
    </div>
  `;

  // ── Employee Detail Table ────────────────────────────────────────
  const tableEmps = filtEmps;
  if (!tableEmps.length) {
    document.getElementById('rpt-emp-table').innerHTML = '<div class="empty-state">មិនមានបុគ្គលិក</div>';
    return;
  }
  document.getElementById('rpt-emp-table').innerHTML = `
    <table class="data-table" style="min-width:700px;">
      <thead><tr>
        <th style="width:36px;">រូប</th>
        <th>ឈ្មោះ</th>
        <th>នាយកដ្ឋាន</th>
        <th>តួនាទី</th>
        <th style="text-align:center;">ស្ថានភាព</th>
        <th style="text-align:center;">វត្តមាន</th>
        <th style="text-align:center;">អវត្តមាន</th>
        <th style="text-align:right;">ប្រាក់ខែ</th>
      </tr></thead>
      <tbody>
        ${tableEmps.map(e => {
          const ea = filtAtt.filter(a=>a.empId===e.id);
          const eAbs = ea.filter(a=>a.status==='absent').length;
          const eOk  = ea.filter(a=>a.status==='present').length;
          const eRate = ea.length ? Math.round(eOk/ea.length*100) : 0;
          const deptColor = (depts.find(d=>d.name===e.department)||{}).color || '#3B5BDB';
          return `<tr>
            <td><div class="tbl-avatar" style="background:linear-gradient(135deg,${deptColor},${deptColor}88);">${e.photo?`<img src="${e.photo}"/>`:(getInitials(e.name)||'?')}</div></td>
            <td><strong>${e.name}</strong></td>
            <td><span style="background:${deptColor}18;color:${deptColor};padding:2px 8px;border-radius:12px;font-size:12px;font-weight:600;">${e.department}</span></td>
            <td style="color:var(--text-muted);font-size:13px;">${e.position}</td>
            <td style="text-align:center;"><span class="status-badge ${e.status}">${statusLabel(e.status)}</span></td>
            <td style="text-align:center;">
              <div style="display:flex;flex-direction:column;align-items:center;gap:2px;">
                <span style="font-size:12px;font-weight:700;color:${eRate>=80?'#059669':'#DC2626'};">${eRate}%</span>
                <div style="width:60px;height:5px;background:var(--border);border-radius:3px;overflow:hidden;"><div style="width:${eRate}%;height:100%;background:${eRate>=80?'#10B981':'#EF4444'};border-radius:3px;"></div></div>
              </div>
            </td>
            <td style="text-align:center;"><span style="font-size:13px;font-weight:700;color:${eAbs>3?'#DC2626':'var(--text)'};">${eAbs}</span></td>
            <td style="text-align:right;font-weight:600;font-size:13px;">${formatMoney(e.salary)}</td>
          </tr>`;
        }).join('')}
      </tbody>
    </table>
  `;
}

// ===== SETTINGS ===== =====
function exportData() {
  const data = DB.exportAll();
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `hrpro_backup_${new Date().toISOString().split('T')[0]}.json`;
  a.click();
  showToast('បាននាំចេញទិន្នន័យ!', 'success');
}

function importData(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = e => {
    try {
      const data = JSON.parse(e.target.result);
      DB.importAll(data);
      showToast('បាននាំចូលទិន្នន័យ!', 'success');
      renderPage(currentPage);
    } catch { showToast('ទិន្នន័យមិនត្រឹមត្រូវ!', 'error'); }
  };
  reader.readAsText(file);
}

function clearAllData() {
  showConfirm('តើអ្នកប្រាកដទេ? ទិន្នន័យទាំងអស់នឹងត្រូវលុប!', () => {
    DB.clearAll();
    DB.seed();
    showToast('បានលុបទិន្នន័យ!', 'success');
    renderPage(currentPage);
  });
}

// ===== DELETE =====
function confirmDelete(type, id) {
  const msgs = { employee: 'លុបបុគ្គលិក?', department: 'លុបនាយកដ្ឋាន?', attendance: 'លុបកំណត់ត្រានេះ?', salary: 'លុបកំណត់ត្រាប្រាក់ខែ?', leave: 'លុបច្បាប់ឈប់នេះ?' };
  showConfirm(msgs[type] || 'លុប?', () => {
    if (type === 'employee') DB.deleteEmployee(id);
    else if (type === 'department') DB.deleteDepartment(id);
    else if (type === 'attendance') DB.deleteAttendance(id);
    else if (type === 'salary') DB.deleteSalary(id);
    else if (type === 'leave') DB.deleteLeave(id);
    showToast('បានលុបរួចរាល់!', 'success');
    renderPage(currentPage);
  });
}

// ===== SEARCH =====
function globalSearch(q) {
  if (!q) return;
  navigate('employees');
  setTimeout(() => { document.getElementById('emp-search').value = q; filterEmployees(); }, 100);
}

// ===== MODAL HELPERS =====
function closeModal(id) {
  document.getElementById(id).classList.remove('active');
}

function showConfirm(msg, callback) {
  document.getElementById('confirm-msg').textContent = msg;
  document.getElementById('confirm-ok-btn').onclick = () => { callback(); closeModal('confirm-modal'); };
  document.getElementById('confirm-modal').classList.add('active');
}

// Close modal on overlay click
document.querySelectorAll('.modal-overlay').forEach(overlay => {
  overlay.addEventListener('click', e => { if (e.target === overlay) overlay.classList.remove('active'); });
});

// ===== TOAST =====
function showToast(msg, type = 'success') {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.className = `toast ${type} show`;
  setTimeout(() => toast.classList.remove('show'), 3000);
}

// ===== UTILS =====
function getInitials(name) {
  if (!name) return '?';
  const parts = name.trim().split(' ');
  return parts.length >= 2 ? (parts[0][0] + parts[parts.length-1][0]).toUpperCase() : name[0].toUpperCase();
}

function formatMoney(amount) {
  if (!amount) return '$0.00';
  return '$' + Number(amount).toLocaleString('en-US', {minimumFractionDigits:2, maximumFractionDigits:2});
}

function statusLabel(s) {
  const map = { active: 'កំពុងធ្វើការ', inactive: 'បានឈប់', leave: 'ឈប់សម្រាក' };
  return map[s] || s;
}

function attLabel(s) {
  const map = { present: 'មានវត្តមាន', absent: 'អវត្តមាន', late: 'យឺត', half: 'កន្លះថ្ងៃ' };
  return map[s] || s;
}

function leaveTypeLabel(t) {
  const map = { annual:'ច្បាប់ប្រចាំឆ្នាំ', sick:'ច្បាប់ជំងឺ', maternity:'ច្បាប់មាតុភាព', emergency:'ច្បាប់បន្ទាន់', unpaid:'ដោយគ្មានប្រាក់ខែ' };
  return map[t] || t;
}

function leaveStatusLabel(s) {
  const map = { pending:'រង់ចាំ', approved:'អនុម័ត', rejected:'បដិសេធ' };
  return map[s] || s;
}

// ===== ID CARDS =====

function populateIdcDeptFilter() {
  const depts = DB.getDepartments();
  const sel = document.getElementById('idc-dept-filter');
  if (!sel) return;
  const cur = sel.value;
  sel.innerHTML = '<option value="">នាយកដ្ឋានទាំងអស់</option>' +
    depts.map(d => `<option value="${d.name}" ${cur===d.name?'selected':''}>${d.icon} ${d.name}</option>`).join('');
}

function idcGetDeptColor(deptName) {
  const d = DB.getDepartments().find(d => d.name === deptName);
  return d ? d.color : '#3B5BDB';
}
function idcGetDeptIcon(deptName) {
  const d = DB.getDepartments().find(d => d.name === deptName);
  return d ? d.icon : '🏢';
}

function idcQR(empId) {
  // Return a placeholder div; real QR is generated after DOM render
  return `<div id="qr-idc-${empId}" style="width:100%;height:100%;"></div>`;
}

function renderIdCardQRCodes() {
  const emps = DB.getEmployees();
  emps.forEach(e => {
    const el = document.getElementById('qr-idc-' + e.id);
    if (!el || el.dataset.qrDone) return;
    el.dataset.qrDone = '1';
    const bankText = e.bank ? e.bank : (e.id + ' | ' + e.name);
    try {
      new QRCode(el, {
        text: bankText,
        width: 54, height: 54,
        colorDark: '#1a1f36', colorLight: '#ffffff',
        correctLevel: QRCode.CorrectLevel.M
      });
    } catch(err) { el.textContent = ''; }
  });
}

function idcStatusLabel(s) {
  return { active:'កំពុងធ្វើការ', inactive:'បានឈប់', leave:'ឈប់សម្រាក' }[s] || s;
}

function idcFormatDate(d) {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('km-KH', { year:'numeric', month:'short', day:'numeric' });
}

function renderIdCards() {
  const deptF   = (document.getElementById('idc-dept-filter')   || {}).value || '';
  const statusF = (document.getElementById('idc-status-filter') || {}).value || '';
  let emps = DB.getEmployees();
  if (deptF)   emps = emps.filter(e => e.department === deptF);
  if (statusF) emps = emps.filter(e => e.status === statusF);

  const grid = document.getElementById('idcards-container');
  if (!grid) return;
  if (!emps.length) {
    grid.innerHTML = `<div class="empty-state large"><i class="fas fa-id-card"></i><p>មិនមានបុគ្គលិក</p></div>`;
    return;
  }
  grid.innerHTML = emps.map(e => buildIdCard(e)).join('');
  setTimeout(renderIdCardQRCodes, 50);
}

function buildIdCard(e) {
  const color  = idcGetDeptColor(e.department);
  const icon   = idcGetDeptIcon(e.department);
  const init   = getInitials(e.name);
  const startY = e.startDate ? new Date(e.startDate).getFullYear() : new Date().getFullYear();
  const validY = startY + 5;

  // Rich gradient: base + deep shade + accent strip
  const c2  = adjustColor(color, -40);
  const c3  = adjustColor(color, +30);
  const grad = `linear-gradient(145deg, ${color}f0 0%, ${color}cc 45%, ${c2}ee 100%)`;

  const settings     = DB.getSettings();
  const companyName  = settings.companyName || 'HR Pro';
  const companySub   = settings.companySub  || 'Human Resources';
  const logoData     = settings.logoData    || '';

  // Generate initials from company name (up to 2 chars)
  const _cWords = companyName.trim().split(/\s+/).filter(Boolean);
  const companyInits = _cWords.length >= 2
    ? (_cWords[0][0] + _cWords[1][0]).toUpperCase()
    : companyName.substring(0, 2).toUpperCase();
  const _initFS = companyInits.length >= 2 ? '11px' : '14px';

  const logoHTML = logoData
    ? `<img src="${logoData}" style="width:100%;height:100%;object-fit:contain;border-radius:5px;"/>`
    : `<span style="font-size:${_initFS};font-weight:900;color:#fff;letter-spacing:0.5px;font-family:'Kantumruy Pro','Battambang',sans-serif;text-shadow:0 1px 4px rgba(0,0,0,.35);line-height:1;">${companyInits}</span>`;

  return `
<div class="idc-wrapper" id="wrap-${e.id}">

  <div class="idc-card" style="background:${grad};" onclick="">

    <!-- Decorative blobs — portrait positions -->
    <div class="idc-bg-circle" style="width:220px;height:220px;right:-70px;top:-70px;background:radial-gradient(circle,rgba(255,255,255,.09) 0%,transparent 70%);"></div>
    <div class="idc-bg-circle" style="width:160px;height:160px;left:-50px;bottom:-50px;background:radial-gradient(circle,rgba(255,255,255,.07) 0%,transparent 70%);"></div>
    <div class="idc-bg-circle" style="width:60px;height:60px;right:20px;bottom:80px;background:radial-gradient(circle,rgba(255,255,255,.06) 0%,transparent 70%);"></div>
    <!-- Diagonal accent stripe -->
    <div style="position:absolute;bottom:0;left:0;width:100%;height:140px;background:linear-gradient(180deg,transparent 0%,rgba(0,0,0,.18) 100%);pointer-events:none;z-index:1;"></div>

    <div class="idc-shimmer"></div>

    <!-- ===== FRONT (PORTRAIT) ===== -->
    <div class="idc-front" id="front-${e.id}">

      <!-- Header row -->
      <div class="idc-header">
        <div class="idc-header-inner">
          <div class="idc-logo-box">${logoHTML}</div>
          <div class="idc-company">
            <div class="idc-company-name" id="idc-co-name-${e.id}">${companyName}</div>
            <div class="idc-company-sub" id="idc-co-sub-${e.id}">${companySub}</div>
          </div>
          <div class="idc-badge">ID CARD</div>
        </div>
      </div>

      <!-- Body: photo centered, info below -->
      <div class="idc-body">

        <!-- Photo circle -->
        <div class="idc-photo-frame">
          ${e.photo
            ? `<img src="${e.photo}" alt="${e.name}"/>`
            : `<span class="idc-initials">${init}</span>`}
        </div>

        <!-- Dept icon -->
        <div style="font-size:18px;line-height:1;margin-top:-4px;">${icon}</div>

        <!-- Name + position -->
        <div class="idc-info">
          <div class="idc-name">${e.name}</div>
          <div class="idc-position">${e.position || '—'}</div>

          <!-- Dept pill -->
          <div class="idc-dept-pill">
            <i class="fas fa-sitemap" style="font-size:8px;opacity:.7;"></i>
            ${e.department || '—'}
          </div>

          <!-- Detail rows in a rounded box -->
          <div class="idc-info-grid">
            ${e.phone ? `<div class="idc-row"><i class="fas fa-phone-alt"></i><span>${e.phone}</span></div>` : ''}
            ${e.email ? `<div class="idc-row"><i class="fas fa-envelope"></i><span>${e.email}</span></div>` : ''}
            <div class="idc-row">
              <i class="fas fa-calendar-check"></i>
              <span>ចូលធ្វើការ: ${idcFormatDate(e.startDate)}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer bar -->
      <div class="idc-footer">
        <span class="idc-emp-id">${e.id}</span>
        <span class="idc-status-dot ${e.status}">${idcStatusLabel(e.status)}</span>
      </div>
    </div><!-- /front -->

    <!-- ===== BACK (PORTRAIT) ===== -->
    <div class="idc-back" id="back-${e.id}" style="background:${grad};">
      <div class="idc-mag-strip"></div>
      <div class="idc-sig-row"><span class="idc-sig-label">Signature / ហត្ថលេខា</span></div>
      <div class="idc-back-info">
        <div class="idc-qr" id="qr-idc-${e.id}"></div>
        <div class="idc-back-text">
          <strong>${e.name}</strong><br/>
          <span style="letter-spacing:1px;font-size:8px;opacity:.8;">${e.id}</span><br/>
          ${e.position || ''}${e.position && e.department ? ' · ' : ''}${e.department || ''}<br/>
          ${e.email || (companyName.toLowerCase().replace(/\s+/g,'') + '@company.com')}<br/>
          ${e.phone ? '☎ ' + e.phone : ''}
        </div>
      </div>
      <div class="idc-back-footer">
        <span class="idc-back-company">${companyName}</span>
        <span class="idc-back-valid">Valid thru ${validY}</span>
      </div>
    </div><!-- /back -->

  </div><!-- .idc-card -->

  <!-- Action buttons -->
  <div class="idc-actions">
    <button class="idc-btn" onclick="idcFlip('${e.id}')"><i class="fas fa-sync-alt"></i> ខាងក្រោយ</button>
    <button class="idc-btn primary" onclick="idcPrint('${e.id}')"><i class="fas fa-print"></i> បោះពុម្ព</button>
  </div>

</div>`; /* end idc-wrapper */
}

function adjustColor(hex, amount) {
  try {
    const num = parseInt(hex.replace('#',''), 16);
    const r = Math.min(255, Math.max(0, (num >> 16) + amount));
    const g = Math.min(255, Math.max(0, ((num >> 8) & 0xff) + amount));
    const b = Math.min(255, Math.max(0, (num & 0xff) + amount));
    return '#' + [r,g,b].map(v => v.toString(16).padStart(2,'0')).join('');
  } catch { return hex; }
}

function idcFlip(id) {
  const front = document.getElementById('front-' + id);
  const back  = document.getElementById('back-'  + id);
  if (!front || !back) return;
  if (back.classList.contains('visible')) {
    back.classList.remove('visible');
    front.classList.remove('hidden');
  } else {
    front.classList.add('hidden');
    back.classList.add('visible');
  }
}

function idcPrint(id) {
  const wrap = document.getElementById('wrap-' + id);
  if (!wrap) return;
  const card = wrap.querySelector('.idc-card');
  if (!card) return;

  const e        = DB.getEmployees().find(emp => emp.id === id);
  const settings = DB.getSettings();
  const companyName = settings.companyName || 'HR Pro';
  const companySub  = settings.companySub  || 'Human Resources';
  const logoData    = settings.logoData    || '';

  const clone   = card.cloneNode(true);
  clone.style.position = 'relative';
  const backEl  = clone.querySelector('[id^="back-"]');
  const frontEl = clone.querySelector('[id^="front-"]');
  if (backEl)  backEl.style.display  = 'none';
  if (frontEl) frontEl.classList.remove('hidden');

  // Build back clone separately (for print-both mode)
  const backClone = card.cloneNode(true);
  backClone.style.position = 'relative';
  const bFront = backClone.querySelector('[id^="front-"]');
  const bBack  = backClone.querySelector('[id^="back-"]');
  if (bFront) bFront.style.display = 'none';
  if (bBack)  { bBack.classList.add('visible'); bBack.style.display='flex'; }

  // Regenerate QR on back clone
  const qrDiv = backClone.querySelector('[id^="qr-idc-"]');
  if (qrDiv) {
    const bankText = e?.bank || (id + ' | ' + (e?.name||''));
    qrDiv.innerHTML = '';
    qrDiv.style.cssText = 'width:56px;height:56px;background:#fff;border-radius:8px;padding:4px;display:flex;align-items:center;justify-content:center;';
    try {
      new QRCode(qrDiv, { text: bankText, width:56, height:56, colorDark:'#1a1f36', colorLight:'#ffffff', correctLevel: QRCode.CorrectLevel.M });
    } catch(e) {}
  }

  const cardStyle = card.getAttribute('style') || '';

  const PRINT_CSS = `
*{box-sizing:border-box;margin:0;padding:0;}
@import url('https://fonts.googleapis.com/css2?family=Battambang:wght@400;700&family=Kantumruy+Pro:wght@300;400;500;600;700&display=swap');
body{
  background:#f0f0f0;
  font-family:'Kantumruy Pro','Battambang',sans-serif;
  display:flex;flex-direction:column;align-items:center;justify-content:flex-start;
  padding:28px 20px;gap:24px;min-height:100vh;
}
@media print{
  body{background:#fff;padding:0;display:block;}
  @page{margin:8mm;size:A4;}
  .card-sheet{margin:0;padding:0;}
  .no-print{display:none!important;}
  .idc-card,
  .idc-front,.idc-back,
  .idc-header,.idc-body,.idc-footer,
  .idc-info-grid,.idc-dept-pill,
  .idc-mag-strip,.idc-sig-row,
  .idc-back-info,.idc-back-footer,
  .idc-bg-circle{
    -webkit-print-color-adjust:exact!important;
    print-color-adjust:exact!important;
    color-adjust:exact!important;
  }
}
/* Card shell — portrait 240×380 */
.idc-card{
  width:240px;height:380px;border-radius:22px;
  position:relative;overflow:hidden;isolation:isolate;
  box-shadow:0 10px 40px rgba(0,0,0,.28),inset 0 1px 0 rgba(255,255,255,.2);
  -webkit-print-color-adjust:exact!important;
  print-color-adjust:exact!important;
  color-adjust:exact!important;
}
.idc-front,.idc-back{position:absolute;inset:0;flex-direction:column;}
.idc-front{display:flex;}
.idc-back{display:none;}
.idc-back.visible,.idc-back[style*="display:flex"]{display:flex!important;}
.idc-front.hidden{display:none!important;}

/* Header */
.idc-header{height:72px;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:0 16px;gap:3px;position:relative;z-index:2;background:rgba(0,0,0,.18);border-bottom:1px solid rgba(255,255,255,.15);}
.idc-header-inner{display:flex;align-items:center;gap:10px;width:100%;}
.idc-logo-box{width:36px;height:36px;border-radius:10px;background:rgba(255,255,255,.15);border:1.5px solid rgba(255,255,255,.5);display:flex;align-items:center;justify-content:center;font-size:15px;flex-shrink:0;box-shadow:0 3px 10px rgba(0,0,0,.25),inset 0 1px 0 rgba(255,255,255,.2);overflow:hidden;}
.idc-company{flex:1;line-height:1.25;}
.idc-company-name{font-size:12px;font-weight:800;color:#fff;letter-spacing:.4px;}
.idc-company-sub{font-size:7.5px;color:rgba(255,255,255,.55);letter-spacing:1.6px;text-transform:uppercase;margin-top:1px;}
.idc-badge{font-size:7px;letter-spacing:2px;text-transform:uppercase;color:#fff;border:1.5px solid rgba(255,255,255,.55);padding:3px 8px;border-radius:20px;background:rgba(255,255,255,.18);font-weight:700;white-space:nowrap;}
.idc-divider{display:none;}

/* Body — centered portrait */
.idc-body{flex:1;display:flex;flex-direction:column;align-items:center;padding:18px 16px 8px;gap:10px;position:relative;z-index:2;}
.idc-photo-frame{width:90px;height:90px;border-radius:50%;border:3px solid rgba(255,255,255,.85);overflow:hidden;background:rgba(255,255,255,.14);display:flex;align-items:center;justify-content:center;flex-shrink:0;box-shadow:0 6px 22px rgba(0,0,0,.3),0 0 0 5px rgba(255,255,255,.1);}
.idc-photo-frame img{width:100%;height:100%;object-fit:cover;}
.idc-initials{font-size:30px;font-weight:800;color:#fff;}
.idc-info{width:100%;display:flex;flex-direction:column;align-items:center;gap:2px;min-width:0;text-align:center;}
.idc-name{font-size:15px;font-weight:800;color:#fff;line-height:1.25;margin-bottom:1px;word-break:break-word;text-align:center;text-shadow:0 1px 5px rgba(0,0,0,.22);}
.idc-position{font-size:9.5px;color:rgba(255,255,255,.8);font-weight:600;margin-bottom:6px;letter-spacing:.3px;}
.idc-dept-pill{display:inline-flex;align-items:center;gap:5px;background:rgba(255,255,255,.18);border:1px solid rgba(255,255,255,.28);padding:3px 12px;border-radius:20px;font-size:9px;font-weight:700;color:#fff;letter-spacing:.3px;margin-bottom:8px;}
.idc-info-grid{width:100%;display:flex;flex-direction:column;gap:3px;background:rgba(0,0,0,.15);border-radius:12px;padding:10px 12px;margin-top:4px;}
.idc-row{display:flex;align-items:center;gap:7px;font-size:9px;color:rgba(255,255,255,.7);line-height:1.5;text-align:left;}
.idc-row i{width:12px;font-size:8px;flex-shrink:0;color:rgba(255,255,255,.55);text-align:center;}
.idc-row span{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;flex:1;}

/* Footer */
.idc-footer{position:absolute;bottom:0;left:0;right:0;height:38px;display:flex;align-items:center;padding:0 16px;justify-content:space-between;background:rgba(0,0,0,.28);border-top:1px solid rgba(255,255,255,.12);z-index:3;}
.idc-emp-id{font-size:9px;letter-spacing:2.5px;color:rgba(255,255,255,.7);font-family:monospace;font-weight:700;}
.idc-status-dot{display:flex;align-items:center;gap:5px;font-size:8.5px;font-weight:700;color:rgba(255,255,255,.85);}
.idc-status-dot::before{content:'';width:6px;height:6px;border-radius:50%;background:currentColor;}
.idc-status-dot.active{color:#6ee7b7;} .idc-status-dot.inactive{color:#fca5a5;} .idc-status-dot.leave{color:#fcd34d;}
.idc-bg-circle{position:absolute;border-radius:50%;pointer-events:none;z-index:1;}
.idc-shimmer{display:none;}

/* Back */
.idc-mag-strip{height:44px;background:#0a0a0a;margin-top:28px;border-top:1px solid rgba(255,255,255,.06);border-bottom:1px solid rgba(255,255,255,.04);}
.idc-sig-row{margin:10px 18px 0;height:34px;background:repeating-linear-gradient(-45deg,#fff 0,#fff 3px,#f0f0f0 3px,#f0f0f0 6px);border-radius:6px;display:flex;align-items:center;padding:0 10px;}
.idc-sig-label{font-size:7.5px;color:#aaa;letter-spacing:1.5px;text-transform:uppercase;}
.idc-back-info{flex:1;padding:14px 18px;display:flex;flex-direction:column;gap:12px;align-items:center;}
.idc-qr{width:72px;height:72px;flex-shrink:0;background:#fff;border-radius:10px;padding:5px;box-shadow:0 3px 12px rgba(0,0,0,.2);}
.idc-qr canvas,.idc-qr img{width:100%!important;height:100%!important;border-radius:5px;}
.idc-back-text{font-size:9px;line-height:1.8;color:rgba(255,255,255,.55);text-align:center;width:100%;}
.idc-back-text strong{color:rgba(255,255,255,.9);font-weight:700;}
.idc-back-footer{padding:9px 18px;display:flex;justify-content:space-between;align-items:center;border-top:1px solid rgba(255,255,255,.1);}
.idc-back-company{font-size:11px;font-weight:800;color:rgba(255,255,255,.8);}
.idc-back-valid{font-size:8.5px;color:rgba(255,255,255,.45);letter-spacing:1.2px;text-transform:uppercase;}

/* Print layout */
.card-sheet{display:flex;flex-direction:column;gap:16px;align-items:center;}
.card-row{display:flex;gap:16px;align-items:flex-start;justify-content:center;}
.card-label{font-size:10px;font-weight:700;color:#94a3b8;text-align:center;margin-bottom:5px;letter-spacing:1px;text-transform:uppercase;}
.print-btn{display:inline-flex;align-items:center;gap:7px;padding:10px 22px;background:linear-gradient(135deg,#1A237E,#3B5BDB);color:#fff;border:none;border-radius:10px;font-size:13px;font-weight:700;cursor:pointer;box-shadow:0 4px 14px rgba(59,91,219,.35);}
.print-btn:hover{opacity:.9;}
`;

  const html = `<!DOCTYPE html>
<html lang="km">
<head>
<meta charset="UTF-8"/>
<title>ID Card — ${e?.name || id}</title>
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css"/>
<script src="https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js"><\/script>
<style>${PRINT_CSS}</style>
</head>
<body>

<button class="print-btn no-print" onclick="window.print()">🖨️ បោះពុម្ព / Print</button>

<div class="card-sheet">
  <!-- Front -->
  <div>
    <div class="card-label">FRONT</div>
    <div class="card-row">
      <div class="idc-card" style="${cardStyle}">
        ${clone.innerHTML}
      </div>
    </div>
  </div>

  <!-- Back -->
  <div>
    <div class="card-label">BACK</div>
    <div class="card-row">
      <div class="idc-card" id="back-card-print" style="${cardStyle}">
        ${backClone.innerHTML}
      </div>
    </div>
  </div>
</div>

<script>
window.onload = function() {
  // Regenerate QR codes
  var qrEls = document.querySelectorAll('[id^="qr-idc-"]');
  qrEls.forEach(function(el) {
    if (el.children.length > 0) return;
    el.style.cssText = 'width:56px;height:56px;background:#fff;border-radius:8px;padding:4px;display:flex;align-items:center;justify-content:center;';
    try {
      new QRCode(el, {
        text: '${(e?.bank || id + ' | ' + (e?.name||'')).replace(/'/g,"\'")}',
        width:56, height:56,
        colorDark:'#1a1f36', colorLight:'#ffffff',
        correctLevel: QRCode.CorrectLevel.M
      });
    } catch(e) {}
  });
  // Logo images
  var imgs = document.querySelectorAll('.idc-logo-box img');
  imgs.forEach(function(img) { img.style.cssText='width:100%;height:100%;object-fit:contain;border-radius:5px;'; });
};
<\/script>
</body>
</html>`;

  const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
  const url  = URL.createObjectURL(blob);
  const win  = window.open(url, '_blank');
  if (!win) {
    const a = document.createElement('a');
    a.href = url; a.download = 'idcard-' + id + '.html'; a.click();
    showToast('បើក file HTML ហើយ Ctrl+P ដើម្បីបោះពុម្ព', 'info');
  }
  setTimeout(() => URL.revokeObjectURL(url), 15000);
}


function getAttendanceExportData() {
  const dateF = document.getElementById('att-date-filter')?.value || '';
  const empF  = document.getElementById('att-emp-filter')?.value  || '';
  let records = DB.getAttendance();
  if (dateF) records = records.filter(a => a.date === dateF);
  if (empF)  records = records.filter(a => a.empId === empF);
  records = records.sort((a,b) => new Date(b.date) - new Date(a.date));
  const emps = DB.getEmployees();
  return records.map(a => {
    const emp = emps.find(e => e.id === a.empId);
    return {
      'លេខបុគ្គលិក':  a.empId,
      'ឈ្មោះ':         emp?.name || a.empId,
      'នាយកដ្ឋាន':    emp?.department || '',
      'ថ្ងៃ':          a.date,
      'ម៉ោងចូល':     a.timeIn  || '—',
      'ម៉ោងចេញ':    a.timeOut || '—',
      'ស្ថានភាព':     attLabel(a.status),
      'កំណត់ចំណាំ':   a.note   || '',
    };
  });
}

function exportAttExcel() {
  if (typeof XLSX === 'undefined') { showToast('កំពុងទាញ library... សូមព្យាយាមម្តងទៀត', 'error'); return; }
  const data = getAttendanceExportData();
  if (!data.length) { showToast('មិនមានទិន្នន័យវត្តមាន!', 'error'); return; }

  const wb = XLSX.utils.book_new();

  // ── Sheet 1: raw data ──────────────────────────────────────────────
  const ws = XLSX.utils.json_to_sheet(data);

  // Column widths
  ws['!cols'] = [
    {wch:12},{wch:28},{wch:18},{wch:14},{wch:12},{wch:12},{wch:16},{wch:22}
  ];

  // Style header row (row 1) — blue bg, white bold
  const range = XLSX.utils.decode_range(ws['!ref']);
  for (let C = range.s.c; C <= range.e.c; C++) {
    const addr = XLSX.utils.encode_cell({r:0, c:C});
    if (!ws[addr]) continue;
    ws[addr].s = {
      fill: { patternType:'solid', fgColor:{ rgb:'3B5BDB' } },
      font: { bold:true, color:{ rgb:'FFFFFF' }, sz:11 },
      alignment: { horizontal:'center', vertical:'center', wrapText:true },
      border: { bottom:{ style:'medium', color:{ rgb:'1A237E' } } }
    };
  }
  // Zebra + status coloring on data rows
  const STATUS_COLORS = { 'មានវត្តមាន':'BBF7D0','អវត្តមាន':'FECACA','យឺត':'FED7AA','កន្លះថ្ងៃ':'BAE6FD' };
  for (let R = 1; R <= range.e.r; R++) {
    const statusCell = ws[XLSX.utils.encode_cell({r:R, c:6})];
    const statusVal  = statusCell ? statusCell.v : '';
    const statusColor = STATUS_COLORS[statusVal] || (R%2===0 ? 'F8FAFF' : 'FFFFFF');
    for (let C = range.s.c; C <= range.e.c; C++) {
      const addr = XLSX.utils.encode_cell({r:R, c:C});
      if (!ws[addr]) ws[addr] = {t:'s', v:''};
      const isStatus = (C===6);
      ws[addr].s = {
        fill: { patternType:'solid', fgColor:{ rgb: isStatus ? statusColor : (R%2===0 ? 'F8FAFF':'FFFFFF') } },
        font: { sz:10, bold: isStatus, color:{ rgb: statusVal==='អវត្តមាន'&&isStatus ? 'DC2626' : '1A1F36' } },
        alignment: { horizontal: C<=1||C>=4 ? 'center':'left', vertical:'center' },
        border: { bottom:{ style:'thin', color:{ rgb:'C7D2FE' } }, right:{ style:'thin', color:{ rgb:'C7D2FE' } } }
      };
    }
  }
  XLSX.utils.book_append_sheet(wb, ws, 'វត្តមានលម្អិត');

  // ── Sheet 2: summary per employee ─────────────────────────────────
  const allAtt = DB.getAttendance();
  const emps   = DB.getEmployees();
  const summaryRows = emps.map(e => {
    const ea = allAtt.filter(a => a.empId === e.id);
    const c  = {present:0,absent:0,late:0,half:0};
    ea.forEach(a => { if(c[a.status]!==undefined) c[a.status]++; });
    const total = ea.length || 1;
    return {
      'លេខ': e.id,
      'ឈ្មោះ': e.name,
      'នាយកដ្ឋាន': e.department,
      'មានវត្តមាន': c.present,
      'អវត្តមាន': c.absent,
      'យឺត': c.late,
      'កន្លះថ្ងៃ': c.half,
      '% វត្តមាន': `${(c.present/total*100).toFixed(1)}%`,
      '% អវត្តមាន': `${(c.absent/total*100).toFixed(1)}%`,
    };
  });
  const ws2 = XLSX.utils.json_to_sheet(summaryRows);
  ws2['!cols'] = [{wch:12},{wch:28},{wch:18},{wch:12},{wch:12},{wch:10},{wch:12},{wch:14},{wch:14}];
  for (let C = 0; C <= 8; C++) {
    const addr = XLSX.utils.encode_cell({r:0, c:C});
    if (ws2[addr]) ws2[addr].s = {
      fill:{ patternType:'solid', fgColor:{ rgb:'1A237E' } },
      font:{ bold:true, color:{ rgb:'FFFFFF' }, sz:11 },
      alignment:{ horizontal:'center', vertical:'center' }
    };
  }
  XLSX.utils.book_append_sheet(wb, ws2, 'សង្ខេបបុគ្គលិក');

  // ── Sheet 3: absent only ──────────────────────────────────────────
  const absentData = DB.getAttendance()
    .filter(a => a.status === 'absent')
    .sort((a,b)=>a.date.localeCompare(b.date))
    .map(a => {
      const emp = emps.find(e=>e.id===a.empId);
      return { 'ថ្ងៃ':a.date, 'លេខ':a.empId, 'ឈ្មោះ':emp?.name||a.empId, 'នាយកដ្ឋាន':emp?.department||'', 'ស្ថានភាព':'អវត្តមាន ❌' };
    });
  const ws3 = XLSX.utils.json_to_sheet(absentData.length ? absentData : [{'ចំណាំ':'មិនមានអវត្តមាន'}]);
  ws3['!cols'] = [{wch:14},{wch:12},{wch:28},{wch:18},{wch:16}];
  for (let C=0; C<=4; C++) {
    const addr = XLSX.utils.encode_cell({r:0,c:C});
    if (ws3[addr]) ws3[addr].s = {
      fill:{ patternType:'solid', fgColor:{ rgb:'C0392B' } },
      font:{ bold:true, color:{ rgb:'FFFFFF' }, sz:11 },
      alignment:{ horizontal:'center' }
    };
  }
  XLSX.utils.book_append_sheet(wb, ws3, 'អវត្តមានប៉ុណ្ណោះ');

  const today = new Date().toISOString().split('T')[0];
  XLSX.writeFile(wb, `hrpro_attendance_${today}.xlsx`);
  showToast('បានទាញ Excel ចំនួន 3 sheets រួចរាល់! ✅', 'success');
}

function exportAttPDF() {
  if (typeof jspdf === 'undefined' && typeof window.jspdf === 'undefined') {
    showToast('កំពុងទាញ library... សូមព្យាយាមម្តងទៀត', 'error'); return;
  }
  const { jsPDF } = window.jspdf;
  const data   = getAttendanceExportData();
  if (!data.length) { showToast('មិនមានទិន្នន័យវត្តមាន!', 'error'); return; }

  const doc = new jsPDF({ orientation:'landscape', unit:'mm', format:'a4' });
  const today = new Date().toLocaleDateString('en-GB');
  const pw = doc.internal.pageSize.getWidth();

  // ── Helper: draw page header ──────────────────────────────────────
  function drawHeader(titleText, subText) {
    doc.setFillColor(26,35,126);
    doc.rect(0,0,pw,18,'F');
    doc.setFillColor(59,91,219);
    doc.rect(0,18,pw,9,'F');
    doc.setTextColor(255,255,255);
    doc.setFontSize(14); doc.setFont('helvetica','bold');
    doc.text(titleText, pw/2, 11, {align:'center'});
    doc.setFontSize(8);  doc.setFont('helvetica','normal');
    doc.text(subText, pw/2, 24, {align:'center'});
    doc.setTextColor(30,31,60);
  }

  function drawFooter() {
    const ph = doc.internal.pageSize.getHeight();
    doc.setFillColor(238,242,255);
    doc.rect(0, ph-10, pw, 10, 'F');
    doc.setFontSize(7); doc.setTextColor(90,100,128); doc.setFont('helvetica','normal');
    doc.text(`HR Pro — Human Resources Management System  |  Confidential  |  ${today}`, pw/2, ph-3, {align:'center'});
  }

  const STATUS_EN = {'មានវត្តមាន':'Present','អវត្តមាន':'ABSENT','យឺត':'Late','កន្លះថ្ងៃ':'Half-day'};
  const STATUS_COLORS_PDF = {
    'Present':  [187,247,208],
    'ABSENT':   [254,202,202],
    'Late':     [254,215,170],
    'Half-day': [186,230,253],
  };

  // ── PAGE 1: All Attendance ─────────────────────────────────────────
  drawHeader('HR Pro — Attendance Report', `Printed: ${today}  |  Total Records: ${data.length}`);

  const cols1 = ['#','Date','Employee','Department','Time In','Time Out','Status','Note'];
  const rows1 = data.map((r,i) => [
    i+1,
    r['ថ្ងៃ'],
    r['ឈ្មោះ'],
    r['នាយកដ្ឋាន'],
    r['ម៉ោងចូល'],
    r['ម៉ោងចេញ'],
    STATUS_EN[r['ស្ថានភាព']] || r['ស្ថានភាព'],
    r['កំណត់ចំណាំ'] || '',
  ]);

  doc.autoTable({
    head: [cols1],
    body: rows1,
    startY: 32,
    margin: { left:10, right:10 },
    headStyles: { fillColor:[26,35,126], textColor:255, fontSize:8, fontStyle:'bold', halign:'center' },
    bodyStyles: { fontSize:8, textColor:[26,31,54] },
    columnStyles: {
      0:{halign:'center',cellWidth:8},
      1:{halign:'center',cellWidth:22},
      2:{halign:'left',  cellWidth:45},
      3:{halign:'left',  cellWidth:28},
      4:{halign:'center',cellWidth:18},
      5:{halign:'center',cellWidth:18},
      6:{halign:'center',cellWidth:22},
      7:{halign:'left',  cellWidth:'auto'},
    },
    alternateRowStyles: { fillColor:[248,250,255] },
    didParseCell(d) {
      if (d.section==='body' && d.column.index===6) {
        const sc = STATUS_COLORS_PDF[d.cell.raw] || [248,250,255];
        d.cell.styles.fillColor = sc;
        if (d.cell.raw==='ABSENT') d.cell.styles.textColor=[220,38,38];
        d.cell.styles.fontStyle='bold';
      }
    },
    didDrawPage() { drawFooter(); }
  });

  // ── PAGE 2: Absent Only ─────────────────────────────────────────────
  doc.addPage();
  const allAtt2  = DB.getAttendance().filter(a=>a.status==='absent').sort((a,b)=>a.date.localeCompare(b.date));
  const emps2    = DB.getEmployees();

  drawHeader('HR Pro — Absent Detail Report  ⚠', `Total Absent Cases: ${allAtt2.length}  |  Printed: ${today}`);

  // KPI bar
  const kpiY = 32;
  const kpiW = (pw-20)/4;
  const kpis = [
    {label:'Total Absent', val:allAtt2.length, c:[220,38,38]},
    {label:'Employees Affected', val:new Set(allAtt2.map(a=>a.empId)).size, c:[217,119,6]},
    {label:'Absence Rate', val:`${(allAtt2.length/Math.max(DB.getAttendance().length,1)*100).toFixed(1)}%`, c:[59,91,219]},
    {label:'Work Days Tracked', val:DB.getAttendance().filter((a,i,arr)=>arr.findIndex(b=>b.date===a.date)===i).length, c:[22,163,74]},
  ];
  kpis.forEach((k,i) => {
    const x = 10 + i*(kpiW+2);
    doc.setFillColor(...k.c);
    doc.roundedRect(x, kpiY, kpiW, 16, 2, 2, 'F');
    doc.setTextColor(255,255,255);
    doc.setFontSize(14); doc.setFont('helvetica','bold');
    doc.text(String(k.val), x+kpiW/2, kpiY+9, {align:'center'});
    doc.setFontSize(7);  doc.setFont('helvetica','normal');
    doc.text(k.label, x+kpiW/2, kpiY+14, {align:'center'});
  });

  // Per-employee mini summary
  const summaryY = kpiY + 22;
  doc.setTextColor(26,35,126); doc.setFontSize(10); doc.setFont('helvetica','bold');
  doc.text('Absent Count per Employee', 10, summaryY);
  const perEmp = emps2.map(e => ({
    name:e.name, dept:e.department,
    cnt: allAtt2.filter(a=>a.empId===e.id).length
  })).filter(r=>r.cnt>0).sort((a,b)=>b.cnt-a.cnt);

  doc.autoTable({
    head:[['Employee','Department','Absent Days','Rate vs Total Att']],
    body: perEmp.map(r=>[r.name, r.dept, r.cnt, `${(r.cnt/Math.max(DB.getAttendance().filter(a=>a.empId===DB.getEmployees().find(e=>e.name===r.name)?.id).length,1)*100).toFixed(0)}%`]),
    startY: summaryY+4,
    margin:{left:10,right:10},
    headStyles:{fillColor:[192,57,43],textColor:255,fontSize:8,fontStyle:'bold'},
    bodyStyles:{fontSize:8},
    columnStyles:{0:{cellWidth:60},1:{cellWidth:40},2:{halign:'center',cellWidth:30},3:{halign:'center'}},
    alternateRowStyles:{fillColor:[255,245,245]},
    didDrawPage(){ drawFooter(); }
  });

  // Full absent log
  doc.autoTable({
    head:[['#','Date','Employee','Department','Status']],
    body: allAtt2.map((a,i)=>{
      const emp=emps2.find(e=>e.id===a.empId);
      return [i+1, a.date, emp?.name||a.empId, emp?.department||'', 'ABSENT ✗'];
    }),
    startY: doc.lastAutoTable.finalY + 8,
    margin:{left:10,right:10},
    headStyles:{fillColor:[192,57,43],textColor:255,fontSize:8,fontStyle:'bold',halign:'center'},
    bodyStyles:{fontSize:8,textColor:[127,0,0]},
    columnStyles:{0:{halign:'center',cellWidth:10},1:{halign:'center',cellWidth:25},2:{cellWidth:60},3:{cellWidth:40},4:{halign:'center',fontStyle:'bold'}},
    alternateRowStyles:{fillColor:[255,228,225]},
    didParseCell(d){ if(d.section==='body'&&d.column.index===4){d.cell.styles.fillColor=[254,202,202];} },
    didDrawPage(){ drawFooter(); }
  });

  const dateStr = new Date().toISOString().split('T')[0];
  doc.save(`hrpro_attendance_report_${dateStr}.pdf`);
  showToast('បានទាញ PDF ចំនួន 2 pages រួចរាល់! ✅', 'success');
}

// ===== REPORT EXPORTS =====
function exportReportExcel() {
  if (typeof XLSX === 'undefined') { showToast('Library មិនទាន់ Load... ព្យាយាមម្តងទៀត', 'error'); return; }
  const emps  = DB.getEmployees();
  const att   = DB.getAttendance();
  const sal   = DB.getSalary();
  const leave = DB.getLeave();
  const depts = DB.getDepartments();
  const wb    = XLSX.utils.book_new();

  // Sheet 1: Employee Summary
  const empData = emps.map((e,i) => {
    const ea = att.filter(a=>a.empId===e.id);
    const ok  = ea.filter(a=>a.status==='present').length;
    const abs = ea.filter(a=>a.status==='absent').length;
    const late= ea.filter(a=>a.status==='late').length;
    const rate = ea.length ? (ok/ea.length*100).toFixed(1)+'%' : '0%';
    const esal = sal.filter(s=>s.empId===e.id&&s.status==='paid')
      .reduce((sum,s)=>sum+parseFloat(s.base||0)+parseFloat(s.bonus||0)-parseFloat(s.deduction||0),0);
    return {
      'លេខ': e.id, 'ឈ្មោះ': e.name, 'ភេទ': e.gender==='male'?'ប្រុស':'ស្រី',
      'នាយកដ្ឋាន': e.department, 'តួនាទី': e.position,
      'ស្ថានភាព': statusLabel(e.status),
      'ថ្ងៃចូល': e.startDate||'',
      'មានវត្តមាន': ok, 'អវត្តមាន': abs, 'យឺត': late,
      '% វត្តមាន': rate,
      'ប្រាក់ខែ': e.salary,
      'ប្រាក់ខែបានបើក': esal
    };
  });
  const ws1 = XLSX.utils.json_to_sheet(empData);
  ws1['!cols'] = [{wch:10},{wch:28},{wch:8},{wch:18},{wch:22},{wch:16},{wch:14},{wch:10},{wch:10},{wch:8},{wch:10},{wch:14},{wch:16}];
  XLSX.utils.book_append_sheet(wb, ws1, 'ស្ថិតិបុគ្គលិក');

  // Sheet 2: Department Summary
  const deptData = depts.map(d => {
    const cnt = emps.filter(e=>e.department===d.name).length;
    const dAtt = att.filter(a=>emps.find(e=>e.id===a.empId&&e.department===d.name));
    return {
      'នាយកដ្ឋាន': d.name, 'ប្រធាន': d.head||'',
      'ចំនួនបុគ្គលិក': cnt,
      'វត្តមាន': dAtt.filter(a=>a.status==='present').length,
      'អវត្តមាន': dAtt.filter(a=>a.status==='absent').length,
    };
  });
  const ws2 = XLSX.utils.json_to_sheet(deptData);
  ws2['!cols'] = [{wch:20},{wch:28},{wch:16},{wch:12},{wch:12}];
  XLSX.utils.book_append_sheet(wb, ws2, 'ស្ថិតិនាយកដ្ឋាន');

  // Sheet 3: Salary
  const salData = sal.map(s => {
    const emp = emps.find(e=>e.id===s.empId);
    const net = parseFloat(s.base||0)+parseFloat(s.bonus||0)-parseFloat(s.deduction||0);
    return {
      'បុគ្គលិក': emp?.name||s.empId, 'នាយកដ្ឋាន': emp?.department||'',
      'ខែ': s.month, 'ប្រាក់ខែ': s.base||0,
      'ប្រាក់លើថ្លៃ': s.bonus||0, 'កាត់': s.deduction||0,
      'សរុប': net,
      'ស្ថានភាព': s.status==='paid'?'បានបើក':'រង់ចាំ'
    };
  });
  const ws3 = XLSX.utils.json_to_sheet(salData.length ? salData : [{'ចំណាំ':'មិនមានទិន្នន័យ'}]);
  ws3['!cols'] = [{wch:28},{wch:18},{wch:10},{wch:14},{wch:14},{wch:12},{wch:16},{wch:12}];
  XLSX.utils.book_append_sheet(wb, ws3, 'ប្រាក់ខែ');

  // Sheet 4: Leave
  const leaveData = leave.map(l => {
    const emp = emps.find(e=>e.id===l.empId);
    const days = l.startDate&&l.endDate ? Math.ceil((new Date(l.endDate)-new Date(l.startDate))/(864e5))+1 : '';
    return {
      'បុគ្គលិក': emp?.name||l.empId, 'ប្រភេទ': leaveTypeLabel(l.type),
      'ចាប់ផ្ដើម': l.startDate||'', 'បញ្ចប់': l.endDate||'',
      'ចំនួនថ្ងៃ': days, 'មូលហេតុ': l.reason||'',
      'ស្ថានភាព': leaveStatusLabel(l.status)
    };
  });
  const ws4 = XLSX.utils.json_to_sheet(leaveData.length ? leaveData : [{'ចំណាំ':'មិនមានទិន្នន័យ'}]);
  ws4['!cols'] = [{wch:28},{wch:20},{wch:13},{wch:13},{wch:10},{wch:30},{wch:12}];
  XLSX.utils.book_append_sheet(wb, ws4, 'ច្បាប់ឈប់');

  XLSX.writeFile(wb, `hrpro_report_${new Date().toISOString().split('T')[0]}.xlsx`);
  showToast('បានទាញ Excel ចំនួន 4 Sheets! ✅', 'success');
}

function exportReportPDF() {
  if (!window.jspdf) { showToast('Library មិនទាន់ Load... ព្យាយាមម្តងទៀត', 'error'); return; }
  const { jsPDF } = window.jspdf;
  const emps  = DB.getEmployees();
  const att   = DB.getAttendance();
  const sal   = DB.getSalary();
  const leave = DB.getLeave();
  const depts = DB.getDepartments();
  const today = new Date().toLocaleDateString('en-GB');
  const doc   = new jsPDF({ orientation:'landscape', unit:'mm', format:'a4' });
  const pw    = doc.internal.pageSize.getWidth();
  const ph    = doc.internal.pageSize.getHeight();

  function header(t1, t2) {
    doc.setFillColor(26,35,126); doc.rect(0,0,pw,17,'F');
    doc.setFillColor(59,91,219); doc.rect(0,17,pw,9,'F');
    doc.setTextColor(255,255,255);
    doc.setFontSize(13); doc.setFont('helvetica','bold'); doc.text(t1,pw/2,11,{align:'center'});
    doc.setFontSize(8);  doc.setFont('helvetica','normal'); doc.text(t2,pw/2,23,{align:'center'});
    doc.setTextColor(26,31,54);
  }
  function footer() {
    doc.setFillColor(238,242,255); doc.rect(0,ph-9,pw,9,'F');
    doc.setFontSize(7); doc.setTextColor(90,100,128); doc.setFont('helvetica','normal');
    doc.text('HR Pro — Human Resources Management System  |  Confidential  |  ' + today, pw/2, ph-3, {align:'center'});
  }

  // ── Page 1: KPI Summary ──────────────────────────────────────────
  const totalPaid = sal.filter(s=>s.status==='paid').reduce((s,r)=>s+parseFloat(r.base||0)+parseFloat(r.bonus||0)-parseFloat(r.deduction||0),0);
  const attRate   = att.length ? Math.round(att.filter(a=>a.status==='present').length/att.length*100) : 0;
  header('HR Pro — របាយការណ៍សង្ខេបប្រចាំខែ', `Printed: ${today}  |  Employees: ${emps.length}  |  Departments: ${depts.length}`);

  // KPI boxes
  const kpiW = (pw-20)/4 - 2;
  const kpiDefs = [
    {label:'Total Employees', val:emps.length,  sub:emps.filter(e=>e.status==='active').length+' Active', c:[59,91,219]},
    {label:'Attendance Rate', val:attRate+'%',  sub:att.filter(a=>a.status==='absent').length+' Absent', c:[2,132,199]},
    {label:'Salary Paid',     val:sal.filter(s=>s.status==='paid').length, sub:'records', c:[5,150,105]},
    {label:'Leave Requests',  val:leave.length, sub:leave.filter(l=>l.status==='pending').length+' Pending', c:[124,58,237]},
  ];
  kpiDefs.forEach((k,i) => {
    const x = 10 + i*(kpiW+3);
    doc.setFillColor(...k.c); doc.roundedRect(x,30,kpiW,20,2,2,'F');
    doc.setTextColor(255,255,255);
    doc.setFontSize(16); doc.setFont('helvetica','bold'); doc.text(String(k.val), x+kpiW/2, 43, {align:'center'});
    doc.setFontSize(8);  doc.setFont('helvetica','normal');
    doc.text(k.label, x+kpiW/2, 38, {align:'center'});
    doc.text(k.sub,   x+kpiW/2, 48, {align:'center'});
  });
  doc.setTextColor(26,31,54);

  // Employee table
  doc.setFontSize(10); doc.setFont('helvetica','bold');
  doc.setTextColor(26,35,126); doc.text('Employee Detail', 10, 58);
  doc.autoTable({
    head:[['#','Name','Department','Position','Status','Present','Absent','Rate','Salary']],
    body: emps.map((e,i)=>{
      const ea = att.filter(a=>a.empId===e.id);
      const ok = ea.filter(a=>a.status==='present').length;
      const ab = ea.filter(a=>a.status==='absent').length;
      const rt = ea.length?(ok/ea.length*100).toFixed(0)+'%':'0%';
      return [i+1, e.name, e.department, e.position,
              {active:'Active',inactive:'Inactive',leave:'On Leave'}[e.status]||e.status,
              ok, ab, rt, '$'+Number(e.salary||0).toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2})];
    }),
    startY:62, margin:{left:10,right:10},
    headStyles:{fillColor:[26,35,126],textColor:255,fontSize:7.5,fontStyle:'bold',halign:'center'},
    bodyStyles:{fontSize:7.5,textColor:[26,31,54]},
    columnStyles:{0:{halign:'center',cellWidth:8},4:{halign:'center'},5:{halign:'center'},6:{halign:'center'},7:{halign:'center',fontStyle:'bold'},8:{halign:'right'}},
    alternateRowStyles:{fillColor:[248,250,255]},
    didParseCell(d){
      if(d.section==='body'){
        if(d.column.index===4){
          if(d.cell.raw==='Active'){d.cell.styles.textColor=[5,150,105];d.cell.styles.fontStyle='bold';}
          if(d.cell.raw==='Inactive'){d.cell.styles.textColor=[220,38,38];}
          if(d.cell.raw==='On Leave'){d.cell.styles.textColor=[217,119,6];}
        }
        if(d.column.index===6&&parseInt(d.cell.raw)>3){
          d.cell.styles.textColor=[220,38,38]; d.cell.styles.fontStyle='bold';
        }
      }
    },
    didDrawPage: footer
  });

  // ── Page 2: Dept + Leave ──────────────────────────────────────────
  doc.addPage();
  header('Department & Leave Analysis', `Departments: ${depts.length}  |  Total Leave: ${leave.length}`);
  doc.setFontSize(10); doc.setFont('helvetica','bold'); doc.setTextColor(26,35,126);
  doc.text('Department Breakdown', 10, 34);
  doc.autoTable({
    head:[['Department','Head','Employees','Active','Attendance Records','Absent Rate']],
    body: depts.map(d=>{
      const de = emps.filter(e=>e.department===d.name);
      const da = att.filter(a=>de.find(e=>e.id===a.empId));
      const dab= da.filter(a=>a.status==='absent').length;
      const rt = da.length?(dab/da.length*100).toFixed(1)+'%':'0%';
      return [d.name, d.head||'—', de.length, de.filter(e=>e.status==='active').length, da.length, rt];
    }),
    startY:38, margin:{left:10,right:10},
    headStyles:{fillColor:[26,35,126],textColor:255,fontSize:8,fontStyle:'bold',halign:'center'},
    bodyStyles:{fontSize:8}, alternateRowStyles:{fillColor:[248,250,255]},
    didDrawPage: footer
  });
  const y2 = doc.lastAutoTable.finalY + 10;
  doc.setFontSize(10); doc.setFont('helvetica','bold'); doc.setTextColor(26,35,126);
  doc.text('Leave Requests', 10, y2);
  doc.autoTable({
    head:[['Employee','Department','Type','Start','End','Days','Status']],
    body: leave.map(l=>{
      const emp=emps.find(e=>e.id===l.empId);
      const days=l.startDate&&l.endDate?Math.ceil((new Date(l.endDate)-new Date(l.startDate))/864e5)+1:'';
      return [emp?.name||l.empId,emp?.department||'',leaveTypeLabel(l.type),l.startDate||'',l.endDate||'',days,leaveStatusLabel(l.status)];
    }),
    startY: y2+4, margin:{left:10,right:10},
    headStyles:{fillColor:[124,58,237],textColor:255,fontSize:8,fontStyle:'bold',halign:'center'},
    bodyStyles:{fontSize:8}, alternateRowStyles:{fillColor:[250,248,255]},
    didParseCell(d){
      if(d.section==='body'&&d.column.index===6){
        if(d.cell.raw==='អនុម័ត'){d.cell.styles.textColor=[5,150,105];d.cell.styles.fontStyle='bold';}
        if(d.cell.raw==='រង់ចាំ'){d.cell.styles.textColor=[217,119,6];}
        if(d.cell.raw==='បដិសេធ'){d.cell.styles.textColor=[220,38,38];}
      }
    },
    didDrawPage: footer
  });

  doc.save(`hrpro_report_${new Date().toISOString().split('T')[0]}.pdf`);
  showToast('បានទាញ PDF ចំនួន 2 Pages! ✅', 'success');
}

// ============================================================
// SALARY REPORT
// ============================================================
function renderSalaryReport() {
  const sal   = DB.getSalary();
  const emps  = DB.getEmployees();
  const depts = DB.getDepartments();

  // Populate filters
  const mSel = document.getElementById('sal-rpt-month');
  if (mSel && mSel.options.length <= 1) {
    const months = [...new Set(sal.map(s => s.month))].sort().reverse();
    months.forEach(m => { const o = document.createElement('option'); o.value = o.textContent = m; mSel.appendChild(o); });
  }
  const dSel = document.getElementById('sal-rpt-dept');
  if (dSel && dSel.options.length <= 1) {
    depts.forEach(d => { const o = document.createElement('option'); o.value = d.name; o.textContent = d.icon + ' ' + d.name; dSel.appendChild(o); });
  }

  const mF = (document.getElementById('sal-rpt-month')  ||{}).value || '';
  const dF = (document.getElementById('sal-rpt-dept')   ||{}).value || '';
  const sF = (document.getElementById('sal-rpt-status') ||{}).value || '';

  let records = sal;
  if (mF) records = records.filter(s => s.month === mF);
  if (sF) records = records.filter(s => s.status === sF);

  const filtEmps = dF ? emps.filter(e => e.department === dF) : emps;
  if (dF) records = records.filter(s => filtEmps.find(e => e.id === s.empId));

  const net = r => parseFloat(r.base||0) + parseFloat(r.bonus||0) - parseFloat(r.deduction||0);
  const paid    = records.filter(r => r.status === 'paid');
  const pending = records.filter(r => r.status === 'pending');
  const totalPaid    = paid.reduce((s,r) => s + net(r), 0);
  const totalPending = pending.reduce((s,r) => s + net(r), 0);
  const totalBonus   = records.reduce((s,r) => s + parseFloat(r.bonus||0), 0);
  const totalDeduct  = records.reduce((s,r) => s + parseFloat(r.deduction||0), 0);
  const avgNet = records.length ? records.reduce((s,r) => s + net(r), 0) / records.length : 0;

  // ── KPI ──────────────────────────────────────────────────
  const kpis = [
    { icon:'fas fa-file-alt',       label:'កំណត់ត្រាសរុប',    val:records.length,        sub:'ករណី',               color:'#3B5BDB' },
    { icon:'fas fa-check-circle',   label:'បានបើករួច',        val:formatMoney(totalPaid),sub:`${paid.length} ករណី`, color:'#059669' },
    { icon:'fas fa-clock',          label:'រង់ចាំបើក',        val:formatMoney(totalPending),sub:`${pending.length} ករណី`,color:'#D97706' },
    { icon:'fas fa-gift',           label:'ប្រាក់លើថ្លៃសរុប', val:formatMoney(totalBonus), sub:'bonus',              color:'#7C3AED' },
    { icon:'fas fa-minus-circle',   label:'កាត់ប្រាក់សរុប',   val:formatMoney(totalDeduct),sub:'deduction',          color:'#DC2626' },
    { icon:'fas fa-calculator',     label:'ជាមធ្យម/ករណី',    val:formatMoney(Math.round(avgNet)),sub:'net average',  color:'#0284C7' },
  ];
  document.getElementById('sal-rpt-kpi').innerHTML = kpis.map(k => `
    <div class="rpt-kpi-card" style="border-top:3px solid ${k.color};">
      <div class="rpt-kpi-icon" style="background:${k.color}18;color:${k.color};"><i class="${k.icon}"></i></div>
      <div class="rpt-kpi-val" style="color:${k.color};font-size:${k.val.length>8?'16px':'24px'};">${k.val}</div>
      <div class="rpt-kpi-label">${k.label}</div>
      <div class="rpt-kpi-sub">${k.sub}</div>
    </div>`).join('');

  // ── Donut: Paid vs Pending ───────────────────────────────
  const canvas = document.getElementById('sal-donut');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0,0,150,150);
    const total = (totalPaid + totalPending) || 1;
    const paidPct = totalPaid / total;
    const cx=75, cy=75, r=62, ir=42;
    // paid arc
    ctx.beginPath(); ctx.moveTo(cx,cy);
    ctx.arc(cx,cy,r,-Math.PI/2,-Math.PI/2 + paidPct*Math.PI*2);
    ctx.closePath(); ctx.fillStyle='#10B981'; ctx.fill();
    // pending arc
    ctx.beginPath(); ctx.moveTo(cx,cy);
    ctx.arc(cx,cy,r,-Math.PI/2 + paidPct*Math.PI*2, Math.PI*1.5);
    ctx.closePath(); ctx.fillStyle='#F59E0B'; ctx.fill();
    // hole
    ctx.beginPath(); ctx.arc(cx,cy,ir,0,Math.PI*2);
    ctx.fillStyle='#fff'; ctx.fill();
    // center
    ctx.textAlign='center'; ctx.fillStyle='#1A1F36';
    ctx.font='bold 14px Arial'; ctx.fillText(Math.round(paidPct*100)+'%',cx,cy+4);
    ctx.font='9px Arial'; ctx.fillStyle='#5A6480'; ctx.fillText('បានបើក',cx,cy+16);
  }
  document.getElementById('sal-donut-legend').innerHTML = [
    { label:'បានបើក', val:formatMoney(totalPaid), cnt:paid.length,    color:'#10B981' },
    { label:'រង់ចាំ',  val:formatMoney(totalPending),cnt:pending.length,color:'#F59E0B' },
  ].map(l => `
    <div style="background:${l.color}12;border-radius:10px;padding:10px 12px;border-left:4px solid ${l.color};">
      <div style="display:flex;justify-content:space-between;align-items:center;">
        <span style="font-size:12px;font-weight:700;color:${l.color};">${l.label}</span>
        <span style="font-size:11px;color:var(--text-muted);">${l.cnt} ករណី</span>
      </div>
      <div style="font-size:16px;font-weight:700;color:var(--text);margin-top:4px;">${l.val}</div>
    </div>`).join('');

  // ── Dept salary bars ─────────────────────────────────────
  const deptSalaries = depts.map(d => {
    const de = emps.filter(e => e.department === d.name);
    const dr = records.filter(r => de.find(e => e.id === r.empId));
    const total = dr.reduce((s,r) => s + net(r), 0);
    return { name:d.name, icon:d.icon, color:d.color, total, cnt:dr.length };
  }).sort((a,b) => b.total - a.total);
  const maxDeptSal = Math.max(...deptSalaries.map(d=>d.total), 1);
  document.getElementById('sal-dept-bars').innerHTML = deptSalaries.map(d => `
    <div>
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px;">
        <span style="font-size:12px;font-weight:600;color:var(--text);">${d.icon} ${d.name}</span>
        <span style="font-size:11px;font-weight:700;color:${d.color};">${formatMoney(Math.round(d.total))}</span>
      </div>
      <div style="height:10px;background:var(--border);border-radius:5px;overflow:hidden;">
        <div style="width:${Math.round(d.total/maxDeptSal*100)}%;height:100%;background:${d.color};border-radius:5px;transition:width .6s;"></div>
      </div>
    </div>`).join('');

  // ── Detail table ─────────────────────────────────────────
  if (!records.length) {
    document.getElementById('sal-rpt-table').innerHTML = '<div class="empty-state">មិនមានទិន្នន័យ</div>'; return;
  }
  document.getElementById('sal-rpt-table').innerHTML = `
    <table class="data-table" style="min-width:780px;">
      <thead><tr>
        <th>#</th><th>ឈ្មោះ</th><th>នាយកដ្ឋាន</th><th>ខែ</th>
        <th style="text-align:right;">ប្រាក់ខែ</th>
        <th style="text-align:right;">ប្រាក់លើថ្លៃ</th>
        <th style="text-align:right;">កាត់ប្រាក់</th>
        <th style="text-align:right;">សរុបសុទ្ធ</th>
        <th style="text-align:center;">ស្ថានភាព</th>
      </tr></thead>
      <tbody>
        ${records.map((r,i) => {
          const emp = emps.find(e => e.id === r.empId);
          const netVal = net(r);
          const dept = emp ? (depts.find(d=>d.name===emp.department)||{}) : {};
          return `<tr>
            <td style="text-align:center;color:var(--text-muted);font-size:12px;">${i+1}</td>
            <td><strong>${emp?.name||r.empId}</strong></td>
            <td><span style="background:${dept.color||'#3B5BDB'}18;color:${dept.color||'#3B5BDB'};padding:2px 8px;border-radius:12px;font-size:11px;font-weight:600;">${emp?.department||'—'}</span></td>
            <td style="text-align:center;color:var(--text-muted);">${r.month}</td>
            <td style="text-align:right;">${formatMoney(r.base)}</td>
            <td style="text-align:right;color:#059669;">${r.bonus>0?'+':''} ${formatMoney(r.bonus)}</td>
            <td style="text-align:right;color:#DC2626;">${r.deduction>0?'-':''} ${formatMoney(r.deduction)}</td>
            <td style="text-align:right;font-weight:700;font-size:14px;color:${netVal>0?'#1A1F36':'#DC2626'};">${formatMoney(netVal)}</td>
            <td style="text-align:center;">
              <span style="padding:3px 10px;border-radius:12px;font-size:11px;font-weight:700;
                background:${r.status==='paid'?'#DCFCE7':'#FFF7ED'};
                color:${r.status==='paid'?'#15803D':'#C2410C'};">
                ${r.status==='paid'?'✓ បានបើក':'⏳ រង់ចាំ'}
              </span>
            </td>
          </tr>`;
        }).join('')}
      </tbody>
      <tfoot>
        <tr style="background:linear-gradient(135deg,#EEF2FF,#E0E7FF);">
          <td colspan="4" style="font-weight:700;color:var(--primary);padding:10px 16px;">សរុប (${records.length} ករណី)</td>
          <td style="text-align:right;font-weight:700;">${formatMoney(records.reduce((s,r)=>s+parseFloat(r.base||0),0))}</td>
          <td style="text-align:right;font-weight:700;color:#059669;">${formatMoney(totalBonus)}</td>
          <td style="text-align:right;font-weight:700;color:#DC2626;">${formatMoney(totalDeduct)}</td>
          <td style="text-align:right;font-weight:700;font-size:15px;color:var(--primary);">${formatMoney(Math.round(records.reduce((s,r)=>s+net(r),0)))}</td>
          <td></td>
        </tr>
      </tfoot>
    </table>`;
}

// ===================================================================
//  PAYROLL REPORT
// ===================================================================
// ── Helper: build payroll rows from ALL data sources ──────────────
function buildPayrollRows(mF, dF, sF) {
  const sal       = DB.getSalary();
  const emps      = DB.getEmployees();
  const depts     = DB.getDepartments();
  const att       = DB.getAttendance();
  const otAll     = DB.getOT ? DB.getOT() : [];
  const alwAll    = DB.getAllowance ? DB.getAllowance() : [];
  const loanAll   = DB.getLoan ? DB.getLoan() : [];
  const leaveAll  = DB.getLeave ? DB.getLeave() : [];

  // filter active employees only
  let filtEmps = emps.filter(e => e.status !== 'inactive');
  if (dF) filtEmps = filtEmps.filter(e => e.department === dF);

  const rows = filtEmps.map(emp => {
    // ── Salary records ──
    let empSal = sal.filter(s => s.empId === emp.id);
    if (mF) empSal = empSal.filter(s => s.month === mF);

    // ── Status filter: paid → must have paid record; pending → show all without paid record
    if (sF === 'paid') {
      const hasPaid = empSal.some(s => s.status === 'paid');
      if (!hasPaid) return null;
    } else if (sF === 'pending') {
      const allPaid = empSal.length > 0 && empSal.every(s => s.status === 'paid');
      if (allPaid) return null;
    }
    // No return null for empty empSal — always show all active employees

    // ── Attendance ──
    let empAtt = att.filter(a => a.empId === emp.id);
    if (mF) empAtt = empAtt.filter(a => (a.date||'').startsWith(mF));
    const workDays   = empAtt.filter(a => a.status === 'present').length;
    const absentDays = empAtt.filter(a => a.status === 'absent').length;
    const lateDays   = empAtt.filter(a => a.status === 'late').length;

    // ── OT (ម៉ោងថែម) ──
    let empOT = otAll.filter(o => o.empId === emp.id);
    if (mF) empOT = empOT.filter(o => (o.date||'').startsWith(mF));
    const totalOTHours  = empOT.reduce((s,o) => s + parseFloat(o.hours||0), 0);
    const totalOTAmount = empOT.reduce((s,o) => s + parseFloat(o.amount||0), 0);

    // ── Allowance (ប្រាក់ឧបត្ថម្ភ) ──
    let empAlw = alwAll.filter(a => a.empId === emp.id);
    if (mF) empAlw = empAlw.filter(a => (a.month||'').startsWith(mF));
    const totalAllowance = empAlw.reduce((s,a) => s + parseFloat(a.amount||0), 0);

    // ── Loan deductions (ប.ខ្ចី) ──
    let empLoans = loanAll.filter(l => l.empId === emp.id && l.status !== 'paid');
    const totalLoanDeduct = empLoans.reduce((s,l) => {
      // Only active loans for this month
      if (mF) {
        const paid = (l.paidMonths || []);
        if (paid.includes(mF)) return s; // already deducted this month
      }
      return s + parseFloat(l.monthlyDeduct||0);
    }, 0);

    // ── Leave days ──
    let empLeave = leaveAll.filter(l => l.empId === emp.id && l.status === 'approved');
    if (mF) empLeave = empLeave.filter(l => (l.startDate||'').startsWith(mF));
    const leaveDays = empLeave.reduce((s,l) => {
      if (!l.startDate || !l.endDate) return s;
      return s + Math.max(1, Math.ceil((new Date(l.endDate) - new Date(l.startDate)) / 86400000) + 1);
    }, 0);

    // ── Salary aggregates ──
    const totalBase   = empSal.length > 0
      ? empSal.reduce((s,r) => s + parseFloat(r.base||0), 0)
      : parseFloat(emp.salary||0);
    const totalBonus  = empSal.reduce((s,r) => s + parseFloat(r.bonus||0), 0);
    const totalDeduct = empSal.reduce((s,r) => s + parseFloat(r.deduction||0), 0) + totalLoanDeduct;
    const totalNet    = totalBase + totalBonus + totalOTAmount + totalAllowance - totalDeduct;

    const status = empSal.length === 0 ? 'pending'
                 : empSal.every(s => s.status === 'paid') ? 'paid'
                 : empSal.some(s  => s.status === 'paid') ? 'partial' : 'pending';
    const month  = empSal.length ? (mF || empSal.map(s=>s.month).sort().reverse()[0]) : (mF || '—');
    const dept   = depts.find(d => d.name === emp.department) || {};

    return {
      emp, dept, workDays, absentDays, lateDays, leaveDays,
      totalBase, totalBonus, totalOTHours, totalOTAmount,
      totalAllowance, totalLoanDeduct, totalDeduct, totalNet,
      status, month, recordCount: empSal.length
    };
  }).filter(Boolean);

  return rows;
}

function renderPayroll() {
  const sal   = DB.getSalary();
  const depts = DB.getDepartments();

  // ── Populate filters ─────────────────────────────────────────────
  const mSel = document.getElementById('pr-month');
  if (mSel && mSel.options.length <= 1) {
    // Include months from salary records + current month
    const curMonth = new Date().toISOString().slice(0,7);
    const monthSet = new Set([...sal.map(s => s.month), curMonth].filter(Boolean));
    [...monthSet].sort().reverse()
      .forEach(m => { const o = document.createElement('option'); o.value = o.textContent = m; mSel.appendChild(o); });
    // Auto-select current month so all employees show by default
    if (!mSel.value) mSel.value = curMonth;
  }
  const dSel = document.getElementById('pr-dept');
  if (dSel && dSel.options.length <= 1) {
    depts.forEach(d => { const o = document.createElement('option'); o.value = d.name; o.textContent = (d.icon||'') + ' ' + d.name; dSel.appendChild(o); });
  }

  const mF = (document.getElementById('pr-month')  ||{}).value || '';
  const dF = (document.getElementById('pr-dept')   ||{}).value || '';
  const sF = (document.getElementById('pr-status') ||{}).value || '';

  const rows = buildPayrollRows(mF, dF, sF);

  // ── KPI Strip ────────────────────────────────────────────────────
  const totalPayroll   = rows.reduce((s,r) => s + r.totalNet, 0);
  const paidRows       = rows.filter(r => r.status === 'paid');
  const pendRows       = rows.filter(r => r.status === 'pending' || r.status === 'partial');
  const totalBonus     = rows.reduce((s,r) => s + r.totalBonus, 0);
  const totalOT        = rows.reduce((s,r) => s + r.totalOTAmount, 0);
  const totalAlw       = rows.reduce((s,r) => s + r.totalAllowance, 0);
  const totalDeduct    = rows.reduce((s,r) => s + r.totalDeduct, 0);
  const avgWorkDays    = rows.length ? Math.round(rows.reduce((s,r)=>s+r.workDays,0)/rows.length) : 0;

  const kpis = [
    { icon:'fas fa-users',           lbl:'បុគ្គលិក',        val: rows.length + ' នាក់',                   color:'#3B5BDB' },
    { icon:'fas fa-money-bill-wave', lbl:'Payroll សរុប',    val: formatMoney(Math.round(totalPayroll)),    color:'#059669' },
    { icon:'fas fa-check-double',    lbl:'បានបើករួច',       val: paidRows.length + ' នាក់',               color:'#10B981' },
    { icon:'fas fa-hourglass-half',  lbl:'រង់ចាំបើក',       val: pendRows.length + ' នាក់',               color:'#D97706' },
    { icon:'fas fa-gift',            lbl:'Bonus + ឧបត្ថម្ភ', val: formatMoney(Math.round(totalBonus+totalAlw)), color:'#7C3AED' },
    { icon:'fas fa-clock',           lbl:'OT សរុប',         val: formatMoney(Math.round(totalOT)),         color:'#0284C7' },
    { icon:'fas fa-minus-circle',    lbl:'កាត់ប្រាក់',       val: formatMoney(Math.round(totalDeduct)),    color:'#DC2626' },
    { icon:'fas fa-calendar-check',  lbl:'ថ្ងៃធ្វើការ Avg', val: avgWorkDays + ' ថ្ងៃ',                  color:'#0F766E' },
  ];
  document.getElementById('pr-kpi-strip').innerHTML = kpis.map(k => `
    <div class="pr-kpi-card" style="--pr-color:${k.color};">
      <div class="pr-kpi-icon" style="background:${k.color}18;color:${k.color};"><i class="${k.icon}"></i></div>
      <div>
        <div class="pr-kpi-val" style="color:${k.color};">${k.val}</div>
        <div class="pr-kpi-lbl">${k.lbl}</div>
      </div>
    </div>`).join('');

  // ── Table ─────────────────────────────────────────────────────────
  const wrap = document.getElementById('pr-table-wrap');
  if (!wrap) return;

  if (!rows.length) {
    wrap.innerHTML = `<div style="padding:60px;text-align:center;color:var(--text-muted);">
      <i class="fas fa-users" style="font-size:40px;opacity:.3;margin-bottom:14px;display:block;"></i>
      <div style="font-size:15px;font-weight:700;">រកមិនឃើញបុគ្គលិក</div>
      <div style="font-size:13px;margin-top:6px;">សូមពិនិត្យ filter ស្ថានភាព ឬ នាយកដ្ឋាន</div>
    </div>`;
    return;
  }

  const totalBase = rows.reduce((s,r) => s + r.totalBase, 0);

  const rowsHtml = rows.map((r, i) => {
    const color    = r.dept.color || '#3B5BDB';
    const gIcon    = r.emp.gender === 'male'   ? '<span style="color:#2563EB;font-weight:800;">♂</span>'
                   : r.emp.gender === 'female' ? '<span style="color:#DB2777;font-weight:800;">♀</span>' : '—';
    const stCls    = r.status === 'paid' ? 'pr-status-paid' : 'pr-status-pending';
    const stLbl    = r.status === 'paid' ? '✓ បានបើក' : r.status === 'partial' ? '◑ មួយផ្នែក' : '⏳ រង់ចាំ';
    const netColor = r.totalNet > 0 ? 'var(--text)' : '#DC2626';
    const otTip    = r.totalOTHours > 0 ? `title="OT: ${r.totalOTHours.toFixed(1)}h"` : '';
    return `
<div class="pr-row">
  <div class="center"><span style="font-size:11px;font-weight:800;color:var(--text-muted);font-family:monospace;">${String(i+1).padStart(2,'0')}</span></div>
  <div class="center">
    <div style="width:36px;height:36px;border-radius:50%;background:linear-gradient(135deg,${color},${color}88);display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:800;color:#fff;overflow:hidden;box-shadow:0 2px 8px ${color}44;flex-shrink:0;">
      ${r.emp.photo ? `<img src="${r.emp.photo}" style="width:100%;height:100%;object-fit:cover;border-radius:50%;"/>` : getInitials(r.emp.name)}
    </div>
  </div>
  <div style="flex-direction:column;align-items:flex-start;gap:2px;">
    <span style="font-weight:800;font-size:13px;color:var(--text);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${r.emp.name}</span>
    <span style="font-family:monospace;font-size:10px;background:var(--bg);padding:1px 6px;border-radius:4px;color:var(--text-muted);letter-spacing:.4px;">${r.emp.id}</span>
  </div>
  <div>
    <span style="font-size:11.5px;font-weight:700;color:${color};background:${color}18;padding:3px 10px;border-radius:20px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${r.emp.position||'—'}</span>
  </div>
  <div>
    <span style="font-size:11px;font-weight:700;color:${color};background:${color}12;padding:3px 9px;border-radius:20px;">${r.emp.department||'—'}</span>
  </div>
  <div class="center">${gIcon}</div>
  <div class="center">
    <div style="text-align:center;">
      <div style="font-size:15px;font-weight:900;color:${r.workDays>0?'#059669':'var(--text-muted)'};">${r.workDays}</div>
      <div style="font-size:9px;color:var(--text-light);">
        ${r.absentDays ? `<span style="color:#DC2626;">✗${r.absentDays}</span> ` : ''}
        ${r.lateDays   ? `<span style="color:#F59E0B;">⏰${r.lateDays}</span> ` : ''}
        ${r.leaveDays  ? `<span style="color:#7C3AED;">🏖${r.leaveDays}</span>` : ''}
        ${!r.absentDays&&!r.lateDays&&!r.leaveDays?'<span style="color:#10B981;">✓ ល្អ</span>':''}
      </div>
    </div>
  </div>
  <div class="right"><span style="font-weight:700;color:var(--text);">${r.totalBase>0?formatMoney(r.totalBase):'—'}</span></div>
  <div class="right">
    <div style="display:flex;flex-direction:column;align-items:flex-end;gap:1px;">
      ${r.totalBonus>0  ? `<span style="font-size:10px;font-weight:700;color:#059669;">+${formatMoney(r.totalBonus)}<span style="opacity:.6;font-size:8px;"> Bonus</span></span>` : ''}
      ${r.totalOTAmount>0 ? `<span ${otTip} style="font-size:10px;font-weight:700;color:#0284C7;">+${formatMoney(r.totalOTAmount)}<span style="opacity:.6;font-size:8px;"> OT</span></span>` : ''}
      ${r.totalAllowance>0 ? `<span style="font-size:10px;font-weight:700;color:#7C3AED;">+${formatMoney(r.totalAllowance)}<span style="opacity:.6;font-size:8px;"> ឧបត្ថម្ភ</span></span>` : ''}
      ${!r.totalBonus&&!r.totalOTAmount&&!r.totalAllowance?'<span style="color:var(--text-muted);">—</span>':''}
    </div>
  </div>
  <div class="right">
    <div style="display:flex;flex-direction:column;align-items:flex-end;gap:1px;">
      ${r.totalDeduct-r.totalLoanDeduct>0 ? `<span style="font-size:10px;font-weight:700;color:#DC2626;">-${formatMoney(r.totalDeduct-r.totalLoanDeduct)}<span style="opacity:.6;font-size:8px;"> កាត់</span></span>` : ''}
      ${r.totalLoanDeduct>0 ? `<span style="font-size:10px;font-weight:700;color:#F59E0B;">-${formatMoney(r.totalLoanDeduct)}<span style="opacity:.6;font-size:8px;"> ប.ខ្ចី</span></span>` : ''}
      ${!r.totalDeduct?'<span style="color:var(--text-muted);">—</span>':''}
    </div>
  </div>
  <div class="right"><span style="font-weight:900;font-size:14px;color:${netColor};">${formatMoney(Math.round(r.totalNet))}</span></div>
  <div class="center"><span class="${stCls}">${stLbl}</span></div>
</div>`;
  }).join('');

  const totalOTAmt  = rows.reduce((s,r) => s + r.totalOTAmount, 0);
  const totalAlwAmt = rows.reduce((s,r) => s + r.totalAllowance, 0);

  wrap.innerHTML = `
<div class="pr-table-topbar">
  <div class="pr-table-title">
    <i class="fas fa-money-check-alt"></i>
    Payroll Table
    <span class="pr-count-badge">${rows.length} នាក់</span>
    ${mF ? `<span style="font-size:11px;background:#EEF2FF;color:#3B5BDB;padding:3px 10px;border-radius:20px;font-weight:700;">${mF}</span>` : ''}
  </div>
  <div style="font-size:12px;color:var(--text-muted);display:flex;align-items:center;gap:6px;">
    <span>Payroll សរុប:</span>
    <strong style="color:#059669;font-size:15px;">${formatMoney(Math.round(totalPayroll))}</strong>
  </div>
</div>
<div class="pr-thead" style="grid-template-columns:44px 46px 1fr 1fr 1fr 46px 90px 1fr 1fr 1fr 1fr 110px;">
  <span class="center">#</span>
  <span class="center">រូប</span>
  <span>ឈ្មោះ / ID</span>
  <span>តួនាទី</span>
  <span>នាយកដ្ឋាន</span>
  <span class="center">ភេទ</span>
  <span class="center">វត្តមាន</span>
  <span class="right">ប្រាក់ខែ</span>
  <span class="right">Bonus/OT/ឧបត្ថម្ភ</span>
  <span class="right">កាត់/ប.ខ្ចី</span>
  <span class="right">សុទ្ធ</span>
  <span class="center">ស្ថានភាព</span>
</div>
${rowsHtml}
<div class="pr-tfoot" style="grid-template-columns:44px 46px 1fr 1fr 1fr 46px 90px 1fr 1fr 1fr 1fr 110px;">
  <div></div><div></div>
  <div><strong style="color:var(--primary);font-size:13px;">សរុប (${rows.length} នាក់)</strong></div>
  <div></div><div></div><div></div>
  <div class="center"><strong style="color:#059669;font-size:11px;">${avgWorkDays}d avg</strong></div>
  <div class="right"><strong>${formatMoney(Math.round(totalBase))}</strong></div>
  <div class="right">
    <div style="display:flex;flex-direction:column;align-items:flex-end;gap:1px;">
      ${totalBonus>0  ?`<span style="font-size:10px;font-weight:800;color:#059669;">+${formatMoney(Math.round(totalBonus))}<span style="opacity:.55;font-size:8px;"> B</span></span>`:''}
      ${totalOTAmt>0  ?`<span style="font-size:10px;font-weight:800;color:#0284C7;">+${formatMoney(Math.round(totalOTAmt))}<span style="opacity:.55;font-size:8px;"> OT</span></span>`:''}
      ${totalAlwAmt>0 ?`<span style="font-size:10px;font-weight:800;color:#7C3AED;">+${formatMoney(Math.round(totalAlwAmt))}<span style="opacity:.55;font-size:8px;"> A</span></span>`:''}
    </div>
  </div>
  <div class="right"><strong style="color:#DC2626;">-${formatMoney(Math.round(totalDeduct))}</strong></div>
  <div class="right"><strong style="font-size:15px;color:var(--primary);">${formatMoney(Math.round(totalPayroll))}</strong></div>
  <div></div>
</div>`;
}

// ── Print Payroll ─────────────────────────────────────────────────
function printPayroll() {
  const mF = (document.getElementById('pr-month') ||{}).value || '';
  const dF = (document.getElementById('pr-dept')  ||{}).value || '';
  const sF = (document.getElementById('pr-status')||{}).value || '';
  const settings    = DB.getSettings();
  const companyName = settings.companyName || 'HR Pro';
  const companySub  = settings.companySub  || 'ប្រព័ន្ធគ្រប់គ្រងបុគ្គលិក';
  const logoData    = settings.logoData    || '';
  const companyInitials = companyName.trim().split(/\s+/).map(w=>w[0]||'').join('').slice(0,2).toUpperCase() || 'HR';
  const logoBoxHtml = logoData
    ? `<div class="doc-logo-box" style="background:#fff;border:2px solid #e2e8f0;padding:2px;"><img src="${logoData}" style="width:100%;height:100%;object-fit:contain;border-radius:8px;" alt="logo"/></div>`
    : `<div class="doc-logo-box">${companyInitials}</div>`;

  const rows = buildPayrollRows(mF, dF, sF);
  if (!rows.length) { showToast('មិនមានទិន្នន័យសម្រាប់បោះពុម្ព!', 'error'); return; }

  const fmt       = v => '$' + Number(v).toLocaleString('en-US', {minimumFractionDigits:2,maximumFractionDigits:2});
  const gLabel    = g => g==='male'?'ប្រុស':g==='female'?'ស្រី':'—';
  const printDate = new Date().toLocaleDateString('km-KH', {year:'numeric',month:'long',day:'numeric'});

  const tBase   = rows.reduce((s,r)=>s+r.totalBase,0);
  const tBonus  = rows.reduce((s,r)=>s+r.totalBonus,0);
  const tOT     = rows.reduce((s,r)=>s+r.totalOTAmount,0);
  const tAlw    = rows.reduce((s,r)=>s+r.totalAllowance,0);
  const tDeduct = rows.reduce((s,r)=>s+r.totalDeduct,0);
  const tNet    = rows.reduce((s,r)=>s+r.totalNet,0);

  const tableRows = rows.map((r,i) => `
    <tr>
      <td style="text-align:center;color:#64748b;font-size:13px;">${String(i+1).padStart(2,'0')}</td>
      <td style="font-weight:700;font-family:monospace;font-size:12px;color:#374151;">${r.emp.id}</td>
      <td style="font-weight:700;color:#111827;font-size:14px;">${r.emp.name}</td>
      <td style="color:#374151;font-size:13px;">${r.emp.position||'—'}</td>
      <td style="font-size:13px;color:#374151;">${r.emp.department||'—'}</td>
      <td style="text-align:center;font-size:13px;">${gLabel(r.emp.gender)}</td>
      <td style="text-align:center;">
        <strong style="color:${r.workDays>0?'#059669':'#6b7280'};font-size:14px;">${r.workDays}</strong>
        ${r.absentDays?`<br/><span style="font-size:11px;color:#dc2626;">✗${r.absentDays}</span>`:''}
        ${r.lateDays?`<span style="font-size:11px;color:#d97706;"> ⏰${r.lateDays}</span>`:''}
        ${r.leaveDays?`<br/><span style="font-size:11px;color:#7c3aed;">🏖${r.leaveDays}</span>`:''}
      </td>
      <td style="text-align:right;font-weight:600;font-size:13px;">${r.totalBase>0?fmt(r.totalBase):'—'}</td>
      <td style="text-align:right;">
        ${r.totalBonus>0?`<span style="color:#059669;font-size:12px;">+${fmt(r.totalBonus)}<br/></span>`:''}
        ${r.totalOTAmount>0?`<span style="color:#0284c7;font-size:12px;">+${fmt(r.totalOTAmount)} OT<br/></span>`:''}
        ${r.totalAllowance>0?`<span style="color:#7c3aed;font-size:12px;">+${fmt(r.totalAllowance)} ឧ<br/></span>`:''}
        ${!r.totalBonus&&!r.totalOTAmount&&!r.totalAllowance?'—':''}
      </td>
      <td style="text-align:right;">
        ${r.totalDeduct-r.totalLoanDeduct>0?`<span style="color:#dc2626;font-size:12px;">-${fmt(r.totalDeduct-r.totalLoanDeduct)}<br/></span>`:''}
        ${r.totalLoanDeduct>0?`<span style="color:#d97706;font-size:12px;">-${fmt(r.totalLoanDeduct)} ប.ខ្ចី</span>`:''}
        ${!r.totalDeduct?'—':''}
      </td>
      <td style="text-align:right;font-weight:900;color:${r.totalNet>0?'#1e3a5f':'#dc2626'};font-size:15px;">${fmt(Math.round(r.totalNet))}</td>
      <td style="text-align:center;">
        <span style="padding:4px 10px;border-radius:20px;font-size:11px;font-weight:800;
          background:${r.status==='paid'?'#dcfce7':'#fff7ed'};
          color:${r.status==='paid'?'#15803d':'#c2410c'};">
          ${r.status==='paid'?'✓ បានបើក':'⏳ រង់ចាំ'}
        </span>
      </td>
      <td style="text-align:center;border-left:1.5px solid #e2e8f0;min-width:70px;"></td>
    </tr>`).join('');

  const html = `<!DOCTYPE html>
<html lang="km">
<head>
<meta charset="UTF-8"/>
<title>Payroll — ${mF||'ទាំងអស់'}</title>
<link href="https://fonts.googleapis.com/css2?family=Kantumruy+Pro:wght@300;400;500;600;700&display=swap" rel="stylesheet"/>
<style>
  *{box-sizing:border-box;margin:0;padding:0;}
  body{font-family:'Kantumruy Pro','Battambang',sans-serif;background:#fff;color:#111827;font-size:14px;padding:20px 24px;}
  @media print{body{padding:0;} .no-print{display:none!important;} @page{margin:8mm;size:A4 landscape;}}
  .doc-header{display:flex;justify-content:space-between;align-items:flex-start;padding-bottom:16px;border-bottom:3px solid #1A237E;margin-bottom:16px;}
  .doc-logo{display:flex;align-items:center;gap:14px;}
  .doc-logo-box{width:56px;height:56px;border-radius:14px;background:linear-gradient(135deg,#1A237E,#3B5BDB);display:flex;align-items:center;justify-content:center;font-size:22px;color:#fff;font-weight:900;flex-shrink:0;overflow:hidden;}
  .doc-company{font-size:20px;font-weight:800;color:#1A237E;}
  .doc-sub{font-size:12px;color:#64748b;margin-top:3px;}
  .doc-title{font-size:17px;font-weight:800;color:#1A237E;text-align:right;}
  .doc-meta{font-size:12px;color:#64748b;margin-top:5px;line-height:1.9;text-align:right;}
  .summary-grid{display:grid;grid-template-columns:repeat(6,1fr);gap:10px;margin-bottom:16px;}
  .summary-box{border-radius:10px;padding:12px 14px;border:1.5px solid #e2e8f0;}
  .sb-lbl{font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:.8px;opacity:.75;margin-bottom:4px;}
  .sb-val{font-size:16px;font-weight:900;}
  table{width:100%;border-collapse:collapse;font-size:13px;border:1.5px solid #c7d2fe;}
  thead tr{background:linear-gradient(135deg,#1A237E,#3B5BDB);}
  thead th{color:#fff;font-weight:700;padding:11px 10px;text-align:left;font-size:11px;text-transform:uppercase;letter-spacing:.5px;white-space:nowrap;border-right:1px solid rgba(255,255,255,0.15);}
  thead th:last-child{border-right:none;}
  thead th.r{text-align:right;} thead th.c{text-align:center;}
  tbody tr{border-bottom:1.5px solid #e2e8f0;} tbody tr:nth-child(even){background:#f8faff;}
  tbody td{padding:10px 10px;vertical-align:middle;border-right:1px solid #e8edf8;font-size:13px;}
  tbody td:last-child{border-right:none;}
  tfoot tr{background:linear-gradient(135deg,#EEF2FF,#E0E7FF);border-top:2.5px solid #3B5BDB;}
  tfoot td{padding:11px 10px;font-weight:800;font-size:13px;border-right:1px solid #c7d2fe;}
  tfoot td:last-child{border-right:none;}
  .print-btn{display:inline-flex;align-items:center;gap:6px;padding:9px 22px;background:linear-gradient(135deg,#1A237E,#3B5BDB);color:#fff;border:none;border-radius:9px;font-size:13px;font-weight:700;cursor:pointer;margin-bottom:14px;}
  .doc-footer{margin-top:14px;padding-top:10px;border-top:1.5px solid #e2e8f0;display:flex;justify-content:space-between;font-size:11px;color:#94a3b8;}
  .sig-row{display:grid;grid-template-columns:1fr 1fr 1fr;gap:32px;margin-top:26px;margin-bottom:8px;}
  .sig-box{text-align:center;border-top:1.5px solid #cbd5e1;padding-top:9px;font-size:12px;color:#374151;font-weight:600;}
</style>
</head>
<body>
<button class="print-btn no-print" onclick="window.print()">🖨️ បោះពុម្ព</button>
<div class="doc-header">
  <div class="doc-logo">
    ${logoBoxHtml}
    <div><div class="doc-company">${companyName}</div><div class="doc-sub">${companySub}</div></div>
  </div>
  <div>
    <div class="doc-title">💵 Payroll — របាយការណ៍ប្រាក់ខែ</div>
    <div class="doc-meta">
      ${mF?'ខែ: <strong>'+mF+'</strong>':'ខែ: ទាំងអស់'}<br/>
      ${dF?'នាយកដ្ឋាន: <strong>'+dF+'</strong><br/>':''}
      ថ្ងៃបោះពុម្ព: <strong>${printDate}</strong> · បុគ្គលិក: <strong>${rows.length} នាក់</strong>
    </div>
  </div>
</div>
<div class="summary-grid">
  <div class="summary-box" style="border-color:#3B5BDB30;background:#EEF2FF;">
    <div class="sb-lbl" style="color:#3B5BDB;">បុគ្គលិក</div>
    <div class="sb-val" style="color:#3B5BDB;">${rows.length} នាក់</div>
  </div>
  <div class="summary-box" style="border-color:#05966930;background:#F0FDF4;">
    <div class="sb-lbl" style="color:#059669;">ប្រាក់ខែ Base</div>
    <div class="sb-val" style="color:#059669;">${fmt(Math.round(tBase))}</div>
  </div>
  <div class="summary-box" style="border-color:#7C3AED30;background:#F5F3FF;">
    <div class="sb-lbl" style="color:#7C3AED;">Bonus + ឧបត្ថម្ភ</div>
    <div class="sb-val" style="color:#7C3AED;">${fmt(Math.round(tBonus+tAlw))}</div>
  </div>
  <div class="summary-box" style="border-color:#0284C730;background:#EFF6FF;">
    <div class="sb-lbl" style="color:#0284C7;">OT (ម៉ោងថែម)</div>
    <div class="sb-val" style="color:#0284C7;">${fmt(Math.round(tOT))}</div>
  </div>
  <div class="summary-box" style="border-color:#DC262630;background:#FEF2F2;">
    <div class="sb-lbl" style="color:#DC2626;">កាត់ប្រាក់</div>
    <div class="sb-val" style="color:#DC2626;">${fmt(Math.round(tDeduct))}</div>
  </div>
  <div class="summary-box" style="border-color:#1A237E30;background:#EEF2FF;">
    <div class="sb-lbl" style="color:#1A237E;">Payroll សុទ្ធ</div>
    <div class="sb-val" style="color:#1A237E;font-size:18px;">${fmt(Math.round(tNet))}</div>
  </div>
</div>
<table>
  <thead>
    <tr>
      <th class="c">#</th><th>ID</th><th>ឈ្មោះ</th><th>តួនាទី</th><th>នាយកដ្ឋាន</th>
      <th class="c">ភេទ</th><th class="c">វត្តមាន</th>
      <th class="r">ប្រាក់ខែ</th><th class="r">Bonus/OT/ឧបត្ថម្ភ</th>
      <th class="r">កាត់/ប.ខ្ចី</th><th class="r">សុទ្ធ</th>
      <th class="c">ស្ថានភាព</th><th class="c">ហត្ថលេខា</th>
    </tr>
  </thead>
  <tbody>${tableRows}</tbody>
  <tfoot>
    <tr>
      <td colspan="5" style="color:#3B5BDB;">សរុប (${rows.length} នាក់)</td>
      <td></td>
      <td style="text-align:center;color:#059669;">${rows.length?Math.round(rows.reduce((s,r)=>s+r.workDays,0)/rows.length):0}d avg</td>
      <td style="text-align:right;">${fmt(Math.round(tBase))}</td>
      <td style="text-align:right;color:#7c3aed;">${fmt(Math.round(tBonus+tOT+tAlw))}</td>
      <td style="text-align:right;color:#DC2626;">-${fmt(Math.round(tDeduct))}</td>
      <td style="text-align:right;color:#1A237E;font-size:15px;font-weight:900;">${fmt(Math.round(tNet))}</td>
      <td colspan="2"></td>
    </tr>
  </tfoot>
</table>
<div class="sig-row" style="margin-top:26px;">
  <div class="sig-box">រៀបចំដោយ<br/><br/><br/>ហត្ថលេខា & ថ្ងៃខែឆ្នាំ</div>
  <div class="sig-box">ត្រួតពិនិត្យដោយ<br/><br/><br/>ហត្ថលេខា & ថ្ងៃខែឆ្នាំ</div>
  <div class="sig-box">អនុម័តដោយ<br/><br/><br/>ហត្ថលេខា & ថ្ងៃខែឆ្នាំ</div>
</div>
<div class="doc-footer">
  <span>${companyName} · ${companySub}</span>
  <span>Confidential · HR Pro System · ${printDate}</span>
</div>
</body></html>`;

  const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
  const url  = URL.createObjectURL(blob);
  const win  = window.open(url, '_blank');
  if (!win) {
    const a = document.createElement('a');
    a.href = url; a.download = 'payroll_' + (mF||'all') + '.html'; a.click();
    showToast('បើក file HTML ហើយ Ctrl+P ដើម្បីបោះពុម្ព', 'info');
  }
  setTimeout(() => URL.revokeObjectURL(url), 15000);
}

// ── Export Excel ──────────────────────────────────────────────────
function exportPayrollExcel() {
  if (typeof XLSX === 'undefined') { showToast('Library មិនទាន់ Load!', 'error'); return; }

  const mF = (document.getElementById('pr-month') ||{}).value || '';
  const dF = (document.getElementById('pr-dept')  ||{}).value || '';
  const sF = (document.getElementById('pr-status')||{}).value || '';
  const rows = buildPayrollRows(mF, dF, sF);
  if (!rows.length) { showToast('មិនមានទិន្នន័យ!', 'error'); return; }

  const data = rows.map((r, i) => ({
    'ល.រ':                 i + 1,
    'លេខបុគ្គលិក':         r.emp.id,
    'ឈ្មោះ':               r.emp.name,
    'ឈ្មោះ (EN)':          r.emp.nameEn || '',
    'តួនាទី':              r.emp.position || '',
    'នាយកដ្ឋាន':           r.emp.department || '',
    'ភេទ':                 r.emp.gender === 'male' ? 'ប្រុស' : r.emp.gender === 'female' ? 'ស្រី' : '',
    'ថ្ងៃខែឆ្នាំកើត':       r.emp.dob || '',
    'ទូរស័ព្ទ':             r.emp.phone || '',
    'អ៊ីម៉ែល':             r.emp.email || '',
    'ធនាគារ':              r.emp.bank || '',
    'អាសយដ្ឋាន':          r.emp.address || '',
    'ថ្ងៃចូលធ្វើការ':       r.emp.startDate || '',
    'ខែ':                  r.month,
    'ថ្ងៃធ្វើការ':          r.workDays,
    'ថ្ងៃអវត្តមាន':         r.absentDays,
    'ថ្ងៃចូលយឺត':          r.lateDays,
    'ថ្ងៃឈប់សម្រាក':       r.leaveDays,
    'ប្រាក់ខែ Base ($)':   +r.totalBase.toFixed(2),
    'Bonus ($)':           +r.totalBonus.toFixed(2),
    'OT ($)':              +r.totalOTAmount.toFixed(2),
    'OT (ម៉ោង)':           +r.totalOTHours.toFixed(2),
    'ប្រាក់ឧបត្ថម្ភ ($)':  +r.totalAllowance.toFixed(2),
    'កាត់ប្រាក់ ($)':       +(r.totalDeduct - r.totalLoanDeduct).toFixed(2),
    'ប.ខ្ចី ($)':           +r.totalLoanDeduct.toFixed(2),
    'សរុបកាត់ ($)':        +r.totalDeduct.toFixed(2),
    'ប្រាក់ខែសុទ្ធ ($)':   +r.totalNet.toFixed(2),
    'ស្ថានភាព':            r.status === 'paid' ? 'បានបើក' : r.status === 'partial' ? 'មួយផ្នែក' : 'រង់ចាំ',
  }));

  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(data);
  ws['!cols'] = [
    {wch:5},{wch:14},{wch:24},{wch:22},{wch:20},{wch:16},{wch:8},
    {wch:14},{wch:14},{wch:24},{wch:22},{wch:24},{wch:14},
    {wch:10},{wch:10},{wch:10},{wch:10},{wch:10},
    {wch:14},{wch:12},{wch:12},{wch:10},{wch:14},
    {wch:13},{wch:12},{wch:14},{wch:15},{wch:12},
  ];
  // Style header row
  const range = XLSX.utils.decode_range(ws['!ref']);
  for (let C = range.s.c; C <= range.e.c; C++) {
    const addr = XLSX.utils.encode_cell({r:0,c:C});
    if (ws[addr]) ws[addr].s = {
      fill: {patternType:'solid', fgColor:{rgb:'1A237E'}},
      font: {bold:true, color:{rgb:'FFFFFF'}, sz:9},
      alignment: {horizontal:'center', vertical:'center', wrapText:true},
    };
  }
  XLSX.utils.book_append_sheet(wb, ws, 'Payroll');

  // Summary sheet
  const sumData = [
    { 'ព័ត៌មាន': 'ចំនួនបុគ្គលិក',       'តម្លៃ': rows.length },
    { 'ព័ត៌មាន': 'ប្រាក់ខែ Base',        'តម្លៃ': +rows.reduce((s,r)=>s+r.totalBase,0).toFixed(2) },
    { 'ព័ត៌មាន': 'Bonus',               'តម្លៃ': +rows.reduce((s,r)=>s+r.totalBonus,0).toFixed(2) },
    { 'ព័ត៌មាន': 'OT (ម៉ោងថែម)',        'តម្លៃ': +rows.reduce((s,r)=>s+r.totalOTAmount,0).toFixed(2) },
    { 'ព័ត៌មាន': 'ប្រាក់ឧបត្ថម្ភ',      'តម្លៃ': +rows.reduce((s,r)=>s+r.totalAllowance,0).toFixed(2) },
    { 'ព័ត៌មាន': 'កាត់ប្រាក់ + ប.ខ្ចី', 'តម្លៃ': +rows.reduce((s,r)=>s+r.totalDeduct,0).toFixed(2) },
    { 'ព័ត៌មាន': 'Payroll សុទ្ធ',       'តម្លៃ': +rows.reduce((s,r)=>s+r.totalNet,0).toFixed(2) },
    { 'ព័ត៌មាន': 'ខែ',                  'តម្លៃ': mF || 'ទាំងអស់' },
    { 'ព័ត៌មាន': 'នាយកដ្ឋាន',           'តម្លៃ': dF || 'ទាំងអស់' },
    { 'ព័ត៌មាន': 'ថ្ងៃបោះពុម្ព',         'តម្លៃ': new Date().toISOString().slice(0,10) },
  ];
  const ws2 = XLSX.utils.json_to_sheet(sumData);
  ws2['!cols'] = [{wch:26},{wch:20}];
  XLSX.utils.book_append_sheet(wb, ws2, 'Summary');

  XLSX.writeFile(wb, 'hrpro_payroll_'+(mF||'all')+'_'+new Date().toISOString().slice(0,10)+'.xlsx');
  showToast('✅ Payroll Excel (ទិន្នន័យពេញ) បានទាញ!', 'success');
}

// ── Export PDF ────────────────────────────────────────────────────
// ── Export PDF ────────────────────────────────────────────────────
function exportPayrollPDF() {
  if (!window.jspdf) { showToast('Library មិនទាន់ Load!', 'error'); return; }
  const { jsPDF } = window.jspdf;

  const mF = (document.getElementById('pr-month') ||{}).value || '';
  const dF = (document.getElementById('pr-dept')  ||{}).value || '';
  const sF = (document.getElementById('pr-status')||{}).value || '';
  const settings    = DB.getSettings();
  const companyName = settings.companyName || 'HR Pro';
  const today       = new Date().toLocaleDateString('en-GB');

  const rows = buildPayrollRows(mF, dF, sF);
  if (!rows.length) { showToast('មិនមានទិន្នន័យ!','error'); return; }

  const pdfRows = rows.map((r, i) => [
    String(i+1).padStart(2,'0'),
    r.emp.id,
    r.emp.name,
    r.emp.position || '—',
    r.emp.gender === 'male' ? 'M' : r.emp.gender === 'female' ? 'F' : '—',
    r.workDays + (r.absentDays ? ' / -'+r.absentDays : '') + (r.lateDays ? ' ⏰'+r.lateDays : ''),
    '$' + r.totalBase.toFixed(2),
    r.totalBonus>0||r.totalOTAmount>0||r.totalAllowance>0
      ? '+$'+(r.totalBonus+r.totalOTAmount+r.totalAllowance).toFixed(2)
      : '—',
    r.totalDeduct > 0 ? '-$' + r.totalDeduct.toFixed(2) : '—',
    '$' + Math.round(r.totalNet).toFixed(2),
    r.status === 'paid' ? 'Paid' : r.status === 'partial' ? 'Partial' : 'Pending',
  ]);

  const doc = new jsPDF({orientation:'landscape',unit:'mm',format:'a4'});
  const pw = doc.internal.pageSize.getWidth(), ph = doc.internal.pageSize.getHeight();

  doc.setFillColor(26,35,126); doc.rect(0,0,pw,18,'F');
  doc.setFillColor(59,91,219); doc.rect(0,18,pw,8,'F');
  doc.setTextColor(255,255,255);
  doc.setFontSize(13); doc.setFont('helvetica','bold');
  doc.text(companyName + ' — Payroll Report  💵', pw/2, 12, {align:'center'});
  doc.setFontSize(8); doc.setFont('helvetica','normal');
  doc.text((mF?'Month: '+mF+'  |  ':'')+'Printed: '+today+'  |  Employees: '+rows.length, pw/2, 23, {align:'center'});
  doc.setTextColor(26,31,54);

  const tBase   = rows.reduce((s,r)=>s+r.totalBase,0);
  const tExtra  = rows.reduce((s,r)=>s+r.totalBonus+r.totalOTAmount+r.totalAllowance,0);
  const tDeduct = rows.reduce((s,r)=>s+r.totalDeduct,0);
  const tNet    = rows.reduce((s,r)=>s+r.totalNet,0);
  const kW = (pw-20)/5 - 2;
  [
    {l:'Employees',   v:rows.length,                             c:[59,91,219]},
    {l:'Base Salary', v:'$'+Math.round(tBase).toLocaleString(),  c:[5,150,105]},
    {l:'Bonus/OT/Alw',v:'$'+Math.round(tExtra).toLocaleString(), c:[124,58,237]},
    {l:'Deductions',  v:'$'+Math.round(tDeduct).toLocaleString(),c:[220,38,38]},
    {l:'Net Payroll', v:'$'+Math.round(tNet).toLocaleString(),   c:[26,35,126]},
  ].forEach((k,i)=>{
    const x = 10 + i*(kW+3);
    doc.setFillColor(...k.c); doc.roundedRect(x,30,kW,17,2,2,'F');
    doc.setTextColor(255,255,255);
    doc.setFontSize(11); doc.setFont('helvetica','bold'); doc.text(String(k.v), x+kW/2, 41, {align:'center'});
    doc.setFontSize(7);  doc.setFont('helvetica','normal'); doc.text(k.l, x+kW/2, 35, {align:'center'});
  });

  doc.autoTable({
    head:[['#','ID','ឈ្មោះ','តួនាទី','ភេទ','វត្តមាន','ប.ខែ Base','Bonus/OT/ឧ','កាត់','សុទ្ធ','ស្ថានភាព']],
    body: pdfRows,
    startY: 52, margin:{left:10,right:10},
    headStyles:{fillColor:[26,35,126],textColor:255,fontSize:7.5,fontStyle:'bold',halign:'center'},
    bodyStyles:{fontSize:7.5},
    columnStyles:{
      0:{halign:'center',cellWidth:8},
      1:{cellWidth:18},
      4:{halign:'center',cellWidth:8},
      5:{halign:'center',cellWidth:16},
      6:{halign:'right'},7:{halign:'right'},8:{halign:'right'},
      9:{halign:'right',fontStyle:'bold'},
      10:{halign:'center',cellWidth:18},
    },
    alternateRowStyles:{fillColor:[238,242,255]},
    didParseCell(d){
      if(d.section==='body'&&d.column.index===10){
        d.cell.styles.textColor=d.cell.raw==='Paid'?[5,150,105]:d.cell.raw==='Partial'?[180,83,9]:[217,119,6];
        d.cell.styles.fontStyle='bold';
      }
      if(d.section==='body'&&d.column.index===9){d.cell.styles.fontStyle='bold';d.cell.styles.textColor=[26,35,126];}
      if(d.section==='body'&&d.column.index===7&&d.cell.raw!=='—'){d.cell.styles.textColor=[5,150,105];}
      if(d.section==='body'&&d.column.index===8&&d.cell.raw!=='—'){d.cell.styles.textColor=[220,38,38];}
    },
    foot:[[
      '','','','','','',
      '$'+Math.round(tBase).toLocaleString('en-US'),
      '+$'+Math.round(tExtra).toLocaleString('en-US'),
      '-$'+Math.round(tDeduct).toLocaleString('en-US'),
      '$'+Math.round(tNet).toLocaleString('en-US'),''
    ]],
    footStyles:{fillColor:[238,242,255],fontStyle:'bold',fontSize:8,textColor:[26,35,126]},
    didDrawPage(){
      doc.setFillColor(238,242,255); doc.rect(0,ph-8,pw,8,'F');
      doc.setFontSize(7);doc.setTextColor(59,91,219);doc.setFont('helvetica','normal');
      doc.text(companyName+' — Payroll  |  Confidential  |  '+today,pw/2,ph-2,{align:'center'});
    }
  });

  doc.save('hrpro_payroll_'+(mF||'all')+'_'+new Date().toISOString().slice(0,10)+'.pdf');
  showToast('✅ Payroll PDF (ទិន្នន័យពេញ) បានទាញ!','success');
}

function exportSalaryReportExcel() {
  if (typeof XLSX === 'undefined') { showToast('Library មិនទាន់ Load!', 'error'); return; }
  const sal  = DB.getSalary();
  const emps = DB.getEmployees();
  const depts= DB.getDepartments();
  const wb   = XLSX.utils.book_new();
  const net  = r => parseFloat(r.base||0)+parseFloat(r.bonus||0)-parseFloat(r.deduction||0);

  // Sheet 1: Detail
  const ws1 = XLSX.utils.json_to_sheet(sal.map((r,i) => {
    const emp  = emps.find(e=>e.id===r.empId);
    return { '#':i+1,'ឈ្មោះ':emp?.name||r.empId,'នាយកដ្ឋាន':emp?.department||'',
             'ខែ':r.month,'ប្រាក់ខែ':parseFloat(r.base||0),'ប្រាក់លើថ្លៃ':parseFloat(r.bonus||0),
             'កាត់ប្រាក់':parseFloat(r.deduction||0),'សរុបសុទ្ធ':net(r),
             'ស្ថានភាព':r.status==='paid'?'បានបើក':'រង់ចាំ'};
  }));
  ws1['!cols']=[{wch:5},{wch:28},{wch:18},{wch:10},{wch:14},{wch:14},{wch:12},{wch:16},{wch:12}];
  XLSX.utils.book_append_sheet(wb, ws1, 'ប្រាក់ខែលម្អិត');

  // Sheet 2: Per-employee summary
  const empSum = emps.map(e => {
    const er = sal.filter(r=>r.empId===e.id);
    return { 'ឈ្មោះ':e.name,'នាយកដ្ឋាន':e.department,
             'ចំនួនខែ':er.length,'បានបើក':er.filter(r=>r.status==='paid').length,
             'រង់ចាំ':er.filter(r=>r.status==='pending').length,
             'ប្រាក់ខែ(ជាមធ្យម)':er.length?Math.round(er.reduce((s,r)=>s+net(r),0)/er.length):0,
             'សរុបបានបើក':er.filter(r=>r.status==='paid').reduce((s,r)=>s+net(r),0)};
  });
  const ws2 = XLSX.utils.json_to_sheet(empSum);
  ws2['!cols']=[{wch:28},{wch:18},{wch:10},{wch:10},{wch:10},{wch:18},{wch:18}];
  XLSX.utils.book_append_sheet(wb, ws2, 'សង្ខេបបុគ្គលិក');

  // Sheet 3: Dept summary
  const deptSum = depts.map(d => {
    const de = emps.filter(e=>e.department===d.name);
    const dr = sal.filter(r=>de.find(e=>e.id===r.empId));
    return { 'នាយកដ្ឋាន':d.name,'ចំនួនបុគ្គលិក':de.length,'ចំនួនកំណត់ត្រា':dr.length,
             'ចំណាយសរុប':dr.reduce((s,r)=>s+net(r),0),'បានបើក':dr.filter(r=>r.status==='paid').reduce((s,r)=>s+net(r),0) };
  });
  const ws3 = XLSX.utils.json_to_sheet(deptSum);
  ws3['!cols']=[{wch:20},{wch:14},{wch:16},{wch:16},{wch:16}];
  XLSX.utils.book_append_sheet(wb, ws3, 'សង្ខេបនាយកដ្ឋាន');

  XLSX.writeFile(wb, `hrpro_salary_report_${new Date().toISOString().slice(0,10)}.xlsx`);
  showToast('✅ Excel ប្រាក់ខែ 3 Sheets បានទាញ!', 'success');
}

function exportSalaryReportPDF() {
  if (!window.jspdf) { showToast('Library មិនទាន់ Load!', 'error'); return; }
  const { jsPDF } = window.jspdf;
  const sal  = DB.getSalary();
  const emps = DB.getEmployees();
  const depts= DB.getDepartments();
  const today= new Date().toLocaleDateString('en-GB');
  const net  = r => parseFloat(r.base||0)+parseFloat(r.bonus||0)-parseFloat(r.deduction||0);
  const doc  = new jsPDF({ orientation:'landscape', unit:'mm', format:'a4' });
  const pw   = doc.internal.pageSize.getWidth();
  const ph   = doc.internal.pageSize.getHeight();

  function hdr(t1,t2){
    doc.setFillColor(5,150,105);doc.rect(0,0,pw,17,'F');
    doc.setFillColor(16,185,129);doc.rect(0,17,pw,8,'F');
    doc.setTextColor(255,255,255);
    doc.setFontSize(13);doc.setFont('helvetica','bold');doc.text(t1,pw/2,11,{align:'center'});
    doc.setFontSize(8); doc.setFont('helvetica','normal');doc.text(t2,pw/2,23,{align:'center'});
    doc.setTextColor(26,31,54);
  }
  function ftr(){
    doc.setFillColor(220,252,231);doc.rect(0,ph-8,pw,8,'F');
    doc.setFontSize(7);doc.setTextColor(5,150,105);doc.setFont('helvetica','normal');
    doc.text('HR Pro — Salary Report  |  Confidential  |  '+today,pw/2,ph-2,{align:'center'});
  }

  const totalPaid=sal.filter(r=>r.status==='paid').reduce((s,r)=>s+net(r),0);
  const totalPend=sal.filter(r=>r.status==='pending').reduce((s,r)=>s+net(r),0);

  hdr('HR Pro — Salary Report  💰','Month: All  |  Printed: '+today+'  |  Records: '+sal.length);

  // KPI boxes
  const kW=(pw-20)/4-2;
  [
    {l:'Total Records',   v:sal.length,                            c:[5,150,105]},
    {l:'Paid',            v:sal.filter(r=>r.status==='paid').length+' records', c:[2,132,199]},
    {l:'Total Paid',      v:'$'+Number(totalPaid).toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2}),c:[124,58,237]},
    {l:'Pending',         v:'$'+Number(totalPend).toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2}),c:[217,119,6]},
  ].forEach((k,i)=>{
    const x=10+i*(kW+3);
    doc.setFillColor(...k.c);doc.roundedRect(x,29,kW,18,2,2,'F');
    doc.setTextColor(255,255,255);
    doc.setFontSize(13);doc.setFont('helvetica','bold');doc.text(String(k.v),x+kW/2,41,{align:'center'});
    doc.setFontSize(7.5);doc.setFont('helvetica','normal');doc.text(k.l,x+kW/2,35,{align:'center'});
  });

  // Detail table
  doc.setFontSize(10);doc.setFont('helvetica','bold');doc.setTextColor(5,150,105);
  doc.text('Salary Detail',10,54);
  doc.autoTable({
    head:[['#','Name','Dept','Month','Base','Bonus','Deduct','Net','Status']],
    body:sal.map((r,i)=>{
      const emp=emps.find(e=>e.id===r.empId);
      return [i+1,emp?.name||r.empId,emp?.department||'',r.month,
              Number(r.base||0).toLocaleString(),Number(r.bonus||0).toLocaleString(),
              Number(r.deduction||0).toLocaleString(),Math.round(net(r)).toLocaleString(),
              r.status==='paid'?'✓ Paid':'Pending'];
    }),
    startY:57,margin:{left:10,right:10},
    headStyles:{fillColor:[5,150,105],textColor:255,fontSize:7.5,fontStyle:'bold',halign:'center'},
    bodyStyles:{fontSize:7.5},
    columnStyles:{0:{halign:'center',cellWidth:8},2:{cellWidth:28},3:{halign:'center',cellWidth:18},
                  4:{halign:'right'},5:{halign:'right'},6:{halign:'right'},7:{halign:'right',fontStyle:'bold'},8:{halign:'center'}},
    alternateRowStyles:{fillColor:[240,253,244]},
    didParseCell(d){
      if(d.section==='body'&&d.column.index===8){
        d.cell.styles.textColor=d.cell.raw.includes('Paid')?[5,150,105]:[217,119,6];
        d.cell.styles.fontStyle='bold';
      }
    },
    didDrawPage:ftr
  });

  // Page 2: per-dept summary
  doc.addPage();
  hdr('Salary by Department','Department Breakdown');
  doc.autoTable({
    head:[['Department','Employees','Records','Total Paid','Total Pending','Grand Total']],
    body:depts.map(d=>{
      const de=emps.filter(e=>e.department===d.name);
      const dr=sal.filter(r=>de.find(e=>e.id===r.empId));
      const p=dr.filter(r=>r.status==='paid').reduce((s,r)=>s+net(r),0);
      const pn=dr.filter(r=>r.status==='pending').reduce((s,r)=>s+net(r),0);
      return [d.name,de.length,dr.length,'$'+Math.round(p).toLocaleString('en-US'),'$'+Math.round(pn).toLocaleString('en-US'),'$'+Math.round(p+pn).toLocaleString('en-US')];
    }),
    startY:30,margin:{left:10,right:10},
    headStyles:{fillColor:[5,150,105],textColor:255,fontSize:9,fontStyle:'bold',halign:'center'},
    bodyStyles:{fontSize:9},
    columnStyles:{1:{halign:'center'},2:{halign:'center'},3:{halign:'right'},4:{halign:'right'},5:{halign:'right',fontStyle:'bold'}},
    alternateRowStyles:{fillColor:[240,253,244]},
    didDrawPage:ftr
  });

  doc.save('hrpro_salary_report_'+new Date().toISOString().slice(0,10)+'.pdf');
  showToast('✅ PDF ប្រាក់ខែ 2 Pages បានទាញ!', 'success');
}

// ============================================================
// LEAVE REPORT
// ============================================================
function renderLeaveReport() {
  const leave = DB.getLeave();
  const emps  = DB.getEmployees();
  const depts = DB.getDepartments();

  const tyF = (document.getElementById('lv-rpt-type')  ||{}).value || '';
  const stF = (document.getElementById('lv-rpt-status')||{}).value || '';

  let recs = leave;
  if (tyF) recs = recs.filter(l => l.type   === tyF);
  if (stF) recs = recs.filter(l => l.status === stF);

  const days = l => (l.startDate && l.endDate)
    ? Math.max(0, Math.ceil((new Date(l.endDate)-new Date(l.startDate))/864e5)+1) : 0;

  const approved = recs.filter(l=>l.status==='approved');
  const pending  = recs.filter(l=>l.status==='pending');
  const rejected = recs.filter(l=>l.status==='rejected');
  const totalDaysApproved = approved.reduce((s,l)=>s+days(l),0);

  // ── KPI ──────────────────────────────────────────────────
  const kpis = [
    { icon:'fas fa-file-alt',      label:'ស្នើសរុប',      val:recs.length,           sub:'ច្បាប់',               color:'#3B5BDB' },
    { icon:'fas fa-check-circle',  label:'បានអនុម័ត',     val:approved.length,       sub:`${totalDaysApproved} ថ្ងៃ`,color:'#059669' },
    { icon:'fas fa-hourglass-half',label:'រង់ចាំ',         val:pending.length,        sub:'ករណី',                color:'#D97706' },
    { icon:'fas fa-times-circle',  label:'បដិសេធ',        val:rejected.length,       sub:'ករណី',                color:'#DC2626' },
    { icon:'fas fa-calendar-day',  label:'ថ្ងៃឈប់ Avg',   val:recs.length?Math.round(recs.reduce((s,l)=>s+days(l),0)/recs.length):0,sub:'ថ្ងៃ/ច្បាប់',color:'#7C3AED' },
    { icon:'fas fa-users',         label:'ចំនួនអ្នកស្នើ', val:new Set(recs.map(l=>l.empId)).size,sub:'នាក់',     color:'#0284C7' },
  ];
  document.getElementById('lv-rpt-kpi').innerHTML = kpis.map(k=>`
    <div class="rpt-kpi-card" style="border-top:3px solid ${k.color};">
      <div class="rpt-kpi-icon" style="background:${k.color}18;color:${k.color};"><i class="${k.icon}"></i></div>
      <div class="rpt-kpi-val" style="color:${k.color};">${k.val}</div>
      <div class="rpt-kpi-label">${k.label}</div>
      <div class="rpt-kpi-sub">${k.sub}</div>
    </div>`).join('');

  // ── Donut: status breakdown ──────────────────────────────
  const statusData = [
    {label:'អនុម័ត',val:approved.length,color:'#10B981'},
    {label:'រង់ចាំ', val:pending.length, color:'#F59E0B'},
    {label:'បដិសេធ',val:rejected.length,color:'#EF4444'},
  ];
  const lvCanvas = document.getElementById('lv-donut');
  if (lvCanvas) {
    const ctx=lvCanvas.getContext('2d');
    ctx.clearRect(0,0,150,150);
    const tot = recs.length || 1;
    let a = -Math.PI/2;
    statusData.forEach(sd => {
      if (!sd.val) return;
      const slice = sd.val/tot*Math.PI*2;
      ctx.beginPath();ctx.moveTo(75,75);ctx.arc(75,75,62,a,a+slice);
      ctx.closePath();ctx.fillStyle=sd.color;ctx.fill();
      a+=slice;
    });
    ctx.beginPath();ctx.arc(75,75,42,0,Math.PI*2);ctx.fillStyle='#fff';ctx.fill();
    ctx.textAlign='center';ctx.fillStyle='#1A1F36';
    ctx.font='bold 16px Arial';ctx.fillText(recs.length,75,79);
    ctx.font='9px Arial';ctx.fillStyle='#5A6480';ctx.fillText('ច្បាប់',75,91);
  }
  document.getElementById('lv-donut-legend').innerHTML = statusData.map(sd=>`
    <div style="background:${sd.color}12;border-radius:10px;padding:10px 12px;border-left:4px solid ${sd.color};">
      <div style="display:flex;justify-content:space-between;align-items:center;">
        <span style="font-size:12px;font-weight:700;color:${sd.color};">${sd.label}</span>
        <span style="font-size:18px;font-weight:700;color:var(--text);">${sd.val}</span>
      </div>
      <div style="font-size:11px;color:var(--text-muted);">${recs.length?Math.round(sd.val/recs.length*100):0}% នៃសរុប</div>
    </div>`).join('');

  // ── Type bars ────────────────────────────────────────────
  const TYPES = [
    {k:'annual',   label:'ប្រចាំឆ្នាំ',  color:'#3B5BDB'},
    {k:'sick',     label:'ជំងឺ',         color:'#DC2626'},
    {k:'maternity',label:'មាតុភាព',     color:'#7C3AED'},
    {k:'emergency',label:'បន្ទាន់',      color:'#D97706'},
    {k:'unpaid',   label:'គ្មានប្រាក់', color:'#5A6480'},
  ];
  const typeMax = Math.max(...TYPES.map(t=>recs.filter(l=>l.type===t.k).length),1);
  document.getElementById('lv-type-bars').innerHTML = TYPES.map(t=>{
    const cnt = recs.filter(l=>l.type===t.k).length;
    const d   = recs.filter(l=>l.type===t.k).reduce((s,l)=>s+days(l),0);
    return `
      <div>
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px;">
          <span style="font-size:12px;font-weight:600;color:var(--text);">${t.label}</span>
          <span style="font-size:11px;color:var(--text-muted);">${cnt} ច្បាប់ · ${d} ថ្ងៃ</span>
        </div>
        <div style="height:10px;background:var(--border);border-radius:5px;overflow:hidden;">
          <div style="width:${Math.round(cnt/typeMax*100)}%;height:100%;background:${t.color};border-radius:5px;transition:width .6s;"></div>
        </div>
      </div>`;
  }).join('');

  // ── Per-employee summary table ───────────────────────────
  const empLeave = emps.map(e=>{
    const er = recs.filter(l=>l.empId===e.id);
    if (!er.length) return null;
    const dept = depts.find(d=>d.name===e.department)||{};
    return { e, er, dept,
      approved: er.filter(l=>l.status==='approved').length,
      pending:  er.filter(l=>l.status==='pending').length,
      totalDays:er.reduce((s,l)=>s+days(l),0)
    };
  }).filter(Boolean).sort((a,b)=>b.er.length-a.er.length);

  document.getElementById('lv-emp-table').innerHTML = empLeave.length ? `
    <table class="data-table" style="min-width:600px;">
      <thead><tr>
        <th>#</th><th>ឈ្មោះ</th><th>នាយកដ្ឋាន</th>
        <th style="text-align:center;">ស្នើ</th>
        <th style="text-align:center;">អនុម័ត</th>
        <th style="text-align:center;">រង់ចាំ</th>
        <th style="text-align:center;">ថ្ងៃឈប់សរុប</th>
      </tr></thead>
      <tbody>
        ${empLeave.map((row,i)=>`<tr>
          <td style="text-align:center;color:var(--text-muted);font-size:12px;">${i+1}</td>
          <td><strong>${row.e.name}</strong></td>
          <td><span style="background:${row.dept.color||'#3B5BDB'}18;color:${row.dept.color||'#3B5BDB'};padding:2px 8px;border-radius:12px;font-size:11px;font-weight:600;">${row.e.department}</span></td>
          <td style="text-align:center;font-weight:700;">${row.er.length}</td>
          <td style="text-align:center;color:#059669;font-weight:700;">${row.approved}</td>
          <td style="text-align:center;color:#D97706;font-weight:700;">${row.pending}</td>
          <td style="text-align:center;font-weight:700;color:var(--primary);">${row.totalDays} ថ្ងៃ</td>
        </tr>`).join('')}
      </tbody>
    </table>` : '<div class="empty-state">មិនមានទិន្នន័យ</div>';

  // ── Detail table ─────────────────────────────────────────
  const sorted = [...recs].sort((a,b)=>new Date(b.createdAt||0)-new Date(a.createdAt||0));
  document.getElementById('lv-rpt-table').innerHTML = sorted.length ? `
    <table class="data-table" style="min-width:750px;">
      <thead><tr>
        <th>#</th><th>ឈ្មោះ</th><th>នាយកដ្ឋាន</th><th>ប្រភេទ</th>
        <th style="text-align:center;">ចាប់ផ្ដើម</th>
        <th style="text-align:center;">បញ្ចប់</th>
        <th style="text-align:center;">ថ្ងៃ</th>
        <th>មូលហេតុ</th>
        <th style="text-align:center;">ស្ថានភាព</th>
      </tr></thead>
      <tbody>
        ${sorted.map((l,i)=>{
          const emp  = emps.find(e=>e.id===l.empId);
          const dept = depts.find(d=>d.name===emp?.department)||{};
          const d    = days(l);
          const stC  = {approved:'#DCFCE7;color:#15803D',pending:'#FFF7ED;color:#C2410C',rejected:'#FEF2F2;color:#DC2626'}[l.status]||'#F8FAFF;color:#5A6480';
          const stL  = {approved:'✓ អនុម័ត',pending:'⏳ រង់ចាំ',rejected:'✗ បដិសេធ'}[l.status]||l.status;
          return `<tr>
            <td style="text-align:center;color:var(--text-muted);font-size:12px;">${i+1}</td>
            <td><strong>${emp?.name||l.empId}</strong></td>
            <td><span style="background:${dept.color||'#3B5BDB'}18;color:${dept.color||'#3B5BDB'};padding:2px 8px;border-radius:12px;font-size:11px;font-weight:600;">${emp?.department||'—'}</span></td>
            <td style="font-size:12px;">${leaveTypeLabel(l.type)}</td>
            <td style="text-align:center;font-size:12px;">${l.startDate||'—'}</td>
            <td style="text-align:center;font-size:12px;">${l.endDate||'—'}</td>
            <td style="text-align:center;font-weight:700;color:var(--primary);">${d||'—'}</td>
            <td style="font-size:12px;color:var(--text-muted);">${l.reason||'—'}</td>
            <td style="text-align:center;"><span style="padding:3px 10px;border-radius:12px;font-size:11px;font-weight:700;background:${stC};">${stL}</span></td>
          </tr>`;
        }).join('')}
      </tbody>
    </table>` : '<div class="empty-state">មិនមានទិន្នន័យ</div>';
}

function exportLeaveReportExcel() {
  if (typeof XLSX === 'undefined') { showToast('Library មិនទាន់ Load!', 'error'); return; }
  const leave= DB.getLeave();
  const emps = DB.getEmployees();
  const wb   = XLSX.utils.book_new();
  const days = l => (l.startDate&&l.endDate)?Math.max(0,Math.ceil((new Date(l.endDate)-new Date(l.startDate))/864e5)+1):0;

  // Sheet 1: All leave detail
  const ws1 = XLSX.utils.json_to_sheet(leave.sort((a,b)=>a.empId.localeCompare(b.empId)).map((l,i)=>{
    const emp=emps.find(e=>e.id===l.empId);
    return {'#':i+1,'ឈ្មោះ':emp?.name||l.empId,'នាយកដ្ឋាន':emp?.department||'',
            'ប្រភេទ':leaveTypeLabel(l.type),'ចាប់ផ្ដើម':l.startDate||'','បញ្ចប់':l.endDate||'',
            'ថ្ងៃ':days(l),'មូលហេតុ':l.reason||'','ស្ថានភាព':leaveStatusLabel(l.status)};
  }));
  ws1['!cols']=[{wch:5},{wch:28},{wch:18},{wch:18},{wch:13},{wch:13},{wch:8},{wch:30},{wch:12}];
  XLSX.utils.book_append_sheet(wb, ws1, 'ច្បាប់ឈប់លម្អិត');

  // Sheet 2: Per-employee summary
  const empSum=emps.map(e=>{
    const er=leave.filter(l=>l.empId===e.id);
    return {'ឈ្មោះ':e.name,'នាយកដ្ឋាន':e.department,
            'ចំនួនស្នើ':er.length,'អនុម័ត':er.filter(l=>l.status==='approved').length,
            'រង់ចាំ':er.filter(l=>l.status==='pending').length,'បដិសេធ':er.filter(l=>l.status==='rejected').length,
            'ថ្ងៃឈប់សរុប':er.reduce((s,l)=>s+days(l),0)};
  });
  const ws2=XLSX.utils.json_to_sheet(empSum);
  ws2['!cols']=[{wch:28},{wch:18},{wch:12},{wch:10},{wch:10},{wch:10},{wch:14}];
  XLSX.utils.book_append_sheet(wb, ws2, 'សង្ខេបបុគ្គលិក');

  XLSX.writeFile(wb,'hrpro_leave_report_'+new Date().toISOString().slice(0,10)+'.xlsx');
  showToast('✅ Excel ច្បាប់ឈប់ 2 Sheets បានទាញ!', 'success');
}

function exportLeaveReportPDF() {
  if (!window.jspdf) { showToast('Library មិនទាន់ Load!', 'error'); return; }
  const { jsPDF } = window.jspdf;
  const leave= DB.getLeave();
  const emps = DB.getEmployees();
  const today= new Date().toLocaleDateString('en-GB');
  const days = l=>(l.startDate&&l.endDate)?Math.max(0,Math.ceil((new Date(l.endDate)-new Date(l.startDate))/864e5)+1):0;
  const doc  = new jsPDF({ orientation:'landscape', unit:'mm', format:'a4' });
  const pw   = doc.internal.pageSize.getWidth();
  const ph   = doc.internal.pageSize.getHeight();

  function hdr(t1,t2){
    doc.setFillColor(124,58,237);doc.rect(0,0,pw,17,'F');
    doc.setFillColor(139,92,246);doc.rect(0,17,pw,8,'F');
    doc.setTextColor(255,255,255);
    doc.setFontSize(13);doc.setFont('helvetica','bold');doc.text(t1,pw/2,11,{align:'center'});
    doc.setFontSize(8); doc.setFont('helvetica','normal');doc.text(t2,pw/2,23,{align:'center'});
    doc.setTextColor(26,31,54);
  }
  function ftr(){
    doc.setFillColor(245,243,255);doc.rect(0,ph-8,pw,8,'F');
    doc.setFontSize(7);doc.setTextColor(124,58,237);doc.setFont('helvetica','normal');
    doc.text('HR Pro — Leave Report  |  Confidential  |  '+today,pw/2,ph-2,{align:'center'});
  }

  const approved=leave.filter(l=>l.status==='approved');
  const pending =leave.filter(l=>l.status==='pending');
  hdr('HR Pro — Leave Report  📋','Printed: '+today+'  |  Total: '+leave.length+'  |  Approved: '+approved.length+'  |  Pending: '+pending.length);

  // KPI
  const kW=(pw-20)/4-2;
  [{l:'Total Requests',v:leave.length,c:[124,58,237]},
   {l:'Approved',v:approved.length,c:[5,150,105]},
   {l:'Pending',v:pending.length,c:[217,119,6]},
   {l:'Total Days (Approved)',v:approved.reduce((s,l)=>s+days(l),0)+' days',c:[2,132,199]}
  ].forEach((k,i)=>{
    const x=10+i*(kW+3);
    doc.setFillColor(...k.c);doc.roundedRect(x,29,kW,17,2,2,'F');
    doc.setTextColor(255,255,255);
    doc.setFontSize(13);doc.setFont('helvetica','bold');doc.text(String(k.v),x+kW/2,40,{align:'center'});
    doc.setFontSize(7.5);doc.setFont('helvetica','normal');doc.text(k.l,x+kW/2,34,{align:'center'});
  });

  // Leave detail table
  doc.setFontSize(10);doc.setFont('helvetica','bold');doc.setTextColor(124,58,237);
  doc.text('Leave Request Detail',10,53);
  doc.autoTable({
    head:[['#','Employee','Department','Type','Start','End','Days','Reason','Status']],
    body:leave.sort((a,b)=>new Date(b.createdAt||0)-new Date(a.createdAt||0)).map((l,i)=>{
      const emp=emps.find(e=>e.id===l.empId);
      return [i+1,emp?.name||l.empId,emp?.department||'',leaveTypeLabel(l.type),
              l.startDate||'',l.endDate||'',days(l)||'',l.reason||'',leaveStatusLabel(l.status)];
    }),
    startY:56,margin:{left:10,right:10},
    headStyles:{fillColor:[124,58,237],textColor:255,fontSize:7.5,fontStyle:'bold',halign:'center'},
    bodyStyles:{fontSize:7.5},
    columnStyles:{0:{halign:'center',cellWidth:8},2:{cellWidth:25},3:{cellWidth:28},
                  4:{halign:'center',cellWidth:18},5:{halign:'center',cellWidth:18},
                  6:{halign:'center',cellWidth:10},8:{halign:'center',cellWidth:18}},
    alternateRowStyles:{fillColor:[245,243,255]},
    didParseCell(d){
      if(d.section==='body'&&d.column.index===8){
        const v=d.cell.raw;
        d.cell.styles.textColor=v==='អនុម័ត'?[5,150,105]:v==='រង់ចាំ'?[217,119,6]:[220,38,38];
        d.cell.styles.fontStyle='bold';
      }
    },
    didDrawPage:ftr
  });

  // Page 2: per-employee summary
  doc.addPage();
  hdr('Leave Summary per Employee','');
  doc.autoTable({
    head:[['Employee','Department','Total','Approved','Pending','Rejected','Total Days']],
    body:emps.filter(e=>leave.find(l=>l.empId===e.id)).map(e=>{
      const er=leave.filter(l=>l.empId===e.id);
      return [e.name,e.department,er.length,
              er.filter(l=>l.status==='approved').length,
              er.filter(l=>l.status==='pending').length,
              er.filter(l=>l.status==='rejected').length,
              er.reduce((s,l)=>s+days(l),0)+' days'];
    }),
    startY:30,margin:{left:10,right:10},
    headStyles:{fillColor:[124,58,237],textColor:255,fontSize:9,fontStyle:'bold',halign:'center'},
    bodyStyles:{fontSize:9},
    columnStyles:{2:{halign:'center'},3:{halign:'center'},4:{halign:'center'},5:{halign:'center'},6:{halign:'center'}},
    alternateRowStyles:{fillColor:[245,243,255]},
    didDrawPage:ftr
  });

  doc.save('hrpro_leave_report_'+new Date().toISOString().slice(0,10)+'.pdf');
  showToast('✅ PDF ច្បាប់ឈប់ 2 Pages បានទាញ!', 'success');
}

// ===== SALARY PAGE EXPORTS =====
function exportSalaryPageExcel() {
  if (typeof XLSX === 'undefined') { showToast('Library មិនទាន់ Load!', 'error'); return; }
  const empF   = document.getElementById('salary-emp-filter')?.value   || '';
  const monthF = document.getElementById('salary-month-filter')?.value || '';
  const statF  = document.getElementById('salary-status-filter')?.value|| '';
  let records  = DB.getSalary();
  if (empF)   records = records.filter(s=>s.empId===empF);
  if (monthF) records = records.filter(s=>s.month===monthF);
  if (statF)  records = records.filter(s=>s.status===statF);
  records = records.sort((a,b)=>b.month.localeCompare(a.month));
  const emps  = DB.getEmployees();
  const net   = r => parseFloat(r.base||0)+parseFloat(r.bonus||0)-parseFloat(r.deduction||0);
  const wb    = XLSX.utils.book_new();
  const data  = records.map((r,i) => {
    const emp = emps.find(e=>e.id===r.empId);
    return {'#':i+1,'ឈ្មោះ':emp?.name||r.empId,'នាយកដ្ឋាន':emp?.department||'',
            'ខែ':r.month,'ប្រាក់ខែ':parseFloat(r.base||0),
            'ប្រាក់លើថ្លៃ':parseFloat(r.bonus||0),'កាត់ប្រាក់':parseFloat(r.deduction||0),
            'សរុបសុទ្ធ':net(r),'ស្ថានភាព':r.status==='paid'?'បានបើក':'រង់ចាំ'};
  });
  const ws = XLSX.utils.json_to_sheet(data.length ? data : [{'ចំណាំ':'គ្មានទិន្នន័យ'}]);
  ws['!cols'] = [{wch:5},{wch:28},{wch:18},{wch:10},{wch:14},{wch:14},{wch:12},{wch:16},{wch:12}];
  XLSX.utils.book_append_sheet(wb, ws, 'ប្រាក់ខែ');
  XLSX.writeFile(wb, `hrpro_salary_${new Date().toISOString().slice(0,10)}.xlsx`);
  showToast('✅ Excel ប្រាក់ខែបានទាញ!', 'success');
}

function exportSalaryPagePDF() {
  if (!window.jspdf) { showToast('Library មិនទាន់ Load!', 'error'); return; }
  const { jsPDF } = window.jspdf;
  const empF   = document.getElementById('salary-emp-filter')?.value   || '';
  const monthF = document.getElementById('salary-month-filter')?.value || '';
  const statF  = document.getElementById('salary-status-filter')?.value|| '';
  let records  = DB.getSalary();
  if (empF)   records = records.filter(s=>s.empId===empF);
  if (monthF) records = records.filter(s=>s.month===monthF);
  if (statF)  records = records.filter(s=>s.status===statF);
  records = records.sort((a,b)=>b.month.localeCompare(a.month));
  const emps  = DB.getEmployees();
  const net   = r => parseFloat(r.base||0)+parseFloat(r.bonus||0)-parseFloat(r.deduction||0);
  const today = new Date().toLocaleDateString('en-GB');
  const doc   = new jsPDF({ orientation:'landscape', unit:'mm', format:'a4' });
  const pw    = doc.internal.pageSize.getWidth();
  const ph    = doc.internal.pageSize.getHeight();
  doc.setFillColor(6,78,59);  doc.rect(0,0,pw,16,'F');
  doc.setFillColor(6,95,70);  doc.rect(0,16,pw,8,'F');
  doc.setTextColor(255,255,255);
  doc.setFontSize(13); doc.setFont('helvetica','bold');
  doc.text('HR Pro — Salary Report 💰', pw/2, 10, {align:'center'});
  doc.setFontSize(8);  doc.setFont('helvetica','normal');
  doc.text(`Records: ${records.length}  |  Printed: ${today}`, pw/2, 22, {align:'center'});
  doc.setTextColor(26,31,54);
  const totNet = records.reduce((s,r)=>s+net(r),0);
  doc.autoTable({
    head:[['#','Employee','Dept','Month','Base','Bonus','Deduct','Net','Status']],
    body: records.map((r,i)=>{
      const emp=emps.find(e=>e.id===r.empId);
      return [i+1,emp?.name||r.empId,emp?.department||'',r.month,
              Number(r.base||0).toLocaleString(),Number(r.bonus||0).toLocaleString(),
              Number(r.deduction||0).toLocaleString(),('$'+Math.round(net(r)).toLocaleString('en-US')),
              r.status==='paid'?'✓ Paid':'Pending'];
    }),
    foot:[['','Total','','',
           Math.round(records.reduce((s,r)=>s+parseFloat(r.base||0),0)).toLocaleString(),
           Math.round(records.reduce((s,r)=>s+parseFloat(r.bonus||0),0)).toLocaleString(),
           Math.round(records.reduce((s,r)=>s+parseFloat(r.deduction||0),0)).toLocaleString(),
           Math.round(totNet).toLocaleString('en-US')+' $','']],
    startY:30, margin:{left:10,right:10},
    headStyles:{fillColor:[6,78,59],textColor:255,fontSize:7.5,fontStyle:'bold',halign:'center'},
    footStyles:{fillColor:[6,78,59],textColor:255,fontSize:8,fontStyle:'bold'},
    bodyStyles:{fontSize:7.5},
    columnStyles:{0:{halign:'center',cellWidth:8},2:{cellWidth:25},3:{halign:'center',cellWidth:18},
                  4:{halign:'right'},5:{halign:'right'},6:{halign:'right'},7:{halign:'right',fontStyle:'bold'},8:{halign:'center'}},
    alternateRowStyles:{fillColor:[240,253,244]},
    didParseCell(d){
      if(d.section==='body'&&d.column.index===8){
        d.cell.styles.textColor=d.cell.raw.includes('Paid')?[5,150,105]:[217,119,6];
        d.cell.styles.fontStyle='bold';
      }
    },
    didDrawPage(){
      doc.setFillColor(220,252,231); doc.rect(0,ph-8,pw,8,'F');
      doc.setFontSize(7);doc.setTextColor(5,150,105);
      doc.text('HR Pro — Salary Report  |  Confidential  |  '+today,pw/2,ph-2,{align:'center'});
    }
  });
  doc.save(`hrpro_salary_${new Date().toISOString().slice(0,10)}.pdf`);
  showToast('✅ PDF ប្រាក់ខែបានទាញ!', 'success');
}

// ===== EMPLOYEES EXPORT =====
function exportEmpExcel() {
  if (typeof XLSX === 'undefined') { showToast('Library មិនទាន់ Load!', 'error'); return; }
  const emps = getFilteredEmployees();
  const att  = DB.getAttendance();
  const wb   = XLSX.utils.book_new();
  const data = emps.map((e,i) => {
    const ea   = att.filter(a=>a.empId===e.id);
    const rate = ea.length?Math.round(ea.filter(a=>a.status==='present').length/ea.length*100):0;
    return {'#':i+1,'ID':e.id,'ឈ្មោះ':e.name,'ភេទ':e.gender==='male'?'ប្រុស':'ស្រី',
            'ថ្ងៃកំណើត':e.dob||'','ទូរស័ព្ទ':e.phone||'','អ៊ីមែល':e.email||'',
            'នាយកដ្ឋាន':e.department,'តួនាទី':e.position,
            'ប្រាក់ខែ':e.salary||0,'ថ្ងៃចូល':e.startDate||'',
            'ស្ថានភាព':statusLabel(e.status),'អាសយដ្ឋាន':e.address||'','%វត្តមាន':rate+'%'};
  });
  const ws = XLSX.utils.json_to_sheet(data.length?data:[{'ចំណាំ':'គ្មានទិន្នន័យ'}]);
  ws['!cols']=[{wch:4},{wch:10},{wch:28},{wch:8},{wch:13},{wch:14},{wch:24},{wch:18},{wch:22},{wch:14},{wch:13},{wch:14},{wch:20},{wch:12}];
  XLSX.utils.book_append_sheet(wb, ws, 'បញ្ជីបុគ្គលិក');
  XLSX.writeFile(wb, `hrpro_employees_${new Date().toISOString().slice(0,10)}.xlsx`);
  showToast('✅ Excel បុគ្គលិកបានទាញ!', 'success');
}

function exportEmpPDF() {
  if (!window.jspdf) { showToast('Library មិនទាន់ Load!', 'error'); return; }
  const { jsPDF } = window.jspdf;
  const emps  = getFilteredEmployees();
  const att   = DB.getAttendance();
  const today = new Date().toLocaleDateString('en-GB');
  const doc   = new jsPDF({ orientation:'landscape', unit:'mm', format:'a4' });
  const pw    = doc.internal.pageSize.getWidth();
  const ph    = doc.internal.pageSize.getHeight();
  doc.setFillColor(26,35,126); doc.rect(0,0,pw,16,'F');
  doc.setFillColor(40,53,147); doc.rect(0,16,pw,8,'F');
  doc.setTextColor(255,255,255);
  doc.setFontSize(13); doc.setFont('helvetica','bold');
  doc.text('HR Pro — Employee Directory 👥', pw/2, 10, {align:'center'});
  doc.setFontSize(8); doc.setFont('helvetica','normal');
  doc.text(`Total: ${emps.length}  |  Printed: ${today}`, pw/2, 22, {align:'center'});
  doc.setTextColor(26,31,54);
  doc.autoTable({
    head:[['#','ID','Name','Dept','Position','Gender','Phone','Salary','Status','Att%']],
    body: emps.map((e,i)=>{
      const ea=att.filter(a=>a.empId===e.id);
      const rt=ea.length?Math.round(ea.filter(a=>a.status==='present').length/ea.length*100):0;
      return [i+1,e.id,e.name,e.department,e.position,e.gender==='male'?'M':'F',
              e.phone||'—','$'+Number(e.salary||0).toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2}),
              {active:'Active',inactive:'Inactive',leave:'On Leave'}[e.status]||e.status,rt+'%'];
    }),
    startY:28, margin:{left:10,right:10},
    headStyles:{fillColor:[26,35,126],textColor:255,fontSize:7.5,fontStyle:'bold',halign:'center'},
    bodyStyles:{fontSize:7.5},
    columnStyles:{0:{halign:'center',cellWidth:8},1:{cellWidth:18},4:{cellWidth:28},
                  5:{halign:'center',cellWidth:12},6:{cellWidth:22},7:{halign:'right'},
                  8:{halign:'center'},9:{halign:'center',cellWidth:12}},
    alternateRowStyles:{fillColor:[238,242,255]},
    didParseCell(d){
      if(d.section==='body'&&d.column.index===8){
        d.cell.styles.textColor=d.cell.raw==='Active'?[5,150,105]:d.cell.raw==='On Leave'?[217,119,6]:[220,38,38];
        d.cell.styles.fontStyle='bold';
      }
    },
    didDrawPage(){
      doc.setFillColor(238,242,255); doc.rect(0,ph-8,pw,8,'F');
      doc.setFontSize(7);doc.setTextColor(59,91,219);
      doc.text('HR Pro  |  Confidential  |  '+today,pw/2,ph-2,{align:'center'});
    }
  });
  doc.save(`hrpro_employees_${new Date().toISOString().slice(0,10)}.pdf`);
  showToast('✅ PDF បុគ្គលិកបានទាញ!', 'success');
}

// ===== OT MODULE =====

let editingOTId = null;

// ---- Helpers ----
function otTypeLabel(t) {
  return {weekday:'ថ្ងៃធ្វើការ', weekend:'ថ្ងៃឈប់សម្រាក', holiday:'ថ្ងៃបុណ្យ'}[t] || t;
}
function otTypeMultiplier(t) {
  return {weekday:1.5, weekend:2.0, holiday:3.0}[t] || 1.5;
}
function otStatusLabel(s) {
  return {approved:'អនុម័ត', pending:'រង់ចាំ', rejected:'បដិសេធ'}[s] || s;
}
function calcOTHours(start, end) {
  if (!start || !end) return 0;
  const [sh,sm] = start.split(':').map(Number);
  const [eh,em] = end.split(':').map(Number);
  let mins = (eh*60+em) - (sh*60+sm);
  if (mins < 0) mins += 24*60;
  return Math.round(mins/60*10)/10;
}
function calcOTAmount(hours, rate, type) {
  return Math.round(hours * parseFloat(rate||0) * otTypeMultiplier(type) * 100)/100;
}

// ---- Populate Filters ----
function populateOTFilters() {
  const emps = DB.getEmployees();
  const sel = document.getElementById('ot-emp-filter');
  if (!sel) return;
  const cur = sel.value;
  sel.innerHTML = '<option value="">បុគ្គលិកទាំងអស់</option>' +
    emps.map(e=>`<option value="${e.id}">${e.name}</option>`).join('');
  sel.value = cur;
}

// ---- Render OT Page ----
function renderOT() {
  const empF   = document.getElementById('ot-emp-filter')?.value    || '';
  const monthF = document.getElementById('ot-month-filter')?.value  || '';
  const typeF  = document.getElementById('ot-type-filter')?.value   || '';
  const statF  = document.getElementById('ot-status-filter')?.value || '';
  const emps   = DB.getEmployees();
  let records  = DB.getOT();
  if (empF)   records = records.filter(o=>o.empId===empF);
  if (monthF) records = records.filter(o=>(o.date||'').startsWith(monthF));
  if (typeF)  records = records.filter(o=>o.type===typeF);
  if (statF)  records = records.filter(o=>o.status===statF);
  records = records.sort((a,b)=>new Date(b.date||0)-new Date(a.date||0));

  // ── KPI strip ──
  const allOT    = DB.getOT();
  const totalHrs = allOT.reduce((s,o)=>s+parseFloat(o.hours||0),0);
  const totalAmt = allOT.reduce((s,o)=>s+parseFloat(o.amount||0),0);
  const approved = allOT.filter(o=>o.status==='approved').length;
  const pending  = allOT.filter(o=>o.status==='pending').length;
  const strip    = document.getElementById('ot-kpi-strip');
  if (strip) strip.innerHTML = [
    {icon:'fas fa-list-check',    lbl:'កំណត់ត្រា OT', val:allOT.length,                       color:'#3B5BDB'},
    {icon:'fas fa-clock',         lbl:'ម៉ OT សរុប',    val:totalHrs.toFixed(1)+'h',             color:'#F59E0B'},
    {icon:'fas fa-circle-check',  lbl:'អនុម័ត',         val:approved,                            color:'#059669'},
    {icon:'fas fa-hourglass-half',lbl:'រង់ចាំ',          val:pending,                             color:'#D97706'},
    {icon:'fas fa-dollar-sign',   lbl:'ប្រាក់ OT សរុប', val:'$'+totalAmt.toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2}), color:'#7C3AED'},
  ].map(k=>`
    <div class="ot-kpi-card" style="--ot-color:${k.color}">
      <div class="ot-kpi-icon"><i class="${k.icon}"></i></div>
      <div>
        <div class="ot-kpi-val">${k.val}</div>
        <div class="ot-kpi-lbl">${k.lbl}</div>
      </div>
    </div>`).join('');

  // ── Populate emp filter once ──
  const empSel = document.getElementById('ot-emp-filter');
  if (empSel && empSel.options.length <= 1) {
    const cur = empSel.value;
    empSel.innerHTML = '<option value="">បុគ្គលិកទាំងអស់</option>' +
      emps.map(e=>`<option value="${e.id}">${e.name}</option>`).join('');
    empSel.value = cur;
  }

  // ── Table ──
  const con = document.getElementById('ot-container');
  if (!con) return;

  if (!records.length) {
    con.innerHTML = `
      <div class="ot-empty">
        <div class="ot-empty-ico"><i class="fas fa-business-time"></i></div>
        <div class="ot-empty-title">មិនមានកំណត់ត្រា OT</div>
        <div class="ot-empty-sub">ចុច "បន្ថែម OT" ដើម្បីបន្ថែមកំណត់ត្រាថ្មី</div>
      </div>`;
    return;
  }

  const filteredAmt = records.reduce((s,o)=>s+parseFloat(o.amount||0),0);

  con.innerHTML = `
  <div class="ot-table-wrap">
    <table class="ot-table">
      <thead><tr>
        <th>#</th>
        <th>បុគ្គលិក</th>
        <th>ថ្ងៃខែ</th>
        <th>ម៉ោង (ចូល→ចេញ)</th>
        <th style="text-align:center;">ម៉ OT</th>
        <th>ប្រភេទ</th>
        <th style="text-align:right;">អត្រា/ម៉</th>
        <th style="text-align:right;">ប្រាក់ OT</th>
        <th>ស្ថានភាព</th>
        <th style="width:76px;"></th>
      </tr></thead>
      <tbody>
        ${records.map((o,i)=>{
          const emp  = emps.find(e=>e.id===o.empId);
          const mult = otTypeMultiplier(o.type);
          const init = (emp?.name||'?')[0].toUpperCase();
          return `<tr>
            <td style="color:#94a3b8;font-size:.72rem;font-weight:700;">${String(i+1).padStart(2,'0')}</td>
            <td>
              <div class="ot-emp-cell">
                <div class="ot-emp-av">${emp?.photo?`<img src="${emp.photo}">`:''}${!emp?.photo?init:''}</div>
                <div>
                  <div class="ot-emp-name">${emp?.name||o.empId}</div>
                  <div class="ot-emp-sub">${emp?.position||''} · ${emp?.department||''}</div>
                </div>
              </div>
            </td>
            <td style="font-size:.82rem;font-weight:600;color:var(--text);">${o.date||'—'}</td>
            <td style="font-size:.75rem;color:#64748b;">${o.startTime||'—'} → ${o.endTime||'—'}</td>
            <td style="text-align:center;"><span class="ot-hrs-val">${parseFloat(o.hours||0).toFixed(1)}h</span></td>
            <td><span class="ot-type-badge ${o.type}">${otTypeLabel(o.type)}<span style="font-size:.6rem;opacity:.7;margin-left:3px;">×${mult}</span></span></td>
            <td style="text-align:right;font-size:.8rem;color:#475569;">$${parseFloat(o.rate||0).toFixed(2)}</td>
            <td style="text-align:right;"><span class="ot-amt-val">$${parseFloat(o.amount||0).toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2})}</span></td>
            <td><span class="ot-status-badge ${o.status}"><span class="sbdot"></span>${otStatusLabel(o.status)}</span></td>
            <td>
              <div class="ot-act-wrap">
                <button class="ot-act-btn edit" onclick="editOT('${o.id}')" title="កែប្រែ"><i class="fas fa-pen"></i></button>
                <button class="ot-act-btn del"  onclick="deleteOT('${o.id}')" title="លុប"><i class="fas fa-trash"></i></button>
              </div>
            </td>
          </tr>`;
        }).join('')}
      </tbody>
    </table>
    <div class="ot-table-footer">
      <span>បង្ហាញ <strong>${records.length}</strong> / <strong>${allOT.length}</strong> កំណត់ត្រា</span>
      <span>ប្រាក់ OT: <strong style="color:#059669;">$${filteredAmt.toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2})}</strong></span>
    </div>
  </div>`;
}

function clearOTFilters() {
  ['ot-emp-filter','ot-month-filter','ot-type-filter','ot-status-filter'].forEach(id=>{
    const el=document.getElementById(id); if(el) el.value='';
  });
  renderOT();
}

// ── OT type toggle ──
function pickOTType(val) {
  document.getElementById('ot-type').value = val;
  ['weekday','weekend','holiday'].forEach(k=>{
    const b=document.getElementById('otb-'+k);
    if(b) b.className='ot-type-opt'+(k===val?' sel-'+k:'');
  });
  recalcOT();
}

// ── Recalculate OT live ──
function recalcOT() {
  const start = document.getElementById('ot-start')?.value;
  const end   = document.getElementById('ot-end')?.value;
  const rate  = document.getElementById('ot-rate')?.value;
  const type  = document.getElementById('ot-type')?.value || 'weekday';
  const hrs   = calcOTHours(start, end);
  const amt   = calcOTAmount(hrs, rate, type);
  const mult  = otTypeMultiplier(type);
  const hEl   = document.getElementById('ot-hours');
  const aEl   = document.getElementById('ot-amount');
  if (hEl) hEl.value = hrs;
  if (aEl) aEl.value = amt;
  // Sync preview pill
  const s=(id,v)=>{const el=document.getElementById(id);if(el)el.textContent=v;};
  s('ocb-hrs',  parseFloat(hrs||0).toFixed(1));
  s('ocb-rate', '$'+parseFloat(rate||0).toFixed(2));
  s('ocb-mult', '×'+mult);
  s('ocb-total','$'+parseFloat(amt||0).toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2}));
}

// ── Bind live recalc ──
document.addEventListener('DOMContentLoaded', () => {
  ['ot-start','ot-end','ot-rate'].forEach(id => {
    const el = document.getElementById(id);
    if (el) { el.addEventListener('change', recalcOT); el.addEventListener('input', recalcOT); }
  });
  populateOTRptDropdowns();
});

// ── Modal open ──
function openOTModal(id=null) {
  editingOTId = id;
  const emps = DB.getEmployees();
  document.getElementById('ot-emp').innerHTML =
    '<option value="">-- ជ្រើសរើស --</option>' +
    emps.map(e=>`<option value="${e.id}">${e.name}</option>`).join('');
  document.getElementById('ot-modal-title').textContent = id ? 'កែប្រែ OT' : 'បន្ថែម OT';
  if (id) {
    const o = DB.getOT().find(x=>x.id===id);
    if (!o) return;
    document.getElementById('ot-emp').value    = o.empId      || '';
    document.getElementById('ot-date').value   = o.date       || '';
    document.getElementById('ot-start').value  = o.startTime  || '18:00';
    document.getElementById('ot-end').value    = o.endTime    || '21:00';
    document.getElementById('ot-hours').value  = o.hours      || '';
    document.getElementById('ot-rate').value   = o.rate       || '';
    document.getElementById('ot-amount').value = o.amount     || '';
    document.getElementById('ot-status').value = o.status     || 'pending';
    document.getElementById('ot-reason').value = o.reason     || '';
    pickOTType(o.type || 'weekday');
  } else {
    document.getElementById('ot-emp').value    = '';
    document.getElementById('ot-date').value   = new Date().toISOString().split('T')[0];
    document.getElementById('ot-start').value  = '18:00';
    document.getElementById('ot-end').value    = '21:00';
    document.getElementById('ot-hours').value  = '';
    document.getElementById('ot-rate').value   = '';
    document.getElementById('ot-amount').value = '';
    document.getElementById('ot-status').value = 'pending';
    document.getElementById('ot-reason').value = '';
    pickOTType('weekday');
  }
  recalcOT();
  document.getElementById('ot-modal').classList.add('active');
}

// ── Save ──
function saveOT() {
  const empId  = document.getElementById('ot-emp').value;
  const date   = document.getElementById('ot-date').value;
  const start  = document.getElementById('ot-start').value;
  const end    = document.getElementById('ot-end').value;
  const type   = document.getElementById('ot-type').value;
  const rate   = parseFloat(document.getElementById('ot-rate').value||0);
  const status = document.getElementById('ot-status').value;
  const reason = document.getElementById('ot-reason').value;
  if (!empId || !date || !start || !end) { showToast('⚠️ សូមបំពេញព័ត៌មានចាំបាច់!','error'); return; }
  const hours  = calcOTHours(start, end);
  const amount = calcOTAmount(hours, rate, type);
  const rec = { empId, date, startTime:start, endTime:end, hours, type, rate, amount, status, reason };
  if (editingOTId) {
    DB.updateOT(editingOTId, rec);
    showToast('✅ OT បានកែប្រែ!','success');
  } else {
    DB.addOT(rec);
    showToast('✅ OT បានបន្ថែម!','success');
  }
  closeModal('ot-modal');
  renderOT();
}

function editOT(id)   { openOTModal(id); }
function deleteOT(id) {
  if (!confirm('តើអ្នកចង់លុប OT នេះមែនទេ?')) return;
  DB.deleteOT(id);
  showToast('🗑️ OT បានលុប!','success');
  renderOT();
}

// ===== OT PAGE EXPORTS =====
function exportOTExcel() {
  if (typeof XLSX === 'undefined') { showToast('Library មិនទាន់ Load!','error'); return; }
  const empF   = document.getElementById('ot-emp-filter')?.value    || '';
  const monthF = document.getElementById('ot-month-filter')?.value  || '';
  const typeF  = document.getElementById('ot-type-filter')?.value   || '';
  const statF  = document.getElementById('ot-status-filter')?.value || '';
  let records  = DB.getOT();
  if (empF)   records = records.filter(o=>o.empId===empF);
  if (monthF) records = records.filter(o=>(o.date||'').startsWith(monthF));
  if (typeF)  records = records.filter(o=>o.type===typeF);
  if (statF)  records = records.filter(o=>o.status===statF);
  records = records.sort((a,b)=>new Date(b.date)-new Date(a.date));
  const emps = DB.getEmployees();
  const wb   = XLSX.utils.book_new();
  const data = records.map((o,i)=>{
    const emp = emps.find(e=>e.id===o.empId);
    return {
      '#': i+1,
      'ឈ្មោះ': emp?.name||o.empId,
      'នាយកដ្ឋាន': emp?.department||'',
      'ថ្ងៃខែ': o.date||'',
      'ម៉ោងចូល': o.startTime||'',
      'ម៉ោងចេញ': o.endTime||'',
      'ម៉ OT': parseFloat(o.hours||0),
      'ប្រភេទ': otTypeLabel(o.type),
      'x': otTypeMultiplier(o.type),
      'អត្រា/ម៉ ($)': parseFloat(o.rate||0),
      'ប្រាក់ OT ($)': parseFloat(o.amount||0),
      'ស្ថានភាព': otStatusLabel(o.status),
      'មូលហេតុ': o.reason||''
    };
  });
  const ws = XLSX.utils.json_to_sheet(data.length?data:[{'ចំណាំ':'គ្មានទិន្នន័យ'}]);
  ws['!cols'] = [{wch:4},{wch:24},{wch:18},{wch:12},{wch:10},{wch:10},{wch:8},{wch:16},{wch:6},{wch:12},{wch:14},{wch:12},{wch:20}];
  XLSX.utils.book_append_sheet(wb, ws, 'OT');
  XLSX.writeFile(wb, `hrpro_ot_${new Date().toISOString().slice(0,10)}.xlsx`);
  showToast('✅ Excel OT បានទាញ!','success');
}

function exportOTPDF() {
  if (!window.jspdf) { showToast('Library មិនទាន់ Load!','error'); return; }
  const {jsPDF} = window.jspdf;
  const empF   = document.getElementById('ot-emp-filter')?.value    || '';
  const monthF = document.getElementById('ot-month-filter')?.value  || '';
  const typeF  = document.getElementById('ot-type-filter')?.value   || '';
  const statF  = document.getElementById('ot-status-filter')?.value || '';
  let records  = DB.getOT();
  if (empF)   records = records.filter(o=>o.empId===empF);
  if (monthF) records = records.filter(o=>(o.date||'').startsWith(monthF));
  if (typeF)  records = records.filter(o=>o.type===typeF);
  if (statF)  records = records.filter(o=>o.status===statF);
  records = records.sort((a,b)=>new Date(b.date)-new Date(a.date));
  const emps  = DB.getEmployees();
  const today = new Date().toLocaleDateString('en-GB');
  const doc   = new jsPDF({orientation:'landscape',unit:'mm',format:'a4'});
  const pw    = doc.internal.pageSize.getWidth();
  const ph    = doc.internal.pageSize.getHeight();
  // Header
  doc.setFillColor(245,158,11); doc.rect(0,0,pw,16,'F');
  doc.setFillColor(251,191,36); doc.rect(0,16,pw,8,'F');
  doc.setTextColor(255,255,255);
  doc.setFontSize(13); doc.setFont('helvetica','bold');
  doc.text('HR Pro — Overtime (OT) Report ⏱️', pw/2, 10, {align:'center'});
  doc.setFontSize(8); doc.setFont('helvetica','normal');
  doc.setTextColor(92,50,5);
  doc.text(`Records: ${records.length}  |  Printed: ${today}`, pw/2, 22, {align:'center'});
  doc.setTextColor(26,31,54);
  const totHrs = records.reduce((s,o)=>s+parseFloat(o.hours||0),0);
  const totAmt = records.reduce((s,o)=>s+parseFloat(o.amount||0),0);
  doc.autoTable({
    head:[['#','Employee','Dept','Date','In → Out','Hrs','Type','Rate/Hr','OT Pay','Status']],
    body: records.map((o,i)=>{
      const emp = emps.find(e=>e.id===o.empId);
      return [i+1, emp?.name||o.empId, emp?.department||'', o.date||'',
              (o.startTime||'—')+' → '+(o.endTime||'—'),
              parseFloat(o.hours||0).toFixed(1),
              otTypeLabel(o.type)+' x'+otTypeMultiplier(o.type),
              '$'+parseFloat(o.rate||0).toFixed(2),
              '$'+parseFloat(o.amount||0).toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2}),
              otStatusLabel(o.status)];
    }),
    foot:[['','Total','','','',totHrs.toFixed(1)+'h','','','$'+totAmt.toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2}),'']],
    startY:30, margin:{left:10,right:10},
    headStyles:{fillColor:[161,98,7],textColor:255,fontSize:7.5,fontStyle:'bold',halign:'center'},
    footStyles:{fillColor:[161,98,7],textColor:255,fontSize:8,fontStyle:'bold'},
    bodyStyles:{fontSize:7.5},
    columnStyles:{0:{halign:'center',cellWidth:8},2:{cellWidth:24},3:{halign:'center',cellWidth:20},
                  4:{halign:'center',cellWidth:26},5:{halign:'center',cellWidth:10},
                  7:{halign:'right'},8:{halign:'right',fontStyle:'bold'},9:{halign:'center',cellWidth:18}},
    alternateRowStyles:{fillColor:[255,251,235]},
    didParseCell(d){
      if(d.section==='body'&&d.column.index===9){
        const v=d.cell.raw;
        d.cell.styles.textColor=v==='អនុម័ត'?[5,150,105]:v==='រង់ចាំ'?[217,119,6]:[220,38,38];
        d.cell.styles.fontStyle='bold';
      }
    },
    didDrawPage(){
      doc.setFillColor(255,251,235); doc.rect(0,ph-8,pw,8,'F');
      doc.setFontSize(7); doc.setTextColor(161,98,7);
      doc.text('HR Pro — OT Report  |  Confidential  |  '+today, pw/2, ph-2, {align:'center'});
    }
  });
  doc.save(`hrpro_ot_${new Date().toISOString().slice(0,10)}.pdf`);
  showToast('✅ PDF OT បានទាញ!','success');
}

// ===== OT REPORT PAGE =====
function populateOTRptDropdowns() {
  const depts = DB.getDepartments();
  const ots   = DB.getOT();
  const months = [...new Set(ots.map(o=>(o.date||'').slice(0,7)).filter(Boolean))].sort().reverse();
  const mSel  = document.getElementById('ot-rpt-month');
  const dSel  = document.getElementById('ot-rpt-dept');
  if (mSel) mSel.innerHTML = '<option value="">ខែទាំងអស់</option>' +
    months.map(m=>`<option value="${m}">${m}</option>`).join('');
  if (dSel) dSel.innerHTML = '<option value="">នាយកដ្ឋានទាំងអស់</option>' +
    depts.map(d=>`<option value="${d.name}">${d.name}</option>`).join('');
}

function renderOTReport() {
  populateOTRptDropdowns();
  const monthF = document.getElementById('ot-rpt-month')?.value || '';
  const deptF  = document.getElementById('ot-rpt-dept')?.value  || '';
  const emps   = DB.getEmployees();
  let records  = DB.getOT();
  if (monthF) records = records.filter(o=>(o.date||'').startsWith(monthF));
  if (deptF)  records = records.filter(o=>{
    const emp = emps.find(e=>e.id===o.empId);
    return emp?.department === deptF;
  });

  // ---- KPI ----
  const totHrs  = records.reduce((s,o)=>s+parseFloat(o.hours||0),0);
  const totAmt  = records.reduce((s,o)=>s+parseFloat(o.amount||0),0);
  const apprAmt = records.filter(o=>o.status==='approved').reduce((s,o)=>s+parseFloat(o.amount||0),0);
  const pendCnt = records.filter(o=>o.status==='pending').length;
  const kpiEl   = document.getElementById('ot-rpt-kpi');
  if (kpiEl) kpiEl.innerHTML = [
    {icon:'fas fa-list',        lbl:'OT សរុប',         val:records.length,                       color:'#3B5BDB'},
    {icon:'fas fa-clock',       lbl:'ម៉ OT សរុប',       val:totHrs.toFixed(1)+' ម៉',               color:'#F59E0B'},
    {icon:'fas fa-check-circle',lbl:'ប្រាក់អនុម័ត',      val:'$'+apprAmt.toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2}), color:'#059669'},
    {icon:'fas fa-hourglass',   lbl:'រង់ចាំ',            val:pendCnt+' ករណី',                      color:'#D97706'},
    {icon:'fas fa-wallet',      lbl:'ប្រាក់ OT សរុប',   val:'$'+totAmt.toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2}), color:'#7C3AED'},
  ].map(k=>`
    <div style="background:var(--surface);border-radius:var(--radius-lg);padding:18px 20px;border:1.5px solid var(--border);box-shadow:var(--shadow);position:relative;overflow:hidden;">
      <div style="position:absolute;top:0;left:0;right:0;height:3px;background:${k.color};border-radius:var(--radius-lg) var(--radius-lg) 0 0;"></div>
      <div style="width:38px;height:38px;border-radius:10px;background:${k.color};display:flex;align-items:center;justify-content:center;font-size:15px;color:#fff;margin-bottom:10px;">
        <i class="${k.icon}"></i></div>
      <div style="font-size:24px;font-weight:800;line-height:1;">${k.val}</div>
      <div style="font-size:12px;color:var(--text-muted);margin-top:3px;">${k.lbl}</div>
    </div>`).join('');

  // ---- Type bars ----
  const typeEl = document.getElementById('ot-rpt-type-bars');
  if (typeEl) {
    const types = ['weekday','weekend','holiday'];
    const max   = Math.max(...types.map(t=>records.filter(o=>o.type===t).length),1);
    typeEl.innerHTML = types.map(t=>{
      const cnt  = records.filter(o=>o.type===t).length;
      const hrs  = records.filter(o=>o.type===t).reduce((s,o)=>s+parseFloat(o.hours||0),0);
      const pct  = Math.round(cnt/max*100);
      const cols = {weekday:'#3B5BDB',weekend:'#F59E0B',holiday:'#7C3AED'};
      return `<div>
        <div style="display:flex;justify-content:space-between;font-size:13px;margin-bottom:5px;">
          <span style="font-weight:600;">${otTypeLabel(t)}</span>
          <span style="color:var(--text-muted);">${cnt} ករណី | ${hrs.toFixed(1)}ម៉</span>
        </div>
        <div style="background:var(--border);border-radius:4px;height:10px;overflow:hidden;">
          <div style="background:${cols[t]};width:${pct}%;height:100%;border-radius:4px;transition:width .6s ease;"></div>
        </div>
      </div>`;
    }).join('');
  }

  // ---- Donut ----
  const approved  = records.filter(o=>o.status==='approved').length;
  const pending2  = records.filter(o=>o.status==='pending').length;
  const rejected  = records.filter(o=>o.status==='rejected').length;
  const donutEl   = document.getElementById('ot-rpt-donut');
  const legendEl  = document.getElementById('ot-rpt-donut-legend');
  if (donutEl) {
    const ctx   = donutEl.getContext('2d');
    const total = approved+pending2+rejected||1;
    const segs  = [
      {val:approved, color:'#059669', lbl:'អនុម័ត'},
      {val:pending2, color:'#F59E0B', lbl:'រង់ចាំ'},
      {val:rejected, color:'#EF4444', lbl:'បដិសេធ'},
    ];
    ctx.clearRect(0,0,140,140);
    let startAngle = -Math.PI/2;
    const cx=70,cy=70,r=55,inner=35;
    segs.forEach(s=>{
      const sweep = (s.val/total)*2*Math.PI;
      ctx.beginPath(); ctx.moveTo(cx,cy);
      ctx.arc(cx,cy,r,startAngle,startAngle+sweep);
      ctx.closePath(); ctx.fillStyle=s.color; ctx.fill();
      startAngle += sweep;
    });
    ctx.beginPath(); ctx.arc(cx,cy,inner,0,2*Math.PI); ctx.fillStyle='var(--surface)'; ctx.fill();
    ctx.fillStyle='var(--text)'; ctx.font='bold 14px sans-serif'; ctx.textAlign='center'; ctx.textBaseline='middle';
    ctx.fillText(total, cx, cy-7);
    ctx.font='10px sans-serif'; ctx.fillStyle='var(--text-muted)';
    ctx.fillText('សរុប', cx, cy+10);
    if (legendEl) legendEl.innerHTML = segs.map(s=>`
      <div style="display:flex;align-items:center;gap:8px;">
        <div style="width:12px;height:12px;border-radius:3px;background:${s.color};flex-shrink:0;"></div>
        <span style="font-size:13px;flex:1;">${s.lbl}</span>
        <strong style="font-size:13px;">${s.val}</strong>
      </div>`).join('');
  }

  // ---- Per-employee table ----
  const empTableEl = document.getElementById('ot-rpt-emp-table');
  if (empTableEl) {
    const empRows = emps.filter(e=>records.find(o=>o.empId===e.id)).map(e=>{
      const er     = records.filter(o=>o.empId===e.id);
      const hrs    = er.reduce((s,o)=>s+parseFloat(o.hours||0),0);
      const amt    = er.reduce((s,o)=>s+parseFloat(o.amount||0),0);
      const appr   = er.filter(o=>o.status==='approved').length;
      const pend   = er.filter(o=>o.status==='pending').length;
      return {name:e.name, dept:e.department, cnt:er.length, hrs, amt, appr, pend};
    }).sort((a,b)=>b.hrs-a.hrs);
    if (!empRows.length) {
      empTableEl.innerHTML = '<p style="color:var(--text-muted);font-size:13px;">មិនមានទិន្នន័យ</p>';
    } else {
      empTableEl.innerHTML = `<table class="data-table" style="font-size:13px;">
        <thead><tr>
          <th>ឈ្មោះ</th><th>នាយកដ្ឋាន</th><th style="text-align:center;">ចំនួន</th>
          <th style="text-align:right;">ម៉ OT</th><th style="text-align:center;">អនុម័ត</th>
          <th style="text-align:center;">រង់ចាំ</th><th style="text-align:right;">ប្រាក់ OT</th>
        </tr></thead>
        <tbody>
          ${empRows.map(r=>`<tr>
            <td style="font-weight:600;">${r.name}</td>
            <td>${r.dept}</td>
            <td style="text-align:center;">${r.cnt}</td>
            <td style="text-align:right;font-weight:700;color:#F59E0B;">${r.hrs.toFixed(1)}</td>
            <td style="text-align:center;color:#059669;font-weight:600;">${r.appr}</td>
            <td style="text-align:center;color:#D97706;font-weight:600;">${r.pend}</td>
            <td style="text-align:right;font-weight:700;color:var(--success);">$${r.amt.toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2})}</td>
          </tr>`).join('')}
        </tbody>
      </table>`;
    }
  }

  // ---- Detail table ----
  const detailEl = document.getElementById('ot-rpt-detail-table');
  if (detailEl) {
    const sorted = [...records].sort((a,b)=>new Date(b.date)-new Date(a.date));
    if (!sorted.length) {
      detailEl.innerHTML = '<p style="color:var(--text-muted);font-size:13px;">មិនមានទិន្នន័យ</p>';
    } else {
      detailEl.innerHTML = `<table class="data-table" style="font-size:13px;">
        <thead><tr>
          <th>#</th><th>ឈ្មោះ</th><th>នាយកដ្ឋាន</th><th>ថ្ងៃខែ</th>
          <th>ម៉ OT</th><th>ប្រភេទ</th><th style="text-align:right;">ប្រាក់ OT</th><th>ស្ថានភាព</th>
        </tr></thead>
        <tbody>
          ${sorted.map((o,i)=>{
            const emp = emps.find(e=>e.id===o.empId);
            return `<tr>
              <td style="color:var(--text-muted);">${i+1}</td>
              <td style="font-weight:600;">${emp?.name||o.empId}</td>
              <td>${emp?.department||'—'}</td>
              <td>${o.date||'—'}</td>
              <td style="font-weight:700;color:#F59E0B;">${parseFloat(o.hours||0).toFixed(1)}</td>
              <td><span class="ot-type-badge ${o.type}">${otTypeLabel(o.type)}</span></td>
              <td style="text-align:right;font-weight:700;color:var(--success);">$${parseFloat(o.amount||0).toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2})}</td>
              <td><span class="ot-status-badge ${o.status}">${otStatusLabel(o.status)}</span></td>
            </tr>`;
          }).join('')}
        </tbody>
      </table>`;
    }
  }
}

// ===== OT REPORT EXPORTS =====
function exportOTReportExcel() {
  if (typeof XLSX === 'undefined') { showToast('Library មិនទាន់ Load!','error'); return; }
  const monthF = document.getElementById('ot-rpt-month')?.value || '';
  const deptF  = document.getElementById('ot-rpt-dept')?.value  || '';
  const emps   = DB.getEmployees();
  let records  = DB.getOT();
  if (monthF) records = records.filter(o=>(o.date||'').startsWith(monthF));
  if (deptF)  records = records.filter(o=>emps.find(e=>e.id===o.empId)?.department===deptF);
  records = records.sort((a,b)=>new Date(b.date)-new Date(a.date));
  const wb   = XLSX.utils.book_new();

  // Sheet 1: Detail
  const data1 = records.map((o,i)=>{
    const emp = emps.find(e=>e.id===o.empId);
    return {'#':i+1,'ឈ្មោះ':emp?.name||'','នាយកដ្ឋាន':emp?.department||'',
            'ថ្ងៃខែ':o.date||'','ម៉ OT':parseFloat(o.hours||0),'ប្រភេទ':otTypeLabel(o.type),
            'x':otTypeMultiplier(o.type),'អត្រា ($)':parseFloat(o.rate||0),'ប្រាក់ OT ($)':parseFloat(o.amount||0),
            'ស្ថានភាព':otStatusLabel(o.status),'មូលហេតុ':o.reason||''};
  });
  const ws1 = XLSX.utils.json_to_sheet(data1.length?data1:[{'ចំណាំ':'គ្មាន'}]);
  XLSX.utils.book_append_sheet(wb, ws1, 'OT Detail');

  // Sheet 2: Summary per employee
  const empSum = emps.filter(e=>records.find(o=>o.empId===e.id)).map(e=>{
    const er = records.filter(o=>o.empId===e.id);
    return {'ឈ្មោះ':e.name,'នាយកដ្ឋាន':e.department,'ចំនួន':er.length,
            'ម៉ OT':er.reduce((s,o)=>s+parseFloat(o.hours||0),0).toFixed(1),
            'ប្រាក់ OT ($)':er.reduce((s,o)=>s+parseFloat(o.amount||0),0).toFixed(2),
            'អនុម័ត':er.filter(o=>o.status==='approved').length,
            'រង់ចាំ':er.filter(o=>o.status==='pending').length,
            'បដិសេធ':er.filter(o=>o.status==='rejected').length};
  });
  const ws2 = XLSX.utils.json_to_sheet(empSum.length?empSum:[{'ចំណាំ':'គ្មាន'}]);
  XLSX.utils.book_append_sheet(wb, ws2, 'Summary');
  XLSX.writeFile(wb, `hrpro_ot_report_${new Date().toISOString().slice(0,10)}.xlsx`);
  showToast('✅ Excel របាយការណ៍ OT បានទាញ!','success');
}

function exportOTReportPDF() {
  if (!window.jspdf) { showToast('Library មិនទាន់ Load!','error'); return; }
  const {jsPDF} = window.jspdf;
  const monthF = document.getElementById('ot-rpt-month')?.value || '';
  const deptF  = document.getElementById('ot-rpt-dept')?.value  || '';
  const emps   = DB.getEmployees();
  let records  = DB.getOT();
  if (monthF) records = records.filter(o=>(o.date||'').startsWith(monthF));
  if (deptF)  records = records.filter(o=>emps.find(e=>e.id===o.empId)?.department===deptF);
  records = records.sort((a,b)=>new Date(b.date)-new Date(a.date));
  const today  = new Date().toLocaleDateString('en-GB');
  const totHrs = records.reduce((s,o)=>s+parseFloat(o.hours||0),0);
  const totAmt = records.reduce((s,o)=>s+parseFloat(o.amount||0),0);
  const doc    = new jsPDF({orientation:'landscape',unit:'mm',format:'a4'});
  const pw     = doc.internal.pageSize.getWidth();
  const ph     = doc.internal.pageSize.getHeight();

  const hdr = (title, sub) => {
    doc.setFillColor(120,53,15);  doc.rect(0,0,pw,16,'F');
    doc.setFillColor(161,98,7);   doc.rect(0,16,pw,10,'F');
    doc.setTextColor(255,255,255);
    doc.setFontSize(14); doc.setFont('helvetica','bold');
    doc.text(title, pw/2, 10, {align:'center'});
    doc.setFontSize(8); doc.setFont('helvetica','normal');
    doc.setTextColor(254,243,199);
    doc.text(sub||`Records: ${records.length}  |  Printed: ${today}`, pw/2, 23, {align:'center'});
  };
  const ftr = () => {
    doc.setFillColor(255,251,235); doc.rect(0,ph-8,pw,8,'F');
    doc.setFontSize(7); doc.setTextColor(161,98,7);
    doc.text('HR Pro — OT Report  |  Confidential  |  '+today, pw/2, ph-2, {align:'center'});
  };

  // Page 1 header + KPI boxes
  hdr('HR Pro — Overtime (OT) Report ⏱️');
  const approved2 = records.filter(o=>o.status==='approved').length;
  const pending3  = records.filter(o=>o.status==='pending').length;
  const kW = (pw-20)/4 - 2;
  [
    {l:'Total OT Records',  v:records.length,                  c:[59,91,219]},
    {l:'Total OT Hours',    v:totHrs.toFixed(1)+' hrs',        c:[245,158,11]},
    {l:'Total OT Pay',      v:'$'+totAmt.toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2}), c:[124,58,237]},
    {l:'Approved / Pending',v:`${approved2} / ${pending3}`,   c:[5,150,105]},
  ].forEach((k,i)=>{
    const x = 10+i*(kW+3);
    doc.setFillColor(...k.c); doc.roundedRect(x,29,kW,18,2,2,'F');
    doc.setTextColor(255,255,255);
    doc.setFontSize(12); doc.setFont('helvetica','bold');
    doc.text(String(k.v), x+kW/2, 41, {align:'center'});
    doc.setFontSize(7); doc.setFont('helvetica','normal');
    doc.text(k.l, x+kW/2, 46, {align:'center'});
  });

  doc.autoTable({
    head:[['#','Employee','Dept','Date','In → Out','Hrs','Type','x','Rate/Hr','OT Pay','Status']],
    body: records.map((o,i)=>{
      const emp = emps.find(e=>e.id===o.empId);
      return [i+1, emp?.name||o.empId, emp?.department||'', o.date||'',
              (o.startTime||'—')+' → '+(o.endTime||'—'),
              parseFloat(o.hours||0).toFixed(1),
              otTypeLabel(o.type), 'x'+otTypeMultiplier(o.type),
              '$'+parseFloat(o.rate||0).toFixed(2),
              '$'+parseFloat(o.amount||0).toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2}),
              otStatusLabel(o.status)];
    }),
    foot:[['','Total','','','',totHrs.toFixed(1),'','','','$'+totAmt.toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2}),'']],
    startY:52, margin:{left:10,right:10},
    headStyles:{fillColor:[120,53,15],textColor:255,fontSize:7,fontStyle:'bold',halign:'center'},
    footStyles:{fillColor:[120,53,15],textColor:255,fontSize:8,fontStyle:'bold'},
    bodyStyles:{fontSize:7},
    columnStyles:{0:{halign:'center',cellWidth:8},2:{cellWidth:22},3:{halign:'center',cellWidth:18},
                  4:{halign:'center',cellWidth:24},5:{halign:'center',cellWidth:10},
                  7:{halign:'center',cellWidth:10},8:{halign:'right'},
                  9:{halign:'right',fontStyle:'bold'},10:{halign:'center',cellWidth:16}},
    alternateRowStyles:{fillColor:[255,251,235]},
    didParseCell(d){
      if(d.section==='body'&&d.column.index===10){
        const v=d.cell.raw;
        d.cell.styles.textColor=v==='អនុម័ត'?[5,150,105]:v==='រង់ចាំ'?[217,119,6]:[220,38,38];
        d.cell.styles.fontStyle='bold';
      }
    },
    didDrawPage: ftr
  });

  // Page 2: Summary per employee
  doc.addPage();
  hdr('OT Summary per Employee','');
  doc.autoTable({
    head:[['Employee','Department','Records','OT Hours','Approved','Pending','Rejected','Total Pay']],
    body: emps.filter(e=>records.find(o=>o.empId===e.id)).map(e=>{
      const er = records.filter(o=>o.empId===e.id);
      const hrs = er.reduce((s,o)=>s+parseFloat(o.hours||0),0);
      const amt = er.reduce((s,o)=>s+parseFloat(o.amount||0),0);
      return [e.name, e.department, er.length, hrs.toFixed(1)+' hrs',
              er.filter(o=>o.status==='approved').length,
              er.filter(o=>o.status==='pending').length,
              er.filter(o=>o.status==='rejected').length,
              '$'+amt.toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2})];
    }),
    startY:32, margin:{left:10,right:10},
    headStyles:{fillColor:[120,53,15],textColor:255,fontSize:9,fontStyle:'bold',halign:'center'},
    bodyStyles:{fontSize:9},
    columnStyles:{2:{halign:'center'},3:{halign:'center'},4:{halign:'center'},
                  5:{halign:'center'},6:{halign:'center'},7:{halign:'right',fontStyle:'bold'}},
    alternateRowStyles:{fillColor:[255,251,235]},
    didDrawPage: ftr
  });

  doc.save(`hrpro_ot_report_${new Date().toISOString().slice(0,10)}.pdf`);
  showToast('✅ PDF របាយការណ៍ OT 2 Pages បានទាញ!','success');
}

// ===================================================================
//  ALLOWANCE — Full JS
// ===================================================================
let editingAlwId = null;

const ALW_TYPES = {
  transport:{ label:'ដឹកជញ្ជូន', icon:'fa-bus' },
  food:     { label:'អាហារ',      icon:'fa-utensils' },
  housing:  { label:'លំនៅដ្ឋាន',  icon:'fa-house' },
  health:   { label:'សុខភាព',     icon:'fa-heart-pulse' },
  phone:    { label:'ទូរស័ព្ទ',   icon:'fa-mobile-alt' },
  other:    { label:'ផ្សេងៗ',     icon:'fa-box-open' },
};
const ALW_FREQ = { monthly:'ប្រចាំខែ', onetime:'លើកតែម្ដង', quarterly:'ប្រចាំត្រីមាស', yearly:'ប្រចាំឆ្នាំ' };

function populateAlwFilters() {
  const sel = document.getElementById('alw-emp-filter');
  if (!sel || sel.options.length > 1) return;
  DB.getEmployees().forEach(e => {
    const o = document.createElement('option');
    o.value = e.id; o.textContent = e.name; sel.appendChild(o);
  });
}

function clearAllowanceFilters() {
  ['alw-emp-filter','alw-type-filter','alw-month-filter','alw-status-filter']
    .forEach(id => { const el=document.getElementById(id); if(el) el.value=''; });
  renderAllowance();
}

function renderAllowance() {
  const empF  = document.getElementById('alw-emp-filter')?.value    || '';
  const typeF = document.getElementById('alw-type-filter')?.value   || '';
  const monF  = document.getElementById('alw-month-filter')?.value  || '';
  const statF = document.getElementById('alw-status-filter')?.value || '';
  const emps  = DB.getEmployees();
  let recs    = DB.getAllowance();
  if (empF)  recs = recs.filter(a => a.empId  === empF);
  if (typeF) recs = recs.filter(a => a.type   === typeF);
  if (monF)  recs = recs.filter(a => (a.month||'').startsWith(monF));
  if (statF) recs = recs.filter(a => a.status === statF);
  recs = recs.sort((a,b) => (b.month||'').localeCompare(a.month||''));

  // KPI
  const all       = DB.getAllowance();
  const totalAmt  = all.reduce((s,a) => s+parseFloat(a.amount||0), 0);
  const activeN   = all.filter(a => a.status==='active').length;
  const pendingN  = all.filter(a => a.status==='pending').length;
  const strip = document.getElementById('alw-kpi-strip');
  if (strip) strip.innerHTML = [
    {icon:'fas fa-list-check',     lbl:'កំណត់ត្រា',  val:all.length,  color:'#3B5BDB'},
    {icon:'fas fa-circle-check',   lbl:'សកម្ម',       val:activeN,     color:'#059669'},
    {icon:'fas fa-hourglass-half', lbl:'រង់ចាំ',       val:pendingN,    color:'#D97706'},
    {icon:'fas fa-dollar-sign',    lbl:'ប្រាក់សរុប',  val:'$'+totalAmt.toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2}), color:'#7C3AED'},
  ].map(k=>`
    <div class="alw-kpi" style="--alw-c:${k.color}">
      <div class="alw-kpi-icon"><i class="${k.icon}"></i></div>
      <div><div class="alw-kpi-val">${k.val}</div><div class="alw-kpi-lbl">${k.lbl}</div></div>
    </div>`).join('');

  const con = document.getElementById('alw-container');
  if (!con) return;
  if (!recs.length) {
    con.innerHTML = `<div class="alw-empty">
      <div class="alw-empty-ico"><i class="fas fa-hand-holding-dollar"></i></div>
      <div class="alw-empty-title">មិនមានកំណត់ត្រាប្រាក់ឧបត្ថម្ភ</div>
      <div class="alw-empty-sub">ចុច "បន្ថែម" ដើម្បីបន្ថែមកំណត់ត្រាថ្មី</div>
    </div>`; return;
  }
  const filtAmt = recs.reduce((s,a)=>s+parseFloat(a.amount||0),0);
  con.innerHTML = `
  <div class="alw-table-wrap">
    <table class="alw-table">
      <thead><tr>
        <th>#</th><th>បុគ្គលិក</th><th>ខែ</th><th>ប្រភេទ</th>
        <th style="text-align:right;">ចំនួន</th><th>ញឹកញាប់</th>
        <th>ស្ថានភាព</th><th>ចំណាំ</th><th style="width:76px;"></th>
      </tr></thead>
      <tbody>${recs.map((a,i)=>{
        const emp = emps.find(e=>e.id===a.empId);
        const init=(emp?.name||'?')[0].toUpperCase();
        const t = ALW_TYPES[a.type]||ALW_TYPES.other;
        const stLbl = a.status==='active'?'សកម្ម':a.status==='pending'?'រង់ចាំ':'អសកម្ម';
        return `<tr>
          <td style="color:#94a3b8;font-size:.72rem;font-weight:700;">${String(i+1).padStart(2,'0')}</td>
          <td><div class="alw-emp-cell">
            <div class="alw-emp-av">${emp?.photo?`<img src="${emp.photo}">`:''}${!emp?.photo?init:''}</div>
            <div><div class="alw-emp-name">${emp?.name||a.empId}</div>
            <div class="alw-emp-sub">${emp?.position||''} · ${emp?.department||''}</div></div>
          </div></td>
          <td style="font-size:.82rem;font-weight:600;color:var(--text);">${a.month||'—'}</td>
          <td><span class="alw-type-badge alw-type-${a.type}"><i class="fas ${t.icon}"></i> ${t.label}</span></td>
          <td style="text-align:right;"><span class="alw-amt-val">$${parseFloat(a.amount||0).toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2})}</span></td>
          <td><span class="alw-freq-badge">${ALW_FREQ[a.frequency]||'—'}</span></td>
          <td><span class="alw-status-badge ${a.status}"><span class="sd"></span>${stLbl}</span></td>
          <td style="font-size:.75rem;color:#64748b;max-width:120px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${a.note||'—'}</td>
          <td><div class="alw-act-wrap">
            <button class="alw-act-btn edit" onclick="editAllowance('${a.id}')"><i class="fas fa-pen"></i></button>
            <button class="alw-act-btn del"  onclick="deleteAllowance('${a.id}')"><i class="fas fa-trash"></i></button>
          </div></td>
        </tr>`;
      }).join('')}</tbody>
    </table>
    <div class="alw-tfoot">
      <span>បង្ហាញ <strong>${recs.length}</strong> / <strong>${all.length}</strong> កំណត់ត្រា</span>
      <span>ប្រាក់: <strong style="color:#059669;">$${filtAmt.toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2})}</strong></span>
    </div>
  </div>`;
}

function pickAlwType(val) {
  document.getElementById('alw-type').value = val;
  Object.keys(ALW_TYPES).forEach(k => {
    const b=document.getElementById('alwb-'+k);
    if(b) b.className='alw-type-opt'+(k===val?' sel-'+k:'');
  });
}

function openAllowanceModal(id=null) {
  editingAlwId = id;
  const emps = DB.getEmployees();
  document.getElementById('alw-emp').innerHTML =
    '<option value="">-- ជ្រើសរើស --</option>' +
    emps.map(e=>`<option value="${e.id}">${e.name}</option>`).join('');
  document.getElementById('alw-modal-title').textContent = id ? 'កែប្រែប្រាក់ឧបត្ថម្ភ' : 'បន្ថែមប្រាក់ឧបត្ថម្ភ';
  if (id) {
    const a = DB.getAllowance().find(x=>x.id===id); if(!a) return;
    document.getElementById('alw-emp').value       = a.empId     ||'';
    document.getElementById('alw-month').value     = a.month     ||'';
    document.getElementById('alw-amount').value    = a.amount    ||'';
    document.getElementById('alw-frequency').value = a.frequency ||'monthly';
    document.getElementById('alw-status').value    = a.status    ||'active';
    document.getElementById('alw-note').value      = a.note      ||'';
    pickAlwType(a.type||'transport');
  } else {
    document.getElementById('alw-emp').value       = '';
    document.getElementById('alw-month').value     = new Date().toISOString().slice(0,7);
    document.getElementById('alw-amount').value    = '';
    document.getElementById('alw-frequency').value = 'monthly';
    document.getElementById('alw-status').value    = 'active';
    document.getElementById('alw-note').value      = '';
    pickAlwType('transport');
  }
  document.getElementById('alw-modal').classList.add('active');
}

function saveAllowance() {
  const empId     = document.getElementById('alw-emp').value;
  const month     = document.getElementById('alw-month').value;
  const type      = document.getElementById('alw-type').value;
  const amount    = parseFloat(document.getElementById('alw-amount').value||0);
  const frequency = document.getElementById('alw-frequency').value;
  const status    = document.getElementById('alw-status').value;
  const note      = document.getElementById('alw-note').value;
  if (!empId||!month||!type||!amount) { showToast('⚠️ សូមបំពេញព័ត៌មានចាំបាច់!','error'); return; }
  const rec = { empId, month, type, amount, frequency, status, note };
  if (editingAlwId) {
    DB.updateAllowance(editingAlwId, rec);
    showToast('✅ ប្រាក់ឧបត្ថម្ភបានកែប្រែ!','success');
  } else {
    DB.addAllowance(rec);
    showToast('✅ ប្រាក់ឧបត្ថម្ភបានបន្ថែម!','success');
  }
  closeModal('alw-modal');
  renderAllowance();
}

function editAllowance(id)   { openAllowanceModal(id); }
function deleteAllowance(id) {
  if (!confirm('តើអ្នកចង់លុបប្រាក់ឧបត្ថម្ភនេះមែនទេ?')) return;
  DB.deleteAllowance(id);
  showToast('🗑️ ប្រាក់ឧបត្ថម្ភបានលុប!','success');
  renderAllowance();
}

function exportAllowanceExcel() {
  if (typeof XLSX==='undefined') { showToast('Library មិនទាន់ Load!','error'); return; }
  const emps=DB.getEmployees(), recs=DB.getAllowance();
  const rows=recs.map((a,i)=>{
    const emp=emps.find(e=>e.id===a.empId);
    const t=ALW_TYPES[a.type]||ALW_TYPES.other;
    return {'ល.រ':i+1,'ឈ្មោះ':emp?.name||a.empId,'នាយកដ្ឋាន':emp?.department||'—',
      'ខែ':a.month||'—','ប្រភេទ':t.label,'ចំនួន($)':parseFloat(a.amount||0).toFixed(2),
      'ញឹកញាប់':ALW_FREQ[a.frequency]||a.frequency,
      'ស្ថានភាព':a.status==='active'?'សកម្ម':a.status==='pending'?'រង់ចាំ':'អសកម្ម',
      'ចំណាំ':a.note||''};
  });
  const ws=XLSX.utils.json_to_sheet(rows), wb=XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb,ws,'Allowance');
  XLSX.writeFile(wb,`hrpro_allowance_${new Date().toISOString().slice(0,10)}.xlsx`);
  showToast('✅ Excel បានទាញ!','success');
}

function exportAllowancePDF() {
  if (typeof window.jspdf==='undefined') { showToast('Library មិនទាន់ Load!','error'); return; }
  const {jsPDF}=window.jspdf;
  const doc=new jsPDF({orientation:'landscape',unit:'mm',format:'a4'});
  const emps=DB.getEmployees(), recs=DB.getAllowance();
  doc.setFontSize(14); doc.setFont(undefined,'bold');
  doc.text('HR Pro — ប្រាក់ឧបត្ថម្ភ',14,16);
  doc.setFontSize(9); doc.setFont(undefined,'normal');
  doc.text(`Export: ${new Date().toLocaleDateString('km-KH')}`,14,22);
  if (typeof doc.autoTable==='function') {
    doc.autoTable({
      startY:28,
      head:[['#','ឈ្មោះ','ខែ','ប្រភេទ','ចំនួន($)','ស្ថានភាព','ចំណាំ']],
      body:recs.map((a,i)=>{
        const emp=emps.find(e=>e.id===a.empId);
        const t=ALW_TYPES[a.type]||ALW_TYPES.other;
        return [i+1,emp?.name||a.empId,a.month||'—',t.label,
          parseFloat(a.amount||0).toFixed(2),a.status,a.note||''];
      }),
      styles:{fontSize:8},
      headStyles:{fillColor:[5,150,105],textColor:255},
      alternateRowStyles:{fillColor:[240,253,244]},
    });
  }
  doc.save(`hrpro_allowance_${new Date().toISOString().slice(0,10)}.pdf`);
  showToast('✅ PDF បានទាញ!','success');
}

// ===================================================================

// ===================================================================
//  LOAN MODULE — Full Professional JS
// ===================================================================
const LOAN_TYPES = {
  personal:  { label:'ផ្ទាល់ខ្លួន',  icon:'fa-user',           cls:'ln-type-personal'  },
  emergency: { label:'បន្ទាន់',        icon:'fa-bolt',           cls:'ln-type-emergency' },
  medical:   { label:'ព្យាបាល',         icon:'fa-hospital',       cls:'ln-type-medical'   },
  education: { label:'អប់រំ',           icon:'fa-graduation-cap', cls:'ln-type-education' },
  vehicle:   { label:'យានជំនិះ',       icon:'fa-car',            cls:'ln-type-vehicle'   },
  other:     { label:'ផ្សេងៗ',          icon:'fa-box-open',       cls:'ln-type-other'     },
};

let editingLoanId = null;

function getInitialsLn(name) {
  if (!name) return '?';
  const p = name.trim().split(' ');
  return p.length >= 2 ? (p[0][0]+p[p.length-1][0]).toUpperCase() : name[0].toUpperCase();
}

function fmtMoney(v) {
  return '$' + Number(v||0).toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2});
}

/* ── Filters ── */
function populateLoanFilters() {
  const emps = DB.getEmployees();
  const sel  = document.getElementById('ln-emp-filter');
  if (!sel) return;
  const cur = sel.value;
  sel.innerHTML = '<option value="">បុគ្គលិកទាំងអស់</option>' +
    emps.map(e=>`<option value="${e.id}"${cur===e.id?' selected':''}>${e.name}</option>`).join('');
}

function clearLoanFilters() {
  ['ln-emp-filter','ln-type-filter','ln-status-filter','ln-month-filter']
    .forEach(id=>{ const el=document.getElementById(id); if(el) el.value=''; });
  renderLoan();
}

/* ── Main Render ── */
function renderLoan() {
  populateLoanFilters();
  const empF  = document.getElementById('ln-emp-filter')?.value   || '';
  const typeF = document.getElementById('ln-type-filter')?.value  || '';
  const statF = document.getElementById('ln-status-filter')?.value|| '';
  const monF  = document.getElementById('ln-month-filter')?.value || '';
  const emps  = DB.getEmployees();
  const depts = DB.getDepartments();
  let loans   = DB.getLoan();

  if (empF)  loans = loans.filter(l=>l.empId===empF);
  if (typeF) loans = loans.filter(l=>l.type===typeF);
  if (statF) loans = loans.filter(l=>l.status===statF);
  if (monF)  loans = loans.filter(l=>(l.startMonth||'').slice(0,7)===monF.slice(0,7));
  loans = loans.sort((a,b)=>new Date(b.createdAt||0)-new Date(a.createdAt||0));

  const all = DB.getLoan();
  const calcPaid = l => Math.min((l.paidMonths||[]).length * parseFloat(l.monthlyDeduct||0), parseFloat(l.amount||0));
  const totAmt   = all.reduce((s,l)=>s+parseFloat(l.amount||0), 0);
  const totPaid  = all.reduce((s,l)=>s+calcPaid(l), 0);
  const totRem   = Math.max(0, totAmt-totPaid);
  const totMo    = all.filter(l=>l.status==='active').reduce((s,l)=>s+parseFloat(l.monthlyDeduct||0),0);
  const actCnt   = all.filter(l=>l.status==='active').length;
  const doneCnt  = all.filter(l=>l.status==='completed').length;

  const kpiEl = document.getElementById('ln-kpi-strip');
  if (kpiEl) kpiEl.innerHTML = [
    {icon:'fas fa-hand-holding-usd', lbl:'ប្រាក់ខ្ចីសរុប',  val:fmtMoney(totAmt),  c:'#1d4ed8'},
    {icon:'fas fa-check-double',     lbl:'បានសងសរុប',        val:fmtMoney(totPaid), c:'#15803d'},
    {icon:'fas fa-hourglass-half',   lbl:'នៅសល់',             val:fmtMoney(totRem),  c:'#dc2626'},
    {icon:'fas fa-calendar-check',   lbl:'កាត់/ខែ (Active)',  val:fmtMoney(totMo),   c:'#7e22ce'},
    {icon:'fas fa-spinner',          lbl:'កំពុងកាត់ / ចប់',   val:`${actCnt} / ${doneCnt}`,c:'#0284c7'},
  ].map(k=>`
    <div class="ln-kpi" style="--ln-c:${k.c}">
      <div class="ln-kpi-icon"><i class="${k.icon}"></i></div>
      <div><div class="ln-kpi-val">${k.val}</div><div class="ln-kpi-lbl">${k.lbl}</div></div>
    </div>`).join('');

  const con = document.getElementById('ln-container');
  if (!con) return;

  if (!loans.length) {
    con.innerHTML = `<div class="ln-table-wrap"><div class="ln-empty">
      <div class="ln-empty-ico"><i class="fas fa-hand-holding-usd"></i></div>
      <div class="ln-empty-title">មិនមានការខ្ចីប្រាក់</div>
      <div class="ln-empty-sub">ចុច "បន្ថែមប្រាក់ខ្ចី" ដើម្បីបន្ថែមថ្មី</div>
      <button class="btn-primary" style="margin-top:14px;" onclick="openLoanModal()"><i class="fas fa-plus"></i> បន្ថែមប្រាក់ខ្ចី</button>
    </div></div>`;
    return;
  }

  const filtAmt  = loans.reduce((s,l)=>s+parseFloat(l.amount||0),0);
  const filtPaid = loans.reduce((s,l)=>s+calcPaid(l),0);
  const filtRem  = Math.max(0,filtAmt-filtPaid);

  const stLbl = {active:'កំពុងកាត់',completed:'បានចប់',pending:'រង់ចាំ',rejected:'បដិសេធ'};

  con.innerHTML = `
  <div class="ln-table-wrap">
    <table class="ln-table" style="min-width:900px;">
      <thead><tr>
        <th>#</th>
        <th>បុគ្គលិក</th>
        <th>ប្រភេទ</th>
        <th style="text-align:right;">ប្រាក់ខ្ចី</th>
        <th style="text-align:center;">ខែ</th>
        <th style="text-align:right;">កាត់/ខែ</th>
        <th style="text-align:center;min-width:120px;">វឌ្ឍនភាព</th>
        <th style="text-align:right;">នៅសល់</th>
        <th style="text-align:center;">ស្ថានភាព</th>
        <th style="text-align:center;width:90px;">សកម្មភាព</th>
      </tr></thead>
      <tbody>
        ${loans.map((l,i)=>{
          const emp    = emps.find(e=>e.id===l.empId);
          const dept   = depts.find(d=>d.name===emp?.department)||{};
          const t      = LOAN_TYPES[l.type]||LOAN_TYPES.other;
          const paid   = (l.paidMonths||[]).length;
          const monthly= parseFloat(l.monthlyDeduct||0);
          const total  = parseFloat(l.amount||0);
          const months = parseInt(l.months||1);
          const paidAmt= calcPaid(l);
          const remain = Math.max(0,total-paidAmt);
          const pct    = total>0 ? Math.round(paidAmt/total*100) : 0;
          const barC   = pct>=100?'#15803d':pct>=60?'#1d4ed8':'#c2410c';
          const avBg   = dept.color||'#3B5BDB';
          const stK    = l.status||'pending';
          return `<tr>
            <td style="color:#94a3b8;font-size:.65rem;font-weight:700;">${String(i+1).padStart(2,'0')}</td>
            <td>
              <div class="ln-emp-cell">
                <div class="ln-emp-av" style="background:linear-gradient(135deg,${avBg},${avBg}99);">
                  ${emp?.photo?`<img src="${emp.photo}" alt="">`:''}${!emp?.photo?getInitialsLn(emp?.name||'?'):''}
                </div>
                <div>
                  <div class="ln-emp-name">${emp?.name||l.empId}</div>
                  <div class="ln-emp-sub">${emp?.position||'—'} · ${emp?.department||'—'}</div>
                </div>
              </div>
            </td>
            <td><span class="ln-type-badge ${t.cls}"><i class="fas ${t.icon}"></i> ${t.label}</span></td>
            <td style="text-align:right;"><span class="ln-amt-val">${fmtMoney(total)}</span></td>
            <td style="text-align:center;font-size:.82rem;font-weight:700;">${months}ខែ</td>
            <td style="text-align:right;"><span class="ln-monthly-val">${fmtMoney(monthly)}</span></td>
            <td>
              <div style="display:flex;flex-direction:column;align-items:center;gap:3px;">
                <span style="font-size:.7rem;font-weight:700;color:${barC};">${paid}/${months}</span>
                <div class="ln-prog-track"><div class="ln-prog-fill" style="width:${pct}%;background:${barC};"></div></div>
                <span style="font-size:.62rem;color:var(--text-muted);">${pct}%</span>
              </div>
            </td>
            <td style="text-align:right;"><span class="ln-remain-val" style="color:${remain>0?'#dc2626':'#15803d'}">${fmtMoney(remain)}</span></td>
            <td style="text-align:center;">
              <span class="ln-status-badge ${stK}"><span class="sd"></span>${stLbl[stK]||stK}</span>
            </td>
            <td>
              <div class="ln-act-wrap" style="justify-content:center;">
                <button class="ln-act-btn view" title="មើលការកាត់" onclick="openLoanDetail('${l.id}')"><i class="fas fa-list-check"></i></button>
                <button class="ln-act-btn edit" title="កែប្រែ"     onclick="openLoanModal('${l.id}')"><i class="fas fa-pen"></i></button>
                <button class="ln-act-btn del"  title="លុប"         onclick="deleteLoan('${l.id}')"><i class="fas fa-trash"></i></button>
              </div>
            </td>
          </tr>`;
        }).join('')}
      </tbody>
    </table>
    <div class="ln-tfoot">
      <span>បង្ហាញ <strong>${loans.length}</strong> / ${all.length} ករណី</span>
      <span style="display:flex;gap:16px;">
        <span>ខ្ចី: <strong style="color:#1d4ed8;">${fmtMoney(filtAmt)}</strong></span>
        <span>បានសង: <strong style="color:#15803d;">${fmtMoney(filtPaid)}</strong></span>
        <span>នៅសល់: <strong style="color:#dc2626;">${fmtMoney(filtRem)}</strong></span>
      </span>
    </div>
  </div>`;
}

/* ── Type picker ── */
function pickLoanType(val) {
  document.getElementById('lnm-type').value = val;
  Object.keys(LOAN_TYPES).forEach(k=>{
    const b=document.getElementById('lnb-'+k);
    if(b) b.className='lnm-type-opt'+(k===val?' sel-'+k:'');
  });
}

/* ── Live calc ── */
function loanCalcUpdate() {
  const amt    = parseFloat(document.getElementById('lnm-amount')?.value||0);
  const mo     = parseFloat(document.getElementById('lnm-monthly-input')?.value||0);
  const start  = document.getElementById('lnm-start')?.value||'';
  // Compute months from amount ÷ monthly (round up)
  const months = (amt > 0 && mo > 0) ? Math.ceil(amt / mo) : 0;
  if(document.getElementById('lnm-c-total'))   document.getElementById('lnm-c-total').textContent   = fmtMoney(amt);
  if(document.getElementById('lnm-c-monthly')) document.getElementById('lnm-c-monthly').textContent = fmtMoney(mo);
  if(document.getElementById('lnm-c-months'))  document.getElementById('lnm-c-months').textContent  = months > 0 ? months + ' ខែ' : '—';
  if(document.getElementById('lnm-c-end')) {
    if (start && months > 0) {
      const d = new Date(start+'-01'); d.setMonth(d.getMonth()+months-1);
      document.getElementById('lnm-c-end').textContent = d.toLocaleDateString('km-KH',{year:'numeric',month:'short'});
    } else {
      document.getElementById('lnm-c-end').textContent = '—';
    }
  }
}

/* ── Open Modal ── */
function openLoanModal(id=null) {
  editingLoanId = id;
  const emps = DB.getEmployees();
  const sel  = document.getElementById('lnm-emp');
  if (sel) sel.innerHTML = '<option value="">-- ជ្រើស --</option>'+
    emps.map(e=>`<option value="${e.id}">${e.name}</option>`).join('');

  const now = new Date().toISOString().slice(0,7);
  if (id) {
    const l = DB.getLoanById(id); if(!l) return;
    document.getElementById('lnm-title').textContent   = 'កែប្រែប្រាក់ខ្ចី';
    document.getElementById('lnm-emp').value           = l.empId;
    document.getElementById('lnm-start').value         = l.startMonth||now;
    document.getElementById('lnm-amount').value          = l.amount||'';
    document.getElementById('lnm-monthly-input').value  = l.monthlyDeduct ? parseFloat(l.monthlyDeduct).toFixed(2) : '';
    document.getElementById('lnm-status').value        = l.status||'active';
    document.getElementById('lnm-note').value          = l.note||'';
    pickLoanType(l.type||'personal');
  } else {
    document.getElementById('lnm-title').textContent   = 'បន្ថែមប្រាក់ខ្ចី';
    document.getElementById('lnm-emp').value           = '';
    document.getElementById('lnm-start').value         = now;
    document.getElementById('lnm-amount').value         = '';
    document.getElementById('lnm-monthly-input').value  = '';
    document.getElementById('lnm-status').value        = 'active';
    document.getElementById('lnm-note').value          = '';
    pickLoanType('personal');
  }
  loanCalcUpdate();
  document.getElementById('loan-modal').classList.add('active');
}

/* ── Save ── */
function saveLoan() {
  const empId   = document.getElementById('lnm-emp').value;
  const start   = document.getElementById('lnm-start').value;
  const amount  = parseFloat(document.getElementById('lnm-amount').value||0);
  const monthly = parseFloat(document.getElementById('lnm-monthly-input').value||0);
  const months  = (amount > 0 && monthly > 0) ? Math.ceil(amount / monthly) : 0;
  if (!empId)           { showToast('⚠️ សូមជ្រើសបុគ្គលិក!','error'); return; }
  if (!amount||amount<=0)  { showToast('⚠️ សូមបញ្ចូលចំនួនប្រាក់!','error'); return; }
  if (!monthly||monthly<=0){ showToast('⚠️ សូមបញ្ចូលចំនួនកាត់/ខែ!','error'); return; }
  if (monthly > amount)    { showToast('⚠️ ចំនួនកាត់/ខែ មិនអាចលើសប្រាក់ខ្ចី!','error'); return; }
  if (!start)              { showToast('⚠️ សូមជ្រើសខែចាប់ផ្ដើម!','error'); return; }

  const rec = {
    empId, startMonth:start, amount, months, monthlyDeduct:monthly,
    type:   document.getElementById('lnm-type').value,
    status: document.getElementById('lnm-status').value,
    note:   document.getElementById('lnm-note').value.trim(),
  };

  if (editingLoanId) {
    const ex = DB.getLoanById(editingLoanId);
    rec.paidMonths = ex?.paidMonths||[];
    if (rec.paidMonths.length >= months) rec.status='completed';
    DB.updateLoan(editingLoanId, rec);
    showToast('✅ បានកែប្រែការខ្ចី!','success');
  } else {
    DB.addLoan(rec);
    showToast('✅ បានបន្ថែមការខ្ចី!','success');
  }
  closeModal('loan-modal');
  renderLoan();
}

/* ── Delete ── */
function deleteLoan(id) {
  if (!confirm('តើអ្នកប្រាកដចង់លុបការខ្ចីនេះ?')) return;
  DB.deleteLoan(id);
  showToast('🗑️ បានលុប!','success');
  renderLoan();
}

/* ── Detail Modal ── */
function openLoanDetail(id) {
  const l = DB.getLoanById(id); if (!l) return;
  const emp    = DB.getEmployees().find(e=>e.id===l.empId);
  const t      = LOAN_TYPES[l.type]||LOAN_TYPES.other;
  const total  = parseFloat(l.amount||0);
  const monthly= parseFloat(l.monthlyDeduct||0);
  const months = parseInt(l.months||1);
  const paid   = l.paidMonths||[];
  const paidAmt= Math.min(paid.length*monthly, total);
  const remain = Math.max(0, total-paidAmt);
  const pct    = total>0 ? Math.round(paidAmt/total*100) : 0;
  const barC   = pct>=100?'#15803d':pct>=60?'#1d4ed8':'#c2410c';

  // Month schedule
  const startD = new Date((l.startMonth||new Date().toISOString().slice(0,7))+'-01');
  const now    = new Date().toISOString().slice(0,7);
  const schedule = Array.from({length:months},(_,i)=>{
    const d = new Date(startD); d.setMonth(d.getMonth()+i);
    return d.toISOString().slice(0,7);
  });

  document.getElementById('lnd-title').innerHTML =
    `<i class="fas ${t.icon}" style="margin-right:6px;opacity:.8;"></i>${emp?.name||l.empId}`;
  document.getElementById('lnd-sub').textContent =
    `${t.label} · ${emp?.department||''} · ចាប់ ${l.startMonth||'—'} · ${months} ខែ`;

  document.getElementById('lnd-body').innerHTML = `
    <!-- Summary row -->
    <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-bottom:16px;">
      ${[
        {lbl:'ប្រាក់ខ្ចី',    val:fmtMoney(total),   c:'#1d4ed8', bg:'#eff6ff', ico:'fas fa-dollar-sign'},
        {lbl:'បានសង',         val:fmtMoney(paidAmt), c:'#15803d', bg:'#f0fdf4', ico:'fas fa-check-double'},
        {lbl:'នៅសល់',         val:fmtMoney(remain),  c:remain>0?'#dc2626':'#15803d', bg:remain>0?'#fff5f5':'#f0fdf4', ico:'fas fa-hourglass-half'},
        {lbl:'កាត់/ខែ',       val:fmtMoney(monthly), c:'#7e22ce', bg:'#fdf4ff', ico:'fas fa-calendar-check'},
      ].map(k=>`
        <div style="background:${k.bg};border-radius:10px;padding:12px 14px;border:1px solid ${k.c}22;">
          <div style="display:flex;align-items:center;gap:7px;margin-bottom:5px;">
            <div style="width:24px;height:24px;border-radius:6px;background:${k.c};display:flex;align-items:center;justify-content:center;font-size:.65rem;color:#fff;"><i class="${k.ico}"></i></div>
            <span style="font-size:.65rem;font-weight:700;color:${k.c};">${k.lbl}</span>
          </div>
          <div style="font-size:1rem;font-weight:900;color:${k.c};">${k.val}</div>
        </div>`).join('')}
    </div>
    <!-- Progress -->
    <div style="background:var(--bg);border:1px solid var(--border);border-radius:10px;padding:12px 14px;margin-bottom:16px;">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:7px;">
        <span style="font-size:.8rem;font-weight:700;color:var(--text);">វឌ្ឍនភាពការសង</span>
        <span style="font-size:.8rem;font-weight:800;color:${barC};">${paid.length}/${months} ខែ &nbsp;·&nbsp; ${pct}%</span>
      </div>
      <div style="height:11px;background:var(--border);border-radius:6px;overflow:hidden;">
        <div style="width:${pct}%;height:100%;background:linear-gradient(90deg,${barC},${barC}cc);border-radius:6px;transition:width .8s;"></div>
      </div>
      ${pct>=100?'<p style="margin-top:7px;font-size:.72rem;color:#15803d;font-weight:700;text-align:center;">🎉 សងចប់ស្រឡះ!</p>':''}
    </div>
    <!-- Month grid -->
    <div style="font-size:.7rem;font-weight:700;color:var(--text-muted);text-transform:uppercase;letter-spacing:.06em;margin-bottom:8px;">
      ផែនការកាត់ប្រចាំខែ · ចុចខែណាមួយ ដើម្បីប្ដូរស្ថានភាព
    </div>
    <div class="lnd-month-grid">
      ${schedule.map((ym,i)=>{
        const isPaid   = paid.includes(ym);
        const isCurrent= ym===now;
        const isFuture = ym>now && !isPaid;
        const isLast   = i===months-1;
        const mAmt     = isLast ? (total-(months-1)*monthly) : monthly;
        const d        = new Date(ym+'-01');
        const lbl      = d.toLocaleDateString('km-KH',{year:'numeric',month:'long'});
        const cls      = isPaid?'paid':isCurrent?'current':isFuture?'future':'';
        return `<div class="lnd-month-card ${cls}" onclick="toggleLoanMonth('${id}','${ym}',this)">
          <div class="lnd-month-num">#${i+1}${isCurrent?' ⭐':''}</div>
          <div class="lnd-month-name">${lbl}</div>
          <div class="lnd-month-amt">${fmtMoney(mAmt)}</div>
          <span class="lnd-month-badge ${isPaid?'paid':isFuture?'upcoming':'unpaid'}">
            ${isPaid?'✓ បានបង់':isFuture?'📅 មុនដល់':'⏳ មិនទាន់'}
          </span>
          ${isPaid
            ? `<button class="lnd-btn-unpay" title="ដក" onclick="event.stopPropagation();toggleLoanMonth('${id}','${ym}',this.parentElement)"><i class="fas fa-rotate-left"></i></button>`
            : `<button class="lnd-btn-pay"   title="ចុះថាបង់" onclick="event.stopPropagation();toggleLoanMonth('${id}','${ym}',this.parentElement)"><i class="fas fa-check"></i></button>`
          }
        </div>`;
      }).join('')}
    </div>
  `;
  document.getElementById('loan-detail-modal').classList.add('active');
}

function toggleLoanMonth(loanId, ym, el) {
  const l = DB.getLoanById(loanId); if(!l) return;
  const isPaid = (l.paidMonths||[]).includes(ym);
  if (isPaid) {
    DB.unmarkLoanMonthPaid(loanId, ym);
    showToast('↩️ បានដកការបង់!','info');
  } else {
    DB.markLoanMonthPaid(loanId, ym);
    showToast('✅ បានចុះថាបង់!','success');
  }
  openLoanDetail(loanId);
  renderLoan();
}

/* ── Excel Export ── */
function exportLoanExcel() {
  if (typeof XLSX==='undefined') { showToast('Library មិនទាន់ Load!','error'); return; }
  const emps=DB.getEmployees(), loans=DB.getLoan();
  const calcP=l=>Math.min((l.paidMonths||[]).length*parseFloat(l.monthlyDeduct||0),parseFloat(l.amount||0));
  const stLbl={active:'កំពុងកាត់',pending:'រង់ចាំ',completed:'បានចប់',rejected:'បដិសេធ'};
  const rows=loans.map((l,i)=>{
    const emp=emps.find(e=>e.id===l.empId);
    const t=LOAN_TYPES[l.type]||LOAN_TYPES.other;
    const paid=calcP(l), total=parseFloat(l.amount||0), remain=Math.max(0,total-paid);
    return {
      'ល.រ':i+1,'ឈ្មោះ':emp?.name||l.empId,'ផ្នែក':emp?.department||'',
      'ប្រភេទ':t.label,'ប្រាក់ខ្ចី($)':+total.toFixed(2),
      'ចំនួនខែ':+l.months,'កាត់/ខែ($)':+parseFloat(l.monthlyDeduct||0).toFixed(2),
      'ចាប់ខែ':l.startMonth||'','ខែបានបង់':(l.paidMonths||[]).length,
      'បានបង់($)':+paid.toFixed(2),'នៅសល់($)':+remain.toFixed(2),
      'ស្ថានភាព':stLbl[l.status]||l.status,'ចំណាំ':l.note||''
    };
  });
  const ws=XLSX.utils.json_to_sheet(rows.length?rows:[{'ចំណាំ':'គ្មានទិន្នន័យ'}]);
  ws['!cols']=[{wch:5},{wch:26},{wch:16},{wch:12},{wch:13},{wch:10},{wch:13},{wch:11},{wch:12},{wch:13},{wch:13},{wch:12},{wch:22}];
  const wb=XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb,ws,'ប្រាក់ខ្ចី');
  XLSX.writeFile(wb,`hrpro_loan_${new Date().toISOString().slice(0,10)}.xlsx`);
  showToast('✅ Excel ប្រាក់ខ្ចីបានទាញ!','success');
}

/* ── PDF Export ── */
function exportLoanPDF() {
  if (!window.jspdf) { showToast('Library មិនទាន់ Load!','error'); return; }
  const {jsPDF}=window.jspdf;
  const emps=DB.getEmployees(), loans=DB.getLoan();
  const calcP=l=>Math.min((l.paidMonths||[]).length*parseFloat(l.monthlyDeduct||0),parseFloat(l.amount||0));
  const doc=new jsPDF({orientation:'landscape',unit:'mm',format:'a4'});
  const pw=doc.internal.pageSize.getWidth(), ph=doc.internal.pageSize.getHeight();
  const today=new Date().toLocaleDateString('en-GB');
  doc.setFillColor(30,58,138); doc.rect(0,0,pw,16,'F');
  doc.setFillColor(29,78,216); doc.rect(0,16,pw,8,'F');
  doc.setTextColor(255,255,255);
  doc.setFontSize(13); doc.setFont('helvetica','bold');
  doc.text('HR Pro — Employee Loan Report',pw/2,10,{align:'center'});
  doc.setFontSize(8);  doc.setFont('helvetica','normal');
  doc.text(`Total: ${loans.length}  |  Printed: ${today}`,pw/2,22,{align:'center'});
  const totA=loans.reduce((s,l)=>s+parseFloat(l.amount||0),0);
  const totP=loans.reduce((s,l)=>s+calcP(l),0);
  const kw=(pw-20)/4-2;
  [{l:'Total Loaned',v:'$'+totA.toFixed(2),c:[29,78,216]},
   {l:'Total Paid',v:'$'+totP.toFixed(2),c:[21,128,61]},
   {l:'Remaining',v:'$'+Math.max(0,totA-totP).toFixed(2),c:[185,28,28]},
   {l:'Active',v:loans.filter(l=>l.status==='active').length+' loans',c:[126,34,206]}
  ].forEach((k,i)=>{
    const x=10+i*(kw+3);
    doc.setFillColor(...k.c); doc.roundedRect(x,28,kw,16,2,2,'F');
    doc.setTextColor(255,255,255);
    doc.setFontSize(12);doc.setFont('helvetica','bold');doc.text(k.v,x+kw/2,39,{align:'center'});
    doc.setFontSize(7.5);doc.setFont('helvetica','normal');doc.text(k.l,x+kw/2,33,{align:'center'});
  });
  doc.setTextColor(26,31,54);
  const stLbl={active:'Active',pending:'Pending',completed:'Done',rejected:'Rejected'};
  doc.autoTable({
    head:[['#','Employee','Dept','Type','Loan($)','Months','Monthly','Paid','Remain','Progress','Status']],
    body:loans.map((l,i)=>{
      const emp=emps.find(e=>e.id===l.empId);
      const t=LOAN_TYPES[l.type]||LOAN_TYPES.other;
      const paid=calcP(l), total=parseFloat(l.amount||0);
      const pct=total>0?Math.round(paid/total*100):0;
      return [i+1,emp?.name||l.empId,emp?.department||'',t.label,
        '$'+total.toFixed(2),l.months,'$'+parseFloat(l.monthlyDeduct||0).toFixed(2),
        '$'+paid.toFixed(2),'$'+Math.max(0,total-paid).toFixed(2),pct+'%',stLbl[l.status]||l.status];
    }),
    foot:[['','TOTAL','','',
      '$'+totA.toFixed(2),'',
      '$'+loans.filter(l=>l.status==='active').reduce((s,l)=>s+parseFloat(l.monthlyDeduct||0),0).toFixed(2),
      '$'+totP.toFixed(2),'$'+Math.max(0,totA-totP).toFixed(2),'','']],
    startY:50,margin:{left:10,right:10},
    headStyles:{fillColor:[30,58,138],textColor:255,fontSize:7,fontStyle:'bold',halign:'center'},
    footStyles:{fillColor:[30,58,138],textColor:255,fontSize:7.5,fontStyle:'bold'},
    bodyStyles:{fontSize:7},
    columnStyles:{0:{halign:'center',cellWidth:8},2:{cellWidth:22},3:{cellWidth:18},
      4:{halign:'right'},5:{halign:'center',cellWidth:13},6:{halign:'right'},
      7:{halign:'right'},8:{halign:'right',fontStyle:'bold'},
      9:{halign:'center',cellWidth:14},10:{halign:'center',cellWidth:18}},
    alternateRowStyles:{fillColor:[239,246,255]},
    didParseCell(d){
      if(d.section==='body'&&d.column.index===10){
        const v=d.cell.raw;
        d.cell.styles.textColor=v==='Done'?[21,128,61]:v==='Active'?[29,78,216]:v==='Pending'?[180,83,9]:[185,28,28];
        d.cell.styles.fontStyle='bold';
      }
    },
    didDrawPage(){
      doc.setFillColor(239,246,255); doc.rect(0,ph-8,pw,8,'F');
      doc.setFontSize(7); doc.setTextColor(29,78,216);
      doc.text('HR Pro — Loan Report  |  Confidential  |  '+today,pw/2,ph-2,{align:'center'});
    }
  });
  doc.save(`hrpro_loan_${new Date().toISOString().slice(0,10)}.pdf`);
  showToast('✅ PDF ប្រាក់ខ្ចីបានទាញ!','success');
}


// ===================================================================
//  BRANDING — Logo & Company Name
// ===================================================================

function applyBranding(s) {
  if (!s) return;
  const name = s.companyName || 'HR Pro';
  const sub  = s.companySub  || 'ប្រព័ន្ធគ្រប់គ្រងបុគ្គលិក';
  const logo = s.logoData    || '';   // base64 or ''

  // ── Sidebar ──
  const sbName = document.getElementById('sidebar-brand-name');
  const sbSub  = document.getElementById('sidebar-brand-sub');
  const sbFa   = document.getElementById('sidebar-logo-fa');
  const sbImg  = document.getElementById('sidebar-logo-img');
  if (sbName) sbName.textContent = name;
  if (sbSub)  sbSub.textContent  = sub;
  if (sbFa && sbImg) {
    if (logo) { sbImg.src = logo; sbImg.style.display = ''; sbFa.style.display = 'none'; }
    else       { sbImg.style.display = 'none'; sbFa.style.display = ''; }
  }

  // ── Login LEFT panel (big brand) ──
  const lgName = document.getElementById('login-brand-name');
  const lgSub  = document.getElementById('login-brand-sub');
  const lgFa   = document.getElementById('login-logo-fa');
  const lgImg  = document.getElementById('login-logo-img');
  if (lgName) lgName.textContent = name;
  if (lgSub)  {
    const line2 = s.companySubLogin || 'Human Resource Management System';
    lgSub.innerHTML = sub + '<br/>' + line2;
  }
  if (lgFa && lgImg) {
    if (logo) { lgImg.src = logo; lgImg.style.display = ''; lgFa.style.display = 'none'; }
    else       { lgImg.style.display = 'none'; lgFa.style.display = ''; }
  }

  // ── Login RIGHT panel (form header logo + name) ──
  const rfFa  = document.getElementById('login-form-logo-fa');
  const rfImg = document.getElementById('login-form-logo-img');
  const rfName= document.getElementById('login-form-brand-name');
  const rfRef = document.getElementById('login-right-brand-ref');
  const rfFoot= document.getElementById('login-footer-name');
  if (rfName) rfName.textContent = name;
  if (rfRef)  rfRef.textContent  = name;
  if (rfFoot) rfFoot.textContent = name;
  if (rfFa && rfImg) {
    if (logo) { rfImg.src = logo; rfImg.style.display = ''; rfFa.style.display = 'none'; }
    else       { rfImg.style.display = 'none'; rfFa.style.display = ''; }
  }

  // ── Topbar title (page-specific) ──
  // no change needed — PAGE_TITLES handles it

  // ── Dashboard welcome ──
  const dwt = document.querySelector('.dash-welcome-title span');
  if (dwt) dwt.textContent = name;

  // ── Tab title ──
  document.title = name + ' · ប្រព័ន្ធគ្រប់គ្រងបុគ្គលិក';

  // ── ID Cards ──
  const idcName = document.getElementById('idc-co-name');
  if (idcName) idcName.textContent = name;
}

function loadBranding() {
  const s = DB.getSettings();
  applyBranding(s);
}

function loadBrandingForm() {
  const s = DB.getSettings();
  const nameEl = document.getElementById('brand-name');
  const subEl  = document.getElementById('brand-sub');
  if (nameEl) nameEl.value = s.companyName || '';
  if (subEl)  subEl.value  = s.companySub  || '';
  // Restore logo preview if saved
  const prevImg  = document.getElementById('logo-preview-img');
  const prevIcon = document.getElementById('logo-preview-icon');
  if (prevImg && prevIcon) {
    if (s.logoData) {
      prevImg.src = s.logoData; prevImg.style.display = ''; prevIcon.style.display = 'none';
    } else {
      prevImg.src = ''; prevImg.style.display = 'none'; prevIcon.style.display = '';
    }
  }
  updateBrandingPreview();
}

function updateBrandingPreview() {
  const name  = document.getElementById('brand-name')?.value  || 'HR Pro';
  const sub   = document.getElementById('brand-sub')?.value   || 'ប្រព័ន្ធគ្រប់គ្រងបុគ្គលិក';
  const logo  = document.getElementById('logo-preview-img')?.src || '';
  const hasLogo = logo && logo !== window.location.href;

  // mini preview in settings card
  const bpName = document.getElementById('bp-name');
  const bpSub  = document.getElementById('bp-sub');
  const bpIco  = document.getElementById('bp-icon');
  const bpImg  = document.getElementById('bp-img');
  if (bpName) bpName.textContent = name;
  if (bpSub)  bpSub.textContent  = sub;
  if (bpIco && bpImg) {
    if (hasLogo) { bpImg.src = logo; bpImg.style.display = ''; bpIco.style.display = 'none'; }
    else          { bpImg.style.display = 'none'; bpIco.style.display = ''; }
  }
}

// Wire up live preview on input
document.addEventListener('DOMContentLoaded', () => {
  ['brand-name','brand-sub'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('input', updateBrandingPreview);
  });
});

function handleLogoUpload(event) {
  const file = event.target.files[0];
  if (!file) return;
  if (file.size > 2 * 1024 * 1024) { showToast('Logo ធំពេក! (max 2MB)', 'error'); return; }
  const reader = new FileReader();
  reader.onload = e => {
    const data = e.target.result;
    // Show preview
    const previewImg  = document.getElementById('logo-preview-img');
    const previewIcon = document.getElementById('logo-preview-icon');
    if (previewImg)  { previewImg.src = data; previewImg.style.display = ''; }
    if (previewIcon) previewIcon.style.display = 'none';
    updateBrandingPreview();
  };
  reader.readAsDataURL(file);
}

function removeLogo() {
  const previewImg  = document.getElementById('logo-preview-img');
  const previewIcon = document.getElementById('logo-preview-icon');
  const fileInput   = document.getElementById('logo-file-input');
  if (previewImg)  { previewImg.src = ''; previewImg.style.display = 'none'; }
  if (previewIcon) previewIcon.style.display = '';
  if (fileInput)   fileInput.value = '';
  updateBrandingPreview();
}

function saveBranding() {
  const name   = document.getElementById('brand-name')?.value.trim()  || 'HR Pro';
  const sub    = document.getElementById('brand-sub')?.value.trim()   || 'ប្រព័ន្ធគ្រប់គ្រងបុគ្គលិក';
  const imgEl  = document.getElementById('logo-preview-img');
  const logoData = (imgEl && imgEl.style.display !== 'none' && imgEl.src && !imgEl.src.endsWith(window.location.href))
    ? imgEl.src : '';

  DB.saveSettings({ companyName: name, companySub: sub, logoData });
  applyBranding({ companyName: name, companySub: sub, logoData });
  showToast('✅ បានរក្សាទុក Branding!', 'success');
}




// Stub for security code settings (not yet implemented)
function loadSecurityCodeSettings() {
  // Reserved for future security code configuration
}

function resetBranding() {
  if (!confirm('លុបការកំណត់ Branding ទាំងអស់?')) return;
  DB.saveSettings({ companyName: 'HR Pro', companySub: 'ប្រព័ន្ធគ្រប់គ្រងបុគ្គលិក', logoData: '' });
  loadBrandingForm();
  removeLogo();
  applyBranding({ companyName: 'HR Pro', companySub: 'ប្រព័ន្ធគ្រប់គ្រងបុគ្គលិក', logoData: '' });
  showToast('↩️ បានស្ដារ Branding!', 'info');
}

// ===================================================================
//  LOGIN SYSTEM
// ===================================================================
// ===== USER MANAGEMENT =====
const DEFAULT_USERS = [
  { username:'admin',   password:'admin123', name:'អ្នកគ្រប់គ្រង',    role:'Admin',      avatar:'A', color:'#3B5BDB', active:true },
  { username:'hr',      password:'hr2024',   name:'លោក ចន្ទ្រា សុភា', role:'HR Manager', avatar:'H', color:'#059669', active:true },
  { username:'manager', password:'mgr456',   name:'លោក វង្ស នរា',     role:'Manager',    avatar:'M', color:'#D97706', active:true },
  { username:'viewer',  password:'view789',  name:'លោកស្រី ស្រីនិច',  role:'Viewer',     avatar:'V', color:'#7C3AED', active:true },
];

function getUsers() {
  try {
    const s = localStorage.getItem('hrpro_users');
    if (s) return JSON.parse(s);
  } catch(e) {}
  saveUsers(DEFAULT_USERS);
  return DEFAULT_USERS.map(u => ({...u}));
}
function saveUsers(list) {
  localStorage.setItem('hrpro_users', JSON.stringify(list));
}
function getUserList() { return getUsers(); }

let currentUser = null;

// ===================================================================
//  LICENSE SYSTEM — HMAC-SHA256 Authenticated
// ===================================================================
// ⚠️  Auto-generated by HR Pro Authenticator — DO NOT EDIT MANUALLY
// ⚠️  HRPRO_SECRET must match the Secret Key in HRPro_Authenticator.html
// ===================================================================
// ══ HMAC-SHA256 License Verifier ══
// Auto-generated by HR Pro Authenticator
const HRPRO_SECRET = 'HRPro2026-SecretKey-HMAC-Default';

async function hmacVerifyKey(fullKey) {
  try {
    const parts = fullKey.split('.');
    if(parts.length < 2) return false;
    const rawKey = parts.slice(0, -1).join('.');
    const keySig = parts[parts.length - 1].toUpperCase();
    const keyDef = LICENSE_KEYS[fullKey];
    if(!keyDef) return false;
    const msg  = rawKey + ':' + keyDef.type + ':' + keyDef.days;
    const enc  = new TextEncoder();
    const ckey = await crypto.subtle.importKey(
      'raw', enc.encode(HRPRO_SECRET),
      { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']
    );
    const sig  = await crypto.subtle.sign('HMAC', ckey, enc.encode(msg));
    const hex  = Array.from(new Uint8Array(sig))
                   .map(b=>b.toString(16).padStart(2,'0')).join('').toUpperCase();
    return hex.slice(0, 8) === keySig;
  } catch(e) { return false; }
}

// ── Keys database (generated by Authenticator) ──
const LICENSE_KEYS = {
  'DEMO-S2YY-FREE-2026.EDE0E53D': { days: 1, label: 'Demo 1 ថ្ងៃ', type: 'trial', sig: 'EDE0E53DAD600774' },
  'DEMO-HFYU-FREE-2026.A4FB6FB7': { days: 3, label: 'Demo 3 ថ្ងៃ', type: 'trial', sig: 'A4FB6FB7A5DF4647' },
  'DEMO-5KFW-FREE-2026.C3551446': { days: 5, label: 'Demo 5 ថ្ងៃ', type: 'trial', sig: 'C35514461AF9452E' },
  'DEMO-UJQX-FREE-2026.C4DC62B5': { days: 7, label: 'Demo 7 ថ្ងៃ', type: 'trial', sig: 'C4DC62B52CE2FDA4' },
  'DEMO-3344-FREE-2026.3099B16D': { days: 10, label: 'Demo 10 ថ្ងៃ', type: 'trial', sig: '3099B16D6ACC7068' },
  'DEMO-UYQX-FREE-2026.7F9659EC': { days: 15, label: 'Demo 15 ថ្ងៃ', type: 'trial', sig: '7F9659EC97866091' },
  'DEMO-HD64-FREE-2026.74BCA193': { days: 20, label: 'Demo 20 ថ្ងៃ', type: 'trial', sig: '74BCA19349D4F1F7' },
  'DEMO-4R6X-FREE-2026.3EBB4592': { days: 30, label: 'Demo 30 ថ្ងៃ', type: 'trial', sig: '3EBB4592C4563CFD' },
  'HRPR-180D-HALF-2026.CBD11CB3': { days: 180, label: '6 180 ថ្ងៃ', type: 'semi', sig: 'CBD11CB312DE5458' },
  'HRPR-365D-YEAR-2026.17E46CB2': { days: 365, label: 'Annual 365 ថ្ងៃ', type: 'annual', sig: '17E46CB2BE28FCE5' },
  'DEMO-6F9J-PREM-2026.E496611A': { days: 90, label: 'Premium 90 ថ្ងៃ', type: 'premium', sig: 'E496611A5AABA430' },
  'HRPR-LIFE-TIME-B7QL.EB655299': { days: -1, label: 'Lifetime', type: 'lifetime', sig: 'EB6552992262A236' },
};

// ── HMAC-SHA256 verify (WebCrypto) ──
async function _hmacVerifyKey(fullKey) {
  try {
    const parts  = fullKey.split('.');
    if (parts.length < 2) return false;
    const rawKey = parts.slice(0, -1).join('.');
    const keySig = parts[parts.length - 1].toUpperCase();
    const keyDef = LICENSE_KEYS[fullKey];
    if (!keyDef) return false;
    const msg  = rawKey + ':' + keyDef.type + ':' + keyDef.days;
    const enc  = new TextEncoder();
    const ckey = await crypto.subtle.importKey(
      'raw', enc.encode(HRPRO_SECRET),
      { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']
    );
    const sig  = await crypto.subtle.sign('HMAC', ckey, enc.encode(msg));
    const hex  = Array.from(new Uint8Array(sig))
                   .map(b => b.toString(16).padStart(2, '0')).join('').toUpperCase();
    return hex.slice(0, 8) === keySig;
  } catch (e) { return false; }
}

function getLicenseData() {
  try {
    const s = localStorage.getItem('hrpro_license');
    if (s) return JSON.parse(s);
  } catch(e) {}
  return null;
}

function saveLicenseData(data) {
  localStorage.setItem('hrpro_license', JSON.stringify(data));
}

function getLicenseDaysLeft(lic) {
  if (!lic) return 0;
  if (lic.days === -1) return Infinity;
  const activated = new Date(lic.activatedAt);
  const expires   = new Date(activated.getTime() + lic.days * 86400000);
  const now       = new Date();
  return Math.ceil((expires - now) / 86400000);
}

function isLicenseValid() {
  const lic = getLicenseData();
  if (!lic) return false;
  const left = getLicenseDaysLeft(lic);
  return left > 0 || left === Infinity;
}

function activateLicense() {
  const key    = document.getElementById('lic-key-input').value.trim().toUpperCase();
  const errEl  = document.getElementById('lic-err');
  const errMsg = document.getElementById('lic-err-msg');
  const btn    = document.querySelector('.lic-submit-btn');
  errEl.classList.remove('show');

  if (!key) {
    errMsg.textContent = 'សូមបញ្ចូល License Key!';
    errEl.classList.add('show'); return;
  }

  const keyDef = LICENSE_KEYS[key];
  if (!keyDef) {
    errMsg.textContent = 'License Key មិនត្រឹមត្រូវ! សូមពិនិត្យម្ដងទៀត។';
    errEl.classList.add('show');
    document.getElementById('lic-key-input').style.borderColor = '#EF4444';
    setTimeout(() => document.getElementById('lic-key-input').style.borderColor = '', 2000);
    return;
  }

  // HMAC Signature Verification
  if (btn) { btn.disabled = true; btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> កំពុង Verify...'; }

  _hmacVerifyKey(key).then(sigOk => {
    if (btn) { btn.disabled = false; btn.innerHTML = '<i class="fas fa-unlock-alt"></i> ដំណើរការ License'; }

    if (!sigOk) {
      errMsg.textContent = '🚫 Signature មិនត្រឹមត្រូវ! Key នេះ Invalid ឬ Tampered។';
      errEl.classList.add('show');
      document.getElementById('lic-key-input').style.borderColor = '#EF4444';
      setTimeout(() => document.getElementById('lic-key-input').style.borderColor = '', 2000);
      return;
    }

    const licData = {
      key,
      days: keyDef.days,
      label: keyDef.label,
      type: keyDef.type,
      sig: keyDef.sig || '',
      activatedAt: new Date().toISOString(),
    };
    saveLicenseData(licData);
    document.getElementById('license-wall').style.display = 'none';
    showToast('🎉 License ដំណើរការដោយជោគជ័យ! ' + keyDef.label, 'success');
    updateLicenseBanner();
    renderLicenseSettingsCard();
    initLogin();
  });
}

function applyExtendKey() {
  const key    = document.getElementById('lic-ext-key').value.trim().toUpperCase();
  const errEl  = document.getElementById('lic-ext-err');
  const errMsg = document.getElementById('lic-ext-err-msg');
  errEl.classList.remove('show');

  if (!key) { errMsg.textContent = 'សូមបញ្ចូល License Key!'; errEl.classList.add('show'); return; }

  const keyDef = LICENSE_KEYS[key];
  if (!keyDef) {
    errMsg.textContent = 'License Key មិនត្រឹមត្រូវ!';
    errEl.classList.add('show'); return;
  }

  _hmacVerifyKey(key).then(sigOk => {
    if (!sigOk) {
      errMsg.textContent = '🚫 Signature មិនត្រឹមត្រូវ! Key Invalid ឬ Tampered។';
      errEl.classList.add('show'); return;
    }
    const licData = {
      key,
      days: keyDef.days,
      label: keyDef.label,
      type: keyDef.type,
      sig: keyDef.sig || '',
      activatedAt: new Date().toISOString(),
    };
    saveLicenseData(licData);
    closeLicExtendModal();
    updateLicenseBanner();
    renderLicenseSettingsCard();
    showToast('✅ License ថ្មីដំណើរការ! ' + keyDef.label, 'success');
  });
}

function updateLicenseBanner() {
  const banner = document.getElementById('lic-banner');
  if (!banner) return;
  const lic = getLicenseData();
  if (!lic) { banner.style.display = 'none'; return; }
  const left = getLicenseDaysLeft(lic);
  if (left === Infinity) { banner.style.display = 'none'; return; }
  if (left > 14) { banner.style.display = 'none'; return; }

  banner.style.display = 'block';
  if (left <= 3) {
    banner.className = 'danger';
    banner.innerHTML = `⚠️ License នឹងផុតកំណត់ក្នុង <strong>${left} ថ្ងៃ</strong>! ចុចទីនេះដើម្បីពន្យារ →`;
  } else {
    banner.className = 'warning';
    banner.innerHTML = `🔔 License នៅសល់ <strong>${left} ថ្ងៃ</strong> (${lic.label}) · ចុចទីនេះដើម្បីពន្យារ →`;
  }
}

function renderLicenseSettingsCard() {
  const grid = document.getElementById('lic-main-status-grid');
  const progWrap = document.getElementById('lic-progress-wrap');
  if (!grid) return;
  const lic = getLicenseData();
  if (!lic) {
    grid.innerHTML = `<div class="lic-info-box" style="grid-column:1/-1;text-align:center;">
      <span style="color:var(--text-muted);font-size:13px;">មិនទាន់ activate License · ចុច "ផ្ដល់ / ពន្យារ License"</span>
    </div>`;
    if (progWrap) progWrap.innerHTML = '';
    return;
  }
  const left = getLicenseDaysLeft(lic);
  const activated = new Date(lic.activatedAt).toLocaleDateString('km-KH');
  let expiry = '∞ គ្មានកំណត់';
  let pct = 100;
  let leftColor = 'green';
  if (left !== Infinity) {
    const expDate = new Date(new Date(lic.activatedAt).getTime() + lic.days * 86400000);
    expiry = expDate.toLocaleDateString('km-KH');
    pct = Math.max(0, Math.round(left / lic.days * 100));
    leftColor = left <= 3 ? 'red' : left <= 14 ? 'orange' : 'green';
  }
  const typeColors = { trial:'#F59E0B', premium:'#3B5BDB', lifetime:'#059669', annual:'#7C3AED', semi:'#0284C7' };
  const tc = typeColors[lic.type] || '#3B5BDB';

  grid.innerHTML = `
    <div class="lic-info-box">
      <div class="lic-info-lbl">ប្រភេទ License</div>
      <div class="lic-info-val" style="color:${tc};">${lic.label}</div>
    </div>
    <div class="lic-info-box">
      <div class="lic-info-lbl">ស្ថានភាព</div>
      <div class="lic-info-val ${isLicenseValid() ? 'green' : 'red'}">${isLicenseValid() ? '✅ សកម្ម' : '❌ ផុតកំណត់'}</div>
    </div>
    <div class="lic-info-box">
      <div class="lic-info-lbl">ដំណើរការ</div>
      <div class="lic-info-val blue" style="font-size:13px;">${activated}</div>
    </div>
    <div class="lic-info-box">
      <div class="lic-info-lbl">${left === Infinity ? 'ផុតកំណត់' : 'ថ្ងៃនៅសល់'}</div>
      <div class="lic-info-val ${leftColor}">${left === Infinity ? '∞' : left + ' ថ្ងៃ'}</div>
    </div>
  `;

  if (progWrap) {
    if (left === Infinity) {
      progWrap.innerHTML = `<div style="background:linear-gradient(90deg,#059669,#10B981);height:8px;border-radius:4px;width:100%;"></div>
        <div style="font-size:11px;color:#059669;margin-top:5px;font-weight:600;">🎉 Lifetime License — គ្មានកំណត់</div>`;
    } else {
      const barColor = pct > 50 ? '#059669' : pct > 20 ? '#F59E0B' : '#EF4444';
      progWrap.innerHTML = `
        <div style="display:flex;justify-content:space-between;font-size:11px;color:var(--text-muted);margin-bottom:5px;">
          <span>ផុតកំណត់: ${expiry}</span>
          <span style="font-weight:700;color:${barColor};">${pct}% នៅសល់</span>
        </div>
        <div style="height:8px;background:var(--border);border-radius:4px;overflow:hidden;">
          <div style="width:${pct}%;height:100%;background:linear-gradient(90deg,${barColor},${barColor}cc);border-radius:4px;transition:width .8s;"></div>
        </div>`;
    }
  }
}

function renderLicExtendStatusGrid() {
  const grid = document.getElementById('lic-status-grid');
  if (!grid) return;
  const lic = getLicenseData();
  if (!lic) {
    grid.innerHTML = `<div class="lic-info-box" style="grid-column:1/-1;">
      <div class="lic-info-lbl">ស្ថានភាព</div>
      <div class="lic-info-val red">❌ មិនទាន់ Activate</div>
    </div>`;
    return;
  }
  const left = getLicenseDaysLeft(lic);
  const leftColor = left === Infinity ? 'green' : left <= 3 ? 'red' : left <= 14 ? 'orange' : 'green';
  grid.innerHTML = `
    <div class="lic-info-box">
      <div class="lic-info-lbl">License</div>
      <div class="lic-info-val blue" style="font-size:13px;">${lic.label}</div>
    </div>
    <div class="lic-info-box">
      <div class="lic-info-lbl">ថ្ងៃនៅសល់</div>
      <div class="lic-info-val ${leftColor}">${left === Infinity ? '∞ ∞' : left + ' ថ្ងៃ'}</div>
    </div>`;
}

function openLicExtendModal() {
  document.getElementById('lic-extend-modal').classList.add('open');
  document.getElementById('lic-ext-key').value = '';
  document.getElementById('lic-ext-err').classList.remove('show');
  renderLicExtendStatusGrid();
}

function closeLicExtendModal() {
  document.getElementById('lic-extend-modal').classList.remove('open');
}

function checkAndShowLicenseWall() {
  const lic = getLicenseData();
  if (!lic || !isLicenseValid()) {
    document.getElementById('license-wall').style.display = 'flex';
    return false;
  }
  document.getElementById('license-wall').style.display = 'none';
  return true;
}

function initLogin() {
  // Check license first
  if (!checkAndShowLicenseWall()) return;

  // Restore saved theme first
  const savedTheme = localStorage.getItem('hrpro_theme') || 'light';
  document.documentElement.setAttribute('data-theme', savedTheme);

  updateLicenseBanner();
  renderLicenseSettingsCard();

  // Check remember me
  const saved = localStorage.getItem('hrpro_remember');
  if (saved) {
    try {
      const u = JSON.parse(saved);
      const found = getUsers().find(x => x.username === u.username && x.password === u.password && x.active !== false);
      if (found) { loginSuccess(found, true); return; }
    } catch(e) {}
  }
  document.getElementById('login-screen').classList.remove('hidden');
}

function doLogin() {
  const username = document.getElementById('login-username').value.trim();
  const password = document.getElementById('login-password').value;
  const remember = document.getElementById('login-remember').checked;
  const btn      = document.getElementById('login-btn');
  const errEl    = document.getElementById('login-error');

  errEl.classList.add('hidden');
  if (!username || !password) {
    showLoginError('សូមបញ្ចូល Username និង Password!');
    return;
  }

  // Show loading
  btn.classList.add('loading');
  btn.disabled = true;

  setTimeout(() => {
    const user = getUsers().find(u => u.username === username && u.password === password && u.active !== false);
    btn.classList.remove('loading');
    btn.disabled = false;

    if (user) {
      if (remember) {
        localStorage.setItem('hrpro_remember', JSON.stringify({ username: user.username, password: user.password }));
      } else {
        localStorage.removeItem('hrpro_remember');
      }
      loginSuccess(user, false);
    } else {
      showLoginError('Username ឬ Password មិនត្រូវ! សូមព្យាយាមម្ដងទៀត។');
      document.getElementById('login-password').value = '';
      document.getElementById('login-password').focus();
      // Shake animation
      const form = document.querySelector('.login-form');
      form.style.animation = 'none';
      form.offsetHeight;
      form.style.animation = 'loginShake 0.4s ease';
    }
  }, 800);
}

function loginSuccess(user, skipAnim) {
  currentUser = user;

  // Hide login, show app
  const loginScreen = document.getElementById('login-screen');
  const appWrapper  = document.getElementById('app-wrapper');

  if (!skipAnim) {
    loginScreen.style.transition = 'opacity 0.4s ease';
    loginScreen.style.opacity = '0';
    setTimeout(() => {
      loginScreen.classList.add('hidden');
      loginScreen.style.opacity = '';
      loginScreen.style.transition = '';
      appWrapper.classList.add('visible');
      bootApp(user);
    }, 400);
  } else {
    loginScreen.classList.add('hidden');
    appWrapper.classList.add('visible');
    bootApp(user);
  }
}

function bootApp(user) {
  // ---- Reset License section: លាក់ body + លាក់ប៊ូតុង Toggle ពេល Login ----
  _licSectionHidden = true;
  const licBody    = document.getElementById('lic-section-body');
  const licIcoWrap = document.getElementById('lic-toggle-ico');
  const licHideBtn = document.getElementById('lic-hide-btn');
  if (licBody)    { licBody.style.maxHeight = '0px'; licBody.style.opacity = '0'; }
  if (licIcoWrap) { licIcoWrap.style.transform = 'rotate(180deg)'; }
  if (licHideBtn) { licHideBtn.style.display = 'none'; }

  // Update sidebar footer
  document.querySelector('.user-name').textContent = user.name;
  document.querySelector('.user-role').textContent = user.role;

  // Add user chip to topbar
  const topbarRight = document.querySelector('.topbar-right');
  const existingChip = document.getElementById('topbar-user-chip');
  if (!existingChip) {
    const chip = document.createElement('div');
    chip.className = 'topbar-user-chip';
    chip.id = 'topbar-user-chip';
    chip.onclick = (e) => { e.stopPropagation(); chip.classList.toggle('open'); };
    chip.innerHTML = `
      <div class="topbar-user-av" style="background:linear-gradient(135deg,${user.color},${user.color}99);overflow:hidden;position:relative;">${user.photo ? `<img src="${user.photo}" style="width:100%;height:100%;object-fit:cover;position:absolute;inset:0;" alt=""/>` : user.avatar}</div>
      <div>
        <div class="topbar-user-name">${user.name}</div>
        <div class="topbar-user-role">${user.role}</div>
      </div>
      <div class="topbar-user-dropdown">
        <div class="tud-header">
          <div class="tud-name">${user.name}</div>
          <div class="tud-role">${user.role}</div>
        </div>
        <button class="tud-item" onclick="navigate('settings')"><i class="fas fa-cog"></i> ការកំណត់</button>
        <button class="tud-item" onclick="toggleTheme()"><i class="fas fa-circle-half-stroke"></i> ប្តូររូបរាង</button>
        <div class="tud-sep"></div>
        <button class="tud-item danger" onclick="doLogout()"><i class="fas fa-right-from-bracket"></i> ចេញពីប្រព័ន្ធ</button>
      </div>
    `;
    // Insert before date
    const dateEl = document.getElementById('topbar-date');
    topbarRight.insertBefore(chip, dateEl);
  }

  // Close dropdown on outside click
  document.addEventListener('click', () => {
    const c = document.getElementById('topbar-user-chip');
    if (c) c.classList.remove('open');
  });

  // Init app
  DB.seed();
  loadBranding();
  updateClock();
  setInterval(updateClock, 1000);
  navigate('dashboard');
  document.getElementById('att-date-filter').value = new Date().toISOString().split('T')[0];
  setTimeout(() => showWelcomeAlert(user), 600);
}


function showWelcomeAlert(user) {
  // Remove existing
  const existing = document.getElementById('welcome-alert');
  if (existing) existing.remove();

  const now  = new Date();
  const hour = now.getHours();
  const greeting = hour < 12 ? 'អរុណសួស្តី 🌅' : hour < 17 ? 'ទិវាសួស្តី ☀️' : 'សាយ័ណ្ហសួស្តី 🌇';
  const timeStr  = now.toLocaleTimeString('km-KH', { hour:'2-digit', minute:'2-digit' });
  const dateStr  = now.toLocaleDateString('km-KH', { weekday:'long', day:'numeric', month:'long' });
  const roleIco  = user.role === 'Admin' ? '👑' : user.role === 'HR' ? '🧑‍💼' : '👤';
  const avatarBg = user.color
    ? `background:linear-gradient(135deg,${user.color},${user.color}99);`
    : 'background:linear-gradient(135deg,#3B5BDB,#6B8EFF);';

  const el = document.createElement('div');
  el.id = 'welcome-alert';
  el.innerHTML = `
    <div class="wa-bar"></div>
    <div class="wa-body">
      <div class="wa-avatar" style="${avatarBg}">
        <div class="wa-avatar-ring"></div>
        ${user.photo ? `<img src="${user.photo}" style="width:100%;height:100%;object-fit:cover;border-radius:50%;" alt=""/>` : `<span style="font-size:22px;">${user.avatar || roleIco}</span>`}
      </div>
      <div class="wa-text">
        <div class="wa-greeting">${greeting}</div>
        <div class="wa-name">${user.name}</div>
        <div class="wa-role"><span>${roleIco} ${user.role}</span></div>
      </div>
      <button class="wa-close" onclick="dismissWelcomeAlert()"><i class="fas fa-times"></i></button>
    </div>
    <div class="wa-footer">
      <i class="fas fa-clock wa-time-ico"></i>
      <span class="wa-time-txt">${dateStr} · ${timeStr}</span>
      <div class="wa-progress"><div class="wa-progress-fill" id="wa-prog"></div></div>
    </div>
  `;
  document.body.appendChild(el);

  // Show with animation
  requestAnimationFrame(() => {
    requestAnimationFrame(() => { el.classList.add('show'); });
  });

  // Progress bar countdown (4s)
  const duration = 4000;
  const prog = document.getElementById('wa-prog');
  if (prog) {
    prog.style.transitionDuration = duration + 'ms';
    requestAnimationFrame(() => { prog.style.width = '0%'; });
  }

  // Auto dismiss
  setTimeout(() => dismissWelcomeAlert(), duration);
}

function dismissWelcomeAlert() {
  const el = document.getElementById('welcome-alert');
  if (!el) return;
  el.classList.remove('show');
  setTimeout(() => { if (el.parentNode) el.remove(); }, 400);
}



// ═══════════════════════════════════════════════════════════════
//  EXPENSES — ការចំណាយទូទៅ
// ═══════════════════════════════════════════════════════════════

const EXP_CAT_LABELS = {
  office:'ការិយាល័យ', transport:'ដឹកជញ្ជូន', food:'អាហារ / ភ្លក្ខីន',
  utility:'អគ្គិសនី / ទឹក', equipment:'សម្ភារ / ឧបករណ៍', marketing:'ទីផ្សារ',
  training:'បណ្តុះបណ្តាល', maintenance:'ថែទាំ / ជួសជុល',
  rent:'ផ្ទះជួល / ទីតាំង', wifi:'Wi-Fi / អ៊ីនធឺណិត', other:'ផ្សេងៗ'
};
const EXP_CAT_COLORS = {
  office:'#3B5BDB', transport:'#0891B2', food:'#D97706', utility:'#059669',
  equipment:'#7C3AED', marketing:'#DB2777', training:'#0284C7', maintenance:'#B45309',
  rent:'#0F766E', wifi:'#6366F1', other:'#6B7280'
};
const EXP_CAT_ICONS = {
  office:'🏢', transport:'🚗', food:'🍽️', utility:'⚡', equipment:'🖥️',
  marketing:'📢', training:'📚', maintenance:'🔧',
  rent:'🏠', wifi:'📶', other:'📦'
};
const EXP_STATUS_LABELS = { pending:'រង់ចាំ', approved:'អនុម័ត', rejected:'បដិសេធ' };
const EXP_STATUS_COLORS = { pending:'#D97706', approved:'#059669', rejected:'#DC2626' };

// ── DB helpers ──
function getExpenses()       { try { return JSON.parse(localStorage.getItem('hrpro_expenses')||'[]'); } catch(e){return[];} }
function saveExpenses(list)  { localStorage.setItem('hrpro_expenses', JSON.stringify(list)); }

// ── Fund pool helpers ──
// ការស្នើប្រាក់ approved = ចំណូល | ការចំណាយទូទៅ approved = ចំណាយ
function getExpFundPool() {
  const allReq = (function(){ try{ return JSON.parse(localStorage.getItem('hrpro_expreq')||'[]'); }catch(e){return[];} })();
  const allExp = getExpenses();
  const income  = allReq.filter(r=>r.status==='approved').reduce((s,r)=>s+(parseFloat(r.amount)||0),0);
  const expense = allExp.filter(e=>e.status==='approved').reduce((s,e)=>s+(parseFloat(e.amount)||0),0);
  return { income, expense, balance: income - expense };
}

function expNextId() {
  const list = getExpenses();
  if (!list.length) return 'EXP-001';
  const nums = list.map(e => parseInt((e.id||'EXP-000').replace('EXP-',''))||0);
  return 'EXP-' + String(Math.max(...nums)+1).padStart(3,'0');
}

// ── Tab switching ──
function switchExpTab(tab) {
  const isExp = tab === 'expenses';
  document.getElementById('exp-panel-expenses').style.display = isExp ? '' : 'none';
  document.getElementById('exp-panel-request').style.display  = isExp ? 'none' : '';
  document.getElementById('exp-hdr-btns-expenses').style.display = isExp ? 'flex' : 'none';
  document.getElementById('exp-hdr-btns-request').style.display  = isExp ? 'none' : 'flex';

  const tabExp = document.getElementById('exp-tab-expenses');
  const tabReq = document.getElementById('exp-tab-request');
  if (tabExp) {
    tabExp.style.background = isExp ? 'linear-gradient(135deg,#7C3AED,#A855F7)' : 'var(--surface)';
    tabExp.style.color      = isExp ? '#fff' : 'var(--text-muted)';
    tabExp.style.fontWeight = isExp ? '700' : '600';
  }
  if (tabReq) {
    tabReq.style.background = !isExp ? 'linear-gradient(135deg,#0284C7,#0EA5E9)' : 'var(--surface)';
    tabReq.style.color      = !isExp ? '#fff' : 'var(--text-muted)';
    tabReq.style.fontWeight = !isExp ? '700' : '600';
  }
  if (isExp) renderExpenses(); else renderExpRequest();
}
window.switchExpTab = switchExpTab;

// ── Filters ──
function populateExpFilters() {
  document.getElementById('exp-month-filter').value = new Date().toISOString().slice(0,7);
  // ensure tab starts on "ការចំណាយទូទៅ" and update badge
  switchExpTab('expenses');
  updateExpReqBadge();
}
function clearExpFilters() {
  document.getElementById('exp-search').value = '';
  document.getElementById('exp-cat-filter').value = '';
  document.getElementById('exp-status-filter').value = '';
  document.getElementById('exp-month-filter').value = '';
  renderExpenses();
}

// ── Render ──
function renderExpenses() {
  const search = (document.getElementById('exp-search')?.value||'').toLowerCase();
  const cat    = document.getElementById('exp-cat-filter')?.value||'';
  const status = document.getElementById('exp-status-filter')?.value||'';
  const month  = document.getElementById('exp-month-filter')?.value||'';

  let list = getExpenses();
  if (search) list = list.filter(e => (e.title||'').toLowerCase().includes(search) || (e.payer||'').toLowerCase().includes(search) || (e.note||'').toLowerCase().includes(search));
  if (cat)    list = list.filter(e => e.category === cat);
  if (status) list = list.filter(e => e.status === status);
  if (month)  list = list.filter(e => (e.date||'').startsWith(month));

  // KPI — income/expense/balance model
  const fundPool   = getExpFundPool();
  const pendingCnt = list.filter(e=>e.status==='pending').length;
  const balColor   = fundPool.balance < 0 ? '#DC2626' : '#059669';
  const balBg      = fundPool.balance < 0 ? '#FEF2F2' : '#F0FDF4';

  const kpiEl = document.getElementById('exp-kpi-strip');
  if (kpiEl) kpiEl.innerHTML = `
    <div style="background:var(--surface);border-radius:var(--radius);padding:16px;border:1.5px solid var(--border);box-shadow:var(--shadow);display:flex;align-items:center;gap:12px;border-top:3px solid #059669;">
      <div style="width:42px;height:42px;border-radius:10px;background:#F0FDF4;display:flex;align-items:center;justify-content:center;font-size:20px;flex-shrink:0;">📥</div>
      <div><div style="font-size:20px;font-weight:800;color:#059669;">+$${fundPool.income.toFixed(2)}</div><div style="font-size:11px;color:var(--text-muted);margin-top:1px;">ចំណូល (ស្នើប្រាក់ approved)</div></div>
    </div>
    <div style="background:var(--surface);border-radius:var(--radius);padding:16px;border:1.5px solid var(--border);box-shadow:var(--shadow);display:flex;align-items:center;gap:12px;border-top:3px solid #DC2626;">
      <div style="width:42px;height:42px;border-radius:10px;background:#FEF2F2;display:flex;align-items:center;justify-content:center;font-size:20px;flex-shrink:0;">📤</div>
      <div><div style="font-size:20px;font-weight:800;color:#DC2626;">−$${fundPool.expense.toFixed(2)}</div><div style="font-size:11px;color:var(--text-muted);margin-top:1px;">ចំណាយ (expenses approved)</div></div>
    </div>
    <div style="background:var(--surface);border-radius:var(--radius);padding:16px;border:1.5px solid var(--border);box-shadow:var(--shadow);display:flex;align-items:center;gap:12px;border-top:3px solid ${balColor};">
      <div style="width:42px;height:42px;border-radius:10px;background:${balBg};display:flex;align-items:center;justify-content:center;font-size:20px;flex-shrink:0;">💰</div>
      <div><div style="font-size:20px;font-weight:800;color:${balColor};">${fundPool.balance < 0 ? '−' : '+'}$${Math.abs(fundPool.balance).toFixed(2)}</div><div style="font-size:11px;color:var(--text-muted);margin-top:1px;">សមតុល្យ (ចំណូល − ចំណាយ)</div></div>
    </div>
    <div style="background:var(--surface);border-radius:var(--radius);padding:16px;border:1.5px solid var(--border);box-shadow:var(--shadow);display:flex;align-items:center;gap:12px;border-top:3px solid #D97706;">
      <div style="width:42px;height:42px;border-radius:10px;background:#FFFBEB;display:flex;align-items:center;justify-content:center;font-size:20px;flex-shrink:0;">⏳</div>
      <div><div style="font-size:20px;font-weight:800;color:#D97706;">${pendingCnt} ករណី</div><div style="font-size:11px;color:var(--text-muted);margin-top:1px;">ចំណាយរង់ចាំអនុម័ត</div></div>
    </div>`;

  // Table
  const container = document.getElementById('exp-container');
  if (!container) return;
  if (!list.length) {
    container.innerHTML = `<div class="empty-state large"><i class="fas fa-receipt"></i><p>មិនទាន់មានការចំណាយ</p><p style="font-size:12px;color:var(--text-muted);">ចុចប៊ូតុង "បន្ថែមការចំណាយ" ដើម្បីចាប់ផ្ដើម</p></div>`;
    return;
  }
  const sorted = [...list].sort((a,b)=>(b.date||'').localeCompare(a.date||''));
  const totalAmt = sorted.filter(e=>e.status==='approved').reduce((s,e)=>s+(parseFloat(e.amount)||0),0);
  container.innerHTML = `
    <div style="background:var(--surface);border-radius:var(--radius-lg);border:1.5px solid var(--border);box-shadow:var(--shadow);overflow:hidden;">
      <div style="overflow-x:auto;">
      <table style="width:100%;border-collapse:collapse;font-size:13.5px;">
        <thead>
          <tr style="background:var(--surface2);border-bottom:2px solid var(--border);">
            <th style="padding:13px 16px;text-align:left;font-size:11px;font-weight:700;color:var(--text-muted);letter-spacing:.8px;text-transform:uppercase;white-space:nowrap;">លេខ</th>
            <th style="padding:13px 16px;text-align:left;font-size:11px;font-weight:700;color:var(--text-muted);letter-spacing:.8px;text-transform:uppercase;">ចំណងជើង</th>
            <th style="padding:13px 16px;text-align:left;font-size:11px;font-weight:700;color:var(--text-muted);letter-spacing:.8px;text-transform:uppercase;white-space:nowrap;">ប្រភេទ</th>
            <th style="padding:13px 16px;text-align:left;font-size:11px;font-weight:700;color:var(--text-muted);letter-spacing:.8px;text-transform:uppercase;white-space:nowrap;">ប្រភព</th>
            <th style="padding:13px 16px;text-align:right;font-size:11px;font-weight:700;color:var(--text-muted);letter-spacing:.8px;text-transform:uppercase;white-space:nowrap;">ចំនួនដក ($)</th>
            <th style="padding:13px 16px;text-align:left;font-size:11px;font-weight:700;color:var(--text-muted);letter-spacing:.8px;text-transform:uppercase;white-space:nowrap;">កាលបរិច្ឆេទ</th>
            <th style="padding:13px 16px;text-align:left;font-size:11px;font-weight:700;color:var(--text-muted);letter-spacing:.8px;text-transform:uppercase;white-space:nowrap;">បង់ដោយ</th>
            <th style="padding:13px 16px;text-align:center;font-size:11px;font-weight:700;color:var(--text-muted);letter-spacing:.8px;text-transform:uppercase;">ស្ថានភាព</th>
            <th style="padding:13px 16px;text-align:center;font-size:11px;font-weight:700;color:var(--text-muted);letter-spacing:.8px;text-transform:uppercase;">សកម្មភាព</th>
          </tr>
        </thead>
        <tbody>
          ${sorted.map((e,i)=>{
            const catColor = EXP_CAT_COLORS[e.category]||'#6B7280';
            const catLabel = EXP_CAT_LABELS[e.category]||e.category||'—';
            const catIcon  = EXP_CAT_ICONS[e.category]||'📦';
            const stColor  = EXP_STATUS_COLORS[e.status]||'#6B7280';
            const stLabel  = EXP_STATUS_LABELS[e.status]||e.status||'—';
            const rowBg    = i%2===0 ? 'background:var(--surface);' : 'background:var(--surface2);';
            const fromReq  = !!e.reqId;
            const srcBadge = fromReq
              ? `<span style="display:inline-flex;align-items:center;gap:4px;background:#0284C718;color:#0284C7;padding:3px 9px;border-radius:20px;font-size:10.5px;font-weight:700;white-space:nowrap;">📨 ${e.reqId}</span>`
              : `<span style="display:inline-flex;align-items:center;gap:4px;background:#6B728018;color:#6B7280;padding:3px 9px;border-radius:20px;font-size:10.5px;font-weight:700;white-space:nowrap;">✏️ ផ្ទាល់</span>`;
            const amtColor  = e.status==='approved' ? '#DC2626' : (e.status==='rejected' ? '#9CA3AF' : '#D97706');
            const amtPrefix = e.status==='approved' ? '−' : '';
            return `
            <tr style="${rowBg}border-bottom:1px solid var(--border);transition:background .15s;" onmouseover="this.style.background='var(--primary-light)'" onmouseout="this.style.background='${i%2===0?'var(--surface)':'var(--surface2)'}'">
              <td style="padding:12px 16px;font-family:monospace;font-size:12px;color:var(--text-muted);font-weight:700;">${e.id}</td>
              <td style="padding:12px 16px;">
                <div style="font-weight:700;color:var(--text);">${e.title||'—'}</div>
                ${e.note?`<div style="font-size:11px;color:var(--text-muted);margin-top:2px;max-width:200px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${e.note}</div>`:''}
              </td>
              <td style="padding:12px 16px;">
                <span style="display:inline-flex;align-items:center;gap:5px;background:${catColor}18;color:${catColor};padding:4px 10px;border-radius:20px;font-size:11.5px;font-weight:700;">
                  ${catIcon} ${catLabel}
                </span>
              </td>
              <td style="padding:12px 16px;">${srcBadge}</td>
              <td style="padding:12px 16px;text-align:right;font-weight:800;color:${amtColor};font-size:14px;">${amtPrefix}$${parseFloat(e.amount||0).toFixed(2)}</td>
              <td style="padding:12px 16px;color:var(--text-muted);font-size:12.5px;white-space:nowrap;">${e.date||'—'}</td>
              <td style="padding:12px 16px;color:var(--text);font-size:12.5px;">${e.payer||'—'}</td>
              <td style="padding:12px 16px;text-align:center;">
                <span style="display:inline-flex;align-items:center;gap:5px;background:${stColor}18;color:${stColor};padding:4px 12px;border-radius:20px;font-size:11.5px;font-weight:700;">
                  ● ${stLabel}
                </span>
              </td>
              <td style="padding:12px 16px;text-align:center;">
                <div style="display:flex;gap:6px;justify-content:center;flex-wrap:nowrap;align-items:center;">
                  ${!fromReq && e.status==='pending'?`
                  <button onclick="expApprove('${e.id}')" title="អនុម័ត" style="width:30px;height:30px;border-radius:7px;border:none;background:#F0FDF4;color:#059669;cursor:pointer;font-size:13px;display:flex;align-items:center;justify-content:center;"><i class="fas fa-check"></i></button>
                  <button onclick="expReject('${e.id}')" title="បដិសេធ" style="width:30px;height:30px;border-radius:7px;border:none;background:#FEF2F2;color:#DC2626;cursor:pointer;font-size:13px;display:flex;align-items:center;justify-content:center;"><i class="fas fa-times"></i></button>`:''}
                  ${fromReq
                    ? `<span title="ចំណាយចូលពីការស្នើ — lock" style="font-size:11px;color:var(--text-muted);display:flex;align-items:center;gap:3px;"><i class="fas fa-lock" style="font-size:10px;"></i> ស្នើ</span>`
                    : `<button onclick="openExpModal('${e.id}')" title="កែ" style="width:30px;height:30px;border-radius:7px;border:none;background:#EEF2FF;color:#3B5BDB;cursor:pointer;font-size:13px;display:flex;align-items:center;justify-content:center;"><i class="fas fa-edit"></i></button>`}
                  <button onclick="deleteExpense('${e.id}')" title="លុប" style="width:30px;height:30px;border-radius:7px;border:none;background:#FEF2F2;color:#B91C1C;cursor:pointer;font-size:13px;display:flex;align-items:center;justify-content:center;"><i class="fas fa-trash"></i></button>
                </div>
              </td>
            </tr>`;
          }).join('')}
        </tbody>
        <tfoot>
          <tr style="background:linear-gradient(90deg,#FEF2F2,#FFF5F5);border-top:2px solid #FECACA;">
            <td colspan="4" style="padding:13px 16px;font-weight:800;color:#DC2626;">
              💸 សរុបដករូបទឹកប្រាក់
              <span style="font-size:11px;color:var(--text-muted);margin-left:8px;font-weight:400;">(${sorted.filter(e=>e.status==='approved').length} ករណីអនុម័ត / ${sorted.length} សរុប)</span>
            </td>
            <td style="padding:13px 16px;text-align:right;font-weight:900;color:#DC2626;font-size:16px;">−$${totalAmt.toFixed(2)}</td>
            <td colspan="4"></td>
          </tr>
        </tfoot>
      </table>
      </div>
    </div>`;
}
// ── Modal ──
function openExpModal(id) {
  const modal = document.getElementById('exp-modal');
  const title = document.getElementById('expm-title');
  document.getElementById('expm-editing').value = id||'';

  // ── Populate approved requests dropdown ──
  const allReq = (function(){ try{ return JSON.parse(localStorage.getItem('hrpro_expreq')||'[]'); }catch(e){return[];} })();
  const allExp = getExpenses();
  const sel = document.getElementById('expm-req-source');
  sel.innerHTML = '<option value="">-- ចំណាយផ្ទាល់ (មិនប្រើ fund) --</option>';
  allReq.filter(r=>r.status==='approved').forEach(r=>{
    const used = allExp.filter(e=>e.reqId===r.id && e.status==='approved').reduce((s,e)=>s+(parseFloat(e.amount)||0),0);
    const bal  = (parseFloat(r.amount)||0) - used;
    const opt  = document.createElement('option');
    opt.value = r.id;
    opt.textContent = r.id + ' · ' + r.title + ' (នៅសល់: $' + bal.toFixed(2) + ')';
    opt.dataset.balance = bal;
    opt.dataset.title   = r.title;
    sel.appendChild(opt);
  });

  if (id) {
    const e = getExpenses().find(x=>x.id===id);
    if (!e) return;
    document.getElementById('expm-title-input').value = e.title||'';
    document.getElementById('expm-date').value         = e.date||'';
    document.getElementById('expm-amount').value       = e.amount||'';
    document.getElementById('expm-category').value     = e.category||'other';
    document.getElementById('expm-payer').value        = e.payer||'';
    document.getElementById('expm-status').value       = e.status||'pending';
    document.getElementById('expm-note').value         = e.note||'';
    sel.value = e.reqId||'';
    title.textContent = 'កែការចំណាយ';
  } else {
    document.getElementById('expm-title-input').value = '';
    document.getElementById('expm-date').value         = new Date().toISOString().split('T')[0];
    document.getElementById('expm-amount').value       = '';
    document.getElementById('expm-category').value     = 'office';
    document.getElementById('expm-payer').value        = '';
    document.getElementById('expm-status').value       = 'pending';
    document.getElementById('expm-note').value         = '';
    sel.value = '';
    title.textContent = 'បន្ថែមការចំណាយ';
  }
  expModalFundChange();
  modal.classList.add('active');
  setTimeout(()=>document.getElementById('expm-title-input')?.focus(), 100);
}
window.openExpModal = openExpModal;

function expModalFundChange() {
  const sel      = document.getElementById('expm-req-source');
  const infoEl   = document.getElementById('expm-fund-balance-info');
  const statusEl = document.getElementById('expm-status');
  // Always show global fund balance
  const pool = getExpFundPool();
  const bal  = pool.balance;
  const color  = bal <= 0 ? '#DC2626' : '#059669';
  const bg     = bal <= 0 ? '#FEF2F2' : '#F0FDF4';
  const border = bal <= 0 ? '#FECACA' : '#BBF7D0';
  infoEl.style.display = '';
  infoEl.style.background = bg;
  infoEl.style.color = color;
  infoEl.style.borderColor = border;
  infoEl.innerHTML = '💰 សមតុល្យ fund នៅសល់: <strong>$' + bal.toFixed(2) + '</strong>' +
    ' <span style="color:var(--text-muted);font-weight:400;">(ចំណូល $' + pool.income.toFixed(2) + ' − ចំណាយ $' + pool.expense.toFixed(2) + ')</span>' +
    (bal <= 0 ? ' <span style="color:#DC2626;font-weight:700;">⚠️ Fund អស់!</span>' : '');
  if (sel.value && statusEl) statusEl.value = 'approved';
}
window.expModalFundChange = expModalFundChange;

function saveExpense() {
  const editing  = document.getElementById('expm-editing').value;
  const title    = document.getElementById('expm-title-input').value.trim();
  const date     = document.getElementById('expm-date').value;
  const amount   = parseFloat(document.getElementById('expm-amount').value)||0;
  const category = document.getElementById('expm-category').value;
  const payer    = document.getElementById('expm-payer').value.trim();
  const status   = document.getElementById('expm-status').value;
  const note     = document.getElementById('expm-note').value.trim();
  const reqId    = document.getElementById('expm-req-source').value || null;

  if (!title)  { showToast('សូមបញ្ចូលចំណងជើង!', 'error'); return; }
  if (!date)   { showToast('សូមជ្រើសកាលបរិច្ឆេទ!', 'error'); return; }
  if (amount <= 0) { showToast('ចំនួនទឹកប្រាក់ត្រូវជាងសូន្យ!', 'error'); return; }

  // ── Validate total fund balance when approving ──
  if (status === 'approved') {
    const pool = getExpFundPool();
    // When editing, exclude current expense from used total
    const currentApproved = editing
      ? (getExpenses().find(e=>e.id===editing)?.status === 'approved' ? parseFloat(getExpenses().find(e=>e.id===editing)?.amount||0) : 0)
      : 0;
    const availBal = pool.balance + currentApproved;
    if (availBal < amount) {
      if (!confirm(
        'សមតុល្យ fund នៅសល់ $' + availBal.toFixed(2) +
        ' តិចជាងការចំណាយ $' + amount.toFixed(2) +
        '!\nតើអ្នកនៅចង់រក្សាទុកដែរទេ?'
      )) return;
    }
  }

  const list = getExpenses();
  if (editing) {
    const idx = list.findIndex(e=>e.id===editing);
    if (idx===-1) { showToast('រកមិនឃើញ!','error'); return; }
    Object.assign(list[idx], { title, date, amount, category, payer, status, note, reqId: reqId||undefined });
    showToast('បានកែការចំណាយរួចរាល់!', 'success');
  } else {
    const obj = { id:expNextId(), title, date, amount, category, payer, status, note, createdAt: new Date().toISOString() };
    if (reqId) obj.reqId = reqId;
    list.push(obj);
    const src = reqId ? ' (ប្រើ fund ' + reqId + ')' : '';
    showToast('បានបន្ថែម "'+title+'"' + src + '!', 'success');
  }
  saveExpenses(list);
  closeModal('exp-modal');
  renderExpenses();
}

function deleteExpense(id) {
  if (!confirm('តើអ្នកចង់លុបការចំណាយនេះ?')) return;
  saveExpenses(getExpenses().filter(e=>e.id!==id));
  showToast('បានលុបរួចរាល់!', 'success');
  renderExpenses();
}

function expApprove(id) {
  const list = getExpenses();
  const idx  = list.findIndex(e=>e.id===id);
  if (idx===-1) return;
  const expense = list[idx];
  const amt     = parseFloat(expense.amount)||0;

  // ── គ្រប់ expense ទាំងអស់ deduct ពី fund pool ──
  const pool = getExpFundPool();
  if (pool.balance < amt) {
    if (!confirm(
      'សមតុល្យ fund នៅសល់ $' + pool.balance.toFixed(2) +
      ' តិចជាងការចំណាយ $' + amt.toFixed(2) +
      '!\nតើអ្នកនៅចង់អនុម័តដែរទេ?'
    )) return;
  }
  list[idx].status = 'approved';
  saveExpenses(list);
  const newBal = pool.balance - amt;
  showToast('បានអនុម័ត! សមតុល្យ fund នៅសល់: $' + newBal.toFixed(2), 'success');
  renderExpenses();
}

function expReject(id) {
  const list = getExpenses();
  const idx  = list.findIndex(e=>e.id===id);
  if (idx===-1) return;
  list[idx].status = 'rejected';
  saveExpenses(list);
  showToast('បានបដិសេធ!', 'warning');
  renderExpenses();
}

function exportExpExcel() {
  const list = getExpenses();
  if (!list.length) { showToast('គ្មានទិន្នន័យ!','error'); return; }
  const ws_data = [
    ['លេខ','ចំណងជើង','ប្រភេទ','ចំនួន ($)','កាលបរិច្ឆេទ','បង់ដោយ','ស្ថានភាព','កំណត់ចំណាំ'],
    ...list.map(e=>[e.id, e.title, EXP_CAT_LABELS[e.category]||e.category, e.amount, e.date, e.payer, EXP_STATUS_LABELS[e.status]||e.status, e.note])
  ];
  try {
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(ws_data), 'Expenses');
    XLSX.writeFile(wb, 'expenses.xlsx');
    showToast('Export Excel ជោគជ័យ!','success');
  } catch(err) { showToast('Export បរាជ័យ!','error'); }
}

// ── Shared HTML builder for both PDF & Print (Expenses page) ──
function buildExpHTML(list) {
  const total    = list.reduce((s,e)=>s+(parseFloat(e.amount)||0),0);
  const approved = list.filter(e=>e.status==='approved').reduce((s,e)=>s+(parseFloat(e.amount)||0),0);
  const pending  = list.filter(e=>e.status==='pending').reduce((s,e)=>s+(parseFloat(e.amount)||0),0);
  const rejected = list.filter(e=>e.status==='rejected').length;
  const sorted   = [...list].sort((a,b)=>(b.date||'').localeCompare(a.date||''));

  const catTotals = {};
  list.forEach(e=>{ catTotals[e.category]=(catTotals[e.category]||0)+(parseFloat(e.amount)||0); });
  const sortedCats = Object.entries(catTotals).sort((a,b)=>b[1]-a[1]);
  const maxCat = Math.max(...Object.values(catTotals),1);

  const catBars = sortedCats.map(([cat,amt])=>{
    const color=EXP_CAT_COLORS[cat]||'#6B7280', label=EXP_CAT_LABELS[cat]||cat, icon=EXP_CAT_ICONS[cat]||'📦';
    const pct=(amt/maxCat*100).toFixed(1), ppct=(amt/total*100).toFixed(1);
    return `<div style="margin-bottom:10px;">
      <div style="display:flex;justify-content:space-between;font-size:11.5px;margin-bottom:4px;">
        <span style="font-weight:600;color:#1A1F36;">${icon} ${label}</span>
        <span style="font-weight:700;color:${color};">$${amt.toFixed(2)} <span style="color:#8896B3;font-weight:400;">(${ppct}%)</span></span>
      </div>
      <div style="background:#ede9fe;border-radius:8px;height:10px;overflow:hidden;">
        <div style="height:100%;background:${color};border-radius:8px;width:${pct}%;"></div>
      </div>
    </div>`;
  }).join('') || '<div style="color:#8896B3;font-size:12px;padding:10px 0;">គ្មានទិន្នន័យ</div>';

  const detailRows = sorted.map((e,i)=>{
    const catLabel=EXP_CAT_LABELS[e.category]||e.category||'—';
    const catColor=EXP_CAT_COLORS[e.category]||'#6B7280';
    const catIcon=EXP_CAT_ICONS[e.category]||'📦';
    const stLabel=EXP_STATUS_LABELS[e.status]||e.status||'—';
    const stColor=EXP_STATUS_COLORS[e.status]||'#6B7280';
    return `<tr style="background:${i%2===0?'#fff':'#faf5ff'};">
      <td>${e.id}</td>
      <td style="font-weight:600;">${e.title||'—'}</td>
      <td><span class="badge" style="background:${catColor}18;color:${catColor};">${catIcon} ${catLabel}</span></td>
      <td class="num" style="color:#7C3AED;font-weight:800;">$${parseFloat(e.amount||0).toFixed(2)}</td>
      <td class="muted">${e.date||'—'}</td>
      <td>${e.payer||'—'}</td>
      <td style="text-align:center;"><span class="badge" style="background:${stColor}18;color:${stColor};">● ${stLabel}</span></td>
      <td class="muted" style="max-width:120px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${e.note||'—'}</td>
    </tr>`;
  }).join('');

  return { total, approved, pending, rejected, sorted, catBars, detailRows };
}

function expPdfHtml(list, title, subtitle) {
  const { total, approved, pending, rejected, sorted, catBars, detailRows } = buildExpHTML(list);
  return `
  <div id="exp-doc" style="width:1060px;padding:32px 38px;font-family:'Kantumruy Pro','Battambang',sans-serif;color:#1A1F36;line-height:1.6;background:#fff;">
    <style>
      table{width:100%;border-collapse:collapse;}
      th{padding:9px 11px;text-align:left;color:#fff;font-size:11px;font-weight:700;}
      td{padding:7px 11px;border-bottom:1px solid #ede9fe;font-size:12px;vertical-align:middle;}
      .num{text-align:right;}
      .muted{color:#5A6480;font-size:11px;}
      .badge{display:inline-block;padding:2px 9px;border-radius:20px;font-size:10.5px;font-weight:700;white-space:nowrap;}
      .sec-title{font-size:13px;font-weight:800;color:#7C3AED;margin:22px 0 10px;display:flex;align-items:center;gap:7px;border-left:4px solid #7C3AED;padding-left:10px;}
    </style>

    <!-- ════ HEADER ════ -->
    <div style="display:flex;justify-content:space-between;align-items:flex-start;border-bottom:3px solid #7C3AED;padding-bottom:16px;margin-bottom:20px;">
      <div style="display:flex;align-items:center;gap:13px;">
        <div style="width:48px;height:48px;border-radius:13px;background:linear-gradient(135deg,#7C3AED,#A855F7);display:flex;align-items:center;justify-content:center;font-size:24px;flex-shrink:0;">📊</div>
        <div>
          <div style="font-size:21px;font-weight:800;color:#7C3AED;">${title}</div>
          <div style="font-size:12px;color:#8896B3;margin-top:2px;">${subtitle}</div>
        </div>
      </div>
      <div style="text-align:right;font-size:11px;color:#8896B3;line-height:2.1;">
        <div>📅 <strong style="color:#1A1F36;">${new Date().toLocaleDateString('km-KH',{year:'numeric',month:'long',day:'numeric'})}</strong></div>
        <div>📋 <strong style="color:#7C3AED;">${sorted.length} ការចំណាយ</strong></div>
      </div>
    </div>

    <!-- ════ SECTION 1: របាយការណ៍ការចំណាយទូទៅ ════ -->
    <div class="sec-title">📊 របាយការណ៍ការចំណាយទូទៅ</div>

    <!-- KPI Cards -->
    <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:20px;">
      <div style="background:#f3e8ff;border-radius:10px;padding:14px 16px;border-left:4px solid #7C3AED;">
        <div style="font-size:21px;font-weight:800;color:#7C3AED;">$${total.toFixed(2)}</div>
        <div style="font-size:11px;color:#9333EA;margin-top:3px;">💸 សរុបការចំណាយ</div>
      </div>
      <div style="background:#f0fdf4;border-radius:10px;padding:14px 16px;border-left:4px solid #059669;">
        <div style="font-size:21px;font-weight:800;color:#059669;">$${approved.toFixed(2)}</div>
        <div style="font-size:11px;color:#059669;margin-top:3px;">✅ បានអនុម័ត</div>
      </div>
      <div style="background:#fffbeb;border-radius:10px;padding:14px 16px;border-left:4px solid #D97706;">
        <div style="font-size:21px;font-weight:800;color:#D97706;">$${pending.toFixed(2)}</div>
        <div style="font-size:11px;color:#D97706;margin-top:3px;">⏳ រង់ចាំ</div>
      </div>
      <div style="background:#fef2f2;border-radius:10px;padding:14px 16px;border-left:4px solid #DC2626;">
        <div style="font-size:21px;font-weight:800;color:#DC2626;">${rejected} ករណី</div>
        <div style="font-size:11px;color:#DC2626;margin-top:3px;">❌ បដិសេធ</div>
      </div>
    </div>

    <!-- Chart by Category -->
    <div style="background:#faf5ff;border-radius:12px;padding:18px 20px;border:1px solid #ede9fe;margin-bottom:6px;">
      <div style="font-size:12px;font-weight:700;color:#7C3AED;margin-bottom:13px;">📊 ការចំណាយតាមប្រភេទ</div>
      ${catBars}
    </div>

    <!-- ════ SECTION 2: លម្អិតការចំណាយ ════ -->
    <div class="sec-title" style="margin-top:26px;">📋 លម្អិតការចំណាយ</div>
    <table>
      <thead>
        <tr style="background:linear-gradient(135deg,#7C3AED,#A855F7);">
          <th style="border-radius:8px 0 0 0;">លេខ</th>
          <th>ចំណងជើង</th>
          <th>ប្រភេទ</th>
          <th class="num">ចំនួន ($)</th>
          <th>កាលបរិច្ឆេទ</th>
          <th>បង់ដោយ</th>
          <th>ស្ថានភាព</th>
          <th style="border-radius:0 8px 0 0;">កំណត់ចំណាំ</th>
        </tr>
      </thead>
      <tbody>${detailRows}</tbody>
      <tfoot>
        <tr style="background:#f3e8ff;border-top:2px solid #7C3AED;">
          <td colspan="3" style="font-weight:800;font-size:12.5px;color:#1A1F36;">សរុប (${sorted.length} ចំណាយ)</td>
          <td class="num" style="font-weight:800;color:#7C3AED;font-size:15px;">$${total.toFixed(2)}</td>
          <td colspan="4"></td>
        </tr>
      </tfoot>
    </table>

    <!-- Footer -->
    <div style="margin-top:20px;padding-top:10px;border-top:1px solid #ede9fe;display:flex;justify-content:space-between;font-size:10px;color:#aab4d0;">
      <span>🏢 HRPro System</span>
      <span>បង្កើតដោយ HRPro · ${new Date().toLocaleString('km-KH')}</span>
    </div>
  </div>`;
}

function renderExpDocToPDF(htmlContent, filename) {
  const wrap = document.createElement('div');
  wrap.style.cssText = 'position:fixed;left:-9999px;top:0;z-index:-1;';
  wrap.innerHTML = htmlContent;
  document.body.appendChild(wrap);
  const el = wrap.querySelector('#exp-doc');
  document.fonts.ready.then(()=>{
    html2canvas(el, { scale:2, useCORS:true, allowTaint:true, backgroundColor:'#ffffff', logging:false })
    .then(canvas=>{
      document.body.removeChild(wrap);
      const { jsPDF } = window.jspdf;
      const pdfW=297, pdfH=210;
      const imgW=canvas.width, imgH=canvas.height;
      const pageHeightPx = Math.floor((pdfH/pdfW)*imgW);
      const pageCount = Math.ceil(imgH/pageHeightPx);
      const doc = new jsPDF({ orientation:'landscape', unit:'mm', format:'a4' });
      for (let p=0; p<pageCount; p++) {
        if (p>0) doc.addPage();
        const sc = document.createElement('canvas');
        sc.width = imgW;
        sc.height = Math.min(pageHeightPx, imgH - p*pageHeightPx);
        sc.getContext('2d').drawImage(canvas, 0, p*pageHeightPx, imgW, sc.height, 0, 0, imgW, sc.height);
        const sliceH = (sc.height/imgW)*pdfW;
        doc.addImage(sc.toDataURL('image/jpeg',0.95), 'JPEG', 0, 0, pdfW, sliceH);
      }
      doc.save(filename);
      showToast('Export PDF ជោគជ័យ!','success');
    }).catch(err=>{ document.body.removeChild(wrap); showToast('Export PDF បរាជ័យ!','error'); console.error(err); });
  });
}

function renderExpDocToPrint(htmlContent, pageTitle) {
  const win = window.open('','_blank','width=1200,height=820');
  win.document.write(`<!DOCTYPE html><html><head><meta charset="UTF-8"/>
    <title>${pageTitle}</title>
    <link href="https://fonts.googleapis.com/css2?family=Kantumruy+Pro:wght@400;600;700;800&display=swap" rel="stylesheet"/>
    <style>
      *{box-sizing:border-box;margin:0;padding:0;}
      body{font-family:'Kantumruy Pro','Battambang',sans-serif;background:#fff;color:#1A1F36;}
      .no-print{text-align:center;padding:18px;background:#f8f5ff;border-bottom:1px solid #ede9fe;}
      .no-print button{background:#7C3AED;color:#fff;border:none;padding:10px 28px;border-radius:8px;font-size:14px;cursor:pointer;font-family:inherit;margin:0 5px;}
      .no-print button.sec{background:#e2e8f0;color:#333;}
      @media print{.no-print{display:none!important;} body{padding:0;}}
    </style></head><body>
    <div class="no-print">
      <button onclick="window.print()">🖨️ បោះពុម្ព</button>
      <button class="sec" onclick="window.close()">✕ បិទ</button>
    </div>
    ${htmlContent}
  </body></html>`);
  win.document.close();
}

function exportExpPDF() {
  const list = getExpenses();
  if (!list.length) { showToast('គ្មានទិន្នន័យ!','error'); return; }
  showToast('កំពុងបង្កើត PDF...','info');

  renderExpDocToPDF(expPdfHtml(list,'💸 ការចំណាយទូទៅ','General Expenses · ការចំណាយទូទៅ'), 'expenses_report.pdf');
}

function printExpenses() {
  const list = getExpenses();
  if (!list.length) { showToast('គ្មានទិន្នន័យ!','error'); return; }
  renderExpDocToPrint(expPdfHtml(list,'💸 ការចំណាយទូទៅ','General Expenses · ការចំណាយទូទៅ'), 'ការចំណាយទូទៅ');
}

// ── Expense Report Page Functions ──
function initExpReport() {
  const now = new Date();
  const ym  = now.toISOString().slice(0,7);
  const from = new Date(now.getFullYear(), now.getMonth()-2, 1).toISOString().slice(0,7);
  document.getElementById('rpt-exp-from').value = from;
  document.getElementById('rpt-exp-to').value   = ym;
  renderExpReport();
}

function clearExpReportFilters() {
  const now = new Date();
  document.getElementById('rpt-exp-from').value   = new Date(now.getFullYear(), now.getMonth()-2, 1).toISOString().slice(0,7);
  document.getElementById('rpt-exp-to').value     = now.toISOString().slice(0,7);
  document.getElementById('rpt-exp-cat').value    = '';
  document.getElementById('rpt-exp-status').value = '';
  renderExpReport();
}

function getExpReportFiltered() {
  const from   = document.getElementById('rpt-exp-from')?.value||'';
  const to     = document.getElementById('rpt-exp-to')?.value||'';
  const cat    = document.getElementById('rpt-exp-cat')?.value||'';
  const status = document.getElementById('rpt-exp-status')?.value||'';
  let list = getExpenses();
  if (from)   list = list.filter(e=>(e.date||'').slice(0,7) >= from);
  if (to)     list = list.filter(e=>(e.date||'').slice(0,7) <= to);
  if (cat)    list = list.filter(e=>e.category===cat);
  if (status) list = list.filter(e=>e.status===status);
  return list;
}

function renderExpReport() {
  const list = getExpReportFiltered();
  const total    = list.reduce((s,e)=>s+(parseFloat(e.amount)||0),0);
  const approved = list.filter(e=>e.status==='approved').reduce((s,e)=>s+(parseFloat(e.amount)||0),0);
  const pending  = list.filter(e=>e.status==='pending').reduce((s,e)=>s+(parseFloat(e.amount)||0),0);
  const rejected = list.filter(e=>e.status==='rejected').length;

  // KPI
  const kpiEl = document.getElementById('rpt-exp-kpi');
  if (kpiEl) kpiEl.innerHTML = [
    {ico:'💸',lbl:'សរុបការចំណាយ',val:'$'+total.toFixed(2),color:'#7C3AED',bg:'#F3E8FF'},
    {ico:'✅',lbl:'បានអនុម័ត',val:'$'+approved.toFixed(2),color:'#059669',bg:'#F0FDF4'},
    {ico:'⏳',lbl:'រង់ចាំ',val:'$'+pending.toFixed(2),color:'#D97706',bg:'#FFFBEB'},
    {ico:'❌',lbl:'ចំនួនបដិសេធ',val:rejected+' ករណី',color:'#DC2626',bg:'#FEF2F2'},
    {ico:'📋',lbl:'ចំនួនសរុប',val:list.length+' ករណី',color:'#1971C2',bg:'#EFF6FF'},
  ].map(k=>`<div style="background:var(--surface);border-radius:var(--radius);padding:16px;border:1.5px solid var(--border);box-shadow:var(--shadow);display:flex;align-items:center;gap:12px;border-top:3px solid ${k.color};">
    <div style="width:42px;height:42px;border-radius:10px;background:${k.bg};display:flex;align-items:center;justify-content:center;font-size:20px;flex-shrink:0;">${k.ico}</div>
    <div><div style="font-size:20px;font-weight:800;color:${k.color};">${k.val}</div><div style="font-size:11px;color:var(--text-muted);margin-top:1px;">${k.lbl}</div></div>
  </div>`).join('');

  // Category Bar Chart
  const catEl = document.getElementById('rpt-exp-cat-bars');
  if (catEl) {
    const catTotals = {};
    list.forEach(e=>{ catTotals[e.category]=(catTotals[e.category]||0)+(parseFloat(e.amount)||0); });
    const maxCat = Math.max(...Object.values(catTotals),1);
    const sortedCats = Object.entries(catTotals).sort((a,b)=>b[1]-a[1]);
    if (!sortedCats.length) { catEl.innerHTML='<div style="text-align:center;color:var(--text-muted);padding:20px;font-size:12px;">គ្មានទិន្នន័យ</div>'; }
    else catEl.innerHTML = sortedCats.map(([cat,amt])=>{
      const color = EXP_CAT_COLORS[cat]||'#6B7280';
      const label = EXP_CAT_LABELS[cat]||cat;
      const icon  = EXP_CAT_ICONS[cat]||'📦';
      const pct   = (amt/maxCat*100).toFixed(1);
      return `<div style="margin-bottom:10px;">
        <div style="display:flex;justify-content:space-between;margin-bottom:4px;font-size:12px;">
          <span style="color:var(--text);font-weight:600;">${icon} ${label}</span>
          <span style="color:${color};font-weight:700;">$${amt.toFixed(2)}</span>
        </div>
        <div style="background:var(--border);border-radius:10px;height:10px;overflow:hidden;">
          <div style="height:100%;background:${color};border-radius:10px;width:${pct}%;transition:width .6s ease;"></div>
        </div>
      </div>`;
    }).join('');
  }

  // Monthly Bar Chart
  const monthEl = document.getElementById('rpt-exp-month-bars');
  if (monthEl) {
    const monthTotals = {};
    list.forEach(e=>{ const m=(e.date||'').slice(0,7); if(m) monthTotals[m]=(monthTotals[m]||0)+(parseFloat(e.amount)||0); });
    const months = Object.keys(monthTotals).sort();
    const maxM = Math.max(...Object.values(monthTotals),1);
    if (!months.length) { monthEl.innerHTML='<div style="text-align:center;color:var(--text-muted);padding:20px;font-size:12px;">គ្មានទិន្នន័យ</div>'; }
    else monthEl.innerHTML = months.map(m=>{
      const amt = monthTotals[m];
      const pct = (amt/maxM*100).toFixed(1);
      const [yr,mn] = m.split('-');
      const mLabel = `${mn}/${yr}`;
      return `<div style="margin-bottom:10px;">
        <div style="display:flex;justify-content:space-between;margin-bottom:4px;font-size:12px;">
          <span style="color:var(--text);font-weight:600;">📅 ${mLabel}</span>
          <span style="color:#1971C2;font-weight:700;">$${amt.toFixed(2)}</span>
        </div>
        <div style="background:var(--border);border-radius:10px;height:10px;overflow:hidden;">
          <div style="height:100%;background:linear-gradient(90deg,#1971C2,#339AF0);border-radius:10px;width:${pct}%;transition:width .6s ease;"></div>
        </div>
      </div>`;
    }).join('');
  }

  // Detail Table
  const tableEl = document.getElementById('rpt-exp-table');
  if (!tableEl) return;
  if (!list.length) {
    tableEl.innerHTML='<div class="empty-state large"><i class="fas fa-chart-bar"></i><p>គ្មានទិន្នន័យក្នុងខែដែលបានជ្រើស</p></div>';
    return;
  }
  const sorted = [...list].sort((a,b)=>(b.date||'').localeCompare(a.date||''));
  tableEl.innerHTML = `
    <div style="background:var(--surface);border-radius:var(--radius-lg);border:1.5px solid var(--border);box-shadow:var(--shadow);overflow:hidden;">
      <div style="padding:16px 20px;border-bottom:1.5px solid var(--border);display:flex;align-items:center;gap:8px;">
        <i class="fas fa-list" style="color:#7C3AED;"></i>
        <span style="font-size:.88rem;font-weight:700;color:var(--text);">តារាងលម្អិត (${sorted.length} ចំណាយ)</span>
      </div>
      <div style="overflow-x:auto;">
      <table style="width:100%;border-collapse:collapse;font-size:13px;">
        <thead>
          <tr style="background:var(--surface2);border-bottom:2px solid var(--border);">
            <th style="padding:11px 14px;text-align:left;font-size:11px;font-weight:700;color:var(--text-muted);text-transform:uppercase;letter-spacing:.6px;">លេខ</th>
            <th style="padding:11px 14px;text-align:left;font-size:11px;font-weight:700;color:var(--text-muted);text-transform:uppercase;letter-spacing:.6px;">ចំណងជើង</th>
            <th style="padding:11px 14px;text-align:left;font-size:11px;font-weight:700;color:var(--text-muted);text-transform:uppercase;letter-spacing:.6px;">ប្រភេទ</th>
            <th style="padding:11px 14px;text-align:right;font-size:11px;font-weight:700;color:var(--text-muted);text-transform:uppercase;letter-spacing:.6px;">ចំនួន ($)</th>
            <th style="padding:11px 14px;text-align:left;font-size:11px;font-weight:700;color:var(--text-muted);text-transform:uppercase;letter-spacing:.6px;">ថ្ងៃ</th>
            <th style="padding:11px 14px;text-align:left;font-size:11px;font-weight:700;color:var(--text-muted);text-transform:uppercase;letter-spacing:.6px;">បង់ដោយ</th>
            <th style="padding:11px 14px;text-align:center;font-size:11px;font-weight:700;color:var(--text-muted);text-transform:uppercase;letter-spacing:.6px;">ស្ថានភាព</th>
          </tr>
        </thead>
        <tbody>
          ${sorted.map((e,i)=>{
            const catLabel=EXP_CAT_LABELS[e.category]||e.category||'—';
            const catColor=EXP_CAT_COLORS[e.category]||'#6B7280';
            const catIcon=EXP_CAT_ICONS[e.category]||'📦';
            const stLabel=EXP_STATUS_LABELS[e.status]||e.status||'—';
            const stColor=EXP_STATUS_COLORS[e.status]||'#6B7280';
            const rowBg=i%2===0?'var(--surface)':'var(--surface2)';
            return `<tr style="background:${rowBg};border-bottom:1px solid var(--border);">
              <td style="padding:10px 14px;font-family:monospace;font-size:11px;color:var(--text-muted);font-weight:700;">${e.id}</td>
              <td style="padding:10px 14px;font-weight:600;color:var(--text);">${e.title||'—'}</td>
              <td style="padding:10px 14px;"><span style="background:${catColor}18;color:${catColor};padding:3px 9px;border-radius:20px;font-size:11px;font-weight:700;">${catIcon} ${catLabel}</span></td>
              <td style="padding:10px 14px;text-align:right;font-weight:800;color:#7C3AED;">$${parseFloat(e.amount||0).toFixed(2)}</td>
              <td style="padding:10px 14px;color:var(--text-muted);font-size:12px;">${e.date||'—'}</td>
              <td style="padding:10px 14px;color:var(--text);font-size:12px;">${e.payer||'—'}</td>
              <td style="padding:10px 14px;text-align:center;"><span style="background:${stColor}18;color:${stColor};padding:3px 10px;border-radius:20px;font-size:11px;font-weight:700;">● ${stLabel}</span></td>
            </tr>`;
          }).join('')}
        </tbody>
        <tfoot>
          <tr style="background:var(--primary-light);border-top:2px solid var(--border);">
            <td colspan="3" style="padding:11px 14px;font-weight:800;color:var(--text);">សរុប (${sorted.length} ចំណាយ)</td>
            <td style="padding:11px 14px;text-align:right;font-weight:800;color:#7C3AED;font-size:15px;">$${sorted.reduce((s,e)=>s+(parseFloat(e.amount)||0),0).toFixed(2)}</td>
            <td colspan="3"></td>
          </tr>
        </tfoot>
      </table>
      </div>
    </div>`;
}

function exportExpReportExcel() {
  const list = getExpReportFiltered();
  if (!list.length) { showToast('គ្មានទិន្នន័យ!','error'); return; }
  const catTotals = {}; list.forEach(e=>{ catTotals[e.category]=(catTotals[e.category]||0)+(parseFloat(e.amount)||0); });
  const ws_data = [
    ['=== របាយការណ៍ការចំណាយទូទៅ ==='],
    ['ចំណាយសរុប','$'+list.reduce((s,e)=>s+(parseFloat(e.amount)||0),0).toFixed(2)],
    ['បានអនុម័ត','$'+list.filter(e=>e.status==='approved').reduce((s,e)=>s+(parseFloat(e.amount)||0),0).toFixed(2)],
    ['រង់ចាំ','$'+list.filter(e=>e.status==='pending').reduce((s,e)=>s+(parseFloat(e.amount)||0),0).toFixed(2)],
    [],
    ['=== លម្អិតការចំណាយ ==='],
    ['លេខ','ចំណងជើង','ប្រភេទ','ចំនួន ($)','ថ្ងៃ','បង់ដោយ','ស្ថានភាព','កំណត់ចំណាំ'],
    ...list.sort((a,b)=>(b.date||'').localeCompare(a.date||'')).map(e=>[e.id,e.title,EXP_CAT_LABELS[e.category]||e.category,e.amount,e.date,e.payer,EXP_STATUS_LABELS[e.status]||e.status,e.note]),
    [],
    ['=== សង្ខេបតាមប្រភេទ ==='],
    ['ប្រភេទ','ចំនួនសរុប ($)'],
    ...Object.entries(catTotals).sort((a,b)=>b[1]-a[1]).map(([cat,amt])=>[EXP_CAT_LABELS[cat]||cat,'$'+amt.toFixed(2)])
  ];
  try {
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(ws_data), 'Expense Report');
    XLSX.writeFile(wb, 'expense_report.xlsx');
    showToast('Export Excel ជោគជ័យ!','success');
  } catch(err) { showToast('Export បរាជ័យ!','error'); }
}

function exportExpReportPDF() {
  const list = getExpReportFiltered();
  if (!list.length) { showToast('គ្មានទិន្នន័យ!','error'); return; }
  showToast('កំពុងបង្កើត PDF...','info');
  const fromVal = document.getElementById('rpt-exp-from')?.value||'';
  const toVal   = document.getElementById('rpt-exp-to')?.value||'';
  const period  = (fromVal&&toVal) ? `${fromVal} ដល់ ${toVal}` : 'ទាំងអស់';
  renderExpDocToPDF(expPdfHtml(list,'📊 របាយការណ៍ការចំណាយទូទៅ',`General Expenses Report · ${period}`), 'expense_report.pdf');
}

function printExpReport() {
  const list = getExpReportFiltered();
  if (!list.length) { showToast('គ្មានទិន្នន័យ!','error'); return; }
  const fromVal = document.getElementById('rpt-exp-from')?.value||'';
  const toVal   = document.getElementById('rpt-exp-to')?.value||'';
  const period  = (fromVal&&toVal) ? `${fromVal} ដល់ ${toVal}` : 'ទាំងអស់';

  const { total, sorted, detailRows } = buildExpHTML(list);

  const printHtml = `
  <div id="exp-doc" style="width:1060px;padding:32px 38px;font-family:'Kantumruy Pro','Battambang',sans-serif;color:#1A1F36;line-height:1.6;background:#fff;">
    <style>
      table{width:100%;border-collapse:collapse;}
      th{padding:9px 11px;text-align:left;color:#fff;font-size:11px;font-weight:700;}
      td{padding:7px 11px;border-bottom:1px solid #ede9fe;font-size:12px;vertical-align:middle;}
      .num{text-align:right;}
      .muted{color:#5A6480;font-size:11px;}
      .badge{display:inline-block;padding:2px 9px;border-radius:20px;font-size:10.5px;font-weight:700;white-space:nowrap;}
      .sec-title{font-size:13px;font-weight:800;color:#7C3AED;margin:0 0 14px;display:flex;align-items:center;gap:7px;border-left:4px solid #7C3AED;padding-left:10px;}
    </style>

    <!-- ════ HEADER ════ -->
    <div style="display:flex;justify-content:space-between;align-items:flex-start;border-bottom:3px solid #7C3AED;padding-bottom:16px;margin-bottom:22px;">
      <div style="display:flex;align-items:center;gap:13px;">
        <div style="width:52px;height:52px;border-radius:13px;background:linear-gradient(135deg,#7C3AED,#A855F7);display:flex;align-items:center;justify-content:center;font-size:26px;flex-shrink:0;">📊</div>
        <div>
          <div style="font-size:22px;font-weight:800;color:#7C3AED;">របាយការណ៍ការចំណាយទូទៅ</div>
          <div style="font-size:12px;color:#8896B3;margin-top:3px;">General Expenses Report · ${period}</div>
        </div>
      </div>
      <div style="text-align:right;font-size:11px;color:#8896B3;line-height:2.2;">
        <div>📅 <strong style="color:#1A1F36;">${new Date().toLocaleDateString('km-KH',{year:'numeric',month:'long',day:'numeric'})}</strong></div>
        <div>📋 <strong style="color:#7C3AED;">${sorted.length} ការចំណាយ</strong></div>
      </div>
    </div>

    <!-- ════ តារាងលម្អិត ════ -->
    <div class="sec-title">📋 តារាងលម្អិត (${sorted.length} ចំណាយ)</div>
    <table>
      <thead>
        <tr style="background:linear-gradient(135deg,#7C3AED,#A855F7);">
          <th style="border-radius:8px 0 0 0;">លេខ</th>
          <th>ចំណងជើង</th>
          <th>ប្រភេទ</th>
          <th class="num">ចំនួន ($)</th>
          <th>កាលបរិច្ឆេទ</th>
          <th>បង់ដោយ</th>
          <th>ស្ថានភាព</th>
          <th style="border-radius:0 8px 0 0;">កំណត់ចំណាំ</th>
        </tr>
      </thead>
      <tbody>${detailRows}</tbody>
      <tfoot>
        <tr style="background:#f3e8ff;border-top:2px solid #7C3AED;">
          <td colspan="3" style="font-weight:800;font-size:12.5px;color:#1A1F36;">សរុប (${sorted.length} ចំណាយ)</td>
          <td class="num" style="font-weight:800;color:#7C3AED;font-size:15px;">$${total.toFixed(2)}</td>
          <td colspan="4"></td>
        </tr>
      </tfoot>
    </table>

    <!-- Footer -->
    <div style="margin-top:22px;padding-top:10px;border-top:1px solid #ede9fe;display:flex;justify-content:space-between;font-size:10px;color:#aab4d0;">
      <span>🏢 HRPro System</span>
      <span>បង្កើតដោយ HRPro · ${new Date().toLocaleString('km-KH')}</span>
    </div>
  </div>`;

  renderExpDocToPrint(printHtml, 'របាយការណ៍ការចំណាយទូទៅ');
}



/* ── License Section Toggle ── */
let _licSectionHidden = false;

// ---- License Toggle Password Protection ----
const LIC_TOGGLE_PW_KEY = 'hrpro_lic_toggle_pw';
function getLicTogglePw() {
  return localStorage.getItem(LIC_TOGGLE_PW_KEY) || 'admin123';
}

function toggleLicSection() {
  // ត្រូវ verify password មុន toggle
  openLicTogglePwModal();
}

function _doToggleLicSection() {
  _licSectionHidden = !_licSectionHidden;
  const body    = document.getElementById('lic-section-body');
  const icoWrap = document.getElementById('lic-toggle-ico');
  const hideBtn = document.getElementById('lic-hide-btn');
  if (!body) return;
  if (_licSectionHidden) {
    body.style.maxHeight = '0px';
    body.style.opacity   = '0';
    if (icoWrap) icoWrap.style.transform = 'rotate(180deg)';
    if (hideBtn) { hideBtn.style.display = 'none'; }
  } else {
    body.style.maxHeight = '600px';
    body.style.opacity   = '1';
    if (icoWrap) icoWrap.style.transform = 'rotate(0deg)';
    // បង្ហាញប៊ូតុង លាក់ ឡើងវិញ ពេល section បើក
    if (hideBtn) {
      hideBtn.style.display = 'flex';
      hideBtn.innerHTML = '<i class="fas fa-eye-slash"></i> លាក់';
    }
  }
}

function openLicTogglePwModal() {
  const m = document.getElementById('lic-toggle-pw-modal');
  if (!m) return;
  document.getElementById('lic-toggle-pw-input').value = '';
  document.getElementById('lic-toggle-pw-err').style.display = 'none';
  m.style.display = 'flex';
  setTimeout(() => document.getElementById('lic-toggle-pw-input').focus(), 100);
}

function closeLicTogglePwModal() {
  const m = document.getElementById('lic-toggle-pw-modal');
  if (m) m.style.display = 'none';
}

function confirmLicTogglePw() {
  const input = document.getElementById('lic-toggle-pw-input');
  const err   = document.getElementById('lic-toggle-pw-err');
  const val   = input ? input.value : '';
  if (val === getLicTogglePw()) {
    closeLicTogglePwModal();
    _doToggleLicSection();
  } else {
    if (err) {
      err.style.display = 'flex';
      err.querySelector('span').textContent = 'Password មិនត្រឹមត្រូវ! សូមព្យាយាមម្ដងទៀត។';
    }
    if (input) { input.value = ''; input.focus(); }
  }
}

function licToggleEyePw() {
  const inp = document.getElementById('lic-toggle-pw-input');
  const ico = document.getElementById('lic-toggle-pw-eye-ico');
  if (!inp) return;
  if (inp.type === 'password') { inp.type = 'text'; if(ico) ico.className='fas fa-eye-slash'; }
  else                         { inp.type = 'password'; if(ico) ico.className='fas fa-eye'; }
}

function doLogout() {
  currentUser = null;
  localStorage.removeItem('hrpro_remember');
  // Reset login form
  document.getElementById('login-username').value = '';
  document.getElementById('login-password').value = '';
  document.getElementById('login-remember').checked = false;
  document.getElementById('login-error').classList.add('hidden');
  // Remove user chip
  const chip = document.getElementById('topbar-user-chip');
  if (chip) chip.remove();
  // Reset license section back to hidden + hide toggle button
  _licSectionHidden = true;
  const licBody    = document.getElementById('lic-section-body');
  const licIcoWrap = document.getElementById('lic-toggle-ico');
  const licHideBtn = document.getElementById('lic-hide-btn');
  if (licBody)    { licBody.style.maxHeight = '0px'; licBody.style.opacity = '0'; }
  if (licIcoWrap) { licIcoWrap.style.transform = 'rotate(180deg)'; }
  if (licHideBtn) { licHideBtn.style.display = 'none'; }
  // Show login, hide app
  document.getElementById('app-wrapper').classList.remove('visible');
  // Re-check license validity on logout
  if (!checkAndShowLicenseWall()) return;
  document.getElementById('login-screen').classList.remove('hidden');
}

function showLoginError(msg) {
  const el = document.getElementById('login-error');
  document.getElementById('login-error-msg').textContent = msg;
  el.classList.remove('hidden');
}

function togglePwVisibility() {
  const inp  = document.getElementById('login-password');
  const icon = document.getElementById('pw-eye-icon');
  if (inp.type === 'password') {
    inp.type = 'text';
    icon.className = 'fas fa-eye-slash';
  } else {
    inp.type = 'password';
    icon.className = 'fas fa-eye';
  }
}

function fillLogin(user, pw) {
  document.getElementById('login-username').value = user;
  document.getElementById('login-password').value = pw;
  document.getElementById('login-error').classList.add('hidden');
  document.getElementById('login-username').focus();
}

function showForgotHint() {
  showLoginError('💡 សូមប្រើគណនីសាកល្បងខាងក្រោម ឬទាក់ទង Admin!');
}

/* ── Reset Password ── */
let _rpStep = 1;
let _rpAdminUser = null;

function openResetPw() {
  _rpStep = 1;
  _rpAdminUser = null;
  // Clear fields
  ['rp-admin-user','rp-admin-pw','rp-new-pw','rp-confirm-pw'].forEach(id=>{
    const el=document.getElementById(id); if(el) el.value='';
  });
  // Reset strength
  const sb=document.getElementById('rp-strength-bar'); if(sb){sb.style.width='0%';}
  const sl=document.getElementById('rp-strength-lbl'); if(sl) sl.textContent='—';
  // Show step1, hide others
  rpShowStep(1);
  // Populate target users
  rpPopulateUsers();
  document.getElementById('rp-modal').classList.add('open');
  setTimeout(()=>document.getElementById('rp-admin-user')?.focus(), 150);
}

function closeResetPw() {
  document.getElementById('rp-modal').classList.remove('open');
}

function rpShowStep(n) {
  _rpStep = n;
  [1,2,3].forEach(i=>{
    const el=document.getElementById('rp-step'+i);
    if(el) el.classList.toggle('active', i===n);
  });
  // Hide errors
  ['rp-err1','rp-err2'].forEach(id=>{
    const el=document.getElementById(id); if(el) el.style.display='none';
  });
  // Update footer buttons
  const nextBtn  = document.getElementById('rp-next-btn');
  const backBtn  = document.getElementById('rp-back-btn');
  const cancelBtn= document.getElementById('rp-cancel-btn');
  const nextLbl  = document.getElementById('rp-next-lbl');
  const nextIco  = document.getElementById('rp-next-ico');
  if (n===1) {
    backBtn.style.display  = 'none';
    nextBtn.style.display  = '';
    cancelBtn.textContent  = 'បោះបង់';
    nextLbl.textContent    = 'ផ្ទៀងផ្ទាត់';
    nextIco.className      = 'fas fa-arrow-right';
  } else if (n===2) {
    backBtn.style.display  = '';
    nextBtn.style.display  = '';
    nextLbl.textContent    = 'Reset Password';
    nextIco.className      = 'fas fa-key';
  } else {
    backBtn.style.display  = 'none';
    nextBtn.style.display  = 'none';
    cancelBtn.textContent  = 'បិទ';
  }
}

function rpPopulateUsers() {
  const sel = document.getElementById('rp-target-user');
  if (!sel) return;
  const users = getUsers();
  sel.innerHTML = users.map(u=>
    `<option value="${u.username}">${u.name} (${u.username}) — ${u.role}</option>`
  ).join('');
}

function rpNextStep() {
  if (_rpStep===1) rpVerifyAdmin();
  else if (_rpStep===2) rpStep2Next();
  else closeResetPw();
}

function rpGoBack() {
  if (_rpStep===2) rpShowStep(1);
}

function rpShowErr(step, msg) {
  const box = document.getElementById('rp-err'+step);
  const span= document.getElementById('rp-err'+step+'-msg');
  if (box)  { box.style.display='flex'; }
  if (span) span.textContent = msg;
}

function rpVerifyAdmin() {
  const uname = document.getElementById('rp-admin-user').value.trim().toLowerCase();
  const pw    = document.getElementById('rp-admin-pw').value;
  if (!uname||!pw) { rpShowErr(1,'សូមបញ្ចូល Username និង Password!'); return; }
  const users = getUsers();
  const user  = users.find(u=>u.username===uname && u.password===pw);
  if (!user) { rpShowErr(1,'Username ឬ Password មិនត្រឹមត្រូវ!'); return; }
  if (user.role !== 'Admin') { rpShowErr(1,'គណនីនេះមិនមែន Admin! មាន Admin ប៉ុណ្ណោះ ដែលអាច Reset Password បាន។'); return; }
  _rpAdminUser = user;
  rpPopulateUsers();
  rpShowStep(2);
  setTimeout(()=>document.getElementById('rp-new-pw')?.focus(), 150);
}

function rpCheckStrength() {
  const pw  = document.getElementById('rp-new-pw')?.value || '';
  const bar = document.getElementById('rp-strength-bar');
  const lbl = document.getElementById('rp-strength-lbl');
  let score = 0;
  if (pw.length >= 6)  score++;
  if (pw.length >= 10) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  const map = [
    {w:'0%',   c:'#e2e8f0', t:'—'},
    {w:'20%',  c:'#ef4444', t:'ខ្សោយណាស់'},
    {w:'40%',  c:'#f97316', t:'ខ្សោយ'},
    {w:'60%',  c:'#eab308', t:'មធ្យម'},
    {w:'80%',  c:'#22c55e', t:'ល្អ'},
    {w:'100%', c:'#15803d', t:'ខ្លាំងណាស់'},
  ];
  const m = map[score] || map[0];
  if (bar) { bar.style.width=m.w; bar.style.background=m.c; }
  if (lbl) { lbl.textContent=m.t; lbl.style.color=m.c; }
}

function rpStep2Next() {
  const target = document.getElementById('rp-target-user')?.value;
  const newPw  = document.getElementById('rp-new-pw')?.value;
  const confirm= document.getElementById('rp-confirm-pw')?.value;
  if (!target) { rpShowErr(2,'សូមជ្រើសអ្នកប្រើ!'); return; }
  if (!newPw||newPw.length<6) { rpShowErr(2,'Password ត្រូវមានយ៉ាងហោចណាស់ 6 តួ!'); return; }
  if (newPw !== confirm) { rpShowErr(2,'Password មិនផ្គូផ្គង! សូម​确認 ម្ដងទៀត។'); return; }
  // Apply the reset
  const users = getUsers();
  const idx   = users.findIndex(u=>u.username===target);
  if (idx===-1) { rpShowErr(2,'រកមិនឃើញអ្នកប្រើ!'); return; }
  const oldName = users[idx].name;
  users[idx].password = newPw;
  saveUsers(users);
  // Update currentUser if it's themselves
  if (currentUser && currentUser.username===target) {
    currentUser.password = newPw;
    try {
      const rem = JSON.parse(localStorage.getItem('hrpro_remember')||'null');
      if (rem && rem.username===target) {
        rem.password = newPw;
        localStorage.setItem('hrpro_remember', JSON.stringify(rem));
      }
    } catch(e) {}
  }
  // Show success
  const sucEl = document.getElementById('rp-success-msg');
  if (sucEl) sucEl.innerHTML =
    `Password របស់ <strong>${oldName}</strong> (${target}) <br/>ត្រូវបាន Reset ដោយជោគជ័យ!<br/><br/>
     <span style="color:#15803d;font-weight:700;">✓ Username: <code style="background:#f0fdf4;padding:2px 8px;border-radius:5px;">${target}</code></span>`;
  rpShowStep(3);
  showToast('✅ Reset Password ជោគជ័យ!', 'success');
}


function rpToggleEye(inputId, iconId) {
  const inp = document.getElementById(inputId);
  const ico = document.getElementById(iconId);
  if (!inp||!ico) return;
  inp.type = inp.type==='password' ? 'text' : 'password';
  ico.className = inp.type==='password' ? 'fas fa-eye' : 'fas fa-eye-slash';
}

// Close on overlay click — handled by onclick on the overlay div


// ===================================================================
//  EXPENSE REQUEST — ស្នើរប្រាក់ចំណាយ
// ===================================================================

const EXPREQ_URGENCY_LABELS = { normal:'ធម្មតា', urgent:'បន្ទាន់', critical:'បន្ទាន់ខ្លាំង' };
const EXPREQ_URGENCY_COLORS = { normal:'#059669', urgent:'#D97706', critical:'#DC2626' };
const EXPREQ_URGENCY_ICONS  = { normal:'🟢', urgent:'🟡', critical:'🔴' };

function getExpReq()       { try { return JSON.parse(localStorage.getItem('hrpro_expreq')||'[]'); } catch(e){return[];} }
function saveExpReq2(list) { localStorage.setItem('hrpro_expreq', JSON.stringify(list)); }

function expReqNextId() {
  const list = getExpReq();
  if (!list.length) return 'REQ-001';
  const nums = list.map(r => parseInt((r.id||'REQ-000').replace('REQ-',''))||0);
  return 'REQ-' + String(Math.max(...nums)+1).padStart(3,'0');
}

function clearExpReqFilters() {
  document.getElementById('expreq-search').value = '';
  document.getElementById('expreq-cat-filter').value = '';
  document.getElementById('expreq-status-filter').value = '';
  document.getElementById('expreq-month-filter').value = '';
  renderExpRequest();
}

function renderExpRequest() {
  const search = (document.getElementById('expreq-search')?.value||'').toLowerCase();
  const cat    = document.getElementById('expreq-cat-filter')?.value||'';
  const status = document.getElementById('expreq-status-filter')?.value||'';
  const month  = document.getElementById('expreq-month-filter')?.value||'';

  let list = getExpReq();
  if (search) list = list.filter(r => (r.title||'').toLowerCase().includes(search) || (r.requester||'').toLowerCase().includes(search) || (r.dept||'').toLowerCase().includes(search));
  if (cat)    list = list.filter(r => r.category === cat);
  if (status) list = list.filter(r => r.status === status);
  if (month)  list = list.filter(r => (r.date||'').startsWith(month));

  // KPI
  const total    = list.reduce((s,r)=>s+(parseFloat(r.amount)||0),0);
  const approved = list.filter(r=>r.status==='approved').reduce((s,r)=>s+(parseFloat(r.amount)||0),0);
  const pending  = list.filter(r=>r.status==='pending').length;
  const rejected = list.filter(r=>r.status==='rejected').length;

  const kpiEl = document.getElementById('expreq-kpi-strip');
  if (kpiEl) {
    const fp = getExpFundPool();
    const bc = fp.balance < 0 ? '#DC2626' : '#059669';
    const bb = fp.balance < 0 ? '#FEF2F2' : '#F0FDF4';
    kpiEl.innerHTML = [
      {ico:'📨', lbl:'ចំនួនស្នើសរុប',         val:list.length+' ករណី',        color:'#0284C7', bg:'#E0F2FE'},
      {ico:'📥', lbl:'ចំណូល fund (approved)', val:'+$'+fp.income.toFixed(2),   color:'#059669', bg:'#F0FDF4'},
      {ico:'📤', lbl:'ចំណាយ (expenses)',       val:'-$'+fp.expense.toFixed(2),  color:'#DC2626', bg:'#FEF2F2'},
      {ico:'💰', lbl:'សមតុល្យ fund',            val:(fp.balance<0?'-':'+')+'$'+Math.abs(fp.balance).toFixed(2), color:bc, bg:bb},
    ].map(k=>`
      <div style="background:var(--surface);border-radius:var(--radius);padding:16px;border:1.5px solid var(--border);box-shadow:var(--shadow);display:flex;align-items:center;gap:12px;border-top:3px solid ${k.color};">
        <div style="width:42px;height:42px;border-radius:10px;background:${k.bg};display:flex;align-items:center;justify-content:center;font-size:20px;flex-shrink:0;">${k.ico}</div>
        <div><div style="font-size:20px;font-weight:800;color:${k.color};">${k.val}</div><div style="font-size:11px;color:var(--text-muted);margin-top:1px;">${k.lbl}</div></div>
      </div>`).join('');
  }

  const container = document.getElementById('expreq-container');
  if (!container) return;
  updateExpReqBadge();
  if (!list.length) {
    container.innerHTML = `<div class="empty-state large"><i class="fas fa-paper-plane"></i><p>មិនទាន់មានការស្នើ</p><p style="font-size:12px;color:var(--text-muted);">ចុចប៊ូតុង "ស្នើរថ្មី" ដើម្បីចាប់ផ្ដើម</p></div>`;
    return;
  }
  const sorted = [...list].sort((a,b)=>(b.createdAt||'').localeCompare(a.createdAt||''));

  container.innerHTML = `
    <div style="background:var(--surface);border-radius:var(--radius-lg);border:1.5px solid var(--border);box-shadow:var(--shadow);overflow:hidden;">
      <div style="overflow-x:auto;">
      <table style="width:100%;border-collapse:collapse;font-size:13.5px;">
        <thead>
          <tr style="background:var(--surface2);border-bottom:2px solid var(--border);">
            <th style="padding:13px 16px;text-align:left;font-size:11px;font-weight:700;color:var(--text-muted);letter-spacing:.8px;text-transform:uppercase;white-space:nowrap;">លេខ</th>
            <th style="padding:13px 16px;text-align:left;font-size:11px;font-weight:700;color:var(--text-muted);letter-spacing:.8px;text-transform:uppercase;">ចំណងជើង</th>
            <th style="padding:13px 16px;text-align:left;font-size:11px;font-weight:700;color:var(--text-muted);letter-spacing:.8px;text-transform:uppercase;white-space:nowrap;">ប្រភេទ</th>
            <th style="padding:13px 16px;text-align:right;font-size:11px;font-weight:700;color:var(--text-muted);letter-spacing:.8px;text-transform:uppercase;white-space:nowrap;">ចំនួន ($)</th>
            <th style="padding:13px 16px;text-align:left;font-size:11px;font-weight:700;color:var(--text-muted);letter-spacing:.8px;text-transform:uppercase;white-space:nowrap;">អ្នកស្នើ</th>
            <th style="padding:13px 16px;text-align:left;font-size:11px;font-weight:700;color:var(--text-muted);letter-spacing:.8px;text-transform:uppercase;white-space:nowrap;">នាយកដ្ឋាន</th>
            <th style="padding:13px 16px;text-align:center;font-size:11px;font-weight:700;color:var(--text-muted);letter-spacing:.8px;text-transform:uppercase;white-space:nowrap;">បន្ទាន់</th>
            <th style="padding:13px 16px;text-align:left;font-size:11px;font-weight:700;color:var(--text-muted);letter-spacing:.8px;text-transform:uppercase;white-space:nowrap;">កាលបរិច្ឆេទ</th>
            <th style="padding:13px 16px;text-align:center;font-size:11px;font-weight:700;color:var(--text-muted);letter-spacing:.8px;text-transform:uppercase;">ស្ថានភាព</th>
            <th style="padding:13px 16px;text-align:center;font-size:11px;font-weight:700;color:var(--text-muted);letter-spacing:.8px;text-transform:uppercase;">សកម្មភាព</th>
          </tr>
        </thead>
        <tbody>
          ${sorted.map((r,i)=>{
            const catColor = EXP_CAT_COLORS[r.category]||'#6B7280';
            const catLabel = EXP_CAT_LABELS[r.category]||r.category||'—';
            const catIcon  = EXP_CAT_ICONS[r.category]||'📦';
            const stColor  = EXP_STATUS_COLORS[r.status]||'#6B7280';
            const stLabel  = EXP_STATUS_LABELS[r.status]||r.status||'—';
            const urgColor = EXPREQ_URGENCY_COLORS[r.urgency]||'#6B7280';
            const urgIcon  = EXPREQ_URGENCY_ICONS[r.urgency]||'🟢';
            const urgLabel = EXPREQ_URGENCY_LABELS[r.urgency]||'ធម្មតា';
            const rowBg = i%2===0?'background:var(--surface);':'background:var(--surface2);';
            return `
            <tr style="${rowBg}border-bottom:1px solid var(--border);transition:background .15s;" onmouseover="this.style.background='var(--primary-light)'" onmouseout="this.style.background='${i%2===0?'var(--surface)':'var(--surface2)'}'">
              <td style="padding:12px 16px;font-family:monospace;font-size:12px;color:var(--text-muted);font-weight:700;">${r.id}</td>
              <td style="padding:12px 16px;">
                <div style="font-weight:700;color:var(--text);">${r.title||'—'}</div>
                ${r.note?`<div style="font-size:11px;color:var(--text-muted);margin-top:2px;max-width:200px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${r.note}</div>`:''}
              </td>
              <td style="padding:12px 16px;">
                <span style="display:inline-flex;align-items:center;gap:5px;background:${catColor}18;color:${catColor};padding:4px 10px;border-radius:20px;font-size:11.5px;font-weight:700;">
                  ${catIcon} ${catLabel}
                </span>
              </td>
              <td style="padding:12px 16px;text-align:right;font-weight:800;color:#0284C7;font-size:14px;">$${parseFloat(r.amount||0).toFixed(2)}</td>
              <td style="padding:12px 16px;color:var(--text);font-size:12.5px;">${r.requester||'—'}</td>
              <td style="padding:12px 16px;color:var(--text-muted);font-size:12.5px;">${r.dept||'—'}</td>
              <td style="padding:12px 16px;text-align:center;">
                <span style="display:inline-flex;align-items:center;gap:4px;font-size:11.5px;font-weight:700;color:${urgColor};">${urgIcon} ${urgLabel}</span>
              </td>
              <td style="padding:12px 16px;color:var(--text-muted);font-size:12.5px;white-space:nowrap;">${r.date||'—'}</td>
              <td style="padding:12px 16px;text-align:center;">
                <span style="display:inline-flex;align-items:center;gap:5px;background:${stColor}18;color:${stColor};padding:4px 12px;border-radius:20px;font-size:11.5px;font-weight:700;">● ${stLabel}</span>
              </td>
              <td style="padding:12px 16px;text-align:center;">
                <div style="display:flex;gap:6px;justify-content:center;flex-wrap:nowrap;">
                  ${r.status==='pending'?`
                  <button onclick="openExpReqApprove('${r.id}','approved')" title="អនុម័ត" style="width:30px;height:30px;border-radius:7px;border:none;background:#F0FDF4;color:#059669;cursor:pointer;font-size:13px;display:flex;align-items:center;justify-content:center;"><i class="fas fa-check"></i></button>
                  <button onclick="openExpReqApprove('${r.id}','rejected')" title="បដិសេធ" style="width:30px;height:30px;border-radius:7px;border:none;background:#FEF2F2;color:#DC2626;cursor:pointer;font-size:13px;display:flex;align-items:center;justify-content:center;"><i class="fas fa-times"></i></button>`:
                  `<button onclick="expReqResetPending('${r.id}')" title="ដំណើរការឡើងវិញ" style="width:30px;height:30px;border-radius:7px;border:none;background:#EEF2FF;color:#3B5BDB;cursor:pointer;font-size:12px;display:flex;align-items:center;justify-content:center;"><i class="fas fa-undo"></i></button>`}
                  <button onclick="openExpReqModal('${r.id}')" title="មើល/កែ" style="width:30px;height:30px;border-radius:7px;border:none;background:#EEF2FF;color:#3B5BDB;cursor:pointer;font-size:13px;display:flex;align-items:center;justify-content:center;"><i class="fas fa-eye"></i></button>
                  <button onclick="deleteExpReq('${r.id}')" title="លុប" style="width:30px;height:30px;border-radius:7px;border:none;background:#FEF2F2;color:#B91C1C;cursor:pointer;font-size:13px;display:flex;align-items:center;justify-content:center;"><i class="fas fa-trash"></i></button>
                </div>
              </td>
            </tr>`;
          }).join('')}
        </tbody>
        <tfoot>
          <tr style="background:var(--primary-light);border-top:2px solid var(--border);">
            <td colspan="3" style="padding:12px 16px;font-weight:800;color:var(--text);">សរុប (${sorted.length} ការស្នើ)</td>
            <td style="padding:12px 16px;text-align:right;font-weight:800;color:#0284C7;font-size:15px;">$${sorted.reduce((s,r)=>s+(parseFloat(r.amount)||0),0).toFixed(2)}</td>
            <td colspan="6"></td>
          </tr>
        </tfoot>
      </table>
      </div>
    </div>`;
}

function openExpReqModal(id) {
  const modal = document.getElementById('expreq-modal');
  const titleEl = document.getElementById('expreqm-title');
  document.getElementById('expreqm-editing').value = id||'';

  // Populate department dropdown
  const deptSel = document.getElementById('expreqm-dept');
  const depts = DB.getDepartments ? DB.getDepartments() : (DB.data?.departments||[]);
  deptSel.innerHTML = '<option value="">-- ជ្រើសនាយកដ្ឋាន --</option>' +
    depts.map(d=>`<option value="${d.name}">${d.name}</option>`).join('');

  if (id) {
    const r = getExpReq().find(x=>x.id===id);
    if (!r) return;
    document.getElementById('expreqm-title-input').value = r.title||'';
    document.getElementById('expreqm-date').value         = r.date||'';
    document.getElementById('expreqm-amount').value       = r.amount||'';
    // category removed from UI
    document.getElementById('expreqm-requester').value    = r.requester||'';
    document.getElementById('expreqm-dept').value         = r.dept||'';
    document.getElementById('expreqm-urgency').value      = r.urgency||'normal';
    document.getElementById('expreqm-note').value         = r.note||'';
    titleEl.textContent = 'ពិនិត្យការស្នើ';
    const noteWrap = document.getElementById('expreqm-approval-note-wrap');
    const noteText = document.getElementById('expreqm-approval-note-text');
    if (r.approvalNote) {
      noteWrap.style.display = 'block';
      noteText.textContent = r.approvalNote;
    } else { noteWrap.style.display = 'none'; }
  } else {
    document.getElementById('expreqm-title-input').value = '';
    document.getElementById('expreqm-date').value         = new Date().toISOString().split('T')[0];
    document.getElementById('expreqm-amount').value       = '';
    // category removed from UI
    document.getElementById('expreqm-requester').value    = '';
    document.getElementById('expreqm-dept').value         = '';
    document.getElementById('expreqm-urgency').value      = 'normal';
    document.getElementById('expreqm-note').value         = '';
    document.getElementById('expreqm-approval-note-wrap').style.display = 'none';
    titleEl.textContent = 'ស្នើរថ្មី';
  }
  modal.classList.add('active');
  setTimeout(()=>document.getElementById('expreqm-title-input')?.focus(),100);
}
// alias for onclick
window.openExpReqModal = openExpReqModal;

function saveExpReq() {
  const editing   = document.getElementById('expreqm-editing').value;
  const title     = document.getElementById('expreqm-title-input').value.trim();
  const date      = document.getElementById('expreqm-date').value;
  const amount    = parseFloat(document.getElementById('expreqm-amount').value)||0;
  const category  = 'other';
  const requester = document.getElementById('expreqm-requester').value.trim();
  const dept      = document.getElementById('expreqm-dept').value;
  const urgency   = document.getElementById('expreqm-urgency').value;
  const note      = document.getElementById('expreqm-note').value.trim();

  if (!title)     { showToast('សូមបញ្ចូលចំណងជើង!','error'); return; }
  if (!date)      { showToast('សូមជ្រើសកាលបរិច្ឆេទ!','error'); return; }
  if (amount<=0)  { showToast('ចំនួនទឹកប្រាក់ត្រូវជាងសូន្យ!','error'); return; }
  if (!requester) { showToast('សូមបញ្ចូលឈ្មោះអ្នកស្នើ!','error'); return; }

  const list = getExpReq();
  if (editing) {
    const idx = list.findIndex(r=>r.id===editing);
    if (idx===-1) { showToast('រកមិនឃើញ!','error'); return; }
    Object.assign(list[idx], {title, date, amount, category, requester, dept, urgency, note});
    showToast('បានកែការស្នើរួចរាល់!','success');
  } else {
    list.push({ id:expReqNextId(), title, date, amount, category, requester, dept, urgency, note, status:'pending', createdAt:new Date().toISOString() });
    showToast('បានស្នើ "'+title+'" រួចរាល់!','success');
  }
  saveExpReq2(list);
  closeModal('expreq-modal');
  renderExpRequest();
}
window.saveExpReq = saveExpReq;

function openExpReqApprove(id, action) {
  const r = getExpReq().find(x=>x.id===id);
  if (!r) return;
  document.getElementById('expreq-approve-id').value     = id;
  document.getElementById('expreq-approve-action').value = action;
  document.getElementById('expreq-approve-note').value   = '';
  const catLabel = EXP_CAT_LABELS[r.category]||r.category||'—';
  const urgIcon  = EXPREQ_URGENCY_ICONS[r.urgency]||'🟢';
  document.getElementById('expreq-approve-info').innerHTML = `
    <div><strong>លេខ:</strong> ${r.id}</div>
    <div><strong>ចំណងជើង:</strong> ${r.title}</div>
    <div><strong>ចំនួន:</strong> <span style="color:#0284C7;font-weight:800;">$${parseFloat(r.amount).toFixed(2)}</span></div>
    <div><strong>ប្រភេទ:</strong> ${catLabel}</div>
    <div><strong>អ្នកស្នើ:</strong> ${r.requester} ${r.dept?'('+r.dept+')':''}</div>
    <div><strong>បន្ទាន់:</strong> ${urgIcon} ${EXPREQ_URGENCY_LABELS[r.urgency]||'ធម្មតា'}</div>
    ${r.note?`<div><strong>ហេតុផល:</strong> ${r.note}</div>`:''}
  `;
  const isApprove = action==='approved';
  document.getElementById('expreq-approve-title').textContent = isApprove ? '✅ អនុម័តការស្នើ' : '❌ បដិសេធការស្នើ';
  const btn = document.getElementById('expreq-approve-btn');
  btn.style.background = isApprove ? 'linear-gradient(135deg,#059669,#10B981)' : 'linear-gradient(135deg,#DC2626,#EF4444)';
  btn.innerHTML = isApprove ? '<i class="fas fa-check"></i> អនុម័ត' : '<i class="fas fa-times"></i> បដិសេធ';
  document.getElementById('expreq-approve-modal').classList.add('active');
}
window.openExpReqApprove = openExpReqApprove;

// ── Badge: pending requests count ──
function updateExpReqBadge() {
  const pending = getExpReq().filter(r=>r.status==='pending').length;
  const badge = document.getElementById('exp-req-pending-badge');
  if (!badge) return;
  if (pending > 0) { badge.style.display = ''; badge.textContent = pending; }
  else { badge.style.display = 'none'; }
}

function confirmExpReqAction() {
  const id     = document.getElementById('expreq-approve-id').value;
  const action = document.getElementById('expreq-approve-action').value;
  const note   = document.getElementById('expreq-approve-note').value.trim();
  const list   = getExpReq();
  const idx    = list.findIndex(r=>r.id===id);
  if (idx===-1) return;
  list[idx].status      = action;
  list[idx].approvalNote = note;
  list[idx].approvedAt  = new Date().toISOString();
  saveExpReq2(list);

  // ── Approved: income added to fund pool (no auto-copy to ការចំណាយទូទៅ) ──
  if (action === 'approved') {
    const r = list[idx];
    const pool2 = getExpFundPool();
    showToast('✅ អនុម័ត! ចំណូល fund: +$' + parseFloat(r.amount).toFixed(2) + ' | សមតុល្យ: $' + pool2.balance.toFixed(2), 'success');
  } else {
    showToast('បានបដិសេធការស្នើ!', 'warning');
  }

  closeModal('expreq-approve-modal');
  updateExpReqBadge();
  renderExpRequest();
}
window.confirmExpReqAction = confirmExpReqAction;

function expReqResetPending(id) {
  if (!confirm('ដំណើរការការស្នើនេះឡើងវិញជា "រង់ចាំ"?')) return;
  const list = getExpReq();
  const idx  = list.findIndex(r=>r.id===id);
  if (idx===-1) return;
  list[idx].status = 'pending';
  list[idx].approvalNote = '';
  saveExpReq2(list);
  showToast('ដំណើរការឡើងវិញ!','success');
  renderExpRequest();
}
window.expReqResetPending = expReqResetPending;

function deleteExpReq(id) {
  if (!confirm('តើអ្នកចង់លុបការស្នើនេះ?')) return;
  saveExpReq2(getExpReq().filter(r=>r.id!==id));
  showToast('បានលុបរួចរាល់!','success');
  renderExpRequest();
}
window.deleteExpReq = deleteExpReq;

function exportExpReqExcel() {
  const list = getExpReq();
  if (!list.length) { showToast('គ្មានទិន្នន័យ!','error'); return; }
  const ws_data = [
    ['លេខ','ចំណងជើង','ប្រភេទ','ចំនួន ($)','អ្នកស្នើ','នាយកដ្ឋាន','បន្ទាន់','ស្ថានភាព','ហេតុផល','កំណត់ចំណាំ Admin'],
    ...list.map(r=>[r.id,r.title,EXP_CAT_LABELS[r.category]||r.category,r.amount,r.requester,r.dept,EXPREQ_URGENCY_LABELS[r.urgency]||r.urgency,EXP_STATUS_LABELS[r.status]||r.status,r.note,r.approvalNote||''])
  ];
  try {
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(ws_data), 'ExpenseRequests');
    XLSX.writeFile(wb, 'expense_requests.xlsx');
    showToast('Export Excel ជោគជ័យ!','success');
  } catch(err) { showToast('Export បរាជ័យ!','error'); }
}
window.exportExpReqExcel = exportExpReqExcel;

function printExpReq() {
  const list = getExpReq();
  if (!list.length) { showToast('គ្មានទិន្នន័យ!','error'); return; }
  const sorted = [...list].sort((a,b)=>(b.createdAt||'').localeCompare(a.createdAt||''));
  const total  = list.reduce((s,r)=>s+(parseFloat(r.amount)||0),0);
  const approved = list.filter(r=>r.status==='approved').reduce((s,r)=>s+(parseFloat(r.amount)||0),0);
  const rows = sorted.map((r,i)=>{
    const catLabel=EXP_CAT_LABELS[r.category]||r.category||'—';
    const stLabel=EXP_STATUS_LABELS[r.status]||r.status||'—';
    const stColor=EXP_STATUS_COLORS[r.status]||'#6B7280';
    const urgIcon=EXPREQ_URGENCY_ICONS[r.urgency]||'🟢';
    return `<tr style="background:${i%2===0?'#fff':'#f0f7ff'};">
      <td>${r.id}</td><td>${r.title||'—'}</td><td>${catLabel}</td>
      <td style="text-align:right;color:#0284C7;font-weight:800;">$${parseFloat(r.amount||0).toFixed(2)}</td>
      <td>${r.requester||'—'}</td><td>${r.dept||'—'}</td>
      <td>${urgIcon} ${EXPREQ_URGENCY_LABELS[r.urgency]||'ធម្មតា'}</td>
      <td><span style="background:${stColor}18;color:${stColor};padding:2px 8px;border-radius:12px;font-size:11px;font-weight:700;">● ${stLabel}</span></td>
      <td style="font-size:11px;color:#5A6480;">${r.note||'—'}</td>
    </tr>`;
  }).join('');
  const html = `<html><head><meta charset="UTF-8"><title>របាយការណ៍ស្នើរប្រាក់ចំណាយ</title>
  <style>body{font-family:'Kantumruy Pro','Battambang',sans-serif;padding:24px;color:#1A1F36;}
  table{width:100%;border-collapse:collapse;font-size:12px;}
  th{background:#0284C7;color:#fff;padding:9px 10px;text-align:left;}
  td{padding:7px 10px;border-bottom:1px solid #e0e7ff;}
  h2{color:#0284C7;} .summary{display:flex;gap:16px;margin-bottom:16px;}
  .card{background:#f0f7ff;border-radius:8px;padding:12px 16px;border-left:4px solid #0284C7;}
  </style></head><body>
  <h2>📨 របាយការណ៍ស្នើរប្រាក់ចំណាយ</h2>
  <p style="color:#5A6480;">បោះពុម្ព: ${new Date().toLocaleDateString('km-KH',{year:'numeric',month:'long',day:'numeric'})}</p>
  <div class="summary">
    <div class="card"><strong style="color:#0284C7;font-size:18px;">${list.length}</strong><br/>ការស្នើសរុប</div>
    <div class="card"><strong style="color:#059669;font-size:18px;">$${approved.toFixed(2)}</strong><br/>បានអនុម័ត</div>
    <div class="card"><strong style="color:#D97706;font-size:18px;">${list.filter(r=>r.status==='pending').length}</strong><br/>រង់ចាំ</div>
    <div class="card"><strong style="color:#DC2626;font-size:18px;">$${total.toFixed(2)}</strong><br/>ចំនួនសរុប</div>
  </div>
  <table><thead><tr>
    <th>លេខ</th><th>ចំណងជើង</th><th>ប្រភេទ</th><th>ចំនួន ($)</th>
    <th>អ្នកស្នើ</th><th>នាយកដ្ឋាន</th><th>បន្ទាន់</th><th>ស្ថានភាព</th><th>ហេតុផល</th>
  </tr></thead><tbody>${rows}</tbody></table>
  </body></html>`;
  const w = window.open('','_blank');
  w.document.write(html); w.document.close(); w.print();
}
window.printExpReq = printExpReq;


// ===================================================================
//  PRINT PAYSLIP WITH QR CODE
// ===================================================================
function printPaySlip(salaryId) {
  const records = DB.getSalary();
  const r = records.find(x => x.id === salaryId);
  if (!r) { showToast('រកមិនឃើញទិន្នន័យ!', 'error'); return; }

  const emps  = DB.getEmployees();
  const depts = DB.getDepartments();
  const emp   = emps.find(e => e.id === r.empId);
  if (!emp) { showToast('រកមិនឃើញបុគ្គលិក!', 'error'); return; }

  const dept    = depts.find(d => d.name === emp.department) || {};
  const base    = parseFloat(r.base    || 0);
  const bonus   = parseFloat(r.bonus   || 0);
  const deduct  = parseFloat(r.deduction || 0);
  const netPay  = base + bonus - deduct;
  const slipId  = 'SLIP-' + r.empId + '-' + r.month.replace('-','');
  const today   = new Date().toLocaleDateString('km-KH', { year:'numeric', month:'long', day:'numeric' });

  // QR data — JSON summary of the payslip
  const qrData  = JSON.stringify({
    id: slipId,
    name: emp.name,
    dept: emp.department,
    month: r.month,
    base: base,
    bonus: bonus,
    deduction: deduct,
    net: netPay,
    status: r.status === 'paid' ? 'បានបើក' : 'រង់ចាំ',
  });

  // Build the print window
  const win = window.open('', '_blank', 'width=800,height=900');
  win.document.write(`<!DOCTYPE html>
<html lang="km">
<head>
<meta charset="UTF-8"/>
<title>កំណត់ត្រាប្រាក់ខែ — ${emp.name}</title>
<link href="https://fonts.googleapis.com/css2?family=Battambang:wght@400;700&family=Kantumruy+Pro:wght@300;400;500;600;700&display=swap" rel="stylesheet"/>
<script src="https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js"><\/script>
<style>
  *{box-sizing:border-box;margin:0;padding:0;}
  body{font-family:'Kantumruy Pro','Battambang',sans-serif;background:#f3f4f6;display:flex;justify-content:center;padding:30px 16px;}
  .slip{width:680px;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 8px 40px rgba(0,0,0,.15);}
  /* Header */
  .slip-header{background:linear-gradient(135deg,#1A237E 0%,#3B5BDB 60%,#4F46E5 100%);padding:28px 32px;display:flex;align-items:center;justify-content:space-between;gap:20px;}
  .slip-logo{display:flex;align-items:center;gap:12px;}
  .slip-logo-icon{width:50px;height:50px;border-radius:14px;background:rgba(255,255,255,.18);display:flex;align-items:center;justify-content:center;font-size:24px;}
  .slip-logo-text{color:#fff;}
  .slip-logo-title{font-size:20px;font-weight:800;letter-spacing:1px;}
  .slip-logo-sub{font-size:11px;opacity:.7;margin-top:2px;}
  .slip-header-right{text-align:right;color:#fff;}
  .slip-doc-label{font-size:11px;opacity:.65;margin-bottom:4px;letter-spacing:1px;text-transform:uppercase;}
  .slip-doc-id{font-size:15px;font-weight:700;background:rgba(255,255,255,.15);padding:4px 12px;border-radius:8px;display:inline-block;}
  .slip-doc-date{font-size:11px;opacity:.65;margin-top:6px;}
  /* Employee band — see below */
  .emp-band{background:linear-gradient(135deg,#EEF2FF 0%,#F0F4FF 100%);padding:20px 32px;display:flex;align-items:stretch;gap:20px;border-bottom:2px solid #E2E8F8;}
  .emp-photo-col{display:flex;flex-direction:column;align-items:center;gap:8px;flex-shrink:0;}
  .emp-avatar-big{width:88px;height:105px;border-radius:12px;background:linear-gradient(135deg,#3B5BDB,#7C3AED);display:flex;align-items:center;justify-content:center;font-size:32px;font-weight:900;color:#fff;overflow:hidden;border:3px solid #fff;box-shadow:0 4px 16px rgba(59,91,219,0.2);}
  .emp-avatar-big img{width:100%;height:100%;object-fit:cover;display:block;}
  .emp-photo-label{font-size:9px;font-weight:700;color:#8896B3;letter-spacing:1px;text-transform:uppercase;}
  .emp-avatar{width:54px;height:54px;border-radius:50%;background:linear-gradient(135deg,#3B5BDB,#7C3AED);display:flex;align-items:center;justify-content:center;font-size:18px;font-weight:800;color:#fff;flex-shrink:0;overflow:hidden;}
  .emp-avatar img{width:100%;height:100%;object-fit:cover;border-radius:50%;}
  .emp-info{flex:1;}
  .emp-name{font-size:18px;font-weight:800;color:#1A1F36;}
  .emp-sub{font-size:12px;color:#5A6480;margin-top:3px;}
  .emp-badges{display:flex;gap:8px;margin-top:8px;flex-wrap:wrap;}
  .badge-pill{padding:3px 10px;border-radius:20px;font-size:11px;font-weight:700;}
  .badge-dept{background:#EEF2FF;color:#3B5BDB;}
  .badge-pos{background:#F0FDF4;color:#059669;}
  .badge-month{background:#FFF7ED;color:#C2410C;}
  .badge-status-paid{background:#DCFCE7;color:#059669;}
  .badge-status-pend{background:#FEF3C7;color:#B45309;}
  /* Body */
  .slip-body{padding:28px 32px;}
  .slip-section-title{font-size:12px;font-weight:700;color:#8896B3;text-transform:uppercase;letter-spacing:1.5px;margin-bottom:12px;display:flex;align-items:center;gap:8px;}
  .slip-section-title::after{content:'';flex:1;height:1px;background:#E2E8F8;}
  .sal-rows{display:flex;flex-direction:column;gap:8px;margin-bottom:20px;}
  .sal-row-item{display:flex;justify-content:space-between;align-items:center;padding:10px 14px;border-radius:10px;background:#F8FAFF;}
  .sal-row-item.bonus{background:#F0FDF4;}
  .sal-row-item.deduct{background:#FEF2F2;}
  .sal-row-label{font-size:13px;color:#5A6480;display:flex;align-items:center;gap:8px;}
  .sal-row-label i{font-size:14px;}
  .sal-row-val{font-size:14px;font-weight:700;color:#1A1F36;}
  .sal-row-item.bonus .sal-row-val{color:#059669;}
  .sal-row-item.deduct .sal-row-val{color:#DC2626;}
  /* Net total */
  .net-box{background:linear-gradient(135deg,#1A237E,#3B5BDB);border-radius:14px;padding:20px 24px;display:flex;align-items:center;justify-content:space-between;margin:20px 0;}
  .net-label{color:rgba(255,255,255,.75);font-size:13px;font-weight:600;}
  .net-amount{color:#fff;font-size:26px;font-weight:900;letter-spacing:1px;}
  .net-status{color:rgba(255,255,255,.8);font-size:11px;margin-top:4px;}
  /* QR section */
  .qr-section{display:flex;align-items:center;justify-content:space-between;gap:24px;border-top:1.5px dashed #E2E8F8;padding-top:24px;margin-top:4px;}
  .qr-info{flex:1;}
  .qr-info-title{font-size:13px;font-weight:700;color:#1A1F36;margin-bottom:6px;}
  .qr-info-text{font-size:11px;color:#8896B3;line-height:1.7;}
  .qr-box{flex-shrink:0;text-align:center;}
  .qr-box canvas, .qr-box img{border-radius:10px;border:2px solid #E2E8F8;padding:6px;background:#fff;}
  .qr-box-label{font-size:10px;color:#8896B3;margin-top:6px;}
  /* Footer */
  .slip-footer{background:#F0F4FF;border-top:1.5px solid #E2E8F8;padding:14px 32px;display:flex;justify-content:space-between;align-items:center;font-size:11px;color:#8896B3;}
  .slip-footer strong{color:#3B5BDB;}
  /* Signature */
  .sig-row{display:grid;grid-template-columns:1fr 1fr;gap:24px;margin-top:24px;}
  .sig-box{border-top:1.5px solid #CBD5E1;padding-top:8px;text-align:center;font-size:11px;color:#8896B3;}
  @media print{
    body{padding:0;background:#fff;}
    .slip{box-shadow:none;border-radius:0;width:100%;}
    .no-print{display:none!important;}
  }
</style>
</head>
<body>
<div class="slip">
  <!-- Header -->
  <div class="slip-header">
    <div class="slip-logo">
      <div class="slip-logo-icon">👔</div>
      <div class="slip-logo-text">
        <div class="slip-logo-title">HR PRO</div>
        <div class="slip-logo-sub">ប្រព័ន្ធគ្រប់គ្រងបុគ្គលិក</div>
      </div>
    </div>
    <div class="slip-header-right">
      <div class="slip-doc-label">កំណត់ត្រាប្រាក់ខែ</div>
      <div class="slip-doc-id">${slipId}</div>
      <div class="slip-doc-date">បោះពុម្ព: ${today}</div>
    </div>
  </div>

  <!-- Employee Info -->
  <div class="emp-band">
    <!-- Photo (4x6 style) -->
    <div class="emp-photo-col">
      <div class="emp-avatar-big">${emp.photo ? `<img src="${emp.photo}"/>` : `<span>${emp.name.substring(0,1)}</span>`}</div>
      <div class="emp-photo-label">រូបថត 4×6</div>
    </div>
    <!-- Divider -->
    <div style="width:1.5px;background:linear-gradient(to bottom,transparent,#C7D2F8,transparent);flex-shrink:0;margin:4px 0;"></div>
    <!-- Info -->
    <div class="emp-info" style="display:flex;flex-direction:column;justify-content:center;gap:6px;">
      <div class="emp-name">${emp.name}</div>
      <div class="emp-sub">${emp.position || 'បុគ្គលិក'} · <span style="color:#3B5BDB;font-weight:600;">${emp.department}</span></div>
      <div style="font-size:11px;color:#8896B3;display:flex;flex-direction:column;gap:3px;margin-top:2px;">
        ${emp.phone   ? `<span>📞 ${emp.phone}</span>`   : ''}
        ${emp.email   ? `<span>✉️ ${emp.email}</span>`   : ''}
        ${emp.nid     ? `<span>🪪 ${emp.nid}</span>`     : ''}
        ${emp.bank    ? `<span>🏦 ${emp.bank}</span>`    : ''}
        ${emp.address ? `<span>📍 ${emp.address}</span>` : ''}
      </div>
      <div class="emp-badges" style="margin-top:6px;">
        <span class="badge-pill badge-dept">📅 ខែ ${r.month}</span>
        <span class="badge-pill ${r.status === 'paid' ? 'badge-status-paid' : 'badge-status-pend'}">${r.status === 'paid' ? '✓ បានបើក' : '⏳ រង់ចាំ'}</span>
        ${emp.empType ? `<span class="badge-pill" style="background:#F0F9FF;color:#0284C7;">${emp.empType}</span>` : ''}
      </div>
    </div>
    <!-- Emp ID badge top-right -->
    <div style="align-self:flex-start;text-align:right;flex-shrink:0;">
      <div style="background:#1A237E;color:#fff;padding:4px 10px;border-radius:8px;font-size:11px;font-weight:700;letter-spacing:1px;font-family:monospace;">${emp.id}</div>
    </div>
  </div>

  <!-- Salary Breakdown -->
  <div class="slip-body">
    <div class="slip-section-title">ព័ត៌មានប្រាក់ខែ</div>
    <div class="sal-rows">
      <div class="sal-row-item">
        <span class="sal-row-label"><i>💼</i> ប្រាក់ខែមូលដ្ឋាន</span>
        <span class="sal-row-val">$${base.toFixed(2)}</span>
      </div>
      <div class="sal-row-item bonus">
        <span class="sal-row-label"><i>🎁</i> ប្រាក់លើថ្លៃ / bonus</span>
        <span class="sal-row-val">+ $${bonus.toFixed(2)}</span>
      </div>
      <div class="sal-row-item deduct">
        <span class="sal-row-label"><i>✂️</i> ការកាត់ប្រាក់</span>
        <span class="sal-row-val">- $${deduct.toFixed(2)}</span>
      </div>
    </div>

    <!-- Net Pay -->
    <div class="net-box">
      <div>
        <div class="net-label">ប្រាក់ខែសុទ្ធ (Net Salary)</div>
        <div class="net-amount">$${netPay.toFixed(2)}</div>
        <div class="net-status">${r.status === 'paid' ? '✅ បានបើករួចរាល់' : '⏳ រង់ចាំការបើក'}</div>
      </div>
      <div style="font-size:48px;opacity:.3;">💰</div>
    </div>

    <!-- QR Code section -->
    <div class="slip-section-title">QR កូដ / ផ្ទៀងផ្ទាត់</div>
    <div class="qr-section">
      <div class="qr-info">
        <div class="qr-info-title">🔍 ស្កែន QR ដើម្បីផ្ទៀងផ្ទាត់</div>
        <div class="qr-info-text">
          QR Code នេះ មានព័ត៌មានប្រាក់ខែរបស់<br/>
          <strong>${emp.name}</strong> ប្រចាំខែ <strong>${r.month}</strong><br/>
          លេខរៀង: <strong>${slipId}</strong><br/>
          ប្រាក់ខែសុទ្ធ: <strong>$${netPay.toFixed(2)}</strong>
        </div>
      </div>
      <div class="qr-box">
        <div id="qr-render"></div>
        <div class="qr-box-label">📱 ស្កែននៅទីនេះ</div>
      </div>
    </div>

    <!-- Signature -->
    <div class="sig-row">
      <div class="sig-box">
        <div>ហត្ថលេខា HR</div>
        <br/>&nbsp;
      </div>
      <div class="sig-box">
        <div>ហត្ថលេខាបុគ្គលិក</div>
        <br/>&nbsp;
      </div>
    </div>
  </div>

  <!-- Footer -->
  <div class="slip-footer">
    <span><strong>HR Pro</strong> — ប្រព័ន្ធគ្រប់គ្រងបុគ្គលិក</span>
    <span>${slipId} | ${r.month}</span>
    <button class="no-print" onclick="window.print()" style="background:#3B5BDB;color:#fff;border:none;padding:8px 18px;border-radius:8px;font-family:'Kantumruy Pro',sans-serif;font-size:13px;cursor:pointer;">🖨️ បោះពុម្ព</button>
  </div>
</div>

<script>
  window.addEventListener('load', function() {
    var qrData = ${JSON.stringify(qrData)};
    new QRCode(document.getElementById('qr-render'), {
      text: qrData,
      width: 120,
      height: 120,
      colorDark: '#1A237E',
      colorLight: '#ffffff',
      correctLevel: QRCode.CorrectLevel.M
    });
  });
<\/script>

</body>
</html>`);
  win.document.close();
}

// Add shake keyframes
const styleEl = document.createElement('style');
styleEl.textContent = `@keyframes loginShake {
  0%,100%{transform:translateX(0)}
  20%{transform:translateX(-8px)}
  40%{transform:translateX(8px)}
  60%{transform:translateX(-5px)}
  80%{transform:translateX(5px)}
}`;
document.head.appendChild(styleEl);

// Boot login on load
window.addEventListener('DOMContentLoaded', () => {
  // Apply branding immediately so login screen shows correct name/logo
  try {
    const s = JSON.parse(localStorage.getItem('hrpro_settings') || '{}');
    if (s && (s.companyName || s.logoData)) applyBranding(s);
  } catch(e) {}
  initLogin();
});



// ===== USER MANAGEMENT FUNCTIONS =====

function renderUserList() {
  const container = document.getElementById('user-list-container');
  if (!container) return;
  const users = getUsers();
  const isAdmin = currentUser && currentUser.role === 'Admin';

  // Hide add button for non-admins
  const addBtn = document.getElementById('btn-add-user');
  if (addBtn) addBtn.style.display = isAdmin ? '' : 'none';

  if (!users.length) {
    container.innerHTML = '<p style="color:var(--text-muted);">មិនមានអ្នកប្រើប្រាស់</p>';
    return;
  }

  const roleColors = {
    'Admin':'#3B5BDB','HR Manager':'#059669','Manager':'#D97706','Viewer':'#7C3AED'
  };

  container.innerHTML = `
  <div style="overflow-x:auto;">
  <table class="user-mgmt-table">
    <thead>
      <tr>
        <th>អ្នកប្រើប្រាស់</th>
        <th>Username</th>
        <th>តួនាទី</th>
        <th>ស្ថានភាព</th>
        ${isAdmin ? '<th>សកម្មភាព</th>' : ''}
      </tr>
    </thead>
    <tbody>
      ${users.map(u => {
        const col = u.color || roleColors[u.role] || '#3B5BDB';
        const isSelf = currentUser && u.username === currentUser.username;
        return `
        <tr>
          <td>
            <div style="display:flex;align-items:center;gap:10px;">
              <div class="um-avatar" style="background:linear-gradient(135deg,${col},${col}99);overflow:hidden;position:relative;">
                ${u.photo ? `<img src="${u.photo}" style="width:100%;height:100%;object-fit:cover;position:absolute;inset:0;" alt=""/>` : (u.avatar || u.name[0])}
              </div>
              <span style="font-weight:600;">${u.name}</span>
              ${isSelf ? '<span style="font-size:10px;background:#EEF2FF;color:#3B5BDB;padding:2px 7px;border-radius:10px;font-weight:700;">ខ្ញុំ</span>' : ''}
            </div>
          </td>
          <td style="font-family:monospace;font-size:13px;color:var(--text-muted);">${u.username}</td>
          <td><span class="um-badge" style="background:${col}22;color:${col};">${u.role}</span></td>
          <td><span class="um-badge ${u.active !== false ? 'active' : 'inactive'}">${u.active !== false ? '● កំពុងប្រើ' : '● បិទ'}</span></td>
          ${isAdmin ? `
          <td>
            <div class="um-actions">
              <button class="um-btn edit" onclick="openUserModal('${u.username}')"><i class="fas fa-edit"></i> កែ</button>
              <button class="um-btn pw" onclick="openChpwModal('${u.username}')"><i class="fas fa-key"></i> Password</button>
              ${!isSelf ? (u.active !== false
                ? `<button class="um-btn deact" onclick="toggleUserActive('${u.username}',false)"><i class="fas fa-ban"></i> បិទ</button>`
                : `<button class="um-btn act"   onclick="toggleUserActive('${u.username}',true)"><i class="fas fa-check-circle"></i> បើក</button>`
              ) : ''}
              ${!isSelf ? `<button class="um-btn del" onclick="deleteUser('${u.username}')"><i class="fas fa-trash"></i> លុប</button>` : ''}
            </div>
          </td>` : ''}
        </tr>`;
      }).join('')}
    </tbody>
  </table>
  </div>`;
}

function deleteUser(username) {
  const users = getUsers();
  const u = users.find(x => x.username === username);
  if (!u) return;
  showConfirm('តើអ្នកប្រាកដចង់លុប "' + u.name + '" ចេញពីប្រព័ន្ធ? សកម្មភាពនេះមិនអាចត្រឡប់វិញបានទេ!', function() {
    const updated = getUsers().filter(x => x.username !== username);
    saveUsers(updated);
    renderUserList();
    showToast('🗑️ បានលុបអ្នកប្រើ "' + u.name + '" រួចរាល់!', 'success');
  });
}

function openUserModal(username) {
  const modal   = document.getElementById('user-modal');
  const title   = document.getElementById('user-modal-title');
  const modalIco= document.getElementById('um-modal-ico');
  const pwLabel = document.getElementById('um-pw-label');

  // Reset photo and cleared marker
  umSetPhoto('', '');
  const preview = document.getElementById('um-photo-preview');
  if (preview) preview.dataset.cleared = '';

  if (username) {
    const u = getUsers().find(x => x.username === username);
    if (!u) return;
    document.getElementById('um-editing').value = username;
    document.getElementById('um-name').value     = u.name;
    document.getElementById('um-username').value = u.username;
    document.getElementById('um-password').value = '';
    document.getElementById('um-role').value     = u.role;
    document.getElementById('um-color').value    = u.color || '#3B5BDB';
    title.textContent     = 'កែអ្នកប្រើប្រាស់';
    if (modalIco) modalIco.className = 'fas fa-user-edit';
    pwLabel.innerHTML = 'Password ថ្មី <small style="color:var(--text-muted);font-weight:400;">(ទុកទទេ = មិនប្តូរ)</small>';
    // Load existing photo
    if (u.photo) umSetPhoto(u.photo, u.name);
    else { umUpdateInitials(); umUpdatePreviewColor(); }
  } else {
    document.getElementById('um-editing').value  = '';
    document.getElementById('um-name').value     = '';
    document.getElementById('um-username').value = '';
    document.getElementById('um-password').value = '';
    document.getElementById('um-role').value     = 'HR Manager';
    document.getElementById('um-color').value    = '#059669';
    title.textContent     = 'បង្កើតអ្នកប្រើប្រាស់';
    if (modalIco) modalIco.className = 'fas fa-user-plus';
    pwLabel.innerHTML = 'Password <span class="req">*</span>';
    umUpdateInitials();
    umUpdatePreviewColor();
  }
  modal.classList.add('open');
}


/* ── User Modal Photo Helpers ── */
function umHandlePhoto(event) {
  const file = event.target.files[0];
  if (!file) return;
  if (file.size > 2 * 1024 * 1024) { showToast('រូបភាពធំពេក! សូមជ្រើស < 2MB', 'error'); return; }
  const reader = new FileReader();
  reader.onload = function(e) { umSetPhoto(e.target.result, document.getElementById('um-name').value); };
  reader.readAsDataURL(file);
  // Reset input so same file can be re-selected
  event.target.value = '';
}

function umSetPhoto(src, name) {
  const img      = document.getElementById('um-photo-img');
  const initials = document.getElementById('um-photo-initials');
  const clearBtn = document.getElementById('um-photo-clear');
  if (!img) return;
  if (src && src.startsWith('data:')) {
    img.src = src;
    img.style.display = 'block';
    if (initials) initials.style.display = 'none';
    if (clearBtn) clearBtn.style.display = '';
  } else {
    img.src = '';
    img.style.display = 'none';
    if (initials) {
      initials.style.display = '';
      initials.textContent = name ? name[0].toUpperCase() : '?';
    }
    if (clearBtn) clearBtn.style.display = 'none';
  }
}

function umClearPhoto() {
  umSetPhoto('', document.getElementById('um-name').value || '');
  document.getElementById('um-photo-file').value = '';
  // Mark that user explicitly cleared the photo
  const preview = document.getElementById('um-photo-preview');
  if (preview) preview.dataset.cleared = 'yes';
}

function umUpdateInitials() {
  const name     = document.getElementById('um-name')?.value || '';
  const initials = document.getElementById('um-photo-initials');
  const img      = document.getElementById('um-photo-img');
  if (img && img.style.display === 'block') return; // photo set, don't override
  if (initials) initials.textContent = name ? name[0].toUpperCase() : '?';
}

function umUpdatePreviewColor() {
  const color   = document.getElementById('um-color')?.value || '#3B5BDB';
  const preview = document.getElementById('um-photo-preview');
  const img     = document.getElementById('um-photo-img');
  if (preview && (!img || img.style.display !== 'block')) {
    preview.style.background = `linear-gradient(135deg,${color},${color}99)`;
  }
}

function closeUserModal() {
  document.getElementById('user-modal').classList.remove('open');
}

function saveUser() {
  const editing  = document.getElementById('um-editing').value;
  const name     = document.getElementById('um-name').value.trim();
  const username = document.getElementById('um-username').value.trim().toLowerCase();
  const password = document.getElementById('um-password').value;
  const role     = document.getElementById('um-role').value;
  const color    = document.getElementById('um-color').value;

  if (!name || !username) { showToast('សូមបញ្ចូលឈ្មោះ និង Username!', 'error'); return; }
  if (!/^[a-z0-9_]+$/.test(username)) { showToast('Username មានតែអក្សរ a-z, 0-9, _ ប៉ុណ្ណោះ!', 'error'); return; }

  const users = getUsers();

  if (editing) {
    // Edit mode
    const idx = users.findIndex(u => u.username === editing);
    if (idx === -1) { showToast('រកមិនឃើញ!', 'error'); return; }
    // Check username conflict (if changed)
    if (username !== editing && users.find(u => u.username === username)) {
      showToast('Username "' + username + '" មានរួចហើយ!', 'error'); return;
    }
    const photoImg = document.getElementById('um-photo-img');
    const photoData = photoImg?.src || '';
    const photoCleared = document.getElementById('um-photo-preview')?.dataset.cleared === 'yes';
    users[idx].name   = name;
    users[idx].username = username;
    users[idx].role   = role;
    users[idx].color  = color;
    users[idx].avatar = name[0].toUpperCase();
    if (photoCleared) {
      users[idx].photo = ''; // user explicitly removed photo
    } else if (photoData && photoData.startsWith('data:')) {
      users[idx].photo = photoData; // new photo uploaded
    }
    // else: keep existing photo unchanged
    if (password) {
      if (password.length < 6) { showToast('Password ត្រូវមានយ៉ាងហោចណាស់ 6 តួ!', 'error'); return; }
      users[idx].password = password;
    }
    showToast('បានកែអ្នកប្រើប្រាស់រួចរាល់!', 'success');
  } else {
    // Create mode
    if (!password) { showToast('សូមបញ្ចូល Password!', 'error'); return; }
    if (password.length < 6) { showToast('Password ត្រូវមានយ៉ាងហោចណាស់ 6 តួ!', 'error'); return; }
    if (users.find(u => u.username === username)) {
      showToast('Username "' + username + '" មានរួចហើយ!', 'error'); return;
    }
    const photoDataNew = document.getElementById('um-photo-img')?.src || '';
    const photoSave = (photoDataNew && photoDataNew.startsWith('data:')) ? photoDataNew : '';
    users.push({ username, password, name, role, color, avatar: name[0].toUpperCase(), photo: photoSave, active: true });
    showToast('បានបង្កើតអ្នកប្រើប្រាស់ "' + name + '" រួចរាល់!', 'success');
  }

  saveUsers(users);
  closeUserModal();
  renderUserList();
}

function toggleUserActive(username, active) {
  if (!currentUser || currentUser.role !== 'Admin') { showToast('មិនមានសិទ្ធិ!', 'error'); return; }
  if (username === currentUser.username) { showToast('មិនអាចបិទគណនីខ្លួនឯង!', 'error'); return; }
  const users = getUsers();
  const idx = users.findIndex(u => u.username === username);
  if (idx === -1) return;
  users[idx].active = active;
  saveUsers(users);
  showToast(active ? 'បានបើកអ្នកប្រើប្រាស់!' : 'បានបិទអ្នកប្រើប្រាស់!', active ? 'success' : 'warning');
  renderUserList();
}

function openChpwModal(username) {
  document.getElementById('chpw-username').value = username;
  document.getElementById('chpw-new').value = '';
  document.getElementById('chpw-confirm').value = '';
  document.getElementById('chpw-modal').classList.add('open');
}

function closeChpwModal() {
  document.getElementById('chpw-modal').classList.remove('open');
}

function doChangePassword() {
  const username = document.getElementById('chpw-username').value;
  const newPw    = document.getElementById('chpw-new').value;
  const confirm  = document.getElementById('chpw-confirm').value;

  if (!newPw) { showToast('សូមបញ្ចូល Password ថ្មី!', 'error'); return; }
  if (newPw.length < 6) { showToast('Password ត្រូវមានយ៉ាងហោចណាស់ 6 តួ!', 'error'); return; }
  if (newPw !== confirm) { showToast('Password ថ្មីមិនដូចគ្នា!', 'error'); return; }

  const users = getUsers();
  const idx = users.findIndex(u => u.username === username);
  if (idx === -1) { showToast('រកមិនឃើញ!', 'error'); return; }

  users[idx].password = newPw;
  saveUsers(users);

  // Update remember-me if this is currentUser
  if (currentUser && currentUser.username === username) {
    currentUser.password = newPw;
    const rem = localStorage.getItem('hrpro_remember');
    if (rem) localStorage.setItem('hrpro_remember', JSON.stringify({ username, password: newPw }));
  }

  showToast('បានប្តូរ Password របស់ "' + users[idx].name + '" រួចរាល់!', 'success');
  closeChpwModal();
}

function toggleUmPw() {
  const inp = document.getElementById('um-password');
  const eye = document.getElementById('um-pw-eye');
  inp.type = inp.type === 'password' ? 'text' : 'password';
  eye.className = inp.type === 'password' ? 'fas fa-eye' : 'fas fa-eye-slash';
}

function toggleChpwEye(inputId, eyeId) {
  const inp = document.getElementById(inputId);
  const eye = document.getElementById(eyeId);
  inp.type = inp.type === 'password' ? 'text' : 'password';
  eye.className = inp.type === 'password' ? 'fas fa-eye' : 'fas fa-eye-slash';
}


// ===== QR SCANNER =====
let qrStream = null;
let qrAnimFrame = null;
let qrParsedData = null;
let qrCurrentTab = 'cam';

function openQRScanner() {
  qrParsedData = null;
  document.getElementById('qr-result-box').style.display = 'none';
  document.getElementById('qr-result-preview').textContent = '';
  document.getElementById('qr-scanner-overlay').classList.add('open');
  switchQRTab('cam');
}

function closeQRScanner() {
  stopQRCamera();
  document.getElementById('qr-scanner-overlay').classList.remove('open');
}

function switchQRTab(tab) {
  qrCurrentTab = tab;
  const camPanel  = document.getElementById('qr-cam-panel');
  const filePanel = document.getElementById('qr-file-panel');
  const tabCam    = document.getElementById('qr-tab-cam');
  const tabFile   = document.getElementById('qr-tab-file');
  document.getElementById('qr-result-box').style.display = 'none';
  qrParsedData = null;

  if (tab === 'cam') {
    camPanel.style.display  = '';
    filePanel.style.display = 'none';
    tabCam.style.background  = 'var(--primary)';
    tabCam.style.color       = '#fff';
    tabCam.style.border      = 'none';
    tabFile.style.background = 'var(--surface)';
    tabFile.style.color      = 'var(--text-muted)';
    tabFile.style.border     = '1.5px solid var(--border)';
    startQRCamera();
  } else {
    camPanel.style.display  = 'none';
    filePanel.style.display = '';
    tabCam.style.background  = 'var(--surface)';
    tabCam.style.color       = 'var(--text-muted)';
    tabCam.style.border      = '1.5px solid var(--border)';
    tabFile.style.background = 'var(--primary)';
    tabFile.style.color      = '#fff';
    tabFile.style.border     = 'none';
    stopQRCamera();
  }
}

function startQRCamera() {
  stopQRCamera();
  const video = document.getElementById('qr-video');
  const status = document.getElementById('qr-cam-status');
  status.textContent = 'កំពុងបើកកាមេរ៉ា...';
  status.style.color = 'var(--text-muted)';

  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    status.textContent = '⚠️ Browser មិនគាំទ្រកាមេរ៉ា';
    return;
  }

  navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
    .then(stream => {
      qrStream = stream;
      video.srcObject = stream;
      video.play();
      status.textContent = '📷 សូមប្រើប្រាស់ QR Code ចំពោះ boxscan';
      requestAnimationFrame(tickQR);
    })
    .catch(err => {
      status.textContent = '⚠️ មិនអាចបើកកាមេរ៉ា: ' + err.message;
    });
}

function stopQRCamera() {
  if (qrStream) { qrStream.getTracks().forEach(t => t.stop()); qrStream = null; }
  if (qrAnimFrame) { cancelAnimationFrame(qrAnimFrame); qrAnimFrame = null; }
  const video = document.getElementById('qr-video');
  if (video) { video.srcObject = null; }
}

function tickQR() {
  if (!qrStream) return;
  const video  = document.getElementById('qr-video');
  const canvas = document.getElementById('qr-canvas');
  if (!video || video.readyState < video.HAVE_ENOUGH_DATA) {
    qrAnimFrame = requestAnimationFrame(tickQR);
    return;
  }
  canvas.width  = video.videoWidth;
  canvas.height = video.videoHeight;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  try {
    const code = jsQR(imageData.data, imageData.width, imageData.height, { inversionAttempts: 'dontInvert' });
    if (code) {
      onQRDetected(code.data);
      return;
    }
  } catch(e) {}
  qrAnimFrame = requestAnimationFrame(tickQR);
}

function scanQRFromFile(event) {
  const file = event.target.files[0];
  if (!file) return;
  const status = document.getElementById('qr-file-status');
  status.textContent = 'កំពុងសំរាយ...';
  const img = new Image();
  const url = URL.createObjectURL(file);
  img.onload = () => {
    const canvas = document.createElement('canvas');
    canvas.width  = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    URL.revokeObjectURL(url);
    try {
      const code = jsQR(imageData.data, imageData.width, imageData.height, { inversionAttempts: 'attemptBoth' });
      if (code) {
        onQRDetected(code.data);
        status.textContent = '✅ បានស្កែនដោយជោគជ័យ!';
        status.style.color = '#059669';
      } else {
        status.textContent = '❌ រកមិនឃើញ QR Code ក្នុងរូបភាពនេះ';
        status.style.color = '#DC2626';
      }
    } catch(e) {
      status.textContent = '❌ កំហុស: ' + e.message;
      status.style.color = '#DC2626';
    }
    event.target.value = '';
  };
  img.src = url;
}

function onQRDetected(raw) {
  stopQRCamera();
  qrParsedData = parseQRData(raw);

  const preview = document.getElementById('qr-result-preview');
  const box     = document.getElementById('qr-result-box');
  const status  = document.getElementById('qr-cam-status');

  // Show human-readable preview
  let html = '';
  if (qrParsedData && typeof qrParsedData === 'object') {
    const labels = {
      id:'លេខបុគ្គលិក', name:'ឈ្មោះ', nameEn:'ឈ្មោះ (EN)', gender:'ភេទ',
      dob:'ថ្ងៃខែឆ្នាំ', phone:'ទូរស័ព្ទ', email:'Email',
      department:'នាយកដ្ឋាន', position:'តួនាទី', bank:'គណនីធនាគារ',
      salary:'ប្រាក់ខែ', startDate:'ថ្ងៃចាប់ផ្ដើម', address:'អាសយដ្ឋាន'
    };
    Object.entries(qrParsedData).forEach(([k,v]) => {
      if (v) html += `<div><b style="color:var(--primary);">${labels[k]||k}:</b> ${v}</div>`;
    });
  } else {
    html = '<div style="word-break:break-all;">' + raw + '</div>';
    // treat raw text as bank/id
    qrParsedData = { bank: raw };
  }

  preview.innerHTML = html || '<span style="color:var(--text-muted);">ទិន្នន័យទទេ</span>';
  box.style.display = '';
  if (status) { status.textContent = '✅ បានស្កែនដោយជោគជ័យ!'; status.style.color = '#059669'; }
}

function parseQRData(raw) {
  // Try JSON first
  try {
    const obj = JSON.parse(raw);
    if (typeof obj === 'object') return obj;
  } catch(e) {}

  // Try key:value lines
  const lines = raw.split(/\n|;/);
  if (lines.length > 1) {
    const obj = {};
    lines.forEach(line => {
      const [k, ...rest] = line.split(':');
      if (k && rest.length) obj[k.trim().toLowerCase()] = rest.join(':').trim();
    });
    if (Object.keys(obj).length > 1) return obj;
  }

  // Plain text — could be bank account or ID
  return { bank: raw.trim() };
}

function applyQRData() {
  if (!qrParsedData) return;
  const d = qrParsedData;
  const set = (id, val) => { const el = document.getElementById(id); if (el && val) el.value = val; };

  set('f-id',        d.id);
  set('f-name',      d.name);
  set('f-name-en',   d.nameEn || d.nameen || d.name_en);
  set('f-phone',     d.phone);
  set('f-email',     d.email);
  set('f-position',  d.position);
  set('f-nid',       d.nid);
  set('f-nation',    d.nationality || d.nation);
  set('f-bank',      d.bank);
  set('f-address',   d.address);
  if (d.gender) { const el = document.getElementById('f-gender'); if (el) el.value = d.gender; }
  if (d.dob)    { const el = document.getElementById('f-dob');    if (el) el.value = d.dob; }
  if (d.salary) { const el = document.getElementById('f-salary'); if (el) el.value = d.salary; }
  if (d.startDate) { const el = document.getElementById('f-startdate'); if (el) el.value = d.startDate; }

  closeQRScanner();
  showToast('បានបំពេញព័ត៌មានពី QR Code រួចរាល់! ✅', 'success');
}

function retryQR() {
  qrParsedData = null;
  document.getElementById('qr-result-box').style.display = 'none';
  if (qrCurrentTab === 'cam') {
    document.getElementById('qr-cam-status').textContent = 'កំពុងស្កែន...';
    document.getElementById('qr-cam-status').style.color = 'var(--text-muted)';
    startQRCamera();
  } else {
    document.getElementById('qr-file-status').textContent = 'ជ្រើសរូបភាពដែលមាន QR Code';
    document.getElementById('qr-file-status').style.color = 'var(--text-muted)';
    document.getElementById('qr-file-input').value = '';
  }
}


// ===== CUSTOM DATE / MONTH PICKER ENGINE =====
(function(){
  'use strict';

  const MONTH_NAMES_KH = ['មករា','កុម្ភៈ','មីនា','មេសា','ឧសភា','មិថុនា','កក្កដា','សីហា','កញ្ញា','តុលា','វិច្ឆិកា','ធ្នូ'];
  const MONTH_NAMES_EN = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const DAY_NAMES_KH   = ['អា','ច','អ','ព','ព្រ','សុ','ស'];
  const DAY_NAMES_EN   = ['Su','Mo','Tu','We','Th','Fr','Sa'];

  // State per picker id
  const _state = {};

  function getMonthNames(){ return (typeof currentLang!=='undefined'&&currentLang==='en') ? MONTH_NAMES_EN : MONTH_NAMES_KH; }
  function getDayNames(){   return (typeof currentLang!=='undefined'&&currentLang==='en') ? DAY_NAMES_EN   : DAY_NAMES_KH;   }

  // Get/set the ISO value stored in the hidden input
  function getVal(id){ return document.getElementById(id)?.value||''; }

  function setVal(id, val, cb){
    const el = document.getElementById(id);
    if(!el) return;
    el.value = val;
    // show/hide clear button
    const clr = document.getElementById('cpk-'+id+'-clear');
    if(clr) clr.classList.toggle('vis', !!val);
    if(cb) try{ cb(); }catch(e){}
  }

  // Display text in input (formatted nicely)
  function fmtDisplay(val, mode){
    if(!val) return '';
    if(mode==='month'){
      const [y,m] = val.split('-');
      const mn = parseInt(m,10)-1;
      const names = getMonthNames();
      return names[mn] + ' ' + y;
    } else {
      // date YYYY-MM-DD
      const [y,m,d] = val.split('-');
      const mn = parseInt(m,10)-1;
      const names = getMonthNames();
      return d + ' ' + names[mn] + ' ' + y;
    }
  }

  // Refresh the displayed text of the input from its value
  function refreshDisplay(id, mode){
    const el = document.getElementById(id);
    if(!el) return;
    const v = el.value;
    el.placeholder = v ? '' : (mode==='month' ? 'ខែ / ឆ្នាំ' : 'DD MMM YYYY');
    // We use a separate span overlay OR just set a data attribute; simpler: we store real ISO in value
    // and show formatted text via a display span next to it.
    // Actually simplest: use the input value but show formatted. 
    // Since input is readonly, set value to formatted string and keep ISO in dataset.
    if(v && v.match(/^\d{4}-\d{2}/)){
      el.dataset.iso = v;
      el.value = fmtDisplay(v, mode);
    }
  }

  // Get ISO back from input (which might be formatted)
  function getISO(id){
    const el = document.getElementById(id);
    if(!el) return '';
    return el.dataset.iso || el.value || '';
  }

  // Override setVal to work with display approach
  function cpkSetISO(id, iso, mode, cb){
    const el = document.getElementById(id);
    if(!el) return;
    el.dataset.iso = iso;
    el.value = fmtDisplay(iso, mode);
    // show/hide clear
    const clr = document.getElementById('cpk-'+id+'-clear');
    if(clr) clr.classList.toggle('vis', !!iso);
    if(cb) try{ cb(); }catch(e){}
  }

  // Patch: when JS code does element.value = '...', intercept by MutationObserver? 
  // Simpler: wrap with a helper. But existing code sets .value directly.
  // Solution: use defineProperty to intercept .value sets on each picker input.
  function interceptValue(id, mode, onChangeCb){
    const el = document.getElementById(id);
    if(!el || el._cpkPatched) return;
    el._cpkPatched = true;
    let _iso = el.value || '';
    Object.defineProperty(el, 'value', {
      get(){ return _iso; },
      set(v){
        _iso = v || '';
        el.dataset.iso = _iso;
        // Update visual display
        const display = _iso ? fmtDisplay(_iso, mode) : '';
        // We need to bypass this setter to set the real DOM value
        Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set.call(el, display);
        // clear btn
        const clr = document.getElementById('cpk-'+id+'-clear');
        if(clr) clr.classList.toggle('vis', !!_iso);
        if(onChangeCb) try{ onChangeCb(); }catch(e){}
      },
      configurable: true
    });
  }

  // ---- Popup state ----
  let _openId   = null;
  let _openMode = null;
  let _openCb   = null;

  // Close all popups
  function cpkCloseAll(except){
    document.querySelectorAll('.cpk-popup.open').forEach(p=>{
      if(p !== except) p.classList.remove('open');
    });
    if(!except){ _openId=null; _openMode=null; }
  }

  // Click outside handler
  document.addEventListener('click', function(e){
    if(!e.target.closest('.cpk-wrap')) cpkCloseAll();
  }, true);

  // ---- Open ----
  window.cpkOpen = function(id, mode, cb){
    const popup = document.getElementById('cpk-'+id+'-popup');
    if(!popup) return;
    // patch value if not yet done
    interceptValue(id, mode, cb||null);
    if(popup.classList.contains('open')){ popup.classList.remove('open'); _openId=null; return; }
    cpkCloseAll(popup);
    _openId   = id;
    _openMode = mode;
    _openCb   = cb||null;

    const iso = getISO(id);
    const now = new Date();
    let y = now.getFullYear(), m = now.getMonth()+1;
    if(iso){
      const parts = iso.split('-');
      y = parseInt(parts[0],10)||y;
      m = parseInt(parts[1],10)||m;
    }
    _state[id] = { viewYear:y, viewMonth:m, viewMode: mode==='month'?'month':'day' };

    popup.classList.add('open');
    renderPopup(id, mode);
  };

  // ---- Clear ----
  window.cpkClear = function(id, mode, cb){
    interceptValue(id, mode, null);
    const el = document.getElementById(id);
    if(el){
      el.dataset.iso = '';
      Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set.call(el, '');
      // patch .value getter/setter iso
      const desc = Object.getOwnPropertyDescriptor(el,'value');
      if(desc && desc.set) { /* use setter */ el.value = ''; } // triggers setter
    }
    const clr = document.getElementById('cpk-'+id+'-clear');
    if(clr) clr.classList.remove('vis');
    if(cb) try{ cb(); }catch(e){}
    cpkCloseAll();
  };

  // ---- Render popup ----
  function renderPopup(id, mode){
    const popup = document.getElementById('cpk-'+id+'-popup');
    if(!popup) return;
    const s = _state[id];
    if(!s) return;

    if(s.viewMode === 'year'){
      renderYearGrid(id, mode, popup);
    } else if(s.viewMode === 'month' || mode === 'month'){
      renderMonthGrid(id, mode, popup);
    } else {
      renderDayGrid(id, popup);
    }
  }

  // ---- Month grid ----
  function renderMonthGrid(id, mode, popup){
    const s = _state[id];
    const iso = getISO(id);
    const selYear  = iso ? parseInt(iso.split('-')[0],10) : null;
    const selMonth = iso ? parseInt(iso.split('-')[1],10) : null;
    const nowY = new Date().getFullYear(), nowM = new Date().getMonth()+1;
    const mn = getMonthNames();

    let html = `<div class="cpk-nav">
      <button class="cpk-nav-btn" onclick="cpkPrevYear('${id}','${mode}')"><i class="fas fa-chevron-left"></i></button>
      <span class="cpk-nav-title" onclick="cpkSwitchView('${id}','year','${mode}')">${s.viewYear}</span>
      <button class="cpk-nav-btn" onclick="cpkNextYear('${id}','${mode}')"><i class="fas fa-chevron-right"></i></button>
    </div><div class="cpk-month-grid">`;

    for(let i=0;i<12;i++){
      const mo = i+1;
      const isSel   = selYear===s.viewYear && selMonth===mo;
      const isToday = nowY===s.viewYear && nowM===mo;
      let cls = 'cpk-month-cell';
      if(isSel) cls += ' selected';
      else if(isToday) cls += ' today-month';
      html += `<div class="${cls}" onclick="cpkPickMonth('${id}','${mode}',${s.viewYear},${mo})">${mn[i]}</div>`;
    }
    html += '</div>';
    popup.innerHTML = html;
  }

  // ---- Year grid ----
  function renderYearGrid(id, mode, popup){
    const s = _state[id];
    const iso = getISO(id);
    const selYear = iso ? parseInt(iso.split('-')[0],10) : null;
    const nowY = new Date().getFullYear();
    const base = Math.floor(s.viewYear/12)*12;

    let html = `<div class="cpk-nav">
      <button class="cpk-nav-btn" onclick="cpkYearPage('${id}','${mode}',-12)"><i class="fas fa-chevron-left"></i></button>
      <span class="cpk-nav-title" style="cursor:default;">${base} – ${base+11}</span>
      <button class="cpk-nav-btn" onclick="cpkYearPage('${id}','${mode}',12)"><i class="fas fa-chevron-right"></i></button>
    </div><div class="cpk-year-grid">`;

    for(let i=0;i<12;i++){
      const yr = base+i;
      let cls = 'cpk-year-cell';
      if(yr===selYear) cls += ' selected';
      else if(yr===nowY) cls += ' today-year';
      html += `<div class="${cls}" onclick="cpkPickYear('${id}','${mode}',${yr})">${yr}</div>`;
    }
    html += '</div>';
    popup.innerHTML = html;
  }

  // ---- Day grid ----
  function renderDayGrid(id, popup){
    const s = _state[id];
    const iso = getISO(id);
    const selY = iso?parseInt(iso.split('-')[0],10):null;
    const selM = iso?parseInt(iso.split('-')[1],10):null;
    const selD = iso?parseInt(iso.split('-')[2],10):null;
    const nowDate = new Date(); const nowY=nowDate.getFullYear(),nowM=nowDate.getMonth()+1,nowD=nowDate.getDate();
    const mn = getMonthNames(); const dn = getDayNames();

    let html = `<div class="cpk-nav">
      <button class="cpk-nav-btn" onclick="cpkPrevMonth('${id}')"><i class="fas fa-chevron-left"></i></button>
      <span class="cpk-nav-title" onclick="cpkSwitchView('${id}','month','date')">${mn[s.viewMonth-1]} ${s.viewYear}</span>
      <button class="cpk-nav-btn" onclick="cpkNextMonth('${id}')"><i class="fas fa-chevron-right"></i></button>
    </div>`;

    html += '<div class="cpk-day-header">';
    dn.forEach(d=>{ html+=`<div class="cpk-day-hcell">${d}</div>`; });
    html += '</div><div class="cpk-day-grid">';

    const firstDay = new Date(s.viewYear, s.viewMonth-1, 1).getDay();
    const daysInMonth = new Date(s.viewYear, s.viewMonth, 0).getDate();
    const prevDays = new Date(s.viewYear, s.viewMonth-1, 0).getDate();

    // Prev month tail
    for(let i=firstDay-1;i>=0;i--){
      const d=prevDays-i;
      html+=`<div class="cpk-day-cell other-month" onclick="cpkPickDay('${id}',${s.viewYear},${s.viewMonth-1||12},${d})">${d}</div>`;
    }
    // Current month
    for(let d=1;d<=daysInMonth;d++){
      let cls='cpk-day-cell';
      if(selY===s.viewYear&&selM===s.viewMonth&&selD===d) cls+=' selected';
      if(nowY===s.viewYear&&nowM===s.viewMonth&&nowD===d) cls+=' today';
      html+=`<div class="${cls}" onclick="cpkPickDay('${id}',${s.viewYear},${s.viewMonth},${d})">${d}</div>`;
    }
    // Next month lead
    const total = firstDay + daysInMonth;
    const trailing = total%7===0?0:7-(total%7);
    for(let d=1;d<=trailing;d++){
      html+=`<div class="cpk-day-cell other-month" onclick="cpkPickDay('${id}',${s.viewYear},${s.viewMonth+1>12?1:s.viewMonth+1},${d})">${d}</div>`;
    }
    html+='</div>';
    popup.innerHTML = html;
  }

  // ---- Navigation helpers ----
  window.cpkPrevYear  = function(id,mode){ _state[id].viewYear--; renderPopup(id,mode); };
  window.cpkNextYear  = function(id,mode){ _state[id].viewYear++; renderPopup(id,mode); };
  window.cpkYearPage  = function(id,mode,delta){ _state[id].viewYear+=delta; renderPopup(id,mode); };
  window.cpkPrevMonth = function(id){ const s=_state[id]; s.viewMonth--; if(s.viewMonth<1){s.viewMonth=12;s.viewYear--;} renderPopup(id,'date'); };
  window.cpkNextMonth = function(id){ const s=_state[id]; s.viewMonth++; if(s.viewMonth>12){s.viewMonth=1;s.viewYear++;} renderPopup(id,'date'); };
  window.cpkSwitchView= function(id,v,mode){ _state[id].viewMode=v; renderPopup(id,mode); };

  // ---- Pick ----
  window.cpkPickMonth = function(id, mode, year, month){
    const iso = year+'-'+String(month).padStart(2,'0');
    interceptValue(id, mode, _openCb);
    const el = document.getElementById(id);
    if(el) el.value = iso; // triggers intercepted setter
    cpkCloseAll();
    if(_openCb) try{_openCb();}catch(e){}
  };

  window.cpkPickYear = function(id, mode, year){
    const s = _state[id];
    s.viewYear = year;
    s.viewMode = 'month';
    renderPopup(id, mode);
  };

  window.cpkPickDay = function(id, year, month, day){
    const m2 = month<1?12:month>12?1:month;
    const y2 = month<1?year-1:month>12?year+1:year;
    const iso = y2+'-'+String(m2).padStart(2,'0')+'-'+String(day).padStart(2,'0');
    interceptValue(id, 'date', _openCb);
    const el = document.getElementById(id);
    if(el) el.value = iso;
    cpkCloseAll();
    if(_openCb) try{_openCb();}catch(e){}
  };

  // ---- Init: intercept .value on all pickers after DOM ready ----
  function initAllPickers(){
    const pickers = [
      {id:'ot-month-filter', mode:'month', cb: ()=>{ try{renderOT();}catch(e){} }},
      {id:'alw-month-filter',mode:'month', cb: ()=>{ try{renderAllowance();}catch(e){} }},
      {id:'ln-month-filter', mode:'month', cb: ()=>{ try{renderLoan();}catch(e){} }},
      {id:'exp-month-filter',mode:'month', cb: ()=>{ try{renderExpenses();}catch(e){} }},
      {id:'ot-date',         mode:'date',  cb: null},
      {id:'alw-month',       mode:'month', cb: null},
      {id:'lnm-start',       mode:'month', cb: ()=>{ try{loanCalcUpdate();}catch(e){} }},
      {id:'expm-date',       mode:'date',  cb: null},
    ];
    pickers.forEach(p=>{
      const el = document.getElementById(p.id);
      if(el) interceptValue(p.id, p.mode, p.cb);
    });
  }

  // Run after app boots
  if(document.readyState==='loading'){
    document.addEventListener('DOMContentLoaded', ()=>setTimeout(initAllPickers,800));
  } else {
    setTimeout(initAllPickers, 800);
  }

})();
