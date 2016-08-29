var pemeriksaan = require('../../controllers/admin_aplikasi/pemeriksaan.server.controller');

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

    app.route('/admin-aplikasi/lokasi-pemeriksaan').all(isAuthenticated).get(pemeriksaan.listpemeriksaan);

    app.route('/admin-aplikasi/lokasi-pemeriksaan/new').all(isAuthenticated).get(pemeriksaan.renderNew);
    app.route('/admin-aplikasi/lokasi-pemeriksaan/new').all(isAuthenticated).post(pemeriksaan.new);

    app.route('/admin-aplikasi/lokasi-pemeriksaan/detail/:id').all(isAuthenticated).get(pemeriksaan.detail);

    app.route('/admin-aplikasi/lokasi-pemeriksaan/hapus/:id').all(isAuthenticated).get(pemeriksaan.delete);

};