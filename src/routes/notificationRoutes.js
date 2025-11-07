// routes/notificationRoutes.js (Express Backend) - FULL FIX

const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Notification = require('../models/notification');
const User = require('../models/users'); // Assuming you have a User model
const auth = require('../middleware/middle');
const adminAuth = require('../middleware/adminmiddle');

// --- 1. ADMIN API: Send Notification (CRITICAL ROUTE) ---
// POST /api/notifications/send
router.post('/send', auth, adminAuth, async (req, res) => {
    try {
        const { title, message, type, targetUserId, targetRole } = req.body;

        if (!title || !message) {
            return res.status(400).json({ msg: 'Title and message are required.' });
        }
        
        const adminName = req.user.firstname || req.user.username || 'Admin';

        const newNotification = new Notification({
            title,
            message,
            type: type || 'admin',
            targetUserId: targetUserId && mongoose.Types.ObjectId.isValid(targetUserId) ? targetUserId : null,
            targetRole: targetRole || 'all',
            fromAdmin: true,
            adminName: adminName,
            readBy: [],
            deletedBy: [], 
        });

        await newNotification.save();
        
        res.status(201).json({ msg: 'Notification sent successfully.', notification: newNotification });
    } catch (err) {
        console.error('Error sending notification:', err.message);
        res.status(500).send('Server Error');
    }
});

// --- 2. ADMIN API: Get Statistics (NEW CRUCIAL ROUTE) ---
// GET /api/notifications/admin/stats
router.get('/admin/stats', auth, adminAuth, async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // 1. Total Sent / Total Sent Today
        const totalSent = await Notification.countDocuments();
        const todaySent = await Notification.countDocuments({ 
            createdAt: { $gte: today } 
        });

        // 2. Calculate Total Read Count (Requires aggregation)
        // This is complex and usually requires a separate stats table for true scale,
        // but we can estimate: the number of general notifications * an assumed user base size
        // OR, simply count the max size of the 'readBy' array across all general notifications.
        // For simplicity and performance, we'll calculate the total number of unique reads logged.
        
        const totalUniqueReads = await Notification.aggregate([
            { $unwind: "$readBy" },
            { $group: { _id: null, count: { $sum: 1 } } }
        ]);
        
        // Count of all active users, excluding admin roles (for UNREAD calculation base)
        const totalUsers = await User.countDocuments({ role: { $ne: 'admin' } });

        res.json({
            stats: {
                totalSent: totalSent,
                todaySent: todaySent,
                totalReadsLogged: totalUniqueReads[0]?.count || 0, // Total interactions logged
                // Placeholder for true Total Read count due to high complexity in MongoDB
                totalRead: 'N/A (See Logged Reads)', 
                totalUnread: 'N/A (Too complex)',
            }
        });
    } catch (err) {
        console.error('❌ Error fetching admin stats:', err.message);
        res.status(500).send('Server Error');
    }
});

// --- 2. USER API: Get Notifications (FIXED QUERY) ---
// GET /api/notifications/:userId
router.get('/:userId', auth, async (req, res) => {
    try {
        const { userId } = req.params;
        if (req.user.id !== userId) return res.status(403).json({ msg: 'Unauthorized.' });

        const userRole = req.user.role || 'member';
        const userObjectId = new mongoose.Types.ObjectId(userId);

        const notifications = await Notification.find({
            $or: [
                { targetUserId: userObjectId },           // Targeted to this specific user ID
                { targetRole: userRole },                 // Targeted to this user's role
                { targetRole: 'all' },                    // Targeted to all users
                { targetRole: null, targetUserId: null }, // General untargeted
            ],
            // Exclude if user has manually deleted/dismissed it
            deletedBy: { $ne: userObjectId }
        }).sort({ createdAt: -1 });

        // Calculate unread count on the fetched set using the 'readBy' array
        const unreadCount = notifications.filter(n => !n.readBy.includes(userObjectId)).length;

        res.json({ 
            notifications: notifications.map(n => ({
                ...n.toObject(),
                isRead: n.readBy.includes(userObjectId) // Map read status specifically for this user
            })), 
            unreadCount 
        });
    } catch (err) {
        console.error('❌ Error fetching user notifications:', err.message);
        res.status(500).send('Server Error');
    }
});

// --- 3. USER API: Mark Single as Read (FIXED LOGIC) ---
// PATCH /api/notifications/:notificationId/read
router.patch('/:notificationId/read', auth, async (req, res) => {
    try {
        const notificationId = req.params.notificationId;
        const userObjectId = new mongoose.Types.ObjectId(req.user.id);
        
        // Add user's ID to the readBy array (ensures individual read status is tracked)
        const updatedNotification = await Notification.findByIdAndUpdate(
            notificationId,
            { $addToSet: { readBy: userObjectId } },
            { new: true }
        );

        if (!updatedNotification) return res.status(404).json({ msg: 'Notification not found.' });

        res.json({ msg: 'Notification marked as read.' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// --- 4. USER API: Delete Single Notification (FIXED LOGIC) ---
// DELETE /api/notifications/:notificationId
router.delete('/:notificationId', auth, async (req, res) => {
    try {
        const notification = await Notification.findById(req.params.notificationId);
        const userObjectId = new mongoose.Types.ObjectId(req.user.id);

        if (!notification) return res.status(404).json({ msg: 'Notification not found.' });

        const isTargetedUser = notification.targetUserId && notification.targetUserId.equals(userObjectId);
        
        if (isTargetedUser) {
            // Delete personal notification permanently
            await Notification.findByIdAndDelete(req.params.notificationId);
            return res.json({ msg: 'Targeted notification deleted.', action: 'deleted' });

        } else {
            // Dismiss general/role notification for this user by adding to 'deletedBy'
            await Notification.findByIdAndUpdate(
                req.params.notificationId,
                { $addToSet: { deletedBy: userObjectId } },
                { new: true }
            );
            return res.json({ msg: 'General notification dismissed from view.', action: 'dismissed' });
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


// --- 5. ADMIN API: Global Permanent Delete (FIX: Deletes from All Users) ---
// DELETE /api/notifications/admin/:notificationId
router.delete('/admin/:notificationId', auth, adminAuth, async (req, res) => {
    try {
        // PERMANENTLY deletes the master document, making it disappear for all users immediately
        const result = await Notification.findByIdAndDelete(req.params.notificationId);
        
        if (!result) return res.status(404).json({ msg: 'Notification not found.' });

        res.json({ 
            msg: 'Notification permanently deleted by admin. No user can see this anymore.', 
            action: 'admin-deleted' 
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


// --- 6. ADMIN API: Get All General Notifications (For Admin Panel list) ---
// GET /api/notifications/admin/all
router.get('/admin/all', auth, adminAuth, async (req, res) => {
    try {
        const notifications = await Notification.find({
            $or: [
                { targetRole: 'all' },
                { targetRole: { $ne: null } }
            ]
        }).sort({ createdAt: -1 });
        
        res.json({ notifications });
    } catch (err) {
        console.error('❌ Error fetching all admin notifications:', err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;