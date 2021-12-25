const express = require('express');
const mustache = require('mustache-express');
const path = require('path');

const app = express();
const port = 3000;

app.set('view engine', 'mustache');
app.set('views', `${__dirname}/views`);
app.engine('html', mustache());
app.engine('mustache', mustache());

app.use('/styles', express.static('views/styles'));

const html = `
	<html>
	<head>
		<title>landing page</title>
		<link rel="stylesheet" href="/styles/style.css">
	</head>
	<body>
		<div class="p-2 text-2xl">
			My local dev site for my adventure notes app
		</div>
		<div class="text-base px-10">
			<ul class="list-disc">
				<li><a class="hover:text-blue-600" href="/scenes">scenes</a></li>
			</ul>
		</div>
	</body>
	</html>
`;
app.get('/', (req, res) => {
	res.status(200).send(html);
});

app.get('/scenes', function (req, res) {
  res.render('scenes.html', 
  	{"campaign-name": "Untitled Homebrew Game", "quick-notes": "Lorem ipsum etc etc"});
})

app.post('/', (req, res) => {
	console.log("post received.");
	res.send("Got a POST request!");
});

app.listen(port, () => {
	console.log(`Listening at http://localhost:${port}`);
})
