const authService = require('../services/authService');

/**
 * @desc    Регистрация
 * @route   POST /api/register
 */
exports.register = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await authService.registerUser(email, password);
        
        res.status(201).json({ message: "Регистрация успешна", user });
    } catch (err) {
        if (err.message === "Пользователь с таким email уже существует") {
            return res.status(400).json({ error: err.message });
        }
        next(err);
    }
};

/**
 * @desc    Вход
 * @route   POST /api/login
 */
exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const data = await authService.loginUser(email, password);
        
        res.status(200).json({ message: "Вход выполнен успешно", ...data });
    } catch (err) {
        if (err.message === "Неверный email или пароль") {
            return res.status(401).json({ error: err.message });
        }
        next(err);
    }
};