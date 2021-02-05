const path = require('path');
const { promises: fsPromises } = require('fs');
const { v4: uuidv4 } = require('uuid');

const contactsPath = path.join(__dirname, 'db', 'contacts.json');


function listContacts() {
  
  fsPromises.readFile(contactsPath, 'utf-8')
    .then(data => console.table(data))
  
}

function getContactById(contactId) {
  fsPromises.readFile(contactsPath, 'utf-8')
    .then(data => {
      const contacts = JSON.parse(data);
      const contact = contacts.filter(contact => contact.id === contactId)
      console.log(contact);
    })
  .catch(err => console.log(err))
}

function removeContact(contactId) {
  fsPromises.readFile(contactsPath, 'utf-8')
    .then(data => {
      const newContacts = JSON.parse(data).filter(contact => contact.id !== contactId)
      // console.log(newArr);
      fsPromises.writeFile(contactsPath, JSON.stringify(newContacts))
    })
    .catch(err => console.log(err))
}

function addContact(name, email, phone) {
  fsPromises.readFile(contactsPath, 'utf-8')
    .then(data => {
      const newArr = JSON.parse(data);
      const newContact = {id:11, name, email, phone }
      newArr.push(newContact)
      fsPromises.writeFile(contactsPath, JSON.stringify(newArr))
    })
    .catch(err => console.log(err))
}

function updateContact(contactId, body) {
  
}


module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
}