var banner = require('../../controllers/admin_komunitas/banner.server.controller');

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

    app.route('/manage/banner/new').all(isAuthenticated).get(banner.renderNew).post(banner.new);

    app.route('/manage/banner').all(isAuthenticated).get(banner.list);

    app.route('/manage/banner/edit/:id').all(isAuthenticated).get(banner.renderEdit).post(banner.edit);

    //app.route('/manage/banner/delete/:id').post(banner.delete);

};