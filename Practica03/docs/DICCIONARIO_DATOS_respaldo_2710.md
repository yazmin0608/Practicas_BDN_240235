# Diccionario de datos — Respaldo 2710

## Alcance y fuente

- Base de datos: `db_test`.
- Archivo analizado en modo lectura: `Practica03/backups/Respaldo_2710.sql`.
- Versión indicada en el respaldo: MySQL 8.0.36.
- No se ejecutó SQL ni se consultó una instancia.

Inventario: **25 tablas**, **226 columnas**, **36 claves foráneas**. Los conteos de filas siguientes corresponden únicamente a tuplas `INSERT` incluidas en el respaldo.

## Resumen de cardinalidad de filas

| Tabla | Filas INSERT en respaldo |
|---|---:|
| `tb_buyer_orders` | 0 |
| `tb_cancellations` | 0 |
| `tb_carts` | 0 |
| `tb_logs` | 25413 |
| `tb_payment_methods` | 0 |
| `tb_payment_transactions` | 0 |
| `tb_payments` | 0 |
| `tb_people` | 2 |
| `tb_products` | 15005 |
| `tb_refunds` | 0 |
| `tb_returns` | 0 |
| `tb_shipments` | 0 |
| `tb_user_addresses` | 0 |
| `tb_users` | 11 |
| `tbc_categories` | 101 |
| `tbc_payment_methods_types` | 0 |
| `tbd_address_components` | 0 |
| `tbd_cancellation_items` | 0 |
| `tbd_carts_items` | 0 |
| `tbd_order_items` | 0 |
| `tbd_products_categories` | 10279 |
| `tbd_products_users_providers` | 0 |
| `tbd_return_items` | 0 |
| `tbd_user_payment_methods` | 0 |
| `tbd_users_wishlist_products` | 0 |

Estos conteos no representan necesariamente el estado actual de una instancia; no se confunden con la cardinalidad entre tablas.

## Inventario de objetos

- Índices declarados (incluye PK): 67.
- Relaciones FK declaradas: 36.
- Triggers: 72.
- Vistas: 28.
- Procedimientos: 2.
- Funciones: 0.

## tb_buyer_orders

**Nombre exacto:** `tb_buyer_orders`.

**Descripción general:** Almacena los registros del concepto indicado por el nombre de la tabla. Descripción funcional inferida del nombre; el respaldo no incluye especificación externa.

**Propósito de negocio:** Inferido del nombre de la entidad y de los vínculos/columnas declarados; requiere validación funcional. No se atribuyen reglas no presentes en el dump.

**Propósito técnico:** Tabla InnoDB declarada con 8 columnas y 0 filas insertadas en este respaldo.

**Clasificación:** Transaccional (inferido por nombre).

**Esquema relacional:** `tb_buyer_orders(ID, order_ID, seller_ID, subtotal, shipping_cost, fulfillment_status, creation_date, last_update)`

**Notación formal:** R(A1, A2, …, A8); **grado:** 8. **PK:** ID

**Restricciones CHECK:** CONSTRAINT `tb_buyer_orders_chk_1` CHECK ((`subtotal` >= 0)); CONSTRAINT `tb_buyer_orders_chk_2` CHECK ((`shipping_cost` >= 0))
**Relaciones y cardinalidad:** `seller_ID` → `tb_users(ID)`; por cada fila dependiente, referencia 1..1 (FK NOT NULL); por cada fila padre, dependientes 0..N (unicidad FK=no); ON DELETE no especificado, ON UPDATE no especificado; constraint `fk_seller_orders_seller`.

| Posición | Atributo | Tipo SQL | Descripción | Clasificación | Naturaleza |
|---:|---|---|---|---|---|
| A1 | `ID` | `INT UNSIGNED` | Identificador técnico del registro. La función de identidad se respalda por PK si está declarada. | Monovalorado por fila; Almacenado; Obligatorio; PK; Multivaluación conceptual: pendiente de validar | Cualitativa nominal: identificador, no magnitud, aunque el tipo sea entero. |
| A2 | `order_ID` | `INT UNSIGNED` | Identificador de la entidad indicada por el prefijo. Referencia declarada: ver PK/FK; si no hay FK, la relación semántica es inferida. | Monovalorado por fila; Almacenado; Obligatorio; No clave; Multivaluación conceptual: pendiente de validar | Cualitativa nominal: identificador, no magnitud, aunque el tipo sea entero. |
| A3 | `seller_ID` | `INT UNSIGNED` | Identificador de la entidad indicada por el prefijo. Referencia declarada: ver PK/FK; si no hay FK, la relación semántica es inferida. | Monovalorado por fila; Almacenado; Obligatorio; FK; Multivaluación conceptual: pendiente de validar | Cualitativa nominal: identificador, no magnitud, aunque el tipo sea entero. |
| A4 | `subtotal` | `DECIMAL(12,2)` | Importe o magnitud del concepto indicado por el nombre; moneda y reglas de cálculo no declaradas en esta columna. | Monovalorado por fila; Almacenado; Obligatorio; No clave; Multivaluación conceptual: pendiente de validar | Cuantitativa discreta a escala 2; incremento mínimo 0.01. Dominio decimal finito, no continuo. |
| A5 | `shipping_cost` | `DECIMAL(12,2)` | Importe o magnitud del concepto indicado por el nombre; moneda y reglas de cálculo no declaradas en esta columna. | Monovalorado por fila; Almacenado; Obligatorio; No clave; Multivaluación conceptual: pendiente de validar | Cuantitativa discreta a escala 2; incremento mínimo 0.01. Dominio decimal finito, no continuo. |
| A6 | `fulfillment_status` | `ENUM('Pending','Accepted','Preparing','Sent','Delivered','Canceled','Returned')` | Estado o indicador del registro. Los valores quedan limitados únicamente por el tipo o CHECK declarado; significado funcional pendiente si no hay comentario SQL. | Monovalorado por fila; Almacenado; Obligatorio; No clave; Multivaluación conceptual: pendiente de validar | Cualitativa nominal; el SQL no declara jerarquía. Interpretación de negocio pendiente. |
| A7 | `creation_date` | `DATETIME` | Fecha u hora asociada al evento nombrado; el evento exacto se infiere del nombre. | Monovalorado por fila; Almacenado; Obligatorio; No clave; Multivaluación conceptual: pendiente de validar | Temporal: DATETIME; expresa fecha/hora con la precisión inherente al tipo. |
| A8 | `last_update` | `DATETIME` | Fecha u hora asociada al evento nombrado; el evento exacto se infiere del nombre. | Monovalorado por fila; Almacenado; Opcional; No clave; Multivaluación conceptual: pendiente de validar | Temporal: DATETIME; expresa fecha/hora con la precisión inherente al tipo. |

| Posición | Atributo | PK/FK/UNIQUE | NULL | Dominio técnico, DEFAULT y restricciones |
|---:|---|---|---|---|
| A1 | `ID` | PK | No | `INT UNSIGNED; rango 0 a 4294967295; NOT NULL; sin DEFAULT declarado; AUTO_INCREMENT` |
| A2 | `order_ID` | No clave | No | `INT UNSIGNED; rango 0 a 4294967295; NOT NULL; sin DEFAULT declarado` |
| A3 | `seller_ID` | FK `fk_seller_orders_seller` → `tb_users.ID` | No | `INT UNSIGNED; rango 0 a 4294967295; NOT NULL; sin DEFAULT declarado` |
| A4 | `subtotal` | No clave | No | `DECIMAL(12,2); precisión 12, escala 2, rango -9999999999.99 a 9999999999.99; NOT NULL; DEFAULT '0.00'; CHECK: CONSTRAINT `tb_buyer_orders_chk_1` CHECK ((`subtotal` >= 0))` |
| A5 | `shipping_cost` | No clave | No | `DECIMAL(12,2); precisión 12, escala 2, rango -9999999999.99 a 9999999999.99; NOT NULL; DEFAULT '0.00'; CHECK: CONSTRAINT `tb_buyer_orders_chk_2` CHECK ((`shipping_cost` >= 0))` |
| A6 | `fulfillment_status` | No clave | No | `ENUM('Pending','Accepted','Preparing','Sent','Delivered','Canceled','Returned'); NOT NULL; DEFAULT 'Pending'` |
| A7 | `creation_date` | No clave | No | `DATETIME; NOT NULL; DEFAULT CURRENT_TIMESTAMP` |
| A8 | `last_update` | No clave | Sí | `DATETIME; NULL permitido; DEFAULT NULL; ON UPDATE CURRENT_TIMESTAMP` |


**Clave primaria:** ID
**Índices:** PRIMARY `PRIMARY` (ID); INDEX `fk_seller_orders_seller_idx` (seller_ID)
**Reglas de integridad:** NOT NULL/NULL, DEFAULT, AUTO_INCREMENT, ON UPDATE, PK, UNIQUE, FK y CHECK según la definición SQL. Los CHECK se reproducen textualmente arriba.
**Dominio de negocio:** Los ENUM/CHECK permiten enumerar restricciones comprobables. El significado funcional de estados, códigos, unidades y nombres sin comentario SQL queda pendiente; no se infiere de DEFAULT.

## tb_cancellations

**Nombre exacto:** `tb_cancellations`.

**Descripción general:** Almacena los registros del concepto indicado por el nombre de la tabla. Descripción funcional inferida del nombre; el respaldo no incluye especificación externa.

**Propósito de negocio:** Inferido del nombre de la entidad y de los vínculos/columnas declarados; requiere validación funcional. No se atribuyen reglas no presentes en el dump.

**Propósito técnico:** Tabla InnoDB declarada con 11 columnas y 0 filas insertadas en este respaldo.

**Clasificación:** Transaccional (inferido por nombre).

**Esquema relacional:** `tb_cancellations(ID, buyer_order_ID, user_ID, cancellation_reason, cancellation_status, requested_date, resolved_date, resolution_notes, status, creation_date, last_update)`

**Notación formal:** R(A1, A2, …, A11); **grado:** 11. **PK:** ID

**Relaciones y cardinalidad:** `buyer_order_ID` → `tb_buyer_orders(ID)`; por cada fila dependiente, referencia 1..1 (FK NOT NULL); por cada fila padre, dependientes 0..N (unicidad FK=no); ON DELETE no especificado, ON UPDATE no especificado; constraint `fk_cancellations_order`; `user_ID` → `tb_users(ID)`; por cada fila dependiente, referencia 1..1 (FK NOT NULL); por cada fila padre, dependientes 0..N (unicidad FK=no); ON DELETE no especificado, ON UPDATE no especificado; constraint `fk_cancellations_user`.

| Posición | Atributo | Tipo SQL | Descripción | Clasificación | Naturaleza |
|---:|---|---|---|---|---|
| A1 | `ID` | `INT UNSIGNED` | Identificador técnico del registro. La función de identidad se respalda por PK si está declarada. | Monovalorado por fila; Almacenado; Obligatorio; PK; Multivaluación conceptual: pendiente de validar | Cualitativa nominal: identificador, no magnitud, aunque el tipo sea entero. |
| A2 | `buyer_order_ID` | `INT UNSIGNED` | Identificador de la entidad indicada por el prefijo. Referencia declarada: ver PK/FK; si no hay FK, la relación semántica es inferida. | Monovalorado por fila; Almacenado; Obligatorio; FK; Multivaluación conceptual: pendiente de validar | Cualitativa nominal: identificador, no magnitud, aunque el tipo sea entero. |
| A3 | `user_ID` | `INT UNSIGNED` | Identificador de la entidad indicada por el prefijo. Referencia declarada: ver PK/FK; si no hay FK, la relación semántica es inferida. | Monovalorado por fila; Almacenado; Obligatorio; FK; Multivaluación conceptual: pendiente de validar | Cualitativa nominal: identificador, no magnitud, aunque el tipo sea entero. |
| A4 | `cancellation_reason` | `VARCHAR(500)` | Contenido descriptivo relativo al concepto indicado; significado específico inferido por nombre. | Monovalorado por fila; Almacenado; Obligatorio; No clave; Multivaluación conceptual: pendiente de validar | Cualitativa nominal; el SQL no declara jerarquía. Interpretación de negocio pendiente. |
| A5 | `cancellation_status` | `ENUM('Requested','Approved','Rejected','Completed')` | Estado o indicador del registro. Los valores quedan limitados únicamente por el tipo o CHECK declarado; significado funcional pendiente si no hay comentario SQL. | Monovalorado por fila; Almacenado; Obligatorio; No clave; Multivaluación conceptual: pendiente de validar | Cualitativa nominal; el SQL no declara jerarquía. Interpretación de negocio pendiente. |
| A6 | `requested_date` | `DATETIME` | Fecha u hora asociada al evento nombrado; el evento exacto se infiere del nombre. | Monovalorado por fila; Almacenado; Obligatorio; No clave; Multivaluación conceptual: pendiente de validar | Temporal: DATETIME; expresa fecha/hora con la precisión inherente al tipo. |
| A7 | `resolved_date` | `DATETIME` | Fecha u hora asociada al evento nombrado; el evento exacto se infiere del nombre. | Monovalorado por fila; Almacenado; Opcional; No clave; Multivaluación conceptual: pendiente de validar | Temporal: DATETIME; expresa fecha/hora con la precisión inherente al tipo. |
| A8 | `resolution_notes` | `TEXT` | Contenido descriptivo relativo al concepto indicado; significado específico inferido por nombre. | Monovalorado por fila; Almacenado; Opcional; No clave; Multivaluación conceptual: pendiente de validar | Cualitativa nominal; el SQL no declara jerarquía. Interpretación de negocio pendiente. |
| A9 | `status` | `BIT(1)` | Estado o indicador del registro. Los valores quedan limitados únicamente por el tipo o CHECK declarado; significado funcional pendiente si no hay comentario SQL. | Monovalorado por fila; Almacenado; Obligatorio; No clave; Multivaluación conceptual: pendiente de validar | Cualitativa nominal; el SQL no declara jerarquía. Interpretación de negocio pendiente. |
| A10 | `creation_date` | `DATETIME` | Fecha u hora asociada al evento nombrado; el evento exacto se infiere del nombre. | Monovalorado por fila; Almacenado; Obligatorio; No clave; Multivaluación conceptual: pendiente de validar | Temporal: DATETIME; expresa fecha/hora con la precisión inherente al tipo. |
| A11 | `last_update` | `DATETIME` | Fecha u hora asociada al evento nombrado; el evento exacto se infiere del nombre. | Monovalorado por fila; Almacenado; Opcional; No clave; Multivaluación conceptual: pendiente de validar | Temporal: DATETIME; expresa fecha/hora con la precisión inherente al tipo. |

| Posición | Atributo | PK/FK/UNIQUE | NULL | Dominio técnico, DEFAULT y restricciones |
|---:|---|---|---|---|
| A1 | `ID` | PK | No | `INT UNSIGNED; rango 0 a 4294967295; NOT NULL; sin DEFAULT declarado; AUTO_INCREMENT` |
| A2 | `buyer_order_ID` | FK `fk_cancellations_order` → `tb_buyer_orders.ID` | No | `INT UNSIGNED; rango 0 a 4294967295; NOT NULL; sin DEFAULT declarado` |
| A3 | `user_ID` | FK `fk_cancellations_user` → `tb_users.ID` | No | `INT UNSIGNED; rango 0 a 4294967295; NOT NULL; sin DEFAULT declarado` |
| A4 | `cancellation_reason` | No clave | No | `VARCHAR(500); longitud máxima 500; NOT NULL; sin DEFAULT declarado` |
| A5 | `cancellation_status` | No clave | No | `ENUM('Requested','Approved','Rejected','Completed'); NOT NULL; DEFAULT 'Requested'` |
| A6 | `requested_date` | No clave | No | `DATETIME; NOT NULL; DEFAULT CURRENT_TIMESTAMP` |
| A7 | `resolved_date` | No clave | Sí | `DATETIME; NULL permitido; DEFAULT NULL` |
| A8 | `resolution_notes` | No clave | Sí | `TEXT; máximo 65,535 bytes; NULL permitido; sin DEFAULT declarado` |
| A9 | `status` | No clave | No | `BIT(1); NOT NULL; DEFAULT b'1'` |
| A10 | `creation_date` | No clave | No | `DATETIME; NOT NULL; DEFAULT CURRENT_TIMESTAMP` |
| A11 | `last_update` | No clave | Sí | `DATETIME; NULL permitido; DEFAULT NULL; ON UPDATE CURRENT_TIMESTAMP` |


**Clave primaria:** ID
**Índices:** PRIMARY `PRIMARY` (ID); INDEX `idx_cancellation_order` (buyer_order_ID); INDEX `idx_cancellation_user` (user_ID)
**Reglas de integridad:** NOT NULL/NULL, DEFAULT, AUTO_INCREMENT, ON UPDATE, PK, UNIQUE, FK y CHECK según la definición SQL. Los CHECK se reproducen textualmente arriba.
**Dominio de negocio:** Los ENUM/CHECK permiten enumerar restricciones comprobables. El significado funcional de estados, códigos, unidades y nombres sin comentario SQL queda pendiente; no se infiere de DEFAULT.

## tb_carts

**Nombre exacto:** `tb_carts`.

**Descripción general:** Almacena los registros del concepto indicado por el nombre de la tabla. Descripción funcional inferida del nombre; el respaldo no incluye especificación externa.

**Propósito de negocio:** Inferido del nombre de la entidad y de los vínculos/columnas declarados; requiere validación funcional. No se atribuyen reglas no presentes en el dump.

**Propósito técnico:** Tabla InnoDB declarada con 5 columnas y 0 filas insertadas en este respaldo.

**Clasificación:** Transaccional (inferido por nombre).

**Esquema relacional:** `tb_carts(ID, user_ID, creation_date, last_update, status)`

**Notación formal:** R(A1, A2, …, A5); **grado:** 5. **PK:** ID

**Relaciones y cardinalidad:** `user_ID` → `tb_users(ID)`; por cada fila dependiente, referencia 1..1 (FK NOT NULL); por cada fila padre, dependientes 0..1 (unicidad FK=sí); ON DELETE no especificado, ON UPDATE no especificado; constraint `tb_carts_ibfk_1`.

| Posición | Atributo | Tipo SQL | Descripción | Clasificación | Naturaleza |
|---:|---|---|---|---|---|
| A1 | `ID` | `INT UNSIGNED` | Identificador técnico del registro. La función de identidad se respalda por PK si está declarada. | Monovalorado por fila; Almacenado; Obligatorio; PK; Multivaluación conceptual: pendiente de validar | Cualitativa nominal: identificador, no magnitud, aunque el tipo sea entero. |
| A2 | `user_ID` | `INT UNSIGNED` | Identificador de la entidad indicada por el prefijo. Referencia declarada: ver PK/FK; si no hay FK, la relación semántica es inferida. | Monovalorado por fila; Almacenado; Obligatorio; FK; UNIQUE; Multivaluación conceptual: pendiente de validar | Cualitativa nominal: identificador, no magnitud, aunque el tipo sea entero. |
| A3 | `creation_date` | `DATETIME` | Fecha u hora asociada al evento nombrado; el evento exacto se infiere del nombre. | Monovalorado por fila; Almacenado; Obligatorio; No clave; Multivaluación conceptual: pendiente de validar | Temporal: DATETIME; expresa fecha/hora con la precisión inherente al tipo. |
| A4 | `last_update` | `DATETIME` | Fecha u hora asociada al evento nombrado; el evento exacto se infiere del nombre. | Monovalorado por fila; Almacenado; Opcional; No clave; Multivaluación conceptual: pendiente de validar | Temporal: DATETIME; expresa fecha/hora con la precisión inherente al tipo. |
| A5 | `status` | `BIT(1)` | Estado o indicador del registro. Los valores quedan limitados únicamente por el tipo o CHECK declarado; significado funcional pendiente si no hay comentario SQL. | Monovalorado por fila; Almacenado; Opcional; No clave; Multivaluación conceptual: pendiente de validar | Cualitativa nominal; el SQL no declara jerarquía. Interpretación de negocio pendiente. |

| Posición | Atributo | PK/FK/UNIQUE | NULL | Dominio técnico, DEFAULT y restricciones |
|---:|---|---|---|---|
| A1 | `ID` | PK | No | `INT UNSIGNED; rango 0 a 4294967295; NOT NULL; sin DEFAULT declarado; AUTO_INCREMENT` |
| A2 | `user_ID` | FK `tb_carts_ibfk_1` → `tb_users.ID`, UNIQUE `uk_cart_user` (columna única) | No | `INT UNSIGNED; rango 0 a 4294967295; NOT NULL; sin DEFAULT declarado; participa en UNIQUE uk_cart_user (columna única)` |
| A3 | `creation_date` | No clave | No | `DATETIME; NOT NULL; DEFAULT CURRENT_TIMESTAMP` |
| A4 | `last_update` | No clave | Sí | `DATETIME; NULL permitido; DEFAULT NULL; ON UPDATE CURRENT_TIMESTAMP` |
| A5 | `status` | No clave | Sí | `BIT(1); NULL permitido; DEFAULT b'1'` |


**Clave primaria:** ID
**Índices:** PRIMARY `PRIMARY` (ID); UNIQUE `uk_cart_user` (user_ID)
**Reglas de integridad:** NOT NULL/NULL, DEFAULT, AUTO_INCREMENT, ON UPDATE, PK, UNIQUE, FK y CHECK según la definición SQL. Los CHECK se reproducen textualmente arriba.
**Dominio de negocio:** Los ENUM/CHECK permiten enumerar restricciones comprobables. El significado funcional de estados, códigos, unidades y nombres sin comentario SQL queda pendiente; no se infiere de DEFAULT.

## tb_logs

**Nombre exacto:** `tb_logs`.

**Descripción general:** Registra eventos operativos con usuario, operación, descripción, fecha y resultado según sus columnas declaradas.

**Propósito de negocio:** Inferido del nombre de la entidad y de los vínculos/columnas declarados; requiere validación funcional. No se atribuyen reglas no presentes en el dump.

**Propósito técnico:** Tabla InnoDB declarada con 7 columnas y 25413 filas insertadas en este respaldo.

**Clasificación:** Auditoría/bitácora (inferido por nombre y uso observado en triggers/vistas).

**Esquema relacional:** `tb_logs(ID, table_name, operation, db_users, description, operation_date, operation_status)`

**Notación formal:** R(A1, A2, …, A7); **grado:** 7. **PK:** ID

**Relaciones:** No hay claves foráneas declaradas en esta tabla.

| Posición | Atributo | Tipo SQL | Descripción | Clasificación | Naturaleza |
|---:|---|---|---|---|---|
| A1 | `ID` | `INT` | Identificador técnico del registro. La función de identidad se respalda por PK si está declarada. | Monovalorado por fila; Almacenado; Obligatorio; PK; Multivaluación conceptual: pendiente de validar | Cualitativa nominal: identificador, no magnitud, aunque el tipo sea entero. |
| A2 | `table_name` | `VARCHAR(100)` | Valor identificativo o descriptivo indicado por el nombre de la columna; interpretación funcional inferida. | Monovalorado por fila; Almacenado; Obligatorio; No clave; Multivaluación conceptual: pendiente de validar | Cualitativa nominal; el SQL no declara jerarquía. Interpretación de negocio pendiente. |
| A3 | `operation` | `ENUM('Create','Read','Update','Delete')` | Dato operation; interpretación basada en el nombre y pendiente de validación con reglas de aplicación. | Monovalorado por fila; Almacenado; Obligatorio; No clave; Multivaluación conceptual: pendiente de validar | Cualitativa nominal; el SQL no declara jerarquía. Interpretación de negocio pendiente. |
| A4 | `db_users` | `VARCHAR(80)` | Dato db users; interpretación basada en el nombre y pendiente de validación con reglas de aplicación. | Monovalorado por fila; Almacenado; Obligatorio; No clave; Multivaluación conceptual: pendiente de validar | Cualitativa nominal; el SQL no declara jerarquía. Interpretación de negocio pendiente. |
| A5 | `description` | `TEXT` | Contenido descriptivo relativo al concepto indicado; significado específico inferido por nombre. | Monovalorado por fila; Almacenado; Obligatorio; No clave; Multivaluación conceptual: pendiente de validar | Cualitativa nominal; el SQL no declara jerarquía. Interpretación de negocio pendiente. |
| A6 | `operation_date` | `DATETIME` | Fecha u hora asociada al evento nombrado; el evento exacto se infiere del nombre. | Monovalorado por fila; Almacenado; Obligatorio; No clave; Multivaluación conceptual: pendiente de validar | Temporal: DATETIME; expresa fecha/hora con la precisión inherente al tipo. |
| A7 | `operation_status` | `BIT(1)` | Estado o indicador del registro. Los valores quedan limitados únicamente por el tipo o CHECK declarado; significado funcional pendiente si no hay comentario SQL. | Monovalorado por fila; Almacenado; Opcional; No clave; Multivaluación conceptual: pendiente de validar | Cualitativa nominal; el SQL no declara jerarquía. Interpretación de negocio pendiente. |

| Posición | Atributo | PK/FK/UNIQUE | NULL | Dominio técnico, DEFAULT y restricciones |
|---:|---|---|---|---|
| A1 | `ID` | PK | No | `INT; rango -2147483648 a 2147483647; NOT NULL; sin DEFAULT declarado; AUTO_INCREMENT` |
| A2 | `table_name` | No clave | No | `VARCHAR(100); longitud máxima 100; NOT NULL; sin DEFAULT declarado` |
| A3 | `operation` | No clave | No | `ENUM('Create','Read','Update','Delete'); NOT NULL; sin DEFAULT declarado` |
| A4 | `db_users` | No clave | No | `VARCHAR(80); longitud máxima 80; NOT NULL; sin DEFAULT declarado` |
| A5 | `description` | No clave | No | `TEXT; máximo 65,535 bytes; NOT NULL; sin DEFAULT declarado` |
| A6 | `operation_date` | No clave | No | `DATETIME; NOT NULL; DEFAULT CURRENT_TIMESTAMP` |
| A7 | `operation_status` | No clave | Sí | `BIT(1); NULL permitido; DEFAULT b'1'` |


**Clave primaria:** ID
**Índices:** PRIMARY `PRIMARY` (ID)
**Reglas de integridad:** NOT NULL/NULL, DEFAULT, AUTO_INCREMENT, ON UPDATE, PK, UNIQUE, FK y CHECK según la definición SQL. Los CHECK se reproducen textualmente arriba.
**Dominio de negocio:** Los ENUM/CHECK permiten enumerar restricciones comprobables. El significado funcional de estados, códigos, unidades y nombres sin comentario SQL queda pendiente; no se infiere de DEFAULT.

## tb_payment_methods

**Nombre exacto:** `tb_payment_methods`.

**Descripción general:** Almacena los registros del concepto indicado por el nombre de la tabla. Descripción funcional inferida del nombre; el respaldo no incluye especificación externa.

**Propósito de negocio:** Inferido del nombre de la entidad y de los vínculos/columnas declarados; requiere validación funcional. No se atribuyen reglas no presentes en el dump.

**Propósito técnico:** Tabla InnoDB declarada con 13 columnas y 0 filas insertadas en este respaldo.

**Clasificación:** Transaccional (inferido por nombre).

**Esquema relacional:** `tb_payment_methods(ID, order_ID, user_ID, payment_method_type_ID, payment_reference, amount, currency, payment_status, payment_date, notes, status, creation_date, last_update)`

**Notación formal:** R(A1, A2, …, A13); **grado:** 13. **PK:** ID

**Restricciones CHECK:** CONSTRAINT `chk_payment_methods_amount` CHECK ((`amount` > 0))
**Relaciones y cardinalidad:** `payment_method_type_ID` → `tbc_payment_methods_types(ID)`; por cada fila dependiente, referencia 1..1 (FK NOT NULL); por cada fila padre, dependientes 0..N (unicidad FK=no); ON DELETE no especificado, ON UPDATE no especificado; constraint `fk_payment_methods_type`; `user_ID` → `tb_users(ID)`; por cada fila dependiente, referencia 1..1 (FK NOT NULL); por cada fila padre, dependientes 0..N (unicidad FK=no); ON DELETE no especificado, ON UPDATE no especificado; constraint `fk_payment_methods_user`.

| Posición | Atributo | Tipo SQL | Descripción | Clasificación | Naturaleza |
|---:|---|---|---|---|---|
| A1 | `ID` | `INT UNSIGNED` | Identificador técnico del registro. La función de identidad se respalda por PK si está declarada. | Monovalorado por fila; Almacenado; Obligatorio; PK; Multivaluación conceptual: pendiente de validar | Cualitativa nominal: identificador, no magnitud, aunque el tipo sea entero. |
| A2 | `order_ID` | `INT UNSIGNED` | Identificador de la entidad indicada por el prefijo. Referencia declarada: ver PK/FK; si no hay FK, la relación semántica es inferida. | Monovalorado por fila; Almacenado; Obligatorio; No clave; Multivaluación conceptual: pendiente de validar | Cualitativa nominal: identificador, no magnitud, aunque el tipo sea entero. |
| A3 | `user_ID` | `INT UNSIGNED` | Identificador de la entidad indicada por el prefijo. Referencia declarada: ver PK/FK; si no hay FK, la relación semántica es inferida. | Monovalorado por fila; Almacenado; Obligatorio; FK; Multivaluación conceptual: pendiente de validar | Cualitativa nominal: identificador, no magnitud, aunque el tipo sea entero. |
| A4 | `payment_method_type_ID` | `INT UNSIGNED` | Identificador de la entidad indicada por el prefijo. Referencia declarada: ver PK/FK; si no hay FK, la relación semántica es inferida. | Monovalorado por fila; Almacenado; Obligatorio; FK; Multivaluación conceptual: pendiente de validar | Cualitativa nominal: identificador, no magnitud, aunque el tipo sea entero. |
| A5 | `payment_reference` | `VARCHAR(150)` | Dato payment reference; interpretación basada en el nombre y pendiente de validación con reglas de aplicación. | Monovalorado por fila; Almacenado; Opcional; No clave; Multivaluación conceptual: pendiente de validar | Cualitativa nominal; el SQL no declara jerarquía. Interpretación de negocio pendiente. |
| A6 | `amount` | `DECIMAL(12,2)` | Importe o magnitud del concepto indicado por el nombre; moneda y reglas de cálculo no declaradas en esta columna. | Monovalorado por fila; Almacenado; Obligatorio; No clave; Multivaluación conceptual: pendiente de validar | Cuantitativa discreta a escala 2; incremento mínimo 0.01. Dominio decimal finito, no continuo. |
| A7 | `currency` | `CHAR(3)` | Dato currency; interpretación basada en el nombre y pendiente de validación con reglas de aplicación. | Monovalorado por fila; Almacenado; Obligatorio; No clave; Multivaluación conceptual: pendiente de validar | Cualitativa nominal; el SQL no declara jerarquía. Interpretación de negocio pendiente. |
| A8 | `payment_status` | `ENUM('Pending','Authorized','Paid','Failed','Cancelled','Refunded')` | Estado o indicador del registro. Los valores quedan limitados únicamente por el tipo o CHECK declarado; significado funcional pendiente si no hay comentario SQL. | Monovalorado por fila; Almacenado; Obligatorio; No clave; Multivaluación conceptual: pendiente de validar | Cualitativa nominal; el SQL no declara jerarquía. Interpretación de negocio pendiente. |
| A9 | `payment_date` | `DATETIME` | Fecha u hora asociada al evento nombrado; el evento exacto se infiere del nombre. | Monovalorado por fila; Almacenado; Opcional; No clave; Multivaluación conceptual: pendiente de validar | Temporal: DATETIME; expresa fecha/hora con la precisión inherente al tipo. |
| A10 | `notes` | `TEXT` | Contenido descriptivo relativo al concepto indicado; significado específico inferido por nombre. | Monovalorado por fila; Almacenado; Opcional; No clave; Multivaluación conceptual: pendiente de validar | Cualitativa nominal; el SQL no declara jerarquía. Interpretación de negocio pendiente. |
| A11 | `status` | `BIT(1)` | Estado o indicador del registro. Los valores quedan limitados únicamente por el tipo o CHECK declarado; significado funcional pendiente si no hay comentario SQL. | Monovalorado por fila; Almacenado; Obligatorio; No clave; Multivaluación conceptual: pendiente de validar | Cualitativa nominal; el SQL no declara jerarquía. Interpretación de negocio pendiente. |
| A12 | `creation_date` | `DATETIME` | Fecha u hora asociada al evento nombrado; el evento exacto se infiere del nombre. | Monovalorado por fila; Almacenado; Obligatorio; No clave; Multivaluación conceptual: pendiente de validar | Temporal: DATETIME; expresa fecha/hora con la precisión inherente al tipo. |
| A13 | `last_update` | `DATETIME` | Fecha u hora asociada al evento nombrado; el evento exacto se infiere del nombre. | Monovalorado por fila; Almacenado; Opcional; No clave; Multivaluación conceptual: pendiente de validar | Temporal: DATETIME; expresa fecha/hora con la precisión inherente al tipo. |

| Posición | Atributo | PK/FK/UNIQUE | NULL | Dominio técnico, DEFAULT y restricciones |
|---:|---|---|---|---|
| A1 | `ID` | PK | No | `INT UNSIGNED; rango 0 a 4294967295; NOT NULL; sin DEFAULT declarado; AUTO_INCREMENT` |
| A2 | `order_ID` | No clave | No | `INT UNSIGNED; rango 0 a 4294967295; NOT NULL; sin DEFAULT declarado` |
| A3 | `user_ID` | FK `fk_payment_methods_user` → `tb_users.ID` | No | `INT UNSIGNED; rango 0 a 4294967295; NOT NULL; sin DEFAULT declarado` |
| A4 | `payment_method_type_ID` | FK `fk_payment_methods_type` → `tbc_payment_methods_types.ID` | No | `INT UNSIGNED; rango 0 a 4294967295; NOT NULL; sin DEFAULT declarado` |
| A5 | `payment_reference` | No clave | Sí | `VARCHAR(150); longitud máxima 150; NULL permitido; DEFAULT NULL` |
| A6 | `amount` | No clave | No | `DECIMAL(12,2); precisión 12, escala 2, rango -9999999999.99 a 9999999999.99; NOT NULL; sin DEFAULT declarado; CHECK: CONSTRAINT `chk_payment_methods_amount` CHECK ((`amount` > 0))` |
| A7 | `currency` | No clave | No | `CHAR(3); longitud máxima 3; NOT NULL; DEFAULT 'MXN'` |
| A8 | `payment_status` | No clave | No | `ENUM('Pending','Authorized','Paid','Failed','Cancelled','Refunded'); NOT NULL; DEFAULT 'Pending'` |
| A9 | `payment_date` | No clave | Sí | `DATETIME; NULL permitido; DEFAULT NULL` |
| A10 | `notes` | No clave | Sí | `TEXT; máximo 65,535 bytes; NULL permitido; sin DEFAULT declarado` |
| A11 | `status` | No clave | No | `BIT(1); NOT NULL; DEFAULT b'1'` |
| A12 | `creation_date` | No clave | No | `DATETIME; NOT NULL; DEFAULT CURRENT_TIMESTAMP` |
| A13 | `last_update` | No clave | Sí | `DATETIME; NULL permitido; DEFAULT NULL; ON UPDATE CURRENT_TIMESTAMP` |


**Clave primaria:** ID
**Índices:** PRIMARY `PRIMARY` (ID); INDEX `idx_payment_methods_order` (order_ID); INDEX `idx_payment_methods_user` (user_ID); INDEX `idx_payment_methods_type` (payment_method_type_ID)
**Reglas de integridad:** NOT NULL/NULL, DEFAULT, AUTO_INCREMENT, ON UPDATE, PK, UNIQUE, FK y CHECK según la definición SQL. Los CHECK se reproducen textualmente arriba.
**Dominio de negocio:** Los ENUM/CHECK permiten enumerar restricciones comprobables. El significado funcional de estados, códigos, unidades y nombres sin comentario SQL queda pendiente; no se infiere de DEFAULT.

## tb_payment_transactions

**Nombre exacto:** `tb_payment_transactions`.

**Descripción general:** Almacena los registros del concepto indicado por el nombre de la tabla. Descripción funcional inferida del nombre; el respaldo no incluye especificación externa.

**Propósito de negocio:** Inferido del nombre de la entidad y de los vínculos/columnas declarados; requiere validación funcional. No se atribuyen reglas no presentes en el dump.

**Propósito técnico:** Tabla InnoDB declarada con 7 columnas y 0 filas insertadas en este respaldo.

**Clasificación:** Transaccional (inferido por nombre).

**Esquema relacional:** `tb_payment_transactions(ID, payment_ID, event_type, amount, event_reference, remarks, creation_date)`

**Notación formal:** R(A1, A2, …, A7); **grado:** 7. **PK:** ID

**Restricciones CHECK:** CONSTRAINT `chk_transaction_amount` CHECK ((`amount` >= 0))
**Relaciones y cardinalidad:** `payment_ID` → `tb_payments(ID)`; por cada fila dependiente, referencia 1..1 (FK NOT NULL); por cada fila padre, dependientes 0..N (unicidad FK=no); ON DELETE no especificado, ON UPDATE no especificado; constraint `fk_transactions_payments`.

| Posición | Atributo | Tipo SQL | Descripción | Clasificación | Naturaleza |
|---:|---|---|---|---|---|
| A1 | `ID` | `INT UNSIGNED` | Identificador técnico del registro. La función de identidad se respalda por PK si está declarada. | Monovalorado por fila; Almacenado; Obligatorio; PK; Multivaluación conceptual: pendiente de validar | Cualitativa nominal: identificador, no magnitud, aunque el tipo sea entero. |
| A2 | `payment_ID` | `INT UNSIGNED` | Identificador de la entidad indicada por el prefijo. Referencia declarada: ver PK/FK; si no hay FK, la relación semántica es inferida. | Monovalorado por fila; Almacenado; Obligatorio; FK; Multivaluación conceptual: pendiente de validar | Cualitativa nominal: identificador, no magnitud, aunque el tipo sea entero. |
| A3 | `event_type` | `ENUM('Created','Authorized','Captured','Failed','Refunded','PartiallyRefunded')` | Dato event type; interpretación basada en el nombre y pendiente de validación con reglas de aplicación. | Monovalorado por fila; Almacenado; Obligatorio; No clave; Multivaluación conceptual: pendiente de validar | Cualitativa nominal; el SQL no declara jerarquía. Interpretación de negocio pendiente. |
| A4 | `amount` | `DECIMAL(12,2)` | Importe o magnitud del concepto indicado por el nombre; moneda y reglas de cálculo no declaradas en esta columna. | Monovalorado por fila; Almacenado; Obligatorio; No clave; Multivaluación conceptual: pendiente de validar | Cuantitativa discreta a escala 2; incremento mínimo 0.01. Dominio decimal finito, no continuo. |
| A5 | `event_reference` | `VARCHAR(150)` | Dato event reference; interpretación basada en el nombre y pendiente de validación con reglas de aplicación. | Monovalorado por fila; Almacenado; Opcional; No clave; Multivaluación conceptual: pendiente de validar | Cualitativa nominal; el SQL no declara jerarquía. Interpretación de negocio pendiente. |
| A6 | `remarks` | `TEXT` | Dato remarks; interpretación basada en el nombre y pendiente de validación con reglas de aplicación. | Monovalorado por fila; Almacenado; Opcional; No clave; Multivaluación conceptual: pendiente de validar | Cualitativa nominal; el SQL no declara jerarquía. Interpretación de negocio pendiente. |
| A7 | `creation_date` | `DATETIME` | Fecha u hora asociada al evento nombrado; el evento exacto se infiere del nombre. | Monovalorado por fila; Almacenado; Obligatorio; No clave; Multivaluación conceptual: pendiente de validar | Temporal: DATETIME; expresa fecha/hora con la precisión inherente al tipo. |

| Posición | Atributo | PK/FK/UNIQUE | NULL | Dominio técnico, DEFAULT y restricciones |
|---:|---|---|---|---|
| A1 | `ID` | PK | No | `INT UNSIGNED; rango 0 a 4294967295; NOT NULL; sin DEFAULT declarado; AUTO_INCREMENT` |
| A2 | `payment_ID` | FK `fk_transactions_payments` → `tb_payments.ID` | No | `INT UNSIGNED; rango 0 a 4294967295; NOT NULL; sin DEFAULT declarado` |
| A3 | `event_type` | No clave | No | `ENUM('Created','Authorized','Captured','Failed','Refunded','PartiallyRefunded'); NOT NULL; sin DEFAULT declarado` |
| A4 | `amount` | No clave | No | `DECIMAL(12,2); precisión 12, escala 2, rango -9999999999.99 a 9999999999.99; NOT NULL; sin DEFAULT declarado; CHECK: CONSTRAINT `chk_transaction_amount` CHECK ((`amount` >= 0))` |
| A5 | `event_reference` | No clave | Sí | `VARCHAR(150); longitud máxima 150; NULL permitido; DEFAULT NULL` |
| A6 | `remarks` | No clave | Sí | `TEXT; máximo 65,535 bytes; NULL permitido; sin DEFAULT declarado` |
| A7 | `creation_date` | No clave | No | `DATETIME; NOT NULL; DEFAULT CURRENT_TIMESTAMP` |


**Clave primaria:** ID
**Índices:** PRIMARY `PRIMARY` (ID); INDEX `fk_transactions_payments` (payment_ID)
**Reglas de integridad:** NOT NULL/NULL, DEFAULT, AUTO_INCREMENT, ON UPDATE, PK, UNIQUE, FK y CHECK según la definición SQL. Los CHECK se reproducen textualmente arriba.
**Dominio de negocio:** Los ENUM/CHECK permiten enumerar restricciones comprobables. El significado funcional de estados, códigos, unidades y nombres sin comentario SQL queda pendiente; no se infiere de DEFAULT.

## tb_payments

**Nombre exacto:** `tb_payments`.

**Descripción general:** Almacena los registros del concepto indicado por el nombre de la tabla. Descripción funcional inferida del nombre; el respaldo no incluye especificación externa.

**Propósito de negocio:** Inferido del nombre de la entidad y de los vínculos/columnas declarados; requiere validación funcional. No se atribuyen reglas no presentes en el dump.

**Propósito técnico:** Tabla InnoDB declarada con 11 columnas y 0 filas insertadas en este respaldo.

**Clasificación:** Transaccional (inferido por nombre).

**Esquema relacional:** `tb_payments(ID, order_ID, amount, currency, payment_method, provider, provider_reference, payment_status, creation_date, paid_date, last_update)`

**Notación formal:** R(A1, A2, …, A11); **grado:** 11. **PK:** ID

**Restricciones CHECK:** CONSTRAINT `chk_payment_amount` CHECK ((`amount` > 0))
**Relaciones y cardinalidad:** `order_ID` → `tb_buyer_orders(ID)`; por cada fila dependiente, referencia 1..1 (FK NOT NULL); por cada fila padre, dependientes 0..N (unicidad FK=no); ON DELETE no especificado, ON UPDATE no especificado; constraint `fk_payments_buyer_orders`.

| Posición | Atributo | Tipo SQL | Descripción | Clasificación | Naturaleza |
|---:|---|---|---|---|---|
| A1 | `ID` | `INT UNSIGNED` | Identificador técnico del registro. La función de identidad se respalda por PK si está declarada. | Monovalorado por fila; Almacenado; Obligatorio; PK; Multivaluación conceptual: pendiente de validar | Cualitativa nominal: identificador, no magnitud, aunque el tipo sea entero. |
| A2 | `order_ID` | `INT UNSIGNED` | Identificador de la entidad indicada por el prefijo. Referencia declarada: ver PK/FK; si no hay FK, la relación semántica es inferida. | Monovalorado por fila; Almacenado; Obligatorio; FK; Multivaluación conceptual: pendiente de validar | Cualitativa nominal: identificador, no magnitud, aunque el tipo sea entero. |
| A3 | `amount` | `DECIMAL(12,2)` | Importe o magnitud del concepto indicado por el nombre; moneda y reglas de cálculo no declaradas en esta columna. | Monovalorado por fila; Almacenado; Obligatorio; No clave; Multivaluación conceptual: pendiente de validar | Cuantitativa discreta a escala 2; incremento mínimo 0.01. Dominio decimal finito, no continuo. |
| A4 | `currency` | `CHAR(3)` | Dato currency; interpretación basada en el nombre y pendiente de validación con reglas de aplicación. | Monovalorado por fila; Almacenado; Obligatorio; No clave; Multivaluación conceptual: pendiente de validar | Cualitativa nominal; el SQL no declara jerarquía. Interpretación de negocio pendiente. |
| A5 | `payment_method` | `ENUM('Card','SPEI','Transfer','Cash')` | Dato payment method; interpretación basada en el nombre y pendiente de validación con reglas de aplicación. | Monovalorado por fila; Almacenado; Obligatorio; No clave; Multivaluación conceptual: pendiente de validar | Cualitativa nominal; el SQL no declara jerarquía. Interpretación de negocio pendiente. |
| A6 | `provider` | `VARCHAR(50)` | Dato provider; interpretación basada en el nombre y pendiente de validación con reglas de aplicación. | Monovalorado por fila; Almacenado; Opcional; UNIQUE; Multivaluación conceptual: pendiente de validar | Cualitativa nominal; el SQL no declara jerarquía. Interpretación de negocio pendiente. |
| A7 | `provider_reference` | `VARCHAR(150)` | Dato provider reference; interpretación basada en el nombre y pendiente de validación con reglas de aplicación. | Monovalorado por fila; Almacenado; Opcional; UNIQUE; Multivaluación conceptual: pendiente de validar | Cualitativa nominal; el SQL no declara jerarquía. Interpretación de negocio pendiente. |
| A8 | `payment_status` | `ENUM('Pending','Authorized','Paid','Failed','Refunded','PartiallyRefunded')` | Estado o indicador del registro. Los valores quedan limitados únicamente por el tipo o CHECK declarado; significado funcional pendiente si no hay comentario SQL. | Monovalorado por fila; Almacenado; Obligatorio; No clave; Multivaluación conceptual: pendiente de validar | Cualitativa nominal; el SQL no declara jerarquía. Interpretación de negocio pendiente. |
| A9 | `creation_date` | `DATETIME` | Fecha u hora asociada al evento nombrado; el evento exacto se infiere del nombre. | Monovalorado por fila; Almacenado; Obligatorio; No clave; Multivaluación conceptual: pendiente de validar | Temporal: DATETIME; expresa fecha/hora con la precisión inherente al tipo. |
| A10 | `paid_date` | `DATETIME` | Fecha u hora asociada al evento nombrado; el evento exacto se infiere del nombre. | Monovalorado por fila; Almacenado; Opcional; No clave; Multivaluación conceptual: pendiente de validar | Temporal: DATETIME; expresa fecha/hora con la precisión inherente al tipo. |
| A11 | `last_update` | `DATETIME` | Fecha u hora asociada al evento nombrado; el evento exacto se infiere del nombre. | Monovalorado por fila; Almacenado; Opcional; No clave; Multivaluación conceptual: pendiente de validar | Temporal: DATETIME; expresa fecha/hora con la precisión inherente al tipo. |

| Posición | Atributo | PK/FK/UNIQUE | NULL | Dominio técnico, DEFAULT y restricciones |
|---:|---|---|---|---|
| A1 | `ID` | PK | No | `INT UNSIGNED; rango 0 a 4294967295; NOT NULL; sin DEFAULT declarado; AUTO_INCREMENT` |
| A2 | `order_ID` | FK `fk_payments_buyer_orders` → `tb_buyer_orders.ID` | No | `INT UNSIGNED; rango 0 a 4294967295; NOT NULL; sin DEFAULT declarado` |
| A3 | `amount` | No clave | No | `DECIMAL(12,2); precisión 12, escala 2, rango -9999999999.99 a 9999999999.99; NOT NULL; sin DEFAULT declarado; CHECK: CONSTRAINT `chk_payment_amount` CHECK ((`amount` > 0))` |
| A4 | `currency` | No clave | No | `CHAR(3); longitud máxima 3; NOT NULL; DEFAULT 'MXN'` |
| A5 | `payment_method` | No clave | No | `ENUM('Card','SPEI','Transfer','Cash'); NOT NULL; sin DEFAULT declarado` |
| A6 | `provider` | UNIQUE `uk_payment_reference` (clave compuesta) | Sí | `VARCHAR(50); longitud máxima 50; NULL permitido; DEFAULT NULL; participa en UNIQUE uk_payment_reference (compuesto)` |
| A7 | `provider_reference` | UNIQUE `uk_payment_reference` (clave compuesta) | Sí | `VARCHAR(150); longitud máxima 150; NULL permitido; DEFAULT NULL; participa en UNIQUE uk_payment_reference (compuesto)` |
| A8 | `payment_status` | No clave | No | `ENUM('Pending','Authorized','Paid','Failed','Refunded','PartiallyRefunded'); NOT NULL; DEFAULT 'Pending'` |
| A9 | `creation_date` | No clave | No | `DATETIME; NOT NULL; DEFAULT CURRENT_TIMESTAMP` |
| A10 | `paid_date` | No clave | Sí | `DATETIME; NULL permitido; DEFAULT NULL` |
| A11 | `last_update` | No clave | Sí | `DATETIME; NULL permitido; DEFAULT NULL; ON UPDATE CURRENT_TIMESTAMP` |


**Clave primaria:** ID
**Índices:** PRIMARY `PRIMARY` (ID); UNIQUE `uk_payment_reference` (provider, provider_reference); INDEX `fk_payments_buyer_orders` (order_ID)
**Reglas de integridad:** NOT NULL/NULL, DEFAULT, AUTO_INCREMENT, ON UPDATE, PK, UNIQUE, FK y CHECK según la definición SQL. Los CHECK se reproducen textualmente arriba.
**Dominio de negocio:** Los ENUM/CHECK permiten enumerar restricciones comprobables. El significado funcional de estados, códigos, unidades y nombres sin comentario SQL queda pendiente; no se infiere de DEFAULT.

## tb_people

**Nombre exacto:** `tb_people`.

**Descripción general:** Almacena los registros del concepto indicado por el nombre de la tabla. Descripción funcional inferida del nombre; el respaldo no incluye especificación externa.

**Propósito de negocio:** Inferido del nombre de la entidad y de los vínculos/columnas declarados; requiere validación funcional. No se atribuyen reglas no presentes en el dump.

**Propósito técnico:** Tabla InnoDB declarada con 12 columnas y 2 filas insertadas en este respaldo.

**Clasificación:** Maestra (inferido por nombre); asociaciones dependientes se clasifican por separado.

**Esquema relacional:** `tb_people(person_ID, user_ID, courtesy_title, given_names, family_names, birth_date, gender_ID, country_code, phone, status, creation_date, last_update)`

**Notación formal:** R(A1, A2, …, A12); **grado:** 12. **PK:** person_ID

**Relaciones y cardinalidad:** `user_ID` → `tb_users(ID)`; por cada fila dependiente, referencia 1..1 (FK NOT NULL); por cada fila padre, dependientes 0..1 (unicidad FK=sí); ON DELETE no especificado, ON UPDATE no especificado; constraint `fk_persons_user`.

| Posición | Atributo | Tipo SQL | Descripción | Clasificación | Naturaleza |
|---:|---|---|---|---|---|
| A1 | `person_ID` | `BIGINT UNSIGNED` | Identificador de la entidad indicada por el prefijo. Referencia declarada: ver PK/FK; si no hay FK, la relación semántica es inferida. | Monovalorado por fila; Almacenado; Obligatorio; PK; Multivaluación conceptual: pendiente de validar | Cualitativa nominal: identificador, no magnitud, aunque el tipo sea entero. |
| A2 | `user_ID` | `INT UNSIGNED` | Identificador de la entidad indicada por el prefijo. Referencia declarada: ver PK/FK; si no hay FK, la relación semántica es inferida. | Monovalorado por fila; Almacenado; Obligatorio; FK; UNIQUE; Multivaluación conceptual: pendiente de validar | Cualitativa nominal: identificador, no magnitud, aunque el tipo sea entero. |
| A3 | `courtesy_title` | `VARCHAR(50)` | Valor identificativo o descriptivo indicado por el nombre de la columna; interpretación funcional inferida. | Monovalorado por fila; Almacenado; Opcional; No clave; Multivaluación conceptual: pendiente de validar | Cualitativa nominal; el SQL no declara jerarquía. Interpretación de negocio pendiente. |
| A4 | `given_names` | `VARCHAR(150)` | Valor identificativo o descriptivo indicado por el nombre de la columna; interpretación funcional inferida. | Monovalorado por fila; Almacenado; Obligatorio; No clave; Multivaluación conceptual: pendiente de validar | Cualitativa nominal; el SQL no declara jerarquía. Interpretación de negocio pendiente. |
| A5 | `family_names` | `VARCHAR(150)` | Valor identificativo o descriptivo indicado por el nombre de la columna; interpretación funcional inferida. | Monovalorado por fila; Almacenado; Opcional; No clave; Multivaluación conceptual: pendiente de validar | Cualitativa nominal; el SQL no declara jerarquía. Interpretación de negocio pendiente. |
| A6 | `birth_date` | `DATE` | Fecha u hora asociada al evento nombrado; el evento exacto se infiere del nombre. | Monovalorado por fila; Almacenado; Opcional; No clave; Multivaluación conceptual: pendiente de validar | Temporal: DATE; expresa fecha/hora con la precisión inherente al tipo. |
| A7 | `gender_ID` | `TINYINT UNSIGNED` | Identificador de la entidad indicada por el prefijo. Referencia declarada: ver PK/FK; si no hay FK, la relación semántica es inferida. | Monovalorado por fila; Almacenado; Opcional; No clave; Multivaluación conceptual: pendiente de validar | Cualitativa nominal: identificador, no magnitud, aunque el tipo sea entero. |
| A8 | `country_code` | `CHAR(2)` | Cantidad o contador asociado al concepto nombrado; unidad/regla de conteo pendiente si no está declarada. | Monovalorado por fila; Almacenado; Opcional; No clave; Multivaluación conceptual: pendiente de validar | Cualitativa nominal; el SQL no declara jerarquía. Interpretación de negocio pendiente. |
| A9 | `phone` | `VARCHAR(25)` | Dato phone; interpretación basada en el nombre y pendiente de validación con reglas de aplicación. | Monovalorado por fila; Almacenado; Opcional; No clave; Multivaluación conceptual: pendiente de validar | Cualitativa nominal; el SQL no declara jerarquía. Interpretación de negocio pendiente. |
| A10 | `status` | `BIT(1)` | Estado o indicador del registro. Los valores quedan limitados únicamente por el tipo o CHECK declarado; significado funcional pendiente si no hay comentario SQL. | Monovalorado por fila; Almacenado; Obligatorio; No clave; Multivaluación conceptual: pendiente de validar | Cualitativa nominal; el SQL no declara jerarquía. Interpretación de negocio pendiente. |
| A11 | `creation_date` | `DATETIME` | Fecha u hora asociada al evento nombrado; el evento exacto se infiere del nombre. | Monovalorado por fila; Almacenado; Obligatorio; No clave; Multivaluación conceptual: pendiente de validar | Temporal: DATETIME; expresa fecha/hora con la precisión inherente al tipo. |
| A12 | `last_update` | `DATETIME` | Fecha u hora asociada al evento nombrado; el evento exacto se infiere del nombre. | Monovalorado por fila; Almacenado; Obligatorio; No clave; Multivaluación conceptual: pendiente de validar | Temporal: DATETIME; expresa fecha/hora con la precisión inherente al tipo. |

| Posición | Atributo | PK/FK/UNIQUE | NULL | Dominio técnico, DEFAULT y restricciones |
|---:|---|---|---|---|
| A1 | `person_ID` | PK | No | `BIGINT UNSIGNED; rango 0 a 18446744073709551615; NOT NULL; sin DEFAULT declarado; AUTO_INCREMENT` |
| A2 | `user_ID` | FK `fk_persons_user` → `tb_users.ID`, UNIQUE `uk_persons_user` (columna única) | No | `INT UNSIGNED; rango 0 a 4294967295; NOT NULL; sin DEFAULT declarado; participa en UNIQUE uk_persons_user (columna única)` |
| A3 | `courtesy_title` | No clave | Sí | `VARCHAR(50); longitud máxima 50; NULL permitido; DEFAULT NULL` |
| A4 | `given_names` | No clave | No | `VARCHAR(150); longitud máxima 150; NOT NULL; sin DEFAULT declarado` |
| A5 | `family_names` | No clave | Sí | `VARCHAR(150); longitud máxima 150; NULL permitido; DEFAULT NULL` |
| A6 | `birth_date` | No clave | Sí | `DATE; NULL permitido; DEFAULT NULL` |
| A7 | `gender_ID` | No clave | Sí | `TINYINT UNSIGNED; rango 0 a 255; NULL permitido; DEFAULT NULL` |
| A8 | `country_code` | No clave | Sí | `CHAR(2); longitud máxima 2; NULL permitido; DEFAULT NULL` |
| A9 | `phone` | No clave | Sí | `VARCHAR(25); longitud máxima 25; NULL permitido; DEFAULT NULL` |
| A10 | `status` | No clave | No | `BIT(1); NOT NULL; DEFAULT b'1'` |
| A11 | `creation_date` | No clave | No | `DATETIME; NOT NULL; DEFAULT CURRENT_TIMESTAMP` |
| A12 | `last_update` | No clave | No | `DATETIME; NOT NULL; DEFAULT CURRENT_TIMESTAMP; ON UPDATE CURRENT_TIMESTAMP` |


**Clave primaria:** person_ID
**Índices:** PRIMARY `PRIMARY` (person_ID); UNIQUE `uk_persons_user` (user_ID)
**Reglas de integridad:** NOT NULL/NULL, DEFAULT, AUTO_INCREMENT, ON UPDATE, PK, UNIQUE, FK y CHECK según la definición SQL. Los CHECK se reproducen textualmente arriba.
**Dominio de negocio:** Los ENUM/CHECK permiten enumerar restricciones comprobables. El significado funcional de estados, códigos, unidades y nombres sin comentario SQL queda pendiente; no se infiere de DEFAULT.

## tb_products

**Nombre exacto:** `tb_products`.

**Descripción general:** Almacena productos o asociaciones de productos, según sus atributos y referencias declaradas.

**Propósito de negocio:** Inferido del nombre de la entidad y de los vínculos/columnas declarados; requiere validación funcional. No se atribuyen reglas no presentes en el dump.

**Propósito técnico:** Tabla InnoDB declarada con 9 columnas y 15005 filas insertadas en este respaldo.

**Clasificación:** Maestra (inferido por nombre); asociaciones dependientes se clasifican por separado.

**Esquema relacional:** `tb_products(ID, SKU, name, description, current_price, current_stock, status, creation_date, last_update)`

**Notación formal:** R(A1, A2, …, A9); **grado:** 9. **PK:** ID

**Relaciones:** No hay claves foráneas declaradas en esta tabla.

| Posición | Atributo | Tipo SQL | Descripción | Clasificación | Naturaleza |
|---:|---|---|---|---|---|
| A1 | `ID` | `INT UNSIGNED` | Identificador técnico del registro. La función de identidad se respalda por PK si está declarada. | Monovalorado por fila; Almacenado; Obligatorio; PK; Multivaluación conceptual: pendiente de validar | Cualitativa nominal: identificador, no magnitud, aunque el tipo sea entero. |
| A2 | `SKU` | `VARCHAR(50)` | Dato sku; interpretación basada en el nombre y pendiente de validación con reglas de aplicación. | Monovalorado por fila; Almacenado; Obligatorio; UNIQUE; Multivaluación conceptual: pendiente de validar | Cualitativa nominal; el SQL no declara jerarquía. Interpretación de negocio pendiente. |
| A3 | `name` | `VARCHAR(250)` | Valor identificativo o descriptivo indicado por el nombre de la columna; interpretación funcional inferida. | Monovalorado por fila; Almacenado; Obligatorio; No clave; Multivaluación conceptual: pendiente de validar | Cualitativa nominal; el SQL no declara jerarquía. Interpretación de negocio pendiente. |
| A4 | `description` | `TEXT` | Contenido descriptivo relativo al concepto indicado; significado específico inferido por nombre. | Monovalorado por fila; Almacenado; Opcional; No clave; Multivaluación conceptual: pendiente de validar | Cualitativa nominal; el SQL no declara jerarquía. Interpretación de negocio pendiente. |
| A5 | `current_price` | `DECIMAL(10,2)` | Importe o magnitud del concepto indicado por el nombre; moneda y reglas de cálculo no declaradas en esta columna. | Monovalorado por fila; Almacenado; Obligatorio; No clave; Multivaluación conceptual: pendiente de validar | Cuantitativa discreta a escala 2; incremento mínimo 0.01. Dominio decimal finito, no continuo. |
| A6 | `current_stock` | `INT UNSIGNED` | Cantidad o contador asociado al concepto nombrado; unidad/regla de conteo pendiente si no está declarada. | Monovalorado por fila; Almacenado; Obligatorio; No clave; Multivaluación conceptual: pendiente de validar | Cuantitativa discreta si cuenta unidades; si codifica estado/clave, cualitativa nominal. Semántica indicada por nombre y pendiente de validar. |
| A7 | `status` | `BIT(1)` | Estado o indicador del registro. Los valores quedan limitados únicamente por el tipo o CHECK declarado; significado funcional pendiente si no hay comentario SQL. | Monovalorado por fila; Almacenado; Opcional; No clave; Multivaluación conceptual: pendiente de validar | Cualitativa nominal; el SQL no declara jerarquía. Interpretación de negocio pendiente. |
| A8 | `creation_date` | `DATETIME` | Fecha u hora asociada al evento nombrado; el evento exacto se infiere del nombre. | Monovalorado por fila; Almacenado; Obligatorio; No clave; Multivaluación conceptual: pendiente de validar | Temporal: DATETIME; expresa fecha/hora con la precisión inherente al tipo. |
| A9 | `last_update` | `DATETIME` | Fecha u hora asociada al evento nombrado; el evento exacto se infiere del nombre. | Monovalorado por fila; Almacenado; Obligatorio; No clave; Multivaluación conceptual: pendiente de validar | Temporal: DATETIME; expresa fecha/hora con la precisión inherente al tipo. |

| Posición | Atributo | PK/FK/UNIQUE | NULL | Dominio técnico, DEFAULT y restricciones |
|---:|---|---|---|---|
| A1 | `ID` | PK | No | `INT UNSIGNED; rango 0 a 4294967295; NOT NULL; sin DEFAULT declarado; AUTO_INCREMENT` |
| A2 | `SKU` | UNIQUE `SKU` (columna única) | No | `VARCHAR(50); longitud máxima 50; NOT NULL; sin DEFAULT declarado; participa en UNIQUE SKU (columna única)` |
| A3 | `name` | No clave | No | `VARCHAR(250); longitud máxima 250; NOT NULL; sin DEFAULT declarado` |
| A4 | `description` | No clave | Sí | `TEXT; máximo 65,535 bytes; NULL permitido; sin DEFAULT declarado` |
| A5 | `current_price` | No clave | No | `DECIMAL(10,2); precisión 10, escala 2, rango -99999999.99 a 99999999.99; NOT NULL; DEFAULT '0.00'` |
| A6 | `current_stock` | No clave | No | `INT UNSIGNED; rango 0 a 4294967295; NOT NULL; DEFAULT '0'` |
| A7 | `status` | No clave | Sí | `BIT(1); NULL permitido; DEFAULT b'1'` |
| A8 | `creation_date` | No clave | No | `DATETIME; NOT NULL; DEFAULT CURRENT_TIMESTAMP` |
| A9 | `last_update` | No clave | No | `DATETIME; NOT NULL; sin DEFAULT declarado; ON UPDATE CURRENT_TIMESTAMP` |


**Clave primaria:** ID
**Índices:** PRIMARY `PRIMARY` (ID); UNIQUE `SKU` (SKU)
**Reglas de integridad:** NOT NULL/NULL, DEFAULT, AUTO_INCREMENT, ON UPDATE, PK, UNIQUE, FK y CHECK según la definición SQL. Los CHECK se reproducen textualmente arriba.
**Dominio de negocio:** Los ENUM/CHECK permiten enumerar restricciones comprobables. El significado funcional de estados, códigos, unidades y nombres sin comentario SQL queda pendiente; no se infiere de DEFAULT.

## tb_refunds

**Nombre exacto:** `tb_refunds`.

**Descripción general:** Almacena los registros del concepto indicado por el nombre de la tabla. Descripción funcional inferida del nombre; el respaldo no incluye especificación externa.

**Propósito de negocio:** Inferido del nombre de la entidad y de los vínculos/columnas declarados; requiere validación funcional. No se atribuyen reglas no presentes en el dump.

**Propósito técnico:** Tabla InnoDB declarada con 15 columnas y 0 filas insertadas en este respaldo.

**Clasificación:** Transaccional (inferido por nombre).

**Esquema relacional:** `tb_refunds(ID, payment_ID, cancellation_ID, return_ID, amount, currency, refund_reason, refund_status, provider_reference, requested_date, processed_date, resolution_notes, status, creation_date, last_update)`

**Notación formal:** R(A1, A2, …, A15); **grado:** 15. **PK:** ID

**Restricciones CHECK:** CONSTRAINT `chk_refund_amount` CHECK ((`amount` > 0)); CONSTRAINT `chk_refund_origin` CHECK (((`cancellation_ID` is not null) or (`return_ID` is not null)))
**Relaciones y cardinalidad:** `cancellation_ID` → `tb_cancellations(ID)`; por cada fila dependiente, referencia 0..1 (FK nullable); por cada fila padre, dependientes 0..N (unicidad FK=no); ON DELETE no especificado, ON UPDATE no especificado; constraint `fk_refunds_cancellation`; `payment_ID` → `tb_payments(ID)`; por cada fila dependiente, referencia 1..1 (FK NOT NULL); por cada fila padre, dependientes 0..N (unicidad FK=no); ON DELETE no especificado, ON UPDATE no especificado; constraint `fk_refunds_payment`; `return_ID` → `tb_returns(ID)`; por cada fila dependiente, referencia 0..1 (FK nullable); por cada fila padre, dependientes 0..N (unicidad FK=no); ON DELETE no especificado, ON UPDATE no especificado; constraint `fk_refunds_return`.

| Posición | Atributo | Tipo SQL | Descripción | Clasificación | Naturaleza |
|---:|---|---|---|---|---|
| A1 | `ID` | `INT UNSIGNED` | Identificador técnico del registro. La función de identidad se respalda por PK si está declarada. | Monovalorado por fila; Almacenado; Obligatorio; PK; Multivaluación conceptual: pendiente de validar | Cualitativa nominal: identificador, no magnitud, aunque el tipo sea entero. |
| A2 | `payment_ID` | `INT UNSIGNED` | Identificador de la entidad indicada por el prefijo. Referencia declarada: ver PK/FK; si no hay FK, la relación semántica es inferida. | Monovalorado por fila; Almacenado; Obligatorio; FK; Multivaluación conceptual: pendiente de validar | Cualitativa nominal: identificador, no magnitud, aunque el tipo sea entero. |
| A3 | `cancellation_ID` | `INT UNSIGNED` | Identificador de la entidad indicada por el prefijo. Referencia declarada: ver PK/FK; si no hay FK, la relación semántica es inferida. | Monovalorado por fila; Almacenado; Opcional; FK; Multivaluación conceptual: pendiente de validar | Cualitativa nominal: identificador, no magnitud, aunque el tipo sea entero. |
| A4 | `return_ID` | `INT UNSIGNED` | Identificador de la entidad indicada por el prefijo. Referencia declarada: ver PK/FK; si no hay FK, la relación semántica es inferida. | Monovalorado por fila; Almacenado; Opcional; FK; Multivaluación conceptual: pendiente de validar | Cualitativa nominal: identificador, no magnitud, aunque el tipo sea entero. |
| A5 | `amount` | `DECIMAL(12,2)` | Importe o magnitud del concepto indicado por el nombre; moneda y reglas de cálculo no declaradas en esta columna. | Monovalorado por fila; Almacenado; Obligatorio; No clave; Multivaluación conceptual: pendiente de validar | Cuantitativa discreta a escala 2; incremento mínimo 0.01. Dominio decimal finito, no continuo. |
| A6 | `currency` | `CHAR(3)` | Dato currency; interpretación basada en el nombre y pendiente de validación con reglas de aplicación. | Monovalorado por fila; Almacenado; Obligatorio; No clave; Multivaluación conceptual: pendiente de validar | Cualitativa nominal; el SQL no declara jerarquía. Interpretación de negocio pendiente. |
| A7 | `refund_reason` | `VARCHAR(500)` | Contenido descriptivo relativo al concepto indicado; significado específico inferido por nombre. | Monovalorado por fila; Almacenado; Obligatorio; No clave; Multivaluación conceptual: pendiente de validar | Cualitativa nominal; el SQL no declara jerarquía. Interpretación de negocio pendiente. |
| A8 | `refund_status` | `ENUM('Requested','Approved','Processing','Completed','Rejected','Failed')` | Estado o indicador del registro. Los valores quedan limitados únicamente por el tipo o CHECK declarado; significado funcional pendiente si no hay comentario SQL. | Monovalorado por fila; Almacenado; Obligatorio; No clave; Multivaluación conceptual: pendiente de validar | Cualitativa nominal; el SQL no declara jerarquía. Interpretación de negocio pendiente. |
| A9 | `provider_reference` | `VARCHAR(150)` | Dato provider reference; interpretación basada en el nombre y pendiente de validación con reglas de aplicación. | Monovalorado por fila; Almacenado; Opcional; No clave; Multivaluación conceptual: pendiente de validar | Cualitativa nominal; el SQL no declara jerarquía. Interpretación de negocio pendiente. |
| A10 | `requested_date` | `DATETIME` | Fecha u hora asociada al evento nombrado; el evento exacto se infiere del nombre. | Monovalorado por fila; Almacenado; Obligatorio; No clave; Multivaluación conceptual: pendiente de validar | Temporal: DATETIME; expresa fecha/hora con la precisión inherente al tipo. |
| A11 | `processed_date` | `DATETIME` | Fecha u hora asociada al evento nombrado; el evento exacto se infiere del nombre. | Monovalorado por fila; Almacenado; Opcional; No clave; Multivaluación conceptual: pendiente de validar | Temporal: DATETIME; expresa fecha/hora con la precisión inherente al tipo. |
| A12 | `resolution_notes` | `TEXT` | Contenido descriptivo relativo al concepto indicado; significado específico inferido por nombre. | Monovalorado por fila; Almacenado; Opcional; No clave; Multivaluación conceptual: pendiente de validar | Cualitativa nominal; el SQL no declara jerarquía. Interpretación de negocio pendiente. |
| A13 | `status` | `BIT(1)` | Estado o indicador del registro. Los valores quedan limitados únicamente por el tipo o CHECK declarado; significado funcional pendiente si no hay comentario SQL. | Monovalorado por fila; Almacenado; Obligatorio; No clave; Multivaluación conceptual: pendiente de validar | Cualitativa nominal; el SQL no declara jerarquía. Interpretación de negocio pendiente. |
| A14 | `creation_date` | `DATETIME` | Fecha u hora asociada al evento nombrado; el evento exacto se infiere del nombre. | Monovalorado por fila; Almacenado; Obligatorio; No clave; Multivaluación conceptual: pendiente de validar | Temporal: DATETIME; expresa fecha/hora con la precisión inherente al tipo. |
| A15 | `last_update` | `DATETIME` | Fecha u hora asociada al evento nombrado; el evento exacto se infiere del nombre. | Monovalorado por fila; Almacenado; Opcional; No clave; Multivaluación conceptual: pendiente de validar | Temporal: DATETIME; expresa fecha/hora con la precisión inherente al tipo. |

| Posición | Atributo | PK/FK/UNIQUE | NULL | Dominio técnico, DEFAULT y restricciones |
|---:|---|---|---|---|
| A1 | `ID` | PK | No | `INT UNSIGNED; rango 0 a 4294967295; NOT NULL; sin DEFAULT declarado; AUTO_INCREMENT` |
| A2 | `payment_ID` | FK `fk_refunds_payment` → `tb_payments.ID` | No | `INT UNSIGNED; rango 0 a 4294967295; NOT NULL; sin DEFAULT declarado` |
| A3 | `cancellation_ID` | FK `fk_refunds_cancellation` → `tb_cancellations.ID` | Sí | `INT UNSIGNED; rango 0 a 4294967295; NULL permitido; DEFAULT NULL; CHECK: CONSTRAINT `chk_refund_origin` CHECK (((`cancellation_ID` is not null) or (`return_ID` is not null)))` |
| A4 | `return_ID` | FK `fk_refunds_return` → `tb_returns.ID` | Sí | `INT UNSIGNED; rango 0 a 4294967295; NULL permitido; DEFAULT NULL; CHECK: CONSTRAINT `chk_refund_origin` CHECK (((`cancellation_ID` is not null) or (`return_ID` is not null)))` |
| A5 | `amount` | No clave | No | `DECIMAL(12,2); precisión 12, escala 2, rango -9999999999.99 a 9999999999.99; NOT NULL; sin DEFAULT declarado; CHECK: CONSTRAINT `chk_refund_amount` CHECK ((`amount` > 0))` |
| A6 | `currency` | No clave | No | `CHAR(3); longitud máxima 3; NOT NULL; DEFAULT 'MXN'` |
| A7 | `refund_reason` | No clave | No | `VARCHAR(500); longitud máxima 500; NOT NULL; sin DEFAULT declarado` |
| A8 | `refund_status` | No clave | No | `ENUM('Requested','Approved','Processing','Completed','Rejected','Failed'); NOT NULL; DEFAULT 'Requested'` |
| A9 | `provider_reference` | No clave | Sí | `VARCHAR(150); longitud máxima 150; NULL permitido; DEFAULT NULL` |
| A10 | `requested_date` | No clave | No | `DATETIME; NOT NULL; DEFAULT CURRENT_TIMESTAMP` |
| A11 | `processed_date` | No clave | Sí | `DATETIME; NULL permitido; DEFAULT NULL` |
| A12 | `resolution_notes` | No clave | Sí | `TEXT; máximo 65,535 bytes; NULL permitido; sin DEFAULT declarado` |
| A13 | `status` | No clave | No | `BIT(1); NOT NULL; DEFAULT b'1'` |
| A14 | `creation_date` | No clave | No | `DATETIME; NOT NULL; DEFAULT CURRENT_TIMESTAMP` |
| A15 | `last_update` | No clave | Sí | `DATETIME; NULL permitido; DEFAULT NULL; ON UPDATE CURRENT_TIMESTAMP` |


**Clave primaria:** ID
**Índices:** PRIMARY `PRIMARY` (ID); INDEX `idx_refund_payment` (payment_ID); INDEX `idx_refund_cancellation` (cancellation_ID); INDEX `idx_refund_return` (return_ID)
**Reglas de integridad:** NOT NULL/NULL, DEFAULT, AUTO_INCREMENT, ON UPDATE, PK, UNIQUE, FK y CHECK según la definición SQL. Los CHECK se reproducen textualmente arriba.
**Dominio de negocio:** Los ENUM/CHECK permiten enumerar restricciones comprobables. El significado funcional de estados, códigos, unidades y nombres sin comentario SQL queda pendiente; no se infiere de DEFAULT.

## tb_returns

**Nombre exacto:** `tb_returns`.

**Descripción general:** Almacena los registros del concepto indicado por el nombre de la tabla. Descripción funcional inferida del nombre; el respaldo no incluye especificación externa.

**Propósito de negocio:** Inferido del nombre de la entidad y de los vínculos/columnas declarados; requiere validación funcional. No se atribuyen reglas no presentes en el dump.

**Propósito técnico:** Tabla InnoDB declarada con 14 columnas y 0 filas insertadas en este respaldo.

**Clasificación:** Transaccional (inferido por nombre).

**Esquema relacional:** `tb_returns(ID, buyer_order_ID, order_item_ID, user_ID, quantity, return_reason, return_status, requested_date, received_date, resolved_date, resolution_notes, status, creation_date, last_update)`

**Notación formal:** R(A1, A2, …, A14); **grado:** 14. **PK:** ID

**Restricciones CHECK:** CONSTRAINT `chk_return_quantity` CHECK ((`quantity` > 0))
**Relaciones y cardinalidad:** `order_item_ID` → `tbd_order_items(ID)`; por cada fila dependiente, referencia 1..1 (FK NOT NULL); por cada fila padre, dependientes 0..N (unicidad FK=no); ON DELETE no especificado, ON UPDATE no especificado; constraint `fk_returns_item`; `buyer_order_ID` → `tb_buyer_orders(ID)`; por cada fila dependiente, referencia 1..1 (FK NOT NULL); por cada fila padre, dependientes 0..N (unicidad FK=no); ON DELETE no especificado, ON UPDATE no especificado; constraint `fk_returns_order`; `user_ID` → `tb_users(ID)`; por cada fila dependiente, referencia 1..1 (FK NOT NULL); por cada fila padre, dependientes 0..N (unicidad FK=no); ON DELETE no especificado, ON UPDATE no especificado; constraint `fk_returns_user`.

| Posición | Atributo | Tipo SQL | Descripción | Clasificación | Naturaleza |
|---:|---|---|---|---|---|
| A1 | `ID` | `INT UNSIGNED` | Identificador técnico del registro. La función de identidad se respalda por PK si está declarada. | Monovalorado por fila; Almacenado; Obligatorio; PK; Multivaluación conceptual: pendiente de validar | Cualitativa nominal: identificador, no magnitud, aunque el tipo sea entero. |
| A2 | `buyer_order_ID` | `INT UNSIGNED` | Identificador de la entidad indicada por el prefijo. Referencia declarada: ver PK/FK; si no hay FK, la relación semántica es inferida. | Monovalorado por fila; Almacenado; Obligatorio; FK; Multivaluación conceptual: pendiente de validar | Cualitativa nominal: identificador, no magnitud, aunque el tipo sea entero. |
| A3 | `order_item_ID` | `INT UNSIGNED` | Identificador de la entidad indicada por el prefijo. Referencia declarada: ver PK/FK; si no hay FK, la relación semántica es inferida. | Monovalorado por fila; Almacenado; Obligatorio; FK; Multivaluación conceptual: pendiente de validar | Cualitativa nominal: identificador, no magnitud, aunque el tipo sea entero. |
| A4 | `user_ID` | `INT UNSIGNED` | Identificador de la entidad indicada por el prefijo. Referencia declarada: ver PK/FK; si no hay FK, la relación semántica es inferida. | Monovalorado por fila; Almacenado; Obligatorio; FK; Multivaluación conceptual: pendiente de validar | Cualitativa nominal: identificador, no magnitud, aunque el tipo sea entero. |
| A5 | `quantity` | `INT UNSIGNED` | Cantidad o contador asociado al concepto nombrado; unidad/regla de conteo pendiente si no está declarada. | Monovalorado por fila; Almacenado; Obligatorio; No clave; Multivaluación conceptual: pendiente de validar | Cuantitativa discreta si cuenta unidades; si codifica estado/clave, cualitativa nominal. Semántica indicada por nombre y pendiente de validar. |
| A6 | `return_reason` | `VARCHAR(500)` | Contenido descriptivo relativo al concepto indicado; significado específico inferido por nombre. | Monovalorado por fila; Almacenado; Obligatorio; No clave; Multivaluación conceptual: pendiente de validar | Cualitativa nominal; el SQL no declara jerarquía. Interpretación de negocio pendiente. |
| A7 | `return_status` | `ENUM('Requested','Authorized','Rejected','InTransit','Received','Inspected','Completed')` | Estado o indicador del registro. Los valores quedan limitados únicamente por el tipo o CHECK declarado; significado funcional pendiente si no hay comentario SQL. | Monovalorado por fila; Almacenado; Obligatorio; No clave; Multivaluación conceptual: pendiente de validar | Cualitativa nominal; el SQL no declara jerarquía. Interpretación de negocio pendiente. |
| A8 | `requested_date` | `DATETIME` | Fecha u hora asociada al evento nombrado; el evento exacto se infiere del nombre. | Monovalorado por fila; Almacenado; Obligatorio; No clave; Multivaluación conceptual: pendiente de validar | Temporal: DATETIME; expresa fecha/hora con la precisión inherente al tipo. |
| A9 | `received_date` | `DATETIME` | Fecha u hora asociada al evento nombrado; el evento exacto se infiere del nombre. | Monovalorado por fila; Almacenado; Opcional; No clave; Multivaluación conceptual: pendiente de validar | Temporal: DATETIME; expresa fecha/hora con la precisión inherente al tipo. |
| A10 | `resolved_date` | `DATETIME` | Fecha u hora asociada al evento nombrado; el evento exacto se infiere del nombre. | Monovalorado por fila; Almacenado; Opcional; No clave; Multivaluación conceptual: pendiente de validar | Temporal: DATETIME; expresa fecha/hora con la precisión inherente al tipo. |
| A11 | `resolution_notes` | `TEXT` | Contenido descriptivo relativo al concepto indicado; significado específico inferido por nombre. | Monovalorado por fila; Almacenado; Opcional; No clave; Multivaluación conceptual: pendiente de validar | Cualitativa nominal; el SQL no declara jerarquía. Interpretación de negocio pendiente. |
| A12 | `status` | `BIT(1)` | Estado o indicador del registro. Los valores quedan limitados únicamente por el tipo o CHECK declarado; significado funcional pendiente si no hay comentario SQL. | Monovalorado por fila; Almacenado; Obligatorio; No clave; Multivaluación conceptual: pendiente de validar | Cualitativa nominal; el SQL no declara jerarquía. Interpretación de negocio pendiente. |
| A13 | `creation_date` | `DATETIME` | Fecha u hora asociada al evento nombrado; el evento exacto se infiere del nombre. | Monovalorado por fila; Almacenado; Obligatorio; No clave; Multivaluación conceptual: pendiente de validar | Temporal: DATETIME; expresa fecha/hora con la precisión inherente al tipo. |
| A14 | `last_update` | `DATETIME` | Fecha u hora asociada al evento nombrado; el evento exacto se infiere del nombre. | Monovalorado por fila; Almacenado; Opcional; No clave; Multivaluación conceptual: pendiente de validar | Temporal: DATETIME; expresa fecha/hora con la precisión inherente al tipo. |

| Posición | Atributo | PK/FK/UNIQUE | NULL | Dominio técnico, DEFAULT y restricciones |
|---:|---|---|---|---|
| A1 | `ID` | PK | No | `INT UNSIGNED; rango 0 a 4294967295; NOT NULL; sin DEFAULT declarado; AUTO_INCREMENT` |
| A2 | `buyer_order_ID` | FK `fk_returns_order` → `tb_buyer_orders.ID` | No | `INT UNSIGNED; rango 0 a 4294967295; NOT NULL; sin DEFAULT declarado` |
| A3 | `order_item_ID` | FK `fk_returns_item` → `tbd_order_items.ID` | No | `INT UNSIGNED; rango 0 a 4294967295; NOT NULL; sin DEFAULT declarado` |
| A4 | `user_ID` | FK `fk_returns_user` → `tb_users.ID` | No | `INT UNSIGNED; rango 0 a 4294967295; NOT NULL; sin DEFAULT declarado` |
| A5 | `quantity` | No clave | No | `INT UNSIGNED; rango 0 a 4294967295; NOT NULL; DEFAULT '1'; CHECK: CONSTRAINT `chk_return_quantity` CHECK ((`quantity` > 0))` |
| A6 | `return_reason` | No clave | No | `VARCHAR(500); longitud máxima 500; NOT NULL; sin DEFAULT declarado` |
| A7 | `return_status` | No clave | No | `ENUM('Requested','Authorized','Rejected','InTransit','Received','Inspected','Completed'); NOT NULL; DEFAULT 'Requested'` |
| A8 | `requested_date` | No clave | No | `DATETIME; NOT NULL; DEFAULT CURRENT_TIMESTAMP` |
| A9 | `received_date` | No clave | Sí | `DATETIME; NULL permitido; DEFAULT NULL` |
| A10 | `resolved_date` | No clave | Sí | `DATETIME; NULL permitido; DEFAULT NULL` |
| A11 | `resolution_notes` | No clave | Sí | `TEXT; máximo 65,535 bytes; NULL permitido; sin DEFAULT declarado` |
| A12 | `status` | No clave | No | `BIT(1); NOT NULL; DEFAULT b'1'` |
| A13 | `creation_date` | No clave | No | `DATETIME; NOT NULL; DEFAULT CURRENT_TIMESTAMP` |
| A14 | `last_update` | No clave | Sí | `DATETIME; NULL permitido; DEFAULT NULL; ON UPDATE CURRENT_TIMESTAMP` |


**Clave primaria:** ID
**Índices:** PRIMARY `PRIMARY` (ID); INDEX `idx_return_order` (buyer_order_ID); INDEX `idx_return_item` (order_item_ID); INDEX `idx_return_user` (user_ID)
**Reglas de integridad:** NOT NULL/NULL, DEFAULT, AUTO_INCREMENT, ON UPDATE, PK, UNIQUE, FK y CHECK según la definición SQL. Los CHECK se reproducen textualmente arriba.
**Dominio de negocio:** Los ENUM/CHECK permiten enumerar restricciones comprobables. El significado funcional de estados, códigos, unidades y nombres sin comentario SQL queda pendiente; no se infiere de DEFAULT.

## tb_shipments

**Nombre exacto:** `tb_shipments`.

**Descripción general:** Almacena los registros del concepto indicado por el nombre de la tabla. Descripción funcional inferida del nombre; el respaldo no incluye especificación externa.

**Propósito de negocio:** Inferido del nombre de la entidad y de los vínculos/columnas declarados; requiere validación funcional. No se atribuyen reglas no presentes en el dump.

**Propósito técnico:** Tabla InnoDB declarada con 13 columnas y 0 filas insertadas en este respaldo.

**Clasificación:** Transaccional (inferido por nombre).

**Esquema relacional:** `tb_shipments(ID, buyer_order_ID, address_ID, carrier, tracking_number, shipping_cost, shipment_status, shipped_date, estimated_delivery_date, delivered_date, status, creation_date, last_update)`

**Notación formal:** R(A1, A2, …, A13); **grado:** 13. **PK:** ID

**Restricciones CHECK:** CONSTRAINT `chk_shipment_cost` CHECK ((`shipping_cost` >= 0))
**Relaciones y cardinalidad:** `address_ID` → `tb_user_addresses(ID)`; por cada fila dependiente, referencia 1..1 (FK NOT NULL); por cada fila padre, dependientes 0..N (unicidad FK=no); ON DELETE no especificado, ON UPDATE no especificado; constraint `fk_shipments_address`; `buyer_order_ID` → `tb_buyer_orders(ID)`; por cada fila dependiente, referencia 1..1 (FK NOT NULL); por cada fila padre, dependientes 0..N (unicidad FK=no); ON DELETE no especificado, ON UPDATE no especificado; constraint `fk_shipments_order`.

| Posición | Atributo | Tipo SQL | Descripción | Clasificación | Naturaleza |
|---:|---|---|---|---|---|
| A1 | `ID` | `INT UNSIGNED` | Identificador técnico del registro. La función de identidad se respalda por PK si está declarada. | Monovalorado por fila; Almacenado; Obligatorio; PK; Multivaluación conceptual: pendiente de validar | Cualitativa nominal: identificador, no magnitud, aunque el tipo sea entero. |
| A2 | `buyer_order_ID` | `INT UNSIGNED` | Identificador de la entidad indicada por el prefijo. Referencia declarada: ver PK/FK; si no hay FK, la relación semántica es inferida. | Monovalorado por fila; Almacenado; Obligatorio; FK; Multivaluación conceptual: pendiente de validar | Cualitativa nominal: identificador, no magnitud, aunque el tipo sea entero. |
| A3 | `address_ID` | `BIGINT UNSIGNED` | Identificador de la entidad indicada por el prefijo. Referencia declarada: ver PK/FK; si no hay FK, la relación semántica es inferida. | Monovalorado por fila; Almacenado; Obligatorio; FK; Multivaluación conceptual: pendiente de validar | Cualitativa nominal: identificador, no magnitud, aunque el tipo sea entero. |
| A4 | `carrier` | `VARCHAR(100)` | Dato carrier; interpretación basada en el nombre y pendiente de validación con reglas de aplicación. | Monovalorado por fila; Almacenado; Opcional; UNIQUE; Multivaluación conceptual: pendiente de validar | Cualitativa nominal; el SQL no declara jerarquía. Interpretación de negocio pendiente. |
| A5 | `tracking_number` | `VARCHAR(150)` | Cantidad o contador asociado al concepto nombrado; unidad/regla de conteo pendiente si no está declarada. | Monovalorado por fila; Almacenado; Opcional; UNIQUE; Multivaluación conceptual: pendiente de validar | Cualitativa nominal; el SQL no declara jerarquía. Interpretación de negocio pendiente. |
| A6 | `shipping_cost` | `DECIMAL(12,2)` | Importe o magnitud del concepto indicado por el nombre; moneda y reglas de cálculo no declaradas en esta columna. | Monovalorado por fila; Almacenado; Obligatorio; No clave; Multivaluación conceptual: pendiente de validar | Cuantitativa discreta a escala 2; incremento mínimo 0.01. Dominio decimal finito, no continuo. |
| A7 | `shipment_status` | `ENUM('Pending','Preparing','Shipped','InTransit','Delivered','Failed','Returned')` | Estado o indicador del registro. Los valores quedan limitados únicamente por el tipo o CHECK declarado; significado funcional pendiente si no hay comentario SQL. | Monovalorado por fila; Almacenado; Obligatorio; No clave; Multivaluación conceptual: pendiente de validar | Cualitativa nominal; el SQL no declara jerarquía. Interpretación de negocio pendiente. |
| A8 | `shipped_date` | `DATETIME` | Fecha u hora asociada al evento nombrado; el evento exacto se infiere del nombre. | Monovalorado por fila; Almacenado; Opcional; No clave; Multivaluación conceptual: pendiente de validar | Temporal: DATETIME; expresa fecha/hora con la precisión inherente al tipo. |
| A9 | `estimated_delivery_date` | `DATETIME` | Fecha u hora asociada al evento nombrado; el evento exacto se infiere del nombre. | Monovalorado por fila; Almacenado; Opcional; No clave; Multivaluación conceptual: pendiente de validar | Temporal: DATETIME; expresa fecha/hora con la precisión inherente al tipo. |
| A10 | `delivered_date` | `DATETIME` | Fecha u hora asociada al evento nombrado; el evento exacto se infiere del nombre. | Monovalorado por fila; Almacenado; Opcional; No clave; Multivaluación conceptual: pendiente de validar | Temporal: DATETIME; expresa fecha/hora con la precisión inherente al tipo. |
| A11 | `status` | `BIT(1)` | Estado o indicador del registro. Los valores quedan limitados únicamente por el tipo o CHECK declarado; significado funcional pendiente si no hay comentario SQL. | Monovalorado por fila; Almacenado; Obligatorio; No clave; Multivaluación conceptual: pendiente de validar | Cualitativa nominal; el SQL no declara jerarquía. Interpretación de negocio pendiente. |
| A12 | `creation_date` | `DATETIME` | Fecha u hora asociada al evento nombrado; el evento exacto se infiere del nombre. | Monovalorado por fila; Almacenado; Obligatorio; No clave; Multivaluación conceptual: pendiente de validar | Temporal: DATETIME; expresa fecha/hora con la precisión inherente al tipo. |
| A13 | `last_update` | `DATETIME` | Fecha u hora asociada al evento nombrado; el evento exacto se infiere del nombre. | Monovalorado por fila; Almacenado; Opcional; No clave; Multivaluación conceptual: pendiente de validar | Temporal: DATETIME; expresa fecha/hora con la precisión inherente al tipo. |

| Posición | Atributo | PK/FK/UNIQUE | NULL | Dominio técnico, DEFAULT y restricciones |
|---:|---|---|---|---|
| A1 | `ID` | PK | No | `INT UNSIGNED; rango 0 a 4294967295; NOT NULL; sin DEFAULT declarado; AUTO_INCREMENT` |
| A2 | `buyer_order_ID` | FK `fk_shipments_order` → `tb_buyer_orders.ID` | No | `INT UNSIGNED; rango 0 a 4294967295; NOT NULL; sin DEFAULT declarado` |
| A3 | `address_ID` | FK `fk_shipments_address` → `tb_user_addresses.ID` | No | `BIGINT UNSIGNED; rango 0 a 18446744073709551615; NOT NULL; sin DEFAULT declarado` |
| A4 | `carrier` | UNIQUE `uk_shipment_tracking` (clave compuesta) | Sí | `VARCHAR(100); longitud máxima 100; NULL permitido; DEFAULT NULL; participa en UNIQUE uk_shipment_tracking (compuesto)` |
| A5 | `tracking_number` | UNIQUE `uk_shipment_tracking` (clave compuesta) | Sí | `VARCHAR(150); longitud máxima 150; NULL permitido; DEFAULT NULL; participa en UNIQUE uk_shipment_tracking (compuesto)` |
| A6 | `shipping_cost` | No clave | No | `DECIMAL(12,2); precisión 12, escala 2, rango -9999999999.99 a 9999999999.99; NOT NULL; DEFAULT '0.00'; CHECK: CONSTRAINT `chk_shipment_cost` CHECK ((`shipping_cost` >= 0))` |
| A7 | `shipment_status` | No clave | No | `ENUM('Pending','Preparing','Shipped','InTransit','Delivered','Failed','Returned'); NOT NULL; DEFAULT 'Pending'` |
| A8 | `shipped_date` | No clave | Sí | `DATETIME; NULL permitido; DEFAULT NULL` |
| A9 | `estimated_delivery_date` | No clave | Sí | `DATETIME; NULL permitido; DEFAULT NULL` |
| A10 | `delivered_date` | No clave | Sí | `DATETIME; NULL permitido; DEFAULT NULL` |
| A11 | `status` | No clave | No | `BIT(1); NOT NULL; DEFAULT b'1'` |
| A12 | `creation_date` | No clave | No | `DATETIME; NOT NULL; DEFAULT CURRENT_TIMESTAMP` |
| A13 | `last_update` | No clave | Sí | `DATETIME; NULL permitido; DEFAULT NULL; ON UPDATE CURRENT_TIMESTAMP` |


**Clave primaria:** ID
**Índices:** PRIMARY `PRIMARY` (ID); UNIQUE `uk_shipment_tracking` (carrier, tracking_number); INDEX `idx_shipment_order` (buyer_order_ID); INDEX `idx_shipment_address` (address_ID)
**Reglas de integridad:** NOT NULL/NULL, DEFAULT, AUTO_INCREMENT, ON UPDATE, PK, UNIQUE, FK y CHECK según la definición SQL. Los CHECK se reproducen textualmente arriba.
**Dominio de negocio:** Los ENUM/CHECK permiten enumerar restricciones comprobables. El significado funcional de estados, códigos, unidades y nombres sin comentario SQL queda pendiente; no se infiere de DEFAULT.

## tb_user_addresses

**Nombre exacto:** `tb_user_addresses`.

**Descripción general:** Almacena usuarios o datos/asociaciones ligados a usuarios, según sus atributos y referencias declaradas.

**Propósito de negocio:** Inferido del nombre de la entidad y de los vínculos/columnas declarados; requiere validación funcional. No se atribuyen reglas no presentes en el dump.

**Propósito técnico:** Tabla InnoDB declarada con 12 columnas y 0 filas insertadas en este respaldo.

**Clasificación:** Maestra (inferido por nombre); asociaciones dependientes se clasifican por separado.

**Esquema relacional:** `tb_user_addresses(ID, user_ID, address_label, recipient_name, recipient_phone, delivery_instructions, latitude, longitude, is_default, status, creation_date, last_update)`

**Notación formal:** R(A1, A2, …, A12); **grado:** 12. **PK:** ID

**Restricciones CHECK:** CONSTRAINT `chk_coordinates` CHECK ((((`latitude` is null) and (`longitude` is null)) or ((`latitude` is not null) and (`longitude` is not null)))); CONSTRAINT `chk_latitude` CHECK ((`latitude` between -(90) and 90)); CONSTRAINT `chk_longitude` CHECK ((`longitude` between -(180) and 180))
**Relaciones y cardinalidad:** `user_ID` → `tb_users(ID)`; por cada fila dependiente, referencia 1..1 (FK NOT NULL); por cada fila padre, dependientes 0..N (unicidad FK=no); ON DELETE no especificado, ON UPDATE no especificado; constraint `fk_addresses_user`.

| Posición | Atributo | Tipo SQL | Descripción | Clasificación | Naturaleza |
|---:|---|---|---|---|---|
| A1 | `ID` | `BIGINT UNSIGNED` | Identificador técnico del registro. La función de identidad se respalda por PK si está declarada. | Monovalorado por fila; Almacenado; Obligatorio; PK; Multivaluación conceptual: pendiente de validar | Cualitativa nominal: identificador, no magnitud, aunque el tipo sea entero. |
| A2 | `user_ID` | `INT UNSIGNED` | Identificador de la entidad indicada por el prefijo. Referencia declarada: ver PK/FK; si no hay FK, la relación semántica es inferida. | Monovalorado por fila; Almacenado; Obligatorio; FK; Multivaluación conceptual: pendiente de validar | Cualitativa nominal: identificador, no magnitud, aunque el tipo sea entero. |
| A3 | `address_label` | `VARCHAR(100)` | Contenido descriptivo relativo al concepto indicado; significado específico inferido por nombre. | Monovalorado por fila; Almacenado; Obligatorio; No clave; Multivaluación conceptual: pendiente de validar | Cualitativa nominal; el SQL no declara jerarquía. Interpretación de negocio pendiente. |
| A4 | `recipient_name` | `VARCHAR(150)` | Valor identificativo o descriptivo indicado por el nombre de la columna; interpretación funcional inferida. | Monovalorado por fila; Almacenado; Opcional; No clave; Multivaluación conceptual: pendiente de validar | Cualitativa nominal; el SQL no declara jerarquía. Interpretación de negocio pendiente. |
| A5 | `recipient_phone` | `VARCHAR(25)` | Dato recipient phone; interpretación basada en el nombre y pendiente de validación con reglas de aplicación. | Monovalorado por fila; Almacenado; Opcional; No clave; Multivaluación conceptual: pendiente de validar | Cualitativa nominal; el SQL no declara jerarquía. Interpretación de negocio pendiente. |
| A6 | `delivery_instructions` | `VARCHAR(500)` | Dato delivery instructions; interpretación basada en el nombre y pendiente de validación con reglas de aplicación. | Monovalorado por fila; Almacenado; Opcional; No clave; Multivaluación conceptual: pendiente de validar | Cualitativa nominal; el SQL no declara jerarquía. Interpretación de negocio pendiente. |
| A7 | `latitude` | `DECIMAL(10,7)` | Dato latitude; interpretación basada en el nombre y pendiente de validación con reglas de aplicación. | Monovalorado por fila; Almacenado; Opcional; No clave; Multivaluación conceptual: pendiente de validar | Cuantitativa discreta a escala 7; incremento mínimo 0.0000001. Dominio decimal finito, no continuo. |
| A8 | `longitude` | `DECIMAL(10,7)` | Dato longitude; interpretación basada en el nombre y pendiente de validación con reglas de aplicación. | Monovalorado por fila; Almacenado; Opcional; No clave; Multivaluación conceptual: pendiente de validar | Cuantitativa discreta a escala 7; incremento mínimo 0.0000001. Dominio decimal finito, no continuo. |
| A9 | `is_default` | `TINYINT(1)` | Dato is default; interpretación basada en el nombre y pendiente de validación con reglas de aplicación. | Monovalorado por fila; Almacenado; Obligatorio; No clave; Multivaluación conceptual: pendiente de validar | Cuantitativa discreta si cuenta unidades; si codifica estado/clave, cualitativa nominal. Semántica indicada por nombre y pendiente de validar. |
| A10 | `status` | `BIT(1)` | Estado o indicador del registro. Los valores quedan limitados únicamente por el tipo o CHECK declarado; significado funcional pendiente si no hay comentario SQL. | Monovalorado por fila; Almacenado; Obligatorio; No clave; Multivaluación conceptual: pendiente de validar | Cualitativa nominal; el SQL no declara jerarquía. Interpretación de negocio pendiente. |
| A11 | `creation_date` | `DATETIME` | Fecha u hora asociada al evento nombrado; el evento exacto se infiere del nombre. | Monovalorado por fila; Almacenado; Obligatorio; No clave; Multivaluación conceptual: pendiente de validar | Temporal: DATETIME; expresa fecha/hora con la precisión inherente al tipo. |
| A12 | `last_update` | `DATETIME` | Fecha u hora asociada al evento nombrado; el evento exacto se infiere del nombre. | Monovalorado por fila; Almacenado; Opcional; No clave; Multivaluación conceptual: pendiente de validar | Temporal: DATETIME; expresa fecha/hora con la precisión inherente al tipo. |

| Posición | Atributo | PK/FK/UNIQUE | NULL | Dominio técnico, DEFAULT y restricciones |
|---:|---|---|---|---|
| A1 | `ID` | PK | No | `BIGINT UNSIGNED; rango 0 a 18446744073709551615; NOT NULL; sin DEFAULT declarado; AUTO_INCREMENT` |
| A2 | `user_ID` | FK `fk_addresses_user` → `tb_users.ID` | No | `INT UNSIGNED; rango 0 a 4294967295; NOT NULL; sin DEFAULT declarado` |
| A3 | `address_label` | No clave | No | `VARCHAR(100); longitud máxima 100; NOT NULL; sin DEFAULT declarado` |
| A4 | `recipient_name` | No clave | Sí | `VARCHAR(150); longitud máxima 150; NULL permitido; DEFAULT NULL` |
| A5 | `recipient_phone` | No clave | Sí | `VARCHAR(25); longitud máxima 25; NULL permitido; DEFAULT NULL` |
| A6 | `delivery_instructions` | No clave | Sí | `VARCHAR(500); longitud máxima 500; NULL permitido; DEFAULT NULL` |
| A7 | `latitude` | No clave | Sí | `DECIMAL(10,7); precisión 10, escala 7, rango -999.9999999 a 999.9999999; NULL permitido; DEFAULT NULL; CHECK: CONSTRAINT `chk_coordinates` CHECK ((((`latitude` is null) and (`longitude` is null)) or ((`latitude` is not null) and (`longitude` is not null)))); CHECK: CONSTRAINT `chk_latitude` CHECK ((`latitude` between -(90) and 90))` |
| A8 | `longitude` | No clave | Sí | `DECIMAL(10,7); precisión 10, escala 7, rango -999.9999999 a 999.9999999; NULL permitido; DEFAULT NULL; CHECK: CONSTRAINT `chk_coordinates` CHECK ((((`latitude` is null) and (`longitude` is null)) or ((`latitude` is not null) and (`longitude` is not null)))); CHECK: CONSTRAINT `chk_longitude` CHECK ((`longitude` between -(180) and 180))` |
| A9 | `is_default` | No clave | No | `TINYINT(1); NOT NULL; DEFAULT '0'` |
| A10 | `status` | No clave | No | `BIT(1); NOT NULL; DEFAULT b'1'` |
| A11 | `creation_date` | No clave | No | `DATETIME; NOT NULL; DEFAULT CURRENT_TIMESTAMP` |
| A12 | `last_update` | No clave | Sí | `DATETIME; NULL permitido; DEFAULT NULL; ON UPDATE CURRENT_TIMESTAMP` |


**Clave primaria:** ID
**Índices:** PRIMARY `PRIMARY` (ID); INDEX `idx_user_addresses` (user_ID)
**Reglas de integridad:** NOT NULL/NULL, DEFAULT, AUTO_INCREMENT, ON UPDATE, PK, UNIQUE, FK y CHECK según la definición SQL. Los CHECK se reproducen textualmente arriba.
**Dominio de negocio:** Los ENUM/CHECK permiten enumerar restricciones comprobables. El significado funcional de estados, códigos, unidades y nombres sin comentario SQL queda pendiente; no se infiere de DEFAULT.

## tb_users

**Nombre exacto:** `tb_users`.

**Descripción general:** Almacena usuarios o datos/asociaciones ligados a usuarios, según sus atributos y referencias declaradas.

**Propósito de negocio:** Inferido del nombre de la entidad y de los vínculos/columnas declarados; requiere validación funcional. No se atribuyen reglas no presentes en el dump.

**Propósito técnico:** Tabla InnoDB declarada con 8 columnas y 11 filas insertadas en este respaldo.

**Clasificación:** Maestra (inferido por nombre); asociaciones dependientes se clasifican por separado.

**Esquema relacional:** `tb_users(ID, email, nick, password, creation_date, last_update, last_login, status)`

**Notación formal:** R(A1, A2, …, A8); **grado:** 8. **PK:** ID

**Relaciones:** No hay claves foráneas declaradas en esta tabla.

| Posición | Atributo | Tipo SQL | Descripción | Clasificación | Naturaleza |
|---:|---|---|---|---|---|
| A1 | `ID` | `INT UNSIGNED` | Identificador técnico del registro. La función de identidad se respalda por PK si está declarada. | Monovalorado por fila; Almacenado; Obligatorio; PK; Multivaluación conceptual: pendiente de validar | Cualitativa nominal: identificador, no magnitud, aunque el tipo sea entero. |
| A2 | `email` | `VARCHAR(80)` | Valor identificativo o descriptivo indicado por el nombre de la columna; interpretación funcional inferida. | Monovalorado por fila; Almacenado; Obligatorio; UNIQUE; Multivaluación conceptual: pendiente de validar | Cualitativa nominal; el SQL no declara jerarquía. Interpretación de negocio pendiente. |
| A3 | `nick` | `VARCHAR(100)` | Dato nick; interpretación basada en el nombre y pendiente de validación con reglas de aplicación. | Monovalorado por fila; Almacenado; Obligatorio; UNIQUE; Multivaluación conceptual: pendiente de validar | Cualitativa nominal; el SQL no declara jerarquía. Interpretación de negocio pendiente. |
| A4 | `password` | `VARCHAR(255)` | Dato password; interpretación basada en el nombre y pendiente de validación con reglas de aplicación. | Monovalorado por fila; Almacenado; Obligatorio; No clave; Multivaluación conceptual: pendiente de validar | Cualitativa nominal; el SQL no declara jerarquía. Interpretación de negocio pendiente. |
| A5 | `creation_date` | `DATETIME` | Fecha u hora asociada al evento nombrado; el evento exacto se infiere del nombre. | Monovalorado por fila; Almacenado; Obligatorio; No clave; Multivaluación conceptual: pendiente de validar | Temporal: DATETIME; expresa fecha/hora con la precisión inherente al tipo. |
| A6 | `last_update` | `DATETIME` | Fecha u hora asociada al evento nombrado; el evento exacto se infiere del nombre. | Monovalorado por fila; Almacenado; Opcional; No clave; Multivaluación conceptual: pendiente de validar | Temporal: DATETIME; expresa fecha/hora con la precisión inherente al tipo. |
| A7 | `last_login` | `DATETIME` | Dato last login; interpretación basada en el nombre y pendiente de validación con reglas de aplicación. | Monovalorado por fila; Almacenado; Opcional; No clave; Multivaluación conceptual: pendiente de validar | Temporal: DATETIME; expresa fecha/hora con la precisión inherente al tipo. |
| A8 | `status` | `BIT(1)` | Estado o indicador del registro. Los valores quedan limitados únicamente por el tipo o CHECK declarado; significado funcional pendiente si no hay comentario SQL. | Monovalorado por fila; Almacenado; Obligatorio; No clave; Multivaluación conceptual: pendiente de validar | Cualitativa nominal; el SQL no declara jerarquía. Interpretación de negocio pendiente. |

| Posición | Atributo | PK/FK/UNIQUE | NULL | Dominio técnico, DEFAULT y restricciones |
|---:|---|---|---|---|
| A1 | `ID` | PK | No | `INT UNSIGNED; rango 0 a 4294967295; NOT NULL; sin DEFAULT declarado; AUTO_INCREMENT` |
| A2 | `email` | UNIQUE `email` (columna única) | No | `VARCHAR(80); longitud máxima 80; NOT NULL; sin DEFAULT declarado; participa en UNIQUE email (columna única)` |
| A3 | `nick` | UNIQUE `nickname` (columna única) | No | `VARCHAR(100); longitud máxima 100; NOT NULL; sin DEFAULT declarado; participa en UNIQUE nickname (columna única)` |
| A4 | `password` | No clave | No | `VARCHAR(255); longitud máxima 255; NOT NULL; sin DEFAULT declarado` |
| A5 | `creation_date` | No clave | No | `DATETIME; NOT NULL; DEFAULT CURRENT_TIMESTAMP` |
| A6 | `last_update` | No clave | Sí | `DATETIME; NULL permitido; DEFAULT CURRENT_TIMESTAMP; ON UPDATE CURRENT_TIMESTAMP` |
| A7 | `last_login` | No clave | Sí | `DATETIME; NULL permitido; DEFAULT NULL` |
| A8 | `status` | No clave | No | `BIT(1); NOT NULL; DEFAULT b'1'` |


**Clave primaria:** ID
**Índices:** PRIMARY `PRIMARY` (ID); UNIQUE `email` (email); UNIQUE `nickname` (nick)
**Reglas de integridad:** NOT NULL/NULL, DEFAULT, AUTO_INCREMENT, ON UPDATE, PK, UNIQUE, FK y CHECK según la definición SQL. Los CHECK se reproducen textualmente arriba.
**Dominio de negocio:** Los ENUM/CHECK permiten enumerar restricciones comprobables. El significado funcional de estados, códigos, unidades y nombres sin comentario SQL queda pendiente; no se infiere de DEFAULT.

## tbc_categories

**Nombre exacto:** `tbc_categories`.

**Descripción general:** Proporciona valores de referencia/clasificación identificados por el nombre y las columnas.

**Propósito de negocio:** Inferido del nombre de la entidad y de los vínculos/columnas declarados; requiere validación funcional. No se atribuyen reglas no presentes en el dump.

**Propósito técnico:** Tabla InnoDB declarada con 7 columnas y 101 filas insertadas en este respaldo.

**Clasificación:** Catálogo (inferido por prefijo/nombre).

**Esquema relacional:** `tbc_categories(ID, name, description, sup_id_category, status, creation_date, last_update)`

**Notación formal:** R(A1, A2, …, A7); **grado:** 7. **PK:** ID

**Relaciones y cardinalidad:** `sup_id_category` → `tbc_categories(ID)`; por cada fila dependiente, referencia 0..1 (FK nullable); por cada fila padre, dependientes 0..N (unicidad FK=no); ON DELETE no especificado, ON UPDATE no especificado; constraint `fk_superior_category`.

| Posición | Atributo | Tipo SQL | Descripción | Clasificación | Naturaleza |
|---:|---|---|---|---|---|
| A1 | `ID` | `INT UNSIGNED` | Identificador técnico del registro. La función de identidad se respalda por PK si está declarada. | Monovalorado por fila; Almacenado; Obligatorio; PK; Multivaluación conceptual: pendiente de validar | Cualitativa nominal: identificador, no magnitud, aunque el tipo sea entero. |
| A2 | `name` | `VARCHAR(120)` | Valor identificativo o descriptivo indicado por el nombre de la columna; interpretación funcional inferida. | Monovalorado por fila; Almacenado; Obligatorio; UNIQUE; Multivaluación conceptual: pendiente de validar | Cualitativa nominal; el SQL no declara jerarquía. Interpretación de negocio pendiente. |
| A3 | `description` | `TEXT` | Contenido descriptivo relativo al concepto indicado; significado específico inferido por nombre. | Monovalorado por fila; Almacenado; Opcional; No clave; Multivaluación conceptual: pendiente de validar | Cualitativa nominal; el SQL no declara jerarquía. Interpretación de negocio pendiente. |
| A4 | `sup_id_category` | `INT UNSIGNED` | Dato sup id category; interpretación basada en el nombre y pendiente de validación con reglas de aplicación. | Monovalorado por fila; Almacenado; Opcional; FK; Multivaluación conceptual: pendiente de validar | Cuantitativa discreta si cuenta unidades; si codifica estado/clave, cualitativa nominal. Semántica indicada por nombre y pendiente de validar. |
| A5 | `status` | `BIT(1)` | Estado o indicador del registro. Los valores quedan limitados únicamente por el tipo o CHECK declarado; significado funcional pendiente si no hay comentario SQL. | Monovalorado por fila; Almacenado; Obligatorio; No clave; Multivaluación conceptual: pendiente de validar | Cualitativa nominal; el SQL no declara jerarquía. Interpretación de negocio pendiente. |
| A6 | `creation_date` | `DATETIME` | Fecha u hora asociada al evento nombrado; el evento exacto se infiere del nombre. | Monovalorado por fila; Almacenado; Obligatorio; No clave; Multivaluación conceptual: pendiente de validar | Temporal: DATETIME; expresa fecha/hora con la precisión inherente al tipo. |
| A7 | `last_update` | `DATETIME` | Fecha u hora asociada al evento nombrado; el evento exacto se infiere del nombre. | Monovalorado por fila; Almacenado; Obligatorio; No clave; Multivaluación conceptual: pendiente de validar | Temporal: DATETIME; expresa fecha/hora con la precisión inherente al tipo. |

| Posición | Atributo | PK/FK/UNIQUE | NULL | Dominio técnico, DEFAULT y restricciones |
|---:|---|---|---|---|
| A1 | `ID` | PK | No | `INT UNSIGNED; rango 0 a 4294967295; NOT NULL; sin DEFAULT declarado; AUTO_INCREMENT` |
| A2 | `name` | UNIQUE `name` (columna única) | No | `VARCHAR(120); longitud máxima 120; NOT NULL; sin DEFAULT declarado; participa en UNIQUE name (columna única)` |
| A3 | `description` | No clave | Sí | `TEXT; máximo 65,535 bytes; NULL permitido; sin DEFAULT declarado` |
| A4 | `sup_id_category` | FK `fk_superior_category` → `tbc_categories.ID` | Sí | `INT UNSIGNED; rango 0 a 4294967295; NULL permitido; DEFAULT NULL` |
| A5 | `status` | No clave | No | `BIT(1); NOT NULL; DEFAULT b'1'` |
| A6 | `creation_date` | No clave | No | `DATETIME; NOT NULL; DEFAULT CURRENT_TIMESTAMP` |
| A7 | `last_update` | No clave | No | `DATETIME; NOT NULL; sin DEFAULT declarado; ON UPDATE CURRENT_TIMESTAMP` |


**Clave primaria:** ID
**Índices:** PRIMARY `PRIMARY` (ID); UNIQUE `name` (name); INDEX `fk_superior_category` (sup_id_category)
**Reglas de integridad:** NOT NULL/NULL, DEFAULT, AUTO_INCREMENT, ON UPDATE, PK, UNIQUE, FK y CHECK según la definición SQL. Los CHECK se reproducen textualmente arriba.
**Dominio de negocio:** Los ENUM/CHECK permiten enumerar restricciones comprobables. El significado funcional de estados, códigos, unidades y nombres sin comentario SQL queda pendiente; no se infiere de DEFAULT.

## tbc_payment_methods_types

**Nombre exacto:** `tbc_payment_methods_types`.

**Descripción general:** Proporciona valores de referencia/clasificación identificados por el nombre y las columnas.

**Propósito de negocio:** Inferido del nombre de la entidad y de los vínculos/columnas declarados; requiere validación funcional. No se atribuyen reglas no presentes en el dump.

**Propósito técnico:** Tabla InnoDB declarada con 6 columnas y 0 filas insertadas en este respaldo.

**Clasificación:** Catálogo (inferido por prefijo/nombre).

**Esquema relacional:** `tbc_payment_methods_types(ID, code, description, status, creation_date, last_update)`

**Notación formal:** R(A1, A2, …, A6); **grado:** 6. **PK:** ID

**Relaciones:** No hay claves foráneas declaradas en esta tabla.

| Posición | Atributo | Tipo SQL | Descripción | Clasificación | Naturaleza |
|---:|---|---|---|---|---|
| A1 | `ID` | `INT UNSIGNED` | Identificador técnico del registro. La función de identidad se respalda por PK si está declarada. | Monovalorado por fila; Almacenado; Obligatorio; PK; Multivaluación conceptual: pendiente de validar | Cualitativa nominal: identificador, no magnitud, aunque el tipo sea entero. |
| A2 | `code` | `VARCHAR(30)` | Dato code; interpretación basada en el nombre y pendiente de validación con reglas de aplicación. | Monovalorado por fila; Almacenado; Obligatorio; UNIQUE; Multivaluación conceptual: pendiente de validar | Cualitativa nominal; el SQL no declara jerarquía. Interpretación de negocio pendiente. |
| A3 | `description` | `TEXT` | Contenido descriptivo relativo al concepto indicado; significado específico inferido por nombre. | Monovalorado por fila; Almacenado; Obligatorio; No clave; Multivaluación conceptual: pendiente de validar | Cualitativa nominal; el SQL no declara jerarquía. Interpretación de negocio pendiente. |
| A4 | `status` | `BIT(1)` | Estado o indicador del registro. Los valores quedan limitados únicamente por el tipo o CHECK declarado; significado funcional pendiente si no hay comentario SQL. | Monovalorado por fila; Almacenado; Obligatorio; No clave; Multivaluación conceptual: pendiente de validar | Cualitativa nominal; el SQL no declara jerarquía. Interpretación de negocio pendiente. |
| A5 | `creation_date` | `DATETIME` | Fecha u hora asociada al evento nombrado; el evento exacto se infiere del nombre. | Monovalorado por fila; Almacenado; Obligatorio; No clave; Multivaluación conceptual: pendiente de validar | Temporal: DATETIME; expresa fecha/hora con la precisión inherente al tipo. |
| A6 | `last_update` | `DATETIME` | Fecha u hora asociada al evento nombrado; el evento exacto se infiere del nombre. | Monovalorado por fila; Almacenado; Opcional; No clave; Multivaluación conceptual: pendiente de validar | Temporal: DATETIME; expresa fecha/hora con la precisión inherente al tipo. |

| Posición | Atributo | PK/FK/UNIQUE | NULL | Dominio técnico, DEFAULT y restricciones |
|---:|---|---|---|---|
| A1 | `ID` | PK | No | `INT UNSIGNED; rango 0 a 4294967295; NOT NULL; sin DEFAULT declarado; AUTO_INCREMENT` |
| A2 | `code` | UNIQUE `code_UNIQUE` (columna única) | No | `VARCHAR(30); longitud máxima 30; NOT NULL; sin DEFAULT declarado; participa en UNIQUE code_UNIQUE (columna única)` |
| A3 | `description` | No clave | No | `TEXT; máximo 65,535 bytes; NOT NULL; sin DEFAULT declarado` |
| A4 | `status` | No clave | No | `BIT(1); NOT NULL; DEFAULT b'1'` |
| A5 | `creation_date` | No clave | No | `DATETIME; NOT NULL; DEFAULT CURRENT_TIMESTAMP` |
| A6 | `last_update` | No clave | Sí | `DATETIME; NULL permitido; DEFAULT NULL; ON UPDATE CURRENT_TIMESTAMP` |


**Clave primaria:** ID
**Índices:** PRIMARY `PRIMARY` (ID); UNIQUE `code_UNIQUE` (code)
**Reglas de integridad:** NOT NULL/NULL, DEFAULT, AUTO_INCREMENT, ON UPDATE, PK, UNIQUE, FK y CHECK según la definición SQL. Los CHECK se reproducen textualmente arriba.
**Dominio de negocio:** Los ENUM/CHECK permiten enumerar restricciones comprobables. El significado funcional de estados, códigos, unidades y nombres sin comentario SQL queda pendiente; no se infiere de DEFAULT.

## tbd_address_components

**Nombre exacto:** `tbd_address_components`.

**Descripción general:** Relaciona o detalla entidades identificadas por los componentes del nombre y las FK declaradas.

**Propósito de negocio:** Inferido del nombre de la entidad y de los vínculos/columnas declarados; requiere validación funcional. No se atribuyen reglas no presentes en el dump.

**Propósito técnico:** Tabla InnoDB declarada con 8 columnas y 0 filas insertadas en este respaldo.

**Clasificación:** Detalle o intermedia (inferido por prefijo y claves).

**Esquema relacional:** `tbd_address_components(ID, address_ID, value, component_type, status, address_sup_ID, creation_date, last_update)`

**Notación formal:** R(A1, A2, …, A8); **grado:** 8. **PK:** ID

**Relaciones y cardinalidad:** `address_ID` → `tb_user_addresses(ID)`; por cada fila dependiente, referencia 1..1 (FK NOT NULL); por cada fila padre, dependientes 0..N (unicidad FK=no); ON DELETE RESTRICT, ON UPDATE no especificado; constraint `fk_component_address`; `address_ID, address_sup_ID` → `tbd_address_components(address_ID, ID)`; por cada fila dependiente, referencia 0..1 (FK nullable); por cada fila padre, dependientes 0..N (unicidad FK=no); ON DELETE RESTRICT, ON UPDATE no especificado; constraint `fk_component_parent`.

| Posición | Atributo | Tipo SQL | Descripción | Clasificación | Naturaleza |
|---:|---|---|---|---|---|
| A1 | `ID` | `BIGINT UNSIGNED` | Identificador técnico del registro. La función de identidad se respalda por PK si está declarada. | Monovalorado por fila; Almacenado; Obligatorio; PK; UNIQUE; Multivaluación conceptual: pendiente de validar | Cualitativa nominal: identificador, no magnitud, aunque el tipo sea entero. |
| A2 | `address_ID` | `BIGINT UNSIGNED` | Identificador de la entidad indicada por el prefijo. Referencia declarada: ver PK/FK; si no hay FK, la relación semántica es inferida. | Monovalorado por fila; Almacenado; Obligatorio; FK; UNIQUE; Multivaluación conceptual: pendiente de validar | Cualitativa nominal: identificador, no magnitud, aunque el tipo sea entero. |
| A3 | `value` | `VARCHAR(255)` | Dato value; interpretación basada en el nombre y pendiente de validación con reglas de aplicación. | Monovalorado por fila; Almacenado; Obligatorio; No clave; Multivaluación conceptual: pendiente de validar | Cualitativa nominal; el SQL no declara jerarquía. Interpretación de negocio pendiente. |
| A4 | `component_type` | `VARCHAR(50)` | Dato component type; interpretación basada en el nombre y pendiente de validación con reglas de aplicación. | Monovalorado por fila; Almacenado; Obligatorio; No clave; Multivaluación conceptual: pendiente de validar | Cualitativa nominal; el SQL no declara jerarquía. Interpretación de negocio pendiente. |
| A5 | `status` | `BIT(1)` | Estado o indicador del registro. Los valores quedan limitados únicamente por el tipo o CHECK declarado; significado funcional pendiente si no hay comentario SQL. | Monovalorado por fila; Almacenado; Obligatorio; No clave; Multivaluación conceptual: pendiente de validar | Cualitativa nominal; el SQL no declara jerarquía. Interpretación de negocio pendiente. |
| A6 | `address_sup_ID` | `BIGINT UNSIGNED` | Identificador de la entidad indicada por el prefijo. Referencia declarada: ver PK/FK; si no hay FK, la relación semántica es inferida. | Monovalorado por fila; Almacenado; Opcional; FK; Multivaluación conceptual: pendiente de validar | Cualitativa nominal: identificador, no magnitud, aunque el tipo sea entero. |
| A7 | `creation_date` | `DATETIME` | Fecha u hora asociada al evento nombrado; el evento exacto se infiere del nombre. | Monovalorado por fila; Almacenado; Obligatorio; No clave; Multivaluación conceptual: pendiente de validar | Temporal: DATETIME; expresa fecha/hora con la precisión inherente al tipo. |
| A8 | `last_update` | `DATETIME` | Fecha u hora asociada al evento nombrado; el evento exacto se infiere del nombre. | Monovalorado por fila; Almacenado; Opcional; No clave; Multivaluación conceptual: pendiente de validar | Temporal: DATETIME; expresa fecha/hora con la precisión inherente al tipo. |

| Posición | Atributo | PK/FK/UNIQUE | NULL | Dominio técnico, DEFAULT y restricciones |
|---:|---|---|---|---|
| A1 | `ID` | PK, UNIQUE `uk_address_component` (clave compuesta) | No | `BIGINT UNSIGNED; rango 0 a 18446744073709551615; NOT NULL; sin DEFAULT declarado; AUTO_INCREMENT; participa en UNIQUE uk_address_component (compuesto)` |
| A2 | `address_ID` | FK `fk_component_address` → `tb_user_addresses.ID`, FK `fk_component_parent` → `tbd_address_components.address_ID`, UNIQUE `uk_address_component` (clave compuesta) | No | `BIGINT UNSIGNED; rango 0 a 18446744073709551615; NOT NULL; sin DEFAULT declarado; participa en UNIQUE uk_address_component (compuesto)` |
| A3 | `value` | No clave | No | `VARCHAR(255); longitud máxima 255; NOT NULL; sin DEFAULT declarado` |
| A4 | `component_type` | No clave | No | `VARCHAR(50); longitud máxima 50; NOT NULL; sin DEFAULT declarado` |
| A5 | `status` | No clave | No | `BIT(1); NOT NULL; DEFAULT b'1'` |
| A6 | `address_sup_ID` | FK `fk_component_parent` → `tbd_address_components.ID` | Sí | `BIGINT UNSIGNED; rango 0 a 18446744073709551615; NULL permitido; DEFAULT NULL` |
| A7 | `creation_date` | No clave | No | `DATETIME; NOT NULL; DEFAULT CURRENT_TIMESTAMP` |
| A8 | `last_update` | No clave | Sí | `DATETIME; NULL permitido; DEFAULT NULL; ON UPDATE CURRENT_TIMESTAMP` |


**Clave primaria:** ID
**Índices:** PRIMARY `PRIMARY` (ID); UNIQUE `uk_address_component` (address_ID, ID); INDEX `idx_address_parent` (address_ID, address_sup_ID)
**Reglas de integridad:** NOT NULL/NULL, DEFAULT, AUTO_INCREMENT, ON UPDATE, PK, UNIQUE, FK y CHECK según la definición SQL. Los CHECK se reproducen textualmente arriba.
**Dominio de negocio:** Los ENUM/CHECK permiten enumerar restricciones comprobables. El significado funcional de estados, códigos, unidades y nombres sin comentario SQL queda pendiente; no se infiere de DEFAULT.

## tbd_cancellation_items

**Nombre exacto:** `tbd_cancellation_items`.

**Descripción general:** Relaciona o detalla entidades identificadas por los componentes del nombre y las FK declaradas.

**Propósito de negocio:** Inferido del nombre de la entidad y de los vínculos/columnas declarados; requiere validación funcional. No se atribuyen reglas no presentes en el dump.

**Propósito técnico:** Tabla InnoDB declarada con 9 columnas y 0 filas insertadas en este respaldo.

**Clasificación:** Detalle o intermedia (inferido por prefijo y claves).

**Esquema relacional:** `tbd_cancellation_items(ID, cancellation_ID, order_item_ID, quantity, unit_amount, item_reason, status, creation_date, last_update)`

**Notación formal:** R(A1, A2, …, A9); **grado:** 9. **PK:** ID

**Restricciones CHECK:** CONSTRAINT `chk_cancellation_items_amount` CHECK ((`unit_amount` >= 0)); CONSTRAINT `chk_cancellation_items_quantity` CHECK ((`quantity` > 0))
**Relaciones y cardinalidad:** `cancellation_ID` → `tb_cancellations(ID)`; por cada fila dependiente, referencia 1..1 (FK NOT NULL); por cada fila padre, dependientes 0..N (unicidad FK=no); ON DELETE no especificado, ON UPDATE no especificado; constraint `fk_cancellation_items_cancellation`; `order_item_ID` → `tbd_order_items(ID)`; por cada fila dependiente, referencia 1..1 (FK NOT NULL); por cada fila padre, dependientes 0..N (unicidad FK=no); ON DELETE no especificado, ON UPDATE no especificado; constraint `fk_cancellation_items_order_item`.

| Posición | Atributo | Tipo SQL | Descripción | Clasificación | Naturaleza |
|---:|---|---|---|---|---|
| A1 | `ID` | `INT UNSIGNED` | Identificador técnico del registro. La función de identidad se respalda por PK si está declarada. | Monovalorado por fila; Almacenado; Obligatorio; PK; Multivaluación conceptual: pendiente de validar | Cualitativa nominal: identificador, no magnitud, aunque el tipo sea entero. |
| A2 | `cancellation_ID` | `INT UNSIGNED` | Identificador de la entidad indicada por el prefijo. Referencia declarada: ver PK/FK; si no hay FK, la relación semántica es inferida. | Monovalorado por fila; Almacenado; Obligatorio; FK; Multivaluación conceptual: pendiente de validar | Cualitativa nominal: identificador, no magnitud, aunque el tipo sea entero. |
| A3 | `order_item_ID` | `INT UNSIGNED` | Identificador de la entidad indicada por el prefijo. Referencia declarada: ver PK/FK; si no hay FK, la relación semántica es inferida. | Monovalorado por fila; Almacenado; Obligatorio; FK; Multivaluación conceptual: pendiente de validar | Cualitativa nominal: identificador, no magnitud, aunque el tipo sea entero. |
| A4 | `quantity` | `INT UNSIGNED` | Cantidad o contador asociado al concepto nombrado; unidad/regla de conteo pendiente si no está declarada. | Monovalorado por fila; Almacenado; Obligatorio; No clave; Multivaluación conceptual: pendiente de validar | Cuantitativa discreta si cuenta unidades; si codifica estado/clave, cualitativa nominal. Semántica indicada por nombre y pendiente de validar. |
| A5 | `unit_amount` | `DECIMAL(12,2)` | Importe o magnitud del concepto indicado por el nombre; moneda y reglas de cálculo no declaradas en esta columna. | Monovalorado por fila; Almacenado; Obligatorio; No clave; Multivaluación conceptual: pendiente de validar | Cuantitativa discreta a escala 2; incremento mínimo 0.01. Dominio decimal finito, no continuo. |
| A6 | `item_reason` | `VARCHAR(500)` | Contenido descriptivo relativo al concepto indicado; significado específico inferido por nombre. | Monovalorado por fila; Almacenado; Opcional; No clave; Multivaluación conceptual: pendiente de validar | Cualitativa nominal; el SQL no declara jerarquía. Interpretación de negocio pendiente. |
| A7 | `status` | `BIT(1)` | Estado o indicador del registro. Los valores quedan limitados únicamente por el tipo o CHECK declarado; significado funcional pendiente si no hay comentario SQL. | Monovalorado por fila; Almacenado; Obligatorio; No clave; Multivaluación conceptual: pendiente de validar | Cualitativa nominal; el SQL no declara jerarquía. Interpretación de negocio pendiente. |
| A8 | `creation_date` | `DATETIME` | Fecha u hora asociada al evento nombrado; el evento exacto se infiere del nombre. | Monovalorado por fila; Almacenado; Obligatorio; No clave; Multivaluación conceptual: pendiente de validar | Temporal: DATETIME; expresa fecha/hora con la precisión inherente al tipo. |
| A9 | `last_update` | `DATETIME` | Fecha u hora asociada al evento nombrado; el evento exacto se infiere del nombre. | Monovalorado por fila; Almacenado; Opcional; No clave; Multivaluación conceptual: pendiente de validar | Temporal: DATETIME; expresa fecha/hora con la precisión inherente al tipo. |

| Posición | Atributo | PK/FK/UNIQUE | NULL | Dominio técnico, DEFAULT y restricciones |
|---:|---|---|---|---|
| A1 | `ID` | PK | No | `INT UNSIGNED; rango 0 a 4294967295; NOT NULL; sin DEFAULT declarado; AUTO_INCREMENT` |
| A2 | `cancellation_ID` | FK `fk_cancellation_items_cancellation` → `tb_cancellations.ID` | No | `INT UNSIGNED; rango 0 a 4294967295; NOT NULL; sin DEFAULT declarado` |
| A3 | `order_item_ID` | FK `fk_cancellation_items_order_item` → `tbd_order_items.ID` | No | `INT UNSIGNED; rango 0 a 4294967295; NOT NULL; sin DEFAULT declarado` |
| A4 | `quantity` | No clave | No | `INT UNSIGNED; rango 0 a 4294967295; NOT NULL; DEFAULT '1'; CHECK: CONSTRAINT `chk_cancellation_items_quantity` CHECK ((`quantity` > 0))` |
| A5 | `unit_amount` | No clave | No | `DECIMAL(12,2); precisión 12, escala 2, rango -9999999999.99 a 9999999999.99; NOT NULL; DEFAULT '0.00'; CHECK: CONSTRAINT `chk_cancellation_items_amount` CHECK ((`unit_amount` >= 0))` |
| A6 | `item_reason` | No clave | Sí | `VARCHAR(500); longitud máxima 500; NULL permitido; DEFAULT NULL` |
| A7 | `status` | No clave | No | `BIT(1); NOT NULL; DEFAULT b'1'` |
| A8 | `creation_date` | No clave | No | `DATETIME; NOT NULL; DEFAULT CURRENT_TIMESTAMP` |
| A9 | `last_update` | No clave | Sí | `DATETIME; NULL permitido; DEFAULT NULL; ON UPDATE CURRENT_TIMESTAMP` |


**Clave primaria:** ID
**Índices:** PRIMARY `PRIMARY` (ID); INDEX `idx_cancellation_items_cancellation` (cancellation_ID); INDEX `idx_cancellation_items_order_item` (order_item_ID)
**Reglas de integridad:** NOT NULL/NULL, DEFAULT, AUTO_INCREMENT, ON UPDATE, PK, UNIQUE, FK y CHECK según la definición SQL. Los CHECK se reproducen textualmente arriba.
**Dominio de negocio:** Los ENUM/CHECK permiten enumerar restricciones comprobables. El significado funcional de estados, códigos, unidades y nombres sin comentario SQL queda pendiente; no se infiere de DEFAULT.

## tbd_carts_items

**Nombre exacto:** `tbd_carts_items`.

**Descripción general:** Relaciona o detalla entidades identificadas por los componentes del nombre y las FK declaradas.

**Propósito de negocio:** Inferido del nombre de la entidad y de los vínculos/columnas declarados; requiere validación funcional. No se atribuyen reglas no presentes en el dump.

**Propósito técnico:** Tabla InnoDB declarada con 5 columnas y 0 filas insertadas en este respaldo.

**Clasificación:** Detalle o intermedia (inferido por prefijo y claves).

**Esquema relacional:** `tbd_carts_items(cart_ID, provider_ID, product_ID, quantity, creation_date)`

**Notación formal:** R(A1, A2, …, A5); **grado:** 5. **PK:** cart_ID, provider_ID, product_ID

**Restricciones CHECK:** CONSTRAINT `chk_cart_quantity` CHECK ((`quantity` > 0)); CONSTRAINT `chk_cart_quantity_positive` CHECK ((`quantity` > 0))
**Relaciones y cardinalidad:** `cart_ID` → `tb_carts(ID)`; por cada fila dependiente, referencia 1..1 (FK NOT NULL); por cada fila padre, dependientes 0..N (unicidad FK=no); ON DELETE no especificado, ON UPDATE no especificado; constraint `fk_cart_items_cart`; `product_ID` → `tbd_products_users_providers(product_ID)`; por cada fila dependiente, referencia 1..1 (FK NOT NULL); por cada fila padre, dependientes 0..N (unicidad FK=no); ON DELETE no especificado, ON UPDATE no especificado; constraint `fk_cart_items_product`; `provider_ID` → `tbd_products_users_providers(user_ID)`; por cada fila dependiente, referencia 1..1 (FK NOT NULL); por cada fila padre, dependientes 0..N (unicidad FK=no); ON DELETE no especificado, ON UPDATE no especificado; constraint `fk_cart_items_provider`; `cart_ID` → `tb_carts(ID)`; por cada fila dependiente, referencia 1..1 (FK NOT NULL); por cada fila padre, dependientes 0..N (unicidad FK=no); ON DELETE no especificado, ON UPDATE no especificado; constraint `tbd_carts_items_ibfk_1`.

| Posición | Atributo | Tipo SQL | Descripción | Clasificación | Naturaleza |
|---:|---|---|---|---|---|
| A1 | `cart_ID` | `INT UNSIGNED` | Identificador de la entidad indicada por el prefijo. Referencia declarada: ver PK/FK; si no hay FK, la relación semántica es inferida. | Monovalorado por fila; Almacenado; Obligatorio; PK; FK; Multivaluación conceptual: pendiente de validar | Cualitativa nominal: identificador, no magnitud, aunque el tipo sea entero. |
| A2 | `provider_ID` | `INT UNSIGNED` | Identificador de la entidad indicada por el prefijo. Referencia declarada: ver PK/FK; si no hay FK, la relación semántica es inferida. | Monovalorado por fila; Almacenado; Obligatorio; PK; FK; Multivaluación conceptual: pendiente de validar | Cualitativa nominal: identificador, no magnitud, aunque el tipo sea entero. |
| A3 | `product_ID` | `INT UNSIGNED` | Identificador de la entidad indicada por el prefijo. Referencia declarada: ver PK/FK; si no hay FK, la relación semántica es inferida. | Monovalorado por fila; Almacenado; Obligatorio; PK; FK; Multivaluación conceptual: pendiente de validar | Cualitativa nominal: identificador, no magnitud, aunque el tipo sea entero. |
| A4 | `quantity` | `INT UNSIGNED` | Cantidad o contador asociado al concepto nombrado; unidad/regla de conteo pendiente si no está declarada. | Monovalorado por fila; Almacenado; Obligatorio; No clave; Multivaluación conceptual: pendiente de validar | Cuantitativa discreta si cuenta unidades; si codifica estado/clave, cualitativa nominal. Semántica indicada por nombre y pendiente de validar. |
| A5 | `creation_date` | `DATETIME` | Fecha u hora asociada al evento nombrado; el evento exacto se infiere del nombre. | Monovalorado por fila; Almacenado; Obligatorio; No clave; Multivaluación conceptual: pendiente de validar | Temporal: DATETIME; expresa fecha/hora con la precisión inherente al tipo. |

| Posición | Atributo | PK/FK/UNIQUE | NULL | Dominio técnico, DEFAULT y restricciones |
|---:|---|---|---|---|
| A1 | `cart_ID` | PK, FK `fk_cart_items_cart` → `tb_carts.ID`, FK `tbd_carts_items_ibfk_1` → `tb_carts.ID` | No | `INT UNSIGNED; rango 0 a 4294967295; NOT NULL; sin DEFAULT declarado` |
| A2 | `provider_ID` | PK, FK `fk_cart_items_provider` → `tbd_products_users_providers.user_ID` | No | `INT UNSIGNED; rango 0 a 4294967295; NOT NULL; sin DEFAULT declarado` |
| A3 | `product_ID` | PK, FK `fk_cart_items_product` → `tbd_products_users_providers.product_ID` | No | `INT UNSIGNED; rango 0 a 4294967295; NOT NULL; sin DEFAULT declarado` |
| A4 | `quantity` | No clave | No | `INT UNSIGNED; rango 0 a 4294967295; NOT NULL; DEFAULT '1'; CHECK: CONSTRAINT `chk_cart_quantity` CHECK ((`quantity` > 0)); CHECK: CONSTRAINT `chk_cart_quantity_positive` CHECK ((`quantity` > 0))` |
| A5 | `creation_date` | No clave | No | `DATETIME; NOT NULL; DEFAULT CURRENT_TIMESTAMP` |


**Clave primaria:** cart_ID, provider_ID, product_ID
**Índices:** PRIMARY `PRIMARY` (cart_ID, provider_ID, product_ID); INDEX `fk_cart_items_provider` (provider_ID); INDEX `fk_cart_items_product` (product_ID)
**Reglas de integridad:** NOT NULL/NULL, DEFAULT, AUTO_INCREMENT, ON UPDATE, PK, UNIQUE, FK y CHECK según la definición SQL. Los CHECK se reproducen textualmente arriba.
**Dominio de negocio:** Los ENUM/CHECK permiten enumerar restricciones comprobables. El significado funcional de estados, códigos, unidades y nombres sin comentario SQL queda pendiente; no se infiere de DEFAULT.

## tbd_order_items

**Nombre exacto:** `tbd_order_items`.

**Descripción general:** Relaciona o detalla entidades identificadas por los componentes del nombre y las FK declaradas.

**Propósito de negocio:** Inferido del nombre de la entidad y de los vínculos/columnas declarados; requiere validación funcional. No se atribuyen reglas no presentes en el dump.

**Propósito técnico:** Tabla InnoDB declarada con 8 columnas y 0 filas insertadas en este respaldo.

**Clasificación:** Detalle o intermedia (inferido por prefijo y claves).

**Esquema relacional:** `tbd_order_items(ID, seller_order_ID, product_offer_ID, product_name, quantity, unit_price, subtotal, creation_date)`

**Notación formal:** R(A1, A2, …, A8); **grado:** 8. **PK:** ID

**Restricciones CHECK:** CONSTRAINT `tbd_order_items_chk_1` CHECK ((`quantity` > 0)); CONSTRAINT `tbd_order_items_chk_2` CHECK ((`unit_price` >= 0))
**Relaciones y cardinalidad:** `seller_order_ID` → `tb_buyer_orders(ID)`; por cada fila dependiente, referencia 1..1 (FK NOT NULL); por cada fila padre, dependientes 0..N (unicidad FK=no); ON DELETE no especificado, ON UPDATE no especificado; constraint `tbd_order_items_ibfk_1`.

| Posición | Atributo | Tipo SQL | Descripción | Clasificación | Naturaleza |
|---:|---|---|---|---|---|
| A1 | `ID` | `INT UNSIGNED` | Identificador técnico del registro. La función de identidad se respalda por PK si está declarada. | Monovalorado por fila; Almacenado; Obligatorio; PK; Multivaluación conceptual: pendiente de validar | Cualitativa nominal: identificador, no magnitud, aunque el tipo sea entero. |
| A2 | `seller_order_ID` | `INT UNSIGNED` | Identificador de la entidad indicada por el prefijo. Referencia declarada: ver PK/FK; si no hay FK, la relación semántica es inferida. | Monovalorado por fila; Almacenado; Obligatorio; FK; Multivaluación conceptual: pendiente de validar | Cualitativa nominal: identificador, no magnitud, aunque el tipo sea entero. |
| A3 | `product_offer_ID` | `INT UNSIGNED` | Identificador de la entidad indicada por el prefijo. Referencia declarada: ver PK/FK; si no hay FK, la relación semántica es inferida. | Monovalorado por fila; Almacenado; Obligatorio; No clave; Multivaluación conceptual: pendiente de validar | Cualitativa nominal: identificador, no magnitud, aunque el tipo sea entero. |
| A4 | `product_name` | `VARCHAR(255)` | Valor identificativo o descriptivo indicado por el nombre de la columna; interpretación funcional inferida. | Monovalorado por fila; Almacenado; Obligatorio; No clave; Multivaluación conceptual: pendiente de validar | Cualitativa nominal; el SQL no declara jerarquía. Interpretación de negocio pendiente. |
| A5 | `quantity` | `INT UNSIGNED` | Cantidad o contador asociado al concepto nombrado; unidad/regla de conteo pendiente si no está declarada. | Monovalorado por fila; Almacenado; Obligatorio; No clave; Multivaluación conceptual: pendiente de validar | Cuantitativa discreta si cuenta unidades; si codifica estado/clave, cualitativa nominal. Semántica indicada por nombre y pendiente de validar. |
| A6 | `unit_price` | `DECIMAL(12,2)` | Importe o magnitud del concepto indicado por el nombre; moneda y reglas de cálculo no declaradas en esta columna. | Monovalorado por fila; Almacenado; Obligatorio; No clave; Multivaluación conceptual: pendiente de validar | Cuantitativa discreta a escala 2; incremento mínimo 0.01. Dominio decimal finito, no continuo. |
| A7 | `subtotal` | `DECIMAL(12,2)` | Importe o magnitud del concepto indicado por el nombre; moneda y reglas de cálculo no declaradas en esta columna. | Monovalorado por fila; Almacenado; Opcional; No clave; Multivaluación conceptual: pendiente de validar | Cuantitativa discreta a escala 2; incremento mínimo 0.01. Dominio decimal finito, no continuo. |
| A8 | `creation_date` | `DATETIME` | Fecha u hora asociada al evento nombrado; el evento exacto se infiere del nombre. | Monovalorado por fila; Almacenado; Obligatorio; No clave; Multivaluación conceptual: pendiente de validar | Temporal: DATETIME; expresa fecha/hora con la precisión inherente al tipo. |

| Posición | Atributo | PK/FK/UNIQUE | NULL | Dominio técnico, DEFAULT y restricciones |
|---:|---|---|---|---|
| A1 | `ID` | PK | No | `INT UNSIGNED; rango 0 a 4294967295; NOT NULL; sin DEFAULT declarado; AUTO_INCREMENT` |
| A2 | `seller_order_ID` | FK `tbd_order_items_ibfk_1` → `tb_buyer_orders.ID` | No | `INT UNSIGNED; rango 0 a 4294967295; NOT NULL; sin DEFAULT declarado` |
| A3 | `product_offer_ID` | No clave | No | `INT UNSIGNED; rango 0 a 4294967295; NOT NULL; sin DEFAULT declarado` |
| A4 | `product_name` | No clave | No | `VARCHAR(255); longitud máxima 255; NOT NULL; sin DEFAULT declarado` |
| A5 | `quantity` | No clave | No | `INT UNSIGNED; rango 0 a 4294967295; NOT NULL; sin DEFAULT declarado; CHECK: CONSTRAINT `tbd_order_items_chk_1` CHECK ((`quantity` > 0))` |
| A6 | `unit_price` | No clave | No | `DECIMAL(12,2); precisión 12, escala 2, rango -9999999999.99 a 9999999999.99; NOT NULL; sin DEFAULT declarado; CHECK: CONSTRAINT `tbd_order_items_chk_2` CHECK ((`unit_price` >= 0))` |
| A7 | `subtotal` | No clave | Sí | `DECIMAL(12,2); precisión 12, escala 2, rango -9999999999.99 a 9999999999.99; NULL permitido; sin DEFAULT declarado` |
| A8 | `creation_date` | No clave | No | `DATETIME; NOT NULL; DEFAULT CURRENT_TIMESTAMP` |


**Clave primaria:** ID
**Índices:** PRIMARY `PRIMARY` (ID); INDEX `seller_order_ID` (seller_order_ID); INDEX `product_offer_ID` (product_offer_ID)
**Reglas de integridad:** NOT NULL/NULL, DEFAULT, AUTO_INCREMENT, ON UPDATE, PK, UNIQUE, FK y CHECK según la definición SQL. Los CHECK se reproducen textualmente arriba.
**Dominio de negocio:** Los ENUM/CHECK permiten enumerar restricciones comprobables. El significado funcional de estados, códigos, unidades y nombres sin comentario SQL queda pendiente; no se infiere de DEFAULT.

## tbd_products_categories

**Nombre exacto:** `tbd_products_categories`.

**Descripción general:** Relaciona o detalla entidades identificadas por los componentes del nombre y las FK declaradas.

**Propósito de negocio:** Inferido del nombre de la entidad y de los vínculos/columnas declarados; requiere validación funcional. No se atribuyen reglas no presentes en el dump.

**Propósito técnico:** Tabla InnoDB declarada con 5 columnas y 10279 filas insertadas en este respaldo.

**Clasificación:** Detalle o intermedia (inferido por prefijo y claves).

**Esquema relacional:** `tbd_products_categories(category_ID, product_ID, status, creation_date, last_update)`

**Notación formal:** R(A1, A2, …, A5); **grado:** 5. **PK:** category_ID, product_ID

**Relaciones y cardinalidad:** `category_ID` → `tbc_categories(ID)`; por cada fila dependiente, referencia 1..1 (FK NOT NULL); por cada fila padre, dependientes 0..N (unicidad FK=no); ON DELETE no especificado, ON UPDATE no especificado; constraint `fk_category`; `product_ID` → `tb_products(ID)`; por cada fila dependiente, referencia 1..1 (FK NOT NULL); por cada fila padre, dependientes 0..N (unicidad FK=no); ON DELETE no especificado, ON UPDATE no especificado; constraint `fk_product`.

| Posición | Atributo | Tipo SQL | Descripción | Clasificación | Naturaleza |
|---:|---|---|---|---|---|
| A1 | `category_ID` | `INT UNSIGNED` | Identificador de la entidad indicada por el prefijo. Referencia declarada: ver PK/FK; si no hay FK, la relación semántica es inferida. | Monovalorado por fila; Almacenado; Obligatorio; PK; FK; Multivaluación conceptual: pendiente de validar | Cualitativa nominal: identificador, no magnitud, aunque el tipo sea entero. |
| A2 | `product_ID` | `INT UNSIGNED` | Identificador de la entidad indicada por el prefijo. Referencia declarada: ver PK/FK; si no hay FK, la relación semántica es inferida. | Monovalorado por fila; Almacenado; Obligatorio; PK; FK; Multivaluación conceptual: pendiente de validar | Cualitativa nominal: identificador, no magnitud, aunque el tipo sea entero. |
| A3 | `status` | `BIT(1)` | Estado o indicador del registro. Los valores quedan limitados únicamente por el tipo o CHECK declarado; significado funcional pendiente si no hay comentario SQL. | Monovalorado por fila; Almacenado; Obligatorio; No clave; Multivaluación conceptual: pendiente de validar | Cualitativa nominal; el SQL no declara jerarquía. Interpretación de negocio pendiente. |
| A4 | `creation_date` | `DATETIME` | Fecha u hora asociada al evento nombrado; el evento exacto se infiere del nombre. | Monovalorado por fila; Almacenado; Obligatorio; No clave; Multivaluación conceptual: pendiente de validar | Temporal: DATETIME; expresa fecha/hora con la precisión inherente al tipo. |
| A5 | `last_update` | `DATETIME` | Fecha u hora asociada al evento nombrado; el evento exacto se infiere del nombre. | Monovalorado por fila; Almacenado; Obligatorio; No clave; Multivaluación conceptual: pendiente de validar | Temporal: DATETIME; expresa fecha/hora con la precisión inherente al tipo. |

| Posición | Atributo | PK/FK/UNIQUE | NULL | Dominio técnico, DEFAULT y restricciones |
|---:|---|---|---|---|
| A1 | `category_ID` | PK, FK `fk_category` → `tbc_categories.ID` | No | `INT UNSIGNED; rango 0 a 4294967295; NOT NULL; sin DEFAULT declarado` |
| A2 | `product_ID` | PK, FK `fk_product` → `tb_products.ID` | No | `INT UNSIGNED; rango 0 a 4294967295; NOT NULL; sin DEFAULT declarado` |
| A3 | `status` | No clave | No | `BIT(1); NOT NULL; DEFAULT b'1'` |
| A4 | `creation_date` | No clave | No | `DATETIME; NOT NULL; DEFAULT CURRENT_TIMESTAMP` |
| A5 | `last_update` | No clave | No | `DATETIME; NOT NULL; sin DEFAULT declarado; ON UPDATE CURRENT_TIMESTAMP` |


**Clave primaria:** category_ID, product_ID
**Índices:** PRIMARY `PRIMARY` (category_ID, product_ID); INDEX `fk_product` (product_ID)
**Reglas de integridad:** NOT NULL/NULL, DEFAULT, AUTO_INCREMENT, ON UPDATE, PK, UNIQUE, FK y CHECK según la definición SQL. Los CHECK se reproducen textualmente arriba.
**Dominio de negocio:** Los ENUM/CHECK permiten enumerar restricciones comprobables. El significado funcional de estados, códigos, unidades y nombres sin comentario SQL queda pendiente; no se infiere de DEFAULT.

## tbd_products_users_providers

**Nombre exacto:** `tbd_products_users_providers`.

**Descripción general:** Relaciona o detalla entidades identificadas por los componentes del nombre y las FK declaradas.

**Propósito de negocio:** Inferido del nombre de la entidad y de los vínculos/columnas declarados; requiere validación funcional. No se atribuyen reglas no presentes en el dump.

**Propósito técnico:** Tabla InnoDB declarada con 7 columnas y 0 filas insertadas en este respaldo.

**Clasificación:** Detalle o intermedia (inferido por prefijo y claves).

**Esquema relacional:** `tbd_products_users_providers(user_ID, product_ID, type_ownership, status, avalaible_date, creation_date, last_update)`

**Notación formal:** R(A1, A2, …, A7); **grado:** 7. **PK:** user_ID, product_ID

**Relaciones y cardinalidad:** `product_ID` → `tb_products(ID)`; por cada fila dependiente, referencia 1..1 (FK NOT NULL); por cada fila padre, dependientes 0..N (unicidad FK=no); ON DELETE no especificado, ON UPDATE no especificado; constraint `fk_products2`; `user_ID` → `tb_users(ID)`; por cada fila dependiente, referencia 1..1 (FK NOT NULL); por cada fila padre, dependientes 0..N (unicidad FK=no); ON DELETE no especificado, ON UPDATE no especificado; constraint `fk_user1`.

| Posición | Atributo | Tipo SQL | Descripción | Clasificación | Naturaleza |
|---:|---|---|---|---|---|
| A1 | `user_ID` | `INT UNSIGNED` | Identificador de la entidad indicada por el prefijo. Referencia declarada: ver PK/FK; si no hay FK, la relación semántica es inferida. | Monovalorado por fila; Almacenado; Obligatorio; PK; FK; Multivaluación conceptual: pendiente de validar | Cualitativa nominal: identificador, no magnitud, aunque el tipo sea entero. |
| A2 | `product_ID` | `INT UNSIGNED` | Identificador de la entidad indicada por el prefijo. Referencia declarada: ver PK/FK; si no hay FK, la relación semántica es inferida. | Monovalorado por fila; Almacenado; Obligatorio; PK; FK; Multivaluación conceptual: pendiente de validar | Cualitativa nominal: identificador, no magnitud, aunque el tipo sea entero. |
| A3 | `type_ownership` | `ENUM('Owner','Reseller','Distributor')` | Dato type ownership; interpretación basada en el nombre y pendiente de validación con reglas de aplicación. | Monovalorado por fila; Almacenado; Opcional; No clave; Multivaluación conceptual: pendiente de validar | Cualitativa nominal; el SQL no declara jerarquía. Interpretación de negocio pendiente. |
| A4 | `status` | `BIT(1)` | Estado o indicador del registro. Los valores quedan limitados únicamente por el tipo o CHECK declarado; significado funcional pendiente si no hay comentario SQL. | Monovalorado por fila; Almacenado; Obligatorio; No clave; Multivaluación conceptual: pendiente de validar | Cualitativa nominal; el SQL no declara jerarquía. Interpretación de negocio pendiente. |
| A5 | `avalaible_date` | `DATETIME` | Fecha u hora asociada al evento nombrado; el evento exacto se infiere del nombre. | Monovalorado por fila; Almacenado; Obligatorio; No clave; Multivaluación conceptual: pendiente de validar | Temporal: DATETIME; expresa fecha/hora con la precisión inherente al tipo. |
| A6 | `creation_date` | `DATETIME` | Fecha u hora asociada al evento nombrado; el evento exacto se infiere del nombre. | Monovalorado por fila; Almacenado; Obligatorio; No clave; Multivaluación conceptual: pendiente de validar | Temporal: DATETIME; expresa fecha/hora con la precisión inherente al tipo. |
| A7 | `last_update` | `DATETIME` | Fecha u hora asociada al evento nombrado; el evento exacto se infiere del nombre. | Monovalorado por fila; Almacenado; Obligatorio; No clave; Multivaluación conceptual: pendiente de validar | Temporal: DATETIME; expresa fecha/hora con la precisión inherente al tipo. |

| Posición | Atributo | PK/FK/UNIQUE | NULL | Dominio técnico, DEFAULT y restricciones |
|---:|---|---|---|---|
| A1 | `user_ID` | PK, FK `fk_user1` → `tb_users.ID` | No | `INT UNSIGNED; rango 0 a 4294967295; NOT NULL; sin DEFAULT declarado` |
| A2 | `product_ID` | PK, FK `fk_products2` → `tb_products.ID` | No | `INT UNSIGNED; rango 0 a 4294967295; NOT NULL; sin DEFAULT declarado` |
| A3 | `type_ownership` | No clave | Sí | `ENUM('Owner','Reseller','Distributor'); NULL permitido; DEFAULT NULL` |
| A4 | `status` | No clave | No | `BIT(1); NOT NULL; DEFAULT b'1'` |
| A5 | `avalaible_date` | No clave | No | `DATETIME; NOT NULL; sin DEFAULT declarado` |
| A6 | `creation_date` | No clave | No | `DATETIME; NOT NULL; DEFAULT CURRENT_TIMESTAMP` |
| A7 | `last_update` | No clave | No | `DATETIME; NOT NULL; sin DEFAULT declarado; ON UPDATE CURRENT_TIMESTAMP` |


**Clave primaria:** user_ID, product_ID
**Índices:** PRIMARY `PRIMARY` (user_ID, product_ID); INDEX `fk_products2` (product_ID)
**Reglas de integridad:** NOT NULL/NULL, DEFAULT, AUTO_INCREMENT, ON UPDATE, PK, UNIQUE, FK y CHECK según la definición SQL. Los CHECK se reproducen textualmente arriba.
**Dominio de negocio:** Los ENUM/CHECK permiten enumerar restricciones comprobables. El significado funcional de estados, códigos, unidades y nombres sin comentario SQL queda pendiente; no se infiere de DEFAULT.

## tbd_return_items

**Nombre exacto:** `tbd_return_items`.

**Descripción general:** Relaciona o detalla entidades identificadas por los componentes del nombre y las FK declaradas.

**Propósito de negocio:** Inferido del nombre de la entidad y de los vínculos/columnas declarados; requiere validación funcional. No se atribuyen reglas no presentes en el dump.

**Propósito técnico:** Tabla InnoDB declarada con 10 columnas y 0 filas insertadas en este respaldo.

**Clasificación:** Detalle o intermedia (inferido por prefijo y claves).

**Esquema relacional:** `tbd_return_items(ID, return_ID, order_item_ID, quantity, unit_amount, item_reason, item_condition, status, creation_date, last_update)`

**Notación formal:** R(A1, A2, …, A10); **grado:** 10. **PK:** ID

**Restricciones CHECK:** CONSTRAINT `chk_return_items_amount` CHECK ((`unit_amount` >= 0)); CONSTRAINT `chk_return_items_quantity` CHECK ((`quantity` > 0))
**Relaciones y cardinalidad:** `order_item_ID` → `tbd_order_items(ID)`; por cada fila dependiente, referencia 1..1 (FK NOT NULL); por cada fila padre, dependientes 0..N (unicidad FK=no); ON DELETE no especificado, ON UPDATE no especificado; constraint `fk_return_items_order_item`; `return_ID` → `tb_returns(ID)`; por cada fila dependiente, referencia 1..1 (FK NOT NULL); por cada fila padre, dependientes 0..N (unicidad FK=no); ON DELETE no especificado, ON UPDATE no especificado; constraint `fk_return_items_return`.

| Posición | Atributo | Tipo SQL | Descripción | Clasificación | Naturaleza |
|---:|---|---|---|---|---|
| A1 | `ID` | `INT UNSIGNED` | Identificador técnico del registro. La función de identidad se respalda por PK si está declarada. | Monovalorado por fila; Almacenado; Obligatorio; PK; Multivaluación conceptual: pendiente de validar | Cualitativa nominal: identificador, no magnitud, aunque el tipo sea entero. |
| A2 | `return_ID` | `INT UNSIGNED` | Identificador de la entidad indicada por el prefijo. Referencia declarada: ver PK/FK; si no hay FK, la relación semántica es inferida. | Monovalorado por fila; Almacenado; Obligatorio; FK; Multivaluación conceptual: pendiente de validar | Cualitativa nominal: identificador, no magnitud, aunque el tipo sea entero. |
| A3 | `order_item_ID` | `INT UNSIGNED` | Identificador de la entidad indicada por el prefijo. Referencia declarada: ver PK/FK; si no hay FK, la relación semántica es inferida. | Monovalorado por fila; Almacenado; Obligatorio; FK; Multivaluación conceptual: pendiente de validar | Cualitativa nominal: identificador, no magnitud, aunque el tipo sea entero. |
| A4 | `quantity` | `INT UNSIGNED` | Cantidad o contador asociado al concepto nombrado; unidad/regla de conteo pendiente si no está declarada. | Monovalorado por fila; Almacenado; Obligatorio; No clave; Multivaluación conceptual: pendiente de validar | Cuantitativa discreta si cuenta unidades; si codifica estado/clave, cualitativa nominal. Semántica indicada por nombre y pendiente de validar. |
| A5 | `unit_amount` | `DECIMAL(12,2)` | Importe o magnitud del concepto indicado por el nombre; moneda y reglas de cálculo no declaradas en esta columna. | Monovalorado por fila; Almacenado; Obligatorio; No clave; Multivaluación conceptual: pendiente de validar | Cuantitativa discreta a escala 2; incremento mínimo 0.01. Dominio decimal finito, no continuo. |
| A6 | `item_reason` | `VARCHAR(500)` | Contenido descriptivo relativo al concepto indicado; significado específico inferido por nombre. | Monovalorado por fila; Almacenado; Opcional; No clave; Multivaluación conceptual: pendiente de validar | Cualitativa nominal; el SQL no declara jerarquía. Interpretación de negocio pendiente. |
| A7 | `item_condition` | `ENUM('Unknown','New','Opened','Damaged')` | Dato item condition; interpretación basada en el nombre y pendiente de validación con reglas de aplicación. | Monovalorado por fila; Almacenado; Obligatorio; No clave; Multivaluación conceptual: pendiente de validar | Cualitativa nominal; el SQL no declara jerarquía. Interpretación de negocio pendiente. |
| A8 | `status` | `BIT(1)` | Estado o indicador del registro. Los valores quedan limitados únicamente por el tipo o CHECK declarado; significado funcional pendiente si no hay comentario SQL. | Monovalorado por fila; Almacenado; Obligatorio; No clave; Multivaluación conceptual: pendiente de validar | Cualitativa nominal; el SQL no declara jerarquía. Interpretación de negocio pendiente. |
| A9 | `creation_date` | `DATETIME` | Fecha u hora asociada al evento nombrado; el evento exacto se infiere del nombre. | Monovalorado por fila; Almacenado; Obligatorio; No clave; Multivaluación conceptual: pendiente de validar | Temporal: DATETIME; expresa fecha/hora con la precisión inherente al tipo. |
| A10 | `last_update` | `DATETIME` | Fecha u hora asociada al evento nombrado; el evento exacto se infiere del nombre. | Monovalorado por fila; Almacenado; Opcional; No clave; Multivaluación conceptual: pendiente de validar | Temporal: DATETIME; expresa fecha/hora con la precisión inherente al tipo. |

| Posición | Atributo | PK/FK/UNIQUE | NULL | Dominio técnico, DEFAULT y restricciones |
|---:|---|---|---|---|
| A1 | `ID` | PK | No | `INT UNSIGNED; rango 0 a 4294967295; NOT NULL; sin DEFAULT declarado; AUTO_INCREMENT` |
| A2 | `return_ID` | FK `fk_return_items_return` → `tb_returns.ID` | No | `INT UNSIGNED; rango 0 a 4294967295; NOT NULL; sin DEFAULT declarado` |
| A3 | `order_item_ID` | FK `fk_return_items_order_item` → `tbd_order_items.ID` | No | `INT UNSIGNED; rango 0 a 4294967295; NOT NULL; sin DEFAULT declarado` |
| A4 | `quantity` | No clave | No | `INT UNSIGNED; rango 0 a 4294967295; NOT NULL; DEFAULT '1'; CHECK: CONSTRAINT `chk_return_items_quantity` CHECK ((`quantity` > 0))` |
| A5 | `unit_amount` | No clave | No | `DECIMAL(12,2); precisión 12, escala 2, rango -9999999999.99 a 9999999999.99; NOT NULL; DEFAULT '0.00'; CHECK: CONSTRAINT `chk_return_items_amount` CHECK ((`unit_amount` >= 0))` |
| A6 | `item_reason` | No clave | Sí | `VARCHAR(500); longitud máxima 500; NULL permitido; DEFAULT NULL` |
| A7 | `item_condition` | No clave | No | `ENUM('Unknown','New','Opened','Damaged'); NOT NULL; DEFAULT 'Unknown'` |
| A8 | `status` | No clave | No | `BIT(1); NOT NULL; DEFAULT b'1'` |
| A9 | `creation_date` | No clave | No | `DATETIME; NOT NULL; DEFAULT CURRENT_TIMESTAMP` |
| A10 | `last_update` | No clave | Sí | `DATETIME; NULL permitido; DEFAULT NULL; ON UPDATE CURRENT_TIMESTAMP` |


**Clave primaria:** ID
**Índices:** PRIMARY `PRIMARY` (ID); INDEX `idx_return_items_return` (return_ID); INDEX `idx_return_items_order_item` (order_item_ID)
**Reglas de integridad:** NOT NULL/NULL, DEFAULT, AUTO_INCREMENT, ON UPDATE, PK, UNIQUE, FK y CHECK según la definición SQL. Los CHECK se reproducen textualmente arriba.
**Dominio de negocio:** Los ENUM/CHECK permiten enumerar restricciones comprobables. El significado funcional de estados, códigos, unidades y nombres sin comentario SQL queda pendiente; no se infiere de DEFAULT.

## tbd_user_payment_methods

**Nombre exacto:** `tbd_user_payment_methods`.

**Descripción general:** Relaciona o detalla entidades identificadas por los componentes del nombre y las FK declaradas.

**Propósito de negocio:** Inferido del nombre de la entidad y de los vínculos/columnas declarados; requiere validación funcional. No se atribuyen reglas no presentes en el dump.

**Propósito técnico:** Tabla InnoDB declarada con 11 columnas y 0 filas insertadas en este respaldo.

**Clasificación:** Detalle o intermedia (inferido por prefijo y claves).

**Esquema relacional:** `tbd_user_payment_methods(ID, user_ID, payment_method_type_ID, provider, provider_method_ref, label, last_four, is_default, status, creation_date, last_update)`

**Notación formal:** R(A1, A2, …, A11); **grado:** 11. **PK:** ID

**Relaciones y cardinalidad:** `user_ID` → `tb_users(ID)`; por cada fila dependiente, referencia 1..1 (FK NOT NULL); por cada fila padre, dependientes 0..N (unicidad FK=no); ON DELETE no especificado, ON UPDATE no especificado; constraint `tbd_user_payment_methods_ibfk_1`; `payment_method_type_ID` → `tbc_payment_methods_types(ID)`; por cada fila dependiente, referencia 1..1 (FK NOT NULL); por cada fila padre, dependientes 0..N (unicidad FK=no); ON DELETE no especificado, ON UPDATE no especificado; constraint `tbd_user_payment_methods_ibfk_2`.

| Posición | Atributo | Tipo SQL | Descripción | Clasificación | Naturaleza |
|---:|---|---|---|---|---|
| A1 | `ID` | `BIGINT UNSIGNED` | Identificador técnico del registro. La función de identidad se respalda por PK si está declarada. | Monovalorado por fila; Almacenado; Obligatorio; PK; Multivaluación conceptual: pendiente de validar | Cualitativa nominal: identificador, no magnitud, aunque el tipo sea entero. |
| A2 | `user_ID` | `INT UNSIGNED` | Identificador de la entidad indicada por el prefijo. Referencia declarada: ver PK/FK; si no hay FK, la relación semántica es inferida. | Monovalorado por fila; Almacenado; Obligatorio; FK; Multivaluación conceptual: pendiente de validar | Cualitativa nominal: identificador, no magnitud, aunque el tipo sea entero. |
| A3 | `payment_method_type_ID` | `INT UNSIGNED` | Identificador de la entidad indicada por el prefijo. Referencia declarada: ver PK/FK; si no hay FK, la relación semántica es inferida. | Monovalorado por fila; Almacenado; Obligatorio; FK; Multivaluación conceptual: pendiente de validar | Cualitativa nominal: identificador, no magnitud, aunque el tipo sea entero. |
| A4 | `provider` | `VARCHAR(60)` | Dato provider; interpretación basada en el nombre y pendiente de validación con reglas de aplicación. | Monovalorado por fila; Almacenado; Obligatorio; UNIQUE; Multivaluación conceptual: pendiente de validar | Cualitativa nominal; el SQL no declara jerarquía. Interpretación de negocio pendiente. |
| A5 | `provider_method_ref` | `VARCHAR(255)` | Dato provider method ref; interpretación basada en el nombre y pendiente de validación con reglas de aplicación. | Monovalorado por fila; Almacenado; Obligatorio; UNIQUE; Multivaluación conceptual: pendiente de validar | Cualitativa nominal; el SQL no declara jerarquía. Interpretación de negocio pendiente. |
| A6 | `label` | `VARCHAR(100)` | Dato label; interpretación basada en el nombre y pendiente de validación con reglas de aplicación. | Monovalorado por fila; Almacenado; Opcional; No clave; Multivaluación conceptual: pendiente de validar | Cualitativa nominal; el SQL no declara jerarquía. Interpretación de negocio pendiente. |
| A7 | `last_four` | `CHAR(4)` | Dato last four; interpretación basada en el nombre y pendiente de validación con reglas de aplicación. | Monovalorado por fila; Almacenado; Opcional; No clave; Multivaluación conceptual: pendiente de validar | Cualitativa nominal; el SQL no declara jerarquía. Interpretación de negocio pendiente. |
| A8 | `is_default` | `TINYINT` | Dato is default; interpretación basada en el nombre y pendiente de validación con reglas de aplicación. | Monovalorado por fila; Almacenado; Obligatorio; No clave; Multivaluación conceptual: pendiente de validar | Cuantitativa discreta si cuenta unidades; si codifica estado/clave, cualitativa nominal. Semántica indicada por nombre y pendiente de validar. |
| A9 | `status` | `BIT(1)` | Estado o indicador del registro. Los valores quedan limitados únicamente por el tipo o CHECK declarado; significado funcional pendiente si no hay comentario SQL. | Monovalorado por fila; Almacenado; Obligatorio; No clave; Multivaluación conceptual: pendiente de validar | Cualitativa nominal; el SQL no declara jerarquía. Interpretación de negocio pendiente. |
| A10 | `creation_date` | `DATETIME` | Fecha u hora asociada al evento nombrado; el evento exacto se infiere del nombre. | Monovalorado por fila; Almacenado; Obligatorio; No clave; Multivaluación conceptual: pendiente de validar | Temporal: DATETIME; expresa fecha/hora con la precisión inherente al tipo. |
| A11 | `last_update` | `DATETIME` | Fecha u hora asociada al evento nombrado; el evento exacto se infiere del nombre. | Monovalorado por fila; Almacenado; Opcional; No clave; Multivaluación conceptual: pendiente de validar | Temporal: DATETIME; expresa fecha/hora con la precisión inherente al tipo. |

| Posición | Atributo | PK/FK/UNIQUE | NULL | Dominio técnico, DEFAULT y restricciones |
|---:|---|---|---|---|
| A1 | `ID` | PK | No | `BIGINT UNSIGNED; rango 0 a 18446744073709551615; NOT NULL; sin DEFAULT declarado; AUTO_INCREMENT` |
| A2 | `user_ID` | FK `tbd_user_payment_methods_ibfk_1` → `tb_users.ID` | No | `INT UNSIGNED; rango 0 a 4294967295; NOT NULL; sin DEFAULT declarado` |
| A3 | `payment_method_type_ID` | FK `tbd_user_payment_methods_ibfk_2` → `tbc_payment_methods_types.ID` | No | `INT UNSIGNED; rango 0 a 4294967295; NOT NULL; sin DEFAULT declarado` |
| A4 | `provider` | UNIQUE `uk_provider_method` (clave compuesta) | No | `VARCHAR(60); longitud máxima 60; NOT NULL; sin DEFAULT declarado; participa en UNIQUE uk_provider_method (compuesto)` |
| A5 | `provider_method_ref` | UNIQUE `uk_provider_method` (clave compuesta) | No | `VARCHAR(255); longitud máxima 255; NOT NULL; sin DEFAULT declarado; participa en UNIQUE uk_provider_method (compuesto)` |
| A6 | `label` | No clave | Sí | `VARCHAR(100); longitud máxima 100; NULL permitido; DEFAULT NULL` |
| A7 | `last_four` | No clave | Sí | `CHAR(4); longitud máxima 4; NULL permitido; DEFAULT NULL` |
| A8 | `is_default` | No clave | No | `TINYINT; rango -128 a 127; NOT NULL; DEFAULT '0'` |
| A9 | `status` | No clave | No | `BIT(1); NOT NULL; DEFAULT b'1'` |
| A10 | `creation_date` | No clave | No | `DATETIME; NOT NULL; DEFAULT CURRENT_TIMESTAMP` |
| A11 | `last_update` | No clave | Sí | `DATETIME; NULL permitido; DEFAULT NULL; ON UPDATE CURRENT_TIMESTAMP` |


**Clave primaria:** ID
**Índices:** PRIMARY `PRIMARY` (ID); UNIQUE `uk_provider_method` (provider, provider_method_ref); INDEX `user_ID` (user_ID); INDEX `payment_method_type_ID` (payment_method_type_ID)
**Reglas de integridad:** NOT NULL/NULL, DEFAULT, AUTO_INCREMENT, ON UPDATE, PK, UNIQUE, FK y CHECK según la definición SQL. Los CHECK se reproducen textualmente arriba.
**Dominio de negocio:** Los ENUM/CHECK permiten enumerar restricciones comprobables. El significado funcional de estados, códigos, unidades y nombres sin comentario SQL queda pendiente; no se infiere de DEFAULT.

## tbd_users_wishlist_products

**Nombre exacto:** `tbd_users_wishlist_products`.

**Descripción general:** Relaciona o detalla entidades identificadas por los componentes del nombre y las FK declaradas.

**Propósito de negocio:** Inferido del nombre de la entidad y de los vínculos/columnas declarados; requiere validación funcional. No se atribuyen reglas no presentes en el dump.

**Propósito técnico:** Tabla InnoDB declarada con 5 columnas y 0 filas insertadas en este respaldo.

**Clasificación:** Detalle o intermedia (inferido por prefijo y claves).

**Esquema relacional:** `tbd_users_wishlist_products(user_ID, product_ID, status, creation_date, last_update)`

**Notación formal:** R(A1, A2, …, A5); **grado:** 5. **PK:** user_ID, product_ID

**Relaciones:** No hay claves foráneas declaradas en esta tabla.

| Posición | Atributo | Tipo SQL | Descripción | Clasificación | Naturaleza |
|---:|---|---|---|---|---|
| A1 | `user_ID` | `INT UNSIGNED` | Identificador de la entidad indicada por el prefijo. Referencia declarada: ver PK/FK; si no hay FK, la relación semántica es inferida. | Monovalorado por fila; Almacenado; Obligatorio; PK; Multivaluación conceptual: pendiente de validar | Cualitativa nominal: identificador, no magnitud, aunque el tipo sea entero. |
| A2 | `product_ID` | `INT UNSIGNED` | Identificador de la entidad indicada por el prefijo. Referencia declarada: ver PK/FK; si no hay FK, la relación semántica es inferida. | Monovalorado por fila; Almacenado; Obligatorio; PK; Multivaluación conceptual: pendiente de validar | Cualitativa nominal: identificador, no magnitud, aunque el tipo sea entero. |
| A3 | `status` | `BIT(1)` | Estado o indicador del registro. Los valores quedan limitados únicamente por el tipo o CHECK declarado; significado funcional pendiente si no hay comentario SQL. | Monovalorado por fila; Almacenado; Obligatorio; No clave; Multivaluación conceptual: pendiente de validar | Cualitativa nominal; el SQL no declara jerarquía. Interpretación de negocio pendiente. |
| A4 | `creation_date` | `DATETIME` | Fecha u hora asociada al evento nombrado; el evento exacto se infiere del nombre. | Monovalorado por fila; Almacenado; Obligatorio; No clave; Multivaluación conceptual: pendiente de validar | Temporal: DATETIME; expresa fecha/hora con la precisión inherente al tipo. |
| A5 | `last_update` | `DATETIME` | Fecha u hora asociada al evento nombrado; el evento exacto se infiere del nombre. | Monovalorado por fila; Almacenado; Obligatorio; No clave; Multivaluación conceptual: pendiente de validar | Temporal: DATETIME; expresa fecha/hora con la precisión inherente al tipo. |

| Posición | Atributo | PK/FK/UNIQUE | NULL | Dominio técnico, DEFAULT y restricciones |
|---:|---|---|---|---|
| A1 | `user_ID` | PK | No | `INT UNSIGNED; rango 0 a 4294967295; NOT NULL; sin DEFAULT declarado` |
| A2 | `product_ID` | PK | No | `INT UNSIGNED; rango 0 a 4294967295; NOT NULL; sin DEFAULT declarado` |
| A3 | `status` | No clave | No | `BIT(1); NOT NULL; DEFAULT b'1'` |
| A4 | `creation_date` | No clave | No | `DATETIME; NOT NULL; DEFAULT CURRENT_TIMESTAMP` |
| A5 | `last_update` | No clave | No | `DATETIME; NOT NULL; sin DEFAULT declarado; ON UPDATE CURRENT_TIMESTAMP` |


**Clave primaria:** user_ID, product_ID
**Índices:** PRIMARY `PRIMARY` (user_ID, product_ID)
**Reglas de integridad:** NOT NULL/NULL, DEFAULT, AUTO_INCREMENT, ON UPDATE, PK, UNIQUE, FK y CHECK según la definición SQL. Los CHECK se reproducen textualmente arriba.
**Dominio de negocio:** Los ENUM/CHECK permiten enumerar restricciones comprobables. El significado funcional de estados, códigos, unidades y nombres sin comentario SQL queda pendiente; no se infiere de DEFAULT.

## Objetos adicionales

### Triggers

- `trg_address_components_after_delete`
- `trg_address_components_after_insert`
- `trg_address_components_after_update`
- `trg_buyer_orders_after_delete`
- `trg_buyer_orders_after_insert`
- `trg_buyer_orders_after_update`
- `trg_cancellation_items_ad`
- `trg_cancellation_items_ai`
- `trg_cancellation_items_au`
- `trg_cancellations_after_delete`
- `trg_cancellations_after_insert`
- `trg_cancellations_after_update`
- `trg_carts_after_delete`
- `trg_carts_after_insert`
- `trg_carts_after_update`
- `trg_carts_items_after_delete`
- `trg_carts_items_after_insert`
- `trg_carts_items_after_update`
- `trg_categories_after_delete`
- `trg_categories_after_insert`
- `trg_categories_after_update`
- `trg_order_items_after_delete`
- `trg_order_items_after_insert`
- `trg_order_items_after_update`
- `trg_payment_methods_ad`
- `trg_payment_methods_ai`
- `trg_payment_methods_au`
- `trg_payment_methods_types_after_delete`
- `trg_payment_methods_types_after_insert`
- `trg_payment_methods_types_after_update`
- `trg_payment_transactions_ad`
- `trg_payment_transactions_ai`
- `trg_payment_transactions_au`
- `trg_payments_ad`
- `trg_payments_ai`
- `trg_payments_au`
- `trg_people_after_delete`
- `trg_people_after_insert`
- `trg_people_after_update`
- `trg_products_after_delete`
- `trg_products_after_insert`
- `trg_products_after_update`
- `trg_products_categories_after_delete`
- `trg_products_categories_after_insert`
- `trg_products_categories_after_update`
- `trg_refunds_after_delete`
- `trg_refunds_after_insert`
- `trg_refunds_after_update`
- `trg_return_items_ad`
- `trg_return_items_ai`
- `trg_return_items_au`
- `trg_returns_after_delete`
- `trg_returns_after_insert`
- `trg_returns_after_update`
- `trg_shipments_after_delete`
- `trg_shipments_after_insert`
- `trg_shipments_after_update`
- `trg_tbd_products_users_providers_after_delete`
- `trg_tbd_products_users_providers_after_insert`
- `trg_tbd_products_users_providers_after_update`
- `trg_user_addresses_after_delete`
- `trg_user_addresses_after_insert`
- `trg_user_addresses_after_update`
- `trg_user_payment_methods_after_delete`
- `trg_user_payment_methods_after_insert`
- `trg_user_payment_methods_after_update`
- `trg_users_after_delete`
- `trg_users_after_insert`
- `trg_users_after_update`
- `trg_users_wishlist_products_after_delete`
- `trg_users_wishlist_products_after_insert`
- `trg_users_wishlist_products_after_update`

### Vistas

- `vw_total_products_by_category`
- `vw_trazabilidad_address_components`
- `vw_trazabilidad_buyer_orders`
- `vw_trazabilidad_cancellation_items`
- `vw_trazabilidad_cancellations`
- `vw_trazabilidad_carts`
- `vw_trazabilidad_carts_items`
- `vw_trazabilidad_categorias`
- `vw_trazabilidad_general`
- `vw_trazabilidad_order_items`
- `vw_trazabilidad_orders`
- `vw_trazabilidad_payment_methods`
- `vw_trazabilidad_payment_methods_types`
- `vw_trazabilidad_people`
- `vw_trazabilidad_productos`
- `vw_trazabilidad_productos_proveedores`
- `vw_trazabilidad_refunds`
- `vw_trazabilidad_return_items`
- `vw_trazabilidad_returns`
- `vw_trazabilidad_shipments`
- `vw_trazabilidad_tb_payment_transactions`
- `vw_trazabilidad_tb_payments`
- `vw_trazabilidad_tb_products`
- `vw_trazabilidad_tbd_products_categories`
- `vw_trazabilidad_user_addresses`
- `vw_trazabilidad_user_payment_methods`
- `vw_trazabilidad_users_wishlist_products`
- `vw_trazabilidad_usuarios`

### Procedimientos

- `sp_register_user`
- `sp_soft_delete_user`

### Funciones

Ninguna detectada.

## Pendientes de interpretación

- Los propósitos de negocio y las descripciones derivadas de nombres se marcan como inferidos; requieren contraste con requisitos de la aplicación.
- No se clasifica ENUM como ordinal salvo que el SQL defina una escala de negocio; el orden de declaración ENUM no prueba semántica ordinal.
- Todas las columnas físicas se consideran monovaloradas por fila; atributos conceptualmente multivalorados no se infieren solo por texto/JSON. Relaciones repetibles se modelan mediante filas y tablas asociativas cuando así se evidencia en el esquema.
- Naturaleza de columnas cuyo significado no es inequívoco queda marcada como pendiente/condicional. Identificadores enteros se tratan como cualitativos nominales.
- Sin CHECK/ENUM/comentario, el dominio de negocio no puede confirmarse; el dominio técnico deriva del tipo y restricciones.