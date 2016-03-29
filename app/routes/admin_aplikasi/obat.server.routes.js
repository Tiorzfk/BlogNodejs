var obat = require('../../controllers/admin_aplikasi/obat.server.controller');

module.exports = function(app) {

    app.route('/admin-aplikasi/lokasi-obat').get(obat.listobat);

    app.route('/admin-aplikasi/lokasi-obat/new').get(obat.renderNew);
    app.route('/admin-aplikasi/lokasi-obat/new').post(obat.new);

    app.route('/admin-aplikasi/lokasi-obat/detail/:id').get(obat.detail);

    app.route('/admin-aplikasi/lokasi-obat/hapus/:id').get(obat.delete);

    app.route('/admin-aplikasi/lokasi-obat/edit/:id').get(obat.renderEdit);

     app.route('/admin-aplikasi/lokasi-obat/edit/:id').post(obat.edit);

};