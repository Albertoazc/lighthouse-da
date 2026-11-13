import { defineConfig } from 'astro/config';
import sitemap from './src/integrations/sitemap.mjs';
import { rehypeGraficos, rehypeTablasDesplazables } from './src/integrations/markdown.mjs';

/**
 * URL pública del sitio: se usa en canonical, Open Graph, RSS y sitemap.
 * Define SITE_URL en el entorno de despliegue (p. ej. https://www.midominio.org).
 * El valor por defecto usa el dominio reservado .example para que nunca se confunda con uno real.
 */
const SITE_URL = process.env.SITE_URL || 'https://lighthouse-da.example';

export default defineConfig({
  site: SITE_URL,
  integrations: [sitemap()],
  output: 'static',
  trailingSlash: 'always',
  markdown: {
    rehypePlugins: [rehypeGraficos, rehypeTablasDesplazables],
    shikiConfig: { theme: 'github-light' },
    remarkRehype: {
      footnoteLabel: 'Notas',
      footnoteLabelTagName: 'h2',
      footnoteBackLabel: 'Volver al texto',
    },
  },
});
