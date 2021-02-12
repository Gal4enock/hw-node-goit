const mongoose = require('mongoose');
const { Types: { ObjectId } } = require('mongoose');
const Joi = require('joi');
const dotenv = require('dotenv');

const { HttpCodes } = require('../assets/constants');
const User = require('../models/User');

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
  const { body } = req;
  const newUser = await User.save(body);
  res.status(HttpCodes.CREATED).json(newUser);
  } catch (err) {
    res.status(400).send({'message': 'Something went wrong'})
  }
}

module.exports = {
  findUserById,
  findUserByEmail,
  createUser
}