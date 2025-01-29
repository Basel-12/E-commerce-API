import slugify from "slugify";
import mongoose from "mongoose";


const categorySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required : [true, "Category name is required"],
            trim: true,
            maxLength: [32, "Category name cannot exceed 32 characters"]
        },
        image:{
            type: String,
            required: [true, "Category image is required"],
        },
        slug :String,
    }
)

//slug the name of the category
categorySchema.pre('save', function(next){
    this.slug = slugify(this.name,{lower: true});
    next();
})

// Indexing the category name to make it unique
categorySchema.index({name: 1}, {unique: true});




const Category = mongoose.model("Category", categorySchema);

export default Category;