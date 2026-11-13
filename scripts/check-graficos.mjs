// Valida los gráficos antes de compilar:  npm run check:graficos  (se ejecuta también en npm run build)
// Reglas en src/config/sitio.ts → graficos e interactivos. Sin dependencias: lee la cabecera PNG directamente.
import { readdirSync, readFileSync, existsSync, statSync } from 'node:fs';
import { resolve, relative, extname, basename } from 'node:path';
import { graficos, interactivos } from '../src/config/sitio.ts';

const root = resolve(graficos.carpeta);
const contenido = resolve('src/content/publicaciones');
const informes = new Set(readdirSync(contenido).filter(f => f.endsWith('.md')).map(f => f.replace(/\.md$/, '')));
const errores = [];
const rel = p => relative(process.cwd(), p).replaceAll('\\', '/');

function dimensionesPng(file) {
  const buf = readFileSync(file);
  const firma = '89504e470d0a1a0a';
  if (buf.length < 24 || buf.subarray(0, 8).toString('hex') !== firma || buf.subarray(12, 16).toString('ascii') !== 'IHDR') return null;
  return { ancho: buf.readUInt32BE(16), alto: buf.readUInt32BE(20) };
}

let total = 0;
if (existsSync(root)) {
  for (const entrada of readdirSync(root)) {
    const dir = resolve(root, entrada);
    if (!statSync(dir).isDirectory()) {
      errores.push(`${rel(dir)}: los gráficos van en una subcarpeta con el nombre del informe (${graficos.carpeta}/<informe>/archivo.png).`);
      continue;
    }
    if (!informes.has(entrada)) {
      errores.push(`${rel(dir)}: no existe src/content/publicaciones/${entrada}.md(x). La subcarpeta debe llamarse igual que el informe.`);
    }
    for (const archivo of readdirSync(dir)) {
      const ruta = resolve(dir, archivo);
      if (statSync(ruta).isDirectory()) { errores.push(`${rel(ruta)}: no se admiten subcarpetas dentro de la carpeta del informe.`); continue; }
      if (archivo.startsWith('.')) continue;
      total++;
      if (extname(archivo).toLowerCase() !== `.${graficos.formato}`) {
        errores.push(`${rel(ruta)}: formato no admitido; exporta el gráfico como ${graficos.formato.toUpperCase()}.`);
        continue;
      }
      if (!/^[a-z0-9]+(?:-[a-z0-9]+)*\.png$/.test(archivo)) {
        errores.push(`${rel(ruta)}: usa minúsculas, números y guiones en el nombre (p. ej. ${basename(archivo, extname(archivo)).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}.png).`);
      }
      const dim = dimensionesPng(ruta);
      if (!dim) { errores.push(`${rel(ruta)}: no es un PNG válido (¿extensión cambiada a mano?).`); continue; }
      if (dim.ancho !== graficos.ancho || dim.alto !== graficos.alto) {
        errores.push(`${rel(ruta)}: mide ${dim.ancho} × ${dim.alto} px; se exige ${graficos.ancho} × ${graficos.alto} px.`);
      }
    }
  }
}

// Gráficos interactivos: un .html autocontenido por gráfico en public/interactivos/<informe>/.
let totalHtml = 0;
const rootHtml = resolve(interactivos.carpeta);
if (existsSync(rootHtml)) {
  for (const entrada of readdirSync(rootHtml)) {
    const dir = resolve(rootHtml, entrada);
    if (!statSync(dir).isDirectory()) { errores.push(`${rel(dir)}: los interactivos van en ${interactivos.carpeta}/<informe>/archivo.html.`); continue; }
    if (!informes.has(entrada)) errores.push(`${rel(dir)}: no existe src/content/publicaciones/${entrada}.md. La subcarpeta debe llamarse igual que el informe.`);
    for (const archivo of readdirSync(dir)) {
      const ruta = resolve(dir, archivo);
      if (statSync(ruta).isDirectory()) { errores.push(`${rel(ruta)}: el gráfico interactivo debe ser un único archivo .html autocontenido (sin subcarpetas).`); continue; }
      totalHtml++;
      if (extname(archivo).toLowerCase() !== '.html') { errores.push(`${rel(ruta)}: solo se admiten archivos .html en esta carpeta.`); continue; }
      const kb = statSync(ruta).size / 1024;
      if (kb > interactivos.pesoMaximoKB) errores.push(`${rel(ruta)}: pesa ${Math.round(kb)} KB; el máximo es ${interactivos.pesoMaximoKB} KB.`);
      const html = readFileSync(ruta, 'utf8');
      if (/<script[^>]+src=["']https?:/i.test(html) || /<link[^>]+href=["']https?:/i.test(html)) {
        errores.push(`${rel(ruta)}: carga recursos externos; exporta el gráfico como HTML autocontenido (p. ej. Plotly con include_plotlyjs=True).`);
      }
    }
  }
}

// Las imágenes insertadas con Markdown deben tener texto alternativo (se ignoran los bloques de código).
for (const archivo of readdirSync(contenido).filter(f => f.endsWith('.md'))) {
  const texto = readFileSync(resolve(contenido, archivo), 'utf8').replace(/^(`{3,}|~{3,})[\s\S]*?^\1/gm, '');
  for (const m of texto.matchAll(/!\[\s*\]\(([^)]+)\)/g)) {
    errores.push(`src/content/publicaciones/${archivo}: la imagen ${m[1]} no tiene texto alternativo (![descripción](ruta)).`);
  }
}

if (errores.length) {
  console.error(`\n✗ Gráficos no válidos (${errores.length}):\n` + errores.map(e => `  - ${e}`).join('\n') +
    `\n\nEspecificación: ${graficos.formato.toUpperCase()} de ${graficos.ancho} × ${graficos.alto} px en ${graficos.carpeta}/<informe>/. Ver docs/GUIA-PUBLICACIONES.md.\n`);
  process.exit(1);
}
console.log(`Gráficos verificados: ${total} PNG de ${graficos.ancho} × ${graficos.alto} px y ${totalHtml} interactivo(s) HTML.`);
