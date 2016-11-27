var tweet = require('../../controllers/admin_aplikasi/tweets.server.controller');

function isAuthenticated(req, res, next) {

    // do any checks you want to in here

    // CHECK THE USER STORED IN SESSION FOR A CUSTOM VARIABLE
    // you can do this however you want with whatever variables you set up
    if (req.user) {
        if (req.user.jenis_admin === 'admin aplikasi'){
            return next();
        }else{
            res.redirect('/admin-komunitas');
        }
    }else{
        // IF A USER ISN'T LOGGED IN, THEN REDIRECT THEM SOMEWHERE
        res.redirect('/admin/login');
    }
}

module.exports = {
  configure: function(app) {
    app.route('/admin-aplikasi/verifikasi_tweet').all(isAuthenticated).post(tweet.VerifikasiTweet);

    app.route('/admin-aplikasi/unverifikasi_tweet/:id').all(isAuthenticated).get(tweet.UnVerifikasiTweet);

    app.route('/admin-aplikasi/tweets').all(isAuthenticated).get(tweet.listtweets);

    app.route('/admin-aplikasi/tweets/en').all(isAuthenticated).get(tweet.listtweetsen);

    app.route('/admin-aplikasi/tweet/delete/:id').all(isAuthenticated).get(tweet.deletetweets);

    app.route('/admin-aplikasi/tweets/selesai').all(isAuthenticated).get(tweet.listtweetsselesai);

  }
};
