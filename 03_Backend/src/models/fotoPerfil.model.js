const conexion = require("../config/db");
const path = require("path");
const fs = require("fs");

function obtenerFoto(id_usuario) {
  return new Promise((resolve, reject) => {
  const sql = "SELECT foto_perfil FROM usuario INNER JOIN funcionario ON funcionario.id_usuario = usuario.id_usuario WHERE usuario.id_usuario = ?";

    conexion.query(sql, [id_usuario], (err, result) => {
      if (err) return reject(err);
      if (result.length === 0) return resolve(null);
      resolve(result[0].foto_perfil);
    });
  });
}

function actualizarFoto(id_usuario, rutaFoto) {
  return new Promise((resolve, reject) => {
    const sql = "UPDATE usuario SET foto_perfil = ? WHERE id_usuario = ?";
    conexion.query(sql, [rutaFoto, id_usuario], (err) => {
      if (err) return reject(err);
      resolve({ success: true, foto_perfil: rutaFoto });
    });
  });
}

function eliminarFoto(id_usuario) {
  return new Promise((resolve, reject) => {
    const sqlBuscar = "SELECT foto_perfil FROM usuario WHERE id_usuario = ?"; // ✅ corregido
    conexion.query(sqlBuscar, [id_usuario], (err, result) => {
      if (err) return reject(err);

      const fotoActual = result[0]?.foto_perfil;

      if (fotoActual) {
        const rutaAbsoluta = path.join(__dirname, "../../", fotoActual);
        if (fs.existsSync(rutaAbsoluta)) fs.unlinkSync(rutaAbsoluta);
      }

      const sqlUpdate = "UPDATE usuario SET foto_perfil = NULL WHERE id_usuario = ?";
      conexion.query(sqlUpdate, [id_usuario], (err) => {
        if (err) return reject(err);
        resolve({ success: true, message: "Foto eliminada correctamente" });
      });
    });
  });
}

module.exports = { obtenerFoto, actualizarFoto, eliminarFoto };