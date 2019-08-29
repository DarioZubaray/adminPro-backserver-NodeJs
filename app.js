// Require
var express = require('express');

// Inicializar variables
var app = express();

// Escuchar peticiones
app.listen(3000, () => {
    console.log('Servidor corriendo en el puerto: \x1b[32m%s\x1b[0m', '3000')
});