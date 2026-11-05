import pathlib, re, subprocess, tempfile
html=pathlib.Path('Practica03/diagrama/Explorador_EER_db_test.html').read_text(encoding='utf-8')
scripts=re.findall(r'<script>(.*?)</script>',html,re.S)
assert len(scripts)==1 and '__SCHEMA__' not in html
with tempfile.NamedTemporaryFile(mode='w',suffix='.js',encoding='utf-8',delete=False) as f:
    f.write(scripts[0]); name=f.name
try:
    subprocess.run(['node','--check',name],check=True)
finally:
    pathlib.Path(name).unlink(missing_ok=True)
print('Explorer HTML contains embedded schema; JavaScript syntax is valid.')
