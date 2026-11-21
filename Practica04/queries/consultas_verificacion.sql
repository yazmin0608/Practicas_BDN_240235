use db_test;

/*1. Un usuario nuevo se registra en la plataforma  (rol: user_not_registered, user de la conexion a la db: AppWeb o AppMobile) 
con sus datos personales y de cuenta de usuario*/
select current_role();

USE db_test;

/* Consulta la trazabilidad de usuarios */
select * from vw_trazabilidad_usuarios ORDER BY operation_date desc;

-- Después de conectarse con el usuario AppWeb o AppMobile,
-- el usuario que por el momento es un usuario no registrado,
-- deberá crear su cuenta.

-- 1. Creación del usuario

START TRANSACTION;

INSERT INTO tb_users (
    email, 
    nick, 
    password, 
    status
) VALUES (
    '240508@utxicotepec.edu.mx', 
    'Olaf Garcia', 
    'Olaf1234', 
USE db_test;

-- =====================================================
-- PRÁCTICA 04 - VISTAS DE TRAZABILIDAD
-- BASE DE DATOS: db_test
-- ACTUALIZACIÓN: 21/11/2026
-- =====================================================
-- Caso 1: app_web@192.168.1.74
-- Casos 2-5: yazmin.esquivel@localhost
--
-- Las vistas consultan los registros originales.
-- No modifican tablas ni datos de auditoría.
-- =====================================================


-- =====================================================
-- 1. VISTA BASE DE AUDITORÍA
-- =====================================================

CREATE OR REPLACE VIEW vw_practica04_base AS
SELECT
    l.ID AS id_evento,

    CASE
        WHEN l.table_name IN (
            'tb_users',
            'tb_people'
        ) THEN 'Registro'

        WHEN l.table_name IN (
            'tb_carts',
            'tbd_carts_items',
            'tbd_users_wishlist_products'
        ) THEN 'Carrito'

        WHEN l.table_name IN (
            'tb_payment_methods',
            'tbd_user_payment_methods',
            'tbc_payment_methods_types'
        ) THEN 'Método de pago'

        WHEN l.table_name IN (
            'tb_payments',
            'tb_payment_transactions'
        ) THEN 'Pago'

        WHEN l.table_name = 'tb_shipments'
            THEN 'Envío'

        WHEN l.table_name IN (
            'tb_returns',
            'tbd_return_items'
        ) THEN 'Devolución'

        WHEN l.table_name = 'tb_refunds'
            THEN 'Reembolso'

        WHEN l.table_name IN (
            'tb_cancellations',
            'tbd_cancellation_items'
        ) THEN 'Cancelación'

        WHEN l.table_name LIKE '%address%'
            THEN 'Domicilio'

        ELSE 'Compra'
    END AS fase,

    SUBSTRING_INDEX(l.db_users, '@', 1)
        AS usuario_ejecutor,

    l.db_users AS conexion_bd,
    l.operation_date AS fecha_evento,
    l.table_name AS tabla_modificada,
    l.operation AS operacion,
    l.description AS detalle_evento,

    CASE
        WHEN l.operation_status = b'1'
            THEN 'Evento registrado'
        ELSE 'Evento no exitoso'
    END AS resultado

FROM tb_logs AS l;


-- =====================================================
-- 2. CASO 1: COMPRA EXITOSA SIN MODIFICACIONES
-- =====================================================
-- Conexión: app_web@192.168.1.74
-- Fecha: 04/11/2026
-- Eventos identificados: 34
-- =====================================================

CREATE OR REPLACE VIEW vw_practica04_caso_1 AS
SELECT
    'Caso 1 - Compra exitosa, sin modificaciones'
        AS caso,
    b.*
FROM vw_practica04_base AS b
WHERE b.id_evento BETWEEN 45882 AND 45921
  AND b.conexion_bd = 'app_web@192.168.1.74';


-- =====================================================
-- 3. CASO 2: COMPRA CON RECLAMACIÓN Y REENVÍO
-- =====================================================
-- Conexión: yazmin.esquivel@localhost
-- Fecha: 11/11/2026
-- Usuario: 10261
-- Carrito: 5
-- Pedido interno: 4
-- Pago: 3
-- Devolución: 2
-- Envío original: 1
-- Envío de reemplazo: 2
-- Eventos identificados: 32
-- =====================================================

CREATE OR REPLACE VIEW vw_practica04_caso_2 AS
SELECT
    'Caso 2 - Compra con reclamación y reenvío'
        AS caso,
    b.*
FROM vw_practica04_base AS b
WHERE b.id_evento BETWEEN 45922 AND 45953
  AND b.conexion_bd = 'yazmin.esquivel@localhost';


-- =====================================================
-- 4. CASO 3: CANCELACIÓN PARCIAL Y REEMBOLSO
-- =====================================================
-- Conexión: yazmin.esquivel@localhost
-- Fecha: 18/11/2026
-- Usuario: 10260
-- Carrito: 6
-- Pedido interno: 5
-- Referencia de pedido: 1001
-- Cancelación: 1
-- Reembolso: 1
-- Importe reembolsado: $2,000 MXN
-- Eventos identificados: 21
-- =====================================================

CREATE OR REPLACE VIEW vw_practica04_caso_3 AS
SELECT
    'Caso 3 - Cancelación parcial y reembolso'
        AS caso,
    b.*
FROM vw_practica04_base AS b
WHERE b.id_evento BETWEEN 45954 AND 45974
  AND b.conexion_bd = 'yazmin.esquivel@localhost';


-- =====================================================
-- 5. CASO 4: ENTREGA EN PUNTO DE RECOLECCIÓN
-- =====================================================
-- Conexión: yazmin.esquivel@localhost
-- Fecha: 18/11/2026
-- Usuario: 10259
-- Carrito: 8
-- Pedido interno: 6
-- Referencia de pedido: 1002
-- Dirección: Punto de Recolección - Sucursal Centro
-- Envío: 3
-- Estado final: Delivered
-- Eventos identificados: 16
-- =====================================================

CREATE OR REPLACE VIEW vw_practica04_caso_4 AS
SELECT
    'Caso 4 - Entrega en punto de recolección'
        AS caso,
    b.*
FROM vw_practica04_base AS b
WHERE b.id_evento BETWEEN 45975 AND 45990
  AND b.conexion_bd = 'yazmin.esquivel@localhost';


-- =====================================================
-- 6. CASO 5: COMPRA FALLIDA POR INVENTARIO
-- =====================================================
-- Conexión: yazmin.esquivel@localhost
-- Fechas: 18/11/2026 y 21/11/2026
-- Usuario: 4
-- Carrito: 9
-- Producto: 9 - Monitor LED 24" Full HD
-- Cantidad solicitada: 5
-- Inventario real consultado: 10
-- Inventario simulado: 3
-- Unidades faltantes en simulación: 2
-- Pedido interno: 7
-- Referencia de pedido: 1003
-- Domicilio alternativo: 5
-- Método de pago: GIFT_COUPON
-- Método de pago del usuario: 9
-- Cancelación: 2
-- Estado final: Canceled
-- Pago registrado: ninguno
-- Cupón: permanece disponible
--
-- IMPORTANTE:
-- La insuficiencia de inventario fue SIMULADA.
-- No se modificó el inventario real.
--
-- Eventos iniciales: 45991 - 45993
-- Eventos nuevos: 45996 - 46001
-- Total esperado: 9 eventos
--
-- Se excluyen 45994 y 45995 porque no se
-- han identificado como parte del Caso 5.
-- =====================================================

CREATE OR REPLACE VIEW vw_practica04_caso_5 AS
SELECT
    'Caso 5 - Compra fallida por inventario'
        AS caso,
    b.*
FROM vw_practica04_base AS b
WHERE b.conexion_bd = 'yazmin.esquivel@localhost'
  AND (
        b.id_evento BETWEEN 45991 AND 45993
        OR
        b.id_evento BETWEEN 45996 AND 46001
      );


-- =====================================================
-- 7. VISTA DE RESUMEN GENERAL
-- =====================================================

CREATE OR REPLACE VIEW vw_practica04_resumen AS
SELECT
    caso,
    COUNT(*) AS total_eventos,
    MIN(fecha_evento) AS primer_evento,
    MAX(fecha_evento) AS ultimo_evento

FROM (
    SELECT caso, fecha_evento
    FROM vw_practica04_caso_1

    UNION ALL

    SELECT caso, fecha_evento
    FROM vw_practica04_caso_2

    UNION ALL

    SELECT caso, fecha_evento
    FROM vw_practica04_caso_3

    UNION ALL

    SELECT caso, fecha_evento
    FROM vw_practica04_caso_4

    UNION ALL

    SELECT caso, fecha_evento
    FROM vw_practica04_caso_5

) AS eventos

GROUP BY caso;


-- =====================================================
-- 8. VALIDACIÓN DEL RESUMEN GENERAL
-- =====================================================

SELECT *
FROM vw_practica04_resumen
ORDER BY caso;


-- =====================================================
-- 9. VALIDACIÓN INDIVIDUAL DE LOS CINCO CASOS
-- =====================================================

-- CASO 1
SELECT *
FROM vw_practica04_caso_1
ORDER BY fecha_evento, id_evento;

-- CASO 2
SELECT *
FROM vw_practica04_caso_2
ORDER BY fecha_evento, id_evento;

-- CASO 3
SELECT *
FROM vw_practica04_caso_3
ORDER BY fecha_evento, id_evento;

-- CASO 4
SELECT *
FROM vw_practica04_caso_4
ORDER BY fecha_evento, id_evento;

-- CASO 5
SELECT *
FROM vw_practica04_caso_5
ORDER BY fecha_evento, id_evento;


-- =====================================================
-- 10. VALIDACIÓN DE USUARIOS POR CASO
-- =====================================================

SELECT
    caso,
    usuario_ejecutor,
    conexion_bd,
    COUNT(*) AS total_eventos
FROM (
    SELECT caso, usuario_ejecutor, conexion_bd
    FROM vw_practica04_caso_1

    UNION ALL

    SELECT caso, usuario_ejecutor, conexion_bd
    FROM vw_practica04_caso_2

    UNION ALL

    SELECT caso, usuario_ejecutor, conexion_bd
    FROM vw_practica04_caso_3

    UNION ALL

    SELECT caso, usuario_ejecutor, conexion_bd
    FROM vw_practica04_caso_4

    UNION ALL

    SELECT caso, usuario_ejecutor, conexion_bd
    FROM vw_practica04_caso_5
) AS auditoria

GROUP BY
    caso,
    usuario_ejecutor,
    conexion_bd

ORDER BY caso;


-- =====================================================
-- 11. VALIDACIÓN DEL ESTADO FINAL DEL CASO 5
-- =====================================================

SELECT
    bo.ID AS pedido_ID,
    bo.order_ID AS numero_orden,
    bo.fulfillment_status AS estado_pedido,

    (
        SELECT COUNT(*)
        FROM tb_cancellations AS c
        WHERE c.buyer_order_ID = bo.ID
          AND c.cancellation_status = 'Completed'
    ) AS cancelaciones_completadas,

    (
        SELECT COUNT(*)
        FROM tb_payments AS p
        WHERE p.order_ID = bo.ID
    ) AS pagos_registrados,

    (
        SELECT COUNT(*)
        FROM tbd_user_payment_methods AS m
        WHERE m.ID = 9
          AND m.user_ID = 4
          AND m.status = b'1'
    ) AS cupones_disponibles,

    CASE
        WHEN bo.fulfillment_status = 'Canceled'
         AND EXISTS (
             SELECT 1
             FROM tb_cancellations AS c
             WHERE c.buyer_order_ID = bo.ID
               AND c.cancellation_status = 'Completed'
         )
         AND NOT EXISTS (
             SELECT 1
             FROM tb_payments AS p
             WHERE p.order_ID = bo.ID
         )
         AND EXISTS (
             SELECT 1
             FROM tbd_user_payment_methods AS m
             WHERE m.ID = 9
               AND m.user_ID = 4
               AND m.status = b'1'
         )
        THEN 'CASO 5: CANCELACION COMPLETADA Y CUPON DISPONIBLE'
        ELSE 'REVISAR RESULTADOS'
    END AS resultado_final

FROM tb_buyer_orders AS bo
WHERE bo.ID = 7
  AND bo.order_ID = 1003;


-- =====================================================
-- 12. VERIFICACIÓN DE EVENTOS EXCLUIDOS
-- =====================================================
-- Consulta informativa para identificar los
-- eventos 45994 y 45995.
-- No modifica ni elimina registros.
-- =====================================================

SELECT
    ID,
    table_name,
    operation,
    db_users,
    description,
    operation_date
FROM tb_logs
WHERE ID IN (45994, 45995)
ORDER BY ID;


-- =====================================================
-- 13. VALIDACIÓN DEL TOTAL DE EVENTOS
-- =====================================================

SELECT
    COUNT(*) AS total_eventos_practica04
FROM (
    SELECT id_evento FROM vw_practica04_caso_1
    UNION ALL
    SELECT id_evento FROM vw_practica04_caso_2
    UNION ALL
    SELECT id_evento FROM vw_practica04_caso_3
    UNION ALL
    SELECT id_evento FROM vw_practica04_caso_4
    UNION ALL
    SELECT id_evento FROM vw_practica04_caso_5
) AS total_auditoria;

    1
);

SET @user_ID = LAST_INSERT_ID();

INSERT INTO tb_people (
    user_ID, 
    courtesy_title, 
    given_names, 
    family_names, 
    birth_date, 
    gender_ID, 
    country_code, 
    phone, 
    status
) VALUES (
    10262, 
    'Sr.', 
    'Olaf', 
    'Garcia', 
    '2006-12-23', 
    1, 
    'MX', 
    '0104225556', 
    1
);

/*2. Activacion de rol "common_user", para poder elegit productos en la 
lista de favoritos*/

set role "common_user";
select current_role();

show tables;

/*Visualizar los productos disponibles de catalogo*/
select * FROM tb_products where status = b'1';

/*Buscar producto por nombre y status*/
SELECT * from tb_products where description like "%Camara%";

/*Crear mi lista de favoritos*/
INSERT INTO tbd_users_wishlist_products valueS(17,20);
INSERT INTO tbd_users_wishlist_products valueS(17,60);
INSERT INTO tbd_users_wishlist_products valueS(17,556);
INSERT INTO tbd_users_wishlist_products valueS(17,7);
INSERT INTO tbd_users_wishlist_products valueS(17,53);

USE db_test;

DESCRIBE tb_carts;

SHOW CREATE TABLE tb_carts;

