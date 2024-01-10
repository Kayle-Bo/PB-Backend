// index.test.mjs
import { expect } from 'chai';
import { Server } from 'socket.io';
import http from 'http';
import { processMove, generateRandomString } from '../index.js';
import socketIOClient from 'socket.io-client';

// Setup: Create an HTTP server and Socket.IO server
describe('Socket Server Tests', () => {
  let server;
  let io;
  let socket;

  // Before all tests, start the server
  before((done) => {
    const httpServer = http.createServer();
    io = new Server(httpServer);
    server = httpServer.listen(3002, done);
  });

  // Before each test, connect a new Socket.IO client
  beforeEach(() => {
    socket = socketIOClient('http://localhost:3002');
  });

  // After each test, disconnect the Socket.IO client
  afterEach(() => {
    socket.disconnect();
  });

  // After all tests, close the server
  after((done) => {
    server.close(done);
  });

  // Test cases

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
