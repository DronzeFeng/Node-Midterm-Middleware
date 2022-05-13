var express = require('express');
var router = express.Router();
const Post = require('../models/posts');
const User = require('../models/users');
const postController = require('../controllers/posts');

router.get('/', postController.getPosts);
router.post('/', postController.createPost);
router.delete('/', postController.deleteAllPosts);
router.delete('/:id', function (req, res) {
  const id = req.params.id;

  postController.deleteOnePost(req, res, id);
});
router.patch('/:id', function (req, res) {
  const id = req.params.id;

  postController.patchOnePost(req, res, id);
});

module.exports = router;
