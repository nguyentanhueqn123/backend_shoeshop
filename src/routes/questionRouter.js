const express = require('express');
const router = express.Router();
const questionCotroller = require('../controllers/questionController')

//o day chuyen den router de get va post data trong mongo
router.get('/',questionCotroller.getAllQuestion)
router.get('/product/:id', questionCotroller.getQuestionByIdProduct)
router.get('/:id',questionCotroller.findQuestionFromId)
router.post('/',questionCotroller.addQuestion)


router.patch('/:id',questionCotroller.setQuestion)
router.delete('/:id',questionCotroller.deleteQuestionFromId)

module.exports = router