/* ─── AI Strategic Insights Page ─────────────────────────────────────── */
window.PageInsights = (function () {
  const D = window.AppData;

  function render() {
    const el = document.getElementById('page-insights');
    el.innerHTML = `
      <div class="section-label">AI-generated strategic insights & recommendations</div>

      <div class="grid g3">
        <div class="kpi alert">
          <div class="kpi-label">High-priority insights</div>
          <div class="kpi-value">7</div>
          <div class="kpi-sub neg">3 require immediate action</div>
        </div>
        <div class="kpi alert">
          <div class="kpi-label">Equity gaps detected</div>
          <div class="kpi-value">4</div>
          <div class="kpi-sub neg">2 carry regulatory risk</div>
        </div>
        <div class="kpi good">
          <div class="kpi-label">Optimization opportunities</div>
          <div class="kpi-value">12</div>
          <div class="kpi-sub pos">Est. +11% delivery improvement</div>
        </div>
      </div>

      <div>
        ${D.insights.map(ins => `
          <div class="insight-item ${ins.cls}">
            <div class="insight-icon" style="background:${ins.iconBg}">${ins.icon}</div>
            <div class="insight-body">
              <div class="insight-meta">
                <span class="badge ${ins.badge}">${ins.priority} · ${ins.type}</span>
                <span style="font-size:10px;color:var(--text-muted)">${ins.scope}</span>
              </div>
              <div class="insight-text">
                <strong>${ins.headline}</strong>
              </div>
              <div style="font-size:11px;color:var(--text-secondary);line-height:1.6;margin-top:6px">${ins.body}</div>
              <div style="display:flex;gap:16px;margin-top:10px">
                ${ins.metrics.map(m => `
                  <div style="padding:6px 10px;background:var(--surface-2);border-radius:6px;text-align:center">
                    <div style="font-family:var(--font-mono);font-size:15px;font-weight:500;color:${m.color}">${m.val}</div>
                    <div style="font-size:9px;color:var(--text-muted);margin-top:2px">${m.label}</div>
                  </div>
                `).join('')}
              </div>
              <div class="insight-action">→ ${ins.action} ↗</div>
            </div>
          </div>
        `).join('')}
      </div>

      <div class="card" style="margin-top:var(--gap)">
        <div class="card-hd">
          <div class="card-title">
            <i class="ti ti-sparkles card-title-icon"></i>
            Ask the analytics engine
          </div>
          <span class="badge badge-purple">Natural language query</span>
        </div>
        <div style="display:flex;gap:8px;margin-top:4px">
          <input
            id="ai-query-input"
            type="text"
            placeholder="e.g. Which CARE customers in PG&E have not been reached in the last 30 days?"
            style="flex:1;padding:10px 14px;background:var(--surface-2);border:1px solid var(--border-strong);border-radius:var(--radius-sm);color:var(--text-primary);font-size:12px;font-family:var(--font-body);outline:none"
            onfocus="this.style.borderColor='var(--brand)'"
            onblur="this.style.borderColor='var(--border-strong)'"
          />
          <button class="btn" onclick="PageInsights.runQuery()">Analyze ↗</button>
        </div>
        <div style="margin-top:8px;font-size:10px;color:var(--text-muted)">
          Suggested: "Show delivery gap for LEP customers by company" · "Which outages affected the most CARE customers?" · "List campaigns with &lt;80% delivery this week"
        </div>
        <div id="ai-query-result" style="margin-top:12px;display:none;padding:12px;background:var(--surface-2);border-radius:var(--radius-sm);font-size:11px;color:var(--text-secondary);line-height:1.7"></div>
      </div>
    `;
  }

  function runQuery() {
    const input = document.getElementById('ai-query-input');
    const result = document.getElementById('ai-query-result');
    const q = input.value.trim();
    if (!q) return;

    result.style.display = 'block';
    result.innerHTML = `<span style="color:var(--text-muted)">Analyzing…</span>`;

    /* Simulated AI response */
    setTimeout(() => {
      result.innerHTML = `
        <div style="margin-bottom:6px;font-size:10px;font-weight:500;color:var(--text-primary)">
          Analysis result for: <em style="color:var(--pos)">"${q}"</em>
        </div>
        <div>Based on the current data snapshot (Jun 15, 2026): LEP customers across all companies show a combined delivery gap of <strong style="color:var(--neg)">16.8 percentage points</strong> below the general baseline. PG&E EPSS division has the worst performance at <strong style="color:var(--neg)">72.1% delivery</strong> for LEP customers, driven by 34% landline-only phone records and English-only templates deployed to Spanish-preferred accounts. Recommended immediate action: redeploy Mandarin and Spanish-language templates for PG&E EPSS active campaigns. Estimated delivery recovery: <strong style="color:var(--pos)">+8pp</strong> within 7 days.</div>
      `;
    }, 800);
  }

  return { render, runQuery };
})();
