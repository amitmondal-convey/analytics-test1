/* ─── Customer Journey Page ───────────────────────────────────────────── */
window.PageJourney = (function () {
  const D = window.AppData;
  const C = window.Charts;

  let activeSegment = 'all';

  function buildFunnel(segKey) {
    const stages = D.journeyFunnel[segKey] || D.journeyFunnel.all;
    const el = document.getElementById('journey-funnel');
    if (!el) return;
    const colors = ['#3DD68C', '#3DD68C', '#4B9EF8', '#9B8FFF', '#F5A623', '#FF5C5C'];
    el.innerHTML = stages.map((s, i) => `
      <div style="margin-bottom:6px">
        <div class="funnel-row">
          <div class="funnel-lbl">${s.stage}</div>
          <div class="funnel-bar-wrap">
            <div class="funnel-bar" style="width:${Math.max(10, s.pct)}%;background:${colors[i]}">
              ${s.n.toLocaleString()} (${s.pct}%)
            </div>
          </div>
        </div>
        ${s.drop ? `<div style="margin-left:150px;font-size:9px;color:var(--neg);margin-top:2px">${s.drop}</div>` : ''}
      </div>
    `).join('');
  }

  function render() {
    const el = document.getElementById('page-journey');
    el.innerHTML = `
      <div class="section-label">Customer engagement journey analytics</div>

      <div class="grid g3">
        <div class="kpi good">
          <div class="kpi-label">Unique customers reached</div>
          <div class="kpi-value">487K</div>
          <div class="kpi-sub pos">↑ 9% vs prior period</div>
        </div>
        <div class="kpi warn">
          <div class="kpi-label">Avg contact attempts</div>
          <div class="kpi-value">1.8×</div>
          <div class="kpi-sub neg">LEP: 3.2× · CARE: 2.1×</div>
        </div>
        <div class="kpi warn">
          <div class="kpi-label">Preference match rate</div>
          <div class="kpi-value">71%</div>
          <div class="kpi-sub neg">29% receiving wrong channel</div>
        </div>
      </div>

      <div class="card" style="margin-bottom:var(--gap)">
        <div class="card-hd">
          <div class="card-title">
            <i class="ti ti-route card-title-icon"></i>
            Engagement funnel — outage notification journey
          </div>
          <span class="badge badge-teal">30-day · all customers</span>
        </div>
        <div style="margin-bottom:10px" id="journey-funnel"></div>
        <div class="ctrl-row" style="margin-bottom:0">
          ${[
            { key: 'all',     label: 'All customers' },
            { key: 'care',    label: 'CARE / FERA' },
            { key: 'lep',     label: 'LEP customers' },
            { key: 'medical', label: 'Medical baseline' },
          ].map(s => `
            <button class="ctrl-btn${s.key === activeSegment ? ' active' : ''}" onclick="PageJourney.setSegment('${s.key}')">${s.label}</button>
          `).join('')}
        </div>
      </div>

      <div class="grid g2">
        <div class="card">
          <div class="card-hd">
            <div class="card-title">
              <i class="ti ti-chart-area card-title-icon"></i>
              Contact preference vs. actual channel
            </div>
            <span class="badge badge-amber">Mismatch analysis</span>
          </div>
          <div class="legend">
            <span class="leg"><span class="leg-sq" style="background:#3DD68C"></span>Preferred</span>
            <span class="leg"><span class="leg-sq" style="background:rgba(75,158,248,0.6)"></span>Actual used</span>
          </div>
          <div class="ch" style="height:180px"><canvas id="journey-mismatch"></canvas></div>
          <div style="margin-top:8px;font-size:10px;color:var(--text-muted)">
            Customers receiving messages via non-preferred channel show 31% lower confirmation rates. Highest mismatch in LEP segment (email sent when SMS preferred).
          </div>
        </div>
        <div class="card">
          <div class="card-hd">
            <div class="card-title">
              <i class="ti ti-clock card-title-icon"></i>
              Response latency — time-to-confirm by channel
            </div>
            <span class="badge badge-purple">Engagement speed</span>
          </div>
          <div class="legend">
            <span class="leg"><span class="leg-sq" style="background:#3DD68C"></span>SMS</span>
            <span class="leg"><span class="leg-sq" style="background:#9B8FFF"></span>Voice</span>
            <span class="leg"><span class="leg-sq" style="background:#4B9EF8"></span>Email</span>
          </div>
          <div class="ch" style="height:180px"><canvas id="journey-latency"></canvas></div>
        </div>
      </div>

      <div class="grid g2">
        <div class="card">
          <div class="card-hd">
            <div class="card-title">
              <i class="ti ti-repeat card-title-icon"></i>
              Avg contact attempts before success — by segment
            </div>
          </div>
          <div class="hbar" style="margin-top:4px">
            ${D.retryAttempts.map(r => `
              <div class="hbar-row">
                <span class="hbar-lbl">${r.segment}</span>
                <div class="hbar-track">
                  <div class="hbar-fill" style="width:${(r.attempts / 3.2) * 100}%;background:${r.color}"></div>
                </div>
                <span class="hbar-val" style="color:${r.attempts > 2 ? 'var(--neg)' : r.attempts > 1.5 ? 'var(--warn)' : 'var(--pos)'}">${r.attempts}×</span>
              </div>
            `).join('')}
          </div>
          <div style="margin-top:10px;padding:10px;background:var(--surface-2);border-radius:6px;font-size:10px;color:var(--text-muted);line-height:1.6">
            LEP customers require <strong style="color:var(--neg)">3.2× more contact attempts</strong> than general. Root cause: language-template mismatch + landline-only records inflating retry loops.
          </div>
        </div>
        <div class="card">
          <div class="card-hd">
            <div class="card-title">
              <i class="ti ti-trending-up card-title-icon"></i>
              Opt-out trend — 20-day view
            </div>
            <span class="badge badge-red">Churn signal</span>
          </div>
          <div class="legend">
            <span class="leg"><span class="leg-sq" style="background:#3DD68C"></span>General</span>
            <span class="leg"><span class="leg-sq" style="background:#F5A623"></span>CARE</span>
            <span class="leg"><span class="leg-sq" style="background:#FF5C5C"></span>LEP</span>
          </div>
          <div class="ch" style="height:180px"><canvas id="journey-optout"></canvas></div>
        </div>
      </div>
    `;

    buildFunnel(activeSegment);

    /* mismatch bar */
    C.bar('journey-mismatch', ['SMS', 'Email', 'Voice'], [
      { label: 'Preferred', data: D.preferenceMismatch.preferred, backgroundColor: '#3DD68C' },
      { label: 'Actual',    data: D.preferenceMismatch.actual,    backgroundColor: 'rgba(75,158,248,0.6)' },
    ], {
      scales: {
        x: { grid: { color: C.gc }, ticks: { color: C.tc, font: { size: 9 } } },
        y: { min: 0, max: 80, grid: { color: C.gc }, ticks: { color: C.tc, font: { size: 9 }, callback: v => v + '%' } },
      },
    });

    /* latency */
    C.bar('journey-latency', ['<1 min', '1–5 min', '5–30 min', '30m–2h', '2h+'], [
      { label: 'SMS',   data: [38, 29, 18, 10, 5],  backgroundColor: '#3DD68C' },
      { label: 'Voice', data: [12, 41, 28, 13, 6],  backgroundColor: 'rgba(155,143,255,0.7)' },
      { label: 'Email', data: [4,  14, 31, 32, 19], backgroundColor: 'rgba(75,158,248,0.7)' },
    ], {
      scales: {
        x: { grid: { color: C.gc }, ticks: { color: C.tc, font: { size: 9 } } },
        y: { grid: { color: C.gc }, ticks: { color: C.tc, font: { size: 9 }, callback: v => v + '%' } },
      },
    });

    /* opt-out trend */
    const ot = D.optOutTrend;
    C.line('journey-optout', ot.labels, [
      { label: 'General', data: ot.general, borderColor: '#3DD68C' },
      { label: 'CARE',    data: ot.care,    borderColor: '#F5A623', borderDash: [4, 3] },
      { label: 'LEP',     data: ot.lep,     borderColor: '#FF5C5C', borderDash: [2, 2] },
    ], {
      scales: {
        x: { grid: { color: C.gc }, ticks: { color: C.tc, font: { size: 8 } } },
        y: { min: 0, max: 3, grid: { color: C.gc }, ticks: { color: C.tc, font: { size: 9 }, callback: v => v + '%' } },
      },
    });
  }

  function setSegment(seg) {
    activeSegment = seg;
    document.querySelectorAll('#page-journey .ctrl-btn').forEach(b => {
      const map = { all: 'All customers', care: 'CARE / FERA', lep: 'LEP customers', medical: 'Medical baseline' };
      b.classList.toggle('active', b.textContent === map[seg]);
    });
    buildFunnel(seg);
  }

  return { render, setSegment };
})();
