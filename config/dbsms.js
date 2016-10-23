var mysql = require("mysql");

		var konek = {
	    host     : 'ap-cdbr-azure-southeast-b.cloudapp.net',
	    user     : 'b3671d957c98a8',
	    password : '8abfbc7d',
	    database : 'comradesms'
	  };

function Connection() {

  this.pool = null;

  this.init = function() {
    this.pool = mysql.createPool(konek);
  }

  this.acquire = function(callback) {
    this.pool.getConnection(function(err, connection) {
      callback(err, connection);
    });
  };
}

module.exports = new Connection();
