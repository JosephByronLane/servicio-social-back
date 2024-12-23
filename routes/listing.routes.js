const express = require('express');
const { createListing, getListingById, getListings, deleteListingById, deleteListingByEmail, searchListingByTitle, searchListings } = require('../controllers/listing.controller');
const { validateHouse } = require('../validators/house.validator');
const validateResult = require('../middleware/resultValidator.middleware');
const { validateListing } = require('../validators/listing.validator');
const { validateOwner } = require('../validators/ownerValidator');
const { validateServices } = require('../validators/service.validator');
const { validateId } = require('../validators/id.validator');
const { validateEmail } = require('../validators/email.validator');
const { validateNameParam } = require('../validators/nameParam.validator');
const validateSearch = require('../validators/search.validator');
const { createTempId, uploadImages, initiateUpload } = require('../controllers/image.controller');
const router = express.Router();
const uploadMiddleware = require('../middleware/upload.middleware');

router.post('/', validateHouse('house.'), validateListing('listing.'), validateOwner('owner.', {checkUnique:false}), validateServices(''), validateResult,  createListing);
router.get('/:id', validateId, validateResult, getListingById);
router.get('/',validateSearch, validateResult ,searchListings);

router.delete('/delete', deleteListing);


module.exports = router;
