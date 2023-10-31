require('dotenv').config()
const knex = require('../conexao')

const criaTabelaUsuarios = async() => {
    try {

        const existe = await knex.schema.hasTable('usuarios');
        if (!existe) {
            const criaTabela = await knex.schema.createTable(("usuarios"), (usuarios) => {
                usuarios.increments();
                usuarios.text("nome").notNullable()
                usuarios.text("email").notNullable().unique()
                usuarios.text("senha").notNullable()
            })

            if(criaTabela){
                console.log("Tabela criada!");
            }
        } else {
            console.log('Tabela usuarios já existe!');
        }
        return
    } catch (error) {
        console.log('Erro ao criar tabela:', error.message);
        return 
    }
}

const criaTabelaCategorias = async() => {
    try {
        const existe = await knex.schema.hasTable("categorias")
        if(!existe){
            const criaTabela = await knex.schema.createTable(("categorias"), (categorias) => {
                categorias.increments()
                categorias.text("descricao").notNullable().unique()
            })

            if(criaTabela){
                console.log("Tabela categorias criada!");
            }
        }else{
            console.log("Tabela categorias já existe!");
        }

        return
    } catch (error) {
        return error
    }
}

const criaTabelaTransacoes = async() => {
    try {
        const existe = await knex.schema.hasTable("transacoes")
        if(!existe){
            const criaTabela = await knex.schema.createTable(("transacoes"), (transacoes) => {
                transacoes.increments()
                transacoes.text("descricao")
                transacoes.integer("valor")
                transacoes.date("data")
                transacoes.integer("categoria_id").references("id").inTable("categorias")
                transacoes.integer("usuario_id").references("id").inTable("usuarios")
                transacoes.text("tipo")
            })

            if(criaTabela){
                console.log("Tabela transacoes criada!");
            }
        }else{
            console.log("Tabela transacoes já existe!");
        }

        return
    }catch (error) {
        console.log(error)
        return
    }
}

module.exports = {
    criaTabelaUsuarios,
    criaTabelaCategorias,
    criaTabelaTransacoes
}