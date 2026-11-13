# Kit de gráficos

Los gráficos de los informes se elaboran aquí, fuera del sitio web, y se exportan con el formato que exige la plantilla. El kit (`lighthouse_graficos.py`) aplica la identidad visual y guarda cada archivo en la carpeta correcta, con el tamaño correcto.

| Función | Produce | Destino |
| --- | --- | --- |
| `guardar_png(fig, informe, nombre)` | PNG de 1600 × 900 px (matplotlib) | `src/assets/graficos/<informe>/` |
| `guardar_html(fig, informe, nombre)` | HTML interactivo autocontenido (Plotly) | `public/interactivos/<informe>/` |
| `guardar_datos(df, informe, nombre)` | CSV descargable, **opcional** | `public/datos/<informe>/` |

## Instalación (una vez)

Python 3.10 o superior:

```sh
python -m pip install -r analisis/requirements.txt
```

Para que los gráficos usen la tipografía del sitio, instala la fuente **DM Sans** en el sistema (Google Fonts). Si no está, el kit usa Segoe UI, Arial o DejaVu Sans.

## Flujo por informe

```text
analisis/informes/<informe>/
├── datos.csv      ← datos de origen (de una fuente verificable o del procesamiento previo)
└── graficos.py    ← genera los gráficos del informe
```

1. Crea el informe con `npm run nuevo -- mi-informe`.
2. Crea `analisis/informes/mi-informe/` con tus datos y un `graficos.py`. Copia el de `como-redactar-un-informe` como punto de partida.
3. Ejecuta desde la raíz del proyecto:

   ```sh
   python analisis/informes/mi-informe/graficos.py
   ```

4. Inserta los gráficos en el `.md` con la sintaxis de la guía (`![descripción](ruta "Gráfico N. Título")` y `*Fuente: …*`).

Si los datos cambian, vuelve a ejecutar el script: los archivos se sobrescriben con la versión nueva.

## Ejemplo mínimo

```python
import sys
from pathlib import Path
import pandas as pd

sys.path.insert(0, str(Path(__file__).resolve().parents[2]))
from lighthouse_graficos import PALETA, figura, guardar_png, leyenda

INFORME = "mi-informe"
datos = pd.read_csv(Path(__file__).with_name("datos.csv"))

fig, ax = figura()                       # 1600 × 900 px con el estilo de marca
ax.plot(datos["anio"], datos["valor"], marker="o", color=PALETA["azul"], label="Valor")
leyenda(ax)
guardar_png(fig, INFORME, "evolucion-del-valor", pie_eje="Millones de RD$")
```

## Reglas de estilo que aplica el kit

- Textos de 26 px o más, porque en la página el gráfico se muestra al 42 % de su tamaño.
- Colores de marca en orden: azul `#214f5b`, verde `#82b574`, verde azulado `#4b9590`, verde claro `#b0cf9f`, gris `#66797f`.
- Fondo blanco, rejilla horizontal suave y sin marcos.
- **Sin título ni fuente dentro de la imagen**: los pone la plantilla.
- `simulados=True` añade «Datos simulados · Lighthouse D&A». Es obligatorio cuando los datos no son reales.
- `formato_numero(12500.5, 1)` → `12 500,5` (formato español).

Márgenes: `figura()` los fija por defecto. Si las etiquetas son largas (barras horizontales), amplíalos después con `fig.subplots_adjust(left=0.27)`.

## Datos descargables (opcional)

`guardar_datos()` escribe un CSV legible en Excel en español (UTF-8, separador «;», coma decimal) y muestra la ruta que debes declarar en el informe:

```yaml
datasets:
  - label: "Nombre de los datos"
    file: /datos/mi-informe/nombre.csv
```

Publica solo datos que puedas compartir legalmente y cita su fuente original.
