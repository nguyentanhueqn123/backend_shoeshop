
const mongoose = require('mongoose')
const bson = require('bson')
//model cua 1 user trong collection users cua mongodb
const userSchema = new mongoose.Schema({
    email:{
        type: String,
        required: true,
        unique: true,
    },
    nameAccount:{
        type: String,
        default: '',
    },
    password:{
        type: String,
        required: true,
    },
    phone:{
        type: String,
        default: ''
    },
    role:{
        type: String,
        required: true,
        enum:['ADMIN','SELLER','CEO','MANAGER','ACCOUNT','DELIVERY','CUSTOMER'],
        default: 'CUSTOMER',
    },
    cart:{
        type: [String],
        default:[]
    },
    createAt:{
        type:Date,
        required: true,
        default: Date.now
    }
})

module.exports = mongoose.model('User',userSchema);
