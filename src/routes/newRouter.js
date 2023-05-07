const express = require('express');
const router = express.Router();
const newController = require('../controllers/newController');

//o day chuyen den router de get va post data trong mongo
router.get('/',newController.getAllNew)
router.get('/:id',newController.findNewFromId)
router.post('/',newController.addNew)

router.patch('/:id',newController.setNew)
router.delete('/:id',newController.deleteNewFromId)


module.exports = router