var Artikel = require('mongoose').model('Artikel');

exports.render = function(req, res, next) {
	Artikel.find({}, function(err, articles) {
    	if (err) {
        	return next(err);
        } else {
   			res.render('pages/index', {
    			title: 'MEAN MVC',
    			articles: articles,
    			email: req.user ? req.user.email : ''
    		});
    	}
    });
};
