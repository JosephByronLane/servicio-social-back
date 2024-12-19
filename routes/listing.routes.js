const express = require('express');
const { createListing, getListingById, getListings } = require('../controllers/listing.controller');
const { validateHouse } = require('../validators/house.validator');
const validateResult = require('../middleware/resultValidator.middleware');
const { validateListing } = require('../validators/listing.validator');
const { validateOwner } = require('../validators/ownerValidator');
const { validateServices } = require('../validators/service.validator');
const { validateId } = require('../validators/id.validator');
const router = express.Router();

//TODO: add image validation
router.post('/', validateHouse('house.'), validateListing('listing.'), validateOwner('owner.'), validateServices(''), validateResult,  createListing);
router.get('/:id', validateId, validateResult, getListingById);
router.get('/', getListings);

module.exports = router;
