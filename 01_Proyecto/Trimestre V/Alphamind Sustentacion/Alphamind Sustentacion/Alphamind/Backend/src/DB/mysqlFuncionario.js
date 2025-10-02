// Todas las Funciones para consultar a la base de datos 
const conexion = require("./mysql")
const bcrypt = require('bcryptjs');





//Consultas Funcionarios
function todos(table) {

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


// /*****************/// CONSULTAR  cargos en orden A - Z//**************** */
function cargo(table, tableCargo) {

  return new Promise((resolve, reject) => {
    const sql = "SELECT f.primer_nombre, c.nombre_cargo FROM ?? f INNER JOIN ?? c ON f.codigo_cargo = c.codigo_cargo order by nombre_cargo asc";  
    conexion.query(sql, [table,tableCargo], (err, results) => {
      if (err) {
        return reject(err);
      }
      resolve(results);
    });
  });
  
}
// /*****************/// Fin de CONSULTAR  cargos en orden A - Z//**************** */




// /*****************/// CONSULTAR Funcionario por su Documento//**************** */

function uno(table, num_documento){
    return new Promise ((resolve, reject)=>{
        const sql = "SELECT * FROM ?? WHERE num_documento = ?"
        conexion.query(sql, [table, num_documento], (err,result)=> {
             if(result.length === 0){
             reject({
             menssaje: "Funcionario no existe"
             })
            }
          if(err){
                return reject(err);
            }
            resolve({
                mensaje: "Funcionario con cedula: " + num_documento + " encontrado" ,
                 result: result
        });
        })

    })
}

// /*****************/// FIN DE CONSULTAR Funcionario por su Documento//**************** */


/*****************/// Agregar Funcionario con su Usuario//**************** */

async function agregar(data) {
  return new Promise((resolve, reject) => {
    console.log("Data recibida" ,data)
    conexion.beginTransaction(async (err) => {
      if (err) return reject(err);

      try {
        const hashedPassword = await bcrypt.hash(data.usuario.contraseña, 10);

        const dataUsuario = {
          tipo_de_rol: data.usuario.tipo_de_rol,
          Contraseña: hashedPassword
        };

        const sqlUsuario = "INSERT INTO Usuario SET ?";

        conexion.query(sqlUsuario, dataUsuario, (err, resultUsuario) => {
          if (err) return conexion.rollback(() => reject(err));

          const idUsuario = resultUsuario.insertId;

          const dataFuncionario = {
            Num_Documento: data.funcionario.num_documento,
            Primer_Nombre: data.funcionario.primer_nombre,
            Segundo_Nombre: data.funcionario.segundo_nombre,
            Primer_Apellido: data.funcionario.primer_apellido,
            Segundo_Apellido: data.funcionario.segundo_apellido,
            Correo_Electronico: data.funcionario.correo_electronico,
            Numero_telefonico: data.funcionario.numero_telefonico,
            id_usuario  : idUsuario
          };

          const sqlFuncionario = "INSERT INTO Funcionario SET ?";

          conexion.query(sqlFuncionario, dataFuncionario, (err, resultFuncionario) => {
            if (err) return conexion.rollback(() => reject(err));
            conexion.commit((err) => {
              if (err) return conexion.rollback(() => reject(err));

              resolve({
                message: "Funcionario creado correctamente",
                idFuncionario: data.funcionario.numDocumento,
                idUsuario
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



/*****************/// Fin Agregar Funcionario con su Usuario//**************** */
 




// /*****************/// Actualizar/Editar Funcionario con su Usuario//**************** */
function actualizar(data) {
  return new Promise(async (resolve, reject) => {
    try {
      const hashedPassword = await bcrypt.hash(data.usuario.contraseña, 10); //por si cambia la contraseña
      conexion.beginTransaction((err) => {
        if (err) return reject(err);

        const dataUsuario = {
          Contraseña: hashedPassword, //metemos los cambios
          tipo_de_rol: data.usuario.tipo_de_rol
        };

        const sqlUsuario = "UPDATE Usuario SET ? WHERE id_usuario = ?"; //hacemos los cambios con su id_usuario

        conexion.query(sqlUsuario, [dataUsuario, data.usuario.id_usuario], (err, resultUsuario) => {
          if (err) return conexion.rollback(() => reject(err));

          const dataFuncionario = {
            Primer_Nombre: data.funcionario.primer_nombre,
            Segundo_Nombre: data.funcionario.segundo_nombre,
            Primer_Apellido: data.funcionario.primer_apellido, // Cambios a realizar
            Segundo_Apellido: data.funcionario.segundo_apellido,
            Correo_Electronico: data.funcionario.correo_electronico,
            Numero_telefonico: data.funcionario.numero_telefonico,
          };

          const sqlFuncionario = "UPDATE Funcionario SET ? WHERE id_usuario = ?"; // lo hacemos segun su ID_usuarios

          conexion.query(sqlFuncionario, [dataFuncionario, data.usuario.id_usuario], (err, resultFuncionario) => {
            if (err) return conexion.rollback(() => reject(err)); 

            conexion.commit((err) => {
              if (err) return conexion.rollback(() => reject(err));

              resolve({
                message: "Funcionario actualizado correctamente",
                Numero_Documento: data.funcionario.num_documento, // 👈 corregido
              });
            });
          });
        });
      });
    } catch (error) {
      reject(error);
    }
  });
}



// /*****************/// Fin Actualizar Funcionario con su Usuario//**************** */




// /*****************/// ELIMINAR //**************** */

function eliminar(table, num_documento) {
    return new Promise((resolve, reject) => {
        const sql = "DELETE FROM ?? WHERE num_documento = ?";
        conexion.query(sql, [table, num_documento], (err, result) => {
            if (err) {
                return reject(err);
            }
            resolve({
                mensaje: `Funcionario con cédula: ${num_documento} eliminado exitosamente`,
                eliminado: true,
            });
        });
    });
}



//Consultas de tareas



module.exports= {
    todos,
    uno,
    agregar,
    eliminar,
    actualizar,
    cargo

}