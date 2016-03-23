var event = require('../../controllers/admin_aplikasi/event.server.controller');

module.exports = function(app) {

    app.route('/admin-aplikasi/verifikasi_event/:id').get(event.VerifikasiEvent);

    app.route('/admin-aplikasi/event').get(event.listevent);

    app.route('/admin-aplikasi/event/detail/:id').get(event.detail);

    app.route('/admin-aplikasi/event/hapus/:id').get(event.delete);
};