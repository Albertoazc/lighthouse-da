// Crea un informe nuevo a partir de la plantilla:  npm run nuevo -- nombre-del-informe
// También crea su carpeta de gráficos con un PNG de ejemplo (1600 × 900) que debes reemplazar.
import { copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const slug = (process.argv[2] ?? '').trim();
if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
  console.error('Uso: npm run nuevo -- nombre-del-informe  (minúsculas, números y guiones; sin acentos ni espacios)');
  process.exit(1);
}
const dir = resolve('src/content/publicaciones');
const destino = resolve(dir, `${slug}.md`);
if (existsSync(destino) || existsSync(resolve(dir, `${slug}.md`))) {
  console.error(`Ya existe una publicación llamada «${slug}».`);
  process.exit(1);
}
const graficos = resolve('src/assets/graficos', slug);
mkdirSync(graficos, { recursive: true });
copyFileSync(resolve('src/assets/graficos/plantilla-borrador/grafico-ejemplo.png'), resolve(graficos, 'grafico-ejemplo.png'));

const hoy = new Date().toISOString().slice(0, 10);
const plantilla = readFileSync(resolve(dir, 'plantilla-borrador.md'), 'utf8')
  .replace(/^publishedAt: .*$/m, `publishedAt: ${hoy}               # AAAA-MM-DD`)
  .replace(/^draft: .*$/m, 'draft: true                           # cambia a false para publicar')
  .replaceAll('assets/graficos/plantilla-borrador/', `assets/graficos/${slug}/`);
writeFileSync(destino, plantilla);
console.log(`Creado src/content/publicaciones/${slug}.md (borrador).`);
console.log(`Carpeta de gráficos: src/assets/graficos/${slug}/ (reemplaza grafico-ejemplo.png por tus PNG de 1600 × 900 px).`);
console.log(`Vista previa: npm run dev → http://localhost:4321/publicaciones/${slug}/`);
