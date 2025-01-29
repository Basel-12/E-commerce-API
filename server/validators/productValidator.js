import Joi from "joi";


const productValidator = Joi.object({
    name:Joi.string().required().max(100),
    description: Joi.string().required().max(1000),
    price: Joi.number().required(),
    category: Joi.string().required(),
    images: Joi.array().items(Joi.string()).min(1).max(6).required(),
    inStock: Joi.number().required(),
}).options({stripUnknown: true});

const updateProductValidator = Joi.object({
    name:Joi.string().max(100),
    description: Joi.string().max(1000),
    price: Joi.number(),
    category: Joi.string(),
    images: Joi.array().items(Joi.string()).min(1).max(6),
    inStock: Joi.number(),
}).options({stripUnknown: true});

export const  validateProduct = (data)=>{
    return productValidator.validate(data,{abortEarly:false});
}

export const validateUpdateProduct = (data)=>{
    return updateProductValidator.validate(data,{abortEarly:false});
}