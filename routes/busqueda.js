var express = require('express');

var app = express();

var Usuario = require('../models/usuario');
var Hospital = require('../models/hospital');
var Medico = require('../models/medico');

app.get('/todo/:busqueda', (req, res, next) => {
    var busqueda = req.params.busqueda;
    var regex = new RegExp(busqueda, 'i');

    Promise.all([buscarHospitales(regex), buscarMedicos(regex), buscarUsuarios(regex)])
            .then( respustas => {
                res.status(200).json({
                    ok: true,
                    hospitales: respuestas[0],
                    medicos: respuestas[1],
                    usuarios: respuestas[2]
                });
            }).catch( err => {
                res.status(500).json({
                    ok: false,
                    errors: err
                });
            });
});

function buscarHospitales(regex) {
    return new Promise( (resolve, reject) => {
        Hospital.find({ nombre: regex})
                .populate('usuario', 'nombre email')
                .exec((err, hospitales) => {
            if(err) {
                reject('Error al buscar hospitales');
            } else {
                resolve(hospitales);
            }
        });
    });
}

function buscarMedicos(regex) {
    return new Promise( (resolve, reject) => {
        Medico.find({ nombre: regex})
            .populate('usuario', 'nombre email')
            .populate('hospital')
            .exec((err, medicos) => {
            if(err) {
                reject('Error al buscar hospitales');
            } else {
                resolve(medicos);
            }
        });
    });
}


function buscarUsuarios(regex) {
    return new Promise( (resolve, reject) => {
        Usuario.find({}, 'nombre email role')
                .or( [{'nombre': regex}, {'email': regex}])
                .exec( (err, usuarios) => {
                    if(err) {
                        reject('Error al buscar hospitales');
                    } else {
                        resolve(usuarios);
                    }
                });
    });
}

module.exports = app;