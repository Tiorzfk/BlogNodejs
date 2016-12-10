var event = require('../../controllers/admin_komunitas/event.server.controller');

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

module.exports = {
  configure: function(app) {
    app.route('/admin-komunitas/event/new').all(isAuthenticated).get(event.renderNew).post(event.new);

    app.route('/admin-komunitas/event').all(isAuthenticated).get(event.mylist);

    app.route('/admin-komunitas/event/detail/:id').all(isAuthenticated).get(event.detail);

    app.route('/admin-komunitas/event/edit/:id').all(isAuthenticated).get(event.renderEdit).post(event.edit);

    app.route('/admin-komunitas/event/delete/:id').all(isAuthenticated).get(event.delete);
  }
};
