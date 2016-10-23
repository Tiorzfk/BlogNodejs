var db = require('../../../config/db');
var dbsms = require('../../../config/dbsms');
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
            console.log('Sedang Mengirim...');
            setTimeout(function(){
              req.flash('success', 'Done.');
              return res.redirect('/admin-aplikasi/kirim-sms');
            },30000);
          });

        });
    });
};
this.index = function(req, res, next) {
  dbsms.acquire(function(err,con){
    con.release();
      con.query('SELECT SendingDateTime,DestinationNumber,TextDecoded,status FROM sentitems ORDER BY id DESC',function(err,data){
        res.render('pages/admin_aplikasi/sms/index', {
            title: 'Halaman Admin Aplikasi',
            data:data,
            email: req.user ? req.user.email : '',
            jenis: req.user ? req.user.jenis_admin : '',
            messages_errors: req.flash('error'),
            messages_success: req.flash('success')
        });
      });
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
