import { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    MessageSquare, 
    ThumbsUp, 
    Reply, 
    Clock, 
    Send, 
    Search,
    MessageCircle,
    Trash2,
    CheckCircle,
    XCircle,
    AlertTriangle
} from 'lucide-react';
import axiosClient from '../utils/axiosClient';

const ProblemDiscussion = ({ problemId, problemTitle }) => {
    // Determine the user's ID for client-side comparison (isLiked, canDelete)
    const { user } = useSelector(state => state.auth);
    const userId = user?._id || user?.id;

    // --- State Management ---
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [newDiscussion, setNewDiscussion] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('newest');
    const [showComments, setShowComments] = useState({});
    const [loadingComments, setLoadingComments] = useState({});

    // --- Data Fetching ---

    // Fetch posts from backend
    const fetchPosts = useCallback(async () => {
        setLoading(true);
        try {
            const response = await axiosClient.get('/api/discuss/posts', {
                params: { 
                    category: 'problem-specific',
                    problemId: problemId 
                }
            });
            
            if (response.data && Array.isArray(response.data)) {
                const formattedPosts = response.data.map(post => ({
                    ...post,
                    id: post._id,
                    author: post.author?.firstname || post.author?.email || 'Anonymous',
                    authorId: post.author?._id,
                    timestamp: post.createdAt,
                    likes: post.upvotes || 0,
                    // IMPORTANT: Assume backend sends back whether the CURRENT user has liked this post
                    isLiked: post.upvotedBy?.includes(userId) || false, 
                    // Or initialize based on backend data structure: post.likedBy?.includes(userId) || false,
                }));
                setPosts(formattedPosts);
            }
        } catch (error) {
            console.error('Failed to fetch discussions:', error);
        } finally {
            setLoading(false);
        }
    }, [problemId, userId]);

    useEffect(() => {
        fetchPosts();
    }, [problemId, sortBy, fetchPosts]);

    // Fetch comments for a specific post
    const fetchComments = async (postId) => {
        setLoadingComments(prev => ({ ...prev, [postId]: true }));
        try {
            const response = await axiosClient.get(`/api/discuss/posts/${postId}/comments`);
            if (response.data.success) {
                // Map comments to include client-side 'isLiked' status
                const commentsWithLikes = (response.data.comments || []).map(comment => ({
                    ...comment,
                    author: comment.author?.firstname || comment.author?.email || 'Anonymous',
                    authorId: comment.author?._id,
                    // IMPORTANT: Assume backend sends upvotedBy array
                    isLiked: comment.upvotedBy?.includes(userId) || false, 
                    replies: (comment.replies || []).map(reply => ({
                        ...reply,
                        author: reply.author?.firstname || reply.author?.email || 'Anonymous',
                        isLiked: reply.upvotedBy?.includes(userId) || false,
                    }))
                }));

                // Update post with comments
                setPosts(prev => prev.map(post => 
                    post._id === postId 
                        ? { ...post, comments: commentsWithLikes }
                        : post
                ));
            }
        } catch (error) {
            console.error('Failed to fetch comments:', error);
        } finally {
            setLoadingComments(prev => ({ ...prev, [postId]: false }));
        }
    };

    const toggleComments = async (postId) => {
        const isShowing = showComments[postId];
        setShowComments(prev => ({ ...prev, [postId]: !isShowing }));
        
        // Fetch comments if not already loaded and now showing
        if (!isShowing) {
            const post = posts.find(p => p._id === postId);
            if (!post.comments || post.comments.length === 0) {
                await fetchComments(postId);
            }
        }
    };

    // --- Action Handlers ---

    const handleSubmitDiscussion = async () => {
        // ... (Submission logic remains largely the same)
        if (!newDiscussion.trim()) {
            alert('⚠️ Please write something to start a discussion.');
            return;
        }

        const token = localStorage.getItem('token');
        if (!token || !user) {
            alert('⚠️ Please login to post a discussion.');
            return;
        }

        setIsSubmitting(true);
        try {
            const response = await axiosClient.post('/api/discuss/posts', {
                title: `Discussion: ${problemTitle || 'Problem'}`,
                content: newDiscussion.trim(),
                category: 'problem-specific',
                problemId: problemId,
                problemTitle: problemTitle || 'Unknown Problem'
            });

            if (response.data && response.data._id) {
                // Optimistically add the new post
                const newPost = {
                    ...response.data,
                    id: response.data._id,
                    author: user?.firstname || user?.email?.split('@')[0] || 'Anonymous',
                    authorId: userId,
                    timestamp: response.data.createdAt || new Date().toISOString(),
                    likes: response.data.upvotes || 0,
                    upvotes: response.data.upvotes || 0,
                    comments: [],
                    isLiked: false,
                };
                
                setPosts(prev => [newPost, ...prev]);
                setNewDiscussion('');
                
                setTimeout(() => {
                    alert('✅ Discussion posted successfully! Everyone can see it now.');
                }, 100);
            } else {
                throw new Error('Invalid response from server - missing post ID');
            }
        } catch (error) {
            console.error('❌ Failed to submit discussion:', error);
            // ... (detailed error handling)
            alert('❌ Failed to submit discussion. Please check the console for details.');
        } finally {
            setIsSubmitting(false);
        }
    };

    // UPDATED: handleLike for POSTS (Discussion Thread)
    const handleLike = async (postId, currentIsLiked) => {
        if (!userId) {
            alert('⚠️ Please login to like a discussion.');
            return;
        }

        const newLikes = currentIsLiked ? -1 : 1;

        // Optimistically update UI immediately
        setPosts(prev => prev.map(p => {
            if (p._id === postId || p.id === postId) {
                return {
                    ...p,
                    likes: (p.likes || 0) + newLikes,
                    isLiked: !currentIsLiked
                };
            }
            return p;
        }));

        try {
            // Backend upvote endpoint handles both upvote and downvote (toggle)
            await axiosClient.post(`/api/discuss/posts/${postId}/upvote`);
            
        } catch (error) {
            console.error(`Failed to toggle vote on post:`, error);
            
            // Revert optimistic update on failure
            setPosts(prev => prev.map(p => {
                if (p._id === postId || p.id === postId) {
                    return {
                        ...p,
                        likes: (p.likes || 0) - newLikes,
                        isLiked: currentIsLiked
                    };
                }
                return p;
            }));
            
            alert(`❌ Failed to register vote. Please try again.`);
        }
    };

    // UPDATED: handleDeletePost (Permission check remains the same)
    const handleDeletePost = async (postId) => {
        // ... (Deletion logic remains the same, relies on backend 403)
        if (!window.confirm('⚠️ DELETE POST PERMANENTLY?\n\nThis will permanently delete:\n✓ The post\n✓ ALL comments on this post\n✓ ALL replies to those comments\n\nThis CANNOT be undone and will NEVER appear again for anyone!')) {
            return;
        }

        try {
            const post = posts.find(p => p._id === postId || p.id === postId);
            if (post && post._id) {
                await axiosClient.delete(`/api/discuss/posts/${post._id}`);
                alert('✅ Post deleted permanently! It will never appear again.');
            }
            
            setPosts(prev => prev.filter(p => p._id !== postId && p.id !== postId));
        } catch (error) {
            console.error('Failed to delete post:', error);
            if (error.response?.status === 403) {
                alert('❌ Permission denied! Only the author or admin can delete this post.');
            } else {
                alert('❌ Failed to delete post. Please try again.');
            }
        }
    };


    const formatTimeAgo = (timestamp) => {
        const now = new Date();
        const time = new Date(timestamp);
        const diffInSeconds = Math.floor((now - time) / 1000);

        if (diffInSeconds < 60) return 'Just now';
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
        return `${Math.floor(diffInSeconds / 86400)}d ago`;
    };

    const filteredPosts = posts.filter(post =>
        post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.title?.toLowerCase().includes(searchTerm.toLowerCase())
    ).sort((a, b) => {
        if (sortBy === 'newest') return new Date(b.timestamp) - new Date(a.timestamp);
        if (sortBy === 'oldest') return new Date(a.timestamp) - new Date(b.timestamp);
        if (sortBy === 'most_liked') return b.likes - a.likes;
        return 0;
    });

    return (
        <div className="space-y-6">
            
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-2xl font-bold text-cyan-400 flex items-center gap-2">
                        <MessageSquare className="w-6 h-6" />
                        Problem Discussion
                    </h3>
                    <p className="text-gray-300 text-sm mt-1">
                        Discuss solutions, ask questions, and share insights about this problem
                    </p>
                </div>
                <div className="text-sm text-gray-400">
                    {posts.length} discussion{posts.length !== 1 ? 's' : ''}
                </div>
            </div>

          
            <div className="flex gap-4 items-center">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                        type="text"
                        placeholder="Search discussions..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-cyan-400 focus:outline-none"
                    />
                </div>
                <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-cyan-400 focus:outline-none"
                >
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                    <option value="most_liked">Most Liked</option>
                </select>
            </div>

          
            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                <h4 className="text-lg font-semibold mb-4 text-cyan-400">Start a Discussion</h4>
                <textarea
                    value={newDiscussion}
                    onChange={(e) => setNewDiscussion(e.target.value)}
                    placeholder="Ask a question, share your approach, or discuss edge cases..."
                    className="w-full h-32 bg-gray-700 border border-gray-600 rounded-lg p-4 text-white resize-none focus:border-cyan-400 focus:outline-none"
                />
                <div className="flex justify-between items-center mt-4">
                    <p className="text-xs text-gray-400">
                        💡 Be specific and provide context to get better help from the community
                    </p>
                    <button
                        onClick={handleSubmitDiscussion}
                        disabled={isSubmitting || !newDiscussion.trim()}
                        className="btn btn-primary btn-sm"
                    >
                        {isSubmitting ? (
                            <>
                                <span className="loading loading-spinner loading-xs"></span>
                                Posting...
                            </>
                        ) : (
                            <>
                                <Send className="w-4 h-4" />
                                Post Discussion
                            </>
                        )}
                    </button>
                </div>
            </div>

           
            <div className="space-y-4">
                {loading ? (
                    <div className="text-center py-16">
                        <div className="w-12 h-12 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-gray-400">Loading discussions...</p>
                    </div>
                ) : filteredPosts.length === 0 ? (
                    <div className="text-center py-16 text-gray-400">
                        <div className="w-20 h-20 mx-auto mb-6 bg-gray-800/50 rounded-full flex items-center justify-center">
                            <MessageSquare className="w-10 h-10 opacity-50" />
                        </div>
                        <h3 className="text-xl font-semibold mb-2 text-gray-300">No discussions yet</h3>
                        <p className="text-base mb-6">Be the first to start a discussion about this problem!</p>
                        <div className="bg-gray-800/30 border border-gray-700/50 rounded-xl p-6 max-w-md mx-auto">
                            <h4 className="text-lg font-semibold text-white mb-3">Start the conversation!</h4>
                            <ul className="text-gray-300 space-y-2 text-sm text-left">
                                <li>• Ask questions about the problem</li>
                                <li>• Share your approach and insights</li>
                                <li>• Get help from the community</li>
                                <li>• Discuss different solution strategies</li>
                            </ul>
                        </div>
                    </div>
                ) : (
                    <AnimatePresence>
                        {filteredPosts.map((post) => (
                            <motion.div
                                key={post._id || post.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.3 }}
                            >
                                <DiscussionPost
                                    post={post}
                                    user={user}
                                    onLike={handleLike}
                                    onDelete={handleDeletePost}
                                    toggleComments={toggleComments}
                                    showComments={showComments}
                                    loadingComments={loadingComments}
                                    fetchComments={fetchComments}
                                    formatTimeAgo={formatTimeAgo}
                                />
                            </motion.div>
                        ))}
                    </AnimatePresence>
                )}
            </div>
        </div>
    );
};


// Separate Discussion Post Component
const DiscussionPost = ({ 
    post, 
    user, 
    onLike, 
    onDelete,
    toggleComments,
    showComments,
    loadingComments,
    fetchComments,
    formatTimeAgo
}) => {
    // Determine delete permission
    const canDelete = user && (
        post.authorId === user._id || 
        post.authorId === user.id ||
        user.role === 'admin' ||
        user.role === 'super_admin'
    );

    return (
        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            {/* Post Header */}
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold shadow-lg">
                        {post.author.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <p className="font-semibold text-white">{post.author}</p>
                        <p className="text-xs text-gray-400 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {formatTimeAgo(post.timestamp)}
                        </p>
                    </div>
                </div>
                
                <div className="flex items-center gap-2">
                    {/* Like Button: Pass current like status */}
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => onLike(post._id || post.id, post.isLiked)}
                        className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm transition-all duration-200 ${
                            post.isLiked
                                ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/25'
                                : 'bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white'
                        }`}
                    >
                        <ThumbsUp className={`w-4 h-4 ${post.isLiked ? 'fill-white' : 'fill-none stroke-gray-300'}`} />
                        {post.likes || 0}
                    </motion.button>
                    
                    {/* Delete Button */}
                    {canDelete && (
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => onDelete(post._id || post.id)}
                            className="p-2 text-red-400 hover:text-red-300 hover:bg-gray-700 rounded-lg transition-all duration-200"
                            title="Permanently delete this post (cannot be undone)"
                        >
                            <Trash2 className="w-4 h-4" />
                        </motion.button>
                    )}
                </div>
            </div>

            {/* Post Content */}
            <div className="mb-4">
                <p className="text-gray-300 leading-relaxed">{post.content}</p>
            </div>

            {/* Comments Toggle Button */}
            <div className="flex items-center gap-4 pt-4 border-t border-gray-700">
                <button
                    onClick={() => toggleComments(post._id || post.id)}
                    className="flex items-center gap-2 text-gray-400 hover:text-cyan-400 transition-colors"
                >
                    <MessageCircle className="w-4 h-4" />
                    {showComments[post._id || post.id] ? 'Hide' : 'Show'} Comments ({post.commentCount || post.comments?.length || 0})
                </button>
            </div>

            {/* Comments Section */}
            {showComments[post._id || post.id] && (
                <div className="mt-4 pt-4 border-t border-gray-700">
                    {loadingComments[post._id || post.id] ? (
                        <div className="text-center py-4">
                            <div className="w-6 h-6 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
                            <p className="text-gray-400 text-sm mt-2">Loading comments...</p>
                        </div>
                    ) : post.comments && post.comments.length > 0 ? (
                        <CommentsSection 
                            post={post}
                            user={user}
                            fetchComments={fetchComments}
                            formatTimeAgo={formatTimeAgo}
                        />
                    ) : (
                        <div className="text-center py-8">
                            <MessageSquare size={32} className="mx-auto text-gray-600 mb-2" />
                            <p className="text-gray-400 text-sm">No comments yet. Be the first to comment!</p>
                            <AddCommentForm postId={post._id} onCommentAdded={() => fetchComments(post._id)} />
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};


// Comments Section Component
const CommentsSection = ({ post, user, fetchComments, formatTimeAgo }) => {
    // Central function to update Comment/Reply likes
    const handleCommentLike = async (commentOrReplyId, currentIsLiked, isReply = false) => {
        if (!user) {
            alert('⚠️ Please login to like a comment/reply.');
            return;
        }

        const action = currentIsLiked ? 'downvote' : 'upvote';
        const endpoint = isReply ? `/api/discuss/replies/${commentOrReplyId}/${action}` : `/api/discuss/comments/${commentOrReplyId}/${action}`;

        // Optimistic Update is complex here because state is nested. 
        // For simplicity and correctness with nested structures, we'll rely on the backend refresh.
        // In a high-traffic app, a proper Redux/Immer structure would be required.
        // For now, trigger a fetch to refresh the entire comment tree after API call.
        
        try {
            await axiosClient.post(endpoint);
            // On successful action, refresh the comments section
            await fetchComments(post._id); 

        } catch (error) {
            console.error(`Failed to ${action} comment/reply:`, error);
            alert(`❌ Failed to register ${action}. Please try again.`);
        }
    };
    
    // Deletion handler for comments (re-fetching post comments on successful delete)
    const handleCommentDelete = async (commentId) => {
        if (!window.confirm('⚠️ Delete this comment permanently?\n\nThis comment and all its replies will be permanently removed and will NEVER appear again.')) {
            return;
        }

        try {
            await axiosClient.delete(`/api/discuss/comments/${commentId}`);
            alert('✅ Comment deleted permanently!');
            await fetchComments(post._id); // Refresh parent thread
        } catch (error) {
            console.error('Failed to delete comment:', error);
            alert('❌ Failed to delete comment.');
        }
    };


    return (
        <div className="space-y-4">
            <h4 className="text-sm font-semibold text-gray-300 flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-cyan-400" />
                All Comments ({post.comments.length}) - Public & Visible to Everyone ✅
            </h4>
            
            {/* Add Comment Form */}
            <AddCommentForm postId={post._id} onCommentAdded={() => fetchComments(post._id)} />
            
            {/* Comments List */}
            {post.comments.map((comment) => (
                <CommentThread 
                    key={comment._id} 
                    comment={comment} 
                    postId={post._id}
                    user={user}
                    onRefresh={() => fetchComments(post._id)}
                    formatTimeAgo={formatTimeAgo}
                    onLike={handleCommentLike} // Pass like handler down
                    onDelete={handleCommentDelete} // Pass delete handler down
                />
            ))}
        </div>
    );
};


// Add Comment Form Component (unchanged)
const AddCommentForm = ({ postId, onCommentAdded }) => {
    const [commentText, setCommentText] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!commentText.trim()) return;

        setIsSubmitting(true);
        try {
            const response = await axiosClient.post(`/api/discuss/posts/${postId}/comments`, {
                content: commentText.trim()
            });
            
            if (response.data.success) {
                setCommentText('');
                onCommentAdded();
            }
        } catch (error) {
            console.error('Failed to post comment:', error);
            alert('❌ Failed to post comment. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-2">
            <textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Write a comment... (Public & visible to everyone)"
                className="w-full h-20 bg-gray-700 border border-gray-600 rounded-lg p-3 text-white resize-none focus:border-cyan-400 focus:outline-none text-sm"
            />
            <button
                type="submit"
                disabled={isSubmitting || !commentText.trim()}
                className="btn btn-primary btn-sm"
            >
                {isSubmitting ? 'Posting...' : 'Post Comment'}
            </button>
        </form>
    );
};


// Comment Thread Component with Nested Replies (UPDATED LIKES)
const CommentThread = ({ comment, postId, user, onRefresh, formatTimeAgo, onLike, onDelete }) => {
    const [showReplyBox, setShowReplyBox] = useState(false);
    const [replyText, setReplyText] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const canDelete = user && (
        comment.author?._id === user._id || 
        comment.author?._id === user.id ||
        user.role === 'admin' ||
        user.role === 'super_admin'
    );

    // Call the central like handler
    const handleUpvote = () => {
        onLike(comment._id, comment.isLiked, false); // false = not a reply
    };
    
    // Call the central delete handler
    const handleDelete = () => {
        onDelete(comment._id);
    };

    const handleReply = async () => {
        if (!replyText.trim()) return;

        setIsSubmitting(true);
        try {
            const response = await axiosClient.post(`/api/discuss/posts/${postId}/comments`, {
                content: replyText.trim(),
                parentCommentId: comment._id
            });
            
            if (response.data.success) {
                setReplyText('');
                setShowReplyBox(false);
                await onRefresh();
            }
        } catch (error) {
            console.error('Failed to post reply:', error);
            alert('❌ Failed to post reply.');
        } finally {
            setIsSubmitting(false);
        }
    };
    
    // Helper to determine if a reply can be deleted (Author or Admin)
    const canDeleteReply = (reply) => {
        return user && (
            reply.author?._id === user._id || 
            reply.author?._id === user.id ||
            user.role === 'admin' ||
            user.role === 'super_admin'
        );
    };

    // Handler for deleting replies (nested state, requires refresh)
    const handleDeleteReply = async (replyId) => {
        if (!window.confirm('⚠️ Delete this reply permanently?')) {
            return;
        }

        try {
            await axiosClient.delete(`/api/discuss/replies/${replyId}`);
            alert('✅ Reply deleted permanently!');
            await onRefresh();
        } catch (error) {
            console.error('Failed to delete reply:', error);
            alert('❌ Failed to delete reply.');
        }
    };


    return (
        <div className="space-y-3">
            {/* Main Comment */}
            <div className="bg-gray-700/50 rounded-lg p-4">
                <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                        <div className="w-7 h-7 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold text-xs">
                            {(comment.author?.firstname || comment.author?.email || 'U').charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <span className="font-semibold text-sm text-white">
                                {comment.author?.firstname || comment.author?.email || 'Anonymous'}
                            </span>
                            <span className="text-xs text-gray-400 ml-2">
                                {formatTimeAgo(comment.createdAt)}
                            </span>
                            {comment.isPublic && (
                                <span className="text-xs bg-green-500/20 text-green-400 px-1.5 py-0.5 rounded ml-2">
                                    PUBLIC ✅
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                <p className="text-gray-300 text-sm mb-3">{comment.content}</p>

                <div className="flex items-center gap-3">
                    {/* Upvote Button for Comment */}
                    <button
                        onClick={handleUpvote}
                        className={`flex items-center gap-1 text-xs transition-colors ${
                            comment.isLiked 
                                ? 'text-cyan-400 hover:text-cyan-300' 
                                : 'text-gray-400 hover:text-cyan-400'
                        }`}
                    >
                        <ThumbsUp className={`w-3 h-3 ${comment.isLiked ? 'fill-cyan-400' : 'fill-none stroke-gray-400'}`} />
                        {comment.upvotes || 0}
                    </button>
                    
                    {/* Reply Button */}
                    <button
                        onClick={() => setShowReplyBox(!showReplyBox)}
                        className="flex items-center gap-1 text-gray-400 hover:text-cyan-400 text-xs transition-colors"
                    >
                        <Reply className="w-3 h-3" />
                        {comment.replyCount || comment.replies?.length || 0} replies
                    </button>

                    {/* Delete Button for Comment */}
                    {canDelete && (
                        <button
                            onClick={handleDelete}
                            className="flex items-center gap-1 text-red-400 hover:text-red-300 text-xs transition-colors"
                        >
                            <Trash2 className="w-3 h-3" />
                            Delete Forever
                        </button>
                    )}
                </div>

                {/* Reply Form */}
                {showReplyBox && (
                    <div className="mt-3 pt-3 border-t border-gray-600">
                        <textarea
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            placeholder={`Reply to ${comment.author?.firstname || 'this comment'}...`}
                            className="w-full h-16 bg-gray-600 border border-gray-500 rounded-lg p-2 text-white resize-none focus:border-cyan-400 focus:outline-none text-sm"
                        />
                        <div className="flex gap-2 mt-2">
                            <button
                                onClick={handleReply}
                                disabled={isSubmitting || !replyText.trim()}
                                className="btn btn-primary btn-xs"
                            >
                                {isSubmitting ? 'Posting...' : 'Post Reply'}
                            </button>
                            <button
                                onClick={() => setShowReplyBox(false)}
                                className="btn btn-outline btn-xs"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Nested Replies */}
            {comment.replies && comment.replies.length > 0 && (
                <div className="ml-8 space-y-2 border-l-2 border-gray-600 pl-4">
                    {comment.replies.map((reply) => (
                        <div key={reply._id} className="bg-gray-700/30 rounded-lg p-3">
                            <div className="flex items-center gap-2 mb-2">
                                <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-semibold text-xs">
                                    {(reply.author?.firstname || 'U').charAt(0).toUpperCase()}
                                </div>
                                <span className="font-semibold text-xs text-white">
                                    {reply.author?.firstname || reply.author?.email || 'Anonymous'}
                                </span>
                                <span className="text-xs text-gray-400">
                                    {formatTimeAgo(reply.createdAt)}
                                </span>
                                {reply.isPublic && (
                                    <span className="text-xs bg-green-500/20 text-green-400 px-1 py-0.5 rounded">
                                        PUBLIC ✅
                                    </span>
                                )}
                            </div>
                            <p className="text-gray-300 text-xs">{reply.content}</p>
                            <div className="flex items-center gap-2 mt-1">
                                {/* Upvote Button for Reply */}
                                <button 
                                    onClick={() => onLike(reply._id, reply.isLiked, true)} // true = is a reply
                                    className={`flex items-center gap-1 text-xs transition-colors ${
                                        reply.isLiked 
                                            ? 'text-cyan-400 hover:text-cyan-300' 
                                            : 'text-gray-400 hover:text-cyan-400'
                                    }`}
                                >
                                    <ThumbsUp className={`w-3 h-3 ${reply.isLiked ? 'fill-cyan-400' : 'fill-none stroke-gray-400'}`} />
                                    {reply.upvotes || 0}
                                </button>
                                
                                {/* Delete Button for Reply */}
                                {canDeleteReply(reply) && (
                                    <button
                                        onClick={() => handleDeleteReply(reply._id)}
                                        className="flex items-center gap-1 text-red-400 hover:text-red-300 text-xs transition-colors"
                                    >
                                        <Trash2 className="w-3 h-3" />
                                        Delete
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

// The deprecated components are still defined below, but they are not actively used
// in the primary discussion flow components anymore (AddCommentForm, CommentThread are used).

const ReplyForm = ({ onSubmit, onCancel }) => {
    // ... (Deprecated component)
    const [replyText, setReplyText] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (replyText.trim()) {
            onSubmit(replyText);
            setReplyText('');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-3">
            <textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Write a reply..."
                className="w-full h-20 bg-gray-600 border border-gray-500 rounded-lg p-3 text-white resize-none focus:border-cyan-400 focus:outline-none"
            />
            <div className="flex gap-2">
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="submit"
                    disabled={!replyText.trim()}
                    className="btn btn-primary btn-sm"
                >
                    Reply
                </motion.button>
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="button"
                    onClick={onCancel}
                    className="btn btn-outline btn-sm"
                >
                    Cancel
                </motion.button>
            </div>
        </form>
    );
};


const EditForm = ({ initialContent, onSubmit, onCancel }) => {
    // ... (Deprecated component)
    const [editText, setEditText] = useState(initialContent);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editText.trim() && editText !== initialContent) {
            onSubmit(editText);
        } else {
            onCancel();
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-3">
            <textarea
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                placeholder="Edit your content..."
                className="w-full h-24 bg-gray-600 border border-gray-500 rounded-lg p-3 text-white resize-none focus:border-cyan-400 focus:outline-none"
                autoFocus
            />
            <div className="flex gap-2">
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="submit"
                    disabled={!editText.trim() || editText === initialContent}
                    className="btn btn-primary btn-sm"
                >
                    <CheckCircle className="w-4 h-4" />
                    Save
                </motion.button>
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="button"
                    onClick={onCancel}
                    className="btn btn-outline btn-sm"
                >
                    <XCircle className="w-4 h-4" />
                    Cancel
                </motion.button>
            </div>
        </form>
    );
};

export default ProblemDiscussion;