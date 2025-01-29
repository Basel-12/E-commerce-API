import mongoose from 'mongoose';


const DB = process.env.DB_LOCAL;
// const DB = process.env.DB_HOST.replace('<db_password>',process.env.DB_PASSWORD)
// Connect to MongoDB
const dbconnection = mongoose.connect(DB,
    {
    // useNewUrlParser:true,
    // useCreateIndex:true,
    // useFindAndModify:false,
    // useUnifiedTopology: true
}).then(()=> console.log('DB connection successful!'));

export default dbconnection