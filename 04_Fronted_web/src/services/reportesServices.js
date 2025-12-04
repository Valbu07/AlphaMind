import axios from "axios";

const API = "http://localhost:3000/reportes";

const getHeaders = (token) => ({
  Authorization: token, // ✅ YA no se duplica Bearer
  "Content-Type": "application/json",
});

export const getReportes = async (num_documento, token) => {
  try {
    console.log("📡 [SERVICE] Iniciando petición...");
    console.log("   📄 Documento:", num_documento);
    console.log("   🔑 Token:", token);
    console.log("   🌐 URL:", `${API}/${num_documento}`);

    if (!token) {
      throw new Error("Token no disponible");
    }

    const res = await axios.get(`${API}/${num_documento}`, {
      headers: getHeaders(token),
    });

    console.log("✅ [SERVICE] Respuesta recibida:", res.status);
    console.log("   📦 Data completa:", res.data);

    // ✅ CASO 1: Si el backend responde vacío pero exitoso
    if (res.data?.success && !res.data?.data) {
      console.warn("⚠️ [SERVICE] Backend respondió exitoso pero sin datos");
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
        }
      };
    }

    // ✅ Validación normal
    if (!res.data?.success) {
      throw new Error(res.data?.message || "Error al obtener reportes");
    }

    return res.data.data;

  } catch (error) {
    console.error("❌ [SERVICE] Error capturado:");
    console.error("   Status:", error.response?.status);
    console.error("   Data:", error.response?.data);
    console.error("   Message:", error.message);
    console.error("   Full error:", error);

    // ✅ CASO 2: Si el backend tiene error interno (500)
    if (error.response?.status === 500) {
      const rawMsg = error.response?.data?.message || 
                     error.response?.data?.error ||
                     error.response?.data?.body ||
                     error.response?.data;
      
      // Convertir a string si no lo es
      const backendMsg = typeof rawMsg === 'string' 
        ? rawMsg 
        : JSON.stringify(rawMsg);
      
      console.error("🔥 [SERVICE] Error 500 del backend:");
      console.error("   Raw:", rawMsg);
      console.error("   Tipo:", typeof rawMsg);
      console.error("   Mensaje:", backendMsg);
      console.error("⚠️ [SERVICE] El backend está fallando. Revisa la consola del servidor.");
      
      // ✅ TEMPORAL: Retornar datos vacíos mientras se arregla el backend
      console.log("📭 [SERVICE] Retornando datos vacíos por error del backend");
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
        }
      };
      
      // Comentado para no bloquear la app:
      // throw new Error(`Error del servidor: ${backendMsg}`);
    }

    // ✅ Error de autenticación
    if (error.response?.status === 401) {
      throw new Error("Sesión expirada. Por favor inicia sesión nuevamente.");
    }

    // ✅ Error de conexión
    if (error.code === 'ERR_NETWORK' || error.message.includes('Network Error')) {
      throw new Error("No se pudo conectar con el servidor. Verifica que el backend esté corriendo en http://localhost:3000");
    }

    // ✅ Error genérico
    throw new Error(
      error.response?.data?.message ||
      error.message ||
      "No se pudieron cargar los reportes"
    );
  }
};
