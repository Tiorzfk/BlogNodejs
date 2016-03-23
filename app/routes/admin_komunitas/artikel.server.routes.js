var artikel = require('../../controllers/admin_komunitas/artikel.server.controller');

module.exports = function(app) {

	app.route('/tes').get(artikel.tes);

    app.route('/admin-komunitas').get(artikel.renderIndex);

    app.route('/admin-komunitas/artikel/new').get(artikel.renderNew).post(artikel.new);

    app.route('/admin-komunitas/artikel').get(artikel.list);

    app.route('/admin-komunitas/artikel/detail/:id').get(artikel.detail);

    app.route('/admin-komunitas/artikel/edit/:id').get(artikel.renderEdit).post(artikel.edit);

    app.route('/admin-komunitas/artikel/delete/:id').get(artikel.delete);

};