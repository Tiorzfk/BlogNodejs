var striptags = require('striptags');
var multer  = require('multer');
var moment = require('moment');
const fs = require('fs');
var db = require('../../../config/db');

function Todo() {
this.VerifikasiTweet = function(req, res, next) {
        var data = {
          klasifikasi : req.body.klasifikasi,
          status : 'selesai'
        }
        db.acquire(function(err,con){
            con.query('UPDATE tweet_support SET ? WHERE id_string="'+req.body.id+'"',data,function(err,data){
              con.release();
                if (err){
                    req.flash('error', err.errors);
                    return res.redirect('/admin-aplikasi/tweets');
                }
                if(!data.affectedRows){
                  req.flash('error', 'User not found');
                  return res.redirect('/admin-aplikasi/tweets');
                }
                var message = 'Tweet Berhasil di Verifikasi';
                req.flash('success', message);
                return res.redirect('/admin-aplikasi/tweets');
            });
        });
};
this.UnVerifikasiTweet = function(req, res, next) {
        var data = {
          status : 'vertifikasi'
        }
        db.acquire(function(err,con){
            con.query('UPDATE tweet_support SET ? WHERE id_string="'+req.params.id+'"',data,function(err,data){
              con.release();
                if (err){
                    req.flash('error', err.errors);
                    return res.redirect('/admin-aplikasi/tweets');
                }
                if(!data.affectedRows){
                  req.flash('error', 'User not found');
                  return res.redirect('/admin-aplikasi/tweets');
                }
                var message = 'Tweet Berhasil di Un-Verifikasi';
                req.flash('success', message);
                return res.redirect('/admin-aplikasi/tweets');
            });
        });
};
this.listtweets = function(req, res, next) {
        db.acquire(function(err,con){
            con.query('SELECT id_string,status,screen_name,text,klasifikasi FROM tweet_support WHERE status="vertifikasi" LIMIT 200',function(err,berita){
              con.release();
                if (err) {
                    req.flash('error', err.errors);
                    return res.redirect('/admin-aplikasi/tweets');
                } else {
                    res.render('pages/admin_aplikasi/tweet/index', {
                        title: 'Data Tweets',
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
this.listtweetsen = function(req, res, next) {

                    res.render('pages/admin_aplikasi/tweet/indexEn', {
                        title: 'Data Tweets English',
                        email: req.user ? req.user.email : '',
                        jenis: req.user ? req.user.jenis_admin : ''
                    });

};
this.deletetweets = function(req, res, next) {
        db.acquire(function(err,con){
            con.query('DELETE FROM tweet_support WHERE id_string="'+req.params.id+'"',function(err,berita){
              con.release();
                if (err) {
                    req.flash('error', err.errors);
                    return res.redirect('/admin-aplikasi/tweets');
                }
                var message = 'Tweet Berhasil di Hapus';
                req.flash('success', message);
                return res.redirect('/admin-aplikasi/tweets');
            });
          });
};
this.listtweetsselesai = function(req, res, next) {
        db.acquire(function(err,con){
            con.query('SELECT id_string,status,screen_name,text,klasifikasi FROM tweet_support WHERE status="selesai" LIMIT 200',function(err,berita){
              con.release();
                if (err) {
                    req.flash('error', err.errors);
                    return res.redirect('/admin-aplikasi/tweets');
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
