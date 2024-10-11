import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import passport from 'passport'
import session from 'express-session'
import { initializeSocketIO } from './socket/index.js';
import { createServer } from 'http';

const app = express()
const httpServer = createServer(app);

const io = new Server(httpServer,
    {
        cors: {
            origin: process.env.CORS_ORIGIN,
            methods: ["GET", "POST"],
            transports: ["polling", "websocket"],
            credentials: true,
        },
        allowEIO3: true
    }

)

app.set('io', io);
app.use(cookieParser())
app.use(cors({
    origin: process.env.CORS_ORIGIN,
  credentials: true,
}))

app.use(express.json({limit:"16kb"}))
app.use(express.urlencoded({extended:true,limit:"16kb"}))
app.use(express.static("public"))


//required for passport
app.use(session({ secret: process.env.EXPRESS_SESSION_SECRET, resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

import userRouter from './routes/user.routes.js'
import postRouter from './routes/post.routes.js'
import commentRouter from './routes/comment.routes.js'
import groupRouter from './routes/group.routes.js'
import projectRouter from './routes/project.routes.js'
import taskRouter from './routes/task.routes.js'
import notificationRouter  from './routes/notification.routes.js'
import chatRouter from './routes/chat.routes.js'
import messageRouter from './routes/message.routes.js'
import { Server } from 'socket.io';

app.use('/api/v1/users', userRouter)
app.use('/api/v1/posts', postRouter)
app.use('/api/v1/comments', commentRouter)
app.use('/api/v1/groups', groupRouter)
app.use('/api/v1/projects', projectRouter)
app.use('/api/v1/tasks', taskRouter)
app.use('/api/v1/notifications', notificationRouter)
app.use('/api/v1/chats', chatRouter)
app.use('/api/v1/messages', messageRouter)
initializeSocketIO(io)
export {httpServer}