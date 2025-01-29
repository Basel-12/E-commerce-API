import { createOrder, getAllOrders, getOrder } from '../controllers/orderController.js';
import express from 'express';
import {verifyLogin,limitTo} from '../controllers/authController.js'

const router = express.Router();

router.use(verifyLogin);

router
    .post('/:cartId',limitTo('user'),createOrder)
    .get('/',limitTo('admin'),getAllOrders)
    .get('/myorders',limitTo('user'),getAllOrders)
    .get('/:id',limitTo('admin','user'),getOrder)

export default router;