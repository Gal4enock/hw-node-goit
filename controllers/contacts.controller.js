const path = require('path');
const { promises: fsPromises } = require('fs');
const { v4: uuidv4 } = require('uuid');
const Joi = require('joi');

const { HttpCodes } = require('../assets/constants');

const contactsPath = path.join(__dirname,'../', 'db', 'contacts.json');


function listContacts(req, res) {
  (fsPromises.readFile(contactsPath, 'utf-8')
    .then(data => res.status(HttpCodes.OK).json(data)))
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

function addContact(req, res) {
  const { name, email, phone } = req.body;

  fsPromises.readFile(contactsPath, 'utf-8')
  .then(data => {
    const newArr = JSON.parse(data);
    const newContact = {id:uuidv4(), name, email, phone }
    newArr.push(newContact)
    fsPromises.writeFile(contactsPath, JSON.stringify(newArr))
    res.status(HttpCodes.CREATED).json(newContact);
  })
  .catch(err => console.log(err))
}

function updateContact(req, res) {
  const { body } = req;
  const { contactId } = req.params;


  if (!body.length) {
    return res.status(HttpCodes.BAD_REQUEST).json({"message": "missing fields"})
  }

  fsPromises.readFile(contactsPath, 'utf-8')
    .then(data => {
      const newContacts = JSON.parse(data).map(contact => {
       return contact = contact.id == contactId ? { ...contact, ...body } : contact; 
        }
      )
      const contactToChange = newContacts.filter(contact => contact.id == contactId)

      fsPromises.writeFile(contactsPath, JSON.stringify(newContacts));

      if (!contactToChange.length) {
        return res.status(HttpCodes.NOT_FOUND).json({ "message": "Not found" })
      }

     res.status(HttpCodes.OK).json(contactToChange);
    })
    .catch(err => console.log(err))

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