use db_test;
select current_role();

USE db_test;

-- Después de conectarse con el usuario AppWeb o AppMobile,
-- el usuario que por el momento es un usuario no registrado,
-- deberá crear su cuenta.

-- 1. Creación del usuario

START TRANSACTION;

INSERT INTO tb_users (
    email,
    nickname,
    password,
    status
) VALUES (
    'natalia.carrasco@example.com',
    'natalia_carrasco',
    '$2b$12$REEMPLAZAR_POR_UN_HASH_BCRYPT_REAL',
    b'1'
);

SET @user_ID = LAST_INSERT_ID();

INSERT INTO tb_people (
    user_ID,
    title,
    given_names,
    family_names,
    birth_date,
    gender_ID,
    phone,
    country_code,
    status
) VALUES (
    @user_ID,
    'Sra.',
    'Natalia',
    'Carrasco',
    '2006-05-14',
    @gender_ID,
    '5512345678',
    'MX',
    b'1'
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