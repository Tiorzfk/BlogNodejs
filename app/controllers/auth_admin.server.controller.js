var passport = require('passport'),
    DB = require('../../config/db').DB;

exports.renderLogin = function(req, res, next) {
    if (!req.user) {
        res.render('pages/auth_admin/login', {
            title: 'Log-in User Form',
            messages: req.flash('error') || req.flash('info'),
            email: req.user ? req.user.email : ''
        });
    }
    else {
        return res.redirect('/admin-komunitas');
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
        var user = new User(req.body);
        var message = null;
        user.save(function(err) {
            if (err) {
                var message = getErrorMessage(err);
                req.flash('error', message);
                return res.redirect('/register');
            }
            req.login(user, function(err) {
                if (err)
                    return next(err);

                return res.redirect('/manage');
            });
        });
    }
    else {
        return res.redirect('/');
    }
};

exports.logout = function(req, res) {
    req.logout();
    res.redirect('/admin/login');
};