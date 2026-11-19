/* =====================================================================
   Dashboard, explorador de tablas, diccionario, clasificación y dominios
   ===================================================================== */
const SYMBOLS = [
  ['=', 'Está compuesto de / definición', 'nombre = primer_nombre + apellido'],
  ['+', 'Concatenación de elementos', 'primer_nombre + apellido'],
  ['( )', 'Elemento opcional', '(segundo_nombre)'],
  ['{ }', 'Repetición de elementos', '{caracter_permitido}'],
  ['[ ]', 'Selección de una alternativa', '[ACTIVO | INACTIVO]'],
  ['* … *', 'Comentario o aclaración', '* Clave primaria *'],
  ['@', 'Campo clave del almacén de datos', '@id_usuario'],
  ['|', 'Separador de alternativas', '[A | I]']
];
const DIDACTIC_EXAMPLES = `Ejemplos ilustrativos del docente — NO son restricciones de db_test

nombre = tituloCortesia + primerNombre + (segundoNombre) + apellidoPaterno + apellidoMaterno
tituloCortesia = [Sr. | Sra. | Don | Doña]
primerNombre = {caracterPermitido}
caracterPermitido = [A-Z | a-z | 0-9 | espacio | apóstrofo | guion]

id_usuario = 1{digito}11   * rango SQL por verificar *
estado_cuenta = [ACTIVO | INACTIVO | SUSPENDIDO]
fecha_registro = fecha_hora   * formato ilustrativo YYYY-MM-DD HH:MM:SS *

Convención complementaria: n{elemento}m = entre n y m repeticiones.`;

function barChart(el, data, opts = {}) {
  const host = typeof el === 'string' ? $(el) : el; if (!host) return;
  const max = Math.max(1, ...data.map(d => d.value));
  const labelW = opts.labelW || 165, rowH = opts.rowH || 30, top = 8;
  const h = Math.max(120, top + data.length * rowH + 8);
  const colors = opts.colors || ['#2563eb', '#7c3aed', '#0891b2', '#f59e0b', '#db2777', '#059669'];
  let s = `<svg viewBox="0 0 640 ${h}" role="img" aria-label="${esc(opts.aria || 'Gráfica de barras')}">`;
  s += `<line x1="${labelW}" y1="${top}" x2="${labelW}" y2="${h - 10}" stroke="var(--border)"/>`;
  data.forEach((d, i) => {
    const y = top + i * rowH + 4;
    const w = Math.max(2, (d.value / max) * (640 - labelW - 78));
    s += `<text x="${labelW - 8}" y="${y + 12}" text-anchor="end" font-size="10" fill="var(--muted)" font-family="Consolas,monospace">${esc(d.label.length > 24 ? d.label.slice(0, 23) + '…' : d.label)}</text>`;
    s += `<g class="bar-hit" data-value="${esc(d.id || d.label)}" tabindex="0"><title>${esc(d.label)}: ${fmt(d.value)}</title><rect x="${labelW}" y="${y}" width="${w}" height="17" rx="4" fill="${d.color || colors[i % colors.length]}" opacity="${d.opacity || .88}"/><text x="${labelW + w + 6}" y="${y + 12}" font-size="10" font-weight="700" fill="var(--text)">${fmt(d.value)}</text></g>`;
  });
  s += '</svg>';
  host.innerHTML = s;
  if (opts.onClick) $$('.bar-hit', host).forEach(g => g.addEventListener('click', () => opts.onClick(g.dataset.value)));
}
function donutChart(el, data, opts = {}) {
  const host = typeof el === 'string' ? $(el) : el; if (!host) return;
  const total = data.reduce((a, d) => a + d.value, 0) || 1;
  const cx = 120, cy = 112, r = 78, thick = 26;
  let a0 = -Math.PI / 2, s = `<svg viewBox="0 0 250 225" role="img" aria-label="${esc(opts.aria || 'Gráfica de anillo')}">`;
  data.forEach((d, i) => {
    const a1 = a0 + (d.value / total) * Math.PI * 2;
    const large = a1 - a0 > Math.PI ? 1 : 0;
    const x0 = cx + r * Math.cos(a0), y0 = cy + r * Math.sin(a0);
    const x1 = cx + r * Math.cos(a1), y1 = cy + r * Math.sin(a1);
    if (d.value > 0) s += `<path class="bar-hit" data-value="${esc(d.id || d.label)}" d="M${x0} ${y0} A${r} ${r} 0 ${large} 1 ${x1} ${y1}" stroke="${d.color || ['#2563eb', '#7c3aed', '#0891b2', '#f59e0b'][i % 4]}" stroke-width="${thick}" fill="none" stroke-linecap="butt"><title>${esc(d.label)}: ${fmt(d.value)}</title></path>`;
    a0 = a1;
  });
  s += `<text x="${cx}" y="${cy + 2}" text-anchor="middle" class="donut-center">${fmt(total)}</text><text x="${cx}" y="${cy + 18}" text-anchor="middle" class="donut-sub">${esc(opts.center || 'total')}</text></svg>`;
  s += `<div class="legend">${data.map((d, i) => `<span><i style="background:${d.color || ['#2563eb', '#7c3aed', '#0891b2', '#f59e0b'][i % 4]}"></i>${esc(d.label)}: ${fmt(d.value)}</span>`).join('')}</div>`;
  host.innerHTML = s;
  if (opts.onClick) $$('.bar-hit', host).forEach(g => g.addEventListener('click', () => opts.onClick(g.dataset.value)));
}

function renderIntro() {
  const cards = [
    ['dashboard', 'Dashboard general', 'Diez indicadores y siete gráficas construidas con los objetos reales del respaldo.', 'chart'],
    ['diccionario', 'Diccionario de datos', `${DB.stats.columns} atributos con ficha académica, notación SQL y DFD, y composición formal.`, 'book'],
    ['eer', 'Modelo EER interactivo', `${DB.tables.length} entidades arrastrables y ${DB.relations.length} relaciones conectadas.`, 'network'],
    ['exportacion', 'Exportación', 'Impresión con portada e índice, y exportación del diagrama a SVG o PNG.', 'download']
  ];
  $('#introCards').innerHTML = cards.map(c => `<button class="tcard" data-go="${c[0]}" style="text-align:left;cursor:pointer">${ico(c[3])}<h4 style="font-family:inherit;font-size:13px;margin-top:9px">${c[1]}</h4><div class="meta">${c[2]}</div></button>`).join('');
  $$('#introCards [data-go]').forEach(b => b.addEventListener('click', () => go(b.dataset.go)));
  $('#introWarning').innerHTML = `<b>Alcance de la evidencia:</b> las estadísticas describen el contenido de <span class="mono">${esc(DB.meta.sourceFile)}</span> (servidor ${esc(DB.meta.serverVersion)}), analizado el ${new Date(DB.meta.analysisDate).toLocaleString('es-MX')}. No representan una base de datos en ejecución. Los valores personales, credenciales y hashes se excluyeron deliberadamente del HTML.`;
}

function renderDashboard() {
  const S = DB.stats;
  const kpis = [
    ['Tablas físicas', S.columns ? DB.tables.length : 0, 'tablas', 'dashboard', '#2563eb', 'CREATE TABLE detectados'],
    ['Triggers', DB.triggers.length, 'bolt', 'triggers', '#7c3aed', 'DEFERRABLE: AFTER INSERT/UPDATE/DELETE'],
    ['Vistas', DB.views.length, 'eye', 'vistas', '#0891b2', 'Definiciones finales'],
    ['Columnas', S.columns, 'table', 'diccionario', '#059669', 'Suma de atributos físicos'],
    ['Claves primarias', S.primaryKeys, 'key', 'indices', '#f59e0b', 'Incluye PK compuestas'],
    ['Claves foráneas', S.foreignKeys, 'link', 'relaciones', '#2563eb', 'CONSTRAINT FOREIGN KEY'],
    ['Índices', S.indexes, 'grid', 'indices', '#7c3aed', 'PRIMARY / UNIQUE / KEY'],
    ['Relaciones', S.relations, 'network', 'relaciones', '#db2777', `${S.confirmedRelations} confirmadas · ${S.inferredRelations} inferidas`],
    ['Registros (respaldo)', S.rows, 'db', 'registros', '#0891b2', 'Tuplas en INSERT'],
    ['Procedimientos y funciones', DB.routines.length, 'code', 'dependencias', '#059669', 'Rutinas almacenadas']
  ];
  $('#kpis').innerHTML = kpis.map((k, i) => `<button class="kpi" data-k="${i}" style="--accent:${k[4]}"><div class="kico">${ico(k[2])}</div><div class="num">${fmt(k[1])}</div><div class="lbl">${esc(k[0])}</div><div class="hint">${esc(k[5])}</div></button>`).join('');
  $$('#kpis [data-k]').forEach(b => b.addEventListener('click', () => go(kpis[+b.dataset.k][3])));

  barChart('#chartRows', DB.tables.map(t => ({ label: t.name, value: rowOf(t.name), id: t.name })).sort((a, b) => b.value - a.value).slice(0, 10),
    { aria: 'Registros por tabla', onClick: n => showContext('tabla', n) });
  const ev = ['INSERT', 'UPDATE', 'DELETE'].map((e, i) => ({ label: e, value: DB.triggers.filter(t => t.event === e).length, color: ['#2563eb', '#7c3aed', '#0891b2'][i], id: e }));
  donutChart('#chartTrigEvent', ev, { center: 'triggers', onClick: e => go('triggers', { event: e }) });
  donutChart('#chartTiming', ['BEFORE', 'AFTER'].map((t, i) => ({ label: t, value: DB.triggers.filter(x => x.timing === t).length, color: ['#f59e0b', '#059669'][i], id: t })), { center: 'triggers', onClick: t => go('triggers', { timing: t }) });
  const types = {};
  DB.tables.forEach(t => t.columns.forEach(c => types[c.baseType] = (types[c.baseType] || 0) + 1));
  barChart('#chartTypes', Object.entries(types).map(([k, v]) => ({ label: k, value: v, id: k })).sort((a, b) => b.value - a.value),
    { labelW: 110, aria: 'Tipos de datos', onClick: k => go('dominios', { q: k }) });
  const deg = {};
  DB.relations.forEach(r => { deg[r.fromTable] = (deg[r.fromTable] || 0) + 1; deg[r.toTable] = (deg[r.toTable] || 0) + 1; });
  barChart('#chartRel', Object.entries(deg).map(([k, v]) => ({ label: k, value: v, id: k })).sort((a, b) => b.value - a.value).slice(0, 10),
    { onClick: n => go('relaciones', { q: n }) });
  barChart('#chartCols', DB.tables.map(t => ({ label: t.name, value: t.columns.length, id: t.name })).sort((a, b) => b.value - a.value).slice(0, 10),
    { onClick: n => showContext('tabla', n) });
  barChart('#chartIdx', DB.tables.map(t => ({ label: t.name, value: t.indexes.length + t.checks.length + t.foreignKeys.length, id: t.name })).sort((a, b) => b.value - a.value).slice(0, 10),
    { aria: 'Índices y restricciones por tabla', onClick: n => go('indices', { q: n }) });

  const rows = [
    ['Tablas físicas', DB.validation.expected.tables, DB.validation.found.tables],
    ['Triggers', DB.validation.expected.triggers, DB.validation.found.triggers],
    ['Vistas', DB.validation.expected.views, DB.validation.found.views]
  ];
  $('#integrity').innerHTML = `<div class="grid g3">${rows.map(r => `<div class="dstat"><div class="k">${r[0]}</div><div class="v">${r[2]} <span class="badge ${r[1] === r[2] ? 'ok' : 'warn'}">${r[1] === r[2] ? ' coincide' : ' diferencia ' + (r[2] - r[1])}</span></div><div class="tiny muted">Esperado: ${r[1]}</div></div>`).join('')}</div>
  <div class="note ok" style="margin-bottom:0">Integridad documental: ${rows.every(r => r[1] === r[2]) ? 'los tres conteos esperados coinciden con los objetos extraídos del DDL.' : 'existen diferencias entre los conteos esperados y los reales; se muestran los valores encontrados.'} ${DB.relations.length} relaciones: ${DB.stats.confirmedRelations} confirmadas por FK y ${DB.stats.inferredRelations} inferidas por convención.</div>`;
}

/* ---------- explorador de tablas ---------- */
let tableMode = store.get('tableMode', 'cards');
function domainOfTable(t) { return (TABLE_INFO[t.name] || ['General'])[0]; }
function renderTables(q = '', domain = '', sort = 'name') {
  let list = DB.tables.filter(t => (!q || t.name.toLowerCase().includes(q.toLowerCase())) && (!domain || domainOfTable(t) === domain));
  list.sort((a, b) => sort === 'cols' ? b.columns.length - a.columns.length : sort === 'rows' ? rowOf(b.name) - rowOf(a.name) : sort === 'rel' ? relsByTable(b.name).length - relsByTable(a.name).length : a.name.localeCompare(b.name));
  const host = $('#tblContent');
  if (!list.length) { host.innerHTML = emptyBox('No hay tablas que coincidan con los filtros.'); return; }
  if (tableMode === 'cards') {
    const max = Math.max(1, ...list.map(t => rowOf(t.name)));
    host.innerHTML = `<div class="grid g4">${list.map(t => `<div class="tcard" data-t="${esc(t.name)}"><div class="row" style="gap:4px"><span class="badge mute">${esc(domainOfTable(t))}</span></div><h4>${esc(t.name)}</h4><div class="meta"><span>${t.columns.length} columnas</span><span>·</span><span>${fmt(rowOf(t.name))} reg.</span><span>·</span><span>${t.foreignKeys.length} FK</span></div><div class="meta" style="margin-top:5px">PK: <span class="mono">${esc(t.primaryKey.join(', ') || '—')}</span></div><div class="bar" style="width:${Math.max(5, rowOf(t.name) / max * 100)}%"></div></div>`).join('')}</div>`;
    $$('#tblContent [data-t]').forEach(c => c.addEventListener('click', e => {
      if (e.target.closest('.cmp')) return;
      selectCompare(c.dataset.t); c.classList.toggle('sel');
      showContext('tabla', c.dataset.t);
    }));
  } else {
    host.innerHTML = `<div class="card"><div class="table-scroll"><table class="tbl"><thead><tr><th>Tabla</th><th>Dominio</th><th>Columnas</th><th>Registros</th><th>PK</th><th>FK</th><th>Índices</th><th>CHECK</th><th></th></tr></thead><tbody>${list.map(t => `<tr><td class="mono"><b>${esc(t.name)}</b></td><td>${esc(domainOfTable(t))}</td><td>${t.columns.length}</td><td>${fmt(rowOf(t.name))}</td><td class="mono tiny">${esc(t.primaryKey.join(', '))}</td><td>${t.foreignKeys.length}</td><td>${t.indexes.length}</td><td>${t.checks.length}</td><td><button class="btn sm" data-open="${esc(t.name)}">Ficha</button></td></tr>`).join('')}</tbody></table></div></div>`;
    $$('#tblContent [data-open]').forEach(b => b.addEventListener('click', () => showContext('tabla', b.dataset.open)));
  }
}
function emptyBox(msg) { return `<div class="empty">${ico('search')}<div>${esc(msg)}</div></div>`; }
let compareSel = [];
function selectCompare(name) { compareSel = compareSel.includes(name) ? compareSel.filter(x => x !== name) : [...compareSel, name].slice(-2); }
function compareModal() {
  if (compareSel.length !== 2) { toast('Selecciona dos tablas para comparar'); return; }
  const [a, b] = compareSel.map(tableByName);
  const names = [...new Set([...a.columns.map(c => c.name), ...b.columns.map(c => c.name)])].sort();
  const row = n => {
    const ca = a.columns.find(c => c.name === n), cb = b.columns.find(c => c.name === n);
    return `<tr><td class="mono">${esc(n)}</td><td>${ca ? esc(ca.type) : '<span class="faint">—</span>'}</td><td>${cb ? esc(cb.type) : '<span class="faint">—</span>'}</td><td>${ca ? (a.primaryKey.includes(n) ? '<span class="badge pk">PK</span>' : '') + (a.foreignKeys.some(f => f.columns.includes(n)) ? '<span class="badge fk">FK</span>' : '') : ''}</td><td>${cb ? (b.primaryKey.includes(n) ? '<span class="badge pk">PK</span>' : '') + (b.foreignKeys.some(f => f.columns.includes(n)) ? '<span class="badge fk">FK</span>' : '') : ''}</td></tr>`;
  };
  openModal(`<div class="row"><h3 style="margin:0">Comparar estructuras</h3><button class="iconbtn close" style="margin-left:auto;background:var(--surface2);color:var(--text);border-color:var(--border)" onclick="closeModal()">${ico('close')}</button></div>
  <p class="tiny muted"><b class="mono">${esc(a.name)}</b> (${a.columns.length} columnas, ${fmt(rowOf(a.name))} registros) frente a <b class="mono">${esc(b.name)}</b> (${b.columns.length} columnas, ${fmt(rowOf(b.name))} registros).</p>
  <div class="table-scroll" style="max-height:60vh"><table class="tbl compact"><thead><tr><th>Atributo</th><th>${esc(a.name)}</th><th>${esc(b.name)}</th><th>Clave en A</th><th>Clave en B</th></tr></thead><tbody>${names.map(row).join('')}</tbody></table></div>`);
}

/* ---------- diccionario de datos ---------- */
function initDictionary() {
  $('#dictTable').innerHTML = [...DB.tables].sort((a, b) => a.name.localeCompare(b.name)).map(t => `<option value="${esc(t.name)}">${esc(t.name)}</option>`).join('');
  const apply = opt => {
    const t = tableByName($('#dictTable').value); if (!t) return;
    renderDictionary(t, $('#dictSearch').value.trim());
    if (opt && opt.col) { const el = $('#col-' + CSS.escape(opt.col)); if (el) { el.open = true; el.scrollIntoView({ block: 'center' }); } }
  };
  $('#dictTable').addEventListener('change', () => apply());
  $('#dictSearch').addEventListener('input', () => apply());
  $('#dictGoEer').addEventListener('click', () => go('eer', { focus: $('#dictTable').value }));
  $('#dictCopyStore').addEventListener('click', () => { const t = tableByName($('#dictTable').value); copyText(storeExpression(t), 'Composición copiada'); });
  window.__dictApply = apply;
}
function renderDictionary(t, q = '') {
  if (!t) return;
  const fks = t.foreignKeys.map(f => `<span class="pill">${esc(f.columns.join('+'))} → ${esc(f.refTable)} ${f.onDelete ? '[ON DELETE ' + esc(f.onDelete) + ']' : ''}</span>`).join('') || '<span class="tiny muted">Sin claves foráneas declaradas</span>';
  const idx = t.indexes.map(i => `<span class="pill">${esc(i.name || '(anónimo)')} · ${esc(i.type)} · ${esc(i.columns.join(', '))}</span>`).join('') || '<span class="tiny muted">Sin índices</span>';
  const cks = t.checks.map(c => `<span class="pill">${esc(c.name || 'CHECK')} · ${esc(c.expression)}</span>`).join('') || '<span class="tiny muted">Sin CHECK a nivel tabla</span>';
  const info = TABLE_INFO[t.name] || ['General', 'Sin descripción funcional inferida.'];
  const cols = t.columns.filter(c => !q || (c.name + ' ' + c.type + ' ' + analyze(t, c).domain).toLowerCase().includes(q.toLowerCase()));
  let h = `<div class="page-head"><div><div class="eyebrow">${esc(info[0])} · tabla física</div><h1 class="mono" style="font-size:22px">${esc(t.name)}</h1><p>${esc(info[1])}</p></div><div class="spacer"></div><button class="btn" onclick="showContext('tabla','${esc(t.name)}')">${ico('network', 'sm')} Contexto</button></div>`;
  h += `<div class="detail-grid">
    <div class="dstat"><div class="k">Columnas</div><div class="v">${t.columns.length} <span class="tiny muted">${cols.length} visibles</span></div></div>
    <div class="dstat"><div class="k">Registros verificables</div><div class="v">${fmt(rowOf(t.name))}</div></div>
    <div class="dstat"><div class="k">Clave primaria</div><div class="v mono">${esc(t.primaryKey.join(', ') || '—')}</div></div>
    <div class="dstat"><div class="k">Motor / conjunto de caracteres</div><div class="v">${esc(t.engine || '—')} · ${esc(t.charset || '—')}</div></div>
    <div class="dstat"><div class="k">Relaciones entrantes / salientes</div><div class="v">${relsByTable(t.name).filter(r => r.toTable === t.name).length} / ${relsByTable(t.name).filter(r => r.fromTable === t.name).length}</div></div>
    <div class="dstat"><div class="k">Triggers / vistas dependientes</div><div class="v">${trigByTable(t.name).length} / ${viewsByTable(t.name).length}</div></div>
  </div>`;
  h += `<div class="card pad" style="margin-bottom:14px"><div class="sect-title" style="margin-top:0">Restricciones e índices declarados</div><div class="row" style="margin-bottom:7px"><span class="tiny muted" style="width:78px">FK</span>${fks}</div><div class="row" style="margin-bottom:7px"><span class="tiny muted" style="width:78px">Índices</span>${idx}</div><div class="row"><span class="tiny muted" style="width:78px">CHECK</span>${cks}</div></div>`;
  h += `<div class="grid g2">
    <div class="card"><div class="card-head"><h3>Composición del almacén</h3><span class="sub">Notación DFD · definición real</span></div><div class="card-body"><pre class="codeblock light" id="storeCode" style="max-height:360px">${esc(storeExpression(t))}</pre><div style="margin-top:8px">${copyBtn(storeExpression(t), 'Copiar expresión')}</div></div></div>
    <div class="card"><div class="card-head"><h3>Definición de atributos y dominios</h3><span class="sub">Recursiva, por atributo</span></div><div class="card-body"><pre class="codeblock light" style="max-height:360px">${esc(attributeExpressions(t))}</pre><div style="margin-top:8px">${copyBtn(attributeExpressions(t), 'Copiar definiciones')}</div></div></div>
  </div>`;
  h += `<div class="note">Leyenda DFD: <b>=</b> compuesto de · <b>+</b> concatenación · <b>( )</b> opcional · <b>{ }</b> repetición · <b>[ ]</b> alternativa · <b>*…*</b> comentario · <b>@</b> clave del almacén · <b>|</b> separador. Ver ${'<a href="#" onclick="go(\'dominios\');return false">Dominios y notación DFD</a>'} para ejemplos didácticos separados.</div>`;
  h += `<div class="sect-title">Descripción, composición, dominio, naturaleza y clasificación · ${cols.length} atributos</div>`;
  h += `<div id="dictAcc">${cols.length ? cols.map(c => columnAccordion(t, c)).join('') : emptyBox('Ningún atributo coincide con la búsqueda.')}</div>`;
  $('#dictContent').innerHTML = h;
}
function columnAccordion(t, c) {
  const a = analyze(t, c);
  const f = (k, v) => `<div class="fact"><b>${k}</b><span>${v}</span></div>`;
  return `<details class="acc" id="col-${CSS.escape(c.name)}"><summary><span class="badge ${a.cls.inPk ? 'pk' : a.cls.fk ? 'fk' : a.cls.uniq ? 'uq' : 'mute'}">${a.cls.inPk ? 'PK' : a.cls.fk ? 'FK' : a.cls.uniq ? 'UQ' : String(c.ordinal).padStart(2, '0')}</span><b class="mono">${esc(c.name)}</b><span class="badge mute">${esc(c.type)}</span>${!c.notNull ? '<span class="badge mute">NULL</span>' : '<span class="badge mute">NOT NULL</span>'}<span class="tiny muted">${esc(a.nature)}</span></summary>
  <div class="acc-body">
    <div class="facts">
      ${f('Descripción', esc(a.description))}
      ${f('Composición', `<span class="mono">${esc(a.composition)}</span>`)}
      ${f('Dominio', esc(a.domain))}
      ${f('Naturaleza', esc(a.nature) + ' — ' + esc(a.natureNote))}
      ${f('Clasificación', esc(a.classification))}
      ${f('Notación SQL', `<span class="mono">${esc(a.sql)}</span>`)}
      ${f('Notación DFD', `<span class="mono">${esc(a.dfd)}</span>`)}
      ${f('Evidencia', esc(a.evidence))}
      ${f('Longitud / precisión / escala', `${c.length == null ? '—' : c.length} / ${c.precision == null ? '—' : c.precision} / ${c.scale == null ? '—' : c.scale}`)}
      ${f('Posición', String(c.ordinal))}
    </div>
    <div class="row" style="margin-top:10px">${copyBtn(c.name, 'Copiar nombre')}${copyBtn(c.definition, 'Copiar definición SQL')}${copyBtn(a.dfd, 'Copiar DFD')}<button class="btn sm" onclick="showContext('columna','${esc(t.name)}::${esc(c.name)}')">${ico('chevron', 'sm')} Contexto</button></div>
  </div></details>`;
}

/* ---------- clasificación de atributos ---------- */
function renderClassification(q = '', filter = '') {
  const rows = [];
  DB.tables.forEach(t => t.columns.forEach(c => rows.push({ t, c, a: analyze(t, c) })));
  const hits = rows.filter(r => {
    const text = r.t.name + ' ' + r.c.name + ' ' + r.a.classification + ' ' + r.a.nature + ' ' + r.c.type;
    if (q && !text.toLowerCase().includes(q.toLowerCase())) return false;
    if (!filter) return true;
    if (filter === 'inferida') return /inferid/i.test(r.a.nature + r.a.evidence);
    if (filter === 'identificador') return r.a.cls.inPk;
    if (filter === 'obligatorio') return r.c.notNull;
    if (filter === 'opcional') return !r.c.notNull;
    return r.a.nature.toLowerCase().includes(filter);
  });
  $('#clsContent').innerHTML = `<div class="card"><div class="card-head"><h3>${fmt(hits.length)} atributos clasificados</h3><span class="sub">Clic en una fila para abrir la ficha</span></div><div class="table-scroll"><table class="tbl compact"><thead><tr><th>Tabla</th><th>Atributo</th><th>Tipo</th><th>Naturaleza</th><th>Clasificación</th><th>Evidencia</th></tr></thead><tbody>${hits.map(r => `<tr style="cursor:pointer" onclick="showContext('columna','${esc(r.t.name)}::${esc(r.c.name)}')"><td class="mono tiny">${esc(r.t.name)}</td><td class="mono"><b>${esc(r.c.name)}</b></td><td class="mono tiny">${esc(r.c.type)}</td><td>${esc(r.a.nature)}</td><td class="tiny">${esc(r.a.classification)}</td><td class="tiny muted">${esc(r.a.evidence.split(';')[0])}</td></tr>`).join('')}</tbody></table></div></div>` || emptyBox('Sin atributos que coincidan.');
}

/* ---------- dominios y notación DFD ---------- */
function renderDomains(q = '') {
  $('#symbolLegend').innerHTML = `<thead><tr><th>Símbolo</th><th>Significado</th><th>Ejemplo didáctico</th></tr></thead><tbody>${SYMBOLS.map(s => `<tr><td>${esc(s[0])}</td><td>${esc(s[1])}</td><td class="mono tiny">${esc(s[2])}</td></tr>`).join('')}</tbody>`;
  $('#dfdExamples').innerHTML = `<pre class="codeblock light">${esc(DIDACTIC_EXAMPLES)}</pre><div class="note warn" style="margin-bottom:0">Estos ejemplos provienen de la convención didáctica del docente. No se trasladan mínimos, estados ni formatos al esquema real: las expresiones reales aparecen más abajo.</div>`;
  const types = {};
  DB.tables.forEach(t => t.columns.forEach(c => { (types[c.baseType] = types[c.baseType] || []).push(c); }));
  $('#domainCatalog').innerHTML = `<table class="tbl compact"><thead><tr><th>Tipo SQL</th><th>Columnas</th><th>Dominio formal derivado del DDL</th></tr></thead><tbody>${Object.entries(types).sort((a, b) => b[1].length - a[1].length).map(([bt, cs]) => `<tr><td class="mono">${esc(bt)}</td><td>${cs.length}</td><td class="tiny">${esc(domainOf(cs[0], null).split(' · ').slice(0, 3).join(' · '))}</td></tr>`).join('')}</tbody></table>`;
  const list = DB.tables.filter(t => !q || t.name.toLowerCase().includes(q.toLowerCase()));
  $('#storeList').innerHTML = list.map(t => `<details class="acc"><summary><b class="mono">${esc(t.name)}</b><span class="badge mute">${t.columns.length} atributos</span><span class="tiny muted">${esc((TABLE_INFO[t.name] || [])[0] || '')}</span></summary><div class="acc-body"><pre class="codeblock light">${esc(storeExpression(t))}</pre><div class="row" style="margin-top:8px">${copyBtn(storeExpression(t), 'Copiar')}<button class="btn sm" onclick="go('diccionario',{table:'${esc(t.name)}'})">Abrir diccionario</button></div></div></details>`).join('') || emptyBox('Sin tablas que coincidan.');
}
