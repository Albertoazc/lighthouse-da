import assert from 'node:assert/strict';
import { readFileSync, readdirSync, existsSync, statSync } from 'node:fs';
import { resolve, relative, extname } from 'node:path';

// Comprueba la salida real de producción; no necesita un navegador ni dependencias.
const root = resolve('dist');
assert.ok(existsSync(resolve(root, 'index.html')), 'Ejecuta npm run build antes de esta comprobación.');
const walk = dir => readdirSync(dir, { withFileTypes: true }).flatMap(entry =>
  entry.isDirectory() ? walk(resolve(dir, entry.name)) : [resolve(dir, entry.name)]);
// Los gráficos interactivos (dist/interactivos/) son archivos incrustados, no páginas del sitio.
const pages = walk(root).filter(file => extname(file) === '.html' && !relative(root, file).startsWith('interactivos'));
const htmlByFile = new Map(pages.map(file => [file, readFileSync(file, 'utf8')]));
const attr = (tag, name) => tag.match(new RegExp(`\\b${name}="([^"]*)"`))?.[1];
let checkedLinks = 0;
for (const [file, html] of htmlByFile) {
  const label = relative(root, file);
  assert.equal((html.match(/<h1\b/g) ?? []).length, 1, `${label}: se necesita un h1.`);
  assert.match(html, /<title>[^<]+<\/title>/, `${label}: falta título.`);
  assert.match(html, /<meta name="description" content="[^"]+"/, `${label}: falta descripción.`);
  assert.match(html, /<main\b[^>]*id="contenido"/, `${label}: falta destino del salto de navegación.`);
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
  assert.equal(new Set(ids).size, ids.length, `${label}: hay identificadores duplicados.`);
  for (const match of html.matchAll(/<(a|img|script|link|source|iframe)\b[^>]*>/g)) {
    const url = attr(match[0], ['img', 'script', 'source', 'iframe'].includes(match[1]) ? 'src' : 'href');
    if (!url || /^(?:[a-z]+:|\/\/)/i.test(url)) continue;
    const pageUrl = '/' + relative(root, file).replaceAll('\\', '/').replace(/index\.html$/, '');
    const parsed = new URL(url.replaceAll('&amp;', '&'), `https://local.invalid${pageUrl}`);
    let target = resolve(root, '.' + decodeURIComponent(parsed.pathname));
    assert.ok(!relative(root, target).startsWith('..'), `${label}: recurso fuera de dist.`);
    if (existsSync(target) && statSync(target).isDirectory()) target = resolve(target, 'index.html');
    assert.ok(existsSync(target), `${label}: enlace o recurso roto: ${url}`);
    if (parsed.hash && htmlByFile.has(target)) {
      const id = decodeURIComponent(parsed.hash.slice(1));
      assert.ok(htmlByFile.get(target).includes(`id="${id}"`), `${label}: ancla rota: ${url}`);
    }
    checkedLinks++;
  }
  assert.doesNotMatch(html, /\/publicaciones\/(?:energia|infancia|instituciones|inaccion-climatica|inteligencia|productividad)\//, `${label}: enlace a una muestra retirada.`);
}

for (const [file, html] of htmlByFile) {
  const label = relative(root, file);
  assert.match(html, /<link rel="canonical" href="https?:\/\/[^"]+"/, `${label}: falta canonical.`);
  assert.match(html, /<meta property="og:title" content="[^"]+"/, `${label}: falta Open Graph.`);
  for (const img of html.match(/<img\b[^>]*>/g) ?? []) assert.match(img, /\salt(?:="|[\s>])/,`${label}: imagen sin atributo alt.`);
}

for (const route of ['', 'paginas/publicaciones', 'paginas/nosotros', 'paginas/equipo', 'paginas/contacto', 'paginas/equipo/equipo-lighthouse']) {
  assert.ok(htmlByFile.has(resolve(root, route, 'index.html')), `Falta la ruta /${route}/.`);
}
const demoPath = resolve(root, 'publicaciones/inversion-y-crecimiento-demo/index.html');
const report = htmlByFile.get(demoPath);
assert.ok(report, 'Falta el informe económico.');
assert.match(report, /<meta name="robots" content="noindex,follow"/);
assert.match(report, /Datos 100 % simulados/);
assert.match(report, /<meta property="og:type" content="article"/, 'El informe debe declararse como artículo.');
assert.match(report, /application\/ld\+json/, 'Falta JSON-LD del informe.');
assert.match(report, /class="author-card/, 'Falta la tarjeta de autor.');
assert.match(report, /href="\/paginas\/equipo\/equipo-lighthouse\/" rel="author"/, 'El autor debe enlazar a su perfil.');
const charts = [...report.matchAll(/<figure class="grafico"[\s\S]*?<\/figure>/g)].map(m => m[0]);
assert.equal(charts.length, 2, 'El informe debe mostrar sus dos gráficos.');
for (const chart of charts) {
  assert.match(chart, /<img\b[^>]*\salt="[^"]{20,}"/, 'Cada gráfico necesita una descripción accesible.');
  assert.match(chart, /class="grafico__fuente">[^<]*Fuente/, 'Cada gráfico necesita su fuente.');
}
const table = report.match(/<div class="table-scroll"[^>]*>\s*<table\b[^>]*>([\s\S]*?)<\/table>/)?.[1];
assert.ok(table, 'No se ha generado la tabla de datos.');
const rows = [...table.matchAll(/<tr>\s*<td[^>]*>(\d{4})<\/td>/g)].map(m => m[1]);
assert.deepEqual(rows, ['2019', '2020', '2021', '2022', '2023', '2024', '2025'], 'La tabla debe conservar sus siete registros.');
const contentRoot = resolve('src/content/publicaciones');
for (const file of walk(contentRoot).filter(file => /\.md$/.test(file))) {
  const metadata = readFileSync(file, 'utf8').split('---')[1];
  if (!/^draft:\s*false\s*$/m.test(metadata)) {
    const slug = relative(contentRoot, file).replaceAll('\\', '/').replace(/\.md$/, '');
    assert.ok(!existsSync(resolve(root, 'publicaciones', slug)), `Se ha publicado el borrador ${slug}.`);
    for (const html of htmlByFile.values()) assert.ok(!html.includes(`/publicaciones/${slug}/`), `Hay un enlace al borrador ${slug}.`);
  }
}
// Cada publicación pública aparece una vez en el catálogo, con su informe, su autor y recomendaciones válidas.
const published = walk(contentRoot).filter(file => /\.md$/.test(file))
  .filter(file => /^draft:\s*false\s*$/m.test(readFileSync(file, 'utf8').split('---')[1]))
  .map(file => relative(contentRoot, file).replaceAll('\\', '/').replace(/\.md$/, ''));
assert.ok(published.length >= 2, 'Se esperan al menos dos publicaciones públicas.');
const catalogue = htmlByFile.get(resolve(root, 'paginas/publicaciones/index.html'));
let recommendations = 0;
for (const slug of published) {
  const link = `href="/publicaciones/${slug}/"`;
  assert.equal(catalogue.split(link).length - 1, 1, `«${slug}» debe aparecer una vez en el catálogo.`);
  const html = htmlByFile.get(resolve(root, 'publicaciones', slug, 'index.html'));
  assert.ok(html, `Falta la página de «${slug}».`);
  const section = html.match(/<section class="report-recommendations"[\s\S]*?<\/section>/)?.[0];
  assert.ok(section, `«${slug}» no tiene recomendaciones.`);
  const recs = [...section.matchAll(/href="\/publicaciones\/([^/"]+)\/"/g)].map(m => m[1]);
  assert.ok(recs.length >= Math.min(3, published.length - 1), `«${slug}» tiene pocas recomendaciones.`);
  assert.ok(!recs.includes(slug), `«${slug}» se recomienda a sí misma.`);
  assert.equal(new Set(recs).size, recs.length, `«${slug}» repite recomendaciones.`);
  for (const rec of recs) assert.ok(published.includes(rec), `«${slug}» recomienda una publicación no pública: ${rec}.`);
  recommendations += recs.length;
}
assert.ok(existsSync(resolve(root, 'rss.xml')), 'Falta rss.xml.');
assert.ok(existsSync(resolve(root, 'sitemap.xml')), 'Falta sitemap.xml.');
const rss = readFileSync(resolve(root, 'rss.xml'), 'utf8');
for (const slug of published) assert.ok(rss.includes(`/publicaciones/${slug}/</link>`), `«${slug}» falta en el RSS.`);
const sitemapPaths = new Set([...readFileSync(resolve(root, 'sitemap.xml'), 'utf8').matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => new URL(m[1]).pathname));
for (const [file, html] of htmlByFile) {
  const path = '/' + relative(root, file).replaceAll('\\', '/').replace(/index\.html$/, '');
  const noindex = /<meta name="robots" content="noindex/.test(html);
  assert.equal(sitemapPaths.has(path), !noindex && !/^\/40\d/.test(path), `${path}: inclusión incorrecta en el sitemap.`);
}
const searchIndex = JSON.parse(readFileSync(resolve(root, 'buscar.json'), 'utf8'));
assert.deepEqual(searchIndex.map(item => item.url).sort(), published.map(slug => `/publicaciones/${slug}/`).sort(), 'El índice de búsqueda no coincide con las publicaciones públicas.');
console.log(`Sitio verificado: ${pages.length} páginas, ${checkedLinks} enlaces y recursos internos; ${published.length} publicaciones con ${recommendations} recomendaciones válidas; RSS, sitemap y búsqueda coherentes; borradores excluidos.`);
