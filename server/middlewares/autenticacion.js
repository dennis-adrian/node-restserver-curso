const jwt = require('jsonwebtoken');

//=====================
// Verificar Token
//=====================

let verificaToken = (req, res, next) => {

        let token = req.get('token');

        jwt.verify(token, process.env.SEED, (error, decoded) => {

            if (error) {
                return res.status(401).json({
                    ok: false,
                    error
                })
            }

            req.usuario = decoded.usuario;

            next();
        })

    }
    //========================
    // Verificar ADMIN_ROLE
    //========================

let verificaAdmin_Role = (req, res, next) => {

    let usuario = req.usuario;

    if (usuario.role != 'ADMIN_ROLE') {
        return res.json({
            ok: false,
            error: {
                message: 'El usuario no es administrador'
            }
        })
    }
    next();
}
module.exports = {
    verificaToken,
    verificaAdmin_Role
}