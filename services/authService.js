const bcrypt = require('bcrypt');
const userRepository = require('../repositories/userRepository'); 
const profileService = require('./profileService'); 

class AuthService {
    
    async registerUser(email, password) {
        const existingUser = await userRepository.findByEmail(email);
        if (existingUser) {
            throw new Error("Пользователь с таким email уже существует");
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = await userRepository.create(email, hashedPassword);

        await profileService.createDefaultProfile(newUser.id, newUser.email);

        return newUser;
    }

    async loginUser(email, password) {
        const user = await userRepository.findByEmail(email);

        if (!user) throw new Error("Неверный email или пароль");

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) throw new Error("Неверный email или пароль");

        let userProfile = null;
        try {
             userProfile = await profileService.getProfileByUserId(user.id);
        } catch (e) {
            // null
        }

        return {
            userId: user.id,
            email: user.email,
            bio: userProfile ? userProfile.bio : "Нет данных",
            avatar: userProfile ? userProfile.avatarUrl : ""
        };
    }
}

module.exports = new AuthService();
