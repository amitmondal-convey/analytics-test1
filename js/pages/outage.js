/* ─── Outage Impact Page ──────────────────────────────────────────────── */
window.PageOutage = (function () {
  const D = window.AppData;
  const C = window.Charts;

  function render() {
    const o = D.activeOutages;
    const el = document.getElementById('page-outage');
    el.innerHTML = `
      <div class="section-label">Outage impact & equity-aware restoration analytics</div>

      <div class="grid g4">
        <div class="kpi alert">
          <div class="kpi-label">Active outages</div>
          <div class="kpi-value">${o.count}</div>
          <div class="kpi-sub neg">${o.careHeavy} with CARE customers &gt;30%</div>
        </div>
        <div class="kpi alert">
          <div class="kpi-label">Customers affected</div>
          <div class="kpi-value">${D.fmt(o.customersAffected)}</div>
          <div class="kpi-sub neg">${o.careAffectedPct}% CARE / low-income</div>
        </div>
        <div class="kpi warn">
          <div class="kpi-label">Avg outage duration</div>
          <div class="kpi-value">${o.avgDurationHrs} hrs</div>
          <div class="kpi-sub neg">CARE zones: ${o.careDurationHrs} hrs avg</div>
        </div>
        <div class="kpi warn">
          <div class="kpi-label">ETOR accuracy</div>
          <div class="kpi-value">${o.etorAccuracy}%</div>
          <div class="kpi-sub neu">Within ±30 min of actual</div>
        </div>
      </div>

      <div class="grid g2">
        <div class="card">
          <div class="card-hd">
            <div class="card-title">
              <i class="ti ti-bolt card-title-icon"></i>
              Outage duration vs. equity concentration
            </div>
          </div>
          <div class="ch" style="height:210px"><canvas id="out-scatter"></canvas></div>
          <div style="margin-top:6px;font-size:10px;color:var(--text-muted)">
            Each point = one active outage. X: % CARE customers in zone. Y: duration (hrs).
            Positive correlation reveals systemic equity gap in restoration prioritization.
          </div>
        </div>
        <div class="card">
          <div class="card-hd">
            <div class="card-title">
              <i class="ti ti-message-report card-title-icon"></i>
              Notification performance by outage phase
            </div>
          </div>
          <div class="legend">
            <span class="leg"><span class="leg-sq" style="background:#3DD68C"></span>General</span>
            <span class="leg"><span class="leg-sq" style="background:#F5A623"></span>CARE</span>
            <span class="leg"><span class="leg-sq" style="background:#FF5C5C"></span>Medical</span>
          </div>
          <div class="ch" style="height:190px"><canvas id="out-phase-bar"></canvas></div>
        </div>
      </div>

      <div class="grid g3">
        <div class="card">
          <div class="card-hd">
            <div class="card-title">
              <i class="ti ti-clock card-title-icon"></i>
              Time-to-first-notification by segment
            </div>
          </div>
          <div class="hbar" style="margin-top:4px">
            ${D.timeToFirstNotification.map(t => `
              <div class="hbar-row">
                <span class="hbar-lbl">${t.segment}</span>
                <div class="hbar-track">
                  <div class="hbar-fill" style="width:${Math.min(100, t.mins * 3)}%;background:${t.color}"></div>
                </div>
                <span class="hbar-val" style="color:${t.mins <= 8 ? 'var(--pos)' : t.mins <= 15 ? 'var(--warn)' : 'var(--neg)'}">${t.mins} min</span>
              </div>
            `).join('')}
          </div>
          <div style="margin-top:8px;padding:8px;background:rgba(255,92,92,0.06);border:1px solid rgba(255,92,92,0.2);border-radius:6px;font-size:10px;color:var(--neg)">
            CARE & LEP significantly lag SLA targets. 31-min delay for LEP is 4× above the 8-min target.
          </div>
        </div>
        <div class="card">
          <div class="card-hd">
            <div class="card-title">
              <i class="ti ti-circuit-cell card-title-icon"></i>
              Smart meter vs. manual — restoration confirm
            </div>
          </div>
          <div class="stat-grid" style="grid-template-columns:1fr 1fr;gap:8px;margin-top:4px">
            ${[
              { label: 'AMI / Smart meter', val: '94%', color: 'var(--pos)', bg: 'rgba(61,214,140,0.08)' },
              { label: 'Opt-out AMI', val: '82%', color: 'var(--info)', bg: 'rgba(75,158,248,0.08)' },
              { label: 'Non-smart meter', val: '61%', color: 'var(--warn)', bg: 'rgba(245,166,35,0.08)' },
              { label: 'CARE w/ no AMI', val: '12%', color: 'var(--neg)', bg: 'rgba(255,92,92,0.08)', border: '1px solid rgba(255,92,92,0.25)' },
            ].map(s => `
              <div class="stat-cell" style="background:${s.bg};${s.border ? 'border:' + s.border : ''}">
                <div class="stat-cell-val" style="color:${s.color}">${s.val}</div>
                <div class="stat-cell-lbl">${s.label}</div>
              </div>
            `).join('')}
          </div>
        </div>
        <div class="card">
          <div class="card-hd">
            <div class="card-title">
              <i class="ti ti-map-pin card-title-icon"></i>
              PSPS event impact by zone
            </div>
          </div>
          <div class="hbar" style="margin-top:4px">
            ${D.pspsZoneData.map(z => `
              <div class="hbar-row">
                <span class="hbar-lbl wide">${z.zone}</span>
                <div class="hbar-track">
                  <div class="hbar-fill" style="width:${z.pct}%;background:${z.color}"></div>
                </div>
                <span class="hbar-val">${z.pct}%</span>
              </div>
            `).join('')}
          </div>
          <div style="margin-top:12px">
            <button class="btn btn-ghost" style="width:100%;font-size:10px">Get PSPS strategy ↗</button>
          </div>
        </div>
      </div>
    `;

    /* scatter */
    C.scatter('out-scatter', [{
      label: 'Outages',
      data: D.outageScatter,
      backgroundColor: 'rgba(75,158,248,0.7)',
    }], '% CARE customers in outage zone', 'Avg duration (hrs)', {
      scales: {
        x: {
          min: 0, max: 80,
          title: { display: true, text: '% CARE customers', color: C.tc, font: { size: 9 } },
          grid: { color: C.gc }, ticks: { color: C.tc, font: { size: 9 }, callback: v => v + '%' },
        },
        y: {
          min: 0, max: 8,
          title: { display: true, text: 'Avg duration (hrs)', color: C.tc, font: { size: 9 } },
          grid: { color: C.gc }, ticks: { color: C.tc, font: { size: 9 } },
        },
      },
    });

    /* phase bar */
    const op = D.outageNotificationPhase;
    C.bar('out-phase-bar', op.labels, [
      { label: 'General', data: op.general, backgroundColor: '#3DD68C' },
      { label: 'CARE',    data: op.care,    backgroundColor: '#F5A623' },
      { label: 'Medical', data: op.medical, backgroundColor: '#FF5C5C' },
    ], {
      scales: {
        x: { grid: { color: C.gc }, ticks: { color: C.tc, font: { size: 9 } } },
        y: { min: 0, max: 110, grid: { color: C.gc }, ticks: { color: C.tc, font: { size: 9 }, callback: v => v + '%' } },
      },
    });
  }

  return { render };
})();
