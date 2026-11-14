"""
Kit de gráficos de Lighthouse D&A.

Produce gráficos que cumplen la especificación del sitio sin ajustes manuales:

- PNG de 1600 × 900 px en src/assets/graficos/<informe>/          → guardar_png()
- HTML interactivo autocontenido en public/interactivos/<informe>/ → guardar_html()
- Datos descargables (opcional) en public/datos/<informe>/         → guardar_datos()

Uso típico (desde la raíz del proyecto):

    python analisis/informes/<informe>/graficos.py

Ver analisis/README.md.
"""
from __future__ import annotations

import struct
from pathlib import Path

import matplotlib

matplotlib.use("Agg")  # sin ventanas: solo exportación
import matplotlib.pyplot as plt
from matplotlib import font_manager

RAIZ = Path(__file__).resolve().parents[1]
INFORMES = RAIZ / "src" / "content" / "publicaciones"

ANCHO, ALTO, DPI = 1600, 900, 100

PALETA = {
    "azul": "#214f5b",
    "verde": "#82b574",
    "verde_azulado": "#4b9590",
    "verde_claro": "#b0cf9f",
    "gris": "#66797f",
    "tinta": "#143b49",
    "texto": "#33474f",
    "rejilla": "#e3ebe5",
    "suave": "#7a8e8f",
}
#: Orden de colores para series sucesivas.
SERIES = [PALETA["azul"], PALETA["verde"], PALETA["verde_azulado"], PALETA["verde_claro"], PALETA["gris"]]

TEXTO_SIMULADOS = "Datos simulados · Lighthouse D&A"


def _fuente() -> str:
    """Primera fuente disponible: DM Sans (identidad del sitio) o alternativas del sistema."""
    disponibles = {f.name for f in font_manager.fontManager.ttflist}
    for nombre in ("DM Sans", "Segoe UI", "Arial", "Helvetica", "DejaVu Sans"):
        if nombre in disponibles:
            return nombre
    return "sans-serif"


FUENTE = _fuente()


def _comprobar_informe(informe: str) -> None:
    if not (INFORMES / f"{informe}.md").exists():
        raise ValueError(
            f"No existe src/content/publicaciones/{informe}.md. "
            "El primer argumento debe ser el nombre del archivo del informe, sin .md."
        )


def _comprobar_nombre(nombre: str) -> None:
    import re

    if not re.fullmatch(r"[a-z0-9]+(?:-[a-z0-9]+)*", nombre):
        raise ValueError(f"Nombre «{nombre}» no válido: usa minúsculas, números y guiones, sin extensión.")


# ─── Gráficos estáticos (matplotlib → PNG) ────────────────────────────────────

def aplicar_estilo() -> None:
    """Aplica el estilo de marca a matplotlib (se llama automáticamente desde figura())."""
    plt.rcParams.update({
        "figure.figsize": (ANCHO / DPI, ALTO / DPI),
        "figure.dpi": DPI,
        "savefig.dpi": DPI,
        "figure.facecolor": "white",
        "axes.facecolor": "white",
        "font.family": FUENTE,
        "font.size": 26,             # ≥ 26 px: legible al mostrarse a ~42 % en la página
        "axes.labelsize": 26,
        "xtick.labelsize": 26,
        "ytick.labelsize": 26,
        "legend.fontsize": 28,
        "axes.edgecolor": PALETA["rejilla"],
        "axes.labelcolor": PALETA["gris"],
        "xtick.color": PALETA["gris"],
        "ytick.color": PALETA["gris"],
        "text.color": PALETA["texto"],
        "axes.prop_cycle": plt.cycler(color=SERIES),
        "axes.spines.top": False,
        "axes.spines.right": False,
        "axes.spines.left": False,
        "axes.grid": True,
        "axes.grid.axis": "y",
        "axes.axisbelow": True,       # la rejilla queda detrás de barras y líneas
        "grid.color": PALETA["rejilla"],
        "grid.linewidth": 2,
        "lines.linewidth": 6,
        "lines.markersize": 14,
        "patch.linewidth": 0,
        "legend.frameon": False,
        "axes.formatter.use_locale": False,
    })


def figura(**kwargs):
    """Crea una figura de 1600 × 900 px con el estilo de marca. Devuelve (fig, ax)."""
    aplicar_estilo()
    fig, ax = plt.subplots(**kwargs)
    # Márgenes por defecto; cada script puede cambiarlos con fig.subplots_adjust(left=…)
    # (por ejemplo, para etiquetas largas en barras horizontales).
    fig.subplots_adjust(left=0.075, right=0.965, top=0.86, bottom=0.14)
    ax.tick_params(length=0, pad=12)
    return fig, ax


def leyenda(ax, **kwargs) -> None:
    """Leyenda horizontal sobre el gráfico, alineada a la izquierda."""
    opciones = dict(loc="lower left", bbox_to_anchor=(0, 1.02), ncol=4, handlelength=1.6, columnspacing=2.2, borderaxespad=0)
    opciones.update(kwargs)
    ax.legend(**opciones)


def formato_numero(valor: float, decimales: int = 0, sufijo: str = "") -> str:
    """Formato español: coma decimal y espacio para miles (12 500,5)."""
    texto = f"{valor:,.{decimales}f}".replace(",", " ").replace(".", ",")
    return f"{texto}{sufijo}"


def guardar_png(fig, informe: str, nombre: str, *, simulados: bool = False, pie_eje: str | None = None) -> Path:
    """
    Guarda la figura como PNG de 1600 × 900 px en src/assets/graficos/<informe>/<nombre>.png.

    simulados: añade «Datos simulados · Lighthouse D&A» abajo a la derecha (obligatorio si lo son).
    pie_eje:   texto pequeño abajo a la izquierda (p. ej. «Índice, 2019 = 100»).
    """
    _comprobar_informe(informe)
    _comprobar_nombre(nombre)
    fig.set_size_inches(ANCHO / DPI, ALTO / DPI)
    if simulados:
        fig.text(0.975, 0.03, TEXTO_SIMULADOS, ha="right", va="bottom", fontsize=22, color=PALETA["suave"])
    if pie_eje:
        fig.text(fig.subplotpars.left, 0.03, pie_eje, ha="left", va="bottom", fontsize=22, color=PALETA["suave"])
    destino = RAIZ / "src" / "assets" / "graficos" / informe / f"{nombre}.png"
    destino.parent.mkdir(parents=True, exist_ok=True)
    # Sin bbox_inches="tight": cambiaría el tamaño exigido.
    fig.savefig(destino, dpi=DPI, facecolor="white")
    plt.close(fig)
    with destino.open("rb") as f:
        cabecera = f.read(24)
    ancho, alto = struct.unpack(">II", cabecera[16:24])
    if (ancho, alto) != (ANCHO, ALTO):
        raise RuntimeError(f"{destino} mide {ancho} × {alto} px; se esperaban {ANCHO} × {ALTO}.")
    print(f"✓ PNG  {destino.relative_to(RAIZ).as_posix()}  ({ancho} × {alto} px)")
    return destino


# ─── Gráficos interactivos (Plotly → HTML) ────────────────────────────────────

def plantilla_plotly():
    """Plantilla Plotly de marca. Úsala con fig.update_layout(template=plantilla_plotly())."""
    import plotly.graph_objects as go

    return go.layout.Template(layout=dict(
        font=dict(family=f"{FUENTE}, system-ui, Arial, sans-serif", size=14, color=PALETA["texto"]),
        colorway=SERIES,
        paper_bgcolor="white",
        plot_bgcolor="white",
        margin=dict(l=56, r=24, t=56, b=48),
        hovermode="x unified",
        hoverlabel=dict(bgcolor=PALETA["tinta"], font=dict(color="white", size=13)),
        legend=dict(orientation="h", x=0, y=1.08, xanchor="left", yanchor="bottom", font=dict(size=13)),
        xaxis=dict(showgrid=False, linecolor=PALETA["rejilla"], ticks="", tickfont=dict(color=PALETA["gris"])),
        yaxis=dict(gridcolor=PALETA["rejilla"], zeroline=False, ticks="", tickfont=dict(color=PALETA["gris"])),
    ))


def guardar_html(fig, informe: str, nombre: str, *, simulados: bool = False) -> Path:
    """
    Guarda una figura Plotly como HTML autocontenido en public/interactivos/<informe>/<nombre>.html.
    Incluye la librería (funciona sin conexión), ocupa todo el marco y no se indexa en buscadores.
    """
    _comprobar_informe(informe)
    _comprobar_nombre(nombre)
    if simulados:
        fig.add_annotation(text="Datos simulados", xref="paper", yref="paper", x=1, y=-0.12,
                           xanchor="right", showarrow=False, font=dict(size=11, color=PALETA["suave"]))
    destino = RAIZ / "public" / "interactivos" / informe / f"{nombre}.html"
    destino.parent.mkdir(parents=True, exist_ok=True)
    html = fig.to_html(
        include_plotlyjs=True,
        full_html=True,
        default_width="100%",
        default_height="100%",
        config={"responsive": True, "displaylogo": False, "modeBarButtonsToRemove": ["lasso2d", "select2d", "toImage"]},
    )
    html = html.replace(
        "<head>",
        '<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">'
        '<meta name="robots" content="noindex"><style>html,body{height:100%;margin:0;background:#fff}</style>',
        1,
    )
    destino.write_text(html, encoding="utf-8")
    kb = destino.stat().st_size / 1024
    print(f"✓ HTML {destino.relative_to(RAIZ).as_posix()}  ({kb:,.0f} KB)")
    if kb > 5000:
        raise RuntimeError(f"{destino.name} pesa {kb:,.0f} KB; el máximo es 5000 KB.")
    return destino


# ─── Datos descargables (opcional) ────────────────────────────────────────────

def guardar_datos(df, informe: str, nombre: str) -> str:
    """
    Guarda un DataFrame como CSV (UTF-8 con BOM, separador «;» y coma decimal: abre bien en Excel en español)
    en public/datos/<informe>/<nombre>.csv. Devuelve la ruta pública para el campo `datasets` del informe.
    """
    _comprobar_informe(informe)
    _comprobar_nombre(nombre)
    destino = RAIZ / "public" / "datos" / informe / f"{nombre}.csv"
    destino.parent.mkdir(parents=True, exist_ok=True)
    df.to_csv(destino, index=False, sep=";", decimal=",", encoding="utf-8-sig")
    ruta = f"/datos/{informe}/{nombre}.csv"
    print(f"✓ CSV  {destino.relative_to(RAIZ).as_posix()}  → datasets: file: {ruta}")
    return ruta
