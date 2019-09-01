var express = require('express');

var mdAutenticacion = require('../middlewares/autenticacion');

var app = express();

var Medico = require('../models/medico');

// ==================================================
// Obtener todos los medicos
// ==================================================
app.get('/',  (req, res, next) => {

    Medico.find({})
        .populate('usuario', 'nombre email')
        .populate('hospital')
        .exec((err, medicos) => {
            if(err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error cargando medicos',
                    errors: err
                });
            }

            res.status(200).json({
                ok: true,
                medicos
            });
        });
});


// ==================================================
// Crear un medico nuevo
// ==================================================
app.post('/', mdAutenticacion.verificaToken, (req, res, next) => {
    var body = req.body;

    var medico = new Medico({
        nombre: body.nombre,
        usuario: req.usuario._id,
        hospital: body.hospital
    });

    medico.save( (err, medicoGuardado) => {
        if(err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear medico',
                errors: err
            });
        }
        res.status(201).json({
            ok: true,
            hospital: medicoGuardado
        });
    });
});


// ==================================================
// Actualizar un medico existente
// ==================================================
app.put('/:id', mdAutenticacion.verificaToken, (req, res, next) => {
    var id = req.params.id;
    var body = req.body;

    Medico.findById( id, (err, medicoEncontrado) => {
        if(err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error medico no encontrado',
                errors: err
            });
        }
        if(!medicoEncontrado) {
            return res.status(404).json({
                ok: false,
                mensaje: `El medico con el ${id} no existe`,
                errors: {message: 'No existe un medico con ese ID'}
            });
        }

        medicoEncontrado.nombre = body.nombre;
        medicoEncontrado.usuario = req.usuario._id;
        medicoEncontrado.hospital = body.hospital;

        medicoEncontrado.save( (err, medicoGuardado) => {
            if(err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar el medico',
                    errors: err
                });
            }

            res.status(200).json({
                ok: true,
                medico: medicoGuardado
            });
        });
    });
});

// ==================================================
// Borrar medico por el id
// ==================================================
app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {
    var id = req.params.id;

    Medico.findByIdAndRemove(id, (err, medicoBorrado) => {
        if(err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar medico',
                errors: err
            });
        }
        if(!medicoBorrado) {
            return res.status(404).json({
                ok: false,
                mensaje: 'No existe el medico con el id ' + id,
                errors: { message: 'Medico inexistente para borrar'}
            });
        }

        return res.status(200).json({
            ok: true,
            medico: medicoBorrado
        });
    });
});

module.exports = app;