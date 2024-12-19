const express = require('express');
const router = express.Router();
const { createOwner, getOwners, getOwnerById, getOwnerByEmail, deleteOwner} = require("../controllers/owner.controller");
const { validateId } = require('../validators/idValidator');
const validateResult = require('../middleware/resultValidator');
const { validateEmail } = require('../validators/emailValidator');
const { validateService } = require('../validators/serviceValodator');
const checkUniqueField = require('../middleware/checkUniqueField');
const { Service } = require('../models');
const { createService } = require('../controllers/service.controller');


router.post('/', validateService, validateResult, checkUniqueField(Service,'name'),createService);
// router.get('/', getOwners);

// router.get('/:id', validateId, validateResult , getOwnerById);
// router.get('/email/:email', validateEmail, validateResult ,getOwnerByEmail);

// router.delete('/:id', validateId,validateResult , deleteOwner);

module.exports = router;
