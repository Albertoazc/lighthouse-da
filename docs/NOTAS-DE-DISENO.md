# Notas de diseño · Lighthouse D&A

- Identidad aprobada: azules petróleo, verdes salvia, fondos marfil, logo circular con faro proyectando luz.
- Portada de estilo editorial: descripción principal, cinco avances, artículo de demostración e información del proyecto.
- Ilustración principal de 1448 × 1086 píxeles. Evitar volver a sustituirla por un recorte pequeño de captura de pantalla.
- Fuentes: DM Sans (interfaz, artículos) y DM Serif Display (títulos y frases editoriales).
- Diseño de artículo: encabezado de lectura, resumen, información de autor, índice lateral, cuerpo de texto amplio, notas, citas, figuras SVG, tabla y lectura estimada.
- Las figuras y la tabla del artículo climático son una simulación explícita, no resultados publicados.
- Próximas fases: CMS o Markdown para alimentar publicaciones, páginas institucionales, autoría, imágenes propias, pruebas de accesibilidad y despliegue con SEO.

## Referencias y continuidad

- Antes de cada iteración, buscar y revisar páginas de referencia, según la preferencia del proyecto. Registrar los enlaces y el criterio aplicado en `REFERENCIAS.md`.
- Referencia principal propuesta: DataMade. Para publicaciones, adaptar su claridad de título, resumen y acceso al contenido a la identidad de Lighthouse D&A.
- Mantener la paleta, el logotipo, el faro y las familias tipográficas aprobadas durante la reorganización técnica.
- Distinguir siempre las publicaciones en preparación del artículo de demostración. Los resúmenes de la portada deben reflejar el estado y la naturaleza de los datos del artículo.

## Apartados independientes

- Inicio permanece en `index.html`; Publicaciones, Nosotros, Equipo y Contacto tienen un HTML propio dentro de `paginas/`.
- La navegación principal y del pie siempre enlaza a esas páginas. Los enlaces internos del catálogo y del índice de lectura pueden seguir usando anclas.
- Los bocetos utilizan la misma paleta, tipografías y logotipo. Sus estilos específicos se agrupan en `paginas.css`.
- En Equipo, reservar el espacio de los perfiles sin inventar personas ni trayectorias. En Contacto, indicar los canales pendientes hasta disponer de correo y redes reales.
