var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

var SEED = require('../config/config').SEED;

var app = express();

var Usuario = require('../models/usuario');

const {OAuth2Client} = require('google-auth-library');
var CLIENT_ID = require('../config/config').CLIENT_ID;
const client = new OAuth2Client(CLIENT_ID);

// ==================================================
// Login google
// ==================================================
async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    console.log(ticket);
    const payload = ticket.getPayload();
    // const userid = payload['sub'];
    // If request specified a G Suite domain:
    //const domain = payload['hd'];
    console.log(payload);
    return {
        nombre: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true
    }
}

app.post('/google', async (req, res, next) => {
    var token = req.body.token;

    var googleUser = await verify(token).catch( e => {
        return res.status(403).json({
            ok: false,
            mensaje: 'Token no válido'
        });
    });

    return res.status(200).json({
        ok: true,
        mensaje: 'Primera peticion realizada correctamente',
        googleUser: googleUser
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