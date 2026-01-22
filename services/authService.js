const pool = require('../config/db');
const bcrypt = require('bcrypt');
const profileService = require('./profileService'); 

class AuthService {
    
    async registerUser(email, password) {
        const userCheck = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (userCheck.rows.length > 0) {
            throw new Error("Пользователь с таким email уже существует");
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUserResult = await pool.query(
            'INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id, email',
            [email, hashedPassword]
        );
        const newUser = newUserResult.rows[0];

        await profileService.createDefaultProfile(newUser.id, newUser.email);

        return newUser;
    }

    async loginUser(email, password) {
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        const user = result.rows[0];

        if (!user) throw new Error("Неверный email или пароль");

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) throw new Error("Неверный email или пароль");

        let userProfile = null;
        try {
             userProfile = await profileService.getProfileByUserId(user.id);
        } catch (e) {
            // no profile = null
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