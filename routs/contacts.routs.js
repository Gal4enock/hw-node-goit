const express = require('express');
const router = express.Router();

const { listContacts, getContactById, removeContact, addContact, updateContact, validation } = require ('../controllers/contacts.controller');

router.get('/', listContacts);
router.get('/:contactId', getContactById);
router.post('/',validation, addContact);
router.delete('/:contactId', removeContact);
router.patch('/:contactId', updateContact);

module.exports = router;
