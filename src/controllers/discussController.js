const Post = require('../models/post');
const Comment = require('../models/comment');

exports.getPosts = async (req, res) => {
    try {
        const { category } = req.query;
        // Build filter object. If category is 'For You' or not provided, fetch all.
        const filter = (category && category !== 'For You') ? { category } : {};
        
        const posts = await Post.find(filter)
            .populate('author', 'firstname')
            .populate({
                path: 'comments',
                populate: {
                    path: 'author',
                    select: 'firstname'
                }
            }) // Populate comments and their authors
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
        const author = req.ans1.id; // From usermiddleware

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
        
        const post = await Post.findByIdAndUpdate(postId, { $inc: { views: 1 } }, { new: true })
            .populate('author', 'firstname')
            .lean();

        if (!post) {
            return res.status(404).json({ message: "Post not found." });
        }

        const comments = await Comment.find({ post: postId })
            .populate('author', 'firstname')
            .sort({ createdAt: 'asc' })
            .lean();
            
        res.status(200).json({ post, comments });
    } catch (error) {
        res.status(500).json({ message: "Error fetching post details", error: error.message });
    }
};

exports.addComment = async (req, res) => {
    try {
        const postId = req.params.id;
        const { content } = req.body;
        const author = req.ans1.id;

        if (!content) {
            return res.status(400).json({ message: "Comment content cannot be empty." });
        }

        const newComment = new Comment({ post: postId, author, content });
        await newComment.save();
        
        // Populate the author details before sending back to the client
        const populatedComment = await Comment.findById(newComment._id).populate('author', 'firstname').lean();

        res.status(201).json(populatedComment);
    } catch (error) {
        res.status(500).json({ message: "Error adding comment", error: error.message });
    }
};