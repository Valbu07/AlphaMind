const express = require('express');   // importamos express
const config = require('./config/config');   // Importamos la configuracion
const funcionarios = require('./routes/funcionarioRoutes'); // Importamos las rutas de funcionarios
const login =  require('./routes/authRoutes');
const tareas = require('./routes/tareaRoutes');
const reportes = require('./routes/reportes');
const cors = require ('cors')
require('dotenv').config(); // Cargar variables de entorno

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

const app = express(); // Creamos la app de express

// Configuración del puerto
app.set('port', config.app.port) || 3307;

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

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));


module.exports = app;
