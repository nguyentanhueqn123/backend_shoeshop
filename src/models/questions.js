const mongoose = require('mongoose')

const questionSchema = new mongoose.Schema({
    productId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'Product',
        required: true
    },
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'User',
        required: true
    },
    question:{
        type:String,
        default:'',
    },
    questionDate:{
        type:Date,
        default:Date.now,
    },
    answer:{
        type:String,
        default: '',
    },
    answerDate:{
        type:Date,
        default:Date.now,
    }
})

module.exports = mongoose.model('Question',questionSchema);
