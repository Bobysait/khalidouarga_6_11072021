const express = require('express');
const router = express.Router();

// every request on sauce require the user to be authentified
const auth = require("../middleware/auth");

// for image management, multer !
const multer = require("../middleware/multer-config");

// all the logic is defined on the controller
const sauceCtrl = require('../controllers/sauce.controller');

// redirects the routes for the different requests

	// Create a sauce : POST
	router.post('', auth, multer, sauceCtrl.create);

	// Update a sauce : PUT
	router.put('/:id', auth, multer, sauceCtrl.editSauce);

	// READ "all" sauce : GET
	router.get('', auth, sauceCtrl.getSauces);

	// READ "a" sauce : GET
	router.get('/:id', auth, sauceCtrl.getOneSauce);

	// DELETE a sauce
	router.delete('/:id', auth, sauceCtrl.deleteSauce);

	// POST like/dislike a sauce
	router.post('/:id/like', auth, sauceCtrl.likeSauce);
	
module.exports = router;