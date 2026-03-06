// ============================================================
// SchemeGuard AI – Fraud Reports Page
// ============================================================

Chart.defaults.color = '#94a3b8';
Chart.defaults.font.family = "'Inter', sans-serif";

// ---- Summary card data --------------------------------------------------
const SUMMARY = { total: 1245892, fraud: 8342, dup: 12405, susp: 24591 };

function animateCount(el, target, prefix = '') {
    const duration = 900;
    const steps = 60;
    const inc = target / steps;
    let current = 0;
    let frame = 0;
    const timer = setInterval(() => {
        frame++;
        current = Math.min(Math.round(inc * frame), target);
        el.textContent = prefix + current.toLocaleString('en-IN');
        if (current >= target) clearInterval(timer);
    }, duration / steps);
}

window.addEventListener('DOMContentLoaded', () => {
    animateCount(document.getElementById('cnt-total'), SUMMARY.total);
    animateCount(document.getElementById('cnt-fraud'), SUMMARY.fraud);
    animateCount(document.getElementById('cnt-dup'), SUMMARY.dup);
    animateCount(document.getElementById('cnt-susp'), SUMMARY.susp);

    initBarChart();
    initLineChart();
    renderSchemeTable();
});

// ---- District Bar Chart (Fraud by District) -----------------------------
const DISTRICT_DATA = {
    UP: {
        labels: ['Lucknow', 'Varanasi', 'Agra', 'Allahabad', 'Gorakhpur', 'Kanpur', 'Meerut', 'Bareilly', 'Jhansi', 'Mathura'],
        data: [2431, 2108, 1952, 1840, 1723, 1605, 1498, 1342, 1120, 987],
    },
    Bihar: {
        labels: ['Patna', 'Gaya', 'Bhagalpur', 'Muzaffarpur', 'Darbhanga', 'Ara', 'Begusarai', 'Purnia', 'Samastipur', 'Hajipur'],
        data: [2120, 1893, 1742, 1601, 1481, 1360, 1249, 1138, 1005, 891],
    },
    MP: {
        labels: ['Bhopal', 'Indore', 'Gwalior', 'Jabalpur', 'Sagar', 'Ujjain', 'Satna', 'Rewa', 'Chhindwara', 'Damoh'],
        data: [1980, 1750, 1620, 1490, 1370, 1240, 1130, 1020, 912, 805],
    },
    Rajasthan: {
        labels: ['Jaipur', 'Jodhpur', 'Kota', 'Udaipur', 'Bikaner', 'Ajmer', 'Bhilwara', 'Sikar', 'Alwar', 'Barmer'],
        data: [2250, 1940, 1780, 1650, 1530, 1410, 1290, 1180, 1060, 930],
    },
};

let barChart;

function initBarChart() {
    const ctx = document.getElementById('district-bar-chart').getContext('2d');
    const state = document.getElementById('state-filter').value;
    const { labels, data } = DISTRICT_DATA[state];

    const gradient = ctx.createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, 'rgba(239,68,68,0.8)');
    gradient.addColorStop(1, 'rgba(239,68,68,0.15)');

    barChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels,
            datasets: [{
                label: 'Fraud Cases',
                data,
                backgroundColor: gradient,
                borderColor: '#ef4444',
                borderWidth: 1,
                borderRadius: 6,
                borderSkipped: false,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    backgroundColor: 'rgba(15,23,42,0.95)',
                    padding: 12,
                    borderColor: 'rgba(255,255,255,0.1)',
                    borderWidth: 1,
                    callbacks: {
                        label: ctx => ` ${ctx.parsed.y.toLocaleString('en-IN')} cases`,
                    }
                }
            },
            scales: {
                y: {
                    grid: { color: 'rgba(255,255,255,0.05)', drawBorder: false },
                    ticks: { padding: 10 },
                    beginAtZero: true,
                },
                x: {
                    grid: { display: false, drawBorder: false },
                    ticks: { padding: 8, font: { size: 11 } },
                }
            }
        }
    });

    document.getElementById('state-filter').addEventListener('change', e => {
        const d = DISTRICT_DATA[e.target.value];
        barChart.data.labels = d.labels;
        barChart.data.datasets[0].data = d.data;
        barChart.update('active');
    });
}

// ---- Trend Line Chart ---------------------------------------------------
function initLineChart() {
    const ctx = document.getElementById('trend-line-chart').getContext('2d');

    const gradBlue = ctx.createLinearGradient(0, 0, 0, 400);
    gradBlue.addColorStop(0, 'rgba(59,130,246,0.45)');
    gradBlue.addColorStop(1, 'rgba(59,130,246,0)');

    const gradRed = ctx.createLinearGradient(0, 0, 0, 400);
    gradRed.addColorStop(0, 'rgba(239,68,68,0.4)');
    gradRed.addColorStop(1, 'rgba(239,68,68,0)');

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'],
            datasets: [
                {
                    label: 'Total Scanned',
                    data: [88400, 92100, 97300, 102000, 108500, 115000, 119200, 124000, 128800, 133500, 138900, 142100],
                    borderColor: '#3b82f6',
                    backgroundColor: gradBlue,
                    borderWidth: 2.5,
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: '#0f172a',
                    pointBorderColor: '#3b82f6',
                    pointBorderWidth: 2,
                    pointRadius: 4,
                    pointHoverRadius: 6,
                },
                {
                    label: 'Fraud Flagged',
                    data: [3820, 4100, 4480, 4950, 5310, 5780, 6120, 6580, 7010, 7560, 7990, 8342],
                    borderColor: '#ef4444',
                    backgroundColor: gradRed,
                    borderWidth: 2.5,
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: '#0f172a',
                    pointBorderColor: '#ef4444',
                    pointBorderWidth: 2,
                    pointRadius: 4,
                    pointHoverRadius: 6,
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                    backgroundColor: 'rgba(15,23,42,0.95)',
                    padding: 12,
                    borderColor: 'rgba(255,255,255,0.1)',
                    borderWidth: 1,
                    callbacks: {
                        label: ctx => ` ${ctx.dataset.label}: ${ctx.parsed.y.toLocaleString('en-IN')}`,
                    }
                }
            },
            scales: {
                y: {
                    grid: { color: 'rgba(255,255,255,0.05)', drawBorder: false },
                    ticks: { padding: 10 },
                },
                x: {
                    grid: { display: false, drawBorder: false },
                    ticks: { padding: 8 },
                }
            },
            interaction: { mode: 'index', intersect: false },
        }
    });
}

// ---- Scheme Table -------------------------------------------------------
const SCHEME_DATA = [
    { name: 'PM Kisan Samman Nidhi', enrolled: 485200, fraud: 2841, dup: 5120, susp: 8940 },
    { name: 'Ayushman Bharat', enrolled: 310500, fraud: 1820, dup: 3210, susp: 5680 },
    { name: 'PMAY-G', enrolled: 198400, fraud: 1240, dup: 1980, susp: 3890 },
    { name: 'MGNREGA', enrolled: 157800, fraud: 1103, dup: 1040, susp: 3201 },
    { name: 'NSAP Pension', enrolled: 93992, fraud: 1338, dup: 1055, susp: 2880 },
];

const RISK_THRESHOLDS = { high: 0.015, medium: 0.008 };

function renderSchemeTable() {
    const tbody = document.getElementById('scheme-table-body');
    tbody.innerHTML = '';
    SCHEME_DATA.forEach(row => {
        const rate = row.fraud / row.enrolled;
        const rateStr = (rate * 100).toFixed(2) + '%';
        let risk, badgeClass;
        if (rate >= RISK_THRESHOLDS.high) { risk = 'High Risk'; badgeClass = 'badge-high'; }
        else if (rate >= RISK_THRESHOLDS.medium) { risk = 'Suspicious'; badgeClass = 'badge-medium'; }
        else { risk = 'Moderate'; badgeClass = 'badge-low'; }

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td style="font-weight:500">${row.name}</td>
            <td>${row.enrolled.toLocaleString('en-IN')}</td>
            <td style="color:var(--danger);font-weight:600">${row.fraud.toLocaleString('en-IN')}</td>
            <td style="color:var(--accent-blue)">${row.dup.toLocaleString('en-IN')}</td>
            <td style="color:var(--warning)">${row.susp.toLocaleString('en-IN')}</td>
            <td>
                <div class="rpt-rate-cell">
                    <div class="rpt-rate-bar-wrap">
                        <div class="rpt-rate-bar" style="width:${Math.min(rate * 3000, 100)}%;background:${rate >= RISK_THRESHOLDS.high ? 'var(--danger)' : rate >= RISK_THRESHOLDS.medium ? 'var(--warning)' : 'var(--success)'}"></div>
                    </div>
                    <span>${rateStr}</span>
                </div>
            </td>
            <td><span class="status-badge ${badgeClass}">${risk}</span></td>
        `;
        tbody.appendChild(tr);
    });
}

// ---- Export buttons ------------------------------------------------------
function mockExport(btn, successText, delay = 1800) {
    const orig = btn.innerHTML;
    btn.classList.add('loading');
    btn.disabled = true;
    setTimeout(() => {
        btn.classList.remove('loading');
        btn.classList.add('success');
        btn.innerHTML = `<i class="fa-solid fa-check"></i><span>${successText}</span>`;
        setTimeout(() => {
            btn.classList.remove('success');
            btn.innerHTML = orig;
            btn.disabled = false;
        }, 2200);
    }, delay);
}

document.getElementById('btn-pdf').addEventListener('click', function () {
    mockExport(this, 'Report Downloaded!');
});
document.getElementById('btn-csv').addEventListener('click', function () {
    mockExport(this, 'CSV Exported!', 1200);
});
document.getElementById('btn-detailed').addEventListener('click', function () {
    mockExport(this, 'Report Generated!', 2400);
});

async function loadReport() {

    const response = await fetch("http://127.0.0.1:8000/report");

    const data = await response.json();

    document.getElementById("report-total").innerText = data.total_records;

    document.getElementById("report-aadhaar").innerText = data.duplicate_aadhaar;

    document.getElementById("report-phone").innerText = data.duplicate_phone;

    document.getElementById("report-bank").innerText = data.duplicate_bank;

    const table = document.getElementById("report-table");

    table.innerHTML = "";

    data.suspicious_list.forEach(person => {

        const row = document.createElement("tr");

        row.innerHTML = `
        <td>${person.name}</td>
        <td>${person.aadhaar}</td>
        <td>${person.phone}</td>
        <td>${person.bank_account}</td>
        <td>${person.address}</td>
        `;

        table.appendChild(row);

    });

}

loadReport();