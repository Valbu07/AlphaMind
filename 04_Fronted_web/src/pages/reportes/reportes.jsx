// src/pages/Reportes.jsx
import React, { useState, useEffect, useContext } from 'react';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './reportes.css';
import { getReportes } from '../../services/reportesServices';
import { AuthContext } from '../../context/AuthContext';
import KPICard from '../../components/reportes/KPICard';
import ChartCard from '../../components/reportes/ChartCard';

const ReporteDashboard = () => {
  const { usuario, cargando: cargandoAuth } = useContext(AuthContext);

  const [metricas, setMetricas] = useState({
    tareasTotales: 0,
    completadas: 0,
    pendientes: 0,
    atrasadas: 0
  });

  const [dataGraficos, setDataGraficos] = useState({
    completadasMes: [],
    categorias: [],
    estados: []
  });

  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  const COLORS = ['#faca77', '#1E3A8A', '#60A5FA', '#FCD34D', '#A78BFA'];


  useEffect(() => {
    if (cargandoAuth) {
      console.log(' [REPORTES] Esperando contexto...');
      return;
    }

    if (!usuario) {
      console.error(' [REPORTES] No hay usuario');
      setError('No hay sesión activa. Por favor inicia sesión.');
      setCargando(false);
      return;
    }

    const documento = usuario.num_documento || usuario.documento || usuario.cedula;

    if (!documento) {
      console.error(' [REPORTES] Usuario sin documento');
      setError('El usuario no tiene número de documento registrado.');
      setCargando(false);
      return;
    }

    console.log('[REPORTES] Cargando datos para:', documento);
    cargarDatosIniciales(documento);

  }, [usuario, cargandoAuth]);

  const cargarDatosIniciales = async (documento) => {
    try {
      setCargando(true);
      setError(null);

      console.log('📡 [REPORTES] Solicitando reporte...');
      
      const datosReporte = await getReportes(documento);
      
      console.log(' [REPORTES] Datos recibidos:', datosReporte);

      if (!datosReporte?.estadisticas || !datosReporte?.graficos) {
        throw new Error('Formato de datos inválido');
      }

      setMetricas({
        tareasTotales: datosReporte.estadisticas.tareasTotales || 0,
        completadas: datosReporte.estadisticas.completadas || 0,
        pendientes: datosReporte.estadisticas.pendientes || 0,
        atrasadas: datosReporte.estadisticas.atrasadas || 0
      });

      setDataGraficos({
        completadasMes: datosReporte.graficos.completadasMes || [],
        categorias: datosReporte.graficos.categorias || [],
        estados: datosReporte.graficos.estados || []
      });

    } catch (error) {
      console.error(' [REPORTES] Error:', error);
      setError(error.message);
    } finally {
      setCargando(false);
    }
  };

  const handleGenerarPDF = () => {
    console.log('Generar PDF');
  };

  const handleCambiarUsuario = () => {
    console.log('Cambiar usuario');
  };

  if (cargandoAuth || cargando) {
    return (
      <div className="container-fluid p-4">
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
          <h4> Error al cargar reportes</h4>
          <p>{error}</p>
          {usuario?.num_documento && (
            <button 
              className="btn btn-primary" 
              onClick={() => cargarDatosIniciales(usuario.num_documento)}
            >
               Reintentar
            </button>
          )}
        </div>
      </div>
    );
  }

  const dataMeses = dataGraficos.completadasMes.map(item => ({
    mes: item.nombreMes,
    total: item.total
  }));

  const dataCategorias = dataGraficos.categorias.map(item => ({
    name: item.categoria,
    value: item.total
  }));

  const dataEstados = dataGraficos.estados.map(item => ({
    name: item.estado,
    value: item.total
  }));

 
  return (
  <div className="container-fluid p-4">
    <div className="row g-4">
      
      {/* Panel izquierdo - KPIs */}
      <div className="col-12 col-md-3">
        <div className="card p-3 shadow-sm panel-left">
          <h4 className="mb-3 fw-bold">Total</h4>

          <KPICard title="Tareas Totales" value={metricas.tareasTotales} loading={false} />
          <KPICard title="Completadas" value={metricas.completadas} loading={false} />
          <KPICard title="Pendientes" value={metricas.pendientes} loading={false} />
          <KPICard title="Atrasadas" value={metricas.atrasadas} loading={false} />
        </div>
      </div>

      {/* Panel derecho CENTRADO */}
      <div className="col-12 col-md-9 d-flex flex-column align-items-center">

        {/* Header centrado */}
        <div className="reportes-header text-center">
          <h2 className="reportes-titulo">Reporte del Usuario</h2>

          <div className="reportes-botones">
            <button className="btn btn-primary" onClick={handleCambiarUsuario}>
              Usuario: {usuario?.num_documento}
            </button>

            <button className="btn btn-secondary" onClick={handleGenerarPDF}>
              Generar PDF
            </button>
          </div>
        </div>

        {/* Gráficos centrados */}
        <div className="row g-4 justify-content-center text-center w-100 max-content">

          {/* Gráfico 1 */}
          <div className="col-md-6 d-flex justify-content-center">
            <ChartCard title="Tareas Completadas Por Mes" loading={false}>
              {dataMeses.length > 0 ? (
                <ResponsiveContainer width="100%" height={240}>
                  <BarChart data={dataMeses}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="mes" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="total" fill="#1E3A8A" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="chart-placeholder">Sin datos</div>
              )}
            </ChartCard>
          </div>

          {/* Gráfico 2 */}
          <div className="col-md-6 d-flex justify-content-center">
            <ChartCard title="Tareas Por Categoría" loading={false}>
              {dataCategorias.length > 0 ? (
                <ResponsiveContainer width="100%" height={240}>
                  <PieChart>
                    <Pie
                      data={dataCategorias}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      dataKey="value"
                    >
                      {dataCategorias.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="chart-placeholder">Sin datos</div>
              )}
            </ChartCard>
          </div>

          {/* Gráfico 3 */}
          <div className="col-md-6 d-flex justify-content-center">
            <ChartCard title="Estado Actual de las Tareas" loading={false}>
              {dataEstados.length > 0 ? (
                <ResponsiveContainer width="100%" height={240}>
                  <PieChart>
                    <Pie
                      data={dataEstados}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}`}
                      outerRadius={80}
                      dataKey="value"
                    >
                      {dataEstados.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="chart-placeholder">Sin datos</div>
              )}
            </ChartCard>
          </div>

          {/* Gráfico 4 */}
          <div className="col-md-6 d-flex justify-content-center">
            <ChartCard title="NUEVA SECCION" loading={false}>
              <div className="chart-placeholder">Próximamente</div>
            </ChartCard>
          </div>

        </div>
      </div>
    </div>
  </div>
);

};

export default ReporteDashboard;