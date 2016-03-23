var event = require('../../controllers/admin_komunitas/event.server.controller');

module.exports = function(app) {

    app.route('/admin-komunitas/event/new').get(event.renderNew).post(event.new);

    app.route('/admin-komunitas/event').get(event.list);

    app.route('/admin-komunitas/event/detail/:id').get(event.detail);

    app.route('/admin-komunitas/event/edit/:id').get(event.renderEdit).post(event.edit);

    app.route('/admin-komunitas/event/delete/:id').get(event.delete);

};