const express = require('express');
const router = express.Router();

const contactsController = require('../controllers/contacts');
const { saveContact } = require('../middleware/validate');

router.get('/', contactsController.getAll);

router.get('/:id', contactsController.getSingle);

router.post('/', saveContact, contactsController.createContact);

router.put('/:id', saveContact, contactsController.updateContact);

router.delete('/:id', contactsController.deleteContact);

module.exports = router;
