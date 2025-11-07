const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Schema for individual solution discussion posts
const solutionDiscussionSchema = new Schema({
  problemid: {
    type: Schema.Types.ObjectId,
    ref: 'problem',
    required: true,
    index: true
  },
  userid: {
    type: Schema.Types.ObjectId,
    ref: 'user',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  description: {
    type: String,
    trim: true,
    maxlength: 2000
  },
  code: {
    type: String,
    required: true
  },
  language: {
    type: String,
    required: true,
    enum: ['javascript', 'c++', 'java']
  },
  // Complexity analysis
  timeComplexity: {
    type: String,
    trim: true
  },
  spaceComplexity: {
    type: String,
    trim: true
  },
  // Submission stats (if posted from successful submission)
  runtime: {
    type: Number,
    default: 0
  },
  memory: {
    type: Number,
    default: 0
  },
  // Engagement metrics
  upvotes: {
    type: Number,
    default: 0
  },
  downvotes: {
    type: Number,
    default: 0
  },
  views: {
    type: Number,
    default: 0
  },
  // Users who upvoted/downvoted
  upvotedBy: [{
    type: Schema.Types.ObjectId,
    ref: 'user'
  }],
  downvotedBy: [{
    type: Schema.Types.ObjectId,
    ref: 'user'
  }],
  // Comments on this solution
  commentCount: {
    type: Number,
    default: 0
  },
  // Tags for solution approach
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  // Is this solution verified/approved by admin or high-reputation users
  isVerified: {
    type: Boolean,
    default: false
  },
  // Flag for inappropriate content
  isFlagged: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Indexes for better query performance
solutionDiscussionSchema.index({ problemid: 1, createdAt: -1 });
solutionDiscussionSchema.index({ userid: 1 });
solutionDiscussionSchema.index({ upvotes: -1 });
solutionDiscussionSchema.index({ views: -1 });

// Virtual for net votes (upvotes - downvotes)
solutionDiscussionSchema.virtual('netVotes').get(function() {
  return this.upvotes - this.downvotes;
});

const SolutionDiscussion = mongoose.model('SolutionDiscussion', solutionDiscussionSchema);
module.exports = SolutionDiscussion;
