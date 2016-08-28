var passport = require('passport'),
	LocalStrategy = require('passport-local').Strategy;

module.exports = function() {
	passport.use(new LocalStrategy({
		usernameField: 'email',
    	passwordField: 'password'
	},
	function(email, password, done) {
		DB.getConnection(function(err,koneksi){
			koneksi.query('SELECT * FROM user where email = ? ',[email],
				function(err,user){   
        	    	if (err) {
						return done(err);
					}
					if (!user.length) {
						return done(null, false, {message: 'Username atau password yang anda masukan salah.'});
					}
					if (!( user[0].password == password)) {
						return done(null, false, {message: 'Invalid password'});
					}
				
					return done(null, user[0]);     
        	});
        	koneksi.release();
		});
	}));
};