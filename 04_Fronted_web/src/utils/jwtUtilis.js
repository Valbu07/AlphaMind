// src/utils/jwtUtils.js

/**
 * Decodifica un token JWT sin verificar la firma
 * @param {string} token - Token JWT a decodificar
 * @returns {object|null} - Payload del token o null si es inválido
 */
export const decodeToken = (token) => {
  try {
    if (!token) {
      console.warn('⚠️ [jwtUtils] No hay token para decodificar');
      return null;
    }
    
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    
    const decoded = JSON.parse(jsonPayload);
    console.log('✅ [jwtUtils] Token decodificado:', decoded);
    return decoded;
  } catch (error) {
    console.error('❌ [jwtUtils] Error al decodificar token:', error);
    return null;
  }
};

/**
 * Obtiene el número de documento del usuario desde el token
 * @returns {string|null} - Número de documento o null
 */
export const getNumDocumentoFromToken = () => {
  const token = localStorage.getItem('token');
  
  console.log('🔍 [jwtUtils] Buscando token en localStorage...');
  
  if (!token) {
    console.error('❌ [jwtUtils] No hay token en localStorage');
    return null;
  }
  
  console.log('✅ [jwtUtils] Token encontrado:', token.substring(0, 20) + '...');
  
  const decoded = decodeToken(token);
  
  if (!decoded) {
    console.error('❌ [jwtUtils] No se pudo decodificar el token');
    return null;
  }
  
  // Buscar el num_documento en diferentes posibles ubicaciones
  const numDocumento = decoded.num_documento || 
                       decoded.numDocumento || 
                       decoded.documento ||
                       decoded.funcionario?.num_documento;
  
  console.log('📄 [jwtUtils] Número de documento extraído:', numDocumento);
  
  return numDocumento || null;
};

/**
 * Verifica si el token ha expirado
 * @returns {boolean} - true si expiró, false si aún es válido
 */
export const isTokenExpired = () => {
  const token = localStorage.getItem('token');
  if (!token) return true;
  
  const decoded = decodeToken(token);
  if (!decoded || !decoded.exp) return true;
  
  const isExpired = decoded.exp * 1000 < Date.now();
  console.log(`🕐 [jwtUtils] Token ${isExpired ? 'expirado' : 'válido'}`);
  
  return isExpired;
};