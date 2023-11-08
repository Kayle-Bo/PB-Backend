const express = require('express');
const app = express();
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
    },
});

server.listen(3001, () => {
    console.log('listening on *:3001');
});

io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);

    socket.on("join_room", (room) => {
        socket.join(room);
        console.log(`User with ID: ${socket.id} joined room: ${room}`);

        let message = `${socket.id} joined`;
        socket.to(room).emit("receive_message", message);
    });

    socket.on("disconenct", () => {
        console.log(`User disconnected: ${socket.id}`);

        let message = `User: ${socket.id} left`;
        socket.to(data).emit("receive_message", message);
    });

    socket.on('send_message', (data) => {
        let message = `${data.userId}: ${data.message}`;
        socket.to(data.room).emit('receive_message', message);
    });
})

