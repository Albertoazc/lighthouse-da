# Notas de diseño · Lighthouse D&A

- La identidad se centraliza en `src/styles/tokens.css`: azul petróleo, verde salvia, fondos claros, escala tipográfica, espacios, bordes, ancho de lectura (~68 caracteres) y ancho del sitio. Cambiar un token cambia todo el sitio.
- Tipografías: DM Serif Display para títulos y citas; DM Sans para interfaz, metadatos y subtítulos H3/H4; Source Serif 4 para el cuerpo de lectura largo (DM Serif Display no está pensada para texto corrido). Las tres se cargan desde Google Fonts con alternativas locales.
- Se conservan el logo circular con faro y la ilustración de la portada (`public/assets/hero-art.webp`, 1448 × 1086 px).
- Composición editorial: separadores finos, reglas de 2 px sobre títulos de sección, tarjetas sin bordes ni sombras, imágenes en proporciones fijas (16:9 portada de informe, 3:2 tarjetas) y animaciones mínimas que respetan `prefers-reduced-motion`.
- Informe en escritorio (≥ 1180 px): índice a la izquierda, texto al centro, lecturas relacionadas a la derecha. En tablet el índice y el lateral comparten la columna derecha; en móvil el índice es plegable sobre el texto y las lecturas pasan debajo.
- Los informes y páginas de demostración muestran un aviso visible y llevan `noindex`. No se presentan datos simulados como estadísticas reales.
- Los gráficos se elaboran fuera del sitio y se publican como PNG de 1600 × 900 px (16:9) o como HTML interactivo en un marco 16:9, con título, número y fuente puestos por la plantilla. Un único formato garantiza que todos ocupen el mismo espacio y se lean igual.
- Las portadas de los informes de demostración (`src/assets/portadas/`) son ilustraciones abstractas sin datos.
- Nosotros, Equipo y Contacto no inventan personas ni canales: Equipo se alimenta de la colección de autores y Contacto indica que los canales están pendientes.

Las referencias históricas de diseño permanecen en [REFERENCIAS.md](REFERENCIAS.md).
