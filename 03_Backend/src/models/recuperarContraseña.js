const conexion = require("../config/db");
const bcrypt = require('bcrypt');

/**
 * Busca funcionario por documento
 */
function uno(num_documento) {
  return new Promise((resolve, reject) => {

    
    if (!num_documento || num_documento.trim() === "") {
      console.log(' Documento inválido');
      return reject({ mensaje: "Número de documento inválido" });
    }

    const sql = `
      SELECT 
        f.primer_nombre,
        f.correo_electronico,
        f.id_usuario
      FROM funcionario f
      WHERE f.num_documento = ?
    `;
    
    conexion.query(sql, [num_documento], (err, result) => {
      if (err) {
        console.error("Error en consulta SQL:", err);
        return reject({ mensaje: "Error en la base de datos" });
      }

      console.log('Resultados encontrados:', result.length);

      if (result.length === 0) {
        console.log(' Funcionario no encontrado');
        return reject({ mensaje: "Funcionario no encontrado" });
      }

      console.log('Funcionario encontrado en BD');
      resolve({
        mensaje: "Funcionario encontrado",
        data: result[0]
      });
    });
  });
}

/**
 * Actualiza la contraseña del usuario
 */
function actualizarContrasena(id_usuario, nuevaContrasena) {
  return new Promise(async (resolve, reject) => {
    console.log(' Actualizando contraseña para usuario:', id_usuario);
    
    try {
      // Encriptar la nueva contraseña
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(nuevaContrasena, salt);
      
      const sql = `
        UPDATE usuario 
        SET contraseña = ? 
        WHERE id_usuario = ?
      `;
      
      conexion.query(sql, [hashedPassword, id_usuario], (err, result) => {
        if (err) {
          console.error("Error actualizando contraseña:", err);
          return reject({ mensaje: "Error al actualizar la contraseña" });
        }

        if (result.affectedRows === 0) {
          return reject({ mensaje: "No se pudo actualizar la contraseña" });
        }

        resolve({
          mensaje: "Contraseña actualizada",
          affectedRows: result.affectedRows
        });
      });
    } catch (error) {
      console.error("Error en encriptación:", error);
      reject({ mensaje: "Error al procesar la contraseña" });
    }
  });
}

module.exports = {
  uno,
  actualizarContrasena
};