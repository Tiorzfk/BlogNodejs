var db = require('./db');
var LocalStrategy   = require('passport-local').Strategy;
module.exports = function(passport) {

    passport.serializeUser(function(admin, done) {
        done(null, admin.id_admin);
    });

    passport.deserializeUser(function(id, done) {
        db.acquire(function(err,con){
            con.query('SELECT * FROM admin where id_admin= ?',[id],function(err,admin){
              con.release();
                done(err, admin[0]);
            });
        });
    });

    passport.use('localadmin',new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password'
    },
    function(email, password, done) {
        db.acquire(function(err,con){
            con.query('SELECT * FROM admin where email = ? ',[email],
                function(err,admin){
                  con.release();
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
        });
    }));
};
