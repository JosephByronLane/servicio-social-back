const express = require('express');
const { createListing, getListingById, getListings, deleteListingById, deleteListingByEmail, searchListingByTitle } = require('../controllers/listing.controller');
const { validateHouse } = require('../validators/house.validator');
const validateResult = require('../middleware/resultValidator.middleware');
const { validateListing } = require('../validators/listing.validator');
const { validateOwner } = require('../validators/ownerValidator');
const { validateServices } = require('../validators/service.validator');
const { validateId } = require('../validators/id.validator');
const { validateEmail } = require('../validators/email.validator');
const { validateNameParam } = require('../validators/nameParam.validator');
const router = express.Router();

//TODO: add image validation
router.post('/', validateHouse('house.'), validateListing('listing.'), validateOwner('owner.', {checkUnique:false}), validateServices(''), validateResult,  createListing);
router.get('/:id', validateId, validateResult, getListingById);
router.get('/', getListings);
router.get('/search/:name', validateNameParam, validateResult, searchListingByTitle);

router.delete('/:id', validateId, validateResult, deleteListingById);

//TODO: make some sort of JWT for when email messages about the house being down.
router.delete('/email/:email', validateEmail, validateResult, deleteListingByEmail);

module.exports = router;
