// ... well ... express ... bla bla bla
const express = require('express');
// the router object to redirects "commands" from the front
const router = express.Router();

// the final controller that does the stuff
const authCtrl = require('../controllers/auth.controller');


// POST/signup : Creates a new user
router.post("/signup", authCtrl.signup);
// POST/login : Log the user
router.post("/login", authCtrl.login);

module.exports = router;