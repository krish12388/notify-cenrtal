const { Pool } = require('pg');
const mongoose = require('mongoose');

const pgUri = process.env.PG_URI || 'postgres://postgres:postgres@localhost:5432/notify_central';

const pool = new Pool({
  connectionString: pgUri,
  ssl: pgUri.includes('localhost') ? false : { rejectUnauthorized: false }
});

const initDB = async () => {
  try {
    const createUsersTableQuery = `
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(24) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        "rollNumber" VARCHAR(255),
        branch VARCHAR(255),
        year INTEGER,
        role VARCHAR(50) DEFAULT 'student',
        "notificationPreferences" JSONB DEFAULT '{"inApp": true, "email": false}'::jsonb,
        "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;
    await pool.query(createUsersTableQuery);
    console.log('PostgreSQL: Users table initialized successfully');
  } catch (error) {
    console.error('PostgreSQL Connection Error:', error);
  }
};

module.exports = {
  query: (text, params) => pool.query(text, params),
  initDB,
  generateId: () => new mongoose.Types.ObjectId().toHexString()
};
