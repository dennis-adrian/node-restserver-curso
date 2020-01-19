const express = require('express');
const bodyParser = require('body-parser');
require('./config/config');

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/usuario', function(req, res) {
    res.json('get Usuario');
});
app.post('/usuario', function(req, res) {

    let body = req.body;

    if (body.nombre === undefined) {
        res.status(400).json({
            ok: false,
            mensaje: 'El nombre es necesario'
        });
    } else {

        res.json({
            persona: body
        });
    }

});
app.put('/usuario/:id', function(req, res) {

    let userId = req.params.id;
    res.json({
        id: userId
    });
});
app.delete('/usuario', function(req, res) {
    res.json('delete Usuario');
});

app.listen(process.env.PORT, () => {
    console.log('Escuchando puerto: ',
        process.env.PORT);
})