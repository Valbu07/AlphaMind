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
  const [eliminando, setEliminando] = useState(null);

  const mensajesRef = useRef(null);
  const fileInputRef = useRef(null);

  const toggleMenu = () => setMenuAbierto(prev => !prev);
  const cerrarMenu = () => setMenuAbierto(false);

  const seleccionadoId = usuarioSeleccionado?.id_usuario || usuarioSeleccionado?.Id_Usuario;

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
    if (idUsuarioActual) cargarUsuarios();
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
        const filtrados = response.data.filter(
          user => (user.id_usuario || user.Id_Usuario) != idUsuarioActual
        );
        setUsuarios(filtrados);
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
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const manejarArchivo = (e) => {
    const file = e.target.files[0];
    if (file) setArchivo(file);
  };

  const eliminarMensaje = async (mensajeId) => {
    if (eliminando) return;
    if (!window.confirm('¿Eliminar este mensaje para todos?')) return;
    try {
      setEliminando(mensajeId);
      const response = await chatService.eliminarMensaje(mensajeId);
      if (response.success) {
        setMensajes(prev => prev.filter(m => m.id_Mensaje !== mensajeId));
      }
    } catch (error) {
      console.error('Error al eliminar mensaje:', error);
    } finally {
      setEliminando(null);
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
    cerrarMenu();
  };

  const obtenerNombreCompleto = (usuario) => {
    const primerNombre = usuario.primer_nombre || usuario.Primer_Nombre || '';
    const segundoNombre = usuario.segundo_nombre || usuario.Segundo_Nombre || '';
    const primerApellido = usuario.primer_apellido || usuario.Primer_Apellido || '';
    return `${primerNombre} ${segundoNombre} ${primerApellido}`.trim();
  };

  const descargarArchivo = async (urlCompleta, nombreArchivo) => {
    try {
      const response = await fetch(urlCompleta);
      if (!response.ok) throw new Error('Error al descargar');
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = nombreArchivo || 'archivo';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error al descargar archivo:', error);
      alert('No se pudo descargar el archivo');
    }
  };

  const usuariosFiltrados = usuarios.filter(usuario =>
    obtenerNombreCompleto(usuario).toLowerCase().includes(busqueda.toLowerCase())
  );

  if (!token) {
    return <div className="chat-wrapper">Debes iniciar sesión</div>;
  }

  return (
    <div className="chat-wrapper">

      {menuAbierto && (
        <div className="overlay-mobile activo" onClick={cerrarMenu}></div>
      )}

      {/* Panel de usuarios MÓVIL */}
      <div className={`panel-usuarios-mobile ${menuAbierto ? 'mostrar-mobile' : ''}`}>
        <div className="panel-mobile-header">
          <h6 className="titulo-panel">Chats</h6>
          <button className="btn-cerrar-mobile" onClick={cerrarMenu}>✕</button>
        </div>

        <input
          type="text"
          className="buscador"
          placeholder="Buscar..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />

        {loading && <div style={{ textAlign: 'center', padding: '20px', color: '#64748b' }}>Cargando usuarios...</div>}
        {error && <div style={{ textAlign: 'center', padding: '20px', color: '#ef4444' }}>{error}</div>}
        {!loading && usuariosFiltrados.length === 0 && (
          <div style={{ textAlign: 'center', padding: '20px', color: '#64748b' }}>No se encontraron usuarios</div>
        )}

        <div className="usuarios-list-mobile">
          {usuariosFiltrados.map((usuario) => {
            const userId = usuario.id_usuario || usuario.Id_Usuario;
            const seleccionadoId = usuarioSeleccionado?.id_usuario || usuarioSeleccionado?.Id_Usuario;
            return (
              <div
                key={userId}
                className={`usuario ${seleccionadoId === userId ? 'activo' : ''}`}
                onClick={() => seleccionarUsuario(usuario)}
              >
                <Avatar size={40} src={usuario.foto_perfil || usuario.Foto_Perfil || null} />
                <div>
                  <strong>{obtenerNombreCompleto(usuario)}</strong>
                  <small>{usuario.correo_electronico || usuario.Correo_Electronico}</small>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Contenido principal */}
      <div className="principal p-3">
        <div className="row">

          {/* PANEL IZQUIERDO - Lista de usuarios (escritorio) */}
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

              {loading && <div style={{ textAlign: 'center', padding: '20px', color: '#64748b' }}>Cargando usuarios...</div>}
              {error && <div style={{ textAlign: 'center', padding: '20px', color: '#ef4444' }}>{error}</div>}
              {!loading && usuariosFiltrados.length === 0 && (
                <div style={{ textAlign: 'center', padding: '20px', color: '#64748b' }}>No se encontraron usuarios</div>
              )}

              {usuariosFiltrados.map((usuario) => {
                const userId = usuario.id_usuario || usuario.Id_Usuario;
                return (
                  <div
                    key={userId}
                    className={`usuario ${seleccionadoId === userId ? 'activo' : ''}`}
                    onClick={() => seleccionarUsuario(usuario)}
                  >
                    <Avatar size={40} src={usuario.foto_perfil || usuario.Foto_Perfil || null} />
                    <div>
                      <strong>{obtenerNombreCompleto(usuario)}</strong>
                      <small>{usuario.correo_electronico || usuario.Correo_Electronico}</small>
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
                  {/* Header con usuario seleccionado */}
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
                    <Avatar size={45} src={usuarioSeleccionado?.foto_perfil || usuarioSeleccionado?.Foto_Perfil || null} />
                    <h5>{obtenerNombreCompleto(usuarioSeleccionado)}</h5>
                  </div>

                  {/* Área de mensajes */}
                  <div className="chat-mensaje" ref={mensajesRef}>
                    {mensajes.map((mensaje) => {
                      const esMensajePropio = parseInt(mensaje.remitente_id) === parseInt(idUsuarioActual);
                      const BASE_URL = 'http://localhost:3000';

                      return (
                        <div
                          key={mensaje.id_Mensaje}
                          className={`mensaje-wrapper ${esMensajePropio ? 'propio' : 'ajeno'}`}
                        >
                          {esMensajePropio && (
                            <button
                              className="btn-eliminar-mensaje"
                              onClick={() => eliminarMensaje(mensaje.id_Mensaje)}
                              title="Eliminar mensaje"
                              disabled={eliminando === mensaje.id_Mensaje}
                            >
                              <i className="bi bi-trash-fill"></i>
                            </button>
                          )}

                          <div className={esMensajePropio ? 'mensaje-enviado' : 'mensaje-recibido'}>
                            {mensaje.txt_mensaje && (
                              <p style={{ margin: 0 }}>{mensaje.txt_mensaje}</p>
                            )}

                            {mensaje.url_archivo && (() => {
                              const urlCompleta = `${BASE_URL}/${mensaje.url_archivo}`;
                              const tipo = mensaje.tipo_de_archivo || '';
                              const nombreArchivo = mensaje.url_archivo?.split('/').pop();

                              if (tipo.startsWith('image/')) {
                                return (
                                  <div>
                                    <img
                                      src={urlCompleta}
                                      alt="imagen"
                                      style={{ maxWidth: '200px', borderRadius: '8px', marginTop: '5px' }}
                                    />
                                    <br />
                                    <button
                                      onClick={() => descargarArchivo(urlCompleta, nombreArchivo)}
                                      style={{ fontSize: '11px', background: 'none', border: 'none', color: '#3b82f6', cursor: 'pointer', padding: 0, marginTop: '4px' }}
                                    >
                                      Descargar imagen
                                    </button>
                                  </div>
                                );
                              }

                              if (tipo === 'application/pdf') {
                                return (
                                  <button
                                    onClick={() => descargarArchivo(urlCompleta, nombreArchivo)}
                                    style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px', background: 'none', border: 'none', color: '#3b82f6', cursor: 'pointer', padding: 0 }}
                                  >
                                    <i className="bi bi-file-earmark-pdf-fill"></i> Descargar PDF
                                  </button>
                                );
                              }

                              return (
                                <button
                                  onClick={() => descargarArchivo(urlCompleta, nombreArchivo)}
                                  style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px', background: 'none', border: 'none', color: '#3b82f6', cursor: 'pointer', padding: 0 }}
                                >
                                  <i className="bi bi-file-earmark-fill"></i> Descargar archivo
                                </button>
                              );
                            })()}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Formulario de envío */}
                  <form className="chat-enviar" onSubmit={enviarMensaje}>
                    <button type="button" className="btn-archivo" onClick={abrirSelectorArchivo}>
                      📎
                    </button>

                    <input
                      type="file"
                      ref={fileInputRef}
                      style={{ display: "none" }}
                      onChange={manejarArchivo}
                    />

                    {archivo && (
                      <div className="archivo-preview">
                        <span>📎 {archivo.name}</span>
                        <button type="button" className="btn-eliminar-archivo" onClick={() => setArchivo(null)}>✕</button>
                      </div>
                    )}

                    <input
                      type="text"
                      placeholder="Mensaje..."
                      value={nuevoMensaje}
                      onChange={(e) => setNuevoMensaje(e.target.value)}
                    />

                    <button type="submit" className="btn-enviar">
                      <i className="bi bi-send"></i>
                    </button>
                  </form>
                </>
              ) : (
                /* Estado vacío - siempre muestra el botón ☰ en móvil */
                <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                  {isMobile && (
                    <div className="chat-header">
                      <button
                        type="button"
                        className="btn-toggle-funcionarios"
                        onClick={toggleMenu}
                        aria-label="Abrir menú de chats"
                      >
                        ☰
                      </button>
                    </div>
                  )}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#64748b' }}>
                    <p>Selecciona un usuario para comenzar a chatear</p>
                  </div>
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