const express = require('express');
const router = express.Router();

const { findUserById, findUserByEmail, createUser, validationUser, loginUser, checkToken } = require('../controllers/user.controller');

router.post('/register',validationUser, createUser);
router.post('/login',checkToken, loginUser);
// router.post('/register', );

module.exports = router;