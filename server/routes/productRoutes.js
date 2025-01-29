import express from 'express'
import { addProduct, deleteProduct, getAllProducts, getProduct, getProductByCategory, getTop5Products, resizeProductImages, updateProduct } from '../controllers/productController.js'
import {verifyLogin,limitTo} from '../controllers/authController.js'
import reviewRouter from './reviewRoutes.js'
import upload from '../middlewares/upload.js'

const router = express.Router();


router
    .get('/',getAllProducts)
    .get('/top-5-products',getTop5Products,getAllProducts)
    .get('/category/:id',getProductByCategory,getAllProducts)
    .get('/:id',getProduct)
    .post('/',verifyLogin,limitTo('admin'),addProduct)
    .patch('/:id',verifyLogin,limitTo('admin'),upload.array('images',4),resizeProductImages,updateProduct)
    .delete('/:id',verifyLogin,limitTo('admin'),deleteProduct)

router.use('/:productId/reviews',reviewRouter)

export default router;