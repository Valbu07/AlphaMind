// Todas las Funciones para consultar a la base de datos 
const conexion = require("./mysql")




/*****************/// Consultas Usuario//**************** */


    function login(tableFuncionario, table) {

    return new Promise((resolve, reject) => {
        const sql = "select f.num_documento, u.contraseña from funcionario f inner join usuario u  on f.id_usuario = u.id_usuario";
        conexion.query(sql, [tableFuncionario, table], (err, results) => {
        if (err) {
            return reject(err);
        }
        resolve(results);
        });
    });
    
    }




module.exports= {
    login,
  

}