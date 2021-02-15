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
} 

async function findUserById(req, res) {
  const { userId } = req.params;

  if (!ObjectId.isValid(userId)) {
  return res.status(400).send({'message': 'Your Id is not valid'})
  }
  
  const user = await User.findById(userId);

  if (!user) {
    return res.status(HttpCodes.NOT_FOUND).json({ "message": "Not found" })
  }

  res.status(HttpCodes.OK).json(user)
}

async function findUserByEmail(req, res) {
  const { email } = req.params;
  
  const user = await User.findOne({email});

  if (!user) {
    return res.status(HttpCodes.NOT_FOUND).json({ "message": "Not found" })
  }

  res.status(HttpCodes.OK).json(user)
}

async function createUser(req, res) {
  try {
    const { body: {email, password} } = req;
    const hashPassword = await bcrypt.hash(password, 14);
    const doubleUser = await User.findOne({ email })
    if (doubleUser) {
      return res.status(HttpCodes.BAD_REQUEST).json({"message": "Email in use"});
    }
    const newUser = await User.create({
      ...body,
      password: hashPassword
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
  findUserById,
  findUserByEmail,
  createUser,
  validationUser,
  loginUser
}