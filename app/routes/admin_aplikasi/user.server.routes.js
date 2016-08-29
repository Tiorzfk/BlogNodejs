var user = require('../../controllers/admin_aplikasi/user.server.controller');

function isAuthenticated(req, res, next) {

    // do any checks you want to in here

    // CHECK THE USER STORED IN SESSION FOR A CUSTOM VARIABLE
    // you can do this however you want with whatever variables you set up
    if (req.user) {
        if (req.user.jenis_admin === 'admin aplikasi'){
            return next();
        }else{
            res.redirect('/admin-komunitas');
        }
    }else{
        // IF A USER ISN'T LOGGED IN, THEN REDIRECT THEM SOMEWHERE
        res.redirect('/admin/login');
    }
}

module.exports = function(app) {

    app.route('/admin-aplikasi').all(isAuthenticated).get(user.renderIndex);
    app.route('/admin-aplikasi/verifikasi/:user/:id').all(isAuthenticated).get(user.VerifikasiUser);

    app.route('/admin-aplikasi/user1').all(isAuthenticated).get(user.listodha);
    app.route('/admin-aplikasi/user2').all(isAuthenticated).get(user.listsaodha);

    app.route('/admin-aplikasi/:user/delete/:id').all(isAuthenticated).get(user.delete);

};