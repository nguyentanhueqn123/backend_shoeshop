const mongoose = require('mongoose')

const connect = async () =>{
    mongoose.connect(process.env.conectionString, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    //neu thanh cong thi tra ve :connect to db
    .then(() => console.log('connect to db'))
    //neu that bai => bao loi
    .catch((err) => console.log(err))
}

module.exports = {connect}