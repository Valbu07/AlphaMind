const db = require('../../DB/sqlLogin'); 
const auth = require('../../autenticacion');
const bcrypt = require('bcryptjs');

async function login(num_documento, contraseña, id_usuario, tipo_de_rol) {
  try {
    const data = await db.login(num_documento);

    if (!data) {
      throw new Error("El Funcionario no existe"); //Verificamos por cedula si existe 
    }

    const coincide = await bcrypt.compare(contraseña, data.contraseña); //Verificamos la contraseña

    if (!coincide) {
      throw new Error("Informacion incorrecta");
    }

    const tokenAsignado = auth.asignarToken({ 
      id_usuario: data.id_usuario, //el cuerpo del token
      num_documento: data.num_documento,
      rol: data.tipo_de_rol
    }); 
    return { token: "Bearer " + tokenAsignado };    // Es un estándar para enviar tokens JWT en las peticiones HTTP.
  } catch (error) {
    console.error("Error en login:", error.message);
    throw error;
  }
}

module.exports = { login };