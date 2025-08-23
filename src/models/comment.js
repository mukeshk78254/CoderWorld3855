const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
    content: { type: String, required: true },
    upvotes: { type: Number, default: 0 },
}, { timestamps: true });

// When a new comment is saved, increment the commentCount on the parent Post
commentSchema.post('save', async function(doc) {
    await mongoose.model('Post').findByIdAndUpdate(doc.post, { $inc: { commentCount: 1 } });
});

module.exports = mongoose.model('Comment', commentSchema);