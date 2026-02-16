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
  const { login } = useAuth();

  const [num_documento, setDocumento] = useState("");
  const [contraseña, setContraseña] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [cargando, setCargando] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCargando(true);
    setMensaje("");

    try {
      console.log(' Intentando login con documento:', num_documento);
      
      // Llamar al servicio de autenticación
      const data = await authService.login({
        num_documento,
        contraseña
      });

      console.log(" Respuesta del backend:", data);

      // Verificar que la respuesta tenga la estructura correcta
      if (!data.body || !data.body.token) {
        console.error(' Respuesta sin token:', data);
        throw new Error("No se recibió el token del servidor");
      }

      const token = data.body.token;
      const user = data.body.user || { num_documento };

      console.log(' Token extraído:', token);
      console.log('👤 Usuario extraído:', user);

      // Guardar usando el contexto
      login(token, user);
      
      // Verificar que se guardó
      const tokenVerificado = localStorage.getItem('token');
      const userVerificado = localStorage.getItem('user');
      console.log(' Token guardado en localStorage:', tokenVerificado ? ' Sí' : ' No');
      console.log(' User guardado en localStorage:', userVerificado ? ' Sí' : ' No');
      
      setMensaje("Bienvenido!");
      
      // Redirigir después de medio segundo
      setTimeout(() => {
        console.log(' Redirigiendo a /actividades...');
        navigate("/actividades");
      }, 500);
      
    } catch (error) {
      console.error(" Error completo en login:", error);
      
      if (error.response) {
        console.error('Response error:', error.response.data);
        setMensaje(` ${error.response.data.body || error.response.data.message || "Credenciales incorrectas"}`);
      } else if (error.request) {
        console.error('Request error:', error.request);
        setMensaje(" No se pudo conectar con el servidor");
      } else {
        console.error('Error message:', error.message);
        setMensaje(` ${error.message || "Error inesperado"}`);
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
          <div className="col-md-6 carrusel-login">
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
                    className="btn btn-primary btn-primary-login"
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