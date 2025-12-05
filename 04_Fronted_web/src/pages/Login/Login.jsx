import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./Login.css";

import logoCediplus from "../../assets/Recursos/logoCediplus.svg";
import Admin1 from "../../assets/Recursos/Login/Admin1.png";
import Admin2 from "../../assets/Recursos/Login/Admin2.png";
import Trabajador1 from "../../assets/Recursos/Login/Trabajador1.png";
import Trabajador2 from "../../assets/Recursos/Login/Trabajador2.png";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth"; 
import { authService } from "../../services/authService"; 

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth(); // Obtener la función login del contexto

  const [num_documento, setDocumento] = useState("");
  const [contraseña, setContraseña] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [cargando, setCargando] = useState(false); //Estado de carga

  //  Función para manejar el login
  const handleSubmit = async (e) => {
    e.preventDefault();
    setCargando(true);
    setMensaje("");

    try {
      //  Usar el servicio de autenticación
      const data = await authService.login({
        num_documento,
        contraseña
      });

      console.log("Respuesta del backend:", data);

      // Verificar si la respuesta es exitosa
      if (data.body && data.body.token) {
        // Usar el contexto para guardar token y usuario
        login(data.body.token, data.body.user || { num_documento });
        
        setMensaje("Bienvenido!");
        
        //  Redirigir con la espera de medio segundo 
        setTimeout(() => {
          navigate("/actividades");
        }, 500);
      } else {
        setMensaje(" Error: No se recibió el token");
      }
    } catch (error) {
      console.error("Error en login:", error);
      
      // Manejo de errores más específico
      if (error.response) {
        setMensaje(` ${error.response.data.message || "Credenciales incorrectas"}`);
      } else if (error.request) {
        setMensaje("No se pudo conectar con el servidor");
      } else {
        setMensaje(" Error inesperado");
      }
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="login-page">
      <div className="header">
        <img src={logoCediplus} alt="logo" className="logo" />
      </div>
      <hr />
      <div className="container">
        <div className="row">
          {/* CARRUSEL */}
          <div className="col-md-6  carrusel-login">
            <div id="carouselExampleIndicators" className="carousel slide">
              <div className="carousel-inner">
                <div className="carousel-item active">
                  <img src={Admin1} className="d-block w-100" alt="Admin1" />
                </div>
                <div className="carousel-item">
                  <img src={Trabajador1} className="d-block w-100" alt="Trabajador1" />
                </div>
                <div className="carousel-item">
                  <img src={Admin2} className="d-block w-100" alt="Admin2" />
                </div>
                <div className="carousel-item">
                  <img src={Trabajador2} className="d-block w-100" alt="Trabajador2" />
                </div>
              </div>
            </div>
          </div>

          <div className="col-12 col-md-6">
            <div className="Validacion">
              <form onSubmit={handleSubmit} className="formulario-login">
                <h2>Bienvenido</h2>

                <div className="input-group has-validation mb-3">
                  <span className="input-group-text">
                    <i className="bi bi-person-circle"></i>
                  </span>
                  <div className="form-floating">
                    <input
                      type="text"
                      className="form-control"
                      id="documento"
                      placeholder="Documento"
                      required
                      value={num_documento}
                      onChange={(e) => setDocumento(e.target.value)}
                      disabled={cargando}
                    />
                    <label htmlFor="documento">Documento</label>
                  </div>
                </div>

                <div className="input-group has-validation mb-3">
                  <span className="input-group-text">
                    <i className="bi bi-key-fill"></i>
                  </span>
                  <div className="form-floating">
                    <input
                      type="password"
                      className="form-control"
                      id="password"
                      placeholder="Contraseña"
                      required
                      value={contraseña}
                      onChange={(e) => setContraseña(e.target.value)}
                      disabled={cargando}
                    />
                    <label htmlFor="password">Contraseña</label>
                  </div>
                </div>

                <div className="footer-formulario">
                  <a href="./recuperar" className="contraseña-login">
                    ¿Olvidó su Contraseña?
                  </a>
                  <button 
                    type="submit" 
                    className="btn btn-primary"
                    disabled={cargando}
                  >
                    {cargando ? "Ingresando..." : "Ingresar"}
                  </button>
                </div>

                {mensaje && (
                  <div className={`alert mt-3 ${mensaje.includes("✅") ? "alert-success" : "alert-danger"}`}>
                    {mensaje}
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}