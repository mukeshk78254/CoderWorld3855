const express = require('express');
const router = express.Router();
const usermiddleware = require('../middleware/middle');
const discussController = require('../controllers/discussController');

// All routes require authentication
router.use(usermiddleware);

// Post routes
router.get('/posts', discussController.getPosts);
router.post('/posts', discussController.createPost);
router.get('/posts/:id', discussController.getPostById);
router.delete('/posts/:id', discussController.deletePost);
router.post('/posts/:id/upvote', discussController.upvotePost);

// Comment routes (PUBLIC - all users can see all comments)
router.get('/posts/:postId/comments', discussController.getComments);
router.post('/posts/:id/comments', discussController.addComment);  // Can include parentCommentId for replies
router.delete('/comments/:commentId', discussController.deleteComment);
router.post('/comments/:commentId/upvote', discussController.upvoteComment);

// Reply routes
router.get('/comments/:commentId/replies', discussController.getReplies);

module.exports = router;