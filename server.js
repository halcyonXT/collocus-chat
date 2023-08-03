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

let channels = {

}

let users = {

}

const statusReport = (status, message) => {
    if (status == "info") {
        console.log(`[info] ${message}`.cyan.bold)
    } else if (status == "success") {
        console.log(`[success] ${message}`.green.bold)
    } else if (status == "error") {
        console.log(`[error] ${message}`.red.bold)
    }
}

io.on('connection', socket => {
    statusReport("info", "New WS connection")

    socket.broadcast.emit('info', 'A user has joined the chat');

    socket.on('chatMessage', msg => {
        let channel = ""
        if (users[socket.id]) {
            channel = users[socket.id]
        } else return
        if (channels[channel]) {
            channels[channel].forEach(client => {
                io.to(client).emit("message", msg);
            })
        }
    })

    socket.on('startTyping', info => {
        if (users[socket.id]) {
            channels[users[socket.id]].forEach(client => {
                if (client !== socket.id) {
                    io.to(client).emit('startTyping', {
                        name: info.name,
                        id: info.id
                    })
                }
            })
        }
    })

    socket.on('endTyping', info => {
        if (users[socket.id]) {
            channels[users[socket.id]].forEach(client => {
                if (client !== socket.id) {
                    io.to(client).emit('endTyping', {
                        name: info.name,
                        id: info.id
                    })
                }
            })
        }
    })

    socket.on('joinChannel', (channelId) => {
        socket.join(channelId);
        statusReport("info", `User ${socket.id} joined ${channelId}`)
        if (!channels[channelId]) {
          channels[channelId] = [];
        }
        if (!users[socket.id]) {
            users[socket.id] = channelId
        } else {
            channels[users[socket.id]] = channels[users[socket.id]].filter(id => id !== socket.id)
            users[socket.id] = channelId
        }
        channels[channelId].push(socket.id);
    });

    socket.on('disconnect', () => {
        if (users[socket.id]) {
            channels[users[socket.id]].filter(id => id !== socket.id);
            delete users[socket.id];
        }
    })
})

const PORT = 8080;

server.listen(PORT, () => console.log(`[success] Server running on port ${PORT}`.green.bold));