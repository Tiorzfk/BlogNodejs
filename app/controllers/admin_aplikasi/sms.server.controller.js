var db = require('../../../config/db');
var sms = require('../../../config/ggsmsc');

function Todo() {
var datauser = [];
this.kirimSms = function(req, res, next) {
     db.acquire(function(err,con){
       con.release();
        con.query('SELECT * FROM user WHERE nama="Tioreza"',function(err,data){
          data.forEach(function(data){
            datauser.push({
              phone : data.telp,
              ack : false,
              msg : req.body.msg
            });
            sms.kirim(datauser);
            req.flash('success', 'Sms berhasil dikirim.');
            return res.redirect('/admin-aplikasi/kirim-sms');
          });

        });
    });
};
this.index = function(req, res, next) {

  res.render('pages/admin_aplikasi/sms/index', {
      title: 'Halaman Admin Aplikasi',
      email: req.user ? req.user.email : '',
      jenis: req.user ? req.user.jenis_admin : '',
      messages_errors: req.flash('error'),
      messages_success: req.flash('success')
  });

};
this.kirim = function(req, res, next) {

  res.render('pages/admin_aplikasi/sms/kirim', {
      title: 'Halaman Admin Aplikasi',
      email: req.user ? req.user.email : '',
      jenis: req.user ? req.user.jenis_admin : '',
      messages_errors: req.flash('error'),
      messages_success: req.flash('success')
  });

};
};
module.exports = new Todo();
