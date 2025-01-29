import joi from 'joi'

const loginSchema = joi.object({
    email:joi.string().email().required(),
    password: joi.string().required()
}).options({stripUnknown : true})


export const validateLogin = (user)=>{
    return loginSchema.validate(user)
}