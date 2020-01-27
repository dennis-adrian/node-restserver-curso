const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();

const Usuario = require('../models/usuario');
const Producto = require('../models/producto');

const fs = require('fs');
const path = require('path');


// default options
app.use(fileUpload());

app.put('/upload/:tipo/:id', (req, res) => {

    let tipo = req.params.tipo;
    let id = req.params.id;

    //si no hay ningun archivo, retorna el error 
    if (!req.files) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'No se ha seleccionado ningun archivo'
            }
        });
    }
    //==================
    // Validar tipo
    //==================
    let tiposValidos = ['productos', 'usuarios'];

    if (tiposValidos.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Los tipos permitidos son ' + tiposValidos.join(', ')
            }
        })
    }

    //===============================
    // Validar extension de archivos
    //===============================
    let archivo = req.files.archivo;

    let nombreCortado = archivo.name.split('.');
    let extension = nombreCortado[nombreCortado.length - 1];
    //Extensiones Permitidas
    let extensionesValidas = ['png', 'jpg', 'gif', 'jpeg']

    if (extensionesValidas.indexOf(extension) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Las extensiones permitidas son ' + extensionesValidas.join(', ')
            }
        })
    }
    //===============================
    // Cambiar nombre al archivo
    //===============================

    let nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extension}`;
    //===============================
    //la variable ${tipo} me ayuda a ubicar la carpeta para guardar el archivo 
    archivo.mv(`uploads/${tipo}/${nombreArchivo}`, (err) => {
        if (err)
            return res.status(500).json({
                ok: false,
                err
            });

        //Aqui, la imagen ya esta cargada
        if (tipo === 'productos') {
            imagenProducto(id, res, nombreArchivo);
        } else {
            imagenUsuario(id, res, nombreArchivo)
        }

    });
});

function imagenUsuario(id, res, nombreArchivo) {

    Usuario.findById(id, (err, usuarioDB) => {
        if (err) {
            //aunque haya un error, la imagen ya esta subida de todos modos, y hay que borrarla
            borrarArchivo(nombreArchivo, 'usuarios')
            return res.status(500).json({
                ok: false,
                err
            });
        };
        if (!usuarioDB) {
            borrarArchivo(nombreArchivo, 'usuarios')
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El usuario no existe'
                }
            });
        };

        borrarArchivo(usuarioDB.img, 'usuarios')

        usuarioDB.img = nombreArchivo;

        usuarioDB.save((err, usuarioGuardado) => {
            res.json({
                ok: true,
                usuario: usuarioGuardado,
                img: nombreArchivo
            });
        });
    })
}

function imagenProducto(id, res, nombreArchivo) {

    Producto.findById(id, (err, productoDB) => {
        if (err) {
            //aunque haya un error, la imagen ya esta subida de todos modos, y hay que borrarla
            borrarArchivo(nombreArchivo, 'productos')
            return res.status(500).json({
                ok: false,
                err
            });
        };
        if (!productoDB) {
            borrarArchivo(nombreArchivo, 'productos')
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El usuario no existe'
                }
            });
        };

        borrarArchivo(productoDB.img, 'productos')

        productoDB.img = nombreArchivo;

        productoDB.save((err, productoGuardado) => {
            res.json({
                ok: true,
                producto: productoGuardado,
                img: nombreArchivo
            });
        });
    })
}

function borrarArchivo(nombreImagen, tipo) {
    //construimos el path 
    let pathImagen = path.resolve(__dirname, `../../uploads/${tipo}/${nombreImagen}`);
    //la funcion fs.existsSync() no ayuda a decir si cierto archivo en el path pasado como argumenot existe=true o no=false
    if (fs.existsSync(pathImagen)) {
        //fs.unlinkSync() es una opcion del fileSystem para borrar un archivo
        fs.unlinkSync(pathImagen);
    };
};
module.exports = app;