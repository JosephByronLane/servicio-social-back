const { Owner } = require('../models');

const { validationResult } = require('express-validator');



const createOwner = async (req, res) => {
  try {
    const { firstName, lastName, email, telephone } = req.body;

    const owner = await Owner.create({ firstName, lastName, email, telephone });
    res.status(201).json(owner);
  } catch (error) {
    console.error('Error creating owner:', error);

    //owner with email already exists
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ 
        message: 'Owner with this email already exists.', 
        error: error.errors.map(e => e.message) 
      });
    }

    //other errors
    res.status(500).json({ message: 'Failed to create owner', error: error.message });
  }
};

const getOwners = async (req, res) => {
  try {
    const owners = await Owner.findAll();
    res.status(200).json(owners);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to retrieve owners', error: error.message });
  }
};

const getOwnerById = async (req, res) => {

  try{
    const owner = await Owner.findByPk(req.params.id);
    if(owner){
      res.json(owner);
    }else{
      res.status(404).json({message: 'Owner not found by id'});
    }
  }catch(error){
    console.error(error);
    res.status(500).json({message: 'Failed to retrieve owner', error: error.message});
  }
};

const getOwnerByEmail = async (req, res) => {

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      message: 'Validation failed', 
      errors: errors.array() 
    });
  }

  try{
    console.log("------------------ Owner by email ------------------");
    console.log(req.params.email);
    
    const owner = await Owner.findOne({where: {email: req.params.email}});

    if(owner){
      res.json(owner);
    }else{
      res.status(404).json({message: 'Owner not found by email'});
    }
  }catch(error){
    console.error(error);
    res.status(500).json({message: 'Failed to retrieve owner', error: error.message});
  }
};

//this endpoint shouldn't be needed, but ill add it just incase
const deleteOwner = async (req, res) => {
  try {
    const { id } = req.params;
    const owner = await Owner.findByPk(id);

    if (!owner) {
      return res.status(404).json({ message: 'Owner not found' });
    }

    //NOTE: since paranoid is enabled, the owner will not be actually deleted
    await owner.destroy();
    
    res.status(200).json({message: 'Owner deleted'});

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to delete owner', error: error.message });
  }
};

module.exports = {
  createOwner,
  getOwners,
  getOwnerById,
  getOwnerByEmail,
  deleteOwner
};
