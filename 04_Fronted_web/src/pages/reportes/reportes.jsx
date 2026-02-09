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

function ListaUsuarios() {
  const [usuarios, setUsuarios] = useState([]);

  useEffect(() => {
    getUsuarios().then(setUsuarios);
  }, []);
}


  
  const cargarDatosIniciales = async (documento) => {
    try {
      setCargando(true);
      setError(null);

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
  <div className="container-fluid p-4 pt-5">

    {/* ============================================
        HEADER DEL REPORTE
    ============================================ */}
    <div className="reportes-header mb-4 ">
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 ">
        <h2 className="reportes-titulo mb-0">Reporte del Usuario</h2>
        
        <div className=" row justify-content-end reportes-botones">
        <div className="col-12 col-md-auto  gap-2">
            <button className="btn btn-primary" onClick={handleCambiarUsuario}>
            Usuario: {usuario?.num_documento}
          </button>

          <button className="btn btn-secondary mt-4" onClick={handleGenerarPDF}>
            Generar PDF
          </button>
        </div>
        </div>
      </div>
    </div>



    {/* ============================================
        FILA DE KPIs
    ============================================ */}
    <div className="row g-4 mb-4 pt-2">
      
      <div className="col-6 col-lg-3 mb-4">
        <KPICard title="Tareas Totales" value={metricas.tareasTotales} loading={false} color="blue"/>
      </div>

      <div className="col-6 col-lg-3 mb-4">
        <KPICard className="Completadas" title="Completadas" value={metricas.completadas}  color="green"
  valueColor="#10b948" loading={false} />
      </div>

      <div className="col-6 col-lg-3 mb-4">
        <KPICard title="Pendientes" value={metricas.pendientes} color="orange" loading={false} />
      </div>

      <div className="col-6 col-lg-3 mb-4">
        <KPICard title="Atrasadas" value={metricas.atrasadas} color="red" valueColor="#e94c4c" loading={false} />
      </div>

    </div>

    
    {/* ============================================
        GRID DE GRÁFICOS -
    ============================================ */}
    <div className="row g-4">

      {/* Gráfico 1 */}
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

      {/* Gráfico 2 */}
      <div className="col-12 col-xl-6 mb-4">
        <ChartCard title="Tareas Por Categoría" loading={false}>
          {dataCategorias.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={dataCategorias}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={90}
                  dataKey="value"
                >
                  {dataCategorias.map((entry, index) => (
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

      {/* Gráfico 3 */}
      <div className="col-12 col-xl-6 mb-4">
        <ChartCard title="Estado Actual de las Tareas" loading={false}>
          {dataEstados.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={dataEstados}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={90}
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
      <div className="col-12 col-xl-6 mb-4">
        <ChartCard title="Rendimiento Semanal" loading={false}>
          <div className="chart-placeholder">Próximamente</div>
        </ChartCard>
      </div>

    </div>

  </div>
);
};

export default ReporteDashboard;