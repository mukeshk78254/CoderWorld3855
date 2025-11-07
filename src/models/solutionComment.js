const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Schema for comments on solution discussions
const solutionCommentSchema = new Schema({
  solutionDiscussionId: {
    type: Schema.Types.ObjectId,
    ref: 'SolutionDiscussion',
    required: true,
    index: true
  },
  userid: {
    type: Schema.Types.ObjectId,
    ref: 'user',
    required: true
  },
  content: {
    type: String,
    required: true,
    trim: true,
    maxlength: 1000
  },
  upvotes: {
    type: Number,
    default: 0
  },
  upvotedBy: [{
    type: Schema.Types.ObjectId,
    ref: 'user'
  }],
  // For nested replies (optional - can be expanded later)
  parentCommentId: {
    type: Schema.Types.ObjectId,
    ref: 'SolutionComment',
    default: null
  }
}, {
  timestamps: true
});

// Middleware to increment comment count on solution discussion
solutionCommentSchema.post('save', async function(doc) {
  await mongoose.model('SolutionDiscussion').findByIdAndUpdate(
    doc.solutionDiscussionId, 
    { $inc: { commentCount: 1 } }
  );
});

// Middleware to decrement comment count when deleted
solutionCommentSchema.post('findOneAndDelete', async function(doc) {
  if (doc) {
    await mongoose.model('SolutionDiscussion').findByIdAndUpdate(
      doc.solutionDiscussionId, 
      { $inc: { commentCount: -1 } }
    );
  }
});

const SolutionComment = mongoose.model('SolutionComment', solutionCommentSchema);
module.exports = SolutionComment;
