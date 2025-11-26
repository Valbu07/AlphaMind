const model = require("../models/reportes.model");

// Controlador principal de reporte por usuario
async function funcionario(num_documento) {

  
  const data = await model.funcionario(num_documento);
  if (!data) {
    throw new Error("No existe información para este usuario");
  }

  return data;
}

module.exports = {
 funcionario,
};
