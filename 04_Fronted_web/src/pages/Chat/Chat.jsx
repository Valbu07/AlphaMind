import React, { useState, useEffect, useRef } from 'react';
import './Chat.css';
import chatService from '../../services/chatService';
import { useAuth } from '../../hooks/useAuth';
import { decodeToken } from '../../utils/jwtUtilis';
import Avatar from "../../components/Avatar";

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

  // ✅ Función cerrarMenu que faltaba
  const cerrarMenu = () => setMenuAbierto(false);

  // ✅ Función toggleMenu que faltaba
  const toggleMenu = () => setMenuAbierto(prev => !prev);

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

  // ✅ Responsive: actualizar isMobile al redimensionar
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
    if (isMobile) cerrarMenu(); // ✅ cerrar menú al seleccionar en móvil
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

      {/* ✅ Overlay para cerrar menú en móvil */}
      {menuAbierto && (
        <div
          className="overlay-mobile activo"
          onClick={cerrarMenu}
        ></div>
      )}

      <div className="principal p-3">
        <div className="row">

          {/* PANEL IZQUIERDO - Lista de usuarios */}
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
                // ✅ Se usa foto_perfil del usuario, con fallback a null
                const fotoPerfil = usuario.foto_perfil || usuario.Foto_Perfil || null;

                return (
                  <div
                    key={userId}
                    className="usuario"
                    onClick={() => seleccionarUsuario(usuario)}
                  >
                    {/* ✅ Reemplazado <img src={foto}> (variable indefinida) por Avatar */}
                    <Avatar size={40} src={fotoPerfil} />
                    <div>
                      <strong>{obtenerNombreCompleto(usuario)}</strong>
                      <small>{usuario.correo_electronico}</small>
                    </div>
                  </div>
                );
              })}

            </div>
          </div>

          {/* PANEL DERECHO - Chat */}
          <div className="col-lg-9 col-md-8">
            <div className="panel-chat">

              {usuarioSeleccionado ? (
                <>
                  <div className="chat-header">
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
                    <Avatar
                      size={45}
                      src={usuarioSeleccionado?.foto_perfil || usuarioSeleccionado?.Foto_Perfil || null}
                    />
                    <h5>{obtenerNombreCompleto(usuarioSeleccionado)}</h5>
                  </div>

                  <div className="chat-mensaje" ref={mensajesRef}>
                    {mensajes.map((mensaje, index) => {
                      const esMensajePropio =
                        parseInt(mensaje.remitente_id) === parseInt(idUsuarioActual);
                      const BASE_URL = 'http://localhost:3000';

                      return (
                        <div
                          key={index}
                          className={esMensajePropio ? 'mensaje-enviado' : 'mensaje-recibido'}
                        >
                          {mensaje.txt_mensaje && (
                            <p style={{ margin: 0 }}>{mensaje.txt_mensaje}</p>
                          )}

                          {mensaje.url_archivo && (() => {
                            const urlCompleta = `${BASE_URL}/${mensaje.url_archivo}`;
                            const tipo = mensaje.tipo_de_archivo || '';

                            if (tipo.startsWith('image/')) {
                              return (
                                <div>
                                  <img
                                    src={urlCompleta}
                                    alt="imagen"
                                    style={{ maxWidth: '200px', borderRadius: '8px', marginTop: '5px' }}
                                  />
                                  <br />
                                  <a href={urlCompleta} download target="_blank" rel="noreferrer"
                                    style={{ fontSize: '11px' }}>
                                    Descargar imagen
                                  </a>
                                </div>
                              );
                            }

                            if (tipo === 'application/pdf') {
                              return (
                                <a href={urlCompleta} download target="_blank" rel="noreferrer"
                                  style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
                                  Descargar PDF
                                </a>
                              );
                            }

                            return (
                              <a href={urlCompleta} download target="_blank" rel="noreferrer"
                                style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
                                Descargar archivo
                              </a>
                            );
                          })()}
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