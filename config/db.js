var config = require('./config'),
	mysql = require("mysql");

var DB = mysql.createConnection(config.koneksi);

module.exports.DB = DB;