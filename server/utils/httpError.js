class HttpError extends Error{
    constructor(message,statuscode){
        super(message);
        this.statuscode=statuscode || 500
        this.status = `${statuscode}`.startsWith('4') ? 'fail' : 'error';
        this.isOperational = true;
        Error.captureStackTrace(this,this.constructor)
    }

    BadRequest(){
        this.statuscode=400;
        return this;
    }
    Unauthorized(){
        this.statuscode=401;
        return this;
    }
    Forbidden(){
        this.statuscode=403;
        return this;
    }
    NotFound(){
        this.statuscode=404;
        return this;
    }
    InternalServerError(){
        this.statuscode=500;
        return this;
    }

    TooManyRequests(){
        this.statuscode=429;
        return this;
    }

    NotImplemented(){
        this.statuscode=501;
        return this;
    }
}

export default HttpError;