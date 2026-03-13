const conexion = require('../config/db'); 

function login(num_documento) {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT 
        f.num_documento,
        u.contraseña,
        u.id_usuario,
        u.tipo_de_rol,
        u.foto_perfil
      FROM funcionario f 
      INNER JOIN usuario u ON f.id_usuario = u.id_usuario 
      WHERE f.num_documento = ?
    `;

    conexion.query(sql, [num_documento], (err, result) => {
      if (err) return reject(err);
      if (result.length === 0) return resolve(null);
      resolve(result[0]);
    });
  });
}

module.exports={
    login   
}