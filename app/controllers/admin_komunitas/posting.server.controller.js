var striptags = require('striptags');
var multer  = require('multer');
var moment = require('moment');
const fs = require('fs');
var DB = require('../../../config/db').DB;

exports.tes = function(req, res, next) {
    if (!req.user) {
        var tes = [];
        DB.query('SELECT admin.id_admin,id_posting,admin.nama,deskripsi,foto,posting.status,tgl_posting FROM posting INNER JOIN admin on admin.id_admin=posting.id_admin',function(err,articles){
            articles.forEach(function(data){
                for(var i=0; i<articles.length; i++) {
                articles[i].pengirim = {'id': data.id_admin,'Nama': data.nama};
                };
            })
            /*articles.forEach(function(data){
                data['h']= 'waaaa';
            })*/
            if(err){
                res.json(err);
            }
            res.json(articles);
        });

    }
    else {
       return res.redirect('/admin/login');
    }
};

exports.renderIndex = function(req, res, next) {
    if (req.user) {
        if (req.user.jenis_admin === 'admin komunitas') { 
            DB.query('select count(*) as artikel FROM posting',function(err,total_posting){
                DB.query('select count(*) as event FROM event',function(err,total_event){
                    res.render('pages/admin_komunitas/index', {
                        title: 'Halaman Admin Komunitas',
                        total_posting: total_posting,
                        total_event: total_event,
                        email: req.user ? req.user.email : '',
                        jenis: req.user ? req.user.jenis_admin : ''
                    });
                });
            });
        } else {
            res.redirect('/admin-aplikasi');
        }
    }
    else {
       return res.redirect('/admin/login');
    }
};

//CRUD

exports.renderNew = function(req, res, next) {
    if (req.user) {
        if (req.user.jenis_admin === 'admin komunitas') { 
            DB.query('SELECT * FROM kategori ',function(err, kategori){
                res.render('pages/admin_komunitas/posting/new', {
                    title: 'Tambah Posting',
                    messages_errors: req.flash('error'),
                    messages_success: req.flash('success'),
                    email: req.user ? req.user.email : '',
                    jenis: req.user ? req.user.jenis_admin : '',
                    kategori: kategori
                });
            });
        } else {
           res.redirect('/admin-aplikasi');
        }
    }
    else {
        return res.redirect('/admin/login');
    }
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
        if(req.body.isi.length<30){
            req.flash('error', 'Maaf, Deskripsi yang anda masukan tidak boleh kurang dari 30.');
            return res.redirect('/admin-komunitas/posting/new');
        }
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
        DB.query('INSERT INTO posting SET ? ',data,function(err){
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
    });
};

exports.renderEdit = function(req, res, next) {
    if (req.user) {
        if (req.user.jenis_admin === 'admin komunitas') { 
            DB.query('SELECT * FROM posting LEFT JOIN kategori on kategori.id_kategori=posting.id_kategori WHERE id_posting=?',req.params.id,function(err,articles){
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
        } else {
           res.redirect('/admin-aplikasi');
        }
    }
    else {
        return res.redirect('/admin/login');
    }
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
        DB.query('UPDATE posting SET ? WHERE id_posting='+req.params.id,data,function(err){
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
    });
};

exports.delete = function(req, res, next) {
    var id_posting = req.params.id;
    DB.query('SELECT * FROM posting WHERE id_posting='+id_posting,function(errselect,data){
        DB.query('DELETE FROM posting WHERE id_posting=?',id_posting,function(err){
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
};

exports.list = function(req, res, next) {
    if (req.user) {
        if (req.user.jenis_admin === 'admin komunitas') { 
            DB.query('SELECT * FROM posting LEFT JOIN kategori on kategori.id_kategori=posting.id_kategori ORDER BY tgl_posting',function(err,articles){
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
        } else {
           res.redirect('/admin-aplikasi');
        }
    } else {
        return res.redirect('/admin/login');
    }
};

exports.detail = function(req, res, next) {
    if (req.user) {
        if (req.user.jenis_admin === 'admin komunitas') { 
            DB.query('SELECT kategori.nama as kategori,judul,isi,tgl_posting,foto,admin.nama as pengirim FROM posting INNER JOIN admin on admin.id_admin=posting.id_admin INNER JOIN kategori on kategori.id_kategori=posting.id_kategori WHERE id_posting = ?',req.params.id,function(err,articles){
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
        } else {
           res.redirect('/admin-aplikasi');
        }
    } else {
        return res.redirect('/admin/login');
    }
};