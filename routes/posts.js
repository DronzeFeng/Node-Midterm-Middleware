var express = require('express');
var router = express.Router();
const postController = require('../controllers/posts');
const handleErrorAsync = require('../services/handleErrorAsync');

router.get('/', handleErrorAsync(postController.getPosts));
router.post('/', handleErrorAsync(postController.createPost));
router.delete('/', handleErrorAsync(postController.deleteAllPosts));
router.delete('/:id', handleErrorAsync(postController.deleteOnePost));
router.patch('/:id', handleErrorAsync(postController.patchOnePost));

module.exports = router;
