import axios from 'axios';

const API_URL = 'http://localhost:3000/chat'; 

const chatService = {
  // Obtener todos los usuarios
  async obtenerTodosLosUsuarios() {
    try {
      const response = await axios.get(`${API_URL}/usuarios`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener usuarios:', error);
      throw error;
    }
  },

  // Obtener mensajes entre dos usuarios
  async obtenerMensajes(usuario1Id, usuario2Id) {
    try {
      const response = await axios.get(`${API_URL}/mensajes/${usuario1Id}/${usuario2Id}`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener mensajes:', error);
      throw error;
    }
  },

  // Enviar un mensaje
  async enviarMensaje(remitenteId, destinatarioId, texto) {
    try {
      const response = await axios.post(`${API_URL}/mensajes`, {
        remitente_id: remitenteId,
        destinatario_id: destinatarioId,
        texto: texto
      });
      return response.data;
    } catch (error) {
      console.error('Error al enviar mensaje:', error);
      throw error;
    }
  }
};

export default chatService;