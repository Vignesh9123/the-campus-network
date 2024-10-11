import express from "express";
import connectDB from "./db/index.js";
import dotenv from "dotenv";
import { httpServer } from "./app.js";
dotenv.config({
    path: "./.env"
})

connectDB()
.then(
    ()=>{
        httpServer.listen(process.env.PORT || 8000, ()=>{
            console.log(`Server is running at port : ${process.env.PORT}`);
        })
    }
)
.catch(
    (err) => {
        console.log("MongoDB connection error", err);
    }
)