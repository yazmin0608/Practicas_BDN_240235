# Diccionario de datos — `db_test`

Fuente: `Practica03/backups/Respaldo_2010.sql` · MySQL 8.0.36 · InnoDB · charset `utf8mb4` · collation `utf8mb4_0900_ai_ci`.

> Descripciones funcionales basadas en nombres y relaciones son inferencias pendientes de validación. Solo PK/FK/índices/DDL tienen confirmación directa. El respaldo contiene INSERT históricos; no se consultó una instancia activa.

## Cobertura

- Tablas: 15 · Columnas: 111 · PK: 15 · FK: 17 · UNIQUE: 8 · índices (incluye PK/UNIQUE): 35 · CHECK: 9
- Triggers: 42 · Vistas: 14 · Procedimientos: 1

## Catálogo de tablas

### `tb_buyer_orders`

**Título:** Entidad · tb_buyer_orders  
**Propósito técnico:** tabla física con 8 columnas; motor InnoDB.  
**Propósito funcional:** representa probablemente órdenes de compra asignadas a vendedor (interpretación basada en nombre; validar).  
**PK:** `ID`. **FK:** 1. **Dependencias:** `tb_users`.  
**Trazabilidad/auditoría:** hay trigger(s) sobre esta tabla.  
**Filas INSERT en respaldo:** 0 (solo respaldo).

|#|Columna|Tipo original|NULL|DEFAULT|PK/FK/UNIQUE/índices|Descripción técnica y funcional|Ejemplo ilustrativo|Certeza|
|---:|---|---|:---:|---|---|---|---|---|
|1|`ID`|`int unsigned`|No|—|PK, AUTO_INCREMENT|Identificador de fila declarado como clave primaria. Identifica un registro de forma única dentro de esta tabla.|`42`|Confirmado por el esquema|
|2|`order_ID`|`int unsigned`|No|—|—|Atributo almacenado con tipo SQL int unsigned y nulabilidad obligatoria. El nombre y el tipo acotan el dato almacenado; su significado funcional específico requiere validación.|`42`|Pendiente de validación|
|3|`seller_ID`|`int unsigned`|No|—|FK → tb_users.ID, IDX fk_seller_orders_seller_idx|Columna participante en referencia declarada: FK hacia tb_users.ID. Vincula este registro con la entidad referenciada; el significado comercial concreto requiere validación.|`42`|Inferido por nombre y relación|
|4|`subtotal`|`decimal(12,2)`|No|'0.00'|—|Atributo almacenado con tipo SQL decimal(12,2) y nulabilidad obligatoria. El nombre y el tipo acotan el dato almacenado; su significado funcional específico requiere validación.|`123.45`|Pendiente de validación|
|5|`shipping_cost`|`decimal(12,2)`|No|'0.00'|—|Atributo almacenado con tipo SQL decimal(12,2) y nulabilidad obligatoria. El nombre y el tipo acotan el dato almacenado; su significado funcional específico requiere validación.|`123.45`|Pendiente de validación|
|6|`fulfillment_status`|`enum('Pending','Accepted','Preparing','Sent','Delivered','Canceled','Returned')`|No|'Pending'|—|Atributo almacenado con tipo SQL enum('Pending','Accepted','Preparing','Sent','Delivered','Canceled','Returned') y nulabilidad obligatoria. El nombre y el tipo acotan el dato almacenado; su significado funcional específico requiere validación.|`uno de los valores listados en el tipo`|Pendiente de validación|
|7|`creation_date`|`datetime`|No|CURRENT_TIMESTAMP|—|Marca temporal de creación almacenada. Fecha/hora asociada a la creación del registro; no implica por sí sola historial.|`2026-10-20 12:00:00`|Inferido por nombre|
|8|`last_update`|`datetime`|Sí|NULL|ON UPDATE CURRENT_TIMESTAMP|Marca temporal de actualización; se actualiza automáticamente al modificar la fila. Permite consultar una fecha de modificación registrada; no conserva versiones previas.|`2026-10-20 12:00:00`|Inferido por nombre|

**Restricciones CHECK:** `CONSTRAINT `tb_buyer_orders_chk_1` CHECK ((`subtotal` >= 0))`; `CONSTRAINT `tb_buyer_orders_chk_2` CHECK ((`shipping_cost` >= 0))`

**Índices:** `PRIMARY` (PRIMARY: ID); `fk_seller_orders_seller_idx` (INDEX: seller_ID).

### `tb_carts`

**Título:** Entidad · tb_carts  
**Propósito técnico:** tabla física con 5 columnas; motor InnoDB.  
**Propósito funcional:** representa probablemente carritos (interpretación basada en nombre; validar).  
**PK:** `ID`. **FK:** 1. **Dependencias:** `tb_users`.  
**Trazabilidad/auditoría:** hay trigger(s) sobre esta tabla.  
**Filas INSERT en respaldo:** 0 (solo respaldo).

|#|Columna|Tipo original|NULL|DEFAULT|PK/FK/UNIQUE/índices|Descripción técnica y funcional|Ejemplo ilustrativo|Certeza|
|---:|---|---|:---:|---|---|---|---|---|
|1|`ID`|`int unsigned`|No|—|PK, AUTO_INCREMENT|Identificador de fila declarado como clave primaria. Identifica un registro de forma única dentro de esta tabla.|`42`|Confirmado por el esquema|
|2|`user_ID`|`int unsigned`|No|—|FK → tb_users.ID, UNIQUE uk_cart_user|Columna participante en referencia declarada: FK hacia tb_users.ID. Vincula este registro con la entidad referenciada; el significado comercial concreto requiere validación.|`42`|Inferido por nombre y relación|
|3|`creation_date`|`datetime`|No|CURRENT_TIMESTAMP|—|Marca temporal de creación almacenada. Fecha/hora asociada a la creación del registro; no implica por sí sola historial.|`2026-10-20 12:00:00`|Inferido por nombre|
|4|`last_update`|`datetime`|Sí|NULL|ON UPDATE CURRENT_TIMESTAMP|Marca temporal de actualización; se actualiza automáticamente al modificar la fila. Permite consultar una fecha de modificación registrada; no conserva versiones previas.|`2026-10-20 12:00:00`|Inferido por nombre|
|5|`status`|`bit(1)`|Sí|b'1'|—|Indicador de estado con tipo y restricciones definidos por el DDL. Estado o habilitación del elemento; valores y semántica deben validarse salvo CHECK/ENUM.|`b'1'`|Inferido por nombre|

**Restricciones CHECK:** ninguna declarada.

**Índices:** `PRIMARY` (PRIMARY: ID); `uk_cart_user` (UNIQUE: user_ID).

### `tb_logs`

**Título:** Entidad · tb_logs  
**Propósito técnico:** tabla física con 7 columnas; motor InnoDB.  
**Propósito funcional:** representa probablemente eventos de registro de operaciones (interpretación basada en nombre; validar).  
**PK:** `ID`. **FK:** 0. **Dependencias:** ninguna declarada.  
**Trazabilidad/auditoría:** sin trigger detectado para esta tabla.  
**Filas INSERT en respaldo:** 25411 (solo respaldo).

|#|Columna|Tipo original|NULL|DEFAULT|PK/FK/UNIQUE/índices|Descripción técnica y funcional|Ejemplo ilustrativo|Certeza|
|---:|---|---|:---:|---|---|---|---|---|
|1|`ID`|`int`|No|—|PK, AUTO_INCREMENT|Identificador de fila declarado como clave primaria. Identifica un registro de forma única dentro de esta tabla.|`42`|Confirmado por el esquema|
|2|`table_name`|`varchar(100)`|No|—|—|Atributo almacenado con tipo SQL varchar(100) y nulabilidad obligatoria. El nombre y el tipo acotan el dato almacenado; su significado funcional específico requiere validación.|`"texto"`|Pendiente de validación|
|3|`operation`|`enum('Create','Read','Update','Delete')`|No|—|—|Atributo almacenado con tipo SQL enum('Create','Read','Update','Delete') y nulabilidad obligatoria. El nombre y el tipo acotan el dato almacenado; su significado funcional específico requiere validación.|`uno de los valores listados en el tipo`|Pendiente de validación|
|4|`db_users`|`varchar(80)`|No|—|—|Atributo almacenado con tipo SQL varchar(80) y nulabilidad obligatoria. El nombre y el tipo acotan el dato almacenado; su significado funcional específico requiere validación.|`"texto"`|Pendiente de validación|
|5|`description`|`text`|No|—|—|Atributo almacenado con tipo SQL text y nulabilidad obligatoria. El nombre y el tipo acotan el dato almacenado; su significado funcional específico requiere validación.|`"texto descriptivo"`|Pendiente de validación|
|6|`operation_date`|`datetime`|No|CURRENT_TIMESTAMP|—|Atributo almacenado con tipo SQL datetime y nulabilidad obligatoria. El nombre y el tipo acotan el dato almacenado; su significado funcional específico requiere validación.|`2026-10-20 12:00:00`|Pendiente de validación|
|7|`operation_status`|`bit(1)`|Sí|b'1'|—|Indicador de estado con tipo y restricciones definidos por el DDL. Estado o habilitación del elemento; valores y semántica deben validarse salvo CHECK/ENUM.|`b'1'`|Inferido por nombre|

**Restricciones CHECK:** ninguna declarada.

**Índices:** `PRIMARY` (PRIMARY: ID).

### `tb_products`

**Título:** Entidad · tb_products  
**Propósito técnico:** tabla física con 9 columnas; motor InnoDB.  
**Propósito funcional:** representa probablemente productos (interpretación basada en nombre; validar).  
**PK:** `ID`. **FK:** 0. **Dependencias:** ninguna declarada.  
**Trazabilidad/auditoría:** hay trigger(s) sobre esta tabla.  
**Filas INSERT en respaldo:** 15005 (solo respaldo).

|#|Columna|Tipo original|NULL|DEFAULT|PK/FK/UNIQUE/índices|Descripción técnica y funcional|Ejemplo ilustrativo|Certeza|
|---:|---|---|:---:|---|---|---|---|---|
|1|`ID`|`int unsigned`|No|—|PK, AUTO_INCREMENT|Identificador de fila declarado como clave primaria. Identifica un registro de forma única dentro de esta tabla.|`42`|Confirmado por el esquema|
|2|`SKU`|`varchar(50)`|No|—|UNIQUE SKU|Atributo identificador o de referencia nominal y único. Valor de identificación/código; interpretación exacta depende del dominio.|`"texto"`|Inferido por nombre|
|3|`name`|`varchar(250)`|No|—|—|Atributo almacenado con tipo SQL varchar(250) y nulabilidad obligatoria. El nombre y el tipo acotan el dato almacenado; su significado funcional específico requiere validación.|`"texto"`|Pendiente de validación|
|4|`description`|`text`|Sí|—|—|Atributo almacenado con tipo SQL text y nulabilidad opcional. El nombre y el tipo acotan el dato almacenado; su significado funcional específico requiere validación.|`"texto descriptivo"`|Pendiente de validación|
|5|`current_price`|`decimal(10,2)`|No|'0.00'|—|Atributo almacenado con tipo SQL decimal(10,2) y nulabilidad obligatoria. El nombre y el tipo acotan el dato almacenado; su significado funcional específico requiere validación.|`123.45`|Pendiente de validación|
|6|`current_stock`|`int unsigned`|No|'0'|—|Atributo almacenado con tipo SQL int unsigned y nulabilidad obligatoria. El nombre y el tipo acotan el dato almacenado; su significado funcional específico requiere validación.|`42`|Pendiente de validación|
|7|`status`|`bit(1)`|Sí|b'1'|—|Indicador de estado con tipo y restricciones definidos por el DDL. Estado o habilitación del elemento; valores y semántica deben validarse salvo CHECK/ENUM.|`b'1'`|Inferido por nombre|
|8|`creation_date`|`datetime`|No|CURRENT_TIMESTAMP|—|Marca temporal de creación almacenada. Fecha/hora asociada a la creación del registro; no implica por sí sola historial.|`2026-10-20 12:00:00`|Inferido por nombre|
|9|`last_update`|`datetime`|No|—|ON UPDATE CURRENT_TIMESTAMP|Marca temporal de actualización; se actualiza automáticamente al modificar la fila. Permite consultar una fecha de modificación registrada; no conserva versiones previas.|`2026-10-20 12:00:00`|Inferido por nombre|

**Restricciones CHECK:** ninguna declarada.

**Índices:** `PRIMARY` (PRIMARY: ID); `SKU` (UNIQUE: SKU).

### `tb_user_addresses`

**Título:** Entidad · tb_user_addresses  
**Propósito técnico:** tabla física con 12 columnas; motor InnoDB.  
**Propósito funcional:** representa probablemente direcciones asociadas a usuarios (interpretación basada en nombre; validar).  
**PK:** `ID`. **FK:** 1. **Dependencias:** `tb_users`.  
**Trazabilidad/auditoría:** hay trigger(s) sobre esta tabla.  
**Filas INSERT en respaldo:** 0 (solo respaldo).

|#|Columna|Tipo original|NULL|DEFAULT|PK/FK/UNIQUE/índices|Descripción técnica y funcional|Ejemplo ilustrativo|Certeza|
|---:|---|---|:---:|---|---|---|---|---|
|1|`ID`|`bigint unsigned`|No|—|PK, AUTO_INCREMENT|Identificador de fila declarado como clave primaria. Identifica un registro de forma única dentro de esta tabla.|`42`|Confirmado por el esquema|
|2|`user_ID`|`int unsigned`|No|—|FK → tb_users.ID, IDX idx_user_addresses|Columna participante en referencia declarada: FK hacia tb_users.ID. Vincula este registro con la entidad referenciada; el significado comercial concreto requiere validación.|`42`|Inferido por nombre y relación|
|3|`address_label`|`varchar(100)`|No|—|—|Atributo almacenado con tipo SQL varchar(100) y nulabilidad obligatoria. El nombre y el tipo acotan el dato almacenado; su significado funcional específico requiere validación.|`"texto"`|Pendiente de validación|
|4|`recipient_name`|`varchar(150)`|Sí|NULL|—|Atributo almacenado con tipo SQL varchar(150) y nulabilidad opcional. El nombre y el tipo acotan el dato almacenado; su significado funcional específico requiere validación.|`"texto"`|Pendiente de validación|
|5|`recipient_phone`|`varchar(25)`|Sí|NULL|—|Atributo almacenado con tipo SQL varchar(25) y nulabilidad opcional. El nombre y el tipo acotan el dato almacenado; su significado funcional específico requiere validación.|`"texto"`|Pendiente de validación|
|6|`delivery_instructions`|`varchar(500)`|Sí|NULL|—|Atributo almacenado con tipo SQL varchar(500) y nulabilidad opcional. El nombre y el tipo acotan el dato almacenado; su significado funcional específico requiere validación.|`"texto"`|Pendiente de validación|
|7|`latitude`|`decimal(10,7)`|Sí|NULL|—|Atributo almacenado con tipo SQL decimal(10,7) y nulabilidad opcional. El nombre y el tipo acotan el dato almacenado; su significado funcional específico requiere validación.|`123.45`|Pendiente de validación|
|8|`longitude`|`decimal(10,7)`|Sí|NULL|—|Atributo almacenado con tipo SQL decimal(10,7) y nulabilidad opcional. El nombre y el tipo acotan el dato almacenado; su significado funcional específico requiere validación.|`123.45`|Pendiente de validación|
|9|`is_default`|`tinyint(1)`|No|'0'|—|Atributo almacenado con tipo SQL tinyint(1) y nulabilidad obligatoria. El nombre y el tipo acotan el dato almacenado; su significado funcional específico requiere validación.|`1`|Pendiente de validación|
|10|`status`|`bit(1)`|No|b'1'|—|Indicador de estado con tipo y restricciones definidos por el DDL. Estado o habilitación del elemento; valores y semántica deben validarse salvo CHECK/ENUM.|`b'1'`|Inferido por nombre|
|11|`creation_date`|`datetime`|No|CURRENT_TIMESTAMP|—|Marca temporal de creación almacenada. Fecha/hora asociada a la creación del registro; no implica por sí sola historial.|`2026-10-20 12:00:00`|Inferido por nombre|
|12|`last_update`|`datetime`|Sí|NULL|ON UPDATE CURRENT_TIMESTAMP|Marca temporal de actualización; se actualiza automáticamente al modificar la fila. Permite consultar una fecha de modificación registrada; no conserva versiones previas.|`2026-10-20 12:00:00`|Inferido por nombre|

**Restricciones CHECK:** `CONSTRAINT `chk_coordinates` CHECK ((((`latitude` is null) and (`longitude` is null)) or ((`latitude` is not null) and (`longitude` is not null))))`; `CONSTRAINT `chk_latitude` CHECK ((`latitude` between -(90) and 90))`; `CONSTRAINT `chk_longitude` CHECK ((`longitude` between -(180) and 180))`

**Índices:** `PRIMARY` (PRIMARY: ID); `idx_user_addresses` (INDEX: user_ID).

### `tb_users`

**Título:** Entidad · tb_users  
**Propósito técnico:** tabla física con 8 columnas; motor InnoDB.  
**Propósito funcional:** representa probablemente usuarios y cuentas (interpretación basada en nombre; validar).  
**PK:** `ID`. **FK:** 0. **Dependencias:** ninguna declarada.  
**Trazabilidad/auditoría:** hay trigger(s) sobre esta tabla.  
**Filas INSERT en respaldo:** 8 (solo respaldo).

|#|Columna|Tipo original|NULL|DEFAULT|PK/FK/UNIQUE/índices|Descripción técnica y funcional|Ejemplo ilustrativo|Certeza|
|---:|---|---|:---:|---|---|---|---|---|
|1|`ID`|`int unsigned`|No|—|PK, AUTO_INCREMENT|Identificador de fila declarado como clave primaria. Identifica un registro de forma única dentro de esta tabla.|`42`|Confirmado por el esquema|
|2|`email`|`varchar(80)`|No|—|UNIQUE email|Atributo identificador o de referencia nominal y único. Valor de identificación/código; interpretación exacta depende del dominio.|`"texto"`|Inferido por nombre|
|3|`nick`|`varchar(100)`|No|—|UNIQUE nickname|Atributo almacenado con tipo SQL varchar(100) y nulabilidad obligatoria. El nombre y el tipo acotan el dato almacenado; su significado funcional específico requiere validación.|`"texto"`|Pendiente de validación|
|4|`password`|`varchar(255)`|No|—|—|Atributo almacenado con tipo SQL varchar(255) y nulabilidad obligatoria. El nombre y el tipo acotan el dato almacenado; su significado funcional específico requiere validación.|`"texto"`|Pendiente de validación|
|5|`creation_date`|`datetime`|No|CURRENT_TIMESTAMP|—|Marca temporal de creación almacenada. Fecha/hora asociada a la creación del registro; no implica por sí sola historial.|`2026-10-20 12:00:00`|Inferido por nombre|
|6|`last_update`|`datetime`|Sí|CURRENT_TIMESTAMP|ON UPDATE CURRENT_TIMESTAMP|Marca temporal de actualización; se actualiza automáticamente al modificar la fila. Permite consultar una fecha de modificación registrada; no conserva versiones previas.|`2026-10-20 12:00:00`|Inferido por nombre|
|7|`last_login`|`datetime`|Sí|NULL|—|Atributo almacenado con tipo SQL datetime y nulabilidad opcional. El nombre y el tipo acotan el dato almacenado; su significado funcional específico requiere validación.|`2026-10-20 12:00:00`|Pendiente de validación|
|8|`status`|`bit(1)`|No|b'1'|—|Indicador de estado con tipo y restricciones definidos por el DDL. Estado o habilitación del elemento; valores y semántica deben validarse salvo CHECK/ENUM.|`b'1'`|Inferido por nombre|

**Restricciones CHECK:** ninguna declarada.

**Índices:** `PRIMARY` (PRIMARY: ID); `email` (UNIQUE: email); `nickname` (UNIQUE: nick).

### `tbc_categories`

**Título:** Catálogo · tbc_categories  
**Propósito técnico:** tabla física con 7 columnas; motor InnoDB.  
**Propósito funcional:** representa probablemente categorías (interpretación basada en nombre; validar).  
**PK:** `ID`. **FK:** 1. **Dependencias:** `tbc_categories`.  
**Trazabilidad/auditoría:** hay trigger(s) sobre esta tabla.  
**Filas INSERT en respaldo:** 101 (solo respaldo).

|#|Columna|Tipo original|NULL|DEFAULT|PK/FK/UNIQUE/índices|Descripción técnica y funcional|Ejemplo ilustrativo|Certeza|
|---:|---|---|:---:|---|---|---|---|---|
|1|`ID`|`int unsigned`|No|—|PK, AUTO_INCREMENT|Identificador de fila declarado como clave primaria. Identifica un registro de forma única dentro de esta tabla.|`42`|Confirmado por el esquema|
|2|`name`|`varchar(120)`|No|—|UNIQUE name|Atributo almacenado con tipo SQL varchar(120) y nulabilidad obligatoria. El nombre y el tipo acotan el dato almacenado; su significado funcional específico requiere validación.|`"texto"`|Pendiente de validación|
|3|`description`|`text`|Sí|—|—|Atributo almacenado con tipo SQL text y nulabilidad opcional. El nombre y el tipo acotan el dato almacenado; su significado funcional específico requiere validación.|`"texto descriptivo"`|Pendiente de validación|
|4|`sup_id_category`|`int unsigned`|Sí|NULL|FK → tbc_categories.ID, IDX fk_superior_category|Columna participante en referencia declarada: FK hacia tbc_categories.ID. Vincula este registro con la entidad referenciada; el significado comercial concreto requiere validación.|`42`|Inferido por nombre y relación|
|5|`status`|`bit(1)`|No|b'1'|—|Indicador de estado con tipo y restricciones definidos por el DDL. Estado o habilitación del elemento; valores y semántica deben validarse salvo CHECK/ENUM.|`b'1'`|Inferido por nombre|
|6|`creation_date`|`datetime`|No|CURRENT_TIMESTAMP|—|Marca temporal de creación almacenada. Fecha/hora asociada a la creación del registro; no implica por sí sola historial.|`2026-10-20 12:00:00`|Inferido por nombre|
|7|`last_update`|`datetime`|No|—|ON UPDATE CURRENT_TIMESTAMP|Marca temporal de actualización; se actualiza automáticamente al modificar la fila. Permite consultar una fecha de modificación registrada; no conserva versiones previas.|`2026-10-20 12:00:00`|Inferido por nombre|

**Restricciones CHECK:** ninguna declarada.

**Índices:** `PRIMARY` (PRIMARY: ID); `name` (UNIQUE: name); `fk_superior_category` (INDEX: sup_id_category).

### `tbc_payment_methods_types`

**Título:** Catálogo · tbc_payment_methods_types  
**Propósito técnico:** tabla física con 6 columnas; motor InnoDB.  
**Propósito funcional:** representa probablemente tipos de método de pago (interpretación basada en nombre; validar).  
**PK:** `ID`. **FK:** 0. **Dependencias:** ninguna declarada.  
**Trazabilidad/auditoría:** hay trigger(s) sobre esta tabla.  
**Filas INSERT en respaldo:** 0 (solo respaldo).

|#|Columna|Tipo original|NULL|DEFAULT|PK/FK/UNIQUE/índices|Descripción técnica y funcional|Ejemplo ilustrativo|Certeza|
|---:|---|---|:---:|---|---|---|---|---|
|1|`ID`|`int unsigned`|No|—|PK, AUTO_INCREMENT|Identificador de fila declarado como clave primaria. Identifica un registro de forma única dentro de esta tabla.|`42`|Confirmado por el esquema|
|2|`code`|`varchar(30)`|No|—|UNIQUE code_UNIQUE|Atributo identificador o de referencia nominal y único. Valor de identificación/código; interpretación exacta depende del dominio.|`"texto"`|Inferido por nombre|
|3|`description`|`text`|No|—|—|Atributo almacenado con tipo SQL text y nulabilidad obligatoria. El nombre y el tipo acotan el dato almacenado; su significado funcional específico requiere validación.|`"texto descriptivo"`|Pendiente de validación|
|4|`status`|`bit(1)`|No|b'1'|—|Indicador de estado con tipo y restricciones definidos por el DDL. Estado o habilitación del elemento; valores y semántica deben validarse salvo CHECK/ENUM.|`b'1'`|Inferido por nombre|
|5|`creation_date`|`datetime`|No|CURRENT_TIMESTAMP|—|Marca temporal de creación almacenada. Fecha/hora asociada a la creación del registro; no implica por sí sola historial.|`2026-10-20 12:00:00`|Inferido por nombre|
|6|`last_update`|`datetime`|Sí|NULL|ON UPDATE CURRENT_TIMESTAMP|Marca temporal de actualización; se actualiza automáticamente al modificar la fila. Permite consultar una fecha de modificación registrada; no conserva versiones previas.|`2026-10-20 12:00:00`|Inferido por nombre|

**Restricciones CHECK:** ninguna declarada.

**Índices:** `PRIMARY` (PRIMARY: ID); `code_UNIQUE` (UNIQUE: code).

### `tbd_address_components`

**Título:** Detalle/asociación · tbd_address_components  
**Propósito técnico:** tabla física con 8 columnas; motor InnoDB.  
**Propósito funcional:** representa probablemente componentes estructurados de direcciones (interpretación basada en nombre; validar).  
**PK:** `ID`. **FK:** 2. **Dependencias:** `tb_user_addresses`, `tbd_address_components`.  
**Trazabilidad/auditoría:** hay trigger(s) sobre esta tabla.  
**Filas INSERT en respaldo:** 0 (solo respaldo).

|#|Columna|Tipo original|NULL|DEFAULT|PK/FK/UNIQUE/índices|Descripción técnica y funcional|Ejemplo ilustrativo|Certeza|
|---:|---|---|:---:|---|---|---|---|---|
|1|`ID`|`bigint unsigned`|No|—|PK, UNIQUE uk_address_component, AUTO_INCREMENT|Identificador de fila declarado como clave primaria. Identifica un registro de forma única dentro de esta tabla.|`42`|Confirmado por el esquema|
|2|`address_ID`|`bigint unsigned`|No|—|FK → tb_user_addresses.ID, FK → tbd_address_components.address_ID, UNIQUE uk_address_component, IDX idx_address_parent|Columna participante en referencia declarada: FK hacia tb_user_addresses.ID, FK hacia tbd_address_components.address_ID. Vincula este registro con la entidad referenciada; el significado comercial concreto requiere validación.|`42`|Inferido por nombre y relación|
|3|`value`|`varchar(255)`|No|—|—|Atributo almacenado con tipo SQL varchar(255) y nulabilidad obligatoria. El nombre y el tipo acotan el dato almacenado; su significado funcional específico requiere validación.|`"texto"`|Pendiente de validación|
|4|`component_type`|`varchar(50)`|No|—|—|Atributo almacenado con tipo SQL varchar(50) y nulabilidad obligatoria. El nombre y el tipo acotan el dato almacenado; su significado funcional específico requiere validación.|`"texto"`|Pendiente de validación|
|5|`status`|`bit(1)`|No|b'1'|—|Indicador de estado con tipo y restricciones definidos por el DDL. Estado o habilitación del elemento; valores y semántica deben validarse salvo CHECK/ENUM.|`b'1'`|Inferido por nombre|
|6|`address_sup_ID`|`bigint unsigned`|Sí|NULL|FK → tbd_address_components.ID, IDX idx_address_parent|Columna participante en referencia declarada: FK hacia tbd_address_components.ID. Vincula este registro con la entidad referenciada; el significado comercial concreto requiere validación.|`42`|Inferido por nombre y relación|
|7|`creation_date`|`datetime`|No|CURRENT_TIMESTAMP|—|Marca temporal de creación almacenada. Fecha/hora asociada a la creación del registro; no implica por sí sola historial.|`2026-10-20 12:00:00`|Inferido por nombre|
|8|`last_update`|`datetime`|Sí|NULL|ON UPDATE CURRENT_TIMESTAMP|Marca temporal de actualización; se actualiza automáticamente al modificar la fila. Permite consultar una fecha de modificación registrada; no conserva versiones previas.|`2026-10-20 12:00:00`|Inferido por nombre|

**Restricciones CHECK:** ninguna declarada.

**Índices:** `PRIMARY` (PRIMARY: ID); `uk_address_component` (UNIQUE: address_ID, ID); `idx_address_parent` (INDEX: address_ID, address_sup_ID).

### `tbd_carts_items`

**Título:** Detalle/asociación · tbd_carts_items  
**Propósito técnico:** tabla física con 5 columnas; motor InnoDB.  
**Propósito funcional:** representa probablemente renglones de carrito (interpretación basada en nombre; validar).  
**PK:** `cart_ID`, `provider_ID`, `product_ID`. **FK:** 4. **Dependencias:** `tb_carts`, `tbd_products_users_providers`, `tbd_products_users_providers`, `tb_carts`.  
**Trazabilidad/auditoría:** hay trigger(s) sobre esta tabla.  
**Filas INSERT en respaldo:** 0 (solo respaldo).

|#|Columna|Tipo original|NULL|DEFAULT|PK/FK/UNIQUE/índices|Descripción técnica y funcional|Ejemplo ilustrativo|Certeza|
|---:|---|---|:---:|---|---|---|---|---|
|1|`cart_ID`|`int unsigned`|No|—|PK, FK → tb_carts.ID, FK → tb_carts.ID|Identificador de fila declarado como clave primaria. Identifica un registro de forma única dentro de esta tabla.|`42`|Confirmado por el esquema|
|2|`provider_ID`|`int unsigned`|No|—|PK, FK → tbd_products_users_providers.user_ID, IDX fk_cart_items_provider|Identificador de fila declarado como clave primaria. Identifica un registro de forma única dentro de esta tabla.|`42`|Confirmado por el esquema|
|3|`product_ID`|`int unsigned`|No|—|PK, FK → tbd_products_users_providers.product_ID, IDX fk_cart_items_product|Identificador de fila declarado como clave primaria. Identifica un registro de forma única dentro de esta tabla.|`42`|Confirmado por el esquema|
|4|`quantity`|`int unsigned`|No|'1'|—|Atributo almacenado con tipo SQL int unsigned y nulabilidad obligatoria. El nombre y el tipo acotan el dato almacenado; su significado funcional específico requiere validación.|`42`|Pendiente de validación|
|5|`creation_date`|`datetime`|No|CURRENT_TIMESTAMP|—|Marca temporal de creación almacenada. Fecha/hora asociada a la creación del registro; no implica por sí sola historial.|`2026-10-20 12:00:00`|Inferido por nombre|

**Restricciones CHECK:** `CONSTRAINT `chk_cart_quantity` CHECK ((`quantity` > 0))`; `CONSTRAINT `chk_cart_quantity_positive` CHECK ((`quantity` > 0))`

**Índices:** `PRIMARY` (PRIMARY: cart_ID, provider_ID, product_ID); `fk_cart_items_provider` (INDEX: provider_ID); `fk_cart_items_product` (INDEX: product_ID).

### `tbd_order_items`

**Título:** Detalle/asociación · tbd_order_items  
**Propósito técnico:** tabla física con 8 columnas; motor InnoDB.  
**Propósito funcional:** representa probablemente renglones de órdenes (interpretación basada en nombre; validar).  
**PK:** `ID`. **FK:** 1. **Dependencias:** `tb_buyer_orders`.  
**Trazabilidad/auditoría:** hay trigger(s) sobre esta tabla.  
**Filas INSERT en respaldo:** 0 (solo respaldo).

|#|Columna|Tipo original|NULL|DEFAULT|PK/FK/UNIQUE/índices|Descripción técnica y funcional|Ejemplo ilustrativo|Certeza|
|---:|---|---|:---:|---|---|---|---|---|
|1|`ID`|`int unsigned`|No|—|PK, AUTO_INCREMENT|Identificador de fila declarado como clave primaria. Identifica un registro de forma única dentro de esta tabla.|`42`|Confirmado por el esquema|
|2|`seller_order_ID`|`int unsigned`|No|—|FK → tb_buyer_orders.ID, IDX seller_order_ID|Columna participante en referencia declarada: FK hacia tb_buyer_orders.ID. Vincula este registro con la entidad referenciada; el significado comercial concreto requiere validación.|`42`|Inferido por nombre y relación|
|3|`product_offer_ID`|`int unsigned`|No|—|IDX product_offer_ID|Atributo almacenado con tipo SQL int unsigned y nulabilidad obligatoria. El nombre y el tipo acotan el dato almacenado; su significado funcional específico requiere validación.|`42`|Pendiente de validación|
|4|`product_name`|`varchar(255)`|No|—|—|Atributo almacenado con tipo SQL varchar(255) y nulabilidad obligatoria. El nombre y el tipo acotan el dato almacenado; su significado funcional específico requiere validación.|`"texto"`|Pendiente de validación|
|5|`quantity`|`int unsigned`|No|—|—|Atributo almacenado con tipo SQL int unsigned y nulabilidad obligatoria. El nombre y el tipo acotan el dato almacenado; su significado funcional específico requiere validación.|`42`|Pendiente de validación|
|6|`unit_price`|`decimal(12,2)`|No|—|—|Atributo almacenado con tipo SQL decimal(12,2) y nulabilidad obligatoria. El nombre y el tipo acotan el dato almacenado; su significado funcional específico requiere validación.|`123.45`|Pendiente de validación|
|7|`subtotal`|`decimal(12,2)`|Sí|—|GENERATED ((`quantity` * `unit_price`)) STORED|Columna generada por la expresión SQL ((`quantity` * `unit_price`)) STORED. El nombre y el tipo acotan el dato almacenado; su significado funcional específico requiere validación.|`123.45`|Pendiente de validación|
|8|`creation_date`|`datetime`|No|CURRENT_TIMESTAMP|—|Marca temporal de creación almacenada. Fecha/hora asociada a la creación del registro; no implica por sí sola historial.|`2026-10-20 12:00:00`|Inferido por nombre|

**Restricciones CHECK:** `CONSTRAINT `tbd_order_items_chk_1` CHECK ((`quantity` > 0))`; `CONSTRAINT `tbd_order_items_chk_2` CHECK ((`unit_price` >= 0))`

**Índices:** `PRIMARY` (PRIMARY: ID); `seller_order_ID` (INDEX: seller_order_ID); `product_offer_ID` (INDEX: product_offer_ID).

### `tbd_products_categories`

**Título:** Detalle/asociación · tbd_products_categories  
**Propósito técnico:** tabla física con 5 columnas; motor InnoDB.  
**Propósito funcional:** representa probablemente asociación entre productos y categorías (interpretación basada en nombre; validar).  
**PK:** `category_ID`, `product_ID`. **FK:** 2. **Dependencias:** `tbc_categories`, `tb_products`.  
**Trazabilidad/auditoría:** hay trigger(s) sobre esta tabla.  
**Filas INSERT en respaldo:** 10279 (solo respaldo).

|#|Columna|Tipo original|NULL|DEFAULT|PK/FK/UNIQUE/índices|Descripción técnica y funcional|Ejemplo ilustrativo|Certeza|
|---:|---|---|:---:|---|---|---|---|---|
|1|`category_ID`|`int unsigned`|No|—|PK, FK → tbc_categories.ID|Identificador de fila declarado como clave primaria. Identifica un registro de forma única dentro de esta tabla.|`42`|Confirmado por el esquema|
|2|`product_ID`|`int unsigned`|No|—|PK, FK → tb_products.ID, IDX fk_product|Identificador de fila declarado como clave primaria. Identifica un registro de forma única dentro de esta tabla.|`42`|Confirmado por el esquema|
|3|`status`|`bit(1)`|No|b'1'|—|Indicador de estado con tipo y restricciones definidos por el DDL. Estado o habilitación del elemento; valores y semántica deben validarse salvo CHECK/ENUM.|`b'1'`|Inferido por nombre|
|4|`creation_date`|`datetime`|No|CURRENT_TIMESTAMP|—|Marca temporal de creación almacenada. Fecha/hora asociada a la creación del registro; no implica por sí sola historial.|`2026-10-20 12:00:00`|Inferido por nombre|
|5|`last_update`|`datetime`|No|—|ON UPDATE CURRENT_TIMESTAMP|Marca temporal de actualización; se actualiza automáticamente al modificar la fila. Permite consultar una fecha de modificación registrada; no conserva versiones previas.|`2026-10-20 12:00:00`|Inferido por nombre|

**Restricciones CHECK:** ninguna declarada.

**Índices:** `PRIMARY` (PRIMARY: category_ID, product_ID); `fk_product` (INDEX: product_ID).

### `tbd_products_users_providers`

**Título:** Detalle/asociación · tbd_products_users_providers  
**Propósito técnico:** tabla física con 7 columnas; motor InnoDB.  
**Propósito funcional:** representa probablemente asociación entre productos y proveedores/usuarios (interpretación basada en nombre; validar).  
**PK:** `user_ID`, `product_ID`. **FK:** 2. **Dependencias:** `tb_products`, `tb_users`.  
**Trazabilidad/auditoría:** hay trigger(s) sobre esta tabla.  
**Filas INSERT en respaldo:** 0 (solo respaldo).

|#|Columna|Tipo original|NULL|DEFAULT|PK/FK/UNIQUE/índices|Descripción técnica y funcional|Ejemplo ilustrativo|Certeza|
|---:|---|---|:---:|---|---|---|---|---|
|1|`user_ID`|`int unsigned`|No|—|PK, FK → tb_users.ID|Identificador de fila declarado como clave primaria. Identifica un registro de forma única dentro de esta tabla.|`42`|Confirmado por el esquema|
|2|`product_ID`|`int unsigned`|No|—|PK, FK → tb_products.ID, IDX fk_products2|Identificador de fila declarado como clave primaria. Identifica un registro de forma única dentro de esta tabla.|`42`|Confirmado por el esquema|
|3|`type_ownership`|`enum('Owner','Reseller','Distributor')`|Sí|NULL|—|Atributo almacenado con tipo SQL enum('Owner','Reseller','Distributor') y nulabilidad opcional. El nombre y el tipo acotan el dato almacenado; su significado funcional específico requiere validación.|`uno de los valores listados en el tipo`|Pendiente de validación|
|4|`status`|`bit(1)`|No|b'1'|—|Indicador de estado con tipo y restricciones definidos por el DDL. Estado o habilitación del elemento; valores y semántica deben validarse salvo CHECK/ENUM.|`b'1'`|Inferido por nombre|
|5|`avalaible_date`|`datetime`|No|—|—|Atributo almacenado con tipo SQL datetime y nulabilidad obligatoria. El nombre y el tipo acotan el dato almacenado; su significado funcional específico requiere validación.|`2026-10-20 12:00:00`|Pendiente de validación|
|6|`creation_date`|`datetime`|No|CURRENT_TIMESTAMP|—|Marca temporal de creación almacenada. Fecha/hora asociada a la creación del registro; no implica por sí sola historial.|`2026-10-20 12:00:00`|Inferido por nombre|
|7|`last_update`|`datetime`|No|—|ON UPDATE CURRENT_TIMESTAMP|Marca temporal de actualización; se actualiza automáticamente al modificar la fila. Permite consultar una fecha de modificación registrada; no conserva versiones previas.|`2026-10-20 12:00:00`|Inferido por nombre|

**Restricciones CHECK:** ninguna declarada.

**Índices:** `PRIMARY` (PRIMARY: user_ID, product_ID); `fk_products2` (INDEX: product_ID).

### `tbd_user_payment_methods`

**Título:** Detalle/asociación · tbd_user_payment_methods  
**Propósito técnico:** tabla física con 11 columnas; motor InnoDB.  
**Propósito funcional:** representa probablemente métodos de pago asociados a usuarios (interpretación basada en nombre; validar).  
**PK:** `ID`. **FK:** 2. **Dependencias:** `tb_users`, `tbc_payment_methods_types`.  
**Trazabilidad/auditoría:** hay trigger(s) sobre esta tabla.  
**Filas INSERT en respaldo:** 0 (solo respaldo).

|#|Columna|Tipo original|NULL|DEFAULT|PK/FK/UNIQUE/índices|Descripción técnica y funcional|Ejemplo ilustrativo|Certeza|
|---:|---|---|:---:|---|---|---|---|---|
|1|`ID`|`bigint unsigned`|No|—|PK, AUTO_INCREMENT|Identificador de fila declarado como clave primaria. Identifica un registro de forma única dentro de esta tabla.|`42`|Confirmado por el esquema|
|2|`user_ID`|`int unsigned`|No|—|FK → tb_users.ID, IDX user_ID|Columna participante en referencia declarada: FK hacia tb_users.ID. Vincula este registro con la entidad referenciada; el significado comercial concreto requiere validación.|`42`|Inferido por nombre y relación|
|3|`payment_method_type_ID`|`int unsigned`|No|—|FK → tbc_payment_methods_types.ID, IDX payment_method_type_ID|Columna participante en referencia declarada: FK hacia tbc_payment_methods_types.ID. Vincula este registro con la entidad referenciada; el significado comercial concreto requiere validación.|`42`|Inferido por nombre y relación|
|4|`provider`|`varchar(60)`|No|—|UNIQUE uk_provider_method|Atributo almacenado con tipo SQL varchar(60) y nulabilidad obligatoria. El nombre y el tipo acotan el dato almacenado; su significado funcional específico requiere validación.|`"texto"`|Pendiente de validación|
|5|`provider_method_ref`|`varchar(255)`|No|—|UNIQUE uk_provider_method|Atributo almacenado con tipo SQL varchar(255) y nulabilidad obligatoria. El nombre y el tipo acotan el dato almacenado; su significado funcional específico requiere validación.|`"texto"`|Pendiente de validación|
|6|`label`|`varchar(100)`|Sí|NULL|—|Atributo almacenado con tipo SQL varchar(100) y nulabilidad opcional. El nombre y el tipo acotan el dato almacenado; su significado funcional específico requiere validación.|`"texto"`|Pendiente de validación|
|7|`last_four`|`char(4)`|Sí|NULL|—|Atributo almacenado con tipo SQL char(4) y nulabilidad opcional. El nombre y el tipo acotan el dato almacenado; su significado funcional específico requiere validación.|`"ABC"`|Pendiente de validación|
|8|`is_default`|`tinyint`|No|'0'|—|Atributo almacenado con tipo SQL tinyint y nulabilidad obligatoria. El nombre y el tipo acotan el dato almacenado; su significado funcional específico requiere validación.|`1`|Pendiente de validación|
|9|`status`|`bit(1)`|No|b'1'|—|Indicador de estado con tipo y restricciones definidos por el DDL. Estado o habilitación del elemento; valores y semántica deben validarse salvo CHECK/ENUM.|`b'1'`|Inferido por nombre|
|10|`creation_date`|`datetime`|No|CURRENT_TIMESTAMP|—|Marca temporal de creación almacenada. Fecha/hora asociada a la creación del registro; no implica por sí sola historial.|`2026-10-20 12:00:00`|Inferido por nombre|
|11|`last_update`|`datetime`|Sí|NULL|ON UPDATE CURRENT_TIMESTAMP|Marca temporal de actualización; se actualiza automáticamente al modificar la fila. Permite consultar una fecha de modificación registrada; no conserva versiones previas.|`2026-10-20 12:00:00`|Inferido por nombre|

**Restricciones CHECK:** ninguna declarada.

**Índices:** `PRIMARY` (PRIMARY: ID); `uk_provider_method` (UNIQUE: provider, provider_method_ref); `user_ID` (INDEX: user_ID); `payment_method_type_ID` (INDEX: payment_method_type_ID).

### `tbd_users_wishlist_products`

**Título:** Detalle/asociación · tbd_users_wishlist_products  
**Propósito técnico:** tabla física con 5 columnas; motor InnoDB.  
**Propósito funcional:** representa probablemente asociación usuario-producto de lista de deseos (interpretación basada en nombre; validar).  
**PK:** `user_ID`, `product_ID`. **FK:** 0. **Dependencias:** ninguna declarada.  
**Trazabilidad/auditoría:** hay trigger(s) sobre esta tabla.  
**Filas INSERT en respaldo:** 0 (solo respaldo).

|#|Columna|Tipo original|NULL|DEFAULT|PK/FK/UNIQUE/índices|Descripción técnica y funcional|Ejemplo ilustrativo|Certeza|
|---:|---|---|:---:|---|---|---|---|---|
|1|`user_ID`|`int unsigned`|No|—|PK|Identificador de fila declarado como clave primaria. Identifica un registro de forma única dentro de esta tabla.|`42`|Confirmado por el esquema|
|2|`product_ID`|`int unsigned`|No|—|PK|Identificador de fila declarado como clave primaria. Identifica un registro de forma única dentro de esta tabla.|`42`|Confirmado por el esquema|
|3|`status`|`bit(1)`|No|b'1'|—|Indicador de estado con tipo y restricciones definidos por el DDL. Estado o habilitación del elemento; valores y semántica deben validarse salvo CHECK/ENUM.|`b'1'`|Inferido por nombre|
|4|`creation_date`|`datetime`|No|CURRENT_TIMESTAMP|—|Marca temporal de creación almacenada. Fecha/hora asociada a la creación del registro; no implica por sí sola historial.|`2026-10-20 12:00:00`|Inferido por nombre|
|5|`last_update`|`datetime`|No|—|ON UPDATE CURRENT_TIMESTAMP|Marca temporal de actualización; se actualiza automáticamente al modificar la fila. Permite consultar una fecha de modificación registrada; no conserva versiones previas.|`2026-10-20 12:00:00`|Inferido por nombre|

**Restricciones CHECK:** ninguna declarada.

**Índices:** `PRIMARY` (PRIMARY: user_ID, product_ID).

## Relaciones declaradas (FK)

|Origen|Columnas|Destino|Cardinalidad sustentada|ON DELETE|ON UPDATE|Nombre|
|---|---|---|---|---|---|---|
|`tb_buyer_orders`|`seller_ID`|`tb_users` (`ID`)|muchos→uno|no declarado|no declarado|`fk_seller_orders_seller`|
|`tb_carts`|`user_ID`|`tb_users` (`ID`)|muchos→uno|no declarado|no declarado|`tb_carts_ibfk_1`|
|`tb_user_addresses`|`user_ID`|`tb_users` (`ID`)|muchos→uno|no declarado|no declarado|`fk_addresses_user`|
|`tbc_categories`|`sup_id_category`|`tbc_categories` (`ID`)|muchos→uno|no declarado|no declarado|`fk_superior_category`|
|`tbd_address_components`|`address_ID`|`tb_user_addresses` (`ID`)|muchos→uno|RESTRICT|no declarado|`fk_component_address`|
|`tbd_address_components`|`address_ID, address_sup_ID`|`tbd_address_components` (`address_ID, ID`)|muchos→uno|RESTRICT|no declarado|`fk_component_parent`|
|`tbd_carts_items`|`cart_ID`|`tb_carts` (`ID`)|muchos→uno|no declarado|no declarado|`fk_cart_items_cart`|
|`tbd_carts_items`|`product_ID`|`tbd_products_users_providers` (`product_ID`)|muchos→muchos posibles (destino no único)|no declarado|no declarado|`fk_cart_items_product`|
|`tbd_carts_items`|`provider_ID`|`tbd_products_users_providers` (`user_ID`)|muchos→muchos posibles (destino no único)|no declarado|no declarado|`fk_cart_items_provider`|
|`tbd_carts_items`|`cart_ID`|`tb_carts` (`ID`)|muchos→uno|no declarado|no declarado|`tbd_carts_items_ibfk_1`|
|`tbd_order_items`|`seller_order_ID`|`tb_buyer_orders` (`ID`)|muchos→uno|no declarado|no declarado|`tbd_order_items_ibfk_1`|
|`tbd_products_categories`|`category_ID`|`tbc_categories` (`ID`)|muchos→uno|no declarado|no declarado|`fk_category`|
|`tbd_products_categories`|`product_ID`|`tb_products` (`ID`)|muchos→uno|no declarado|no declarado|`fk_product`|
|`tbd_products_users_providers`|`product_ID`|`tb_products` (`ID`)|muchos→uno|no declarado|no declarado|`fk_products2`|
|`tbd_products_users_providers`|`user_ID`|`tb_users` (`ID`)|muchos→uno|no declarado|no declarado|`fk_user1`|
|`tbd_user_payment_methods`|`user_ID`|`tb_users` (`ID`)|muchos→uno|no declarado|no declarado|`tbd_user_payment_methods_ibfk_1`|
|`tbd_user_payment_methods`|`payment_method_type_ID`|`tbc_payment_methods_types` (`ID`)|muchos→uno|no declarado|no declarado|`tbd_user_payment_methods_ibfk_2`|

Las relaciones se modelan por FK. La cardinalidad hacia destino es uno únicamente cuando las columnas destino coinciden con PK/UNIQUE; referencias a columnas no únicas permiten múltiples filas destino. `ON DELETE`/`ON UPDATE` solo aparecen cuando el DDL los declara. Las autorreferencias de `tbc_categories` y `tbd_address_components` están listadas; el ERD no dibuja el conector consigo misma.

## Tablas asociativas

- `tbd_products_categories`: asociativa confirmada por dos FK y PK compuesta; vincula producto y categoría. No agrega atributos no identificadores aparte de `status`, `creation_date` y `last_update`.
- `tbd_products_users_providers`: asociativa confirmada por dos FK y PK compuesta; vincula producto con usuario/proveedor. `type_ownership`, estado y fechas son atributos propios.
- `tbd_carts_items`: contiene FK a carrito y a IDs de producto/proveedor, con PK compuesta; su forma es asociativa, pero algunas FK destino no son únicas y existe una FK duplicada para `cart_ID`.
- `tbd_users_wishlist_products`: su PK es compuesta, pero no declara FK; la hipótesis de asociación usuario-producto se basa solo en nombres y queda pendiente de validación.

## Objetos programables y vistas

- **Triggers:** 42; `AFTER INSERT/UPDATE/DELETE` detectados: `trg_buyer_orders_after_insert` (AFTER INSERT en `tb_buyer_orders`), `trg_buyer_orders_after_update` (AFTER UPDATE en `tb_buyer_orders`), `trg_buyer_orders_after_delete` (AFTER DELETE en `tb_buyer_orders`), `trg_carts_after_insert` (AFTER INSERT en `tb_carts`), `trg_carts_after_update` (AFTER UPDATE en `tb_carts`), `trg_carts_after_delete` (AFTER DELETE en `tb_carts`), `trg_products_after_insert` (AFTER INSERT en `tb_products`), `trg_products_after_update` (AFTER UPDATE en `tb_products`), `trg_products_after_delete` (AFTER DELETE en `tb_products`), `trg_user_addresses_after_insert` (AFTER INSERT en `tb_user_addresses`), `trg_user_addresses_after_update` (AFTER UPDATE en `tb_user_addresses`), `trg_user_addresses_after_delete` (AFTER DELETE en `tb_user_addresses`), `trg_users_after_insert` (AFTER INSERT en `tb_users`), `trg_users_after_update` (AFTER UPDATE en `tb_users`), `trg_users_after_delete` (AFTER DELETE en `tb_users`), `trg_categories_after_insert` (AFTER INSERT en `tbc_categories`), `trg_categories_after_update` (AFTER UPDATE en `tbc_categories`), `trg_categories_after_delete` (AFTER DELETE en `tbc_categories`), `trg_payment_methods_types_after_insert` (AFTER INSERT en `tbc_payment_methods_types`), `trg_payment_methods_types_after_update` (AFTER UPDATE en `tbc_payment_methods_types`), `trg_payment_methods_types_after_delete` (AFTER DELETE en `tbc_payment_methods_types`), `trg_address_components_after_insert` (AFTER INSERT en `tbd_address_components`), `trg_address_components_after_update` (AFTER UPDATE en `tbd_address_components`), `trg_address_components_after_delete` (AFTER DELETE en `tbd_address_components`), `trg_carts_items_after_insert` (AFTER INSERT en `tbd_carts_items`), `trg_carts_items_after_update` (AFTER UPDATE en `tbd_carts_items`), `trg_carts_items_after_delete` (AFTER DELETE en `tbd_carts_items`), `trg_order_items_after_insert` (AFTER INSERT en `tbd_order_items`), `trg_order_items_after_update` (AFTER UPDATE en `tbd_order_items`), `trg_order_items_after_delete` (AFTER DELETE en `tbd_order_items`), `trg_products_categories_after_insert` (AFTER INSERT en `tbd_products_categories`), `trg_products_categories_after_update` (AFTER UPDATE en `tbd_products_categories`), `trg_products_categories_after_delete` (AFTER DELETE en `tbd_products_categories`), `trg_tbd_products_users_providers_after_insert` (AFTER INSERT en `tbd_products_users_providers`), `trg_tbd_products_users_providers_after_update` (AFTER UPDATE en `tbd_products_users_providers`), `trg_tbd_products_users_providers_after_delete` (AFTER DELETE en `tbd_products_users_providers`), `trg_user_payment_methods_after_insert` (AFTER INSERT en `tbd_user_payment_methods`), `trg_user_payment_methods_after_update` (AFTER UPDATE en `tbd_user_payment_methods`), `trg_user_payment_methods_after_delete` (AFTER DELETE en `tbd_user_payment_methods`), `trg_users_wishlist_products_after_insert` (AFTER INSERT en `tbd_users_wishlist_products`), `trg_users_wishlist_products_after_update` (AFTER UPDATE en `tbd_users_wishlist_products`), `trg_users_wishlist_products_after_delete` (AFTER DELETE en `tbd_users_wishlist_products`).
- **Vistas:** 14: `vw_total_products_by_category`, `vw_trazabilidad_address_components`, `vw_trazabilidad_buyer_orders`, `vw_trazabilidad_carts`, `vw_trazabilidad_carts_items`, `vw_trazabilidad_categorias`, `vw_trazabilidad_order_items`, `vw_trazabilidad_payment_methods_types`, `vw_trazabilidad_productos`, `vw_trazabilidad_productos_proveedores`, `vw_trazabilidad_user_addresses`, `vw_trazabilidad_user_payment_methods`, `vw_trazabilidad_users_wishlist_products`, `vw_trazabilidad_usuarios`.
- **Procedimientos:** 1: `sp_soft_delete_user`.
- **Funciones/eventos:** ninguno detectado mediante patrones de definición del respaldo.

## Auditoría y trazabilidad

El esquema contiene `tb_logs` y triggers que escriben eventos (los 42 triggers son AFTER INSERT/UPDATE/DELETE). Parte de ellos intenta escribir en siete tablas `w_trazabilidad_*` que no aparecen entre las 15 tablas creadas; también hay triggers que escriben en `tb_logs`. Las vistas `vw_trazabilidad_*` derivan presentaciones de esos registros. Un timestamp de actualización no conserva versiones anteriores.

## Tipos de datos

Tipos originales presentes: `bigint unsigned`, `bit(1)`, `char(4)`, `datetime`, `decimal(10,2)`, `decimal(10,7)`, `decimal(12,2)`, `enum('Create','Read','Update','Delete')`, `enum('Owner','Reseller','Distributor')`, `enum('Pending','Accepted','Preparing','Sent','Delivered','Canceled','Returned')`, `int`, `int unsigned`, `text`, `tinyint`, `tinyint(1)`, `varchar(100)`, `varchar(120)`, `varchar(150)`, `varchar(25)`, `varchar(250)`, `varchar(255)`, `varchar(30)`, `varchar(50)`, `varchar(500)`, `varchar(60)`, `varchar(80)`.

## Calidad y límites

- Cobertura: 15 tablas, 111 columnas; todas aparecen en el documento y CSV. No quedan tablas/columnas pendientes.
- Restricciones extraídas: 15 PK, 17 FK declaradas (incluye duplicidad), 8 UNIQUE, 35 índices totales incluyendo PK y UNIQUE, 9 CHECK declarados (incluye duplicados).
- Detectadas dos FK idénticas sobre `tbd_carts_items.cart_ID` (`fk_cart_items_cart` y `tbd_carts_items_ibfk_1`) y CHECK repetidos: `chk_cart_quantity`/`chk_cart_quantity_positive` validan la misma condición.
- Siete destinos de trigger `w_trazabilidad_*` no tienen `CREATE TABLE` visible en el dump. Las vistas también consultan `mysql.role_edges`, objeto externo al esquema `db_test`.
- Los conteos INSERT son únicamente del contenido del respaldo y no representan una instancia actual. Descripciones funcionales siguen siendo interpretaciones basadas en nombres y contexto estructural.
- No se ejecutó SQL ni se restauró ni modificó el esquema.
