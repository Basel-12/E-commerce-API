import HttpError from "../utils/httpError.js";

const handleMongoValidationError = (error)=>{
    const messages = Object.values(error.errors).map((el)=> el.message);

    const errormessage = `Invalid input data. ${messages.join('.')}`

    return new HttpError(errormessage).BadRequest();
}

const handleDuplicateFields = (err)=>{
    const value = err.message.match(/(["'])(?:(?=(\\?))\2.)*?\1/)[0]
    const message = `Duplicate field value: ${value}`
    // console.log(message);
    return new HttpError(message).BadRequest();
}

const sendErrorDev = (err,res)=>{
    res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
        error: err,
        stack: err.stack
    });
};

const sendErrorProd = (err,res)=>{
    if(err?.isOperational){
        res.status(err.statuscode).json({
            status: err.status,
            message: err.message
        });
    }else{
        console.error('Error📣',err);
        res.status(500).json({
            status: 'error',
            message: 'Something went wrong'
        });
    }
}

const errorHandler = (err,req,res,next)=>{
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    if(process.env.NODE_ENV === 'development'){
        sendErrorDev(err,res);
    }
    if(process.env.NODE_ENV === 'production'){
        let error = {...err, message: err.message}

        if(err.name === 'CastError') 
            error = new HttpError(`Invalid ${err.path}: ${err.value}`).BadRequest();
        
        if(err.name === "ValidationError")
            error = handleMongoValidationError(err)
        
        if(err.code === 11000)
            error = handleDuplicateFields(err)
        
        if(err.name === "JsonWebTokenError" || err.name === "TokenExpiredError")
            error = new HttpError('Invalid Token. Please log in again',401)

        sendErrorProd(error,res);
    }
    
}

export default errorHandler