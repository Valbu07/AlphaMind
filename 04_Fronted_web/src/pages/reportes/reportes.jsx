// ✅ PASO 1: Importaciones correctas
import React, { useState, useEffect, useContext } from 'react'; // 👈 Agregado useContext
import './reportes.css';
import { getReportes } from '../../services/reportesServices'; // 👈 Corregido "reportes"
import { AuthContext } from '../../context/AuthContext'; // 👈 Importar el contexto

const ReporteDashboard = () => {
  // ✅ PASO 2: Obtener usuario del contexto
  const { usuario } = useContext(AuthContext);

  // Estados
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
  const [error, setError] = useState(null); // 👈 Nuevo estado para errores

  // ✅ PASO 3: useEffect con dependencia correcta
  useEffect(() => {
    if (usuario?.documento || usuario?.num_documento) {
      cargarDatosIniciales();
    }
  }, [usuario]); // 👈 Cambié la dependencia a 'usuario'

  // ✅ PASO 4: Función mejorada con logs de debugging
  const cargarDatosIniciales = async () => {
    try {
      setCargando(true);
      setError(null); // Limpiar errores previos

      // Obtener documento del usuario
      const usuarioDocumento = usuario?.documento || usuario?.num_documento;
      
      console.log('🔍 Usuario logueado:', usuario); // 👈 LOG 1
      console.log('📄 Documento a consultar:', usuarioDocumento); // 👈 LOG 2
      
      if (!usuarioDocumento) {
        throw new Error('No hay usuario logueado o falta el documento');
      }

      // Llamada a la API
      console.log('📡 Llamando a getReportes...'); // 👈 LOG 3
      const datosReporte = await getReportes(usuarioDocumento);
      console.log('✅ Datos recibidos:', datosReporte); // 👈 LOG 4

      // Validar estructura de datos
      if (!datosReporte?.estadisticas || !datosReporte?.graficos) {
        throw new Error('Formato de datos inválido desde la API');
      }

      // Actualizar estados
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

      console.log('✅ Estados actualizados correctamente'); // 👈 LOG 5

    } catch (error) {
      console.error("❌ Error al cargar métricas:", error); // 👈 LOG 6
      setError(error.message);
      alert(`Error: ${error.message}`);
    } finally {
      setCargando(false);
    }
  };

  const handleGenerarPDF = () => {
    alert("Funcionalidad de PDF en desarrollo");
  };

  const handleCambiarUsuario = () => {
    alert("Selector de usuario en desarrollo");
  };

  // ✅ PASO 5: Pantalla de carga mejorada
  if (cargando) {
    return (
      <div className="container-fluid p-4">
        <div className="loading-container">
          <div className="text-center">
            <div className="spinner-border text-primary loading-spinner" role="status">
              <span className="visually-hidden">Cargando...</span>
            </div>
            <p className="loading-text">Cargando datos del reporte...</p>
          </div>
        </div>
      </div>
    );
  }

  // ✅ PASO 6: Pantalla de error
  if (error) {
    return (
      <div className="container-fluid p-4">
        <div className="alert alert-danger">
          <h4>⚠️ Error al cargar reportes</h4>
          <p>{error}</p>
          <button className="btn btn-primary" onClick={cargarDatosIniciales}>
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  // ✅ PASO 7: Renderizado principal con datos del usuario real
  return (
    <div className="container-fluid dashboard-container">
      {/* Header */}
      <div className="row dashboard-header">
        <div className="col-12">
          <div className="d-flex flex-column gap-3">
            {/* Título arriba */}
            <div>
              <h2 className="dashboard-title">
                Reporte de Tareas
              </h2>
              <p className="dashboard-subtitle">
                Análisis de desempeño del usuario: 
                <strong>
                  {/* ✅ Mostrar nombre real del usuario logueado */}
                  {usuario?.nombre || usuario?.name || 'Usuario'}
                </strong>
              </p>
            </div>

            <div className="dashboard-actions d-flex gap-2">
              <button 
                className="btn btn-usuario"
                onClick={handleCambiarUsuario}
              >
                Cambiar Usuario
              </button>
              <button 
                className="btn btn-pdf"
                onClick={handleGenerarPDF}
              >
                Exportar PDF
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido Principal */}
      <div className="row g-4">
        {/* Panel Lateral - KPIs */}
        <div className="col-12 col-lg-3">
          <div className="sidebar-sticky">
            <h5 className="sidebar-title">
              Resumen General
            </h5>
            
            {/* KPI: Tareas Totales */}
            <div className="card kpi-card">
              <div className="card-body kpi-card-body">
                <div className="kpi-info">
                  <p className="kpi-label">Tareas Totales</p>
                  <h3 className="kpi-value total">
                    {metricas.tareasTotales}
                  </h3>
                </div>
                <div className="kpi-icon-circle total"></div>
              </div>
            </div>

            {/* KPI: Completadas */}
            <div className="card kpi-card">
              <div className="card-body kpi-card-body">
                <div className="kpi-info">
                  <p className="kpi-label">Completadas</p>
                  <h3 className="kpi-value completadas">
                    {metricas.completadas}
                  </h3>
                  <span className="badge bg-success kpi-badge"></span>
                </div>
                <div className="kpi-icon-circle completadas"></div>
              </div>
            </div>

            {/* KPI: Pendientes */}
            <div className="card kpi-card">
              <div className="card-body kpi-card-body">
                <div className="kpi-info">
                  <p className="kpi-label">Pendientes</p>
                  <h3 className="kpi-value pendientes">
                    {metricas.pendientes}
                  </h3>
                </div>
                <div className="kpi-icon-circle pendientes"></div>
              </div>
            </div>

            {/* KPI: Atrasadas */}
            <div className="card kpi-card">
              <div className="card-body kpi-card-body">
                <div className="kpi-info">
                  <p className="kpi-label">Atrasadas</p>
                  <h3 className="kpi-value atrasadas">
                    {metricas.atrasadas}
                  </h3>
                </div>
                <div className="kpi-icon-circle atrasadas"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Panel Principal - Gráficos */}
        <div className="col-12 col-lg-9">
          <div className="row g-4">
            {/* Gráfico 1: Tareas Completadas Por Mes */}
            <div className="col-12 col-xl-6">
              <div className="card chart-card">
                <div className="card-body">
                  <div className="chart-header">
                    <div>
                      <h5 className="chart-title">Tareas Completadas Por Mes</h5>
                      <p className="chart-description">Tendencia de los últimos 6 meses</p>
                    </div>
                  </div>
                  {/* TODO: Agregar gráfico */}
                </div>
              </div>
            </div>

            {/* Gráfico 2: Tareas Por Categoría */}
            <div className="col-12 col-xl-6">
              <div className="card chart-card">
                <div className="card-body">
                  {/* TODO: Agregar gráfico */}
                </div>
              </div>
            </div>

            {/* Gráfico 3: Estado Actual de las Tareas */}
            <div className="col-12 col-xl-6">
              <div className="card chart-card">
                <div className="card-body">
                  {/* TODO: Agregar gráfico */}
                </div>
              </div>
            </div>

            {/* Gráfico 4: Tiempo Promedio Por Categoría */}
            <div className="col-12 col-xl-6">
              <div className="card chart-card">
                <div className="card-body">
                  {/* TODO: Agregar gráfico */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReporteDashboard;