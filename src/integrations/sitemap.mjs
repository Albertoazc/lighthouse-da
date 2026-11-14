import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

/**
 * Integración local de sitemap (sin dependencias). Al terminar la compilación lee las
 * páginas generadas y escribe dist/sitemap.xml, omitiendo las que llevan `noindex`
 * (demostraciones) y las páginas de error.
 */
export default function sitemap() {
  let site;
  return {
    name: 'lighthouse-sitemap',
    hooks: {
      'astro:config:done': ({ config }) => { site = config.site; },
      'astro:build:done': async ({ dir, pages, logger }) => {
        if (!site) { logger.warn('Sin `site` configurado: no se genera sitemap.xml.'); return; }
        const urls = [];
        for (const { pathname } of pages) {
          if (/^40\d\/?$/.test(pathname)) continue;
          const file = new URL(`${pathname}index.html`.replace(/^\//, ''), dir);
          let html = '';
          try { html = await readFile(fileURLToPath(file), 'utf8'); } catch { continue; }
          if (/<meta name="robots" content="[^"]*noindex/.test(html)) continue;
          const lastmod = html.match(/<meta property="article:modified_time" content="([^"]+)"/)?.[1]
            ?? html.match(/<meta property="article:published_time" content="([^"]+)"/)?.[1];
          urls.push({ loc: new URL(pathname, site).href, lastmod });
        }
        urls.sort((a, b) => a.loc.localeCompare(b.loc));
        const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls
          .map(u => `  <url><loc>${u.loc}</loc>${u.lastmod ? `<lastmod>${u.lastmod.slice(0, 10)}</lastmod>` : ''}</url>`)
          .join('\n')}\n</urlset>\n`;
        await writeFile(fileURLToPath(new URL('sitemap.xml', dir)), xml);
        logger.info(`sitemap.xml con ${urls.length} URL indexables.`);
      },
    },
  };
}
