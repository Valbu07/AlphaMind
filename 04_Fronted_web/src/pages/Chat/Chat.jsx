import React from 'react';
import './Chat.css';
import foto from '../../assets/Recursos/Foto.jpg';


const Chat = () => {
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
               <img src={foto} alt="Foto" />
                <div><strong>María</strong><small>Último mensaje...</small></div>
              </div>
              <div className="usuario">
               <img src={foto} alt="Foto" />
                <div><strong>Carlos</strong><small>Hola</small></div>
              </div>
              <div className="usuario">
                <img src={foto} alt="Foto" />
                <div><strong>Soporte</strong><small>Nuevo mensaje</small></div>
              </div>
            </div>

            {/* PANEL DERECHO */}
            <div className="col-md-8 panel-chat">
              <div className="chat-header">
                <img src={foto} alt="Foto" />
                <div><strong>María</strong></div>
              </div>

              <div className="chat-mensaje">
                <div className="mensaje-recibido">Hola, ¿me ayudas con el informe?</div>
                <div className="mensaje-enviado">Sí, dime qué necesitas.</div>
                <div className="mensaje-recibido">El resumen de hoy.</div>
              </div>

              <div className="chat-enviar">
                <button className="btn-archivo"><i className="bi bi-paperclip"></i></button>
                <input type="text" placeholder="Mensaje..." />
                <button className="btn-enviar"><i className="bi bi-send"></i></button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Chat;