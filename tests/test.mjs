import { expect } from 'chai';
import { Server } from 'socket.io';
import http from 'http';
import { processMove, generateRandomString } from '../index.js';
import socketIOClient from 'socket.io-client';

let server;
let io;
let socket;

// Function to set up the necessary environment for tests
function setup() {
  // Create an HTTP server and a Socket.IO server
  const httpServer = http.createServer();
  io = new Server(httpServer);
  
  // Start the server on port 3002
  server = httpServer.listen(3002);

  // Connect a new Socket.IO client for each test
  socket = socketIOClient('http://localhost:3002');
}

// Function to clean up and tear down the environment after tests
function teardown() {
  // Disconnect the Socket.IO client after each test
  socket.disconnect();
  socket = null;

  // Close the Socket.IO server
  io.close();
  io = null;

  // Close the HTTP server
  server.close();
  server = null;
}


// Test cases
describe('Socket Server Tests', () => {
  // Before all tests, set up the environment
  before(() => {
    setup();
  });

  // After all tests, clean up and tear down the environment
  after(() => {
    teardown();
  });

  // Test Case: Check if generateRandomString produces a string of the expected length
  it('should generate a random string', () => {
    const randomString = generateRandomString();
    expect(randomString).to.have.lengthOf(16);
  });

  // Test Case: Check if processMove updates the monster's health correctly
  it('should process player move and update monster health', () => {
    const moveData = { move: 'attack', value: 10 };
    const initialMonster = { health: 50 };

    const updatedMonster = processMove(moveData, initialMonster);
    expect(updatedMonster.health).to.equal(40);
  });
});
