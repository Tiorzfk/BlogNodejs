var db = require('../../config/db');

function Todo() {

  this.render = function(req, res, next) {

      res.render('pages/daftarPremium', {
          title: 'Halaman Daftar User Premium',
      });

  };
}
module.exports = new Todo();
