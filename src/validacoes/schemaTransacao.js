const joi = require("joi")

const schemaTransacao = joi.object({
    descricao: joi.string().required().messages({
        "any.required": "O campo descricao é obrigatório",
        "string.empty": "O campo descricao não foi preenchido"
    }),
    valor: joi.number().min(50).required().messages({
        "number.min": "O valor mínimo é de 50 centavos",
        "any.required": "O campo valor é obrigatório",
    }),
    data: joi.date().required().messages({
        "any.required": "O campo data é obrigatório",
        "date.base": "A data deve estar no formato AAAA-MM-DD."
    }),
    categoria_id: joi.number().min(1).required().messages({
        "any.required": "O campo categoria_id é obrigatório",
        "number.base": "O valor informado precisa ser um número"
    }),
    tipo: joi.string().required().messages({
        "any.required": "O campo tipo é obrigatório",
        "string.empty": "O campo tipo não foi preenchido"
    })
})

module.exports = schemaTransacao