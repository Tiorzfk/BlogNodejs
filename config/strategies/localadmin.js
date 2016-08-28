var passport = require('passport'),
	LocalStrategy = require('passport-local').Strategy;

module.exports = function() {
	passport.use('localadmin',new LocalStrategy({
		usernameField: 'email',
    	passwordField: 'password'
	},
	function(email, password, done) {
		DB.getConnection(function(err,koneksi){
			koneksi.query('SELECT * FROM admin where email = ? ',[email],
				function(err,admin){   
        	    	if (err) {
						return done(err);
					}
					if (!admin.length) {
						return done(null, false, {message: 'Username atau password yang anda masukan salah.'});
					}
					if (!( admin[0].password == password)) {
						return done(null, false, {message: 'Invalid password'});
					}
					
					return done(null, admin[0]);     
        	});
        	koneksi.release();
        }); 
	}));
};