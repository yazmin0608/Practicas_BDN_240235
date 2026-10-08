/* Como vendedor necesito desactivar el producto 16*/

/* Opción 1: Desactivarlo mediante un update */
UPDATE tb_products SET status=b'0'
WHERE id = 16;

/* Opción 2: Implementar un procedimiento general para la desactivación de productos*/
CALL sp_soft_delete("tb_products", 16);

/* 1. Conectarse como superadmin */
SELECT CURRENT_ROLE();

/* 2. Que usuarios existen?*/
SELECT * FROM tb_users;

/* 3. Desactiva a uno el que quieras*/
CALL sp_soft_delete_user(3);

/* 4. Como se que si lo registro la bitacora? */
SELECT * FROM tb_logs ORDER BY ID DESC LIMIT 10;