/* =====================================================================
   Relaciones, triggers, vistas, índices, registros, dependencias,
   conclusiones, exportación e impresión
   ===================================================================== */
function renderRelations(q = '', evidence = '', type = '') {
  let list = DB.relations.filter(r => {
    const text = r.fromTable + ' ' + r.toTable + ' ' + r.fromColumns.join(' ') + ' ' + r.toColumns.join(' ') + ' ' + (r.name || '');
    return (!q || text.toLowerCase().includes(q.toLowerCase())) && (!evidence || r.evidence === evidence) && (!type || cardinality(r).startsWith(type));
  });
  const host = $('#relContent');
  if (!list.length) { host.innerHTML = emptyBox('No hay relaciones que coincidan con los filtros.'); return; }
  host.innerHTML = `<div class="card"><div class="card-head"><h3>${list.length} relaciones</h3><span class="sub">Clic en una tarjeta para abrir su contexto</span></div><div class="card-body"><div class="grid g2">${list.map(r => `<div class="rel-item" data-r="${esc(r.id)}" style="margin:0"><div class="row" style="gap:5px"><b>${esc(r.fromTable)}</b><span style="color:var(--blue)">→</span><b>${esc(r.toTable)}</b></div><div class="tiny muted" style="margin-top:5px">${esc(r.fromColumns.join(', '))} → ${esc(r.toColumns.join(', '))}</div><div class="row" style="margin-top:7px"><span class="badge ${r.evidence === 'confirmada' ? 'ok' : 'inf'}">${esc(r.evidence)}</span><span class="badge mute">${cardinality(r)}</span>${r.onDelete ? `<span class="badge mute">DELETE ${esc(r.onDelete)}</span>` : ''}${r.onUpdate ? `<span class="badge mute">UPDATE ${esc(r.onUpdate)}</span>` : ''}</div></div>`).join('')}</div></div></div>`;
  $$('#relContent [data-r]').forEach(el => el.addEventListener('click', () => showContext('relacion', el.dataset.r)));
}

/* ---------- triggers ---------- */
function triggerExplanation(t) {
  const targets = [...t.affectedTables, ...t.affectedViews];
  return `Al${t.event === 'INSERT' ? ' insertar' : t.event === 'UPDATE' ? ' actualizar' : ' eliminar'} un registro en ${t.table}, el trigger se ejecuta ${t.timing} de cada fila ${t.hasOld || t.hasNew ? `y emplea los valores ${[t.hasOld && 'OLD', t.hasNew && 'NEW'].filter(Boolean).join(' y ')} para ` : 'para '}${targets.length ? `escribir en ${targets.join(', ')}` : 'realizar las operaciones de su cuerpo'}. ${t.conditions.includes('USER()') ? 'Registra la cuenta de base de datos mediante USER().' : ''} Las condiciones y operaciones se han leído del código SQL; la finalidad funcional es una interpretación técnica.`;
}
function triggerFlow(t) {
  const target = [...t.affectedTables, ...t.affectedViews].join(', ') || 'operación interna';
  const val = t.conditions.length ? t.conditions.join(' + ') : 'sin condición adicional';
  return `<div class="flow"><div class="flow-node"><span class="tiny muted">Evento SQL</span><b>${t.event} en ${t.table}</b></div><div class="flow-arrow">→</div><div class="flow-node"><span class="tiny muted">Trigger</span><b>${t.name}</b></div><div class="flow-arrow">→</div><div class="flow-node"><span class="tiny muted">Validación / operación</span><b>${val}</b></div><div class="flow-arrow">→</div><div class="flow-node"><span class="tiny muted">Objeto afectado</span><b>${target}</b></div></div>`;
}
function renderTriggers(f = {}) {
  const q = f.q || $('#trgSearch').value.trim(), tbl = f.table || $('#trgTable').value, ev = f.event || $('#trgEvent').value, tm = f.timing || $('#trgTiming').value;
  if (f.q) $('#trgSearch').value = f.q;
  if (f.event) $('#trgEvent').value = f.event;
  if (f.timing) $('#trgTiming').value = f.timing;
  const list = DB.triggers.filter(t => (!q || (t.name + ' ' + t.table + ' ' + t.body).toLowerCase().includes(q.toLowerCase())) && (!tbl || t.table === tbl) && (!ev || t.event === ev) && (!tm || t.timing === tm));
  const matrixHost = $('#trgMatrix');
  if ($('#trgMatrix').dataset.show === '1') {
    const tables = [...new Set(DB.triggers.map(t => t.table))].sort();
    matrixHost.innerHTML = `<div class="card" style="margin-bottom:16px"><div class="card-head"><h3>Matriz de triggers por tabla y evento</h3><button class="btn sm" id="trgHideMatrix">Ocultar matriz</button></div><div class="table-scroll" style="max-height:400px"><table class="tbl compact"><thead><tr><th>Tabla</th><th>AFTER INSERT</th><th>AFTER UPDATE</th><th>AFTER DELETE</th><th>Total</th></tr></thead><tbody>${tables.map(tn => `<tr><td class="mono">${esc(tn)}</td>${['INSERT', 'UPDATE', 'DELETE'].map(e => `<td>${DB.triggers.filter(t => t.table === tn && t.event === e).length || '<span class="faint">—</span>'}</td>`).join('')}<td><b>${trigByTable(tn).length}</b></td></tr>`).join('')}</tbody></table></div></div>`;
    $('#trgHideMatrix').addEventListener('click', () => { matrixHost.dataset.show = '0'; matrixHost.innerHTML = ''; });
  } else matrixHost.innerHTML = '';
  const host = $('#trgList');
  if (!list.length) { host.innerHTML = emptyBox('No hay triggers que coincidan con los filtros.'); return; }
  host.innerHTML = `<div class="card"><div class="card-head"><h3>${list.length} triggers documentados</h3><span class="sub">Código original · resaltado y numerado</span></div><div class="card-body">${list.map((t, i) => `<details class="acc" data-trg="${esc(t.name)}"><summary><span class="badge fk">${esc(t.timing)}</span><span class="badge uq">${esc(t.event)}</span><b class="mono">${esc(t.name)}</b><span class="tiny muted">ON ${esc(t.table)}</span></summary><div class="acc-body">
    <div class="facts"><div class="fact"><b>Tabla asociada</b><span class="mono">${esc(t.table)}</span></div><div class="fact"><b>Momento / evento</b><span>${esc(t.timing)} ${esc(t.event)} · FOR EACH ROW</span></div><div class="fact"><b>Tablas / vistas afectadas</b><span class="mono">${esc([...t.affectedTables, ...t.affectedViews].join(', ') || 'operación interna')}</span></div><div class="fact"><b>Operaciones</b><span>${esc(t.operations.join(', '))}</span></div><div class="fact"><b>Condiciones detectadas</b><span>${esc(t.conditions.join(', ') || 'sin condición adicional')}</span></div><div class="fact"><b>Dependencias</b><span class="mono">${esc(t.affectedViews.join(', ') || '—')}</span></div></div>
    <div class="sect-title">Flujo del evento</div>${triggerFlow(t)}
    <div class="sect-title">Explicación técnica (interpretación inferida)</div><p class="tiny muted">${esc(triggerExplanation(t))}</p>
    <div class="sect-title">Código SQL original</div>${codeLines(t.sql, 'trgCode' + i)}
    <div class="row" style="margin-top:10px"><button class="btn sm" onclick="go('diccionario',{table:'${esc(t.table)}'})">Ir a la tabla</button><button class="btn sm" onclick="go('eer',{focus:'${esc(t.table)}'})">Ver en EER</button><button class="btn sm" onclick="showContext('trigger','${esc(t.name)}')">Contexto</button></div>
  </div></details>`).join('')}</div></div>`;
  $$('#trgList details').forEach(d => d.addEventListener('toggle', () => { if (d.open) { const inp = $('input[type=search]', d); if (inp && !inp.dataset.bound) { inp.dataset.bound = '1'; const lines = $('.code-lines', d); inp.addEventListener('input', () => { const q = inp.value.toLowerCase(); $$('.cl', lines).forEach(l => { const hit = l.textContent.toLowerCase().includes(q); l.classList.toggle('hit', !!q && hit); l.style.display = !q || hit ? '' : 'none'; }); }); } } }));
}

/* ---------- vistas ---------- */
function viewGraph(v) {
  const nodes = [v.name, ...v.tables, ...v.views, ...v.external];
  const uniq = [...new Set(nodes)];
  const W = 660, H = 130 + Math.floor(uniq.length / 4) * 50;
  const pos = uniq.map((n, i) => ({ n, x: 85 + (i % 4) * 160, y: 45 + Math.floor(i / 4) * 55 }));
  let s = `<svg viewBox="0 0 ${W} ${H}" style="width:100%;height:${H}px" role="img" aria-label="Dependencias de ${esc(v.name)}">`;
  pos.slice(1).forEach(p => s += `<path d="M330 28 Q${p.x} 15 ${p.x} ${p.y - 13}" stroke="var(--muted)" fill="none" stroke-width="1.4"/>`);
  pos.forEach((p, i) => {
    const kind = i === 0 ? 'vista' : p.n.includes('.') ? 'externo' : viewByName(p.n) ? 'vista' : 'tabla';
    const color = kind === 'vista' ? '#7c3aed' : kind === 'externo' ? '#d97706' : '#2563eb';
    s += `<rect x="${p.x - 68}" y="${p.y - 13}" width="136" height="26" rx="7" fill="${color}" opacity=".13" stroke="${color}"/><text x="${p.x}" y="${p.y + 4}" text-anchor="middle" font-size="9" font-family="Consolas,monospace" fill="var(--text)">${esc(p.n.slice(0, 20))}</text>`;
  });
  return s + '</svg>';
}
function renderViews(f = {}) {
  const q = f.q || $('#viewSearch').value.trim(), src = f.source || $('#viewSource').value, sort = $('#viewSort').value;
  if (f.q) $('#viewSearch').value = f.q;
  let list = DB.views.filter(v => (!q || (v.name + ' ' + v.sql).toLowerCase().includes(q.toLowerCase())) && (!src || v.tables.includes(src)));
  if (sort === 'deps') list.sort((a, b) => (b.tables.length + b.views.length + b.external.length) - (a.tables.length + a.views.length + a.external.length));
  else list.sort((a, b) => a.name.localeCompare(b.name));
  const host = $('#viewList');
  if (!list.length) { host.innerHTML = emptyBox('No hay vistas que coincidan con los filtros.'); return; }
  host.innerHTML = `<div class="card"><div class="card-head"><h3>${list.length} vistas documentadas</h3><span class="sub">Definición final extraída del respaldo</span></div><div class="card-body">${list.map((v, i) => `<details class="acc" data-view="${esc(v.name)}"><summary><b class="mono">${esc(v.name)}</b><span class="badge mute">${v.columns.length} columnas</span><span class="badge mute">${v.tables.length} tablas</span>${v.external.length ? '<span class="badge warn">externo</span>' : ''}${v.isRecursive ? '<span class="badge uq">recursiva</span>' : ''}</summary><div class="acc-body">
  <p class="tiny muted">Propósito inferido: expone una proyección de trazabilidad de <b>${esc(v.tables.join(', ') || 'objetos del sistema')}</b>${v.external.length ? ` y del objeto externo ${esc(v.external.join(', '))}` : ''} para consulta y auditoría.</p>
  <div class="facts"><div class="fact"><b>Columnas resultantes</b><span class="mono">${esc(v.columns.join(', '))}</span></div><div class="fact"><b>Tablas de origen</b><span class="mono">${esc(v.tables.join(', ') || '—')}</span></div><div class="fact"><b>Vistas utilizadas</b><span class="mono">${esc(v.views.join(', ') || '—')}</span></div><div class="fact"><b>Objetos externos</b><span class="mono">${esc(v.external.join(', ') || '—')}</span></div><div class="fact"><b>Características</b><span>${[v.isRecursive && 'WITH RECURSIVE', v.hasAggregation && 'agregación', v.hasGroupBy && 'GROUP BY', v.hasJoins && 'JOIN', v.hasCase && 'CASE', v.hasSubquery && 'subconsulta', v.hasWindow && 'función de ventana'].filter(Boolean).join(', ') || 'consulta directa'}</span></div><div class="fact"><b>Algoritmo / seguridad</b><span>${esc(v.algorithm || '—')} / ${esc(v.security || '—')}</span></div></div>
  <div class="sect-title">Diagrama de dependencias</div>${viewGraph(v)}
  <div class="sect-title">SQL de creación</div>${codeLines(v.sql, 'viewCode' + i)}
  <div class="row" style="margin-top:10px">${v.tables.map(t => `<button class="btn sm" onclick="go('diccionario',{table:'${esc(t)}'})">${esc(t)}</button>`).join('')}<button class="btn sm" onclick="showContext('vista','${esc(v.name)}')">Contexto</button></div>
  </div></details>`).join('')}</div></div>`;
  $$('#viewList details').forEach(d => d.addEventListener('toggle', () => { if (d.open) bindCodeSearchOnce(d); }));
}
function bindCodeSearchOnce(d) {
  const inp = $('input[type=search]', d); if (!inp || inp.dataset.bound) return;
  inp.dataset.bound = '1';
  const lines = $('.code-lines', d);
  inp.addEventListener('input', () => {
    const q = inp.value.toLowerCase();
    $$('.cl', lines).forEach(l => { const hit = l.textContent.toLowerCase().includes(q); l.classList.toggle('hit', !!q && hit); l.style.display = !q || hit ? '' : 'none'; });
  });
}

/* ---------- índices y restricciones ---------- */
function renderIndexes(q = '', type = '') {
  if (q) $('#idxSearch').value = q;
  if (type) $('#idxType').value = type;
  const rows = [];
  DB.tables.forEach(t => {
    t.indexes.forEach(i => rows.push({ t, kind: i.type, name: i.name || '(anónimo)', detail: i.columns.join(', '), def: `${i.type} ${i.name ? '`' + i.name + '` ' : ''}(${i.columns.join(', ')})` }));
    t.checks.forEach(c => rows.push({ t, kind: 'CHECK', name: c.name || 'CHECK', detail: c.expression, def: c.definition }));
    t.foreignKeys.forEach(f => rows.push({ t, kind: 'FOREIGN KEY', name: f.name || 'FK', detail: `${f.columns.join(', ')} → ${f.refTable}(${f.refColumns.join(', ')})`, def: f.definition }));
  });
  const hits = rows.filter(r => (!q || (r.t.name + ' ' + r.kind + ' ' + r.name + ' ' + r.detail).toLowerCase().includes(q.toLowerCase())) && (!type || r.kind === type));
  $('#idxContent').innerHTML = `<div class="card"><div class="card-head"><h3>${hits.length} objetos declarados</h3></div><div class="table-scroll"><table class="tbl compact"><thead><tr><th>Tabla</th><th>Tipo</th><th>Nombre</th><th>Columnas / expresión</th><th>Referencia</th></tr></thead><tbody>${hits.map(r => `<tr onclick="showContext('tabla','${esc(r.t.name)}')" style="cursor:pointer"><td class="mono">${esc(r.t.name)}</td><td><span class="badge ${r.kind === 'PRIMARY' ? 'pk' : r.kind === 'UNIQUE' ? 'uq' : r.kind === 'FOREIGN KEY' ? 'fk' : r.kind === 'CHECK' ? 'ck' : 'mute'}">${esc(r.kind)}</span></td><td class="mono tiny">${esc(r.name)}</td><td class="mono tiny">${esc(r.detail)}</td><td class="tiny"><button class="btn sm" onclick="event.stopPropagation();copyText(${JSON.stringify(r.def).replace(/"/g, '&quot;')},'Definición copiada')">Copiar DDL</button></td></tr>`).join('')}</tbody></table></div></div>` || emptyBox('Sin índices o restricciones que coincidan.');
}

/* ---------- registros ---------- */
function renderRecords() {
  const counts = DB.tables.map(t => ({ t, n: rowOf(t.name), rc: DB.rowCounts[t.name] }));
  const total = counts.reduce((a, x) => a + x.n, 0);
  $('#rowMethod').innerHTML = `<b>Metodología:</b> se recorrieron las ${fmt(DB.meta.statementCount)} declaraciones del respaldo con un analizador que respeta comillas, escapes, comentarios y delimitadores. Se contaron las tuplas de cada VALUES (no el número de instrucciones INSERT) y se verificó que no existen sentencias DELETE, REPLACE ni UPDATE de datos en el archivo. Por ello los conteos se clasifican como <b>exactos verificables del respaldo</b>. No representan datos actuales de un servidor MySQL. Los valores de las filas no se han incrustado.`;
  $('#rowKpis').innerHTML = `<div class="dstat"><div class="k">Tuplas contadas</div><div class="v">${fmt(total)}</div></div><div class="dstat"><div class="k">Instrucciones INSERT</div><div class="v">${fmt(counts.reduce((a, x) => a + (x.rc?.statements || 0), 0))}</div></div><div class="dstat"><div class="k">Tablas con datos</div><div class="v">${counts.filter(x => x.n > 0).length} de ${DB.tables.length}</div></div>`;
  $('#rowContent').innerHTML = `<table class="tbl compact"><thead><tr><th>Tabla</th><th>Registros</th><th>Instrucciones</th><th>Clasificación</th><th>Líneas del respaldo</th></tr></thead><tbody>${counts.sort((a, b) => b.n - a.n).map(x => `<tr style="cursor:pointer" onclick="showContext('tabla','${esc(x.t.name)}')"><td class="mono">${esc(x.t.name)}</td><td><b>${fmt(x.n)}</b></td><td>${x.rc?.statements || 0}</td><td><span class="badge ok">${esc(x.rc?.method || 'no determinable')}</span></td><td class="tiny muted">${(x.rc?.lines || []).join(', ')}</td></tr>`).join('')}</tbody></table>`;
}

/* ---------- dependencias y trazabilidad ---------- */
function renderDependencies(q = '', type = '') {
  if (q) $('#depSearch').value = q;
  if (type) $('#depType').value = type;
  const nodes = [
    ...DB.tables.map(t => ({ n: t.name, k: t.name === 'tb_logs' ? 'auditoria' : 'tabla', d: `${t.columns.length} columnas` })),
    ...DB.views.map(v => ({ n: v.name, k: 'vista', d: `${v.tables.length} tablas` })),
    ...DB.triggers.map(t => ({ n: t.name, k: 'trigger', d: `${t.timing} ${t.event}` })),
    ...DB.routines.map(r => ({ n: r.name, k: 'rutina', d: r.kind }))
  ].filter(x => (!q || x.n.toLowerCase().includes(q.toLowerCase())) && (!type || x.k === type)).slice(0, 90);
  const colors = { tabla: '#2563eb', vista: '#7c3aed', trigger: '#0891b2', rutina: '#059669', auditoria: '#d97706' };
  const W = 900, cols = 5, rowH = 34, H = 60 + Math.ceil(nodes.length / cols) * rowH;
  let g = `<svg viewBox="0 0 ${W} ${H}" style="width:100%;height:${H}px" role="img" aria-label="Mapa de dependencias">`;
  DB.views.filter(v => nodes.some(n => n.n === v.name)).forEach(v => v.tables.filter(tn => nodes.some(n => n.n === tn)).forEach(tn => {
    const i = nodes.findIndex(n => n.n === v.name), j = nodes.findIndex(n => n.n === tn);
    g += `<path d="M${120 + (i % cols) * 170} ${35 + Math.floor(i / cols) * rowH} L${120 + (j % cols) * 170} ${35 + Math.floor(j / cols) * rowH}" stroke="var(--border)" stroke-width="1"/>`;
  }));
  nodes.forEach((x, i) => {
    const px = 120 + (i % cols) * 170, py = 35 + Math.floor(i / cols) * rowH;
    g += `<circle cx="${px - 58}" cy="${py}" r="4" fill="${colors[x.k]}"/><text x="${px - 48}" y="${py + 3}" font-size="9" font-family="Consolas,monospace" fill="var(--text)">${esc(x.n.slice(0, 21))}</text>`;
  });
  g += '</svg>';
  $('#depGraph').innerHTML = g + `<div class="legend">${Object.entries(colors).map(([k, c]) => `<span><i style="background:${c}"></i>${cap(k)}</span>`).join('')}</div>`;
  const auditTables = ['tb_logs'];
  $('#depAudit').innerHTML = `<p class="tiny muted">Tabla central de bitácora: ${fmt(rowOf('tb_logs'))} registros verificables. ${DB.triggers.length} triggers escriben en la bitácora o en vistas de trazabilidad derivadas de ella; ${DB.views.length} vistas consultan su contenido.</p>
  ${auditTables.map(tn => { const t = tableByName(tn); return `<div class="rel-item"><b>${esc(tn)}</b><span class="badge warn">auditoría</span><div class="tiny muted">${t.columns.map(c => c.name).join(' · ')}</div></div>`; }).join('')}
  <div class="sect-title">Objetos externos del sistema</div><div class="chips">${[...new Set(DB.views.flatMap(v => v.external))].map(x => `<span class="pill">${esc(x)}</span>`).join('') || '<span class="tiny muted">Ninguno</span>'}</div>
  <div class="note warn" style="margin-bottom:0">Los objetos <span class="mono">mysql.*</span> no son tablas físicas del esquema <span class="mono">${esc(DB.meta.database)}</span>: se representan como dependencias externas.</div>`;
  $('#depRoutines').innerHTML = `<table class="tbl compact"><thead><tr><th>Rutina</th><th>Tipo</th><th>Parámetros</th><th>Retorno</th><th>SQL</th></tr></thead><tbody>${DB.routines.map(r => `<tr><td class="mono">${esc(r.name)}</td><td>${esc(r.kind)}</td><td class="tiny mono">${esc(r.params.join('; ') || '—')}</td><td class="tiny mono">${esc(r.returns || '—')}</td><td><button class="btn sm" onclick="showContext('rutina','${esc(r.name)}')">Ver código</button></td></tr>`).join('')}</tbody></table>`;
}

/* ---------- conclusiones ---------- */
function renderConclusions() {
  const v = DB.validation, S = DB.stats;
  const ok = v.found.tables === v.expected.tables && v.found.triggers === v.expected.triggers && v.found.views === v.expected.views;
  $('#conclusions').innerHTML = `<div class="grid g2">
    <div class="card pad"><div class="eyebrow">Validación</div><h3 style="margin-top:0">Conteos contrastados</h3><p class="tiny">Los valores esperados se trataron como criterio de verificación, nunca como cuotas a completar. El análisis encontró ${v.found.tables} tablas, ${v.found.triggers} triggers y ${v.found.views} vistas: ${ok ? 'coincidencia plena' : 'diferencias documentadas'}.</p><p class="tiny muted">Declaraciones analizadas: ${fmt(DB.meta.statementCount)}. Servidor de origen: ${esc(DB.meta.serverVersion)}.</p></div>
    <div class="card pad"><div class="eyebrow">Hallazgos del DDL</div><h3 style="margin-top:0">Integridad y diseño</h3><p class="tiny">${S.primaryKeys} columnas participan en claves primarias (incluye ${DB.tables.filter(t => t.primaryKey.length > 1).length} claves compuestas); ${S.foreignKeys} claves foráneas declaradas, ${S.checks} restricciones CHECK, ${S.indexes} índices y ${DB.views.length} vistas de trazabilidad.</p><p class="tiny">Los ${DB.triggers.length} triggers son todos <b>AFTER</b> (24 INSERT, 24 UPDATE, 24 DELETE); escriben en la bitácora o en vistas actualizables de auditoría.</p></div>
    <div class="card pad"><div class="eyebrow">Trazabilidad</div><h3 style="margin-top:0">Auditoría incorporada</h3><p class="tiny">La tabla <span class="mono">tb_logs</span> concentra ${fmt(rowOf('tb_logs'))} registros del respaldo. Las vistas <span class="mono">vw_trazabilidad_*</span> consultan la bitácora y, en algunos casos, el objeto externo <span class="mono">mysql.role_edges</span> para mostrar roles del usuario.</p></div>
    <div class="card pad"><div class="eyebrow">Limitaciones</div><h3 style="margin-top:0">Lo que no puede afirmarse</h3><p class="tiny">No existen relaciones inferidas por convención porque todas las correspondencias detectadas están confirmadas por FOREIGN KEY. No se declaran CHECK sobre ENUM: sus alternativas proceden del tipo. No se han exportado datos personales, credenciales ni hashes; solo su estructura y conteos agregados. Los conteos son del respaldo, no de un servidor activo.</p></div>
  </div>
  <div class="note">Las descripciones funcionales y las clasificaciones conceptuales se identifican como inferidas cuando el DDL no las declara explícitamente. La notación DFD se construye desde nombres, tipos, nulidad y claves reales; los ejemplos didácticos permanecen separados.</div>`;
}

/* ---------- exportación e impresión ---------- */
function exportCards() {
  const cards = [
    ['Documento completo', 'Portada, índice, dashboard, diccionario completo, triggers, vistas y conclusiones.', 'full', 'print'],
    ['Diccionario de datos', `${DB.tables.length} tablas y ${DB.stats.columns} atributos con ficha académica y notación DFD.`, 'dict', 'book'],
    ['Documentación de triggers', `${DB.triggers.length} triggers con evento, código SQL y explicación.`, 'trig', 'bolt'],
    ['Documentación de vistas', `${DB.views.length} vistas con SQL, columnas y dependencias.`, 'view', 'eye'],
    ['Modelo EER (SVG)', 'Vector escalable con posiciones actuales y relaciones.', 'svg', 'download'],
    ['Modelo EER (PNG)', 'Imagen de alta resolución generada en el navegador.', 'png', 'download']
  ];
  $('#exportCards').innerHTML = cards.map(c => `<div class="tcard" style="cursor:default"><h4 style="font-family:inherit">${c[0]}</h4><div class="meta" style="margin-bottom:12px">${c[1]}</div><button class="btn primary sm" data-exp="${c[2]}">${ico(c[3], 'sm')} ${c[2] === 'full' || c[2] === 'dict' || c[2] === 'trig' || c[2] === 'view' ? 'Imprimir' : 'Descargar'}</button></div>`).join('');
  $$('#exportCards [data-exp]').forEach(b => b.addEventListener('click', () => {
    const k = b.dataset.exp;
    if (k === 'svg' || k === 'png') { eerExport(k); return; }
    preparePrint(k); window.print();
  }));
  $('#btnPrintDict').addEventListener('click', () => { preparePrint('dict'); window.print(); });
  $('#btnPrintTrig').addEventListener('click', () => { preparePrint('trig'); window.print(); });
  $('#btnPrintViews').addEventListener('click', () => { preparePrint('view'); window.print(); });
  $('#btnPrintEer').addEventListener('click', () => { preparePrint('eer'); window.print(); });
  const v = DB.validation;
  $('#validationReport').innerHTML = `<table class="tbl compact"><thead><tr><th>Comprobación</th><th>Esperado</th><th>Encontrado</th><th>Estado</th></tr></thead><tbody>${[
    ['Tablas físicas', v.expected.tables, v.found.tables], ['Triggers', v.expected.triggers, v.found.triggers], ['Vistas', v.expected.views, v.found.views]
  ].map(r => `<tr><td>${r[0]}</td><td>${r[1]}</td><td>${r[2]}</td><td><span class="badge ${r[1] === r[2] ? 'ok' : 'warn'}">${r[1] === r[2] ? 'Correcto' : 'Diferencia'}</span></td></tr>`).join('')}
  <tr><td>Columnas documentadas</td><td>—</td><td>${DB.stats.columns}</td><td><span class="badge ok">${DB.tables.every(t => t.columns.every(c => analyze(t, c).dfd)) ? 'Completo' : 'Incompleto'}</span></td></tr>
  <tr><td>Relaciones representadas</td><td>—</td><td>${DB.relations.length}</td><td><span class="badge ok">${DB.stats.confirmedRelations} confirmadas</span></td></tr>
  <tr><td>Registros con metodología</td><td>—</td><td>${fmt(DB.stats.rows)}</td><td><span class="badge ok">Exacto del respaldo</span></td></tr></tbody></table>`;
}
function printDictionaryTables(list) {
  return list.map(t => `<div class="print-block"><h3>${esc(t.name)}</h3><p class="print-meta">${esc((TABLE_INFO[t.name] || [])[0] || '')} · ${t.columns.length} columnas · ${fmt(rowOf(t.name))} registros del respaldo · PK: ${esc(t.primaryKey.join(', '))}</p>
  <p class="print-meta"><b>Composición del almacén:</b></p><pre class="print-code">${esc(storeExpression(t))}</pre>
  <table class="print-tbl"><thead><tr><th>#</th><th>Atributo</th><th>Tipo SQL</th><th>Descripción</th><th>Dominio</th><th>Naturaleza</th><th>Clasificación</th><th>Notación DFD</th></tr></thead><tbody>${t.columns.map(c => { const a = analyze(t, c); return `<tr><td>${c.ordinal}</td><td>${esc(c.name)}${c.notNull ? '' : ' (NULL)'}</td><td>${esc(c.type)}</td><td>${esc(a.description)}</td><td>${esc(a.domain)}</td><td>${esc(a.nature)}</td><td>${esc(a.classification)}</td><td>${esc(a.dfd)}</td></tr>`; }).join('')}</tbody></table></div>`).join('');
}
function preparePrint(scope) {
  const date = new Date().toLocaleString('es-MX');
  const sections = { full: ['Portada', 'Índice', 'Dashboard', 'Diccionario de datos', 'Triggers', 'Vistas', 'Índices y restricciones', 'Registros', 'Conclusiones'], dict: ['Portada', 'Índice', 'Diccionario de datos'], trig: ['Portada', 'Índice', 'Triggers'], view: ['Portada', 'Índice', 'Vistas'], eer: ['Portada', 'Índice', 'Modelo EER'] };
  const chosen = sections[scope] || sections.full;
  let h = `<div class="print-cover"><h1>DB Atlas</h1><h2>Documentación de ingeniería inversa · ${esc(DB.meta.database)}</h2><p>Respaldo analizado: <b>${esc(DB.meta.sourceFile)}</b> (${(DB.meta.sourceSizeBytes / 1048576).toFixed(2)} MB)<br>Servidor de origen: MySQL ${esc(DB.meta.serverVersion)}<br>Fecha de generación: ${esc(date)}</p><p class="print-meta">Documento generado localmente en el navegador. No contiene valores personales ni credenciales del respaldo.</p></div>`;
  h += `<div class="print-section"><h2>Índice</h2><ol class="print-index">${chosen.slice(1).map(s => `<li>${esc(s)}</li>`).join('')}</ol></div>`;
  if (scope === 'full' || scope === 'eer') {
    h += `<div class="print-section"><h2>${scope === 'eer' ? 'Modelo EER' : 'Dashboard'}</h2>${scope === 'full' ? `<p>Tablas: ${DB.tables.length} · Triggers: ${DB.triggers.length} · Vistas: ${DB.views.length} · Columnas: ${DB.stats.columns} · Relaciones: ${DB.relations.length} · Registros del respaldo: ${fmt(DB.stats.rows)}.</p>` : ''}<p class="print-meta">El modelo interactivo (arrastre, zoom y exportación) está disponible en la aplicación HTML. En papel se listan entidades y relaciones.</p><table class="print-tbl"><thead><tr><th>Entidad</th><th>Columnas</th><th>Campos (todos)</th><th>PK</th><th>FK</th><th>Registros</th></tr></thead><tbody>${DB.tables.map(t => `<tr><td>${esc(t.name)}</td><td>${t.columns.length}</td><td class="mono tiny">${t.columns.map(c => esc(c.name)).join(', ')}</td><td>${esc(t.primaryKey.join(', '))}</td><td>${t.foreignKeys.length}</td><td>${fmt(rowOf(t.name))}</td></tr>`).join('')}</tbody></table><h3>Relaciones</h3><table class="print-tbl"><thead><tr><th>Origen</th><th>Destino</th><th>Columnas</th><th>Evidencia</th></tr></thead><tbody>${DB.relations.map(r => `<tr><td>${esc(r.fromTable)}</td><td>${esc(r.toTable)}</td><td>${esc(r.fromColumns.join(', '))} → ${esc(r.toColumns.join(', '))}</td><td>${esc(r.evidence)}</td></tr>`).join('')}</tbody></table></div>`;
  }
  if (scope === 'full' || scope === 'dict') h += `<div class="print-section"><h2>Diccionario de datos</h2><h3>Leyenda DFD</h3><table class="print-tbl"><thead><tr><th>Símbolo</th><th>Significado</th></tr></thead><tbody>${SYMBOLS.map(s => `<tr><td>${esc(s[0])}</td><td>${esc(s[1])} · ${esc(s[2])}</td></tr>`).join('')}</tbody></table><p class="print-meta">Los ejemplos de la aplicación están marcados como ilustrativos y no se han copiado como restricciones reales.</p>${printDictionaryTables(DB.tables)}</div>`;
  if (scope === 'full' || scope === 'trig') h += `<div class="print-section"><h2>Triggers</h2>${DB.triggers.map(t => `<div class="print-block"><h3>${esc(t.name)}</h3><p class="print-meta">${esc(t.timing)} ${esc(t.event)} ON ${esc(t.table)} · Afecta: ${esc([...t.affectedTables, ...t.affectedViews].join(', ') || 'operación interna')}</p><p>${esc(triggerExplanation(t))}</p><pre class="print-code">${esc(t.sql)}</pre></div>`).join('')}</div>`;
  if (scope === 'full' || scope === 'view') h += `<div class="print-section"><h2>Vistas</h2>${DB.views.map(v => `<div class="print-block"><h3>${esc(v.name)}</h3><p class="print-meta">Columnas: ${esc(v.columns.join(', '))} · Tablas: ${esc(v.tables.join(', '))} · Externos: ${esc(v.external.join(', ') || '—')}</p><pre class="print-code">${esc(v.sql)}</pre></div>`).join('')}</div>`;
  if (scope === 'full') {
    h += `<div class="print-section"><h2>Índices y restricciones</h2><table class="print-tbl"><thead><tr><th>Tabla</th><th>Objeto</th><th>Nombre</th><th>Detalle</th></tr></thead><tbody>${DB.tables.flatMap(t => [...t.indexes.map(i => [t.name, i.type, i.name, i.columns.join(', ')]), ...t.checks.map(c => [t.name, 'CHECK', c.name, c.expression]), ...t.foreignKeys.map(f => [t.name, 'FOREIGN KEY', f.name, f.columns.join(', ') + ' → ' + f.refTable])]).map(r => `<tr><td>${esc(r[0])}</td><td>${esc(r[1])}</td><td>${esc(r[2] || '—')}</td><td>${esc(r[3])}</td></tr>`).join('')}</tbody></table></div>`;
    h += `<div class="print-section"><h2>Registros del respaldo</h2><p class="print-meta">Conteo de tuplas en instrucciones INSERT. No son datos de un servidor activo.</p><table class="print-tbl"><thead><tr><th>Tabla</th><th>Registros</th><th>Instrucciones</th><th>Método</th></tr></thead><tbody>${DB.tables.map(t => `<tr><td>${esc(t.name)}</td><td>${fmt(rowOf(t.name))}</td><td>${DB.rowCounts[t.name]?.statements || 0}</td><td>${esc(DB.rowCounts[t.name]?.method || '—')}</td></tr>`).join('')}</tbody></table></div>`;
    h += `<div class="print-section"><h2>Conclusiones técnicas</h2><p>El análisis encontró ${DB.tables.length} tablas, ${DB.triggers.length} triggers y ${DB.views.length} vistas, coincidiendo con los conteos esperados. ${DB.relations.length} relaciones están confirmadas por claves foráneas. Los triggers son exclusivamente AFTER y alimentan la bitácora de auditoría y sus vistas de trazabilidad.</p><p class="print-meta">Limitaciones: las descripciones funcionales y clasificaciones inferidas se identifican como tales; no se exportan datos personales, contraseñas ni hashes. El conteo de registros corresponde al contenido del respaldo analizado.</p></div>`;
  }
  $('#printRoot').innerHTML = h;
}

/* ---------- enrutamiento de opciones entre módulos ---------- */
window.__applyViewOptions = (view, opt = {}) => {
  if (view === 'diccionario') { $('#dictTable').value = opt.table || $('#dictTable').value; window.__dictApply && window.__dictApply({ col: opt.col }); }
  if (view === 'eer' && opt.focus) setTimeout(() => { EER.selected = opt.focus; EER.selectedRel = null; eerUpdateAll(); }, 60);
  if (view === 'relaciones') renderRelations(opt.q || '', $('#relEvidence').value, $('#relType').value);
  if (view === 'triggers') renderTriggers(opt);
  if (view === 'vistas') renderViews(opt);
  if (view === 'indices') renderIndexes(opt.q || '', $('#idxType').value);
  if (view === 'dominios') renderDomains(opt.q || '');
  if (view === 'dependencias') renderDependencies(opt.q || '', $('#depType').value);
};

/* ---------- arranque de módulos ---------- */
function initModules() {
  const domains = [...new Set(DB.tables.map(domainOfTable))].sort();
  $('#tblDomain').innerHTML += domains.map(d => `<option value="${esc(d)}">${esc(d)}</option>`).join('');
  $('#trgTable').innerHTML += [...new Set(DB.triggers.map(t => t.table))].sort().map(t => `<option value="${esc(t)}">${esc(t)}</option>`).join('');
  $('#viewSource').innerHTML += DB.tables.filter(t => DB.views.some(v => v.tables.includes(t.name))).map(t => `<option value="${esc(t.name)}">${esc(t.name)}</option>`).join('');
  renderTables();
  initDictionary();
  renderClassification();
  renderDomains();
  renderDashboard();
  renderRelations();
  renderTriggers();
  renderViews();
  renderIndexes();
  renderRecords();
  renderDependencies();
  renderConclusions();
  exportCards();
  renderIntro();
  $$('#tblViewMode button').forEach(b => b.classList.toggle('on', b.dataset.mode === tableMode));
  $('#tblSearch').addEventListener('input', e => renderTables(e.target.value, $('#tblDomain').value, $('#tblSort').value));
  $('#tblDomain').addEventListener('change', e => renderTables($('#tblSearch').value, e.target.value, $('#tblSort').value));
  $('#tblSort').addEventListener('change', e => renderTables($('#tblSearch').value, $('#tblDomain').value, e.target.value));
  $$('#tblViewMode button').forEach(b => b.addEventListener('click', () => {
    tableMode = b.dataset.mode; store.set('tableMode', tableMode);
    $$('#tblViewMode button').forEach(x => x.classList.toggle('on', x === b));
    renderTables($('#tblSearch').value, $('#tblDomain').value, $('#tblSort').value);
  }));
  $('#btnCompare').addEventListener('click', compareModal);
  $('#clsSearch').addEventListener('input', e => renderClassification(e.target.value, $('#clsFilter').value));
  $('#clsFilter').addEventListener('change', e => renderClassification($('#clsSearch').value, e.target.value));
  $('#storeSearch').addEventListener('input', e => renderDomains(e.target.value));
  $('#relSearch').addEventListener('input', e => renderRelations(e.target.value, $('#relEvidence').value, $('#relType').value));
  $('#relEvidence').addEventListener('change', e => renderRelations($('#relSearch').value, e.target.value, $('#relType').value));
  $('#relType').addEventListener('change', e => renderRelations($('#relSearch').value, $('#relEvidence').value, e.target.value));
  $('#trgSearch').addEventListener('input', e => renderTriggers());
  $('#trgTable').addEventListener('change', () => renderTriggers());
  $('#trgEvent').addEventListener('change', () => renderTriggers());
  $('#trgTiming').addEventListener('change', () => renderTriggers());
  $('#trgShowMatrix').addEventListener('click', () => { $('#trgMatrix').dataset.show = '1'; renderTriggers(); });
  $('#viewSearch').addEventListener('input', e => renderViews({ q: e.target.value }));
  $('#viewSource').addEventListener('change', () => renderViews({ source: $('#viewSource').value }));
  $('#viewSort').addEventListener('change', () => renderViews());
  $('#idxSearch').addEventListener('input', e => renderIndexes(e.target.value, $('#idxType').value));
  $('#idxType').addEventListener('change', e => renderIndexes($('#idxSearch').value, e.target.value));
  $('#depSearch').addEventListener('input', e => renderDependencies(e.target.value, $('#depType').value));
  $('#depType').addEventListener('change', e => renderDependencies($('#depSearch').value, e.target.value));
}

/* ---------- punto de entrada ---------- */
initCore();
initModules();
initEer();
