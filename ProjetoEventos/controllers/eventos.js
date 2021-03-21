module.exports = function (app) {
    var http = require('http');
    var Evento = app.models.eventos;

    var EventosController = {
        menu: function (request, response) {
            var usuario = request.session.usuario,
                params = { usuario: usuario };
            response.render('eventos/menu', params);
        },

        cadastroUsuario: function (request, response) {
            var usuario = request.session.usuario,
                params = { usuario: usuario };
            response.render('eventos/cadUsuario', params);
        },
        cadastroEvento: function (request, response) {
            var usuario = request.session.usuario,
                params = { usuario: usuario };
            response.render('eventos/cadEvento', params);
        },
        listaEventos: function (request, response) {
            Evento.find(function (erro, eventos) {
                if (erro) {
                    response.render('/menu');
                }
                else {
                    var usuario = request.session.usuario,
                        params = { usuario: usuario, eventos: eventos };
                    response.render('eventos/listaEventos', params);
                }
            });
        },
        listaEventosWS: function (request, response) {
            //array para conter os eventos
            var eventos = [];

            console.log('entrou eventos');

            //informações da requisição GET
            var info = {
                host: 'localhost',
                port: '3200',
                path: '/eventos',
                method: 'GET'
            };
            //chamando o serviço
            http.request(info, function (res) {
                res.setEncoding('utf8');
                res.on('data', function (data) {
                    eventos = JSON.parse(data);
                    var usuario = request.session.usuario,
                        params = { usuario: usuario, eventos: eventos };
                    response.render('eventos/listaEventosWS', params);
                });
            }).end();
        },
        pagamento: function (request, response) {
            var evento = request.params.evento,
                preco = request.params.preco,
                usuario = request.session.usuario,
                params = {
                    usuario: usuario, evento: evento,
                    preco: preco
                };

            response.render('eventos/pagamento', params);
        },

        novoPagamento: function (request, response) {
            //a ser implementado 

        },
        novoEvento: function (request, response) {
            var evento = request.body.evento;
            if (evento.descricao.trim().length == 0 || evento.data == 'undefined' || evento.preco.trim().length == 0) {
                response.redirect('/cadEvento');
            }
            else {
                Evento.create(evento, function (erro, evento) {
                    if (erro) {
                        response.redirect('/cadEvento');
                    }
                    else {
                        response.redirect('/menu');
                    }
                });
            }
        }

    };



    return EventosController;
};