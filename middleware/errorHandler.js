/**
 * @desc    Глобальный обработчик ошибок
 * Ловит все ошибки, которые мы передали через next(err)
 */
const errorHandler = (err, req, res, next) => {
    console.error("❌ Error caught:", err.stack);

    res.status(err.status || 500).json({
        success: false,
        error: err.message || 'Internal Server Error'
    });
};

module.exports = errorHandler;