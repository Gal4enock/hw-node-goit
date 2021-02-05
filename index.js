const argv = require('yargs').argv;
const cors = require('cors');
const express = require('express');
const { HttpCodes, PORT } = require('./constants');
const contactsRouter = require('./routs/contacts.routs');

const { listContacts, getContactById, removeContact, addContact } = require ('./contacts.js');

const app = express();
app.use(cors({
  origin: '*',
}));
app.use(express.json());
app.use('/api/contacts', contactsRouter)

app.get('/api/contacts', (req, res, next) => {
  res.json({message: 'CORS is activated'})
})

app.listen(PORT, () => {
  console.log('Listening with CORS on port..', PORT);
})


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

