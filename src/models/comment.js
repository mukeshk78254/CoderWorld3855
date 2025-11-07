const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
    content: { type: String, required: true },
    upvotes: { type: Number, default: 0 },
    upvotedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'user' }],
    // For nested replies - users can reply to comments
    parentComment: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Comment', 
        default: null 
    },
    replyCount: { type: Number, default: 0 },
    // All comments are PUBLIC - visible to ALL users
    isPublic: { type: Boolean, default: true },
    visibility: { 
        type: String, 
        enum: ['public', 'private', 'friends-only'],
        default: 'public' 
    }
}, { timestamps: true });

// Middleware to increment comment count when comment is saved
commentSchema.post('save', async function(doc) {
    await mongoose.model('Post').findByIdAndUpdate(doc.post, { $inc: { commentCount: 1 } });
    
    // If this is a reply, increment parent comment's reply count
    if (doc.parentComment) {
        await mongoose.model('Comment').findByIdAndUpdate(
            doc.parentComment, 
            { $inc: { replyCount: 1 } }
        );
    }
});

// Middleware to decrement comment count when comment is deleted
commentSchema.post('findOneAndDelete', async function(doc) {
    if (doc) {
        await mongoose.model('Post').findByIdAndUpdate(doc.post, { $inc: { commentCount: -1 } });
        
        // If this was a reply, decrement parent comment's reply count
        if (doc.parentComment) {
            await mongoose.model('Comment').findByIdAndUpdate(
                doc.parentComment, 
                { $inc: { replyCount: -1 } }
            );
        }
        
        // Delete all replies to this comment
        await mongoose.model('Comment').deleteMany({ parentComment: doc._id });
    }
});

module.exports = mongoose.model('Comment', commentSchema);