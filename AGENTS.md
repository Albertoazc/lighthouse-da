# Instrucciones para Codex — Lighthouse D&A

- Mantén la identidad visual actual: faro, logo SVG, paleta verde/azul y tipografía DM Sans / DM Serif Display.
- El código moderno está en `src/`, los recursos públicos en `public/`.
- Las publicaciones nuevas se escriben en MDX dentro de `src/content/publicaciones/`.
- No presentar datos simulados como estadísticas reales. El informe de inversión y crecimiento es una demostración y debe mantener su aviso visible y `noindex`.
- Astro es la única arquitectura activa. Los HTML antiguos se recuperan del historial de Git; no recrear una segunda versión del sitio.
- Los estilos compartidos viven en `src/styles/`, las interacciones en `src/scripts/` y los recursos públicos en `public/assets/`.
- Los borradores se excluyen de los listados y de las rutas de producción; solo se previsualizan por URL en desarrollo.
- Revisar la portada, catálogo, páginas de equipo/nosotros/contacto y artículos antes de aprobar cambios.
- Ejecutar `npm run build` antes de cada pull request. No modificar `main` sin revisión.
