
SELECT COUNT(*) AS usuarios_estadounidenses
FROM db_test.tb_users u
INNER JOIN db_test.tb_people p
    ON u.ID = p.user_ID
WHERE u.nick LIKE 'test_USA1000_%'
  AND p.country_code = 'US';



SELECT
    COUNT(*) AS total_usuarios,
    MIN(TIMESTAMPDIFF(YEAR, p.birth_date, CURDATE()))
        AS edad_minima,
    MAX(TIMESTAMPDIFF(YEAR, p.birth_date, CURDATE()))
        AS edad_maxima
FROM db_test.tb_users u
INNER JOIN db_test.tb_people p
    ON u.ID = p.user_ID
WHERE u.nick LIKE 'test_EDAD2000_%';



SELECT
    COUNT(*) AS total_usuarios,
    SUM(u.status + 0) AS activos,
    SUM(1 - (u.status + 0)) AS inactivos,
    ROUND(100 * AVG(u.status + 0), 2)
        AS porcentaje_activos,
    ROUND(100 * AVG(1 - (u.status + 0)), 2)
        AS porcentaje_inactivos
FROM db_test.tb_users u
WHERE u.nick LIKE 'test_STATUS7222_%';
