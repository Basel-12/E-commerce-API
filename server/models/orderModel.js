import mongoose from "mongoose";
import validatoor from "validator";
import Address from "./addressModel.js";

const orderSchema = new mongoose.Schema(
    {
        user:{
            type: mongoose.Schema.ObjectId,
            required:[true, "order have to belong to user"],
            ref: 'User'
        },
        products:{
            type:[
                {
                    productId:{
                        type: mongoose.Schema.ObjectId,
                        ref: 'Product',
                        required: [true, "Product is required"]
                    },
                    quantity:{
                        type: Number,
                        default: 1,
                        required:[true, "Quantity is required"],
                    },
                    price:{
                        type: Number,
                        required: [true, "Price is required"],
                    }
                }
            ]
        },
        status:{
            type: String,
            enum: ["Pending", "Processed", "Shipped", "Delivered", "Cancelled"],
            default: "Pending",
            required: true
        },
        shippingAddress: {
            type: Address.schema,
            required: [true, "Shipping address is required"]
        },
        deleiveryMethod:{
            type:{
                name:{
                    type: String,
                    required: [true, "Delivery method name is required"]
                },
                price:{
                    type: Number,
                    required: [true, "Delivery method price is required"]
                },
                duration:{
                    type: String,
                    required: [true, "Delivery method duration is required"]
                }
            },
            required: [true, "Delivery method is required"]
        },

        total:{
            type: Number,
            required: [true, "Total is required"],
            default: 0.0
        },
        createdAt:{
            type: Date,
            default: Date.now()
        }
    }
)

const Order = mongoose.model('Order', orderSchema);

export default Order;