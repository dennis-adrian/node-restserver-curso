const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
require('./config/config');

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(require('./routes/usuario'));

mongoose.connect('mongodb://localhost:27017/cafe', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}, (error, res) => {

    if (error) throw error;

    console.log('Base de datos ONLINE');
});
app.listen(process.env.PORT, () => {
    console.log('Escuchando puerto: ',
        process.env.PORT);
})