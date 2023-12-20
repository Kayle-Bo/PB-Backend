const express = require('express');
const app = express();
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
app.use(cors());
const mysql = require('mysql');
const { register } = require('module');
const { createConnection } = require('net');
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
        let users = new Map(io.sockets.adapter.sids);
        let rooms = new Map(io.sockets.adapter.rooms);
        let nonMatches = new Map([...users].filter(([key]) => !rooms.has(key)));
        actualRooms = new Map([...nonMatches, ...rooms].filter(([key]) => !users.has(key)));
        //let actualRooms = getNonMatches(users, rooms)
        //console.log(actualRooms)

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

            console.log(battleRooms);
        });

        socket.on("get_rooms", (cb) => {
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
        });

        socket.on("get_room_users", (roomId, cb) => {
            let room = battleRooms.find(room => room.id === roomId);
            if (room) {
                cb(room.users);
            }
        });

        socket.on("room_filled", (room) => {
            io.emit("room_remove", room);
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
})

