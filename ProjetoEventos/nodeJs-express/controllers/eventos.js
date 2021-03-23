module.exports = function (app) {
    var http = require('http');
    var Evento = app.models.eventos;
    var Pagamento = app.models.pagamentos;

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
            var cartao = request.body.cartao;
            var cartaoPost = JSON.stringify({
                'evento': cartao.evento,
                'preco': cartao.preco,
                'numcartao': cartao.numcartao,
                'cvv': cartao.cvv
            });

            //informações da requisição POST
            var info = {
                host: 'localhost',
                port: '3200',
                path: '/pagamentos',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Content-Length': cartaoPost.length
                }
            }; 208

            //definição do pbjeto para requisição POST
            var reqPost = http.request(info, function (res) {
                res.on('data', function (data) {
                    console.log('Incluindo registros:\n');
                    process.stdout.write(data);
                    console.log('\n\nHTTP POST Concluído');
                    // alert('Pagamento realizado com sucessso!');
                });
            });

            //Gravação dos dados
            reqPost.write(cartaoPost);
            response.redirect('/listaPagamentos');
            reqPost.end();
            reqPost.on('error', function (e) {
                console.error(e);
            });
        },

        listaPagamentos: function(request, response) {
            var pagamentos = [];

             //informações da requisição GET
             var info = {
                host: 'localhost',
                port: '3200',
                path: '/pagamentos',
                method: 'GET'
            };
            //chamando o serviço
            http.request(info, function (res) {
                res.setEncoding('utf8');
                res.on('data', function (data) {
                    pagamentos = JSON.parse(data);
                    var usuario = request.session.usuario,
                        params = { usuario: usuario, pagamentos: pagamentos };
                    response.render('eventos/listaPagamentos', params);
                });
            }).end();
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