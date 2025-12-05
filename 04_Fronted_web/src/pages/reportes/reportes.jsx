// src/pages/Reportes.jsx
import React, { useState, useEffect } from 'react';
import {BarChart,Bar,PieChart,Pie,Cell,XAxis,YAxis, CartesianGrid,Tooltip, Legend, ResponsiveContainer} from 'recharts';
import KPICard from '../../components/reportes/KPICard';
import ChartCard from '../../components/reportes/ChartCard';
import { obtenerReporteFuncionario } from '../../services/reportesServices';
import { getNumDocumentoFromToken } from '../../utils/jwtUtilis';

const Reportes = () => {
  const [reporteData, setReporteData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [numDocumento, setNumDocumento] = useState('');

  // Colores para los gráficos
  const COLORS = ['#4b2e39', '#8b5a6f', '#c99da3', '#e5d6cc', '#f4e9e2'];

  useEffect(() => {
    cargarReporte();
  }, []);

  const cargarReporte = async () => {
    try {
      setLoading(true);
      setError(null);

      // Obtener número de documento del token
      const num_doc = getNumDocumentoFromToken();
      
      if (!num_doc) {
        throw new Error('No se pudo obtener el número de documento del token');
      }

      setNumDocumento(num_doc);

      // Llamar al servicio
      const response = await obtenerReporteFuncionario(num_doc);

      if (response.success && response.data) {
        setReporteData(response.data);
      } else {
        throw new Error('No se encontraron datos del reporte');
      }
    } catch (err) {
      console.error('Error al cargar reporte:', err);
      setError(err.message || 'Error al cargar el reporte');
    } finally {
      setLoading(false);
    }
  };

  const handleCambiarUsuario = () => {
    // TODO: Implementar lógica para cambiar de usuario
    console.log('Cambiar usuario');
  };

  const handleGenerarPDF = () => {
    // TODO: Implementar generación de PDF
    console.log('Generar PDF');
  };

  // Preparar datos para el gráfico de meses
  const dataMeses = reporteData?.graficos?.completadasMes?.map(item => ({
    mes: item.nombreMes,
    total: item.total
  })) || [];

  // Preparar datos para el gráfico de categorías
  const dataCategorias = reporteData?.graficos?.categorias?.map(item => ({
    name: item.categoria,
    value: item.total
  })) || [];

  // Preparar datos para el gráfico de estados
  const dataEstados = reporteData?.graficos?.estados?.map(item => ({
    name: item.estado,
    value: item.total
  })) || [];

  if (error) {
    return (
      <div className="container-fluid p-4">
        <div className="alert alert-danger" role="alert">
          <h4 className="alert-heading">Error</h4>
          <p>{error}</p>
          <button className="btn btn-primary" onClick={cargarReporte}>
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid p-4">
      <div className="row g-4">
        {/* Panel izquierdo - KPIs */}
        <div className="col-12 col-md-3">
          <div className="card p-3 shadow-sm panel-left">
            <h4 className="mb-3 fw-bold">Total</h4>

            <KPICard
              title="Tareas Totales"
              value={reporteData?.estadisticas?.tareasTotales || 0}
              loading={loading}
            />

            <KPICard
              title="Completadas"
              value={reporteData?.estadisticas?.completadas || 0}
              loading={loading}
            />

            <KPICard
              title="Pendientes"
              value={reporteData?.estadisticas?.pendientes || 0}
              loading={loading}
            />

            <KPICard
              title="Atrasadas"
              value={reporteData?.estadisticas?.atrasadas || 0}
              loading={loading}
            />
          </div>
        </div>

        {/* Panel derecho - Gráficos */}
        <div className="col-12 col-md-9">
          <h2 className="text-center fw-bold mb-4">Reporte del Usuario</h2>

          <div className="d-grid gap-2 col-6 mx-auto mb-4">
            <button
              className="btn btn-primary"
              type="button"
              onClick={handleCambiarUsuario}
            >
              Usuario: {numDocumento}
            </button>
            <button
              className="btn btn-primary"
              type="button"
              onClick={handleGenerarPDF}
              disabled
            >
              Generar PDF
            </button>
          </div>

          <div className="row g-4">
            {/* Gráfico 1: Tareas Completadas Por Mes */}
            <div className="col-md-6">
              <ChartCard title="Tareas Completadas Por Mes" loading={loading}>
                {dataMeses.length > 0 ? (
                  <ResponsiveContainer width="100%" height={240}>
                    <BarChart data={dataMeses}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="mes" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="total" fill="#4b2e39" />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="chart-placeholder">Sin datos</div>
                )}
              </ChartCard>
            </div>

            {/* Gráfico 2: Tareas Por Categoría */}
            <div className="col-md-6">
              <ChartCard title="Tareas Por Categoría" loading={loading}>
                {dataCategorias.length > 0 ? (
                  <ResponsiveContainer width="100%" height={240}>
                    <PieChart>
                      <Pie
                        data={dataCategorias}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) =>
                          `${name}: ${(percent * 100).toFixed(0)}%`
                        }
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {dataCategorias.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
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

            {/* Gráfico 3: Estado Actual de las Tareas */}
            <div className="col-md-6">
              <ChartCard title="Estado Actual de las Tareas" loading={loading}>
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
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {dataEstados.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
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

            {/* Gráfico 4: Placeholder para futuro */}
            <div className="col-md-6">
              <ChartCard title="Tiempo Promedio Por Categoría" loading={loading}>
                <div className="chart-placeholder">
                  Próximamente
                </div>
              </ChartCard>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reportes;