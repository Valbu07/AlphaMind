// backend/models/reportesModel.js
const db = require("../config/db");

const tableFuncionario = "funcionario";
const tableUsuarios    = "usuario";
const tableActividad   = "actividad";
const tableAsignacion  = "asignacion_actividad";
const tableTarea       = "tarea";

async function obtenerFuncionarios() {
  const sql = `
    SELECT 
      f.num_documento,
      f.primer_nombre,
      f.primer_apellido
    FROM funcionario f
    INNER JOIN usuario u ON f.id_usuario = u.id_usuario
    WHERE f.estado = 'activo'
      AND u.estado = 'activo'
    ORDER BY f.primer_nombre ASC
  `;
  return await db.queryPromise(sql);
}

async function obtenerReporteFuncionario(num_documento, mes = null) {
  try {

    // ── USUARIO ─────────────────────────────────────────────────────
    const usuario = await db.queryPromise(
      `SELECT 
        u.id_usuario,
        f.primer_nombre, 
        f.primer_apellido
       FROM ${tableUsuarios} u
       INNER JOIN ${tableFuncionario} f ON f.id_usuario = u.id_usuario
       WHERE f.num_documento = ?`,
      [num_documento]
    );

    if (!usuario || usuario.length === 0) {
      console.log('[MODEL] Usuario no encontrado:', num_documento);
      return null;
    }

    const id_usuario = usuario[0].id_usuario;
    const filtroMes  = mes && mes !== 'todos' ? parseInt(mes) : null;

    console.log('[MODEL] id_usuario:', id_usuario, '| filtroMes:', filtroMes ?? 'todos');

    // ── ESTADÍSTICAS ─────────────────────────────────────────────────
    const estadisticas = await db.queryPromise(
      `SELECT 
        COUNT(DISTINCT a.id_Actividad) AS tareasTotales,
        COUNT(DISTINCT CASE WHEN a.estado_actual = 'Completado'            THEN a.id_Actividad END) AS completadas,
        COUNT(DISTINCT CASE WHEN a.estado_actual = 'Pendiente'             THEN a.id_Actividad END) AS pendientes,
        COUNT(DISTINCT CASE WHEN a.estado_actual = 'Entregado con retraso' THEN a.id_Actividad END) AS atrasadas
       FROM ${tableActividad} a
       INNER JOIN ${tableAsignacion} aa ON aa.actividad_idActividad = a.id_Actividad
       WHERE aa.Asignado_a_idUsuario = ?
         ${filtroMes ? 'AND MONTH(a.fecha_creacion) = ? AND YEAR(a.fecha_creacion) = YEAR(CURDATE())' : ''}`,
      filtroMes ? [id_usuario, filtroMes] : [id_usuario]
    );

    const completadasMes = await db.queryPromise(
      `SELECT 
        num_mes AS mes,
        CASE num_mes
          WHEN 1  THEN 'Enero'       WHEN 2  THEN 'Febrero'
          WHEN 3  THEN 'Marzo'       WHEN 4  THEN 'Abril'
          WHEN 5  THEN 'Mayo'        WHEN 6  THEN 'Junio'
          WHEN 7  THEN 'Julio'       WHEN 8  THEN 'Agosto'
          WHEN 9  THEN 'Septiembre'  WHEN 10 THEN 'Octubre'
          WHEN 11 THEN 'Noviembre'   WHEN 12 THEN 'Diciembre'
        END AS nombreMes,
        total
       FROM (
         SELECT 
           MONTH(a.fecha_creacion) AS num_mes,
           COUNT(DISTINCT a.id_Actividad) AS total
         FROM ${tableActividad} a
         INNER JOIN ${tableAsignacion} aa ON aa.actividad_idActividad = a.id_Actividad
         WHERE aa.Asignado_a_idUsuario = ?
           AND a.estado_actual = 'Completado'
           AND YEAR(a.fecha_creacion) = YEAR(CURDATE())
         GROUP BY MONTH(a.fecha_creacion)
       ) AS sub
       ORDER BY mes`,
      [id_usuario] 
    );

    const mesesDisponibles = await db.queryPromise(
      `SELECT 
        num_mes AS mes,
        CASE num_mes
          WHEN 1  THEN 'Enero'       WHEN 2  THEN 'Febrero'
          WHEN 3  THEN 'Marzo'       WHEN 4  THEN 'Abril'
          WHEN 5  THEN 'Mayo'        WHEN 6  THEN 'Junio'
          WHEN 7  THEN 'Julio'       WHEN 8  THEN 'Agosto'
          WHEN 9  THEN 'Septiembre'  WHEN 10 THEN 'Octubre'
          WHEN 11 THEN 'Noviembre'   WHEN 12 THEN 'Diciembre'
        END AS nombreMes
       FROM (
         SELECT DISTINCT MONTH(a.fecha_creacion) AS num_mes
         FROM ${tableActividad} a
         INNER JOIN ${tableAsignacion} aa ON aa.actividad_idActividad = a.id_Actividad
         WHERE aa.Asignado_a_idUsuario = ?
           AND YEAR(a.fecha_creacion) = YEAR(CURDATE())
       ) AS sub
       ORDER BY mes`,
      [id_usuario]
    );

    const categorias = await db.queryPromise(
      `SELECT 
        t.tarea AS categoria,
        COUNT(DISTINCT a.id_Actividad) AS total
       FROM ${tableActividad} a
       INNER JOIN ${tableAsignacion} aa ON aa.actividad_idActividad = a.id_Actividad
       INNER JOIN ${tableTarea} t       ON t.actividad_id_Actividad = a.id_Actividad
       WHERE aa.Asignado_a_idUsuario = ?
         ${filtroMes ? 'AND MONTH(a.fecha_creacion) = ? AND YEAR(a.fecha_creacion) = YEAR(CURDATE())' : ''}
       GROUP BY t.tarea
       ORDER BY total DESC
       LIMIT 10`,
      filtroMes ? [id_usuario, filtroMes] : [id_usuario]
    );

    const estados = await db.queryPromise(
      `SELECT 
        a.estado_actual AS estado,
        COUNT(DISTINCT t.id_Tarea) AS total
       FROM ${tableTarea} t
       INNER JOIN ${tableActividad} a   ON t.actividad_id_Actividad = a.id_Actividad
       INNER JOIN ${tableAsignacion} aa ON aa.actividad_idActividad  = a.id_Actividad
       WHERE aa.Asignado_a_idUsuario = ?
         ${filtroMes ? 'AND MONTH(a.fecha_creacion) = ? AND YEAR(a.fecha_creacion) = YEAR(CURDATE())' : ''}
       GROUP BY a.estado_actual
       ORDER BY total DESC`,
      filtroMes ? [id_usuario, filtroMes] : [id_usuario]
    );

    const resultado = {
      estadisticas: {
        tareasTotales: estadisticas[0].tareasTotales || 0,
        completadas:   estadisticas[0].completadas   || 0,
        pendientes:    estadisticas[0].pendientes     || 0,
        atrasadas:     estadisticas[0].atrasadas      || 0
      },
      graficos: {
        completadasMes:   completadasMes   || [],
        categorias:       categorias       || [],
        estados:          estados          || [],
        mesesDisponibles: mesesDisponibles || []
      },
      funcionario: {
        primer_nombre:   usuario[0].primer_nombre   || '',
        primer_apellido: usuario[0].primer_apellido || ''
      }
    };

    console.log('[MODEL] Resultado:', JSON.stringify(resultado, null, 2));
    return resultado;

  } catch (error) {
    console.error('[MODEL] Error:', {
      documento: num_documento,
      error:     error.message,
      stack:     error.stack
    });
    throw new Error(`Error en base de datos: ${error.message}`);
  }
}

module.exports = { obtenerReporteFuncionario, obtenerFuncionarios };