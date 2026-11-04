import assert from 'node:assert/strict';
import { readFileSync, readdirSync, existsSync, statSync } from 'node:fs';
import { resolve, relative, extname } from 'node:path';

// Comprueba la salida real de producción; no necesita un navegador ni dependencias.
const root = resolve('dist');
assert.ok(existsSync(resolve(root, 'index.html')), 'Ejecuta npm run build antes de esta comprobación.');
const walk = dir => readdirSync(dir, { withFileTypes: true }).flatMap(entry =>
  entry.isDirectory() ? walk(resolve(dir, entry.name)) : [resolve(dir, entry.name)]);
const pages = walk(root).filter(file => extname(file) === '.html');
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
  for (const match of html.matchAll(/<(a|img|script|link|source)\b[^>]*>/g)) {
    const url = attr(match[0], ['img', 'script', 'source'].includes(match[1]) ? 'src' : 'href');
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

for (const route of ['', 'paginas/publicaciones', 'paginas/nosotros', 'paginas/equipo', 'paginas/contacto']) {
  assert.ok(htmlByFile.has(resolve(root, route, 'index.html')), `Falta la ruta /${route}/.`);
}
const demoPath = resolve(root, 'publicaciones/inversion-y-crecimiento-demo/index.html');
const report = htmlByFile.get(demoPath);
assert.ok(report, 'Falta el informe económico.');
assert.match(report, /<meta name="robots" content="noindex,follow"/);
assert.match(report, /Datos 100 % simulados/);
assert.equal((report.match(/<figure class="report-figure"/g) ?? []).length, 1, 'Falta el gráfico de líneas.');
assert.equal((report.match(/<figure class="report-bars"/g) ?? []).length, 1, 'Falta el gráfico de barras.');
assert.equal((report.match(/<figure class="report-table-figure"/g) ?? []).length, 1, 'Falta la tabla.');
const table = report.match(/<table\b[^>]*>([\s\S]*?)<\/table>/)?.[1];
assert.ok(table, 'No se ha generado la tabla de datos.');
const dataSource = readFileSync('src/data/inversion-simulada.ts', 'utf8');
const records = [...dataSource.matchAll(/periodo: '([^']+)', publica: (\d+),\s+privada: (\d+),\s+actividad: (\d+)/g)];
assert.equal(records.length, 7, 'El ejercicio debe conservar sus siete registros.');
for (const [, year, ...values] of records) {
  const row = table.match(new RegExp(`<th scope="row"[^>]*>${year}<\/th>([\\s\\S]*?)<\/tr>`))?.[1];
  assert.ok(row, `Falta el año ${year} en la tabla.`);
  assert.deepEqual([...row.matchAll(/<td[^>]*>([^<]+)<\/td>/g)].map(m => m[1]), values, `Los datos de ${year} no coinciden.`);
}
const contentRoot = resolve('src/content/publicaciones');
for (const file of walk(contentRoot).filter(file => /\.mdx?$/.test(file))) {
  const metadata = readFileSync(file, 'utf8').split('---')[1];
  if (!/^draft:\s*false\s*$/m.test(metadata)) {
    const slug = relative(contentRoot, file).replaceAll('\\', '/').replace(/\.mdx?$/, '');
    assert.ok(!existsSync(resolve(root, 'publicaciones', slug)), `Se ha publicado el borrador ${slug}.`);
    for (const html of htmlByFile.values()) assert.ok(!html.includes(`/publicaciones/${slug}/`), `Hay un enlace al borrador ${slug}.`);
  }
}
for (const route of ['', 'paginas/publicaciones']) {
  const html = htmlByFile.get(resolve(root, route, 'index.html'));
  assert.equal((html.match(/href="\/publicaciones\/inversion-y-crecimiento-demo\/"/g) ?? []).length, 1, `El informe se repite o falta en /${route}/.`);
}
console.log(`Sitio verificado: ${pages.length} páginas, ${checkedLinks} enlaces y recursos internos; informe con dos gráficos y tabla de siete registros; borradores excluidos.`);
