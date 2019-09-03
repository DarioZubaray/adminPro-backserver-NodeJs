var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

var SEED = require('../config/config').SEED;

var app = express();

var Usuario = require('../models/usuario');

// ==================================================
// Login google
// ==================================================
app.post('/google', (req, res, next) => {
    res.status(200).json({
        ok: true,
        mensaje: 'Primera peticion realizada correctamente'
    });
});

// ==================================================
// Login Autonomo
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
        usuarioDB.password = ';)';
        var token = jwt.sign({ usuario: usuarioDB }, SEED, {expiresIn: 14400});
        

        res.status(200).json({
            "ok": true,
            "message": "Logueado!",
            usuarioDB,
            id: usuarioDB._id,
            token
        });
    });
});

module.exports = app;