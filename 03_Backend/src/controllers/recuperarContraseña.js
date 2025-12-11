// controllers/recuperarContraseña.js
const db = require('../models/recuperarContraseña');
const email = require('../utils/email');

async function recuperarContrasena(num_documento) {
  console.log('🎮 Controlador: Buscando funcionario...');
  
  try {
    const funcionario = await db.uno(num_documento);
    console.log('👤 Funcionario encontrado:', funcionario.data);
    
    console.log('📧 Enviando correo...');
    await email.enviarContrasena(
      funcionario.data.correo_electronico,
      funcionario.data.primer_nombre,
      funcionario.data.contraseña
    );
    
    return {
      mensaje: "Se ha enviado tu contraseña al correo registrado",
      correo: funcionario.data.correo_electronico
    };
  } catch (error) {
    console.error('❌ Error en controlador:', error);
    throw error;
  }
}

module.exports = {
  recuperarContrasena
};