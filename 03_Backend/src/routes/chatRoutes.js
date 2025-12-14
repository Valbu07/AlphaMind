const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');

// Rutas del chat
router.get('/usuarios', chatController.obtenerUsuarios);
router.get('/mensajes/:usuario1/:usuario2', chatController.obtenerMensajes);
router.post('/mensajes', chatController.enviarMensaje);
router.get('/ultimo-mensaje/:usuario1/:usuario2', chatController.obtenerUltimoMensaje);

module.exports = router;