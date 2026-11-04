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

