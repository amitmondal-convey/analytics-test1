/* ─── Overview Page ───────────────────────────────────────────────────── */
window.PageOverview = (function () {
  const D = window.AppData;
  const C = window.Charts;

  function render(period) {
    const k = D.overviewKPIs[period];
    const el = document.getElementById('page-overview');
    el.innerHTML = `
      <div class="section-label">Executive summary · Jun 15, 2026</div>

      <div class="grid g4">
        <div class="kpi good">
          <div class="kpi-label">Total messages sent</div>
          <div class="kpi-value">${D.fmt(k.totalMessages)}</div>
          <div class="kpi-sub pos">↑ 12% vs prior period</div>
          <div class="kpi-spark"><canvas id="ov-spark-1" height="32"></canvas></div>
        </div>
        <div class="kpi ${k.deliveredRate < 90 ? 'warn' : 'good'}">
          <div class="kpi-label">Delivered rate</div>
          <div class="kpi-value">${k.deliveredRate}%</div>
          <div class="kpi-sub neg">↓ 1.2pp — low-income segment gap</div>
          <div class="kpi-spark"><canvas id="ov-spark-2" height="32"></canvas></div>
        </div>
        <div class="kpi">
          <div class="kpi-label">Equity segment reach</div>
          <div class="kpi-value">${k.equityReach}%</div>
          <div class="kpi-sub neu">CARE + Medical + LEP combined</div>
          <div class="kpi-spark"><canvas id="ov-spark-3" height="32"></canvas></div>
        </div>
        <div class="kpi good">
          <div class="kpi-label">Active campaigns</div>
          <div class="kpi-value">${k.activeCampaigns}</div>
          <div class="kpi-sub pos">${k.completedToday} completed today</div>
          <div class="kpi-spark"><canvas id="ov-spark-4" height="32"></canvas></div>
        </div>
      </div>

      <div class="kpi-ribbon">
        <div class="kpi-ribbon-block">
          <div class="kpi-ribbon-label">CARE / Low-income reached</div>
          <div class="kpi-ribbon-val" style="color:var(--s1)">${D.fmt(k.careReached)}</div>
        </div>
        <div class="kpi-ribbon-block">
          <div class="kpi-ribbon-label">Medical baseline notified</div>
          <div class="kpi-ribbon-val" style="color:var(--s2)">${D.fmt(k.medicalNotified)}</div>
        </div>
        <div class="kpi-ribbon-block">
          <div class="kpi-ribbon-label">LEP customers (non-English)</div>
          <div class="kpi-ribbon-val" style="color:var(--s3)">${D.fmt(k.lepCustomers)}</div>
        </div>
        <div class="kpi-ribbon-block">
          <div class="kpi-ribbon-label">Life support alerts sent</div>
          <div class="kpi-ribbon-val" style="color:var(--s4)">${D.fmt(k.lifeSupportAlerts)}</div>
        </div>
        <div class="kpi-ribbon-block">
          <div class="kpi-ribbon-label">Critical facility pings</div>
          <div class="kpi-ribbon-val" style="color:var(--s5)">${D.fmt(k.criticalFacilities)}</div>
        </div>
      </div>

      <div class="grid g3">
        <div class="card">
          <div class="card-hd">
            <div class="card-title">
              <i class="ti ti-chart-donut card-title-icon"></i>
              Delivery by equity segment
            </div>
          </div>
          <div class="legend">
            ${['General','CARE/FERA','LEP','Medical'].map((s,i) =>
              `<span class="leg"><span class="leg-sq" style="background:${['#3DD68C','#F5A623','#9B8FFF','#4B9EF8'][i]}"></span>${s}</span>`
            ).join('')}
          </div>
          <div class="ch" style="height:170px"><canvas id="ov-donut"></canvas></div>
        </div>
        <div class="card">
          <div class="card-hd">
            <div class="card-title">
              <i class="ti ti-chart-bar card-title-icon"></i>
              Failure rate by segment
            </div>
          </div>
          <div class="hbar" style="margin-top:4px">
            ${Object.entries(D.segmentDelivery).map(([seg, v]) =>
              `<div class="hbar-row">
                <span class="hbar-lbl">${seg.replace('Medical Baseline','Medical').replace('Life Support','Life supp').replace('Senior/Vulnerable','Senior')}</span>
                <div class="hbar-track"><div class="hbar-fill" style="width:${Math.min(100,v.failRate*4)}%;background:${D.segColor(seg)}"></div></div>
                <span class="hbar-val" style="color:${v.failRate > 15 ? 'var(--neg)' : v.failRate > 10 ? 'var(--warn)' : 'var(--text-primary)'}">${v.failRate}%</span>
              </div>`
            ).join('')}
          </div>
        </div>
        <div class="card">
          <div class="card-hd">
            <div class="card-title">
              <i class="ti ti-chart-line card-title-icon"></i>
              7-day delivery trend
            </div>
            <span class="badge badge-teal">By channel</span>
          </div>
          <div class="legend">
            <span class="leg"><span class="leg-sq" style="background:var(--s1)"></span>SMS</span>
            <span class="leg"><span class="leg-sq" style="background:var(--s2)"></span>Email</span>
            <span class="leg"><span class="leg-sq" style="background:var(--s3)"></span>Voice</span>
          </div>
          <div class="ch" style="height:150px"><canvas id="ov-trend"></canvas></div>
        </div>
      </div>

      <div class="grid g2">
        <div class="card">
          <div class="card-hd">
            <div class="card-title">
              <i class="ti ti-building card-title-icon"></i>
              Company & division performance
            </div>
            <span class="badge badge-blue">Jun 15, 2026</span>
          </div>
          <table class="tbl">
            <thead><tr>
              <th>Company</th><th>Division</th><th>Messages</th>
              <th>Delivered</th><th>CARE %</th><th>Med %</th>
            </tr></thead>
            <tbody>
              ${D.divisionPerf.slice(0, 6).map(r => `
                <tr>
                  <td style="font-weight:500">${r.company}</td>
                  <td style="color:var(--text-secondary)">${r.division}</td>
                  <td class="mono">${D.fmt(r.msgs)}</td>
                  <td class="mono" style="color:${r.delivered >= 90 ? 'var(--pos)' : r.delivered >= 85 ? 'var(--warn)' : 'var(--neg)'}">${r.delivered}%</td>
                  <td class="mono">${r.care}%</td>
                  <td class="mono">${r.med}%</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
        <div class="card">
          <div class="card-hd">
            <div class="card-title">
              <i class="ti ti-alert-triangle card-title-icon"></i>
              Priority alerts requiring action
            </div>
            <span class="badge badge-red">3 critical</span>
          </div>
          <div class="pulse-strip">
            <div class="pulse-item crit">
              <div class="pulse-icon crit"><i class="ti ti-alert-circle" style="color:var(--neg)"></i></div>
              <div>
                <div class="pulse-text"><strong>LEP failure rate 21.3%</strong> — Spanish & Mandarin segments showing 2.5× higher SMS bounce. Template language mismatch suspected.</div>
                <span class="pulse-act">Analyze → ↗</span>
              </div>
            </div>
            <div class="pulse-item warn">
              <div class="pulse-icon warn"><i class="ti ti-bolt" style="color:var(--warn)"></i></div>
              <div>
                <div class="pulse-text"><strong>HECO CARE segment</strong> — 41% of PSPS-affected customers are CARE-enrolled. Voice channel used for only 18% despite landline prevalence.</div>
                <span class="pulse-act">Strategize → ↗</span>
              </div>
            </div>
            <div class="pulse-item warn">
              <div class="pulse-icon warn"><i class="ti ti-heart-rate-monitor" style="color:var(--info)"></i></div>
              <div>
                <div class="pulse-text"><strong>Life support proactive gap</strong> — 340 life support customers in current outage zones have not been contacted in 24h. SLA at risk.</div>
                <span class="pulse-act">View SLAs → ↗</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    /* ── Spark charts ── */
    const delivered7 = D.trend7Days.sms;
    const deliveredTrend = [88,89,91,90,92,91,93,90,89,91];
    const equityTrend   = [58,59,60,60,61,61,62,61,62,61];
    const campTrend     = [120,132,144,138,148,151,155,152,150,155];

    C.spark('ov-spark-1', [480,492,498,501,495,505,510], 'rgba(61,214,140,1)');
    C.spark('ov-spark-2', deliveredTrend, 'rgba(75,158,248,1)');
    C.spark('ov-spark-3', equityTrend,    'rgba(155,143,255,1)');
    C.spark('ov-spark-4', campTrend,      'rgba(61,214,140,1)');

    /* ── Doughnut ── */
    C.doughnut('ov-donut',
      ['General', 'CARE/FERA', 'LEP', 'Medical'],
      [91, 84, 79, 96],
      ['#3DD68C', '#F5A623', '#9B8FFF', '#4B9EF8']
    );

    /* ── 7-day trend ── */
    const t = D.trend7Days;
    C.line('ov-trend', t.labels, [
      { label: 'SMS',   data: t.sms,   borderColor: '#3DD68C' },
      { label: 'Email', data: t.email, borderColor: '#4B9EF8', borderDash: [4, 3] },
      { label: 'Voice', data: t.voice, borderColor: '#9B8FFF', borderDash: [2, 2] },
    ], {
      scales: {
        x: C.baseScales.x,
        y: { ...C.pctScale, min: 60, max: 100, grid: { color: C.gc }, ticks: { ...C.baseScales.y.ticks, callback: v => v + '%' } },
      },
    });
  }

  return { render };
})();
