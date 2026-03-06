// ============================================================
// SchemeGuard AI — Shared Utilities
// Dark mode toggle, animations, ripple effects
// ============================================================

// ── Dark Mode ────────────────────────────────────────────────
(function () {
    const html = document.documentElement;
    const saved = localStorage.getItem('sg-theme') || 'dark';
    html.setAttribute('data-theme', saved);

    window.addEventListener('DOMContentLoaded', () => {
        const btn = document.getElementById('theme-toggle');
        const icon = document.getElementById('theme-icon');
        const lbl = document.getElementById('theme-label');
        if (!btn) return;

        updateToggleUI(saved, icon, lbl);

        btn.addEventListener('click', () => {
            const cur = html.getAttribute('data-theme');
            const next = cur === 'dark' ? 'light' : 'dark';
            html.setAttribute('data-theme', next);
            localStorage.setItem('sg-theme', next);
            updateToggleUI(next, icon, lbl);
        });
    });

    function updateToggleUI(theme, icon, lbl) {
        if (!icon || !lbl) return;
        if (theme === 'light') {
            icon.className = 'fa-solid fa-moon';
            lbl.textContent = 'Dark';
        } else {
            icon.className = 'fa-solid fa-sun';
            lbl.textContent = 'Light';
        }
    }
})();

// ── Scroll fade-in ───────────────────────────────────────────
window.addEventListener('DOMContentLoaded', () => {
    // Stagger stat cards
    document.querySelectorAll('.stat-card').forEach((el, i) => {
        el.style.animationDelay = `${i * 80}ms`;
        el.classList.add('fade-in-up');
    });

    // Feed chart containers
    document.querySelectorAll('.chart-container, .table-container, .lk-card').forEach((el, i) => {
        const obs = new IntersectionObserver(entries => {
            entries.forEach(e => {
                if (e.isIntersecting) {
                    e.target.classList.add('visible');
                    obs.unobserve(e.target);
                }
            });
        }, { threshold: 0.1 });
        el.classList.add('scroll-reveal');
        obs.observe(el);
    });

    // Ripple buttons
    document.querySelectorAll('button, .btn-outline, .btn-primary-sg, .btn-action-sg, .export-btn').forEach(btn => {
        btn.addEventListener('click', createRipple);
    });
});

function createRipple(e) {
    const btn = e.currentTarget;
    const old = btn.querySelector('.ripple');
    if (old) old.remove();
    const r = document.createElement('span');
    r.className = 'ripple';
    const rect = btn.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    r.style.cssText = `width:${size}px;height:${size}px;left:${e.clientX - rect.left - size / 2}px;top:${e.clientY - rect.top - size / 2}px`;
    btn.appendChild(r);
    setTimeout(() => r.remove(), 600);
}
