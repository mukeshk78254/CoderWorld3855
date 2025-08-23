// const user = require("../models/users"); // Your Mongoose User model

// // Get user profile
// const getProfile = async (req, res) => {
//     try {
//         const userId = req.ans1.id; 
//         const foundUser = await user.findById(userId).select('-password -__v -createdAt -updatedAt'); 
//         if (!foundUser) {
//             return res.status(404).json({ message: "User not found." });
//         }
//         res.status(200).json(foundUser);
//     } catch (err) {
//         console.error("Error fetching profile:", err);
//         res.status(500).json({ message: "Internal server error." });
//     }
// };

// // Update a specific field in the user's profile (basic info, experience, skills)
// const updateProfileField = async (req, res) => {
//     try {
//         const userId = req.ans1.id; // From middleware
//         const { field, value } = req.body; // `field` can be 'firstname', 'profile.location', 'profile.skills', etc.

//         if (!field) {
//             return res.status(400).json({ message: "Field to update is required." });
//         }

//         const foundUser = await user.findById(userId);
//         if (!foundUser) {
//             return res.status(404).json({ message: "User not found." });
//         }

//         foundUser.set(field, value);

//         await foundUser.save();

//         const updatedUser = await user.findById(userId).select('-password -__v -createdAt -updatedAt');
//         res.status(200).json({ message: `${field} updated successfully.`, user: updatedUser });
//     } catch (err) {
//         console.error("Error updating profile field:", err);
//         res.status(500).json({ message: "Internal server error." });
//     }
// };

// // Update privacy settings
// const updatePrivacySettings = async (req, res) => {
//     try {
//         const userId = req.ans1.id;
//         const { field, value } = req.body; // e.g., field: 'contactByCompanies', value: true/false

//         if (!field) {
//             return res.status(400).json({ message: "Privacy setting field is required." });
//         }

//         const foundUser = await user.findById(userId);
//         if (!foundUser) {
//             return res.status(404).json({ message: "User not found." });
//         }

//         foundUser.set(`settings.privacy.${field}`, value);
//         await foundUser.save();

//         const updatedUser = await user.findById(userId).select('-password -__v -createdAt -updatedAt');
//         res.status(200).json({ message: "Privacy settings updated successfully.", user: updatedUser });
//     } catch (err) {
//         console.error("Error updating privacy settings:", err);
//         res.status(500).json({ message: "Internal server error." });
//     }
// };

// // Update notification settings
// const updateNotificationSettings = async (req, res) => {
//     try {
//         const userId = req.ans1.id;
//         const { setting, type, value } = req.body; // e.g., setting: 'importantAnnouncements', type: 'email', value: true/false

//         if (!setting || !type) {
//             return res.status(400).json({ message: "Notification setting and type are required." });
//         }

//         const foundUser = await user.findById(userId);
//         if (!foundUser) {
//             return res.status(404).json({ message: "User not found." });
//         }

//         foundUser.set(`settings.notifications.${setting}.${type}`, value);
//         await foundUser.save();

//         const updatedUser = await user.findById(userId).select('-password -__v -createdAt -updatedAt');
//         res.status(200).json({ message: "Notification settings updated successfully.", user: updatedUser });
//     } catch (err) {
//         console.error("Error updating notification settings:", err);
//         res.status(500).json({ message: "Internal server error." });
//     }
// };


// module.exports = {
//     getProfile,
//     updateProfileField,
//     updatePrivacySettings,
//     updateNotificationSettings
// };


// controllers/profileController.js
const user = require("../models/users"); // Your Mongoose User model

// --- Security: Whitelist of allowed fields for profile updates ---
const ALLOWED_PROFILE_FIELDS = [
    'firstname', // Direct field on the User model
    'profile.location',
    'profile.birthday',
    'profile.gender',
    'profile.summary',
    'profile.website',
    'profile.github',
    'profile.linkedin',
    'profile.twitter',
    'profile.work', // Assuming these are single string fields or specific structures
    'profile.education',
    'profile.skills' // Assuming this is a single string field for a comma-separated list or similar
];

// --- Default settings structure for new users or missing settings ---
// These defaults will be sent to the frontend if the user document doesn't have them.
// Ensure these match the frontend's expected initial state.
const DEFAULT_NOTIFICATION_SETTINGS = {
    importantAnnouncements: { email: true, site: false },
    featureAnnouncements: { email: true, site: false },
    awardNotification: { email: true, site: true },
    globalRanking: { email: false, site: true },
    contestBadge: { email: false, site: true },
    contestAnnouncements: { email: true, site: true },
    newComment: { email: false, site: true },
    otherNotifications: { email: true, site: false },
    promotions: { email: true, site: false },
    weeklyRecommendations: { email: true, site: false },
};

const DEFAULT_PRIVACY_SETTINGS = {
    contactByCompanies: true,
    joinStudyPlanLeaderboard: true,
    displaySubmissionHistory: true,
};


/**
 * @desc Get authenticated user's profile data
 * @route GET /api/profile
 * @access Private
 */
const getProfile = async (req, res) => {
    try {
        const userId = req.ans1.id; // User ID from authentication middleware
        // Fetch user, excluding sensitive fields like password and internal Mongoose fields
        const foundUser = await user.findById(userId).select('-password -__v -createdAt -updatedAt'); 

        if (!foundUser) {
            return res.status(404).json({ message: "User not found." });
        }

        // Convert Mongoose document to a plain JavaScript object
        const userResponseData = foundUser.toObject();

        // Ensure nested objects like 'profile' and 'settings' exist
        // and apply default values for settings if they are not present in the DB
        userResponseData.profile = userResponseData.profile || {};
        userResponseData.settings = userResponseData.settings || {};
        userResponseData.settings.notifications = userResponseData.settings.notifications || DEFAULT_NOTIFICATION_SETTINGS;
        userResponseData.settings.privacy = userResponseData.settings.privacy || DEFAULT_PRIVACY_SETTINGS;

        res.status(200).json(userResponseData);
    } catch (err) {
        console.error("Error fetching profile:", err);
        res.status(500).json({ message: "Internal server error." });
    }
};

/**
 * @desc Update a specific field in the user's profile
 * @route PUT /api/profile/field
 * @access Private
 */
const updateProfileField = async (req, res) => {
    try {
        const userId = req.ans1.id;
        const { field, value } = req.body;

        if (!field) {
            return res.status(400).json({ message: "Field to update is required." });
        }

        // CRITICAL SECURITY: Whitelist check
        if (!ALLOWED_PROFILE_FIELDS.includes(field)) {
            return res.status(403).json({ message: "Updating this field is not allowed. Invalid field: " + field });
        }

        const foundUser = await user.findById(userId);
        if (!foundUser) {
            return res.status(404).json({ message: "User not found." });
        }

        let processedValue = value;
        // Handle specific type conversions for incoming data if necessary
        if (field === 'profile.birthday' && value) {
            processedValue = new Date(value);
            if (isNaN(processedValue.getTime())) { // Check if the date is invalid
                return res.status(400).json({ message: "Invalid date format for birthday." });
            }
        }
        // Add more specific handling for other fields if needed (e.g., array fields like skills)

        // Mongoose's .set() method can update nested fields using dot notation (e.g., 'profile.location')
        foundUser.set(field, processedValue);

        // Save the document and run schema validators (important for enums, types, etc.)
        await foundUser.save({ runValidators: true });

        // Fetch the updated user data to send back, excluding sensitive fields
        const updatedUser = await user.findById(userId).select('-password -__v -createdAt -updatedAt');
        res.status(200).json({ 
            message: `${field.split('.').pop()} updated successfully.`, 
            user: updatedUser // Send back the updated user object
        });
    } catch (err) {
        console.error("Error updating profile field:", err);
        // Provide more specific error messages from Mongoose validation if possible
        if (err.name === 'ValidationError') {
            return res.status(400).json({ message: err.message });
        }
        res.status(500).json({ message: "Internal server error during profile update: " + err.message });
    }
};

/**
 * @desc Update user's privacy settings
 * @route PUT /api/profile/settings/privacy
 * @access Private
 */
const updatePrivacySettings = async (req, res) => {
    try {
        const userId = req.ans1.id;
        const { field, value } =                                                                                                                                                                                                                                                                                                                             req.body; // `value` must be a boolean

        if (!field || typeof value !== 'boolean') {
            return res.status(400).json({ message: "Privacy setting field and a boolean value are required." });
        }

        // Whitelist for privacy settings fields
        const ALLOWED_PRIVACY_FIELDS = Object.keys(DEFAULT_PRIVACY_SETTINGS);
        if (!ALLOWED_PRIVACY_FIELDS.includes(field)) {
            return res.status(403).json({ message: "Updating this privacy setting is not allowed." });
        }

        const foundUser = await user.findById(userId);
        if (!foundUser) {
            return res.status(404).json({ message: "User not found." });
        }

        foundUser.set(`settings.privacy.${field}`, value);
        await foundUser.save({ runValidators: true });

        const updatedUser = await user.findById(userId).select('-password -__v -createdAt -updatedAt');
        res.status(200).json({ message: "Privacy settings updated successfully.", user: updatedUser });
    } catch (err) {
        console.error("Error updating privacy settings:", err);
        if (err.name === 'ValidationError') {
            return res.status(400).json({ message: err.message });
        }
        res.status(500).json({ message: "Internal server error: " + err.message });
    }
};

/**
 * @desc Update user's notification settings
 * @route PUT /api/profile/settings/notifications
 * @access Private
 */
const updateNotificationSettings = async (req, res) => {
    try {
        const userId = req.ans1.id;
        const { setting, type, value } = req.body; // `value` must be a boolean

        if (!setting || !type || typeof value !== 'boolean') {
            return res.status(400).json({ message: "Notification setting, type, and a boolean value are required." });
        }

        // Whitelist for notification settings and their types
        const ALLOWED_NOTIFICATION_SETTINGS = Object.keys(DEFAULT_NOTIFICATION_SETTINGS);
        const ALLOWED_NOTIFICATION_TYPES = ['email', 'site'];

        if (!ALLOWED_NOTIFICATION_SETTINGS.includes(setting) || !ALLOWED_NOTIFICATION_TYPES.includes(type)) {
            return res.status(403).json({ message: "Updating this notification setting or type is not allowed." });
        }

        const foundUser = await user.findById(userId);
        if (!foundUser) {
            return res.status(404).json({ message: "User not found." });
        }

        foundUser.set(`settings.notifications.${setting}.${type}`, value);
        await foundUser.save({ runValidators: true });

        const updatedUser = await user.findById(userId).select('-password -__v -createdAt -updatedAt');
        res.status(200).json({ message: "Notification settings updated successfully.", user: updatedUser });
    } catch (err) {
        console.error("Error updating notification settings:", err);
        if (err.name === 'ValidationError') {
            return res.status(400).json({ message: err.message });
        }
        res.status(500).json({ message: "Internal server error: " + err.message });
    }
};

module.exports = {
    getProfile,
    updateProfileField,
    updatePrivacySettings,
    updateNotificationSettings
};