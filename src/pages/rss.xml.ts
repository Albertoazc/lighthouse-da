import type { APIRoute } from 'astro';
import { sitio } from '../config/sitio';
import { todasLasPublicaciones, mapaAutores, rutaPublicacion, nombreCategoria } from '../lib/publicaciones';

const xml = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** Canal RSS 2.0 con las publicaciones públicas (sin dependencias adicionales). */
export const GET: APIRoute = async ({ site }) => {
  const base = site ?? new URL('http://localhost:4321');
  const [posts, autores] = await Promise.all([todasLasPublicaciones(), mapaAutores()]);
  const items = posts.map(post => {
    const url = new URL(rutaPublicacion(post.id), base).href;
    const autor = autores.get(post.data.author.id)?.data.name ?? sitio.nombre;
    const aviso = post.data.demo ? ' [Demostración con datos simulados]' : '';
    return `    <item>
      <title>${xml(post.data.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <description>${xml(post.data.description + aviso)}</description>
      <pubDate>${post.data.publishedAt.toUTCString()}</pubDate>
      <dc:creator>${xml(autor)}</dc:creator>
      <category>${xml(nombreCategoria(post.data.category))}</category>
${post.data.tags.map(tag => `      <category>${xml(tag)}</category>`).join('\n')}
    </item>`;
  });
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>${xml(sitio.nombre)}</title>
    <link>${base.href}</link>
    <description>${xml(sitio.descripcion)}</description>
    <language>es</language>
    <atom:link href="${new URL('/rss.xml', base).href}" rel="self" type="application/rss+xml" />
${posts[0] ? `    <lastBuildDate>${posts[0].data.publishedAt.toUTCString()}</lastBuildDate>\n` : ''}${items.join('\n')}
  </channel>
</rss>
`;
  return new Response(body, { headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' } });
};
