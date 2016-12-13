var striptags = require('striptags');
var multer  = require('multer');
var moment = require('moment');
const fs = require('fs');
var db = require('../../../config/db');
// var Pusher = require('pusher');
// var pusher = new Pusher({
//   appId: '270190',
//   key: 'cb75a653f5b4dbd9fefc',
//   secret: '63a19f31a186219fddfe'
// });
// var pusher = new Pusher({
//   appId: '259913',
//   key: '1bba48d795f7e899c4d0',
//   secret: '0826f796c436807884b2'
// });
// var FCM = require('fcm-push');
// var serverKey = 'AIzaSyBW8CBv20jkMnSpJKU9Diddds96Y5pkTIY';
// var fcm = new FCM(serverKey);
//var ggsmsc = require('../../../config/ggsmsc');


function Todo() {

this.renderIndex = function(req, res, next) {

  // pusher.notify(['newpost'], {
  //   fcm: {
  //       notification: {
  //           'title': 'Alhamdulilah!',
  //           'body': 'Lorem ipsum dolor sit amet',
  //           'icon':  'xxx'
  //       }
  //   }
  // });

  res.render('pages/admin_komunitas/index', {
      title: 'Halaman Admin Komunitas',
      email: req.user ? req.user.email : '',
      jenis: req.user ? req.user.jenis_admin : ''
  });

};

//CRUD
this.renderNew = function(req, res, next) {

    db.acquire(function(err,con){
            con.query('SELECT * FROM kategori ',function(err, kategori){
              con.release();
                res.render('pages/admin_komunitas/posting/new', {
                    title: 'Tambah Posting',
                    messages_errors: req.flash('error'),
                    messages_success: req.flash('success'),
                    email: req.user ? req.user.email : '',
                    jenis: req.user ? req.user.jenis_admin : '',
                    kategori: kategori
                });
            });
    });
};

this.new = function(req, res, next) {

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
        var now = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');

        $slug = (req.body.judul).replace(/[^a-z0-9-]/gi, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
        var final =  $slug.toLowerCase();

        var date = new Date();
        var url = 'http://comrade-app.azurewebsites.net/'+date.getFullYear()+'/'+final+'/';
        //console.log(url);
        //membuat isi untuk deskripsi
        var arrayisi = striptags(req.body.isi).split(' ');
        var sliceisi = arrayisi.slice(0,17);

        var notifbody = arrayisi.slice(0,6);

        var data = {
            id_admin: req.user.id_admin,
            judul: req.body.judul,
            slug : url,
            isi: req.body.isi,
            deskripsi: sliceisi.join(' '),
            foto: req.file.filename,
            status: "0",
            tgl_posting: now,
            id_kategori: req.body.kategori,
            sumber: req.body.sumber
        }
        db.acquire(function(err,con){
        con.query('INSERT INTO posting SET ? ',data,function(err){
          con.release();
            //error simpan ke database
            if (err) {
                //res.json(err);
                fs.unlink('public/uploads/img/'+data.foto);
                req.flash('error', err.errors);
                return res.redirect('/admin-komunitas/posting/new');
            }

            // var data = {
            //   fcm: {
            //     notification: {
            //         'title': 'comrade ',
            //         'body': 'comrade your care for a better life comrade your care for a better life ',
            //         'icon':  'comrade.png'
            //     }
            //   }
            // }
            //
            // pusher.notify(["posting"], data, function(error, req, res) {
            //   console.log(error, req, res);
            // });

            var message = 'Berhasil';
            req.flash('success', message);
            return res.redirect('/admin-komunitas/posting/new');
        });
        });
    });
};

this.renderEdit = function(req, res, next) {
    db.acquire(function(err,con){
            con.query('SELECT * FROM posting LEFT JOIN kategori on kategori.id_kategori=posting.id_kategori WHERE id_posting=?',req.params.id,function(err,articles){
              con.release();
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
    });
};

this.edit = function(req, res, next) {
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
            foto: req.body.img_old,
            sumber: req.body.sumber
        }

        if(req.file) {
            data = {
                judul: req.body.judul,
                deskripsi: sliceisi.join(' '),
                isi: req.body.isi,
                foto: req.file.filename,
                sumber: req.body.sumber
            }
        }
        db.acquire(function(err,con){
        con.query('UPDATE posting SET ? WHERE id_posting='+req.params.id,data,function(err){
          con.release();
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
    });
};

this.delete = function(req, res, next) {
    var id_posting = req.params.id;
    db.acquire(function(err,con){
    con.query('SELECT * FROM posting WHERE id_posting='+id_posting,function(errselect,data){
      con.release();
        con.query('DELETE FROM posting WHERE id_posting='+id_posting,function(err){
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
    });
};

this.list = function(req, res, next) {

    db.acquire(function(err,con){
            con.query('SELECT * FROM posting LEFT JOIN kategori on kategori.id_kategori=posting.id_kategori ORDER BY tgl_posting ASC',function(err,articles){
              con.release();
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
    });
};

this.detail = function(req, res, next) {
    db.acquire(function(err,con){
            con.query('SELECT kategori.nama as kategori,judul,isi,tgl_posting,foto,admin.nama as pengirim FROM posting INNER JOIN admin on admin.id_admin=posting.id_admin INNER JOIN kategori on kategori.id_kategori=posting.id_kategori WHERE id_posting = ?',req.params.id,function(err,articles){
              con.release();
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
    });
};
}
module.exports = new Todo();
