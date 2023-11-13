const models = require('../models');

const { Domo } = models;

const makeDomo = async (req, res) => {
  if (!req.body.name || !req.body.age) {
    return res.status(400).json({ error: 'Both name and age are required!' });
  }

  const domoData = {
    name: req.body.name,
    type: req.body.type,
    age: req.body.age,
    owner: req.session.account._id,
  };

  try {
    const newDomo = new Domo(domoData);
    await newDomo.save();
    return res.status(201).json({ name: newDomo.name, type: newDomo.type, age: newDomo.age });
  } catch (err) {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Domo already exists!' });
    }
    return res.status(500).json({ error: 'An error occurred making domo!' });
  }
};

const makerPage = async (req, res) => res.render('app');

const getDomos = async (req, res) => {
  try {
    const query = { owner: req.session.account._id };
    const docs = await Domo.find(query).select('name age type').lean().exec();

    return res.json({ domos: docs });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Error retrieving domos!' });
  }
};

/// Delete a domo
const deleteDomo = async (req, res) => {
  try {
    // Get the query for the domo to delete
    const query = { owner: req.session.account._id, _id: req.params.id };

    // Delete the domo
    const result = await Domo.deleteOne(query).exec();

    // If the domo was not found, return a 404
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Domo not found!' });
    }

    // Otherwise, return a 204
    return res.status(204).send();

  // If an error occurred, return a 500 with an error message
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Error deleting domo!' });
  }
};

module.exports = {
  makerPage,
  makeDomo,
  getDomos,
  deleteDomo,
};
