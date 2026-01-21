const pool = require('../config/db');
const bcrypt = require('bcrypt');
const Profile = require('../models/Profile');

/**
 * @desc    Регистрация нового пользователя
 * @route   POST /api/register
 * @access  Public
 */
exports.register = async (req, res, next) => {
    const { email, password } = req.body;
    try {
        const userCheck = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (userCheck.rows.length > 0) {
            return res.status(400).json({ error: "Пользователь с таким email уже существует" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUserResult = await pool.query(
            'INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id, email',
            [email, hashedPassword]
        );
        const newUser = newUserResult.rows[0];

        const newProfile = new Profile({
            userId: newUser.id,
            bio: "Привет! Я новый пользователь.",
            avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=" + newUser.email
        });
        await newProfile.save();

        res.status(201).json({ message: "Регистрация успешна", user: newUser });
    } catch (err) {
        next(err);
    }
};

/**
 * @desc    Авторизация пользователя и получение токена/данных
 * @route   POST /api/login
 * @access  Public
 */
exports.login = async (req, res, next) => {
    const { email, password } = req.body;
    try {
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        
        if (result.rows.length === 0) {
            return res.status(401).json({ error: "Неверный email или пароль" });
        }

        const user = result.rows[0];

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(401).json({ error: "Неверный email или пароль" });
        }

        const userProfile = await Profile.findOne({ userId: user.id });

        res.status(200).json({ 
            message: "Вход выполнен успешно", 
            userId: user.id, 
            email: user.email,
            bio: userProfile ? userProfile.bio : "Нет данных",
            avatar: userProfile ? userProfile.avatarUrl : ""
        });
    } catch (err) {
        next(err);
    }
};

/**
 * @desc    Обновление профиля пользователя
 * @route   PUT /api/update-profile
 * @access  Private (по логике, но пока Public для простоты)
 */
exports.updateProfile = async (req, res, next) => {
    const { userId, bio, avatarUrl } = req.body;
    try {
        const updatedProfile = await Profile.findOneAndUpdate(
            { userId: userId }, 
            { bio: bio, avatarUrl: avatarUrl }, 
            { new: true, upsert: true, setDefaultsOnInsert: true }
        );

        res.json({ message: "Профиль успешно обновлен в MongoDB", profile: updatedProfile });
    } catch (err) {
        next(err);
    }
};