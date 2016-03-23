var posting = require('../../controllers/admin_aplikasi/posting.server.controller');

module.exports = function(app) {

    app.route('/admin-aplikasi/verifikasi_posting/:kategori/:id').get(posting.VerifikasiPosting);

    app.route('/admin-aplikasi/berita').get(posting.listberita);

    app.route('/admin-aplikasi/artikel').get(posting.listartikel);
};