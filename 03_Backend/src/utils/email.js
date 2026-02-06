const nodemailer = require('nodemailer');
require('dotenv').config();

// Configurar el transportador de correo
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

/**
 * Envía la contraseña actual al correo del funcionario
 */
async function enviarContrasena(destinatario, primer_nombre, contraseña) {
  const mailOptions = {
    from: `"AlphaMind Soporte" <${process.env.EMAIL_USER}>`,
    to: destinatario,
    subject: 'Recuperación de Contraseña - AlphaMind',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { 
            font-family: Arial, sans-serif; 
            background-color: #f4f4f4; 
            padding: 20px; 
          }
          .container { 
            max-width: 600px; 
            margin: 0 auto; 
            background: white; 
            border-radius: 10px; 
            overflow: hidden; 
            box-shadow: 0 2px 10px rgba(0,0,0,0.1); 
          }
          .header { 
            background: linear-gradient(135deg, #374e9f, #5a7bc9); 
            color: white; 
            padding: 30px; 
            text-align: center; 
          }
          .header h1 { 
            margin: 0; 
            font-size: 24px; 
          }
          .content { 
            padding: 30px; 
            color: #333; 
          }
          .password-box { 
            background: #f9f9f9; 
            border-left: 4px solid #fc9222; 
            padding: 20px; 
            margin: 20px 0; 
            border-radius: 5px; 
          }
          .password { 
            font-size: 24px; 
            font-weight: bold; 
            color: #374e9f; 
            text-align: center; 
            letter-spacing: 2px; 
          }
          .footer { 
            background: #f9f9f9; 
            padding: 20px; 
            text-align: center; 
            color: #666; 
            font-size: 12px; 
          }
          .warning {
            background: #fff3cd;
            border: 1px solid #ffc107;
            padding: 15px;
            border-radius: 5px;
            margin: 20px 0;
            color: #856404;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1> Recuperación de Contraseña</h1>
          </div>
          
          <div class="content">
            <h2>Hola ${primer_nombre},</h2>
            <p>Has solicitado recuperar tu contraseña de AlphaMind.</p>
            <p>Tu contraseña actual es:</p>
            
            <div class="password-box">
              <div class="password">${contraseña}</div>
            </div>

            <div class="warning">
              <strong> Recomendación de Seguridad:</strong><br>
              Por tu seguridad, te recomendamos cambiar esta contraseña después de iniciar sesión.
            </div>

            <p>Si no solicitaste esta información, por favor ignora este correo.</p>
          </div>

          <div class="footer">
            <p><strong>AlphaMind</strong> - Sistema de Gestión</p>
            <p>&copy; 2024 Todos los derechos reservados</p>
            <p>Este es un correo automático, no respondas a este mensaje.</p>
          </div>
        </div>
      </body>
      </html>
    `
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(' Correo enviado:', info.messageId);
    return { success: true };
  } catch (error) {
    console.error(' Error al enviar correo:', error);
    throw new Error('No se pudo enviar el correo');
  }
}

module.exports = {
  enviarContrasena
};