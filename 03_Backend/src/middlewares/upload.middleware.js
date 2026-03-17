const multer = require("multer");
const path = require("path");
const fs = require("fs");

const carpeta = path.join(__dirname, "../../fotos_Perfil");
if (!fs.existsSync(carpeta)) fs.mkdirSync(carpeta, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, carpeta),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    // Usa el id del token si existe, si no usa timestamp solo
    const id = req.usuario?.id_usuario || Date.now();
    const nombre = `avatar-${id}-${Date.now()}${ext}`;
    cb(null, nombre);
  },
});

const filtro = (req, file, cb) => {
  const permitidos = ["image/jpeg", "image/png", "image/webp"];
  if (permitidos.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Solo se permiten imágenes JPG, PNG o WEBP"));
  }
};

module.exports = multer({
  storage,
  fileFilter: filtro,
  limits: { fileSize: 5 * 1024 * 1024 },
});