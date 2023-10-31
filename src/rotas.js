const express = require('express');
const rotas = express();

const {verificaToken} = require('./intermediários/validaUsuario');
const validaCorpo = require('./intermediários/ValidaCorpo')

const { cadastroUsuario, loginUsuario, detalharUsuario, atualizarUsuario } = require('./controladores/usuario');
const {listarCategorias} = require('./controladores/categorias')
const transacao = require('./controladores/transacao');
const schemaUsuario = require('./validacoes/schemaUsuario');
const schemaTransacao = require('./validacoes/schemaTransacao');

rotas.post('/usuario', validaCorpo(schemaUsuario), cadastroUsuario);
rotas.post('/login', loginUsuario);
rotas.get('/usuario', verificaToken ,detalharUsuario)

rotas.use(verificaToken)
rotas.put('/usuario', atualizarUsuario)

rotas.get('/categoria', listarCategorias)

rotas.get('/transacao', transacao.listarTransacoes)
rotas.get('/transacao/extrato', transacao.obterExtrato)
rotas.get('/transacao/:id', transacao.detalharTransacao)
rotas.post('/transacao', validaCorpo(schemaTransacao), transacao.cadastrarTransacao)
rotas.put('/transacao/:id', validaCorpo(schemaTransacao), transacao.atualizarTransacao)
rotas.delete('/transacao/:id', transacao.excluirTransacao)


module.exports = rotas;
