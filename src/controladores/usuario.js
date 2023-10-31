const knex = require('../conexao');
const bcrypt = require('bcryptjs');
require('dotenv').config();
const jwt = require('jsonwebtoken')

const cadastroUsuario = async (req, res) =>{
    const { nome, email, senha } = req.body;
       try {

        const usuarioExiste = await knex("usuarios").where({email})
        if (usuarioExiste.length > 0) {
            return res.status(401).json({ mensagem: 'Já existe usuário cadastrado com o e-mail informado.' });
        }
        const hashSenha = await bcrypt.hash(senha, 10);

        const novoUsuario = await knex("usuarios").insert({nome: nome, email: email, senha: hashSenha})

        return res.status(201).json("Usuario criado com sucesso!");
    } catch (error) {
        return res.status(500).json({ "mensagem": error.message});
    }
}

const loginUsuario = async (req, res) => {
    const { email, senha } = req.body;

    try {
        const usuarioExiste = await knex("usuarios").where({email}).first()
        if (!usuarioExiste) {
            return res.status(401).json({ "mensagem": "Não foi possível fazer login" });
        }

        const senhaCorreta = await bcrypt.compare(senha, usuarioExiste.senha);
        if (!senhaCorreta) return res.status(400).json({ "mensagem": "Usuário e/ou senha inválido(s)."});

        const token = jwt.sign({ id: usuarioExiste.id }, process.env.senhajwt, { expiresIn: '30m' });

        const { senha: _senha, ...dadosUsuario } = usuarioExiste;

        return res.json({ usuario: dadosUsuario, token });
    } catch (error) {
        return res.status(500).json({ "mensagem": error.message});
    }
}

const atualizarUsuario = async (req, res) => {
    const {id } = req.usuario
        
    const { nome: nomeBody, email: emailBody, senha: senhaBody } = req.body;

    if (!nomeBody && !emailBody && !senhaBody) return res.status(400).json({ "mensagem": "Necessário informar ao menos um campo para atualizar." });
    try {
        if(nomeBody){
            const atualizarUsuario = await knex("usuarios").update({nome: nomeBody}).where({id})

            const usuarioAtualizado = await knex("usuarios").where({nome: nomeBody}).first()

            if(!usuarioAtualizado){
                return res.status(500).json({"mensagem": "Não foi possível atualizar o usuário"})
            }

            return res.status(200).json(usuarioAtualizado)
        }

        if(emailBody){
            const emailExistente = await knex("usuarios").where({email: emailBody})

            if(emailExistente.length > 0){
                return res.status(400).json({"Impossível completar ação": "Já existe o email informado no banco de dados"})
            }

            const atualizarUsuario = await knex("usuarios").update({email: emailBody}).where({id})

            const usuarioAtualizado = await knex("usuarios").where({email: emailBody}).first()

            if(!usuarioAtualizado){
                return res.status(500).json({"mensagem": "Não foi possível atualizar o usuário"})
            }

            return res.status(200).json({usuarioAtualizado})
        }

        if(senhaBody){
            const hashSenha = await bcrypt.hash(senhaBody, 10);

            const atualizarUsuario = await knex("usuarios").update({senha: hashSenha}).where({id})

            const usuarioAtualizado = await knex("usuarios").where({senha: hashSenha}).first()

            if(!usuarioAtualizado){
                return res.status(500).json({"mensagem": "Não foi possível atualizar o usuário"})
            }

            return res.status(200).json({usuarioAtualizado})
        }     
    } catch (error) {
        return res.status(500).json({ "mensagem": error.message });
    }
}


const detalharUsuario = async (req, res) => {
    const { id } = req.usuario;
    try {
        const usuario = await knex("usuarios").where({id}).first()

        return res.status(200).json(usuario)
    } catch (error) {
        return res.status(401).json({ "mensagem": error.message });
    }
}


module.exports = {
    cadastroUsuario,
    loginUsuario,
    atualizarUsuario,
    detalharUsuario
}