var banner = require('../../controllers/admin_komunitas/banner.server.controller');

module.exports = function(app) {

    app.route('/manage/banner/new').get(banner.renderNew).post(banner.new);

    app.route('/manage/banner').get(banner.list);

    app.route('/manage/banner/edit/:id').get(banner.renderEdit).post(banner.edit);

    //app.route('/manage/banner/delete/:id').post(banner.delete);

};