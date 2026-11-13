// Pruebas de las citas APA y BibTeX:  npm run test:unit
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { citaAPA, citaBibTeX } from '../src/lib/cita.ts';

const base = {
  id: 'mi-informe',
  titulo: 'Inflación y salarios en 2025',
  fecha: new Date('2026-03-05'),
  url: 'https://lighthouse.example/publicaciones/mi-informe/',
  editorial: 'Lighthouse D&A',
};

test('APA con autora persona: incluye la editorial', () => {
  const { texto } = citaAPA({ ...base, autor: { nombre: 'María Pérez Gómez', nombreCita: 'Pérez Gómez, M.', organizacion: false } });
  assert.equal(texto, 'Pérez Gómez, M. (2026, 5 de marzo). Inflación y salarios en 2025 [Informe]. Lighthouse D&A. https://lighthouse.example/publicaciones/mi-informe/');
});

test('APA con autor institucional: omite la editorial y marca las demostraciones', () => {
  const { texto } = citaAPA({ ...base, demo: true, autor: { nombre: 'Equipo editorial Lighthouse D&A', organizacion: true } });
  assert.equal(texto, 'Equipo editorial Lighthouse D&A. (2026, 5 de marzo). Inflación y salarios en 2025 [Informe de demostración]. https://lighthouse.example/publicaciones/mi-informe/');
});

test('BibTeX: clave estable, caracteres escapados y autor institucional entre llaves dobles', () => {
  const bib = citaBibTeX({ ...base, titulo: 'Precios & salarios: 50% más', autor: { nombre: 'Equipo editorial Lighthouse D&A', organizacion: true } });
  assert.match(bib, /^@techreport\{lighthouse2026miinforme,/);
  assert.match(bib, /author {6}= \{\{Equipo editorial Lighthouse D\\&A\}\},/);
  assert.match(bib, /title {7}= \{Precios \\& salarios: 50\\% más\},/);
  assert.match(bib, /month {7}= mar,/);
});
