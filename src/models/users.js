// const mongoose = require('mongoose');

// const {Schema}=mongoose;


// const userschema=new Schema({
//     firstname:{
//         type:String,
//         required:true,
//         minlength:3,
//         maxlength:20
  
//       },
//       lastname:{
//         type:String,
//         minlength:3,
//         maxlength:20
//       },
     
//       emailId:{
//         type:String,
//         required:true,
//         unique:true,
//         trim:true,
//         immutable:true,
//         lowercase:true
  
//       },

//       age:{
//         type:Number,
//         min: 6,
//         max:90
//       },

//       role:
//      { type:String,
//       enum:['user','admin'],
//       default:'user'
//     },
// // problem solved me problem id ko store krna chahiye, submission id ko nhi krengeb kyunki aisa ho skta hai ki ek problem ko ek se jyada bar solvr kr de to alg alag aayega ,to sare sub. id ko nhi dalna so problem id bco same problem id ke kitne bhi sol ho but problem id always same rhega 
//       problemsolved:{
//         type :[{     // jitna bhi problem solve kr diye uska no store kr do kitna no solve kiya jaise 220/3465   unique problem jo solve kiye hia usko dalenge iske nadr ye nhi ki ek hi problem ko bar bar bdalengeb
//            type:Schema.Types.ObjectId,
//            ref:'problem'
        
//         }],
//         unique:true
//       },
//       password:{
//         type:String,
//         required:true,
        
//       },
//         profile: {
//         location: { type: String, default: '' },
//         birthday: { type: Date, default: null },
//         gender: { type: String, enum: ['Male', 'Female', 'Other', ''], default: '' },
//         summary: { type: String, default: '' },
//         website: { type: String, default: '' },
//         github: { type: String, default: '' },
//         linkedin: { type: String, default: '' },
//         twitter: { type: String, default: '' }, // Formerly 'X'
//         work: { type: String, default: '' },
//         education: { type: String, default: '' },
//         skills: { type: String, default: '' }, // Simple comma-separated string
//     },
//     settings: {
//         notifications: {
//             importantAnnouncements: { type: Boolean, default: true },
//             featureAnnouncements: { type: Boolean, default: true },
//             awardNotification: { type: Boolean, default: true },
//             contestRanking: { type: Boolean, default: true },
//             contestBadge: { type: Boolean, default: true },
//             contestAnnouncements: { type: Boolean, default: true },
//             newComment: { type: Boolean, default: true },
//             otherNotifications: { type: Boolean, default: true },
//             promotions: { type: Boolean, default: true },
//             weeklyRecommendations: { type: Boolean, default: true },
//         },
//         privacy: {
//             contactByCompanies: { type: Boolean, default: true },
//             joinStudyPlanLeaderboard: { type: Boolean, default: true },
//             displaySubmissionHistory: { type: Boolean, default: true },
//         }
//     },
//      settings: {
//         notifications: {
//             // Each key now has a nested object for 'email' and 'site'
//             importantAnnouncements: { email: { type: Boolean, default: true }, site: { type: Boolean, default: false } },
//             featureAnnouncements: { email: { type: Boolean, default: true }, site: { type: Boolean, default: false } },
//             awardNotification: { email: { type: Boolean, default: true }, site: { type: Boolean, default: true } },
//             globalRanking: { email: { type: Boolean, default: false }, site: { type: Boolean, default: true } },
//             contestBadge: { email: { type: Boolean, default: false }, site: { type: Boolean, default: true } },
//             contestAnnouncements: { email: { type: Boolean, default: true }, site: { type: Boolean, default:true } },
//             newComment: { email: { type: Boolean, default: false }, site: { type: Boolean, default: true } },
//             otherNotifications: { email: { type: Boolean, default: true }, site: { type: Boolean, default: false } },
//             promotions: { email: { type: Boolean, default: true }, site: { type: Boolean, default: false } },
//             weeklyRecommendations: { email: { type: Boolean, default: true }, site: { type: Boolean, default: false } },
//         },
//         googleId: { type: String, unique: true, sparse: true },
//     facebookId: { type: String, unique: true, sparse: true },
//         privacy: {
//             // ... (privacy settings as before)
//         }
//     }
  
      
//     },{timestamps:true})


//     // jaise hi profile delete hoga tb ye post executr=e hoga yha post mtlb bad me delete ke bad findoneanddelete mtlb jaise hi profile delete mare to ye code execute ho jayeg aaur sare submission ko delete mar dega us particular id ka
//     userschema.post('findOneAndDelete', async function (userInfo) {
//         if (userInfo) {
//           await mongoose.model('submission').deleteMany({ userId: userInfo.id });
//         }
//       });

// const user=mongoose.model("user",userschema)
//     module.exports=user; 

const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
    // --- FIX: This is the primary field for the user's name ---
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
    // --- FIX: Corrected field name from 'problemsolved' to 'problemsSolved' (camelCase) ---
   problemsolved:{
        type :[{     // jitna bhi problem solve kr diye uska no store kr do kitna no solve kiya jaise 220/3465   unique problem jo solve kiye hia usko dalenge iske nadr ye nhi ki ek hi problem ko bar bar bdalengeb
           type:Schema.Types.ObjectId,
           ref:'problem'
        
        }],
        unique:true
      },
    password: {
        type: String,
        // Password is not required for users who sign up with OAuth (Google/Facebook)
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
    // --- FIX: Removed duplicate 'settings' object and corrected its structure ---
    settings: {
        notifications: {
            importantAnnouncements: { email: { type: Boolean, default: true }, site: { type: Boolean, default: false } },
            featureAnnouncements: { email: { type: Boolean, default: true }, site: { type: Boolean, default: false } },
            awardNotification: { email: { type: Boolean, default: true }, site: { type: Boolean, default: true } },
            globalRanking: { email: { type: Boolean, default: false }, site: { type: Boolean, default: true } },
            contestBadge: { email: { type: Boolean, default: false }, site: { type: Boolean, default: true } },
            contestAnnouncements: { email: { type: Boolean, default: true }, site: { type: Boolean, default: true } },
            newComment: { email: { type: Boolean, default: false }, site: { type: Boolean, default: true } },
            otherNotifications: { email: { type: Boolean, default: true }, site: { type: Boolean, default: false } },
            promotions: { email: { type: Boolean, default: true }, site: { type: Boolean, default: false } },
            weeklyRecommendations: { email: { type: Boolean, default: true }, site: { type: Boolean, default: false } },
        },
        privacy: {
            contactByCompanies: { type: Boolean, default: true },
            joinStudyPlanLeaderboard: { type: Boolean, default: true },
            displaySubmissionHistory: { type: Boolean, default: true },
        }
    },
    // OAuth-specific fields
    googleId: { type: String, unique: true, sparse: true },
    facebookId: { type: String, unique:true, sparse: true },
    isProfileComplete: { type: Boolean, default: false }
}, { timestamps: true });

// Post-delete hook to clean up user's submissions
userSchema.post('findOneAndDelete', async function (userInfo) {
    if (userInfo) {
        await mongoose.model('submission').deleteMany({ userId: userInfo.id });
    }
});

const user = mongoose.model("user", userSchema);
module.exports = user;