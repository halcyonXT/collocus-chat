const express = require('express');
const { json, urlencoded } = express
const cors = require('cors');
require('dotenv').config()
const http = require('http');
const socketio = require('socket.io');
const cookieParser = require("cookie-parser")
const expressValidator = require("express-validator");
const router = express.Router()
const mongoose = require('mongoose')
const { graphqlHTTP } = require('express-graphql');

const schema = require('./models/UserGQL')

const app = express();
app.use(cors());
app.use(json())
app.use(urlencoded({ extended: false }))
app.use(cookieParser());
app.use(expressValidator());

app.use('/graphql', graphqlHTTP({
    schema,
    graphiql: process.env.NODE_ENV === 'development'
}))

mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log('[success] MongoDB connected'))
    .catch((err) => console.log('[error]' + err))

const server = http.createServer(app)
const io = socketio(server, {
    cors: {
        origin: 'http://localhost:5173',
        methods: ['GET', 'POST'],
    },
});


io.on('connection', socket => {
    console.log('[success] New WS connection...')

    socket.broadcast.emit('message', 'A user has joined the chat');

    socket.on('disconnect', () => {
        io.emit('message', 'A user has left the chat')
    })
})

const PORT = 8080;

server.listen(PORT, () => console.log('[success] Server running on port ' + PORT));