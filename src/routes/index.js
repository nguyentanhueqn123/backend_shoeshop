const userRouter = require('./userRouter');
const productRouter = require('./productRouter')


function route(app) {
    app.use('/user', userRouter);
    app.use('/product',productRouter);
}


module.exports = route