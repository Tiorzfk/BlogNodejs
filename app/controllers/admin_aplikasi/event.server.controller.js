var striptags = require('striptags'),
    multer  = require('multer'),
    moment = require('moment'),
    db = require('../../../config/db'),
    gmAPI = require('../../../config/maps').gmAPI,
    geocoderProvider = 'google',
    httpAdapter = 'https';

const fs = require('fs');

var extra = {
    apiKey: 'AIzaSyDjE5MTfUt5RYaEdA_I_PVvaQJlkro5e80',
    formatter: null
};

var geocoder = require('node-geocoder')(geocoderProvider, httpAdapter, extra);

function Todo() {
this.VerifikasiEvent = function(req, res, next) {
        db.acquire(function(err,con){
            con.query('UPDATE event SET status="1" WHERE id_event=?',req.params.id,function(err){
              con.release();
                if (err) {
                    req.flash('error', err.errors);
                    return res.redirect('/admin-aplikasi/event');
                }
                else {
                db.query('SELECT * FROM event WHERE id_event=?',req.params.id,function(err,data){
                    data.forEach(function(data) {
                        var message = 'Event '+data.nama+' Berhasil di Verifikasi';
                        req.flash('success', message);
                        return res.redirect('/admin-aplikasi/event');
                    });
                });
                }
            });
        });
};
this.listevent = function(req, res, next) {
        db.acquire(function(err,con){
            con.query('SELECT * FROM event ORDER BY tgl_posting DESC',function(err,event){
              con.release();
                if (err) {
                    return next(err);
                } else {
                    res.render('pages/admin_aplikasi/event/index', {
                        title: 'Data Event',
                        event: event,
                        striptags: striptags,
                        messages_errors: req.flash('error'),
                        messages_success: req.flash('success'),
                        email: req.user ? req.user.email : '',
                        jenis: req.user ? req.user.jenis_admin : ''
                    });
                }
            });
        });
};
this.detail = function(req, res, next) {
        db.acquire(function(err,con){
            con.query('SELECT foto,event.nama,tgl_mulai,tgl_berakhir,tgl_posting,deskripsi,latitude,longitude,admin.nama as pengirim FROM event INNER JOIN admin on admin.id_admin=event.id_admin WHERE event.id_event = ?',req.params.id,function(err,event){
              con.release();
                if (err) {
                    console.log(err);
                } else {
                    event.forEach(function(data){
                        geocoder.reverse({lat:data.latitude, lon:data.longitude}, function(err, result) {
                                res.render('pages/admin_aplikasi/event/detail', {
                                    title: 'Detail Event',
                                    event: data,
                                    results: result,
                                    gmAPI: gmAPI,
                                    geocoder: geocoder,
                                    email: req.user ? req.user.email : '',
                                    jenis: req.user ? req.user.jenis_admin : ''
                                });
                        });
                    });
                }
            });
          });
};

this.delete = function(req, res, next) {
  var id_event = req.params.id;
  db.acquire(function(err,con){
    con.query('SELECT * FROM event WHERE id_event='+id_event,function(errselect,data){
      con.release();
        con.query('DELETE FROM event WHERE id_event=?',id_event,function(err){
            if(err){
                var message = err;
                req.flash('error', message);
                return res.redirect('/admin-aplikasi/event');
            }else{
                data.forEach(function(data){
                    if(data.foto){
                        fs.unlink('public/uploads/img/event/'+data.foto);
                    }
                    var message = 'Event "'+data.nama+'" Berhasil Dihapus.';
                    req.flash('success', message);
                    return res.redirect('/admin-aplikasi/event');
                });
            }
        });
    });
  });
};
}
module.exports = new Todo();
