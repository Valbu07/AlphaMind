import React, { useState, useEffect, useRef } from 'react';
import './Chat.css';
import foto from '../../assets/Recursos/Foto.jpg';
import chatService from '../../services/chatService';
import { useAuth } from '../../hooks/useAuth';
import { decodeToken } from '../../utils/jwtUtilis';

const Chat = () => {
  const { token } = useAuth();
  
  const [usuarios, setUsuarios] = useState([]);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);
  const [mensajes, setMensajes] = useState([]);
  const [nuevoMensaje, setNuevoMensaje] = useState('');
  const [busqueda, setBusqueda] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [idUsuarioActual, setIdUsuarioActual] = useState(null);
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const [archivo, setArchivo] = useState(null);

  const mensajesRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (token) {
      const decoded = decodeToken(token);
      const idUsuario = decoded?.id_usuario || decoded?.Id_Usuario || decoded?.id || decoded?.ID;

      if (idUsuario) {
        setIdUsuarioActual(idUsuario);
      }
    }
  }, [token]);

  useEffect(() => {
    if (idUsuarioActual) {
      cargarUsuarios();
    }
  }, [idUsuarioActual]);

  useEffect(() => {
    if (usuarioSeleccionado && idUsuarioActual) {
      cargarMensajes();
      const interval = setInterval(cargarMensajes, 3000);
      return () => clearInterval(interval);
    }
  }, [usuarioSeleccionado, idUsuarioActual]);

  useEffect(() => {
    if (mensajesRef.current) {
      mensajesRef.current.scrollTop = mensajesRef.current.scrollHeight;
    }
  }, [mensajes]);

  const cargarUsuarios = async () => {
    try {
      setLoading(true);
      const response = await chatService.obtenerTodosLosUsuarios();

      if (response.success) {
        const usuariosFiltrados = response.data.filter(
          user => (user.id_usuario || user.Id_Usuario) != idUsuarioActual
        );

        setUsuarios(usuariosFiltrados);
      }

    } catch (error) {
      setError('No se pudieron cargar los usuarios');
    } finally {
      setLoading(false);
    }
  };

  const cargarMensajes = async () => {
    if (!usuarioSeleccionado || !idUsuarioActual) return;

    try {
      const response = await chatService.obtenerMensajes(
        idUsuarioActual,
        usuarioSeleccionado.id_usuario || usuarioSeleccionado.Id_Usuario
      );

      if (response.success && Array.isArray(response.data)) {
        setMensajes(response.data);
      } else {
        setMensajes([]);
      }

    } catch (error) {
      setMensajes([]);
    }
  };

  const abrirSelectorArchivo = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const manejarArchivo = (e) => {
    const file = e.target.files[0];
    if (file) {
      console.log("Archivo seleccionado:", file);
      setArchivo(file);
    }
  };

  const enviarMensaje = async (e) => {
    e.preventDefault();

    if ((!nuevoMensaje.trim() && !archivo) || !usuarioSeleccionado || !idUsuarioActual) return;

    try {
      const destinatarioId = usuarioSeleccionado.id_usuario || usuarioSeleccionado.Id_Usuario;

      const response = await chatService.enviarMensaje(
        idUsuarioActual,
        destinatarioId,
        nuevoMensaje,
        archivo
      );

      if (response.success) {
        setNuevoMensaje('');
        setArchivo(null);
        cargarMensajes();
      }

    } catch (error) {
      console.error(error);
    }
  };

  const seleccionarUsuario = (usuario) => {
    setUsuarioSeleccionado(usuario);
    setMensajes([]);
  };

  const obtenerNombreCompleto = (usuario) => {
    const primerNombre = usuario.primer_nombre || usuario.Primer_Nombre || '';
    const segundoNombre = usuario.segundo_nombre || usuario.Segundo_Nombre || '';
    const primerApellido = usuario.primer_apellido || usuario.Primer_Apellido || '';

    return `${primerNombre} ${segundoNombre} ${primerApellido}`.trim();
  };

  const usuariosFiltrados = usuarios.filter(usuario => {
    const nombre = obtenerNombreCompleto(usuario).toLowerCase();
    return nombre.includes(busqueda.toLowerCase());
  });

  if (!token) {
    return (
      <div className="chat-wrapper">
        Debes iniciar sesión
      </div>
    );
  }

  return (
    <div className="chat-wrapper">
      {/* Overlay para cerrar menú en móvil */}
      {menuAbierto && (
        <div 
          className="overlay-mobile activo"
          onClick={cerrarMenu}
        ></div>
      )}

      <div className="principal">
        <div className="row">

          <div className="col-lg-3 col-md-4">
            <div className="panel-usuarios">

              <h6 className="titulo-panel">Chats</h6>

              <input
                type="text"
                className="buscador"
                placeholder="Buscar..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
              />

              {usuariosFiltrados.map((usuario) => {

                const userId = usuario.id_usuario || usuario.Id_Usuario;

                return (
                  <div
                    key={userId}
                    className="usuario"
                    onClick={() => seleccionarUsuario(usuario)}
                  >
                    <img src={foto} alt="Foto" />
                    <div>
                      <strong>{obtenerNombreCompleto(usuario)}</strong>
                      <small>{usuario.correo_electronico}</small>
                    </div>
                  </div>
                );
              })}

            </div>
          </div>

          {/* PANEL DERECHO */}
          <div className="col-lg-9 col-md-8 col-12">
            <div className="panel-chat">
              {usuarioSeleccionado ? (

                <>
                  <div className="chat-header">
                    {/* Botón hamburguesa - visible solo en móvil */}
                    {isMobile && (
                      <button 
                        type="button"
                        className="btn-toggle-funcionarios" 
                        onClick={toggleMenu}
                        aria-label="Abrir menú de chats"
                      >
                        ☰
                      </button>
                    )}
                    
                    <img src={foto} alt="Foto" />
                    <h5>{obtenerNombreCompleto(usuarioSeleccionado)}</h5>
                  </div>

                  <div className="chat-mensaje" ref={mensajesRef}>

                    {mensajes.map((mensaje, index) => {

                      const esMensajePropio =
                        parseInt(mensaje.remitente_id) === parseInt(idUsuarioActual);

                      return (
                        <div
                          key={index}
                          className={esMensajePropio ? 'mensaje-enviado' : 'mensaje-recibido'}
                        >
                          {mensaje.txt_mensaje}
                        </div>
                      );
                    })}

                  </div>

                  <form className="chat-enviar" onSubmit={enviarMensaje}>

                    <button
                      type="button"
                      className="btn-archivo"
                      onClick={abrirSelectorArchivo}
                    >
                      📎
                    </button>

                    <input
                      type="file"
                      ref={fileInputRef}
                      style={{ display: "none" }}
                      onChange={manejarArchivo}
                    />

                    <input
                      type="text"
                      placeholder="Mensaje..."
                      value={nuevoMensaje}
                      onChange={(e) => setNuevoMensaje(e.target.value)}
                    />

                    <button type="submit" className="btn-enviar">
                      ➤
                    </button>

                  </form>

                  {archivo && (
                    <div style={{ padding: "6px 15px", fontSize: "12px" }}>
                      📎 {archivo.name}
                    </div>
                  )}

                </>

              ) : (
                <div className="chat-empty">
                  Selecciona un usuario
                </div>
              )}

            </div>

          </div>

        </div>
      </div>
    </div>
  );
};

export default Chat;