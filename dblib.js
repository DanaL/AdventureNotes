require('dotenv').config();
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
	host: process.env.DB_HOST,
	user: process.env.DB_USER,
	password: process.env.DB_PASS,
	database: 'AdventureNotes',
	waitForConnections: true,
	connectionLimit: 20,
	queueLimit: 0
});

module.exports = { pool };
