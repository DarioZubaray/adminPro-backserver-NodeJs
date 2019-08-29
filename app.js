// Require
var express = require('express');
var mongoose = require('mongoose');

// Inicializar variables
var app = express();

// Conexion a la db
mongoose.connection.openUri('mongodb://localhost:27017/hospitalDB', (err, res) => {
    if(err) throw err;
    console.log('Conexion a la base de datos en el puerto: \x1b[32m%s\x1b[0m con exito', '27017')
});

// rutas
app.get('/', (req, res, next) => {
    res.status(200).json({
        ok: true,
        mensaje: 'Primera peticion realizada correctamente'
    });
});

// Escuchar peticiones
app.listen(3000, () => {
    console.log('Servidor corriendo en el puerto: \x1b[32m%s\x1b[0m', '3000')
});