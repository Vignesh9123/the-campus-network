import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    userId:{
        type:String,
        required:true,
        unique:true
    },
    name:{
        type:String,
    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
    },
    password:{
        type:String,
    },
    phone:{
        type:String,
    },
    profilePicture:{
        type:String,
    },
    bio:{
        type:String,
    },
    followers:{
        type:[mongoose.Types.ObjectId],
        default:[],
        ref:"User"
    },
    following:{
        type:[mongoose.Types.ObjectId],
        default:[],
        ref:"User"
    },
    posts:[
        {
            type:mongoose.Types.ObjectId,
            ref:"Post"
        }
    ] ,
    EngineeringDomain:{
        type:String,
        enum:["CSE","ISE", "ECE", "MECH", "CST", "EEE"]
    },
    University:{
        type:String
    },
    YearOfGraduation:{
        type:String
    },
    socialLinks:{
        type:[String],
        default:[]
    },
    joinDate:{
        type:Date,
        default:Date.now
    
    },
    lastLogin:{
        type:Date,
        default:Date.now
    },
    preferences:{
        type:[String],
        default:[]
    }
  
    
}, {
    timestamps:true
}
)

export const User = mongoose.model("User", userSchema)