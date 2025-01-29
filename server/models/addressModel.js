import mongoose from "mongoose";
import validator from 'validator'


const addressSchema = new mongoose.Schema(
    {
        street: { 
            type: String, 
            required: [true,'address must have a street'] 
        },
        city: { 
            type: String, 
            required: [true,'address must have a city'] 
        },
        state: { 
            type: String, 
            required: [true,'address must have a state'] 
        },
        zip: { 
            type: String, 
            required: [true,'address must have a zip code'],
            validate: {
                validator: function(val){
                    return /^\d{5}$/.test(val)
                },
                message: "Enter a valid zip code"
            }
        },
        
    }
)

const Address = mongoose.model('Address',addressSchema)

export default Address