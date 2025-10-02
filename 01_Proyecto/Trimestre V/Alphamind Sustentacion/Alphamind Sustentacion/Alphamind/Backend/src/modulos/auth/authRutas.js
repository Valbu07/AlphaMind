const express = require('express');
const router = express.Router();
const respuesta = require('../../red/respuestas');
const controlador = require('./authControlador');

router.post('/login', async (req, res) => {
  try {
  
    const { funcionario, usuario } = req.body; //tomamos los dos elementos y los guardamos 
    const token = await controlador.login( //segun el controlador miramos si esta bien o mal 
      funcionario.num_documento,  // parametros khe vamos a pasar
      usuario.contraseña         
    );
    respuesta.success(req, res, token, 200); // si fue exitosa mandamos el token 

  } catch (error) {
    console.log("Error en login:", error);
    respuesta.error(req, res, 'Error con las credenciales', 500);
  }
});


module.exports = router;
