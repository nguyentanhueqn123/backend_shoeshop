const express = require('express');
const router = express.Router();
// const verifyToken = require('../middleware/auth');
const userController = require('../controllers/userController');

router.post('/register', userController.register);
router.post('/login', userController.login);
router.post('/refresh', userController.refreshToken);

// Protected routes
// router.use(verifyToken);

router.post('/logout', userController.logout);

router.get('/', userController.getAllUser);
router.get('/customers', userController.getAllCustomers);
router.get('/staff', userController.getStaff);
router.get('/:id', userController.getOneUser);
router.patch('/changeInfor/:id', userController.changeInfo);
router.delete('/:id', userController.deleteUser);

router.post('/cart/:id', userController.addToCart);
router.delete('/cart/:id', userController.removeFromCart);

module.exports = router;
