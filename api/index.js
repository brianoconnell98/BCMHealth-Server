const { Router } = require("../Helpers_and_Prerequisites/libs_required");

const express = require("../Helpers_and_Prerequisites/libs_required"),
router = express.Router();

// Home Page
router.get('/', (req, res) => res.send('index.html'));

//These ones down aren't 100% correct yet 1:18:25
// Dashboard page
router.get('/dashboard', (req, res) => res.render('dashboard'));

// This is designed for basic routing like login/register/dashboard/etc
// Login Page
router.get('/login', (req, res) => res.render('Login'));

// Register Page
router.get('/register', (req, res) => res.render('Register'));

module.exports = router;