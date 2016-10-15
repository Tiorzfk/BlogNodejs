var db = require('../../../config/db');

function Todo() {
this.renderIndex = function(req, res, next) {
     db.acquire(function(err,con){
        con.query('SELECT * FROM user WHERE jenis_user="Odha" ORDER BY id_user DESC LIMIT 3',function(err,data_odha){
          con.release();
            con.query('SELECT * FROM user WHERE jenis_user="Sahabat Odha" ORDER BY id_user DESC LIMIT 3',function(err,data_so){
                con.query('SELECT id_posting,posting.status,judul,tgl_posting,kategori.nama as kategori,admin.nama as pengirim FROM posting INNER JOIN admin on admin.id_admin=posting.id_admin INNER JOIN kategori on kategori.id_kategori=posting.id_kategori ORDER BY tgl_posting DESC LIMIT 3',function(err,articles){
                    con.query('SELECT id_event,event.status,event.nama,tgl_mulai,tgl_berakhir,admin.nama as pengirim FROM event INNER JOIN admin on admin.id_admin = event.id_admin ORDER BY tgl_posting DESC LIMIT 3',function(err,event){
                        con.query('select count(*) as odha from user where jenis_user="Odha"',function(err,total_odha){
                            con.query('select count(*) as sh_odha from user where jenis_user="Sahabat Odha"',function(err,sh_odha){
                                con.query('select count(*) as artikel FROM posting',function(err,total_artikel){
                                    con.query('select count(*) as event FROM event',function(err,total_event){
                                        res.render('pages/admin_aplikasi/index', {
                                            title: 'Halaman Admin Aplikasi',
                                            data_odha: data_odha,
                                            data_so: data_so,
                                            articles: articles,
                                            event: event,
                                            total_odha: total_odha,
                                            sh_odha: sh_odha,
                                            total_event: total_event,
                                            total_artikel: total_artikel,
                                            email: req.user ? req.user.email : '',
                                            jenis: req.user ? req.user.jenis_admin : ''
                                        });

                                    });
                                });
                            });
                        });
                    });
                });
            });
        });
    });
};
};
module.exports = new Todo();
