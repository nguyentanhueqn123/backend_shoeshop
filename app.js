const express = require("express");
const app = express();
const mongoose = require("mongoose");
const morgan = require("morgan");
const route = require('./src/routes/index');
const db = require("./src/config/index");

//Log web
app.use(morgan("tiny"));

//Evironment variables
require("dotenv").config();

//Middleware
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.use(express.json()); //to support JSON encode

//CORS
var cors = require("cors");
app.use(cors());

app.get("/", (req, res) => res.send("Hello from homepage"));
route(app);

db.connect();

const PORT = process.env.PORT || 5000;
var server = app.listen(PORT, function () {
  var port = server.address().port;
  console.log("Server Running on port", port);
});
