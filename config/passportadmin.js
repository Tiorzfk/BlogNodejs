var passport = require('passport');

module.exports = function() {

    DB = require('./db').DB;

    passport.serializeUser(function(admin, done) {
        done(null, admin.id_admin);
    });

    passport.deserializeUser(function(id, done) {
        //DB.getConnection(function(err,koneksi){
            DB.query('SELECT * FROM admin where id_admin= ?',[id],function(err,admin){
                done(err, admin[0]);
            });
        //});
    });

    require('./strategies/localadmin.js')();
};