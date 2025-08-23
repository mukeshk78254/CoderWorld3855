// // const express = require('express');
// // const profileRouter = express.Router();
// // const usermiddleware = require("../middleware/middle");

// // const {
// //     getProfile,
// //     updateProfileField,
// //     updatePrivacySettings,
// //     updateNotificationSettings
// // } = require("../controllers/profileController");

// // profileRouter.get('/profile', usermiddleware, getProfile);
// // profileRouter.put('/profile/field', usermiddleware, updateProfileField);
// // profileRouter.put('/profile/settings/privacy', usermiddleware, updatePrivacySettings);
// // profileRouter.put('/profile/settings/notifications', usermiddleware, updateNotificationSettings);

// // module.exports = profileRouter;
// // routes/profileRouter.js
// const express = require('express');
// const profileRouter = express.Router();
// const usermiddleware = require("../middleware/middle"); // Your authentication middleware

// const {
//     getProfile,
//     updateProfileField,
//     updatePrivacySettings,
//     updateNotificationSettings
// } = require("../controllers/profileController");

// // All profile routes require authentication via usermiddleware
// profileRouter.get('/profile', usermiddleware, getProfile);
// profileRouter.put('/profile/field', usermiddleware, updateProfileField);
// profileRouter.put('/profile/settings/privacy', usermiddleware, updatePrivacySettings);
// profileRouter.put('/profile/settings/notifications', usermiddleware, updateNotificationSettings);

// module.exports = profileRouter;

const express = require('express');
const profileRouter = express.Router();
const usermiddleware = require("../middleware/middle"); // Your authentication middleware

const {
    getProfile,
    updateProfileField,
    updatePrivacySettings,
    updateNotificationSettings
} = require("../controllers/profileController");

// All profile routes require authentication via usermiddleware

// Change this line:
// profileRouter.get('/profile', usermiddleware, getProfile);
// TO THIS:
profileRouter.get('/', usermiddleware, getProfile); // <--- IMPORTANT CHANGE HERE

profileRouter.put('/field', usermiddleware, updateProfileField); // This will be /profile/field
profileRouter.put('/settings/privacy', usermiddleware, updatePrivacySettings); // This will be /profile/settings/privacy
profileRouter.put('/settings/notifications', usermiddleware, updateNotificationSettings); // This will be /profile/settings/notifications

module.exports = profileRouter;