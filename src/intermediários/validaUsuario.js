require('dotenv').config()
const jwt = require('jsonwebtoken');
const  knex = require('../conexao');


exports.verificaToken = async (req, res, next) => {
    const { authorization } = req.headers;

    if (!authorization) {
        return res.status(401).json({ "mensagem": "Não autorizado." });
    }
    const token = authorization.split(' ')[1];

    try {
        const { id } = jwt.verify(token, process.env.senhajwt);

        const usuario = await knex("usuarios").select("id", "nome", "email").where({id}).first()

        req.usuario = usuario;

        next();
    } catch (error) {
        return res.status(401).json({ "erro": error.message });
    }
};
