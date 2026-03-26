// src/pages/Reportes.jsx
import React, { useState, useEffect, useContext } from 'react';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './reportes.css';
import { getReportes, obtenerFuncionarios } from '../../services/reportesServices';
import { AuthContext } from '../../context/AuthContext';
import KPICard from '../../components/reportes/KPICard';
import ChartCard from '../../components/reportes/ChartCard';
import { pdfService } from '../../services/pdfService';
import ModalSeleccionUsuario from '../../components/reportes/ModalSeleccionUsuario';


const truncarNombre = (nombre, max = 18) =>
  nombre?.length > max ? `${nombre.slice(0, max)}…` : nombre;


const prepararDatosPie = (data, max = 5) => {
  if (!data?.length) return [];

  const ordenado = [...data].sort((a, b) => b.value - a.value);
  const top      = ordenado.slice(0, max);
  const resto    = ordenado.slice(max);

  const resultado = top.map(d => ({ ...d, name: truncarNombre(d.name) }));

  if (resto.length > 0) {
    const totalOtros = resto.reduce((acc, d) => acc + d.value, 0);
    resultado.push({ name: 'Otros', value: totalOtros });
  }

  return resultado;
};


const TooltipPie = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const { name, value } = payload[0];
  return (
    <div style={{
      background: '#fff',
      border: '1px solid #e2e8f0',
      borderRadius: 8,
      padding: '8px 14px',
      fontSize: 13,
      boxShadow: '0 2px 8px rgba(0,0,0,.10)'
    }}>
      <span style={{ fontWeight: 600 }}>{name}</span>
      <br />
      <span style={{ color: '#555' }}>{value} {value === 1 ? 'tarea' : 'tareas'}</span>
    </div>
  );
};

// ── Tooltip personalizado para la comparativa ────────────────────────────────
const TooltipComparativa = ({ active, payload, label, comparativa }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: '#fff',
      border: '1px solid #e2e8f0',
      borderRadius: 8,
      padding: '8px 14px',
      fontSize: 13,
      boxShadow: '0 2px 8px rgba(0,0,0,.10)'
    }}>
      <p style={{ fontWeight: 600, marginBottom: 4 }}>{label}</p>
      {payload.map((entry, i) => (
        <p key={i} style={{ color: entry.color, margin: '2px 0' }}>
          {entry.name}: <strong>{entry.value}</strong> {entry.value === 1 ? 'tarea' : 'tareas'}
        </p>
      ))}
    </div>
  );
};


const ReporteDashboard = () => {
  const { usuario, cargando: cargandoAuth } = useContext(AuthContext);

  const [metricas, setMetricas] = useState({
    tareasTotales: 0, completadas: 0, pendientes: 0, atrasadas: 0
  });

  const [dataGraficos, setDataGraficos] = useState({
    completadasMes: [], categorias: [], estados: [], mesesDisponibles: [],
    comparativa: null,
  });

  const [funcionario, setFuncionario] = useState({
    primer_nombre: '', primer_apellido: ''
  });

  const [documentoActivo, setDocumentoActivo] = useState(null);
  const [mesFiltro, setMesFiltro]             = useState('todos');
  const [listaFuncionarios, setListaFuncionarios] = useState([]);
  const [mostrarModal, setMostrarModal]       = useState(false);
  const [cargando, setCargando]               = useState(true);
  const [error, setError]                     = useState(null);

  const COLORS = ['#faca77', '#1E3A8A', '#60A5FA', '#FCD34D', '#A78BFA', '#94A3B8'];

  useEffect(() => {
    if (cargandoAuth) return;
    if (!usuario) {
      setError('No hay sesión activa. Por favor inicia sesión.');
      setCargando(false);
      return;
    }
    const documento = usuario.num_documento || usuario.documento || usuario.cedula;
    if (!documento) {
      setError('El usuario no tiene número de documento registrado.');
      setCargando(false);
      return;
    }
    setDocumentoActivo(documento);
    cargarDatosIniciales(documento, 'todos');
  }, [usuario, cargandoAuth]);

  useEffect(() => {
    const cargarFuncionarios = async () => {
      try {
        const lista = await obtenerFuncionarios();
        setListaFuncionarios(lista);
      } catch (err) {
        console.error("Error cargando funcionarios:", err.message);
      }
    };
    cargarFuncionarios();
  }, []);

  const cargarDatosIniciales = async (documento, mes = 'todos') => {
    try {
      setCargando(true);
      setError(null);
      const datosReporte = await getReportes(documento, mes);
      if (!datosReporte?.estadisticas || !datosReporte?.graficos) {
        throw new Error('Formato de datos inválido');
      }
      setMetricas({
        tareasTotales: datosReporte.estadisticas.tareasTotales || 0,
        completadas:   datosReporte.estadisticas.completadas   || 0,
        pendientes:    datosReporte.estadisticas.pendientes     || 0,
        atrasadas:     datosReporte.estadisticas.atrasadas      || 0
      });
      setDataGraficos({
        completadasMes:   datosReporte.graficos.completadasMes   || [],
        categorias:       datosReporte.graficos.categorias       || [],
        estados:          datosReporte.graficos.estados           || [],
        mesesDisponibles: datosReporte.graficos.mesesDisponibles || [],
        comparativa:      datosReporte.graficos.comparativa      || null,
      });
      setFuncionario({
        primer_nombre:   datosReporte.funcionario?.primer_nombre   || '',
        primer_apellido: datosReporte.funcionario?.primer_apellido || ''
      });
    } catch (err) {
      console.error('[REPORTES] Error:', err);
      setError(err.message);
    } finally {
      setCargando(false);
    }
  };


  const handleCambiarMes = (e) => {
    const mes = e.target.value;
    setMesFiltro(mes);
    if (documentoActivo) cargarDatosIniciales(documentoActivo, mes);
  };

  const handleCambiarUsuario = () => {
    if (listaFuncionarios.length === 0) { alert('No hay usuarios disponibles'); return; }
    setMostrarModal(true);
  };

  const handleSeleccionarUsuario = async (usuarioSeleccionado) => {
    setMostrarModal(false);
    if (usuarioSeleccionado) {
      const doc = usuarioSeleccionado.num_documento;
      setDocumentoActivo(doc);
      setMesFiltro('todos');
      await cargarDatosIniciales(doc, 'todos');
    }
  };

  const handleGenerarPDF = () => {
    if (!usuario || !metricas || !dataGraficos) { alert('No hay datos para generar el PDF'); return; }
    const resultado = pdfService.generarReporte(
      metricas, dataGraficos,
      { num_documento: usuario.num_documento,
        nombre: `${funcionario.primer_nombre} ${funcionario.primer_apellido}`,
        mes: mesFiltro !== 'todos' ? mesFiltro : null }
    );
    if (!resultado?.success) alert('Ocurrió un error al generar el PDF');
  };

  if (cargandoAuth || cargando) {
    return (
      <div className="container-fluid p-4 cargando">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
          <p className="mt-3">{cargandoAuth ? 'Verificando sesión...' : 'Cargando reporte...'}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container-fluid p-4">
        <div className="alert alert-danger">
          <h4>Error al cargar reportes</h4>
          <p>{error}</p>
          {documentoActivo && (
            <button className="btn btn-primary" onClick={() => cargarDatosIniciales(documentoActivo, mesFiltro)}>
              Reintentar
            </button>
          )}
        </div>
      </div>
    );
  }

  const dataMeses = dataGraficos.completadasMes.map(item => ({
    mes: item.nombreMes, total: item.total
  }));

  const dataCategorias = prepararDatosPie(
    dataGraficos.categorias.map(i => ({ name: i.categoria, value: i.total }))
  );

  const dataEstados = prepararDatosPie(
    dataGraficos.estados.map(i => ({ name: i.estado, value: i.total }))
  );

  // ── Datos para la comparativa ─────────────────────────────────────────────
  const comparativa      = dataGraficos.comparativa;
  const dataComparativa  = comparativa?.datos || [];
  const nombreMesActual  = comparativa?.mesActual?.nombre  || 'Mes actual';
  const nombreMesAnterior = comparativa?.mesAnterior?.nombre || 'Mes anterior';

  return (
    <div className="container-fluid p-4 pt-5">

      {/* HEADER */}
      <div className="reportes-header mb-4">
        <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
          <div className="d-flex flex-column">
            <h2 className="reportes-titulo mb-0">Reporte del Usuario</h2>
            <h5 className="mb-0 mt-1">
              {funcionario?.primer_nombre || 'Desconocido'} {funcionario?.primer_apellido || ''}
            </h5>
          </div>
          <div className="d-flex align-items-center gap-2 flex-wrap reportes-botones">
            <select
              className="form-select form-select-sm filtro-mes"
              value={mesFiltro}
              onChange={handleCambiarMes}
            >
              <option value="todos">Todos los meses</option>
              {dataGraficos.mesesDisponibles.map(item => (
                <option key={item.mes} value={item.mes}>{item.nombreMes}</option>
              ))}
            </select>
            {usuario?.tipo_de_rol === "Administrador" && (
              <button className="btn btn-primary" onClick={handleCambiarUsuario}>Cambiar Usuario</button>
            )}
            <button className="btn btn-secondary" onClick={handleGenerarPDF}>Generar PDF</button>
          </div>
        </div>
      </div>

      {/* KPIs */}
      <div className="row g-4 mb-4 pt-2">
        <div className="col-6 col-lg-3 mb-4">
          <KPICard title="Tareas Totales" value={metricas.tareasTotales} loading={false} color="blue" />
        </div>
        <div className="col-6 col-lg-3 mb-4">
          <KPICard title="Completadas"    value={metricas.completadas}   valueColor="#10b948" loading={false} />
        </div>
        <div className="col-6 col-lg-3 mb-4">
          <KPICard title="Pendientes"     value={metricas.pendientes}    color="orange" loading={false} />
        </div>
        <div className="col-6 col-lg-3 mb-4">
          <KPICard title="Atrasadas"      value={metricas.atrasadas}     valueColor="#e94c4c" loading={false} />
        </div>
      </div>

      {/* GRÁFICOS */}
      <div className="row g-4">

        {/* Tareas completadas por mes */}
        <div className="col-12 col-xl-6 mb-4">
          <ChartCard title="Tareas Completadas Por Mes" loading={false}>
            {dataMeses.length > 0 ? (
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={dataMeses}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="mes" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="total" fill="#1E3A8A" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="chart-placeholder">Sin datos</div>
            )}
          </ChartCard>
        </div>

        {/* Tareas por categoría */}
        <div className="col-12 col-xl-6 mb-4">
          <ChartCard title="Tareas Por Categoría" loading={false}>
            {dataCategorias.length > 0 ? (
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={dataCategorias}
                    cx="50%"
                    cy="45%"
                    label={false}
                    outerRadius={90}
                    dataKey="value"
                  >
                    {dataCategorias.map((_, index) => (
                      <Cell key={`cat-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<TooltipPie />} />
                  <Legend
                    layout="horizontal"
                    verticalAlign="bottom"
                    align="center"
                    wrapperStyle={{ fontSize: '12px', paddingTop: '8px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="chart-placeholder">Sin datos</div>
            )}
          </ChartCard>
        </div>

        {/* Estado actual de las tareas */}
        <div className="col-12 col-xl-6 mb-4">
          <ChartCard title="Estado Actual de las Tareas" loading={false}>
            {dataEstados.length > 0 ? (
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={dataEstados}
                    cx="50%"
                    cy="45%"
                    label={false}
                    labelLine={false}
                    outerRadius={90}
                    dataKey="value"
                  >
                    {dataEstados.map((_, index) => (
                      <Cell key={`est-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<TooltipPie />} />
                  <Legend
                    layout="horizontal"
                    verticalAlign="bottom"
                    align="center"
                    wrapperStyle={{ fontSize: '12px', paddingTop: '8px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="chart-placeholder">Sin datos</div>
            )}
          </ChartCard>
        </div>

        {/* Comparativa mes actual vs mes anterior */}
        <div className="col-12 col-xl-6 mb-4">
          <ChartCard title={`Comparativa: ${nombreMesActual} vs ${nombreMesAnterior}`} loading={false}>
            {dataComparativa.length > 0 ? (
              <ResponsiveContainer width="100%" height={280}>
                <BarChart
                  data={dataComparativa}
                  margin={{ top: 8, right: 16, left: 0, bottom: 4 }}
                  barCategoryGap="30%"
                  barGap={4}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="categoria" tick={{ fontSize: 12 }} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                  <Tooltip content={<TooltipComparativa />} />
                  <Legend
                    wrapperStyle={{ fontSize: '12px', paddingTop: '8px' }}
                    formatter={(value) =>
                      value === 'actual' ? nombreMesActual : nombreMesAnterior
                    }
                  />
                  <Bar
                    dataKey="actual"
                    name="actual"
                    fill="#1E3A8A"
                    radius={[6, 6, 0, 0]}
                  />
                  <Bar
                    dataKey="anterior"
                    name="anterior"
                    fill="#60A5FA"
                    radius={[6, 6, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="chart-placeholder">Sin datos</div>
            )}
          </ChartCard>
        </div>

      </div>

      <ModalSeleccionUsuario
        mostrar={mostrarModal}
        funcionarios={listaFuncionarios}
        onSeleccionar={handleSeleccionarUsuario}
        onCerrar={() => setMostrarModal(false)}
      />

    </div>
  );
};

export default ReporteDashboard;