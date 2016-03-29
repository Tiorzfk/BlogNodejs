var striptags = require('striptags');
var multer  = require('multer');
var moment = require('moment');
const fs = require('fs');
var DB = require('../../../config/db').DB;

exports.VerifikasiPosting = function(req, res, next) {
    if (req.user) {
        if (req.user.jenis_admin === 'admin aplikasi') { 
            DB.query('UPDATE posting SET status="1" WHERE id_posting=?',req.params.id,function(err){
                if (err) {
                    req.flash('error', err.errors);
                    return res.redirect('/admin-aplikasi');
                }
                else {
                    DB.query('SELECT * FROM posting WHERE id_posting=?',req.params.id,function(err,data){
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
        } else {
            res.redirect('/admin-komunitas');
        }
    }
    else {
        return res.redirect('/admin/login');
    }
};
exports.listberita = function(req, res, next) {
    if (req.user) {
        if (req.user.jenis_admin === 'admin aplikasi') { 
            DB.query('SELECT id_posting,kategori.nama as kategori,judul,deskripsi,status,tgl_posting FROM posting INNER JOIN kategori on kategori.id_kategori=posting.id_kategori WHERE kategori.nama="Berita"',function(err,berita){
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
        } else {
            res.redirect('/admin-komunitas');
        }
    } else {
        return res.redirect('/admin/login');
    }
};
exports.listartikel = function(req, res, next) {
    if (req.user) {
        if (req.user.jenis_admin === 'admin aplikasi') { 
            DB.query('SELECT id_posting,kategori.nama as kategori,judul,deskripsi,status,tgl_posting FROM posting INNER JOIN kategori on kategori.id_kategori=posting.id_kategori WHERE kategori.nama="Artikel"',function(err,artikel){
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
        } else {
            res.redirect('/admin-komunitas');
        }
    } else {
        return res.redirect('/admin/login');
    }
};