var index = require('../controllers/index.server.controller');

module.exports = function(app) {

    app.get('/', index.render);

    app.get('/post/:year/:id/:slug', index.detailposting);

    app.get('/event/:year/:id/:slug', index.detailevent);

    app.get('/artikel', index.artikel);

    app.get('/berita', index.berita);

    app.get('/event', index.event);

    app.get('/testsms', index.testsms);
};