const argv = require('yargs').argv;
console.log(argv);
const { listContacts, getContactById, removeContact, addContact } = require ('./contacts.js');


function invokeAction({ action, id, name, email, phone }) {
  switch (action) {
    case 'list':
      listContacts()
      break;

    case 'get':
      // contacts.getContactById(id)
      getContactById(id)
      break;

    case 'add':
      // contacts.addContact(name, email, phone)
      addContact(name, email, phone)
      break;

    case 'remove':
      removeContact(id)
      break;

    default:
      console.warn('\x1B[31m Unknown action type!');
  }
}

invokeAction(argv);