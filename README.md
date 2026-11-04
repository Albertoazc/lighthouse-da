# Lighthouse D&A

Plataforma editorial de investigación, economía y análisis de datos, construida con **Astro 5 + MDX** y salida estática. Astro es la única arquitectura activa.

La única publicación visible es **«¿Más inversión significa más crecimiento?»**. Es una demostración: todos sus datos son simulados. Conserva dos gráficos, una tabla, indicadores y explicaciones metodológicas. El informe lleva `noindex`; mientras el catálogo contenga solo demostraciones, también la portada y el catálogo llevan `noindex,follow`.

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
npm run test:site # Comprobar rutas, enlaces, borradores y figuras sobre dist/
```

Ejecuta `npm run build` antes de `npm run test:site` y antes de abrir cada pull request. `node_modules/`, `dist/`, `.astro/`, variables de entorno y resultados temporales se excluyen de Git.

## Arquitectura

```text
.github/workflows/       Compilación automática con npm ci
docs/                   Guía de publicaciones, arquitectura y revisión técnica
public/assets/          Logo SVG, faro original y portada económica
scripts/                Comprobación de la salida estática
src/
  components/           Cabecera, pie, portada, tarjetas y visualizaciones
  content/publicaciones/ Informe MDX y plantilla en borrador
  content.config.ts     Esquema de metadatos y colección de contenido
  data/                 Datos del informe y ejemplo de la plantilla
  layouts/              BaseLayout y ArticleLayout
  lib/                  Listado público, rutas y formato de fechas
  pages/                Inicio, páginas institucionales y ruta de publicaciones
  scripts/              Menú móvil, búsqueda y utilidades de lectura
  styles/               Estilos compartidos y editoriales
astro.config.mjs        MDX, salida estática y barra final en rutas
```

Los antiguos HTML, CSS y JavaScript de la raíz ya no se mantienen. Los archivos originalmente versionados pueden recuperarse del historial de Git. La limpieza también cuenta con un respaldo local del estado inicial, incluidos los archivos que todavía no estaban en Git.

## Rutas

| Sección | Ruta |
| --- | --- |
| Inicio | `/` |
| Publicaciones | `/paginas/publicaciones/` |
| Nosotros | `/paginas/nosotros/` |
| Equipo | `/paginas/equipo/` |
| Contacto | `/paginas/contacto/` |
| Informe de demostración | `/publicaciones/inversion-y-crecimiento-demo/` |

La portada y el catálogo consultan la colección; no mantienen títulos ni enlaces manuales. La fecha más reciente determina el destacado. Con una sola publicación se muestra una tarjeta amplia; con más artículos aparece también una cuadrícula.

## Publicar contenido

Copia `src/content/publicaciones/plantilla-borrador.mdx`, cambia el nombre del archivo y completa los metadatos. Consulta [la guía para autores](docs/GUIA-PUBLICACIONES.md) para insertar gráficos, tablas, fuentes y manejar borradores.

Los archivos con `draft: true` no aparecen en los listados. Se pueden revisar por su URL directa con `npm run dev`, con un aviso de borrador y `noindex`. No generan rutas con `npm run build`.

## Identidad y contenido institucional

Se conservan el logo, el faro de 1448 × 1086 píxeles, la paleta verde/azul y DM Sans / DM Serif Display. Las fuentes se cargan desde Google Fonts y disponen de alternativas locales. Equipo y Contacto señalan honestamente los perfiles y canales aún pendientes.

Consulta [la estructura](docs/ESTRUCTURA.md), [las notas de diseño](docs/NOTAS-DE-DISENO.md) y [el informe de limpieza](docs/INFORME-LIMPIEZA.md).

## Colaboración

Repositorio: <https://github.com/Albertoazc/lighthouse-da>. Trabaja en ramas y presenta un pull request hacia `main`; no modifiques `main` directamente. La integración continua instala el lockfile con `npm ci`, ejecuta `npm run build` y valida el sitio generado.
