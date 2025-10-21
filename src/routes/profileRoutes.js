
const express = require('express');
const profileRouter = express.Router();
const usermiddleware = require("../middleware/middle"); // Your authentication middleware

const {
    getProfile,
    updateProfileField,
    updatePrivacySettings,
    updateNotificationSettings
} = require("../controllers/profileController");


profileRouter.get('/', usermiddleware, getProfile); 

profileRouter.put('/field', usermiddleware, updateProfileField); 
profileRouter.put('/settings/privacy', usermiddleware, updatePrivacySettings); 
profileRouter.put('/settings/notifications', usermiddleware, updateNotificationSettings); 

module.exports = profileRouter;