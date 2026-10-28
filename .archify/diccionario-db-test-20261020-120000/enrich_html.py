from pathlib import Path
p=Path('.archify/diccionario-db-test-20261020-120000/diccionario.html')
s=p.read_text(encoding='utf-8')
old="<td>${t.primaryKey.includes(c.name)?'Identificador único declarado por PK. ':r?'Referencia estructural a '+esc(r)+'. ':'Atributo definido en el DDL. '}Función específica basada en nombre; validar con el dominio funcional.</td>"
new="<td><b>${esc(c.documentation?.technical||'Atributo SQL.')}</b> ${esc(c.documentation?.functional||'Significado pendiente de validación')} <span class=\"muted\">${esc(c.documentation?.certainty||'Pendiente de validación')}</span></td>"
if old not in s: raise SystemExit('HTML description placeholder not found')
s=s.replace(old,new)
old2="${c.autoIncrement?' · AUTO_INCREMENT':''}${c.onUpdate?' · ON UPDATE':''}"
new2="${c.autoIncrement?' · AUTO_INCREMENT':''}${c.generated?' · GENERATED':''}${c.onUpdate?' · ON UPDATE':''}"
if old2 not in s: raise SystemExit('HTML property placeholder not found')
s=s.replace(old2,new2)
old3="Interpretación funcional:</b> ${esc(t.name)}; validar propósito comercial."
new3="Interpretación funcional:</b> ${esc(t.functionalInterpretation||t.name)}; validar con responsables del dominio."
if old3 not in s: raise SystemExit('HTML table-purpose placeholder not found')
s=s.replace(old3,new3)
old4="['Índices',D.tables.reduce((n,t)=>n+t.indexes.length,0)],['Triggers',D.triggers.length]"
new4="['Índices',D.tables.reduce((n,t)=>n+t.indexes.length,0)],['Columnas documentadas',D.tables.reduce((n,t)=>n+t.columns.filter(c=>c.documentation).length,0)],['Triggers',D.triggers.length]"
if old4 not in s: raise SystemExit('HTML coverage metric placeholder not found')
s=s.replace(old4,new4)
p.write_text(s,encoding='utf-8')
