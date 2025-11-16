const db = require('../models/funcionario.model'); 
const table = 'funcionario';
const tableCargo = 'cargo'



function todos () {
    return db.todos(table);
}

function cargo(){
    return db.cargo(table, tableCargo);
}

function uno (num_documento) {
    return db.uno(table, num_documento);
}

function eliminar (num_documento) {
    return db.eliminar(num_documento);
}

function agregar (body) {
    return db.agregar(body);
}

function actualizar ( data) {
    return db.actualizar(data);
}


module.exports = {
    todos,
    uno,
    eliminar,
    agregar,    
    actualizar,
    cargo,
}
