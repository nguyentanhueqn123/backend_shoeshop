const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

//o day chuyen den router de get va post data trong mongo
router.get('/',productController.getAllProduct)
router.get('/getAllProductType',productController.getAllProductType)
router.get('/countType',productController.countTypeProductSold)
router.get('/type/:id', productController.getProductTypeById)// dung id type
router.get('/',productController.getProductFromType)// dung id type
router.get('/sort',productController.sortProduct)
router.get('/:id',productController.findProductFromId)
router.post('/type',productController.addTypeProduct)
router.post('/',productController.addProduct)
router.patch('/type/:id',productController.setTypeProduct)
router.patch('/:id',productController.setProduct)
router.delete('/:id',productController.deleteProductById)
router.delete('/type/:id',productController.deleteTypeProductById)




module.exports = router