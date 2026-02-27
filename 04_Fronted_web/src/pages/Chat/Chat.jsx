import React, { useState, useEffect, useRef } from 'react';
import './Chat.css';
import foto from '../../assets/Recursos/Foto.jpg';
import chatService from '../../services/chatService';
import { useAuth } from '../../hooks/useAuth';
import { decodeToken } from '../../utils/jwtUtilis';

const Chat = () => {
  const { token } = useAuth();
  
  // Estados
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
  
  const mensajesRef = useRef(null);

  // Obtener ID del usuario actual desde el token
  useEffect(() => {
    if (token) {
      const decoded = decodeToken(token);
      const idUsuario = decoded?.id_usuario || decoded?.Id_Usuario || decoded?.id || decoded?.ID;
      
      console.log("=== CHAT: DEBUG ===");
      console.log(" Token decodificado:", decoded);
      console.log(" ID Usuario extraído:", idUsuario);
      
      if (idUsuario) {
        setIdUsuarioActual(idUsuario);
      } else {
        setError("No se pudo obtener el ID del usuario");
      }
    }
  }, [token]);

  // Cargar usuarios cuando tengamos el ID
  useEffect(() => {
    if (idUsuarioActual) {
      cargarUsuarios();
    }
  }, [idUsuarioActual]);

  // Cargar mensajes cuando se selecciona un usuario
  useEffect(() => {
    if (usuarioSeleccionado && idUsuarioActual) {
      cargarMensajes();
      const interval = setInterval(cargarMensajes, 3000);
      return () => clearInterval(interval);
    }
  }, [usuarioSeleccionado, idUsuarioActual]);

  // Scroll automático al final de los mensajes
  useEffect(() => {
    if (mensajesRef.current) {
      mensajesRef.current.scrollTop = mensajesRef.current.scrollHeight;
    }
  }, [mensajes]);

  // Cerrar menú con tecla ESC
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape' && menuAbierto) {
        cerrarMenu();
      }
    };
    
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setMenuAbierto(false);
      }
    };
    
    window.addEventListener('keydown', handleEsc);
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('keydown', handleEsc);
      window.removeEventListener('resize', handleResize);
    };
  }, [menuAbierto]);

  // Prevenir scroll del body cuando menú está abierto
  useEffect(() => {
    if (menuAbierto) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuAbierto]);

  // Funciones
  const cargarUsuarios = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await chatService.obtenerTodosLosUsuarios();
      
      console.log(" Respuesta usuarios:", response);
      
      if (response.success) {
        const usuariosFiltrados = response.data.filter(
          user => {
            const userId = user.id_usuario || user.Id_Usuario;
            return userId != idUsuarioActual;
          }
        );
        
        console.log(" Usuarios cargados (sin usuario actual):", usuariosFiltrados.length);
        setUsuarios(usuariosFiltrados);
      }
    } catch (error) {
      console.error(' Error al cargar usuarios:', error);
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
      
      console.log(" Respuesta mensajes:", response);
      console.log(" Entre usuarios:", idUsuarioActual, "y", usuarioSeleccionado.id_usuario);
      
      if (response.success && Array.isArray(response.data)) {
        const mensajesFiltrados = response.data.filter(mensaje => {
          const remitenteId = parseInt(mensaje.remitente_id);
          const usuarioSelId = parseInt(usuarioSeleccionado.id_usuario || usuarioSeleccionado.Id_Usuario);
          const usuarioActId = parseInt(idUsuarioActual);
          
          const esDelRemitente = remitenteId === usuarioActId;
          const esDelDestinatario = remitenteId === usuarioSelId;
          
          return esDelRemitente || esDelDestinatario;
        });
        
        console.log(" Mensajes filtrados:", mensajesFiltrados.length);
        setMensajes(mensajesFiltrados);
      } else {
        setMensajes([]);
      }
    } catch (error) {
      console.error(' Error al cargar mensajes:', error);
      setMensajes([]);
    }
  };

  const enviarMensaje = async (e) => {
    e.preventDefault();
    
    if (!nuevoMensaje.trim() || !usuarioSeleccionado || !idUsuarioActual) return;
    
    try {
      const destinatarioId = usuarioSeleccionado.id_usuario || usuarioSeleccionado.Id_Usuario;
      
      console.log(" Enviando mensaje:");
      console.log("  De:", idUsuarioActual);
      console.log("  Para:", destinatarioId);
      console.log("  Texto:", nuevoMensaje);
      
      const response = await chatService.enviarMensaje(
        idUsuarioActual,
        destinatarioId,
        nuevoMensaje
      );
      
      console.log(" Respuesta envío:", response);
      
      if (response.success) {
        setNuevoMensaje('');
        setTimeout(() => {
          cargarMensajes();
        }, 100);
      }
    } catch (error) {
      console.error(' Error al enviar mensaje:', error);
      alert('Error al enviar el mensaje. Por favor, intenta de nuevo.');
    }
  };

  const seleccionarUsuario = (usuario) => {
    console.log(" Usuario seleccionado:", usuario);
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

  const toggleMenu = () => {
    setMenuAbierto(!menuAbierto);
  };

  const cerrarMenu = () => {
    setMenuAbierto(false);
  };

  // Filtrar usuarios según búsqueda
  const usuariosFiltrados = usuarios.filter(usuario => {
    const nombreCompleto = obtenerNombreCompleto(usuario).toLowerCase();
    return nombreCompleto.includes(busqueda.toLowerCase());
  });

  // Si no hay token
  if (!token) {
    return (
      <div className="chat-wrapper">
        <div style={{ textAlign: 'center', padding: '50px', color: '#64748b' }}>
          Debes iniciar sesión para usar el chat
        </div>
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

      <div className="principal p-3">
        <div className="row">
          {/* PANEL IZQUIERDO - SOLO DESKTOP/TABLET */}
          <div className="col-lg-3 col-md-4 d-none d-md-block">
            <div className="panel-usuarios">
              <h6 className="titulo-panel">Chats</h6>
              <input 
                type="text" 
                className="buscador" 
                placeholder="Buscar..." 
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
              />
              
              {loading && (
                <div style={{ textAlign: 'center', padding: '20px', color: '#64748b' }}>
                  Cargando usuarios...
                </div>
              )}
              
              {error && (
                <div style={{ textAlign: 'center', padding: '20px', color: '#ef4444' }}>
                  {error}
                </div>
              )}
              
              {!loading && usuariosFiltrados.length === 0 && (
                <div style={{ textAlign: 'center', padding: '20px', color: '#64748b' }}>
                  No se encontraron usuarios
                </div>
              )}
              
              {usuariosFiltrados.map((usuario) => {
                const userId = usuario.id_usuario || usuario.Id_Usuario;
                const seleccionadoId = usuarioSeleccionado?.id_usuario || usuarioSeleccionado?.Id_Usuario;
                
                return (
                  <div 
                    key={userId}
                    className={`usuario ${seleccionadoId === userId ? 'activo' : ''}`}
                    onClick={() => seleccionarUsuario(usuario)}
                  >
                    <img src={foto} alt="Foto" />
                    <div>
                      <strong>{obtenerNombreCompleto(usuario)}</strong>
                      <small>{usuario.correo_electronico || usuario.Correo_Electronico}</small>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* PANEL DERECHO */}
          <div className="col-lg-9 col-md-8">
            <div className="panel-chat ">
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
                    {mensajes.length === 0 ? (
                      <div style={{ textAlign: 'center', color: '#64748b', marginTop: '20px' }}>
                        No hay mensajes aún. ¡Inicia la conversación!
                      </div>
                    ) : (
                      mensajes.map((mensaje, index) => {
                        const esMensajePropio = parseInt(mensaje.remitente_id) === parseInt(idUsuarioActual);
                        
                        return (
                          <div 
                            key={`${mensaje.id_Mensaje}-${index}`}
                            className={esMensajePropio ? 'mensaje-enviado' : 'mensaje-recibido'}
                          >
                            {mensaje.txt_mensaje}
                            <div style={{ 
                              fontSize: '10px', 
                              marginTop: '4px', 
                              opacity: 0.7 
                            }}>
                              {new Date(mensaje.fecha_hora).toLocaleTimeString('es-CO', { 
                                hour: '2-digit', 
                                minute: '2-digit' 
                              })}
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>

                  <form className="chat-enviar" onSubmit={enviarMensaje}>
                    <button type="button" className="btn-archivo">
                      <i className="bi bi-paperclip"></i>
                    </button>
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
                isMobile && (
                  <div className="chat-empty">
                    <button 
                      className="btn btn-primary"
                      onClick={toggleMenu}
                      style={{
                        background: '#2563eb',
                        border: 'none',
                        padding: '12px 24px',
                        borderRadius: '8px',
                        fontSize: '16px',
                        color: 'white',
                        cursor: 'pointer'
                      }}
                    >
                      Ver lista de chats
                    </button>
                    <span>Selecciona un usuario para comenzar a chatear</span>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </div>

      {/* PANEL DE USUARIOS PARA MÓVIL (FUNCIONAL) */}
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
        
        {loading && (
          <div style={{ textAlign: 'center', padding: '20px', color: '#64748b' }}>
            Cargando usuarios...
          </div>
        )}
        
        {error && (
          <div style={{ textAlign: 'center', padding: '20px', color: '#ef4444' }}>
            {error}
          </div>
        )}
        
        {!loading && usuariosFiltrados.length === 0 && (
          <div style={{ textAlign: 'center', padding: '20px', color: '#64748b' }}>
            No se encontraron usuarios
          </div>
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
                <img src={foto} alt="Foto" />
                <div>
                  <strong>{obtenerNombreCompleto(usuario)}</strong>
                  <small>{usuario.correo_electronico || usuario.Correo_Electronico}</small>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Chat;