const fs = require("fs");
const path = require("path");
const db = require("../models/fotoPerfil.model");

async function subirFoto(req) {
  if (!req.file) {
    throw new Error("No se recibió ninguna imagen");
  }

  const id_usuario = req.usuario.id_usuario; // 
  const rutaNueva = `/fotos_Perfil/${req.file.filename}`;

  const fotoAnterior = await db.obtenerFoto(id_usuario);

  if (fotoAnterior) {
    const rutaAbsoluta = path.join(__dirname, "../../", fotoAnterior);
    if (fs.existsSync(rutaAbsoluta)) fs.unlinkSync(rutaAbsoluta);
  }

  const resultado = await db.actualizarFoto(id_usuario, rutaNueva);
  return resultado;
}

async function eliminarFoto(req) {
  const id_usuario = req.usuario.id_usuario;
  return await db.eliminarFoto(id_usuario);
}

module.exports = { subirFoto, eliminarFoto };