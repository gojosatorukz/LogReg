const { Pool } = require('pg');
const mongoose = require('mongoose');
require('dotenv').config();

const pgPool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

pgPool.on('connect', () => {
    console.log('PostgreSQL подключена');
});

const connectMongo = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB подключена');
    } catch (err) {
        console.error('Ошибка подключения MongoDB:', err);
    }
};

connectMongo();

module.exports = pgPool;