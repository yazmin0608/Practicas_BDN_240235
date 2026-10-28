# Modelo EER interactivo de `db_test`

Proyecto local derivado del respaldo `Practica03/backups/Respaldo_2710.sql` (MySQL 8.0.36). La vista incluye las 25 tablas físicas y sus 226 columnas, con las 36 relaciones declaradas mediante `FOREIGN KEY`.

## Abrir y explorar

Abre `index.html` directamente en un navegador moderno. El esquema de la página está incrustado para que las funciones esenciales trabajen con `file://`, sin conexión ni servicios externos.

- Usa la rueda o `+` / `−` para el zoom; `Ajustar` encuadra el modelo.
- Arrastra el fondo para desplazarte y las tablas para reorganizarlas. `Restablecer` vuelve a la distribución inicial.
- Busca tablas y columnas; filtra por PK, FK y auditoría; oculta o muestra módulos desde el panel izquierdo.
- Selecciona una tabla para consultar sus claves, índices, restricciones CHECK y relaciones declaradas.
- Usa el botón superior para cambiar entre tema oscuro y claro.

## Conteos y criterios

Los conteos son filas `INSERT` incluidas en el archivo de respaldo, no consultas `COUNT(*)` a una base conectada. El total contabilizado es **50.811**. Un cero significa que el respaldo no contiene filas insertadas para esa tabla; no afirma que una instancia activa esté vacía.

Las relaciones se construyeron desde restricciones FK del DDL. Las tablas intermedias se identifican cuando su clave primaria está formada por columnas FK; `tb_logs` se señala como trazabilidad por sus campos de tabla, operación y fecha. Los grupos son agrupaciones técnicas por nombres y estructura de las tablas.

## Entregables

- `index.html`, `styles.css`, `script.js`: aplicación interactiva autónoma.
- `schema.json`: datos completos, restricciones, índices, relaciones, cardinalidades, conteos y objetos complementarios.
- `schema.mmd`: diagrama Mermaid editable con todas las entidades y relaciones.

La sección complementaria de `schema.json` enumera triggers, vistas, procedimientos y funciones del respaldo. No se ejecutaron sentencias SQL ni se modificó la base original. El CSV auxiliar existente en `docs` no se usó para reconstruir el esquema porque no incluye todas las columnas; las definiciones de columna se analizaron directamente desde el SQL.
