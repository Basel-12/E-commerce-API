import cartRepository from "../repositories/cartRepository.js";
import asyncHandler from '../helpers/asyncHandler.js'
import HttpError from '../utils/httpError.js'
import {validateCart} from '../validators/cartValidator.js'


export const createCart = asyncHandler(async (req ,res , next)=>{

    const {error,value} = validateCart(req.body);

    if(error)
        return next(new HttpError(error.details[0].message).BadRequest());


    await cartRepository.createOrUpdateCart(value);

    res.status(201).json({
        success: true,
        message: "Cart created successfully"
    })
})


export const getCart = asyncHandler(async(req,res,next)=>{
    const cart =await cartRepository.getCart(req.params.id)

    if(!cart)
        return next(new HttpError("Cart not found").NotFound());

    res.status(200).json({
        success: true,
        data: {cart}
    })
})