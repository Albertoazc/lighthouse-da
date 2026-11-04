# Referencias editoriales · Lighthouse D&A

Consulta: 24 de octubre de 2026.

Antes de cada iteración, buscar y revisar páginas de referencia. Registrar qué patrón se considera útil y cómo se adapta al proyecto. Conservar la identidad de Lighthouse D&A.

## DataMade · Referencia principal

- [Portada](https://datamade.us/).
- [Listado de publicaciones](https://datamade.us/blog/).
- [Publicación sobre Chicago Community Dashboard](https://datamade.us/blog/ccdb-data-tool-local-change-makers/).

Patrones consultados: presentación de trabajos y artículos con título, resumen y enlace de lectura; encabezado de artículo con autoría, resumen y estado temporal; contenido dividido en secciones descriptivas.

Aplicación en esta iteración: etiquetas coherentes en portada, resumen fiel a los datos simulados y acceso claro al artículo de demostración. Las tarjetas conservan la composición visual existente. No se incorporaron textos ni recursos de DataMade.

## Our World in Data · Lectura y transparencia de datos

- [CO₂ and Greenhouse Gas Emissions](https://ourworldindata.org/co2-and-greenhouse-gas-emissions).
- [Preguntas frecuentes sobre fuentes y reutilización](https://ourworldindata.org/faqs).

Patrones consultados: navegación por secciones, integración de explicaciones y gráficos, identificación de fuentes y acceso a datos.

Aplicación en esta iteración: mantener accesible el índice en móvil y conservar la tabla HTML, las notas metodológicas y las descargas CSV del ejercicio.

## The Pudding · Referencia para futuras narrativas

- [Recursos sobre narrativa y visualización](https://pudding.cool/resources/).

Patrón consultado: comenzar por una pregunta y organizar la historia visual después del análisis. Se conserva como referencia para próximas publicaciones; esta iteración no introduce animaciones ni narrativas ligadas al desplazamiento.

## Alcance y verificación

Las referencias se revisaron a través de su contenido web. La revisión visual en Chrome no pudo completarse: la herramienta de control se detuvo al no poder identificar de forma segura la URL del navegador. La validación visual de escritorio y móvil queda pendiente.

Las correcciones locales se comprueban mediante análisis de HTML y ejecución de los scripts con un DOM de prueba. Estas comprobaciones no sustituyen la revisión visual en navegador.

## Segunda iteración · Apartados independientes

Referencias consultadas el 24 de octubre de 2026:

- [DataMade · Blog](https://datamade.us/blog/): catálogo con títulos, resúmenes y acceso a cada publicación. Se adapta a un destacado y una lista de avances por tema.
- [DataMade · About Us](https://datamade.us/about-us/): presentación institucional, explicación del trabajo y enlaces para conocer al equipo. Se adapta al propósito y los principios editoriales de Lighthouse D&A.
- [DataMade · Team](https://datamade.us/team/): introducción y perfiles con funciones y biografías. El boceto reserva espacios sin atribuir identidades ficticias.
- [DataMade · Contact](https://datamade.us/contact-us): invitación directa y canales de contacto. El boceto indica que el correo y las redes oficiales están por anunciar.

Se crearon cuatro HTML en `paginas/` y estilos propios en `paginas.css`. La portada mantiene su composición e incorpora enlaces hacia los apartados nuevos. Las referencias orientan la estructura; los textos e imágenes de DataMade no se reutilizan.

La comprobación de navegadores disponibles devolvió una lista vacía. Se validan la estructura HTML, las rutas de navegación y las respuestas del servidor local; la revisión visual en escritorio y móvil permanece pendiente.
