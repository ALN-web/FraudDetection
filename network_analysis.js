// ============================================================
// SchemeGuard AI – Fraud Network Analysis (D3 v7)
// ============================================================

// ---- Data ----------------------------------------------------------------
const RAW_NODES = [
    // Beneficiaries
    { id: 'B1', label: 'Rajesh Kumar', type: 'beneficiary', risk: 'high', scheme: 'PM Kisan', aadhaar: '2389 XXXX 7821', score: 94 },
    { id: 'B2', label: 'Sunita Devi', type: 'beneficiary', risk: 'high', scheme: 'Ayushman', aadhaar: '5541 XXXX 3302', score: 88 },
    { id: 'B3', label: 'Amit Singh', type: 'beneficiary', risk: 'medium', scheme: 'PMAY', aadhaar: '7712 XXXX 0019', score: 65 },
    { id: 'B4', label: 'Meena Kumari', type: 'beneficiary', risk: 'high', scheme: 'NSAP', aadhaar: '3398 XXXX 5510', score: 98 },
    { id: 'B5', label: 'Vikram Patel', type: 'beneficiary', risk: 'low', scheme: 'MGNREGA', aadhaar: '6645 XXXX 8891', score: 42 },
    { id: 'B6', label: 'Om Prakash Verma', type: 'beneficiary', risk: 'high', scheme: 'PM Kisan', aadhaar: '1212 XXXX 3434', score: 91 },
    { id: 'B7', label: 'Ritu Sharma', type: 'beneficiary', risk: 'medium', scheme: 'Ayushman', aadhaar: '8821 XXXX 4490', score: 73 },
    { id: 'B8', label: 'Pradeep Mishra', type: 'beneficiary', risk: 'medium', scheme: 'MGNREGA', aadhaar: '4410 XXXX 0293', score: 79 },
    { id: 'B9', label: 'Geeta Rani', type: 'beneficiary', risk: 'high', scheme: 'PMAY', aadhaar: '6620 XXXX 5548', score: 96 },
    { id: 'B10', label: 'Kamla Devi', type: 'beneficiary', risk: 'low', scheme: 'NSAP', aadhaar: '9934 XXXX 1120', score: 27 },

    // Bank Accounts
    { id: 'BA1', label: 'SBIN0012389', type: 'bank', detail: 'State Bank of India' },
    { id: 'BA2', label: 'HDFC0004521', type: 'bank', detail: 'HDFC Bank' },
    { id: 'BA3', label: 'PUNB0087321', type: 'bank', detail: 'Punjab National Bank' },
    { id: 'BA4', label: 'CNRB0002341', type: 'bank', detail: 'Canara Bank' },

    // Phone Numbers
    { id: 'PH1', label: '+91 98765XXXXX', type: 'phone' },
    { id: 'PH2', label: '+91 91234XXXXX', type: 'phone' },
    { id: 'PH3', label: '+91 88001XXXXX', type: 'phone' },

    // Addresses
    { id: 'AD1', label: 'Nehru Nagar, Lucknow', type: 'address' },
    { id: 'AD2', label: 'Gandhi Colony, Patna', type: 'address' },
    { id: 'AD3', label: 'Rampur, Gorakhpur', type: 'address' },
    { id: 'AD4', label: 'Station Road, Bhopal', type: 'address' },
];

const RAW_LINKS = [
    // Duplicated bank – fraud cluster
    { source: 'B1', target: 'BA1', label: 'Same Account' },
    { source: 'B6', target: 'BA1', label: 'Same Account' },   // B1 & B6 share BA1 → duplicate
    { source: 'B1', target: 'PH1', label: 'Phone' },
    { source: 'B6', target: 'PH1', label: 'Phone' },           // same phone too
    { source: 'B1', target: 'AD1', label: 'Address' },
    { source: 'B6', target: 'AD1', label: 'Address' },

    { source: 'B2', target: 'BA3', label: 'Account' },
    { source: 'B2', target: 'PH2', label: 'Phone' },
    { source: 'B2', target: 'AD2', label: 'Address' },

    { source: 'B3', target: 'BA2', label: 'Account' },
    { source: 'B3', target: 'PH3', label: 'Phone' },
    { source: 'B3', target: 'AD3', label: 'Address' },

    { source: 'B4', target: 'BA4', label: 'Account' },
    { source: 'B4', target: 'PH2', label: 'Phone' },           // B2 & B4 share phone → suspicious
    { source: 'B4', target: 'AD4', label: 'Address' },

    { source: 'B5', target: 'BA2', label: 'Account' },
    { source: 'B5', target: 'PH3', label: 'Phone' },
    { source: 'B5', target: 'AD3', label: 'Address' },          // B3 & B5 share address

    { source: 'B7', target: 'BA3', label: 'Account' },
    { source: 'B7', target: 'PH1', label: 'Phone' },
    { source: 'B7', target: 'AD2', label: 'Address' },

    { source: 'B8', target: 'BA1', label: 'Account' },          // B8 shares bank with B1/B6 cluster
    { source: 'B8', target: 'PH3', label: 'Phone' },
    { source: 'B8', target: 'AD3', label: 'Address' },

    { source: 'B9', target: 'BA4', label: 'Account' },
    { source: 'B9', target: 'PH2', label: 'Phone' },
    { source: 'B9', target: 'AD4', label: 'Address' },

    { source: 'B10', target: 'BA2', label: 'Account' },
    { source: 'B10', target: 'PH3', label: 'Phone' },
    { source: 'B10', target: 'AD3', label: 'Address' },
];

// ---- Color helpers -------------------------------------------------------
const NODE_COLOR = {
    beneficiary: { high: '#ef4444', medium: '#f59e0b', low: '#10b981' },
    bank: '#3b82f6',
    phone: '#8b5cf6',
    address: '#06b6d4',
};

function nodeColor(d) {
    if (d.type === 'beneficiary') return NODE_COLOR.beneficiary[d.risk];
    return NODE_COLOR[d.type];
}

function nodeRadius(d) {
    if (d.type === 'beneficiary') return 18;
    if (d.type === 'bank') return 14;
    return 11;
}

function nodeIcon(d) {
    const M = { beneficiary: '\uf007', bank: '\uf19c', phone: '\uf095', address: '\uf3c5' };
    return M[d.type] || '\uf111';
}

// ---- State ---------------------------------------------------------------
let activeScheme = 'all';
let activeRisk = 'all';
let searchQuery = '';
let simulation, svg, g, linkSel, nodeSel, labelSel;
let paused = false;

// ---- Build filtered graph ------------------------------------------------
function buildGraph() {
    const visibleIds = new Set(
        RAW_NODES
            .filter(n => {
                if (n.type !== 'beneficiary') return true; // always show non-beneficiary initially
                if (activeScheme !== 'all' && n.scheme !== activeScheme) return false;
                if (activeRisk !== 'all' && n.risk !== activeRisk) return false;
                if (searchQuery && !n.label.toLowerCase().includes(searchQuery) &&
                    !n.id.toLowerCase().includes(searchQuery)) return false;
                return true;
            })
            .map(n => n.id)
    );

    // Also include utility nodes connected to visible beneficiaries
    const linkedUtil = new Set();
    RAW_LINKS.forEach(l => {
        if (visibleIds.has(l.source) || visibleIds.has(l.target)) {
            linkedUtil.add(l.source);
            linkedUtil.add(l.target);
        }
    });

    const nodes = RAW_NODES.filter(n => linkedUtil.has(n.id)).map(n => ({ ...n }));
    const nodeSet = new Set(nodes.map(n => n.id));
    const links = RAW_LINKS
        .filter(l => nodeSet.has(l.source) && nodeSet.has(l.target))
        .map(l => ({ ...l }));

    return { nodes, links };
}

// ---- Init D3 graph -------------------------------------------------------
function initGraph() {
    svg = d3.select('#network-graph');
    const wrap = document.querySelector('.network-canvas-wrap');
    const W = wrap.clientWidth;
    const H = wrap.clientHeight - 44; // minus toolbar

    svg.attr('width', W).attr('height', H);

    // Defs: glow filters
    const defs = svg.append('defs');
    ['red', 'amber', 'green', 'blue', 'purple', 'cyan'].forEach((name, i) => {
        const colors = ['#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#06b6d4'];
        const f = defs.append('filter').attr('id', `glow-${name}`).attr('x', '-50%').attr('y', '-50%').attr('width', '200%').attr('height', '200%');
        f.append('feGaussianBlur').attr('in', 'SourceGraphic').attr('stdDeviation', '4').attr('result', 'blur');
        f.append('feFlood').attr('flood-color', colors[i]).attr('flood-opacity', '0.6').attr('result', 'color');
        f.append('feComposite').attr('in', 'color').attr('in2', 'blur').attr('operator', 'in').attr('result', 'shadow');
        const merge = f.append('feMerge');
        merge.append('feMergeNode').attr('in', 'shadow');
        merge.append('feMergeNode').attr('in', 'SourceGraphic');
    });

    // Zoomable group
    g = svg.append('g');

    const zoom = d3.zoom()
        .scaleExtent([0.2, 4])
        .on('zoom', e => g.attr('transform', e.transform));
    svg.call(zoom);

    // Reset zoom btn
    document.getElementById('btn-reset-zoom').addEventListener('click', () => {
        svg.transition().duration(500).call(zoom.transform, d3.zoomIdentity.translate(W / 2, H / 2).scale(0.9));
    });

    document.getElementById('btn-pause').addEventListener('click', () => {
        paused = !paused;
        const icon = document.querySelector('#btn-pause i');
        if (paused) { simulation.stop(); icon.className = 'fa-solid fa-play'; }
        else { simulation.restart(); icon.className = 'fa-solid fa-pause'; }
    });

    document.getElementById('btn-reheat').addEventListener('click', () => {
        paused = false;
        document.querySelector('#btn-pause i').className = 'fa-solid fa-pause';
        simulation.alpha(0.8).restart();
    });

    renderGraph(W, H, zoom);
}

// ---- Render / Re-render graph --------------------------------------------
function renderGraph(W, H, zoom) {
    const { nodes, links } = buildGraph();

    // Update stats
    document.getElementById('stat-nodes').textContent = nodes.length;
    document.getElementById('stat-links').textContent = links.length;

    // Count fraud clusters (shared utility nodes connected to 2+ high risk)
    const sharedWith = {};
    links.forEach(l => {
        const tgt = typeof l.target === 'object' ? l.target.id : l.target;
        const src = typeof l.source === 'object' ? l.source.id : l.source;
        if (!sharedWith[tgt]) sharedWith[tgt] = [];
        sharedWith[tgt].push(src);
    });
    const clusters = Object.values(sharedWith).filter(arr => arr.length > 1).length;
    document.getElementById('stat-clusters').textContent = clusters;

    // Clear previous
    g.selectAll('*').remove();

    // Force simulation
    simulation = d3.forceSimulation(nodes)
        .force('link', d3.forceLink(links).id(d => d.id).distance(d => {
            if (d.source.type === 'beneficiary' && d.target.type === 'beneficiary') return 120;
            return 80;
        }).strength(0.6))
        .force('charge', d3.forceManyBody().strength(-220))
        .force('center', d3.forceCenter(W / 2, H / 2))
        .force('collision', d3.forceCollide().radius(d => nodeRadius(d) + 12));

    // Links
    linkSel = g.append('g').selectAll('line')
        .data(links).join('line')
        .attr('class', 'link-line')
        .attr('stroke', d => {
            const src = typeof d.source === 'object' ? d.source : nodes.find(n => n.id === d.source);
            return src && src.type === 'beneficiary' ? nodeColor(src) : '#334155';
        })
        .attr('stroke-width', 1.5);

    // Node groups
    const nodeGroup = g.append('g').selectAll('g')
        .data(nodes).join('g')
        .attr('class', 'node-group')
        .style('cursor', 'pointer')
        .call(d3.drag()
            .on('start', (e, d) => { if (!e.active) simulation.alphaTarget(0.3).restart(); d.fx = d.x; d.fy = d.y; })
            .on('drag', (e, d) => { d.fx = e.x; d.fy = e.y; })
            .on('end', (e, d) => { if (!e.active) simulation.alphaTarget(0); d.fx = null; d.fy = null; })
        )
        .on('mouseover', onNodeOver)
        .on('mousemove', onNodeMove)
        .on('mouseout', onNodeOut)
        .on('click', onNodeClick);

    // Outer glow ring
    nodeGroup.append('circle')
        .attr('r', d => nodeRadius(d) + 6)
        .attr('fill', 'none')
        .attr('stroke', d => nodeColor(d))
        .attr('stroke-width', 1)
        .attr('stroke-opacity', 0.3)
        .attr('filter', d => {
            if (d.type === 'beneficiary') {
                return { high: 'url(#glow-red)', medium: 'url(#glow-amber)', low: 'url(#glow-green)' }[d.risk];
            }
            return { bank: 'url(#glow-blue)', phone: 'url(#glow-purple)', address: 'url(#glow-cyan)' }[d.type];
        });

    // Node circle
    nodeGroup.append('circle')
        .attr('r', d => nodeRadius(d))
        .attr('fill', d => nodeColor(d))
        .attr('fill-opacity', 0.9)
        .attr('stroke', '#0a0f1e')
        .attr('stroke-width', 2);

    // Icon (FA Unicode via text)
    nodeGroup.append('text')
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'central')
        .attr('font-family', 'Font Awesome 6 Free')
        .attr('font-weight', 900)
        .attr('font-size', d => nodeRadius(d) * 0.85)
        .attr('fill', '#fff')
        .attr('fill-opacity', 0.9)
        .attr('pointer-events', 'none')
        .text(d => nodeIcon(d));

    // Labels below node
    labelSel = g.append('g').selectAll('text')
        .data(nodes).join('text')
        .attr('text-anchor', 'middle')
        .attr('dy', d => nodeRadius(d) + 14)
        .attr('font-size', 10)
        .attr('fill', '#94a3b8')
        .attr('pointer-events', 'none')
        .text(d => d.label.length > 16 ? d.label.slice(0, 16) + '…' : d.label);

    // Pulse animation for high-risk nodes
    nodeGroup.filter(d => d.type === 'beneficiary' && d.risk === 'high')
        .append('circle')
        .attr('r', d => nodeRadius(d))
        .attr('fill', 'none')
        .attr('stroke', '#ef4444')
        .attr('stroke-width', 2)
        .attr('class', 'pulse-ring');

    // Tick
    simulation.on('tick', () => {
        linkSel
            .attr('x1', d => d.source.x).attr('y1', d => d.source.y)
            .attr('x2', d => d.target.x).attr('y2', d => d.target.y);
        nodeGroup.attr('transform', d => `translate(${d.x},${d.y})`);
        labelSel.attr('x', d => d.x).attr('y', d => d.y);
    });
}

// ---- Tooltip -------------------------------------------------------------
const tooltip = document.getElementById('graph-tooltip');

function onNodeOver(event, d) {
    const riskLabel = { high: 'High Risk', medium: 'Suspicious', low: 'Safe' };
    let html = `<div class="tt-title" style="color:${nodeColor(d)}">${d.label}</div>`;
    if (d.type === 'beneficiary') {
        html += `<div class="tt-row">Risk: <b>${riskLabel[d.risk]}</b></div>`;
        html += `<div class="tt-row">Scheme: <b>${d.scheme}</b></div>`;
        html += `<div class="tt-row">Score: <b>${d.score}/100</b></div>`;
    } else {
        html += `<div class="tt-row">Type: <b>${d.type.charAt(0).toUpperCase() + d.type.slice(1)}</b></div>`;
        if (d.detail) html += `<div class="tt-row">Bank: <b>${d.detail}</b></div>`;
    }
    tooltip.innerHTML = html;
    tooltip.classList.add('visible');
}

function onNodeMove(event) {
    const rect = document.querySelector('.network-canvas-wrap').getBoundingClientRect();
    let x = event.clientX - rect.left + 14;
    let y = event.clientY - rect.top - 10;
    if (x + 230 > rect.width) x -= 250;
    if (y + 100 > rect.height) y -= 110;
    tooltip.style.left = x + 'px';
    tooltip.style.top = y + 'px';
}

function onNodeOut() {
    tooltip.classList.remove('visible');
}

// ---- Node Click → Details Panel -----------------------------------------
function onNodeClick(event, d) {
    event.stopPropagation();
    tooltip.classList.remove('visible');

    const panel = document.getElementById('details-panel');
    const empty = document.getElementById('details-empty');
    const content = document.getElementById('details-content');
    const icon = document.getElementById('d-node-icon');
    const lbl = document.getElementById('d-node-label');
    const typ = document.getElementById('d-node-type');
    const grid = document.getElementById('details-grid');

    empty.style.display = 'none';
    content.style.display = 'flex';

    icon.style.background = nodeColor(d);
    icon.style.boxShadow = `0 0 16px ${nodeColor(d)}80`;
    icon.innerHTML = `<i class="${iconClass(d)}" style="color:#fff;font-size:18px"></i>`;
    lbl.textContent = d.label;
    typ.textContent = typeLabel(d);

    grid.innerHTML = '';
    buildCards(d).forEach(c => {
        const card = document.createElement('div');
        card.className = 'detail-card';
        card.innerHTML = `<div class="detail-card-label">${c.label}</div><div class="detail-card-value">${c.value}</div>`;
        grid.appendChild(card);
    });

    // Count connections
    const connCount = RAW_LINKS.filter(l => l.source === d.id || l.target === d.id ||
        (typeof l.source === 'object' && l.source.id === d.id) ||
        (typeof l.target === 'object' && l.target.id === d.id)).length;
    const connCard = document.createElement('div');
    connCard.className = 'detail-card';
    connCard.innerHTML = `<div class="detail-card-label">Connections</div><div class="detail-card-value" style="color:var(--accent-cyan)">${connCount}</div>`;
    grid.appendChild(connCard);

    panel.classList.add('expanded');
}

document.getElementById('detail-close')?.addEventListener('click', () => {
    document.getElementById('details-empty').style.display = 'flex';
    document.getElementById('details-content').style.display = 'none';
    document.getElementById('details-panel').classList.remove('expanded');
});

function buildCards(d) {
    const riskLabel = { high: '🔴 High Risk', medium: '🟡 Suspicious', low: '🟢 Safe' };
    if (d.type === 'beneficiary') return [
        { label: 'Aadhaar', value: d.aadhaar },
        { label: 'Scheme', value: d.scheme },
        { label: 'Risk Level', value: riskLabel[d.risk] },
        { label: 'Fraud Score', value: `${d.score} / 100` },
    ];
    if (d.type === 'bank') return [{ label: 'IFSC Code', value: d.label }, { label: 'Bank', value: d.detail || '—' }];
    if (d.type === 'phone') return [{ label: 'Phone Number', value: d.label }];
    if (d.type === 'address') return [{ label: 'Address', value: d.label }];
    return [];
}

function typeLabel(d) {
    const m = { beneficiary: 'Scheme Beneficiary', bank: 'Bank Account Node', phone: 'Phone Number Node', address: 'Address Node' };
    return m[d.type] || d.type;
}

function iconClass(d) {
    const m = { beneficiary: 'fa-solid fa-user', bank: 'fa-solid fa-building-columns', phone: 'fa-solid fa-phone', address: 'fa-solid fa-location-dot' };
    return m[d.type] || 'fa-solid fa-circle';
}

// ---- Sidebar Filters -----------------------------------------------------
document.querySelectorAll('#scheme-group .ns-radio').forEach(el => {
    el.addEventListener('click', () => {
        document.querySelectorAll('#scheme-group .ns-radio').forEach(e => e.classList.remove('active'));
        el.classList.add('active');
        activeScheme = el.dataset.val;
        const { nodes, links } = buildGraph();
        renderAllNodes(nodes, links);
    });
});

document.querySelectorAll('#risk-group .ns-radio').forEach(el => {
    el.addEventListener('click', () => {
        document.querySelectorAll('#risk-group .ns-radio').forEach(e => e.classList.remove('active'));
        el.classList.add('active');
        activeRisk = el.dataset.val;
        const { nodes, links } = buildGraph();
        renderAllNodes(nodes, links);
    });
});

document.getElementById('net-search').addEventListener('input', e => {
    searchQuery = e.target.value.trim().toLowerCase();
    const { nodes, links } = buildGraph();
    renderAllNodes(nodes, links);
});

// Quick re-render helper (restarts simulation with new data)
function renderAllNodes(nodes, links) {
    if (simulation) simulation.stop();
    g.selectAll('*').remove();
    const W = parseInt(svg.attr('width'));
    const H = parseInt(svg.attr('height'));
    renderGraph(W, H, null);
}

// ---- Kick off ------------------------------------------------------------
window.addEventListener('load', () => {
    initGraph();

    // Pulsing ring animation via CSS keyframe injection
    const style = document.createElement('style');
    style.textContent = `
      @keyframes pulseRing {
        0%   { r: 18; stroke-opacity: 0.8; }
        70%  { r: 30; stroke-opacity: 0; }
        100% { r: 18; stroke-opacity: 0; }
      }
      .pulse-ring { animation: pulseRing 2s ease-out infinite; }
    `;
    document.head.appendChild(style);
});

window.addEventListener('resize', () => {
    const wrap = document.querySelector('.network-canvas-wrap');
    if (!wrap || !svg) return;
    const W = wrap.clientWidth;
    const H = wrap.clientHeight - 44;
    svg.attr('width', W).attr('height', H);
    if (simulation) simulation.force('center', d3.forceCenter(W / 2, H / 2)).alpha(0.3).restart();
});

async function loadFraudNetwork() {

    const response = await fetch("http://127.0.0.1:8000/analyze");

    const data = await response.json();

    const nodes = [];
    const edges = [];

    data.suspicious_list.forEach(person => {

        const personId = "person_" + person.aadhaar;
        const phoneId = "phone_" + person.phone;
        const bankId = "bank_" + person.bank_account;

        // person node
        nodes.push({
            data: { id: personId, label: person.name }
        });

        // phone node
        nodes.push({
            data: { id: phoneId, label: person.phone }
        });

        // bank node
        nodes.push({
            data: { id: bankId, label: person.bank_account }
        });

        // connections
        edges.push({
            data: { source: personId, target: phoneId }
        });

        edges.push({
            data: { source: personId, target: bankId }
        });

    });

    const cy = cytoscape({

        container: document.getElementById('fraud-graph'),

        elements: [
            ...nodes,
            ...edges
        ],

        style: [
            {
                selector: 'node',
                style: {
                    'label': 'data(label)',
                    'background-color': '#0D8ABC',
                    'color': '#fff',
                    'text-valign': 'center'
                }
            },
            {
                selector: 'edge',
                style: {
                    'width': 2,
                    'line-color': '#ccc'
                }
            }
        ],

        layout: {
            name: 'cose'
        }

    });

}

loadFraudNetwork();