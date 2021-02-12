const express = require('express');
const router = express.Router();

const { findUserById, findUserByEmail, createUser } = require('../controllers/user.controller');

router.post('/auth/register', createUser);
// router.post('/auth/login', );
// router.post('/auth/register', );