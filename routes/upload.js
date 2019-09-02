var express = require('express');
var fileUpload = require('express-fileupload');

var app = express();

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

    res.status(200).json({
        ok: true,
        mensaje: 'Archivo subido correctamente'
    });
});

module.exports = app;