// hooks/useAvatar.js
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const API = import.meta.env.VITE_API_URL || "http://localhost:3000";
const DEFAULT_AVATAR = "/default-avatar.png";

export function useAvatar() {
  const { usuario } = useContext(AuthContext);

  const fotoUrl = usuario?.foto_perfil
    ? `${API}${usuario.foto_perfil}`
    : DEFAULT_AVATAR;

  return { fotoUrl, usuario };
}