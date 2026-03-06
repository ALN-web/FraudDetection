// --- Chart Config & Global Settings ---
Chart.defaults.color = '#94a3b8';
Chart.defaults.font.family = "'Inter', sans-serif";

// === Line Chart (Fraud Detection Trend) ===
const ctxLine = document.getElementById('fraudTrendChart').getContext('2d');

const gradientBlue = ctxLine.createLinearGradient(0, 0, 0, 400);
gradientBlue.addColorStop(0, 'rgba(59, 130, 246, 0.5)');
gradientBlue.addColorStop(1, 'rgba(59, 130, 246, 0.0)');

const gradientRed = ctxLine.createLinearGradient(0, 0, 0, 400);
gradientRed.addColorStop(0, 'rgba(239, 68, 68, 0.5)');
gradientRed.addColorStop(1, 'rgba(239, 68, 68, 0.0)');

const fraudTrendChart = new Chart(ctxLine, {
    type: 'line',
    data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
        datasets: [
            {
                label: 'Total Scanned',
                data: [65000, 72000, 80000, 81000, 96000, 105000, 110000],
                borderColor: '#3b82f6',
                backgroundColor: gradientBlue,
                borderWidth: 2,
                pointBackgroundColor: '#0f172a',
                pointBorderColor: '#3b82f6',
                pointBorderWidth: 2,
                pointRadius: 4,
                pointHoverRadius: 6,
                fill: true,
                tension: 0.4
            },
            {
                label: 'Suspicious Flagged',
                data: [4200, 4500, 5100, 4800, 6200, 7100, 8342],
                borderColor: '#ef4444',
                backgroundColor: gradientRed,
                borderWidth: 2,
                pointBackgroundColor: '#0f172a',
                pointBorderColor: '#ef4444',
                pointBorderWidth: 2,
                pointRadius: 4,
                pointHoverRadius: 6,
                fill: true,
                tension: 0.4
            }
        ]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
                align: 'end',
                labels: {
                    usePointStyle: true,
                    boxWidth: 8,
                    padding: 20
                }
            },
            tooltip: {
                backgroundColor: 'rgba(15, 23, 42, 0.9)',
                titleColor: '#f8fafc',
                bodyColor: '#f8fafc',
                borderColor: 'rgba(255, 255, 255, 0.1)',
                borderWidth: 1,
                padding: 12,
                displayColors: true,
                boxPadding: 6
            }
        },
        scales: {
            y: {
                grid: {
                    color: 'rgba(255, 255, 255, 0.05)',
                    drawBorder: false,
                },
                ticks: {
                    padding: 10
                }
            },
            x: {
                grid: {
                    display: false,
                    drawBorder: false,
                },
                ticks: {
                    padding: 10
                }
            }
        },
        interaction: {
            intersect: false,
            mode: 'index',
        },
    }
});

// === Pie Chart (Fraud Distribution) ===
const ctxPie = document.getElementById('fraudDistributionChart').getContext('2d');
const fraudDistributionChart = new Chart(ctxPie, {
    type: 'doughnut',
    data: {
        labels: ['Identity Theft', 'Duplicate Claims', 'Deceased Beneficiary', 'Income Falsification', 'Ghost Entities'],
        datasets: [{
            data: [35, 25, 15, 15, 10],
            backgroundColor: [
                '#ef4444', // Red (Identity Theft)
                '#f59e0b', // Yellow (Duplicate)
                '#8b5cf6', // Purple (Deceased)
                '#06b6d4', // Cyan (Income)
                '#64748b'  // Gray (Ghost)
            ],
            borderWidth: 0,
            hoverOffset: 4
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '75%',
        plugins: {
            legend: {
                position: 'bottom',
                labels: {
                    usePointStyle: true,
                    padding: 20,
                    font: {
                        size: 11
                    }
                }
            },
            tooltip: {
                backgroundColor: 'rgba(15, 23, 42, 0.9)',
                padding: 12,
                callbacks: {
                    label: function(context) {
                        return ` ${context.label}: ${context.raw}%`;
                    }
                }
            }
        }
    }
});

// === Populate Data Table ===
const tableData = [
    {
        id: 'BEN-849201',
        name: 'Rajesh Kumar',
        scheme: 'PM Kisan Samman Nidhi',
        riskScore: 94,
        reason: 'Multiple Bank Accts (Aadhaar Linked)',
        status: 'Flagged',
        statusClass: 'status-flagged',
        riskClass: 'high'
    },
    {
        id: 'BEN-739103',
        name: 'Sunita Devi',
        scheme: 'Ayushman Bharat',
        riskScore: 88,
        reason: 'Ghost Entity / Non-existent',
        status: 'Investigating',
        statusClass: 'status-investigating',
        riskClass: 'high'
    },
    {
        id: 'BEN-492011',
        name: 'Amit Singh',
        scheme: 'PMAY-G',
        riskScore: 65,
        reason: 'Income Mismatch (ITR Data)',
        status: 'Investigating',
        statusClass: 'status-investigating',
        riskClass: 'medium'
    },
    {
        id: 'BEN-102934',
        name: 'Meena Kumari',
        scheme: 'NSAP Pension',
        riskScore: 98,
        reason: 'Deceased Beneficiary Database Match',
        status: 'Flagged',
        statusClass: 'status-flagged',
        riskClass: 'high'
    },
    {
        id: 'BEN-583920',
        name: 'Vikram Patel',
        scheme: 'MGNREGA',
        riskScore: 42,
        reason: 'Suspicious Job Card Usage',
        status: 'Resolved',
        statusClass: 'status-resolved',
        riskClass: 'low'
    }
];

const tableBody = document.getElementById('suspicious-table-body');

function renderTable() {
    tableBody.innerHTML = '';
    
    tableData.forEach(row => {
        const tr = document.createElement('tr');
        
        tr.innerHTML = `
            <td style="font-family: monospace; color: var(--accent-cyan);">${row.id}</td>
            <td style="font-weight: 500;">${row.name}</td>
            <td>${row.scheme}</td>
            <td>
                <div class="risk-level">
                    <div class="risk-indicator ${row.riskClass}"></div>
                    <span>${row.riskScore}/100</span>
                </div>
            </td>
            <td style="color: var(--text-secondary);">${row.reason}</td>
            <td><span class="status-badge ${row.statusClass}">${row.status}</span></td>
            <td><button class="action-btn">Review</button></td>
        `;
        
        tableBody.appendChild(tr);
    });
}

// Initial render
document.addEventListener('DOMContentLoaded', () => {
    renderTable();
});
