const Joi = require('joi');

exports.ADD_USER_MODEL = Joi.object({
    name: Joi.string().min(5).max(250).required().messages({
        "string.min": "Name must be at least 5 characters long.",
        "string.max": "Name must not exceed 250 characters.",
        "any.required": "Name is required."
    }),
    email: Joi.string().email().required().messages({
        "string.email": "Invalid email format.",
        "any.required": "Email is required."
    })
})