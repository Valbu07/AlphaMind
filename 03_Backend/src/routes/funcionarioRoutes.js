const express = require("express");
const router = express.Router();
const controlador = require("../controllers/funcionarioController");
const {
  verificarToken,
  autorizaciondeRoles,
} = require("../middlewares/authMiddleware");
const respuesta = require("../utils/repuesta");

router.get( "/",verificarToken, autorizaciondeRoles(["Administrador"]),
  async (req, res) => {
    try {
      const data = await controlador.todos();
      respuesta.success(req, res, data, 200);
    } catch (error) {
      respuesta.error(req, res, "Error al obtener los funcionarios", 500);
    }
  }
);

//  funcionario por documento
router.get(
  "/:num_documento", verificarToken, autorizaciondeRoles(["Administrador"]),
  async (req, res) => {
    try {
      const data = await controlador.uno(req.params.num_documento);
      respuesta.success(req, res, data, 200);
    } catch (error) {
      respuesta.error(req, res, "No existe el funcionario", 500);
    }
  }
);

//Funcionario y cargo

router.get(  "/cargo/todos", verificarToken, autorizaciondeRoles(["Funcionario", "Administrador"]),
  async (req, res) => {
    try {
      const data = await controlador.cargo();
      respuesta.success(req, res, data, 200);
    } catch (error) {
      respuesta.error(
        req,
        res,
        "Error al obtener el funcionario y su Cargo",
        500
      );
    }
  }
);

/*****************/ // Agregar Funcionario con su Usuario//**************** */

router.post("/agregar",
  // verificarToken,  autorizaciondeRoles([ "Administrador"]),

  async (req, res) => {
    try {
      const data = await controlador.agregar(req.body);
      respuesta.success(req, res, data, 200);
    } catch (error) {
      respuesta.error(req, res, "Error al crear Funcionario", 500);
      console.error(error);
    }
  }
);

// Actualizar o editar

router.put("/actualizar/:num_documento", verificarToken, autorizaciondeRoles(["Administrador"]),verificarToken, autorizaciondeRoles(["Administrador"]),
  async (req, res) => {
    try {
      const data = {
        usuario: req.body.usuario, // lo khe mandamos en el post
        funcionario: {
          ...req.body.funcionario, // lo khe mandamos en el postmman
          num_documento: req.params.num_documento, // se usa el num_documento de la URL
        },
      };

      const result = await controlador.actualizar(data);
      respuesta.success(req, res, result, 200);
    } catch (error) {
      console.error("Error al actualizar", error);
      respuesta.error(req, res, "Error al actualizar Funcionario", 500);
    }
  }
);

// eliminar funcionario por documento
router.delete( "/:num_documento", verificarToken, autorizaciondeRoles(["Administrador"]),
  async (req, res) => {
    try {
      const data = await controlador.eliminar(req.params.num_documento);
      respuesta.success(req, res, data, 200);
    } catch (error) {
      console.error("Error en DELETE /:num_documento:", error);
      respuesta.error(req, res, "Error al eliminar el funcionario", 500);
    }
  }
);

module.exports = router;
