const express = require('express');
const router = express.Router();
const { createOwner, getOwners, getOwnerById, getOwnerByEmail, deleteOwner} = require("../controllers/owner.controller");
const { validateOwner } = require('../validators/ownerValidator');
const { validateId } = require('../validators/idValidator');
const validateResult = require('../middleware/resultValidator');
const { validateEmail } = require('../validators/emailValidator');
const checkUniqueField = require('../middleware/checkUniqueField');
const { Owner } = require('../models');


router.post('/', validateOwner(''), validateResult,createOwner);
router.get('/', getOwners);

router.get('/:id', validateId, validateResult , getOwnerById);
router.get('/email/:email', validateEmail, validateResult ,getOwnerByEmail);

router.delete('/:id', validateId,validateResult , deleteOwner);

module.exports = router;
