var Banner = require('mongoose').model('Banner');
var multer  = require('multer');
const fs = require('fs');

exports.renderNew = function(req, res, next) {
    if (req.user) {
        res.render('pages/manage/banner/new', {
            title: 'Tambah Banner',
            messages_errors: req.flash('error'),
            messages_success: req.flash('success'),
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
            callback(null, 'public/uploads/banner');
        },
        filename: function (req, file, callback) {
            callback(null, Date.now() + '-' + file.originalname);
        }
    });
    var upload = multer({ storage : storage }).single('banner_img');
    upload(req,res,function(errupload) {
        //error upload foto
        if(errupload) {
            return res.end("Error uploading file."+errupload);
        }
        var message = null;

        var banner = new Banner(req.body);

        if(req.file != null){
            banner.banner_img = req.file.filename;
        }

        banner.save(function(err) {
            //error simpan ke database
            if (err) {
                //res.json(err);
                fs.unlink('public/uploads/banner/'+banner.banner_img);
                req.flash('error', err.errors);
                return res.redirect('/manage/banner/new');
            }
            var message = 'Berhasil';
            req.flash('success', message);
            return res.redirect('/manage/banner/new');
        });
    });
};

exports.list = function(req, res, next) {
    if (req.user) {
        Banner.find({}, function(err, banner) {
            if (err) {
                return next(err);
            } else {
                res.render('pages/manage/banner/list', {
                    title: 'Data Banner',
                    banner: banner,
                    messages: req.flash('success'),
                    email: req.user ? req.user.email : ''
                });
            }
        });
    } else {
        return res.redirect('/');
    }
};

exports.renderEdit = function(req, res, next) {
    if (req.user) {
        Banner.findOne({_id: req.params.id}, function(err, banner) {
            if (err) {
                return next(err);
            } else {

                res.render('pages/manage/banner/edit', {
                    title: 'Edit Banner',
                    id: req.params.id,
                    data: banner,
                    messages_errors: req.flash('error'),
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
    var storage = multer.diskStorage({
        destination: function (req, file, callback) {
            callback(null, 'public/uploads/banner');
        },
        filename: function (req, file, callback) {
            callback(null, Date.now() + '-' + file.originalname);
        }
    });
    var upload = multer({ storage : storage }).single('banner_img');
    upload(req,res,function(errupload) {
        //error upload foto
        if(errupload) {
            return res.end("Error uploading file."+errupload);
        }
        var message = null;

        banner_img = new Date();
        //res.json(req.file);
        var data = {
            nama_banner:req.body.nama_banner
        };

        if(req.file)
        {
            data = {
                nama_banner:req.body.nama_banner,
                banner_img:req.file.filename
            }
        }
        Banner.findByIdAndUpdate(req.body.id,data, function(err, banner) {
        	if (err) {
        	    var message = err;
        	    req.flash('error', message);
        	    return res.redirect('/manage/banner/edit/'+req.body.id);
        	}
        	else {
                if(req.file != null){
        		  fs.unlink('public/uploads/banner/'+req.body.banner_old);
                }
        	    var message = 'Berhasil Diubah';
        	    req.flash('success', message);
        	    return res.redirect('/manage/banner');
        	}
    	});
    });
};