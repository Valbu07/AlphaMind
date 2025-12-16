const express = require('express');
const config = require('./config/config');
const funcionarios = require('./routes/funcionarioRoutes');
const login = require('./routes/authRoutes');
const tareas = require('./routes/tareaRoutes');
const reportes = require('./routes/reportes');
const recuperarContraseña = require('./routes/recuperarContraseña');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

// Puerto
app.set('port', config.app.port || 3000);

// CORS (permitir ngrok)
app.use(cors({
  origin: true,
  credentials: true
}));

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API routes
app.use('/funcionarios', funcionarios);
app.use('/auth', login);
app.use('/tareas', tareas);
app.use('/reportes', reportes);
app.use('/recuperar', recuperarContraseña);


// Frontend
app.use(express.static(path.join(__dirname, '../dist')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});


module.exports = app;
