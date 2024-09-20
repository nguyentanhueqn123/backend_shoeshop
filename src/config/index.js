const mongoose = require('mongoose');
const connectString = process.env.MONGODB_CONNECTION_STRING;
const connect = async () => {
  mongoose
    .connect(connectString, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => console.log('Connect to db'))
    .catch((err) => console.log(err));
};

module.exports = { connect };
