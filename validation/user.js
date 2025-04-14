const Joi = require('joi');

exports.SIGNUP_USER_MODEL = Joi.object({
    name: Joi.string().min(5).max(250).required().messages({
        "string.min": "Name must be at least 5 characters long.",
        "string.max": "Name must not exceed 250 characters.",
        "any.required": "Name is required."
    }),
    email: Joi.string().email().required().messages({
        "string.email": "Invalid email format.",
        "any.required": "Email is required."
    }),
    password: Joi.string().min(6).max(12).required().messages({
        "string.min": "Password must be at least 6 characters long.",
        "string.max": "Password must not exceed 12 characters.",
        "any.required": "Password is required."
    }),
    role: Joi.string().valid('TOURIST', 'ADMIN', 'BUSINESS').required().messages({
        "any.only": "Role not valid.",
        "any.required": "Role is required."
    })
})

exports.SIGNIN_USER_MODEL = Joi.object({
    email: Joi.string().email().required().messages({
        "string.email": "Invalid email format.",
        "any.required": "Email is required."
    }),
    password: Joi.string().min(6).max(12).required().messages({
        "any.required": "Password is required."
    })
})