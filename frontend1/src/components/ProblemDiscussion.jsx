import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    MessageSquare, 
    ThumbsUp, 
    Reply, 
    User, 
    Clock, 
    Send, 
    Search,
    Sparkles,
    Heart,
    Star,
    BookOpen,
    Zap,
    Shield,
    Eye,
    MessageCircle,
    Users
} from 'lucide-react';

const ProblemDiscussion = ({ problemId, problemTitle }) => {
    const { user } = useSelector(state => state.auth);
    const [discussions, setDiscussions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [newDiscussion, setNewDiscussion] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('newest');
    const [showReplyForm, setShowReplyForm] = useState(null);

    console.log('ProblemDiscussion: Component loaded', { problemId, problemTitle, user });

    // Load discussions for this specific problem
    useEffect(() => {
        loadDiscussions();
    }, [problemId]);

    const loadDiscussions = () => {
        console.log('Loading discussions for problem:', problemId);
        
        // Get discussions from localStorage
        const savedDiscussions = JSON.parse(localStorage.getItem(`problem_discussions_${problemId}`) || '[]');
        console.log('Loaded from localStorage:', savedDiscussions);
        
        // Filter out any mock data (discussions with fake usernames)
        const realDiscussions = savedDiscussions.filter(discussion => 
            !['CodeMaster123', 'AlgoNinja', 'DPExpert', 'HashMapPro', 'BeginnerCoder'].includes(discussion.author)
        );
        
        // Update localStorage with only real discussions
        if (realDiscussions.length !== savedDiscussions.length) {
            localStorage.setItem(`problem_discussions_${problemId}`, JSON.stringify(realDiscussions));
        }
        
        // Set discussions from localStorage (no mock data)
        setDiscussions(realDiscussions);
    };

    const handleSubmitDiscussion = async () => {
        if (!newDiscussion.trim()) {
            alert('Please write something to start a discussion.');
            return;
        }

        setIsSubmitting(true);
        try {
            const discussionData = {
                id: Date.now(),
                problemId: problemId,
                problemTitle: problemTitle,
                content: newDiscussion,
                author: user?.firstname || user?.name || 'Anonymous',
                authorId: user?.id || user?._id || 'anonymous',
                timestamp: new Date().toISOString(),
                likes: 0,
                replies: [],
                isLiked: false,
                isBookmarked: false
            };

            // Add to discussions and save to localStorage
            const updatedDiscussions = [discussionData, ...discussions];
            setDiscussions(updatedDiscussions);
            localStorage.setItem(`problem_discussions_${problemId}`, JSON.stringify(updatedDiscussions));
            setNewDiscussion('');
        } catch (error) {
            console.error('Failed to submit discussion:', error);
            alert('Failed to submit discussion. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleLike = (discussionId) => {
        setDiscussions(prev => prev.map(discussion => {
            if (discussion.id === discussionId) {
                const isLiked = discussion.isLiked;
                return {
                    ...discussion,
                    likes: isLiked ? discussion.likes - 1 : discussion.likes + 1,
                    isLiked: !isLiked
                };
            }
            return discussion;
        }));

        // Update localStorage
        const updatedDiscussions = discussions.map(discussion => {
            if (discussion.id === discussionId) {
                const isLiked = discussion.isLiked;
                return {
                    ...discussion,
                    likes: isLiked ? discussion.likes - 1 : discussion.likes + 1,
                    isLiked: !isLiked
                };
            }
            return discussion;
        });
        localStorage.setItem(`problem_discussions_${problemId}`, JSON.stringify(updatedDiscussions));
    };

    const handleReply = (discussionId, replyText) => {
        if (!replyText.trim()) return;

        const newReply = {
            id: Date.now(),
            content: replyText,
            author: user?.firstname || user?.name || 'Anonymous',
            timestamp: new Date().toISOString(),
            likes: 0
        };

        setDiscussions(prev => prev.map(discussion => {
            if (discussion.id === discussionId) {
                return {
                    ...discussion,
                    replies: [...discussion.replies, newReply]
                };
            }
            return discussion;
        }));

        // Update localStorage
        const updatedDiscussions = discussions.map(discussion => {
            if (discussion.id === discussionId) {
                return {
                    ...discussion,
                    replies: [...discussion.replies, newReply]
                };
            }
            return discussion;
        });
        localStorage.setItem(`problem_discussions_${problemId}`, JSON.stringify(updatedDiscussions));
        setShowReplyForm(null);
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

    const filteredDiscussions = discussions.filter(discussion =>
        discussion.content.toLowerCase().includes(searchTerm.toLowerCase())
    ).sort((a, b) => {
        if (sortBy === 'newest') return new Date(b.timestamp) - new Date(a.timestamp);
        if (sortBy === 'oldest') return new Date(a.timestamp) - new Date(b.timestamp);
        if (sortBy === 'most_liked') return b.likes - a.likes;
        return 0;
    });

    return (
        <div className="space-y-6">
            {/* Header */}
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
                    {discussions.length} discussion{discussions.length !== 1 ? 's' : ''}
                </div>
            </div>

            {/* Search and Filter */}
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

            {/* New Discussion Form */}
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

            {/* Discussions List */}
            <div className="space-y-4">
                {filteredDiscussions.length === 0 ? (
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
                    filteredDiscussions.map((discussion) => (
                        <div key={discussion.id} className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                            {/* Discussion Header */}
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-cyan-500 rounded-full flex items-center justify-center text-white font-semibold">
                                        {discussion.author.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <p className="font-semibold text-white">{discussion.author}</p>
                                        <p className="text-xs text-gray-400 flex items-center gap-1">
                                            <Clock className="w-3 h-3" />
                                            {formatTimeAgo(discussion.timestamp)}
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleLike(discussion.id)}
                                    className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm transition-colors ${
                                        discussion.isLiked
                                            ? 'bg-cyan-500 text-white'
                                            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                    }`}
                                >
                                    <ThumbsUp className="w-4 h-4" />
                                    {discussion.likes}
                                </button>
                            </div>

                            {/* Discussion Content */}
                            <div className="mb-4">
                                <p className="text-gray-300 leading-relaxed">{discussion.content}</p>
                            </div>

                            {/* Discussion Actions */}
                            <div className="flex items-center gap-4 pt-4 border-t border-gray-700">
                                <button
                                    onClick={() => setShowReplyForm(showReplyForm === discussion.id ? null : discussion.id)}
                                    className="flex items-center gap-2 text-gray-400 hover:text-cyan-400 transition-colors"
                                >
                                    <Reply className="w-4 h-4" />
                                    Reply ({discussion.replies?.length || 0})
                                </button>
                            </div>

                            {/* Reply Form */}
                            {showReplyForm === discussion.id && (
                                <div className="mt-4 pt-4 border-t border-gray-700">
                                    <ReplyForm
                                        onSubmit={(replyText) => handleReply(discussion.id, replyText)}
                                        onCancel={() => setShowReplyForm(null)}
                                    />
                                </div>
                            )}

                            {/* Replies */}
                            {discussion.replies && discussion.replies.length > 0 && (
                                <div className="mt-4 space-y-3">
                                    {discussion.replies.map((reply) => (
                                        <div key={reply.id} className="ml-8 p-4 bg-gray-700 rounded-lg">
                                            <div className="flex items-center gap-2 mb-2">
                                                <div className="w-6 h-6 bg-gray-500 rounded-full flex items-center justify-center text-white font-semibold text-xs">
                                                    {reply.author.charAt(0).toUpperCase()}
                                                </div>
                                                <span className="font-semibold text-sm text-white">{reply.author}</span>
                                                <span className="text-xs text-gray-400">
                                                    {formatTimeAgo(reply.timestamp)}
                                                </span>
                                            </div>
                                            <p className="text-gray-300 text-sm">{reply.content}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

// Reply Form Component
const ReplyForm = ({ onSubmit, onCancel }) => {
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
                <button
                    type="submit"
                    disabled={!replyText.trim()}
                    className="btn btn-primary btn-sm"
                >
                    Reply
                </button>
                <button
                    type="button"
                    onClick={onCancel}
                    className="btn btn-outline btn-sm"
                >
                    Cancel
                </button>
            </div>
        </form>
    );
};

export default ProblemDiscussion;