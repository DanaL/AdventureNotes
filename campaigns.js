const dblib = require('./dblib');
const util = require('./views/scripts/util');
const tk = require('./views/scripts/tokenizer');

async function campaignsLinksForUser(username, callback) {
	const sql = `SELECT C.campaignID, name, sceneID
				 FROM Campaigns C JOIN Users U ON C.gmID = U.UserID
				 JOIN (SELECT sceneID, campaignID 
				 		FROM Scenes S ORDER BY scene_order LIMIT 1) S ON C.campaignID = S.campaignID
				 WHERE username = '${username}'`;
	
	const res = await dblib.pool.query(sql);

	return callback(res[0]);
}

async function nextPrevScenes(scene) {
	let sql = `SELECT sceneID 
				  FROM Scenes 
				  WHERE campaignID = ${scene.campaignID} AND scene_order <
				  	(SELECT scene_order FROM SCENES WHERE sceneID = ${scene.sceneID})
				  ORDER BY scene_order DESC LIMIT 1`
	let res = await dblib.pool.query(sql);
	scene.prevSceneID = res[0].length > 0 ? res[0][0].sceneID : -1;

	sql = `SELECT sceneID 
				  FROM Scenes 
				  WHERE campaignID = ${scene.campaignID} AND scene_order >
				  	(SELECT scene_order FROM SCENES WHERE sceneID = ${scene.sceneID})
				  ORDER BY scene_order LIMIT 1`
	res = await dblib.pool.query(sql);
	scene.nextSceneID = res[0].length > 0 ? res[0][0].sceneID : -1;

	return scene;
}

async function sceneDetails(sceneID, username, callback, onErr) {
	const sql = `SELECT C.campaignID, name, sceneID, title, ifNull(quick_notes, '') AS quick_notes,
					ifNull(body, '') AS body
				 FROM Campaigns C JOIN Users U ON C.gmID = U.UserID
				 	JOIN Scenes S ON C.campaignID = S.campaignID
				 WHERE username = '${username}' AND sceneID = ${sceneID}`;
	
	const [rows, _] = await dblib.pool.query(sql);
	const si = rows[0];
	const t = new tk.MDTokenizer(si.body);
	const tweaked = util.toHTML(t.tokenize());
	let scene = { campaignID: si.campaignID, sceneID: si.sceneID, campaignName: si.name,
		title: si.title, body: tweaked, quickNotes: si.quick_notes };
	scene = await nextPrevScenes(scene);

	console.log(scene);
	return callback(scene);
}

async function writeSceneDetails(sceneID, sceneText, quickNotes) {
	const sql = `UPDATE Scenes
				 SET body = '${sceneText}', quick_notes = '${quickNotes}'
				 WHERE sceneID = ${sceneID}`;
	await dblib.pool.query(sql);
}

module.exports = { campaignsLinksForUser, sceneDetails, writeSceneDetails };
