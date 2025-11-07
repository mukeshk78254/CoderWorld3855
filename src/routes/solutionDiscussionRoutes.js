const express = require('express');
const router = express.Router();
const usermiddleware = require('../middleware/middle');
const solutionController = require('../controllers/solutionDiscussionController');

// All routes require authentication
router.use(usermiddleware);

// Get all recent solutions (for global feed/header)
router.get('/recent', solutionController.getAllRecentSolutions);

// Get user's own solutions
router.get('/my-solutions', solutionController.getMySolutions);

// Get all solutions for a specific problem
router.get('/problem/:problemid', solutionController.getSolutionsByProblem);

// Get single solution by ID
router.get('/:id', solutionController.getSolutionById);

// Create new solution discussion
router.post('/', solutionController.createSolution);

// Vote on solution
router.post('/:id/upvote', solutionController.upvoteSolution);
router.post('/:id/downvote', solutionController.downvoteSolution);

// Comments
router.post('/:id/comments', solutionController.addComment);
router.post('/comments/:commentId/upvote', solutionController.upvoteComment);

module.exports = router;
