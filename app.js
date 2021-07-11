// - IMPORTS ENVIRONMENT -

	// express library makes node server easier to build
	const express = require('express');

	// security toolkit
	const helmet = require("helmet");

	// manage configuration "constants"
	const dotenv = require('dotenv');

	// files and directories utilities
	const path = require('path');

	// "load" configuration files
	dotenv.config({path:'./config/.env'});
	

// - DATABASE CONNECTION -

	require('./config/db');


// - CREATES APP AND STACK REQUEST LAYERS -

	// creates an express instance
	const app = express();
	
	// apply security layer
	app.use(helmet());

	// Enables cross-origin
	app.use((req, res, next) => {
		res.setHeader('Access-Control-Allow-Origin', '*');
		res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
		res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
		next();
	});

	
// - MANAGES ROUTES -
	
	// import routes for collections
	const userRoutes = require('./routes/user.routes');
	const sauceRoutes = require('./routes/sauce.routes');

	// for url parameters
	app.use(express.urlencoded({extended:true}));
	// for POST/PUT request -> used to decode req.body content
	app.use(express.json());
	
	// Manage Image files
	app.use('/images', express.static(path.join(__dirname,'images')));

	// Routes
	app.use('/api/auth', userRoutes);
	app.use('/api/sauces', sauceRoutes);


module.exports = app;