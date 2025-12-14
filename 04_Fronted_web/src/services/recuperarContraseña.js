// services/funcionarioService.js

// URL base de tu API
const API_URL = 'http://localhost:3000/recuperar';
export const recuperarContrasena = async (numDocumento) => {
  console.log('📤 Enviando petición a:', `${API_URL}/contraseña`);
  console.log('📦 Con datos:', { num_documento: numDocumento });
  
  try {
    const response = await fetch(`${API_URL}/contraseña`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ num_documento: numDocumento }),
    });

    console.log('📥 Status:', response.status);
    console.log('📥 Headers:', response.headers.get('content-type'));

    const data = await response.json();
    console.log('📥 Respuesta:', data);

    if (!response.ok) {
      throw new Error(data.body || 'Error al procesar la solicitud');
    }

    return data;
  } catch (error) {
    console.error('❌ Error completo:', error);
    throw error;
  }
};