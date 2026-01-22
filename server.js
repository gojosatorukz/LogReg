const express = require('express');
const cors = require('cors');
require('dotenv').config();

const logger = require('./middleware/logger');
const errorHandler = require('./middleware/errorHandler');

const authRoutes = require('./routes/authRoutes');
const pool = require('./config/db');

const app = express();

app.use(logger);

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

app.use('/api', authRoutes);

app.use('/api', authRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
    console.log(`Сервер запущен: http://localhost:${PORT}`);
});

process.on('SIGINT', async () => {
    console.log('\nClosing server...');
    
    await pool.end();
    console.log('PostgreSQL disconnected');
    
    server.close(() => {
        console.log('Server closed');
        process.exit(0);
    });
});