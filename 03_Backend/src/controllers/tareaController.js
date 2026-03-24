const db = require('../models/tarea.model.js'); 
const { notifyUser } = require('../utils/sockets'); 

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

async function crearTarea(data) {
    // 1. Guardar en BD 
    const resultado = await db.crearTarea(data);

    // 2. Notificar — usamos resultado.asignado_a que ya nos devuelve el modelo
    notifyUser(resultado.asignado_a, 'nueva_tarea', {
        titulo:      data.tarea.titulo,
        descripcion: data.actividad.descripcion,
        asunto:      data.actividad.asunto,
        prioridad:   data.actividad.prioridad,
        vencimiento: data.actividad.fecha_vencimiento,
        fecha:       new Date().toISOString(),
    });

    return resultado;
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