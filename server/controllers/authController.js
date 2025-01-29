import User from '../models/userModel.js'
import asyncHandler from '../helpers/asyncHandler.js'
import HttpError from '../utils/httpError.js'
import jwt from 'jsonwebtoken'
import { validateLogin } from '../validators/authValidators.js'
import crypto from 'crypto';
import { sendMail } from '../utils/mailer.js'


const signToken = (options)=>{
    
    const token  = jwt.sign(options,process.env.SECRET,{
        expiresIn: '20d'
    })
    return token
}

const createCookieandSend = (user,statusCode,res)=>{

    const token = signToken({id: user._id, role: user.role})

    const cookieoptions = {
        httpOnly: true,
        expires: new Date(Date.now() + process.env.COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
    }
    if(process.env.NODE_ENV === "production") cookieoptions.secure = true;

    user.password = undefined;

    res.cookie("token", token, cookieoptions)

    res.status(statusCode).json({
        status: "success",
        token,
        data: {user}
    })
}


export const signup = asyncHandler(async (req,res,next)=>{

    const {name,email,phone,password,passwordConfirm,address} = req.body
    const user = await User.create({
        name,
        email,
        phone,
        password,
        passwordConfirm,
        address
    });

    // if the user didn't created
    if(!user)
        return next(new HttpError("Cant' sign up please try agaain later").BadRequest())

    createCookieandSend(user,201,res);

})


export const login = asyncHandler(async(req,res,next)=>{
    const {error} = validateLogin(req.body);
    // console.log(validateLogin(req.body));
    if(error)
        return next(new HttpError(error.details[0].message).BadRequest())

    const user = await User.findOne({
        email: req.body.email
    }).select('+password');


    
    if(!user || (!await user.correctpassword(req.body.password,user.password)))
        return next(new HttpError("Wrong Email or Password").Unauthorized())

    createCookieandSend(user,200,res)
})

export const verifyLogin = asyncHandler(async(req,res,next)=>{
    const token = req.cookies.token;

    if(!token)
        return next(new HttpError('You are not logged in! Please log in to get access').Unauthorized())

    const user = await jwt.verify(token,process.env.SECRET);

    //get user from database based on id in token

    const existeduser = await User.findById(user.id);
    
    //check if user still exists in database
    if(!existeduser)
        return next(new HttpError('The user belonging to this token does no longer exist',401));
    
    //check if user changed password after the token was issued
    if(existeduser.changedPasswordAfter(user.iat))
        return next(new HttpError('User recently changed password! Please log in again').Unauthorized())

    req.user = existeduser;
    next();
})

export const limitTo = (...roles)=> {
    return asyncHandler(async(req,res,next)=>{
        if(!roles.includes(req.user.role))
            return next(new HttpError(`You do not have permission to perform this action`).Forbidden())
        next();
    })
}

export const forgetPassword = asyncHandler(async(req,res,next)=>{
    
    //get user on posted email
    const {email} = req.body;

    const user = await User.findOne({email});

    if(!user)
        return next(new HttpError('Please Enter a Correct email').BadRequest());

    //generate token
    const token = await user.generateForgetPasswordToken();
    await user.save({validateBeforeSave:false})
    
    
    //sendtoken in mail
    const reseturl = `${req.protocol}://${req.get('host')}/api/users/resetpassword/${token}`
    const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${reseturl}.\nIf you didn't forget your password, please ignore this email!`;

    try{
        await sendMail({
            email:user.email, 
            subject: "Your password reset token (valid for 10 min)", 
            message
        })
        res.status(200).json({
            status: 'success',
            message : "Token sent to email"
        });
    }catch(err){
        console.log(err);
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save({validateBeforeSave: false})
        return next(new HttpError('There was an error sending the email. Try again later!').InternalServerError());
    }


})

export const resetPassword = asyncHandler(async(req,res,next)=>{

    const {password,confirmPassword} = req.body

    const token = req.params.token;

    //verify token 
    const hashedtoken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({
        passwordResetToken:hashedtoken,
        passwordResetExpires: {$gt: Date.now()}
    })

    if(!user)
        return next(new HttpError('Token is invalid or has expired').BadRequest())

    user.password = password;
    user.passwordConfirm = confirmPassword;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save()

    createCookieandSend(user,200,res);
})

//update logged in user password
export const updatePassword = asyncHandler(async(req,res,next)=>{
    const {passwordCurrent,password,passwordConfirm} = req.body;
    if(!passwordCurrent || !password || !passwordConfirm)
        return next(new HttpError(`Please Fill up Your Data`).BadRequest())
    const existeduser = await User.findById(req.user._id).select('+password');

    if(!existeduser || !(existeduser.correctpassword(passwordCurrent,existeduser.password)))
        return next(new HttpError('Wrong password').Unauthorized())


    //update password
    existeduser.password = password;
    existeduser.passwordConfirm = passwordConfirm;
    await existeduser.save()

    createCookieandSend(existeduser,200,res);
})

//logout user by clearing cookie
export const logOut = asyncHandler(async(req,res,next)=>{
    res.clearCookie('token');

    res.status(200).json({
        status: 'success',
        message: 'Logged Out'
    })
})