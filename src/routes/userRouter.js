const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/auth')
const userController = require('../controllers/userController');

//o day chuyen den router de get va post data trong mongo
router.get('/verify',verifyToken,userController.getUser)
router.get('/userRole',userController.getUserRole)
router.get('/customers', userController.getAllCustomers)
router.get('/getStaff',userController.getStaff)


router.get('/',userController.getAllUser)
router.get('/:id',userController.getOneUser)


router.post('/login',userController.Login)
router.post('/register',userController.Register)
router.patch('/changeAdmin/:id',userController.changeRoleAdmin)
router.patch('/changeCustomer/:id',userController.changeRoleCustomer)
router.delete('/:id',userController.deleteUserFromId)

router.post('/cart/:id',userController.addCart)
router.delete('/cart/:id',userController.deleteCart)

module.exports = router