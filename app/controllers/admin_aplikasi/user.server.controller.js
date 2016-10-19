var striptags = require('striptags');
var multer  = require('multer');
var moment = require('moment');
const fs = require('fs');
var db = require('../../../config/db');
var bcrypt = require('bcryptjs');

function Todo() {

this.VerifikasiUser = function(req, res, next) {
     db.acquire(function(err,con){
            con.query('UPDATE user SET status="1" WHERE id_user=?',req.params.id,function(err){
              con.release();
                if (err) {
                    req.flash('error', err.errors);
                    return res.redirect('/admin-aplikasi');
                }
                else {
                    con.query('SELECT * FROM user WHERE id_user=?',req.params.id,function(err,data){
                        data.forEach(function(data) {
                            var message = 'User '+data.nama+' Berhasil di Verifikasi';
                            req.flash('success', message);
                            if(req.params.user === "Odha"){
                                return res.redirect('/admin-aplikasi/user1');
                            }else{
                                 return res.redirect('/admin-aplikasi/user2');
                            }
                        });
                    });
                }
            });
        });
};

this.delete = function(req, res, next) {
     db.acquire(function(err,con){
        var id_user = req.params.id;
        con.query('SELECT * FROM user WHERE id_user='+id_user,function(errselect,data){
          con.release();
            con.query('DELETE FROM user WHERE id_user=?',id_user,function(err){
                if(err){
                    var message = err;
                    req.flash('error', message);
                    if(req.params.user === "odha"){
                        return res.redirect('/admin-aplikasi/user1');
                    }else{
                        return res.redirect('/admin-aplikasi/user2');
                    }
                }else{
                    data.forEach(function(data){
                        var message = "User "+data.nama+" Berhasil Dihapus.";
                        req.flash('success', message);
                        if(req.params.user === "odha"){
                            return res.redirect('/admin-aplikasi/user1');
                        }else{
                            return res.redirect('/admin-aplikasi/user2');
                        }
                    });
                }
            });
        });
    });
};

this.listodha = function(req, res, next) {
     db.acquire(function(err,con){
        con.query('SELECT * FROM user WHERE jenis_user="Odha"',function(err,odha){
          con.release();
            if (err) {
                return next(err);
            } else {
                res.render('pages/admin_aplikasi/odha/index', {
                    title: 'Data User',
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
          return res.redirect('/admin-aplikasi/user2/add');
        });
      });
    });
};

this.deleteso = function(req, res, next) {
    db.acquire(function(err,con){
      con.query('DELETE FROM user WHERE id_user='+req.params.id,function(err,result){
        if (err)
           return next(err);

        if(!result.affectedRows){
          var message = "User tidak ditemukan.";
          req.flash('error', message);
          return res.redirect('/admin-aplikasi/user2');
        }

        con.query('DELETE FROM sahabat_odha WHERE id_user='+req.params.id,function(err,result2){
          var message = "Sahabat Odha Berhasil Dihapus.";
          req.flash('success', message);
          return res.redirect('/admin-aplikasi/user2');
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
