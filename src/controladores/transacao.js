const knex = require('../conexao');
const { error } = require('../validacoes/schemaUsuario');

const listarTransacoes = async(req, res) => {
    const {id} = req.usuario
    const {filtro} = req.query
    let arrayFiltro = filtro.replace(/[\[\]']+/g,'').trim().split(', ');

    try {
        if(filtro){
            const filtrosAjustados = arrayFiltro.map((palavra) => {
                return palavra.charAt(0).toUpperCase() + palavra.slice(1).toLowerCase();
            })

            let query = knex('transacoes')
            .select('*')
            .innerJoin('categorias', 'transacoes.categoria_id', 'categorias.id');

            filtrosAjustados.forEach(filtro => {
                query = query.orWhere('categorias.descricao', 'ilike', `%${filtro}%`);
            });

            const transacoes = await query;

            return res.status(200).json(transacoes)
        }
        
        const transacoes = await knex("transacoes").where({id})

        if(transacoes.length < 1){
            return res.status(200).json({"Transacoes": "Não há histórico de transações"})
        }

        return res.status(200).json(transacoes)
    } catch (error) {
        return res.status(500).json({"mensagem": error.message})
    }
}

const detalharTransacao = async(req, res) => {
    const {id} = req.usuario
    const idTransacao = req.params.id

    try {
        const transacao = await knex("transacoes").where({id: idTransacao, usuario_id: id})

        if(transacao.length < 1){
            return res.status(404).json({"erro": "Erro ao detalhar transação"})
        }

        return res.status(200).json(transacao)
    } catch (error) {
        return res.status(500).json({"mensagem": error.message})
    }
}

const cadastrarTransacao = async(req, res) => {
    const {id} = req.usuario
    const {descricao, valor, data, categoria_id, tipo} = req.body

    try {
        if(tipo !== "entrada" && tipo !== "saida"){
            return res.status(400).json({"mensagem": "Tipo de transação inválido."})
        }

        const novaTransacao = await knex("transacoes").insert({descricao, valor, data, categoria_id, usuario_id: id, tipo}).returning("*")

        return res.status(200).json(novaTransacao)
    } catch (error) {
        return res.status(500).json({"mensagem": error.message})
    }
}

const atualizarTransacao = async(req, res) => {
    const {id} = req.usuario
    const transacaoID = req.params.id
    const {descricao, valor, data, categoria_id, tipo} = req.body

    try {
        if(tipo !== "entrada" && tipo !== "saida"){
            return res.status(400).json({"mensagem": "Tipo de transação inválido."})
        }
        const transacaoExistente = await knex("transacoes").where({id: transacaoID})
        
        if(transacaoExistente.length < 1){
            return res.status(404).json({"mensagem": "id da transação não encontrado."})
        }

        const atualizarTransacao = await knex("transacoes").where({id: transacaoID}).update({
            descricao,
            valor,
            data,
            categoria_id,
            tipo
        }).returning("*")

       
        if (atualizarTransacao.length < 1) {
            return res.status(500).json({"mensagem": "Erro ao atualizar transacao"})
        }


        return res.status(204).json("ok")
        } catch (error) {
            return res.status(500).json({"mensagem": error.message})
        }
    }

const excluirTransacao = async(req, res) => {
    const {id} = req.usuario
    const transacaoID = req.params.id

    try {
        const transacaoExistente = await knex("transacoes").where({id: transacaoID})
        
        if(transacaoExistente.length < 1){
            return res.status(404).json({"mensagem": "id da transação não encontrado."})
        }

        const excluirTransacao = await knex("transacoes").delete().where({usuario_id: id, id: transacaoID})

        if (excluirTransacao.length < 1) {
            return res.status(500).json({"mensagem": "Erro ao excluir transacao"})
        }

        return res.status(204).send()
    } catch (error) {
        return res.status(500).json({"mensagem": "Erro ao excluir transação"})
    }
}

const obterExtrato = async(req, res) => {
    const {id} = req.usuario

    try {
        const entrada = await knex("transacoes").sum("valor as valor").where({usuario_id: id, tipo: "entrada"}).groupBy("usuario_id")

        const saida = await knex("transacoes").sum("valor as valor").where({usuario_id: id, tipo: "saida"}).groupBy("usuario_id")

        return res.status(200).json({
            entrada: entrada[0]?.valor ?? 0,
            saida: saida[0]?.valor ?? 0
        })
    } catch (error) {
        return res.status(500).json({"mensagem": error.message})
    }
}


module.exports = {
    listarTransacoes,
    detalharTransacao,
    cadastrarTransacao,
    atualizarTransacao,
    excluirTransacao,
    obterExtrato
}