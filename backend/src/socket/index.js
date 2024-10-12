import {Socket, Server} from 'socket.io'
import { AvailableChatEvents, ChatEventEnum } from '../constants.js'
import {User} from '../models/user.model.js'
import {ApiError} from '../utils/ApiError.js'
import cookie from 'cookie'
import jwt from 'jsonwebtoken'

const mountJoinChatEvent = (socket)=>{
    socket.on(ChatEventEnum.JOIN_CHAT_EVENT, (chatRoomId)=>{
        socket.join(chatRoomId)
        console.log(`User joined chat room ${chatRoomId}`)
    })
}

//Mount typing event in future
//Mount stop typing event in future

const initializeSocketIO = (io)=>{
    return io.on("connection",async (socket)=>{
        console.log("User connected", socket.id)
        try {
           const cookies = cookie.parse(socket.handshake.headers.cookie || "")
           const token = cookies.accessToken
            console.log(cookies)
            console.log(token)
        
        //    if(!token){
        //        token = socket.handshake.auth.token
        //     }
        // if(!token){
        //     throw new ApiError(401, "Token is not passed in socket connection")
        // }
        console.log("Hello")
           const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
           if(!decodedToken){
            throw new ApiError(401, "Invalid access token")
           }
           const user = await User.findById(decodedToken?._id).select("-password -refreshToken")
           if(!user)
                throw new ApiError(401, "Invalid access token")
            socket.user = user
            socket.join(user._id.toString())
            socket.emit(ChatEventEnum.CONNECTED_EVENT)
            console.log("User connected: UserID", user._id.toString())
            mountJoinChatEvent(socket)

            socket.on(ChatEventEnum.DISCONNECT_EVENT, ()=>{
                console.log("User disconnected: UserID", socket.user._id.toString())
                if(socket.user)
                    socket.leave(user._id.toString())
            })
        } catch (error) {
            socket.emit("error", error.message)
        }
    })
}

const emitSocketEvent = (req, roomId, event, data)=>{
    req.app.get("io").in(roomId).emit(event, data)
}
export {initializeSocketIO, emitSocketEvent}