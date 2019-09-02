var express = require('express');
var fileUpload = require('express-fileupload');
var fs = require('fs');

var app = express();


var Usuario = require('../models/usuario');
var Medico = require('../models/medico');
var Hospital = require('../models/hospital');

// default options
app.use(fileUpload());

app.put('/:tipo/:id', (req, res, next) => {

    var tipo = req.params.tipo;
    var id = req.params.id;
    var tiposValidos = ['hospitales', 'medicos', 'usuarios'];
    if(tiposValidos.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok: false,
            mensaje: 'Tipo de coleccion no valido',
            errors: {message: 'Las colecciones validas son hospitales, medicos y usuarios'}
        });
    }

    if( ! req.files) {
        return res.status(400).json({
            ok: false,
            mensaje: 'Error seleccion ningun archivo',
            errors: {message: 'Debe de seleccion una imagen para subir'}
        });
    }

    // Obtener el nombre del archivo
    var archivo = req.files.imagen;
    var archivoSpliteado = archivo.name.split('.');
    var extensionArchivo = archivoSpliteado[archivoSpliteado.length -1];

    var extensionesValidas = ['png', 'jpg', 'gif', 'jpeg'];

    if(extensionesValidas.indexOf(extensionArchivo) < 0) {
        return res.status(400).json({
            ok: false,
            mensaje: 'Extension no valida',
            errors: {message: 'Las extensiones validas son png, jpg, gif, jpeg'}
        });
    }

    var nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extensionArchivo}`;

    var path = `./uploads/${tipo}/${nombreArchivo}`

    archivo.mv(path, (err) => {
        if(err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al mover el archivo',
                errors: err
            });
        }
    });

    subirPorTipo(tipo, id, nombreArchivo, res);
    // res.status(200).json({
    //     ok: true,
    //     mensaje: 'Archivo subido correctamente'
    // });
});

function subirPorTipo(tipo, id, nombreArchivo, res) {
    if(tipo === 'usuarios') {
        Usuario.findById(id, (err, usuario) => {
            if(err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al buscar el usuario con id: ' + id,
                    errors: err
                });
            }
            if(!usuario) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'No se pudo encontrar un usuario con id: ' + id,
                    errors: {message: 'No se pudo encontrar un usuario'}
                });
            }

            var pathViejo = './uploads/usuarios/' + usuario.img;
            if(fs.existsSync(pathViejo)) {
                fs.unlink(pathViejo, (err) => {
                    console.error("Ocurrio un error al borrar la imagen antigua del usuario", err);
                });
            }

            usuario.img = nombreArchivo;
            usuario.save((err, usuarioActualizado) => {
                if(err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error al actualizar imagen del usuario',
                        errors: err
                    });
                }
                usuarioActualizado.password = ':)';
                return res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen actualizada correctamente',
                    usuario: usuarioActualizado
                });
            });
        });
    }
    if(tipo === 'medicos') {
        Medico.findById(id, (err, medico) => {
            if(err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al buscar el medico con id: ' + id,
                    errors: err
                });
            }
            if(!medico) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'No se pudo encontrar un medico con id: ' + id,
                    errors: {message: 'No se pudo encontrar un medico'}
                });
            }

            var pathViejo = './uploads/medicos/' + medico.img;
            if(fs.existsSync(pathViejo)) {
                fs.unlink(pathViejo, (err) => {
                    console.error("Ocurrio un error al borrar la imagen antigua del medico", err);
                });
            }

            medico.img = nombreArchivo;
            medico.save((err, medicoActualizado) => {
                if(err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error al actualizar imagen del medico',
                        errors: err
                    });
                }

                return res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen actualizada correctamente',
                    medico: medicoActualizado
                });
            });
        });
    }
    if(tipo === 'hospitales') {
        Hospital.findById(id, (err, hospital) => {
            if(err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al buscar el hospital con id: ' + id,
                    errors: err
                });
            }
            if(!hospital) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'No se pudo encontrar un hospital con id: ' + id,
                    errors: {message: 'No se pudo encontrar un hospital'}
                });
            }

            var pathViejo = './uploads/hospitales/' + hospital.img;
            if(fs.existsSync(pathViejo)) {
                fs.unlink(pathViejo, (err) => {
                    console.error("Ocurrio un error al borrar la imagen antigua del hospital", err);
                });
            }

            hospital.img = nombreArchivo;
            hospital.save((err, hospitalActualizado) => {
                if(err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error al actualizar imagen del hospital',
                        errors: err
                    });
                }

                return res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen actualizada correctamente',
                    hospital: hospitalActualizado
                });
            });
        });
    }
}

module.exports = app;