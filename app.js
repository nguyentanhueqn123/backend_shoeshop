const express = require('express');
const route = require('./src/routes/index');
const cors = require('cors');
require('dotenv').config();

const db = require('./src/config/index');

const app = express();

const port = process.env.PORT;

app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(express.json());

app.use(cors());

route(app);

db.connect();
app.listen(port, function (err) {
  if (err) console.log('Error in server setup');
  console.log('Server listening on Port', port);
});
