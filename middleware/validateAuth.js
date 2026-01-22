const validateAuthRequest = (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: "Email и пароль обязательны" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ error: "Неверный формат email" });
    }

    if (password.length < 6) {
        return res.status(400).json({ error: "Пароль должен быть минимум 6 символов" });
    }

    next();
};

module.exports = validateAuthRequest;