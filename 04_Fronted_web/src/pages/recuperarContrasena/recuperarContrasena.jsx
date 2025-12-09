import React from 'react';
import './recuperarContraseña.css';


const RecuperarContrasena = () => {  return (
    <>
      <link
        href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.7/dist/css/bootstrap.min.css"
        rel="stylesheet"
        integrity="sha384-LN+7fdVzj6u52u30Kp6M/trliBMCMKTyK833zpbD+pXdCLuTusPj697FH4R/5mcr"
        crossOrigin="anonymous"
      />
      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.13.1/font/bootstrap-icons.min.css"
      />
      <hr />
      
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="Validacion">
              <div className="icono">
                <i className="bi bi-person-fill-lock"></i>
              </div>
              <div>
                <h3>¿Tienes problemas para iniciar sesión?</h3>
                <p>Ingresa tu correo electrónico, teléfono o nombre de usuario</p>
                <hr />
                <p>y te enviaremos un enlace para que recuperes el acceso a tu cuenta.</p>
                
                <div className="input-group has-validation">
                  <span className="input-group-text">
                    <i className="bi bi-badge-cc-fill"></i>
                  </span>
                  <div className="form-floating">
                    <input
                      type="text"
                      className="form-control"
                      id="floatingInputGroup2"
                      placeholder="Username"
                      required
                    />
                    <label htmlFor="floatingInputGroup2">Documento</label>
                  </div>
                </div>
                
                <div className="boton">
                  <button type="button" className="btn btn-primary">
                    Enviar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
 }

export default RecuperarContrasena