const profileService = require('../services/profileService');

/**
 * @desc    Обновление профиля
 * @route   PUT /api/update-profile
 */
exports.updateProfile = async (req, res, next) => {
    try {
        const { userId, bio, avatarUrl } = req.body;
        
        const updatedProfile = await profileService.updateProfileData(userId, bio, avatarUrl);

        res.json({ message: "Профиль успешно обновлен", profile: updatedProfile });
    } catch (err) {
        next(err);
    }
};