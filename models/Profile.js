const mongoose = require('mongoose');

const ProfileSchema = new mongoose.Schema({
    userId: { type: Number, required: true }, // Ссылка на ID из PostgreSQL
    bio: { type: String, default: "Студент AITU" }, // Просто текст о себе
    avatarUrl: { type: String, default: "https://via.placeholder.com/150" }, // Ссылка на картинку
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Profile', ProfileSchema);