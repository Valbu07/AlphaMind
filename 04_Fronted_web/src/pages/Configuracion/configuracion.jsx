import { useState } from "react";
import "./configuracion.css"

const avatarUrl =
  "https://www.elespectador.com/resizer/v2/A7TE2XK6CVCK3PWCI3JNE57IAU.jpg?auth=a9724b8a5a79ee80f538fc7bbd232fdb392e4bc7dd867d4910dcd12c2d08dbb8&width=920&height=613&focal=1925,975&quality=60";

export default function PerfilUsuario() {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ actual: "", nueva: "", confirmar: "" });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.actual) e.actual = "Ingresa tu contraseña actual.";
    if (form.nueva.length < 6) e.nueva = "Mínimo 6 caracteres.";
    if (form.nueva !== form.confirmar) e.confirmar = "Las contraseñas no coinciden.";
    return e;
  };

  const handleSubmit = () => {
    const e = validate();
    if (Object.keys(e).length) return setErrors(e);
    setErrors({});
    setSuccess(true);
    setForm({ actual: "", nueva: "", confirmar: "" });
    setTimeout(() => {
      setSuccess(false);
      setShowForm(false);
    }, 2500);
  };

  return (
    <>
      
      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css"
      />

      <div className="perfil-wrapper">
        <div className="card-perfil text-center">

          {/* ── Bienvenido ── */}
          <div className="bienvenido-tag">✦ Panel de usuario</div>
          <h1 className="titulo-bienvenido">¡Bienvenido!</h1>
          <p className="subtitulo">Gestiona tu cuenta desde aquí</p>

          {/* ── Foto de perfil ── */}
          <div className="avatar-ring mx-auto">
            <img src={avatarUrl} alt="Avatar de usuario" />
            <div className="avatar-overlay">
              <svg width="22" height="22" fill="none" stroke="#fff" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M15.232 5.232l3.536 3.536M9 13l6.364-6.364a2 2 0 012.828 2.828L11.828 15.828A2 2 0 0110 16H8v-2a2 2 0 01.586-1.414z"/>
              </svg>
            </div>
          </div>

          <div className="nombre-usuario">Carlos Martínez</div>
          <div className="rol-usuario">Administrador · Activo</div>

          <hr className="divider" />

          {/* ── Botón cambiar contraseña ── */}
          {!showForm && (
            <button className="btn-cambiar" onClick={() => setShowForm(true)}>
               Cambiar contraseña
            </button>
          )}

          {/* ── Formulario ── */}
          {showForm && (
            <div className="form-panel text-start">

              {success ? (
                <div className="success-pill mb-3">
                  <span className="glow-dot" />
                  Contraseña actualizada con éxito
                </div>
              ) : (
                <>
                  {[
                    { key: "actual",    label: "Contraseña actual",   placeholder: "••••••••" },
                    { key: "nueva",     label: "Nueva contraseña",    placeholder: "Mínimo 6 caracteres" },
                    { key: "confirmar", label: "Confirmar contraseña", placeholder: "Repite la contraseña" },
                  ].map(({ key, label, placeholder }) => (
                    <div className="mb-3" key={key}>
                      <div className="form-label-custom">{label}</div>
                      <input
                        type="password"
                        className="form-control input-custom"
                        placeholder={placeholder}
                        value={form[key]}
                        onChange={e => setForm({ ...form, [key]: e.target.value })}
                      />
                      {errors[key] && <div className="error-text">{errors[key]}</div>}
                    </div>
                  ))}

                  <div className="d-flex gap-2 mt-3">
                    <button className="btn-guardar" onClick={handleSubmit}>Guardar</button>
                    <button className="btn-cancelar" onClick={() => { setShowForm(false); setErrors({}); }}>
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