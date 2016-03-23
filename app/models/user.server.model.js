var mongoose = require('mongoose'),
	crypto = require('crypto'),
    Schema = mongoose.Schema;

var UserSchema = new Schema({
    email: {
        type: String,
        trim: true,
        unique: true
    },
    password: String,
    level: Number
});

UserSchema.pre('save', 
	function(next) {
		if (this.password) {
			var md5 = crypto.createHash('md5');
			this.password = md5.update(this.password).digest('hex');
		}

		next();
	}
);

UserSchema.methods.authenticate = function(password) {
	var md5 = crypto.createHash('md5');
	md5 = md5.update(password).digest('hex');

	return this.password === md5;
};

UserSchema.statics.findUniqueemail = function(email, suffix, callback) {
	var _this = this;
	var possibleemail = email + (suffix || '');

	_this.findOne(
		{email: possibleemail},
		function(err, user) {
			if (!err) {
				if (!user) {
					callback(possibleemail);
				}
				else {
					return _this.findUniqueemail(email, (suffix || 0) + 1, callback);
				}
			}
			else {
				callback(null);
			}
		}
	);
};

mongoose.model('User', UserSchema);