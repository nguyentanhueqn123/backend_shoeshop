const mongoose = require('mongoose');
const invoiceSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  product: {
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
      },
    ],
    default: [],
  },
  phone: {
    type: String,
    default: '',
  },
  time: {
    type: Date,
    default: Date.now,
  },
  address: {
    type: String,
    default: '',
  },
  cost: {
    type: Number,
    default: '0',
  },
  amount: {
    type: Number,
    default: '0',
  },
  paymentMethod: {
    type: String,
    enum: ['COD', 'CARD'],
    default: 'COD',
  },
  status: {
    type: String,
    enum: ['PENDING', 'DELIVERED', 'CANCEL', 'PROCESSING'],
    default: 'PENDING',
  },
});

module.exports = mongoose.model('Invoice', invoiceSchema);
