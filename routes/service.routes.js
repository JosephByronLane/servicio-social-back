const express = require('express');
const router = express.Router();
const { validateId } = require('../validators/id.validator');
const validateResult = require('../middleware/resultValidator');
const { validateNameeBody } = require('../validators/nameBody.validator');
const checkUniqueField = require('../middleware/checkUniqueField');
const { Service } = require('../models');
const { createService, getServices, getServiceById, getServiceByName, deleteServiceById, deleteServiceByName } = require('../controllers/service.controller');
const { validateNameParam } = require('../validators/nameParam.validator');


router.post('/', validateNameeBody, validateResult,createService);
router.get('/', getServices);

router.get('/:id', validateId, validateResult , getServiceById);
router.get('/name/:name', validateNameParam, validateResult ,getServiceByName);

//hide routes to protect front-end guys
//router.delete('/:id', validateId, validateResult , deleteServiceById);
//outer.delete('/name/:name', validateNameParam, validateResult ,deleteServiceByName);

module.exports = router;
