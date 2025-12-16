const ChatModel = require('../models/chat.model');

const chatController = {
  // Obtener todos los usuarios
  obtenerUsuarios: (req, res) => {
    ChatModel.obtenerTodosLosUsuarios((err, results) => {
      if (err) {
        console.error('Error al obtener usuarios:', err);
        return res.status(500).json({ 
          success: false, 
          message: 'Error al obtener usuarios',
          error: err.message 
        });
      }
      res.json({ success: true, data: results });
    });
  },

  // Obtener mensajes entre dos usuarios
  obtenerMensajes: (req, res) => {
    const { usuario1, usuario2 } = req.params;
    
    console.log('=== BACKEND: Obteniendo mensajes ===');
    console.log('Usuario 1:', usuario1);
    console.log('Usuario 2:', usuario2);
    
    ChatModel.obtenerMensajesEntreUsuarios(usuario1, usuario2, (err, results) => {
      if (err) {
        console.error('Error al obtener mensajes:', err);
        return res.status(500).json({ 
          success: false, 
          message: 'Error al obtener mensajes',
          error: err.message 
        });
      }
      
      console.log('Mensajes encontrados:', results.length);
      res.json({ success: true, data: results });
    });
  },

  // Enviar un nuevo mensaje
  enviarMensaje: (req, res) => {
    const { remitente_id, destinatario_id, texto } = req.body;
    
    console.log('=== BACKEND: Enviando mensaje ===');
    console.log('De:', remitente_id);
    console.log('Para:', destinatario_id);
    console.log('Texto:', texto);
    
    // Validación
    if (!remitente_id || !destinatario_id || !texto) {
      return res.status(400).json({ 
        success: false, 
        message: 'Faltan datos requeridos' 
      });
    }
    
    // 1. Crear el mensaje
    ChatModel.crearMensaje(texto, (err, resultMensaje) => {
      if (err) {
        console.error('Error al insertar mensaje:', err);
        return res.status(500).json({ 
          success: false, 
          message: 'Error al crear mensaje',
          error: err.message 
        });
      }
      
      const mensajeId = resultMensaje.insertId;
      console.log('Mensaje creado con ID:', mensajeId);
      
      // 2. Crear AMBOS registros en chat (remitente Y destinatario)
      ChatModel.crearConversacion(mensajeId, remitente_id, destinatario_id, (err) => {
        if (err) {
          console.error('Error al crear conversación:', err);
          return res.status(500).json({ 
            success: false, 
            message: 'Error al crear registro de chat',
            error: err.message 
          });
        }
        
        console.log('✅ Conversación creada exitosamente');
        
        // 3. Retornar el mensaje creado
        res.status(201).json({
          success: true,
          message: 'Mensaje enviado correctamente',
          data: {
            id_Mensaje: mensajeId,
            txt_mensaje: texto,
            fecha_hora: new Date(),
            remitente_id: remitente_id
          }
        });
      });
    });
  },

  // Obtener último mensaje (opcional, para preview)
  obtenerUltimoMensaje: (req, res) => {
    const { usuario1, usuario2 } = req.params;
    
    ChatModel.obtenerUltimoMensaje(usuario1, usuario2, (err, results) => {
      if (err) {
        console.error('Error al obtener último mensaje:', err);
        return res.status(500).json({ 
          success: false, 
          message: 'Error al obtener último mensaje',
          error: err.message 
        });
      }
      
      res.json({ 
        success: true, 
        data: results.length > 0 ? results[0] : null 
      });
    });
  }
};

module.exports = chatController;