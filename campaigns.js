const dblib = require('./dblib');

function campaignsLinksForUser(username, callback) {
	const sql = `SELECT C.campaignID, name, sceneID
				 FROM Campaigns C JOIN Users U ON C.gmID = U.UserID
				 JOIN (SELECT sceneID, campaignID 
				 		FROM Scenes S ORDER BY sceneID LIMIT 1) S ON C.campaignID = S.campaignID
				 WHERE username = '${username}'`;
	
	dblib.pool.query(sql, (err, res) => {
		if (err) throw err;

		return callback(res);
	});
}

function nextPrevScenes(scene) {
	let sql = `SELECT sceneID 
				  FROM Scenes 
				  WHERE campaignID = ${scene.campaignID} AND scene_order <
				  	(SELECT scene_order FROM SCENES WHERE sceneID = ${scene.sceneID})
				  ORDER BY scene_order DESC LIMIT 1`
	dblib.pool.query(sql, (err, res) => {
		if (err) throw err;

		if (res.length > 0) {
			scene.prevSceneID = res[0].sceneID;
		}
		else {
			scene.prevSceneID = -1;
		}
	});

	sql = `SELECT sceneID 
				  FROM Scenes 
				  WHERE campaignID = ${scene.campaignID} AND scene_order >
				  	(SELECT scene_order FROM SCENES WHERE sceneID = ${scene.sceneID})
				  ORDER BY scene_order LIMIT 1`
	dblib.pool.query(sql, (err, res) => {
		if (err) throw err;

		if (res.length > 0) {
			console.log("stupid fucking cunt");
			scene.nextSceneID = res[0].sceneID;
		}
		else {
			scene.nextSceneID = -1;
		}
	});

	return scene;
}

function sceneDetails(sceneID, username, callback, onErr) {
	const sql = `SELECT C.campaignID, name, sceneID, title, ifNull(quick_notes, '') AS quick_notes,
					ifNull(body, '') AS body
				 FROM Campaigns C JOIN Users U ON C.gmID = U.UserID
				 	JOIN Scenes S ON C.campaignID = S.campaignID
				 WHERE username = '${username}' AND sceneID = ${sceneID}`;
	
	dblib.pool.query(sql, (err, res) => {
		if (err) throw err;

		if (res.length > 0) {
			let scene = { campaignID: res[0].campaignID, sceneID: res[0].sceneID,
				campaignName: res[0].name, title: res[0].title,
				body: res[0].body, quickNotes: res[0].quick_notes };

			return callback(scene);
		}
		else {
			return onErr();
		}
	});
}

module.exports = { campaignsLinksForUser, sceneDetails };
