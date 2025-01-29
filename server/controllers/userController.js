import HttpError from '../utils/httpError.js'
import asyncHandler from '../helpers/asyncHandler.js'
import User from '../models/userModel.js'
import APIFetaures from '../utils/apiFeatures.js'


const filterObject = (obj,...allowedFields)=>{
    const newObj = {};
    Object.keys(obj).forEach(el=>{
        if(allowedFields.includes(el)) newObj[el] = obj[el];
    })
    return newObj;
}

//admins only 
export const getUsers = asyncHandler(async(req,res,next)=>{
    const features = new APIFetaures(User.find(),req.query)
        .filter()
        .sort()
        .limitFields()
        .paginate();
    const users  = await features.query; 
    res.status(200).json({
        status:'success',
        result: users.length,
        data:{users}
    });
})

export const getUser = asyncHandler(async(req,res,next)=>{
    const {id} = req.params;
    
    const user = await User.findById(id);

    if(!user)
        return next(new HttpError('User Not Found').NotFound())

    res.status(200).json({
        status:'success',
        data:{user}
    })
})


export const deleteUser = asyncHandler(async(req,res,next)=>{
    const {id} = req.params

    const user = await User.findByIdAndDelete(id);

    if(!user)
        return next(new HttpError('User Not Found').NotFound())


    res.status(204).json({
        status:'success',
        data:null
    })
})

export const updateUser = asyncHandler(async(req,res,next)=>{
    const {id} = req.params;
    
    const user = await User.findByIdAndUpdate(id,req.body,{
        new:true,
        runValidators:true
    })

    if(!user)
        return next(new HttpError('User Not Found').NotFound())

    res.status(200).json({
        status:'success',
        data:{user}
    });
})

export const getMe = asyncHandler(async(req,res,next)=>{
    
    req.params.id = req.user.id;
    next();
})

export const deleteMe = asyncHandler(async(req,res,next)=>{

    const loggedInUser = await User.findByIdAndUpdate(req.user.id, {active:false});

    if(!loggedInUser)
        return next(new HttpError('User Not Found').NotFound())

    res.status(204).json({
        status:'success',
        data:null
    })
})

export const updateMe = asyncHandler(async(req,res,next)=>{
    // console.log(req.user);

    if(req.body.password || req.body.passwordConfirm)
        return next(new HttpError('You can not update password here').BadRequest())

    const filtereddata = filterObject(req.body,'name','email','address');

    const updatedUser = await User.findByIdAndUpdate(req.user.id,filtereddata,{
        new:true,
        runValidators:true
    })
    if(!updatedUser)
        return next(new HttpError('User Not Found').NotFound())

    res.status(200).json({
        status:'success',
        data:{updatedUser}
    })
})