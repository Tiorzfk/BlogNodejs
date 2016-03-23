var striptags = require('striptags'),
    multer  = require('multer'),
    moment = require('moment'),
    DB = require('../../../config/db').DB,
    gmAPI = require('../../../config/maps').gmAPI, //menghasilkan google maps dalam bentuk png
    geocoderProvider = 'google',
    httpAdapter = 'https';

const fs = require('fs');

var extra = {
    apiKey: 'AIzaSyDjE5MTfUt5RYaEdA_I_PVvaQJlkro5e80',
    formatter: null
};

var geocoder = require('node-geocoder')(geocoderProvider, httpAdapter, extra); //menghasilkan address dari lat dan long

//CRUD

exports.renderNew = function(req, res, next) {
    if (req.user) {
        DB.query('SELECT * FROM kategori ',function(err, kategori){
            res.render('pages/admin_komunitas/event/new', {
                title: 'Tambah Event',
                messages_errors: req.flash('error'),
                messages_success: req.flash('success'),
                email: req.user ? req.user.email : '',
                jenis: req.user ? req.user.jenis_admin : '',
                kategori: kategori,
            });
        });
    }
    else {
        return res.redirect('/admin/login');
    }
};

exports.new = function(req, res, next) {
     var storage = multer.diskStorage({
        destination: function (req, file, callback) {
            callback(null, 'public/uploads/img/event');
        },
        filename: function (req, file, callback) {
            callback(null, Date.now() + '-' + file.originalname);
        }
    });
    var upload = multer({ storage : storage }).single('foto');
    upload(req,res,function(errupload) {
        var message = null;

        var now = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');

        if(req.body.isi.length<30){
        req.flash('error', 'Maaf, Deskripsi yang anda masukan tidak boleh kurang dari 30.');
        return res.redirect('/admin-komunitas/event/new');
        }

        geocoder.geocode(req.body.posisi, function(err, result) {
            var data = {
                id_admin: req.user.id_admin,
                nama: req.body.nama,
                deskripsi: req.body.isi,
                status: "0",
                foto: req.file.filename,
                tgl_posting: now,
                tgl_event: req.body.tgl_event,
                latitude: result[0].latitude,
                longitude: result[0].longitude
            }

            DB.query('INSERT INTO event SET ? ',data,function(err){
                //error simpan ke database
                if (err) {
                    fs.unlink('public/uploads/img/event'+data.foto);
                    console.log(err);
                    //req.flash('error', err.errors);
                    //return res.redirect('/admin-komunitas/event/new');
                }
                var message = 'Berhasil';
                req.flash('success', message);
                return res.redirect('/admin-komunitas/event/new');
            });
        });
    });
};

exports.renderEdit = function(req, res, next) {
    if (req.user) {
        DB.query('SELECT * FROM event WHERE id_event=?',req.params.id,function(err,event){
            if (err) {
                return next(err);
            } else {
                event.forEach(function(data){
                    geocoder.reverse({lat:data.latitude, lon:data.longitude}, function(err, result) {    
                        res.render('pages/admin_komunitas/event/edit', {
                            title: 'Edit Event',
                            event: data,
                            results: result,
                            messages_errors: req.flash('error'),
                            messages_success: req.flash('success'),
                            email: req.user ? req.user.email : '',
                            jenis: req.user ? req.user.jenis_admin : ''
                        });
                    });
                });
            }
        });
    }
    else {
        return res.redirect('/admin/login');
    }
};

exports.edit = function(req, res, next) {
    var storage = multer.diskStorage({
        destination: function (req, file, callback) {
            callback(null, 'public/uploads/img/event');
        },
        filename: function (req, file, callback) {
            callback(null, Date.now() + '-' + file.originalname);
        }
    });
    var upload = multer({ storage : storage }).single('foto');
    upload(req,res,function(errupload) {
        //error upload foto
        if(errupload) {
            return res.end("Error uploading file."+errupload);
        }
        var message = null;

        //res.json(req.file);
        //membuat showmore
        var arrayisi = striptags(req.body.isi).split(' ');
        var slicedesc = arrayisi.slice(0,25);

        if(req.body.isi.length<30){
        req.flash('error', 'Maaf, Deskripsi yang anda masukan tidak boleh kurang dari 30.');
        return res.redirect('/admin-komunitas/event/new');
        }

        geocoder.geocode(req.body.posisi, function(err, result) {

            var data = {
                id_admin: req.user.id_admin,
                nama: req.body.nama,
                deskripsi: slicedesc.join(' '),
                isi: req.body.isi,
                status: "0",
                foto: req.body.img_old,
                tgl_event: req.body.tgl_event,
                latitude: result[0].latitude,
                longitude: result[0].longitude
            };
            if(req.file) {
                data.foto = req.file.filename;
            };
            DB.query('UPDATE event SET ? WHERE id_event='+req.params.id,data,function(err){
                if (err) {
                    if(req.file != null){
                        fs.unlink('public/uploads/img/event/'+data.foto);
                    }
                    res.json(err);
                }
                else {
                    if(req.file != null){
                        fs.unlink('public/uploads/img/event/'+req.body.img_old);
                    }
                    var message = 'Berhasil Diubah';
                    req.flash('success', message);
                    return res.redirect('/admin-komunitas/event');
                }
            });
        });
    });
};

exports.delete = function(req, res, next) {
    var id_event = req.params.id;
    DB.query('SELECT * FROM event WHERE id_event='+id_event,function(errselect,data){
        DB.query('DELETE FROM event WHERE id_event=?',id_event,function(err){
            if(err){
                var message = err;
                req.flash('error', message);
                return res.redirect('/admin-komunitas/event');
            }else{
                data.forEach(function(data){
                    if(data.foto){
                        fs.unlink('public/uploads/img/event/'+data.foto);
                    }
                });
                req.flash('success', message);
                return res.redirect('/admin-komunitas/event');
            }
        });
    });
};

exports.list = function(req, res, next) {
    if (req.user) {
        DB.query('SELECT * FROM event ORDER BY tgl_posting',function(err,event){
            if (err) {
                return next(err);
            } else {
                /*event.forEach(function(posisi){
                    geocoder.reverse({lat:posisi.latitude, lon:posisi.longitude}, function(err, result) {
                        console.log(result);//formattedAddress
                    })
                });*/
                res.render('pages/admin_komunitas/event/index', {
                    title: 'Data Event',
                    event: event,
                    geocoder: geocoder,
                    messages_errors: req.flash('error'),
                    messages_success: req.flash('success'),
                    email: req.user ? req.user.email : '',
                    jenis: req.user ? req.user.jenis_admin : ''
                });
            }
        });
    } else {
        return res.redirect('/admin/login');
    }
};

exports.mylist = function(req, res, next) {
    if (req.user) {
        DB.query('SELECT * FROM event WHERE id_admin = ?',req.user.id_admin,function(err,event){
            if (err) {
                return next(err);
            } else {
                res.render('pages/admin_komunitas/event/mylist', {
                    title: 'Data Event',
                    event: event,
                    messages: req.flash('success'),
                    email: req.user ? req.user.email : '',
                    jenis: req.user ? req.user.jenis_admin : ''
                });
            }
        });
    } else {
        return res.redirect('/admin/login');
    }
};

exports.detail = function(req, res, next) {
    if (req.user) {
        DB.query('SELECT foto,event.nama,tgl_event,tgl_posting,deskripsi,latitude,longitude,admin.nama as pengirim FROM event INNER JOIN admin on admin.id_admin=event.id_admin WHERE event.id_event = ?',req.params.id,function(err,event){
            if (err) {
                console.log(err);
            } else {
                event.forEach(function(data){
                    geocoder.reverse({lat:data.latitude, lon:data.longitude}, function(err, result) {                                 
                            res.render('pages/admin_komunitas/event/detail', {
                                title: 'Detail Event',
                                event: data,
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
        return res.redirect('/admin/login');
    }
};