var posting = require('../../controllers/admin_komunitas/posting.server.controller');

function isAuthenticated(req, res, next) {

    // do any checks you want to in here

    // CHECK THE USER STORED IN SESSION FOR A CUSTOM VARIABLE
    // you can do this however you want with whatever variables you set up
    if (req.user) {
        if (req.user.jenis_admin === 'admin komunitas'){
            return next();
        }else{
            res.redirect('/admin-aplikasi');
        }
    }else{
        // IF A USER ISN'T LOGGED IN, THEN REDIRECT THEM SOMEWHERE
        res.redirect('/admin/login');
    }
}

module.exports = function(app) {

	app.route('/tes').all(isAuthenticated).get(posting.tes);

    app.route('/admin-komunitas').all(isAuthenticated).get(posting.renderIndex);

    app.route('/admin-komunitas/posting/new').all(isAuthenticated).get(posting.renderNew).post(posting.new);

    app.route('/admin-komunitas/posting').all(isAuthenticated).get(posting.list);

    app.route('/admin-komunitas/posting/detail/:id').all(isAuthenticated).get(posting.detail);

    app.route('/admin-komunitas/posting/edit/:id').all(isAuthenticated).get(posting.renderEdit).post(posting.edit);

    app.route('/admin-komunitas/posting/delete/:id').all(isAuthenticated).get(posting.delete);

};