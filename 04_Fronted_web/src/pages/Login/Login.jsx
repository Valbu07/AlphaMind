import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "./Login.css";

import logoCediplus from "../../assets/Recursos/logoCediplus.svg";
import Admin1 from "../../assets/Recursos/Login/Admin1.png";
import Admin2 from "../../assets/Recursos/Login/Admin2.png";
import Trabajador1 from "../../assets/Recursos/Login/Trabajador1.png";
import Trabajador2 from "../../assets/Recursos/Login/Trabajador2.png";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { authService } from "../../services/authService";

const SLIDES = [Admin1, Trabajador1, Admin2, Trabajador2];

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [num_documento, setDocumento] = useState("");
  const [contraseña, setContraseña] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [cargando, setCargando] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setActiveSlide((p) => (p + 1) % SLIDES.length), 4000);
    return () => clearInterval(t);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCargando(true);
    setMensaje("");
    try {
      const data = await authService.login({ num_documento, contraseña });
      if (!data.body?.token) throw new Error("No se recibió el token del servidor");
      login(data.body.token, data.body.usuario || { num_documento });
      setMensaje("ok");
      setTimeout(() => navigate("/actividades"), 600);
    } catch (error) {
      if (error.response) {
        setMensaje(error.response.data.body || error.response.data.message || "Credenciales incorrectas");
      } else if (error.request) {
        setMensaje("Sin conexión con el servidor");
      } else {
        setMensaje(error.message || "Error inesperado");
      }
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="lp-root">
      {/* ── LEFT PANEL ── */}
      <div className="lp-left">
        <div className="lp-slides">
          {SLIDES.map((src, i) => (
            <img key={i} src={src} alt="" className={`lp-slide ${i === activeSlide ? "active" : ""}`} />
          ))}
          <div className="lp-overlay" />
        </div>

        <div className="lp-brand">
          <img src={logoCediplus} alt="Cediplus" className="lp-logo" />
        </div>

        <div className="lp-tagline">
          <p className="lp-tag-eyebrow">Plataforma de gestión</p>
          <h1 className="lp-tag-title">Tu trabajo,<br />un solo lugar.</h1>
          <div className="lp-dots">
            {SLIDES.map((_, i) => (
              <button
                key={i}
                className={`lp-dot ${i === activeSlide ? "active" : ""}`}
                onClick={() => setActiveSlide(i)}
                aria-label={`Slide ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* ── RIGHT PANEL ── */}
      <div className="lp-right">
        <div className="lp-form-wrap">
          <p className="lp-step">Acceso al sistema</p>
          <h2 className="lp-form-title">Bienvenido<span className="lp-dot-accent">.</span></h2>

          <form onSubmit={handleSubmit} noValidate className="lp-form">
            {/* Documento */}
            <div className="lp-field">
              <label htmlFor="lp-doc" className="lp-label">Número de documento</label>
              <div className="lp-input-wrap">
                <svg className="lp-ico" viewBox="0 0 20 20" fill="none">
                  <circle cx="10" cy="7" r="3.5" stroke="currentColor" strokeWidth="1.5"/>
                  <path d="M3 17c0-3.3 3.1-6 7-6s7 2.7 7 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
                <input
                  id="lp-doc"
                  type="text"
                  className="lp-input"
                  placeholder="Ej. 1020304050"
                  required
                  value={num_documento}
                  onChange={(e) => setDocumento(e.target.value)}
                  disabled={cargando}
                  autoComplete="username"
                />
              </div>
            </div>

            {/* Contraseña */}
            <div className="lp-field">
              <label htmlFor="lp-pass" className="lp-label">Contraseña</label>
              <div className="lp-input-wrap">
                <svg className="lp-ico" viewBox="0 0 20 20" fill="none">
                  <rect x="4" y="9" width="12" height="8" rx="2" stroke="currentColor" strokeWidth="1.5"/>
                  <path d="M7 9V7a3 3 0 016 0v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  <circle cx="10" cy="13" r="1.2" fill="currentColor"/>
                </svg>
                <input
                  id="lp-pass"
                  type={showPass ? "text" : "password"}
                  className="lp-input"
                  placeholder="••••••••"
                  required
                  value={contraseña}
                  onChange={(e) => setContraseña(e.target.value)}
                  disabled={cargando}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="lp-eye"
                  onClick={() => setShowPass((v) => !v)}
                  tabIndex={-1}
                  aria-label={showPass ? "Ocultar contraseña" : "Mostrar contraseña"}
                >
                  {showPass ? (
                    <svg viewBox="0 0 20 20" fill="none">
                      <path d="M3 3l14 14M8.5 8.7A3 3 0 0011.3 11.5M4.2 6.4C2.8 7.6 2 9 2 10c0 2.2 3.6 6 8 6 1.4 0 2.8-.4 4-1.1M6 4.5A8.9 8.9 0 0110 4c4.4 0 8 3.8 8 6 0 1.1-.6 2.3-1.7 3.4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
                    </svg>
                  ) : (
                    <svg viewBox="0 0 20 20" fill="none">
                      <path d="M2 10c0-2.2 3.6-6 8-6s8 3.8 8 6-3.6 6-8 6-8-3.8-8-6z" stroke="currentColor" strokeWidth="1.4"/>
                      <circle cx="10" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.4"/>
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <div className="lp-forgot-row">
              <a href="./recuperar" className="lp-forgot">¿Olvidó su contraseña?</a>
            </div>

            <button type="submit" className="lp-submit" disabled={cargando}>
              {cargando ? (
                <span className="lp-spinner" />
              ) : (
                <>
                  Ingresar
                  <svg viewBox="0 0 20 20" fill="none" className="lp-arrow">
                    <path d="M4 10h12M11 5l5 5-5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </>
              )}
            </button>

            {mensaje && mensaje !== "ok" && (
              <div className="lp-feedback lp-error">
                <svg viewBox="0 0 20 20" fill="none">
                  <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.4"/>
                  <path d="M10 6v4M10 13v1" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                </svg>
                {mensaje}
              </div>
            )}
            {mensaje === "ok" && (
              <div className="lp-feedback lp-success">
                <svg viewBox="0 0 20 20" fill="none">
                  <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.4"/>
                  <path d="M6.5 10.5l2.5 2.5 4.5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                ¡Bienvenido! Redirigiendo…
              </div>
            )}
          </form>

          <p className="lp-footer-note">© {new Date().getFullYear()} Cediplus — Todos los derechos reservados</p>
        </div>
      </div>
    </div>
  );
}