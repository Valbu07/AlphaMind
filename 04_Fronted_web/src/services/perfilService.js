import axios from "axios";

const API = import.meta.env.VITE_API_URL || "http://localhost:3000";

export const subirFotoPerfil = async (file, token) => {
  const formData = new FormData();
  formData.append("foto", file);

  const { data } = await axios.post(`${API}/foto-perfil`, formData, {
    headers: {
      Authorization: token, // ya viene con "Bearer ..." desde el login
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