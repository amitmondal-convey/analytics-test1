/* ─── Channel Intelligence Page ───────────────────────────────────────── */
window.PageChannels = (function () {
  const D = window.AppData;
  const C = window.Charts;

  function buildHeatmap(id) {
    const h = D.heatmapData;
    const el = document.getElementById(id);
    if (!el) return;
    let html = `<div class="heatmap-grid" style="grid-template-columns:28px repeat(7,1fr)">`;
    html += `<div></div>${h.days.map(d => `<div class="hm-header">${d}</div>`).join('')}`;
    h.hours.forEach((hr, r) => {
      html += `<div class="hm-header" style="justify-content:flex-end;padding-right:4px">${hr}</div>`;
      h.vals[r].forEach(v => {
        const alpha = Math.round((v - 38) / 54 * 100) / 100;
        html += `<div class="hm-cell" style="background:rgba(61,214,140,${Math.max(0.05, alpha.toFixed(2))});color:${v > 70 ? '#fff' : 'var(--text-secondary)'}">${v}</div>`;
      });
    });
    html += '</div>';
    el.innerHTML = html;
  }

  function render() {
    const ch = D.channelOverall;
    const el = document.getElementById('page-channels');
    el.innerHTML = `
      <div class="section-label">Multi-channel performance intelligence</div>

      <div class="grid g4">
        <div class="kpi">
          <div class="kpi-label">SMS delivered</div>
          <div class="kpi-value" style="color:var(--s1)">${ch.sms.delivered}%</div>
          <div class="kpi-sub pos">of ${D.fmt(ch.sms.sent)} sent</div>
        </div>
        <div class="kpi warn">
          <div class="kpi-label">Email delivered</div>
          <div class="kpi-value" style="color:var(--warn)">${ch.email.delivered}%</div>
          <div class="kpi-sub neg">of ${D.fmt(ch.email.sent)} sent</div>
        </div>
        <div class="kpi">
          <div class="kpi-label">Voice — person reach</div>
          <div class="kpi-value" style="color:var(--s2)">${ch.voice.person}%</div>
          <div class="kpi-sub neu">AM: ${ch.voice.answerMachine}% · Drop: ${ch.voice.noAnswer}%</div>
        </div>
        <div class="kpi warn">
          <div class="kpi-label">Opt-out rate</div>
          <div class="kpi-value">0.8%</div>
          <div class="kpi-sub neg">↑ LEP segments 2.1%</div>
        </div>
      </div>

      <div class="grid g2">
        <div class="card">
          <div class="card-hd">
            <div class="card-title">
              <i class="ti ti-chart-bar card-title-icon"></i>
              Channel delivery by customer segment
            </div>
          </div>
          <div class="legend">
            <span class="leg"><span class="leg-sq" style="background:var(--s1)"></span>Voice</span>
            <span class="leg"><span class="leg-sq" style="background:var(--s2)"></span>SMS</span>
            <span class="leg"><span class="leg-sq" style="background:var(--s3)"></span>Email</span>
          </div>
          <div class="ch" style="height:200px"><canvas id="ch-seg-bar"></canvas></div>
        </div>
        <div class="card">
          <div class="card-hd">
            <div class="card-title">
              <i class="ti ti-clock card-title-icon"></i>
              Optimal send-time heatmap
            </div>
            <span class="badge badge-blue">Engagement rate %</span>
          </div>
          <div id="ch-heatmap" style="margin-top:6px"></div>
        </div>
      </div>

      <div class="grid g3">
        <div class="card">
          <div class="card-hd">
            <div class="card-title">
              <i class="ti ti-phone-call card-title-icon"></i>
              Voice outcome breakdown
            </div>
          </div>
          <div class="ch" style="height:160px"><canvas id="ch-voice-donut"></canvas></div>
          <div class="legend" style="margin-top:8px">
            <span class="leg"><span class="leg-sq" style="background:#3DD68C"></span>Person</span>
            <span class="leg"><span class="leg-sq" style="background:#4B9EF8"></span>Answ. machine</span>
            <span class="leg"><span class="leg-sq" style="background:#4E5969"></span>No answer</span>
            <span class="leg"><span class="leg-sq" style="background:#FF5C5C"></span>Failed</span>
            <span class="leg"><span class="leg-sq" style="background:#F5A623"></span>Opt-out</span>
          </div>
        </div>
        <div class="card">
          <div class="card-hd">
            <div class="card-title">
              <i class="ti ti-mail card-title-icon"></i>
              Email engagement funnel
            </div>
          </div>
          <div class="hbar" style="margin-top:4px">
            ${[
              { label: 'Sent',       pct: 100,  color: '#4E5969' },
              { label: 'Delivered',  pct: 87.2, color: '#4B9EF8' },
              { label: 'Opened',     pct: 38.4, color: '#9B8FFF' },
              { label: 'Clicked',    pct: 14.1, color: '#F5A623' },
              { label: 'Opted out',  pct: 0.6,  color: '#FF5C5C' },
            ].map(r => `
              <div class="hbar-row">
                <span class="hbar-lbl">${r.label}</span>
                <div class="hbar-track"><div class="hbar-fill" style="width:${r.pct}%;background:${r.color}"></div></div>
                <span class="hbar-val">${r.pct}%</span>
              </div>
            `).join('')}
          </div>
        </div>
        <div class="card">
          <div class="card-hd">
            <div class="card-title">
              <i class="ti ti-message card-title-icon"></i>
              SMS delivery intelligence
            </div>
          </div>
          <div class="hbar" style="margin-top:4px">
            ${[
              { label: 'Delivered',     pct: 94.1, color: '#3DD68C' },
              { label: 'Sent to prov.', pct: 3.8,  color: '#4B9EF8' },
              { label: 'Failed',        pct: 1.7,  color: '#FF5C5C' },
              { label: 'Suppressed',    pct: 0.4,  color: '#F5A623' },
            ].map(r => `
              <div class="hbar-row">
                <span class="hbar-lbl">${r.label}</span>
                <div class="hbar-track"><div class="hbar-fill" style="width:${r.pct}%;background:${r.color}"></div></div>
                <span class="hbar-val">${r.pct}%</span>
              </div>
            `).join('')}
          </div>
          <div style="margin-top:12px;padding:10px;background:var(--surface-2);border-radius:6px;font-size:10px;color:var(--text-secondary);line-height:1.6">
            LEP segment SMS failure is <strong style="color:var(--neg)">5.2× higher</strong> than general. Mobile phone indicator shows 34% of LEP customers have landline-only records on file.
          </div>
        </div>
      </div>

      <div class="grid g2">
        <div class="card">
          <div class="card-hd">
            <div class="card-title">
              <i class="ti ti-repeat card-title-icon"></i>
              Channel fallback effectiveness
            </div>
            <span class="badge badge-green">Delivery gain when fallback triggered</span>
          </div>
          <div class="hbar" style="margin-top:4px">
            ${D.channelFallback.map(f => `
              <div class="hbar-row">
                <span class="hbar-lbl wide">${f.from} → ${f.to}</span>
                <div class="hbar-track"><div class="hbar-fill" style="width:${f.gain * 4}%;background:var(--s1)"></div></div>
                <span class="hbar-val" style="color:var(--pos)">+${f.gain}pp</span>
              </div>
            `).join('')}
            <div class="hbar-row">
              <span class="hbar-lbl wide">No fallback</span>
              <div class="hbar-track"><div class="hbar-fill" style="width:2%;background:var(--text-muted)"></div></div>
              <span class="hbar-val" style="color:var(--text-muted)">Baseline</span>
            </div>
          </div>
          <div style="margin-top:10px;font-size:10px;color:var(--text-muted)">
            CARE segment sees +22pp gain with Voice fallback. Highest ROI intervention available.
          </div>
        </div>
        <div class="card">
          <div class="card-hd">
            <div class="card-title">
              <i class="ti ti-calendar card-title-icon"></i>
              Optimal send-time by segment
            </div>
          </div>
          <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:6px;margin-top:4px">
            ${D.optimalSendTime.map(s => `
              <div style="background:var(--surface-2);border-radius:var(--radius-sm);padding:8px 10px">
                <div style="font-size:9px;color:var(--text-muted);margin-bottom:2px">${s.segment} · ${s.channel}</div>
                <div style="font-family:var(--font-mono);font-size:16px;font-weight:500;color:var(--pos)">${s.time}</div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;

    buildHeatmap('ch-heatmap');

    /* channel by segment grouped bar */
    C.bar('ch-seg-bar', D.channelBySegment.labels, [
      { label: 'Voice', data: D.channelBySegment.voice, backgroundColor: '#3DD68C' },
      { label: 'SMS',   data: D.channelBySegment.sms,   backgroundColor: '#4B9EF8' },
      { label: 'Email', data: D.channelBySegment.email,  backgroundColor: '#9B8FFF' },
    ], {
      scales: {
        x: { grid: { color: C.gc }, ticks: { color: C.tc, font: { size: 9 } } },
        y: { min: 0, max: 110, grid: { color: C.gc }, ticks: { color: C.tc, font: { size: 9 }, callback: v => v + '%' } },
      },
    });

    /* voice doughnut */
    C.doughnut('ch-voice-donut',
      ['Person', 'Answ. Machine', 'No answer', 'Failed', 'Opt-out'],
      [42, 31, 14, 8, 5],
      ['#3DD68C', '#4B9EF8', '#4E5969', '#FF5C5C', '#F5A623']
    );
  }

  return { render };
})();
