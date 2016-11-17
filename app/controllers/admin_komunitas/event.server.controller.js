var striptags = require('striptags'),
    multer  = require('multer'),
    moment = require('moment'),
    db = require('../../../config/db'),
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
function Todo() {
this.renderNew = function(req, res, next) {
    var now = moment().format('DD/MM/YYYY');
    db.acquire(function(err,con){
            con.query('SELECT * FROM kategori ',function(err, kategori){
              con.release();
                res.render('pages/admin_komunitas/event/new', {
                    title: 'Tambah Event',
                    now:now,
                    messages_errors: req.flash('error'),
                    messages_success: req.flash('success'),
                    email: req.user ? req.user.email : '',
                    jenis: req.user ? req.user.jenis_admin : '',
                    kategori: kategori,
                });
            });
    });
};

this.new = function(req, res, next) {
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

        if(req.body.isi.length<30){
        req.flash('error', 'Maaf, Deskripsi yang anda masukan tidak boleh kurang dari 30.');
        return res.redirect('/admin-komunitas/event/new');
        }
        var now = moment().format('DD MMMM YYYY');
        var tgl_mulai = moment(req.body.tgl_mulai, 'DD/MM/YYYY').format('DD MMMM YYYY');
        var tgl_berakhir = moment(req.body.tgl_berakhir, 'DD/MM/YYYY').format('DD MMMM YYYY');
        geocoder.geocode(req.body.posisi, function(err, result) {
            var data = {
                id_admin: req.user.id_admin,
                nama: req.body.nama,
                tempat: req.body.tempat,
                deskripsi: req.body.isi,
                status: "0",
                foto: req.file.filename,
                tgl_posting: now,
                tgl_mulai: tgl_mulai+' '+req.body.waktu_mulai,
                tgl_berakhir: tgl_berakhir+' '+req.body.waktu_berakhir,
                latitude: result[0].latitude,
                longitude: result[0].longitude,
                kontak_person: req.body.kontak_person
            }
            db.acquire(function(err,con){
            con.query('INSERT INTO event SET ? ',data,function(err){
              con.release();
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
    });
};

this.renderEdit = function(req, res, next) {
    db.acquire(function(err,con){
            con.query('SELECT * FROM event WHERE id_event=?',req.params.id,function(err,event){
              con.release();
                if (err) {
                    return next(err);
                } else {
                    event.forEach(function(data){
                        var tgl_mulai = moment(data.tgl_mulai, 'D MMMM YYYY').format('DD/MM/YYYY');
                        var waktu_mulai = data.tgl_mulai.substring(16);
                        var tgl_berakhir = moment(data.tgl_berakhir, 'D MMMM YYYY').format('DD/MM/YYYY');
                        var waktu_berakhir = data.tgl_berakhir.substring(16);
                        geocoder.reverse({lat:data.latitude, lon:data.longitude}, function(err, result) {
                            res.render('pages/admin_komunitas/event/edit', {
                                title: 'Edit Event',
                                event: data,
                                tgl_mulai:tgl_mulai,
                                waktu_mulai:waktu_mulai,
                                tgl_berakhir:tgl_berakhir,
                                waktu_berakhir:waktu_berakhir,
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
    });
};

this.edit = function(req, res, next) {
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

        if(req.body.isi.length<30){
            if(req.file != null){
               fs.unlink('public/uploads/img/event/'+data.foto);
            }
            req.flash('error', 'Maaf, Deskripsi yang anda masukan tidak boleh kurang dari 30.');
            return res.redirect('/admin-komunitas/event/new');
        }
        var tgl_mulai = moment(req.body.tgl_mulai, 'DD/MM/YYYY').format('DD MMMM YYYY');
        var tgl_berakhir = moment(req.body.tgl_berakhir, 'DD/MM/YYYY').format('DD MMMM YYYY');
        geocoder.geocode(req.body.posisi, function(err, result) {

            var data = {
                nama: req.body.nama,
                tempat: req.body.tempat,
                deskripsi: req.body.isi,
                foto: req.body.img_old,
                tgl_mulai: tgl_mulai+' '+req.body.waktu_mulai,
                tgl_berakhir: tgl_berakhir+' '+req.body.waktu_berakhir,
                latitude: result[0].latitude,
                longitude: result[0].longitude,
                kontak_person: req.body.kontak_person
            };
            if(req.file) {
                data.foto = req.file.filename;
            };
            db.acquire(function(err,con){
            con.query('UPDATE event SET ? WHERE id_event='+req.params.id,data,function(err){
              con.release();
                if (err) {
                    if(req.file){
                        fs.unlink('public/uploads/img/event/'+req.file.filename);
                    }
                    res.json(err);
                }
                else {
                    if(req.file != null){
                        fs.unlink('public/uploads/img/event/'+req.body.img_old);
                    }
                    var message = 'Data Event Berhasil Diubah';
                    req.flash('success', message);
                    return res.redirect('/admin-komunitas/event');
                }
            });
            });
        });
    });
};

this.delete = function(req, res, next) {
    db.acquire(function(err,con){
            var id_event = req.params.id;
            con.query('SELECT * FROM event WHERE id_event='+id_event,function(errselect,data){
              con.release();
                con.query('DELETE FROM event WHERE id_event=?',id_event,function(err){
                    if(err){
                        req.flash('error', err);
                        return res.redirect('/admin-komunitas/event');
                    }else{
                        if(data[0].foto){
                            fs.unlink('public/uploads/img/event/'+data[0].foto);
                        }
                        req.flash('success', 'Berhasil Dihapus.');
                        return res.redirect('/admin-komunitas/event');
                    }
                });
            });
    });
};

this.list = function(req, res, next) {
    db.acquire(function(err,con){
            con.query('SELECT * FROM event ORDER BY tgl_posting',function(err,event){
              con.release();
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
    });
};

this.mylist = function(req, res, next) {
    db.acquire(function(err,con){
            con.query('SELECT * FROM event WHERE id_admin = ?',req.user.id_admin,function(err,event){
              con.release();
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
    });
};

this.detail = function(req, res, next) {
    db.acquire(function(err,con){
            con.query('SELECT foto,event.nama,tempat,tgl_mulai,tgl_berakhir,tgl_posting,deskripsi,latitude,longitude,admin.nama as pengirim FROM event INNER JOIN admin on admin.id_admin=event.id_admin WHERE event.id_event = ?',req.params.id,function(err,event){
              con.release();
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
    });
};
}
module.exports = new Todo();
