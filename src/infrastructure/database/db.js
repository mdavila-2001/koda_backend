const { Pool } = require('pg');
require('dotenv').config();

const useSsl = process.env.DB_SSL === 'true';
const poolConfig = process.env.DATABASE_URL
    ? {
        connectionString: process.env.DATABASE_URL,
        ssl: useSsl
            ? {
                require: true,
                rejectUnauthorized: false
            }
            : false
    }
    : {
        user: process.env.DB_USER,
        host: process.env.DB_HOST,
        database: process.env.DB_NAME,
        password: process.env.DB_PASSWORD,
        port: Number(process.env.DB_PORT || 5432),
        ssl: useSsl
            ? {
                require: true,
                rejectUnauthorized: false
            }
            : false
    };

const pool = new Pool(poolConfig);

module.exports = {
    query: (text, params) => pool.query(text, params),
    pool
};