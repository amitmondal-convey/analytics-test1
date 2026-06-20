/* ─── Engagement Health Page ──────────────────────────────────────────── */
window.PageHealth = (function () {
  const D = window.AppData;
  const C = window.Charts;

  function buildCohort() {
    const el = document.getElementById('health-cohort');
    if (!el) return;
    const wkCols = ['Wk 0', 'Wk 1', 'Wk 2', 'Wk 3', 'Wk 4', 'Wk 5', 'Wk 6'];
    let html = `<div class="cohort-wrap" style="grid-template-columns:60px repeat(7,1fr)">`;
    html += `<div style="color:var(--text-muted);font-size:9px">Cohort</div>`;
    wkCols.forEach(w => {
      html += `<div style="text-align:center;color:var(--text-muted);font-size:9px;padding-bottom:3px">${w}</div>`;
    });
    D.cohortData.forEach(c => {
      html += `<div style="color:var(--text-muted);display:flex;align-items:center;font-size:9px">${c.week}</div>`;
      c.vals.forEach(v => {
        if (v === null) {
          html += `<div style="background:var(--surface-3);border-radius:3px"></div>`;
          return;
        }
        const a = v === 100 ? 1 : Math.round((v - 38) / 62 * 100) / 100;
        html += `<div class="cohort-cell" style="background:rgba(61,214,140,${Math.min(1, Math.max(0.05, a)).toFixed(2)});color:${v > 65 ? '#fff' : 'var(--text-secondary)'}">${v}%</div>`;
      });
    });
    html += '</div>';
    el.innerHTML = html;
  }

  function render(company) {
    company = company || 'all';
    const h = D.getHealthScore(company);
    const el = document.getElementById('page-health');
    el.innerHTML = `
      <div class="section-label">Engagement health & data quality intelligence</div>

      <div class="grid g4">
        <div class="kpi good">
          <div class="kpi-label">Engagement health score</div>
          <div class="kpi-value">${h.overall} / 100</div>
          <div class="kpi-sub pos">↑ ${h.delta} pts vs last period</div>
        </div>
        <div class="kpi warn">
          <div class="kpi-label">Data quality score</div>
          <div class="kpi-value">68 / 100</div>
          <div class="kpi-sub neg">Phone valid gap: 22%</div>
        </div>
        <div class="kpi warn">
          <div class="kpi-label">Channel pref. coverage</div>
          <div class="kpi-value">55%</div>
          <div class="kpi-sub neg">45% have no stated preference</div>
        </div>
        <div class="kpi warn">
          <div class="kpi-label">30-day opt-out rate</div>
          <div class="kpi-value">0.8%</div>
          <div class="kpi-sub neg">LEP: 2.1% — 2.6× avg</div>
        </div>
      </div>

      <div class="grid g2">
        <div class="card">
          <div class="card-hd">
            <div class="card-title">
              <i class="ti ti-activity card-title-icon"></i>
              30-day engagement health score — composite KPI
            </div>
            <span class="badge badge-amber">Composite</span>
          </div>
          <div style="display:grid;grid-template-columns:130px 1fr;gap:14px;align-items:center">
            <div class="score-ring">
              <div class="score-big" style="color:var(--pos)">${h.overall}</div>
              <div class="score-label">/ 100 overall</div>
              <div style="font-size:10px;color:var(--pos);margin-top:4px">↑ ${h.delta} pts</div>
            </div>
            <div class="hbar">
              ${[
                { label: 'Delivery',       val: h.delivery,    color: '#3DD68C' },
                { label: 'Engagement',     val: h.engagement,  color: '#4B9EF8' },
                { label: 'Pref. match',    val: h.prefMatch,   color: '#9B8FFF' },
                { label: 'Equity reach',   val: h.equityReach, color: '#F5A623' },
                { label: 'Data quality',   val: h.dataQuality, color: '#4E5969' },
              ].map(s => `
                <div class="hbar-row">
                  <span class="hbar-lbl">${s.label}</span>
                  <div class="hbar-track"><div class="hbar-fill" style="width:${s.val}%;background:${s.color}"></div></div>
                  <span class="hbar-val">${s.val}</span>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
        <div class="card">
          <div class="card-hd">
            <div class="card-title">
              <i class="ti ti-chart-radar card-title-icon"></i>
              Engagement health score by division
            </div>
          </div>
          <table class="tbl">
            <thead><tr>
              <th>Division</th><th>Score</th><th>Delivery</th>
              <th>CARE %</th><th>Med %</th>
            </tr></thead>
            <tbody>
              ${D.getDivisionPerf(company).map(d => `
                <tr>
                  <td style="font-weight:500">${d.division}</td>
                  <td class="mono" style="font-weight:600;color:${d.score >= 75 ? 'var(--pos)' : d.score >= 65 ? 'var(--warn)' : 'var(--neg)'}">${d.score}</td>
                  <td class="mono" style="color:${d.delivered >= 90 ? 'var(--pos)' : d.delivered >= 85 ? 'var(--warn)' : 'var(--neg)'}">${d.delivered}%</td>
                  <td class="mono">${d.care}%</td>
                  <td class="mono">${d.med}%</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>

      <div class="grid g2">
        <div class="card">
          <div class="card-hd">
            <div class="card-title">
              <i class="ti ti-database card-title-icon"></i>
              Data quality scorecard — master data health
            </div>
            <span class="badge badge-amber">Customer master</span>
          </div>
          <div class="hbar" style="margin-top:4px">
            ${D.dataQuality.map(d => `
              <div class="hbar-row">
                <span class="hbar-lbl wide">${d.metric}</span>
                <div class="hbar-track">
                  <div class="hbar-fill" style="width:${d.pct}%;background:${d.color}"></div>
                </div>
                <span class="hbar-val" style="color:${d.pct >= 80 ? 'var(--pos)' : d.pct >= 65 ? 'var(--warn)' : 'var(--neg)'}">${d.pct}%</span>
              </div>
            `).join('')}
          </div>
          <div style="margin-top:12px">
            <button class="btn" style="width:100%;font-size:10px">Prioritize data enrichment ↗</button>
          </div>
        </div>
        <div class="card">
          <div class="card-hd">
            <div class="card-title">
              <i class="ti ti-chart-line card-title-icon"></i>
              Engagement score trend — 13-week rolling
            </div>
            <span class="badge badge-teal">90-day</span>
          </div>
          <div class="legend">
            <span class="leg"><span class="leg-sq" style="background:#3DD68C"></span>Overall score</span>
            <span class="leg"><span class="leg-sq" style="background:#F5A623"></span>Equity sub-score</span>
          </div>
          <div class="ch" style="height:180px"><canvas id="health-trend"></canvas></div>
        </div>
      </div>

      <div class="card">
        <div class="card-hd">
          <div class="card-title">
            <i class="ti ti-calendar card-title-icon"></i>
            Weekly cohort engagement retention
          </div>
          <span class="badge badge-purple">% still engaged by week since first contact</span>
        </div>
        <div id="health-cohort" style="margin-top:8px"></div>
        <div style="margin-top:8px;font-size:10px;color:var(--text-muted)">
          Each row = cohort first contacted in that week. Columns show % still confirming in subsequent weeks. Darker green = higher retention.
        </div>
      </div>
    `;

    buildCohort();

    const ht = D.healthTrend;
    C.line('health-trend', ht.labels, [
      { label: 'Overall', data: ht.overall, borderColor: '#3DD68C', borderWidth: 2.5 },
      { label: 'Equity',  data: ht.equity,  borderColor: '#F5A623', borderDash: [4, 3] },
    ], {
      scales: {
        x: { grid: { color: C.gc }, ticks: { color: C.tc, font: { size: 9 } } },
        y: { min: 40, max: 90, grid: { color: C.gc }, ticks: { color: C.tc, font: { size: 9 } } },
      },
    });
  }

  return { render };
})();
