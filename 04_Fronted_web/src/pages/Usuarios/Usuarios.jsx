import { useState, useEffect } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { useAuth } from "../../hooks/useAuth";
import { funcionariosService } from "../../services/FuncionariosService";
import "./usuarios.css";
import Foto from "../../assets/Recursos/Foto.jpg";


const Usuarios = () => {
  const { token } = useAuth();
  
  // Estados
  const [showPassword, setShowPassword] = useState(false);
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [seccionActiva, setSeccionActiva] = useState("crear");

  const [formData, setFormData] = useState({
    tipo_documento: "",
    num_documento: "",
    primer_nombre: "",
    segundo_nombre: "",
    primer_apellido: "",
    segundo_apellido: "",
    correo_electronico: "",
    numero_telefonico: "",
    tipo_de_rol: "",
    contraseña: ""
  });

  
  const [modoEdicion, setModoEdicion] = useState(false); // Indica si se está en modo edición
  const [usuarioEditando, setUsuarioEditando] = useState(null); //Almacena la cedula

  // Cargar usuarios automáticamente cuando cambia de sección
  useEffect(() => {
    if (seccionActiva === "consultar" || seccionActiva === "eliminar" || seccionActiva === "editar") {
      cargarUsuarios();
    }
  }, [seccionActiva]);

  // Función para cambiar de sección
  const mostrarSeccion = (seccion) => {
    setSeccionActiva(seccion);
    setMensaje("");
    // Limpiar 
    setModoEdicion(false);
    setUsuarioEditando(null);
  };

  // Cargar usuarios
  const cargarUsuarios = async () => {
    setLoading(true);
    setMensaje("");
    
    try {
      if (!token) {
        setMensaje(" Error: No hay sesión activa. Por favor inicia sesión.");
        setLoading(false);
        return;
      }

      const data = await funcionariosService.getAll(token);
      console.log("Usuarios cargados:", data);
      
      setUsuarios(data.body || data);
      
    } catch (error) {
      console.error("Error al cargar usuarios:", error);
      
      if (error.response?.status === 401) {
        setMensaje(" Error: Sesión expirada. Por favor inicia sesión nuevamente.");
      } else if (error.response?.status === 403) {
        setMensaje(" Error: No tienes permisos para ver esta información.");
      } else {
        setMensaje("Error de conexión con el servidor.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Manejar cambios en formulario
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Manejar click en editar usuario
  const handleEditarClick = (usuario) => {
    setFormData({
      tipo_documento: "",
      num_documento: usuario.Num_Documento || usuario.num_documento,
      primer_nombre: usuario.Primer_Nombre || usuario.primer_nombre,
      segundo_nombre: usuario.Segundo_Nombre || usuario.segundo_nombre || "",
      primer_apellido: usuario.Primer_Apellido || usuario.primer_apellido,
      segundo_apellido: usuario.Segundo_Apellido || usuario.segundo_apellido || "",
      correo_electronico: usuario.Correo_Electronico || usuario.correo_electronico,
      numero_telefonico: usuario.Numero_telefonico || usuario.numero_telefonico,
      tipo_de_rol: usuario.Tipo_de_Rol || usuario.tipo_de_rol || "",
      contraseña: ""
    });
    
    setUsuarioEditando(usuario.Num_Documento || usuario.num_documento);
    setModoEdicion(true);
    setSeccionActiva("crear");
    setMensaje("");
  };

  // Cancelar edición 
  const handleCancelarEdicion = () => {
    setModoEdicion(false);
    setUsuarioEditando(null);
    setFormData({
      tipo_documento: "",
      num_documento: "",
      primer_nombre: "",
      segundo_nombre: "",
      primer_apellido: "",
      segundo_apellido: "",
      correo_electronico: "",
      numero_telefonico: "",
      tipo_de_rol: "",
      contraseña: ""
    });
    setMensaje("");
  };

  // Crear O Actualizar usuario
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMensaje("");

    try {
      if (!token) {
        setMensaje(" Error: No hay sesión activa. Por favor inicia sesión.");
        setLoading(false);
        return;
      }

      const requestBody = {
        funcionario: {
          num_documento: formData.num_documento,
          primer_nombre: formData.primer_nombre,
          segundo_nombre: formData.segundo_nombre || "",
          primer_apellido: formData.primer_apellido,
          segundo_apellido: formData.segundo_apellido || "",
          correo_electronico: formData.correo_electronico,
          numero_telefonico: formData.numero_telefonico
        },
        usuario: {
          tipo_de_rol: formData.tipo_de_rol,
          ...(formData.contraseña && { contraseña: formData.contraseña })
        }
      };

      let data;


      if (modoEdicion && usuarioEditando) {
        data = await funcionariosService.update(token, usuarioEditando, requestBody);
        setMensaje(" Usuario actualizado exitosamente");
      } else {
        data = await funcionariosService.create(token, requestBody);
        setMensaje(" Usuario creado exitosamente");
      }


      // Limpiar formulario
      setFormData({
        tipo_documento: "",
        num_documento: "",
        primer_nombre: "",
        segundo_nombre: "",
        primer_apellido: "",
        segundo_apellido: "",
        correo_electronico: "",
        numero_telefonico: "",
        tipo_de_rol: "",
        contraseña: ""
      });


      setModoEdicion(false);
      setUsuarioEditando(null);
      
      setTimeout(() => setMensaje(""), 3000);
      
    } catch (error) {
      console.error(`Error al ${modoEdicion ? 'actualizar' : 'crear'} usuario:`, error);
      
      if (error.response?.status === 401) {
        setMensaje(" Error: Sesión expirada. Por favor inicia sesión nuevamente.");
      } else if (error.response?.status === 403) {
        setMensaje(` Error: No tienes permisos para ${modoEdicion ? 'actualizar' : 'crear'} usuarios.`);
      } else {
        const mensajeError = error.response?.data?.mensaje || error.response?.data?.message || 
          `No se pudo ${modoEdicion ? 'actualizar' : 'crear'} el usuario`;
        setMensaje(` Error: ${mensajeError}`);
      }
    } finally {
      setLoading(false);
    }
  };

  // Eliminar usuario
  const handleEliminar = async (num_documento) => {
    if (!window.confirm(`¿Estás seguro de eliminar el usuario con documento ${num_documento}?`)) {
      return;
    }
    
    setLoading(true);
    setMensaje("");
    
    try {
      if (!token) {
        setMensaje(" Error: No hay sesión activa. Por favor inicia sesión.");
        setLoading(false);
        return;
      }

      const data = await funcionariosService.delete(token, num_documento);
      console.log("Respuesta eliminar:", data);

      setMensaje(" Usuario eliminado exitosamente");
      cargarUsuarios();

      setTimeout(() => setMensaje(""), 3000);
      
    } catch (error) {
      console.error("Error al eliminar:", error);
      
      if (error.response?.status === 401) {
        setMensaje(" Error: Sesión expirada. Por favor inicia sesión nuevamente.");
      } else if (error.response?.status === 403) {
        setMensaje(" Error: No tienes permisos para eliminar usuarios.");
      } else {
        const mensajeError = error.response?.data?.mensaje || error.response?.data?.message || "No se pudo eliminar";
        setMensaje(` Error: ${mensajeError}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Mensaje global */}
      {mensaje && (
        <div className={`mensaje ${mensaje.includes('✅') ? "exito" : "error"}`}>
          {mensaje}
          <button 
            onClick={() => setMensaje("")}
          >
            ×
          </button>
        </div>
      )}

      {/* Botones del menú */}
      <div className="menu">
        <button className="btn-menu" 
          onClick={() => mostrarSeccion("crear")}
          style={{
            backgroundColor: seccionActiva === "crear" ? "#f7a840" : "#faca77"
          }}
        >
          {modoEdicion ? "Editando Usuario" : "Crear Usuario"}
        </button>
        <button className="btn-menu"
          onClick={() => mostrarSeccion("consultar")}
          style={{
            backgroundColor: seccionActiva === "consultar" ? "#f7a840" : "#faca77"
          }}
        >
          Consultar Usuarios
        </button>
        <button className="btn-menu"
          onClick={() => mostrarSeccion("editar")}
          style={{
            backgroundColor: seccionActiva === "editar" ? "#f7a840" : "#faca77"
          }}
        >
          Editar Usuario
        </button>
        <button className="btn-menu"
          onClick={() => mostrarSeccion("eliminar")}
          style={{
            backgroundColor: seccionActiva === "eliminar" ? "#f7a840" : "#faca77"
          }}
        >
          Eliminar Usuario
        </button>
      </div>

      {/* Contenedor de secciones */}
      <div className="contenido ">
        {/* Sección: Crear Usuario */}
        {seccionActiva === "crear" && (
          <div className="seccion">
            <h2>{modoEdicion ? "Editar Usuario" : "Crear Usuario"}</h2>
            <form className="formulario mt-4" onSubmit={handleSubmit}>
              <select 
                name="tipo_documento" 
                value={formData.tipo_documento}
                onChange={handleChange}
                required
              >
                <option value="">Seleccione tipo de documento</option>
                <option value="CC">Cédula de ciudadanía</option>
                <option value="TI">Tarjeta de identidad</option>
                <option value="CE">Cédula de extranjería</option>
              </select>

              <input 
                type="text" 
                name="num_documento"
                placeholder="Número de documento"
                value={formData.num_documento}
                onChange={handleChange}
                readOnly={modoEdicion}
                required
                style={modoEdicion ? { backgroundColor: '#e9ecef', cursor: 'not-allowed' } : {}}
              />

              <div className="fila">
                <input 
                  type="text" 
                  name="primer_nombre"
                  placeholder="Primer nombre"
                  value={formData.primer_nombre}
                  onChange={handleChange}
                  required
                />
                <input 
                  type="text" 
                  name="segundo_nombre"
                  placeholder="Segundo nombre (opcional)"
                  value={formData.segundo_nombre}
                  onChange={handleChange}
                />
              </div>

              <div className="fila">
                <input 
                  type="text" 
                  name="primer_apellido"
                  placeholder="Primer apellido"
                  value={formData.primer_apellido}
                  onChange={handleChange}
                  required
                />
                <input 
                  type="text" 
                  name="segundo_apellido"
                  placeholder="Segundo apellido (opcional)"
                  value={formData.segundo_apellido}
                  onChange={handleChange}
                />
              </div>

              <input 
                type="email" 
                name="correo_electronico"
                placeholder="Correo electrónico"
                value={formData.correo_electronico}
                onChange={handleChange}
                required
              />

              <input 
                type="text" 
                name="numero_telefonico"
                placeholder="Número telefónico"
                value={formData.numero_telefonico}
                onChange={handleChange}
                required
              />

              <select 
                name="tipo_de_rol"
                value={formData.tipo_de_rol}
                onChange={handleChange}
                required
              >
                <option value="">Seleccione Rol</option>
                <option value="Administrador">Administrador</option>
                <option value="Funcionario">Funcionario</option>
              </select>

              <div className="password-container">
                <input
                  type={showPassword ? "text" : "password"}
                  name="contraseña"
                  placeholder={modoEdicion ? "Nueva contraseña (dejar vacío para mantener actual)" : "Contraseña"}
                  value={formData.contraseña}
                  onChange={handleChange}
                  required={!modoEdicion}
                  minLength="6"
                />
                <span
                  className="icono-ojo"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
                </span>
              </div>

              <button type="submit" disabled={loading}>
                {loading 
                  ? (modoEdicion ? "Actualizando..." : "Registrando...") 
                  : (modoEdicion ? "Actualizar Usuario" : "Registrar Usuario")
                }
              </button>

              {modoEdicion && (
                <button 
                  type="button" 
                  onClick={handleCancelarEdicion}

                >
                  Cancelar Edición
                </button>
              )}
            </form>
          </div>
        )}

        {/* Sección: Consultar Usuarios */}
        {seccionActiva === "consultar" && (
          <div className="seccion ">
            <h2>Consultar Usuarios</h2>
            {loading ? (
              <p style={{ textAlign: 'center' }}>Cargando usuarios...</p>
            ) : (
              <div className="card mt-4">
                {usuarios.length > 0 ? (
                  usuarios.map((usuario) => (
                    <div className=" m-2 tarjeta d-flex justify-content-between align-items-center" key={usuario.Num_Documento || usuario.num_documento}>
                     <div className="d-flex align-items-center  ">
                       <img src={Foto} className="foto-usuario" alt="Foto usuario" />
                      <h3>
                        {`${usuario.Primer_Nombre || usuario.primer_nombre} ${usuario.Primer_Apellido || usuario.primer_apellido}`}
                      </h3>
                     
                     </div>
                      <button type="button" class="btn-consultar btn btn-primary btn-sm">Consultar</button>
                    </div>
                    
                  ))
                ) : (
                  <p style={{ textAlign: 'center', width: '100%' }}>No hay usuarios registrados</p>
                )}
              </div>
            )}
          </div>
        )}

        {/*  Editar Usuario  */}
        {seccionActiva === "editar" && (
          <div className="seccion">
            <h2>Editar Usuario</h2>
            {loading ? (
              <p style={{ textAlign: 'center' }}>Cargando usuarios...</p>
            ) : (
              <table className="tabla-usuarios  mt-4">
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th>Documento</th>
                    <th>Correo</th>
                    <th>Rol</th>
                    <th>Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {usuarios.length > 0 ? (
                    usuarios.map((usuario) => (
                      <tr key={usuario.Num_Documento || usuario.num_documento}>
                        <td>
                          {`${usuario.Primer_Nombre || usuario.primer_nombre} ${usuario.Primer_Apellido || usuario.primer_apellido}`}
                        </td>
                        <td>{usuario.Num_Documento || usuario.num_documento}</td>
                        <td>{usuario.Correo_Electronico || usuario.correo_electronico}</td>
                        <td>{usuario.Tipo_de_Rol || usuario.tipo_de_rol || 'N/A'}</td>
                        <td>
                          <button 
                            onClick={() => handleEditarClick(usuario)}
                            disabled={loading}
                            style={{ backgroundColor: '#007bff' }}
                          >
                            Editar
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" style={{ textAlign: 'center' }}>
                        No hay usuarios para editar
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* Sección: Eliminar Usuario */}
        {seccionActiva === "eliminar" && (
          <div className="seccion">
            <h2>Eliminar Usuario</h2>
            {loading ? (
              <p style={{ textAlign: 'center' }}>Cargando usuarios...</p>
            ) : (
              <table className="tabla-usuarios mt-4">
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th>Documento</th>
                    <th>Correo</th>
                    <th>Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {usuarios.length > 0 ? (
                    usuarios.map((usuario) => (
                      <tr key={usuario.Num_Documento || usuario.num_documento}>
                        <td>
                          {`${usuario.Primer_Nombre || usuario.primer_nombre} ${usuario.Primer_Apellido || usuario.primer_apellido}`}
                        </td>
                        <td>{usuario.Num_Documento || usuario.num_documento}</td>
                        <td>{usuario.Correo_Electronico || usuario.correo_electronico}</td>
                        <td>
                          <button 
                            onClick={() => handleEliminar(usuario.Num_Documento || usuario.num_documento)}
                            disabled={loading}
                          >
                            Eliminar
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" style={{ textAlign: 'center' }}>
                        No hay usuarios para eliminar
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default Usuarios;