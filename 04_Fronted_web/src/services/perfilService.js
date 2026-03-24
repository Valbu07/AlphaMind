import axios from "axios";

const API = import.meta.env.VITE_API_URL || "http://localhost:3000";

// ── Foto de perfil ──────────────────────────────────────────
export const subirFotoPerfil = async (file, token) => {
  const formData = new FormData();
  formData.append("foto", file);

  const { data } = await axios.post(`${API}/foto-perfil`, formData, {
    headers: {
      Authorization: token,
      "Content-Type": "multipart/form-data",
    },
  });

  return data.body;
};

export const eliminarFotoPerfil = async (token) => {
  const { data } = await axios.delete(`${API}/foto-perfil`, {
    headers: { Authorization: token },
  });
  return data.body;
};

// ── Contraseña propia ────────────────────────────────────────
export const cambiarContrasena = async ({ contrasena_actual, nueva_contrasena }, token) => {
  const { data } = await axios.put(
    `${API}/perfil/cambiar-contrasena`,
    { contrasena_actual, nueva_contrasena },
    { headers: { Authorization: token } }
  );
  return data;
};

// ── Contraseña de otro usuario (solo Admin) ──────────────────
export const cambiarContrasenaAdmin = async ({ id_usuario_objetivo, nueva_contrasena }, token) => {
  const { data } = await axios.put(
    `${API}/perfil/cambiar-contrasena-admin`,
    { id_usuario_objetivo, nueva_contrasena },
    { headers: { Authorization: token } }
  );
  return data;
};