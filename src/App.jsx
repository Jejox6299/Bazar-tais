import React, { useState, useMemo, useEffect } from 'react';

const PRODUCTOS_INICIALES = [
  { id: 1, sku: 'PAP-001', codigoBarras: '78610001', nombre: 'Esfero Azul Bic Cristal', categoria: 'Papelería', precioUnidad: 0.35, precioCaja: 14.50, unidadesPorCaja: 50, stockCajas: 8, stockUnidades: 34, stockMinimo: 20 },
  { id: 2, sku: 'PAP-002', codigoBarras: '78610002', nombre: 'Resma Papel Bond A4 75g', categoria: 'Papelería', precioUnidad: 0.02, precioCaja: 4.75, unidadesPorCaja: 500, stockCajas: 15, stockUnidades: 280, stockMinimo: 100 },
  { id: 3, sku: 'PAP-003', codigoBarras: '78610003', nombre: 'Cuaderno Universitario 100H Cuadros', categoria: 'Papelería', precioUnidad: 1.50, precioCaja: 15.60, unidadesPorCaja: 12, stockCajas: 6, stockUnidades: 9, stockMinimo: 10 },
  { id: 4, sku: 'BAZ-001', codigoBarras: '78610004', nombre: 'Silicona Líquida 100ml Pelikan', categoria: 'Bazar', precioUnidad: 1.25, precioCaja: 12.00, unidadesPorCaja: 12, stockCajas: 4, stockUnidades: 11, stockMinimo: 6 },
  { id: 5, sku: 'BAZ-002', codigoBarras: '78610005', nombre: 'Cartulina Iris Colores Surtidos', categoria: 'Papelería', precioUnidad: 0.25, precioCaja: 18.00, unidadesPorCaja: 100, stockCajas: 3, stockUnidades: 65, stockMinimo: 30 },
  { id: 6, sku: 'SER-001', codigoBarras: '78610006', nombre: 'Copia / Impresión B&N A4', categoria: 'Servicios', precioUnidad: 0.05, precioCaja: 4.00, unidadesPorCaja: 100, stockCajas: 99, stockUnidades: 999, stockMinimo: 10 }
];

// Configuración Corporativa Oficial de los 5 Bancos de Bazar Tais
const ENTIDADES_BANCARIAS = [
  {
    id: 'guayaquil',
    nombre: 'Banco Guayaquil',
    subtitulo: 'Banco del Barrio',
    hexBg: '#D0006F',
    hexText: '#FFFFFF',
    hexBorder: '#9D174D',
    hexLightBg: '#FDF2F8',
    hexBadgeBg: '#FCE7F3',
    hexBadgeText: '#9D174D',
    cupoDigital: 1150.00,
    efectivoEnGaveta: 360.00,
    comisionFija: 0.25
  },
  {
    id: 'pichincha',
    nombre: 'Banco Pichincha',
    subtitulo: 'CNB Mi Vecino',
    hexBg: '#FFDD00',
    hexText: '#0F265C',
    hexBorder: '#EAB308',
    hexLightBg: '#FEFCE8',
    hexBadgeBg: '#FEF08A',
    hexBadgeText: '#0F265C',
    cupoDigital: 1350.00,
    efectivoEnGaveta: 480.00,
    comisionFija: 0.25
  },
  {
    id: 'pacifico',
    nombre: 'Banco del Pacífico',
    subtitulo: 'Tu Banco Banco Aquí',
    hexBg: '#009CDE',
    hexText: '#FFFFFF',
    hexBorder: '#0284C7',
    hexLightBg: '#F0F9FF',
    hexBadgeBg: '#E0F2FE',
    hexBadgeText: '#0369A1',
    cupoDigital: 1100.00,
    efectivoEnGaveta: 310.00,
    comisionFija: 0.25
  },
  {
    id: 'bolivariano',
    nombre: 'Banco Bolivariano',
    subtitulo: 'Corresponsal PuntoBB',
    hexBg: '#00838F',
    hexText: '#FFFFFF',
    hexBorder: '#0F766E',
    hexLightBg: '#F0FDFA',
    hexBadgeBg: '#CCFBF1',
    hexBadgeText: '#115E59',
    cupoDigital: 1400.00,
    efectivoEnGaveta: 520.00,
    comisionFija: 0.25
  },
  {
    id: 'produbanco',
    nombre: 'Banco Produbanco',
    subtitulo: 'Red Produbanco / Servipagos',
    hexBg: '#00693C',
    hexText: '#FFFFFF',
    hexBorder: '#15803D',
    hexLightBg: '#F0FDF4',
    hexBadgeBg: '#DCFCE7',
    hexBadgeText: '#166534',
    cupoDigital: 950.00,
    efectivoEnGaveta: 240.00,
    comisionFija: 0.25
  }
];

const VENTAS_INICIALES = [
  { id: 'FAC-00101', hora: '08:45', cliente: 'CONSUMIDOR FINAL', total: 6.40, items: 4 },
  { id: 'FAC-00102', hora: '09:20', cliente: 'María Fernanda Vera', total: 14.50, items: 1 },
  { id: 'FAC-00103', hora: '10:15', cliente: 'CONSUMIDOR FINAL', total: 3.85, items: 6 }
];

const MOVIMIENTOS_INICIALES = [
  { id: 'VOU-88410', hora: '08:55', bancoId: 'bolivariano', banco: 'Banco Bolivariano (PuntoBB)', tipo: 'DEPÓSITO', monto: 90.00, comision: 0.25 },
  { id: 'VOU-88412', hora: '09:15', bancoId: 'pichincha', banco: 'Banco Pichincha (CNB Mi Vecino)', tipo: 'DEPÓSITO', monto: 80.00, comision: 0.25 },
  { id: 'VOU-88419', hora: '09:42', bancoId: 'guayaquil', banco: 'Banco Guayaquil (Banco del Barrio)', tipo: 'RETIRO', monto: 40.00, comision: 0.25 },
  { id: 'VOU-88425', hora: '10:18', bancoId: 'pacifico', banco: 'Banco del Pacífico (Tu Banco Banco Aquí)', tipo: 'PAGO SERVICIO', monto: 55.00, comision: 0.25 },
  { id: 'VOU-88431', hora: '10:45', bancoId: 'produbanco', banco: 'Banco Produbanco (Red Produbanco / Servipagos)', tipo: 'DEPÓSITO', monto: 60.00, comision: 0.25 }
];

export default function App() {
  const [moduloActivo, setModuloActivo] = useState('pos');

  const [productos, setProductos] = useState(() => {
    const guardado = localStorage.getItem('bazar_tais_v2_productos');
    return guardado ? JSON.parse(guardado) : PRODUCTOS_INICIALES;
  });

  const [bancos, setBancos] = useState(() => {
    const guardado = localStorage.getItem('bazar_tais_v2_bancos');
    return guardado ? JSON.parse(guardado) : ENTIDADES_BANCARIAS;
  });

  const [ventasBazar, setVentasBazar] = useState(() => {
    const guardado = localStorage.getItem('bazar_tais_v2_ventas');
    return guardado ? JSON.parse(guardado) : VENTAS_INICIALES;
  });

  const [movimientosBancarios, setMovimientosBancarios] = useState(() => {
    const guardado = localStorage.getItem('bazar_tais_v2_movimientos');
    return guardado ? JSON.parse(guardado) : MOVIMIENTOS_INICIALES;
  });

  useEffect(() => { localStorage.setItem('bazar_tais_v2_productos', JSON.stringify(productos)); }, [productos]);
  useEffect(() => { localStorage.setItem('bazar_tais_v2_bancos', JSON.stringify(bancos)); }, [bancos]);
  useEffect(() => { localStorage.setItem('bazar_tais_v2_ventas', JSON.stringify(ventasBazar)); }, [ventasBazar]);
  useEffect(() => { localStorage.setItem('bazar_tais_v2_movimientos', JSON.stringify(movimientosBancarios)); }, [movimientosBancarios]);

  const [busqueda, setBusqueda] = useState('');
  const [carrito, setCarrito] = useState([
    { id: 1, sku: 'PAP-001', nombre: 'Esfero Azul Bic Cristal', modalidad: 'Unidad', precioUnitario: 0.35, cantidad: 2 },
    { id: 3, sku: 'PAP-003', nombre: 'Cuaderno Universitario 100H Cuadros', modalidad: 'Unidad', precioUnitario: 1.50, cantidad: 1 }
  ]);
  const [clienteNombre, setClienteNombre] = useState('CONSUMIDOR FINAL');
  const [clienteRuc, setClienteRuc] = useState('9999999999999');
  const [efectivoRecibido, setEfectivoRecibido] = useState('5.00');
  const [estadoGaveta, setEstadoGaveta] = useState('CERRADA');
  const [ticketModal, setTicketModal] = useState(null);
  const [notificacion, setNotificacion] = useState(null);

  const [modalNuevoProd, setModalNuevoProd] = useState(false);
  const [nuevoProd, setNuevoProd] = useState({
    sku: '', codigoBarras: '', nombre: '', categoria: 'Papelería',
    precioUnidad: '', precioCaja: '', unidadesPorCaja: '12', stockCajas: '5', stockUnidades: '20'
  });

  const [bancoSeleccionado, setBancoSeleccionado] = useState('guayaquil');
  const [tipoOperacionBanco, setTipoOperacionBanco] = useState('DEPÓSITO');
  const [montoBanco, setMontoBanco] = useState('');
  const [voucherId, setVoucherId] = useState('VOU-99304');

  const [efectivoContadoFisico, setEfectivoContadoFisico] = useState('');

  const bancoActivoObj = useMemo(() => {
    return bancos.find((b) => b.id === bancoSeleccionado) || bancos[0];
  }, [bancos, bancoSeleccionado]);

  const obtenerEstiloBanco = (bancoId) => {
    return bancos.find((b) => b.id === bancoId) || ENTIDADES_BANCARIAS[0];
  };

  const mostrarAlerta = (mensaje) => {
    setNotificacion(mensaje);
    setTimeout(() => setNotificacion(null), 4000);
  };

  const reiniciarDatosDemo = () => {
    localStorage.removeItem('bazar_tais_v2_productos');
    localStorage.removeItem('bazar_tais_v2_bancos');
    localStorage.removeItem('bazar_tais_v2_ventas');
    localStorage.removeItem('bazar_tais_v2_movimientos');
    setProductos(PRODUCTOS_INICIALES);
    setBancos(ENTIDADES_BANCARIAS);
    setVentasBazar(VENTAS_INICIALES);
    setMovimientosBancarios(MOVIMIENTOS_INICIALES);
    mostrarAlerta('🔄 Datos de demostración restaurados.');
  };

  const totalCarrito = useMemo(() => {
    return carrito.reduce((acc, item) => acc + item.precioUnitario * item.cantidad, 0);
  }, [carrito]);

  const cambioVuelto = useMemo(() => {
    const recibido = parseFloat(efectivoRecibido) || 0;
    return Math.max(0, recibido - totalCarrito);
  }, [efectivoRecibido, totalCarrito]);

  const agregarAlCarrito = (producto, modalidad = 'Unidad') => {
    const precio = modalidad === 'Unidad' ? producto.precioUnidad : producto.precioCaja;
    setCarrito((prev) => {
      const idx = prev.findIndex((i) => i.id === producto.id && i.modalidad === modalidad);
      if (idx > -1) {
        const copia = [...prev];
        copia[idx].cantidad += 1;
        return copia;
      }
      return [...prev, { id: producto.id, sku: producto.sku, nombre: producto.nombre, modalidad, precioUnitario: precio, cantidad: 1 }];
    });
  };

  const cambiarCantidadCarrito = (index, delta) => {
    setCarrito((prev) => {
      const copia = [...prev];
      copia[index].cantidad += delta;
      if (copia[index].cantidad <= 0) copia.splice(index, 1);
      return copia;
    });
  };

  const procesarCobroPOS = () => {
    if (carrito.length === 0) return;
    const recibido = parseFloat(efectivoRecibido) || totalCarrito;

    setProductos((prev) =>
      prev.map((prod) => {
        const itemsProd = carrito.filter((c) => c.id === prod.id);
        let nuevasCajas = prod.stockCajas;
        let nuevasUnidades = prod.stockUnidades;
        itemsProd.forEach((it) => {
          if (it.modalidad === 'Caja') nuevasCajas = Math.max(0, nuevasCajas - it.cantidad);
          else nuevasUnidades = Math.max(0, nuevasUnidades - it.cantidad);
        });
        return { ...prod, stockCajas: nuevasCajas, stockUnidades: nuevasUnidades };
      })
    );

    const numFactura = `FAC-00${101 + ventasBazar.length}`;
    const horaActual = new Date().toLocaleTimeString('es-EC', { hour: '2-digit', minute: '2-digit' });

    setVentasBazar((prev) => [
      { id: numFactura, hora: horaActual, cliente: clienteNombre, total: totalCarrito, items: carrito.reduce((a, b) => a + b.cantidad, 0) },
      ...prev
    ]);

    setEstadoGaveta('ABIERTA (PULSO RJ11 ENVIADO)');
    setTimeout(() => setEstadoGaveta('CERRADA'), 5000);

    setTicketModal({
      numero: numFactura,
      fecha: new Date().toLocaleString('es-EC'),
      cliente: clienteNombre,
      ruc: clienteRuc,
      items: [...carrito],
      total: totalCarrito,
      recibido,
      cambio: Math.max(0, recibido - totalCarrito)
    });

    setCarrito([]);
    setEfectivoRecibido('');
    mostrarAlerta('⚡ Pulso eléctrico RJ11 enviado: Gaveta abierta + Ticket térmico generado.');
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'F9') {
        e.preventDefault();
        setEstadoGaveta('ABIERTA (APERTURA MANUAL F9)');
        mostrarAlerta('🔓 Pulso ESC/POS enviado manualmente a la gaveta RJ11.');
        setTimeout(() => setEstadoGaveta('CERRADA'), 4000);
      }
      if (e.key === 'F12' && moduloActivo === 'pos' && carrito.length > 0) {
        e.preventDefault();
        procesarCobroPOS();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  });

  const fraccionarCaja = (prodId) => {
    setProductos((prev) =>
      prev.map((p) => {
        if (p.id === prodId && p.stockCajas > 0) {
          mostrarAlerta(`📦 Se abrió 1 Caja de "${p.nombre}" → +${p.unidadesPorCaja} unidades sueltas agregadas.`);
          return {
            ...p,
            stockCajas: p.stockCajas - 1,
            stockUnidades: p.stockUnidades + p.unidadesPorCaja
          };
        }
        return p;
      })
    );
  };

  const guardarNuevoProducto = (e) => {
    e.preventDefault();
    const creado = {
      id: Date.now(),
      sku: nuevoProd.sku || `PRD-${productos.length + 1}`,
      codigoBarras: nuevoProd.codigoBarras || `7861000${productos.length + 1}`,
      nombre: nuevoProd.nombre,
      categoria: nuevoProd.categoria,
      precioUnidad: parseFloat(nuevoProd.precioUnidad) || 0.50,
      precioCaja: parseFloat(nuevoProd.precioCaja) || 10.00,
      unidadesPorCaja: parseInt(nuevoProd.unidadesPorCaja) || 12,
      stockCajas: parseInt(nuevoProd.stockCajas) || 1,
      stockUnidades: parseInt(nuevoProd.stockUnidades) || 10,
      stockMinimo: 5
    };
    setProductos((prev) => [creado, ...prev]);
    setModalNuevoProd(false);
    setNuevoProd({ sku: '', codigoBarras: '', nombre: '', categoria: 'Papelería', precioUnidad: '', precioCaja: '', unidadesPorCaja: '12', stockCajas: '5', stockUnidades: '20' });
    mostrarAlerta(`✅ Producto "${creado.nombre}" guardado en el inventario local.`);
  };

  const registrarOperacionBancaria = (e) => {
    e.preventDefault();
    const montoNum = parseFloat(montoBanco);
    if (!montoNum || montoNum <= 0) return;

    const entidadObj = bancos.find((b) => b.id === bancoSeleccionado);
    const horaActual = new Date().toLocaleTimeString('es-EC', { hour: '2-digit', minute: '2-digit' });

    setBancos((prev) =>
      prev.map((b) => {
        if (b.id !== bancoSeleccionado) return b;
        if (tipoOperacionBanco === 'RETIRO') {
          return { ...b, efectivoEnGaveta: b.efectivoEnGaveta - montoNum, cupoDigital: b.cupoDigital + montoNum };
        } else {
          return { ...b, efectivoEnGaveta: b.efectivoEnGaveta + montoNum, cupoDigital: b.cupoDigital - montoNum };
        }
      })
    );

    setMovimientosBancarios((prev) => [
      {
        id: voucherId || `VOU-${Math.floor(10000 + Math.random() * 90000)}`,
        hora: horaActual,
        bancoId: entidadObj.id,
        banco: `${entidadObj.nombre} (${entidadObj.subtitulo})`,
        tipo: tipoOperacionBanco,
        monto: montoNum,
        comision: entidadObj.comisionFija
      },
      ...prev
    ]);

    setEstadoGaveta(`ABIERTA (${entidadObj.nombre.toUpperCase()})`);
    setTimeout(() => setEstadoGaveta('CERRADA'), 4000);

    setMontoBanco('');
    setVoucherId(`VOU-${Math.floor(10000 + Math.random() * 90000)}`);
    mostrarAlerta(`🏦 ${tipoOperacionBanco} en ${entidadObj.nombre} por $${montoNum.toFixed(2)} registrado.`);
  };

  const totalVentasPropias = ventasBazar.reduce((a, b) => a + b.total, 0);
  const totalEfectivoBancos = bancos.reduce((a, b) => a + b.efectivoEnGaveta, 0);
  const totalComisionesBancos = movimientosBancarios.reduce((a, b) => a + b.comision, 0);
  const fondoInicialCaja = 50.00;
  const totalEfectivoEsperadoGaveta = fondoInicialCaja + totalVentasPropias + totalEfectivoBancos;

  const productosFiltrados = productos.filter(
    (p) =>
      p.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      p.sku.toLowerCase().includes(busqueda.toLowerCase()) ||
      p.codigoBarras.includes(busqueda)
  );

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 flex flex-col font-sans">
      <header className="bg-[#003366] text-white px-6 py-3 shadow-md flex flex-wrap justify-between items-center gap-4 no-print">
        <div className="flex items-center gap-3">
          <div className="bg-amber-400 text-slate-950 font-black px-3 py-1.5 rounded text-sm tracking-wider">
            POS LOCAL-FIRST
          </div>
          <div>
            <h1 className="font-bold text-lg leading-tight">
              BAZAR Y PAPELERÍA TAIS — SISTEMA POS, INVENTARIO Y CORRESPONSALÍA
            </h1>
            <p className="text-xs text-blue-200">
              Portete de Tarqui y José de Antepara 3401 (Diag. Farmacia Burgos) | Ing. / Dev: Jorge Hugo Quevedo Coronel
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className={`px-3 py-1.5 rounded text-xs font-bold border ${
            estadoGaveta.includes('ABIERTA')
              ? 'bg-emerald-500 text-white border-emerald-300 animate-pulse'
              : 'bg-slate-800 text-slate-200 border-slate-600'
          }`}>
            🗄️ GAVETA RJ11: {estadoGaveta}
          </div>
          <button
            onClick={() => {
              setEstadoGaveta('ABIERTA (APERTURA MANUAL)');
              mostrarAlerta('🔓 Pulso ESC/POS enviado manualmente a la gaveta de dinero.');
              setTimeout(() => setEstadoGaveta('CERRADA'), 4000);
            }}
            className="bg-blue-700 hover:bg-blue-600 text-xs font-semibold px-3 py-1.5 rounded border border-blue-500 transition"
          >
            Abrir Gaveta (F9)
          </button>
          <button
            onClick={reiniciarDatosDemo}
            className="bg-slate-700 hover:bg-slate-600 text-xs px-2.5 py-1.5 rounded border border-slate-500 transition"
            title="Restaurar valores iniciales de demostración"
          >
            🔄 Reiniciar Demo
          </button>
        </div>
      </header>

      <nav className="bg-white border-b border-slate-200 px-6 flex flex-wrap gap-2 no-print">
        {[
          { id: 'pos', label: '🛒 1. Punto de Venta (POS) e Impresión' },
          { id: 'bancos', label: '🏦 2. Corresponsalía Multibanco (5 Entidades)' },
          { id: 'inventario', label: '📦 3. Inventario y Fraccionamiento (Cajas/Unidades)' },
          { id: 'contable', label: '📊 4. Contabilidad, Arqueo y Cierre Z' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setModuloActivo(tab.id)}
            className={`px-4 py-3 text-sm font-bold border-b-4 transition ${
              moduloActivo === tab.id
                ? 'border-[#003366] text-[#003366] bg-blue-50/60'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      {notificacion && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white px-5 py-3 rounded-lg shadow-xl border-l-4 border-emerald-400 text-sm font-medium no-print">
          {notificacion}
        </div>
      )}

      <main className="flex-1 p-6 max-w-7xl w-full mx-auto no-print">
        {moduloActivo === 'pos' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7 bg-white rounded-xl shadow-sm border border-slate-200 p-5 flex flex-col">
              <div className="flex flex-wrap justify-between items-center gap-2 mb-4">
                <h2 className="font-bold text-slate-800 text-base">
                  Catálogo de Papelería y Bazar (Escaneo Código de Barras)
                </h2>
                <button
                  onClick={() => {
                    const randomProd = productos[Math.floor(Math.random() * productos.length)];
                    agregarAlCarrito(randomProd, 'Unidad');
                    mostrarAlerta(`🔫 Lector Láser: "${randomProd.nombre}" (${randomProd.codigoBarras}) agregado.`);
                  }}
                  className="bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold px-3 py-2 rounded-lg"
                >
                  🔫 Simular Lector de Código de Barras
                </button>
              </div>

              <input
                type="text"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                placeholder="Buscar por nombre, código SKU (ej. PAP-001) o escanear con lector USB..."
                className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm mb-4 focus:outline-none focus:ring-2 focus:ring-[#003366]"
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 overflow-y-auto max-h-[460px] pr-1">
                {productosFiltrados.map((prod) => (
                  <div
                    key={prod.id}
                    className="border border-slate-200 rounded-lg p-3.5 hover:border-blue-500 transition bg-slate-50/50 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex justify-between items-start text-xs text-slate-500 mb-1">
                        <span className="font-mono font-semibold text-blue-900 bg-blue-100 px-2 py-0.5 rounded">
                          {prod.sku}
                        </span>
                        <span>Stock: {prod.stockUnidades} und. | {prod.stockCajas} cajas</span>
                      </div>
                      <h3 className="font-bold text-slate-800 text-sm mb-2">{prod.nombre}</h3>
                    </div>

                    <div className="grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-slate-200">
                      <button
                        onClick={() => agregarAlCarrito(prod, 'Unidad')}
                        className="bg-[#003366] hover:bg-blue-900 text-white text-xs font-bold py-2 px-2 rounded transition"
                      >
                        + Unidad (${prod.precioUnidad.toFixed(2)})
                      </button>
                      <button
                        onClick={() => agregarAlCarrito(prod, 'Caja')}
                        className="bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold py-2 px-2 rounded transition"
                      >
                        + Caja/Resma (${prod.precioCaja.toFixed(2)})
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-5 bg-white rounded-xl shadow-sm border border-slate-200 p-5 flex flex-col justify-between">
              <div>
                <h2 className="font-bold text-slate-800 text-base mb-3 border-b pb-2">
                  Comprobante de Venta Activo
                </h2>

                <div className="grid grid-cols-2 gap-2 mb-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1">Cliente</label>
                    <input
                      type="text"
                      value={clienteNombre}
                      onChange={(e) => setClienteNombre(e.target.value)}
                      className="w-full border border-slate-300 rounded px-2.5 py-1.5 text-xs font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1">RUC / Cédula</label>
                    <input
                      type="text"
                      value={clienteRuc}
                      onChange={(e) => setClienteRuc(e.target.value)}
                      className="w-full border border-slate-300 rounded px-2.5 py-1.5 text-xs font-mono"
                    />
                  </div>
                </div>

                <div className="border border-slate-200 rounded-lg overflow-hidden mb-4 max-h-60 overflow-y-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-100 text-slate-600 uppercase">
                      <tr>
                        <th className="py-2 px-3">Producto</th>
                        <th className="py-2 px-2 text-center">Cant.</th>
                        <th className="py-2 px-3 text-right">Subtotal</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {carrito.length === 0 ? (
                        <tr>
                          <td colSpan="3" className="py-8 text-center text-slate-400">
                            Escanea o selecciona un producto para facturar
                          </td>
                        </tr>
                      ) : (
                        carrito.map((item, idx) => (
                          <tr key={`${item.id}-${item.modalidad}`}>
                            <td className="py-2 px-3">
                              <div className="font-semibold text-slate-800">{item.nombre}</div>
                              <span className="text-[11px] text-blue-700 font-medium">
                                Modalidad: {item.modalidad} (${item.precioUnitario.toFixed(2)})
                              </span>
                            </td>
                            <td className="py-2 px-2 text-center">
                              <div className="inline-flex items-center border rounded bg-slate-50">
                                <button
                                  onClick={() => cambiarCantidadCarrito(idx, -1)}
                                  className="px-2 py-0.5 font-bold hover:bg-slate-200"
                                >
                                  -
                                </button>
                                <span className="px-2 font-bold">{item.cantidad}</span>
                                <button
                                  onClick={() => cambiarCantidadCarrito(idx, 1)}
                                  className="px-2 py-0.5 font-bold hover:bg-slate-200"
                                >
                                  +
                                </button>
                              </div>
                            </td>
                            <td className="py-2 px-3 text-right font-bold text-slate-900">
                              ${(item.precioUnitario * item.cantidad).toFixed(2)}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-sm font-bold text-slate-600">TOTAL A COBRAR:</span>
                  <span className="text-3xl font-black text-[#003366]">${totalCarrito.toFixed(2)}</span>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">
                      Efectivo Recibido ($):
                    </label>
                    <input
                      type="number"
                      step="0.10"
                      value={efectivoRecibido}
                      onChange={(e) => setEfectivoRecibido(e.target.value)}
                      placeholder={totalCarrito.toFixed(2)}
                      className="w-full border border-slate-300 rounded-lg px-3 py-2 text-base font-bold text-slate-900 bg-white"
                    />
                  </div>
                  <div className="bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-1.5 flex flex-col justify-center">
                    <span className="text-xs font-bold text-emerald-800">CAMBIO / VUELTO:</span>
                    <span className="text-2xl font-black text-emerald-700">${cambioVuelto.toFixed(2)}</span>
                  </div>
                </div>

                <button
                  onClick={procesarCobroPOS}
                  disabled={carrito.length === 0}
                  className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-300 text-white font-black py-3.5 rounded-xl shadow transition text-sm tracking-wide"
                >
                  🖨️ COBRAR + IMPRIMIR TICKET + ABRIR GAVETA (F12)
                </button>
              </div>
            </div>
          </div>
        )}

        {moduloActivo === 'bancos' && (
          <div className="space-y-6">
            <div className="bg-white border-l-4 border-[#003366] p-4 rounded-r-xl shadow-sm flex flex-wrap justify-between items-center gap-3 text-sm">
              <div>
                <strong className="text-[#003366]">Aislamiento Contable Multibanco (Haz clic en cualquier tarjeta para cambiar de banco):</strong>
                <p className="text-xs text-slate-600 mt-0.5">
                  Cada entidad opera con su propia identidad visual y saldo separado para evitar confusiones de cajero y garantizar un Cierre Z exacto.
                </p>
              </div>
              <span
                style={{ backgroundColor: bancoActivoObj.hexBg, color: bancoActivoObj.hexText }}
                className="px-3.5 py-1.5 rounded-lg text-xs font-black uppercase shadow-sm"
              >
                Activo: {bancoActivoObj.nombre}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
              {bancos.map((b) => {
                const esActivo = b.id === bancoSeleccionado;
                return (
                  <div
                    key={b.id}
                    onClick={() => setBancoSeleccionado(b.id)}
                    style={{
                      borderColor: esActivo ? b.hexBg : '#E2E8F0',
                      backgroundColor: esActivo ? b.hexLightBg : '#FFFFFF'
                    }}
                    className={`cursor-pointer rounded-xl overflow-hidden transition-all border-2 ${
                      esActivo ? 'shadow-md scale-[1.02]' : 'shadow-sm hover:shadow-md'
                    }`}
                  >
                    <div
                      style={{ backgroundColor: b.hexBg, color: b.hexText }}
                      className="px-3.5 py-3 flex justify-between items-center"
                    >
                      <div>
                        <div className="font-black text-xs uppercase tracking-wide leading-tight">
                          {b.nombre}
                        </div>
                        <div className="text-[11px] opacity-90 font-semibold">
                          {b.subtitulo}
                        </div>
                      </div>
                      {esActivo && (
                        <span className="text-xs font-black bg-white/25 px-2 py-0.5 rounded">
                          ✓
                        </span>
                      )}
                    </div>
                    <div className="p-3.5 space-y-2">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-slate-500 font-medium">Efectivo Gaveta:</span>
                        <span className="font-black text-slate-900 text-sm">
                          ${b.efectivoEnGaveta.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-slate-500 font-medium">Cupo POS:</span>
                        <span
                          style={{ color: b.hexBadgeText, backgroundColor: b.hexBadgeBg }}
                          className="font-bold px-2 py-0.5 rounded text-[11px]"
                        >
                          ${b.cupoDigital.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <form
                onSubmit={registrarOperacionBancaria}
                style={{ borderColor: bancoActivoObj.hexBg }}
                className="lg:col-span-5 bg-white rounded-xl shadow-md border-2 overflow-hidden flex flex-col justify-between"
              >
                <div
                  style={{ backgroundColor: bancoActivoObj.hexBg, color: bancoActivoObj.hexText }}
                  className="px-5 py-4 transition-colors"
                >
                  <div className="text-[11px] font-bold uppercase opacity-90 tracking-wider">
                    Terminal de Registro Contable
                  </div>
                  <h3 className="font-black text-lg leading-tight mt-0.5">
                    {bancoActivoObj.nombre} — {bancoActivoObj.subtitulo}
                  </h3>
                </div>

                <div className="p-5 space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">
                      Seleccionar Entidad Bancaria
                    </label>
                    <select
                      value={bancoSeleccionado}
                      onChange={(e) => setBancoSeleccionado(e.target.value)}
                      className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm font-bold text-slate-800 focus:outline-none"
                    >
                      {bancos.map((b) => (
                        <option key={b.id} value={b.id}>
                          {b.nombre} ({b.subtitulo})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">
                      Tipo de Transacción en Corresponsal
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {['DEPÓSITO', 'RETIRO', 'PAGO SERVICIO'].map((op) => {
                        const opActiva = tipoOperacionBanco === op;
                        return (
                          <button
                            type="button"
                            key={op}
                            onClick={() => setTipoOperacionBanco(op)}
                            style={
                              opActiva
                                ? {
                                    backgroundColor: bancoActivoObj.hexBg,
                                    color: bancoActivoObj.hexText,
                                    borderColor: bancoActivoObj.hexBorder
                                  }
                                : {}
                            }
                            className={`py-2 px-2 rounded-lg text-xs font-black border transition ${
                              opActiva
                                ? 'shadow-sm'
                                : 'bg-slate-50 text-slate-700 border-slate-300 hover:bg-slate-100'
                            }`}
                          >
                            {op}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-1">
                        Monto en Efectivo ($)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        required
                        value={montoBanco}
                        onChange={(e) => setMontoBanco(e.target.value)}
                        placeholder="Ej. 50.00"
                        className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-1">
                        N° Voucher / Control
                      </label>
                      <input
                        type="text"
                        required
                        value={voucherId}
                        onChange={(e) => setVoucherId(e.target.value)}
                        className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm font-mono font-bold"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    style={{
                      backgroundColor: bancoActivoObj.hexBg,
                      color: bancoActivoObj.hexText
                    }}
                    className="w-full font-black py-3.5 rounded-xl text-sm shadow-md hover:opacity-95 transition"
                  >
                    💾 Registrar en {bancoActivoObj.nombre} + Abrir Gaveta
                  </button>
                </div>
              </form>

              <div className="lg:col-span-7 bg-white rounded-xl shadow-sm border border-slate-200 p-5">
                <h3 className="font-bold text-slate-800 text-base mb-3">
                  Bitácora de Vouchers Bancarios del Turno (Identificados por Color Corporativo)
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-100 text-slate-600 uppercase">
                      <tr>
                        <th className="py-2.5 px-3">Voucher</th>
                        <th className="py-2.5 px-3">Hora</th>
                        <th className="py-2.5 px-3">Banco / Red</th>
                        <th className="py-2.5 px-3">Operación</th>
                        <th className="py-2.5 px-3 text-right">Monto</th>
                        <th className="py-2.5 px-3 text-right">Comisión</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {movimientosBancarios.map((m, i) => {
                        const bStyle = obtenerEstiloBanco(m.bancoId);
                        return (
                          <tr key={i} className="hover:bg-slate-50">
                            <td className="py-2.5 px-3 font-mono font-bold text-slate-900">{m.id}</td>
                            <td className="py-2.5 px-3 text-slate-500">{m.hora}</td>
                            <td className="py-2.5 px-3">
                              <span
                                style={{
                                  backgroundColor: bStyle.hexBg,
                                  color: bStyle.hexText
                                }}
                                className="px-2.5 py-1 rounded-md font-bold text-[11px] inline-block shadow-sm"
                              >
                                {m.banco}
                              </span>
                            </td>
                            <td className="py-2.5 px-3">
                              <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                                m.tipo === 'RETIRO'
                                  ? 'bg-rose-100 text-rose-800'
                                  : 'bg-emerald-100 text-emerald-800'
                              }`}>
                                {m.tipo}
                              </span>
                            </td>
                            <td className="py-2.5 px-3 text-right font-bold text-slate-900">
                              ${m.monto.toFixed(2)}
                            </td>
                            <td className="py-2.5 px-3 text-right text-emerald-700 font-bold">
                              +${m.comision.toFixed(2)}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {moduloActivo === 'inventario' && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
            <div className="flex flex-wrap justify-between items-center gap-4 mb-4">
              <div>
                <h2 className="font-bold text-slate-800 text-base">
                  Control de Inventario Dual (Conversión de Cajas/Resmas a Unidades Sueltas)
                </h2>
                <p className="text-xs text-slate-500">
                  Haz clic en "Abrir 1 Caja" para fraccionar mercadería de bodega o registra nuevos productos reales del bazar.
                </p>
              </div>
              <button
                onClick={() => setModalNuevoProd(true)}
                className="bg-[#003366] hover:bg-blue-900 text-white font-bold px-4 py-2 rounded-lg text-xs shadow"
              >
                + Registrar Nuevo Producto
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#003366] text-white uppercase">
                  <tr>
                    <th className="py-3 px-3">SKU / Código</th>
                    <th className="py-3 px-3">Producto</th>
                    <th className="py-3 px-3 text-right">P. Unidad</th>
                    <th className="py-3 px-3 text-right">P. Caja</th>
                    <th className="py-3 px-3 text-center">Stock Cajas</th>
                    <th className="py-3 px-3 text-center">Stock Unidades Sueltas</th>
                    <th className="py-3 px-3 text-center">Conversión / Fraccionamiento</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {productos.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50">
                      <td className="py-3 px-3 font-mono font-bold text-blue-900">
                        {p.sku}
                        <div className="text-[10px] text-slate-400">{p.codigoBarras}</div>
                      </td>
                      <td className="py-3 px-3 font-bold text-slate-800">{p.nombre}</td>
                      <td className="py-3 px-3 text-right">${p.precioUnidad.toFixed(2)}</td>
                      <td className="py-3 px-3 text-right">${p.precioCaja.toFixed(2)}</td>
                      <td className="py-3 px-3 text-center font-bold text-slate-700">
                        {p.stockCajas} cajas
                        <div className="text-[10px] text-slate-400">({p.unidadesPorCaja} u/caja)</div>
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span className={`px-2.5 py-1 rounded-full font-bold ${
                          p.stockUnidades <= p.stockMinimo
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          {p.stockUnidades} und.
                        </span>
                      </td>
                      <td className="py-3 px-3 text-center">
                        <button
                          onClick={() => fraccionarCaja(p.id)}
                          disabled={p.stockCajas <= 0}
                          className="bg-amber-500 hover:bg-amber-600 disabled:bg-slate-200 text-slate-950 font-bold px-3 py-1.5 rounded shadow-sm transition"
                        >
                          📦 Abrir 1 Caja (+{p.unidadesPorCaja} und.)
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {moduloActivo === 'contable' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                <span className="text-xs font-bold text-slate-500 uppercase">1. Ventas Propias Bazar/Papelería</span>
                <div className="text-2xl font-black text-[#003366] mt-1">${totalVentasPropias.toFixed(2)}</div>
                <span className="text-[11px] text-emerald-700 font-semibold">Ingreso directo de Bazar Tais</span>
              </div>

              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                <span className="text-xs font-bold text-slate-500 uppercase">2. Efectivo 5 Bancos en Gaveta</span>
                <div className="text-2xl font-black text-amber-600 mt-1">${totalEfectivoBancos.toFixed(2)}</div>
                <span className="text-[11px] text-slate-500 font-medium">Capital rotativo aislado de bancos</span>
              </div>

              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                <span className="text-xs font-bold text-slate-500 uppercase">3. Ganancia Comisiones Bancarias</span>
                <div className="text-2xl font-black text-emerald-600 mt-1">+${totalComisionesBancos.toFixed(2)}</div>
                <span className="text-[11px] text-slate-500 font-medium">{movimientosBancarios.length} vouchers procesados hoy</span>
              </div>

              <div className="bg-[#003366] text-white p-5 rounded-xl shadow-sm">
                <span className="text-xs font-bold text-blue-200 uppercase">4. Total Efectivo Físico en Gaveta</span>
                <div className="text-2xl font-black mt-1">${totalEfectivoEsperadoGaveta.toFixed(2)}</div>
                <span className="text-[11px] text-blue-200">Incluye Fondo Inicial ($50) + Bazar + 5 Bancos</span>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
              <h3 className="font-bold text-slate-800 text-sm mb-3 uppercase tracking-wide">
                Desglose de Efectivo en Gaveta por Entidad Bancaria
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
                {bancos.map((b) => (
                  <div
                    key={b.id}
                    style={{ borderLeftColor: b.hexBg, backgroundColor: b.hexLightBg }}
                    className="border border-slate-200 border-l-8 rounded-lg p-3"
                  >
                    <div className="font-black text-xs text-slate-800">{b.nombre}</div>
                    <div className="text-[10px] text-slate-500 font-semibold mb-1">{b.subtitulo}</div>
                    <div className="text-lg font-black text-slate-900">${b.efectivoEnGaveta.toFixed(2)}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              <div>
                <h3 className="font-bold text-slate-800 text-base mb-2">
                  Arqueo de Caja y Conciliación de Turno (Cierre Z)
                </h3>
                <p className="text-xs text-slate-600 mb-4">
                  Ingresa el dinero físico total contado en billetes y monedas al finalizar el día para verificar que no existan descuadres entre la papelería y los 5 bancos.
                </p>
                <div className="flex gap-3 items-end">
                  <div className="flex-1">
                    <label className="block text-xs font-bold text-slate-600 mb-1">
                      Efectivo Físico Contado en Gaveta ($):
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={efectivoContadoFisico}
                      onChange={(e) => setEfectivoContadoFisico(e.target.value)}
                      placeholder={totalEfectivoEsperadoGaveta.toFixed(2)}
                      className="w-full border border-slate-300 rounded-lg px-3 py-2 text-base font-bold"
                    />
                  </div>
                  <button
                    onClick={() => mostrarAlerta('🖨️ Reporte Térmico de Cierre Z impreso correctamente.')}
                    className="bg-[#003366] hover:bg-blue-900 text-white font-bold px-5 py-2.5 rounded-lg text-xs"
                  >
                    Imprimir Cierre Z
                  </button>
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span>Fondo de Caja Inicial:</span>
                  <span className="font-bold">${fondoInicialCaja.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>(+) Efectivo Ventas Papelería/Bazar:</span>
                  <span className="font-bold">${totalVentasPropias.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>(+) Efectivo Neto 5 Bancos Corresponsales:</span>
                  <span className="font-bold">${totalEfectivoBancos.toFixed(2)}</span>
                </div>
                <div className="border-t pt-2 flex justify-between text-sm font-black text-slate-900">
                  <span>EFECTIVO ESPERADO EN GAVETA:</span>
                  <span>${totalEfectivoEsperadoGaveta.toFixed(2)}</span>
                </div>
                {efectivoContadoFisico !== '' && (
                  <div className="pt-2 flex justify-between text-sm font-black">
                    <span>DIFERENCIA (SOBRANTE / FALTANTE):</span>
                    <span className={
                      parseFloat(efectivoContadoFisico) - totalEfectivoEsperadoGaveta === 0
                        ? 'text-emerald-600'
                        : 'text-rose-600'
                    }>
                      ${(parseFloat(efectivoContadoFisico) - totalEfectivoEsperadoGaveta).toFixed(2)}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      {modalNuevoProd && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50 no-print">
          <form onSubmit={guardarNuevoProducto} className="bg-white rounded-xl shadow-2xl max-w-md w-full p-5 space-y-3">
            <h3 className="font-bold text-slate-800 text-base border-b pb-2">
              Registrar Producto en Inventario Local
            </h3>
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">Nombre del Producto</label>
              <input
                type="text"
                required
                value={nuevoProd.nombre}
                onChange={(e) => setNuevoProd({ ...nuevoProd, nombre: e.target.value })}
                placeholder="Ej. Marcador Permanente Negro"
                className="w-full border rounded px-3 py-1.5 text-xs"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">SKU Interno</label>
                <input
                  type="text"
                  value={nuevoProd.sku}
                  onChange={(e) => setNuevoProd({ ...nuevoProd, sku: e.target.value })}
                  placeholder="PAP-010"
                  className="w-full border rounded px-3 py-1.5 text-xs font-mono"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Código de Barras</label>
                <input
                  type="text"
                  value={nuevoProd.codigoBarras}
                  onChange={(e) => setNuevoProd({ ...nuevoProd, codigoBarras: e.target.value })}
                  placeholder="78610010"
                  className="w-full border rounded px-3 py-1.5 text-xs font-mono"
                />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Precio Unidad ($)</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={nuevoProd.precioUnidad}
                  onChange={(e) => setNuevoProd({ ...nuevoProd, precioUnidad: e.target.value })}
                  placeholder="0.50"
                  className="w-full border rounded px-3 py-1.5 text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Precio Caja ($)</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={nuevoProd.precioCaja}
                  onChange={(e) => setNuevoProd({ ...nuevoProd, precioCaja: e.target.value })}
                  placeholder="5.00"
                  className="w-full border rounded px-3 py-1.5 text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Unds. por Caja</label>
                <input
                  type="number"
                  required
                  value={nuevoProd.unidadesPorCaja}
                  onChange={(e) => setNuevoProd({ ...nuevoProd, unidadesPorCaja: e.target.value })}
                  className="w-full border rounded px-3 py-1.5 text-xs"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setModalNuevoProd(false)}
                className="px-4 py-2 rounded border text-xs font-bold text-slate-600"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded bg-[#003366] text-white text-xs font-bold"
              >
                Guardar Producto
              </button>
            </div>
          </form>
        </div>
      )}

      {ticketModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
          <div id="area-impresion-termica" className="bg-white rounded-xl shadow-2xl max-w-sm w-full p-5 border-t-8 border-emerald-600">
            <div className="text-center font-mono text-xs border-b border-dashed border-slate-300 pb-3 mb-3">
              <div className="font-black text-sm">BAZAR Y PAPELERÍA TAIS</div>
              <div>Portete de Tarqui y José de Antepara 3401</div>
              <div>Diag. Farmacia Burgos - Guayaquil</div>
              <div>Comprobante: {ticketModal.numero}</div>
              <div>Fecha: {ticketModal.fecha}</div>
              <div className="mt-1 text-left">
                <div>Cliente: {ticketModal.cliente}</div>
                <div>CI/RUC: {ticketModal.ruc}</div>
              </div>
            </div>

            <div className="font-mono text-xs space-y-1 border-b border-dashed border-slate-300 pb-3 mb-3">
              {ticketModal.items.map((it, idx) => (
                <div key={idx} className="flex justify-between">
                  <span>{it.cantidad}x {it.nombre.slice(0, 18)} ({it.modalidad[0]})</span>
                  <span className="font-bold">${(it.cantidad * it.precioUnitario).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="font-mono text-xs space-y-1 mb-4">
              <div className="flex justify-between font-bold text-sm">
                <span>TOTAL:</span>
                <span>${ticketModal.total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>EFECTIVO RECIBIDO:</span>
                <span>${ticketModal.recibido.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold">
                <span>CAMBIO / VUELTO:</span>
                <span>${ticketModal.cambio.toFixed(2)}</span>
              </div>
            </div>

            <div className="bg-emerald-50 border border-emerald-200 rounded p-2 text-[11px] text-emerald-900 mb-4 text-center font-medium no-print">
              ✅ Comando ESC/POS <code>1B 70 00 19 FA</code> enviado: Gaveta RJ11 abierta automáticamente.
            </div>

            <div className="grid grid-cols-2 gap-2 no-print">
              <button
                onClick={() => window.print()}
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 rounded-lg text-xs"
              >
                🖨️ Imprimir Ticket Físico
              </button>
              <button
                onClick={() => setTicketModal(null)}
                className="w-full bg-[#003366] text-white font-bold py-2.5 rounded-lg text-xs"
              >
                Cerrar (Enter)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
