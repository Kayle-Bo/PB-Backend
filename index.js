const express = require('express');
const app = express();
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
app.use(cors());
const mysql = require('mysql');
const { register } = require('module');
const typeorm = require("typeorm")


const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
        rejectUnauthorized: false,
    },
});

let battleRooms = [];

var dataSource = new typeorm.DataSource({
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: "root",
    password: "",
    database: "pokebattle",
    entities: [require("./entities/user.js"), require("./entities/role.js")],
    synchronize: true,
    logging: false,
})


// Generate a random string of length 16
function generateRandomString() {
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

dataSource.initialize().then(function(){

    // On connection
    io.on('connection', (socket) => {

        console.log(`User connected: ${socket.id}`);

        socket.on("register_user", (user, cb) =>{
            var userRepository = dataSource.getRepository("user");
            userRepository.save(user);
        });


        socket.on("login_user", (user, cb) => {
            var userRepository = dataSource.getRepository("user");
            userRepository.findOneBy({username: user.username}).then(function(user){
                if(user != null){
                    userRepository.findOneBy({username: user.username, password: user.password}).then(function(user){
                        if(user != null){
                            userDTO = {
                                id: user.id,
                                username: user.username,
                                email: user.email,
                                wins: user.wins,
                                losses: user.losses
                            }
                            cb(userDTO);
                        }
                        else{
                            cb('0');
                        }
                    })
                }
                else{
                    cb('0');
                }
            })
        });

        socket.on("create_battle", (user, cb) => {
            let battleId = generateRandomString();
            let battleRoom = {
                id: battleId,
                users: [user]
            }
            battleRooms.push(battleRoom);
            cb(battleId);
            io.emit("rooms_updated", battleRooms);

        });

        socket.on("get_rooms", (cb) => {
            console.log("Getting rooms")
            console.log(battleRooms)
            cb(battleRooms);
        });

        socket.on("join_room", (roomId, user, cb) => {
            // Find the room with the matching id
            let room = battleRooms.find(room => room.id === roomId);
            
            if (room) {
                // If the room exists, add the user to the room
                room.users.push(user);
                console.log("User added to existing room");
                console.log(battleRooms);
                    
                // Add the user to the socket room
                socket.join(roomId);
                cb(roomId);
            } else {
                console.log("Room not found");
            }
            // Emit that the user has joined the room with the id of the user
            io.emit("user_joined", user);
            io.emit("rooms_updated", battleRooms);

        });

        socket.on("get_room_users", (roomId, cb) => {
            let room = battleRooms.find(room => room.id === roomId);
            if (room) {
                cb(room.users);
            }
        });



        // To handle the "close_room" event
        socket.on("close_room", (roomId) => {

            // Find the room with the matching id
            let roomIndex = battleRooms.findIndex(room => room.id === roomId);
            
            if (roomIndex !== -1) {
                // If the room exists, remove it from the rooms array
                battleRooms.splice(roomIndex, 1);
                console.log(`Room ${roomId} closed`);
                console.log(battleRooms);

                // Emit 'redirect' event to all clients in this room
                io.emit("redirect", "/dashboard");

                // Disconnect all clients in this room
                io.in(roomId).fetchSockets().then((sockets) => {
                    console.log(`Backend socket ids in room ${roomId}: ${sockets.map(socket => socket.id)}`);
                    sockets.forEach((socket) => {
                        // Emit an event to the client to redirect them
                        socket.disconnect(true);
                    });
                });


                // Emit an event to all connected clients to update their rooms data
                io.emit("rooms_updated", battleRooms);
            } else {
                console.log("Room not found");
            }
        });




        socket.on('send_message', (data) => {
            let message = `${data.userId}: ${data.message}`;
            socket.to(data.room).emit('receive_message', message);
        });

    })
})

