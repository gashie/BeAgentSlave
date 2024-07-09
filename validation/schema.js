const Joi = require('joi')

const schema = {
    signup: Joi.object({
        firstName: Joi.string().label("first name"),
        lastName: Joi.string().required().label("last name"),
        phone: Joi.string().required().label("phone"),
        email: Joi.string()
            .email()
            .required()
            .label("email"),
        username: Joi.string().required().label("username"),
        password: Joi.string()
            .min(8)
            .required()
            .label("password"),
    }),
    login: Joi.object({
        username: Joi.string().required().label("Username"),
        password: Joi.string()
            .required()
            .label("Password"),
    }),


};
module.exports = schema;
