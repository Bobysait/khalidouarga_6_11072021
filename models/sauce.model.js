const mongoose = require('mongoose');
const sanitizerPlugin = require('mongoose-sanitizer-plugin');

const sauceSchema = mongoose.Schema({
	userId : {
		type : String,
		required : true
	},
	name : {
		type : String,
		required : true
	},
	manufacturer : {
		type : String
	},
	description : {
		type : String
	},
	mainPepper : {
		type : String
	},
	imageUrl : {
		type : String
	},
	heat : {
		type : Number,
		min : 1,
		max : 10
	},
	likes : {
		type : Number,
		min : 0
	},
	dislikes : {
		type : Number,
		min : 0
	},
	usersLiked : {
		type : [String], default: []
	},
	usersDisliked : {
		type : [String], default: []
	},
});

sauceSchema.plugin(sanitizerPlugin);
module.exports = mongoose.model('sauces', sauceSchema);