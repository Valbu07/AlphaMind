const express = require('express');
const router = express.Router();
const controlador = require('../controllers/authController');
const respuesta = require("../utils/repuesta");
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

/* SWAGGER */

/**
 * @swagger
 * tags:
 *   name: Autenticación
 *   description: Inicio de sesión y autenticación
 */

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Iniciar sesión en el sistema
 *     tags: [Autenticación]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               funcionario:
 *                 type: object
 *                 properties:
 *                   num_documento:
 *                     type: string
 *                     example: "123456"
 *               usuario:
 *                 type: object
 *                 properties:
 *                   contraseña:
 *                     type: string
 *                     example: "1234"
 *     responses:
 *       200:
 *         description: Login exitoso, retorna token
 *       500:
 *         description: Error con las credenciales
*/


module.exports = router;
