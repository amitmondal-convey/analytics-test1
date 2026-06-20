/* ─── Campaign Analytics Page ─────────────────────────────────────────── */
window.PageCampaigns = (function () {
  const D = window.AppData;
  const C = window.Charts;

  let activeFilter = 'all';
  let activeCompany = 'all';

  function filteredCampaigns() {
    return D.campaigns.filter(c => {
      const typeOk = activeFilter === 'all' || c.type.toLowerCase() === activeFilter;
      const coOk   = activeCompany === 'all' || c.company === activeCompany;
      return typeOk && coOk;
    });
  }

  function renderTable() {
    const rows = filteredCampaigns();
    const tbody = document.getElementById('camp-tbody');
    if (!tbody) return;
    tbody.innerHTML = rows.length === 0
      ? `<tr><td colspan="6" style="text-align:center;color:var(--text-muted);padding:20px">No campaigns match the current filters</td></tr>`
      : rows.map(r => `
        <tr>
          <td style="font-family:var(--font-mono);font-size:10px">${r.id}</td>
          <td style="font-weight:500">${r.division}</td>
          <td><span class="badge ${typeBadge(r.type)}">${r.type}</span></td>
          <td class="mono">${D.fmt(r.msgs)}</td>
          <td class="mono" style="color:${r.delivered >= 90 ? 'var(--pos)' : r.delivered >= 80 ? 'var(--warn)' : 'var(--neg)'}">${r.delivered}%</td>
          <td class="mono">${r.engaged}%</td>
          <td><span class="badge ${statusBadge(r.status)}">${r.status}</span></td>
        </tr>
      `).join('');
  }

  function typeBadge(t) {
    return { Outage:'badge-red', PSPS:'badge-amber', Planned:'badge-blue', Billing:'badge-teal', Safety:'badge-green', General:'badge-purple' }[t] || 'badge-blue';
  }

  function statusBadge(s) {
    return { completed:'badge-green', running:'badge-blue', failed:'badge-red' }[s] || 'badge-purple';
  }

  function buildWaterfall() {
    const el = document.getElementById('camp-waterfall');
    if (!el) return;
    el.innerHTML = D.deliveryWaterfall.map(s => {
      const pct = Math.abs(s.pct);
      const lbl = s.pct < 0 ? `−${pct}%` : `${pct}%`;
      return `<div class="waterfall-row">
        <span class="wf-lbl">${s.label}</span>
        <div class="wf-track">
          <div class="wf-bar" style="left:${s.offset}%;width:${pct}%;background:${s.color};min-width:32px">${lbl}</div>
        </div>
      </div>`;
    }).join('');
  }

  function render(company) {
    activeCompany = company || 'all';
    const el = document.getElementById('page-campaigns');
    el.innerHTML = `
      <div class="section-label">Campaign performance & intelligence</div>

      <div class="grid g4">
        <div class="kpi">
          <div class="kpi-label">Active campaigns</div>
          <div class="kpi-value">155</div>
          <div class="kpi-sub neu">54 completed today</div>
        </div>
        <div class="kpi warn">
          <div class="kpi-label">Avg delivery rate</div>
          <div class="kpi-value">87.3%</div>
          <div class="kpi-sub neg">−1.9pp from 30-day avg</div>
        </div>
        <div class="kpi good">
          <div class="kpi-label">Avg engagement rate</div>
          <div class="kpi-value">36.8%</div>
          <div class="kpi-sub pos">↑ 2.1pp month-over-month</div>
        </div>
        <div class="kpi alert">
          <div class="kpi-label">Suppression rate</div>
          <div class="kpi-value">2.4%</div>
          <div class="kpi-sub neg">↑ 0.3pp — review opt-outs</div>
        </div>
      </div>

      <div class="grid g2" style="margin-bottom:var(--gap)">
        <div class="card">
          <div class="card-hd">
            <div class="card-title">
              <i class="ti ti-filter card-title-icon"></i>
              Delivery waterfall — all channels
            </div>
            <span class="badge badge-blue">30-day</span>
          </div>
          <div id="camp-waterfall" style="margin-top:8px"></div>
          <div style="margin-top:12px;font-size:10px;color:var(--text-muted)">
            3% of sent messages suppressed (opt-outs, duplicates); 8% failed after dispatch.
            LEP & CARE segments account for 62% of all failures.
          </div>
        </div>
        <div class="card">
          <div class="card-hd">
            <div class="card-title">
              <i class="ti ti-chart-line card-title-icon"></i>
              Campaign velocity — 30 days
            </div>
          </div>
          <div class="legend">
            <span class="leg"><span class="leg-sq" style="background:var(--s1)"></span>Completed</span>
            <span class="leg"><span class="leg-sq" style="background:var(--s5)"></span>Running</span>
            <span class="leg"><span class="leg-sq" style="background:var(--s4)"></span>Stopped</span>
          </div>
          <div class="ch" style="height:160px"><canvas id="camp-velocity"></canvas></div>
        </div>
      </div>

      <div class="grid g2" style="margin-bottom:var(--gap)">
        <div class="card">
          <div class="card-hd">
            <div class="card-title">
              <i class="ti ti-chart-bar card-title-icon"></i>
              Campaign type performance
            </div>
          </div>
          <div class="legend">
            <span class="leg"><span class="leg-sq" style="background:var(--s1)"></span>Delivered %</span>
            <span class="leg"><span class="leg-sq" style="background:var(--s5)"></span>Engagement %</span>
          </div>
          <div class="ch" style="height:180px"><canvas id="camp-types"></canvas></div>
        </div>
        <div class="card">
          <div class="card-hd">
            <div class="card-title">
              <i class="ti ti-chart-bar card-title-icon"></i>
              Volume vs. delivery rate — 30 days
            </div>
          </div>
          <div class="legend">
            <span class="leg"><span class="leg-sq" style="background:var(--s2);opacity:0.6"></span>Volume (K msgs)</span>
            <span class="leg"><span class="leg-sq" style="background:var(--s1)"></span>Delivery rate %</span>
          </div>
          <div class="ch" style="height:180px"><canvas id="camp-vol"></canvas></div>
        </div>
      </div>

      <div class="card">
        <div class="card-hd">
          <div class="card-title">
            <i class="ti ti-table card-title-icon"></i>
            Campaign roster
          </div>
        </div>
        <div class="ctrl-row" style="margin-bottom:10px">
          <span style="font-size:10px;color:var(--text-muted)">Type:</span>
          ${['all','outage','psps','planned','billing','safety','general'].map(f =>
            `<button class="ctrl-btn${f === activeFilter ? ' active' : ''}" onclick="PageCampaigns.setFilter('${f}')">${f === 'all' ? 'All types' : f.charAt(0).toUpperCase() + f.slice(1)}</button>`
          ).join('')}

        </div>
        <table class="tbl">
          <thead><tr>
            <th>Campaign ID</th><th>Division</th>
            <th>Type</th><th>Messages</th><th>Delivered</th><th>Engaged</th><th>Status</th>
          </tr></thead>
          <tbody id="camp-tbody"></tbody>
        </table>
      </div>
    `;

    buildWaterfall();
    renderTable();

    /* velocity */
    const v = D.campaignVelocity;
    C.bar('camp-velocity', v.labels, [
      { label: 'Completed', data: v.completed, backgroundColor: '#3DD68C' },
      { label: 'Running',   data: v.running,   backgroundColor: '#F5A623' },
      { label: 'Stopped',   data: v.stopped,   backgroundColor: '#FF5C5C' },
    ], {
      scales: {
        x: { stacked: true, grid: { color: C.gc }, ticks: { color: C.tc, font: { size: 8 } } },
        y: { stacked: true, grid: { color: C.gc }, ticks: { color: C.tc, font: { size: 9 } } },
      },
    });

    /* campaign types */
    C.bar('camp-types', D.campaignTypePerf.labels, [
      { label: 'Delivered',   data: D.campaignTypePerf.delivered,   backgroundColor: '#3DD68C' },
      { label: 'Engagement',  data: D.campaignTypePerf.engagement,  backgroundColor: 'rgba(245,166,35,0.7)' },
    ], {
      scales: {
        x: { grid: { color: C.gc }, ticks: { color: C.tc, font: { size: 9 } } },
        y: { min: 0, max: 110, grid: { color: C.gc }, ticks: { color: C.tc, font: { size: 9 }, callback: v => v + '%' } },
      },
    });

    /* volume vs delivery */
    const t = D.trend30Days;
    C.make('camp-vol', 'bar', {
      labels: t.labels.slice(0, 15),
      datasets: [
        { type: 'bar',  label: 'Volume',   data: [48,62,71,55,68,82,91,77,84,93,88,76,69,82,90], backgroundColor: 'rgba(75,158,248,0.3)', yAxisID: 'y', borderRadius: 2 },
        { type: 'line', label: 'Delivery', data: t.delivered.slice(0, 15), borderColor: '#3DD68C', borderWidth: 2, pointRadius: 0, fill: false, tension: 0.4, yAxisID: 'y2' },
      ],
    }, {
      scales: {
        x:  { grid: { color: C.gc }, ticks: { color: C.tc, font: { size: 9 } } },
        y:  { grid: { color: C.gc }, ticks: { color: C.tc, font: { size: 9 } }, title: { display: true, text: 'Volume (K)', color: C.tc, font: { size: 9 } } },
        y2: { position: 'right', min: 80, max: 100, grid: { display: false }, ticks: { color: C.tc, font: { size: 9 }, callback: v => v + '%' } },
      },
    });
  }

  function setFilter(f) {
    activeFilter = f;
    document.querySelectorAll('#page-campaigns .ctrl-btn').forEach(b => {
      b.classList.toggle('active', b.textContent.toLowerCase().replace('all types','all') === f || b.textContent.toLowerCase() === f);
    });
    renderTable();
  }

  function setCompany(c) {
    activeCompany = c;
    renderTable();
  }

  return { render, setFilter, setCompany };
})();
