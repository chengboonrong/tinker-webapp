const express = require('express')
const https = require('https')
const fs    = require('fs')
const bodyParser = require('body-parser')
const httpOptions =  {
	key: fs.readFileSync("keys/privatekey.pem"),
	cert: fs.readFileSync("keys/certificate.pem"),
	requestCert: false,
	rejectUnauthorized: false
}

const bc = require('bcrypt')
const shell = require('shelljs')
 
const app = express()
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

const port = process.env.PORT || 3000
const server = https.createServer(httpOptions, app)

app.get('/', (req, res) => res.sendFile(__dirname + '/index.html'))
app.get('/app', (req, res) => res.sendFile(__dirname + '/app.html'))
app.post('/login', (req,res) => {
	const users = shell.exec('cat /etc/passwd | grep /bin/bash | cut -d: -f 1', {silent: true}).stdout.split('\n');
    users.splice(-1);
    const _password = shell.exec('sudo cat /etc/shadow | grep demo | cut -d: -f 2', {silent: true}).stdout.replace(/\s/g, '');

	if(users.includes(req.body.uname) && bc.compareSync(req.body.pwd, _password)){
			res.redirect('/app');
	}else{
			console.log(req.body)
			res.redirect('/')
	}
});

app.listen(3000)
// server.listen(port, ()=> console.log('Express server listening on port ' + server.address().port))