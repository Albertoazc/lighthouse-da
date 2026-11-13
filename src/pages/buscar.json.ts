import type { APIRoute } from 'astro';
import { todasLasPublicaciones, mapaAutores, rutaPublicacion, nombreCategoria, fechaPublicacion } from '../lib/publicaciones';

/** Índice estático para la búsqueda local del encabezado. Excluye borradores. */
export const GET: APIRoute = async () => {
  const [posts, autores] = await Promise.all([todasLasPublicaciones(), mapaAutores()]);
  const index = posts.map(post => ({
    title: post.data.title,
    description: post.data.description,
    category: nombreCategoria(post.data.category),
    tags: post.data.tags,
    author: autores.get(post.data.author.id)?.data.name ?? '',
    date: fechaPublicacion(post.data.publishedAt),
    url: rutaPublicacion(post.id),
  }));
  return new Response(JSON.stringify(index), { headers: { 'Content-Type': 'application/json; charset=utf-8' } });
};
