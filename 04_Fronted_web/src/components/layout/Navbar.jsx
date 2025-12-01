import logoCediplus from "../../assets/Recursos/logoCediplus.svg";
import persona from "../../assets/Recursos/Foto.jpg";

import "./Navbar.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { Link } from "react-router-dom";
import {
  BsPersonFill, BsPencilSquare, BsJournalText, BsCalendarEvent, BsClipboardData, BsChatDots, BsBoxArrowRight, BsGear,
} from "react-icons/bs";

export default function Navbar() {
  const handleCloseOffcanvas = () => {
    const btnClose = document.querySelector("#offcanvasNavbar .btn-close");
    if (btnClose) btnClose.click();
  };

  return (
    <nav className="navbar fixed-top">
      <div className="container-fluid">
        
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="offcanvas"
          data-bs-target="#offcanvasNavbar"
          aria-controls="offcanvasNavbar"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <img src={logoCediplus} alt="logo" className="logoCediplus" />

        <div
          className="offcanvas offcanvas-start"
          tabIndex="-1"
          id="offcanvasNavbar"
          aria-labelledby="offcanvasNavbarLabel"
        >
          <div className="offcanvas-header">
            <h5 className="offcanvas-title" id="offcanvasNavbarLabel"></h5>
            <button
              type="button"
              className="btn-close boton"
              data-bs-dismiss="offcanvas"
              aria-label="Close"
            ></button>
          </div>

          <div className="offcanvas-body">
            <ul className="navbar-nav justify-content-end flex-grow-1 pe-3">
              <li className="nav-item">
                <Link className="nav-link" to="/usuarios" onClick={handleCloseOffcanvas}>
                  <BsPersonFill className="icon-menu" /> <span className="link-text">Usuarios</span>
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/crear-actividades" onClick={handleCloseOffcanvas}>
                  <BsPencilSquare className="icon-menu" /> <span className="link-text">Crear Actividades</span>
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/actividades" onClick={handleCloseOffcanvas}>
                  <BsJournalText className="icon-menu" /> <span className="link-text">Actividades</span>
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/calendario" onClick={handleCloseOffcanvas}>
                  <BsCalendarEvent className="icon-menu" /> <span className="link-text">Calendario</span>
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/reportes" onClick={handleCloseOffcanvas}>
                  <BsClipboardData className="icon-menu" /> <span className="link-text">Reportes</span>
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/chat" onClick={handleCloseOffcanvas}>
                  <BsChatDots className="icon-menu" /> <span className="link-text">Chat</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>

        
        <div className="dropdown">
          <a
            href="#"
            className="user-link"
            id="userDropdown"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
          <img src={persona} alt="Foto de perfil" className="foto-perfil" />
          </a>
          <ul
            className="dropdown-menu dropdown-menu-end"
            aria-labelledby="userDropdown"
          >
            <li className="dropdown-header text-center">
              <h2 className="nombre">Nombre de Usuario</h2>
            </li>
            <li>
              <hr className="dropdown-divider" />
            </li>
            <li>
              <Link
                className="dropdown-item d-flex align-items-center"
                to={"/"}
              >
                <BsBoxArrowRight className="me-2" /> Salir
              </Link>
            </li>
            <li>
              <Link
                className="dropdown-item d-flex "
                to={"/configuracion"}
              >
                <BsGear className="me-2" /> Configuración
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
