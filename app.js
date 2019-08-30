// Require
var express = require('express');
var mongoose = require('mongoose');

// Inicializar variables
var app = express();

// Importar rutas
var appRoutes = require('./routes/app');
var usuarioRoutes = require('./routes/usuario');

// Conexion a la db
mongoose.connection.openUri('mongodb://localhost:27017/hospitalDB', (err, res) => {
    if(err) throw err;
    console.log('Conexion a la base de datos en el puerto: \x1b[32m%s\x1b[0m con exito', '27017')
});

// Rutas
app.use('/usuario', usuarioRoutes);
app.use('/', appRoutes);

// Escuchar peticiones
app.listen(3000, () => {
    console.log('Servidor corriendo en el puerto: \x1b[32m%s\x1b[0m', '3000')
});