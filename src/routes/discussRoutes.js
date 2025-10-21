const express = require('express');
const router = express.Router();
const usermiddleware = require('../middleware/middle');
const discussController = require('../controllers/discussController');


router.use(usermiddleware);

router.get('/posts', discussController.getPosts);
router.post('/posts', discussController.createPost);
router.get('/posts/:id', discussController.getPostById);
router.post('/posts/:id/comments', discussController.addComment);

module.exports = router;