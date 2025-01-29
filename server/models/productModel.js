import mongoose from "mongoose";
import slugify from "slugify";

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Product name is required"],
            trim: true,
            maxLength: [100, "Product name cannot exceed 100 characters"],
        },
        description: {
            type: String,
            required: [true, "Product description is required"],
        },
        price:{
            type: Number,
            required: [true, "Product price is required"],
            maxLength: [5, "Product price cannot exceed 5 characters"],
            default: 0.0
        },
        category:{
            type: mongoose.Schema.ObjectId,
            ref: "Category",
            required: true
        },
        averageRating:{
            type: Number,
            min: [1.0, "Rating must be at least 1"],
            max: [5.0, "Rating cannot be more than 5"],
            default: 4.5
        },
        numRatings:{
            type: Number,
            default: 0
        },
        images:
        {
            type: [String],
        },
        inStock:{
            type: Number,
            required: true,
            default: 0
        },
        addedAt:{
            type:Date,
            default: Date.now()
        }
    },
    {
        toJSON: {virtuals: true},
        toObject: {virtuals: true},
    }
);



//slug the name of the product
productSchema.pre('save',function(next){
    this.slug = slugify(this.name);
    next();
})

//populating the category field
productSchema.pre(/^find/,function(next){
    this.populate({
        path: 'category',
        select:'-__v -image'
    })
    next();
})


productSchema.virtual('reviews',{
    ref: 'Review',
    localField: '_id',
    foreignField: 'product'
})

//creating indexes
productSchema.index({name:1,price:1,category:1});

const Product = mongoose.model("Product", productSchema);

export default Product;