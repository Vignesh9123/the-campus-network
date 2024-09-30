import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import passport from 'passport'
import session from 'express-session'


const app = express()
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

app.use('/api/v1/users', userRouter)
app.use('/api/v1/posts', postRouter)
app.use('/api/v1/comments', commentRouter)
app.use('/api/v1/groups', groupRouter)
app.use('/api/v1/projects', projectRouter)
app.use('/api/v1/tasks', taskRouter)
app.use('/api/v1/notifications', notificationRouter)

export {app}