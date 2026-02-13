// src/services/reportesServices.js
import axios from "axios";

const API = "http://localhost:3000/reportes";

const getReportes = async (num_documento) => {
  try {
    // Obtener token de localStorage
    const token = localStorage.getItem('token');
    
    if (!token) {
      throw new Error("No hay sesión activa. Inicia sesión nuevamente.");
    }

    console.log("  Token:", token.substring(0, 20) + '...');
    console.log("  URL:", `${API}/${num_documento}`);

    const res = await axios.get(`${API}/${num_documento}`, {
      headers: {
        'Authorization': token, 
        'Content-Type': 'application/json'
      }
    });

    // Validar respuesta
    if (!res.data?.success) {
      throw new Error(res.data?.message || "Error al obtener reportes");
    }

    // Si no hay datos, retornar estructura vacía
    if (!res.data?.data) {
      console.warn(" [SERVICE] Backend respondió exitoso pero sin datos");
      return {
        estadisticas: {
          tareasTotales: 0,
          completadas: 0,
          pendientes: 0,
          atrasadas: 0
        },
        graficos: {
          completadasMes: [],
          categorias: [],
          estados: []
        },
        funcionario: {
          primer_nombre: "",
          primer_apellido: ""
        }
      };
    }

    return res.data.data;

  } catch (error) {
    console.error("[SERVICE] Error capturado:");
    console.error("   Status:", error.response?.status);
    console.error("   Message:", error.message);

    // Error 500 del backend
    if (error.response?.status === 500) {
      console.error(" [SERVICE] Error 500 del backend - Revisa la consola del servidor");
      
      // Retornar datos vacíos temporalmente
      return {
        estadisticas: {
          tareasTotales: 0,
          completadas: 0,
          pendientes: 0,
          atrasadas: 0
        },
        graficos: {
          completadasMes: [],
          categorias: [],
          estados: []
        },
        funcionario: {
          primer_nombre: "",
          primer_apellido: ""
        }
      };
    }

    // Error 401
    if (error.response?.status === 401) {
      throw new Error("Sesión expirada. Inicia sesión nuevamente.");
    }

    // Error 404
    if (error.response?.status === 404) {
      throw new Error("No se encontró información para este usuario");
    }

    // Error de red
    if (error.code === 'ERR_NETWORK') {
      throw new Error("No se pudo conectar con el servidor. Verifica que esté corriendo.");
    }

    // Error genérico
    throw new Error(
      error.response?.data?.message ||
      error.message ||
      "Error al cargar reportes"
    );
  }
};

const obtenerFuncionarios = async () => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("No hay sesión activa.");
    }

    const res = await axios.get(`${API}/funcionarios`, {
      headers: {
        Authorization: token,
        "Content-Type": "application/json"
      }
    });

    console.log("📥 Respuesta recibida:", res.data);

    if (!res.data?.success) {
      throw new Error(res.data?.message || "Error al obtener funcionarios");
    }

    return res.data.data || [];

  } catch (error) {


    if (error.response?.status === 401) {
      throw new Error("Sesión expirada.");
    }

    if (error.code === "ERR_NETWORK") {
      throw new Error("No se pudo conectar con el servidor.");
    }

    throw new Error(
      error.response?.data?.message ||
      error.message ||
      "Error al obtener funcionarios"
    );
  }
};


export { getReportes, obtenerFuncionarios };