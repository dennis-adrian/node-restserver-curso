const express = require('express');
const _ = require('underscore');

const { verificaToken } = require('../middlewares/autenticacion');

let app = express();

let Producto = require('../models/producto');


//=================================
// Obtener productos
//=================================
app.get('/productos', verificaToken, (req, res) => {

    let desde = req.query.desde || 0;
    desde = Number(desde);

    Producto.find({ disponible: true })
        .skip(desde)
        .limit(5)
        .populate('categoria', 'descripcion')
        .populate('usuario', 'nombre email')
        .exec((error, productos) => {

            if (error) {
                return res.status(500).json({
                    ok: false,
                    error
                })
            }
            res.json({
                ok: true,
                productos
            })
        });

});
app.get('/productos/:id', verificaToken, (req, res) => {

    let id = req.params.id

    Producto.findById(id)
        .populate('categoria', 'descripcion')
        .populate('usuario', 'nombre email')
        .exec((error, producto) => {

            if (error) {
                return res.status(500).json({
                    ok: false,
                    error
                })
            }
            if (!producto) {
                return res.status(400).json({
                    ok: false,
                    error: {
                        message: 'El producto no existe'
                    }
                })
            }
            res.json({
                ok: true,
                producto
            })

        });
});
app.get('/productos/buscar/:termino', verificaToken, (req, res) => {

    let termino = req.params.termino;

    let regex = new RegExp(termino, 'i');

    Producto.find({ nombre: regex })
        .populate('categoria', 'descripcion')
        .exec((error, productos) => {

            if (error) {
                return res.status(500).json({
                    ok: false,
                    error
                })
            }
            res.json({
                ok: true,
                productos
            })
        });

});
//=================================
// Crear un producto
//=================================
app.post('/productos', verificaToken, (req, res) => {

    let body = req.body;

    let producto = new Producto({
        usuario: req.usuario._id,
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        categoria: body.categoria
    });

    producto.save((error, productoDB) => {
        if (error) {
            return res.status(500).json({
                ok: false,
                error
            })
        }
        res.json({
            ok: true,
            producto: productoDB
        })
    });
});
//=================================
// Actualizar un producto
//=================================
app.put('/productos/:id', verificaToken, (req, res) => {

    let id = req.params.id
    let body = _.pick(req.body, ['nombre', 'precioUni', 'descripcion', 'disponible']);

    Producto.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (error, productoDB) => {
        if (error) {
            return res.status(500).json({
                ok: false,
                error
            })
        }
        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                error: {
                    message: 'El producto no existe'
                }
            })
        }
        res.json({
            ok: true,
            producto: productoDB
        })
    })

});
//=================================
// Borrar un producto
//=================================
app.delete('/productos/:id', verificaToken, (req, res) => {

    let id = req.params.id;

    let cambiaEstado = {
        disponible: false
    };

    Producto.findByIdAndUpdate(id, cambiaEstado, { new: true }, (err, productoBorrado) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        };

        if (!productoBorrado) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Producto no encontrado'
                }
            });
        }

        res.json({
            ok: true,
            producto: productoBorrado
        });

    });
});

module.exports = app;