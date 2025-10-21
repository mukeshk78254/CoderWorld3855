
const user = require("../models/users"); 


const ALLOWED_PROFILE_FIELDS = [
    'firstname', 
    'profile.location',
    'profile.birthday',
    'profile.gender',
    'profile.summary',
    'profile.website',
    'profile.github',
    'profile.linkedin',
    'profile.twitter',
    'profile.work',
    'profile.education',
    'profile.skills' 
];


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
        const userId = req.ans1.id; 
        const foundUser = await user.findById(userId).select('-password -__v -createdAt -updatedAt'); 

        if (!foundUser) {
            return res.status(404).json({ message: "User not found." });
        }

     
        const userResponseData = foundUser.toObject();

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

     
        if (!ALLOWED_PROFILE_FIELDS.includes(field)) {
            return res.status(403).json({ message: "Updating this field is not allowed. Invalid field: " + field });
        }

        const foundUser = await user.findById(userId);
        if (!foundUser) {
            return res.status(404).json({ message: "User not found." });
        }

        let processedValue = value;
   
        if (field === 'profile.birthday' && value) {
            processedValue = new Date(value);
            if (isNaN(processedValue.getTime())) {
                return res.status(400).json({ message: "Invalid date format for birthday." });
            }
        }
        
        foundUser.set(field, processedValue);

     
        await foundUser.save({ runValidators: true });

        
        const updatedUser = await user.findById(userId).select('-password -__v -createdAt -updatedAt');
        res.status(200).json({ 
            message: `${field.split('.').pop()} updated successfully.`, 
            user: updatedUser 
        });
    } catch (err) {
        console.error("Error updating profile field:", err);
        
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
        const { setting, type, value } = req.body; 

        if (!setting || !type || typeof value !== 'boolean') {
            return res.status(400).json({ message: "Notification setting, type, and a boolean value are required." });
        }


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