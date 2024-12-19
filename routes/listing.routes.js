const express = require('express');
const { createListing } = require('../controllers/listing.controller');
const { validateHouse } = require('../validators/house.validator');
const validateResult = require('../middleware/resultValidator.middleware');
const { validateListing } = require('../validators/listing.validator');
const { validateOwner } = require('../validators/ownerValidator');
const router = express.Router();

router.post('/', validateHouse('house.'), validateListing('listing.'), validateOwner('owner.'), validateResult,  createListing);


module.exports = router;
