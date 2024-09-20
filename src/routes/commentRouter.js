const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');

router.get('/', commentController.getAllComment);
router.get('/:id', commentController.findCommentFromId);
router.get('/product/:id', commentController.getCommentByIdProduct); // dung id type
router.post('/', commentController.addComment);
router.patch('/:id', commentController.setComment);
router.delete('/:id', commentController.deleteCommentFromId);

module.exports = router;
