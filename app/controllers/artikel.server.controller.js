var Artikel = require('mongoose').model('Artikel');
var striptags = require('striptags');
var multer  =   require('multer');
const fs = require('fs');

//CRUD
exports.renderIndex = function(req, res, next) {
    if (req.user) {
        res.render('pages/manage/index', {
            title: 'JUDUL',
            email: req.user ? req.user.email : ''
        });
    }
    else {
        return res.redirect('/');
    }
};

exports.renderNew = function(req, res, next) {
    if (req.user) {
        res.render('pages/manage/artikel/new', {
            title: 'Tambah Artikel',
            messages: req.flash('success')||req.flash('error'),
            email: req.user ? req.user.email : ''
        });
    }
    else {
        return res.redirect('/');
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
    upload(req,res,function(err) {
        if(err) {
            return res.end("Error uploading file."+err);
        }
        var artikel = new Artikel(req.body);
        artikel.foto = req.file.filename;
        var message = null;
        //membuat isi untuk showmore
        var arrayisi = striptags(artikel.isi).split(' ');
        var sliceisi = arrayisi.slice(0,25);
        artikel.showmore = sliceisi.join(' ');

        artikel.save(function(err) {
            if (err) {
                var message = err;
                req.flash('error', message);
                return res.redirect('/manage/artikel/new');
            }
            else {
                var message = 'Berhasil';
                req.flash('success', message);
                return res.redirect('/manage/artikel/new');
            }
        });
    });
};

exports.renderEdit = function(req, res, next) {
    if (req.user) {
        Artikel.findOne({_id: req.params.id}, function(err, articles) {
            if (err) {
                return next(err);
            } else {

                res.render('pages/manage/artikel/edit', {
                    title: 'Edit Artikel',
                    id: req.params.id,
                    artikel: articles,
                    messages: req.flash('success')||req.flash('error'),
                    email: req.user ? req.user.email : ''
                });
            }
        });
    }
    else {
        return res.redirect('/');
    }
};

exports.edit = function(req, res, next) {
    Artikel.findByIdAndUpdate(req.body.id, req.body, function(err, artikel) {
        if (err) {
            var message = err;
            req.flash('error', message);
            return res.redirect('/manage/artikel/edit?id='+req.body.id);
        }
        else {
            var message = 'Berhasil Diubah';
            req.flash('success', message);
            return res.redirect('/manage/my-artikel');
        }
    });
};

exports.delete = function(req, res, next) {
    Artikel.findOne({_id: req.params.id}, function(err, articles) {
        if(err){
            var message = err;
            req.flash('error', message);
            return res.redirect('/manage/my-artikel');
        }else{
            fs.unlink('public/uploads/img/'+articles.foto);
            Artikel.remove({"_id": req.params.id}, function(err) {
                var message = 'Berhasil Dihapus';
                req.flash('success', message);
                return res.redirect('/manage/my-artikel');
            });
        }
    });
};

exports.list = function(req, res, next) {
    if (req.user) {
        Artikel.find({}, function(err, articles) {
            if (err) {
                return next(err);
            } else {
                res.render('pages/manage/artikel/index', {
                    title: 'Data Artikel',
                    articles: articles,
                    striptags: striptags,
                    email: req.user ? req.user.email : ''
                });
            }
        });
    } else {
        return res.redirect('/');
    }
};

exports.mylist = function(req, res, next) {
    if (req.user) {
        Artikel.find({"pengirim": req.user.email}, function(err, articles) {
            if (err) {
                return next(err);
            } else {
                res.render('pages/manage/artikel/mylist', {
                    title: 'Data Artikel',
                    articles: articles,
                    striptags: striptags,
                    messages: req.flash('success')||req.flash('error'),
                    email: req.user ? req.user.email : ''
                });
            }
        });
    } else {
        return res.redirect('/');
    }
};

exports.detail = function(req, res, next) {
    if (req.user) {
        Artikel.findOne({_id: req.params.id}, function(err, articles) {
            if (err) {
                return next(err);
            } else {
                res.render('pages/manage/artikel/detail', {
                    title: 'Detail Artikel',
                    artikel: articles,
                    striptags: striptags,
                    email: req.user ? req.user.email : ''
                });
            }
        });
    } else {
        return res.redirect('/');
    }
};