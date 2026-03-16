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

  // Enviar archivo
enviarArchivo: (req, res) => {

  const { remitente_id, destinatario_id } = req.body;
  const archivo = req.file;
  console.log("Archivo recibido:", req.file);

  console.log('=== BACKEND: Enviando archivo ===');
  console.log('De:', remitente_id);
  console.log('Para:', destinatario_id);

  if (!archivo) {
    return res.status(400).json({
      success: false,
      message: "No se envió ningún archivo"
    });
  }

const url = `uploads/${archivo.filename}`;
  const tipo = archivo.mimetype;

  // 1️⃣ Crear mensaje vacío
  ChatModel.crearMensaje("", (err, resultMensaje) => {

    if (err) {
      console.error("Error creando mensaje:", err);
      return res.status(500).json({
        success: false,
        message: "Error al crear mensaje"
      });
    }

    const mensajeId = resultMensaje.insertId;

    // 2️⃣ Crear conversación
    ChatModel.crearConversacion(mensajeId, remitente_id, destinatario_id, (err2) => {

      if (err2) {
        console.error("Error creando conversación:", err2);
        return res.status(500).json({
          success: false,
          message: "Error al registrar chat"
        });
      }

      // 3️⃣ Guardar archivo
      ChatModel.guardarArchivo(url, tipo, (err3, resultArchivo) => {

        if (err3) {
          console.error("Error guardando archivo:", err3);
          return res.status(500).json({
            success: false,
            message: "Error al guardar archivo"
          });
        }

        const archivoId = resultArchivo.insertId;

        // 4️⃣ Relacionar archivo con mensaje
        ChatModel.adjuntarArchivoAMensaje(mensajeId, archivoId, (err4) => {

          if (err4) {
            console.error("Error adjuntando archivo:", err4);
            return res.status(500).json({
              success: false,
              message: "Error al adjuntar archivo"
            });
          }

          res.json({
            success: true,
            message: "Archivo enviado correctamente",
            data: {
              mensajeId,
              archivo: url,
              tipo
            }
          });

        });

      });

    });

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