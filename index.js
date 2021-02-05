const argv = require('yargs').argv;
const cors = require('cors');
const express = require('express');

const PORT = process.env.PORT || 3000;
const app = express();
app.use(cors());

app.get('/', (req, res, next) => {
  res.json({message: 'CORS is activated'})
})

app.listen(PORT, () => {
  console.log('Listening with CORS on port..', PORT);
})

const { listContacts, getContactById, removeContact, addContact } = require ('./contacts.js');

// function invokeAction({ action, id, name, email, phone }) {
//   switch (action) {
//     case 'list':
//       listContacts()
//       break;

//     case 'get':
//       // contacts.getContactById(id)
//       getContactById(id)
//       break;

//     case 'add':
//       // contacts.addContact(name, email, phone)
//       addContact(name, email, phone)
//       break;

//     case 'remove':
//       removeContact(id)
//       break;

//     default:
//       console.warn('\x1B[31m Unknown action type!');
//   }
// }

// invokeAction(argv);

