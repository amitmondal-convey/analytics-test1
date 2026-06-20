/* ─── Mock Data Layer ─────────────────────────────────────────────────── */
window.AppData = (function () {

  const COMPANIES = ['Eversource', 'PG&E', 'HECO', 'Idaho Power', 'DTE Energy', 'MLGW'];

  const DIVISIONS = {
    'Eversource':   ['Electric', 'Gas', 'Planned Maint.'],
    'PG&E':         ['EPSS', 'Gas Ops', 'Planned Maint.', 'PSPS'],
    'HECO':         ['HECO_OUTAGE', 'HECO_PLANNED', 'Maui Electric'],
    'Idaho Power':  ['Regional', 'Idaho South', 'Nevada Ops'],
    'DTE Energy':   ['Electric East', 'Electric West', 'Gas'],
    'MLGW':         ['Memphis Electric', 'Memphis Gas'],
  };

  const CAMPAIGN_TYPES = ['Outage', 'PSPS', 'Planned', 'Billing', 'Safety', 'General'];

  const CHANNELS = ['SMS', 'Email', 'Voice'];

  const SEGMENTS = ['General', 'CARE/FERA', 'LEP', 'Medical Baseline', 'Life Support', 'Prepay', 'Senior/Vulnerable'];

  const LANGUAGES = ['English', 'Spanish', 'Mandarin', 'Vietnamese', 'Tagalog', 'Korean', 'Other'];

  /* ── Overview KPIs ──────────────────────────────────────────────── */
  const overviewKPIs = {
    'today': {
      totalMessages:    509824,
      deliveredRate:    89.6,
      equityReach:      61.4,
      activeCampaigns:  155,
      completedToday:   54,
      careReached:      78412,
      medicalNotified:  12887,
      lepCustomers:     34550,
      lifeSupportAlerts: 2104,
      criticalFacilities: 891,
    },
    'week': {
      totalMessages:    2870000,
      deliveredRate:    90.2,
      equityReach:      62.1,
      activeCampaigns:  312,
      completedToday:   258,
      careReached:      412000,
      medicalNotified:  68200,
      lepCustomers:     187000,
      lifeSupportAlerts: 11200,
      criticalFacilities: 4800,
    },
    'month': {
      totalMessages:    11400000,
      deliveredRate:    91.0,
      equityReach:      63.5,
      activeCampaigns:  1240,
      completedToday:   1086,
      careReached:      1680000,
      medicalNotified:  271000,
      lepCustomers:     744000,
      lifeSupportAlerts: 44800,
      criticalFacilities: 19300,
    },
  };

  /* ── 7-day trend ─────────────────────────────────────────────────── */
  const trend7Days = {
    labels: ['Jun 9', 'Jun 10', 'Jun 11', 'Jun 12', 'Jun 13', 'Jun 14', 'Jun 15'],
    sms:   [92, 93, 91, 94, 93, 95, 94],
    email: [85, 88, 84, 87, 86, 89, 87],
    voice: [78, 80, 77, 81, 79, 82, 80],
  };

  const trend30Days = {
    labels: Array.from({ length: 30 }, (_, i) => {
      const d = new Date(2026, 4, 16 + i);
      return `${d.toLocaleString('default', { month: 'short' })} ${d.getDate()}`;
    }),
    sms:    [92,93,91,94,93,95,94,93,92,94,95,93,94,96,94,93,92,95,93,94,95,94,93,92,94,95,93,94,96,94],
    email:  [85,88,84,87,86,89,87,85,86,88,89,87,88,90,88,87,85,88,87,88,89,87,86,85,87,88,86,88,89,87],
    voice:  [78,80,77,81,79,82,80,78,79,81,82,80,81,83,81,80,78,81,79,80,82,80,79,78,80,81,79,80,82,80],
    delivered: [88,89,91,90,92,91,93,90,89,91,92,94,91,90,89,91,90,92,91,93,90,91,92,90,91,92,94,91,92,90],
    failed:    [12,11,9,10,8,9,7,10,11,9,8,6,9,10,11,9,10,8,9,7,10,9,8,10,9,8,6,9,8,10],
  };

  /* ── Delivery by equity segment ─────────────────────────────────── */
  const segmentDelivery = {
    General:           { rate: 91.2, failRate: 8.4,  count: 312000 },
    'CARE/FERA':       { rate: 81.4, failRate: 15.9, count: 78412  },
    LEP:               { rate: 74.2, failRate: 21.3, count: 34550  },
    'Medical Baseline':{ rate: 96.1, failRate: 4.1,  count: 12887  },
    'Life Support':    { rate: 95.9, failRate: 2.7,  count: 8240   },
    Prepay:            { rate: 68.5, failRate: 24.0, count: 11240  },
    'Senior/Vulnerable':{ rate:83.2, failRate: 13.1, count: 22800  },
  };

  /* ── Channel performance by segment ────────────────────────────── */
  const channelBySegment = {
    labels: ['General', 'CARE/FERA', 'LEP', 'Medical', 'Life Supp', 'Crit. Fac.'],
    voice:  [80, 72, 68, 88, 95, 98],
    sms:    [95, 81, 74, 92, 88, 94],
    email:  [88, 78, 62, 85, 80, 90],
  };

  /* ── Company performance ─────────────────────────────────────────── */
  const companyPerf = [
    { name: 'Eversource', score: 82, delivered: 91.2, opened: 41, failed: 8.8,  equity: 68, dataQ: 88, trend: 'up',   messages: 112450, care: 22, med: 8  },
    { name: 'Idaho Power', score: 79, delivered: 93.1, opened: 33, failed: 6.9,  equity: 71, dataQ: 82, trend: 'up',   messages: 29880, care: 14, med: 6   },
    { name: 'HECO',        score: 71, delivered: 87.9, opened: 44, failed: 12.1, equity: 52, dataQ: 74, trend: 'up',   messages: 38220, care: 41, med: 19  },
    { name: 'DTE Energy',  score: 68, delivered: 85.2, opened: 36, failed: 14.8, equity: 61, dataQ: 71, trend: 'flat', messages: 74600, care: 27, med: 11  },
    { name: 'PG&E',        score: 61, delivered: 83.6, opened: 34, failed: 16.4, equity: 48, dataQ: 63, trend: 'down', messages: 136440, care: 31, med: 14 },
    { name: 'MLGW',        score: 65, delivered: 86.4, opened: 31, failed: 13.6, equity: 58, dataQ: 69, trend: 'flat', messages: 38140, care: 35, med: 9  },
  ];

  /* ── Division performance ────────────────────────────────────────── */
  const divisionPerf = [
    { company: 'Eversource', division: 'Electric',       msgs: 112450, delivered: 91.2, care: 22, med: 8  },
    { company: 'PG&E',       division: 'EPSS',           msgs: 92340,  delivered: 82.1, care: 31, med: 14 },
    { company: 'PG&E',       division: 'Planned Maint.', msgs: 44100,  delivered: 94.4, care: 18, med: 11 },
    { company: 'HECO',       division: 'HECO_OUTAGE',    msgs: 38220,  delivered: 87.9, care: 41, med: 19 },
    { company: 'Idaho Power', division: 'Regional',      msgs: 29880,  delivered: 93.1, care: 14, med: 6  },
    { company: 'DTE Energy', division: 'Electric East',  msgs: 51200,  delivered: 86.2, care: 28, med: 12 },
    { company: 'DTE Energy', division: 'Electric West',  msgs: 23400,  delivered: 84.1, care: 25, med: 10 },
    { company: 'MLGW',       division: 'Memphis Electric',msgs: 38140, delivered: 86.4, care: 35, med: 9  },
    { company: 'PG&E',       division: 'PSPS',           msgs: 18200,  delivered: 88.6, care: 38, med: 22 },
  ];

  /* ── Campaign type performance ──────────────────────────────────── */
  const campaignTypePerf = {
    labels: ['Outage', 'PSPS', 'Planned', 'Billing', 'Safety', 'General'],
    delivered: [91, 88, 96, 84, 87, 79],
    engagement: [42, 38, 51, 29, 34, 22],
    avgMessages: [4200, 1800, 2400, 8800, 1200, 640],
    failRate:   [9, 12, 4, 16, 13, 21],
  };

  /* ── Campaign list ───────────────────────────────────────────────── */
  const campaigns = [
    { id: 'PONS#109870', company: 'Eversource', division: 'Electric',    type: 'Planned',   msgs: 16,   delivered: 100, engaged: 81, status: 'completed' },
    { id: 'Pole 22525',  company: 'Eversource', division: 'Electric',    type: 'Outage',    msgs: 13,   delivered: 100, engaged: 77, status: 'completed' },
    { id: 'OA-109652',   company: 'HECO',       division: 'HECO_OUTAGE', type: 'Outage',    msgs: 5,    delivered: 80,  engaged: 60, status: 'running'   },
    { id: '26-05923',    company: 'DTE Energy', division: 'Electric East',type: 'Outage',    msgs: 112,  delivered: 78,  engaged: 42, status: 'running'   },
    { id: 'EPSS-EMAIL-1',company: 'PG&E',       division: 'EPSS',        type: 'PSPS',      msgs: 552,  delivered: 95,  engaged: 38, status: 'running'   },
    { id: 'BILLING-MAY', company: 'MLGW',       division: 'Memphis Electric', type: 'Billing', msgs: 8800, delivered: 83, engaged: 29, status: 'completed' },
    { id: 'PSPS-ZONE-A', company: 'PG&E',       division: 'PSPS',        type: 'PSPS',      msgs: 18200,delivered: 88,  engaged: 41, status: 'running'   },
    { id: 'HECO-CARE-1', company: 'HECO',       division: 'HECO_PLANNED',type: 'Planned',   msgs: 1200, delivered: 84,  engaged: 36, status: 'completed' },
    { id: 'SAFE-2026-Q2',company: 'Idaho Power',division: 'Regional',    type: 'Safety',    msgs: 6400, delivered: 91,  engaged: 48, status: 'completed' },
    { id: 'DTE-GEN-JUN', company: 'DTE Energy', division: 'Electric West',type: 'General',   msgs: 2800, delivered: 76,  engaged: 19, status: 'running'   },
  ];

  /* ── Channel intelligence ───────────────────────────────────────── */
  const channelOverall = {
    sms:   { sent: 187000, delivered: 94.1, failed: 1.7, suppressed: 0.4 },
    email: { sent: 280000, delivered: 66.7, bounced: 12.8, opened: 38.4, clicked: 14.1, optout: 0.6 },
    voice: { sent: 42824,  person: 42,   answerMachine: 31, noAnswer: 14, failed: 8, optout: 5 },
  };

  const channelFallback = [
    { from: 'SMS',   to: 'Voice', gain: 18, note: 'CARE segment sees +22pp' },
    { from: 'Email', to: 'SMS',   gain: 14, note: 'Highest gain in billing campaigns' },
    { from: 'Voice', to: 'SMS',   gain: 9,  note: 'Effective for LEP recovery' },
    { from: 'Email', to: 'Voice', gain: 7,  note: 'Life support default path' },
  ];

  const optimalSendTime = [
    { segment: 'General',  channel: 'SMS',   time: '9am' },
    { segment: 'CARE',     channel: 'SMS',   time: '11am' },
    { segment: 'LEP',      channel: 'Voice', time: '6pm' },
    { segment: 'Medical',  channel: 'All',   time: '7am' },
    { segment: 'General',  channel: 'Email', time: '8am' },
    { segment: 'CARE',     channel: 'Voice', time: '2pm' },
    { segment: 'Prepay',   channel: 'SMS',   time: '5pm' },
    { segment: 'Critical', channel: 'Voice', time: 'Any' },
  ];

  /* Heatmap: 6 hour-slots x 7 days */
  const heatmapData = {
    hours: ['6a', '9a', '12p', '3p', '6p', '9p'],
    days:  ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    vals:  [
      [62, 78, 71, 74, 69, 58, 51],
      [71, 88, 84, 87, 82, 67, 59],
      [68, 82, 79, 83, 77, 63, 55],
      [74, 89, 85, 88, 84, 70, 61],
      [77, 91, 88, 92, 87, 73, 64],
      [45, 52, 49, 51, 47, 41, 38],
    ],
  };

  /* ── Equity segments ─────────────────────────────────────────────── */
  const languageMatchRate = [
    { lang: 'English',    rate: 94 },
    { lang: 'Spanish',    rate: 71 },
    { lang: 'Mandarin',   rate: 63 },
    { lang: 'Vietnamese', rate: 58 },
    { lang: 'Tagalog',    rate: 54 },
    { lang: 'Korean',     rate: 49 },
    { lang: 'Other',      rate: 44 },
  ];

  const billingDelivery = [
    { program: 'Standard billing', rate: 91 },
    { program: 'Delayed bill',     rate: 76 },
    { program: 'Prepay',           rate: 68 },
    { program: 'CARE enrolled',    rate: 61 },
    { program: 'Plus-1 Program',   rate: 54 },
  ];

  const vulnerabilityScatter = [
    { x: 10, y: 92 }, { x: 20, y: 88 }, { x: 30, y: 82 },
    { x: 40, y: 76 }, { x: 55, y: 70 }, { x: 70, y: 63 }, { x: 85, y: 54 },
  ];

  /* ── Critical customers ─────────────────────────────────────────── */
  const criticalCustomers = {
    lifeSupport:       { total: 8240,  unreached: 340,  sla: 95.9, lastContact: '18h ago', channel: 'Voice only', priority: 'P1' },
    medicalBaseline:   { total: 12887, unreached: 512,  sla: 96.1, lastContact: '12h ago', channel: 'SMS/Email',  priority: 'P2' },
    criticalFacility:  { total: 891,   unreached: 14,   sla: 98.9, lastContact: '4h ago',  channel: 'All channels', priority: 'P1' },
    pspsZone:          { total: 18200, unreached: 2104, sla: 91.2, lastContact: '6h ago',  channel: 'SMS/Voice',  priority: 'P2' },
  };

  const pspsOverlap = {
    lifeSupportInZone: 1204,
    contactedBeforeShutoff: 89,
    unreachedBeforeShutoff: 133,
    slaGapPct: 11,
  };

  const criticalSlaData = {
    labels: ['Life support', 'Medical baseline', 'Crit. facility', 'PSPS zone'],
    values: [95.9, 96.1, 98.9, 91.2],
  };

  const criticalDeliveryTrend = {
    labels: ['Jun 9', 'Jun 10', 'Jun 11', 'Jun 12', 'Jun 13', 'Jun 14', 'Jun 15'],
    values: [95.2, 96.1, 94.8, 97.0, 95.5, 96.8, 96.0],
  };

  /* ── Outage impact ──────────────────────────────────────────────── */
  const activeOutages = {
    count: 23,
    careHeavy: 4,
    customersAffected: 88240,
    careAffectedPct: 31,
    avgDurationHrs: 3.4,
    careDurationHrs: 4.9,
    etorAccuracy: 76,
  };

  const outageScatter = [
    { x: 12, y: 2.1 }, { x: 18, y: 2.4 }, { x: 25, y: 3.0 },
    { x: 33, y: 3.8 }, { x: 41, y: 4.5 }, { x: 52, y: 5.2 },
    { x: 61, y: 5.9 }, { x: 70, y: 6.4 }, { x: 15, y: 1.9 }, { x: 28, y: 2.9 },
  ];

  const outageNotificationPhase = {
    labels: ['Outage start', '30-min update', 'ETOR issued', 'Restoration'],
    general: [88, 72, 81, 94],
    care:    [71, 58, 68, 82],
    medical: [95, 89, 92, 98],
  };

  const timeToFirstNotification = [
    { segment: 'Life support',    mins: 4,  color: '#FF5C5C' },
    { segment: 'Medical baseline',mins: 6,  color: '#4B9EF8' },
    { segment: 'General',         mins: 8,  color: '#3DD68C' },
    { segment: 'CARE segment',    mins: 18, color: '#F5A623' },
    { segment: 'LEP customers',   mins: 31, color: '#9B8FFF' },
  ];

  const smartMeterRestore = {
    ami:     { pct: 94, label: 'AMI / Smart meter' },
    optout:  { pct: 82, label: 'Opt-out AMI' },
    manual:  { pct: 61, label: 'Non-smart meter' },
    careNoAmi: { pct: 12, label: 'CARE w/ no AMI' },
  };

  const pspsZoneData = [
    { zone: 'Zone A (High risk)',      pct: 100, color: '#FF5C5C' },
    { zone: 'CARE customers in Zone A',pct: 38,  color: '#F5A623' },
    { zone: 'Medical in Zone A',        pct: 22,  color: '#4B9EF8' },
    { zone: 'Life support',             pct: 8,   color: '#9B8FFF' },
    { zone: 'Microgrid enrolled',       pct: 15,  color: '#3DD68C' },
  ];

  /* ── Customer journey ───────────────────────────────────────────── */
  const journeyFunnel = {
    all: [
      { stage: 'In scope',          n: 487420, pct: 100,  drop: null },
      { stage: 'Sent',              n: 476100, pct: 97.7, drop: '−2.3% filtered / suppressed' },
      { stage: 'Delivered',         n: 426100, pct: 89.5, drop: '−8.2% failed / bounced' },
      { stage: 'Opened / Answered', n: 179900, pct: 42.2, drop: '−47.3% no open or answer' },
      { stage: 'Confirmed / Clicked',n: 71600, pct: 15.1, drop: '−27.1% read but not confirmed' },
      { stage: 'Action taken',      n: 28400,  pct: 5.9,  drop: '−9.2% no follow-through' },
    ],
    care: [
      { stage: 'In scope',          n: 78412,  pct: 100,  drop: null },
      { stage: 'Sent',              n: 76800,  pct: 97.9, drop: '−2.1% suppressed' },
      { stage: 'Delivered',         n: 62500,  pct: 81.4, drop: '−16.5% failed — higher than avg' },
      { stage: 'Opened / Answered', n: 22400,  pct: 35.8, drop: '−45.6% language/channel mismatch' },
      { stage: 'Confirmed / Clicked',n: 7800,  pct: 11.2, drop: '−24.6% not confirmed' },
      { stage: 'Action taken',      n: 2100,   pct: 2.7,  drop: '−8.5% no follow-through' },
    ],
    lep: [
      { stage: 'In scope',          n: 34550,  pct: 100,  drop: null },
      { stage: 'Sent',              n: 33800,  pct: 97.8, drop: '−2.2% suppressed' },
      { stage: 'Delivered',         n: 25100,  pct: 74.2, drop: '−23.6% failed — 2.8× avg failure rate' },
      { stage: 'Opened / Answered', n: 7200,   pct: 28.7, drop: '−45.5% language template mismatch' },
      { stage: 'Confirmed / Clicked',n: 2100,  pct: 8.4,  drop: '−20.3% not confirmed' },
      { stage: 'Action taken',      n: 480,    pct: 1.9,  drop: '−6.5% no follow-through' },
    ],
    medical: [
      { stage: 'In scope',          n: 12887,  pct: 100,  drop: null },
      { stage: 'Sent',              n: 12700,  pct: 98.6, drop: '−1.4% suppressed' },
      { stage: 'Delivered',         n: 12240,  pct: 96.4, drop: '−2.2% failed' },
      { stage: 'Opened / Answered', n: 8240,   pct: 67.3, drop: '−29.1% no answer' },
      { stage: 'Confirmed / Clicked',n: 6800,  pct: 82.5, drop: '−14.8% not confirmed' },
      { stage: 'Action taken',      n: 5900,   pct: 86.8, drop: '−5.7% no follow-through' },
    ],
  };

  const retryAttempts = [
    { segment: 'Life support', attempts: 1.0, color: '#FF5C5C' },
    { segment: 'Medical',      attempts: 1.1, color: '#4B9EF8' },
    { segment: 'General',      attempts: 1.3, color: '#3DD68C' },
    { segment: 'CARE',         attempts: 2.1, color: '#F5A623' },
    { segment: 'Prepay',       attempts: 2.7, color: '#44D4C0' },
    { segment: 'LEP',          attempts: 3.2, color: '#9B8FFF' },
  ];

  const optOutTrend = {
    labels: trend30Days.labels.slice(0, 20),
    general: [0.6,0.6,0.7,0.6,0.7,0.7,0.8,0.7,0.8,0.8,0.9,0.8,0.8,0.9,0.8,0.9,0.8,0.9,0.9,0.8],
    care:    [1.1,1.0,1.2,1.1,1.3,1.2,1.4,1.3,1.4,1.5,1.6,1.5,1.5,1.6,1.7,1.6,1.7,1.8,1.7,1.8],
    lep:     [1.8,1.9,2.0,1.9,2.1,2.0,2.2,2.1,2.2,2.3,2.4,2.2,2.3,2.4,2.1,2.2,2.4,2.3,2.5,2.1],
  };

  const preferenceMismatch = {
    labels: ['SMS', 'Email', 'Voice'],
    preferred: [58, 29, 13],
    actual:    [55, 37, 8],
  };

  /* ── Engagement health ───────────────────────────────────────────── */
  const healthScore = {
    overall: 74,
    delta: 3,
    delivery:   89,
    engagement: 68,
    prefMatch:  71,
    equityReach: 61,
    dataQuality: 78,
  };

  const dataQuality = [
    { metric: 'Phone valid',       pct: 78, color: '#3DD68C' },
    { metric: 'Mobile verified',   pct: 61, color: '#4B9EF8' },
    { metric: 'Email valid',       pct: 84, color: '#9B8FFF' },
    { metric: 'Language pref. set',pct: 67, color: '#F5A623' },
    { metric: 'Channel pref. set', pct: 55, color: '#44D4C0' },
    { metric: 'CARE flag current', pct: 88, color: '#3DD68C' },
  ];

  const healthTrend = {
    labels: Array.from({ length: 13 }, (_, i) => `Wk ${i + 1}`),
    overall: [68,69,70,71,70,72,71,73,72,74,73,74,74],
    equity:  [52,53,54,54,55,56,55,57,58,59,59,60,61],
  };

  const cohortData = [
    { week: 'Jun 1',  vals: [100, 72, 61, 54, 49, 44, 41] },
    { week: 'Jun 8',  vals: [100, 69, 58, 51, 46, 42, null] },
    { week: 'Jun 15', vals: [100, 74, 63, 56, 51, null, null] },
    { week: 'Jun 22', vals: [100, 71, 60, 53, null, null, null] },
    { week: 'Jun 29', vals: [100, 76, 65, null, null, null, null] },
  ];

  /* ── AI Insights ─────────────────────────────────────────────────── */
  const insights = [
    {
      priority: 'P1',
      badge: 'badge-red',
      type: 'Regulatory risk',
      scope: 'Life support · PSPS',
      icon: '⚠️',
      iconBg: 'rgba(255,92,92,0.15)',
      cls: 'p1',
      headline: '133 life support customers missed PSPS pre-notification before Zone A shutoff',
      body: 'CPUC Rule 14459 mandates 2-day advance notice. Current voice-only workflow fails when landline is disconnected. 11% SLA gap across PSPS zones creates direct regulatory exposure. Recommend adding SMS/email fallback for all life support customers with mobile-verified numbers.',
      action: 'Draft compliance workflow',
      prompt: 'Draft a CPUC-compliant life support PSPS pre-notification workflow with channel sequencing, escalation timing, and required message content',
      metrics: [
        { label: 'Unreached', val: '133', color: '#FF5C5C' },
        { label: 'SLA gap', val: '11%', color: '#FF5C5C' },
        { label: 'Regulatory risk', val: 'HIGH', color: '#FF5C5C' },
      ],
    },
    {
      priority: 'P1',
      badge: 'badge-amber',
      type: 'Equity gap',
      scope: 'LEP Segment',
      icon: '🌐',
      iconBg: 'rgba(245,166,35,0.15)',
      cls: 'p1-warn',
      headline: 'Non-English speakers face 2.5× higher message failure — 44% receiving English-only templates',
      body: 'LEP customers have 34% lower mobile phone validity. Spanish and Mandarin segments showing highest SMS bounce rates. Language-template mismatch drives 21.3% failure rate vs. 8.4% for general. Immediate fix: language-matched template assignment + mobile number verification campaign for 17,200 priority accounts.',
      action: 'Build LEP re-engagement strategy',
      prompt: 'Build a LEP customer re-engagement strategy including template localization, mobile number verification, and channel preference update campaigns',
      metrics: [
        { label: 'Failure rate', val: '21.3%', color: '#F5A623' },
        { label: 'vs. general', val: '2.5×', color: '#F5A623' },
        { label: 'Accounts at risk', val: '34,550', color: '#F5A623' },
      ],
    },
    {
      priority: 'P2',
      badge: 'badge-blue',
      type: 'Optimization',
      scope: 'Channel strategy · HECO',
      icon: '📡',
      iconBg: 'rgba(75,158,248,0.15)',
      cls: 'p2',
      headline: 'HECO CARE customers receiving SMS but 41% have landline-only records — switch to Voice-first',
      body: 'Adding Voice as primary channel for landline-flagged CARE customers in HECO would improve delivery by an estimated +18pp. MLGW billing cycle data shows similar pattern yielding +22% improvement with Voice-first. Implementation requires cross-referencing CARE enrollment with phone_type_indicator field.',
      action: 'Model channel switch ROI',
      prompt: 'What is the ROI and implementation plan for switching HECO CARE landline customers to Voice-first channel strategy for outage notifications?',
      metrics: [
        { label: 'Est. improvement', val: '+18pp', color: '#4B9EF8' },
        { label: 'CARE in HECO', val: '41%', color: '#4B9EF8' },
        { label: 'Landline-only', val: '41%', color: '#4B9EF8' },
      ],
    },
    {
      priority: 'P2',
      badge: 'badge-teal',
      type: 'Optimization',
      scope: 'Send-time scheduling',
      icon: '⏱️',
      iconBg: 'rgba(68,212,192,0.15)',
      cls: 'p2',
      headline: 'Blanket 9am sends suppress LEP and senior engagement — segment-aware scheduling could add +11% overall',
      body: 'Campaigns at 8–9am see 31% higher open rates for general segments, but LEP and senior segments peak at 5–7pm. Blanketing all segments with morning sends depresses cross-segment engagement by an estimated 4.2pp. Recommend segment-aware scheduling using: Preferred Language + Customer Type + billing cycle timing signals.',
      action: 'Design timing model',
      prompt: 'Design a send-time optimization model using customer segment attributes like language, customer type, billing cycle, and past engagement patterns',
      metrics: [
        { label: 'Open rate gain', val: '+31%', color: '#44D4C0' },
        { label: 'Engagement delta', val: '+4.2pp', color: '#44D4C0' },
        { label: 'Segments affected', val: '3 of 7', color: '#44D4C0' },
      ],
    },
    {
      priority: 'P3',
      badge: 'badge-purple',
      type: 'Data quality',
      scope: 'Master data',
      icon: '🗄️',
      iconBg: 'rgba(155,143,255,0.15)',
      cls: 'p3',
      headline: 'Phone validation gaps concentrated in CARE & Prepay — 22% invalid vs. 4% general',
      body: '17,200 CARE accounts have phone_valid_indicator = false. This drives suppression and failure at disproportionate rates. A targeted data enrichment initiative for these accounts would improve deliverability and regulatory standing. Start with outage-zone CARE accounts first — highest risk, highest impact.',
      action: 'Build data quality scorecard',
      prompt: 'Build a data quality scorecard for utility customer master data focusing on phone validation, mobile indicator, and email completeness by equity segment',
      metrics: [
        { label: 'Invalid CARE phones', val: '22%', color: '#9B8FFF' },
        { label: 'vs. general', val: '5.5×', color: '#9B8FFF' },
        { label: 'Priority accounts', val: '17.2K', color: '#9B8FFF' },
      ],
    },
  ];

  /* ── Campaign velocity (30-day) ─────────────────────────────────── */
  const campaignVelocity = {
    labels: trend30Days.labels.slice(0, 15),
    completed: [4,6,8,5,7,9,6,5,8,7,9,6,7,8,6],
    running:   [2,3,2,4,3,2,3,4,2,3,2,4,3,2,3],
    stopped:   [1,0,1,1,0,1,0,1,1,0,1,0,1,0,1],
  };

  const deliveryWaterfall = [
    { label: 'Sent',       pct: 100, offset: 0,  color: '#4E5969' },
    { label: 'Validated',  pct: 97,  offset: 0,  color: '#3DD68C' },
    { label: 'Dispatched', pct: 94,  offset: 0,  color: '#4B9EF8' },
    { label: 'Delivered',  pct: 89,  offset: 0,  color: '#3DD68C' },
    { label: 'Suppressed', pct: -3,  offset: 89, color: '#F5A623' },
    { label: 'Failed',     pct: -8,  offset: 89, color: '#FF5C5C' },
  ];

  /* ── Helpers ─────────────────────────────────────────────────────── */
  function fmt(n) {
    if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
    if (n >= 1000)    return (n / 1000).toFixed(1) + 'K';
    return n.toLocaleString();
  }

  function pct(v, decimals = 1) { return v.toFixed(decimals) + '%'; }

  function segColor(seg) {
    const map = {
      'General':           '#3DD68C',
      'CARE/FERA':         '#F5A623',
      'LEP':               '#9B8FFF',
      'Medical Baseline':  '#4B9EF8',
      'Life Support':      '#FF5C5C',
      'Prepay':            '#44D4C0',
      'Senior/Vulnerable': '#FF9B6B',
    };
    return map[seg] || '#8B95A8';
  }

  function companyColor(co) {
    const map = {
      Eversource:  '#3DD68C',
      'PG&E':      '#FF5C5C',
      HECO:        '#F5A623',
      'Idaho Power':'#4B9EF8',
      'DTE Energy':'#9B8FFF',
      MLGW:        '#44D4C0',
    };
    return map[co] || '#8B95A8';
  }

  return {
    COMPANIES, DIVISIONS, CAMPAIGN_TYPES, CHANNELS, SEGMENTS, LANGUAGES,
    overviewKPIs, trend7Days, trend30Days,
    segmentDelivery, channelBySegment, companyPerf, divisionPerf,
    campaignTypePerf, campaigns, channelOverall, channelFallback,
    optimalSendTime, heatmapData, languageMatchRate, billingDelivery,
    vulnerabilityScatter, criticalCustomers, pspsOverlap, criticalSlaData,
    criticalDeliveryTrend, activeOutages, outageScatter,
    outageNotificationPhase, timeToFirstNotification, smartMeterRestore,
    pspsZoneData, journeyFunnel, retryAttempts, optOutTrend, preferenceMismatch,
    healthScore, dataQuality, healthTrend, cohortData, insights,
    campaignVelocity, deliveryWaterfall, fmt, pct, segColor, companyColor,
  };
})();
