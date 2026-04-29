const express = require('express');
const cors = require('cors');
require('dotenv').config()
const errorHandler = require('./interfaces/middleware/errorHandler')

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => res.json({ status: 'La API de Koda está funcionando correctamente' }));

app.use((req, res, next) => {
    const error = new Error('Ruta no encontrada');
    error.statusCode = 404;
    next(error);
});

app.use(errorHandler)

module.exports = app;