/**
 * Complementos rehype propios (sin dependencias) para los informes en Markdown.
 *
 * rehypeGraficos — convierte la sintaxis estándar de imagen en una figura editorial:
 *
 *   ![Descripción accesible](../../assets/graficos/<informe>/archivo.png "Gráfico 1. Título")
 *   *Fuente: institución, año. Nota: opcional.*
 *
 *   ![Descripción accesible](/interactivos/<informe>/archivo.html "Gráfico 2. Título")
 *   *Fuente: institución, año.*
 *
 * Un .png se muestra como gráfico estático; un .html, como gráfico interactivo en un marco aislado.
 * Si falta la descripción, el título «Gráfico N. …», la línea de fuente o el archivo no está en la
 * carpeta del informe, la compilación se detiene con un mensaje que indica archivo y línea.
 *
 * rehypeTablasDesplazables — envuelve cada tabla en un contenedor desplazable para móvil.
 */
import { existsSync } from 'node:fs';
import { basename, extname, resolve } from 'node:path';
import { graficos, interactivos } from '../config/sitio.ts';

const el = (tagName, properties = {}, children = []) => ({ type: 'element', tagName, properties, children });
const txt = value => ({ type: 'text', value });
const texto = node => node.type === 'text' ? node.value : (node.children ?? []).map(texto).join('');

export function rehypeGraficos() {
  return (tree, file) => {
    const ruta = file.path ?? file.history?.[0] ?? '';
    if (!/[\\/]content[\\/]publicaciones[\\/]/.test(ruta)) return;
    const informe = basename(ruta, extname(ruta));
    const errores = [];

    const visitar = parent => {
      if (!Array.isArray(parent.children)) return;
      parent.children = parent.children.map(node => {
        if (node.type !== 'element') return node;
        if (node.tagName !== 'p') { visitar(node); return node; }
        const img = node.children.find(c => c.type === 'element' && c.tagName === 'img');
        const src = String(img?.properties?.src ?? '');
        const esPng = /(^|\/)assets\/graficos\//.test(src);
        const esHtml = src.startsWith(`${interactivos.ruta}/`);
        if (!img || (!esPng && !esHtml)) return node;

        const donde = `${ruta.replace(/^.*[\\/](src[\\/])/, '$1').replaceAll('\\', '/')}, gráfico «${src.split('/').pop()}»`;
        const fallo = msg => { errores.push(`${donde} — ${msg}`); return node; };

        const resto = node.children.filter(c => c !== img && !(c.type === 'text' && !c.value.trim()));
        const em = resto[0]?.type === 'element' && resto[0].tagName === 'em' ? resto[0] : null;
        if (resto.length !== (em ? 1 : 0)) return fallo('el gráfico debe ir solo en su párrafo, seguido únicamente de la línea *Fuente: …*.');

        const alt = String(img.properties.alt ?? '').trim();
        if (alt.length < 15) return fallo('describe el gráfico en el texto alternativo: ![qué muestra y su conclusión](…).');
        const titulo = String(img.properties.title ?? '').trim().match(/^Gráfico\s+(\d+)\.\s+(.+)$/);
        if (!titulo) return fallo('añade el título entre comillas después de la ruta: (ruta "Gráfico 1. Título del gráfico").');
        const fuenteTexto = em ? texto(em).trim() : '';
        if (!/^Fuente:\s*\S/.test(fuenteTexto)) return fallo('escribe la fuente en la línea siguiente: *Fuente: institución, año.*');
        const [fuente, nota] = fuenteTexto.split(/\s+Nota:\s*/);

        if (esPng) {
          if (!src.includes(`graficos/${informe}/`)) return fallo(`los gráficos de este informe van en src/assets/graficos/${informe}/.`);
          if (extname(src).toLowerCase() !== `.${graficos.formato}`) return fallo(`los gráficos estáticos deben ser ${graficos.formato.toUpperCase()}.`);
        } else {
          if (!src.startsWith(`${interactivos.ruta}/${informe}/`)) return fallo(`los gráficos interactivos de este informe van en ${interactivos.carpeta}/${informe}/.`);
          if (extname(src).toLowerCase() !== '.html') return fallo('los gráficos interactivos deben ser archivos .html.');
          if (!existsSync(resolve(interactivos.carpeta, '..', '.' + src))) return fallo(`no existe el archivo ${interactivos.carpeta.replace(/\/interactivos$/, '')}${src}.`);
        }

        const [, numero, tituloTexto] = titulo;
        const cabecera = el('figcaption', { className: ['grafico__titulo'] }, [
          el('span', { className: ['grafico__numero'] }, [txt(`Gráfico ${numero}`)]),
          el('span', {}, [txt(tituloTexto)]),
        ]);
        const pie = el('p', { className: ['grafico__fuente'] }, [txt(fuente), ...(nota ? [el('span', { className: ['grafico__nota'] }, [txt(`Nota: ${nota}`)])] : [])]);

        if (esPng) {
          // Astro optimiza la imagen después de este paso; se conservan solo las propiedades útiles.
          img.properties = { src, alt, widths: [800, 1200, 1600], sizes: '(max-width: 760px) 100vw, 672px' };
          return el('figure', { className: ['grafico'] }, [cabecera, img, pie]);
        }
        const descripcionId = `grafico-${numero}-descripcion`;
        return el('figure', { className: ['grafico', 'grafico--interactivo'] }, [
          cabecera,
          el('div', { className: ['grafico__marco'] }, [
            el('iframe', { src, title: `Gráfico ${numero}: ${tituloTexto}`, loading: 'lazy', sandbox: 'allow-scripts', referrerPolicy: 'no-referrer', ariaDescribedBy: descripcionId }, []),
          ]),
          el('p', { id: descripcionId, className: ['visually-hidden'] }, [txt(alt)]),
          el('p', { className: ['grafico__impresion'] }, [txt(`Gráfico interactivo: consúltalo en la versión web de este informe. ${alt}`)]),
          el('p', { className: ['grafico__fuente'] }, [
            txt(fuente),
            ...(nota ? [el('span', { className: ['grafico__nota'] }, [txt(`Nota: ${nota}`)])] : []),
            el('a', { className: ['grafico__abrir'], href: src, target: '_blank', rel: ['noopener'] }, [txt('Abrir gráfico interactivo en una pestaña nueva ↗')]),
          ]),
        ]);
      });
      for (const child of parent.children) if (child.type === 'element' && child.tagName !== 'figure') visitar(child);
    };
    visitar(tree);

    if (errores.length) {
      throw new Error(`Gráficos con formato incorrecto (ver docs/GUIA-PUBLICACIONES.md):\n${errores.map(e => `  - ${e}`).join('\n')}`);
    }
  };
}

export function rehypeTablasDesplazables() {
  return tree => {
    const visitar = node => {
      if (!Array.isArray(node.children)) return;
      node.children = node.children.map(child => {
        if (child.type === 'element' && child.tagName === 'table') {
          return el('div', { className: ['table-scroll'], tabIndex: 0, role: 'region', ariaLabel: 'Tabla (desplazable)' }, [child]);
        }
        visitar(child);
        return child;
      });
    };
    visitar(tree);
  };
}
