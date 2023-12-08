const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const mongoose = require("mongoose");
const cors = require("cors");
const userRouter = require("./routes/user");
const loginRouter = require("./routes/auth");
const authMiddleware = require('./middleware/authMiddleware');

// DB connection
var app = express();
const connectionString =
  "mongodb+srv://admin:dGMpI8Dz614zQ9Xx@crypto.g1gwxfl.mongodb.net/";
const mongoDB = process.env.MONGODB_URI || connectionString;
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use(cors());
app.use("/api", loginRouter);

// Protected routes
app.use(authMiddleware.verifyToken);
app.use("/api/users", userRouter);

module.exports = app;
