import cartRepository from "../repositories/cartRepository.js";
import asyncHandler from '../helpers/asyncHandler.js'
import HttpError from '../utils/httpError.js'
import {validateFinalCart} from '../validators/cartValidator.js'
import Order from '../models/orderModel.js'
import Product from  '../models/productModel.js'
import {createPaymentIntent} from './paymentController.js'


export const createOrder = asyncHandler(async(req , res , next)=>{


    const {cartId} = req.params
    const products = [];
    let total = 0;

    const cart = await cartRepository.getCart(cartId);

    if(!cart)
        return next(new HttpError("Cart not found").NotFound());

    const {error,value} = validateFinalCart(cart);

    if(error)
        return next(new HttpError(error.details[0].message).BadRequest());

    // console.log(value.items);
    
    const productsStock = [];

    for(const item of value.items){
        const product = await Product.findById(item.productId);

        // if(!product)
        //     return next(new HttpError("Product not found").NotFound());
        if(product.inStock < item.quantity)
            return next(new HttpError(`${product.name} has only ${product.inStock} only items`).BadRequest());

        productsStock.push({
            productId: product._id,
            inStock: product.inStock - item.quantity
        })
        
        products.push({
            productId: product._id,
            quantity: item.quantity,
            price: product.price,
            ...product.toObject()
        })
        total += item.price * item.quantity;
    }

    if(value.items.length !== products.length)
        return next(new HttpError("Some products not found").NotFound());

    total += value.deleiveryMethod.price;

    total = Math.round(total);
    const paymentIntent = await createPaymentIntent(total * 100);

    const order =await Order.create({
        user:req.user._id,
        products,
        total,
        shippingAddress: value.shippingAddress,
        deleiveryMethod: value.deleiveryMethod

    })

    if(!order)
        return next(new HttpError("Order not created").InternalServerError());

    

    // const updatedProducts = await Product.updateMany(
    // {
    //     _id: {$in: productsStock.map(product=>product.productId)}
    // },
    // productsStock.map(product => ({
    //         updateOne: {
    //             filter: { _id: product.productId },
    //             update: { $set: { inStock: product.inStock } }
    //         }
    // })))

    await updateStock(productsStock);
    // console.log(updatedProducts);


    res.status(201).json({
        success: true,
        clientSecret: paymentIntent,
        data: {order}
    })

    // await cartRepository.deleteCart(cartId);


})


export const getAllOrders = asyncHandler(async(req,res,next)=>{
    const orders = await Order.find();

    return res.status(200).json({
        success: true,
        data: {orders}
    })
})


export const getUserOrders = asyncHandler(async(req,res,next)=>{
    const orders = await Order.find({user: req.user._id});

    return res.status(200).json({
        success: true,
        data: {orders}
    })

})

export const getOrder = asyncHandler(async(req,res,next)=>{
    const order = await Order.findById(req.params.id)
    .populate({
        path: 'products.productId',
        select: 'name images'
    })
    ;

    if(!order)
        return next(new HttpError("Order not found").NotFound());

    return res.status(200).json({
        success: true,
        data: {order}
    })
})




const updateStock = async(productsStock)=>{

    const bulkOperation = productsStock.map(product => (
    {
        updateOne: {
            filter: { _id: product.productId },
            update: { $set: { inStock: product.inStock } }
        }
    }
    ))

    const updatedProducts = await Product.bulkWrite(bulkOperation);

    return updatedProducts;

}