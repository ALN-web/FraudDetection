// ============================================================
// SchemeGuard AI – Fraud Analysis Results Logic
// ============================================================

// ---- Dataset ----
const ALL_DATA = [
    { id: 'BEN-849201', name: 'Rajesh Kumar', aadhaar: '2389 XXXX 7821', bank: 'SBIN0012389', scheme: 'PM Kisan', score: 94, risk: 'high' },
    { id: 'BEN-739103', name: 'Sunita Devi', aadhaar: '5541 XXXX 3302', bank: 'PUNB0087321', scheme: 'Ayushman', score: 88, risk: 'high' },
    { id: 'BEN-492011', name: 'Amit Singh', aadhaar: '7712 XXXX 0019', bank: 'HDFC0004521', scheme: 'PMAY', score: 65, risk: 'medium' },
    { id: 'BEN-102934', name: 'Meena Kumari', aadhaar: '3398 XXXX 5510', bank: 'CNRB0002341', scheme: 'NSAP', score: 98, risk: 'high' },
    { id: 'BEN-583920', name: 'Vikram Patel', aadhaar: '6645 XXXX 8891', bank: 'BKID0003456', scheme: 'MGNREGA', score: 42, risk: 'low' },
    { id: 'BEN-293811', name: 'Ritu Sharma', aadhaar: '8821 XXXX 4490', bank: 'KKBK0001023', scheme: 'PMJDY', score: 73, risk: 'medium' },
    { id: 'BEN-100293', name: 'Om Prakash Verma', aadhaar: '1212 XXXX 3434', bank: 'SBIN0009821', scheme: 'PM Kisan', score: 91, risk: 'high' },
    { id: 'BEN-552819', name: 'Kamla Devi', aadhaar: '9934 XXXX 1120', bank: 'HDFC0008812', scheme: 'NSAP', score: 27, risk: 'low' },
    { id: 'BEN-770193', name: 'Pradeep Mishra', aadhaar: '4410 XXXX 0293', bank: 'PUNB0066123', scheme: 'Ayushman', score: 79, risk: 'medium' },
    { id: 'BEN-330012', name: 'Geeta Rani', aadhaar: '6620 XXXX 5548', bank: 'CNRB0004412', scheme: 'PMAY', score: 96, risk: 'high' },
    { id: 'BEN-441029', name: 'Sanjay Yadav', aadhaar: '2200 XXXX 8819', bank: 'BKID0012234', scheme: 'MGNREGA', score: 55, risk: 'medium' },
    { id: 'BEN-663001', name: 'Anita Gupta', aadhaar: '7719 XXXX 2230', bank: 'HDFC0007712', scheme: 'PMJDY', score: 18, risk: 'low' },
    { id: 'BEN-881020', name: 'Suresh Chandra', aadhaar: '3310 XXXX 9901', bank: 'SBIN0023310', scheme: 'PM Kisan', score: 87, risk: 'high' },
    { id: 'BEN-990011', name: 'Lalita Prasad', aadhaar: '1120 XXXX 4451', bank: 'KKBK0003321', scheme: 'Ayushman', score: 62, risk: 'medium' },
    { id: 'BEN-112200', name: 'Bharat Singh Rawat', aadhaar: '8830 XXXX 7761', bank: 'CNRB0009981', scheme: 'NSAP', score: 33, risk: 'low' },
    { id: 'BEN-223310', name: 'Pushpa Devi', aadhaar: '4490 XXXX 6601', bank: 'PUNB0041120', scheme: 'MGNREGA', score: 93, risk: 'high' },
    { id: 'BEN-334420', name: 'Mohan Lal', aadhaar: '2280 XXXX 3390', bank: 'BKID0022001', scheme: 'PMAY', score: 71, risk: 'medium' },
    { id: 'BEN-445530', name: 'Savita Kumari', aadhaar: '6609 XXXX 1122', bank: 'HDFC0010120', scheme: 'PMJDY', score: 12, risk: 'low' },
    { id: 'BEN-556640', name: 'Dhruv Patil', aadhaar: '9980 XXXX 4400', bank: 'SBIN0044500', scheme: 'PM Kisan', score: 85, risk: 'high' },
    { id: 'BEN-667750', name: 'Kavita Mehta', aadhaar: '3371 XXXX 8820', bank: 'KKBK0005530', scheme: 'Ayushman', score: 67, risk: 'medium' },
];

const ROWS_PER_PAGE = 8;

let currentPage = 1;
let filteredData = [...ALL_DATA];

// ---- DOM refs ----
const searchInput = document.getElementById('search-input');
const riskFilter = document.getElementById('risk-filter');
const schemeFilter = document.getElementById('scheme-filter');
const resetBtn = document.getElementById('reset-filters');
const tableBody = document.getElementById('fraud-table-body');
const resultCount = document.getElementById('result-count');
const pagination = document.getElementById('pagination');
const exportBtn = document.getElementById('export-btn');
const selectAll = document.getElementById('select-all');

// ---- Risk config ----
const RISK_CONFIG = {
    high: { label: 'High Risk', badgeClass: 'badge-high', scoreClass: 'score-high', glow: 'var(--danger)' },
    medium: { label: 'Suspicious', badgeClass: 'badge-medium', scoreClass: 'score-medium', glow: 'var(--warning)' },
    low: { label: 'Safe', badgeClass: 'badge-low', scoreClass: 'score-low', glow: 'var(--success)' },
};

// ---- Render Table ----
function renderTable(data) {
    const start = (currentPage - 1) * ROWS_PER_PAGE;
    const slice = data.slice(start, start + ROWS_PER_PAGE);

    tableBody.innerHTML = '';

    if (slice.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="9" class="empty-state">No matching records found.</td></tr>`;
        return;
    }

    slice.forEach(row => {
        const cfg = RISK_CONFIG[row.risk];
        const barWidth = row.score;

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><input type="checkbox" class="row-check"></td>
            <td class="mono accent">${row.id}</td>
            <td class="fw-medium">${row.name}</td>
            <td class="mono">${row.aadhaar}</td>
            <td class="mono">${row.bank}</td>
            <td>${row.scheme}</td>
            <td>
                <div class="score-cell">
                    <div class="score-bar-wrap">
                        <div class="score-bar ${cfg.scoreClass}" style="width:${barWidth}%"></div>
                    </div>
                    <span class="score-num ${cfg.scoreClass}">${row.score}</span>
                </div>
            </td>
            <td><span class="status-badge ${cfg.badgeClass}">${cfg.label}</span></td>
            <td><button class="action-btn">Review</button></td>
        `;
        tableBody.appendChild(tr);
    });
}

// ---- Render Pagination ----
function renderPagination(total) {
    const pages = Math.ceil(total / ROWS_PER_PAGE);
    pagination.innerHTML = '';

    if (pages <= 1) return;

    const prev = document.createElement('button');
    prev.className = 'page-btn';
    prev.innerHTML = '<i class="fa-solid fa-chevron-left"></i>';
    prev.disabled = currentPage === 1;
    prev.addEventListener('click', () => { currentPage--; render(); });
    pagination.appendChild(prev);

    for (let i = 1; i <= pages; i++) {
        const btn = document.createElement('button');
        btn.className = 'page-btn' + (i === currentPage ? ' active' : '');
        btn.textContent = i;
        btn.addEventListener('click', () => { currentPage = i; render(); });
        pagination.appendChild(btn);
    }

    const next = document.createElement('button');
    next.className = 'page-btn';
    next.innerHTML = '<i class="fa-solid fa-chevron-right"></i>';
    next.disabled = currentPage === pages;
    next.addEventListener('click', () => { currentPage++; render(); });
    pagination.appendChild(next);
}

// ---- Update Sidebar Counts ----
function updateSidebar(data) {
    const total = data.length || 1;
    const high = data.filter(r => r.risk === 'high').length;
    const medium = data.filter(r => r.risk === 'medium').length;
    const low = data.filter(r => r.risk === 'low').length;

    animateCount(document.getElementById('count-high'), high);
    animateCount(document.getElementById('count-medium'), medium);
    animateCount(document.getElementById('count-low'), low);

    document.getElementById('bar-high').style.width = ((high / total) * 100).toFixed(0) + '%';
    document.getElementById('bar-medium').style.width = ((medium / total) * 100).toFixed(0) + '%';
    document.getElementById('bar-low').style.width = ((low / total) * 100).toFixed(0) + '%';
}

// ---- Animate Number Counter ----
function animateCount(el, target) {
    const duration = 600;
    const step = Math.max(1, Math.ceil(target / (duration / 16)));
    let current = 0;
    const timer = setInterval(() => {
        current = Math.min(current + step, target);
        el.textContent = current;
        if (current >= target) clearInterval(timer);
    }, 16);
}

// ---- Filter Logic ----
function applyFilters() {
    const q = searchInput.value.trim().toLowerCase();
    const risk = riskFilter.value;
    const scheme = schemeFilter.value;

    filteredData = ALL_DATA.filter(row => {
        const matchSearch = !q || row.name.toLowerCase().includes(q) ||
            row.id.toLowerCase().includes(q) ||
            row.aadhaar.toLowerCase().includes(q);
        const matchRisk = risk === 'all' || row.risk === risk;
        const matchScheme = scheme === 'all' || row.scheme.includes(scheme);
        return matchSearch && matchRisk && matchScheme;
    });

    currentPage = 1;
    render();
}

// ---- Master Render ----
function render() {
    renderTable(filteredData);
    renderPagination(filteredData.length);
    updateSidebar(filteredData);
    resultCount.innerHTML = `Showing <b>${filteredData.length}</b> of <b>${ALL_DATA.length}</b> records`;
}

// ---- Select All checkbox ----
selectAll.addEventListener('change', () => {
    document.querySelectorAll('.row-check').forEach(cb => cb.checked = selectAll.checked);
});

// ---- Event Listeners ----
searchInput.addEventListener('input', applyFilters);
riskFilter.addEventListener('change', applyFilters);
schemeFilter.addEventListener('change', applyFilters);

resetBtn.addEventListener('click', () => {
    searchInput.value = '';
    riskFilter.value = 'all';
    schemeFilter.value = 'all';
    applyFilters();
});

exportBtn.addEventListener('click', () => {
    exportBtn.innerHTML = '<i class="fa-solid fa-check"></i> Exported!';
    exportBtn.style.background = 'linear-gradient(135deg,#059669,#10b981)';
    setTimeout(() => {
        exportBtn.innerHTML = '<i class="fa-solid fa-file-export"></i> Export Report';
        exportBtn.style.background = '';
    }, 2000);
});

// ---- Initial Render ----
render();

async function loadNetworkGraph() {

    const response = await fetch("http://127.0.0.1:8000/network");

    const data = await response.json();

    const cy = cytoscape({

        container: document.getElementById('fraud-graph'),

        elements: [
            ...data.nodes,
            ...data.edges
        ],

        style: [

            {
                selector: 'node',
                style: {
                    'label': 'data(label)',
                    'background-color': '#0D8ABC',
                    'color': '#fff',
                    'text-valign': 'center',
                    'font-size': '10px'
                }
            },

            {
                selector: 'edge',
                style: {
                    'width': 2,
                    'line-color': '#aaa'
                }
            }

        ],

        layout: {
            name: 'cose',
            animate: true
        }

    });

}

loadNetworkGraph();