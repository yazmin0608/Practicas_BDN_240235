/* Build utility: embeds the analysed schema into a single self-contained index.html. */
const fs = require('fs');
const path = require('path');
const dir = __dirname;
const head = fs.readFileSync(path.join(dir, 'src_head.html'), 'utf8');
const data = JSON.parse(fs.readFileSync(path.join(dir, 'schema.json'), 'utf8'));
const app = ['src_app1_core.js', 'src_app2_views.js', 'src_app3_eer.js', 'src_app4_modules.js']
  .map(f => fs.readFileSync(path.join(dir, f), 'utf8')).join('\n\n');
// Prevent the token </script> inside embedded SQL strings from closing the script tag.
const payload = JSON.stringify(data).replace(/<\/script/gi, '<\\/script').replace(/\u2028|\u2029/g, ' ');
const js = app.replace(/<\/script/gi, '<\\/script');
const out = head.replace('/*__DATA__*/', () => payload).replace('/*__APP__*/', () => js);
fs.writeFileSync(path.join(dir, 'index.html'), out, 'utf8');
console.log('index.html', (Buffer.byteLength(out, 'utf8') / 1024).toFixed(1) + ' KB');
