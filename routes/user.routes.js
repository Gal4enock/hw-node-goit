const express = require('express');
const router = express.Router();

const { getUser, createUser, validationUser, loginUser, checkToken, logoutUser } = require('../controllers/user.controller');

router.post('/register',validationUser, createUser);
router.post('/login',validationUser, loginUser);
router.post('/logout', checkToken, logoutUser);
router.get('/users/current', checkToken, getUser)

module.exports = router;