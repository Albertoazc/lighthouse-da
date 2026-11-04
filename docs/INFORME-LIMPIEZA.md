# Limpieza y consolidación de Lighthouse D&A

Fecha: 4 de noviembre de 2026. Rama de trabajo: `refactor/astro-cleanup`.

## Estado inicial y protección del trabajo

La rama inicial era `feature/migracion-astro`, sobre `47af278`, el mismo commit de `main` y `origin/main`. `.gitignore` tenía modificaciones locales y la migración Astro aún no estaba versionada. El remoto ya correspondía a `https://github.com/Albertoazc/lighthouse-da.git`.

Antes de modificar archivos se guardaron 97 archivos del estado local, incluidos los no versionados, en:

`C:\Users\alber\.codex\backups\lighthouse-da-antes-limpieza-20261104-021202.zip`

El respaldo excluye únicamente `.git/`, dependencias y carpetas generadas. No se ejecutaron reset, clean, push, merge ni commit. `main` conserva su historial y su referencia original. Los cambios permanecen sin preparar en el índice para su revisión.

## Diagnóstico y decisiones

- Astro utilizaba `src/pages/`, Content Collections y MDX, pero varias páginas insertaban fragmentos de `src/data/legacy/` mediante `?raw`.
- Existían dos copias de los estilos y los recursos públicos, además de páginas HTML antiguas y un generador de migración que podía recrear esa estructura.
- El catálogo y la portada incluían seis muestras antiguas, además del informe económico. La portada repetía publicaciones entre tarjetas y destacado.
- El gráfico climático y su script eran exclusivos de la muestra retirada. Los componentes Astro de gráficos y tablas se conservaron.
- Los recursos de `assets/` coincidían byte a byte con sus copias en `public/assets/`. Se conservaron únicamente el faro, el logo y la miniatura económica, sin modificar sus bytes.
- Las tres páginas institucionales conservan exactamente el contenido principal que tenían los HTML originales, con sus enlaces adaptados a las rutas Astro.
- Los fragmentos de portada se trasladaron a componentes Astro. No existe ya una ruta alternativa que renderice artículos HTML heredados.
- Los estilos comunes se trasladaron a `src/styles/`; se retiraron reglas cuyas clases no aparecen en componentes, contenido o scripts. Se mantuvieron los estados dinámicos del menú, búsqueda e índice.
- Los scripts activos se trasladaron a `src/scripts/` y Astro los empaqueta. La búsqueda usa las tarjetas generadas desde la colección.
- Se recuperó la navegación del pie original y se comparte su lista de enlaces con la cabecera mediante `src/data/navegacion.ts`.

## Dependencias y configuración

| Dependencia directa | Uso |
| --- | --- |
| `astro` | Páginas, compilación estática y Content Collections |
| `@astrojs/mdx` | Componentes y contenido MDX |
| `@astrojs/check` | Diagnósticos previos a la compilación |
| `typescript` | Tipos de componentes, metadatos y datos |

Todas las dependencias directas se utilizan. No se añadieron bibliotecas ni se eliminaron dependencias necesarias. Se conserva `package-lock.json`. Astro mantiene la integración MDX, salida estática y barra final en las rutas. CI usa Node 22, `npm ci`, build y comprobación del sitio.

## Sistema editorial final

Solo está publicada **«¿Más inversión significa más crecimiento?»**. El cuerpo editorial MDX completo y `src/data/inversion-simulada.ts` se compararon con el respaldo y permanecen intactos.

Los metadatos requieren título, descripción, categoría, autores, fecha, portada y minutos de lectura. `draft` toma `true` por defecto. Los listados filtran borradores; en producción tampoco se genera su ruta. En desarrollo pueden revisarse por URL directa con aviso y `noindex`.

El informe lleva una advertencia visible de datos simulados y `noindex,follow`. Mientras solo haya demostraciones publicadas, Inicio y Publicaciones también llevan `noindex`. No se añadieron datos estructurados que lo presenten como investigación oficial.

La portada muestra un solo destacado y se adapta automáticamente cuando se incorporen más archivos MDX. El catálogo consulta la misma colección. La plantilla permanece en borrador.

## Componentes reutilizables

- `Header`, `Footer`: navegación compartida, menú móvil y pie institucional.
- `Hero`, `AboutBand`, `ClosingBand`: composición original de la portada.
- `PublicationCard`: variante amplia y tarjeta de cuadrícula, con metadatos de la colección.
- `BarChart`: gráfico de barras no negativas, unidades, fuente y tabla accesible.
- `InformeLinea`: períodos y series configurables, escala automática y referencia de base opcional.
- `InformeBarras`: escala automática, valores positivos/negativos, unidades y fuente.
- `InformeTabla`: tabla de las series económicas, título, unidades y fuente configurables.
- `InformeDestacados`: indicadores configurables y etiqueta opcional de simulación.
- `InformeEstilos`: tratamiento editorial del informe MDX.
- `BaseLayout`, `ArticleLayout`: documento común y plantilla de artículos con índice generado desde los encabezados MDX.

Las líneas y tablas conservan etiquetas legibles mediante desplazamiento horizontal en pantallas pequeñas. Las barras y los indicadores se reorganizan mediante CSS responsive. La revisión visual efectiva sigue pendiente por el bloqueo del navegador descrito abajo.

## Estructura final

```text
.github/workflows/astro-build.yml
docs/
  ESTRUCTURA.md
  GUIA-PUBLICACIONES.md
  INFORME-LIMPIEZA.md
  NOTAS-DE-DISENO.md
  REFERENCIAS.md
public/assets/
  hero-art.webp
  logo.svg
  thumb-economia.webp
scripts/check-site.mjs
src/
  components/
  content/publicaciones/
    inversion-y-crecimiento-demo.mdx
    plantilla-borrador.mdx
  content.config.ts
  data/
  layouts/
  lib/
  pages/
    index.astro
    paginas/{publicaciones,nosotros,equipo,contacto}.astro
    publicaciones/[slug].astro
  scripts/
  styles/
AGENTS.md
README.md
astro.config.mjs
package.json
package-lock.json
tsconfig.json
```

## Validación

| Comprobación | Resultado |
| --- | --- |
| `npm ci --no-audit --no-fund` | Correcto: 400 paquetes instalados desde el lockfile, sin modificarlo. El primer intento encontró Rollup en uso; se detuvo el servidor de desarrollo y se repitió correctamente. |
| `npm ls --depth=0` | Correcto: las cuatro dependencias directas, sin dependencias extra ni inválidas. |
| `npm run dev -- --host 127.0.0.1` | Iniciado correctamente; las seis rutas públicas y la vista previa del borrador respondieron 200. La muestra climática respondió 404. Servidor detenido antes de reinstalar. |
| `npm run build` final | Correcto: 30 archivos revisados, cero errores, advertencias o sugerencias; seis páginas generadas. |
| `npm run test:site` | Correcto: seis páginas, 167 enlaces y recursos internos, anclas válidas, un informe por listado, dos gráficos y tabla con siete registros coincidentes con los datos. Borradores excluidos. |
| `npm run preview -- --host 127.0.0.1` | Correcto: seis rutas públicas responden 200; la plantilla y las seis publicaciones retiradas responden 404. |
| Sintaxis de los tres scripts de interfaz y `check-site.mjs` | Correcta mediante `node --check`. No sustituye una revisión de la consola real. |
| `git diff --check` y exclusiones de Git | Correctos; dependencias, compilación, caché, variables de entorno y temporales quedan ignorados. Git avisa de la conversión habitual LF/CRLF en documentos, sin errores de espacios. |
| Preservación | Cuerpo editorial MDX y datos idénticos al respaldo. Logo, faro y miniatura económica idénticos byte a byte. Contenido principal institucional conservado. |

La prueba visual no pudo completarse. El acceso automatizado a pestañas devolvió `The browser access host is unavailable`. El intento con la habilidad de control de Windows se detuvo porque no pudo determinar con seguridad la URL actual de Chrome. No se continuó la interacción con el navegador. Por ello quedan pendientes la inspección visual en escritorio/móvil, las interacciones reales del menú y búsqueda y la consola del navegador; no se presentan como pruebas aprobadas.

Los perfiles del equipo y los canales de contacto siguen en preparación, como ya indicaba el sitio; no se inventaron identidades ni direcciones. El dominio público y el despliegue no se configuran en esta limpieza.

## Preparar la revisión y GitHub

Desde la raíz del repositorio, revisa los cambios y ejecuta:

```sh
git status
npm run build
npm run test:site
git add -A
git diff --cached --stat
git diff --cached
git commit -m "refactor: consolidar Astro y limpiar publicaciones de demostración"
git push -u origin refactor/astro-cleanup
gh pr create --base main --head refactor/astro-cleanup --title "Consolidar Astro y limpiar publicaciones de demostración" --body "Consolida Astro y MDX, conserva el informe económico con datos simulados y retira la estructura heredada. Incluye documentación y comprobación de rutas, recursos, borradores y visualizaciones. Ver docs/INFORME-LIMPIEZA.md para validación y límites de la revisión visual."
```

En PowerShell usa `npm.cmd` si `npm.ps1` está bloqueado. El último comando requiere GitHub CLI (`gh`) instalada y autenticada. También puedes abrir el PR en GitHub después de subir la rama. Estos comandos se entregan para ejecución posterior; no se ha publicado ningún cambio ni se ha modificado `main`.

## Archivos eliminados (60)

- `ASTRO-MIGRACION.md`
- `LEEME-PRIMERO.md`
- `app.js`
- `assets/feature-clima.webp`
- `assets/hero-art.webp`
- `assets/logo.svg`
- `assets/thumb-ambiente.webp`
- `assets/thumb-economia.webp`
- `assets/thumb-politicas.webp`
- `assets/thumb-sociedad.webp`
- `assets/thumb-tecnologia.webp`
- `graficos.js`
- `index.html`
- `paginas.css`
- `paginas/contacto.html`
- `paginas/equipo.html`
- `paginas/nosotros.html`
- `paginas/publicaciones.html`
- `public/assets/feature-clima.webp`
- `public/assets/thumb-ambiente.webp`
- `public/assets/thumb-politicas.webp`
- `public/assets/thumb-sociedad.webp`
- `public/assets/thumb-tecnologia.webp`
- `public/paginas.css`
- `public/publicacion.css`
- `public/scripts/app.js`
- `public/scripts/graficos.js`
- `public/scripts/publicacion.js`
- `public/scripts/site.js`
- `public/styles.css`
- `publicacion.css`
- `publicacion.js`
- `publicaciones/energia.html`
- `publicaciones/inaccion-climatica.html`
- `publicaciones/infancia.html`
- `publicaciones/instituciones.html`
- `publicaciones/inteligencia.html`
- `publicaciones/productividad.html`
- `site.js`
- `src/content/publicaciones/energia.mdx`
- `src/content/publicaciones/inaccion-climatica.mdx`
- `src/content/publicaciones/infancia.mdx`
- `src/content/publicaciones/instituciones.mdx`
- `src/content/publicaciones/inteligencia.mdx`
- `src/content/publicaciones/productividad.mdx`
- `src/data/legacy/about.html`
- `src/data/legacy/articles/energia.html`
- `src/data/legacy/articles/inaccion-climatica.html`
- `src/data/legacy/articles/infancia.html`
- `src/data/legacy/articles/instituciones.html`
- `src/data/legacy/articles/inteligencia.html`
- `src/data/legacy/articles/productividad.html`
- `src/data/legacy/closing.html`
- `src/data/legacy/hero.html`
- `src/data/legacy/pages/contacto.html`
- `src/data/legacy/pages/equipo.html`
- `src/data/legacy/pages/nosotros.html`
- `src/data/legacy/pages/publicaciones.html`
- `styles.css`
- `tools/migrar_astro.py`

## Archivos modificados respecto al estado local inicial (27)

- `.github/workflows/astro-build.yml`
- `.gitignore`
- `AGENTS.md`
- `README.md`
- `docs/ESTRUCTURA.md`
- `docs/GUIA-PUBLICACIONES.md`
- `docs/NOTAS-DE-DISENO.md`
- `package.json`
- `src/components/BarChart.astro`
- `src/components/Footer.astro`
- `src/components/Header.astro`
- `src/components/InformeBarras.astro`
- `src/components/InformeDestacados.astro`
- `src/components/InformeLinea.astro`
- `src/components/InformeTabla.astro`
- `src/components/PublicationCard.astro`
- `src/content.config.ts`
- `src/content/publicaciones/inversion-y-crecimiento-demo.mdx`
- `src/content/publicaciones/plantilla-borrador.mdx`
- `src/layouts/BaseLayout.astro`
- `src/lib/publicaciones.ts`
- `src/pages/index.astro`
- `src/pages/paginas/contacto.astro`
- `src/pages/paginas/equipo.astro`
- `src/pages/paginas/nosotros.astro`
- `src/pages/paginas/publicaciones.astro`
- `src/pages/publicaciones/[slug].astro`

## Archivos nuevos respecto al estado local inicial (12)

- `scripts/check-site.mjs`
- `src/components/AboutBand.astro`
- `src/components/ClosingBand.astro`
- `src/components/Hero.astro`
- `src/data/navegacion.ts`
- `src/layouts/ArticleLayout.astro`
- `src/scripts/article.js`
- `src/scripts/search.js`
- `src/scripts/site.js`
- `src/styles/global.css`
- `src/styles/paginas.css`
- `src/styles/publicacion.css`

El inventario compara con el respaldo local previo, incluyendo archivos que entonces no estaban en Git. El propio informe de limpieza es un archivo nuevo adicional. Los traslados se reflejan como eliminación de la ubicación anterior y creación de la nueva; los recursos que ya existían en `public/assets/` se conservan allí.
