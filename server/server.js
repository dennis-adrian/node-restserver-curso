require('./config/config');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();

//fix mongoose errors
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true)


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Configuracion global de rutas
app.use(require('./routes/index'))

mongoose.connect(process.env.URLDB, (error, res) => {

    if (error) throw error;

    console.log('Base de datos ONLINE');
});
app.listen(process.env.PORT, () => {
    console.log('Escuchando puerto: ',
        process.env.PORT);
})