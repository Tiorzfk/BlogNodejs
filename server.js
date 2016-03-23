process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var config = require('./config/config'),
	express = require('./config/express'),
	passport = require('./config/passport'),
	passportadmin = require('./config/passportadmin');

var	app = express(),
	passportadmin = passportadmin(),
	passport = passport();

app.listen(config.port);

module.exports = app;
console.log(process.env.NODE_ENV + ' server running at http://localhost:' + config.port);