# Guía de publicaciones

Publicar un informe consiste en crear **un archivo Markdown (`.md`)** en `src/content/publicaciones/`. La plantilla editorial, la portada, el catálogo, las páginas de categoría y etiqueta, la página del autor, las recomendaciones, el buscador, el RSS y el sitemap se actualizan solos al compilar. No hay que crear páginas Astro ni tocar componentes.

> **Informe de ejemplo:** [Cómo redactar un informe](/publicaciones/como-redactar-un-informe/) (`src/content/publicaciones/como-redactar-un-informe.md`) muestra cada elemento con su código y su resultado. Ábrelo junto a esta guía.

## Flujo resumido

```sh
npm run nuevo -- mi-informe      # 1. crea el .md (borrador) y src/assets/graficos/mi-informe/
                                 # 2–4. completa metadatos, escribe, añade gráficos PNG 1600×900
npm run dev                      # 5–6. vista previa en http://localhost:4321/publicaciones/mi-informe/
# cambia draft: false cuando esté revisado
npm run build && npm run test:site   # 7. valida antes de subir
git checkout -b feature/mi-informe && git add . && git commit -m "Publicación: mi informe"
git push -u origin feature/mi-informe   # 8. abre un pull request hacia main
```

El nombre del archivo forma la URL: `mi-informe.md` → `/publicaciones/mi-informe/`. Usa minúsculas, números y guiones, sin acentos ni espacios.

## 1. Metadatos

El bloque entre las dos líneas `---` describe el informe. La compilación falla con un mensaje claro si falta un campo obligatorio o un valor no es válido.

```yaml
---
# Obligatorios
title: "¿Más inversión significa más crecimiento?"
description: "Resumen breve que aparece en listados, buscador y redes sociales."
author: equipo-lighthouse          # archivo de src/content/autores/ (sin extensión)
publishedAt: 2026-11-04            # AAAA-MM-DD
category: economia                 # ver src/config/categorias.ts
tags: ["inversión", "crecimiento económico"]
coverImage: ../../assets/portadas/mi-informe.webp
coverAlt: "Descripción accesible de la imagen principal."

# Opcionales
draft: true                        # por defecto true: hay que escribir false para publicar
demo: false                        # true muestra aviso de datos simulados y añade noindex
featured: false                    # destaca el informe en la portada y en la columna lateral
updatedAt: 2026-12-01              # se muestra en el encabezado y al final
originalPublishedAt: 2026-01-15    # si se publicó antes en otro medio
readingTime: 10                    # minutos; si se omite se calcula solo
relatedReports: ["otro-informe"]   # recomendaciones elegidas a mano (prioritarias)
seoTitle: "Título alternativo para buscadores"
seoDescription: "Descripción alternativa para buscadores."
references:
  - title: "Título de la fuente"
    author: "Apellido, N."
    year: 2025
    publisher: "Editorial o institución"
    url: "https://…"
    accessed: 2026-11-01
  - "También se admite una referencia como texto libre."
---
```

- **Tiempo de lectura:** palabras ÷ 200, redondeado hacia arriba, más un minuto por cada gráfico. Ajusta los valores en `src/config/sitio.ts`.
- **Borradores:** con `draft: true` el informe no aparece en ningún listado, recomendación, buscador, RSS ni sitemap, y no genera página en producción. En `npm run dev` se puede ver por su URL directa, con aviso de borrador.
- **Demostraciones:** `demo: true` es obligatorio cuando los datos son simulados. Muestra un aviso visible y marca la página `noindex`. No presentes datos simulados como estadísticas reales.

## 2. Escribir el informe

No repitas el título con `#`: la plantilla lo genera. El primer párrafo se muestra como entradilla.

| Elemento | Sintaxis |
| --- | --- |
| Sección (aparece en el índice lateral) | `## Título` |
| Subsección | `### Título` y `#### Título` |
| Énfasis | `**negrita**`, `*cursiva*` |
| Enlace | `[texto](https://…)` |
| Cita destacada | `> Texto de la cita` |
| Lista | `- elemento` o `1. elemento` |
| Nota al pie | `texto[^1]` y, al final, `[^1]: Contenido de la nota.` |
| Tabla | tabla Markdown; en móvil se desplaza horizontalmente sola |

Tipografías, tamaños, márgenes, colores y alineación los controla la plantilla (`src/styles/prosa.css`). Para justificar el texto de todos los informes cambia `justificarTexto` en `src/config/sitio.ts`.

## 3. Gráficos

Los gráficos **no se generan en el sitio**: se elaboran fuera (Python, R, Excel…) y se insertan con la sintaxis de imagen de Markdown. La plantilla los convierte en una figura con número, título, fuente y nota. Hay dos tipos y **se escriben igual**; solo cambian la carpeta y la extensión.

### 3.1 Gráficos estáticos (PNG)

| Regla | Valor |
| --- | --- |
| Formato | **PNG** |
| Tamaño | **exactamente 1600 × 900 px** (16:9) |
| Carpeta | `src/assets/graficos/<nombre-del-informe>/` (igual que el nombre del archivo `.md`) |
| Nombre del archivo | minúsculas, números y guiones: `evolucion-precios.png` |

```md
![Gráfico de líneas: el índice sube de 100 a 131 entre 2019 y 2025, con una aceleración en 2022.](../../assets/graficos/mi-informe/evolucion-precios.png "Gráfico 1. Evolución del índice de precios, 2019–2025")
*Fuente: institución, año. Nota: aclaración metodológica opcional.*
```

- **Entre corchetes:** descripción para lectores de pantalla (qué muestra y su conclusión; mínimo 15 caracteres).
- **Entre comillas, tras la ruta:** `"Gráfico N. Título"`.
- **Línea siguiente, en cursiva:** empieza con `Fuente:`; lo que va después de `Nota:` se muestra aparte.

**Cómo preparar el PNG para que se lea bien.** En la página se muestra a unos 672 px de ancho, el 42 % de su tamaño real:

- textos de **26 px o más** (ejes, etiquetas, leyenda) y líneas de 5 px o más;
- fondo blanco y colores de la marca: azul `#214f5b`, verde `#82b574`, verde azulado `#4b9590`, gris `#66797f`;
- **sin título ni fuente dentro de la imagen**: los pone la plantilla;
- si los datos son simulados, indícalo también dentro de la imagen («Datos simulados»).

```python
# matplotlib
fig, ax = plt.subplots(figsize=(16, 9), dpi=100)
plt.rcParams.update({"font.size": 26})
fig.savefig("src/assets/graficos/mi-informe/evolucion.png", dpi=100, facecolor="white")  # sin bbox_inches="tight": cambia el tamaño
```

```r
# ggplot2
ggsave("src/assets/graficos/mi-informe/evolucion.png", width = 1600, height = 900, units = "px", dpi = 150, bg = "white")
```

### 3.2 Gráficos interactivos (HTML)

| Regla | Valor |
| --- | --- |
| Formato | un único archivo **.html autocontenido** (sin cargar librerías ni datos de internet) |
| Peso máximo | 5000 KB |
| Carpeta | `public/interactivos/<nombre-del-informe>/` |
| Diseño | fondo blanco, adaptable al ancho y alto del marco |

```md
![Gráfico interactivo de líneas con los indicadores A y B; al pasar el cursor se ve el valor de cada trimestre.](/interactivos/mi-informe/indicadores.html "Gráfico 2. Indicadores A y B por trimestre")
*Fuente: institución, año.*
```

La ruta empieza con `/interactivos/` (sin `../../`). El gráfico se muestra en un marco aislado de proporción 16:9, con un enlace para abrirlo en una pestaña nueva; al imprimir, el marco se oculta. Si las cifras exactas importan, publica también la tabla.

```python
# Plotly
fig.write_html("public/interactivos/mi-informe/indicadores.html", include_plotlyjs=True, full_html=True)
```

### 3.3 Kit de gráficos

La forma recomendada de producir los gráficos es el kit de `analisis/` (ver [analisis/README.md](../analisis/README.md)). Cada informe tiene allí sus datos y un script; al ejecutarlo se generan los PNG, los HTML interactivos y, si se desea, el CSV descargable, ya con el formato, los colores y la carpeta correctos:

```sh
python -m pip install -r analisis/requirements.txt   # una vez
python analisis/informes/mi-informe/graficos.py
```

### 3.4 Validación automática

`npm run build` (o solo `npm run check:graficos`) **se detiene con un mensaje claro** si un PNG no mide 1600 × 900, si un archivo está en otra carpeta o tiene otro formato, si un interactivo carga recursos externos o supera el peso máximo, o si un gráfico no tiene descripción, título `"Gráfico N. …"` o línea de fuente. La especificación vive en `src/config/sitio.ts` (`graficos` e `interactivos`).

## 4. Tablas y otras imágenes

**Tablas:** se escriben en Markdown y la plantilla les da formato. `:---` alinea a la izquierda (texto) y `---:` a la derecha (números). En móvil se desplazan horizontalmente. Añade debajo un pie en cursiva:

```md
| Año | Valor |
| :--- | ---: |
| 2024 | 104,2 |
| 2025 | 108,7 |

*Tabla 1. Título de la tabla. Fuente: institución, año.*
```

**Portada:** `coverImage: ../../assets/portadas/mi-informe.webp`. Se recomienda 1600 × 900 px (16:9); se admiten PNG, JPG o WebP.

**Fotografías o ilustraciones** (no gráficos): guárdalas en `src/assets/publicaciones/<nombre-del-informe>/` e insértalas sin título entre comillas; la línea en cursiva es el pie de imagen:

```md
![Descripción accesible](../../assets/publicaciones/mi-informe/foto.webp)
*Pie de imagen. Fotografía: autor, año.*
```

Toda imagen necesita texto alternativo: la compilación rechaza `![](ruta)`.

### 4.1 Datos descargables (opcional)

Para ofrecer los datos al lector, guarda el archivo en `public/datos/<nombre-del-informe>/` (`.csv`, `.xlsx`, `.json` o `.zip`) y decláralo en los metadatos. La plantilla añade una sección «Datos» con enlace, formato y tamaño:

```yaml
datasets:
  - label: "Indicadores trimestrales"
    file: /datos/mi-informe/indicadores.csv
    description: "Descripción breve (opcional)."
```

## 5. Recomendaciones automáticas

Al final de cada informe aparecen 3–4 lecturas y, en escritorio, una columna lateral con «Relacionados», «Más del autor» y «Destacados». El algoritmo (`src/lib/recomendaciones.ts`) ordena así:

1. Informes de `relatedReports`, en el orden escrito.
2. Afinidad: etiquetas compartidas (3 puntos cada una), misma categoría (2) y mismo autor (1); empates por fecha.
3. Si faltan resultados: destacados y después los más recientes.

Nunca recomienda el informe actual, borradores ni duplicados, y el resultado es estable entre compilaciones. Los pesos y cantidades se cambian en `src/config/sitio.ts`.

## 6. Añadir un autor

1. Guarda su foto en `src/assets/autores/` (cuadrada, mínimo 240 × 240 px).
2. Crea `src/content/autores/<identificador>.yaml`:

```yaml
name: Nombre Apellido
kind: persona                    # o organizacion para firmas colectivas
photo: ../../assets/autores/nombre-apellido.webp
photoAlt: Retrato de Nombre Apellido
role: Economista · Mercado laboral
bio: Una o dos frases para la tarjeta de autor.
longBio: |
  Biografía extendida opcional para la página de perfil.

  Puede tener varios párrafos.
links:
  - label: Sitio personal
    url: https://…
  - label: LinkedIn
    url: https://…
order: 10                        # orden en la página Equipo
```

3. Usa `author: <identificador>` en sus informes. El perfil `/paginas/equipo/<identificador>/` y su tarjeta en Equipo se generan solos; si cambias la foto o la biografía, se actualiza en todos sus informes. No crees perfiles de personas reales sin su consentimiento ni datos inventados.

## 7. Añadir una categoría

Añade un elemento a `src/config/categorias.ts`:

```ts
{ id: 'energia', nombre: 'Energía', descripcion: 'Transición energética, precios y regulación.' },
```

El `id` es el valor de `category` y forma la URL `/paginas/publicaciones/categoria/energia/`. Las categorías sin publicaciones no generan página ni aparecen en los filtros. Las etiquetas (`tags`) son libres y crean sus páginas automáticamente.

## 8. Antes de publicar

- `npm run build` (gráficos, tipos, esquema y compilación), `npm run test:site` (rutas, enlaces, recomendaciones, borradores, RSS, sitemap) y `npm run test:unit` (algoritmo de recomendaciones).
- `npm run preview` para revisar la versión de producción en escritorio y móvil.
- Revisa que las cifras del texto coincidan con figuras y tablas, que las fuentes estén citadas y que `demo` sea correcto.
- `npm run check:enlaces` comprueba que los enlaces externos (fuentes y referencias) respondan. También se ejecuta cada lunes en GitHub Actions.
- Al final de cada informe la plantilla genera **«Cómo citar este informe»** (APA 7 y BibTeX) a partir del título, el autor y la fecha. Para personas, añade `citationName: "Apellido, N."` en su archivo de autor.
- El botón **«Imprimir / PDF»** del encabezado produce una versión limpia en A4: sin menús ni columnas laterales, con la URL del informe, las fuentes de los enlaces y la cita.

## Preparado para un CMS

El contenido son archivos con un esquema validado (`src/content.config.ts`), sin base de datos. Un CMS basado en Git (por ejemplo Decap CMS o TinaCMS) podría editar estos mismos archivos más adelante sin cambiar la plantilla.
