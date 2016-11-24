var db = require('../../config/db'),
    striptags = require('striptags'),
    gmAPI = require('../../config/maps').gmAPI, //menghasilkan google maps dalam bentuk png
    slug = require("slug"),
    moment = require("moment"),
    geocoder = require('../../config/geocoder').geocoder;
    //nexmo = require('easynexmo');

    //nexmo.initialize('e44219fb', '35339240f1dc297e', true);

function Todo() {

/*this.testsms = function(req, res, next){
    clockwork.sendSms({ To: '628982044805', Content: 'Test!', From: 'Tio'}, function(error, resp) {
        if (error) {
            console.log('Something went wrong', error);
        } else {
            console.log('Message sent',resp.responses[0].id);
        }
    });
}*/

this.render = function(req, res, next) {
    /*DB.getConnection(function(err,koneksi){
    koneksi.query('SELECT * FROM posting WHERE id_kategori=2 ORDER BY tgl_posting DESC LIMIT 3',function(err, articles){
        koneksi.query('SELECT * FROM posting WHERE id_kategori=1 ORDER BY tgl_posting DESC LIMIT 3',function(err, berita){
            koneksi.query('SELECT id_event,foto,tgl_posting,nama,deskripsi FROM event WHERE tipe="public" ORDER BY tgl_posting DESC LIMIT 3',function(err, event){
                if (err) {
                    return next(err);
                } else {
                    koneksi.query('SELECT * FROM banner',function(error, banner){
                        if (err) {
                            return next(err);
                        } else {*/
                            res.render('pages/index', {
                                title: 'Halaman Utama',
                                striptags: striptags,
                                email: req.user ? req.user.email : '',
                                jenis_user: req.user ? req.user.jenis_user : ''
                            });
                        /*}
                    });
                }
            });
        });
    });
    koneksi.release();
  });*/
};

this.about = function(req, res, next) {
    res.render('pages/about', {
        title: 'Halaman About',
        email: req.user ? req.user.email : ''
    });

};

this.detailposting = function(req, res, next) {
    res.render('pages/detail_posting', {
        title: 'Detail Posting',
        email: req.user ? req.user.email : ''
    });

};

this.detailevent = function(req, res, next) {
    var id = req.params.id;
     db.acquire(function(err,con){
       con.release();
        con.query('SELECT * FROM banner',function(error, banner){
            con.query('SELECT event.nama,tgl_posting,tgl_mulai,tgl_berakhir,foto,deskripsi,latitude,longitude,admin.nama as pengirim FROM event INNER JOIN admin ON admin.id_admin=event.id_admin WHERE id_event='+id,function(err, events){
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
    });
};

this.artikel = function(req, res, next) {

                                    res.render('pages/artikel', {
                                        title: 'Halaman Artikel',
                                        email: req.user ? req.user.email : '',
                                        jenis_user: req.user ? req.user.jenis_user : ''
                                    });

};

this.berita = function(req, res, next) {

                                    res.render('pages/berita', {
                                        title: 'Halaman Berita',
                                        email: req.user ? req.user.email : '',
                                        jenis_user: req.user ? req.user.jenis_user : ''
                                    });

};

this.event = function(req, res, next) {

                                    res.render('pages/event', {
                                        title: 'Halaman Event',
                                        email: req.user ? req.user.email : '',
                                        jenis_user: req.user ? req.user.jenis_user : ''
                                    });

};
this.formSahabatBerbagi = function(req,res,next) {
  
}
}
module.exports = new Todo();
