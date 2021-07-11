// the "resource template"
const Sauce = require('../models/sauce.model');

// file system
const fs = require('fs');

// Creates a sauce
// the body should contain the properties required to create a new database entry
exports.create = (req, res, next) => {
	const sauceObject = JSON.parse(req.body.sauce);
	delete req.body._id;
	const sauce = new Sauce({
		...sauceObject,
		imageUrl : `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
		likes: 0,
		dislikes: 0,
		usersLiked: [],
		usersDisliked: []
	});
	// this actually register the entry in the database
	sauce.save()
		// on success, sens a "201" (object created) status to the front
		.then(() => {
			res.status(201).json({message : 'sauce registered'})
		})
		// on error ... send the error to the front (caring is sharing :D)
		.catch(e => res.status(400).json({e}));
}

// a function used as callback for fs.unlink to display potential errors or success
function removeFileCallback (err) { 
    if(err) console.log("unabled to remove file", err);
    else console.log("file deleted");
}

// Update the specified sauce (by sauce Id)
exports.editSauce = (req, res, next) => {

	// new image ? -> remove old one (if any)
	if (req.file){
		Sauce.findOne( { _id: req.params.id})
		.then(sauce => {
			// remove old image
			const filename = sauce.imageUrl.split('/images/')[1];
			if (filename!="" && filename!=req.file.filename){
				// delete the old image
				fs.unlink( `images/${filename}`, removeFileCallback);
			}
		})
		.catch(e => console.log({e}));
	}

	// updates sauce and replaces the image ?
	const sauceObject = req.file ?
	{	// parse the req.body.sauce content and happens the imageurl
		...JSON.parse(req.body.sauce),
		imageUrl : `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
	} : 
	//else, parameters of sauceObject is the body of the request
	{...req.body};
	
	// update the database entry with the new data.
	Sauce.updateOne( { _id : req.params.id}, { ...sauceObject, _id: req.params.id} )
	.then(() => res.status(200).json({message : "Sauce modified"}))
	.catch(e => res.status(404).json({e}));
}

// GET all sauces
exports.getSauces = (req, res, next) => {
	// find all resources in the database
	Sauce.find()
	// returns all elements
	.then(sauces => res.status(200).json(sauces))
	// or ... an error message
	.catch(e => res.status(400).json({e}));
}

// GET the specified sauce (by its Id)
exports.getOneSauce = (req, res, next) => {
	// returns the found sauce ... if found
	Sauce.findOne({ _id : req.params.id})
	.then(sauce => res.status(200).json(sauce))
	.catch(e => res.status(404).json({e}));
}

// DELETE the specified sauce (by Id)
exports.deleteSauce = (req, res, next) => {
	Sauce.findOne( { _id: req.params.id})
	// if sauce found
	.then(sauce => {
		// if the sauce contains an image, we must remove it from drive.
		const filename = sauce.imageUrl.split('/images/')[1];
		if (filename){
			// delete the image
			fs.unlink( `images/${filename}`, () => {
				// remove the entry from the database
				Sauce.deleteOne( { _id: req.params.id} )
				.then( () => res.status(200).json({message : "sauce removed"}))
				.catch(e => res.status(404).json({e}));
			});
		};
	})
	.catch(e => res.status(500).json({e}))
}

// a function to find the position of a userId in an array of userIds
// returns : the position (in the range [0, array.length[ )
//			-1 if id not found
function arrayContains(a, v){
	for (let i=0; i<a.length; i++){ if (a[i]==v)return i; }
	return -1;
}

// Like a sauce
exports.likeSauce = (req, res, next) => {
	// let's find the database entry for this sauce
	Sauce.findOne( { _id: req.params.id})
	.then(sauce => {
		// register variables for later use
		const userId = req.body.userId,
			likeValue = req.body.like;

		let arrL = sauce.usersLiked,
			arrD = sauce.usersDisliked,
			lLikes =sauce.likes,
			lDislikes = sauce.dislikes; 
		
		// a function to remove a like/dislike
		let removeRate = function(pArr, pUserId, pRates){
			// remove user from rates-array (if present)
			let lPos = arrayContains(pArr,pUserId);
			if (lPos>=0) {
				// removes from users"Rated" (usersLiked/usersDisliked)
				pArr.splice(lPos,1);
				// also removes a Rate
				pRates = pRates>0 ? pRates-1 : 0;
			}
			// returns the new rate
			return pRates;
		}

		// a function to add a like/dislike
		let addRate = function(pArr, pUserId, pRates){
			// add user from rates-array (if not already present)
			let lPos = arrayContains(pArr,pUserId);
			if (lPos==-1) {
				// add user to users"Rated" (usersLiked/usersDisliked)
				pArr = pArr.push(pUserId);
				// increase likes
				pRates ++;
			}
			// returns the new rate
			return pRates;
		}
		
		// likeValue is sent by the front to add or remove a like
		// -1 means we add a dislike
		// 1 means we add a like
		// 0 means we remove the previous rating.
		// while the front is supposed to act as mentionned, we should probably remove old state
		// even if we go from a "-1" to a "1" state (so we don't forget a userId in the "opposite" rating)
		if (likeValue>0){
			// removes user from dislikes and update dislikes count
			lDislikes = removeRate(arrD, userId,lDislikes);
			// if user does not already like
			lLikes = addRate(arrL, userId, lLikes);
		}else if (likeValue<0){
			// remove user from likes and update dislikes count
			lLikes = removeRate(arrL, userId,lLikes);
			// if user does not alreay like
			lDislikes = addRate(arrD, userId, lDislikes);
		} else {
			// remove user from dislikes and update dislikes count
			lDislikes = removeRate(arrD, userId,lDislikes);
			// remove user from likes and update dislikes count
			lLikes = removeRate(arrL, userId,lLikes);
		}

		// we'll update the data if it's modified.
		if (sauce.dislikes!=lDislikes || sauce.likes!=lLikes) {
			
			Sauce.updateOne(
				{
					_id : req.params.id
				},
				{
					likes			: lLikes,
					dislikes		: lDislikes,
					usersLiked		: arrL,
					usersDisliked	: arrD
				}
			)
			.then(() => res.status(200).json({message : `you (${userId}) rated a value of ${likeValue} now sauce is rated ${sauce.likes}`}))
			.catch(e => res.status(500).json(e));
		}else{
			res.status(200).json("no modification");
		}
	})
	.catch(e => res.status(404).json(e));
}
