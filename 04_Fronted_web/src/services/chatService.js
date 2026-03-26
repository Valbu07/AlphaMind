import axios from 'axios';

const API_URL = `${import.meta.env.VITE_API_URL}/chat`;

// ✅ limpia "Bearer" duplicado si ya viene incluido en el token guardado
const getCleanToken = () => {
  const token = localStorage.getItem('token');
  return token?.replace('Bearer ', '') || '';
};

const getAuthHeaders = () => {
  return {
    headers: {
      Authorization: `Bearer ${getCleanToken()}`
    }
  };
};

const chatService = {

  async obtenerTodosLosUsuarios() {
    try {
      const response = await axios.get(`${API_URL}/usuarios`, getAuthHeaders());
      return response.data;
    } catch (error) {
      console.error('Error al obtener usuarios:', error);
      throw error;
    }
  },

  async obtenerMensajes(usuario1Id, usuario2Id) {
    try {
      const response = await axios.get(
        `${API_URL}/mensajes/${usuario1Id}/${usuario2Id}`,
        getAuthHeaders()
      );
      return response.data;
    } catch (error) {
      console.error('Error al obtener mensajes:', error);
      throw error;
    }
  },

  async enviarMensaje(remitenteId, destinatarioId, texto, archivo = null) {
    try {
      if (archivo) {
        const formData = new FormData();
        formData.append("archivo", archivo);
        formData.append("remitente_id", remitenteId);
        formData.append("destinatario_id", destinatarioId);

        await axios.post(
          `${API_URL}/enviar-archivo`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${getCleanToken()}`,
              "Content-Type": "multipart/form-data"
            }
          }
        );
      }

      if (texto && texto.trim()) {
        const response = await axios.post(
          `${API_URL}/mensajes`,
          {
            remitente_id: remitenteId,
            destinatario_id: destinatarioId,
            texto: texto
          },
          getAuthHeaders()
        );
        return response.data;
      }

      return { success: true };

    } catch (error) {
      console.error('Error al enviar mensaje:', error);
      throw error;
    }
  },

  async eliminarMensaje(mensajeId) {
    try {
      const response = await axios.delete(
        `${API_URL}/mensajes/${mensajeId}`,
        {
          headers: {
            Authorization: `Bearer ${getCleanToken()}`
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error al eliminar mensaje:', error);
      throw error;
    }
  }

};

export default chatService;