/**
 * Citas de los informes: APA 7 (en español) y BibTeX, generadas a partir de los metadatos.
 * Sin dependencias de Astro para poder probarse aislada.
 */
export interface DatosCita {
  id: string;
  titulo: string;
  fecha: Date;
  url: string;
  autor: { nombre: string; nombreCita?: string; organizacion: boolean };
  editorial: string;
  demo?: boolean;
}

const MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
const MESES_BIB = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];

/** Partes de la cita APA; el título va en cursiva al renderizar. */
export function citaAPA(d: DatosCita) {
  const autor = d.autor.nombreCita ?? d.autor.nombre;
  const fecha = `(${d.fecha.getUTCFullYear()}, ${d.fecha.getUTCDate()} de ${MESES[d.fecha.getUTCMonth()]})`;
  const tipo = d.demo ? '[Informe de demostración]' : '[Informe]';
  // APA omite la editorial cuando coincide con el autor (autor institucional).
  const editorial = d.autor.organizacion ? '' : ` ${d.editorial}.`;
  const antes = `${autor.replace(/\.$/, '')}. ${fecha}. `;
  const despues = ` ${tipo}.${editorial} ${d.url}`;
  return { antes, titulo: d.titulo, despues, texto: `${antes}${d.titulo}${despues}` };
}

const bib = (s: string) => s.replace(/([{}%&$#_])/g, '\\$1');

export function citaBibTeX(d: DatosCita) {
  const clave = `lighthouse${d.fecha.getUTCFullYear()}${d.id.replace(/[^a-z0-9]/g, '')}`.slice(0, 48);
  const autor = d.autor.organizacion ? `{${bib(d.autor.nombre)}}` : bib(d.autor.nombreCita ?? d.autor.nombre);
  return [
    `@techreport{${clave},`,
    `  author      = {${autor}},`,
    `  title       = {${bib(d.titulo)}},`,
    `  institution = {${bib(d.editorial)}},`,
    `  year        = {${d.fecha.getUTCFullYear()}},`,
    `  month       = ${MESES_BIB[d.fecha.getUTCMonth()]},`,
    `  url         = {${d.url}},`,
    ...(d.demo ? ['  note        = {Informe de demostración con datos simulados},'] : []),
    `  language    = {spanish}`,
    '}',
  ].join('\n');
}
