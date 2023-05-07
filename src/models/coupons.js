const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
    name:{
        type:String,
        default:''
    },
    code:{
        type:String,
        required: true,
    },
    value:{
        type: Number,
        min:1,
        max:100,
        default:1,
    },
    startDate:
    {
        type:Date,
        default:Date.now,
    },
    amount:{
        type:Number,
        min:0,
        default:1,
        required: true,
    },
    endDate:{
        type:Date,
        required: true,
    },
    status:{
        type: String,
        enum:['ACTIVE','EXPIRED'],
        default: function(){
            if((Date.now() < this.endDate)  && (this.amount>0)) 
            {
                return "ACTIVE"
            }
            else {
                return "EXPIRED"
            }
        },
    },

})

module.exports = mongoose.model('Coupon',couponSchema);
