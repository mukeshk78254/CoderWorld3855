// AdminNotificationPanel.js (React Frontend) - FIX

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { gsap } from 'gsap';
import {
    Send, Users, MessageSquare, AlertCircle, Star, Info,
    Clock, Check, X, Trash2, Edit3, RefreshCw
} from 'lucide-react';
import { useSelector } from 'react-redux';
import axiosClient from '../../utils/axiosClient';

gsap.registerPlugin();

// --- Helper Functions (Kept for visual consistency) ---
const getNotificationTypeIcon = (type) => {
    switch (type) {
        case 'message': return MessageSquare; case 'system': return AlertCircle;
        case 'achievement': return Star; case 'admin': return Users;
        case 'info': return Info; default: return Send;
    }
};
const getNotificationColor = (type, priority = 'normal') => {
    if (priority === 'urgent') return 'text-red-400 bg-red-500/20';
    if (priority === 'high') return 'text-orange-400 bg-orange-500/20';
    switch (type) {
        case 'message': return 'text-blue-400 bg-blue-500/20';
        case 'system': return 'text-yellow-400 bg-yellow-500/20';
        case 'achievement': return 'text-green-400 bg-green-500/20';
        case 'admin': return 'text-purple-400 bg-purple-500/20';
        case 'info': return 'text-cyan-400 bg-cyan-500/20';
        default: return 'text-gray-400 bg-gray-500/20';
    }
};
const formatDate = (dateString) => new Date(dateString).toLocaleString();

const AdminNotificationPanel = () => {
    const { user } = useSelector(state => state.auth);
    const [isOpen, setIsOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [isSending, setIsSending] = useState(false);
    
    const [formData, setFormData] = useState({
        title: '', message: '', type: 'admin', targetUsers: 'all', 
        targetUserId: '', targetRole: 'member', priority: 'normal',
    });

    // Stats now rely entirely on the API endpoint
    const [stats, setStats] = useState({
        totalSent: 0, 
        totalReadsLogged: 0, // Reflects the data we can actually fetch easily
        todaySent: 0
    });

    const panelRef = useRef(null);
    const formRef = useRef(null);
    const isAdmin = user?.role === 'admin' || user?.role === 'superadmin';

    const fetchStats = useCallback(async () => {
        try {
            const response = await axiosClient.get('/api/notifications/admin/stats');
            setStats(response.data.stats);
        } catch (error) {
            console.error('Error fetching admin stats:', error.message);
            setStats({ totalSent: 0, totalReadsLogged: 0, todaySent: 0 });
        }
    }, []);

    const fetchNotifications = useCallback(async () => {
        setIsLoading(true);
        try {
            // Fetch all general/role notifications for admin display
            const response = await axiosClient.get('/api/notifications/admin/all');
            setNotifications(response.data.notifications || []);
        } catch (error) {
            console.error('Error fetching admin notifications:', error.message);
            setNotifications([]);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        if (isAdmin && isOpen) {
            fetchNotifications();
            fetchStats();
        }
    }, [isAdmin, isOpen, fetchNotifications, fetchStats]);

    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSendNotification = async () => {
        if (!formData.title.trim() || !formData.message.trim()) {
            alert('Please fill in title and message');
            return;
        }

        setIsSending(true);
        
        try {
            let payload = {
                title: formData.title,
                message: formData.message,
                type: formData.type,
                priority: formData.priority,
            };

            if (formData.targetUsers === 'role') {
                payload.targetRole = formData.targetRole;
            } else if (formData.targetUsers === 'specific') {
                payload.targetUserId = formData.targetUserId;
            } else {
                 payload.targetRole = 'all'; 
            }

            // Send notification via API
            await axiosClient.post('/api/notifications/send', payload);
            
            // Success animation
            if (formRef.current) {
                gsap.fromTo(formRef.current, { backgroundColor: '#16a34a' }, { backgroundColor: '#1e293b', duration: 1, ease: 'power2.out' });
            }
            
            alert('Notification sent successfully!');
            
            // Reset form
            setFormData({
                title: '', message: '', type: 'admin', targetUsers: 'all', 
                targetUserId: '', targetRole: 'member', priority: 'normal',
            });
            setShowForm(false);
            fetchNotifications(); // Refresh list
            fetchStats(); // Update stats
        } catch (error) {
            console.error('Error sending notification:', error.response?.data?.msg || error.message);
            alert('Failed to send notification: ' + (error.response?.data?.msg || 'Server Error'));
        } finally {
            setIsSending(false);
        }
    };

    // FIX: Function calls the new global delete endpoint
    const adminDeleteNotification = async (notificationId) => {
        if (!confirm('⚠️ ADMIN DELETE: This will permanently delete this notification from the database for ALL users. Continue?')) return;
        
        try {
            await axiosClient.delete(`/api/notifications/admin/${notificationId}`);
            alert('✅ Notification permanently deleted.');
            fetchNotifications(); // Refresh list
            fetchStats(); // Update stats
        } catch (error) {
            console.error('Error admin deleting notification:', error.response?.data?.msg || error.message);
            alert('❌ Failed to delete notification. Please try again.');
        }
    };

    if (!isAdmin) {
        return null;
    }

    return (
        <div className="relative">
            {/* Admin Panel Toggle */}
            <motion.button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 text-gray-300 hover:text-white transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                title="Admin Notification Panel"
            >
                <Users className="w-6 h-6" />
                {stats.totalSent > 0 && (
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-1 -right-1 bg-purple-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold"
                    >
                        {stats.totalSent > 99 ? '99+' : stats.totalSent}
                    </motion.div>
                )}
            </motion.button>

            {/* Admin Panel */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        ref={panelRef}
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 top-full mt-2 w-[500px] bg-slate-800 border border-slate-700 rounded-xl shadow-2xl z-50"
                    >
                        {/* Header */}
                        <div className="p-4 border-b border-slate-700">
                            <div className="flex items-center justify-between">
                                <h3 className="text-white font-semibold flex items-center gap-2">
                                    <Users className="w-5 h-5 text-purple-400" />
                                    Admin Notifications
                                </h3>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => setShowForm(!showForm)}
                                        className="px-3 py-1 bg-purple-500 hover:bg-purple-600 text-white text-sm rounded-lg transition-colors flex items-center gap-1"
                                    >
                                        <Send className="w-4 h-4" />
                                        Send
                                    </button>
                                    <button
                                        onClick={() => { fetchNotifications(); fetchStats(); }}
                                        className="p-1 text-gray-400 hover:text-cyan-400 transition-colors"
                                        title="Refresh data"
                                    >
                                        <RefreshCw className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => setIsOpen(false)}
                                        className="p-1 text-gray-400 hover:text-white transition-colors"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                            
                            {/* Stats (Now relying on API aggregation) */}
                            <div className="grid grid-cols-4 gap-2 mt-3 text-center">
                                <div className="p-2 bg-slate-700/50 rounded-lg">
                                    <div className="text-lg font-bold text-cyan-400">{stats.totalSent}</div>
                                    <div className="text-xs text-gray-400">Total Sent</div>
                                </div>
                                <div className="p-2 bg-slate-700/50 rounded-lg">
                                    <div className="text-lg font-bold text-green-400">
                                        {/* Display the size of the largest 'readBy' array for a rough estimate */}
                                        {stats.totalReadsLogged}
                                    </div>
                                    <div className="text-xs text-gray-400">Total Reads (Interactions)</div>
                                </div>
                                <div className="p-2 bg-slate-700/50 rounded-lg">
                                    <div className="text-lg font-bold text-yellow-400">---</div>
                                    <div className="text-xs text-gray-400">Total Unread (Complex)</div>
                                </div>
                                <div className="p-2 bg-slate-700/50 rounded-lg">
                                    <div className="text-lg font-bold text-purple-400">{stats.todaySent}</div>
                                    <div className="text-xs text-gray-400">Today Sent</div>
                                </div>
                            </div>
                        </div>

                        {/* Send Notification Form (Minimized for brevity, only controls shown) */}
                        <AnimatePresence>
                            {showForm && (
                                <motion.div
                                    ref={formRef}
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="p-4 border-b border-slate-700 bg-slate-700/30 overflow-hidden"
                                >
                                    {/* ... (Form inputs as provided in the previous response) ... */}
                                    <h4 className="text-white font-medium mb-3">Send New Notification</h4>
                                    <div className="space-y-3">
                                        {/* Title, Type, Message */}
                                        <div className="grid grid-cols-2 gap-3">
                                            <div><label className="block text-sm text-gray-300 mb-1">Title</label><input type="text" value={formData.title} onChange={(e) => handleInputChange('title', e.target.value)} className="w-full px-3 py-2 bg-slate-600 border border-slate-500 rounded-lg text-white text-sm focus:border-cyan-400" placeholder="Notification title"/></div>
                                            <div><label className="block text-sm text-gray-300 mb-1">Type</label><select value={formData.type} onChange={(e) => handleInputChange('type', e.target.value)} className="w-full px-3 py-2 bg-slate-600 border border-slate-500 rounded-lg text-white text-sm focus:border-cyan-400"><option value="admin">Admin Message</option><option value="info">Info</option><option value="system">System</option><option value="achievement">Achievement</option></select></div>
                                        </div>
                                        <div><label className="block text-sm text-gray-300 mb-1">Message</label><textarea value={formData.message} onChange={(e) => handleInputChange('message', e.target.value)} className="w-full px-3 py-2 bg-slate-600 border border-slate-500 rounded-lg text-white text-sm focus:border-cyan-400" rows="3" placeholder="Notification message"/></div>
                                        {/* Target, Priority, Role */}
                                        <div className="grid grid-cols-2 gap-3">
                                            <div><label className="block text-sm text-gray-300 mb-1">Target</label><select value={formData.targetUsers} onChange={(e) => handleInputChange('targetUsers', e.target.value)} className="w-full px-3 py-2 bg-slate-600 border border-slate-500 rounded-lg text-white text-sm focus:border-cyan-400"><option value="all">All Users</option><option value="role">By Role</option><option value="specific">Specific User ID</option></select></div>
                                            <div><label className="block text-sm text-gray-300 mb-1">Priority</label><select value={formData.priority} onChange={(e) => handleInputChange('priority', e.target.value)} className="w-full px-3 py-2 bg-slate-600 border border-slate-500 rounded-lg text-white text-sm focus:border-cyan-400"><option value="low">Low</option><option value="normal">Normal</option><option value="high">High</option><option value="urgent">Urgent</option></select></div>
                                        </div>
                                        {formData.targetUsers === 'role' && (<div><label className="block text-sm text-gray-300 mb-1">User Role</label><select value={formData.targetRole} onChange={(e) => handleInputChange('targetRole', e.target.value)} className="w-full px-3 py-2 bg-slate-600 border border-slate-500 rounded-lg text-white text-sm focus:border-cyan-400"><option value="member">Members</option><option value="premium">Premium Users</option><option value="admin">Admins</option></select></div>)}
                                        {formData.targetUsers === 'specific' && (<div><label className="block text-sm text-gray-300 mb-1">Specific User ID</label><input type="text" value={formData.targetUserId} onChange={(e) => handleInputChange('targetUserId', e.target.value)} className="w-full px-3 py-2 bg-slate-600 border border-slate-500 rounded-lg text-white text-sm focus:border-cyan-400" placeholder="Enter user ID"/></div>)}
                                        {/* Send Button */}
                                        <div className="flex gap-2">
                                            <button onClick={handleSendNotification} disabled={isSending} className="flex-1 px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
                                                {isSending ? (<><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Sending...</>) : (<><Send className="w-4 h-4" />Send Notification</>)}
                                            </button>
                                            <button onClick={() => setShowForm(false)} className="px-4 py-2 bg-slate-600 hover:bg-slate-500 text-white rounded-lg transition-colors">Cancel</button>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Notifications List (Admin List View) */}
                        <div className="max-h-96 overflow-y-auto custom-scrollbar">
                            {isLoading ? (
                                <div className="p-8 text-center"><div className="w-6 h-6 border-2 border-purple-400 border-t-transparent rounded-full animate-spin mx-auto mb-2" /><p className="text-gray-400 text-sm">Loading notifications...</p></div>
                            ) : notifications.length === 0 ? (
                                <div className="p-8 text-center"><Users className="w-12 h-12 text-gray-600 mx-auto mb-3" /><p className="text-gray-400">No notifications sent yet</p></div>
                            ) : (
                                <div className="divide-y divide-slate-700">
                                    {notifications.map((notification) => {
                                        const IconComponent = getNotificationTypeIcon(notification.type);
                                        const colorClass = getNotificationColor(notification.type, notification.priority);
                                        const totalReads = notification.readBy ? notification.readBy.length : 0;
                                        
                                        return (
                                            <motion.div
                                                key={notification._id}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                className="p-4 hover:bg-slate-700/50 transition-colors"
                                            >
                                                <div className="flex items-start gap-3">
                                                    <div className={`p-2 rounded-lg ${colorClass}`}><IconComponent className="w-4 h-4" /></div>
                                                    
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-start justify-between">
                                                            <div className="flex-1">
                                                                <div className="flex items-center gap-2 mb-1">
                                                                    <h4 className="text-sm font-medium text-white">{notification.title}</h4>
                                                                    <span className={`px-2 py-1 rounded text-xs ${getNotificationColor(null, notification.priority)}`}>{notification.priority}</span>
                                                                </div>
                                                                <p className="text-gray-400 text-sm mb-2">{notification.message}</p>
                                                                <div className="flex items-center gap-4 text-xs text-gray-500">
                                                                    <span>Sent: {formatDate(notification.createdAt)}</span>
                                                                    <span>Target: {notification.targetRole || (notification.targetUserId ? 'Specific User' : 'All')}</span>
                                                                    {/* Display Actual Read Count */}
                                                                    <span>Read Count: **{totalReads}**</span> 
                                                                </div>
                                                            </div>
                                                            
                                                            <div className="flex items-center gap-1 ml-2">
                                                                {/* DELETE FROM ALL USERS */}
                                                                <button
                                                                    onClick={() => adminDeleteNotification(notification._id)}
                                                                    className="p-1 text-gray-400 hover:text-red-400 transition-colors"
                                                                    title="ADMIN: Delete permanently for ALL users"
                                                                >
                                                                    <Trash2 className="w-3 h-3" />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AdminNotificationPanel;