const asyncHandler = (fn,errmessage)=> (req,res,next)=>{
    fn(req,res,next).catch(next)
}

export default asyncHandler;