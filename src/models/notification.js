// models/notification.js

const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
    title: { type: String, required: true },
    message: { type: String, required: true },
    type: { type: String, default: 'info' }, // e.g., 'info', 'admin', 'system'
    priority: { type: String, default: 'normal' }, // e.g., 'low', 'normal', 'high', 'urgent'
    
    // Targeting Fields
    targetUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null }, // For one user
    targetRole: { type: String, default: 'all' }, // 'all', 'member', 'premium', 'admin'

    // Status Tracking for ALL recipients (Crucial Fix for Statistics)
    // Tracks all user IDs who have READ this notification
    readBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', default: [] }],
    // Tracks all user IDs who have DISMISSED/DELETED this notification
    deletedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', default: [] }],

    // Admin/Source Info
    fromAdmin: { type: Boolean, default: true },
    adminName: { type: String, default: 'Admin' },
    
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Notification', NotificationSchema);