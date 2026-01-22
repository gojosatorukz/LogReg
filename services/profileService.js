const Profile = require('../models/Profile');

class ProfileService {
    
    async createDefaultProfile(userId, email) {
        const newProfile = new Profile({
            userId: userId,
            bio: "Привет! Я новый пользователь.",
            avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=" + email
        });
        await newProfile.save();
        return newProfile;
    }

    async updateProfileData(userId, bio, avatarUrl) {
        const updatedProfile = await Profile.findOneAndUpdate(
            { userId: userId }, 
            { bio: bio, avatarUrl: avatarUrl }, 
            { new: true, upsert: true, setDefaultsOnInsert: true }
        );
        return updatedProfile;
    }

    async getProfileByUserId(userId) {
        const profile = await Profile.findOne({ userId: userId });
        if (!profile) throw new Error("Профиль не найден");
        return profile;
    }
}

module.exports = new ProfileService();