import React from "react";
import "./Chat.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
// Importa la imagen desde la ruta correcta
import fotoUsuario from "../../assets/Recursos/Foto.jpg";

export default function Chat() {
  return (
    <>
      {/* CONTENEDOR DEL CHAT */}
      <div className="chat-wrapper">
        <div className="container principal">
          <div className="row">

            {/* PANEL IZQUIERDO */}
            <div className="col-md-4 panel-usuarios">
              <h6 className="titulo-panel">Chats</h6>
              <input type="text" className="buscador" placeholder="Buscar..." />

              <div className="usuario activo">
                <img src={fotoUsuario} alt="María" />
                <div>
                  <strong>María</strong>
                  <small>Último mensaje...</small>
                </div>
              </div>

              <div className="usuario">
                <img src={fotoUsuario} alt="Carlos" />
                <div>
                  <strong>Carlos</strong>
                  <small>Hola</small>
                </div>
              </div>

              <div className="usuario">
                <img src={fotoUsuario} alt="Soporte" />
                <div>
                  <strong>Soporte</strong>
                  <small>Nuevo mensaje</small>
                </div>
              </div>
            </div>

            {/* PANEL DERECHO */}
            <div className="col-md-8 panel-chat">

              <div className="chat-header">
                <img src={fotoUsuario} alt="María" />
                <strong>María</strong>
              </div>

              <div className="chat-mensajes">
                <div className="mensaje recibido">
                  Hola, ¿me ayudas con el informe?
                </div>
                <div className="mensaje enviado">
                  Sí, dime qué necesitas.
                </div>
                <div className="mensaje recibido">
                  El resumen de hoy.
                </div>
              </div>

              <div className="chat-enviar">
                <button className="btn-archivo">
                  <i className="bi bi-paperclip"></i>
                </button>

                <input type="text" placeholder="Mensaje..." />

                <button className="btn-enviar">
                  <i className="bi bi-send"></i>
                </button>
              </div>

            </div>

          </div>
        </div>
      </div>
    </>
  );
}