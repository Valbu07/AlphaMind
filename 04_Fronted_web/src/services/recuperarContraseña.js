// URL base de tu API
const API = `${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/recuperar`;



export const recuperarContrasena = async (numDocumento) => {
  console.log(' Enviando petición a:', `${API_URL}/contrasena`);
  console.log(' Con datos:', { num_documento: numDocumento });
  
  try {
    const response = await fetch(`${API_URL}/contrasena`, {  // ← SIN Ñ
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ num_documento: numDocumento }),
    });

    console.log(' Status:', response.status);
    console.log(' Content-Type:', response.headers.get('content-type'));

    // Lee primero como texto
    const responseText = await response.text();
    console.log('Respuesta raw:', responseText);

    // Intenta parsear JSON
    let data;
    try {
      data = JSON.parse(responseText);
      console.log(' Respuesta parseada:', data);
    } catch (parseError) {
      console.error(' Error parseando JSON:', parseError);
      console.error(' Contenido recibido:', responseText);
      throw new Error('El servidor no devolvió un JSON válido');
    }

    // Verifica si fue exitoso
    if (!response.ok) {
      throw new Error(data.body?.mensaje || data.mensaje || 'Error al procesar la solicitud');
    }

    return data;
    
  } catch (error) {
    console.error('Error completo:', error);
    
    if (error.message.includes('Failed to fetch')) {
      throw new Error('No se puede conectar con el servidor. Verifica que esté ejecutándose en http://localhost:3000');
    }
    
    throw error;
  }
};