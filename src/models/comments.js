const mongoose = require('mongoose')
const productSchema = require('./products')
const userSchema = require('./user')

const commentSchema = new mongoose.Schema({
    productId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'Product',
        required: true,
    },
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'User',
        required: true,
    },
    content:{
        type:String,
    },
    star:{
        type:Number,
        min:1,
        max:5,
    },
    createAt:{
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('Comment',commentSchema);