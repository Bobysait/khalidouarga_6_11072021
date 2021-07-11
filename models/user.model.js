// send fresh and clean data to the database !
const sanitizerPlugin = require('mongoose-sanitizer-plugin');

// do we need to comment on this ?
const mongoose = require('mongoose');

// validates the email
require('mongoose-type-email');

// asserts the entry is 'unique' (such as two users CAN'T have the same email !)
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = new mongoose.Schema({
	email : {
		type	: mongoose.SchemaTypes.Email,
		required: true,
		unique	: true,
		lowercase : true,
		trim : true
	},
	password : {
		type	: String,
		required: true,
		max : 512, // password can be pretty long once encoded ...
		minLength : 8 // but it should always be safe enough
	}
});

// process the entries with our SDK
userSchema.plugin(sanitizerPlugin);
userSchema.plugin(uniqueValidator);

// exports the "collection" as "users" (actually, it seems we could call it "user", as the "s" will be implemented anyway)
module.exports = mongoose.model('users', userSchema);