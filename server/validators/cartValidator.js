import Joi from "joi";

const cartSchema = Joi.object({
    id: Joi.string().required(),
    items: Joi.array().items(Joi.object({
        productId: Joi.string().required(),
        quantity: Joi.number().required(),
        price: Joi.number().required()
    })).required(),
    shippingAddress: Joi.object({
        street: Joi.string().required(),
        city: Joi.string().required(),
        state: Joi.string().required(),
        zip: Joi.string().required()
    }).optional(),
    deleiveryMethod: Joi.object({
        name: Joi.string().required(),
        price: Joi.number().required(),
        duration: Joi.string().required()
    }).optional(),
}).options({stripUnknown: true})


const finalCartSchema = Joi.object({
    id: Joi.string().required(),
    items: Joi.array().items(Joi.object({
        productId: Joi.string().required(),
        quantity: Joi.number().required(),
        price: Joi.number().required()
    })).required(),
    shippingAddress: Joi.object({
        street: Joi.string().required(),
        city: Joi.string().required(),
        state: Joi.string().required(),
        zip: Joi.string().required()
    }).required(),
    deleiveryMethod: Joi.object({
        name: Joi.string().required(),
        price: Joi.number().required(),
        duration: Joi.string().required()
    }).required(),
})

export const validateCart = (cart)=>{
    return cartSchema.validate(cart,{abortEarly: false});
}

export const validateFinalCart = (cart)=>{
    return finalCartSchema.validate(cart,{abortEarly: false});
}