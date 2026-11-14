/**
 * Recomendaciones de lectura locales y deterministas (sin servicios externos).
 *
 * Orden de prioridad:
 *  1. Publicaciones elegidas a mano en `relatedReports`, en el orden escrito.
 *  2. Afinidad: etiquetas compartidas, misma categoría y mismo autor (pesos configurables).
 *     Los empates se resuelven por recencia y, después, por identificador.
 *  3. Si faltan resultados: publicaciones destacadas y luego las más recientes.
 *
 * Nunca incluye la publicación actual ni repite elementos. Los borradores deben filtrarse
 * antes de llamar a la función (ver `todasLasPublicaciones`). Este módulo no depende de Astro,
 * por lo que puede probarse con `node --test`.
 */
export interface Recomendable {
  id: string;
  data: {
    author: { id: string };
    category: string;
    tags: string[];
    publishedAt: Date;
    featured?: boolean;
    relatedReports?: { id: string }[];
  };
}

export interface OpcionesRecomendacion {
  limite?: number;
  pesos?: { etiqueta: number; categoria: number; autor: number };
  /** Identificadores que no deben recomendarse (por ejemplo, ya visibles en la página). */
  excluir?: Iterable<string>;
  /** Completa con destacadas y recientes cuando la afinidad no alcanza el límite. */
  completar?: boolean;
}

const normalizar = (s: string) => s.toLocaleLowerCase('es').normalize('NFD').replace(/[̀-ͯ]/g, '').trim();
const porRecencia = (a: Recomendable, b: Recomendable) =>
  b.data.publishedAt.getTime() - a.data.publishedAt.getTime() || a.id.localeCompare(b.id);

export function puntuarAfinidad(base: Recomendable, otra: Recomendable, pesos = { etiqueta: 3, categoria: 2, autor: 1 }) {
  const etiquetas = new Set(base.data.tags.map(normalizar));
  const compartidas = new Set(otra.data.tags.map(normalizar).filter(t => etiquetas.has(t))).size;
  return compartidas * pesos.etiqueta
    + (otra.data.category === base.data.category ? pesos.categoria : 0)
    + (otra.data.author.id === base.data.author.id ? pesos.autor : 0);
}

export function recomendar<T extends Recomendable>(actual: T, publicaciones: readonly T[], opciones: OpcionesRecomendacion = {}): T[] {
  const { limite = 4, pesos, completar = true } = opciones;
  const vistos = new Set<string>([actual.id, ...(opciones.excluir ?? [])]);
  const porId = new Map(publicaciones.map(p => [p.id, p]));
  const resultado: T[] = [];
  const agregar = (p: T | undefined) => {
    if (!p || vistos.has(p.id) || resultado.length >= limite) return;
    vistos.add(p.id);
    resultado.push(p);
  };

  for (const ref of actual.data.relatedReports ?? []) agregar(porId.get(ref.id));

  publicaciones
    .filter(p => !vistos.has(p.id))
    .map(p => ({ p, puntos: puntuarAfinidad(actual, p, pesos) }))
    .filter(({ puntos }) => puntos > 0)
    .sort((a, b) => b.puntos - a.puntos || porRecencia(a.p, b.p))
    .forEach(({ p }) => agregar(p));

  if (completar) {
    const restantes = publicaciones.filter(p => !vistos.has(p.id)).sort(porRecencia);
    restantes.filter(p => p.data.featured).forEach(agregar);
    restantes.forEach(agregar);
  }
  return resultado;
}
