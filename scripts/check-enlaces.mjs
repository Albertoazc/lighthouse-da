// Comprueba los enlaces externos de informes y autores:  npm run check:enlaces
// No forma parte de `npm run build` (depende de la red y de servidores ajenos); se ejecuta a mano
// y cada semana en GitHub Actions (.github/workflows/enlaces.yml). Sin dependencias.
import { readdirSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const TIEMPO_MAXIMO = 15_000;
const SIMULTANEOS = 4;
const AGENTE = 'Mozilla/5.0 (compatible; LighthouseDA-ComprobadorEnlaces/1.0)';

const fuentes = [
  ...readdirSync('src/content/publicaciones').filter(f => f.endsWith('.md')).map(f => `src/content/publicaciones/${f}`),
  ...readdirSync('src/content/autores').filter(f => /\.ya?ml$/.test(f)).map(f => `src/content/autores/${f}`),
];

/** url → archivos donde aparece */
const enlaces = new Map();
for (const archivo of fuentes) {
  const texto = readFileSync(resolve(archivo), 'utf8').replace(/^(`{3,}|~{3,})[\s\S]*?^\1/gm, '');
  const urls = [
    ...[...texto.matchAll(/\]\((https?:\/\/[^\s)]+)/g)].map(m => m[1]),            // [texto](url)
    ...[...texto.matchAll(/^\s*(?:url|-\s*url):\s*"?(https?:\/\/[^\s"]+)"?/gm)].map(m => m[1]), // metadatos
  ];
  for (const url of urls) {
    const limpia = url.replace(/[.,;]+$/, '');
    if (/\/\/(?:example\.(?:org|com)|localhost|lighthouse-da\.example)/.test(limpia) || limpia.includes('…')) continue;
    if (!enlaces.has(limpia)) enlaces.set(limpia, new Set());
    enlaces.get(limpia).add(archivo);
  }
}

async function comprobar(url) {
  for (const metodo of ['HEAD', 'GET']) {
    const control = new AbortController();
    const temporizador = setTimeout(() => control.abort(), TIEMPO_MAXIMO);
    try {
      const r = await fetch(url, { method: metodo, redirect: 'follow', signal: control.signal, headers: { 'user-agent': AGENTE, accept: 'text/html,*/*' } });
      if (metodo === 'HEAD' && [403, 405, 501].includes(r.status)) continue; // algunos servidores no aceptan HEAD
      return { estado: r.status };
    } catch (e) {
      if (metodo === 'GET') return { error: e.name === 'AbortError' ? 'tiempo de espera agotado' : (e.cause?.code ?? e.message) };
    } finally {
      clearTimeout(temporizador);
    }
  }
  return { error: 'sin respuesta' };
}

const lista = [...enlaces.keys()];
const resultados = new Map();
let siguiente = 0;
await Promise.all(Array.from({ length: SIMULTANEOS }, async () => {
  while (siguiente < lista.length) {
    const url = lista[siguiente++];
    resultados.set(url, await comprobar(url));
  }
}));

const rotos = [], avisos = [];
for (const [url, r] of resultados) {
  const donde = [...enlaces.get(url)].join(', ');
  if (r.error || r.estado === 404 || r.estado === 410 || r.estado >= 500) rotos.push(`${url} → ${r.error ?? `HTTP ${r.estado}`}  (${donde})`);
  else if (r.estado >= 400) avisos.push(`${url} → HTTP ${r.estado}, puede bloquear comprobaciones automáticas; revísalo a mano  (${donde})`);
}
console.log(`Enlaces externos comprobados: ${lista.length}.`);
if (avisos.length) console.log(`\nAvisos (${avisos.length}):\n` + avisos.map(a => `  - ${a}`).join('\n'));
if (rotos.length) {
  console.error(`\n✗ Enlaces rotos (${rotos.length}):\n` + rotos.map(a => `  - ${a}`).join('\n'));
  process.exit(1);
}
console.log('✓ Ningún enlace roto.');
