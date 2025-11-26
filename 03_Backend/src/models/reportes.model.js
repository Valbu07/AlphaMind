const db = require("../config/db");
const tebleFuncionario = "funcionario";
const tableUsuarios = "usuario";


async function funcionario(num_documento) {
  const usuario = await db.queryPromise(
  `
  SELECT u.id_usuario 
  FROM ${tableUsuarios} u
  INNER JOIN ${tebleFuncionario} f 
    ON f.id_usuario = u.id_usuario
  WHERE f.num_documento = ?
  `,
  [num_documento]
);


  if (usuario.length === 0) return null;

  const id_usuario = usuario[0].id_usuario;


  const estadisticas = await db.queryPromise(
   `
  SELECT 
    COUNT(DISTINCT actividad.id_Actividad) AS total,
    COUNT(DISTINCT CASE WHEN actividad.estado_actual = 'completada' THEN actividad.id_Actividad END) AS completadas,
    COUNT(DISTINCT CASE WHEN actividad.estado_actual = 'pendiente' THEN actividad.id_Actividad END) AS pendientes,
    COUNT(DISTINCT CASE WHEN actividad.estado_actual = 'atrasada' THEN actividad.id_Actividad END) AS atrasadas
  FROM actividad
  INNER JOIN asignacion_actividad
    ON asignacion_actividad.actividad_idActividad = actividad.id_Actividad
  WHERE asignacion_actividad.Asignado_a_idUsuario = ?
`,
[id_usuario]
  );

  const completadasMes = await db.queryPromise(
   `
  SELECT 
    MONTH(actividad.fecha_creacion) AS mes, 
    COUNT(DISTINCT actividad.id_Actividad) AS total
  FROM actividad
  INNER JOIN asignacion_actividad
    ON asignacion_actividad.actividad_idActividad = actividad.id_Actividad
  WHERE asignacion_actividad.Asignado_a_idUsuario = ? 
    AND actividad.estado_actual = 'completada'
  GROUP BY MONTH(actividad.fecha_creacion)
  ORDER BY mes
`,
[id_usuario]
  );

  const categorias = await db.queryPromise(
  `
  SELECT 
    tarea.tarea AS categoria, 
    COUNT(DISTINCT actividad.id_Actividad) AS total
  FROM actividad
  INNER JOIN asignacion_actividad
    ON asignacion_actividad.actividad_idActividad = actividad.id_Actividad
  INNER JOIN tarea
    ON tarea.actividad_id_Actividad = actividad.id_Actividad
  WHERE asignacion_actividad.Asignado_a_idUsuario = ?
  GROUP BY tarea.tarea
  ORDER BY total DESC
`,
[id_usuario]
  );

  const estados = await db.queryPromise(
  `
  SELECT 
    actividad.estado_actual AS estado, 
    COUNT(DISTINCT tarea.id_Tarea) AS total
  FROM tarea
  INNER JOIN actividad
    ON tarea.actividad_id_Actividad = actividad.id_Actividad
  INNER JOIN asignacion_actividad
    ON asignacion_actividad.actividad_idActividad = actividad.id_Actividad
  WHERE asignacion_actividad.Asignado_a_idUsuario = ?
  GROUP BY actividad.estado_actual
  ORDER BY total DESC
`,
[id_usuario]
  );

  return {
    estadisticas: estadisticas[0],
    graficos: {
      completadasMes,
      categorias,
      estados
    }
  };
}

module.exports = {
  funcionario,
};