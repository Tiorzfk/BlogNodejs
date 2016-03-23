var	geocoderProvider = 'google',
    httpAdapter = 'https';

var extra = {
    apiKey: 'AIzaSyDjE5MTfUt5RYaEdA_I_PVvaQJlkro5e80',
    formatter: null
};

var geocoder = require('node-geocoder')(geocoderProvider, httpAdapter, extra); //menghasilkan address dari lat dan long

module.exports.geocoder=geocoder;