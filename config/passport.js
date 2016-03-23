var passport = require('passport');

module.exports = function() {

	DB = require('./db').DB;

    passport.serializeUser(function(user, done) {
        done(null, user.id_user);
    });

    passport.deserializeUser(function(id, done) {
        DB.query('SELECT * FROM user where id_user= ?',[id],function(err,user){
            done(err, user[0]);
        });

        /*DB.query('SELECT * FROM tb_admin where id_admin= ?',[id],function(err,user){
            done(err, user[0]);
        });*/
    });
    //require('./strategies/localadmin.js')();
    require('./strategies/local.js')();
};