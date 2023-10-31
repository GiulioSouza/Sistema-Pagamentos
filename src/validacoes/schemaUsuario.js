const joi = require("joi")

const schemaUsuario = joi.object({
    nome: joi.string().required().messages({
        "any.required": "O campo nome é obrigatório",
        "string.empty": "O campo nome não foi preenchido"
    }),
    email: joi.string().required().messages({
        "any.required": "O campo email é obrigatório",
        "string.email": "O campo email precisa ter um formato válido",
        "string.empty": "O campo email não foi preenchido"
    }),
    senha: joi.string().min(5).required().messages({
        "any.required": "O campo senha é obrigatório",
        "string.min": "Senha precisa ter no mínimo 5 caracteres",
        "string.empty": "O campo senha não foi preenchido"
    })
})

module.exports = schemaUsuario