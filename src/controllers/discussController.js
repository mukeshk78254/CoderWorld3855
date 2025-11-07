const Post = require('../models/post');
const Comment = require('../models/comment');

exports.getPosts = async (req, res) => {
    try {
        const { category } = req.query;
        
        const filter = (category && category !== 'For You') ? { category } : {};
        
        // Get all posts
        const posts = await Post.find(filter)
            .populate('author', 'firstname lastname email')
            .sort({ createdAt: -1 })
            .lean();
        
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ message: "Error fetching posts", error: error.message });
    }
};

exports.createPost = async (req, res) => {
    try {
        const { title, content, category } = req.body;
        const author = req.ans1.id;

        if (!title || !content || !category) {
            return res.status(400).json({ message: "Title, content, and category are required." });
        }

        const newPost = new Post({ title, content, category, author });
        await newPost.save();
        res.status(201).json(newPost);
    } catch (error) {
        res.status(500).json({ message: "Error creating post", error: error.message });
    }
};

exports.getPostById = async (req, res) => {
    try {
        const postId = req.params.id;
        
        // Increment view count
        const post = await Post.findByIdAndUpdate(
            postId, 
            { $inc: { views: 1 } }, 
            { new: true }
        )
            .populate('author', 'firstname lastname email')
            .lean();

        if (!post) {
            return res.status(404).json({ message: "Post not found." });
        }

        // Get ALL top-level comments (PUBLIC - visible to everyone)
        const topLevelComments = await Comment.find({ 
            post: postId,
            parentComment: null  // Only top-level comments
        })
            .populate('author', 'firstname lastname email')
            .sort({ createdAt: 'asc' })
            .lean();

        // For each top-level comment, get its replies
        const commentsWithReplies = await Promise.all(
            topLevelComments.map(async (comment) => {
                const replies = await Comment.find({ 
                    parentComment: comment._id 
                })
                    .populate('author', 'firstname lastname email')
                    .sort({ createdAt: 'asc' })
                    .lean();
                
                return {
                    ...comment,
                    replies: replies  // Nested replies
                };
            })
        );
            
        res.status(200).json({ 
            success: true,
            post, 
            comments: commentsWithReplies,
            totalComments: post.commentCount
        });
    } catch (error) {
        console.error('Error fetching post details:', error);
        res.status(500).json({ message: "Error fetching post details", error: error.message });
    }
};

exports.addComment = async (req, res) => {
    try {
        const postId = req.params.id;
        const { content, parentCommentId } = req.body;
        const author = req.ans1.id;

        if (!content || content.trim() === '') {
            return res.status(400).json({ 
                success: false,
                message: "Comment content cannot be empty." 
            });
        }

        // Verify post exists
        const postExists = await Post.findById(postId);
        if (!postExists) {
            return res.status(404).json({ 
                success: false,
                message: "Post not found." 
            });
        }

        // If this is a reply, verify parent comment exists
        if (parentCommentId) {
            const parentComment = await Comment.findById(parentCommentId);
            if (!parentComment) {
                return res.status(404).json({ 
                    success: false,
                    message: "Parent comment not found." 
                });
            }
        }

        // Create comment (PUBLIC by default - visible to ALL users)
        const newComment = new Comment({ 
            post: postId, 
            author, 
            content: content.trim(),
            parentComment: parentCommentId || null,
            isPublic: true,  // Always public
            visibility: 'public'  // Always visible to everyone
        });
        await newComment.save();
        
        // Populate author info before sending
        const populatedComment = await Comment.findById(newComment._id)
            .populate('author', 'firstname lastname email')
            .populate({
                path: 'parentComment',
                populate: {
                    path: 'author',
                    select: 'firstname lastname'
                }
            })
            .lean();

        res.status(201).json({
            success: true,
            message: parentCommentId ? "Reply added successfully" : "Comment added successfully",
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

// Delete comment - Only admin or comment author can delete
exports.deleteComment = async (req, res) => {
    try {
        const { commentId } = req.params;
        const userId = req.ans1.id;
        const userRole = req.ans1.role; // Assuming role is in token

        // Find the comment
        const comment = await Comment.findById(commentId);
        
        if (!comment) {
            return res.status(404).json({ 
                success: false,
                message: "Comment not found." 
            });
        }

        // Check if user is admin or comment author
        const isAdmin = userRole === 'admin' || userRole === 'super_admin';
        const isAuthor = comment.author.toString() === userId.toString();

        if (!isAdmin && !isAuthor) {
            return res.status(403).json({ 
                success: false,
                message: "You don't have permission to delete this comment." 
            });
        }

        // Delete the comment (use findOneAndDelete to trigger middleware)
        await Comment.findOneAndDelete({ _id: commentId });

        // Middleware will handle:
        // 1. Decrementing post comment count
        // 2. Decrementing parent comment reply count (if reply)
        // 3. Cascade deleting all replies to this comment

        res.status(200).json({
            success: true,
            message: "Comment deleted successfully (permanently removed)"
        });
    } catch (error) {
        console.error('Error deleting comment:', error);
        res.status(500).json({ 
            success: false,
            message: "Error deleting comment", 
            error: error.message 
        });
    }
};

// Delete post - Only admin or post author can delete
exports.deletePost = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.ans1.id;
        const userRole = req.ans1.role;

        // Find the post
        const post = await Post.findById(id);
        
        if (!post) {
            return res.status(404).json({ 
                success: false,
                message: "Post not found." 
            });
        }

        // Check if user is admin or post author
        const isAdmin = userRole === 'admin' || userRole === 'super_admin';
        const isAuthor = post.author.toString() === userId.toString();

        if (!isAdmin && !isAuthor) {
            return res.status(403).json({ 
                success: false,
                message: "You don't have permission to delete this post." 
            });
        }

        // Delete all comments associated with this post
        await Comment.deleteMany({ post: id });

        // Delete the post
        await Post.findByIdAndDelete(id);

        res.status(200).json({
            success: true,
            message: "Post and associated comments deleted successfully"
        });
    } catch (error) {
        console.error('Error deleting post:', error);
        res.status(500).json({ 
            success: false,
            message: "Error deleting post", 
            error: error.message 
        });
    }
};

// Get all comments for a post (separate endpoint for real-time updates)
exports.getComments = async (req, res) => {
    try {
        const { postId } = req.params;

        // Verify post exists
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ 
                success: false,
                message: "Post not found." 
            });
        }

        // Get ALL top-level comments (PUBLIC - visible to ALL users)
        const topLevelComments = await Comment.find({ 
            post: postId,
            parentComment: null,
            isPublic: true  // Only public comments
        })
            .populate('author', 'firstname lastname email')
            .sort({ createdAt: 'asc' })
            .lean();

        // For each top-level comment, get its replies
        const commentsWithReplies = await Promise.all(
            topLevelComments.map(async (comment) => {
                const replies = await Comment.find({ 
                    parentComment: comment._id,
                    isPublic: true
                })
                    .populate('author', 'firstname lastname email')
                    .sort({ createdAt: 'asc' })
                    .lean();
                
                return {
                    ...comment,
                    replies: replies  // ALL users can see ALL replies
                };
            })
        );

        res.status(200).json({
            success: true,
            count: commentsWithReplies.length,
            comments: commentsWithReplies,
            message: "All comments are public and visible to everyone"
        });
    } catch (error) {
        console.error('Error fetching comments:', error);
        res.status(500).json({ 
            success: false,
            message: "Error fetching comments", 
            error: error.message 
        });
    }
};

// Upvote a comment
exports.upvoteComment = async (req, res) => {
    try {
        const { commentId } = req.params;
        const userId = req.ans1.id;

        const comment = await Comment.findById(commentId);
        if (!comment) {
            return res.status(404).json({ 
                success: false,
                message: "Comment not found" 
            });
        }

        // Check if user already upvoted
        const alreadyUpvoted = comment.upvotedBy.some(
            uid => uid.toString() === userId.toString()
        );

        if (alreadyUpvoted) {
            // Remove upvote
            comment.upvotedBy = comment.upvotedBy.filter(
                uid => uid.toString() !== userId.toString()
            );
            comment.upvotes = Math.max(0, comment.upvotes - 1);
        } else {
            // Add upvote
            comment.upvotedBy.push(userId);
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

// Get replies for a specific comment
exports.getReplies = async (req, res) => {
    try {
        const { commentId } = req.params;

        // Verify parent comment exists
        const parentComment = await Comment.findById(commentId);
        if (!parentComment) {
            return res.status(404).json({ 
                success: false,
                message: "Comment not found" 
            });
        }

        // Get all replies (PUBLIC - visible to ALL users)
        const replies = await Comment.find({ 
            parentComment: commentId,
            isPublic: true
        })
            .populate('author', 'firstname lastname email')
            .sort({ createdAt: 'asc' })
            .lean();

        res.status(200).json({
            success: true,
            count: replies.length,
            replies,
            message: "All replies are public and visible to everyone"
        });
    } catch (error) {
        console.error('Error fetching replies:', error);
        res.status(500).json({ 
            success: false,
            error: error.message 
        });
    }
};

// Upvote a post (toggle upvote)
exports.upvotePost = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.ans1.id;

        const post = await Post.findById(id);
        if (!post) {
            return res.status(404).json({ 
                success: false,
                message: "Post not found" 
            });
        }

        // Initialize upvotedBy array if it doesn't exist
        if (!post.upvotedBy) {
            post.upvotedBy = [];
        }

        // Check if user already upvoted
        const alreadyUpvoted = post.upvotedBy.some(
            upvoterId => upvoterId.toString() === userId.toString()
        );

        if (alreadyUpvoted) {
            // Remove upvote
            post.upvotedBy = post.upvotedBy.filter(
                upvoterId => upvoterId.toString() !== userId.toString()
            );
            post.upvotes = Math.max(0, post.upvotes - 1);
        } else {
            // Add upvote
            post.upvotedBy.push(userId);
            post.upvotes += 1;
        }

        await post.save();

        res.status(200).json({
            success: true,
            upvotes: post.upvotes,
            userUpvoted: !alreadyUpvoted,
            message: alreadyUpvoted ? "Upvote removed" : "Post upvoted"
        });
    } catch (error) {
        console.error('Error upvoting post:', error);
        res.status(500).json({ 
            success: false,
            message: "Error upvoting post", 
            error: error.message 
        });
    }
};