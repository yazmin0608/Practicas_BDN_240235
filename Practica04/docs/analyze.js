/*
 * Analizador de respaldo MySQL 8.0 (solo lectura).
 * Genera dataset.json dentro de Practica04/docs para ser embebido en index.html.
 * No ejecuta SQL. RespETA delimitadores, comentarios, cadenas y comentarios ejecutables /*!...*\/.
 */
const fs = require('fs');
const path = require('path');

const SQL_PATH = 'C:\\Users\\Yazmin Ariana\\OneDrive\\Documentos\\CUATRIMESTRE 7\\Optativa I. Bases De Datos En La Nube\\7A-IDGDS\\Practicas_BDN_240235\\Practica04\\backups\\Respaldo_2111.sql';
const OUT = path.join(__dirname, 'dataset.json');
const sql = fs.readFileSync(SQL_PATH, 'utf8');

/* -------------------- 1. Escáner / segmentador -------------------- */
function splitStatements(src) {
  const stmts = [];
  let buf = '';
  let start = 0;
  let line = 1;
  let startLine = 1;
  let delimiter = ';';
  let lastComment = '';
  let i = 0;
  let iter = 0;
  const n = src.length;
  let firstNonSpace = 0;
  const setLine = (nlIdx) => {
    let j = nlIdx + 1;
    while (j < n && (src[j] === ' ' || src[j] === '\t' || src[j] === '\r')) j++;
    firstNonSpace = j;
  };
  while (i < n) {
    if (++iter > n * 20) { console.error('SCAN RUNAWAY at', i); break; }
    const c = src[i];
    if (c === '\n') { line++; buf += c; i++; setLine(i - 1); continue; }

    // DELIMITER directive (only at line start)
    if (i === firstNonSpace && (c === 'D' || c === 'd') && /^delimiter\s+/i.test(src.slice(i, i + 12))) {
      const m = /^delimiter[ \t]+(\S+)/i.exec(src.slice(i, i + 120));
      if (m) {
        delimiter = m[1];
        const nl = src.indexOf('\n', i);
        i = nl < 0 ? n : nl;
        continue;
      }
    }

    // Line comments
    if (c === '#' || (c === '-' && i + 2 < n && src[i + 1] === '-' && /\s/.test(src[i + 2]))) {
      const nl = src.indexOf('\n', i);
      const text = src.slice(i, nl < 0 ? n : nl);
      lastComment = text.trim();
      buf += ' ';
      i = nl < 0 ? n : nl;
      continue;
    }

    // Block comments / executable comments
    if (c === '/' && src[i + 1] === '*') {
      if (src[i + 2] === '!') {
        // MySQL executable comment: keep the SQL body, drop /*!NNNNN prefix and trailing */
        let j = i + 3;
        while (/\d/.test(src[j])) j++;
        while (/\s/.test(src[j])) j++;
        i = j;
        buf += ' ';
        continue;
      }
      const end = src.indexOf('*/', i + 2);
      const text = src.slice(i, end < 0 ? n : end + 2);
      if (/Temporary view structure/i.test(text)) lastComment = 'Temporary view structure';
      if (/Final view structure/i.test(text)) lastComment = 'Final view structure';
      buf += ' ';
      i = end < 0 ? n : end + 2;
      continue;
    }

    // String / identifier literals
    if (c === "'" || c === '"' || c === '`') {
      const quote = c;
      buf += c; i++;
      while (i < n) {
        const ch = src[i];
        if (ch === '\\' && quote !== '`') { buf += src.slice(i, i + 2); i += 2; continue; }
        if (ch === quote) {
          if (src[i + 1] === quote) { buf += quote + quote; i += 2; continue; }
          buf += quote; i++; break;
        }
        if (ch === '\n') line++;
        buf += ch; i++;
      }
      continue;
    }

    // Delimiter outside strings/comments
    if (delimiter.length === 1 ? c === delimiter : src.startsWith(delimiter, i)) {
      const text = buf.trim();
      if (text) stmts.push({ text, line: startLine, comment: lastComment });
      buf = ''; i += delimiter.length;
      while (i < n && /\s/.test(src[i])) { if (src[i] === '\n') { line++; setLine(i); } i++; }
      if (firstNonSpace < i) firstNonSpace = i;
      startLine = line;
      lastComment = '';
      continue;
    }

    if (buf.length === 0) startLine = line;
    buf += c; i++;
  }
  if (buf.trim()) stmts.push({ text: buf.trim(), line: startLine, comment: lastComment });
  return stmts;
}

/* -------------------- 2. Utilidades de análisis -------------------- */
function splitTopLevel(body, sep = ',') {
  const parts = [];
  let cur = '', depth = 0, quote = null;
  for (let i = 0; i < body.length; i++) {
    const c = body[i];
    if (quote) {
      cur += c;
      if (c === '\\') { cur += body[++i] || ''; continue; }
      if (c === quote) {
        if (body[i + 1] === quote) { cur += body[++i]; continue; }
        quote = null;
      }
      continue;
    }
    if (c === "'" || c === '"' || c === '`') { quote = c; cur += c; continue; }
    if (c === '(') depth++;
    if (c === ')') depth--;
    if (c === sep && depth === 0) { parts.push(cur.trim()); cur = ''; continue; }
    cur += c;
  }
  if (cur.trim()) parts.push(cur.trim());
  return parts;
}

function matchParen(text, openIdx) {
  let depth = 0, quote = null;
  for (let i = openIdx; i < text.length; i++) {
    const c = text[i];
    if (quote) {
      if (c === '\\') { i++; continue; }
      if (c === quote) {
        if (text[i + 1] === quote) { i++; continue; }
        quote = null;
      }
      continue;
    }
    if (c === "'" || c === '"' || c === '`') { quote = c; continue; }
    if (c === '(') depth++;
    else if (c === ')') { depth--; if (depth === 0) return i; }
  }
  return -1;
}

function countInsertTuples(stmt) {
  const m = /\bVALUES\b/i.exec(stmt);
  if (!m) return 0;
  let i = m.index + m[0].length, count = 0;
  while (i < stmt.length) {
    while (i < stmt.length && /[\s,]/.test(stmt[i])) i++;
    if (stmt[i] !== '(') break;
    const end = matchParen(stmt, i);
    if (end < 0) break;
    count++; i = end + 1;
  }
  return count;
}

function unquoteId(s) {
  if (!s) return s;
  s = s.trim();
  if (s.startsWith('`') && s.endsWith('`')) return s.slice(1, -1).replace(/``/g, '`');
  return s.replace(/^.*\./, '');
}
function listIds(inner) { return splitTopLevel(inner).map(x => unquoteId(x)); }

function parseType(rest) {
  // rest begins with the data type
  const m = /^([a-zA-Z]+)\s*(?:\(([^)]*)\))?\s*(unsigned)?\s*(zerofill)?/i.exec(rest);
  if (!m) return { type: rest.trim().toUpperCase(), length: null, precision: null, scale: null, unsigned: false, values: [], base: rest.trim().toUpperCase() };
  const type = m[1].toLowerCase();
  const arg = m[2] || '';
  const out = { type, base: type, length: null, precision: null, scale: null, unsigned: !!m[3], values: [] };
  if (type === 'enum' || type === 'set') {
    out.values = splitTopLevel(arg).map(v => v.trim().replace(/^'|'$/g, '').replace(/''/g, "'"));
  } else if (/\d+\s*,\s*\d+/.test(arg)) {
    const [p, s] = arg.split(',').map(x => parseInt(x, 10));
    out.precision = p; out.scale = s;
  } else if (arg) {
    out.length = parseInt(arg, 10);
  }
  return out;
}

/* -------------------- 3. Parseo de sentencias -------------------- */
const stmts = splitStatements(sql);
const tables = [], triggers = [], views = [], procedures = [], functions = [];
const otherStatements = { alter: [], createIndex: [], delete: [], update: [], replace: [], truncate: [], insertSelect: [] };
let database = null, dumpDate = null, serverVersion = null, dumpCompleted = null;
const rowCounts = {}, rowMethods = {};
const insertsPerTable = {};
const topModifiers = [];

for (const st of stmts) {
  const original = st.text.replace(/\*\//g, ' ').replace(/^\s*--[^\n]*\n?/gm, '').trim();
  let s = original.replace(/\s+/g, ' ').trim();
  if (!s) continue;
  const clean = s;

  if (/^CREATE\s+DATABASE\b/i.test(s)) {
    database = unquoteId((/CREATE\s+DATABASE\s+(?:IF\s+NOT\s+EXISTS\s+)?([^\s]+)/i.exec(s) || [])[1]);
    continue;
  }
  if (/^--\s*MySQL dump/i.test(st.comment) || /Distrib\s+8\./i.test(st.comment)) serverVersion = (/\d+\.\d+\.\d+/.exec(st.comment) || [])[0] || '8.0';
  if (/Dump completed on/i.test(s)) dumpCompleted = (/Dump completed on\s+(.+)/i.exec(s) || [])[1]?.trim();

  if (/^CREATE\s+TABLE\b/i.test(s)) {
    const name = unquoteId((/^CREATE\s+TABLE\s+(?:IF\s+NOT\s+EXISTS\s+)?(`[^`]+`|\S+)/i.exec(s) || [])[1]);
    const open = s.indexOf('(');
    const close = matchParen(s, open);
    const body = s.slice(open + 1, close);
    const tail = s.slice(close + 1);
    const cols = [], pk = [], fks = [], indexes = [], checks = [];
    let pos = 0;
    for (const item of splitTopLevel(body)) {
      const it = item.trim().replace(/\s+/g, ' ');
      if (/^PRIMARY\s+KEY\b/i.test(it)) { pk.push(...listIds(it.slice(it.indexOf('(') + 1, it.lastIndexOf(')')))); continue; }
      if (/^(UNIQUE\s+)?(KEY|INDEX)\b/i.test(it)) {
        const isUnique = /^UNIQUE/i.test(it);
        const nm = unquoteId((/^(?:UNIQUE\s+)?(?:KEY|INDEX)\s+(`[^`]+`|[^\s(]+)/i.exec(it) || [])[1]);
        const ids = listIds(it.slice(it.indexOf('(') + 1, it.lastIndexOf(')')));
        indexes.push({ name: nm || '(sin nombre)', columns: ids, unique: isUnique, type: /USING\s+([A-Z]+)/i.test(it) ? (/USING\s+([A-Z]+)/i.exec(it)[1].toUpperCase()) : 'BTREE' });
        continue;
      }
      if (/^CONSTRAINT\b/i.test(it) && /\bFOREIGN\s+KEY\b/i.test(it)) {
        const nm = unquoteId((/^CONSTRAINT\s+(`[^`]+`|\S+)/i.exec(it) || [])[1]);
        const local = listIds(it.slice(it.indexOf('FOREIGN KEY') + 12, it.indexOf(')', it.indexOf('FOREIGN KEY'))));
        const refm = /\bREFERENCES\s+(`[^`]+`|\S+)\s*\(([^)]*)\)/i.exec(it);
        const remote = refm ? listIds(refm[2]) : [];
        fks.push({
          name: nm, columns: local, table: unquoteId(refm ? refm[1] : ''), refColumns: remote,
          onDelete: (/\bON\s+DELETE\s+([A-Z\s]+?)(?=\bON\s+UPDATE|\bMATCH|\b$)/i.exec(it) || [])[1]?.trim() || 'RESTRICT (implícito)',
          onUpdate: (/\bON\s+UPDATE\s+([A-Z\s]+?)(?=\bMATCH|\b$)/i.exec(it) || [])[1]?.trim() || 'RESTRICT (implícito)',
          raw: it
        });
        continue;
      }
      if (/^CONSTRAINT\b/i.test(it) && /\bCHECK\b/i.test(it)) {
        const nm = unquoteId((/^CONSTRAINT\s+(`[^`]+`|\S+)/i.exec(it) || [])[1]);
        checks.push({ name: nm, expression: it.slice(it.indexOf('CHECK') + 5).trim().replace(/^\((.*)\)$/s, '$1') });
        continue;
      }
      if (/^CHECK\b/i.test(it)) { checks.push({ name: `check_${pos}`, expression: it.slice(5).trim() }); continue; }
      if (/^FULLTEXT\b/i.test(it) || /^SPATIAL\b/i.test(it)) { indexes.push({ name: '(índice especial)', columns: listIds(it.slice(it.indexOf('(') + 1, it.lastIndexOf(')'))), unique: false, type: /^FULLTEXT/i.test(it) ? 'FULLTEXT' : 'SPATIAL' }); continue; }

      const cm = /^(`[^`]+`|[^\s]+)\s+([\s\S]+)$/.exec(it);
      if (!cm) continue;
      const colName = unquoteId(cm[1]);
      const rest = cm[2].trim();
      const t = parseType(rest);
      pos++;
      cols.push({
        position: pos, name: colName, sqlType: t.base.toUpperCase(),
        fullType: t.type.toUpperCase() + (t.length !== null ? `(${t.length})` : t.precision !== null ? `(${t.precision},${t.scale})` : t.values.length ? `(${t.values.map(v => `'${v}'`).join(',')})` : '') + (t.unsigned ? ' unsigned' : ''),
        length: t.length, precision: t.precision, scale: t.scale, unsigned: t.unsigned,
        enumValues: t.values,
        nullable: /\bNOT\s+NULL\b/i.test(rest) ? false : true,
        defaultValue: (/\bDEFAULT\s+('(?:[^'\\]|\\.|'')*'|CURRENT_TIMESTAMP(?:\(\))?|NULL|-?\d+(?:\.\d+)?|b'[01]+')/i.exec(rest) || [])[1] || null,
        autoIncrement: /\bAUTO_INCREMENT\b/i.test(rest),
        onUpdate: /\bON\s+UPDATE\s+CURRENT_TIMESTAMP/i.test(rest),
        generated: /\bGENERATED\s+ALWAYS\b|\bAS\s*\(/i.test(rest),
        collation: (/\bCOLLATE\s+([a-zA-Z0-9_]+)/i.exec(rest) || [])[1] || null,
        comment: (/\bCOMMENT\s+'((?:[^'\\]|\\.|'')*)'/i.exec(rest) || [])[1] || null,
        raw: it
      });
    }
    tables.push({
      name, columns: cols, pk, fks, indexes, checks,
      engine: (/ENGINE=(\w+)/i.exec(tail) || [])[1] || 'InnoDB',
      autoIncrementStart: (/AUTO_INCREMENT=(\d+)/i.exec(tail) || [])[1] || null,
      charset: (/DEFAULT\s+CHARSET=(\w+)/i.exec(tail) || [])[1] || null,
      collation: (/COLLATE=(\w+)/i.exec(tail) || [])[1] || null,
      rawDDL: s
    });
    continue;
  }

  if (/^INSERT\s+(?:IGNORE\s+)?INTO\b/i.test(s) || /^REPLACE\s+INTO\b/i.test(s)) {
    const isReplace = /^REPLACE/i.test(s);
    const tn = unquoteId((/(?:INSERT|REPLACE)\s+(?:IGNORE\s+)?INTO\s+(`[^`]+`|[^\s(]+)/i.exec(s) || [])[1]);
    const rows = countInsertTuples(s);
    rowCounts[tn] = (rowCounts[tn] || 0) + rows;
    insertsPerTable[tn] = (insertsPerTable[tn] || 0) + 1;
    if (isReplace) otherStatements.replace.push(tn);
    if (/\bSELECT\b/i.test(s)) otherStatements.insertSelect.push(tn);
    continue;
  }

  if (/^CREATE\s+(?:DEFINER=[^\s]+\s+)?TRIGGER\b/i.test(s) || /^CREATE\s+TRIGGER\b/i.test(s)) {
    const nm = unquoteId((/\bTRIGGER\s+(`[^`]+`|\S+)/i.exec(s) || [])[1]);
    const mm = /\b(BEFORE|AFTER)\s+(INSERT|UPDATE|DELETE)\s+ON\s+(`[^`]+`|[^\s]+)/i.exec(s);
    const bodyMatch = /\bFOR\s+EACH\s+ROW\b([\s\S]*)$/i.exec(s);
    triggers.push({
      name: nm,
      table: mm ? unquoteId(mm[3]) : null,
      timing: mm ? mm[1].toUpperCase() : null,
      event: mm ? mm[2].toUpperCase() : null,
      level: /FOR\s+EACH\s+ROW/i.test(s) ? 'FOR EACH ROW' : 'FOR EACH STATEMENT',
      definer: (/\bDEFINER=([^\s]+)/i.exec(s) || [])[1] || null,
      sql: original,
      body: bodyMatch ? bodyMatch[1].trim() : '',
      line: st.line
    });
    continue;
  }

  if (/\bVIEW\s+`[^`]+`\s+AS\b/i.test(s) && /^CREATE\b/i.test(s)) {
    const nm = unquoteId((/\bVIEW\s+(`[^`]+`|[^\s]+)\s+AS\b/i.exec(s) || [])[1]);
    const isTemp = /Temporary view structure/i.test(st.comment) || /^\s*CREATE\s+VIEW\s+`[^`]+`\s+AS\s+SELECT\s+1\s+AS\b/i.test(s) || (/\bSELECT\s+1\s+AS\b/i.test(s) && s.length < 1800);
    views.push({ name: nm, sql: original, isTemp, isFinal: !isTemp, line: st.line });
    continue;
  }
  if (/^CREATE\s+PROCEDURE\b/i.test(s)) { procedures.push({ name: unquoteId((/^CREATE\s+PROCEDURE\s+(`[^`]+`|\S+)/i.exec(s) || [])[1]), sql: s }); continue; }
  if (/^CREATE\s+FUNCTION\b/i.test(s)) { functions.push({ name: unquoteId((/^CREATE\s+FUNCTION\s+(`[^`]+`|\S+)/i.exec(s) || [])[1]), sql: s }); continue; }
  if (/^ALTER\s+TABLE\b/i.test(s)) { otherStatements.alter.push(s); continue; }
  if (/^CREATE\s+(UNIQUE\s+)?INDEX\b/i.test(s)) { otherStatements.createIndex.push(s); continue; }
  if (/^DELETE\s+FROM\b/i.test(s)) { otherStatements.delete.push(s); topModifiers.push(s); continue; }
  if (/^UPDATE\b/i.test(s)) { otherStatements.update.push(s); topModifiers.push(s); continue; }
  if (/^TRUNCATE\b/i.test(s)) { otherStatements.truncate.push(s); topModifiers.push(s); }
}

/* -------------------- 4. Enriquecimiento -------------------- */
const tableByName = Object.fromEntries(tables.map(t => [t.name, t]));

// Relaciones explícitas
const relationships = [];
for (const t of tables) {
  for (const fk of t.fks) {
    const target = tableByName[fk.table];
    const localTypes = fk.columns.map(c => t.columns.find(x => x.name === c)?.fullType || '?');
    const remoteTypes = fk.refColumns.map(c => target?.columns.find(x => x.name === c)?.fullType || '?');
    relationships.push({
      id: `rel_${t.name}_${fk.name}`,
      type: 'explicit',
      fromTable: t.name, fromColumns: fk.columns, toTable: fk.table, toColumns: fk.refColumns,
      name: fk.name, onDelete: fk.onDelete, onUpdate: fk.onUpdate,
      cardinality: fk.columns.every(c => t.pk.includes(c)) && JSON.stringify(fk.columns) === JSON.stringify(fk.refColumns) ? '1:1 (inferida por PK/FK coincidente)' : 'N:1',
      optionality: fk.columns.every(c => t.columns.find(x => x.name === c)?.nullable) ? 'opcional (NULL permitido)' : 'obligatoria (NOT NULL)',
      localTypes, remoteTypes,
      evidence: `CONSTRAINT \`${fk.name}\` FOREIGN KEY declarada en CREATE TABLE \`${t.name}\``,
      raw: fk.raw
    });
    t.columns.forEach(c => { if (fk.columns.includes(c.name)) c.isFK = true; });
  }
  t.columns.forEach(c => { if (t.pk.includes(c.name)) c.isPK = true; });
  t.columns.forEach(c => { if (t.indexes.some(i => i.unique && i.columns.length === 1 && i.columns[0] === c.name)) c.isUnique = true; });
}

// Vistas: deduplicar (prevalece definición final)
const finalViewsMap = new Map();
for (const v of views) {
  if (v.isFinal || !finalViewsMap.has(v.name)) finalViewsMap.set(v.name, v);
  else if (v.isFinal) finalViewsMap.set(v.name, v);
}
const finalViews = [...finalViewsMap.values()];

function extractDependencies(sqlText) {
  const tablesUsed = new Set(), external = new Set(), viewsUsed = new Set();
  const re = /\b(?:from|join)\s+(`[^`]+`|[a-zA-Z_][\w]*)(?:\.([`\w]+))?/gi;
  let m;
  while ((m = re.exec(sqlText))) {
    let a = unquoteId(m[1]);
    if (m[2]) { external.add(a + '.' + unquoteId(m[2])); continue; }
    if (tableByName[a]) tablesUsed.add(a);
    else if (finalViews.some(v => v.name === a)) viewsUsed.add(a);
    else if (/^(mysql|information_schema|performance_schema|sys)$/i.test(a)) external.add(a);
  }
  const funcs = new Set();
  const fm = /\b([A-Z_][A-Z0-9_]*)\s*\(/gi;
  let f;
  const known = new Set(['SELECT','AS','WHERE','AND','OR','NOT','NULL','IF','CASE','WHEN','THEN','ELSE','END','CAST','CONVERT','DISTINCT','GROUP','BY','ORDER','HAVING','LIMIT','UNION','ALL','IN','ON','JOIN','LEFT','RIGHT','INNER','OUTER','CROSS','INTERVAL','ASC','DESC','SUBSTRING','SUBSTRING_INDEX','COALESCE','GROUP_CONCAT','CONCAT','CAST','COUNT','SUM','AVG','MIN','MAX','USER','CURRENT_TIMESTAMP','DATE','DATE_FORMAT','NOW','LOWER','UPPER','TRIM','REPLACE','ROUND','ABS','LENGTH','COALESCE','IFNULL','JSON_EXTRACT','EXTRACT','TIMESTAMPDIFF','DATE_ADD']);
  while ((f = fm.exec(sqlText))) { const fn = f[1].toUpperCase(); if (/^[A-Z_]{4,}$/.test(fn) && !known.has(fn)) funcs.add(fn); }
  const cols = [];
  const afterAs = /AS\s+(select[\s\S]*)$/i.exec(sqlText);
  const sel = afterAs ? afterAs[1] : '';
  const firstFrom = /\bfrom\b/i.exec(sel);
  const selectPart = firstFrom ? sel.slice(0, firstFrom.index) : sel;
  for (const item of splitTopLevel(selectPart)) {
    const am = /\bAS\s+`([^`]+)`\s*$/i.exec(item.trim());
    if (am) cols.push(am[1]);
  }
  return { tables: [...tablesUsed], views: [...viewsUsed], external: [...external], functions: [...funcs], resultColumns: cols };
}

for (const v of finalViews) {
  const d = extractDependencies(v.sql);
  Object.assign(v, d);
  const where = (/\bWHERE\b([\s\S]*?)(?=\bGROUP\s+BY\b|\bORDER\s+BY\b|\bHAVING\b|$)/i.exec(v.sql) || [])[1]?.trim() || null;
  v.filters = where;
  v.groups = (/\bGROUP\s+BY\s+([\s\S]*?)(?=\bORDER\s+BY\b|\bHAVING\b|$)/i.exec(v.sql) || [])[1]?.trim() || null;
}

// Asociaciones tabla <-> triggers/vistas
for (const t of tables) {
  t.rowCount = rowCounts[t.name] || 0;
  t.insertStatements = insertsPerTable[t.name] || 0;
  t.triggerNames = triggers.filter(x => x.table === t.name).map(x => x.name);
  t.viewNames = finalViews.filter(v => v.tables.includes(t.name)).map(v => v.name);
  t.relationshipsOut = relationships.filter(r => r.fromTable === t.name).map(r => r.id);
  t.relationshipsIn = relationships.filter(r => r.toTable === t.name).map(r => r.id);
}

// Análisis de triggers
const triggerFn = /\b(INSERT\s+INTO|UPDATE|DELETE\s+FROM|SELECT|CALL|SIGNAL|SET)\b/gi;
for (const tr of triggers) {
  tr.affectedTables = [...new Set([...tr.body.matchAll(/\b(?:INSERT\s+INTO|UPDATE|DELETE\s+FROM|FROM|JOIN)\s+(`?\w+`?)/gi)].map(m => unquoteId(m[1])).filter(x => tableByName[x] || /^tb_|^tbd_|^tbc_/.test(x)))];
  const ops = [...new Set([...tr.body.matchAll(triggerFn)].map(m => m[1].toUpperCase().split(' ')[0]))];
  tr.operations = ops;
  tr.conditions = [...new Set([...tr.body.matchAll(/\b(?:IF|WHERE|CASE)\s+([\s\S]{0,160}?)(?=\bTHEN\b|\bEND\s+IF\b|\b;\b|$)/gi)].map(m => m[1].trim().replace(/\s+/g, ' ')))].slice(0, 6);
  tr.dependencies = [...new Set([...tr.body.matchAll(/\b(NEW|OLD)\.(\w+)/g)].map(m => `${m[1]}.${m[2]}`))];
}

/* -------------------- 5. Estadísticas y validación -------------------- */
const totalColumns = tables.reduce((a, t) => a + t.columns.length, 0);
const totalIndexes = tables.reduce((a, t) => a + t.indexes.length, 0);
const totalChecks = tables.reduce((a, t) => a + t.checks.length, 0);
const totalRows = Object.values(rowCounts).reduce((a, b) => a + b, 0);
const typeCounts = {};
for (const t of tables) for (const c of t.columns) typeCounts[c.sqlType] = (typeCounts[c.sqlType] || 0) + 1;
const triggerEvents = {}, triggerTiming = { BEFORE: 0, AFTER: 0 };
for (const t of triggers) {
  const k = t.timing + ' ' + t.event;
  triggerEvents[k] = (triggerEvents[k] || 0) + 1;
  triggerTiming[t.timing] = (triggerTiming[t.timing] || 0) + 1;
}
const expected = { tables: 25, triggers: 72, views: 28 };
const found = { tables: tables.length, triggers: triggers.length, views: finalViews.length };
const validation = Object.keys(expected).map(k => ({
  object: k, expected: expected[k], found: found[k], status: found[k] === expected[k] ? 'ok' : 'diff',
  detail: found[k] === expected[k] ? 'Coincide con el valor esperado.' : `Diferencia de ${found[k] - expected[k]} respecto al valor esperado. Se documenta el valor real.`
}));

const dataset = {
  meta: {
    database, source: path.basename(SQL_PATH), serverVersion: serverVersion || '8.0.42',
    dumpCompleted, generatedAt: new Date().toISOString(),
    expected, found, validation,
    integrity: validation.every(v => v.status === 'ok') ? 'complete' : 'diff',
    totalStmts: stmts.length,
    notes: [
      `El respaldo contiene ${views.length} sentencias CREATE VIEW: ${views.filter(v => v.isTemp).length} estructuras temporales (placeholders "SELECT 1 AS ..." generados por mysqldump) y ${finalViews.length} definiciones finales con SQL real. Se documentan únicamente las definiciones finales. El valor esperado era 28 vistas; se encontraron ${finalViews.length} (diferencia de ${finalViews.length - 28}).`,
      topModifiers.length === 0 ? 'No se encontraron sentencias DELETE/UPDATE/TRUNCATE de datos a nivel superior en el respaldo.' : `Se detectaron ${topModifiers.length} sentencias modificadoras a nivel superior.`
    ]
  },
  tables, triggers, views: finalViews, procedures, functions, relationships,
  stats: {
    totalColumns, totalPK: tables.reduce((a, t) => a + t.pk.length, 0),
    totalFK: tables.reduce((a, t) => a + t.fks.length, 0),
    totalIndexes, totalChecks, totalRelationships: relationships.length,
    totalRows, typeCounts, triggerEvents, triggerTiming,
    insertsPerTable,
    rowCounts,
    rowMethod: 'Conteo exacto de tuplas VALUES en sentencias INSERT del respaldo (analizador con manejo de comillas, escapes y paréntesis anidados). Sin sentencias modificadoras de datos a nivel superior.',
    rowStatus: topModifiers.length === 0 ? 'exacto' : 'no determinable',
    otherStatements
  },
  sensitive: {
    excluded: 'No se embebieron valores de INSERT: el HTML contiene únicamente DDL, código de triggers y definiciones de vistas. Se revisaron nombres de columnas sensibles y seDocumenta su estructura sin exponer datos.',
    sensitiveColumns: tables.flatMap(t => t.columns.filter(c => /pass|hash|token|secret|email|correo|contra|clave|password|dni|curp/i.test(c.name)).map(c => `${t.name}.${c.name}`))
  }
};

fs.writeFileSync(OUT, JSON.stringify(dataset, null, 2), 'utf8');
console.log(JSON.stringify({
  database, stmts: stmts.length, found, expected,
  columns: totalColumns, pk: dataset.stats.totalPK, fk: dataset.stats.totalFK,
  indexes: totalIndexes, checks: totalChecks, relationships: relationships.length,
  rows: totalRows, procedures: procedures.length, functions: functions.length,
  viewsTemp: views.filter(v => v.isTemp).length, viewsFinal: finalViews.length,
  sensitiveColumns: dataset.sensitive.sensitiveColumns
}, null, 2));
