import mongoose from "mongoose";
import Product from './productModel.js';

const reviewSchema = new mongoose.Schema(
    {
        review:{
            type:String,
            required: [true, "Review is required"],
        },
        rating:{
            type:Number,
            required: [true, "Rating is required"],
            min: [1.0, "Rating must be at least 1"],
            max: [5.0, "Rating cannot be more than 5"],
        },
        user:{
            type: mongoose.Schema.ObjectId,
            ref:"User",
            required: true
        },
        product:{
            type: mongoose.Schema.ObjectId,
            ref:"Product",
            required: true
        },
        createdAt:{
            type: Date,
            default: Date.now()
        }
    },
)


//document middleware to calculate average rating and number of ratings
reviewSchema.post('save',async function(){
    await this.constructor.calculateAverageRating(this.product);
})

//Query middleware to calculate average rating and number of ratings
reviewSchema.pre(/^findOneAnd/,async function(next){
    this.r = await this.clone().findOne();
    next();
})

reviewSchema.post(/^findOneAnd/,async function(){
    await this.r.constructor.calculateAverageRating(this.r.product);
});

//static method to calculate average rating and number of ratings
reviewSchema.statics.calculateAverageRating = async function(productId){
    const stats = await this.aggregate([
        {
            $match: {product: productId}
        },
        {
            $group:{
                _id: '$product',
                nRating: {$sum: 1},
                avgRating: {$avg: '$rating'}
            }
        }
    ])

    if(stats.length > 0){
        await Product.findByIdAndUpdate(productId,{
            averageRating: stats[0].avgRating,
            numRatings: stats[0].nRating
        })
    }else{
        await Product.findByIdAndUpdate(productId,{
            averageRating: 4.5,
            numRatings: 0
        })
    }

}

//Do not allow a user to review a product more than once
reviewSchema.index({product:1,user:1},{unique:true});

const Review = mongoose.model("Review",reviewSchema);

export default Review;