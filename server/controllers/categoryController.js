import APIFetaures from "../utils/apiFeatures.js";
import Category from "../models/categoryModel.js";
import asyncHandler from "../helpers/asyncHandler.js";
import HttpError from "../utils/httpError.js";
import sharp from "sharp";

export const getCategories = asyncHandler(async(req , res , next)=>{

    const features = new APIFetaures(Category.find(),req.query)
        .filter()
        .sort()
        .limitFields()
        .paginate();

    const categories = await features.query;

    res.status(200).json({
        status:'success',
        result: categories.length,
        data:{categories}
    })
})


export const addCategory = asyncHandler(async(req,res,next)=>{
    const {name,image} = req.body;
    if(!name || !image)
        return next(new HttpError('Please provide name and image of the category').BadRequest());

    const category = await Category.create({name,image});

    if(!category)
        return next(new HttpError('Category could not be created',500).InternalServerError());

    res.status(201).json({
        status:'success',
        data:{category}
    })

})

export const reseizeCategoryImage = asyncHandler(async(req,res,next)=>{
    if(!req.file)
        return next();

    req.body.image = `category-${Date.now()}.jpeg`;

    await sharp(req.file.buffer)
        .resize(200,200)
        .toFormat('jpeg')
        .jpeg({quality:90})
        .toFile(`server/public/images/categories/${req.body.image}`);

    next();
})