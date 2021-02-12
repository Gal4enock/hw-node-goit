const mongoose = require('mongoose');
const { Types: { ObjectId } } = require('mongoose');
const Joi = require('joi');
const dotenv = require('dotenv');

const { HttpCodes } = require('../assets/constants');
const Contact = require('../models/Contact');

dotenv.config();

const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_NAME = process.env.DB_NAME;

const MONGO_URL = `mongodb+srv://JonhSnow:${DB_PASSWORD}@cluster0.heyeb.mongodb.net/${DB_NAME}?retryWrites=true&w=majority`;

start();

function start() {
 const connection = mongoose.connect(MONGO_URL, {
   useUnifiedTopology: true 
  });
  connection
    .then(() => { console.log("Database connection successful") })
    .catch((err) => {
      console.log(`Server not running. Error message: ${err.message}`)
      process.exit(1)
    }
  );
}

async function listContacts(req, res) {
    const contacts = await Contact.find();
  res.status(HttpCodes.OK).json(contacts);
}

async function getContactById(req, res) {
  const { contactId } = req.params;

  if (!ObjectId.isValid(contactId)) {
  return res.status(400).send({'message': 'Your Id is not valid'})
  }
  
  const contact = await Contact.findById(contactId);

  if (!contact) {
    return res.status(HttpCodes.NOT_FOUND).json({ "message": "Not found" })
  }

  res.status(HttpCodes.OK).json(contact)
}

async function removeContact(req, res) {
  const { contactId } = req.params;

 if (!ObjectId.isValid(contactId)) {
  return res.status(400).send({'message': 'Your Id is not valid'})
}

  const deletedContact = await Contact.findByIdAndDelete(contactId);

  if (!deletedContact) {
    return res.status(HttpCodes.NOT_FOUND).json({ "message": "Not found" })
  }
  res.status(HttpCodes.OK).json({ "message": `contact ${deletedContact.name} deleted` });
}

async function addContact(req, res) {
  try {
  const { body } = req;
  const newContact = await Contact.create(body);
  res.status(HttpCodes.CREATED).json(newContact);
  } catch (err) {
    res.status(400).send({'message': 'Something went wrong'})
  }
}

async function updateContact(req, res) {
  const { body } = req;
  const { contactId } = req.params;

  if (!body) {
    return res.status(HttpCodes.BAD_REQUEST).json({"message": "missing fields"})
  }

  if (!ObjectId.isValid(contactId)) {
  return res.status(400).send({'message': 'Your Id is not valid'})
}

 const contactToChange = await Contact.findByIdAndUpdate(contactId, body, {
   new: true
 })
  
 if (!contactToChange) {
        return res.status(HttpCodes.NOT_FOUND).json({ "message": "Not found" })
      }

  res.status(HttpCodes.OK).json(contactToChange);

}

function validationUpdate(req, res, next) {
  const validationRules = Joi.object({
    name: Joi.string(),
    email: Joi.string(),
    phone: Joi.number()
  }).min(1)
  
  const validationResult = validationRules.validate(req.body);
  
  if (validationResult.error) {
    return res.status(HttpCodes.BAD_REQUEST).send({"message":validationResult.error.details[0].message})
  }
  next();
} 

function validation(req, res, next) {
  const validationRules = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().required(),
    phone: Joi.number().required()
  })
  
  const validationResult = validationRules.validate(req.body);
  
  if (validationResult.error) {
    return res.status(HttpCodes.BAD_REQUEST).send({"message":validationResult.error.details[0].message})
  }
  next();
} 

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
  validation,
  validationUpdate
}