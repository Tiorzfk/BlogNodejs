var pemeriksaan = require('../../controllers/admin_aplikasi/pemeriksaan.server.controller');

module.exports = function(app) {

    app.route('/admin-aplikasi/lokasi-pemeriksaan').get(pemeriksaan.listpemeriksaan);

    app.route('/admin-aplikasi/lokasi-pemeriksaan/new').get(pemeriksaan.renderNew);
    app.route('/admin-aplikasi/lokasi-pemeriksaan/new').post(pemeriksaan.new);

    app.route('/admin-aplikasi/lokasi-pemeriksaan/detail/:id').get(pemeriksaan.detail);

    app.route('/admin-aplikasi/lokasi-pemeriksaan/hapus/:id').get(pemeriksaan.delete);

};