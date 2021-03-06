var posting = require('../../controllers/admin_komunitas/posting.server.controller');

function isAuthenticated(req, res, next) {

    // do any checks you want to in here

    // CHECK THE USER STORED IN SESSION FOR A CUSTOM VARIABLE
    // you can do this however you want with whatever variables you set up
    if (req.user) {
        if (req.user.jenis_admin === 'admin komunitas'){
            return next();
        }else{
            res.redirect('/admin-aplikasi');
        }
    }else{
        // IF A USER ISN'T LOGGED IN, THEN REDIRECT THEM SOMEWHERE
        res.redirect('/admin/login');
    }
}

module.exports = {
  configure: function(app) {
    app.route('/admin-komunitas').all(isAuthenticated).get(posting.renderIndex);

    app.route('/admin-komunitas/posting/new').all(isAuthenticated).get(posting.renderNew).post(posting.new);

    app.route('/admin-komunitas/posting').all(isAuthenticated).get(posting.list);

    app.route('/admin-komunitas/posting/detail/:id').all(isAuthenticated).get(posting.detail);

    app.route('/admin-komunitas/posting/edit/:id').all(isAuthenticated).get(posting.renderEdit).post(posting.edit);

    app.route('/admin-komunitas/posting/delete/:id').all(isAuthenticated).get(posting.delete);
    app.route('/tesfcm').get(function(req,res2,next){
      var Pusher = require('pusher');
      var pusher = new Pusher({
        appId: '270190',
        key: 'cb75a653f5b4dbd9fefc',
        secret: '63a19f31a186219fddfe'
      });
      var data = {
        "apns": {
          "aps": {
            "alert": {
              "body": "hello"
            }
          }
        },
        fcm: {
          notification: {
              'title': 'gaga Alert!',
              'body': 'bbbb',
              'icon':  'logo'
          }
        }
      }
      pusher.notify(["kittens"], data, function(error, req, res) {
        if (error) {
          return res2.json(error);
        }
        if (req) {
          console.log(req);
        }else {
          console.log(res);
        }
      });
      //pusher.trigger('kittens', {message: "hello world"});
    });
  }
};
