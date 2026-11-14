"""
Gráficos del informe didáctico «Cómo redactar un informe» (DATOS SIMULADOS).
Muestra los tres productos del kit con los mismos datos: PNG, HTML interactivo y CSV descargable.

    python analisis/informes/como-redactar-un-informe/graficos.py
"""
import sys
from pathlib import Path

import pandas as pd
import plotly.graph_objects as go

sys.path.insert(0, str(Path(__file__).resolve().parents[2]))
from lighthouse_graficos import (  # noqa: E402
    PALETA, figura, guardar_datos, guardar_html, guardar_png, leyenda, plantilla_plotly,
)

INFORME = "como-redactar-un-informe"
datos = pd.read_csv(Path(__file__).with_name("datos.csv"))
series = {"Indicador A": ("indicador_a", PALETA["azul"]), "Indicador B": ("indicador_b", PALETA["verde"])}

# Gráfico 1 (PNG estático)
fig, ax = figura()
for etiqueta, (columna, color) in series.items():
    ax.plot(datos["trimestre"], datos[columna], marker="o", color=color, label=etiqueta,
            markeredgecolor="white", markeredgewidth=3)
    ax.annotate(datos[columna].iloc[-1], (len(datos) - 1, datos[columna].iloc[-1]), xytext=(0, 18),
                textcoords="offset points", ha="center", fontweight="bold", color=color)
ax.set_ylim(95, 121)
ax.set_yticks(range(95, 121, 5))
leyenda(ax)
guardar_png(fig, INFORME, "indicadores-trimestrales", simulados=True, pie_eje="Índice, T1 2024 ≈ 100")

# Gráfico 2 (HTML interactivo)
fig = go.Figure()
for etiqueta, (columna, color) in series.items():
    fig.add_trace(go.Scatter(x=datos["trimestre"], y=datos[columna], name=etiqueta, mode="lines+markers",
                             line=dict(color=color, width=3), marker=dict(size=8),
                             hovertemplate="%{y}<extra>" + etiqueta + "</extra>"))
fig.update_layout(template=plantilla_plotly(), yaxis=dict(range=[95, 120], dtick=5))
guardar_html(fig, INFORME, "indicadores-trimestrales", simulados=True)

# Datos descargables (opcional)
guardar_datos(datos.rename(columns={"trimestre": "Trimestre", "indicador_a": "Indicador A", "indicador_b": "Indicador B"}),
              INFORME, "indicadores-trimestrales")
