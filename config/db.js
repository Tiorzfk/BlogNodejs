var config = require('./config'),
	mysql = require("mysql");

function Connection() {

  this.pool = null;

  this.init = function() {
    this.pool = mysql.createPool(config.koneksi);
  }

  this.acquire = function(callback) {
    this.pool.getConnection(function(err, connection) {
      callback(err, connection);
    });
  };
}

module.exports = new Connection();
