# Lighthouse D&A — Sitio web editorial

**Versión 4.2 · Páginas independientes de sección**

Sitio estático completamente editable. Mantiene la portada aprobada, el logo y el faro en alta resolución. Incorpora un artículo de prueba de lectura larga con dos gráficos SVG, una tabla, índice lateral, descargas CSV y cinco páginas de muestra adicionales.

El menú principal conecta cinco páginas: Inicio, Publicaciones, Nosotros, Equipo y Contacto. Los cuatro apartados nuevos se encuentran en `paginas/`; los artículos conservan sus rutas en `publicaciones/`.

## Ver el proyecto en VS Code

1. Descomprime `Lighthouse-DA-v4.zip`.
2. Abre la carpeta **Lighthouse-DA** en VS Code.
3. Si hace falta, instala la extensión **Live Server**.
4. Clic derecho en `index.html` → **Open with Live Server**.
5. En la portada, haz clic en la sección **Artículo de demostración** para abrir el artículo de prueba.

Puedes abrir directamente `publicaciones/inaccion-climatica.html` con Live Server. El sitio no requiere servidor de aplicaciones, bases de datos ni instalaciones de paquetes.

## Estructura

```text
Lighthouse-DA/
├── index.html                         # Portada
├── styles.css                         # Estilos de portada y elementos comunes
├── paginas.css                        # Estilos de las cuatro páginas de sección
├── site.js                            # Menú, navegación y año compartidos
├── app.js                             # Buscador derivado de las tarjetas de portada
├── publicacion.css                    # Sistema visual de lectura larga
├── publicacion.js                     # Índice adaptable, progreso del artículo y compartir
├── graficos.js                        # Datos simulados y gráficos SVG / CSV
├── paginas/
│   ├── publicaciones.html             # Catálogo: artículo destacado y cinco avances
│   ├── nosotros.html                  # Propósito, principios y método editorial
│   ├── equipo.html                    # Boceto de perfiles y áreas de trabajo
│   └── contacto.html                  # Motivos de contacto y canales por anunciar
├── publicaciones/
│   ├── inaccion-climatica.html        # Artículo completo de prueba
│   ├── productividad.html             # Página independiente (pendiente de contenido)
│   ├── instituciones.html            # Página independiente (pendiente de contenido)
│   ├── energia.html                   # Página independiente (pendiente de contenido)
│   ├── infancia.html                  # Página independiente (pendiente de contenido)
│   └── inteligencia.html              # Página independiente (pendiente de contenido)
├── assets/
│   ├── logo.svg
│   ├── hero-art.webp                  # Faro, 1448 × 1086 píxeles
│   ├── thumb-*.webp
│   └── feature-clima.webp
├── docs/
│   ├── NOTAS-DE-DISENO.md
│   ├── GUIA-PUBLICACIONES.md
│   ├── ESTRUCTURA.md                   # Rutas, navegación y organización de los HTML
│   └── REFERENCIAS.md                  # Referencias consultadas y criterio de uso
└── .gitignore
```

## Artículo de prueba

**El costo de la inacción climática en América Latina** es una prueba editorial, **no es una investigación ni un análisis basado en datos reales**. Contiene:

- Una portada de artículo con descripción, autor ficticio (equipo editorial de muestra) y tiempo estimado de lectura.
- Introducción, cinco secciones de análisis y notas metodológicas.
- **Gráfico 1**: serie temporal comparativa de pérdidas climáticas esperadas (2026–2033), en dos escenarios totalmente sintéticos.
- **Gráfico 2**: barras horizontales de pérdidas esperadas por sector para 2033, con los mismos supuestos.
- **Tabla 1**: desglose numérico por sector, cuyos totales coinciden con los valores de 2033 del gráfico 1.
- CSV descargables generados en el navegador a partir de los arreglos de `graficos.js`.
- Índice lateral, indicador de progreso, botón para copiar enlace y adaptación móvil.

Los datos no corresponden a ningún país o territorio. **Las páginas ficticias llevan `noindex`** para evitar que buscadores presenten el ejercicio como evidencia publicada. Cambia esto únicamente cuando reemplaces una página de prueba por contenido original verificado.

## ¿Qué archivo cambio?

| Quiero cambiar… | Archivo |
|---|---|
| Títulos y párrafos del artículo principal | `publicaciones/inaccion-climatica.html` |
| Tipografía, márgenes, encabezado y diseño de publicaciones | `publicacion.css` |
| Valores y series de los gráficos | `graficos.js` (`DEMO_DATA`) |
| Datos de la tabla | `publicaciones/inaccion-climatica.html` (tabla dentro de `#tabla`) |
| Texto y enlaces de tarjetas en portada | `index.html` |
| Catálogo completo de publicaciones | `paginas/publicaciones.html` |
| Propósito, equipo o contacto | El HTML correspondiente dentro de `paginas/` |
| Diseño de los apartados nuevos | `paginas.css` |
| Publicaciones que aparecen en el buscador | Tarjetas de `index.html`; `app.js` las incorpora automáticamente |
| Comportamiento del menú móvil y año del pie | `site.js` |
| Logo y faro de la portada | `assets/logo.svg`, `assets/hero-art.webp` |

Para añadir un artículo nuevo consulta **`docs/GUIA-PUBLICACIONES.md`**.

## Consideraciones técnicas

- Gráficos SVG sin bibliotecas externas: nítidos al ampliarlos y funcionando sin conexión.
- Google Fonts requiere conexión; se incluyen tipografías alternativas.
- El sitio es estático: no hay CMS, cuentas, comentarios ni guardado de contenido en un servidor.
- Los enlaces entre portada y publicaciones utilizan rutas locales relativas, válidas para Live Server y para hosting estático.
- No se ha publicado el sitio en Internet.

## Iteración de consistencia

- Portada y artículo distinguen el contenido simulado y muestran el mismo tiempo de lectura estimado (11 minutos).
- El buscador toma títulos, resúmenes y enlaces del HTML de la portada. Las palabras asociadas opcionales se agregan con `data-search-terms` en el enlace de cada tarjeta.
- El índice se mantiene a la derecha en escritorio y pasa a un desplegable antes del texto hasta los 900 px. Sin JavaScript permanece abierto.
- El progreso mide el cuerpo del artículo y se recalcula al cambiar el tamaño o terminar de cargar los recursos.
- Las imágenes de las tarjetas tienen dimensiones explícitas y carga diferida. El faro conserva su prioridad de carga.
- El menú y el año del pie de página se gestionan en un único script compartido.

Consulta `docs/REFERENCIAS.md` para conocer las referencias editoriales y los límites de la verificación de esta iteración.

## Páginas de sección

- La cabecera, el menú móvil y el pie enlazan los cinco apartados mediante HTML independientes.
- La portada conserva sus resúmenes y dirige al catálogo, a Nosotros y al Equipo mediante sus enlaces.
- Los enlaces de retorno de los artículos llevan al catálogo de `paginas/publicaciones.html`.
- Publicaciones presenta el artículo de demostración y los cinco avances; los temas enlazan a cada entrada del catálogo.
- Equipo y Contacto son bocetos: quedan pendientes los nombres, biografías, fotografías, correo y perfiles oficiales. No hay un formulario de envío ni direcciones ficticias.
- Las cuatro páginas nuevas conservan `noindex,follow` mientras se revisa su contenido inicial.

Consulta `docs/ESTRUCTURA.md` antes de cambiar rutas o agregar apartados.
