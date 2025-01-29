import multer  from "multer";
import HttpError from "../utils/httpError.js";

const storage = multer.memoryStorage();


const fileFilter = (req, file, cb) => {

    if(file.mimetype.startsWith("image")){
        cb(null, true);
    }else{
        cb(new HttpError("Not an image! Please upload only images").BadRequest(), false);
    }
}


const upload = multer({
    storage,
    fileFilter
});

export default upload;