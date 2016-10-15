var striptags = require('striptags');
var multer  = require('multer');
var moment = require('moment');
const fs = require('fs');
var db = require('../../../config/db');

function Todo() {
this.VerifikasiTweet = function(req, res, next) {
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
                                var message = 'Artikel dengan judul '+data.judul+' Berhasil di Verifikasi';
                                req.flash('success', message);
                                return res.redirect('/admin-aplikasi/artikel');
                            }else{
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
this.listtweets = function(req, res, next) {
        db.acquire(function(err,con){
            con.query('SELECT id,status,screen_name,text,klasifikasi FROM tweet_support WHERE status="baru"',function(err,berita){
              con.release();
                if (err) {
                    return next(err);
                } else {
                    res.render('pages/admin_aplikasi/tweet/index', {
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
this.listtweetsverifiy = function(req, res, next) {
        db.acquire(function(err,con){
            con.query('SELECT id,status,screen_name,text,klasifikasi FROM tweet_support WHERE status="vertifikasi"',function(err,berita){
              con.release();
                if (err) {
                    return next(err);
                } else {
                    res.render('pages/admin_aplikasi/tweet/index', {
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
}
module.exports = new Todo();
