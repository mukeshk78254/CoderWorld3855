
// import React, { useState, useEffect, useRef } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import { 
//     Bell, X, Check, AlertCircle, Info, Star, MessageSquare,
//     Users, Clock, Volume2, VolumeX, RefreshCw, ChevronDown, ChevronUp, Trash2
// } from 'lucide-react';
// import { useSelector } from 'react-redux'; // Assuming you use Redux for user state
// import axiosClient from '../utils/axiosClient'; 
// import { gsap } from 'gsap'; // 👈 FIX: Import GSAP

// // Register GSAP core (no specific plugin needed for simple rotation)
// gsap.registerPlugin(); 

// const NotificationBox = () => {
//     // Redux state
//     const { user } = useSelector(state => state.auth);
    
//     // Local component state
//     const [notifications, setNotifications] = useState([]);
//     const [isOpen, setIsOpen] = useState(false);
//     const [unreadCount, setUnreadCount] = useState(0);
//     const [isLoading, setIsLoading] = useState(false);
//     const [showAll, setShowAll] = useState(false);
    
//     // Load sound preference from localStorage or default to true
//     const [soundEnabled, setSoundEnabled] = useState(() => {
//         const storedPref = localStorage.getItem('notificationSoundEnabled');
//         return storedPref === 'true' || storedPref === null; 
//     });

//     // Refs
//     const notificationRef = useRef(null);
//     const bellRef = useRef(null);

//     // --- API Call Functions ---

//     // Fetches notifications from the backend
//     const fetchNotifications = async () => {
//         if (!user?.id) return;
        
//         setIsLoading(true);
//         try {
//             // Using a consistent API route: /api/notifications/:userId
//             const response = await axiosClient.get(`/api/notifications/${user.id}`);
//             const data = response.data;
//             setNotifications(data.notifications || []);
//             setUnreadCount(data.unreadCount || 0);
//         } catch (error) {
//             console.error('Error fetching notifications:', error);
//             setNotifications([]);
//             setUnreadCount(0);
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     // Mark a single notification as read
//     const markAsRead = async (notificationId) => {
//         try {
//             // Using PATCH for partial update of a resource (setting isRead: true)
//             await axiosClient.patch(`/api/notifications/${notificationId}/read`);
//             setNotifications(prev => 
//                 prev.map(notif => 
//                     notif._id === notificationId 
//                         ? { ...notif, isRead: true }
//                         : notif
//                 )
//             );
//             setUnreadCount(prev => Math.max(0, prev - 1));
//         } catch (error) {
//             console.error('Error marking notification as read:', error);
//         }
//     };

//     // Mark all notifications as read
//     const markAllAsRead = async () => {
//         try {
//             // Using PUT for a bulk update of the collection
//             await axiosClient.put(`/api/notifications/${user.id}/read-all`);
//             setNotifications(prev => prev.map(notif => ({ ...notif, isRead: true })));
//             setUnreadCount(0);
//         } catch (error) {
//             console.error('Error marking all notifications as read:', error);
//         }
//     };

//     // Delete a single notification
//     const deleteNotification = async (notificationId) => {
//         try {
//             // Using DELETE for resource removal
//             await axiosClient.delete(`/api/notifications/${notificationId}`);
//             setNotifications(prev => prev.filter(notif => notif._id !== notificationId));
//             setUnreadCount(prev => {
//                 const deletedNotif = notifications.find(n => n._id === notificationId);
//                 return deletedNotif && !deletedNotif.isRead ? prev - 1 : prev;
//             });
//         } catch (error) {
//             console.error('Error deleting notification:', error);
//         }
//     };

//     // Delete all notifications
//     const clearAllNotifications = async () => {
//         try {
//             // Using DELETE for bulk removal of the collection
//             await axiosClient.delete(`/api/notifications/${user.id}/clear-all`);
//             setNotifications([]);
//             setUnreadCount(0);
//         } catch (error) {
//             console.error('Error clearing all notifications:', error);
//         }
//     };

//     // --- Utility & Effect Functions ---

//     // Plays a simple notification sound
//     const playNotificationSound = () => {
//         if (soundEnabled) {
//             try {
//                 const audioContext = new (window.AudioContext || window.webkitAudioContext)();
//                 const oscillator = audioContext.createOscillator();
//                 const gainNode = audioContext.createGain();
                
//                 oscillator.connect(gainNode);
//                 gainNode.connect(audioContext.destination);
                
//                 oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
//                 oscillator.type = 'sine';
                
//                 gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
//                 gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
                
//                 oscillator.start(audioContext.currentTime);
//                 oscillator.stop(audioContext.currentTime + 0.3);
//             } catch (error) {
//                 console.log('Notification sound error:', error);
//             }
//         }
//     };

//     // GSAP Bell animation for new notifications
//     const animateBell = () => {
//         if (bellRef.current && gsap) {
//             gsap.to(bellRef.current.querySelector('svg'), { // Target the SVG inside the button
//                 rotation: [0, -10, 10, -10, 10, 0],
//                 duration: 0.6,
//                 ease: "power2.inOut",
//             });
//         }
//     };

//     // Toggles sound and saves preference to localStorage
//     const toggleSound = () => {
//         setSoundEnabled(prev => {
//             const newState = !prev;
//             localStorage.setItem('notificationSoundEnabled', newState);
//             return newState;
//         });
//     };

//     // Fetches notifications on mount and sets up polling
//     useEffect(() => {
//         fetchNotifications();
        
//         const interval = setInterval(fetchNotifications, 10000); // Poll every 10s
        
//         return () => clearInterval(interval);
//     }, [user?.id]);

//     // Triggers animation and sound when unread count changes to > 0
//     useEffect(() => {
//         // We only want to trigger the animation/sound if the component is mounted 
//         // and a new notification arrived (i.e., unreadCount > 0)
//         // A more robust check might involve comparing prevProps.unreadCount
//         // but for a clean reset, we'll keep it simple here.
//         if (unreadCount > 0) {
//             animateBell();
//             playNotificationSound();
//         }
//     }, [unreadCount]);

//     // Handles closing the dropdown when clicking outside
//     useEffect(() => {
//         const handleClickOutside = (event) => {
//             if (
//                 isOpen && 
//                 notificationRef.current && 
//                 bellRef.current &&
//                 !notificationRef.current.contains(event.target) && 
//                 !bellRef.current.contains(event.target)
//             ) {
//                 setIsOpen(false);
//             }
//         };

//         document.addEventListener('mousedown', handleClickOutside);
//         return () => document.removeEventListener('mousedown', handleClickOutside);
//     }, [isOpen]);

//     // Map notification type to Lucide icon component
//     const getNotificationIcon = (type) => {
//         switch (type) {
//             case 'message': return MessageSquare;
//             case 'system': return AlertCircle;
//             case 'achievement': return Star;
//             case 'admin': return Users;
//             case 'info': return Info;
//             default: return Bell;
//         }
//     };

//     // Map notification type to icon color class
//     const getNotificationColor = (type) => {
//         switch (type) {
//             case 'message': return 'text-blue-400';
//             case 'system': return 'text-yellow-400';
//             case 'achievement': return 'text-green-400';
//             case 'admin': return 'text-purple-400';
//             case 'info': return 'text-cyan-400';
//             default: return 'text-gray-400';
//         }
//     };

//     // Formats time into a human-readable 'time ago' string
//     const formatTimeAgo = (timestamp) => {
//         const now = new Date();
//         const time = new Date(timestamp);
//         const diffInSeconds = Math.floor((now - time) / 1000);
        
//         if (diffInSeconds < 60) return 'Just now';
//         if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
//         if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
//         if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
        
//         return time.toLocaleDateString();
//     };

//     // Limits notifications if not showing all
//     const displayedNotifications = showAll ? notifications : notifications.slice(0, 5);

//     // --- Render ---

//     return (
//         <div className="relative z-50">
//             {/* Notification Bell */}
//             <motion.button
//                 ref={bellRef}
//                 onClick={() => setIsOpen(!isOpen)}
//                 className="relative p-2 text-gray-300 hover:text-white transition-colors"
//                 whileHover={{ scale: 1.1 }}
//                 whileTap={{ scale: 0.9 }}
//                 aria-label="Notifications"
//             >
//                 <Bell className="w-6 h-6" />
//                 {/* Unread count badge */}
//                 {unreadCount > 0 && (
//                     <motion.div
//                         initial={{ scale: 0 }}
//                         animate={{ scale: 1 }}
//                         className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold"
//                     >
//                         {unreadCount > 99 ? '99+' : unreadCount}
//                     </motion.div>
//                 )}
//             </motion.button>

//             {/* Notification Dropdown Panel */}
//             <AnimatePresence>
//                 {isOpen && (
//                     <motion.div
//                         ref={notificationRef}
//                         initial={{ opacity: 0, y: -10, scale: 0.95 }}
//                         animate={{ opacity: 1, y: 0, scale: 1 }}
//                         exit={{ opacity: 0, y: -10, scale: 0.95 }}
//                         transition={{ duration: 0.2 }}
//                         className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl z-50"
//                     >
//                         {/* Header and Controls */}
//                         <div className="p-4 border-b border-slate-700">
//                             <div className="flex items-center justify-between">
//                                 <h3 className="text-white font-semibold flex items-center gap-2">
//                                     <Bell className="w-5 h-5 text-cyan-400" />
//                                     Notifications
//                                 </h3>
//                                 <div className="flex items-center gap-2">
//                                     <button
//                                         onClick={fetchNotifications}
//                                         className="p-1 text-gray-400 hover:text-cyan-400 transition-colors"
//                                         title="Refresh notifications"
//                                         aria-label="Refresh notifications"
//                                     >
//                                         <RefreshCw className="w-4 h-4" />
//                                     </button>
//                                     <button
//                                         onClick={toggleSound}
//                                         className={`p-1 rounded transition-colors ${
//                                             soundEnabled ? 'text-cyan-400' : 'text-gray-500'
//                                         }`}
//                                         title={soundEnabled ? 'Disable sound' : 'Enable sound'}
//                                         aria-label={soundEnabled ? 'Disable sound' : 'Enable sound'}
//                                     >
//                                         {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
//                                     </button>
//                                     <button
//                                         onClick={() => setIsOpen(false)}
//                                         className="p-1 text-gray-400 hover:text-white transition-colors"
//                                         title="Close"
//                                         aria-label="Close notification panel"
//                                     >
//                                         <X className="w-4 h-4" />
//                                     </button>
//                                 </div>
//                             </div>
                            
//                             {/* Action Buttons */}
//                             <div className="flex items-center justify-between mt-3 text-sm">
//                                 <button
//                                     onClick={markAllAsRead}
//                                     className={`text-cyan-400 hover:text-cyan-300 transition-colors ${
//                                         unreadCount === 0 ? 'opacity-50 cursor-not-allowed' : ''
//                                     }`}
//                                     disabled={unreadCount === 0}
//                                 >
//                                     Mark all as read
//                                 </button>
//                                 <button
//                                     onClick={clearAllNotifications}
//                                     className={`text-red-400 hover:text-red-300 transition-colors ${
//                                         notifications.length === 0 ? 'opacity-50 cursor-not-allowed' : ''
//                                     }`}
//                                     disabled={notifications.length === 0}
//                                 >
//                                     Clear all
//                                 </button>
//                             </div>
//                         </div>

//                         {/* Notifications List */}
//                         <div className="max-h-96 overflow-y-auto custom-scrollbar">
//                             {isLoading && notifications.length === 0 ? (
//                                 <div className="p-8 text-center">
//                                     <div className="w-6 h-6 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
//                                     <p className="text-gray-400 text-sm">Loading notifications...</p>
//                                 </div>
//                             ) : notifications.length === 0 ? (
//                                 <div className="p-8 text-center">
//                                     <Bell className="w-12 h-12 text-gray-600 mx-auto mb-3" />
//                                     <p className="text-gray-400">No notifications yet</p>
//                                     <p className="text-gray-500 text-sm">You'll see updates here when they arrive.</p>
//                                 </div>
//                             ) : (
//                                 <div className="divide-y divide-slate-700">
//                                     {displayedNotifications.map((notification) => {
//                                         const IconComponent = getNotificationIcon(notification.type);
//                                         const iconColor = getNotificationColor(notification.type);
                                        
//                                         return (
//                                             <motion.div
//                                                 key={notification._id}
//                                                 initial={{ opacity: 0, x: -20 }}
//                                                 animate={{ opacity: 1, x: 0 }}
//                                                 className={`p-4 hover:bg-slate-700/50 transition-colors ${
//                                                     !notification.isRead ? 'bg-slate-700/30' : ''
//                                                 }`}
//                                             >
//                                                 <div className="flex items-start gap-3">
//                                                     {/* Icon */}
//                                                     <div className={`p-2 rounded-lg bg-slate-600/50 ${iconColor}`}>
//                                                         <IconComponent className="w-4 h-4" />
//                                                     </div>
                                                    
//                                                     <div className="flex-1 min-w-0">
//                                                         <div className="flex items-start justify-between">
//                                                             <div className="flex-1">
//                                                                 {/* Title */}
//                                                                 <h4 className={`text-sm font-medium ${
//                                                                     !notification.isRead ? 'text-white' : 'text-gray-300'
//                                                                 }`}>
//                                                                     {notification.title}
//                                                                 </h4>
//                                                                 {/* Message */}
//                                                                 <p className="text-gray-400 text-sm mt-1 line-clamp-2">
//                                                                     {notification.message}
//                                                                 </p>
//                                                                 {/* Metadata */}
//                                                                 <div className="flex items-center gap-2 mt-2">
//                                                                     <span className="text-xs text-gray-500">
//                                                                         {formatTimeAgo(notification.createdAt)}
//                                                                     </span>
//                                                                     {/* Unread indicator */}
//                                                                     {!notification.isRead && (
//                                                                         <div className="w-2 h-2 bg-cyan-400 rounded-full" title="Unread" />
//                                                                     )}
//                                                                 </div>
//                                                             </div>
                                                            
//                                                             {/* Actions */}
//                                                             <div className="flex items-center gap-1 ml-2 flex-shrink-0">
//                                                                 {/* Mark as read button */}
//                                                                 {!notification.isRead && (
//                                                                     <button
//                                                                         onClick={() => markAsRead(notification._id)}
//                                                                         className="p-1 text-gray-400 hover:text-green-400 transition-colors"
//                                                                         title="Mark as read"
//                                                                         aria-label="Mark as read"
//                                                                     >
//                                                                         <Check className="w-3 h-3" />
//                                                                     </button>
//                                                                 )}
//                                                                 {/* Delete button */}
//                                                                 <button
//                                                                     onClick={() => deleteNotification(notification._id)}
//                                                                     className="p-1 text-gray-400 hover:text-red-400 transition-colors"
//                                                                     title="Delete"
//                                                                     aria-label="Delete notification"
//                                                                 >
//                                                                     <Trash2 className="w-3 h-3" />
//                                                                 </button>
//                                                             </div>
//                                                         </div>
//                                                     </div>
//                                                 </div>
//                                             </motion.div>
//                                         );
//                                     })}
//                                 </div>
//                             )}
//                         </div>

//                         {/* Footer (Show All/Show Less) */}
//                         {notifications.length > 5 && (
//                             <div className="p-4 border-t border-slate-700">
//                                 <button
//                                     onClick={() => setShowAll(!showAll)}
//                                     className="w-full flex items-center justify-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors text-sm"
//                                 >
//                                     {showAll ? (
//                                         <>
//                                             <ChevronUp className="w-4 h-4" />
//                                             Show Less
//                                         </>
//                                     ) : (
//                                         <>
//                                             <ChevronDown className="w-4 h-4" />
//                                             Show All ({notifications.length})
//                                         </>
//                                     )}
//                                 </button>
//                             </div>
//                         )}
//                     </motion.div>
//                 )}
//             </AnimatePresence>
//         </div>
//     );
// };

// export default NotificationBox;
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Bell, X, Check, AlertCircle, Info, Star, MessageSquare,
    Users, Clock, Volume2, VolumeX, RefreshCw, ChevronDown, ChevronUp, Trash2,
    Send, CheckCircle, AlertTriangle
} from 'lucide-react';
import { useSelector } from 'react-redux';
import axiosClient from '../utils/axiosClient';
import { gsap } from 'gsap'; 

// Register GSAP core (ensure you have GSAP installed: npm install gsap)
gsap.registerPlugin(); 

// --- Configuration ---
const NOTIFICATION_TYPES = {
    info: { icon: Info, color: 'blue', bgColor: 'bg-blue-500/20', borderColor: 'border-blue-500/30' },
    success: { icon: CheckCircle, color: 'green', bgColor: 'bg-green-500/20', borderColor: 'border-green-500/30' },
    warning: { icon: AlertTriangle, color: 'yellow', bgColor: 'bg-yellow-500/20', borderColor: 'border-yellow-500/30' },
    error: { icon: AlertCircle, color: 'red', bgColor: 'bg-red-500/20', borderColor: 'border-red-500/30' },
    // Custom types for bell dropdown
    message: { icon: MessageSquare, color: 'blue', bgColor: 'bg-blue-500/20', borderColor: 'border-blue-500/30' },
    system: { icon: AlertCircle, color: 'yellow', bgColor: 'bg-yellow-500/20', borderColor: 'border-yellow-500/30' },
    achievement: { icon: Star, color: 'green', bgColor: 'bg-green-500/20', borderColor: 'border-green-500/30' },
    admin: { icon: Users, color: 'purple', bgColor: 'bg-purple-500/20', borderColor: 'border-purple-500/30' },
};

// --- Helper Components ---

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

    return (
        <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.9 }}
            className={`fixed top-4 right-4 z-[100] max-w-sm w-full ${notificationType.bgColor} ${notificationType.borderColor} border rounded-xl p-4 shadow-lg backdrop-blur-sm`}
            role="alert"
        >
            <div className="flex items-start gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    notificationType.color === 'blue' ? 'bg-blue-500' :
                    notificationType.color === 'green' ? 'bg-green-500' :
                    notificationType.color === 'yellow' ? 'bg-yellow-500' :
                    notificationType.color === 'purple' ? 'bg-purple-500' :
                    'bg-red-500'
                }`}>
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
    
    const [notifications, setNotifications] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [showAll, setShowAll] = useState(false);
    
    // REQUESTED CHANGE: Sound is permanently disabled
    const [soundEnabled, setSoundEnabled] = useState(false);
    const [popupNotification, setPopupNotification] = useState(null); 

    const notificationRef = useRef(null);
    const bellRef = useRef(null);
    const prevUnreadCountRef = useRef(0);

    // --- API & Core Logic ---

    // Plays a simple notification sound (Kept for completeness, but won't run due to soundEnabled=false)
    const playNotificationSound = () => {
        if (soundEnabled) {
            try {
                const audioContext = new (window.AudioContext || window.webkitAudioContext)();
                const oscillator = audioContext.createOscillator();
                const gainNode = audioContext.createGain();
                
                oscillator.connect(gainNode);
                gainNode.connect(audioContext.destination);
                
                oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
                oscillator.type = 'sine';
                
                gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
                
                oscillator.start(audioContext.currentTime);
                oscillator.stop(audioContext.currentTime + 0.3);
            } catch (error) {

            }
        }
    };

    const animateBell = () => {
        if (bellRef.current && gsap) {
            gsap.to(bellRef.current.querySelector('svg'), { 
                rotation: [0, -10, 10, -10, 10, 0],
                duration: 0.6,
                ease: "power2.inOut",
            });
        }
    };

    const fetchNotifications = useCallback(async () => {
        if (!user?.id) return;
        
        setIsLoading(true);
        try {
            const response = await axiosClient.get(`/api/notifications/${user.id}`);
            const newNotifications = response.data.notifications || [];
            const newUnreadCount = response.data.unreadCount || 0;

            // Logic for showing toast popup
            if (newUnreadCount > prevUnreadCountRef.current && newNotifications.length > 0) {
                const newestUnread = newNotifications
                    .filter(n => !n.isRead)
                    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0];
                
                if (newestUnread) {
                    setPopupNotification({
                        _id: newestUnread._id, // Use _id from API response
                        title: newestUnread.title,
                        message: newestUnread.message,
                        type: newestUnread.type,
                        timestamp: newestUnread.createdAt
                    });
                    // Trigger bell animation
                    animateBell();
                    // Play sound if enabled (though it's disabled here)
                    playNotificationSound(); 
                }
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
    }, [user?.id, soundEnabled]);


    const markAsRead = async (notificationId) => {
        try {
            await axiosClient.patch(`/api/notifications/${notificationId}/read`);
            setNotifications(prev => 
                prev.map(notif => 
                    notif._id === notificationId ? { ...notif, isRead: true } : notif
                )
            );
            setUnreadCount(prev => Math.max(0, prev - 1));
            // Close the toast if the user reads the notification there
            if (popupNotification?._id === notificationId) {
                setPopupNotification(null);
            }
        } catch (error) {
            console.error('Error marking notification as read:', error);
        }
    };

    const markAllAsRead = async () => {
        try {
            await axiosClient.put(`/api/notifications/${user.id}/read-all`);
            setNotifications(prev => prev.map(notif => ({ ...notif, isRead: true })));
            setUnreadCount(0);
        } catch (error) {
            console.error('Error marking all notifications as read:', error);
        }
    };

    const deleteNotification = async (notificationId) => {
        try {
            await axiosClient.delete(`/api/notifications/${notificationId}`);
            setNotifications(prev => prev.filter(notif => notif._id !== notificationId));
            setUnreadCount(prev => {
                const deletedNotif = notifications.find(n => n._id === notificationId);
                return deletedNotif && !deletedNotif.isRead ? prev - 1 : prev;
            });
            // Close the toast if the user deletes the notification there
            if (popupNotification?._id === notificationId) {
                setPopupNotification(null);
            }
        } catch (error) {
            console.error('Error deleting notification:', error);
        }
    };

    const clearAllNotifications = async () => {
        // ✅ FIX: Ensure the API path is correct for the DELETE request.
        // The path `/api/notifications/${user.id}/clear-all` is correct,
        // as is the `axiosClient.delete` method.
        if (!user?.id) return;
        try {
            await axiosClient.delete(`/api/notifications/${user.id}/clear-all`);
            setNotifications([]);
            setUnreadCount(0);

        } catch (error) {
            console.error('Error clearing all notifications:', error.response?.data || error.message);
        }
    };

    // --- Utility Functions (Icon Mapping, Time) ---

    const getNotificationIcon = (type) => {
        const typeKey = type.toLowerCase().replace('-', '');
        const config = NOTIFICATION_TYPES[typeKey];
        return config ? config.icon : Bell;
    };

    const getNotificationColor = (type) => {
        const typeKey = type.toLowerCase().replace('-', '');
        const config = NOTIFICATION_TYPES[typeKey];
        // Use a generic text color unless explicitly found
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

    const displayedNotifications = showAll ? notifications : notifications.slice(0, 5);

    // --- Effects ---

    // Initial fetch and polling
    useEffect(() => {
        fetchNotifications();
        const interval = setInterval(fetchNotifications, 10000); 
        return () => clearInterval(interval);
    }, [fetchNotifications]);

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

    // --- Render ---

    return (
        <div className="relative z-50">
            {/* 1. Floating Notification Popup (Toast) */}
            <AnimatePresence>
                {popupNotification && (
                    <UserNotificationPopup
                        notification={popupNotification}
                        onClose={() => setPopupNotification(null)}
                    />
                )}
            </AnimatePresence>

            {/* 2. Notification Bell */}
            <motion.button
                ref={bellRef}
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 text-gray-300 hover:text-white transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                aria-label="Notifications"
            >
                <Bell className="w-6 h-6" />
                {/* Unread count badge */}
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
                                        // Sound control is disabled as requested
                                        className="p-1 text-gray-500 cursor-default"
                                        title="Notification sounds are disabled"
                                        disabled
                                        aria-label="Notification sounds disabled"
                                    >
                                        <VolumeX className="w-4 h-4" />
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
                                        const iconColor = getNotificationColor(notification.type);
                                        
                                        return (
                                            <motion.div
                                                key={notification._id}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                className={`p-4 hover:bg-slate-700/50 transition-colors ${
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
                                                                        <div className="w-2 h-2 bg-cyan-400 rounded-full" title="Unread" />
                                                                    )}
                                                                </div>
                                                            </div>
                                                            
                                                            {/* Actions */}
                                                            <div className="flex items-center gap-1 ml-2 flex-shrink-0">
                                                                {/* Mark as read button */}
                                                                {!notification.isRead && (
                                                                    <button
                                                                        onClick={() => markAsRead(notification._id)}
                                                                        className="p-1 text-gray-400 hover:text-green-400 transition-colors"
                                                                        title="Mark as read"
                                                                        aria-label="Mark as read"
                                                                    >
                                                                        <Check className="w-3 h-3" />
                                                                    </button>
                                                                )}
                                                                {/* Delete button */}
                                                                <button
                                                                    onClick={() => deleteNotification(notification._id)}
                                                                    className="p-1 text-gray-400 hover:text-red-400 transition-colors"
                                                                    title="Delete"
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
