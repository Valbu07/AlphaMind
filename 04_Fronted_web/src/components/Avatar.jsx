// components/Avatar.jsx
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const API = import.meta.env.VITE_API_URL || "http://localhost:3000";
const DEFAULT_AVATAR = "/default-avatar.png";

export default function Avatar({ size = 40, className = "", src: srcProp, useLoggedUser = false }) {
  const { usuario } = useContext(AuthContext);

  let src;

  if (srcProp) {
    // Tiene foto propia 
    src = `${API}${srcProp}`;
  } else if (useLoggedUser && usuario?.foto_perfil) {
    // Explícitamente pide el usuario logueado (Navbar, perfil)
    src = `${API}${usuario.foto_perfil}`;
  } else {
    // Sin foto → avatar por defecto
    src = DEFAULT_AVATAR;
  }

  return (
    <img
      src={src}
      alt="Avatar"
      className={className}
      style={{ width: size, height: size, borderRadius: "50%", objectFit: "cover" }}
      onError={(e) => { e.target.src = DEFAULT_AVATAR; }}
    />
  );
}