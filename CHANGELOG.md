# Registro de cambios

## 0.6.0 — Sistema editorial

- Informes en Markdown (`.md`) con metadatos validados (Zod) y una plantilla editorial común: encabezado, portada, índice, columna lateral, referencias, tarjeta de autor y recomendaciones.
- Colección de autores con páginas individuales; la página Equipo se genera a partir de ella.
- Recomendaciones automáticas y deterministas (`src/lib/recomendaciones.ts`), con pruebas.
- Catálogo paginado con filtros por categoría y etiqueta; búsqueda local; RSS y sitemap.
- Identidad visual centralizada en `src/styles/tokens.css`; tipografía de lectura Source Serif 4.
- Gráficos exportados fuera del sitio: PNG de 1600 × 900 px o HTML interactivo autocontenido, validados al compilar. Kit de gráficos en `analisis/`.
- Informe didáctico `como-redactar-un-informe.md` como referencia de redacción.
- Bloque «Cómo citar este informe», versión imprimible y comprobación de enlaces externos.
- Retirados: MDX, componentes de gráficos generados desde datos y `src/data/`.

## 0.5.0 — Consolidación en Astro

- Astro pasa a ser la única arquitectura activa; se retiran las páginas HTML heredadas y las muestras antiguas.
- Se conserva el informe de demostración «¿Más inversión significa más crecimiento?» con sus avisos de datos simulados.
- El detalle de esa limpieza está en el historial de Git (commit `9b9d1f3`).
