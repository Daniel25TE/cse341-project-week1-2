const mongodb = require('../data/database');
const ObjectId = require('mongodb').ObjectId;

const apiKey =
  'Ezl0961tEpx2UxTZ5v2uKFK91qdNAr5npRlMT1zLcE3Mg68Xwaj3N8Dyp1R8IvFenrVwHRllOUxF0Og00l0m9NcaYMtH6Bpgdv7N';

const getAll = async (req, res) => {
    if (req.header('apiKey') !== apiKey) {
    return res.status(401).json({ message: 'Invalid apiKey, please read the documentation.' });
  }
    
    const result = await mongodb.getDatabase().db().collection('contacts').find();
    result.toArray().then((contacts) => {
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(contacts);
    });

};

const getSingle = async (req, res) => {
    if (req.header('apiKey') !== apiKey) {
    return res.status(401).json({ message: 'Invalid apiKey, please read the documentation.' });
  }

    const userId = new ObjectId(req.params.id);
    const result = await mongodb.getDatabase().db().collection('contacts').find({_id: userId });
    result.toArray().then((contacts) => {
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(contacts[0]);
    });
};

const createContact = async (req, res) => {
    if (req.header('apiKey') !== apiKey) {
    return res.status(401).json({ message: 'Invalid apiKey, please read the documentation.' });
  }

    const contact = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        favoriteColor: req.body.favoriteColor,
        birthday: req.body.birthday
    };
    const response = await mongodb.getDatabase().db().collection('contacts').insertOne(contact);
    if (response.acknowledged) {
        res.status(201).json({
          message: 'Contact created successfully',
          contactId: response.insertedId
        });

    } else {
        res.status(500).json(response.error || 'Some error occurred while inserting the user.')
    }
};

const updateContact = async (req, res) => {
    if (req.header('apiKey') !== apiKey) {
    return res.status(401).json({ message: 'Invalid apiKey, please read the documentation.' });
  }

    const userId = new ObjectId(req.params.id);
    const contact = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        favoriteColor: req.body.favoriteColor,
        birthday: req.body.birthday
    };
    const response = await mongodb.getDatabase().db().collection('contacts').replaceOne({ _id: userId }, contact);
    if (response.modifiedCount > 0) {
        res.status(200).json({ message: 'Contact updated successfully' });
    } else {
        res.status(500).json(response.error || 'Some error occurred while updating the user.')
    }
};

const deleteContact = async (req, res) => {
    if (req.header('apiKey') !== apiKey) {
    return res.status(401).json({ message: 'Invalid apiKey, please read the documentation.' });
  }

    const userId = new ObjectId(req.params.id);
    const response = await mongodb.getDatabase().db().collection('contacts').deleteOne({ _id: userId });
    if (response.deletedCount > 0) {
        res.status(200).json({ message: 'Contact deleted successfully' });
    } else {
        res.status(500).json(response.error || 'Some error occurred while deleting the user.')
    }
};

module.exports = { getAll, getSingle, createContact, updateContact, deleteContact };