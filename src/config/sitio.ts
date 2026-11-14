/**
 * Configuración editorial central de Lighthouse D&A.
 * Cambia aquí los ajustes globales del sitio; ninguna publicación necesita repetirlos.
 * La identidad visual (colores, tipografías, espacios) vive en src/styles/tokens.css.
 */
export const sitio = {
  nombre: 'Lighthouse D&A',
  lema: 'Ideas que iluminan.',
  descripcion: 'Investigación, análisis de datos y publicaciones basadas en evidencia sobre economía, políticas públicas y mercados.',
  idioma: 'es',
  locale: 'es_DO',
  /** Imagen por defecto para compartir páginas sin portada propia (ruta pública). */
  imagenSocial: '/assets/hero-art.webp',
} as const;

export const editorial = {
  /** `true` justifica el cuerpo de todos los informes (con separación silábica). */
  justificarTexto: false,
  /** Palabras por minuto para calcular el tiempo de lectura. */
  palabrasPorMinuto: 200,
  /** Minutos extra por cada gráfico ("Gráfico N. …") del informe. */
  minutosPorFigura: 1,
  /** Publicaciones por página en el catálogo y en los listados por categoría o etiqueta. */
  publicacionesPorPagina: 12,
} as const;

/**
 * Especificación obligatoria de los gráficos de los informes.
 * Los gráficos se elaboran fuera del sitio (Python, R, Excel, Datawrapper…) y se exportan como imagen.
 * La compilación falla si un archivo de src/assets/graficos/ no cumple estas reglas.
 */
export const graficos = {
  carpeta: 'src/assets/graficos',
  formato: 'png',
  ancho: 1600,
  alto: 900,
} as const;

/**
 * Gráficos interactivos: un archivo .html autocontenido por gráfico (sin servicios externos),
 * en public/interactivos/<informe>/. Se muestran en un marco 16:9 aislado del resto de la página.
 */
export const interactivos = {
  carpeta: 'public/interactivos',
  ruta: '/interactivos',
  pesoMaximoKB: 5000,
} as const;

export const recomendaciones = {
  /** Número de recomendaciones al final del informe (entre 3 y 4). */
  alFinal: 4,
  /** Número de elementos en cada bloque de la columna lateral. */
  enLateral: 3,
  /** Pesos del algoritmo de afinidad (ver src/lib/recomendaciones.ts). */
  pesos: { etiqueta: 3, categoria: 2, autor: 1 },
} as const;
