import { useState, useRef, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { subirFotoPerfil, cambiarContrasena } from "../../services/perfilService";
import "./configuracion.css";

const API = import.meta.env.VITE_API_URL || "http://localhost:3000";
const DEFAULT_AVATAR = "/default-avatar.png";

export default function PerfilUsuario() {
  const { usuario, token, updateAvatar } = useContext(AuthContext);

  // ── Foto ──────────────────────────────────────────────────
  const inputFotoRef = useRef();
  const [loadingFoto, setLoadingFoto] = useState(false);
  const [fotoError, setFotoError] = useState("");

  const fotoPerfil = usuario?.foto_perfil
    ? `${API}${usuario.foto_perfil}`
    : DEFAULT_AVATAR;

  const handleClickFoto = () => inputFotoRef.current.click();

  const handleCambioFoto = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setFotoError("La imagen no puede superar 5MB");
      return;
    }
    setFotoError("");
    setLoadingFoto(true);
    try {
      const resultado = await subirFotoPerfil(file, token);
      updateAvatar(resultado.foto_perfil);
    } catch {
      setFotoError("No se pudo subir la imagen");
    } finally {
      setLoadingFoto(false);
      e.target.value = "";
    }
  };

  // ── Contraseña ────────────────────────────────────────────
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ actual: "", nueva: "", confirmar: "" });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(false);

  // ── Estado cuenta ─────────────────────────────────────────
  const [activo, setActivo] = useState(true);

  const validate = () => {
    const e = {};
    if (!form.actual) e.actual = "Ingresa tu contraseña actual.";
    if (form.nueva.length < 6) e.nueva = "Mínimo 6 caracteres.";
    if (form.nueva !== form.confirmar) e.confirmar = "Las contraseñas no coinciden.";
    return e;
  };

  const handleSubmit = async () => {
    const e = validate();
    if (Object.keys(e).length) return setErrors(e);
    setErrors({});
    setApiError("");
    setLoading(true);
    try {
      await cambiarContrasena(
        { contrasena_actual: form.actual, nueva_contrasena: form.nueva },
        token
      );
      setSuccess(true);
      setForm({ actual: "", nueva: "", confirmar: "" });
      setTimeout(() => { setSuccess(false); setShowForm(false); }, 2500);
    } catch (err) {
      const msg = err?.response?.data?.body || "Error al cambiar la contraseña. Intenta de nuevo.";
      setApiError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelar = () => {
    setShowForm(false);
    setErrors({});
    setApiError("");
    setForm({ actual: "", nueva: "", confirmar: "" });
  };

  const nombreCompleto = usuario?.primer_nombre
    ? `${usuario.primer_nombre} ${usuario.primer_apellido}`
    : "Usuario";

  const rolLabel =
    usuario?.tipo_de_rol === "Administrador"
      ? "Administrador · Activo"
      : "Funcionario · Activo";

  return (
    <>
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" />

      <div className="perfil-wrapper">
        <div className="card-perfil text-center">

          {/* ── Header ── */}
          <div className="bienvenido-tag"> Panel de usuario</div>
          <h1 className="titulo-bienvenido">¡Bienvenido!</h1>
          <p className="subtitulo">Gestiona tu cuenta desde aquí</p>

          {/* ── Foto ── */}
          <div
            className="avatar-ring mx-auto"
            onClick={handleClickFoto}
            title="Cambiar foto de perfil"
            style={{ cursor: "pointer" }}
          >
            <img
              src={fotoPerfil}
              alt="Avatar de usuario"
              style={{ opacity: loadingFoto ? 0.5 : 1, transition: "opacity 0.2s" }}
              onError={(e) => { e.target.src = DEFAULT_AVATAR; }}
            />
            <div className="avatar-overlay">
              {loadingFoto ? (
                <span style={{ color: "#fff", fontSize: "0.7rem", fontWeight: 600 }}>...</span>
              ) : (
                <svg width="22" height="22" fill="none" stroke="#fff" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M15.232 5.232l3.536 3.536M9 13l6.364-6.364a2 2 0 012.828 2.828L11.828 15.828A2 2 0 0110 16H8v-2a2 2 0 01.586-1.414z"/>
                </svg>
              )}
            </div>
          </div>

          <input ref={inputFotoRef} type="file" accept="image/jpeg,image/png,image/webp" onChange={handleCambioFoto} hidden />
          {fotoError && <div className="error-text mt-1">{fotoError}</div>}

          <div className="nombre-usuario mt-2">{nombreCompleto}</div>
          <div className="rol-usuario">{rolLabel}</div>

          <hr className="divider" />

          {/* ── Switch noti ── */}
          <div className="switch-row">
            <div className="switch-info">
              <span className="switch-label">Notificaciones</span>
              <span className={`switch-badge ${activo ? "badge-activo" : "badge-inactivo"}`}>
                {activo ? "Activo" : "Inactivo"}
              </span>
            </div>
            <div className="switch-control">
              <span className="switch-action-text">
                {activo ? "Desactivar" : "Activar"}
              </span>
              <button
                className={`toggle-switch ${activo ? "toggle-on" : "toggle-off"}`}
                onClick={() => setActivo(!activo)}
                aria-label="Cambiar estado de cuenta"
              >
                <span className="toggle-thumb" />
              </button>
            </div>
          </div>

          <hr className="divider" />

          {/* ── Cambiar contraseña ── */}
          {!showForm && (
            <button className="btn-cambiar" onClick={() => setShowForm(true)}>
               Cambiar contraseña
            </button>
          )}

          {showForm && (
            <div className="form-panel text-start">
              {success ? (
                <div className="success-pill mb-3">
                  <span className="glow-dot" />
                  Contraseña actualizada con éxito
                </div>
              ) : (
                <>
                  {apiError && <div className="error-text mb-3 text-center">{apiError}</div>}

                  {[
                    { key: "actual",    label: "Contraseña actual",    placeholder: "••••••••" },
                    { key: "nueva",     label: "Nueva contraseña",     placeholder: "Mínimo 6 caracteres" },
                    { key: "confirmar", label: "Confirmar contraseña", placeholder: "Repite la contraseña" },
                  ].map(({ key, label, placeholder }) => (
                    <div className="mb-3" key={key}>
                      <div className="form-label-custom">{label}</div>
                      <input
                        type="password"
                        className="form-control input-custom"
                        placeholder={placeholder}
                        value={form[key]}
                        onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                        disabled={loading}
                      />
                      {errors[key] && <div className="error-text">{errors[key]}</div>}
                    </div>
                  ))}

                  <div className="d-flex gap-2 mt-3">
                    <button className="btn-guardar" onClick={handleSubmit} disabled={loading}>
                      {loading ? "Cambiando..." : "Cambiar"}
                    </button>
                    <button className="btn-cancelar" onClick={handleCancelar} disabled={loading}>
                      Cancelar
                    </button>
                  </div>
                </>
              )}
            </div>
          )}

        </div>
      </div>
    </>
  );
}