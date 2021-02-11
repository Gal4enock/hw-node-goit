const path = require('path');
const { promises: fsPromises } = require('fs');
const mongoose = require('mongoose');
const Joi = require('joi');
const { MongoClient, ObjectID } = require('mongodb');
const dotenv = require('dotenv');

const { HttpCodes } = require('../assets/constants');
const Contact = require('../models/Contact');
const contactsPath = path.join(__dirname,'../', 'db', 'contacts.json');

dotenv.config();
let contacts;

const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_NAME = process.env.DB_NAME;

const MONGO_URL = `mongodb+srv://JonhSnow:${DB_PASSWORD}@cluster0.heyeb.mongodb.net/${DB_NAME}?retryWrites=true&w=majority`;

start();

async function start() {
  await mongoose.connect(MONGO_URL, {
   useUnifiedTopology: true 
  });
  // const db = client.db();

  // contacts = db.collection('contacts')
}

async function listContacts(req, res) {
    const contacts = await Contact.find();
  res.status(HttpCodes.OK).json(contacts);

}

function getContactById(req, res) {
  const { contactId } = req.params;
  fsPromises.readFile(contactsPath, 'utf-8')
    .then(data => {
      const contacts = JSON.parse(data);
      const contact = contacts.filter(contact => contact.id == contactId);

      if (!contact.length) {
        return res.status(HttpCodes.NOT_FOUND).json({ "message": "Not found" })
      }

     res.status(HttpCodes.OK).json(contact);
    })
  .catch(err => res.status(HttpCodes.NOT_FOUND).json({"message": "Not found"}))
}

function removeContact(req, res) {
  const { contactId } = req.params;
  fsPromises.readFile(contactsPath, 'utf-8')
    .then(data => {
      const newContacts = JSON.parse(data).filter(contact => contact.id !== contactId)
      fsPromises.writeFile(contactsPath, JSON.stringify(newContacts));

      if (newContacts.length === JSON.parse(data).length) {
        return res.status(HttpCodes.NOT_FOUND).json({ "message": "Not found" })
      }

     res.status(HttpCodes.OK).json({"message": "contact deleted"});
    })
    .catch(err => console.log(err))
}

async function addContact(req, res) {
  const { body } = req;
  const newContact = await contacts.insertOne(body);
  res.status(HttpCodes.CREATED).json(newContact.ops[0]);
 
}

async function updateContact(req, res) {
  const { body } = req;
  const { contactId } = req.params;

  console.log(body);

  if (!body) {
    return res.status(HttpCodes.BAD_REQUEST).json({"message": "missing fields"})
  }

  if (!ObjectID.isValid(contactId)) {
  return res.status(400).send({'message': 'Your ID is not valid'})
}

  const contactToChange = await contacts.updateOne({
    _id: ObjectID(contactId) 
  }, {
    $set: body
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