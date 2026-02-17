const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

async function enviarContrasena(correoDestino, nombre, contrasenaTemporal) {

  
  try {
    const mailOptions = {
      from: `"AlphaMind - Sistema de Gestión" <${process.env.EMAIL_USER}>`,
      to: correoDestino,
      subject: '🔑 Recuperación de Contraseña - AlphaMind',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #374e9f 0%, #5a7bc7 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .password-box { background: white; border: 2px solid #fc9222; border-radius: 8px; padding: 20px; margin: 20px 0; text-align: center; }
            .password { font-size: 28px; color: #374e9f; font-weight: bold; letter-spacing: 3px; }
            .warning { background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; }
            .footer { text-align: center; color: #666; font-size: 12px; margin-top: 20px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🔐 Recuperación de Contraseña</h1>
            </div>
            <div class="content">
              <h2>Hola ${nombre},</h2>
              <p>Has solicitado recuperar tu contraseña en el sistema AlphaMind.</p>
              
              <div class="password-box">
                <p style="margin: 0; color: #666;">Tu contraseña temporal es:</p>
                <p class="password">${contrasenaTemporal}</p>
              </div>
              
              <div class="warning">
                <strong>⚠️ Importante:</strong>
                <ul style="margin: 10px 0; padding-left: 20px;">
                  <li>Esta es una contraseña temporal</li>
                  <li>Úsala para iniciar sesión</li>
                  <li><strong>Cámbiala inmediatamente</strong> después de ingresar</li>
                  <li>No compartas esta contraseña con nadie</li>
                </ul>
              </div>
              
              <p>Si no solicitaste este cambio, contacta inmediatamente al administrador del sistema.</p>
              
              <div style="text-align: center; margin-top: 30px;">
                <a href="http://localhost:5173" style="background: #fc9222; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
                  Ir a Iniciar Sesión
                </a>
              </div>
            </div>
            <div class="footer">
              <p>Este es un correo automático, por favor no responder.</p>
              <p>© 2025 AlphaMind - Sistema de Gestión de Tareas</p>
            </div>
          </div>
        </body>
        </html>
      `
    };


    const info = await transporter.sendMail(mailOptions);
    

    
    return {
      success: true,
      messageId: info.messageId
    };
    
  } catch (error) {
    console.error('❌ Error detallado al enviar correo:', error);
    throw new Error('No se pudo enviar el correo: ' + error.message);
  }
}

module.exports = {
  enviarContrasena
};