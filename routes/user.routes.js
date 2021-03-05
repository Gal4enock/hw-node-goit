const express = require('express');
const router = express.Router();

const { getUser, createUser, validationUser, loginUser, checkToken, logoutUser, changeFotos, verifyUser } = require('../controllers/user.controller');
const multer = require('multer');

// const name = 'someOne' + Date.now()

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'tmp/')
  },
  filename: function (req, file, cb) {
    cb(null, 'someOne' + Date.now() + '.png')
  }
  })
  const upload = multer({ storage })

router.post('/register',validationUser, createUser);
router.post('/login',validationUser, loginUser);
router.post('/logout', checkToken, logoutUser);
router.get('/users/current', checkToken, getUser);
router.patch('/users/avatars', checkToken, upload.single('avatar'), changeFotos);
router.get('/verify/:verificationToken', verifyUser)


module.exports = router;