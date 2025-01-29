import Review from '../models/reviewmodel.js'
import asyncHandler from '../helpers/asyncHandler.js'
import APIFetaures from '../utils/apiFeatures.js'
import HttpError from '../utils/httpError.js'
import { validateReview ,validateUpdateReview} from '../validators/reviewValidator.js'


export const getAllReviews =asyncHandler(async(req , res ,next)=>{
    const features =  new APIFetaures(Review.find(),req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

    const reviews = await features.query;

    res.status(200).json({
        status: 'success',
        results: reviews.length,
        data: {reviews}
    });
})

export const getReview = asyncHandler(async(req,res,next)=>{
    const {id} = req.params;

    const review = await Review.findById(id);

    if(!review){
        return next(new HttpError(`Review with id ${id} not found`).NotFound());
    }

    res.status(200).json({
        status: 'success',
        data: {review}
    });
})

export const addReview = asyncHandler(async(req,res,next)=>{
    const {error,value} = validateReview(req.body)

    if(error)
        return next(new HttpError(error.details[0].message).BadRequest());

    const review = await Review.create(req.body);

    if(!review)
        return next(new HttpError("Could not add review").InternalServerError());

    res.status(201).json({
        status: 'success',
        data: {review}
    });
})

export const updateReview = asyncHandler(async(req,res,next)=>{
    const {id} = req.params;

    const {error,value} = validateUpdateReview(req.body);

    if(error)
        return next(new HttpError(error.details[0].message).BadRequest());

    const review = await Review.findByIdAndUpdate(id,req.body,{
        new: true,
        runValidators: true
    });

    if(!review)
        return next(new HttpError(`Review with id ${id} not found`).NotFound());

    res.status(200).json({
        status: 'success',
        data: {review}
    })
})

export const deleteReview = asyncHandler(async(req,res,next)=>{
    const {id} = req.params;

    const review = await Review.findByIdAndDelete(id);

    if(!review)
        return next(new HttpError(`Review with id ${id} not found`).NotFound());

    res.status(204).json({
        status: 'success',
        data: null
    })
})

export const setUserProduct = asyncHandler(async(req,res,next)=>{
    if(!req.body.user) req.body.user = `${req.user._id}`;
    if(!req.body.product) req.body.product = req.params.productId;
    next();
})
