var express = require('express');

var app = express();

var Usuario = require('../models/usuario');
var Hospital = require('../models/hospital');
var Medico = require('../models/medico');

// ==================================================
// Busqueda especifica
// ==================================================
app.get('/coleccion/:tabla/:busqueda', (req, res) => {
    var tabla = req.params.tabla;
    var busqueda = req.params.busqueda;
    var regex = new RegExp(busqueda, 'i');

    var promesa;

    switch (tabla) {
        case 'usuarios':
            promesa = buscarUsuarios(regex);
            break;
        case 'hospitales':
            promesa = buscarHospitales(regex);
            break;
        case 'medicos':
            promesa = buscarMedicos(regex);
            break;
        default:
            return res.status(400).json({
                ok: false,
                mensaje: 'Los tipos de busuqeda solo son usuarios, medicos y hospitales',
                errors: { message: 'tipo de coleccion no valido: ' + tabla }
            });
    }

    promesa.then(data => {
        res.status(200).json({
            ok: true,
            [tabla]: data
        });
    }).catch(err => {
        res.status(500).json({
            ok: false,
            errors: err
        });
    });
});

// ==================================================
// Busqueda general
// ==================================================

app.get('/todo/:busqueda', (req, res, next) => {
    var busqueda = req.params.busqueda;
    var regex = new RegExp(busqueda, 'i');

    Promise.all([buscarHospitales(regex), buscarMedicos(regex), buscarUsuarios(regex)])
        .then(respustas => {
            res.status(200).json({
                ok: true,
                hospitales: respuestas[0],
                medicos: respuestas[1],
                usuarios: respuestas[2]
            });
        }).catch(err => {
            res.status(500).json({
                ok: false,
                errors: err
            });
        });
});

function buscarHospitales(regex) {
    return new Promise((resolve, reject) => {
        Hospital.find({ nombre: regex })
            .populate('usuario', 'nombre email')
            .exec((err, hospitales) => {
                if (err) {
                    reject('Error al buscar hospitales');
                } else {
                    resolve(hospitales);
                }
            });
    });
}

function buscarMedicos(regex) {
    return new Promise((resolve, reject) => {
        Medico.find({ nombre: regex })
            .populate('usuario', 'nombre email')
            .populate('hospital')
            .exec((err, medicos) => {
                if (err) {
                    reject('Error al buscar hospitales');
                } else {
                    resolve(medicos);
                }
            });
    });
}


function buscarUsuarios(regex) {
    return new Promise((resolve, reject) => {
        Usuario.find({}, 'nombre email role')
            .or([{ 'nombre': regex }, { 'email': regex }])
            .exec((err, usuarios) => {
                if (err) {
                    reject('Error al buscar hospitales');
                } else {
                    resolve(usuarios);
                }
            });
    });
}

module.exports = app;