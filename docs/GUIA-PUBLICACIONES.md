# Guía práctica: publicar un artículo en Lighthouse D&A

## 1. Crear el archivo de artículo

Duplica `publicaciones/inaccion-climatica.html` y ponle un nombre corto, sin tildes ni espacios, por ejemplo `publicaciones/inversion-infraestructura.html`.

Actualiza dentro del documento:
- `<title>` en `<head>` y la descripción meta.
- Categoría, etiqueta editorial, `<h1>`, resumen y nombre de autor.
- Secciones dentro de `<article class="article-body">`. Utiliza `<h2>` para capítulos, `<h3>` para subsecciones y `<p>` para texto.
- Enlaces en el índice lateral `.toc` para que apunten a los nuevos `id` de secciones.
- Tiempo estimado de lectura, tanto en la publicación como en su tarjeta de portada.

Conserva `site.js` antes de los scripts específicos de la página. El menú móvil y el año del pie dependen de ese archivo compartido.

El índice utiliza `<details class="toc" open>` y un `<summary>`. Debe ir antes de `<article>` dentro de `.article-layout`: en escritorio CSS lo coloca a la derecha y en móvil aparece antes del texto. Sin JavaScript queda abierto.

Al publicar contenido real, **elimina** `<meta name="robots" content="noindex,follow">`, agrega una fecha de publicación real (por ejemplo `<time datetime="2026-10-24">24 de octubre de 2026</time>`) y añade fuentes y atribuciones verificables.

## 2. Crear gráficos reutilizando el sistema

El ejemplo contiene gráficos generados en `graficos.js`, sin Chart.js ni dependencias. Los datos residen en el objeto `DEMO_DATA`.

El primer gráfico utiliza `years`, `withoutAdaptation` y `withAdaptation`. El segundo utiliza `sectors` con `sector`, `without` y `with`.

Para otra publicación, puedes copiar y modificar `graficos.js`, asignarle un nombre propio (por ejemplo `grafico-infraestructura.js`) y enlazarlo únicamente en ese archivo HTML. De esa forma, los artículos no compartirán por accidente las mismas series.

Inserta las gráficas en el HTML con un bloque `figure`, título (`h3`), contenedor (`div`) y explicación (`figcaption`). Es importante que cada gráfico incluya unidad, período, fuente y la explicación necesaria para interpretar los valores.

En el artículo de prueba se usan los siguientes contenedores:

```html
<div id="chart-evolucion" class="chart-container" role="img"
     aria-label="Descripción del contenido del gráfico"></div>
```

> Importante: cuando cambies los datos, cambia también las descripciones de accesibilidad y actualiza la tabla del mismo documento. Actualmente la tabla se escribe en HTML para que siga siendo legible sin JavaScript.

## 3. Agregar el enlace en la portada

El catálogo completo está en `paginas/publicaciones.html`. Agrega allí una entrada `.archive-item` y utiliza una ruta `../publicaciones/nombre-del-articulo.html`. La portada puede incluir una selección del catálogo; los títulos, estados y resúmenes deben coincidir cuando un artículo aparece en ambos lugares.

Abre `index.html`. Cada tarjeta contiene un enlace como este:

```html
<a class="card-button" href="publicaciones/productividad.html">
  ...miniatura y descripción...
</a>
```

Modifica el título, el resumen, la categoría y la ruta. El nombre del archivo debe coincidir con la URL. El buscador incorpora automáticamente los enlaces `.card-button` y `.latest-post` de la portada, tomando el título de `h3`, la categoría de `.category` y el resumen de `.card-summary` o del párrafo de `.latest-content`.

Si necesitas palabras asociadas que no aparecen en el texto, añade `data-search-terms="clima calentamiento"` al enlace de la tarjeta. El buscador consulta este catálogo visible, no el texto completo de cada artículo.

Incluye las dimensiones reales (`width` y `height`) y `loading="lazy" decoding="async"` en las imágenes de las tarjetas. No apliques carga diferida a la ilustración principal del faro.

## 4. Diseño editorial

- `styles.css`: estilos globales, menú, portada y tarjetas.
- `publicacion.css`: diseño de lectura larga, cuadros, gráficos, tablas, móvil e impresión.
- `paginas.css`: catálogo y páginas de Nosotros, Equipo y Contacto.
- Variables CSS al inicio de `styles.css`: paleta y fuentes.
- Se usan **DM Sans** (texto general) y **DM Serif Display** (títulos).

Evita gráficos exportados como capturas de pantalla si tienes los datos. El SVG, con dimensiones mediante `viewBox`, se mantiene nítido al hacer zoom y permite descargar cifras originales en CSV.

## 5. Lista de verificación antes de publicar

- ¿Los números y las unidades están verificados?
- ¿La tabla y los gráficos contienen los mismos datos?
- ¿La fuente, la fecha y la metodología son claras?
- ¿Se distingue evidencia empírica de simulaciones y opiniones?
- ¿La página tiene metadatos de buscadores actualizados y una URL definitiva?
- ¿Los enlaces funcionan en computador y móvil?
- ¿Se retiraron las etiquetas 'demostración', solo si ya son reemplazadas por contenido real?

La portada y los artículos son ahora una buena base para incorporar más adelante un CMS o generar el sitio automáticamente desde Markdown.
