const express = require('express');   // importamos express
const config = require('./config');   // Importamos la configuracion
const funcionarios = require('./modulos/funcionarios/rutas'); // Importamos las rutas de funcionarios
const login =  require('./modulos/auth/authRutas');
const tareas = require('./modulos/Tareas/rutas');
const cors = require ('cors')

const app = express(); // Creamos la app de express

// Configuración del puerto
app.set('port', config.app.port);

// Middlewares
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));

// Rutas
app.use('/funcionarios', funcionarios); // El router de funcionarios
app.use('/auth', login)
app.use('/tareas', tareas)

module.exports = app;
