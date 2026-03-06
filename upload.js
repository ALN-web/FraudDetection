// =============================================
// SchemeGuard AI – Upload Dataset Logic
// =============================================

const uploadZone = document.getElementById('upload-zone');
const fileInput = document.getElementById('file-input');
const browseBtn = document.getElementById('browse-btn');
const analyzeBtn = document.getElementById('analyze-btn');
const previewBody = document.getElementById('preview-table-body');
const valTotal = document.getElementById('val-total');
const valDuplicates = document.getElementById('val-duplicates');
const valMissing = document.getElementById('val-missing');
const progressBlock = document.getElementById('upload-progress');
const uploadBar = document.getElementById('upload-bar');
const uploadFilename = document.getElementById('upload-filename');
const uploadPercent = document.getElementById('upload-percent');

// ---- Sample data simulating a parsed CSV ----
const sampleData = [
    { name: 'Ramesh Prasad', aadhaar: '2389 XXXX 7821', phone: '98765 XXXXX', bank: 'SBIN0012389', address: '12 Nehru Nagar, Lucknow, UP' },
    { name: 'Sunita Devi', aadhaar: '5541 XXXX 3302', phone: '91234 XXXXX', bank: 'PUNB0087321', address: '45 Gandhi Colony, Patna, Bihar' },
    { name: 'Amit Kumar', aadhaar: '7712 XXXX 0019', phone: '88001 XXXXX', bank: 'HDFC0004521', address: 'Village Rampur, Gorakhpur, UP' },
    { name: 'Meena Kumari', aadhaar: '3398 XXXX 5510', phone: '99100 XXXXX', bank: 'CNRB0002341', address: '78 Station Road, Bhopal, MP' },
    { name: 'Suresh Yadav', aadhaar: '2389 XXXX 7821', phone: '98765 XXXXX', bank: 'SBIN0012389', address: '12 Nehru Nagar, Lucknow, UP' },  // duplicate
    { name: 'Priya Singh', aadhaar: '8821 XXXX 4490', phone: '', bank: 'KKBK0001023', address: '90 MG Road, Jaipur, Raj' },        // missing phone
    { name: 'Kajal Sharma', aadhaar: '1212 XXXX 3434', phone: '70020 XXXXX', bank: '', address: 'Plot 5, Sector 12, Noida, UP' },   // missing bank
    { name: 'Om Prakash Verma', aadhaar: '6645 XXXX 8891', phone: '81112 XXXXX', bank: 'BKID0003456', address: '65 Civil Lines, Allahabad, UP' },
];

// Compute summary metrics from data
function computeMetrics(data) {
    const total = data.length;

    // Duplicate detection by Aadhaar
    const aadhaarCounts = {};
    data.forEach(r => {
        aadhaarCounts[r.aadhaar] = (aadhaarCounts[r.aadhaar] || 0) + 1;
    });
    const duplicates = data.filter(r => aadhaarCounts[r.aadhaar] > 1).length;

    // Missing data detection
    const missing = data.filter(r => !r.phone || !r.bank || !r.address).length;

    return { total, duplicates, missing };
}

// Render summary counter with animation
function animateCount(el, target) {
    const duration = 800;
    const step = Math.ceil(target / (duration / 16));
    let current = 0;
    const timer = setInterval(() => {
        current = Math.min(current + step, target);
        el.textContent = current.toLocaleString();
        if (current >= target) clearInterval(timer);
    }, 16);
}

// Render preview table
function renderPreview(data) {
    const aadhaarCounts = {};
    data.forEach(r => { aadhaarCounts[r.aadhaar] = (aadhaarCounts[r.aadhaar] || 0) + 1; });

    previewBody.innerHTML = '';

    data.forEach(row => {
        const isDuplicate = aadhaarCounts[row.aadhaar] > 1;
        const hasMissing = !row.phone || !row.bank || !row.address;

        const tr = document.createElement('tr');
        if (isDuplicate) tr.style.borderLeft = '3px solid var(--warning)';

        tr.innerHTML = `
            <td style="font-weight:500">${row.name}</td>
            <td style="font-family:monospace; color:var(--accent-cyan)">
                ${row.aadhaar}
                ${isDuplicate ? '<span class="status-badge status-investigating" style="margin-left:8px;font-size:10px">Duplicate</span>' : ''}
            </td>
            <td>${row.phone || '<span style="color:var(--danger)">Missing</span>'}</td>
            <td style="font-family:monospace">${row.bank || '<span style="color:var(--danger)">Missing</span>'}</td>
            <td style="color:var(--text-secondary)">${row.address || '<span style="color:var(--danger)">Missing</span>'}</td>
        `;
        previewBody.appendChild(tr);
    });
}

// Simulate upload progress bar
function simulateUpload(filename, onComplete) {
    progressBlock.classList.remove('hidden');
    uploadFilename.textContent = filename;
    let pct = 0;
    const interval = setInterval(() => {
        pct = Math.min(pct + Math.random() * 15, 100);
        const rounded = Math.round(pct);
        uploadBar.style.width = rounded + '%';
        uploadPercent.textContent = rounded + '%';
        if (pct >= 100) {
            clearInterval(interval);
            setTimeout(onComplete, 300);
        }
    }, 80);
}

// Handle file — real CSV or mock with sample data
function handleFile(file) {
    if (!file) return;

    uploadZone.classList.add('file-loaded');
    uploadZone.querySelector('h3').textContent = `File: ${file.name}`;
    uploadZone.querySelector('p').textContent = `${(file.size / 1024).toFixed(1)} KB`;

    simulateUpload(file.name, () => {
        // Try to parse actual CSV, fall back to sample data
        if (file.type === 'text/csv' || file.name.endsWith('.csv')) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const lines = e.target.result.trim().split('\n');
                const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
                const rows = lines.slice(1).map(line => {
                    const cols = line.split(',');
                    return {
                        name: cols[headers.indexOf('name')] || cols[0] || '',
                        aadhaar: cols[headers.indexOf('aadhaar')] || cols[1] || '',
                        phone: cols[headers.indexOf('phone')] || cols[2] || '',
                        bank: cols[headers.indexOf('bank')] || cols[3] || '',
                        address: cols[headers.indexOf('address')] || cols[4] || '',
                    };
                }).filter(r => r.name);

                const data = rows.length > 0 ? rows : sampleData;
                finaliseData(data);
            };
            reader.readAsText(file);
        } else {
            finaliseData(sampleData);
        }
    });
}

function finaliseData(data) {
    renderPreview(data);
    const metrics = computeMetrics(data);
    animateCount(valTotal, metrics.total);
    animateCount(valDuplicates, metrics.duplicates);
    animateCount(valMissing, metrics.missing);
    analyzeBtn.disabled = false;
}

// ---- Event listeners ----

// Click on zone or browse button
uploadZone.addEventListener('click', () => fileInput.click());
browseBtn.addEventListener('click', (e) => { e.stopPropagation(); fileInput.click(); });

// File selected from dialog
fileInput.addEventListener('change', () => {
    if (fileInput.files[0]) handleFile(fileInput.files[0]);
});

// Drag events
uploadZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadZone.classList.add('dragover');
});

uploadZone.addEventListener('dragleave', () => {
    uploadZone.classList.remove('dragover');
});

uploadZone.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadZone.classList.remove('dragover');
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
});

// Analyze button – navigate to dashboard (placeholder)
// analyzeBtn.addEventListener('click', () => {
//     analyzeBtn.textContent = 'Processing…';
//     analyzeBtn.disabled = true;
//     setTimeout(() => {
//         window.location.href = 'index.html';
//     }, 1200);
// });

document.getElementById("analyze-btn").addEventListener("click", analyzeData);

async function analyzeData() {

    try {

        const response = await fetch("http://127.0.0.1:8000/analyze");

        const data = await response.json();

        console.log("Total Records:", data.total_records);
        console.log("Suspicious Records:", data.suspicious_records);
        console.log("Duplicates Aadhaar:", data.duplicates_aadhaar);
        console.log("Duplicates Phone:", data.duplicates_phone);

    } catch (error) {

        console.error("Error analyzing data:", error);

    }

}

async function analyzeData() {

    const analyzeBtn = document.getElementById("analyze-btn");

    // show loading
    analyzeBtn.innerText = "Analyzing...";
    analyzeBtn.disabled = true;

    try {

        const response = await fetch("http://127.0.0.1:8000/analyze");

        const data = await response.json();

        console.log("Fraud Analysis Result:", data);

        // UPDATE SUMMARY PANEL
        document.getElementById("val-total").innerText = data.total_records;

        document.getElementById("val-duplicates").innerText =
            data.duplicates_aadhaar + data.duplicates_phone + data.duplicates_bank;

        document.getElementById("val-missing").innerText =
            data.suspicious_records;

        // UPDATE TABLE WITH FRAUD RECORDS
        const tableBody = document.getElementById("preview-table-body");
        tableBody.innerHTML = "";

        data.suspicious_list.forEach(person => {

            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${person.name}</td>
                <td>${person.aadhaar}</td>
                <td>${person.phone}</td>
                <td>${person.bank_account}</td>
                <td>${person.address}</td>
            `;

            tableBody.appendChild(row);

        });

        analyzeBtn.innerText = "Analysis Complete";

    } catch (error) {

        console.error("Error analyzing data:", error);

        analyzeBtn.innerText = "Analyze Data";
        analyzeBtn.disabled = false;

    }

}