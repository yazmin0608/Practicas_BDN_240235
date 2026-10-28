# Diccionario de datos — Respaldo 2710

**Base:** `db_test` · **Fuente:** `Practica03/backups/Respaldo_2710.sql` · **Servidor indicado:** MySQL 8.0.36.

Inventario extraído de las definiciones SQL: **25 tablas**, **226 columnas**, **36 FK**. No se ejecutó SQL. Las descripciones no declaradas por el esquema se marcan como inferidas.

## tb_buyer_orders

**Descripción general:** Entidad indicada por el nombre de la tabla; explicación funcional inferida y pendiente de validación con la aplicación.

**Propósito de negocio:** Transaccional (inferido por nombre); el respaldo no contiene especificación funcional explícita.

**Propósito técnico:** Persistir 8 atributos; las claves, índices y restricciones se listan abajo.

**Clasificación:** Transaccional (inferido por nombre).

**Esquema:** `tb_buyer_orders(ID, order_ID, seller_ID, subtotal, shipping_cost, fulfillment_status, creation_date, last_update)`

**Notación:** R(A1, A2, …, A8) · **Grado:** 8 · **PK:** ID

**CHECK:** CONSTRAINT `tb_buyer_orders_chk_1` CHECK ((`subtotal` >= 0)); CONSTRAINT `tb_buyer_orders_chk_2` CHECK ((`shipping_cost` >= 0))
**Relaciones:** seller_ID → tb_users(ID); muchos-a-uno desde esta tabla; restricción fk_seller_orders_seller; acciones no especificadas

| Posición | Atributo | Tipo SQL | Descripción | Clasificación | Naturaleza |
|---:|---|---|---|---|---|
| A1 | `ID` | `INT` | Identificador de registro o referencia; el destino solo se afirma si existe FK declarada. | Monovalorado por fila, Almacenado, Obligatorio, PK | Cualitativa nominal: identificador, no magnitud. |
| A2 | `order_ID` | `INT` | Identificador de registro o referencia; el destino solo se afirma si existe FK declarada. | Monovalorado por fila, Almacenado, Obligatorio, No clave | Cualitativa nominal: identificador, no magnitud. |
| A3 | `seller_ID` | `INT` | Identificador de registro o referencia; el destino solo se afirma si existe FK declarada. | Monovalorado por fila, Almacenado, Obligatorio, FK | Cualitativa nominal: identificador, no magnitud. |
| A4 | `subtotal` | `DECIMAL(12,2)` | Importe/magnitud monetaria inferida por el nombre; moneda no especificada aquí. | Monovalorado por fila, Almacenado, Obligatorio, No clave | Cuantitativa continua por representación numérica; semántica inferida. |
| A5 | `shipping_cost` | `DECIMAL(12,2)` | Importe/magnitud monetaria inferida por el nombre; moneda no especificada aquí. | Monovalorado por fila, Almacenado, Obligatorio, No clave | Cuantitativa continua por representación numérica; semántica inferida. |
| A6 | `fulfillment_status` | `ENUM('Pending','Accepted','Preparing','Sent','Delivered','Canceled','Returned')` | Estado/indicador del registro; dominio explícito en SQL cuando es ENUM o BIT. | Monovalorado por fila, Almacenado, Obligatorio, No clave | Cualitativa nominal; sin orden definido por SQL. |
| A7 | `creation_date` | `DATETIME` | Marca temporal asociada al evento nombrado (significado inferido). | Monovalorado por fila, Almacenado, Obligatorio, No clave | Temporal (DATETIME). |
| A8 | `last_update` | `DATETIME` | Marca temporal asociada al evento nombrado (significado inferido). `ON UPDATE CURRENT_TIMESTAMP`. | Monovalorado por fila, Almacenado, Opcional, No clave | Temporal (DATETIME). |

| Posición | Atributo | PK/FK/UNIQUE | NULL | Dominio técnico |
|---:|---|---|---|---|
| A1 | `ID` | PK | No | `INT; NOT NULL; DEFAULT sin DEFAULT; AUTO_INCREMENT` |
| A2 | `order_ID` | Atributo no clave | No | `INT; NOT NULL; DEFAULT sin DEFAULT` |
| A3 | `seller_ID` | FK → tb_users.ID | No | `INT; NOT NULL; DEFAULT sin DEFAULT` |
| A4 | `subtotal` | Atributo no clave | No | `DECIMAL(12,2); NOT NULL; DEFAULT '0.00'` |
| A5 | `shipping_cost` | Atributo no clave | No | `DECIMAL(12,2); NOT NULL; DEFAULT '0.00'` |
| A6 | `fulfillment_status` | Atributo no clave | No | `ENUM('Pending','Accepted','Preparing','Sent','Delivered','Canceled','Returned'); NOT NULL; DEFAULT 'Pending'` |
| A7 | `creation_date` | Atributo no clave | No | `DATETIME; NOT NULL; DEFAULT CURRENT_TIMESTAMP` |
| A8 | `last_update` | Atributo no clave | Sí | `DATETIME; NULL permitido; DEFAULT NULL` |


**Índices:** PK PRIMARY(ID); INDEX fk_seller_orders_seller_idx(seller_ID)
**Reglas respaldadas:** NOT NULL, DEFAULT, AUTO_INCREMENT, ON UPDATE, ENUM/SET, PK, FK, UNIQUE y CHECK según lo declarado en SQL. La semántica de negocio de estas reglas queda pendiente cuando no se expresa en la restricción.

## tb_cancellations

**Descripción general:** Entidad indicada por el nombre de la tabla; explicación funcional inferida y pendiente de validación con la aplicación.

**Propósito de negocio:** Transaccional (inferido por nombre); el respaldo no contiene especificación funcional explícita.

**Propósito técnico:** Persistir 11 atributos; las claves, índices y restricciones se listan abajo.

**Clasificación:** Transaccional (inferido por nombre).

**Esquema:** `tb_cancellations(ID, buyer_order_ID, user_ID, cancellation_reason, cancellation_status, requested_date, resolved_date, resolution_notes, status, creation_date, last_update)`

**Notación:** R(A1, A2, …, A11) · **Grado:** 11 · **PK:** ID

**Relaciones:** buyer_order_ID → tb_buyer_orders(ID); muchos-a-uno desde esta tabla; restricción fk_cancellations_order; acciones no especificadas; user_ID → tb_users(ID); muchos-a-uno desde esta tabla; restricción fk_cancellations_user; acciones no especificadas

| Posición | Atributo | Tipo SQL | Descripción | Clasificación | Naturaleza |
|---:|---|---|---|---|---|
| A1 | `ID` | `INT` | Identificador de registro o referencia; el destino solo se afirma si existe FK declarada. | Monovalorado por fila, Almacenado, Obligatorio, PK | Cualitativa nominal: identificador, no magnitud. |
| A2 | `buyer_order_ID` | `INT` | Identificador de registro o referencia; el destino solo se afirma si existe FK declarada. | Monovalorado por fila, Almacenado, Obligatorio, FK | Cualitativa nominal: identificador, no magnitud. |
| A3 | `user_ID` | `INT` | Identificador de registro o referencia; el destino solo se afirma si existe FK declarada. | Monovalorado por fila, Almacenado, Obligatorio, FK | Cualitativa nominal: identificador, no magnitud. |
| A4 | `cancellation_reason` | `VARCHAR(500)` | Texto descriptivo asociado al registro (inferencia por nombre). | Monovalorado por fila, Almacenado, Obligatorio, No clave | Cualitativa nominal; sin orden definido por SQL. |
| A5 | `cancellation_status` | `ENUM('Requested','Approved','Rejected','Completed')` | Estado/indicador del registro; dominio explícito en SQL cuando es ENUM o BIT. | Monovalorado por fila, Almacenado, Obligatorio, No clave | Cualitativa nominal; sin orden definido por SQL. |
| A6 | `requested_date` | `DATETIME` | Marca temporal asociada al evento nombrado (significado inferido). | Monovalorado por fila, Almacenado, Obligatorio, No clave | Temporal (DATETIME). |
| A7 | `resolved_date` | `DATETIME` | Marca temporal asociada al evento nombrado (significado inferido). | Monovalorado por fila, Almacenado, Opcional, No clave | Temporal (DATETIME). |
| A8 | `resolution_notes` | `TEXT` | Texto descriptivo asociado al registro (inferencia por nombre). | Monovalorado por fila, Almacenado, Opcional, No clave | Cualitativa nominal; sin orden definido por SQL. |
| A9 | `status` | `BIT(1)` | Estado/indicador del registro; dominio explícito en SQL cuando es ENUM o BIT. | Monovalorado por fila, Almacenado, Obligatorio, No clave | Cualitativa nominal; sin orden definido por SQL. |
| A10 | `creation_date` | `DATETIME` | Marca temporal asociada al evento nombrado (significado inferido). | Monovalorado por fila, Almacenado, Obligatorio, No clave | Temporal (DATETIME). |
| A11 | `last_update` | `DATETIME` | Marca temporal asociada al evento nombrado (significado inferido). `ON UPDATE CURRENT_TIMESTAMP`. | Monovalorado por fila, Almacenado, Opcional, No clave | Temporal (DATETIME). |

| Posición | Atributo | PK/FK/UNIQUE | NULL | Dominio técnico |
|---:|---|---|---|---|
| A1 | `ID` | PK | No | `INT; NOT NULL; DEFAULT sin DEFAULT; AUTO_INCREMENT` |
| A2 | `buyer_order_ID` | FK → tb_buyer_orders.ID | No | `INT; NOT NULL; DEFAULT sin DEFAULT` |
| A3 | `user_ID` | FK → tb_users.ID | No | `INT; NOT NULL; DEFAULT sin DEFAULT` |
| A4 | `cancellation_reason` | Atributo no clave | No | `VARCHAR(500); NOT NULL; DEFAULT sin DEFAULT` |
| A5 | `cancellation_status` | Atributo no clave | No | `ENUM('Requested','Approved','Rejected','Completed'); NOT NULL; DEFAULT 'Requested'` |
| A6 | `requested_date` | Atributo no clave | No | `DATETIME; NOT NULL; DEFAULT CURRENT_TIMESTAMP` |
| A7 | `resolved_date` | Atributo no clave | Sí | `DATETIME; NULL permitido; DEFAULT NULL` |
| A8 | `resolution_notes` | Atributo no clave | Sí | `TEXT; NULL permitido; DEFAULT sin DEFAULT` |
| A9 | `status` | Atributo no clave | No | `BIT(1); NOT NULL; DEFAULT b'1'` |
| A10 | `creation_date` | Atributo no clave | No | `DATETIME; NOT NULL; DEFAULT CURRENT_TIMESTAMP` |
| A11 | `last_update` | Atributo no clave | Sí | `DATETIME; NULL permitido; DEFAULT NULL` |


**Índices:** PK PRIMARY(ID); INDEX idx_cancellation_order(buyer_order_ID); INDEX idx_cancellation_user(user_ID)
**Reglas respaldadas:** NOT NULL, DEFAULT, AUTO_INCREMENT, ON UPDATE, ENUM/SET, PK, FK, UNIQUE y CHECK según lo declarado en SQL. La semántica de negocio de estas reglas queda pendiente cuando no se expresa en la restricción.

## tb_carts

**Descripción general:** Entidad indicada por el nombre de la tabla; explicación funcional inferida y pendiente de validación con la aplicación.

**Propósito de negocio:** Transaccional (inferido por nombre); el respaldo no contiene especificación funcional explícita.

**Propósito técnico:** Persistir 5 atributos; las claves, índices y restricciones se listan abajo.

**Clasificación:** Transaccional (inferido por nombre).

**Esquema:** `tb_carts(ID, user_ID, creation_date, last_update, status)`

**Notación:** R(A1, A2, …, A5) · **Grado:** 5 · **PK:** ID

**Relaciones:** user_ID → tb_users(ID); muchos-a-uno desde esta tabla; restricción tb_carts_ibfk_1; acciones no especificadas

| Posición | Atributo | Tipo SQL | Descripción | Clasificación | Naturaleza |
|---:|---|---|---|---|---|
| A1 | `ID` | `INT` | Identificador de registro o referencia; el destino solo se afirma si existe FK declarada. | Monovalorado por fila, Almacenado, Obligatorio, PK | Cualitativa nominal: identificador, no magnitud. |
| A2 | `user_ID` | `INT` | Identificador de registro o referencia; el destino solo se afirma si existe FK declarada. | Monovalorado por fila, Almacenado, Obligatorio, FK, UNIQUE | Cualitativa nominal: identificador, no magnitud. |
| A3 | `creation_date` | `DATETIME` | Marca temporal asociada al evento nombrado (significado inferido). | Monovalorado por fila, Almacenado, Obligatorio, No clave | Temporal (DATETIME). |
| A4 | `last_update` | `DATETIME` | Marca temporal asociada al evento nombrado (significado inferido). `ON UPDATE CURRENT_TIMESTAMP`. | Monovalorado por fila, Almacenado, Opcional, No clave | Temporal (DATETIME). |
| A5 | `status` | `BIT(1)` | Estado/indicador del registro; dominio explícito en SQL cuando es ENUM o BIT. | Monovalorado por fila, Almacenado, Opcional, No clave | Cualitativa nominal; sin orden definido por SQL. |

| Posición | Atributo | PK/FK/UNIQUE | NULL | Dominio técnico |
|---:|---|---|---|---|
| A1 | `ID` | PK | No | `INT; NOT NULL; DEFAULT sin DEFAULT; AUTO_INCREMENT` |
| A2 | `user_ID` | FK → tb_users.ID, UNIQUE | No | `INT; NOT NULL; DEFAULT sin DEFAULT` |
| A3 | `creation_date` | Atributo no clave | No | `DATETIME; NOT NULL; DEFAULT CURRENT_TIMESTAMP` |
| A4 | `last_update` | Atributo no clave | Sí | `DATETIME; NULL permitido; DEFAULT NULL` |
| A5 | `status` | Atributo no clave | Sí | `BIT(1); NULL permitido; DEFAULT b'1'` |


**Índices:** PK PRIMARY(ID); UNIQUE uk_cart_user(user_ID)
**Reglas respaldadas:** NOT NULL, DEFAULT, AUTO_INCREMENT, ON UPDATE, ENUM/SET, PK, FK, UNIQUE y CHECK según lo declarado en SQL. La semántica de negocio de estas reglas queda pendiente cuando no se expresa en la restricción.

## tb_logs

**Descripción general:** Entidad indicada por el nombre de la tabla; explicación funcional inferida y pendiente de validación con la aplicación.

**Propósito de negocio:** Auditoría/trazabilidad; el respaldo no contiene especificación funcional explícita.

**Propósito técnico:** Persistir 7 atributos; las claves, índices y restricciones se listan abajo.

**Clasificación:** Auditoría/trazabilidad.

**Esquema:** `tb_logs(ID, table_name, operation, db_users, description, operation_date, operation_status)`

**Notación:** R(A1, A2, …, A7) · **Grado:** 7 · **PK:** ID

**Relaciones:** Sin FK declaradas.

| Posición | Atributo | Tipo SQL | Descripción | Clasificación | Naturaleza |
|---:|---|---|---|---|---|
| A1 | `ID` | `INT` | Identificador de registro o referencia; el destino solo se afirma si existe FK declarada. | Monovalorado por fila, Almacenado, Obligatorio, PK | Cualitativa nominal: identificador, no magnitud. |
| A2 | `table_name` | `VARCHAR(100)` | Dato identificativo/descriptivo cuyo uso se infiere del nombre de columna. | Monovalorado por fila, Almacenado, Obligatorio, No clave | Cualitativa nominal; sin orden definido por SQL. |
| A3 | `operation` | `ENUM('Create','Read','Update','Delete')` | Dato operation; significado funcional inferido por el nombre y pendiente de validación. | Monovalorado por fila, Almacenado, Obligatorio, No clave | Cualitativa nominal; sin orden definido por SQL. |
| A4 | `db_users` | `VARCHAR(80)` | Dato db users; significado funcional inferido por el nombre y pendiente de validación. | Monovalorado por fila, Almacenado, Obligatorio, No clave | Cualitativa nominal; sin orden definido por SQL. |
| A5 | `description` | `TEXT` | Texto descriptivo asociado al registro (inferencia por nombre). | Monovalorado por fila, Almacenado, Obligatorio, No clave | Cualitativa nominal; sin orden definido por SQL. |
| A6 | `operation_date` | `DATETIME` | Marca temporal asociada al evento nombrado (significado inferido). | Monovalorado por fila, Almacenado, Obligatorio, No clave | Temporal (DATETIME). |
| A7 | `operation_status` | `BIT(1)` | Estado/indicador del registro; dominio explícito en SQL cuando es ENUM o BIT. | Monovalorado por fila, Almacenado, Opcional, No clave | Cualitativa nominal; sin orden definido por SQL. |

| Posición | Atributo | PK/FK/UNIQUE | NULL | Dominio técnico |
|---:|---|---|---|---|
| A1 | `ID` | PK | No | `INT; NOT NULL; DEFAULT sin DEFAULT; AUTO_INCREMENT` |
| A2 | `table_name` | Atributo no clave | No | `VARCHAR(100); NOT NULL; DEFAULT sin DEFAULT` |
| A3 | `operation` | Atributo no clave | No | `ENUM('Create','Read','Update','Delete'); NOT NULL; DEFAULT sin DEFAULT` |
| A4 | `db_users` | Atributo no clave | No | `VARCHAR(80); NOT NULL; DEFAULT sin DEFAULT` |
| A5 | `description` | Atributo no clave | No | `TEXT; NOT NULL; DEFAULT sin DEFAULT` |
| A6 | `operation_date` | Atributo no clave | No | `DATETIME; NOT NULL; DEFAULT CURRENT_TIMESTAMP` |
| A7 | `operation_status` | Atributo no clave | Sí | `BIT(1); NULL permitido; DEFAULT b'1'` |


**Índices:** PK PRIMARY(ID)
**Reglas respaldadas:** NOT NULL, DEFAULT, AUTO_INCREMENT, ON UPDATE, ENUM/SET, PK, FK, UNIQUE y CHECK según lo declarado en SQL. La semántica de negocio de estas reglas queda pendiente cuando no se expresa en la restricción.

## tb_payment_methods

**Descripción general:** Entidad indicada por el nombre de la tabla; explicación funcional inferida y pendiente de validación con la aplicación.

**Propósito de negocio:** Transaccional (inferido por nombre); el respaldo no contiene especificación funcional explícita.

**Propósito técnico:** Persistir 13 atributos; las claves, índices y restricciones se listan abajo.

**Clasificación:** Transaccional (inferido por nombre).

**Esquema:** `tb_payment_methods(ID, order_ID, user_ID, payment_method_type_ID, payment_reference, amount, currency, payment_status, payment_date, notes, status, creation_date, last_update)`

**Notación:** R(A1, A2, …, A13) · **Grado:** 13 · **PK:** ID

**CHECK:** CONSTRAINT `chk_payment_methods_amount` CHECK ((`amount` > 0))
**Relaciones:** payment_method_type_ID → tbc_payment_methods_types(ID); muchos-a-uno desde esta tabla; restricción fk_payment_methods_type; acciones no especificadas; user_ID → tb_users(ID); muchos-a-uno desde esta tabla; restricción fk_payment_methods_user; acciones no especificadas

| Posición | Atributo | Tipo SQL | Descripción | Clasificación | Naturaleza |
|---:|---|---|---|---|---|
| A1 | `ID` | `INT` | Identificador de registro o referencia; el destino solo se afirma si existe FK declarada. | Monovalorado por fila, Almacenado, Obligatorio, PK | Cualitativa nominal: identificador, no magnitud. |
| A2 | `order_ID` | `INT` | Identificador de registro o referencia; el destino solo se afirma si existe FK declarada. | Monovalorado por fila, Almacenado, Obligatorio, No clave | Cualitativa nominal: identificador, no magnitud. |
| A3 | `user_ID` | `INT` | Identificador de registro o referencia; el destino solo se afirma si existe FK declarada. | Monovalorado por fila, Almacenado, Obligatorio, FK | Cualitativa nominal: identificador, no magnitud. |
| A4 | `payment_method_type_ID` | `INT` | Identificador de registro o referencia; el destino solo se afirma si existe FK declarada. | Monovalorado por fila, Almacenado, Obligatorio, FK | Cualitativa nominal: identificador, no magnitud. |
| A5 | `payment_reference` | `VARCHAR(150)` | Dato payment reference; significado funcional inferido por el nombre y pendiente de validación. | Monovalorado por fila, Almacenado, Opcional, No clave | Cualitativa nominal; sin orden definido por SQL. |
| A6 | `amount` | `DECIMAL(12,2)` | Importe/magnitud monetaria inferida por el nombre; moneda no especificada aquí. | Monovalorado por fila, Almacenado, Obligatorio, No clave | Cuantitativa continua por representación numérica; semántica inferida. |
| A7 | `currency` | `CHAR(3)` | Dato currency; significado funcional inferido por el nombre y pendiente de validación. | Monovalorado por fila, Almacenado, Obligatorio, No clave | Cualitativa nominal; sin orden definido por SQL. |
| A8 | `payment_status` | `ENUM('Pending','Authorized','Paid','Failed','Cancelled','Refunded')` | Estado/indicador del registro; dominio explícito en SQL cuando es ENUM o BIT. | Monovalorado por fila, Almacenado, Obligatorio, No clave | Cualitativa nominal; sin orden definido por SQL. |
| A9 | `payment_date` | `DATETIME` | Marca temporal asociada al evento nombrado (significado inferido). | Monovalorado por fila, Almacenado, Opcional, No clave | Temporal (DATETIME). |
| A10 | `notes` | `TEXT` | Texto descriptivo asociado al registro (inferencia por nombre). | Monovalorado por fila, Almacenado, Opcional, No clave | Cualitativa nominal; sin orden definido por SQL. |
| A11 | `status` | `BIT(1)` | Estado/indicador del registro; dominio explícito en SQL cuando es ENUM o BIT. | Monovalorado por fila, Almacenado, Obligatorio, No clave | Cualitativa nominal; sin orden definido por SQL. |
| A12 | `creation_date` | `DATETIME` | Marca temporal asociada al evento nombrado (significado inferido). | Monovalorado por fila, Almacenado, Obligatorio, No clave | Temporal (DATETIME). |
| A13 | `last_update` | `DATETIME` | Marca temporal asociada al evento nombrado (significado inferido). `ON UPDATE CURRENT_TIMESTAMP`. | Monovalorado por fila, Almacenado, Opcional, No clave | Temporal (DATETIME). |

| Posición | Atributo | PK/FK/UNIQUE | NULL | Dominio técnico |
|---:|---|---|---|---|
| A1 | `ID` | PK | No | `INT; NOT NULL; DEFAULT sin DEFAULT; AUTO_INCREMENT` |
| A2 | `order_ID` | Atributo no clave | No | `INT; NOT NULL; DEFAULT sin DEFAULT` |
| A3 | `user_ID` | FK → tb_users.ID | No | `INT; NOT NULL; DEFAULT sin DEFAULT` |
| A4 | `payment_method_type_ID` | FK → tbc_payment_methods_types.ID | No | `INT; NOT NULL; DEFAULT sin DEFAULT` |
| A5 | `payment_reference` | Atributo no clave | Sí | `VARCHAR(150); NULL permitido; DEFAULT NULL` |
| A6 | `amount` | Atributo no clave | No | `DECIMAL(12,2); NOT NULL; DEFAULT sin DEFAULT` |
| A7 | `currency` | Atributo no clave | No | `CHAR(3); NOT NULL; DEFAULT 'MXN'` |
| A8 | `payment_status` | Atributo no clave | No | `ENUM('Pending','Authorized','Paid','Failed','Cancelled','Refunded'); NOT NULL; DEFAULT 'Pending'` |
| A9 | `payment_date` | Atributo no clave | Sí | `DATETIME; NULL permitido; DEFAULT NULL` |
| A10 | `notes` | Atributo no clave | Sí | `TEXT; NULL permitido; DEFAULT sin DEFAULT` |
| A11 | `status` | Atributo no clave | No | `BIT(1); NOT NULL; DEFAULT b'1'` |
| A12 | `creation_date` | Atributo no clave | No | `DATETIME; NOT NULL; DEFAULT CURRENT_TIMESTAMP` |
| A13 | `last_update` | Atributo no clave | Sí | `DATETIME; NULL permitido; DEFAULT NULL` |


**Índices:** PK PRIMARY(ID); INDEX idx_payment_methods_order(order_ID); INDEX idx_payment_methods_user(user_ID); INDEX idx_payment_methods_type(payment_method_type_ID)
**Reglas respaldadas:** NOT NULL, DEFAULT, AUTO_INCREMENT, ON UPDATE, ENUM/SET, PK, FK, UNIQUE y CHECK según lo declarado en SQL. La semántica de negocio de estas reglas queda pendiente cuando no se expresa en la restricción.

## tb_payment_transactions

**Descripción general:** Entidad indicada por el nombre de la tabla; explicación funcional inferida y pendiente de validación con la aplicación.

**Propósito de negocio:** Transaccional (inferido por nombre); el respaldo no contiene especificación funcional explícita.

**Propósito técnico:** Persistir 7 atributos; las claves, índices y restricciones se listan abajo.

**Clasificación:** Transaccional (inferido por nombre).

**Esquema:** `tb_payment_transactions(ID, payment_ID, event_type, amount, event_reference, remarks, creation_date)`

**Notación:** R(A1, A2, …, A7) · **Grado:** 7 · **PK:** ID

**CHECK:** CONSTRAINT `chk_transaction_amount` CHECK ((`amount` >= 0))
**Relaciones:** payment_ID → tb_payments(ID); muchos-a-uno desde esta tabla; restricción fk_transactions_payments; acciones no especificadas

| Posición | Atributo | Tipo SQL | Descripción | Clasificación | Naturaleza |
|---:|---|---|---|---|---|
| A1 | `ID` | `INT` | Identificador de registro o referencia; el destino solo se afirma si existe FK declarada. | Monovalorado por fila, Almacenado, Obligatorio, PK | Cualitativa nominal: identificador, no magnitud. |
| A2 | `payment_ID` | `INT` | Identificador de registro o referencia; el destino solo se afirma si existe FK declarada. | Monovalorado por fila, Almacenado, Obligatorio, FK | Cualitativa nominal: identificador, no magnitud. |
| A3 | `event_type` | `ENUM('Created','Authorized','Captured','Failed','Refunded','PartiallyRefunded')` | Dato event type; significado funcional inferido por el nombre y pendiente de validación. | Monovalorado por fila, Almacenado, Obligatorio, No clave | Cualitativa nominal; sin orden definido por SQL. |
| A4 | `amount` | `DECIMAL(12,2)` | Importe/magnitud monetaria inferida por el nombre; moneda no especificada aquí. | Monovalorado por fila, Almacenado, Obligatorio, No clave | Cuantitativa continua por representación numérica; semántica inferida. |
| A5 | `event_reference` | `VARCHAR(150)` | Dato event reference; significado funcional inferido por el nombre y pendiente de validación. | Monovalorado por fila, Almacenado, Opcional, No clave | Cualitativa nominal; sin orden definido por SQL. |
| A6 | `remarks` | `TEXT` | Dato remarks; significado funcional inferido por el nombre y pendiente de validación. | Monovalorado por fila, Almacenado, Opcional, No clave | Cualitativa nominal; sin orden definido por SQL. |
| A7 | `creation_date` | `DATETIME` | Marca temporal asociada al evento nombrado (significado inferido). | Monovalorado por fila, Almacenado, Obligatorio, No clave | Temporal (DATETIME). |

| Posición | Atributo | PK/FK/UNIQUE | NULL | Dominio técnico |
|---:|---|---|---|---|
| A1 | `ID` | PK | No | `INT; NOT NULL; DEFAULT sin DEFAULT; AUTO_INCREMENT` |
| A2 | `payment_ID` | FK → tb_payments.ID | No | `INT; NOT NULL; DEFAULT sin DEFAULT` |
| A3 | `event_type` | Atributo no clave | No | `ENUM('Created','Authorized','Captured','Failed','Refunded','PartiallyRefunded'); NOT NULL; DEFAULT sin DEFAULT` |
| A4 | `amount` | Atributo no clave | No | `DECIMAL(12,2); NOT NULL; DEFAULT sin DEFAULT` |
| A5 | `event_reference` | Atributo no clave | Sí | `VARCHAR(150); NULL permitido; DEFAULT NULL` |
| A6 | `remarks` | Atributo no clave | Sí | `TEXT; NULL permitido; DEFAULT sin DEFAULT` |
| A7 | `creation_date` | Atributo no clave | No | `DATETIME; NOT NULL; DEFAULT CURRENT_TIMESTAMP` |


**Índices:** PK PRIMARY(ID); INDEX fk_transactions_payments(payment_ID)
**Reglas respaldadas:** NOT NULL, DEFAULT, AUTO_INCREMENT, ON UPDATE, ENUM/SET, PK, FK, UNIQUE y CHECK según lo declarado en SQL. La semántica de negocio de estas reglas queda pendiente cuando no se expresa en la restricción.

## tb_payments

**Descripción general:** Entidad indicada por el nombre de la tabla; explicación funcional inferida y pendiente de validación con la aplicación.

**Propósito de negocio:** Transaccional (inferido por nombre); el respaldo no contiene especificación funcional explícita.

**Propósito técnico:** Persistir 11 atributos; las claves, índices y restricciones se listan abajo.

**Clasificación:** Transaccional (inferido por nombre).

**Esquema:** `tb_payments(ID, order_ID, amount, currency, payment_method, provider, provider_reference, payment_status, creation_date, paid_date, last_update)`

**Notación:** R(A1, A2, …, A11) · **Grado:** 11 · **PK:** ID

**CHECK:** CONSTRAINT `chk_payment_amount` CHECK ((`amount` > 0))
**Relaciones:** order_ID → tb_buyer_orders(ID); muchos-a-uno desde esta tabla; restricción fk_payments_buyer_orders; acciones no especificadas

| Posición | Atributo | Tipo SQL | Descripción | Clasificación | Naturaleza |
|---:|---|---|---|---|---|
| A1 | `ID` | `INT` | Identificador de registro o referencia; el destino solo se afirma si existe FK declarada. | Monovalorado por fila, Almacenado, Obligatorio, PK | Cualitativa nominal: identificador, no magnitud. |
| A2 | `order_ID` | `INT` | Identificador de registro o referencia; el destino solo se afirma si existe FK declarada. | Monovalorado por fila, Almacenado, Obligatorio, FK | Cualitativa nominal: identificador, no magnitud. |
| A3 | `amount` | `DECIMAL(12,2)` | Importe/magnitud monetaria inferida por el nombre; moneda no especificada aquí. | Monovalorado por fila, Almacenado, Obligatorio, No clave | Cuantitativa continua por representación numérica; semántica inferida. |
| A4 | `currency` | `CHAR(3)` | Dato currency; significado funcional inferido por el nombre y pendiente de validación. | Monovalorado por fila, Almacenado, Obligatorio, No clave | Cualitativa nominal; sin orden definido por SQL. |
| A5 | `payment_method` | `ENUM('Card','SPEI','Transfer','Cash')` | Dato payment method; significado funcional inferido por el nombre y pendiente de validación. | Monovalorado por fila, Almacenado, Obligatorio, No clave | Cualitativa nominal; sin orden definido por SQL. |
| A6 | `provider` | `VARCHAR(50)` | Dato provider; significado funcional inferido por el nombre y pendiente de validación. | Monovalorado por fila, Almacenado, Opcional, UNIQUE | Cualitativa nominal; sin orden definido por SQL. |
| A7 | `provider_reference` | `VARCHAR(150)` | Dato provider reference; significado funcional inferido por el nombre y pendiente de validación. | Monovalorado por fila, Almacenado, Opcional, UNIQUE | Cualitativa nominal; sin orden definido por SQL. |
| A8 | `payment_status` | `ENUM('Pending','Authorized','Paid','Failed','Refunded','PartiallyRefunded')` | Estado/indicador del registro; dominio explícito en SQL cuando es ENUM o BIT. | Monovalorado por fila, Almacenado, Obligatorio, No clave | Cualitativa nominal; sin orden definido por SQL. |
| A9 | `creation_date` | `DATETIME` | Marca temporal asociada al evento nombrado (significado inferido). | Monovalorado por fila, Almacenado, Obligatorio, No clave | Temporal (DATETIME). |
| A10 | `paid_date` | `DATETIME` | Marca temporal asociada al evento nombrado (significado inferido). | Monovalorado por fila, Almacenado, Opcional, No clave | Temporal (DATETIME). |
| A11 | `last_update` | `DATETIME` | Marca temporal asociada al evento nombrado (significado inferido). `ON UPDATE CURRENT_TIMESTAMP`. | Monovalorado por fila, Almacenado, Opcional, No clave | Temporal (DATETIME). |

| Posición | Atributo | PK/FK/UNIQUE | NULL | Dominio técnico |
|---:|---|---|---|---|
| A1 | `ID` | PK | No | `INT; NOT NULL; DEFAULT sin DEFAULT; AUTO_INCREMENT` |
| A2 | `order_ID` | FK → tb_buyer_orders.ID | No | `INT; NOT NULL; DEFAULT sin DEFAULT` |
| A3 | `amount` | Atributo no clave | No | `DECIMAL(12,2); NOT NULL; DEFAULT sin DEFAULT` |
| A4 | `currency` | Atributo no clave | No | `CHAR(3); NOT NULL; DEFAULT 'MXN'` |
| A5 | `payment_method` | Atributo no clave | No | `ENUM('Card','SPEI','Transfer','Cash'); NOT NULL; DEFAULT sin DEFAULT` |
| A6 | `provider` | UNIQUE | Sí | `VARCHAR(50); NULL permitido; DEFAULT NULL` |
| A7 | `provider_reference` | UNIQUE | Sí | `VARCHAR(150); NULL permitido; DEFAULT NULL` |
| A8 | `payment_status` | Atributo no clave | No | `ENUM('Pending','Authorized','Paid','Failed','Refunded','PartiallyRefunded'); NOT NULL; DEFAULT 'Pending'` |
| A9 | `creation_date` | Atributo no clave | No | `DATETIME; NOT NULL; DEFAULT CURRENT_TIMESTAMP` |
| A10 | `paid_date` | Atributo no clave | Sí | `DATETIME; NULL permitido; DEFAULT NULL` |
| A11 | `last_update` | Atributo no clave | Sí | `DATETIME; NULL permitido; DEFAULT NULL` |


**Índices:** PK PRIMARY(ID); UNIQUE uk_payment_reference(provider, provider_reference); INDEX fk_payments_buyer_orders(order_ID)
**Reglas respaldadas:** NOT NULL, DEFAULT, AUTO_INCREMENT, ON UPDATE, ENUM/SET, PK, FK, UNIQUE y CHECK según lo declarado en SQL. La semántica de negocio de estas reglas queda pendiente cuando no se expresa en la restricción.

## tb_people

**Descripción general:** Entidad indicada por el nombre de la tabla; explicación funcional inferida y pendiente de validación con la aplicación.

**Propósito de negocio:** Entidad; propósito pendiente de validar; el respaldo no contiene especificación funcional explícita.

**Propósito técnico:** Persistir 12 atributos; las claves, índices y restricciones se listan abajo.

**Clasificación:** Entidad; propósito pendiente de validar.

**Esquema:** `tb_people(person_ID, user_ID, courtesy_title, given_names, family_names, birth_date, gender_ID, country_code, phone, status, creation_date, last_update)`

**Notación:** R(A1, A2, …, A12) · **Grado:** 12 · **PK:** person_ID

**Relaciones:** user_ID → tb_users(ID); muchos-a-uno desde esta tabla; restricción fk_persons_user; acciones no especificadas

| Posición | Atributo | Tipo SQL | Descripción | Clasificación | Naturaleza |
|---:|---|---|---|---|---|
| A1 | `person_ID` | `BIGINT` | Identificador de registro o referencia; el destino solo se afirma si existe FK declarada. | Monovalorado por fila, Almacenado, Obligatorio, PK | Cualitativa nominal: identificador, no magnitud. |
| A2 | `user_ID` | `INT` | Identificador de registro o referencia; el destino solo se afirma si existe FK declarada. | Monovalorado por fila, Almacenado, Obligatorio, FK, UNIQUE | Cualitativa nominal: identificador, no magnitud. |
| A3 | `courtesy_title` | `VARCHAR(50)` | Dato identificativo/descriptivo cuyo uso se infiere del nombre de columna. | Monovalorado por fila, Almacenado, Opcional, No clave | Cualitativa nominal; sin orden definido por SQL. |
| A4 | `given_names` | `VARCHAR(150)` | Dato identificativo/descriptivo cuyo uso se infiere del nombre de columna. | Monovalorado por fila, Almacenado, Obligatorio, No clave | Cualitativa nominal; sin orden definido por SQL. |
| A5 | `family_names` | `VARCHAR(150)` | Dato identificativo/descriptivo cuyo uso se infiere del nombre de columna. | Monovalorado por fila, Almacenado, Opcional, No clave | Cualitativa nominal; sin orden definido por SQL. |
| A6 | `birth_date` | `DATE` | Marca temporal asociada al evento nombrado (significado inferido). | Monovalorado por fila, Almacenado, Opcional, No clave | Temporal (DATE). |
| A7 | `gender_ID` | `TINYINT` | Identificador de registro o referencia; el destino solo se afirma si existe FK declarada. | Monovalorado por fila, Almacenado, Opcional, No clave | Cualitativa nominal: identificador, no magnitud. |
| A8 | `country_code` | `CHAR(2)` | Dato country code; significado funcional inferido por el nombre y pendiente de validación. | Monovalorado por fila, Almacenado, Opcional, No clave | Cualitativa nominal; sin orden definido por SQL. |
| A9 | `phone` | `VARCHAR(25)` | Dato phone; significado funcional inferido por el nombre y pendiente de validación. | Monovalorado por fila, Almacenado, Opcional, No clave | Cualitativa nominal; sin orden definido por SQL. |
| A10 | `status` | `BIT(1)` | Estado/indicador del registro; dominio explícito en SQL cuando es ENUM o BIT. | Monovalorado por fila, Almacenado, Obligatorio, No clave | Cualitativa nominal; sin orden definido por SQL. |
| A11 | `creation_date` | `DATETIME` | Marca temporal asociada al evento nombrado (significado inferido). | Monovalorado por fila, Almacenado, Obligatorio, No clave | Temporal (DATETIME). |
| A12 | `last_update` | `DATETIME` | Marca temporal asociada al evento nombrado (significado inferido). `ON UPDATE CURRENT_TIMESTAMP`. | Monovalorado por fila, Almacenado, Obligatorio, No clave | Temporal (DATETIME). |

| Posición | Atributo | PK/FK/UNIQUE | NULL | Dominio técnico |
|---:|---|---|---|---|
| A1 | `person_ID` | PK | No | `BIGINT; NOT NULL; DEFAULT sin DEFAULT; AUTO_INCREMENT` |
| A2 | `user_ID` | FK → tb_users.ID, UNIQUE | No | `INT; NOT NULL; DEFAULT sin DEFAULT` |
| A3 | `courtesy_title` | Atributo no clave | Sí | `VARCHAR(50); NULL permitido; DEFAULT NULL` |
| A4 | `given_names` | Atributo no clave | No | `VARCHAR(150); NOT NULL; DEFAULT sin DEFAULT` |
| A5 | `family_names` | Atributo no clave | Sí | `VARCHAR(150); NULL permitido; DEFAULT NULL` |
| A6 | `birth_date` | Atributo no clave | Sí | `DATE; NULL permitido; DEFAULT NULL` |
| A7 | `gender_ID` | Atributo no clave | Sí | `TINYINT; NULL permitido; DEFAULT NULL` |
| A8 | `country_code` | Atributo no clave | Sí | `CHAR(2); NULL permitido; DEFAULT NULL` |
| A9 | `phone` | Atributo no clave | Sí | `VARCHAR(25); NULL permitido; DEFAULT NULL` |
| A10 | `status` | Atributo no clave | No | `BIT(1); NOT NULL; DEFAULT b'1'` |
| A11 | `creation_date` | Atributo no clave | No | `DATETIME; NOT NULL; DEFAULT CURRENT_TIMESTAMP` |
| A12 | `last_update` | Atributo no clave | No | `DATETIME; NOT NULL; DEFAULT CURRENT_TIMESTAMP` |


**Índices:** PK PRIMARY(person_ID); UNIQUE uk_persons_user(user_ID)
**Reglas respaldadas:** NOT NULL, DEFAULT, AUTO_INCREMENT, ON UPDATE, ENUM/SET, PK, FK, UNIQUE y CHECK según lo declarado en SQL. La semántica de negocio de estas reglas queda pendiente cuando no se expresa en la restricción.

## tb_products

**Descripción general:** Entidad indicada por el nombre de la tabla; explicación funcional inferida y pendiente de validación con la aplicación.

**Propósito de negocio:** Maestra o asociativa (inferido por nombre); el respaldo no contiene especificación funcional explícita.

**Propósito técnico:** Persistir 9 atributos; las claves, índices y restricciones se listan abajo.

**Clasificación:** Maestra o asociativa (inferido por nombre).

**Esquema:** `tb_products(ID, SKU, name, description, current_price, current_stock, status, creation_date, last_update)`

**Notación:** R(A1, A2, …, A9) · **Grado:** 9 · **PK:** ID

**Relaciones:** Sin FK declaradas.

| Posición | Atributo | Tipo SQL | Descripción | Clasificación | Naturaleza |
|---:|---|---|---|---|---|
| A1 | `ID` | `INT` | Identificador de registro o referencia; el destino solo se afirma si existe FK declarada. | Monovalorado por fila, Almacenado, Obligatorio, PK | Cualitativa nominal: identificador, no magnitud. |
| A2 | `SKU` | `VARCHAR(50)` | Dato sku; significado funcional inferido por el nombre y pendiente de validación. | Monovalorado por fila, Almacenado, Obligatorio, UNIQUE | Cualitativa nominal; sin orden definido por SQL. |
| A3 | `name` | `VARCHAR(250)` | Dato identificativo/descriptivo cuyo uso se infiere del nombre de columna. | Monovalorado por fila, Almacenado, Obligatorio, No clave | Cualitativa nominal; sin orden definido por SQL. |
| A4 | `description` | `TEXT` | Texto descriptivo asociado al registro (inferencia por nombre). | Monovalorado por fila, Almacenado, Opcional, No clave | Cualitativa nominal; sin orden definido por SQL. |
| A5 | `current_price` | `DECIMAL(10,2)` | Importe/magnitud monetaria inferida por el nombre; moneda no especificada aquí. | Monovalorado por fila, Almacenado, Obligatorio, No clave | Cuantitativa continua por representación numérica; semántica inferida. |
| A6 | `current_stock` | `INT` | Dato current stock; significado funcional inferido por el nombre y pendiente de validación. | Monovalorado por fila, Almacenado, Obligatorio, No clave | Cuantitativa discreta si es conteo; si es código/indicador, nominal (validar). |
| A7 | `status` | `BIT(1)` | Estado/indicador del registro; dominio explícito en SQL cuando es ENUM o BIT. | Monovalorado por fila, Almacenado, Opcional, No clave | Cualitativa nominal; sin orden definido por SQL. |
| A8 | `creation_date` | `DATETIME` | Marca temporal asociada al evento nombrado (significado inferido). | Monovalorado por fila, Almacenado, Obligatorio, No clave | Temporal (DATETIME). |
| A9 | `last_update` | `DATETIME` | Marca temporal asociada al evento nombrado (significado inferido). `ON UPDATE CURRENT_TIMESTAMP`. | Monovalorado por fila, Almacenado, Obligatorio, No clave | Temporal (DATETIME). |

| Posición | Atributo | PK/FK/UNIQUE | NULL | Dominio técnico |
|---:|---|---|---|---|
| A1 | `ID` | PK | No | `INT; NOT NULL; DEFAULT sin DEFAULT; AUTO_INCREMENT` |
| A2 | `SKU` | UNIQUE | No | `VARCHAR(50); NOT NULL; DEFAULT sin DEFAULT` |
| A3 | `name` | Atributo no clave | No | `VARCHAR(250); NOT NULL; DEFAULT sin DEFAULT` |
| A4 | `description` | Atributo no clave | Sí | `TEXT; NULL permitido; DEFAULT sin DEFAULT` |
| A5 | `current_price` | Atributo no clave | No | `DECIMAL(10,2); NOT NULL; DEFAULT '0.00'` |
| A6 | `current_stock` | Atributo no clave | No | `INT; NOT NULL; DEFAULT '0'` |
| A7 | `status` | Atributo no clave | Sí | `BIT(1); NULL permitido; DEFAULT b'1'` |
| A8 | `creation_date` | Atributo no clave | No | `DATETIME; NOT NULL; DEFAULT CURRENT_TIMESTAMP` |
| A9 | `last_update` | Atributo no clave | No | `DATETIME; NOT NULL; DEFAULT sin DEFAULT` |


**Índices:** PK PRIMARY(ID); UNIQUE SKU(SKU)
**Reglas respaldadas:** NOT NULL, DEFAULT, AUTO_INCREMENT, ON UPDATE, ENUM/SET, PK, FK, UNIQUE y CHECK según lo declarado en SQL. La semántica de negocio de estas reglas queda pendiente cuando no se expresa en la restricción.

## tb_refunds

**Descripción general:** Entidad indicada por el nombre de la tabla; explicación funcional inferida y pendiente de validación con la aplicación.

**Propósito de negocio:** Entidad; propósito pendiente de validar; el respaldo no contiene especificación funcional explícita.

**Propósito técnico:** Persistir 15 atributos; las claves, índices y restricciones se listan abajo.

**Clasificación:** Entidad; propósito pendiente de validar.

**Esquema:** `tb_refunds(ID, payment_ID, cancellation_ID, return_ID, amount, currency, refund_reason, refund_status, provider_reference, requested_date, processed_date, resolution_notes, status, creation_date, last_update)`

**Notación:** R(A1, A2, …, A15) · **Grado:** 15 · **PK:** ID

**CHECK:** CONSTRAINT `chk_refund_amount` CHECK ((`amount` > 0)); CONSTRAINT `chk_refund_origin` CHECK (((`cancellation_ID` is not null) or (`return_ID` is not null)))
**Relaciones:** cancellation_ID → tb_cancellations(ID); muchos-a-uno desde esta tabla; restricción fk_refunds_cancellation; acciones no especificadas; payment_ID → tb_payments(ID); muchos-a-uno desde esta tabla; restricción fk_refunds_payment; acciones no especificadas; return_ID → tb_returns(ID); muchos-a-uno desde esta tabla; restricción fk_refunds_return; acciones no especificadas

| Posición | Atributo | Tipo SQL | Descripción | Clasificación | Naturaleza |
|---:|---|---|---|---|---|
| A1 | `ID` | `INT` | Identificador de registro o referencia; el destino solo se afirma si existe FK declarada. | Monovalorado por fila, Almacenado, Obligatorio, PK | Cualitativa nominal: identificador, no magnitud. |
| A2 | `payment_ID` | `INT` | Identificador de registro o referencia; el destino solo se afirma si existe FK declarada. | Monovalorado por fila, Almacenado, Obligatorio, FK | Cualitativa nominal: identificador, no magnitud. |
| A3 | `cancellation_ID` | `INT` | Identificador de registro o referencia; el destino solo se afirma si existe FK declarada. | Monovalorado por fila, Almacenado, Opcional, FK | Cualitativa nominal: identificador, no magnitud. |
| A4 | `return_ID` | `INT` | Identificador de registro o referencia; el destino solo se afirma si existe FK declarada. | Monovalorado por fila, Almacenado, Opcional, FK | Cualitativa nominal: identificador, no magnitud. |
| A5 | `amount` | `DECIMAL(12,2)` | Importe/magnitud monetaria inferida por el nombre; moneda no especificada aquí. | Monovalorado por fila, Almacenado, Obligatorio, No clave | Cuantitativa continua por representación numérica; semántica inferida. |
| A6 | `currency` | `CHAR(3)` | Dato currency; significado funcional inferido por el nombre y pendiente de validación. | Monovalorado por fila, Almacenado, Obligatorio, No clave | Cualitativa nominal; sin orden definido por SQL. |
| A7 | `refund_reason` | `VARCHAR(500)` | Texto descriptivo asociado al registro (inferencia por nombre). | Monovalorado por fila, Almacenado, Obligatorio, No clave | Cualitativa nominal; sin orden definido por SQL. |
| A8 | `refund_status` | `ENUM('Requested','Approved','Processing','Completed','Rejected','Failed')` | Estado/indicador del registro; dominio explícito en SQL cuando es ENUM o BIT. | Monovalorado por fila, Almacenado, Obligatorio, No clave | Cualitativa nominal; sin orden definido por SQL. |
| A9 | `provider_reference` | `VARCHAR(150)` | Dato provider reference; significado funcional inferido por el nombre y pendiente de validación. | Monovalorado por fila, Almacenado, Opcional, No clave | Cualitativa nominal; sin orden definido por SQL. |
| A10 | `requested_date` | `DATETIME` | Marca temporal asociada al evento nombrado (significado inferido). | Monovalorado por fila, Almacenado, Obligatorio, No clave | Temporal (DATETIME). |
| A11 | `processed_date` | `DATETIME` | Marca temporal asociada al evento nombrado (significado inferido). | Monovalorado por fila, Almacenado, Opcional, No clave | Temporal (DATETIME). |
| A12 | `resolution_notes` | `TEXT` | Texto descriptivo asociado al registro (inferencia por nombre). | Monovalorado por fila, Almacenado, Opcional, No clave | Cualitativa nominal; sin orden definido por SQL. |
| A13 | `status` | `BIT(1)` | Estado/indicador del registro; dominio explícito en SQL cuando es ENUM o BIT. | Monovalorado por fila, Almacenado, Obligatorio, No clave | Cualitativa nominal; sin orden definido por SQL. |
| A14 | `creation_date` | `DATETIME` | Marca temporal asociada al evento nombrado (significado inferido). | Monovalorado por fila, Almacenado, Obligatorio, No clave | Temporal (DATETIME). |
| A15 | `last_update` | `DATETIME` | Marca temporal asociada al evento nombrado (significado inferido). `ON UPDATE CURRENT_TIMESTAMP`. | Monovalorado por fila, Almacenado, Opcional, No clave | Temporal (DATETIME). |

| Posición | Atributo | PK/FK/UNIQUE | NULL | Dominio técnico |
|---:|---|---|---|---|
| A1 | `ID` | PK | No | `INT; NOT NULL; DEFAULT sin DEFAULT; AUTO_INCREMENT` |
| A2 | `payment_ID` | FK → tb_payments.ID | No | `INT; NOT NULL; DEFAULT sin DEFAULT` |
| A3 | `cancellation_ID` | FK → tb_cancellations.ID | Sí | `INT; NULL permitido; DEFAULT NULL` |
| A4 | `return_ID` | FK → tb_returns.ID | Sí | `INT; NULL permitido; DEFAULT NULL` |
| A5 | `amount` | Atributo no clave | No | `DECIMAL(12,2); NOT NULL; DEFAULT sin DEFAULT` |
| A6 | `currency` | Atributo no clave | No | `CHAR(3); NOT NULL; DEFAULT 'MXN'` |
| A7 | `refund_reason` | Atributo no clave | No | `VARCHAR(500); NOT NULL; DEFAULT sin DEFAULT` |
| A8 | `refund_status` | Atributo no clave | No | `ENUM('Requested','Approved','Processing','Completed','Rejected','Failed'); NOT NULL; DEFAULT 'Requested'` |
| A9 | `provider_reference` | Atributo no clave | Sí | `VARCHAR(150); NULL permitido; DEFAULT NULL` |
| A10 | `requested_date` | Atributo no clave | No | `DATETIME; NOT NULL; DEFAULT CURRENT_TIMESTAMP` |
| A11 | `processed_date` | Atributo no clave | Sí | `DATETIME; NULL permitido; DEFAULT NULL` |
| A12 | `resolution_notes` | Atributo no clave | Sí | `TEXT; NULL permitido; DEFAULT sin DEFAULT` |
| A13 | `status` | Atributo no clave | No | `BIT(1); NOT NULL; DEFAULT b'1'` |
| A14 | `creation_date` | Atributo no clave | No | `DATETIME; NOT NULL; DEFAULT CURRENT_TIMESTAMP` |
| A15 | `last_update` | Atributo no clave | Sí | `DATETIME; NULL permitido; DEFAULT NULL` |


**Índices:** PK PRIMARY(ID); INDEX idx_refund_payment(payment_ID); INDEX idx_refund_cancellation(cancellation_ID); INDEX idx_refund_return(return_ID)
**Reglas respaldadas:** NOT NULL, DEFAULT, AUTO_INCREMENT, ON UPDATE, ENUM/SET, PK, FK, UNIQUE y CHECK según lo declarado en SQL. La semántica de negocio de estas reglas queda pendiente cuando no se expresa en la restricción.

## tb_returns

**Descripción general:** Entidad indicada por el nombre de la tabla; explicación funcional inferida y pendiente de validación con la aplicación.

**Propósito de negocio:** Entidad; propósito pendiente de validar; el respaldo no contiene especificación funcional explícita.

**Propósito técnico:** Persistir 14 atributos; las claves, índices y restricciones se listan abajo.

**Clasificación:** Entidad; propósito pendiente de validar.

**Esquema:** `tb_returns(ID, buyer_order_ID, order_item_ID, user_ID, quantity, return_reason, return_status, requested_date, received_date, resolved_date, resolution_notes, status, creation_date, last_update)`

**Notación:** R(A1, A2, …, A14) · **Grado:** 14 · **PK:** ID

**CHECK:** CONSTRAINT `chk_return_quantity` CHECK ((`quantity` > 0))
**Relaciones:** order_item_ID → tbd_order_items(ID); muchos-a-uno desde esta tabla; restricción fk_returns_item; acciones no especificadas; buyer_order_ID → tb_buyer_orders(ID); muchos-a-uno desde esta tabla; restricción fk_returns_order; acciones no especificadas; user_ID → tb_users(ID); muchos-a-uno desde esta tabla; restricción fk_returns_user; acciones no especificadas

| Posición | Atributo | Tipo SQL | Descripción | Clasificación | Naturaleza |
|---:|---|---|---|---|---|
| A1 | `ID` | `INT` | Identificador de registro o referencia; el destino solo se afirma si existe FK declarada. | Monovalorado por fila, Almacenado, Obligatorio, PK | Cualitativa nominal: identificador, no magnitud. |
| A2 | `buyer_order_ID` | `INT` | Identificador de registro o referencia; el destino solo se afirma si existe FK declarada. | Monovalorado por fila, Almacenado, Obligatorio, FK | Cualitativa nominal: identificador, no magnitud. |
| A3 | `order_item_ID` | `INT` | Identificador de registro o referencia; el destino solo se afirma si existe FK declarada. | Monovalorado por fila, Almacenado, Obligatorio, FK | Cualitativa nominal: identificador, no magnitud. |
| A4 | `user_ID` | `INT` | Identificador de registro o referencia; el destino solo se afirma si existe FK declarada. | Monovalorado por fila, Almacenado, Obligatorio, FK | Cualitativa nominal: identificador, no magnitud. |
| A5 | `quantity` | `INT` | Dato quantity; significado funcional inferido por el nombre y pendiente de validación. | Monovalorado por fila, Almacenado, Obligatorio, No clave | Cuantitativa discreta si es conteo; si es código/indicador, nominal (validar). |
| A6 | `return_reason` | `VARCHAR(500)` | Texto descriptivo asociado al registro (inferencia por nombre). | Monovalorado por fila, Almacenado, Obligatorio, No clave | Cualitativa nominal; sin orden definido por SQL. |
| A7 | `return_status` | `ENUM('Requested','Authorized','Rejected','InTransit','Received','Inspected','Completed')` | Estado/indicador del registro; dominio explícito en SQL cuando es ENUM o BIT. | Monovalorado por fila, Almacenado, Obligatorio, No clave | Cualitativa nominal; sin orden definido por SQL. |
| A8 | `requested_date` | `DATETIME` | Marca temporal asociada al evento nombrado (significado inferido). | Monovalorado por fila, Almacenado, Obligatorio, No clave | Temporal (DATETIME). |
| A9 | `received_date` | `DATETIME` | Marca temporal asociada al evento nombrado (significado inferido). | Monovalorado por fila, Almacenado, Opcional, No clave | Temporal (DATETIME). |
| A10 | `resolved_date` | `DATETIME` | Marca temporal asociada al evento nombrado (significado inferido). | Monovalorado por fila, Almacenado, Opcional, No clave | Temporal (DATETIME). |
| A11 | `resolution_notes` | `TEXT` | Texto descriptivo asociado al registro (inferencia por nombre). | Monovalorado por fila, Almacenado, Opcional, No clave | Cualitativa nominal; sin orden definido por SQL. |
| A12 | `status` | `BIT(1)` | Estado/indicador del registro; dominio explícito en SQL cuando es ENUM o BIT. | Monovalorado por fila, Almacenado, Obligatorio, No clave | Cualitativa nominal; sin orden definido por SQL. |
| A13 | `creation_date` | `DATETIME` | Marca temporal asociada al evento nombrado (significado inferido). | Monovalorado por fila, Almacenado, Obligatorio, No clave | Temporal (DATETIME). |
| A14 | `last_update` | `DATETIME` | Marca temporal asociada al evento nombrado (significado inferido). `ON UPDATE CURRENT_TIMESTAMP`. | Monovalorado por fila, Almacenado, Opcional, No clave | Temporal (DATETIME). |

| Posición | Atributo | PK/FK/UNIQUE | NULL | Dominio técnico |
|---:|---|---|---|---|
| A1 | `ID` | PK | No | `INT; NOT NULL; DEFAULT sin DEFAULT; AUTO_INCREMENT` |
| A2 | `buyer_order_ID` | FK → tb_buyer_orders.ID | No | `INT; NOT NULL; DEFAULT sin DEFAULT` |
| A3 | `order_item_ID` | FK → tbd_order_items.ID | No | `INT; NOT NULL; DEFAULT sin DEFAULT` |
| A4 | `user_ID` | FK → tb_users.ID | No | `INT; NOT NULL; DEFAULT sin DEFAULT` |
| A5 | `quantity` | Atributo no clave | No | `INT; NOT NULL; DEFAULT '1'` |
| A6 | `return_reason` | Atributo no clave | No | `VARCHAR(500); NOT NULL; DEFAULT sin DEFAULT` |
| A7 | `return_status` | Atributo no clave | No | `ENUM('Requested','Authorized','Rejected','InTransit','Received','Inspected','Completed'); NOT NULL; DEFAULT 'Requested'` |
| A8 | `requested_date` | Atributo no clave | No | `DATETIME; NOT NULL; DEFAULT CURRENT_TIMESTAMP` |
| A9 | `received_date` | Atributo no clave | Sí | `DATETIME; NULL permitido; DEFAULT NULL` |
| A10 | `resolved_date` | Atributo no clave | Sí | `DATETIME; NULL permitido; DEFAULT NULL` |
| A11 | `resolution_notes` | Atributo no clave | Sí | `TEXT; NULL permitido; DEFAULT sin DEFAULT` |
| A12 | `status` | Atributo no clave | No | `BIT(1); NOT NULL; DEFAULT b'1'` |
| A13 | `creation_date` | Atributo no clave | No | `DATETIME; NOT NULL; DEFAULT CURRENT_TIMESTAMP` |
| A14 | `last_update` | Atributo no clave | Sí | `DATETIME; NULL permitido; DEFAULT NULL` |


**Índices:** PK PRIMARY(ID); INDEX idx_return_order(buyer_order_ID); INDEX idx_return_item(order_item_ID); INDEX idx_return_user(user_ID)
**Reglas respaldadas:** NOT NULL, DEFAULT, AUTO_INCREMENT, ON UPDATE, ENUM/SET, PK, FK, UNIQUE y CHECK según lo declarado en SQL. La semántica de negocio de estas reglas queda pendiente cuando no se expresa en la restricción.

## tb_shipments

**Descripción general:** Entidad indicada por el nombre de la tabla; explicación funcional inferida y pendiente de validación con la aplicación.

**Propósito de negocio:** Entidad; propósito pendiente de validar; el respaldo no contiene especificación funcional explícita.

**Propósito técnico:** Persistir 13 atributos; las claves, índices y restricciones se listan abajo.

**Clasificación:** Entidad; propósito pendiente de validar.

**Esquema:** `tb_shipments(ID, buyer_order_ID, address_ID, carrier, tracking_number, shipping_cost, shipment_status, shipped_date, estimated_delivery_date, delivered_date, status, creation_date, last_update)`

**Notación:** R(A1, A2, …, A13) · **Grado:** 13 · **PK:** ID

**CHECK:** CONSTRAINT `chk_shipment_cost` CHECK ((`shipping_cost` >= 0))
**Relaciones:** address_ID → tb_user_addresses(ID); muchos-a-uno desde esta tabla; restricción fk_shipments_address; acciones no especificadas; buyer_order_ID → tb_buyer_orders(ID); muchos-a-uno desde esta tabla; restricción fk_shipments_order; acciones no especificadas

| Posición | Atributo | Tipo SQL | Descripción | Clasificación | Naturaleza |
|---:|---|---|---|---|---|
| A1 | `ID` | `INT` | Identificador de registro o referencia; el destino solo se afirma si existe FK declarada. | Monovalorado por fila, Almacenado, Obligatorio, PK | Cualitativa nominal: identificador, no magnitud. |
| A2 | `buyer_order_ID` | `INT` | Identificador de registro o referencia; el destino solo se afirma si existe FK declarada. | Monovalorado por fila, Almacenado, Obligatorio, FK | Cualitativa nominal: identificador, no magnitud. |
| A3 | `address_ID` | `BIGINT` | Identificador de registro o referencia; el destino solo se afirma si existe FK declarada. | Monovalorado por fila, Almacenado, Obligatorio, FK | Cualitativa nominal: identificador, no magnitud. |
| A4 | `carrier` | `VARCHAR(100)` | Dato carrier; significado funcional inferido por el nombre y pendiente de validación. | Monovalorado por fila, Almacenado, Opcional, UNIQUE | Cualitativa nominal; sin orden definido por SQL. |
| A5 | `tracking_number` | `VARCHAR(150)` | Dato tracking number; significado funcional inferido por el nombre y pendiente de validación. | Monovalorado por fila, Almacenado, Opcional, UNIQUE | Cualitativa nominal; sin orden definido por SQL. |
| A6 | `shipping_cost` | `DECIMAL(12,2)` | Importe/magnitud monetaria inferida por el nombre; moneda no especificada aquí. | Monovalorado por fila, Almacenado, Obligatorio, No clave | Cuantitativa continua por representación numérica; semántica inferida. |
| A7 | `shipment_status` | `ENUM('Pending','Preparing','Shipped','InTransit','Delivered','Failed','Returned')` | Estado/indicador del registro; dominio explícito en SQL cuando es ENUM o BIT. | Monovalorado por fila, Almacenado, Obligatorio, No clave | Cualitativa nominal; sin orden definido por SQL. |
| A8 | `shipped_date` | `DATETIME` | Marca temporal asociada al evento nombrado (significado inferido). | Monovalorado por fila, Almacenado, Opcional, No clave | Temporal (DATETIME). |
| A9 | `estimated_delivery_date` | `DATETIME` | Marca temporal asociada al evento nombrado (significado inferido). | Monovalorado por fila, Almacenado, Opcional, No clave | Temporal (DATETIME). |
| A10 | `delivered_date` | `DATETIME` | Marca temporal asociada al evento nombrado (significado inferido). | Monovalorado por fila, Almacenado, Opcional, No clave | Temporal (DATETIME). |
| A11 | `status` | `BIT(1)` | Estado/indicador del registro; dominio explícito en SQL cuando es ENUM o BIT. | Monovalorado por fila, Almacenado, Obligatorio, No clave | Cualitativa nominal; sin orden definido por SQL. |
| A12 | `creation_date` | `DATETIME` | Marca temporal asociada al evento nombrado (significado inferido). | Monovalorado por fila, Almacenado, Obligatorio, No clave | Temporal (DATETIME). |
| A13 | `last_update` | `DATETIME` | Marca temporal asociada al evento nombrado (significado inferido). `ON UPDATE CURRENT_TIMESTAMP`. | Monovalorado por fila, Almacenado, Opcional, No clave | Temporal (DATETIME). |

| Posición | Atributo | PK/FK/UNIQUE | NULL | Dominio técnico |
|---:|---|---|---|---|
| A1 | `ID` | PK | No | `INT; NOT NULL; DEFAULT sin DEFAULT; AUTO_INCREMENT` |
| A2 | `buyer_order_ID` | FK → tb_buyer_orders.ID | No | `INT; NOT NULL; DEFAULT sin DEFAULT` |
| A3 | `address_ID` | FK → tb_user_addresses.ID | No | `BIGINT; NOT NULL; DEFAULT sin DEFAULT` |
| A4 | `carrier` | UNIQUE | Sí | `VARCHAR(100); NULL permitido; DEFAULT NULL` |
| A5 | `tracking_number` | UNIQUE | Sí | `VARCHAR(150); NULL permitido; DEFAULT NULL` |
| A6 | `shipping_cost` | Atributo no clave | No | `DECIMAL(12,2); NOT NULL; DEFAULT '0.00'` |
| A7 | `shipment_status` | Atributo no clave | No | `ENUM('Pending','Preparing','Shipped','InTransit','Delivered','Failed','Returned'); NOT NULL; DEFAULT 'Pending'` |
| A8 | `shipped_date` | Atributo no clave | Sí | `DATETIME; NULL permitido; DEFAULT NULL` |
| A9 | `estimated_delivery_date` | Atributo no clave | Sí | `DATETIME; NULL permitido; DEFAULT NULL` |
| A10 | `delivered_date` | Atributo no clave | Sí | `DATETIME; NULL permitido; DEFAULT NULL` |
| A11 | `status` | Atributo no clave | No | `BIT(1); NOT NULL; DEFAULT b'1'` |
| A12 | `creation_date` | Atributo no clave | No | `DATETIME; NOT NULL; DEFAULT CURRENT_TIMESTAMP` |
| A13 | `last_update` | Atributo no clave | Sí | `DATETIME; NULL permitido; DEFAULT NULL` |


**Índices:** PK PRIMARY(ID); UNIQUE uk_shipment_tracking(carrier, tracking_number); INDEX idx_shipment_order(buyer_order_ID); INDEX idx_shipment_address(address_ID)
**Reglas respaldadas:** NOT NULL, DEFAULT, AUTO_INCREMENT, ON UPDATE, ENUM/SET, PK, FK, UNIQUE y CHECK según lo declarado en SQL. La semántica de negocio de estas reglas queda pendiente cuando no se expresa en la restricción.

## tb_user_addresses

**Descripción general:** Entidad indicada por el nombre de la tabla; explicación funcional inferida y pendiente de validación con la aplicación.

**Propósito de negocio:** Maestra o asociativa (inferido por nombre); el respaldo no contiene especificación funcional explícita.

**Propósito técnico:** Persistir 12 atributos; las claves, índices y restricciones se listan abajo.

**Clasificación:** Maestra o asociativa (inferido por nombre).

**Esquema:** `tb_user_addresses(ID, user_ID, address_label, recipient_name, recipient_phone, delivery_instructions, latitude, longitude, is_default, status, creation_date, last_update)`

**Notación:** R(A1, A2, …, A12) · **Grado:** 12 · **PK:** ID

**CHECK:** CONSTRAINT `chk_coordinates` CHECK ((((`latitude` is null) and (`longitude` is null)) or ((`latitude` is not null) and (`longitude` is not null)))); CONSTRAINT `chk_latitude` CHECK ((`latitude` between -(90) and 90)); CONSTRAINT `chk_longitude` CHECK ((`longitude` between -(180) and 180))
**Relaciones:** user_ID → tb_users(ID); muchos-a-uno desde esta tabla; restricción fk_addresses_user; acciones no especificadas

| Posición | Atributo | Tipo SQL | Descripción | Clasificación | Naturaleza |
|---:|---|---|---|---|---|
| A1 | `ID` | `BIGINT` | Identificador de registro o referencia; el destino solo se afirma si existe FK declarada. | Monovalorado por fila, Almacenado, Obligatorio, PK | Cualitativa nominal: identificador, no magnitud. |
| A2 | `user_ID` | `INT` | Identificador de registro o referencia; el destino solo se afirma si existe FK declarada. | Monovalorado por fila, Almacenado, Obligatorio, FK | Cualitativa nominal: identificador, no magnitud. |
| A3 | `address_label` | `VARCHAR(100)` | Dato address label; significado funcional inferido por el nombre y pendiente de validación. | Monovalorado por fila, Almacenado, Obligatorio, No clave | Cualitativa nominal; sin orden definido por SQL. |
| A4 | `recipient_name` | `VARCHAR(150)` | Dato identificativo/descriptivo cuyo uso se infiere del nombre de columna. | Monovalorado por fila, Almacenado, Opcional, No clave | Cualitativa nominal; sin orden definido por SQL. |
| A5 | `recipient_phone` | `VARCHAR(25)` | Dato recipient phone; significado funcional inferido por el nombre y pendiente de validación. | Monovalorado por fila, Almacenado, Opcional, No clave | Cualitativa nominal; sin orden definido por SQL. |
| A6 | `delivery_instructions` | `VARCHAR(500)` | Dato delivery instructions; significado funcional inferido por el nombre y pendiente de validación. | Monovalorado por fila, Almacenado, Opcional, No clave | Cualitativa nominal; sin orden definido por SQL. |
| A7 | `latitude` | `DECIMAL(10,7)` | Dato latitude; significado funcional inferido por el nombre y pendiente de validación. | Monovalorado por fila, Almacenado, Opcional, No clave | Cuantitativa continua por representación numérica; semántica inferida. |
| A8 | `longitude` | `DECIMAL(10,7)` | Dato longitude; significado funcional inferido por el nombre y pendiente de validación. | Monovalorado por fila, Almacenado, Opcional, No clave | Cuantitativa continua por representación numérica; semántica inferida. |
| A9 | `is_default` | `TINYINT(1)` | Dato is default; significado funcional inferido por el nombre y pendiente de validación. | Monovalorado por fila, Almacenado, Obligatorio, No clave | Cuantitativa discreta si es conteo; si es código/indicador, nominal (validar). |
| A10 | `status` | `BIT(1)` | Estado/indicador del registro; dominio explícito en SQL cuando es ENUM o BIT. | Monovalorado por fila, Almacenado, Obligatorio, No clave | Cualitativa nominal; sin orden definido por SQL. |
| A11 | `creation_date` | `DATETIME` | Marca temporal asociada al evento nombrado (significado inferido). | Monovalorado por fila, Almacenado, Obligatorio, No clave | Temporal (DATETIME). |
| A12 | `last_update` | `DATETIME` | Marca temporal asociada al evento nombrado (significado inferido). `ON UPDATE CURRENT_TIMESTAMP`. | Monovalorado por fila, Almacenado, Opcional, No clave | Temporal (DATETIME). |

| Posición | Atributo | PK/FK/UNIQUE | NULL | Dominio técnico |
|---:|---|---|---|---|
| A1 | `ID` | PK | No | `BIGINT; NOT NULL; DEFAULT sin DEFAULT; AUTO_INCREMENT` |
| A2 | `user_ID` | FK → tb_users.ID | No | `INT; NOT NULL; DEFAULT sin DEFAULT` |
| A3 | `address_label` | Atributo no clave | No | `VARCHAR(100); NOT NULL; DEFAULT sin DEFAULT` |
| A4 | `recipient_name` | Atributo no clave | Sí | `VARCHAR(150); NULL permitido; DEFAULT NULL` |
| A5 | `recipient_phone` | Atributo no clave | Sí | `VARCHAR(25); NULL permitido; DEFAULT NULL` |
| A6 | `delivery_instructions` | Atributo no clave | Sí | `VARCHAR(500); NULL permitido; DEFAULT NULL` |
| A7 | `latitude` | Atributo no clave | Sí | `DECIMAL(10,7); NULL permitido; DEFAULT NULL` |
| A8 | `longitude` | Atributo no clave | Sí | `DECIMAL(10,7); NULL permitido; DEFAULT NULL` |
| A9 | `is_default` | Atributo no clave | No | `TINYINT(1); NOT NULL; DEFAULT '0'` |
| A10 | `status` | Atributo no clave | No | `BIT(1); NOT NULL; DEFAULT b'1'` |
| A11 | `creation_date` | Atributo no clave | No | `DATETIME; NOT NULL; DEFAULT CURRENT_TIMESTAMP` |
| A12 | `last_update` | Atributo no clave | Sí | `DATETIME; NULL permitido; DEFAULT NULL` |


**Índices:** PK PRIMARY(ID); INDEX idx_user_addresses(user_ID)
**Reglas respaldadas:** NOT NULL, DEFAULT, AUTO_INCREMENT, ON UPDATE, ENUM/SET, PK, FK, UNIQUE y CHECK según lo declarado en SQL. La semántica de negocio de estas reglas queda pendiente cuando no se expresa en la restricción.

## tb_users

**Descripción general:** Entidad indicada por el nombre de la tabla; explicación funcional inferida y pendiente de validación con la aplicación.

**Propósito de negocio:** Maestra o asociativa (inferido por nombre); el respaldo no contiene especificación funcional explícita.

**Propósito técnico:** Persistir 8 atributos; las claves, índices y restricciones se listan abajo.

**Clasificación:** Maestra o asociativa (inferido por nombre).

**Esquema:** `tb_users(ID, email, nick, password, creation_date, last_update, last_login, status)`

**Notación:** R(A1, A2, …, A8) · **Grado:** 8 · **PK:** ID

**Relaciones:** Sin FK declaradas.

| Posición | Atributo | Tipo SQL | Descripción | Clasificación | Naturaleza |
|---:|---|---|---|---|---|
| A1 | `ID` | `INT` | Identificador de registro o referencia; el destino solo se afirma si existe FK declarada. | Monovalorado por fila, Almacenado, Obligatorio, PK | Cualitativa nominal: identificador, no magnitud. |
| A2 | `email` | `VARCHAR(80)` | Dato identificativo/descriptivo cuyo uso se infiere del nombre de columna. | Monovalorado por fila, Almacenado, Obligatorio, UNIQUE | Cualitativa nominal; sin orden definido por SQL. |
| A3 | `nick` | `VARCHAR(100)` | Dato nick; significado funcional inferido por el nombre y pendiente de validación. | Monovalorado por fila, Almacenado, Obligatorio, UNIQUE | Cualitativa nominal; sin orden definido por SQL. |
| A4 | `password` | `VARCHAR(255)` | Dato password; significado funcional inferido por el nombre y pendiente de validación. | Monovalorado por fila, Almacenado, Obligatorio, No clave | Cualitativa nominal; sin orden definido por SQL. |
| A5 | `creation_date` | `DATETIME` | Marca temporal asociada al evento nombrado (significado inferido). | Monovalorado por fila, Almacenado, Obligatorio, No clave | Temporal (DATETIME). |
| A6 | `last_update` | `DATETIME` | Marca temporal asociada al evento nombrado (significado inferido). `ON UPDATE CURRENT_TIMESTAMP`. | Monovalorado por fila, Almacenado, Opcional, No clave | Temporal (DATETIME). |
| A7 | `last_login` | `DATETIME` | Dato last login; significado funcional inferido por el nombre y pendiente de validación. | Monovalorado por fila, Almacenado, Opcional, No clave | Temporal (DATETIME). |
| A8 | `status` | `BIT(1)` | Estado/indicador del registro; dominio explícito en SQL cuando es ENUM o BIT. | Monovalorado por fila, Almacenado, Obligatorio, No clave | Cualitativa nominal; sin orden definido por SQL. |

| Posición | Atributo | PK/FK/UNIQUE | NULL | Dominio técnico |
|---:|---|---|---|---|
| A1 | `ID` | PK | No | `INT; NOT NULL; DEFAULT sin DEFAULT; AUTO_INCREMENT` |
| A2 | `email` | UNIQUE | No | `VARCHAR(80); NOT NULL; DEFAULT sin DEFAULT` |
| A3 | `nick` | UNIQUE | No | `VARCHAR(100); NOT NULL; DEFAULT sin DEFAULT` |
| A4 | `password` | Atributo no clave | No | `VARCHAR(255); NOT NULL; DEFAULT sin DEFAULT` |
| A5 | `creation_date` | Atributo no clave | No | `DATETIME; NOT NULL; DEFAULT CURRENT_TIMESTAMP` |
| A6 | `last_update` | Atributo no clave | Sí | `DATETIME; NULL permitido; DEFAULT CURRENT_TIMESTAMP` |
| A7 | `last_login` | Atributo no clave | Sí | `DATETIME; NULL permitido; DEFAULT NULL` |
| A8 | `status` | Atributo no clave | No | `BIT(1); NOT NULL; DEFAULT b'1'` |


**Índices:** PK PRIMARY(ID); UNIQUE email(email); UNIQUE nickname(nick)
**Reglas respaldadas:** NOT NULL, DEFAULT, AUTO_INCREMENT, ON UPDATE, ENUM/SET, PK, FK, UNIQUE y CHECK según lo declarado en SQL. La semántica de negocio de estas reglas queda pendiente cuando no se expresa en la restricción.

## tbc_categories

**Descripción general:** Entidad indicada por el nombre de la tabla; explicación funcional inferida y pendiente de validación con la aplicación.

**Propósito de negocio:** Catálogo (inferido por nombre); el respaldo no contiene especificación funcional explícita.

**Propósito técnico:** Persistir 7 atributos; las claves, índices y restricciones se listan abajo.

**Clasificación:** Catálogo (inferido por nombre).

**Esquema:** `tbc_categories(ID, name, description, sup_id_category, status, creation_date, last_update)`

**Notación:** R(A1, A2, …, A7) · **Grado:** 7 · **PK:** ID

**Relaciones:** sup_id_category → tbc_categories(ID); muchos-a-uno desde esta tabla; restricción fk_superior_category; acciones no especificadas

| Posición | Atributo | Tipo SQL | Descripción | Clasificación | Naturaleza |
|---:|---|---|---|---|---|
| A1 | `ID` | `INT` | Identificador de registro o referencia; el destino solo se afirma si existe FK declarada. | Monovalorado por fila, Almacenado, Obligatorio, PK | Cualitativa nominal: identificador, no magnitud. |
| A2 | `name` | `VARCHAR(120)` | Dato identificativo/descriptivo cuyo uso se infiere del nombre de columna. | Monovalorado por fila, Almacenado, Obligatorio, UNIQUE | Cualitativa nominal; sin orden definido por SQL. |
| A3 | `description` | `TEXT` | Texto descriptivo asociado al registro (inferencia por nombre). | Monovalorado por fila, Almacenado, Opcional, No clave | Cualitativa nominal; sin orden definido por SQL. |
| A4 | `sup_id_category` | `INT` | Dato sup id category; significado funcional inferido por el nombre y pendiente de validación. | Monovalorado por fila, Almacenado, Opcional, FK | Cuantitativa discreta si es conteo; si es código/indicador, nominal (validar). |
| A5 | `status` | `BIT(1)` | Estado/indicador del registro; dominio explícito en SQL cuando es ENUM o BIT. | Monovalorado por fila, Almacenado, Obligatorio, No clave | Cualitativa nominal; sin orden definido por SQL. |
| A6 | `creation_date` | `DATETIME` | Marca temporal asociada al evento nombrado (significado inferido). | Monovalorado por fila, Almacenado, Obligatorio, No clave | Temporal (DATETIME). |
| A7 | `last_update` | `DATETIME` | Marca temporal asociada al evento nombrado (significado inferido). `ON UPDATE CURRENT_TIMESTAMP`. | Monovalorado por fila, Almacenado, Obligatorio, No clave | Temporal (DATETIME). |

| Posición | Atributo | PK/FK/UNIQUE | NULL | Dominio técnico |
|---:|---|---|---|---|
| A1 | `ID` | PK | No | `INT; NOT NULL; DEFAULT sin DEFAULT; AUTO_INCREMENT` |
| A2 | `name` | UNIQUE | No | `VARCHAR(120); NOT NULL; DEFAULT sin DEFAULT` |
| A3 | `description` | Atributo no clave | Sí | `TEXT; NULL permitido; DEFAULT sin DEFAULT` |
| A4 | `sup_id_category` | FK → tbc_categories.ID | Sí | `INT; NULL permitido; DEFAULT NULL` |
| A5 | `status` | Atributo no clave | No | `BIT(1); NOT NULL; DEFAULT b'1'` |
| A6 | `creation_date` | Atributo no clave | No | `DATETIME; NOT NULL; DEFAULT CURRENT_TIMESTAMP` |
| A7 | `last_update` | Atributo no clave | No | `DATETIME; NOT NULL; DEFAULT sin DEFAULT` |


**Índices:** PK PRIMARY(ID); UNIQUE name(name); INDEX fk_superior_category(sup_id_category)
**Reglas respaldadas:** NOT NULL, DEFAULT, AUTO_INCREMENT, ON UPDATE, ENUM/SET, PK, FK, UNIQUE y CHECK según lo declarado en SQL. La semántica de negocio de estas reglas queda pendiente cuando no se expresa en la restricción.

## tbc_payment_methods_types

**Descripción general:** Entidad indicada por el nombre de la tabla; explicación funcional inferida y pendiente de validación con la aplicación.

**Propósito de negocio:** Transaccional (inferido por nombre); el respaldo no contiene especificación funcional explícita.

**Propósito técnico:** Persistir 6 atributos; las claves, índices y restricciones se listan abajo.

**Clasificación:** Transaccional (inferido por nombre).

**Esquema:** `tbc_payment_methods_types(ID, code, description, status, creation_date, last_update)`

**Notación:** R(A1, A2, …, A6) · **Grado:** 6 · **PK:** ID

**Relaciones:** Sin FK declaradas.

| Posición | Atributo | Tipo SQL | Descripción | Clasificación | Naturaleza |
|---:|---|---|---|---|---|
| A1 | `ID` | `INT` | Identificador de registro o referencia; el destino solo se afirma si existe FK declarada. | Monovalorado por fila, Almacenado, Obligatorio, PK | Cualitativa nominal: identificador, no magnitud. |
| A2 | `code` | `VARCHAR(30)` | Dato code; significado funcional inferido por el nombre y pendiente de validación. | Monovalorado por fila, Almacenado, Obligatorio, UNIQUE | Cualitativa nominal; sin orden definido por SQL. |
| A3 | `description` | `TEXT` | Texto descriptivo asociado al registro (inferencia por nombre). | Monovalorado por fila, Almacenado, Obligatorio, No clave | Cualitativa nominal; sin orden definido por SQL. |
| A4 | `status` | `BIT(1)` | Estado/indicador del registro; dominio explícito en SQL cuando es ENUM o BIT. | Monovalorado por fila, Almacenado, Obligatorio, No clave | Cualitativa nominal; sin orden definido por SQL. |
| A5 | `creation_date` | `DATETIME` | Marca temporal asociada al evento nombrado (significado inferido). | Monovalorado por fila, Almacenado, Obligatorio, No clave | Temporal (DATETIME). |
| A6 | `last_update` | `DATETIME` | Marca temporal asociada al evento nombrado (significado inferido). `ON UPDATE CURRENT_TIMESTAMP`. | Monovalorado por fila, Almacenado, Opcional, No clave | Temporal (DATETIME). |

| Posición | Atributo | PK/FK/UNIQUE | NULL | Dominio técnico |
|---:|---|---|---|---|
| A1 | `ID` | PK | No | `INT; NOT NULL; DEFAULT sin DEFAULT; AUTO_INCREMENT` |
| A2 | `code` | UNIQUE | No | `VARCHAR(30); NOT NULL; DEFAULT sin DEFAULT` |
| A3 | `description` | Atributo no clave | No | `TEXT; NOT NULL; DEFAULT sin DEFAULT` |
| A4 | `status` | Atributo no clave | No | `BIT(1); NOT NULL; DEFAULT b'1'` |
| A5 | `creation_date` | Atributo no clave | No | `DATETIME; NOT NULL; DEFAULT CURRENT_TIMESTAMP` |
| A6 | `last_update` | Atributo no clave | Sí | `DATETIME; NULL permitido; DEFAULT NULL` |


**Índices:** PK PRIMARY(ID); UNIQUE code_UNIQUE(code)
**Reglas respaldadas:** NOT NULL, DEFAULT, AUTO_INCREMENT, ON UPDATE, ENUM/SET, PK, FK, UNIQUE y CHECK según lo declarado en SQL. La semántica de negocio de estas reglas queda pendiente cuando no se expresa en la restricción.

## tbd_address_components

**Descripción general:** Entidad indicada por el nombre de la tabla; explicación funcional inferida y pendiente de validación con la aplicación.

**Propósito de negocio:** Detalle/intermedia o auxiliar (inferido por nombre); el respaldo no contiene especificación funcional explícita.

**Propósito técnico:** Persistir 8 atributos; las claves, índices y restricciones se listan abajo.

**Clasificación:** Detalle/intermedia o auxiliar (inferido por nombre).

**Esquema:** `tbd_address_components(ID, address_ID, value, component_type, status, address_sup_ID, creation_date, last_update)`

**Notación:** R(A1, A2, …, A8) · **Grado:** 8 · **PK:** ID

**Relaciones:** address_ID → tb_user_addresses(ID); muchos-a-uno desde esta tabla; restricción fk_component_address; acciones ON DELETE RESTRICT; address_ID, address_sup_ID → tbd_address_components(address_ID, ID); muchos-a-uno desde esta tabla; restricción fk_component_parent; acciones ON DELETE RESTRICT

| Posición | Atributo | Tipo SQL | Descripción | Clasificación | Naturaleza |
|---:|---|---|---|---|---|
| A1 | `ID` | `BIGINT` | Identificador de registro o referencia; el destino solo se afirma si existe FK declarada. | Monovalorado por fila, Almacenado, Obligatorio, PK, UNIQUE | Cualitativa nominal: identificador, no magnitud. |
| A2 | `address_ID` | `BIGINT` | Identificador de registro o referencia; el destino solo se afirma si existe FK declarada. | Monovalorado por fila, Almacenado, Obligatorio, FK, UNIQUE | Cualitativa nominal: identificador, no magnitud. |
| A3 | `value` | `VARCHAR(255)` | Dato value; significado funcional inferido por el nombre y pendiente de validación. | Monovalorado por fila, Almacenado, Obligatorio, No clave | Cualitativa nominal; sin orden definido por SQL. |
| A4 | `component_type` | `VARCHAR(50)` | Dato component type; significado funcional inferido por el nombre y pendiente de validación. | Monovalorado por fila, Almacenado, Obligatorio, No clave | Cualitativa nominal; sin orden definido por SQL. |
| A5 | `status` | `BIT(1)` | Estado/indicador del registro; dominio explícito en SQL cuando es ENUM o BIT. | Monovalorado por fila, Almacenado, Obligatorio, No clave | Cualitativa nominal; sin orden definido por SQL. |
| A6 | `address_sup_ID` | `BIGINT` | Identificador de registro o referencia; el destino solo se afirma si existe FK declarada. | Monovalorado por fila, Almacenado, Opcional, FK | Cualitativa nominal: identificador, no magnitud. |
| A7 | `creation_date` | `DATETIME` | Marca temporal asociada al evento nombrado (significado inferido). | Monovalorado por fila, Almacenado, Obligatorio, No clave | Temporal (DATETIME). |
| A8 | `last_update` | `DATETIME` | Marca temporal asociada al evento nombrado (significado inferido). `ON UPDATE CURRENT_TIMESTAMP`. | Monovalorado por fila, Almacenado, Opcional, No clave | Temporal (DATETIME). |

| Posición | Atributo | PK/FK/UNIQUE | NULL | Dominio técnico |
|---:|---|---|---|---|
| A1 | `ID` | PK, UNIQUE | No | `BIGINT; NOT NULL; DEFAULT sin DEFAULT; AUTO_INCREMENT` |
| A2 | `address_ID` | FK → tb_user_addresses.ID, FK → tbd_address_components.address_ID, UNIQUE | No | `BIGINT; NOT NULL; DEFAULT sin DEFAULT` |
| A3 | `value` | Atributo no clave | No | `VARCHAR(255); NOT NULL; DEFAULT sin DEFAULT` |
| A4 | `component_type` | Atributo no clave | No | `VARCHAR(50); NOT NULL; DEFAULT sin DEFAULT` |
| A5 | `status` | Atributo no clave | No | `BIT(1); NOT NULL; DEFAULT b'1'` |
| A6 | `address_sup_ID` | FK → tbd_address_components.ID | Sí | `BIGINT; NULL permitido; DEFAULT NULL` |
| A7 | `creation_date` | Atributo no clave | No | `DATETIME; NOT NULL; DEFAULT CURRENT_TIMESTAMP` |
| A8 | `last_update` | Atributo no clave | Sí | `DATETIME; NULL permitido; DEFAULT NULL` |


**Índices:** PK PRIMARY(ID); UNIQUE uk_address_component(address_ID, ID); INDEX idx_address_parent(address_ID, address_sup_ID)
**Reglas respaldadas:** NOT NULL, DEFAULT, AUTO_INCREMENT, ON UPDATE, ENUM/SET, PK, FK, UNIQUE y CHECK según lo declarado en SQL. La semántica de negocio de estas reglas queda pendiente cuando no se expresa en la restricción.

## tbd_cancellation_items

**Descripción general:** Entidad indicada por el nombre de la tabla; explicación funcional inferida y pendiente de validación con la aplicación.

**Propósito de negocio:** Transaccional (inferido por nombre); el respaldo no contiene especificación funcional explícita.

**Propósito técnico:** Persistir 9 atributos; las claves, índices y restricciones se listan abajo.

**Clasificación:** Transaccional (inferido por nombre).

**Esquema:** `tbd_cancellation_items(ID, cancellation_ID, order_item_ID, quantity, unit_amount, item_reason, status, creation_date, last_update)`

**Notación:** R(A1, A2, …, A9) · **Grado:** 9 · **PK:** ID

**CHECK:** CONSTRAINT `chk_cancellation_items_amount` CHECK ((`unit_amount` >= 0)); CONSTRAINT `chk_cancellation_items_quantity` CHECK ((`quantity` > 0))
**Relaciones:** cancellation_ID → tb_cancellations(ID); muchos-a-uno desde esta tabla; restricción fk_cancellation_items_cancellation; acciones no especificadas; order_item_ID → tbd_order_items(ID); muchos-a-uno desde esta tabla; restricción fk_cancellation_items_order_item; acciones no especificadas

| Posición | Atributo | Tipo SQL | Descripción | Clasificación | Naturaleza |
|---:|---|---|---|---|---|
| A1 | `ID` | `INT` | Identificador de registro o referencia; el destino solo se afirma si existe FK declarada. | Monovalorado por fila, Almacenado, Obligatorio, PK | Cualitativa nominal: identificador, no magnitud. |
| A2 | `cancellation_ID` | `INT` | Identificador de registro o referencia; el destino solo se afirma si existe FK declarada. | Monovalorado por fila, Almacenado, Obligatorio, FK | Cualitativa nominal: identificador, no magnitud. |
| A3 | `order_item_ID` | `INT` | Identificador de registro o referencia; el destino solo se afirma si existe FK declarada. | Monovalorado por fila, Almacenado, Obligatorio, FK | Cualitativa nominal: identificador, no magnitud. |
| A4 | `quantity` | `INT` | Dato quantity; significado funcional inferido por el nombre y pendiente de validación. | Monovalorado por fila, Almacenado, Obligatorio, No clave | Cuantitativa discreta si es conteo; si es código/indicador, nominal (validar). |
| A5 | `unit_amount` | `DECIMAL(12,2)` | Importe/magnitud monetaria inferida por el nombre; moneda no especificada aquí. | Monovalorado por fila, Almacenado, Obligatorio, No clave | Cuantitativa continua por representación numérica; semántica inferida. |
| A6 | `item_reason` | `VARCHAR(500)` | Texto descriptivo asociado al registro (inferencia por nombre). | Monovalorado por fila, Almacenado, Opcional, No clave | Cualitativa nominal; sin orden definido por SQL. |
| A7 | `status` | `BIT(1)` | Estado/indicador del registro; dominio explícito en SQL cuando es ENUM o BIT. | Monovalorado por fila, Almacenado, Obligatorio, No clave | Cualitativa nominal; sin orden definido por SQL. |
| A8 | `creation_date` | `DATETIME` | Marca temporal asociada al evento nombrado (significado inferido). | Monovalorado por fila, Almacenado, Obligatorio, No clave | Temporal (DATETIME). |
| A9 | `last_update` | `DATETIME` | Marca temporal asociada al evento nombrado (significado inferido). `ON UPDATE CURRENT_TIMESTAMP`. | Monovalorado por fila, Almacenado, Opcional, No clave | Temporal (DATETIME). |

| Posición | Atributo | PK/FK/UNIQUE | NULL | Dominio técnico |
|---:|---|---|---|---|
| A1 | `ID` | PK | No | `INT; NOT NULL; DEFAULT sin DEFAULT; AUTO_INCREMENT` |
| A2 | `cancellation_ID` | FK → tb_cancellations.ID | No | `INT; NOT NULL; DEFAULT sin DEFAULT` |
| A3 | `order_item_ID` | FK → tbd_order_items.ID | No | `INT; NOT NULL; DEFAULT sin DEFAULT` |
| A4 | `quantity` | Atributo no clave | No | `INT; NOT NULL; DEFAULT '1'` |
| A5 | `unit_amount` | Atributo no clave | No | `DECIMAL(12,2); NOT NULL; DEFAULT '0.00'` |
| A6 | `item_reason` | Atributo no clave | Sí | `VARCHAR(500); NULL permitido; DEFAULT NULL` |
| A7 | `status` | Atributo no clave | No | `BIT(1); NOT NULL; DEFAULT b'1'` |
| A8 | `creation_date` | Atributo no clave | No | `DATETIME; NOT NULL; DEFAULT CURRENT_TIMESTAMP` |
| A9 | `last_update` | Atributo no clave | Sí | `DATETIME; NULL permitido; DEFAULT NULL` |


**Índices:** PK PRIMARY(ID); INDEX idx_cancellation_items_cancellation(cancellation_ID); INDEX idx_cancellation_items_order_item(order_item_ID)
**Reglas respaldadas:** NOT NULL, DEFAULT, AUTO_INCREMENT, ON UPDATE, ENUM/SET, PK, FK, UNIQUE y CHECK según lo declarado en SQL. La semántica de negocio de estas reglas queda pendiente cuando no se expresa en la restricción.

## tbd_carts_items

**Descripción general:** Entidad indicada por el nombre de la tabla; explicación funcional inferida y pendiente de validación con la aplicación.

**Propósito de negocio:** Transaccional (inferido por nombre); el respaldo no contiene especificación funcional explícita.

**Propósito técnico:** Persistir 5 atributos; las claves, índices y restricciones se listan abajo.

**Clasificación:** Transaccional (inferido por nombre).

**Esquema:** `tbd_carts_items(cart_ID, provider_ID, product_ID, quantity, creation_date)`

**Notación:** R(A1, A2, …, A5) · **Grado:** 5 · **PK:** cart_ID, provider_ID, product_ID

**CHECK:** CONSTRAINT `chk_cart_quantity` CHECK ((`quantity` > 0)); CONSTRAINT `chk_cart_quantity_positive` CHECK ((`quantity` > 0))
**Relaciones:** cart_ID → tb_carts(ID); muchos-a-uno desde esta tabla; restricción fk_cart_items_cart; acciones no especificadas; product_ID → tbd_products_users_providers(product_ID); muchos-a-uno desde esta tabla; restricción fk_cart_items_product; acciones no especificadas; provider_ID → tbd_products_users_providers(user_ID); muchos-a-uno desde esta tabla; restricción fk_cart_items_provider; acciones no especificadas; cart_ID → tb_carts(ID); muchos-a-uno desde esta tabla; restricción tbd_carts_items_ibfk_1; acciones no especificadas

| Posición | Atributo | Tipo SQL | Descripción | Clasificación | Naturaleza |
|---:|---|---|---|---|---|
| A1 | `cart_ID` | `INT` | Identificador de registro o referencia; el destino solo se afirma si existe FK declarada. | Monovalorado por fila, Almacenado, Obligatorio, PK, FK | Cualitativa nominal: identificador, no magnitud. |
| A2 | `provider_ID` | `INT` | Identificador de registro o referencia; el destino solo se afirma si existe FK declarada. | Monovalorado por fila, Almacenado, Obligatorio, PK, FK | Cualitativa nominal: identificador, no magnitud. |
| A3 | `product_ID` | `INT` | Identificador de registro o referencia; el destino solo se afirma si existe FK declarada. | Monovalorado por fila, Almacenado, Obligatorio, PK, FK | Cualitativa nominal: identificador, no magnitud. |
| A4 | `quantity` | `INT` | Dato quantity; significado funcional inferido por el nombre y pendiente de validación. | Monovalorado por fila, Almacenado, Obligatorio, No clave | Cuantitativa discreta si es conteo; si es código/indicador, nominal (validar). |
| A5 | `creation_date` | `DATETIME` | Marca temporal asociada al evento nombrado (significado inferido). | Monovalorado por fila, Almacenado, Obligatorio, No clave | Temporal (DATETIME). |

| Posición | Atributo | PK/FK/UNIQUE | NULL | Dominio técnico |
|---:|---|---|---|---|
| A1 | `cart_ID` | PK, FK → tb_carts.ID, FK → tb_carts.ID | No | `INT; NOT NULL; DEFAULT sin DEFAULT` |
| A2 | `provider_ID` | PK, FK → tbd_products_users_providers.user_ID | No | `INT; NOT NULL; DEFAULT sin DEFAULT` |
| A3 | `product_ID` | PK, FK → tbd_products_users_providers.product_ID | No | `INT; NOT NULL; DEFAULT sin DEFAULT` |
| A4 | `quantity` | Atributo no clave | No | `INT; NOT NULL; DEFAULT '1'` |
| A5 | `creation_date` | Atributo no clave | No | `DATETIME; NOT NULL; DEFAULT CURRENT_TIMESTAMP` |


**Índices:** PK PRIMARY(cart_ID, provider_ID, product_ID); INDEX fk_cart_items_provider(provider_ID); INDEX fk_cart_items_product(product_ID)
**Reglas respaldadas:** NOT NULL, DEFAULT, AUTO_INCREMENT, ON UPDATE, ENUM/SET, PK, FK, UNIQUE y CHECK según lo declarado en SQL. La semántica de negocio de estas reglas queda pendiente cuando no se expresa en la restricción.

## tbd_order_items

**Descripción general:** Entidad indicada por el nombre de la tabla; explicación funcional inferida y pendiente de validación con la aplicación.

**Propósito de negocio:** Transaccional (inferido por nombre); el respaldo no contiene especificación funcional explícita.

**Propósito técnico:** Persistir 8 atributos; las claves, índices y restricciones se listan abajo.

**Clasificación:** Transaccional (inferido por nombre).

**Esquema:** `tbd_order_items(ID, seller_order_ID, product_offer_ID, product_name, quantity, unit_price, subtotal, creation_date)`

**Notación:** R(A1, A2, …, A8) · **Grado:** 8 · **PK:** ID

**CHECK:** CONSTRAINT `tbd_order_items_chk_1` CHECK ((`quantity` > 0)); CONSTRAINT `tbd_order_items_chk_2` CHECK ((`unit_price` >= 0))
**Relaciones:** seller_order_ID → tb_buyer_orders(ID); muchos-a-uno desde esta tabla; restricción tbd_order_items_ibfk_1; acciones no especificadas

| Posición | Atributo | Tipo SQL | Descripción | Clasificación | Naturaleza |
|---:|---|---|---|---|---|
| A1 | `ID` | `INT` | Identificador de registro o referencia; el destino solo se afirma si existe FK declarada. | Monovalorado por fila, Almacenado, Obligatorio, PK | Cualitativa nominal: identificador, no magnitud. |
| A2 | `seller_order_ID` | `INT` | Identificador de registro o referencia; el destino solo se afirma si existe FK declarada. | Monovalorado por fila, Almacenado, Obligatorio, FK | Cualitativa nominal: identificador, no magnitud. |
| A3 | `product_offer_ID` | `INT` | Identificador de registro o referencia; el destino solo se afirma si existe FK declarada. | Monovalorado por fila, Almacenado, Obligatorio, No clave | Cualitativa nominal: identificador, no magnitud. |
| A4 | `product_name` | `VARCHAR(255)` | Dato identificativo/descriptivo cuyo uso se infiere del nombre de columna. | Monovalorado por fila, Almacenado, Obligatorio, No clave | Cualitativa nominal; sin orden definido por SQL. |
| A5 | `quantity` | `INT` | Dato quantity; significado funcional inferido por el nombre y pendiente de validación. | Monovalorado por fila, Almacenado, Obligatorio, No clave | Cuantitativa discreta si es conteo; si es código/indicador, nominal (validar). |
| A6 | `unit_price` | `DECIMAL(12,2)` | Importe/magnitud monetaria inferida por el nombre; moneda no especificada aquí. | Monovalorado por fila, Almacenado, Obligatorio, No clave | Cuantitativa continua por representación numérica; semántica inferida. |
| A7 | `subtotal` | `DECIMAL(12,2)` | Importe/magnitud monetaria inferida por el nombre; moneda no especificada aquí. | Monovalorado por fila, Almacenado, Opcional, No clave | Cuantitativa continua por representación numérica; semántica inferida. |
| A8 | `creation_date` | `DATETIME` | Marca temporal asociada al evento nombrado (significado inferido). | Monovalorado por fila, Almacenado, Obligatorio, No clave | Temporal (DATETIME). |

| Posición | Atributo | PK/FK/UNIQUE | NULL | Dominio técnico |
|---:|---|---|---|---|
| A1 | `ID` | PK | No | `INT; NOT NULL; DEFAULT sin DEFAULT; AUTO_INCREMENT` |
| A2 | `seller_order_ID` | FK → tb_buyer_orders.ID | No | `INT; NOT NULL; DEFAULT sin DEFAULT` |
| A3 | `product_offer_ID` | Atributo no clave | No | `INT; NOT NULL; DEFAULT sin DEFAULT` |
| A4 | `product_name` | Atributo no clave | No | `VARCHAR(255); NOT NULL; DEFAULT sin DEFAULT` |
| A5 | `quantity` | Atributo no clave | No | `INT; NOT NULL; DEFAULT sin DEFAULT` |
| A6 | `unit_price` | Atributo no clave | No | `DECIMAL(12,2); NOT NULL; DEFAULT sin DEFAULT` |
| A7 | `subtotal` | Atributo no clave | Sí | `DECIMAL(12,2); NULL permitido; DEFAULT sin DEFAULT` |
| A8 | `creation_date` | Atributo no clave | No | `DATETIME; NOT NULL; DEFAULT CURRENT_TIMESTAMP` |


**Índices:** PK PRIMARY(ID); INDEX seller_order_ID(seller_order_ID); INDEX product_offer_ID(product_offer_ID)
**Reglas respaldadas:** NOT NULL, DEFAULT, AUTO_INCREMENT, ON UPDATE, ENUM/SET, PK, FK, UNIQUE y CHECK según lo declarado en SQL. La semántica de negocio de estas reglas queda pendiente cuando no se expresa en la restricción.

## tbd_products_categories

**Descripción general:** Entidad indicada por el nombre de la tabla; explicación funcional inferida y pendiente de validación con la aplicación.

**Propósito de negocio:** Maestra o asociativa (inferido por nombre); el respaldo no contiene especificación funcional explícita.

**Propósito técnico:** Persistir 5 atributos; las claves, índices y restricciones se listan abajo.

**Clasificación:** Maestra o asociativa (inferido por nombre).

**Esquema:** `tbd_products_categories(category_ID, product_ID, status, creation_date, last_update)`

**Notación:** R(A1, A2, …, A5) · **Grado:** 5 · **PK:** category_ID, product_ID

**Relaciones:** category_ID → tbc_categories(ID); muchos-a-uno desde esta tabla; restricción fk_category; acciones no especificadas; product_ID → tb_products(ID); muchos-a-uno desde esta tabla; restricción fk_product; acciones no especificadas

| Posición | Atributo | Tipo SQL | Descripción | Clasificación | Naturaleza |
|---:|---|---|---|---|---|
| A1 | `category_ID` | `INT` | Identificador de registro o referencia; el destino solo se afirma si existe FK declarada. | Monovalorado por fila, Almacenado, Obligatorio, PK, FK | Cualitativa nominal: identificador, no magnitud. |
| A2 | `product_ID` | `INT` | Identificador de registro o referencia; el destino solo se afirma si existe FK declarada. | Monovalorado por fila, Almacenado, Obligatorio, PK, FK | Cualitativa nominal: identificador, no magnitud. |
| A3 | `status` | `BIT(1)` | Estado/indicador del registro; dominio explícito en SQL cuando es ENUM o BIT. | Monovalorado por fila, Almacenado, Obligatorio, No clave | Cualitativa nominal; sin orden definido por SQL. |
| A4 | `creation_date` | `DATETIME` | Marca temporal asociada al evento nombrado (significado inferido). | Monovalorado por fila, Almacenado, Obligatorio, No clave | Temporal (DATETIME). |
| A5 | `last_update` | `DATETIME` | Marca temporal asociada al evento nombrado (significado inferido). `ON UPDATE CURRENT_TIMESTAMP`. | Monovalorado por fila, Almacenado, Obligatorio, No clave | Temporal (DATETIME). |

| Posición | Atributo | PK/FK/UNIQUE | NULL | Dominio técnico |
|---:|---|---|---|---|
| A1 | `category_ID` | PK, FK → tbc_categories.ID | No | `INT; NOT NULL; DEFAULT sin DEFAULT` |
| A2 | `product_ID` | PK, FK → tb_products.ID | No | `INT; NOT NULL; DEFAULT sin DEFAULT` |
| A3 | `status` | Atributo no clave | No | `BIT(1); NOT NULL; DEFAULT b'1'` |
| A4 | `creation_date` | Atributo no clave | No | `DATETIME; NOT NULL; DEFAULT CURRENT_TIMESTAMP` |
| A5 | `last_update` | Atributo no clave | No | `DATETIME; NOT NULL; DEFAULT sin DEFAULT` |


**Índices:** PK PRIMARY(category_ID, product_ID); INDEX fk_product(product_ID)
**Reglas respaldadas:** NOT NULL, DEFAULT, AUTO_INCREMENT, ON UPDATE, ENUM/SET, PK, FK, UNIQUE y CHECK según lo declarado en SQL. La semántica de negocio de estas reglas queda pendiente cuando no se expresa en la restricción.

## tbd_products_users_providers

**Descripción general:** Entidad indicada por el nombre de la tabla; explicación funcional inferida y pendiente de validación con la aplicación.

**Propósito de negocio:** Maestra o asociativa (inferido por nombre); el respaldo no contiene especificación funcional explícita.

**Propósito técnico:** Persistir 7 atributos; las claves, índices y restricciones se listan abajo.

**Clasificación:** Maestra o asociativa (inferido por nombre).

**Esquema:** `tbd_products_users_providers(user_ID, product_ID, type_ownership, status, avalaible_date, creation_date, last_update)`

**Notación:** R(A1, A2, …, A7) · **Grado:** 7 · **PK:** user_ID, product_ID

**Relaciones:** product_ID → tb_products(ID); muchos-a-uno desde esta tabla; restricción fk_products2; acciones no especificadas; user_ID → tb_users(ID); muchos-a-uno desde esta tabla; restricción fk_user1; acciones no especificadas

| Posición | Atributo | Tipo SQL | Descripción | Clasificación | Naturaleza |
|---:|---|---|---|---|---|
| A1 | `user_ID` | `INT` | Identificador de registro o referencia; el destino solo se afirma si existe FK declarada. | Monovalorado por fila, Almacenado, Obligatorio, PK, FK | Cualitativa nominal: identificador, no magnitud. |
| A2 | `product_ID` | `INT` | Identificador de registro o referencia; el destino solo se afirma si existe FK declarada. | Monovalorado por fila, Almacenado, Obligatorio, PK, FK | Cualitativa nominal: identificador, no magnitud. |
| A3 | `type_ownership` | `ENUM('Owner','Reseller','Distributor')` | Dato type ownership; significado funcional inferido por el nombre y pendiente de validación. | Monovalorado por fila, Almacenado, Opcional, No clave | Cualitativa nominal; sin orden definido por SQL. |
| A4 | `status` | `BIT(1)` | Estado/indicador del registro; dominio explícito en SQL cuando es ENUM o BIT. | Monovalorado por fila, Almacenado, Obligatorio, No clave | Cualitativa nominal; sin orden definido por SQL. |
| A5 | `avalaible_date` | `DATETIME` | Marca temporal asociada al evento nombrado (significado inferido). | Monovalorado por fila, Almacenado, Obligatorio, No clave | Temporal (DATETIME). |
| A6 | `creation_date` | `DATETIME` | Marca temporal asociada al evento nombrado (significado inferido). | Monovalorado por fila, Almacenado, Obligatorio, No clave | Temporal (DATETIME). |
| A7 | `last_update` | `DATETIME` | Marca temporal asociada al evento nombrado (significado inferido). `ON UPDATE CURRENT_TIMESTAMP`. | Monovalorado por fila, Almacenado, Obligatorio, No clave | Temporal (DATETIME). |

| Posición | Atributo | PK/FK/UNIQUE | NULL | Dominio técnico |
|---:|---|---|---|---|
| A1 | `user_ID` | PK, FK → tb_users.ID | No | `INT; NOT NULL; DEFAULT sin DEFAULT` |
| A2 | `product_ID` | PK, FK → tb_products.ID | No | `INT; NOT NULL; DEFAULT sin DEFAULT` |
| A3 | `type_ownership` | Atributo no clave | Sí | `ENUM('Owner','Reseller','Distributor'); NULL permitido; DEFAULT NULL` |
| A4 | `status` | Atributo no clave | No | `BIT(1); NOT NULL; DEFAULT b'1'` |
| A5 | `avalaible_date` | Atributo no clave | No | `DATETIME; NOT NULL; DEFAULT sin DEFAULT` |
| A6 | `creation_date` | Atributo no clave | No | `DATETIME; NOT NULL; DEFAULT CURRENT_TIMESTAMP` |
| A7 | `last_update` | Atributo no clave | No | `DATETIME; NOT NULL; DEFAULT sin DEFAULT` |


**Índices:** PK PRIMARY(user_ID, product_ID); INDEX fk_products2(product_ID)
**Reglas respaldadas:** NOT NULL, DEFAULT, AUTO_INCREMENT, ON UPDATE, ENUM/SET, PK, FK, UNIQUE y CHECK según lo declarado en SQL. La semántica de negocio de estas reglas queda pendiente cuando no se expresa en la restricción.

## tbd_return_items

**Descripción general:** Entidad indicada por el nombre de la tabla; explicación funcional inferida y pendiente de validación con la aplicación.

**Propósito de negocio:** Detalle/intermedia o auxiliar (inferido por nombre); el respaldo no contiene especificación funcional explícita.

**Propósito técnico:** Persistir 10 atributos; las claves, índices y restricciones se listan abajo.

**Clasificación:** Detalle/intermedia o auxiliar (inferido por nombre).

**Esquema:** `tbd_return_items(ID, return_ID, order_item_ID, quantity, unit_amount, item_reason, item_condition, status, creation_date, last_update)`

**Notación:** R(A1, A2, …, A10) · **Grado:** 10 · **PK:** ID

**CHECK:** CONSTRAINT `chk_return_items_amount` CHECK ((`unit_amount` >= 0)); CONSTRAINT `chk_return_items_quantity` CHECK ((`quantity` > 0))
**Relaciones:** order_item_ID → tbd_order_items(ID); muchos-a-uno desde esta tabla; restricción fk_return_items_order_item; acciones no especificadas; return_ID → tb_returns(ID); muchos-a-uno desde esta tabla; restricción fk_return_items_return; acciones no especificadas

| Posición | Atributo | Tipo SQL | Descripción | Clasificación | Naturaleza |
|---:|---|---|---|---|---|
| A1 | `ID` | `INT` | Identificador de registro o referencia; el destino solo se afirma si existe FK declarada. | Monovalorado por fila, Almacenado, Obligatorio, PK | Cualitativa nominal: identificador, no magnitud. |
| A2 | `return_ID` | `INT` | Identificador de registro o referencia; el destino solo se afirma si existe FK declarada. | Monovalorado por fila, Almacenado, Obligatorio, FK | Cualitativa nominal: identificador, no magnitud. |
| A3 | `order_item_ID` | `INT` | Identificador de registro o referencia; el destino solo se afirma si existe FK declarada. | Monovalorado por fila, Almacenado, Obligatorio, FK | Cualitativa nominal: identificador, no magnitud. |
| A4 | `quantity` | `INT` | Dato quantity; significado funcional inferido por el nombre y pendiente de validación. | Monovalorado por fila, Almacenado, Obligatorio, No clave | Cuantitativa discreta si es conteo; si es código/indicador, nominal (validar). |
| A5 | `unit_amount` | `DECIMAL(12,2)` | Importe/magnitud monetaria inferida por el nombre; moneda no especificada aquí. | Monovalorado por fila, Almacenado, Obligatorio, No clave | Cuantitativa continua por representación numérica; semántica inferida. |
| A6 | `item_reason` | `VARCHAR(500)` | Texto descriptivo asociado al registro (inferencia por nombre). | Monovalorado por fila, Almacenado, Opcional, No clave | Cualitativa nominal; sin orden definido por SQL. |
| A7 | `item_condition` | `ENUM('Unknown','New','Opened','Damaged')` | Dato item condition; significado funcional inferido por el nombre y pendiente de validación. | Monovalorado por fila, Almacenado, Obligatorio, No clave | Cualitativa nominal; sin orden definido por SQL. |
| A8 | `status` | `BIT(1)` | Estado/indicador del registro; dominio explícito en SQL cuando es ENUM o BIT. | Monovalorado por fila, Almacenado, Obligatorio, No clave | Cualitativa nominal; sin orden definido por SQL. |
| A9 | `creation_date` | `DATETIME` | Marca temporal asociada al evento nombrado (significado inferido). | Monovalorado por fila, Almacenado, Obligatorio, No clave | Temporal (DATETIME). |
| A10 | `last_update` | `DATETIME` | Marca temporal asociada al evento nombrado (significado inferido). `ON UPDATE CURRENT_TIMESTAMP`. | Monovalorado por fila, Almacenado, Opcional, No clave | Temporal (DATETIME). |

| Posición | Atributo | PK/FK/UNIQUE | NULL | Dominio técnico |
|---:|---|---|---|---|
| A1 | `ID` | PK | No | `INT; NOT NULL; DEFAULT sin DEFAULT; AUTO_INCREMENT` |
| A2 | `return_ID` | FK → tb_returns.ID | No | `INT; NOT NULL; DEFAULT sin DEFAULT` |
| A3 | `order_item_ID` | FK → tbd_order_items.ID | No | `INT; NOT NULL; DEFAULT sin DEFAULT` |
| A4 | `quantity` | Atributo no clave | No | `INT; NOT NULL; DEFAULT '1'` |
| A5 | `unit_amount` | Atributo no clave | No | `DECIMAL(12,2); NOT NULL; DEFAULT '0.00'` |
| A6 | `item_reason` | Atributo no clave | Sí | `VARCHAR(500); NULL permitido; DEFAULT NULL` |
| A7 | `item_condition` | Atributo no clave | No | `ENUM('Unknown','New','Opened','Damaged'); NOT NULL; DEFAULT 'Unknown'` |
| A8 | `status` | Atributo no clave | No | `BIT(1); NOT NULL; DEFAULT b'1'` |
| A9 | `creation_date` | Atributo no clave | No | `DATETIME; NOT NULL; DEFAULT CURRENT_TIMESTAMP` |
| A10 | `last_update` | Atributo no clave | Sí | `DATETIME; NULL permitido; DEFAULT NULL` |


**Índices:** PK PRIMARY(ID); INDEX idx_return_items_return(return_ID); INDEX idx_return_items_order_item(order_item_ID)
**Reglas respaldadas:** NOT NULL, DEFAULT, AUTO_INCREMENT, ON UPDATE, ENUM/SET, PK, FK, UNIQUE y CHECK según lo declarado en SQL. La semántica de negocio de estas reglas queda pendiente cuando no se expresa en la restricción.

## tbd_user_payment_methods

**Descripción general:** Entidad indicada por el nombre de la tabla; explicación funcional inferida y pendiente de validación con la aplicación.

**Propósito de negocio:** Transaccional (inferido por nombre); el respaldo no contiene especificación funcional explícita.

**Propósito técnico:** Persistir 11 atributos; las claves, índices y restricciones se listan abajo.

**Clasificación:** Transaccional (inferido por nombre).

**Esquema:** `tbd_user_payment_methods(ID, user_ID, payment_method_type_ID, provider, provider_method_ref, label, last_four, is_default, status, creation_date, last_update)`

**Notación:** R(A1, A2, …, A11) · **Grado:** 11 · **PK:** ID

**Relaciones:** user_ID → tb_users(ID); muchos-a-uno desde esta tabla; restricción tbd_user_payment_methods_ibfk_1; acciones no especificadas; payment_method_type_ID → tbc_payment_methods_types(ID); muchos-a-uno desde esta tabla; restricción tbd_user_payment_methods_ibfk_2; acciones no especificadas

| Posición | Atributo | Tipo SQL | Descripción | Clasificación | Naturaleza |
|---:|---|---|---|---|---|
| A1 | `ID` | `BIGINT` | Identificador de registro o referencia; el destino solo se afirma si existe FK declarada. | Monovalorado por fila, Almacenado, Obligatorio, PK | Cualitativa nominal: identificador, no magnitud. |
| A2 | `user_ID` | `INT` | Identificador de registro o referencia; el destino solo se afirma si existe FK declarada. | Monovalorado por fila, Almacenado, Obligatorio, FK | Cualitativa nominal: identificador, no magnitud. |
| A3 | `payment_method_type_ID` | `INT` | Identificador de registro o referencia; el destino solo se afirma si existe FK declarada. | Monovalorado por fila, Almacenado, Obligatorio, FK | Cualitativa nominal: identificador, no magnitud. |
| A4 | `provider` | `VARCHAR(60)` | Dato provider; significado funcional inferido por el nombre y pendiente de validación. | Monovalorado por fila, Almacenado, Obligatorio, UNIQUE | Cualitativa nominal; sin orden definido por SQL. |
| A5 | `provider_method_ref` | `VARCHAR(255)` | Dato provider method ref; significado funcional inferido por el nombre y pendiente de validación. | Monovalorado por fila, Almacenado, Obligatorio, UNIQUE | Cualitativa nominal; sin orden definido por SQL. |
| A6 | `label` | `VARCHAR(100)` | Dato label; significado funcional inferido por el nombre y pendiente de validación. | Monovalorado por fila, Almacenado, Opcional, No clave | Cualitativa nominal; sin orden definido por SQL. |
| A7 | `last_four` | `CHAR(4)` | Dato last four; significado funcional inferido por el nombre y pendiente de validación. | Monovalorado por fila, Almacenado, Opcional, No clave | Cualitativa nominal; sin orden definido por SQL. |
| A8 | `is_default` | `TINYINT` | Dato is default; significado funcional inferido por el nombre y pendiente de validación. | Monovalorado por fila, Almacenado, Obligatorio, No clave | Cuantitativa discreta si es conteo; si es código/indicador, nominal (validar). |
| A9 | `status` | `BIT(1)` | Estado/indicador del registro; dominio explícito en SQL cuando es ENUM o BIT. | Monovalorado por fila, Almacenado, Obligatorio, No clave | Cualitativa nominal; sin orden definido por SQL. |
| A10 | `creation_date` | `DATETIME` | Marca temporal asociada al evento nombrado (significado inferido). | Monovalorado por fila, Almacenado, Obligatorio, No clave | Temporal (DATETIME). |
| A11 | `last_update` | `DATETIME` | Marca temporal asociada al evento nombrado (significado inferido). `ON UPDATE CURRENT_TIMESTAMP`. | Monovalorado por fila, Almacenado, Opcional, No clave | Temporal (DATETIME). |

| Posición | Atributo | PK/FK/UNIQUE | NULL | Dominio técnico |
|---:|---|---|---|---|
| A1 | `ID` | PK | No | `BIGINT; NOT NULL; DEFAULT sin DEFAULT; AUTO_INCREMENT` |
| A2 | `user_ID` | FK → tb_users.ID | No | `INT; NOT NULL; DEFAULT sin DEFAULT` |
| A3 | `payment_method_type_ID` | FK → tbc_payment_methods_types.ID | No | `INT; NOT NULL; DEFAULT sin DEFAULT` |
| A4 | `provider` | UNIQUE | No | `VARCHAR(60); NOT NULL; DEFAULT sin DEFAULT` |
| A5 | `provider_method_ref` | UNIQUE | No | `VARCHAR(255); NOT NULL; DEFAULT sin DEFAULT` |
| A6 | `label` | Atributo no clave | Sí | `VARCHAR(100); NULL permitido; DEFAULT NULL` |
| A7 | `last_four` | Atributo no clave | Sí | `CHAR(4); NULL permitido; DEFAULT NULL` |
| A8 | `is_default` | Atributo no clave | No | `TINYINT; NOT NULL; DEFAULT '0'` |
| A9 | `status` | Atributo no clave | No | `BIT(1); NOT NULL; DEFAULT b'1'` |
| A10 | `creation_date` | Atributo no clave | No | `DATETIME; NOT NULL; DEFAULT CURRENT_TIMESTAMP` |
| A11 | `last_update` | Atributo no clave | Sí | `DATETIME; NULL permitido; DEFAULT NULL` |


**Índices:** PK PRIMARY(ID); UNIQUE uk_provider_method(provider, provider_method_ref); INDEX user_ID(user_ID); INDEX payment_method_type_ID(payment_method_type_ID)
**Reglas respaldadas:** NOT NULL, DEFAULT, AUTO_INCREMENT, ON UPDATE, ENUM/SET, PK, FK, UNIQUE y CHECK según lo declarado en SQL. La semántica de negocio de estas reglas queda pendiente cuando no se expresa en la restricción.

## tbd_users_wishlist_products

**Descripción general:** Entidad indicada por el nombre de la tabla; explicación funcional inferida y pendiente de validación con la aplicación.

**Propósito de negocio:** Maestra o asociativa (inferido por nombre); el respaldo no contiene especificación funcional explícita.

**Propósito técnico:** Persistir 5 atributos; las claves, índices y restricciones se listan abajo.

**Clasificación:** Maestra o asociativa (inferido por nombre).

**Esquema:** `tbd_users_wishlist_products(user_ID, product_ID, status, creation_date, last_update)`

**Notación:** R(A1, A2, …, A5) · **Grado:** 5 · **PK:** user_ID, product_ID

**Relaciones:** Sin FK declaradas.

| Posición | Atributo | Tipo SQL | Descripción | Clasificación | Naturaleza |
|---:|---|---|---|---|---|
| A1 | `user_ID` | `INT` | Identificador de registro o referencia; el destino solo se afirma si existe FK declarada. | Monovalorado por fila, Almacenado, Obligatorio, PK | Cualitativa nominal: identificador, no magnitud. |
| A2 | `product_ID` | `INT` | Identificador de registro o referencia; el destino solo se afirma si existe FK declarada. | Monovalorado por fila, Almacenado, Obligatorio, PK | Cualitativa nominal: identificador, no magnitud. |
| A3 | `status` | `BIT(1)` | Estado/indicador del registro; dominio explícito en SQL cuando es ENUM o BIT. | Monovalorado por fila, Almacenado, Obligatorio, No clave | Cualitativa nominal; sin orden definido por SQL. |
| A4 | `creation_date` | `DATETIME` | Marca temporal asociada al evento nombrado (significado inferido). | Monovalorado por fila, Almacenado, Obligatorio, No clave | Temporal (DATETIME). |
| A5 | `last_update` | `DATETIME` | Marca temporal asociada al evento nombrado (significado inferido). `ON UPDATE CURRENT_TIMESTAMP`. | Monovalorado por fila, Almacenado, Obligatorio, No clave | Temporal (DATETIME). |

| Posición | Atributo | PK/FK/UNIQUE | NULL | Dominio técnico |
|---:|---|---|---|---|
| A1 | `user_ID` | PK | No | `INT; NOT NULL; DEFAULT sin DEFAULT` |
| A2 | `product_ID` | PK | No | `INT; NOT NULL; DEFAULT sin DEFAULT` |
| A3 | `status` | Atributo no clave | No | `BIT(1); NOT NULL; DEFAULT b'1'` |
| A4 | `creation_date` | Atributo no clave | No | `DATETIME; NOT NULL; DEFAULT CURRENT_TIMESTAMP` |
| A5 | `last_update` | Atributo no clave | No | `DATETIME; NOT NULL; DEFAULT sin DEFAULT` |


**Índices:** PK PRIMARY(user_ID, product_ID)
**Reglas respaldadas:** NOT NULL, DEFAULT, AUTO_INCREMENT, ON UPDATE, ENUM/SET, PK, FK, UNIQUE y CHECK según lo declarado en SQL. La semántica de negocio de estas reglas queda pendiente cuando no se expresa en la restricción.

## Objetos adicionales

**Triggers:** trg_address_components_after_delete, trg_address_components_after_insert, trg_address_components_after_update, trg_buyer_orders_after_delete, trg_buyer_orders_after_insert, trg_buyer_orders_after_update, trg_cancellation_items_ad, trg_cancellation_items_ai, trg_cancellation_items_au, trg_cancellations_after_delete, trg_cancellations_after_insert, trg_cancellations_after_update, trg_carts_after_delete, trg_carts_after_insert, trg_carts_after_update, trg_carts_items_after_delete, trg_carts_items_after_insert, trg_carts_items_after_update, trg_categories_after_delete, trg_categories_after_insert, trg_categories_after_update, trg_order_items_after_delete, trg_order_items_after_insert, trg_order_items_after_update, trg_payment_methods_ad, trg_payment_methods_ai, trg_payment_methods_au, trg_payment_methods_types_after_delete, trg_payment_methods_types_after_insert, trg_payment_methods_types_after_update, trg_payment_transactions_ad, trg_payment_transactions_ai, trg_payment_transactions_au, trg_payments_ad, trg_payments_ai, trg_payments_au, trg_people_after_delete, trg_people_after_insert, trg_people_after_update, trg_products_after_delete, trg_products_after_insert, trg_products_after_update, trg_products_categories_after_delete, trg_products_categories_after_insert, trg_products_categories_after_update, trg_refunds_after_delete, trg_refunds_after_insert, trg_refunds_after_update, trg_return_items_ad, trg_return_items_ai, trg_return_items_au, trg_returns_after_delete, trg_returns_after_insert, trg_returns_after_update, trg_shipments_after_delete, trg_shipments_after_insert, trg_shipments_after_update, trg_tbd_products_users_providers_after_delete, trg_tbd_products_users_providers_after_insert, trg_tbd_products_users_providers_after_update, trg_user_addresses_after_delete, trg_user_addresses_after_insert, trg_user_addresses_after_update, trg_user_payment_methods_after_delete, trg_user_payment_methods_after_insert, trg_user_payment_methods_after_update, trg_users_after_delete, trg_users_after_insert, trg_users_after_update, trg_users_wishlist_products_after_delete, trg_users_wishlist_products_after_insert, trg_users_wishlist_products_after_update

**Vistas:** vw_total_products_by_category, vw_trazabilidad_address_components, vw_trazabilidad_buyer_orders, vw_trazabilidad_cancellation_items, vw_trazabilidad_cancellations, vw_trazabilidad_carts, vw_trazabilidad_carts_items, vw_trazabilidad_categorias, vw_trazabilidad_general, vw_trazabilidad_order_items, vw_trazabilidad_orders, vw_trazabilidad_payment_methods, vw_trazabilidad_payment_methods_types, vw_trazabilidad_people, vw_trazabilidad_productos, vw_trazabilidad_productos_proveedores, vw_trazabilidad_refunds, vw_trazabilidad_return_items, vw_trazabilidad_returns, vw_trazabilidad_shipments, vw_trazabilidad_tb_payment_transactions, vw_trazabilidad_tb_payments, vw_trazabilidad_tb_products, vw_trazabilidad_tbd_products_categories, vw_trazabilidad_user_addresses, vw_trazabilidad_user_payment_methods, vw_trazabilidad_users_wishlist_products, vw_trazabilidad_usuarios

**Procedimientos:** sp_register_user, sp_soft_delete_user

**Funciones:** ninguna detectada.

## Interpretación y cardinalidad

Las claves foráneas describen dependencias muchos-a-uno; si la FK tiene índice UNIQUE, la multiplicidad del lado dependiente es como máximo uno. La opcionalidad en SQL se deriva de NULL/NOT NULL. El número de filas no se reporta aquí: para respaldarlo habría que contar con precisión los INSERT de cada tabla. Las clasificaciones de propósito son inferencias por nombre; naturaleza temporal y tipos de almacenamiento se derivan del tipo SQL. Los identificadores enteros se clasifican como cualitativos nominales.