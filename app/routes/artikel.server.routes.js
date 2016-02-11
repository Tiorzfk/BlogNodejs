var artikel = require('../controllers/artikel.server.controller');

module.exports = function(app) {

    app.route('/manage').get(artikel.renderIndex);

    app.route('/manage/artikel/new').get(artikel.renderNew).post(artikel.new);

    app.route('/manage/artikel').get(artikel.list);

    app.route('/manage/my-artikel').get(artikel.mylist);

    app.route('/manage/my-artikel/edit/:id').get(artikel.renderEdit).post(artikel.edit).delete(artikel.delete);

     app.route('/manage/my-artikel/detail/:id').get(artikel.detail);

    app.route('/manage/my-artikel/delete/:id').get(artikel.delete);

};