# Lighthouse D&A

Plataforma editorial de investigación, economía y análisis de datos, construida con **Astro 5** y salida estática; los informes se escriben en Markdown. Astro es la única arquitectura activa.

Cada informe es un archivo Markdown (`.md`) con metadatos validados; la plantilla editorial, la portada, el catálogo, las páginas de autor, las recomendaciones, la búsqueda, el RSS y el sitemap se generan automáticamente.

Las tres publicaciones visibles son **demostraciones** (`demo: true`): llevan aviso visible y `noindex`. Mientras todo el catálogo sea de demostración, la portada y el catálogo también llevan `noindex,follow`.

## Ejecutar el proyecto

Se recomienda Node.js 22 LTS con npm. Las versiones reproducibles están en `package-lock.json`.

```sh
npm ci
npm run dev
```

Abre la dirección que muestra Astro, normalmente `http://localhost:4321/`. En PowerShell, si la política de ejecución bloquea `npm.ps1`, usa `npm.cmd` en lugar de `npm`; no necesitas cambiar la política del sistema.

```sh
npm run check    # Tipos y diagnósticos de Astro
npm run build    # Diagnósticos y compilación de producción
npm run preview  # Servir dist/ para revisar la versión de producción
npm run test:site # Comprobar rutas, enlaces, recomendaciones, borradores, RSS y sitemap sobre dist/
npm run test:unit # Probar el algoritmo de recomendaciones
npm run check:graficos # Validar formato y tamaño de los gráficos (también se ejecuta en build)
npm run nuevo -- mi-informe  # Crear un informe en borrador a partir de la plantilla
```

Ejecuta `npm run build` antes de `npm run test:site` y antes de abrir cada pull request. `node_modules/`, `dist/`, `.astro/`, variables de entorno y resultados temporales se excluyen de Git.

## Arquitectura

Consulta [docs/ESTRUCTURA.md](docs/ESTRUCTURA.md). En resumen: contenido en `src/content/` (publicaciones y autores), configuración editorial en `src/config/sitio.ts`, categorías en `src/config/categorias.ts`, gráficos en `src/assets/graficos/<informe>/` (PNG de 1600 × 900 px) y `public/interactivos/<informe>/` (HTML), validados al compilar, identidad visual en `src/styles/tokens.css`, plantilla de informe en `src/layouts/ArticleLayout.astro` y recomendaciones en `src/lib/recomendaciones.ts`.

Los antiguos HTML, CSS y JavaScript de la raíz ya no se mantienen; pueden recuperarse del historial de Git.

### URL del sitio

Canonical, Open Graph, RSS y sitemap necesitan la URL pública. Defínela en el entorno de compilación del despliegue:

```sh
SITE_URL=https://www.tudominio.org npm run build
```

Sin `SITE_URL` se usa `https://lighthouse-da.example` (dominio reservado, solo para desarrollo).

## Rutas

| Sección | Ruta |
| --- | --- |
| Inicio | `/` |
| Publicaciones (paginado) | `/paginas/publicaciones/` |
| Categoría / etiqueta | `/paginas/publicaciones/categoria/<id>/`, `/paginas/publicaciones/etiqueta/<tema>/` |
| Informe | `/publicaciones/<archivo>/` |
| Equipo / autor | `/paginas/equipo/`, `/paginas/equipo/<autor>/` |
| Nosotros, Contacto | `/paginas/nosotros/`, `/paginas/contacto/` |
| RSS, sitemap | `/rss.xml`, `/sitemap.xml` |

## Publicar contenido

`npm run nuevo -- mi-informe`, completa los metadatos, escribe y cambia `draft: false` cuando esté revisado. El informe didáctico `/publicaciones/como-redactar-un-informe/` muestra cada elemento con su código y su resultado. La [guía de publicaciones](docs/GUIA-PUBLICACIONES.md) explica campos, imágenes, gráficos, autores, categorías y recomendaciones.

Los archivos con `draft: true` (valor por defecto) no aparecen en listados, recomendaciones, búsqueda, RSS ni sitemap, y no generan rutas en producción. Se pueden revisar por su URL directa con `npm run dev`.

## Identidad y contenido institucional

Se conservan el logo, el faro de 1448 × 1086 píxeles, la paleta verde/azul y DM Sans / DM Serif Display; Source Serif 4 se añade para el cuerpo de lectura. Las fuentes se cargan desde Google Fonts y disponen de alternativas locales. Equipo y Contacto señalan honestamente los perfiles y canales aún pendientes.

Consulta [la estructura](docs/ESTRUCTURA.md), [las notas de diseño](docs/NOTAS-DE-DISENO.md) y [el registro de cambios](CHANGELOG.md).

## Colaboración

Repositorio: <https://github.com/Albertoazc/lighthouse-da>. Trabaja en ramas y presenta un pull request hacia `main`; no modifiques `main` directamente. La integración continua instala el lockfile con `npm ci`, ejecuta `npm run build` y valida el sitio generado.
