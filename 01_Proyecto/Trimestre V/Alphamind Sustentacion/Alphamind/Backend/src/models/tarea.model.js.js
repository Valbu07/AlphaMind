const conexion = require('../config/db'); 


/*****************/// Buscar Todas las tareas //**************** */


function todas(table) {

  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM ??";  
    conexion.query(sql, [table], (err, results) => {
      if (err) {
        return reject(err);
      }
      resolve(results);
    });
  });
  
}

/*****************/// Fin Buscar Todas las tareas //**************** */



/*****************///  Buscar las tareas de un funcionario //**************** */


function tareasPorFuncionario(num_documento){
    return new Promise ((resolve, reject)=>{
        const sql = `SELECT f.primer_nombre, f.primer_apellido, f.segundo_apellido, a.asunto, a.descripcion, a.fecha_creacion, a.fecha_vencimiento, a.prioridad, a.fecha_de_entrega, a.estado_actual 
        FROM asignacion_actividad aa 
        INNER JOIN actividad a ON aa.actividad_idActividad = a.id_Actividad 
        INNER JOIN usuario u ON aa.Asignado_a_idUsuario = u.id_usuario 
        INNER JOIN funcionario f ON f.id_usuario = u.id_usuario WHERE a.estado_actual != 'Completado'
         AND f.num_documento = ?`


        conexion.query(sql, [ num_documento], (err,result)=> {
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

/*****************/// Fin Buscar las tareas de un funcionario //**************** */


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
/*****************/// FIN CREAR TAREA //**************** */



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

/*****************/// FIN EDITAR TAREA //**************** */





function eliminarTarea(id_actividad) {
  return new Promise((resolve, reject) => {
    conexion.beginTransaction((err) => {
      if (err) return reject(err);
      const sqlAsignacion = "DELETE FROM asignacion_actividad WHERE actividad_idActividad = ?";
      conexion.query(sqlAsignacion, [id_actividad], (err) => { //eliminamos en la tabla de asignacion
        if (err) return conexion.rollback(() => reject(err));
        const sqlTarea = "DELETE FROM tarea WHERE actividad_id_Actividad = ?";
        conexion.query(sqlTarea, [id_actividad], (err) => { //Eliminamos las tareas existentes con ese id
          if (err) return conexion.rollback(() => reject(err));

          const sqlActividad = "DELETE FROM actividad WHERE id_Actividad = ?";
          conexion.query(sqlActividad, [id_actividad], (err, result) => { //por ultimo eliminamos las actividades
            if (err) return conexion.rollback(() => reject(err));

            
    if (result.affectedRows === 0) {
              return conexion.rollback(() => //Para verificar si existe 
                reject({ mensaje: "La actividad no existe", eliminado: false })
              );
            }

            conexion.commit((err) => {
              if (err) return conexion.rollback(() => reject(err));
              resolve({
                mensaje: `Actividad con id ${id_actividad} exitosamente`,
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
  editarTarea,
  eliminarTarea
};
