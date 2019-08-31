// Require
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

// Inicializar variables
var app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Importar rutas
var appRoutes = require('./routes/app');
var loginRoutes = require('./routes/login');
var usuarioRoutes = require('./routes/usuario');
var hospitalRoutes = require('./routes/hospital');
var medicoRoutes = require('./routes/medico');

// Conexion a la db
mongoose.connection.openUri('mongodb://localhost:27017/hospitalDB', (err, res) => {
    if(err) throw err;
    console.log('Conexion a la base de datos en el puerto: \x1b[32m%s\x1b[0m con exito', '27017')
});

// Rutas
app.use('/login', loginRoutes);
app.use('/usuario', usuarioRoutes);
app.use('/hospital', hospitalRoutes);
app.use('/medico', medicoRoutes);
app.use('/', appRoutes);

// Escuchar peticiones
app.listen(3000, () => {
    console.log('Servidor corriendo en el puerto: \x1b[32m%s\x1b[0m', '3000')
});