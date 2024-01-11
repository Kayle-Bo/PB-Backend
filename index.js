import express from 'express';
const app = express();

import http from 'http';
import { Server } from 'socket.io';
import bcrypt from 'bcrypt';
import cors from 'cors';
app.use(cors());


import typeorm from 'typeorm';
import battle  from './entities/battle.js';
import user  from './entities/user.js';
import role from './entities/role.js';
import monster from './entities/monster.js';

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
    entities: [user, role, battle, monster],
    synchronize: true,
    logging: false,
})


// Generate a random string of length 16
export function generateRandomString() {
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

export function processMove(moveData, monster) {
    //create matchcase for moveData
    switch (moveData.move) {
        case "attack":
            // Calculate the damage
            let damage = moveData.value;
            monster.health -= damage;
            return monster;
    }

}

server.listen(3001, () => {
    console.log('listening on *:3001');
});

dataSource.initialize().then(function(){

    var userRepository = dataSource.getRepository("user");
    var monsterRepository = dataSource.getRepository("monster");

    // On connection
    io.on('connection', (socket) => {

        console.log(`User connected: ${socket.id}`);

        socket.on("register_user", (user, cb) => {
            const hashedPassword = bcrypt.hashSync(user.password, 10);
            user.password = hashedPassword;
        
            userRepository.findOne({
                    where: [{ username: user.username }, { email: user.email }],
                })
                .then(existingUser => {
                    if (existingUser) {
                        // User with the same username or email already exists
                        cb(2);
                    } else {
                        // User doesn't exist, save the new user
                        userRepository
                            .save(user)
                            .then(() => {
                                cb(1);
                            })
                            .catch(error => {
                                console.error("Error saving user:", error);
                                cb(0);
                            });
                    }
                })
                .catch(error => {
                    console.error("Error checking existing user:", error);
                    cb(0);
                });
        });
        
        
socket.on("login_user", (user, cb) => {
    // Get the user repository from the data source
    var userRepository = dataSource.getRepository("user");

    // Find a user by username in the database
    userRepository.findOneBy({ username: user.username }).then(function (dbUser) {
        // Check if a user with the provided username exists
        if (dbUser != null) {
            // Compare the entered password with the hashed password in the database
            bcrypt.compare(user.password, dbUser.password).then(function (passwordMatch) {
                // Check if the passwords match
                if (passwordMatch) {
                    // Create a userDTO object with selected user information
                    let userDTO = {
                        id: user.id,
                        username: user.username,
                        email: user.email,
                        wins: user.wins,
                        losses: user.losses
                    };
                    // Call the callback with the userDTO
                    cb(userDTO);
                } else {
                    // Call back '0' the username and password do not match
                    cb(0);
                }
            }).catch(function (error) {
                // Handle errors during password comparison
                console.error("Error comparing passwords:", error);
                // Call the callback with '0' to indicate a failed login attempt
                cb(9);
            });
        } else {
            // Call back '0' the username was not found
            cb(0);
        }
    }).catch(function (error) {
        // Handle errors during user lookup
        console.error("Error finding user:", error);
        // Call the callback with '0' to indicate a failed login attempt
        cb('0');
    });
});

        

        socket.on("create_battle", (user, cb) => {
            let battleId = generateRandomString();
            let battleRoom = {
                id: battleId,
                users: [user],
                userTurn: 0,
            }
            battleRooms.push(battleRoom);
            cb(battleId);
            io.emit("rooms_updated", battleRooms);

        });

        socket.on("get_rooms", (cb) => {
            cb(battleRooms);
        });

        socket.on("join_room", (roomId, user, cb) => {
            // Find the room with the matching id
            let room = battleRooms.find(room => room.id === roomId);
            
            if (room) {
                // If the room exists, add the user to the room
                room.users.push(user);
                    
                socket.join(roomId);
                cb(roomId);

                // If this is the last player to join the room, start the game
                if (room.users.length === 2) {

                    monsterRepository.find().then(function(monster){
                        // Assign the monster to each user
                        room.users.forEach(user => {
                            let userMonster = {...monster[0]};
                            userMonster.health = userMonster.maxHealth;
                            user.monster = [userMonster];
                        });
                        
                        // Initialize the match object
                        room.match = {
                            turn: 0,
                            actions: [],
                            monsters: room.users.map(user => user.monster)
                        };
                        
                        // Flip a coin to determine who goes first between the two players
                        let turn = Math.floor(Math.random() * 2);
                        room.userTurn = room.users[turn].id;
                        console.log("setting turn to " + room.userTurn)

                        //Notify the players that the game has started and send the monster data
                        room.users.forEach(user => {
                            io.emit("game_started", room);
                        });
                    })
                }
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


        socket.on("close_room", (roomId) => {

            // Find the room with the matching id
            let roomIndex = battleRooms.findIndex(room => room.id === roomId);
            
            if (roomIndex !== -1) {
                // If the room exists, remove it from the rooms array
                battleRooms.splice(roomIndex, 1);

                // Emit 'redirect' event to all clients in this room
                io.emit("redirect", "/dashboard");

                // Disconnect all clients in this room
                io.in(roomId).fetchSockets().then((sockets) => {
                    sockets.forEach((socket) => {
                        // Emit an event to the client to redirect them
                        socket.disconnect(true);
                    });
                });

                // Emit an event to all connected clients to update their rooms data
                io.emit("rooms_updated", battleRooms);
            } else {
                //console.log("Room not found");
            }
        });

        // Use later for back and for chatting in rooms
        // socket.on('send_message', (data) => {
        //     let message = `${data.userId}: ${data.message}`;
        //     socket.to(data.room).emit('receive_message', message);
        // });


        // Handle player moves
        socket.on("player_move", (userId, roomId, moveData) => {
            // Find the room with the matching id
            let room = battleRooms.find(room => room.id === roomId);
            if (room) {
                // Check if it's the player's turn
                if(userId == room.userTurn){
                    console.log("before move")
                    console.log(room.users[0].monster[0])
                    console.log(room.users[1].monster[0])

                    let otherUser = room.users.find(user => user.id !== userId);
                    let otherMonster = otherUser.monster[0];

                    // Process the move and update the game data
                    let updatedMonsterData = processMove(moveData, otherMonster);

                    // Check if the monster's health is 0 or less
                    if (updatedMonsterData.health <= 0) {
                        room.userTurn = -1;
                    } else {
                        // Update the match object with the result of the move
                        moveData.user = userId;
                        room.match.actions.push(moveData);

                        otherUser.monster[0] = updatedMonsterData;
                        room.userTurn = otherUser.id;
                        room.match.turn += 1;
                    }
                    
                    // emit to the room that the game has been updated
                    io.emit("game_updated", room);
                }

            } else {
                console.log("Room not found");
            }
        });
    })
})

