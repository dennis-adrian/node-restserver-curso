const express = require('express');
const _ = require('underscore');


let { verificaToken, verificaAdmin_Role } = require('../middlewares/autenticacion');
let Categoria = require('../models/categoria');

let app = express();


app.get('/categoria', verificaToken, (req, res) => {

    Categoria.find({})
        .sort('descripcion')
        .populate('usuario', 'nombre email')
        .exec((error, categorias) => {

            if (error) {
                return res.status(500).json({
                    ok: false,
                    error
                });
            }
            res.json({
                ok: true,
                categorias,
            });
        });
});
app.get('/categoria/:id', verificaToken, (req, res) => {

    let id = req.params.id;

    Categoria.findById(id, (error, categoriaDB) => {
        if (error) {
            return res.status(500).json({
                ok: false,
                error
            });
        }
        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                error: {
                    message: 'Categoria no encontrado'
                }
            });
        }
        res.json({
            ok: true,
            categoria: categoriaDB,
        });
    });
});

app.post('/categoria', verificaToken, (req, res) => {
    let body = req.body;

    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: req.usuario._id
    });

    categoria.save((error, categoriaDB) => {

        //error de DB
        if (error) {
            return res.status(500).json({
                ok: false,
                error
            });
        }
        //si no se crea la categoriaerror
        if (error) {
            return res.status(400).json({
                ok: false,
                error
            });
        }
        res.json({
            ok: true,
            categoria: categoriaDB
        });
    });
});

app.put('/categoria/:id', verificaToken, (req, res) => {

    let id = req.params.id;
    let body = _.pick(req.body, ['descripcion']);

    Categoria.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (error, categoriaDB) => {

        //error de DB
        if (error) {
            return res.status(500).json({
                ok: false,
                message: 'Categoria no encontrada'
            });
        }
        res.json({
            ok: true,
            categoria: categoriaDB
        });

    })
});

app.delete('/categoria/:id', [verificaToken, verificaAdmin_Role], (req, res) => {

    let id = req.params.id;

    Categoria.findByIdAndRemove(id, (error, categoriaBorrada) => {

        if (error) {
            return res.status(500).json({
                ok: false,
                error
            });
        };

        if (!categoriaBorrada) {
            return res.status(400).json({
                ok: false,
                error: {
                    message: 'Categoria no encontrado'
                }
            });
        }

        res.json({
            ok: true,
            message: 'Categoria Borrada'
        });

    });
});
module.exports = app;