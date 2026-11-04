# Arquitectura del repositorio

Astro genera un sitio estático a partir de `src/pages/`. MDX está habilitado mediante `@astrojs/mdx` en `astro.config.mjs`; no se requiere servidor de aplicación en producción.

- `src/components/`: Header, Footer, Hero, AboutBand, ClosingBand, PublicationCard y componentes de informes.
- `src/layouts/BaseLayout.astro`: documento HTML, SEO, fuentes, estilos generales y navegación compartida.
- `src/layouts/ArticleLayout.astro`: metadatos editoriales, avisos, índice automático y contenido del artículo.
- `src/content.config.ts`: colección `publicaciones` con carga de MD/MDX y validación de metadatos.
- `src/content/publicaciones/`: un informe publicado y una plantilla en borrador.
- `src/lib/publicaciones.ts`: listado público ordenado por fecha, construcción de rutas y fechas legibles.
- `src/pages/publicaciones/[slug].astro`: rutas estáticas; admite borradores solo en desarrollo.
- `src/pages/paginas/`: catálogo automático, Nosotros, Equipo y Contacto, conservando las rutas existentes.
- `src/data/`: fuente única de los datos simulados y datos de ejemplo de la plantilla.
- `src/styles/`: estilos generales, institucionales y de artículos. Los componentes de gráficos mantienen sus estilos encapsulados.
- `src/scripts/`: menú móvil, búsqueda sobre las tarjetas reales e interacciones del artículo. Astro empaqueta los módulos.
- `public/assets/`: únicamente logo, faro y miniatura económica, sin recomprimir.
- `scripts/check-site.mjs`: comprobación sin dependencias adicionales sobre los HTML compilados.
- `.github/workflows/astro-build.yml`: instalación reproducible, compilación y validación en ramas de trabajo y PR hacia `main`.

No existen importaciones `?raw` ni un renderizador alternativo de publicaciones HTML. Los originales versionados siguen en el historial de Git; no se conserva una segunda estructura activa.

Para agregar contenido consulta [GUIA-PUBLICACIONES.md](GUIA-PUBLICACIONES.md). Para el inventario de cambios y las pruebas consulta [INFORME-LIMPIEZA.md](INFORME-LIMPIEZA.md).
