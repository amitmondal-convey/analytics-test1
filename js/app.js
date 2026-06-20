/* ─── Application Controller ──────────────────────────────────────────── */
(function () {
  const PAGES = {
    overview:  { label: 'Overview',             module: () => window.PageOverview,  icon: 'ti-layout-dashboard' },
    campaigns: { label: 'Campaign Analytics',   module: () => window.PageCampaigns, icon: 'ti-broadcast' },
    channels:  { label: 'Channel Intelligence', module: () => window.PageChannels,  icon: 'ti-signal' },
    equity:    { label: 'Equity Segments',       module: () => window.PageEquity,    icon: 'ti-users-group' },
    critical:  { label: 'Critical Customers',    module: () => window.PageCritical,  icon: 'ti-heart-rate-monitor' },
    outage:    { label: 'Outage Impact',         module: () => window.PageOutage,    icon: 'ti-bolt' },
    journey:   { label: 'Customer Journey',      module: () => window.PageJourney,   icon: 'ti-route' },
    health:    { label: 'Engagement Health',     module: () => window.PageHealth,    icon: 'ti-activity' },
    insights:  { label: 'AI Insights',           module: () => window.PageInsights,  icon: 'ti-brain' },
  };

  let currentPage = 'overview';
  let currentPeriod = 'today';
  let currentCompany = 'all';
  let rendered = new Set();

  function navigateTo(pageId) {
    if (!PAGES[pageId]) return;
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));

    const navEl = document.querySelector(`[data-page="${pageId}"]`);
    if (navEl) navEl.classList.add('active');

    const pageEl = document.getElementById(`page-${pageId}`);
    if (pageEl) pageEl.classList.add('active');

    const mod = PAGES[pageId].module();
    if (mod) {
      if (pageId === 'overview') {
        mod.render(currentPeriod, currentCompany);
      } else {
        mod.render(currentCompany);
      }
    }

    currentPage = pageId;

    /* Update topbar breadcrumb */
    const bc = document.getElementById('topbar-breadcrumb');
    if (bc) {
      bc.textContent = PAGES[pageId].label;
      document.querySelector('.topbar-title').textContent = 'Customer Engagement Analytics';
    }

    /* scroll top */
    const content = document.querySelector('.page-content');
    if (content) content.scrollTop = 0;
  }

  function setPeriod(p) {
    currentPeriod = p;
    document.querySelectorAll('.time-pill').forEach(pill => {
      pill.classList.toggle('active', pill.dataset.period === p);
    });
    if (currentPage === 'overview') {
      window.PageOverview.render(p, currentCompany);
    }
  }

  function setGlobalCompany(co) {
    currentCompany = co;
    navigateTo(currentPage);
  }

  /* Wire global click handlers */
  window.navigateTo = navigateTo;
  window.setPeriod  = setPeriod;
  window.setGlobalCompany = setGlobalCompany;

  /* Build sidebar nav */
  function buildNav() {
    const navEl = document.getElementById('sidebar-nav');
    if (!navEl) return;

    const groups = [
      { label: 'Dashboards', pages: ['overview', 'campaigns', 'channels'] },
      { label: 'Customer Intelligence', pages: ['equity', 'critical'] },
      { label: 'Operations', pages: ['outage', 'journey', 'health'] },
      { label: 'Strategy', pages: ['insights'] },
    ];

    const alerts = { critical: '340', insights: '7' };
    const warnBadges = { equity: '4', outage: '23' };

    navEl.innerHTML = groups.map(g => `
      <div class="nav-section-label">${g.label}</div>
      ${g.pages.map(pid => `
        <div class="nav-item${pid === currentPage ? ' active' : ''}" data-page="${pid}" onclick="navigateTo('${pid}')">
          <i class="ti ${PAGES[pid].icon} nav-icon"></i>
          ${PAGES[pid].label}
          ${alerts[pid] ? `<span class="nav-badge">${alerts[pid]}</span>` : ''}
          ${warnBadges[pid] ? `<span class="nav-badge warn">${warnBadges[pid]}</span>` : ''}
        </div>
      `).join('')}
    `).join('');
  }

  /* Build page containers */
  function buildPageContainers() {
    const content = document.querySelector('.page-content');
    if (!content) return;
    Object.keys(PAGES).forEach(pid => {
      if (!document.getElementById(`page-${pid}`)) {
        const div = document.createElement('div');
        div.id = `page-${pid}`;
        div.className = 'page';
        content.appendChild(div);
      }
    });
  }

  /* ── Login canvas animation ── */
  function initLoginCanvas() {
    const canvas = document.getElementById('lp-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    function resize() {
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    const NODE_COUNT = 32;
    const nodes = Array.from({ length: NODE_COUNT }, () => ({
      x: Math.random(),
      y: Math.random(),
      vx: (Math.random() - 0.5) * 0.0006,
      vy: (Math.random() - 0.5) * 0.0006,
      r: 1.5 + Math.random() * 2.5,
      pulse: Math.random() * Math.PI * 2,
    }));

    let raf;
    function draw() {
      const W = canvas.width, H = canvas.height;
      ctx.clearRect(0, 0, W, H);

      nodes.forEach(n => {
        n.x += n.vx; n.y += n.vy;
        if (n.x < 0 || n.x > 1) n.vx *= -1;
        if (n.y < 0 || n.y > 1) n.vy *= -1;
        n.pulse += 0.018;
      });

      /* edges */
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = (nodes[i].x - nodes[j].x) * W;
          const dy = (nodes[i].y - nodes[j].y) * H;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 160) {
            ctx.beginPath();
            ctx.moveTo(nodes[i].x * W, nodes[i].y * H);
            ctx.lineTo(nodes[j].x * W, nodes[j].y * H);
            ctx.strokeStyle = `rgba(61,214,140,${0.18 * (1 - dist / 160)})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }

      /* nodes */
      nodes.forEach(n => {
        const alpha = 0.5 + 0.5 * Math.sin(n.pulse);
        ctx.beginPath();
        ctx.arc(n.x * W, n.y * H, n.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(61,214,140,${0.4 + 0.4 * alpha})`;
        ctx.fill();
      });

      raf = requestAnimationFrame(draw);
    }
    draw();
    return () => cancelAnimationFrame(raf);
  }

  /* ── Login form logic ── */
  function initLogin(onSuccess) {
    const form    = document.getElementById('login-form');
    const emailEl = document.getElementById('lp-email');
    const passEl  = document.getElementById('lp-password');
    const errEl   = document.getElementById('lp-error');
    const btnEl   = document.getElementById('lp-submit');
    if (!form) { onSuccess(); return; }

    function showError(msg) {
      errEl.textContent = msg;
      errEl.classList.add('visible');
    }
    function clearError() {
      errEl.classList.remove('visible');
      emailEl.classList.remove('error');
      passEl.classList.remove('error');
    }

    form.addEventListener('submit', e => {
      e.preventDefault();
      clearError();
      const email = emailEl.value.trim();
      const pass  = passEl.value;

      if (!email) {
        emailEl.classList.add('error');
        showError('Work email is required.');
        emailEl.focus();
        return;
      }
      if (!email.includes('@')) {
        emailEl.classList.add('error');
        showError('Enter a valid email address.');
        emailEl.focus();
        return;
      }
      if (!pass) {
        passEl.classList.add('error');
        showError('Password is required.');
        passEl.focus();
        return;
      }

      btnEl.disabled = true;
      btnEl.textContent = 'Signing in…';

      /* Simulate auth delay */
      setTimeout(() => {
        const screen = document.getElementById('login-screen');
        screen.classList.add('lp-fade-out');
        setTimeout(() => {
          screen.style.display = 'none';
          onSuccess();
        }, 450);
      }, 700);
    });
  }

  /* Init */
  document.addEventListener('DOMContentLoaded', () => {
    initLoginCanvas();

    initLogin(() => {
      const shell = document.getElementById('app-shell');
      if (shell) shell.style.display = '';

      buildPageContainers();
      buildNav();

      /* Time pills */
      document.querySelectorAll('.time-pill').forEach(pill => {
        pill.addEventListener('click', () => setPeriod(pill.dataset.period));
      });

      /* Company filter */
      const coSelect = document.getElementById('global-company');
      if (coSelect) coSelect.addEventListener('change', e => setGlobalCompany(e.target.value));

      /* Initial render */
      navigateTo('overview');
    });
  });
})();
