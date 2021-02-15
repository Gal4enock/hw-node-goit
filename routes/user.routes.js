const express = require('express');
const router = express.Router();

const { findUserById, findUserByEmail, createUser, validationUser, loginUser, checkToken, logoutUser } = require('../controllers/user.controller');

router.post('/register',validationUser, createUser);
router.post('/login',checkToken, loginUser);
router.post('/logout',checkToken, logoutUser );

module.exports = router;