-- =====================================================
-- PRÁCTICA 04 - VISTAS DE TRAZABILIDAD
-- BASE DE DATOS: db_test
-- ACTUALIZACIÓN: 21/11/2026
-- =====================================================
-- Caso 1: app_web@192.168.1.74
-- Casos 2-5: yazmin.esquivel@localhost


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
