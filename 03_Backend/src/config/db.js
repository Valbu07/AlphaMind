// Todas las Funciones para consultar a la base de datos 
const mysql = require('mysql2');
const config = require('./config');

const dbconfig = {
    host: config.mysql.host,
    port: config.mysql.port,
    user: config.mysql.user,
    password: config.mysql.password,
    database: config.mysql.database,
};

let conexion;

function conexionmysql() {  
    conexion = mysql.createConnection(dbconfig);

    conexion.connect((err) => {
        if (err) {
            console.log(' Error al conectar a la base de datos: ' + err);
            setTimeout(conexionmysql, 2000); // reintento automático
        } else {
            console.log(' Conexión establecida con éxito');
        }
    });

    conexion.on('error', (err) => {
        console.log(' Error en la base de datos: ' + err);
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            conexionmysql();
        } else {
            throw err;
        }
    });
}

conexionmysql();

//  para usar async/await 
const queryPromise = (sql, params) => {
    return new Promise((resolve, reject) => {
        conexion.query(sql, params, (err, results) => {
            if (err) reject(err);
            else resolve(results);
        });
    });
};

// Exporta ambos: lo viejo sigue funcionando
module.exports = conexion;
module.exports.queryPromise = queryPromise;