/* Analysis utility only. Reads the SQL backup read-only; writes schema.json inside diagrama/. */
const fs = require('fs');
const path = require('path');

const SQL_PATH = path.resolve('C:/Users/Yazmin Ariana/OneDrive/Documentos/CUATRIMESTRE 7/Optativa I. Bases De Datos En La Nube/7A-IDGDS/Practicas_BDN_240235/Practica04/backups/Respaldo_1911.sql');
const OUT = path.join(__dirname, 'schema.json');
const src = fs.readFileSync(SQL_PATH, 'utf8');

/* ---------- statement splitter with delimiter, quote and comment handling ---------- */
function splitStatements(sql) {
  const stmts = [];
  let buf = '', delim = ';', i = 0, line = 1;
  const push = () => { const t = buf.trim(); if (t) stmts.push({ sql: t, line }); buf = ''; };
  while (i < sql.length) {
    const c = sql[i], n = sql[i + 1];
    // line comments
    if ((c === '-' && n === '-' && (sql[i + 2] === ' ' || sql[i + 2] === '\t' || sql[i + 2] === '\n')) || c === '#') {
      while (i < sql.length && sql[i] !== '\n') i++;
      continue;
    }
    // DELIMITER directive (must start a line)
    if (/^DELIMITER\s+(\S+)/i.test(sql.slice(i))) {
      const m = /^DELIMITER[ \t]+(\S+)/i.exec(sql.slice(i));
      delim = m[1]; i += m[0].length; continue;
    }
    // block comments; executable /*! ... */ kept, wrapper stripped
    if (c === '/' && n === '*') {
      const executable = sql[i + 2] === '!';
      let j = i + 2;
      if (executable) { while (/\d/.test(sql[j])) j++; if (sql[j] === '<') { while (sql[j] && sql[j] !== '>') j++; j++; } }
      let end = sql.indexOf('*/', j);
      if (end === -1) end = sql.length;
      if (executable) buf += sql.slice(j, end);
      const chunk = sql.slice(i, Math.min(end + 2, sql.length));
      line += (chunk.match(/\n/g) || []).length;
      i = Math.min(end + 2, sql.length);
      continue;
    }
    // quoted strings / identifiers
    if (c === "'" || c === '"' || c === '`') {
      const q = c; buf += c; i++;
      while (i < sql.length) {
        if (sql[i] === '\\' && i + 1 < sql.length) { buf += sql[i] + sql[i + 1]; i += 2; continue; }
        if (sql[i] === q) {
          if (sql[i + 1] === q) { buf += q + q; i += 2; continue; }
          buf += q; i++; break;
        }
        if (sql[i] === '\n') line++;
        buf += sql[i++];
      }
      continue;
    }
    if (sql.startsWith(delim, i)) { push(); i += delim.length; continue; }
    if (c === '\n') line++;
    buf += c; i++;
  }
  push();
  return stmts;
}

/* ---------- helpers ---------- */
const unq = s => s.replace(/^`|`$/g, '').replace(/^"|"$/g, '');
function splitTop(s, sep = ',') {
  const out = []; let depth = 0, q = null, cur = '', i = 0;
  while (i < s.length) {
    const c = s[i];
    if (q) { cur += c; if (c === '\\' && i + 1 < s.length) { cur += s[++i]; } else if (c === q) { if (s[i + 1] === q) { cur += s[++i]; } else q = null; } i++; continue; }
    if (c === "'" || c === '"' || c === '`') { q = c; cur += c; i++; continue; }
    if (c === '(') depth++;
    if (c === ')') depth--;
    if (c === sep && depth === 0) { out.push(cur.trim()); cur = ''; i++; continue; }
    cur += c; i++;
  }
  if (cur.trim()) out.push(cur.trim());
  return out;
}
function parenContent(s, start) {
  let depth = 0, q = null;
  for (let i = start; i < s.length; i++) {
    const c = s[i];
    if (q) { if (c === '\\') i++; else if (c === q) { if (s[i + 1] === q) i++; else q = null; } continue; }
    if (c === "'" || c === '"' || c === '`') { q = c; continue; }
    if (c === '(') depth++;
    if (c === ')') { depth--; if (depth === 0) return { content: s.slice(start + 1, i), end: i }; }
  }
  return { content: s.slice(start + 1), end: s.length - 1 };
}
const colList = s => splitTop(s).map(x => unq(x.trim().replace(/^\(/, '').replace(/\)$/, '').trim())).filter(Boolean);

const TYPE_STOP = /\b(NOT|NULL|DEFAULT|AUTO_INCREMENT|PRIMARY|UNIQUE|KEY|COMMENT|COLLATE|CHARACTER|GENERATED|ON|REFERENCES|CHECK|INVISIBLE|SRID|COLUMN_FORMAT|STORAGE|AS|VIRTUAL|STATED)\b/i;
function parseColumn(def) {
  const m = /^`([^`]+)`\s+([\s\S]*)$/.exec(def.trim());
  if (!m) return null;
  const name = m[1], rest = m[2].trim();
  // type ends at first top-level stop keyword (skip those inside ENUM/SET parens)
  let depth = 0, q = null, typeEnd = rest.length;
  for (let i = 0; i < rest.length; i++) {
    const c = rest[i];
    if (q) { if (c === '\\') i++; else if (c === q) q = null; continue; }
    if (c === "'" || c === '"') { q = c; continue; }
    if (c === '(') depth++;
    if (c === ')') depth--;
    if (depth === 0 && i > 0 && /\s/.test(rest[i - 1])) {
      const tail = rest.slice(i);
      const km = TYPE_STOP.exec(tail);
      if (km && km.index === 0) { typeEnd = i; break; }
    }
  }
  let type = rest.slice(0, typeEnd).trim();
  const attrs = rest.slice(typeEnd).trim();
  const signed = /\bunsigned\b/i.test(type);
  const baseType = type.replace(/\([\s\S]*?\)/, '').trim().toLowerCase();
  const lenM = /\(([^)]*)\)/.exec(type);
  let length = null, precision = null, scale = null, values = null;
  if (lenM) {
    const inside = lenM[1];
    if (/^\d+\s*,\s*\d+$/.test(inside)) { [precision, scale] = inside.split(',').map(x => +x.trim()); }
    else if (/^[\d\s]+$/.test(inside)) { length = +inside.trim(); }
    else if (/^'/.test(inside.trim()) || /\bchar\b|\benum\b|\bset\b/i.test(baseType)) values = splitTop(inside).map(x => x.trim().replace(/^'(.*)'$/, '$1').replace(/''/g, "'"));
  }
  return {
    name,
    ordinal: 0,
    type,
    baseType,
    length,
    precision,
    scale,
    unsigned: signed,
    enumValues: (baseType === 'enum' || baseType === 'set') ? (values || []) : null,
    nullable: !/\bNOT\s+NULL\b/i.test(attrs) && !/\bPRIMARY\s+KEY\b/i.test(attrs),
    notNull: /\bNOT\s+NULL\b/i.test(attrs),
    autoIncrement: /\bAUTO_INCREMENT\b/i.test(attrs),
    unique: /\bUNIQUE\b/i.test(attrs),
    pk: /\bPRIMARY\s+KEY\b/i.test(attrs),
    default: (/\bDEFAULT\s+([^\s]+(?:\s+CURRENT_TIMESTAMP(?:\(\))?)?)/i.exec(attrs) || [])[1] || null,
    onUpdate: /\bON\s+UPDATE\s+CURRENT_TIMESTAMP/i.test(attrs),
    generated: (/\bGENERATED\s+ALWAYS\s+AS\s*\(([\s\S]*?)\)/i.exec(attrs) || [])[1] || null,
    columnCheck: (/\bCHECK\s*\(([\s\S]*?)\)/i.exec(attrs) || [])[1] || null,
    comment: (/\bCOMMENT\s+'((?:[^']|'')*)'/i.exec(attrs) || [])[1] || null,
    definition: def.replace(/\s+/g, ' ').trim()
  };
}

function parseTable(stmt) {
  const nameM = /^CREATE\s+TABLE\s+(?:IF\s+NOT\s+EXISTS\s+)?`?([A-Za-z0-9_$]+)`?/i.exec(stmt.sql);
  if (!nameM) return null;
  const name = nameM[1];
  const open = stmt.sql.indexOf('(', nameM[0].length);
  const close = stmt.sql.lastIndexOf(')');
  const body = stmt.sql.slice(open + 1, close);
  const parts = splitTop(body);
  const table = {
    name, line: stmt.line, columns: [], primaryKey: [], foreignKeys: [],
    uniqueKeys: [], indexes: [], checks: [], tableConstraints: [],
    engine: (/\bENGINE\s*=\s*([A-Za-z0-9_]+)/i.exec(stmt.sql) || [])[1] || null,
    charset: (/\bDEFAULT\s+CHARSET\s*=\s*([A-Za-z0-9_]+)/i.exec(stmt.sql) || [])[1] || null,
    collation: (/\bCOLLATE\s*=\s*([A-Za-z0-9_]+)/i.exec(stmt.sql) || [])[1] || null,
    autoIncrementStart: (/\bAUTO_INCREMENT\s*=\s*(\d+)/i.exec(stmt.sql) || [])[1] || null
  };
  for (const p of parts) {
    if (/^PRIMARY\s+KEY/i.test(p)) {
      const c = parenContent(p, p.indexOf('('));
      table.primaryKey = colList(c.content);
      const nm = /^PRIMARY\s+KEY\s*`?([^`\s(]+)`?/i.exec(p);
      if (nm && nm[1]) table.indexes.push({ name: 'PRIMARY', columns: table.primaryKey, unique: true, type: 'PRIMARY' });
      continue;
    }
    let fm = /^(?:CONSTRAINT\s+`?([^`\s]+)`?\s+)?FOREIGN\s+KEY\s*(?:`?([^`\s(]+)`?\s*)?\(([^)]*)\)\s*REFERENCES\s+`?([A-Za-z0-9_$]+)`?\s*\(([^)]*)\)([\s\S]*)$/i.exec(p);
    if (fm) {
      const refPart = fm[6] || '';
      table.foreignKeys.push({
        name: fm[1] || null, columns: colList(fm[3]), refTable: fm[4], refColumns: colList(fm[5]),
        onDelete: (/\bON\s+DELETE\s+(RESTRICT|CASCADE|SET\s+NULL|NO\s+ACTION|SET\s+DEFAULT)/i.exec(refPart) || [])[1]?.replace(/\s+/g, ' ') || null,
        onUpdate: (/\bON\s+UPDATE\s+(RESTRICT|CASCADE|SET\s+NULL|NO\s+ACTION|SET\s+DEFAULT)/i.exec(refPart) || [])[1]?.replace(/\s+/g, ' ') || null,
        definition: p.replace(/\s+/g, ' ').trim()
      });
      continue;
    }
    let cm = /^(?:CONSTRAINT\s+`?([^`\s]+)`?\s+)?CHECK\s*\(([\s\S]*)\)$/i.exec(p);
    if (cm) { table.checks.push({ name: cm[1] || null, expression: cm[2].trim(), definition: p.replace(/\s+/g, ' ').trim() }); continue; }
    let um = /^(?:CONSTRAINT\s+`?([^`\s]+)`?\s+)?UNIQUE\s+(?:KEY|INDEX)\s*`?([^`\s(]*)`?\s*\(([^)]*)\)/i.exec(p);
    if (um) { table.uniqueKeys.push({ name: um[1] || um[2] || null, columns: colList(um[3]), definition: p.replace(/\s+/g, ' ').trim() }); table.indexes.push({ name: um[1] || um[2] || null, columns: colList(um[3]), unique: true, type: 'UNIQUE' }); continue; }
    let km = /^(UNIQUE\s+)?(?:KEY|INDEX)\s+`?([^`\s(]*)`?\s*\(([^)]*)\)/i.exec(p);
    if (km) { table.indexes.push({ name: km[2] || null, columns: colList(km[3]), unique: !!km[1], type: km[1] ? 'UNIQUE' : 'INDEX' }); continue; }
    const col = parseColumn(p);
    if (col) table.columns.push(col);
  }
  table.columns.forEach((c, i) => c.ordinal = i + 1);
  // column-level PK/FK hints
  table.columns.forEach(c => {
    if (c.pk && !table.primaryKey.includes(c.name)) table.primaryKey.push(c.name);
  });
  return table;
}

function countInsertRows(stmt) {
  const m = /^INSERT\s+(?:LOW_PRIORITY\s+|DELAYED\s+|HIGH_PRIORITY\s+|IGNORE\s+)*INTO\s+`?([A-Za-z0-9_$]+)`?/i.exec(stmt.sql);
  if (!m) return null;
  const table = m[1];
  const vi = /\bVALUES\b/i.exec(stmt.sql);
  if (!vi) return { table, rows: 0, mode: 'insert-select', sql: stmt.sql };
  let i = vi.index + vi[0].length, rows = 0, q = null, depth = 0;
  while (i < stmt.sql.length) {
    const c = stmt.sql[i];
    if (q) { if (c === '\\') i += 2; else if (c === q) { if (stmt.sql[i + 1] === q) i += 2; else { q = null; i++; } } else i++; continue; }
    if (c === "'" || c === '"' || c === '`') { q = c; i++; continue; }
    if (c === '(') {
      if (depth === 0) rows++;
      depth++; i++; continue;
    }
    if (c === ')') { depth--; i++; continue; }
    i++;
  }
  return { table, rows, mode: 'values', sql: stmt.sql.slice(0, 220) };
}

function extractTablesFromSql(sql, knownTables, knownViews) {
  const found = new Set();
  const re = /\b(?:from|join|into|update)\s+((?:`?[A-Za-z0-9_$]+`?\s*\.\s*)?`?[A-Za-z0-9_$]+`?)/gi;
  let m;
  while ((m = re.exec(sql))) {
    const raw = m[1].replace(/`/g, '').replace(/\s+/g, '');
    const parts = raw.split('.');
    const nm = parts.pop();
    if (/^(select|dual|values|lateral|json_table)$/i.test(nm)) continue;
    found.add(parts.length ? parts[parts.length - 1] + '.' + nm : nm);
  }
  const external = [...found].filter(n => n.includes('.') || /^mysql_|^information_schema|^performance_schema/.test(n));
  return {
    tables: [...found].filter(n => knownTables.has(n)),
    views: [...found].filter(n => knownViews.has(n)),
    other: [...found].filter(n => !knownTables.has(n) && !knownViews.has(n))
  };
}

/* ---------- parse all statements ---------- */
const stmts = splitStatements(src);
const tables = [], triggers = [], views = [], procedures = [], functions = [], inserts = [];
const alterCandidates = [], otherStatements = [];
for (const s of stmts) {
  const t = s.sql.trim();
  if (/^CREATE\s+TABLE\b/i.test(t)) { const x = parseTable(s); if (x) tables.push(x); continue; }
  if (/^INSERT\b/i.test(t)) { const x = countInsertRows(s); if (x) inserts.push({ ...x, line: s.line }); continue; }
  if (/^REPLACE\b/i.test(t)) { const x = countInsertRows(s.replace(/^REPLACE/i, 'INSERT')); if (x) inserts.push({ ...x, line: s.line, mode: 'replace' }); continue; }
  if (/\bTRIGGER\s+`?[A-Za-z0-9_$]+`?/i.test(t) && /\b(CREATE|TRIGGER)\b/i.test(t)) { triggers.push({ sql: t, line: s.line }); continue; }
  if (/\bVIEW\s+`?[A-Za-z0-9_$]+`?\s+AS\b/i.test(t)) { views.push({ sql: t, line: s.line }); continue; }
  if (/\bCREATE\s+(?:DEFINER\s*=\s*\S+\s+)?(?:AGGREGATE\s+)?PROCEDURE\b/i.test(t)) { procedures.push({ sql: t, line: s.line }); continue; }
  if (/\bCREATE\s+(?:DEFINER\s*=\s*\S+\s+)?FUNCTION\b/i.test(t)) { functions.push({ sql: t, line: s.line }); continue; }
  if (/^ALTER\s+TABLE\b/i.test(t)) { alterCandidates.push({ sql: t, line: s.line }); continue; }
  if (/^CREATE\s+(?:UNIQUE\s+)?INDEX\b/i.test(t)) { alterCandidates.push({ sql: t, line: s.line }); continue; }
  otherStatements.push(t.slice(0, 120));
}

/* dedupe views: keep final (longest) definition per name */
const viewMap = new Map();
for (const v of views) {
  const m = /\bVIEW\s+`?([A-Za-z0-9_$]+)`?\s+AS\b/i.exec(v.sql);
  if (!m) continue;
  const nm = m[1];
  if (!viewMap.has(nm) || v.sql.length > viewMap.get(nm).sql.length) viewMap.set(nm, v);
}
const tableNames = new Set(tables.map(t => t.name));
const allViewNames = new Set([...viewMap.keys()]);

/* triggers normalized */
const triggerDocs = triggers.map(t => {
  const m = /\bTRIGGER\s+`?([A-Za-z0-9_$]+)`?\s+(BEFORE|AFTER)\s+(INSERT|UPDATE|DELETE)\s+ON\s+`?([A-Za-z0-9_$]+)`?/i.exec(t.sql);
  if (!m) return { name: 'UNPARSED@' + t.line, raw: t.sql, line: t.line };
  const cleanSql = t.sql.replace(/!\d{5}\s*/g, '').replace(/DEFINER=`[^`]+`@`[^`]+`\s*/i, '').trim();
  const bodyStart = /\bFOR\s+EACH\s+ROW\b/i.exec(cleanSql);
  const body = bodyStart ? cleanSql.slice(bodyStart.index + bodyStart[0].length) : cleanSql;
  const deps = extractTablesFromSql(body, tableNames, allViewNames);
  const ops = [...new Set((body.match(/\b(INSERT|UPDATE|DELETE|SELECT)\b/gi) || []).map(x => x.toUpperCase()))];
  const conditions = [];
  if (/\bIF\s*\(/.test(body)) conditions.push('IF condicional');
  if (/\bCASE\b/.test(body)) conditions.push('CASE');
  if (/\bWHERE\b/.test(body)) conditions.push('WHERE');
  if (/NEW\./.test(body)) conditions.push('NEW.*');
  if (/OLD\./.test(body)) conditions.push('OLD.*');
  if (/\bSIGNAL\b/.test(body)) conditions.push('SIGNAL (raise error)');
  if (/\bUSER\(\)/.test(body)) conditions.push('USER()');
  return {
    name: m[1], timing: m[2].toUpperCase(), event: m[3].toUpperCase(), table: m[4],
    sql: cleanSql, body: body.trim(), line: t.line,
    affectedTables: deps.tables, affectedViews: deps.views, otherRefs: deps.other,
    operations: ops, conditions, hasNew: /NEW\./.test(body), hasOld: /OLD\./.test(body),
    hasSignal: /\bSIGNAL\b/.test(body), statementCount: splitStatements(body.replace(/^\s*BEGIN/i, '').replace(/END\s*$/i, '')).length
  };
});

/* views normalized */
const viewDocs = [...viewMap.values()].map(v => {
  const m = /\bVIEW\s+`?([A-Za-z0-9_$]+)`?\s+AS\b/i.exec(v.sql);
  const name = m[1];
  const sql = v.sql.replace(/^[\s\S]*?\bVIEW\s+`?[A-Za-z0-9_$]+`?\s+AS\s*/i, '').trim();
  const deps = extractTablesFromSql(sql, tableNames, allViewNames);
  const aliases = [...sql.matchAll(/\bAS\s+`([^`]+)`/gi)].map(x => x[1]);
  const uniq = [...new Set(aliases)];
  const ctes = [...sql.matchAll(/\bWITH\s+RECURSIVE\s+`([^`]+)`|\b(?:,|WITH)\s+`([^`]+)`\s+AS\s*\(/gi)].map(x => x[1] || x[2]).filter(Boolean);
  const external = deps.other.filter(n => !ctes.includes(n));
  return {
    name, sql: 'CREATE VIEW `' + name + '` AS ' + sql, line: v.line,
    columns: uniq, tables: deps.tables, views: deps.views, external,
    isRecursive: /\bWITH\s+RECURSIVE\b/i.test(sql),
    hasAggregation: /\b(COUNT|SUM|AVG|MIN|MAX|GROUP_CONCAT)\s*\(/i.test(sql),
    hasGroupBy: /\bGROUP\s+BY\b/i.test(sql),
    hasJoins: /\bJOIN\b/i.test(sql),
    hasCase: /\bCASE\b/i.test(sql),
    hasSubquery: /\(\s*SELECT\b/i.test(sql),
    hasWindow: /\bOVER\s*\(/i.test(sql),
    security: (/\bSQL\s+SECURITY\s+(DEFINER|INVOKER)/i.exec(v.sql) || [])[1] || null,
    algorithm: (/\bALGORITHM\s*=\s*(\w+)/i.exec(v.sql) || [])[1] || null
  };
});

/* procedures / functions normalized */
const routineDocs = [...procedures.map(x => ({ ...x, kind: 'PROCEDURE' })), ...functions.map(x => ({ ...x, kind: 'FUNCTION' }))].map(r => {
  const m = new RegExp('\\b' + r.kind + '\\s+`?([A-Za-z0-9_$]+)`?').exec(r.sql);
  const name = m ? m[1] : 'unknown';
  const pm = /\(([\s\S]*?)\)\s*(?:BEGIN|RETURNS|DETERMINISTIC|NOT|SQL|READS|MODIFIES|CONTAINS)/i.exec(r.sql);
  return {
    name, kind: r.kind, line: r.line, sql: r.sql,
    params: pm ? splitTop(pm[1]).map(x => x.trim()) : [],
    returns: (/\bRETURNS\s+([A-Za-z0-9_() ]+)/i.exec(r.sql) || [])[1]?.trim() || null,
    deps: extractTablesFromSql(r.sql, tableNames, allViewNames)
  };
});

/* insert aggregation */
const byTable = new Map();
for (const ins of inserts) {
  if (!byTable.has(ins.table)) byTable.set(ins.table, { table: ins.table, rows: 0, statements: 0, modes: new Set(), lines: [] });
  const b = byTable.get(ins.table);
  b.rows += ins.rows; b.statements++; b.modes.add(ins.mode); b.lines.push(ins.line);
}
const rowCounts = Object.fromEntries([...byTable.values()].map(b => [b.table, {
  rows: b.rows, statements: b.statements, modes: [...b.modes], lines: b.lines,
  method: b.modes.size === 1 && b.modes.has('values') ? 'exacto-verificable' : 'calculado'
}]));

/* relations from FKs + inferred naming conventions */
const relations = [];
for (const t of tables) for (const fk of t.foreignKeys) {
  relations.push({
    id: 'fk_' + t.name + '_' + fk.columns.join('_') + '_' + fk.name,
    fromTable: t.name, fromColumns: fk.columns, toTable: fk.refTable, toColumns: fk.refColumns,
    name: fk.name, onDelete: fk.onDelete, onUpdate: fk.onUpdate,
    evidence: 'confirmada', kind: 'foreign-key', definition: fk.definition
  });
}
for (const t of tables) {
  const pkSet = new Set(t.primaryKey);
  for (const c of t.columns) {
    if (c.pk || c.foreignKeys) continue;
    const hasFk = t.foreignKeys.some(f => f.columns.includes(c.name));
    if (hasFk) continue;
    const m = /^(?:id_)?([A-Za-z0-9_]+?)_?id$|^([A-Za-z0-9_]+)Id$/i.exec(c.name);
    const cand = m ? (m[1] || m[2]) : null;
    if (!cand) continue;
    const targets = tables.filter(x => x.name.toLowerCase() === cand.toLowerCase() || x.name.toLowerCase() === 'tb_' + cand.toLowerCase() || x.name.toLowerCase() === cand.toLowerCase() + 's');
    if (targets.length !== 1) continue;
    const target = targets[0];
    if (target.name === t.name) continue;
    if (target.primaryKey.length === 1 && target.primaryKey[0].toLowerCase() !== c.name.toLowerCase()) {
      relations.push({
        id: 'inf_' + t.name + '_' + c.name + '_' + target.name,
        fromTable: t.name, fromColumns: [c.name], toTable: target.name, toColumns: target.primaryKey,
        name: null, onDelete: null, onUpdate: null,
        evidence: 'inferida', kind: 'convencion-nombre',
        rationale: 'Columna terminada en _ID/Id coincide con la PK de ' + target.name + '; sin CONSTRAINT FOREIGN KEY en el DDL.'
      });
    }
  }
}

/* sensitive columns (structural warning only - no data values are embedded) */
const sensitivePattern = /pass|hash|token|secret|email|correo|password|clave|dni|curp|telefono|phone|api_?key/i;
const sensitiveColumns = [];
for (const t of tables) for (const c of t.columns) if (sensitivePattern.test(c.name)) sensitiveColumns.push({ table: t.name, column: c.name });

/* conclusions */
const result = {
  meta: {
    database: (/^CREATE\s+DATABASE[^`]*`?([A-Za-z0-9_$]+)`?/i.exec(src) || [])[1] || null,
    sourceFile: path.basename(SQL_PATH),
    sourceSizeBytes: fs.statSync(SQL_PATH).size,
    serverVersion: (/--\s*Server version\s+([^\r\n]+)/i.exec(src) || [])[1]?.trim() || null,
    dumpHeader: (/--\s*MySQL dump[^\r\n]+/i.exec(src) || [])[0] || null,
    analysisDate: new Date().toISOString(),
    statementCount: stmts.length
  },
  tables, triggers: triggerDocs, views: viewDocs, routines: routineDocs,
  rowCounts, relations, sensitiveColumns,
  alterStatements: alterCandidates.map(x => x.sql.slice(0, 160)),
  validation: {
    expected: { tables: 25, triggers: 72, views: 28 },
    found: { tables: tables.length, triggers: triggerDocs.length, views: viewDocs.length },
    parseIssues: triggerDocs.filter(t => (t.name || '').startsWith('UNPARSED')).map(t => t.line)
  },
  stats: {
    columns: tables.reduce((a, t) => a + t.columns.length, 0),
    primaryKeys: tables.reduce((a, t) => a + t.primaryKey.length, 0),
    foreignKeys: tables.reduce((a, t) => a + t.foreignKeys.length, 0),
    indexes: tables.reduce((a, t) => a + t.indexes.length, 0),
    checks: tables.reduce((a, t) => a + t.checks.length, 0),
    rows: Object.values(rowCounts).reduce((a, x) => a + x.rows, 0),
    relations: relations.length,
    confirmedRelations: relations.filter(r => r.evidence === 'confirmada').length,
    inferredRelations: relations.filter(r => r.evidence === 'inferida').length
  }
};
fs.writeFileSync(OUT, JSON.stringify(result, null, 2), 'utf8');
console.log(JSON.stringify({
  meta: result.meta, validation: result.validation, stats: result.stats,
  tableNames: tables.map(t => t.name),
  rowCounts,
  triggerEvents: triggerDocs.reduce((a, t) => { const k = t.timing + '_' + t.event; a[k] = (a[k] || 0) + 1; return a; }, {}),
  viewNames: viewDocs.map(v => v.name),
  routines: routineDocs.map(r => r.name + ':' + r.kind),
  sensitiveColumns: sensitiveColumns.length,
  alterCount: alterCandidates.length,
  otherStatements: [...new Set(otherStatements.map(x => x.split(/\s+/).slice(0, 2).join(' ')))].slice(0, 30)
}, null, 2));
