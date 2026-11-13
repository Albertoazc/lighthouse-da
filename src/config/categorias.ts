/**
 * Categorías editoriales. Para añadir una categoría, agrega un elemento a esta lista:
 * el identificador (`id`) es el valor que se escribe en `category` dentro de cada informe
 * y también forma la URL /paginas/publicaciones/categoria/<id>/.
 */
export const categorias = [
  { id: 'economia', nombre: 'Economía', descripcion: 'Crecimiento, inversión, empleo, precios y desarrollo económico.' },
  { id: 'politicas-publicas', nombre: 'Políticas públicas', descripcion: 'Diseño, implementación y evaluación de políticas e instituciones.' },
  { id: 'mercados', nombre: 'Mercados', descripcion: 'Comercio, finanzas, competencia y comportamiento de los mercados.' },
  { id: 'datos-y-metodos', nombre: 'Datos y métodos', descripcion: 'Fuentes, medición, estadística y herramientas para analizar evidencia.' },
] as const;

export type CategoriaId = (typeof categorias)[number]['id'];
export const idsCategorias = categorias.map(c => c.id) as [CategoriaId, ...CategoriaId[]];

export function categoria(id: string) {
  const encontrada = categorias.find(c => c.id === id);
  if (!encontrada) throw new Error(`La categoría «${id}» no existe en src/config/categorias.ts.`);
  return encontrada;
}
