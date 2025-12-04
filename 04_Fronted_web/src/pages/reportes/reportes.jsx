import React, { useState, useEffect, useContext } from 'react';
import './reportes.css';
import { getReportes } from '../../services/reportesServices';
import { AuthContext } from '../../context/AuthContext';

const ReporteDashboard = () => {
  
  // ✅ Obtener tanto usuario como token del contexto
  const { usuario, token, cargando: cargandoAuth } = useContext(AuthContext);

  // ✅ Estados locales
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

  // ✅ DEBUG: Mostrar información del usuario y token
  useEffect(() => {
    console.log('🔍 [REPORTES] Estado del contexto:', {
      cargandoAuth,
      usuario,
      token: token ? '✅ Token disponible' : '❌ Sin token',
      num_documento: usuario?.num_documento,
      documento_alternativo: usuario?.documento
    });
  }, [usuario, token, cargandoAuth]);

  // ✅ Cargar datos automáticamente cuando el contexto esté listo
  useEffect(() => {
    // 1. Esperar a que el contexto termine de cargar
    if (cargandoAuth) {
      console.log('⏳ [REPORTES] Esperando a que termine de cargar el contexto...');
      return;
    }

    // 2. Validar que exista usuario
    if (!usuario) {
      console.error('❌ [REPORTES] No hay usuario logueado');
      setError('No hay sesión activa. Por favor inicia sesión.');
      setCargando(false);
      return;
    }

    // 3. Validar que exista token
    if (!token) {
      console.error('❌ [REPORTES] No hay token disponible');
      setError('No hay token de autenticación. Por favor inicia sesión nuevamente.');
      setCargando(false);
      return;
    }

    // 4. Obtener documento del usuario (soporta múltiples nombres de campo)
    const documento = usuario.num_documento || usuario.documento || usuario.cedula;

    if (!documento) {
      console.error('❌ [REPORTES] Usuario sin documento:', usuario);
      setError('El usuario no tiene número de documento registrado.');
      setCargando(false);
      return;
    }

    // 5. Cargar datos del reporte
    console.log('✅ [REPORTES] Cargando datos para documento:', documento);
    cargarDatosIniciales(documento, token);

  }, [usuario, token, cargandoAuth]);

  // ✅ Función para cargar datos del reporte
  const cargarDatosIniciales = async (documento, userToken) => {
    try {
      setCargando(true);
      setError(null);

      console.log('📡 [REPORTES] Solicitando reporte para:', documento);
      console.log('🔑 [REPORTES] Con token:', userToken);
      console.log('🌐 [REPORTES] URL completa:', `http://localhost:3000/reportes/${documento}`);
      
      // ✅ Llamar al servicio con AMBOS parámetros
      const datosReporte = await getReportes(documento, userToken);
      
      console.log('✅ [REPORTES] Datos recibidos:', datosReporte);

      // Validar estructura de datos
      if (!datosReporte?.estadisticas || !datosReporte?.graficos) {
        throw new Error('Formato de datos inválido desde la API');
      }

      // Actualizar métricas
      setMetricas({
        tareasTotales: datosReporte.estadisticas.tareasTotales || 0,
        completadas: datosReporte.estadisticas.completadas || 0,
        pendientes: datosReporte.estadisticas.pendientes || 0,
        atrasadas: datosReporte.estadisticas.atrasadas || 0
      });

      // Actualizar datos de gráficos
      setDataGraficos({
        completadasMes: datosReporte.graficos.completadasMes || [],
        categorias: datosReporte.graficos.categorias || [],
        estados: datosReporte.graficos.estados || []
      });

      console.log('✅ [REPORTES] Estados actualizados correctamente');

    } catch (error) {
      console.error('❌ [REPORTES] Error al cargar métricas:', error);
      setError(error.message);
    } finally {
      setCargando(false);
    }
  };

  // ✅ Función para generar PDF (placeholder)
  const handleGenerarPDF = () => {
    alert("Funcionalidad de PDF en desarrollo");
  };

  // ✅ Función para cambiar usuario (placeholder)
  const handleCambiarUsuario = () => {
    alert("Selector de usuario en desarrollo");
  };

  // ✅ Pantalla de carga (mientras carga el contexto o los datos)
  if (cargandoAuth || cargando) {
    return (
      <div className="container-fluid p-4">
        <div className="loading-container">
          <div className="text-center">
            <div className="spinner-border text-primary loading-spinner" role="status">
              <span className="visually-hidden">Cargando...</span>
            </div>
            <p className="loading-text">
              {cargandoAuth ? 'Verificando sesión...' : 'Cargando datos del reporte...'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ✅ Pantalla de error
  if (error) {
    return (
      <div className="container-fluid p-4">
        <div className="alert alert-danger">
          <h4>⚠️ Error al cargar reportes</h4>
          <p>{error}</p>
          {(usuario?.num_documento || usuario?.documento) && token && (
            <button 
              className="btn btn-primary" 
              onClick={() => cargarDatosIniciales(
                usuario.num_documento || usuario.documento,
                token
              )}
            >
              🔄 Reintentar
            </button>
          )}
        </div>
      </div>
    );
  }


  // ✅ Renderizado principal
  return (
    <div className="container-fluid dashboard-container">
      {/* ========== HEADER ========== */}
      <div className="row dashboard-header">
        <div className="col-12">
          <div className="d-flex flex-column gap-3">
            {/* Título */}
            <div>
              <h2 className="dashboard-title">
                📊 Reporte de Tareas
              </h2>
              <p className="dashboard-subtitle">
                Análisis de desempeño del usuario: 
                <strong>
                  {' '}{usuario?.nombre || usuario?.name || 'Usuario'}
                </strong>
              </p>
            </div>

            {/* Botones de acción */}
            <div className="dashboard-actions d-flex gap-2">
              <button 
                className="btn btn-usuario"
                onClick={handleCambiarUsuario}
              >
                👤 Cambiar Usuario
              </button>
              <button 
                className="btn btn-pdf"
                onClick={handleGenerarPDF}
              >
                📄 Exportar PDF
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ========== CONTENIDO PRINCIPAL ========== */}
      <div className="row g-4">
        {/* ========== PANEL LATERAL - KPIs ========== */}
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
                  <span className="badge bg-success kpi-badge">
                    {metricas.tareasTotales > 0 
                      ? `${Math.round((metricas.completadas / metricas.tareasTotales) * 100)}%`
                      : '0%'
                    }
                  </span>
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
                  <span className="badge bg-warning kpi-badge">
                    {metricas.tareasTotales > 0 
                      ? `${Math.round((metricas.pendientes / metricas.tareasTotales) * 100)}%`
                      : '0%'
                    }
                  </span>
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
                  <span className="badge bg-danger kpi-badge">
                    {metricas.tareasTotales > 0 
                      ? `${Math.round((metricas.atrasadas / metricas.tareasTotales) * 100)}%`
                      : '0%'
                    }
                  </span>
                </div>
                <div className="kpi-icon-circle atrasadas"></div>
              </div>
            </div>
          </div>
        </div>

        {/* ========== PANEL PRINCIPAL - GRÁFICOS ========== */}
        <div className="col-12 col-lg-9">
          <div className="row g-4">
            {/* Gráfico 1: Tareas Completadas Por Mes */}
            <div className="col-12 col-xl-6">
              <div className="card chart-card">
                <div className="card-body">
                  <div className="chart-header">
                    <div>
                      <h5 className="chart-title">
                        📈 Tareas Completadas Por Mes
                      </h5>
                      <p className="chart-description">
                        Tendencia de los últimos 6 meses
                      </p>
                    </div>
                  </div>
                  
                  {/* Placeholder para gráfico */}
                  <div className="chart-placeholder">
                    <p>Gráfico en desarrollo</p>
                    <small>
                      Datos disponibles: {dataGraficos.completadasMes.length} meses
                    </small>
                  </div>
                </div>
              </div>
            </div>

            {/* Gráfico 2: Tareas Por Categoría */}
            <div className="col-12 col-xl-6">
              <div className="card chart-card">
                <div className="card-body">
                  <div className="chart-header">
                    <div>
                      <h5 className="chart-title">
                        📊 Tareas Por Categoría
                      </h5>
                      <p className="chart-description">
                        Distribución por tipo de tarea
                      </p>
                    </div>
                  </div>
                  
                  {/* Placeholder para gráfico */}
                  <div className="chart-placeholder">
                    <p>Gráfico en desarrollo</p>
                    <small>
                      Categorías encontradas: {dataGraficos.categorias.length}
                    </small>
                  </div>
                </div>
              </div>
            </div>

            {/* Gráfico 3: Estado Actual de las Tareas */}
            <div className="col-12 col-xl-6">
              <div className="card chart-card">
                <div className="card-body">
                  <div className="chart-header">
                    <div>
                      <h5 className="chart-title">
                        🎯 Estado Actual de las Tareas
                      </h5>
                      <p className="chart-description">
                        Distribución por estado
                      </p>
                    </div>
                  </div>
                  
                  {/* Placeholder para gráfico */}
                  <div className="chart-placeholder">
                    <p>Gráfico en desarrollo</p>
                    <small>
                      Estados registrados: {dataGraficos.estados.length}
                    </small>
                  </div>
                </div>
              </div>
            </div>

            {/* Gráfico 4: Tiempo Promedio Por Categoría */}
            <div className="col-12 col-xl-6">
              <div className="card chart-card">
                <div className="card-body">
                  <div className="chart-header">
                    <div>
                      <h5 className="chart-title">
                        ⏱️ Tiempo Promedio Por Categoría
                      </h5>
                      <p className="chart-description">
                        Eficiencia por tipo de tarea
                      </p>
                    </div>
                  </div>
                  
                  {/* Placeholder para gráfico */}
                  <div className="chart-placeholder">
                    <p>Gráfico en desarrollo</p>
                    <small>Próximamente</small>
                  </div>
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