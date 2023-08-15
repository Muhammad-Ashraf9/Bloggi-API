const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

require("dotenv").config();

const {
  serverErrorHandler,
  notFoundErrorHandler,
} = require("./controllers/error");

const feedRouter = require("./routes/feed");
const port = process.env.PORT || 8080;

const app = express();
// app.use(bodyParser.urlencoded({ extended: false }));

// app.use(bodyParser.json());

app.use(cors());

mongoose
  .connect(process.env.MONGODB_URL_LOCAL)
  .then(() => {
    app.listen(port, () => {
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
app.use(notFoundErrorHandler);
app.use(serverErrorHandler);
