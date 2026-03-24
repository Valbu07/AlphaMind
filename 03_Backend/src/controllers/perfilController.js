const bcrypt = require("bcryptjs");
const conexion = require("../config/db");

// ============================
// CAMBIAR CONTRASEÑA (propia)
// ============================
async function cambiarContrasena(req, res) {
  const id_usuario = req.usuario.id_usuario;
  const { contrasena_actual, nueva_contrasena } = req.body;

  if (!contrasena_actual || !nueva_contrasena) {
    return res.status(400).json({
      error: true,
      body: "Todos los campos son requeridos",
    });
  }

  if (nueva_contrasena.length < 6) {
    return res.status(400).json({
      error: true,
      body: "La nueva contraseña debe tener mínimo 6 caracteres",
    });
  }

  try {
    // Obtener contraseña actual del usuario
    const sql = "SELECT contraseña FROM usuario WHERE id_usuario = ?";
    conexion.query(sql, [id_usuario], async (err, resultado) => {
      if (err) {
        console.error("Error al buscar usuario:", err);
        return res.status(500).json({ error: true, body: "Error del servidor" });
      }

      if (resultado.length === 0) {
        return res.status(404).json({ error: true, body: "Usuario no encontrado" });
      }

      const hash = resultado[0].contraseña;
      const esValida = await bcrypt.compare(contrasena_actual, hash);

      if (!esValida) {
        return res.status(401).json({
          error: true,
          body: "La contraseña actual es incorrecta",
        });
      }

      const nuevaHash = await bcrypt.hash(nueva_contrasena, 10);
      const sqlUpdate = "UPDATE usuario SET contraseña = ? WHERE id_usuario = ?";

      conexion.query(sqlUpdate, [nuevaHash, id_usuario], (err2) => {
        if (err2) {
          console.error("Error al actualizar contraseña:", err2);
          return res.status(500).json({ error: true, body: "Error al actualizar contraseña" });
        }
        res.json({ error: false, body: "Contraseña actualizada correctamente" });
      });
    });
  } catch (error) {
    console.error("Error en cambiarContrasena:", error);
    res.status(500).json({ error: true, body: "Error del servidor" });
  }
}

// ============================
// CAMBIAR CONTRASEÑA DE OTRO USUARIO (solo Admin)
// ============================
async function cambiarContrasenaAdmin(req, res) {
  const { id_usuario_objetivo, nueva_contrasena } = req.body;

  if (!id_usuario_objetivo || !nueva_contrasena) {
    return res.status(400).json({ error: true, body: "Todos los campos son requeridos" });
  }

  if (nueva_contrasena.length < 6) {
    return res.status(400).json({
      error: true,
      body: "La nueva contraseña debe tener mínimo 6 caracteres",
    });
  }

  try {
    const nuevaHash = await bcrypt.hash(nueva_contrasena, 10);
    const sql = "UPDATE usuario SET contraseña = ? WHERE id_usuario = ?";

    conexion.query(sql, [nuevaHash, id_usuario_objetivo], (err, resultado) => {
      if (err) {
        console.error("Error al actualizar contraseña:", err);
        return res.status(500).json({ error: true, body: "Error al actualizar contraseña" });
      }

      if (resultado.affectedRows === 0) {
        return res.status(404).json({ error: true, body: "Usuario no encontrado" });
      }

      res.json({ error: false, body: "Contraseña actualizada correctamente" });
    });
  } catch (error) {
    console.error("Error en cambiarContrasenaAdmin:", error);
    res.status(500).json({ error: true, body: "Error del servidor" });
  }
}

module.exports = { cambiarContrasena, cambiarContrasenaAdmin };