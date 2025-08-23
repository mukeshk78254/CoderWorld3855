const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
    title: { type: String, required: true },
    message: { type: String, required: true },
    link: { type: String }, // Optional link, e.g., to a new contest
    // This allows us to track who has read the notification
    readBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'user' }], 
}, { timestamps: true });

module.exports = mongoose.model("Notification", notificationSchema);