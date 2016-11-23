var index = require('../controllers/user_premium.server.controller');

module.exports = {
  configure: function(app) {

    app.get('/user/daftarPremium', index.render);

  }
};
