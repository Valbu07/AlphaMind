// src/services/reportesServices.js
import axios from "axios";

const API = `${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/reportes`;



const getToken = () => {
  const token = localStorage.getItem('token');
  if (!token) throw new Error("No hay sesión activa. Inicia sesión nuevamente.");
  return token;
};

const estructuraVacia = {
  estadisticas: { tareasTotales: 0, completadas: 0, pendientes: 0, atrasadas: 0 },
  graficos: { completadasMes: [], categorias: [], estados: [] },
  funcionario: { primer_nombre: "", primer_apellido: "" }
};

const getReportes = async (num_documento, mes = null) => {
  try {
    const token = getToken();

    // Arma la URL con el query param ?mes= solo si aplica
    const params = mes && mes !== 'todos' ? { mes } : {};

    console.log("[SERVICE] URL:", `${API}/${num_documento}`, "| Mes:", mes || 'todos');

    const res = await axios.get(`${API}/${num_documento}`, {
      headers: { Authorization: token, 'Content-Type': 'application/json' },
      params  // axios serializa esto como ?mes=3 automáticamente
    });

    if (!res.data?.success) {
      throw new Error(res.data?.message || "Error al obtener reportes");
    }

    if (!res.data?.data) {
      console.warn("[SERVICE] Backend respondió exitoso pero sin datos");
      return estructuraVacia;
    }

    return res.data.data;

  } catch (error) {
    console.error("[SERVICE] Error:", error.response?.status, error.message);

    if (error.response?.status === 500) return estructuraVacia;
    if (error.response?.status === 401) throw new Error("Sesión expirada. Inicia sesión nuevamente.");
    if (error.response?.status === 404) throw new Error("No se encontró información para este usuario.");
    if (error.code === 'ERR_NETWORK')   throw new Error("No se pudo conectar con el servidor.");

    throw new Error(error.response?.data?.message || error.message || "Error al cargar reportes");
  }
};

const obtenerFuncionarios = async () => {
  try {
    const token = getToken();

    const res = await axios.get(`${API}/funcionarios`, {
      headers: { Authorization: token, 'Content-Type': 'application/json' }
    });

    if (!res.data?.success) {
      throw new Error(res.data?.message || "Error al obtener funcionarios");
    }

    return res.data.data || [];

  } catch (error) {
    if (error.response?.status === 401) throw new Error("Sesión expirada.");
    if (error.code === 'ERR_NETWORK')   throw new Error("No se pudo conectar con el servidor.");

    throw new Error(error.response?.data?.message || error.message || "Error al obtener funcionarios");
  }
};

export { getReportes, obtenerFuncionarios };