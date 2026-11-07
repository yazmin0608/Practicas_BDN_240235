# Documentacion de la Práctica 03. Manipulacion de datos, Relaciones, Procedimientos, Funciones y Eventos en Conexiones Remotas

# Prácticas de la asignatura Optativa I: Bases De Datos en la Nube
## Ing. en Tecnologías de la Información e Innovación Digital
### Docente: M.T.I Marco A. Ramírez Hernandez
Periodo: Septiembre - Diciembre 2026

# Práctica 03 - Base de Datos `db_test`
# URL del Diccionario

---

|ID|Numero de Práctica|Nombre de la Práctica|Potenciador|Estatus|
|---|---|---|---|---|
|1.|Práctica 02|Conexión Remota en MYSQL|42|💚Concluida|
|2.|Conexiones Remotas para Bases de Datos SQL 1|Crear y administrar usuarios y privilegios para conexiones desde internet o redes locales|60|💚Concluida|
|3.|Práctica 03|Manipulación de datos en conexiones remotas|50|💚Concluida|

---

# 📚 Diccionario de Datos Actualizado

Se generó el diccionario de datos de la base de datos db_test mediante Archify, permitiendo visualizar la estructura de las tablas, atributos, tipos de datos, claves primarias, claves foráneas y relaciones existentes.

El diccionario de datos se encuentra publicado en GitHub Pages para su consulta.

### 🔗 Enlace al Diccionario de Datos y Modelo Entidad-Relación Extendido (EER)

**[📖 Consultar Diccionario de Datos Actualizado y Modelo Entidad-Relación Extendido (EER)](  https://yazmin0608.github.io/Practicas_BDN_240235/)**

# Promt de la creación del diccionario junto con la creación de la entidad relación
# PROMPT MAESTRO PROFESIONAL PARA ARCHIFY
## Sistema interactivo de documentación, diccionario de datos y modelo entidad-relación extendido (EER) — MySQL 8.0

### 1. ROL Y OBJETIVO DEL AGENTE

Actúa como un **Arquitecto Senior de Bases de Datos, Ingeniero de Software Full Stack, Especialista en Ingeniería Inversa de MySQL 8.0, Analista de Datos y Diseñador UI/UX Senior**, con experiencia en documentación técnica, modelado entidad-relación extendido y desarrollo de aplicaciones web interactivas.

Tu misión es analizar exhaustivamente un respaldo SQL real y construir una **plataforma web profesional, visualmente atractiva, completamente interactiva y funcional**, que permita explorar, comprender, analizar y documentar la arquitectura completa de la base de datos.

El resultado debe parecer una plataforma profesional de administración y exploración de esquemas de bases de datos, con una experiencia visual comparable a herramientas modernas de ingeniería de software.

**El producto final debe ser una aplicación web de una sola página (SPA), autocontenida en un único archivo `index.html`, preparada para ejecutarse localmente y publicarse posteriormente mediante GitHub Pages.**

No generes únicamente documentación estática. Construye una herramienta interactiva de análisis y consulta.

---

### 2. CONFIGURACIÓN DE RUTAS

**Archivo SQL de origen:**

`C:\Users\Yazmin Ariana\OneDrive\Documentos\CUATRIMESTRE 7\Optativa I. Bases De Datos En La Nube\7A-IDGDS\Practicas_BDN_240235\Practica03\backups\Respaldo_2810.sql`

**Archivo HTML de destino:**

`C:\Users\Yazmin Ariana\OneDrive\Documentos\CUATRIMESTRE 7\Optativa I. Bases De Datos En La Nube\7A-IDGDS\Practicas_BDN_240235\Practica03\docs\DiccionarioModeloER\index.html`

Utiliza estas rutas como referencias principales.

Verifica primero que el respaldo exista y que sea accesible mediante las herramientas autorizadas del entorno.

Si existen restricciones de acceso, identifica el mecanismo disponible para leer el archivo. No inventes su contenido ni sustituyas los datos por ejemplos ficticios.

No modifiques el respaldo SQL original.

Crea los directorios de destino únicamente cuando sea necesario.

---

### 3. REQUISITOS DE ARQUITECTURA

La solución debe cumplir estrictamente con las siguientes condiciones:

- Un único archivo final denominado `index.html`.
- HTML5, CSS3 y JavaScript integrados.
- Sin backend.
- Sin bases de datos adicionales.
- Sin instalación de paquetes.
- Sin necesidad de ejecutar Node.js.
- Sin procesos de compilación.
- Sin servidores locales obligatorios.
- Compatible con Chrome, Microsoft Edge y Firefox.
- Compatible con GitHub Pages.
- Compatible con apertura local mediante `file://`.
- Diseño adaptable a computadoras, tabletas y dispositivos móviles.

Se permite utilizar bibliotecas mediante CDN, tales como:

- React 18 UMD y ReactDOM.
- Babel Standalone, cuando sea necesario.
- Tailwind CSS mediante CDN.
- Lucide Icons.
- D3.js o una biblioteca de diagramación compatible con navegador.
- Chart.js para estadísticas y gráficas.

Todas las dependencias utilizadas deben ser compatibles entre sí.

**Importante:** El uso de CDN implica que las bibliotecas externas requieren conexión a Internet, aunque no se necesite servidor local. Si se desea funcionamiento completamente sin conexión, integra las dependencias indispensables dentro del mismo HTML.

No utilices imports que requieran resolución mediante Node.js, Vite, Webpack o un servidor de desarrollo.

Los datos extraídos del respaldo deberán integrarse dentro del HTML como estructuras JavaScript o JSON embebidas.

---

### 4. VALIDACIÓN Y ANÁLISIS DEL RESPALDO SQL

Analiza íntegramente el archivo `Respaldo_2810.sql`, respetando la sintaxis de MySQL 8.0.

La base de datos tiene los siguientes valores esperados:

| Objeto | Cantidad esperada |
|---|---:|
| Tablas físicas | 25 |
| Triggers | 72 |
| Vistas | 28 |

Estas cantidades constituyen criterios de validación, no valores que deban imponerse artificialmente.

Identifica y extrae:

1. Nombre real de la base de datos.
2. Todas las tablas físicas.
3. Todas las columnas y sus definiciones.
4. Claves primarias y foráneas.
5. Relaciones explícitas e inferidas.
6. Índices simples, compuestos y únicos.
7. Restricciones de integridad.
8. Triggers y sus instrucciones.
9. Vistas y sus consultas.
10. Procedimientos almacenados.
11. Funciones almacenadas.
12. Tipos de datos y dominios.
13. Dependencias entre objetos.
14. Registros presentes en el respaldo.
15. Información de auditoría y trazabilidad.

Analiza instrucciones como:

- `CREATE DATABASE`
- `CREATE TABLE`
- `ALTER TABLE`
- `INSERT INTO`
- `REPLACE INTO`
- `CREATE VIEW`
- `CREATE TRIGGER`
- `CREATE PROCEDURE`
- `CREATE FUNCTION`
- `CREATE INDEX`
- `CONSTRAINT`
- `FOREIGN KEY`
- `CHECK`
- `DELIMITER`

Reconoce los comentarios, definiciones multilínea, identificadores escapados y delimitadores personalizados.

No utilices expresiones regulares simples como único mecanismo para interpretar estructuras SQL complejas. Emplea un analizador robusto o una estrategia de análisis sintáctico que preserve correctamente las definiciones.

**No ejecutes instrucciones SQL destructivas ni modifiques la base de datos.**

Si los conteos no coinciden con los valores esperados, muestra los valores reales y documenta las diferencias.

---

### 5. EXPERIENCIA VISUAL Y DISEÑO PROFESIONAL

Diseña una interfaz moderna, elegante y académicamente presentable.

Utiliza una identidad visual inspirada en plataformas profesionales de análisis de datos y desarrollo de software.

**Estilo visual solicitado:**

- Diseño tipo dashboard empresarial.
- Menú lateral colapsable.
- Barra superior fija.
- Tarjetas estadísticas.
- Paneles interactivos.
- Bordes redondeados y sombras sutiles.
- Tipografía moderna y legible.
- Iconografía consistente.
- Colores profesionales: azul marino, azul tecnológico, violeta suave, blanco y gris.
- Estados visuales diferenciados para claves, relaciones y restricciones.
- Animaciones discretas y fluidas.
- Microinteracciones al seleccionar, expandir o filtrar.
- Indicadores de navegación.
- Diseño responsive.

Implementa dos temas:

**Modo claro:** fondo claro, tarjetas blancas y elementos de alto contraste.

**Modo oscuro:** fondo oscuro, tarjetas diferenciadas y conexiones visuales luminosas.

Incluye un interruptor de tema y conserva la preferencia del usuario mediante `localStorage` cuando esté disponible.

Respeta las preferencias del sistema para movimiento reducido y accesibilidad.

No utilices animaciones excesivas que reduzcan el rendimiento.

---

### 6. ESTRUCTURA PRINCIPAL DE LA APLICACIÓN

Organiza la aplicación mediante las siguientes secciones:

1. Inicio y presentación del proyecto.
2. Dashboard general.
3. Explorador de tablas.
4. Diccionario de datos.
5. Clasificación de atributos.
6. Dominios y notación formal.
7. Modelo EER interactivo.
8. Explorador de relaciones.
9. Documentación de triggers.
10. Documentación de vistas.
11. Índices y restricciones.
12. Registros y estadísticas.
13. Dependencias y trazabilidad.
14. Conclusiones técnicas.
15. Exportación de documentación.

Todas las secciones deben estar integradas en una misma aplicación, sin recargar la página.

La navegación debe ser fluida y bidireccional.

Por ejemplo, seleccionar una tabla en el modelo EER debe permitir abrir su diccionario de datos, consultar sus triggers, visualizar sus relaciones y conocer las vistas que dependen de ella.

---

### 7. DASHBOARD ESTADÍSTICO INTERACTIVO

Construye un panel inicial que presente el estado general del esquema.

Incluye tarjetas dinámicas con:

- Número real de tablas.
- Número real de triggers.
- Número real de vistas.
- Total de columnas.
- Total de claves primarias.
- Total de claves foráneas.
- Total de índices.
- Total de relaciones.
- Total de registros verificables.
- Total de procedimientos y funciones almacenadas.

Los valores deben calcularse a partir del análisis real del respaldo.

Incluye gráficas interactivas para:

- Distribución de registros por tabla.
- Distribución de triggers por evento.
- Distribución de triggers BEFORE y AFTER.
- Tipos de datos más utilizados.
- Tablas con mayor cantidad de relaciones.
- Tablas con mayor cantidad de columnas.
- Distribución de índices y restricciones.

Al seleccionar una tarjeta o segmento de gráfica, debe abrirse automáticamente la sección correspondiente con los filtros aplicados.

Incluye un indicador de integridad documental que compare los objetos esperados con los encontrados.

No presentes cifras estáticas como si fueran datos actualizados en tiempo real.

Identifica claramente que las estadísticas corresponden a la **fecha y contenido del respaldo analizado**.

---

### 8. DICCIONARIO DE DATOS INTERACTIVO

Construye un explorador completo de las 25 tablas esperadas.

La interfaz debe incluir:

- Buscador instantáneo por nombre de tabla.
- Filtros por categoría o función.
- Ordenamiento alfabético.
- Ordenamiento por cantidad de columnas.
- Ordenamiento por número de registros.
- Vista en tarjetas y vista tabular.
- Panel de detalles expandible.
- Navegación directa al modelo EER.

Al seleccionar una tabla, muestra:

**Información general:**

- Nombre exacto.
- Descripción funcional detallada.
- Propósito dentro del sistema.
- Número de columnas.
- Cantidad verificable de registros.
- Clave primaria.
- Claves foráneas.
- Índices.
- Restricciones.
- Relaciones entrantes y salientes.
- Triggers asociados.
- Vistas dependientes.

**Información por columna:**

| Propiedad | Descripción |
|---|---|
| Posición | Orden dentro de la tabla |
| Nombre | Identificador exacto |
| Descripción | Función del atributo |
| Tipo SQL | Tipo de dato |
| Longitud | Tamaño permitido |
| Precisión | Precisión numérica |
| Escala | Cantidad de decimales |
| Nulabilidad | NULL / NOT NULL |
| Default | Valor predeterminado |
| PK | Clave primaria |
| FK | Clave foránea |
| UNIQUE | Restricción de unicidad |
| CHECK | Regla de validación |
| AUTO_INCREMENT | Generación automática |
| Dominio | Conjunto de valores permitidos |
| Clasificación | Tipo conceptual del atributo |
| Naturaleza | Cualitativa o cuantitativa |
| Notación | Representación formal |

Cada columna debe poder expandirse mediante un clic para visualizar su composición técnica y conceptual.

Agrega colores e iconos para distinguir:

- Claves primarias.
- Claves foráneas.
- Atributos obligatorios.
- Atributos opcionales.
- Atributos únicos.
- Atributos con valores predeterminados.
- Atributos derivados, cuando estén sustentados.

Incluye un botón para copiar el nombre de la columna y otro para copiar su definición SQL.

---

### 9. CLASIFICACIÓN CONCEPTUAL Y FORMAL DE ATRIBUTOS

Analiza los atributos desde la perspectiva del modelo entidad-relación.

Clasifica cuando corresponda:

- Simples.
- Compuestos.
- Monovaluados.
- Multivaluados.
- Derivados.
- Almacenados.
- Obligatorios.
- Opcionales.
- Identificadores.
- No identificadores.

Incluye también:

**Naturaleza cualitativa:**

- Nominal.
- Ordinal.

**Naturaleza cuantitativa:**

- Discreta.
- Continua.

**Dominio formal:**

- Tipo de dato.
- Longitud.
- Rango permitido.
- Valores válidos.
- Restricciones.
- Nulabilidad.
- Formato esperado.

**Notación formal:**

Representa los atributos mediante una notación consistente y documentada, por ejemplo:

`usuario_ID : INTEGER, PK, NOT NULL`

`email : VARCHAR(255), UNIQUE, NOT NULL`

`fecha_registro : DATETIME, DEFAULT CURRENT_TIMESTAMP`

No confundas tipos de almacenamiento con clasificaciones conceptuales.

Cuando una clasificación no pueda determinarse directamente desde el SQL, indícala como inferencia y proporciona una justificación.

No inventes atributos multivaluados, compuestos o derivados cuando no exista evidencia suficiente.

---

### 10. MODELO ENTIDAD-RELACIÓN EXTENDIDO (EER) INTERACTIVO

Esta es una de las funcionalidades principales y debe recibir especial atención.

Construye un lienzo visual interactivo donde se representen las tablas y sus relaciones.

**Requisitos obligatorios de interacción:**

- Arrastrar entidades libremente.
- Zoom mediante rueda del mouse.
- Botones de acercamiento y alejamiento.
- Desplazamiento del lienzo.
- Centrado automático.
- Ajustar todas las entidades a pantalla.
- Reorganización automática.
- Restablecimiento de posiciones.
- Selección individual de entidades.
- Selección de relaciones.
- Resaltado de conexiones.
- Expansión y contracción de atributos.
- Panel lateral de información contextual.
- Navegación al diccionario de datos.
- Búsqueda de entidades dentro del diagrama.
- Ocultar y mostrar tablas.
- Filtrar relaciones.
- Modo de pantalla completa cuando sea compatible.

**Cada entidad debe mostrar:**

- Nombre exacto.
- Cantidad de columnas.
- Cantidad de registros verificables.
- Clave primaria.
- Claves foráneas.
- Atributos.
- Tipos de datos.
- Restricciones principales.

Al seleccionar una entidad, resalta sus relaciones directas y atenúa visualmente las entidades no relacionadas.

Al seleccionar una relación, muestra:

- Tabla origen.
- Tabla destino.
- Columnas participantes.
- Tipo de relación.
- Cardinalidad.
- Opcionalidad.
- Restricción referencial.
- Acciones ON DELETE y ON UPDATE, cuando existan.

Utiliza notación **Crow's Foot** para representar las cardinalidades.

Distingue claramente las relaciones explícitas mediante claves foráneas de aquellas inferidas por nombres o convenciones.

No presentes relaciones inferidas como restricciones confirmadas.

**Animaciones solicitadas:**

- Movimiento fluido de entidades.
- Transiciones al seleccionar.
- Expansión suave de atributos.
- Resaltado progresivo de conexiones.
- Efectos de enfoque.
- Transiciones al aplicar filtros.
- Movimiento coordinado de las líneas con las entidades.

Las líneas deben permanecer conectadas correctamente durante el arrastre y el zoom.

Utiliza SVG o una biblioteca gráfica apropiada para implementar las conexiones.

No generes un diagrama decorativo ni una imagen estática.

El diagrama debe ser realmente manipulable.

---

### 11. MODOS DE VISUALIZACIÓN DEL EER

Implementa al menos cuatro modos:

**Modo general:** muestra todas las entidades y relaciones.

**Modo detallado:** muestra atributos, tipos, claves y restricciones.

**Modo enfocado:** muestra una entidad seleccionada y sus dependencias directas.

**Modo simplificado:** muestra únicamente nombres de entidades y conexiones principales.

Incluye un selector visible para cambiar de modo sin recargar la aplicación.

Añade una leyenda interactiva para interpretar símbolos, colores, cardinalidades y tipos de relaciones.

Incluye una opción para exportar el diagrama como SVG o PNG, siempre que la implementación permita generar un archivo válido.

---

### 12. DOCUMENTACIÓN INTERACTIVA DE LOS 72 TRIGGERS

Construye un módulo especializado de exploración de triggers.

Documenta todos los triggers encontrados en el respaldo.

Para cada uno incluye:

- Nombre exacto.
- Tabla asociada.
- Evento.
- Momento de ejecución.
- Descripción funcional.
- Objetivo.
- Condiciones.
- Tablas afectadas.
- Operaciones realizadas.
- Dependencias.
- Código SQL original.
- Explicación técnica de su funcionamiento.

Incluye un editor visual de código de solo lectura con:

- Resaltado de sintaxis SQL.
- Numeración de líneas.
- Copiar código.
- Expandir y contraer.
- Búsqueda dentro del código.

**Filtros interactivos:**

- Nombre.
- Tabla.
- INSERT.
- UPDATE.
- DELETE.
- BEFORE.
- AFTER.

Incluye una matriz de triggers por tabla que permita identificar rápidamente los eventos implementados.

Al seleccionar un trigger, debe existir una opción para navegar a la tabla asociada y visualizarla en el EER.

Cuando corresponda, muestra gráficamente el flujo:

`Evento SQL → Trigger → Validación/Operación → Tabla afectada`

No inventes resultados de ejecución.

---

### 13. DOCUMENTACIÓN INTERACTIVA DE LAS 28 VISTAS

Crea un explorador profesional de vistas SQL.

Cada vista debe incluir:

- Nombre exacto.
- Descripción funcional.
- Propósito.
- Código SQL de creación.
- Columnas resultantes.
- Tipos de datos, cuando puedan determinarse.
- Tablas utilizadas.
- Vistas utilizadas.
- Dependencias directas.
- Funciones y expresiones relevantes.
- Filtros y agrupaciones.
- Relaciones con otros objetos.

Implementa:

- Buscador por nombre.
- Filtro por tabla de origen.
- Vista de código SQL.
- Visualización de dependencias.
- Navegación hacia las tablas involucradas.

Genera un diagrama de dependencias donde sea posible seleccionar una vista y observar las tablas y otras vistas que intervienen en su definición.

Si una vista utiliza tablas de sistema, como `mysql.role_edges`, represéntalas como dependencias externas, sin confundirlas con tablas físicas propias del esquema.

---

### 14. EXPLORADOR DE RELACIONES Y TRAZABILIDAD

Implementa un módulo para estudiar las conexiones entre los objetos.

Debe permitir consultar:

- Relaciones entre tablas.
- Relaciones de uno a uno.
- Relaciones de uno a muchos.
- Relaciones de muchos a muchos mediante tablas intermedias.
- Claves foráneas.
- Dependencias de vistas.
- Dependencias de triggers.
- Objetos de auditoría.
- Tablas de bitácora.
- Operaciones de trazabilidad.

Para cada relación muestra su evidencia técnica.

Incluye un mapa visual de dependencias con filtros para seleccionar el tipo de objeto.

Permite abrir directamente el detalle del elemento seleccionado.

---

### 15. CONTEO DE REGISTROS DEL RESPALDO

Analiza los datos presentes en el archivo SQL.

Obtén los registros verificables de cada tabla considerando las instrucciones de inserción y las operaciones que puedan modificar el estado de los datos.

**No confundas el número de instrucciones INSERT con el número de filas insertadas.**

Considera inserciones múltiples, escapes, valores especiales y otras particularidades sintácticas.

Si el respaldo contiene instrucciones cuya ejecución modifica o elimina registros, evita declarar un conteo exacto sin poder determinar el estado final.

Clasifica los resultados como:

- Conteo exacto verificable.
- Conteo calculado a partir del respaldo.
- Conteo estimado.
- Conteo no determinable.

Muestra claramente la metodología utilizada.

No afirmes que los registros son datos actuales de un servidor MySQL activo.

Son registros correspondientes al respaldo analizado.

---

### 16. BUSCADOR GLOBAL INTELIGENTE

Implementa una búsqueda global que funcione en toda la aplicación.

Debe permitir encontrar:

- Tablas.
- Columnas.
- Triggers.
- Vistas.
- Relaciones.
- Índices.
- Restricciones.
- Procedimientos.
- Funciones.

Incluye sugerencias automáticas y resultados agrupados por categoría.

Cada resultado debe permitir navegar directamente al objeto correspondiente.

La búsqueda debe actualizarse conforme el usuario escribe, sin recargar la página.

Incluye mensajes claros cuando no existan coincidencias.

---

### 17. INTERACTIVIDAD AVANZADA

Agrega las siguientes funcionalidades siempre que sean compatibles con la arquitectura de un solo archivo:

**Panel de detalles contextual:** al seleccionar cualquier objeto, muestra información técnica y enlaces relacionados.

**Filtros combinados:** permite aplicar varios filtros simultáneamente.

**Navegación contextual:** desde una tabla debe ser posible acceder a sus relaciones, vistas y triggers.

**Rutas de navegación:** indica la sección y el objeto seleccionado.

**Comparación de tablas:** permite seleccionar dos tablas y comparar columnas, tipos de datos, claves y restricciones.

**Persistencia visual:** conserva tema, preferencias de visualización y posiciones del EER mediante almacenamiento local cuando sea posible.

**Ayuda interactiva:** incorpora una guía breve para aprender a utilizar el explorador.

**Estados vacíos y errores:** muestra mensajes informativos en lugar de pantallas en blanco.

**Accesibilidad:** implementa navegación mediante teclado, etiquetas accesibles y contraste suficiente.

No agregues botones decorativos que carezcan de funcionalidad.

---

### 18. EXPORTACIÓN Y DOCUMENTACIÓN

Implementa opciones para:

- Imprimir el documento completo.
- Exportar a PDF mediante el sistema de impresión del navegador.
- Imprimir el diccionario de datos.
- Imprimir la documentación de triggers.
- Imprimir la documentación de vistas.
- Exportar el modelo EER como SVG o PNG cuando sea técnicamente viable.
- Copiar definiciones SQL.

Utiliza `window.print()` y estilos específicos `@media print`.

El documento impreso debe tener:

- Portada profesional.
- Índice.
- Encabezados.
- Secciones ordenadas.
- Tablas legibles.
- Saltos de página apropiados.
- Diagramas correctamente dimensionados.
- Fecha de generación.
- Identificación del respaldo analizado.

El modo de impresión debe ocultar menús, botones y controles que no formen parte del documento.

No dependas de capturas de pantalla de baja resolución para imprimir las tablas del diccionario.

---

### 19. RENDIMIENTO Y OPTIMIZACIÓN

La aplicación debe seguir funcionando fluidamente con:

- 25 tablas.
- 72 triggers.
- 28 vistas.
- Todas las columnas.
- Todas las relaciones.
- Código SQL extenso.

Optimiza:

- Renderizado del diagrama.
- Búsquedas.
- Filtros.
- Animaciones.
- Actualización de conexiones.
- Manejo de eventos.
- Expansión de paneles.
- Memoria del navegador.

Evita renderizados completos innecesarios al mover una entidad.

Utiliza estructuras de datos normalizadas y referencias por identificador.

Mantén separadas conceptualmente la capa de datos, la lógica de análisis y los componentes visuales, aunque todo se entregue en un único HTML.

---

### 20. INTEGRIDAD Y TRAZABILIDAD DE LA INFORMACIÓN

Toda la información técnica debe proceder del respaldo SQL.

Distingue entre:

**Información confirmada:** obtenida directamente de instrucciones SQL.

**Información inferida:** deducida mediante nombres, relaciones o patrones documentados.

**Información no disponible:** no puede determinarse con certeza.

Las descripciones funcionales pueden redactarse mediante interpretación técnica, pero deben identificarse como inferidas cuando no estén explícitamente documentadas.

No inventes:

- Tablas.
- Triggers.
- Vistas.
- Columnas.
- Claves.
- Relaciones.
- Registros.
- Restricciones.
- Procedimientos.
- Funciones.

Si detectas inconsistencias, presenta un reporte de validación.

---

### 21. COMPATIBILIDAD CON GITHUB PAGES

El archivo debe quedar preparado para publicarse posteriormente en GitHub Pages.

Requisitos:

- No utilizar rutas absolutas locales para recursos web.
- No depender de un backend.
- No utilizar conexiones directas a MySQL.
- No incluir credenciales.
- No requerir archivos SQL externos.
- No depender de archivos JSON adicionales.
- No utilizar llamadas `fetch()` a archivos locales.
- Mantener todos los datos necesarios embebidos en `index.html`.

La aplicación debe funcionar tanto al abrir el HTML localmente como al acceder a su URL de GitHub Pages, siempre que las dependencias CDN estén disponibles.

No configures ni modifiques GitHub Pages en esta tarea.

**Advertencia de seguridad:** antes de incrustar los datos en el HTML, revisa si el respaldo contiene contraseñas, hashes, tokens, datos personales u otra información sensible. No publiques esos valores. Sustitúyelos por información estructural o estadística anonimizada cuando corresponda y documenta las exclusiones.

---

### 22. PRUEBAS FUNCIONALES OBLIGATORIAS

Antes de finalizar, realiza una validación integral.

Comprueba:

1. El respaldo SQL fue analizado completamente.
2. Los conteos reales fueron contrastados con los esperados.
3. Todas las tablas detectadas están documentadas.
4. Todos los triggers detectados están documentados.
5. Todas las vistas detectadas están documentadas.
6. Las columnas conservan sus nombres y tipos originales.
7. Las relaciones explícitas están representadas correctamente.
8. Las relaciones inferidas están identificadas.
9. El EER permite arrastrar entidades.
10. El zoom funciona.
11. Las conexiones permanecen unidas al mover las entidades.
12. Los paneles de atributos se expanden correctamente.
13. El buscador global funciona.
14. Los filtros funcionan.
15. La navegación entre módulos funciona.
16. El cambio de tema funciona.
17. Los conteos de registros tienen una metodología verificable.
18. Las gráficas muestran datos reales del respaldo.
19. La impresión genera un documento legible.
20. La aplicación funciona mediante `file://`.
21. La aplicación es compatible con GitHub Pages.
22. No existen errores JavaScript que impidan su funcionamiento.
23. No hay botones inactivos presentados como funcionales.
24. El diseño se adapta a diferentes tamaños de pantalla.
25. Los datos sensibles no quedan expuestos accidentalmente.

Si no dispones de un navegador o de herramientas de prueba, realiza las validaciones estáticas posibles e indica expresamente cuáles no pudieron verificarse.

No declares como probada una funcionalidad que no hayas ejecutado o comprobado.

---

### 23. CRITERIOS DE CALIDAD Y ACEPTACIÓN

El proyecto será considerado completo únicamente cuando:

- La aplicación tenga una presentación profesional.
- Los datos sean fieles al respaldo.
- El diccionario sea completo y navegable.
- El EER sea interactivo y funcional.
- Las relaciones se visualicen correctamente.
- Los triggers y vistas estén documentados.
- Existan filtros y buscadores funcionales.
- El dashboard refleje estadísticas verificables.
- Las animaciones sean fluidas.
- La navegación esté integrada.
- La impresión sea legible.
- El HTML sea autónomo respecto de archivos locales adicionales.
- La aplicación pueda prepararse para publicación en GitHub Pages.

**Prioriza exactitud técnica, funcionalidad real y estabilidad por encima de efectos visuales decorativos.**

---

### 24. ENTREGABLE FINAL

Genera exactamente el siguiente archivo:

`C:\Users\Yazmin Ariana\OneDrive\Documentos\CUATRIMESTRE 7\Optativa I. Bases De Datos En La Nube\7A-IDGDS\Practicas_BDN_240235\Practica03\docs\DiccionarioModeloER\index.html`

Este archivo debe contener:

- La estructura HTML.
- Todos los estilos CSS.
- La lógica JavaScript.
- Los componentes interactivos.
- Los datos documentales extraídos del SQL.
- Los diagramas y sus conexiones.
- Los módulos de consulta.
- Las gráficas estadísticas.
- Las funciones de búsqueda y filtrado.
- Los controles de navegación.
- Los mecanismos de impresión y exportación.

No entregues múltiples archivos HTML ni una estructura de proyecto que requiera compilación.

Al finalizar, presenta un informe con:

1. Ruta del archivo generado.
2. Nombre de la base de datos.
3. Total de tablas encontradas.
4. Total de triggers encontrados.
5. Total de vistas encontradas.
6. Total de columnas y relaciones.
7. Estado de verificación del conteo de registros.
8. Funcionalidades implementadas.
9. Pruebas realizadas.
10. Limitaciones o inconsistencias encontradas.

---

### 25. INSTRUCCIÓN FINAL DE EJECUCIÓN

**Comienza analizando el respaldo SQL real. Después construye la aplicación completa.**

No sustituyas el trabajo por una explicación conceptual, una maqueta visual, pseudocódigo ni instrucciones para que otra persona programe el sistema.

No generes datos ficticios para completar las cantidades esperadas.

No omitas objetos para simplificar el resultado.

No reduzcas el modelo EER a una imagen estática.

No entregues botones sin comportamiento.

No declares funcionalidades como terminadas si todavía no funcionan.

Si una funcionalidad presenta problemas, corrígela y vuelve a comprobarla antes de concluir.

El resultado esperado es una **plataforma profesional de ingeniería inversa, documentación y exploración interactiva de bases de datos MySQL 8.0**, totalmente integrada en un único archivo HTML.

**Objetivo definitivo: transformar `Respaldo_2810.sql` en una herramienta académica y técnica de alta calidad, que permita comprender visualmente la estructura, relaciones, atributos, triggers, vistas y comportamiento documentado de la base de datos.**

