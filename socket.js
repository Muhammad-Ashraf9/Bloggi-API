const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const app = express();

const httpServer = createServer(app);
module.exports = new Server(httpServer);

io.on("connection", (socket) => {
  console.log("socket :>> ");
  socket.emit("hello from server", 1, "2", { 3: Buffer.from([4]) });
  socket.emit("hello", "world");

  socket.on("hello from client", (...args) => {
    console.log("args :>> ", args);
  });
});
