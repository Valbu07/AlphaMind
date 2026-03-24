const db = require('../config/db');

const ChatModel = {

  // =========================
  // OBTENER TODOS LOS USUARIOS
  // =========================
  obtenerTodosLosUsuarios: (callback) => {
    const query = `
      SELECT 
        u.id_usuario,
        f.num_documento,
        f.primer_nombre,
        f.segundo_nombre,
        f.primer_apellido,
        f.segundo_apellido,
        f.correo_electronico,
        f.numero_telefonico,
        u.foto_perfil
      FROM usuario u
      INNER JOIN funcionario f ON u.id_usuario = f.id_usuario
      WHERE f.estado = 'activo' AND u.estado = 'activo'
      ORDER BY f.primer_nombre, f.primer_apellido
    `;
    
    db.query(query, callback);
  },


  // =========================
  // OBTENER MENSAJES ENTRE DOS USUARIOS
  // =========================
  obtenerMensajesEntreUsuarios: (usuario1, usuario2, callback) => {

    const query = `
    SELECT 
      m.id_Mensaje,
      m.txt_mensaje,
      m.fecha_hora,

      (
        SELECT c_first.Usuario_id_Usuario
        FROM chat c_first
        WHERE c_first.mensaje_idMensaje = m.id_Mensaje
        ORDER BY c_first.id_Chat ASC
        LIMIT 1
      ) as remitente_id,

      a.url_archivo,
      a.tipo_de_archivo

    FROM mensaje m

    LEFT JOIN archivo_adjunto aa 
      ON m.id_Mensaje = aa.mensaje_idMensaje

    LEFT JOIN archivo a 
      ON aa.archivo_idArchivo = a.id_Archivo

    WHERE EXISTS (
      SELECT 1 FROM chat c1
      WHERE c1.mensaje_idMensaje = m.id_Mensaje
      AND c1.Usuario_id_Usuario = ?
      AND c1.tipo_de_Chat = 'Directo'
    )

    AND EXISTS (
      SELECT 1 FROM chat c2
      WHERE c2.mensaje_idMensaje = m.id_Mensaje
      AND c2.Usuario_id_Usuario = ?
      AND c2.tipo_de_Chat = 'Directo'
    )

    ORDER BY m.fecha_hora ASC
    `;

    db.query(query, [usuario1, usuario2], callback);
  },


  // =========================
  // CREAR MENSAJE
  // =========================
  crearMensaje: (texto, callback) => {
    const query = `
      INSERT INTO mensaje (txt_mensaje, fecha_hora) 
      VALUES (?, NOW())
    `;
    
    db.query(query, [texto], callback);
  },


  // =========================
  // CREAR REGISTRO EN CHAT
  // =========================
  crearRegistroChat: (mensajeId, usuarioId, callback) => {
    const query = `
      INSERT INTO chat (tipo_de_Chat, mensaje_idMensaje, Usuario_id_Usuario)
      VALUES ('Directo', ?, ?)
    `;
    
    db.query(query, [mensajeId, usuarioId], callback);
  },


  // =========================
  // CREAR CONVERSACIÓN
  // =========================
  crearConversacion: (mensajeId, remitenteId, destinatarioId, callback) => {

    const query1 = `
      INSERT INTO chat (tipo_de_Chat, mensaje_idMensaje, Usuario_id_Usuario)
      VALUES ('Directo', ?, ?)
    `;

    db.query(query1, [mensajeId, remitenteId], (err1) => {

      if (err1) return callback(err1);

      const query2 = `
        INSERT INTO chat (tipo_de_Chat, mensaje_idMensaje, Usuario_id_Usuario)
        VALUES ('Directo', ?, ?)
      `;

      db.query(query2, [mensajeId, destinatarioId], callback);

    });
  },


  // =========================
  // OBTENER ÚLTIMO MENSAJE
  // =========================
  obtenerUltimoMensaje: (usuario1, usuario2, callback) => {

    const query = `
      SELECT DISTINCT
        m.txt_mensaje,
        m.fecha_hora,
        c1.Usuario_id_Usuario as remitente_id
      FROM mensaje m
      INNER JOIN chat c1 
      ON m.id_Mensaje = c1.mensaje_idMensaje
      WHERE c1.tipo_de_Chat = 'Directo'
        AND (
          (c1.Usuario_id_Usuario = ? AND m.id_Mensaje IN (
            SELECT c2.mensaje_idMensaje 
            FROM chat c2 
            WHERE c2.Usuario_id_Usuario = ?
          ))
          OR
          (c1.Usuario_id_Usuario = ? AND m.id_Mensaje IN (
            SELECT c3.mensaje_idMensaje 
            FROM chat c3 
            WHERE c3.Usuario_id_Usuario = ?
          ))
        )
      ORDER BY m.fecha_hora DESC
      LIMIT 1
    `;
    
    db.query(query, [usuario1, usuario2, usuario2, usuario1], callback);
  },


  // =========================
  // GUARDAR ARCHIVO
  // =========================
  guardarArchivo: (url, tipo, callback) => {

    const query = `
      INSERT INTO archivo (url_archivo, tipo_de_archivo)
      VALUES (?, ?)
    `;

    db.query(query, [url, tipo], callback);
  },


  // =========================
  // RELACIONAR ARCHIVO CON MENSAJE
  // =========================
  adjuntarArchivoAMensaje: (mensajeId, archivoId, callback) => {

    const query = `
      INSERT INTO archivo_adjunto (mensaje_idMensaje, archivo_idArchivo)
      VALUES (?, ?)
    `;

    db.query(query, [mensajeId, archivoId], callback);
  },


  // =========================
  // VERIFICAR SI EXISTE CONVERSACIÓN
  // =========================
  existeConversacion: (usuario1, usuario2, callback) => {

    const query = `
      SELECT COUNT(DISTINCT m.id_Mensaje) as total
      FROM mensaje m
      INNER JOIN chat c1 
      ON m.id_Mensaje = c1.mensaje_idMensaje
      WHERE c1.tipo_de_Chat = 'Directo'
        AND (
          (c1.Usuario_id_Usuario = ? AND m.id_Mensaje IN (
            SELECT c2.mensaje_idMensaje 
            FROM chat c2
            WHERE c2.Usuario_id_Usuario = ?
          ))
          OR
          (c1.Usuario_id_Usuario = ? AND m.id_Mensaje IN (
            SELECT c3.mensaje_idMensaje 
            FROM chat c3 
            WHERE c3.Usuario_id_Usuario = ?
          ))
        )
    `;
    
    db.query(query, [usuario1, usuario2, usuario2, usuario1], callback);
  }

};

module.exports = ChatModel;