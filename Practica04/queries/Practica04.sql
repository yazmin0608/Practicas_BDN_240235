use db_test;

/*1. Un usuario nuevo se registra en la plataforma  (rol: user_not_registered, user de la conexion a la db: AppWeb o AppMobile) 
con sus datos personales y de cuenta de usuario*/
select current_role();

USE db_test;

/* Consulta la trazabilidad de usuarios */
select * from vw_trazabilidad_usuarios ORDER BY operation_date desc;

SELECT
    USER() AS usuario_conectado,
    CURRENT_USER() AS cuenta_autenticada,
    CAST(CURRENT_ROLE() AS CHAR) AS rol_activo;
    
    

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

/*2. El usuario creado realizara la selección de  5 productos disponibles (aproximadamente 10000) productos disponibles verificar estatus.*/
SELECT
    ID,
    SKU,
    name,
    current_price,
    current_stock,
    CAST(status AS UNSIGNED) AS estado
FROM tb_products
WHERE status = b'1'
  AND current_stock > 0
LIMIT 20;

USE db_test;

SET ROLE 'common_user';

INSERT INTO tbd_users_wishlist_products
(user_ID, product_ID, status, last_update)
VALUES
(10249, 1, b'1', NOW()),
(10249, 2, b'1', NOW()),
(10249, 3, b'1', NOW()),
(10249, 4, b'1', NOW()),
(10249, 5, b'1', NOW());

/*3. El usuario creara 1 carrito de compra*/
USE db_test;
SET ROLE 'buyer';
SELECT CAST(CURRENT_ROLE() AS CHAR) AS rol_activo;

USE db_test;
SET ROLE 'buyer';
INSERT INTO tb_carts (user_ID, status)
VALUES (10249, b'1');

/*4. El usuario agregará 5 productos con diferentes cantidades al carrito*/
USE db_test;
SET ROLE 'buyer';
SELECT CAST(CURRENT_ROLE() AS CHAR) AS rol_activo;

USE db_test;
SET ROLE 'buyer';
/**/

SELECT
    ID AS cart_ID,
    user_ID,
    CAST(status AS UNSIGNED) AS estado
FROM tb_carts
WHERE user_ID = 10249;

/**/
SELECT
    user_ID AS provider_ID,
    product_ID,
    type_ownership
FROM tbd_products_users_providers
WHERE product_ID IN (1, 2, 3, 4, 5);

/**/
USE db_test;
SET ROLE 'buyer';
SELECT
    ID AS cart_ID,
    user_ID,
    CAST(status AS UNSIGNED) AS estado
FROM tb_carts
WHERE user_ID = 10249;

/**/
USE db_test;
SET ROLE 'buyer';
INSERT INTO tbd_carts_items (
    cart_ID,
    provider_ID,
    product_ID,
    quantity
)
VALUES
(4, 2, 1, 1),
(4, 2, 2, 2),
(4, 2, 3, 3),
(4, 2, 4, 1),
(4, 2, 5, 2);

/**/
SELECT ID, user_ID
FROM db_test.tb_carts
WHERE user_ID = 10249;

/**/
USE db_test;
SET ROLE 'buyer';
SELECT
    ID AS cart_ID,
    user_ID,
    CAST(status AS UNSIGNED) AS estado
FROM tb_carts
WHERE user_ID = 10249;

/**/
SELECT
    ci.product_ID,
    p.name,
    ci.quantity,
    p.current_price,
    ci.quantity * p.current_price AS subtotal
FROM tbd_carts_items AS ci
INNER JOIN tb_products AS p
    ON ci.product_ID = p.ID
WHERE ci.cart_ID = 4;

/**/
USE db_test;
SET ROLE 'buyer';

SELECT
    ci.cart_ID,
    ci.provider_ID AS seller_ID,
    ci.product_ID,
    p.name,
    ci.quantity,
    p.current_price,
    ci.quantity * p.current_price AS subtotal
FROM tbd_carts_items AS ci
INNER JOIN tb_products AS p
    ON ci.product_ID = p.ID
WHERE ci.cart_ID = 4;

/*5. El usuario realizará la orden de compra.*/
/*Verificar orden*/
USE db_test;

SET ROLE 'buyer';

INSERT INTO tbd_carts_items (
    cart_ID,
    provider_ID,
    product_ID,
    quantity
)
VALUES
(3, 2, 1, 1),
(3, 2, 2, 2),
(3, 2, 3, 3),
(3, 2, 4, 2),
(3, 2, 5, 1);

SELECT
    cart_ID,
    provider_ID,
    product_ID,
    quantity
FROM tbd_carts_items
WHERE cart_ID = 3
ORDER BY product_ID;

USE db_test;
SET ROLE 'buyer';
SELECT
    ci.cart_ID,
    ci.provider_ID AS seller_ID,
    SUM(ci.quantity * p.current_price) AS subtotal
FROM tbd_carts_items ci
INNER JOIN tb_products p
    ON ci.product_ID = p.ID
WHERE ci.cart_ID = 3
  AND ci.provider_ID = 2
GROUP BY ci.cart_ID, ci.provider_ID;

USE db_test;
SET ROLE 'buyer';
SELECT
    ID,
    order_ID,
    seller_ID,
    subtotal,
    shipping_cost,
    fulfillment_status,
    creation_date
FROM tb_buyer_orders
WHERE seller_ID = 2
ORDER BY ID DESC;

USE db_test;
SET ROLE 'buyer';
SELECT
    ci.cart_ID,
    ci.provider_ID,
    ci.product_ID,
    p.name AS product_name,
    ci.quantity,
    p.current_price AS unit_price,
    ci.quantity * p.current_price AS subtotal
FROM tbd_carts_items ci
INNER JOIN tb_products p
    ON p.ID = ci.product_ID
WHERE ci.cart_ID = 3
  AND ci.provider_ID = 2
ORDER BY ci.product_ID;

USE db_test;
SET ROLE 'buyer';
INSERT INTO tbd_order_items (
    seller_order_ID,
    product_offer_ID,
    product_name,
    quantity,
    unit_price
)
SELECT
    1,
    ci.product_ID,
    p.name,
    ci.quantity,
    p.current_price
FROM tbd_carts_items ci
INNER JOIN tb_products p
    ON p.ID = ci.product_ID
WHERE ci.cart_ID = 3
  AND ci.provider_ID = 2
  AND ci.product_ID IN (1, 2, 3, 4, 5)
  AND NOT EXISTS (
      SELECT 1
      FROM tbd_order_items oi
      WHERE oi.seller_order_ID = 1
        AND oi.product_offer_ID = ci.product_ID
  );
  
  SELECT
    COUNT(*) AS total_productos,
    SUM(subtotal) AS total_pedido
FROM tbd_order_items
WHERE seller_order_ID = 1;

/*6. El usuario registra su domicilio para envío*/
INSERT INTO tb_user_addresses (
    user_ID,
    address_label,
    recipient_name,
    recipient_phone,
    delivery_instructions,
    is_default,
    status
)
VALUES (
    10249,
    'Casa',
    'Cliente de prueba',
    '7649876543',
    'Entregar en recepción',
    1,
    b'1'
);
/*Verificar*/
SELECT
    ID,
    user_ID,
    address_label,
    recipient_name,
    CAST(status AS UNSIGNED) AS status
FROM tb_user_addresses
WHERE user_ID = 10249;

/*Insertar*/
INSERT INTO tbd_address_components (
    address_ID,
    value,
    component_type,
    status
)
VALUES
(1, 'Calle Hidalgo', 'street', b'1'),
(1, '45', 'exterior_number', b'1'),
(1, 'Centro', 'neighborhood', b'1'),
(1, 'Xicotepec de Juarez', 'city', b'1'),
(1, 'Puebla', 'state', b'1'),
(1, '73080', 'postal_code', b'1'),
(1, 'Mexico', 'country', b'1');
/*Verificar*/
SELECT
    address_ID,
    component_type,
    value,
    CAST(status AS UNSIGNED) AS status
FROM tbd_address_components
WHERE address_ID = 1;

/*7. El usuario registrará su método de pago, para este primer caso será con tarjeta de debito , 
una cuenta simulada de 16 dígitos  (vincularlo a su tabla dependiente)*/
USE db_test;
SET ROLE 'buyer';
DESCRIBE tb_payment_methods;
DESCRIBE tbd_user_payment_methods;
SELECT * FROM tbc_payment_methods_types;
/*Registrar la tarjeta de debito simulada*/
USE db_test;
INSERT INTO tbc_payment_methods_types (
    code,
    description,
    status
)
VALUES (
    'DEBIT_CARD',
    'Tarjeta de debito',
    b'1'
);
/*Verificar que si se hizo*/
SELECT *
FROM tbc_payment_methods_types
WHERE code = 'DEBIT_CARD';

SELECT
    ID,
    table_name,
    operation,
    db_users,
    description,
    operation_date,
    CAST(operation_status AS UNSIGNED) AS operation_status
FROM tb_logs
WHERE table_name = 'tbc_payment_methods_types'
ORDER BY ID DESC;

/**/
USE db_test;
SET ROLE 'buyer';
SELECT
    ID,
    code,
    description,
    CAST(status AS UNSIGNED) AS status
FROM tbc_payment_methods_types
WHERE code = 'DEBIT_CARD';

/*S e agrgo la targeta*/
USE db_test;
SET ROLE 'buyer';
INSERT INTO tbd_user_payment_methods (
    user_ID,
    payment_method_type_ID,
    provider,
    provider_method_ref,
    label,
    last_four,
    is_default,
    status
)
VALUES (
    10249,
    2,
    'BBVA',
    'tok_test_debit_10249',
    'Tarjeta de débito BBVA',
    '9876',
    1,
    b'1'
);

/**/
SELECT *
FROM tbd_user_payment_methods
WHERE user_ID IN (10249, 10262);

SELECT *
FROM vw_trazabilidad_user_payment_methods
ORDER BY fecha_operacion DESC;

/*8. El usuario registrara un pago único  (al pagar usuario de coneccion activará el rol de "buyer")*/
USE db_test;
SET ROLE 'buyer';
SELECT
    ID,
    order_ID,
    seller_ID,
    subtotal,
    shipping_cost,
    fulfillment_status
FROM tb_buyer_orders;

SELECT
    ID,
    user_ID,
    payment_method_type_ID,
    provider,
    last_four
FROM tbd_user_payment_methods
WHERE user_ID IN (10262, 10249);

DESCRIBE tb_payments;
DESCRIBE tb_payment_transactions;

/**/
USE db_test;
SET ROLE 'buyer';
DESCRIBE tb_payments;

SELECT
    ID,
    order_ID,
    seller_ID,
    subtotal,
    shipping_cost
FROM tb_buyer_orders;

SELECT
    ID,
    user_ID,
    payment_method_type_ID,
    provider,
    last_four
FROM tbd_user_payment_methods;

/**/
USE db_test;
SET ROLE 'buyer';

SELECT
    ID,
    order_ID,
    seller_ID,
    subtotal,
    shipping_cost,
    subtotal + shipping_cost AS total_pagar
FROM tb_buyer_orders
ORDER BY ID DESC;

SELECT
    ID,
    order_ID,
    amount,
    payment_status
FROM tb_payments
ORDER BY ID DESC;

/**/
USE db_test;
SET ROLE 'buyer';

SELECT
    ID,
    order_ID,
    seller_ID,
    subtotal,
    shipping_cost,
    subtotal + shipping_cost AS total_pagar
FROM tb_buyer_orders
ORDER BY ID DESC;

/**/
INSERT INTO tb_payments (
    order_ID,
    amount,
    currency,
    payment_method,
    provider,
    provider_reference,
    payment_status
)
SELECT
    ID,
    subtotal + shipping_cost,
    'MXN',
    'Card',
    'BBVA',
    'SIM-BBVA-10249-001',
    'Pending'
FROM tb_buyer_orders
WHERE ID = 1;

/*9. El sistema registra las transacción bancaria y la autorizará*/
USE db_test;
SET ROLE 'buyer';
INSERT INTO tb_payment_transactions (
    payment_ID,
    event_type,
    amount,
    event_reference,
    remarks
)
VALUES (
    1,
    'Authorized',
    22800.00,
    'AUTH-BBVA-10249-001',
    'Autorizacion bancaria simulada del usuario 10249'
);

/**/
UPDATE tb_payments
SET payment_status = 'Authorized'
WHERE ID = 1
  AND order_ID = 1
  AND payment_status = 'Pending';

/**/
SELECT
    p.ID AS pago_ID,
    p.order_ID,
    p.amount,
    p.payment_status,
    t.event_type,
    t.event_reference
FROM tb_payments p
LEFT JOIN tb_payment_transactions t
    ON p.ID = t.payment_ID
ORDER BY p.ID DESC;

/*10. El sistema procesará la orden marcando como atendida*/
USE db_test;
SET ROLE 'buyer';

SHOW COLUMNS
FROM tb_buyer_orders
LIKE 'fulfillment_status';

/**/
USE db_test;
SET ROLE 'buyer';

UPDATE tb_buyer_orders
SET fulfillment_status = 'Accepted'
WHERE ID = 1
AND fulfillment_status = 'Pending';

SELECT
    ID,
    order_ID,
    seller_ID,
    subtotal,
    shipping_cost,
    fulfillment_status
FROM tb_buyer_orders
WHERE ID = 1;

/*11. El usuario recibirá el producto en casa*/
UPDATE tb_buyer_orders
SET fulfillment_status = 'Preparing'
WHERE ID = 1
AND fulfillment_status = 'Accepted';

UPDATE tb_buyer_orders
SET fulfillment_status = 'Sent'
WHERE ID = 1
AND fulfillment_status = 'Preparing';

UPDATE tb_buyer_orders
SET fulfillment_status = 'Delivered'
WHERE ID = 1
AND fulfillment_status = 'Sent';

SELECT
    ID,
    order_ID,
    seller_ID,
    fulfillment_status
FROM tb_buyer_orders
WHERE ID = 1;

/*Verificación final*/
USE db_test;
SET ROLE 'buyer';

SELECT
    ID,
    order_ID,
    seller_ID,
    subtotal,
    shipping_cost,
    subtotal + shipping_cost AS total,
    fulfillment_status
FROM tb_buyer_orders
WHERE ID = 1;