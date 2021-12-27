const mysql = require('mysql2');

const pool = mysql.createPool({
	host: 'localhost',
	user: 'adv_notes_node',
	password: '@llauc3!',
	database: 'AdventureNotes',
	waitForConnections: true,
	connectionLimit: 20,
	queueLimit: 0
});
const promisePool = pool.promise();

function fetchCampaignsForUser(username, callback) {
	const sql = `SELECT campaignID, name
					FROM Campaigns C JOIN Users U ON C.gmID = U.userID
					WHERE username = '${username}'`;

	pool.query(sql, function(err, res) {
		if (err) throw err;

		return callback(res);
	});
}

function fetchCampaign(campaignID, username, callback, onErr) {
	const sql = `SELECT campaignID, name
					FROM Campaigns C JOIN Users U ON C.gmID = U.userID
					WHERE campaignID = ${campaignID} AND U.username = '${username}'`;

	pool.query(sql, function(err, res) {
		if (err) throw err;
		
		if (res.length > 0)
			return callback(res[0]);
		else
			return onErr();
	});

	return "";
}

module.exports = { fetchCampaignsForUser, fetchCampaign };
