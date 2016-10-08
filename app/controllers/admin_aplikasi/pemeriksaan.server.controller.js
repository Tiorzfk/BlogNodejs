var moment = require('moment');
const fs = require('fs');
var db = require('../../../config/db');
var geocoder = require('../../../config/geocoder').geocoder;
var gmAPI = require('../../../config/maps').gmAPI; //menghasilkan google maps dalam bentuk png

function Todo() {
this.renderNew = function(req, res, next) {

            res.render('pages/admin_aplikasi/lokasi_pemeriksaan/new', {
                title: 'Halaman Tambah Lokasi Pemeriksaan',
                email: req.user ? req.user.email : '',
                jenis: req.user ? req.user.jenis_admin : '',
                messages_errors: req.flash('error'),
                messages_success: req.flash('success')
            });

};

this.new = function(req, res, next) {
    var message = null;

    geocoder.geocode(req.body.posisi, function(err, result) {
        var data = {
            id_admin: req.user.id_admin,
            nama: req.body.nama,
            latitude: result[0].latitude,
            longitude: result[0].longitude
        }
        db.acquire(function(err,con){
          con.query('INSERT INTO lokasi_pemeriksaan SET ? ',data,function(err){
            con.release();
              //error simpan ke database
              if (err) {
                  console.log(err);
                  //req.flash('error', err.errors);
                  //return res.redirect('/admin-komunitas/event/new');
                }
                var message = 'Data Berhasil Ditambahkan.';
                req.flash('success', message);
                return res.redirect('/admin-aplikasi/lokasi-pemeriksaan/new');
          });
        });
    });
};

this.listpemeriksaan = function(req, res, next) {
        db.acquire(function(err,con){
            con.query('SELECT id_lokasi,lokasi_pemeriksaan.nama,admin.nama as pengirim FROM lokasi_pemeriksaan INNER JOIN admin on admin.id_admin=lokasi_pemeriksaan.id_admin',function(err,pemeriksaan){
              con.release();
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
        });
};

this.detail = function(req, res, next) {
        db.acquire(function(err,con){
            con.query('SELECT lokasi_pemeriksaan.nama,latitude,longitude,admin.nama as pengirim FROM lokasi_pemeriksaan INNER JOIN admin on admin.id_admin=lokasi_pemeriksaan.id_admin WHERE lokasi_pemeriksaan.id_lokasi = ?',req.params.id,function(err,lp){
              con.release();
                if (err) {
                    console.log(err);
                } else {
                    lp.forEach(function(data){
                        geocoder.reverse({lat:data.latitude, lon:data.longitude}, function(err, result) {
                            res.render('pages/admin_aplikasi/lokasi_pemeriksaan/detail', {
                                title: 'Detail Lokasi Pemeriksaan',
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
        });
};

this.delete = function(req, res, next) {

      var id_lokasi = req.params.id;
      db.acquire(function(err,con){
            con.query('SELECT * FROM lokasi_pemeriksaan WHERE id_lokasi='+id_lokasi,function(errselect,data){
              con.release();
                con.query('DELETE FROM lokasi_pemeriksaan WHERE id_lokasi=?',id_lokasi,function(err){
                    if(err){
                        var message = err;
                        req.flash('error', message);
                        return res.redirect('/admin-aplikasi/lokasi-pemeriksaan');
                    }else{
                        data.forEach(function(data){
                            var message = "Lokasi "+data.nama+" Berhasil Dihapus.";
                            req.flash('success', message);
                            return res.redirect('/admin-aplikasi/lokasi-pemeriksaan');
                        });
                    }
                });
            });
      });

};

this.renderEdit = function(req, res, next) {
        db.acquire(function(err,con){
            con.query('SELECT * FROM lokasi_pemeriksaan WHERE id_lokasi=?',req.params.id,function(err,lokasi){
              con.release();
                lokasi.forEach(function(data){
                    geocoder.reverse({lat:data.latitude, lon:data.longitude}, function(err, result) {
                        res.render('pages/admin_aplikasi/lokasi_pemeriksaan/edit', {
                            title: 'Halaman Edit Lokasi Pemeriksaan',
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
        });
};

this.edit = function(req, res, next) {
    geocoder.geocode(req.body.posisi, function(err, result) {
        var data = {
            nama: req.body.nama,
            latitude: result[0].latitude,
            longitude: result[0].longitude
        }
        var id_lokasi = req.params.id;
        db.acquire(function(err,con){
          db.query('UPDATE lokasi_pemeriksaan SET ? WHERE id_lokasi='+id_lokasi,data,function(err){
            if (err) {
                console.log(err);
                //req.flash('error', err.errors);
                //return res.redirect('/admin-komunitas/event/new');
            }
                var message = 'Data Lokasi Pemeriksaan Berhasil Diubah.';
                req.flash('success', message);
                return res.redirect('/admin-aplikasi/lokasi-pemeriksaan');
          });
        });
    });
};
}
module.exports = new Todo();
