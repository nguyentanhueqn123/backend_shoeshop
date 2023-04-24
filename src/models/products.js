const mongoose = require('mongoose')
const typeProductSchema = require('./typeProducts')

const productSchema = new mongoose.Schema({
    nameProduct:{
        type: String,
        required: true,
    },
    typeId:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref:'TypeProduct'
    },
    price:
    {
        type: Number,
        default: 0
    },
    sale:
    {
        type: Number,
        min: 0,
        max: 100,
        default: 0
    },
    priceSale:
    {
        type:Number,
        default: function(){
            return this.price * (1- this.sale/100)
        }
    },
    image:
    {
        type:[String],
        default:''
    },
    description:
    {
        type:String,
        default: ''
    },
    createAt:
    {
        type: Date,
        require: true,
        default: Date.now,
    },
    metal:{
        type:String,
        default:''
    },
    size:{
        type:String,
        default:'',
    },
    status:{
        type: String,
        enum: ['SELLING','SOLD'],
        default: 'SELLING'
    }
    })

module.exports = mongoose.model('Product',productSchema);
