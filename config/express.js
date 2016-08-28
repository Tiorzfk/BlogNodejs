var config = require('./config'),
    mysql = require('mysql'),
	express = require('express'),
 	bodyParser = require('body-parser'),
    flash = require('connect-flash'),
    passport = require('passport'),
    session = require('express-session'),
    path = require('path');

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

    require('../app/routes/index.server.routes.js')(app);
    require('../app/routes/auth_users.server.routes.js')(app);
    require('../app/routes/auth_admin.server.routes.js')(app,passport);
    
    //admin komunitas
    require('../app/routes/admin_komunitas/posting.server.routes.js')(app);
    require('../app/routes/admin_komunitas/event.server.routes.js')(app);
    //require('../app/routes/admin_komunitas/banner.server.routes.js')(app);

    //admin aplikasi
    require('../app/routes/admin_aplikasi/user.server.routes.js')(app);
    require('../app/routes/admin_aplikasi/posting.server.routes.js')(app);
    require('../app/routes/admin_aplikasi/event.server.routes.js')(app);
    require('../app/routes/admin_aplikasi/pemeriksaan.server.routes.js')(app);
    require('../app/routes/admin_aplikasi/obat.server.routes.js')(app);

    return app;
};