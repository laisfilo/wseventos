
var express = require('express');

var load = require('express-load');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var expressSession = require('express-session');


var load = require('express-load');

var error = require('./middlewares/error');

var app = express();

var mongoose = require('mongoose');
global.db = mongoose.connect('mongodb://localhost:27017/neventos', { useNewUrlParser: true });

mongoose.connection.on('connected', function () {
 console.log('=====Conexão estabelecida com sucesso=====');
});
mongoose.connection.on('error', function (err) {
 console.log('=====Ocorreu um erro: ' + err);
});
mongoose.connection.on('disconnected', function () {
 console.log('=====Conexão finalizada=====');
});

// view engine setup
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.use(cookieParser('nodeEventos'));
app.use(expressSession());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(__dirname + '/public'));

load('models')
 .then('controllers')
 .then('routes')
 .into(app);

//middlewares
app.use(error.notFound);
app.use(error.serverError);

// var porta = process.env.PORT || 8080;
// app.listen(porta);

app.listen(3000, function() {
  console.log('Aplicação no ar')
});
