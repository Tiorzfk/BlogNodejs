var DB = require('../../config/db').DB,
    striptags = require('striptags'),
    gmAPI = require('../../config/maps').gmAPI, //menghasilkan google maps dalam bentuk png
    slug = require("slug"),
    moment = require("moment"),
    geocoder = require('../../config/geocoder').geocoder,
    nexmo = require('easynexmo'),
    request = require("request");

    nexmo.initialize('e44219fb', '35339240f1dc297e', true);

exports.testsms = function(req, res, next){
    clockwork.sendSms({ To: '628982044805', Content: 'Test!', From: 'Tio'}, function(error, resp) {
        if (error) {
            console.log('Something went wrong', error);
        } else {
            console.log('Message sent',resp.responses[0].id);
        }
    });
}

exports.render = function(req, res, next) {
    request({url: "http://comrade-api.azurewebsites.net/posting/kategori/1",json: true}, function (error, response, berita) {
        request({url: "http://comrade-api.azurewebsites.net/posting/kategori/2",json: true}, function (error, response, artikel) {
            request({url: "http://comrade-api.azurewebsites.net/event/public",json: true}, function (error, response, event) {
                request({url: "http://comrade-api.azurewebsites.net/listbanner/",json: true}, function (error, response, banner) {
                    if (!error && response.statusCode === 200) {
                        res.render('pages/index', {
                            title: 'Halaman Utama',
                            artikel: artikel.result,
                            moment: moment,
                            banner: banner.result,
                            berita: berita.result,
                            event: event.result,
                            striptags: striptags,
                            slug: slug,
                            email: req.user ? req.user.email : '',
                            jenis_user: req.user ? req.user.jenis_user : ''
                        });
                    } else {
                        res.json(error);
                    }
                });
            });
        });
    });

};

exports.detailposting = function(req, res, next) {
    request({url: "http://comrade-api.azurewebsites.net/kategori",json: true}, function (error, response, kategori) {
        request({url: "http://comrade-api.azurewebsites.net/posting/kategori/1",json: true}, function (error, response, berita) {
            request({url: "http://comrade-api.azurewebsites.net/posting/kategori/2",json: true}, function (error, response, artikel) {
                request({url: "http://comrade-api.azurewebsites.net/event/public",json: true}, function (error, response, event) {
                    request({url: "http://comrade-api.azurewebsites.net/banner",json: true}, function (error, response, banner) {
                        request({url: "http://comrade-api.azurewebsites.net/posting/"+req.params.id,json: true}, function (error, response, data) {
                            if (!error && response.statusCode === 200) {
                                res.render('pages/detail_posting', {
                                    title: 'Detail Posting',
                                    data: data.result,
                                    kategori: kategori.result,
                                    artikel: artikel.result,
                                    moment: moment,
                                    slug: slug,
                                    event: event.result,
                                    berita: berita.result,
                                    banner: banner.result,
                                    email: req.user ? req.user.email : ''
                                });
                            }
                        });
                    });
                });
            });
        });
    });
};  

exports.detailevent = function(req, res, next) {
    var id = req.params.id;
    request({url: "http://comrade-api.azurewebsites.net/event/public"+req.params.id,json: true}, function (error, response, data) {
        request({url: "http://comrade-api.azurewebsites.net/banner",json: true}, function (error, response, banner) {
            if (!error && response.statusCode === 200) {
                geocoder.reverse({lat:data[0].latitude, lon:data[0].longitude}, function(err, result) {
                    res.render('pages/detail_event', {
                        title: 'Detail Event',
                        events: data.result,                                       
                        moment: moment,
                        banner: banner.result,
                        gmAPI: gmAPI,
                        results: result,
                        email: req.user ? req.user.email : ''
                    });
                });
            }
        });
    });           
};

exports.artikel = function(req, res, next) {
    request({url: "http://comrade-api.azurewebsites.net/kategori",json: true}, function (error, response, kategori) {
        request({url: "http://comrade-api.azurewebsites.net/posting/kategori/1",json: true}, function (error, response, berita) {
            request({url: "http://comrade-api.azurewebsites.net/posting/kategori/2",json: true}, function (error, response, artikel) {
                request({url: "http://comrade-api.azurewebsites.net/event/public",json: true}, function (error, response, event) {
                    request({url: "http://comrade-api.azurewebsites.net/listbanner/",json: true}, function (error, response, banner) {
                        if (!error && response.statusCode === 200) {
                            res.render('pages/artikel', {
                                title: 'Halaman Artikel',
                                kategori: kategori.result,
                                artikel: artikel.result,
                                moment: moment.result,
                                slug: slug,
                                event: event.result,
                                berita: berita.result,
                                banner: banner.result,
                                email: req.user ? req.user.email : '',
                                jenis_user: req.user ? req.user.jenis_user : ''
                            });
                        }
                    });
                });
            });
        });
    });
};

exports.berita = function(req, res, next) {
    request({url: "http://comrade-api.azurewebsites.net/kategori",json: true}, function (error, response, kategori) {
        request({url: "http://comrade-api.azurewebsites.net/posting/kategori/1",json: true}, function (error, response, berita) {
            request({url: "http://comrade-api.azurewebsites.net/posting/kategori/2",json: true}, function (error, response, artikel) {
                request({url: "http://comrade-api.azurewebsites.net/event/public",json: true}, function (error, response, event) {
                    request({url: "http://comrade-api.azurewebsites.net/",json: true}, function (error, response, banner) {
                        if (!error && response.statusCode === 200) {
                            res.render('pages/berita', {
                                title: 'Halaman Artikel',
                                kategori: kategori.result,
                                artikel: artikel.result,
                                moment: moment,
                                slug: slug,
                                event: event.result,
                                berita: berita.result,
                                banner: banner.result,
                                email: req.user ? req.user.email : '',
                                jenis_user: req.user ? req.user.jenis_user : ''
                            });
                        }
                    });
                });
            });
        });
    });
};

exports.event = function(req, res, next) {
    request({url: "http://comrade-api.azurewebsites.net/kategori",json: true}, function (error, response, kategori) {
        request({url: "http://comrade-api.azurewebsites.net/posting/kategori/1",json: true}, function (error, response, berita) {
            request({url: "http://comrade-api.azurewebsites.net/posting/kategori/2",json: true}, function (error, response, artikel) {
                request({url: "http://comrade-api.azurewebsites.net/event/public",json: true}, function (error, response, event) {
                    request({url: "http://comrade-api.azurewebsites.net/listbanner/",json: true}, function (error, response, banner) {
                        if (!error && response.statusCode === 200) {                       
                            res.render('pages/event', {
                                title: 'Halaman Event',
                                kategori: kategori.result,
                                artikel: artikel.result,
                                moment: moment,
                                slug: slug,
                                event: event.result,
                                berita: berita.result,
                                banner: banner.result,
                                striptags: striptags,
                                email: req.user ? req.user.email : '',
                                jenis_user: req.user ? req.user.jenis_user : ''
                            });
                        }
                    });
                });
            });
        });
    });
};
