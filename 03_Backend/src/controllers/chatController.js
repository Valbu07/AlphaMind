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
    ChatModel.obtenerMensajesEntreUsuarios(usuario1, usuario2, (err, results) => {
      if (err) {
        console.error('Error al obtener mensajes:', err);
        return res.status(500).json({
          success: false,
          message: 'Error al obtener mensajes',
          error: err.message
        });
      }
      res.json({ success: true, data: results });
    });
  },

  // Enviar archivo
  enviarArchivo: (req, res) => {
    const { remitente_id, destinatario_id } = req.body;
    const archivo = req.file;

    if (!archivo) {
      return res.status(400).json({ success: false, message: "No se envió ningún archivo" });
    }

    const url = `uploads/${archivo.filename}`;
    const tipo = archivo.mimetype;

    ChatModel.crearMensaje("", (err, resultMensaje) => {
      if (err) return res.status(500).json({ success: false, message: "Error al crear mensaje" });

      const mensajeId = resultMensaje.insertId;

      ChatModel.crearConversacion(mensajeId, remitente_id, destinatario_id, (err2) => {
        if (err2) return res.status(500).json({ success: false, message: "Error al registrar chat" });

        ChatModel.guardarArchivo(url, tipo, (err3, resultArchivo) => {
          if (err3) return res.status(500).json({ success: false, message: "Error al guardar archivo" });

          const archivoId = resultArchivo.insertId;

          ChatModel.adjuntarArchivoAMensaje(mensajeId, archivoId, (err4) => {
            if (err4) return res.status(500).json({ success: false, message: "Error al adjuntar archivo" });

            res.json({ success: true, message: "Archivo enviado correctamente", data: { mensajeId, archivo: url, tipo } });
          });
        });
      });
    });
  },

  // Enviar mensaje
  enviarMensaje: (req, res) => {
    const { remitente_id, destinatario_id, texto } = req.body;

    if (!remitente_id || !destinatario_id || !texto) {
      return res.status(400).json({ success: false, message: 'Faltan datos requeridos' });
    }

    ChatModel.crearMensaje(texto, (err, resultMensaje) => {
      if (err) return res.status(500).json({ success: false, message: 'Error al crear mensaje', error: err.message });

      const mensajeId = resultMensaje.insertId;

      ChatModel.crearConversacion(mensajeId, remitente_id, destinatario_id, (err) => {
        if (err) return res.status(500).json({ success: false, message: 'Error al crear registro de chat', error: err.message });

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

  // Obtener último mensaje
  obtenerUltimoMensaje: (req, res) => {
    const { usuario1, usuario2 } = req.params;

    ChatModel.obtenerUltimoMensaje(usuario1, usuario2, (err, results) => {
      if (err) return res.status(500).json({ success: false, message: 'Error al obtener último mensaje', error: err.message });

      res.json({ success: true, data: results.length > 0 ? results[0] : null });
    });
  },

  // Eliminar mensaje 
  eliminarMensaje: (req, res) => {
    const { id } = req.params;
    const usuarioActual = req.usuario.id_usuario || req.usuario.Id_Usuario || req.usuario.id;

    console.log('=== ELIMINAR ===');
    console.log('Token completo:', req.usuario);
    console.log('usuarioActual extraído:', usuarioActual);



    if (!id) {
      return res.status(400).json({ success: false, message: 'Falta el ID del mensaje' });
    }

    ChatModel.obtenerRemitenteMensaje(id, (err, results) => {
      if (err || results.length === 0) {
        return res.status(404).json({ success: false, message: 'Mensaje no encontrado' });
      }

      const remitenteReal = results[0].Usuario_id_Usuario;

      if (parseInt(remitenteReal) !== parseInt(usuarioActual)) {
        return res.status(403).json({
          success: false,
          message: 'No puedes eliminar mensajes de otros usuarios'
        });
      }

      ChatModel.eliminarMensaje(id, (err2) => {
        if (err2) return res.status(500).json({ success: false, message: 'Error al eliminar mensaje' });

        res.json({ success: true, message: 'Mensaje eliminado correctamente' });
      });
    });
  }  

}; 
module.exports = chatController;