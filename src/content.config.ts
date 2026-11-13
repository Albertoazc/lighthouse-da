import { defineCollection, reference } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { idsCategorias } from './config/categorias';

const texto = (campo: string) =>
  z.string({ required_error: `Falta el campo obligatorio «${campo}».`, invalid_type_error: `«${campo}» debe ser un texto.` })
    .trim().min(1, `«${campo}» no puede estar vacío.`);
const fecha = (campo: string) =>
  z.coerce.date({ required_error: `Falta el campo obligatorio «${campo}».`, invalid_type_error: `«${campo}» debe ser una fecha AAAA-MM-DD.` });

/** Autores: un archivo YAML por persona o equipo en src/content/autores/. El nombre del archivo es su identificador. */
const autores = defineCollection({
  loader: glob({ pattern: '**/*.{yaml,yml}', base: './src/content/autores' }),
  schema: ({ image }) => z.object({
    name: texto('name'),
    /** `organizacion` para firmas colectivas (equipo, área); `persona` por defecto. */
    kind: z.enum(['persona', 'organizacion']).default('persona'),
    photo: image(),
    photoAlt: z.string().trim().optional(),
    role: texto('role'),
    bio: texto('bio'),
    longBio: z.string().trim().optional(),
    links: z.array(z.object({ label: texto('links.label'), url: z.string().url('Cada enlace del autor necesita una URL completa (https://…).') })).default([]),
    /** Orden en la página de Equipo (menor primero). */
    order: z.number().int().default(100),
    /** Forma del nombre en citas APA, p. ej. «Pérez Gómez, M.». Si se omite, se usa `name`. */
    citationName: z.string().trim().optional(),
  }),
});

const referencia = z.union([
  z.string().trim().min(1),
  z.object({
    title: texto('references.title'),
    author: z.string().trim().optional(),
    year: z.union([z.number().int(), z.string().trim()]).optional(),
    publisher: z.string().trim().optional(),
    url: z.string().url().optional(),
    accessed: z.coerce.date().optional(),
  }),
]);

/** Informes y artículos: un archivo .md por publicación. El nombre del archivo forma la URL. */
const publicaciones = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/publicaciones' }),
  schema: ({ image }) => z.object({
    title: texto('title'),
    description: texto('description'),
    author: reference('autores'),
    publishedAt: fecha('publishedAt'),
    category: z.enum(idsCategorias, {
      errorMap: () => ({ message: `«category» debe ser una de: ${idsCategorias.join(', ')} (ver src/config/categorias.ts).` }),
    }),
    tags: z.array(z.string().trim().min(1), { required_error: 'Falta el campo obligatorio «tags» (lista de etiquetas).' })
      .min(1, 'Añade al menos una etiqueta en «tags».'),
    coverImage: image(),
    coverAlt: texto('coverAlt'),

    originalPublishedAt: z.coerce.date().optional(),
    updatedAt: z.coerce.date().optional(),
    featured: z.boolean().default(false),
    /** Por seguridad, un informe es borrador hasta que se escribe `draft: false`. */
    draft: z.boolean().default(true),
    /** Contenido de demostración con datos simulados: muestra un aviso y se marca `noindex`. */
    demo: z.boolean().default(false),
    /** Minutos de lectura. Si se omite, se calcula automáticamente a partir del texto. */
    readingTime: z.number().int().positive().optional(),
    relatedReports: z.array(reference('publicaciones')).default([]),
    references: z.array(referencia).default([]),
    /** Datos descargables (opcional): archivos en public/datos/<informe>/. */
    datasets: z.array(z.object({
      label: texto('datasets.label'),
      file: z.string().regex(/^\/datos\/[a-z0-9-]+\/[a-z0-9-]+\.(csv|xlsx|json|zip)$/,
        'Cada archivo de «datasets» debe estar en /datos/<informe>/ y ser .csv, .xlsx, .json o .zip.'),
      description: z.string().trim().optional(),
    })).default([]),
    seoTitle: z.string().trim().optional(),
    seoDescription: z.string().trim().optional(),
  }),
});

export const collections = { autores, publicaciones };
