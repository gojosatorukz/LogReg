const mongoose = require('mongoose');

const ProfileSchema = new mongoose.Schema({
    userId: { type: Number, required: true },
    bio: { type: String, default: "Студент AITU" }, 
    avatarUrl: { type: String, default: "https://via.placeholder.com/150" }, 
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Profile', ProfileSchema);