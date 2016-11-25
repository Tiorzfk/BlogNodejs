var index = require('../controllers/index.server.controller');
var cektokenemail = require('../../config/cektokenemail');

module.exports = {
  configure: function(app) {
    app.get('/', index.render);

    app.get('/post/:year/:slug/:id', index.detailposting);

    app.get('/event/:year/:slug/:id', index.detailevent);

    app.get('/artikel', index.artikel);

    app.get('/berita', index.berita);

    app.get('/event', index.event);

    app.get('/about', index.about);

    app.post('/user/sahabatberbagi/form',cektokenemail.cektoken, index.formSahabatBerbagi);

    //app.get('/contact', index.about);
  }
};
