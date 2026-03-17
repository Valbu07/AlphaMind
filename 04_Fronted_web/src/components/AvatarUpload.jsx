import { useRef, useState, useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { subirFotoPerfil, eliminarFotoPerfil } from "../services/perfilService";
import { BsCameraFill } from "react-icons/bs";

const API = import.meta.env.VITE_API_URL || "http://localhost:3000"; // 
const DEFAULT_AVATAR = "/default-avatar.png";

export default function AvatarUpload() {
  const { usuario, token, updateAvatar } = useContext(AuthContext);

  const fotoActual = usuario?.foto_perfil
    ? `${API}${usuario.foto_perfil}`
    : DEFAULT_AVATAR;

  const [preview, setPreview] = useState(fotoActual);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const inputRef = useRef();

  
  useEffect(() => {
    if (!loading) {
      setPreview(
        usuario?.foto_perfil ? `${API}${usuario.foto_perfil}` : DEFAULT_AVATAR
      );
    }
  }, [usuario?.foto_perfil]);

  const handleCambio = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setError("La imagen no puede superar 5MB");
      return;
    }

    setError(null);
    setPreview(URL.createObjectURL(file)); // preview inmediato
    setLoading(true);

    try {
      const resultado = await subirFotoPerfil(file, token);
      updateAvatar(resultado.foto_perfil);
    } catch {
      setError("No se pudo subir la imagen, intenta de nuevo");
      setPreview(fotoActual); // revierte al original si falla
    } finally {
      setLoading(false);
    }
  };

  const handleEliminar = async () => {
    if (!window.confirm("¿Eliminar foto de perfil?")) return;
    setLoading(true);
    setError(null);
    try {
      await eliminarFotoPerfil(token);
      updateAvatar(null);
      setPreview(DEFAULT_AVATAR);
    } catch {
      setError("No se pudo eliminar la foto");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: "inline-flex", flexDirection: "column", alignItems: "center", gap: 10 }}>

      <div
        style={{ position: "relative", width: 110, height: 110, cursor: loading ? "not-allowed" : "pointer" }}
        onClick={() => !loading && inputRef.current.click()}
      >
        <img
          src={preview}
          alt="Foto de perfil"
          style={{
            width: 110,
            height: 110,
            borderRadius: "50%",
            objectFit: "cover",
            border: "3px solid #dee2e6",
            opacity: loading ? 0.6 : 1,
            transition: "opacity 0.2s",
          }}
          onError={(e) => { e.target.src = DEFAULT_AVATAR; }}
        />

        {loading && (
          <div style={{
            position: "absolute", inset: 0, borderRadius: "50%",
            background: "rgba(0,0,0,0.5)",
            display: "flex", alignItems: "center",
            justifyContent: "center", color: "#fff", fontSize: 11,
          }}>
            Subiendo...
          </div>
        )}

        {!loading && (
          <div style={{
            position: "absolute", bottom: 4, right: 4,
            background: "#0d6efd", borderRadius: "50%",
            width: 30, height: 30,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <BsCameraFill color="#fff" size={15} />
          </div>
        )}
      </div>

      {usuario?.foto_perfil && !loading && (
        <button
          onClick={handleEliminar}
          disabled={loading}
          style={{
            background: "none", border: "none",
            color: "#dc3545", fontSize: 12, cursor: "pointer",
          }}
        >
          Eliminar foto
        </button>
      )}

      {error && (
        <p style={{ color: "#dc3545", fontSize: 12, margin: 0 }}>{error}</p>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleCambio}
        hidden
      />
    </div>
  );
}