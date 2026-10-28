USE db_test;

-- =====================================================
-- 1. ELIMINACIÓN DE USUARIOS
-- =====================================================

DROP USER IF EXISTS 'natalia.carrasco'@'%';
DROP USER IF EXISTS 'marco.ramirez'@'%';
DROP USER IF EXISTS 'aylin.esteban'@'%';
DROP USER IF EXISTS 'uriel.valenzuela'@'%';
DROP USER IF EXISTS 'yazmin.esquivel'@'%';
DROP USER IF EXISTS 'uriel.gonzalez'@'%';
DROP USER IF EXISTS 'olaf.garcia'@'%';
DROP USER IF EXISTS 'luis.cazarez'@'%';
DROP USER IF EXISTS 'app_web'@'%';
DROP USER IF EXISTS 'app_movil'@'%';

-- =====================================================
-- 2. ELIMINACIÓN DE ROLES
-- =====================================================

DROP ROLE IF EXISTS 'superadmin';
DROP ROLE IF EXISTS 'admin';
DROP ROLE IF EXISTS 'seller';
DROP ROLE IF EXISTS 'buyer';
DROP ROLE IF EXISTS 'user_not_registered';
DROP ROLE IF EXISTS 'support';

-- =====================================================
-- 3. CREACIÓN DE USUARIOS
-- =====================================================

CREATE USER IF NOT EXISTS 'natalia.carrasco'@'%' IDENTIFIED BY '240537';
CREATE USER IF NOT EXISTS 'marco.ramirez'@'%' IDENTIFIED BY 'qwerty123';
CREATE USER IF NOT EXISTS 'aylin.esteban'@'%' IDENTIFIED BY '240853';
CREATE USER IF NOT EXISTS 'uriel.valenzuela'@'%' IDENTIFIED BY '240485';
CREATE USER IF NOT EXISTS 'yazmin.esquivel'@'%' IDENTIFIED BY '240235';
CREATE USER IF NOT EXISTS 'uriel.gonzalez'@'%' IDENTIFIED BY '240463';
CREATE USER IF NOT EXISTS 'olaf.garcia'@'%' IDENTIFIED BY '240236';
CREATE USER IF NOT EXISTS 'luis.cazarez'@'%' IDENTIFIED BY '240343';
CREATE USER IF NOT EXISTS 'app_web'@'%' IDENTIFIED BY 'Web123';
CREATE USER IF NOT EXISTS 'app_movil'@'%' IDENTIFIED BY 'Mobile890';

-- =====================================================
-- 4. CREACIÓN DE ROLES
-- =====================================================

CREATE ROLE IF NOT EXISTS 'superadmin';
CREATE ROLE IF NOT EXISTS 'admin';
CREATE ROLE IF NOT EXISTS 'seller';
CREATE ROLE IF NOT EXISTS 'buyer';
CREATE ROLE IF NOT EXISTS 'user_not_registered';
CREATE ROLE IF NOT EXISTS 'support';

-- =====================================================
-- 5. PRIVILEGIOS DE LOS ROLES
-- =====================================================


-- =====================================================
-- SUPERADMIN
-- =====================================================
GRANT ALL PRIVILEGES ON *.* TO 'superadmin' WITH GRANT OPTION;


-- =====================================================
-- ADMIN
-- =====================================================
GRANT ALL PRIVILEGES ON db_test.* TO 'admin';


-- =====================================================
-- SELLER
-- =====================================================
GRANT SELECT, INSERT, UPDATE
ON db_test.tb_products TO 'seller';

GRANT SELECT
ON db_test.tbc_categories TO 'seller';


-- =====================================================
-- BUYER
-- =====================================================
GRANT SELECT, INSERT, UPDATE
ON db_test.tb_carts TO 'buyer';

GRANT SELECT, INSERT, UPDATE
ON db_test.tbd_carts_items TO 'buyer';

GRANT SELECT, INSERT, UPDATE
ON db_test.tb_buyer_orders TO 'buyer';

GRANT SELECT, INSERT, UPDATE
ON db_test.tbd_users_wishlist_products TO 'buyer';


-- =====================================================
-- USER NOT REGISTERED
-- =====================================================
GRANT INSERT ON db_test.tb_people TO 'user_not_registered';

GRANT INSERT ON db_test.tb_users TO 'user_not_registered';

GRANT EXECUTE ON PROCEDURE db_test.sp_register_user TO 'user_not_registered';


-- =====================================================
-- SUPPORT
-- =====================================================
GRANT SELECT, UPDATE ON db_test.tb_users TO 'support';

GRANT SELECT, UPDATE ON db_test.tb_products TO 'support';

GRANT SELECT, INSERT, UPDATE ON db_test.tbc_categories TO 'support';

GRANT SELECT, INSERT, UPDATE ON db_test.tbd_products_categories TO 'support';

GRANT EXECUTE ON PROCEDURE db_test.sp_soft_delete_user TO 'support';

-- =====================================================
-- 6. ASIGNACIÓN DE ROLES A LOS USUARIOS
-- =====================================================

GRANT ALL PRIVILEGES ON *.* TO 'yazmin.esquivel'@'%' WITH GRANT OPTION;

GRANT 'superadmin' TO 'yazmin.esquivel'@'%';
GRANT 'admin' TO 'marco.ramirez'@'%';
GRANT 'support' TO 'aylin.esteban'@'%';
GRANT 'seller' TO 'natalia.carrasco'@'%';
GRANT 'seller' TO 'uriel.gonzalez'@'%';

GRANT 'user_not_registered' TO 'app_web'@'%';
GRANT 'user_not_registered' TO 'app_movil'@'%';

-- =====================================================
-- 7. ROLES POR DEFECTO
-- =====================================================

SET DEFAULT ROLE 'superadmin'
TO 'yazmin.esquivel'@'%';

SET DEFAULT ROLE 'admin'
TO 'marco.ramirez'@'%';

SET DEFAULT ROLE 'support'
TO 'aylin.esteban'@'%';

SET DEFAULT ROLE 'seller'
TO 'natalia.carrasco'@'%',
   'uriel.gonzalez'@'%';

SET DEFAULT ROLE 'user_not_registered'
TO 'app_web'@'%',
   'app_movil'@'%';

-- =====================================================
-- 8. MENSAJE DE CONFIRMACIÓN
-- =====================================================

SELECT 'Usuarios, roles y privilegios configurados'
AS mensaje;