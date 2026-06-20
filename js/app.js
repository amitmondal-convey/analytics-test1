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
        mod.render(currentPeriod);
      } else {
        mod.render();
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
      window.PageOverview.render(p);
    }
  }

  function setGlobalCompany(co) {
    currentCompany = co;
    /* Re-render current page if it respects company filter */
    if (['campaigns', 'channels', 'equity'].includes(currentPage)) {
      navigateTo(currentPage);
    }
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

  /* Init */
  document.addEventListener('DOMContentLoaded', () => {
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
})();
