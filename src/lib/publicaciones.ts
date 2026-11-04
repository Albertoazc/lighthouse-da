import { getCollection } from 'astro:content';
export async function todasLasPublicaciones() {
  const articles = await getCollection('publicaciones', ({ data }) => !data.draft);
  return articles.sort((a, b) =>
    b.data.publishedAt.getTime() - a.data.publishedAt.getTime() || a.id.localeCompare(b.id)
  );
}
export const rutaPublicacion = (id: string) => `/publicaciones/${id}/`;
export const fechaPublicacion = (fecha: Date) => fecha.toLocaleDateString('es-DO', {
  day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC',
});
