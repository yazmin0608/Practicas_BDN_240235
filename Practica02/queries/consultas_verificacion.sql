
USE db_test;

/* Verificar el total de tabla en mi base de datos*/
SHOW TABLES;

/*Verificar el total de triggers en mi base de datos*/
SHOW TRIGGERS FROM db_test;

/* 2. Cuanto triggers existen en la base de datos db_test_7b? */
SHOW TRIGGERS FROM db_test;

/* 3. Cuantos registros existen en la tabla users? */
-- Total de Usuarios
SELECT COUNT(*) AS total_registros FROM tb_users;

-- Visualizacion de los Usarios
SELECT * FROM tb_users;

-- Consulta para verificar que usuario de la base de datos ,
-- inserto a que usuario de la plataforma ecommerce, agregando el rol del SGBD */
SELECT u.nick, u.email, b.db_user AS inserted_by,
GROUP_CONCAT(DISTINCT re.FROM_USER ORDER BY re.FROM_USER SEPARATOR ', ' ) AS roles,
    b.operation_description,
    b.operation_date
FROM tb_users u
JOIN tb_logs b
    ON b.operation_description LIKE CONCAT('%', u.nick, '%')
    AND b.operation_description LIKE CONCAT('%', u.email, '%')
LEFT JOIN mysql.role_edges re
    ON re.TO_USER = SUBSTRING_INDEX(b.db_user, '@', 1)
WHERE b.table_operation = 'Create'
AND b.table_name = 'tb_users'
GROUP BY u.nick, u.email, b.db_user, b.operation_description, b.operation_date
ORDER BY b.operation_date asc;

/* Consultar los registros de los usuarios*/
SELECT * FROM tb_users;
/* Consultar los registros de la bitacora */
SELECT * FROM tb_logs;

/* Verifica los usuarios remotos creados en el servidor*/
SELECT user,host FROM mysql.user WHERE host="%";

/* Verificar los roles asignados a los usuarios remotos creados en el servidor*/
SELECT
	FROM_USER AS Rol,
    FROM_HOST AS Host_Rol,
    TO_USER AS Usuario,
    TO_HOST AS Host_Usuario
FROM mysql.role_edges
ORDER BY FROM_USER, TO_USER;