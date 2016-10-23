var config = require('./config'),
    mysql = require('mysql'),
	  express = require('express'),
 	  bodyParser = require('body-parser'),
    flash = require('connect-flash'),
    passport = require('passport'),
    session = require('express-session'),
    path = require('path');

    //koneksi
    connection = require('./db');
    connection_sms = require('./dbsms');
    //routing
    index = require('../app/routes/index.server.routes.js');
    auth_admin = require('../app/routes/auth_admin.server.routes.js');

    //admin komunitas
    posting_komunitas = require('../app/routes/admin_komunitas/posting.server.routes.js');
    event_komunitas = require('../app/routes/admin_komunitas/event.server.routes.js');
    //require('../app/routes/admin_komunitas/banner.server.routes.js')(app);

    //admin aplikasi
    index_aplikasi = require('../app/routes/admin_aplikasi/index_aplikasi.server.routes.js');
    tweet = require('../app/routes/admin_aplikasi/tweets.server.routes.js');
    posting_aplikasi = require('../app/routes/admin_aplikasi/posting.server.routes.js');
    event_aplikasi = require('../app/routes/admin_aplikasi/event.server.routes.js');
    pemeriksaan = require('../app/routes/admin_aplikasi/pemeriksaan.server.routes.js');
    obat = require('../app/routes/admin_aplikasi/obat.server.routes.js');
    user = require('../app/routes/admin_aplikasi/user.server.routes.js');
    kirim_sms = require('../app/routes/admin_aplikasi/sms.server.routes.js');

module.exports = function() {
    var app = express();

    require('./passportadmin')(passport);

    app.use(bodyParser.urlencoded({
        extended: true
    }));

    app.use(bodyParser.json());

    app.use(session({
        saveUninitialized: true,
        resave: true,
        secret: 'OurSuperSecretCookieSecret'
    }));

    app.set('views', './app/views');
	  app.set('view engine', 'ejs');
    app.use(express.static('./public'));

    app.use(flash());
    app.use(passport.initialize());
    app.use(passport.session());
    //koneksi
    connection.init();
    //routing
    index.configure(app);
    auth_admin.configure(app,passport);
    //admin komunitas
    posting_komunitas.configure(app);
    event_komunitas.configure(app);
    //admin aplikasi
    tweet.configure(app);
    posting_aplikasi.configure(app);
    event_aplikasi.configure(app);
    pemeriksaan.configure(app);
    obat.configure(app);
    index_aplikasi.configure(app);
    user.configure(app);
    //koneksi sms
    connection_sms.init();
    kirim_sms.configure(app);

    return app;
};
