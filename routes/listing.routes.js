const express = require('express');
const { createListing } = require('../controllers/listing.controller');
const { validateHouse } = require('../validators/house.validator');
const validateResult = require('../middleware/resultValidator');
const router = express.Router();

router.post('/', validateHouse('house.'), validateResult, createListing);


module.exports = router;
