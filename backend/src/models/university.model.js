import mongoose from "mongoose";

const universitySchemaa = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    colleges:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"College"
        }
    ],
    abbreviation:{
        type:String,
    },
    establishYear:{
        type:Number,
    }
},{
    timestamps:true
});

export const University = mongoose.model("University",universitySchemaa);