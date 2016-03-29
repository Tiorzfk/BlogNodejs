var moment = require('moment');
const fs = require('fs');
var DB = require('../../../config/db').DB;
var geocoder = require('../../../config/geocoder').geocoder;
var gmAPI = require('../../../config/maps').gmAPI; //menghasilkan google maps dalam bentuk png

exports.renderNew = function(req, res, next) {
    if (req.user) {
        if (req.user.jenis_admin === 'admin aplikasi') { 
            res.render('pages/admin_aplikasi/lokasi_obat/new', {
                title: 'Halaman Tambah Lokasi Obat',
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
        DB.query('INSERT INTO lokasi_obat SET ? ',data,function(err){
            //error simpan ke database
            if (err) {
                console.log(err);
                //req.flash('error', err.errors);
                //return res.redirect('/admin-komunitas/event/new');
            }
            var message = 'Data Berhasil Ditambahkan.';
            req.flash('success', message);
            return res.redirect('/admin-aplikasi/lokasi-obat/new');
        });
    });
};

exports.listobat = function(req, res, next) {
    if (req.user) {
        if (req.user.jenis_admin === 'admin aplikasi') { 
            DB.query('SELECT id_lokasi,lokasi_obat.nama,admin.nama as pengirim FROM lokasi_obat INNER JOIN admin on admin.id_admin=lokasi_obat.id_admin',function(err,obat){
                if (err) {
                    return next(err);
                } else {
                    res.render('pages/admin_aplikasi/lokasi_obat/index', {
                        title: 'Data Lokasi Obat',
                        obat: obat,
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

exports.detail = function(req, res, next) {
    if (req.user) {
        if (req.user.jenis_admin === 'admin aplikasi') { 
            DB.query('SELECT lokasi_obat.nama,latitude,longitude,admin.nama as pengirim FROM lokasi_obat INNER JOIN admin on admin.id_admin=lokasi_obat.id_admin WHERE lokasi_obat.id_lokasi = ?',req.params.id,function(err,lp){
                if (err) {
                    console.log(err);
                } else {
                    lp.forEach(function(data){
                        geocoder.reverse({lat:data.latitude, lon:data.longitude}, function(err, result) {                                 
                            res.render('pages/admin_aplikasi/lokasi_obat/detail', {
                                title: 'Detail Lokasi Obat',
                                lp: data,
                                results: result,
                                gmAPI: gmAPI,
                                email: req.user ? req.user.email : '',
                                jenis: req.user ? req.user.jenis_admin : ''
                            });
                        });
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

exports.delete = function(req, res, next) {
    if (req.user) {
        if (req.user.jenis_admin === 'admin aplikasi') { 
            var id_lokasi = req.params.id;
            DB.query('SELECT * FROM lokasi_obat WHERE id_lokasi='+id_lokasi,function(errselect,data){
                DB.query('DELETE FROM lokasi_obat WHERE id_lokasi=?',id_lokasi,function(err){
                    if(err){
                        var message = err;
                        req.flash('error', message);
                        return res.redirect('/admin-aplikasi/lokasi-obat');
                    }else{
                        data.forEach(function(data){
                            var message = "Lokasi "+data.nama+" Berhasil Dihapus.";
                            req.flash('success', message);
                            return res.redirect('/admin-aplikasi/lokasi-obat');
                        });
                    }
                });
            });
        } else {
           res.redirect('/admin-komunitas');
        }
    }
    else {
        return res.redirect('/admin/login');
    }
};

exports.renderEdit = function(req, res, next) {
    if (req.user) {
        if (req.user.jenis_admin === 'admin aplikasi') { 
            DB.query('SELECT * FROM lokasi_obat WHERE id_lokasi=?',req.params.id,function(err,lokasi){
                lokasi.forEach(function(data){
                    geocoder.reverse({lat:data.latitude, lon:data.longitude}, function(err, result) {    
                        res.render('pages/admin_aplikasi/lokasi_obat/edit', {
                            title: 'Halaman Edit Lokasi Obat',
                            email: req.user ? req.user.email : '',
                            jenis: req.user ? req.user.jenis_admin : '',
                            data: data,
                            results: result,
                            messages_errors: req.flash('error'),
                            messages_success: req.flash('success')
                        });
                    });
                });
            });
        } else {
            res.redirect('/admin-komunitas');
        }
    }
    else {
       return res.redirect('/admin/login');
    }
};

exports.edit = function(req, res, next) {
    geocoder.geocode(req.body.posisi, function(err, result) {
        var data = {
            nama: req.body.nama,
            latitude: result[0].latitude,
            longitude: result[0].longitude
        }
        var id_lokasi = req.params.id;

        DB.query('UPDATE lokasi_obat SET ? WHERE id_lokasi='+id_lokasi,data,function(err){
            if (err) {
                console.log(err);
                //req.flash('error', err.errors);
                //return res.redirect('/admin-komunitas/event/new');
            }
                var message = 'Data Lokasi Obat Berhasil Diubah.';
                req.flash('success', message);
                return res.redirect('/admin-aplikasi/lokasi-obat');
        });
    });
};