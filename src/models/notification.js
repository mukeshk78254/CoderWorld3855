
const mongoose = require("mongoose");
const { Schema } = mongoose;

const notificationSchema = new Schema({
    title: { type: String, required: true },
    message: { type: String, required: true },
    type: { type: String, default: 'info' },
    link: { type: String }, 
    targetUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'user', default: null },
    targetRole: { type: String, default: 'all' },
    isRead: { type: Boolean, default: false },

    deletedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'user' }], 
   
    fromAdmin: { type: Boolean, default: false },
    adminName: { type: String, default: 'Admin' },
}, { timestamps: true });

module.exports = mongoose.model("notification", notificationSchema);