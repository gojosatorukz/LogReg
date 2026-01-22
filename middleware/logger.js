/**
 * @desc    Логгирует каждый запрос в консоль
 * @example [2026-01-22T12:00:00] GET /api/login
 */
const logger = (req, res, next) => {
    const timestamp = new Date().toISOString();
    const method = req.method;
    const url = req.originalUrl;

    console.log(`[${timestamp}] ${method} ${url}`);
    
    next();
};

module.exports = logger;