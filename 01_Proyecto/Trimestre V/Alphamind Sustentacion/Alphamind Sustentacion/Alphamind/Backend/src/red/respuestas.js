// Aki las respuestas iran en un solo formato  // Estanderizacion de las respuestas 


exports.success = (req, res, mensaje = '', status = 200) => {
  res.status(status).json({
    error: false,
    status: status,
    body: mensaje
  });
};

exports.error = (req, res, mensaje = 'Error interno', status = 500) => {
  res.status(status).json({
    error: true,
    status: status,
    body: mensaje
  });
};