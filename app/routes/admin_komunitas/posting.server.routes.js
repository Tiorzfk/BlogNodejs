var posting = require('../../controllers/admin_komunitas/posting.server.controller');

module.exports = function(app) {

	app.route('/tes').get(posting.tes);

    app.route('/admin-komunitas').get(posting.renderIndex);

    app.route('/admin-komunitas/posting/new').get(posting.renderNew).post(posting.new);

    app.route('/admin-komunitas/posting').get(posting.list);

    app.route('/admin-komunitas/posting/detail/:id').get(posting.detail);

    app.route('/admin-komunitas/posting/edit/:id').get(posting.renderEdit).post(posting.edit);

    app.route('/admin-komunitas/posting/delete/:id').get(posting.delete);

};