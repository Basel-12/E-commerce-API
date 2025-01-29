import Joi from "joi";

const reviewValidator = Joi.object({
    review: Joi.string().required(),
    rating: Joi.number().required().min(1).max(5),
    user: Joi.string().required(),
    product: Joi.string().required()
}).options({stripUnknown: true});


const updateReviewValidator = Joi.object({
    review: Joi.string(),
    rating: Joi.number().min(1).max(5),
}).options({stripUnknown: true});


export const validateReview = (review)=>{
    return reviewValidator.validate(review,{abortEarly: false});
}

export const validateUpdateReview = (review)=>{
    return updateReviewValidator.validate(review,{abortEarly: false});
}