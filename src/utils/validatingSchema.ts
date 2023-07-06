import joi from "joi";

export const registerSchema = joi.object({
    email: joi.string().email().required(),
    password: joi.string().min(2).required(),
    firstName: joi.string().min(2).required(),
    lastName: joi.string().min(2).required(),
    name: joi.string().min(2).required(),
    role: joi.string().valid('ADMIN', 'USER').empty(),
})
export const loginSchema = joi.object({
    identifier: joi.alternatives().try(
        joi.string().email().lowercase().required(),
        joi.string().min(2).max(255).required()
    ),
    password: joi.string().min(2).required(),
})

export const createQuestion = joi.object({
    title: joi.string().min(2).required(),
    body: joi.string().min(2).required(),
})

export const updateQuestion = joi.object({
    title: joi.string().min(2),
    body: joi.string().min(2),
    id: joi.string().uuid().required().empty(),
})
export const createAnswer = joi.object({
    body: joi.string().min(2).required(),
})
export const updateAnswer = joi.object({
    body: joi.string().min(2),
})
