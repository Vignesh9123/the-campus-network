import mongoose from "mongoose";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
    },
    password:{
        type:String,
        required:[true,"Password is required"],
    },
    phone:{
        type:String,
    },
    profilePicture:{
        type:String, // cloudinary URL
    },
    bio:{
        type:String,
    },
    followers:[
        {
            type:mongoose.Types.ObjectId,
            ref:"User"
        }
    ],
    following:[
        {
            type:mongoose.Types.ObjectId,
            ref:"User"
        }
    ],
    posts:[
        {
            type:mongoose.Types.ObjectId,
            ref:"Post"
        }
    ] ,
    groups:[
        {
            type:mongoose.Types.ObjectId,
            ref:"Group"
        }
    ],
    pendingGroupRequests:[
        {
            type:mongoose.Types.ObjectId,
            ref:"Group"
        }
    ],
    engineeringDomain:{
        type:String,
        enum:["CSE","ISE", "ECE", "MECH", "CST", "EEE"]
    },
    college:{
        type:String,
        ref:"College"
    },
    yearOfGraduation:{
        type:String
    },
    socialLinks:[
        {
            type:String
        }
    ],
    joinDate:{
        type:Date,
        default:Date.now
    
    },
    lastLogin:{
        type:Date,
        default:Date.now
    },
    preferences:[
        {
            type:String
        }
    ],
    refreshToken:{
        type:String
    },
    passwordResetToken:{
        type:String
    },
    passwordResetTokenExpiry:{
        type:Date
    },
    isEmailVerified:{
        type:Boolean,
        default:false
    },
    emailVerificationToken:{
        type:String
    },
    emailVerificationTokenExpiry:{
        type:Date
    },
    loginType:{
        type:String,
        enum:["email", "google"],
        default:"email"
    }
    
  
    
}, {
    timestamps:true
}
)
userSchema.pre("save", async function(next){
    if(!this.isModified("password")) return next()

    this.password = await bcrypt.hash(this.password, 10)
    next()
})
userSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password, this.password)
}
userSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {
            _id:this._id,
            email:this.email,
            name:this.name
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn:process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}
userSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
        {
            _id:this._id,
            
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn:process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}
userSchema.methods.generatePasswordResetToken = function(){
    return jwt.sign(
        {
            _id:this._id,

        },
        process.env.PASSWORD_RESET_TOKEN_SECRET,
        {
            expiresIn:process.env.PASSWORD_RESET_TOKEN_EXPIRY
        }
    )
}
export const User = mongoose.model("User", userSchema)