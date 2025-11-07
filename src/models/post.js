const mongoose = require("mongoose");

const replySchema = new mongoose.Schema({
    content: { type: String, required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
    upvotes: { type: Number, default: 0 },
}, { timestamps: true });

const postSchema = new mongoose.Schema({
    title: { type: String, required: true, trim: true },
    content: { type: String, required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
    category: { 
        type: String, 
        enum: ['For You', 'Career', 'Contest', 'Compensation', 'Feedback', 'Interview', 'general', 'algorithm', 'data-structure', 'interview', 'contest', 'bug-report', 'feature-request', 'problem-specific'],
        required: true 
    },
    tags: [{ type: String, trim: true }], 
    upvotes: { type: Number, default: 0 },
    upvotedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'user' }],
    views: { type: Number, default: 0 },
    commentCount: { type: Number, default: 0 } 
}, { timestamps: true });

module.exports = mongoose.model("Post", postSchema);