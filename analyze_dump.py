import json, re, pathlib

SOURCE = pathlib.Path('Practica03/backups/Respaldo_1410.sql')
OUT = pathlib.Path('Practica03/diagrama/schema.json')
sql = SOURCE.read_text(encoding='utf-8', errors='replace')

def split_top(s):
    out=[]; start=0; depth=0; quote=None; esc=False
    for i,ch in enumerate(s):
        if quote:
            if esc: esc=False
            elif ch=='\\': esc=True
            elif ch==quote: quote=None
        elif ch in "'\"`": quote=ch
        elif ch=='(': depth+=1
        elif ch==')': depth-=1
        elif ch==',' and depth==0: out.append(s[start:i].strip()); start=i+1
    out.append(s[start:].strip()); return out

def balanced(text, start):
    depth=0; quote=None; esc=False
    for i in range(start,len(text)):
        ch=text[i]
        if quote:
            if esc: esc=False
            elif ch=='\\': esc=True
            elif ch==quote:
                if quote=='`' and i+1<len(text) and text[i+1]=='`': continue
                quote=None
        elif ch in "'\"`": quote=ch
        elif ch=='(': depth+=1
        elif ch==')':
            depth-=1
            if depth==0: return text[start+1:i]
    raise ValueError('Unclosed parenthesized SQL section')

def count_tuples(values):
    count=0; depth=0; quote=None; esc=False
    for ch in values:
        if quote:
            if esc: esc=False
            elif ch=='\\': esc=True
            elif ch==quote: quote=None
        elif ch in "'\"`": quote=ch
        elif ch=='(':
            if depth==0: count+=1
            depth+=1
        elif ch==')': depth-=1
    return count

tables={}; counts={}
for m in re.finditer(r'CREATE\s+TABLE\s+`([^`]+)`\s*\(',sql,re.I):
    name=m.group(1); body=balanced(sql,m.end()-1)
    parts=split_top(body); cols=[]; indexes=[]; fks=[]; checks=[]; pk=[]
    for part in parts:
        cm=re.match(r'`([^`]+)`\s+(.+)$',part,re.S)
        if cm:
            col,decl=cm.groups()
            tm=re.match(r'([A-Za-z]+)(\s*\([^)]*\))?((?:\s+(?:unsigned|signed|zerofill|binary|precision))*)',decl,re.I)
            dtype=((tm.group(1).lower()+ (tm.group(2) or '').replace(' ','') + tm.group(3).lower()).strip() if tm else decl.split()[0])
            enum=re.match(r'(enum|set)\s*\((.*)\)',decl,re.I|re.S)
            if enum: dtype=enum.group(1).lower()+'('+enum.group(2)+')'
            nullable=not bool(re.search(r'\bNOT\s+NULL\b',decl,re.I))
            default=None; dm=re.search(r'\bDEFAULT\s+((?:b|_binary\s*)?\'(?:\\.|[^\'])*\'|[^\s,]+)',decl,re.I)
            if dm: default=dm.group(1)
            cols.append({'name':col,'type':dtype,'nullable':nullable,'default':default,'autoIncrement':bool(re.search(r'\bAUTO_INCREMENT\b',decl,re.I)),'onUpdate':(re.search(r'\bON UPDATE\s+([^\s,]+(?:\s+CURRENT_TIMESTAMP(?:\(\d*\))?)?)',decl,re.I).group(1) if re.search(r'\bON UPDATE\s+([^\s,]+(?:\s+CURRENT_TIMESTAMP(?:\(\d*\))?)?)',decl,re.I) else None),'comment':(re.search(r"\bCOMMENT\s+'((?:\\.|[^'])*)'",decl,re.I).group(1) if re.search(r"\bCOMMENT\s+'((?:\\.|[^'])*)'",decl,re.I) else None)})
        else:
            upper=part.upper()
            if upper.startswith('PRIMARY KEY'):
                key=re.search(r'\((.*?)\)',part,re.S); pk=[x.strip().strip('`') for x in split_top(key.group(1))] if key else []
                indexes.append({'name':'PRIMARY','kind':'PRIMARY','columns':pk})
            elif re.match(r'(?:UNIQUE\s+(?:KEY|INDEX)|UNIQUE)',part,re.I):
                im=re.search(r'(?:UNIQUE\s+(?:KEY|INDEX)\s+`([^`]+)`|UNIQUE\s+`([^`]+)`|UNIQUE\s+KEY\s+([^\s(]+))?\s*\((.*?)\)',part,re.I|re.S)
                if im:
                    iname=next((v for v in im.groups()[:3] if v),None); indexes.append({'name':iname or 'UNIQUE_'+str(len(indexes)),'kind':'UNIQUE','columns':[x.strip().strip('`').split(' ')[0] for x in split_top(im.group(4))]})
            elif re.match(r'(?:KEY|INDEX)\b',part,re.I):
                im=re.search(r'(?:KEY|INDEX)\s+`?([^`\s(]+)`?\s*\((.*?)\)',part,re.I|re.S)
                if im: indexes.append({'name':im.group(1),'kind':'INDEX','columns':[x.strip().strip('`').split(' ')[0] for x in split_top(im.group(2))]})
            elif 'FOREIGN KEY' in upper:
                fm=re.search(r'(?:CONSTRAINT\s+`([^`]+)`\s+)?FOREIGN KEY\s*\((.*?)\)\s+REFERENCES\s+`([^`]+)`\s*\((.*?)\)(.*)',part,re.I|re.S)
                if fm:
                    fks.append({'name':fm.group(1),'columns':[x.strip().strip('`') for x in split_top(fm.group(2))],'table':fm.group(3),'references':[x.strip().strip('`') for x in split_top(fm.group(4))],'onDelete':(re.search(r'ON DELETE\s+(CASCADE|RESTRICT|SET NULL|NO ACTION|SET DEFAULT)',fm.group(5),re.I).group(1).upper() if re.search(r'ON DELETE\s+(CASCADE|RESTRICT|SET NULL|NO ACTION|SET DEFAULT)',fm.group(5),re.I) else None),'onUpdate':(re.search(r'ON UPDATE\s+(CASCADE|RESTRICT|SET NULL|NO ACTION|SET DEFAULT)',fm.group(5),re.I).group(1).upper() if re.search(r'ON UPDATE\s+(CASCADE|RESTRICT|SET NULL|NO ACTION|SET DEFAULT)',fm.group(5),re.I) else None)})
            elif upper.startswith('CHECK') or ' CHECK ' in upper: checks.append(part)
    tables[name]={'name':name,'columns':cols,'primaryKey':pk,'indexes':indexes,'foreignKeys':fks,'checks':checks,'engine':None,'charset':None,'collation':None}
    tail=sql[sql.find(')',m.end()):]
    end=sql.find(';',m.end()); opts=sql[m.end():end]
    for k,pat in [('engine',r'ENGINE\s*=\s*([^\s;]+)'),('charset',r'(?:DEFAULT\s+)?(?:CHARSET|CHARACTER SET)\s*=\s*([^\s;]+)'),('collation',r'COLLATE\s*=\s*([^\s;]+)')]:
        mm=re.search(pat,opts,re.I)
        if mm: tables[name][k]=mm.group(1)
    for ix in indexes:
        for col in ix['columns']:
            if col in [c['name'] for c in cols]:
                c=next(c for c in cols if c['name']==col); c.setdefault('uniqueIndexes',[] if ix['kind']=='UNIQUE' else None)
                if ix['kind']=='UNIQUE': c['uniqueIndexes'].append(ix['name'])
                elif ix['kind']=='INDEX': c.setdefault('indexes',[]).append(ix['name'])
    for col in pk:
        next((c for c in cols if c['name']==col),{}).setdefault('keys',[]).append('PK')
    for fk in fks:
        for col in fk['columns']:
            next((c for c in cols if c['name']==col),{}).setdefault('keys',[]).append('FK')
for m in re.finditer(r'INSERT\s+INTO\s+`([^`]+)`\s+VALUES\s*',sql,re.I):
    table=m.group(1); start=m.end()-1
    counts[table]=counts.get(table,0)+count_tuples(sql[start:sql.find(';',start)])
dumped=set(re.findall(r'-- Dumping data for table `([^`]+)`',sql,re.I))
for n,t in tables.items():
    t['rowCount']=counts.get(n,0) if n in dumped else None
    t['countSource']=('backup inserts' if counts.get(n,0)>0 else 'backup data section; no INSERT rows') if n in dumped else 'not present in dump data section'
data={'database':'db_test','source':str(SOURCE).replace('\\','/'),'serverVersion':'8.0.36','created':'2026-10-14 17:28:50','tables':list(tables.values()),'counts':counts,'views':sorted(set(re.findall(r'CREATE\s+(?:ALGORITHM=.*?\s+)?VIEW\s+`([^`]+)`',sql,re.I))),'triggers':sorted(set(re.findall(r'TRIGGER\s+`([^`]+)`',sql,re.I))),'procedures':sorted(set(re.findall(r'PROCEDURE\s+`([^`]+)`',sql,re.I))),'events':[]}
OUT.parent.mkdir(parents=True,exist_ok=True); OUT.write_text(json.dumps(data,ensure_ascii=False,indent=2),encoding='utf-8')
print('tables',len(tables),'columns',sum(len(t['columns']) for t in tables.values()),'fks',sum(len(t['foreignKeys']) for t in tables.values()),'rows',counts,'views',data['views'],'triggers',len(data['triggers']),'procedures',data['procedures'])
