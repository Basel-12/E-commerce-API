import express  from 'express';
import { addCategory, getCategories, reseizeCategoryImage } from '../controllers/categoryController.js';
import { limitTo, verifyLogin } from '../controllers/authController.js'
import upload from '../middlewares/upload.js';

const router = express.Router();


router
    .get('/',getCategories)
    .post('/',verifyLogin,limitTo('admin'),upload.single('image'),reseizeCategoryImage,addCategory)

export default router;