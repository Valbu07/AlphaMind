const express = require('express');
const config = require('./config/config');
const funcionarios = require('./routes/funcionarioRoutes');
const login = require('./routes/authRoutes');
const tareas = require('./routes/tareaRoutes');
const reportes = require('./routes/reportes');
const chat = require('./routes/chatRoutes');
const recuperarContraseña = require('./routes/recuperarContraseña');
const cors = require('cors');
const path = require('path');
require('dotenv').config();


const app = express();

/*Incio Swagger*/
const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "APIs AlphaMind",
      version: "1.0.0",
      description: "Documentación de las APIs del sistema AlphaMind",
    },

    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    
    servers: [
      {
        url: "http://localhost:3000",
      },
    ],
  },
  apis: ["./src/routes/*.js"], // LLama todas la rutas
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
/*Fin swagger */
// Puerto
app.set('port', config.app.port || 3000);

app.use(cors({
  origin: 'http://localhost:5173',
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
app.use('/chat', chat);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


module.exports = app;
