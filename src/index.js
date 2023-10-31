require("dotenv").config()
const express = require('express');
const rotas = require('./rotas');
const { criaTabelaUsuarios, criaTabelaCategorias, criaTabelaTransacoes } = require("./sql/criaTabelas");
const { insereCategorias } = require("./sql/updateTabelas");
const app = express();

Promise.all([
    criaTabelaUsuarios(),
    criaTabelaCategorias(),
    criaTabelaTransacoes(),
    insereCategorias()
])

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(rotas);

app.listen(3000);