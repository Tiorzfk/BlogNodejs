var mongoose = require('mongoose'),
	crypto = require('crypto'),
    Schema = mongoose.Schema;

var UserSchema = new Schema({
    judul: String,
    isi: String,
    showmore: String,
    foto: String,
    pengirim: String
});

mongoose.model('Artikel', UserSchema);