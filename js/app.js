// ============================================================
// Luteach ESG Dashboard — app.js
// Card view · Live simulation · Period filter · Table view
// ============================================================

const PILLAR_LABEL = { social: 'Social', gobernanza: 'Gobernanza', ambiental: 'Ambiental' };
const PILLAR_COLOR = { social: '#F28705', gobernanza: '#2480C2', ambiental: '#40916C' };
const PILLAR_ICON = {
  social:     `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
  gobernanza: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`,
  ambiental:  `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 8C8 10 5.9 16.17 3.82 19H2.5S3 16 5 14c0 0-3 2-3 6h20c0-6-3-12-5-12z"/></svg>`
};
const ALIGN_KEY = (a) => {
  if (!a) return 'sin';
  if (a.toLowerCase().startsWith('directo')) return 'directo';
  if (a.toLowerCase().startsWith('adaptado')) return 'adaptado';
  return 'sin';
};
const ALIGN_LABEL = { directo: 'Directo', adaptado: 'Adaptado', sin: 'Sin estándar directo' };
const LBG_ORDER = ['Input', 'Output', 'Outcome', 'Impact'];
const MONTHS_ES = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
const FREQ_MONTHS = { 'Mensual':1, 'Bimestral':2, 'Trimestral':3, 'Semestral':6, 'Anual':12, 'Por contrato':0 };

// ── State ──────────────────────────────────────────────────
const state = {
  search: '', pillars: new Set(), category: '',
  ods: new Set(), lbg: new Set(), align: new Set(),
  periodFrom: null, periodTo: null, filterByPeriod: false,
  view: 'cards'
};

// ── Live simulation ─────────────────────────────────────────
const liveValues = {};
let liveTickCount = 0;
// Shared carbon state updated by the carbon calculator card
let carbonState = { kwhMonth: 11.7, kgco2Month: 2.9, kgco2Year: 34.7 };
let liveTimerSeconds = 0;
let liveTimerInterval = null;

function initLiveValues() {
  ESG_METRICS.forEach(m => {
    if (m.live && m.value !== null && typeof m.value === 'number') {
      liveValues[m.id] = m.value;
    }
  });
}

function tickLive() {
  liveTickCount++;
  // Every 4 ticks (≈4s), update 2–3 random live metrics
  if (liveTickCount % 4 !== 0) return;

  const liveable = ESG_METRICS.filter(m => m.live && m.value !== null && typeof m.value === 'number' && m.id !== 'G-02');
  const picks = shuffle([...liveable]).slice(0, 3);

  picks.forEach(m => {
    const base = m.value;
    const pct = (Math.random() * 0.025 + 0.005) * (Math.random() > 0.5 ? 1 : -1);
    let newVal = liveValues[m.id] + base * pct;
    // Clamp
    if (m.unit === '%') newVal = Math.min(100, Math.max(0, newVal));
    else if (m.unit === '/ 5') newVal = Math.min(5, Math.max(0, newVal));
    else newVal = Math.max(0, newVal);

    const rounded = m.format === 'dec1' ? Math.round(newVal * 10) / 10 : Math.round(newVal);
    if (rounded !== liveValues[m.id]) {
      liveValues[m.id] = rounded;
      flashCardValue(m.id, rounded, m);
      // If session data changed, refresh carbon calculator
      if ((m.id === 'S-04' || m.id === 'S-06') && window._carbonRecalc) window._carbonRecalc();
    }
  });
}

function flashCardValue(id, newVal, m) {
  const el = document.getElementById(`val-${id}`);
  if (!el) return;
  el.querySelector('.val-num').textContent = formatVal(newVal, m);
  el.classList.remove('flash');
  void el.offsetWidth; // reflow
  el.classList.add('flash');
}

function startLiveUpdates() {
  initLiveValues();
  setInterval(tickLive, 1000);
  liveTimerInterval = setInterval(() => {
    liveTimerSeconds++;
    const el = document.getElementById('liveTimer');
    if (!el) return;
    if (liveTimerSeconds < 5) el.textContent = 'ahora';
    else if (liveTimerSeconds < 60) el.textContent = `hace ${liveTimerSeconds}s`;
    else el.textContent = `hace ${Math.floor(liveTimerSeconds/60)}m`;
  }, 1000);
}

function resetLiveTimer() {
  liveTimerSeconds = 0;
  const el = document.getElementById('liveTimer');
  if (el) el.textContent = 'ahora';
}

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// ── Value formatting ────────────────────────────────────────
function formatVal(val, m) {
  if (val === null || val === undefined) return '—';
  switch (m.format) {
    case 'dec1': return val.toFixed(1);
    case 'currency': return 'S/. ' + Number(val).toLocaleString('es-PE', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
    case 'none': return '';
    default: return String(Math.round(val));
  }
}

function getDisplayVal(m) {
  const v = liveValues[m.id] !== undefined ? liveValues[m.id] : m.value;
  return formatVal(v, m);
}

// ── Period helpers ──────────────────────────────────────────
function periodSpanMonths() {
  if (!state.periodFrom || !state.periodTo) return 0;
  return Math.max(0, (state.periodTo.year * 12 + state.periodTo.month) - (state.periodFrom.year * 12 + state.periodFrom.month) + 1);
}
function periodLabel() {
  if (!state.periodFrom || !state.periodTo) return null;
  const f = state.periodFrom, t = state.periodTo;
  if (f.year === t.year && f.month === t.month) return `${MONTHS_ES[f.month]} ${f.year}`;
  return `${MONTHS_ES[f.month]} ${f.year} — ${MONTHS_ES[t.month]} ${t.year}`;
}

function buildPeriodSelectors() {
  const fromMonth = document.getElementById('fromMonth');
  const toMonth = document.getElementById('toMonth');
  const fromYear = document.getElementById('fromYear');
  const toYear = document.getElementById('toYear');
  const monthsHtml = MONTHS_ES.map((m, i) => `<option value="${i}">${m}</option>`).join('');
  fromMonth.innerHTML = toMonth.innerHTML = monthsHtml;
  const now = new Date();
  const cy = now.getFullYear();
  let yHtml = '';
  for (let y = cy - 3; y <= cy + 2; y++) yHtml += `<option value="${y}"${y === cy ? ' selected' : ''}>${y}</option>`;
  fromYear.innerHTML = toYear.innerHTML = yHtml;
  fromMonth.value = '0'; fromYear.value = cy;
  toMonth.value = now.getMonth(); toYear.value = cy;
  state.periodFrom = { month: 0, year: cy };
  state.periodTo = { month: now.getMonth(), year: cy };

  const onChange = () => {
    const fm = +fromMonth.value, fy = +fromYear.value;
    const tm = +toMonth.value, ty = +toYear.value;
    if (fy * 12 + fm > ty * 12 + tm) { toMonth.value = fm; toYear.value = fy; }
    state.periodFrom = { month: +fromMonth.value, year: +fromYear.value };
    state.periodTo = { month: +toMonth.value, year: +toYear.value };
    updatePeriodBadge();
    if (state.filterByPeriod) applyFilters();
  };
  [fromMonth, fromYear, toMonth, toYear].forEach(el => el.addEventListener('change', onChange));
  document.getElementById('periodFilterToggle').addEventListener('change', e => {
    state.filterByPeriod = e.target.checked;
    updatePeriodBadge();
    applyFilters();
  });
  updatePeriodBadge();
}

function updatePeriodBadge() {
  const badge = document.getElementById('periodBadge');
  const lbl = periodLabel();
  if (lbl && state.filterByPeriod) { badge.textContent = lbl; badge.hidden = false; }
  else badge.hidden = true;
}

// ── GRI / tag helpers ───────────────────────────────────────
function griSeriesClass(code) {
  const p = code.split('-')[0];
  if (p === '2') return 'gri-2';
  const n = parseInt(p, 10);
  if (n >= 200 && n < 300) return 'gri-200';
  if (n >= 300 && n < 400) return 'gri-300';
  if (n >= 400 && n < 500) return 'gri-400';
  return 'gri-2';
}
function odsBadgesHtml(arr) {
  if (!arr.length) return '<span class="ods-none">—</span>';
  return arr.map(o => `<span class="ods-badge" data-ods="${o}">${o}</span>`).join('');
}
function griPillsHtml(arr) {
  if (!arr.length) return '<span class="gri-none">Sin estándar</span>';
  return arr.map(g => `<span class="gri-pill ${griSeriesClass(g)}">GRI ${g}</span>`).join('');
}
function lbgTagHtml(lbg) {
  return `<span class="lbg-tag lbg-${(lbg||'').toLowerCase()}">${lbg}</span>`;
}

// ── Stats bar ───────────────────────────────────────────────
function renderStats(list) {
  const byPillar = { social: 0, gobernanza: 0, ambiental: 0 };
  const byLbg = { Input: 0, Output: 0, Outcome: 0, Impact: 0 };
  list.forEach(m => { byPillar[m.pillar]++; if (byLbg[m.lbg] !== undefined) byLbg[m.lbg]++; });

  document.getElementById('statsBar').innerHTML = `
    <div class="stat-card stat-total stat-nav" data-scroll="top" title="Ir al inicio">
      <div class="stat-icon"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg></div>
      <div class="num">${list.length}</div><div class="lbl">Total</div>
    </div>
    <div class="stat-card stat-social stat-nav" data-scroll="social" title="Ir a Social">
      <div class="stat-icon">${PILLAR_ICON.social}</div>
      <div class="num">${byPillar.social}</div><div class="lbl">Social</div>
    </div>
    <div class="stat-card stat-gobernanza stat-nav" data-scroll="gobernanza" title="Ir a Gobernanza">
      <div class="stat-icon">${PILLAR_ICON.gobernanza}</div>
      <div class="num">${byPillar.gobernanza}</div><div class="lbl">Gobernanza</div>
    </div>
    <div class="stat-card stat-ambiental stat-nav" data-scroll="ambiental" title="Ir a Ambiental">
      <div class="stat-icon">${PILLAR_ICON.ambiental}</div>
      <div class="num">${byPillar.ambiental}</div><div class="lbl">Ambiental</div>
    </div>
    <div class="stat-card stat-lbg stat-input"><div class="num">${byLbg.Input}</div><div class="lbl">Input</div></div>
    <div class="stat-card stat-lbg stat-output"><div class="num">${byLbg.Output}</div><div class="lbl">Output</div></div>
    <div class="stat-card stat-lbg stat-outcome"><div class="num">${byLbg.Outcome}</div><div class="lbl">Outcome</div></div>
    <div class="stat-card stat-lbg stat-impact"><div class="num">${byLbg.Impact}</div><div class="lbl">Impact</div></div>
  `;

  // Scroll-to-section on click (no filtering)
  document.getElementById('statsBar').querySelectorAll('[data-scroll]').forEach(card => {
    card.addEventListener('click', () => {
      const target = card.dataset.scroll;
      const scroller = document.querySelector('.app-main') || window;
      if (target === 'top') {
        scroller.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
      const section = document.querySelector(`.pillar-section[data-pillar="${target}"]`);
      if (!section) return;
      const controls = document.querySelector('.controls');
      const offset = (controls ? controls.offsetHeight : 0) + 20;
      const scrollTop = scroller instanceof Window ? window.scrollY : scroller.scrollTop;
      const top = section.getBoundingClientRect().top + scrollTop - offset;
      scroller.scrollTo({ top, behavior: 'smooth' });
    });
  });
}

// ── Card rendering ──────────────────────────────────────────
function trendHtml(m) {
  if (!m.trendLabel) return '';
  const good = m.trendGood;
  const arrow = m.trendLabel === 'meta: 0' ? '' : (m.trendUp ? '↑' : '↓');
  return `<span class="trend-badge ${good ? 'trend-good' : 'trend-bad'}">${arrow} ${m.trendLabel}</span>`;
}

function renderCard(m) {
  const isLive = m.live;
  const displayVal = getDisplayVal(m);

  return `
    <div class="metric-card pillar-${m.pillar}" data-id="${m.id}" tabindex="0" role="button" aria-label="${m.metric}">
      <div class="card-header">
        <span class="card-category-lbl">${m.category}</span>
        ${isLive ? `<span class="live-badge-sm"><span class="live-dot-sm"></span>En vivo</span>` : ''}
      </div>
      <div class="card-name">${m.metric}</div>
      <div class="card-value" id="val-${m.id}">
        <span class="val-num">${displayVal}</span>
        ${m.unit ? `<span class="val-unit">${m.unit}</span>` : ''}
      </div>
      ${trendHtml(m)}
      <div class="card-footer">
        <div class="card-footer-top">
          <span class="card-id">${m.id}</span>
          ${lbgTagHtml(m.lbg)}
        </div>
        <div class="card-footer-tags">
          ${odsBadgesHtml(m.ods)}
          ${griPillsHtml(m.gri)}
        </div>
      </div>
    </div>
  `;
}

function renderCalculatorCard(m) {
  const horasContratadas = ESG_METRICS.find(x => x.id === 'S-03')?.value || 520;
  const horasRecuperadas = horasContratadas * 2;
  return `
    <div class="metric-card metric-card--calc pillar-${m.pillar}" data-id="${m.id}" tabindex="0">
      <div class="card-header">
        <span class="card-id">${m.id}</span>
        <span class="live-badge-sm"><span class="live-dot-sm"></span>En vivo</span>
      </div>
      <div class="card-name">${m.metric}</div>

      <div class="calc-body">
        <div class="carbon-section-label">Datos del sistema (automático)</div>
        <div class="calc-formula-row">
          <div class="calc-const-wrap">
            <span class="calc-const" id="calcHContratadas">${horasContratadas.toLocaleString('es-PE')}</span>
            <label class="calc-field-lbl">h contratadas (S-03)</label>
          </div>
          <span class="calc-op">×</span>
          <div class="calc-const-wrap">
            <span class="calc-const">2</span>
            <label class="calc-field-lbl">ratio 2:1</label>
          </div>
          <span class="calc-op">=</span>
          <div class="calc-result-wrap">
            <span class="calc-result-val" id="calcHRec">${horasRecuperadas.toLocaleString('es-PE')}</span>
            <label class="calc-field-lbl">h productividad recuperadas</label>
          </div>
        </div>

        <div class="carbon-section-label" style="margin-top:10px;">Costo por hora del colaborador (RRHH ingresa)</div>
        <div class="calc-outputs-row">
          <div class="calc-out-card">
            <span class="calc-out-icon">⏱️</span>
            <span class="calc-out-val" id="calcHRecDisplay">${horasRecuperadas.toLocaleString('es-PE')}</span>
            <span class="calc-out-lbl">horas recuperadas / contrato</span>
          </div>
          <div class="calc-divider-v"></div>
          <div class="calc-out-card">
            <span class="calc-out-icon">💰</span>
            <div class="calc-cost-row">
              <span class="calc-cost-prefix">S/.</span>
              <input type="number" id="calcCosto" class="calc-input calc-input--cost" value="35" min="1" max="9999" aria-label="Costo promedio por hora del colaborador">
              <span class="calc-cost-lbl">/hora colabodor</span>
            </div>
            <span class="calc-out-val" id="calcValor">S/. 36,400</span>
            <span class="calc-out-lbl">valor económico recuperado</span>
          </div>
        </div>
        <p class="calc-note">Modelo 2:1: por cada hora de tutoría contratada, el colaborador-padre recupera 2 horas (tarda el doble en explicar el mismo tema). Costo/h lo define RRHH del cliente.</p>
      </div>

      <div class="card-tags" style="margin-top:12px;">
        ${lbgTagHtml(m.lbg)}
        ${odsBadgesHtml(m.ods)}
        ${griPillsHtml(m.gri)}
      </div>
    </div>
  `;
}

function renderCarbonCard(m) {
  return `
    <div class="metric-card metric-card--calc metric-card--carbon pillar-${m.pillar}" data-id="${m.id}" tabindex="0">
      <div class="card-header">
        <span class="card-id">${m.id}</span>
        <span class="carbon-badge">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M17 8C8 10 5.9 16.17 3.82 19H2.5S3 16 5 14c0 0-3 2-3 6h20c0-6-3-12-5-12z"/></svg>
          Ambiental
        </span>
      </div>
      <div class="card-name">${m.metric}</div>

      <div class="carbon-body">

        <!-- ROW 1: datos del sistema (sincronizados) -->
        <div class="carbon-section-label">
          Datos del sistema
          <span class="carbon-system-tag">● Sincronizado</span>
        </div>
        <div class="carbon-system-row">
          <div class="carbon-system-item">
            <span class="carbon-system-val" id="cHoras1a1">195.0</span>
            <span class="carbon-system-lbl">h sesiones individuales</span>
            <span class="carbon-system-sub">× 2 dispositivos (tutor + 1 est.)</span>
          </div>
          <span class="carbon-sep"></span>
          <div class="carbon-system-item">
            <span class="carbon-system-val" id="cHorasGrup">65.0</span>
            <span class="carbon-system-lbl">h sesiones grupales</span>
            <span class="carbon-system-sub" id="cSubGrup">× 4 dispositivos (tutor + 3 est.)</span>
          </div>
          <span class="carbon-sep"></span>
          <div class="carbon-system-item">
            <span class="carbon-system-val" id="cEstGrup">3</span>
            <span class="carbon-system-lbl">est. promedio/grupo</span>
            <span class="carbon-system-sub">sesiones grupales</span>
          </div>
        </div>

        <!-- ROW 2: horas-dispositivo (la unidad clave) -->
        <div class="carbon-dhours-row">
          <div class="carbon-dhours-item">
            <span class="carbon-dhours-val" id="cDh1a1">390</span>
            <span class="carbon-dhours-lbl">h-disp. individuales</span>
          </div>
          <span class="calc-op">+</span>
          <div class="carbon-dhours-item">
            <span class="carbon-dhours-val" id="cDhGrup">260</span>
            <span class="carbon-dhours-lbl">h-disp. grupales</span>
          </div>
          <span class="calc-op">=</span>
          <div class="carbon-dhours-item carbon-dhours-total">
            <span class="carbon-dhours-val" id="cDhTotal">650</span>
            <span class="carbon-dhours-lbl">horas-dispositivo totales</span>
          </div>
        </div>

        <!-- ROW 3: parámetros de consumo (ajustables) -->
        <div class="carbon-section-label" style="margin-top:8px;">Parámetros de consumo (ajustables)</div>
        <div class="carbon-inputs-row">
          <div class="calc-field-wrap">
            <input type="number" id="cKwhLaptop" class="calc-input" value="0.045" min="0" step="0.001" aria-label="kWh por hora por dispositivo">
            <label class="calc-field-lbl">kWh/h · dispositivo</label>
          </div>
          <span class="calc-op">+</span>
          <div class="calc-field-wrap">
            <input type="number" id="cKwhPlat" class="calc-input" value="0.05" min="0" step="0.005" aria-label="kWh por hora de plataforma">
            <label class="calc-field-lbl">kWh/h · servidor</label>
          </div>
          <span class="carbon-sep"></span>
          <div class="calc-field-wrap">
            <input type="number" id="cTransporte" class="calc-input carbon-transport" value="0.50" min="0" step="0.01" aria-label="Factor CO₂ transporte presencial">
            <label class="calc-field-lbl">kgCO₂e · sesión pres.</label>
          </div>
        </div>

        <!-- ROW 4: factor de emisión -->
        <div class="carbon-factor-box">
          <div class="carbon-factor-label">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            Factor de emisión eléctrico (kgCO₂e / kWh) — <strong>ajustar según tu red</strong>
          </div>
          <div class="carbon-factor-row">
            <input type="number" id="cFactor" class="calc-input carbon-factor-input" value="0.248" min="0" step="0.001" aria-label="Factor de emisión">
            <div class="carbon-factor-refs">
              <span class="factor-ref" data-val="0.248">🇵🇪 Perú 0.248</span>
              <span class="factor-ref" data-val="0.181">🇪🇸 España 0.181</span>
              <span class="factor-ref" data-val="0.126">🇨🇴 Colombia 0.126</span>
              <span class="factor-ref" data-val="0.233">🇲🇽 México 0.233</span>
            </div>
          </div>
        </div>

        <!-- RESULTADOS -->
        <div class="carbon-results-row">
          <div class="calc-out-card carbon-out">
            <span class="calc-out-icon">⚡</span>
            <span class="calc-out-val" id="cKwh">34.0</span>
            <span class="calc-out-lbl">kWh / mes</span>
          </div>
          <div class="calc-divider-v"></div>
          <div class="calc-out-card carbon-out">
            <span class="calc-out-icon">🔌</span>
            <span class="calc-out-val" id="cKgco2Elec">8.4</span>
            <span class="calc-out-lbl">kgCO₂e electricidad</span>
          </div>
          <div class="calc-divider-v"></div>
          <div class="calc-out-card carbon-out">
            <span class="calc-out-icon">🚗</span>
            <span class="calc-out-val" id="cKgco2Trans">26.0</span>
            <span class="calc-out-lbl">kgCO₂e transporte</span>
          </div>
          <div class="calc-divider-v"></div>
          <div class="calc-out-card carbon-out carbon-out--main">
            <span class="calc-out-icon">🌍</span>
            <span class="calc-out-val" id="cKgco2">34.4</span>
            <span class="calc-out-lbl">kgCO₂e total / mes</span>
          </div>
          <div class="calc-divider-v"></div>
          <div class="calc-out-card carbon-out">
            <span class="calc-out-icon">📅</span>
            <span class="calc-out-val" id="cKgco2Año">413.0</span>
            <span class="calc-out-lbl">kgCO₂e / año</span>
          </div>
        </div>

        <p class="calc-note">Unidad: horas-dispositivo = Σ(h sesión × dispositivos activos). 1h individual = 2 h-disp · 1h grupal (3 est.) = 4 h-disp. Datos de sesiones del sistema. GRI 305-1 y 302-1.</p>
      </div>

      <div class="card-tags" style="margin-top:12px;">
        ${lbgTagHtml(m.lbg)}
        ${odsBadgesHtml(m.ods)}
        ${griPillsHtml(m.gri)}
      </div>
    </div>
  `;
}

function initCarbonCard() {
  const getEl = id => document.getElementById(id);
  const cKwhL  = getEl('cKwhLaptop');
  const cKwhP  = getEl('cKwhPlat');
  const cTrans = getEl('cTransporte');
  const cFac   = getEl('cFactor');
  if (!cKwhL) return;

  // System data: session hours split 75% individual / 25% group from S-04
  // In production this comes from the session management dashboard
  const getSystemData = () => {
    const totalH = liveValues['S-04'] !== undefined ? liveValues['S-04'] : (ESG_METRICS.find(x => x.id === 'S-04')?.value || 260);
    const totalSes = liveValues['S-06'] !== undefined ? liveValues['S-06'] : (ESG_METRICS.find(x => x.id === 'S-06')?.value || 260);
    const h1a1   = Math.round(totalH * 0.75 * 10) / 10;     // 75% individual
    const hGrup  = Math.round(totalH * 0.25 * 10) / 10;     // 25% group
    const estGrup = 3;                                         // avg 3 students/group session
    const sesPresencial = Math.round(totalSes * 0.20);        // 20% presential (from S-06)
    return { h1a1, hGrup, estGrup, totalH, sesPresencial };
  };

  const recalc = () => {
    const { h1a1, hGrup, estGrup, totalH, sesPresencial } = getSystemData();
    const kwhL   = +cKwhL.value  || 0;
    const kwhP   = +cKwhP.value  || 0;
    const trans  = +cTrans.value || 0;
    const factor = +cFac.value   || 0;

    // Update system data display
    getEl('cHoras1a1').textContent = h1a1.toFixed(1);
    getEl('cHorasGrup').textContent = hGrup.toFixed(1);
    getEl('cEstGrup').textContent = estGrup;
    getEl('cSubGrup').textContent = `× ${estGrup + 1} dispositivos (tutor + ${estGrup} est.)`;

    // Device-hours: h1a1 × 2 devices + hGrup × (estGrup + 1 tutor)
    const dh1a1  = h1a1 * 2;
    const dhGrup = hGrup * (estGrup + 1);
    const dhTotal = dh1a1 + dhGrup;

    getEl('cDh1a1').textContent  = Math.round(dh1a1);
    getEl('cDhGrup').textContent = Math.round(dhGrup);
    getEl('cDhTotal').textContent = Math.round(dhTotal);

    // Energy: device-hours × kWh/device + total hours × kWh/platform
    const kwhDevices  = dhTotal * kwhL;
    const kwhPlatform = totalH  * kwhP;
    const kwhMonth    = kwhDevices + kwhPlatform;

    // Emissions
    const co2Elec  = kwhMonth * factor;
    const co2Trans = sesPresencial * trans;
    const co2Total = co2Elec + co2Trans;
    const co2Año   = co2Total * 12;

    getEl('cKwh').textContent        = kwhMonth.toFixed(1);
    getEl('cKgco2Elec').textContent  = co2Elec.toFixed(2);
    getEl('cKgco2Trans').textContent = co2Trans.toFixed(2);
    getEl('cKgco2').textContent      = co2Total.toFixed(2);
    getEl('cKgco2Año').textContent   = co2Año.toFixed(1);

    carbonState = { kwhMonth, kgco2Month: co2Total, kgco2Year: co2Año, dhTotal };
    renderCrossMetrics();
    resetLiveTimer();
  };

  [cKwhL, cKwhP, cTrans, cFac].forEach(el => {
    el.addEventListener('input', recalc);
    el.addEventListener('click', e => e.stopPropagation());
  });

  // Factor reference chips
  document.querySelectorAll('.factor-ref').forEach(chip => {
    chip.addEventListener('click', e => {
      e.stopPropagation();
      cFac.value = chip.dataset.val;
      document.querySelectorAll('.factor-ref').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      recalc();
    });
  });

  const peruChip = document.querySelector('.factor-ref[data-val="0.248"]');
  if (peruChip) peruChip.classList.add('active');

  recalc();

  // Re-run when live values update (S-04 and S-06 drive the system data)
  window._carbonRecalc = recalc;
}

// ── Cross-metrics / KPIs ────────────────────────────────────
function getMetricVal(id) {
  const m = ESG_METRICS.find(x => x.id === id);
  if (!m) return 0;
  const v = liveValues[id] !== undefined ? liveValues[id] : m.value;
  return v || 0;
}

function computeCrossKPIs() {
  const v = getMetricVal;
  const students  = Math.max(1, v('S-01'));
  const hUsadas   = Math.max(1, v('S-04'));
  const sesiones  = Math.max(1, v('S-06'));
  const luteach   = Math.max(1, v('S-25'));
  const hTeach    = v('S-26');
  const invSoc    = v('S-33');
  const valProd   = v('S-35');
  const hLibSem   = v('S-19') || 8;
  const co2Month  = carbonState.kgco2Month;
  const co2Year   = carbonState.kgco2Year;

  return [
    {
      group: 'Eficiencia Operativa',
      icon: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`,
      color: 'blue',
      kpis: [
        { label:'Horas por estudiante',       value:(hUsadas/students).toFixed(1),         unit:'h / estudiante activo',          sub:`de ${hUsadas} h dictadas`,     formula:'S-04 ÷ S-01' },
        { label:'Sesiones por Luteacher',     value:(sesiones/luteach).toFixed(1),          unit:'sesiones / tutor activo',        sub:`${sesiones} ses · ${luteach} Luteachers`, formula:'S-06 ÷ S-25' },
        { label:'Estudiantes por tutor',      value:(students/luteach).toFixed(1),          unit:'est. por Luteacher',             sub:`ratio de cobertura`,           formula:'S-01 ÷ S-25' },
        { label:'Tasa de utilización',        value:v('S-05'),                              unit:'% horas usadas',                 sub:`de horas contratadas`,         formula:'S-05' },
      ]
    },
    {
      group: 'Impacto Social & Productividad',
      icon: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>`,
      color: 'orange',
      kpis: [
        { label:'Inversión por estudiante',   value:'S/. '+(invSoc/students).toFixed(0),   unit:'por estudiante activo',          sub:`de S/. ${invSoc.toLocaleString('es-PE')} total`, formula:'S-33 ÷ S-01' },
        { label:'Valor recuperado / h',       value:'S/. '+(valProd/hUsadas).toFixed(1),   unit:'por hora de tutoría dictada',    sub:`productividad parental`,       formula:'S-35 ÷ S-04' },
        { label:'% con mejora académica',     value:v('S-09'),                              unit:'% de estudiantes',               sub:`mejora de notas vs. línea base`, formula:'S-09' },
        { label:'Horas liberadas / colabador',value:(hLibSem*48).toFixed(0),               unit:'h / colaborador / año',          sub:`ratio tutoría 2:1`,            formula:'S-19 × 48' },
      ]
    },
    {
      group: 'Diversidad & Desarrollo de Talento',
      icon: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
      color: 'purple',
      kpis: [
        { label:'Cobertura femenina',         value:v('S-21').toFixed(1),                  unit:'% estudiantes mujeres',          sub:`paridad de género`,            formula:'S-21' },
        { label:'Tutoras activas',            value:v('S-23').toFixed(1),                  unit:'% Luteachers mujeres',           sub:`diversidad en docencia`,       formula:'S-23' },
        { label:'Inserción laboral',          value:v('S-28'),                              unit:'% con empleo post-programa',     sub:`Luteachers egresados`,         formula:'S-28' },
        { label:'Experiencia por Luteacher',  value:(hTeach/luteach).toFixed(1),           unit:'h experiencia docente / tutor',  sub:`acumuladas en el período`,     formula:'S-26 ÷ S-25' },
      ]
    },
    {
      group: 'Huella Ambiental por Unidad',
      icon: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M17 8C8 10 5.9 16.17 3.82 19H2.5S3 16 5 14c0 0-3 2-3 6h20c0-6-3-12-5-12z"/></svg>`,
      color: 'green',
      kpis: [
        { label:'CO₂e por estudiante',        value:(co2Month/students).toFixed(3),         unit:'kgCO₂e / mes / estudiante',     sub:`basado en E-01`,               formula:'E-01 ÷ S-01' },
        { label:'CO₂e por sesión',            value:(co2Month/sesiones).toFixed(4),          unit:'kgCO₂e / sesión dictada',       sub:`huella por clase`,             formula:'E-01 ÷ S-06' },
        { label:'CO₂e por hora dictada',      value:(co2Month/hUsadas).toFixed(4),           unit:'kgCO₂e / hora de tutoría',      sub:`intensidad de carbono`,        formula:'E-01 ÷ S-04' },
        { label:'Huella total anual',         value:(co2Year/1000).toFixed(3),              unit:'tCO₂e / año (estimado)',        sub:`factor configurable en E-01`,  formula:'E-01 × 12' },
      ]
    },
  ];
}

const KPI_COLORS = {
  blue:   { border:'#2480C2', sub:'#2480C2', bg:'#EBF5FF' },
  orange: { border:'#F28705', sub:'#F28705', bg:'#FFF3E0' },
  purple: { border:'#7C3AED', sub:'#7C3AED', bg:'#F5F3FF' },
  green:  { border:'#40916C', sub:'#40916C', bg:'#F0FAF4' },
};

function renderCrossMetrics() {
  const section = document.getElementById('crossMetricsSection');
  if (!section) return;

  const groups = computeCrossKPIs();

  section.innerHTML = `
    <div class="cm-header">
      <div class="cm-title-row">
        <div class="cm-title">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
          Métricas Cruzadas
          <span class="cm-badge">KPIs de Impacto</span>
        </div>
        <p class="cm-sub">Indicadores derivados del cruce entre pilares ESG · Actualizados en tiempo real</p>
      </div>
    </div>

    ${groups.map(g => {
      const c = KPI_COLORS[g.color];
      return `
        <div class="kpi-group">
          <div class="kpi-group-head" style="color:${c.border}">
            ${g.icon}
            <span>${g.group}</span>
          </div>
          <div class="kpi-grid">
            ${g.kpis.map(kpi => `
              <div class="kpi-card" style="border-left-color:${c.border}">
                <div class="kpi-label">${kpi.label}</div>
                <div class="kpi-value">${kpi.value}</div>
                <div class="kpi-unit">${kpi.unit}</div>
                <div class="kpi-sub" style="color:${c.sub}">${kpi.sub}</div>
                <div class="kpi-formula">${kpi.formula}</div>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    }).join('')}
  `;
}

function renderCards(list) {
  const container = document.getElementById('cardsContainer');
  if (!list.length) {
    container.innerHTML = `<p class="empty-state">Ninguna métrica coincide con los filtros seleccionados.</p>`;
    return;
  }

  const pillars = ['social', 'gobernanza', 'ambiental'];
  container.innerHTML = pillars.map(pillar => {
    const metrics = list.filter(m => m.pillar === pillar);
    if (!metrics.length) return '';

    // Preserve category order from data.js
    const categories = [...new Map(metrics.map(m => [m.category, true])).keys()];

    return `
      <div class="pillar-section" data-pillar="${pillar}">
        <div class="pillar-heading">
          <span class="pillar-heading-icon ${pillar}">${PILLAR_ICON[pillar]}</span>
          <span class="pillar-heading-label">${PILLAR_LABEL[pillar]}</span>
          <span class="pillar-heading-count">${metrics.length}</span>
        </div>
        ${categories.map(cat => {
          const catMetrics = metrics.filter(m => m.category === cat);
          return `
            <div class="category-section">
              <div class="category-heading">${cat}</div>
              <div class="cards-grid">
                ${catMetrics.map(m => {
                  if (m.calcType === 'carbon') return renderCarbonCard(m);
                  if (m.isCalculator) return renderCalculatorCard(m);
                  return renderCard(m);
                }).join('')}
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;
  }).join('');

  // Card click → detail panel
  container.querySelectorAll('.metric-card').forEach(card => {
    card.addEventListener('click', () => openDetail(card.dataset.id));
    card.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') openDetail(card.dataset.id); });
  });

  // Carbon calculator interactivity
  initCarbonCard();

  // Cross-metrics KPIs (after carbon init so carbonState is populated)
  renderCrossMetrics();

  // Productivity calculator interactivity (modelo 2:1, basado en S-03)
  const calcCosto = document.getElementById('calcCosto');
  if (calcCosto) {
    const horasContratadas = ESG_METRICS.find(x => x.id === 'S-03')?.value || 520;
    const horasRecuperadas = horasContratadas * 2;
    const recalcProd = () => {
      const c = +calcCosto.value || 0;
      const valor = horasRecuperadas * c;
      const el = document.getElementById('calcValor');
      if (el) el.textContent = 'S/. ' + valor.toLocaleString('es-PE', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
      resetLiveTimer();
    };
    calcCosto.addEventListener('input', recalcProd);
    calcCosto.addEventListener('click', e => e.stopPropagation());
    recalcProd();
  }
}

// ── Table rendering ─────────────────────────────────────────
function renderTable(list) {
  const tbody = document.getElementById('tableBody');
  const empty = document.getElementById('emptyState');
  if (!list.length) { tbody.innerHTML = ''; empty.hidden = false; return; }
  empty.hidden = true;
  tbody.innerHTML = list.map(m => {
    const dv = getDisplayVal(m);
    const dispVal = dv ? `<span class="tbl-val">${dv} <small>${m.unit||''}</small></span>` : '—';
    return `
      <tr class="pillar-${m.pillar}" data-id="${m.id}">
        <td class="col-id">${m.id}</td>
        <td class="col-pillar"><span class="pillar-dot ${m.pillar}" title="${PILLAR_LABEL[m.pillar]}"></span></td>
        <td class="col-category">${m.category}</td>
        <td class="col-metric">${m.metric}${m.live ? ' <span class="tbl-live">● vivo</span>' : ''}</td>
        <td class="col-val">${dispVal}</td>
        <td class="col-ods">${odsBadgesHtml(m.ods)}</td>
        <td class="col-gri">${griPillsHtml(m.gri)}</td>
        <td class="col-lbg">${lbgTagHtml(m.lbg)}</td>
        <td class="col-freq"><span class="freq-tag">${m.frequency}</span></td>
      </tr>
    `;
  }).join('');
  tbody.querySelectorAll('tr').forEach(tr => tr.addEventListener('click', () => openDetail(tr.dataset.id)));
}

// ── Filters ──────────────────────────────────────────────────
function buildPillarChips() {
  const wrap = document.getElementById('pillarChips');
  wrap.innerHTML = Object.keys(PILLAR_LABEL).map(p =>
    `<span class="chip" data-pillar="${p}">${PILLAR_LABEL[p]}</span>`
  ).join('');
  wrap.querySelectorAll('.chip').forEach(chip => {
    chip.addEventListener('click', () => {
      const p = chip.dataset.pillar;
      state.pillars.has(p) ? (state.pillars.delete(p), chip.classList.remove('active')) : (state.pillars.add(p), chip.classList.add('active'));
      updateCategoryOptions(); applyFilters();
    });
  });
}
function buildOdsChips() {
  const odsSet = new Set(); ESG_METRICS.forEach(m => m.ods.forEach(o => odsSet.add(o)));
  const wrap = document.getElementById('odsChips');
  wrap.innerHTML = [...odsSet].sort((a,b)=>a-b).map(o => `<span class="chip" data-ods="${o}" title="ODS ${o}">${o}</span>`).join('');
  wrap.querySelectorAll('.chip').forEach(chip => {
    chip.addEventListener('click', () => {
      const o = +chip.dataset.ods;
      state.ods.has(o) ? (state.ods.delete(o), chip.classList.remove('active')) : (state.ods.add(o), chip.classList.add('active'));
      applyFilters();
    });
  });
}
function buildLbgChips() {
  const wrap = document.getElementById('lbgChips');
  wrap.innerHTML = LBG_ORDER.map(l => `<span class="chip" data-lbg="${l}">${l}</span>`).join('');
  wrap.querySelectorAll('.chip').forEach(chip => {
    chip.addEventListener('click', () => {
      const l = chip.dataset.lbg;
      state.lbg.has(l) ? (state.lbg.delete(l), chip.classList.remove('active')) : (state.lbg.add(l), chip.classList.add('active'));
      applyFilters();
    });
  });
}
function buildAlignChips() {
  const wrap = document.getElementById('alignChips');
  [['directo','Directo'],['adaptado','Adaptado'],['sin','Sin estándar']].forEach(([k,lbl]) => {
    wrap.innerHTML += `<span class="chip" data-align="${k}">${lbl}</span>`;
  });
  wrap.querySelectorAll('.chip').forEach(chip => {
    chip.addEventListener('click', () => {
      const a = chip.dataset.align;
      state.align.has(a) ? (state.align.delete(a), chip.classList.remove('active')) : (state.align.add(a), chip.classList.add('active'));
      applyFilters();
    });
  });
}
function updateCategoryOptions() {
  const sel = document.getElementById('categoryFilter');
  const relevant = ESG_METRICS.filter(m => state.pillars.size === 0 || state.pillars.has(m.pillar));
  const cats = [...new Set(relevant.map(m => m.category))].sort();
  const cur = state.category;
  sel.innerHTML = '<option value="">Todas</option>' + cats.map(c => `<option value="${c}">${c}</option>`).join('');
  cats.includes(cur) ? sel.value = cur : (state.category = '', sel.value = '');
}

function applyFilters() {
  const q = state.search.trim().toLowerCase();
  const span = periodSpanMonths();
  const filtered = ESG_METRICS.filter(m => {
    if (state.pillars.size && !state.pillars.has(m.pillar)) return false;
    if (state.category && m.category !== state.category) return false;
    if (state.ods.size && !m.ods.some(o => state.ods.has(o))) return false;
    if (state.lbg.size && !state.lbg.has(m.lbg)) return false;
    if (state.align.size && !state.align.has(ALIGN_KEY(m.alignment))) return false;
    if (state.filterByPeriod && span > 0) {
      const needed = FREQ_MONTHS[m.frequency];
      if (needed !== undefined && needed > 0 && needed > span) return false;
    }
    if (q) {
      const hay = [m.id, m.metric, m.definition, m.category, m.gri.join(' '), m.ods.join(' '), m.stakeholder].join(' ').toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });

  renderStats(filtered);
  if (state.view === 'cards') renderCards(filtered);
  else renderTable(filtered);

  const periodSuffix = state.filterByPeriod && periodLabel() ? ` · ${periodLabel()}` : '';
  document.getElementById('resultCount').textContent =
    `${filtered.length} de ${ESG_METRICS.length} métricas${periodSuffix}`;
}

// ── Detail panel ─────────────────────────────────────────────
function openDetail(id) {
  const m = ESG_METRICS.find(x => x.id === id);
  if (!m) return;
  const alignKey = ALIGN_KEY(m.alignment);
  const dv = getDisplayVal(m);
  document.getElementById('detailContent').innerHTML = `
    <div class="detail-id">${m.id}${m.live ? ' <span class="live-badge-sm" style="vertical-align:middle"><span class="live-dot-sm"></span>En vivo</span>' : ''}</div>
    <div class="detail-title">${m.metric}</div>
    <span class="detail-pillar-badge" style="background:${PILLAR_COLOR[m.pillar]}">${PILLAR_LABEL[m.pillar]} · ${m.category}</span>

    ${dv ? `<div class="detail-value-block"><span class="detail-big-val">${dv}</span><span class="detail-big-unit">${m.unit||''}</span></div>` : ''}

    <div class="detail-section">
      <h4>Definición / Cómo se calcula</h4>
      <div class="detail-def">${m.definition}</div>
    </div>
    <div class="detail-grid">
      <div class="detail-section"><h4>Stakeholder</h4><p>${m.stakeholder}</p></div>
      <div class="detail-section"><h4>Frecuencia</h4><p>${m.frequency}</p></div>
    </div>
    <div class="detail-section">
      <h4>ODS relacionados</h4>
      <div class="detail-badges">${odsBadgesHtml(m.ods)}</div>
    </div>
    <div class="detail-section">
      <h4>Alineación GRI</h4>
      <div class="detail-badges">${griPillsHtml(m.gri)}</div>
      <p style="margin-top:6px;"><span class="align-dot ${alignKey}"></span>${ALIGN_LABEL[alignKey]}</p>
    </div>
    <div class="detail-section">
      <h4>Tipo LBG</h4>
      <div class="detail-badges">${lbgTagHtml(m.lbg)}</div>
    </div>
    <div class="detail-section">
      <h4>Fuente de dato</h4>
      <p>${m.source}</p>
    </div>
  `;
  document.getElementById('detailPanel').hidden = false;
  document.getElementById('overlay').hidden = false;
}
function closeDetail() {
  document.getElementById('detailPanel').hidden = true;
  document.getElementById('overlay').hidden = true;
}

// ── Export CSV ───────────────────────────────────────────────
function exportCsv() {
  const q = state.search.trim().toLowerCase();
  const span = periodSpanMonths();
  const rows = ESG_METRICS.filter(m => {
    if (state.pillars.size && !state.pillars.has(m.pillar)) return false;
    if (state.category && m.category !== state.category) return false;
    if (state.ods.size && !m.ods.some(o => state.ods.has(o))) return false;
    if (state.lbg.size && !state.lbg.has(m.lbg)) return false;
    if (state.align.size && !state.align.has(ALIGN_KEY(m.alignment))) return false;
    if (state.filterByPeriod && span > 0) { const n = FREQ_MONTHS[m.frequency]; if (n > 0 && n > span) return false; }
    if (q) { const hay = [m.id, m.metric, m.definition, m.category].join(' ').toLowerCase(); if (!hay.includes(q)) return false; }
    return true;
  });
  const period = periodLabel() ? `_${periodLabel().replace(/\s/g,'').replace(/[^a-zA-Z0-9_\-]/g,'')}` : '';
  const esc = v => `"${String(v).replace(/"/g,'""')}"`;
  const headers = ['ID','Pilar','Categoría','Métrica','Valor','Unidad','ODS','GRI','Alineación','LBG','Fuente','Frecuencia'];
  const lines = [headers.join(','), ...rows.map(m => [
    m.id, PILLAR_LABEL[m.pillar], m.category, m.metric,
    getDisplayVal(m), m.unit||'',
    m.ods.map(o=>'ODS '+o).join(' | '),
    m.gri.map(g=>'GRI '+g).join(' | '),
    m.alignment, m.lbg, m.source, m.frequency
  ].map(esc).join(','))];
  const blob = new Blob(['﻿' + lines.join('\n')], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = Object.assign(document.createElement('a'), { href: url, download: `luteach-esg${period}-${new Date().toISOString().slice(0,10)}.csv` });
  a.click(); URL.revokeObjectURL(url);
}

// ── Charts ───────────────────────────────────────────────────
let _charts = {};

function destroyCharts() {
  Object.values(_charts).forEach(c => { try { c.destroy(); } catch(e) {} });
  _charts = {};
}

function renderCharts() {
  destroyCharts();

  const val = id => {
    const m = ESG_METRICS.find(x => x.id === id);
    if (!m) return 0;
    const live = liveValues[id];
    return (live !== undefined && live !== null) ? live : (typeof m.value === 'number' ? m.value : 0);
  };

  const base = {
    responsive: true, maintainAspectRatio: false,
    plugins: { legend: { position: 'bottom', labels: { padding: 14, font: { size: 11 }, color: '#64748B', boxWidth: 12, boxHeight: 12 } } }
  };

  // 1 — Horas de tutoría (full-width stacked horizontal bar)
  const ctxH = document.getElementById('chartHoras');
  if (ctxH) {
    const hCont = val('S-03') || 520;
    const hDict = val('S-04') || 260;
    const hAsig = Math.round(hCont * 0.42);
    const hLibre = Math.max(0, hCont - hDict - hAsig);
    _charts.horas = new Chart(ctxH, {
      type: 'bar',
      data: {
        labels: [''],
        datasets: [
          { label: `Dictadas · ${hDict}h`, data: [hDict], backgroundColor: '#F28705', borderRadius: 0 },
          { label: `Asignadas sin dictar · ${hAsig}h`, data: [hAsig], backgroundColor: '#FAD390', borderRadius: 0 },
          { label: `Disponibles · ${hLibre}h`, data: [hLibre], backgroundColor: '#EDF0F5', borderRadius: 0 },
        ]
      },
      options: {
        ...base,
        indexAxis: 'y',
        plugins: { ...base.plugins,
          tooltip: { callbacks: { label: c => `  ${c.dataset.label}: ${Math.round(c.raw/hCont*100)}% de ${hCont}h` } }
        },
        scales: {
          x: { stacked: true, max: hCont, border: { display: false }, grid: { color: '#F8FAFC' },
               ticks: { font: { size: 11 }, color: '#94A3B8', callback: v => v + 'h' } },
          y: { stacked: true, display: false }
        }
      }
    });
  }

  // 2 — Resultados académicos (vertical bar)
  const ctxA = document.getElementById('chartAcademico');
  if (ctxA) {
    _charts.acad = new Chart(ctxA, {
      type: 'bar',
      data: {
        labels: ['Mejora de notas', 'Aprobación cursos', 'Asistencia', 'Confianza'],
        datasets: [{
          data: [val('S-09') || 73, val('S-13') || 81, val('S-12') || 97, val('S-18') || 78],
          backgroundColor: ['#F28705', '#FAD390', '#40916C', '#2480C2'],
          borderRadius: 6, borderSkipped: false,
        }]
      },
      options: {
        ...base,
        plugins: { ...base.plugins, legend: { display: false },
          tooltip: { callbacks: { label: c => `  ${c.raw}%` } }
        },
        scales: {
          x: { grid: { display: false }, ticks: { font: { size: 10 }, color: '#64748B' } },
          y: { max: 100, border: { display: false }, grid: { color: '#F1F5F9' },
               ticks: { font: { size: 10 }, color: '#94A3B8', callback: v => v + '%' } }
        }
      }
    });
  }

  // 3 — Satisfacción (horizontal bar)
  const ctxS = document.getElementById('chartSatisfaccion');
  if (ctxS) {
    _charts.sat = new Chart(ctxS, {
      type: 'bar',
      data: {
        labels: ['Padres (S-16)', 'Estudiantes (S-17)', 'Luteachers (S-30)'],
        datasets: [{
          data: [val('S-16') || 4.3, val('S-17') || 4.2, val('S-30') || 4.4],
          backgroundColor: ['#2480C2', '#F28705', '#40916C'],
          borderRadius: 6, borderSkipped: false,
        }]
      },
      options: {
        ...base,
        indexAxis: 'y',
        plugins: { ...base.plugins, legend: { display: false },
          tooltip: { callbacks: { label: c => `  ${c.raw.toFixed(1)} / 5.0` } }
        },
        scales: {
          x: { max: 5, border: { display: false }, grid: { color: '#F1F5F9' },
               ticks: { font: { size: 10 }, color: '#94A3B8', callback: v => v + '/5' } },
          y: { grid: { display: false }, ticks: { font: { size: 10.5 }, color: '#334155' } }
        }
      }
    });
  }

  // 4 — Alcance de estudiantes (donut)
  const ctxAl = document.getElementById('chartAlcance');
  if (ctxAl) {
    const total = val('S-00') || 52;
    const activos = val('S-01') || 40;
    const inactivos = Math.max(0, total - activos);
    _charts.alc = new Chart(ctxAl, {
      type: 'doughnut',
      data: {
        labels: [`Activos (últ. 3 meses) · ${activos}`, `Inactivos · ${inactivos}`],
        datasets: [{ data: [activos, inactivos], backgroundColor: ['#F28705', '#EDF0F5'], borderWidth: 3, borderColor: '#fff' }]
      },
      options: { ...base, cutout: '68%',
        plugins: { ...base.plugins, tooltip: { callbacks: { label: c => `  ${c.label}` } } }
      }
    });
  }

  // 5 — Diversidad de género Luteachers (donut)
  const ctxD = document.getElementById('chartDiversidad');
  if (ctxD) {
    const pctF = val('S-23') || 58.3;
    const pctM = Math.max(0, 100 - pctF);
    _charts.div = new Chart(ctxD, {
      type: 'doughnut',
      data: {
        labels: [`Mujeres · ${pctF.toFixed(1)}%`, `Hombres · ${pctM.toFixed(1)}%`],
        datasets: [{ data: [pctF, pctM], backgroundColor: ['#EC4899', '#3B82F6'], borderWidth: 3, borderColor: '#fff' }]
      },
      options: { ...base, cutout: '68%',
        plugins: { ...base.plugins, tooltip: { callbacks: { label: c => `  ${c.label}` } } }
      }
    });
  }

  // 6 — Huella de carbono (full-width stacked horizontal bar)
  const ctxC = document.getElementById('chartCarbon');
  if (ctxC) {
    const co2Total = carbonState ? carbonState.kgco2Month : 3.7;
    const co2Elec = +(co2Total * 0.75).toFixed(2);
    const co2Trans = +(co2Total * 0.25).toFixed(2);
    _charts.carbon = new Chart(ctxC, {
      type: 'bar',
      data: {
        labels: [''],
        datasets: [
          { label: `Electricidad dispositivos + plataforma · ${co2Elec} kg CO₂`, data: [co2Elec], backgroundColor: '#40916C', borderRadius: 0 },
          { label: `Transporte presencial estimado · ${co2Trans} kg CO₂`, data: [co2Trans], backgroundColor: '#95D5B2', borderRadius: 0 },
        ]
      },
      options: {
        ...base,
        indexAxis: 'y',
        plugins: { ...base.plugins,
          tooltip: { callbacks: { label: c => `  ${c.dataset.label}` } }
        },
        scales: {
          x: { stacked: true, border: { display: false }, grid: { color: '#F8FAFC' },
               ticks: { font: { size: 11 }, color: '#94A3B8', callback: v => v + ' kg' } },
          y: { stacked: true, display: false }
        }
      }
    });
  }

  // 7 — Paridad de género: estudiantes vs Luteachers (stacked 100% bar)
  const ctxG = document.getElementById('chartGenero');
  if (ctxG) {
    const pctEstF = val('S-21') || 62.5;
    const pctEstM = Math.max(0, 100 - pctEstF);
    const pctLutF = val('S-23') || 58.3;
    const pctLutM = Math.max(0, 100 - pctLutF);
    _charts.genero = new Chart(ctxG, {
      type: 'bar',
      data: {
        labels: ['Estudiantes', 'Luteachers'],
        datasets: [
          { label: 'Mujeres', data: [pctEstF, pctLutF], backgroundColor: '#EC4899', borderRadius: 0 },
          { label: 'Hombres', data: [pctEstM, pctLutM], backgroundColor: '#3B82F6', borderRadius: 0 },
        ]
      },
      options: {
        ...base,
        plugins: { ...base.plugins,
          tooltip: { callbacks: { label: c => `  ${c.dataset.label}: ${c.raw.toFixed(1)}%` } }
        },
        scales: {
          x: { stacked: true, grid: { display: false }, ticks: { font: { size: 12 }, color: '#334155' } },
          y: { stacked: true, max: 100, border: { display: false }, grid: { color: '#F1F5F9' },
               ticks: { font: { size: 10 }, color: '#94A3B8', callback: v => v + '%' } }
        }
      }
    });
  }

  // 8 — Inclusión e impacto social (horizontal bar)
  const ctxIn = document.getElementById('chartInclusion');
  if (ctxIn) {
    _charts.incl = new Chart(ctxIn, {
      type: 'bar',
      data: {
        labels: ['Cobertura objetivo (S-08)', 'Beneficiarios vulnerables (S-24)', 'Horas en beca (S-32)'],
        datasets: [{
          data: [val('S-08') || 67, val('S-24') || 34, val('S-32') || 35],
          backgroundColor: ['#40916C', '#52B788', '#95D5B2'],
          borderRadius: 6, borderSkipped: false,
        }]
      },
      options: {
        ...base,
        indexAxis: 'y',
        plugins: { ...base.plugins, legend: { display: false },
          tooltip: { callbacks: { label: c => `  ${c.raw}%` } }
        },
        scales: {
          x: { max: 100, border: { display: false }, grid: { color: '#F1F5F9' },
               ticks: { font: { size: 10 }, color: '#94A3B8', callback: v => v + '%' } },
          y: { grid: { display: false }, ticks: { font: { size: 10 }, color: '#334155' } }
        }
      }
    });
  }

  // 9 — Impacto en Luteachers (horizontal bar)
  const ctxLI = document.getElementById('chartLuteachersImpacto');
  if (ctxLI) {
    const rating = (val('S-30') || 4.4) / 5 * 100;
    _charts.lutImp = new Chart(ctxLI, {
      type: 'bar',
      data: {
        labels: ['Habilidades blandas (S-27)', 'Empleo post-programa (S-28)', `Calidad docente (S-30 · ${(val('S-30')||4.4).toFixed(1)}/5)`],
        datasets: [{
          data: [val('S-27') || 84, val('S-28') || 71, +rating.toFixed(1)],
          backgroundColor: ['#F28705', '#FAD390', '#FDE8C5'],
          borderRadius: 6, borderSkipped: false,
        }]
      },
      options: {
        ...base,
        indexAxis: 'y',
        plugins: { ...base.plugins, legend: { display: false },
          tooltip: { callbacks: { label: c => `  ${c.raw.toFixed(1)}%` } }
        },
        scales: {
          x: { max: 100, border: { display: false }, grid: { color: '#F1F5F9' },
               ticks: { font: { size: 10 }, color: '#94A3B8', callback: v => v + '%' } },
          y: { grid: { display: false }, ticks: { font: { size: 10 }, color: '#334155' } }
        }
      }
    });
  }

  // 10 — Gobernanza y cumplimiento (horizontal bar)
  const ctxGov = document.getElementById('chartGobernanza');
  if (ctxGov) {
    const incidents = val('G-02') || 0;
    _charts.gov = new Chart(ctxGov, {
      type: 'bar',
      data: {
        labels: ['Verificación de antecedentes (G-01)', 'Código de conducta firmado (G-03)', 'Incidentes de datos (G-02 · meta: 0)'],
        datasets: [{
          data: [val('G-01') || 100, val('G-03') || 98, incidents === 0 ? 100 : Math.max(0, 100 - incidents * 25)],
          backgroundColor: ['#2480C2', '#4DA3D4', incidents === 0 ? '#22C55E' : '#EF4444'],
          borderRadius: 6, borderSkipped: false,
        }]
      },
      options: {
        ...base,
        indexAxis: 'y',
        plugins: { ...base.plugins, legend: { display: false },
          tooltip: { callbacks: { label: (c, i) => c.dataIndex === 2 ? `  ${incidents === 0 ? '✓ 0 incidentes' : incidents + ' incidente/s'}` : `  ${c.raw}%` } }
        },
        scales: {
          x: { max: 100, border: { display: false }, grid: { color: '#F1F5F9' },
               ticks: { font: { size: 10 }, color: '#94A3B8', callback: v => v + '%' } },
          y: { grid: { display: false }, ticks: { font: { size: 10 }, color: '#334155' } }
        }
      }
    });
  }

  // 11 — Productividad parental: horas y valor (horizontal grouped bar)
  const ctxProd = document.getElementById('chartProductividad');
  if (ctxProd) {
    const hCont = val('S-03') || 520;
    const hDict = val('S-04') || 260;
    const hRecup = hCont * 2;
    _charts.prod = new Chart(ctxProd, {
      type: 'bar',
      data: {
        labels: [''],
        datasets: [
          { label: `Horas contratadas · ${hCont}h`, data: [hCont], backgroundColor: '#CBD5E1', borderRadius: 0 },
          { label: `Horas dictadas · ${hDict}h`, data: [hDict], backgroundColor: '#F28705', borderRadius: 0 },
          { label: `Horas productividad recuperadas (×2) · ${hRecup}h`, data: [hRecup], backgroundColor: '#40916C', borderRadius: 0 },
        ]
      },
      options: {
        ...base,
        indexAxis: 'y',
        plugins: { ...base.plugins,
          tooltip: { callbacks: { label: c => `  ${c.dataset.label}` } }
        },
        scales: {
          x: { stacked: false, border: { display: false }, grid: { color: '#F8FAFC' },
               ticks: { font: { size: 11 }, color: '#94A3B8', callback: v => v + 'h' } },
          y: { display: false }
        }
      }
    });
  }

  // 12 — Modelo LBG (horizontal bar por etapa)
  const ctxLBG = document.getElementById('chartLBG');
  if (ctxLBG) {
    const hUtil = val('S-04') || 260;
    const hCont2 = val('S-03') || 520;
    const util = Math.round(hUtil / hCont2 * 100);
    const outcome = Math.round((( val('S-09')||73 ) + ( val('S-13')||81 ) + ( val('S-12')||97 ) + ( val('S-18')||78 )) / 4);
    const impact = Math.round((( val('S-28')||71 ) + ( val('S-27')||84 ) + ( val('S-14')||23 ) * 2) / 3);
    _charts.lbg = new Chart(ctxLBG, {
      type: 'bar',
      data: {
        labels: [
          `Input — ${hCont2}h contratadas`,
          `Output — ${util}% utilización · ${hUtil}h dictadas`,
          `Outcome — ${outcome}% promedio indicadores académicos y sociales`,
          `Impact — ${impact}% promedio impacto a largo plazo`,
        ],
        datasets: [{
          data: [100, util, outcome, impact],
          backgroundColor: ['#94A3B8', '#2480C2', '#F28705', '#40916C'],
          borderRadius: 6, borderSkipped: false,
        }]
      },
      options: {
        ...base,
        indexAxis: 'y',
        plugins: { ...base.plugins, legend: { display: false },
          tooltip: { callbacks: { label: c => `  Score: ${c.raw}% — ${c.label.split('—')[0].trim()}` } }
        },
        scales: {
          x: { max: 100, border: { display: false }, grid: { color: '#F1F5F9' },
               ticks: { font: { size: 10 }, color: '#94A3B8', callback: v => v + '%' } },
          y: { grid: { display: false }, ticks: { font: { size: 10.5 }, color: '#334155' } }
        }
      }
    });
  }

  // 13 — Tendencia mensual simulada (line chart, 12 meses)
  const ctxT = document.getElementById('chartTendencia');
  if (ctxT) {
    const months = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];
    const growBackward = (cur, n, rate) => {
      const arr = new Array(n);
      let v = cur;
      for (let i = n - 1; i >= 0; i--) {
        arr[i] = Math.round(v * 10) / 10;
        v = v / (1 + rate * (0.7 + Math.random() * 0.6));
      }
      return arr;
    };
    const activos = growBackward(val('S-01') || 40, 12, 0.06);
    const horasUsadas = growBackward(val('S-04') || 260, 12, 0.07);
    const satPadres = growBackward(val('S-16') || 4.3, 12, 0.025);
    _charts.tend = new Chart(ctxT, {
      type: 'line',
      data: {
        labels: months,
        datasets: [
          { label: 'Estudiantes activos (S-01)', data: activos, borderColor: '#F28705', backgroundColor: 'rgba(242,135,5,0.08)',
            tension: 0.35, fill: true, pointRadius: 3, yAxisID: 'y' },
          { label: 'Horas utilizadas (S-04)', data: horasUsadas, borderColor: '#2480C2', backgroundColor: 'rgba(36,128,194,0.06)',
            tension: 0.35, fill: true, pointRadius: 3, yAxisID: 'y2' },
          { label: 'Satisfacción padres ×20 (S-16)', data: satPadres.map(v => +(v * 20).toFixed(1)), borderColor: '#40916C', backgroundColor: 'transparent',
            tension: 0.35, fill: false, pointRadius: 3, borderDash: [4, 3], yAxisID: 'y2' },
        ]
      },
      options: {
        ...base,
        plugins: { ...base.plugins,
          tooltip: { mode: 'index', intersect: false }
        },
        interaction: { mode: 'index', intersect: false },
        scales: {
          x: { border: { display: false }, grid: { display: false },
               ticks: { font: { size: 10.5 }, color: '#64748B' } },
          y: { position: 'left', border: { display: false }, grid: { color: '#F1F5F9' },
               ticks: { font: { size: 10 }, color: '#94A3B8', callback: v => v + ' est.' } },
          y2: { position: 'right', border: { display: false }, grid: { display: false },
                ticks: { font: { size: 10 }, color: '#94A3B8', callback: v => v + 'h' } }
        }
      }
    });
  }

  // 14 — Radar ODS (radar chart)
  const ctxR = document.getElementById('chartRadar');
  if (ctxR) {
    // ODS 4 — Educación de calidad: resultados académicos y asistencia
    const ods4 = Math.round(((val('S-09')||73) + (val('S-12')||97) + (val('S-13')||81) + (val('S-18')||78)) / 4);

    // ODS 5 — Igualdad de género: índice de paridad (100 = 50/50, decrece con desviación)
    // No se usa % mujeres directamente — eso mediría representación, no igualdad
    const paridadEst = 100 - Math.abs((val('S-21')||62.5) - 50) * 2;  // 62.5% → 75
    const paridadLut = 100 - Math.abs((val('S-23')||58.3) - 50) * 2;  // 58.3% → 83
    // Descuento del 30% por no medir resultados desagregados por género (brecha de datos)
    const ods5 = Math.round(((paridadEst + paridadLut) / 2) * 0.70);

    // ODS 8 — Trabajo decente: impacto en Luteachers + horas recuperadas
    const s19Scaled = Math.min((val('S-19')||8) / 16 * 100, 100); // 8h/sem → 50% (meta razonable: 16h)
    const ods8 = Math.round(((val('S-27')||84) + (val('S-28')||71) + s19Scaled) / 3);

    // ODS 10 — Reducción de desigualdades: cobertura, vulnerabilidad y becas
    const vulnerabilidadNorm = Math.min((val('S-24')||34) / 40 * 100, 100); // 34% → 85 (meta: 40%)
    const ods10 = Math.round(((val('S-08')||67) + vulnerabilidadNorm + (val('S-32')||35)) / 3);

    // ODS 13 — Acción climática: eficiencia de huella (base: 8 kg/mes como referencia alta)
    const ods13 = Math.round(Math.max(0, 100 - ((carbonState?.kgco2Month || 3.7) / 8 * 100)));

    // Gobernanza — Cumplimiento y protección: antecedentes, conducta e incidentes de datos
    const g02Score = Math.max(0, 100 - (val('G-02')||0) * 25);
    const gobernanza = Math.round(((val('G-01')||100) + (val('G-03')||98) + g02Score) / 3);
    _charts.radar = new Chart(ctxR, {
      type: 'radar',
      data: {
        labels: ['ODS 4\nEducación de calidad', 'ODS 5\nIgualdad de género', 'ODS 8\nTrabajo decente', 'ODS 10\nReducción desigualdades', 'ODS 13\nAcción climática', 'Gobernanza\ny ética'],
        datasets: [{
          label: 'Alineación ESG Luteach',
          data: [ods4, ods5, ods8, ods10, ods13, gobernanza],
          backgroundColor: 'rgba(242,135,5,0.12)',
          borderColor: '#F28705',
          pointBackgroundColor: '#F28705',
          pointRadius: 5,
          fill: true,
        }]
      },
      options: {
        ...base,
        plugins: { ...base.plugins,
          legend: { display: false },
          tooltip: { callbacks: { label: c => `  Score: ${c.raw}%` } }
        },
        scales: {
          r: {
            min: 0, max: 100,
            grid: { color: '#E2E8F0' },
            angleLines: { color: '#E2E8F0' },
            pointLabels: { font: { size: 10.5 }, color: '#334155' },
            ticks: { backdropColor: 'transparent', font: { size: 9 }, color: '#94A3B8', callback: v => v + '%' }
          }
        }
      }
    });
  }
}

// ── View toggle ──────────────────────────────────────────────
function initViewToggle() {
  document.getElementById('viewToggle').querySelectorAll('.vbtn').forEach(btn => {
    btn.addEventListener('click', () => {
      const v = btn.dataset.view;
      if (state.view === v) return;
      state.view = v;
      document.querySelectorAll('.vbtn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      document.getElementById('cardsView').hidden = (v !== 'cards');
      document.getElementById('tableView').hidden = (v !== 'table');
      document.getElementById('chartsView').hidden = (v !== 'charts');
      if (v === 'charts') renderCharts();
      else destroyCharts();
      if (v !== 'charts') applyFilters();
    });
  });
}

// ── Init ─────────────────────────────────────────────────────
function init() {
  buildPeriodSelectors();
  buildPillarChips();
  buildOdsChips();
  buildLbgChips();
  buildAlignChips();
  updateCategoryOptions();
  initViewToggle();
  startLiveUpdates();

  document.getElementById('searchInput').addEventListener('input', e => { state.search = e.target.value; applyFilters(); });
  document.getElementById('categoryFilter').addEventListener('change', e => { state.category = e.target.value; applyFilters(); });
  document.getElementById('btnReset').addEventListener('click', () => {
    state.search = ''; state.pillars.clear(); state.category = '';
    state.ods.clear(); state.lbg.clear(); state.align.clear();
    state.filterByPeriod = false;
    document.getElementById('searchInput').value = '';
    document.getElementById('periodFilterToggle').checked = false;
    document.querySelectorAll('.chip.active').forEach(c => c.classList.remove('active'));
    updateCategoryOptions(); updatePeriodBadge(); applyFilters();
  });
  document.getElementById('btnExport').addEventListener('click', exportCsv);
  document.getElementById('btnPrint').addEventListener('click', () => window.print());
  document.getElementById('closeDetail').addEventListener('click', closeDetail);
  document.getElementById('overlay').addEventListener('click', closeDetail);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeDetail(); });

  applyFilters();
}

document.addEventListener('DOMContentLoaded', init);
