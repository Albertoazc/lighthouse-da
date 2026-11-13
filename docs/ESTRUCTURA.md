# Arquitectura del repositorio

Astro genera un sitio estático a partir de `src/pages/`. Los informes se escriben en Markdown (`.md`); no hay servidor ni base de datos en producción. Sitemap, RSS y búsqueda se resuelven en la compilación, sin dependencias adicionales.

## Contenido y configuración

- `src/content.config.ts`: colecciones `publicaciones` y `autores`, validadas con Zod (mensajes de error en español).
- `src/content/publicaciones/`: informes `.md`, `plantilla-borrador.md` e informe didáctico `como-redactar-un-informe.md`.
- `public/interactivos/<informe>/`: gráficos interactivos (`.html` autocontenidos).
- `src/content/autores/`: un YAML por autor; los informes lo referencian por identificador.
- `src/config/categorias.ts`: lista de categorías (identificador, nombre, descripción).
- `src/config/navegacion.ts`: enlaces de la cabecera y el pie.
- `src/config/sitio.ts`: nombre del sitio, justificación del texto, tiempo de lectura, paginación y pesos de recomendación.
- `src/assets/graficos/<informe>/`: gráficos de cada informe, exportados como PNG de 1600 × 900 px (validados por `scripts/check-graficos.mjs`).
- `src/assets/`: resto de imágenes optimizadas por Astro (portadas, fotos de autor, ilustraciones).
- `public/assets/`: logo, faro de la portada y favicon (se sirven sin procesar).

## Lógica

- `src/lib/publicaciones.ts`: listado público (sin borradores), rutas, autores, etiquetas, fechas y tiempo de lectura.
- `src/lib/recomendaciones.ts`: algoritmo de recomendaciones, independiente de Astro y probado en `scripts/recomendaciones.test.mjs`.
- `src/integrations/sitemap.mjs`: genera `sitemap.xml` tras la compilación y omite páginas `noindex`.
- `src/integrations/markdown.mjs`: convierte `![…](….png|.html "Gráfico N. …")` + `*Fuente: …*` en figuras validadas (PNG o marco interactivo) y envuelve las tablas en un contenedor desplazable.

## Presentación

- `src/layouts/BaseLayout.astro`: documento HTML, SEO (canonical, Open Graph, Twitter, JSON-LD, RSS), fuentes y navegación.
- `src/layouts/ArticleLayout.astro`: plantilla de informe: encabezado, portada, índice, cuerpo, columna lateral, cierre, autor y recomendaciones.
- `src/components/`: `PublicationCard` (variantes lead/standard/compact/list), `AuthorCard`, `Catalogo`, `Pagination`, cabecera, pie y portada.
- `src/styles/tokens.css`: tokens de diseño (colores, tipografías, escala, espacios, bordes, anchos, breakpoints).
- `src/styles/global.css`, `prosa.css`, `publicacion.css`, `paginas.css`: estilos compartidos, cuerpo editorial, plantilla de informe y páginas institucionales.
- `src/scripts/`: menú móvil, búsqueda local (carga `/buscar.json` al abrirse) e índice/progreso de lectura.

## Rutas

| Ruta | Archivo |
| --- | --- |
| `/` | `src/pages/index.astro` |
| `/paginas/publicaciones/` (y `/2/`, `/3/`…) | `src/pages/paginas/publicaciones/[...page].astro` |
| `/paginas/publicaciones/categoria/<id>/` | `…/categoria/[categoria]/[...page].astro` |
| `/paginas/publicaciones/etiqueta/<tema>/` | `…/etiqueta/[etiqueta]/[...page].astro` |
| `/publicaciones/<archivo>/` | `src/pages/publicaciones/[slug].astro` |
| `/paginas/equipo/` y `/paginas/equipo/<autor>/` | `equipo.astro` y `equipo/[autor].astro` |
| `/paginas/nosotros/`, `/paginas/contacto/` | páginas estáticas |
| `/rss.xml`, `/buscar.json`, `/sitemap.xml` | endpoints e integración |

Para publicar consulta [GUIA-PUBLICACIONES.md](GUIA-PUBLICACIONES.md).
