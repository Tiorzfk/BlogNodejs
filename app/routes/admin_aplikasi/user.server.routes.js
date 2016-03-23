var user = require('../../controllers/admin_aplikasi/user.server.controller');

module.exports = function(app) {

    app.route('/admin-aplikasi').get(user.renderIndex);

    app.route('/admin-aplikasi/verifikasi/:user/:id').get(user.VerifikasiUser);

    app.route('/admin-aplikasi/user1').get(user.listodha);
    app.route('/admin-aplikasi/user2').get(user.listsaodha);

    app.route('/admin-aplikasi/:user/delete/:id').get(user.delete);
};