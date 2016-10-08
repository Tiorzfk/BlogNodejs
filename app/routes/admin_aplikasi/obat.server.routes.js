var obat = require('../../controllers/admin_aplikasi/obat.server.controller');

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

module.exports = {
  configure: function(app) {
    app.route('/admin-aplikasi/lokasi-pemeriksaan-obat').all(isAuthenticated).get(obat.listobat);

    app.route('/admin-aplikasi/lokasi-pemeriksaan-obat/new').all(isAuthenticated).get(obat.renderNew);
    app.route('/admin-aplikasi/lokasi-pemeriksaan-obat/new').all(isAuthenticated).post(obat.new);

    app.route('/admin-aplikasi/lokasi-pemeriksaan-obat/detail/:id').all(isAuthenticated).get(obat.detail);

    app.route('/admin-aplikasi/lokasi-pemeriksaan-obat/hapus/:id').all(isAuthenticated).get(obat.delete);

    app.route('/admin-aplikasi/lokasi-pemeriksaan-obat/edit/:id').all(isAuthenticated).get(obat.renderEdit);

     app.route('/admin-aplikasi/lokasi-pemeriksaan-obat/edit/:id').all(isAuthenticated).post(obat.edit);
  }
};
