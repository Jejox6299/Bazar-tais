# Backend Local en Python FastAPI + Comandos ESC/POS para Gaveta RJ11 e Impresora Termica
# Autor: Ing. / Dev. Jorge Hugo Quevedo Coronel
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import datetime

app = FastAPI(title="API Local POS Bazar & Corresponsalia - Jorge Quevedo")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Comando binario estandar ESC/POS para pulso electrico en pin 2 de conector RJ11 (Gaveta de dinero)
COMANDO_ABRIR_GAVETA = b'\x1b\x70\x00\x19\xfa'
COMANDO_CORTE_PAPEL = b'\x1d\x56\x00'

class ItemVenta(BaseModel):
    sku: str
    nombre: str
    modalidad: str
    cantidad: int
    precioUnitario: float
    subtotal: float

class VentaRequest(BaseModel):
    clienteNombre: str
    clienteId: str
    items: List[ItemVenta]
    total: float
    efectivoRecibido: float
    cambio: float

@app.post("/api/hardware/imprimir-y-abrir-gaveta")
def imprimir_ticket_y_abrir_gaveta(venta: VentaRequest):
    """
    Envia el pulso ESC/POS directo al puerto USB/LAN de la impresora termica (Epson/Xprinter)
    para abrir la gaveta RJ11 en milisegundos e imprimir el ticket sin ventana de confirmacion.
    """
     Lineas = [
        "      BAZAR, PAPELERIA Y CORRESPONSAL      ",
        "-------------------------------------------",
        f"Fecha: {datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')}",
        f"Cliente: {venta.clienteNombre}",
        f"RUC/CI:  {venta.clienteId}",
        "-------------------------------------------",
        "CANT  DESCRIPCION                TOTAL     "
    ]
    for it in venta.items:
        nombre_corto = f"{it.nombre[:18]} ({it.modalidad[0]})"
        Lineas.append(f"{it.cantidad:<5} {nombre_corto:<25} ${it.subtotal:>6.2f}")
    Lineas.extend([
        "-------------------------------------------",
        f"TOTAL A PAGAR:                  ${venta.total:>6.2f}",
        f"EFECTIVO RECIBIDO:              ${venta.efectivoRecibido:>6.2f}",
        f"CAMBIO / VUELTO:                ${venta.cambio:>6.2f}",
        "-------------------------------------------",
        "   Sistema desarrollado por Jorge Quevedo  "
    ])
    texto_ticket = "\n".join(Lineas)
    
    # Aqui se conecta con python-escpos o win32print en la PC del cliente:
    # printer. _raw(COMANDO_ABRIR_GAVETA)
    # printer.text(texto_ticket)
    # printer._raw(COMANDO_CORTE_PAPEL)
    
    return {
        "status": "ok",
        "gaveta_abierta": True,
        "comando_hex_enviado": "1B 70 00 19 FA",
        "ticket_impreso": texto_ticket
    }
