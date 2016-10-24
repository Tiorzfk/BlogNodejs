var index = require('../controllers/index.server.controller');

module.exports = {
  configure: function(app) {
    app.get('/', index.render);

    app.get('/post/:year/:slug/:id', index.detailposting);

    app.get('/event/:year/:slug/:id', index.detailevent);

    app.get('/artikel', index.artikel);

    app.get('/berita', index.berita);

    app.get('/event', index.event);

    app.get('/about', index.about);

    //app.get('/contact', index.about);
  }
};
