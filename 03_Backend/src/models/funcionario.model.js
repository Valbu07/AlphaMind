// Todas las Funciones para consultar a la base de datos 
const conexion = require("../config/db")
const bcrypt = require('bcryptjs');





//Consultas Funcionarios
function todos(table) {

  return new Promise((resolve, reject) => {
    const sql = "select funcionario.id_usuario, num_documento,primer_nombre, segundo_nombre,primer_apellido,segundo_apellido, correo_electronico, numero_telefonico ,tipo_de_rol from funcionario inner join usuario on funcionario.id_usuario = usuario.id_usuario";  
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
        const sql = "SELECT * FROM ?? WHERE num_documento = ? "
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
    console.log("Data recibida: " ,data)
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
// models/funcionario.model.js

function actualizar(data) {
  return new Promise(async (resolve, reject) => {
    try {
      console.log(' Iniciando actualización...');
      console.log('Datos recibidos:', data);

      const sqlBuscar = "SELECT id_usuario FROM Funcionario WHERE Num_Documento = ?";
      
      conexion.query(sqlBuscar, [data.funcionario.num_documento], async (err, resultado) => {
        if (err) return reject(err);
        
        if (resultado.length === 0) {
          return reject(new Error('Funcionario no encontrado'));
        }
        
        const idUsuario = resultado[0].id_usuario;
        console.log('Funcionario encontrado, ID:', idUsuario);


        conexion.beginTransaction(async (err) => {
          if (err) return reject(err);

          try {

            const dataUsuario = {};
            
            // Solo hashear contraseña si viene nueva
            if (data.usuario.contraseña && data.usuario.contraseña.trim() !== '') {
              const hashedPassword = await bcrypt.hash(data.usuario.contraseña, 10);
              dataUsuario.Contraseña = hashedPassword;
              console.log('Nueva contraseña hasheada');
            }
            

            if (data.usuario.tipo_de_rol) {
              dataUsuario.tipo_de_rol = data.usuario.tipo_de_rol;
            }


            const actualizarUsuario = () => {
              return new Promise((res, rej) => {
                if (Object.keys(dataUsuario).length === 0) {
                  console.log('⏭No hay cambios en Usuario, saltando...');
                  return res();
                }

                const sqlUsuario = "UPDATE Usuario SET ? WHERE id_usuario = ?";
                conexion.query(sqlUsuario, [dataUsuario, idUsuario], (err, result) => {
                  if (err) return rej(err);
                  console.log(' Usuario actualizado');
                  res();
                });
              });
            };

            await actualizarUsuario();


            const dataFuncionario = {};
            
            if (data.funcionario.primer_nombre) 
              dataFuncionario.Primer_Nombre = data.funcionario.primer_nombre;
            if (data.funcionario.segundo_nombre !== undefined) 
              dataFuncionario.Segundo_Nombre = data.funcionario.segundo_nombre;
            if (data.funcionario.primer_apellido) 
              dataFuncionario.Primer_Apellido = data.funcionario.primer_apellido;
            if (data.funcionario.segundo_apellido !== undefined) 
              dataFuncionario.Segundo_Apellido = data.funcionario.segundo_apellido;
            if (data.funcionario.correo_electronico) 
              dataFuncionario.Correo_Electronico = data.funcionario.correo_electronico;
            if (data.funcionario.numero_telefonico) 
              dataFuncionario.Numero_telefonico = data.funcionario.numero_telefonico;

          
            const actualizarFuncionario = () => {
              return new Promise((res, rej) => {
                if (Object.keys(dataFuncionario).length === 0) {
                  console.log('No hay cambios en Funcionario');
                  return res();
                }

                const sqlFuncionario = "UPDATE Funcionario SET ? WHERE id_usuario = ?";
                conexion.query(sqlFuncionario, [dataFuncionario, idUsuario], (err, result) => {
                  if (err) return rej(err);
                  console.log('Funcionario actualizado');
                  res();
                });
              });
            };

            await actualizarFuncionario();

         
            conexion.commit((err) => {
              if (err) {
                return conexion.rollback(() => reject(err));
              }

              console.log('Transacción completada con éxito');
              
              resolve({
                message: "Funcionario actualizado correctamente",
                numero_documento: data.funcionario.num_documento,
                cambios: {
                  usuario: Object.keys(dataUsuario),
                  funcionario: Object.keys(dataFuncionario)
                }
              });
            });

          } catch (error) {
            console.error('Error durante la transacción:', error);
            conexion.rollback(() => reject(error));
          }
        });
      });

    } catch (error) {
      console.error('error general:', error);
      reject(error);
    }
  });
}



// /*****************/// Fin Actualizar Funcionario con su Usuario//**************** */


// /*****************/// ELIMINAR Funcionario con su Usuario//**************** */

function eliminar(num_documento) {
    return new Promise((resolve, reject) => {
        if (!num_documento || num_documento.trim() === '') {
            return reject(new Error("El número de documento es requerido"));
        }
         console.log("NUmero para eliminar:", num_documento);

        conexion.beginTransaction((err) => {
            if (err) {
                console.error("Error en beginTransaction:", err);
                return reject(new Error("No se pudo iniciar la transacción"));
            }
            const sqlSelect = "SELECT id_usuario FROM funcionario WHERE num_documento = ?";
            conexion.query(sqlSelect, [num_documento], (err, result) => {
                if (err) {
                    console.error(" Error en SELECT:", err);
                    return conexion.rollback(() => {
                        reject(new Error("Error al buscar el funcionario en la base de datos"));
                    });
                }
                if (result.length === 0) {
                    return conexion.rollback(() => {
                        reject(new Error(`No se encontró el funcionario con documento: ${num_documento}`));
                    });
                }
                const id_usuario = result[0].id_usuario;


                const sqlFuncionario = "DELETE FROM funcionario WHERE num_documento = ?";
                conexion.query(sqlFuncionario, [num_documento], (err, resultFunc) => {
                    if (err) {
                        console.error("Error eliminando funcionario:", err);
                        return conexion.rollback(() => {
                            reject(new Error("Error al eliminar el registro del funcionario"));
                        });
                    }
                    const sqlUsuario = "DELETE FROM usuario WHERE id_usuario = ?";
                    conexion.query(sqlUsuario, [id_usuario], (err, resultUser) => {
                        if (err) {
                            console.error("Error eliminando usuario:", err);
                            return conexion.rollback(() => {
                                reject(new Error("Error al eliminar el registro del usuario"));
                            });
                        }

                        conexion.commit((err) => {
                            if (err) {
                                console.error("Error en commit:", err);
                                return conexion.rollback(() => {
                                    reject(new Error("Error al confirmar la eliminación"));
                                });
                            }

                            console.log(` Eliminación completada para: ${num_documento}`);
                            resolve({ 
                                success: true,
                                message: "Funcionario eliminado correctamente",
                                numero_documento: num_documento,
                                detalles: {
                                    funcionario_eliminado: resultFunc.affectedRows,
                                    usuario_eliminado: resultUser.affectedRows
                                }
                            });
                        });
                    });
                });
            });
        });
    });
}

// /*****************/// FIN ELIMINAR //**************** */



module.exports= {
    todos,
    uno,
    agregar,
    eliminar,
    actualizar,
    cargo

}