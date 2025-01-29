import express from 'express'
import {forgetPassword, limitTo, login, logOut, resetPassword, signup, updatePassword, verifyLogin} from '../controllers/authController.js'
import { deleteMe, deleteUser, getMe, getUser, getUsers, updateMe, updateUser } from '../controllers/userController.js'

const router = express.Router();


router
    .get('/',verifyLogin,limitTo('admin'),getUsers)
    .get('/getMe',verifyLogin,getMe,getUser)
    .get('/:id',verifyLogin,limitTo('admin'),getUser)
    .post('/signup',signup)
    .post('/login',login)
    .post('/forgetpassword',forgetPassword)
    .post('/logout',verifyLogin,logOut)
    .patch('/updateMe',verifyLogin,updateMe)
    .patch('/updatepassword',verifyLogin,updatePassword)
    .patch('/updateuser/:id',verifyLogin,limitTo('admin'),updateUser)
    .patch('/resetpassword/:token',resetPassword)
    .delete('/deleteMe',verifyLogin,deleteMe)
    .delete('/:id',verifyLogin,limitTo('admin'),deleteUser)

export default router