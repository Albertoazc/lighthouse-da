// Pruebas del algoritmo de recomendaciones:  npm run test:unit
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { recomendar } from '../src/lib/recomendaciones.ts';

const pub = (id, opts = {}) => ({
  id,
  data: {
    author: { id: opts.autor ?? 'a1' },
    category: opts.category ?? 'economia',
    tags: opts.tags ?? [],
    publishedAt: opts.publishedAt ?? new Date('2026-01-01'),
    featured: opts.featured ?? false,
    relatedReports: opts.relatedReports ?? [],
  },
});

const actual = pub('actual', { tags: ['Inflación', 'precios'], category: 'economia', autor: 'a1', relatedReports: [{ id: 'manual' }] });
const todas = [
  actual,
  pub('manual', { category: 'mercados', autor: 'a9', tags: [], publishedAt: new Date('2020-01-01') }),
  pub('dos-etiquetas', { tags: ['inflacion', 'Precios'], category: 'mercados', autor: 'a2' }),
  pub('una-etiqueta-categoria', { tags: ['precios'], category: 'economia', autor: 'a2' }),
  pub('solo-autor', { category: 'mercados', autor: 'a1' }),
  pub('sin-relacion-reciente', { category: 'mercados', autor: 'a3', publishedAt: new Date('2026-06-01') }),
  pub('sin-relacion-destacada', { category: 'mercados', autor: 'a3', featured: true, publishedAt: new Date('2025-01-01') }),
];

test('prioriza las manuales y después la afinidad', () => {
  const ids = recomendar(actual, todas, { limite: 4 }).map(p => p.id);
  assert.deepEqual(ids, ['manual', 'dos-etiquetas', 'una-etiqueta-categoria', 'solo-autor']);
});

test('nunca incluye la publicación actual ni repite', () => {
  const ids = recomendar(actual, [...todas, todas[1]], { limite: 10 }).map(p => p.id);
  assert.ok(!ids.includes('actual'));
  assert.equal(new Set(ids).size, ids.length);
});

test('completa con destacadas y luego recientes', () => {
  const ids = recomendar(actual, todas, { limite: 6 }).map(p => p.id);
  assert.deepEqual(ids.slice(4), ['sin-relacion-destacada', 'sin-relacion-reciente']);
});

test('ignora referencias manuales a publicaciones no disponibles (p. ej. borradores)', () => {
  const conBorrador = pub('x', { relatedReports: [{ id: 'borrador' }] });
  const ids = recomendar(conBorrador, todas, { limite: 3 }).map(p => p.id);
  assert.ok(!ids.includes('borrador'));
  assert.equal(ids.length, 3);
});

test('es estable entre ejecuciones', () => {
  const a = recomendar(actual, todas).map(p => p.id);
  const b = recomendar(actual, [...todas].reverse()).map(p => p.id);
  assert.deepEqual(a, b);
});
