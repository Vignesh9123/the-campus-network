import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDB = async()=>{
    try {
        const db = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
        db.connection.on("connected",()=>{
            console.log("MongoDB connected with host: ",db.connection.host);
        })
        db.connection.on("error",(error)=>{
            console.log("MongoDB connection error", error);
            process.exit(1);
        })
        db.connection.on("disconnected",()=>{
            console.log("MongoDB disconnected");
        })
        console.log("MongoDB connected", db.connection.host);
    } catch (error) {
        console.log("MongoDB connection failed",error);
        process.exit(1);
    }
}

export default connectDB;