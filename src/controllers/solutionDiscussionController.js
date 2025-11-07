const SolutionDiscussion = require('../models/solutionDiscussion');
const SolutionComment = require('../models/solutionComment');
const submission = require('../models/submission');
const problem = require('../models/problem');

// Get all solution discussions for a specific problem
exports.getSolutionsByProblem = async (req, res) => {
  try {
    const { problemid } = req.params;
    const { sortBy = 'popular' } = req.query; // popular, recent, top

    let sortOption = {};
    switch(sortBy) {
      case 'recent':
        sortOption = { createdAt: -1 };
        break;
      case 'top':
        sortOption = { upvotes: -1, createdAt: -1 };
        break;
      case 'popular':
      default:
        sortOption = { views: -1, upvotes: -1 };
        break;
    }

    const solutions = await SolutionDiscussion.find({ problemid })
      .populate('userid', 'firstname lastname email')
      .sort(sortOption)
      .lean();

    res.status(200).json({
      success: true,
      count: solutions.length,
      solutions
    });
  } catch (error) {
    console.error('Error fetching solutions:', error);
    res.status(500).json({ 
      success: false,
      message: "Error fetching solutions", 
      error: error.message 
    });
  }
};

// Get a single solution discussion by ID
exports.getSolutionById = async (req, res) => {
  try {
    const { id } = req.params;

    // Increment view count
    const solution = await SolutionDiscussion.findByIdAndUpdate(
      id,
      { $inc: { views: 1 } },
      { new: true }
    )
      .populate('userid', 'firstname lastname email')
      .lean();

    if (!solution) {
      return res.status(404).json({ 
        success: false,
        message: "Solution not found" 
      });
    }

    // Get comments for this solution
    const comments = await SolutionComment.find({ solutionDiscussionId: id })
      .populate('userid', 'firstname lastname email')
      .sort({ createdAt: 1 })
      .lean();

    res.status(200).json({
      success: true,
      solution,
      comments
    });
  } catch (error) {
    console.error('Error fetching solution details:', error);
    res.status(500).json({ 
      success: false,
      message: "Error fetching solution details", 
      error: error.message 
    });
  }
};

// Create a new solution discussion
exports.createSolution = async (req, res) => {
  try {
    const userid = req.ans1.id;
    const { 
      problemid, 
      title, 
      description, 
      code, 
      language,
      timeComplexity,
      spaceComplexity,
      tags,
      submissionId // Optional: if posting from a successful submission
    } = req.body;

    // Validate required fields
    if (!problemid || !title || !code || !language) {
      return res.status(400).json({ 
        success: false,
        message: "Problem ID, title, code, and language are required" 
      });
    }

    // Verify problem exists
    const problemExists = await problem.findById(problemid);
    if (!problemExists) {
      return res.status(404).json({ 
        success: false,
        message: "Problem not found" 
      });
    }

    // If submissionId provided, get runtime/memory stats
    let runtime = 0;
    let memory = 0;
    
    if (submissionId) {
      const submissionData = await submission.findById(submissionId);
      if (submissionData && submissionData.status === 'accepted') {
        runtime = submissionData.runtime || 0;
        memory = submissionData.memory || 0;
      }
    }

    // Create solution discussion
    const newSolution = new SolutionDiscussion({
      problemid,
      userid,
      title,
      description: description || '',
      code,
      language,
      timeComplexity: timeComplexity || '',
      spaceComplexity: spaceComplexity || '',
      tags: tags || [],
      runtime,
      memory
    });

    await newSolution.save();

    // Populate user data before sending response
    const populatedSolution = await SolutionDiscussion.findById(newSolution._id)
      .populate('userid', 'firstname lastname email')
      .lean();

    res.status(201).json({
      success: true,
      message: "Solution posted successfully",
      solution: populatedSolution
    });
  } catch (error) {
    console.error('Error creating solution:', error);
    res.status(500).json({ 
      success: false,
      message: "Error creating solution", 
      error: error.message 
    });
  }
};

// Add a comment to a solution
exports.addComment = async (req, res) => {
  try {
    const { id } = req.params; // solution discussion id
    const userid = req.ans1.id;
    const { content, parentCommentId } = req.body;

    if (!content || content.trim() === '') {
      return res.status(400).json({ 
        success: false,
        message: "Comment content cannot be empty" 
      });
    }

    // Verify solution exists
    const solutionExists = await SolutionDiscussion.findById(id);
    if (!solutionExists) {
      return res.status(404).json({ 
        success: false,
        message: "Solution discussion not found" 
      });
    }

    const newComment = new SolutionComment({
      solutionDiscussionId: id,
      userid,
      content: content.trim(),
      parentCommentId: parentCommentId || null
    });

    await newComment.save();

    // Populate user data
    const populatedComment = await SolutionComment.findById(newComment._id)
      .populate('userid', 'firstname lastname email')
      .lean();

    res.status(201).json({
      success: true,
      message: "Comment added successfully",
      comment: populatedComment
    });
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).json({ 
      success: false,
      message: "Error adding comment", 
      error: error.message 
    });
  }
};

// Upvote a solution
exports.upvoteSolution = async (req, res) => {
  try {
    const { id } = req.params;
    const userid = req.ans1.id;

    const solution = await SolutionDiscussion.findById(id);
    if (!solution) {
      return res.status(404).json({ 
        success: false,
        message: "Solution not found" 
      });
    }

    // Check if user already upvoted
    const alreadyUpvoted = solution.upvotedBy.some(
      uid => uid.toString() === userid.toString()
    );

    // Check if user downvoted
    const alreadyDownvoted = solution.downvotedBy.some(
      uid => uid.toString() === userid.toString()
    );

    if (alreadyUpvoted) {
      // Remove upvote
      solution.upvotedBy = solution.upvotedBy.filter(
        uid => uid.toString() !== userid.toString()
      );
      solution.upvotes = Math.max(0, solution.upvotes - 1);
    } else {
      // Remove downvote if exists
      if (alreadyDownvoted) {
        solution.downvotedBy = solution.downvotedBy.filter(
          uid => uid.toString() !== userid.toString()
        );
        solution.downvotes = Math.max(0, solution.downvotes - 1);
      }
      // Add upvote
      solution.upvotedBy.push(userid);
      solution.upvotes += 1;
    }

    await solution.save();

    res.status(200).json({
      success: true,
      upvotes: solution.upvotes,
      downvotes: solution.downvotes,
      userVote: alreadyUpvoted ? 'none' : 'up'
    });
  } catch (error) {
    console.error('Error upvoting solution:', error);
    res.status(500).json({ 
      success: false,
      message: "Error upvoting solution", 
      error: error.message 
    });
  }
};

// Downvote a solution
exports.downvoteSolution = async (req, res) => {
  try {
    const { id } = req.params;
    const userid = req.ans1.id;

    const solution = await SolutionDiscussion.findById(id);
    if (!solution) {
      return res.status(404).json({ 
        success: false,
        message: "Solution not found" 
      });
    }

    // Check if user already downvoted
    const alreadyDownvoted = solution.downvotedBy.some(
      uid => uid.toString() === userid.toString()
    );

    // Check if user upvoted
    const alreadyUpvoted = solution.upvotedBy.some(
      uid => uid.toString() === userid.toString()
    );

    if (alreadyDownvoted) {
      // Remove downvote
      solution.downvotedBy = solution.downvotedBy.filter(
        uid => uid.toString() !== userid.toString()
      );
      solution.downvotes = Math.max(0, solution.downvotes - 1);
    } else {
      // Remove upvote if exists
      if (alreadyUpvoted) {
        solution.upvotedBy = solution.upvotedBy.filter(
          uid => uid.toString() !== userid.toString()
        );
        solution.upvotes = Math.max(0, solution.upvotes - 1);
      }
      // Add downvote
      solution.downvotedBy.push(userid);
      solution.downvotes += 1;
    }

    await solution.save();

    res.status(200).json({
      success: true,
      upvotes: solution.upvotes,
      downvotes: solution.downvotes,
      userVote: alreadyDownvoted ? 'none' : 'down'
    });
  } catch (error) {
    console.error('Error downvoting solution:', error);
    res.status(500).json({ 
      success: false,
      message: "Error downvoting solution", 
      error: error.message 
    });
  }
};

// Upvote a comment
exports.upvoteComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const userid = req.ans1.id;

    const comment = await SolutionComment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ 
        success: false,
        message: "Comment not found" 
      });
    }

    // Check if user already upvoted
    const alreadyUpvoted = comment.upvotedBy.some(
      uid => uid.toString() === userid.toString()
    );

    if (alreadyUpvoted) {
      // Remove upvote
      comment.upvotedBy = comment.upvotedBy.filter(
        uid => uid.toString() !== userid.toString()
      );
      comment.upvotes = Math.max(0, comment.upvotes - 1);
    } else {
      // Add upvote
      comment.upvotedBy.push(userid);
      comment.upvotes += 1;
    }

    await comment.save();

    res.status(200).json({
      success: true,
      upvotes: comment.upvotes,
      userUpvoted: !alreadyUpvoted
    });
  } catch (error) {
    console.error('Error upvoting comment:', error);
    res.status(500).json({ 
      success: false,
      message: "Error upvoting comment", 
      error: error.message 
    });
  }
};

// Get all solutions by current user
exports.getMySolutions = async (req, res) => {
  try {
    const userid = req.ans1.id;

    const solutions = await SolutionDiscussion.find({ userid })
      .populate('problemid', 'title difficulty')
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json({
      success: true,
      count: solutions.length,
      solutions
    });
  } catch (error) {
    console.error('Error fetching user solutions:', error);
    res.status(500).json({ 
      success: false,
      message: "Error fetching solutions", 
      error: error.message 
    });
  }
};

// Get all recent solution discussions (for header/global feed)
exports.getAllRecentSolutions = async (req, res) => {
  try {
    const { limit = 20, page = 1 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const solutions = await SolutionDiscussion.find()
      .populate('userid', 'firstname lastname email')
      .populate('problemid', 'title difficulty')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    const total = await SolutionDiscussion.countDocuments();

    res.status(200).json({
      success: true,
      count: solutions.length,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit)),
      solutions
    });
  } catch (error) {
    console.error('Error fetching recent solutions:', error);
    res.status(500).json({ 
      success: false,
      message: "Error fetching solutions", 
      error: error.message 
    });
  }
};
