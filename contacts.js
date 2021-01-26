const path = require('path');
const fs = require('fs');

const contactsPath = path.join(__dirname, 'db', 'contacts.json');


function listContacts() {
  
  fs.readFile(contactsPath,
    'utf-8',
    (err, data) => {
      if (err) throw err;
      console.log(data);
    })
}

function getContactById(contactId) {
  // ...твой код
}

function removeContact(contactId) {
  // ...твой код
}

function addContact(name, email, phone) {
  fs.readFile(contactsPath,
    'utf-8',
    (err, data) => {
      if (err) throw err;
      
      fs.writeFile(
        contactsPath,
        "utf-8",
        `${data.toString()}`
      )
    })
}

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact
}