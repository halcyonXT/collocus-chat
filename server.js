const express = require('express');
const { json, urlencoded } = express
const cors = require('cors');
require('dotenv').config()
const http = require('http');
const socketio = require('socket.io');
const cookieParser = require("cookie-parser")
const router = express.Router()
const validator = require('validator');

const connectDB = require('./config/connectDB.js')

const colors = require('colors');
const { graphqlHTTP } = require('express-graphql');

const schema = require('./schema/UserGQL')

const app = express();

app.use(cors({ 
    credentials: true,
    origin: "http://localhost:5173"
}));
app.use(json())
app.use(urlencoded({ extended: false }))
app.use(cookieParser());


const customErrorHandler = (error) => {
    return {
      message: error.message,
      locations: error.locations,
      path: error.path,
    };
  };


app.use('/graphql', graphqlHTTP({
    schema,
    graphiql: process.env.NODE_ENV === 'development',
    customFormatErrorFn: customErrorHandler
}))



const server = http.createServer(app)
connectDB()

const io = socketio(server, {
    cors: {
        origin: 'http://localhost:5173',
        methods: ['GET', 'POST'],
    },
});


io.on('connection', socket => {
    console.log('[info] New WS connection...'.cyan.bold)

    socket.broadcast.emit('message', 'A user has joined the chat');

    socket.on('chatMessage', msg => {
        io.emit("message", msg)
    })

    socket.on('disconnect', () => {
        io.emit('message', 'A user has left the chat')
    })
})

const PORT = 8080;

server.listen(PORT, () => console.log(`[success] Server running on port ${PORT}`.green.bold));