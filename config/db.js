var config = require('./config'),
	mysql = require("mysql");

var DB = mysql.createPool(config.koneksi);

module.exports.DB = DB;