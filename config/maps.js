var GoogleMapsAPI = require('googlemaps');

var publicConfig = {
  key: 'AIzaSyDjE5MTfUt5RYaEdA_I_PVvaQJlkro5e80',
  stagger_time:       1000, // for elevationPath 
  encode_polylines:   false,
  secure:             true, // use https 
  proxy:              'http://127.0.0.1:9999' // optional, set a proxy for HTTP requests 
};
var gmAPI = new GoogleMapsAPI(publicConfig);

module.exports.gmAPI = gmAPI;