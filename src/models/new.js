const mongoose = require('mongoose')
const newSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true,
    },
    content:{
        type: String,
        required: true,

    },
    image:{
        type:Array,
    },
    createAt:{
        type: Date,
        required: true,
        default: Date.now
    }
})

module.exports = mongoose.model('New',newSchema);
