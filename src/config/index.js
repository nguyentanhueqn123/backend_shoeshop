require('dotenv').config();
const cloudinary = require('cloudinary').v2;
const mongoose = require('mongoose');

const connectString = process.env.MONGODB_CONNECTION_STRING;
const connect = async () => {
  mongoose.set('strictQuery', false);
  mongoose
    .connect(connectString, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => console.log('Connect to db'))
    .catch((err) => console.log(err));
};
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

module.exports = { connect, cloudinary };
