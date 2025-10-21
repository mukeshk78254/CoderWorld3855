
const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
   
    firstname: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 20,
        trim: true,
    },
    emailId: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        immutable: true,
        lowercase: true
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    
    problemsSolved: {
        type: [{
           type: Schema.Types.ObjectId,
           ref: 'problem'
        }],
        default: []
    },
    password: {
        type: String,
        
        required: false,
    },
    profile: {
        location: { type: String, default: '' },
        birthday: { type: Date, default: null },
        gender: { type: String, enum: ['Male', 'Female', 'Other', ''], default: '' },
        summary: { type: String, default: '' },
        website: { type: String, default: '' },
        github: { type: String, default: '' },
        linkedin: { type: String, default: '' },
        twitter: { type: String, default: '' },
        work: { type: String, default: '' },
        education: { type: String, default: '' },
        skills: { type: String, default: '' },
    },
    
    settings: {
        notifications: {
            importantAnnouncements: 
            { email: { type: Boolean,
                 default: true }, 
            site: { type: Boolean, 
                default: false } },
            featureAnnouncements: 
            { email: { type: Boolean, 
                default: true },
             site: { type: Boolean,
                 default: false } },
            awardNotification: 
            { email: { type: Boolean, 
                default: true },
             site: { type: Boolean, 
                default: true } },
            globalRanking:
             { email: { type: Boolean,
                 default: false },
             site: { type: Boolean,
                 default: true } },
            contestBadge: 
            { email: { type: Boolean, 
                default: false }, 
            site: { type: Boolean, 
                default: true } },
            contestAnnouncements:
             { email: { type: Boolean,
                 default: true },
             site: { type: Boolean, 
                default: true } },
            newComment: { email: { type: Boolean,
                 default: false }, 
            site: { type: Boolean, 
                default: true } },
            otherNotifications:
             { email: { type: Boolean, 
                default: true },
             site: { type: Boolean, 
                default: false } },
            promotions: 
            { email: { type: Boolean,
                 default: true }, 
            site: { type: Boolean,
                 default: false } },
            weeklyRecommendations:
             { email: { type: Boolean,
                 default: true },
             site: { type: Boolean, 
                default: false } },
        },
        privacy: {
            contactByCompanies: 
            { type: Boolean, 
                default: true },
            joinStudyPlanLeaderboard:
             { type: Boolean, 
                default: true },
            displaySubmissionHistory: 
            { type: Boolean, 
                default: true },
        }
    },
    
    googleId: 
    { type: String,
         unique: true,
          sparse: true },
    facebookId: 

    { type: String,
         unique:true,
          sparse: true },
    isProfileComplete:

     { type: Boolean,
         default: false },
    
    
    isPremium:
     { type: Boolean,
        default: false },
    subscriptionType: { type: String,
         enum: ['monthly', 'yearly', ''],
          default: '' },
    subscriptionStartDate: { type: Date,
         default: null },
    subscriptionEndDate: { type: Date,
         default: null },
    paymentId: { type: String, 
        default: '' },
    orderId: { type: String, 
        default: '' }
}, { timestamps: true });



userSchema.post('findOneAndDelete', async function (userInfo) {
    if (userInfo) {
        await mongoose.model('submission').deleteMany({ userId: userInfo.id });
    }
});

const user = mongoose.model("user", userSchema);
module.exports = user;