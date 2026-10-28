import json, pathlib
base=pathlib.Path('Practica03/diagrama')
d=json.loads((base/'schema.json').read_text(encoding='utf-8'))
template=(base/'index.html').read_text(encoding='utf-8')
(base/'Explorador_EER_db_test.html').write_text(template.replace('__SCHEMA__',json.dumps(d,ensure_ascii=False,separators=(',',':'))),encoding='utf-8')
entities=[]
for i,t in enumerate(d['tables']):
    attrs=[]
    for c in t['columns']:
        key=list(c.get('keys',[]))
        if c.get('uniqueIndexes'): key.append('uk')
        refs=[]
        for f in t['foreignKeys']:
            for j,col in enumerate(f['columns']):
                if col==c['name']: refs.append(f"{f['table']}.{f['references'][j]}")
        attr={'name':c['name'],'type':c['type']}
        if key: attr['key']=[{'PK':'pk','FK':'fk'}.get(k,k) for k in key]
        if refs: attr['references']=refs[0]
        attrs.append(attr)
    widest=max((len(c['name'])+len(c['type']) for c in t['columns']),default=0)
    entities.append({'id':t['name'],'label':t['name'],'row':i//2,'col':i%2,'width':max(280,int(widest*6.8+78)),'attributes':attrs})
relationships=[]
for t in d['tables']:
    for j,f in enumerate(t['foreignKeys']):
        uniq=any(ix['kind']=='UNIQUE' and ix['columns']==f['columns'] for ix in t['indexes'])
        nullable=any(next(c for c in t['columns'] if c['name']==col)['nullable'] for col in f['columns'])
        if t['name']!=f['table']:
            relationships.append({'id':f'{t["name"]}_fk_{j+1}','from':t['name'],'to':f['table'],'label':f'{f["name"] or "FK"}: {", ".join(f["columns"])} → {", ".join(f["references"])}','fromCardinality':'one' if uniq else 'many','fromOptional':nullable,'toCardinality':'one'})
out=pathlib.Path('.archify')/'erd-db-test-20261014-164000'
out.mkdir(parents=True,exist_ok=True)
candidate={'schema_version':1,'diagram_type':'erd','meta':{'title':'Modelo entidad-relación · db_test','subtitle':'MySQL 8.0.36 · extraído de Respaldo_1410.sql','locale':'es','output':'Practica03/diagrama/modelo-eer.html','quality_profile':'standard','legend':{'mode':'hidden'}},'layout':{'mode':'grid','gapX':90,'gapY':48},'entities':entities,'relationships':relationships,'cards':[{'dot':'cyan','title':'Fuente y conteos','items':['Estructura extraída de Practica03/backups/Respaldo_1410.sql.','Los conteos corresponden a filas insertadas en este respaldo; no son conteos de una instancia conectada.','Las entidades puente se reconocen por claves primarias compuestas y claves foráneas declaradas.','tbc_categories.sup_id_category → tbc_categories.ID es una relación autorreferencial declarada; se omite su conector porque Archify ERD no admite extremos idénticos.']} ]}
(out/'candidate.json').write_text(json.dumps(candidate,ensure_ascii=False,indent=2),encoding='utf-8')
print('HTML',base/'Explorador_EER_db_test.html','candidate',out/'candidate.json','entities',len(entities),'relationships',len(relationships))
