/* ─── Critical Customers Page ─────────────────────────────────────────── */
window.PageCritical = (function () {
  const D = window.AppData;
  const C = window.Charts;

  function render() {
    const cr = D.criticalCustomers;
    const ps = D.pspsOverlap;
    const el = document.getElementById('page-critical');
    el.innerHTML = `
      <div class="section-label">Medical, life support & critical customer analytics</div>

      <div class="grid g4">
        <div class="kpi alert">
          <div class="kpi-label">Life support customers</div>
          <div class="kpi-value">8,240</div>
          <div class="kpi-sub neg">340 unreached today · P1</div>
        </div>
        <div class="kpi good">
          <div class="kpi-label">Medical baseline</div>
          <div class="kpi-value">12,887</div>
          <div class="kpi-sub pos">96.1% delivery SLA met</div>
        </div>
        <div class="kpi good">
          <div class="kpi-label">Critical facilities</div>
          <div class="kpi-value">891</div>
          <div class="kpi-sub pos">Hospital, fire, police</div>
        </div>
        <div class="kpi warn">
          <div class="kpi-label">Avg contact time (critical)</div>
          <div class="kpi-value">4.2 min</div>
          <div class="kpi-sub neg">Target: 3 min — SLA gap</div>
        </div>
      </div>

      <div class="grid g2">
        <div class="card">
          <div class="card-hd">
            <div class="card-title">
              <i class="ti ti-heart-rate-monitor card-title-icon"></i>
              SLA compliance — critical customer types
            </div>
          </div>
          <div class="ch" style="height:200px"><canvas id="cr-sla-bar"></canvas></div>
          <div style="margin-top:8px;font-size:10px;color:var(--text-muted)">
            PSPS zone at 91.2% is below the 95% regulatory target. 3.8pp gap represents 800+ customers missed per major PSPS event.
          </div>
        </div>
        <div class="card">
          <div class="card-hd">
            <div class="card-title">
              <i class="ti ti-alert-triangle card-title-icon"></i>
              Unreached critical customers — today
            </div>
            <span class="badge badge-red">Action required</span>
          </div>
          <table class="tbl">
            <thead><tr>
              <th>Type</th><th>Unreached</th><th>Last contact</th><th>Channel</th><th>Priority</th>
            </tr></thead>
            <tbody>
              <tr>
                <td><span class="badge badge-red">Life support</span></td>
                <td class="mono" style="color:var(--neg)">340</td>
                <td style="color:var(--text-secondary)">18h ago</td>
                <td>Voice only</td>
                <td><span class="badge badge-red">P1</span></td>
              </tr>
              <tr>
                <td><span class="badge badge-amber">Medical baseline</span></td>
                <td class="mono" style="color:var(--warn)">512</td>
                <td style="color:var(--text-secondary)">12h ago</td>
                <td>SMS / Email</td>
                <td><span class="badge badge-amber">P2</span></td>
              </tr>
              <tr>
                <td><span class="badge badge-blue">Critical facility</span></td>
                <td class="mono" style="color:var(--info)">14</td>
                <td style="color:var(--text-secondary)">4h ago</td>
                <td>All channels</td>
                <td><span class="badge badge-red">P1</span></td>
              </tr>
              <tr>
                <td><span class="badge badge-purple">PSPS zone</span></td>
                <td class="mono" style="color:var(--purple)">2,104</td>
                <td style="color:var(--text-secondary)">6h ago</td>
                <td>SMS / Voice</td>
                <td><span class="badge badge-amber">P2</span></td>
              </tr>
            </tbody>
          </table>
          <div style="margin-top:12px">
            <button class="btn" style="width:100%">Generate retry campaign strategy ↗</button>
          </div>
        </div>
      </div>

      <div class="grid g3">
        <div class="card">
          <div class="card-hd">
            <div class="card-title">
              <i class="ti ti-chart-line card-title-icon"></i>
              Critical delivery trend — 7 days
            </div>
          </div>
          <div class="ch" style="height:160px"><canvas id="cr-trend"></canvas></div>
        </div>
        <div class="card">
          <div class="card-hd">
            <div class="card-title">
              <i class="ti ti-bolt card-title-icon"></i>
              Life support × PSPS zone overlap
            </div>
          </div>
          <div class="stat-grid" style="grid-template-columns:1fr 1fr;gap:8px;margin-top:4px">
            <div class="stat-cell">
              <div class="stat-cell-val" style="color:var(--neg)">${ps.lifeSupportInZone.toLocaleString()}</div>
              <div class="stat-cell-lbl">Life support in PSPS zone</div>
            </div>
            <div class="stat-cell">
              <div class="stat-cell-val" style="color:var(--pos)">${ps.contactedBeforeShutoff}%</div>
              <div class="stat-cell-lbl">Contacted before shutoff</div>
            </div>
            <div class="stat-cell">
              <div class="stat-cell-val" style="color:var(--info)">${ps.unreachedBeforeShutoff}</div>
              <div class="stat-cell-lbl">Unreached before shutoff</div>
            </div>
            <div class="stat-cell" style="border:1px solid rgba(255,92,92,0.3);background:rgba(255,92,92,0.06)">
              <div class="stat-cell-val" style="color:var(--neg)">${ps.slaGapPct}%</div>
              <div class="stat-cell-lbl" style="color:var(--neg)">SLA gap — regulatory risk</div>
            </div>
          </div>
        </div>
        <div class="card">
          <div class="card-hd">
            <div class="card-title">
              <i class="ti ti-users card-title-icon"></i>
              Critical customer channel preference
            </div>
          </div>
          <div class="hbar" style="margin-top:4px">
            ${[
              { label: 'Life supp · Voice', pct: 72, color: '#FF5C5C' },
              { label: 'Life supp · SMS',   pct: 18, color: '#4B9EF8' },
              { label: 'Medical · Voice',   pct: 54, color: '#9B8FFF' },
              { label: 'Medical · SMS',     pct: 31, color: '#3DD68C' },
              { label: 'Crit. fac. · All', pct: 98, color: '#F5A623' },
            ].map(r => `
              <div class="hbar-row">
                <span class="hbar-lbl wide">${r.label}</span>
                <div class="hbar-track"><div class="hbar-fill" style="width:${r.pct}%;background:${r.color}"></div></div>
                <span class="hbar-val">${r.pct}%</span>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;

    /* SLA bar */
    C.bar('cr-sla-bar', D.criticalSlaData.labels, [{
      label: 'SLA compliance',
      data: D.criticalSlaData.values,
      backgroundColor: ['#FF5C5C', '#4B9EF8', '#3DD68C', '#9B8FFF'],
      borderRadius: 4,
    }], {
      scales: {
        x: { grid: { color: C.gc }, ticks: { color: C.tc, font: { size: 9 } } },
        y: {
          min: 80, max: 100,
          grid: { color: C.gc },
          ticks: { color: C.tc, font: { size: 9 }, callback: v => v + '%' },
        },
      },
    });

    /* trend */
    const ct = D.criticalDeliveryTrend;
    C.line('cr-trend', ct.labels, [{
      label: 'Critical delivery',
      data: ct.values,
      borderColor: '#FF5C5C',
      backgroundColor: 'rgba(255,92,92,0.08)',
      fill: true,
    }], {
      scales: {
        x: { grid: { color: C.gc }, ticks: { color: C.tc, font: { size: 9 } } },
        y: { min: 88, max: 100, grid: { color: C.gc }, ticks: { color: C.tc, font: { size: 9 }, callback: v => v + '%' } },
      },
    });
  }

  return { render };
})();
