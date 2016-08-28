var striptags = require('striptags');
var multer  = require('multer');
var moment = require('moment');
const fs = require('fs');
var DB = require('../../../config/db').DB;

exports.renderIndex = function(req, res, next) {

                    res.render('pages/admin_komunitas/index', {
                        title: 'Halaman Admin Komunitas',
                        email: req.user ? req.user.email : '',
                        jenis: req.user ? req.user.jenis_admin : ''
                    });

};

//CRUD

exports.renderNew = function(req, res, next) {
    DB.getConnection(function(err,koneksi){
            koneksi.query('SELECT * FROM kategori ',function(err, kategori){
                res.render('pages/admin_komunitas/posting/new', {
                    title: 'Tambah Posting',
                    messages_errors: req.flash('error'),
                    messages_success: req.flash('success'),
                    email: req.user ? req.user.email : '',
                    jenis: req.user ? req.user.jenis_admin : '',
                    kategori: kategori
                });
            koneksi.release();
            });
    });    
};

exports.new = function(req, res, next) {

    var storage = multer.diskStorage({
        destination: function (req, file, callback) {
            callback(null, 'public/uploads/img');
        },
        filename: function (req, file, callback) {
            callback(null, Date.now() + '-' + file.originalname);
        }
    });
    var upload = multer({ storage : storage }).single('foto');
    upload(req,res,function(errupload) {
        /*if(req.body.isi.length<30){
            req.flash('error', 'Maaf, Deskripsi yang anda masukan tidak boleh kurang dari 30.');
            return res.redirect('/admin-komunitas/posting/new');
        }*/
        //error upload foto
        if(errupload) {
            return res.end("Error uploading file."+errupload);
        }
        var message = null;

        //var now = moment(new Date().toISOString().replace(/T/, ' ').replace(/\..+/, ''));
        var now = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')

        //membuat isi untuk deskripsi
        var arrayisi = striptags(req.body.isi).split(' ');
        var sliceisi = arrayisi.slice(0,17);

        var data = {
            id_admin: req.user.id_admin,
            judul: req.body.judul,
            deskripsi: sliceisi.join(' '),
            isi: req.body.isi,
            foto: req.file.filename,
            status: "0",
            tgl_posting: now,
            id_kategori: req.body.kategori
        }
        DB.getConnection(function(err,koneksi){
        koneksi.query('INSERT INTO posting SET ? ',data,function(err){
            //error simpan ke database
            if (err) {
                //res.json(err);
                fs.unlink('public/uploads/img/'+data.foto);
                req.flash('error', err.errors);
                return res.redirect('/admin-komunitas/posting/new');
            }
            var message = 'Berhasil';
            req.flash('success', message);
            return res.redirect('/admin-komunitas/posting/new');
        });
        koneksi.release();
        });
    });
};

exports.renderEdit = function(req, res, next) {
    DB.getConnection(function(err,koneksi){
            koneksi.query('SELECT * FROM posting LEFT JOIN kategori on kategori.id_kategori=posting.id_kategori WHERE id_posting=?',req.params.id,function(err,articles){
                if (err) {
                    return next(err);
                } else {
                    articles.forEach(function(data){
                        res.render('pages/admin_komunitas/posting/edit', {
                            title: 'Edit',
                            artikel: data,
                            messages_errors: req.flash('error'),
                            messages_success: req.flash('success'),
                            email: req.user ? req.user.email : '',
                            jenis: req.user ? req.user.jenis_admin : ''
                        });
                    });
                }
            });
            koneksi.release();
    });
};

exports.edit = function(req, res, next) {
    var storage = multer.diskStorage({
        destination: function (req, file, callback) {
            callback(null, 'public/uploads/img');
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
        var sliceisi = arrayisi.slice(0,25);

        var data = {
            judul: req.body.judul,
            deskripsi: sliceisi.join(' '),
            isi: req.body.isi,
            foto: req.body.img_old
        }

        if(req.file) {
            data = {
                judul: req.body.judul,
                deskripsi: sliceisi.join(' '),
                isi: req.body.isi,
                foto: req.file.filename
            }
        }
        DB.getConnection(function(err,koneksi){
        koneksi.query('UPDATE posting SET ? WHERE id_posting='+req.params.id,data,function(err){
            if (err) {
                if(req.file != null){
                    fs.unlink('public/uploads/img/'+data.foto);
                }
                res.json(err);
            }
            else {
                if(req.file != null){
                    fs.unlink('public/uploads/img/'+req.body.img_old);
                }
                var message = 'Berhasil Diubah';
                req.flash('success', message);
                return res.redirect('/admin-komunitas/posting');
            }
        });
        koneksi.release();
        });
    });
};

exports.delete = function(req, res, next) {
    var id_posting = req.params.id;
    DB.getConnection(function(err,koneksi){
    koneksi.query('SELECT * FROM posting WHERE id_posting='+id_posting,function(errselect,data){
        koneksi.query('DELETE FROM posting WHERE id_posting=?',id_posting,function(err){
            if(err){
                var message = err;
                req.flash('error', message);
                return res.redirect('/admin-komunitas/posting');
            }else{
                data.forEach(function(data){
                    if(data.foto){
                        fs.unlink('public/uploads/img/'+data.foto);
                    }
                });
                var message = "Data Berhasil Dihapus.";
                req.flash('success', message);
                return res.redirect('/admin-komunitas/posting');
            }
        });
    });
    koneksi.release();
    });
};

exports.list = function(req, res, next) {
    DB.getConnection(function(err,koneksi){
            koneksi.query('SELECT * FROM posting LEFT JOIN kategori on kategori.id_kategori=posting.id_kategori ORDER BY tgl_posting',function(err,articles){
                if (err) {
                    return next(err);
                } else {
                    res.render('pages/admin_komunitas/posting/index', {
                        title: 'Data Posting',
                        articles: articles,
                        striptags: striptags,
                        messages_success: req.flash('success'),
                        email: req.user ? req.user.email : '',
                        jenis: req.user ? req.user.jenis_admin : ''
                    });
                }
            });
            koneksi.release();
    });
};

exports.detail = function(req, res, next) {
    DB.getConnection(function(err,koneksi){
            koneksi.query('SELECT kategori.nama as kategori,judul,isi,tgl_posting,foto,admin.nama as pengirim FROM posting INNER JOIN admin on admin.id_admin=posting.id_admin INNER JOIN kategori on kategori.id_kategori=posting.id_kategori WHERE id_posting = ?',req.params.id,function(err,articles){
                if (err) {
                    console.log(err);
                } else {
                    articles.forEach(function(data){
                        res.render('pages/admin_komunitas/posting/detail', {
                            title: 'Detail',
                            artikel: data,
                            striptags: striptags,
                            email: req.user ? req.user.email : '',
                            jenis: req.user ? req.user.jenis_admin : ''
                        });
                    });
                }
            });
            koneksi.release();
    });
};