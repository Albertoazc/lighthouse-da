"""
Gráficos del informe «¿Más inversión significa más crecimiento?» (DATOS SIMULADOS).

    python analisis/informes/inversion-y-crecimiento-demo/graficos.py
"""
import sys
from pathlib import Path

import pandas as pd

sys.path.insert(0, str(Path(__file__).resolve().parents[2]))
from lighthouse_graficos import PALETA, figura, formato_numero, guardar_png, leyenda  # noqa: E402

INFORME = "inversion-y-crecimiento-demo"
datos = pd.read_csv(Path(__file__).with_name("datos.csv"), dtype={"periodo": str})
series = {
    "Inversión pública": ("inversion_publica", PALETA["azul"]),
    "Inversión privada": ("inversion_privada", PALETA["verde"]),
    "Actividad económica": ("actividad_economica", PALETA["verde_azulado"]),
}

# Gráfico 1. Evolución comparada (índice, 2019 = 100)
fig, ax = figura()
for etiqueta, (columna, color) in series.items():
    ax.plot(datos["periodo"], datos[columna], marker="o", color=color, label=etiqueta,
            markeredgecolor="white", markeredgewidth=3)
    ax.annotate(datos[columna].iloc[-1], (len(datos) - 1, datos[columna].iloc[-1]), xytext=(0, 18),
                textcoords="offset points", ha="center", fontweight="bold", color=color)
ax.axhline(100, color="#9fb3a8", linewidth=2.5, linestyle=(0, (6, 5)), zorder=0)
ax.set_ylim(80, 165)
ax.set_yticks(range(80, 161, 20))
leyenda(ax)
guardar_png(fig, INFORME, "evolucion-inversion-actividad", simulados=True, pie_eje="Índice, 2019 = 100")

# Gráfico 2. Variación acumulada entre 2019 y 2025
variacion = {etiqueta: round((datos[c].iloc[-1] / datos[c].iloc[0] - 1) * 100) for etiqueta, (c, _) in series.items()}
fig, ax = figura()
etiquetas = list(variacion)[::-1]
valores = [variacion[e] for e in etiquetas]
colores = [series[e][1] for e in etiquetas]
ax.barh(etiquetas, valores, color=colores, height=0.55)
for i, v in enumerate(valores):
    ax.text(v + 1.2, i, "+" + formato_numero(v, sufijo=" %"), va="center", fontsize=32, fontweight="bold", color=PALETA["tinta"])
ax.set_xlim(0, 65)
ax.set_xticks(range(0, 61, 20), [formato_numero(t, sufijo=" %") for t in range(0, 61, 20)])
ax.grid(axis="x")
ax.grid(axis="y", visible=False)
ax.tick_params(axis="y", labelsize=30, labelcolor=PALETA["texto"])
ax.spines["left"].set_visible(True)
ax.spines["left"].set_color("#78908c")
fig.subplots_adjust(left=0.27)  # etiquetas largas a la izquierda
guardar_png(fig, INFORME, "variacion-acumulada", simulados=True, pie_eje="Variación acumulada 2019–2025")
