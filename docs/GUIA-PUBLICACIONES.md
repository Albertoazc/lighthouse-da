# Guía de publicaciones

Cada artículo es un archivo MDX: Markdown con la posibilidad de importar componentes Astro. No hace falta modificar la portada, el catálogo ni crear una página Astro para cada artículo.

## 1. Crear el archivo

Copia `src/content/publicaciones/plantilla-borrador.mdx` dentro de la misma carpeta y llámalo, por ejemplo, `mi-investigacion.mdx`. Usa minúsculas, guiones y nombres sin espacios ni acentos. Su URL será `/publicaciones/mi-investigacion/`.

La plantilla original debe conservar `draft: true`. Su contenido y el archivo `src/data/datos-ejemplo.json` son ejemplos simulados, no una publicación real.

## 2. Completar los metadatos

El bloque inicial, entre dos líneas `---`, describe el artículo:

```yaml
---
title: "Pregunta o título de la investigación"
description: "Resumen breve que aparecerá en los listados."
category: "ECONOMÍA"
authors: ["Nombre de la autora", "Nombre del autor"]
publishedAt: 2026-11-04
cover: "/assets/thumb-economia.webp"
readingMinutes: 8
draft: true
demo: false
---
```

Todos estos campos son obligatorios excepto `draft` y `demo`: si se omiten, sus valores son `true` y `false`, respectivamente. `authors` admite una o varias personas. Guarda las portadas en `public/assets/` y referencia su ruta desde `/assets/`. Usa una fecha `AAAA-MM-DD`; se muestra sin cambios por zona horaria.

Define `readingMinutes` como un entero positivo. Para todos los artículos usa el mismo criterio: palabras del texto ÷ 200, redondeadas hacia arriba, más un minuto por cada gráfico o tabla que requiera interpretación. Revisa el resultado editorialmente. El valor se comparte entre tarjetas y encabezado; no se recalcula en sitios distintos.

`demo: true` muestra avisos de datos simulados y evita la indexación del artículo. Para investigaciones reales, verifica las fuentes antes de usar `demo: false`. Publicar un borrador requiere cambiar explícitamente `draft: false`.

## 3. Escribir el artículo

No repitas el título como `#`: el sitio genera el encabezado. Usa `##` para las secciones principales y `###` para subsecciones. El índice de lectura se genera a partir de los títulos `##`.

```md
## Introducción

Explica la pregunta y por qué importa. Puedes usar **negrita**, *énfasis*
y [enlaces a las fuentes](https://example.org/).

## Metodología

Documenta cobertura, unidades, fecha de extracción y tratamiento de los datos.

## Resultados

Explica qué muestran las cifras y qué no permiten concluir.

## Limitaciones

Expón los supuestos y las preguntas pendientes.
```

Las imágenes usan `![Descripción accesible](/assets/mi-imagen.webp)`. No inventes resultados, autores, instituciones o fuentes. Distingue siempre una descripción estadística de una interpretación causal.

## 4. Insertar gráficos y tablas

Importa los componentes después del bloque de metadatos. Los datos pueden vivir en `src/data/` como JSON o TypeScript, separados del texto.

```mdx
import BarChart from '../../components/BarChart.astro'
import datos from '../../data/datos-ejemplo.json'

<BarChart title="Ejemplo de comparación" data={datos} unit=" %" source="Fuente: ejemplo con datos simulados." />
```

`BarChart` recibe una lista de `{ label, value }` y admite valores no negativos. Incluye una tabla accesible. Para series y variaciones usa los componentes del informe:

```mdx
import InformeLinea from '../../components/InformeLinea.astro'
import InformeBarras from '../../components/InformeBarras.astro'
import InformeTabla from '../../components/InformeTabla.astro'
import InformeDestacados from '../../components/InformeDestacados.astro'
import { registros, series, variaciones, destacados } from '../../data/inversion-simulada'

<InformeDestacados items={destacados} />
<InformeLinea titulo="Trayectorias de ejemplo" subtitulo="Índices simulados" periodos={registros.map(r => r.periodo)} series={series} unidad="Índice base 2019 = 100" fuente="Fuente: datos simulados de Lighthouse D&A." />
<InformeBarras titulo="Cambios acumulados" subtitulo="Ejemplo simulado" data={variaciones} unidad="%" fuente="Fuente: cálculo sobre datos simulados." />
<InformeTabla registros={registros} />
```

La línea recibe períodos y series `{ nombre, color, valores }` de igual longitud; adapta su escala a los datos. `base` permite indicar la referencia horizontal (100 por defecto). Las barras reciben `{ nombre, color, valor }`, admiten valores negativos y ajustan su eje. Mantén colores de la paleta del proyecto y especifica títulos, unidades y fuentes.

`InformeTabla` conserva las columnas de inversión pública, privada y actividad. Recibe registros `{ periodo, publica, privada, actividad }` y permite cambiar `titulo`, `unidad` y `fuente`. Para tablas con otras columnas usa Markdown:

```md
| Indicador | Valor |
| --- | ---: |
| Ejemplo simulado | 10 |
```

Los valores de ejemplo y los textos predeterminados de los componentes son simulados. Para un informe real cambia los datos, la fuente, la unidad y los textos de tabla; en `InformeDestacados` usa `simulado={false}`. Elimina cualquier explicación que corresponda exclusivamente a una simulación. Los gráficos de líneas y las tablas tienen desplazamiento horizontal en pantallas pequeñas para conservar etiquetas legibles.

## 5. Revisar localmente

```sh
npm run dev
```

Abre `/publicaciones/mi-investigacion/` en la dirección local de Astro. Los borradores se ven únicamente por su URL directa durante el desarrollo, con aviso y `noindex`; no aparecen en Inicio ni Publicaciones. La plantilla se puede consultar en `/publicaciones/plantilla-borrador/`.

Comprueba escritorio y móvil: encabezado, índice, texto, leyendas, escalas, fuentes, tabla, navegación y enlaces. Revisa que las cifras del texto coincidan con las figuras.

## 6. Pasar de borrador a publicación

Después de la revisión editorial, establece `draft: false`, confirma la fecha y conserva `demo: true` si los datos son simulados. Ejecuta:

```sh
npm run build
npm run test:site
npm run preview
```

La compilación valida los metadatos. `preview` sirve la salida de producción, donde los borradores no tienen ruta. Una publicación publicada entra automáticamente en portada y catálogo. El informe más reciente queda destacado. Si todo el contenido publicado es de demostración, también la portada y el catálogo incluyen `noindex,follow`.

La comprobación `test:site` valida los enlaces y recursos de todas las páginas generadas; además protege el informe de demostración actual y la exclusión de la plantilla. Actualiza esa comprobación si en el futuro se decide retirar o renombrar el informe.
