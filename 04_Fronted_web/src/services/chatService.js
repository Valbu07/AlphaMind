import axios from 'axios';

const API_URL = 'http://localhost:3000/chat';

// Headers con token
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');

  return {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
};

const chatService = {

  async obtenerTodosLosUsuarios() {
    try {
      const response = await axios.get(
        `${API_URL}/usuarios`,
        getAuthHeaders()
      );
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

    const token = localStorage.getItem('token');

    try {

      // =========================
      // SI HAY ARCHIVO
      // =========================
      if (archivo) {

        const formData = new FormData();
        formData.append("archivo", archivo);
        formData.append("remitente_id", remitenteId);
        formData.append("destinatario_id", destinatarioId);

        const response = await axios.post(
          `${API_URL}/enviar-archivo`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data"
            }
          }
        );

        return response.data;
      }

      // =========================
      // SOLO MENSAJE DE TEXTO
      // =========================
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

    } catch (error) {
      console.error('Error al enviar mensaje:', error);
      throw error;
    }

  },

  async eliminarMensaje(mensajeId) {
    try {
      const response = await axios.delete(
        `${API_URL}/mensajes/${mensajeId}`,
        getAuthHeaders()
      );
      return response.data;
    } catch (error) {
      console.error('Error al eliminar mensaje:', error);
      throw error;
    }
  }
};

export default chatService;