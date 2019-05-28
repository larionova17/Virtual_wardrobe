const express = require('express'),
    router = express.Router(),
    config = require('config'),
    fs = require('file-system'),
    shortId = require('shortid');

router.get('/api', (req, res) => {
	res.send(fs.readFileSync(config.get('jsonImages'), 'utf8'));
});

router.post('/api', (req, res) => {
	const data = JSON.parse(fs.readFileSync(config.get('jsonSaveStyle'), 'utf8')),
		login = req.body.login;
		
	data[login] = [];

	delete req.body.login;
	
	data[login].push(req.body);

	fs.writeFileSync(config.get('jsonSaveStyle'), JSON.stringify(data));
	
	res.sendStatus(204);
});

router.put('/api', (req, res) => {
	const data = JSON.parse(fs.readFileSync(config.get('jsonImages'), 'utf8')),
		login = req.body.login;
		
		if (!(login in data)) {
			data[login] = [];
		}

	delete req.body.login;
	
	data[login].push(req.body);

	fs.writeFileSync(config.get('jsonImages'), JSON.stringify(data));
	
	res.sendStatus(204);
});

router.post('/api/login', (req, res) => {
	const data = JSON.parse(fs.readFileSync(config.get('jsonUser'), 'utf8')),
		user = req.body,
		login = data.some(userName => userName.login === user.login);

	if (!login) {
		data.push(user);
		fs.writeFileSync(dataUser, JSON.stringify(data));
	} else {
		const password = data.some(userName => (userName.password === user.password && userName.login === user.login));

		if (password) {
			res.send(password);
		} else {
			res.send(password);
		}
	}
});

router.get('/api/save', (req, res) => {
	res.send(fs.readFileSync(config.get('jsonSaveStyle'), 'utf8'));
});

router.put('/api/save', (req, res) => {
	const data = JSON.parse(fs.readFileSync(config.get('jsonMyImages'), 'utf8')),
		login = req.body.login;

		req.body.id = shortId.generate();
		
		if (!(login in data)) {
			data[login] = [];
		}

	delete req.body.login;
	
	data[login].push(req.body);

	fs.writeFileSync(config.get('jsonMyImages'), JSON.stringify(data));
	
	res.sendStatus(204);
});

router.get('/api/images', (req, res) => {
	res.send(fs.readFileSync(config.get('jsonMyImages'), 'utf8'));
});

router.get('/api/images/:id', (req, res) => {
	const data = JSON.parse(fs.readFileSync(config.get('jsonMyImages'), 'utf8'));
	let image;

	for (let login in data) {
	    if (data.hasOwnProperty(login)) {
            image = data[login].find(image => image.id === req.params.id);
        }
	}
	
	res.send(image);
});

router.put('/api/images/:id', (req, res) => {
	const data = JSON.parse(fs.readFileSync(config.get('jsonMyImages'), 'utf8')),
	updatedImage = req.body;
	let image;

	for (let style in data) {
	   image = data[style].find(image => image.id === req.params.id);
	}

	image.data = updatedImage.data;
	image.category = updatedImage.category;
	
	fs.writeFileSync(config.get('jsonMyImages'), JSON.stringify(data));
	
	res.sendStatus(204);
});

router.delete('/api/images/:id', (req, res) => {
	const data = JSON.parse(fs.readFileSync(config.get('jsonMyImages'), 'utf8'));
	let upfilterImages;

    for (let style in data) {
        upfilterImages = data[style].filter((image) => image.id !== req.params.id);
        data[style] = upfilterImages;
    }
	
	fs.writeFileSync(config.get('jsonMyImages'), JSON.stringify(data));
	
	res.sendStatus(204);
});

module.exports = router;