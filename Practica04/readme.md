# Documentacion de la Práctica 04. Procesos de Simulación de una Compra

# Prácticas de la asignatura Optativa I: Bases De Datos en la Nube
## Ing. en Tecnologías de la Información e Innovación Digital
### Docente: M.T.I Marco A. Ramírez Hernandez
Periodo: Septiembre - Diciembre 2026

# Práctica 04 - Base de Datos `db_test`

---
|ID|Numero de Práctica|Nombre de la Práctica|Potenciador|Estatus
|---|---|---|---|---|
|1.|Metodologia de evaluacion de la materia|Transcribir en libreta y comprender la metodologia y fechas de evaluacion de la asignatura|42|💚Concluida|
|2.|Conexiones remotas para bases de datos SQL| Crear y administrar usuarios y privilegios para conexiones desde internet o redes locales |60|💚Concluida|
|3.|Manipulación de Datos en Conexiones Remotas a Bases de Datos Relacionales|Crear Procedimientos Almacenados, Funciones, Tablas Derivada, Importación de Datos en el Contexto de E-Commerce|100|💚Concluida|
|4.|Procesos de Simulación de una Compra|Simulación de 5 Casos|100|💚Concluida|

---

# 📚 Diccionario de Datos Actualizado

Se generó el diccionario de datos de la base de datos db_test mediante Archify, permitiendo visualizar la estructura de las tablas, atributos, tipos de datos, claves primarias, claves foráneas y relaciones existentes.

El diccionario de datos se encuentra publicado en GitHub Pages para su consulta.

### 🔗 Enlace al Diccionario de Datos y Modelo Entidad-Relación Extendido (EER)

**[📖 Consultar Diccionario de Datos Actualizado y Modelo Entidad-Relación Extendido (EER)](  https://yazmin0608.github.io/Practicas_BDN_240235/)**

---

# Práctica 04: Procesos de Simulación de Compra

Este documento detalla la ejecución y validación en base de datos (MySQL) de los 5 escenarios transaccionales del flujo de comercio electrónico, abarcando desde el registro de usuarios y gestión de carritos, hasta pagos diferidos, reembolsos parciales, puntos de recolección y cancelaciones por inventario.

---

## 🛠️ Arquitectura y Tablas Principales Involucradas
* **Usuarios y Direcciones:** `tb_users`, `tb_user_addresses`
* **Catálogo y Carritos:** `tb_products`, `tb_carts`, `tbd_carts_items`
* **Órdenes y Partidas:** `tb_buyer_orders`, `tbd_order_items`
* **Pagos y Métodos:** `tbd_user_payment_methods`, `tb_payment_methods`
* **Logística y Envíos:** `tb_shipments`

---

## 📋 Resumen de Ejecución de Casos de Prueba

| Caso | Escenario | Flujo Clave Validado | Estado Final |
| :--- | :--- | :--- | :--- |
| **01** | Compra Exitosa sin Modificaciones | Registro de usuario nuevo (`user_not_registered` $\rightarrow$ `buyer`), tarjeta de débito, pago único autorizado y entrega a domicilio. | `Delivered` / `Paid` |
| **02** | Detalles en Pago, Reclamación y Reenvío | Compra a 6 meses con tarjeta de crédito, rechazo en 6ta parcialidad por límite excedido, reclamo por daño y generación de reenvío. | `Delivered` / Reenviado |
| **03** | Cancelación Parcial y Reembolso | Compra de 3 productos de misma categoría con tarjeta digital (Spin), cancelación de 1 ítem, recálculo de subtotal y reembolso parcial. | `Delivered` / `Refunded` (Parcial) |
| **04** | Mismo Proveedor y Punto de Recolección | Orden `1002` (Usuario `10259`) con 3 artículos del mismo vendedor, pago vía SPEI y entrega en sucursal (`Punto de Recolección`). | `Delivered` / `Paid` |
| **05** | Compra Fallida por Falta de Inventario | Orden del usuario `10258` con cupón de regalo rechazada por stock insuficiente, cancelación automática y reasignación del cupón. | `Canceled` / Cupón Reasignado |

---

## 🧪 Detalle de los Casos de Prueba

### Caso de Prueba 1: "Compra Exitosa, sin modificaciones"
* **Objetivo:** Validar el flujo estándar *end-to-end* de un cliente nuevo desde su alta hasta la recepción del paquete.
* **Acciones en BD:**
  1. Registro de usuario nuevo con rol inicial `user_not_registered` mediante conexión `AppWeb`/`AppMobile`.
  2. Creación de carrito (`tb_carts`) y inserción de 5 productos activos (`tbd_carts_items`) verificando disponibilidad.
  3. Generación de orden en `tb_buyer_orders` y registro de domicilio predeterminado (`is_default = 1`) en `tb_user_addresses`.
  4. Vinculación de tarjeta de débito de 16 dígitos en `tbd_user_payment_methods`.
  5. Procesamiento de pago único (`Authorized` $\rightarrow$ `Paid`) en `tb_payment_methods`, escalando el rol a `buyer`.
  6. Actualización de orden a `Accepted` $\rightarrow$ `Sent` $\rightarrow$ `Delivered` junto con su registro en `tb_shipments`.

---

### Caso de Prueba 2: "Compra con detalles en el último pago y con reclamación y reenvío"
* **Objetivo:** Simular financiamiento a meses, manejo de rechazos bancarios parciales y logística inversa por producto dañado.
* **Acciones en BD:**
  1. Selección de 10 productos aleatorios (1 a 5 unidades) para un usuario existente.
  2. Registro de dirección alternativa de entrega (trabajo, `is_default = 0`) y tarjeta de crédito de 16 dígitos.
  3. Generación de 6 registros de pago mensual; autorización de las primeras 5 parcialidades y rechazo (`Failed`) de la 6ta con nota `"Límite excedido de crédito"`.
  4. Despacho y entrega inicial del pedido (`Delivered`).
  5. Registro de incidencia por producto dañado y emisión de un nuevo registro de envío en `tb_shipments` para reposición sin costo adicional.

---

### Caso de Prueba 3: "Compra exitosa con cancelación parcial, ajuste y reembolso parcial"
* **Objetivo:** Comprobar la integridad referencial y financiera al cancelar una partida de una orden ya pagada.
* **Acciones en BD:**
  1. Creación de carrito con 3 productos de la misma categoría (1 a 10 unidades) y envío a dirección secundaria (`"Casa Papas"`).
  2. Vinculación de tarjeta digital (`Spin`) de 16 dígitos y liquidación total en una sola exhibición (`Paid`).
  3. Cancelación de uno de los productos en `tbd_order_items` tras ser atendida la orden.
  4. Recálculo del `subtotal` en `tb_buyer_orders` y registro de transacción de reembolso parcial (`Refunded`) por el monto del artículo cancelado.
  5. Despacho y entrega del resto de los artículos al domicilio indicado.

---

### Caso de Prueba 4: "Compra exitosa del mismo proveedor con entrega en el punto de recolección"
* **Objetivo:** Validar compras consolidando un único vendedor (`seller_ID`), pagos interbancarios y entrega en sucursal.
* **Acciones en BD:**
  1. El usuario `10259` creó un carrito con 3 productos pertenecientes al mismo proveedor, generando la orden `1002`.
  2. Registro de dirección no domiciliaria etiquetada como `'Punto de Recolección - Sucursal Centro'` (`address_ID = 4`).
  3. Registro de cuenta simulada de 16 dígitos con proveedor `SPEI` en `tbd_user_payment_methods` y liquidación del total (`Paid`) en `tb_payment_methods`.
  4. Procesamiento de orden (`Accepted` $\rightarrow$ `Sent`) y despacho en `tb_shipments` (`Shipped`).
  5. Cierre del flujo marcando tanto el envío como la orden en estado `Delivered` con `delivered_date = NOW()` tras la recolección en mostrador.

---

### Caso de Prueba 5: "Compra fallida por falta de inventario"
* **Objetivo:** Verificar el control de stock, cancelación de órdenes desatendidas y reversión de beneficios aplicados.
* **Acciones en BD:**
  1. El usuario `10258` generó un carrito y su respectiva orden solicitando de 1 a 5 unidades de un producto de un mismo proveedor.
  2. Registro de dirección de envío y aplicación de método de pago mediante **cupón de regalo**.
  3. Al validar existencias contra `tb_products`, el sistema detectó inventario insuficiente y marcó la orden como no atendida.
  4. Actualización del estado de la orden a `Canceled` en `tb_buyer_orders` y liberación/reasignación del cupón de regalo al saldo disponible del usuario `10258`.

---

## ⚙️ Consideraciones Técnicas Aplicadas
* **Safe Update Mode:** Todas las sentencias `UPDATE` sobre `tb_buyer_orders` y `tb_shipments` se ejecutaron referenciando explícitamente la llave primaria (`ID`) mediante variables de sesión (`@buyer_order_id`, `@shipment_id`) para garantizar transacciones seguras.
* **Trazabilidad:** Se conservaron los registros históricos de carritos y transacciones fallidas/reembolsadas para auditoría completa de estados.