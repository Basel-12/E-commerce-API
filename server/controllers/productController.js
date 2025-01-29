import Product from '../models/productModel.js'
import asyncHandler from '../helpers/asyncHandler.js'
import APIFetaures from '../utils/apiFeatures.js'
import HttpError from '../utils/httpError.js'
import { validateProduct , validateUpdateProduct} from '../validators/productValidator.js'
import sharp from 'sharp'

export const getAllProducts = asyncHandler(async(req , res ,next)=>{
    const features =  new APIFetaures(Product.find(),req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

    const products = await features.query;

    res.status(200).json({
        status: 'success',
        results: products.length,
        data: {products}
    });
})

export const getProduct = asyncHandler(async(req,res,next)=>{
    const {id} = req.params;

    const product = await Product.findById(id).populate({
        path: 'reviews',
        // select: '-__v -product'
    });

    if(!product){
        return next(new HttpError(`Product with id ${id} not found`).NotFound());
    }

    res.status(200).json({
        status: 'success',
        data: {product}
    });

})

export const addProduct = asyncHandler(async(req,res,next)=>{

    const {error,value} = validateProduct(req.body);

    if(error){
        return next(new HttpError(error.details[0].message).BadRequest());
    }

    const product = await Product.create(req.body);

    if(!product){
        return next(new HttpError("Could not add product").InternalServerError());
    }

    res.status(201).json({
        status: 'success',
        data: {product}
    });
})

export const updateProduct = asyncHandler(async(req,res,next)=>{

    const {id} = req.params;

    const {error,value} = validateUpdateProduct(req.body);

    if(error){
        return next(new HttpError(error.details[0].message).BadRequest());
    }

    const product = await Product.findByIdAndUpdate(id,req.body,{
        new: true,
        runValidators: true
    });

    if(!product){
        return next(new HttpError(`Product with id ${id} not found`).NotFound());
    }

    res.status(200).json({
        status: 'success',
        data: {product}
    });

})


export const deleteProduct = asyncHandler(async(req,res,next)=>{
    const {id} = req.params;

    const product = await Product.findByIdAndDelete(id);
    
    if(!product){
        return next(new HttpError(`Product with id ${id} not found`).NotFound());
    }

    res.status(204).json({
        status: 'success',
        data: null
    });
})

export const getProductByCategory = asyncHandler(async(req,res,next)=>{
    req.query.category = req.params.id;
    next();
})

export const getTop5Products = asyncHandler(async(req,res,next)=>{
    req.query.limit= 5;
    req.query.sort = '-averageRating,price';
    next();
})

export const resizeProductImages = asyncHandler(async(req,res,next)=>{
    // console.log(req.files);
    if(!req.files){
        // console.log("inside if");
        
        return next();
    }
    

    
    req.body.images =[];

    await Promise.all(req.files.map(async(image,i)=>{
        const filename = `product-${req.params.id}-${Date.now()}-${i+1}.jpeg`;
        // console.log(filename,image);
        
        await sharp(image.buffer)
        .resize(200,200)
        .toFormat('jpeg')
        .jpeg({quality: 90})
        .toFile(`server/public/images/products/${filename}`);

        req.body.images.push(filename);
    }))
    next();
})