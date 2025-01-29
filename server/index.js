import 'dotenv/config'
import express from 'express'
import db from './config/db.js'
import userRoutes from './routes/userRoutes.js'
import errorHandler from './middlewares/errorHandler.js'
import cookieParser from 'cookie-parser'
import categoryRoutes from './routes/categoryRoutes.js'
import productRoutes from './routes/productRoutes.js'
import reviewRoutes from './routes/reviewRoutes.js'
import orderRoutes from './routes/orderRoutes.js'
import cartRoutes from './routes/cartRoutes.js'
import path from 'path';
import { fileURLToPath } from 'url';
import HttpError from './utils/httpError.js'
import redis  from './redis/redis.js'

const __filename = fileURLToPath(import.meta.url); // Full path to the current file
const __dirname = path.dirname(__filename); // Directory of the current file


const app = express();



//public folder
app.use('/public',express.static(path.join(__dirname,'public')));


//parse JSON
app.use(express.json({limit: '100kb'}));

//pasrse cookies
app.use(cookieParser())


//routes
app.use('/api/users',userRoutes)
app.use('/api/categories',categoryRoutes)
app.use('/api/products',productRoutes)
app.use('/api/reviews',reviewRoutes)
app.use('/api/orders',orderRoutes)
app.use('/api/carts',cartRoutes)

app.get('/',(req,res)=>{
    res.json({message:"Welcome to the API"});
})

app.all('*',(req,res,next)=>{
    next(new HttpError(`Can't find ${req.originalUrl} on this server`));
})

//error handler
app.use(errorHandler);

app.listen(process.env.PORT || 3000,()=>{
        console.log(`Server is running on port ${process.env.PORT||3000}`);
})