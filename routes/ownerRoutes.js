const express = require('express');
const { createOwner, getOwners, getOwnerById, getOwnerByEmail, deleteOwner } = require('../controllers/owner.controller');
const validateResult = require('../middleware/resultValidator');
const checkUniqueField = require('../middleware/checkUniqueField');
const { Owner } = require('../models');

const router = express.Router();

router.post(
  '/owners',
  validateResult,
  checkUniqueField(Owner, 'email'),
  createOwner
);
router.get('/owners', getOwners);
router.get('/owners/:id', getOwnerById);
router.get('/owners/email/:email', getOwnerByEmail);
router.delete('/owners/:id', deleteOwner);

module.exports = router;