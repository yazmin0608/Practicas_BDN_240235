/* =====================================================================
   DB ATLAS · capa de datos, semántica y núcleo de la aplicación
   Los datos provienen exclusivamente de Respaldo_1911.sql (análisis estático).
   ===================================================================== */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const ico = (n, c = '') => `<svg class="icon ${c}"><use href="#i-${n}"/></svg>`;
const fmt = n => Number(n || 0).toLocaleString('es-MX');
const tableByName = n => DB.tables.find(t => t.name === n);
const viewByName = n => DB.views.find(v => v.name === n);
const trigByTable = n => DB.triggers.filter(t => t.table === n);
const viewsByTable = n => DB.views.filter(v => v.tables.includes(n));
const relsByTable = n => DB.relations.filter(r => r.fromTable === n || r.toTable === n);
const rowOf = n => (DB.rowCounts[n] || {}).rows || 0;
const cap = s => String(s || '').replace(/(^|_)(\w)/g, (_, a, b) => a + b.toUpperCase()).replace(/_/g, ' ').trim();

const store = {
  get(k, d) { try { const v = localStorage.getItem('dbatlas:' + k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
  set(k, v) { try { localStorage.setItem('dbatlas:' + k, JSON.stringify(v)); } catch (e) { /* file:// sin almacenamiento */ } }
};

function toast(msg) {
  const t = $('#toast'); t.textContent = msg; t.classList.add('show');
  clearTimeout(toast._t); toast._t = setTimeout(() => t.classList.remove('show'), 2100);
}
function copyText(text, msg) {
  const done = () => toast(msg || 'Copiado al portapapeles');
  if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(text).then(done).catch(() => fallback());
  else fallback();
  function fallback() {
    const ta = document.createElement('textarea'); ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0';
    document.body.appendChild(ta); ta.select();
    try { document.execCommand('copy'); done(); } catch (e) { toast('No se pudo copiar; selecciona el texto manualmente'); }
    ta.remove();
  }
}
const copyBtn = (text, label = 'Copiar') => `<button class="btn sm" onclick="copyText(${JSON.stringify(text).replace(/"/g, '&quot;')},'Copiado')">${ico('copy', 'sm')} ${label}</button>`;

/* ---------- descripción funcional de tablas (inferida del DDL) ---------- */
const TABLE_INFO = {
  tb_users: ['Identidad y acceso', 'Cuentas de usuario del sistema. Conserva credenciales y fechas de alta, último acceso y estado lógico; es el eje de propiedad de carritos, pedidos, direcciones, métodos de pago y listas de deseo.'],
  tb_people: ['Identidad y accesorios', 'Datos personales separados de la cuenta: nombre, fecha de nacimiento, género, país y teléfono. La separación permite distinguir credenciales de perfil.'],
  tb_buyer_orders: ['Ventas', 'Pedidos de compra emitidos por un comprador y atendidos por un vendedor. Registra subtotal, costo de envío, estado de cumplimiento y bitácora de fechas.'],
  tb_carts: ['Ventas', 'Carritos de compra por usuario; agrupan artículos antes de convertirse en pedido y conservan estado lógico y fechas de control.'],
  tb_products: ['Catálogo', 'Maestro de productos con SKU, nombre, descripción, precio vigente, inventario disponible y estado de publicación.'],
  tbc_categories: ['Catálogo', 'Taxonomía jerárquica de productos mediante sup_id_category; permite construir rutas de categoría y consultas recursivas.'],
  tbd_products_categories: ['Catálogo', 'Tabla de unión con clave compuesta que asocia productos y categorías, con estado propio de la relación.'],
  tbd_products_users_providers: ['Catálogo', 'Relación entre productos y usuarios proveedores; distingue propietario, revendedor o distribuidor y fecha de disponibilidad.'],
  tbd_users_wishlist_products: ['Catálogo', 'Lista de deseo: relación many-to-many entre usuarios y productos con clave compuesta y estado.'],
  tb_payments: ['Pagos', 'Pagos aplicados a un pedido: importe, moneda, método, proveedor, estado y fecha de liquidación.'],
  tb_payment_methods: ['Pagos', 'Detalle del instrumento de pago usado en un pedido por un usuario, tipificado mediante catálogo y con referencia de proveedor.'],
  tbc_payment_methods_types: ['Pagos', 'Catálogo de tipos de método de pago (código y descripción) con estado y control de fechas.'],
  tb_payment_transactions: ['Pagos', 'Eventos del ciclo de vida de un pago: creación, autorización, captura, fallo y reembolsos, con importe y referencia.'],
  tbd_user_payment_methods: ['Pagos', 'Métodos de pago guardados por usuario: proveedor, referencia enmascarada, etiqueta, últimos cuatro dígitos y preferencia por defecto.'],
  tb_refunds: ['Pagos', 'Reembolsos vinculados a pagos, cancelaciones o devoluciones; registra motivo, importe, estado y trazabilidad de resolución.'],
  tb_cancellations: ['Postventa', 'Solicitudes de cancelación de pedidos: motivo, solicitante, estado de resolución y notas.'],
  tbd_cancellation_items: ['Postventa', 'Artículos afectados por una cancelación, con cantidad, importe unitario y motivo por ítem.'],
  tb_returns: ['Postventa', 'Devoluciones de artículos de un pedido: motivo, estado logístico, fechas de recepción y resolución.'],
  tbd_return_items: ['Postventa', 'Ítems devueltos con cantidad, importe, condición del producto y motivo particular.'],
  tb_shipments: ['Logística', 'Envíos de pedidos a una dirección: transportista, número de guía, costos, fechas estimadas y estado de entrega.'],
  tb_user_addresses: ['Logística', 'Direcciones de entrega de usuarios con etiqueta, destinatario, instrucciones, coordenadas geográficas y preferencia.'],
  tbd_address_components: ['Logística', 'Componentes estructurados de una dirección (calle, número, colonia, etc.) con auto-relación jerárquica por address_sup_ID.'],
  tbd_carts_items: ['Detalle', 'Artículos de carrito; clave compuesta por carrito, proveedor y producto, con cantidad.'],
  tbd_order_items: ['Detalle', 'Líneas de pedido: oferta de producto, nombre congelado al momento de la venta, cantidad, precio unitario y subtotal.'],
  tb_logs: ['Auditoría', 'Bitácora central de operaciones sobre tablas y vistas: usuario de base de datos, descripción textual, fecha y resultado de la operación.']
};

/* ---------- descripción por atributo (inferida del nombre y contexto) ---------- */
const COL_DESC = {
  ID: 'Identificador surrogate del registro; lo referencian otras tablas y las vistas de trazabilidad para reconstruir la operación.',
  person_ID: 'Clave del perfil personal; separa la información de identidad de las credenciales de acceso.',
  user_ID: 'Referencia al usuario propietario o responsable del registro; determina quién puede ver u operar el dato.',
  email: 'Correo electrónico de la cuenta; se usa como identificador de comunicación y está declarado único.',
  nick: 'Nombre de usuario visible; declared único para distinguir cuentas en la interfaz.',
  password: 'Valor credential del usuario. Solo se documenta su estructura; el respaldo no ha sido exportado.',
  creation_date: 'Marca de tiempo de alta del registro; sirve para orden cronológico y auditoría.',
  last_update: 'Marca de la última modificación; cuando el DDL lo indica se actualiza automáticamente.',
  last_login: 'Último acceso registrado para la cuenta; permite detectar cuentas inactivas.',
  status: 'Bandera lógica de vigencia del registro; distingue datos activos de datos dados de baja sin borrarlos físicamente.',
  order_ID: 'Referencia al pedido al que pertenece el movimiento o el pago.',
  seller_ID: 'Vendedor asignado al pedido; vincula la venta con una cuenta de usuario.',
  subtotal: 'Importe parcial antes de cargos adicionales; en pedidos está acotado por CHECK a valores no negativos.',
  shipping_cost: 'Costo de envío del pedido o del envío; acotado por CHECK cuando el DDL lo declara.',
  fulfillment_status: 'Estado de cumplimiento de la entrega: de Pending a Delivered, con estados de cancelación y devolución.',
  current_price: 'Precio vigente del producto en el catálogo; magnitud monetaria con dos decimales.',
  current_stock: 'Unidades disponibles del producto en inventario; valor entero no negativo.',
  SKU: 'Código de identificación comercial del producto, distinto de la clave técnica interna.',
  name: 'Nombre legible de la entidad de catálogo; se muestra al usuario final.',
  description: 'Texto descriptivo libre que amplía el significado del producto, categoría o incidencia.',
  sup_id_category: 'Categoría padre dentro de la taxonomía; permite construir la ruta jerárquica de forma recursiva.',
  code: 'Código corto del tipo de método de pago; clave de negocio legible por sistemas externos.',
  cart_ID: 'Carrito al que pertenece el artículo; forma parte de la clave compuesta del detalle.',
  product_ID: 'Producto referenciado en el detalle; junto a otras columnas forma la clave compuesta.',
  provider_ID: 'Proveedor u oferente del artículo dentro del carrito; componente de la clave compuesta.',
  type_ownership: 'Rol del usuario respecto al producto: propietario, revendedor o distribuidor.',
  avalaible_date: 'Fecha a partir de la cual la oferta del proveedor está disponible (nombre original conservado).',
  quantity: 'Número de unidades del artículo en el movimiento, carrito, cancelación o devolución.',
  unit_price: 'Precio por unidad congelado al momento de generar la línea de pedido.',
  unit_amount: 'Importe unitario aplicado al artículo cancelado o devuelto.',
  product_name: 'Nombre del producto almacenado en la línea de pedido para conservar el valor histórico de la venta.',
  product_offer_ID: 'Referencia a la oferta concreta del producto vendido; sin restricción FK declarada en el DDL.',
  seller_order_ID: 'Pedido del vendedor al que pertenece la línea de detalle.',
  buyer_order_ID: 'Pedido de compra relacionado con la cancelación, devolución o envío.',
  cancellation_ID: 'Cancelación a la que pertenece el detalle o el reembolso.',
  return_ID: 'Devolución a la que pertenece el detalle o el reembolso.',
  payment_ID: 'Pago al que pertenece el evento de transacción o el reembolso.',
  payment_method_type_ID: 'Tipo de método de pago configurado, según el catálogo correspondiente.',
  payment_reference: 'Referencia externa del instrumento o transacción de pago.',
  event_reference: 'Identificador devuelto por el proveedor de pagos para el evento.',
  provider_reference: 'Referencia del proveedor para conciliar el pago o reembolso.',
  provider_method_ref: 'Referencia del proveedor para el método de pago guardado por el usuario.',
  last_four: 'Últimos cuatro dígitos del instrumento, usados paraIdentificarlo sin exponer el número completo.',
  provider: 'Proveedor del servicio de pago o del envío.',
  amount: 'Importe monetario de la operación con precisión decimal.',
  currency: 'Código ISO de la moneda en que se expresa el importe.',
  payment_method: 'Modalidad de pago elegida: tarjeta, SPEI, transferencia o efectivo.',
  payment_status: 'Estado del pago dentro de su ciclo de vida: pendiente, autorizado, pagado, fallido o reembolsado.',
  event_type: 'Tipo de evento de pago registrado en la transacción.',
  payment_date: 'Fecha en que se realizó el pago.',
  paid_date: 'Fecha en que el pago quedó efectivamente liquidado.',
  processed_date: 'Fecha en que se procesó el reembolso.',
  refund_reason: 'Motivo por el que se solicita la devolución del importe.',
  refund_status: 'Estado del reembolso desde su solicitud hasta su finalización o rechazo.',
  cancellation_reason: 'Motivo declarado por el usuario para cancelar el pedido.',
  cancellation_status: 'Estado de la solicitud de cancelación.',
  requested_date: 'Fecha en que se solicitó la cancelación, devolución o reembolso.',
  resolution_notes: 'Notas libres del personal que resolvió la incidencia.',
  resolved_date: 'Fecha en que se resolvió la incidencia.',
  received_date: 'Fecha en que se recibió físicamente la devolución.',
  return_reason: 'Motivo por el que se devuelve el producto.',
  return_status: 'Estado logístico y administrativo de la devolución.',
  item_reason: 'Motivo específico de la cancelación o devolución de ese artículo.',
  item_condition: 'Condición física del artículo devuelto: desconocida, nuevo, abierto o dañado.',
  carrier: 'Transportista responsable del envío.',
  tracking_number: 'Número de guía para seguir el envío.',
  shipping_cost: 'Coste asignado al envío del pedido.',
  shipment_status: 'Estado del envío desde preparación hasta entrega, fallo o devolución.',
  shipped_date: 'Fecha en que el paquete fue entregado al transportista.',
  estimated_delivery_date: 'Fecha estimada de entrega comunicada al comprador.',
  delivered_date: 'Fecha real de entrega del envío.',
  address_ID: 'Dirección de entrega asociada al envío o al componente estructurado.',
  address_label: 'Etiqueta corta que identifica la dirección para el usuario (casa, oficina…).',
  address_sup_ID: 'Componente superior de la dirección; permite encadenar elementos como estado, ciudad y colonia.',
  component_type: 'Tipo de componente estructural de la dirección.',
  value: 'Valor textual del componente de dirección.',
  recipient_name: 'Nombre de la persona que recibe el envío en esa dirección.',
  recipient_phone: 'Teléfono de contacto del destinatario. No se exportan valores del respaldo.',
  delivery_instructions: 'Indicaciones libres para la entrega en la dirección.',
  latitude: 'Latitud decimal de la ubicación de entrega.',
  longitude: 'Longitud decimal de la ubicación de entrega.',
  is_default: 'Marca la dirección o método de pago predeterminado del usuario.',
  label: 'Etiqueta legible asignada al método de pago guardado.',
  courtesy_title: 'Tratamiento cortés del persona; opcional según el DDL.',
  given_names: 'Nombres de pila de la persona.',
  family_names: 'Apellidos de la persona.',
  birth_date: 'Fecha de nacimiento de la persona.',
  gender_ID: 'Código de género del perfil personal.',
  country_code: 'Código de país de la persona.',
  phone: 'Teléfono de contacto de la persona. No se exportan valores del respaldo.',
  table_name: 'Nombre de la tabla o vista sobre la que se registró la operación auditada.',
  operation: 'Tipo de operación auditada: creación, lectura, actualización o eliminación.',
  db_users: 'Cuenta de base de datos que ejecutó la operación; se alimenta con USER() en los triggers.',
  operation_date: 'Instante en que ocurrió la operación auditada.',
  operation_status: 'Indicador de éxito de la operación registrada en la bitácora.',
  notes: 'Observaciones libres sobre el pago o la operación.',
  remarks: 'Comentarios del evento de pago registrados por el sistema o el operador.'
};
function colDescription(table, c, fk) {
  if (COL_DESC[c.name]) return COL_DESC[c.name];
  if (fk) return `Clave foránea hacia ${fk.refTable}(${fk.refColumns.join(', ')}); vincula este registro con esa entidad y permite navegar la relación.`;
  if (/^id_|_id$/i.test(c.name)) return `Identificador de relación con ${cap(c.name.replace(/^id_|_id$/gi, ''))}; su dominio se deriva del tipo declarado.`;
  return `Dato ${cap(c.name).toLowerCase()} utilizado en el proceso de ${cap((TABLE_INFO[table.name] || ['', 'negocio'])[0]).toLowerCase()}; su semántica precisa se infiere del nombre y del contexto de la tabla.`;
}

/* ---------- análisis formal por atributo ---------- */
const INT_RANGES = {
  tinyint: [0, 255], smallint: [0, 65535], mediumint: [0, 16777215],
  int: [0, 4294967295], bigint: [0, '18446744073709551615']
};
function domainOf(c, fk) {
  const bt = c.baseType, bits = [];
  if (c.enumValues) {
    bits.push(`Selección ${c.baseType === 'set' ? 'múltiple (SET)' : 'única (ENUM)'}: [${c.enumValues.map(v => `'${v}'`).join(' | ')}]`);
  } else if (bt.startsWith('int') || bt.startsWith('bigint') || bt.startsWith('tinyint')) {
    const kind = bt.split(' ')[0];
    const range = INT_RANGES[kind] || INT_RANGES.int;
    if (c.unsigned) bits.push(`Entero sin signo: ${fmt(range[0])} … ${fmt(range[1])}`);
    else bits.push(`Entero con signo correspondiente a ${kind.toUpperCase()}`);
  } else if (bt === 'decimal' || bt === 'numeric') {
    bits.push(`Decimal exacto ${c.precision != null ? `(${c.precision},${c.scale})` : ''}: hasta ${c.precision != null ? c.precision - (c.scale || 0) : '—'} dígitos enteros y ${c.scale == null ? '—' : c.scale} decimales`);
  } else if (bt === 'char' || bt === 'varchar' || bt === 'text' || bt === 'tinytext' || bt === 'mediumtext' || bt === 'longtext') {
    bits.push(`${bt.toUpperCase()}${c.length != null ? ` · longitud máxima ${fmt(c.length)} caracteres` : ' · longitud variable según tipo'}; sin mínimo declarado se admite cadena vacía`);
  } else if (bt === 'date') bits.push('Fecha calendario, formato YYYY-MM-DD');
  else if (bt === 'datetime' || bt === 'timestamp') bits.push('Fecha y hora, formato YYYY-MM-DD HH:MM:SS');
  else if (bt === 'bit') bits.push(`Cadena de ${c.length || 1} bit(s): [b'0' | b'1']`);
  else bits.push(`Tipo SQL declarado: ${c.type}`);
  if (fk) bits.push(`Dominio referenciado: ${fk.refTable}(${fk.refColumns.join(', ')})`);
  if (c.columnCheck) bits.push(`CHECK: ${c.columnCheck}`);
  bits.push(c.notNull ? 'NOT NULL: no admite NULL' : 'NULL permitido (cadena vacía ≠ NULL)');
  if (c.default) bits.push(`DEFAULT: ${c.default}`);
  if (c.autoIncrement) bits.push('AUTO_INCREMENT: generado por el servidor');
  if (c.generated) bits.push(`GENERATED: ${c.generated}`);
  return bits.join(' · ');
}
function natureOf(c, table) {
  const n = c.name.toLowerCase(), bt = c.baseType;
  if (/date|_date$|^date|datetime|timestamp/.test(n) || bt === 'date' || bt === 'datetime' || bt === 'timestamp') return { label: 'Temporal', note: 'Instante o fecha; no es magnitud ni categoría nominal' };
  if (c.enumValues) return { label: bt === 'enum' && /(status|state|condition|type|method)/.test(n) ? 'Cualitativa ordinal (inferida)' : 'Cualitativa nominal', note: c.enumValues ? 'Alternativas declaradas en el DDL' : '' };
  if (bt === 'bit') return { label: 'Cualitativa nominal (inferida)', note: 'Bandera lógica de dos estados' };
  if (/^(quantity|current_stock|last_four|gender_ID)/.test(n)) return { label: 'Cuantitativa discreta', note: 'Unidades enteras contables' };
  if (/^(amount|subtotal|shipping_cost|current_price|unit_price|unit_amount|latitude|longitude)/.test(n)) return { label: 'Cuantitativa continua', note: 'Magnitud con precisión decimal de almacenamiento' };
  if (/(^ID$|_ID$|Id$|^SKU$|^code$|reference|tracking|phone|nick|email|password)/.test(c.name)) return { label: 'Cualitativa nominal', note: 'Identificador o etiqueta: el valor numérico no es una magnitud' };
  return { label: 'Cualitativa nominal', note: 'Texto descriptivo o clasificatorio' };
}
function classificationOf(table, c) {
  const inPk = table.primaryKey.includes(c.name), pkComp = inPk && table.primaryKey.length > 1;
  const fk = table.foreignKeys.find(f => f.columns.includes(c.name));
  const uniq = c.unique || table.uniqueKeys.some(u => u.columns.length === 1 && u.columns[0] === c.name);
  const tags = ['Simple en modelo físico', 'Monovaluado', c.generated ? 'Derivado (GENERATED)' : 'Almacenado', c.notNull ? 'Obligatorio' : 'Opcional', inPk ? (pkComp ? 'Identificador · componente de PK compuesta' : 'Identificador (PK)') : 'No identificador'];
  if (fk) tags.push('Clave foránea');
  if (uniq) tags.push('Único');
  if (c.autoIncrement) tags.push('Generado automáticamente');
  return { tags, inPk, fk, uniq, pkComp };
}
function dfdFor(c, cls) {
  const core = cls.inPk ? '@' + c.name : c.name;
  let expr;
  if (c.enumValues) expr = `${core} = [${c.enumValues.join(' | ')}]`;
  else if (c.baseType === 'bit') expr = `${core} = [b'0' | b'1']`;
  else if (c.baseType === 'decimal') expr = `${core} = {digito_decimal} * precision=${c.precision}, scale=${c.scale} *`;
  else if (c.baseType === 'varchar' || c.baseType === 'char') expr = `${core} = 0{caracter}${c.length != null ? c.length : 'n'}`;
  else if (c.baseType === 'date') expr = `${core} = fecha * YYYY-MM-DD *`;
  else if (c.baseType === 'datetime' || c.baseType === 'timestamp') expr = `${core} = fecha_hora * YYYY-MM-DD HH:MM:SS *`;
  else if (/int/.test(c.baseType)) expr = `${core} = {digito} * entero${c.unsigned ? ' sin signo' : ' con signo'} *`;
  else expr = `${core} = {caracter} * ${c.type} *`;
  if (cls.fk) expr += ` * FK → ${cls.fk.refTable}(${cls.fk.refColumns.join(', ')}) *`;
  if (cls.uniq) expr += ' * UNIQUE *';
  if (c.autoIncrement) expr += ' * AUTO_INCREMENT *';
  if (c.default) expr += ` * DEFAULT ${c.default} *`;
  if (!c.notNull) expr = '(' + c.name + ') = ' + expr.slice(core.length + 3) + ` * opcional (NULL) *`;
  return expr;
}
function sqlNotation(table, c, cls) {
  const parts = [c.type];
  if (cls.inPk) parts.push(table.primaryKey.length > 1 ? `PK compuesta(${table.primaryKey.join(', ')})` : 'PK');
  if (cls.fk) parts.push('FK → ' + cls.fk.refTable);
  if (cls.uniq) parts.push('UNIQUE');
  parts.push(c.notNull ? 'NOT NULL' : 'NULL');
  if (c.default) parts.push('DEFAULT ' + c.default);
  if (c.autoIncrement) parts.push('AUTO_INCREMENT');
  if (c.columnCheck) parts.push('CHECK');
  return `${c.name} : ${parts.join(', ')}`;
}
function analyze(table, c) {
  const cls = classificationOf(table, c);
  const nat = natureOf(c, table);
  return {
    description: colDescription(table.name, c, cls.fk),
    composition: c.generated ? `${c.name} = derivado de ${c.generated}` : `${c.name} = ${c.baseType === 'varchar' || c.baseType === 'char' ? `0{caracter}${c.length || 'n'}` : c.enumValues ? `[${c.enumValues.join(' | ')}]` : '{componente_atomico}'}  · atributo simple en el modelo físico`,
    domain: domainOf(c, cls.fk),
    nature: nat.label, natureNote: nat.note,
    classification: cls.tags.join(' · '),
    sql: sqlNotation(table, c, cls),
    dfd: dfdFor(c, cls),
    evidence: c.generated || c.pk || cls.fk || c.columnCheck || c.enumValues ? 'Confirmada por DDL; descripción funcional inferida del nombre y contexto' : 'Tipo y nulabilidad confirmados por DDL; descripción y naturaleza inferidas',
    cls
  };
}
function storeExpression(table) {
  const lines = table.columns.map(c => {
    const cls = classificationOf(table, c);
    const pre = cls.inPk ? '@' : '';
    const body = pre + c.name;
    const wrapped = c.notNull ? body : '(' + body + ')';
    const marks = [];
    if (cls.pkComp) marks.push('componente PK compuesta');
    if (cls.fk) marks.push('FK → ' + cls.fk.refTable);
    if (cls.uniq) marks.push('UNIQUE');
    return '    ' + wrapped + (marks.length ? '  * ' + marks.join('; ') + ' *' : '');
  });
  return `${table.name} = {\n${lines.join(' +\n')}\n}`;
}
function attributeExpressions(table) {
  return table.columns.map(c => {
    const a = analyze(table, c);
    let def = a.dfd;
    if (c.baseType === 'enum' || c.baseType === 'set') def += `\n${c.name} = [${c.enumValues.join(' | ')}]`;
    else if (c.length != null && (c.baseType === 'varchar' || c.baseType === 'char')) def += `\ncaracter = [dominio de caracteres utf8mb4; no restringido por CHECK]`;
    else if (/int/.test(c.baseType)) def += `\ndigito = [0-9]`;
    return def;
  }).join('\n');
}
function syntaxSql(sql) {
  const kw = /\b(SELECT|FROM|WHERE|INSERT|INTO|VALUES|UPDATE|DELETE|CREATE|VIEW|TRIGGER|TABLE|ALTER|BEGIN|END|IF|THEN|ELSE|END\s+IF|CASE|WHEN|AND|OR|NOT|NULL|AS|ON|JOIN|LEFT|RIGHT|INNER|OUTER|GROUP|BY|ORDER|UNION|ALL|DISTINCT|SET|DEFAULT|CURRENT_TIMESTAMP|USER|CONCAT|COUNT|SUM|CAST|WITH|RECURSIVE|OVER|PARTITION|SIGNAL|FOR|EACH|ROW|BEFORE|AFTER|PRIMARY|KEY|FOREIGN|REFERENCES|CHECK|UNIQUE|CONSTRAINT|AUTO_INCREMENT|NOT\s+NULL|DELIMITER|DECLARE|RETURNS|WHILE|DO|LOOP|LEAVE)\b/i;
  let out = '', i = 0;
  while (i < sql.length) {
    const c = sql[i];
    if (c === "'" || c === '"' || c === '`') {
      const q = c; let j = i + 1;
      while (j < sql.length) { if (sql[j] === '\\') { j += 2; continue; } if (sql[j] === q) { if (sql[j + 1] === q) { j += 2; continue; } j++; break; } j++; }
      out += `<span class="str">${esc(sql.slice(i, j))}</span>`; i = j; continue;
    }
    if (c === '-' && sql[i + 1] === '-') { let j = sql.indexOf('\n', i); if (j < 0) j = sql.length; out += `<span class="cm">${esc(sql.slice(i, j))}</span>`; i = j; continue; }
    const m = kw.exec(sql.slice(i));
    if (m && m.index === 0) { out += `<span class="kw">${esc(m[0])}</span>`; i += m[0].length; continue; }
    if (/\d/.test(c)) { const m2 = /^\d+(?:\.\d+)?/.exec(sql.slice(i)); out += `<span class="num">${m2[0]}</span>`; i += m2[0].length; continue; }
    out += esc(c); i++;
  }
  return out;
}
function codeLines(sql, id) {
  const lines = sql.split('\n');
  return `<div class="code-toolbar"><input type="search" id="${id}" placeholder="Buscar dentro del código…" style="flex:1;min-width:160px" aria-label="Buscar en código"><button class="btn sm" onclick="copyText(document.getElementById('${id}Code').textContent,'Código copiado')">${ico('copy', 'sm')} Copiar código</button></div>
  <div class="code-lines" id="${id}Code">${lines.map((l, i) => `<div class="cl" data-line="${i + 1}"><span class="ln">${i + 1}</span><code>${syntaxSql(l) || '&nbsp;'}</code></div>`).join('')}</div>`;
}
function bindCodeSearch(inputSel, linesSel) {
  const inp = $(inputSel); if (!inp) return;
  inp.addEventListener('input', () => {
    const q = inp.value.trim().toLowerCase();
    $$(linesSel + ' .cl').forEach(l => {
      const txt = l.textContent.toLowerCase();
      l.classList.toggle('hit', !!q && txt.includes(q));
      l.style.display = !q || txt.includes(q) ? '' : 'none';
    });
  });
}

/* ---------- navegación, drawer, modal, búsqueda global ---------- */
const VIEW_LABELS = {
  inicio: 'Inicio', dashboard: 'Dashboard general', tablas: 'Explorador de tablas', diccionario: 'Diccionario de datos',
  clasificacion: 'Clasificación de atributos', dominios: 'Dominios y notación DFD', eer: 'Modelo EER interactivo',
  relaciones: 'Explorador de relaciones', triggers: 'Triggers', vistas: 'Vistas', indices: 'Índices y restricciones',
  registros: 'Registros y estadísticas', dependencias: 'Dependencias y trazabilidad', conclusiones: 'Conclusiones técnicas', exportacion: 'Exportación'
};
let currentView = 'inicio';
function go(view, opt = {}) {
  if (!VIEW_LABELS[view]) view = 'inicio';
  currentView = view;
  $$('.view').forEach(v => v.classList.toggle('active', v.id === 'view-' + view));
  $$('.navitem').forEach(b => b.classList.toggle('active', b.dataset.view === view));
  $('#crumb').innerHTML = `<b>${esc(VIEW_LABELS[view])}</b>${opt.object ? ` ${ico('chevron', 'sm')} ${esc(opt.object)}` : ''}`;
  if (window.innerWidth <= 900) document.body.classList.remove('collapsed');
  window.scrollTo({ top: 0, behavior: 'smooth' });
  if (view === 'eer' && opt.focus) window.__eerPendingFocus = opt.focus;
  if (window.__applyViewOptions) window.__applyViewOptions(view, opt);
  if (view === 'eer' && window.__eerReady && !opt.focus) requestAnimationFrame(() => window.__eerFit && window.__eerFit());
  if (opt.context) showContext(opt.context.type, opt.context.id);
}
function showContext(type, id) {
  const body = $('#drawerBody'); let h = '';
  const head = (title, sub) => `<div class="drawer-head"><div><div class="eyebrow">Contexto · ${esc(type)}</div><h3>${esc(title)}</h3><div class="tiny muted">${esc(sub || '')}</div></div><button class="iconbtn close" onclick="closeDrawer()" aria-label="Cerrar">${ico('close')}</button></div>`;
  const btn = (label, view, extra = {}) => `<button class="btn sm" onclick='go(${JSON.stringify(view)},${JSON.stringify(extra)})'>${label}</button>`;
  if (type === 'tabla') {
    const t = tableByName(id); if (!t) return;
    const info = TABLE_INFO[t.name] || [];
    h = head(t.name, info[0] || 'Tabla física') + `<p class="tiny muted">${esc(info[1] || '')}</p>
      <div class="facts"><div class="fact"><b>Columnas</b><span>${t.columns.length}</span></div><div class="fact"><b>Registros (respaldo)</b><span>${fmt(rowOf(t.name))}</span></div><div class="fact"><b>Clave primaria</b><span class="mono">${esc(t.primaryKey.join(', ') || '—')}</span></div><div class="fact"><b>FK / índices / CHECK</b><span>${t.foreignKeys.length} / ${t.indexes.length} / ${t.checks.length}</span></div></div>
      <div class="sect-title">Accesos rápidos</div><div class="row">${btn('Diccionario', 'diccionario', { table: t.name })}${btn('Ver en EER', 'eer', { focus: t.name })}${btn('Relaciones', 'relaciones', { q: t.name })}${btn('Triggers', 'triggers', { q: t.name })}</div>
      <div class="sect-title">Claves foráneas</div><div class="chips">${t.foreignKeys.map(f => `<span class="pill">${esc(f.columns.join('+'))} → ${esc(f.refTable)}</span>`).join('') || '<span class="muted tiny">Sin FK declaradas</span>'}</div>
      <div class="sect-title">Vistas dependientes</div><div class="chips">${viewsByTable(t.name).map(v => `<span class="pill">${esc(v.name)}</span>`).join('') || '<span class="muted tiny">Ninguna detectada</span>'}</div>`;
  } else if (type === 'columna') {
    const [tn, cn] = id.split('::'); const t = tableByName(tn); const c = t && t.columns.find(x => x.name === cn); if (!c) return;
    const a = analyze(t, c);
    h = head(c.name, t.name) + `<div class="facts"><div class="fact"><b>Tipo SQL</b><span class="mono">${esc(c.type)}</span></div><div class="fact"><b>Naturaleza</b><span>${esc(a.nature)}</span></div></div>
      <div class="sect-title">Descripción</div><p class="tiny">${esc(a.description)}</p>
      <div class="sect-title">Dominio</div><p class="tiny">${esc(a.domain)}</p>
      <div class="sect-title">Notación DFD</div><pre class="codeblock light">${esc(a.dfd)}</pre>
      <div class="row" style="margin-top:12px">${btn('Ficha completa', 'diccionario', { table: t.name, col: c.name })}</div>`;
  } else if (type === 'trigger') {
    const t = DB.triggers.find(x => x.name === id); if (!t) return;
    h = head(t.name, `${t.timing} ${t.event} ON ${t.table}`) + `<p class="tiny muted">Auditó la operación sobre <b>${esc(t.table)}</b> escribiendo en ${esc([...t.affectedTables, ...t.affectedViews].join(', ') || 'objetos de auditoría')}.</p>
    <div class="row" style="margin:12px 0">${btn('Ir a tabla', 'diccionario', { table: t.table })}${btn('Ver en EER', 'eer', { focus: t.table })}</div>
    <pre class="codeblock">${esc(t.sql.slice(0, 2400))}</pre>`;
  } else if (type === 'vista') {
    const v = viewByName(id); if (!v) return;
    h = head(v.name, `${v.columns.length} columnas resultantes`) + `<p class="tiny muted">Depende de: ${esc([...v.tables, ...v.views, ...v.external].join(', ') || '—')}</p>
      <div class="row" style="margin:12px 0">${v.tables.map(t => btn(t, 'diccionario', { table: t })).join('')}</div><pre class="codeblock">${esc(v.sql.slice(0, 2400))}</pre>`;
  } else if (type === 'relacion') {
    const r = DB.relations.find(x => x.id === id); if (!r) return;
    h = head(r.fromTable + ' → ' + r.toTable, r.name || 'Relación inferida') + `<div class="facts"><div class="fact"><b>Evidencia</b><span>${esc(r.evidence)}</span></div><div class="fact"><b>Cardinalidad</b><span>${esc(cardinality(r))}</span></div><div class="fact"><b>Columnas</b><span class="mono">${esc(r.fromColumns.join(', '))} → ${esc(r.toColumns.join(', '))}</span></div><div class="fact"><b>ON DELETE / UPDATE</b><span>${esc(r.onDelete || '—')} / ${esc(r.onUpdate || '—')}</span></div></div>
      <div class="row" style="margin-top:12px">${btn('Origen', 'diccionario', { table: r.fromTable })}${btn('Destino', 'diccionario', { table: r.toTable })}${btn('Ver en EER', 'eer', { focus: r.fromTable })}</div>`;
  } else if (type === 'rutina') {
    const r = DB.routines.find(x => x.name === id); if (!r) return;
    h = head(r.name, r.kind) + `<p class="tiny muted">Parámetros: ${esc(r.params.join('; ') || 'ninguno')}</p><pre class="codeblock">${esc(r.sql.slice(0, 3000))}</pre>`;
  }
  body.innerHTML = h || head('Sin información', 'Objeto no encontrado');
  $('#drawer').classList.add('open');
}
function closeDrawer() { $('#drawer').classList.remove('open'); }
function openModal(html) { $('#modal').innerHTML = html; $('#modalBack').classList.add('open'); }
function closeModal() { $('#modalBack').classList.remove('open'); }
function cardinality(r) {
  const target = tableByName(r.toTable);
  const uniqueSide = target && target.uniqueKeys.some(u => u.columns.join(',') === r.toColumns.join(','));
  return (uniqueSide ? '1:1 (inferida)' : '1:N');
}

let SEARCH_INDEX = [];
function buildSearchIndex() {
  SEARCH_INDEX = [];
  DB.tables.forEach(t => {
    SEARCH_INDEX.push({ cat: 'Tablas', label: t.name, sub: `${t.columns.length} columnas · ${TABLE_INFO[t.name]?.[0] || ''} · ${t.columns.map(c => c.name).join(' ')}`, type: 'tabla', id: t.name, view: 'diccionario', extra: { table: t.name } });
    t.columns.forEach(c => SEARCH_INDEX.push({ cat: 'Columnas', label: c.name, sub: `${t.name} · ${c.type}`, type: 'columna', id: t.name + '::' + c.name, view: 'diccionario', extra: { table: t.name, col: c.name } }));
    t.indexes.forEach(i => SEARCH_INDEX.push({ cat: 'Índices', label: i.name || '(sin nombre)', sub: `${t.name} · ${i.type} · ${i.columns.join(', ')}`, type: 'tabla', id: t.name, view: 'indices', extra: {} }));
    t.checks.forEach(c => SEARCH_INDEX.push({ cat: 'Restricciones', label: c.name || 'CHECK', sub: `${t.name} · ${c.expression}`, type: 'tabla', id: t.name, view: 'indices', extra: {} }));
  });
  DB.triggers.forEach(t => SEARCH_INDEX.push({ cat: 'Triggers', label: t.name, sub: `${t.timing} ${t.event} ON ${t.table}`, type: 'trigger', id: t.name, view: 'triggers', extra: { q: t.name } }));
  DB.views.forEach(v => SEARCH_INDEX.push({ cat: 'Vistas', label: v.name, sub: `${v.columns.length} columnas · ${v.tables.length} tablas`, type: 'vista', id: v.name, view: 'vistas', extra: { q: v.name } }));
  DB.relations.forEach(r => SEARCH_INDEX.push({ cat: 'Relaciones', label: r.fromTable + ' → ' + r.toTable, sub: `${r.fromColumns.join(', ')} · ${r.evidence}`, type: 'relacion', id: r.id, view: 'relaciones', extra: { q: r.fromTable } }));
  DB.routines.forEach(r => SEARCH_INDEX.push({ cat: 'Rutinas', label: r.name, sub: `${r.kind} · ${r.params.length} parámetros`, type: 'rutina', id: r.name, view: 'dependencias', extra: {} }));
}
function renderSearch(q) {
  const pop = $('#searchPop');
  if (!q.trim()) { pop.classList.remove('open'); pop.innerHTML = ''; return; }
  const needle = q.toLowerCase().trim();
  const hits = SEARCH_INDEX.filter(x => (x.label + ' ' + x.sub).toLowerCase().includes(needle));
  const cats = [...new Set(hits.map(h => h.cat))];
  pop.innerHTML = cats.map(c => `<div class="sgroup">${esc(c)} · ${hits.filter(h => h.cat === c).length}</div>` + hits.filter(h => h.cat === c).slice(0, 6).map(h =>
    `<button class="sres" onclick="go('${h.view}',${JSON.stringify(h.extra).replace(/"/g, '&quot;')});showContext('${h.type}',${JSON.stringify(h.id).replace(/"/g, '&quot;')});document.getElementById('searchPop').classList.remove('open')"><b>${esc(h.label)}</b><small>${esc(h.sub)}</small></button>`).join('')).join('') || '<div class="empty" style="padding:18px">Sin coincidencias para «' + esc(q) + '»</div>';
  pop.classList.add('open');
}
function setTheme(t) {
  document.body.dataset.theme = t;
  $('#btnTheme use').setAttribute('href', t === 'dark' ? '#i-sun' : '#i-moon');
  store.set('theme', t);
  if (window.__eerRender) requestAnimationFrame(window.__eerRender);
}
function helpModal() {
  openModal(`<div class="row"><h3 style="margin:0">Guía rápida del explorador</h3><button class="iconbtn close" style="margin-left:auto;background:var(--surface2);color:var(--text);border-color:var(--border)" onclick="closeModal()">${ico('close')}</button></div>
  <div class="grid g2" style="margin-top:14px">
    <div class="card pad"><h4>Navegación</h4><p class="tiny muted">Usa el menú lateral para cambiar de módulo sin recargar. El buscador superior encuentra tablas, columnas, triggers, vistas, relaciones, índices, CHECK y rutinas; pulsa <b>/</b> para enfocarlo.</p>
    <p class="tiny muted">Al seleccionar cualquier objeto se abre un panel de contexto con accesos a las demás secciones.</p></div>
    <div class="card pad"><h4>Modelo EER</h4><p class="tiny muted">Arrastra una entidad desde su cabecera; rueda del mouse para acercar; arrastra el fondo para desplazar. Los botones inferiores ajustan, reorganizan, exportan y activan pantalla completa.</p>
    <p class="tiny muted">Cuatro modos: general, detallado, enfocado y simplificado. Los enlaces punteados son relaciones inferidas, no restricciones confirmadas.</p></div>
    <div class="card pad"><h4>Diccionario DFD</h4><p class="tiny muted">La notación DFD usa =, +, ( ), { }, [ ], *…*, @ y |. Es distinta de Crow's Foot y del tipo SQL. Los ejemplos didácticos están marcados como ilustrativos; las expresiones reales se generan desde el DDL.</p></div>
    <div class="card pad"><h4>Datos y privacidad</h4><p class="tiny muted">Las estadísticas corresponden al respaldo analizado, no a un servidor en vivo. No se han incrustado valores de datos: solo estructura, conteos agregados y código SQL de definición.</p></div>
  </div>`);
}

/* ---------- arranque ---------- */
function initCore() {
  setTheme(store.get('theme', 'light'));
  if (store.get('collapsed', false)) document.body.classList.add('collapsed');
  $$('.navitem').forEach(b => b.addEventListener('click', () => go(b.dataset.view)));
  $$('[data-go]').forEach(b => b.addEventListener('click', () => go(b.dataset.go)));
  $('#btnMenu').addEventListener('click', () => document.body.classList.toggle('collapsed'));
  $('#btnCollapse').addEventListener('click', () => { document.body.classList.toggle('collapsed'); store.set('collapsed', document.body.classList.contains('collapsed')); });
  $('#btnTheme').addEventListener('click', () => setTheme(document.body.dataset.theme === 'dark' ? 'light' : 'dark'));
  $('#btnHelp').addEventListener('click', helpModal);
  $('#modalBack').addEventListener('click', e => { if (e.target === $('#modalBack')) closeModal(); });
  document.addEventListener('keydown', e => {
    if (e.key === '/' && !/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName)) { e.preventDefault(); $('#globalSearch').focus(); }
    if (e.key === 'Escape') { closeModal(); closeDrawer(); $('#searchPop').classList.remove('open'); }
  });
  const gs = $('#globalSearch');
  gs.addEventListener('input', () => renderSearch(gs.value));
  gs.addEventListener('focus', () => { if (gs.value) renderSearch(gs.value); });
  document.addEventListener('click', e => { if (!e.target.closest('.topsearch')) $('#searchPop').classList.remove('open'); });
  buildSearchIndex();
  $('#navTables').textContent = DB.tables.length;
  $('#navTrig').textContent = DB.triggers.length;
  $('#navView').textContent = DB.views.length;
  $('#navRel').textContent = DB.relations.length;
  $('#footDb').textContent = DB.meta.database;
  $('#heroDb').textContent = DB.meta.database;
  $('#fDb').textContent = DB.meta.database;
  $('#fServer').textContent = 'MySQL ' + (DB.meta.serverVersion || '8.0');
  $('#fSize').textContent = (DB.meta.sourceSizeBytes / 1024 / 1024).toFixed(2) + ' MB';
  $('#fStmt').textContent = fmt(DB.meta.statementCount);
  const d = new Date(DB.meta.analysisDate);
  $('#fDate').textContent = d.toLocaleString('es-MX', { dateStyle: 'medium', timeStyle: 'short' });
  $('#footDate').textContent = d.toLocaleDateString('es-MX');
  $('#heroMatch').textContent = `Validación: ${DB.validation.found.tables}/${DB.validation.expected.tables} tablas · ${DB.validation.found.triggers}/${DB.validation.expected.triggers} triggers · ${DB.validation.found.views}/${DB.validation.expected.views} vistas`;
}
