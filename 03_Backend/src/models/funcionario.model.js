// Todas las Funciones para consultar a la base de datos 
const conexion = require("../config/db")
const bcrypt = require('bcryptjs');


// ============================
// CONSULTAR TODOS LOS FUNCIONARIOS
// ============================

function todos() {

  return new Promise((resolve, reject) => {

    const sql = `
      SELECT 
      funcionario.id_usuario,
      num_documento,
      primer_nombre,
      segundo_nombre,
      primer_apellido,
      segundo_apellido,
      correo_electronico,
      numero_telefonico,
      documento,
      cargo,
      foto_perfil,
      tipo_de_rol
      FROM funcionario
      INNER JOIN usuario 
      ON funcionario.id_usuario = usuario.id_usuario
      WHERE funcionario.estado = 'activo'
      AND usuario.estado = 'activo'
    `;

    conexion.query(sql, (err, results) => {
      if (err) {
        return reject(err);
      } 
      resolve(results);
    });

  });

}


// ============================
// CONSULTAR CARGOS A-Z
// ============================

function cargo() {

  return new Promise((resolve, reject) => {

    const sql = `
    SELECT primer_nombre, cargo
    FROM funcionario
    WHERE estado = 'activo'
    ORDER BY cargo ASC
    `;

    conexion.query(sql, (err, results) => {

      if (err) {
        return reject(err);
      }

      resolve(results);

    });

  });
}


// ============================
// CONSULTAR FUNCIONARIO POR DOCUMENTO
// ============================

function uno(num_documento){

    return new Promise ((resolve, reject)=>{

        const sql = `
        SELECT * 
        FROM funcionario 
        WHERE num_documento = ?
        AND estado = 'activo'
        `

        conexion.query(sql, [num_documento], (err,result)=> {

            if(err){
                return reject(err);
            }

            if(result.length === 0){
                return reject({
                    mensaje: "Funcionario no existe"
                })
            }

            resolve({
                mensaje: "Funcionario con cedula: " + num_documento + " encontrado" ,
                result: result
            });

        })

    })
}



// ============================
// AGREGAR FUNCIONARIO + USUARIO
// ============================

async function agregar(data) {

  return new Promise((resolve, reject) => {

    conexion.beginTransaction(async (err) => {

      if (err) return reject(err);

      try {

        const hashedPassword = await bcrypt.hash(data.usuario.contraseña, 10);

        const dataUsuario = {
          tipo_de_rol: data.usuario.tipo_de_rol,
          contraseña: hashedPassword
        };

        const sqlUsuario = "INSERT INTO usuario SET ?";

        conexion.query(sqlUsuario, dataUsuario, (err, resultUsuario) => {

          if (err) return conexion.rollback(() => reject(err));

          const idUsuario = resultUsuario.insertId;

          const dataFuncionario = {

            num_documento: data.funcionario.num_documento,
            primer_nombre: data.funcionario.primer_nombre,
            segundo_nombre: data.funcionario.segundo_nombre,
            primer_apellido: data.funcionario.primer_apellido,
            segundo_apellido: data.funcionario.segundo_apellido,
            correo_electronico: data.funcionario.correo_electronico,
            numero_telefonico: data.funcionario.numero_telefonico,
            documento: data.funcionario.documento,
            cargo: data.funcionario.cargo,
            id_usuario: idUsuario

          };

          const sqlFuncionario = "INSERT INTO funcionario SET ?";

          conexion.query(sqlFuncionario, dataFuncionario, (err) => {

            if (err) return conexion.rollback(() => reject(err));

            conexion.commit((err) => {

              if (err) return conexion.rollback(() => reject(err));

              resolve({
                message: "Funcionario creado correctamente",
                numero_documento: data.funcionario.num_documento,
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



// ============================
// ACTUALIZAR FUNCIONARIO + USUARIO
// ============================

function actualizar(data) {

  return new Promise(async (resolve, reject) => {

    try {

      const sqlBuscar = "SELECT id_usuario FROM funcionario WHERE num_documento = ?";

      conexion.query(sqlBuscar, [data.funcionario.num_documento], async (err, resultado) => {

        if (err) return reject(err);

        if (resultado.length === 0) {
          return reject(new Error('Funcionario no encontrado'));
        }

        const idUsuario = resultado[0].id_usuario;

        conexion.beginTransaction(async (err) => {

          if (err) return reject(err);

          try {

            // =========================
            // ACTUALIZAR USUARIO
            // =========================

            const dataUsuario = {};

            if (data.usuario.contraseña && data.usuario.contraseña.trim() !== '') {

              const hashedPassword = await bcrypt.hash(data.usuario.contraseña, 10);

              dataUsuario.contraseña = hashedPassword;

            }

            if (data.usuario.tipo_de_rol) {
              dataUsuario.tipo_de_rol = data.usuario.tipo_de_rol;
            }

            if (Object.keys(dataUsuario).length > 0) {

              const sqlUsuario = "UPDATE usuario SET ? WHERE id_usuario = ?";

              await new Promise((res, rej) => {

                conexion.query(sqlUsuario, [dataUsuario, idUsuario], (err) => {

                  if (err) return rej(err);
                  res();

                });

              });

            }


            // =========================
            // ACTUALIZAR FUNCIONARIO
            // =========================

            const dataFuncionario = {};

            if (data.funcionario.primer_nombre)
              dataFuncionario.primer_nombre = data.funcionario.primer_nombre;

            if (data.funcionario.segundo_nombre !== undefined)
              dataFuncionario.segundo_nombre = data.funcionario.segundo_nombre;

            if (data.funcionario.primer_apellido)
              dataFuncionario.primer_apellido = data.funcionario.primer_apellido;

            if (data.funcionario.segundo_apellido !== undefined)
              dataFuncionario.segundo_apellido = data.funcionario.segundo_apellido;

            if (data.funcionario.correo_electronico)
              dataFuncionario.correo_electronico = data.funcionario.correo_electronico;

            if (data.funcionario.numero_telefonico)
              dataFuncionario.numero_telefonico = data.funcionario.numero_telefonico;

            if (data.funcionario.documento)
              dataFuncionario.documento = data.funcionario.documento;

            if (data.funcionario.cargo)
              dataFuncionario.cargo = data.funcionario.cargo;


            if (Object.keys(dataFuncionario).length > 0) {

              const sqlFuncionario = "UPDATE funcionario SET ? WHERE id_usuario = ?";

              await new Promise((res, rej) => {

                conexion.query(sqlFuncionario, [dataFuncionario, idUsuario], (err) => {

                  if (err) return rej(err);
                  res();

                });

              });

            }


            conexion.commit((err) => {

              if (err) {
                return conexion.rollback(() => reject(err));
              }

              resolve({
                message: "Funcionario actualizado correctamente",
                numero_documento: data.funcionario.num_documento
              });

            });

          } catch (error) {

            conexion.rollback(() => reject(error));

          }

        });

      });

    } catch (error) {

      reject(error);

    }

  });

}



// ============================
// ELIMINAR FUNCIONARIO
// ============================

function eliminar(num_documento) {

  return new Promise((resolve, reject) => {

    conexion.beginTransaction((err) => {

      if (err) return reject(err);

      const sqlBuscar = "SELECT id_usuario FROM funcionario WHERE num_documento = ?";

      conexion.query(sqlBuscar, [num_documento], (err, result) => {

        if (err) {
          return conexion.rollback(() => reject(err));
        }

        if (result.length === 0) {
          return conexion.rollback(() =>
            reject(new Error("Funcionario no encontrado"))
          );
        }

        const id_usuario = result[0].id_usuario;

        const sqlFuncionario = `
        UPDATE funcionario
        SET estado = 'inactivo'
        WHERE num_documento = ?
        `;

        conexion.query(sqlFuncionario, [num_documento], (err) => {

          if (err) {
            return conexion.rollback(() => reject(err));
          }

          const sqlUsuario = `
          UPDATE usuario
          SET estado = 'inactivo'
          WHERE id_usuario = ?
          `;

          conexion.query(sqlUsuario, [id_usuario], (err) => {

            if (err) {
              return conexion.rollback(() => reject(err));
            }

            conexion.commit((err) => {

              if (err) {
                return conexion.rollback(() => reject(err));
              }

              resolve({
                success: true,
                message: "Funcionario desactivado correctamente"
              });

            });

          });

        });

      });

    });

  });

}



// ============================
// EXPORTAR FUNCIONES
// ============================

module.exports = {

  todos,
  uno,
  agregar,
  eliminar,
  actualizar,
  cargo

};