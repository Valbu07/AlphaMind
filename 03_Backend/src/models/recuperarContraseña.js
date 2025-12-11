const conexion = require("../config/db");

/**
 * Busca funcionario por documento y devuelve su información completa
 */
function uno(num_documento) {
  return new Promise((resolve, reject) => {
    if (!num_documento || num_documento.trim() === "") {
      return reject({ mensaje: "Número de documento inválido" });
    }

    // Seleccionamos nombre, correo Y contraseña
    const sql = `
   SELECT 
   f.primer_nombre,
    f.correo_electronico,
    c.contraseña
FROM funcionario f
INNER JOIN usuario c 
    ON f.id_usuario = c.id_usuario
WHERE f.num_documento = ?;

    `;
    
    conexion.query(sql, [num_documento], (err, result) => {
      if (err) {
        console.error("Error en consulta:", err);
        return reject({ mensaje: "Error en la base de datos" });
      }

      if (result.length === 0) {
        return reject({ mensaje: "Funcionario no encontrado" });
      }

      resolve({
        mensaje: "Funcionario encontrado",
        data: result[0]
      });
    });
  });
}

module.exports = {
  uno
};