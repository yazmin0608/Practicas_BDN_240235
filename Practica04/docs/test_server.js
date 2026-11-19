const http = require('http'), fs = require('fs'), path = require('path');
const root = __dirname;
http.createServer((req, res) => {
  const p = path.join(root, decodeURIComponent((req.url || '/').split('?')[0]) === '/' ? 'index.html' : decodeURIComponent((req.url || '/').split('?')[0]));
  if (!p.startsWith(root)) { res.writeHead(403); res.end(); return; }
  fs.readFile(p, (err, data) => {
    if (err) { res.writeHead(404); res.end('not found'); return; }
    res.writeHead(200, { 'Content-Type': p.endsWith('.html') ? 'text/html; charset=utf-8' : 'application/octet-stream' });
    res.end(data);
  });
}).listen(8787, () => console.log('test server on 8787'));
