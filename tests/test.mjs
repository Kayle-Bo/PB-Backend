// index.test.mjs
import { expect } from 'chai';
import { Server } from 'socket.io';
import http from 'http';
import { processMove, generateRandomString } from '../index.js';
import socketIOClient from 'socket.io-client';

// Setup and teardown code
let server;
let io;
let socket;

function setup() {
  const httpServer = http.createServer();
  io = new Server(httpServer);
  server = httpServer.listen(3002);

  socket = socketIOClient('http://localhost:3002');
}

function teardown() {
  socket.disconnect();
  socket = null;

  io.close();
  io = null;

  server.close();
  server = null;
}

// Test cases
describe('Socket Server Tests', () => {
  before(() => {
    setup();
  });

  after(() => {
    teardown();
  });

  it('should generate a random string', () => {
    const randomString = generateRandomString();
    expect(randomString).to.have.lengthOf(16);
  });

  it('should process player move and update monster health', () => {
    const moveData = { move: 'attack', value: 10 };
    const initialMonster = { health: 50 };

    const updatedMonster = processMove(moveData, initialMonster);
    expect(updatedMonster.health).to.equal(40);
  });
});
