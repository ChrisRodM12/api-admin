// app.js
const express = require('express');
const morgan = require('morgan'); // Para logging de peticiones HTTP
const routes = require('./routes');
const helmet = require('helmet'); // Para seguridad básica
const cors = require('cors'); // Para permitir peticiones de otros dominios
const rateLimit = require('express-rate-limit'); // Para limitar peticiones
const mongoSanitize = require('express-mongo-sanitize'); // Aunque no usamos Mongo, es buena práctica si mezclas
const xss = require('xss-clean'); // Previene ataques XSS
const hpp = require('hpp'); // Previene polución de parámetros HTTP
const AppError = require('./utils/AppError');
const globalErrorHandler = require('./controllers/errorController'); // Lo crearemos en el siguiente paso



const app = express();

// 1) MIDDLEWARES GLOBALES

app.use(express.json());
app.use(morgan('dev'));

// Seguridad HTTP Headers
app.use(helmet());

// Desarrollo: Logging de peticiones HTTP
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Limitar peticiones desde la misma IP
const limiter = rateLimit({
  max: 100, // 100 peticiones por IP
  windowMs: 60 * 60 * 1000, // En 1 hora
  message: 'Demasiadas peticiones desde esta IP, por favor, inténtalo de nuevo en una hora!',
});
app.use('/api', limiter); // Aplica a todas las rutas que empiezan con /api

// Body parser, lee datos del body en req.body
app.use(express.json({ limit: '10kb' })); // Limita el tamaño del body
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Data sanitization contra NoSQL query injection (aunque no usamos Mongo, buena práctica)
app.use(mongoSanitize());

// Data sanitization contra XSS
app.use(xss());

// Prevenir polución de parámetros HTTP
app.use(hpp({
  whitelist: [
    // Aquí puedes poner parámetros que quieres permitir duplicados (ej: sort, fields)
  ]
}));

// Habilitar CORS para todas las rutas
app.use(cors());

// 2) RUTAS
require('./routes')(app); // Carga todas las rutas definidas en routes/index.js

// Manejo de rutas no encontradas
app.all('*', (req, res, next) => {
  next(new AppError(`No se puede encontrar ${req.originalUrl} en este servidor!`, 404));
});

// Manejador de errores global
app.use(globalErrorHandler);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    status: 'error',
    message: 'Error interno del servidor' 
  });
});

module.exports = app;