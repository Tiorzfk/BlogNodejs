var event = require('../../controllers/admin_aplikasi/event.server.controller');

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

    app.route('/admin-aplikasi/verifikasi_event/:id').all(isAuthenticated).get(event.VerifikasiEvent);

    app.route('/admin-aplikasi/event').all(isAuthenticated).get(event.listevent);

    app.route('/admin-aplikasi/event/detail/:id').all(isAuthenticated).get(event.detail);

    app.route('/admin-aplikasi/event/hapus/:id').all(isAuthenticated).get(event.delete);
};