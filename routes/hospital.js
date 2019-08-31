var express = require('express');
var mdAutenticacion = require('../middlewares/autenticacion');

var app = express();

var Hospital = require('../models/hospital');

// ==================================================
// Obtener todos los hospitales
// ==================================================
app.get('/', (req, res, next) => {

    Hospital.find({}).exec((err, hospitales) => {
        if(err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error cargando hospitales',
                errors: err
            });
        }

        res.status(200).json({
            ok: true,
            hospitales
        });
    });
});

module.exports = app;