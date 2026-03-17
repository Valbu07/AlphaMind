const db = require('../models/auth.model');
const auth = require('../utils/jwt');
const bcrypt = require('bcryptjs');

async function login(num_documento, contraseña) {
  try {
    const data = await db.login(num_documento);

    if (!data) throw new Error("El Funcionario no existe");

    const coincide = await bcrypt.compare(contraseña, data.contraseña);
    if (!coincide) throw new Error("Informacion incorrecta");

    const tokenAsignado = auth.asignarToken({
      id_usuario: data.id_usuario,
      num_documento: data.num_documento,
      rol: data.tipo_de_rol
    });

    return {
      token: "Bearer " + tokenAsignado,
      usuario: {
        id_usuario: data.id_usuario,
        num_documento: data.num_documento,
        tipo_de_rol: data.tipo_de_rol,
        foto_perfil: data.foto_perfil || null,
        primer_nombre: data.primer_nombre,
        primer_apellido: data.primer_apellido,
      }
    };
  } catch (error) {
    console.error("Error en login:", error.message);
    throw error;
  }
}

module.exports = { login };