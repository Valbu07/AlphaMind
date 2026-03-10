// backend/models/reportesModel.js
const db = require("../config/db");

const tableFuncionario = "funcionario";
const tableUsuarios = "usuario";
const tableActividad = "actividad";
const tableAsignacion = "asignacion_actividad";
const tableTarea = "tarea";

async function obtenerFuncionarios() {
  const sql = `
    SELECT 
      f.num_documento,
      f.primer_nombre,
      f.primer_apellido
    FROM funcionario f
    INNER JOIN usuario u 
ON f.id_usuario = u.id_usuario
WHERE f.estado = 'activo'
AND u.estado = 'activo'
ORDER BY f.primer_nombre ASC
  `;

  console.log(sql);
  return await db.queryPromise(sql);
}



async function obtenerReporteFuncionario(num_documento) {
  try {




    const usuario = await db.queryPromise(

      `
  SELECT 
    u.id_usuario,
    f.primer_nombre, 
    f.primer_apellido
  FROM ${tableUsuarios} u
  INNER JOIN ${tableFuncionario} f 
    ON f.id_usuario = u.id_usuario
  WHERE f.num_documento = ?
  `,
      [num_documento]
    );


    // Validar que el usuario exista
    if (!usuario || usuario.length === 0) {
      console.log(' [MODEL] Usuario no encontrado:', num_documento);
      return null;
    }

    const id_usuario = usuario[0].id_usuario;
    console.log('[MODEL] ID de usuario encontrado:', id_usuario);

    const estadisticas = await db.queryPromise(
      `
      SELECT 
        COUNT(DISTINCT a.id_Actividad) AS tareasTotales,
        COUNT(DISTINCT CASE WHEN a.estado_actual = 'completado' THEN a.id_Actividad END) AS completadas,
        COUNT(DISTINCT CASE WHEN a.estado_actual = 'pendiente' THEN a.id_Actividad END) AS pendientes,
        COUNT(DISTINCT CASE WHEN a.estado_actual = 'Entregado con retraso' THEN a.id_Actividad END) AS atrasadas
      FROM ${tableActividad} a
      INNER JOIN ${tableAsignacion} aa
        ON aa.actividad_idActividad = a.id_Actividad
      WHERE aa.Asignado_a_idUsuario = ?
      `,
      [id_usuario]
    );

    const completadasMes = await db.queryPromise(
      `
      SELECT 
        MONTH(a.fecha_creacion) AS mes,
        MONTHNAME(a.fecha_creacion) AS nombreMes,
        COUNT(DISTINCT a.id_Actividad) AS total
      FROM ${tableActividad} a
      INNER JOIN ${tableAsignacion} aa
        ON aa.actividad_idActividad = a.id_Actividad
      WHERE aa.Asignado_a_idUsuario = ? 
        AND a.estado_actual = 'completado'
        AND YEAR(a.fecha_creacion) = YEAR(CURDATE())
      GROUP BY MONTH(a.fecha_creacion), MONTHNAME(a.fecha_creacion)
      ORDER BY mes
      `,
      [id_usuario]
    );

    const categorias = await db.queryPromise(
      `
      SELECT 
        t.tarea AS categoria, 
        COUNT(DISTINCT a.id_Actividad) AS total
      FROM ${tableActividad} a
      INNER JOIN ${tableAsignacion} aa
        ON aa.actividad_idActividad = a.id_Actividad
      INNER JOIN ${tableTarea} t
        ON t.actividad_id_Actividad = a.id_Actividad
      WHERE aa.Asignado_a_idUsuario = ?
      GROUP BY t.tarea
      ORDER BY total DESC
      LIMIT 10
      `,
      [id_usuario]
    );


    const estados = await db.queryPromise(
      `
      SELECT 
        a.estado_actual AS estado, 
        COUNT(DISTINCT t.id_Tarea) AS total
      FROM ${tableTarea} t
      INNER JOIN ${tableActividad} a
        ON t.actividad_id_Actividad = a.id_Actividad
      INNER JOIN ${tableAsignacion} aa
        ON aa.actividad_idActividad = a.id_Actividad
      WHERE aa.Asignado_a_idUsuario = ?
      GROUP BY a.estado_actual
      ORDER BY total DESC
      `,
      [id_usuario]
    );

    const resultado = {
      estadisticas: {
        tareasTotales: estadisticas[0].tareasTotales || 0,
        completadas: estadisticas[0].completadas || 0,
        pendientes: estadisticas[0].pendientes || 0,
        atrasadas: estadisticas[0].atrasadas || 0
      },
      graficos: {
        completadasMes: completadasMes || [],
        categorias: categorias || [],
        estados: estados || []
      },
      funcionario: {
        primer_nombre: usuario?.[0]?.primer_nombre || "",
        primer_apellido: usuario?.[0]?.primer_apellido || ""
      }

    };

    console.log(resultado)
    return resultado;

  } catch (error) {
    console.error(' [MODEL] Error al obtener reporte:', {
      documento: num_documento,
      error: error.message,
      stack: error.stack
    });
    throw new Error(`Error en base de datos: ${error.message}`);
  }
}

module.exports = {
  obtenerReporteFuncionario,
  obtenerFuncionarios
};