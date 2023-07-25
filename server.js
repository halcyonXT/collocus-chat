const express = require('express');
const cors = require('cors');
const http = require('http');
const socketio = require('socket.io');

const app = express();
app.use(cors());

const server = http.createServer(app)
const io = socketio(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
  },
});


io.on('connection', socket => {
    console.log('New WS connection...')

    socket.broadcast.emit('message', 'A user has joined the chat');

    socket.on('disconnect', () => {
        io.emit('message', 'A user has left the chat')
    })
})

const PORT = 8080;

server.listen(PORT, () => console.log('Server running on port ' + PORT));
