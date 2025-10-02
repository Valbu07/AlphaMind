import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "../css/Login.css";
import logoCediplus from "../assets/Recursos/logoCediplus.svg";
import Admin1 from "../assets/Recursos/Login/Admin1.png";
import Admin2 from "../assets/Recursos/Login/Admin2.png";
import Trabajador1 from "../assets/Recursos/Login/Trabajador1.png";
import Trabajador2 from "../assets/Recursos/Login/Trabajador2.png";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
   const navigate = useNavigate() ;


  const [num_documento, setDocumento] = useState("");
  const [contraseña, setContraseña] = useState("");
  const [mensaje, setMensaje] = useState("");

  // función para manejar el login
  const handleSubmit = async (e) => {
    e.preventDefault(); 
    
 const res = await fetch("http://localhost:3000/auth/login", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ 
  funcionario: { num_documento }, 
  usuario: { contraseña } 
}),});

const data = await res.json();
console.log("Respuesta del backend:", data);

if (res.ok) {
  localStorage.setItem("token", data.body.token);
  setMensaje("✅ Bienvenido!");
  navigate("/actividades");
} else {
  setMensaje("Upsss, el error en las credenciales o no existe " + data.message);
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
          <div className="col-6">
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
                    />
                    <label htmlFor="password">Contraseña</label>
                  </div>
                </div>

                <div className="footer-formulario">
                  <a href="./recuperar" className="contraseña-login">
                    ¿Olvidó su Contraseña?
                  </a>
                  <button type="submit" className="btn btn-primary">
                    Ingresar
                  </button>
                </div>

                {mensaje && <p className="mt-3">{mensaje}</p>}
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
