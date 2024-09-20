const userRouter = require('./userRouter');
const newRouter = require('./newRouter');
const productRouter = require('./productRouter');
const invoiceRouter = require('./invoiceRouter');
const questionRouter = require('./questionRouter');
const couponRouter = require('./couponRouter');
const commentRouter = require('./commentRouter');

/**
 * @swagger
 * tags:
 *   - name: Users
 *     description: User management and operations
 *   - name: News
 *     description: News management and operations
 *   - name: Products
 *     description: Product management and operations
 *   - name: Invoices
 *     description: Invoice management and operations
 *   - name: Questions
 *     description: Question management and operations
 *   - name: Coupons
 *     description: Coupon management and operations
 *   - name: Comments
 *     description: Comment management and operations
 */

function route(app) {
  app.use('/user', userRouter);
  app.use('/new', newRouter);
  app.use('/product', productRouter);
  app.use('/invoice', invoiceRouter);
  app.use('/question', questionRouter);
  app.use('/coupon', couponRouter);
  app.use('/comment', commentRouter);
}

module.exports = route;
