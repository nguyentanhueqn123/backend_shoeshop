const mongoose = require('mongoose');
const typeProductSchema = new mongoose.Schema({
  nameType: {
    type: String,
    required: true,
    unique: true,
  },
  note: {
    type: String,
    default: '',
  },
});

module.exports = mongoose.model('TypeProduct', typeProductSchema);
