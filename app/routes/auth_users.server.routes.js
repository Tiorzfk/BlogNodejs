var users = require('../../app/controllers/auth_users.server.controller');
	passport = require('passport');

module.export = {
	configure: function(app) {
    app.route('/users').get(users.list);

    app.route('/users/:userId').get(users.read).put(users.update).delete(users.delete);

    app.param('userId', users.userByID);

    app.route('/register')
        .get(users.renderRegister)
        .post(users.register);

    app.route('/login')
        .get(users.renderLogin)
        .post(passport.authenticate('local', {
            successRedirect: '/manage',
            failureRedirect: '/login',
            failureFlash: true
        }));

    app.get('/logout', users.logout);

    app.get('/manage/sahabat-odha', users.sahabat_odha);
	}
};
