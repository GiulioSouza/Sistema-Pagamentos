require('dotenv').config()
const knex = require('../conexao')

const insereCategorias = async() => {
    const categoriasExistentes = await knex("categorias")
    if(categoriasExistentes.length > 0){
        return 
    }
    try {
        const categorias = await knex("categorias").insert([
            {descricao: "Alimentação"},
            {descricao: "Assinaturas e Serviços"},
            {descricao: "Casa"},
            {descricao: "Mercado"},
            {descricao: "Cuidados Pessoais"},
            {descricao: "Educação"},
            {descricao: "Família"},
            {descricao: "Lazer"},
            {descricao: "Presentes"},
            {descricao: "Roupas"},
            {descricao: "Saúde"},
            {descricao: "Transporte"},
            {descricao: "Salário"},
            {descricao: "Vendas"},
            {descricao: "Outras Receitas"},
            {descricao: "Outras Despesas"}
        ])

        console.log("Categorias Atualizadas!");
        return
    } catch (error) {
        console.log(error)
    }
}

module.exports = {
    insereCategorias
}