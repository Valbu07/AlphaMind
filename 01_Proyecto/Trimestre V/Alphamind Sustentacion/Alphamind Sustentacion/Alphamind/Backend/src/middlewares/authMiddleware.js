const jwt = require('jsonwebtoken');
const keys = require('../config').jwt;


function verificarToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    return res.status(403).json({
      success: false,
      message: 'No se proporcionó un token'
    });
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(403).json({
      success: false,
      message: 'Formato de token inválido'
    });
  }

  jwt.verify(token, keys.secret, (err, decoded) => {
    if (err) {
      return res.status(401).json({
        success: false,
        message: 'Token inválido o expirado',
        error: err
      });
    }
    req.usuario = decoded;
    next();
  });
}
function autorizaciondeRoles(rolPermitido) {

  return (req, res, next) => {

    const rolUsuario = req.usuario.rol;
    
    if (!rolPermitido.includes(rolUsuario)) {
      return res.status(403).json({
        success: false,
        message: "Acceso denegado: se requiere el rol de: " + rolPermitido
      });
    }
    
    next();
  };
}

module.exports = {
  verificarToken,
  autorizaciondeRoles
}