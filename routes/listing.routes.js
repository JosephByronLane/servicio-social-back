const express = require('express');
const { createListing, getListingById, getListings, deleteListingById, deleteListingByEmail } = require('../controllers/listing.controller');
const { validateHouse } = require('../validators/house.validator');
const validateResult = require('../middleware/resultValidator.middleware');
const { validateListing } = require('../validators/listing.validator');
const { validateOwner } = require('../validators/ownerValidator');
const { validateServices } = require('../validators/service.validator');
const { validateId } = require('../validators/id.validator');
const { validateEmail } = require('../validators/email.validator');
const router = express.Router();

//TODO: add image validation
router.post('/', validateHouse('house.'), validateListing('listing.'), validateOwner('owner.', {checkUnique:false}), validateServices(''), validateResult,  createListing);
router.get('/:id', validateId, validateResult, getListingById);
router.get('/', getListings);

router.delete('/:id', validateId, validateResult, deleteListingById);
router.delete('/email/:email', validateEmail, validateResult, deleteListingByEmail);
module.exports = router;
