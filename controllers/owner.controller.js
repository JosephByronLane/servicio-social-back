const { Owner } = require('../models');

const createOwner = async (req, res) => {
  try {
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({ message: 'Please provide owner details' });
    }

    const { firstName, lastName, email, telephone } = req.body;

    if (firstName=null){
        return res.status(400).json({ message: 'First name is required' });
    }
    if (lastName=null){
        return res.status(400).json({ message: 'Last name is required' });
    }
    if (email=null){
        return res.status(400).json({ message: 'Email is required' });
    }
    if (telephone=null){
        return res.status(400).json({ message: 'Telephone is required' });
    }

    const owner = await Owner.create({ firstName, lastName, email, telephone });
    res.status(201).json(owner);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to create owner', error: error.message });
  }
};

const getOwners = async (req, res) => {
  try {
    const owners = await Owner.findAll();
    res.json(owners);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to retrieve owners', error: error.message });
  }
};


module.exports = {
  createOwner,
  getOwners,
};
