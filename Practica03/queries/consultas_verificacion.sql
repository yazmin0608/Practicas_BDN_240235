USE db_test;

/* 1. Cuantas tablas tenemos?*/
-- En la Practica 3 agregamos 2 nuevas categorias y productos_categorias
SHOW TABLES;

/* 2. Cuantos triggers tenemos*/
-- Por cada tabla creada deberan estar 3 triggers para poder realizar la trazabilidad de bitacora
SHOW TRIGGERS FROM db_test;

/* 3. Contabilizar el total de productos por usuario*/
SELECT COUNT(*), inserted_by
FROM vw_trazabilidad_productos
GROUP BY inserted_by;

/*3. Consulta de Productos por Categoria*/
SELECT *
FROM vw_total_products_by_category
order by
	category_ID is null;
    
/*4. Muestra los procedimientos de latbd_users_offer_products base de datos*/
SHOW PROCEDURE STATUS WHERE Db = 'db_test';

/**/

USE db_test;

/* 1. Cuantas tablas tenemos? */
-- En la práctica 3 agregamos 2 nuevas categorias y productos_categorias
SHOW TABLES;

/* 2. Cuantos triggers tenemos */
-- 12 Por cada tabla creada deberan estar 3 trigger para poder realizar la trazabilidad de bitacora
SHOW TRIGGERS FROM db_test;

/* 3. Contabilizar el total de registro en bitacora */
SELECT count(*) FROM tb_logs;

/* 4. Contabilizar el total de productos */
SELECT COUNT(*) FROM tb_products;

/* 4.1. */
SELECT inserted_by, roles, COUNT(*) AS total_productos
FROM vw_trazabilidad_productos
GROUP BY inserted_by, roles;

SELECT * 
FROM vw_total_products_by_category
ORDER BY category_id is null;

/* 5. Contabilizar las categorias */
SELECT COUNT(*) FROM tbc_categories;

/* 6. Verificar los movientos de categorias en la bitacora */
SELECT * FROM tb_logs WHERE table_name="tbc_categories";

/* 7. Trazabilidad de Categorias */
SELECT * FROM vw_trazabilidad_categorias;

/* 8. Contabilizar cuantos productos por categoria*/
SELECT *
FROM vw_total_products_by_category
ORDER BY category_id is null;

/* 9* Trazabilidad de Categorizaciones */
SELECT * FROM vw_trazabilidad_categorizacion_productos;
SELECT * FROM vw_trazabilidad_categorias LIMIT 0, 1000;
SELECT * FROM vw_trazabilidad_productos LIMIT 0, 1000;

/* 10. Muestra los procedimientos de la base de datos  */
SHOW PROCEDURE STATUS WHERE Db = 'db_test';
