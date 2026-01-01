import express from 'express';
import cors from 'cors';
import { Server } from 'socket.io';
import cookieParser from 'cookie-parser';
import http from 'http';
import userRouter from './routes/user.routes.js';
import messageRouter from './routes/message.routes.js';
import { ApiResponse } from './utils/ApiResponse.js';

const app = express();
const server = http.createServer(app);

//set-up socket.io server
const io = new Server(server, {
    cors: {
        origin: process.env.CORS_ORIGIN,
        credentials: true,
        allowedHeaders: ['Authentication', 'Content-Type', 'Token']
    }
})

//Configuring cors
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
    allowedHeaders: ['Authentication', 'Content-Type', 'Token']
}));

//Middlewares for parsing request payload
app.use(express.static('public'));
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({
    limit: '1mb',
    extended: true
}));
app.use(cookieParser());

// store online users
let userSocketMap = {} // stored in form - {userId: socketId}

//socket.io connection handler
io.on('connection', (socket) => {
    const userId = socket.handshake.query.userId
    console.log("User connected", userId)
    if(userId){
        userSocketMap[userId]= socket.id
    }

    //emit online users to all clients
    io.emit('getOnlineUsers', Object.keys(userSocketMap))

    //handle dissconnection
    socket.on("disconnect", () => {
        console.log("User disconnected", userId)
        delete userSocketMap[userId]
        io.emit('getOnlineUsers', Object.keys(userSocketMap))
    })
})


//Routes setup
app.use('/api/user', userRouter)
app.use('/api/message', messageRouter)

app.get('/', (req, res) => {
    res.status(200).send("Welcome to the backend server")
})

//Error handling middleware
app.use((err, req, res, next) => {
    console.log(err)
    res.status(err.statusCode || 500).json(new ApiResponse(err.statusCode, {}, err.message))
})

export { 
    server,
    io, 
    userSocketMap
}