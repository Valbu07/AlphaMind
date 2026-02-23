const db = require('../models/recuperarContraseña');
const email = require('../utils/email');

/**
 * Genera una contraseña temporal aleatoria
 */
function generarContrasenatemporal() {
  const caracteres = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
  let contrasena = '';
  for (let i = 0; i < 8; i++) {
    contrasena += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
  }
  return contrasena;
}

async function recuperarContrasena(num_documento) {
  console.log('Controlador: Buscando funcionario con documento:', num_documento);
  
  try {

    const funcionario = await db.uno(num_documento);
    console.log(' Funcionario encontrado:', {
      nombre: funcionario.data.primer_nombre,
      correo: funcionario.data.correo_electronico,
      id_usuario: funcionario.data.id_usuario
    });
    

    const contrasenaTemporal = generarContrasenatemporal();

    

    await db.actualizarContrasena(funcionario.data.id_usuario, contrasenaTemporal);
    console.log(' Contraseña actualizada en BD');
    
    // 4. Enviar correo
    console.log(' Enviando correo...');
    await email.enviarContrasena(
      funcionario.data.correo_electronico,
      funcionario.data.primer_nombre,
      contrasenaTemporal
    );
    
    console.log('Correo enviado exitosamente');
    
    return {
      mensaje: "Se ha enviado una contraseña temporal a tu correo registrado. Por favor cámbiala después de iniciar sesión.",
      correo: funcionario.data.correo_electronico
    };
  } catch (error) {
    console.error(' Error en controlador:', error);
    throw error;
  }
}

module.exports = {
  recuperarContrasena
};