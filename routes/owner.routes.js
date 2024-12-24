const express = require('express');
const router = express.Router();
const { createOwner, getOwners, getOwnerById, getOwnerByEmail, deleteOwner} = require("../controllers/owner.controller");
const { validateOwner } = require('../validators/ownerValidator');
const { validateId } = require('../validators/id.validator');
const validateResult = require('../middleware/resultValidator.middleware');
const { validateEmail } = require('../validators/email.validator');
const checkUniqueField = require('../middleware/checkUniqueField.middleware');
const { Owner } = require('../models');


router.post('/', validateOwner(''), validateResult,createOwner);

router.get('/email/:email', validateEmail(''), validateResult ,getOwnerByEmail);

router.get('/', getOwners);

router.get('/:id', validateId, validateResult , getOwnerById);

router.delete('/:id', validateId,validateResult , deleteOwner);

module.exports = router;
