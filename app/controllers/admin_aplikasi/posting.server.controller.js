var striptags = require('striptags');
var multer  = require('multer');
var moment = require('moment');
const fs = require('fs');
var db = require('../../../config/db');
var Pusher = require('pusher');
var pusher = new Pusher({
  appId: '259913',
  key: '1bba48d795f7e899c4d0',
  secret: '0826f796c436807884b2'
});

function Todo() {
this.VerifikasiPosting = function(req, res, next) {
        db.acquire(function(err,con){
            con.query('UPDATE posting SET status="1" WHERE id_posting=?',req.params.id,function(err){
              con.release();
                if (err) {
                    req.flash('error', err.errors);
                    return res.redirect('/admin-aplikasi');
                }
                else {
                    con.query('SELECT * FROM posting WHERE id_posting=?',req.params.id,function(err,data){
                        data.forEach(function(data) {
                            if(req.params.kategori === "Artikel"){
                                var arrayisi = striptags(data.deskripsi).split(' ');
                                var notifbody = arrayisi.slice(0,5);
                                // pusher.notify(['posting'], {
                                //   fcm: {
                                //       notification: {
                                //           'title': data.judul,
                                //           'body': notifbody.join(' '),
                                //           'icon':  'comrade.png'
                                //       }
                                //   }
                                // });
                                var message = 'Artikel dengan judul '+data.judul+' Berhasil di Verifikasi';
                                req.flash('success', message);
                                return res.redirect('/admin-aplikasi/artikel');
                            }else{
                                var arrayisi = striptags(data.deskripsi).split(' ');
                                var notifbody = arrayisi.slice(0,5);
                                // pusher.notify(['posting'], {
                                //   fcm: {
                                //       notification: {
                                //           'title': data.judul,
                                //           'body': notifbody.join(' '),
                                //           'icon':  'comrade.png'
                                //       }
                                //   }
                                // });

                                var message = 'Berita dengan judul '+data.judul+' Berhasil di Verifikasi';
                                req.flash('success', message);
                                return res.redirect('/admin-aplikasi/berita');
                            }
                        });
                    });
                }
            });
          });
};
this.listberita = function(req, res, next) {
        db.acquire(function(err,con){
            con.query('SELECT id_posting,kategori.nama as kategori,judul,deskripsi,status,tgl_posting FROM posting INNER JOIN kategori on kategori.id_kategori=posting.id_kategori WHERE kategori.nama="Berita"',function(err,berita){
              con.release();
                if (err) {
                    return next(err);
                } else {
                    res.render('pages/admin_aplikasi/berita/index', {
                        title: 'Data Berita',
                        berita: berita,
                        email: req.user ? req.user.email : '',
                        jenis: req.user ? req.user.jenis_admin : '',
                        messages_errors: req.flash('error'),
                        messages_success: req.flash('success')
                    });
                }
            });
          });
};
this.listartikel = function(req, res, next) {
        db.acquire(function(err,con){
            con.query('SELECT id_posting,kategori.nama as kategori,judul,deskripsi,status,tgl_posting FROM posting INNER JOIN kategori on kategori.id_kategori=posting.id_kategori WHERE kategori.nama="Artikel"',function(err,artikel){
              con.release();
                if (err) {
                    return next(err);
                } else {
                    res.render('pages/admin_aplikasi/artikel/index', {
                        title: 'Data Artikel',
                        artikel: artikel,
                        email: req.user ? req.user.email : '',
                        jenis: req.user ? req.user.jenis_admin : '',
                        messages_errors: req.flash('error'),
                        messages_success: req.flash('success')
                    });
                }
            });
        });
};
}
module.exports = new Todo();
