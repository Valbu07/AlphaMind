const conexion = require('../config/db'); 

/*****************/// Buscar Todas las tareas //**************** */
function todas(table) {
  return new Promise((resolve, reject) => {
    const sql = 
    `SELECT a.id_Actividad, a.asunto, a.descripcion, a.fecha_creacion, a.fecha_vencimiento,
    a.prioridad, a.fecha_de_entrega, a.estado_actual, t.tarea,
    aa.Asignado_por_idUsuario,
    aa.Asignado_a_idUsuario
    FROM actividad a
    LEFT JOIN tarea t ON t.actividad_id_Actividad = a.id_Actividad
    LEFT JOIN asignacion_actividad aa ON aa.actividad_idActividad = a.id_Actividad

    ORDER BY a.fecha_creacion DESC`;
    
    conexion.query(sql, (err, results) => {
      if (err) {
        return reject(err);
      }
      resolve(results);
    });
  });
}

/*****************/// Buscar las tareas ASIGNADAS A un usuario //**************** */
function tareasAsignadasAMi(id_usuario) {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT 
        a.id_Actividad, 
        a.asunto, 
        a.descripcion, 
        a.fecha_creacion, 
        a.fecha_vencimiento,
        a.prioridad, 
        a.fecha_de_entrega, 
        a.estado_actual, 
        t.tarea,
        aa.Asignado_por_idUsuario,
        aa.Asignado_a_idUsuario,
        CONCAT(f.primer_nombre, ' ', f.primer_apellido) as nombre_asignador
      FROM actividad a
      LEFT JOIN tarea t ON t.actividad_id_Actividad = a.id_Actividad
      LEFT JOIN asignacion_actividad aa ON aa.actividad_idActividad = a.id_Actividad
      LEFT JOIN usuario u ON aa.Asignado_por_idUsuario = u.id_usuario
      LEFT JOIN funcionario f ON f.id_usuario = u.id_usuario
      WHERE aa.Asignado_a_idUsuario = ?
      ORDER BY a.fecha_creacion DESC
    `;
    
    conexion.query(sql, [id_usuario], (err, results) => {
      if (err) {
        return reject(err);
      }
      resolve(results);
    });
  });
}

/*****************///  Buscar las tareas de un funcionario //**************** */
function tareasPorFuncionario(num_documento){
    return new Promise ((resolve, reject)=>{
        const sql = `SELECT f.primer_nombre, f.primer_apellido, f.segundo_apellido, a.asunto, a.descripcion, 
        a.fecha_creacion, a.fecha_vencimiento, a.prioridad, a.fecha_de_entrega, a.estado_actual 
        FROM asignacion_actividad aa 
        INNER JOIN actividad a ON aa.actividad_idActividad = a.id_Actividad 
        INNER JOIN usuario u ON aa.Asignado_a_idUsuario = u.id_usuario 
        INNER JOIN funcionario f ON f.id_usuario = u.id_usuario WHERE a.estado_actual != 'Completado'
        AND f.num_documento = ?`;

        conexion.query(sql, [num_documento], (err,result)=> {
             if(result === 0){
             reject({
             menssaje: "Funcionario no tiene Tareas"
             })
            }
          if(err){
            console.log(err)
                return reject(err);
            }
            resolve({
                 result: result
        });
        })
    })
}

/*****************/// CREAR TAREA //**************** */
async function crearTarea(data) {
  return new Promise((resolve, reject) => {
    console.log("Data recibida:", data);

    conexion.beginTransaction((err) => {
      if (err) return reject(err);
      try {
        const dataActividad = {
          asunto: data.actividad.asunto,
          descripcion: data.actividad.descripcion,
          fecha_creacion: data.actividad.fecha_creacion,
          fecha_vencimiento: data.actividad.fecha_vencimiento,
          prioridad: data.actividad.prioridad,
          fecha_de_entrega: data.actividad.fecha_de_entrega,
          estado_actual: data.actividad.estado_actual
        };

        const sqlActividad = "INSERT INTO actividad SET ?";

        conexion.query(sqlActividad, dataActividad, (err, resultActividad) => {
          if (err) return conexion.rollback(() => reject(err));

          const id_Actividad = resultActividad.insertId;

          const dataTarea = {
            tarea: data.tarea.titulo,
            actividad_id_Actividad: id_Actividad
          };

          const sqlTarea = "INSERT INTO tarea SET ?";

          conexion.query(sqlTarea, dataTarea, (err, resultTarea) => {
            if (err) return conexion.rollback(() => reject(err));

            const id_Tarea = resultTarea.insertId;

            const dataAsignacion = {
              actividad_idActividad: id_Actividad,
              Asignado_por_idUsuario: data.asignacion.asignado_por,
              Asignado_a_idUsuario: data.asignacion.asignado_a
            };

            const sqlAsignacion = "INSERT INTO asignacion_actividad SET ?";

            conexion.query(sqlAsignacion, dataAsignacion, (err) => {
              if (err) return conexion.rollback(() => reject(err));

              conexion.commit((err) => {
                if (err) return conexion.rollback(() => reject(err));

                resolve({
                  message: "Tarea creada correctamente",
                  id_Actividad,
                  id_Tarea,
                  asignado_a: data.asignacion.asignado_a
                });
              });
            });
          });
        });
      } catch (error) {
        return conexion.rollback(() => reject(error));
      }
    });
  });
}

/*****************/// EDITAR TAREA //**************** */
async function editarTarea(data, id_actividad) {
  return new Promise((resolve, reject) => {
    console.log("Data recibida:", data, "id_actividad:", id_actividad);

    conexion.beginTransaction((err) => {
      if (err) return reject(err);

      try {
        const dataActividad = {
          asunto: data.actividad.asunto,
          descripcion: data.actividad.descripcion,
          fecha_creacion: data.actividad.fecha_creacion,
          fecha_vencimiento: data.actividad.fecha_vencimiento,
          prioridad: data.actividad.prioridad,
          fecha_de_entrega: data.actividad.fecha_de_entrega,
          estado_actual: data.actividad.estado_actual || "Pendiente"
        };

        const sqlActividad = "UPDATE actividad SET ? WHERE id_Actividad = ?";
        conexion.query(sqlActividad, [dataActividad, id_actividad], (err) => {
          if (err) return conexion.rollback(() => reject(err));

          const dataTarea = {
            tarea: data.tarea.titulo
          };

          const sqlTarea = "UPDATE tarea SET ? WHERE actividad_id_Actividad = ?";
          conexion.query(sqlTarea, [dataTarea, id_actividad], (err) => {
            if (err) return conexion.rollback(() => reject(err));

            const dataAsignacion = {
              Asignado_por_idUsuario: data.asignacion.asignado_por,
              Asignado_a_idUsuario: data.asignacion.asignado_a
            };

            const sqlAsignacion = "UPDATE asignacion_actividad SET ? WHERE actividad_idActividad = ?";
            conexion.query(sqlAsignacion, [dataAsignacion, id_actividad], (err) => {
              if (err) return conexion.rollback(() => reject(err));

              conexion.commit((err) => {
                if (err) return conexion.rollback(() => reject(err));

                resolve({
                  message: "Tarea editada correctamente",
                });
              });
            });
          });
        });
      } catch (error) {
        return conexion.rollback(() => reject(error));
      }
    });
  });
}

/*****************/// COMPLETAR ACTIVIDAD //**************** */
function completarActividad(id_actividad) {
  return new Promise((resolve, reject) => {
    // Obtener fecha de vencimiento
    const sqlGet = "SELECT fecha_vencimiento FROM actividad WHERE id_Actividad = ?";
    
    conexion.query(sqlGet, [id_actividad], (err, results) => {
      if (err) return reject(err);
      if (results.length === 0) {
        return reject({ mensaje: "Actividad no encontrada" });
      }

      const fechaVencimiento = results[0].fecha_vencimiento;
      const fechaVenc = new Date(fechaVencimiento);
      const hoy = new Date();
      
      // Determinar estado según si está retrasada
      const estado_actual = hoy > fechaVenc ? "Entregado con retraso" : "Completado";
      
      // Fecha de entrega actual en formato MySQL
      const fecha_entrega = new Date().toISOString().slice(0, 19).replace("T", " ");

      // Actualizar actividad
      const sqlUpdate = `
        UPDATE actividad 
        SET estado_actual = ?, 
            fecha_de_entrega = ?
        WHERE id_Actividad = ?
      `;
      
      conexion.query(sqlUpdate, [estado_actual, fecha_entrega, id_actividad], (err) => {
        if (err) return reject(err);
        
        resolve({
          message: "Actividad completada correctamente",
          estado_actual: estado_actual,
          fecha_de_entrega: fecha_entrega
        });
      });
    });
  });
}

/*****************/// ELIMINAR TAREA //**************** */
function eliminarTarea(id_actividad) {
  return new Promise((resolve, reject) => {
    conexion.beginTransaction((err) => {
      if (err) return reject(err);
      const sqlAsignacion = "DELETE FROM asignacion_actividad WHERE actividad_idActividad = ?";
      conexion.query(sqlAsignacion, [id_actividad], (err) => {
        if (err) return conexion.rollback(() => reject(err));
        const sqlTarea = "DELETE FROM tarea WHERE actividad_id_Actividad = ?";
        conexion.query(sqlTarea, [id_actividad], (err) => {
          if (err) return conexion.rollback(() => reject(err));

          const sqlActividad = "DELETE FROM actividad WHERE id_Actividad = ?";
          conexion.query(sqlActividad, [id_actividad], (err, result) => {
            if (err) return conexion.rollback(() => reject(err));

            if (result.affectedRows === 0) {
              return conexion.rollback(() =>
                reject({ mensaje: "La actividad no existe", eliminado: false })
              );
            }

            conexion.commit((err) => {
              if (err) return conexion.rollback(() => reject(err));
              resolve({
                mensaje: `Actividad con id ${id_actividad} eliminada exitosamente`,
                eliminado: true,
              });
            });
          });
        });
      });
    });
  });
}

module.exports = {
  crearTarea,
  todas,
  tareasPorFuncionario,
  tareasAsignadasAMi,
  editarTarea,
  completarActividad, 
  eliminarTarea
};