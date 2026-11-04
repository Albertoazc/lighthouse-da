# Notas de diseño · Lighthouse D&A

- Mantener azul petróleo, verde salvia y fondos claros, así como el logo circular con faro.
- El faro original de `public/assets/hero-art.webp` mide 1448 × 1086 píxeles. Se conserva sin recompresión y con su composición responsive.
- Fuentes: DM Sans para interfaz y texto; DM Serif Display para títulos y frases editoriales.
- La portada conserva su cabecera, ilustración, principios, banda institucional y cierre. Una tarjeta amplia presenta la única publicación actual; no se añaden tarjetas de relleno.
- Al agregar artículos MDX, la tarjeta más reciente queda destacada y los restantes se muestran en una cuadrícula.
- El informe mantiene su narrativa, indicadores, línea de tres series, barras comparativas y tabla. Las etiquetas conservan un ancho legible mediante desplazamiento horizontal en móvil.
- Mostrar de forma visible que los datos del informe económico son simulados. No presentar la demostración como una investigación oficial; sus páginas llevan `noindex`.
- Nosotros, Equipo y Contacto son páginas Astro. Los perfiles y canales pendientes se indican expresamente, sin inventar personas ni direcciones.
- Los estilos comunes viven en `src/styles/`; el encabezado y el pie son compartidos. Las interacciones móviles se gestionan una sola vez.

Las referencias históricas de diseño permanecen en [REFERENCIAS.md](REFERENCIAS.md). Sus menciones de páginas HTML y pruebas antiguas describen fases anteriores, no la arquitectura ni la validación actuales.
