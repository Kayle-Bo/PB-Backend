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

function generateRandomString(){
    let result = '';
    const length = 16;
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    return result;
}

server.listen(3001, () => {
    console.log('listening on *:3001');
});

io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);
    io.sockets.adapter.rooms.forEach((users, key) => {
        if(key == socket.id){
            io.sockets.adapter.rooms.delete(key)
            console.log(io.sockets.adapter.rooms)

        }
        if(io.sockets.adapter.rooms.size > 0){
            console.log(users.size)
            console.log("non empty")
        }
    });
    
    socket.on("find_battle", (data) => {
        if(io.sockets.adapter.rooms.size <= 0){
            let room = generateRandomString();
            socket.join(room);
            console.log(`User with ID: ${socket.id} joined room: ${room}`);
            console.log(io.sockets.adapter.rooms)
            let message = `${socket.id} joined`;
            socket.to(room).emit("receive_message", message);
        }
        else{
            io.sockets.adapter.rooms.forEach((users, key) => {
                if(users.size == 1){
                    socket.join(key);
                    console.log(`User with ID: ${socket.id} joined room: ${key}`);
                    console.log(io.sockets.adapter.rooms)
                    let message = `${socket.id} joined`;
                    socket.to(key).emit("receive_message", message);
                }
                else{
                    let room = generateRandomString();
                    socket.join(room);
                    console.log(`User with ID: ${socket.id} joined room: ${room}`);
                    console.log(io.sockets.adapter.rooms)
                    let message = `${socket.id} joined`;
                    socket.to(room).emit("receive_message", message);
                }
            });
        }
        
    });

    socket.on("join_room", (room) => {
        socket.join(room);
        console.log(`User with ID: ${socket.id} joined room: ${room}`);
        console.log(io.sockets.adapter.rooms)
        

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


