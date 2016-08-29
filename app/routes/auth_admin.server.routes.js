var admin = require('../../app/controllers/auth_admin.server.controller');

module.exports = function(app,passport) {

    app.route('/admin/register')
        .get(admin.renderRegister)
        .post(admin.register);

    app.route('/admin/login')
        .get(admin.renderLogin)
        .post(passport.authenticate('localadmin', {
            failureRedirect: '/admin/login',
            failureFlash: true
        }),
            function(req, res, next) { 
                if (req.user.jenis_admin === 'admin komunitas') {
                    return res.redirect('/admin-komunitas');
                } else {
                    return res.redirect('/admin-aplikasi');
                }
            }
        );

    app.get('/admin/logout', admin.logout);

};