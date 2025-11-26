import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./reportes.css";
const DashboardUsuario = () => {

  const [estadisticas, setEstadisticas] = useState({
    total: 0,
    completadas: 0,
    pendientes: 0,
    atrasadas: 0
  });

  const [graficos, setGraficos] = useState({
    completadasMes: [],
    categorias: [],
    estados: [],
    tiempoCategoria: []
  });

  useEffect(() => {
    obtenerDatos();
  }, []);

  const obtenerDatos = async () => {
    try {
      const res = await fetch("http://localhost:3000/reportes/");
      const data = await res.json();

      setEstadisticas(data.estadisticas);
      setGraficos(data.graficos);
    } catch (error) {
      console.log("Error cargando datos:", error);
    }
  };

  return (
    <div className="container-fluid p-4">

      <div className="row g-4">

        {/* Panel izquierdo */}
        <div className="col-12 col-md-3">
          <div className="card p-3 shadow-sm panel-left">
            <h4 className="mb-3 fw-bold">Total</h4>

            <div className="card kpi-card shadow-sm mb-3 p-3">
              <span className="kpi-title">Tareas Totales</span>
              <span className="kpi-value">{estadisticas.total}</span>
            </div>

            <div className="card kpi-card shadow-sm mb-3 p-3">
              <span className="kpi-title">Completadas</span>
              <span className="kpi-value">{estadisticas.completadas}</span>
            </div>

            <div className="card kpi-card shadow-sm mb-3 p-3">
              <span className="kpi-title">Pendientes</span>
              <span className="kpi-value">{estadisticas.pendientes}</span>
            </div>

            <div className="card kpi-card shadow-sm mb-3 p-3">
              <span className="kpi-title">Atrasadas</span>
              <span className="kpi-value">{estadisticas.atrasadas}</span>
            </div>
          </div>
        </div>

        {/* Panel derecho */}
        <div className="col-12 col-md-9">

          <h2 className="text-center fw-bold mb-4">Reporte del Usuario</h2>

          <div className=" gap-2 col-6 mt-2">
            <button className="btn btn-primary">Usuario</button>
            <button className="btn btn-primary">Generar PDF</button>
          </div>

          <div className="row g-4 mt-2">

            {/* Gráfico 1 */}
            <div className="col-md-6">
              <div className="card chart-card p-3 shadow-sm">
                <h5 className="fw-bold">Tareas Completadas Por Mes</h5>
                <div className="chart-placeholder mt-3">
                  {/* Aquí irá el gráfico */}
                </div>
              </div>
            </div>

            {/* Gráfico 2 */}
            <div className="col-md-6">
              <div className="card chart-card p-3 shadow-sm">
                <h5 className="fw-bold">Tareas Por Categoría</h5>
                <div className="chart-placeholder mt-3">
                  {/* Aquí irá el gráfico */}
                </div>
              </div>
            </div>

            {/* Gráfico 3 */}
            <div className="col-md-6">
              <div className="card chart-card p-3 shadow-sm">
                <h5 className="fw-bold">Estado Actual de las Tareas</h5>
                <div className="chart-placeholder mt-3">
                  {/* Aquí irá el gráfico */}
                </div>
              </div>
            </div>

            {/* Gráfico 4 */}
            <div className="col-md-6">
              <div className="card chart-card p-3 shadow-sm">
                <h5 className="fw-bold">Tiempo Promedio Por Categoría</h5>
                <div className="chart-placeholder mt-3">
                  {/* Aquí irá el gráfico */}
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardUsuario;
