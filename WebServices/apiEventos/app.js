var express = require('express');
var load = require('express-load');
var app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var mongoose = require('mongoose');
// global.db = mongoose.connect('mongodb://localhost:27017/neventos');
global.db = mongoose.connect('mongodb+srv://dbAdminLF:qIwvI8ELBfuz5AqK@mean.p1qy8.mongodb.net/dbAdminLF?retryWrites=true&w=majority', { useNewUrlParser: true });

load('models').into(app);
var Evento = app.models.eventos;

//método do serviço
app.get('/', function (request, response) {
  response.send('Servidor no ar');
 });

app.get('/eventos', function (request, response) {
  Evento.find(function (erro, eventos) {
  if (erro) {
    response.json(erro);
  }
  else {
    response.json(eventos);
  }
  });
});

app.get('/eventos/:id', function (request, response) {
  var id = request.params.id;
  Evento.findById(id, function (erro, evento) {
  if (erro) {
    response.json(erro);
  }
  else {
    response.json(evento);
  }
  });
});

app.post('/eventos', function (request, response) {
  var descricao = request.body.descricao;
  var data = request.body.data;
  var preco = request.body.preco;
  var evento = {
    'descricao': descricao,
    'data': data,
    'preco': preco
  };

  Evento.create(evento, function (erro, evento) {
  if (erro) {
    response.json(erro);
  } else {
    response.json(evento);
  }
  });
});


app.put('/eventos/:id', function (request, response) {
  var id = request.params.id;
  Evento.findById(id, function (erro, evento) {
    if (erro) {
      response.json(erro);
    }
    else {
      var evento_upd = evento;
      evento_upd.descricao = request.body.descricao;
      evento_upd.data = request.body.data;
      evento_upd.preco = request.body.preco;
      evento_upd.save(function (erro, evento) {
        if (erro) {
        response.json(erro);
        }
        else {
        response.json(evento);
        }
      });

      response.json(evento);
    }
  });
});

app.delete('/eventos/:id', function (request, response) {
  var id = request.params.id;
  Evento.findById(id, function (erro, evento) {
    if (erro) {
      response.json(erro);
    } else {
      Evento.remove(evento, function (erro, evento) {
        if (erro) {
        response.json(erro);
        }
        else {
        response.send('removido');
        }
      });
    }
  });
});

app.listen(3200, function () {
 console.log('ok');
});