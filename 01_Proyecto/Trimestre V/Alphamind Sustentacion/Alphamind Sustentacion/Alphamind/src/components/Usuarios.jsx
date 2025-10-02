import { useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import "../css/usuarios.css";

const Usuarios = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState("");

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

  const getToken = () => {
    return localStorage.getItem("token");
  };


  const mostrarSeccion = (seccion) => {
    const secciones = document.querySelectorAll(".seccion");
    secciones.forEach((s) => s.classList.add("oculto"));
    document.getElementById(seccion)?.classList.remove("oculto");
    

    if (seccion === "consultar" || seccion === "eliminar") {
      cargarUsuarios();
    }
  };


  const cargarUsuarios = async () => {
    setLoading(true);
    setMensaje("");
    
    try {
      const token = getToken();
      
      if (!token) {
        setMensaje("Error: No hay sesión activa. Por favor inicia sesión.");
        setLoading(false);
        return;
      }

      const response = await fetch("http://localhost:3000/funcionarios", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": token
        }
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Usuarios cargados:", data);
        
        if (data.body) {
          setUsuarios(data.body);
        } else {
          setUsuarios(data);
        }
      } else if (response.status === 401) {
        setMensaje("Error: Sesión expirada. Por favor inicia sesión nuevamente.");
      } else if (response.status === 403) {
        setMensaje("Error: No tienes permisos para ver esta información.");
      } else {
        setMensaje("Error al cargar usuarios");
      }
    } catch (error) {
      console.error("Error:", error);
      setMensaje("Error de conexión con el servidor. Verifica que el backend esté corriendo en el puerto 3000.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Crear nuevo usuario
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMensaje("");

    try {
      const token = getToken();
      
      if (!token) {
        setMensaje("Error: No hay sesión activa. Por favor inicia sesión.");
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
          contraseña: formData.contraseña
        }
      };

      console.log("Enviando datos:", requestBody);

      const response = await fetch("http://localhost:3000/funcionarios/agregar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": token
        },
        body: JSON.stringify(requestBody)
      });

      const data = await response.json();
      console.log("Respuesta del servidor:", data);

      if (response.ok) {
        setMensaje("Usuario creado exitosamente");
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
        
        setTimeout(() => setMensaje(""), 3000);
      } else if (response.status === 401) {
        setMensaje("Error: Sesión expirada. Por favor inicia sesión nuevamente.");
      } else if (response.status === 403) {
        setMensaje("Error: No tienes permisos para crear usuarios.");
      } else {
        setMensaje(`Error: ${data.mensaje || data.message || "No se pudo crear el usuario"}`);
      }
    } catch (error) {
      console.error("Error:", error);
      setMensaje("Error de conexión con el servidor.");
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
      const token = getToken();
      
      if (!token) {
        setMensaje("Error: No hay sesión activa. Por favor inicia sesión.");
        setLoading(false);
        return;
      }

      const response = await fetch(`http://localhost:3000/funcionarios/${num_documento}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": token
        }
      });

      const data = await response.json();
      console.log("Respuesta eliminar:", data);

      if (response.ok) {
        setMensaje(" Usuario eliminado exitosamente");
        cargarUsuarios(); // Recargar lista

        setTimeout(() => setMensaje(""), 3000);
      } else if (response.status === 401) {
        setMensaje("Error: Sesión expirada. Por favor inicia sesión nuevamente.");
      } else if (response.status === 403) {
        setMensaje("Error: No tienes permisos para eliminar usuarios.");
      } else {
        setMensaje(`Error: ${data.mensaje || data.message || "No se pudo eliminar"}`);
      }
    } catch (error) {
      console.error("Error:", error);
      setMensaje("Error de conexión con el servidor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>

      {mensaje && (
        <div className={`mensaje ${mensaje.includes("✓") ? "exito" : "error"}`}>
          {mensaje}
        </div>
      )}

      {/* Botones del menú */}
      <div className="menu d-grid gap-2 d-md-flex justify-content-md-center flex-wrap">
        <button className="btn btn-warning" onClick={() => mostrarSeccion("crear")}>
          Crear Usuario
        </button>
        <button className="btn btn-warning" onClick={() => mostrarSeccion("consultar")}>
          Consultar Usuarios
        </button>
        <button className="btn btn-warning" onClick={() => mostrarSeccion("eliminar")}>
          Eliminar Usuario
        </button>
      </div>


      <div className="contenido">
        <div id="crear" className="seccion">
          <h2>Crear Usuario</h2>
          <form className="formulario" onSubmit={handleSubmit}>

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
              required
            />

            <div className="fila input-group has-validation">
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
                placeholder="Contraseña"
                value={formData.contraseña}
                onChange={handleChange}
                required
                minLength="6"
              />
              <span
                className="icono-ojo"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
              </span>
            </div>

            <button type="submit" disabled={loading}>
              {loading ? "Registrando..." : "Registrar"}
            </button>
          </form>
        </div>

        <div id="consultar" className="seccion oculto">
          <h2>Consultar Usuarios</h2>
          {loading ? (
            <p>Cargando usuarios...</p>
          ) : (
            <div className="tarjetas-usuarios">
              {usuarios.length > 0 ? (
                usuarios.map((usuario) => (
                  <div className="tarjeta" key={usuario.Num_Documento || usuario.num_documento}>
                    <h3>
                      {`${usuario.Primer_Nombre || usuario.primer_nombre} ${usuario.Primer_Apellido || usuario.primer_apellido}`}
                    </h3>
                    <p>Documento: {usuario.Num_Documento || usuario.num_documento}</p>
                    <p>Correo: {usuario.Correo_Electronico || usuario.correo_electronico}</p>
                    <p>Teléfono: {usuario.Numero_telefonico || usuario.numero_telefonico}</p>
                  </div>
                ))
              ) : (
                <p>No hay usuarios registrados</p>
              )}
            </div>
          )}
        </div>

        <div id="eliminar" className="seccion oculto">
          <h2>Eliminar Usuario</h2>
          {loading ? (
            <p>Cargando usuarios...</p>
          ) : (
            <table className="tabla-usuarios">
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
                          className="btn btn-danger btn-sm"
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" style={{textAlign: 'center'}}>
                      No hay usuarios para eliminar
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  );
};

export default Usuarios;