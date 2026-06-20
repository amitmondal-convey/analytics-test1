/* ─── Chart helpers & theme ───────────────────────────────────────────── */
window.Charts = (function () {

  const gc = 'rgba(0,0,0,0.06)';
  const tc = 'rgba(0,0,0,0.45)';

  const baseScales = {
    x: { grid: { color: gc }, ticks: { color: tc, font: { size: 10, family: "'JetBrains Mono', monospace" } } },
    y: { grid: { color: gc }, ticks: { color: tc, font: { size: 10, family: "'JetBrains Mono', monospace" } } },
  };

  const baseOpts = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false }, tooltip: {
      backgroundColor: '#FFFFFF',
      borderColor: 'rgba(0,0,0,0.10)',
      borderWidth: 1,
      titleColor: '#111827',
      bodyColor: '#4B5563',
      titleFont: { family: "'JetBrains Mono', monospace", size: 11 },
      bodyFont: { family: "'Inter', sans-serif", size: 10 },
      padding: 10,
    }},
    scales: baseScales,
    animation: { duration: 600, easing: 'easeOutQuart' },
  };

  const pctScale = {
    min: 0, max: 100,
    ticks: { ...baseScales.y.ticks, callback: v => v + '%' },
    grid: { color: gc },
  };

  const registry = {};

  function destroy(id) {
    if (registry[id]) { registry[id].destroy(); delete registry[id]; }
  }

  function make(id, type, data, opts = {}) {
    destroy(id);
    const el = document.getElementById(id);
    if (!el) return;
    const chart = new Chart(el, {
      type,
      data,
      options: deepMerge(baseOpts, opts),
    });
    registry[id] = chart;
    return chart;
  }

  function deepMerge(a, b) {
    const out = Object.assign({}, a);
    for (const k of Object.keys(b)) {
      if (b[k] && typeof b[k] === 'object' && !Array.isArray(b[k])) {
        out[k] = deepMerge(a[k] || {}, b[k]);
      } else {
        out[k] = b[k];
      }
    }
    return out;
  }

  /* Line chart */
  function line(id, labels, datasets, opts = {}) {
    return make(id, 'line', {
      labels,
      datasets: datasets.map(d => ({
        borderWidth: 2,
        pointRadius: 0,
        tension: 0.4,
        fill: false,
        ...d,
      })),
    }, opts);
  }

  /* Bar chart */
  function bar(id, labels, datasets, opts = {}) {
    return make(id, 'bar', {
      labels,
      datasets: datasets.map(d => ({
        borderRadius: 3,
        ...d,
      })),
    }, opts);
  }

  /* Doughnut */
  function doughnut(id, labels, data, colors, opts = {}) {
    return make(id, 'doughnut', {
      labels,
      datasets: [{ data, backgroundColor: colors, borderWidth: 0, hoverBorderWidth: 2, hoverBorderColor: '#fff' }],
    }, {
      plugins: {
        legend: { display: false },
        tooltip: baseOpts.plugins.tooltip,
      },
      scales: {},
      cutout: '68%',
      animation: { duration: 700 },
      ...opts,
    });
  }

  /* Scatter */
  function scatter(id, datasets, xLabel, yLabel, opts = {}) {
    return make(id, 'scatter', {
      datasets: datasets.map(d => ({ pointRadius: 6, pointHoverRadius: 8, ...d })),
    }, {
      scales: {
        x: { ...baseScales.x, title: { display: true, text: xLabel, color: tc, font: { size: 10 } } },
        y: { ...baseScales.y, title: { display: true, text: yLabel, color: tc, font: { size: 10 } } },
      },
      ...opts,
    });
  }

  /* Spark line (small inline chart) */
  function spark(id, data, color) {
    destroy(id);
    const el = document.getElementById(id);
    if (!el) return;
    const chart = new Chart(el, {
      type: 'line',
      data: {
        labels: data.map((_, i) => i),
        datasets: [{
          data,
          borderColor: color,
          backgroundColor: color.replace(')', ',0.1)').replace('rgb', 'rgba'),
          borderWidth: 1.5,
          pointRadius: 0,
          fill: true,
          tension: 0.4,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false }, tooltip: { enabled: false } },
        scales: { x: { display: false }, y: { display: false } },
        animation: { duration: 400 },
      },
    });
    registry[id] = chart;
    return chart;
  }

  /* Horizontal gauge bar (canvas-based) */
  function gauge(canvasId, value, color, max = 100) {
    const el = document.getElementById(canvasId);
    if (!el) return;
    const ctx = el.getContext('2d');
    const w = el.width; const h = el.height;
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = '#232D42';
    ctx.beginPath();
    ctx.roundRect(0, 0, w, h, 3);
    ctx.fill();
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.roundRect(0, 0, (value / max) * w, h, 3);
    ctx.fill();
  }

  return { make, line, bar, doughnut, scatter, spark, gauge, destroy, baseOpts, pctScale, baseScales, gc, tc };
})();
