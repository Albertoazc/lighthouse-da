/**
 * DEMOSTRACIÓN EDITORIAL — DATOS COMPLETAMENTE SIMULADOS.
 * No representan valores observados ni proyecciones de República Dominicana.
 * Este módulo es la fuente única de los gráficos y la tabla del informe.
 */
export type RegistroSimulado = {
  periodo: string;
  publica: number;
  privada: number;
  actividad: number;
};

export const registros: RegistroSimulado[] = [
  { periodo: '2019', publica: 100, privada: 100, actividad: 100 },
  { periodo: '2020', publica: 94,  privada: 91,  actividad: 96 },
  { periodo: '2021', publica: 104, privada: 106, actividad: 101 },
  { periodo: '2022', publica: 110, privada: 117, actividad: 105 },
  { periodo: '2023', publica: 118, privada: 129, actividad: 110 },
  { periodo: '2024', publica: 129, privada: 141, actividad: 117 },
  { periodo: '2025', publica: 141, privada: 155, actividad: 124 },
];

export const series = [
  { nombre: 'Inversión pública', color: '#214f5b', valores: registros.map(d => d.publica) },
  { nombre: 'Inversión privada', color: '#82b574', valores: registros.map(d => d.privada) },
  { nombre: 'Actividad económica', color: '#4b9590', valores: registros.map(d => d.actividad) },
];

export const variaciones = series.map(serie => ({
  nombre: serie.nombre,
  color: serie.color,
  valor: Math.round((serie.valores.at(-1)! / serie.valores[0] - 1) * 100),
}));

export const destacados = [
  { cifra: '+55 %', detalle: 'Inversión privada (2019–2025)' },
  { cifra: '+41 %', detalle: 'Inversión pública (2019–2025)' },
  { cifra: '+24 %', detalle: 'Actividad económica (2019–2025)' },
];
