// Construye index.html autocontenido a partir de la plantilla y el dataset analizado.
const fs = require('fs');
const path = require('path');
const tpl = fs.readFileSync(path.join(__dirname, 'app.template.html'), 'utf8');
const data = fs.readFileSync(path.join(__dirname, 'dataset.json'), 'utf8');
// Evita que una secuencia "</script>" en los datos cierre el bloque prematuremente.
const safe = data.replace(/</g, '\\u003c');
if (!tpl.includes('__DATASET_JSON__')) throw new Error('Placeholder no encontrado');
const out = tpl.replace('__DATASET_JSON__', safe);
const dest = path.join(__dirname, 'index.html');
fs.writeFileSync(dest, out, 'utf8');
console.log('Generado:', dest, (out.length / 1024).toFixed(1) + ' KB');
