process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var config = require('./config/config'),
	express = require('./config/express'),
	passportadmin = require('./config/passportadmin'),
	passport = require('./config/passport'),
	http = require('http');

var app = express(),
	passportadmin = passportadmin(),
	passport = passport();

var server = http.createServer(app);
server.listen(config.port);

module.exports = app;
console.log(process.env.NODE_ENV + ' server running at http://localhost:' + config.port);