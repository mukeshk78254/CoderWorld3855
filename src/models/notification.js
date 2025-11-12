// models/notification.js

const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
    title: { type: String, required: true },
    message: { type: String, required: true },
    type: { type: String, default: 'info' }, 
    priority: { type: String, default: 'normal' },
    
   
    targetUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null }, 
    targetRole: { type: String, default: 'all' }, 

    
    readBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', default: [] }],
    
    deletedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', default: [] }],


    fromAdmin: { type: Boolean, default: true },
    adminName: { type: String, default: 'Admin' },
    
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Notification', NotificationSchema);