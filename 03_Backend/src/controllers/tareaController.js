const db = require('../models/tarea.model.js'); 
const table = 'actividad';

function todas() {
    return db.todas(table);
}

function tareasPorFuncionario(num_documento) {
    return db.tareasPorFuncionario(num_documento);
}

function tareasAsignadasAMi(id_usuario) {
    return db.tareasAsignadasAMi(id_usuario);
}

function eliminarTarea(id_actividad) {
    return db.eliminarTarea(id_actividad);
}

function crearTarea(data) {
    return db.crearTarea(data);
}

function editarTarea(body, id_actividad) {
    return db.editarTarea(body, id_actividad);
}

function completarActividad(id_actividad) {
    return db.completarActividad(id_actividad);
}

module.exports = {
    todas,
    tareasPorFuncionario,
    tareasAsignadasAMi,
    eliminarTarea,
    crearTarea,    
    editarTarea,
    completarActividad  
}