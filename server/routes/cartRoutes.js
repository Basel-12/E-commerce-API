import express from 'express';
import {createCart,getCart} from '../controllers/cartController.js'


const router = express.Router();


router
    .post('/', createCart)
    .get('/:id',getCart)


export default router;