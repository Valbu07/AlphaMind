import React, { useState, useEffect } from 'react';
import './reportes.css';

const ReporteDashboard = () => {
  const [metricas, setMetricas] = useState({
    tareasTotales: 0,
    completadas: 0,
    pendientes: 0,
    atrasadas: 0
  });

  const [cargando, setCargando] = useState(true);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState('Juan Perez');

  useEffect(() => {
    cargarDatosIniciales();
  }, []);

  const cargarDatosIniciales = async () => {
    try {
      setTimeout(() => {
        setMetricas({
          tareasTotales: 215,
          completadas: 178,
          pendientes: 27,
          atrasadas: 10
        });
        setCargando(false);
      }, 500);
    } catch (error) {
      console.error('Error al cargar metricas:', error);
      setCargando(false);
    }
  };

  const handleGenerarPDF = () => {
    console.log('Generando PDF del reporte...');
    alert('Funcionalidad de PDF en desarrollo');
  };

  const handleCambiarUsuario = () => {
    console.log('Abriendo selector de usuario...');
    alert('Selector de usuario en desarrollo');
  };


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
      Analisis de desempeño del usuario: <strong>{usuarioSeleccionado}</strong>
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
                <div className="kpi-icon-circle total">
                  
                </div>
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
                  </span>
                </div>
                <div className="kpi-icon-circle completadas">
                  
                </div>
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
                <div className="kpi-icon-circle pendientes">
                  
                </div>
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
                <div className="kpi-icon-circle atrasadas">
                  
                </div>
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
                      <p className="chart-description">Tendencia de los ultimos 6 meses</p>
                    </div>
              
                  </div>
                </div>
              </div>
            </div>
            {/* Gráfico 2: Tareas Por Categoría */}
            <div className="col-12 col-xl-6">
              <div className="card chart-card">
                <div className="card-body">
                </div>
              </div>
            </div>

            {/* Gráfico 3: Estado Actual de las Tareas */}
            <div className="col-12 col-xl-6">
              <div className="card chart-card">
                <div className="card-body">            
                </div>
              </div>
            </div>

            {/* Gráfico 4: Tiempo Promedio Por Categoría */}
            <div className="col-12 col-xl-6">
              <div className="card chart-card">
                <div className="card-body">                
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
