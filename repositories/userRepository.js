const pool = require('../config/db');

class UserRepository {
    
    // Найти по email
    async findByEmail(email) {
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        return result.rows[0]; // Возвращаем юзера или undefined
    }

    // Создать юзера
    async create(email, passwordHash) {
        const result = await pool.query(
            'INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id, email',
            [email, passwordHash]
        );
        return result.rows[0];
    }
}

module.exports = new UserRepository();