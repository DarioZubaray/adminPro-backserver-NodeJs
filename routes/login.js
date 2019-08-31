var express = require('express');
var bcrypt = require('bcryptjs');

var app = express();

var Usuario = require('../models/usuario');

// ==================================================
// Login
// ==================================================

app.post('/', (req, res) => {
    var body = req.body;

    Usuario.findOne({email: body.email}, (err, usuarioDB) => {
        if(err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar el usuario no',
                errors: err
            });
        }
        if(!usuarioDB) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Usuario o contraseña invalidos',
                errors: {message: 'Credenciales invalida'}
            });
        }
        if(!bcrypt.compareSync(body.password, usuarioDB.password)) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Usuario o contraseña invalidos',
                errors: {message: 'Credenciales invalida'}
            });
        }

        // crear un token

        

        res.status(200).json({
            "ok": true,
            "message": "Logueado!",
            usuarioDB,
            id: usuarioDB._id
        });
    });
});

module.exports = app;