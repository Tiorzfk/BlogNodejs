var passport = require('passport'),
    DB = require('../../config/db'),
    bcrypt = require('bcryptjs'),
    transport = require('../../config/mail').transport,
    EmailTemplates = require('swig-email-templates'),
    path = require('path');

var getErrorMessage = function(err) {
    var message = '';
    if (err.code) {
        switch (err.code) {
            case 11000:
            case 11001:
                message = 'Username already exists';
                break;
            default:
                message = 'Something went wrong';
        }
    }
    else {
        for (var errName in err.errors) {
            if (err.errors[errName].message)
                message = err.errors[errName].message;
        }
    }

    return message;
};

exports.renderLogin = function(req, res, next) {
    if (!req.user) {
        res.render('pages/auth/login', {
            title: 'Log-in User Form',
            messages_errors: req.flash('error'),
            messages_success: req.flash('success'),
            email: req.user ? req.user.email : ''
        });
    }
    else {
        return res.redirect('/');
    }
};

exports.renderRegister = function(req, res, next) {
    if (!req.user) {
        res.render('pages/auth/register', {
            title: 'Register Form',
            messages: req.flash('error'),
            email: req.user ? req.user.email : ''
        });
    }
    else {
        return res.redirect('/');
    }
};

exports.register = function(req, res, next) {
    if (!req.user) {
        var message = null;
        var hash = bcrypt.hashSync(req.body.password, 8);
        var data = {
            email : req.body.email,
            password: hash,
            jenis_user: req.body.level
        }
        DB.query('INSERT INTO user SET ? ',data,function(err){
            if (err) {
                var message = getErrorMessage(err);
                req.flash('error', message);
                return res.redirect('/register');
            }
            var templates = new EmailTemplates({root: '/BlogNodejs/app/views/emails'});
            var locals = {
                email: req.body.email,
                url: 'http://acme.com/confirm/xxx-yyy-zzz'
            };

            // Send a single email
            templates.render('confirm-email.html', locals, function(err, html) {
                if (err) {
                  console.log(err);
                } else {
                    transport.sendMail({
                        from: 'Comrade app <no-reply@comrade.com>',
                        to: locals.email,
                        subject: 'Confirmation Email.',
                        html: html
                        }, function(err, responseStatus) {
                            if (err) {
                                console.log(err);
                            } else {
                                console.log(responseStatus.message);
                                var message = 'Pesan konfirmasi telah dikirim, silahkan cek email anda!';
                                req.flash('success', message);
                                return res.redirect('/login');
                            }
                        }
                    );
                }
            });

        });
    }
    else {
        return res.redirect('/');
    }
};

exports.logout = function(req, res) {
    req.logout();
    res.redirect('/');
};

//CRUD
exports.create = function(req, res, next) {
    var user = new User(req.body);
    user.save(function(err) {
        if (err) {
            return next(err);
        }
        else {
            res.json(user);
        }
    });
};

exports.list = function(req, res, next) {
    DB.query('SELECT * FROM user',function(err,rows){
        if(err){
            res.json(err);
        }
        res.json(rows);
    });
};

exports.read = function(req, res) {
    res.json(req.user);
};

exports.userByID = function(req, res, next, id) {
    User.findOne({
            _id: id
        },
        function(err, user) {
            if (err) {
                return next(err);
            }
            else {
                req.user = user;
                next();
            }
        }
    );
};

exports.update = function(req, res, next) {
    User.findByIdAndUpdate(req.user.id, req.body, function(err, user) {
        if (err) {
            return next(err);
        }
        else {
            res.json(user);
        }
    });
};

exports.delete = function(req, res, next) {
    req.user.remove(function(err) {
        if (err) {
            return next(err);
        }
        else {
            res.json(req.user);
        }
    })
};

exports.sahabat_odha = function(req, res, next) {
    if (req.user) {
        User.find({"level": 2}, function(err, users) {
            if (err) {
                return next(err);
            } else {
                res.render('pages/manage/sahabat_odha', {
                    title: 'Data Sahabat Odha',
                    users: users,
                    email: req.user ? req.user.email : ''
                });
            }
        });
    } else {
        return res.redirect('/');
    }
};
