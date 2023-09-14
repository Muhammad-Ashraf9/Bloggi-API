
const { Server } = require("socket.io");

let io;
module.exports = {
  init(httpServer) {
    io = new Server(httpServer);
    return io;
  },
  getIo() {
    if (!io) throw new Error("Socket not initialized.");
    return io;
  },
};
