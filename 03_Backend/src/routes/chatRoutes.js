const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const upload = require('../config/multer');
const { verificarToken } = require('../middlewares/authMiddleware');

router.get('/usuarios', chatController.obtenerUsuarios);
router.get('/mensajes/:usuario1/:usuario2', chatController.obtenerMensajes);
router.post('/mensajes', chatController.enviarMensaje);
router.delete('/mensajes/:id', verificarToken, chatController.eliminarMensaje); 
router.get('/ultimo-mensaje/:usuario1/:usuario2', chatController.obtenerUltimoMensaje);
router.post('/enviar-archivo', upload.single('archivo'), chatController.enviarArchivo);

module.exports = router;