
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Notification = require('../models/notification');
const auth = require('../middleware/middle'); 
const adminAuth = require('../middleware/adminmiddle'); 


router.post('/send', auth, adminAuth, async (req, res) => {
    try {
        const { title, message, type, targetUserId, targetRole } = req.body;

        if (!title || !message) {
            return res.status(400).json({ msg: 'Title and message are required.' });
        }
        
        const adminId = req.user.id;
        const adminName = req.user.firstname || req.user.username || 'Admin';

        const newNotification = new Notification({
            title,
            message,
            type: type || 'admin',
            targetUserId: targetUserId && mongoose.Types.ObjectId.isValid(targetUserId) ? targetUserId : null,
            targetRole: targetRole || null,
            fromAdmin: true,
            adminName: adminName,
            isRead: false,
        });

        await newNotification.save();
        res.status(201).json({ msg: 'Notification sent successfully.', notification: newNotification });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


router.delete('/:userId/clear-all', auth, async (req, res) => {
    try {
        const { userId } = req.params;

        if (req.user.id !== userId) {
            return res.status(403).json({ msg: 'Unauthorized to clear notifications for this user.' });
        }

       
        const deleteResult = await Notification.deleteMany({ targetUserId: userId });

        
        const updateResult = await Notification.updateMany(
            { 
                $or: [{ targetRole: 'all' }, { targetRole: req.user.role }] 
            },
            { $addToSet: { deletedBy: userId } }
        );

        const totalCleared = deleteResult.deletedCount + updateResult.modifiedCount;

        res.json({ 
            msg: `${totalCleared} notifications cleared from your view.`, 
            deletedCount: totalCleared 
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


router.put('/:userId/read-all', auth, async (req, res) => {
    try {
        const { userId } = req.params;

        if (req.user.id !== userId) {
            return res.status(403).json({ msg: 'Unauthorized to mark all notifications for this user.' });
        }

        const result = await Notification.updateMany(
            {
               
                $or: [
                    { targetUserId: userId, isRead: false },
                    { targetRole: req.user.role, isRead: false },
                    { targetRole: 'all', isRead: false },
                ],
                
                deletedBy: { $ne: userId } 
            },
            { $set: { isRead: true } }
        );

        res.json({ msg: `${result.modifiedCount} notifications marked as read.`, modifiedCount: result.modifiedCount });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


router.get('/:userId', auth, async (req, res) => {
    try {
        const { userId } = req.params;
        
        if (req.user.id !== userId) {
            return res.status(403).json({ msg: 'Unauthorized to view this user\'s notifications.' });
        }

      
        const notifications = await Notification.find({
            $or: [
                { targetUserId: userId },
                { targetRole: req.user.role },
                { targetRole: 'all' },
            ],
            
            deletedBy: { $ne: userId } 
        }).sort({ createdAt: -1 });

        const unreadCount = notifications.filter(n => !n.isRead).length;

        res.json({ notifications, unreadCount });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


router.patch('/:notificationId/read', auth, async (req, res) => {
    try {
        const { notificationId } = req.params;
        const notification = await Notification.findById(notificationId);

        if (!notification) {
            return res.status(404).json({ msg: 'Notification not found.' });
        }
       
        const isTargetedUser = notification.targetUserId && notification.targetUserId.toString() === req.user.id;
        const isGeneralNotification = notification.targetRole !== null;
        
        if (!isTargetedUser && !isGeneralNotification) {
             return res.status(403).json({ msg: 'Unauthorized to mark this notification as read.' });
        }
        
        notification.isRead = true;
        await notification.save();
        res.json({ msg: 'Notification marked as read.' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


router.delete('/:notificationId', auth, async (req, res) => {
    try {
        const notification = await Notification.findById(req.params.notificationId);
        const userId = req.user.id; 

        if (!notification) {
            return res.status(404).json({ msg: 'Notification not found.' });
        }

        const isTargetedUser = notification.targetUserId && notification.targetUserId.toString() === userId;
        const isGeneralNotification = notification.targetRole !== null;

        if (isTargetedUser) {
          
            await Notification.findByIdAndDelete(req.params.notificationId);
            return res.json({ msg: 'Notification permanently deleted.', action: 'deleted' });

        } else if (isGeneralNotification) {
           
            await Notification.findByIdAndUpdate(
                req.params.notificationId,
                { $addToSet: { deletedBy: userId } }, 
                { new: true }
            );

            return res.json({ msg: 'Notification dismissed permanently from your view.', action: 'dismissed' });

        } else {
           
             return res.status(403).json({ msg: 'Unauthorized to delete this notification.' });
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


module.exports = router;