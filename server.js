process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var config = require('./config/config'),
	express = require('./config/express'),
	http = require('http');

var app = express();

var server = http.createServer(app);
server.listen(config.port);

module.exports = app;
console.log(process.env.NODE_ENV + ' server running at http://localhost:' + config.port);
