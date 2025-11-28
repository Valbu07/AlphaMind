// src/services/reportesServices.js
import axios from "axios";

const API = "http://localhost:3000/reportes";


export const getReportes = async (documentoUsuario) => {
  try {

    const res = await axios.get(`${API}/${documentoUsuario}`);
    
    // Mostrar los datos recibidos
    console.log(' Datos recibidos:', res.data);
    
    return res.data;

  } catch (error) {
    console.error(' Error al obtener reportes:', error.message);
    throw new Error('No se pudieron cargar los reportes. Verifica tu conexión.');
  }
};