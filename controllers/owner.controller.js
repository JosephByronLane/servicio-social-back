const { Owner } = require('../models');

const { body, validationResult } = require('express-validator');

//validation rules for owner creation
const validateOwner = [
  body('firstName').notEmpty().withMessage('First name is required'),
  body('lastName').notEmpty().withMessage('Last name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('telephone').notEmpty().withMessage('Telephone is required'),
];

const createOwner = async (req, res) => {

  
const errors = validationResult(req);
if (!errors.isEmpty()) {
  return res.status(400).json({ 
    message: 'Validation failed', 
    errors: errors.array() 
  });
}

try {
  const { firstName, lastName, email, telephone } = req.body;
  const owner = await Owner.create({ firstName, lastName, email, telephone });
  res.status(201).json(owner);
} catch (error) {
  console.error('Error creating owner:', error);

  // Handle unique constraint errors (e.g., duplicate email)
  if (error.name === 'SequelizeUniqueConstraintError') {
    return res.status(400).json({ 
      message: 'Owner with this email already exists.', 
      error: error.errors.map(e => e.message) 
    });
  }

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
