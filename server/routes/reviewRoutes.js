import express from 'express'
import { addReview, deleteReview, getAllReviews, getReview, setUserProduct, updateReview } from '../controllers/reviewController.js'
import { limitTo, verifyLogin } from '../controllers/authController.js'

const router = express.Router({mergeParams: true});

router.use(verifyLogin)

router
    .post('/',limitTo('user'),setUserProduct,addReview)
    .get('/',getAllReviews)
    .get('/:id',getReview)
    .patch('/:id',limitTo('admin','user'),updateReview)
    .delete('/:id',limitTo('admin','user'),deleteReview)



export default router;