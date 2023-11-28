const express = require('express');
const app = express();
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
app.use(cors());
const mysql = require('mysql');
const { register } = require('module');

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
    },
});

class userdto {
    constructor(username, password) {
        this.username = username;
        this.password = password;
    }
}

const createUser = (usetDto) => {
    db.query(`INSERT INTO users username, password 
    VALUES ('${user.username}', '${user.password}')
    `, (err, result) => {
      try { 
        console.log("RESULT IS FROM DATABASE LONG NAME TO SEE")
        console.log(result);
      } catch (err) {
        console.log(err);
        // If there was an error, return 0
        cb('0');
      }
    });

}

// Create connection to database
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'PokeBattle',
});

// Connect to database
db.connect((err) => {
    if (err) {
        throw err;
    }
    console.log('Connected to database');
});

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

// On connection
io.on('connection', (socket) => {

    console.log(`User connected: ${socket.id}`);
    let users = new Map(io.sockets.adapter.sids);
    let rooms = new Map(io.sockets.adapter.rooms);
    let nonMatches = new Map([...users].filter(([key]) => !rooms.has(key)));
    actualRooms = new Map([...nonMatches, ...rooms].filter(([key]) => !users.has(key)));
    console.log("nonMatches")
    console.log(nonMatches)
    //let actualRooms = getNonMatches(users, rooms)
    //console.log(actualRooms)

    socket.on("register_user", (user, cb) =>{
        db.query(`INSERT INTO users (username, password, email) VALUES ('${user.username}', '${user.password}', '${user.email}')`, (err, result) => {
            try {
                if(result != null){
                    cb('1');
                }
                else{
                    cb('0');
                }
            } catch (err) {
                console.log(err);
                // If there was an error, return 0
                cb('0');
            }
        });
    });

    socket.on("login_user", (user, cb) => {
        db.query(`SELECT username FROM users WHERE username = '${user.username}' AND password = '${user.password}'`, (err, result) => {
            try {
                if(result != null){
                    cb(result[0].username);
                }
                else{
                    cb('0');
                }
            } catch (err) {
                console.log(err);
                // If there was an error, return 0
                cb('0');
            }
        });
    });




    socket.on("create_battle", () => {
        let battleId = generateRandomString();
        socket.emit("battle_created", battleId);

    });

    socket.on("get_rooms", () => {
        console.log("get_rooms")
        console.log(new Map(io.sockets.adapter.rooms));
    });

    socket.on("join_room", ({ roomId, userId }) => {
        console.log(`User with ID: ${userId} joined room: ${roomId}`);

        // Emit that the room has been created with the id of the room
        io.emit("room_created", roomId);
        // Emit that the user has joined the room with the id of the user
        io.emit("user_joined", userId);
    });

    socket.on("old_user", (userId) => {
        io.emit("existing_user", userId);
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


