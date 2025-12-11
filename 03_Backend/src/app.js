const express = require('express');   // importamos express
const config = require('./config/config');   // Importamos la configuracion
const funcionarios = require('./routes/funcionarioRoutes'); // Importamos las rutas de funcionarios
const login =  require('./routes/authRoutes');
const tareas = require('./routes/tareaRoutes');
const reportes = require('./routes/reportes');
const recuperarContraseña = require('./routes/recuperarContraseña');
const cors = require ('cors')
require('dotenv').config(); // Cargar variables de entorno

const app = express(); // Creamos la app de express

// Configuración del puerto
app.set('port', config.app.port) || 3306;

// Middlewares
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));

// Rutas
app.use('/funcionarios' , funcionarios);
app.use('/auth', login)
app.use('/tareas', tareas)
app.use('/reportes', reportes)
app.use('/recuperar', recuperarContraseña)

module.exports = app;
