var DB = require('../../config/db').DB,
    striptags = require('striptags'),
    gmAPI = require('../../config/maps').gmAPI, //menghasilkan google maps dalam bentuk png
    slug = require("slug"),
    moment = require("moment"),
    geocoder = require('../../config/geocoder').geocoder,
    nexmo = require('easynexmo');

    nexmo.initialize('e44219fb', '35339240f1dc297e', true);

exports.testsms = function(req, res, next){
    clockwork.sendSms({ To: '628982044805', Content: 'Test!', From: 'Tio'}, function(error, resp) {
        if (error) {
            console.log('Something went wrong', error);
        } else {
            console.log('Message sent',resp.responses[0].id);
        }
    });
}

exports.render = function(req, res, next) {
    DB.getConnection(function(err,koneksi){
    koneksi.query('SELECT * FROM posting WHERE id_kategori=2 ORDER BY tgl_posting DESC LIMIT 3',function(err, articles){
        koneksi.query('SELECT * FROM posting WHERE id_kategori=1 ORDER BY tgl_posting DESC LIMIT 3',function(err, berita){  
            koneksi.query('SELECT id_event,foto,tgl_posting,nama,deskripsi FROM event WHERE tipe="public" ORDER BY tgl_posting DESC LIMIT 3',function(err, event){      
                if (err) {
                    return next(err);
                } else {
                    koneksi.query('SELECT * FROM banner',function(error, banner){
                        if (err) {
                            return next(err);
                        } else {
                            res.render('pages/index', {
                                title: 'Halaman Utama',
                                articles: articles,
                                moment: moment,
                                berita: berita,
                                event: event,
                                striptags: striptags,
                                slug: slug,
                                banner: banner,
                                email: req.user ? req.user.email : '',
                                jenis_user: req.user ? req.user.jenis_user : ''
                            });
                        }
                    });
                }
            });
        });
    });
    koneksi.release();
    });
};

exports.detailposting = function(req, res, next) {
    var id = req.params.id;
    DB.getConnection(function(err,koneksi){
    koneksi.query('SELECT * FROM kategori',function(error, kategori){
        koneksi.query('SELECT * FROM posting WHERE id_kategori=1 ORDER BY tgl_posting DESC LIMIT 3',function(error, berita){
            koneksi.query('SELECT * FROM posting WHERE id_kategori=2 ORDER BY tgl_posting DESC LIMIT 3',function(error, artikel){
                koneksi.query('SELECT * FROM event ORDER BY tgl_posting WHERE tipe="public" DESC LIMIT 3',function(error, event){
                    koneksi.query('SELECT * FROM banner',function(error, banner){
                        koneksi.query('SELECT * FROM posting WHERE id_posting='+id,function(err, articles){
                            if (err) {
                                return next(err);
                            } else {
                                    articles.forEach(function(data){
                                        res.render('pages/detail_posting', {
                                            title: 'Detail Posting',
                                            data: data,
                                            kategori: kategori,
                                            artikel: artikel,
                                            moment: moment,
                                            slug: slug,
                                            event: event,
                                            berita: berita,
                                            banner: banner,
                                            email: req.user ? req.user.email : ''
                                        });
                                    });
                            }
                        });
                    });
                });
            });
        });
    });     
    koneksi.release();
});
};  

exports.detailevent = function(req, res, next) {
    var id = req.params.id;
     DB.getConnection(function(err,koneksi){
        koneksi.query('SELECT * FROM banner',function(error, banner){
            koneksi.query('SELECT event.nama,tgl_posting,tgl_event,foto,deskripsi,latitude,longitude,admin.nama as pengirim FROM event INNER JOIN admin ON admin.id_admin=event.id_admin WHERE id_event='+id,function(err, events){
                if (err) {
                    return next(err);
                } else {
                    if(events){
                        events.forEach(function(data){
                            geocoder.reverse({lat:data.latitude, lon:data.longitude}, function(err, result) {
                                res.render('pages/detail_event', {
                                    title: 'Detail Posting',
                                    events: data,                                       
                                    moment: moment,
                                    banner: banner,
                                    gmAPI: gmAPI,
                                    results: result,
                                    email: req.user ? req.user.email : ''
                                });
                            });
                        });
                    } else {
                        res.redirect('/GAGAGAGA');
                        
                    }
                }
            });
        });
        koneksi.release();
    });               
};

exports.artikel = function(req, res, next) {
    DB.getConnection(function(err,koneksi){
    koneksi.query('SELECT * FROM kategori',function(error, kategori){
        koneksi.query('SELECT * FROM posting WHERE id_kategori=1 ORDER BY tgl_posting DESC LIMIT 3',function(error, berita){
            koneksi.query('SELECT * FROM posting WHERE id_kategori=2 ORDER BY tgl_posting DESC LIMIT 3',function(error, artikel){
                koneksi.query('SELECT * FROM event WHERE tipe="public" ORDER BY tgl_posting DESC LIMIT 3',function(error, event){
                    koneksi.query('SELECT * FROM posting WHERE id_kategori=2 ORDER BY tgl_posting DESC',function(err, articles){
                        if (err) {
                            return next(err);
                        } else {
                            koneksi.query('SELECT * FROM banner',function(error, banner){
                                if (err) {
                                    return next(err);
                                } else {
                                    res.render('pages/artikel', {
                                        title: 'Halaman Artikel',
                                        articles: articles,
                                        kategori: kategori,
                                        artikel: artikel,
                                        moment: moment,
                                        slug: slug,
                                        event: event,
                                        berita: berita,
                                        banner: banner,
                                        email: req.user ? req.user.email : '',
                                        jenis_user: req.user ? req.user.jenis_user : ''
                                    });
                                }
                            });
                        }
                    });
                });
            });
        });
    });
    koneksi.release();
    }); 
};

exports.berita = function(req, res, next) {
    DB.getConnection(function(err,koneksi){
    koneksi.query('SELECT * FROM kategori',function(error, kategori){
        koneksi.query('SELECT * FROM posting WHERE id_kategori=1 ORDER BY tgl_posting DESC LIMIT 3',function(error, berita){
            koneksi.query('SELECT * FROM posting WHERE id_kategori=2 ORDER BY tgl_posting DESC LIMIT 3',function(error, artikel){
                koneksi.query('SELECT * FROM event WHERE tipe="public" ORDER BY tgl_posting DESC LIMIT 3',function(error, event){
                    koneksi.query('SELECT * FROM posting WHERE id_kategori=1 ORDER BY tgl_posting DESC',function(err, news){
                        if (err) {
                            return next(err);
                        } else {
                            koneksi.query('SELECT * FROM banner',function(error, banner){
                                if (err) {
                                    return next(err);
                                } else {
                                    res.render('pages/berita', {
                                        title: 'Halaman Artikel',
                                        news: news,
                                        kategori: kategori,
                                        artikel: artikel,
                                        moment: moment,
                                        slug: slug,
                                        event: event,
                                        berita: berita,
                                        banner: banner,
                                        email: req.user ? req.user.email : '',
                                        jenis_user: req.user ? req.user.jenis_user : ''
                                    });
                                }
                            });
                        }
                    });
                });
            });
        });
    });
    koneksi.release();
    });
};

exports.event = function(req, res, next) {
    DB.getConnection(function(err,koneksi){
    koneksi.query('SELECT * FROM kategori',function(error, kategori){
        koneksi.query('SELECT * FROM posting WHERE id_kategori=1 ORDER BY tgl_posting DESC LIMIT 3',function(error, berita){
            koneksi.query('SELECT * FROM posting WHERE id_kategori=2 ORDER BY tgl_posting DESC LIMIT 3',function(error, artikel){
                koneksi.query('SELECT * FROM event WHERE tipe="public" ORDER BY tgl_posting DESC LIMIT 3',function(error, event){
                    koneksi.query('SELECT * FROM event WHERE tipe="public" ORDER BY tgl_posting DESC',function(err, events){
                        if (err) {
                            return next(err);
                        } else {
                            koneksi.query('SELECT * FROM banner',function(error, banner){
                                if (err) {
                                    return next(err);
                                } else {
                                    res.render('pages/event', {
                                        title: 'Halaman Artikel',
                                        events: events,
                                        kategori: kategori,
                                        artikel: artikel,
                                        moment: moment,
                                        slug: slug,
                                        event: event,
                                        berita: berita,
                                        banner: banner,
                                        striptags: striptags,
                                        email: req.user ? req.user.email : '',
                                        jenis_user: req.user ? req.user.jenis_user : ''
                                    });
                                }
                            });
                        }
                    });
                });
            });
        });
    });
    koneksi.release();
    });
};
