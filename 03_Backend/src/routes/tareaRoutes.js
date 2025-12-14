const express = require('express');
const router = express.Router();
const controlador = require('../controllers/tareaController');
const respuesta = require("../utils/repuesta");

router.get('/', async (req, res) => {
    try {
        const data = await controlador.todas();
        respuesta.success(req, res, data, 200);
    } catch (error) {
        console.error('Error al obtener las tareas', error);
        respuesta.error(req, res, 'Error al obtener las tareas', 500);
    }
});

router.get('/asignadas-a-mi/:id_usuario', async (req, res) => {
    try {
        const data = await controlador.tareasAsignadasAMi(req.params.id_usuario);
        respuesta.success(req, res, data, 200);
    } catch (error) {
        console.error('Error al obtener tareas asignadas', error);
        respuesta.error(req, res, 'Error al obtener las tareas asignadas', 500);
    }
});

router.post('/crearTarea', async (req, res) => {
    try {
        const data = await controlador.crearTarea(req.body);
        respuesta.success(req, res, data, 200);
    } catch (error) {
        console.error('Error al Ingresar', error);
        respuesta.error(req, res, 'Error al crear la actividad', 500);
    }
});

router.put('/editarTarea/:id_actividad', async (req, res) => {
    try {
        const data = await controlador.editarTarea(req.body, req.params.id_actividad);
        respuesta.success(req, res, data, 200);
    } catch (error) {
        console.error('Error al editar Tarea', error);
        respuesta.error(req, res, 'Error al editar actividad', 500);
    }
});

router.put('/completar/:id_actividad', async (req, res) => {
    try {
        const data = await controlador.completarActividad(req.params.id_actividad);
        respuesta.success(req, res, data, 200);
    } catch (error) {
        console.error('Error al completar actividad', error);
        respuesta.error(req, res, 'Error al completar actividad', 500);
    }
});

router.delete('/:id_actividad', async (req, res) => {
    try {
        const data = await controlador.eliminarTarea(req.params.id_actividad);
        respuesta.success(req, res, data, 200);
    } catch (error) {
        respuesta.error(req, res, "La actividad no existe", 500);
    }
});

router.get('/:num_documento', async (req, res) => {
    try {
        const data = await controlador.tareasPorFuncionario(req.params.num_documento);
        respuesta.success(req, res, data, 200);
    } catch (error) {
        respuesta.error(req, res, 'Error al obtener las tareas del funcionario', 500);
    }
});

module.exports = router;