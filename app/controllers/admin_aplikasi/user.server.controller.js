var striptags = require('striptags');
var multer  = require('multer');
var moment = require('moment');
const fs = require('fs');
var db = require('../../../config/db');
var bcrypt = require('bcryptjs');

function Todo() {

this.verifikasiOdha = function(req, res, next) {
     db.acquire(function(err,con){
       con.query('DELETE FROM recommend WHERE id_recommend='+req.params.id_recommend,function(err){
            con.query('UPDATE user SET jenis_user="Odha" WHERE id_user='+req.params.id_user,function(err){
              con.release();
                if (err) {
                    req.flash('error', err.errors);
                    return res.redirect('/admin-aplikasi/recommend-odha');
                }
                else {
                    con.query('SELECT * FROM user WHERE id_user=?',req.params.id_user,function(err,data){
                       var message = 'User '+data[0].nama+' Berhasil menjadi odha';
                       req.flash('success', message);

                       res.redirect('/admin-aplikasi/recommend-odha');
                    });
                }
            });
        });
      });
};

this.recommendlist = function(req, res, next) {
     db.acquire(function(err,con){
        con.query('SELECT recommend.id_user,id_recommend,us.nama as perecommend,uu.nama as user,pesan FROM recommend INNER JOIN user as us on us.id_user=recommend.id_sahabatodha INNER JOIN user as uu on uu.id_user=recommend.id_user',function(err,odha){
          con.release();
            if (err) {
                return next(err);
            } else {
                res.render('pages/admin_aplikasi/recommend-odha/index', {
                    title: 'Data Verifikasi User Odha',
                    odha: odha,
                    email: req.user ? req.user.email : '',
                    jenis: req.user ? req.user.jenis_admin : '',
                    messages_errors: req.flash('error'),
                    messages_success: req.flash('success')
                });
            }
        });
    });
};
this.detailRecommend = function(req, res, next) {
     db.acquire(function(err,con){
        con.query('SELECT us.nama as perecommend,us.email as sa_email,us.jk as sa_jk,us.telp as sa_telp,us.tgl_lahir as sa_tgl_lahir,us.foto as sa_foto,sahabat_odha.komunitas,sahabat_odha.about_sahabatodha,uu.nama as user,uu.email,uu.jk,uu.telp,uu.tgl_lahir,uu.foto,pesan FROM recommend INNER JOIN user as us on us.id_user=recommend.id_sahabatodha INNER JOIN sahabat_odha on sahabat_odha.id_user=recommend.id_sahabatodha INNER JOIN user as uu on uu.id_user=recommend.id_user WHERE id_recommend='+req.params.id,function(err,data){
          con.release();
            if (err) {
                return next(err);
            } else {
                res.render('pages/admin_aplikasi/recommend-odha/detail', {
                    title: 'Data Detail Verifikasi User Odha',
                    data: data,
                    email: req.user ? req.user.email : '',
                    jenis: req.user ? req.user.jenis_admin : '',
                    messages_errors: req.flash('error'),
                    messages_success: req.flash('success')
                });
            }
        });
    });
};

this.addso = function(req, res, next) {
    res.render('pages/admin_aplikasi/sahabat_odha/new', {
        title: 'Data Sahabat Odha',
        email: req.user ? req.user.email : '',
        jenis: req.user ? req.user.jenis_admin : '',
        messages_errors: req.flash('error'),
        messages_success: req.flash('success')
      });
};

this.simpanso = function(req, res, next) {
    var data = {
      nama : req.body.nama,
      email : req.body.email,
      password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(8), null),
      jenis_user: 'Sahabat Odha'
    }
    db.acquire(function(err,con){
      con.query('INSERT INTO user SET ? ',data,function(err,result){
        if (err)
           return next(err);

        var data2 = {
          id_user : result.insertId
        }
        con.query('INSERT INTO sahabat_odha SET ? ',data2,function(err,result2){
          var message = "User Berhasil Dibuat.";
          req.flash('success', message);
          return res.redirect('/admin-aplikasi/sahabat-odha/add');
        });
      });
    });
};

this.deleteso = function(req, res, next) {
    db.acquire(function(err,con){
      con.query('DELETE FROM user WHERE id_user='+req.params.id,function(err,result){
        con.release();
        if (err)
           return next(err);

        if(!result.affectedRows){
          var message = "User tidak ditemukan.";
          req.flash('error', message);
          return res.redirect('/admin-aplikasi/sahabat-odha');
        }

        con.query('DELETE FROM sahabat_odha WHERE id_user='+req.params.id,function(err,result2){
          var message = "Sahabat Odha Berhasil Dihapus.";
          req.flash('success', message);
          return res.redirect('/admin-aplikasi/sahabat-odha');
        });
      });
    });
};

this.listsaodha = function(req, res, next) {
     db.acquire(function(err,con){
        con.query('SELECT * FROM user WHERE jenis_user="Sahabat Odha"',function(err,saodha){
          con.release();
            if (err) {
                return next(err);
            } else {
                res.render('pages/admin_aplikasi/sahabat_odha/index', {
                    title: 'Data Sahabat Odha',
                    saodha: saodha,
                    email: req.user ? req.user.email : '',
                    jenis: req.user ? req.user.jenis_admin : '',
                    messages_errors: req.flash('error'),
                    messages_success: req.flash('success')
                });
            }
        });
    });
};
};
module.exports = new Todo();
