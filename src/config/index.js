const mongoose = require('mongoose')
//ket noi phan mem voi mongodb qua string duoi
const connectString = "mongodb+srv://shoeshop:shoeshop@cluster0.zuncuhq.mongodb.net/?retryWrites=true&w=majority"
// mongodb+srv://admin1:admin1@housewarewebsitecluster.pre3w.mongodb.net/cigstore?retryWrites=true&w=majority


const connect = async () =>{
    mongoose.connect(connectString, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    //neu thanh cong thi tra ve :connect to db
    .then(() => console.log('connect to db'))
    //neu that bai => bao loi
    .catch((err) => console.log(err))
}

module.exports = {connect}