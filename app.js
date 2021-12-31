const express = require('express');
const mustache = require('mustache-express');
const path = require('path');
const dblib = require('./dblib');
const campaigns = require('./campaigns');
const app = express();
const port = 3000;

app.set('view engine', 'mustache');
app.set('views', `${__dirname}/views`);
app.engine('html', mustache());
app.engine('mustache', mustache());

app.use('/styles', express.static('views/styles'));
app.use('/images', express.static('views/images'));

const username = 'dana';

app.get('/', async (req, res) => {
	await campaigns.campaignsLinksForUser(username, (campaigns) => {
		res.status(200).render('index.html', { "campaign-list": campaigns });
	});
});

async function sendScene(sceneID, res) {
	await campaigns.sceneDetails(sceneID, username, (scene) => {
			res.render('scenes.html', {
				 "page-title": scene.name,
				 "campaign-name": scene.name, 
				 "scene-title": scene.title,
				 "scene-body": scene.body,
				 "quick-notes": scene.quickNotes ,
				 "next-id": scene.nextSceneID,
				 "prev-id": scene.prevSceneID,
				 "has-prev-link": scene.prevSceneID > -1,
				 "has-next-link": scene.nextSceneID > -1,
				 "scene-id": sceneID
			});
		}, 
		() => { res.redirect("/"); }
	);
}

app.get('/scenes/:sceneID', async (req, res) => {
	await sendScene(req.params.sceneID, res);
})

const bodyParser = require('body-parser')
const up = bodyParser.urlencoded({ extended: false });

app.post('/scenes/:sceneID', up, async (req, res) => {
	const sceneID = req.params.sceneID;

	// ofc I'm going to have to do form sanitation and such!
	const sceneText = req.body.editArea;
	const quickNotes = req.body.quickNotesBox;
	await campaigns.writeSceneDetails(sceneID, sceneText, quickNotes);
	await sendScene(sceneID, res);
});

app.listen(port, () => {
	console.log(`Listening at http://localhost:${port}`);
})
