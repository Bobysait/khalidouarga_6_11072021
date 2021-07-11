const webToken = require('jsonwebtoken');

// the middleware that authentify request using the token sent while user loged-in
module.exports = (req, res, next) => {
	try {
		// get the token sent
		const token = req.headers.authorization.split(' ')[1];
		// decode the token to compare with the encoded token
		const decodedToken = webToken.verify(token, process.env.TOKEN_SECRET);
		const userId = decodedToken.userId;
		// userId does not match ...
		if (req.body.userId && req.body.userId !== userId) {
			throw 'wrong User ID';
		} else {
			// user authentified, let's continue !
			next();
		}
	} catch (e) {
		res.status(401).json({
			error : e | 'unauthentified request'
		});
	}
}