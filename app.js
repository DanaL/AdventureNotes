const express = require('express');
const mustache = require('mustache-express');
const path = require('path');
const dblib = require('./dblib');

const app = express();
const port = 3000;

app.set('view engine', 'mustache');
app.set('views', `${__dirname}/views`);
app.engine('html', mustache());
app.engine('mustache', mustache());

app.use('/styles', express.static('views/styles'));

const username = 'dana';

app.get('/', (req, res) => {
	dblib.fetchCampaignsForUser(username, (campaigns) => {
		res.status(200).render('index.html', { "campaign-list": campaigns });
	});
});

app.get('/scenes/:campaignID', function (req, res) {
	const campaignID = req.params.campaignID;

	dblib.fetchCampaign(campaignID, username, (campaign) => {
		res.render('scenes.html', 
			{"campaign-name": campaign.name, "quick-notes": "Lorem ipsum etc etc"});
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
