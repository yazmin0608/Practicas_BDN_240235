/* =====================================================================
   Modelo EER interactivo: lienzo, arrastre, zoom, selección y exportación
   ===================================================================== */
const EER_GROUPS = [
  ['Identidad', ['tb_users', 'tb_people']],
  ['Ventas', ['tb_buyer_orders', 'tb_carts', 'tbd_carts_items', 'tbd_order_items']],
  ['Catálogo', ['tb_products', 'tbc_categories', 'tbd_products_categories', 'tbd_products_users_providers', 'tbd_users_wishlist_products']],
  ['Pagos', ['tb_payments', 'tb_payment_methods', 'tbc_payment_methods_types', 'tb_payment_transactions', 'tbd_user_payment_methods', 'tb_refunds']],
  ['Postventa', ['tb_cancellations', 'tbd_cancellation_items', 'tb_returns', 'tbd_return_items']],
  ['Logística', ['tb_shipments', 'tb_user_addresses', 'tbd_address_components']],
  ['Auditoría', ['tb_logs']]
];
const EER_GROUP_OF = {};
EER_GROUPS.forEach(([g, names]) => names.forEach(n => EER_GROUP_OF[n] = g));
const EW = 212;
const EER = {
  scale: 1, tx: 40, ty: 20,
  pos: store.get('eerPos', null) || {},
  mode: store.get('eerMode', 'general'),
  hidden: new Set(store.get('eerHidden', [])),
  relFilter: 'all', selected: null, selectedRel: null,
  showFields: store.get('eerShowFields', true) !== false,
  collapsed: new Set(),
  nodes: {}, dragging: null, panning: null
};

/* Todas las columnas reales del esquema están disponibles en el lienzo.
   showFields permite ocultarlas globalmente; collapsed oculta una entidad puntual. */
function eerFieldColumns(t) {
  if (EER.mode === 'simplificado' || !EER.showFields || EER.collapsed.has(t.name)) return [];
  return t.columns;
}

function eerDefaultPositions() {
  const p = {};
  EER_GROUPS.forEach(([g, names], col) => names.forEach((n, row) => {
    p[n] = { x: 40 + col * 250, y: 45 + row * 300 };
  }));
  DB.tables.forEach(t => { if (!p[t.name]) p[t.name] = { x: 40, y: 45 }; });
  return p;
}
function eerHeight(t) {
  if (EER.mode === 'simplificado') return 42;
  if (!EER.showFields) return 62;
  if (EER.collapsed.has(t.name)) return 84;
  return 66 + Math.min(t.columns.length * 18 + 10, 320);
}
/* Altura real del nodo ya renderizado (incluye el ajuste de las insignias PK/FK). */
function eerNodeHeight(t) {
  const el = EER.nodes[t.name];
  return el && el.offsetHeight ? el.offsetHeight : eerHeight(t);
}
function eerVisible(name) {
  if (EER.hidden.has(name)) return false;
  if (EER.mode !== 'enfocado' || !EER.selected) return true;
  if (name === EER.selected) return true;
  return DB.relations.some(r => (r.fromTable === EER.selected && r.toTable === name) || (r.toTable === EER.selected && r.fromTable === name));
}
function eerApplyTransform() {
  $('#eerWorld').style.transform = `translate(${EER.tx}px,${EER.ty}px) scale(${EER.scale})`;
  $('#eerZoomLabel').textContent = Math.round(EER.scale * 100) + '%';
}
function eerEntityHtml(t) {
  const pk = t.primaryKey.map(n => `<span class="badge pk">PK ${esc(n)}</span>`).join('');
  const fk = [...new Set(t.foreignKeys.flatMap(f => f.columns))].map(n => `<span class="badge fk">FK ${esc(n)}</span>`).join('');
  const showFields = EER.showFields && EER.mode !== 'simplificado';
  const collapsed = EER.collapsed.has(t.name);
  const cols = showFields ? (collapsed
    ? `<div class="attr muted" data-exp="${esc(t.name)}" style="cursor:pointer">+ ${t.columns.length} campos · mostrar todos</div>`
    : t.columns.map(c => {
        const isPk = t.primaryKey.includes(c.name), isFk = t.foreignKeys.some(f => f.columns.includes(c.name));
        const ty = EER.mode === 'detallado' ? `<span class="ty">${esc(c.type.replace(/\(.*\)/, ''))}</span>` : '';
        return `<div class="attr ${isPk ? 'pk' : isFk ? 'fk' : ''}" title="${esc(c.name)} · ${esc(c.type)}"><b>${isPk ? '◆' : isFk ? '◇' : '·'} ${esc(c.name)}</b>${ty}</div>`;
      }).join('') + `<div class="attr muted" data-exp="${esc(t.name)}" style="cursor:pointer">− contraer campos</div>`
  ) : '';
  const btn = showFields ? `<button class="btn sm" data-exp="${esc(t.name)}" title="Mostrar / ocultar campos" style="padding:1px 5px;background:rgba(255,255,255,.15);border:0;color:#fff">${collapsed ? '+' : '−'}</button>` : '';
  return `<div class="eh" data-drag="${esc(t.name)}"><b>${esc(t.name)}</b><span class="cnt">${t.columns.length}</span>${btn}</div>
  ${EER.mode !== 'simplificado' ? `<div class="emeta"><span>${fmt(rowOf(t.name))} reg.</span>${pk}${fk}</div>` : ''}${cols ? `<div class="attrs">${cols}</div>` : ''}`;
}
function eerBuildEntities() {
  const layer = $('#entityLayer');
  layer.innerHTML = DB.tables.map(t => `<div class="entity" data-ent="${esc(t.name)}">${eerEntityHtml(t)}</div>`).join('');
  EER.nodes = {};
  $$('#entityLayer [data-ent]').forEach(el => {
    const name = el.dataset.ent; EER.nodes[name] = el;
    const pos = EER.pos[name] || { x: 40, y: 45 };
    el.style.left = pos.x + 'px'; el.style.top = pos.y + 'px';
    el.classList.toggle('simplified', EER.mode === 'simplificado');
    el.addEventListener('pointerdown', e => {
      if (e.target.closest('[data-exp]')) {
        e.stopPropagation();
        if (EER.collapsed.has(name)) EER.collapsed.delete(name); else EER.collapsed.add(name);
        eerBuildEntities(); eerUpdateAll(); return;
      }
      if (!e.target.closest('[data-drag]')) return;
      e.stopPropagation(); e.preventDefault();
      EER.dragging = { name, sx: e.clientX, sy: e.clientY, ox: pos.x, oy: pos.y, moved: false };
      el.setPointerCapture(e.pointerId);
    });
    el.addEventListener('pointermove', e => {
      if (!EER.dragging || EER.dragging.name !== name) return;
      const dx = (e.clientX - EER.dragging.sx) / EER.scale, dy = (e.clientY - EER.dragging.sy) / EER.scale;
      if (Math.abs(dx) + Math.abs(dy) > 2) EER.dragging.moved = true;
      EER.pos[name] = { x: Math.max(0, EER.dragging.ox + dx), y: Math.max(0, EER.dragging.oy + dy) };
      el.style.left = EER.pos[name].x + 'px'; el.style.top = EER.pos[name].y + 'px';
      eerRenderEdges();
    });
    el.addEventListener('pointerup', e => {
      if (!EER.dragging) return;
      const moved = EER.dragging.moved, nm = EER.dragging.name;
      EER.dragging = null;
      if (!moved) eerSelectEntity(nm); else store.set('eerPos', EER.pos);
    });
  });
  eerUpdateAll();
}
function eerNeighbors(name) {
  const s = new Set([name]);
  DB.relations.forEach(r => {
    if (!eerVisible(r.fromTable) || !eerVisible(r.toTable)) return;
    if (r.fromTable === name) s.add(r.toTable);
    if (r.toTable === name) s.add(r.fromTable);
  });
  return s;
}
function eerEdgePath(r) {
  const a = tableByName(r.fromTable), b = tableByName(r.toTable);
  if (!a || !b || !EER.pos[a.name] || !EER.pos[b.name]) return null;
  const p = EER.pos[a.name], q = EER.pos[b.name];
  const ha = eerNodeHeight(a), hb = eerNodeHeight(b);
  const acx = p.x + EW / 2, bcx = q.x + EW / 2, acy = p.y + ha / 2, bcy = q.y + hb / 2;
  let x1, y1, x2, y2, ux, uy;
  if (Math.abs(acx - bcx) > 100) {
    const right = acx < bcx;
    x1 = right ? p.x + EW : p.x; y1 = acy;
    x2 = right ? q.x : q.x + EW; y2 = bcy;
    ux = right ? 1 : -1; uy = 0;
  } else {
    const down = acy < bcy;
    x1 = acx; y1 = down ? p.y + ha : p.y;
    x2 = bcx; y2 = down ? q.y : q.y + hb;
    ux = 0; uy = down ? 1 : -1;
  }
  const bend = Math.max(50, Math.abs(x2 - x1) * .45 || Math.abs(y2 - y1) * .45);
  const d = Math.abs(uy) === 1
    ? `M${x1} ${y1} C${x1} ${y1 + uy * bend} ${x2} ${y2 - uy * bend} ${x2} ${y2}`
    : `M${x1} ${y1} C${x1 + ux * bend} ${y1} ${x2 - ux * bend} ${y2} ${x2} ${y2}`;
  return { d, x1, y1, x2, y2, ux, uy };
}
function crowPath(x, y, ux, uy) {
  const px = -uy, py = ux;
  return `M${x} ${y} L${x - ux * 12 + px * 7} ${y - uy * 12 + py * 7} M${x} ${y} L${x - ux * 12 - px * 7} ${y - uy * 12 - py * 7} M${x} ${y} L${x - ux * 3} ${y - uy * 3}`;
}
function barPath(x, y, ux, uy) {
  const px = -uy, py = ux;
  return `M${x + px * 8 - ux * 2} ${y + py * 8 - uy * 2} L${x - px * 8 - ux * 2} ${y - py * 8 - uy * 2}`;
}
function eerRenderEdges() {
  const layer = $('#edgeLayer'); if (!layer) return;
  let html = '';
  DB.relations.forEach(r => {
    if (EER.hidden.has(r.fromTable) || EER.hidden.has(r.toTable)) return;
    if (!eerVisible(r.fromTable) || !eerVisible(r.toTable)) return;
    if (EER.relFilter === 'confirmada' && r.evidence !== 'confirmada') return;
    if (EER.relFilter === 'inferida' && r.evidence !== 'inferida') return;
    const g = eerEdgePath(r); if (!g) return;
    const connected = EER.selected && (r.fromTable === EER.selected || r.toTable === EER.selected);
    const dim = EER.selected && !connected;
    const cls = ['edge', r.evidence === 'inferida' ? 'inferred' : '', connected ? 'hot' : '', dim ? 'dim' : '', EER.selectedRel === r.id ? 'selected' : ''].filter(Boolean).join(' ');
    html += `<path class="${cls}" d="${g.d}"/><path class="edge-hit" data-rel="${esc(r.id)}" d="${g.d}" stroke="transparent" stroke-width="13" fill="none" style="pointer-events:stroke;cursor:pointer"><title>${esc(r.fromTable)} → ${esc(r.toTable)}</title></path>`;
    html += `<path class="crow ${connected ? 'hotmark' : ''} ${dim ? 'dim' : ''}" d="${crowPath(g.x1, g.y1, g.ux, g.uy)}"/>`;
    html += `<path class="crow ${connected ? 'hotmark' : ''} ${dim ? 'dim' : ''}" d="${barPath(g.x2, g.y2, g.ux, g.uy)}"/>`;
  });
  layer.innerHTML = html;
  $$('#edgeLayer [data-rel]').forEach(p => p.addEventListener('click', e => { e.stopPropagation(); eerSelectRelation(p.dataset.rel); }));
}
function eerUpdateAll() {
  const near = EER.selected ? eerNeighbors(EER.selected) : null;
  DB.tables.forEach(t => {
    const el = EER.nodes[t.name]; if (!el) return;
    el.classList.toggle('hidden', !eerVisible(t.name));
    el.classList.toggle('sel', EER.selected === t.name);
    el.classList.toggle('near', !!near && near.has(t.name) && EER.selected !== t.name);
    el.classList.toggle('dim', !!near && !near.has(t.name));
  });
  eerRenderEdges();
  eerSide();
}
function eerSelectEntity(name) {
  EER.selected = EER.selected === name ? null : name;
  EER.selectedRel = null;
  eerUpdateAll();
}
function eerSelectRelation(id) {
  EER.selectedRel = id;
  const r = DB.relations.find(x => x.id === id);
  EER.selected = r ? r.fromTable : null;
  eerUpdateAll();
}
function eerSide() {
  const host = $('#eerSide');
  if (EER.selectedRel) {
    const r = DB.relations.find(x => x.id === EER.selectedRel);
    if (r) {
      host.innerHTML = `<div class="eyebrow">Relación seleccionada</div><h3>${esc(r.fromTable)} → ${esc(r.toTable)}</h3><div class="sub">${esc(r.name || 'Sin nombre de constraint')}</div>
      <div class="facts"><div class="fact"><b>Evidencia</b><span><span class="badge ${r.evidence === 'confirmada' ? 'ok' : 'inf'}">${esc(r.evidence)}</span></span></div><div class="fact"><b>Cardinalidad</b><span>${cardinality(r)} (Crow's Foot)</span></div><div class="fact"><b>Columna(s) origen</b><span class="mono">${esc(r.fromColumns.join(', '))}</span></div><div class="fact"><b>Columna(s) destino</b><span class="mono">${esc(r.toColumns.join(', '))}</span></div><div class="fact"><b>ON DELETE</b><span>${esc(r.onDelete || 'NO ACTION (por omisión)')}</span></div><div class="fact"><b>ON UPDATE</b><span>${esc(r.onUpdate || 'NO ACTION (por omisión)')}</span></div></div>
      ${r.rationale ? `<div class="note warn">${esc(r.rationale)}</div>` : ''}
      ${r.definition ? `<div class="sect-title">DDL original</div><pre class="codeblock">${esc(r.definition)}</pre>` : ''}
      <div class="row" style="margin-top:12px"><button class="btn sm" onclick="showContext('relacion','${esc(r.id)}')">Contexto</button><button class="btn sm" onclick="go('relaciones',{q:'${esc(r.fromTable)}'})">Explorador</button></div>`;
      return;
    }
  }
  if (!EER.selected) {
    host.innerHTML = `<div class="eyebrow">Panel contextual</div><h3>Modelo EER</h3><p class="sub">Selecciona una entidad o una relación para ver su información. El resaltado muestra únicamente las conexiones directas.</p>
    <div class="facts"><div class="fact"><b>Entidades</b><span>${DB.tables.length}</span></div><div class="fact"><b>Relaciones</b><span>${DB.relations.length}</span></div><div class="fact"><b>Modo actual</b><span>${cap(EER.mode)}</span></div><div class="fact"><b>Ocultas</b><span>${EER.hidden.size}</span></div></div>
    <div class="sect-title">Dominios modelados</div>${[...new Set(Object.values(EER_GROUP_OF))].map(g => `<span class="pill">${esc(g)} · ${EER_GROUPS.find(x => x[0] === g)[1].length}</span>`).join(' ')}
    <div class="note">Las conexiones punteadas son relaciones <b>inferidas</b> por convención de nombres; las sólidas corresponden a FOREIGN KEY declaradas en el DDL.</div>`;
    return;
  }
  const t = tableByName(EER.selected), rels = relsByTable(t.name), info = TABLE_INFO[t.name] || [];
  host.innerHTML = `<div class="eyebrow">${esc(EER_GROUP_OF[t.name] || 'General')}</div><h3>${esc(t.name)}</h3><div class="sub">${esc(info[0] || '')}</div><p class="tiny muted">${esc(info[1] || '')}</p>
  <div class="facts"><div class="fact"><b>Columnas</b><span>${t.columns.length}</span></div><div class="fact"><b>Registros (respaldo)</b><span>${fmt(rowOf(t.name))}</span></div><div class="fact"><b>PK</b><span class="mono">${esc(t.primaryKey.join(', '))}</span></div><div class="fact"><b>FK / CHECK / índices</b><span>${t.foreignKeys.length} / ${t.checks.length} / ${t.indexes.length}</span></div></div>
  <div class="sect-title">Conexiones directas (${rels.length})</div>
  ${rels.map(r => `<div class="rel-item" data-r="${esc(r.id)}"><b>${r.fromTable === t.name ? '→ ' + esc(r.toTable) : '← ' + esc(r.fromTable)}</b><span class="badge ${r.evidence === 'confirmada' ? 'ok' : 'inf'}">${esc(r.evidence)}</span> · ${esc(r.fromColumns.join(', '))} <span class="muted">→</span> ${esc(r.toColumns.join(', '))}</div>`).join('') || '<p class="tiny muted">Sin conexiones declaradas.</p>'}
  <div class="sect-title">Accesos</div><div class="row"><button class="btn sm" onclick="go('diccionario',{table:'${esc(t.name)}'})">Diccionario</button><button class="btn sm" onclick="go('triggers',{q:'${esc(t.name)}'})">Triggers (${trigByTable(t.name).length})</button><button class="btn sm" onclick="go('vistas',{q:'${esc(t.name)}'})">Vistas (${viewsByTable(t.name).length})</button></div>`;
  $$('#eerSide [data-r]').forEach(el => el.addEventListener('click', () => eerSelectRelation(el.dataset.r)));
}
function eerSetMode(mode) {
  EER.mode = mode; store.set('eerMode', mode);
  $$('#eerMode button').forEach(b => b.classList.toggle('on', b.dataset.mode === mode));
  eerBuildEntities();
  if (mode === 'enfocado' && !EER.selected) { toast('Selecciona una entidad para activar el modo enfocado'); }
  requestAnimationFrame(eerFit);
}
function eerFit() {
  const vis = DB.tables.filter(t => eerVisible(t.name));
  if (!vis.length) return;
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  vis.forEach(t => { const p = EER.pos[t.name] || { x: 0, y: 0 }; minX = Math.min(minX, p.x); minY = Math.min(minY, p.y); maxX = Math.max(maxX, p.x + EW); maxY = Math.max(maxY, p.y + eerNodeHeight(t)); });
  const c = $('#eerCanvas'), cw = c.clientWidth - 36, ch = c.clientHeight - 100;
  if (cw <= 0 || ch <= 0) return;
  EER.scale = Math.min(1.35, Math.max(.28, Math.min(cw / (maxX - minX), ch / (maxY - minY))));
  EER.tx = 18 - minX * EER.scale + Math.max(0, (cw - (maxX - minX) * EER.scale) / 2);
  EER.ty = 62 - minY * EER.scale;
  eerApplyTransform();
}
function eerAuto() {
  EER.pos = eerDefaultPositions(); store.set('eerPos', EER.pos);
  eerBuildEntities(); eerFit(); toast('Entidades reorganizadas por dominio');
}
function eerZoom(factor) {
  const c = $('#eerCanvas');
  const px = c.clientWidth / 2, py = c.clientHeight / 2;
  const wx = (px - EER.tx) / EER.scale, wy = (py - EER.ty) / EER.scale;
  EER.scale = Math.max(.28, Math.min(2.4, EER.scale * factor));
  EER.tx = px - wx * EER.scale; EER.ty = py - wy * EER.scale;
  eerApplyTransform();
}
function eerExport(kind) {
  const vis = DB.tables.filter(t => eerVisible(t.name));
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  vis.forEach(t => { const p = EER.pos[t.name] || { x: 0, y: 0 }; minX = Math.min(minX, p.x - 20); minY = Math.min(minY, p.y - 20); maxX = Math.max(maxX, p.x + EW + 20); maxY = Math.max(maxY, p.y + eerNodeHeight(t) + 20); });
  const W = maxX - minX, H = maxY - minY;
  let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="${minX} ${minY} ${W} ${H}"><style>text{font-family:Consolas,monospace}.box{fill:#fff;stroke:#334155;stroke-width:1.5;rx:10}.head{fill:#12315a}.edge{fill:none;stroke:#64748b;stroke-width:1.5}.inferred{stroke-dasharray:7 5}.crow{fill:none;stroke:#64748b;stroke-width:1.5}.pk{fill:#b45309}.fk{fill:#1d4ed8}</style><rect x="${minX}" y="${minY}" width="${W}" height="${H}" fill="#f8fafc"/>`;
  DB.relations.forEach(r => {
    if (EER.hidden.has(r.fromTable) || EER.hidden.has(r.toTable) || !eerVisible(r.fromTable) || !eerVisible(r.toTable)) return;
    const g = eerEdgePath(r); if (!g) return;
    svg += `<path class="edge ${r.evidence === 'inferida' ? 'inferred' : ''}" d="${g.d}"/><path class="crow" d="${crowPath(g.x1, g.y1, g.ux, g.uy)}"/><path class="crow" d="${barPath(g.x2, g.y2, g.ux, g.uy)}"/>`;
  });
  vis.forEach(t => {
    const p = EER.pos[t.name] || { x: 0, y: 0 }, h = eerNodeHeight(t);
    svg += `<rect class="box" x="${p.x}" y="${p.y}" width="${EW}" height="${h}" rx="10"/><path class="head" d="M${p.x + 10} ${p.y} H${p.x + EW - 10} Q${p.x + EW} ${p.y} ${p.x + EW} ${p.y + 10} V${p.y + 28} H${p.x} V${p.y + 10} Q${p.x} ${p.y} ${p.x + 10} ${p.y}Z"/>`;
    svg += `<text x="${p.x + 9}" y="${p.y + 18}" font-size="11" fill="#ffffff" font-weight="700">${esc(t.name.slice(0, 27))}</text>`;
    if (EER.mode !== 'simplificado') {
      svg += `<text x="${p.x + 9}" y="${p.y + 44}" font-size="9" fill="#475569">${t.columns.length} columnas · ${fmt(rowOf(t.name))} reg.</text>`;
      const cols = eerFieldColumns(t);
      cols.forEach((c, i) => {
        const isPk = t.primaryKey.includes(c.name), isFk = t.foreignKeys.some(f => f.columns.includes(c.name));
        const label = `${isPk ? '◆ ' : isFk ? '◇ ' : '· '}${esc(c.name.slice(0, 23))}${EER.mode === 'detallado' ? '  ' + esc(c.type.replace(/\(.*\)/, '').slice(0, 12)) : ''}`;
        svg += `<text x="${p.x + 9}" y="${p.y + 62 + i * 17}" font-size="9" class="${isPk ? 'pk' : isFk ? 'fk' : ''}" fill="${isPk ? '#b45309' : isFk ? '#1d4ed8' : '#0f172a'}">${label}</text>`;
      });
      if (EER.showFields && EER.collapsed.has(t.name)) svg += `<text x="${p.x + 9}" y="${p.y + 62}" font-size="9" fill="#64748b">+ ${t.columns.length} campos (contraídos en el lienzo)</text>`;
    }
  });
  svg += '</svg>';
  const blob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href = url; a.download = 'modelo_eer_' + DB.meta.database + '.svg';
  if (kind === 'svg') { a.click(); setTimeout(() => URL.revokeObjectURL(url), 5000); toast('SVG exportado'); return; }
  const img = new Image();
  img.onload = () => {
    const canvas = document.createElement('canvas'); canvas.width = Math.min(W * 2, 8000); canvas.height = Math.min(H * 2, 8000);
    const ctx = canvas.getContext('2d'); ctx.scale(canvas.width / W, canvas.height / H);
    ctx.drawImage(img, 0, 0);
    canvas.toBlob(b => { const u = URL.createObjectURL(b); const link = document.createElement('a'); link.href = u; link.download = 'modelo_eer_' + DB.meta.database + '.png'; link.click(); setTimeout(() => URL.revokeObjectURL(u), 5000); toast('PNG exportado'); }, 'image/png');
  };
  img.onerror = () => toast('No se pudo generar el PNG; usa la exportación SVG');
  img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
}
function eerHiddenModal() {
  openModal(`<div class="row"><h3 style="margin:0">Mostrar / ocultar entidades</h3><button class="iconbtn close" style="margin-left:auto;background:var(--surface2);color:var(--text);border-color:var(--border)" onclick="closeModal()">${ico('close')}</button></div>
  <div class="grid g3" style="margin-top:14px">${DB.tables.map(t => `<label class="row" style="gap:7px;font-size:11px"><input type="checkbox" data-h="${esc(t.name)}" ${EER.hidden.has(t.name) ? '' : 'checked'}> <span class="mono">${esc(t.name)}</span></label>`).join('')}</div>
  <div class="row" style="margin-top:16px"><button class="btn primary" id="eerViewApply">Aplicar</button><button class="btn" onclick="$$('[data-h]').forEach(x=>x.checked=true)">Mostrar todas</button><button class="btn" onclick="$$('[data-h]').forEach(x=>x.checked=false)">Ocultar todas</button></div>`);
  $('#eerViewApply').addEventListener('click', () => {
    EER.hidden = new Set($$('[data-h]').filter(x => !x.checked).map(x => x.dataset.h));
    store.set('eerHidden', [...EER.hidden]); closeModal(); eerUpdateAll(); eerFit();
  });
}
function eerRelModal() {
  openModal(`<div class="row"><h3 style="margin:0">Filtrar relaciones</h3><button class="iconbtn close" style="margin-left:auto;background:var(--surface2);color:var(--text);border-color:var(--border)" onclick="closeModal()">${ico('close')}</button></div>
  <div class="grid g2" style="margin-top:14px">${[['all', 'Todas las relaciones'], ['confirmada', 'Solo FK confirmadas'], ['inferida', 'Solo inferidas']].map(o => `<button class="btn ${EER.relFilter === o[0] ? 'on' : ''}" data-f="${o[0]}">${o[1]}</button>`).join('')}</div>`);
  $$('[data-f]').forEach(b => b.addEventListener('click', () => { EER.relFilter = b.dataset.f; closeModal(); eerRenderEdges(); toast('Filtro de relaciones aplicado'); }));
}
function eerSyncFieldBtn() {
  const b = $('#eerFields'); if (!b) return;
  b.classList.toggle('on', EER.showFields);
  b.innerHTML = `<svg class="icon sm"><use href="#i-grid"/></svg> Campos: ${EER.showFields ? 'todos' : 'ocultos'}`;
}
function initEer() {
  if (!Object.keys(EER.pos).length || DB.tables.some(t => !EER.pos[t.name])) { EER.pos = eerDefaultPositions(); store.set('eerPos', EER.pos); }
  $$('#eerMode button').forEach(b => b.classList.toggle('on', b.dataset.mode === EER.mode));
  eerBuildEntities();
  eerApplyTransform();
  requestAnimationFrame(eerFit);
  window.__eerReady = true;
  window.__eerFit = eerFit;
  window.__eerRender = () => { eerBuildEntities(); eerApplyTransform(); };
  const canvas = $('#eerCanvas');
  canvas.addEventListener('pointerdown', e => {
    if (e.target.closest('[data-ent]') || e.target.closest('.eer-tools')) return;
    EER.panning = { sx: e.clientX, sy: e.clientY, tx: EER.tx, ty: EER.ty };
    canvas.classList.add('grabbing');
  });
  window.addEventListener('pointermove', e => {
    if (!EER.panning) return;
    EER.tx = EER.panning.tx + e.clientX - EER.panning.sx;
    EER.ty = EER.panning.ty + e.clientY - EER.panning.sy;
    eerApplyTransform();
  });
  window.addEventListener('pointerup', () => { EER.panning = null; canvas.classList.remove('grabbing'); });
  canvas.addEventListener('wheel', e => {
    e.preventDefault();
    const rect = canvas.getBoundingClientRect();
    const px = e.clientX - rect.left, py = e.clientY - rect.top;
    const wx = (px - EER.tx) / EER.scale, wy = (py - EER.ty) / EER.scale;
    EER.scale = Math.max(.28, Math.min(2.4, EER.scale * (e.deltaY < 0 ? 1.12 : 1 / 1.12)));
    EER.tx = px - wx * EER.scale; EER.ty = py - wy * EER.scale;
    eerApplyTransform();
  }, { passive: false });
  $('#eerZoomIn').addEventListener('click', () => eerZoom(1.2));
  $('#eerZoomOut').addEventListener('click', () => eerZoom(1 / 1.2));
  $('#eerFit').addEventListener('click', eerFit);
  $('#eerAuto').addEventListener('click', eerAuto);
  $('#eerReset').addEventListener('click', () => {
    EER.selected = null; EER.selectedRel = null; EER.hidden.clear(); EER.relFilter = 'all';
    EER.collapsed.clear(); EER.showFields = true; store.set('eerShowFields', true); eerSyncFieldBtn();
    eerAuto(); eerUpdateAll(); toast('Posiciones y campos restablecidos');
  });
  $('#eerFull').addEventListener('click', () => {
    if (document.fullscreenElement) document.exitFullscreen();
    else if (canvas.requestFullscreen) canvas.requestFullscreen().then(eerFit).catch(() => toast('Pantalla completa no disponible'));
    else toast('Pantalla completa no disponible en este navegador');
  });
  $('#eerExportSvg').addEventListener('click', () => eerExport('svg'));
  $('#eerExportPng').addEventListener('click', () => eerExport('png'));
  $('#eerToggleHidden').addEventListener('click', eerHiddenModal);
  $('#eerRelFilter').addEventListener('click', eerRelModal);
  eerSyncFieldBtn();
  $('#eerFields').addEventListener('click', () => {
    EER.showFields = !EER.showFields;
    store.set('eerShowFields', EER.showFields);
    EER.collapsed.clear();
    eerSyncFieldBtn(); eerBuildEntities(); eerFit();
    toast(EER.showFields ? 'Campos: todos los atributos visibles' : 'Campos ocultos en el modelo');
  });
  $$('#eerMode button').forEach(b => b.addEventListener('click', () => eerSetMode(b.dataset.mode)));
  $('#eerSearch').addEventListener('input', e => {
    const q = e.target.value.trim().toLowerCase();
    const match = t => t.name.toLowerCase().includes(q) || t.columns.some(c => c.name.toLowerCase().includes(q));
    DB.tables.forEach(t => {
      const el = EER.nodes[t.name]; if (!el) return;
      el.style.opacity = (!eerVisible(t.name) || !q || match(t)) ? '' : '.25';
    });
    if (q) {
      const hit = DB.tables.find(t => match(t) && eerVisible(t.name));
      if (hit) { const p = EER.pos[hit.name]; EER.tx = $('#eerCanvas').clientWidth / 2 - (p.x + EW / 2) * EER.scale; EER.ty = $('#eerCanvas').clientHeight / 2 - p.y * EER.scale; eerApplyTransform(); }
    }
  });
  $('#eerHint').innerHTML = `<b>Interacción:</b> arrastra desde la cabecera de cada entidad; rueda del mouse para acercar/alejar; arrastra el fondo para desplazar. Cada entidad muestra <b>todas sus columnas reales</b>; el botón <b>Campos</b> las oculta o restaura globalmente y el signo ± de la cabecera contrae una entidad puntual. El buscador localiza tablas y también nombres de columnas. La selección resalta las relaciones directas y atenúa el resto. <b>Reorganizar</b> agrupa por dominio; <b>Restablecer</b> vuelve al estado inicial sin filtros.`;
  if (window.__eerPendingFocus) { const f = window.__eerPendingFocus; window.__eerPendingFocus = null; setTimeout(() => { EER.selected = f; eerUpdateAll(); }, 50); }
}
