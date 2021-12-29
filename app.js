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

const username = 'dana';

app.get('/', (req, res) => {
	campaigns.campaignsLinksForUser(username, (campaigns) => {
		res.status(200).render('index.html', { "campaign-list": campaigns });
	});
});

app.get('/scenes/:sceneID', function (req, res) {
	const defaultSceneID = req.params.sceneID;

	campaigns.sceneDetails(defaultSceneID, username, (scene) => {
			res.render('scenes.html', 
				{"campaign-name": scene.name, 
				 "scene-title": scene.title,
				 "scene-body": scene.body,
				 "quick-notes": scene.quickNotes });
		}, 
		() => { res.redirect("/"); }
	);
})

app.post('/', (req, res) => {
	console.log("post received.");
	res.send("Got a POST request!");
});

app.listen(port, () => {
	console.log(`Listening at http://localhost:${port}`);
})
