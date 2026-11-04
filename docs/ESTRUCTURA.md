# Estructura y navegación · Lighthouse D&A

## Apartados del menú

| Apartado | Archivo | Contenido inicial |
|---|---|---|
| Inicio | `index.html` | Presentación del proyecto, avances y artículo destacado. |
| Publicaciones | `paginas/publicaciones.html` | Catálogo con demostración y avances por tema. |
| Nosotros | `paginas/nosotros.html` | Propósito, principios y recorrido editorial. |
| Equipo | `paginas/equipo.html` | Áreas de trabajo y espacio para futuros perfiles. |
| Contacto | `paginas/contacto.html` | Motivos de contacto y canales oficiales por anunciar. |

`paginas/` agrupa los apartados principales. `publicaciones/` contiene exclusivamente los artículos individuales. Las rutas de los seis artículos existentes se conservan.

## Enlaces relativos

- Desde Inicio: `paginas/nosotros.html` o `publicaciones/inaccion-climatica.html`.
- Entre páginas de sección: `nosotros.html`, `equipo.html`, etc.
- Desde una página de sección a un artículo: `../publicaciones/inaccion-climatica.html`.
- Desde un artículo al catálogo: `../paginas/publicaciones.html`.
- Desde cualquier subcarpeta a Inicio: `../index.html`.

La navegación entre apartados utiliza enlaces HTML normales y funciona sin un enrutador de JavaScript. `site.js` controla la apertura del menú móvil y el año del pie de página.

## Elementos compartidos

- `styles.css`: identidad visual, cabecera, menú, pie y portada.
- `paginas.css`: cabeceras de sección, catálogo, principios, perfiles y contacto.
- `publicacion.css`: artículos de lectura larga.
- `site.js`: comportamiento compartido; los enlaces y la sección activa están escritos en cada HTML.
- `app.js`: buscador de la portada, construido a partir de las tarjetas de esa página.

En las páginas del menú, `aria-current="page"` identifica el enlace activo. En los artículos, `aria-current="true"` señala Publicaciones como apartado contenedor. Mantener el mismo destino en las versiones de escritorio y móvil.

Por ahora, la cabecera y el pie se escriben en cada documento para conservar el sitio estático y editable. Al cambiar un apartado, revisar los once HTML. Una siguiente fase puede incorporar plantillas compartidas.

## Datos pendientes antes de publicar

- Revisar los textos institucionales iniciales de Nosotros.
- Sustituir los espacios de Equipo por nombres, roles, biografías y fotografías autorizadas.
- Definir el correo editorial y los perfiles oficiales de Contacto.
- Reemplazar los artículos de muestra por investigaciones verificadas.
- Revisar la indexación de cada página: los bocetos y artículos de prueba mantienen `noindex,follow`.

No se necesitan instalaciones ni un proceso de compilación. Abrir `index.html` con Live Server permite recorrer todos los apartados.
