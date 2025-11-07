// NotificationBox.js (For the regular user's view/bell)
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Bell, X, Check, AlertCircle, Info, Star, MessageSquare,
    Users, VolumeX, RefreshCw, ChevronDown, ChevronUp, Trash2,
    CheckCircle, AlertTriangle
} from 'lucide-react';
import { useSelector } from 'react-redux';
import axiosClient from '../utils/axiosClient'; // Adjust path if necessary
import { gsap } from 'gsap'; 

// Register GSAP core (assuming GSAP is installed)
gsap.registerPlugin(); 

// --- Configuration ---
const NOTIFICATION_TYPES = {
    info: { icon: Info, color: 'blue', bgColor: 'bg-blue-500/20', borderColor: 'border-blue-500/30' },
    success: { icon: CheckCircle, color: 'green', bgColor: 'bg-green-500/20', borderColor: 'border-green-500/30' },
    warning: { icon: AlertTriangle, color: 'yellow', bgColor: 'bg-yellow-500/20', borderColor: 'border-yellow-500/30' },
    error: { icon: AlertCircle, color: 'red', bgColor: 'bg-red-500/20', borderColor: 'border-red-500/30' },
    message: { icon: MessageSquare, color: 'blue', bgColor: 'bg-blue-500/20', borderColor: 'border-blue-500/30' },
    system: { icon: AlertCircle, color: 'yellow', bgColor: 'bg-yellow-500/20', borderColor: 'border-yellow-500/30' },
    achievement: { icon: Star, color: 'green', bgColor: 'bg-green-500/20', borderColor: 'border-green-500/30' },
    admin: { icon: Users, color: 'purple', bgColor: 'bg-purple-500/20', borderColor: 'border-purple-500/30' },
};

const getNotificationIcon = (type) => {
    const typeKey = type ? type.toLowerCase().replace('-', '') : 'info';
    const config = NOTIFICATION_TYPES[typeKey];
    return config ? config.icon : Bell;
};

const getNotificationColor = (type, priority = 'normal') => {
    if (priority === 'urgent') return 'text-red-400';
    if (priority === 'high') return 'text-orange-400';
    const typeKey = type ? type.toLowerCase().replace('-', '') : 'info';
    const config = NOTIFICATION_TYPES[typeKey];
    return config ? `text-${config.color}-400` : 'text-gray-400';
};

const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInSeconds = Math.floor((now - time) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return time.toLocaleDateString();
};

/**
 * Floating popup for new notifications (toast).
 */
const UserNotificationPopup = ({ notification, onClose }) => {
    if (!notification) return null;

    const typeKey = notification.type.toLowerCase().replace('-', '');
    const notificationType = NOTIFICATION_TYPES[typeKey] || NOTIFICATION_TYPES.info;
    const Icon = notificationType.icon;

    // Auto-close after 5 seconds
    useEffect(() => {
        const timer = setTimeout(onClose, 5000);
        return () => clearTimeout(timer);
    }, [notification, onClose]);

    const bgColorClass = notificationType.color === 'blue' ? 'bg-blue-500' :
                         notificationType.color === 'green' ? 'bg-green-500' :
                         notificationType.color === 'yellow' ? 'bg-yellow-500' :
                         notificationType.color === 'purple' ? 'bg-purple-500' :
                         'bg-red-500';

    return (
        <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.9 }}
            className={`fixed top-4 right-4 z-[100] max-w-sm w-full ${notificationType.bgColor} ${notificationType.borderColor} border rounded-xl p-4 shadow-lg backdrop-blur-sm`}
            role="alert"
        >
            <div className="flex items-start gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${bgColorClass}`}>
                    <Icon size={16} className="text-white" />
                </div>
                
                <div className="flex-1 min-w-0">
                    <h4 className="text-white font-semibold text-sm mb-1">{notification.title}</h4>
                    <p className="text-slate-300 text-sm leading-relaxed">{notification.message}</p>
                </div>
                
                <button
                    onClick={onClose}
                    className="p-1 hover:bg-white/10 rounded transition-colors flex-shrink-0"
                    aria-label="Close notification"
                >
                    <X size={16} className="text-slate-400" />
                </button>
            </div>
        </motion.div>
    );
};

// --- Main Component ---
const NotificationBox = () => {
    const { user } = useSelector(state => state.auth);
    const userId = user?.id; // Get the user ID
    
    const [notifications, setNotifications] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [showAll, setShowAll] = useState(false);

    const notificationRef = useRef(null);
    const bellRef = useRef(null);
    const prevUnreadCountRef = useRef(0);

    const animateBell = () => {
        if (bellRef.current && gsap) {
            gsap.to(bellRef.current.querySelector('svg'), { 
                rotation: [0, -10, 10, -10, 10, 0],
                duration: 0.6,
                ease: "power2.inOut",
            });
        }
    };

    // FIX: Fetches notifications from the API based on the user ID
    const fetchNotifications = useCallback(async () => {
        if (!userId) return;
        
        setIsLoading(true);
        try {
            const response = await axiosClient.get(`/api/notifications/${userId}`);
            const newNotifications = response.data.notifications || [];
            const newUnreadCount = response.data.unreadCount || 0;

            // Animate bell if new notifications arrived
            if (newUnreadCount > prevUnreadCountRef.current) {
                animateBell();
            }

            setNotifications(newNotifications);
            setUnreadCount(newUnreadCount);
            prevUnreadCountRef.current = newUnreadCount;

        } catch (error) {
            console.error('Error fetching notifications:', error);
            setNotifications([]);
            setUnreadCount(0);
        } finally {
            setIsLoading(false);
        }
    }, [userId]);


    const markAsRead = async (notificationId) => {
        try {
            await axiosClient.patch(`/api/notifications/${notificationId}/read`);
            setNotifications(prev => 
                prev.map(notif => 
                    notif._id === notificationId ? { ...notif, isRead: true } : notif
                )
            );
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (error) {
            console.error('Error marking notification as read:', error);
        }
    };

    const markAllAsRead = async () => {
        if (!userId) return;
        try {
            await axiosClient.put(`/api/notifications/${userId}/read-all`);
            setNotifications(prev => prev.map(notif => ({ ...notif, isRead: true })));
            setUnreadCount(0);
        } catch (error) {
            console.error('Error marking all notifications as read:', error);
        }
    };

    // FIX: User deletes/dismisses the notification from their view
    const deleteNotification = async (notificationId) => {
        if (!userId) return;
        try {
            await axiosClient.delete(`/api/notifications/${notificationId}`);
            
            setNotifications(prev => {
                const deletedNotif = prev.find(n => n._id === notificationId);
                if (deletedNotif && !deletedNotif.isRead) {
                    setUnreadCount(count => Math.max(0, count - 1));
                }
                return prev.filter(notif => notif._id !== notificationId);
            });
        } catch (error) {
            console.error('Error deleting/dismissing notification:', error);
        }
    };

    const clearAllNotifications = async () => {
        if (!userId) return;
        if (!window.confirm('Are you sure you want to clear all notifications from your list?')) return;
        try {
            // This API call handles both deleting targeted and dismissing general notifications
            await axiosClient.delete(`/api/notifications/${userId}/clear-all`);
            setNotifications([]);
            setUnreadCount(0);
        } catch (error) {
            console.error('Error clearing all notifications:', error.response?.data || error.message);
            alert('Failed to clear all notifications.');
        }
    };

    // Initial fetch and polling
    useEffect(() => {
        if (userId) {
            fetchNotifications();
            const interval = setInterval(fetchNotifications, 10000); // Poll every 10 seconds
            return () => clearInterval(interval);
        }
    }, [fetchNotifications, userId]);

    // Handles closing the dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                isOpen && 
                notificationRef.current && 
                bellRef.current &&
                !notificationRef.current.contains(event.target) && 
                !bellRef.current.contains(event.target)
            ) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen]);

    const displayedNotifications = showAll ? notifications : notifications.slice(0, 5);

    if (!userId) return null; // Don't show if user is not logged in

    return (
        <div className="relative z-50">
            {/* Notification Bell */}
            <motion.button
                ref={bellRef}
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 text-gray-300 hover:text-white transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                aria-label="Notifications"
            >
                <Bell className="w-6 h-6" />
                {unreadCount > 0 && (
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold"
                    >
                        {unreadCount > 99 ? '99+' : unreadCount}
                    </motion.div>
                )}
            </motion.button>

            {/* 3. Notification Dropdown Panel */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        ref={notificationRef}
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl z-50"
                    >
                        {/* Header and Controls */}
                        <div className="p-4 border-b border-slate-700">
                            <div className="flex items-center justify-between">
                                <h3 className="text-white font-semibold flex items-center gap-2">
                                    <Bell className="w-5 h-5 text-cyan-400" />
                                    Notifications
                                </h3>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={fetchNotifications}
                                        className="p-1 text-gray-400 hover:text-cyan-400 transition-colors"
                                        title="Refresh notifications"
                                        aria-label="Refresh notifications"
                                    >
                                        <RefreshCw className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => setIsOpen(false)}
                                        className="p-1 text-gray-400 hover:text-white transition-colors"
                                        title="Close"
                                        aria-label="Close notification panel"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                            
                            {/* Action Buttons */}
                            <div className="flex items-center justify-between mt-3 text-sm">
                                <button
                                    onClick={markAllAsRead}
                                    className={`text-cyan-400 hover:text-cyan-300 transition-colors ${
                                        unreadCount === 0 ? 'opacity-50 cursor-not-allowed' : ''
                                    }`}
                                    disabled={unreadCount === 0}
                                >
                                    Mark all as read
                                </button>
                                <button
                                    onClick={clearAllNotifications}
                                    className={`text-red-400 hover:text-red-300 transition-colors ${
                                        notifications.length === 0 ? 'opacity-50 cursor-not-allowed' : ''
                                    }`}
                                    disabled={notifications.length === 0}
                                >
                                    Clear all
                                </button>
                            </div>
                        </div>

                        {/* Notifications List */}
                        <div className="max-h-96 overflow-y-auto custom-scrollbar">
                            {isLoading && notifications.length === 0 ? (
                                <div className="p-8 text-center">
                                    <div className="w-6 h-6 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                                    <p className="text-gray-400 text-sm">Loading notifications...</p>
                                </div>
                            ) : notifications.length === 0 ? (
                                <div className="p-8 text-center">
                                    <Bell className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                                    <p className="text-gray-400">No notifications yet</p>
                                    <p className="text-gray-500 text-sm">You'll see updates here when they arrive.</p>
                                </div>
                            ) : (
                                <div className="divide-y divide-slate-700">
                                    {displayedNotifications.map((notification) => {
                                        const IconComponent = getNotificationIcon(notification.type);
                                        const iconColor = getNotificationColor(notification.type, notification.priority);
                                        
                                        return (
                                            <motion.div
                                                key={notification._id}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                onClick={() => !notification.isRead && markAsRead(notification._id)}
                                                className={`p-4 cursor-pointer hover:bg-slate-700/50 transition-colors ${
                                                    !notification.isRead ? 'bg-slate-700/30' : ''
                                                }`}
                                            >
                                                <div className="flex items-start gap-3">
                                                    {/* Icon */}
                                                    <div className={`p-2 rounded-lg bg-slate-600/50 ${iconColor}`}>
                                                        <IconComponent className="w-4 h-4" />
                                                    </div>
                                                    
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-start justify-between">
                                                            <div className="flex-1">
                                                                {/* Title */}
                                                                <h4 className={`text-sm font-medium ${
                                                                    !notification.isRead ? 'text-white' : 'text-gray-300'
                                                                }`}>
                                                                    {notification.title}
                                                                </h4>
                                                                {/* Message */}
                                                                <p className="text-gray-400 text-sm mt-1 line-clamp-2">
                                                                    {notification.message}
                                                                </p>
                                                                {/* Metadata */}
                                                                <div className="flex items-center gap-2 mt-2">
                                                                    <span className="text-xs text-gray-500">
                                                                        {formatTimeAgo(notification.createdAt)}
                                                                    </span>
                                                                    {/* Unread indicator */}
                                                                    {!notification.isRead && (
                                                                        <div 
                                                                            className="w-2 h-2 bg-cyan-400 rounded-full" 
                                                                            title="Unread" 
                                                                        />
                                                                    )}
                                                                </div>
                                                            </div>
                                                            
                                                            {/* Actions */}
                                                            <div className="flex items-center gap-1 ml-2 flex-shrink-0">
                                                                {/* User Delete/Dismiss button */}
                                                                <button
                                                                    onClick={(e) => { e.stopPropagation(); deleteNotification(notification._id); }}
                                                                    className="p-1 text-gray-400 hover:text-red-400 transition-colors"
                                                                    title="Delete from your view"
                                                                    aria-label="Delete notification"
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

                        {/* Footer (Show All/Show Less) */}
                        {notifications.length > 5 && (
                            <div className="p-4 border-t border-slate-700">
                                <button
                                    onClick={() => setShowAll(!showAll)}
                                    className="w-full flex items-center justify-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors text-sm"
                                >
                                    {showAll ? (
                                        <>
                                            <ChevronUp className="w-4 h-4" />
                                            Show Less
                                        </>
                                    ) : (
                                        <>
                                            <ChevronDown className="w-4 h-4" />
                                            Show All ({notifications.length})
                                        </>
                                    )}
                                </button>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default NotificationBox;