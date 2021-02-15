const express = require('express');
const router = express.Router();

const { findUserById, findUserByEmail, createUser, validationUser, loginUser } = require('../controllers/user.controller');

router.post('/register',validationUser, createUser);
router.post('/login', loginUser);
// router.post('/register', );

module.exports = router;