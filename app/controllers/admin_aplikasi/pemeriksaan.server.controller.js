var moment = require('moment');
const fs = require('fs');
var DB = require('../../../config/db').DB;

exports.renderNew = function(req, res, next) {
    if (req.user) {
        if (req.user.jenis_admin === 'admin aplikasi') { 
            res.render('pages/admin_aplikasi/lokasi_pemeriksaan/new', {
                title: 'Halaman Tambah Lokasi Pemeriksaan',
                email: req.user ? req.user.email : '',
                jenis: req.user ? req.user.jenis_admin : '',
                messages_errors: req.flash('error'),
                messages_success: req.flash('success')
            });
        } else {
            res.redirect('/admin-komunitas');
        }
    }
    else {
       return res.redirect('/admin/login');
    }
};

exports.new = function(req, res, next) {
    var message = null;

    geocoder.geocode(req.body.posisi, function(err, result) {
        var data = {
            id_admin: req.user.id_admin,
            nama: req.body.nama,
            latitude: result[0].latitude,
            longitude: result[0].longitude
        }
        DB.query('INSERT INTO lokasi_pemeriksaan SET ? ',data,function(err){
            //error simpan ke database
            if (err) {
                console.log(err);
                //req.flash('error', err.errors);
                //return res.redirect('/admin-komunitas/event/new');
            }
            var message = 'Berhasil';
            req.flash('success', message);
            return res.redirect('/admin-aplikasi/lokasi-pemeriksaan/new');
        });
    });
};

exports.listpemeriksaan = function(req, res, next) {
    if (req.user) {
        if (req.user.jenis_admin === 'admin aplikasi') { 
            DB.query('SELECT lokasi_pemeriksaan.nama,admin.nama as pengirim FROM lokasi_pemeriksaan INNER JOIN admin on admin.id_admin=lokasi_pemeriksaan.id_admin',function(err,pemeriksaan){
                if (err) {
                    return next(err);
                } else {
                    res.render('pages/admin_aplikasi/lokasi_pemeriksaan/index', {
                        title: 'Data Lokasi Pemeriksaan',
                        pemeriksaan: pemeriksaan,
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