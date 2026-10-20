-- 1. ELIMINACIÓN DE USUARIOS
DROP USER IF EXISTS 'natalia.carrasco'@'%';
DROP USER IF EXISTS 'marco.ramirez'@'%';
DROP USER IF EXISTS 'aylin.esteban'@'%';
DROP USER IF EXISTS 'uriel.valenzuela'@'%';
DROP USER IF EXISTS 'yazmin.esquivel'@'%';
DROP USER IF EXISTS 'uriel.gonzalez'@'%';
DROP USER IF EXISTS 'luis.cazarez'@'%';
DROP USER IF EXISTS 'olaf.gutierrez'@'%';
DROP USER IF EXISTS 'olaf.gutierres'@'%';

-- 2. ELIMINACIÓN DE ROLES
DROP ROLE IF EXISTS 'superadmin';
DROP ROLE IF EXISTS 'admin';
DROP ROLE IF EXISTS 'seller';
DROP ROLE IF EXISTS 'buyer';
DROP ROLE IF EXISTS 'user_not_registered';
DROP ROLE IF EXISTS 'support';

-- 3. CREACIÓN DE USUARIOS REMOTOS
CREATE USER 'natalia.carrasco'@'%' IDENTIFIED BY '240853';
CREATE USER 'marco.ramirez'@'%' IDENTIFIED BY 'qwerty123';
CREATE USER 'aylin.esteban'@'%' IDENTIFIED BY '240853';
CREATE USER 'uriel.valenzuela'@'%' IDENTIFIED BY '240485';
CREATE USER 'yazmin.esquivel'@'%' IDENTIFIED BY '240235';
CREATE USER 'uriel.gonzalez'@'%' IDENTIFIED BY '240463';
CREATE USER 'olaf.gutierres'@'%' IDENTIFIED BY '240236';



FLUSH PRIVILEGES;

-- 4. CREACIÓN DE ROLES
CREATE ROLE 'superadmin';
CREATE ROLE 'admin';
CREATE ROLE 'seller';
CREATE ROLE 'buyer';
CREATE ROLE 'user_not_registered';
CREATE ROLE 'support';

-- 5. ASIGNACIÓN DE PRIVILEGIOS A LOS ROLES
/* SUPERADMIN */
GRANT ALL PRIVILEGES ON *.* TO 'superadmin' WITH GRANT OPTION;

/* ADMIN */
GRANT ALL PRIVILEGES ON db_test.* TO 'admin';

/* SELLER */
GRANT SELECT, INSERT, UPDATE ON db_test.tb_products TO 'seller';
GRANT SELECT 
ON db_test.tbc_categories
TO 'seller';

/*Buyer*/
GRANT SELECT, INSERT, UPDATE
ON db_test.tb_carts
TO 'buyer';

GRANT SELECT, INSERT, UPDATE
ON db_test.tbd_carts_items
TO  'buyer';

GRANT SELECT, INSERT, UPDATE
ON db_test.tb_buyer_orders
TO  'buyer';

GRANT SELECT, INSERT, UPDATE
ON db_test.tbd_users_wishlist_products
TO  'buyer';


/* SUPPORT */
GRANT SELECT, UPDATE ON db_test.tb_users TO 'support';
GRANT SELECT, UPDATE ON db_test.tb_products TO 'support';
GRANT SELECT, INSERT, UPDATE ON db_test.tbc_categories TO 'support';
GRANT SELECT , INSERT, UPDATE ON db_test.tbd_products_categories TO 'support';
GRANT EXECUTE ON PROCEDURE db_test.sp_soft_delete_user TO 'support';

-- 6. ASIGNACIÓN DE ROLES Y PRIVILEGIOS DIRECTOS A USUARIOS
GRANT ALL PRIVILEGES ON *.* TO 'yazmin.esquivel'@'%' WITH GRANT OPTION;

-- Asignación de Roles (Únicamente a los usuarios que llevan rol)
GRANT 'superadmin' TO 'yazmin.esquivel'@'%';
GRANT 'admin' TO 'marco.ramirez'@'%';
GRANT 'support' TO 'aylin.esteban'@'%'; 
GRANT 'seller' TO 'natalia.carrasco'@'%';
GRANT 'seller' TO 'uriel.gonzalez'@'%';

-- 7. ACTIVACIÓN DE ROLES POR DEFECTO
SET DEFAULT ROLE 'superadmin' TO 'yazmin.esquivel'@'%';
SET DEFAULT ROLE 'admin' TO 'marco.ramirez'@'%';
SET DEFAULT ROLE 'support' TO 'aylin.esteban'@'%';
SET DEFAULT ROLE 'seller' TO 'natalia.carrasco'@'%', 'uriel.gonzalez'@'%';

FLUSH PRIVILEGES;

-- 8. MENSAJE DE CONFIRMACIÓN
SELECT "Los usuarios y privilegios han sido creados correctamente" AS mensaje;