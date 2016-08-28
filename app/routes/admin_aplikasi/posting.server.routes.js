var posting = require('../../controllers/admin_aplikasi/posting.server.controller');

function isAuthenticated(req, res, next) {

    // do any checks you want to in here

    // CHECK THE USER STORED IN SESSION FOR A CUSTOM VARIABLE
    // you can do this however you want with whatever variables you set up
    if (req.user) {
        if (req.user[0].jenis_admin === 'admin aplikasi'){
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

    app.route('/admin-aplikasi/verifikasi_posting/:kategori/:id').all(isAuthenticated).get(posting.VerifikasiPosting);

    app.route('/admin-aplikasi/berita').all(isAuthenticated).get(posting.listberita);

    app.route('/admin-aplikasi/artikel').all(isAuthenticated).get(posting.listartikel);
};