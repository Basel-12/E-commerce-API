import mongoose  from 'mongoose';
import validator from 'validator'
import bcrypt from 'bcrypt'
import crypto from 'crypto'
import Address from './addressModel.js';
import { type } from 'os';


const userSchema = new mongoose.Schema(
    {
        name:{
            type: String,
            required: [true,'Please provide your name']
        },
        email:{
            type: String,
            required: [true,'Please provide your email'],
            lowercase: true,
            validate: [validator.isEmail,'Please provide a valid email'],
            unique: true,
        },
        password:{
            type: String,
            required: [true,'Please provide a password'],
            minlength: 8,
            select: false,
            validate:{
                validator: function(Val){
                    return validator.isStrongPassword(Val);
                },
                message: 'Password should contain at least 1 uppercase letter, 1 lowercase letter, 1 number and 1 special character'
            }
        },
        passwordConfirm:{
            type: String,
            required: [true,'Please confirm your password'],
            validate: {
                validator: function(el){
                    return el === this.password;
                },
                message: 'Passwords are not the same'
            }
        },
        phone:{
            type: String,
            required: [true,'Please provide your phone number'],
            validate: {
                validator: function(val){
                    return validator.isMobilePhone(val,'ar-EG')
                },
                message: 'Please provide a valid phone number'
            }
        },
        photo:{
            type: String,
            default: 'default.jpg',
        },
        address:{
            type: Address.schema,
            required: [true,'Please provide your address'],
        },
        role:{
            type: String,
            enum: ['user','admin'],
            default: 'user'
        },
        passwordChangedAt: Date,
        passwordResetToken: String,
        passwordResetExpires: Date,
        active:{
            type: Boolean,
            default: true,
            select: false
        }
    }
)

//document premiidleware to hash the password before saving it to the database
userSchema.pre('save', async function(next){
    if(!this.isModified('password')) return next();

    this.password = await bcrypt.hash(this.password,14);
    this.passwordConfirm = undefined;

    next();
})

//documnet premiidlewre to update passwordChangedAt after changing password
userSchema.pre('save', function(next){
    if(!this.isModified('password') || this.isNew) return next();
    this.passwordChangedAt = Date.now() - 1000;
    next();
})

//instance function to compare passwords
userSchema.methods.correctpassword = async function(userpassword,formpassword){
    return await bcrypt.compare(userpassword,formpassword);
}

//instance method to generate resetpassword token
userSchema.methods.generateForgetPasswordToken = function(){
    const resettoken = crypto.randomBytes(32).toString('hex');

    this.passwordResetToken = crypto.createHash('sha256').update(resettoken).digest('hex');
    this.passwordResetExpires = Date.now() + 10 * 60 * 1000

    return resettoken;
    
}

//queryy middleware to get active accounts only
userSchema.pre(/^find/,function(next){
    this.find({active: {$ne: false}})
    next();
})


//instance method to check if password changed after token issued 
userSchema.methods.changedPasswordAfter = function(jwtTime){
    if(this.passwordChangedAt)
    {
        const changedTimestamp = parseInt(this.passwordChangedAt.getTime()/1000,10);
        return changedTimestamp > jwtTime
    }
    return false;
}
const User = mongoose.model('User',userSchema);

export default User;