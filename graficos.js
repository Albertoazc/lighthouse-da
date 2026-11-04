'use strict';
/* Datos sintéticos y funciones de gráficos sin dependencias.
   Sustituye estos arreglos cuando se publiquen resultados reales. */

const DEMO_DATA = {
  years: [2026, 2027, 2028, 2029, 2030, 2031, 2032, 2033],
  withoutAdaptation: [0.80, 0.95, 1.10, 1.34, 1.53, 1.75, 1.99, 2.25],
  withAdaptation: [0.80, 0.93, 1.03, 1.14, 1.23, 1.31, 1.43, 1.52],
  sectors: [
    { sector: 'Agricultura', without: 0.61, with: 0.43 },
    { sector: 'Infraestructura', without: 0.58, with: 0.37 },
    { sector: 'Salud', without: 0.47, with: 0.34 },
    { sector: 'Turismo', without: 0.34, with: 0.22 },
    { sector: 'Otros sectores', without: 0.25, with: 0.16 },
  ]
};

const SVG_NS = 'http://www.w3.org/2000/svg';
const chartStyles = getComputedStyle(document.documentElement);
const color = {
  dark: chartStyles.getPropertyValue('--chart-dark').trim(),
  green: chartStyles.getPropertyValue('--chart-green').trim()
};
function element(type, attributes = {}, text = null) {
  const node = document.createElementNS(SVG_NS, type);
  Object.entries(attributes).forEach(([name, value]) => node.setAttribute(name, String(value)));
  if (text !== null) node.textContent = text;
  return node;
}
function add(parent, type, attributes = {}, text = null) {
  const el = element(type, attributes, text);
  parent.appendChild(el);
  return el;
}
function format(value) { return value.toFixed(2).replace('.', ','); }
function createSVG(label, description, viewBox) {
  const svg = element('svg', { viewBox, xmlns: SVG_NS, focusable: 'false', 'aria-hidden': 'true' });
  add(svg, 'title', {}, label);
  add(svg, 'desc', {}, description);
  return svg;
}

function renderEvolution() {
  const target = document.querySelector('#chart-evolucion');
  if (!target) return;
  const w = 760, h = 360;
  const m = { left: 56, right: 60, top: 28, bottom: 45 };
  const usableW = w - m.left - m.right, usableH = h - m.top - m.bottom;
  const lastIndex = DEMO_DATA.years.length - 1;
  const ceiling = Math.max(.5, Math.ceil(Math.max(...DEMO_DATA.withoutAdaptation, ...DEMO_DATA.withAdaptation) / .5) * .5);
  const x = idx => m.left + usableW * idx / Math.max(1, lastIndex);
  const y = value => m.top + usableH * (1 - value / ceiling);
  const svg = createSVG('Evolución anual de pérdidas esperadas', 'Datos ficticios: ambas series comienzan en 0,80 y terminan en 2,25 sin medidas y 1,52 con adaptación.', `0 0 ${w} ${h}`);

  for (let tick = 0; tick <= ceiling; tick += .5) {
    const ty = y(tick);
    add(svg, 'line', { x1: m.left, x2: w - m.right, y1: ty, y2: ty, class: 'axis-grid' });
    add(svg, 'text', { x: m.left - 13, y: ty + 4, 'text-anchor': 'end' }, format(tick));
  }
  add(svg, 'text', { x: m.left, y: 14, 'font-weight': 700, 'font-size': 11 }, '% del PIB');
  DEMO_DATA.years.forEach((year, idx) => {
    add(svg, 'text', { x: x(idx), y: h - 13, 'text-anchor': 'middle' }, year);
  });
  const series = [
    { data: DEMO_DATA.withoutAdaptation, name: 'Sin nuevas medidas', stroke: color.dark },
    { data: DEMO_DATA.withAdaptation, name: 'Con adaptación', stroke: color.green }
  ];
  series.forEach(seriesItem => {
    const d = seriesItem.data.map((value, idx) => `${idx === 0 ? 'M' : 'L'}${x(idx).toFixed(1)},${y(value).toFixed(1)}`).join(' ');
    add(svg, 'path', { d, class: 'chart-line', stroke: seriesItem.stroke });
    seriesItem.data.forEach((value, idx) => {
      const dot = add(svg, 'circle', { cx: x(idx), cy: y(value), r: idx === lastIndex ? 6.4 : 4.3, fill: seriesItem.stroke, class: 'line-point' });
      add(dot, 'title', {}, `${seriesItem.name}, ${DEMO_DATA.years[idx]}: ${format(value)} % del PIB hipotético`);
    });
    const endValue = seriesItem.data.at(-1);
    add(svg, 'text', { x: x(lastIndex) + 13, y: y(endValue) + 4, 'font-size': 15, 'font-weight': 800, fill: seriesItem.stroke }, format(endValue));
  });
  target.replaceChildren(svg);
}

function renderSectors() {
  const target = document.querySelector('#chart-sectores');
  if (!target) return;
  const w = 760, h = 95 + DEMO_DATA.sectors.length * 56;
  const m = { left: 145, right: 52, top: 34, bottom: 44 };
  const usableW = w - m.left - m.right;
  const ceiling = Math.max(.1, Math.ceil(Math.max(...DEMO_DATA.sectors.flatMap(row => [row.without, row.with])) * 10) / 10);
  const x = value => m.left + usableW * value / ceiling;
  const svg = createSVG(`Pérdidas esperadas por sector en ${DEMO_DATA.years.at(-1)}`, 'Comparación ficticia de pérdidas sectoriales en puntos porcentuales del PIB entre dos escenarios.', `0 0 ${w} ${h}`);
  for (let tick = 0; tick <= ceiling + .0001; tick += .1) {
    const tx = x(tick);
    add(svg, 'line', { x1: tx, x2: tx, y1: m.top - 6, y2: h - m.bottom + 3, class: 'axis-grid' });
    add(svg, 'text', { x: tx, y: h - 15, 'text-anchor': 'middle' }, format(tick));
  }
  add(svg, 'text', { x: m.left, y: 15, 'font-size': 11, 'font-weight': 700 }, 'Puntos porcentuales del PIB');
  DEMO_DATA.sectors.forEach((row, index) => {
    const blockY = m.top + index * 56;
    add(svg, 'text', { x: m.left - 13, y: blockY + 25, 'text-anchor': 'end', 'font-weight': 600 }, row.sector);
    [
      { label: 'Sin nuevas medidas', value: row.without, fill: color.dark, y: blockY + 5 },
      { label: 'Con adaptación', value: row.with, fill: color.green, y: blockY + 27 }
    ].forEach(bar => {
      const rect = add(svg, 'rect', { x: m.left, y: bar.y, width: x(bar.value) - m.left, height: 15, rx: 2, fill: bar.fill, class: 'bar' });
      add(rect, 'title', {}, `${row.sector}, ${bar.label}: ${format(bar.value)} puntos porcentuales`);
      add(svg, 'text', { x: x(bar.value) + 8, y: bar.y + 12, 'font-weight': 700, 'font-size': 11 }, format(bar.value));
    });
  });
  target.replaceChildren(svg);
}

function csvFor(key) {
  const lines = key === 'evolucion'
    ? [
        ['anio', 'sin_nuevas_medidas_pct_pib', 'con_adaptacion_pct_pib'],
        ...DEMO_DATA.years.map((year, i) => [year, DEMO_DATA.withoutAdaptation[i], DEMO_DATA.withAdaptation[i]])
      ]
    : [
        ['sector', 'sin_nuevas_medidas_pp_pib', 'con_adaptacion_pp_pib', 'diferencia_pp_pib'],
        ...DEMO_DATA.sectors.map(row => [row.sector, row.without, row.with, Number((row.with - row.without).toFixed(2))])
      ];
  return lines.map(row => row.map(item => `"${String(item).replaceAll('"', '""')}"`).join(',')).join('\r\n');
}
function downloadCSV(key) {
  if (!['evolucion', 'sectores'].includes(key)) return;
  const blob = new Blob(['\uFEFF', csvFor(key)], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = `lighthouse-ejemplo-${key}.csv`;
  document.body.append(anchor);
  anchor.click();
  anchor.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

renderEvolution();
renderSectors();
document.querySelectorAll('[data-download]').forEach(button => {
  button.hidden = false;
  button.addEventListener('click', () => downloadCSV(button.dataset.download));
});
