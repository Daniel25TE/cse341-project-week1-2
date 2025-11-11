const mongodb = require('../data/database');
const ObjectId = require('mongodb').ObjectId;

const getAll = async (req, res) => {
  try {
    const contacts = await mongodb
      .getDatabase()
      .db()
      .collection('contacts')
      .find()
      .toArray();

    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(contacts);
  } catch (err) {
    console.error('Error retrieving contacts:', err);
    res.status(500).json({ message: 'Failed to retrieve contacts' });
  }
};

const getSingle = async (req, res) => {
  if (!ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: 'Must use a valid contact ID to find a contact.' });
  }

  const userId = new ObjectId(req.params.id);

  try {
    const contact = await mongodb
      .getDatabase()
      .db()
      .collection('contacts')
      .find({ _id: userId })
      .toArray();

    if (!contact || contact.length === 0) {
      return res.status(404).json({ message: 'Contact not found.' });
    }

    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(contact[0]);
  } catch (err) {
    console.error('Error fetching contact:', err);
    res.status(500).json({ message: 'Failed to retrieve contact.' });
  }
};

const createContact = async (req, res) => {
  const contact = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    favoriteColor: req.body.favoriteColor,
    birthday: req.body.birthday,
  };
  const response = await mongodb
    .getDatabase()
    .db()
    .collection('contacts')
    .insertOne(contact);
  if (response.acknowledged) {
    res.status(201).json({
      message: 'Contact created successfully',
      contactId: response.insertedId,
    });
  } else {
    res
      .status(500)
      .json(response.error || 'Some error occurred while inserting the user.');
  }
};

const updateContact = async (req, res) => {
  if (!ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: 'Must use a valid contact ID to find a contact.' });
  }

  const userId = new ObjectId(req.params.id);
  const contact = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    favoriteColor: req.body.favoriteColor,
    birthday: req.body.birthday,
  };
  const response = await mongodb
    .getDatabase()
    .db()
    .collection('contacts')
    .replaceOne({ _id: userId }, contact);
  if (response.modifiedCount > 0) {
    res.status(200).json({ message: 'Contact updated successfully' });
  } else {
    res
      .status(500)
      .json(response.error || 'Some error occurred while updating the user.');
  }
};

const deleteContact = async (req, res) => {
  if (!ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: 'Must use a valid contact ID to find a contact.' });
  }

  const userId = new ObjectId(req.params.id);
  const response = await mongodb
    .getDatabase()
    .db()
    .collection('contacts')
    .deleteOne({ _id: userId });
  if (response.deletedCount > 0) {
    res.status(200).json({ message: 'Contact deleted successfully' });
  } else {
    res
      .status(500)
      .json(response.error || 'Some error occurred while deleting the user.');
  }
};

module.exports = {
  getAll,
  getSingle,
  createContact,
  updateContact,
  deleteContact,
};
