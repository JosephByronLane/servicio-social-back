const express = require('express');
const { getHouses, createHouse, getHousesByOwnerId, getHousesByOwnerEmail, deleteHouseById, getHouseById } = require("../controllers/house.controller");
const validateResult = require("../middleware/resultValidator.middleware");
const { validateEmail } = require("../validators/email.validator");
const { validateHouse } = require("../validators/house.validator");
const { validateId } = require("../validators/id.validator");
const router = express.Router();



router.get('/', getHouses);
router.get('/owner/:id', validateId, validateResult, getHousesByOwnerId);
router.get('/email/:email', validateEmail, validateResult, getHousesByOwnerEmail);
router.get('/:id', validateId, validateResult, getHouseById);

router.post('/', validateHouse(''), validateResult ,createHouse);

router.delete('/:id', validateId, validateResult, deleteHouseById);

module.exports = router;
