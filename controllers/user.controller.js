const mongoose = require('mongoose');
const { Types: { ObjectId } } = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const dotenv = require('dotenv');

const { HttpCodes } = require('../assets/constants');
const User = require('../models/User');

async function loginUser(req, res) {
  const { email, password } = req.body;
  const user = await User.findOne({
    email
  })

  if (!user) {
    return res.status(HttpCodes.NOT_AUTORIZED).json({"message": "Not authorized"});
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(HttpCodes.NOT_AUTORIZED).json({"message": "Not authorized"});
  }

  const token = await jwt.sign({
    userID: user._id,
  }, process.env.JWT_SECRET);

  await User.findOneAndUpdate({email}, { $set: { token } }, {
   new: true
 });

  return res.status(HttpCodes.CREATED).json({"token": token,
  "user": {
    "email": email,
    "subscription": "free"
  }});
} 

async function checkToken(req, res, next) {
  const header = req.get('Authorization');

  if (!header) {
    return res.status(HttpCodes.NOT_AUTORIZED).json({"message": "Not authorized"});
  }

  const token = header.replace('Bearer', '');

  try {
    const payload = await jwt.verify(token, process.env.JWT_SECRET);
    const { userId } = payload;
    const user = User.findUserById(userId);

    if (!user) {
       return res.status(HttpCodes.NOT_AUTORIZED).json({"message": "Not authorized"});
    }

    req.user = user;
    next();

  } catch (err) {
    return res.status(HttpCodes.NOT_AUTORIZED).json({"message": "Not authorized"});
  }

}

async function logoutUser(req, res) {
  const user = req.user;
  if (!user) {
    return res.status(HttpCodes.NOT_AUTORIZED).json({"message": "Not authorized"});
  }
  const header = req.get('Authorization');
  header.length = 0;

  return res.status(HttpCodes.NO_CONTENT).json({"message": "You're loged out"});
}

async function getUser(req, res) {
  const user = req.user;

   if (!user) {
    return res.status(HttpCodes.NOT_AUTORIZED).json({"message": "Not authorized"});
  }

  res.status(HttpCodes.OK).json({
  "email": user.email,
  "subscription": user.subscription
})
}

async function createUser(req, res) {
  try {
    const { body } = req;
    const hashPassword = await bcrypt.hash(body.password, 14);
    const doubleUser = await User.findOne({ email: body.email })
    if (doubleUser) {
      return res.status(HttpCodes.BAD_REQUEST).json({"message": "Email in use"});
    }
    const newUser = await User.create({
      ...body,
      password: hashPassword,
      token: ''
    });
  res.status(HttpCodes.CREATED).json(newUser);
  } catch (err) {
    res.status(400).send({'message': 'Something went wrong'})
  }
}

function validationUser(req, res, next) {
  const validationRules = Joi.object({
    name: Joi.string(),
    email: Joi.string().required(),
    password: Joi.string().required()
  })
  
  const validationResult = validationRules.validate(req.body);
  
  if (validationResult.error) {
    return res.status(HttpCodes.BAD_REQUEST).send({"message":validationResult.error.details[0].message})
  }
  next();
} 

module.exports = {
  createUser,
  validationUser,
  loginUser,
  checkToken,
  logoutUser,
  getUser
}