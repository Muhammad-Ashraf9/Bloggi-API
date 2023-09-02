const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { createServer } = require("http");
const { Server } = require("socket.io");

require("dotenv").config();

const {
  serverErrorHandler,
  notFoundErrorHandler,
} = require("./controllers/error");

const feedRouter = require("./routes/feed");
const authRoutes = require("./routes/auth");

const port = process.env.PORT || 8080;

const app = express();

const httpServer = createServer(app);
const io = new Server(httpServer);

app.use(cors());

mongoose
  .connect(process.env.MONGODB_URL_LOCAL)
  .then(() => {
    io.on("connection", (socket) => {
      console.log("socket :>> ");
      socket.emit("hello from server", 1, "2", { 3: Buffer.from([4]) });
      socket.emit("hello", "world");

      socket.on("hello from client", (...args) => {
        console.log("args :>> ", args);
      });
    });
    httpServer.listen(port, () => {
      console.log(`server started on ${port} `);
    });
  })
  .catch((err) => {
    err.statusCode = 500;
    err.messege = `err db`;
    console.log(err);
  });
app.use("/images", express.static("images"));
app.use("/feed", feedRouter);
app.use(authRoutes);
app.use(notFoundErrorHandler);
app.use(serverErrorHandler);
