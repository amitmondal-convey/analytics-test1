/* ─── Equity Segments Page ────────────────────────────────────────────── */
window.PageEquity = (function () {
  const D = window.AppData;
  const C = window.Charts;

  function render() {
    const el = document.getElementById('page-equity');
    el.innerHTML = `
      <div class="section-label">Equity & vulnerability segmentation analytics</div>

      <div class="grid g4">
        <div class="kpi alert">
          <div class="kpi-label">CARE / FERA enrolled</div>
          <div class="kpi-value">78,412</div>
          <div class="kpi-sub neg">↓ 16% delivery vs avg</div>
        </div>
        <div class="kpi alert">
          <div class="kpi-label">Low English proficiency</div>
          <div class="kpi-value">34,550</div>
          <div class="kpi-sub neg">↓ 21% delivery vs avg</div>
        </div>
        <div class="kpi warn">
          <div class="kpi-label">Prepay customers</div>
          <div class="kpi-value">11,240</div>
          <div class="kpi-sub neu">Billing campaigns critical</div>
        </div>
        <div class="kpi">
          <div class="kpi-label">Senior / vulnerable flag</div>
          <div class="kpi-value">22,800</div>
          <div class="kpi-sub neu">Medical baseline overlap</div>
        </div>
      </div>

      <div class="grid g3">
        <div class="card" style="grid-column:span 2">
          <div class="card-hd">
            <div class="card-title">
              <i class="ti ti-chart-bar card-title-icon"></i>
              Delivery gap analysis — equity segments vs. general baseline
            </div>
            <span class="badge badge-amber">Equity view</span>
          </div>
          <div class="hbar">
            ${Object.entries(D.segmentDelivery).map(([seg, v]) => `
              <div class="hbar-row">
                <span class="hbar-lbl">${seg}</span>
                <div class="hbar-track">
                  <div class="hbar-fill" style="width:${v.rate}%;background:${D.segColor(seg)}"></div>
                </div>
                <span class="hbar-val" style="color:${v.rate >= 90 ? 'var(--pos)' : v.rate >= 80 ? 'var(--warn)' : 'var(--neg)'}">${v.rate}%</span>
                <span class="hbar-delta" style="color:${v.rate >= 91 ? 'var(--pos)' : 'var(--neg)'}">${v.rate >= 91 ? '▲' : '▼'} ${Math.abs(91 - v.rate).toFixed(1)}pp</span>
              </div>
            `).join('')}
          </div>
          <div style="margin-top:10px;padding:8px;background:var(--surface-2);border-radius:6px;font-size:10px;color:var(--text-muted)">
            General baseline: 91.2%. All equity segments underperform — LEP and Prepay show most significant gap.
          </div>
        </div>
        <div class="card">
          <div class="card-hd">
            <div class="card-title">
              <i class="ti ti-chart-donut card-title-icon"></i>
              Customer type mix
            </div>
          </div>
          <div class="ch" style="height:160px"><canvas id="eq-donut"></canvas></div>
          <div class="legend" style="margin-top:8px">
            <span class="leg"><span class="leg-sq" style="background:#3DD68C"></span>Residential</span>
            <span class="leg"><span class="leg-sq" style="background:#4B9EF8"></span>Commercial</span>
            <span class="leg"><span class="leg-sq" style="background:#9B8FFF"></span>Industrial</span>
            <span class="leg"><span class="leg-sq" style="background:#4E5969"></span>SMB</span>
          </div>
        </div>
      </div>

      <div class="grid g3">
        <div class="card">
          <div class="card-hd">
            <div class="card-title">
              <i class="ti ti-language card-title-icon"></i>
              Language preference match rate
            </div>
          </div>
          <div class="hbar" style="margin-top:4px">
            ${D.languageMatchRate.map(l => `
              <div class="hbar-row">
                <span class="hbar-lbl">${l.lang}</span>
                <div class="hbar-track">
                  <div class="hbar-fill" style="width:${l.rate}%;background:${l.rate > 85 ? '#3DD68C' : l.rate > 65 ? '#4B9EF8' : l.rate > 55 ? '#F5A623' : '#FF5C5C'}"></div>
                </div>
                <span class="hbar-val" style="color:${l.rate > 85 ? 'var(--pos)' : l.rate > 65 ? 'var(--info)' : l.rate > 55 ? 'var(--warn)' : 'var(--neg)'}">${l.rate}%</span>
              </div>
            `).join('')}
          </div>
          <div style="margin-top:8px;font-size:10px;color:var(--text-muted)">% of customers whose preferred language matched the template language used</div>
        </div>
        <div class="card">
          <div class="card-hd">
            <div class="card-title">
              <i class="ti ti-credit-card card-title-icon"></i>
              Billing program delivery correlation
            </div>
          </div>
          <div class="hbar" style="margin-top:4px">
            ${D.billingDelivery.map(b => `
              <div class="hbar-row">
                <span class="hbar-lbl wide">${b.program}</span>
                <div class="hbar-track">
                  <div class="hbar-fill" style="width:${b.rate}%;background:${b.rate > 85 ? '#3DD68C' : b.rate > 70 ? '#4B9EF8' : b.rate > 60 ? '#F5A623' : '#FF5C5C'}"></div>
                </div>
                <span class="hbar-val">${b.rate}%</span>
              </div>
            `).join('')}
          </div>
          <div style="margin-top:8px;font-size:10px;color:var(--text-muted)">Message delivery rate by billing program enrollment status</div>
        </div>
        <div class="card">
          <div class="card-hd">
            <div class="card-title">
              <i class="ti ti-chart-area card-title-icon"></i>
              Engagement vs. vulnerability index
            </div>
          </div>
          <div class="ch" style="height:190px"><canvas id="eq-scatter"></canvas></div>
          <div style="margin-top:6px;font-size:10px;color:var(--text-muted)">Higher vulnerability index correlates directly with lower engagement rate.</div>
        </div>
      </div>

      <div class="card">
        <div class="card-hd">
          <div class="card-title">
            <i class="ti ti-chart-bar card-title-icon"></i>
            Channel effectiveness by equity segment — all three channels
          </div>
        </div>
        <div class="legend">
          <span class="leg"><span class="leg-sq" style="background:#3DD68C"></span>Voice</span>
          <span class="leg"><span class="leg-sq" style="background:#4B9EF8"></span>SMS</span>
          <span class="leg"><span class="leg-sq" style="background:#9B8FFF"></span>Email</span>
        </div>
        <div class="ch" style="height:200px"><canvas id="eq-channel-bar"></canvas></div>
      </div>
    `;

    /* donut */
    C.doughnut('eq-donut',
      ['Residential', 'Commercial', 'Industrial', 'SMB'],
      [68, 19, 8, 5],
      ['#3DD68C', '#4B9EF8', '#9B8FFF', '#4E5969']
    );

    /* scatter */
    C.scatter('eq-scatter', [{
      label: 'Customers',
      data: D.vulnerabilityScatter,
      backgroundColor: 'rgba(75,158,248,0.7)',
    }], '% Vulnerability index', 'Engagement rate %', {
      scales: {
        x: { min: 0, max: 100, title: { display: true, text: 'Vulnerability index', color: C.tc, font: { size: 10 } }, grid: { color: C.gc }, ticks: { color: C.tc, font: { size: 9 } } },
        y: { min: 40, max: 100, title: { display: true, text: 'Engagement %', color: C.tc, font: { size: 10 } }, grid: { color: C.gc }, ticks: { color: C.tc, font: { size: 9 } } },
      },
    });

    /* channel by segment */
    C.bar('eq-channel-bar', D.channelBySegment.labels, [
      { label: 'Voice', data: D.channelBySegment.voice, backgroundColor: '#3DD68C' },
      { label: 'SMS',   data: D.channelBySegment.sms,   backgroundColor: '#4B9EF8' },
      { label: 'Email', data: D.channelBySegment.email,  backgroundColor: '#9B8FFF' },
    ], {
      scales: {
        x: { grid: { color: C.gc }, ticks: { color: C.tc, font: { size: 9 } } },
        y: { min: 0, max: 110, grid: { color: C.gc }, ticks: { color: C.tc, font: { size: 9 }, callback: v => v + '%' } },
      },
    });
  }

  return { render };
})();
