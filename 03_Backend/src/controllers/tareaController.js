const db = require('../models/tarea.model.js'); 
const table = 'actividad';


function todas() {
    return db.todas(table);
}

function tareasPorFuncionario(num_documento) {
    return db.tareasPorFuncionario( num_documento);
}

function eliminarTarea (id_actividad) {
    return db.eliminarTarea( id_actividad);
}

function crearTarea (data) {
    return db.crearTarea(data);
}

function editarTarea ( body, id_actividad) {
    return db.editarTarea(body, id_actividad);
}


module.exports = {
    todas,
    tareasPorFuncionario,
    eliminarTarea,
    crearTarea,    
    editarTarea,
}
