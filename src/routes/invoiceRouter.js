const express = require('express');
const router = express.Router();
const invoiceController = require('../controllers/invoiceController');

router.get('/user/:id',invoiceController.getUserId)
router.get('/',invoiceController.getAllInvoice)
router.get('/status',invoiceController.getInvoiceStatus)
router.get('/bestSeller',invoiceController.sortBestSeller)
router.post('/',invoiceController.addInvoice)
router.post('/product/:id',invoiceController.addProduct)
router.patch('/:id',invoiceController.setInvoice)
router.delete('/:id',invoiceController.deleteInvoiceFromId)
router.delete('/product/:id',invoiceController.deleteProduct)

router.get('/cost',invoiceController.getTotal)
router.get('/total',invoiceController.getCount)

module.exports = router