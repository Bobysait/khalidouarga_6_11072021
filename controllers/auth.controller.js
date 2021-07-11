const BCrypt	=	require('bcrypt');
const User		=	require('../models/user.model');
const WebToken	=	require('jsonwebtoken');

// Creates a new user (th email is used as "unique" identifier)
exports.signup = (req, res, next) => {

	// encrypt password
	BCrypt.hash(req.body.password, 10)

	// on hash success -> generates the user
	.then(hash => {
		const user = new User({
			email : req.body.email,
			password : hash
		});

		// creates the user entry on the DB
		user.save()

			// marvelous, we did it.
			.then(() => res.status(201).json({message : 'new user'}))

			// something's wrong with the DB ?
			.catch(e => {
				console.log(e);
				res.status(400).json({error : e, req : req.body})
			});
	})

	// unabled to hash for some reason
	.catch(e => {
			console.log(e);
			res.status(500).json({e})
	});
}

// Log the user (body's request contains the data {email/password} for authentification)
exports.login = (req, res, next) => {

	// find the "requested" user in the DB using his "unique" email
	User.findOne( { email : req.body.email })
	.then(user => {
		// user not found ?
		if(!user){
			return res.status(401).json({message : "user not found"});
		}

		// to authentify the user, we have to compare crypted version of the passwords (the one of the request with the one on the DB)
		BCrypt.compare(req.body.password, user.password)

			// great we found a match !
			.then(valid => {
				if (!valid) {
					return res.status(401).json({message : "wrong password"});
				}

				// generates a token for the user, so he can authentify his messages on future requests
				return res.status(200).json({
					userId	: user._id,
					token	: WebToken.sign(
												{ userId: user._id },
												process.env.TOKEN_SECRET,
												{ expiresIn : '24h' }
											)
				});
			})

			// well, probable a wrong password, don't you think ?
			.catch(e => {
				console.log(e);
				res.status(500).json({e})
			});
	})

	.catch(e => {
		console.log(e);
		res.status(500).json({e})
	});
};
