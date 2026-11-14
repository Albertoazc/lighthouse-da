import { getCollection, getEntry, type CollectionEntry } from 'astro:content';
import { editorial } from '../config/sitio';
import { categoria } from '../config/categorias';

export type Publicacion = CollectionEntry<'publicaciones'>;
export type Autor = CollectionEntry<'autores'>;

const porFecha = (a: Publicacion, b: Publicacion) =>
  b.data.publishedAt.getTime() - a.data.publishedAt.getTime() || a.id.localeCompare(b.id);

/** Publicaciones públicas (sin borradores), de la más reciente a la más antigua. */
export async function todasLasPublicaciones() {
  const articles = await getCollection('publicaciones', ({ data }) => !data.draft);
  return articles.sort(porFecha);
}

/** Destacada principal: la destacada más reciente o, si no hay, la última publicación. */
export function principal(posts: Publicacion[]) {
  return posts.find(p => p.data.featured) ?? posts[0];
}

export async function autores() {
  const lista = await getCollection('autores');
  return lista.sort((a, b) => a.data.order - b.data.order || a.data.name.localeCompare(b.data.name, 'es'));
}

/** Mapa id → autor, para resolver la referencia de cada publicación sin consultas repetidas. */
export async function mapaAutores() {
  return new Map((await getCollection('autores')).map(a => [a.id, a]));
}

export async function autorDe(post: Publicacion) {
  const autor = await getEntry(post.data.author);
  if (!autor) throw new Error(`La publicación «${post.id}» referencia un autor inexistente: ${post.data.author.id}.`);
  return autor;
}

export const rutaPublicacion = (id: string) => `/publicaciones/${id}/`;
export const rutaAutor = (id: string) => `/paginas/equipo/${id}/`;
export const rutaCategoria = (id: string) => `/paginas/publicaciones/categoria/${id}/`;
export const rutaEtiqueta = (etiqueta: string) => `/paginas/publicaciones/etiqueta/${slugEtiqueta(etiqueta)}/`;
export const nombreCategoria = (id: string) => categoria(id).nombre;

export function slugEtiqueta(etiqueta: string) {
  return etiqueta.toLocaleLowerCase('es').normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

/** Etiquetas públicas agrupadas por su forma de URL, con el nombre más frecuente como rótulo. */
export function etiquetas(posts: Publicacion[]) {
  const grupos = new Map<string, { slug: string; nombre: string; posts: Publicacion[] }>();
  for (const post of posts) {
    for (const tag of new Set(post.data.tags)) {
      const slug = slugEtiqueta(tag);
      const grupo = grupos.get(slug) ?? { slug, nombre: tag, posts: [] };
      if (!grupo.posts.includes(post)) grupo.posts.push(post);
      grupos.set(slug, grupo);
    }
  }
  return [...grupos.values()].sort((a, b) => b.posts.length - a.posts.length || a.nombre.localeCompare(b.nombre, 'es'));
}

export const fechaPublicacion = (fecha: Date) => fecha.toLocaleDateString('es-DO', {
  day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC',
});
export const fechaISO = (fecha: Date) => fecha.toISOString().slice(0, 10);

/**
 * Minutos de lectura: palabras del texto ÷ palabras por minuto, redondeado hacia arriba,
 * más un minuto por cada gráfico. `readingTime` lo reemplaza.
 */
export function tiempoLectura(post: Publicacion) {
  if (post.data.readingTime) return post.data.readingTime;
  const cuerpo = post.body ?? '';
  const sinBloques = cuerpo.replace(/```[\s\S]*?```/g, '');
  const figuras = sinBloques.match(/!\[[^\]]*\]\([^)]*"Gráfico \d+\./g)?.length ?? 0;
  const sinCodigo = sinBloques
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/<[^>]+>/g, ' ');
  const palabras = sinCodigo.match(/[\p{L}\p{N}][\p{L}\p{N}'’-]*/gu)?.length ?? 0;
  return Math.max(1, Math.ceil(palabras / editorial.palabrasPorMinuto) + figuras * editorial.minutosPorFigura);
}
