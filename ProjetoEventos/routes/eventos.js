module.exports = function (app) {

    var valida = require('./../middlewares/valida');

    var eventos = app.controllers.eventos;
    
    app.get('/menu', eventos.menu);

    app.get('/cadUsuario', valida, eventos.cadastroUsuario);
    app.get('/cadEvento', valida, eventos.cadastroEvento);
    app.get('/listaEventos', valida, eventos.listaEventos);

    app.get('/listaEventosWS', valida, eventos.listaEventosWS);

    app.post('/novoEvento', eventos.novoEvento);

    app.get('/pagamento/:evento/:preco', valida, eventos.pagamento);
    app.post('/novoPagamento', eventos.novoPagamento);

};