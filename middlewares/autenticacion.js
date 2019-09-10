var jwt = require('jsonwebtoken');

var SEED = require('../config/config').SEED;

// ==================================================
// Verificar token
// ==================================================
exports.verificaToken = function(req, res, next) {

    var token = req.query.token;

    jwt.verify(token, SEED, (err, decoded) => {
        if(err) {
            return res.status(401).json({
                ok: false,
                mensaje: 'Token incorrecto',
                errors: err
            });
        }

        req.usuario = decoded.usuario;
        next();
    });
}

// ==================================================
// Verificar admin role
// ==================================================
exports.verificaAdminRole = function(req, res, next) {

    var usuario = req.usuario;

    if (usuario.role === 'ADMIN_ROLE') {
        next();
        return;
    } else {
        return res.status(401).json({
            ok: false,
            mensaje: 'Token incorrecto',
            errors: { message: 'No es administrador'}
        });
    }
}